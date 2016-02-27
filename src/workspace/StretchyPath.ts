
class StretchyPath extends paper.Group {

    sourcePath: paper.CompoundPath;
    displayPath: paper.CompoundPath;
    arrangedPath: paper.CompoundPath;
    corners: paper.Segment[];
    outline: paper.Path;
    
    // True if we are using a custom shape instead
    //    of original (linear) text shape.
    shapeChanged: boolean;
    
    onOutlineChanged: (outline: paper.Path) => void;

    private _options: StretchyPathOptions;

    static OUTLINE_POINTS = 230;
    
    /**
     * For rebuilding the midpoint handles
     * as outline changes.
     */
    midpointGroup: paper.Group;
    segmentMarkersGroup: paper.Group;

    constructor(sourcePath: paper.CompoundPath,
        options?: StretchyPathOptions,
        position?: number[],
        paths?: { top: any, bottom: any }) {
        super();

        this._options = options || <StretchyPathOptions>{
            pathFillColor: 'gray'
        };

        this.setPath(sourcePath);

        if (position && position.length) {
            this.position = new paper.Point(position);
        }

        this.createOutline(paths);
        this.createSegmentMarkers();
        this.updateMidpiontMarkers();
        this.setEditElementsVisibility(false);

        this.arrangeContents();

        this.mouseBehavior = {}
            // // warning: MouseBehavior events are also set within WorkspaceController. 
            // //          Collision will happen eventually.
            // onOverStart: () => this.setEditElementsVisibility(true),
            // onOverEnd: () => this.setEditElementsVisibility(false)
    }

    get options(): StretchyPathOptions {
        return this._options;
    }

    set options(value: StretchyPathOptions) {
        if (!value) {
            return;
        }
        this._options = value;
        this.updateBackgroundColor();
        if (this.arrangedPath) {
            this.arrangedPath.fillColor = value.pathFillColor;
        }
    }

    get blockSelected(): boolean {
        return this.selected;
    }
    
    set blockSelected(value: boolean){
        this.selected = value;
        this.setEditElementsVisibility(value);
    }

    updatePath(path: paper.CompoundPath) {
        this.setPath(path);
        if (!this.shapeChanged) {
            this.outline.bounds.size = this.sourcePath.bounds.size;
            this.updateMidpiontMarkers();
            this.createSegmentMarkers();
        }
        this.arrangeContents();
    }

    private setPath(path: paper.CompoundPath) {
        if (this.sourcePath) {
            this.sourcePath.remove();
        }
        this.sourcePath = path;
        path.visible = false;
    }

    setEditElementsVisibility(value: boolean) {
        this.segmentMarkersGroup.visible = value;
        this.midpointGroup.visible = value;
        this.outline.strokeColor = value ? 'lightgray' : null;
    }

    arrangeContents() {
        this.updateMidpiontMarkers();
        this.arrangePath();
    }

    arrangePath() {
        let orthOrigin = this.sourcePath.bounds.topLeft;
        let orthWidth = this.sourcePath.bounds.width;
        let orthHeight = this.sourcePath.bounds.height;
        let sides = this.getOutlineSides();

        let top = sides[0];
        let bottom = sides[2];
        bottom.reverse();
        let projection = PaperHelpers.dualBoundsPathProjection(top, bottom);
        let transform = new PathTransform(point => {
            let relative = point.subtract(orthOrigin);
            let unit = new paper.Point(
                relative.x / orthWidth,
                relative.y / orthHeight);
            let projected = projection(unit);
            return projected;
        });

        for (let side of sides) {
            side.remove();
        }

        let newPath = PaperHelpers.traceCompoundPath(this.sourcePath,
            StretchyPath.OUTLINE_POINTS);
        newPath.visible = true;
        newPath.fillColor = this.options.pathFillColor;
        this.arrangedPath = newPath;

        this.updateBackgroundColor();

        transform.transformPathItem(newPath);

        if (this.displayPath) {
            this.displayPath.remove();
        }

        this.displayPath = newPath;
        this.insertChild(1, newPath);
    }

