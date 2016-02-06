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
                let stretchy = new StretchyText(block.text, this.app.font, 128);
                //stretchy.translate(new paper.Point(30, 30));
                block.item = stretchy;
            }
        }        
    }    
}
