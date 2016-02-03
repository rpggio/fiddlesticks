
declare module paper {
    interface Item {
        dragBehavior: DragBehavior;
    } 
}

interface DragBehavior {
    draggable: boolean;
    onDrag?: (event: paper.ToolEvent) => void;
    onDragEnd?: (event: paper.ToolEvent) => void;
}

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

        if (hitResult
            && hitResult.item
            && hitResult.item.dragBehavior
            && hitResult.item.dragBehavior.draggable) {
            this.dragItem = hitResult.item;
            //this.paperScope.project.activeLayer.addChild(this.dragItem);
        }
    }

    onMouseMove(event) {
    }

    onMouseDrag(event) {
        if(this.dragItem && this.dragItem.dragBehavior.onDrag){
            this.dragItem.dragBehavior.onDrag.call(this.dragItem, event);
        }
    }
    
    onMouseUp(event){
        if(this.dragItem){
            if(this.dragItem.dragBehavior.onDragEnd){
                this.dragItem.dragBehavior.onDragEnd.call(this.dragItem, event);
            }
            this.dragItem = null;
        }
    }
}
