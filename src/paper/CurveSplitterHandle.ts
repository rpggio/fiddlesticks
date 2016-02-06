
/**
 * Handle that sits on midpoint of curve
 *   which will split the curve when dragged.
 */
class CurveSplitterHandle extends paper.Shape {
 
    curve: paper.Curve;
    onDragEnd: (newSegment: paper.Segment, event: paper.ToolEvent) => void;
 
    constructor(curve: paper.Curve){
        super();

        this.curve = curve;
        
        let self = <any>this;
        self._type = 'circle';
        self._radius = 5;
        self._size = new paper.Size(self._radius * 2);
        this.translate(curve.getPointAt(0.5 * curve.length));
        
        this.strokeWidth = 2;
        this.strokeColor = 'blue';
        this.fillColor = 'white';
        this.opacity = 0.5 * 0.3; 
 
        let newSegment: paper.Segment;
        this.mouseBehavior = <MouseBehavior>{
            onDragStart: (event) => {
                newSegment = new paper.Segment(this.position);
                curve.path.insert(
                    curve.index + 1, 
                    newSegment
                );
            },
            onDragMove: event => {
                let newPos = this.position.add(event.delta);
                this.position = newPos;
                newSegment.point = newPos;
            },
            onDragEnd: event => {
                if(this.onDragEnd){
                    this.onDragEnd(newSegment, event);
                }
            }
        };
    }
}
