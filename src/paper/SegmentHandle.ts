
class SegmentHandle extends paper.Shape {
 
    defaultRadius = 4;
 
    constructor(){
        super();
        
        this.type = 'circle';
        this.radius = this.defaultRadius;
        this.size = new paper.Size(this.defaultRadius * 2);
        this.strokeWidth = 2;
        this.strokeColor = 'blue';
        this.fillColor = 'white';
        this.opacity = 0.3;
        
        
    }
}
