
class WorkspaceController {

    defaultSize = new paper.Size(50000, 40000);
    defaultScale = 0.02;

    canvas: HTMLCanvasElement;
    workspace: Workspace;
    project: paper.Project;
    font: opentype.Font;
    viewZoom: ViewZoom;

    private channels: Channels;
    private _sketch: Sketch;
    private _textBlockItems: { [textBlockId: string]: TextWarp } = {};

    constructor(channels: Channels, font: opentype.Font) {
        this.channels = channels;
        this.font = font;
        paper.settings.handleSize = 1;

        this.canvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
        paper.setup(this.canvas);
        this.project = paper.project;

        this.viewZoom = new ViewZoom(this.project);

        channels.events.sketch.loaded.subscribe(
            ev => {
                this._sketch = ev.data;
                this.project.clear();
                this.project.deselectAll();
                this._textBlockItems = {};

                const clearSelection = (ev: paper.ToolEvent) => 
                    this.channels.actions.sketch.setSelection.dispatch({});

                if(this.workspace){
                    this.workspace.off(paper.EventType.click, clearSelection);
                    this.workspace.off(PaperHelpers.EventType.smartDragStart, clearSelection);
                }

                this.workspace = new Workspace(this.defaultSize);
                this.workspace.bounds.center = new paper.Point(0, 0);
                this.workspace.backgroundColor = ev.data.attr.backgroundColor;

                this.workspace.on(paper.EventType.click, clearSelection);
                this.workspace.on(PaperHelpers.EventType.smartDragStart, clearSelection);
                
                let sheetBounds = this.workspace.sheet.bounds;
                this.viewZoom.setZoomRange(
                    [sheetBounds.scale(0.005).size, sheetBounds.scale(0.25).size]);
            }
        );

        channels.events.sketch.attrChanged.subscribe(
            ev => this.workspace.backgroundColor = ev.data.backgroundColor
        );

        channels.events.mergeTyped(
            channels.events.textblock.added,
            channels.events.textblock.loaded
        ).subscribe(
            ev => this.addBlock(ev.data));

        channels.events.textblock.attrChanged.subscribe(m => {
            let item = this._textBlockItems[m.data._id];
            if (item) {
                const textBlock = m.data;
                item.text = textBlock.text;
                item.customStyle = {
                    fontSize: textBlock.fontSize,
                    fillColor: textBlock.textColor,
                    backgroundColor: textBlock.backgroundColor
                }
            }
        });

        channels.events.textblock.removed.subscribe(m => {
            let item = this._textBlockItems[m.data._id];
            if (item) {
                item.remove();
                delete this._textBlockItems[m.data._id];
            }
        });

        channels.events.sketch.selectionChanged.subscribe(m => {
            if (!m.data || !m.data.itemId) {
                this.project.deselectAll();
                this.channels.events.sketch.editingItemChanged.dispatch({});
                return;
            }
            
            let item = m.data.itemId && this._textBlockItems[m.data.itemId];
            if (item && !item.selected) {
                this.project.deselectAll();
                this.channels.events.sketch.editingItemChanged.dispatch({});
                item.selected = true;
            }
        });

        channels.events.designer.zoomToFitRequested.subscribe(() => {
            this.zoomToFit();
        });
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
            this.font,
            textBlock.text,
            bounds,
            textBlock.fontSize, {
                fontSize: textBlock.fontSize,
                fillColor: textBlock.textColor || "red",    // textColor should have been set elsewhere 
                backgroundColor: textBlock.backgroundColor
            });

        if (!textBlock.outline && textBlock.position) {
            item.position = new paper.Point(textBlock.position);
        }

        item.on(PaperHelpers.EventType.clickWithoutDrag, ev => {
            item.bringToFront();
            if (item.selected) {
                // edit
                const editorAt = this.project.view.projectToView(
                    PaperHelpers.midpoint(item.bounds.topLeft, item.bounds.center));
                this.channels.actions.sketch.setEditingItem.dispatch(
                    {
                        itemId: textBlock._id,
                        itemType: "TextBlock",
                        clientX: editorAt.x,
                        clientY: editorAt.y
                    });
            } else {
                // select
                this.channels.actions.sketch.setSelection.dispatch(
                    { itemId: textBlock._id, itemType: "TextBlock" });
            }
        });

        item.on(PaperHelpers.EventType.smartDragStart, ev => {
            item.bringToFront();
            if (!item.selected) {
                this.channels.actions.sketch.setSelection.dispatch(
                    { itemId: textBlock._id, itemType: "TextBlock" });
            }
        });
        
        item.on(PaperHelpers.EventType.smartDragEnd, ev => {
            let block = <TextBlock>this.getBlockArrangement(item);
            block._id = textBlock._id;
            this.channels.actions.textBlock.updateArrange.dispatch(block);
        });

        item.observe(flags => {
            if (flags & PaperNotify.ChangeFlag.GEOMETRY) {
                let block = <TextBlock>this.getBlockArrangement(item);
                block._id = textBlock._id;
                this.channels.actions.textBlock.updateArrange.dispatch(block);
            }
        });

        item.data = textBlock._id;
        this.workspace.addChild(item);
        if (!textBlock.position) {
            item.position = this.project.view.bounds.point.add(
                new paper.Point(item.bounds.width / 2, item.bounds.height / 2)
                    .add(50));
        }
        this._textBlockItems[textBlock._id] = item;
    }

    private getBlockArrangement(item: TextWarp): BlockArrangement {
        // export returns an array with item type and serialized object:
        //   ["Path", { segments:[][] }]
        const top = <PathRecord>item.upper.exportJSON({ asString: false })[1];
        const bottom = <PathRecord>item.lower.exportJSON({ asString: false })[1];

        return {
            position: [item.position.x, item.position.y],
            outline: { top, bottom }
        }
    }
}