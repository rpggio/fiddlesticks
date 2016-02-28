
class DualBoundsPathWarp extends paper.Group {

    static POINTS_PER_PATH = 200;

    mouseBehavior: MouseBehavior = {};

    private _source: paper.CompoundPath;
    private _upper: StretchPath;
    private _lower: StretchPath;
    private _warped: paper.CompoundPath;
    private _outline: paper.Path;
    private _customStyle: SketchItemStyle;

    constructor(
        source: paper.CompoundPath,
        bounds?: { upper: paper.Path, lower: paper.Path },
        customStyle?: SketchItemStyle) {

        super();

        // -- build children --
        
        this._source = source;
        this._source.visible = false;

        if (bounds) {
            this._upper = new StretchPath(bounds.upper.segments);
            this._lower = new StretchPath(bounds.lower.segments);
        } else {
            this._upper = new StretchPath([
                new paper.Segment(source.bounds.topLeft),
                new paper.Segment(source.bounds.topRight)
            ]);
            this._lower = new StretchPath([
                new paper.Segment(source.bounds.bottomLeft),
                new paper.Segment(source.bounds.bottomRight)
            ]);
        }

        this._outline = new paper.Path();
        this.updateOutlineShape();

        this._warped = new paper.CompoundPath(source.pathData);
        this.updateWarped();

        // -- add children --

        this.addChildren([this._outline, this._warped, this._upper, this._lower]);

        // -- assign style --

        this.customStyle = customStyle || {
            strokeColor: "lightgray"
        };

        // -- set up observers --

        const boundsWatch = (flags: PaperNotify.ChangeFlag) => {
            if (flags & PaperNotify.ChangeFlag.SEGMENTS) {
                this.updateOutlineShape();
                this.updateWarped();
            }
        };
        this._upper.observe(boundsWatch);
        this._lower.observe(boundsWatch);

//         source.observe(flags => {
// console.warn(PaperNotify.describe(flags))
//             if (flags & PaperNotify.ChangeFlag.GEOMETRY | PaperNotify.ChangeFlag.SEGMENTS) {
//                 this.warp();
//             }
//         })
    }

    get upper(): paper.Path{
        return this._upper;
    }
    
    get lower(): paper.Path {
        return this._lower;
    }
    
    get source(): paper.CompoundPath {
        return <paper.CompoundPath>this._source.clone();
    }
    
    set source(value: paper.CompoundPath){
        this._source = value;
        this.updateWarped();
    }

    get customStyle(): SketchItemStyle {
        return this._customStyle;
    }
    
    set customStyle(value: SketchItemStyle){
        this._customStyle = value;
        this._warped.style = value;
        if(value.backgroundColor){
            this._outline.fillColor = value.backgroundColor;
            this._outline.opacity = 1;
        } else {
            this._outline.fillColor = "white";
            this._outline.opacity = 0;
        }
    }

    private updateWarped() {
        console.warn("warp");
        let orthOrigin = this._source.bounds.topLeft;
        let orthWidth = this._source.bounds.width;
        let orthHeight = this._source.bounds.height;

        let projection = PaperHelpers.dualBoundsPathProjection(
            this._upper, this._lower);
        let transform = new PathTransform(point => {
            if(!point){
                return point;
            }
            let relative = point.subtract(orthOrigin);
            let unit = new paper.Point(
                relative.x / orthWidth,
                relative.y / orthHeight);
            let projected = projection(unit);
            return projected;
        });

        const newPaths = this._source.children
            .map(item => {
                const path = <paper.Path>item;
                const xPoints = PaperHelpers.tracePathAsPoints(path,
                    DualBoundsPathWarp.POINTS_PER_PATH)
                    .map(p => transform.transformPoint(p));
                const xPath = new paper.Path({
                    segments: xPoints,
                    closed: true,
                    clockwise: path.clockwise
                });
                //xPath.simplify();
                return xPath;
            })
        this._warped.removeChildren();
        this._warped.addChildren(newPaths);
    }

    private updateOutlineShape() {
        const lower = new paper.Path(this._lower.segments);
        lower.reverse();
        this._outline.segments = this._upper.segments.concat(lower.segments);
        lower.remove();
    }

}