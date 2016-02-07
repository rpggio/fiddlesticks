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
                let textBlock = new StretchyText(block.text, 
                        this.app.font,
                        <StretchyTextOptions>{
                            fontSize: 128,
                            pathFillColor: block.textColor,
                            backgroundColor: block.backgroundColor
                        });
                this.app.workspace.addChild(textBlock);
                textBlock.position = this.app.paper.view.bounds.point.add(
                    new paper.Point(textBlock.bounds.width / 2, textBlock.bounds.height / 2 )
                    .add(50));

                block.item = textBlock;
            }
        }
    }
}
