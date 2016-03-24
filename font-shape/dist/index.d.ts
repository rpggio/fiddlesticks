declare module paper {
    interface Curvelike {
        length: number;
        getPointAt(offset: number): paper.Point;
    }
}
interface Console {
    log(message?: any, ...optionalParams: any[]): void;
    log(...optionalParams: any[]): void;
}
declare namespace PaperHelpers {
    const SAFARI_MAX_CANVAS_AREA: number;
    var shouldLogInfo: boolean;
    /**
     * Determine the max dpi that can supported by Canvas.
     * Using Safari as the measure, because it seems to have the smallest limit.
     */
    function getMaxExportDpi(itemSize: paper.Size): number;
    const importOpenTypePath: (openPath: opentype.Path) => paper.CompoundPath;
    const tracePathItem: (path: paper.PathItem, pointsPerPath: number) => paper.PathItem;
    const traceCompoundPath: (path: paper.CompoundPath, pointsPerPath: number) => paper.CompoundPath;
    const tracePathAsPoints: (path: paper.Path, numPoints: number) => paper.Point[];
    const tracePath: (path: paper.Path, numPoints: number) => paper.Path;
    const dualBoundsPathProjection: (topPath: paper.Curvelike, bottomPath: paper.Curvelike) => (unitPoint: paper.Point) => paper.Point;
    let markerGroup: paper.Group;
    const resetMarkers: () => void;
    const markerLine: (a: paper.Point, b: paper.Point) => paper.Item;
    const marker: (point: paper.Point, label: string) => paper.Item;
    const simplify: (path: paper.PathItem, tolerance?: number) => void;
    /**
     * Find self or nearest ancestor satisfying the predicate.
     */
    const findSelfOrAncestor: (item: paper.Item, predicate: (i: paper.Item) => boolean) => paper.Item;
    /**
     * Find nearest ancestor satisfying the predicate.
     */
    const findAncestor: (item: paper.Item, predicate: (i: paper.Item) => boolean) => paper.Item;
    /**
     * The corners of the rect, clockwise starting from topLeft
     */
    const corners: (rect: paper.Rectangle) => paper.Point[];
    /**
     * the midpoint between two points
     */
    const midpoint: (a: paper.Point, b: paper.Point) => paper.Point;
    const cloneSegment: (segment: paper.Segment) => paper.Segment;
    /**
     * Returns a - b, where a and b are unit offsets along a closed path.
     */
    function pathOffsetLength(start: number, end: number, clockwise?: boolean): number;
    function pathOffsetNormalize(offset: number): number;
}
declare namespace FontShape {
    class PathSection implements paper.Curvelike {
        path: paper.Path;
        unitStart: number;
        unitLength: number;
        clockwise: boolean;
        /**
         * Start and end are unit lengths: 0 to 1.
         */
        constructor(path: paper.Path, unitStart: number, unitLength: number, clockwise?: boolean);
        readonly length: number;
        /**
         * @param offset: length offset relative to this section.
         */
        getPointAt(offset: number): paper.Point;
    }
}
declare namespace FontShape {
    class PathTransform {
        pointTransform: (point: paper.Point) => paper.Point;
        constructor(pointTransform: (point: paper.Point) => paper.Point);
        transformPoint(point: paper.Point): paper.Point;
        transformPathItem(path: paper.PathItem): void;
        transformCompoundPath(path: paper.CompoundPath): void;
        transformPath(path: paper.Path): void;
    }
}
declare namespace FontShape {
    class SnapPath extends paper.Group {
        private _region;
        private _content;
        private _warped;
        corners: CornerOffsets;
        constructor(region: paper.Path, content: paper.CompoundPath);
        updatePath(): void;
        /**
         * Slide offset points by the given amount.
         * @param unitOffset: value 0 to 1
         */
        slide(unitOffset: number): void;
        private static incrementOffset(offset, delta);
    }
    /**
     * Path offsets on region for corners of SnapPath content,
     *   starting with topLeft and proceeding clockwise
     *   to bottomLeft.
     */
    type CornerOffsets = [number, number, number, number];
}
