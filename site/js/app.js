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
        this.mouseBehavior = {
            onDragStart: function (event) {
                newSegment = new paper.Segment(_this.position);
                curve.path.insert(curve.index + 1, newSegment);
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
                    if (_this.action.item.mouseBehavior.onDragStart) {
                        _this.action.item.mouseBehavior.onDragStart.call(_this.action.item, _this.action.startEvent);
                    }
                }
                if (_this.action.item.mouseBehavior.onDrag) {
                    _this.action.item.mouseBehavior.onDrag.call(_this.action.item, event);
                }
            }
        };
        this.onMouseUp = function (event) {
            if (_this.action) {
                var action = _this.action;
                _this.action = null;
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
    }
    MouseBehaviorTool.prototype.findDraggableUpward = function (item) {
        while (!item.mouseBehavior && item.parent && item.parent.className != 'Layer') {
            item = item.parent;
        }
        return item.mouseBehavior
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
        this.mouseBehavior = {
            onDrag: function (event) {
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
            handle.onChangeComplete = function () { return _this.arrangeContents(); };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6InNyYy8iLCJzb3VyY2VzIjpbImFwcC50cyIsImFwcC9BcHBDb250cm9sbGVyLnRzIiwiYXBwL0ZvbnRMb2FkZXIudHMiLCJhcHAvSGVscGVycy50cyIsImFwcC9UZXh0VHJhY2VDb250cm9sbGVyLnRzIiwiYXBwL1RleHRXYXJwQ29udHJvbGxlci50cyIsIm1hdGgvUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHMiLCJwYXBlci9Cb3R0b21UZXh0TGF5b3V0LnRzIiwicGFwZXIvQ3VydmVTcGxpdHRlckhhbmRsZS50cyIsInBhcGVyL0xpbmVEcmF3VG9vbC50cyIsInBhcGVyL0xpbmtlZFBhdGhHcm91cC50cyIsInBhcGVyL01vdXNlQmVoYXZpb3JUb29sLnRzIiwicGFwZXIvUGFwZXJIZWxwZXJzLnRzIiwicGFwZXIvUGF0aFNlY3Rpb24udHMiLCJwYXBlci9QYXRoVGV4dC50cyIsInBhcGVyL1BhdGhUcmFuc2Zvcm0udHMiLCJwYXBlci9TZWdtZW50SGFuZGxlLnRzIiwicGFwZXIvU3RyZXRjaHlQYXRoLnRzIiwicGFwZXIvU3RyZXRjaHlUZXh0LnRzIiwicGFwZXIvVGV4dFJ1bGVyLnRzIiwicGFwZXIvVmVydGljYWxCb3VuZHNUZXh0TGF5b3V0LnRzIl0sIm5hbWVzIjpbIkFwcENvbnRyb2xsZXIiLCJBcHBDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQXBwQ29udHJvbGxlci5hZGRUZXh0IiwiRm9udExvYWRlciIsIkZvbnRMb2FkZXIuY29uc3RydWN0b3IiLCJuZXdpZCIsInN0YXJ0UGF0aCIsImFwcGVuZFBhdGgiLCJmaW5pc2hQYXRoIiwiVGV4dFdhcnBDb250cm9sbGVyIiwiVGV4dFdhcnBDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiVGV4dFdhcnBDb250cm9sbGVyLnVwZGF0ZSIsIlRleHRXYXJwQ29udHJvbGxlci5maWRkbGVzdGlja3MiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybSIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtLmNvbnN0cnVjdG9yIiwiUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHJhbnNmb3JtUG9pbnQiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS5jcmVhdGVNYXRyaXgiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS5tdWx0aXBseSIsIlF1YWQiLCJRdWFkLmNvbnN0cnVjdG9yIiwiUXVhZC5mcm9tUmVjdGFuZ2xlIiwiUXVhZC5mcm9tQ29vcmRzIiwiUXVhZC5hc0Nvb3JkcyIsIkJvdHRvbVRleHRMYXlvdXQiLCJCb3R0b21UZXh0TGF5b3V0LmNvbnN0cnVjdG9yIiwiQm90dG9tVGV4dExheW91dC5sYXlvdXQiLCJQYXRoT2Zmc2V0U2NhbGluZyIsIlBhdGhPZmZzZXRTY2FsaW5nLmNvbnN0cnVjdG9yIiwiUGF0aE9mZnNldFNjYWxpbmcuZ2V0VG9Qb2ludEF0IiwiQ3VydmVTcGxpdHRlckhhbmRsZSIsIkN1cnZlU3BsaXR0ZXJIYW5kbGUuY29uc3RydWN0b3IiLCJMaW5lRHJhd1Rvb2wiLCJMaW5lRHJhd1Rvb2wuY29uc3RydWN0b3IiLCJMaW5lRHJhd1Rvb2wuc3RhcnRQYXRoIiwiTGluZURyYXdUb29sLmFwcGVuZFBhdGgiLCJMaW5lRHJhd1Rvb2wuZmluaXNoUGF0aCIsIkxpbmtlZFBhdGhHcm91cCIsIkxpbmtlZFBhdGhHcm91cC5jb25zdHJ1Y3RvciIsIkxpbmtlZFBhdGhHcm91cC5hZGRDaGlsZCIsIkxpbmtlZFBhdGhHcm91cC5sZW5ndGgiLCJMaW5rZWRQYXRoR3JvdXAucGF0aHMiLCJMaW5rZWRQYXRoR3JvdXAuZ2V0TG9jYXRpb25BdCIsIkxpbmtlZFBhdGhHcm91cC5nZXRQb2ludEF0IiwiTGlua2VkUGF0aEdyb3VwLmdldFRhbmdlbnRBdCIsIkxpbmtlZFBhdGhHcm91cC5nZXROZWFyZXN0UG9pbnQiLCJNb3VzZUJlaGF2aW9yVG9vbCIsIk1vdXNlQmVoYXZpb3JUb29sLmNvbnN0cnVjdG9yIiwiTW91c2VCZWhhdmlvclRvb2wuZmluZERyYWdnYWJsZVVwd2FyZCIsIlBhcGVySGVscGVycyIsIlBhcGVySGVscGVycy5jb25zdHJ1Y3RvciIsIlBhcGVySGVscGVycy5pbXBvcnRPcGVuVHlwZVBhdGgiLCJQYXBlckhlbHBlcnMudHJhY2VQYXRoSXRlbSIsIlBhcGVySGVscGVycy50cmFjZUNvbXBvdW5kUGF0aCIsIlBhcGVySGVscGVycy50cmFjZVBhdGgiLCJQYXBlckhlbHBlcnMucGF0aFByb2plY3Rpb24iLCJQYXBlckhlbHBlcnMuc2ltcGxpZnkiLCJQYXRoU2VjdGlvbiIsIlBhdGhTZWN0aW9uLmNvbnN0cnVjdG9yIiwiUGF0aFNlY3Rpb24uZ2V0UG9pbnRBdCIsIlBhdGhUZXh0IiwiUGF0aFRleHQuY29uc3RydWN0b3IiLCJQYXRoVGV4dC50ZXh0IiwiUGF0aFRleHQudXBkYXRlIiwiUGF0aFRleHQuY3JlYXRlUG9pbnRUZXh0IiwiUGF0aFRyYW5zZm9ybSIsIlBhdGhUcmFuc2Zvcm0uY29uc3RydWN0b3IiLCJQYXRoVHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50IiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoSXRlbSIsIlBhdGhUcmFuc2Zvcm0udHJhbnNmb3JtQ29tcG91bmRQYXRoIiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoIiwiU2VnbWVudEhhbmRsZSIsIlNlZ21lbnRIYW5kbGUuY29uc3RydWN0b3IiLCJTZWdtZW50SGFuZGxlLnNtb290aGVkIiwiU3RyZXRjaHlQYXRoIiwiU3RyZXRjaHlQYXRoLmNvbnN0cnVjdG9yIiwiU3RyZXRjaHlQYXRoLmFycmFuZ2VDb250ZW50cyIsIlN0cmV0Y2h5UGF0aC5hcnJhbmdlUGF0aCIsIlN0cmV0Y2h5UGF0aC5nZXRPdXRsaW5lU2lkZXMiLCJTdHJldGNoeVBhdGguY3JlYXRlT3V0bGluZSIsIlN0cmV0Y2h5UGF0aC5jcmVhdGVTZWdtZW50TWFya2VycyIsIlN0cmV0Y2h5UGF0aC51cGRhdGVNaWRwaW9udE1hcmtlcnMiLCJTdHJldGNoeVRleHQiLCJTdHJldGNoeVRleHQuY29uc3RydWN0b3IiLCJUZXh0UnVsZXIiLCJUZXh0UnVsZXIuY29uc3RydWN0b3IiLCJUZXh0UnVsZXIuY3JlYXRlUG9pbnRUZXh0IiwiVGV4dFJ1bGVyLmdldFRleHRPZmZzZXRzIiwiVmVydGljYWxCb3VuZHNUZXh0TGF5b3V0IiwiVmVydGljYWxCb3VuZHNUZXh0TGF5b3V0LmNvbnN0cnVjdG9yIiwiVmVydGljYWxCb3VuZHNUZXh0TGF5b3V0LmxheW91dCJdLCJtYXBwaW5ncyI6IkFBS0EsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUVkLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztBQUVyQyxDQUFDLENBQUMsQ0FBQztBQ1JILElBQU0sU0FBUyxHQUFHLHdGQUF3RixDQUFDO0FBQzNHLElBQU0sU0FBUyxHQUFHLGtFQUFrRSxDQUFDO0FBQ3JGLElBQU0sU0FBUyxHQUFHLHNCQUFzQixDQUFDO0FBRXpDO0lBUUlBO1FBUkpDLGlCQWtDQ0E7UUE5QkdBLGVBQVVBLEdBQWdCQSxFQUFFQSxDQUFDQTtRQUU3QkEsZ0JBQVdBLEdBQUdBLFNBQVNBLENBQUNBO1FBR3BCQSxJQUFJQSxNQUFNQSxHQUFHQSxRQUFRQSxDQUFDQSxjQUFjQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtRQUNuREEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBb0JBLE1BQU1BLENBQUNBLENBQUNBO1FBQ3ZDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUVuQkEsSUFBSUEsVUFBVUEsQ0FBQ0EsU0FBU0EsRUFBRUEsVUFBQUEsSUFBSUE7WUFDMUJBLEtBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1lBQ2pCQSxLQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxrQkFBa0JBLENBQUNBLEtBQUlBLENBQUNBLENBQUNBO1FBQzdDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUVQQSxDQUFDQTtJQUVERCwrQkFBT0EsR0FBUEE7UUFDSUUsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsVUFBVUEsQ0FBQ0Es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TUFBWUE7UUFFMUNHLElBQUlBLFlBQVlBLEdBQUdBO1lBQ2ZBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQzlCQSxJQUFJQSxZQUFZQSxHQUFHQTtZQUNmQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUU5QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsWUFBWUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDbEVBLElBQUlBLENBQUNBLEdBQUdBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzdDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDL0VBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBQzFCQSxNQUFNQSxDQUFDQTtZQUNIQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEJBLENBQUNBLEVBQUtBLENBQUNBLEVBQUVBLENBQUNBLEVBQUtBLENBQUNBO1lBQ25CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFLQSxDQUFDQTtTQUN0QkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBU0EsQ0FBQ0E7WUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzNDLENBQUMsQ0FBQ0EsQ0FBQ0E7SUFDUEEsQ0FBQ0E7SUFFREgsMkVBQTJFQTtJQUMzRUEscUNBQXFDQTtJQUNyQ0EscUNBQXFDQTtJQUNyQ0EscUNBQXFDQTtJQUNyQ0EscUNBQXFDQTtJQUM5QkEsNkJBQVFBLEdBQWZBLFVBQWdCQSxNQUFNQSxFQUFFQSxNQUFNQTtRQUMxQkksTUFBTUEsQ0FBQ0E7WUFDSEEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0ZBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUVBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQy9GQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvRkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7U0FDbEdBLENBQUNBO0lBQ05BLENBQUNBO0lBQ0xKLDJCQUFDQTtBQUFEQSxDQUFDQSxBQWxFRCxJQWtFQztBQUVEO0lBTUlLLGNBQVlBLENBQWNBLEVBQUVBLENBQWNBLEVBQUVBLENBQWNBLEVBQUVBLENBQWNBO1FBQ3RFQyxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFD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SSxJQUFJQSxTQUFTQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUN0Q0EsU0FBU0EsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDekJBLFNBQVNBLENBQUNBLGFBQWFBLEdBQUdBLFFBQVFBLENBQUNBO1FBQ25DQSxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUV2QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDUkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7Z0JBQUNBLFNBQVNBLENBQUNBLFVBQVVBLEdBQUdBLEtBQUtBLENBQUNBLFVBQVVBLENBQUNBO1lBQzlEQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQTtnQkFBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0E7WUFDeERBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLFVBQVVBLENBQUNBO2dCQUFDQSxTQUFTQSxDQUFDQSxVQUFVQSxHQUFHQSxLQUFLQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUNsRUEsQ0FBQ0E7UUFFREEsSUFBSUEsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDbERBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLFdBQVdBLENBQUNBO1FBRTdCQSxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUM5QkEsS0FBS0EsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDcEJBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO1FBRTFCQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtR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QUFJQSxTQUFTQSxHQUFHQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNqQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDckJBLENBQUNBLENBQUNBLENBQUNBO1FBRUhBLElBQUlBLFVBQVVBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1FBQ25DQSxHQUFHQSxDQUFDQSxDQUFtQkEsVUFBV0EsRUFBN0JBLHVCQUFjQSxFQUFkQSxJQUE2QkEsQ0FBQ0E7WUFBOUJBLElBQUlBLFVBQVVBLEdBQUlBLFdBQVdBLElBQWZBO1lBQ2ZBLElBQUlBLGFBQWFBLEdBQUdBLFlBQVlBLENBQUNBLGFBQWFBLENBQzFDQSxVQUFVQSxFQUFFQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBO1lBQ3ZDQSxVQUFVQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtZQUVwQkEsU0FBU0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQTtZQUMzQ0EsWUFBWUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsYUFBYUEsRUFBRUEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7WUFDM0RBLFVBQVVBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBO1NBQ3RDQTtRQUNEQSxXQUFXQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtRQUVyQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDYkEsVUFBVUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFDM0JBLENBQUNBO0lBQ0xBLENBQUNBO0lBQ0xGLCtCQUFDQTtBQUFEQSxDQUFDQSxBQXBERCxJQW9EQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbnRlcmZhY2UgV2luZG93IHtcclxuICAgIGFwcDogQXBwQ29udHJvbGxlcjtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7ICBcclxuICAgIFxyXG4gICAgd2luZG93LmFwcCA9IG5ldyBBcHBDb250cm9sbGVyKCk7XHJcbiAgICBcclxufSk7XHJcbiIsIlxyXG5jb25zdCBBbWF0aWNVcmwgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3MvYW1hdGljc2MvdjgvSURua1JUUEdjclNWbzUwVXlZTks3eTNVU0JuU3Zwa29wUWFVUi0ycjdpVS50dGYnO1xyXG5jb25zdCBSb2JvdG8xMDAgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3Mvcm9ib3RvL3YxNS83TXlncVRlMnpzOVlrUDBhZEE5UVFRLnR0Zic7XHJcbmNvbnN0IFJvYm90bzUwMCA9ICdmb250cy9Sb2JvdG8tNTAwLnR0Zic7XHJcblxyXG5jbGFzcyBBcHBDb250cm9sbGVyIHtcclxuXHJcbiAgICBmb250OiBvcGVudHlwZS5Gb250O1xyXG4gICAgd2FycDogVGV4dFdhcnBDb250cm9sbGVyO1xyXG4gICAgdGV4dEJsb2NrczogVGV4dEJsb2NrW10gPSBbXTtcclxuICAgIHBhcGVyOiBwYXBlci5QYXBlclNjb3BlO1xyXG4gICAgY2FudmFzQ29sb3IgPSAnI0Y1RjZDRSc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5DYW52YXMnKTtcclxuICAgICAgICBwYXBlci5zZXR1cCg8SFRNTENhbnZhc0VsZW1lbnQ+Y2FudmFzKTtcclxuICAgICAgICB0aGlzLnBhcGVyID0gcGFwZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbmV3IEZvbnRMb2FkZXIoUm9ib3RvNTAwLCBmb250ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICAgICAgdGhpcy53YXJwID0gbmV3IFRleHRXYXJwQ29udHJvbGxlcih0aGlzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFkZFRleHQoKXtcclxuICAgICAgICBsZXQgdGV4dCA9ICQoJyNuZXdUZXh0JykudmFsKCk7XHJcbiAgICAgICAgaWYodGV4dC50cmltKCkubGVuZ3RoKXtcclxuICAgICAgICAgICAgbGV0IGJsb2NrID0gPFRleHRCbG9jaz4ge1xyXG4gICAgICAgICAgICAgICAgX2lkOiBuZXdpZCgpLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogdGV4dFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnRleHRCbG9ja3MucHVzaChibG9jayk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndhcnAudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnBhcGVyLnZpZXcuZHJhdygpO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBUZXh0QmxvY2sge1xyXG4gICAgX2lkOiBzdHJpbmc7XHJcbiAgICB0ZXh0OiBzdHJpbmc7XHJcbiAgICBpdGVtOiBwYXBlci5JdGVtO1xyXG59IiwiXHJcbmNsYXNzIEZvbnRMb2FkZXIge1xyXG5cclxuICAgIGlzTG9hZGVkOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnRVcmw6IHN0cmluZywgb25Mb2FkZWQ6IChmb250OiBvcGVudHlwZS5Gb250KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgb3BlbnR5cGUubG9hZChmb250VXJsLCBmdW5jdGlvbihlcnIsIGZvbnQpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9uTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgb25Mb2FkZWQuY2FsbCh0aGlzLCBmb250KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiXHJcbmZ1bmN0aW9uIG5ld2lkKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gKG5ldyBEYXRlKCkuZ2V0VGltZSgpK01hdGgucmFuZG9tKCkpLnRvU3RyaW5nKDM2KTtcclxufVxyXG4iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL3BhcGVyLmQudHNcIiAvPlxyXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJMaW5rZWRQYXRocy50c1wiIC8+XHJcblxyXG5pbnRlcmZhY2UgV2luZG93IHtcclxuICAgIHRleHRUcmFjZTogYW55O1xyXG59XHJcblxyXG53aW5kb3cudGV4dFRyYWNlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCd0ZXh0VHJhY2Ugc3RhcnRlZCcpO1xyXG5cclxuICAgIGNvbnN0IHBzMjMgPSBcIlRoZSBMb3JkIGlzIG15IHNoZXBoZXJkOyBJIHNoYWxsIG5vdCB3YW50LiBIZSBtYWtlcyBtZSBsaWUgZG93biBpbiBncmVlbiBwYXN0dXJlcy4gSGUgbGVhZHMgbWUgYmVzaWRlIHN0aWxsIHdhdGVycy4gSGUgcmVzdG9yZXMgbXkgc291bC4gSGUgbGVhZHMgbWUgaW4gcGF0aHMgb2YgcmlnaHRlb3VzbmVzcyBmb3IgaGlzIG5hbWUncyBzYWtlLiBFdmVuIHRob3VnaCBJIHdhbGsgdGhyb3VnaCB0aGUgdmFsbGV5IG9mIHRoZSBzaGFkb3cgb2YgZGVhdGgsIEkgd2lsbCBmZWFyIG5vIGV2aWwsIGZvciB5b3UgYXJlIHdpdGggbWU7IHlvdXIgcm9kIGFuZCB5b3VyIHN0YWZmLCB0aGV5IGNvbWZvcnQgbWUuIFlvdSBwcmVwYXJlIGEgdGFibGUgYmVmb3JlIG1lIGluIHRoZSBwcmVzZW5jZSBvZiBteSBlbmVtaWVzOyB5b3UgYW5vaW50IG15IGhlYWQgd2l0aCBvaWw7IG15IGN1cCBvdmVyZmxvd3MuIFN1cmVseSBnb29kbmVzcyBhbmQgbWVyY3kgc2hhbGwgZm9sbG93IG1lIGFsbCB0aGUgZGF5cyBvZiBteSBsaWZlLCBhbmQgSSBzaGFsbCBkd2VsbCBpbiB0aGUgaG91c2Ugb2YgdGhlIExvcmQgZm9yZXZlci5cIjtcclxuICAgIGxldCBkcmF3UGF0aHMgPSBuZXcgTGlua2VkUGF0aEdyb3VwKCk7XHJcbiAgICBsZXQgdGV4dFNpemUgPSA2NDtcclxuICAgIGxldCB0ZXh0UGF0aCA9IG5ldyBQYXRoVGV4dChkcmF3UGF0aHMsIHBzMjMsIHtmb250U2l6ZTogdGV4dFNpemV9KTtcclxuICAgIGxldCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgbGV0IGN1cnJlbnRQYXRoOiBwYXBlci5QYXRoO1xyXG5cclxuICAgIGZ1bmN0aW9uIHN0YXJ0UGF0aChwb2ludCkge1xyXG4gICAgICAgIGlmKGN1cnJlbnRQYXRoKXtcclxuICAgICAgICAgICAgZmluaXNoUGF0aCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50UGF0aCA9IG5ldyBwYXBlci5QYXRoKHtzdHJva2VDb2xvcjogJ2xpZ2h0Z3JheScsIHN0cm9rZVdpZHRoOiB0ZXh0U2l6ZX0pO1xyXG4gICAgICAgIGRyYXdQYXRocy5hZGRDaGlsZChjdXJyZW50UGF0aCk7XHJcbiAgICAgICAgY3VycmVudFBhdGguYWRkKHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRQYXRoKHBvaW50KSB7XHJcbiAgICAgICAgaWYoY3VycmVudFBhdGgpe1xyXG4gICAgICAgICAgICBjdXJyZW50UGF0aC5hZGQocG9pbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmaW5pc2hQYXRoKCl7XHJcbiAgICAgICAgY3VycmVudFBhdGguc2ltcGxpZnkodGV4dFNpemUgLyAyKTtcclxuICAgICAgICB0ZXh0UGF0aC51cGRhdGUoKTtcclxuICAgICAgICBjdXJyZW50UGF0aC52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgY3VycmVudFBhdGggPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB0b29sID0gbmV3IHBhcGVyLlRvb2woKTtcclxuXHJcbiAgICB0b29sLm9uTW91c2VEcmFnID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBsZXQgcG9pbnQgPSBldmVudC5taWRkbGVQb2ludDtcclxuICAgICAgICBcclxuICAgICAgICBpZighY3VycmVudFBhdGgpe1xyXG4gICAgICAgICAgICBzdGFydFBhdGgocG9pbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIE5vOiBuZWVkIHRvIGNoZWNrIGlmIHNhbWUgc2VnbWVudCFcclxuICAgICAgICAvLyBsZXQgbmVhcmVzdCA9IGRyYXdQYXRocy5nZXROZWFyZXN0UG9pbnQocG9pbnQpO1xyXG4gICAgICAgIC8vIGlmKG5lYXJlc3QpIHtcclxuICAgICAgICAvLyAgICAgbGV0IG5lYXJlc3REaXN0ID0gbmVhcmVzdC5nZXREaXN0YW5jZShwb2ludCk7XHJcbiAgICAgICAgLy8gICAgIGlmKG5lYXJlc3QgJiYgbmVhcmVzdERpc3QgPD0gdGV4dFNpemUpe1xyXG4gICAgICAgIC8vICAgICAgICAgZmluaXNoUGF0aCgpO1xyXG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuOyAgICAgICAgXHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgYXBwZW5kUGF0aChwb2ludCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9vbC5vbk1vdXNlVXAgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGZpbmlzaFBhdGgoKTtcclxuICAgIH1cclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInR5cGluZ3MvcGFwZXIuZC50c1wiIC8+XHJcblxyXG5jbGFzcyBUZXh0V2FycENvbnRyb2xsZXIge1xyXG4gICAgYXBwOiBBcHBDb250cm9sbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwQ29udHJvbGxlcikge1xyXG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG5ldyBNb3VzZUJlaGF2aW9yVG9vbChwYXBlcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHVwZGF0ZSgpe1xyXG4gICAgICAgIGZvcihsZXQgYmxvY2sgb2YgdGhpcy5hcHAudGV4dEJsb2Nrcyl7XHJcbiAgICAgICAgICAgIGlmKCFibG9jay5pdGVtKXtcclxuICAgICAgICAgICAgICAgIGxldCBzdHJldGNoeSA9IG5ldyBTdHJldGNoeVRleHQoYmxvY2sudGV4dCwgdGhpcy5hcHAuZm9udCwgNjQpO1xyXG4gICAgICAgICAgICAgICAgLy9zdHJldGNoeS50cmFuc2xhdGUobmV3IHBhcGVyLlBvaW50KDMwLCAzMCkpO1xyXG4gICAgICAgICAgICAgICAgYmxvY2suaXRlbSA9IHN0cmV0Y2h5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZpZGRsZXN0aWNrcygpe1xyXG4gICAgICAgIGNvbnN0IHNhbXBsZVRleHQgPSBcIkZpZGRsZXN0aWNrc1wiO1xyXG4gICAgICAgIHZhciBsaW5lRHJhdyA9IG5ldyBMaW5lRHJhd1Rvb2woKTtcclxuICAgICAgICBsZXQgcHJldlBhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgbGluZURyYXcub25QYXRoRmluaXNoZWQgPSAocGF0aCkgPT4ge1xyXG4gICAgICAgICAgICBwYXRoLmZsYXR0ZW4oNDApO1xyXG4gICAgICAgICAgICBwYXRoLnNtb290aCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYocHJldlBhdGgpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGxheW91dCA9IG5ldyBWZXJ0aWNhbEJvdW5kc1RleHRMYXlvdXQocGF0aCwgcHJldlBhdGgpO1xyXG4gICAgICAgICAgICAgICAgbGF5b3V0LmxheW91dChzYW1wbGVUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLmZvbnQsIFxyXG4gICAgICAgICAgICAgICAgICAgIChpdGVtKSA9PiB0aGlzLmFwcC5wYXBlci52aWV3LmRyYXcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHByZXZQYXRoID0gcGF0aDtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5kZWNsYXJlIHZhciBzb2x2ZTogKGE6IGFueSwgYjogYW55LCBmYXN0OiBib29sZWFuKSA9PiB2b2lkO1xyXG5cclxuY2xhc3MgUGVyc3BlY3RpdmVUcmFuc2Zvcm0ge1xyXG4gICAgXHJcbiAgICBzb3VyY2U6IFF1YWQ7XHJcbiAgICBkZXN0OiBRdWFkO1xyXG4gICAgcGVyc3A6IGFueTtcclxuICAgIG1hdHJpeDogbnVtYmVyW107XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZTogUXVhZCwgZGVzdDogUXVhZCl7XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5kZXN0ID0gZGVzdDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm1hdHJpeCA9IFBlcnNwZWN0aXZlVHJhbnNmb3JtLmNyZWF0ZU1hdHJpeChzb3VyY2UsIGRlc3QpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBHaXZlbiBhIDR4NCBwZXJzcGVjdGl2ZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXgsIGFuZCBhIDJEIHBvaW50IChhIDJ4MSB2ZWN0b3IpLFxyXG4gICAgLy8gYXBwbGllcyB0aGUgdHJhbnNmb3JtYXRpb24gbWF0cml4IGJ5IGNvbnZlcnRpbmcgdGhlIHBvaW50IHRvIGhvbW9nZW5lb3VzXHJcbiAgICAvLyBjb29yZGluYXRlcyBhdCB6PTAsIHBvc3QtbXVsdGlwbHlpbmcsIGFuZCB0aGVuIGFwcGx5aW5nIGEgcGVyc3BlY3RpdmUgZGl2aWRlLlxyXG4gICAgdHJhbnNmb3JtUG9pbnQocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIGxldCBwMyA9IFBlcnNwZWN0aXZlVHJhbnNmb3JtLm11bHRpcGx5KHRoaXMubWF0cml4LCBbcG9pbnQueCwgcG9pbnQueSwgMCwgMV0pO1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgcGFwZXIuUG9pbnQocDNbMF0gLyBwM1szXSwgcDNbMV0gLyBwM1szXSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGNyZWF0ZU1hdHJpeChzb3VyY2U6IFF1YWQsIHRhcmdldDogUXVhZCk6IG51bWJlcltdIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc291cmNlUG9pbnRzID0gW1xyXG4gICAgICAgICAgICBbc291cmNlLmEueCwgc291cmNlLmEueV0sIFxyXG4gICAgICAgICAgICBbc291cmNlLmIueCwgc291cmNlLmIueV0sIFxyXG4gICAgICAgICAgICBbc291cmNlLmMueCwgc291cmNlLmMueV0sIFxyXG4gICAgICAgICAgICBbc291cmNlLmQueCwgc291cmNlLmQueV1dO1xyXG4gICAgICAgIGxldCB0YXJnZXRQb2ludHMgPSBbXHJcbiAgICAgICAgICAgIFt0YXJnZXQuYS54LCB0YXJnZXQuYS55XSwgXHJcbiAgICAgICAgICAgIFt0YXJnZXQuYi54LCB0YXJnZXQuYi55XSwgXHJcbiAgICAgICAgICAgIFt0YXJnZXQuYy54LCB0YXJnZXQuYy55XSwgXHJcbiAgICAgICAgICAgIFt0YXJnZXQuZC54LCB0YXJnZXQuZC55XV07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IFtdLCBiID0gW10sIGkgPSAwLCBuID0gc291cmNlUG9pbnRzLmxlbmd0aDsgaSA8IG47ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgcyA9IHNvdXJjZVBvaW50c1tpXSwgdCA9IHRhcmdldFBvaW50c1tpXTtcclxuICAgICAgICAgICAgYS5wdXNoKFtzWzBdLCBzWzFdLCAxLCAwLCAwLCAwLCAtc1swXSAqIHRbMF0sIC1zWzFdICogdFswXV0pLCBiLnB1c2godFswXSk7XHJcbiAgICAgICAgICAgIGEucHVzaChbMCwgMCwgMCwgc1swXSwgc1sxXSwgMSwgLXNbMF0gKiB0WzFdLCAtc1sxXSAqIHRbMV1dKSwgYi5wdXNoKHRbMV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IFggPSBzb2x2ZShhLCBiLCB0cnVlKTsgXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgWFswXSwgWFszXSwgMCwgWFs2XSxcclxuICAgICAgICAgICAgWFsxXSwgWFs0XSwgMCwgWFs3XSxcclxuICAgICAgICAgICAgICAgMCwgICAgMCwgMSwgICAgMCxcclxuICAgICAgICAgICAgWFsyXSwgWFs1XSwgMCwgICAgMVxyXG4gICAgICAgIF0ubWFwKGZ1bmN0aW9uKHgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoeCAqIDEwMDAwMCkgLyAxMDAwMDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUG9zdC1tdWx0aXBseSBhIDR4NCBtYXRyaXggaW4gY29sdW1uLW1ham9yIG9yZGVyIGJ5IGEgNHgxIGNvbHVtbiB2ZWN0b3I6XHJcbiAgICAvLyBbIG0wIG00IG04ICBtMTIgXSAgIFsgdjAgXSAgIFsgeCBdXHJcbiAgICAvLyBbIG0xIG01IG05ICBtMTMgXSAqIFsgdjEgXSA9IFsgeSBdXHJcbiAgICAvLyBbIG0yIG02IG0xMCBtMTQgXSAgIFsgdjIgXSAgIFsgeiBdXHJcbiAgICAvLyBbIG0zIG03IG0xMSBtMTUgXSAgIFsgdjMgXSAgIFsgdyBdXHJcbiAgICBzdGF0aWMgbXVsdGlwbHkobWF0cml4LCB2ZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBtYXRyaXhbMF0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNF0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbOCBdICogdmVjdG9yWzJdICsgbWF0cml4WzEyXSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzFdICogdmVjdG9yWzBdICsgbWF0cml4WzVdICogdmVjdG9yWzFdICsgbWF0cml4WzkgXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxM10gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFsyXSAqIHZlY3RvclswXSArIG1hdHJpeFs2XSAqIHZlY3RvclsxXSArIG1hdHJpeFsxMF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTRdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbM10gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbN10gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbMTFdICogdmVjdG9yWzJdICsgbWF0cml4WzE1XSAqIHZlY3RvclszXVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFF1YWQge1xyXG4gICAgYTogcGFwZXIuUG9pbnQ7XHJcbiAgICBiOiBwYXBlci5Qb2ludDtcclxuICAgIGM6IHBhcGVyLlBvaW50O1xyXG4gICAgZDogcGFwZXIuUG9pbnQ7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCwgYzogcGFwZXIuUG9pbnQsIGQ6IHBhcGVyLlBvaW50KXtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgICAgIHRoaXMuYiA9IGI7XHJcbiAgICAgICAgdGhpcy5jID0gYztcclxuICAgICAgICB0aGlzLmQgPSBkO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgZnJvbVJlY3RhbmdsZShyZWN0OiBwYXBlci5SZWN0YW5nbGUpe1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhZChcclxuICAgICAgICAgICAgcmVjdC50b3BMZWZ0LFxyXG4gICAgICAgICAgICByZWN0LnRvcFJpZ2h0LFxyXG4gICAgICAgICAgICByZWN0LmJvdHRvbUxlZnQsXHJcbiAgICAgICAgICAgIHJlY3QuYm90dG9tUmlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgZnJvbUNvb3Jkcyhjb29yZHM6IG51bWJlcltdKSA6IFF1YWQge1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhZChcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1swXSwgY29vcmRzWzFdKSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1syXSwgY29vcmRzWzNdKSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1s0XSwgY29vcmRzWzVdKSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1s2XSwgY29vcmRzWzddKVxyXG4gICAgICAgIClcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXNDb29yZHMoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHRoaXMuYS54LCB0aGlzLmEueSxcclxuICAgICAgICAgICAgdGhpcy5iLngsIHRoaXMuYi55LFxyXG4gICAgICAgICAgICB0aGlzLmMueCwgdGhpcy5jLnksXHJcbiAgICAgICAgICAgIHRoaXMuZC54LCB0aGlzLmQueVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgQm90dG9tVGV4dExheW91dCBpbXBsZW1lbnRzIFRleHRMYXlvdXQge1xyXG5cclxuICAgIGJvdHRvbTogcGFwZXIuUGF0aFxyXG4gICAgZm9udFNpemUgPSAxMDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYm90dG9tOiBwYXBlci5QYXRoKSB7XHJcbiAgICAgICAgdGhpcy5ib3R0b20gPSBib3R0b207XHJcbiAgICB9XHJcblxyXG4gICAgbGF5b3V0KHRleHQ6IHN0cmluZywgb25Db21wbGV0ZT86IChpdGVtOiBwYXBlci5JdGVtKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgbmV3IEZvbnRMb2FkZXIoQW1hdGljVXJsLCBmb250ID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBsZXR0ZXJHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgICAgICBsZXQgbGV0dGVyUGF0aHMgPSBmb250LmdldFBhdGhzKHRleHQsIDAsIDAsIHRoaXMuZm9udFNpemUpXHJcbiAgICAgICAgICAgICAgICAubWFwKHAgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRoID0gUGFwZXJIZWxwZXJzLmltcG9ydE9wZW5UeXBlUGF0aChwKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXR0ZXJHcm91cC5hZGRDaGlsZChwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IHRleHRPcmlnaW4gPSBsZXR0ZXJHcm91cC5ib3VuZHMuYm90dG9tTGVmdDtcclxuICAgICAgICAgICAgbGV0IGxpbmVhckxlbmd0aCA9IGxldHRlckdyb3VwLmJvdW5kcy53aWR0aDtcclxuICAgICAgICAgICAgbGV0IGxheW91dFBhdGhMZW5ndGggPSB0aGlzLmJvdHRvbS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBvZmZzZXRTY2FsaW5nID0gbGF5b3V0UGF0aExlbmd0aCAvIGxpbmVhckxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGxldCBpZHggPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBsZXR0ZXJQYXRoIG9mIGxldHRlclBhdGhzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGV0dGVyT2Zmc2V0ID0gKGxldHRlclBhdGguYm91bmRzLmxlZnQgLSB0ZXh0T3JpZ2luLngpICogb2Zmc2V0U2NhbGluZztcclxuICAgICAgICAgICAgICAgIGxldCBib3R0b21MZWZ0UHJpbWUgPSB0aGlzLmJvdHRvbS5nZXRQb2ludEF0KGxldHRlck9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm90dG9tUmlnaHRQcmltZSA9IHRoaXMuYm90dG9tLmdldFBvaW50QXQoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4obGF5b3V0UGF0aExlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyT2Zmc2V0ICsgbGV0dGVyUGF0aC5ib3VuZHMud2lkdGggKiBvZmZzZXRTY2FsaW5nKSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm90dG9tVmVjdG9yUHJpbWUgPSBib3R0b21SaWdodFByaW1lLnN1YnRyYWN0KGJvdHRvbUxlZnRQcmltZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJvdGF0ZUFuZ2xlID1cclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMSwgMCkuZ2V0RGlyZWN0ZWRBbmdsZShib3R0b21SaWdodFByaW1lLnN1YnRyYWN0KGJvdHRvbUxlZnRQcmltZSkpXHJcbiAgICAgICAgICAgICAgICAvLyByZXBvc2l0aW9uIHVzaW5nIGJvdHRvbUxlZnRcclxuICAgICAgICAgICAgICAgIGxldHRlclBhdGgucG9zaXRpb24gPSBib3R0b21MZWZ0UHJpbWVcclxuICAgICAgICAgICAgICAgICAgICAuYWRkKGxldHRlclBhdGguYm91bmRzLmNlbnRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3VidHJhY3QobGV0dGVyUGF0aC5ib3VuZHMuYm90dG9tTGVmdCkpO1xyXG4gICAgICAgICAgICAgICAgbGV0dGVyUGF0aC5yb3RhdGUocm90YXRlQW5nbGUsIGJvdHRvbUxlZnRQcmltZSk7XHJcbiAgICAgICAgICAgICAgICBsZXR0ZXJQYXRoLnNjYWxlKG9mZnNldFNjYWxpbmcsIGJvdHRvbUxlZnRQcmltZSk7XHJcbiAgICAgICAgICAgICAgICBpZHgrKztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYob25Db21wbGV0ZSl7XHJcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlKGxldHRlckdyb3VwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBQYXRoT2Zmc2V0U2NhbGluZyB7XHJcblxyXG4gICAgdG86IHBhcGVyLlBhdGg7XHJcbiAgICBzY2FsZTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZyb21MZW5ndGg6IG51bWJlciwgdG86IHBhcGVyLlBhdGgpIHtcclxuICAgICAgICB0aGlzLnRvID0gdG87XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IHRvLmxlbmd0aCAvIGZyb21MZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VG9Qb2ludEF0KGZyb21QYXRoT2Zmc2V0OiBudW1iZXIpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgbGV0IHRvT2Zmc2V0ID0gTWF0aC5taW4odGhpcy50by5sZW5ndGgsIGZyb21QYXRoT2Zmc2V0ICogdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG8uZ2V0UG9pbnRBdCh0b09mZnNldCk7XHJcbiAgICB9XHJcbn0iLCJcclxuLyoqXHJcbiAqIEhhbmRsZSB0aGF0IHNpdHMgb24gbWlkcG9pbnQgb2YgY3VydmVcclxuICogd2hpY2ggd2lsbCBzcGxpdCB0aGUgY3VydmUgd2hlbiBkcmFnZ2VkLlxyXG4gKi9cclxuY2xhc3MgQ3VydmVTcGxpdHRlckhhbmRsZSBleHRlbmRzIHBhcGVyLlNoYXBlIHtcclxuIFxyXG4gICAgY3VydmU6IHBhcGVyLkN1cnZlO1xyXG4gICAgb25EcmFnRW5kOiAobmV3U2VnbWVudDogcGFwZXIuU2VnbWVudCwgZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuIFxyXG4gICAgY29uc3RydWN0b3IoY3VydmU6IHBhcGVyLkN1cnZlKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnZlID0gY3VydmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNlbGYgPSA8YW55PnRoaXM7XHJcbiAgICAgICAgc2VsZi5fdHlwZSA9ICdjaXJjbGUnO1xyXG4gICAgICAgIHNlbGYuX3JhZGl1cyA9IDU7XHJcbiAgICAgICAgc2VsZi5fc2l6ZSA9IG5ldyBwYXBlci5TaXplKHNlbGYuX3JhZGl1cyAqIDIpO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKGN1cnZlLmdldFBvaW50QXQoMC41ICogY3VydmUubGVuZ3RoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDI7XHJcbiAgICAgICAgdGhpcy5zdHJva2VDb2xvciA9ICdibHVlJztcclxuICAgICAgICB0aGlzLmZpbGxDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gMC41ICogMC4zOyBcclxuIFxyXG4gICAgICAgIGxldCBuZXdTZWdtZW50OiBwYXBlci5TZWdtZW50O1xyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IDxNb3VzZUJlaGF2aW9yPntcclxuICAgICAgICAgICAgb25EcmFnU3RhcnQ6IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudCA9IG5ldyBwYXBlci5TZWdtZW50KHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY3VydmUucGF0aC5pbnNlcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmUuaW5kZXggKyAxLCBcclxuICAgICAgICAgICAgICAgICAgICBuZXdTZWdtZW50XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWc6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdQb3MgPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zO1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudC5wb2ludCA9IG5ld1BvcztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnRW5kOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uRHJhZ0VuZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkRyYWdFbmQobmV3U2VnbWVudCwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG4iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL3BhcGVyLmQudHNcIiAvPlxyXG5cclxuY2xhc3MgTGluZURyYXdUb29sIHtcclxuICAgIGdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICBjdXJyZW50UGF0aDogcGFwZXIuUGF0aDtcclxuICAgIG9uUGF0aEZpbmlzaGVkOiAocGF0aDogcGFwZXIuUGF0aCkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB2YXIgdG9vbCA9IG5ldyBwYXBlci5Ub29sKCk7XHJcblxyXG4gICAgICAgIHRvb2wub25Nb3VzZURyYWcgPSBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IGV2ZW50Lm1pZGRsZVBvaW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRQYXRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UGF0aChwb2ludCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kUGF0aChwb2ludCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b29sLm9uTW91c2VVcCA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5maW5pc2hQYXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0UGF0aChwb2ludCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmluaXNoUGF0aCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbmV3IHBhcGVyLlBhdGgoeyBzdHJva2VDb2xvcjogJ2xpZ2h0Z3JheScsIHN0cm9rZVdpZHRoOiAyIH0pO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuYWRkQ2hpbGQodGhpcy5jdXJyZW50UGF0aCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5hZGQocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZFBhdGgocG9pbnQpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLmFkZChwb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbmlzaFBhdGgoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5zaW1wbGlmeSg1KTtcclxuICAgICAgICAgICAgbGV0IHBhdGggPSB0aGlzLmN1cnJlbnRQYXRoO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25QYXRoRmluaXNoZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25QYXRoRmluaXNoZWQuY2FsbCh0aGlzLCBwYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInR5cGluZ3MvcGFwZXIuZC50c1wiIC8+XHJcblxyXG5pbnRlcmZhY2UgUGF0aExpa2Uge1xyXG4gICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICBnZXRMb2NhdGlvbkF0KG9mZnNldDogbnVtYmVyLCBpc1BhcmFtZXRlcj86IGJvb2xlYW4pOiBwYXBlci5DdXJ2ZUxvY2F0aW9uO1xyXG4gICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlciwgaXNQYXRhbWV0ZXI/OiBib29sZWFuKTogcGFwZXIuUG9pbnQ7XHJcbiAgICBnZXRUYW5nZW50QXQob2Zmc2V0OiBudW1iZXIsIGlzUGF0YW1ldGVyPzogYm9vbGVhbik6IHBhcGVyLlBvaW50O1xyXG4gICAgZ2V0TmVhcmVzdFBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50O1xyXG59XHJcblxyXG5jbGFzcyBMaW5rZWRQYXRoR3JvdXAgZXh0ZW5kcyBwYXBlci5Hcm91cFxyXG4gICAgaW1wbGVtZW50cyBQYXRoTGlrZSBcclxue1xyXG4gICAgXHJcbiAgICBhZGRDaGlsZChwYXRoOiBwYXBlci5QYXRoKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFkZENoaWxkKHBhdGgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnJlZHVjZSgoYSwgYjogcGFwZXIuUGF0aCkgPT4gYSArIGIubGVuZ3RoLCAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldCBwYXRocygpOiBwYXBlci5QYXRoW10ge1xyXG4gICAgICAgIHJldHVybiA8cGFwZXIuUGF0aFtdPnRoaXMuY2hpbGRyZW47XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldExvY2F0aW9uQXQob2Zmc2V0OiBudW1iZXIsIGlzUGFyYW1ldGVyPzogYm9vbGVhbik6IHBhcGVyLkN1cnZlTG9jYXRpb257XHJcbiAgICAgICAgbGV0IHBhdGg6IHBhcGVyLlBhdGggPSBudWxsO1xyXG4gICAgICAgIGZvcihwYXRoIG9mIHRoaXMucGF0aHMpe1xyXG4gICAgICAgICAgICBsZXQgbGVuID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmKGxlbiA+PSBvZmZzZXQpe1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb2Zmc2V0IC09IGxlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGguZ2V0TG9jYXRpb25BdChvZmZzZXQsIGlzUGFyYW1ldGVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlciwgaXNQYXJhbWV0ZXI/OiBib29sZWFuKTogcGFwZXIuUG9pbnR7XHJcbiAgICAgICAgbGV0IHBhdGg6IHBhcGVyLlBhdGggPSBudWxsO1xyXG4gICAgICAgIGZvcihwYXRoIG9mIHRoaXMucGF0aHMpe1xyXG4gICAgICAgICAgICBsZXQgbGVuID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmKGxlbiA+PSBvZmZzZXQpe1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb2Zmc2V0IC09IGxlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGguZ2V0UG9pbnRBdChvZmZzZXQsIGlzUGFyYW1ldGVyKTsgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFRhbmdlbnRBdChvZmZzZXQ6IG51bWJlciwgaXNQYXRhbWV0ZXI/OiBib29sZWFuKTogcGFwZXIuUG9pbnR7XHJcbiAgICAgICAgbGV0IHBhdGg6IHBhcGVyLlBhdGggPSBudWxsO1xyXG4gICAgICAgIGZvcihwYXRoIG9mIHRoaXMucGF0aHMpe1xyXG4gICAgICAgICAgICBsZXQgbGVuID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmKGxlbiA+PSBvZmZzZXQpe1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb2Zmc2V0IC09IGxlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGguZ2V0VGFuZ2VudEF0KG9mZnNldCwgaXNQYXRhbWV0ZXIpOyAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0TmVhcmVzdFBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBsZXQgbmVhcmVzdEFnZzogcGFwZXIuUG9pbnQ7XHJcbiAgICAgICAgbGV0IGRpc3RBZ2c6IG51bWJlcjtcclxuICAgICAgICBmb3IobGV0IHBhdGggb2YgdGhpcy5wYXRocyl7XHJcbiAgICAgICAgICAgIGlmKHBhdGguc2VnbWVudHMubGVuZ3RoIDwgMil7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbmVhcmVzdCA9IHBhdGguZ2V0TmVhcmVzdFBvaW50KHBvaW50KTtcclxuICAgICAgICAgICAgbGV0IGRpc3QgPSBuZWFyZXN0LmdldERpc3RhbmNlKHBvaW50KTtcclxuICAgICAgICAgICAgaWYoIW5lYXJlc3RBZ2cgfHwgZGlzdCA8IGRpc3RBZ2cpe1xyXG4gICAgICAgICAgICAgICAgbmVhcmVzdEFnZyA9IG5lYXJlc3Q7XHJcbiAgICAgICAgICAgICAgICBkaXN0QWdnID0gZGlzdDsgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmVhcmVzdEFnZztcclxuICAgIH1cclxufSIsIlxyXG5kZWNsYXJlIG1vZHVsZSBwYXBlciB7XHJcbiAgICBpbnRlcmZhY2UgSXRlbSB7XHJcbiAgICAgICAgbW91c2VCZWhhdmlvcjogTW91c2VCZWhhdmlvcjtcclxuICAgIH0gXHJcbn1cclxuXHJcbmludGVyZmFjZSBNb3VzZUJlaGF2aW9yIHtcclxuICAgIG9uQ2xpY2s/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIFxyXG4gICAgb25EcmFnU3RhcnQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDsgXHJcbiAgICBvbkRyYWc/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uRHJhZ0VuZD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgTW91c2VBY3Rpb24ge1xyXG4gICAgc3RhcnRFdmVudDogcGFwZXIuVG9vbEV2ZW50O1xyXG4gICAgaXRlbTogcGFwZXIuSXRlbTtcclxuICAgIGRyYWdnZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmNsYXNzIE1vdXNlQmVoYXZpb3JUb29sIGV4dGVuZHMgcGFwZXIuVG9vbCB7XHJcblxyXG4gICAgaGl0T3B0aW9ucyA9IHtcclxuICAgICAgICBzZWdtZW50czogdHJ1ZSxcclxuICAgICAgICBzdHJva2U6IHRydWUsXHJcbiAgICAgICAgZmlsbDogdHJ1ZSxcclxuICAgICAgICB0b2xlcmFuY2U6IDVcclxuICAgIH07XHJcblxyXG4gICAgYWN0aW9uOiBNb3VzZUFjdGlvbjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocGFwZXJTY29wZTogcGFwZXIuUGFwZXJTY29wZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24gPSAoZXZlbnQpID0+IHtcclxuICAgICAgICB0aGlzLmFjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgICAgIHZhciBoaXRSZXN1bHQgPSBwYXBlci5wcm9qZWN0LmhpdFRlc3QoXHJcbiAgICAgICAgICAgIGV2ZW50LnBvaW50LFxyXG4gICAgICAgICAgICB0aGlzLmhpdE9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAoaGl0UmVzdWx0ICYmIGhpdFJlc3VsdC5pdGVtKSB7XHJcbiAgICAgICAgICAgIGxldCBkcmFnZ2FibGUgPSB0aGlzLmZpbmREcmFnZ2FibGVVcHdhcmQoaGl0UmVzdWx0Lml0ZW0pO1xyXG4gICAgICAgICAgICBpZihkcmFnZ2FibGUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSA8TW91c2VBY3Rpb24+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtOiBkcmFnZ2FibGVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vdGhpcy5wYXBlclNjb3BlLnByb2plY3QuYWN0aXZlTGF5ZXIuYWRkQ2hpbGQodGhpcy5kcmFnSXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURyYWcgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICBpZih0aGlzLmFjdGlvbil7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmFjdGlvbi5kcmFnZ2VkKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uLmRyYWdnZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5hY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ1N0YXJ0KXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnU3RhcnQuY2FsbChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24uaXRlbSwgdGhpcy5hY3Rpb24uc3RhcnRFdmVudCk7IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWcpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZy5jYWxsKHRoaXMuYWN0aW9uLml0ZW0sIGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgb25Nb3VzZVVwID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYodGhpcy5hY3Rpb24pe1xyXG4gICAgICAgICAgICBsZXQgYWN0aW9uID0gdGhpcy5hY3Rpb247XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKGFjdGlvbi5kcmFnZ2VkKXtcclxuICAgICAgICAgICAgICAgIC8vIGRyYWdcclxuICAgICAgICAgICAgICAgIGlmKGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnRW5kKXtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ0VuZC5jYWxsKGFjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9ICAgXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjbGlja1xyXG4gICAgICAgICAgICAgICAgaWYoYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkNsaWNrKXtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uQ2xpY2suY2FsbChhY3Rpb24uaXRlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBmaW5kRHJhZ2dhYmxlVXB3YXJkKGl0ZW06IHBhcGVyLkl0ZW0pOiBwYXBlci5JdGVte1xyXG4gICAgICAgIHdoaWxlKCFpdGVtLm1vdXNlQmVoYXZpb3IgJiYgaXRlbS5wYXJlbnQgJiYgaXRlbS5wYXJlbnQuY2xhc3NOYW1lICE9ICdMYXllcicpe1xyXG4gICAgICAgICAgICBpdGVtID0gaXRlbS5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtLm1vdXNlQmVoYXZpb3JcclxuICAgICAgICAgICAgPyBpdGVtXHJcbiAgICAgICAgICAgIDogbnVsbDtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgUGFwZXJIZWxwZXJzIHtcclxuICAgIFxyXG4gICAgc3RhdGljIGltcG9ydE9wZW5UeXBlUGF0aChvcGVuUGF0aDogb3BlbnR5cGUuUGF0aCk6IHBhcGVyLkNvbXBvdW5kUGF0aFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKG9wZW5QYXRoLnRvUGF0aERhdGEoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gbGV0IHN2ZyA9IG9wZW5QYXRoLnRvU1ZHKDQpO1xyXG4gICAgICAgIC8vIHJldHVybiA8cGFwZXIuUGF0aD5wYXBlci5wcm9qZWN0LmltcG9ydFNWRyhzdmcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgdHJhY2VQYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuUGF0aEl0ZW0ge1xyXG4gICAgICAgIGlmKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJyl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNlQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIHRyYWNlQ29tcG91bmRQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICBpZighcGF0aC5jaGlsZHJlbi5sZW5ndGgpe1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBhdGhzID0gcGF0aC5jaGlsZHJlbi5tYXAocCA9PiBcclxuICAgICAgICAgICAgdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cCwgcG9pbnRzUGVyUGF0aCkpO1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHtcclxuICAgICAgICAgICAgY2hpbGRyZW46IHBhdGhzLFxyXG4gICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlLFxyXG4gICAgICAgICAgICBmaWxsQ29sb3I6ICdsaWdodGdyYXknXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgXHJcbiAgICBzdGF0aWMgdHJhY2VQYXRoKHBhdGg6IHBhcGVyLlBhdGgsIG51bVBvaW50czogbnVtYmVyKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgLy8gaWYoIXBhdGggfHwgIXBhdGguc2VnbWVudHMgfHwgcGF0aC5zZWdtZW50cy5sZW5ndGgpe1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gbmV3IHBhcGVyLlBhdGgoKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgbGV0IHBhdGhMZW5ndGggPSBwYXRoLmxlbmd0aDtcclxuICAgICAgICBsZXQgb2Zmc2V0SW5jciA9IHBhdGhMZW5ndGggLyBudW1Qb2ludHM7XHJcbiAgICAgICAgbGV0IHBvaW50cyA9IFtdO1xyXG4gICAgICAgIC8vcG9pbnRzLmxlbmd0aCA9IG51bVBvaW50cztcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgd2hpbGUoaSsrIDwgbnVtUG9pbnRzKXtcclxuICAgICAgICAgICAgbGV0IHBvaW50ID0gcGF0aC5nZXRQb2ludEF0KE1hdGgubWluKG9mZnNldCwgcGF0aExlbmd0aCkpO1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChwb2ludCk7XHJcbiAgICAgICAgICAgIG9mZnNldCArPSBvZmZzZXRJbmNyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB2YXIgcGF0aCA9IG5ldyBwYXBlci5QYXRoKHBvaW50cyk7XHJcbiAgICAgICAgcGF0aC5maWxsQ29sb3IgPSAnbGlnaHRncmF5JztcclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIHBhdGhQcm9qZWN0aW9uKHRvcFBhdGg6IHBhcGVyLkN1cnZlbGlrZSwgYm90dG9tUGF0aDogcGFwZXIuQ3VydmVsaWtlKVxyXG4gICAgICAgIDogKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50XHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgdG9wUGF0aExlbmd0aCA9IHRvcFBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGJvdHRvbVBhdGhMZW5ndGggPSBib3R0b21QYXRoLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24odW5pdFBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICAgICBsZXQgdG9wUG9pbnQgPSB0b3BQYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiB0b3BQYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICBsZXQgYm90dG9tUG9pbnQgPSBib3R0b21QYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiBib3R0b21QYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICBpZih0b3BQb2ludCA9PSBudWxsIHx8IGJvdHRvbVBvaW50ID09IG51bGwpe1xyXG4gICAgICAgICAgICAgICB0aHJvdyBcImNvdWxkIG5vdCBnZXQgcHJvamVjdGVkIHBvaW50IGZvciB1bml0IHBvaW50IFwiICsgdW5pdFBvaW50LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0b3BQb2ludC5hZGQoYm90dG9tUG9pbnQuc3VidHJhY3QodG9wUG9pbnQpLm11bHRpcGx5KHVuaXRQb2ludC55KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgc2ltcGxpZnkocGF0aDogcGFwZXIuUGF0aEl0ZW0sIHRvbGVyYW5jZT86IG51bWJlcil7XHJcbiAgICAgICAgaWYocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKXtcclxuICAgICAgICAgICAgZm9yKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pe1xyXG4gICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNpbXBsaWZ5KDxwYXBlci5QYXRoSXRlbT5wLCB0b2xlcmFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKDxwYXBlci5QYXRoPnBhdGgpLnNpbXBsaWZ5KHRvbGVyYW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFBhdGhTZWN0aW9uIGltcGxlbWVudHMgcGFwZXIuQ3VydmVsaWtlIHtcclxuICAgIHBhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICBvZmZzZXQ6IG51bWJlcjtcclxuICAgIGxlbmd0aDogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBwYXBlci5QYXRoLCBvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFBvaW50QXQob2Zmc2V0OiBudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhdGguZ2V0UG9pbnRBdChvZmZzZXQgKyB0aGlzLm9mZnNldCk7XHJcbiAgICB9XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL3BhcGVyLmQudHNcIiAvPlxyXG5cclxuY2xhc3MgUGF0aFRleHQgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcbiAgICBcclxuICAgIHByaXZhdGUgcGF0aDogUGF0aExpa2U7XHJcbiAgICBwcml2YXRlIF90ZXh0OiBzdHJpbmc7XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdHlsZTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocGF0aDogUGF0aExpa2UsIHRleHQ/OiBzdHJpbmcsIHN0eWxlPzogYW55KXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgICAgICAgdGhpcy5fdGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy5zdHlsZSA9IHN0eWxlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcbiBcclxuICAgIGdldCB0ZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl90ZXh0ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdGV4dCA9IHRoaXMudGV4dDtcclxuICAgICAgICBsZXQgcGF0aCA9IHRoaXMucGF0aDtcclxuICAgICAgICBpZiAodGV4dCAmJiB0ZXh0Lmxlbmd0aCAmJiBwYXRoICYmIHBhdGgubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBNZWFzdXJlIGdseXBocyBpbiBwYWlycyB0byBjYXB0dXJlIHdoaXRlIHNwYWNlLlxyXG4gICAgICAgICAgICAvLyBQYWlycyBhcmUgY2hhcmFjdGVycyBpIGFuZCBpKzEuXHJcbiAgICAgICAgICAgIHZhciBnbHlwaFBhaXJzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2x5cGhQYWlyc1tpXSA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGksIGkrMSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBGb3IgZWFjaCBjaGFyYWN0ZXIsIGZpbmQgY2VudGVyIG9mZnNldC5cclxuICAgICAgICAgICAgdmFyIHhPZmZzZXRzID0gWzBdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gTWVhc3VyZSB0aHJlZSBjaGFyYWN0ZXJzIGF0IGEgdGltZSB0byBnZXQgdGhlIGFwcHJvcHJpYXRlIFxyXG4gICAgICAgICAgICAgICAgLy8gICBzcGFjZSBiZWZvcmUgYW5kIGFmdGVyIHRoZSBnbHlwaC5cclxuICAgICAgICAgICAgICAgIHZhciB0cmlhZFRleHQgPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpIC0gMSwgaSArIDEpKTtcclxuICAgICAgICAgICAgICAgIHRyaWFkVGV4dC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gU3VidHJhY3Qgb3V0IGhhbGYgb2YgcHJpb3IgZ2x5cGggcGFpciBcclxuICAgICAgICAgICAgICAgIC8vICAgYW5kIGhhbGYgb2YgY3VycmVudCBnbHlwaCBwYWlyLlxyXG4gICAgICAgICAgICAgICAgLy8gTXVzdCBiZSByaWdodCwgYmVjYXVzZSBpdCB3b3Jrcy5cclxuICAgICAgICAgICAgICAgIGxldCBvZmZzZXRXaWR0aCA9IHRyaWFkVGV4dC5ib3VuZHMud2lkdGggXHJcbiAgICAgICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2kgLSAxXS5ib3VuZHMud2lkdGggLyAyIFxyXG4gICAgICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpXS5ib3VuZHMud2lkdGggLyAyO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHdpZHRoIHRvIHByaW9yIG9mZnNldC4gXHJcbiAgICAgICAgICAgICAgICB4T2Zmc2V0c1tpXSA9IHhPZmZzZXRzW2kgLSAxXSArIG9mZnNldFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBTZXQgcG9pbnQgZm9yIGVhY2ggZ2x5cGggYW5kIHJvdGF0ZSBnbHlwaCBhb3J1bmQgdGhlIHBvaW50XHJcbiAgICAgICAgICAgIGxldCBwYXRoTGVuZ3RoID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNlbnRlck9mZnMgPSB4T2Zmc2V0c1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXRoTGVuZ3RoIDwgY2VudGVyT2Zmcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlck9mZnMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY2VudGVyT2ZmcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2x5cGhQYWlyc1tpXS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhdGhQb2ludCA9IHBhdGguZ2V0UG9pbnRBdChjZW50ZXJPZmZzKTtcclxuICAgICAgICAgICAgICAgICAgICBnbHlwaFBhaXJzW2ldLnBvc2l0aW9uID0gcGF0aFBvaW50O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YW4gPSBwYXRoLmdldFRhbmdlbnRBdChjZW50ZXJPZmZzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0YW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2x5cGhQYWlyc1tpXS5yb3RhdGUodGFuLmFuZ2xlLCBwYXRoUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNvdWxkIG5vdCBnZXQgdGFuZ2VudCBhdCBcIiwgY2VudGVyT2Zmcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgIFxyXG4gICAgLy8gY3JlYXRlIGEgUG9pbnRUZXh0IG9iamVjdCBmb3IgYSBzdHJpbmcgYW5kIGEgc3R5bGVcclxuICAgIHByaXZhdGUgY3JlYXRlUG9pbnRUZXh0ICh0ZXh0KTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgdmFyIHBvaW50VGV4dCA9IG5ldyBwYXBlci5Qb2ludFRleHQoKTtcclxuICAgICAgICBwb2ludFRleHQuY29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgcG9pbnRUZXh0Lmp1c3RpZmljYXRpb24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgIGxldCBzdHlsZSA9IHRoaXMuc3R5bGU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHN0eWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChzdHlsZS5mb250RmFtaWx5KSBwb2ludFRleHQuZm9udEZhbWlseSA9IHN0eWxlLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgICAgIGlmIChzdHlsZS5mb250U2l6ZSkgcG9pbnRUZXh0LmZvbnRTaXplID0gc3R5bGUuZm9udFNpemU7XHJcbiAgICAgICAgICAgIGlmIChzdHlsZS5mb250V2llZ2h0KSBwb2ludFRleHQuZm9udFdlaWdodCA9IHN0eWxlLmZvbnRXZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciByZWN0ID0gcGFwZXIuUGF0aC5SZWN0YW5nbGUocG9pbnRUZXh0LmJvdW5kcyk7XHJcbiAgICAgICAgcmVjdC5maWxsQ29sb3IgPSAnbGlnaHRncmF5JztcclxuICAgICAgICBcclxuICAgICAgICB2YXIgZ3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICBncm91cC5zdHlsZSA9IHN0eWxlO1xyXG4gICAgICAgIGdyb3VwLmFkZENoaWxkKHBvaW50VGV4dCk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoZ3JvdXApO1xyXG4gICAgICAgIHJldHVybiBncm91cDtcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5cclxuIiwiXHJcbmNsYXNzIFBhdGhUcmFuc2Zvcm0ge1xyXG4gICAgcG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRUcmFuc2Zvcm0gPSBwb2ludFRyYW5zZm9ybTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRUcmFuc2Zvcm0ocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBhdGhJdGVtKHBhdGg6IHBhcGVyLlBhdGhJdGVtKSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtQ29tcG91bmRQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCkge1xyXG4gICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBhdGgocGF0aDogcGFwZXIuUGF0aCkge1xyXG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2YgcGF0aC5zZWdtZW50cykge1xyXG4gICAgICAgICAgICBsZXQgb3JpZ1BvaW50ID0gc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgbGV0IG5ld1BvaW50ID0gdGhpcy50cmFuc2Zvcm1Qb2ludChzZWdtZW50LnBvaW50KTtcclxuICAgICAgICAgICAgb3JpZ1BvaW50LnggPSBuZXdQb2ludC54O1xyXG4gICAgICAgICAgICBvcmlnUG9pbnQueSA9IG5ld1BvaW50Lnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbiIsIlxyXG5jbGFzcyBTZWdtZW50SGFuZGxlIGV4dGVuZHMgcGFwZXIuU2hhcGUge1xyXG4gXHJcbiAgICBzZWdtZW50OiBwYXBlci5TZWdtZW50O1xyXG4gICAgb25DaGFuZ2VDb21wbGV0ZTogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3Ntb290aGVkOiBib29sZWFuO1xyXG4gXHJcbiAgICBjb25zdHJ1Y3RvcihzZWdtZW50OiBwYXBlci5TZWdtZW50LCByYWRpdXM/OiBudW1iZXIpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZWdtZW50ID0gc2VnbWVudDtcclxuXHJcbiAgICAgICAgbGV0IHNlbGYgPSA8YW55PnRoaXM7XHJcbiAgICAgICAgc2VsZi5fdHlwZSA9ICdjaXJjbGUnO1xyXG4gICAgICAgIHNlbGYuX3JhZGl1cyA9IDU7XHJcbiAgICAgICAgc2VsZi5fc2l6ZSA9IG5ldyBwYXBlci5TaXplKHNlbGYuX3JhZGl1cyAqIDIpO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKHNlZ21lbnQucG9pbnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSAyO1xyXG4gICAgICAgIHRoaXMuc3Ryb2tlQ29sb3IgPSAnYmx1ZSc7XHJcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eSA9IDAuNTsgXHJcblxyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IDxNb3VzZUJlaGF2aW9yPntcclxuICAgICAgICAgICAgb25EcmFnOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3UG9zID0gdGhpcy5wb3NpdGlvbi5hZGQoZXZlbnQuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ld1BvcztcclxuICAgICAgICAgICAgICAgIHNlZ21lbnQucG9pbnQgPSBuZXdQb3M7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ0VuZDogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc21vb3RoZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMub25DaGFuZ2VDb21wbGV0ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5nZUNvbXBsZXRlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25DbGljazogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zbW9vdGhlZCA9ICF0aGlzLnNtb290aGVkO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkNoYW5nZUNvbXBsZXRlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbmdlQ29tcGxldGUoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgc21vb3RoZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Ntb290aGVkO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXQgc21vb3RoZWQodmFsdWU6IGJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuX3Ntb290aGVkID0gdmFsdWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodmFsdWUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3Ntb290aGluZycpO1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50LmhhbmRsZU91dCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoeVBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcbiAgICBzb3VyY2VQYXRoOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBkaXNwbGF5UGF0aDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgY29ybmVyczogcGFwZXIuU2VnbWVudFtdO1xyXG4gICAgb3V0bGluZTogcGFwZXIuUGF0aDtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3IgcmVidWlsZGluZyB0aGUgbWlkcG9pbnQgaGFuZGxlc1xyXG4gICAgICogYXMgb3V0bGluZSBjaGFuZ2VzLlxyXG4gICAgICovXHJcbiAgICBtaWRwb2ludEdyb3VwOiBwYXBlci5Hcm91cDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VQYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnNvdXJjZVBhdGggPSBzb3VyY2VQYXRoO1xyXG4gICAgICAgIHRoaXMuc291cmNlUGF0aC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlT3V0bGluZSgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlU2VnbWVudE1hcmtlcnMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1pZHBpb250TWFya2VycygpO1xyXG5cclxuICAgICAgICB0aGlzLm1vdXNlQmVoYXZpb3IgPSB7XHJcbiAgICAgICAgICAgIG9uRHJhZzogZXZlbnQgPT4gdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKGV2ZW50LmRlbHRhKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXJyYW5nZUNvbnRlbnRzKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWlkcGlvbnRNYXJrZXJzKCk7XHJcbiAgICAgICAgdGhpcy5hcnJhbmdlUGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFycmFuZ2VQYXRoKCkge1xyXG4gICAgICAgIGxldCBvcnRoT3JpZ2luID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgIGxldCBvcnRoV2lkdGggPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzLndpZHRoO1xyXG4gICAgICAgIGxldCBvcnRoSGVpZ2h0ID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IHNpZGVzID0gdGhpcy5nZXRPdXRsaW5lU2lkZXMoKTtcclxuICAgICAgICBsZXQgdG9wID0gc2lkZXNbMF07XHJcbiAgICAgICAgbGV0IGJvdHRvbSA9IHNpZGVzWzJdO1xyXG4gICAgICAgIGJvdHRvbS5yZXZlcnNlKCk7XHJcbiAgICAgICAgbGV0IHByb2plY3Rpb24gPSBQYXBlckhlbHBlcnMucGF0aFByb2plY3Rpb24odG9wLCBib3R0b20pO1xyXG4gICAgICAgIGxldCB0cmFuc2Zvcm0gPSBuZXcgUGF0aFRyYW5zZm9ybShwb2ludCA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KG9ydGhPcmlnaW4pO1xyXG4gICAgICAgICAgICBsZXQgdW5pdCA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gb3J0aEhlaWdodCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0ZWQgPSBwcm9qZWN0aW9uKHVuaXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IobGV0IHNpZGUgb2Ygc2lkZXMpe1xyXG4gICAgICAgICAgICBzaWRlLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBsZXQgbmV3UGF0aCA9IDxwYXBlci5Db21wb3VuZFBhdGg+dGhpcy5zb3VyY2VQYXRoLmNsb25lKCk7XHJcbiAgICAgICAgbmV3UGF0aC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBuZXdQYXRoLmZpbGxDb2xvciA9ICdsaWdodGJsdWUnO1xyXG5cclxuICAgICAgICB0cmFuc2Zvcm0udHJhbnNmb3JtUGF0aEl0ZW0obmV3UGF0aCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc3BsYXlQYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheVBhdGgucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BsYXlQYXRoID0gbmV3UGF0aDtcclxuICAgICAgICB0aGlzLmluc2VydENoaWxkKDEsIG5ld1BhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0T3V0bGluZVNpZGVzKCk6IHBhcGVyLlBhdGhbXSB7XHJcbiAgICAgICAgbGV0IHNpZGVzOiBwYXBlci5QYXRoW10gPSBbXTtcclxuICAgICAgICBsZXQgc2VnbWVudEdyb3VwOiBwYXBlci5TZWdtZW50W10gPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY29ybmVyUG9pbnRzID0gdGhpcy5jb3JuZXJzLm1hcChjID0+IGMucG9pbnQpO1xyXG4gICAgICAgIGxldCBmaXJzdCA9IGNvcm5lclBvaW50cy5zaGlmdCgpOyBcclxuICAgICAgICBjb3JuZXJQb2ludHMucHVzaChmaXJzdCk7XHJcblxyXG4gICAgICAgIGxldCB0YXJnZXRDb3JuZXIgPSBjb3JuZXJQb2ludHMuc2hpZnQoKTtcclxuICAgICAgICBsZXQgc2VnbWVudExpc3QgPSB0aGlzLm91dGxpbmUuc2VnbWVudHMubWFwKHggPT4geCk7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIHNlZ21lbnRMaXN0LnB1c2goc2VnbWVudExpc3RbMF0pO1xyXG4gICAgICAgIGZvcihsZXQgc2VnbWVudCBvZiBzZWdtZW50TGlzdCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzZWdtZW50R3JvdXAucHVzaChzZWdtZW50KTtcclxuICAgIFxyXG4gICAgICAgICAgICBpZih0YXJnZXRDb3JuZXIuZ2V0RGlzdGFuY2Uoc2VnbWVudC5wb2ludCkgPCAwLjAwMDEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGZpbmlzaCBwYXRoXHJcbiAgICAgICAgICAgICAgICBzaWRlcy5wdXNoKG5ldyBwYXBlci5QYXRoKHNlZ21lbnRHcm91cCkpO1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudEdyb3VwID0gW3NlZ21lbnRdO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Q29ybmVyID0gY29ybmVyUG9pbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHNpZGVzLmxlbmd0aCAhPT0gNCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3NpZGVzJywgc2lkZXMpO1xyXG4gICAgICAgICAgICB0aHJvdyAnZmFpbGVkIHRvIGdldCBzaWRlcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzaWRlcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZU91dGxpbmUoKSB7XHJcbiAgICAgICAgbGV0IGJvdW5kcyA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHM7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lID0gbmV3IHBhcGVyLlBhdGgoW1xyXG4gICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChib3VuZHMudG9wTGVmdCksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KGJvdW5kcy50b3BSaWdodCksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KGJvdW5kcy5ib3R0b21SaWdodCksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KGJvdW5kcy5ib3R0b21MZWZ0KVxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgICAgICB0aGlzLm91dGxpbmUuY2xvc2VkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm91dGxpbmUuZmlsbENvbG9yID0gbmV3IHBhcGVyLkNvbG9yKHdpbmRvdy5hcHAuY2FudmFzQ29sb3IpOy8vLmFkZCgwLjA0KTtcclxuICAgICAgICB0aGlzLm91dGxpbmUuc3Ryb2tlQ29sb3IgPSAnbGlnaHRncmF5JztcclxuICAgICAgICB0aGlzLm91dGxpbmUuZGFzaEFycmF5ID0gWzUsIDVdO1xyXG5cclxuICAgICAgICAvLyB0cmFjayBjb3JuZXJzIHNvIHdlIGtub3cgaG93IHRvIGFycmFuZ2UgdGhlIHRleHRcclxuICAgICAgICB0aGlzLmNvcm5lcnMgPSB0aGlzLm91dGxpbmUuc2VnbWVudHMubWFwKHMgPT4gcyk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5vdXRsaW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNlZ21lbnRNYXJrZXJzKCkge1xyXG4gICAgICAgIGxldCBib3VuZHMgPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzO1xyXG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2YgdGhpcy5vdXRsaW5lLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGUgPSBuZXcgU2VnbWVudEhhbmRsZShzZWdtZW50KTtcclxuICAgICAgICAgICAgaGFuZGxlLm9uQ2hhbmdlQ29tcGxldGUgPSAoKSA9PiB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlTWlkcGlvbnRNYXJrZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMubWlkcG9pbnRHcm91cCl7XHJcbiAgICAgICAgICAgIHRoaXMubWlkcG9pbnRHcm91cC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lLmN1cnZlcy5mb3JFYWNoKGN1cnZlID0+IHtcclxuICAgICAgICAgICAgbGV0IGhhbmRsZSA9IG5ldyBDdXJ2ZVNwbGl0dGVySGFuZGxlKGN1cnZlKTtcclxuICAgICAgICAgICAgaGFuZGxlLm9uRHJhZ0VuZCA9IChuZXdTZWdtZW50LCBldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld0hhbmRsZSA9IG5ldyBTZWdtZW50SGFuZGxlKG5ld1NlZ21lbnQpO1xyXG4gICAgICAgICAgICAgICAgbmV3SGFuZGxlLm9uQ2hhbmdlQ29tcGxldGUgPSAoKSA9PiB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChuZXdIYW5kbGUpO1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLm1pZHBvaW50R3JvdXApO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoeVRleHQgZXh0ZW5kcyBTdHJldGNoeVBhdGgge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZywgZm9udDogb3BlbnR5cGUuRm9udCwgZm9udFNpemU6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBvcGVuVHlwZVBhdGggPSBmb250LmdldFBhdGgodGV4dCwgMCwgMCwgZm9udFNpemUpO1xyXG4gICAgICAgIGxldCB0ZXh0UGF0aCA9IFBhcGVySGVscGVycy5pbXBvcnRPcGVuVHlwZVBhdGgob3BlblR5cGVQYXRoKTtcclxuXHJcbiAgICAgICAgdGV4dFBhdGguZmlsbENvbG9yID0gJ3JlZCc7XHJcblxyXG4gICAgICAgIHN1cGVyKHRleHRQYXRoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IHBhcGVyLlBvaW50KHRoaXMuc3Ryb2tlQm91bmRzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cm9rZUJvdW5kcy5oZWlnaHQgLyAyKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgVGV4dFJ1bGVyIHtcclxuICAgIFxyXG4gICAgZm9udEZhbWlseTogc3RyaW5nO1xyXG4gICAgZm9udFdlaWdodDogbnVtYmVyO1xyXG4gICAgZm9udFNpemU6IG51bWJlcjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQb2ludFRleHQgKHRleHQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICB2YXIgcG9pbnRUZXh0ID0gbmV3IHBhcGVyLlBvaW50VGV4dCgpO1xyXG4gICAgICAgIHBvaW50VGV4dC5jb250ZW50ID0gdGV4dDtcclxuICAgICAgICBwb2ludFRleHQuanVzdGlmaWNhdGlvbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgaWYodGhpcy5mb250RmFtaWx5KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRGYW1pbHkgPSB0aGlzLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFdlaWdodCl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250V2VpZ2h0ID0gdGhpcy5mb250V2VpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmZvbnRTaXplKXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHBvaW50VGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUZXh0T2Zmc2V0cyh0ZXh0KXtcclxuICAgICAgICAvLyBNZWFzdXJlIGdseXBocyBpbiBwYWlycyB0byBjYXB0dXJlIHdoaXRlIHNwYWNlLlxyXG4gICAgICAgIC8vIFBhaXJzIGFyZSBjaGFyYWN0ZXJzIGkgYW5kIGkrMS5cclxuICAgICAgICB2YXIgZ2x5cGhQYWlycyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBnbHlwaFBhaXJzW2ldID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSwgaSsxKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZvciBlYWNoIGNoYXJhY3RlciwgZmluZCBjZW50ZXIgb2Zmc2V0LlxyXG4gICAgICAgIHZhciB4T2Zmc2V0cyA9IFswXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIE1lYXN1cmUgdGhyZWUgY2hhcmFjdGVycyBhdCBhIHRpbWUgdG8gZ2V0IHRoZSBhcHByb3ByaWF0ZSBcclxuICAgICAgICAgICAgLy8gICBzcGFjZSBiZWZvcmUgYW5kIGFmdGVyIHRoZSBnbHlwaC5cclxuICAgICAgICAgICAgdmFyIHRyaWFkVGV4dCA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGkgLSAxLCBpICsgMSkpO1xyXG4gICAgICAgICAgICB0cmlhZFRleHQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCBvdXQgaGFsZiBvZiBwcmlvciBnbHlwaCBwYWlyIFxyXG4gICAgICAgICAgICAvLyAgIGFuZCBoYWxmIG9mIGN1cnJlbnQgZ2x5cGggcGFpci5cclxuICAgICAgICAgICAgLy8gTXVzdCBiZSByaWdodCwgYmVjYXVzZSBpdCB3b3Jrcy5cclxuICAgICAgICAgICAgbGV0IG9mZnNldFdpZHRoID0gdHJpYWRUZXh0LmJvdW5kcy53aWR0aCBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpIC0gMV0uYm91bmRzLndpZHRoIC8gMiBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpXS5ib3VuZHMud2lkdGggLyAyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQWRkIG9mZnNldCB3aWR0aCB0byBwcmlvciBvZmZzZXQuIFxyXG4gICAgICAgICAgICB4T2Zmc2V0c1tpXSA9IHhPZmZzZXRzW2kgLSAxXSArIG9mZnNldFdpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGdseXBoUGFpciBvZiBnbHlwaFBhaXJzKXtcclxuICAgICAgICAgICAgZ2x5cGhQYWlyLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4geE9mZnNldHM7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFZlcnRpY2FsQm91bmRzVGV4dExheW91dCB7XHJcbiAgICB0b3A6IHBhcGVyLlBhdGg7XHJcbiAgICBib3R0b206IHBhcGVyLlBhdGg7XHJcblxyXG4gICAgbGV0dGVyUmVzb2x1dGlvbiA9IDEwMDtcclxuICAgIHNtb290aFRvbGVyYW5jZSA9IDAuMjU7XHJcbiAgICBmb250U2l6ZSA9IDY0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRvcDogcGFwZXIuUGF0aCwgYm90dG9tOiBwYXBlci5QYXRoKSB7XHJcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XHJcbiAgICAgICAgdGhpcy5ib3R0b20gPSBib3R0b207XHJcbiAgICB9XHJcblxyXG4gICAgbGF5b3V0KHRleHQ6IHN0cmluZywgZm9udDogb3BlbnR5cGUuRm9udCwgb25Db21wbGV0ZT86IChpdGVtOiBwYXBlci5JdGVtKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgbGV0IGxldHRlckdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgbGV0IGxldHRlclBhdGhzID0gZm9udC5nZXRQYXRocyh0ZXh0LCAwLCAwLCB0aGlzLmZvbnRTaXplKVxyXG4gICAgICAgICAgICAubWFwKHAgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhdGggPSBQYXBlckhlbHBlcnMuaW1wb3J0T3BlblR5cGVQYXRoKHApO1xyXG4gICAgICAgICAgICAgICAgbGV0dGVyR3JvdXAuYWRkQ2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBvcnRoT3JpZ2luID0gbGV0dGVyR3JvdXAuYm91bmRzLnRvcExlZnQ7XHJcbiAgICAgICAgbGV0IG9ydGhXaWR0aCA9IGxldHRlckdyb3VwLmJvdW5kcy53aWR0aDtcclxuICAgICAgICBsZXQgb3J0aEhlaWdodCA9IGxldHRlckdyb3VwLmJvdW5kcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLnBhdGhQcm9qZWN0aW9uKHRoaXMudG9wLCB0aGlzLmJvdHRvbSk7XHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlbGF0aXZlID0gcG9pbnQuc3VidHJhY3Qob3J0aE9yaWdpbik7XHJcbiAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpdmUueCAvIG9ydGhXaWR0aCxcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnkgLyBvcnRoSGVpZ2h0KTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0ZWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBmaW5hbEdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgZm9yIChsZXQgbGV0dGVyUGF0aCBvZiBsZXR0ZXJQYXRocykge1xyXG4gICAgICAgICAgICBsZXQgbGV0dGVyT3V0bGluZSA9IFBhcGVySGVscGVycy50cmFjZVBhdGhJdGVtKFxyXG4gICAgICAgICAgICAgICAgbGV0dGVyUGF0aCwgdGhpcy5sZXR0ZXJSZXNvbHV0aW9uKTtcclxuICAgICAgICAgICAgbGV0dGVyUGF0aC5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoSXRlbShsZXR0ZXJPdXRsaW5lKTtcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNpbXBsaWZ5KGxldHRlck91dGxpbmUsIHRoaXMuc21vb3RoVG9sZXJhbmNlKTtcclxuICAgICAgICAgICAgZmluYWxHcm91cC5hZGRDaGlsZChsZXR0ZXJPdXRsaW5lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0dGVyR3JvdXAucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGlmIChvbkNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIG9uQ29tcGxldGUoZmluYWxHcm91cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19