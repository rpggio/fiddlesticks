
class WorkspaceController {

    defaultSize = new paper.Size(4000, 3000);

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
            [sheetBounds.scale(0.02).size, sheetBounds.scale(1.1).size]);
        mouseZoom.zoomTo(sheetBounds.scale(0.5));

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

        channels.events.sketch.attrchanged.subscribe(
            ev => this.workspace.backgroundColor = ev.data.backgroundColor
        );

        channels.events.mergeTyped(
            channels.events.textblock.added,
            channels.events.textblock.changed
        ).subscribe(
            ev => this.textBlockReceived(ev.data));

        channels.events.textblock.removed.subscribe(m => {
            let item = this._textBlockItems[m.data._id];
            if (item) {
                item.remove();
                delete this._textBlockItems[m.data._id];
            }
        });
    }

    textBlockReceived(textBlock: TextBlock) {

        if (!textBlock || !textBlock.text || !textBlock.text.length) {
            return;
        }
        if (!textBlock._id) {
            textBlock._id = newid();
        }
        let options = <StretchyTextOptions>{
            text: textBlock.text,
            fontSize: 128,
            pathFillColor: textBlock.textColor || 'black',
            backgroundColor: textBlock.backgroundColor
        };
        let item = this._textBlockItems[textBlock._id];
        if (!item) {
            item = new StretchyText(this.font, options);

            item.onDoubleClick = ev => {
                const editorAt = this.project.view.projectToView(
                    PaperHelpers.midpoint(item.bounds.topLeft, item.bounds.center));
                this.channels.actions.sketch.setEditingItem.dispatch(
                    {
                        itemId: textBlock._id,
                        itemType: "TextBlock",
                        clientX: editorAt.x,
                        clientY: editorAt.y
                    });
            }

            item.data = textBlock._id;
            this.workspace.addChild(item);
            item.position = this.project.view.bounds.point.add(
                new paper.Point(item.bounds.width / 2, item.bounds.height / 2)
                    .add(50));
            this._textBlockItems[textBlock._id] = item;
        } else {
            item.update(options);
        }
    }
}