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
                let stretchy = new StretchyText(block.text, 
                        this.app.font,
                        <StretchyTextOptions>{
                            fontSize: 128,
                            pathFillColor: block.textColor,
                            backgroundColor: block.backgroundColor
                        });
                block.item = stretchy;
            }
        }
    }
}
