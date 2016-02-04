
class Elements {

    static dragHandleStyle = {
        radius: 5,
        strokeWidth: 2,
        strokeColor: 'blue',
        fillColor: 'white',
        opacity: 0.3
    };
    
    static dragMarker(center: paper.Point,
        dragItem?: Object,
        dragBehavior?: MouseBehavior
    ): paper.Shape {
        let marker = paper.Shape.Circle({
            center: center,
            radius: 5,
            strokeWidth: 2,
            strokeColor: 'blue',
            fillColor: 'white',
            opacity: 0.3
        });

        let dragItems = <Object[]>[marker];
        if (dragItem) {
            dragItems.push(dragItem);
        }

        let handle = new PointHandle(dragItems);
        marker.data = handle;
        marker.dragBehavior = <MouseBehavior>{
            onDrag: event => {
                handle.set(handle.get().add(event.delta));
                if (dragBehavior && dragBehavior.onDrag) {
                    dragBehavior.onDrag(event);
                }
            },
            onDragStart: dragBehavior && dragBehavior.onDragStart || undefined,
            onDragEnd: dragBehavior && dragBehavior.onDragEnd || undefined
        };

        return marker;
    }
}