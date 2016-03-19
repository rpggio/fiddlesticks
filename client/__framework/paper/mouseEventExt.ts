namespace paperExt {
    
    /**
     * Use of these events requires first calling extendMouseEvents
     *   on the item. 
     */
    export var EventType = {
        mouseDragStart: "mouseDragStart",
        mouseDragEnd: "mouseDragEnd"
    }

    export function extendMouseEvents(item: paper.Item){
        
        let dragging = false;
        
        item.on(paper.EventType.mouseDrag, ev => {
            if(!dragging){
                dragging = true;
                item.emit(paperExt.EventType.mouseDragStart, ev);
            }
        });
        
        item.on(paper.EventType.mouseUp, ev => {
            if(dragging){
                dragging = false;
                item.emit(paperExt.EventType.mouseDragEnd, ev);
                // prevent click
                ev.stop();
            }
        });
        
    }
}