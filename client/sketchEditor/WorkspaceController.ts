namespace SketchEditor {

    export class WorkspaceController {

        static TEXT_CHANGE_RENDER_THROTTLE_MS = 500;
        static BLOCK_BOUNDS_CHANGE_THROTTLE_MS = 500;

        defaultSize = new paper.Size(50000, 40000);
        defaultScale = 0.02;

        canvas: HTMLCanvasElement;
        project: paper.Project;
        fallbackFont: opentype.Font;
        viewZoom: paperExt.ViewZoom;

        private store: Store;
        private _sketch: Sketch;
        private _textBlockItems: { [textBlockId: string]: TextWarp } = {};

        constructor(store: Store, fallbackFont: opentype.Font) {
            this.store = store;
            this.fallbackFont = fallbackFont;
            paper.settings.handleSize = 1;

            this.canvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
            paper.setup(this.canvas);
            this.project = paper.project;
            window.onresize = () => this.project.view.draw();

            const canvasSel = $(this.canvas);
            store.events.mergeTyped(
                store.events.sketch.loaded,
                store.events.sketch.attrChanged
            ).subscribe(ev =>
                canvasSel.css("background-color", ev.data.backgroundColor)
                );

            this.viewZoom = new paperExt.ViewZoom(this.project);
            this.viewZoom.setZoomRange([
                this.defaultSize.multiply(this.defaultScale * 0.1),
                this.defaultSize.multiply(0.5)]);
            this.viewZoom.viewChanged.subscribe(bounds => {
                store.actions.editor.viewChanged.dispatch(bounds);
            });

            const clearSelection = (ev: paper.PaperMouseEvent) => {
                if (store.state.selection) {
                    store.actions.sketch.setSelection.dispatch(null);
                }
            }
            paper.view.on(paper.EventType.click, ev => {
                if (!this.project.hitTest(ev.point)) {
                    clearSelection(ev);
                }
            });
            paper.view.on(paperExt.EventType.mouseDragStart, clearSelection);

            const keyHandler = new DocumentKeyHandler(store);

            // ----- Designer -----

            store.events.editor.workspaceInitialized.sub(() => {
                this.project.view.draw();
            });

            store.events.editor.zoomToFitRequested.subscribe(() => {
                this.zoomToFit();
            });

            store.events.editor.exportSVGRequested.subscribe(() => {
                this.downloadSVG();
            });

            store.events.editor.exportPNGRequested.sub(() => {
                this.downloadPNG();
            });

            store.events.editor.snapshotExpired.sub(() => {
                const data = this.getSnapshotPNG(72);
                store.actions.editor.updateSnapshot.dispatch({
                    sketchId: this.store.state.sketch._id, pngDataUrl: data
                });
            });

            // ----- Sketch -----

            store.events.sketch.loaded.subscribe(
                ev => {
                    this._sketch = ev.data;
                    this.project.clear();
                    this.project.deselectAll();
                    this._textBlockItems = {};
                }
            );

            store.events.sketch.selectionChanged.subscribe(m => {
                this.project.deselectAll();
                if (m.data) {
                    let block = m.data.itemId && this._textBlockItems[m.data.itemId];
                    if (block && !block.selected) {
                        block.selected = true;
                    }
                }
            });

            // ----- TextBlock -----

            store.events.mergeTyped(
                store.events.textblock.added,
                store.events.textblock.loaded
            ).subscribe(
                ev => this.addBlock(ev.data));

            store.events.textblock.attrChanged
                .observe()
                .throttle(WorkspaceController.TEXT_CHANGE_RENDER_THROTTLE_MS)
                .subscribe(m => {
                    let item = this._textBlockItems[m.data._id];
                    if (item) {
                        const textBlock = m.data;
                        item.text = textBlock.text;
                        item.customStyle = {
                            fillColor: textBlock.textColor,
                            backgroundColor: textBlock.backgroundColor
                        }
                    }
                });

            store.events.textblock.fontReady.sub(data => {
                const item = this._textBlockItems[data.textBlockId];
                if (item) {
                    item.font = data.font;
                }
            })

            store.events.textblock.removed.subscribe(m => {
                let item = this._textBlockItems[m.data._id];
                if (item) {
                    item.remove();
                    delete this._textBlockItems[m.data._id];
                }
            });

            store.events.textblock.editorClosed.subscribe(m => {
                let item = this._textBlockItems[m.data._id];
                if (item) {
                    item.updateTextPath();
                }
            })
        }

        zoomToFit() {
            const bounds = this.getViewableBounds();
            this.viewZoom.zoomTo(bounds.scale(1.2));
        }

        private getViewableBounds(): paper.Rectangle {
            let bounds: paper.Rectangle;
            _.forOwn(this._textBlockItems, (item) => {
                bounds = bounds
                    ? bounds.unite(item.bounds)
                    : item.bounds;
            });
            if (!bounds) {
                bounds = new paper.Rectangle(new paper.Point(0, 0),
                    this.defaultSize.multiply(this.defaultScale));
            }
            return bounds;
        }

        /**
         * @returns data URL
         */
        private getSnapshotPNG(dpi: number): string {
            const background = this.insertBackground();
            const raster = this.project.activeLayer.rasterize(dpi, false);
            const data = raster.toDataURL();
            background.remove();
            return data;
        }

        private downloadPNG() {
            // Half of max DPI produces approx 4200x4200.
            const dpi = 0.5 * PaperHelpers.getMaxExportDpi(this.project.activeLayer.bounds.size);
            const data = this.getSnapshotPNG(dpi);
            
            const fileName = SketchHelpers.getSketchFileName(
                this.store.state.sketch, 40, "png");
            const blob = DomHelpers.dataURLToBlob(data);
            saveAs(blob, fileName);
        }

        private downloadSVG() {
            let background: paper.Item;
            if (this.store.state.sketch.backgroundColor) {
                background = this.insertBackground();
            }

            var dataUrl = "data:image/svg+xml;utf8," + encodeURIComponent(
                <string>this.project.exportSVG({ asString: true }));
            const blob = DomHelpers.dataURLToBlob(dataUrl);
            const fileName = SketchHelpers.getSketchFileName(
                this.store.state.sketch, 40, "svg");
            saveAs(blob, fileName);

            if (background) {
                background.remove();
            }
        }

        /**
         * Insert sketch background to provide background fill (if necessary)
         *   and add margin around edges.
         */
        private insertBackground(): paper.Item {
            const bounds = this.getViewableBounds();
            const margin = Math.max(bounds.width, bounds.height) * 0.02;
            const background = paper.Shape.Rectangle(
                bounds.topLeft.subtract(margin),
                bounds.bottomRight.add(margin));
            background.fillColor = this.store.state.sketch.backgroundColor;
            background.sendToBack();
            return background;
        }

        private addBlock(textBlock: TextBlock) {
            if (!textBlock) {
                return;
            }

            if (!textBlock._id) {
                console.error('received block without id', textBlock);
            }

            let item = this._textBlockItems[textBlock._id];
            if (item) {
                console.error("Received addBlock for block that is already loaded");
                return;
            }

            let bounds: { upper: paper.Segment[], lower: paper.Segment[] };

            if (textBlock.outline) {
                const loadSegment = (record: SegmentRecord) => {
                    const point = record[0];
                    if (point instanceof Array) {
                        return new paper.Segment(
                            new paper.Point(record[0]),
                            record[1] && new paper.Point(record[1]),
                            record[2] && new paper.Point(record[2]));
                    }
                    // Single-point segments are stored as number[2]
                    return new paper.Segment(new paper.Point(record));
                };
                bounds = {
                    upper: textBlock.outline.top.segments.map(loadSegment),
                    lower: textBlock.outline.bottom.segments.map(loadSegment)
                };
            }

            item = new TextWarp(
                this.fallbackFont,
                textBlock.text,
                bounds,
                null, {
                    fillColor: textBlock.textColor || "red",    // textColor should have been set elsewhere 
                    backgroundColor: textBlock.backgroundColor
                });

            paperExt.extendMouseEvents(item);

            if (!textBlock.outline && textBlock.position) {
                item.position = new paper.Point(textBlock.position);
            }

            item.on(paper.EventType.click, ev => {
                if (item.selected) {
                    // select next item behind
                    let otherHits = (<TextWarp[]>_.values(this._textBlockItems))
                        .filter(i => i.id !== item.id && !!i.hitTest(ev.point));
                    const otherItem = _.sortBy(otherHits, i => i.index)[0];
                    if (otherItem) {
                        otherItem.bringToFront();
                        const otherId = _.findKey(this._textBlockItems, i => i === otherItem);
                        if (otherId) {
                            this.store.actions.sketch.setSelection.dispatch(
                                { itemId: otherId, itemType: "TextBlock" });
                        }
                    }
                } else {
                    item.bringToFront();
                    if (!item.selected) {
                        this.store.actions.sketch.setSelection.dispatch(
                            { itemId: textBlock._id, itemType: "TextBlock" });
                    }
                }
            });

            item.on(paperExt.EventType.mouseDragStart, ev => {
                item.bringToFront();
            });

            item.on(paper.EventType.mouseDrag, ev => {
                item.translate(ev.delta);
            });

            item.on(paperExt.EventType.mouseDragEnd, ev => {
                let block = <TextBlock>this.getBlockArrangement(item);
                block._id = textBlock._id;
                this.store.actions.textBlock.updateArrange.dispatch(block);
                if (!item.selected) {
                    this.store.actions.sketch.setSelection.dispatch(
                        { itemId: textBlock._id, itemType: "TextBlock" });
                }
            });

            const itemChange$ = PaperNotify.observe(item, PaperNotify.ChangeFlag.GEOMETRY);
            itemChange$
                .debounce(WorkspaceController.BLOCK_BOUNDS_CHANGE_THROTTLE_MS)
                .subscribe(() => {
                    let block = <TextBlock>this.getBlockArrangement(item);
                    block._id = textBlock._id;
                    this.store.actions.textBlock.updateArrange.dispatch(block);
                });

            item.data = textBlock._id;
            if (!textBlock.position) {
                item.position = this.project.view.bounds.point.add(
                    new paper.Point(item.bounds.width / 2, item.bounds.height / 2)
                        .add(50));
            }
            this._textBlockItems[textBlock._id] = item;
        }

        private getBlockArrangement(item: TextWarp): BlockArrangement {
            // export returns an array with item type and serialized object:
            //   ["Path", PathRecord]
            const top = <PathRecord>item.upper.exportJSON({ asString: false })[1];
            const bottom = <PathRecord>item.lower.exportJSON({ asString: false })[1];

            return {
                position: [item.position.x, item.position.y],
                outline: { top, bottom }
            }
        }
    }

}