
class StretchyText extends StretchyPath {

    options: StretchyTextOptions;

    constructor(text: string, font: opentype.Font, options?: StretchyTextOptions) {
        this.options = options || <StretchyTextOptions>{
            fontSize: 32
        };
        let openTypePath = font.getPath(text, 0, 0, this.options.fontSize);
        let textPath = PaperHelpers.importOpenTypePath(openTypePath);

        super(textPath, options);
    }
}

interface StretchyTextOptions extends StretchyPathOptions {
    fontSize: number;
}
