
interface RetainedState {
    sketch: Sketch;
}

interface DisposableState {
    editingItem?: PositionedItem;
    selection?: ItemSelection;
}

interface Sketch {
    backgroundColor?: string;
    defaultFontDesc?: FontDescription;
    textBlocks?: TextBlock[];
    loading?: boolean;
}

interface FontFamily {
    kind?: string;
    family?: string;
    category?: string;
    variants?: string[];
    subsets?: string[];
    version?: string;
    lastModified?: string;
    files?: { [variant: string] : string; };
}

interface FontDescription {
    family: string;
    category: string;
    variant: string;
    url: string;
}

interface PositionedItem {
    itemId: string;
    itemType?: string;
    clientX?: number;
    clientY?: number;
}

interface ItemSelection {
    itemId: string;
    itemType: string;
    priorSelectionItemId?: string;
}

interface TextBlock extends BlockArrangement {
    _id?: string;
    text?: string;
    textColor?: string;
    backgroundColor?: string;
    fontDesc?: FontDescription;
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
