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
        this.canvasColor = '#F5F6CE';
        var canvas = document.getElementById('mainCanvas');
        paper.setup(canvas);
        this.paper = paper;
        new FontLoader(Roboto500, function (font) {
            _this.font = font;
            _this.warp = new TextWarpController(_this);
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
// <reference path="LinkedPaths.ts" />
window.textTrace = function () {
    console.log('textTrace started');
    var ps23 = "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He leads me in paths of righteousness for his name's sake. Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me. You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows. Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the Lord forever.";
    var drawPaths = new LinkedPathGroup();
    var textSize = 64;
    var textPath = new PathText(drawPaths, ps23, { fontSize: textSize });
    var startTime = new Date();
    var currentPath;
    function startPath(point) {
        if (currentPath) {
            finishPath();
        }
        currentPath = new paper.Path({ strokeColor: 'lightgray', strokeWidth: textSize });
        drawPaths.addChild(currentPath);
        currentPath.add(point);
    }
    function appendPath(point) {
        if (currentPath) {
            currentPath.add(point);
        }
    }
    function finishPath() {
        currentPath.simplify(textSize / 2);
        textPath.update();
        currentPath.visible = false;
        currentPath = null;
    }
    var tool = new paper.Tool();
    tool.onMouseDrag = function (event) {
        var point = event.middlePoint;
        if (!currentPath) {
            startPath(point);
            return;
        }
        // No: need to check if same segment!
        // let nearest = drawPaths.getNearestPoint(point);
        // if(nearest) {
        //     let nearestDist = nearest.getDistance(point);
        //     if(nearest && nearestDist <= textSize){
        //         finishPath();
        //         return;        
        //     }
        // }
        appendPath(point);
    };
    tool.onMouseUp = function (event) {
        finishPath();
    };
};
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
                var stretchy = new StretchyText(block.text, this.app.font, 64);
                //stretchy.translate(new paper.Point(30, 30));
                block.item = stretchy;
            }
        }
    };
    TextWarpController.prototype.fiddlesticks = function () {
        var _this = this;
        var sampleText = "Fiddlesticks";
        var lineDraw = new LineDrawTool();
        var prevPath;
        lineDraw.onPathFinished = function (path) {
            path.flatten(40);
            path.smooth();
            if (prevPath) {
                var layout = new VerticalBoundsTextLayout(path, prevPath);
                layout.layout(sampleText, _this.app.font, function (item) { return _this.app.paper.view.draw(); });
            }
            prevPath = path;
        };
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
var BottomTextLayout = (function () {
    function BottomTextLayout(bottom) {
        this.fontSize = 100;
        this.bottom = bottom;
    }
    BottomTextLayout.prototype.layout = function (text, onComplete) {
        var _this = this;
        new FontLoader(AmaticUrl, function (font) {
            var letterGroup = new paper.Group();
            var letterPaths = font.getPaths(text, 0, 0, _this.fontSize)
                .map(function (p) {
                var path = PaperHelpers.importOpenTypePath(p);
                letterGroup.addChild(path);
                return path;
            });
            var textOrigin = letterGroup.bounds.bottomLeft;
            var linearLength = letterGroup.bounds.width;
            var layoutPathLength = _this.bottom.length;
            var offsetScaling = layoutPathLength / linearLength;
            var idx = 0;
            for (var _i = 0; _i < letterPaths.length; _i++) {
                var letterPath = letterPaths[_i];
                var letterOffset = (letterPath.bounds.left - textOrigin.x) * offsetScaling;
                var bottomLeftPrime = _this.bottom.getPointAt(letterOffset);
                var bottomRightPrime = _this.bottom.getPointAt(Math.min(layoutPathLength, letterOffset + letterPath.bounds.width * offsetScaling));
                var bottomVectorPrime = bottomRightPrime.subtract(bottomLeftPrime);
                var rotateAngle = new paper.Point(1, 0).getDirectedAngle(bottomRightPrime.subtract(bottomLeftPrime));
                // reposition using bottomLeft
                letterPath.position = bottomLeftPrime
                    .add(letterPath.bounds.center
                    .subtract(letterPath.bounds.bottomLeft));
                letterPath.rotate(rotateAngle, bottomLeftPrime);
                letterPath.scale(offsetScaling, bottomLeftPrime);
                idx++;
            }
            if (onComplete) {
                onComplete(letterGroup);
            }
        });
    };
    return BottomTextLayout;
})();
var PathOffsetScaling = (function () {
    function PathOffsetScaling(fromLength, to) {
        this.to = to;
        this.scale = to.length / fromLength;
    }
    PathOffsetScaling.prototype.getToPointAt = function (fromPathOffset) {
        var toOffset = Math.min(this.to.length, fromPathOffset * this.scale);
        return this.to.getPointAt(toOffset);
    };
    return PathOffsetScaling;
})();
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Handle that sits on midpoint of curve
 * which will split the curve when dragged.
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
        this.dragBehavior = {
            onDragStart: function (event) {
                newSegment = new paper.Segment(_this.position);
                curve.path.insert(curve.index + 1, newSegment);
                newSegment.smooth();
            },
            onDrag: function (event) {
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
// <reference path="typings/paper.d.ts" />
var LineDrawTool = (function () {
    function LineDrawTool() {
        var _this = this;
        this.group = new paper.Group();
        var tool = new paper.Tool();
        tool.onMouseDrag = function (event) {
            var point = event.middlePoint;
            if (!_this.currentPath) {
                _this.startPath(point);
                return;
            }
            _this.appendPath(point);
        };
        tool.onMouseUp = function (event) {
            _this.finishPath();
        };
    }
    LineDrawTool.prototype.startPath = function (point) {
        if (this.currentPath) {
            this.finishPath();
        }
        this.currentPath = new paper.Path({ strokeColor: 'lightgray', strokeWidth: 2 });
        this.group.addChild(this.currentPath);
        this.currentPath.add(point);
    };
    LineDrawTool.prototype.appendPath = function (point) {
        if (this.currentPath) {
            this.currentPath.add(point);
        }
    };
    LineDrawTool.prototype.finishPath = function () {
        if (this.currentPath) {
            this.currentPath.simplify(5);
            var path = this.currentPath;
            this.currentPath = null;
            if (this.onPathFinished) {
                this.onPathFinished.call(this, path);
            }
        }
    };
    return LineDrawTool;
})();
// <reference path="typings/paper.d.ts" />
var LinkedPathGroup = (function (_super) {
    __extends(LinkedPathGroup, _super);
    function LinkedPathGroup() {
        _super.apply(this, arguments);
    }
    LinkedPathGroup.prototype.addChild = function (path) {
        return _super.prototype.addChild.call(this, path);
    };
    Object.defineProperty(LinkedPathGroup.prototype, "length", {
        get: function () {
            return this.children.reduce(function (a, b) { return a + b.length; }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkedPathGroup.prototype, "paths", {
        get: function () {
            return this.children;
        },
        enumerable: true,
        configurable: true
    });
    LinkedPathGroup.prototype.getLocationAt = function (offset, isParameter) {
        var path = null;
        for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
            path = _a[_i];
            var len = path.length;
            if (len >= offset) {
                break;
            }
            offset -= len;
        }
        return path.getLocationAt(offset, isParameter);
    };
    LinkedPathGroup.prototype.getPointAt = function (offset, isParameter) {
        var path = null;
        for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
            path = _a[_i];
            var len = path.length;
            if (len >= offset) {
                break;
            }
            offset -= len;
        }
        return path.getPointAt(offset, isParameter);
    };
    LinkedPathGroup.prototype.getTangentAt = function (offset, isPatameter) {
        var path = null;
        for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
            path = _a[_i];
            var len = path.length;
            if (len >= offset) {
                break;
            }
            offset -= len;
        }
        return path.getTangentAt(offset, isPatameter);
    };
    LinkedPathGroup.prototype.getNearestPoint = function (point) {
        var nearestAgg;
        var distAgg;
        for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
            var path = _a[_i];
            if (path.segments.length < 2) {
                continue;
            }
            var nearest = path.getNearestPoint(point);
            var dist = nearest.getDistance(point);
            if (!nearestAgg || dist < distAgg) {
                nearestAgg = nearest;
                distAgg = dist;
            }
        }
        return nearestAgg;
    };
    return LinkedPathGroup;
})(paper.Group);
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
            _this.action = null;
            var hitResult = paper.project.hitTest(event.point, _this.hitOptions);
            if (hitResult && hitResult.item) {
                var draggable = _this.findDraggableUpward(hitResult.item);
                if (draggable) {
                    _this.action = {
                        item: draggable
                    };
                }
            }
        };
        this.onMouseMove = function (event) {
        };
        this.onMouseDrag = function (event) {
            if (_this.action) {
                if (!_this.action.dragged) {
                    _this.action.dragged = true;
                    if (_this.action.item.dragBehavior.onDragStart) {
                        _this.action.item.dragBehavior.onDragStart.call(_this.action.item, _this.action.startEvent);
                    }
                }
                if (_this.action.item.dragBehavior.onDrag) {
                    _this.action.item.dragBehavior.onDrag.call(_this.action.item, event);
                }
            }
        };
        this.onMouseUp = function (event) {
            if (_this.action) {
                var action = _this.action;
                _this.action = null;
                if (action.dragged) {
                    // drag
                    if (action.item.dragBehavior.onDragEnd) {
                        action.item.dragBehavior.onDragEnd.call(action.item, event);
                    }
                }
                else {
                    // click
                    if (action.item.dragBehavior.onClick) {
                        action.item.dragBehavior.onClick.call(action.item, event);
                    }
                }
            }
        };
    }
    MouseBehaviorTool.prototype.findDraggableUpward = function (item) {
        while (!item.dragBehavior && item.parent && item.parent.className != 'Layer') {
            item = item.parent;
        }
        return item.dragBehavior
            ? item
            : null;
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
    PaperHelpers.pathProjection = function (topPath, bottomPath) {
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
        self._radius = 5;
        self._size = new paper.Size(self._radius * 2);
        this.translate(segment.point);
        this.strokeWidth = 2;
        this.strokeColor = 'blue';
        this.fillColor = 'white';
        this.opacity = 0.5;
        this.dragBehavior = {
            onDrag: function (event) {
                var newPos = _this.position.add(event.delta);
                _this.position = newPos;
                segment.point = newPos;
            },
            onDragEnd: function (event) {
                if (_this.onDragEnd) {
                    _this.onDragEnd(event);
                }
            }
        };
    }
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
        this.dragBehavior = {
            onDrag: function (event) { return _this.position = _this.position.add(event.delta); }
        };
        this.arrangeContents();
    }
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
        var projection = PaperHelpers.pathProjection(top, bottom);
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
        newPath.fillColor = 'lightblue';
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
            if (targetCorner.getDistance(segment.point) < 0.0001) {
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
        this.outline = new paper.Path([
            new paper.Segment(bounds.topLeft),
            new paper.Segment(bounds.topRight),
            new paper.Segment(bounds.bottomRight),
            new paper.Segment(bounds.bottomLeft)
        ]);
        this.outline.closed = true;
        this.outline.fillColor = new paper.Color(window.app.canvasColor); //.add(0.04);
        this.outline.strokeColor = 'lightgray';
        this.outline.dashArray = [5, 5];
        // track corners so we know how to arrange the text
        this.corners = this.outline.segments.map(function (s) { return s; });
        this.addChild(this.outline);
    };
    StretchyPath.prototype.createSegmentMarkers = function () {
        var _this = this;
        var bounds = this.sourcePath.bounds;
        for (var _i = 0, _a = this.outline.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            var handle = new SegmentHandle(segment);
            handle.onDragEnd = function () { return _this.arrangeContents(); };
            this.addChild(handle);
        }
    };
    StretchyPath.prototype.updateMidpiontMarkers = function () {
        var _this = this;
        if (this.midpointGroup) {
            this.midpointGroup.remove();
        }
        this.midpointGroup = new paper.Group();
        this.outline.curves.forEach(function (curve) {
            var handle = new CurveSplitterHandle(curve);
            handle.onDragEnd = function (newSegment, event) {
                var newHandle = new SegmentHandle(newSegment);
                newHandle.onDragEnd = function () { return _this.arrangeContents(); };
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
var VerticalBoundsTextLayout = (function () {
    function VerticalBoundsTextLayout(top, bottom) {
        this.letterResolution = 100;
        this.smoothTolerance = 0.25;
        this.fontSize = 64;
        this.top = top;
        this.bottom = bottom;
    }
    VerticalBoundsTextLayout.prototype.layout = function (text, font, onComplete) {
        var letterGroup = new paper.Group();
        var letterPaths = font.getPaths(text, 0, 0, this.fontSize)
            .map(function (p) {
            var path = PaperHelpers.importOpenTypePath(p);
            letterGroup.addChild(path);
            return path;
        });
        var orthOrigin = letterGroup.bounds.topLeft;
        var orthWidth = letterGroup.bounds.width;
        var orthHeight = letterGroup.bounds.height;
        var projection = PaperHelpers.pathProjection(this.top, this.bottom);
        var transform = new PathTransform(function (point) {
            var relative = point.subtract(orthOrigin);
            var unit = new paper.Point(relative.x / orthWidth, relative.y / orthHeight);
            var projected = projection(unit);
            return projected;
        });
        var finalGroup = new paper.Group();
        for (var _i = 0; _i < letterPaths.length; _i++) {
            var letterPath = letterPaths[_i];
            var letterOutline = PaperHelpers.tracePathItem(letterPath, this.letterResolution);
            letterPath.remove();
            transform.transformPathItem(letterOutline);
            PaperHelpers.simplify(letterOutline, this.smoothTolerance);
            finalGroup.addChild(letterOutline);
        }
        letterGroup.remove();
        if (onComplete) {
            onComplete(finalGroup);
        }
    };
    return VerticalBoundsTextLayout;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6InNyYy8iLCJzb3VyY2VzIjpbImFwcC50cyIsImFwcC9BcHBDb250cm9sbGVyLnRzIiwiYXBwL0ZvbnRMb2FkZXIudHMiLCJhcHAvSGVscGVycy50cyIsImFwcC9UZXh0VHJhY2VDb250cm9sbGVyLnRzIiwiYXBwL1RleHRXYXJwQ29udHJvbGxlci50cyIsIm1hdGgvUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHMiLCJwYXBlci9Cb3R0b21UZXh0TGF5b3V0LnRzIiwicGFwZXIvQ3VydmVTcGxpdHRlckhhbmRsZS50cyIsInBhcGVyL0xpbmVEcmF3VG9vbC50cyIsInBhcGVyL0xpbmtlZFBhdGhHcm91cC50cyIsInBhcGVyL01vdXNlQmVoYXZpb3JUb29sLnRzIiwicGFwZXIvUGFwZXJIZWxwZXJzLnRzIiwicGFwZXIvUGF0aFNlY3Rpb24udHMiLCJwYXBlci9QYXRoVGV4dC50cyIsInBhcGVyL1BhdGhUcmFuc2Zvcm0udHMiLCJwYXBlci9TZWdtZW50SGFuZGxlLnRzIiwicGFwZXIvU3RyZXRjaHlQYXRoLnRzIiwicGFwZXIvU3RyZXRjaHlUZXh0LnRzIiwicGFwZXIvVGV4dFJ1bGVyLnRzIiwicGFwZXIvVmVydGljYWxCb3VuZHNUZXh0TGF5b3V0LnRzIl0sIm5hbWVzIjpbIkFwcENvbnRyb2xsZXIiLCJBcHBDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQXBwQ29udHJvbGxlci5hZGRUZXh0IiwiRm9udExvYWRlciIsIkZvbnRMb2FkZXIuY29uc3RydWN0b3IiLCJuZXdpZCIsInN0YXJ0UGF0aCIsImFwcGVuZFBhdGgiLCJmaW5pc2hQYXRoIiwiVGV4dFdhcnBDb250cm9sbGVyIiwiVGV4dFdhcnBDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiVGV4dFdhcnBDb250cm9sbGVyLnVwZGF0ZSIsIlRleHRXYXJwQ29udHJvbGxlci5maWRkbGVzdGlja3MiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybSIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtLmNvbnN0cnVjdG9yIiwiUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHJhbnNmb3JtUG9pbnQiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS5jcmVhdGVNYXRyaXgiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS5tdWx0aXBseSIsIlF1YWQiLCJRdWFkLmNvbnN0cnVjdG9yIiwiUXVhZC5mcm9tUmVjdGFuZ2xlIiwiUXVhZC5mcm9tQ29vcmRzIiwiUXVhZC5hc0Nvb3JkcyIsIkJvdHRvbVRleHRMYXlvdXQiLCJCb3R0b21UZXh0TGF5b3V0LmNvbnN0cnVjdG9yIiwiQm90dG9tVGV4dExheW91dC5sYXlvdXQiLCJQYXRoT2Zmc2V0U2NhbGluZyIsIlBhdGhPZmZzZXRTY2FsaW5nLmNvbnN0cnVjdG9yIiwiUGF0aE9mZnNldFNjYWxpbmcuZ2V0VG9Qb2ludEF0IiwiQ3VydmVTcGxpdHRlckhhbmRsZSIsIkN1cnZlU3BsaXR0ZXJIYW5kbGUuY29uc3RydWN0b3IiLCJMaW5lRHJhd1Rvb2wiLCJMaW5lRHJhd1Rvb2wuY29uc3RydWN0b3IiLCJMaW5lRHJhd1Rvb2wuc3RhcnRQYXRoIiwiTGluZURyYXdUb29sLmFwcGVuZFBhdGgiLCJMaW5lRHJhd1Rvb2wuZmluaXNoUGF0aCIsIkxpbmtlZFBhdGhHcm91cCIsIkxpbmtlZFBhdGhHcm91cC5jb25zdHJ1Y3RvciIsIkxpbmtlZFBhdGhHcm91cC5hZGRDaGlsZCIsIkxpbmtlZFBhdGhHcm91cC5sZW5ndGgiLCJMaW5rZWRQYXRoR3JvdXAucGF0aHMiLCJMaW5rZWRQYXRoR3JvdXAuZ2V0TG9jYXRpb25BdCIsIkxpbmtlZFBhdGhHcm91cC5nZXRQb2ludEF0IiwiTGlua2VkUGF0aEdyb3VwLmdldFRhbmdlbnRBdCIsIkxpbmtlZFBhdGhHcm91cC5nZXROZWFyZXN0UG9pbnQiLCJNb3VzZUJlaGF2aW9yVG9vbCIsIk1vdXNlQmVoYXZpb3JUb29sLmNvbnN0cnVjdG9yIiwiTW91c2VCZWhhdmlvclRvb2wuZmluZERyYWdnYWJsZVVwd2FyZCIsIlBhcGVySGVscGVycyIsIlBhcGVySGVscGVycy5jb25zdHJ1Y3RvciIsIlBhcGVySGVscGVycy5pbXBvcnRPcGVuVHlwZVBhdGgiLCJQYXBlckhlbHBlcnMudHJhY2VQYXRoSXRlbSIsIlBhcGVySGVscGVycy50cmFjZUNvbXBvdW5kUGF0aCIsIlBhcGVySGVscGVycy50cmFjZVBhdGgiLCJQYXBlckhlbHBlcnMucGF0aFByb2plY3Rpb24iLCJQYXBlckhlbHBlcnMuc2ltcGxpZnkiLCJQYXRoU2VjdGlvbiIsIlBhdGhTZWN0aW9uLmNvbnN0cnVjdG9yIiwiUGF0aFNlY3Rpb24uZ2V0UG9pbnRBdCIsIlBhdGhUZXh0IiwiUGF0aFRleHQuY29uc3RydWN0b3IiLCJQYXRoVGV4dC50ZXh0IiwiUGF0aFRleHQudXBkYXRlIiwiUGF0aFRleHQuY3JlYXRlUG9pbnRUZXh0IiwiUGF0aFRyYW5zZm9ybSIsIlBhdGhUcmFuc2Zvcm0uY29uc3RydWN0b3IiLCJQYXRoVHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50IiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoSXRlbSIsIlBhdGhUcmFuc2Zvcm0udHJhbnNmb3JtQ29tcG91bmRQYXRoIiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoIiwiU2VnbWVudEhhbmRsZSIsIlNlZ21lbnRIYW5kbGUuY29uc3RydWN0b3IiLCJTdHJldGNoeVBhdGgiLCJTdHJldGNoeVBhdGguY29uc3RydWN0b3IiLCJTdHJldGNoeVBhdGguYXJyYW5nZUNvbnRlbnRzIiwiU3RyZXRjaHlQYXRoLmFycmFuZ2VQYXRoIiwiU3RyZXRjaHlQYXRoLmdldE91dGxpbmVTaWRlcyIsIlN0cmV0Y2h5UGF0aC5jcmVhdGVPdXRsaW5lIiwiU3RyZXRjaHlQYXRoLmNyZWF0ZVNlZ21lbnRNYXJrZXJzIiwiU3RyZXRjaHlQYXRoLnVwZGF0ZU1pZHBpb250TWFya2VycyIsIlN0cmV0Y2h5VGV4dCIsIlN0cmV0Y2h5VGV4dC5jb25zdHJ1Y3RvciIsIlRleHRSdWxlciIsIlRleHRSdWxlci5jb25zdHJ1Y3RvciIsIlRleHRSdWxlci5jcmVhdGVQb2ludFRleHQiLCJUZXh0UnVsZXIuZ2V0VGV4dE9mZnNldHMiLCJWZXJ0aWNhbEJvdW5kc1RleHRMYXlvdXQiLCJWZXJ0aWNhbEJvdW5kc1RleHRMYXlvdXQuY29uc3RydWN0b3IiLCJWZXJ0aWNhbEJvdW5kc1RleHRMYXlvdXQubGF5b3V0Il0sIm1hcHBpbmdzIjoiQUFLQSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBRWQsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO0FBRXJDLENBQUMsQ0FBQyxDQUFDO0FDUkgsSUFBTSxTQUFTLEdBQUcsd0ZBQXdGLENBQUM7QUFDM0csSUFBTSxTQUFTLEdBQUcsa0VBQWtFLENBQUM7QUFDckYsSUFBTSxTQUFTLEdBQUcsc0JBQXNCLENBQUM7QUFFekM7SUFRSUE7UUFSSkMsaUJBa0NDQTtRQTlCR0EsZUFBVUEsR0FBZ0JBLEVBQUVBLENBQUNBO1FBRTdCQSxnQkFBV0EsR0FBR0EsU0FBU0EsQ0FBQ0E7UUFHcEJBLElBQUlBLE1BQU1BLEdBQUdBLFFBQVFBLENBQUNBLGNBQWNBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO1FBQ25EQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFvQkEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDdkNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1FBRW5CQSxJQUFJQSxVQUFVQSxDQUFDQSxTQUFTQSxFQUFFQSxVQUFBQSxJQUFJQTtZQUMxQkEsS0FBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDakJBLEtBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLGtCQUFrQkEsQ0FBQ0EsS0FBSUEsQ0FBQ0EsQ0FBQ0E7UUFDN0NBLENBQUNBLENBQUNBLENBQUNBO0lBRVBBLENBQUNBO0lBRURELCtCQUFPQSxHQUFQQTtRQUNJRSxJQUFJQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtR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R0FBR0E7WUFDZkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDOUJBLElBQUlBLFlBQVlBLEdBQUdBO1lBQ2ZBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBRTlCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxZQUFZQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUNsRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDN0NBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzNFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMvRUEsQ0FBQ0E7UUFFREEsSUFBSUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDMUJBLE1BQU1BLENBQUNBO1lBQ0hBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ25CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoQkEsQ0FBQ0EsRUFBS0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBS0EsQ0FBQ0E7WUFDbkJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUtBLENBQUNBO1NBQ3RCQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFTQSxDQUFDQTtZQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDM0MsQ0FBQyxDQUFDQSxDQUFDQTtJQUNQQSxDQUFDQTtJQUVESCwyRUFBMkVBO0lBQzNFQSxxQ0FBcUNBO0lBQ3JDQSxxQ0FBcUNBO0lBQ3JDQSxxQ0FBcUNBO0lBQ3JDQSxxQ0FBcUNBO0lBQzlCQSw2QkFBUUEsR0FBZkEsVUFBZ0JBLE1BQU1BLEVBQUVBLE1BQU1BO1FBQzFCSSxNQUFNQSxDQUFDQTtZQUNIQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFFQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvRkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0ZBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQy9GQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtTQUNsR0EsQ0FBQ0E7SUFDTkEsQ0FBQ0E7SUFDTEosMkJBQUNBO0FBQURBLENBQUNBLEFBbEVELElBa0VDO0FBRUQ7SUFNSUssY0FBWUEsQ0FBY0EsRUFBRUEsQ0FBY0EsRUFBRUEsQ0FBY0EsRUFBRUEsQ0FBY0E7UUFDdEVDLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ1hBLElBQUlBLENBQUNBLENBQUNB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V0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BCQSxLQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDdEJBLE1BQU1BLENBQUNBO1lBQ1hBLENBQUNBO1lBRURBLEtBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQzNCQSxDQUFDQSxDQUFBQTtRQUVEQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxVQUFBQSxLQUFLQTtZQUNsQkEsS0FBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDdEJBLENBQUNBLENBQUFBO0lBQ0xBLENBQUNBO0lBRURELGdDQUFTQSxHQUFUQSxVQUFVQSxLQUFLQTtRQUNYRSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuQkEsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDdEJBLENBQUNBO1FBQ0RBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLFdBQVdBLEVBQUVBLFdBQVdBLEVBQUVBLFdBQVdBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1FBQ2hGQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtRQUN0Q0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7SUFDaENBLENBQUNBO0lBRURGLGlDQUFVQSxHQUFWQSxVQUFXQSxLQUFLQTtRQUNaRyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDaENBLENBQUNBO0lBQ0xBLENBQUNBO0lBRURILGlDQUFVQSxHQUFWQTtRQUNJSSxF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QSxJQUFJQTtRQUN6QkksSUFBSUEsU0FBU0EsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0E7UUFDdENBLFNBQVNBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBO1FBQ3pCQSxTQUFTQSxDQUFDQSxhQUFhQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUNuQ0EsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFFdkJBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1lBQ1JBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLFVBQVVBLENBQUNBO2dCQUFDQSxTQUFTQSxDQUFDQSxVQUFVQSxHQUFHQSxLQUFLQSxDQUFDQSxVQUFVQSxDQUFDQTtZQUM5REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0E7Z0JBQUNBLFNBQVNBLENBQUNBLFFBQVFBLEdBQUdBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBO1lBQ3hEQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxVQUFVQSxDQUFDQTtnQkFBQ0EsU0FBU0EsQ0FBQ0EsVUFBVUEsR0FBR0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDbEVBLENBQUNBO1FBRURBLElBQUlBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQ2xEQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxXQUFXQSxDQUFDQTtRQUU3QkEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDOUJBLEtBQUtBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3BCQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUUxQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0Es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ZXI7XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkgeyAgXHJcbiAgICBcclxuICAgIHdpbmRvdy5hcHAgPSBuZXcgQXBwQ29udHJvbGxlcigpO1xyXG4gICAgXHJcbn0pO1xyXG4iLCJcclxuY29uc3QgQW1hdGljVXJsID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL2FtYXRpY3NjL3Y4L0lEbmtSVFBHY3JTVm81MFV5WU5LN3kzVVNCblN2cGtvcFFhVVItMnI3aVUudHRmJztcclxuY29uc3QgUm9ib3RvMTAwID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL3JvYm90by92MTUvN015Z3FUZTJ6czlZa1AwYWRBOVFRUS50dGYnO1xyXG5jb25zdCBSb2JvdG81MDAgPSAnZm9udHMvUm9ib3RvLTUwMC50dGYnO1xyXG5cclxuY2xhc3MgQXBwQ29udHJvbGxlciB7XHJcblxyXG4gICAgZm9udDogb3BlbnR5cGUuRm9udDtcclxuICAgIHdhcnA6IFRleHRXYXJwQ29udHJvbGxlcjtcclxuICAgIHRleHRCbG9ja3M6IFRleHRCbG9ja1tdID0gW107XHJcbiAgICBwYXBlcjogcGFwZXIuUGFwZXJTY29wZTtcclxuICAgIGNhbnZhc0NvbG9yID0gJyNGNUY2Q0UnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluQ2FudmFzJyk7XHJcbiAgICAgICAgcGFwZXIuc2V0dXAoPEhUTUxDYW52YXNFbGVtZW50PmNhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5wYXBlciA9IHBhcGVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG5ldyBGb250TG9hZGVyKFJvYm90bzUwMCwgZm9udCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgICAgIHRoaXMud2FycCA9IG5ldyBUZXh0V2FycENvbnRyb2xsZXIodGhpcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhZGRUZXh0KCl7XHJcbiAgICAgICAgbGV0IHRleHQgPSAkKCcjbmV3VGV4dCcpLnZhbCgpO1xyXG4gICAgICAgIGlmKHRleHQudHJpbSgpLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+IHtcclxuICAgICAgICAgICAgICAgIF9pZDogbmV3aWQoKSxcclxuICAgICAgICAgICAgICAgIHRleHQ6IHRleHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0QmxvY2tzLnB1c2goYmxvY2spO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53YXJwLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5wYXBlci52aWV3LmRyYXcoKTtcclxuICAgICAgICB9ICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgVGV4dEJsb2NrIHtcclxuICAgIF9pZDogc3RyaW5nO1xyXG4gICAgdGV4dDogc3RyaW5nO1xyXG4gICAgaXRlbTogcGFwZXIuSXRlbTtcclxufSIsIlxyXG5jbGFzcyBGb250TG9hZGVyIHtcclxuXHJcbiAgICBpc0xvYWRlZDogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250VXJsOiBzdHJpbmcsIG9uTG9hZGVkOiAoZm9udDogb3BlbnR5cGUuRm9udCkgPT4gdm9pZCkge1xyXG4gICAgICAgIG9wZW50eXBlLmxvYWQoZm9udFVybCwgZnVuY3Rpb24oZXJyLCBmb250KSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChvbkxvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9uTG9hZGVkLmNhbGwodGhpcywgZm9udCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIlxyXG5mdW5jdGlvbiBuZXdpZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSgpLmdldFRpbWUoKStNYXRoLnJhbmRvbSgpKS50b1N0cmluZygzNik7XHJcbn1cclxuIiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwidHlwaW5ncy9wYXBlci5kLnRzXCIgLz5cclxuLy8gPHJlZmVyZW5jZSBwYXRoPVwiTGlua2VkUGF0aHMudHNcIiAvPlxyXG5cclxuaW50ZXJmYWNlIFdpbmRvdyB7XHJcbiAgICB0ZXh0VHJhY2U6IGFueTtcclxufVxyXG5cclxud2luZG93LnRleHRUcmFjZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBjb25zb2xlLmxvZygndGV4dFRyYWNlIHN0YXJ0ZWQnKTtcclxuXHJcbiAgICBjb25zdCBwczIzID0gXCJUaGUgTG9yZCBpcyBteSBzaGVwaGVyZDsgSSBzaGFsbCBub3Qgd2FudC4gSGUgbWFrZXMgbWUgbGllIGRvd24gaW4gZ3JlZW4gcGFzdHVyZXMuIEhlIGxlYWRzIG1lIGJlc2lkZSBzdGlsbCB3YXRlcnMuIEhlIHJlc3RvcmVzIG15IHNvdWwuIEhlIGxlYWRzIG1lIGluIHBhdGhzIG9mIHJpZ2h0ZW91c25lc3MgZm9yIGhpcyBuYW1lJ3Mgc2FrZS4gRXZlbiB0aG91Z2ggSSB3YWxrIHRocm91Z2ggdGhlIHZhbGxleSBvZiB0aGUgc2hhZG93IG9mIGRlYXRoLCBJIHdpbGwgZmVhciBubyBldmlsLCBmb3IgeW91IGFyZSB3aXRoIG1lOyB5b3VyIHJvZCBhbmQgeW91ciBzdGFmZiwgdGhleSBjb21mb3J0IG1lLiBZb3UgcHJlcGFyZSBhIHRhYmxlIGJlZm9yZSBtZSBpbiB0aGUgcHJlc2VuY2Ugb2YgbXkgZW5lbWllczsgeW91IGFub2ludCBteSBoZWFkIHdpdGggb2lsOyBteSBjdXAgb3ZlcmZsb3dzLiBTdXJlbHkgZ29vZG5lc3MgYW5kIG1lcmN5IHNoYWxsIGZvbGxvdyBtZSBhbGwgdGhlIGRheXMgb2YgbXkgbGlmZSwgYW5kIEkgc2hhbGwgZHdlbGwgaW4gdGhlIGhvdXNlIG9mIHRoZSBMb3JkIGZvcmV2ZXIuXCI7XHJcbiAgICBsZXQgZHJhd1BhdGhzID0gbmV3IExpbmtlZFBhdGhHcm91cCgpO1xyXG4gICAgbGV0IHRleHRTaXplID0gNjQ7XHJcbiAgICBsZXQgdGV4dFBhdGggPSBuZXcgUGF0aFRleHQoZHJhd1BhdGhzLCBwczIzLCB7Zm9udFNpemU6IHRleHRTaXplfSk7XHJcbiAgICBsZXQgc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcclxuICAgIGxldCBjdXJyZW50UGF0aDogcGFwZXIuUGF0aDtcclxuXHJcbiAgICBmdW5jdGlvbiBzdGFydFBhdGgocG9pbnQpIHtcclxuICAgICAgICBpZihjdXJyZW50UGF0aCl7XHJcbiAgICAgICAgICAgIGZpbmlzaFBhdGgoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3VycmVudFBhdGggPSBuZXcgcGFwZXIuUGF0aCh7c3Ryb2tlQ29sb3I6ICdsaWdodGdyYXknLCBzdHJva2VXaWR0aDogdGV4dFNpemV9KTtcclxuICAgICAgICBkcmF3UGF0aHMuYWRkQ2hpbGQoY3VycmVudFBhdGgpO1xyXG4gICAgICAgIGN1cnJlbnRQYXRoLmFkZChwb2ludCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwZW5kUGF0aChwb2ludCkge1xyXG4gICAgICAgIGlmKGN1cnJlbnRQYXRoKXtcclxuICAgICAgICAgICAgY3VycmVudFBhdGguYWRkKHBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZmluaXNoUGF0aCgpe1xyXG4gICAgICAgIGN1cnJlbnRQYXRoLnNpbXBsaWZ5KHRleHRTaXplIC8gMik7XHJcbiAgICAgICAgdGV4dFBhdGgudXBkYXRlKCk7XHJcbiAgICAgICAgY3VycmVudFBhdGgudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGN1cnJlbnRQYXRoID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdG9vbCA9IG5ldyBwYXBlci5Ub29sKCk7XHJcblxyXG4gICAgdG9vbC5vbk1vdXNlRHJhZyA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IHBvaW50ID0gZXZlbnQubWlkZGxlUG9pbnQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIWN1cnJlbnRQYXRoKXtcclxuICAgICAgICAgICAgc3RhcnRQYXRoKHBvaW50KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBObzogbmVlZCB0byBjaGVjayBpZiBzYW1lIHNlZ21lbnQhXHJcbiAgICAgICAgLy8gbGV0IG5lYXJlc3QgPSBkcmF3UGF0aHMuZ2V0TmVhcmVzdFBvaW50KHBvaW50KTtcclxuICAgICAgICAvLyBpZihuZWFyZXN0KSB7XHJcbiAgICAgICAgLy8gICAgIGxldCBuZWFyZXN0RGlzdCA9IG5lYXJlc3QuZ2V0RGlzdGFuY2UocG9pbnQpO1xyXG4gICAgICAgIC8vICAgICBpZihuZWFyZXN0ICYmIG5lYXJlc3REaXN0IDw9IHRleHRTaXplKXtcclxuICAgICAgICAvLyAgICAgICAgIGZpbmlzaFBhdGgoKTtcclxuICAgICAgICAvLyAgICAgICAgIHJldHVybjsgICAgICAgIFxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGFwcGVuZFBhdGgocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvb2wub25Nb3VzZVVwID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBmaW5pc2hQYXRoKCk7XHJcbiAgICB9XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL3BhcGVyLmQudHNcIiAvPlxyXG5cclxuY2xhc3MgVGV4dFdhcnBDb250cm9sbGVyIHtcclxuICAgIGFwcDogQXBwQ29udHJvbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcENvbnRyb2xsZXIpIHtcclxuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcclxuICAgICAgICBcclxuICAgICAgICBuZXcgTW91c2VCZWhhdmlvclRvb2wocGFwZXIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUoKXtcclxuICAgICAgICBmb3IobGV0IGJsb2NrIG9mIHRoaXMuYXBwLnRleHRCbG9ja3Mpe1xyXG4gICAgICAgICAgICBpZighYmxvY2suaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3RyZXRjaHkgPSBuZXcgU3RyZXRjaHlUZXh0KGJsb2NrLnRleHQsIHRoaXMuYXBwLmZvbnQsIDY0KTtcclxuICAgICAgICAgICAgICAgIC8vc3RyZXRjaHkudHJhbnNsYXRlKG5ldyBwYXBlci5Qb2ludCgzMCwgMzApKTtcclxuICAgICAgICAgICAgICAgIGJsb2NrLml0ZW0gPSBzdHJldGNoeTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBmaWRkbGVzdGlja3MoKXtcclxuICAgICAgICBjb25zdCBzYW1wbGVUZXh0ID0gXCJGaWRkbGVzdGlja3NcIjtcclxuICAgICAgICB2YXIgbGluZURyYXcgPSBuZXcgTGluZURyYXdUb29sKCk7XHJcbiAgICAgICAgbGV0IHByZXZQYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgICAgIGxpbmVEcmF3Lm9uUGF0aEZpbmlzaGVkID0gKHBhdGgpID0+IHtcclxuICAgICAgICAgICAgcGF0aC5mbGF0dGVuKDQwKTtcclxuICAgICAgICAgICAgcGF0aC5zbW9vdGgoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHByZXZQYXRoKXtcclxuICAgICAgICAgICAgICAgIGxldCBsYXlvdXQgPSBuZXcgVmVydGljYWxCb3VuZHNUZXh0TGF5b3V0KHBhdGgsIHByZXZQYXRoKTtcclxuICAgICAgICAgICAgICAgIGxheW91dC5sYXlvdXQoc2FtcGxlVGV4dCxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcC5mb250LCBcclxuICAgICAgICAgICAgICAgICAgICAoaXRlbSkgPT4gdGhpcy5hcHAucGFwZXIudmlldy5kcmF3KCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBwcmV2UGF0aCA9IHBhdGg7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuZGVjbGFyZSB2YXIgc29sdmU6IChhOiBhbnksIGI6IGFueSwgZmFzdDogYm9vbGVhbikgPT4gdm9pZDtcclxuXHJcbmNsYXNzIFBlcnNwZWN0aXZlVHJhbnNmb3JtIHtcclxuICAgIFxyXG4gICAgc291cmNlOiBRdWFkO1xyXG4gICAgZGVzdDogUXVhZDtcclxuICAgIHBlcnNwOiBhbnk7XHJcbiAgICBtYXRyaXg6IG51bWJlcltdO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2U6IFF1YWQsIGRlc3Q6IFF1YWQpe1xyXG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuZGVzdCA9IGRlc3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5jcmVhdGVNYXRyaXgoc291cmNlLCBkZXN0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gR2l2ZW4gYSA0eDQgcGVyc3BlY3RpdmUgdHJhbnNmb3JtYXRpb24gbWF0cml4LCBhbmQgYSAyRCBwb2ludCAoYSAyeDEgdmVjdG9yKSxcclxuICAgIC8vIGFwcGxpZXMgdGhlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCBieSBjb252ZXJ0aW5nIHRoZSBwb2ludCB0byBob21vZ2VuZW91c1xyXG4gICAgLy8gY29vcmRpbmF0ZXMgYXQgej0wLCBwb3N0LW11bHRpcGx5aW5nLCBhbmQgdGhlbiBhcHBseWluZyBhIHBlcnNwZWN0aXZlIGRpdmlkZS5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBsZXQgcDMgPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5tdWx0aXBseSh0aGlzLm1hdHJpeCwgW3BvaW50LngsIHBvaW50LnksIDAsIDFdKTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IHBhcGVyLlBvaW50KHAzWzBdIC8gcDNbM10sIHAzWzFdIC8gcDNbM10pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBjcmVhdGVNYXRyaXgoc291cmNlOiBRdWFkLCB0YXJnZXQ6IFF1YWQpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNvdXJjZVBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3NvdXJjZS5hLngsIHNvdXJjZS5hLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5iLngsIHNvdXJjZS5iLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5jLngsIHNvdXJjZS5jLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5kLngsIHNvdXJjZS5kLnldXTtcclxuICAgICAgICBsZXQgdGFyZ2V0UG9pbnRzID0gW1xyXG4gICAgICAgICAgICBbdGFyZ2V0LmEueCwgdGFyZ2V0LmEueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmIueCwgdGFyZ2V0LmIueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmMueCwgdGFyZ2V0LmMueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmQueCwgdGFyZ2V0LmQueV1dO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGEgPSBbXSwgYiA9IFtdLCBpID0gMCwgbiA9IHNvdXJjZVBvaW50cy5sZW5ndGg7IGkgPCBuOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHMgPSBzb3VyY2VQb2ludHNbaV0sIHQgPSB0YXJnZXRQb2ludHNbaV07XHJcbiAgICAgICAgICAgIGEucHVzaChbc1swXSwgc1sxXSwgMSwgMCwgMCwgMCwgLXNbMF0gKiB0WzBdLCAtc1sxXSAqIHRbMF1dKSwgYi5wdXNoKHRbMF0pO1xyXG4gICAgICAgICAgICBhLnB1c2goWzAsIDAsIDAsIHNbMF0sIHNbMV0sIDEsIC1zWzBdICogdFsxXSwgLXNbMV0gKiB0WzFdXSksIGIucHVzaCh0WzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBYID0gc29sdmUoYSwgYiwgdHJ1ZSk7IFxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIFhbMF0sIFhbM10sIDAsIFhbNl0sXHJcbiAgICAgICAgICAgIFhbMV0sIFhbNF0sIDAsIFhbN10sXHJcbiAgICAgICAgICAgICAgIDAsICAgIDAsIDEsICAgIDAsXHJcbiAgICAgICAgICAgIFhbMl0sIFhbNV0sIDAsICAgIDFcclxuICAgICAgICBdLm1hcChmdW5jdGlvbih4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHggKiAxMDAwMDApIC8gMTAwMDAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBvc3QtbXVsdGlwbHkgYSA0eDQgbWF0cml4IGluIGNvbHVtbi1tYWpvciBvcmRlciBieSBhIDR4MSBjb2x1bW4gdmVjdG9yOlxyXG4gICAgLy8gWyBtMCBtNCBtOCAgbTEyIF0gICBbIHYwIF0gICBbIHggXVxyXG4gICAgLy8gWyBtMSBtNSBtOSAgbTEzIF0gKiBbIHYxIF0gPSBbIHkgXVxyXG4gICAgLy8gWyBtMiBtNiBtMTAgbTE0IF0gICBbIHYyIF0gICBbIHogXVxyXG4gICAgLy8gWyBtMyBtNyBtMTEgbTE1IF0gICBbIHYzIF0gICBbIHcgXVxyXG4gICAgc3RhdGljIG11bHRpcGx5KG1hdHJpeCwgdmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgbWF0cml4WzBdICogdmVjdG9yWzBdICsgbWF0cml4WzRdICogdmVjdG9yWzFdICsgbWF0cml4WzggXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxMl0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFsxXSAqIHZlY3RvclswXSArIG1hdHJpeFs1XSAqIHZlY3RvclsxXSArIG1hdHJpeFs5IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTNdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMl0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNl0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbMTBdICogdmVjdG9yWzJdICsgbWF0cml4WzE0XSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzNdICogdmVjdG9yWzBdICsgbWF0cml4WzddICogdmVjdG9yWzFdICsgbWF0cml4WzExXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNV0gKiB2ZWN0b3JbM11cclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBRdWFkIHtcclxuICAgIGE6IHBhcGVyLlBvaW50O1xyXG4gICAgYjogcGFwZXIuUG9pbnQ7XHJcbiAgICBjOiBwYXBlci5Qb2ludDtcclxuICAgIGQ6IHBhcGVyLlBvaW50O1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQsIGM6IHBhcGVyLlBvaW50LCBkOiBwYXBlci5Qb2ludCl7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYyA9IGM7XHJcbiAgICAgICAgdGhpcy5kID0gZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21SZWN0YW5nbGUocmVjdDogcGFwZXIuUmVjdGFuZ2xlKXtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIHJlY3QudG9wTGVmdCxcclxuICAgICAgICAgICAgcmVjdC50b3BSaWdodCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21MZWZ0LFxyXG4gICAgICAgICAgICByZWN0LmJvdHRvbVJpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21Db29yZHMoY29vcmRzOiBudW1iZXJbXSkgOiBRdWFkIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMF0sIGNvb3Jkc1sxXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMl0sIGNvb3Jkc1szXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNF0sIGNvb3Jkc1s1XSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNl0sIGNvb3Jkc1s3XSlcclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFzQ29vcmRzKCk6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB0aGlzLmEueCwgdGhpcy5hLnksXHJcbiAgICAgICAgICAgIHRoaXMuYi54LCB0aGlzLmIueSxcclxuICAgICAgICAgICAgdGhpcy5jLngsIHRoaXMuYy55LFxyXG4gICAgICAgICAgICB0aGlzLmQueCwgdGhpcy5kLnlcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIEJvdHRvbVRleHRMYXlvdXQgaW1wbGVtZW50cyBUZXh0TGF5b3V0IHtcclxuXHJcbiAgICBib3R0b206IHBhcGVyLlBhdGhcclxuICAgIGZvbnRTaXplID0gMTAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGJvdHRvbTogcGFwZXIuUGF0aCkge1xyXG4gICAgICAgIHRoaXMuYm90dG9tID0gYm90dG9tO1xyXG4gICAgfVxyXG5cclxuICAgIGxheW91dCh0ZXh0OiBzdHJpbmcsIG9uQ29tcGxldGU/OiAoaXRlbTogcGFwZXIuSXRlbSkgPT4gdm9pZCkge1xyXG4gICAgICAgIG5ldyBGb250TG9hZGVyKEFtYXRpY1VybCwgZm9udCA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGV0dGVyR3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICAgICAgbGV0IGxldHRlclBhdGhzID0gZm9udC5nZXRQYXRocyh0ZXh0LCAwLCAwLCB0aGlzLmZvbnRTaXplKVxyXG4gICAgICAgICAgICAgICAgLm1hcChwID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IFBhcGVySGVscGVycy5pbXBvcnRPcGVuVHlwZVBhdGgocCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0dGVyR3JvdXAuYWRkQ2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCB0ZXh0T3JpZ2luID0gbGV0dGVyR3JvdXAuYm91bmRzLmJvdHRvbUxlZnQ7XHJcbiAgICAgICAgICAgIGxldCBsaW5lYXJMZW5ndGggPSBsZXR0ZXJHcm91cC5ib3VuZHMud2lkdGg7XHJcbiAgICAgICAgICAgIGxldCBsYXlvdXRQYXRoTGVuZ3RoID0gdGhpcy5ib3R0b20ubGVuZ3RoO1xyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0U2NhbGluZyA9IGxheW91dFBhdGhMZW5ndGggLyBsaW5lYXJMZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBsZXQgaWR4ID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgbGV0dGVyUGF0aCBvZiBsZXR0ZXJQYXRocykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxldHRlck9mZnNldCA9IChsZXR0ZXJQYXRoLmJvdW5kcy5sZWZ0IC0gdGV4dE9yaWdpbi54KSAqIG9mZnNldFNjYWxpbmc7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm90dG9tTGVmdFByaW1lID0gdGhpcy5ib3R0b20uZ2V0UG9pbnRBdChsZXR0ZXJPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvdHRvbVJpZ2h0UHJpbWUgPSB0aGlzLmJvdHRvbS5nZXRQb2ludEF0KFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKGxheW91dFBhdGhMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlck9mZnNldCArIGxldHRlclBhdGguYm91bmRzLndpZHRoICogb2Zmc2V0U2NhbGluZykpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvdHRvbVZlY3RvclByaW1lID0gYm90dG9tUmlnaHRQcmltZS5zdWJ0cmFjdChib3R0b21MZWZ0UHJpbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCByb3RhdGVBbmdsZSA9XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDEsIDApLmdldERpcmVjdGVkQW5nbGUoYm90dG9tUmlnaHRQcmltZS5zdWJ0cmFjdChib3R0b21MZWZ0UHJpbWUpKVxyXG4gICAgICAgICAgICAgICAgLy8gcmVwb3NpdGlvbiB1c2luZyBib3R0b21MZWZ0XHJcbiAgICAgICAgICAgICAgICBsZXR0ZXJQYXRoLnBvc2l0aW9uID0gYm90dG9tTGVmdFByaW1lXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZChsZXR0ZXJQYXRoLmJvdW5kcy5jZW50ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnRyYWN0KGxldHRlclBhdGguYm91bmRzLmJvdHRvbUxlZnQpKTtcclxuICAgICAgICAgICAgICAgIGxldHRlclBhdGgucm90YXRlKHJvdGF0ZUFuZ2xlLCBib3R0b21MZWZ0UHJpbWUpO1xyXG4gICAgICAgICAgICAgICAgbGV0dGVyUGF0aC5zY2FsZShvZmZzZXRTY2FsaW5nLCBib3R0b21MZWZ0UHJpbWUpO1xyXG4gICAgICAgICAgICAgICAgaWR4Kys7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKG9uQ29tcGxldGUpe1xyXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZShsZXR0ZXJHcm91cCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUGF0aE9mZnNldFNjYWxpbmcge1xyXG5cclxuICAgIHRvOiBwYXBlci5QYXRoO1xyXG4gICAgc2NhbGU6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmcm9tTGVuZ3RoOiBudW1iZXIsIHRvOiBwYXBlci5QYXRoKSB7XHJcbiAgICAgICAgdGhpcy50byA9IHRvO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSB0by5sZW5ndGggLyBmcm9tTGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRvUG9pbnRBdChmcm9tUGF0aE9mZnNldDogbnVtYmVyKTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIGxldCB0b09mZnNldCA9IE1hdGgubWluKHRoaXMudG8ubGVuZ3RoLCBmcm9tUGF0aE9mZnNldCAqIHRoaXMuc2NhbGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvLmdldFBvaW50QXQodG9PZmZzZXQpO1xyXG4gICAgfVxyXG59IiwiXHJcbi8qKlxyXG4gKiBIYW5kbGUgdGhhdCBzaXRzIG9uIG1pZHBvaW50IG9mIGN1cnZlXHJcbiAqIHdoaWNoIHdpbGwgc3BsaXQgdGhlIGN1cnZlIHdoZW4gZHJhZ2dlZC5cclxuICovXHJcbmNsYXNzIEN1cnZlU3BsaXR0ZXJIYW5kbGUgZXh0ZW5kcyBwYXBlci5TaGFwZSB7XHJcbiBcclxuICAgIGN1cnZlOiBwYXBlci5DdXJ2ZTtcclxuICAgIG9uRHJhZ0VuZDogKG5ld1NlZ21lbnQ6IHBhcGVyLlNlZ21lbnQsIGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiBcclxuICAgIGNvbnN0cnVjdG9yKGN1cnZlOiBwYXBlci5DdXJ2ZSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJ2ZSA9IGN1cnZlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzZWxmID0gPGFueT50aGlzO1xyXG4gICAgICAgIHNlbGYuX3R5cGUgPSAnY2lyY2xlJztcclxuICAgICAgICBzZWxmLl9yYWRpdXMgPSA1O1xyXG4gICAgICAgIHNlbGYuX3NpemUgPSBuZXcgcGFwZXIuU2l6ZShzZWxmLl9yYWRpdXMgKiAyKTtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShjdXJ2ZS5nZXRQb2ludEF0KDAuNSAqIGN1cnZlLmxlbmd0aCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSAyO1xyXG4gICAgICAgIHRoaXMuc3Ryb2tlQ29sb3IgPSAnYmx1ZSc7XHJcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eSA9IDAuNSAqIDAuMzsgXHJcbiBcclxuICAgICAgICBsZXQgbmV3U2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgICAgICB0aGlzLmRyYWdCZWhhdmlvciA9IDxNb3VzZUJlaGF2aW9yPntcclxuICAgICAgICAgICAgb25EcmFnU3RhcnQ6IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudCA9IG5ldyBwYXBlci5TZWdtZW50KHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY3VydmUucGF0aC5pbnNlcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmUuaW5kZXggKyAxLCBcclxuICAgICAgICAgICAgICAgICAgICBuZXdTZWdtZW50XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3UG9zID0gdGhpcy5wb3NpdGlvbi5hZGQoZXZlbnQuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ld1BvcztcclxuICAgICAgICAgICAgICAgIG5ld1NlZ21lbnQucG9pbnQgPSBuZXdQb3M7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ0VuZDogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkRyYWdFbmQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25EcmFnRW5kKG5ld1NlZ21lbnQsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuIiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwidHlwaW5ncy9wYXBlci5kLnRzXCIgLz5cclxuXHJcbmNsYXNzIExpbmVEcmF3VG9vbCB7XHJcbiAgICBncm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgY3VycmVudFBhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICBvblBhdGhGaW5pc2hlZDogKHBhdGg6IHBhcGVyLlBhdGgpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdmFyIHRvb2wgPSBuZXcgcGFwZXIuVG9vbCgpO1xyXG5cclxuICAgICAgICB0b29sLm9uTW91c2VEcmFnID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBldmVudC5taWRkbGVQb2ludDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jdXJyZW50UGF0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydFBhdGgocG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFwcGVuZFBhdGgocG9pbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9vbC5vbk1vdXNlVXAgPSBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZmluaXNoUGF0aCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGFydFBhdGgocG9pbnQpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmZpbmlzaFBhdGgoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IG5ldyBwYXBlci5QYXRoKHsgc3Ryb2tlQ29sb3I6ICdsaWdodGdyYXknLCBzdHJva2VXaWR0aDogMiB9KTtcclxuICAgICAgICB0aGlzLmdyb3VwLmFkZENoaWxkKHRoaXMuY3VycmVudFBhdGgpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhdGguYWRkKHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmRQYXRoKHBvaW50KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5hZGQocG9pbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaW5pc2hQYXRoKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGguc2ltcGxpZnkoNSk7XHJcbiAgICAgICAgICAgIGxldCBwYXRoID0gdGhpcy5jdXJyZW50UGF0aDtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uUGF0aEZpbmlzaGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUGF0aEZpbmlzaGVkLmNhbGwodGhpcywgcGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL3BhcGVyLmQudHNcIiAvPlxyXG5cclxuaW50ZXJmYWNlIFBhdGhMaWtlIHtcclxuICAgIGxlbmd0aDogbnVtYmVyO1xyXG4gICAgZ2V0TG9jYXRpb25BdChvZmZzZXQ6IG51bWJlciwgaXNQYXJhbWV0ZXI/OiBib29sZWFuKTogcGFwZXIuQ3VydmVMb2NhdGlvbjtcclxuICAgIGdldFBvaW50QXQob2Zmc2V0OiBudW1iZXIsIGlzUGF0YW1ldGVyPzogYm9vbGVhbik6IHBhcGVyLlBvaW50O1xyXG4gICAgZ2V0VGFuZ2VudEF0KG9mZnNldDogbnVtYmVyLCBpc1BhdGFtZXRlcj86IGJvb2xlYW4pOiBwYXBlci5Qb2ludDtcclxuICAgIGdldE5lYXJlc3RQb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludDtcclxufVxyXG5cclxuY2xhc3MgTGlua2VkUGF0aEdyb3VwIGV4dGVuZHMgcGFwZXIuR3JvdXBcclxuICAgIGltcGxlbWVudHMgUGF0aExpa2UgXHJcbntcclxuICAgIFxyXG4gICAgYWRkQ2hpbGQocGF0aDogcGFwZXIuUGF0aCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5hZGRDaGlsZChwYXRoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5yZWR1Y2UoKGEsIGI6IHBhcGVyLlBhdGgpID0+IGEgKyBiLmxlbmd0aCwgMCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXQgcGF0aHMoKTogcGFwZXIuUGF0aFtdIHtcclxuICAgICAgICByZXR1cm4gPHBhcGVyLlBhdGhbXT50aGlzLmNoaWxkcmVuO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRMb2NhdGlvbkF0KG9mZnNldDogbnVtYmVyLCBpc1BhcmFtZXRlcj86IGJvb2xlYW4pOiBwYXBlci5DdXJ2ZUxvY2F0aW9ue1xyXG4gICAgICAgIGxldCBwYXRoOiBwYXBlci5QYXRoID0gbnVsbDtcclxuICAgICAgICBmb3IocGF0aCBvZiB0aGlzLnBhdGhzKXtcclxuICAgICAgICAgICAgbGV0IGxlbiA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZihsZW4gPj0gb2Zmc2V0KXtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9mZnNldCAtPSBsZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXRoLmdldExvY2F0aW9uQXQob2Zmc2V0LCBpc1BhcmFtZXRlcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFBvaW50QXQob2Zmc2V0OiBudW1iZXIsIGlzUGFyYW1ldGVyPzogYm9vbGVhbik6IHBhcGVyLlBvaW50e1xyXG4gICAgICAgIGxldCBwYXRoOiBwYXBlci5QYXRoID0gbnVsbDtcclxuICAgICAgICBmb3IocGF0aCBvZiB0aGlzLnBhdGhzKXtcclxuICAgICAgICAgICAgbGV0IGxlbiA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZihsZW4gPj0gb2Zmc2V0KXtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9mZnNldCAtPSBsZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXRoLmdldFBvaW50QXQob2Zmc2V0LCBpc1BhcmFtZXRlcik7ICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRUYW5nZW50QXQob2Zmc2V0OiBudW1iZXIsIGlzUGF0YW1ldGVyPzogYm9vbGVhbik6IHBhcGVyLlBvaW50e1xyXG4gICAgICAgIGxldCBwYXRoOiBwYXBlci5QYXRoID0gbnVsbDtcclxuICAgICAgICBmb3IocGF0aCBvZiB0aGlzLnBhdGhzKXtcclxuICAgICAgICAgICAgbGV0IGxlbiA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZihsZW4gPj0gb2Zmc2V0KXtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9mZnNldCAtPSBsZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXRoLmdldFRhbmdlbnRBdChvZmZzZXQsIGlzUGF0YW1ldGVyKTsgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldE5lYXJlc3RQb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgbGV0IG5lYXJlc3RBZ2c6IHBhcGVyLlBvaW50O1xyXG4gICAgICAgIGxldCBkaXN0QWdnOiBudW1iZXI7XHJcbiAgICAgICAgZm9yKGxldCBwYXRoIG9mIHRoaXMucGF0aHMpe1xyXG4gICAgICAgICAgICBpZihwYXRoLnNlZ21lbnRzLmxlbmd0aCA8IDIpe1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IG5lYXJlc3QgPSBwYXRoLmdldE5lYXJlc3RQb2ludChwb2ludCk7XHJcbiAgICAgICAgICAgIGxldCBkaXN0ID0gbmVhcmVzdC5nZXREaXN0YW5jZShwb2ludCk7XHJcbiAgICAgICAgICAgIGlmKCFuZWFyZXN0QWdnIHx8IGRpc3QgPCBkaXN0QWdnKXtcclxuICAgICAgICAgICAgICAgIG5lYXJlc3RBZ2cgPSBuZWFyZXN0O1xyXG4gICAgICAgICAgICAgICAgZGlzdEFnZyA9IGRpc3Q7ICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5lYXJlc3RBZ2c7XHJcbiAgICB9XHJcbn0iLCJcclxuZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgaW50ZXJmYWNlIEl0ZW0ge1xyXG4gICAgICAgIGRyYWdCZWhhdmlvcjogTW91c2VCZWhhdmlvcjtcclxuICAgIH0gXHJcbn1cclxuXHJcbmludGVyZmFjZSBNb3VzZUJlaGF2aW9yIHtcclxuICAgIG9uQ2xpY2s/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIFxyXG4gICAgb25EcmFnU3RhcnQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDsgXHJcbiAgICBvbkRyYWc/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uRHJhZ0VuZD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgTW91c2VBY3Rpb24ge1xyXG4gICAgc3RhcnRFdmVudDogcGFwZXIuVG9vbEV2ZW50O1xyXG4gICAgaXRlbTogcGFwZXIuSXRlbTtcclxuICAgIGRyYWdnZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmNsYXNzIE1vdXNlQmVoYXZpb3JUb29sIGV4dGVuZHMgcGFwZXIuVG9vbCB7XHJcblxyXG4gICAgaGl0T3B0aW9ucyA9IHtcclxuICAgICAgICBzZWdtZW50czogdHJ1ZSxcclxuICAgICAgICBzdHJva2U6IHRydWUsXHJcbiAgICAgICAgZmlsbDogdHJ1ZSxcclxuICAgICAgICB0b2xlcmFuY2U6IDVcclxuICAgIH07XHJcblxyXG4gICAgYWN0aW9uOiBNb3VzZUFjdGlvbjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocGFwZXJTY29wZTogcGFwZXIuUGFwZXJTY29wZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24gPSAoZXZlbnQpID0+IHtcclxuICAgICAgICB0aGlzLmFjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgICAgIHZhciBoaXRSZXN1bHQgPSBwYXBlci5wcm9qZWN0LmhpdFRlc3QoXHJcbiAgICAgICAgICAgIGV2ZW50LnBvaW50LFxyXG4gICAgICAgICAgICB0aGlzLmhpdE9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAoaGl0UmVzdWx0ICYmIGhpdFJlc3VsdC5pdGVtKSB7XHJcbiAgICAgICAgICAgIGxldCBkcmFnZ2FibGUgPSB0aGlzLmZpbmREcmFnZ2FibGVVcHdhcmQoaGl0UmVzdWx0Lml0ZW0pO1xyXG4gICAgICAgICAgICBpZihkcmFnZ2FibGUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSA8TW91c2VBY3Rpb24+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtOiBkcmFnZ2FibGVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vdGhpcy5wYXBlclNjb3BlLnByb2plY3QuYWN0aXZlTGF5ZXIuYWRkQ2hpbGQodGhpcy5kcmFnSXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURyYWcgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICBpZih0aGlzLmFjdGlvbil7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmFjdGlvbi5kcmFnZ2VkKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uLmRyYWdnZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5hY3Rpb24uaXRlbS5kcmFnQmVoYXZpb3Iub25EcmFnU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uLml0ZW0uZHJhZ0JlaGF2aW9yLm9uRHJhZ1N0YXJ0LmNhbGwoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uLml0ZW0sIHRoaXMuYWN0aW9uLnN0YXJ0RXZlbnQpOyBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0aGlzLmFjdGlvbi5pdGVtLmRyYWdCZWhhdmlvci5vbkRyYWcpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24uaXRlbS5kcmFnQmVoYXZpb3Iub25EcmFnLmNhbGwodGhpcy5hY3Rpb24uaXRlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbk1vdXNlVXAgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICBpZih0aGlzLmFjdGlvbil7XHJcbiAgICAgICAgICAgIGxldCBhY3Rpb24gPSB0aGlzLmFjdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSBudWxsO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoYWN0aW9uLmRyYWdnZWQpe1xyXG4gICAgICAgICAgICAgICAgLy8gZHJhZ1xyXG4gICAgICAgICAgICAgICAgaWYoYWN0aW9uLml0ZW0uZHJhZ0JlaGF2aW9yLm9uRHJhZ0VuZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLml0ZW0uZHJhZ0JlaGF2aW9yLm9uRHJhZ0VuZC5jYWxsKGFjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9ICAgXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjbGlja1xyXG4gICAgICAgICAgICAgICAgaWYoYWN0aW9uLml0ZW0uZHJhZ0JlaGF2aW9yLm9uQ2xpY2spe1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5pdGVtLmRyYWdCZWhhdmlvci5vbkNsaWNrLmNhbGwoYWN0aW9uLml0ZW0sIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgZmluZERyYWdnYWJsZVVwd2FyZChpdGVtOiBwYXBlci5JdGVtKTogcGFwZXIuSXRlbXtcclxuICAgICAgICB3aGlsZSghaXRlbS5kcmFnQmVoYXZpb3IgJiYgaXRlbS5wYXJlbnQgJiYgaXRlbS5wYXJlbnQuY2xhc3NOYW1lICE9ICdMYXllcicpe1xyXG4gICAgICAgICAgICBpdGVtID0gaXRlbS5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtLmRyYWdCZWhhdmlvclxyXG4gICAgICAgICAgICA/IGl0ZW1cclxuICAgICAgICAgICAgOiBudWxsO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBQYXBlckhlbHBlcnMge1xyXG4gICAgXHJcbiAgICBzdGF0aWMgaW1wb3J0T3BlblR5cGVQYXRoKG9wZW5QYXRoOiBvcGVudHlwZS5QYXRoKTogcGFwZXIuQ29tcG91bmRQYXRoXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgob3BlblBhdGgudG9QYXRoRGF0YSgpKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBsZXQgc3ZnID0gb3BlblBhdGgudG9TVkcoNCk7XHJcbiAgICAgICAgLy8gcmV0dXJuIDxwYXBlci5QYXRoPnBhcGVyLnByb2plY3QuaW1wb3J0U1ZHKHN2Zyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyB0cmFjZVBhdGhJdGVtKHBhdGg6IHBhcGVyLlBhdGhJdGVtLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5QYXRoSXRlbSB7XHJcbiAgICAgICAgaWYocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VDb21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgdHJhY2VDb21wb3VuZFBhdGgocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5Db21wb3VuZFBhdGgge1xyXG4gICAgICAgIGlmKCFwYXRoLmNoaWxkcmVuLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcGF0aHMgPSBwYXRoLmNoaWxkcmVuLm1hcChwID0+IFxyXG4gICAgICAgICAgICB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wLCBwb2ludHNQZXJQYXRoKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgoe1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogcGF0aHMsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2UsXHJcbiAgICAgICAgICAgIGZpbGxDb2xvcjogJ2xpZ2h0Z3JheSdcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICBcclxuICAgIHN0YXRpYyB0cmFjZVBhdGgocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAvLyBpZighcGF0aCB8fCAhcGF0aC5zZWdtZW50cyB8fCBwYXRoLnNlZ21lbnRzLmxlbmd0aCl7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBsZXQgcGF0aExlbmd0aCA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGxldCBvZmZzZXRJbmNyID0gcGF0aExlbmd0aCAvIG51bVBvaW50cztcclxuICAgICAgICBsZXQgcG9pbnRzID0gW107XHJcbiAgICAgICAgLy9wb2ludHMubGVuZ3RoID0gbnVtUG9pbnRzO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuICAgICAgICBcclxuICAgICAgICB3aGlsZShpKysgPCBudW1Qb2ludHMpe1xyXG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBwYXRoLmdldFBvaW50QXQoTWF0aC5taW4ob2Zmc2V0LCBwYXRoTGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IG9mZnNldEluY3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBwYXRoID0gbmV3IHBhcGVyLlBhdGgocG9pbnRzKTtcclxuICAgICAgICBwYXRoLmZpbGxDb2xvciA9ICdsaWdodGdyYXknO1xyXG4gICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgcGF0aFByb2plY3Rpb24odG9wUGF0aDogcGFwZXIuQ3VydmVsaWtlLCBib3R0b21QYXRoOiBwYXBlci5DdXJ2ZWxpa2UpXHJcbiAgICAgICAgOiAodW5pdFBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnRcclxuICAgIHtcclxuICAgICAgICBjb25zdCB0b3BQYXRoTGVuZ3RoID0gdG9wUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgYm90dG9tUGF0aExlbmd0aCA9IGJvdHRvbVBhdGgubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbih1bml0UG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgICAgIGxldCB0b3BQb2ludCA9IHRvcFBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIHRvcFBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgIGxldCBib3R0b21Qb2ludCA9IGJvdHRvbVBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIGJvdHRvbVBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgIGlmKHRvcFBvaW50ID09IG51bGwgfHwgYm90dG9tUG9pbnQgPT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgIHRocm93IFwiY291bGQgbm90IGdldCBwcm9qZWN0ZWQgcG9pbnQgZm9yIHVuaXQgcG9pbnQgXCIgKyB1bml0UG9pbnQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmV0dXJuIHRvcFBvaW50LmFkZChib3R0b21Qb2ludC5zdWJ0cmFjdCh0b3BQb2ludCkubXVsdGlwbHkodW5pdFBvaW50LnkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBzaW1wbGlmeShwYXRoOiBwYXBlci5QYXRoSXRlbSwgdG9sZXJhbmNlPzogbnVtYmVyKXtcclxuICAgICAgICBpZihwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpe1xyXG4gICAgICAgICAgICBmb3IobGV0IHAgb2YgcGF0aC5jaGlsZHJlbil7XHJcbiAgICAgICAgICAgICAgICBQYXBlckhlbHBlcnMuc2ltcGxpZnkoPHBhcGVyLlBhdGhJdGVtPnAsIHRvbGVyYW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAoPHBhcGVyLlBhdGg+cGF0aCkuc2ltcGxpZnkodG9sZXJhbmNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgUGF0aFNlY3Rpb24gaW1wbGVtZW50cyBwYXBlci5DdXJ2ZWxpa2Uge1xyXG4gICAgcGF0aDogcGFwZXIuUGF0aDtcclxuICAgIG9mZnNldDogbnVtYmVyO1xyXG4gICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHBhcGVyLlBhdGgsIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcil7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aC5nZXRQb2ludEF0KG9mZnNldCArIHRoaXMub2Zmc2V0KTtcclxuICAgIH1cclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInR5cGluZ3MvcGFwZXIuZC50c1wiIC8+XHJcblxyXG5jbGFzcyBQYXRoVGV4dCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBwYXRoOiBQYXRoTGlrZTtcclxuICAgIHByaXZhdGUgX3RleHQ6IHN0cmluZztcclxuICAgIFxyXG4gICAgcHVibGljIHN0eWxlO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoTGlrZSwgdGV4dD86IHN0cmluZywgc3R5bGU/OiBhbnkpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICB0aGlzLl90ZXh0ID0gdGV4dDtcclxuICAgICAgICB0aGlzLnN0eWxlID0gc3R5bGU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuIFxyXG4gICAgZ2V0IHRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IHRleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX3RleHQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB0ZXh0ID0gdGhpcy50ZXh0O1xyXG4gICAgICAgIGxldCBwYXRoID0gdGhpcy5wYXRoO1xyXG4gICAgICAgIGlmICh0ZXh0ICYmIHRleHQubGVuZ3RoICYmIHBhdGggJiYgcGF0aC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIE1lYXN1cmUgZ2x5cGhzIGluIHBhaXJzIHRvIGNhcHR1cmUgd2hpdGUgc3BhY2UuXHJcbiAgICAgICAgICAgIC8vIFBhaXJzIGFyZSBjaGFyYWN0ZXJzIGkgYW5kIGkrMS5cclxuICAgICAgICAgICAgdmFyIGdseXBoUGFpcnMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBnbHlwaFBhaXJzW2ldID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSwgaSsxKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEZvciBlYWNoIGNoYXJhY3RlciwgZmluZCBjZW50ZXIgb2Zmc2V0LlxyXG4gICAgICAgICAgICB2YXIgeE9mZnNldHMgPSBbMF07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBNZWFzdXJlIHRocmVlIGNoYXJhY3RlcnMgYXQgYSB0aW1lIHRvIGdldCB0aGUgYXBwcm9wcmlhdGUgXHJcbiAgICAgICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxyXG4gICAgICAgICAgICAgICAgdmFyIHRyaWFkVGV4dCA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGkgLSAxLCBpICsgMSkpO1xyXG4gICAgICAgICAgICAgICAgdHJpYWRUZXh0LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBvdXQgaGFsZiBvZiBwcmlvciBnbHlwaCBwYWlyIFxyXG4gICAgICAgICAgICAgICAgLy8gICBhbmQgaGFsZiBvZiBjdXJyZW50IGdseXBoIHBhaXIuXHJcbiAgICAgICAgICAgICAgICAvLyBNdXN0IGJlIHJpZ2h0LCBiZWNhdXNlIGl0IHdvcmtzLlxyXG4gICAgICAgICAgICAgICAgbGV0IG9mZnNldFdpZHRoID0gdHJpYWRUZXh0LmJvdW5kcy53aWR0aCBcclxuICAgICAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaSAtIDFdLmJvdW5kcy53aWR0aCAvIDIgXHJcbiAgICAgICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIEFkZCBvZmZzZXQgd2lkdGggdG8gcHJpb3Igb2Zmc2V0LiBcclxuICAgICAgICAgICAgICAgIHhPZmZzZXRzW2ldID0geE9mZnNldHNbaSAtIDFdICsgb2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFNldCBwb2ludCBmb3IgZWFjaCBnbHlwaCBhbmQgcm90YXRlIGdseXBoIGFvcnVuZCB0aGUgcG9pbnRcclxuICAgICAgICAgICAgbGV0IHBhdGhMZW5ndGggPSBwYXRoLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VudGVyT2ZmcyA9IHhPZmZzZXRzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGhMZW5ndGggPCBjZW50ZXJPZmZzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyT2ZmcyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjZW50ZXJPZmZzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbHlwaFBhaXJzW2ldLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGF0aFBvaW50ID0gcGF0aC5nZXRQb2ludEF0KGNlbnRlck9mZnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdseXBoUGFpcnNbaV0ucG9zaXRpb24gPSBwYXRoUG9pbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhbiA9IHBhdGguZ2V0VGFuZ2VudEF0KGNlbnRlck9mZnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRhbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbHlwaFBhaXJzW2ldLnJvdGF0ZSh0YW4uYW5nbGUsIHBhdGhQb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ291bGQgbm90IGdldCB0YW5nZW50IGF0IFwiLCBjZW50ZXJPZmZzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgXHJcbiAgICAvLyBjcmVhdGUgYSBQb2ludFRleHQgb2JqZWN0IGZvciBhIHN0cmluZyBhbmQgYSBzdHlsZVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQb2ludFRleHQgKHRleHQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICB2YXIgcG9pbnRUZXh0ID0gbmV3IHBhcGVyLlBvaW50VGV4dCgpO1xyXG4gICAgICAgIHBvaW50VGV4dC5jb250ZW50ID0gdGV4dDtcclxuICAgICAgICBwb2ludFRleHQuanVzdGlmaWNhdGlvbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgbGV0IHN0eWxlID0gdGhpcy5zdHlsZTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoc3R5bGUpIHtcclxuICAgICAgICAgICAgaWYgKHN0eWxlLmZvbnRGYW1pbHkpIHBvaW50VGV4dC5mb250RmFtaWx5ID0gc3R5bGUuZm9udEZhbWlseTtcclxuICAgICAgICAgICAgaWYgKHN0eWxlLmZvbnRTaXplKSBwb2ludFRleHQuZm9udFNpemUgPSBzdHlsZS5mb250U2l6ZTtcclxuICAgICAgICAgICAgaWYgKHN0eWxlLmZvbnRXaWVnaHQpIHBvaW50VGV4dC5mb250V2VpZ2h0ID0gc3R5bGUuZm9udFdlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHJlY3QgPSBwYXBlci5QYXRoLlJlY3RhbmdsZShwb2ludFRleHQuYm91bmRzKTtcclxuICAgICAgICByZWN0LmZpbGxDb2xvciA9ICdsaWdodGdyYXknO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBncm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIGdyb3VwLnN0eWxlID0gc3R5bGU7XHJcbiAgICAgICAgZ3JvdXAuYWRkQ2hpbGQocG9pbnRUZXh0KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChncm91cCk7XHJcbiAgICAgICAgcmV0dXJuIGdyb3VwO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcblxyXG4iLCJcclxuY2xhc3MgUGF0aFRyYW5zZm9ybSB7XHJcbiAgICBwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludFRyYW5zZm9ybSA9IHBvaW50VHJhbnNmb3JtO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludFRyYW5zZm9ybShwb2ludCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aEl0ZW0ocGF0aDogcGFwZXIuUGF0aEl0ZW0pIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1Db21wb3VuZFBhdGgocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aChwYXRoOiBwYXBlci5QYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiBwYXRoLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBvcmlnUG9pbnQgPSBzZWdtZW50LnBvaW50O1xyXG4gICAgICAgICAgICBsZXQgbmV3UG9pbnQgPSB0aGlzLnRyYW5zZm9ybVBvaW50KHNlZ21lbnQucG9pbnQpO1xyXG4gICAgICAgICAgICBvcmlnUG9pbnQueCA9IG5ld1BvaW50Lng7XHJcbiAgICAgICAgICAgIG9yaWdQb2ludC55ID0gbmV3UG9pbnQueTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuIiwiXHJcbmNsYXNzIFNlZ21lbnRIYW5kbGUgZXh0ZW5kcyBwYXBlci5TaGFwZSB7XHJcbiBcclxuICAgIHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XHJcbiAgICBvbkRyYWdFbmQ6IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gXHJcbiAgICBjb25zdHJ1Y3RvcihzZWdtZW50OiBwYXBlci5TZWdtZW50LCByYWRpdXM/OiBudW1iZXIpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZWdtZW50ID0gc2VnbWVudDtcclxuXHJcbiAgICAgICAgbGV0IHNlbGYgPSA8YW55PnRoaXM7XHJcbiAgICAgICAgc2VsZi5fdHlwZSA9ICdjaXJjbGUnO1xyXG4gICAgICAgIHNlbGYuX3JhZGl1cyA9IDU7XHJcbiAgICAgICAgc2VsZi5fc2l6ZSA9IG5ldyBwYXBlci5TaXplKHNlbGYuX3JhZGl1cyAqIDIpO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKHNlZ21lbnQucG9pbnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSAyO1xyXG4gICAgICAgIHRoaXMuc3Ryb2tlQ29sb3IgPSAnYmx1ZSc7XHJcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eSA9IDAuNTsgXHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ0JlaGF2aW9yID0gPE1vdXNlQmVoYXZpb3I+e1xyXG4gICAgICAgICAgICBvbkRyYWc6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdQb3MgPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zO1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5wb2ludCA9IG5ld1BvcztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnRW5kOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uRHJhZ0VuZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkRyYWdFbmQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoeVBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcbiAgICBzb3VyY2VQYXRoOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBkaXNwbGF5UGF0aDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgY29ybmVyczogcGFwZXIuU2VnbWVudFtdO1xyXG4gICAgb3V0bGluZTogcGFwZXIuUGF0aDtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3IgcmVidWlsZGluZyB0aGUgbWlkcG9pbnQgaGFuZGxlc1xyXG4gICAgICogYXMgb3V0bGluZSBjaGFuZ2VzLlxyXG4gICAgICovXHJcbiAgICBtaWRwb2ludEdyb3VwOiBwYXBlci5Hcm91cDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VQYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnNvdXJjZVBhdGggPSBzb3VyY2VQYXRoO1xyXG4gICAgICAgIHRoaXMuc291cmNlUGF0aC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlT3V0bGluZSgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlU2VnbWVudE1hcmtlcnMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1pZHBpb250TWFya2VycygpO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdCZWhhdmlvciA9IHtcclxuICAgICAgICAgICAgb25EcmFnOiBldmVudCA9PiB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQoZXZlbnQuZGVsdGEpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBhcnJhbmdlQ29udGVudHMoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNaWRwaW9udE1hcmtlcnMoKTtcclxuICAgICAgICB0aGlzLmFycmFuZ2VQYXRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXJyYW5nZVBhdGgoKSB7XHJcbiAgICAgICAgbGV0IG9ydGhPcmlnaW4gPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzLnRvcExlZnQ7XHJcbiAgICAgICAgbGV0IG9ydGhXaWR0aCA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMud2lkdGg7XHJcbiAgICAgICAgbGV0IG9ydGhIZWlnaHQgPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzLmhlaWdodDtcclxuICAgICAgICBsZXQgc2lkZXMgPSB0aGlzLmdldE91dGxpbmVTaWRlcygpO1xyXG4gICAgICAgIGxldCB0b3AgPSBzaWRlc1swXTtcclxuICAgICAgICBsZXQgYm90dG9tID0gc2lkZXNbMl07XHJcbiAgICAgICAgYm90dG9tLnJldmVyc2UoKTtcclxuICAgICAgICBsZXQgcHJvamVjdGlvbiA9IFBhcGVySGVscGVycy5wYXRoUHJvamVjdGlvbih0b3AsIGJvdHRvbSk7XHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlbGF0aXZlID0gcG9pbnQuc3VidHJhY3Qob3J0aE9yaWdpbik7XHJcbiAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpdmUueCAvIG9ydGhXaWR0aCxcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnkgLyBvcnRoSGVpZ2h0KTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0ZWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgc2lkZSBvZiBzaWRlcyl7XHJcbiAgICAgICAgICAgIHNpZGUucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBuZXdQYXRoID0gPHBhcGVyLkNvbXBvdW5kUGF0aD50aGlzLnNvdXJjZVBhdGguY2xvbmUoKTtcclxuICAgICAgICBuZXdQYXRoLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIG5ld1BhdGguZmlsbENvbG9yID0gJ2xpZ2h0Ymx1ZSc7XHJcblxyXG4gICAgICAgIHRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoSXRlbShuZXdQYXRoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheVBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5UGF0aC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGxheVBhdGggPSBuZXdQYXRoO1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0Q2hpbGQoMSwgbmV3UGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRPdXRsaW5lU2lkZXMoKTogcGFwZXIuUGF0aFtdIHtcclxuICAgICAgICBsZXQgc2lkZXM6IHBhcGVyLlBhdGhbXSA9IFtdO1xyXG4gICAgICAgIGxldCBzZWdtZW50R3JvdXA6IHBhcGVyLlNlZ21lbnRbXSA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjb3JuZXJQb2ludHMgPSB0aGlzLmNvcm5lcnMubWFwKGMgPT4gYy5wb2ludCk7XHJcbiAgICAgICAgbGV0IGZpcnN0ID0gY29ybmVyUG9pbnRzLnNoaWZ0KCk7IFxyXG4gICAgICAgIGNvcm5lclBvaW50cy5wdXNoKGZpcnN0KTtcclxuXHJcbiAgICAgICAgbGV0IHRhcmdldENvcm5lciA9IGNvcm5lclBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgIGxldCBzZWdtZW50TGlzdCA9IHRoaXMub3V0bGluZS5zZWdtZW50cy5tYXAoeCA9PiB4KTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgc2VnbWVudExpc3QucHVzaChzZWdtZW50TGlzdFswXSk7XHJcbiAgICAgICAgZm9yKGxldCBzZWdtZW50IG9mIHNlZ21lbnRMaXN0KXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNlZ21lbnRHcm91cC5wdXNoKHNlZ21lbnQpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGlmKHRhcmdldENvcm5lci5nZXREaXN0YW5jZShzZWdtZW50LnBvaW50KSA8IDAuMDAwMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZmluaXNoIHBhdGhcclxuICAgICAgICAgICAgICAgIHNpZGVzLnB1c2gobmV3IHBhcGVyLlBhdGgoc2VnbWVudEdyb3VwKSk7XHJcbiAgICAgICAgICAgICAgICBzZWdtZW50R3JvdXAgPSBbc2VnbWVudF07XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRDb3JuZXIgPSBjb3JuZXJQb2ludHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoc2lkZXMubGVuZ3RoICE9PSA0KXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignc2lkZXMnLCBzaWRlcyk7XHJcbiAgICAgICAgICAgIHRocm93ICdmYWlsZWQgdG8gZ2V0IHNpZGVzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHNpZGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlT3V0bGluZSgpIHtcclxuICAgICAgICBsZXQgYm91bmRzID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcztcclxuICAgICAgICB0aGlzLm91dGxpbmUgPSBuZXcgcGFwZXIuUGF0aChbXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KGJvdW5kcy50b3BMZWZ0KSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoYm91bmRzLnRvcFJpZ2h0KSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoYm91bmRzLmJvdHRvbVJpZ2h0KSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoYm91bmRzLmJvdHRvbUxlZnQpXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIHRoaXMub3V0bGluZS5jbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMub3V0bGluZS5maWxsQ29sb3IgPSBuZXcgcGFwZXIuQ29sb3Iod2luZG93LmFwcC5jYW52YXNDb2xvcik7Ly8uYWRkKDAuMDQpO1xyXG4gICAgICAgIHRoaXMub3V0bGluZS5zdHJva2VDb2xvciA9ICdsaWdodGdyYXknO1xyXG4gICAgICAgIHRoaXMub3V0bGluZS5kYXNoQXJyYXkgPSBbNSwgNV07XHJcblxyXG4gICAgICAgIC8vIHRyYWNrIGNvcm5lcnMgc28gd2Uga25vdyBob3cgdG8gYXJyYW5nZSB0aGUgdGV4dFxyXG4gICAgICAgIHRoaXMuY29ybmVycyA9IHRoaXMub3V0bGluZS5zZWdtZW50cy5tYXAocyA9PiBzKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLm91dGxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2VnbWVudE1hcmtlcnMoKSB7XHJcbiAgICAgICAgbGV0IGJvdW5kcyA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHM7XHJcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiB0aGlzLm91dGxpbmUuc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgbGV0IGhhbmRsZSA9IG5ldyBTZWdtZW50SGFuZGxlKHNlZ21lbnQpO1xyXG4gICAgICAgICAgICBoYW5kbGUub25EcmFnRW5kID0gKCkgPT4gdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChoYW5kbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZU1pZHBpb250TWFya2VycygpIHtcclxuICAgICAgICBpZih0aGlzLm1pZHBvaW50R3JvdXApe1xyXG4gICAgICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWlkcG9pbnRHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIHRoaXMub3V0bGluZS5jdXJ2ZXMuZm9yRWFjaChjdXJ2ZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGUgPSBuZXcgQ3VydmVTcGxpdHRlckhhbmRsZShjdXJ2ZSk7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbkRyYWdFbmQgPSAobmV3U2VnbWVudCwgZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdIYW5kbGUgPSBuZXcgU2VnbWVudEhhbmRsZShuZXdTZWdtZW50KTtcclxuICAgICAgICAgICAgICAgIG5ld0hhbmRsZS5vbkRyYWdFbmQgPSAoKSA9PiB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChuZXdIYW5kbGUpO1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLm1pZHBvaW50R3JvdXApO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoeVRleHQgZXh0ZW5kcyBTdHJldGNoeVBhdGgge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZywgZm9udDogb3BlbnR5cGUuRm9udCwgZm9udFNpemU6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBvcGVuVHlwZVBhdGggPSBmb250LmdldFBhdGgodGV4dCwgMCwgMCwgZm9udFNpemUpO1xyXG4gICAgICAgIGxldCB0ZXh0UGF0aCA9IFBhcGVySGVscGVycy5pbXBvcnRPcGVuVHlwZVBhdGgob3BlblR5cGVQYXRoKTtcclxuXHJcbiAgICAgICAgdGV4dFBhdGguZmlsbENvbG9yID0gJ3JlZCc7XHJcblxyXG4gICAgICAgIHN1cGVyKHRleHRQYXRoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IHBhcGVyLlBvaW50KHRoaXMuc3Ryb2tlQm91bmRzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cm9rZUJvdW5kcy5oZWlnaHQgLyAyKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgVGV4dFJ1bGVyIHtcclxuICAgIFxyXG4gICAgZm9udEZhbWlseTogc3RyaW5nO1xyXG4gICAgZm9udFdlaWdodDogbnVtYmVyO1xyXG4gICAgZm9udFNpemU6IG51bWJlcjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQb2ludFRleHQgKHRleHQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICB2YXIgcG9pbnRUZXh0ID0gbmV3IHBhcGVyLlBvaW50VGV4dCgpO1xyXG4gICAgICAgIHBvaW50VGV4dC5jb250ZW50ID0gdGV4dDtcclxuICAgICAgICBwb2ludFRleHQuanVzdGlmaWNhdGlvbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgaWYodGhpcy5mb250RmFtaWx5KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRGYW1pbHkgPSB0aGlzLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFdlaWdodCl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250V2VpZ2h0ID0gdGhpcy5mb250V2VpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmZvbnRTaXplKXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHBvaW50VGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUZXh0T2Zmc2V0cyh0ZXh0KXtcclxuICAgICAgICAvLyBNZWFzdXJlIGdseXBocyBpbiBwYWlycyB0byBjYXB0dXJlIHdoaXRlIHNwYWNlLlxyXG4gICAgICAgIC8vIFBhaXJzIGFyZSBjaGFyYWN0ZXJzIGkgYW5kIGkrMS5cclxuICAgICAgICB2YXIgZ2x5cGhQYWlycyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBnbHlwaFBhaXJzW2ldID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSwgaSsxKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZvciBlYWNoIGNoYXJhY3RlciwgZmluZCBjZW50ZXIgb2Zmc2V0LlxyXG4gICAgICAgIHZhciB4T2Zmc2V0cyA9IFswXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIE1lYXN1cmUgdGhyZWUgY2hhcmFjdGVycyBhdCBhIHRpbWUgdG8gZ2V0IHRoZSBhcHByb3ByaWF0ZSBcclxuICAgICAgICAgICAgLy8gICBzcGFjZSBiZWZvcmUgYW5kIGFmdGVyIHRoZSBnbHlwaC5cclxuICAgICAgICAgICAgdmFyIHRyaWFkVGV4dCA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGkgLSAxLCBpICsgMSkpO1xyXG4gICAgICAgICAgICB0cmlhZFRleHQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCBvdXQgaGFsZiBvZiBwcmlvciBnbHlwaCBwYWlyIFxyXG4gICAgICAgICAgICAvLyAgIGFuZCBoYWxmIG9mIGN1cnJlbnQgZ2x5cGggcGFpci5cclxuICAgICAgICAgICAgLy8gTXVzdCBiZSByaWdodCwgYmVjYXVzZSBpdCB3b3Jrcy5cclxuICAgICAgICAgICAgbGV0IG9mZnNldFdpZHRoID0gdHJpYWRUZXh0LmJvdW5kcy53aWR0aCBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpIC0gMV0uYm91bmRzLndpZHRoIC8gMiBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpXS5ib3VuZHMud2lkdGggLyAyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQWRkIG9mZnNldCB3aWR0aCB0byBwcmlvciBvZmZzZXQuIFxyXG4gICAgICAgICAgICB4T2Zmc2V0c1tpXSA9IHhPZmZzZXRzW2kgLSAxXSArIG9mZnNldFdpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGdseXBoUGFpciBvZiBnbHlwaFBhaXJzKXtcclxuICAgICAgICAgICAgZ2x5cGhQYWlyLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4geE9mZnNldHM7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFZlcnRpY2FsQm91bmRzVGV4dExheW91dCB7XHJcbiAgICB0b3A6IHBhcGVyLlBhdGg7XHJcbiAgICBib3R0b206IHBhcGVyLlBhdGg7XHJcblxyXG4gICAgbGV0dGVyUmVzb2x1dGlvbiA9IDEwMDtcclxuICAgIHNtb290aFRvbGVyYW5jZSA9IDAuMjU7XHJcbiAgICBmb250U2l6ZSA9IDY0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRvcDogcGFwZXIuUGF0aCwgYm90dG9tOiBwYXBlci5QYXRoKSB7XHJcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XHJcbiAgICAgICAgdGhpcy5ib3R0b20gPSBib3R0b207XHJcbiAgICB9XHJcblxyXG4gICAgbGF5b3V0KHRleHQ6IHN0cmluZywgZm9udDogb3BlbnR5cGUuRm9udCwgb25Db21wbGV0ZT86IChpdGVtOiBwYXBlci5JdGVtKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgbGV0IGxldHRlckdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgbGV0IGxldHRlclBhdGhzID0gZm9udC5nZXRQYXRocyh0ZXh0LCAwLCAwLCB0aGlzLmZvbnRTaXplKVxyXG4gICAgICAgICAgICAubWFwKHAgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhdGggPSBQYXBlckhlbHBlcnMuaW1wb3J0T3BlblR5cGVQYXRoKHApO1xyXG4gICAgICAgICAgICAgICAgbGV0dGVyR3JvdXAuYWRkQ2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBvcnRoT3JpZ2luID0gbGV0dGVyR3JvdXAuYm91bmRzLnRvcExlZnQ7XHJcbiAgICAgICAgbGV0IG9ydGhXaWR0aCA9IGxldHRlckdyb3VwLmJvdW5kcy53aWR0aDtcclxuICAgICAgICBsZXQgb3J0aEhlaWdodCA9IGxldHRlckdyb3VwLmJvdW5kcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLnBhdGhQcm9qZWN0aW9uKHRoaXMudG9wLCB0aGlzLmJvdHRvbSk7XHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlbGF0aXZlID0gcG9pbnQuc3VidHJhY3Qob3J0aE9yaWdpbik7XHJcbiAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpdmUueCAvIG9ydGhXaWR0aCxcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnkgLyBvcnRoSGVpZ2h0KTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0ZWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBmaW5hbEdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgZm9yIChsZXQgbGV0dGVyUGF0aCBvZiBsZXR0ZXJQYXRocykge1xyXG4gICAgICAgICAgICBsZXQgbGV0dGVyT3V0bGluZSA9IFBhcGVySGVscGVycy50cmFjZVBhdGhJdGVtKFxyXG4gICAgICAgICAgICAgICAgbGV0dGVyUGF0aCwgdGhpcy5sZXR0ZXJSZXNvbHV0aW9uKTtcclxuICAgICAgICAgICAgbGV0dGVyUGF0aC5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoSXRlbShsZXR0ZXJPdXRsaW5lKTtcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNpbXBsaWZ5KGxldHRlck91dGxpbmUsIHRoaXMuc21vb3RoVG9sZXJhbmNlKTtcclxuICAgICAgICAgICAgZmluYWxHcm91cC5hZGRDaGlsZChsZXR0ZXJPdXRsaW5lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0dGVyR3JvdXAucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGlmIChvbkNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIG9uQ29tcGxldGUoZmluYWxHcm91cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19