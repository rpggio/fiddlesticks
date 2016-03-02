
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
        top: PathRecord,
        bottom: PathRecord
    }    
}

interface BackgroundActionStatus {
    action?: Object;
    rejected?: boolean;
    error?: boolean
    message?: string;
}

interface PathRecord {
    segments: SegmentRecord[];
}

/**
 * Single-point segments are stored as number[2]
 */
type SegmentRecord = Array<PointRecord> | Array<number>;

type PointRecord = Array<number>;
