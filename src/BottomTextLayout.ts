
class BottomTextLayout implements TextLayout {

    bottom: paper.Path
    fontSize = 100;

    constructor(bottom: paper.Path) {
        this.bottom = bottom;
    }

    layout(text: string, onComplete?: (item: paper.Item) => void) {
        new FontLoader(AmaticUrl, font => {

            let letterGroup = new paper.Group();
            let letterPaths = font.getPaths(text, 0, 0, this.fontSize)
                .map(p => {
                    let path = PaperHelpers.importOpenTypePath(p);
                    letterGroup.addChild(path);
                    return path;
                });

            let textOrigin = letterGroup.bounds.bottomLeft;
            let linearLength = letterGroup.bounds.width;
            let layoutPathLength = this.bottom.length;
            let offsetScaling = layoutPathLength / linearLength;

            let idx = 0;
            for (let letterPath of letterPaths) {
                let letterOffset = (letterPath.bounds.left - textOrigin.x) * offsetScaling;
                let bottomLeftPrime = this.bottom.getPointAt(letterOffset);
                let bottomRightPrime = this.bottom.getPointAt(
                    Math.min(layoutPathLength,
                        letterOffset + letterPath.bounds.width * offsetScaling));
                let bottomVectorPrime = bottomRightPrime.subtract(bottomLeftPrime);

                let rotateAngle =
                    new paper.Point(1, 0).getDirectedAngle(bottomRightPrime.subtract(bottomLeftPrime))
                // reposition using bottomLeft
                letterPath.position = bottomLeftPrime
                    .add(letterPath.bounds.center
                        .subtract(letterPath.bounds.bottomLeft));
                letterPath.rotate(rotateAngle, bottomLeftPrime);
                letterPath.scale(offsetScaling, bottomLeftPrime);
                idx++;
            }

            if(onComplete){
                onComplete(letterGroup);
            }
        });
    }
}

class PathOffsetScaling {

    to: paper.Path;
    scale: number;

    constructor(fromLength: number, to: paper.Path) {
        this.to = to;
        this.scale = to.length / fromLength;
    }

    getToPointAt(fromPathOffset: number): paper.Point {
        let toOffset = Math.min(this.to.length, fromPathOffset * this.scale);
        return this.to.getPointAt(toOffset);
    }
}