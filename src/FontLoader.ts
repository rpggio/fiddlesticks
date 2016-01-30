
class FontLoader {

    isLoaded: boolean;

    constructor(fontUrl: string, onLoaded: (font: opentype.Font) => void) {
        opentype.load(fontUrl, function(err, font) {
            if (err) {
                console.error(err);
            } else {
                if (onLoaded) {
                    this.isLoaded = true;
                    onLoaded.call(this, font);
                }
            }
        });
    }
}