
const AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
const Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
const Roboto500 = 'fonts/Roboto-500.ttf';

class AppController {

    warp: TextWarpController;
    textBlocks: TextBlock[] = [];
    paper: paper.PaperScope;

    constructor(){
        var canvas = document.getElementById('mainCanvas');
        paper.setup(<HTMLCanvasElement>canvas);
        this.paper = paper;        
        
        this.warp = new TextWarpController(this);
    }
    
    addText(){
        let text = $('#newText').val();
        if(text.trim().length){
            let block = <TextBlock> {
                _id: newid(),
                text: text
            };
            this.textBlocks.push(block);
            this.warp.update();
            this.paper.view.draw();
        }    
    }
}

interface TextBlock {
    _id: string;
    text: string;
    item: paper.Item;
}