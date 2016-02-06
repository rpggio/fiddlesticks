
class VerticalBoundsTextLayout {
    top: paper.Path;
    bottom: paper.Path;

    letterResolution = 100;
    smoothTolerance = 0.25;
    fontSize = 64;

    constructor(top: paper.Path, bottom: paper.Path) {
        this.top = top;
        this.bottom = bottom;
    }

    layout(text: string, font: opentype.Font, onComplete?: (item: paper.Item) => void) {
        let letterGroup = new paper.Group();
        let letterPaths = font.getPaths(text, 0, 0, this.fontSize)
            .map(p => {
                let path = PaperHelpers.importOpenTypePath(p);
                letterGroup.addChild(path);
                return path;
            });

        let orthOrigin = letterGroup.bounds.topLeft;
        let orthWidth = letterGroup.bounds.width;
        let orthHeight = letterGroup.bounds.height;

        let projection = PaperHelpers.sandwichPathProjection(this.top, this.bottom);
        let transform = new PathTransform(point => {
            let relative = point.subtract(orthOrigin);
            let unit = new paper.Point(
                relative.x / orthWidth,
                relative.y / orthHeight);
            let projected = projection(unit);
            return projected;
        });

        let finalGroup = new paper.Group();
        for (let letterPath of letterPaths) {
            let letterOutline = PaperHelpers.tracePathItem(
                letterPath, this.letterResolution);
            letterPath.remove();

            transform.transformPathItem(letterOutline);
            PaperHelpers.simplify(letterOutline, this.smoothTolerance);
            finalGroup.addChild(letterOutline);
        }
        letterGroup.remove();

        if (onComplete) {
            onComplete(finalGroup);
        }
    }
}