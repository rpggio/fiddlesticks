
class PointHandle {

    refs: PointRef[];

    private _position: paper.Point;

    get() : paper.Point {
        return this._position;
    }

    constructor(entities: Object[]){
        
        this.refs = [];
        
        for(let e of entities){
            if(e instanceof paper.Segment){
                this.addRef(PointRef.SegmentPoint(<paper.Segment>e));
            } else if (e instanceof paper.Item){
                this.addRef(PointRef.ItemPosition(<paper.Item>e));
            } else {
                throw 'cannot create handle for ' + e;
            }
        }
    
        this._position = this.refs.length
            ? this.refs[0].get()
            : new paper.Point(0,0);
    }

    addRef(ref: PointRef){
        this.refs.push(ref);
    }
    
    set(point: paper.Point) {
        this._position.set(point.x, point.y);
        for(let r of this.refs){
            r.set(point);
        }    
    }
}

class PointRef {
    
    getter: () => paper.Point;
    setter: (point: paper.Point) => void;
    
    constructor(
        getter: () => paper.Point,
        setter: (point: paper.Point) => void
    ){
        this.getter = getter;
        this.setter = setter;
    }
    
    set(point: paper.Point){
        this.setter(point);
    }
    
    get() : paper.Point {
        return this.getter();
    }
    
    static ItemPosition(item: paper.Item): PointRef {
        return new PointRef(
            () => item.position,
            p => item.position = p
        );
    }
    
    static SegmentPoint(segment: paper.Segment): PointRef {
        return new PointRef(
            () => segment.point,
            p => segment.point = p
        );
    }
}

