
class WorkspaceController {

    static TEXT_CHANGE_RENDER_THROTTLE_MS = 500;
    static BLOCK_BOUNDS_CHANGE_THROTTLE_MS = 500;

    defaultSize = new paper.Size(50000, 40000);
    defaultScale = 0.02;

    canvas: HTMLCanvasElement;
    project: paper.Project;
    fallbackFont: opentype.Font;
    viewZoom: ViewZoom;

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

        this.viewZoom = new ViewZoom(this.project);
        const clearSelection = (ev: paper.PaperMouseEvent) => {
            store.actions.sketch.setSelection.dispatch({});
        }
        paper.view.on(paper.EventType.click, clearSelection);
        paper.view.on(PaperHelpers.EventType.smartDragStart, clearSelection);

        // ----- Designer -----

        store.events.designer.zoomToFitRequested.subscribe(() => {
            this.zoomToFit();
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
            if (!m.data || !m.data.itemId) {
                this.project.deselectAll();
                store.events.sketch.editingItemChanged.dispatch({});
                return;
            }

            let item = m.data.itemId && this._textBlockItems[m.data.itemId];
            if (item && !item.selected) {
                this.project.deselectAll();
                store.events.sketch.editingItemChanged.dispatch({});
                item.selected = true;
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
                    if (textBlock.fontDesc && textBlock.fontDesc.url) {
                        // push in font when ready
                        store.resources.parsedFonts.get(textBlock.fontDesc.url,
                            (url, font) => item.font = font);
                    }
                    item.customStyle = {
                        fontSize: textBlock.fontSize,
                        fillColor: textBlock.textColor,
                        backgroundColor: textBlock.backgroundColor
                    }
                }
            });

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

        this.viewZoom.zoomTo(bounds.scale(1.05));
    }

    handleImageDownloadClick(clickElement: HTMLLinkElement) {
        let background: paper.Shape;
        if (this.store.state.retained.sketch.backgroundColor) {
            const bounds = app.workspaceController.project.activeLayer.bounds;
            background = paper.Shape.Rectangle(
                bounds.topLeft.subtract(20),
                bounds.bottomRight.add(20));
            background.fillColor = this.store.state.retained.sketch.backgroundColor;
            background.sendToBack();
        }

        const raster = app.workspaceController.project.activeLayer.rasterize(300, false);
        const data = raster.toDataURL();
        clickElement.href = data;
        (<any>clickElement).download = this.getSketchFileName(30);

        if (background) {
            background.remove();
        }
    }

    private getSketchFileName(length: number): string {
        let name = "";
        outer: 
        for (const block of this.store.state.retained.sketch.textBlocks) {
            for (const word of block.text.split(/\s/)) {
                const trim = word.replace(/\W/g, '').trim();
                if (trim.length) {
                    if (name.length) name += " ";
                    name += trim;
                }
                if (name.length > 40) {
                    break outer;
                }
            }
        }
        if (!name.length){
            return "fiddle.png";
        }
        return name + ".png";
    }

    addBlock(textBlock: TextBlock) {
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
            textBlock.fontSize, {
                fontSize: textBlock.fontSize,
                fillColor: textBlock.textColor || "red",    // textColor should have been set elsewhere 
                backgroundColor: textBlock.backgroundColor
            });

        if (textBlock.fontDesc && textBlock.fontDesc.url) {
            // push in font when ready
            this.store.resources.parsedFonts.get(textBlock.fontDesc.url,
                (url, font) => item.font = font);
        }

        if (!textBlock.outline && textBlock.position) {
            item.position = new paper.Point(textBlock.position);
        }

        const sendEditAction = () => {
            const editorAt = this.project.view.projectToView(
                PaperHelpers.midpoint(item.bounds.topLeft, item.bounds.center));
            this.store.actions.sketch.setEditingItem.dispatch(
                {
                    itemId: textBlock._id,
                    itemType: "TextBlock",
                    clientX: editorAt.x,
                    clientY: editorAt.y
                });
        };

        item.on(PaperHelpers.EventType.clickWithoutDrag, ev => {
            item.bringToFront();
            if (item.selected) {
                sendEditAction();
            } else {
                // select item
                this.store.actions.sketch.setSelection.dispatch(
                    { itemId: textBlock._id, itemType: "TextBlock" });
            }
        });

        item.on(PaperHelpers.EventType.smartDragStart, ev => {
            item.bringToFront();
            if (!item.selected) {
                this.store.actions.sketch.setSelection.dispatch(
                    { itemId: textBlock._id, itemType: "TextBlock" });
            }
        });

        item.on(PaperHelpers.EventType.smartDragEnd, ev => {
            let block = <TextBlock>this.getBlockArrangement(item);
            block._id = textBlock._id;
            this.store.actions.textBlock.updateArrange.dispatch(block);
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

        if (!this.store.state.retained.sketch.loading
            && this.store.state.retained.sketch.textBlocks.length <= 1) {
            // open editor for newly added block
            sendEditAction();
        }
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