
class Elements {
    
    static dragMarker(center: paper.Point): paper.Shape {
        return paper.Shape.Circle({
                center: center,
                radius: 5,
                strokeWidth: 2,
                strokeColor: 'blue',
                fillColor: 'white',
                opacity: 0.3
            });
    }
    
    // static segmentDragHandle(segment: paper.Segment): paper.Item {
    //     return Elements.movable(
    //         Elements.dragMarker(segment.point));
    // }
    
    static movable(item: paper.Item): paper.Item{
        item.dragBehavior = <DragBehavior>{
            draggable: true,
            onDrag: (event) => {
                    item.position = item.position.add(event.delta); 
                }
        };
        return item;
    }
    
}