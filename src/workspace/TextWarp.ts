
interface TextWarpOptions  {
    fontSize?: number;
}

class TextWarp extends DualBoundsPathWarp {

    static DEFAULT_FONT_SIZE = 32;

    private _font: opentype.Font;
    private _text: string;
    private _textPath: paper.CompoundPath;

    constructor(
        font: opentype.Font,
        text: string,
        style?: paper.IStyle) {
            const pathData = TextWarp.getPathData(
                font, text, 
                style && style.fontSize); 
            const path = new paper.CompoundPath(pathData);
            if(style){
                path.style = style;
            }
            
            super(path);

            this._textPath = <paper.CompoundPath>path;
            this._font = font;
            this._text = text;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
        this.updateTextPath();
    }

    get style(): paper.IStyle {
        return this._textPath.style;
    }
    
    set style(value: paper.IStyle){
        if(value){
            this._textPath.style = value;
        }
    }

    private updateTextPath() {
        this._textPath.pathData = TextWarp.getPathData(
            this._font, this._text, this._textPath.style.fontSize);
    }

    private static getPathData(font: opentype.Font,
        text: string, fontSize?: string|number): string {
        let openTypePath = font.getPath(text, 0, 0,
            Number(fontSize) || TextWarp.DEFAULT_FONT_SIZE);
        return openTypePath.toPathData();
    }
}