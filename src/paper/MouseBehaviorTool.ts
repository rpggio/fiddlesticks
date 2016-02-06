
declare module paper {
    interface Item {
        mouseBehavior: MouseBehavior;
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
                if(this.action.item.mouseBehavior.onDragStart){
                    this.action.item.mouseBehavior.onDragStart.call(
                        this.action.item, this.action.startEvent); 
                }
            }
            if(this.action.item.mouseBehavior.onDrag){
                this.action.item.mouseBehavior.onDrag.call(this.action.item, event);
            }
        }
    }
    
    onMouseUp = (event) => {
        if(this.action){
            let action = this.action;
            this.action = null;
            
            if(action.dragged){
                // drag
                if(action.item.mouseBehavior.onDragEnd){
                    action.item.mouseBehavior.onDragEnd.call(action.item, event);
                }   
            } else {
                // click
                if(action.item.mouseBehavior.onClick){
                    action.item.mouseBehavior.onClick.call(action.item, event);
                }
            }
        }
    }
    
    onKeyDown = (event) => {
       if (event.key == 'space') {
		  paper.project.activeLayer.selected = !paper.project.activeLayer.selected;
	   }
    }
    
    findDraggableUpward(item: paper.Item): paper.Item{
        while(!item.mouseBehavior && item.parent && item.parent.className != 'Layer'){
            item = item.parent;
        }
        return item.mouseBehavior
            ? item
            : null;
    }
}
