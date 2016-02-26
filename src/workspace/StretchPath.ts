
class StretchPath extends paper.Group {

    static HANDLE_RADIUS = 15;

    private _path: paper.Path;
    private _handles: PathHandle[] = [];

    constructor(segments: paper.Segment[], style?: paper.Style) {
        super();

        this._path = new paper.Path(segments);
        if(style){
            this._path.style = style;
        } else {
            this._path.strokeColor = "gray";
        }
        this.addChild(this._path);
        
        for(const s of this._path.segments){
            this.addSegmentHandle(s);
        }
        
        for(const c of this._path.curves){
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
            this.addCurveHandle(this._path.curves[curveIdx]);
            this.addCurveHandle(this._path.curves[curveIdx + 1]);
        });
        this._handles.push(handle);
        this.addChild(handle);
    }

}