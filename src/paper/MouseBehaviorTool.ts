
declare module paper {
    interface Item {
        dragBehavior: MouseBehavior;
    } 
}

interface MouseBehavior {
    onClick?: (event: paper.ToolEvent) => void;
    
    onDragStart?: (event: paper.ToolEvent) => void; 
    onDrag?: (event: paper.ToolEvent) => void;
    onDragEnd?: (event: paper.ToolEvent) => void;
}

interface MouseAction {
    startEvent: paper.ToolEvent;
    item: paper.Item;
    dragged: boolean;
}

class MouseBehaviorTool extends paper.Tool {

    hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 5
    };

    action: MouseAction;
    
    constructor(paperScope: paper.PaperScope) {
        super();
    }

    onMouseDown = (event) => {
        this.action = null;

        var hitResult = paper.project.hitTest(
            event.point,
            this.hitOptions);

        if (hitResult && hitResult.item) {
            let draggable = this.findDraggableUpward(hitResult.item);
            if(draggable){
                this.action = <MouseAction>{
                        item: draggable
                    };
            }
            //this.paperScope.project.activeLayer.addChild(this.dragItem);
        }
    }

    onMouseMove = (event) => {
    }

    onMouseDrag = (event) => {
        if(this.action){
            if(!this.action.dragged){
                this.action.dragged = true;
                if(this.action.item.dragBehavior.onDragStart){
                    this.action.item.dragBehavior.onDragStart.call(
                        this.action.item, this.action.startEvent); 
                }
            }
            if(this.action.item.dragBehavior.onDrag){
                this.action.item.dragBehavior.onDrag.call(this.action.item, event);
            }
        }
    }
    
    onMouseUp = (event) => {
        if(this.action){
            let action = this.action;
            this.action = null;
            
            if(action.dragged){
                // drag
                if(action.item.dragBehavior.onDragEnd){
                    action.item.dragBehavior.onDragEnd.call(action.item, event);
                }   
            } else {
                // click
                if(action.item.dragBehavior.onClick){
                    action.item.dragBehavior.onClick.call(action.item, event);
                }
            }
        }
    }
    
    findDraggableUpward(item: paper.Item): paper.Item{
        while(!item.dragBehavior && item.parent && item.parent.className != 'Layer'){
            item = item.parent;
        }
        return item.dragBehavior
            ? item
            : null;
    }
}
