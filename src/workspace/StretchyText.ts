
class StretchyText extends StretchyPath {

    ffont: opentype.Font;

    constructor(font: opentype.Font, 
        options: StretchyTextOptions, 
        position?: number[],
        paths?: {top:any, bottom: any}) {
        super(StretchyText.getTextPath(font, options), options, position, paths);
        this.ffont = font;
    }
    
    update(options: StretchyTextOptions){
        this.options = options;
        super.updatePath(StretchyText.getTextPath(this.ffont, options));
    }
    
    static getTextPath(font: opentype.Font, options: StretchyTextOptions){
        let openTypePath = font.getPath(
                options.text, 
                0, 
                0, 
                options.fontSize || 32);
        return PaperHelpers.importOpenTypePath(openTypePath);
    }
}

interface StretchyTextOptions extends StretchyPathOptions {
    text: string;
    fontSize: number;
}
