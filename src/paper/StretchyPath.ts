
class StretchyPath extends paper.Group {
    sourcePath: paper.CompoundPath;
    displayPath: paper.CompoundPath;
    corners: paper.Segment[];
    outline: paper.Path;
    
    /**
     * For rebuilding the midpoint handles
     * as outline changes.
     */
    midpointGroup: paper.Group;

    constructor(sourcePath: paper.CompoundPath) {
        super();

        this.sourcePath = sourcePath;
        this.sourcePath.visible = false;

        this.createOutline();
        this.createSegmentMarkers();
        this.updateMidpiontMarkers();

        this.mouseBehavior = {
            onDrag: event => this.position = this.position.add(event.delta)
        };

        this.arrangeContents();
    }

    arrangeContents() {
        this.updateMidpiontMarkers();
        this.arrangePath();
    }

    arrangePath() {
        let orthOrigin = this.sourcePath.bounds.topLeft;
        let orthWidth = this.sourcePath.bounds.width;
        let orthHeight = this.sourcePath.bounds.height;
        let sides = this.getOutlineSides();
        let top = sides[0];
        let bottom = sides[2];
        bottom.reverse();
        let projection = PaperHelpers.pathProjection(top, bottom);
        let transform = new PathTransform(point => {
            let relative = point.subtract(orthOrigin);
            let unit = new paper.Point(
                relative.x / orthWidth,
                relative.y / orthHeight);
            let projected = projection(unit);
            return projected;
        });

        for(let side of sides){
            side.remove();
        }
        
        let newPath = <paper.CompoundPath>this.sourcePath.clone();
        newPath.visible = true;
        newPath.fillColor = 'lightblue';

        transform.transformPathItem(newPath);

        if (this.displayPath) {
            this.displayPath.remove();
        }

        this.displayPath = newPath;
        this.insertChild(1, newPath);
    }

    private getOutlineSides(): paper.Path[] {
        let sides: paper.Path[] = [];
        let segmentGroup: paper.Segment[] = [];
        
        let cornerPoints = this.corners.map(c => c.point);
        let first = cornerPoints.shift(); 
        cornerPoints.push(first);

        let targetCorner = cornerPoints.shift();
        let segmentList = this.outline.segments.map(x => x);
        let i = 0;
        segmentList.push(segmentList[0]);
        for(let segment of segmentList){
            
            segmentGroup.push(segment);
    
            if(targetCorner.getDistance(segment.point) < 0.0001) {
                // finish path
                sides.push(new paper.Path(segmentGroup));
                segmentGroup = [segment];
                targetCorner = cornerPoints.shift();
            }
                
            i++;
        }
        
        if(sides.length !== 4){
            console.error('sides', sides);
            throw 'failed to get sides';
        }
        
        return sides;
    }

    private createOutline() {
        let bounds = this.sourcePath.bounds;
        this.outline = new paper.Path([
            new paper.Segment(bounds.topLeft),
            new paper.Segment(bounds.topRight),
            new paper.Segment(bounds.bottomRight),
            new paper.Segment(bounds.bottomLeft)
        ]);

        this.outline.closed = true;
        this.outline.fillColor = new paper.Color(window.app.canvasColor);//.add(0.04);
        this.outline.strokeColor = 'lightgray';
        this.outline.dashArray = [5, 5];

        // track corners so we know how to arrange the text
        this.corners = this.outline.segments.map(s => s);

        this.addChild(this.outline);
    }

    private createSegmentMarkers() {
        let bounds = this.sourcePath.bounds;
        for (let segment of this.outline.segments) {
            let handle = new SegmentHandle(segment);
            handle.onChangeComplete = () => this.arrangeContents();
            this.addChild(handle);
        }
    }

    private updateMidpiontMarkers() {
        if(this.midpointGroup){
            this.midpointGroup.remove();
        }
        this.midpointGroup = new paper.Group();
        this.outline.curves.forEach(curve => {
            let handle = new CurveSplitterHandle(curve);
            handle.onDragEnd = (newSegment, event) => {
                let newHandle = new SegmentHandle(newSegment);
                newHandle.onChangeComplete = () => this.arrangeContents();
                this.addChild(newHandle);
                handle.remove();
                this.arrangeContents();
            };
            this.midpointGroup.addChild(handle);
        });
        this.addChild(this.midpointGroup);
    }
}
