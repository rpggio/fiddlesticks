
class WorkspaceController {

    defaultSize = new paper.Size(4000, 3000);

    canvas: HTMLCanvasElement;
    workspace: Workspace;
    project: paper.Project;
    
    private _sketch: Sketch;

    constructor() {
        paper.settings.handleSize = 1;

        this.canvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
        paper.setup(this.canvas);
        this.project = paper.project;

        new MouseBehaviorTool(this.project);

        let mouseZoom = new ViewZoom(this.project);
        this.workspace = new Workspace(this.defaultSize);
        let sheetBounds = this.workspace.sheet.bounds;
        mouseZoom.setZoomRange(
            [sheetBounds.scale(0.02).size, sheetBounds.scale(1.1).size]);
        mouseZoom.zoomTo(sheetBounds.scale(0.5));
    }

    set sketch(value: Sketch){
        this._sketch = value;
        if(this._sketch){
            this._sketch.onChanged = null;
        }
        this._sketch.onChanged = () => this.update();
        this.update();
    }
    
    get sketch() : Sketch {
        return this._sketch;
    }

    update() {
        for (let block of this._sketch.textBlocks) {
            if (!block.item) {
                let textBlock = new StretchyText(block.text,
                    block.font,
                    <StretchyTextOptions>{
                        fontSize: 128,
                        pathFillColor: block.textColor,
                        backgroundColor: block.backgroundColor
                    });
                this.workspace.addChild(textBlock);
                textBlock.position = this.project.view.bounds.point.add(
                    new paper.Point(textBlock.bounds.width / 2, textBlock.bounds.height / 2)
                        .add(50));

                block.item = textBlock;
            }
        }
    }
}