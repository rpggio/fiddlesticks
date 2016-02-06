
class StretchyText extends StretchyPath {

    options: StretchyTextOptions;

    constructor(text: string, font: opentype.Font, options?: StretchyTextOptions) {
        this.options = options || <StretchyTextOptions>{
            fontSize: 64
        };
        let openTypePath = font.getPath(text, 0, 0, this.options.fontSize);
        let textPath = PaperHelpers.importOpenTypePath(openTypePath);

        super(textPath, options);
        
        this.position = new paper.Point(this.strokeBounds.width / 2,
                                this.strokeBounds.height / 2);
    }
}

interface StretchyTextOptions extends StretchyPathOptions {
    fontSize: number;
}
