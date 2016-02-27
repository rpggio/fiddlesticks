

class DualBoundsPathWarp extends paper.Group {

    static POINTS_PER_PATH = 200;

    private _source: paper.CompoundPath;
    private _upper: StretchPath;
    private _lower: StretchPath;
    private _warped: paper.CompoundPath;
    private _outline: paper.Path;

    constructor(
        source: paper.CompoundPath,
        bounds?: { upper: paper.Path, lower: paper.Path }) {

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
        this._outline.style = {
            fillColor: "white",
        };
        this._outline.opacity = 0.5;
        this.updateOutlineShape();

        this._warped = new paper.CompoundPath(source.pathData);
        // take drawn style from source
        this._warped.style = this._source.style;
              
        this._source.clone();
              
        this.warp();

        // -- add children --

        this.addChildren([this._outline, this._warped, this._upper, this._lower]);

        // -- set up observers --

        const boundsWatch = (flags: PaperNotify.ChangeFlag) => {
            if (flags & PaperNotify.ChangeFlag.SEGMENTS) {
                this.updateOutlineShape();
                this.warp();
            }
        };
        this._upper.observe(boundsWatch);
        this._lower.observe(boundsWatch);

        source.observe(flags => {
            if (flags & PaperNotify.ChangeFlag.GEOMETRY | PaperNotify.ChangeFlag.SEGMENTS) {
                this.warp();
            }
        })
    }

    warp() {
        let orthOrigin = this._source.bounds.topLeft;
        let orthWidth = this._source.bounds.width;
        let orthHeight = this._source.bounds.height;

        let projection = PaperHelpers.dualBoundsPathProjection(
            this._upper, this._lower);
        let transform = new PathTransform(point => {
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