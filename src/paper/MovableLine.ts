
class MovableLine extends paper.Group {

    path: paper.Path;
    onMoveComplete: (path: paper.Path) => void;

    constructor(a: paper.Point, b: paper.Point) {
        this.path = paper.Path.Line(a, b);

        let aMarker = paper.Shape.Circle(a, 5);
        aMarker.fillColor = 'blue';
        this.addChild(aMarker);
        let movedA = false;
        aMarker.on('mousedrag', event => {
            aMarker.translate(event.delta);
            let seg = this.path.segments[0];
            seg.point = seg.point.add(event.delta);
            movedA = true;
        });
        aMarker.on('mouseup', event => {
            if(movedA && this.onMoveComplete){
                this.onMoveComplete(this.path);
            }
            movedA = false;
        });

        let bMarker = paper.Shape.Circle(b, 5);
        bMarker.fillColor = 'blue';
        this.addChild(bMarker);
        let movedB = false;
        bMarker.on('mousedrag', event => {
            bMarker.translate(event.delta);
            let seg = this.path.segments[1];
            seg.point = seg.point.add(event.delta);
            movedB = true;
        });
        bMarker.on('mouseup', event => {
            if(movedB && this.onMoveComplete){
                this.onMoveComplete(this.path);
            }
            movedB = false;
        });

        super([
            this.path, aMarker, bMarker
        ]);
    }
}