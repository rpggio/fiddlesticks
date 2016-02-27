
class StretchPath extends paper.Path {

    static HANDLE_RADIUS = 15;

    private _handles: PathHandle[] = [];

    constructor(segments: paper.Segment[], style?: paper.Style) {
        super(segments);

        if(style){
            this.style = style;
        } else {
            this.strokeColor = "gray";
        }
        
        for(const s of this.segments){
            this.addSegmentHandle(s);
        }
        
        for(const c of this.curves){
            this.addCurveHandle(c);
        }
    }
    
    private addSegmentHandle(segment: paper.Segment){
        let handle = new PathHandle(segment);
        this._handles.push(handle);
        this.addChild(handle);
    }
    
    private addCurveHandle(curve: paper.Curve){
        let handle = new PathHandle(curve);
        handle.curveSplit.subscribeOne(curveIdx => {
            this.addCurveHandle(this.curves[curveIdx]);
            this.addCurveHandle(this.curves[curveIdx + 1]);
        });
        this._handles.push(handle);
        this.addChild(handle);
    }
}