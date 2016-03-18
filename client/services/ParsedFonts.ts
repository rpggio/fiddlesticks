
type ParsedFontLoaded = (url: string, font: opentype.Font) => void; 

class ParsedFonts {

    fonts: { [url: string]: opentype.Font; } = {};

    private _fontLoaded: ParsedFontLoaded;

    constructor(fontLoaded: ParsedFontLoaded){
        this._fontLoaded = fontLoaded;
    }

    get(fontUrl: string, onReady: ParsedFontLoaded = null) {
        if(!fontUrl){
            return;
        }
        
        let font = this.fonts[fontUrl];

        if (font) {
            onReady && onReady(fontUrl, font);
            return;
        }

        opentype.load(fontUrl, (err, font) => {
            if (err) {
                console.error(err, {fontUrl});
            } else {
                this.fonts[fontUrl] = font;
                onReady && onReady(fontUrl, font);
                this._fontLoaded(fontUrl, font);
            }
        });
    }
}