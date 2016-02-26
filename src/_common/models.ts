
interface AppState {
    sketch: Sketch;
}

interface Sketch {
    attr: SketchAttr;
    textBlocks: TextBlock[];
    selection?: ItemSelection;
    editingItem?: PositionedItem;
}

interface SketchAttr {
    backgroundColor?: string;
}

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

interface TextBlock extends BlockArrangement {
    _id?: string;
    text?: string;
    textColor?: string;
    backgroundColor?: string;
    font?: string;
    fontSize?: number;
}

interface BlockArrangement {
    position?: number[],
    outline?: {
        top: any,
        bottom: any
    }    
}

interface BackgroundActionStatus {
    action?: Object;
    rejected?: boolean;
    error?: boolean
    message?: string;
}