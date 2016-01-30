// <reference path="typings/paper.d.ts" />


// WORK IN PROGRESS
class DragTool {
    values = {
        paths: 50,
        minPoints: 5,
        maxPoints: 15,
        minRadius: 30,
        maxRadius: 90
    };

    hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 5
    };

    paperScope: paper.PaperScope;
    segment;
    path;
    movePath = false;

    constructor(paperScope: paper.PaperScope) {
        this.paperScope = paperScope;
        var tool = new paper.Tool();
        tool.onMouseDown = event => this.onMouseDown(event);
        tool.onMouseMove = event => this.onMouseMove(event);
        tool.onMouseDrag = event => this.onMouseDrag(event);
    }

    onMouseDown(event) {
        this.segment = this.path = null;

        var hitResult = this.paperScope.project.hitTest(event.point,
            this.hitOptions);
        if (!hitResult)
            return;

        if (event.modifiers.shift) {
            if (hitResult.type == 'segment') {
                hitResult.segment.remove();
            };
            return;
        }

        if (hitResult) {
            this.path = hitResult.item;
            if (hitResult.type == 'segment') {
                this.segment = hitResult.segment;
            } else if (hitResult.type == 'stroke') {
                var location = hitResult.location;
                this.segment = this.path.insert(location.index + 1, event.point);
                this.path.smooth();
            }
        }
        this.movePath = hitResult.type == 'fill';
        if (this.movePath)
            this.paperScope.project.activeLayer.addChild(hitResult.item);
    }

    onMouseMove(event) {
        this.paperScope.project.activeLayer.selected = false;
        if (event.item)
            event.item.selected = true;
    }

    onMouseDrag(event) {
        if (this.segment) {
            this.segment.point += event.delta;
            this.path.smooth();
        } else if (this.path) {
            this.path.position += event.delta;
        }
    }
}
