
class StretchyText extends StretchyPath {

    ffont: opentype.Font;

    constructor(font: opentype.Font, options: StretchyTextOptions) {
        this.ffont = font;
        
        super(this.getTextPath(options), options);
    }
    
    update(options: StretchyTextOptions){
        this.options = options;
        super.updatePath(this.getTextPath(options));
    }
    
    getTextPath(options: StretchyTextOptions){
        let openTypePath = this.ffont.getPath(
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
