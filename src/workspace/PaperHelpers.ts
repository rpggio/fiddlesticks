
class PaperHelpers {

    static importOpenTypePath(openPath: opentype.Path): paper.CompoundPath {
        return new paper.CompoundPath(openPath.toPathData());
        
        // let svg = openPath.toSVG(4);
        // return <paper.Path>paper.project.importSVG(svg);
    }

    static tracePathItem(path: paper.PathItem, pointsPerPath: number): paper.PathItem {
        if (path.className === 'CompoundPath') {
            return this.traceCompoundPath(<paper.CompoundPath>path, pointsPerPath);
        } else {
            return this.tracePath(<paper.Path>path, pointsPerPath);
        }
    }

    static traceCompoundPath(path: paper.CompoundPath, pointsPerPath: number): paper.CompoundPath {
        if (!path.children.length) {
            return null;
        }
        let paths = path.children.map(p =>
            this.tracePath(<paper.Path>p, pointsPerPath));
        return new paper.CompoundPath({
            children: paths,
            clockwise: path.clockwise
        })
    }

    static tracePathAsPoints(path: paper.Path, numPoints: number): paper.Point[] {
        let pathLength = path.length;
        let offsetIncr = pathLength / numPoints;
        let points = [];
        let i = 0;
        let offset = 0;

        while (i++ < numPoints) {
            let point = path.getPointAt(Math.min(offset, pathLength));
            points.push(point);
            offset += offsetIncr;
        }

        return points;
    }

    static tracePath(path: paper.Path, numPoints: number): paper.Path {
        let points = PaperHelpers.tracePathAsPoints(path, numPoints);
        return new paper.Path({
            segments: points,
            closed: true,
            clockwise: path.clockwise
        });
    }

    static dualBoundsPathProjection(topPath: paper.Curvelike, bottomPath: paper.Curvelike)
        : (unitPoint: paper.Point) => paper.Point {
        const topPathLength = topPath.length;
        const bottomPathLength = bottomPath.length;
        return function(unitPoint: paper.Point): paper.Point {
            let topPoint = topPath.getPointAt(unitPoint.x * topPathLength);
            let bottomPoint = bottomPath.getPointAt(unitPoint.x * bottomPathLength);
            if (topPoint == null || bottomPoint == null) {
                throw "could not get projected point for unit point " + unitPoint.toString();
            }
            return topPoint.add(bottomPoint.subtract(topPoint).multiply(unitPoint.y));
        }
    }

    static markerGroup: paper.Group;

    static resetMarkers(){
        if(PaperHelpers.markerGroup){
            PaperHelpers.markerGroup.remove();
        }
        PaperHelpers.markerGroup = new paper.Group();
        PaperHelpers.markerGroup.opacity = 0.2;
        
    }

    static markerLine(a: paper.Point, b: paper.Point): paper.Item{
        let line = paper.Path.Line(a,b);
        line.strokeColor = 'green';
        //line.dashArray = [5, 5];
        PaperHelpers.markerGroup.addChild(line);
        return line;
    }

    static marker(point: paper.Point, label: string): paper.Item {
        //let marker = paper.Shape.Circle(point, 10);
        let marker = new paper.PointText(point);
        marker.fontSize = 36;
        marker.content = label;
        marker.strokeColor = "red";
        marker.bringToFront();
        //PaperHelpers.markerGroup.addChild(marker);
        return marker;
    }

    static simplify(path: paper.PathItem, tolerance?: number) {
        if (path.className === 'CompoundPath') {
            for (let p of path.children) {
                PaperHelpers.simplify(<paper.PathItem>p, tolerance);
            }
        } else {
            (<paper.Path>path).simplify(tolerance);
        }
    }

    /**
     * Find self or nearest ancestor satisfying the predicate.
     */    
    static findSelfOrAncestor(item: paper.Item, predicate: (i: paper.Item) => boolean){
        if(predicate(item)){
            return item;
        }
        return PaperHelpers.findAncestor(item, predicate);
    }
    
    /**
     * Find nearest ancestor satisfying the predicate.
     */
    static findAncestor(item: paper.Item, predicate: (i: paper.Item) => boolean){
        if(!item){
            return null;
        }
        let prior: paper.Item;
        let checking = item.parent;
        while(checking && checking !== prior){
            if(predicate(checking)){
                return checking;
            }
            prior = checking;
            checking = checking.parent;
        }
        return null;
    }
    
    /**
     * The corners of the rect, clockwise starting from topLeft
     */
    static corners(rect: paper.Rectangle): paper.Point[]{
        return [rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft];
    }
    
    /**
     * the midpoint between two points
     */
    static midpoint(a: paper.Point, b: paper.Point){
        return b.subtract(a).divide(2).add(a);
    }
    
    static cloneSegment(segment: paper.Segment){
        return new paper.Segment(segment.point, segment.handleIn, segment.handleOut);
    }
}