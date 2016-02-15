
const AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
const Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
const Roboto500 = 'fonts/Roboto-500.ttf';
const AquafinaScript = 'fonts/AguafinaScript-Regular/AguafinaScript-Regular.ttf'

class DesignerController {

    app: AppController;
    fonts: opentype.Font[] = [];
    sketch: Sketch;
    workspaceController: WorkspaceController;

    constructor(app: AppController) {
        this.app = app;

        let sketchChannel = new SketchChannel();

        this.loadFont(Roboto500, font => {
            this.newSketch();
            
            let editor = new SketchEditor(sketchChannel);
            ReactiveDom.render(editor, document.getElementById('designer'));
            
            this.workspaceController = new WorkspaceController(sketchChannel, font);
            
            sketchChannel.textblock.add.publish({_id: newid(), text: ""});
        });
    }

    loadFont(url: string, onComplete: (f: opentype.Font) => void) {
        new FontLoader(url, font => {
            this.fonts.push(font);
            onComplete(font);
        });
    }

    newSketch() {
        this.sketch = new Sketch();
    }
}