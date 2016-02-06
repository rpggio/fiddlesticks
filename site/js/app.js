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
                var stretchy = new StretchyText(block.text, this.app.font, 128);
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
        this.onKeyDown = function (event) {
            if (event.key == 'space') {
                paper.project.activeLayer.selected = !paper.project.activeLayer.selected;
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
        var projection = PaperHelpers.sandwichPathProjection(this.top, this.bottom);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6InNyYy8iLCJzb3VyY2VzIjpbImFwcC50cyIsImFwcC9BcHBDb250cm9sbGVyLnRzIiwiYXBwL0ZvbnRMb2FkZXIudHMiLCJhcHAvSGVscGVycy50cyIsImFwcC9UZXh0VHJhY2VDb250cm9sbGVyLnRzIiwiYXBwL1RleHRXYXJwQ29udHJvbGxlci50cyIsIm1hdGgvUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHMiLCJwYXBlci9Cb3R0b21UZXh0TGF5b3V0LnRzIiwicGFwZXIvQ3VydmVTcGxpdHRlckhhbmRsZS50cyIsInBhcGVyL0xpbmVEcmF3VG9vbC50cyIsInBhcGVyL0xpbmtlZFBhdGhHcm91cC50cyIsInBhcGVyL01vdXNlQmVoYXZpb3JUb29sLnRzIiwicGFwZXIvUGFwZXJIZWxwZXJzLnRzIiwicGFwZXIvUGF0aFNlY3Rpb24udHMiLCJwYXBlci9QYXRoVGV4dC50cyIsInBhcGVyL1BhdGhUcmFuc2Zvcm0udHMiLCJwYXBlci9TZWdtZW50SGFuZGxlLnRzIiwicGFwZXIvU3RyZXRjaHlQYXRoLnRzIiwicGFwZXIvU3RyZXRjaHlUZXh0LnRzIiwicGFwZXIvVGV4dFJ1bGVyLnRzIiwicGFwZXIvVmVydGljYWxCb3VuZHNUZXh0TGF5b3V0LnRzIl0sIm5hbWVzIjpbIkFwcENvbnRyb2xsZXIiLCJBcHBDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQXBwQ29udHJvbGxlci5hZGRUZXh0IiwiRm9udExvYWRlciIsIkZvbnRMb2FkZXIuY29uc3RydWN0b3IiLCJuZXdpZCIsInN0YXJ0UGF0aCIsImFwcGVuZFBhdGgiLCJmaW5pc2hQYXRoIiwiVGV4dFdhcnBDb250cm9sbGVyIiwiVGV4dFdhcnBDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiVGV4dFdhcnBDb250cm9sbGVyLnVwZGF0ZSIsIlRleHRXYXJwQ29udHJvbGxlci5maWRkbGVzdGlja3MiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybSIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtLmNvbnN0cnVjdG9yIiwiUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHJhbnNmb3JtUG9pbnQiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS5jcmVhdGVNYXRyaXgiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS5tdWx0aXBseSIsIlF1YWQiLCJRdWFkLmNvbnN0cnVjdG9yIiwiUXVhZC5mcm9tUmVjdGFuZ2xlIiwiUXVhZC5mcm9tQ29vcmRzIiwiUXVhZC5hc0Nvb3JkcyIsIkJvdHRvbVRleHRMYXlvdXQiLCJCb3R0b21UZXh0TGF5b3V0LmNvbnN0cnVjdG9yIiwiQm90dG9tVGV4dExheW91dC5sYXlvdXQiLCJQYXRoT2Zmc2V0U2NhbGluZyIsIlBhdGhPZmZzZXRTY2FsaW5nLmNvbnN0cnVjdG9yIiwiUGF0aE9mZnNldFNjYWxpbmcuZ2V0VG9Qb2ludEF0IiwiQ3VydmVTcGxpdHRlckhhbmRsZSIsIkN1cnZlU3BsaXR0ZXJIYW5kbGUuY29uc3RydWN0b3IiLCJMaW5lRHJhd1Rvb2wiLCJMaW5lRHJhd1Rvb2wuY29uc3RydWN0b3IiLCJMaW5lRHJhd1Rvb2wuc3RhcnRQYXRoIiwiTGluZURyYXdUb29sLmFwcGVuZFBhdGgiLCJMaW5lRHJhd1Rvb2wuZmluaXNoUGF0aCIsIkxpbmtlZFBhdGhHcm91cCIsIkxpbmtlZFBhdGhHcm91cC5jb25zdHJ1Y3RvciIsIkxpbmtlZFBhdGhHcm91cC5hZGRDaGlsZCIsIkxpbmtlZFBhdGhHcm91cC5sZW5ndGgiLCJMaW5rZWRQYXRoR3JvdXAucGF0aHMiLCJMaW5rZWRQYXRoR3JvdXAuZ2V0TG9jYXRpb25BdCIsIkxpbmtlZFBhdGhHcm91cC5nZXRQb2ludEF0IiwiTGlua2VkUGF0aEdyb3VwLmdldFRhbmdlbnRBdCIsIkxpbmtlZFBhdGhHcm91cC5nZXROZWFyZXN0UG9pbnQiLCJNb3VzZUJlaGF2aW9yVG9vbCIsIk1vdXNlQmVoYXZpb3JUb29sLmNvbnN0cnVjdG9yIiwiTW91c2VCZWhhdmlvclRvb2wuZmluZERyYWdnYWJsZVVwd2FyZCIsIlBhcGVySGVscGVycyIsIlBhcGVySGVscGVycy5jb25zdHJ1Y3RvciIsIlBhcGVySGVscGVycy5pbXBvcnRPcGVuVHlwZVBhdGgiLCJQYXBlckhlbHBlcnMudHJhY2VQYXRoSXRlbSIsIlBhcGVySGVscGVycy50cmFjZUNvbXBvdW5kUGF0aCIsIlBhcGVySGVscGVycy50cmFjZVBhdGgiLCJQYXBlckhlbHBlcnMuc2FuZHdpY2hQYXRoUHJvamVjdGlvbiIsIlBhcGVySGVscGVycy5yZXNldE1hcmtlcnMiLCJQYXBlckhlbHBlcnMubWFya2VyTGluZSIsIlBhcGVySGVscGVycy5tYXJrZXIiLCJQYXBlckhlbHBlcnMuc2ltcGxpZnkiLCJQYXRoU2VjdGlvbiIsIlBhdGhTZWN0aW9uLmNvbnN0cnVjdG9yIiwiUGF0aFNlY3Rpb24uZ2V0UG9pbnRBdCIsIlBhdGhUZXh0IiwiUGF0aFRleHQuY29uc3RydWN0b3IiLCJQYXRoVGV4dC50ZXh0IiwiUGF0aFRleHQudXBkYXRlIiwiUGF0aFRleHQuY3JlYXRlUG9pbnRUZXh0IiwiUGF0aFRyYW5zZm9ybSIsIlBhdGhUcmFuc2Zvcm0uY29uc3RydWN0b3IiLCJQYXRoVHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50IiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoSXRlbSIsIlBhdGhUcmFuc2Zvcm0udHJhbnNmb3JtQ29tcG91bmRQYXRoIiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoIiwiU2VnbWVudEhhbmRsZSIsIlNlZ21lbnRIYW5kbGUuY29uc3RydWN0b3IiLCJTZWdtZW50SGFuZGxlLnNtb290aGVkIiwiU3RyZXRjaHlQYXRoIiwiU3RyZXRjaHlQYXRoLmNvbnN0cnVjdG9yIiwiU3RyZXRjaHlQYXRoLmFycmFuZ2VDb250ZW50cyIsIlN0cmV0Y2h5UGF0aC5hcnJhbmdlUGF0aCIsIlN0cmV0Y2h5UGF0aC5nZXRPdXRsaW5lU2lkZXMiLCJTdHJldGNoeVBhdGguY3JlYXRlT3V0bGluZSIsIlN0cmV0Y2h5UGF0aC5jcmVhdGVTZWdtZW50TWFya2VycyIsIlN0cmV0Y2h5UGF0aC51cGRhdGVNaWRwaW9udE1hcmtlcnMiLCJTdHJldGNoeVRleHQiLCJTdHJldGNoeVRleHQuY29uc3RydWN0b3IiLCJUZXh0UnVsZXIiLCJUZXh0UnVsZXIuY29uc3RydWN0b3IiLCJUZXh0UnVsZXIuY3JlYXRlUG9pbnRUZXh0IiwiVGV4dFJ1bGVyLmdldFRleHRPZmZzZXRzIiwiVmVydGljYWxCb3VuZHNUZXh0TGF5b3V0IiwiVmVydGljYWxCb3VuZHNUZXh0TGF5b3V0LmNvbnN0cnVjdG9yIiwiVmVydGljYWxCb3VuZHNUZXh0TGF5b3V0LmxheW91dCJdLCJtYXBwaW5ncyI6IkFBS0EsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUVkLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztBQUVyQyxDQUFDLENBQUMsQ0FBQztBQ1JILElBQU0sU0FBUyxHQUFHLHdGQUF3RixDQUFDO0FBQzNHLElBQU0sU0FBUyxHQUFHLGtFQUFrRSxDQUFDO0FBQ3JGLElBQU0sU0FBUyxHQUFHLHNCQUFzQixDQUFDO0FBRXpDO0lBUUlBO1FBUkpDLGlCQW9DQ0E7UUFoQ0dBLGVBQVVBLEdBQWdCQSxFQUFFQSxDQUFDQTtRQUU3QkEsZ0JBQVdBLEdBQUdBLFNBQVNBLENBQUNBO1FBR3BCQSxJQUFJQSxNQUFNQSxHQUFHQSxRQUFRQSxDQUFDQSxjQUFjQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtRQUNuREEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBb0JBLE1BQU1BLENBQUNBLENBQUNBO1FBQ3ZDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUVuQkEsSUFBSUEsVUFBVUEsQ0FBQ0EsU0FBU0EsRUFBRUEsVUFBQUEsSUFBSUE7WUFDMUJBLEtBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1lBQ2pCQSxLQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxrQkFBa0JBLENBQUNBLEtBQUlBLENBQUNBLENBQUNBO1lBRXpDQSxLQUFJQSxDQUFDQSxP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QSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMzREEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7SUFDbEJBLENBQUNBO0lBRU1GLGlDQUFZQSxHQUFuQkEsVUFBb0JBLE1BQVlBLEVBQUVBLE1BQVlBO1FBRTFDRyxJQUFJQSxZQUFZQSxHQUFHQTtZQUNmQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM5QkEsSUFBSUEsWUFBWUEsR0FBR0E7WUFDZkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFOUJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFlBQVlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBO1lBQ2xFQSxJQUFJQSxDQUFDQSxHQUFHQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM3Q0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDM0VBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQy9FQSxDQUFDQTtRQUVEQSxJQUFJQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMxQkEsTUFBTUEsQ0FBQ0E7WUFDSEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hCQSxDQUFDQSxFQUFLQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFLQSxDQUFDQTtZQUNuQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBS0EsQ0FBQ0E7U0FDdEJBLENBQUNBLEdBQUdBLENBQUNBLFVBQVNBLENBQUNBO1lBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUMzQyxDQUFDLENBQUNBLENBQUNBO0lBQ1BBLENBQUNBO0lBRURILDJFQUEyRUE7SUFDM0VBLHFDQUFxQ0E7SUFDckNBLHFDQUFxQ0E7SUFDckNBLHFDQUFxQ0E7SUFDckNBLHFDQUFxQ0E7SUFDOUJBLDZCQUFRQSxHQUFmQSxVQUFnQkEsTUFBTUEsRUFBRUEsTUFBTUE7UUFDMUJJLE1BQU1BLENBQUNBO1lBQ0hBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUVBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQy9GQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFFQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvRkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0ZBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1NBQ2xHQSxDQUFDQTtJQUNOQSxDQUFDQTtJQUNMSiwyQkFBQ0E7QUFBREEsQ0FBQ0EsQUFsRUQsSUFrRUM7QUFFRDtJQU1JSyxjQUFZQSxDQUFjQSxFQUFFQSxDQUFjQSxFQUFFQSxDQUFjQSxFQUFFQSxDQUFjQTtRQUN0RUMsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDWEEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDWEEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDWEEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDZkEsQ0FBQ0E7SUFFTUQsa0JBQWFBLEdBQXBCQSxVQUFxQkEsSUFBcUJBO1FBQ3RDRSxNQUFNQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUNYQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUNaQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUNiQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUNmQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUNuQkEsQ0FBQ0E7SUFDTkEsQ0FBQ0E7SUFFTUYsZUFBVUEsR0FBakJBLFVBQWtCQSxNQUFnQkE7UUFDOUJHLE1BQU1BLENBQUNBLElBQUlBLElBQUlBLENBQ1hBLElBQUlBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQ3JDQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUNyQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFDckNBLElBQUlBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQ3hDQSxDQUFBQTtJQUNMQSxDQUFDQTtJQUVESCx1QkFBUUEsR0FBUkE7UUFDSUksTUFBTUEsQ0FBQ0E7WUFDSEEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbEJBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2xCQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNsQkEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7U0FDckJBLENBQUNBO0lBQ05BLENBQUNBO0lBQ0xKLFdBQUNBO0FBQURBLENBQUNBLEFBdkNELElBdUNDO0FDN0dEO0lBS0lLLDBCQUFZQSxNQUFrQkE7UUFGOUJDLGFBQVFBLEdBQUdBLEdBQUdBLENBQUNBO1FBR1hBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBO0lBQ3pCQSxDQUFDQTtJQUVERCxpQ0FBTUEsR0FBTkEsVUFBT0EsSUFBWUEsRUFBRUEsVUFBdUNBO1FBQTVERSxpQkF3Q0NBO1FBdkNHQSxJQUFJQSxVQUFVQSxDQUFDQSxTQUFTQSxFQUFFQSxVQUFBQSxJQUFJQTtZQUUxQkEsSUFBSUEsV0FBV0EsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7WUFDcENBLElBQUlBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUlBLENBQUNBLFFBQVFBLENBQUNBO2lCQUNyREEsR0FBR0EsQ0FBQ0EsVUFBQUEsQ0FBQ0E7Z0JBQ0ZBLElBQUlBLElBQUlBLEdBQUdBLFlBQVlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FB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QUdBLFVBQUFBLEtBQUtBO1lBQ3BCQSxJQUFJQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxXQUFXQSxDQUFDQTtZQUU5QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BCQSxLQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDdEJBLE1BQU1BLENBQUNBO1lBQ1hBLENBQUNBO1lBRURBLEtBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQzNCQSxDQUFDQSxDQUFBQTtRQUVEQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxVQUFBQSxLQUFLQTtZQUNsQkEsS0FBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDdEJBLENBQUNBLENBQUFBO0lBQ0xBLENBQUNBO0lBRURELGdDQUFTQSxHQUFUQSxVQUFVQSxLQUFLQTtRQUNYRSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuQkEsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDdEJBLENBQUNBO1FBQ0RBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLFdBQVdBLEVBQUVBLFdBQVdBLEVBQUVBLFdBQVdBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1FBQ2hGQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtRQUN0Q0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7SUFDaENBLENBQUNBO0lBRURGLGlDQUFVQSxHQUFWQSxVQUFXQSxLQUFLQTtRQUNaRyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNu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Q3RDQTtRQUNEQSxXQUFXQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtRQUVyQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDYkEsVUFBVUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFDM0JBLENBQUNBO0lBQ0xBLENBQUNBO0lBQ0xGLCtCQUFDQTtBQUFEQSxDQUFDQSxBQXBERCxJQW9EQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbnRlcmZhY2UgV2luZG93IHtcclxuICAgIGFwcDogQXBwQ29udHJvbGxlcjtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7ICBcclxuICAgIFxyXG4gICAgd2luZG93LmFwcCA9IG5ldyBBcHBDb250cm9sbGVyKCk7XHJcbiAgICBcclxufSk7XHJcbiIsIlxyXG5jb25zdCBBbWF0aWNVcmwgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3MvYW1hdGljc2MvdjgvSURua1JUUEdjclNWbzUwVXlZTks3eTNVU0JuU3Zwa29wUWFVUi0ycjdpVS50dGYnO1xyXG5jb25zdCBSb2JvdG8xMDAgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3Mvcm9ib3RvL3YxNS83TXlncVRlMnpzOVlrUDBhZEE5UVFRLnR0Zic7XHJcbmNvbnN0IFJvYm90bzUwMCA9ICdmb250cy9Sb2JvdG8tNTAwLnR0Zic7XHJcblxyXG5jbGFzcyBBcHBDb250cm9sbGVyIHtcclxuXHJcbiAgICBmb250OiBvcGVudHlwZS5Gb250O1xyXG4gICAgd2FycDogVGV4dFdhcnBDb250cm9sbGVyO1xyXG4gICAgdGV4dEJsb2NrczogVGV4dEJsb2NrW10gPSBbXTtcclxuICAgIHBhcGVyOiBwYXBlci5QYXBlclNjb3BlO1xyXG4gICAgY2FudmFzQ29sb3IgPSAnI0U5RTBDMyc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5DYW52YXMnKTtcclxuICAgICAgICBwYXBlci5zZXR1cCg8SFRNTENhbnZhc0VsZW1lbnQ+Y2FudmFzKTtcclxuICAgICAgICB0aGlzLnBhcGVyID0gcGFwZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbmV3IEZvbnRMb2FkZXIoUm9ib3RvNTAwLCBmb250ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICAgICAgdGhpcy53YXJwID0gbmV3IFRleHRXYXJwQ29udHJvbGxlcih0aGlzKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuYWRkVGV4dCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgYWRkVGV4dCgpe1xyXG4gICAgICAgIGxldCB0ZXh0ID0gJCgnI25ld1RleHQnKS52YWwoKTtcclxuICAgICAgICBpZih0ZXh0LnRyaW0oKS5sZW5ndGgpe1xyXG4gICAgICAgICAgICBsZXQgYmxvY2sgPSA8VGV4dEJsb2NrPiB7XHJcbiAgICAgICAgICAgICAgICBfaWQ6IG5ld2lkKCksXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMudGV4dEJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud2FycC51cGRhdGUoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFwZXIudmlldy5kcmF3KCk7XHJcbiAgICAgICAgfSAgICBcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIFRleHRCbG9jayB7XHJcbiAgICBfaWQ6IHN0cmluZztcclxuICAgIHRleHQ6IHN0cmluZztcclxuICAgIGl0ZW06IHBhcGVyLkl0ZW07XHJcbn0iLCJcclxuY2xhc3MgRm9udExvYWRlciB7XHJcblxyXG4gICAgaXNMb2FkZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udFVybDogc3RyaW5nLCBvbkxvYWRlZDogKGZvbnQ6IG9wZW50eXBlLkZvbnQpID0+IHZvaWQpIHtcclxuICAgICAgICBvcGVudHlwZS5sb2FkKGZvbnRVcmwsIGZ1bmN0aW9uKGVyciwgZm9udCkge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob25Mb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBvbkxvYWRlZC5jYWxsKHRoaXMsIGZvbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJcclxuZnVuY3Rpb24gbmV3aWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAobmV3IERhdGUoKS5nZXRUaW1lKCkrTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMzYpO1xyXG59XHJcbiIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInR5cGluZ3MvcGFwZXIuZC50c1wiIC8+XHJcbi8vIDxyZWZlcmVuY2UgcGF0aD1cIkxpbmtlZFBhdGhzLnRzXCIgLz5cclxuXHJcbmludGVyZmFjZSBXaW5kb3cge1xyXG4gICAgdGV4dFRyYWNlOiBhbnk7XHJcbn1cclxuXHJcbndpbmRvdy50ZXh0VHJhY2UgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ3RleHRUcmFjZSBzdGFydGVkJyk7XHJcblxyXG4gICAgY29uc3QgcHMyMyA9IFwiVGhlIExvcmQgaXMgbXkgc2hlcGhlcmQ7IEkgc2hhbGwgbm90IHdhbnQuIEhlIG1ha2VzIG1lIGxpZSBkb3duIGluIGdyZWVuIHBhc3R1cmVzLiBIZSBsZWFkcyBtZSBiZXNpZGUgc3RpbGwgd2F0ZXJzLiBIZSByZXN0b3JlcyBteSBzb3VsLiBIZSBsZWFkcyBtZSBpbiBwYXRocyBvZiByaWdodGVvdXNuZXNzIGZvciBoaXMgbmFtZSdzIHNha2UuIEV2ZW4gdGhvdWdoIEkgd2FsayB0aHJvdWdoIHRoZSB2YWxsZXkgb2YgdGhlIHNoYWRvdyBvZiBkZWF0aCwgSSB3aWxsIGZlYXIgbm8gZXZpbCwgZm9yIHlvdSBhcmUgd2l0aCBtZTsgeW91ciByb2QgYW5kIHlvdXIgc3RhZmYsIHRoZXkgY29tZm9ydCBtZS4gWW91IHByZXBhcmUgYSB0YWJsZSBiZWZvcmUgbWUgaW4gdGhlIHByZXNlbmNlIG9mIG15IGVuZW1pZXM7IHlvdSBhbm9pbnQgbXkgaGVhZCB3aXRoIG9pbDsgbXkgY3VwIG92ZXJmbG93cy4gU3VyZWx5IGdvb2RuZXNzIGFuZCBtZXJjeSBzaGFsbCBmb2xsb3cgbWUgYWxsIHRoZSBkYXlzIG9mIG15IGxpZmUsIGFuZCBJIHNoYWxsIGR3ZWxsIGluIHRoZSBob3VzZSBvZiB0aGUgTG9yZCBmb3JldmVyLlwiO1xyXG4gICAgbGV0IGRyYXdQYXRocyA9IG5ldyBMaW5rZWRQYXRoR3JvdXAoKTtcclxuICAgIGxldCB0ZXh0U2l6ZSA9IDY0O1xyXG4gICAgbGV0IHRleHRQYXRoID0gbmV3IFBhdGhUZXh0KGRyYXdQYXRocywgcHMyMywge2ZvbnRTaXplOiB0ZXh0U2l6ZX0pO1xyXG4gICAgbGV0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBsZXQgY3VycmVudFBhdGg6IHBhcGVyLlBhdGg7XHJcblxyXG4gICAgZnVuY3Rpb24gc3RhcnRQYXRoKHBvaW50KSB7XHJcbiAgICAgICAgaWYoY3VycmVudFBhdGgpe1xyXG4gICAgICAgICAgICBmaW5pc2hQYXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRQYXRoID0gbmV3IHBhcGVyLlBhdGgoe3N0cm9rZUNvbG9yOiAnbGlnaHRncmF5Jywgc3Ryb2tlV2lkdGg6IHRleHRTaXplfSk7XHJcbiAgICAgICAgZHJhd1BhdGhzLmFkZENoaWxkKGN1cnJlbnRQYXRoKTtcclxuICAgICAgICBjdXJyZW50UGF0aC5hZGQocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGVuZFBhdGgocG9pbnQpIHtcclxuICAgICAgICBpZihjdXJyZW50UGF0aCl7XHJcbiAgICAgICAgICAgIGN1cnJlbnRQYXRoLmFkZChwb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZpbmlzaFBhdGgoKXtcclxuICAgICAgICBjdXJyZW50UGF0aC5zaW1wbGlmeSh0ZXh0U2l6ZSAvIDIpO1xyXG4gICAgICAgIHRleHRQYXRoLnVwZGF0ZSgpO1xyXG4gICAgICAgIGN1cnJlbnRQYXRoLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICBjdXJyZW50UGF0aCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHRvb2wgPSBuZXcgcGFwZXIuVG9vbCgpO1xyXG5cclxuICAgIHRvb2wub25Nb3VzZURyYWcgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGxldCBwb2ludCA9IGV2ZW50Lm1pZGRsZVBvaW50O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCFjdXJyZW50UGF0aCl7XHJcbiAgICAgICAgICAgIHN0YXJ0UGF0aChwb2ludCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTm86IG5lZWQgdG8gY2hlY2sgaWYgc2FtZSBzZWdtZW50IVxyXG4gICAgICAgIC8vIGxldCBuZWFyZXN0ID0gZHJhd1BhdGhzLmdldE5lYXJlc3RQb2ludChwb2ludCk7XHJcbiAgICAgICAgLy8gaWYobmVhcmVzdCkge1xyXG4gICAgICAgIC8vICAgICBsZXQgbmVhcmVzdERpc3QgPSBuZWFyZXN0LmdldERpc3RhbmNlKHBvaW50KTtcclxuICAgICAgICAvLyAgICAgaWYobmVhcmVzdCAmJiBuZWFyZXN0RGlzdCA8PSB0ZXh0U2l6ZSl7XHJcbiAgICAgICAgLy8gICAgICAgICBmaW5pc2hQYXRoKCk7XHJcbiAgICAgICAgLy8gICAgICAgICByZXR1cm47ICAgICAgICBcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBcclxuICAgICAgICBhcHBlbmRQYXRoKHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICB0b29sLm9uTW91c2VVcCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgZmluaXNoUGF0aCgpO1xyXG4gICAgfVxyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwidHlwaW5ncy9wYXBlci5kLnRzXCIgLz5cclxuXHJcbmNsYXNzIFRleHRXYXJwQ29udHJvbGxlciB7XHJcbiAgICBhcHA6IEFwcENvbnRyb2xsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHBDb250cm9sbGVyKSB7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbmV3IE1vdXNlQmVoYXZpb3JUb29sKHBhcGVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKCl7XHJcbiAgICAgICAgZm9yKGxldCBibG9jayBvZiB0aGlzLmFwcC50ZXh0QmxvY2tzKXtcclxuICAgICAgICAgICAgaWYoIWJsb2NrLml0ZW0pe1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0cmV0Y2h5ID0gbmV3IFN0cmV0Y2h5VGV4dChibG9jay50ZXh0LCB0aGlzLmFwcC5mb250LCAxMjgpO1xyXG4gICAgICAgICAgICAgICAgLy9zdHJldGNoeS50cmFuc2xhdGUobmV3IHBhcGVyLlBvaW50KDMwLCAzMCkpO1xyXG4gICAgICAgICAgICAgICAgYmxvY2suaXRlbSA9IHN0cmV0Y2h5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZpZGRsZXN0aWNrcygpe1xyXG4gICAgICAgIGNvbnN0IHNhbXBsZVRleHQgPSBcIkZpZGRsZXN0aWNrc1wiO1xyXG4gICAgICAgIHZhciBsaW5lRHJhdyA9IG5ldyBMaW5lRHJhd1Rvb2woKTtcclxuICAgICAgICBsZXQgcHJldlBhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgbGluZURyYXcub25QYXRoRmluaXNoZWQgPSAocGF0aCkgPT4ge1xyXG4gICAgICAgICAgICBwYXRoLmZsYXR0ZW4oNDApO1xyXG4gICAgICAgICAgICBwYXRoLnNtb290aCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYocHJldlBhdGgpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGxheW91dCA9IG5ldyBWZXJ0aWNhbEJvdW5kc1RleHRMYXlvdXQocGF0aCwgcHJldlBhdGgpO1xyXG4gICAgICAgICAgICAgICAgbGF5b3V0LmxheW91dChzYW1wbGVUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLmZvbnQsIFxyXG4gICAgICAgICAgICAgICAgICAgIChpdGVtKSA9PiB0aGlzLmFwcC5wYXBlci52aWV3LmRyYXcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHByZXZQYXRoID0gcGF0aDtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5kZWNsYXJlIHZhciBzb2x2ZTogKGE6IGFueSwgYjogYW55LCBmYXN0OiBib29sZWFuKSA9PiB2b2lkO1xyXG5cclxuY2xhc3MgUGVyc3BlY3RpdmVUcmFuc2Zvcm0ge1xyXG4gICAgXHJcbiAgICBzb3VyY2U6IFF1YWQ7XHJcbiAgICBkZXN0OiBRdWFkO1xyXG4gICAgcGVyc3A6IGFueTtcclxuICAgIG1hdHJpeDogbnVtYmVyW107XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZTogUXVhZCwgZGVzdDogUXVhZCl7XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5kZXN0ID0gZGVzdDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm1hdHJpeCA9IFBlcnNwZWN0aXZlVHJhbnNmb3JtLmNyZWF0ZU1hdHJpeChzb3VyY2UsIGRlc3QpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBHaXZlbiBhIDR4NCBwZXJzcGVjdGl2ZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXgsIGFuZCBhIDJEIHBvaW50IChhIDJ4MSB2ZWN0b3IpLFxyXG4gICAgLy8gYXBwbGllcyB0aGUgdHJhbnNmb3JtYXRpb24gbWF0cml4IGJ5IGNvbnZlcnRpbmcgdGhlIHBvaW50IHRvIGhvbW9nZW5lb3VzXHJcbiAgICAvLyBjb29yZGluYXRlcyBhdCB6PTAsIHBvc3QtbXVsdGlwbHlpbmcsIGFuZCB0aGVuIGFwcGx5aW5nIGEgcGVyc3BlY3RpdmUgZGl2aWRlLlxyXG4gICAgdHJhbnNmb3JtUG9pbnQocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIGxldCBwMyA9IFBlcnNwZWN0aXZlVHJhbnNmb3JtLm11bHRpcGx5KHRoaXMubWF0cml4LCBbcG9pbnQueCwgcG9pbnQueSwgMCwgMV0pO1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgcGFwZXIuUG9pbnQocDNbMF0gLyBwM1szXSwgcDNbMV0gLyBwM1szXSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGNyZWF0ZU1hdHJpeChzb3VyY2U6IFF1YWQsIHRhcmdldDogUXVhZCk6IG51bWJlcltdIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc291cmNlUG9pbnRzID0gW1xyXG4gICAgICAgICAgICBbc291cmNlLmEueCwgc291cmNlLmEueV0sIFxyXG4gICAgICAgICAgICBbc291cmNlLmIueCwgc291cmNlLmIueV0sIFxyXG4gICAgICAgICAgICBbc291cmNlLmMueCwgc291cmNlLmMueV0sIFxyXG4gICAgICAgICAgICBbc291cmNlLmQueCwgc291cmNlLmQueV1dO1xyXG4gICAgICAgIGxldCB0YXJnZXRQb2ludHMgPSBbXHJcbiAgICAgICAgICAgIFt0YXJnZXQuYS54LCB0YXJnZXQuYS55XSwgXHJcbiAgICAgICAgICAgIFt0YXJnZXQuYi54LCB0YXJnZXQuYi55XSwgXHJcbiAgICAgICAgICAgIFt0YXJnZXQuYy54LCB0YXJnZXQuYy55XSwgXHJcbiAgICAgICAgICAgIFt0YXJnZXQuZC54LCB0YXJnZXQuZC55XV07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IFtdLCBiID0gW10sIGkgPSAwLCBuID0gc291cmNlUG9pbnRzLmxlbmd0aDsgaSA8IG47ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgcyA9IHNvdXJjZVBvaW50c1tpXSwgdCA9IHRhcmdldFBvaW50c1tpXTtcclxuICAgICAgICAgICAgYS5wdXNoKFtzWzBdLCBzWzFdLCAxLCAwLCAwLCAwLCAtc1swXSAqIHRbMF0sIC1zWzFdICogdFswXV0pLCBiLnB1c2godFswXSk7XHJcbiAgICAgICAgICAgIGEucHVzaChbMCwgMCwgMCwgc1swXSwgc1sxXSwgMSwgLXNbMF0gKiB0WzFdLCAtc1sxXSAqIHRbMV1dKSwgYi5wdXNoKHRbMV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IFggPSBzb2x2ZShhLCBiLCB0cnVlKTsgXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgWFswXSwgWFszXSwgMCwgWFs2XSxcclxuICAgICAgICAgICAgWFsxXSwgWFs0XSwgMCwgWFs3XSxcclxuICAgICAgICAgICAgICAgMCwgICAgMCwgMSwgICAgMCxcclxuICAgICAgICAgICAgWFsyXSwgWFs1XSwgMCwgICAgMVxyXG4gICAgICAgIF0ubWFwKGZ1bmN0aW9uKHgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoeCAqIDEwMDAwMCkgLyAxMDAwMDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUG9zdC1tdWx0aXBseSBhIDR4NCBtYXRyaXggaW4gY29sdW1uLW1ham9yIG9yZGVyIGJ5IGEgNHgxIGNvbHVtbiB2ZWN0b3I6XHJcbiAgICAvLyBbIG0wIG00IG04ICBtMTIgXSAgIFsgdjAgXSAgIFsgeCBdXHJcbiAgICAvLyBbIG0xIG01IG05ICBtMTMgXSAqIFsgdjEgXSA9IFsgeSBdXHJcbiAgICAvLyBbIG0yIG02IG0xMCBtMTQgXSAgIFsgdjIgXSAgIFsgeiBdXHJcbiAgICAvLyBbIG0zIG03IG0xMSBtMTUgXSAgIFsgdjMgXSAgIFsgdyBdXHJcbiAgICBzdGF0aWMgbXVsdGlwbHkobWF0cml4LCB2ZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBtYXRyaXhbMF0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNF0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbOCBdICogdmVjdG9yWzJdICsgbWF0cml4WzEyXSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzFdICogdmVjdG9yWzBdICsgbWF0cml4WzVdICogdmVjdG9yWzFdICsgbWF0cml4WzkgXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxM10gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFsyXSAqIHZlY3RvclswXSArIG1hdHJpeFs2XSAqIHZlY3RvclsxXSArIG1hdHJpeFsxMF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTRdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbM10gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbN10gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbMTFdICogdmVjdG9yWzJdICsgbWF0cml4WzE1XSAqIHZlY3RvclszXVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFF1YWQge1xyXG4gICAgYTogcGFwZXIuUG9pbnQ7XHJcbiAgICBiOiBwYXBlci5Qb2ludDtcclxuICAgIGM6IHBhcGVyLlBvaW50O1xyXG4gICAgZDogcGFwZXIuUG9pbnQ7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCwgYzogcGFwZXIuUG9pbnQsIGQ6IHBhcGVyLlBvaW50KXtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgICAgIHRoaXMuYiA9IGI7XHJcbiAgICAgICAgdGhpcy5jID0gYztcclxuICAgICAgICB0aGlzLmQgPSBkO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgZnJvbVJlY3RhbmdsZShyZWN0OiBwYXBlci5SZWN0YW5nbGUpe1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhZChcclxuICAgICAgICAgICAgcmVjdC50b3BMZWZ0LFxyXG4gICAgICAgICAgICByZWN0LnRvcFJpZ2h0LFxyXG4gICAgICAgICAgICByZWN0LmJvdHRvbUxlZnQsXHJcbiAgICAgICAgICAgIHJlY3QuYm90dG9tUmlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgZnJvbUNvb3Jkcyhjb29yZHM6IG51bWJlcltdKSA6IFF1YWQge1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhZChcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1swXSwgY29vcmRzWzFdKSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1syXSwgY29vcmRzWzNdKSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1s0XSwgY29vcmRzWzVdKSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1s2XSwgY29vcmRzWzddKVxyXG4gICAgICAgIClcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXNDb29yZHMoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHRoaXMuYS54LCB0aGlzLmEueSxcclxuICAgICAgICAgICAgdGhpcy5iLngsIHRoaXMuYi55LFxyXG4gICAgICAgICAgICB0aGlzLmMueCwgdGhpcy5jLnksXHJcbiAgICAgICAgICAgIHRoaXMuZC54LCB0aGlzLmQueVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgQm90dG9tVGV4dExheW91dCBpbXBsZW1lbnRzIFRleHRMYXlvdXQge1xyXG5cclxuICAgIGJvdHRvbTogcGFwZXIuUGF0aFxyXG4gICAgZm9udFNpemUgPSAxMDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYm90dG9tOiBwYXBlci5QYXRoKSB7XHJcbiAgICAgICAgdGhpcy5ib3R0b20gPSBib3R0b207XHJcbiAgICB9XHJcblxyXG4gICAgbGF5b3V0KHRleHQ6IHN0cmluZywgb25Db21wbGV0ZT86IChpdGVtOiBwYXBlci5JdGVtKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgbmV3IEZvbnRMb2FkZXIoQW1hdGljVXJsLCBmb250ID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBsZXR0ZXJHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgICAgICBsZXQgbGV0dGVyUGF0aHMgPSBmb250LmdldFBhdGhzKHRleHQsIDAsIDAsIHRoaXMuZm9udFNpemUpXHJcbiAgICAgICAgICAgICAgICAubWFwKHAgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRoID0gUGFwZXJIZWxwZXJzLmltcG9ydE9wZW5UeXBlUGF0aChwKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXR0ZXJHcm91cC5hZGRDaGlsZChwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IHRleHRPcmlnaW4gPSBsZXR0ZXJHcm91cC5ib3VuZHMuYm90dG9tTGVmdDtcclxuICAgICAgICAgICAgbGV0IGxpbmVhckxlbmd0aCA9IGxldHRlckdyb3VwLmJvdW5kcy53aWR0aDtcclxuICAgICAgICAgICAgbGV0IGxheW91dFBhdGhMZW5ndGggPSB0aGlzLmJvdHRvbS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBvZmZzZXRTY2FsaW5nID0gbGF5b3V0UGF0aExlbmd0aCAvIGxpbmVhckxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGxldCBpZHggPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBsZXR0ZXJQYXRoIG9mIGxldHRlclBhdGhzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGV0dGVyT2Zmc2V0ID0gKGxldHRlclBhdGguYm91bmRzLmxlZnQgLSB0ZXh0T3JpZ2luLngpICogb2Zmc2V0U2NhbGluZztcclxuICAgICAgICAgICAgICAgIGxldCBib3R0b21MZWZ0UHJpbWUgPSB0aGlzLmJvdHRvbS5nZXRQb2ludEF0KGxldHRlck9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm90dG9tUmlnaHRQcmltZSA9IHRoaXMuYm90dG9tLmdldFBvaW50QXQoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4obGF5b3V0UGF0aExlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyT2Zmc2V0ICsgbGV0dGVyUGF0aC5ib3VuZHMud2lkdGggKiBvZmZzZXRTY2FsaW5nKSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm90dG9tVmVjdG9yUHJpbWUgPSBib3R0b21SaWdodFByaW1lLnN1YnRyYWN0KGJvdHRvbUxlZnRQcmltZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJvdGF0ZUFuZ2xlID1cclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMSwgMCkuZ2V0RGlyZWN0ZWRBbmdsZShib3R0b21SaWdodFByaW1lLnN1YnRyYWN0KGJvdHRvbUxlZnRQcmltZSkpXHJcbiAgICAgICAgICAgICAgICAvLyByZXBvc2l0aW9uIHVzaW5nIGJvdHRvbUxlZnRcclxuICAgICAgICAgICAgICAgIGxldHRlclBhdGgucG9zaXRpb24gPSBib3R0b21MZWZ0UHJpbWVcclxuICAgICAgICAgICAgICAgICAgICAuYWRkKGxldHRlclBhdGguYm91bmRzLmNlbnRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3VidHJhY3QobGV0dGVyUGF0aC5ib3VuZHMuYm90dG9tTGVmdCkpO1xyXG4gICAgICAgICAgICAgICAgbGV0dGVyUGF0aC5yb3RhdGUocm90YXRlQW5nbGUsIGJvdHRvbUxlZnRQcmltZSk7XHJcbiAgICAgICAgICAgICAgICBsZXR0ZXJQYXRoLnNjYWxlKG9mZnNldFNjYWxpbmcsIGJvdHRvbUxlZnRQcmltZSk7XHJcbiAgICAgICAgICAgICAgICBpZHgrKztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYob25Db21wbGV0ZSl7XHJcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlKGxldHRlckdyb3VwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBQYXRoT2Zmc2V0U2NhbGluZyB7XHJcblxyXG4gICAgdG86IHBhcGVyLlBhdGg7XHJcbiAgICBzY2FsZTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZyb21MZW5ndGg6IG51bWJlciwgdG86IHBhcGVyLlBhdGgpIHtcclxuICAgICAgICB0aGlzLnRvID0gdG87XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IHRvLmxlbmd0aCAvIGZyb21MZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VG9Qb2ludEF0KGZyb21QYXRoT2Zmc2V0OiBudW1iZXIpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgbGV0IHRvT2Zmc2V0ID0gTWF0aC5taW4odGhpcy50by5sZW5ndGgsIGZyb21QYXRoT2Zmc2V0ICogdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG8uZ2V0UG9pbnRBdCh0b09mZnNldCk7XHJcbiAgICB9XHJcbn0iLCJcclxuLyoqXHJcbiAqIEhhbmRsZSB0aGF0IHNpdHMgb24gbWlkcG9pbnQgb2YgY3VydmVcclxuICogd2hpY2ggd2lsbCBzcGxpdCB0aGUgY3VydmUgd2hlbiBkcmFnZ2VkLlxyXG4gKi9cclxuY2xhc3MgQ3VydmVTcGxpdHRlckhhbmRsZSBleHRlbmRzIHBhcGVyLlNoYXBlIHtcclxuIFxyXG4gICAgY3VydmU6IHBhcGVyLkN1cnZlO1xyXG4gICAgb25EcmFnRW5kOiAobmV3U2VnbWVudDogcGFwZXIuU2VnbWVudCwgZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuIFxyXG4gICAgY29uc3RydWN0b3IoY3VydmU6IHBhcGVyLkN1cnZlKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnZlID0gY3VydmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNlbGYgPSA8YW55PnRoaXM7XHJcbiAgICAgICAgc2VsZi5fdHlwZSA9ICdjaXJjbGUnO1xyXG4gICAgICAgIHNlbGYuX3JhZGl1cyA9IDU7XHJcbiAgICAgICAgc2VsZi5fc2l6ZSA9IG5ldyBwYXBlci5TaXplKHNlbGYuX3JhZGl1cyAqIDIpO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKGN1cnZlLmdldFBvaW50QXQoMC41ICogY3VydmUubGVuZ3RoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDI7XHJcbiAgICAgICAgdGhpcy5zdHJva2VDb2xvciA9ICdibHVlJztcclxuICAgICAgICB0aGlzLmZpbGxDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gMC41ICogMC4zOyBcclxuIFxyXG4gICAgICAgIGxldCBuZXdTZWdtZW50OiBwYXBlci5TZWdtZW50O1xyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IDxNb3VzZUJlaGF2aW9yPntcclxuICAgICAgICAgICAgb25EcmFnU3RhcnQ6IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudCA9IG5ldyBwYXBlci5TZWdtZW50KHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY3VydmUucGF0aC5pbnNlcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmUuaW5kZXggKyAxLCBcclxuICAgICAgICAgICAgICAgICAgICBuZXdTZWdtZW50XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWc6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdQb3MgPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zO1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudC5wb2ludCA9IG5ld1BvcztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnRW5kOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uRHJhZ0VuZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkRyYWdFbmQobmV3U2VnbWVudCwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG4iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL3BhcGVyLmQudHNcIiAvPlxyXG5cclxuY2xhc3MgTGluZURyYXdUb29sIHtcclxuICAgIGdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICBjdXJyZW50UGF0aDogcGFwZXIuUGF0aDtcclxuICAgIG9uUGF0aEZpbmlzaGVkOiAocGF0aDogcGFwZXIuUGF0aCkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB2YXIgdG9vbCA9IG5ldyBwYXBlci5Ub29sKCk7XHJcblxyXG4gICAgICAgIHRvb2wub25Nb3VzZURyYWcgPSBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IGV2ZW50Lm1pZGRsZVBvaW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRQYXRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UGF0aChwb2ludCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kUGF0aChwb2ludCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b29sLm9uTW91c2VVcCA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5maW5pc2hQYXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0UGF0aChwb2ludCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmluaXNoUGF0aCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbmV3IHBhcGVyLlBhdGgoeyBzdHJva2VDb2xvcjogJ2xpZ2h0Z3JheScsIHN0cm9rZVdpZHRoOiAyIH0pO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuYWRkQ2hpbGQodGhpcy5jdXJyZW50UGF0aCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5hZGQocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZFBhdGgocG9pbnQpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLmFkZChwb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbmlzaFBhdGgoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5zaW1wbGlmeSg1KTtcclxuICAgICAgICAgICAgbGV0IHBhdGggPSB0aGlzLmN1cnJlbnRQYXRoO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25QYXRoRmluaXNoZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25QYXRoRmluaXNoZWQuY2FsbCh0aGlzLCBwYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInR5cGluZ3MvcGFwZXIuZC50c1wiIC8+XHJcblxyXG5pbnRlcmZhY2UgUGF0aExpa2Uge1xyXG4gICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICBnZXRMb2NhdGlvbkF0KG9mZnNldDogbnVtYmVyLCBpc1BhcmFtZXRlcj86IGJvb2xlYW4pOiBwYXBlci5DdXJ2ZUxvY2F0aW9uO1xyXG4gICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlciwgaXNQYXRhbWV0ZXI/OiBib29sZWFuKTogcGFwZXIuUG9pbnQ7XHJcbiAgICBnZXRUYW5nZW50QXQob2Zmc2V0OiBudW1iZXIsIGlzUGF0YW1ldGVyPzogYm9vbGVhbik6IHBhcGVyLlBvaW50O1xyXG4gICAgZ2V0TmVhcmVzdFBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50O1xyXG59XHJcblxyXG5jbGFzcyBMaW5rZWRQYXRoR3JvdXAgZXh0ZW5kcyBwYXBlci5Hcm91cFxyXG4gICAgaW1wbGVtZW50cyBQYXRoTGlrZSBcclxue1xyXG4gICAgXHJcbiAgICBhZGRDaGlsZChwYXRoOiBwYXBlci5QYXRoKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFkZENoaWxkKHBhdGgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnJlZHVjZSgoYSwgYjogcGFwZXIuUGF0aCkgPT4gYSArIGIubGVuZ3RoLCAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldCBwYXRocygpOiBwYXBlci5QYXRoW10ge1xyXG4gICAgICAgIHJldHVybiA8cGFwZXIuUGF0aFtdPnRoaXMuY2hpbGRyZW47XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldExvY2F0aW9uQXQob2Zmc2V0OiBudW1iZXIsIGlzUGFyYW1ldGVyPzogYm9vbGVhbik6IHBhcGVyLkN1cnZlTG9jYXRpb257XHJcbiAgICAgICAgbGV0IHBhdGg6IHBhcGVyLlBhdGggPSBudWxsO1xyXG4gICAgICAgIGZvcihwYXRoIG9mIHRoaXMucGF0aHMpe1xyXG4gICAgICAgICAgICBsZXQgbGVuID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmKGxlbiA+PSBvZmZzZXQpe1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb2Zmc2V0IC09IGxlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGguZ2V0TG9jYXRpb25BdChvZmZzZXQsIGlzUGFyYW1ldGVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlciwgaXNQYXJhbWV0ZXI/OiBib29sZWFuKTogcGFwZXIuUG9pbnR7XHJcbiAgICAgICAgbGV0IHBhdGg6IHBhcGVyLlBhdGggPSBudWxsO1xyXG4gICAgICAgIGZvcihwYXRoIG9mIHRoaXMucGF0aHMpe1xyXG4gICAgICAgICAgICBsZXQgbGVuID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmKGxlbiA+PSBvZmZzZXQpe1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb2Zmc2V0IC09IGxlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGguZ2V0UG9pbnRBdChvZmZzZXQsIGlzUGFyYW1ldGVyKTsgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFRhbmdlbnRBdChvZmZzZXQ6IG51bWJlciwgaXNQYXRhbWV0ZXI/OiBib29sZWFuKTogcGFwZXIuUG9pbnR7XHJcbiAgICAgICAgbGV0IHBhdGg6IHBhcGVyLlBhdGggPSBudWxsO1xyXG4gICAgICAgIGZvcihwYXRoIG9mIHRoaXMucGF0aHMpe1xyXG4gICAgICAgICAgICBsZXQgbGVuID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmKGxlbiA+PSBvZmZzZXQpe1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb2Zmc2V0IC09IGxlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGguZ2V0VGFuZ2VudEF0KG9mZnNldCwgaXNQYXRhbWV0ZXIpOyAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0TmVhcmVzdFBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBsZXQgbmVhcmVzdEFnZzogcGFwZXIuUG9pbnQ7XHJcbiAgICAgICAgbGV0IGRpc3RBZ2c6IG51bWJlcjtcclxuICAgICAgICBmb3IobGV0IHBhdGggb2YgdGhpcy5wYXRocyl7XHJcbiAgICAgICAgICAgIGlmKHBhdGguc2VnbWVudHMubGVuZ3RoIDwgMil7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbmVhcmVzdCA9IHBhdGguZ2V0TmVhcmVzdFBvaW50KHBvaW50KTtcclxuICAgICAgICAgICAgbGV0IGRpc3QgPSBuZWFyZXN0LmdldERpc3RhbmNlKHBvaW50KTtcclxuICAgICAgICAgICAgaWYoIW5lYXJlc3RBZ2cgfHwgZGlzdCA8IGRpc3RBZ2cpe1xyXG4gICAgICAgICAgICAgICAgbmVhcmVzdEFnZyA9IG5lYXJlc3Q7XHJcbiAgICAgICAgICAgICAgICBkaXN0QWdnID0gZGlzdDsgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmVhcmVzdEFnZztcclxuICAgIH1cclxufSIsIlxyXG5kZWNsYXJlIG1vZHVsZSBwYXBlciB7XHJcbiAgICBpbnRlcmZhY2UgSXRlbSB7XHJcbiAgICAgICAgbW91c2VCZWhhdmlvcjogTW91c2VCZWhhdmlvcjtcclxuICAgIH0gXHJcbn1cclxuXHJcbmludGVyZmFjZSBNb3VzZUJlaGF2aW9yIHtcclxuICAgIG9uQ2xpY2s/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIFxyXG4gICAgb25EcmFnU3RhcnQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDsgXHJcbiAgICBvbkRyYWc/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uRHJhZ0VuZD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgTW91c2VBY3Rpb24ge1xyXG4gICAgc3RhcnRFdmVudDogcGFwZXIuVG9vbEV2ZW50O1xyXG4gICAgaXRlbTogcGFwZXIuSXRlbTtcclxuICAgIGRyYWdnZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmNsYXNzIE1vdXNlQmVoYXZpb3JUb29sIGV4dGVuZHMgcGFwZXIuVG9vbCB7XHJcblxyXG4gICAgaGl0T3B0aW9ucyA9IHtcclxuICAgICAgICBzZWdtZW50czogdHJ1ZSxcclxuICAgICAgICBzdHJva2U6IHRydWUsXHJcbiAgICAgICAgZmlsbDogdHJ1ZSxcclxuICAgICAgICB0b2xlcmFuY2U6IDVcclxuICAgIH07XHJcblxyXG4gICAgYWN0aW9uOiBNb3VzZUFjdGlvbjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocGFwZXJTY29wZTogcGFwZXIuUGFwZXJTY29wZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24gPSAoZXZlbnQpID0+IHtcclxuICAgICAgICB0aGlzLmFjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgICAgIHZhciBoaXRSZXN1bHQgPSBwYXBlci5wcm9qZWN0LmhpdFRlc3QoXHJcbiAgICAgICAgICAgIGV2ZW50LnBvaW50LFxyXG4gICAgICAgICAgICB0aGlzLmhpdE9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAoaGl0UmVzdWx0ICYmIGhpdFJlc3VsdC5pdGVtKSB7XHJcbiAgICAgICAgICAgIGxldCBkcmFnZ2FibGUgPSB0aGlzLmZpbmREcmFnZ2FibGVVcHdhcmQoaGl0UmVzdWx0Lml0ZW0pO1xyXG4gICAgICAgICAgICBpZihkcmFnZ2FibGUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSA8TW91c2VBY3Rpb24+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtOiBkcmFnZ2FibGVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vdGhpcy5wYXBlclNjb3BlLnByb2plY3QuYWN0aXZlTGF5ZXIuYWRkQ2hpbGQodGhpcy5kcmFnSXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURyYWcgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICBpZih0aGlzLmFjdGlvbil7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmFjdGlvbi5kcmFnZ2VkKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uLmRyYWdnZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5hY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ1N0YXJ0KXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnU3RhcnQuY2FsbChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24uaXRlbSwgdGhpcy5hY3Rpb24uc3RhcnRFdmVudCk7IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWcpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZy5jYWxsKHRoaXMuYWN0aW9uLml0ZW0sIGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgb25Nb3VzZVVwID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYodGhpcy5hY3Rpb24pe1xyXG4gICAgICAgICAgICBsZXQgYWN0aW9uID0gdGhpcy5hY3Rpb247XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKGFjdGlvbi5kcmFnZ2VkKXtcclxuICAgICAgICAgICAgICAgIC8vIGRyYWdcclxuICAgICAgICAgICAgICAgIGlmKGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnRW5kKXtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ0VuZC5jYWxsKGFjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9ICAgXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjbGlja1xyXG4gICAgICAgICAgICAgICAgaWYoYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkNsaWNrKXtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uQ2xpY2suY2FsbChhY3Rpb24uaXRlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbktleURvd24gPSAoZXZlbnQpID0+IHtcclxuICAgICAgIGlmIChldmVudC5rZXkgPT0gJ3NwYWNlJykge1xyXG5cdFx0ICBwYXBlci5wcm9qZWN0LmFjdGl2ZUxheWVyLnNlbGVjdGVkID0gIXBhcGVyLnByb2plY3QuYWN0aXZlTGF5ZXIuc2VsZWN0ZWQ7XHJcblx0ICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBmaW5kRHJhZ2dhYmxlVXB3YXJkKGl0ZW06IHBhcGVyLkl0ZW0pOiBwYXBlci5JdGVte1xyXG4gICAgICAgIHdoaWxlKCFpdGVtLm1vdXNlQmVoYXZpb3IgJiYgaXRlbS5wYXJlbnQgJiYgaXRlbS5wYXJlbnQuY2xhc3NOYW1lICE9ICdMYXllcicpe1xyXG4gICAgICAgICAgICBpdGVtID0gaXRlbS5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtLm1vdXNlQmVoYXZpb3JcclxuICAgICAgICAgICAgPyBpdGVtXHJcbiAgICAgICAgICAgIDogbnVsbDtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgUGFwZXJIZWxwZXJzIHtcclxuXHJcbiAgICBzdGF0aWMgaW1wb3J0T3BlblR5cGVQYXRoKG9wZW5QYXRoOiBvcGVudHlwZS5QYXRoKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChvcGVuUGF0aC50b1BhdGhEYXRhKCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGxldCBzdmcgPSBvcGVuUGF0aC50b1NWRyg0KTtcclxuICAgICAgICAvLyByZXR1cm4gPHBhcGVyLlBhdGg+cGFwZXIucHJvamVjdC5pbXBvcnRTVkcoc3ZnKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdHJhY2VQYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuUGF0aEl0ZW0ge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VDb21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgsIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgaWYgKCFwYXRoLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBhdGhzID0gcGF0aC5jaGlsZHJlbi5tYXAocCA9PlxyXG4gICAgICAgICAgICB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wLCBwb2ludHNQZXJQYXRoKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgoe1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogcGF0aHMsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2UsXHJcbiAgICAgICAgICAgIGZpbGxDb2xvcjogJ2xpZ2h0Z3JheSdcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZVBhdGgocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAvLyBpZighcGF0aCB8fCAhcGF0aC5zZWdtZW50cyB8fCBwYXRoLnNlZ21lbnRzLmxlbmd0aCl7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBsZXQgcGF0aExlbmd0aCA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGxldCBvZmZzZXRJbmNyID0gcGF0aExlbmd0aCAvIG51bVBvaW50cztcclxuICAgICAgICBsZXQgcG9pbnRzID0gW107XHJcbiAgICAgICAgLy9wb2ludHMubGVuZ3RoID0gbnVtUG9pbnRzO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGkrKyA8IG51bVBvaW50cykge1xyXG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBwYXRoLmdldFBvaW50QXQoTWF0aC5taW4ob2Zmc2V0LCBwYXRoTGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IG9mZnNldEluY3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcGF0aCA9IG5ldyBwYXBlci5QYXRoKHBvaW50cyk7XHJcbiAgICAgICAgcGF0aC5maWxsQ29sb3IgPSAnbGlnaHRncmF5JztcclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2FuZHdpY2hQYXRoUHJvamVjdGlvbih0b3BQYXRoOiBwYXBlci5DdXJ2ZWxpa2UsIGJvdHRvbVBhdGg6IHBhcGVyLkN1cnZlbGlrZSlcclxuICAgICAgICA6ICh1bml0UG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgY29uc3QgdG9wUGF0aExlbmd0aCA9IHRvcFBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGJvdHRvbVBhdGhMZW5ndGggPSBib3R0b21QYXRoLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24odW5pdFBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICAgICAgbGV0IHRvcFBvaW50ID0gdG9wUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogdG9wUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGxldCBib3R0b21Qb2ludCA9IGJvdHRvbVBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIGJvdHRvbVBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgICBpZiAodG9wUG9pbnQgPT0gbnVsbCB8fCBib3R0b21Qb2ludCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcImNvdWxkIG5vdCBnZXQgcHJvamVjdGVkIHBvaW50IGZvciB1bml0IHBvaW50IFwiICsgdW5pdFBvaW50LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRvcFBvaW50LmFkZChib3R0b21Qb2ludC5zdWJ0cmFjdCh0b3BQb2ludCkubXVsdGlwbHkodW5pdFBvaW50LnkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1hcmtlckdyb3VwOiBwYXBlci5Hcm91cDtcclxuXHJcbiAgICBzdGF0aWMgcmVzZXRNYXJrZXJzKCl7XHJcbiAgICAgICAgaWYoUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwKXtcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAub3BhY2l0eSA9IDAuMjtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyTGluZShhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQpOiBwYXBlci5JdGVte1xyXG4gICAgICAgIGxldCBsaW5lID0gcGFwZXIuUGF0aC5MaW5lKGEsYik7XHJcbiAgICAgICAgbGluZS5zdHJva2VDb2xvciA9ICdncmVlbic7XHJcbiAgICAgICAgLy9saW5lLmRhc2hBcnJheSA9IFs1LCA1XTtcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobGluZSk7XHJcbiAgICAgICAgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1hcmtlcihwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICBsZXQgbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvaW50LCAyKTtcclxuICAgICAgICBtYXJrZXIuc3Ryb2tlQ29sb3IgPSAncmVkJztcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobWFya2VyKTtcclxuICAgICAgICByZXR1cm4gbWFya2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzaW1wbGlmeShwYXRoOiBwYXBlci5QYXRoSXRlbSwgdG9sZXJhbmNlPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5zaW1wbGlmeSg8cGFwZXIuUGF0aEl0ZW0+cCwgdG9sZXJhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICg8cGFwZXIuUGF0aD5wYXRoKS5zaW1wbGlmeSh0b2xlcmFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBQYXRoU2VjdGlvbiBpbXBsZW1lbnRzIHBhcGVyLkN1cnZlbGlrZSB7XHJcbiAgICBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgb2Zmc2V0OiBudW1iZXI7XHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocGF0aDogcGFwZXIuUGF0aCwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRQb2ludEF0KG9mZnNldDogbnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXRoLmdldFBvaW50QXQob2Zmc2V0ICsgdGhpcy5vZmZzZXQpO1xyXG4gICAgfVxyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwidHlwaW5ncy9wYXBlci5kLnRzXCIgLz5cclxuXHJcbmNsYXNzIFBhdGhUZXh0IGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG4gICAgXHJcbiAgICBwcml2YXRlIHBhdGg6IFBhdGhMaWtlO1xyXG4gICAgcHJpdmF0ZSBfdGV4dDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBwdWJsaWMgc3R5bGU7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGhMaWtlLCB0ZXh0Pzogc3RyaW5nLCBzdHlsZT86IGFueSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMuX3RleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXMuc3R5bGUgPSBzdHlsZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gXHJcbiAgICBnZXQgdGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXQgdGV4dCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fdGV4dCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHRleHQgPSB0aGlzLnRleHQ7XHJcbiAgICAgICAgbGV0IHBhdGggPSB0aGlzLnBhdGg7XHJcbiAgICAgICAgaWYgKHRleHQgJiYgdGV4dC5sZW5ndGggJiYgcGF0aCAmJiBwYXRoLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gTWVhc3VyZSBnbHlwaHMgaW4gcGFpcnMgdG8gY2FwdHVyZSB3aGl0ZSBzcGFjZS5cclxuICAgICAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxyXG4gICAgICAgICAgICB2YXIgZ2x5cGhQYWlycyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpKzEpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gRm9yIGVhY2ggY2hhcmFjdGVyLCBmaW5kIGNlbnRlciBvZmZzZXQuXHJcbiAgICAgICAgICAgIHZhciB4T2Zmc2V0cyA9IFswXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIE1lYXN1cmUgdGhyZWUgY2hhcmFjdGVycyBhdCBhIHRpbWUgdG8gZ2V0IHRoZSBhcHByb3ByaWF0ZSBcclxuICAgICAgICAgICAgICAgIC8vICAgc3BhY2UgYmVmb3JlIGFuZCBhZnRlciB0aGUgZ2x5cGguXHJcbiAgICAgICAgICAgICAgICB2YXIgdHJpYWRUZXh0ID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSAtIDEsIGkgKyAxKSk7XHJcbiAgICAgICAgICAgICAgICB0cmlhZFRleHQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXHJcbiAgICAgICAgICAgICAgICAvLyAgIGFuZCBoYWxmIG9mIGN1cnJlbnQgZ2x5cGggcGFpci5cclxuICAgICAgICAgICAgICAgIC8vIE11c3QgYmUgcmlnaHQsIGJlY2F1c2UgaXQgd29ya3MuXHJcbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoIFxyXG4gICAgICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpIC0gMV0uYm91bmRzLndpZHRoIC8gMiBcclxuICAgICAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaV0uYm91bmRzLndpZHRoIC8gMjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gQWRkIG9mZnNldCB3aWR0aCB0byBwcmlvciBvZmZzZXQuIFxyXG4gICAgICAgICAgICAgICAgeE9mZnNldHNbaV0gPSB4T2Zmc2V0c1tpIC0gMV0gKyBvZmZzZXRXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gU2V0IHBvaW50IGZvciBlYWNoIGdseXBoIGFuZCByb3RhdGUgZ2x5cGggYW9ydW5kIHRoZSBwb2ludFxyXG4gICAgICAgICAgICBsZXQgcGF0aExlbmd0aCA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjZW50ZXJPZmZzID0geE9mZnNldHNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aExlbmd0aCA8IGNlbnRlck9mZnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjZW50ZXJPZmZzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNlbnRlck9mZnMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdseXBoUGFpcnNbaV0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXRoUG9pbnQgPSBwYXRoLmdldFBvaW50QXQoY2VudGVyT2Zmcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2x5cGhQYWlyc1tpXS5wb3NpdGlvbiA9IHBhdGhQb2ludDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFuID0gcGF0aC5nZXRUYW5nZW50QXQoY2VudGVyT2Zmcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGFuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdseXBoUGFpcnNbaV0ucm90YXRlKHRhbi5hbmdsZSwgcGF0aFBvaW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJDb3VsZCBub3QgZ2V0IHRhbmdlbnQgYXQgXCIsIGNlbnRlck9mZnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICBcclxuICAgIC8vIGNyZWF0ZSBhIFBvaW50VGV4dCBvYmplY3QgZm9yIGEgc3RyaW5nIGFuZCBhIHN0eWxlXHJcbiAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCAodGV4dCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XHJcbiAgICAgICAgcG9pbnRUZXh0LmNvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgIHBvaW50VGV4dC5qdXN0aWZpY2F0aW9uID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBsZXQgc3R5bGUgPSB0aGlzLnN0eWxlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChzdHlsZSkge1xyXG4gICAgICAgICAgICBpZiAoc3R5bGUuZm9udEZhbWlseSkgcG9pbnRUZXh0LmZvbnRGYW1pbHkgPSBzdHlsZS5mb250RmFtaWx5O1xyXG4gICAgICAgICAgICBpZiAoc3R5bGUuZm9udFNpemUpIHBvaW50VGV4dC5mb250U2l6ZSA9IHN0eWxlLmZvbnRTaXplO1xyXG4gICAgICAgICAgICBpZiAoc3R5bGUuZm9udFdpZWdodCkgcG9pbnRUZXh0LmZvbnRXZWlnaHQgPSBzdHlsZS5mb250V2VpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB2YXIgcmVjdCA9IHBhcGVyLlBhdGguUmVjdGFuZ2xlKHBvaW50VGV4dC5ib3VuZHMpO1xyXG4gICAgICAgIHJlY3QuZmlsbENvbG9yID0gJ2xpZ2h0Z3JheSc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgZ3JvdXAuc3R5bGUgPSBzdHlsZTtcclxuICAgICAgICBncm91cC5hZGRDaGlsZChwb2ludFRleHQpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENoaWxkKGdyb3VwKTtcclxuICAgICAgICByZXR1cm4gZ3JvdXA7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuXHJcbiIsIlxyXG5jbGFzcyBQYXRoVHJhbnNmb3JtIHtcclxuICAgIHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICB0aGlzLnBvaW50VHJhbnNmb3JtID0gcG9pbnRUcmFuc2Zvcm07XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUG9pbnQocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50VHJhbnNmb3JtKHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1QYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSkge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1Db21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1QYXRoKHBhdGg6IHBhcGVyLlBhdGgpIHtcclxuICAgICAgICBmb3IgKGxldCBzZWdtZW50IG9mIHBhdGguc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgbGV0IG9yaWdQb2ludCA9IHNlZ21lbnQucG9pbnQ7XHJcbiAgICAgICAgICAgIGxldCBuZXdQb2ludCA9IHRoaXMudHJhbnNmb3JtUG9pbnQoc2VnbWVudC5wb2ludCk7XHJcbiAgICAgICAgICAgIG9yaWdQb2ludC54ID0gbmV3UG9pbnQueDtcclxuICAgICAgICAgICAgb3JpZ1BvaW50LnkgPSBuZXdQb2ludC55O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4iLCJcclxuY2xhc3MgU2VnbWVudEhhbmRsZSBleHRlbmRzIHBhcGVyLlNoYXBlIHtcclxuIFxyXG4gICAgc2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgIG9uQ2hhbmdlQ29tcGxldGU6IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9zbW9vdGhlZDogYm9vbGVhbjtcclxuIFxyXG4gICAgY29uc3RydWN0b3Ioc2VnbWVudDogcGFwZXIuU2VnbWVudCwgcmFkaXVzPzogbnVtYmVyKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2VnbWVudCA9IHNlZ21lbnQ7XHJcblxyXG4gICAgICAgIGxldCBzZWxmID0gPGFueT50aGlzO1xyXG4gICAgICAgIHNlbGYuX3R5cGUgPSAnY2lyY2xlJztcclxuICAgICAgICBzZWxmLl9yYWRpdXMgPSA1O1xyXG4gICAgICAgIHNlbGYuX3NpemUgPSBuZXcgcGFwZXIuU2l6ZShzZWxmLl9yYWRpdXMgKiAyKTtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShzZWdtZW50LnBvaW50KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0cm9rZVdpZHRoID0gMjtcclxuICAgICAgICB0aGlzLnN0cm9rZUNvbG9yID0gJ2JsdWUnO1xyXG4gICAgICAgIHRoaXMuZmlsbENvbG9yID0gJ3doaXRlJztcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAwLjU7IFxyXG5cclxuICAgICAgICB0aGlzLm1vdXNlQmVoYXZpb3IgPSA8TW91c2VCZWhhdmlvcj57XHJcbiAgICAgICAgICAgIG9uRHJhZzogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1BvcyA9IHRoaXMucG9zaXRpb24uYWRkKGV2ZW50LmRlbHRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3M7XHJcbiAgICAgICAgICAgICAgICBzZWdtZW50LnBvaW50ID0gbmV3UG9zO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdFbmQ6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Ntb290aGVkKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uQ2hhbmdlQ29tcGxldGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DaGFuZ2VDb21wbGV0ZShldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc21vb3RoZWQgPSAhdGhpcy5zbW9vdGhlZDtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMub25DaGFuZ2VDb21wbGV0ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5nZUNvbXBsZXRlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHNtb290aGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zbW9vdGhlZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IHNtb290aGVkKHZhbHVlOiBib29sZWFuKXtcclxuICAgICAgICB0aGlzLl9zbW9vdGhlZCA9IHZhbHVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzbW9vdGhpbmcnKTtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudC5oYW5kbGVJbiA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudC5oYW5kbGVPdXQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgU3RyZXRjaHlQYXRoIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG4gICAgc291cmNlUGF0aDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgZGlzcGxheVBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIGNvcm5lcnM6IHBhcGVyLlNlZ21lbnRbXTtcclxuICAgIG91dGxpbmU6IHBhcGVyLlBhdGg7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRm9yIHJlYnVpbGRpbmcgdGhlIG1pZHBvaW50IGhhbmRsZXNcclxuICAgICAqIGFzIG91dGxpbmUgY2hhbmdlcy5cclxuICAgICAqL1xyXG4gICAgbWlkcG9pbnRHcm91cDogcGFwZXIuR3JvdXA7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc291cmNlUGF0aDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXRoID0gc291cmNlUGF0aDtcclxuICAgICAgICB0aGlzLnNvdXJjZVBhdGgudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZU91dGxpbmUoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVNlZ21lbnRNYXJrZXJzKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNaWRwaW9udE1hcmtlcnMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0ge1xyXG4gICAgICAgICAgICBvbkRyYWc6IGV2ZW50ID0+IHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSlcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIGFycmFuZ2VDb250ZW50cygpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1pZHBpb250TWFya2VycygpO1xyXG4gICAgICAgIHRoaXMuYXJyYW5nZVBhdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBhcnJhbmdlUGF0aCgpIHtcclxuICAgICAgICBsZXQgb3J0aE9yaWdpbiA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMudG9wTGVmdDtcclxuICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy53aWR0aDtcclxuICAgICAgICBsZXQgb3J0aEhlaWdodCA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBzaWRlcyA9IHRoaXMuZ2V0T3V0bGluZVNpZGVzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHRvcCA9IHNpZGVzWzBdO1xyXG4gICAgICAgIGxldCBib3R0b20gPSBzaWRlc1syXTtcclxuICAgICAgICBib3R0b20ucmV2ZXJzZSgpO1xyXG4gICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLnNhbmR3aWNoUGF0aFByb2plY3Rpb24odG9wLCBib3R0b20pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vbGV0IHByb2plY3Rpb24gPSBQYXBlckhlbHBlcnMuYm91bmRzUGF0aFByb2plY3Rpb24oc2lkZXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB0cmFuc2Zvcm0gPSBuZXcgUGF0aFRyYW5zZm9ybShwb2ludCA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KG9ydGhPcmlnaW4pO1xyXG4gICAgICAgICAgICBsZXQgdW5pdCA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gb3J0aEhlaWdodCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0ZWQgPSBwcm9qZWN0aW9uKHVuaXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IobGV0IHNpZGUgb2Ygc2lkZXMpe1xyXG4gICAgICAgICAgICBzaWRlLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBsZXQgbmV3UGF0aCA9IDxwYXBlci5Db21wb3VuZFBhdGg+dGhpcy5zb3VyY2VQYXRoLmNsb25lKCk7XHJcbiAgICAgICAgbmV3UGF0aC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBuZXdQYXRoLmZpbGxDb2xvciA9ICcjN0Q1OTY1JztcclxuXHJcbiAgICAgICAgdHJhbnNmb3JtLnRyYW5zZm9ybVBhdGhJdGVtKG5ld1BhdGgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXNwbGF5UGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlQYXRoLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5UGF0aCA9IG5ld1BhdGg7XHJcbiAgICAgICAgdGhpcy5pbnNlcnRDaGlsZCgxLCBuZXdQYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE91dGxpbmVTaWRlcygpOiBwYXBlci5QYXRoW10ge1xyXG4gICAgICAgIGxldCBzaWRlczogcGFwZXIuUGF0aFtdID0gW107XHJcbiAgICAgICAgbGV0IHNlZ21lbnRHcm91cDogcGFwZXIuU2VnbWVudFtdID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNvcm5lclBvaW50cyA9IHRoaXMuY29ybmVycy5tYXAoYyA9PiBjLnBvaW50KTtcclxuICAgICAgICBsZXQgZmlyc3QgPSBjb3JuZXJQb2ludHMuc2hpZnQoKTsgXHJcbiAgICAgICAgY29ybmVyUG9pbnRzLnB1c2goZmlyc3QpO1xyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0Q29ybmVyID0gY29ybmVyUG9pbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgbGV0IHNlZ21lbnRMaXN0ID0gdGhpcy5vdXRsaW5lLnNlZ21lbnRzLm1hcCh4ID0+IHgpO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBzZWdtZW50TGlzdC5wdXNoKHNlZ21lbnRMaXN0WzBdKTtcclxuICAgICAgICBmb3IobGV0IHNlZ21lbnQgb2Ygc2VnbWVudExpc3Qpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgc2VnbWVudEdyb3VwLnB1c2goc2VnbWVudCk7XHJcbiAgICBcclxuICAgICAgICAgICAgaWYodGFyZ2V0Q29ybmVyLmdldERpc3RhbmNlKHNlZ21lbnQucG9pbnQpIDwgMC4wMDAxKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmaW5pc2ggcGF0aFxyXG4gICAgICAgICAgICAgICAgc2lkZXMucHVzaChuZXcgcGFwZXIuUGF0aChzZWdtZW50R3JvdXApKTtcclxuICAgICAgICAgICAgICAgIHNlZ21lbnRHcm91cCA9IFtzZWdtZW50XTtcclxuICAgICAgICAgICAgICAgIHRhcmdldENvcm5lciA9IGNvcm5lclBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZihzaWRlcy5sZW5ndGggIT09IDQpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdzaWRlcycsIHNpZGVzKTtcclxuICAgICAgICAgICAgdGhyb3cgJ2ZhaWxlZCB0byBnZXQgc2lkZXMnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc2lkZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVPdXRsaW5lKCkge1xyXG4gICAgICAgIGxldCBib3VuZHMgPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzO1xyXG4gICAgICAgIHRoaXMub3V0bGluZSA9IG5ldyBwYXBlci5QYXRoKFtcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoYm91bmRzLnRvcExlZnQpLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChib3VuZHMudG9wUmlnaHQpLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChib3VuZHMuYm90dG9tUmlnaHQpLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChib3VuZHMuYm90dG9tTGVmdClcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgdGhpcy5vdXRsaW5lLmNsb3NlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lLmZpbGxDb2xvciA9IG5ldyBwYXBlci5Db2xvcih3aW5kb3cuYXBwLmNhbnZhc0NvbG9yKTsvLy5hZGQoMC4wNCk7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lLnN0cm9rZUNvbG9yID0gJ2xpZ2h0Z3JheSc7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lLmRhc2hBcnJheSA9IFs1LCA1XTtcclxuXHJcbiAgICAgICAgLy8gdHJhY2sgY29ybmVycyBzbyB3ZSBrbm93IGhvdyB0byBhcnJhbmdlIHRoZSB0ZXh0XHJcbiAgICAgICAgdGhpcy5jb3JuZXJzID0gdGhpcy5vdXRsaW5lLnNlZ21lbnRzLm1hcChzID0+IHMpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMub3V0bGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTZWdtZW50TWFya2VycygpIHtcclxuICAgICAgICBsZXQgYm91bmRzID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcztcclxuICAgICAgICBmb3IgKGxldCBzZWdtZW50IG9mIHRoaXMub3V0bGluZS5zZWdtZW50cykge1xyXG4gICAgICAgICAgICBsZXQgaGFuZGxlID0gbmV3IFNlZ21lbnRIYW5kbGUoc2VnbWVudCk7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbkNoYW5nZUNvbXBsZXRlID0gKCkgPT4gdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChoYW5kbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZU1pZHBpb250TWFya2VycygpIHtcclxuICAgICAgICBpZih0aGlzLm1pZHBvaW50R3JvdXApe1xyXG4gICAgICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWlkcG9pbnRHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIHRoaXMub3V0bGluZS5jdXJ2ZXMuZm9yRWFjaChjdXJ2ZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGUgPSBuZXcgQ3VydmVTcGxpdHRlckhhbmRsZShjdXJ2ZSk7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbkRyYWdFbmQgPSAobmV3U2VnbWVudCwgZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdIYW5kbGUgPSBuZXcgU2VnbWVudEhhbmRsZShuZXdTZWdtZW50KTtcclxuICAgICAgICAgICAgICAgIG5ld0hhbmRsZS5vbkNoYW5nZUNvbXBsZXRlID0gKCkgPT4gdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQobmV3SGFuZGxlKTtcclxuICAgICAgICAgICAgICAgIGhhbmRsZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMubWlkcG9pbnRHcm91cC5hZGRDaGlsZChoYW5kbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5taWRwb2ludEdyb3VwKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgU3RyZXRjaHlUZXh0IGV4dGVuZHMgU3RyZXRjaHlQYXRoIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcsIGZvbnQ6IG9wZW50eXBlLkZvbnQsIGZvbnRTaXplOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgb3BlblR5cGVQYXRoID0gZm9udC5nZXRQYXRoKHRleHQsIDAsIDAsIGZvbnRTaXplKTtcclxuICAgICAgICBsZXQgdGV4dFBhdGggPSBQYXBlckhlbHBlcnMuaW1wb3J0T3BlblR5cGVQYXRoKG9wZW5UeXBlUGF0aCk7XHJcblxyXG4gICAgICAgIHRleHRQYXRoLmZpbGxDb2xvciA9ICdyZWQnO1xyXG5cclxuICAgICAgICBzdXBlcih0ZXh0UGF0aCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludCh0aGlzLnN0cm9rZUJvdW5kcy53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJva2VCb3VuZHMuaGVpZ2h0IC8gMik7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFRleHRSdWxlciB7XHJcbiAgICBcclxuICAgIGZvbnRGYW1pbHk6IHN0cmluZztcclxuICAgIGZvbnRXZWlnaHQ6IG51bWJlcjtcclxuICAgIGZvbnRTaXplOiBudW1iZXI7XHJcbiAgICBcclxuICAgIHByaXZhdGUgY3JlYXRlUG9pbnRUZXh0ICh0ZXh0KTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgdmFyIHBvaW50VGV4dCA9IG5ldyBwYXBlci5Qb2ludFRleHQoKTtcclxuICAgICAgICBwb2ludFRleHQuY29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgcG9pbnRUZXh0Lmp1c3RpZmljYXRpb24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgIGlmKHRoaXMuZm9udEZhbWlseSl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250RmFtaWx5ID0gdGhpcy5mb250RmFtaWx5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmZvbnRXZWlnaHQpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udFdlaWdodCA9IHRoaXMuZm9udFdlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5mb250U2l6ZSl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250U2l6ZSA9IHRoaXMuZm9udFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBwb2ludFRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGV4dE9mZnNldHModGV4dCl7XHJcbiAgICAgICAgLy8gTWVhc3VyZSBnbHlwaHMgaW4gcGFpcnMgdG8gY2FwdHVyZSB3aGl0ZSBzcGFjZS5cclxuICAgICAgICAvLyBQYWlycyBhcmUgY2hhcmFjdGVycyBpIGFuZCBpKzEuXHJcbiAgICAgICAgdmFyIGdseXBoUGFpcnMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZ2x5cGhQYWlyc1tpXSA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGksIGkrMSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBGb3IgZWFjaCBjaGFyYWN0ZXIsIGZpbmQgY2VudGVyIG9mZnNldC5cclxuICAgICAgICB2YXIgeE9mZnNldHMgPSBbMF07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBNZWFzdXJlIHRocmVlIGNoYXJhY3RlcnMgYXQgYSB0aW1lIHRvIGdldCB0aGUgYXBwcm9wcmlhdGUgXHJcbiAgICAgICAgICAgIC8vICAgc3BhY2UgYmVmb3JlIGFuZCBhZnRlciB0aGUgZ2x5cGguXHJcbiAgICAgICAgICAgIHZhciB0cmlhZFRleHQgPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpIC0gMSwgaSArIDEpKTtcclxuICAgICAgICAgICAgdHJpYWRUZXh0LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gU3VidHJhY3Qgb3V0IGhhbGYgb2YgcHJpb3IgZ2x5cGggcGFpciBcclxuICAgICAgICAgICAgLy8gICBhbmQgaGFsZiBvZiBjdXJyZW50IGdseXBoIHBhaXIuXHJcbiAgICAgICAgICAgIC8vIE11c3QgYmUgcmlnaHQsIGJlY2F1c2UgaXQgd29ya3MuXHJcbiAgICAgICAgICAgIGxldCBvZmZzZXRXaWR0aCA9IHRyaWFkVGV4dC5ib3VuZHMud2lkdGggXHJcbiAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaSAtIDFdLmJvdW5kcy53aWR0aCAvIDIgXHJcbiAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaV0uYm91bmRzLndpZHRoIC8gMjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEFkZCBvZmZzZXQgd2lkdGggdG8gcHJpb3Igb2Zmc2V0LiBcclxuICAgICAgICAgICAgeE9mZnNldHNbaV0gPSB4T2Zmc2V0c1tpIC0gMV0gKyBvZmZzZXRXaWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBnbHlwaFBhaXIgb2YgZ2x5cGhQYWlycyl7XHJcbiAgICAgICAgICAgIGdseXBoUGFpci5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHhPZmZzZXRzO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBWZXJ0aWNhbEJvdW5kc1RleHRMYXlvdXQge1xyXG4gICAgdG9wOiBwYXBlci5QYXRoO1xyXG4gICAgYm90dG9tOiBwYXBlci5QYXRoO1xyXG5cclxuICAgIGxldHRlclJlc29sdXRpb24gPSAxMDA7XHJcbiAgICBzbW9vdGhUb2xlcmFuY2UgPSAwLjI1O1xyXG4gICAgZm9udFNpemUgPSA2NDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0b3A6IHBhcGVyLlBhdGgsIGJvdHRvbTogcGFwZXIuUGF0aCkge1xyXG4gICAgICAgIHRoaXMudG9wID0gdG9wO1xyXG4gICAgICAgIHRoaXMuYm90dG9tID0gYm90dG9tO1xyXG4gICAgfVxyXG5cclxuICAgIGxheW91dCh0ZXh0OiBzdHJpbmcsIGZvbnQ6IG9wZW50eXBlLkZvbnQsIG9uQ29tcGxldGU/OiAoaXRlbTogcGFwZXIuSXRlbSkgPT4gdm9pZCkge1xyXG4gICAgICAgIGxldCBsZXR0ZXJHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIGxldCBsZXR0ZXJQYXRocyA9IGZvbnQuZ2V0UGF0aHModGV4dCwgMCwgMCwgdGhpcy5mb250U2l6ZSlcclxuICAgICAgICAgICAgLm1hcChwID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXRoID0gUGFwZXJIZWxwZXJzLmltcG9ydE9wZW5UeXBlUGF0aChwKTtcclxuICAgICAgICAgICAgICAgIGxldHRlckdyb3VwLmFkZENoaWxkKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgb3J0aE9yaWdpbiA9IGxldHRlckdyb3VwLmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgIGxldCBvcnRoV2lkdGggPSBsZXR0ZXJHcm91cC5ib3VuZHMud2lkdGg7XHJcbiAgICAgICAgbGV0IG9ydGhIZWlnaHQgPSBsZXR0ZXJHcm91cC5ib3VuZHMuaGVpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgcHJvamVjdGlvbiA9IFBhcGVySGVscGVycy5zYW5kd2ljaFBhdGhQcm9qZWN0aW9uKHRoaXMudG9wLCB0aGlzLmJvdHRvbSk7XHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlbGF0aXZlID0gcG9pbnQuc3VidHJhY3Qob3J0aE9yaWdpbik7XHJcbiAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpdmUueCAvIG9ydGhXaWR0aCxcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnkgLyBvcnRoSGVpZ2h0KTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0ZWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBmaW5hbEdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgZm9yIChsZXQgbGV0dGVyUGF0aCBvZiBsZXR0ZXJQYXRocykge1xyXG4gICAgICAgICAgICBsZXQgbGV0dGVyT3V0bGluZSA9IFBhcGVySGVscGVycy50cmFjZVBhdGhJdGVtKFxyXG4gICAgICAgICAgICAgICAgbGV0dGVyUGF0aCwgdGhpcy5sZXR0ZXJSZXNvbHV0aW9uKTtcclxuICAgICAgICAgICAgbGV0dGVyUGF0aC5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoSXRlbShsZXR0ZXJPdXRsaW5lKTtcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNpbXBsaWZ5KGxldHRlck91dGxpbmUsIHRoaXMuc21vb3RoVG9sZXJhbmNlKTtcclxuICAgICAgICAgICAgZmluYWxHcm91cC5hZGRDaGlsZChsZXR0ZXJPdXRsaW5lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0dGVyR3JvdXAucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGlmIChvbkNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIG9uQ29tcGxldGUoZmluYWxHcm91cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19