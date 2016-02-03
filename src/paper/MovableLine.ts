
class MovableLine extends paper.Group {

    path: paper.Path;
    onMoveComplete: (segment: paper.Segment) => void;

    startHandle: PointHandle;
    endHandle: PointHandle;

    constructor(a: paper.Point, b: paper.Point) {
        this.path = paper.Path.Line(a, b);

        let startMarker = paper.Shape.Circle(a, 5);
        startMarker.fillColor = 'blue';
        this.addChild(startMarker);
        this.startHandle = new PointHandle([this.path.segments[0], startMarker]);
        startMarker.data = {
            onDrag: (event: paper.ToolEvent) =>
                this.startHandle.set(this.startHandle.get().add(event.delta)),
            onDragEnd: (event: paper.ToolEvent) => {
                this.onMoveComplete && this.onMoveComplete(this.path.segments[0]);
            }
        };
        
        let endMarker = paper.Shape.Circle(b, 5);
        endMarker.fillColor = 'blue';
        this.addChild(endMarker);
        this.endHandle = new PointHandle([this.path.segments[1], endMarker]);
        endMarker.data = {
            onDrag: (event: paper.ToolEvent) =>
                this.endHandle.set(this.endHandle.get().add(event.delta)),
            onDragEnd: (event: paper.ToolEvent) => {
                this.onMoveComplete && this.onMoveComplete(this.path.segments[1]);
            }
        };
        
        super([
            this.path, startMarker, endMarker
        ]);
    }
}
