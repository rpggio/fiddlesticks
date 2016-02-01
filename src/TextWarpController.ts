// <reference path="typings/paper.d.ts" />

class TextWarpController {
    sampleText = "Fiddlesticks";

    constructor() {
        var lineDraw = new LineDrawTool();
        let prevPath: paper.Path;
        lineDraw.onPathFinished = (path) => {
            path.flatten(40);
            path.smooth();
            
            if(prevPath){
                let layout = new VerticalBoundsTextLayout(path, prevPath);
                layout.layout(this.sampleText);
            }
            
            prevPath = path;
        };
    }
}
