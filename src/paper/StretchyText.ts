
class StretchyText extends StretchyPath {

    constructor(text: string, font: opentype.Font, fontSize: number) {
        let openTypePath = font.getPath(text, 0, 0, fontSize);
        let textPath = PaperHelpers.importOpenTypePath(openTypePath);

        textPath.fillColor = 'red';

        super(textPath);
        
        this.position = new paper.Point(this.strokeBounds.width / 2,
                                this.strokeBounds.height / 2);
    }
}
