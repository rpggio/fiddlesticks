// <reference path="typings/paper.d.ts" />


const AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
const Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
const Roboto500 = 'fonts/Roboto-500.ttf';


interface Window {
    paper: paper.PaperScope;
    DOMParser: any;
}

interface TextLayout {
    layout(text: string, onComplete: (item: paper.Item) => void);
}

declare var opentype: any;

declare module opentype {

    interface Font {
        getPath(text: string, 
            left: number, 
            bottom:number, 
            fontSize: number, 
            options: FontOptions): Path;
            
        getPaths(text: string, 
            left: number, 
            bottom:number, 
            fontSize: number, 
            options?: FontOptions): Path[];    
    }
    
    interface Path {
        toPathData(decimalPlaces?: number): string;
        toSVG(decimalPlaces?: number);
    }
    
    interface FontOptions {
        kerning: boolean;
    }
}

var warp = new TextWarpController();
//warp.drawDemo();
//warp.drawPathsDemo();