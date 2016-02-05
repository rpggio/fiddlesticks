
class DragHandleShape extends paper.Shape {
 
    defaultRadius = 5;
 
    constructor(center: paper.Point, radius?: number){
        super();
        
        if(radius == null){
            radius = this.defaultRadius;
        }

        let self = <any>this;
        self._type = 'circle';
        self._radius = radius;
        self._size = new paper.Size(radius * 2);
        this.translate(center);
        
        this.strokeWidth = 2;
        this.strokeColor = 'blue';
        this.fillColor = 'white';
        this.opacity = 0.5;
    }
}
