
class DragTool {

    hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 5
    };

    paperScope: paper.PaperScope;
    dragItem: paper.Item;

    constructor(paperScope: paper.PaperScope) {
        this.paperScope = paperScope;
        var tool = new paper.Tool();
        tool.onMouseDown = event => this.onMouseDown(event);
        tool.onMouseMove = event => this.onMouseMove(event);
        tool.onMouseDrag = event => this.onMouseDrag(event);
        tool.onMouseUp = event => this.onMouseUp(event);
    }

    onMouseDown(event) {
        this.dragItem = null;

        var hitResult = this.paperScope.project.hitTest(
            event.point,
            this.hitOptions);

            console.log(hitResult);

        if (hitResult
            && hitResult.item
            && hitResult.item.data
            && hitResult.item.data.onDrag) {
            this.dragItem = hitResult.item;
            console.log('starting drag', this.dragItem);
            this.paperScope.project.activeLayer.addChild(this.dragItem);
        }
    }

    onMouseMove(event) {
    }

    onMouseDrag(event) {
        if(this.dragItem){
            this.dragItem.data.onDrag(event);
        }
    }
    
    onMouseUp(event){
        if(this.dragItem){
            if(this.dragItem.data && this.dragItem.data.onDragEnd){
                this.dragItem.data.onDragEnd(event);
            }
            this.dragItem = null;
        }
    }
}
