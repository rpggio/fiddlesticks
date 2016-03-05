
interface Console {
    log(message?: any, ...optionalParams: any[]): void;
    log(...optionalParams: any[]): void;
}

namespace PaperHelpers {

    export var shouldLogInfo: boolean;

    const log = function(...params: any[]){
        if(shouldLogInfo){
            console.log(...params);
        }
    } 

    export const importOpenTypePath = function(openPath: opentype.Path): paper.CompoundPath {
        return new paper.CompoundPath(openPath.toPathData());
        
        // let svg = openPath.toSVG(4);
        // return <paper.Path>paper.project.importSVG(svg);
    }

    export const tracePathItem = function(path: paper.PathItem, pointsPerPath: number): paper.PathItem {
        if (path.className === 'CompoundPath') {
            return this.traceCompoundPath(<paper.CompoundPath>path, pointsPerPath);
        } else {
            return this.tracePath(<paper.Path>path, pointsPerPath);
        }
    }

    export const traceCompoundPath = function(path: paper.CompoundPath, pointsPerPath: number): paper.CompoundPath {
        if (!path.children.length) {
            return null;
        }
        let paths = path.children.map(p =>
            this.tracePath(<paper.Path>p, pointsPerPath));
        return new paper.CompoundPath({
            children: paths,
            clockwise: path.clockwise
        })
    }

    export const tracePathAsPoints = function(path: paper.Path, numPoints: number): paper.Point[] {
        let pathLength = path.length;
        let offsetIncr = pathLength / numPoints;
        let points = [];
        let i = 0;
        let offset = 0;

        while (i++ < numPoints) {
            let point = path.getPointAt(Math.min(offset, pathLength));
            points.push(point);
            offset += offsetIncr;
        }

        return points;
    }

    export const tracePath = function(path: paper.Path, numPoints: number): paper.Path {
        let points = PaperHelpers.tracePathAsPoints(path, numPoints);
        return new paper.Path({
            segments: points,
            closed: true,
            clockwise: path.clockwise
        });
    }

    export const dualBoundsPathProjection = function(topPath: paper.Curvelike, bottomPath: paper.Curvelike)
        : (unitPoint: paper.Point) => paper.Point {
        const topPathLength = topPath.length;
        const bottomPathLength = bottomPath.length;
        return function(unitPoint: paper.Point): paper.Point {
            let topPoint = topPath.getPointAt(unitPoint.x * topPathLength);
            let bottomPoint = bottomPath.getPointAt(unitPoint.x * bottomPathLength);
            if (topPoint == null || bottomPoint == null) {
                throw "could not get projected point for unit point " + unitPoint.toString();
            }
            return topPoint.add(bottomPoint.subtract(topPoint).multiply(unitPoint.y));
        }
    }

    export let markerGroup: paper.Group;

    export const resetMarkers = function() {
        if (PaperHelpers.markerGroup) {
            PaperHelpers.markerGroup.remove();
        }
        markerGroup = new paper.Group();
        markerGroup.opacity = 0.2;

    }

    export const markerLine = function(a: paper.Point, b: paper.Point): paper.Item {
        let line = paper.Path.Line(a, b);
        line.strokeColor = 'green';
        //line.dashArray = [5, 5];
        PaperHelpers.markerGroup.addChild(line);
        return line;
    }

    export const marker = function(point: paper.Point, label: string): paper.Item {
        //let marker = paper.Shape.Circle(point, 10);
        let marker = new paper.PointText(point);
        marker.fontSize = 36;
        marker.content = label;
        marker.strokeColor = "red";
        marker.bringToFront();
        //PaperHelpers.markerGroup.addChild(marker);
        return marker;
    }

    export const simplify = function(path: paper.PathItem, tolerance?: number) {
        if (path.className === 'CompoundPath') {
            for (let p of path.children) {
                PaperHelpers.simplify(<paper.PathItem>p, tolerance);
            }
        } else {
            (<paper.Path>path).simplify(tolerance);
        }
    }

    /**
     * Find self or nearest ancestor satisfying the predicate.
     */
    export const findSelfOrAncestor = function(item: paper.Item, predicate: (i: paper.Item) => boolean) {
        if (predicate(item)) {
            return item;
        }
        return PaperHelpers.findAncestor(item, predicate);
    }
    
    /**
     * Find nearest ancestor satisfying the predicate.
     */
    export const findAncestor = function(item: paper.Item, predicate: (i: paper.Item) => boolean) {
        if (!item) {
            return null;
        }
        let prior: paper.Item;
        let checking = item.parent;
        while (checking && checking !== prior) {
            if (predicate(checking)) {
                return checking;
            }
            prior = checking;
            checking = checking.parent;
        }
        return null;
    }
    
    /**
     * The corners of the rect, clockwise starting from topLeft
     */
    export const corners = function(rect: paper.Rectangle): paper.Point[] {
        return [rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft];
    }
    
    /**
     * the midpoint between two points
     */
    export const midpoint = function(a: paper.Point, b: paper.Point) {
        return b.subtract(a).divide(2).add(a);
    }

    export const cloneSegment = function(segment: paper.Segment) {
        return new paper.Segment(segment.point, segment.handleIn, segment.handleOut);
    }

    /**
     * Make an item draggable, adding related events.
     */
    export const addSmartDrag = function(item: paper.Item) {
        item.isSmartDraggable = true;

        item.on(paper.EventType.mouseDrag, ev => {
            log("smartDrag.onMouseDrag", item, ev);
            if (ev.smartDragItem) {
                console.warn("Will not assign smartDragItem: value was already " + ev.smartDragItem);
            } else {
                ev.smartDragItem = item;
            }

            if (!item.isSmartDragging) {
                item.isSmartDragging = true;
                log("emitting smartDrag.smartDragStart");
                item.emit(EventType.smartDragStart, ev);
            }

            item.position = item.position.add(ev.delta);

            log("emitting smartDrag.smartDragMove");
            item.emit(EventType.smartDragMove, ev);

            ev.stop();
        });

        item.on(paper.EventType.mouseUp, ev => {
            log("smartDrag.onMouseUp", item, ev);
            if (ev.smartDragItem) {
                console.warn("Will not assign smartDragItem: value was already " + ev.smartDragItem);
            } else {
                ev.smartDragItem = item;
            }
                        
            if (item.isSmartDragging) {
                item.isSmartDragging = false;
                log("emitting smartDrag.smartDragEnd");
                item.emit(EventType.smartDragEnd, ev);
            } else {
                log("emitting smartDrag.clickWithoutDrag");
                item.emit(EventType.clickWithoutDrag, ev);
            }

            ev.stop();
        });
    }

    export const EventType = {
        
        /**
         * Drag action has started.
         */
        smartDragStart: "smartDragStart",
        
        /**
         * Dragged item has moved.
         */
        smartDragMove: "smartDragMove",
        
        /**
         * Drag action has ended.
         */
        smartDragEnd: "smartDragEnd",
        
        /**
         * The normal click event will fire even at the end of a drag.
         * This click event does not. 
         */
        clickWithoutDrag: "clickWithoutDrag"
    }
}

declare module paper {
    export interface Item {
        /**
         * Dragging behavior added by PaperHelpers: is the item being dragged?
         */
        isSmartDragging: boolean;

        /**
         * Dragging behavior added by PaperHelpers: is the item draggable?
         */
        isSmartDraggable: boolean;
    }

    export interface ToolEvent {
        smartDragItem: Item;
    }
    
    export interface PaperMouseEvent {
        smartDragItem: Item;
    }
}