
class StretchyPath extends paper.Group {
    sourcePath: paper.CompoundPath;
    displayPath: paper.CompoundPath;
    corners: paper.Segment[];
    region: paper.Path;
    midpointGroup: paper.Group;

    constructor(sourcePath: paper.CompoundPath) {
        super();

        this.sourcePath = sourcePath;
        this.sourcePath.visible = false;

        this.createRegion();
        this.createSegmentMarkers();
        this.updateMidpiontMarkers();

        this.dragBehavior = {
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
        let sides = this.getRegionSides();
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

    private getRegionSides(): paper.Path[] {
        let sides: paper.Path[] = [];
        let segmentGroup: paper.Segment[] = [];
        
        let cornerPoints = this.corners.map(c => c.point);
        let first = cornerPoints.shift(); 
        cornerPoints.push(first);

        let targetCorner = cornerPoints.shift();
        let segmentList = this.region.segments.map(x => x);
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

    private createRegion() {
        let bounds = this.sourcePath.bounds;
        this.region = new paper.Path([
            new paper.Segment(bounds.topLeft),
            new paper.Segment(bounds.topRight),
            new paper.Segment(bounds.bottomRight),
            new paper.Segment(bounds.bottomLeft)
        ]);

        this.region.closed = true;
        this.region.fillColor = new paper.Color(window.app.canvasColor);//.add(0.04);
        this.region.strokeColor = 'lightgray';
        this.region.dashArray = [5, 5];

        this.corners = this.region.segments.map(s => s);

        this.addChild(this.region);
    }

    private createSegmentMarkers() {
        let bounds = this.sourcePath.bounds;
        for (let segment of this.region.segments) {
            let marker = this.segmentDragHandle(
                segment,
                { onDragEnd: () => this.arrangeContents() }
            );
            this.addChild(marker);
        }
    }

    private updateMidpiontMarkers() {
        if(this.midpointGroup){
            this.midpointGroup.remove();
        }
        this.midpointGroup = new paper.Group();
        for (let curve of this.region.curves) {
            let marker = this.curveMidpointDragHandle(
                curve,
                { onDragEnd: () => this.arrangeContents() }
            );
            this.midpointGroup.addChild(marker);
        }
        this.addChild(this.midpointGroup);
    }
    
    private segmentDragHandle(
        segment: paper.Segment,
        dragBehavior?: MouseBehavior
    ): paper.Shape {
        let marker = paper.Shape.Circle(Elements.dragHandleStyle);
        marker.position = segment.point;

        marker.dragBehavior = <MouseBehavior>{
            onDrag: event => {
                let newPos = marker.position.add(event.delta);
                marker.position = newPos;
                segment.point = newPos;
                if(dragBehavior && dragBehavior.onDrag){
                    dragBehavior.onDrag(event);
                }
            },
            onDragStart: dragBehavior && dragBehavior.onDragStart || undefined,
            onDragEnd: dragBehavior && dragBehavior.onDragEnd || undefined
        }

        return marker;
    }
    
    private curveMidpointDragHandle(
        curve: paper.Curve,
        dragBehavior?: MouseBehavior
    ): paper.Shape {
        let marker = paper.Shape.Circle(Elements.dragHandleStyle);
        marker.position = curve.getPointAt(0.5 * curve.length);

        let newSegment: paper.Segment;
        marker.dragBehavior = <MouseBehavior>{
            onDragStart: (event) => {
                newSegment = new paper.Segment(marker.position);
                curve.path.insert(
                    curve.index + 1, 
                    newSegment
                );
                if(dragBehavior && dragBehavior.onDragStart){
                    dragBehavior.onDragStart(event);
                }
            },
            onDrag: event => {
                let newPos = marker.position.add(event.delta);
                marker.position = newPos;
                newSegment.point = newPos;
                if(dragBehavior && dragBehavior.onDrag){
                    dragBehavior.onDrag(event);
                }
            },
            onDragEnd: event => {
                let newMarker = this.segmentDragHandle(newSegment, dragBehavior);
                marker.replaceWith(newMarker);
                marker.remove();
                if(dragBehavior && dragBehavior.onDragEnd){
                    dragBehavior.onDragEnd(event);
                }
            },
        }

        return marker;
    }
}
