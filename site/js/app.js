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
                text: text
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
                var stretchy = new StretchyText(block.text, this.app.font, 128);
                //stretchy.translate(new paper.Point(30, 30));
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
        self._radius = 5;
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
            clockwise: path.clockwise,
            fillColor: 'lightgray'
        });
    };
    PaperHelpers.tracePath = function (path, numPoints) {
        // if(!path || !path.segments || path.segments.length){
        //     return new paper.Path();
        // }
        var pathLength = path.length;
        var offsetIncr = pathLength / numPoints;
        var points = [];
        //points.length = numPoints;
        var i = 0;
        var offset = 0;
        while (i++ < numPoints) {
            var point = path.getPointAt(Math.min(offset, pathLength));
            points.push(point);
            offset += offsetIncr;
        }
        var path = new paper.Path(points);
        path.fillColor = 'lightgray';
        return path;
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
// <reference path="typings/paper.d.ts" />
var PathText = (function (_super) {
    __extends(PathText, _super);
    function PathText(path, text, style) {
        _super.call(this);
        this.path = path;
        this._text = text;
        this.style = style;
        this.update();
    }
    Object.defineProperty(PathText.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    PathText.prototype.update = function () {
        this.removeChildren();
        var text = this.text;
        var path = this.path;
        if (text && text.length && path && path.length) {
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
            // Set point for each glyph and rotate glyph aorund the point
            var pathLength = path.length;
            for (var i = 0; i < text.length; i++) {
                var centerOffs = xOffsets[i];
                if (pathLength < centerOffs) {
                    centerOffs = undefined;
                }
                if (centerOffs === undefined) {
                    glyphPairs[i].remove();
                }
                else {
                    var pathPoint = path.getPointAt(centerOffs);
                    glyphPairs[i].position = pathPoint;
                    var tan = path.getTangentAt(centerOffs);
                    if (tan) {
                        glyphPairs[i].rotate(tan.angle, pathPoint);
                    }
                    else {
                        console.warn("Could not get tangent at ", centerOffs);
                    }
                }
            }
        }
    };
    // create a PointText object for a string and a style
    PathText.prototype.createPointText = function (text) {
        var pointText = new paper.PointText();
        pointText.content = text;
        pointText.justification = "center";
        var style = this.style;
        if (style) {
            if (style.fontFamily)
                pointText.fontFamily = style.fontFamily;
            if (style.fontSize)
                pointText.fontSize = style.fontSize;
            if (style.fontWieght)
                pointText.fontWeight = style.fontWeight;
        }
        var rect = paper.Path.Rectangle(pointText.bounds);
        rect.fillColor = 'lightgray';
        var group = new paper.Group();
        group.style = style;
        group.addChild(pointText);
        this.addChild(group);
        return group;
    };
    return PathText;
})(paper.Group);
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
                console.log('smoothing');
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
    function StretchyPath(sourcePath) {
        var _this = this;
        _super.call(this);
        this.sourcePath = sourcePath;
        this.sourcePath.visible = false;
        this.createOutline();
        this.createSegmentMarkers();
        this.updateMidpiontMarkers();
        this.mouseBehavior = {
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
        //let projection = PaperHelpers.boundsPathProjection(sides);
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
        var newPath = this.sourcePath.clone();
        newPath.visible = true;
        newPath.fillColor = '#7D5965';
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
        outline.fillColor = new paper.Color(window.app.canvasColor);
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
                _this.addChild(newHandle);
                handle.remove();
                _this.arrangeContents();
            };
            _this.midpointGroup.addChild(handle);
        });
        this.addChild(this.midpointGroup);
    };
    return StretchyPath;
})(paper.Group);
var StretchyText = (function (_super) {
    __extends(StretchyText, _super);
    function StretchyText(text, font, fontSize) {
        var openTypePath = font.getPath(text, 0, 0, fontSize);
        var textPath = PaperHelpers.importOpenTypePath(openTypePath);
        textPath.fillColor = 'red';
        _super.call(this, textPath);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyIsIi4uLy4uL3NyYy9hcHAvQXBwQ29udHJvbGxlci50cyIsIi4uLy4uL3NyYy9hcHAvRm9udExvYWRlci50cyIsIi4uLy4uL3NyYy9hcHAvSGVscGVycy50cyIsIi4uLy4uL3NyYy9hcHAvVGV4dFdhcnBDb250cm9sbGVyLnRzIiwiLi4vLi4vc3JjL21hdGgvUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHMiLCIuLi8uLi9zcmMvcGFwZXIvQ3VydmVTcGxpdHRlckhhbmRsZS50cyIsIi4uLy4uL3NyYy9wYXBlci9Nb3VzZUJlaGF2aW9yVG9vbC50cyIsIi4uLy4uL3NyYy9wYXBlci9QYXBlckhlbHBlcnMudHMiLCIuLi8uLi9zcmMvcGFwZXIvUGF0aFNlY3Rpb24udHMiLCIuLi8uLi9zcmMvcGFwZXIvUGF0aFRleHQudHMiLCIuLi8uLi9zcmMvcGFwZXIvUGF0aFRyYW5zZm9ybS50cyIsIi4uLy4uL3NyYy9wYXBlci9TZWdtZW50SGFuZGxlLnRzIiwiLi4vLi4vc3JjL3BhcGVyL1N0cmV0Y2h5UGF0aC50cyIsIi4uLy4uL3NyYy9wYXBlci9TdHJldGNoeVRleHQudHMiLCIuLi8uLi9zcmMvcGFwZXIvVGV4dFJ1bGVyLnRzIl0sIm5hbWVzIjpbIkFwcENvbnRyb2xsZXIiLCJBcHBDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQXBwQ29udHJvbGxlci5hZGRUZXh0IiwiRm9udExvYWRlciIsIkZvbnRMb2FkZXIuY29uc3RydWN0b3IiLCJuZXdpZCIsIlRleHRXYXJwQ29udHJvbGxlciIsIlRleHRXYXJwQ29udHJvbGxlci5jb25zdHJ1Y3RvciIsIlRleHRXYXJwQ29udHJvbGxlci51cGRhdGUiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybSIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtLmNvbnN0cnVjdG9yIiwiUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHJhbnNmb3JtUG9pbnQiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS5jcmVhdGVNYXRyaXgiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS5tdWx0aXBseSIsIlF1YWQiLCJRdWFkLmNvbnN0cnVjdG9yIiwiUXVhZC5mcm9tUmVjdGFuZ2xlIiwiUXVhZC5mcm9tQ29vcmRzIiwiUXVhZC5hc0Nvb3JkcyIsIkN1cnZlU3BsaXR0ZXJIYW5kbGUiLCJDdXJ2ZVNwbGl0dGVySGFuZGxlLmNvbnN0cnVjdG9yIiwiTW91c2VCZWhhdmlvclRvb2wiLCJNb3VzZUJlaGF2aW9yVG9vbC5jb25zdHJ1Y3RvciIsIk1vdXNlQmVoYXZpb3JUb29sLmlzU2FtZU9yQW5jZXN0b3IiLCJNb3VzZUJlaGF2aW9yVG9vbC5maW5kRHJhZ0hhbmRsZXIiLCJNb3VzZUJlaGF2aW9yVG9vbC5maW5kT3ZlckhhbmRsZXIiLCJQYXBlckhlbHBlcnMiLCJQYXBlckhlbHBlcnMuY29uc3RydWN0b3IiLCJQYXBlckhlbHBlcnMuaW1wb3J0T3BlblR5cGVQYXRoIiwiUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEl0ZW0iLCJQYXBlckhlbHBlcnMudHJhY2VDb21wb3VuZFBhdGgiLCJQYXBlckhlbHBlcnMudHJhY2VQYXRoIiwiUGFwZXJIZWxwZXJzLnNhbmR3aWNoUGF0aFByb2plY3Rpb24iLCJQYXBlckhlbHBlcnMucmVzZXRNYXJrZXJzIiwiUGFwZXJIZWxwZXJzLm1hcmtlckxpbmUiLCJQYXBlckhlbHBlcnMubWFya2VyIiwiUGFwZXJIZWxwZXJzLnNpbXBsaWZ5IiwiUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvciIsIlBhcGVySGVscGVycy5maW5kQW5jZXN0b3IiLCJQYXBlckhlbHBlcnMuY29ybmVycyIsIlBhdGhTZWN0aW9uIiwiUGF0aFNlY3Rpb24uY29uc3RydWN0b3IiLCJQYXRoU2VjdGlvbi5nZXRQb2ludEF0IiwiUGF0aFRleHQiLCJQYXRoVGV4dC5jb25zdHJ1Y3RvciIsIlBhdGhUZXh0LnRleHQiLCJQYXRoVGV4dC51cGRhdGUiLCJQYXRoVGV4dC5jcmVhdGVQb2ludFRleHQiLCJQYXRoVHJhbnNmb3JtIiwiUGF0aFRyYW5zZm9ybS5jb25zdHJ1Y3RvciIsIlBhdGhUcmFuc2Zvcm0udHJhbnNmb3JtUG9pbnQiLCJQYXRoVHJhbnNmb3JtLnRyYW5zZm9ybVBhdGhJdGVtIiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1Db21wb3VuZFBhdGgiLCJQYXRoVHJhbnNmb3JtLnRyYW5zZm9ybVBhdGgiLCJTZWdtZW50SGFuZGxlIiwiU2VnbWVudEhhbmRsZS5jb25zdHJ1Y3RvciIsIlNlZ21lbnRIYW5kbGUuc21vb3RoZWQiLCJTdHJldGNoeVBhdGgiLCJTdHJldGNoeVBhdGguY29uc3RydWN0b3IiLCJTdHJldGNoeVBhdGguc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eSIsIlN0cmV0Y2h5UGF0aC5hcnJhbmdlQ29udGVudHMiLCJTdHJldGNoeVBhdGguYXJyYW5nZVBhdGgiLCJTdHJldGNoeVBhdGguZ2V0T3V0bGluZVNpZGVzIiwiU3RyZXRjaHlQYXRoLmNyZWF0ZU91dGxpbmUiLCJTdHJldGNoeVBhdGguY3JlYXRlU2VnbWVudE1hcmtlcnMiLCJTdHJldGNoeVBhdGgudXBkYXRlTWlkcGlvbnRNYXJrZXJzIiwiU3RyZXRjaHlUZXh0IiwiU3RyZXRjaHlUZXh0LmNvbnN0cnVjdG9yIiwiVGV4dFJ1bGVyIiwiVGV4dFJ1bGVyLmNvbnN0cnVjdG9yIiwiVGV4dFJ1bGVyLmNyZWF0ZVBvaW50VGV4dCIsIlRleHRSdWxlci5nZXRUZXh0T2Zmc2V0cyJdLCJtYXBwaW5ncyI6IkFBS0EsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUVkLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztBQUVyQyxDQUFDLENBQUMsQ0FBQztBQ1JILElBQU0sU0FBUyxHQUFHLHdGQUF3RixDQUFDO0FBQzNHLElBQU0sU0FBUyxHQUFHLGtFQUFrRSxDQUFDO0FBQ3JGLElBQU0sU0FBUyxHQUFHLHNCQUFzQixDQUFDO0FBRXpDO0lBUUlBO1FBUkpDLGlCQW9DQ0E7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QUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMzREEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7SUFDbEJBLENBQUNBO0lBRU1GLGlDQUFZQSxHQUFuQkEsVUFBb0JBLE1BQVlBLEVBQUVBLE1BQVlBO1FBRTFDRyxJQUFJQSxZQUFZQSxHQUFHQTtZQUNmQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM5QkEsSUFBSUEsWUFBWUEsR0FBR0E7WUFDZkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFOUJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFlBQVlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBO1lBQ2xFQSxJQUFJQSxDQUFDQSxHQUFHQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM3Q0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDM0VBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQy9FQSxDQUFDQTtRQUVEQSxJQUFJQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMxQkEsTUFBTUEsQ0FBQ0E7WUFDSEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hCQSxDQUFDQSxFQUFLQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFLQSxDQUFDQTtZQUNuQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBS0EsQ0FBQ0E7U0FDdEJBLENBQUNBLEdBQUdBLENBQUNBLFVBQVNBLENBQUNBO1lBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUMzQyxDQUFDLENBQUNBLENBQUNBO0lBQ1BBLENBQUNBO0lBRURILDJFQUEyRUE7SUFDM0VBLHFDQUFxQ0E7SUFDckNBLHFDQUFxQ0E7SUFDckNBLHFDQUFxQ0E7SUFDckNBLHFDQUFxQ0E7SUFDOUJBLDZCQUFRQSxHQUFmQSxVQUFnQkEsTUFBTUEsRUFBRUEsTUFBTUE7UUFDMUJJLE1BQU1BLENBQUNBO1lBQ0hBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUVBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQy9GQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFFQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvRkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0ZBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1NBQ2xHQSxDQUFDQTtJQUNOQSxDQUFDQTtJQUNMSiwyQkFBQ0E7QUFBREEsQ0FBQ0EsQUFsRUQsSUFrRUM7QUFFRDtJQU1JSyxjQUFZQSxDQUFjQSxFQUFFQSxDQUFjQSxFQUFFQSxDQUFjQSxFQUFFQSxDQUFjQTtRQUN0RUMsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDWEEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDWEEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDWEEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDZkEsQ0FBQ0E7SUFFTUQsa0JBQWFBLEdBQXBCQSxVQUFxQkEsSUFBcUJBO1FBQ3RDRSxNQUFNQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUNYQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUNaQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUNiQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUNmQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUNuQkEsQ0FBQ0E7SUFDTkEsQ0FBQ0E7SUFFTUYsZUFBVUEsR0FBakJBLFVBQWtCQSxNQUFnQkE7UUFDOUJHLE1BQU1BLENBQUNBLElBQUlBLElBQUlBLENBQ1hBLElBQUlBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQ3JDQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUNyQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFDckNBLElBQUlBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQ3hDQSxDQUFBQTtJQUNMQSxDQUFDQTtJQUVESCx1QkFBUUEsR0FBUkE7UUFDSUksTUFBTUEsQ0FBQ0E7WUFDSEEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbEJBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2xCQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNsQkEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7U0FDckJBLENBQUNBO0lBQ05BLENBQUNBO0lBQ0xKLFdBQUNBO0FBQURBLENBQUNBLEFBdkNELElBdUNDOzs7Ozs7QUM3R0Q7OztHQUdHO0FBQ0g7SUFBa0NLLHVDQUFXQTtJQUt6Q0EsNkJBQVlBLEtBQWtCQTtRQUxsQ0MsaUJBMENDQTtRQXBDT0EsaUJBQU9BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1FBRW5CQSxJQUFJQSxJQUFJQSxHQUFRQSxJQUFJQSxDQUFDQTtRQUNyQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDdEJBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLENBQUNBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM5Q0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsR0FBR0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFckRBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3JCQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxNQUFNQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsT0FBT0EsQ0FBQ0E7UUFDekJBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1FBRXpCQSxJQUFJQSxVQUF5QkEsQ0FBQ0E7UUFDOUJBLElBQUlBLENBQUNBLGFBQWFBLEdBQWtCQTtZQUNoQ0EsV0FBV0EsRUFBRUEsVUFBQ0EsS0FBS0E7Z0JBQ2ZBLFVBQVVBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLEtBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO2dCQUM5Q0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FDYkEsS0FBS0EsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsRUFDZkEsVUFBVUEsQ0FDYkEsQ0FBQ0E7WUFDTkEsQ0FBQ0E7WUFDREEsVUFBVUEsRUFBRUEsVUFBQUEsS0FBS0E7Z0JBQ2JBLElBQUlBLE1BQU1BLEdBQUdBLEtBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO2dCQUM1Q0EsS0FBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsTUFBTUEsQ0FBQ0E7Z0JBQ3ZCQSxVQUFVQSxDQUFDQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQTtZQUM5QkEsQ0FBQ0E7WUFDREEsU0FBU0EsRUFBRUEsVUFBQUEsS0FBS0E7Z0JBQ1pBLEVBQUVBLENBQUFBLENBQUNBLEtBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUFBLENBQUNBO29CQUNmQSxLQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxVQUFVQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDdENBLENBQUNBO1lBQ0xBLENBQUNBO1NBQ0pBLENBQUNBO0lBQ05BLENBQUNBO0lBQ0xELDBCQUFDQTtBQUFEQSxDQUFDQSxBQTFDRCxFQUFrQyxLQUFLLENBQUMsS0FBSyxFQTBDNUM7QUN0QkQ7SUFBZ0NFLHFDQUFVQTtJQVl0Q0EsMkJBQVlBLFVBQTRCQTtRQVo1Q0MsaUJBNklDQTtRQWhJT0EsaUJBQU9BLENBQUNBO1FBWFpBLGVBQVVBLEdBQUdBO1lBQ1RBLFFBQVFBLEVBQUVBLElBQUlBO1lBQ2RBLE1BQU1BLEVBQUVBLElBQUlBO1lBQ1pBLElBQUlBLEVBQUVBLElBQUlBO1lBQ1ZBLFNBQVNBLEVBQUVBLENBQUNBO1NBQ2ZBLENBQUNBO1FBU0ZBLGdCQUFXQSxHQUFHQSxVQUFDQSxLQUFLQTtZQUNoQkEsS0FBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFFeEJBLElBQUlBLFNBQVNBLEdBQUdBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQ2pDQSxLQUFLQSxDQUFDQSxLQUFLQSxFQUNYQSxLQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtZQUVyQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsSUFBSUEsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzlCQSxJQUFJQSxTQUFTQSxHQUFHQSxLQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDckRBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO29CQUNaQSxLQUFJQSxDQUFDQSxXQUFXQSxHQUFnQkE7d0JBQzVCQSxJQUFJQSxFQUFFQSxTQUFTQTtxQkFDbEJBLENBQUNBO2dCQUNOQSxDQUFDQTtZQUVMQSxDQUFDQTtRQUNMQSxDQUFDQSxDQUFBQTtRQUVEQSxnQkFBV0EsR0FBR0EsVUFBQ0EsS0FBS0E7WUFDaEJBLElBQUlBLFNBQVNBLEdBQUdBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQ2pDQSxLQUFLQSxDQUFDQSxLQUFLQSxFQUNYQSxLQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtZQUNyQkEsSUFBSUEsV0FBV0EsR0FBR0EsU0FBU0E7bUJBQ3BCQSxLQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUU1Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDQUEsMkJBQTJCQTtZQUMzQkEsS0FBSUEsQ0FBQ0EsV0FBV0E7bUJBQ2JBO2dCQUNDQSxpQ0FBaUNBO2dCQUNqQ0EsV0FBV0EsSUFBSUEsSUFBSUE7dUJBRWhCQSxDQUFDQSxpQkFBaUJBLENBQUNBLGdCQUFnQkEsQ0FDbENBLFNBQVNBLENBQUNBLElBQUlBLEVBQ2RBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLENBQ2xDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDQ0EsZUFBZUE7Z0JBQ2ZBLEVBQUVBLENBQUNBLENBQUNBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO29CQUNoREEsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pEQSxDQUFDQTtnQkFDREEsS0FBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDNUJBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLENBQUNBLFdBQVdBLElBQUlBLFdBQVdBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBO2dCQUMzQ0EsSUFBSUEsUUFBUUEsR0FBR0EsV0FBV0EsQ0FBQ0EsYUFBYUEsQ0FBQ0E7Z0JBQ3pDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDcEJBLEtBQUlBLENBQUNBLFdBQVdBLEdBQWdCQTt3QkFDNUJBLElBQUlBLEVBQUVBLFdBQVdBO3FCQUNwQkEsQ0FBQ0E7b0JBQ0ZBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO3dCQUN2QkEsUUFBUUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2hDQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBQ0RBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLElBQUlBLFFBQVFBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO29CQUNsQ0EsUUFBUUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQy9CQSxDQUFDQTtZQUNMQSxDQUFDQTtRQUNMQSxDQUFDQSxDQUFBQTtRQUVEQSxnQkFBV0EsR0FBR0EsVUFBQ0EsS0FBS0E7WUFDaEJBLEVBQUVBLENBQUNBLENBQUNBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNuQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzVCQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFDaENBLEVBQUVBLENBQUNBLENBQUNBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO3dCQUNsREEsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FDaERBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLEVBQUVBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO29CQUM1REEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDakRBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO2dCQUN0RkEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7UUFDTEEsQ0FBQ0EsQ0FBQUE7UUFFREEsY0FBU0EsR0FBR0EsVUFBQ0EsS0FBS0E7WUFDZEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25CQSxJQUFJQSxNQUFNQSxHQUFHQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtnQkFDOUJBLEtBQUlBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBO2dCQUV4QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pCQSxPQUFPQTtvQkFDUEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3RDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDakVBLENBQUNBO2dCQUNMQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ0pBLFFBQVFBO29CQUNSQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDcENBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO29CQUMvREEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO1lBQ0xBLENBQUNBO1FBQ0xBLENBQUNBLENBQUFBO1FBRURBLGNBQVNBLEdBQUdBLFVBQUNBLEtBQUtBO1lBQ2RBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLElBQUlBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO2dCQUN2QkEsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsUUFBUUEsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsUUFBUUEsQ0FBQ0E7WUFDN0VBLENBQUNBO1FBQ0xBLENBQUNBLENBQUFBO0lBbkdEQSxDQUFDQTtJQXFHREQ7O09BRUdBO0lBQ0lBLGtDQUFnQkEsR0FBdkJBLFVBQXdCQSxJQUFnQkEsRUFBRUEsZ0JBQTRCQTtRQUNsRUUsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsWUFBWUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxJQUFJQSxFQUFFQSxVQUFBQSxFQUFFQSxJQUFJQSxPQUFBQSxFQUFFQSxLQUFLQSxnQkFBZ0JBLEVBQXZCQSxDQUF1QkEsQ0FBQ0EsQ0FBQ0E7SUFDbEZBLENBQUNBO0lBRURGLDJDQUFlQSxHQUFmQSxVQUFnQkEsSUFBZ0JBO1FBQzVCRyxNQUFNQSxDQUFDQSxZQUFZQSxDQUFDQSxrQkFBa0JBLENBQ2xDQSxJQUFJQSxFQUNKQSxVQUFBQSxFQUFFQTtZQUNFQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxhQUFhQSxDQUFDQTtZQUMxQkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUE7Z0JBQ1JBLENBQUNBLEVBQUVBLENBQUNBLFdBQVdBLElBQUlBLEVBQUVBLENBQUNBLFVBQVVBLElBQUlBLEVBQUVBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1FBQzNEQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNYQSxDQUFDQTtJQUVESCwyQ0FBZUEsR0FBZkEsVUFBZ0JBLElBQWdCQTtRQUM1QkksTUFBTUEsQ0FBQ0EsWUFBWUEsQ0FBQ0Esa0JBQWtCQSxDQUNsQ0EsSUFBSUEsRUFDSkEsVUFBQUEsRUFBRUE7WUFDRUEsSUFBSUEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7WUFDMUJBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBO2dCQUNSQSxDQUFDQSxFQUFFQSxDQUFDQSxXQUFXQSxJQUFJQSxFQUFFQSxDQUFDQSxVQUFVQSxJQUFJQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFFQSxDQUFDQSxDQUFDQTtRQUM1REEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFDTEosd0JBQUNBO0FBQURBLENBQUNBLEFBN0lELEVBQWdDLEtBQUssQ0FBQyxJQUFJLEVBNkl6QztBQ3JLRDtJQUFBSztJQXlJQUMsQ0FBQ0E7SUF2SVVELCtCQUFrQkEsR0FBekJBLFVBQTBCQSxRQUF1QkE7UUFDN0NFLE1BQU1BLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLFlBQVlBLENBQUNBLFFBQVFBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBLENBQUNBO1FBRXJEQSwrQkFBK0JBO1FBQy9CQSxtREFBbURBO0lBQ3ZEQSxDQUFDQTtJQUVNRiwwQkFBYUEsR0FBcEJBLFVBQXFCQSxJQUFvQkEsRUFBRUEsYUFBcUJBO1FBQzVERyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxLQUFLQSxjQUFjQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNwQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFxQkEsSUFBSUEsRUFBRUEsYUFBYUEsQ0FBQ0EsQ0FBQ0E7UUFDM0VBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ0pBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQWFBLElBQUlBLEVBQUVBLGFBQWFBLENBQUNBLENBQUNBO1FBQzNEQSxDQUFDQTtJQUNMQSxDQUFDQTtJQUVNSCw4QkFBaUJBLEdBQXhCQSxVQUF5QkEsSUFBd0JBLEVBQUVBLGFBQXFCQTtRQUF4RUksaUJBV0NBO1FBVkdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNoQkEsQ0FBQ0E7UUFDREEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBQUEsQ0FBQ0E7bUJBQzNCQSxLQUFJQSxDQUFDQSxTQUFTQSxDQUFhQSxDQUFDQSxFQUFFQSxhQUFhQSxDQUFDQTtRQUE1Q0EsQ0FBNENBLENBQUNBLENBQUNBO1FBQ2xEQSxNQUFNQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQSxZQUFZQSxDQUFDQTtZQUMxQkEsUUFBUUEsRUFBRUEsS0FBS0E7WUFDZkEsU0FBU0EsRUFBRUEsSUFBSUEsQ0FBQ0EsU0FBU0E7WUFDekJBLFNBQVNBLEVBQUVBLFdBQVdBO1NBQ3pCQSxDQUFDQSxDQUFBQTtJQUNOQSxDQUFDQTtJQUVNSixzQkFBU0EsR0FBaEJBLFVBQWlCQSxJQUFnQkEsRUFBRUEsU0FBaUJBO1FBQ2hESyx1REFBdURBO1FBQ3ZEQSwrQkFBK0JBO1FBQy9CQSxJQUFJQTtRQUNKQSxJQUFJQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUM3QkEsSUFBSUEsVUFBVUEsR0FBR0EsVUFBVUEsR0FBR0EsU0FBU0EsQ0FBQ0E7UUFDeENBLElBQUlBLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBO1FBQ2hCQSw0QkFBNEJBO1FBQzVCQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNWQSxJQUFJQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUVmQSxPQUFPQSxDQUFDQSxFQUFFQSxHQUFHQSxTQUFTQSxFQUFFQSxDQUFDQTtZQUNyQkEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsRUFBRUEsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDMURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQ25CQSxNQUFNQSxJQUFJQSxVQUFVQSxDQUFDQTtRQUN6QkEsQ0FBQ0E7UUFFREEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDbENBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLFdBQVdBLENBQUNBO1FBQzdCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNoQkEsQ0FBQ0E7SUFFTUwsbUNBQXNCQSxHQUE3QkEsVUFBOEJBLE9BQXdCQSxFQUFFQSxVQUEyQkE7UUFFL0VNLElBQU1BLGFBQWFBLEdBQUdBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBO1FBQ3JDQSxJQUFNQSxnQkFBZ0JBLEdBQUdBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBO1FBQzNDQSxNQUFNQSxDQUFDQSxVQUFTQSxTQUFzQkE7WUFDbEMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDO1lBQy9ELElBQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3hFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLElBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sK0NBQStDLEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pGLENBQUM7WUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxDQUFDLENBQUFBO0lBQ0xBLENBQUNBO0lBSU1OLHlCQUFZQSxHQUFuQkE7UUFDSU8sRUFBRUEsQ0FBQUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7WUFDekJBLFlBQVlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1FBQ3RDQSxDQUFDQTtRQUNEQSxZQUFZQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUM3Q0EsWUFBWUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsR0FBR0EsR0FBR0EsQ0FBQ0E7SUFFM0NBLENBQUNBO0lBRU1QLHVCQUFVQSxHQUFqQkEsVUFBa0JBLENBQWNBLEVBQUVBLENBQWNBO1FBQzVDUSxJQUFJQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxFQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNoQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsT0FBT0EsQ0FBQ0E7UUFDM0JBLDBCQUEwQkE7UUFDMUJBLFlBQVlBLENBQUNBLFdBQVdBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ3hDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNoQkEsQ0FBQ0E7SUFFTVIsbUJBQU1BLEdBQWJBLFVBQWNBLEtBQWtCQTtRQUM1QlMsSUFBSUEsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDMUNBLE1BQU1BLENBQUNBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBO1FBQzNCQSxZQUFZQSxDQUFDQSxXQUFXQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUMxQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7SUFDbEJBLENBQUNBO0lBRU1ULHFCQUFRQSxHQUFmQSxVQUFnQkEsSUFBb0JBLEVBQUVBLFNBQWtCQTtRQUNwRFUsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsS0FBS0EsY0FBY0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDcENBLEdBQUdBLENBQUNBLENBQVVBLFVBQWFBLEVBQWJBLEtBQUFBLElBQUlBLENBQUNBLFFBQVFBLEVBQXRCQSxjQUFLQSxFQUFMQSxJQUFzQkEsQ0FBQ0E7Z0JBQXZCQSxJQUFJQSxDQUFDQSxTQUFBQTtnQkFDTkEsWUFBWUEsQ0FBQ0EsUUFBUUEsQ0FBaUJBLENBQUNBLEVBQUVBLFNBQVNBLENBQUNBLENBQUNBO2FBQ3ZEQTtRQUNMQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNTQSxJQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUMzQ0EsQ0FBQ0E7SUFDTEEsQ0FBQ0E7SUFFRFY7O09BRUdBO0lBQ0lBLCtCQUFrQkEsR0FBekJBLFVBQTBCQSxJQUFnQkEsRUFBRUEsU0FBcUNBO1FBQzdFVyxFQUFFQSxDQUFBQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFBQSxDQUFDQTtZQUNoQkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDaEJBLENBQUNBO1FBQ0RBLE1BQU1BLENBQUNBLFlBQVlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLEVBQUVBLFNBQVNBLENBQUNBLENBQUNBO0lBQ3REQSxDQUFDQTtJQUVEWDs7T0FFR0E7SUFDSUEseUJBQVlBLEdBQW5CQSxVQUFvQkEsSUFBZ0JBLEVBQUVBLFNBQXFDQTtRQUN2RVksRUFBRUEsQ0FBQUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7WUFDTkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDaEJBLENBQUNBO1FBQ0RBLElBQUlBLEtBQWlCQSxDQUFDQTtRQUN0QkEsSUFBSUEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDM0JBLE9BQU1BLFFBQVFBLElBQUlBLFFBQVFBLEtBQUtBLEtBQUtBLEVBQUNBLENBQUNBO1lBQ2xDQSxFQUFFQSxDQUFBQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFBQSxDQUFDQTtnQkFDcEJBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBO1lBQ3BCQSxDQUFDQTtZQUNEQSxLQUFLQSxHQUFHQSxRQUFRQSxDQUFDQTtZQUNqQkEsUUFBUUEsR0FBR0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDL0JBLENBQUNBO1FBQ0RBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2hCQSxDQUFDQTtJQUVEWjs7T0FFR0E7SUFDSUEsb0JBQU9BLEdBQWRBLFVBQWVBLElBQXFCQTtRQUNoQ2EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7SUFDNUVBLENBQUNBO0lBQ0xiLG1CQUFDQTtBQUFEQSxDQUFDQSxBQXpJRCxJQXlJQztBQ3pJRDtJQUtJYyxxQkFBWUEsSUFBZ0JBLEVBQUVBLE1BQWNBLEVBQUVBLE1BQWNBO1FBQ3hEQyxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNqQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFDckJBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBO0lBQ3pCQSxDQUFDQTtJQUVERCxnQ0FBVUEsR0FBVkEsVUFBV0EsTUFBY0E7UUFDckJFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO0lBQ3REQSxDQUFDQTtJQUNMRixrQkFBQ0E7QUFBREEsQ0FBQ0EsQUFkRCxJQWNDO0FDZkQsMENBQTBDO0FBRTFDO0lBQXVCRyw0QkFBV0E7SUFPOUJBLGtCQUFZQSxJQUFjQSxFQUFFQSxJQUFhQSxFQUFFQSxLQUFXQTtRQUNsREMsaUJBQU9BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNsQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFbkJBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO0lBQ2xCQSxDQUFDQTtJQUVERCxzQkFBSUEsMEJBQUlBO2FBQVJBO1lBQ0lFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO1FBQ3RCQSxDQUFDQTthQUVERixVQUFTQSxLQUFhQTtZQUNsQkUsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDbkJBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1FBQ2xCQSxDQUFDQTs7O09BTEFGO0lBT0RBLHlCQUFNQSxHQUFOQTtRQUNJRyxJQUFJQSxDQUFDQSxjQUFjQSxFQUFFQSxDQUFDQTtRQUV0QkEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDckJBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBO1FBQ3JCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxJQUFJQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUU3Q0Esa0RBQWtEQTtZQUNsREEsa0NBQWtDQTtZQUNsQ0EsSUFBSUEsVUFBVUEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDcEJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUNuQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDakVBLENBQUNBO1lBRURBLDBDQUEwQ0E7WUFDMUNBLElBQUlBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ25CQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFFbkNBLDZEQUE2REE7Z0JBQzdEQSxzQ0FBc0NBO2dCQUN0Q0EsSUFBSUEsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25FQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtnQkFFbkJBLHlDQUF5Q0E7Z0JBQ3pDQSxvQ0FBb0NBO2dCQUNwQ0EsbUNBQW1DQTtnQkFDbkNBLElBQUlBLFdBQVdBLEdBQUdBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBO3NCQUNsQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0E7c0JBQ2xDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFFckNBLHFDQUFxQ0E7Z0JBQ3JDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxXQUFXQSxDQUFDQTtZQUNoREEsQ0FBQ0E7WUFFREEsNkRBQTZEQTtZQUM3REEsSUFBSUEsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDN0JBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUNuQ0EsSUFBSUEsVUFBVUEsR0FBR0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzdCQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxHQUFHQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDMUJBLFVBQVVBLEdBQUdBLFNBQVNBLENBQUNBO2dCQUMzQkEsQ0FBQ0E7Z0JBQ0RBLEVBQUVBLENBQUNBLENBQUNBLFVBQVVBLEtBQUtBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO29CQUMzQkEsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7Z0JBQzNCQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ0pBLElBQUlBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO29CQUM1Q0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsR0FBR0EsU0FBU0EsQ0FBQ0E7b0JBQ25DQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtvQkFDeENBLEVBQUVBLENBQUFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO3dCQUNMQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxFQUFFQSxTQUFTQSxDQUFDQSxDQUFDQTtvQkFDL0NBLENBQUNBO29CQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDSkEsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsMkJBQTJCQSxFQUFFQSxVQUFV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LE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1FBQzdDQSxJQUFJQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUMvQ0EsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7UUFFbkNBLElBQUlBLEdBQUdBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ25CQSxJQUFJQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUN0QkEsTUFBTUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7UUFDakJBLElBQUlBLFVBQVVBLEdBQUdBLFlBQVlBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsR0FBR0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFFbEVBLDREQUE0REE7UUFFNURBLElBQUlBLFNBQVNBLEdBQUdBLElBQUlBLGFBQWFBLENBQUNBLFVBQUFBLEtBQUtBO1lBQ25DQSxJQUFJQSxRQUFRQSxHQUFHQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtZQUMxQ0EsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FDdEJBLFFBQVFBLENBQUNBLENBQUNBLEdBQUdBLFNBQVNBLEVBQ3RCQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFHQSxVQUFVQSxDQUFDQSxDQUFDQTtZQUM3QkEsSUFBSUEsU0FBU0EsR0FBR0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDakNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBO1FBQ3JCQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUVIQSxHQUFHQSxDQUFBQSxDQUFhQSxVQUFLQSxFQUFqQkEsaUJBQVFBLEVBQVJBLElBQWlCQSxDQUFDQTtZQUFsQkEsSUFBSUEsSUFBSUEsR0FBSUEsS0FBS0EsSUFBVEE7WUFDUkEsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7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QUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBO1lBRXJDQSxxQ0FBcUNBO1lBQ3JDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxXQUFXQSxDQUFDQTtRQUNoREEsQ0FBQ0E7UUFFREEsR0FBR0EsQ0FBQUEsQ0FBa0JBLFVBQVVBLEVBQTNCQSxzQkFBYUEsRUFBYkEsSUFBMkJBLENBQUNBO1lBQTVCQSxJQUFJQSxTQUFTQSxHQUFJQSxVQUFVQSxJQUFkQTtZQUNiQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtTQUN0QkE7UUFFREEsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7SUFDcEJBLENBQUNBO0lBQ0xILGdCQUFDQTtBQUFEQSxDQUFDQSxBQXpERCxJQXlEQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbnRlcmZhY2UgV2luZG93IHtcclxuICAgIGFwcDogQXBwQ29udHJvbGxlcjtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7ICBcclxuICAgIFxyXG4gICAgd2luZG93LmFwcCA9IG5ldyBBcHBDb250cm9sbGVyKCk7XHJcbiAgICBcclxufSk7XHJcbiIsIlxyXG5jb25zdCBBbWF0aWNVcmwgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3MvYW1hdGljc2MvdjgvSURua1JUUEdjclNWbzUwVXlZTks3eTNVU0JuU3Zwa29wUWFVUi0ycjdpVS50dGYnO1xyXG5jb25zdCBSb2JvdG8xMDAgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3Mvcm9ib3RvL3YxNS83TXlncVRlMnpzOVlrUDBhZEE5UVFRLnR0Zic7XHJcbmNvbnN0IFJvYm90bzUwMCA9ICdmb250cy9Sb2JvdG8tNTAwLnR0Zic7XHJcblxyXG5jbGFzcyBBcHBDb250cm9sbGVyIHtcclxuXHJcbiAgICBmb250OiBvcGVudHlwZS5Gb250O1xyXG4gICAgd2FycDogVGV4dFdhcnBDb250cm9sbGVyO1xyXG4gICAgdGV4dEJsb2NrczogVGV4dEJsb2NrW10gPSBbXTtcclxuICAgIHBhcGVyOiBwYXBlci5QYXBlclNjb3BlO1xyXG4gICAgY2FudmFzQ29sb3IgPSAnI0U5RTBDMyc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5DYW52YXMnKTtcclxuICAgICAgICBwYXBlci5zZXR1cCg8SFRNTENhbnZhc0VsZW1lbnQ+Y2FudmFzKTtcclxuICAgICAgICB0aGlzLnBhcGVyID0gcGFwZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbmV3IEZvbnRMb2FkZXIoUm9ib3RvNTAwLCBmb250ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICAgICAgdGhpcy53YXJwID0gbmV3IFRleHRXYXJwQ29udHJvbGxlcih0aGlzKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuYWRkVGV4dCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgYWRkVGV4dCgpe1xyXG4gICAgICAgIGxldCB0ZXh0ID0gJCgnI25ld1RleHQnKS52YWwoKTtcclxuICAgICAgICBpZih0ZXh0LnRyaW0oKS5sZW5ndGgpe1xyXG4gICAgICAgICAgICBsZXQgYmxvY2sgPSA8VGV4dEJsb2NrPiB7XHJcbiAgICAgICAgICAgICAgICBfaWQ6IG5ld2lkKCksXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMudGV4dEJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud2FycC51cGRhdGUoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFwZXIudmlldy5kcmF3KCk7XHJcbiAgICAgICAgfSAgICBcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIFRleHRCbG9jayB7XHJcbiAgICBfaWQ6IHN0cmluZztcclxuICAgIHRleHQ6IHN0cmluZztcclxuICAgIGl0ZW06IHBhcGVyLkl0ZW07XHJcbn0iLCJcclxuY2xhc3MgRm9udExvYWRlciB7XHJcblxyXG4gICAgaXNMb2FkZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udFVybDogc3RyaW5nLCBvbkxvYWRlZDogKGZvbnQ6IG9wZW50eXBlLkZvbnQpID0+IHZvaWQpIHtcclxuICAgICAgICBvcGVudHlwZS5sb2FkKGZvbnRVcmwsIGZ1bmN0aW9uKGVyciwgZm9udCkge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob25Mb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBvbkxvYWRlZC5jYWxsKHRoaXMsIGZvbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJcclxuZnVuY3Rpb24gbmV3aWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAobmV3IERhdGUoKS5nZXRUaW1lKCkrTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMzYpO1xyXG59XHJcbiIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInR5cGluZ3MvcGFwZXIuZC50c1wiIC8+XHJcblxyXG5jbGFzcyBUZXh0V2FycENvbnRyb2xsZXIge1xyXG4gICAgYXBwOiBBcHBDb250cm9sbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwQ29udHJvbGxlcikge1xyXG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG5ldyBNb3VzZUJlaGF2aW9yVG9vbChwYXBlcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHVwZGF0ZSgpe1xyXG4gICAgICAgIGZvcihsZXQgYmxvY2sgb2YgdGhpcy5hcHAudGV4dEJsb2Nrcyl7XHJcbiAgICAgICAgICAgIGlmKCFibG9jay5pdGVtKXtcclxuICAgICAgICAgICAgICAgIGxldCBzdHJldGNoeSA9IG5ldyBTdHJldGNoeVRleHQoYmxvY2sudGV4dCwgdGhpcy5hcHAuZm9udCwgMTI4KTtcclxuICAgICAgICAgICAgICAgIC8vc3RyZXRjaHkudHJhbnNsYXRlKG5ldyBwYXBlci5Qb2ludCgzMCwgMzApKTtcclxuICAgICAgICAgICAgICAgIGJsb2NrLml0ZW0gPSBzdHJldGNoeTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfSAgICBcclxufVxyXG4iLCJcclxuZGVjbGFyZSB2YXIgc29sdmU6IChhOiBhbnksIGI6IGFueSwgZmFzdDogYm9vbGVhbikgPT4gdm9pZDtcclxuXHJcbmNsYXNzIFBlcnNwZWN0aXZlVHJhbnNmb3JtIHtcclxuICAgIFxyXG4gICAgc291cmNlOiBRdWFkO1xyXG4gICAgZGVzdDogUXVhZDtcclxuICAgIHBlcnNwOiBhbnk7XHJcbiAgICBtYXRyaXg6IG51bWJlcltdO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2U6IFF1YWQsIGRlc3Q6IFF1YWQpe1xyXG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuZGVzdCA9IGRlc3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5jcmVhdGVNYXRyaXgoc291cmNlLCBkZXN0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gR2l2ZW4gYSA0eDQgcGVyc3BlY3RpdmUgdHJhbnNmb3JtYXRpb24gbWF0cml4LCBhbmQgYSAyRCBwb2ludCAoYSAyeDEgdmVjdG9yKSxcclxuICAgIC8vIGFwcGxpZXMgdGhlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCBieSBjb252ZXJ0aW5nIHRoZSBwb2ludCB0byBob21vZ2VuZW91c1xyXG4gICAgLy8gY29vcmRpbmF0ZXMgYXQgej0wLCBwb3N0LW11bHRpcGx5aW5nLCBhbmQgdGhlbiBhcHBseWluZyBhIHBlcnNwZWN0aXZlIGRpdmlkZS5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBsZXQgcDMgPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5tdWx0aXBseSh0aGlzLm1hdHJpeCwgW3BvaW50LngsIHBvaW50LnksIDAsIDFdKTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IHBhcGVyLlBvaW50KHAzWzBdIC8gcDNbM10sIHAzWzFdIC8gcDNbM10pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBjcmVhdGVNYXRyaXgoc291cmNlOiBRdWFkLCB0YXJnZXQ6IFF1YWQpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNvdXJjZVBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3NvdXJjZS5hLngsIHNvdXJjZS5hLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5iLngsIHNvdXJjZS5iLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5jLngsIHNvdXJjZS5jLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5kLngsIHNvdXJjZS5kLnldXTtcclxuICAgICAgICBsZXQgdGFyZ2V0UG9pbnRzID0gW1xyXG4gICAgICAgICAgICBbdGFyZ2V0LmEueCwgdGFyZ2V0LmEueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmIueCwgdGFyZ2V0LmIueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmMueCwgdGFyZ2V0LmMueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmQueCwgdGFyZ2V0LmQueV1dO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGEgPSBbXSwgYiA9IFtdLCBpID0gMCwgbiA9IHNvdXJjZVBvaW50cy5sZW5ndGg7IGkgPCBuOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHMgPSBzb3VyY2VQb2ludHNbaV0sIHQgPSB0YXJnZXRQb2ludHNbaV07XHJcbiAgICAgICAgICAgIGEucHVzaChbc1swXSwgc1sxXSwgMSwgMCwgMCwgMCwgLXNbMF0gKiB0WzBdLCAtc1sxXSAqIHRbMF1dKSwgYi5wdXNoKHRbMF0pO1xyXG4gICAgICAgICAgICBhLnB1c2goWzAsIDAsIDAsIHNbMF0sIHNbMV0sIDEsIC1zWzBdICogdFsxXSwgLXNbMV0gKiB0WzFdXSksIGIucHVzaCh0WzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBYID0gc29sdmUoYSwgYiwgdHJ1ZSk7IFxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIFhbMF0sIFhbM10sIDAsIFhbNl0sXHJcbiAgICAgICAgICAgIFhbMV0sIFhbNF0sIDAsIFhbN10sXHJcbiAgICAgICAgICAgICAgIDAsICAgIDAsIDEsICAgIDAsXHJcbiAgICAgICAgICAgIFhbMl0sIFhbNV0sIDAsICAgIDFcclxuICAgICAgICBdLm1hcChmdW5jdGlvbih4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHggKiAxMDAwMDApIC8gMTAwMDAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBvc3QtbXVsdGlwbHkgYSA0eDQgbWF0cml4IGluIGNvbHVtbi1tYWpvciBvcmRlciBieSBhIDR4MSBjb2x1bW4gdmVjdG9yOlxyXG4gICAgLy8gWyBtMCBtNCBtOCAgbTEyIF0gICBbIHYwIF0gICBbIHggXVxyXG4gICAgLy8gWyBtMSBtNSBtOSAgbTEzIF0gKiBbIHYxIF0gPSBbIHkgXVxyXG4gICAgLy8gWyBtMiBtNiBtMTAgbTE0IF0gICBbIHYyIF0gICBbIHogXVxyXG4gICAgLy8gWyBtMyBtNyBtMTEgbTE1IF0gICBbIHYzIF0gICBbIHcgXVxyXG4gICAgc3RhdGljIG11bHRpcGx5KG1hdHJpeCwgdmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgbWF0cml4WzBdICogdmVjdG9yWzBdICsgbWF0cml4WzRdICogdmVjdG9yWzFdICsgbWF0cml4WzggXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxMl0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFsxXSAqIHZlY3RvclswXSArIG1hdHJpeFs1XSAqIHZlY3RvclsxXSArIG1hdHJpeFs5IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTNdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMl0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNl0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbMTBdICogdmVjdG9yWzJdICsgbWF0cml4WzE0XSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzNdICogdmVjdG9yWzBdICsgbWF0cml4WzddICogdmVjdG9yWzFdICsgbWF0cml4WzExXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNV0gKiB2ZWN0b3JbM11cclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBRdWFkIHtcclxuICAgIGE6IHBhcGVyLlBvaW50O1xyXG4gICAgYjogcGFwZXIuUG9pbnQ7XHJcbiAgICBjOiBwYXBlci5Qb2ludDtcclxuICAgIGQ6IHBhcGVyLlBvaW50O1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQsIGM6IHBhcGVyLlBvaW50LCBkOiBwYXBlci5Qb2ludCl7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYyA9IGM7XHJcbiAgICAgICAgdGhpcy5kID0gZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21SZWN0YW5nbGUocmVjdDogcGFwZXIuUmVjdGFuZ2xlKXtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIHJlY3QudG9wTGVmdCxcclxuICAgICAgICAgICAgcmVjdC50b3BSaWdodCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21MZWZ0LFxyXG4gICAgICAgICAgICByZWN0LmJvdHRvbVJpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21Db29yZHMoY29vcmRzOiBudW1iZXJbXSkgOiBRdWFkIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMF0sIGNvb3Jkc1sxXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMl0sIGNvb3Jkc1szXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNF0sIGNvb3Jkc1s1XSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNl0sIGNvb3Jkc1s3XSlcclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFzQ29vcmRzKCk6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB0aGlzLmEueCwgdGhpcy5hLnksXHJcbiAgICAgICAgICAgIHRoaXMuYi54LCB0aGlzLmIueSxcclxuICAgICAgICAgICAgdGhpcy5jLngsIHRoaXMuYy55LFxyXG4gICAgICAgICAgICB0aGlzLmQueCwgdGhpcy5kLnlcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59IiwiXHJcbi8qKlxyXG4gKiBIYW5kbGUgdGhhdCBzaXRzIG9uIG1pZHBvaW50IG9mIGN1cnZlXHJcbiAqICAgd2hpY2ggd2lsbCBzcGxpdCB0aGUgY3VydmUgd2hlbiBkcmFnZ2VkLlxyXG4gKi9cclxuY2xhc3MgQ3VydmVTcGxpdHRlckhhbmRsZSBleHRlbmRzIHBhcGVyLlNoYXBlIHtcclxuIFxyXG4gICAgY3VydmU6IHBhcGVyLkN1cnZlO1xyXG4gICAgb25EcmFnRW5kOiAobmV3U2VnbWVudDogcGFwZXIuU2VnbWVudCwgZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuIFxyXG4gICAgY29uc3RydWN0b3IoY3VydmU6IHBhcGVyLkN1cnZlKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnZlID0gY3VydmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNlbGYgPSA8YW55PnRoaXM7XHJcbiAgICAgICAgc2VsZi5fdHlwZSA9ICdjaXJjbGUnO1xyXG4gICAgICAgIHNlbGYuX3JhZGl1cyA9IDU7XHJcbiAgICAgICAgc2VsZi5fc2l6ZSA9IG5ldyBwYXBlci5TaXplKHNlbGYuX3JhZGl1cyAqIDIpO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKGN1cnZlLmdldFBvaW50QXQoMC41ICogY3VydmUubGVuZ3RoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDI7XHJcbiAgICAgICAgdGhpcy5zdHJva2VDb2xvciA9ICdibHVlJztcclxuICAgICAgICB0aGlzLmZpbGxDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gMC41ICogMC4zOyBcclxuIFxyXG4gICAgICAgIGxldCBuZXdTZWdtZW50OiBwYXBlci5TZWdtZW50O1xyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IDxNb3VzZUJlaGF2aW9yPntcclxuICAgICAgICAgICAgb25EcmFnU3RhcnQ6IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudCA9IG5ldyBwYXBlci5TZWdtZW50KHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY3VydmUucGF0aC5pbnNlcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmUuaW5kZXggKyAxLCBcclxuICAgICAgICAgICAgICAgICAgICBuZXdTZWdtZW50XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3UG9zID0gdGhpcy5wb3NpdGlvbi5hZGQoZXZlbnQuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ld1BvcztcclxuICAgICAgICAgICAgICAgIG5ld1NlZ21lbnQucG9pbnQgPSBuZXdQb3M7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ0VuZDogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkRyYWdFbmQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25EcmFnRW5kKG5ld1NlZ21lbnQsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcclxuICAgIGludGVyZmFjZSBJdGVtIHtcclxuICAgICAgICBtb3VzZUJlaGF2aW9yOiBNb3VzZUJlaGF2aW9yO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgTW91c2VCZWhhdmlvciB7XHJcbiAgICBvbkNsaWNrPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gICAgb25PdmVyU3RhcnQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uT3Zlck1vdmU/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uT3ZlckVuZD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICAgIG9uRHJhZ1N0YXJ0PzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbkRyYWdNb3ZlPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbkRyYWdFbmQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxufVxyXG5cclxuaW50ZXJmYWNlIE1vdXNlQWN0aW9uIHtcclxuICAgIHN0YXJ0RXZlbnQ6IHBhcGVyLlRvb2xFdmVudDtcclxuICAgIGl0ZW06IHBhcGVyLkl0ZW07XHJcbiAgICBkcmFnZ2VkOiBib29sZWFuO1xyXG59XHJcblxyXG5jbGFzcyBNb3VzZUJlaGF2aW9yVG9vbCBleHRlbmRzIHBhcGVyLlRvb2wge1xyXG5cclxuICAgIGhpdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgc2VnbWVudHM6IHRydWUsXHJcbiAgICAgICAgc3Ryb2tlOiB0cnVlLFxyXG4gICAgICAgIGZpbGw6IHRydWUsXHJcbiAgICAgICAgdG9sZXJhbmNlOiA1XHJcbiAgICB9O1xyXG5cclxuICAgIHByZXNzQWN0aW9uOiBNb3VzZUFjdGlvbjtcclxuICAgIGhvdmVyQWN0aW9uOiBNb3VzZUFjdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXBlclNjb3BlOiBwYXBlci5QYXBlclNjb3BlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93biA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIHRoaXMucHJlc3NBY3Rpb24gPSBudWxsO1xyXG5cclxuICAgICAgICB2YXIgaGl0UmVzdWx0ID0gcGFwZXIucHJvamVjdC5oaXRUZXN0KFxyXG4gICAgICAgICAgICBldmVudC5wb2ludCxcclxuICAgICAgICAgICAgdGhpcy5oaXRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgaWYgKGhpdFJlc3VsdCAmJiBoaXRSZXN1bHQuaXRlbSkge1xyXG4gICAgICAgICAgICBsZXQgZHJhZ2dhYmxlID0gdGhpcy5maW5kRHJhZ0hhbmRsZXIoaGl0UmVzdWx0Lml0ZW0pO1xyXG4gICAgICAgICAgICBpZiAoZHJhZ2dhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uID0gPE1vdXNlQWN0aW9uPntcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiBkcmFnZ2FibGVcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy90aGlzLnBhcGVyU2NvcGUucHJvamVjdC5hY3RpdmVMYXllci5hZGRDaGlsZCh0aGlzLmRyYWdJdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU1vdmUgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICB2YXIgaGl0UmVzdWx0ID0gcGFwZXIucHJvamVjdC5oaXRUZXN0KFxyXG4gICAgICAgICAgICBldmVudC5wb2ludCxcclxuICAgICAgICAgICAgdGhpcy5oaXRPcHRpb25zKTtcclxuICAgICAgICBsZXQgaGFuZGxlckl0ZW0gPSBoaXRSZXN1bHRcclxuICAgICAgICAgICAgJiYgdGhpcy5maW5kT3ZlckhhbmRsZXIoaGl0UmVzdWx0Lml0ZW0pO1xyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIC8vIHdlcmUgcHJldmlvdXNseSBob3ZlcmluZ1xyXG4gICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uXHJcbiAgICAgICAgICAgICYmIChcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBob3ZlcmluZyBvdmVyIGFueXRoaW5nIG5vd1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlckl0ZW0gPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgLy8gbm90IGhvdmVyaW5nIG92ZXIgY3VycmVudCBoYW5kbGVyIG9yIGRlc2NlbmRlbnQgdGhlcmVvZlxyXG4gICAgICAgICAgICAgICAgfHwgIU1vdXNlQmVoYXZpb3JUb29sLmlzU2FtZU9yQW5jZXN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgaGl0UmVzdWx0Lml0ZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvbi5pdGVtKSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLy8ganVzdCBsZWF2aW5nXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhvdmVyQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbk92ZXJFbmQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uT3ZlckVuZChldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaGFuZGxlckl0ZW0gJiYgaGFuZGxlckl0ZW0ubW91c2VCZWhhdmlvcikge1xyXG4gICAgICAgICAgICBsZXQgYmVoYXZpb3IgPSBoYW5kbGVySXRlbS5tb3VzZUJlaGF2aW9yO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaG92ZXJBY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24gPSA8TW91c2VBY3Rpb24+e1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06IGhhbmRsZXJJdGVtXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgaWYgKGJlaGF2aW9yLm9uT3ZlclN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3Iub25PdmVyU3RhcnQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChiZWhhdmlvciAmJiBiZWhhdmlvci5vbk92ZXJNb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICBiZWhhdmlvci5vbk92ZXJNb3ZlKGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRHJhZyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wcmVzc0FjdGlvbi5kcmFnZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uLmRyYWdnZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlc3NBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ1N0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnU3RhcnQuY2FsbChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLCB0aGlzLnByZXNzQWN0aW9uLnN0YXJ0RXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdNb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdNb3ZlLmNhbGwodGhpcy5wcmVzc0FjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJlc3NBY3Rpb24pIHtcclxuICAgICAgICAgICAgbGV0IGFjdGlvbiA9IHRoaXMucHJlc3NBY3Rpb247XHJcbiAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24gPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFjdGlvbi5kcmFnZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkcmFnXHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdFbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ0VuZC5jYWxsKGFjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjbGlja1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25DbGljaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25DbGljay5jYWxsKGFjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25LZXlEb3duID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PSAnc3BhY2UnKSB7XHJcbiAgICAgICAgICAgIHBhcGVyLnByb2plY3QuYWN0aXZlTGF5ZXIuc2VsZWN0ZWQgPSAhcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5zZWxlY3RlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lIGlmIHBvc3NpYmxlQW5jZXN0b3IgaXMgYW4gYW5jZXN0b3Igb2YgaXRlbS4gXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpc1NhbWVPckFuY2VzdG9yKGl0ZW06IHBhcGVyLkl0ZW0sIHBvc3NpYmxlQW5jZXN0b3I6IHBhcGVyLkl0ZW0pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gISFQYXBlckhlbHBlcnMuZmluZFNlbGZPckFuY2VzdG9yKGl0ZW0sIHBhID0+IHBhID09PSBwb3NzaWJsZUFuY2VzdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kRHJhZ0hhbmRsZXIoaXRlbTogcGFwZXIuSXRlbSk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHJldHVybiBQYXBlckhlbHBlcnMuZmluZFNlbGZPckFuY2VzdG9yKFxyXG4gICAgICAgICAgICBpdGVtLCBcclxuICAgICAgICAgICAgcGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1iID0gcGEubW91c2VCZWhhdmlvcjtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhIShtYiAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChtYi5vbkRyYWdTdGFydCB8fCBtYi5vbkRyYWdNb3ZlIHx8IG1iLm9uRHJhZ0VuZCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZmluZE92ZXJIYW5kbGVyKGl0ZW06IHBhcGVyLkl0ZW0pOiBwYXBlci5JdGVtIHtcclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvcihcclxuICAgICAgICAgICAgaXRlbSwgXHJcbiAgICAgICAgICAgIHBhID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYiA9IHBhLm1vdXNlQmVoYXZpb3I7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gISEobWIgJiZcclxuICAgICAgICAgICAgICAgICAgICAobWIub25PdmVyU3RhcnQgfHwgbWIub25PdmVyTW92ZSB8fCBtYi5vbk92ZXJFbmQgKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBQYXBlckhlbHBlcnMge1xyXG5cclxuICAgIHN0YXRpYyBpbXBvcnRPcGVuVHlwZVBhdGgob3BlblBhdGg6IG9wZW50eXBlLlBhdGgpOiBwYXBlci5Db21wb3VuZFBhdGgge1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKG9wZW5QYXRoLnRvUGF0aERhdGEoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gbGV0IHN2ZyA9IG9wZW5QYXRoLnRvU1ZHKDQpO1xyXG4gICAgICAgIC8vIHJldHVybiA8cGFwZXIuUGF0aD5wYXBlci5wcm9qZWN0LmltcG9ydFNWRyhzdmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZVBhdGhJdGVtKHBhdGg6IHBhcGVyLlBhdGhJdGVtLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5QYXRoSXRlbSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRyYWNlQ29tcG91bmRQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICBpZiAoIXBhdGguY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcGF0aHMgPSBwYXRoLmNoaWxkcmVuLm1hcChwID0+XHJcbiAgICAgICAgICAgIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnAsIHBvaW50c1BlclBhdGgpKTtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aCh7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBwYXRocyxcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZSxcclxuICAgICAgICAgICAgZmlsbENvbG9yOiAnbGlnaHRncmF5J1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRyYWNlUGF0aChwYXRoOiBwYXBlci5QYXRoLCBudW1Qb2ludHM6IG51bWJlcik6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgIC8vIGlmKCFwYXRoIHx8ICFwYXRoLnNlZ21lbnRzIHx8IHBhdGguc2VnbWVudHMubGVuZ3RoKXtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIG5ldyBwYXBlci5QYXRoKCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGxldCBwYXRoTGVuZ3RoID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG9mZnNldEluY3IgPSBwYXRoTGVuZ3RoIC8gbnVtUG9pbnRzO1xyXG4gICAgICAgIGxldCBwb2ludHMgPSBbXTtcclxuICAgICAgICAvL3BvaW50cy5sZW5ndGggPSBudW1Qb2ludHM7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAoaSsrIDwgbnVtUG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IHBhdGguZ2V0UG9pbnRBdChNYXRoLm1pbihvZmZzZXQsIHBhdGhMZW5ndGgpKTtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gb2Zmc2V0SW5jcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwYXRoID0gbmV3IHBhcGVyLlBhdGgocG9pbnRzKTtcclxuICAgICAgICBwYXRoLmZpbGxDb2xvciA9ICdsaWdodGdyYXknO1xyXG4gICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzYW5kd2ljaFBhdGhQcm9qZWN0aW9uKHRvcFBhdGg6IHBhcGVyLkN1cnZlbGlrZSwgYm90dG9tUGF0aDogcGFwZXIuQ3VydmVsaWtlKVxyXG4gICAgICAgIDogKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBjb25zdCB0b3BQYXRoTGVuZ3RoID0gdG9wUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgYm90dG9tUGF0aExlbmd0aCA9IGJvdHRvbVBhdGgubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbih1bml0UG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgICAgICBsZXQgdG9wUG9pbnQgPSB0b3BQYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiB0b3BQYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICAgbGV0IGJvdHRvbVBvaW50ID0gYm90dG9tUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogYm90dG9tUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGlmICh0b3BQb2ludCA9PSBudWxsIHx8IGJvdHRvbVBvaW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiY291bGQgbm90IGdldCBwcm9qZWN0ZWQgcG9pbnQgZm9yIHVuaXQgcG9pbnQgXCIgKyB1bml0UG9pbnQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdG9wUG9pbnQuYWRkKGJvdHRvbVBvaW50LnN1YnRyYWN0KHRvcFBvaW50KS5tdWx0aXBseSh1bml0UG9pbnQueSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyR3JvdXA6IHBhcGVyLkdyb3VwO1xyXG5cclxuICAgIHN0YXRpYyByZXNldE1hcmtlcnMoKXtcclxuICAgICAgICBpZihQYXBlckhlbHBlcnMubWFya2VyR3JvdXApe1xyXG4gICAgICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5vcGFjaXR5ID0gMC4yO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXJrZXJMaW5lKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCk6IHBhcGVyLkl0ZW17XHJcbiAgICAgICAgbGV0IGxpbmUgPSBwYXBlci5QYXRoLkxpbmUoYSxiKTtcclxuICAgICAgICBsaW5lLnN0cm9rZUNvbG9yID0gJ2dyZWVuJztcclxuICAgICAgICAvL2xpbmUuZGFzaEFycmF5ID0gWzUsIDVdO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChsaW5lKTtcclxuICAgICAgICByZXR1cm4gbGluZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyKHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIGxldCBtYXJrZXIgPSBwYXBlci5TaGFwZS5DaXJjbGUocG9pbnQsIDIpO1xyXG4gICAgICAgIG1hcmtlci5zdHJva2VDb2xvciA9ICdyZWQnO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChtYXJrZXIpO1xyXG4gICAgICAgIHJldHVybiBtYXJrZXI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNpbXBsaWZ5KHBhdGg6IHBhcGVyLlBhdGhJdGVtLCB0b2xlcmFuY2U/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNpbXBsaWZ5KDxwYXBlci5QYXRoSXRlbT5wLCB0b2xlcmFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKDxwYXBlci5QYXRoPnBhdGgpLnNpbXBsaWZ5KHRvbGVyYW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluZCBzZWxmIG9yIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovICAgIFxyXG4gICAgc3RhdGljIGZpbmRTZWxmT3JBbmNlc3RvcihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKXtcclxuICAgICAgICBpZihwcmVkaWNhdGUoaXRlbSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kQW5jZXN0b3IoaXRlbSwgcHJlZGljYXRlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZmluZEFuY2VzdG9yKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pe1xyXG4gICAgICAgIGlmKCFpdGVtKXtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwcmlvcjogcGFwZXIuSXRlbTtcclxuICAgICAgICBsZXQgY2hlY2tpbmcgPSBpdGVtLnBhcmVudDtcclxuICAgICAgICB3aGlsZShjaGVja2luZyAmJiBjaGVja2luZyAhPT0gcHJpb3Ipe1xyXG4gICAgICAgICAgICBpZihwcmVkaWNhdGUoY2hlY2tpbmcpKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjaGVja2luZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmlvciA9IGNoZWNraW5nO1xyXG4gICAgICAgICAgICBjaGVja2luZyA9IGNoZWNraW5nLnBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogVGhlIGNvcm5lcnMgb2YgdGhlIHJlY3QsIGNsb2Nrd2lzZSBzdGFydGluZyBmcm9tIHRvcExlZnRcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvcm5lcnMocmVjdDogcGFwZXIuUmVjdGFuZ2xlKTogcGFwZXIuUG9pbnRbXXtcclxuICAgICAgICByZXR1cm4gW3JlY3QudG9wTGVmdCwgcmVjdC50b3BSaWdodCwgcmVjdC5ib3R0b21SaWdodCwgcmVjdC5ib3R0b21MZWZ0XTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBQYXRoU2VjdGlvbiBpbXBsZW1lbnRzIHBhcGVyLkN1cnZlbGlrZSB7XHJcbiAgICBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgb2Zmc2V0OiBudW1iZXI7XHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocGF0aDogcGFwZXIuUGF0aCwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRQb2ludEF0KG9mZnNldDogbnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXRoLmdldFBvaW50QXQob2Zmc2V0ICsgdGhpcy5vZmZzZXQpO1xyXG4gICAgfVxyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwidHlwaW5ncy9wYXBlci5kLnRzXCIgLz5cclxuXHJcbmNsYXNzIFBhdGhUZXh0IGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG4gICAgXHJcbiAgICBwcml2YXRlIHBhdGg6IFBhdGhMaWtlO1xyXG4gICAgcHJpdmF0ZSBfdGV4dDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBwdWJsaWMgc3R5bGU7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGhMaWtlLCB0ZXh0Pzogc3RyaW5nLCBzdHlsZT86IGFueSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMuX3RleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXMuc3R5bGUgPSBzdHlsZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gXHJcbiAgICBnZXQgdGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXQgdGV4dCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fdGV4dCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHRleHQgPSB0aGlzLnRleHQ7XHJcbiAgICAgICAgbGV0IHBhdGggPSB0aGlzLnBhdGg7XHJcbiAgICAgICAgaWYgKHRleHQgJiYgdGV4dC5sZW5ndGggJiYgcGF0aCAmJiBwYXRoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gTWVhc3VyZSBnbHlwaHMgaW4gcGFpcnMgdG8gY2FwdHVyZSB3aGl0ZSBzcGFjZS5cclxuICAgICAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxyXG4gICAgICAgICAgICB2YXIgZ2x5cGhQYWlycyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpKzEpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gRm9yIGVhY2ggY2hhcmFjdGVyLCBmaW5kIGNlbnRlciBvZmZzZXQuXHJcbiAgICAgICAgICAgIHZhciB4T2Zmc2V0cyA9IFswXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIE1lYXN1cmUgdGhyZWUgY2hhcmFjdGVycyBhdCBhIHRpbWUgdG8gZ2V0IHRoZSBhcHByb3ByaWF0ZSBcclxuICAgICAgICAgICAgICAgIC8vICAgc3BhY2UgYmVmb3JlIGFuZCBhZnRlciB0aGUgZ2x5cGguXHJcbiAgICAgICAgICAgICAgICB2YXIgdHJpYWRUZXh0ID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSAtIDEsIGkgKyAxKSk7XHJcbiAgICAgICAgICAgICAgICB0cmlhZFRleHQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXHJcbiAgICAgICAgICAgICAgICAvLyAgIGFuZCBoYWxmIG9mIGN1cnJlbnQgZ2x5cGggcGFpci5cclxuICAgICAgICAgICAgICAgIC8vIE11c3QgYmUgcmlnaHQsIGJlY2F1c2UgaXQgd29ya3MuXHJcbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoIFxyXG4gICAgICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpIC0gMV0uYm91bmRzLndpZHRoIC8gMiBcclxuICAgICAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaV0uYm91bmRzLndpZHRoIC8gMjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gQWRkIG9mZnNldCB3aWR0aCB0byBwcmlvciBvZmZzZXQuIFxyXG4gICAgICAgICAgICAgICAgeE9mZnNldHNbaV0gPSB4T2Zmc2V0c1tpIC0gMV0gKyBvZmZzZXRXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gU2V0IHBvaW50IGZvciBlYWNoIGdseXBoIGFuZCByb3RhdGUgZ2x5cGggYW9ydW5kIHRoZSBwb2ludFxyXG4gICAgICAgICAgICBsZXQgcGF0aExlbmd0aCA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjZW50ZXJPZmZzID0geE9mZnNldHNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aExlbmd0aCA8IGNlbnRlck9mZnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjZW50ZXJPZmZzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNlbnRlck9mZnMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdseXBoUGFpcnNbaV0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXRoUG9pbnQgPSBwYXRoLmdldFBvaW50QXQoY2VudGVyT2Zmcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2x5cGhQYWlyc1tpXS5wb3NpdGlvbiA9IHBhdGhQb2ludDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFuID0gcGF0aC5nZXRUYW5nZW50QXQoY2VudGVyT2Zmcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGFuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdseXBoUGFpcnNbaV0ucm90YXRlKHRhbi5hbmdsZSwgcGF0aFBvaW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJDb3VsZCBub3QgZ2V0IHRhbmdlbnQgYXQgXCIsIGNlbnRlck9mZnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICBcclxuICAgIC8vIGNyZWF0ZSBhIFBvaW50VGV4dCBvYmplY3QgZm9yIGEgc3RyaW5nIGFuZCBhIHN0eWxlXHJcbiAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCAodGV4dCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XHJcbiAgICAgICAgcG9pbnRUZXh0LmNvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgIHBvaW50VGV4dC5qdXN0aWZpY2F0aW9uID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBsZXQgc3R5bGUgPSB0aGlzLnN0eWxlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChzdHlsZSkge1xyXG4gICAgICAgICAgICBpZiAoc3R5bGUuZm9udEZhbWlseSkgcG9pbnRUZXh0LmZvbnRGYW1pbHkgPSBzdHlsZS5mb250RmFtaWx5O1xyXG4gICAgICAgICAgICBpZiAoc3R5bGUuZm9udFNpemUpIHBvaW50VGV4dC5mb250U2l6ZSA9IHN0eWxlLmZvbnRTaXplO1xyXG4gICAgICAgICAgICBpZiAoc3R5bGUuZm9udFdpZWdodCkgcG9pbnRUZXh0LmZvbnRXZWlnaHQgPSBzdHlsZS5mb250V2VpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB2YXIgcmVjdCA9IHBhcGVyLlBhdGguUmVjdGFuZ2xlKHBvaW50VGV4dC5ib3VuZHMpO1xyXG4gICAgICAgIHJlY3QuZmlsbENvbG9yID0gJ2xpZ2h0Z3JheSc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgZ3JvdXAuc3R5bGUgPSBzdHlsZTtcclxuICAgICAgICBncm91cC5hZGRDaGlsZChwb2ludFRleHQpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENoaWxkKGdyb3VwKTtcclxuICAgICAgICByZXR1cm4gZ3JvdXA7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuXHJcbiIsIlxyXG5jbGFzcyBQYXRoVHJhbnNmb3JtIHtcclxuICAgIHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICB0aGlzLnBvaW50VHJhbnNmb3JtID0gcG9pbnRUcmFuc2Zvcm07XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUG9pbnQocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50VHJhbnNmb3JtKHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1QYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSkge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1Db21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1QYXRoKHBhdGg6IHBhcGVyLlBhdGgpIHtcclxuICAgICAgICBmb3IgKGxldCBzZWdtZW50IG9mIHBhdGguc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgbGV0IG9yaWdQb2ludCA9IHNlZ21lbnQucG9pbnQ7XHJcbiAgICAgICAgICAgIGxldCBuZXdQb2ludCA9IHRoaXMudHJhbnNmb3JtUG9pbnQoc2VnbWVudC5wb2ludCk7XHJcbiAgICAgICAgICAgIG9yaWdQb2ludC54ID0gbmV3UG9pbnQueDtcclxuICAgICAgICAgICAgb3JpZ1BvaW50LnkgPSBuZXdQb2ludC55O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4iLCJcclxuY2xhc3MgU2VnbWVudEhhbmRsZSBleHRlbmRzIHBhcGVyLlNoYXBlIHtcclxuIFxyXG4gICAgc2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgIG9uQ2hhbmdlQ29tcGxldGU6IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9zbW9vdGhlZDogYm9vbGVhbjtcclxuIFxyXG4gICAgY29uc3RydWN0b3Ioc2VnbWVudDogcGFwZXIuU2VnbWVudCwgcmFkaXVzPzogbnVtYmVyKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2VnbWVudCA9IHNlZ21lbnQ7XHJcblxyXG4gICAgICAgIGxldCBzZWxmID0gPGFueT50aGlzO1xyXG4gICAgICAgIHNlbGYuX3R5cGUgPSAnY2lyY2xlJztcclxuICAgICAgICBzZWxmLl9yYWRpdXMgPSA3O1xyXG4gICAgICAgIHNlbGYuX3NpemUgPSBuZXcgcGFwZXIuU2l6ZShzZWxmLl9yYWRpdXMgKiAyKTtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShzZWdtZW50LnBvaW50KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0cm9rZVdpZHRoID0gMjtcclxuICAgICAgICB0aGlzLnN0cm9rZUNvbG9yID0gJ2JsdWUnO1xyXG4gICAgICAgIHRoaXMuZmlsbENvbG9yID0gJ3doaXRlJztcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAwLjU7IFxyXG5cclxuICAgICAgICB0aGlzLm1vdXNlQmVoYXZpb3IgPSA8TW91c2VCZWhhdmlvcj57XHJcbiAgICAgICAgICAgIG9uRHJhZ01vdmU6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdQb3MgPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zO1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5wb2ludCA9IG5ld1BvcztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnRW5kOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9zbW9vdGhlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkNoYW5nZUNvbXBsZXRlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbmdlQ29tcGxldGUoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkNsaWNrOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNtb290aGVkID0gIXRoaXMuc21vb3RoZWQ7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uQ2hhbmdlQ29tcGxldGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DaGFuZ2VDb21wbGV0ZShldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBzbW9vdGhlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc21vb3RoZWQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldCBzbW9vdGhlZCh2YWx1ZTogYm9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5fc21vb3RoZWQgPSB2YWx1ZTtcclxuICAgICAgICBcclxuICAgICAgICBpZih2YWx1ZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc21vb3RoaW5nJyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnQuaGFuZGxlSW4gPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnQuaGFuZGxlT3V0ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFN0cmV0Y2h5UGF0aCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuICAgIHNvdXJjZVBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIGRpc3BsYXlQYXRoOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBjb3JuZXJzOiBwYXBlci5TZWdtZW50W107XHJcbiAgICBvdXRsaW5lOiBwYXBlci5QYXRoO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEZvciByZWJ1aWxkaW5nIHRoZSBtaWRwb2ludCBoYW5kbGVzXHJcbiAgICAgKiBhcyBvdXRsaW5lIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIG1pZHBvaW50R3JvdXA6IHBhcGVyLkdyb3VwO1xyXG4gICAgc2VnbWVudEdyb3VwOiBwYXBlci5Hcm91cDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VQYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnNvdXJjZVBhdGggPSBzb3VyY2VQYXRoO1xyXG4gICAgICAgIHRoaXMuc291cmNlUGF0aC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlT3V0bGluZSgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlU2VnbWVudE1hcmtlcnMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1pZHBpb250TWFya2VycygpO1xyXG5cclxuICAgICAgICB0aGlzLm1vdXNlQmVoYXZpb3IgPSB7XHJcbiAgICAgICAgICAgIG9uRHJhZ01vdmU6IGV2ZW50ID0+IHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSksXHJcbiAgICAgICAgICAgIG9uT3ZlclN0YXJ0OiAoKSA9PiB0aGlzLnNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkodHJ1ZSksXHJcbiAgICAgICAgICAgIG9uT3ZlckVuZDogKCkgPT4gdGhpcy5zZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KGZhbHNlKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KHZhbHVlOiBib29sZWFuKXtcclxuICAgICAgICB0aGlzLnNlZ21lbnRHcm91cC52aXNpYmxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwLnZpc2libGUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm91dGxpbmUuc3Ryb2tlQ29sb3IgPSB2YWx1ZSA/ICdsaWdodGdyYXknIDogbnVsbDsgXHJcbiAgICB9XHJcblxyXG4gICAgYXJyYW5nZUNvbnRlbnRzKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWlkcGlvbnRNYXJrZXJzKCk7XHJcbiAgICAgICAgdGhpcy5hcnJhbmdlUGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFycmFuZ2VQYXRoKCkge1xyXG4gICAgICAgIGxldCBvcnRoT3JpZ2luID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgIGxldCBvcnRoV2lkdGggPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzLndpZHRoO1xyXG4gICAgICAgIGxldCBvcnRoSGVpZ2h0ID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IHNpZGVzID0gdGhpcy5nZXRPdXRsaW5lU2lkZXMoKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdG9wID0gc2lkZXNbMF07XHJcbiAgICAgICAgbGV0IGJvdHRvbSA9IHNpZGVzWzJdO1xyXG4gICAgICAgIGJvdHRvbS5yZXZlcnNlKCk7XHJcbiAgICAgICAgbGV0IHByb2plY3Rpb24gPSBQYXBlckhlbHBlcnMuc2FuZHdpY2hQYXRoUHJvamVjdGlvbih0b3AsIGJvdHRvbSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9sZXQgcHJvamVjdGlvbiA9IFBhcGVySGVscGVycy5ib3VuZHNQYXRoUHJvamVjdGlvbihzaWRlcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlbGF0aXZlID0gcG9pbnQuc3VidHJhY3Qob3J0aE9yaWdpbik7XHJcbiAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpdmUueCAvIG9ydGhXaWR0aCxcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnkgLyBvcnRoSGVpZ2h0KTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0ZWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgc2lkZSBvZiBzaWRlcyl7XHJcbiAgICAgICAgICAgIHNpZGUucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBuZXdQYXRoID0gPHBhcGVyLkNvbXBvdW5kUGF0aD50aGlzLnNvdXJjZVBhdGguY2xvbmUoKTtcclxuICAgICAgICBuZXdQYXRoLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIG5ld1BhdGguZmlsbENvbG9yID0gJyM3RDU5NjUnO1xyXG5cclxuICAgICAgICB0cmFuc2Zvcm0udHJhbnNmb3JtUGF0aEl0ZW0obmV3UGF0aCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc3BsYXlQYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheVBhdGgucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BsYXlQYXRoID0gbmV3UGF0aDtcclxuICAgICAgICB0aGlzLmluc2VydENoaWxkKDEsIG5ld1BhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0T3V0bGluZVNpZGVzKCk6IHBhcGVyLlBhdGhbXSB7XHJcbiAgICAgICAgbGV0IHNpZGVzOiBwYXBlci5QYXRoW10gPSBbXTtcclxuICAgICAgICBsZXQgc2VnbWVudEdyb3VwOiBwYXBlci5TZWdtZW50W10gPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY29ybmVyUG9pbnRzID0gdGhpcy5jb3JuZXJzLm1hcChjID0+IGMucG9pbnQpO1xyXG4gICAgICAgIGxldCBmaXJzdCA9IGNvcm5lclBvaW50cy5zaGlmdCgpOyBcclxuICAgICAgICBjb3JuZXJQb2ludHMucHVzaChmaXJzdCk7XHJcblxyXG4gICAgICAgIGxldCB0YXJnZXRDb3JuZXIgPSBjb3JuZXJQb2ludHMuc2hpZnQoKTtcclxuICAgICAgICBsZXQgc2VnbWVudExpc3QgPSB0aGlzLm91dGxpbmUuc2VnbWVudHMubWFwKHggPT4geCk7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIHNlZ21lbnRMaXN0LnB1c2goc2VnbWVudExpc3RbMF0pO1xyXG4gICAgICAgIGZvcihsZXQgc2VnbWVudCBvZiBzZWdtZW50TGlzdCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzZWdtZW50R3JvdXAucHVzaChzZWdtZW50KTtcclxuICAgIFxyXG4gICAgICAgICAgICBpZih0YXJnZXRDb3JuZXIuaXNDbG9zZShzZWdtZW50LnBvaW50LCBwYXBlci5OdW1lcmljYWwuRVBTSUxPTikpIHtcclxuICAgICAgICAgICAgICAgIC8vIGZpbmlzaCBwYXRoXHJcbiAgICAgICAgICAgICAgICBzaWRlcy5wdXNoKG5ldyBwYXBlci5QYXRoKHNlZ21lbnRHcm91cCkpO1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudEdyb3VwID0gW3NlZ21lbnRdO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Q29ybmVyID0gY29ybmVyUG9pbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHNpZGVzLmxlbmd0aCAhPT0gNCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3NpZGVzJywgc2lkZXMpO1xyXG4gICAgICAgICAgICB0aHJvdyAnZmFpbGVkIHRvIGdldCBzaWRlcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzaWRlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjcmVhdGVPdXRsaW5lKCkge1xyXG4gICAgICAgIGxldCBib3VuZHMgPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzO1xyXG4gICAgICAgIGxldCBvdXRsaW5lID0gbmV3IHBhcGVyLlBhdGgoXHJcbiAgICAgICAgICAgIFBhcGVySGVscGVycy5jb3JuZXJzKHRoaXMuc291cmNlUGF0aC5ib3VuZHMpKTtcclxuICAgICAgICBvdXRsaW5lLmZpbGxDb2xvciA9IG5ldyBwYXBlci5Db2xvcih3aW5kb3cuYXBwLmNhbnZhc0NvbG9yKTtcclxuICAgICAgICBvdXRsaW5lLmNsb3NlZCA9IHRydWU7XHJcbiAgICAgICAgb3V0bGluZS5kYXNoQXJyYXkgPSBbNSwgNV07XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lID0gb3V0bGluZTtcclxuXHJcbiAgICAgICAgLy8gdHJhY2sgY29ybmVycyBzbyB3ZSBrbm93IGhvdyB0byBhcnJhbmdlIHRoZSB0ZXh0XHJcbiAgICAgICAgdGhpcy5jb3JuZXJzID0gb3V0bGluZS5zZWdtZW50cy5tYXAocyA9PiBzKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChvdXRsaW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNlZ21lbnRNYXJrZXJzKCkge1xyXG4gICAgICAgIGxldCBib3VuZHMgPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzO1xyXG4gICAgICAgIHRoaXMuc2VnbWVudEdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiB0aGlzLm91dGxpbmUuc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgbGV0IGhhbmRsZSA9IG5ldyBTZWdtZW50SGFuZGxlKHNlZ21lbnQpO1xyXG4gICAgICAgICAgICBoYW5kbGUub25DaGFuZ2VDb21wbGV0ZSA9ICgpID0+IHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudEdyb3VwLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5zZWdtZW50R3JvdXApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlTWlkcGlvbnRNYXJrZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMubWlkcG9pbnRHcm91cCl7XHJcbiAgICAgICAgICAgIHRoaXMubWlkcG9pbnRHcm91cC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lLmN1cnZlcy5mb3JFYWNoKGN1cnZlID0+IHtcclxuICAgICAgICAgICAgLy8gc2tpcCBsZWZ0IGFuZCByaWdodCBzaWRlc1xyXG4gICAgICAgICAgICBpZihcclxuICAgICAgICAgICAgICAgIGN1cnZlLnNlZ21lbnQxID09PSB0aGlzLmNvcm5lcnNbMV1cclxuICAgICAgICAgICAgICAgIHx8IGN1cnZlLnNlZ21lbnQxID09PSB0aGlzLmNvcm5lcnNbM11cclxuICAgICAgICAgICAgICAgIC8vIGN1cnZlLnNlZ21lbnQxLnBvaW50LmlzQ2xvc2UodGhpcy5jb3JuZXJzWzFdLnBvaW50LCBOdW1lcmljYWwuRVBTSUxPTilcclxuICAgICAgICAgICAgICAgIC8vIHx8IGN1cnZlLnNlZ21lbnQxLnBvaW50LmlzQ2xvc2UodGhpcy5jb3JuZXJzWzNdLnBvaW50LCBOdW1lcmljYWwuRVBTSUxPTilcclxuICAgICAgICAgICAgICAgICl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgaGFuZGxlID0gbmV3IEN1cnZlU3BsaXR0ZXJIYW5kbGUoY3VydmUpO1xyXG4gICAgICAgICAgICBoYW5kbGUub25EcmFnRW5kID0gKG5ld1NlZ21lbnQsIGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3SGFuZGxlID0gbmV3IFNlZ21lbnRIYW5kbGUobmV3U2VnbWVudCk7XHJcbiAgICAgICAgICAgICAgICBuZXdIYW5kbGUub25DaGFuZ2VDb21wbGV0ZSA9ICgpID0+IHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKG5ld0hhbmRsZSk7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGUucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAuYWRkQ2hpbGQoaGFuZGxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMubWlkcG9pbnRHcm91cCk7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFN0cmV0Y2h5VGV4dCBleHRlbmRzIFN0cmV0Y2h5UGF0aCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGV4dDogc3RyaW5nLCBmb250OiBvcGVudHlwZS5Gb250LCBmb250U2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IG9wZW5UeXBlUGF0aCA9IGZvbnQuZ2V0UGF0aCh0ZXh0LCAwLCAwLCBmb250U2l6ZSk7XHJcbiAgICAgICAgbGV0IHRleHRQYXRoID0gUGFwZXJIZWxwZXJzLmltcG9ydE9wZW5UeXBlUGF0aChvcGVuVHlwZVBhdGgpO1xyXG5cclxuICAgICAgICB0ZXh0UGF0aC5maWxsQ29sb3IgPSAncmVkJztcclxuXHJcbiAgICAgICAgc3VwZXIodGV4dFBhdGgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgcGFwZXIuUG9pbnQodGhpcy5zdHJva2VCb3VuZHMud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3Ryb2tlQm91bmRzLmhlaWdodCAvIDIpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG4vKipcclxuICogTWVhc3VyZXMgb2Zmc2V0cyBvZiB0ZXh0IGdseXBocy5cclxuICovXHJcbmNsYXNzIFRleHRSdWxlciB7XHJcbiAgICBcclxuICAgIGZvbnRGYW1pbHk6IHN0cmluZztcclxuICAgIGZvbnRXZWlnaHQ6IG51bWJlcjtcclxuICAgIGZvbnRTaXplOiBudW1iZXI7XHJcbiAgICBcclxuICAgIHByaXZhdGUgY3JlYXRlUG9pbnRUZXh0ICh0ZXh0KTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgdmFyIHBvaW50VGV4dCA9IG5ldyBwYXBlci5Qb2ludFRleHQoKTtcclxuICAgICAgICBwb2ludFRleHQuY29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgcG9pbnRUZXh0Lmp1c3RpZmljYXRpb24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgIGlmKHRoaXMuZm9udEZhbWlseSl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250RmFtaWx5ID0gdGhpcy5mb250RmFtaWx5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmZvbnRXZWlnaHQpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udFdlaWdodCA9IHRoaXMuZm9udFdlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5mb250U2l6ZSl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250U2l6ZSA9IHRoaXMuZm9udFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBwb2ludFRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGV4dE9mZnNldHModGV4dCl7XHJcbiAgICAgICAgLy8gTWVhc3VyZSBnbHlwaHMgaW4gcGFpcnMgdG8gY2FwdHVyZSB3aGl0ZSBzcGFjZS5cclxuICAgICAgICAvLyBQYWlycyBhcmUgY2hhcmFjdGVycyBpIGFuZCBpKzEuXHJcbiAgICAgICAgdmFyIGdseXBoUGFpcnMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZ2x5cGhQYWlyc1tpXSA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGksIGkrMSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBGb3IgZWFjaCBjaGFyYWN0ZXIsIGZpbmQgY2VudGVyIG9mZnNldC5cclxuICAgICAgICB2YXIgeE9mZnNldHMgPSBbMF07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBNZWFzdXJlIHRocmVlIGNoYXJhY3RlcnMgYXQgYSB0aW1lIHRvIGdldCB0aGUgYXBwcm9wcmlhdGUgXHJcbiAgICAgICAgICAgIC8vICAgc3BhY2UgYmVmb3JlIGFuZCBhZnRlciB0aGUgZ2x5cGguXHJcbiAgICAgICAgICAgIHZhciB0cmlhZFRleHQgPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpIC0gMSwgaSArIDEpKTtcclxuICAgICAgICAgICAgdHJpYWRUZXh0LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gU3VidHJhY3Qgb3V0IGhhbGYgb2YgcHJpb3IgZ2x5cGggcGFpciBcclxuICAgICAgICAgICAgLy8gICBhbmQgaGFsZiBvZiBjdXJyZW50IGdseXBoIHBhaXIuXHJcbiAgICAgICAgICAgIC8vIE11c3QgYmUgcmlnaHQsIGJlY2F1c2UgaXQgd29ya3MuXHJcbiAgICAgICAgICAgIGxldCBvZmZzZXRXaWR0aCA9IHRyaWFkVGV4dC5ib3VuZHMud2lkdGggXHJcbiAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaSAtIDFdLmJvdW5kcy53aWR0aCAvIDIgXHJcbiAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaV0uYm91bmRzLndpZHRoIC8gMjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEFkZCBvZmZzZXQgd2lkdGggdG8gcHJpb3Igb2Zmc2V0LiBcclxuICAgICAgICAgICAgeE9mZnNldHNbaV0gPSB4T2Zmc2V0c1tpIC0gMV0gKyBvZmZzZXRXaWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBnbHlwaFBhaXIgb2YgZ2x5cGhQYWlycyl7XHJcbiAgICAgICAgICAgIGdseXBoUGFpci5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHhPZmZzZXRzO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==