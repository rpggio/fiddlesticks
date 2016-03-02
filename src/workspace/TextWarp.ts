
class TextWarp extends DualBoundsPathWarp {

    static DEFAULT_FONT_SIZE = 64;

    private _font: opentype.Font;
    private _text: string;
    private _fontSize: number;

    constructor(
        font: opentype.Font,
        text: string,
        bounds?: { upper: paper.Segment[], lower: paper.Segment[] },
        fontSize?: number,
        style?: SketchItemStyle) {
            
            if(!fontSize){
                fontSize = TextWarp.DEFAULT_FONT_SIZE;
            }
            
            const pathData = TextWarp.getPathData(font, text, fontSize); 
            const path = new paper.CompoundPath(pathData);
            
            super(path, bounds, style);

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

    get fontSize(): number {
        return this._fontSize;
    }
    
    set fontSize(value: number) {
        if(!value){
            return;
        }
        this._fontSize = value;
        this.updateTextPath();
    }

    private updateTextPath() {
        const pathData = TextWarp.getPathData(
            this._font, this._text, this._fontSize);
        this.source = new paper.CompoundPath(pathData);
    }

    private static getPathData(font: opentype.Font,
        text: string, fontSize?: string|number): string {
        let openTypePath = font.getPath(text, 0, 0,
            Number(fontSize) || TextWarp.DEFAULT_FONT_SIZE);
        return openTypePath.toPathData();
    }
}