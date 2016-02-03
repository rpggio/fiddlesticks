
class StretchyPath extends paper.Group {
    sourcePath: paper.CompoundPath;
    displayPath: paper.CompoundPath;
    handles: PointHandle[];

    constructor(sourcePath: paper.CompoundPath) {
        this.sourcePath = sourcePath;
        sourcePath.visible = false;

        let bounds = sourcePath.bounds;

        let region = new paper.Path([
                new paper.Segment(bounds.topLeft),
                new paper.Segment(bounds.topRight),
                new paper.Segment(bounds.bottomRight),
                new paper.Segment(bounds.bottomLeft)
            ]);
        region.fillColor = 'white';
        region.strokeColor = 'lightgray';
        region.dashArray = [5,5];
        region.dragBehavior = {
            draggable: true,
            onDrag: event => this.position = this.position.add(event.delta)
        };
        
        let dragMarkers: paper.Item[] = [
            Elements.dragMarker(bounds.topLeft),
            Elements.dragMarker(bounds.topRight),
            Elements.dragMarker(bounds.bottomRight),
            Elements.dragMarker(bounds.bottomLeft)
        ];
        
        // Create handles to update markers and segments.
        this.handles = [];
        for(let i = 0; i < 4; i++) {
            let handle = new PointHandle([
                    region.segments[i],
                    dragMarkers[i]
                ]);
            this.handles.push(handle);
        }
        
        // add draggable behavior to markers.
        this.handles.forEach((h,i) => {
            dragMarkers[i].dragBehavior = {
                draggable: true,
                onDrag: event => {
                    h.set(h.get().add(event.delta));
                },
                onDragEnd: event => {
                    this.arrangePath();
                }
            };
        })

        let children = [];
        children.push(region);
        children = children.concat(dragMarkers);
        super(children);
        
        this.arrangePath();        
    }

    arrangePath() {
        let orthOrigin = this.sourcePath.bounds.topLeft;
        let orthWidth = this.sourcePath.bounds.width;
        let orthHeight = this.sourcePath.bounds.height;
        let top = new paper.Path([this.handles[0].get(), this.handles[1].get()]);
        let bottom = new paper.Path([this.handles[3].get(), this.handles[2].get()]);
        let projection = PaperHelpers.pathProjection(top, bottom);
        let transform = new PathTransform(point => {
            let relative = point.subtract(orthOrigin);
            let unit = new paper.Point(
                relative.x / orthWidth,
                relative.y / orthHeight);
            let projected = projection(unit);
            return projected;
        });
        top.remove();
        bottom.remove();
        
        let newPath = <paper.CompoundPath>this.sourcePath.clone();
        newPath.visible = true;
        newPath.fillColor = 'lightblue';
        //newPath.fillColor = new paper.Color(Math.random(), Math.random(), Math.random());
        
        transform.transformPathItem(newPath);

        if(this.displayPath){
            this.displayPath.remove();
        }
        
        this.displayPath = newPath;
        this.insertChild(1, newPath);
    }
}
