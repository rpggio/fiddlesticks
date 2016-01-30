// <reference path="typings/paper.d.ts" />

interface Window {
    paper: paper.PaperScope;
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
    }
    
    interface FontOptions {
        kerning: boolean;
    }
}

var warp = new TextWarpController();
//warp.drawDemo();
//warp.drawPathsDemo();