namespace FontShape {

    export class VerticalBoundsStretchPath extends paper.Group {
        static POINTS_PER_PATH = 100;

        private _boundaries: VerticalBounds;
        private _content: paper.CompoundPath;
        private _warped: paper.CompoundPath;
        corners: CornerOffsets;

        constructor(
            content: paper.CompoundPath,
            boundaries?: VerticalBounds
        ) {
            super();

            this._content = content;
            this._content.visible = false;
            this._boundaries = boundaries ||
                {
                    upper: new paper.Path([content.bounds.topLeft, content.bounds.topRight]),
                    lower: new paper.Path([content.bounds.bottomLeft, content.bounds.bottomRight]),
                }
            this._warped = new paper.CompoundPath(content.pathData);
            this._warped.fillColor = "lightgray";

            this.addChild(this._content);
            this.addChild(this._warped);

            this.updatePath();
        }

        updatePath() {
            const contentOrigin = this._content.bounds.topLeft;
            const contentWidth = this._content.bounds.width;
            const contentHeight = this._content.bounds.height;
            let projection = PaperHelpers.dualBoundsPathProjection(
                this._boundaries.upper, this._boundaries.lower);
            let transform = new PathTransform(point => {
                if (!point) {
                    return point;
                }
                let relative = point.subtract(contentOrigin);
                let unit = new paper.Point(
                    relative.x / contentWidth,
                    relative.y / contentHeight);
                let projected = projection(unit);
                return projected;
            });

            const newPaths = this._content.children
                .map(item => {
                    const path = <paper.Path>item;
                    const xPoints = PaperHelpers.tracePathAsPoints(path, 100)
                        .map(p => transform.transformPoint(p));
                    const xPath = new paper.Path({
                        segments: xPoints,
                        closed: true,
                        clockwise: path.clockwise
                    });
                    //xPath.reduce();
                    return xPath;
                })
            this._warped.removeChildren();
            this._warped.addChildren(newPaths);
        }
    }

}