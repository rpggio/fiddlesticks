// <reference path="typings/paper.d.ts" />

class TextWarpController {
    app: AppController;

    constructor(app: AppController) {
        this.app = app;
        
        new MouseBehaviorTool(paper);
    }
    
    update(){
        for(let block of this.app.textBlocks){
            if(!block.item){
                let stretchy = new StretchyText(block.text, this.app.font, 64);
                //stretchy.translate(new paper.Point(30, 30));
                block.item = stretchy;
            }
        }        
    }
    
    fiddlesticks(){
        const sampleText = "Fiddlesticks";
        var lineDraw = new LineDrawTool();
        let prevPath: paper.Path;
        lineDraw.onPathFinished = (path) => {
            path.flatten(40);
            path.smooth();
            
            if(prevPath){
                let layout = new VerticalBoundsTextLayout(path, prevPath);
                layout.layout(sampleText,
                    this.app.font, 
                    (item) => this.app.paper.view.draw());
            }
            
            prevPath = path;
        };
    }
}
