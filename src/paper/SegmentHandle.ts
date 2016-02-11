
class SegmentHandle extends paper.Shape {
 
    segment: paper.Segment;
    onChangeComplete: (event: paper.ToolEvent) => void;
    
    private _smoothed: boolean;
 
    constructor(segment: paper.Segment, radius?: number){
        super();
        
        this.segment = segment;

        let self = <any>this;
        self._type = 'circle';
        self._radius = 15;
        self._size = new paper.Size(self._radius * 2);
        this.translate(segment.point);
        
        this.strokeWidth = 2;
        this.strokeColor = 'blue';
        this.fillColor = 'white';
        this.opacity = 0.7; 

        this.mouseBehavior = <MouseBehavior>{
            onDragMove: event => {
                let newPos = this.position.add(event.delta);
                this.position = newPos;
                segment.point = newPos;
            },
            onDragEnd: event => {
                if(this._smoothed){
                    this.segment.smooth();
                }
                if(this.onChangeComplete){
                    this.onChangeComplete(event);
                }
            },
            onClick: event => {
                this.smoothed = !this.smoothed;
                if(this.onChangeComplete){
                    this.onChangeComplete(event);
                }
            }
        }
    }
    
    get smoothed(): boolean {
        return this._smoothed;
    }
    
    set smoothed(value: boolean){
        this._smoothed = value;
        
        if(value) {
            this.segment.smooth();
        } else {
            this.segment.handleIn = null;
            this.segment.handleOut = null;
        }
    }
}
