
interface PositionedItem {
    itemId?: string;
    itemType?: string;
    item?: Object;
    clientX?: number;
    clientY?: number;
}

interface ItemSelection {
    itemId?: string;
    itemType?: string;
    priorSelectionItemId?: string;
}