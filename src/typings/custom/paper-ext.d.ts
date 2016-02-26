
declare module paper {

    interface Curvelike {
        length: number;
        getPointAt(offset: number): paper.Point;
    }

    var ChangeFlag: IChangeFlag;
    
    interface IChangeFlag {
        // Anything affecting the appearance of an item, including GEOMETRY,
        // STROKE, STYLE and ATTRIBUTE (except for the invisible ones: locked, name)
        APPEARANCE: number,
        // A change in the item's children
        CHILDREN: number,
        // A change of the item's place in the scene graph (removed, inserted,
        // moved).
        INSERTION: number,
        // Item geometry (path, bounds)
        GEOMETRY: number,
        // Only segment(s) have changed, and affected curves have already been
        // notified. This is to implement an optimization in _changed() calls.
        SEGMENTS: number,
        // Stroke geometry (excluding color)
        STROKE: number,
        // Fill style or stroke color / dash
        STYLE: number,
        // Item attributes: visible, blendMode, locked, name, opacity, clipMask ...
        ATTRIBUTE: number,
        // Text content
        CONTENT: number,
        // Raster pixels
        PIXELS: number,
        // Clipping in one of the child items
        CLIPPING: number,
        // The view has been transformed
        VIEW: number
    }

    // Shortcuts to often used ChangeFlag values including APPEARANCE
    var Change: IChange;
    
    interface IChange {
        // CHILDREN also changes GEOMETRY, since removing children from groups
        // changes bounds.
        CHILDREN: number, // ChangeFlag.CHILDREN | ChangeFlag.GEOMETRY | ChangeFlag.APPEARANCE
        // Changing the insertion can change the appearance through parent's matrix.
        INSERTION: number, // ChangeFlag.INSERTION | ChangeFlag.APPEARANCE
        GEOMETRY: number, // ChangeFlag.GEOMETRY | ChangeFlag.APPEARANCE
        SEGMENTS: number, // ChangeFlag.SEGMENTS | ChangeFlag.GEOMETRY | ChangeFlag.APPEARANCE
        STROKE: number, // ChangeFlag.STROKE | ChangeFlag.STYLE | ChangeFlag.APPEARANCE
        STYLE: number, // ChangeFlag.STYLE | ChangeFlag.APPEARANCE
        ATTRIBUTE: number, // ChangeFlag.ATTRIBUTE | ChangeFlag.APPEARANCE
        CONTENT: number, // ChangeFlag.CONTENT | ChangeFlag.GEOMETRY | ChangeFlag.APPEARANCE
        PIXELS: number, // ChangeFlag.PIXELS | ChangeFlag.APPEARANCE
        VIEW: number, // ChangeFlag.VIEW | ChangeFlag.APPEARANCE
    }

}