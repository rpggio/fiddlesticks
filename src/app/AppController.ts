
const AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
const Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
const Roboto500 = 'fonts/Roboto-500.ttf';

class AppController {

    font: opentype.Font;
    warp: TextWarpController;
    textBlocks: TextBlock[] = [];
    paper: paper.PaperScope;
    canvasColor = 'white';
    workspace: Workspace;

    constructor(){

        (<any>$(".color-picker")).spectrum({
            showInput: true,
            allowEmpty:true,
            preferredFormat: "hex",
            showAlpha: true,
            showPalette: true,
            showSelectionPalette: true,
            palette: [
        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
    ],
            localStorageKey: "sketchtext",
        });

        var canvas = document.getElementById('mainCanvas');
        paper.setup(<HTMLCanvasElement>canvas);
        this.paper = paper;

        let mouseZoom = new MouseZoom(paper);
        this.workspace = new Workspace(new paper.Size(4000, 2500));
        mouseZoom.zoomTo(this.workspace.sheet.bounds.scale(0.5));
        
        new FontLoader(Roboto500, font => {
            this.font = font;
            this.warp = new TextWarpController(this);
            
            // for testing 
            this.addText();
        });
    }
    
    addText(){
        let text = $('#newText').val();

        if(text.trim().length){
            let block = <TextBlock> {
                _id: newid(),
                text: text,
                textColor: $('#textColor').val(),
                backgroundColor: $('#backgroundColor').val()
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
    textColor: string;
    backgroundColor: string;
}