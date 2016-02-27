
class WorkspaceController {

    defaultSize = new paper.Size(50000, 40000);

    canvas: HTMLCanvasElement;
    workspace: Workspace;
    project: paper.Project;
    font: opentype.Font;

    private channels: Channels;
    private _sketch: Sketch;
    private _textBlockItems: { [textBlockId: string]: StretchyText; } = {};

    constructor(channels: Channels, font: opentype.Font) {
        this.channels = channels;
        this.font = font;
        paper.settings.handleSize = 1;

        this.canvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
        paper.setup(this.canvas);
        this.project = paper.project;

        const mouseTool = new MouseBehaviorTool(this.project);
        mouseTool.onToolMouseDown = ev => {
            this.channels.events.sketch.editingItemChanged.dispatch({});
        };

        let mouseZoom = new ViewZoom(this.project);
        this.workspace = new Workspace(this.defaultSize);
        let sheetBounds = this.workspace.sheet.bounds;
        mouseZoom.setZoomRange(
            [sheetBounds.scale(0.005).size, sheetBounds.scale(0.25).size]);
        mouseZoom.zoomTo(sheetBounds.scale(0.05));


const viewCenter = this.project.view.bounds.center;
let textWarp = new TextWarp(font, "FLOOFY", 
    { fillColor: "green", strokeColor: "gray", fontSize: 128 });
textWarp.position = viewCenter;
this.workspace.addChild(textWarp);


        this.workspace.mouseBehavior.onClick = ev => {
            this.channels.actions.sketch.setSelection.dispatch({});
        }

        channels.events.sketch.loaded.subscribe(
            ev => {
                this._sketch = ev.data;
                this.workspace.backgroundColor = ev.data.attr.backgroundColor;
                _.forOwn(this._textBlockItems, (block, id) => {
                    block.remove();
                });
                this._textBlockItems = {};
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
                let options = <StretchyTextOptions>{
                    text: textBlock.text,
                    fontSize: textBlock.fontSize,
                    pathFillColor: textBlock.textColor,
                    backgroundColor: textBlock.backgroundColor
                };
                item.update(options);
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
            if (m.data && m.data.priorSelectionItemId) {
                let prior = this._textBlockItems[m.data.priorSelectionItemId];
                if (prior) {
                    prior.blockSelected = false;
                }
            }

            let item = m.data.itemId && this._textBlockItems[m.data.itemId];
            if (item) {
                item.blockSelected = true;
            }
        });

        channels.events.designer.saveLocalRequested.subscribe(m => {
            _.forOwn(this._textBlockItems, tbi => {
                const doc = this.project.exportJSON(false);
                console.log(doc);

            });

        });
    }

    addBlock(textBlock: TextBlock) {
        if (!textBlock) {
            return;
        }

        if (!textBlock._id) {
            console.error('received block without id', textBlock);
        }

        let options = <StretchyTextOptions>{
            text: textBlock.text,
            fontSize: textBlock.fontSize,
            // pink = should not happen
            pathFillColor: textBlock.textColor || 'pink',
            backgroundColor: textBlock.backgroundColor
        };
        let item = this._textBlockItems[textBlock._id];
        if (item) {
            console.error("Received addBlock for block that is already loaded");
            return;
        }
        item = new StretchyText(this.font, options, textBlock.position, textBlock.outline);

        // warning: MouseBehavior events are also set within StretchyPath. 
        //          Collision will happen eventuall.
        // todo: Fix drag handler in paper.js so it doesn't fire click.
        //       Then we can use the item.click event.
        item.mouseBehavior.onClick = ev => {
            item.bringToFront();
            const editorAt = this.project.view.projectToView(
                PaperHelpers.midpoint(item.bounds.topLeft, item.bounds.center));
            // select
            if (!item.selected) {
                this.channels.actions.sketch.setSelection.dispatch(
                    { itemId: textBlock._id, itemType: "TextBlock" });
            }
            // edit
            this.channels.actions.sketch.setEditingItem.dispatch(
                {
                    itemId: textBlock._id,
                    itemType: "TextBlock",
                    clientX: editorAt.x,
                    clientY: editorAt.y
                });
        };

        item.mouseBehavior.onDragStart = ev => {
            item.bringToFront();
            if (!item.selected) {
                this.channels.actions.sketch.setSelection.dispatch(
                    { itemId: textBlock._id, itemType: "TextBlock" });
            }
        };

        item.mouseBehavior.onDragMove = ev => {
            item.position = item.position.add(ev.delta);
        };

        item.mouseBehavior.onDragEnd = ev => {
            let block = <TextBlock>this.getBlockArrangement(item);
            block._id = textBlock._id;
            this.channels.actions.textBlock.updateArrange.dispatch(block);
        }

        item.onOutlineChanged = outline => {
            let block = <TextBlock>this.getBlockArrangement(item);
            block._id = textBlock._id;
            this.channels.actions.textBlock.updateArrange.dispatch(block);
        };

        item.data = textBlock._id;
        this.workspace.addChild(item);
        if (!textBlock.position) {
            item.position = this.project.view.bounds.point.add(
                new paper.Point(item.bounds.width / 2, item.bounds.height / 2)
                    .add(50));
        }
        this._textBlockItems[textBlock._id] = item;
    }

    private getBlockArrangement(item: StretchyText): BlockArrangement {
        let sides = item.getOutlineSides();
        const top = sides[0].exportJSON({ asString: false });
        const bottom = sides[2].exportJSON({ asString: false });
        return {
            position: [item.position.x, item.position.y],
            outline: { top, bottom }
        }
    }
}