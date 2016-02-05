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
var Elements = (function () {
    function Elements() {
    }
    Elements.dragMarker = function (center, dragItem, dragBehavior) {
        var marker = paper.Shape.Circle({
            center: center,
            radius: 5,
            strokeWidth: 2,
            strokeColor: 'blue',
            fillColor: 'white',
            opacity: 0.3
        });
        var dragItems = [marker];
        if (dragItem) {
            dragItems.push(dragItem);
        }
        var handle = new PointHandle(dragItems);
        marker.data = handle;
        marker.dragBehavior = {
            onDrag: function (event) {
                handle.set(handle.get().add(event.delta));
                if (dragBehavior && dragBehavior.onDrag) {
                    dragBehavior.onDrag(event);
                }
            },
            onDragStart: dragBehavior && dragBehavior.onDragStart || undefined,
            onDragEnd: dragBehavior && dragBehavior.onDragEnd || undefined
        };
        return marker;
    };
    Elements.dragHandleStyle = {
        radius: 5,
        strokeWidth: 2,
        strokeColor: 'blue',
        fillColor: 'white',
        opacity: 0.5
    };
    return Elements;
})();
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var MovableLine = (function (_super) {
    __extends(MovableLine, _super);
    function MovableLine(a, b) {
        var _this = this;
        this.path = paper.Path.Line(a, b);
        var startMarker = paper.Shape.Circle(a, 5);
        startMarker.fillColor = 'blue';
        this.addChild(startMarker);
        this.startHandle = new PointHandle([this.path.segments[0], startMarker]);
        startMarker.data = {
            onDrag: function (event) {
                return _this.startHandle.set(_this.startHandle.get().add(event.delta));
            },
            onDragEnd: function (event) {
                _this.onMoveComplete && _this.onMoveComplete(_this.path.segments[0]);
            }
        };
        var endMarker = paper.Shape.Circle(b, 5);
        endMarker.fillColor = 'blue';
        this.addChild(endMarker);
        this.endHandle = new PointHandle([this.path.segments[1], endMarker]);
        endMarker.data = {
            onDrag: function (event) {
                return _this.endHandle.set(_this.endHandle.get().add(event.delta));
            },
            onDragEnd: function (event) {
                _this.onMoveComplete && _this.onMoveComplete(_this.path.segments[1]);
            }
        };
        _super.call(this, [
            this.path, startMarker, endMarker
        ]);
    }
    return MovableLine;
})(paper.Group);
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
var PointHandle = (function () {
    function PointHandle(entities) {
        this.refs = [];
        for (var _i = 0; _i < entities.length; _i++) {
            var e = entities[_i];
            if (e instanceof paper.Segment) {
                this.addRef(PointRef.SegmentPoint(e));
            }
            else if (e instanceof paper.Item) {
                this.addRef(PointRef.ItemPosition(e));
            }
            else {
                throw 'cannot create handle for ' + e;
            }
        }
        this._position = this.refs.length
            ? this.refs[0].get()
            : new paper.Point(0, 0);
    }
    PointHandle.prototype.get = function () {
        return this._position;
    };
    PointHandle.prototype.addRef = function (ref) {
        this.refs.push(ref);
    };
    PointHandle.prototype.set = function (point) {
        this._position.set(point.x, point.y);
        for (var _i = 0, _a = this.refs; _i < _a.length; _i++) {
            var r = _a[_i];
            r.set(point);
        }
    };
    return PointHandle;
})();
var PointRef = (function () {
    function PointRef(getter, setter) {
        this.getter = getter;
        this.setter = setter;
    }
    PointRef.prototype.set = function (point) {
        this.setter(point);
    };
    PointRef.prototype.get = function () {
        return this.getter();
    };
    PointRef.ItemPosition = function (item) {
        return new PointRef(function () { return item.position; }, function (p) { return item.position = p; });
    };
    PointRef.SegmentPoint = function (segment) {
        return new PointRef(function () { return segment.point; }, function (p) { return segment.point = p; });
    };
    return PointRef;
})();
var SegmentHandle = (function (_super) {
    __extends(SegmentHandle, _super);
    function SegmentHandle() {
        _super.call(this);
        this.defaultRadius = 4;
        this.type = 'circle';
        this.radius = this.defaultRadius;
        this.size = new paper.Size(this.defaultRadius * 2);
        this.strokeWidth = 2;
        this.strokeColor = 'blue';
        this.fillColor = 'white';
        this.opacity = 0.3;
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
        this.createRegion();
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
        var sides = this.getRegionSides();
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
    StretchyPath.prototype.getRegionSides = function () {
        var sides = [];
        var segmentGroup = [];
        var cornerPoints = this.corners.map(function (c) { return c.point; });
        var first = cornerPoints.shift();
        cornerPoints.push(first);
        var targetCorner = cornerPoints.shift();
        var segmentList = this.region.segments.map(function (x) { return x; });
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
    StretchyPath.prototype.createRegion = function () {
        var bounds = this.sourcePath.bounds;
        this.region = new paper.Path([
            new paper.Segment(bounds.topLeft),
            new paper.Segment(bounds.topRight),
            new paper.Segment(bounds.bottomRight),
            new paper.Segment(bounds.bottomLeft)
        ]);
        this.region.closed = true;
        this.region.fillColor = new paper.Color(window.app.canvasColor); //.add(0.04);
        this.region.strokeColor = 'lightgray';
        this.region.dashArray = [5, 5];
        this.corners = this.region.segments.map(function (s) { return s; });
        this.addChild(this.region);
    };
    StretchyPath.prototype.createSegmentMarkers = function () {
        var _this = this;
        var bounds = this.sourcePath.bounds;
        for (var _i = 0, _a = this.region.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            var marker = this.segmentDragHandle(segment, { onDragEnd: function () { return _this.arrangeContents(); } });
            this.addChild(marker);
        }
    };
    StretchyPath.prototype.updateMidpiontMarkers = function () {
        var _this = this;
        if (this.midpointGroup) {
            this.midpointGroup.remove();
        }
        this.midpointGroup = new paper.Group();
        for (var _i = 0, _a = this.region.curves; _i < _a.length; _i++) {
            var curve = _a[_i];
            var marker = this.curveMidpointDragHandle(curve, { onDragEnd: function () { return _this.arrangeContents(); } });
            this.midpointGroup.addChild(marker);
        }
        this.addChild(this.midpointGroup);
    };
    StretchyPath.prototype.segmentDragHandle = function (segment, dragBehavior) {
        var marker = paper.Shape.Circle(Elements.dragHandleStyle);
        marker.position = segment.point;
        marker.dragBehavior = {
            onDrag: function (event) {
                var newPos = marker.position.add(event.delta);
                marker.position = newPos;
                segment.point = newPos;
                if (dragBehavior && dragBehavior.onDrag) {
                    dragBehavior.onDrag(event);
                }
            },
            onDragStart: dragBehavior && dragBehavior.onDragStart || undefined,
            onDragEnd: dragBehavior && dragBehavior.onDragEnd || undefined
        };
        return marker;
    };
    StretchyPath.prototype.curveMidpointDragHandle = function (curve, dragBehavior) {
        var _this = this;
        var marker = paper.Shape.Circle(Elements.dragHandleStyle);
        marker.opacity = marker.opacity * 0.3;
        marker.position = curve.getPointAt(0.5 * curve.length);
        var newSegment;
        marker.dragBehavior = {
            onDragStart: function (event) {
                newSegment = new paper.Segment(marker.position);
                console.log(newSegment);
                curve.path.insert(curve.index + 1, newSegment);
                newSegment.smooth();
                if (dragBehavior && dragBehavior.onDragStart) {
                    dragBehavior.onDragStart(event);
                }
            },
            onDrag: function (event) {
                var newPos = marker.position.add(event.delta);
                marker.position = newPos;
                newSegment.point = newPos;
                if (dragBehavior && dragBehavior.onDrag) {
                    dragBehavior.onDrag(event);
                }
            },
            onDragEnd: function (event) {
                var newMarker = _this.segmentDragHandle(newSegment, dragBehavior);
                // This like breaks the isolation
                _this.addChild(newMarker);
                marker.remove();
                if (dragBehavior && dragBehavior.onDragEnd) {
                    dragBehavior.onDragEnd(event);
                }
            },
        };
        return marker;
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
//# sourceMappingURL=app.js.map