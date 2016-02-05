
/**
 * Handle that sits on midpoint of curve
 * which will split the curve when dragged.
 */
class CurveSplitterHandle extends DragHandleShape {
 
    curve: paper.Curve;
    onDragEnd: (newSegment: paper.Segment, event: paper.ToolEvent) => void;
 
    constructor(curve: paper.Curve, radius?: number){
        super(curve.getPointAt(0.5 * curve.length), radius);

        this.curve = curve;
        this.opacity = this.opacity * 0.3; 

        let newSegment: paper.Segment;
        this.dragBehavior = <MouseBehavior>{
            onDragStart: (event) => {
                newSegment = new paper.Segment(this.position);
                curve.path.insert(
                    curve.index + 1, 
                    newSegment
                );
                newSegment.smooth();
            },
            onDrag: event => {
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
