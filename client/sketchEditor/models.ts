namespace SketchEditor {

    export interface EditorState {
        browserId?: string;
        editingItem?: PositionedObjectRef;
        selection?: WorkspaceObjectRef;
        loadingSketch?: boolean;
        userMessage?: string;
        sketch?: Sketch;
        showHelp?: boolean;
        sketchIsDirty?: boolean;
    }

    export interface Sketch extends SketchAttr {
        _id: string;
        browserId?: string;
        savedAt?: Date;
        textBlocks?: TextBlock[];
    }

    export interface SketchAttr {
        backgroundColor?: string;
        defaultTextBlockAttr?: TextBlock;
    }

    export interface FontDescription {
        family: string;
        category: string;
        variant: string;
        url: string;
    }

    export interface WorkspaceObjectRef {
        itemId: string;
        itemType?: string;
    }

    export interface PositionedObjectRef extends WorkspaceObjectRef {
        clientX?: number;
        clientY?: number;
    }

    export interface TextBlock extends BlockArrangement {
        _id?: string;
        text?: string;
        textColor?: string;
        backgroundColor?: string;
        fontFamily?: string;
        fontVariant?: string;
    }

    export interface BlockArrangement {
        position?: number[],
        outline?: {
            top: PathRecord,
            bottom: PathRecord
        }
    }

    export interface BackgroundActionStatus {
        action?: Object;
        rejected?: boolean;
        error?: boolean
        message?: string;
    }

    export interface PathRecord {
        segments: SegmentRecord[];
    }

    /**
     * Single-point segments are stored as number[2]
     */
    export type SegmentRecord = Array<PointRecord> | Array<number>;

    export type PointRecord = Array<number>;

}