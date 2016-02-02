// <reference path="typings/paper.d.ts" />

class LineDrawTool {
    group = new paper.Group();
    currentPath: paper.Path;
    onPathFinished: (path: paper.Path) => void;

    constructor() {
        var tool = new paper.Tool();

        tool.onMouseDrag = event => {
            let point = event.middlePoint;

            if (!this.currentPath) {
                this.startPath(point);
                return;
            }

            this.appendPath(point);
        }

        tool.onMouseUp = event => {
            this.finishPath();
        }
    }

    startPath(point) {
        if (this.currentPath) {
            this.finishPath();
        }
        this.currentPath = new paper.Path({ strokeColor: 'lightgray', strokeWidth: 2 });
        this.group.addChild(this.currentPath);
        this.currentPath.add(point);
    }

    appendPath(point) {
        if (this.currentPath) {
            this.currentPath.add(point);
        }
    }

    finishPath() {
        if (this.currentPath) {
            this.currentPath.simplify(5);
            let path = this.currentPath;
            this.currentPath = null;
            if (this.onPathFinished) {
                this.onPathFinished.call(this, path);
            }
        }
    }
}