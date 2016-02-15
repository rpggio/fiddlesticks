
class WorkspaceController {

    defaultSize = new paper.Size(4000, 3000);

    canvas: HTMLCanvasElement;
    workspace: Workspace;
    project: paper.Project;
    font: opentype.Font;
    
    private _sketch: Sketch;
    private _textBlockItems: { [textBlockId: string] : StretchyText; } = {};

    constructor(textBlock$: Rx.Observable<TextBlock>, font: opentype.Font) {
        this.font = font;      
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
        
        textBlock$
            .subscribe(tb => this.tbNext(tb));
    }
    
    tbNext(textBlock: TextBlock){
        if(!textBlock.text.length){
            return;
        }
        if(!textBlock._id){
            textBlock._id = newid();
        }
        let options = <StretchyTextOptions>{
                    text: textBlock.text,
                    fontSize: 128,
                    pathFillColor: textBlock.textColor || 'black',
                    backgroundColor: textBlock.backgroundColor
                };
        let item = this._textBlockItems[textBlock._id];
        if(!item) {
            item = new StretchyText(this.font, options);
            item.data = textBlock._id;
            this.workspace.addChild(item);
            item.position = this.project.view.bounds.point.add(
                new paper.Point(item.bounds.width / 2, item.bounds.height / 2)
                    .add(50));
            this._textBlockItems[textBlock._id] = item;
        } else {
            item.updateText(options);
        }
    }
}