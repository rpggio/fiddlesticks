
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

        this.loadFont(Roboto500, font => {
            this.newSketch();
            
            let tbSource = Rx.Observable.just(
                <TextBlock>{
                    _id: newid(),
                    text: 'FIDDLESTICKS',
                    textColor: 'gray',
                    });
            let editor = new TextBlockAttributeEditor(
                document.getElementById('textblock-editor'),
                tbSource);
            
            let textBlock$ = editor.change$.map(tba =>
                <TextBlock>{
                    _id: tba._id || newid(),
                    text: tba.text,
                    textColor: tba.textColor,
                    backgroundColor: tba.backgroundColor
                }
            ); 
            
            this.workspaceController = new WorkspaceController(textBlock$, font);
            
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