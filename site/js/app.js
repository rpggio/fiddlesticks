$(document).ready(function () {
    window.app = new AppController();
});
var AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
var Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
var Roboto500 = 'fonts/Roboto-500.ttf';
var AppController = (function () {
    function AppController() {
        var _this = this;
        this.textBlocks = [];
        this.canvasColor = 'white';
        $(".color-picker").spectrum({
            showInput: true,
            allowEmpty: true,
            preferredFormat: "hex",
            showButtons: false,
            showAlpha: true,
            showPalette: true,
            showSelectionPalette: true,
            palette: [
                ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            localStorageKey: "sketchtext",
        });
        var canvas = document.getElementById('mainCanvas');
        paper.setup(canvas);
        this.paper = paper;
        var mouseZoom = new ViewZoom(paper);
        this.workspace = new Workspace(new paper.Size(4000, 3000));
        var sheetBounds = this.workspace.sheet.bounds;
        mouseZoom.setZoomRange([sheetBounds.scale(0.02).size, sheetBounds.scale(3).size]);
        mouseZoom.zoomTo(sheetBounds.scale(0.5));
        this.paper.settings.handleSize = 1;
        //this.paper.project.activeLayer.selectedColor = 'white';
        new FontLoader(Roboto500, function (font) {
            _this.font = font;
            _this.warp = new TextWarpController(_this);
            // for testing 
            _this.addText();
        });
    }
    AppController.prototype.addText = function () {
        var text = $('#newText').val();
        if (text.trim().length) {
            var block = {
                _id: newid(),
                text: text,
                textColor: $('#textColor').val(),
                backgroundColor: $('#backgroundColor').val()
            };
            this.textBlocks.push(block);
            this.warp.update();
            this.paper.view.draw();
        }
    };
    return AppController;
})();
var FontLoader = (function () {
    function FontLoader(fontUrl, onLoaded) {
        opentype.load(fontUrl, function (err, font) {
            if (err) {
                console.error(err);
            }
            else {
                if (onLoaded) {
                    this.isLoaded = true;
                    onLoaded.call(this, font);
                }
            }
        });
    }
    return FontLoader;
})();
function newid() {
    return (new Date().getTime() + Math.random()).toString(36);
}
// <reference path="typings/paper.d.ts" />
var TextWarpController = (function () {
    function TextWarpController(app) {
        this.app = app;
        new MouseBehaviorTool(paper);
    }
    TextWarpController.prototype.update = function () {
        for (var _i = 0, _a = this.app.textBlocks; _i < _a.length; _i++) {
            var block = _a[_i];
            if (!block.item) {
                var textBlock = new StretchyText(block.text, this.app.font, {
                    fontSize: 128,
                    pathFillColor: block.textColor,
                    backgroundColor: block.backgroundColor
                });
                this.app.workspace.addChild(textBlock);
                textBlock.position = this.app.paper.view.bounds.point.add(new paper.Point(textBlock.bounds.width / 2, textBlock.bounds.height / 2)
                    .add(50));
                block.item = textBlock;
            }
        }
    };
    return TextWarpController;
})();
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Workspace = (function (_super) {
    __extends(Workspace, _super);
    function Workspace(size) {
        var _this = this;
        _super.call(this);
        var sheet = paper.Shape.Rectangle(new paper.Point(0, 0), size);
        sheet.fillColor = '#F2F1E1';
        sheet.style.shadowColor = 'gray';
        sheet.style.shadowBlur = 6;
        sheet.style.shadowOffset = new paper.Point(5, 5);
        this.sheet = sheet;
        this.addChild(sheet);
        this.mouseBehavior = {
            onClick: function (e) {
                paper.project.deselectAll();
            },
            onDragMove: function (e) { return _this.position = _this.position.add(e.delta); }
        };
    }
    return Workspace;
})(paper.Group);
var PerspectiveTransform = (function () {
    function PerspectiveTransform(source, dest) {
        this.source = source;
        this.dest = dest;
        this.matrix = PerspectiveTransform.createMatrix(source, dest);
    }
    // Given a 4x4 perspective transformation matrix, and a 2D point (a 2x1 vector),
    // applies the transformation matrix by converting the point to homogeneous
    // coordinates at z=0, post-multiplying, and then applying a perspective divide.
    PerspectiveTransform.prototype.transformPoint = function (point) {
        var p3 = PerspectiveTransform.multiply(this.matrix, [point.x, point.y, 0, 1]);
        var result = new paper.Point(p3[0] / p3[3], p3[1] / p3[3]);
        return result;
    };
    PerspectiveTransform.createMatrix = function (source, target) {
        var sourcePoints = [
            [source.a.x, source.a.y],
            [source.b.x, source.b.y],
            [source.c.x, source.c.y],
            [source.d.x, source.d.y]];
        var targetPoints = [
            [target.a.x, target.a.y],
            [target.b.x, target.b.y],
            [target.c.x, target.c.y],
            [target.d.x, target.d.y]];
        for (var a = [], b = [], i = 0, n = sourcePoints.length; i < n; ++i) {
            var s = sourcePoints[i], t = targetPoints[i];
            a.push([s[0], s[1], 1, 0, 0, 0, -s[0] * t[0], -s[1] * t[0]]), b.push(t[0]);
            a.push([0, 0, 0, s[0], s[1], 1, -s[0] * t[1], -s[1] * t[1]]), b.push(t[1]);
        }
        var X = solve(a, b, true);
        return [
            X[0], X[3], 0, X[6],
            X[1], X[4], 0, X[7],
            0, 0, 1, 0,
            X[2], X[5], 0, 1
        ].map(function (x) {
            return Math.round(x * 100000) / 100000;
        });
    };
    // Post-multiply a 4x4 matrix in column-major order by a 4x1 column vector:
    // [ m0 m4 m8  m12 ]   [ v0 ]   [ x ]
    // [ m1 m5 m9  m13 ] * [ v1 ] = [ y ]
    // [ m2 m6 m10 m14 ]   [ v2 ]   [ z ]
    // [ m3 m7 m11 m15 ]   [ v3 ]   [ w ]
    PerspectiveTransform.multiply = function (matrix, vector) {
        return [
            matrix[0] * vector[0] + matrix[4] * vector[1] + matrix[8] * vector[2] + matrix[12] * vector[3],
            matrix[1] * vector[0] + matrix[5] * vector[1] + matrix[9] * vector[2] + matrix[13] * vector[3],
            matrix[2] * vector[0] + matrix[6] * vector[1] + matrix[10] * vector[2] + matrix[14] * vector[3],
            matrix[3] * vector[0] + matrix[7] * vector[1] + matrix[11] * vector[2] + matrix[15] * vector[3]
        ];
    };
    return PerspectiveTransform;
})();
var Quad = (function () {
    function Quad(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
    Quad.fromRectangle = function (rect) {
        return new Quad(rect.topLeft, rect.topRight, rect.bottomLeft, rect.bottomRight);
    };
    Quad.fromCoords = function (coords) {
        return new Quad(new paper.Point(coords[0], coords[1]), new paper.Point(coords[2], coords[3]), new paper.Point(coords[4], coords[5]), new paper.Point(coords[6], coords[7]));
    };
    Quad.prototype.asCoords = function () {
        return [
            this.a.x, this.a.y,
            this.b.x, this.b.y,
            this.c.x, this.c.y,
            this.d.x, this.d.y
        ];
    };
    return Quad;
})();
/**
 * Handle that sits on midpoint of curve
 *   which will split the curve when dragged.
 */
var CurveSplitterHandle = (function (_super) {
    __extends(CurveSplitterHandle, _super);
    function CurveSplitterHandle(curve) {
        var _this = this;
        _super.call(this);
        this.curve = curve;
        var self = this;
        self._type = 'circle';
        self._radius = 7;
        self._size = new paper.Size(self._radius * 2);
        this.translate(curve.getPointAt(0.5 * curve.length));
        this.strokeWidth = 2;
        this.strokeColor = 'blue';
        this.fillColor = 'white';
        this.opacity = 0.5 * 0.3;
        var newSegment;
        this.mouseBehavior = {
            onDragStart: function (event) {
                newSegment = new paper.Segment(_this.position);
                curve.path.insert(curve.index + 1, newSegment);
            },
            onDragMove: function (event) {
                var newPos = _this.position.add(event.delta);
                _this.position = newPos;
                newSegment.point = newPos;
            },
            onDragEnd: function (event) {
                if (_this.onDragEnd) {
                    _this.onDragEnd(newSegment, event);
                }
            }
        };
    }
    return CurveSplitterHandle;
})(paper.Shape);
var MouseBehaviorTool = (function (_super) {
    __extends(MouseBehaviorTool, _super);
    function MouseBehaviorTool(paperScope) {
        var _this = this;
        _super.call(this);
        this.hitOptions = {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: 5
        };
        this.onMouseDown = function (event) {
            _this.pressAction = null;
            var hitResult = paper.project.hitTest(event.point, _this.hitOptions);
            if (hitResult && hitResult.item) {
                var draggable = _this.findDragHandler(hitResult.item);
                if (draggable) {
                    _this.pressAction = {
                        item: draggable
                    };
                }
            }
        };
        this.onMouseMove = function (event) {
            var hitResult = paper.project.hitTest(event.point, _this.hitOptions);
            var handlerItem = hitResult
                && _this.findOverHandler(hitResult.item);
            if (
            // were previously hovering
            _this.hoverAction
                && (
                // not hovering over anything now
                handlerItem == null
                    || !MouseBehaviorTool.isSameOrAncestor(hitResult.item, _this.hoverAction.item))) {
                // just leaving
                if (_this.hoverAction.item.mouseBehavior.onOverEnd) {
                    _this.hoverAction.item.mouseBehavior.onOverEnd(event);
                }
                _this.hoverAction = null;
            }
            if (handlerItem && handlerItem.mouseBehavior) {
                var behavior = handlerItem.mouseBehavior;
                if (!_this.hoverAction) {
                    _this.hoverAction = {
                        item: handlerItem
                    };
                    if (behavior.onOverStart) {
                        behavior.onOverStart(event);
                    }
                }
                if (behavior && behavior.onOverMove) {
                    behavior.onOverMove(event);
                }
            }
        };
        this.onMouseDrag = function (event) {
            if (_this.pressAction) {
                if (!_this.pressAction.dragged) {
                    _this.pressAction.dragged = true;
                    if (_this.pressAction.item.mouseBehavior.onDragStart) {
                        _this.pressAction.item.mouseBehavior.onDragStart.call(_this.pressAction.item, _this.pressAction.startEvent);
                    }
                }
                if (_this.pressAction.item.mouseBehavior.onDragMove) {
                    _this.pressAction.item.mouseBehavior.onDragMove.call(_this.pressAction.item, event);
                }
            }
        };
        this.onMouseUp = function (event) {
            if (_this.pressAction) {
                var action = _this.pressAction;
                _this.pressAction = null;
                if (action.dragged) {
                    // drag
                    if (action.item.mouseBehavior.onDragEnd) {
                        action.item.mouseBehavior.onDragEnd.call(action.item, event);
                    }
                }
                else {
                    // click
                    if (action.item.mouseBehavior.onClick) {
                        action.item.mouseBehavior.onClick.call(action.item, event);
                    }
                }
            }
        };
        this.onKeyDown = function (event) {
        };
    }
    /**
     * Determine if container is an ancestor of item.
     */
    MouseBehaviorTool.isSameOrAncestor = function (item, container) {
        return !!PaperHelpers.findSelfOrAncestor(item, function (pa) { return pa === container; });
    };
    MouseBehaviorTool.prototype.findDragHandler = function (item) {
        return PaperHelpers.findSelfOrAncestor(item, function (pa) {
            var mb = pa.mouseBehavior;
            return !!(mb &&
                (mb.onDragStart || mb.onDragMove || mb.onDragEnd));
        });
    };
    MouseBehaviorTool.prototype.findOverHandler = function (item) {
        return PaperHelpers.findSelfOrAncestor(item, function (pa) {
            var mb = pa.mouseBehavior;
            return !!(mb &&
                (mb.onOverStart || mb.onOverMove || mb.onOverEnd));
        });
    };
    return MouseBehaviorTool;
})(paper.Tool);
var PaperHelpers = (function () {
    function PaperHelpers() {
    }
    PaperHelpers.importOpenTypePath = function (openPath) {
        return new paper.CompoundPath(openPath.toPathData());
        // let svg = openPath.toSVG(4);
        // return <paper.Path>paper.project.importSVG(svg);
    };
    PaperHelpers.tracePathItem = function (path, pointsPerPath) {
        if (path.className === 'CompoundPath') {
            return this.traceCompoundPath(path, pointsPerPath);
        }
        else {
            return this.tracePath(path, pointsPerPath);
        }
    };
    PaperHelpers.traceCompoundPath = function (path, pointsPerPath) {
        var _this = this;
        if (!path.children.length) {
            return null;
        }
        var paths = path.children.map(function (p) {
            return _this.tracePath(p, pointsPerPath);
        });
        return new paper.CompoundPath({
            children: paths,
            clockwise: path.clockwise
        });
    };
    PaperHelpers.tracePath = function (path, numPoints) {
        // if(!path || !path.segments || path.segments.length){
        //     return new paper.Path();
        // }
        var pathLength = path.length;
        var offsetIncr = pathLength / numPoints;
        var points = [];
        var i = 0;
        var offset = 0;
        while (i++ < numPoints) {
            var point = path.getPointAt(Math.min(offset, pathLength));
            points.push(point);
            offset += offsetIncr;
        }
        return new paper.Path({
            segments: points,
            closed: true,
            clockwise: path.clockwise
        });
    };
    PaperHelpers.sandwichPathProjection = function (topPath, bottomPath) {
        var topPathLength = topPath.length;
        var bottomPathLength = bottomPath.length;
        return function (unitPoint) {
            var topPoint = topPath.getPointAt(unitPoint.x * topPathLength);
            var bottomPoint = bottomPath.getPointAt(unitPoint.x * bottomPathLength);
            if (topPoint == null || bottomPoint == null) {
                throw "could not get projected point for unit point " + unitPoint.toString();
            }
            return topPoint.add(bottomPoint.subtract(topPoint).multiply(unitPoint.y));
        };
    };
    PaperHelpers.resetMarkers = function () {
        if (PaperHelpers.markerGroup) {
            PaperHelpers.markerGroup.remove();
        }
        PaperHelpers.markerGroup = new paper.Group();
        PaperHelpers.markerGroup.opacity = 0.2;
    };
    PaperHelpers.markerLine = function (a, b) {
        var line = paper.Path.Line(a, b);
        line.strokeColor = 'green';
        //line.dashArray = [5, 5];
        PaperHelpers.markerGroup.addChild(line);
        return line;
    };
    PaperHelpers.marker = function (point) {
        var marker = paper.Shape.Circle(point, 2);
        marker.strokeColor = 'red';
        PaperHelpers.markerGroup.addChild(marker);
        return marker;
    };
    PaperHelpers.simplify = function (path, tolerance) {
        if (path.className === 'CompoundPath') {
            for (var _i = 0, _a = path.children; _i < _a.length; _i++) {
                var p = _a[_i];
                PaperHelpers.simplify(p, tolerance);
            }
        }
        else {
            path.simplify(tolerance);
        }
    };
    /**
     * Find self or nearest ancestor satisfying the predicate.
     */
    PaperHelpers.findSelfOrAncestor = function (item, predicate) {
        if (predicate(item)) {
            return item;
        }
        return PaperHelpers.findAncestor(item, predicate);
    };
    /**
     * Find nearest ancestor satisfying the predicate.
     */
    PaperHelpers.findAncestor = function (item, predicate) {
        if (!item) {
            return null;
        }
        var prior;
        var checking = item.parent;
        while (checking && checking !== prior) {
            if (predicate(checking)) {
                return checking;
            }
            prior = checking;
            checking = checking.parent;
        }
        return null;
    };
    /**
     * The corners of the rect, clockwise starting from topLeft
     */
    PaperHelpers.corners = function (rect) {
        return [rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft];
    };
    return PaperHelpers;
})();
var PathSection = (function () {
    function PathSection(path, offset, length) {
        this.path = path;
        this.offset = offset;
        this.length = length;
    }
    PathSection.prototype.getPointAt = function (offset) {
        return this.path.getPointAt(offset + this.offset);
    };
    return PathSection;
})();
var PathTransform = (function () {
    function PathTransform(pointTransform) {
        this.pointTransform = pointTransform;
    }
    PathTransform.prototype.transformPoint = function (point) {
        return this.pointTransform(point);
    };
    PathTransform.prototype.transformPathItem = function (path) {
        if (path.className === 'CompoundPath') {
            this.transformCompoundPath(path);
        }
        else {
            this.transformPath(path);
        }
    };
    PathTransform.prototype.transformCompoundPath = function (path) {
        for (var _i = 0, _a = path.children; _i < _a.length; _i++) {
            var p = _a[_i];
            this.transformPath(p);
        }
    };
    PathTransform.prototype.transformPath = function (path) {
        for (var _i = 0, _a = path.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            var origPoint = segment.point;
            var newPoint = this.transformPoint(segment.point);
            origPoint.x = newPoint.x;
            origPoint.y = newPoint.y;
        }
    };
    return PathTransform;
})();
var SegmentHandle = (function (_super) {
    __extends(SegmentHandle, _super);
    function SegmentHandle(segment, radius) {
        var _this = this;
        _super.call(this);
        this.segment = segment;
        var self = this;
        self._type = 'circle';
        self._radius = 7;
        self._size = new paper.Size(self._radius * 2);
        this.translate(segment.point);
        this.strokeWidth = 2;
        this.strokeColor = 'blue';
        this.fillColor = 'white';
        this.opacity = 0.5;
        this.mouseBehavior = {
            onDragMove: function (event) {
                var newPos = _this.position.add(event.delta);
                _this.position = newPos;
                segment.point = newPos;
            },
            onDragEnd: function (event) {
                if (_this._smoothed) {
                    _this.segment.smooth();
                }
                if (_this.onChangeComplete) {
                    _this.onChangeComplete(event);
                }
            },
            onClick: function (event) {
                _this.smoothed = !_this.smoothed;
                if (_this.onChangeComplete) {
                    _this.onChangeComplete(event);
                }
            }
        };
    }
    Object.defineProperty(SegmentHandle.prototype, "smoothed", {
        get: function () {
            return this._smoothed;
        },
        set: function (value) {
            this._smoothed = value;
            if (value) {
                this.segment.smooth();
            }
            else {
                this.segment.handleIn = null;
                this.segment.handleOut = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    return SegmentHandle;
})(paper.Shape);
var StretchyPath = (function (_super) {
    __extends(StretchyPath, _super);
    function StretchyPath(sourcePath, options) {
        var _this = this;
        _super.call(this);
        this.options = options || {
            pathFillColor: 'gray'
        };
        this.sourcePath = sourcePath;
        this.sourcePath.visible = false;
        this.createOutline();
        this.createSegmentMarkers();
        this.updateMidpiontMarkers();
        this.mouseBehavior = {
            onClick: function () {
                _this.bringToFront();
                _this.selected = true;
            },
            onDragStart: function () { return _this.bringToFront(); },
            onDragMove: function (event) {
                _this.selected = true;
                _this.position = _this.position.add(event.delta);
            },
            onOverStart: function () { return _this.setEditElementsVisibility(true); },
            onOverEnd: function () { return _this.setEditElementsVisibility(false); }
        };
        this.arrangeContents();
        this.setEditElementsVisibility(false);
    }
    StretchyPath.prototype.setEditElementsVisibility = function (value) {
        this.segmentGroup.visible = value;
        this.midpointGroup.visible = value;
        this.outline.strokeColor = value ? 'lightgray' : null;
    };
    StretchyPath.prototype.arrangeContents = function () {
        this.updateMidpiontMarkers();
        this.arrangePath();
    };
    StretchyPath.prototype.arrangePath = function () {
        var orthOrigin = this.sourcePath.bounds.topLeft;
        var orthWidth = this.sourcePath.bounds.width;
        var orthHeight = this.sourcePath.bounds.height;
        var sides = this.getOutlineSides();
        var top = sides[0];
        var bottom = sides[2];
        bottom.reverse();
        var projection = PaperHelpers.sandwichPathProjection(top, bottom);
        var transform = new PathTransform(function (point) {
            var relative = point.subtract(orthOrigin);
            var unit = new paper.Point(relative.x / orthWidth, relative.y / orthHeight);
            var projected = projection(unit);
            return projected;
        });
        for (var _i = 0; _i < sides.length; _i++) {
            var side = sides[_i];
            side.remove();
        }
        var newPath = PaperHelpers.traceCompoundPath(this.sourcePath, StretchyPath.OUTLINE_POINTS);
        newPath.visible = true;
        newPath.fillColor = this.options.pathFillColor;
        transform.transformPathItem(newPath);
        if (this.displayPath) {
            this.displayPath.remove();
        }
        this.displayPath = newPath;
        this.insertChild(1, newPath);
    };
    StretchyPath.prototype.getOutlineSides = function () {
        var sides = [];
        var segmentGroup = [];
        var cornerPoints = this.corners.map(function (c) { return c.point; });
        var first = cornerPoints.shift();
        cornerPoints.push(first);
        var targetCorner = cornerPoints.shift();
        var segmentList = this.outline.segments.map(function (x) { return x; });
        var i = 0;
        segmentList.push(segmentList[0]);
        for (var _i = 0; _i < segmentList.length; _i++) {
            var segment = segmentList[_i];
            segmentGroup.push(segment);
            if (targetCorner.isClose(segment.point, paper.Numerical.EPSILON)) {
                // finish path
                sides.push(new paper.Path(segmentGroup));
                segmentGroup = [segment];
                targetCorner = cornerPoints.shift();
            }
            i++;
        }
        if (sides.length !== 4) {
            console.error('sides', sides);
            throw 'failed to get sides';
        }
        return sides;
    };
    StretchyPath.prototype.createOutline = function () {
        var bounds = this.sourcePath.bounds;
        var outline = new paper.Path(PaperHelpers.corners(this.sourcePath.bounds));
        if (this.options.backgroundColor) {
            outline.fillColor = this.options.backgroundColor;
        }
        else {
            outline.fillColor = window.app.canvasColor;
            outline.opacity = 0;
        }
        outline.closed = true;
        outline.dashArray = [5, 5];
        this.outline = outline;
        // track corners so we know how to arrange the text
        this.corners = outline.segments.map(function (s) { return s; });
        this.addChild(outline);
    };
    StretchyPath.prototype.createSegmentMarkers = function () {
        var _this = this;
        var bounds = this.sourcePath.bounds;
        this.segmentGroup = new paper.Group();
        for (var _i = 0, _a = this.outline.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            var handle = new SegmentHandle(segment);
            handle.onChangeComplete = function () { return _this.arrangeContents(); };
            this.segmentGroup.addChild(handle);
        }
        this.addChild(this.segmentGroup);
    };
    StretchyPath.prototype.updateMidpiontMarkers = function () {
        var _this = this;
        if (this.midpointGroup) {
            this.midpointGroup.remove();
        }
        this.midpointGroup = new paper.Group();
        this.outline.curves.forEach(function (curve) {
            // skip left and right sides
            if (curve.segment1 === _this.corners[1]
                || curve.segment1 === _this.corners[3]) {
                return;
            }
            var handle = new CurveSplitterHandle(curve);
            handle.onDragEnd = function (newSegment, event) {
                var newHandle = new SegmentHandle(newSegment);
                newHandle.onChangeComplete = function () { return _this.arrangeContents(); };
                _this.segmentGroup.addChild(newHandle);
                handle.remove();
                _this.arrangeContents();
            };
            _this.midpointGroup.addChild(handle);
        });
        this.addChild(this.midpointGroup);
    };
    StretchyPath.OUTLINE_POINTS = 230;
    return StretchyPath;
})(paper.Group);
var StretchyText = (function (_super) {
    __extends(StretchyText, _super);
    function StretchyText(text, font, options) {
        this.options = options || {
            fontSize: 32
        };
        var openTypePath = font.getPath(text, 0, 0, this.options.fontSize);
        var textPath = PaperHelpers.importOpenTypePath(openTypePath);
        _super.call(this, textPath, options);
    }
    return StretchyText;
})(StretchyPath);
/**
 * Measures offsets of text glyphs.
 */
var TextRuler = (function () {
    function TextRuler() {
    }
    TextRuler.prototype.createPointText = function (text) {
        var pointText = new paper.PointText();
        pointText.content = text;
        pointText.justification = "center";
        if (this.fontFamily) {
            pointText.fontFamily = this.fontFamily;
        }
        if (this.fontWeight) {
            pointText.fontWeight = this.fontWeight;
        }
        if (this.fontSize) {
            pointText.fontSize = this.fontSize;
        }
        return pointText;
    };
    TextRuler.prototype.getTextOffsets = function (text) {
        // Measure glyphs in pairs to capture white space.
        // Pairs are characters i and i+1.
        var glyphPairs = [];
        for (var i = 0; i < text.length; i++) {
            glyphPairs[i] = this.createPointText(text.substring(i, i + 1));
        }
        // For each character, find center offset.
        var xOffsets = [0];
        for (var i = 1; i < text.length; i++) {
            // Measure three characters at a time to get the appropriate 
            //   space before and after the glyph.
            var triadText = this.createPointText(text.substring(i - 1, i + 1));
            triadText.remove();
            // Subtract out half of prior glyph pair 
            //   and half of current glyph pair.
            // Must be right, because it works.
            var offsetWidth = triadText.bounds.width
                - glyphPairs[i - 1].bounds.width / 2
                - glyphPairs[i].bounds.width / 2;
            // Add offset width to prior offset. 
            xOffsets[i] = xOffsets[i - 1] + offsetWidth;
        }
        for (var _i = 0; _i < glyphPairs.length; _i++) {
            var glyphPair = glyphPairs[_i];
            glyphPair.remove();
        }
        return xOffsets;
    };
    return TextRuler;
})();
var ViewZoom = (function () {
    function ViewZoom(paperScope) {
        var _this = this;
        this.factor = 1.25;
        this.paperScope = paperScope;
        var view = this.paperScope.view;
        $(view.element).mousewheel(function (event) {
            var mousePosition = new paper.Point(event.offsetX, event.offsetY);
            _this.changeZoomCentered(event.deltaY, mousePosition);
        });
    }
    Object.defineProperty(ViewZoom.prototype, "zoom", {
        get: function () {
            return this.paperScope.view.zoom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewZoom.prototype, "zoomRange", {
        get: function () {
            return [this._minZoom, this._maxZoom];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set zoom level.
     * @returns zoom level that was set, or null if it was not changed
     */
    ViewZoom.prototype.setZoomConstrained = function (zoom) {
        if (this._minZoom) {
            zoom = Math.max(zoom, this._minZoom);
        }
        if (this._maxZoom) {
            zoom = Math.min(zoom, this._maxZoom);
        }
        var view = this.paperScope.view;
        if (zoom != view.zoom) {
            view.zoom = zoom;
            return zoom;
        }
        return null;
    };
    ViewZoom.prototype.setZoomRange = function (range) {
        var view = this.paperScope.view;
        var aSize = range.shift();
        var bSize = range.shift();
        var a = aSize && Math.min(view.bounds.height / aSize.height, view.bounds.width / aSize.width);
        var b = bSize && Math.min(view.bounds.height / bSize.height, view.bounds.width / bSize.width);
        var min = Math.min(a, b);
        if (min) {
            this._minZoom = min;
        }
        var max = Math.max(a, b);
        if (max) {
            this._maxZoom = max;
        }
        return [this._minZoom, this._maxZoom];
    };
    ViewZoom.prototype.changeZoomCentered = function (deltaY, mousePos) {
        if (!deltaY) {
            return;
        }
        var view = this.paperScope.view;
        var oldZoom = view.zoom;
        var oldCenter = view.center;
        var viewPos = view.viewToProject(mousePos);
        var newZoom = deltaY > 0
            ? view.zoom * this.factor
            : view.zoom / this.factor;
        newZoom = this.setZoomConstrained(newZoom);
        if (!newZoom) {
            return;
        }
        var zoomScale = oldZoom / newZoom;
        var centerAdjust = viewPos.subtract(oldCenter);
        var offset = viewPos.subtract(centerAdjust.multiply(zoomScale))
            .subtract(oldCenter);
        view.center = view.center.add(offset);
    };
    ;
    ViewZoom.prototype.zoomTo = function (rect) {
        var view = this.paperScope.view;
        view.center = rect.center;
        view.zoom = Math.min(view.bounds.height / rect.height, view.bounds.width / rect.width) * 0.95;
    };
    return ViewZoom;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyIsIi4uLy4uL3NyYy9hcHAvQXBwQ29udHJvbGxlci50cyIsIi4uLy4uL3NyYy9hcHAvRm9udExvYWRlci50cyIsIi4uLy4uL3NyYy9hcHAvSGVscGVycy50cyIsIi4uLy4uL3NyYy9hcHAvVGV4dFdhcnBDb250cm9sbGVyLnRzIiwiLi4vLi4vc3JjL2FwcC9Xb3Jrc3BhY2UudHMiLCIuLi8uLi9zcmMvbWF0aC9QZXJzcGVjdGl2ZVRyYW5zZm9ybS50cyIsIi4uLy4uL3NyYy9wYXBlci9DdXJ2ZVNwbGl0dGVySGFuZGxlLnRzIiwiLi4vLi4vc3JjL3BhcGVyL01vdXNlQmVoYXZpb3JUb29sLnRzIiwiLi4vLi4vc3JjL3BhcGVyL1BhcGVySGVscGVycy50cyIsIi4uLy4uL3NyYy9wYXBlci9QYXRoU2VjdGlvbi50cyIsIi4uLy4uL3NyYy9wYXBlci9QYXRoVHJhbnNmb3JtLnRzIiwiLi4vLi4vc3JjL3BhcGVyL1NlZ21lbnRIYW5kbGUudHMiLCIuLi8uLi9zcmMvcGFwZXIvU3RyZXRjaHlQYXRoLnRzIiwiLi4vLi4vc3JjL3BhcGVyL1N0cmV0Y2h5VGV4dC50cyIsIi4uLy4uL3NyYy9wYXBlci9UZXh0UnVsZXIudHMiLCIuLi8uLi9zcmMvcGFwZXIvVmlld1pvb20udHMiXSwibmFtZXMiOlsiQXBwQ29udHJvbGxlciIsIkFwcENvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHBDb250cm9sbGVyLmFkZFRleHQiLCJGb250TG9hZGVyIiwiRm9udExvYWRlci5jb25zdHJ1Y3RvciIsIm5ld2lkIiwiVGV4dFdhcnBDb250cm9sbGVyIiwiVGV4dFdhcnBDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiVGV4dFdhcnBDb250cm9sbGVyLnVwZGF0ZSIsIldvcmtzcGFjZSIsIldvcmtzcGFjZS5jb25zdHJ1Y3RvciIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtIiwiUGVyc3BlY3RpdmVUcmFuc2Zvcm0uY29uc3RydWN0b3IiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludCIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtLmNyZWF0ZU1hdHJpeCIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtLm11bHRpcGx5IiwiUXVhZCIsIlF1YWQuY29uc3RydWN0b3IiLCJRdWFkLmZyb21SZWN0YW5nbGUiLCJRdWFkLmZyb21Db29yZHMiLCJRdWFkLmFzQ29vcmRzIiwiQ3VydmVTcGxpdHRlckhhbmRsZSIsIkN1cnZlU3BsaXR0ZXJIYW5kbGUuY29uc3RydWN0b3IiLCJNb3VzZUJlaGF2aW9yVG9vbCIsIk1vdXNlQmVoYXZpb3JUb29sLmNvbnN0cnVjdG9yIiwiTW91c2VCZWhhdmlvclRvb2wuaXNTYW1lT3JBbmNlc3RvciIsIk1vdXNlQmVoYXZpb3JUb29sLmZpbmREcmFnSGFuZGxlciIsIk1vdXNlQmVoYXZpb3JUb29sLmZpbmRPdmVySGFuZGxlciIsIlBhcGVySGVscGVycyIsIlBhcGVySGVscGVycy5jb25zdHJ1Y3RvciIsIlBhcGVySGVscGVycy5pbXBvcnRPcGVuVHlwZVBhdGgiLCJQYXBlckhlbHBlcnMudHJhY2VQYXRoSXRlbSIsIlBhcGVySGVscGVycy50cmFjZUNvbXBvdW5kUGF0aCIsIlBhcGVySGVscGVycy50cmFjZVBhdGgiLCJQYXBlckhlbHBlcnMuc2FuZHdpY2hQYXRoUHJvamVjdGlvbiIsIlBhcGVySGVscGVycy5yZXNldE1hcmtlcnMiLCJQYXBlckhlbHBlcnMubWFya2VyTGluZSIsIlBhcGVySGVscGVycy5tYXJrZXIiLCJQYXBlckhlbHBlcnMuc2ltcGxpZnkiLCJQYXBlckhlbHBlcnMuZmluZFNlbGZPckFuY2VzdG9yIiwiUGFwZXJIZWxwZXJzLmZpbmRBbmNlc3RvciIsIlBhcGVySGVscGVycy5jb3JuZXJzIiwiUGF0aFNlY3Rpb24iLCJQYXRoU2VjdGlvbi5jb25zdHJ1Y3RvciIsIlBhdGhTZWN0aW9uLmdldFBvaW50QXQiLCJQYXRoVHJhbnNmb3JtIiwiUGF0aFRyYW5zZm9ybS5jb25zdHJ1Y3RvciIsIlBhdGhUcmFuc2Zvcm0udHJhbnNmb3JtUG9pbnQiLCJQYXRoVHJhbnNmb3JtLnRyYW5zZm9ybVBhdGhJdGVtIiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1Db21wb3VuZFBhdGgiLCJQYXRoVHJhbnNmb3JtLnRyYW5zZm9ybVBhdGgiLCJTZWdtZW50SGFuZGxlIiwiU2VnbWVudEhhbmRsZS5jb25zdHJ1Y3RvciIsIlNlZ21lbnRIYW5kbGUuc21vb3RoZWQiLCJTdHJldGNoeVBhdGgiLCJTdHJldGNoeVBhdGguY29uc3RydWN0b3IiLCJTdHJldGNoeVBhdGguc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eSIsIlN0cmV0Y2h5UGF0aC5hcnJhbmdlQ29udGVudHMiLCJTdHJldGNoeVBhdGguYXJyYW5nZVBhdGgiLCJTdHJldGNoeVBhdGguZ2V0T3V0bGluZVNpZGVzIiwiU3RyZXRjaHlQYXRoLmNyZWF0ZU91dGxpbmUiLCJTdHJldGNoeVBhdGguY3JlYXRlU2VnbWVudE1hcmtlcnMiLCJTdHJldGNoeVBhdGgudXBkYXRlTWlkcGlvbnRNYXJrZXJzIiwiU3RyZXRjaHlUZXh0IiwiU3RyZXRjaHlUZXh0LmNvbnN0cnVjdG9yIiwiVGV4dFJ1bGVyIiwiVGV4dFJ1bGVyLmNvbnN0cnVjdG9yIiwiVGV4dFJ1bGVyLmNyZWF0ZVBvaW50VGV4dCIsIlRleHRSdWxlci5nZXRUZXh0T2Zmc2V0cyIsIlZpZXdab29tIiwiVmlld1pvb20uY29uc3RydWN0b3IiLCJWaWV3Wm9vbS56b29tIiwiVmlld1pvb20uem9vbVJhbmdlIiwiVmlld1pvb20uc2V0Wm9vbUNvbnN0cmFpbmVkIiwiVmlld1pvb20uc2V0Wm9vbVJhbmdlIiwiVmlld1pvb20uY2hhbmdlWm9vbUNlbnRlcmVkIiwiVmlld1pvb20uem9vbVRvIl0sIm1hcHBpbmdzIjoiQUFNQSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBRWQsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO0FB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Q0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDOUJBLElBQUlBLFlBQVlBLEdBQUdBO1lBQ2ZBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBRTlCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxZQUFZQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUNsRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDN0NBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzNFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMvRUEsQ0FBQ0E7UUFFREEsSUFBSUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDMUJBLE1BQU1BLENBQUNBO1lBQ0hBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ25CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoQkEsQ0FBQ0EsRUFBS0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBS0EsQ0FBQ0E7WUFDbkJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUtBLENBQUNBO1NBQ3RCQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFTQSxDQUFDQTtZQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDM0MsQ0FBQyxDQUFDQSxDQUFDQTtJQUNQQSxDQUFDQTtJQUVESCwyRUFBMkVBO0lBQzNFQSxxQ0FBcUNBO0lBQ3JDQSxxQ0FBcUNBO0lBQ3JDQSxxQ0FBcUNBO0lBQ3JDQSxxQ0FBcUNBO0lBQzlCQSw2QkFBUUEsR0FBZkEsVUFBZ0JBLE1BQU1BLEVBQUVBLE1BQU1BO1FBQzFCSSxNQUFNQSxDQUFDQTtZQUNIQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFFQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvRkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0ZBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQy9GQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtTQUNsR0EsQ0FBQ0E7SUFDTkEsQ0FBQ0E7SUFDTEosMkJBQUNBO0FBQURBLENBQUNBLEFBbEVELElBa0VDO0FBRUQ7SUFNSUssY0FBWUEsQ0FBY0EsRUFBRUEsQ0FBY0EsRUFBRUEsQ0FBY0EsRUFBRUEsQ0FBY0E7UUFDdEVDLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ1hBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENB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Q0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDZkEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDekNBLENBQUNBO1FBQ0RBLEVBQUVBLENBQUFBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUFBLENBQUNBO1lBQ2RBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQ3pDQSxDQUFDQTtRQUNEQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNoQ0EsRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7WUFDbEJBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1lBQ2pCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNoQkEsQ0FBQ0E7UUFDREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDaEJBLENBQUNBO0lBRURKLCtCQUFZQSxHQUFaQSxVQUFhQSxLQUFtQkE7UUFDNUJLLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBO1FBQ2hDQSxJQUFJQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUMxQkEsSUFBSUEsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLEdBQUdBLEtBQUtBLElBQUlBLElBQUlBLENBQUNBLEdBQUdBLENBQ3JCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUNqQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FB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QSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FDaEJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLEVBQ2hDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUMvQ0EsQ0FBQ0E7SUFDTFAsZUFBQ0E7QUFBREEsQ0FBQ0EsQUFwR0QsSUFvR0MiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW50ZXJmYWNlIFdpbmRvdyB7XHJcbiAgICBhcHA6IEFwcENvbnRyb2xsZXI7XHJcbn1cclxuXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHsgIFxyXG4gICBcclxuICAgIHdpbmRvdy5hcHAgPSBuZXcgQXBwQ29udHJvbGxlcigpO1xyXG4gICAgXHJcbn0pO1xyXG4iLCJcclxuY29uc3QgQW1hdGljVXJsID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL2FtYXRpY3NjL3Y4L0lEbmtSVFBHY3JTVm81MFV5WU5LN3kzVVNCblN2cGtvcFFhVVItMnI3aVUudHRmJztcclxuY29uc3QgUm9ib3RvMTAwID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL3JvYm90by92MTUvN015Z3FUZTJ6czlZa1AwYWRBOVFRUS50dGYnO1xyXG5jb25zdCBSb2JvdG81MDAgPSAnZm9udHMvUm9ib3RvLTUwMC50dGYnO1xyXG5cclxuY2xhc3MgQXBwQ29udHJvbGxlciB7XHJcblxyXG4gICAgZm9udDogb3BlbnR5cGUuRm9udDtcclxuICAgIHdhcnA6IFRleHRXYXJwQ29udHJvbGxlcjtcclxuICAgIHRleHRCbG9ja3M6IFRleHRCbG9ja1tdID0gW107XHJcbiAgICBwYXBlcjogcGFwZXIuUGFwZXJTY29wZTtcclxuICAgIGNhbnZhc0NvbG9yID0gJ3doaXRlJztcclxuICAgIHdvcmtzcGFjZTogV29ya3NwYWNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcblxyXG4gICAgICAgICg8YW55PiQoXCIuY29sb3ItcGlja2VyXCIpKS5zcGVjdHJ1bSh7XHJcbiAgICAgICAgICAgIHNob3dJbnB1dDogdHJ1ZSxcclxuICAgICAgICAgICAgYWxsb3dFbXB0eTp0cnVlLFxyXG4gICAgICAgICAgICBwcmVmZXJyZWRGb3JtYXQ6IFwiaGV4XCIsXHJcbiAgICAgICAgICAgIHNob3dCdXR0b25zOiBmYWxzZSxcclxuICAgICAgICAgICAgc2hvd0FscGhhOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93UGFsZXR0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd1NlbGVjdGlvblBhbGV0dGU6IHRydWUsXHJcbiAgICAgICAgICAgIHBhbGV0dGU6IFtcclxuICAgICAgICBbXCIjMDAwXCIsXCIjNDQ0XCIsXCIjNjY2XCIsXCIjOTk5XCIsXCIjY2NjXCIsXCIjZWVlXCIsXCIjZjNmM2YzXCIsXCIjZmZmXCJdLFxyXG4gICAgICAgIFtcIiNmMDBcIixcIiNmOTBcIixcIiNmZjBcIixcIiMwZjBcIixcIiMwZmZcIixcIiMwMGZcIixcIiM5MGZcIixcIiNmMGZcIl0sXHJcbiAgICAgICAgW1wiI2Y0Y2NjY1wiLFwiI2ZjZTVjZFwiLFwiI2ZmZjJjY1wiLFwiI2Q5ZWFkM1wiLFwiI2QwZTBlM1wiLFwiI2NmZTJmM1wiLFwiI2Q5ZDJlOVwiLFwiI2VhZDFkY1wiXSxcclxuICAgICAgICBbXCIjZWE5OTk5XCIsXCIjZjljYjljXCIsXCIjZmZlNTk5XCIsXCIjYjZkN2E4XCIsXCIjYTJjNGM5XCIsXCIjOWZjNWU4XCIsXCIjYjRhN2Q2XCIsXCIjZDVhNmJkXCJdLFxyXG4gICAgICAgIFtcIiNlMDY2NjZcIixcIiNmNmIyNmJcIixcIiNmZmQ5NjZcIixcIiM5M2M0N2RcIixcIiM3NmE1YWZcIixcIiM2ZmE4ZGNcIixcIiM4ZTdjYzNcIixcIiNjMjdiYTBcIl0sXHJcbiAgICAgICAgW1wiI2MwMFwiLFwiI2U2OTEzOFwiLFwiI2YxYzIzMlwiLFwiIzZhYTg0ZlwiLFwiIzQ1ODE4ZVwiLFwiIzNkODVjNlwiLFwiIzY3NGVhN1wiLFwiI2E2NGQ3OVwiXSxcclxuICAgICAgICBbXCIjOTAwXCIsXCIjYjQ1ZjA2XCIsXCIjYmY5MDAwXCIsXCIjMzg3NjFkXCIsXCIjMTM0ZjVjXCIsXCIjMGI1Mzk0XCIsXCIjMzUxYzc1XCIsXCIjNzQxYjQ3XCJdLFxyXG4gICAgICAgIFtcIiM2MDBcIixcIiM3ODNmMDRcIixcIiM3ZjYwMDBcIixcIiMyNzRlMTNcIixcIiMwYzM0M2RcIixcIiMwNzM3NjNcIixcIiMyMDEyNGRcIixcIiM0YzExMzBcIl1cclxuICAgIF0sXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZUtleTogXCJza2V0Y2h0ZXh0XCIsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkNhbnZhcycpO1xyXG4gICAgICAgIHBhcGVyLnNldHVwKDxIVE1MQ2FudmFzRWxlbWVudD5jYW52YXMpO1xyXG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcclxuXHJcbiAgICAgICAgbGV0IG1vdXNlWm9vbSA9IG5ldyBWaWV3Wm9vbShwYXBlcik7XHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSBuZXcgV29ya3NwYWNlKG5ldyBwYXBlci5TaXplKDQwMDAsIDMwMDApKTtcclxuICAgICAgICBsZXQgc2hlZXRCb3VuZHMgPSB0aGlzLndvcmtzcGFjZS5zaGVldC5ib3VuZHM7XHJcbiAgICAgICAgbW91c2Vab29tLnNldFpvb21SYW5nZShcclxuICAgICAgICAgICAgW3NoZWV0Qm91bmRzLnNjYWxlKDAuMDIpLnNpemUsIHNoZWV0Qm91bmRzLnNjYWxlKDMpLnNpemVdKTtcclxuICAgICAgICBtb3VzZVpvb20uem9vbVRvKHNoZWV0Qm91bmRzLnNjYWxlKDAuNSkpO1xyXG5cclxuICAgICAgICB0aGlzLnBhcGVyLnNldHRpbmdzLmhhbmRsZVNpemUgPSAxO1xyXG4gICAgICAgIC8vdGhpcy5wYXBlci5wcm9qZWN0LmFjdGl2ZUxheWVyLnNlbGVjdGVkQ29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG5ldyBGb250TG9hZGVyKFJvYm90bzUwMCwgZm9udCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgICAgIHRoaXMud2FycCA9IG5ldyBUZXh0V2FycENvbnRyb2xsZXIodGhpcyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBmb3IgdGVzdGluZyBcclxuICAgICAgICAgICAgdGhpcy5hZGRUZXh0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFkZFRleHQoKXtcclxuICAgICAgICBsZXQgdGV4dCA9ICQoJyNuZXdUZXh0JykudmFsKCk7XHJcblxyXG4gICAgICAgIGlmKHRleHQudHJpbSgpLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+IHtcclxuICAgICAgICAgICAgICAgIF9pZDogbmV3aWQoKSxcclxuICAgICAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgICAgICB0ZXh0Q29sb3I6ICQoJyN0ZXh0Q29sb3InKS52YWwoKSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJCgnI2JhY2tncm91bmRDb2xvcicpLnZhbCgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMudGV4dEJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud2FycC51cGRhdGUoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFwZXIudmlldy5kcmF3KCk7XHJcbiAgICAgICAgfSAgICBcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIFRleHRCbG9jayB7XHJcbiAgICBfaWQ6IHN0cmluZztcclxuICAgIHRleHQ6IHN0cmluZztcclxuICAgIGl0ZW06IHBhcGVyLkl0ZW07XHJcbiAgICB0ZXh0Q29sb3I6IHN0cmluZztcclxuICAgIGJhY2tncm91bmRDb2xvcjogc3RyaW5nO1xyXG59IiwiXHJcbmNsYXNzIEZvbnRMb2FkZXIge1xyXG5cclxuICAgIGlzTG9hZGVkOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnRVcmw6IHN0cmluZywgb25Mb2FkZWQ6IChmb250OiBvcGVudHlwZS5Gb250KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgb3BlbnR5cGUubG9hZChmb250VXJsLCBmdW5jdGlvbihlcnIsIGZvbnQpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9uTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgb25Mb2FkZWQuY2FsbCh0aGlzLCBmb250KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiXHJcbmZ1bmN0aW9uIG5ld2lkKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gKG5ldyBEYXRlKCkuZ2V0VGltZSgpK01hdGgucmFuZG9tKCkpLnRvU3RyaW5nKDM2KTtcclxufVxyXG4iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL3BhcGVyLmQudHNcIiAvPlxyXG5cclxuY2xhc3MgVGV4dFdhcnBDb250cm9sbGVyIHtcclxuICAgIGFwcDogQXBwQ29udHJvbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcENvbnRyb2xsZXIpIHtcclxuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcclxuICAgICAgICBcclxuICAgICAgICBuZXcgTW91c2VCZWhhdmlvclRvb2wocGFwZXIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUoKXtcclxuICAgICAgICBmb3IobGV0IGJsb2NrIG9mIHRoaXMuYXBwLnRleHRCbG9ja3Mpe1xyXG4gICAgICAgICAgICBpZighYmxvY2suaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGV4dEJsb2NrID0gbmV3IFN0cmV0Y2h5VGV4dChibG9jay50ZXh0LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAuZm9udCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPFN0cmV0Y2h5VGV4dE9wdGlvbnM+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyOCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhGaWxsQ29sb3I6IGJsb2NrLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogYmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmFkZENoaWxkKHRleHRCbG9jayk7XHJcbiAgICAgICAgICAgICAgICB0ZXh0QmxvY2sucG9zaXRpb24gPSB0aGlzLmFwcC5wYXBlci52aWV3LmJvdW5kcy5wb2ludC5hZGQoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KHRleHRCbG9jay5ib3VuZHMud2lkdGggLyAyLCB0ZXh0QmxvY2suYm91bmRzLmhlaWdodCAvIDIgKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hZGQoNTApKTtcclxuXHJcbiAgICAgICAgICAgICAgICBibG9jay5pdGVtID0gdGV4dEJsb2NrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBXb3Jrc3BhY2UgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcbiAgICBcclxuICAgIHNoZWV0OiBwYXBlci5TaGFwZTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc2l6ZTogcGFwZXIuU2l6ZSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc2hlZXQgPSBwYXBlci5TaGFwZS5SZWN0YW5nbGUoXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLDApLCBzaXplKTtcclxuICAgICAgICBzaGVldC5maWxsQ29sb3IgPSAnI0YyRjFFMSc7XHJcbiAgICAgICAgc2hlZXQuc3R5bGUuc2hhZG93Q29sb3IgPSAnZ3JheSc7IFxyXG4gICAgICAgIHNoZWV0LnN0eWxlLnNoYWRvd0JsdXIgPSA2O1xyXG4gICAgICAgIHNoZWV0LnN0eWxlLnNoYWRvd09mZnNldCA9IG5ldyBwYXBlci5Qb2ludCg1LCA1KVxyXG4gICAgICAgIHRoaXMuc2hlZXQgPSBzaGVldDtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKHNoZWV0KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm1vdXNlQmVoYXZpb3IgPSA8TW91c2VCZWhhdmlvcj4ge1xyXG4gICAgICAgICAgICBvbkNsaWNrOiBlID0+IHtcclxuICAgICAgICAgICAgICAgIHBhcGVyLnByb2plY3QuZGVzZWxlY3RBbGwoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnTW92ZTogZSA9PiB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQoZS5kZWx0YSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJcclxuZGVjbGFyZSB2YXIgc29sdmU6IChhOiBhbnksIGI6IGFueSwgZmFzdDogYm9vbGVhbikgPT4gdm9pZDtcclxuXHJcbmNsYXNzIFBlcnNwZWN0aXZlVHJhbnNmb3JtIHtcclxuICAgIFxyXG4gICAgc291cmNlOiBRdWFkO1xyXG4gICAgZGVzdDogUXVhZDtcclxuICAgIHBlcnNwOiBhbnk7XHJcbiAgICBtYXRyaXg6IG51bWJlcltdO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2U6IFF1YWQsIGRlc3Q6IFF1YWQpe1xyXG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuZGVzdCA9IGRlc3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5jcmVhdGVNYXRyaXgoc291cmNlLCBkZXN0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gR2l2ZW4gYSA0eDQgcGVyc3BlY3RpdmUgdHJhbnNmb3JtYXRpb24gbWF0cml4LCBhbmQgYSAyRCBwb2ludCAoYSAyeDEgdmVjdG9yKSxcclxuICAgIC8vIGFwcGxpZXMgdGhlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCBieSBjb252ZXJ0aW5nIHRoZSBwb2ludCB0byBob21vZ2VuZW91c1xyXG4gICAgLy8gY29vcmRpbmF0ZXMgYXQgej0wLCBwb3N0LW11bHRpcGx5aW5nLCBhbmQgdGhlbiBhcHBseWluZyBhIHBlcnNwZWN0aXZlIGRpdmlkZS5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBsZXQgcDMgPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5tdWx0aXBseSh0aGlzLm1hdHJpeCwgW3BvaW50LngsIHBvaW50LnksIDAsIDFdKTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IHBhcGVyLlBvaW50KHAzWzBdIC8gcDNbM10sIHAzWzFdIC8gcDNbM10pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBjcmVhdGVNYXRyaXgoc291cmNlOiBRdWFkLCB0YXJnZXQ6IFF1YWQpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNvdXJjZVBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3NvdXJjZS5hLngsIHNvdXJjZS5hLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5iLngsIHNvdXJjZS5iLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5jLngsIHNvdXJjZS5jLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5kLngsIHNvdXJjZS5kLnldXTtcclxuICAgICAgICBsZXQgdGFyZ2V0UG9pbnRzID0gW1xyXG4gICAgICAgICAgICBbdGFyZ2V0LmEueCwgdGFyZ2V0LmEueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmIueCwgdGFyZ2V0LmIueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmMueCwgdGFyZ2V0LmMueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmQueCwgdGFyZ2V0LmQueV1dO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGEgPSBbXSwgYiA9IFtdLCBpID0gMCwgbiA9IHNvdXJjZVBvaW50cy5sZW5ndGg7IGkgPCBuOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHMgPSBzb3VyY2VQb2ludHNbaV0sIHQgPSB0YXJnZXRQb2ludHNbaV07XHJcbiAgICAgICAgICAgIGEucHVzaChbc1swXSwgc1sxXSwgMSwgMCwgMCwgMCwgLXNbMF0gKiB0WzBdLCAtc1sxXSAqIHRbMF1dKSwgYi5wdXNoKHRbMF0pO1xyXG4gICAgICAgICAgICBhLnB1c2goWzAsIDAsIDAsIHNbMF0sIHNbMV0sIDEsIC1zWzBdICogdFsxXSwgLXNbMV0gKiB0WzFdXSksIGIucHVzaCh0WzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBYID0gc29sdmUoYSwgYiwgdHJ1ZSk7IFxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIFhbMF0sIFhbM10sIDAsIFhbNl0sXHJcbiAgICAgICAgICAgIFhbMV0sIFhbNF0sIDAsIFhbN10sXHJcbiAgICAgICAgICAgICAgIDAsICAgIDAsIDEsICAgIDAsXHJcbiAgICAgICAgICAgIFhbMl0sIFhbNV0sIDAsICAgIDFcclxuICAgICAgICBdLm1hcChmdW5jdGlvbih4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHggKiAxMDAwMDApIC8gMTAwMDAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBvc3QtbXVsdGlwbHkgYSA0eDQgbWF0cml4IGluIGNvbHVtbi1tYWpvciBvcmRlciBieSBhIDR4MSBjb2x1bW4gdmVjdG9yOlxyXG4gICAgLy8gWyBtMCBtNCBtOCAgbTEyIF0gICBbIHYwIF0gICBbIHggXVxyXG4gICAgLy8gWyBtMSBtNSBtOSAgbTEzIF0gKiBbIHYxIF0gPSBbIHkgXVxyXG4gICAgLy8gWyBtMiBtNiBtMTAgbTE0IF0gICBbIHYyIF0gICBbIHogXVxyXG4gICAgLy8gWyBtMyBtNyBtMTEgbTE1IF0gICBbIHYzIF0gICBbIHcgXVxyXG4gICAgc3RhdGljIG11bHRpcGx5KG1hdHJpeCwgdmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgbWF0cml4WzBdICogdmVjdG9yWzBdICsgbWF0cml4WzRdICogdmVjdG9yWzFdICsgbWF0cml4WzggXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxMl0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFsxXSAqIHZlY3RvclswXSArIG1hdHJpeFs1XSAqIHZlY3RvclsxXSArIG1hdHJpeFs5IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTNdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMl0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNl0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbMTBdICogdmVjdG9yWzJdICsgbWF0cml4WzE0XSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzNdICogdmVjdG9yWzBdICsgbWF0cml4WzddICogdmVjdG9yWzFdICsgbWF0cml4WzExXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNV0gKiB2ZWN0b3JbM11cclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBRdWFkIHtcclxuICAgIGE6IHBhcGVyLlBvaW50O1xyXG4gICAgYjogcGFwZXIuUG9pbnQ7XHJcbiAgICBjOiBwYXBlci5Qb2ludDtcclxuICAgIGQ6IHBhcGVyLlBvaW50O1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQsIGM6IHBhcGVyLlBvaW50LCBkOiBwYXBlci5Qb2ludCl7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYyA9IGM7XHJcbiAgICAgICAgdGhpcy5kID0gZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21SZWN0YW5nbGUocmVjdDogcGFwZXIuUmVjdGFuZ2xlKXtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIHJlY3QudG9wTGVmdCxcclxuICAgICAgICAgICAgcmVjdC50b3BSaWdodCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21MZWZ0LFxyXG4gICAgICAgICAgICByZWN0LmJvdHRvbVJpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21Db29yZHMoY29vcmRzOiBudW1iZXJbXSkgOiBRdWFkIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMF0sIGNvb3Jkc1sxXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMl0sIGNvb3Jkc1szXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNF0sIGNvb3Jkc1s1XSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNl0sIGNvb3Jkc1s3XSlcclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFzQ29vcmRzKCk6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB0aGlzLmEueCwgdGhpcy5hLnksXHJcbiAgICAgICAgICAgIHRoaXMuYi54LCB0aGlzLmIueSxcclxuICAgICAgICAgICAgdGhpcy5jLngsIHRoaXMuYy55LFxyXG4gICAgICAgICAgICB0aGlzLmQueCwgdGhpcy5kLnlcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59IiwiXHJcbi8qKlxyXG4gKiBIYW5kbGUgdGhhdCBzaXRzIG9uIG1pZHBvaW50IG9mIGN1cnZlXHJcbiAqICAgd2hpY2ggd2lsbCBzcGxpdCB0aGUgY3VydmUgd2hlbiBkcmFnZ2VkLlxyXG4gKi9cclxuY2xhc3MgQ3VydmVTcGxpdHRlckhhbmRsZSBleHRlbmRzIHBhcGVyLlNoYXBlIHtcclxuIFxyXG4gICAgY3VydmU6IHBhcGVyLkN1cnZlO1xyXG4gICAgb25EcmFnRW5kOiAobmV3U2VnbWVudDogcGFwZXIuU2VnbWVudCwgZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuIFxyXG4gICAgY29uc3RydWN0b3IoY3VydmU6IHBhcGVyLkN1cnZlKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnZlID0gY3VydmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNlbGYgPSA8YW55PnRoaXM7XHJcbiAgICAgICAgc2VsZi5fdHlwZSA9ICdjaXJjbGUnO1xyXG4gICAgICAgIHNlbGYuX3JhZGl1cyA9IDc7XHJcbiAgICAgICAgc2VsZi5fc2l6ZSA9IG5ldyBwYXBlci5TaXplKHNlbGYuX3JhZGl1cyAqIDIpO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKGN1cnZlLmdldFBvaW50QXQoMC41ICogY3VydmUubGVuZ3RoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDI7XHJcbiAgICAgICAgdGhpcy5zdHJva2VDb2xvciA9ICdibHVlJztcclxuICAgICAgICB0aGlzLmZpbGxDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gMC41ICogMC4zOyBcclxuIFxyXG4gICAgICAgIGxldCBuZXdTZWdtZW50OiBwYXBlci5TZWdtZW50O1xyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IDxNb3VzZUJlaGF2aW9yPntcclxuICAgICAgICAgICAgb25EcmFnU3RhcnQ6IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudCA9IG5ldyBwYXBlci5TZWdtZW50KHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY3VydmUucGF0aC5pbnNlcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmUuaW5kZXggKyAxLCBcclxuICAgICAgICAgICAgICAgICAgICBuZXdTZWdtZW50XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3UG9zID0gdGhpcy5wb3NpdGlvbi5hZGQoZXZlbnQuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ld1BvcztcclxuICAgICAgICAgICAgICAgIG5ld1NlZ21lbnQucG9pbnQgPSBuZXdQb3M7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ0VuZDogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkRyYWdFbmQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25EcmFnRW5kKG5ld1NlZ21lbnQsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcclxuICAgIGludGVyZmFjZSBJdGVtIHtcclxuICAgICAgICBtb3VzZUJlaGF2aW9yOiBNb3VzZUJlaGF2aW9yO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgTW91c2VCZWhhdmlvciB7XHJcbiAgICBvbkNsaWNrPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gICAgb25PdmVyU3RhcnQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uT3Zlck1vdmU/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uT3ZlckVuZD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICAgIG9uRHJhZ1N0YXJ0PzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbkRyYWdNb3ZlPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbkRyYWdFbmQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxufVxyXG5cclxuaW50ZXJmYWNlIE1vdXNlQWN0aW9uIHtcclxuICAgIHN0YXJ0RXZlbnQ6IHBhcGVyLlRvb2xFdmVudDtcclxuICAgIGl0ZW06IHBhcGVyLkl0ZW07XHJcbiAgICBkcmFnZ2VkOiBib29sZWFuO1xyXG59XHJcblxyXG5jbGFzcyBNb3VzZUJlaGF2aW9yVG9vbCBleHRlbmRzIHBhcGVyLlRvb2wge1xyXG5cclxuICAgIGhpdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgc2VnbWVudHM6IHRydWUsXHJcbiAgICAgICAgc3Ryb2tlOiB0cnVlLFxyXG4gICAgICAgIGZpbGw6IHRydWUsXHJcbiAgICAgICAgdG9sZXJhbmNlOiA1XHJcbiAgICB9O1xyXG5cclxuICAgIHByZXNzQWN0aW9uOiBNb3VzZUFjdGlvbjtcclxuICAgIGhvdmVyQWN0aW9uOiBNb3VzZUFjdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXBlclNjb3BlOiBwYXBlci5QYXBlclNjb3BlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93biA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIHRoaXMucHJlc3NBY3Rpb24gPSBudWxsO1xyXG5cclxuICAgICAgICB2YXIgaGl0UmVzdWx0ID0gcGFwZXIucHJvamVjdC5oaXRUZXN0KFxyXG4gICAgICAgICAgICBldmVudC5wb2ludCxcclxuICAgICAgICAgICAgdGhpcy5oaXRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgaWYgKGhpdFJlc3VsdCAmJiBoaXRSZXN1bHQuaXRlbSkge1xyXG4gICAgICAgICAgICBsZXQgZHJhZ2dhYmxlID0gdGhpcy5maW5kRHJhZ0hhbmRsZXIoaGl0UmVzdWx0Lml0ZW0pO1xyXG4gICAgICAgICAgICBpZiAoZHJhZ2dhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uID0gPE1vdXNlQWN0aW9uPntcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiBkcmFnZ2FibGVcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU1vdmUgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICB2YXIgaGl0UmVzdWx0ID0gcGFwZXIucHJvamVjdC5oaXRUZXN0KFxyXG4gICAgICAgICAgICBldmVudC5wb2ludCxcclxuICAgICAgICAgICAgdGhpcy5oaXRPcHRpb25zKTtcclxuICAgICAgICBsZXQgaGFuZGxlckl0ZW0gPSBoaXRSZXN1bHRcclxuICAgICAgICAgICAgJiYgdGhpcy5maW5kT3ZlckhhbmRsZXIoaGl0UmVzdWx0Lml0ZW0pO1xyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIC8vIHdlcmUgcHJldmlvdXNseSBob3ZlcmluZ1xyXG4gICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uXHJcbiAgICAgICAgICAgICYmIChcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBob3ZlcmluZyBvdmVyIGFueXRoaW5nIG5vd1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlckl0ZW0gPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgLy8gbm90IGhvdmVyaW5nIG92ZXIgY3VycmVudCBoYW5kbGVyIG9yIGRlc2NlbmRlbnQgdGhlcmVvZlxyXG4gICAgICAgICAgICAgICAgfHwgIU1vdXNlQmVoYXZpb3JUb29sLmlzU2FtZU9yQW5jZXN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgaGl0UmVzdWx0Lml0ZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvbi5pdGVtKSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLy8ganVzdCBsZWF2aW5nXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhvdmVyQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbk92ZXJFbmQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uT3ZlckVuZChldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaGFuZGxlckl0ZW0gJiYgaGFuZGxlckl0ZW0ubW91c2VCZWhhdmlvcikge1xyXG4gICAgICAgICAgICBsZXQgYmVoYXZpb3IgPSBoYW5kbGVySXRlbS5tb3VzZUJlaGF2aW9yO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaG92ZXJBY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24gPSA8TW91c2VBY3Rpb24+e1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06IGhhbmRsZXJJdGVtXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgaWYgKGJlaGF2aW9yLm9uT3ZlclN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3Iub25PdmVyU3RhcnQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChiZWhhdmlvciAmJiBiZWhhdmlvci5vbk92ZXJNb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICBiZWhhdmlvci5vbk92ZXJNb3ZlKGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRHJhZyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wcmVzc0FjdGlvbi5kcmFnZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uLmRyYWdnZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlc3NBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ1N0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnU3RhcnQuY2FsbChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLCB0aGlzLnByZXNzQWN0aW9uLnN0YXJ0RXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdNb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdNb3ZlLmNhbGwodGhpcy5wcmVzc0FjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJlc3NBY3Rpb24pIHtcclxuICAgICAgICAgICAgbGV0IGFjdGlvbiA9IHRoaXMucHJlc3NBY3Rpb247XHJcbiAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24gPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFjdGlvbi5kcmFnZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkcmFnXHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdFbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ0VuZC5jYWxsKGFjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjbGlja1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25DbGljaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25DbGljay5jYWxsKGFjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25LZXlEb3duID0gKGV2ZW50KSA9PiB7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lIGlmIGNvbnRhaW5lciBpcyBhbiBhbmNlc3RvciBvZiBpdGVtLiBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGlzU2FtZU9yQW5jZXN0b3IoaXRlbTogcGFwZXIuSXRlbSwgY29udGFpbmVyOiBwYXBlci5JdGVtKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICEhUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvcihpdGVtLCBwYSA9PiBwYSA9PT0gY29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kRHJhZ0hhbmRsZXIoaXRlbTogcGFwZXIuSXRlbSk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHJldHVybiBQYXBlckhlbHBlcnMuZmluZFNlbGZPckFuY2VzdG9yKFxyXG4gICAgICAgICAgICBpdGVtLCBcclxuICAgICAgICAgICAgcGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1iID0gcGEubW91c2VCZWhhdmlvcjtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhIShtYiAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChtYi5vbkRyYWdTdGFydCB8fCBtYi5vbkRyYWdNb3ZlIHx8IG1iLm9uRHJhZ0VuZCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZmluZE92ZXJIYW5kbGVyKGl0ZW06IHBhcGVyLkl0ZW0pOiBwYXBlci5JdGVtIHtcclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvcihcclxuICAgICAgICAgICAgaXRlbSwgXHJcbiAgICAgICAgICAgIHBhID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYiA9IHBhLm1vdXNlQmVoYXZpb3I7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gISEobWIgJiZcclxuICAgICAgICAgICAgICAgICAgICAobWIub25PdmVyU3RhcnQgfHwgbWIub25PdmVyTW92ZSB8fCBtYi5vbk92ZXJFbmQgKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBQYXBlckhlbHBlcnMge1xyXG5cclxuICAgIHN0YXRpYyBpbXBvcnRPcGVuVHlwZVBhdGgob3BlblBhdGg6IG9wZW50eXBlLlBhdGgpOiBwYXBlci5Db21wb3VuZFBhdGgge1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKG9wZW5QYXRoLnRvUGF0aERhdGEoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gbGV0IHN2ZyA9IG9wZW5QYXRoLnRvU1ZHKDQpO1xyXG4gICAgICAgIC8vIHJldHVybiA8cGFwZXIuUGF0aD5wYXBlci5wcm9qZWN0LmltcG9ydFNWRyhzdmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZVBhdGhJdGVtKHBhdGg6IHBhcGVyLlBhdGhJdGVtLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5QYXRoSXRlbSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRyYWNlQ29tcG91bmRQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICBpZiAoIXBhdGguY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcGF0aHMgPSBwYXRoLmNoaWxkcmVuLm1hcChwID0+XHJcbiAgICAgICAgICAgIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnAsIHBvaW50c1BlclBhdGgpKTtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aCh7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBwYXRocyxcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRyYWNlUGF0aChwYXRoOiBwYXBlci5QYXRoLCBudW1Qb2ludHM6IG51bWJlcik6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgIC8vIGlmKCFwYXRoIHx8ICFwYXRoLnNlZ21lbnRzIHx8IHBhdGguc2VnbWVudHMubGVuZ3RoKXtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIG5ldyBwYXBlci5QYXRoKCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGxldCBwYXRoTGVuZ3RoID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG9mZnNldEluY3IgPSBwYXRoTGVuZ3RoIC8gbnVtUG9pbnRzO1xyXG4gICAgICAgIGxldCBwb2ludHMgPSBbXTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDA7XHJcblxyXG4gICAgICAgIHdoaWxlIChpKysgPCBudW1Qb2ludHMpIHtcclxuICAgICAgICAgICAgbGV0IHBvaW50ID0gcGF0aC5nZXRQb2ludEF0KE1hdGgubWluKG9mZnNldCwgcGF0aExlbmd0aCkpO1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChwb2ludCk7XHJcbiAgICAgICAgICAgIG9mZnNldCArPSBvZmZzZXRJbmNyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5QYXRoKHtcclxuICAgICAgICAgICAgc2VnbWVudHM6IHBvaW50cyxcclxuICAgICAgICAgICAgY2xvc2VkOiB0cnVlLFxyXG4gICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNhbmR3aWNoUGF0aFByb2plY3Rpb24odG9wUGF0aDogcGFwZXIuQ3VydmVsaWtlLCBib3R0b21QYXRoOiBwYXBlci5DdXJ2ZWxpa2UpXHJcbiAgICAgICAgOiAodW5pdFBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIGNvbnN0IHRvcFBhdGhMZW5ndGggPSB0b3BQYXRoLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBib3R0b21QYXRoTGVuZ3RoID0gYm90dG9tUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgICAgIGxldCB0b3BQb2ludCA9IHRvcFBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIHRvcFBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgICBsZXQgYm90dG9tUG9pbnQgPSBib3R0b21QYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiBib3R0b21QYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICAgaWYgKHRvcFBvaW50ID09IG51bGwgfHwgYm90dG9tUG9pbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJjb3VsZCBub3QgZ2V0IHByb2plY3RlZCBwb2ludCBmb3IgdW5pdCBwb2ludCBcIiArIHVuaXRQb2ludC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0b3BQb2ludC5hZGQoYm90dG9tUG9pbnQuc3VidHJhY3QodG9wUG9pbnQpLm11bHRpcGx5KHVuaXRQb2ludC55KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXJrZXJHcm91cDogcGFwZXIuR3JvdXA7XHJcblxyXG4gICAgc3RhdGljIHJlc2V0TWFya2Vycygpe1xyXG4gICAgICAgIGlmKFBhcGVySGVscGVycy5tYXJrZXJHcm91cCl7XHJcbiAgICAgICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLm9wYWNpdHkgPSAwLjI7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1hcmtlckxpbmUoYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50KTogcGFwZXIuSXRlbXtcclxuICAgICAgICBsZXQgbGluZSA9IHBhcGVyLlBhdGguTGluZShhLGIpO1xyXG4gICAgICAgIGxpbmUuc3Ryb2tlQ29sb3IgPSAnZ3JlZW4nO1xyXG4gICAgICAgIC8vbGluZS5kYXNoQXJyYXkgPSBbNSwgNV07XHJcbiAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLmFkZENoaWxkKGxpbmUpO1xyXG4gICAgICAgIHJldHVybiBsaW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXJrZXIocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgbGV0IG1hcmtlciA9IHBhcGVyLlNoYXBlLkNpcmNsZShwb2ludCwgMik7XHJcbiAgICAgICAgbWFya2VyLnN0cm9rZUNvbG9yID0gJ3JlZCc7XHJcbiAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLmFkZENoaWxkKG1hcmtlcik7XHJcbiAgICAgICAgcmV0dXJuIG1hcmtlcjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2ltcGxpZnkocGF0aDogcGFwZXIuUGF0aEl0ZW0sIHRvbGVyYW5jZT86IG51bWJlcikge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBQYXBlckhlbHBlcnMuc2ltcGxpZnkoPHBhcGVyLlBhdGhJdGVtPnAsIHRvbGVyYW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAoPHBhcGVyLlBhdGg+cGF0aCkuc2ltcGxpZnkodG9sZXJhbmNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIHNlbGYgb3IgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXHJcbiAgICAgKi8gICAgXHJcbiAgICBzdGF0aWMgZmluZFNlbGZPckFuY2VzdG9yKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pe1xyXG4gICAgICAgIGlmKHByZWRpY2F0ZShpdGVtKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRBbmNlc3RvcihpdGVtLCBwcmVkaWNhdGUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBmaW5kQW5jZXN0b3IoaXRlbTogcGFwZXIuSXRlbSwgcHJlZGljYXRlOiAoaTogcGFwZXIuSXRlbSkgPT4gYm9vbGVhbil7XHJcbiAgICAgICAgaWYoIWl0ZW0pe1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHByaW9yOiBwYXBlci5JdGVtO1xyXG4gICAgICAgIGxldCBjaGVja2luZyA9IGl0ZW0ucGFyZW50O1xyXG4gICAgICAgIHdoaWxlKGNoZWNraW5nICYmIGNoZWNraW5nICE9PSBwcmlvcil7XHJcbiAgICAgICAgICAgIGlmKHByZWRpY2F0ZShjaGVja2luZykpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNraW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByaW9yID0gY2hlY2tpbmc7XHJcbiAgICAgICAgICAgIGNoZWNraW5nID0gY2hlY2tpbmcucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgY29ybmVycyBvZiB0aGUgcmVjdCwgY2xvY2t3aXNlIHN0YXJ0aW5nIGZyb20gdG9wTGVmdFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29ybmVycyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpOiBwYXBlci5Qb2ludFtde1xyXG4gICAgICAgIHJldHVybiBbcmVjdC50b3BMZWZ0LCByZWN0LnRvcFJpZ2h0LCByZWN0LmJvdHRvbVJpZ2h0LCByZWN0LmJvdHRvbUxlZnRdO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFBhdGhTZWN0aW9uIGltcGxlbWVudHMgcGFwZXIuQ3VydmVsaWtlIHtcclxuICAgIHBhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICBvZmZzZXQ6IG51bWJlcjtcclxuICAgIGxlbmd0aDogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBwYXBlci5QYXRoLCBvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFBvaW50QXQob2Zmc2V0OiBudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhdGguZ2V0UG9pbnRBdChvZmZzZXQgKyB0aGlzLm9mZnNldCk7XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgUGF0aFRyYW5zZm9ybSB7XHJcbiAgICBwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludFRyYW5zZm9ybSA9IHBvaW50VHJhbnNmb3JtO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludFRyYW5zZm9ybShwb2ludCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aEl0ZW0ocGF0aDogcGFwZXIuUGF0aEl0ZW0pIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1Db21wb3VuZFBhdGgocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aChwYXRoOiBwYXBlci5QYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiBwYXRoLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBvcmlnUG9pbnQgPSBzZWdtZW50LnBvaW50O1xyXG4gICAgICAgICAgICBsZXQgbmV3UG9pbnQgPSB0aGlzLnRyYW5zZm9ybVBvaW50KHNlZ21lbnQucG9pbnQpO1xyXG4gICAgICAgICAgICBvcmlnUG9pbnQueCA9IG5ld1BvaW50Lng7XHJcbiAgICAgICAgICAgIG9yaWdQb2ludC55ID0gbmV3UG9pbnQueTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuIiwiXHJcbmNsYXNzIFNlZ21lbnRIYW5kbGUgZXh0ZW5kcyBwYXBlci5TaGFwZSB7XHJcbiBcclxuICAgIHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XHJcbiAgICBvbkNoYW5nZUNvbXBsZXRlOiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfc21vb3RoZWQ6IGJvb2xlYW47XHJcbiBcclxuICAgIGNvbnN0cnVjdG9yKHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQsIHJhZGl1cz86IG51bWJlcil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNlZ21lbnQgPSBzZWdtZW50O1xyXG5cclxuICAgICAgICBsZXQgc2VsZiA9IDxhbnk+dGhpcztcclxuICAgICAgICBzZWxmLl90eXBlID0gJ2NpcmNsZSc7XHJcbiAgICAgICAgc2VsZi5fcmFkaXVzID0gNztcclxuICAgICAgICBzZWxmLl9zaXplID0gbmV3IHBhcGVyLlNpemUoc2VsZi5fcmFkaXVzICogMik7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGUoc2VnbWVudC5wb2ludCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDI7XHJcbiAgICAgICAgdGhpcy5zdHJva2VDb2xvciA9ICdibHVlJztcclxuICAgICAgICB0aGlzLmZpbGxDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gMC41OyBcclxuXHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0gPE1vdXNlQmVoYXZpb3I+e1xyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3UG9zID0gdGhpcy5wb3NpdGlvbi5hZGQoZXZlbnQuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ld1BvcztcclxuICAgICAgICAgICAgICAgIHNlZ21lbnQucG9pbnQgPSBuZXdQb3M7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ0VuZDogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc21vb3RoZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMub25DaGFuZ2VDb21wbGV0ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5nZUNvbXBsZXRlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25DbGljazogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zbW9vdGhlZCA9ICF0aGlzLnNtb290aGVkO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkNoYW5nZUNvbXBsZXRlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbmdlQ29tcGxldGUoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgc21vb3RoZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Ntb290aGVkO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXQgc21vb3RoZWQodmFsdWU6IGJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuX3Ntb290aGVkID0gdmFsdWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudC5oYW5kbGVJbiA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudC5oYW5kbGVPdXQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgU3RyZXRjaHlQYXRoIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgIG9wdGlvbnM6IFN0cmV0Y2h5UGF0aE9wdGlvbnM7XHJcbiAgICAgICAgXHJcbiAgICBzb3VyY2VQYXRoOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBkaXNwbGF5UGF0aDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgY29ybmVyczogcGFwZXIuU2VnbWVudFtdO1xyXG4gICAgb3V0bGluZTogcGFwZXIuUGF0aDtcclxuICAgIFxyXG4gICAgc3RhdGljIE9VVExJTkVfUE9JTlRTID0gMjMwO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEZvciByZWJ1aWxkaW5nIHRoZSBtaWRwb2ludCBoYW5kbGVzXHJcbiAgICAgKiBhcyBvdXRsaW5lIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIG1pZHBvaW50R3JvdXA6IHBhcGVyLkdyb3VwO1xyXG4gICAgc2VnbWVudEdyb3VwOiBwYXBlci5Hcm91cDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VQYXRoOiBwYXBlci5Db21wb3VuZFBhdGgsIG9wdGlvbnM/OiBTdHJldGNoeVBhdGhPcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCA8U3RyZXRjaHlQYXRoT3B0aW9ucz57XHJcbiAgICAgICAgICAgIHBhdGhGaWxsQ29sb3I6ICdncmF5J1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc291cmNlUGF0aCA9IHNvdXJjZVBhdGg7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXRoLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVPdXRsaW5lKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVTZWdtZW50TWFya2VycygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWlkcGlvbnRNYXJrZXJzKCk7XHJcblxyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IHtcclxuICAgICAgICAgICAgb25DbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5icmluZ1RvRnJvbnQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdTdGFydDogKCkgPT4gdGhpcy5icmluZ1RvRnJvbnQoKSxcclxuICAgICAgICAgICAgb25EcmFnTW92ZTogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQoZXZlbnQuZGVsdGEpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbk92ZXJTdGFydDogKCkgPT4gdGhpcy5zZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KHRydWUpLFxyXG4gICAgICAgICAgICBvbk92ZXJFbmQ6ICgpID0+IHRoaXMuc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eShmYWxzZSlcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eShmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eSh2YWx1ZTogYm9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5zZWdtZW50R3JvdXAudmlzaWJsZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubWlkcG9pbnRHcm91cC52aXNpYmxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lLnN0cm9rZUNvbG9yID0gdmFsdWUgPyAnbGlnaHRncmF5JyA6IG51bGw7IFxyXG4gICAgfVxyXG5cclxuICAgIGFycmFuZ2VDb250ZW50cygpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1pZHBpb250TWFya2VycygpO1xyXG4gICAgICAgIHRoaXMuYXJyYW5nZVBhdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBhcnJhbmdlUGF0aCgpIHtcclxuICAgICAgICBsZXQgb3J0aE9yaWdpbiA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMudG9wTGVmdDtcclxuICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy53aWR0aDtcclxuICAgICAgICBsZXQgb3J0aEhlaWdodCA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBzaWRlcyA9IHRoaXMuZ2V0T3V0bGluZVNpZGVzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHRvcCA9IHNpZGVzWzBdO1xyXG4gICAgICAgIGxldCBib3R0b20gPSBzaWRlc1syXTtcclxuICAgICAgICBib3R0b20ucmV2ZXJzZSgpO1xyXG4gICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLnNhbmR3aWNoUGF0aFByb2plY3Rpb24odG9wLCBib3R0b20pO1xyXG4gICAgICAgIGxldCB0cmFuc2Zvcm0gPSBuZXcgUGF0aFRyYW5zZm9ybShwb2ludCA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KG9ydGhPcmlnaW4pO1xyXG4gICAgICAgICAgICBsZXQgdW5pdCA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gb3J0aEhlaWdodCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0ZWQgPSBwcm9qZWN0aW9uKHVuaXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IobGV0IHNpZGUgb2Ygc2lkZXMpe1xyXG4gICAgICAgICAgICBzaWRlLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBsZXQgbmV3UGF0aCA9IFBhcGVySGVscGVycy50cmFjZUNvbXBvdW5kUGF0aCh0aGlzLnNvdXJjZVBhdGgsIFxyXG4gICAgICAgICAgICBTdHJldGNoeVBhdGguT1VUTElORV9QT0lOVFMpO1xyXG4gICAgICAgIG5ld1BhdGgudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgbmV3UGF0aC5maWxsQ29sb3IgPSB0aGlzLm9wdGlvbnMucGF0aEZpbGxDb2xvcjtcclxuXHJcbiAgICAgICAgdHJhbnNmb3JtLnRyYW5zZm9ybVBhdGhJdGVtKG5ld1BhdGgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXNwbGF5UGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlQYXRoLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5UGF0aCA9IG5ld1BhdGg7XHJcbiAgICAgICAgdGhpcy5pbnNlcnRDaGlsZCgxLCBuZXdQYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE91dGxpbmVTaWRlcygpOiBwYXBlci5QYXRoW10ge1xyXG4gICAgICAgIGxldCBzaWRlczogcGFwZXIuUGF0aFtdID0gW107XHJcbiAgICAgICAgbGV0IHNlZ21lbnRHcm91cDogcGFwZXIuU2VnbWVudFtdID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNvcm5lclBvaW50cyA9IHRoaXMuY29ybmVycy5tYXAoYyA9PiBjLnBvaW50KTtcclxuICAgICAgICBsZXQgZmlyc3QgPSBjb3JuZXJQb2ludHMuc2hpZnQoKTsgXHJcbiAgICAgICAgY29ybmVyUG9pbnRzLnB1c2goZmlyc3QpO1xyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0Q29ybmVyID0gY29ybmVyUG9pbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgbGV0IHNlZ21lbnRMaXN0ID0gdGhpcy5vdXRsaW5lLnNlZ21lbnRzLm1hcCh4ID0+IHgpO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBzZWdtZW50TGlzdC5wdXNoKHNlZ21lbnRMaXN0WzBdKTtcclxuICAgICAgICBmb3IobGV0IHNlZ21lbnQgb2Ygc2VnbWVudExpc3Qpe1xyXG4gICAgICAgICAgICBzZWdtZW50R3JvdXAucHVzaChzZWdtZW50KTtcclxuICAgICAgICAgICAgaWYodGFyZ2V0Q29ybmVyLmlzQ2xvc2Uoc2VnbWVudC5wb2ludCwgcGFwZXIuTnVtZXJpY2FsLkVQU0lMT04pKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmaW5pc2ggcGF0aFxyXG4gICAgICAgICAgICAgICAgc2lkZXMucHVzaChuZXcgcGFwZXIuUGF0aChzZWdtZW50R3JvdXApKTtcclxuICAgICAgICAgICAgICAgIHNlZ21lbnRHcm91cCA9IFtzZWdtZW50XTtcclxuICAgICAgICAgICAgICAgIHRhcmdldENvcm5lciA9IGNvcm5lclBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoc2lkZXMubGVuZ3RoICE9PSA0KXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignc2lkZXMnLCBzaWRlcyk7XHJcbiAgICAgICAgICAgIHRocm93ICdmYWlsZWQgdG8gZ2V0IHNpZGVzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHNpZGVzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZU91dGxpbmUoKSB7XHJcbiAgICAgICAgbGV0IGJvdW5kcyA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHM7XHJcbiAgICAgICAgbGV0IG91dGxpbmUgPSBuZXcgcGFwZXIuUGF0aChcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLmNvcm5lcnModGhpcy5zb3VyY2VQYXRoLmJvdW5kcykpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZih0aGlzLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yKXtcclxuICAgICAgICAgICAgb3V0bGluZS5maWxsQ29sb3IgPSB0aGlzLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yOyAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXRsaW5lLmZpbGxDb2xvciA9IHdpbmRvdy5hcHAuY2FudmFzQ29sb3I7XHJcbiAgICAgICAgICAgIG91dGxpbmUub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dGxpbmUuY2xvc2VkID0gdHJ1ZTtcclxuICAgICAgICBvdXRsaW5lLmRhc2hBcnJheSA9IFs1LCA1XTtcclxuICAgICAgICB0aGlzLm91dGxpbmUgPSBvdXRsaW5lO1xyXG5cclxuICAgICAgICAvLyB0cmFjayBjb3JuZXJzIHNvIHdlIGtub3cgaG93IHRvIGFycmFuZ2UgdGhlIHRleHRcclxuICAgICAgICB0aGlzLmNvcm5lcnMgPSBvdXRsaW5lLnNlZ21lbnRzLm1hcChzID0+IHMpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENoaWxkKG91dGxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2VnbWVudE1hcmtlcnMoKSB7XHJcbiAgICAgICAgbGV0IGJvdW5kcyA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHM7XHJcbiAgICAgICAgdGhpcy5zZWdtZW50R3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICBmb3IgKGxldCBzZWdtZW50IG9mIHRoaXMub3V0bGluZS5zZWdtZW50cykge1xyXG4gICAgICAgICAgICBsZXQgaGFuZGxlID0gbmV3IFNlZ21lbnRIYW5kbGUoc2VnbWVudCk7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbkNoYW5nZUNvbXBsZXRlID0gKCkgPT4gdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50R3JvdXAuYWRkQ2hpbGQoaGFuZGxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLnNlZ21lbnRHcm91cCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVNaWRwaW9udE1hcmtlcnMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5taWRwb2ludEdyb3VwKXtcclxuICAgICAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICB0aGlzLm91dGxpbmUuY3VydmVzLmZvckVhY2goY3VydmUgPT4ge1xyXG4gICAgICAgICAgICAvLyBza2lwIGxlZnQgYW5kIHJpZ2h0IHNpZGVzXHJcbiAgICAgICAgICAgIGlmKGN1cnZlLnNlZ21lbnQxID09PSB0aGlzLmNvcm5lcnNbMV1cclxuICAgICAgICAgICAgICAgIHx8IGN1cnZlLnNlZ21lbnQxID09PSB0aGlzLmNvcm5lcnNbM10pe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjsgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGhhbmRsZSA9IG5ldyBDdXJ2ZVNwbGl0dGVySGFuZGxlKGN1cnZlKTtcclxuICAgICAgICAgICAgaGFuZGxlLm9uRHJhZ0VuZCA9IChuZXdTZWdtZW50LCBldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld0hhbmRsZSA9IG5ldyBTZWdtZW50SGFuZGxlKG5ld1NlZ21lbnQpO1xyXG4gICAgICAgICAgICAgICAgbmV3SGFuZGxlLm9uQ2hhbmdlQ29tcGxldGUgPSAoKSA9PiB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWdtZW50R3JvdXAuYWRkQ2hpbGQobmV3SGFuZGxlKTtcclxuICAgICAgICAgICAgICAgIGhhbmRsZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMubWlkcG9pbnRHcm91cC5hZGRDaGlsZChoYW5kbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5taWRwb2ludEdyb3VwKTtcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIFN0cmV0Y2h5UGF0aE9wdGlvbnMge1xyXG4gICAgcGF0aEZpbGxDb2xvcjogc3RyaW5nO1xyXG4gICAgYmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XHJcbn1cclxuIiwiXHJcbmNsYXNzIFN0cmV0Y2h5VGV4dCBleHRlbmRzIFN0cmV0Y2h5UGF0aCB7XHJcblxyXG4gICAgb3B0aW9uczogU3RyZXRjaHlUZXh0T3B0aW9ucztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcsIGZvbnQ6IG9wZW50eXBlLkZvbnQsIG9wdGlvbnM/OiBTdHJldGNoeVRleHRPcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCA8U3RyZXRjaHlUZXh0T3B0aW9ucz57XHJcbiAgICAgICAgICAgIGZvbnRTaXplOiAzMlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IG9wZW5UeXBlUGF0aCA9IGZvbnQuZ2V0UGF0aCh0ZXh0LCAwLCAwLCB0aGlzLm9wdGlvbnMuZm9udFNpemUpO1xyXG4gICAgICAgIGxldCB0ZXh0UGF0aCA9IFBhcGVySGVscGVycy5pbXBvcnRPcGVuVHlwZVBhdGgob3BlblR5cGVQYXRoKTtcclxuXHJcbiAgICAgICAgc3VwZXIodGV4dFBhdGgsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgU3RyZXRjaHlUZXh0T3B0aW9ucyBleHRlbmRzIFN0cmV0Y2h5UGF0aE9wdGlvbnMge1xyXG4gICAgZm9udFNpemU6IG51bWJlcjtcclxufVxyXG4iLCJcclxuLyoqXHJcbiAqIE1lYXN1cmVzIG9mZnNldHMgb2YgdGV4dCBnbHlwaHMuXHJcbiAqL1xyXG5jbGFzcyBUZXh0UnVsZXIge1xyXG4gICAgXHJcbiAgICBmb250RmFtaWx5OiBzdHJpbmc7XHJcbiAgICBmb250V2VpZ2h0OiBudW1iZXI7XHJcbiAgICBmb250U2l6ZTogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCAodGV4dCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XHJcbiAgICAgICAgcG9pbnRUZXh0LmNvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgIHBvaW50VGV4dC5qdXN0aWZpY2F0aW9uID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBpZih0aGlzLmZvbnRGYW1pbHkpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udEZhbWlseSA9IHRoaXMuZm9udEZhbWlseTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5mb250V2VpZ2h0KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRXZWlnaHQgPSB0aGlzLmZvbnRXZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFNpemUpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcG9pbnRUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRleHRPZmZzZXRzKHRleHQpe1xyXG4gICAgICAgIC8vIE1lYXN1cmUgZ2x5cGhzIGluIHBhaXJzIHRvIGNhcHR1cmUgd2hpdGUgc3BhY2UuXHJcbiAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxyXG4gICAgICAgIHZhciBnbHlwaFBhaXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpKzEpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRm9yIGVhY2ggY2hhcmFjdGVyLCBmaW5kIGNlbnRlciBvZmZzZXQuXHJcbiAgICAgICAgdmFyIHhPZmZzZXRzID0gWzBdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gTWVhc3VyZSB0aHJlZSBjaGFyYWN0ZXJzIGF0IGEgdGltZSB0byBnZXQgdGhlIGFwcHJvcHJpYXRlIFxyXG4gICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxyXG4gICAgICAgICAgICB2YXIgdHJpYWRUZXh0ID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSAtIDEsIGkgKyAxKSk7XHJcbiAgICAgICAgICAgIHRyaWFkVGV4dC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXHJcbiAgICAgICAgICAgIC8vICAgYW5kIGhhbGYgb2YgY3VycmVudCBnbHlwaCBwYWlyLlxyXG4gICAgICAgICAgICAvLyBNdXN0IGJlIHJpZ2h0LCBiZWNhdXNlIGl0IHdvcmtzLlxyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2kgLSAxXS5ib3VuZHMud2lkdGggLyAyIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHdpZHRoIHRvIHByaW9yIG9mZnNldC4gXHJcbiAgICAgICAgICAgIHhPZmZzZXRzW2ldID0geE9mZnNldHNbaSAtIDFdICsgb2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgZ2x5cGhQYWlyIG9mIGdseXBoUGFpcnMpe1xyXG4gICAgICAgICAgICBnbHlwaFBhaXIucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB4T2Zmc2V0cztcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgVmlld1pvb20ge1xyXG5cclxuICAgIHBhcGVyU2NvcGU6IHBhcGVyLlBhcGVyU2NvcGU7XHJcbiAgICBmYWN0b3IgPSAxLjI1O1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9taW5ab29tOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9tYXhab29tOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFwZXJTY29wZTogcGFwZXIuUGFwZXJTY29wZSkge1xyXG4gICAgICAgIHRoaXMucGFwZXJTY29wZSA9IHBhcGVyU2NvcGU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLnBhcGVyU2NvcGUudmlldztcclxuXHJcbiAgICAgICAgKDxhbnk+JCh2aWV3LmVsZW1lbnQpKS5tb3VzZXdoZWVsKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbW91c2VQb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludChldmVudC5vZmZzZXRYLCBldmVudC5vZmZzZXRZKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2Vab29tQ2VudGVyZWQoZXZlbnQuZGVsdGFZLCBtb3VzZVBvc2l0aW9uKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgem9vbSgpOiBudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFwZXJTY29wZS52aWV3Lnpvb207XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHpvb21SYW5nZSgpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLl9taW5ab29tLCB0aGlzLl9tYXhab29tXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB6b29tIGxldmVsLlxyXG4gICAgICogQHJldHVybnMgem9vbSBsZXZlbCB0aGF0IHdhcyBzZXQsIG9yIG51bGwgaWYgaXQgd2FzIG5vdCBjaGFuZ2VkXHJcbiAgICAgKi9cclxuICAgIHNldFpvb21Db25zdHJhaW5lZCh6b29tOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGlmKHRoaXMuX21pblpvb20pIHtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWF4KHpvb20sIHRoaXMuX21pblpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9tYXhab29tKXtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWluKHpvb20sIHRoaXMuX21heFpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucGFwZXJTY29wZS52aWV3O1xyXG4gICAgICAgIGlmKHpvb20gIT0gdmlldy56b29tKXtcclxuICAgICAgICAgICAgdmlldy56b29tID0gem9vbTtcclxuICAgICAgICAgICAgcmV0dXJuIHpvb207XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFpvb21SYW5nZShyYW5nZTogcGFwZXIuU2l6ZVtdKTogbnVtYmVyW10ge1xyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wYXBlclNjb3BlLnZpZXc7XHJcbiAgICAgICAgbGV0IGFTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICBsZXQgYlNpemUgPSByYW5nZS5zaGlmdCgpO1xyXG4gICAgICAgIGxldCBhID0gYVNpemUgJiYgTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBhU2l6ZS5oZWlnaHQsICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYVNpemUud2lkdGgpO1xyXG4gICAgICAgIGxldCBiID0gYlNpemUgJiYgTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBiU2l6ZS5oZWlnaHQsICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYlNpemUud2lkdGgpO1xyXG4gICAgICAgIGxldCBtaW4gPSBNYXRoLm1pbihhLGIpO1xyXG4gICAgICAgIGlmKG1pbil7XHJcbiAgICAgICAgICAgIHRoaXMuX21pblpvb20gPSBtaW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBtYXggPSBNYXRoLm1heChhLGIpO1xyXG4gICAgICAgIGlmKG1heCl7XHJcbiAgICAgICAgICAgIHRoaXMuX21heFpvb20gPSBtYXg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlWm9vbUNlbnRlcmVkKGRlbHRhWTogbnVtYmVyLCBtb3VzZVBvczogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICBpZiAoIWRlbHRhWSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wYXBlclNjb3BlLnZpZXc7XHJcbiAgICAgICAgbGV0IG9sZFpvb20gPSB2aWV3Lnpvb207XHJcbiAgICAgICAgbGV0IG9sZENlbnRlciA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgIGxldCB2aWV3UG9zID0gdmlldy52aWV3VG9Qcm9qZWN0KG1vdXNlUG9zKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbmV3Wm9vbSA9IGRlbHRhWSA+IDBcclxuICAgICAgICAgICAgPyB2aWV3Lnpvb20gKiB0aGlzLmZhY3RvclxyXG4gICAgICAgICAgICA6IHZpZXcuem9vbSAvIHRoaXMuZmFjdG9yO1xyXG4gICAgICAgIG5ld1pvb20gPSB0aGlzLnNldFpvb21Db25zdHJhaW5lZChuZXdab29tKTtcclxuICAgICAgICBcclxuICAgICAgICBpZighbmV3Wm9vbSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB6b29tU2NhbGUgPSBvbGRab29tIC8gbmV3Wm9vbTtcclxuICAgICAgICBsZXQgY2VudGVyQWRqdXN0ID0gdmlld1Bvcy5zdWJ0cmFjdChvbGRDZW50ZXIpO1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSB2aWV3UG9zLnN1YnRyYWN0KGNlbnRlckFkanVzdC5tdWx0aXBseSh6b29tU2NhbGUpKVxyXG4gICAgICAgICAgICAuc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuXHJcbiAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LmNlbnRlci5hZGQob2Zmc2V0KTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHpvb21UbyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpe1xyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wYXBlclNjb3BlLnZpZXc7XHJcbiAgICAgICAgdmlldy5jZW50ZXIgPSByZWN0LmNlbnRlcjtcclxuICAgICAgICB2aWV3Lnpvb20gPSBNYXRoLm1pbiggXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIHJlY3QuaGVpZ2h0LCAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIHJlY3Qud2lkdGgpICogMC45NTtcclxuICAgIH1cclxufVxyXG4iXX0=