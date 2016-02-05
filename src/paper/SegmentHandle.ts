
class SegmentHandle extends DragHandleShape {
 
    segment: paper.Segment;
    onDragEnd: (event: paper.ToolEvent) => void;
 
    constructor(segment: paper.Segment, radius?: number){
        super(segment.point, radius);
        
        this.segment = segment;

        this.dragBehavior = <MouseBehavior>{
            onDrag: event => {
                let newPos = this.position.add(event.delta);
                this.position = newPos;
                segment.point = newPos;
            },
            onDragEnd: event => {
                if(this.onDragEnd){
                    this.onDragEnd(event);
                }
            }
        }
    }
}
