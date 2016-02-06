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
        this.canvasColor = '#E9E0C3';
        var canvas = document.getElementById('mainCanvas');
        paper.setup(canvas);
        this.paper = paper;
        new FontLoader(Roboto500, function (font) {
            _this.font = font;
            _this.warp = new TextWarpController(_this);
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
                var stretchy = new StretchyText(block.text, this.app.font, {
                    fontSize: 128,
                    pathFillColor: block.textColor,
                    backgroundColor: block.backgroundColor
                });
                block.item = stretchy;
            }
        }
    };
    return TextWarpController;
})();
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            if (event.key == 'space') {
                paper.project.activeLayer.selected = !paper.project.activeLayer.selected;
            }
        };
    }
    /**
     * Determine if possibleAncestor is an ancestor of item.
     */
    MouseBehaviorTool.isSameOrAncestor = function (item, possibleAncestor) {
        return !!PaperHelpers.findSelfOrAncestor(item, function (pa) { return pa === possibleAncestor; });
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
            onClick: function () { return _this.bringToFront(); },
            onDragStart: function () { return _this.bringToFront(); },
            onDragMove: function (event) { return _this.position = _this.position.add(event.delta); },
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
    StretchyPath.OUTLINE_POINTS = 200;
    return StretchyPath;
})(paper.Group);
var StretchyText = (function (_super) {
    __extends(StretchyText, _super);
    function StretchyText(text, font, options) {
        this.options = options || {
            fontSize: 64
        };
        var openTypePath = font.getPath(text, 0, 0, this.options.fontSize);
        var textPath = PaperHelpers.importOpenTypePath(openTypePath);
        _super.call(this, textPath, options);
        this.position = new paper.Point(this.strokeBounds.width / 2, this.strokeBounds.height / 2);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyIsIi4uLy4uL3NyYy9hcHAvQXBwQ29udHJvbGxlci50cyIsIi4uLy4uL3NyYy9hcHAvRm9udExvYWRlci50cyIsIi4uLy4uL3NyYy9hcHAvSGVscGVycy50cyIsIi4uLy4uL3NyYy9hcHAvVGV4dFdhcnBDb250cm9sbGVyLnRzIiwiLi4vLi4vc3JjL21hdGgvUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHMiLCIuLi8uLi9zcmMvcGFwZXIvQ3VydmVTcGxpdHRlckhhbmRsZS50cyIsIi4uLy4uL3NyYy9wYXBlci9Nb3VzZUJlaGF2aW9yVG9vbC50cyIsIi4uLy4uL3NyYy9wYXBlci9QYXBlckhlbHBlcnMudHMiLCIuLi8uLi9zcmMvcGFwZXIvUGF0aFNlY3Rpb24udHMiLCIuLi8uLi9zcmMvcGFwZXIvUGF0aFRyYW5zZm9ybS50cyIsIi4uLy4uL3NyYy9wYXBlci9TZWdtZW50SGFuZGxlLnRzIiwiLi4vLi4vc3JjL3BhcGVyL1N0cmV0Y2h5UGF0aC50cyIsIi4uLy4uL3NyYy9wYXBlci9TdHJldGNoeVRleHQudHMiLCIuLi8uLi9zcmMvcGFwZXIvVGV4dFJ1bGVyLnRzIl0sIm5hbWVzIjpbIkFwcENvbnRyb2xsZXIiLCJBcHBDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQXBwQ29udHJvbGxlci5hZGRUZXh0IiwiRm9udExvYWRlciIsIkZvbnRMb2FkZXIuY29uc3RydWN0b3IiLCJuZXdpZCIsIlRleHRXYXJwQ29udHJvbGxlciIsIlRleHRXYXJwQ29udHJvbGxlci5jb25zdHJ1Y3RvciIsIlRleHRXYXJwQ29udHJvbGxlci51cGRhdGUiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybSIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtLmNvbnN0cnVjdG9yIiwiUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHJhbnNmb3JtUG9pbnQiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS5jcmVhdGVNYXRyaXgiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS5tdWx0aXBseSIsIlF1YWQiLCJRdWFkLmNvbnN0cnVjdG9yIiwiUXVhZC5mcm9tUmVjdGFuZ2xlIiwiUXVhZC5mcm9tQ29vcmRzIiwiUXVhZC5hc0Nvb3JkcyIsIkN1cnZlU3BsaXR0ZXJIYW5kbGUiLCJDdXJ2ZVNwbGl0dGVySGFuZGxlLmNvbnN0cnVjdG9yIiwiTW91c2VCZWhhdmlvclRvb2wiLCJNb3VzZUJlaGF2aW9yVG9vbC5jb25zdHJ1Y3RvciIsIk1vdXNlQmVoYXZpb3JUb29sLmlzU2FtZU9yQW5jZXN0b3IiLCJNb3VzZUJlaGF2aW9yVG9vbC5maW5kRHJhZ0hhbmRsZXIiLCJNb3VzZUJlaGF2aW9yVG9vbC5maW5kT3ZlckhhbmRsZXIiLCJQYXBlckhlbHBlcnMiLCJQYXBlckhlbHBlcnMuY29uc3RydWN0b3IiLCJQYXBlckhlbHBlcnMuaW1wb3J0T3BlblR5cGVQYXRoIiwiUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEl0ZW0iLCJQYXBlckhlbHBlcnMudHJhY2VDb21wb3VuZFBhdGgiLCJQYXBlckhlbHBlcnMudHJhY2VQYXRoIiwiUGFwZXJIZWxwZXJzLnNhbmR3aWNoUGF0aFByb2plY3Rpb24iLCJQYXBlckhlbHBlcnMucmVzZXRNYXJrZXJzIiwiUGFwZXJIZWxwZXJzLm1hcmtlckxpbmUiLCJQYXBlckhlbHBlcnMubWFya2VyIiwiUGFwZXJIZWxwZXJzLnNpbXBsaWZ5IiwiUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvciIsIlBhcGVySGVscGVycy5maW5kQW5jZXN0b3IiLCJQYXBlckhlbHBlcnMuY29ybmVycyIsIlBhdGhTZWN0aW9uIiwiUGF0aFNlY3Rpb24uY29uc3RydWN0b3IiLCJQYXRoU2VjdGlvbi5nZXRQb2ludEF0IiwiUGF0aFRyYW5zZm9ybSIsIlBhdGhUcmFuc2Zvcm0uY29uc3RydWN0b3IiLCJQYXRoVHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50IiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoSXRlbSIsIlBhdGhUcmFuc2Zvcm0udHJhbnNmb3JtQ29tcG91bmRQYXRoIiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoIiwiU2VnbWVudEhhbmRsZSIsIlNlZ21lbnRIYW5kbGUuY29uc3RydWN0b3IiLCJTZWdtZW50SGFuZGxlLnNtb290aGVkIiwiU3RyZXRjaHlQYXRoIiwiU3RyZXRjaHlQYXRoLmNvbnN0cnVjdG9yIiwiU3RyZXRjaHlQYXRoLnNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkiLCJTdHJldGNoeVBhdGguYXJyYW5nZUNvbnRlbnRzIiwiU3RyZXRjaHlQYXRoLmFycmFuZ2VQYXRoIiwiU3RyZXRjaHlQYXRoLmdldE91dGxpbmVTaWRlcyIsIlN0cmV0Y2h5UGF0aC5jcmVhdGVPdXRsaW5lIiwiU3RyZXRjaHlQYXRoLmNyZWF0ZVNlZ21lbnRNYXJrZXJzIiwiU3RyZXRjaHlQYXRoLnVwZGF0ZU1pZHBpb250TWFya2VycyIsIlN0cmV0Y2h5VGV4dCIsIlN0cmV0Y2h5VGV4dC5jb25zdHJ1Y3RvciIsIlRleHRSdWxlciIsIlRleHRSdWxlci5jb25zdHJ1Y3RvciIsIlRleHRSdWxlci5jcmVhdGVQb2ludFRleHQiLCJUZXh0UnVsZXIuZ2V0VGV4dE9mZnNldHMiXSwibWFwcGluZ3MiOiJBQU1BLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFFZCxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7QUFFckMsQ0FBQyxDQUFDLENBQUM7QUNUSCxJQUFNLFNBQVMsR0FBRyx3RkFBd0YsQ0FBQztBQUMzRyxJQUFNLFNBQVMsR0FBRyxrRUFBa0UsQ0FBQztBQUNyRixJQUFNLFNBQVMsR0FBRyxzQkFBc0IsQ0FBQztBQUV6QztJQVFJQTtRQVJKQyxpQkF1Q0NBO1FBbkNHQSxlQUFVQSxHQUFnQkEsRUFBRUEsQ0FBQ0E7UUFFN0JBLGdCQUFXQSxHQUFHQSxTQUFTQSxDQUFDQTtRQUdwQkEsSUFBSUEsTUFBTUEsR0FBR0EsUUFBUUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFDbkRBLEtBQUtBLENBQUNBLEtBQUtBLENBQW9CQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUN2Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFbkJBLElBQUlBLFVBQVVBLENBQUNBLFNBQVNBLEVBQUVBLFVBQUFBLElBQUlBO1lBQzFCQSxLQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUNqQkEsS0FBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsa0JBQWtCQSxDQUFDQSxLQUFJQSxDQUFDQSxDQUFDQTtZQUV6Q0EsS0FBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7UUFDbkJBLENBQUNBLENBQUNBLENBQUNBO0lBRVBBLENBQUNBO0lBRURELCtCQUFPQSxHQUFQQTtRQUNJRSxJQUFJQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUUvQkEsRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7WUFDbkJBLElBQUlBLEtBQUtBLEdBQWVBO2dCQUNwQkEsR0FBR0EsRUFBRUEsS0FBS0EsRUFBRUE7Z0JBQ1pBLElBQUlBLEVBQUVBLElBQUlBO2dCQUNWQSxTQUFTQSxFQUFFQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQTtnQkFDaENBLGVBQWVBLEVBQUVBLENBQUNBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUE7YUFDL0NBLENBQUNBO1lBQ0ZBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBRTVCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtZQUVuQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7UUFDM0JBLENBQUNBO0lBQ0xBLENBQUNBO0lBQ0xGLG9CQUFDQTtBQUFEQSxDQUFDQSxBQXZDRCxJQXVDQztBQzNDRDtJQUlJRyxvQkFBWUEsT0FBZUEsRUFBRUEsUUFBdUNBO1FBQ2hFQyxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxVQUFTQSxHQUFHQSxFQUFFQSxJQUFJQTtZQUNyQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQ3JCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM5QixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQ0EsQ0FBQ0E7SUFDUEEsQ0FBQ0E7SUFDTEQsaUJBQUNBO0FBQURBLENBQUNBLEFBaEJELElBZ0JDO0FDaEJEO0lBQ0lFLE1BQU1BLENBQUNBLENBQUNBLElBQUlBLElBQUlBLEVBQUVBLENBQUNBLE9BQU9BLEVBQUVBLEdBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO0FBQzdEQSxDQUFDQTtBQ0hELDBDQUEwQztBQUUxQztJQUdJQyw0QkFBWUEsR0FBa0JBO1FBQzFCQyxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUVmQSxJQUFJQSxpQkFBaUJBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0lBQ2pDQSxDQUFDQTtJQUVERCxtQ0FBTUEsR0FBTkE7UUFDSUUsR0FBR0EsQ0FBQUEsQ0FBY0EsVUFBbUJBLEVBQW5CQSxLQUFBQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFVQSxFQUFoQ0EsY0FBU0EsRUFBVEEsSUFBZ0NBLENBQUNBO1lBQWpDQSxJQUFJQSxLQUFLQSxTQUFBQTtZQUNUQSxFQUFFQSxDQUFBQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFBQSxDQUFDQTtnQkFDWkEsSUFBSUEsUUFBUUEsR0FBR0EsSUFBSUEsWUFBWUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsRUFDbENBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLEVBQ1FBO29CQUNqQkEsUUFBUUEsRUFBRUEsR0FBR0E7b0JBQ2JBLGFBQWFBLEVBQUVBLEtBQUtBLENBQUNBLFNBQVNBO29CQUM5QkEsZUFBZUEsRUFBRUEsS0FBS0EsQ0FBQ0EsZUFBZUE7aUJBQ3pDQSxDQUFDQSxDQUFDQTtnQkFDWEEsS0FBS0EsQ0FBQ0EsSUFBSUEsR0FBR0EsUUFBUUEsQ0FBQ0E7WUFDMUJBLENBQUNBO1NBQ0pBO0lBQ0xBLENBQUNBO0lBQ0xGLHlCQUFDQTtBQUFEQSxDQUFDQSxBQXZCRCxJQXVCQztBQ3RCRDtJQU9JRyw4QkFBWUEsTUFBWUEsRUFBRUEsSUFBVUE7UUFDaENDLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBO1FBQ3JCQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUVqQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0Esb0JBQW9CQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUNsRUEsQ0FBQ0E7SUFFREQsZ0ZBQWdGQTtJQUNoRkEsMkVBQTJFQTtJQUMzRUEsZ0ZBQWdGQTtJQUNoRkEsNkNBQWNBLEdBQWRBLFVBQWVBLEtBQWtCQTtRQUM3QkUsSUFBSUEsRUFBRUEsR0FBR0Esb0JBQW9CQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM5RUEsSUFBSUEsTUFBTUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDM0RBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO0lBQ2xCQSxDQUFDQTtJQUVNRixpQ0FBWUEsR0FBbkJBLFVBQW9CQSxNQUFZQSxFQUFFQSxNQUFZQTtRQUUxQ0csSUFBSUEsWUFBWUEsR0FBR0E7WUFDZkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDOUJBLElBQUlBLFlBQVlBLEdBQUdBO1lBQ2ZBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBRTlCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxZQUFZQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUNsRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDN0NBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzNFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMvRUEsQ0FBQ0E7UUFFREEsSUFBSUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDMUJBLE1BQU1BLENBQUNBO1lBQ0hBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ25CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoQkEsQ0FBQ0EsRUFBS0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBS0EsQ0FBQ0E7WUFDbkJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUtBLENBQUNBO1NBQ3RCQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFTQSxDQUFDQTtZQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDM0MsQ0FBQyxDQUFDQSxDQUFDQTtJQUNQQSxDQUFDQTtJQUVESCwyRUFBMkVBO0lBQzNFQSxxQ0FBcUNBO0lBQ3JDQSxxQ0FBcUNBO0lBQ3JDQSxxQ0FBcUNBO0lBQ3JDQSxxQ0FBcUNBO0lBQzlCQSw2QkFBUUEsR0FBZkEsVUFBZ0JBLE1BQU1BLEVBQUVBLE1BQU1BO1FBQzFCSSxNQUFNQSxDQUFDQTtZQUNIQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFFQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvRkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0ZBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQy9GQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtTQUNsR0EsQ0FBQ0E7SUFDTkEsQ0FBQ0E7SUFDTEosMkJBQUNBO0FBQURBLENBQUNBLEFBbEVELElBa0VDO0FBRUQ7SUFNSUssY0FBWUEsQ0FBY0EsRUFBRUEsQ0FBY0EsRUFBRUEsQ0FBY0EsRUFBRUEsQ0FBY0E7UUFDdEVDLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ1hBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ1hBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ1hBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO0lBQ2ZBLENBQUNBO0lBRU1ELGtCQUFhQSxHQUFwQkEsVUFBcUJBLElBQXFCQTtRQUN0Q0UsTUFBTUEsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FDWEEsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFDWkEsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFDYkEsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFDZkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FDbkJBLENBQUNBO0lBQ05BLENBQUNBO0lBRU1GLGVBQVVBLEdBQWpCQSxVQUFrQkEsTUFBZ0JBO1FBQzlCRyxNQUFNQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUNYQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUNyQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFDckNBLElBQUlBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQ3JDQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUN4Q0EsQ0FBQUE7SUFDTEEsQ0FBQ0E7SUFFREgsdUJBQVFBLEdBQVJBO1FBQ0lJLE1BQU1BLENBQUNBO1lBQ0hBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2xCQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNsQkEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbEJBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1NBQ3JCQSxDQUFDQTtJQUNOQSxDQUFDQTtJQUNMSixXQUFDQTtBQUFEQSxDQUFDQSxBQXZDRCxJQXVDQzs7Ozs7O0FDN0dEOzs7R0FHRztBQUNIO0lBQWtDSyx1Q0FBV0E7SUFLekNBLDZCQUFZQSxLQUFrQkE7UUFMbENDLGlCQTBDQ0E7UUFwQ09BLGlCQUFPQSxDQUFDQTtRQUVSQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUVuQkEsSUFBSUEsSUFBSUEsR0FBUUEsSUFBSUEsQ0FBQ0E7UUFDckJBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLFFBQVFBLENBQUNBO1FBQ3RCQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNqQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDOUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLEdBQUdBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1FBRXJEQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNyQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLE9BQU9BLENBQUNBO1FBQ3pCQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUV6QkEsSUFBSUEsVUFBeUJBLENBQUNBO1FBQzlCQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFrQkE7WUFDaENBLFdBQVdBLEVBQUVBLFVBQUNBLEtBQUtBO2dCQUNmQSxVQUFVQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFDOUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQ2JBLEtBQUtBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLEVBQ2ZBLFVBQVVBLENBQ2JBLENBQUNBO1lBQ05BLENBQUNBO1lBQ0RBLFVBQVVBLEVBQUVBLFVBQUFBLEtBQUtBO2dCQUNiQSxJQUFJQSxNQUFNQSxHQUFHQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDNUNBLEtBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLENBQUNBO2dCQUN2QkEsVUFBVUEsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0E7WUFDOUJBLENBQUNBO1lBQ0RBLFNBQVNBLEVBQUVBLFVBQUFBLEtBQUtBO2dCQUNaQSxFQUFFQSxDQUFBQSxDQUFDQSxLQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFBQSxDQUFDQTtvQkFDZkEsS0FBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsVUFBVUEsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RDQSxDQUFDQTtZQUNMQSxDQUFDQTtTQUNKQSxDQUFDQTtJQUNOQSxDQUFDQTtJQUNMRCwwQkFBQ0E7QUFBREEsQ0FBQ0EsQUExQ0QsRUFBa0MsS0FBSyxDQUFDLEtBQUssRUEwQzVDO0FDdEJEO0lBQWdDRSxxQ0FBVUE7SUFZdENBLDJCQUFZQSxVQUE0QkE7UUFaNUNDLGlCQTZJQ0E7UUFoSU9BLGlCQUFPQSxDQUFDQTtRQVhaQSxlQUFVQSxHQUFHQTtZQUNUQSxRQUFRQSxFQUFFQSxJQUFJQTtZQUNkQSxNQUFNQSxFQUFFQSxJQUFJQTtZQUNaQSxJQUFJQSxFQUFFQSxJQUFJQTtZQUNWQSxTQUFTQSxFQUFFQSxDQUFDQTtTQUNmQSxDQUFDQTtRQVNGQSxnQkFBV0EsR0FBR0EsVUFBQ0EsS0FBS0E7WUFDaEJBLEtBQUlBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBO1lBRXhCQSxJQUFJQSxTQUFTQSxHQUFHQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUNqQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsRUFDWEEsS0FBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFFckJBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLElBQUlBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUM5QkEsSUFBSUEsU0FBU0EsR0FBR0EsS0FBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JEQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDWkEsS0FBSUEsQ0FBQ0EsV0FBV0EsR0FBZ0JBO3dCQUM1QkEsSUFBSUEsRUFBRUEsU0FBU0E7cUJBQ2xCQSxDQUFDQTtnQkFDTkEsQ0FBQ0E7WUFFTEEsQ0FBQ0E7UUFDTEEsQ0FBQ0EsQ0FBQUE7UUFFREEsZ0JBQVdBLEdBQUdBLFVBQUNBLEtBQUtBO1lBQ2hCQSxJQUFJQSxTQUFTQSxHQUFHQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUNqQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsRUFDWEEsS0FBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFDckJBLElBQUlBLFdBQVdBLEdBQUdBLFNBQVNBO21CQUNwQkEsS0FBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFFNUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ0FBLDJCQUEyQkE7WUFDM0JBLEtBQUlBLENBQUNBLFdBQVdBO21CQUNiQTtnQkFDQ0EsaUNBQWlDQTtnQkFDakNBLFdBQVdBLElBQUlBLElBQUlBO3VCQUVoQkEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxnQkFBZ0JBLENBQ2xDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUNkQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUNsQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ0NBLGVBQWVBO2dCQUNmQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDaERBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO2dCQUN6REEsQ0FBQ0E7Z0JBQ0RBLEtBQUlBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBO1lBQzVCQSxDQUFDQTtZQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxXQUFXQSxJQUFJQSxXQUFXQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDM0NBLElBQUlBLFFBQVFBLEdBQUdBLFdBQVdBLENBQUNBLGFBQWFBLENBQUNBO2dCQUN6Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3BCQSxLQUFJQSxDQUFDQSxXQUFXQSxHQUFnQkE7d0JBQzVCQSxJQUFJQSxFQUFFQSxXQUFXQTtxQkFDcEJBLENBQUNBO29CQUNGQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDdkJBLFFBQVFBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUNoQ0EsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxJQUFJQSxRQUFRQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDbENBLFFBQVFBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO2dCQUMvQkEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7UUFDTEEsQ0FBQ0EsQ0FBQUE7UUFFREEsZ0JBQVdBLEdBQUdBLFVBQUNBLEtBQUtBO1lBQ2hCQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkJBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO29CQUM1QkEsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBQ2hDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbERBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQ2hEQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxFQUFFQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtvQkFDNURBLENBQUNBO2dCQUNMQSxDQUFDQTtnQkFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDdEZBLENBQUNBO1lBQ0xBLENBQUNBO1FBQ0xBLENBQUNBLENBQUFBO1FBRURBLGNBQVNBLEdBQUdBLFVBQUNBLEtBQUtBO1lBQ2RBLEVBQUVBLENBQUNBLENBQUNBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNuQkEsSUFBSUEsTUFBTUEsR0FBR0EsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQzlCQSxLQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFFeEJBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO29CQUNqQkEsT0FBT0E7b0JBQ1BBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO3dCQUN0Q0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pFQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNKQSxRQUFRQTtvQkFDUkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3BDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDL0RBLENBQUNBO2dCQUNMQSxDQUFDQTtZQUNMQSxDQUFDQTtRQUNMQSxDQUFDQSxDQUFBQTtRQUVEQSxjQUFTQSxHQUFHQSxVQUFDQSxLQUFLQTtZQUNkQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxJQUFJQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdkJBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLFFBQVFBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLFFBQVFBLENBQUNBO1lBQzdFQSxDQUFDQTtRQUNMQSxDQUFDQSxDQUFBQTtJQW5HREEsQ0FBQ0E7SUFxR0REOztPQUVHQTtJQUNJQSxrQ0FBZ0JBLEdBQXZCQSxVQUF3QkEsSUFBZ0JBLEVBQUVBLGdCQUE0QkE7UUFDbEVFLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsSUFBSUEsRUFBRUEsVUFBQUEsRUFBRUEsSUFBSUEsT0FBQUEsRUFBRUEsS0FBS0EsZ0JBQWdCQSxFQUF2QkEsQ0FBdUJBLENBQUNBLENBQUNBO0lBQ2xGQSxDQUFDQTtJQUVERiwyQ0FBZUEsR0FBZkEsVUFBZ0JBLElBQWdCQTtRQUM1QkcsTUFBTUEsQ0FBQ0EsWUFBWUEsQ0FBQ0Esa0JBQWtCQSxDQUNsQ0EsSUFBSUEsRUFDSkEsVUFBQUEsRUFBRUE7WUFDRUEsSUFBSUEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7WUFDMUJBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBO2dCQUNSQSxDQUFDQSxFQUFFQSxDQUFDQSxXQUFXQSxJQUFJQSxFQUFFQSxDQUFDQSxVQUFVQSxJQUFJQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMzREEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFFREgsMkNBQWVBLEdBQWZBLFVBQWdCQSxJQUFnQkE7UUFDNUJJLE1BQU1BLENBQUNBLFlBQVlBLENBQUNBLGtCQUFrQkEsQ0FDbENBLElBQUlBLEVBQ0pBLFVBQUFBLEVBQUVBO1lBQ0VBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLGFBQWFBLENBQUNBO1lBQzFCQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQTtnQkFDUkEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsV0FBV0EsSUFBSUEsRUFBRUEsQ0FBQ0EsVUFBVUEsSUFBSUEsRUFBRUEsQ0FBQ0EsU0FBU0EsQ0FBRUEsQ0FBQ0EsQ0FBQ0E7UUFDNURBLENBQUNBLENBQUNBLENBQUNBO0lBQ1hBLENBQUNBO0lBQ0xKLHdCQUFDQTtBQUFEQSxDQUFDQSxBQTdJRCxFQUFnQyxLQUFLLENBQUMsSUFBSSxFQTZJekM7QUNyS0Q7SUFBQUs7SUF5SUFDLENBQUNBO0lBdklVRCwrQkFBa0JBLEdBQXpCQSxVQUEwQkEsUUFBdUJBO1FBQzdDRSxNQUFNQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQSxZQUFZQSxDQUFDQSxRQUFRQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUVyREEsK0JBQStCQTtRQUMvQkEsbURBQW1EQTtJQUN2REEsQ0FBQ0E7SUFFTUYsMEJBQWFBLEdBQXBCQSxVQUFxQkEsSUFBb0JBLEVBQUVBLGFBQXFCQTtRQUM1REcsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsS0FBS0EsY0FBY0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDcENBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBcUJBLElBQUlBLEVBQUVBLGFBQWFBLENBQUNBLENBQUNBO1FBQzNFQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNKQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFhQSxJQUFJQSxFQUFFQSxhQUFhQSxDQUFDQSxDQUFDQTtRQUMzREEsQ0FBQ0E7SUFDTEEsQ0FBQ0E7SUFFTUgsOEJBQWlCQSxHQUF4QkEsVUFBeUJBLElBQXdCQSxFQUFFQSxhQUFxQkE7UUFBeEVJLGlCQVVDQTtRQVRHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDaEJBLENBQUNBO1FBQ0RBLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLFVBQUFBLENBQUNBO21CQUMzQkEsS0FBSUEsQ0FBQ0EsU0FBU0EsQ0FBYUEsQ0FBQ0EsRUFBRUEsYUFBYUEsQ0FBQ0E7UUFBNUNBLENBQTRDQSxDQUFDQSxDQUFDQTtRQUNsREEsTUFBTUEsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsWUFBWUEsQ0FBQ0E7WUFDMUJBLFFBQVFBLEVBQUVBLEtBQUtBO1lBQ2ZBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLFNBQVNBO1NBQzVCQSxDQUFDQSxDQUFBQTtJQUNOQSxDQUFDQTtJQUVNSixzQkFBU0EsR0FBaEJBLFVBQWlCQSxJQUFnQkEsRUFBRUEsU0FBaUJBO1FBQ2hESyx1REFBdURBO1FBQ3ZEQSwrQkFBK0JBO1FBQy9CQSxJQUFJQTtRQUNKQSxJQUFJQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUM3QkEsSUFBSUEsVUFBVUEsR0FBR0EsVUFBVUEsR0FBR0EsU0FBU0EsQ0FBQ0E7UUFDeENBLElBQUlBLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBO1FBQ2hCQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNWQSxJQUFJQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUVmQSxPQUFPQSxDQUFDQSxFQUFFQSxHQUFHQSxTQUFTQSxFQUFFQSxDQUFDQTtZQUNyQkEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsRUFBRUEsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDMURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQ25CQSxNQUFNQSxJQUFJQSxVQUFVQSxDQUFDQTtRQUN6QkEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDbEJBLFFBQVFBLEVBQUVBLE1BQU1BO1lBQ2hCQSxNQUFNQSxFQUFFQSxJQUFJQTtZQUNaQSxTQUFTQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQTtTQUM1QkEsQ0FBQ0EsQ0FBQ0E7SUFDUEEsQ0FBQ0E7SUFFTUwsbUNBQXNCQSxHQUE3QkEsVUFBOEJBLE9BQXdCQSxFQUFFQSxVQUEyQkE7UUFFL0VNLElBQU1BLGFBQWFBLEdBQUdBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBO1FBQ3JDQSxJQUFNQSxnQkFBZ0JBLEdBQUdBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBO1FBQzNDQSxNQUFNQSxDQUFDQSxVQUFTQSxTQUFzQkE7WUFDbEMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDO1lBQy9ELElBQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3hFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLElBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sK0NBQStDLEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pGLENBQUM7WUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxDQUFDLENBQUFBO0lBQ0xBLENBQUNBO0lBSU1OLHlCQUFZQSxHQUFuQkE7UUFDSU8sRUFBRUEsQ0FBQUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7WUFDekJBLFlBQVlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1FBQ3RDQSxDQUFDQTtRQUNEQSxZQUFZQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUM3Q0EsWUFBWUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsR0FBR0EsR0FBR0EsQ0FBQ0E7SUFFM0NBLENBQUNBO0lBRU1QLHVCQUFVQSxHQUFqQkEsVUFBa0JBLENBQWNBLEVBQUVBLENBQWNBO1FBQzVDUSxJQUFJQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxFQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNoQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsT0FBT0EsQ0FBQ0E7UUFDM0JBLDBCQUEwQkE7UUFDMUJBLFlBQVlBLENBQUNBLFdBQVdBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ3hDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNoQkEsQ0FBQ0E7SUFFTVIsbUJBQU1BLEdBQWJBLFVBQWNBLEtBQWtCQTtRQUM1QlMsSUFBSUEsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDMUNBLE1BQU1BLENBQUNBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBO1FBQzNCQSxZQUFZQSxDQUFDQSxXQUFXQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUMxQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7SUFDbEJBLENBQUNBO0lBRU1ULHFCQUFRQSxHQUFmQSxVQUFnQkEsSUFBb0JBLEVBQUVBLFNBQWtCQTtRQUNwRFUsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsS0FBS0EsY0FBY0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDcENBLEdBQUdBLENBQUNBLENBQVVBLFVBQWFBLEVBQWJBLEtBQUFBLElBQUlBLENBQUNBLFFBQVFBLEVBQXRCQSxjQUFLQSxFQUFMQSxJQUFzQkEsQ0FBQ0E7Z0JBQXZCQSxJQUFJQSxDQUFDQSxTQUFBQTtnQkFDTkEsWUFBWUEsQ0FBQ0EsUUFBUUEsQ0FBaUJBLENBQUNBLEVBQUVBLFNBQVNBLENBQUNBLENBQUNBO2FBQ3ZEQTtRQUNMQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNTQSxJQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUMzQ0EsQ0FBQ0E7SUFDTEEsQ0FBQ0E7SUFFRFY7O09BRUdBO0lBQ0lBLCtCQUFrQkEsR0FBekJBLFVBQTBCQSxJQUFnQkEsRUFBRUEsU0FBcUNBO1FBQzdFVyxFQUFFQSxDQUFBQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFBQSxDQUFDQTtZQUNoQkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDaEJBLENBQUNBO1FBQ0RBLE1BQU1BLENBQUNBLFlBQVlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLEVBQUVBLFNBQVNBLENBQUNBLENBQUNBO0lBQ3REQSxDQUFDQTtJQUVEWDs7T0FFR0E7SUFDSUEseUJBQVlBLEdBQW5CQSxVQUFvQkEsSUFBZ0JBLEVBQUVBLFNBQXFDQTtRQUN2RVksRUFBRUEsQ0FBQUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7WUFDTkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDaEJBLENBQUNBO1FBQ0RBLElBQUlBLEtBQWlCQSxDQUFDQTtRQUN0QkEsSUFBSUEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDM0JBLE9BQU1BLFFBQVFBLElBQUlBLFFBQVFBLEtBQUtBLEtBQUtBLEVBQUNBLENBQUNBO1lBQ2xDQSxFQUFFQSxDQUFBQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFBQSxDQUFDQTtnQkFDcEJBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBO1lBQ3BCQSxDQUFDQTtZQUNEQSxLQUFLQSxHQUFHQSxRQUFRQSxDQUFDQTtZQUNqQkEsUUFBUUEsR0FBR0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDL0JBLENBQUNBO1FBQ0RBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2hCQSxDQUFDQTtJQUVEWjs7T0FFR0E7SUFDSUEsb0JBQU9BLEdBQWRBLFVBQWVBLElBQXFCQTtRQUNoQ2EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7SUFDNUVBLENBQUNBO0lBQ0xiLG1CQUFDQTtBQUFEQSxDQUFDQSxBQXpJRCxJQXlJQztBQ3pJRDtJQUtJYyxxQkFBWUEsSUFBZ0JBLEVBQUVBLE1BQWNBLEVBQUVBLE1BQWNBO1FBQ3hEQyxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNqQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFDckJBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBO0lBQ3pCQSxDQUFDQTtJQUVERCxnQ0FBVUEsR0FBVkEsVUFBV0EsTUFBY0E7UUFDckJFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO0lBQ3REQSxDQUFDQTtJQUNMRixrQkFBQ0E7QUFBREEsQ0FBQ0EsQUFkRCxJQWNDO0FDZEQ7SUFHSUcsdUJBQVlBLGNBQW1EQTtRQUMzREMsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsY0FBY0EsQ0FBQ0E7SUFDekNBLENBQUNBO0lBRURELHNDQUFjQSxHQUFkQSxVQUFlQSxLQUFrQkE7UUFDN0JFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0lBQ3RDQSxDQUFDQTtJQUVERix5Q0FBaUJBLEdBQWpCQSxVQUFrQkEsSUFBb0JBO1FBQ2xDRyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxLQUFLQSxjQUFjQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNwQ0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFxQkEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDekRBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ0pBLElBQUlBLENBQUNBLGFBQWFBLENBQWFBLElBQUlBLENBQUNBLENBQUNBO1FBQ3pDQSxDQUFDQTtJQUNMQSxDQUFDQTtJQUVESCw2Q0FBcUJBLEdBQXJCQSxVQUFzQkEsSUFBd0JBO1FBQzFDSSxHQUFHQSxDQUFDQSxDQUFVQSxVQUFhQSxFQUFiQSxLQUFBQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUF0QkEsY0FBS0EsRUFBTEEsSUFBc0JBLENBQUNBO1lBQXZCQSxJQUFJQSxDQUFDQSxTQUFBQTtZQUNOQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFhQSxDQUFDQSxDQUFDQSxDQUFDQTtTQUNyQ0E7SUFDTEEsQ0FBQ0E7SUFFREoscUNBQWFBLEdBQWJBLFVBQWNBLElBQWdCQTtRQUMxQkssR0FBR0EsQ0FBQ0EsQ0FBZ0JBLFVBQWFBLEVBQWJBLEtBQUFBLElBQUlBLENBQUNBLFFBQVFBLEVBQTVCQSxjQUFXQSxFQUFYQSxJQUE0QkEsQ0FBQ0E7WUFBN0JBLElBQUlBLE9BQU9BLFNBQUFBO1lBQ1pBLElBQUlBLFNBQVNBLEdBQUdBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBO1lBQzlCQSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUNsREEsU0FBU0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDekJBLFNBQVNBLENBQUNBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO1NBQzVCQTtJQUNMQSxDQUFDQTtJQUNMTCxvQkFBQ0E7QUFBREEsQ0FBQ0EsQUFqQ0QsSUFpQ0M7QUNqQ0Q7SUFBNEJNLGlDQUFXQTtJQU9uQ0EsdUJBQVlBLE9BQXNCQSxFQUFFQSxNQUFlQTtRQVB2REMsaUJBNERDQTtRQXBET0EsaUJBQU9BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBO1FBRXZCQSxJQUFJQSxJQUFJQSxHQUFRQSxJQUFJQSxDQUFDQTtRQUNyQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDdEJBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLENBQUNBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM5Q0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFFOUJBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3JCQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxNQUFNQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsT0FBT0EsQ0FBQ0E7UUFDekJBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEdBQUdBLENBQUNBO1FBRW5CQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFrQkE7WUFDaENBLFVBQVVBLEVBQUVBLFVBQUFBLEtBQUtBO2dCQUNiQSxJQUFJQSxNQUFNQSxHQUFHQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDNUNBLEtBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLENBQUNBO2dCQUN2QkEsT0FBT0EsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0E7WUFDM0JBLENBQUNBO1lBQ0RBLFNBQVNBLEVBQUVBLFVBQUFBLEtBQUtBO2dCQUNaQSxFQUFFQSxDQUFBQSxDQUFDQSxLQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFBQSxDQUFDQTtvQkFDZkEsS0FBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7Z0JBQzFCQSxDQUFDQTtnQkFDREEsRUFBRUEsQ0FBQUEsQ0FBQ0EsS0FBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxDQUFBQSxDQUFDQTtvQkFDdEJBLEtBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pDQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNEQSxPQUFPQSxFQUFFQSxVQUFBQSxLQUFLQTtnQkFDVkEsS0FBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsQ0FBQ0EsS0FBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7Z0JBQy9CQSxFQUFFQSxDQUFBQSxDQUFDQSxLQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUFBLENBQUNBO29CQUN0QkEsS0FBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDakNBLENBQUNBO1lBQ0xBLENBQUNBO1NBQ0pBLENBQUFBO0lBQ0xBLENBQUNBO0lBRURELHNCQUFJQSxtQ0FBUUE7YUFBWkE7WUFDSUUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDMUJBLENBQUNBO2FBRURGLFVBQWFBLEtBQWNBO1lBQ3ZCRSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUV2QkEsRUFBRUEsQ0FBQUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1lBQzFCQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDSkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBQzdCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUNsQ0EsQ0FBQ0E7UUFDTEEsQ0FBQ0E7OztPQVhBRjtJQVlMQSxvQkFBQ0E7QUFBREEsQ0FBQ0EsQUE1REQsRUFBNEIsS0FBSyxDQUFDLEtBQUssRUE0RHRDO0FDNUREO0lBQTJCRyxnQ0FBV0E7SUFrQmxDQSxzQkFBWUEsVUFBOEJBLEVBQUVBLE9BQTZCQTtRQWxCN0VDLGlCQXVMQ0E7UUFwS09BLGlCQUFPQSxDQUFDQTtRQUVSQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxPQUFPQSxJQUF5QkE7WUFDM0NBLGFBQWFBLEVBQUVBLE1BQU1BO1NBQ3hCQSxDQUFDQTtRQUVGQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxVQUFVQSxDQUFDQTtRQUM3QkEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsT0FBT0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFaENBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO1FBQ3JCQSxJQUFJQSxDQUFDQSxvQkFBb0JBLEVBQUVBLENBQUNBO1FBQzVCQSxJQUFJQSxDQUFDQSxxQkFBcUJBLEVBQUVBLENBQUNBO1FBRTdCQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQTtZQUNqQkEsT0FBT0EsRUFBRUEsY0FBTUEsT0FBQUEsS0FBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsRUFBbkJBLENBQW1CQTtZQUNsQ0EsV0FBV0EsRUFBRUEsY0FBTUEsT0FBQUEsS0FBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsRUFBbkJBLENBQW1CQTtZQUN0Q0EsVUFBVUEsRUFBRUEsVUFBQUEsS0FBS0EsSUFBSUEsT0FBQUEsS0FBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsS0FBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBOUNBLENBQThDQTtZQUNuRUEsV0FBV0EsRUFBRUEsY0FBTUEsT0FBQUEsS0FBSUEsQ0FBQ0EseUJBQXlCQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFwQ0EsQ0FBb0NBO1lBQ3ZEQSxTQUFTQSxFQUFFQSxjQUFNQSxPQUFBQSxLQUFJQSxDQUFDQSx5QkFBeUJBLENBQUNBLEtBQUtBLENBQUNBLEVBQXJDQSxDQUFxQ0E7U0FDekRBLENBQUNBO1FBRUZBLElBQUlBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1FBRXZCQSxJQUFJQSxDQUFDQSx5QkFBeUJBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0lBQzFDQSxDQUFDQTtJQUVERCxnREFBeUJBLEdBQXpCQSxVQUEwQkEsS0FBY0E7UUFDcENFLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUNBO1FBQ2xDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxPQUFPQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUNuQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsR0FBR0EsS0FBS0EsR0FBR0EsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDMURBLENBQUNBO0lBRURGLHNDQUFlQSxHQUFmQTtRQUNJRyxJQUFJQSxDQUFDQSxxQkFBcUJBLEVBQUVBLENBQUNBO1FBQzdCQSxJQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQTtJQUN2QkEsQ0FBQ0E7SUFFREgsa0NBQVdBLEdBQVhBO1FBQ0lJLElBQUlBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBO1FBQ2hEQSxJQUFJQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUM3Q0EsSUFBSUEsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDL0NBLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1FBRW5DQSxJQUFJQSxHQUFHQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNuQkEsSUFBSUEsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDdEJBLE1BQU1BLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBO1FBQ2pCQSxJQUFJQSxVQUFVQSxHQUFHQSxZQUFZQSxDQUFDQSxzQkFBc0JBLENBQUNBLEdBQUdBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBO1FBQ2xFQSxJQUFJQSxTQUFTQSxHQUFHQSxJQUFJQSxhQUFhQSxDQUFDQSxVQUFBQSxLQUFLQTtZQUNuQ0EsSUFBSUEsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFDMUNBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLEtBQUtBLENBQ3RCQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFHQSxTQUFTQSxFQUN0QkEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFDN0JBLElBQUlBLFNBQVNBLEdBQUdBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ2pDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUNyQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFSEEsR0FBR0EsQ0FBQUEsQ0FBYUEsVUFBS0EsRUFBakJBLGlCQUFRQSxFQUFSQSxJQUFpQkEsQ0FBQ0E7WUFBbEJBLElBQUlBLElBQUlBLEdBQUlBLEtBQUtBLElBQVRBO1lBQ1JBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1NBQ2pCQTtRQUVEQSxJQUFJQSxPQUFPQSxHQUFHQSxZQUFZQSxDQUFDQSxpQkFBaUJBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLEVBQ3hEQSxZQUFZQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtRQUNqQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDdkJBLE9BQU9BLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGFBQWFBLENBQUNBO1FBRS9DQSxTQUFTQSxDQUFDQSxpQkFBaUJBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBRXJDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFDOUJBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLE9BQU9BLENBQUNBO1FBQzNCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtJQUNqQ0EsQ0FBQ0E7SUFFT0osc0NBQWVBLEdBQXZCQTtRQUNJSyxJQUFJQSxLQUFLQSxHQUFpQkEsRUFBRUEsQ0FBQ0E7UUFDN0JBLElBQUlBLFlBQVlBLEdBQW9CQSxFQUFFQSxDQUFDQTtRQUV2Q0EsSUFBSUEsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBQUEsQ0FBQ0EsSUFBSUEsT0FBQUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsRUFBUEEsQ0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDbERBLElBQUlBLEtBQUtBLEdBQUdBLFlBQVlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1FBQ2pDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUV6QkEsSUFBSUEsWUFBWUEsR0FBR0EsWUFBWUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDeENBLElBQUlBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLFVBQUFBLENBQUNBLElBQUlBLE9BQUFBLENBQUNBLEVBQURBLENBQUNBLENBQUNBLENBQUNBO1FBQ3BEQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNWQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNqQ0EsR0FBR0EsQ0FBQUEsQ0FBZ0JBLFVBQVdBLEVBQTFCQSx1QkFBV0EsRUFBWEEsSUFBMEJBLENBQUNBO1lBQTNCQSxJQUFJQSxPQUFPQSxHQUFJQSxXQUFXQSxJQUFmQTtZQUVYQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtZQUUzQkEsRUFBRUEsQ0FBQUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsRUFBRUEsS0FBS0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzlEQSxjQUFjQTtnQkFDZEEsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pDQSxZQUFZQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtnQkFDekJBLFlBQVlBLEdBQUdBLFlBQVlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1lBQ3hDQSxDQUFDQTtZQUVEQSxDQUFDQSxFQUFFQSxDQUFDQTtTQUNQQTtRQUVEQSxFQUFFQSxDQUFBQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFBQSxDQUFDQTtZQUNuQkEsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLE1BQU1BLHFCQUFxQkEsQ0FBQ0E7UUFDaENBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBQ2pCQSxDQUFDQTtJQUVPTCxvQ0FBYUEsR0FBckJBO1FBQ0lNLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBO1FBQ3BDQSxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUN4QkEsWUFBWUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFbERBLEVBQUVBLENBQUFBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGVBQWVBLENBQUNBLENBQUFBLENBQUNBO1lBQzdCQSxPQUFPQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxlQUFlQSxDQUFDQTtRQUNyREEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDSkEsT0FBT0EsQ0FBQ0EsU0FBU0EsR0FBR0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDM0NBLE9BQU9BLENBQUNBLE9BQU9BLEdBQUdBLENBQUNBLENBQUNBO1FBQ3hCQSxDQUFDQTtRQUNEQSxPQUFPQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUN0QkEsT0FBT0EsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDM0JBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBO1FBRXZCQSxtREFBbURBO1FBQ25EQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFBQSxDQUFDQSxJQUFJQSxPQUFBQSxDQUFDQSxFQUFEQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUU1Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7SUFDM0JBLENBQUNBO0lBRU9OLDJDQUFvQkEsR0FBNUJBO1FBQUFPLGlCQVNDQTtRQVJHQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNwQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDdENBLEdBQUdBLENBQUNBLENBQWdCQSxVQUFxQkEsRUFBckJBLEtBQUFBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLEVBQXBDQSxjQUFXQSxFQUFYQSxJQUFvQ0EsQ0FBQ0E7WUFBckNBLElBQUlBLE9BQU9BLFNBQUFBO1lBQ1pBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLGFBQWFBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1lBQ3hDQSxNQUFNQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLGNBQU1BLE9BQUFBLEtBQUlBLENBQUNBLGVBQWVBLEVBQUVBLEVBQXRCQSxDQUFzQkEsQ0FBQ0E7WUFDdkRBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1NBQ3RDQTtRQUNEQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtJQUNyQ0EsQ0FBQ0E7SUFFT1AsNENBQXFCQSxHQUE3QkE7UUFBQVEsaUJBc0JDQTtRQXJCR0EsRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7WUFDbkJBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1FBQ2hDQSxDQUFDQTtRQUNEQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUN2Q0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQUEsS0FBS0E7WUFDN0JBLDRCQUE0QkE7WUFDNUJBLEVBQUVBLENBQUFBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLEtBQUtBLEtBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO21CQUM5QkEsS0FBS0EsQ0FBQ0EsUUFBUUEsS0FBS0EsS0FBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7Z0JBQ25DQSxNQUFNQSxDQUFDQTtZQUNYQSxDQUFDQTtZQUNMQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxtQkFBbUJBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQzVDQSxNQUFNQSxDQUFDQSxTQUFTQSxHQUFHQSxVQUFDQSxVQUFVQSxFQUFFQSxLQUFLQTtnQkFDakNBLElBQUlBLFNBQVNBLEdBQUdBLElBQUlBLGFBQWFBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO2dCQUM5Q0EsU0FBU0EsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxjQUFNQSxPQUFBQSxLQUFJQSxDQUFDQSxlQUFlQSxFQUFFQSxFQUF0QkEsQ0FBc0JBLENBQUNBO2dCQUMxREEsS0FBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RDQSxNQUFNQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtnQkFDaEJBLEtBQUlBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1lBQzNCQSxDQUFDQSxDQUFDQTtZQUNGQSxLQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUN4Q0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDSEEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0E7SUFDdENBLENBQUNBO0lBN0tNUiwyQkFBY0EsR0FBR0EsR0FBR0EsQ0FBQ0E7SUE4S2hDQSxtQkFBQ0E7QUFBREEsQ0FBQ0EsQUF2TEQsRUFBMkIsS0FBSyxDQUFDLEtBQUssRUF1THJDO0FDdkxEO0lBQTJCUyxnQ0FBWUE7SUFJbkNBLHNCQUFZQSxJQUFZQSxFQUFFQSxJQUFtQkEsRUFBRUEsT0FBNkJBO1FBQ3hFQyxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxPQUFPQSxJQUF5QkE7WUFDM0NBLFFBQVFBLEVBQUVBLEVBQUVBO1NBQ2ZBLENBQUNBO1FBQ0ZBLElBQUlBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQ25FQSxJQUFJQSxRQUFRQSxHQUFHQSxZQUFZQSxDQUFDQSxrQkFBa0JBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO1FBRTdEQSxrQkFBTUEsUUFBUUEsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFFekJBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLEVBQ25DQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUMxREEsQ0FBQ0E7SUFDTEQsbUJBQUNBO0FBQURBLENBQUNBLEFBaEJELEVBQTJCLFlBQVksRUFnQnRDO0FDaEJEOztHQUVHO0FBQ0g7SUFBQUU7SUF5REFDLENBQUNBO0lBbkRXRCxtQ0FBZUEsR0FBdkJBLFVBQXlCQSxJQUFJQTtRQUN6QkUsSUFBSUEsU0FBU0EsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0E7UUFDdENBLFNBQVNBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBO1FBQ3pCQSxTQUFTQSxDQUFDQSxhQUFhQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUNuQ0EsRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7WUFDaEJBLFNBQVNBLENBQUNBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBO1FBQzNDQSxDQUFDQTtRQUNEQSxFQUFFQSxDQUFBQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFBQSxDQUFDQTtZQUNoQkEsU0FBU0EsQ0FBQ0EsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDM0NBLENBQUNBO1FBQ0RBLEVBQUVBLENBQUFBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUFBLENBQUNBO1lBQ2RBLFNBQVNBLENBQUNBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBO1FBQ3ZDQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQTtJQUNyQkEsQ0FBQ0E7SUFFREYsa0NBQWNBLEdBQWRBLFVBQWVBLElBQUlBO1FBQ2ZHLGtEQUFrREE7UUFDbERBLGtDQUFrQ0E7UUFDbENBLElBQUlBLFVBQVVBLEdBQUdBLEVBQUVBLENBQUNBO1FBQ3BCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUNuQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDakVBLENBQUNBO1FBRURBLDBDQUEwQ0E7UUFDMUNBLElBQUlBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ25CQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUVuQ0EsNkRBQTZEQTtZQUM3REEsc0NBQXNDQTtZQUN0Q0EsSUFBSUEsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkVBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1lBRW5CQSx5Q0FBeUNBO1lBQ3pDQSxvQ0FBb0NBO1lBQ3BDQSxtQ0FBbUNBO1lBQ25DQSxJQUFJQSxXQUFXQSxHQUFHQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQTtrQkFDbENBLFVBQVVBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBO2tCQUNsQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFFckNBLHFDQUFxQ0E7WUFDckNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLFdBQVdBLENBQUNBO1FBQ2hEQSxDQUFDQTtRQUVEQSxHQUFHQSxDQUFBQSxDQUFrQkEsVUFBVUEsRUFBM0JBLHNCQUFhQSxFQUFiQSxJQUEyQkEsQ0FBQ0E7WUFBNUJBLElBQUlBLFNBQVNBLEdBQUlBLFVBQVVBLElBQWRBO1lBQ2JBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1NBQ3RCQTtRQUVEQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQTtJQUNwQkEsQ0FBQ0E7SUFDTEgsZ0JBQUNBO0FBQURBLENBQUNBLEFBekRELElBeURDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmludGVyZmFjZSBXaW5kb3cge1xyXG4gICAgYXBwOiBBcHBDb250cm9sbGVyO1xyXG59XHJcblxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7ICBcclxuICAgXHJcbiAgICB3aW5kb3cuYXBwID0gbmV3IEFwcENvbnRyb2xsZXIoKTtcclxuICAgIFxyXG59KTtcclxuIiwiXHJcbmNvbnN0IEFtYXRpY1VybCA9ICdodHRwOi8vZm9udHMuZ3N0YXRpYy5jb20vcy9hbWF0aWNzYy92OC9JRG5rUlRQR2NyU1ZvNTBVeVlOSzd5M1VTQm5TdnBrb3BRYVVSLTJyN2lVLnR0Zic7XHJcbmNvbnN0IFJvYm90bzEwMCA9ICdodHRwOi8vZm9udHMuZ3N0YXRpYy5jb20vcy9yb2JvdG8vdjE1LzdNeWdxVGUyenM5WWtQMGFkQTlRUVEudHRmJztcclxuY29uc3QgUm9ib3RvNTAwID0gJ2ZvbnRzL1JvYm90by01MDAudHRmJztcclxuXHJcbmNsYXNzIEFwcENvbnRyb2xsZXIge1xyXG5cclxuICAgIGZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICB3YXJwOiBUZXh0V2FycENvbnRyb2xsZXI7XHJcbiAgICB0ZXh0QmxvY2tzOiBUZXh0QmxvY2tbXSA9IFtdO1xyXG4gICAgcGFwZXI6IHBhcGVyLlBhcGVyU2NvcGU7XHJcbiAgICBjYW52YXNDb2xvciA9ICcjRTlFMEMzJztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkNhbnZhcycpO1xyXG4gICAgICAgIHBhcGVyLnNldHVwKDxIVE1MQ2FudmFzRWxlbWVudD5jYW52YXMpO1xyXG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcclxuICAgICAgICBcclxuICAgICAgICBuZXcgRm9udExvYWRlcihSb2JvdG81MDAsIGZvbnQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnQgPSBmb250O1xyXG4gICAgICAgICAgICB0aGlzLndhcnAgPSBuZXcgVGV4dFdhcnBDb250cm9sbGVyKHRoaXMpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5hZGRUZXh0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhZGRUZXh0KCl7XHJcbiAgICAgICAgbGV0IHRleHQgPSAkKCcjbmV3VGV4dCcpLnZhbCgpO1xyXG5cclxuICAgICAgICBpZih0ZXh0LnRyaW0oKS5sZW5ndGgpe1xyXG4gICAgICAgICAgICBsZXQgYmxvY2sgPSA8VGV4dEJsb2NrPiB7XHJcbiAgICAgICAgICAgICAgICBfaWQ6IG5ld2lkKCksXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICAgICAgdGV4dENvbG9yOiAkKCcjdGV4dENvbG9yJykudmFsKCksXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICQoJyNiYWNrZ3JvdW5kQ29sb3InKS52YWwoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnRleHRCbG9ja3MucHVzaChibG9jayk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndhcnAudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnBhcGVyLnZpZXcuZHJhdygpO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBUZXh0QmxvY2sge1xyXG4gICAgX2lkOiBzdHJpbmc7XHJcbiAgICB0ZXh0OiBzdHJpbmc7XHJcbiAgICBpdGVtOiBwYXBlci5JdGVtO1xyXG4gICAgdGV4dENvbG9yOiBzdHJpbmc7XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcclxufSIsIlxyXG5jbGFzcyBGb250TG9hZGVyIHtcclxuXHJcbiAgICBpc0xvYWRlZDogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250VXJsOiBzdHJpbmcsIG9uTG9hZGVkOiAoZm9udDogb3BlbnR5cGUuRm9udCkgPT4gdm9pZCkge1xyXG4gICAgICAgIG9wZW50eXBlLmxvYWQoZm9udFVybCwgZnVuY3Rpb24oZXJyLCBmb250KSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChvbkxvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9uTG9hZGVkLmNhbGwodGhpcywgZm9udCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIlxyXG5mdW5jdGlvbiBuZXdpZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSgpLmdldFRpbWUoKStNYXRoLnJhbmRvbSgpKS50b1N0cmluZygzNik7XHJcbn1cclxuIiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwidHlwaW5ncy9wYXBlci5kLnRzXCIgLz5cclxuXHJcbmNsYXNzIFRleHRXYXJwQ29udHJvbGxlciB7XHJcbiAgICBhcHA6IEFwcENvbnRyb2xsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHBDb250cm9sbGVyKSB7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbmV3IE1vdXNlQmVoYXZpb3JUb29sKHBhcGVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKCl7XHJcbiAgICAgICAgZm9yKGxldCBibG9jayBvZiB0aGlzLmFwcC50ZXh0QmxvY2tzKXtcclxuICAgICAgICAgICAgaWYoIWJsb2NrLml0ZW0pe1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0cmV0Y2h5ID0gbmV3IFN0cmV0Y2h5VGV4dChibG9jay50ZXh0LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAuZm9udCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPFN0cmV0Y2h5VGV4dE9wdGlvbnM+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyOCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhGaWxsQ29sb3I6IGJsb2NrLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogYmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYmxvY2suaXRlbSA9IHN0cmV0Y2h5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5kZWNsYXJlIHZhciBzb2x2ZTogKGE6IGFueSwgYjogYW55LCBmYXN0OiBib29sZWFuKSA9PiB2b2lkO1xyXG5cclxuY2xhc3MgUGVyc3BlY3RpdmVUcmFuc2Zvcm0ge1xyXG4gICAgXHJcbiAgICBzb3VyY2U6IFF1YWQ7XHJcbiAgICBkZXN0OiBRdWFkO1xyXG4gICAgcGVyc3A6IGFueTtcclxuICAgIG1hdHJpeDogbnVtYmVyW107XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZTogUXVhZCwgZGVzdDogUXVhZCl7XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5kZXN0ID0gZGVzdDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm1hdHJpeCA9IFBlcnNwZWN0aXZlVHJhbnNmb3JtLmNyZWF0ZU1hdHJpeChzb3VyY2UsIGRlc3QpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBHaXZlbiBhIDR4NCBwZXJzcGVjdGl2ZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXgsIGFuZCBhIDJEIHBvaW50IChhIDJ4MSB2ZWN0b3IpLFxyXG4gICAgLy8gYXBwbGllcyB0aGUgdHJhbnNmb3JtYXRpb24gbWF0cml4IGJ5IGNvbnZlcnRpbmcgdGhlIHBvaW50IHRvIGhvbW9nZW5lb3VzXHJcbiAgICAvLyBjb29yZGluYXRlcyBhdCB6PTAsIHBvc3QtbXVsdGlwbHlpbmcsIGFuZCB0aGVuIGFwcGx5aW5nIGEgcGVyc3BlY3RpdmUgZGl2aWRlLlxyXG4gICAgdHJhbnNmb3JtUG9pbnQocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIGxldCBwMyA9IFBlcnNwZWN0aXZlVHJhbnNmb3JtLm11bHRpcGx5KHRoaXMubWF0cml4LCBbcG9pbnQueCwgcG9pbnQueSwgMCwgMV0pO1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgcGFwZXIuUG9pbnQocDNbMF0gLyBwM1szXSwgcDNbMV0gLyBwM1szXSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGNyZWF0ZU1hdHJpeChzb3VyY2U6IFF1YWQsIHRhcmdldDogUXVhZCk6IG51bWJlcltdIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc291cmNlUG9pbnRzID0gW1xyXG4gICAgICAgICAgICBbc291cmNlLmEueCwgc291cmNlLmEueV0sIFxyXG4gICAgICAgICAgICBbc291cmNlLmIueCwgc291cmNlLmIueV0sIFxyXG4gICAgICAgICAgICBbc291cmNlLmMueCwgc291cmNlLmMueV0sIFxyXG4gICAgICAgICAgICBbc291cmNlLmQueCwgc291cmNlLmQueV1dO1xyXG4gICAgICAgIGxldCB0YXJnZXRQb2ludHMgPSBbXHJcbiAgICAgICAgICAgIFt0YXJnZXQuYS54LCB0YXJnZXQuYS55XSwgXHJcbiAgICAgICAgICAgIFt0YXJnZXQuYi54LCB0YXJnZXQuYi55XSwgXHJcbiAgICAgICAgICAgIFt0YXJnZXQuYy54LCB0YXJnZXQuYy55XSwgXHJcbiAgICAgICAgICAgIFt0YXJnZXQuZC54LCB0YXJnZXQuZC55XV07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IFtdLCBiID0gW10sIGkgPSAwLCBuID0gc291cmNlUG9pbnRzLmxlbmd0aDsgaSA8IG47ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgcyA9IHNvdXJjZVBvaW50c1tpXSwgdCA9IHRhcmdldFBvaW50c1tpXTtcclxuICAgICAgICAgICAgYS5wdXNoKFtzWzBdLCBzWzFdLCAxLCAwLCAwLCAwLCAtc1swXSAqIHRbMF0sIC1zWzFdICogdFswXV0pLCBiLnB1c2godFswXSk7XHJcbiAgICAgICAgICAgIGEucHVzaChbMCwgMCwgMCwgc1swXSwgc1sxXSwgMSwgLXNbMF0gKiB0WzFdLCAtc1sxXSAqIHRbMV1dKSwgYi5wdXNoKHRbMV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IFggPSBzb2x2ZShhLCBiLCB0cnVlKTsgXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgWFswXSwgWFszXSwgMCwgWFs2XSxcclxuICAgICAgICAgICAgWFsxXSwgWFs0XSwgMCwgWFs3XSxcclxuICAgICAgICAgICAgICAgMCwgICAgMCwgMSwgICAgMCxcclxuICAgICAgICAgICAgWFsyXSwgWFs1XSwgMCwgICAgMVxyXG4gICAgICAgIF0ubWFwKGZ1bmN0aW9uKHgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoeCAqIDEwMDAwMCkgLyAxMDAwMDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUG9zdC1tdWx0aXBseSBhIDR4NCBtYXRyaXggaW4gY29sdW1uLW1ham9yIG9yZGVyIGJ5IGEgNHgxIGNvbHVtbiB2ZWN0b3I6XHJcbiAgICAvLyBbIG0wIG00IG04ICBtMTIgXSAgIFsgdjAgXSAgIFsgeCBdXHJcbiAgICAvLyBbIG0xIG01IG05ICBtMTMgXSAqIFsgdjEgXSA9IFsgeSBdXHJcbiAgICAvLyBbIG0yIG02IG0xMCBtMTQgXSAgIFsgdjIgXSAgIFsgeiBdXHJcbiAgICAvLyBbIG0zIG03IG0xMSBtMTUgXSAgIFsgdjMgXSAgIFsgdyBdXHJcbiAgICBzdGF0aWMgbXVsdGlwbHkobWF0cml4LCB2ZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBtYXRyaXhbMF0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNF0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbOCBdICogdmVjdG9yWzJdICsgbWF0cml4WzEyXSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzFdICogdmVjdG9yWzBdICsgbWF0cml4WzVdICogdmVjdG9yWzFdICsgbWF0cml4WzkgXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxM10gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFsyXSAqIHZlY3RvclswXSArIG1hdHJpeFs2XSAqIHZlY3RvclsxXSArIG1hdHJpeFsxMF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTRdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbM10gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbN10gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbMTFdICogdmVjdG9yWzJdICsgbWF0cml4WzE1XSAqIHZlY3RvclszXVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFF1YWQge1xyXG4gICAgYTogcGFwZXIuUG9pbnQ7XHJcbiAgICBiOiBwYXBlci5Qb2ludDtcclxuICAgIGM6IHBhcGVyLlBvaW50O1xyXG4gICAgZDogcGFwZXIuUG9pbnQ7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCwgYzogcGFwZXIuUG9pbnQsIGQ6IHBhcGVyLlBvaW50KXtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgICAgIHRoaXMuYiA9IGI7XHJcbiAgICAgICAgdGhpcy5jID0gYztcclxuICAgICAgICB0aGlzLmQgPSBkO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgZnJvbVJlY3RhbmdsZShyZWN0OiBwYXBlci5SZWN0YW5nbGUpe1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhZChcclxuICAgICAgICAgICAgcmVjdC50b3BMZWZ0LFxyXG4gICAgICAgICAgICByZWN0LnRvcFJpZ2h0LFxyXG4gICAgICAgICAgICByZWN0LmJvdHRvbUxlZnQsXHJcbiAgICAgICAgICAgIHJlY3QuYm90dG9tUmlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgZnJvbUNvb3Jkcyhjb29yZHM6IG51bWJlcltdKSA6IFF1YWQge1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhZChcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1swXSwgY29vcmRzWzFdKSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1syXSwgY29vcmRzWzNdKSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1s0XSwgY29vcmRzWzVdKSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1s2XSwgY29vcmRzWzddKVxyXG4gICAgICAgIClcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXNDb29yZHMoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHRoaXMuYS54LCB0aGlzLmEueSxcclxuICAgICAgICAgICAgdGhpcy5iLngsIHRoaXMuYi55LFxyXG4gICAgICAgICAgICB0aGlzLmMueCwgdGhpcy5jLnksXHJcbiAgICAgICAgICAgIHRoaXMuZC54LCB0aGlzLmQueVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn0iLCJcclxuLyoqXHJcbiAqIEhhbmRsZSB0aGF0IHNpdHMgb24gbWlkcG9pbnQgb2YgY3VydmVcclxuICogICB3aGljaCB3aWxsIHNwbGl0IHRoZSBjdXJ2ZSB3aGVuIGRyYWdnZWQuXHJcbiAqL1xyXG5jbGFzcyBDdXJ2ZVNwbGl0dGVySGFuZGxlIGV4dGVuZHMgcGFwZXIuU2hhcGUge1xyXG4gXHJcbiAgICBjdXJ2ZTogcGFwZXIuQ3VydmU7XHJcbiAgICBvbkRyYWdFbmQ6IChuZXdTZWdtZW50OiBwYXBlci5TZWdtZW50LCBldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gXHJcbiAgICBjb25zdHJ1Y3RvcihjdXJ2ZTogcGFwZXIuQ3VydmUpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VydmUgPSBjdXJ2ZTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc2VsZiA9IDxhbnk+dGhpcztcclxuICAgICAgICBzZWxmLl90eXBlID0gJ2NpcmNsZSc7XHJcbiAgICAgICAgc2VsZi5fcmFkaXVzID0gNztcclxuICAgICAgICBzZWxmLl9zaXplID0gbmV3IHBhcGVyLlNpemUoc2VsZi5fcmFkaXVzICogMik7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGUoY3VydmUuZ2V0UG9pbnRBdCgwLjUgKiBjdXJ2ZS5sZW5ndGgpKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0cm9rZVdpZHRoID0gMjtcclxuICAgICAgICB0aGlzLnN0cm9rZUNvbG9yID0gJ2JsdWUnO1xyXG4gICAgICAgIHRoaXMuZmlsbENvbG9yID0gJ3doaXRlJztcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAwLjUgKiAwLjM7IFxyXG4gXHJcbiAgICAgICAgbGV0IG5ld1NlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0gPE1vdXNlQmVoYXZpb3I+e1xyXG4gICAgICAgICAgICBvbkRyYWdTdGFydDogKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuZXdTZWdtZW50ID0gbmV3IHBhcGVyLlNlZ21lbnQodGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICBjdXJ2ZS5wYXRoLmluc2VydChcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZS5pbmRleCArIDEsIFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1NlZ21lbnRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ01vdmU6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdQb3MgPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zO1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudC5wb2ludCA9IG5ld1BvcztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnRW5kOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uRHJhZ0VuZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkRyYWdFbmQobmV3U2VnbWVudCwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgaW50ZXJmYWNlIEl0ZW0ge1xyXG4gICAgICAgIG1vdXNlQmVoYXZpb3I6IE1vdXNlQmVoYXZpb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBNb3VzZUJlaGF2aW9yIHtcclxuICAgIG9uQ2xpY2s/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuXHJcbiAgICBvbk92ZXJTdGFydD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25PdmVyTW92ZT86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25PdmVyRW5kPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gICAgb25EcmFnU3RhcnQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uRHJhZ01vdmU/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uRHJhZ0VuZD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgTW91c2VBY3Rpb24ge1xyXG4gICAgc3RhcnRFdmVudDogcGFwZXIuVG9vbEV2ZW50O1xyXG4gICAgaXRlbTogcGFwZXIuSXRlbTtcclxuICAgIGRyYWdnZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmNsYXNzIE1vdXNlQmVoYXZpb3JUb29sIGV4dGVuZHMgcGFwZXIuVG9vbCB7XHJcblxyXG4gICAgaGl0T3B0aW9ucyA9IHtcclxuICAgICAgICBzZWdtZW50czogdHJ1ZSxcclxuICAgICAgICBzdHJva2U6IHRydWUsXHJcbiAgICAgICAgZmlsbDogdHJ1ZSxcclxuICAgICAgICB0b2xlcmFuY2U6IDVcclxuICAgIH07XHJcblxyXG4gICAgcHJlc3NBY3Rpb246IE1vdXNlQWN0aW9uO1xyXG4gICAgaG92ZXJBY3Rpb246IE1vdXNlQWN0aW9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcGVyU2NvcGU6IHBhcGVyLlBhcGVyU2NvcGUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wcmVzc0FjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgICAgIHZhciBoaXRSZXN1bHQgPSBwYXBlci5wcm9qZWN0LmhpdFRlc3QoXHJcbiAgICAgICAgICAgIGV2ZW50LnBvaW50LFxyXG4gICAgICAgICAgICB0aGlzLmhpdE9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAoaGl0UmVzdWx0ICYmIGhpdFJlc3VsdC5pdGVtKSB7XHJcbiAgICAgICAgICAgIGxldCBkcmFnZ2FibGUgPSB0aGlzLmZpbmREcmFnSGFuZGxlcihoaXRSZXN1bHQuaXRlbSk7XHJcbiAgICAgICAgICAgIGlmIChkcmFnZ2FibGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24gPSA8TW91c2VBY3Rpb24+e1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06IGRyYWdnYWJsZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL3RoaXMucGFwZXJTY29wZS5wcm9qZWN0LmFjdGl2ZUxheWVyLmFkZENoaWxkKHRoaXMuZHJhZ0l0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlTW92ZSA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIHZhciBoaXRSZXN1bHQgPSBwYXBlci5wcm9qZWN0LmhpdFRlc3QoXHJcbiAgICAgICAgICAgIGV2ZW50LnBvaW50LFxyXG4gICAgICAgICAgICB0aGlzLmhpdE9wdGlvbnMpO1xyXG4gICAgICAgIGxldCBoYW5kbGVySXRlbSA9IGhpdFJlc3VsdFxyXG4gICAgICAgICAgICAmJiB0aGlzLmZpbmRPdmVySGFuZGxlcihoaXRSZXN1bHQuaXRlbSk7XHJcblxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgLy8gd2VyZSBwcmV2aW91c2x5IGhvdmVyaW5nXHJcbiAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb25cclxuICAgICAgICAgICAgJiYgKFxyXG4gICAgICAgICAgICAgICAgLy8gbm90IGhvdmVyaW5nIG92ZXIgYW55dGhpbmcgbm93XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVySXRlbSA9PSBudWxsXHJcbiAgICAgICAgICAgICAgICAvLyBub3QgaG92ZXJpbmcgb3ZlciBjdXJyZW50IGhhbmRsZXIgb3IgZGVzY2VuZGVudCB0aGVyZW9mXHJcbiAgICAgICAgICAgICAgICB8fCAhTW91c2VCZWhhdmlvclRvb2wuaXNTYW1lT3JBbmNlc3RvcihcclxuICAgICAgICAgICAgICAgICAgICBoaXRSZXN1bHQuaXRlbSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uLml0ZW0pKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAvLyBqdXN0IGxlYXZpbmdcclxuICAgICAgICAgICAgaWYgKHRoaXMuaG92ZXJBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uT3ZlckVuZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25PdmVyRW5kKGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChoYW5kbGVySXRlbSAmJiBoYW5kbGVySXRlbS5tb3VzZUJlaGF2aW9yKSB7XHJcbiAgICAgICAgICAgIGxldCBiZWhhdmlvciA9IGhhbmRsZXJJdGVtLm1vdXNlQmVoYXZpb3I7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5ob3ZlckFjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvbiA9IDxNb3VzZUFjdGlvbj57XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogaGFuZGxlckl0ZW1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBpZiAoYmVoYXZpb3Iub25PdmVyU3RhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvci5vbk92ZXJTdGFydChldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGJlaGF2aW9yICYmIGJlaGF2aW9yLm9uT3Zlck1vdmUpIHtcclxuICAgICAgICAgICAgICAgIGJlaGF2aW9yLm9uT3Zlck1vdmUoZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEcmFnID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJlc3NBY3Rpb24pIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnByZXNzQWN0aW9uLmRyYWdnZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24uZHJhZ2dlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnU3RhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdTdGFydC5jYWxsKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uLml0ZW0sIHRoaXMucHJlc3NBY3Rpb24uc3RhcnRFdmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMucHJlc3NBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ01vdmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ01vdmUuY2FsbCh0aGlzLnByZXNzQWN0aW9uLml0ZW0sIGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5wcmVzc0FjdGlvbikge1xyXG4gICAgICAgICAgICBsZXQgYWN0aW9uID0gdGhpcy5wcmVzc0FjdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoYWN0aW9uLmRyYWdnZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRyYWdcclxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ0VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnRW5kLmNhbGwoYWN0aW9uLml0ZW0sIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNsaWNrXHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkNsaWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkNsaWNrLmNhbGwoYWN0aW9uLml0ZW0sIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbktleURvd24gPSAoZXZlbnQpID0+IHtcclxuICAgICAgICBpZiAoZXZlbnQua2V5ID09ICdzcGFjZScpIHtcclxuICAgICAgICAgICAgcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5zZWxlY3RlZCA9ICFwYXBlci5wcm9qZWN0LmFjdGl2ZUxheWVyLnNlbGVjdGVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXRlcm1pbmUgaWYgcG9zc2libGVBbmNlc3RvciBpcyBhbiBhbmNlc3RvciBvZiBpdGVtLiBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGlzU2FtZU9yQW5jZXN0b3IoaXRlbTogcGFwZXIuSXRlbSwgcG9zc2libGVBbmNlc3RvcjogcGFwZXIuSXRlbSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhIVBhcGVySGVscGVycy5maW5kU2VsZk9yQW5jZXN0b3IoaXRlbSwgcGEgPT4gcGEgPT09IHBvc3NpYmxlQW5jZXN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmREcmFnSGFuZGxlcihpdGVtOiBwYXBlci5JdGVtKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kU2VsZk9yQW5jZXN0b3IoXHJcbiAgICAgICAgICAgIGl0ZW0sIFxyXG4gICAgICAgICAgICBwYSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWIgPSBwYS5tb3VzZUJlaGF2aW9yO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKG1iICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKG1iLm9uRHJhZ1N0YXJ0IHx8IG1iLm9uRHJhZ01vdmUgfHwgbWIub25EcmFnRW5kKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBmaW5kT3ZlckhhbmRsZXIoaXRlbTogcGFwZXIuSXRlbSk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHJldHVybiBQYXBlckhlbHBlcnMuZmluZFNlbGZPckFuY2VzdG9yKFxyXG4gICAgICAgICAgICBpdGVtLCBcclxuICAgICAgICAgICAgcGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1iID0gcGEubW91c2VCZWhhdmlvcjtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhIShtYiAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChtYi5vbk92ZXJTdGFydCB8fCBtYi5vbk92ZXJNb3ZlIHx8IG1iLm9uT3ZlckVuZCApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFBhcGVySGVscGVycyB7XHJcblxyXG4gICAgc3RhdGljIGltcG9ydE9wZW5UeXBlUGF0aChvcGVuUGF0aDogb3BlbnR5cGUuUGF0aCk6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgob3BlblBhdGgudG9QYXRoRGF0YSgpKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBsZXQgc3ZnID0gb3BlblBhdGgudG9TVkcoNCk7XHJcbiAgICAgICAgLy8gcmV0dXJuIDxwYXBlci5QYXRoPnBhcGVyLnByb2plY3QuaW1wb3J0U1ZHKHN2Zyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRyYWNlUGF0aEl0ZW0ocGF0aDogcGFwZXIuUGF0aEl0ZW0sIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLlBhdGhJdGVtIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNlQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdHJhY2VDb21wb3VuZFBhdGgocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5Db21wb3VuZFBhdGgge1xyXG4gICAgICAgIGlmICghcGF0aC5jaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwYXRocyA9IHBhdGguY2hpbGRyZW4ubWFwKHAgPT5cclxuICAgICAgICAgICAgdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cCwgcG9pbnRzUGVyUGF0aCkpO1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHtcclxuICAgICAgICAgICAgY2hpbGRyZW46IHBhdGhzLFxyXG4gICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdHJhY2VQYXRoKHBhdGg6IHBhcGVyLlBhdGgsIG51bVBvaW50czogbnVtYmVyKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgLy8gaWYoIXBhdGggfHwgIXBhdGguc2VnbWVudHMgfHwgcGF0aC5zZWdtZW50cy5sZW5ndGgpe1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gbmV3IHBhcGVyLlBhdGgoKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgbGV0IHBhdGhMZW5ndGggPSBwYXRoLmxlbmd0aDtcclxuICAgICAgICBsZXQgb2Zmc2V0SW5jciA9IHBhdGhMZW5ndGggLyBudW1Qb2ludHM7XHJcbiAgICAgICAgbGV0IHBvaW50cyA9IFtdO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGkrKyA8IG51bVBvaW50cykge1xyXG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBwYXRoLmdldFBvaW50QXQoTWF0aC5taW4ob2Zmc2V0LCBwYXRoTGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IG9mZnNldEluY3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlBhdGgoe1xyXG4gICAgICAgICAgICBzZWdtZW50czogcG9pbnRzLFxyXG4gICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2FuZHdpY2hQYXRoUHJvamVjdGlvbih0b3BQYXRoOiBwYXBlci5DdXJ2ZWxpa2UsIGJvdHRvbVBhdGg6IHBhcGVyLkN1cnZlbGlrZSlcclxuICAgICAgICA6ICh1bml0UG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgY29uc3QgdG9wUGF0aExlbmd0aCA9IHRvcFBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGJvdHRvbVBhdGhMZW5ndGggPSBib3R0b21QYXRoLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24odW5pdFBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICAgICAgbGV0IHRvcFBvaW50ID0gdG9wUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogdG9wUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGxldCBib3R0b21Qb2ludCA9IGJvdHRvbVBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIGJvdHRvbVBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgICBpZiAodG9wUG9pbnQgPT0gbnVsbCB8fCBib3R0b21Qb2ludCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcImNvdWxkIG5vdCBnZXQgcHJvamVjdGVkIHBvaW50IGZvciB1bml0IHBvaW50IFwiICsgdW5pdFBvaW50LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRvcFBvaW50LmFkZChib3R0b21Qb2ludC5zdWJ0cmFjdCh0b3BQb2ludCkubXVsdGlwbHkodW5pdFBvaW50LnkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1hcmtlckdyb3VwOiBwYXBlci5Hcm91cDtcclxuXHJcbiAgICBzdGF0aWMgcmVzZXRNYXJrZXJzKCl7XHJcbiAgICAgICAgaWYoUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwKXtcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAub3BhY2l0eSA9IDAuMjtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyTGluZShhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQpOiBwYXBlci5JdGVte1xyXG4gICAgICAgIGxldCBsaW5lID0gcGFwZXIuUGF0aC5MaW5lKGEsYik7XHJcbiAgICAgICAgbGluZS5zdHJva2VDb2xvciA9ICdncmVlbic7XHJcbiAgICAgICAgLy9saW5lLmRhc2hBcnJheSA9IFs1LCA1XTtcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobGluZSk7XHJcbiAgICAgICAgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1hcmtlcihwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICBsZXQgbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvaW50LCAyKTtcclxuICAgICAgICBtYXJrZXIuc3Ryb2tlQ29sb3IgPSAncmVkJztcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobWFya2VyKTtcclxuICAgICAgICByZXR1cm4gbWFya2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzaW1wbGlmeShwYXRoOiBwYXBlci5QYXRoSXRlbSwgdG9sZXJhbmNlPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5zaW1wbGlmeSg8cGFwZXIuUGF0aEl0ZW0+cCwgdG9sZXJhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICg8cGFwZXIuUGF0aD5wYXRoKS5zaW1wbGlmeSh0b2xlcmFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgc2VsZiBvciBuZWFyZXN0IGFuY2VzdG9yIHNhdGlzZnlpbmcgdGhlIHByZWRpY2F0ZS5cclxuICAgICAqLyAgICBcclxuICAgIHN0YXRpYyBmaW5kU2VsZk9yQW5jZXN0b3IoaXRlbTogcGFwZXIuSXRlbSwgcHJlZGljYXRlOiAoaTogcGFwZXIuSXRlbSkgPT4gYm9vbGVhbil7XHJcbiAgICAgICAgaWYocHJlZGljYXRlKGl0ZW0pKXtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQYXBlckhlbHBlcnMuZmluZEFuY2VzdG9yKGl0ZW0sIHByZWRpY2F0ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRmluZCBuZWFyZXN0IGFuY2VzdG9yIHNhdGlzZnlpbmcgdGhlIHByZWRpY2F0ZS5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGZpbmRBbmNlc3RvcihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKXtcclxuICAgICAgICBpZighaXRlbSl7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJpb3I6IHBhcGVyLkl0ZW07XHJcbiAgICAgICAgbGV0IGNoZWNraW5nID0gaXRlbS5wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUoY2hlY2tpbmcgJiYgY2hlY2tpbmcgIT09IHByaW9yKXtcclxuICAgICAgICAgICAgaWYocHJlZGljYXRlKGNoZWNraW5nKSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hlY2tpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJpb3IgPSBjaGVja2luZztcclxuICAgICAgICAgICAgY2hlY2tpbmcgPSBjaGVja2luZy5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBjb3JuZXJzIG9mIHRoZSByZWN0LCBjbG9ja3dpc2Ugc3RhcnRpbmcgZnJvbSB0b3BMZWZ0XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb3JuZXJzKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSk6IHBhcGVyLlBvaW50W117XHJcbiAgICAgICAgcmV0dXJuIFtyZWN0LnRvcExlZnQsIHJlY3QudG9wUmlnaHQsIHJlY3QuYm90dG9tUmlnaHQsIHJlY3QuYm90dG9tTGVmdF07XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgUGF0aFNlY3Rpb24gaW1wbGVtZW50cyBwYXBlci5DdXJ2ZWxpa2Uge1xyXG4gICAgcGF0aDogcGFwZXIuUGF0aDtcclxuICAgIG9mZnNldDogbnVtYmVyO1xyXG4gICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHBhcGVyLlBhdGgsIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcil7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aC5nZXRQb2ludEF0KG9mZnNldCArIHRoaXMub2Zmc2V0KTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBQYXRoVHJhbnNmb3JtIHtcclxuICAgIHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICB0aGlzLnBvaW50VHJhbnNmb3JtID0gcG9pbnRUcmFuc2Zvcm07XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUG9pbnQocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50VHJhbnNmb3JtKHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1QYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSkge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1Db21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1QYXRoKHBhdGg6IHBhcGVyLlBhdGgpIHtcclxuICAgICAgICBmb3IgKGxldCBzZWdtZW50IG9mIHBhdGguc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgbGV0IG9yaWdQb2ludCA9IHNlZ21lbnQucG9pbnQ7XHJcbiAgICAgICAgICAgIGxldCBuZXdQb2ludCA9IHRoaXMudHJhbnNmb3JtUG9pbnQoc2VnbWVudC5wb2ludCk7XHJcbiAgICAgICAgICAgIG9yaWdQb2ludC54ID0gbmV3UG9pbnQueDtcclxuICAgICAgICAgICAgb3JpZ1BvaW50LnkgPSBuZXdQb2ludC55O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4iLCJcclxuY2xhc3MgU2VnbWVudEhhbmRsZSBleHRlbmRzIHBhcGVyLlNoYXBlIHtcclxuIFxyXG4gICAgc2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgIG9uQ2hhbmdlQ29tcGxldGU6IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9zbW9vdGhlZDogYm9vbGVhbjtcclxuIFxyXG4gICAgY29uc3RydWN0b3Ioc2VnbWVudDogcGFwZXIuU2VnbWVudCwgcmFkaXVzPzogbnVtYmVyKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2VnbWVudCA9IHNlZ21lbnQ7XHJcblxyXG4gICAgICAgIGxldCBzZWxmID0gPGFueT50aGlzO1xyXG4gICAgICAgIHNlbGYuX3R5cGUgPSAnY2lyY2xlJztcclxuICAgICAgICBzZWxmLl9yYWRpdXMgPSA3O1xyXG4gICAgICAgIHNlbGYuX3NpemUgPSBuZXcgcGFwZXIuU2l6ZShzZWxmLl9yYWRpdXMgKiAyKTtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShzZWdtZW50LnBvaW50KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0cm9rZVdpZHRoID0gMjtcclxuICAgICAgICB0aGlzLnN0cm9rZUNvbG9yID0gJ2JsdWUnO1xyXG4gICAgICAgIHRoaXMuZmlsbENvbG9yID0gJ3doaXRlJztcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAwLjU7IFxyXG5cclxuICAgICAgICB0aGlzLm1vdXNlQmVoYXZpb3IgPSA8TW91c2VCZWhhdmlvcj57XHJcbiAgICAgICAgICAgIG9uRHJhZ01vdmU6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdQb3MgPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zO1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5wb2ludCA9IG5ld1BvcztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnRW5kOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9zbW9vdGhlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkNoYW5nZUNvbXBsZXRlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbmdlQ29tcGxldGUoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkNsaWNrOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNtb290aGVkID0gIXRoaXMuc21vb3RoZWQ7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uQ2hhbmdlQ29tcGxldGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DaGFuZ2VDb21wbGV0ZShldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBzbW9vdGhlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc21vb3RoZWQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldCBzbW9vdGhlZCh2YWx1ZTogYm9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5fc21vb3RoZWQgPSB2YWx1ZTtcclxuICAgICAgICBcclxuICAgICAgICBpZih2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50LmhhbmRsZU91dCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoeVBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgb3B0aW9uczogU3RyZXRjaHlQYXRoT3B0aW9ucztcclxuICAgICAgICBcclxuICAgIHNvdXJjZVBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIGRpc3BsYXlQYXRoOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBjb3JuZXJzOiBwYXBlci5TZWdtZW50W107XHJcbiAgICBvdXRsaW5lOiBwYXBlci5QYXRoO1xyXG4gICAgXHJcbiAgICBzdGF0aWMgT1VUTElORV9QT0lOVFMgPSAyMDA7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRm9yIHJlYnVpbGRpbmcgdGhlIG1pZHBvaW50IGhhbmRsZXNcclxuICAgICAqIGFzIG91dGxpbmUgY2hhbmdlcy5cclxuICAgICAqL1xyXG4gICAgbWlkcG9pbnRHcm91cDogcGFwZXIuR3JvdXA7XHJcbiAgICBzZWdtZW50R3JvdXA6IHBhcGVyLkdyb3VwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZVBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCwgb3B0aW9ucz86IFN0cmV0Y2h5UGF0aE9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IDxTdHJldGNoeVBhdGhPcHRpb25zPntcclxuICAgICAgICAgICAgcGF0aEZpbGxDb2xvcjogJ2dyYXknXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXRoID0gc291cmNlUGF0aDtcclxuICAgICAgICB0aGlzLnNvdXJjZVBhdGgudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZU91dGxpbmUoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVNlZ21lbnRNYXJrZXJzKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNaWRwaW9udE1hcmtlcnMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0ge1xyXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB0aGlzLmJyaW5nVG9Gcm9udCgpLFxyXG4gICAgICAgICAgICBvbkRyYWdTdGFydDogKCkgPT4gdGhpcy5icmluZ1RvRnJvbnQoKSxcclxuICAgICAgICAgICAgb25EcmFnTW92ZTogZXZlbnQgPT4gdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKGV2ZW50LmRlbHRhKSxcclxuICAgICAgICAgICAgb25PdmVyU3RhcnQ6ICgpID0+IHRoaXMuc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eSh0cnVlKSxcclxuICAgICAgICAgICAgb25PdmVyRW5kOiAoKSA9PiB0aGlzLnNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkoZmFsc2UpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkodmFsdWU6IGJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuc2VnbWVudEdyb3VwLnZpc2libGUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAudmlzaWJsZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMub3V0bGluZS5zdHJva2VDb2xvciA9IHZhbHVlID8gJ2xpZ2h0Z3JheScgOiBudWxsOyBcclxuICAgIH1cclxuXHJcbiAgICBhcnJhbmdlQ29udGVudHMoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNaWRwaW9udE1hcmtlcnMoKTtcclxuICAgICAgICB0aGlzLmFycmFuZ2VQYXRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXJyYW5nZVBhdGgoKSB7XHJcbiAgICAgICAgbGV0IG9ydGhPcmlnaW4gPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzLnRvcExlZnQ7XHJcbiAgICAgICAgbGV0IG9ydGhXaWR0aCA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMud2lkdGg7XHJcbiAgICAgICAgbGV0IG9ydGhIZWlnaHQgPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzLmhlaWdodDtcclxuICAgICAgICBsZXQgc2lkZXMgPSB0aGlzLmdldE91dGxpbmVTaWRlcygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB0b3AgPSBzaWRlc1swXTtcclxuICAgICAgICBsZXQgYm90dG9tID0gc2lkZXNbMl07XHJcbiAgICAgICAgYm90dG9tLnJldmVyc2UoKTtcclxuICAgICAgICBsZXQgcHJvamVjdGlvbiA9IFBhcGVySGVscGVycy5zYW5kd2ljaFBhdGhQcm9qZWN0aW9uKHRvcCwgYm90dG9tKTtcclxuICAgICAgICBsZXQgdHJhbnNmb3JtID0gbmV3IFBhdGhUcmFuc2Zvcm0ocG9pbnQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChvcnRoT3JpZ2luKTtcclxuICAgICAgICAgICAgbGV0IHVuaXQgPSBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS54IC8gb3J0aFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIG9ydGhIZWlnaHQpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdGVkID0gcHJvamVjdGlvbih1bml0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb2plY3RlZDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBzaWRlIG9mIHNpZGVzKXtcclxuICAgICAgICAgICAgc2lkZS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG5ld1BhdGggPSBQYXBlckhlbHBlcnMudHJhY2VDb21wb3VuZFBhdGgodGhpcy5zb3VyY2VQYXRoLCBcclxuICAgICAgICAgICAgU3RyZXRjaHlQYXRoLk9VVExJTkVfUE9JTlRTKTtcclxuICAgICAgICBuZXdQYXRoLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIG5ld1BhdGguZmlsbENvbG9yID0gdGhpcy5vcHRpb25zLnBhdGhGaWxsQ29sb3I7XHJcblxyXG4gICAgICAgIHRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoSXRlbShuZXdQYXRoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheVBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5UGF0aC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGxheVBhdGggPSBuZXdQYXRoO1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0Q2hpbGQoMSwgbmV3UGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRPdXRsaW5lU2lkZXMoKTogcGFwZXIuUGF0aFtdIHtcclxuICAgICAgICBsZXQgc2lkZXM6IHBhcGVyLlBhdGhbXSA9IFtdO1xyXG4gICAgICAgIGxldCBzZWdtZW50R3JvdXA6IHBhcGVyLlNlZ21lbnRbXSA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjb3JuZXJQb2ludHMgPSB0aGlzLmNvcm5lcnMubWFwKGMgPT4gYy5wb2ludCk7XHJcbiAgICAgICAgbGV0IGZpcnN0ID0gY29ybmVyUG9pbnRzLnNoaWZ0KCk7IFxyXG4gICAgICAgIGNvcm5lclBvaW50cy5wdXNoKGZpcnN0KTtcclxuXHJcbiAgICAgICAgbGV0IHRhcmdldENvcm5lciA9IGNvcm5lclBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgIGxldCBzZWdtZW50TGlzdCA9IHRoaXMub3V0bGluZS5zZWdtZW50cy5tYXAoeCA9PiB4KTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgc2VnbWVudExpc3QucHVzaChzZWdtZW50TGlzdFswXSk7XHJcbiAgICAgICAgZm9yKGxldCBzZWdtZW50IG9mIHNlZ21lbnRMaXN0KXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNlZ21lbnRHcm91cC5wdXNoKHNlZ21lbnQpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGlmKHRhcmdldENvcm5lci5pc0Nsb3NlKHNlZ21lbnQucG9pbnQsIHBhcGVyLk51bWVyaWNhbC5FUFNJTE9OKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZmluaXNoIHBhdGhcclxuICAgICAgICAgICAgICAgIHNpZGVzLnB1c2gobmV3IHBhcGVyLlBhdGgoc2VnbWVudEdyb3VwKSk7XHJcbiAgICAgICAgICAgICAgICBzZWdtZW50R3JvdXAgPSBbc2VnbWVudF07XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRDb3JuZXIgPSBjb3JuZXJQb2ludHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoc2lkZXMubGVuZ3RoICE9PSA0KXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignc2lkZXMnLCBzaWRlcyk7XHJcbiAgICAgICAgICAgIHRocm93ICdmYWlsZWQgdG8gZ2V0IHNpZGVzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHNpZGVzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZU91dGxpbmUoKSB7XHJcbiAgICAgICAgbGV0IGJvdW5kcyA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHM7XHJcbiAgICAgICAgbGV0IG91dGxpbmUgPSBuZXcgcGFwZXIuUGF0aChcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLmNvcm5lcnModGhpcy5zb3VyY2VQYXRoLmJvdW5kcykpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZih0aGlzLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yKXtcclxuICAgICAgICAgICAgb3V0bGluZS5maWxsQ29sb3IgPSB0aGlzLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yOyAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXRsaW5lLmZpbGxDb2xvciA9IHdpbmRvdy5hcHAuY2FudmFzQ29sb3I7XHJcbiAgICAgICAgICAgIG91dGxpbmUub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dGxpbmUuY2xvc2VkID0gdHJ1ZTtcclxuICAgICAgICBvdXRsaW5lLmRhc2hBcnJheSA9IFs1LCA1XTtcclxuICAgICAgICB0aGlzLm91dGxpbmUgPSBvdXRsaW5lO1xyXG5cclxuICAgICAgICAvLyB0cmFjayBjb3JuZXJzIHNvIHdlIGtub3cgaG93IHRvIGFycmFuZ2UgdGhlIHRleHRcclxuICAgICAgICB0aGlzLmNvcm5lcnMgPSBvdXRsaW5lLnNlZ21lbnRzLm1hcChzID0+IHMpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENoaWxkKG91dGxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2VnbWVudE1hcmtlcnMoKSB7XHJcbiAgICAgICAgbGV0IGJvdW5kcyA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHM7XHJcbiAgICAgICAgdGhpcy5zZWdtZW50R3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICBmb3IgKGxldCBzZWdtZW50IG9mIHRoaXMub3V0bGluZS5zZWdtZW50cykge1xyXG4gICAgICAgICAgICBsZXQgaGFuZGxlID0gbmV3IFNlZ21lbnRIYW5kbGUoc2VnbWVudCk7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbkNoYW5nZUNvbXBsZXRlID0gKCkgPT4gdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50R3JvdXAuYWRkQ2hpbGQoaGFuZGxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLnNlZ21lbnRHcm91cCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVNaWRwaW9udE1hcmtlcnMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5taWRwb2ludEdyb3VwKXtcclxuICAgICAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICB0aGlzLm91dGxpbmUuY3VydmVzLmZvckVhY2goY3VydmUgPT4ge1xyXG4gICAgICAgICAgICAvLyBza2lwIGxlZnQgYW5kIHJpZ2h0IHNpZGVzXHJcbiAgICAgICAgICAgIGlmKGN1cnZlLnNlZ21lbnQxID09PSB0aGlzLmNvcm5lcnNbMV1cclxuICAgICAgICAgICAgICAgIHx8IGN1cnZlLnNlZ21lbnQxID09PSB0aGlzLmNvcm5lcnNbM10pe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjsgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGhhbmRsZSA9IG5ldyBDdXJ2ZVNwbGl0dGVySGFuZGxlKGN1cnZlKTtcclxuICAgICAgICAgICAgaGFuZGxlLm9uRHJhZ0VuZCA9IChuZXdTZWdtZW50LCBldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld0hhbmRsZSA9IG5ldyBTZWdtZW50SGFuZGxlKG5ld1NlZ21lbnQpO1xyXG4gICAgICAgICAgICAgICAgbmV3SGFuZGxlLm9uQ2hhbmdlQ29tcGxldGUgPSAoKSA9PiB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWdtZW50R3JvdXAuYWRkQ2hpbGQobmV3SGFuZGxlKTtcclxuICAgICAgICAgICAgICAgIGhhbmRsZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMubWlkcG9pbnRHcm91cC5hZGRDaGlsZChoYW5kbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5taWRwb2ludEdyb3VwKTtcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIFN0cmV0Y2h5UGF0aE9wdGlvbnMge1xyXG4gICAgcGF0aEZpbGxDb2xvcjogc3RyaW5nO1xyXG4gICAgYmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XHJcbn1cclxuIiwiXHJcbmNsYXNzIFN0cmV0Y2h5VGV4dCBleHRlbmRzIFN0cmV0Y2h5UGF0aCB7XHJcblxyXG4gICAgb3B0aW9uczogU3RyZXRjaHlUZXh0T3B0aW9ucztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcsIGZvbnQ6IG9wZW50eXBlLkZvbnQsIG9wdGlvbnM/OiBTdHJldGNoeVRleHRPcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCA8U3RyZXRjaHlUZXh0T3B0aW9ucz57XHJcbiAgICAgICAgICAgIGZvbnRTaXplOiA2NFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IG9wZW5UeXBlUGF0aCA9IGZvbnQuZ2V0UGF0aCh0ZXh0LCAwLCAwLCB0aGlzLm9wdGlvbnMuZm9udFNpemUpO1xyXG4gICAgICAgIGxldCB0ZXh0UGF0aCA9IFBhcGVySGVscGVycy5pbXBvcnRPcGVuVHlwZVBhdGgob3BlblR5cGVQYXRoKTtcclxuXHJcbiAgICAgICAgc3VwZXIodGV4dFBhdGgsIG9wdGlvbnMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgcGFwZXIuUG9pbnQodGhpcy5zdHJva2VCb3VuZHMud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3Ryb2tlQm91bmRzLmhlaWdodCAvIDIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgU3RyZXRjaHlUZXh0T3B0aW9ucyBleHRlbmRzIFN0cmV0Y2h5UGF0aE9wdGlvbnMge1xyXG4gICAgZm9udFNpemU6IG51bWJlcjtcclxufVxyXG4iLCJcclxuLyoqXHJcbiAqIE1lYXN1cmVzIG9mZnNldHMgb2YgdGV4dCBnbHlwaHMuXHJcbiAqL1xyXG5jbGFzcyBUZXh0UnVsZXIge1xyXG4gICAgXHJcbiAgICBmb250RmFtaWx5OiBzdHJpbmc7XHJcbiAgICBmb250V2VpZ2h0OiBudW1iZXI7XHJcbiAgICBmb250U2l6ZTogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCAodGV4dCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XHJcbiAgICAgICAgcG9pbnRUZXh0LmNvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgIHBvaW50VGV4dC5qdXN0aWZpY2F0aW9uID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBpZih0aGlzLmZvbnRGYW1pbHkpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udEZhbWlseSA9IHRoaXMuZm9udEZhbWlseTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5mb250V2VpZ2h0KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRXZWlnaHQgPSB0aGlzLmZvbnRXZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFNpemUpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcG9pbnRUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRleHRPZmZzZXRzKHRleHQpe1xyXG4gICAgICAgIC8vIE1lYXN1cmUgZ2x5cGhzIGluIHBhaXJzIHRvIGNhcHR1cmUgd2hpdGUgc3BhY2UuXHJcbiAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxyXG4gICAgICAgIHZhciBnbHlwaFBhaXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpKzEpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRm9yIGVhY2ggY2hhcmFjdGVyLCBmaW5kIGNlbnRlciBvZmZzZXQuXHJcbiAgICAgICAgdmFyIHhPZmZzZXRzID0gWzBdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gTWVhc3VyZSB0aHJlZSBjaGFyYWN0ZXJzIGF0IGEgdGltZSB0byBnZXQgdGhlIGFwcHJvcHJpYXRlIFxyXG4gICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxyXG4gICAgICAgICAgICB2YXIgdHJpYWRUZXh0ID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSAtIDEsIGkgKyAxKSk7XHJcbiAgICAgICAgICAgIHRyaWFkVGV4dC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXHJcbiAgICAgICAgICAgIC8vICAgYW5kIGhhbGYgb2YgY3VycmVudCBnbHlwaCBwYWlyLlxyXG4gICAgICAgICAgICAvLyBNdXN0IGJlIHJpZ2h0LCBiZWNhdXNlIGl0IHdvcmtzLlxyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2kgLSAxXS5ib3VuZHMud2lkdGggLyAyIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHdpZHRoIHRvIHByaW9yIG9mZnNldC4gXHJcbiAgICAgICAgICAgIHhPZmZzZXRzW2ldID0geE9mZnNldHNbaSAtIDFdICsgb2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgZ2x5cGhQYWlyIG9mIGdseXBoUGFpcnMpe1xyXG4gICAgICAgICAgICBnbHlwaFBhaXIucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB4T2Zmc2V0cztcclxuICAgIH1cclxufVxyXG4iXX0=