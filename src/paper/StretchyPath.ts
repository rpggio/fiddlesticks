
class StretchyPath extends paper.Group {
    sourcePath: paper.CompoundPath;
    displayPath: paper.CompoundPath;
    top: MovableLine;
    bottom: MovableLine;

    constructor(sourcePath: paper.CompoundPath) {
        this.sourcePath = sourcePath;
        sourcePath.visible = false;

        this.top = new MovableLine(sourcePath.bounds.topLeft, sourcePath.bounds.topRight);
        this.top.path.strokeColor = 'lightgray';
        this.top.path.dashArray = [5, 5];
        this.top.onMoveComplete = path => this.arrange();
        
        this.bottom = new MovableLine(sourcePath.bounds.bottomLeft, sourcePath.bounds.bottomRight);
        this.bottom.path.strokeColor = 'lightgray';
        this.bottom.path.dashArray = [5, 5];
        this.bottom.onMoveComplete = path => this.arrange();

        super([
            this.top,
            this.bottom
        ]);
        
        this.arrange();
        
        // todo: need background rectangle?
        // this.on('mousedrag', event => {
        //     console.log('stretch.drag', event);
        // });
        
    }

    arrange() {
        let orthOrigin = this.sourcePath.bounds.topLeft;
        let orthWidth = this.sourcePath.bounds.width;
        let orthHeight = this.sourcePath.bounds.height;
        let projection = PaperHelpers.pathProjection(this.top.path, this.bottom.path);
        let transform = new PathTransform(point => {
            let relative = point.subtract(orthOrigin);
            let unit = new paper.Point(
                relative.x / orthWidth,
                relative.y / orthHeight);
            let projected = projection(unit);
            return projected;
        });
        
        let newPath = <paper.CompoundPath>this.sourcePath.clone();
        newPath.visible = true;
        newPath.fillColor = 'lightblue';
        //newPath.fillColor = new paper.Color(Math.random(), Math.random(), Math.random());
        
        transform.transformPathItem(newPath);

        if(this.displayPath){
            this.displayPath.remove();
        }
        
        this.displayPath = newPath;
        this.addChild(newPath);
    }
}
