namespace SketchEditor {

    export class SnapPath extends paper.Group {

        private _region: paper.Path;
        private _content: paper.CompoundPath;
        private _warped: paper.CompoundPath;
        corners: CornerOffsets;

        constructor(region: paper.Path, content: paper.CompoundPath) {
            super();

            this._region = region;
            this._content = content;
            this._content.visible = false;
            this._warped = new paper.CompoundPath(content.pathData);
            this._warped.fillColor = "gray";
            this.corners = [0, 0.25, 0.50, 0.75];

            this.addChild(this._content);
            this.addChild(this._warped);
            
            this.updatePath();
        }

        updatePath() {
            const contentOrigin = this._content.bounds.topLeft;
            const contentWidth = this._content.bounds.width;
            const contentHeight = this._content.bounds.height;
            const regionLength = this._region.length;
            const top = new PathSection(
                this._region, 
                this.corners[0], 
                PaperHelpers.pathOffsetLength(this.corners[0], this.corners[1]));
            const bottom = new PathSection(
                this._region, 
                this.corners[3],
                PaperHelpers.pathOffsetLength(this.corners[3], this.corners[2], false),
                false);

// PaperHelpers.marker(top.getPointAt(0), "t-0");
// PaperHelpers.marker(top.getPointAt(top.length / 2), "t-0.5");
// PaperHelpers.marker(top.getPointAt(top.length), "t-1");

// PaperHelpers.marker(bottom.getPointAt(0), "b-0");
// PaperHelpers.marker(bottom.getPointAt(bottom.length / 2), "b-0.5");
// PaperHelpers.marker(bottom.getPointAt(bottom.length), "b-1");

            let projection = PaperHelpers.dualBoundsPathProjection(top, bottom);
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

       /**
        * Slide offset points by the given amount.
        * @param unitOffset: value 0 to 1
        */
       slide(unitOffset: number){
           this.corners = <CornerOffsets>this.corners.map(
                c => SnapPath.incrementOffset(c, unitOffset)); 
       }

       private static incrementOffset(offset: number, delta: number){
           let result = offset + delta;
           if(result < 0){
               result = result + Math.round(result) + 1;
           }
           result = result % 1;
           //console.log(`${offset} + ${delta} => ${result}`);
           return result;
       }

    }

    /**
     * Path offsets on region for corners of SnapPath content, 
     *   starting with topLeft and proceeding clockwise
     *   to bottomLeft. 
     */
    type CornerOffsets = [
        number, // topLeft
        number, // topRight
        number, // bottomRight
        number  // bottomLeft
    ]

}