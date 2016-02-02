// <reference path="typings/paper.d.ts" />

class TextWarpController {
    app: AppController;
    sampleText = "Fiddlesticks";

    constructor(app: AppController) {
        this.app = app;
        
        var lineDraw = new LineDrawTool();
        let prevPath: paper.Path;
        lineDraw.onPathFinished = (path) => {
            path.flatten(40);
            path.smooth();
            
            if(prevPath){
                let layout = new VerticalBoundsTextLayout(path, prevPath);
                layout.layout(this.sampleText, (item) => this.app.paper.view.draw());
            }
            
            prevPath = path;
        };
    }
    
    update(){
        for(let block of this.app.textBlocks){
            if(!block.item){
                block.item = new paper.PointText({
                    point: [50, 50],
                    content: block.text,
                    fillColor: 'black',
                    fontSize: 25
                })
            }
        }        
    }
}
