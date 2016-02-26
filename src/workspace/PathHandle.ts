
class PathHandle extends paper.Group {

    static MARKER_RADIUS = 15;

    private _marker: paper.Shape;
    private _segment: paper.Segment;
    private _curve: paper.Curve;
    private _smoothed: boolean;
    private _curveSplit = new ObservableEvent<number>();
    private _curveUnSub: () => void; 

    constructor(attach: paper.Segment | paper.Curve) {
        super();

        let position: paper.Point;
        if (attach instanceof paper.Segment) {
            this._segment = <paper.Segment>attach;
            position = this._segment.point;
        } else if (attach instanceof paper.Curve) {
            this._curve = <paper.Curve>attach;
            position = this._curve.getPointAt(this._curve.length * 0.5);
            this._curveUnSub = this._curve.path.observe(flags => {
                if (flags & PaperNotify.ChangeFlag.GEOMETRY) {
                    this.center = this._curve.getPointAt(this._curve.length * 0.5);
                } 
            });
        } else {
            throw "attach must be Segment or Curve";
        }

        this._marker = paper.Shape.Circle(position, PathHandle.MARKER_RADIUS);
        this._marker.strokeColor = "blue";
        this._marker.fillColor = "white";
        this.addChild(this._marker);

        if (this._segment) {
            this.styleAsSegment();
        } else {
            this.styleAsCurve();
        }

        this.mouseBehavior = {
            onDragStart: event => {
                if (this._curve) {
                    // split the curve, 'eclose' to segment handle
                    this._curveUnSub();
                    this._segment = new paper.Segment(this.position);
                    const curveIdx = this._curve.index;
                    this._curve.path.insert(
                        curveIdx + 1,
                        this._segment
                    );
                    this._curve = null;
                    this.styleAsSegment();
                    this.curveSplit.notify(curveIdx);
                }
            },
            onDragMove: event => {
                let newPos = this.position.add(event.delta);
                this.position = newPos; 
                if (this._segment) {
                    this._segment.point = newPos;
                }
            },
            onDragEnd: event => {
                if (this._smoothed) {
                    this._segment.smooth();
                }
            },
            onClick: event => {
                if(this._segment) {
                    this.smoothed = !this.smoothed;
                }
            }
        }
    }

    get smoothed(): boolean {
        return this._smoothed;
    }

    set smoothed(value: boolean) {
        this._smoothed = value;

        if (value) {
            this._segment.smooth();
        } else {
            this._segment.handleIn = null;
            this._segment.handleOut = null;
        }
    }
    
    get curveSplit() {
        return this._curveSplit;
    }

    get center(): paper.Point {
        return this.position;
    }

    set center(point: paper.Point) {
        this.position = point;
    }

    private styleAsSegment() {
        this._marker.opacity = 0.8;
    }

    private styleAsCurve() {
        this._marker.opacity = 0.3;
    }

}