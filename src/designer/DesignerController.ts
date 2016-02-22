
const AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
const Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
const Roboto500 = 'fonts/Roboto-500.ttf';
const AquafinaScript = 'fonts/AguafinaScript-Regular/AguafinaScript-Regular.ttf'

class DesignerController {

    fonts: opentype.Font[] = [];
    workspaceController: WorkspaceController;

    constructor(channels: Channels, onFontLoaded:() => void) {

        this.loadFont(Roboto500, font => {

            this.workspaceController = new WorkspaceController(channels, font);
            
            onFontLoaded();
        });
    }

    loadFont(url: string, onComplete: (f: opentype.Font) => void) {
        new FontLoader(url, font => {
            this.fonts.push(font);
            onComplete(font);
        });
    }
}