// <reference path="typings/paper.d.ts" />

class ExplodedWord {
    
    text: string;
    fontUrl: string;
    font: opentype.Font;
    fontOptions: Object;
    chars: ExplodedChar[];
    
    constructor(text: string, fontUrl: string, onReady: () => void){
        this.fontUrl = fontUrl;
        var loader = new FontLoader(fontUrl, font => {
            this.font = font;
            this.createChars();
            onReady.call(this);
        });
    }
    
    private createChars(){
        
    }
}

class ExplodedChar {
    value: string;
    word: ExplodedWord;
    position: number;
    offset: number;
    path: paper.Path;
}