    /**
     * Get paths for outline sides, starting with top.
     */
    getOutlineSides(): paper.Path[] {
        let sides: paper.Path[] = [];
        let segmentGroup: paper.Segment[] = [];

        let cornerPoints = this.corners.map(c => c.point);
        let first = cornerPoints.shift();
        cornerPoints.push(first);

        let targetCorner = cornerPoints.shift();
        let segmentList = this.outline.segments.map(x => x);
        let i = 0;
        segmentList.push(segmentList[0]);
        for (let segment of segmentList) {
            segmentGroup.push(segment);
            if (targetCorner.isClose(segment.point, paper.Numerical.EPSILON)) {
                // finish path
                sides.push(new paper.Path(segmentGroup));
                segmentGroup = [segment];
                targetCorner = cornerPoints.shift();
            }
            i++;
        }

        if (sides.length !== 4) {
            console.error('sides', sides);
            throw 'failed to get sides';
        }

        return sides;
    }
    
    /**
     * paths should be clockwise: top is L -> R, bottom is R - L
     */
    private createOutline(paths?: { top: any, bottom: any }) {
        let outline: paper.Path

        if (paths) {
            const top = new paper.Path();
            top.importJSON(paths.top);
            const bottom = new paper.Path();
            bottom.importJSON(paths.bottom);
            const segments = top.segments.concat(bottom.segments);
            outline = new paper.Path(segments);
            // get corners as outline segment references
            this.corners = [
                outline.segments[0],
                outline.segments[top.segments.length - 1],    // last top segment
                outline.segments[top.segments.length],        // first bottom segment
                outline.segments[outline.segments.length - 1]
            ];
        } else {
            let bounds = this.sourcePath.bounds;
            outline = new paper.Path(
                PaperHelpers.corners(this.sourcePath.bounds));
            // get corners as outline segment references
            this.corners = outline.segments.map(s => s);
        }

        outline.closed = true;
        outline.dashArray = [5, 5];
        this.outline = outline;
        this.addChild(outline);
        this.updateBackgroundColor();
    }

    private updateBackgroundColor() {
        if (this.options && this.options.backgroundColor) {
            this.outline.fillColor = this.options.backgroundColor;
            this.outline.opacity = .9;
        } else {
            this.outline.fillColor = 'white';
            this.outline.opacity = 0;
        }
    }

    private createSegmentMarkers() {
        if (this.segmentMarkersGroup) {
            this.segmentMarkersGroup.remove();
        }
        let bounds = this.sourcePath.bounds;
        this.segmentMarkersGroup = new paper.Group();
        this.segmentMarkersGroup.bringToFront();
        for (let segment of this.outline.segments) {
            this.createSegmentHandle(segment);
        }
        this.addChild(this.segmentMarkersGroup);
    }

    private updateMidpiontMarkers() {
        if (this.midpointGroup) {
            this.midpointGroup.remove();
        }
        this.midpointGroup = new paper.Group();
        this.outline.curves.forEach(curve => {
            // skip left and right sides
            if (curve.segment1 === this.corners[1]
                || curve.segment1 === this.corners[3]) {
                return;
            }
            let handle = new CurveSplitterHandle(curve);
            handle.onDragStart = () => this.shapeChanged = true;
            handle.onDragEnd = (newSegment, event) => {
                // upgrade to segment hangle
                this.createSegmentHandle(newSegment);
                // remove midpoint handle
                handle.remove();
                this.onOutlineChanged && this.onOutlineChanged(this.outline);
                this.arrangeContents();
            };
            this.midpointGroup.addChild(handle);
        });
        this.addChild(this.midpointGroup);
    }

    private createSegmentHandle(segment: paper.Segment) {
        let handle = new SegmentHandle(segment);
        handle.onDragStart = () => this.shapeChanged = true;
        handle.onChangeComplete = () => {
            this.onOutlineChanged && this.onOutlineChanged(this.outline);
            this.arrangeContents();
        }
        this.segmentMarkersGroup.addChild(handle);
    }
}

interface StretchyPathOptions {
    pathFillColor: string;
    backgroundColor: string;
}
