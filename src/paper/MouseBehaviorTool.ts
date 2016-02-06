
declare module paper {
    interface Item {
        mouseBehavior: MouseBehavior;
    }
}

interface MouseBehavior {
    onClick?: (event: paper.ToolEvent) => void;

    onOverStart?: (event: paper.ToolEvent) => void;
    onOverMove?: (event: paper.ToolEvent) => void;
    onOverEnd?: (event: paper.ToolEvent) => void;

    onDragStart?: (event: paper.ToolEvent) => void;
    onDragMove?: (event: paper.ToolEvent) => void;
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

    pressAction: MouseAction;
    hoverAction: MouseAction;

    constructor(paperScope: paper.PaperScope) {
        super();
    }

    onMouseDown = (event) => {
        this.pressAction = null;

        var hitResult = paper.project.hitTest(
            event.point,
            this.hitOptions);

        if (hitResult && hitResult.item) {
            let draggable = this.findDragHandler(hitResult.item);
            if (draggable) {
                this.pressAction = <MouseAction>{
                    item: draggable
                };
            }
            //this.paperScope.project.activeLayer.addChild(this.dragItem);
        }
    }

    onMouseMove = (event) => {
        var hitResult = paper.project.hitTest(
            event.point,
            this.hitOptions);
        let handlerItem = hitResult
            && this.findOverHandler(hitResult.item);

        if (
            // were previously hovering
            this.hoverAction
            && (
                // not hovering over anything now
                handlerItem == null
                // not hovering over current handler or descendent thereof
                || !MouseBehaviorTool.isSameOrAncestor(
                    hitResult.item,
                    this.hoverAction.item))
        ) {
            // just leaving
            if (this.hoverAction.item.mouseBehavior.onOverEnd) {
                this.hoverAction.item.mouseBehavior.onOverEnd(event);
            }
            this.hoverAction = null;
        }

        if (handlerItem && handlerItem.mouseBehavior) {
            let behavior = handlerItem.mouseBehavior;
            if (!this.hoverAction) {
                this.hoverAction = <MouseAction>{
                    item: handlerItem
                };
                if (behavior.onOverStart) {
                    behavior.onOverStart(event);
                }
            }
            if (behavior && behavior.onOverMove) {
                behavior.onOverMove(event);
            }
        }
    }

    onMouseDrag = (event) => {
        if (this.pressAction) {
            if (!this.pressAction.dragged) {
                this.pressAction.dragged = true;
                if (this.pressAction.item.mouseBehavior.onDragStart) {
                    this.pressAction.item.mouseBehavior.onDragStart.call(
                        this.pressAction.item, this.pressAction.startEvent);
                }
            }
            if (this.pressAction.item.mouseBehavior.onDragMove) {
                this.pressAction.item.mouseBehavior.onDragMove.call(this.pressAction.item, event);
            }
        }
    }

    onMouseUp = (event) => {
        if (this.pressAction) {
            let action = this.pressAction;
            this.pressAction = null;

            if (action.dragged) {
                // drag
                if (action.item.mouseBehavior.onDragEnd) {
                    action.item.mouseBehavior.onDragEnd.call(action.item, event);
                }
            } else {
                // click
                if (action.item.mouseBehavior.onClick) {
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
    
    /**
     * Determine if possibleAncestor is an ancestor of item. 
     */
    static isSameOrAncestor(item: paper.Item, possibleAncestor: paper.Item): boolean {
        return !!PaperHelpers.findSelfOrAncestor(item, pa => pa === possibleAncestor);
    }

    findDragHandler(item: paper.Item): paper.Item {
        return PaperHelpers.findSelfOrAncestor(
            item, 
            pa => {
                let mb = pa.mouseBehavior;
                return !!(mb &&
                    (mb.onDragStart || mb.onDragMove || mb.onDragEnd));
            });
    }
    
    findOverHandler(item: paper.Item): paper.Item {
        return PaperHelpers.findSelfOrAncestor(
            item, 
            pa => {
                let mb = pa.mouseBehavior;
                return !!(mb &&
                    (mb.onOverStart || mb.onOverMove || mb.onOverEnd ));
            });
    }
}
