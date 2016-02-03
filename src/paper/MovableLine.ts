
class MovableLine extends paper.Group {

    path: paper.Path;
    onMoveComplete: (segment: paper.Segment) => void;

    constructor(a: paper.Point, b: paper.Point) {
        this.path = paper.Path.Line(a, b);

        let aMarker = paper.Shape.Circle(a, 5);
        aMarker.fillColor = 'blue';
        this.addChild(aMarker);
        let aHandle = new PointHandle([this.path.segments[0], aMarker]);
        aMarker.data = {
            onDrag: (event: paper.ToolEvent) =>
                aHandle.set(aHandle.get().add(event.delta)),
            onDragEnd: (event: paper.ToolEvent) => {
                this.onMoveComplete && this.onMoveComplete(this.path.segments[0]);
            }
        };
        
        let bMarker = paper.Shape.Circle(b, 5);
        bMarker.fillColor = 'blue';
        this.addChild(bMarker);
        let bHandle = new PointHandle([this.path.segments[1], bMarker]);
        bMarker.data = {
            onDrag: (event: paper.ToolEvent) =>
                bHandle.set(bHandle.get().add(event.delta)),
            onDragEnd: (event: paper.ToolEvent) => {
                this.onMoveComplete && this.onMoveComplete(this.path.segments[1]);
            }
        };
        
        super([
            this.path, aMarker, bMarker
        ]);
    }
}
