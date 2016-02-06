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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyIsIi4uLy4uL3NyYy9hcHAvQXBwQ29udHJvbGxlci50cyIsIi4uLy4uL3NyYy9hcHAvRm9udExvYWRlci50cyIsIi4uLy4uL3NyYy9hcHAvSGVscGVycy50cyIsIi4uLy4uL3NyYy9hcHAvVGV4dFRyYWNlQ29udHJvbGxlci50cyIsIi4uLy4uL3NyYy9hcHAvVGV4dFdhcnBDb250cm9sbGVyLnRzIiwiLi4vLi4vc3JjL21hdGgvUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHMiLCIuLi8uLi9zcmMvcGFwZXIvQm90dG9tVGV4dExheW91dC50cyIsIi4uLy4uL3NyYy9wYXBlci9DdXJ2ZVNwbGl0dGVySGFuZGxlLnRzIiwiLi4vLi4vc3JjL3BhcGVyL0xpbmVEcmF3VG9vbC50cyIsIi4uLy4uL3NyYy9wYXBlci9MaW5rZWRQYXRoR3JvdXAudHMiLCIuLi8uLi9zcmMvcGFwZXIvTW91c2VCZWhhdmlvclRvb2wudHMiLCIuLi8uLi9zcmMvcGFwZXIvUGFwZXJIZWxwZXJzLnRzIiwiLi4vLi4vc3JjL3BhcGVyL1BhdGhTZWN0aW9uLnRzIiwiLi4vLi4vc3JjL3BhcGVyL1BhdGhUZXh0LnRzIiwiLi4vLi4vc3JjL3BhcGVyL1BhdGhUcmFuc2Zvcm0udHMiLCIuLi8uLi9zcmMvcGFwZXIvU2VnbWVudEhhbmRsZS50cyIsIi4uLy4uL3NyYy9wYXBlci9TdHJldGNoeVBhdGgudHMiLCIuLi8uLi9zcmMvcGFwZXIvU3RyZXRjaHlUZXh0LnRzIiwiLi4vLi4vc3JjL3BhcGVyL1RleHRSdWxlci50cyIsIi4uLy4uL3NyYy9wYXBlci9WZXJ0aWNhbEJvdW5kc1RleHRMYXlvdXQudHMiXSwibmFtZXMiOlsiQXBwQ29udHJvbGxlciIsIkFwcENvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHBDb250cm9sbGVyLmFkZFRleHQiLCJGb250TG9hZGVyIiwiRm9udExvYWRlci5jb25zdHJ1Y3RvciIsIm5ld2lkIiwic3RhcnRQYXRoIiwiYXBwZW5kUGF0aCIsImZpbmlzaFBhdGgiLCJUZXh0V2FycENvbnRyb2xsZXIiLCJUZXh0V2FycENvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJUZXh0V2FycENvbnRyb2xsZXIudXBkYXRlIiwiVGV4dFdhcnBDb250cm9sbGVyLmZpZGRsZXN0aWNrcyIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtIiwiUGVyc3BlY3RpdmVUcmFuc2Zvcm0uY29uc3RydWN0b3IiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludCIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtLmNyZWF0ZU1hdHJpeCIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtLm11bHRpcGx5IiwiUXVhZCIsIlF1YWQuY29uc3RydWN0b3IiLCJRdWFkLmZyb21SZWN0YW5nbGUiLCJRdWFkLmZyb21Db29yZHMiLCJRdWFkLmFzQ29vcmRzIiwiQm90dG9tVGV4dExheW91dCIsIkJvdHRvbVRleHRMYXlvdXQuY29uc3RydWN0b3IiLCJCb3R0b21UZXh0TGF5b3V0LmxheW91dCIsIlBhdGhPZmZzZXRTY2FsaW5nIiwiUGF0aE9mZnNldFNjYWxpbmcuY29uc3RydWN0b3IiLCJQYXRoT2Zmc2V0U2NhbGluZy5nZXRUb1BvaW50QXQiLCJDdXJ2ZVNwbGl0dGVySGFuZGxlIiwiQ3VydmVTcGxpdHRlckhhbmRsZS5jb25zdHJ1Y3RvciIsIkxpbmVEcmF3VG9vbCIsIkxpbmVEcmF3VG9vbC5jb25zdHJ1Y3RvciIsIkxpbmVEcmF3VG9vbC5zdGFydFBhdGgiLCJMaW5lRHJhd1Rvb2wuYXBwZW5kUGF0aCIsIkxpbmVEcmF3VG9vbC5maW5pc2hQYXRoIiwiTGlua2VkUGF0aEdyb3VwIiwiTGlua2VkUGF0aEdyb3VwLmNvbnN0cnVjdG9yIiwiTGlua2VkUGF0aEdyb3VwLmFkZENoaWxkIiwiTGlua2VkUGF0aEdyb3VwLmxlbmd0aCIsIkxpbmtlZFBhdGhHcm91cC5wYXRocyIsIkxpbmtlZFBhdGhHcm91cC5nZXRMb2NhdGlvbkF0IiwiTGlua2VkUGF0aEdyb3VwLmdldFBvaW50QXQiLCJMaW5rZWRQYXRoR3JvdXAuZ2V0VGFuZ2VudEF0IiwiTGlua2VkUGF0aEdyb3VwLmdldE5lYXJlc3RQb2ludCIsIk1vdXNlQmVoYXZpb3JUb29sIiwiTW91c2VCZWhhdmlvclRvb2wuY29uc3RydWN0b3IiLCJNb3VzZUJlaGF2aW9yVG9vbC5pc1NhbWVPckFuY2VzdG9yIiwiTW91c2VCZWhhdmlvclRvb2wuZmluZERyYWdIYW5kbGVyIiwiTW91c2VCZWhhdmlvclRvb2wuZmluZE92ZXJIYW5kbGVyIiwiUGFwZXJIZWxwZXJzIiwiUGFwZXJIZWxwZXJzLmNvbnN0cnVjdG9yIiwiUGFwZXJIZWxwZXJzLmltcG9ydE9wZW5UeXBlUGF0aCIsIlBhcGVySGVscGVycy50cmFjZVBhdGhJdGVtIiwiUGFwZXJIZWxwZXJzLnRyYWNlQ29tcG91bmRQYXRoIiwiUGFwZXJIZWxwZXJzLnRyYWNlUGF0aCIsIlBhcGVySGVscGVycy5zYW5kd2ljaFBhdGhQcm9qZWN0aW9uIiwiUGFwZXJIZWxwZXJzLnJlc2V0TWFya2VycyIsIlBhcGVySGVscGVycy5tYXJrZXJMaW5lIiwiUGFwZXJIZWxwZXJzLm1hcmtlciIsIlBhcGVySGVscGVycy5zaW1wbGlmeSIsIlBhcGVySGVscGVycy5maW5kU2VsZk9yQW5jZXN0b3IiLCJQYXBlckhlbHBlcnMuZmluZEFuY2VzdG9yIiwiUGFwZXJIZWxwZXJzLmNvcm5lcnMiLCJQYXRoU2VjdGlvbiIsIlBhdGhTZWN0aW9uLmNvbnN0cnVjdG9yIiwiUGF0aFNlY3Rpb24uZ2V0UG9pbnRBdCIsIlBhdGhUZXh0IiwiUGF0aFRleHQuY29uc3RydWN0b3IiLCJQYXRoVGV4dC50ZXh0IiwiUGF0aFRleHQudXBkYXRlIiwiUGF0aFRleHQuY3JlYXRlUG9pbnRUZXh0IiwiUGF0aFRyYW5zZm9ybSIsIlBhdGhUcmFuc2Zvcm0uY29uc3RydWN0b3IiLCJQYXRoVHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50IiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoSXRlbSIsIlBhdGhUcmFuc2Zvcm0udHJhbnNmb3JtQ29tcG91bmRQYXRoIiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoIiwiU2VnbWVudEhhbmRsZSIsIlNlZ21lbnRIYW5kbGUuY29uc3RydWN0b3IiLCJTZWdtZW50SGFuZGxlLnNtb290aGVkIiwiU3RyZXRjaHlQYXRoIiwiU3RyZXRjaHlQYXRoLmNvbnN0cnVjdG9yIiwiU3RyZXRjaHlQYXRoLnNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkiLCJTdHJldGNoeVBhdGguYXJyYW5nZUNvbnRlbnRzIiwiU3RyZXRjaHlQYXRoLmFycmFuZ2VQYXRoIiwiU3RyZXRjaHlQYXRoLmdldE91dGxpbmVTaWRlcyIsIlN0cmV0Y2h5UGF0aC5jcmVhdGVPdXRsaW5lIiwiU3RyZXRjaHlQYXRoLmNyZWF0ZVNlZ21lbnRNYXJrZXJzIiwiU3RyZXRjaHlQYXRoLnVwZGF0ZU1pZHBpb250TWFya2VycyIsIlN0cmV0Y2h5VGV4dCIsIlN0cmV0Y2h5VGV4dC5jb25zdHJ1Y3RvciIsIlRleHRSdWxlciIsIlRleHRSdWxlci5jb25zdHJ1Y3RvciIsIlRleHRSdWxlci5jcmVhdGVQb2ludFRleHQiLCJUZXh0UnVsZXIuZ2V0VGV4dE9mZnNldHMiLCJWZXJ0aWNhbEJvdW5kc1RleHRMYXlvdXQiLCJWZXJ0aWNhbEJvdW5kc1RleHRMYXlvdXQuY29uc3RydWN0b3IiLCJWZXJ0aWNhbEJvdW5kc1RleHRMYXlvdXQubGF5b3V0Il0sIm1hcHBpbmdzIjoiQUFLQSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBRWQsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO0FBRXJDLENBQUMsQ0FBQyxDQUFDO0FDUkgsSUFBTSxTQUFTLEdBQUcsd0ZBQXdGLENBQUM7QUFDM0csSUFBTSxTQUFTLEdBQUcsa0VBQWtFLENBQUM7QUFDckYsSUFBTSxTQUFTLEdBQUcsc0JBQXNCLENBQUM7QUFFekM7SUFRSUE7UUFSSkMsaUJBb0NDQTtRQWhD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QUNBO1FBQzlCQSxJQUFJQSxZQUFZQSxHQUFHQTtZQUNmQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUU5QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsWUFBWUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDbEVBLElBQUlBLENBQUNBLEdBQUdBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzdDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDL0VBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBQzFCQSxNQUFNQSxDQUFDQTtZQUNIQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEJBLENBQUNBLEVBQUtBLENBQUNBLEVBQUVBLENBQUNBLEVBQUtBLENBQUNBO1lBQ25CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFLQSxDQUFDQTtTQUN0QkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBU0EsQ0FBQ0E7WUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzNDLENBQUMsQ0FBQ0EsQ0FBQ0E7SUFDUEEsQ0FBQ0E7SUFFREgsMkVBQTJFQTtJQUMzRUEscUNBQXFDQTtJQUNyQ0EscUNBQXFDQTtJQUNyQ0EscUNBQXFDQTtJQUNyQ0EscUNBQXFDQTtJQUM5QkEsNkJBQVFBLEdBQWZBLFVBQWdCQSxNQUFNQSxFQUFFQSxNQUFNQTtRQUMxQkksTUFBTUEsQ0FBQ0E7WUFDSEEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0ZBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUVBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQy9GQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvRkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7U0FDbEdBLENBQUNBO0lBQ05BLENBQUNBO0lBQ0xKLDJCQUFDQTtBQUFEQSxDQUFDQSxBQWxFRCxJQWtFQztBQUVEO0lBTUlLLGNBQVlBLENBQWNBLEVBQUVBLENBQWNBLEVBQUVBLENBQWNBLEVBQUVBLENBQWNBO1FBQ3RFQyxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNYQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNYQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNYQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtJQUNmQSxDQUFDQTtJQUVNRCxrQkFBYUEsR0FBcEJBLFVBQXFCQSxJQUFxQkE7UUFDdENFLE1BQU1BLENBQUNBLElBQUlBLElBQUlBLENBQ1hBLElBQUlBLENBQUNBLE9BQU9BLEVBQ1pBLElBQUlBLENBQUNBLFFBQVFBLEVBQ2JBLElBQUlBLENBQUNBLFVBQVVBLEVBQ2ZBLElBQUlBLENBQUNBLFdBQVdBLENBQ25CQSxDQUFDQTtJQUNOQSxDQUFDQTtJQUVNRixlQUFVQSxHQUFqQkEsVUFBa0JBLE1BQWdCQTtRQUM5QkcsTUFBTUEsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FDWEEsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFDckNBLElBQUlBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQ3JDQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUNyQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FDeENBLENBQUFBO0lBQ0xBLENBQUNBO0lBRURILHVCQUFRQSxHQUFSQTtRQUNJSSxNQUFNQSxDQUFDQTtZQUNIQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNsQkEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbEJBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2xCQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtTQUNyQkEsQ0FBQ0E7SUFDTkEsQ0FBQ0E7SUFDTEosV0FBQ0E7QUFBREEsQ0FBQ0EsQUF2Q0QsSUF1Q0M7QUM3R0Q7SUFLSUssMEJBQVlBLE1BQWtCQTtRQUY5QkMsYUFBUUEsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFHWEEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0Es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LE9BQU9BLEdBQUdBLElBQUlBLENBQUNBO1FBQ3pCQSxTQUFTQSxDQUFDQSxhQUFhQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUNuQ0EsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFFdkJBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1lBQ1JBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLFVBQVVBLENBQUNBO2dCQUFDQSxTQUFTQSxDQUFDQSxVQUFVQSxHQUFHQSxLQUFLQSxDQUFDQSxVQUFVQSxDQUFDQTtZQUM5REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0E7Z0JBQUNBLFNBQVNBLENBQUNBLFFBQVFBLEdBQUdBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBO1lBQ3hEQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxVQUFVQSxDQUFDQTtnQkFBQ0EsU0FBU0EsQ0FBQ0EsVUFBVUEsR0FBR0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDbEVBLENBQUNBO1FBRURBLElBQUlBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQ2xEQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxXQUFXQSxDQUFDQTtRQUU3QkEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDOUJBLEtBQUtBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3BCQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUUxQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDckJBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBQ2pCQSxDQUFDQTtJQUVMSixlQUFDQTtBQUFEQSxDQUFDQSxBQTNHRCxFQUF1QixLQUFLLENBQUMsS0FBSyxFQTJHakM7QUM1R0Q7SUFHSUssdUJBQVlBLGNBQW1EQTtRQUMzREMsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsY0FBY0EsQ0FBQ0E7SUFDekNBLENBQUNBO0lBRURELHNDQUFjQSxHQUFkQSxVQUFlQSxLQUFrQkE7UUFDN0JFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0lBQ3RDQSxDQUFDQTtJQUVERix5Q0FBaUJBLEdBQWpCQSxVQUFrQkEsSUFBb0JBO1FBQ2xDRyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxLQUFLQSxjQUFjQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNwQ0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFxQkEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDekRBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ0pBLElBQUlBLENBQUNBLGFBQWFBLENBQWFBLElBQUlBLENBQUNBLENBQUNBO1FBQ3pDQSxDQUFDQTtJQUNMQSxDQUFDQTtJQUVESCw2Q0FBcUJBLEdBQXJCQSxVQUFzQkEsSUFBd0JBO1FBQzFDSSxHQUFHQSxDQUFDQSxDQUFVQSxVQUFhQSxFQUFiQSxLQUFBQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUF0QkEsY0FBS0EsRUFBTEEsSUFBc0JBLENBQUNBO1lBQXZCQSxJQUFJQSxDQUFDQSxTQUFBQTtZQUNOQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFhQSxDQUFDQSxDQUFDQSxDQUFDQTtTQUNyQ0E7SUFDTEEsQ0FBQ0E7SUFFREoscUNBQWFBLEdBQWJBLFVBQWNBLElBQWdCQTtRQUMxQkssR0FBR0EsQ0FBQ0EsQ0FBZ0JBLFVBQWFBLEVBQWJBLEtBQUFBLElBQUlBLENBQUNBLFFBQVFBLEVBQTVCQSxjQUFXQSxFQUFYQSxJQUE0QkEsQ0FBQ0E7WUFBN0JBLElBQUlBLE9BQU9BLFNBQUFBO1lBQ1pBLElBQUlBLFNBQVNBLEdBQUdBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBO1lBQzlCQSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUNsREEsU0FBU0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDekJBLFNBQVNBLENBQUNBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO1NBQzVCQTtJQUNMQSxDQUFDQTtJQUNMTCxvQkFBQ0E7QUFBREEsQ0FBQ0EsQUFqQ0QsSUFpQ0M7QUNqQ0Q7SUFBNEJNLGlDQUFXQTtJQU9uQ0EsdUJBQVlBLE9BQXNCQSxFQUFFQSxNQUFlQTtRQVB2REMsaUJBNkRDQTtRQXJET0EsaUJBQU9BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBO1FBRXZCQSxJQUFJQSxJQUFJQSxHQUFRQSxJQUFJQSxDQUFDQTtRQUNyQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDdEJBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLENBQUNBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM5Q0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFFOUJBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3JCQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxNQUFNQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsT0FBT0EsQ0FBQ0E7UUFDekJBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEdBQUdBLENBQUNBO1FBRW5CQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFrQkE7WUFDaENBLFVBQVVBLEVBQUVBLFVBQUFBLEtBQUtBO2dCQUNiQSxJQUFJQSxNQUFNQSxHQUFHQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDNUNBLEtBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLENBQUNBO2dCQUN2QkEsT0FBT0EsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0E7WUFDM0JBLENBQUNBO1lBQ0RBLFNBQVNBLEVBQUVBLFVBQUFBLEtBQUtBO2dCQUNaQSxFQUFFQSxDQUFBQSxDQUFDQSxLQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFBQSxDQUFDQTtvQkFDZkEsS0FBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7Z0JBQzFCQSxDQUFDQTtnQkFDREEsRUFBRUEsQ0FBQUEsQ0FBQ0EsS0FBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxDQUFBQSxDQUFDQTtvQkFDdEJBLEtBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pDQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNEQSxPQUFPQSxFQUFFQSxVQUFBQSxLQUFLQTtnQkFDVkEsS0FBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsQ0FBQ0EsS0FBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7Z0JBQy9CQSxFQUFFQSxDQUFBQSxDQUFDQSxLQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUFBLENBQUNBO29CQUN0QkEsS0FBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDakNBLENBQUNBO1lBQ0xBLENBQUNBO1NBQ0pBLENBQUFBO0lBQ0xBLENBQUNBO0lBRURELHNCQUFJQSxtQ0FBUUE7YUFBWkE7WUFDSUUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDMUJBLENBQUNBO2FBRURGLFVBQWFBLEtBQWNBO1lBQ3ZCRSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUV2QkEsRUFBRUEsQ0FBQUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO2dCQUN6QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7WUFDMUJBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNKQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDN0JBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO1lBQ2xDQSxDQUFDQTtRQUNMQSxDQUFDQTs7O09BWkFGO0lBYUxBLG9CQUFDQTtBQUFEQSxDQUFDQSxBQTdERCxFQUE0QixLQUFLLENBQUMsS0FBSyxFQTZEdEM7QUM3REQ7SUFBMkJHLGdDQUFXQTtJQWFsQ0Esc0JBQVlBLFVBQThCQTtRQWI5Q0MsaUJBNEtDQTtRQTlKT0EsaUJBQU9BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLFVBQVVBLENBQUNBO1FBQzdCQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxPQUFPQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUVoQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7UUFDckJBLElBQUlBLENBQUNBLG9CQUFvQkEsRUFBRUEsQ0FBQ0E7UUFDNUJBLElBQUlBLENBQUNBLHFCQUFxQkEsRUFBRUEsQ0FBQ0E7UUFFN0JBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBO1lBQ2pCQSxVQUFVQSxFQUFFQSxVQUFBQSxLQUFLQSxJQUFJQSxPQUFBQSxLQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUE5Q0EsQ0FBOENBO1lBQ25FQSxXQUFXQSxFQUFFQSxjQUFNQSxPQUFBQSxLQUFJQSxDQUFDQSx5QkFBeUJBLENBQUNBLElBQUlBLENBQUNBLEVBQXBDQSxDQUFvQ0E7WUFDdkRBLFNBQVNBLEVBQUVBLGNBQU1BLE9BQUFBLEtBQUlBLENBQUNBLHlCQUF5QkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBckNBLENBQXFDQTtTQUN6REEsQ0FBQ0E7UUFFRkEsSUFBSUEsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7UUFFdkJBLElBQUlBLENBQUNBLHlCQUF5QkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7SUFDMUNBLENBQUNBO0lBRURELGdEQUF5QkEsR0FBekJBLFVBQTBCQSxLQUFjQTtRQUNwQ0UsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsT0FBT0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDbENBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUNBO1FBQ25DQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxHQUFHQSxLQUFLQSxHQUFHQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUMxREEsQ0FBQ0E7SUFFREYsc0NBQWVBLEdBQWZBO1FBQ0lHLElBQUlBLENBQUNBLHFCQUFxQkEsRUFBRUEsQ0FBQ0E7UUFDN0JBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO0lBQ3ZCQSxDQUFDQTtJQUVESCxrQ0FBV0EsR0FBWEE7UUFDSUksSUFBSUEsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDaERBLElBQUlBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1FBQzdDQSxJQUFJQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUMvQ0EsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7UUFFbkNBLElBQUlBLEdBQUdBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ25CQSxJQUFJQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUN0QkEsTUFBTUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7UUFDakJBLElBQUlBLFVBQVVBLEdBQUdBLFlBQVlBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsR0FBR0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFFbEVBLDREQUE0REE7UUFFNURBLElBQUlBLFNBQVNBLEdBQUdBLElBQUlBLGFBQWFBLENBQUNBLFVBQUFBLEtBQUtBO1lBQ25DQSxJQUFJQSxRQUFRQSxHQUFHQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtZQUMxQ0EsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FDdEJBLFFBQVFBLENBQUNBLENBQUNBLEdBQUdBLFNBQVNBLEVBQ3RCQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFHQSxVQUFVQSxDQUFDQSxDQUFDQTtZQUM3QkEsSUFBSUEsU0FBU0EsR0FBR0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDakNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBO1FBQ3JCQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUVIQSxHQUFHQSxDQUFBQSxDQUFhQSxVQUFLQSxFQUFqQkEsaUJBQVFBLEVBQVJBLElBQWlCQSxDQUFDQTtZQUFsQkEsSUFBSUEsSUFBSUEsR0FBSUEsS0FBS0EsSUFBVEE7WUFDUkEsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7U0FDakJBO1FBRURBLElBQUlBLE9BQU9BLEdBQXVCQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUMxREEsT0FBT0EsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDdkJBLE9BQU9BLENBQUNBLFNBQVNBLEdBQUdBLFNBQVNBLENBQUNBO1FBRTlCQSxTQUFTQSxDQUFDQSxpQkFBaUJBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBRXJDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFDOUJBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLE9BQU9BLENBQUNBO1FBQzNCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtJQUNqQ0EsQ0FBQ0E7SUFFT0osc0NBQWVBLEdBQXZCQTtRQUNJSyxJQUFJQSxLQUFLQSxHQUFpQkEsRUFBRUEsQ0FBQ0E7UUFDN0JBLElBQUlBLFlBQVlBLEdBQW9CQSxFQUFFQSxDQUFDQTtRQUV2Q0EsSUFBSUEsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBQUEsQ0FBQ0EsSUFBSUEsT0FBQUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsRUFBUEEsQ0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDbERBLElBQUlBLEtBQUtBLEdBQUdBLFlBQVlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1FBQ2pDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUV6QkEsSUFBSUEsWUFBWUEsR0FBR0EsWUFBWUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDeENBLElBQUlBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLFVBQUFBLENBQUNBLElBQUlBLE9BQUFBLENBQUNBLEVBQURBLENBQUNBLENBQUNBLENBQUNBO1FBQ3BEQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNWQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNqQ0EsR0FBR0EsQ0FBQUEsQ0FBZ0JBLFVBQVdBLEVBQTFCQSx1QkFBV0EsRUFBWEEsSUFBMEJBLENBQUNBO1lBQTNCQSxJQUFJQSxPQUFPQSxHQUFJQSxXQUFXQSxJQUFmQTtZQUVYQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtZQUUzQkEsRUFBRUEsQ0FBQUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsRUFBRUEsS0FBS0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzlEQSxjQUFjQTtnQkFDZEEsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pDQSxZQUFZQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtnQkFDekJBLFlBQVlBLEdBQUdBLFlBQVlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1lBQ3hDQSxDQUFDQTtZQUVEQSxDQUFDQSxFQUFFQSxDQUFDQTtTQUNQQTtRQUVEQSxFQUFFQSxDQUFBQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFBQSxDQUFDQTtZQUNuQkEsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLE1BQU1BLHFCQUFxQkEsQ0FBQ0E7UUFDaENBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBQ2pCQSxDQUFDQTtJQUVPTCxvQ0FBYUEsR0FBckJBO1FBQ0lNLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBO1FBQ3BDQSxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUN4QkEsWUFBWUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDbERBLE9BQU9BLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO1FBQzVEQSxPQUFPQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUN0QkEsT0FBT0EsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDM0JBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBO1FBRXZCQSxtREFBbURBO1FBQ25EQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFBQSxDQUFDQSxJQUFJQSxPQUFBQSxDQUFDQSxFQUFEQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUU1Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7SUFDM0JBLENBQUNBO0lBRU9OLDJDQUFvQkEsR0FBNUJBO1FBQUFPLGlCQVNDQTtRQVJHQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNwQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDdENBLEdBQUdBLENBQUNBLENBQWdCQSxVQUFxQkEsRUFBckJBLEtBQUFBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLEVBQXBDQSxjQUFXQSxFQUFYQSxJQUFvQ0EsQ0FBQ0E7WUFBckNBLElBQUlBLE9BQU9BLFNBQUFBO1lBQ1pBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLGFBQWFBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1lBQ3hDQSxNQUFNQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLGNBQU1BLE9BQUFBLEtBQUlBLENBQUNBLGVBQWVBLEVBQUVBLEVBQXRCQSxDQUFzQkEsQ0FBQ0E7WUFDdkRBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1NBQ3RDQTtRQUNEQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtJQUNyQ0EsQ0FBQ0E7SUFFT1AsNENBQXFCQSxHQUE3QkE7UUFBQVEsaUJBMEJDQTtRQXpCR0EsRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7WUFDbkJBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1FBQ2hDQSxDQUFDQTtRQUNEQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUN2Q0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQUEsS0FBS0E7WUFDN0JBLDRCQUE0QkE7WUFDNUJBLEVBQUVBLENBQUFBLENBQ0VBLEtBQUtBLENBQUNBLFFBQVFBLEtBQUtBLEtBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO21CQUMvQkEsS0FBS0EsQ0FBQ0EsUUFBUUEsS0FBS0EsS0FBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FHcENBLENBQUNBLENBQUFBLENBQUNBO2dCQUNFQSxNQUFNQSxDQUFDQTtZQUNYQSxDQUFDQTtZQUNMQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxtQkFBbUJBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQzVDQSxNQUFNQSxDQUFDQSxTQUFTQSxHQUFHQSxVQUFDQSxVQUFVQSxFQUFFQSxLQUFLQTtnQkFDakNBLElBQUlBLFNBQVNBLEdBQUdBLElBQUlBLGFBQWFBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO2dCQUM5Q0EsU0FBU0EsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxjQUFNQSxPQUFBQSxLQUFJQSxDQUFDQSxlQUFlQSxFQUFFQSxFQUF0QkEsQ0FBc0JBLENBQUNBO2dCQUMxREEsS0FBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pCQSxNQUFNQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtnQkFDaEJBLEtBQUlBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1lBQzNCQSxDQUFDQSxDQUFDQTtZQUNGQSxLQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUN4Q0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDSEEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0E7SUFDdENBLENBQUNBO0lBQ0xSLG1CQUFDQTtBQUFEQSxDQUFDQSxBQTVLRCxFQUEyQixLQUFLLENBQUMsS0FBSyxFQTRLckM7QUM1S0Q7SUFBMkJTLGdDQUFZQTtJQUVuQ0Esc0JBQVlBLElBQVlBLEVBQUVBLElBQW1CQSxFQUFFQSxRQUFnQkE7UUFDM0RDLElBQUlBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLFFBQVFBLENBQUNBLENBQUNBO1FBQ3REQSxJQUFJQSxRQUFRQSxHQUFHQSxZQUFZQSxDQUFDQSxrQkFBa0JBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO1FBRTdEQSxRQUFRQSxDQUFDQSxTQUFTQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUUzQkEsa0JBQU1BLFFBQVFBLENBQUNBLENBQUNBO1FBRWhCQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxFQUNuQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDMURBLENBQUNBO0lBQ0xELG1CQUFDQTtBQUFEQSxDQUFDQSxBQWJELEVBQTJCLFlBQVksRUFhdEM7QUNiRDtJQUFBRTtJQXlEQUMsQ0FBQ0E7SUFuRFdELG1DQUFlQSxHQUF2QkEsVUFBeUJBLElBQUlBO1FBQ3pCRSxJQUFJQSxTQUFTQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUN0Q0EsU0FBU0EsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDekJBLFNBQVNBLENBQUNBLGFBQWFBLEdBQUdBLFFBQVFBLENBQUNBO1FBQ25DQSxFQUFFQSxDQUFBQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFBQSxDQUFDQTtZQUNoQkEsU0FBU0EsQ0FBQ0EsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDM0NBLENBQUNBO1FBQ0RBLEVBQUVBLENBQUFBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUFBLENBQUNBO1lBQ2hCQSxTQUFTQSxDQUFDQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUMzQ0EsQ0FBQ0E7UUFDREEsRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7WUFDZEEsU0FBU0EsQ0FBQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFDdkNBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBO0lBQ3JCQSxDQUFDQTtJQUVERixrQ0FBY0EsR0FBZEEsVUFBZUEsSUFBSUE7UUFDZkcsa0RBQWtEQTtRQUNsREEsa0NBQWtDQTtRQUNsQ0EsSUFBSUEsVUFBVUEsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFDcEJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ25DQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNqRUEsQ0FBQ0E7UUFFREEsMENBQTBDQTtRQUMxQ0EsSUFBSUEsUUFBUUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDbkJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBRW5DQSw2REFBNkRBO1lBQzdEQSxzQ0FBc0NBO1lBQ3RDQSxJQUFJQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuRUEsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7WUFFbkJBLHlDQUF5Q0E7WUFDekNBLG9DQUFvQ0E7WUFDcENBLG1DQUFtQ0E7WUFDbkNBLElBQUlBLFdBQVdBLEdBQUdBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBO2tCQUNsQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0E7a0JBQ2xDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUVyQ0EscUNBQXFDQTtZQUNyQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsV0FBV0EsQ0FBQ0E7UUFDaERBLENBQUNBO1FBRURBLEdBQUdBLENBQUFBLENBQWtCQSxVQUFVQSxFQUEzQkEsc0JBQWFBLEVBQWJBLElBQTJCQSxDQUFDQTtZQUE1QkEsSUFBSUEsU0FBU0EsR0FBSUEsVUFBVUEsSUFBZEE7WUFDYkEsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7U0FDdEJBO1FBRURBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBO0lBQ3BCQSxDQUFDQTtJQUNMSCxnQkFBQ0E7QUFBREEsQ0FBQ0EsQUF6REQsSUF5REM7QUN6REQ7SUFRSUksa0NBQVlBLEdBQWVBLEVBQUVBLE1BQWtCQTtRQUovQ0MscUJBQWdCQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUN2QkEsb0JBQWVBLEdBQUdBLElBQUlBLENBQUNBO1FBQ3ZCQSxhQUFRQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUdWQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUNmQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxNQUFNQSxDQUFDQTtJQUN6QkEsQ0FBQ0E7SUFFREQseUNBQU1BLEdBQU5BLFVBQU9BLElBQVlBLEVBQUVBLElBQW1CQSxFQUFFQSxVQUF1Q0E7UUFDN0VFLElBQUlBLFdBQVdBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1FBQ3BDQSxJQUFJQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTthQUNyREEsR0FBR0EsQ0FBQ0EsVUFBQUEsQ0FBQ0E7WUFDRkEsSUFBSUEsSUFBSUEsR0FBR0EsWUFBWUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM5Q0EsV0FBV0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDM0JBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1FBQ2hCQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUVQQSxJQUFJQSxVQUFVQSxHQUFHQSxXQUFXQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUM1Q0EsSUFBSUEsU0FBU0EsR0FBR0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFDekNBLElBQUlBLFVBQVVBLEdBQUdBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO1FBRTNDQSxJQUFJQSxVQUFVQSxHQUFHQSxZQUFZQSxDQUFDQSxzQkFBc0JBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQzVFQSxJQUFJQSxTQUFTQSxHQUFHQSxJQUFJQSxhQUFhQSxDQUFDQSxVQUFBQSxLQUFLQTtZQUNuQ0EsSUFBSUEsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFDMUNBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLEtBQUtBLENBQ3RCQSxRQUFRQSxDQUFDQSxDQUFDQSxHQUFHQSxTQUFTQSxFQUN0QkEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFDN0JBLElBQUlBLFNBQVNBLEdBQUdBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ2pDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUNyQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFSEEsSUFBSUEsVUFBVUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDbkNBLEdBQUdBLENBQUNBLENBQW1CQSxVQUFXQSxFQUE3QkEsdUJBQWNBLEVBQWRBLElBQTZCQSxDQUFDQTtZQUE5QkEsSUFBSUEsVUFBVUEsR0FBSUEsV0FBV0EsSUFBZkE7WUFDZkEsSUFBSUEsYUFBYUEsR0FBR0EsWUFBWUEsQ0FBQ0EsYUFBYUEsQ0FDMUNBLFVBQVVBLEVBQUVBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0E7WUFDdkNBLFVBQVVBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1lBRXBCQSxTQUFTQSxDQUFDQSxpQkFBaUJBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBO1lBQzNDQSxZQUFZQSxDQUFDQSxRQUFRQSxDQUFDQSxhQUFhQSxFQUFFQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtZQUMzREEsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0E7U0FDdENBO1FBQ0RBLFdBQVdBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1FBRXJCQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNiQSxVQUFVQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUMzQkEsQ0FBQ0E7SUFDTEEsQ0FBQ0E7SUFDTEYsK0JBQUNBO0FBQURBLENBQUNBLEFBcERELElBb0RDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmludGVyZmFjZSBXaW5kb3cge1xyXG4gICAgYXBwOiBBcHBDb250cm9sbGVyO1xyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHsgIFxyXG4gICAgXHJcbiAgICB3aW5kb3cuYXBwID0gbmV3IEFwcENvbnRyb2xsZXIoKTtcclxuICAgIFxyXG59KTtcclxuIiwiXHJcbmNvbnN0IEFtYXRpY1VybCA9ICdodHRwOi8vZm9udHMuZ3N0YXRpYy5jb20vcy9hbWF0aWNzYy92OC9JRG5rUlRQR2NyU1ZvNTBVeVlOSzd5M1VTQm5TdnBrb3BRYVVSLTJyN2lVLnR0Zic7XHJcbmNvbnN0IFJvYm90bzEwMCA9ICdodHRwOi8vZm9udHMuZ3N0YXRpYy5jb20vcy9yb2JvdG8vdjE1LzdNeWdxVGUyenM5WWtQMGFkQTlRUVEudHRmJztcclxuY29uc3QgUm9ib3RvNTAwID0gJ2ZvbnRzL1JvYm90by01MDAudHRmJztcclxuXHJcbmNsYXNzIEFwcENvbnRyb2xsZXIge1xyXG5cclxuICAgIGZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICB3YXJwOiBUZXh0V2FycENvbnRyb2xsZXI7XHJcbiAgICB0ZXh0QmxvY2tzOiBUZXh0QmxvY2tbXSA9IFtdO1xyXG4gICAgcGFwZXI6IHBhcGVyLlBhcGVyU2NvcGU7XHJcbiAgICBjYW52YXNDb2xvciA9ICcjRTlFMEMzJztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkNhbnZhcycpO1xyXG4gICAgICAgIHBhcGVyLnNldHVwKDxIVE1MQ2FudmFzRWxlbWVudD5jYW52YXMpO1xyXG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcclxuICAgICAgICBcclxuICAgICAgICBuZXcgRm9udExvYWRlcihSb2JvdG81MDAsIGZvbnQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnQgPSBmb250O1xyXG4gICAgICAgICAgICB0aGlzLndhcnAgPSBuZXcgVGV4dFdhcnBDb250cm9sbGVyKHRoaXMpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5hZGRUZXh0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhZGRUZXh0KCl7XHJcbiAgICAgICAgbGV0IHRleHQgPSAkKCcjbmV3VGV4dCcpLnZhbCgpO1xyXG4gICAgICAgIGlmKHRleHQudHJpbSgpLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+IHtcclxuICAgICAgICAgICAgICAgIF9pZDogbmV3aWQoKSxcclxuICAgICAgICAgICAgICAgIHRleHQ6IHRleHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0QmxvY2tzLnB1c2goYmxvY2spO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53YXJwLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5wYXBlci52aWV3LmRyYXcoKTtcclxuICAgICAgICB9ICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgVGV4dEJsb2NrIHtcclxuICAgIF9pZDogc3RyaW5nO1xyXG4gICAgdGV4dDogc3RyaW5nO1xyXG4gICAgaXRlbTogcGFwZXIuSXRlbTtcclxufSIsIlxyXG5jbGFzcyBGb250TG9hZGVyIHtcclxuXHJcbiAgICBpc0xvYWRlZDogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250VXJsOiBzdHJpbmcsIG9uTG9hZGVkOiAoZm9udDogb3BlbnR5cGUuRm9udCkgPT4gdm9pZCkge1xyXG4gICAgICAgIG9wZW50eXBlLmxvYWQoZm9udFVybCwgZnVuY3Rpb24oZXJyLCBmb250KSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChvbkxvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9uTG9hZGVkLmNhbGwodGhpcywgZm9udCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIlxyXG5mdW5jdGlvbiBuZXdpZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSgpLmdldFRpbWUoKStNYXRoLnJhbmRvbSgpKS50b1N0cmluZygzNik7XHJcbn1cclxuIiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwidHlwaW5ncy9wYXBlci5kLnRzXCIgLz5cclxuLy8gPHJlZmVyZW5jZSBwYXRoPVwiTGlua2VkUGF0aHMudHNcIiAvPlxyXG5cclxuaW50ZXJmYWNlIFdpbmRvdyB7XHJcbiAgICB0ZXh0VHJhY2U6IGFueTtcclxufVxyXG5cclxud2luZG93LnRleHRUcmFjZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBjb25zb2xlLmxvZygndGV4dFRyYWNlIHN0YXJ0ZWQnKTtcclxuXHJcbiAgICBjb25zdCBwczIzID0gXCJUaGUgTG9yZCBpcyBteSBzaGVwaGVyZDsgSSBzaGFsbCBub3Qgd2FudC4gSGUgbWFrZXMgbWUgbGllIGRvd24gaW4gZ3JlZW4gcGFzdHVyZXMuIEhlIGxlYWRzIG1lIGJlc2lkZSBzdGlsbCB3YXRlcnMuIEhlIHJlc3RvcmVzIG15IHNvdWwuIEhlIGxlYWRzIG1lIGluIHBhdGhzIG9mIHJpZ2h0ZW91c25lc3MgZm9yIGhpcyBuYW1lJ3Mgc2FrZS4gRXZlbiB0aG91Z2ggSSB3YWxrIHRocm91Z2ggdGhlIHZhbGxleSBvZiB0aGUgc2hhZG93IG9mIGRlYXRoLCBJIHdpbGwgZmVhciBubyBldmlsLCBmb3IgeW91IGFyZSB3aXRoIG1lOyB5b3VyIHJvZCBhbmQgeW91ciBzdGFmZiwgdGhleSBjb21mb3J0IG1lLiBZb3UgcHJlcGFyZSBhIHRhYmxlIGJlZm9yZSBtZSBpbiB0aGUgcHJlc2VuY2Ugb2YgbXkgZW5lbWllczsgeW91IGFub2ludCBteSBoZWFkIHdpdGggb2lsOyBteSBjdXAgb3ZlcmZsb3dzLiBTdXJlbHkgZ29vZG5lc3MgYW5kIG1lcmN5IHNoYWxsIGZvbGxvdyBtZSBhbGwgdGhlIGRheXMgb2YgbXkgbGlmZSwgYW5kIEkgc2hhbGwgZHdlbGwgaW4gdGhlIGhvdXNlIG9mIHRoZSBMb3JkIGZvcmV2ZXIuXCI7XHJcbiAgICBsZXQgZHJhd1BhdGhzID0gbmV3IExpbmtlZFBhdGhHcm91cCgpO1xyXG4gICAgbGV0IHRleHRTaXplID0gNjQ7XHJcbiAgICBsZXQgdGV4dFBhdGggPSBuZXcgUGF0aFRleHQoZHJhd1BhdGhzLCBwczIzLCB7Zm9udFNpemU6IHRleHRTaXplfSk7XHJcbiAgICBsZXQgc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcclxuICAgIGxldCBjdXJyZW50UGF0aDogcGFwZXIuUGF0aDtcclxuXHJcbiAgICBmdW5jdGlvbiBzdGFydFBhdGgocG9pbnQpIHtcclxuICAgICAgICBpZihjdXJyZW50UGF0aCl7XHJcbiAgICAgICAgICAgIGZpbmlzaFBhdGgoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3VycmVudFBhdGggPSBuZXcgcGFwZXIuUGF0aCh7c3Ryb2tlQ29sb3I6ICdsaWdodGdyYXknLCBzdHJva2VXaWR0aDogdGV4dFNpemV9KTtcclxuICAgICAgICBkcmF3UGF0aHMuYWRkQ2hpbGQoY3VycmVudFBhdGgpO1xyXG4gICAgICAgIGN1cnJlbnRQYXRoLmFkZChwb2ludCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwZW5kUGF0aChwb2ludCkge1xyXG4gICAgICAgIGlmKGN1cnJlbnRQYXRoKXtcclxuICAgICAgICAgICAgY3VycmVudFBhdGguYWRkKHBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZmluaXNoUGF0aCgpe1xyXG4gICAgICAgIGN1cnJlbnRQYXRoLnNpbXBsaWZ5KHRleHRTaXplIC8gMik7XHJcbiAgICAgICAgdGV4dFBhdGgudXBkYXRlKCk7XHJcbiAgICAgICAgY3VycmVudFBhdGgudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGN1cnJlbnRQYXRoID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdG9vbCA9IG5ldyBwYXBlci5Ub29sKCk7XHJcblxyXG4gICAgdG9vbC5vbk1vdXNlRHJhZyA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IHBvaW50ID0gZXZlbnQubWlkZGxlUG9pbnQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIWN1cnJlbnRQYXRoKXtcclxuICAgICAgICAgICAgc3RhcnRQYXRoKHBvaW50KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBObzogbmVlZCB0byBjaGVjayBpZiBzYW1lIHNlZ21lbnQhXHJcbiAgICAgICAgLy8gbGV0IG5lYXJlc3QgPSBkcmF3UGF0aHMuZ2V0TmVhcmVzdFBvaW50KHBvaW50KTtcclxuICAgICAgICAvLyBpZihuZWFyZXN0KSB7XHJcbiAgICAgICAgLy8gICAgIGxldCBuZWFyZXN0RGlzdCA9IG5lYXJlc3QuZ2V0RGlzdGFuY2UocG9pbnQpO1xyXG4gICAgICAgIC8vICAgICBpZihuZWFyZXN0ICYmIG5lYXJlc3REaXN0IDw9IHRleHRTaXplKXtcclxuICAgICAgICAvLyAgICAgICAgIGZpbmlzaFBhdGgoKTtcclxuICAgICAgICAvLyAgICAgICAgIHJldHVybjsgICAgICAgIFxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGFwcGVuZFBhdGgocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvb2wub25Nb3VzZVVwID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBmaW5pc2hQYXRoKCk7XHJcbiAgICB9XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL3BhcGVyLmQudHNcIiAvPlxyXG5cclxuY2xhc3MgVGV4dFdhcnBDb250cm9sbGVyIHtcclxuICAgIGFwcDogQXBwQ29udHJvbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcENvbnRyb2xsZXIpIHtcclxuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcclxuICAgICAgICBcclxuICAgICAgICBuZXcgTW91c2VCZWhhdmlvclRvb2wocGFwZXIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUoKXtcclxuICAgICAgICBmb3IobGV0IGJsb2NrIG9mIHRoaXMuYXBwLnRleHRCbG9ja3Mpe1xyXG4gICAgICAgICAgICBpZighYmxvY2suaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3RyZXRjaHkgPSBuZXcgU3RyZXRjaHlUZXh0KGJsb2NrLnRleHQsIHRoaXMuYXBwLmZvbnQsIDEyOCk7XHJcbiAgICAgICAgICAgICAgICAvL3N0cmV0Y2h5LnRyYW5zbGF0ZShuZXcgcGFwZXIuUG9pbnQoMzAsIDMwKSk7XHJcbiAgICAgICAgICAgICAgICBibG9jay5pdGVtID0gc3RyZXRjaHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZmlkZGxlc3RpY2tzKCl7XHJcbiAgICAgICAgY29uc3Qgc2FtcGxlVGV4dCA9IFwiRmlkZGxlc3RpY2tzXCI7XHJcbiAgICAgICAgdmFyIGxpbmVEcmF3ID0gbmV3IExpbmVEcmF3VG9vbCgpO1xyXG4gICAgICAgIGxldCBwcmV2UGF0aDogcGFwZXIuUGF0aDtcclxuICAgICAgICBsaW5lRHJhdy5vblBhdGhGaW5pc2hlZCA9IChwYXRoKSA9PiB7XHJcbiAgICAgICAgICAgIHBhdGguZmxhdHRlbig0MCk7XHJcbiAgICAgICAgICAgIHBhdGguc21vb3RoKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihwcmV2UGF0aCl7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGF5b3V0ID0gbmV3IFZlcnRpY2FsQm91bmRzVGV4dExheW91dChwYXRoLCBwcmV2UGF0aCk7XHJcbiAgICAgICAgICAgICAgICBsYXlvdXQubGF5b3V0KHNhbXBsZVRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAuZm9udCwgXHJcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW0pID0+IHRoaXMuYXBwLnBhcGVyLnZpZXcuZHJhdygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcHJldlBhdGggPSBwYXRoO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmRlY2xhcmUgdmFyIHNvbHZlOiAoYTogYW55LCBiOiBhbnksIGZhc3Q6IGJvb2xlYW4pID0+IHZvaWQ7XHJcblxyXG5jbGFzcyBQZXJzcGVjdGl2ZVRyYW5zZm9ybSB7XHJcbiAgICBcclxuICAgIHNvdXJjZTogUXVhZDtcclxuICAgIGRlc3Q6IFF1YWQ7XHJcbiAgICBwZXJzcDogYW55O1xyXG4gICAgbWF0cml4OiBudW1iZXJbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc291cmNlOiBRdWFkLCBkZXN0OiBRdWFkKXtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLmRlc3QgPSBkZXN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0uY3JlYXRlTWF0cml4KHNvdXJjZSwgZGVzdCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEdpdmVuIGEgNHg0IHBlcnNwZWN0aXZlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCwgYW5kIGEgMkQgcG9pbnQgKGEgMngxIHZlY3RvciksXHJcbiAgICAvLyBhcHBsaWVzIHRoZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggYnkgY29udmVydGluZyB0aGUgcG9pbnQgdG8gaG9tb2dlbmVvdXNcclxuICAgIC8vIGNvb3JkaW5hdGVzIGF0IHo9MCwgcG9zdC1tdWx0aXBseWluZywgYW5kIHRoZW4gYXBwbHlpbmcgYSBwZXJzcGVjdGl2ZSBkaXZpZGUuXHJcbiAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgbGV0IHAzID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0ubXVsdGlwbHkodGhpcy5tYXRyaXgsIFtwb2ludC54LCBwb2ludC55LCAwLCAxXSk7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBwYXBlci5Qb2ludChwM1swXSAvIHAzWzNdLCBwM1sxXSAvIHAzWzNdKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgY3JlYXRlTWF0cml4KHNvdXJjZTogUXVhZCwgdGFyZ2V0OiBRdWFkKTogbnVtYmVyW10ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzb3VyY2VQb2ludHMgPSBbXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYS54LCBzb3VyY2UuYS55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYi54LCBzb3VyY2UuYi55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYy54LCBzb3VyY2UuYy55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuZC54LCBzb3VyY2UuZC55XV07XHJcbiAgICAgICAgbGV0IHRhcmdldFBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3RhcmdldC5hLngsIHRhcmdldC5hLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5iLngsIHRhcmdldC5iLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5jLngsIHRhcmdldC5jLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5kLngsIHRhcmdldC5kLnldXTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBhID0gW10sIGIgPSBbXSwgaSA9IDAsIG4gPSBzb3VyY2VQb2ludHMubGVuZ3RoOyBpIDwgbjsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBzID0gc291cmNlUG9pbnRzW2ldLCB0ID0gdGFyZ2V0UG9pbnRzW2ldO1xyXG4gICAgICAgICAgICBhLnB1c2goW3NbMF0sIHNbMV0sIDEsIDAsIDAsIDAsIC1zWzBdICogdFswXSwgLXNbMV0gKiB0WzBdXSksIGIucHVzaCh0WzBdKTtcclxuICAgICAgICAgICAgYS5wdXNoKFswLCAwLCAwLCBzWzBdLCBzWzFdLCAxLCAtc1swXSAqIHRbMV0sIC1zWzFdICogdFsxXV0pLCBiLnB1c2godFsxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgWCA9IHNvbHZlKGEsIGIsIHRydWUpOyBcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBYWzBdLCBYWzNdLCAwLCBYWzZdLFxyXG4gICAgICAgICAgICBYWzFdLCBYWzRdLCAwLCBYWzddLFxyXG4gICAgICAgICAgICAgICAwLCAgICAwLCAxLCAgICAwLFxyXG4gICAgICAgICAgICBYWzJdLCBYWzVdLCAwLCAgICAxXHJcbiAgICAgICAgXS5tYXAoZnVuY3Rpb24oeCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh4ICogMTAwMDAwKSAvIDEwMDAwMDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQb3N0LW11bHRpcGx5IGEgNHg0IG1hdHJpeCBpbiBjb2x1bW4tbWFqb3Igb3JkZXIgYnkgYSA0eDEgY29sdW1uIHZlY3RvcjpcclxuICAgIC8vIFsgbTAgbTQgbTggIG0xMiBdICAgWyB2MCBdICAgWyB4IF1cclxuICAgIC8vIFsgbTEgbTUgbTkgIG0xMyBdICogWyB2MSBdID0gWyB5IF1cclxuICAgIC8vIFsgbTIgbTYgbTEwIG0xNCBdICAgWyB2MiBdICAgWyB6IF1cclxuICAgIC8vIFsgbTMgbTcgbTExIG0xNSBdICAgWyB2MyBdICAgWyB3IF1cclxuICAgIHN0YXRpYyBtdWx0aXBseShtYXRyaXgsIHZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIG1hdHJpeFswXSAqIHZlY3RvclswXSArIG1hdHJpeFs0XSAqIHZlY3RvclsxXSArIG1hdHJpeFs4IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTJdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMV0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNV0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbOSBdICogdmVjdG9yWzJdICsgbWF0cml4WzEzXSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzJdICogdmVjdG9yWzBdICsgbWF0cml4WzZdICogdmVjdG9yWzFdICsgbWF0cml4WzEwXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNF0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFszXSAqIHZlY3RvclswXSArIG1hdHJpeFs3XSAqIHZlY3RvclsxXSArIG1hdHJpeFsxMV0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTVdICogdmVjdG9yWzNdXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUXVhZCB7XHJcbiAgICBhOiBwYXBlci5Qb2ludDtcclxuICAgIGI6IHBhcGVyLlBvaW50O1xyXG4gICAgYzogcGFwZXIuUG9pbnQ7XHJcbiAgICBkOiBwYXBlci5Qb2ludDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50LCBjOiBwYXBlci5Qb2ludCwgZDogcGFwZXIuUG9pbnQpe1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmMgPSBjO1xyXG4gICAgICAgIHRoaXMuZCA9IGQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tUmVjdGFuZ2xlKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICByZWN0LnRvcExlZnQsXHJcbiAgICAgICAgICAgIHJlY3QudG9wUmlnaHQsXHJcbiAgICAgICAgICAgIHJlY3QuYm90dG9tTGVmdCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21SaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tQ29vcmRzKGNvb3JkczogbnVtYmVyW10pIDogUXVhZCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzBdLCBjb29yZHNbMV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzJdLCBjb29yZHNbM10pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzRdLCBjb29yZHNbNV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzZdLCBjb29yZHNbN10pXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhc0Nvb3JkcygpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgdGhpcy5hLngsIHRoaXMuYS55LFxyXG4gICAgICAgICAgICB0aGlzLmIueCwgdGhpcy5iLnksXHJcbiAgICAgICAgICAgIHRoaXMuYy54LCB0aGlzLmMueSxcclxuICAgICAgICAgICAgdGhpcy5kLngsIHRoaXMuZC55XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBCb3R0b21UZXh0TGF5b3V0IGltcGxlbWVudHMgVGV4dExheW91dCB7XHJcblxyXG4gICAgYm90dG9tOiBwYXBlci5QYXRoXHJcbiAgICBmb250U2l6ZSA9IDEwMDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihib3R0b206IHBhcGVyLlBhdGgpIHtcclxuICAgICAgICB0aGlzLmJvdHRvbSA9IGJvdHRvbTtcclxuICAgIH1cclxuXHJcbiAgICBsYXlvdXQodGV4dDogc3RyaW5nLCBvbkNvbXBsZXRlPzogKGl0ZW06IHBhcGVyLkl0ZW0pID0+IHZvaWQpIHtcclxuICAgICAgICBuZXcgRm9udExvYWRlcihBbWF0aWNVcmwsIGZvbnQgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IGxldHRlckdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgICAgIGxldCBsZXR0ZXJQYXRocyA9IGZvbnQuZ2V0UGF0aHModGV4dCwgMCwgMCwgdGhpcy5mb250U2l6ZSlcclxuICAgICAgICAgICAgICAgIC5tYXAocCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGggPSBQYXBlckhlbHBlcnMuaW1wb3J0T3BlblR5cGVQYXRoKHApO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldHRlckdyb3VwLmFkZENoaWxkKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGV4dE9yaWdpbiA9IGxldHRlckdyb3VwLmJvdW5kcy5ib3R0b21MZWZ0O1xyXG4gICAgICAgICAgICBsZXQgbGluZWFyTGVuZ3RoID0gbGV0dGVyR3JvdXAuYm91bmRzLndpZHRoO1xyXG4gICAgICAgICAgICBsZXQgbGF5b3V0UGF0aExlbmd0aCA9IHRoaXMuYm90dG9tLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IG9mZnNldFNjYWxpbmcgPSBsYXlvdXRQYXRoTGVuZ3RoIC8gbGluZWFyTGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgbGV0IGlkeCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGxldHRlclBhdGggb2YgbGV0dGVyUGF0aHMpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsZXR0ZXJPZmZzZXQgPSAobGV0dGVyUGF0aC5ib3VuZHMubGVmdCAtIHRleHRPcmlnaW4ueCkgKiBvZmZzZXRTY2FsaW5nO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvdHRvbUxlZnRQcmltZSA9IHRoaXMuYm90dG9tLmdldFBvaW50QXQobGV0dGVyT2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgIGxldCBib3R0b21SaWdodFByaW1lID0gdGhpcy5ib3R0b20uZ2V0UG9pbnRBdChcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihsYXlvdXRQYXRoTGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJPZmZzZXQgKyBsZXR0ZXJQYXRoLmJvdW5kcy53aWR0aCAqIG9mZnNldFNjYWxpbmcpKTtcclxuICAgICAgICAgICAgICAgIGxldCBib3R0b21WZWN0b3JQcmltZSA9IGJvdHRvbVJpZ2h0UHJpbWUuc3VidHJhY3QoYm90dG9tTGVmdFByaW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcm90YXRlQW5nbGUgPVxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgxLCAwKS5nZXREaXJlY3RlZEFuZ2xlKGJvdHRvbVJpZ2h0UHJpbWUuc3VidHJhY3QoYm90dG9tTGVmdFByaW1lKSlcclxuICAgICAgICAgICAgICAgIC8vIHJlcG9zaXRpb24gdXNpbmcgYm90dG9tTGVmdFxyXG4gICAgICAgICAgICAgICAgbGV0dGVyUGF0aC5wb3NpdGlvbiA9IGJvdHRvbUxlZnRQcmltZVxyXG4gICAgICAgICAgICAgICAgICAgIC5hZGQobGV0dGVyUGF0aC5ib3VuZHMuY2VudGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChsZXR0ZXJQYXRoLmJvdW5kcy5ib3R0b21MZWZ0KSk7XHJcbiAgICAgICAgICAgICAgICBsZXR0ZXJQYXRoLnJvdGF0ZShyb3RhdGVBbmdsZSwgYm90dG9tTGVmdFByaW1lKTtcclxuICAgICAgICAgICAgICAgIGxldHRlclBhdGguc2NhbGUob2Zmc2V0U2NhbGluZywgYm90dG9tTGVmdFByaW1lKTtcclxuICAgICAgICAgICAgICAgIGlkeCsrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihvbkNvbXBsZXRlKXtcclxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGUobGV0dGVyR3JvdXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFBhdGhPZmZzZXRTY2FsaW5nIHtcclxuXHJcbiAgICB0bzogcGFwZXIuUGF0aDtcclxuICAgIHNjYWxlOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZnJvbUxlbmd0aDogbnVtYmVyLCB0bzogcGFwZXIuUGF0aCkge1xyXG4gICAgICAgIHRoaXMudG8gPSB0bztcclxuICAgICAgICB0aGlzLnNjYWxlID0gdG8ubGVuZ3RoIC8gZnJvbUxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUb1BvaW50QXQoZnJvbVBhdGhPZmZzZXQ6IG51bWJlcik6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBsZXQgdG9PZmZzZXQgPSBNYXRoLm1pbih0aGlzLnRvLmxlbmd0aCwgZnJvbVBhdGhPZmZzZXQgKiB0aGlzLnNjYWxlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy50by5nZXRQb2ludEF0KHRvT2Zmc2V0KTtcclxuICAgIH1cclxufSIsIlxyXG4vKipcclxuICogSGFuZGxlIHRoYXQgc2l0cyBvbiBtaWRwb2ludCBvZiBjdXJ2ZVxyXG4gKiB3aGljaCB3aWxsIHNwbGl0IHRoZSBjdXJ2ZSB3aGVuIGRyYWdnZWQuXHJcbiAqL1xyXG5jbGFzcyBDdXJ2ZVNwbGl0dGVySGFuZGxlIGV4dGVuZHMgcGFwZXIuU2hhcGUge1xyXG4gXHJcbiAgICBjdXJ2ZTogcGFwZXIuQ3VydmU7XHJcbiAgICBvbkRyYWdFbmQ6IChuZXdTZWdtZW50OiBwYXBlci5TZWdtZW50LCBldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gXHJcbiAgICBjb25zdHJ1Y3RvcihjdXJ2ZTogcGFwZXIuQ3VydmUpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VydmUgPSBjdXJ2ZTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc2VsZiA9IDxhbnk+dGhpcztcclxuICAgICAgICBzZWxmLl90eXBlID0gJ2NpcmNsZSc7XHJcbiAgICAgICAgc2VsZi5fcmFkaXVzID0gNTtcclxuICAgICAgICBzZWxmLl9zaXplID0gbmV3IHBhcGVyLlNpemUoc2VsZi5fcmFkaXVzICogMik7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGUoY3VydmUuZ2V0UG9pbnRBdCgwLjUgKiBjdXJ2ZS5sZW5ndGgpKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0cm9rZVdpZHRoID0gMjtcclxuICAgICAgICB0aGlzLnN0cm9rZUNvbG9yID0gJ2JsdWUnO1xyXG4gICAgICAgIHRoaXMuZmlsbENvbG9yID0gJ3doaXRlJztcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAwLjUgKiAwLjM7IFxyXG4gXHJcbiAgICAgICAgbGV0IG5ld1NlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0gPE1vdXNlQmVoYXZpb3I+e1xyXG4gICAgICAgICAgICBvbkRyYWdTdGFydDogKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuZXdTZWdtZW50ID0gbmV3IHBhcGVyLlNlZ21lbnQodGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICBjdXJ2ZS5wYXRoLmluc2VydChcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZS5pbmRleCArIDEsIFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1NlZ21lbnRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ01vdmU6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdQb3MgPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zO1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudC5wb2ludCA9IG5ld1BvcztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnRW5kOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uRHJhZ0VuZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkRyYWdFbmQobmV3U2VnbWVudCwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG4iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL3BhcGVyLmQudHNcIiAvPlxyXG5cclxuY2xhc3MgTGluZURyYXdUb29sIHtcclxuICAgIGdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICBjdXJyZW50UGF0aDogcGFwZXIuUGF0aDtcclxuICAgIG9uUGF0aEZpbmlzaGVkOiAocGF0aDogcGFwZXIuUGF0aCkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB2YXIgdG9vbCA9IG5ldyBwYXBlci5Ub29sKCk7XHJcblxyXG4gICAgICAgIHRvb2wub25Nb3VzZURyYWcgPSBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IGV2ZW50Lm1pZGRsZVBvaW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRQYXRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UGF0aChwb2ludCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kUGF0aChwb2ludCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b29sLm9uTW91c2VVcCA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5maW5pc2hQYXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0UGF0aChwb2ludCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmluaXNoUGF0aCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbmV3IHBhcGVyLlBhdGgoeyBzdHJva2VDb2xvcjogJ2xpZ2h0Z3JheScsIHN0cm9rZVdpZHRoOiAyIH0pO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAuYWRkQ2hpbGQodGhpcy5jdXJyZW50UGF0aCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5hZGQocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZFBhdGgocG9pbnQpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLmFkZChwb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpbmlzaFBhdGgoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5zaW1wbGlmeSg1KTtcclxuICAgICAgICAgICAgbGV0IHBhdGggPSB0aGlzLmN1cnJlbnRQYXRoO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25QYXRoRmluaXNoZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25QYXRoRmluaXNoZWQuY2FsbCh0aGlzLCBwYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInR5cGluZ3MvcGFwZXIuZC50c1wiIC8+XHJcblxyXG5pbnRlcmZhY2UgUGF0aExpa2Uge1xyXG4gICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICBnZXRMb2NhdGlvbkF0KG9mZnNldDogbnVtYmVyLCBpc1BhcmFtZXRlcj86IGJvb2xlYW4pOiBwYXBlci5DdXJ2ZUxvY2F0aW9uO1xyXG4gICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlciwgaXNQYXRhbWV0ZXI/OiBib29sZWFuKTogcGFwZXIuUG9pbnQ7XHJcbiAgICBnZXRUYW5nZW50QXQob2Zmc2V0OiBudW1iZXIsIGlzUGF0YW1ldGVyPzogYm9vbGVhbik6IHBhcGVyLlBvaW50O1xyXG4gICAgZ2V0TmVhcmVzdFBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50O1xyXG59XHJcblxyXG5jbGFzcyBMaW5rZWRQYXRoR3JvdXAgZXh0ZW5kcyBwYXBlci5Hcm91cFxyXG4gICAgaW1wbGVtZW50cyBQYXRoTGlrZSBcclxue1xyXG4gICAgXHJcbiAgICBhZGRDaGlsZChwYXRoOiBwYXBlci5QYXRoKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFkZENoaWxkKHBhdGgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnJlZHVjZSgoYSwgYjogcGFwZXIuUGF0aCkgPT4gYSArIGIubGVuZ3RoLCAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldCBwYXRocygpOiBwYXBlci5QYXRoW10ge1xyXG4gICAgICAgIHJldHVybiA8cGFwZXIuUGF0aFtdPnRoaXMuY2hpbGRyZW47XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldExvY2F0aW9uQXQob2Zmc2V0OiBudW1iZXIsIGlzUGFyYW1ldGVyPzogYm9vbGVhbik6IHBhcGVyLkN1cnZlTG9jYXRpb257XHJcbiAgICAgICAgbGV0IHBhdGg6IHBhcGVyLlBhdGggPSBudWxsO1xyXG4gICAgICAgIGZvcihwYXRoIG9mIHRoaXMucGF0aHMpe1xyXG4gICAgICAgICAgICBsZXQgbGVuID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmKGxlbiA+PSBvZmZzZXQpe1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb2Zmc2V0IC09IGxlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGguZ2V0TG9jYXRpb25BdChvZmZzZXQsIGlzUGFyYW1ldGVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlciwgaXNQYXJhbWV0ZXI/OiBib29sZWFuKTogcGFwZXIuUG9pbnR7XHJcbiAgICAgICAgbGV0IHBhdGg6IHBhcGVyLlBhdGggPSBudWxsO1xyXG4gICAgICAgIGZvcihwYXRoIG9mIHRoaXMucGF0aHMpe1xyXG4gICAgICAgICAgICBsZXQgbGVuID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmKGxlbiA+PSBvZmZzZXQpe1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb2Zmc2V0IC09IGxlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGguZ2V0UG9pbnRBdChvZmZzZXQsIGlzUGFyYW1ldGVyKTsgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFRhbmdlbnRBdChvZmZzZXQ6IG51bWJlciwgaXNQYXRhbWV0ZXI/OiBib29sZWFuKTogcGFwZXIuUG9pbnR7XHJcbiAgICAgICAgbGV0IHBhdGg6IHBhcGVyLlBhdGggPSBudWxsO1xyXG4gICAgICAgIGZvcihwYXRoIG9mIHRoaXMucGF0aHMpe1xyXG4gICAgICAgICAgICBsZXQgbGVuID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmKGxlbiA+PSBvZmZzZXQpe1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb2Zmc2V0IC09IGxlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGguZ2V0VGFuZ2VudEF0KG9mZnNldCwgaXNQYXRhbWV0ZXIpOyAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0TmVhcmVzdFBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBsZXQgbmVhcmVzdEFnZzogcGFwZXIuUG9pbnQ7XHJcbiAgICAgICAgbGV0IGRpc3RBZ2c6IG51bWJlcjtcclxuICAgICAgICBmb3IobGV0IHBhdGggb2YgdGhpcy5wYXRocyl7XHJcbiAgICAgICAgICAgIGlmKHBhdGguc2VnbWVudHMubGVuZ3RoIDwgMil7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbmVhcmVzdCA9IHBhdGguZ2V0TmVhcmVzdFBvaW50KHBvaW50KTtcclxuICAgICAgICAgICAgbGV0IGRpc3QgPSBuZWFyZXN0LmdldERpc3RhbmNlKHBvaW50KTtcclxuICAgICAgICAgICAgaWYoIW5lYXJlc3RBZ2cgfHwgZGlzdCA8IGRpc3RBZ2cpe1xyXG4gICAgICAgICAgICAgICAgbmVhcmVzdEFnZyA9IG5lYXJlc3Q7XHJcbiAgICAgICAgICAgICAgICBkaXN0QWdnID0gZGlzdDsgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmVhcmVzdEFnZztcclxuICAgIH1cclxufSIsIlxyXG5kZWNsYXJlIG1vZHVsZSBwYXBlciB7XHJcbiAgICBpbnRlcmZhY2UgSXRlbSB7XHJcbiAgICAgICAgbW91c2VCZWhhdmlvcjogTW91c2VCZWhhdmlvcjtcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIE1vdXNlQmVoYXZpb3Ige1xyXG4gICAgb25DbGljaz86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICAgIG9uT3ZlclN0YXJ0PzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbk92ZXJNb3ZlPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbk92ZXJFbmQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuXHJcbiAgICBvbkRyYWdTdGFydD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25EcmFnTW92ZT86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25EcmFnRW5kPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbn1cclxuXHJcbmludGVyZmFjZSBNb3VzZUFjdGlvbiB7XHJcbiAgICBzdGFydEV2ZW50OiBwYXBlci5Ub29sRXZlbnQ7XHJcbiAgICBpdGVtOiBwYXBlci5JdGVtO1xyXG4gICAgZHJhZ2dlZDogYm9vbGVhbjtcclxufVxyXG5cclxuY2xhc3MgTW91c2VCZWhhdmlvclRvb2wgZXh0ZW5kcyBwYXBlci5Ub29sIHtcclxuXHJcbiAgICBoaXRPcHRpb25zID0ge1xyXG4gICAgICAgIHNlZ21lbnRzOiB0cnVlLFxyXG4gICAgICAgIHN0cm9rZTogdHJ1ZSxcclxuICAgICAgICBmaWxsOiB0cnVlLFxyXG4gICAgICAgIHRvbGVyYW5jZTogNVxyXG4gICAgfTtcclxuXHJcbiAgICBwcmVzc0FjdGlvbjogTW91c2VBY3Rpb247XHJcbiAgICBob3ZlckFjdGlvbjogTW91c2VBY3Rpb247XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFwZXJTY29wZTogcGFwZXIuUGFwZXJTY29wZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24gPSAoZXZlbnQpID0+IHtcclxuICAgICAgICB0aGlzLnByZXNzQWN0aW9uID0gbnVsbDtcclxuXHJcbiAgICAgICAgdmFyIGhpdFJlc3VsdCA9IHBhcGVyLnByb2plY3QuaGl0VGVzdChcclxuICAgICAgICAgICAgZXZlbnQucG9pbnQsXHJcbiAgICAgICAgICAgIHRoaXMuaGl0T3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGlmIChoaXRSZXN1bHQgJiYgaGl0UmVzdWx0Lml0ZW0pIHtcclxuICAgICAgICAgICAgbGV0IGRyYWdnYWJsZSA9IHRoaXMuZmluZERyYWdIYW5kbGVyKGhpdFJlc3VsdC5pdGVtKTtcclxuICAgICAgICAgICAgaWYgKGRyYWdnYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbiA9IDxNb3VzZUFjdGlvbj57XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogZHJhZ2dhYmxlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vdGhpcy5wYXBlclNjb3BlLnByb2plY3QuYWN0aXZlTGF5ZXIuYWRkQ2hpbGQodGhpcy5kcmFnSXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgdmFyIGhpdFJlc3VsdCA9IHBhcGVyLnByb2plY3QuaGl0VGVzdChcclxuICAgICAgICAgICAgZXZlbnQucG9pbnQsXHJcbiAgICAgICAgICAgIHRoaXMuaGl0T3B0aW9ucyk7XHJcbiAgICAgICAgbGV0IGhhbmRsZXJJdGVtID0gaGl0UmVzdWx0XHJcbiAgICAgICAgICAgICYmIHRoaXMuZmluZE92ZXJIYW5kbGVyKGhpdFJlc3VsdC5pdGVtKTtcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAvLyB3ZXJlIHByZXZpb3VzbHkgaG92ZXJpbmdcclxuICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvblxyXG4gICAgICAgICAgICAmJiAoXHJcbiAgICAgICAgICAgICAgICAvLyBub3QgaG92ZXJpbmcgb3ZlciBhbnl0aGluZyBub3dcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJJdGVtID09IG51bGxcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBob3ZlcmluZyBvdmVyIGN1cnJlbnQgaGFuZGxlciBvciBkZXNjZW5kZW50IHRoZXJlb2ZcclxuICAgICAgICAgICAgICAgIHx8ICFNb3VzZUJlaGF2aW9yVG9vbC5pc1NhbWVPckFuY2VzdG9yKFxyXG4gICAgICAgICAgICAgICAgICAgIGhpdFJlc3VsdC5pdGVtLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24uaXRlbSkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vIGp1c3QgbGVhdmluZ1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ob3ZlckFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25PdmVyRW5kKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbk92ZXJFbmQoZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGhhbmRsZXJJdGVtICYmIGhhbmRsZXJJdGVtLm1vdXNlQmVoYXZpb3IpIHtcclxuICAgICAgICAgICAgbGV0IGJlaGF2aW9yID0gaGFuZGxlckl0ZW0ubW91c2VCZWhhdmlvcjtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhvdmVyQWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uID0gPE1vdXNlQWN0aW9uPntcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiBoYW5kbGVySXRlbVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmIChiZWhhdmlvci5vbk92ZXJTdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yLm9uT3ZlclN0YXJ0KGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYmVoYXZpb3IgJiYgYmVoYXZpb3Iub25PdmVyTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgYmVoYXZpb3Iub25PdmVyTW92ZShldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURyYWcgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5wcmVzc0FjdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucHJlc3NBY3Rpb24uZHJhZ2dlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5kcmFnZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdTdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ1N0YXJ0LmNhbGwoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24uaXRlbSwgdGhpcy5wcmVzc0FjdGlvbi5zdGFydEV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnTW92ZS5jYWxsKHRoaXMucHJlc3NBY3Rpb24uaXRlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGxldCBhY3Rpb24gPSB0aGlzLnByZXNzQWN0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChhY3Rpb24uZHJhZ2dlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gZHJhZ1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnRW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdFbmQuY2FsbChhY3Rpb24uaXRlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY2xpY2tcclxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uQ2xpY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uQ2xpY2suY2FsbChhY3Rpb24uaXRlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uS2V5RG93biA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIGlmIChldmVudC5rZXkgPT0gJ3NwYWNlJykge1xyXG4gICAgICAgICAgICBwYXBlci5wcm9qZWN0LmFjdGl2ZUxheWVyLnNlbGVjdGVkID0gIXBhcGVyLnByb2plY3QuYWN0aXZlTGF5ZXIuc2VsZWN0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZSBpZiBwb3NzaWJsZUFuY2VzdG9yIGlzIGFuIGFuY2VzdG9yIG9mIGl0ZW0uIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaXNTYW1lT3JBbmNlc3RvcihpdGVtOiBwYXBlci5JdGVtLCBwb3NzaWJsZUFuY2VzdG9yOiBwYXBlci5JdGVtKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICEhUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvcihpdGVtLCBwYSA9PiBwYSA9PT0gcG9zc2libGVBbmNlc3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZERyYWdIYW5kbGVyKGl0ZW06IHBhcGVyLkl0ZW0pOiBwYXBlci5JdGVtIHtcclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvcihcclxuICAgICAgICAgICAgaXRlbSwgXHJcbiAgICAgICAgICAgIHBhID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYiA9IHBhLm1vdXNlQmVoYXZpb3I7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gISEobWIgJiZcclxuICAgICAgICAgICAgICAgICAgICAobWIub25EcmFnU3RhcnQgfHwgbWIub25EcmFnTW92ZSB8fCBtYi5vbkRyYWdFbmQpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZpbmRPdmVySGFuZGxlcihpdGVtOiBwYXBlci5JdGVtKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kU2VsZk9yQW5jZXN0b3IoXHJcbiAgICAgICAgICAgIGl0ZW0sIFxyXG4gICAgICAgICAgICBwYSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWIgPSBwYS5tb3VzZUJlaGF2aW9yO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKG1iICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKG1iLm9uT3ZlclN0YXJ0IHx8IG1iLm9uT3Zlck1vdmUgfHwgbWIub25PdmVyRW5kICkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgUGFwZXJIZWxwZXJzIHtcclxuXHJcbiAgICBzdGF0aWMgaW1wb3J0T3BlblR5cGVQYXRoKG9wZW5QYXRoOiBvcGVudHlwZS5QYXRoKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChvcGVuUGF0aC50b1BhdGhEYXRhKCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGxldCBzdmcgPSBvcGVuUGF0aC50b1NWRyg0KTtcclxuICAgICAgICAvLyByZXR1cm4gPHBhcGVyLlBhdGg+cGFwZXIucHJvamVjdC5pbXBvcnRTVkcoc3ZnKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdHJhY2VQYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuUGF0aEl0ZW0ge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VDb21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgsIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgaWYgKCFwYXRoLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBhdGhzID0gcGF0aC5jaGlsZHJlbi5tYXAocCA9PlxyXG4gICAgICAgICAgICB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wLCBwb2ludHNQZXJQYXRoKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgoe1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogcGF0aHMsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2UsXHJcbiAgICAgICAgICAgIGZpbGxDb2xvcjogJ2xpZ2h0Z3JheSdcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZVBhdGgocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAvLyBpZighcGF0aCB8fCAhcGF0aC5zZWdtZW50cyB8fCBwYXRoLnNlZ21lbnRzLmxlbmd0aCl7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBsZXQgcGF0aExlbmd0aCA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGxldCBvZmZzZXRJbmNyID0gcGF0aExlbmd0aCAvIG51bVBvaW50cztcclxuICAgICAgICBsZXQgcG9pbnRzID0gW107XHJcbiAgICAgICAgLy9wb2ludHMubGVuZ3RoID0gbnVtUG9pbnRzO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGkrKyA8IG51bVBvaW50cykge1xyXG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBwYXRoLmdldFBvaW50QXQoTWF0aC5taW4ob2Zmc2V0LCBwYXRoTGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IG9mZnNldEluY3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcGF0aCA9IG5ldyBwYXBlci5QYXRoKHBvaW50cyk7XHJcbiAgICAgICAgcGF0aC5maWxsQ29sb3IgPSAnbGlnaHRncmF5JztcclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2FuZHdpY2hQYXRoUHJvamVjdGlvbih0b3BQYXRoOiBwYXBlci5DdXJ2ZWxpa2UsIGJvdHRvbVBhdGg6IHBhcGVyLkN1cnZlbGlrZSlcclxuICAgICAgICA6ICh1bml0UG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgY29uc3QgdG9wUGF0aExlbmd0aCA9IHRvcFBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGJvdHRvbVBhdGhMZW5ndGggPSBib3R0b21QYXRoLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24odW5pdFBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICAgICAgbGV0IHRvcFBvaW50ID0gdG9wUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogdG9wUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGxldCBib3R0b21Qb2ludCA9IGJvdHRvbVBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIGJvdHRvbVBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgICBpZiAodG9wUG9pbnQgPT0gbnVsbCB8fCBib3R0b21Qb2ludCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcImNvdWxkIG5vdCBnZXQgcHJvamVjdGVkIHBvaW50IGZvciB1bml0IHBvaW50IFwiICsgdW5pdFBvaW50LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRvcFBvaW50LmFkZChib3R0b21Qb2ludC5zdWJ0cmFjdCh0b3BQb2ludCkubXVsdGlwbHkodW5pdFBvaW50LnkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1hcmtlckdyb3VwOiBwYXBlci5Hcm91cDtcclxuXHJcbiAgICBzdGF0aWMgcmVzZXRNYXJrZXJzKCl7XHJcbiAgICAgICAgaWYoUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwKXtcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAub3BhY2l0eSA9IDAuMjtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyTGluZShhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQpOiBwYXBlci5JdGVte1xyXG4gICAgICAgIGxldCBsaW5lID0gcGFwZXIuUGF0aC5MaW5lKGEsYik7XHJcbiAgICAgICAgbGluZS5zdHJva2VDb2xvciA9ICdncmVlbic7XHJcbiAgICAgICAgLy9saW5lLmRhc2hBcnJheSA9IFs1LCA1XTtcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobGluZSk7XHJcbiAgICAgICAgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1hcmtlcihwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICBsZXQgbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvaW50LCAyKTtcclxuICAgICAgICBtYXJrZXIuc3Ryb2tlQ29sb3IgPSAncmVkJztcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobWFya2VyKTtcclxuICAgICAgICByZXR1cm4gbWFya2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzaW1wbGlmeShwYXRoOiBwYXBlci5QYXRoSXRlbSwgdG9sZXJhbmNlPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5zaW1wbGlmeSg8cGFwZXIuUGF0aEl0ZW0+cCwgdG9sZXJhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICg8cGFwZXIuUGF0aD5wYXRoKS5zaW1wbGlmeSh0b2xlcmFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgc2VsZiBvciBuZWFyZXN0IGFuY2VzdG9yIHNhdGlzZnlpbmcgdGhlIHByZWRpY2F0ZS5cclxuICAgICAqLyAgICBcclxuICAgIHN0YXRpYyBmaW5kU2VsZk9yQW5jZXN0b3IoaXRlbTogcGFwZXIuSXRlbSwgcHJlZGljYXRlOiAoaTogcGFwZXIuSXRlbSkgPT4gYm9vbGVhbil7XHJcbiAgICAgICAgaWYocHJlZGljYXRlKGl0ZW0pKXtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQYXBlckhlbHBlcnMuZmluZEFuY2VzdG9yKGl0ZW0sIHByZWRpY2F0ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRmluZCBuZWFyZXN0IGFuY2VzdG9yIHNhdGlzZnlpbmcgdGhlIHByZWRpY2F0ZS5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGZpbmRBbmNlc3RvcihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKXtcclxuICAgICAgICBpZighaXRlbSl7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJpb3I6IHBhcGVyLkl0ZW07XHJcbiAgICAgICAgbGV0IGNoZWNraW5nID0gaXRlbS5wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUoY2hlY2tpbmcgJiYgY2hlY2tpbmcgIT09IHByaW9yKXtcclxuICAgICAgICAgICAgaWYocHJlZGljYXRlKGNoZWNraW5nKSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hlY2tpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJpb3IgPSBjaGVja2luZztcclxuICAgICAgICAgICAgY2hlY2tpbmcgPSBjaGVja2luZy5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBjb3JuZXJzIG9mIHRoZSByZWN0LCBjbG9ja3dpc2Ugc3RhcnRpbmcgZnJvbSB0b3BMZWZ0XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb3JuZXJzKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSk6IHBhcGVyLlBvaW50W117XHJcbiAgICAgICAgcmV0dXJuIFtyZWN0LnRvcExlZnQsIHJlY3QudG9wUmlnaHQsIHJlY3QuYm90dG9tUmlnaHQsIHJlY3QuYm90dG9tTGVmdF07XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgUGF0aFNlY3Rpb24gaW1wbGVtZW50cyBwYXBlci5DdXJ2ZWxpa2Uge1xyXG4gICAgcGF0aDogcGFwZXIuUGF0aDtcclxuICAgIG9mZnNldDogbnVtYmVyO1xyXG4gICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHBhcGVyLlBhdGgsIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcil7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aC5nZXRQb2ludEF0KG9mZnNldCArIHRoaXMub2Zmc2V0KTtcclxuICAgIH1cclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInR5cGluZ3MvcGFwZXIuZC50c1wiIC8+XHJcblxyXG5jbGFzcyBQYXRoVGV4dCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBwYXRoOiBQYXRoTGlrZTtcclxuICAgIHByaXZhdGUgX3RleHQ6IHN0cmluZztcclxuICAgIFxyXG4gICAgcHVibGljIHN0eWxlO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoTGlrZSwgdGV4dD86IHN0cmluZywgc3R5bGU/OiBhbnkpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICB0aGlzLl90ZXh0ID0gdGV4dDtcclxuICAgICAgICB0aGlzLnN0eWxlID0gc3R5bGU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuIFxyXG4gICAgZ2V0IHRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IHRleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX3RleHQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB0ZXh0ID0gdGhpcy50ZXh0O1xyXG4gICAgICAgIGxldCBwYXRoID0gdGhpcy5wYXRoO1xyXG4gICAgICAgIGlmICh0ZXh0ICYmIHRleHQubGVuZ3RoICYmIHBhdGggJiYgcGF0aC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIE1lYXN1cmUgZ2x5cGhzIGluIHBhaXJzIHRvIGNhcHR1cmUgd2hpdGUgc3BhY2UuXHJcbiAgICAgICAgICAgIC8vIFBhaXJzIGFyZSBjaGFyYWN0ZXJzIGkgYW5kIGkrMS5cclxuICAgICAgICAgICAgdmFyIGdseXBoUGFpcnMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBnbHlwaFBhaXJzW2ldID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSwgaSsxKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEZvciBlYWNoIGNoYXJhY3RlciwgZmluZCBjZW50ZXIgb2Zmc2V0LlxyXG4gICAgICAgICAgICB2YXIgeE9mZnNldHMgPSBbMF07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBNZWFzdXJlIHRocmVlIGNoYXJhY3RlcnMgYXQgYSB0aW1lIHRvIGdldCB0aGUgYXBwcm9wcmlhdGUgXHJcbiAgICAgICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxyXG4gICAgICAgICAgICAgICAgdmFyIHRyaWFkVGV4dCA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGkgLSAxLCBpICsgMSkpO1xyXG4gICAgICAgICAgICAgICAgdHJpYWRUZXh0LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBvdXQgaGFsZiBvZiBwcmlvciBnbHlwaCBwYWlyIFxyXG4gICAgICAgICAgICAgICAgLy8gICBhbmQgaGFsZiBvZiBjdXJyZW50IGdseXBoIHBhaXIuXHJcbiAgICAgICAgICAgICAgICAvLyBNdXN0IGJlIHJpZ2h0LCBiZWNhdXNlIGl0IHdvcmtzLlxyXG4gICAgICAgICAgICAgICAgbGV0IG9mZnNldFdpZHRoID0gdHJpYWRUZXh0LmJvdW5kcy53aWR0aCBcclxuICAgICAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaSAtIDFdLmJvdW5kcy53aWR0aCAvIDIgXHJcbiAgICAgICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIEFkZCBvZmZzZXQgd2lkdGggdG8gcHJpb3Igb2Zmc2V0LiBcclxuICAgICAgICAgICAgICAgIHhPZmZzZXRzW2ldID0geE9mZnNldHNbaSAtIDFdICsgb2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFNldCBwb2ludCBmb3IgZWFjaCBnbHlwaCBhbmQgcm90YXRlIGdseXBoIGFvcnVuZCB0aGUgcG9pbnRcclxuICAgICAgICAgICAgbGV0IHBhdGhMZW5ndGggPSBwYXRoLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VudGVyT2ZmcyA9IHhPZmZzZXRzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGhMZW5ndGggPCBjZW50ZXJPZmZzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyT2ZmcyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjZW50ZXJPZmZzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbHlwaFBhaXJzW2ldLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGF0aFBvaW50ID0gcGF0aC5nZXRQb2ludEF0KGNlbnRlck9mZnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdseXBoUGFpcnNbaV0ucG9zaXRpb24gPSBwYXRoUG9pbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhbiA9IHBhdGguZ2V0VGFuZ2VudEF0KGNlbnRlck9mZnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRhbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbHlwaFBhaXJzW2ldLnJvdGF0ZSh0YW4uYW5nbGUsIHBhdGhQb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ291bGQgbm90IGdldCB0YW5nZW50IGF0IFwiLCBjZW50ZXJPZmZzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgXHJcbiAgICAvLyBjcmVhdGUgYSBQb2ludFRleHQgb2JqZWN0IGZvciBhIHN0cmluZyBhbmQgYSBzdHlsZVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQb2ludFRleHQgKHRleHQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICB2YXIgcG9pbnRUZXh0ID0gbmV3IHBhcGVyLlBvaW50VGV4dCgpO1xyXG4gICAgICAgIHBvaW50VGV4dC5jb250ZW50ID0gdGV4dDtcclxuICAgICAgICBwb2ludFRleHQuanVzdGlmaWNhdGlvbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgbGV0IHN0eWxlID0gdGhpcy5zdHlsZTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoc3R5bGUpIHtcclxuICAgICAgICAgICAgaWYgKHN0eWxlLmZvbnRGYW1pbHkpIHBvaW50VGV4dC5mb250RmFtaWx5ID0gc3R5bGUuZm9udEZhbWlseTtcclxuICAgICAgICAgICAgaWYgKHN0eWxlLmZvbnRTaXplKSBwb2ludFRleHQuZm9udFNpemUgPSBzdHlsZS5mb250U2l6ZTtcclxuICAgICAgICAgICAgaWYgKHN0eWxlLmZvbnRXaWVnaHQpIHBvaW50VGV4dC5mb250V2VpZ2h0ID0gc3R5bGUuZm9udFdlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHJlY3QgPSBwYXBlci5QYXRoLlJlY3RhbmdsZShwb2ludFRleHQuYm91bmRzKTtcclxuICAgICAgICByZWN0LmZpbGxDb2xvciA9ICdsaWdodGdyYXknO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBncm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIGdyb3VwLnN0eWxlID0gc3R5bGU7XHJcbiAgICAgICAgZ3JvdXAuYWRkQ2hpbGQocG9pbnRUZXh0KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChncm91cCk7XHJcbiAgICAgICAgcmV0dXJuIGdyb3VwO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcblxyXG4iLCJcclxuY2xhc3MgUGF0aFRyYW5zZm9ybSB7XHJcbiAgICBwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludFRyYW5zZm9ybSA9IHBvaW50VHJhbnNmb3JtO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludFRyYW5zZm9ybShwb2ludCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aEl0ZW0ocGF0aDogcGFwZXIuUGF0aEl0ZW0pIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1Db21wb3VuZFBhdGgocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aChwYXRoOiBwYXBlci5QYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiBwYXRoLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBvcmlnUG9pbnQgPSBzZWdtZW50LnBvaW50O1xyXG4gICAgICAgICAgICBsZXQgbmV3UG9pbnQgPSB0aGlzLnRyYW5zZm9ybVBvaW50KHNlZ21lbnQucG9pbnQpO1xyXG4gICAgICAgICAgICBvcmlnUG9pbnQueCA9IG5ld1BvaW50Lng7XHJcbiAgICAgICAgICAgIG9yaWdQb2ludC55ID0gbmV3UG9pbnQueTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuIiwiXHJcbmNsYXNzIFNlZ21lbnRIYW5kbGUgZXh0ZW5kcyBwYXBlci5TaGFwZSB7XHJcbiBcclxuICAgIHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XHJcbiAgICBvbkNoYW5nZUNvbXBsZXRlOiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfc21vb3RoZWQ6IGJvb2xlYW47XHJcbiBcclxuICAgIGNvbnN0cnVjdG9yKHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQsIHJhZGl1cz86IG51bWJlcil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNlZ21lbnQgPSBzZWdtZW50O1xyXG5cclxuICAgICAgICBsZXQgc2VsZiA9IDxhbnk+dGhpcztcclxuICAgICAgICBzZWxmLl90eXBlID0gJ2NpcmNsZSc7XHJcbiAgICAgICAgc2VsZi5fcmFkaXVzID0gNztcclxuICAgICAgICBzZWxmLl9zaXplID0gbmV3IHBhcGVyLlNpemUoc2VsZi5fcmFkaXVzICogMik7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGUoc2VnbWVudC5wb2ludCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDI7XHJcbiAgICAgICAgdGhpcy5zdHJva2VDb2xvciA9ICdibHVlJztcclxuICAgICAgICB0aGlzLmZpbGxDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gMC41OyBcclxuXHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0gPE1vdXNlQmVoYXZpb3I+e1xyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3UG9zID0gdGhpcy5wb3NpdGlvbi5hZGQoZXZlbnQuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ld1BvcztcclxuICAgICAgICAgICAgICAgIHNlZ21lbnQucG9pbnQgPSBuZXdQb3M7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ0VuZDogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc21vb3RoZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMub25DaGFuZ2VDb21wbGV0ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5nZUNvbXBsZXRlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25DbGljazogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zbW9vdGhlZCA9ICF0aGlzLnNtb290aGVkO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkNoYW5nZUNvbXBsZXRlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbmdlQ29tcGxldGUoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgc21vb3RoZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Ntb290aGVkO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXQgc21vb3RoZWQodmFsdWU6IGJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuX3Ntb290aGVkID0gdmFsdWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodmFsdWUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3Ntb290aGluZycpO1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50LmhhbmRsZU91dCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoeVBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcbiAgICBzb3VyY2VQYXRoOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBkaXNwbGF5UGF0aDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgY29ybmVyczogcGFwZXIuU2VnbWVudFtdO1xyXG4gICAgb3V0bGluZTogcGFwZXIuUGF0aDtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3IgcmVidWlsZGluZyB0aGUgbWlkcG9pbnQgaGFuZGxlc1xyXG4gICAgICogYXMgb3V0bGluZSBjaGFuZ2VzLlxyXG4gICAgICovXHJcbiAgICBtaWRwb2ludEdyb3VwOiBwYXBlci5Hcm91cDtcclxuICAgIHNlZ21lbnRHcm91cDogcGFwZXIuR3JvdXA7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc291cmNlUGF0aDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXRoID0gc291cmNlUGF0aDtcclxuICAgICAgICB0aGlzLnNvdXJjZVBhdGgudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZU91dGxpbmUoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVNlZ21lbnRNYXJrZXJzKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNaWRwaW9udE1hcmtlcnMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0ge1xyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBldmVudCA9PiB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQoZXZlbnQuZGVsdGEpLFxyXG4gICAgICAgICAgICBvbk92ZXJTdGFydDogKCkgPT4gdGhpcy5zZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KHRydWUpLFxyXG4gICAgICAgICAgICBvbk92ZXJFbmQ6ICgpID0+IHRoaXMuc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eShmYWxzZSlcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eShmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eSh2YWx1ZTogYm9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5zZWdtZW50R3JvdXAudmlzaWJsZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubWlkcG9pbnRHcm91cC52aXNpYmxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lLnN0cm9rZUNvbG9yID0gdmFsdWUgPyAnbGlnaHRncmF5JyA6IG51bGw7IFxyXG4gICAgfVxyXG5cclxuICAgIGFycmFuZ2VDb250ZW50cygpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1pZHBpb250TWFya2VycygpO1xyXG4gICAgICAgIHRoaXMuYXJyYW5nZVBhdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBhcnJhbmdlUGF0aCgpIHtcclxuICAgICAgICBsZXQgb3J0aE9yaWdpbiA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMudG9wTGVmdDtcclxuICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy53aWR0aDtcclxuICAgICAgICBsZXQgb3J0aEhlaWdodCA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBzaWRlcyA9IHRoaXMuZ2V0T3V0bGluZVNpZGVzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHRvcCA9IHNpZGVzWzBdO1xyXG4gICAgICAgIGxldCBib3R0b20gPSBzaWRlc1syXTtcclxuICAgICAgICBib3R0b20ucmV2ZXJzZSgpO1xyXG4gICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLnNhbmR3aWNoUGF0aFByb2plY3Rpb24odG9wLCBib3R0b20pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vbGV0IHByb2plY3Rpb24gPSBQYXBlckhlbHBlcnMuYm91bmRzUGF0aFByb2plY3Rpb24oc2lkZXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB0cmFuc2Zvcm0gPSBuZXcgUGF0aFRyYW5zZm9ybShwb2ludCA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KG9ydGhPcmlnaW4pO1xyXG4gICAgICAgICAgICBsZXQgdW5pdCA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gb3J0aEhlaWdodCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0ZWQgPSBwcm9qZWN0aW9uKHVuaXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IobGV0IHNpZGUgb2Ygc2lkZXMpe1xyXG4gICAgICAgICAgICBzaWRlLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBsZXQgbmV3UGF0aCA9IDxwYXBlci5Db21wb3VuZFBhdGg+dGhpcy5zb3VyY2VQYXRoLmNsb25lKCk7XHJcbiAgICAgICAgbmV3UGF0aC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBuZXdQYXRoLmZpbGxDb2xvciA9ICcjN0Q1OTY1JztcclxuXHJcbiAgICAgICAgdHJhbnNmb3JtLnRyYW5zZm9ybVBhdGhJdGVtKG5ld1BhdGgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXNwbGF5UGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlQYXRoLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5UGF0aCA9IG5ld1BhdGg7XHJcbiAgICAgICAgdGhpcy5pbnNlcnRDaGlsZCgxLCBuZXdQYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE91dGxpbmVTaWRlcygpOiBwYXBlci5QYXRoW10ge1xyXG4gICAgICAgIGxldCBzaWRlczogcGFwZXIuUGF0aFtdID0gW107XHJcbiAgICAgICAgbGV0IHNlZ21lbnRHcm91cDogcGFwZXIuU2VnbWVudFtdID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNvcm5lclBvaW50cyA9IHRoaXMuY29ybmVycy5tYXAoYyA9PiBjLnBvaW50KTtcclxuICAgICAgICBsZXQgZmlyc3QgPSBjb3JuZXJQb2ludHMuc2hpZnQoKTsgXHJcbiAgICAgICAgY29ybmVyUG9pbnRzLnB1c2goZmlyc3QpO1xyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0Q29ybmVyID0gY29ybmVyUG9pbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgbGV0IHNlZ21lbnRMaXN0ID0gdGhpcy5vdXRsaW5lLnNlZ21lbnRzLm1hcCh4ID0+IHgpO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBzZWdtZW50TGlzdC5wdXNoKHNlZ21lbnRMaXN0WzBdKTtcclxuICAgICAgICBmb3IobGV0IHNlZ21lbnQgb2Ygc2VnbWVudExpc3Qpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgc2VnbWVudEdyb3VwLnB1c2goc2VnbWVudCk7XHJcbiAgICBcclxuICAgICAgICAgICAgaWYodGFyZ2V0Q29ybmVyLmlzQ2xvc2Uoc2VnbWVudC5wb2ludCwgcGFwZXIuTnVtZXJpY2FsLkVQU0lMT04pKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmaW5pc2ggcGF0aFxyXG4gICAgICAgICAgICAgICAgc2lkZXMucHVzaChuZXcgcGFwZXIuUGF0aChzZWdtZW50R3JvdXApKTtcclxuICAgICAgICAgICAgICAgIHNlZ21lbnRHcm91cCA9IFtzZWdtZW50XTtcclxuICAgICAgICAgICAgICAgIHRhcmdldENvcm5lciA9IGNvcm5lclBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZihzaWRlcy5sZW5ndGggIT09IDQpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdzaWRlcycsIHNpZGVzKTtcclxuICAgICAgICAgICAgdGhyb3cgJ2ZhaWxlZCB0byBnZXQgc2lkZXMnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc2lkZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgY3JlYXRlT3V0bGluZSgpIHtcclxuICAgICAgICBsZXQgYm91bmRzID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcztcclxuICAgICAgICBsZXQgb3V0bGluZSA9IG5ldyBwYXBlci5QYXRoKFxyXG4gICAgICAgICAgICBQYXBlckhlbHBlcnMuY29ybmVycyh0aGlzLnNvdXJjZVBhdGguYm91bmRzKSk7XHJcbiAgICAgICAgb3V0bGluZS5maWxsQ29sb3IgPSBuZXcgcGFwZXIuQ29sb3Iod2luZG93LmFwcC5jYW52YXNDb2xvcik7XHJcbiAgICAgICAgb3V0bGluZS5jbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgIG91dGxpbmUuZGFzaEFycmF5ID0gWzUsIDVdO1xyXG4gICAgICAgIHRoaXMub3V0bGluZSA9IG91dGxpbmU7XHJcblxyXG4gICAgICAgIC8vIHRyYWNrIGNvcm5lcnMgc28gd2Uga25vdyBob3cgdG8gYXJyYW5nZSB0aGUgdGV4dFxyXG4gICAgICAgIHRoaXMuY29ybmVycyA9IG91dGxpbmUuc2VnbWVudHMubWFwKHMgPT4gcyk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQob3V0bGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTZWdtZW50TWFya2VycygpIHtcclxuICAgICAgICBsZXQgYm91bmRzID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcztcclxuICAgICAgICB0aGlzLnNlZ21lbnRHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2YgdGhpcy5vdXRsaW5lLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGUgPSBuZXcgU2VnbWVudEhhbmRsZShzZWdtZW50KTtcclxuICAgICAgICAgICAgaGFuZGxlLm9uQ2hhbmdlQ29tcGxldGUgPSAoKSA9PiB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnRHcm91cC5hZGRDaGlsZChoYW5kbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuc2VnbWVudEdyb3VwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZU1pZHBpb250TWFya2VycygpIHtcclxuICAgICAgICBpZih0aGlzLm1pZHBvaW50R3JvdXApe1xyXG4gICAgICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWlkcG9pbnRHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIHRoaXMub3V0bGluZS5jdXJ2ZXMuZm9yRWFjaChjdXJ2ZSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHNraXAgbGVmdCBhbmQgcmlnaHQgc2lkZXNcclxuICAgICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZS5zZWdtZW50MSA9PT0gdGhpcy5jb3JuZXJzWzFdXHJcbiAgICAgICAgICAgICAgICB8fCBjdXJ2ZS5zZWdtZW50MSA9PT0gdGhpcy5jb3JuZXJzWzNdXHJcbiAgICAgICAgICAgICAgICAvLyBjdXJ2ZS5zZWdtZW50MS5wb2ludC5pc0Nsb3NlKHRoaXMuY29ybmVyc1sxXS5wb2ludCwgTnVtZXJpY2FsLkVQU0lMT04pXHJcbiAgICAgICAgICAgICAgICAvLyB8fCBjdXJ2ZS5zZWdtZW50MS5wb2ludC5pc0Nsb3NlKHRoaXMuY29ybmVyc1szXS5wb2ludCwgTnVtZXJpY2FsLkVQU0lMT04pXHJcbiAgICAgICAgICAgICAgICApe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjsgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGhhbmRsZSA9IG5ldyBDdXJ2ZVNwbGl0dGVySGFuZGxlKGN1cnZlKTtcclxuICAgICAgICAgICAgaGFuZGxlLm9uRHJhZ0VuZCA9IChuZXdTZWdtZW50LCBldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld0hhbmRsZSA9IG5ldyBTZWdtZW50SGFuZGxlKG5ld1NlZ21lbnQpO1xyXG4gICAgICAgICAgICAgICAgbmV3SGFuZGxlLm9uQ2hhbmdlQ29tcGxldGUgPSAoKSA9PiB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChuZXdIYW5kbGUpO1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLm1pZHBvaW50R3JvdXApO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoeVRleHQgZXh0ZW5kcyBTdHJldGNoeVBhdGgge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZywgZm9udDogb3BlbnR5cGUuRm9udCwgZm9udFNpemU6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBvcGVuVHlwZVBhdGggPSBmb250LmdldFBhdGgodGV4dCwgMCwgMCwgZm9udFNpemUpO1xyXG4gICAgICAgIGxldCB0ZXh0UGF0aCA9IFBhcGVySGVscGVycy5pbXBvcnRPcGVuVHlwZVBhdGgob3BlblR5cGVQYXRoKTtcclxuXHJcbiAgICAgICAgdGV4dFBhdGguZmlsbENvbG9yID0gJ3JlZCc7XHJcblxyXG4gICAgICAgIHN1cGVyKHRleHRQYXRoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IHBhcGVyLlBvaW50KHRoaXMuc3Ryb2tlQm91bmRzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cm9rZUJvdW5kcy5oZWlnaHQgLyAyKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgVGV4dFJ1bGVyIHtcclxuICAgIFxyXG4gICAgZm9udEZhbWlseTogc3RyaW5nO1xyXG4gICAgZm9udFdlaWdodDogbnVtYmVyO1xyXG4gICAgZm9udFNpemU6IG51bWJlcjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQb2ludFRleHQgKHRleHQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICB2YXIgcG9pbnRUZXh0ID0gbmV3IHBhcGVyLlBvaW50VGV4dCgpO1xyXG4gICAgICAgIHBvaW50VGV4dC5jb250ZW50ID0gdGV4dDtcclxuICAgICAgICBwb2ludFRleHQuanVzdGlmaWNhdGlvbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgaWYodGhpcy5mb250RmFtaWx5KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRGYW1pbHkgPSB0aGlzLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFdlaWdodCl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250V2VpZ2h0ID0gdGhpcy5mb250V2VpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmZvbnRTaXplKXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHBvaW50VGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUZXh0T2Zmc2V0cyh0ZXh0KXtcclxuICAgICAgICAvLyBNZWFzdXJlIGdseXBocyBpbiBwYWlycyB0byBjYXB0dXJlIHdoaXRlIHNwYWNlLlxyXG4gICAgICAgIC8vIFBhaXJzIGFyZSBjaGFyYWN0ZXJzIGkgYW5kIGkrMS5cclxuICAgICAgICB2YXIgZ2x5cGhQYWlycyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBnbHlwaFBhaXJzW2ldID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSwgaSsxKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZvciBlYWNoIGNoYXJhY3RlciwgZmluZCBjZW50ZXIgb2Zmc2V0LlxyXG4gICAgICAgIHZhciB4T2Zmc2V0cyA9IFswXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIE1lYXN1cmUgdGhyZWUgY2hhcmFjdGVycyBhdCBhIHRpbWUgdG8gZ2V0IHRoZSBhcHByb3ByaWF0ZSBcclxuICAgICAgICAgICAgLy8gICBzcGFjZSBiZWZvcmUgYW5kIGFmdGVyIHRoZSBnbHlwaC5cclxuICAgICAgICAgICAgdmFyIHRyaWFkVGV4dCA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGkgLSAxLCBpICsgMSkpO1xyXG4gICAgICAgICAgICB0cmlhZFRleHQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCBvdXQgaGFsZiBvZiBwcmlvciBnbHlwaCBwYWlyIFxyXG4gICAgICAgICAgICAvLyAgIGFuZCBoYWxmIG9mIGN1cnJlbnQgZ2x5cGggcGFpci5cclxuICAgICAgICAgICAgLy8gTXVzdCBiZSByaWdodCwgYmVjYXVzZSBpdCB3b3Jrcy5cclxuICAgICAgICAgICAgbGV0IG9mZnNldFdpZHRoID0gdHJpYWRUZXh0LmJvdW5kcy53aWR0aCBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpIC0gMV0uYm91bmRzLndpZHRoIC8gMiBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpXS5ib3VuZHMud2lkdGggLyAyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQWRkIG9mZnNldCB3aWR0aCB0byBwcmlvciBvZmZzZXQuIFxyXG4gICAgICAgICAgICB4T2Zmc2V0c1tpXSA9IHhPZmZzZXRzW2kgLSAxXSArIG9mZnNldFdpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGdseXBoUGFpciBvZiBnbHlwaFBhaXJzKXtcclxuICAgICAgICAgICAgZ2x5cGhQYWlyLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4geE9mZnNldHM7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFZlcnRpY2FsQm91bmRzVGV4dExheW91dCB7XHJcbiAgICB0b3A6IHBhcGVyLlBhdGg7XHJcbiAgICBib3R0b206IHBhcGVyLlBhdGg7XHJcblxyXG4gICAgbGV0dGVyUmVzb2x1dGlvbiA9IDEwMDtcclxuICAgIHNtb290aFRvbGVyYW5jZSA9IDAuMjU7XHJcbiAgICBmb250U2l6ZSA9IDY0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRvcDogcGFwZXIuUGF0aCwgYm90dG9tOiBwYXBlci5QYXRoKSB7XHJcbiAgICAgICAgdGhpcy50b3AgPSB0b3A7XHJcbiAgICAgICAgdGhpcy5ib3R0b20gPSBib3R0b207XHJcbiAgICB9XHJcblxyXG4gICAgbGF5b3V0KHRleHQ6IHN0cmluZywgZm9udDogb3BlbnR5cGUuRm9udCwgb25Db21wbGV0ZT86IChpdGVtOiBwYXBlci5JdGVtKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgbGV0IGxldHRlckdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgbGV0IGxldHRlclBhdGhzID0gZm9udC5nZXRQYXRocyh0ZXh0LCAwLCAwLCB0aGlzLmZvbnRTaXplKVxyXG4gICAgICAgICAgICAubWFwKHAgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhdGggPSBQYXBlckhlbHBlcnMuaW1wb3J0T3BlblR5cGVQYXRoKHApO1xyXG4gICAgICAgICAgICAgICAgbGV0dGVyR3JvdXAuYWRkQ2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBvcnRoT3JpZ2luID0gbGV0dGVyR3JvdXAuYm91bmRzLnRvcExlZnQ7XHJcbiAgICAgICAgbGV0IG9ydGhXaWR0aCA9IGxldHRlckdyb3VwLmJvdW5kcy53aWR0aDtcclxuICAgICAgICBsZXQgb3J0aEhlaWdodCA9IGxldHRlckdyb3VwLmJvdW5kcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLnNhbmR3aWNoUGF0aFByb2plY3Rpb24odGhpcy50b3AsIHRoaXMuYm90dG9tKTtcclxuICAgICAgICBsZXQgdHJhbnNmb3JtID0gbmV3IFBhdGhUcmFuc2Zvcm0ocG9pbnQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChvcnRoT3JpZ2luKTtcclxuICAgICAgICAgICAgbGV0IHVuaXQgPSBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS54IC8gb3J0aFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIG9ydGhIZWlnaHQpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdGVkID0gcHJvamVjdGlvbih1bml0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb2plY3RlZDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGZpbmFsR3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICBmb3IgKGxldCBsZXR0ZXJQYXRoIG9mIGxldHRlclBhdGhzKSB7XHJcbiAgICAgICAgICAgIGxldCBsZXR0ZXJPdXRsaW5lID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEl0ZW0oXHJcbiAgICAgICAgICAgICAgICBsZXR0ZXJQYXRoLCB0aGlzLmxldHRlclJlc29sdXRpb24pO1xyXG4gICAgICAgICAgICBsZXR0ZXJQYXRoLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgdHJhbnNmb3JtLnRyYW5zZm9ybVBhdGhJdGVtKGxldHRlck91dGxpbmUpO1xyXG4gICAgICAgICAgICBQYXBlckhlbHBlcnMuc2ltcGxpZnkobGV0dGVyT3V0bGluZSwgdGhpcy5zbW9vdGhUb2xlcmFuY2UpO1xyXG4gICAgICAgICAgICBmaW5hbEdyb3VwLmFkZENoaWxkKGxldHRlck91dGxpbmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXR0ZXJHcm91cC5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgb25Db21wbGV0ZShmaW5hbEdyb3VwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=