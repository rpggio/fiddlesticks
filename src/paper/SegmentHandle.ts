
class SegmentHandle extends paper.Shape {
 
    segment: paper.Segment;
    onDragEnd: (event: paper.ToolEvent) => void;
 
    constructor(segment: paper.Segment, radius?: number){
        super();
        
        this.segment = segment;

        let self = <any>this;
        self._type = 'circle';
        self._radius = 5;
        self._size = new paper.Size(self._radius * 2);
        this.translate(segment.point);
        
        this.strokeWidth = 2;
        this.strokeColor = 'blue';
        this.fillColor = 'white';
        this.opacity = 0.5; 

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
