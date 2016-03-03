
class StretchPath extends paper.Path {

    private _handles: PathHandle[] = [];

    constructor(segments: paper.Segment[], style?: paper.Style) {
        super(segments);

        if(style){
            this.style = style;
        } else {
            this.strokeColor = "lightgray";
            this.strokeWidth = 6;
        }
        
        for(const s of this.segments){
            this.addSegmentHandle(s);
        }
        
        for(const c of this.curves){
            this.addCurveHandle(c);
        }
        
        this.observe(flags => {
           if(flags & PaperNotify.ChangeFlag.ATTRIBUTE){
               if(this._handles[0].visible != this.visible)
               for(const h of this._handles){
                   h.visible = this.visible;
               }
           } 
        });
    }
    
    private addSegmentHandle(segment: paper.Segment){
        let handle = new PathHandle(segment);
        handle.visible = this.visible;
        this._handles.push(handle);
        this.addChild(handle);
    }
    
    private addCurveHandle(curve: paper.Curve){
        let handle = new PathHandle(curve);
        handle.visible = this.visible;
        handle.curveSplit.subscribeOne(curveIdx => {
            this.addCurveHandle(this.curves[curveIdx]);
            this.addCurveHandle(this.curves[curveIdx + 1]);
        });
        this._handles.push(handle);
        this.addChild(handle);
    }
}