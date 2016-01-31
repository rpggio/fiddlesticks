// <reference path="typings/paper.d.ts" />
// WORK IN PROGRESS
var DragTool = (function () {
    function DragTool(paperScope) {
        var _this = this;
        this.values = {
            paths: 50,
            minPoints: 5,
            maxPoints: 15,
            minRadius: 30,
            maxRadius: 90
        };
        this.hitOptions = {
            segments: true,
            stroke: true,
            fill: true,
            tolerance: 5
        };
        this.movePath = false;
        this.paperScope = paperScope;
        var tool = new paper.Tool();
        tool.onMouseDown = function (event) { return _this.onMouseDown(event); };
        tool.onMouseMove = function (event) { return _this.onMouseMove(event); };
        tool.onMouseDrag = function (event) { return _this.onMouseDrag(event); };
    }
    DragTool.prototype.onMouseDown = function (event) {
        this.segment = this.path = null;
        var hitResult = this.paperScope.project.hitTest(event.point, this.hitOptions);
        if (!hitResult)
            return;
        if (event.modifiers.shift) {
            if (hitResult.type == 'segment') {
                hitResult.segment.remove();
            }
            ;
            return;
        }
        if (hitResult) {
            this.path = hitResult.item;
            if (hitResult.type == 'segment') {
                this.segment = hitResult.segment;
            }
            else if (hitResult.type == 'stroke') {
                var location = hitResult.location;
                this.segment = this.path.insert(location.index + 1, event.point);
                this.path.smooth();
            }
        }
        this.movePath = hitResult.type == 'fill';
        if (this.movePath)
            this.paperScope.project.activeLayer.addChild(hitResult.item);
    };
    DragTool.prototype.onMouseMove = function (event) {
        this.paperScope.project.activeLayer.selected = false;
        if (event.item)
            event.item.selected = true;
    };
    DragTool.prototype.onMouseDrag = function (event) {
        if (this.segment) {
            this.segment.point += event.delta;
            this.path.smooth();
        }
        else if (this.path) {
            this.path.position += event.delta;
        }
    };
    return DragTool;
})();
// <reference path="typings/paper.d.ts" />
var ExplodedWord = (function () {
    function ExplodedWord(text, fontUrl, onReady) {
        var _this = this;
        this.fontUrl = fontUrl;
        var loader = new FontLoader(fontUrl, function (font) {
            _this.font = font;
            _this.createChars();
            onReady.call(_this);
        });
    }
    ExplodedWord.prototype.createChars = function () {
    };
    return ExplodedWord;
})();
var ExplodedChar = (function () {
    function ExplodedChar() {
    }
    return ExplodedChar;
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
var PathHelper = (function () {
    function PathHelper() {
    }
    PathHelper.tracePathItem = function (path, pointsPerPath) {
        if (path.className === 'CompoundPath') {
            return this.traceCompoundPath(path, pointsPerPath);
        }
        else {
            return this.tracePath(path, pointsPerPath);
        }
    };
    PathHelper.traceCompoundPath = function (path, pointsPerPath) {
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
    PathHelper.tracePath = function (path, numPoints) {
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
        return path;
    };
    return PathHelper;
})();
// <reference path="typings/paper.d.ts" />
var PathText = (function (_super) {
    __extends(PathText, _super);
    function PathText(path, text, style) {
        _super.call(this);
        this.path = path;
        this._text = text;
        this.style = style;
        console.log(style.fontSize);
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
        //console.log('xform', point.toString(), result.toString());
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
    PerspectiveTransform.prototype.transformPathItem = function (path) {
        if (path.className === 'CompoundPath') {
            this.transformCompoundPath(path);
        }
        else {
            this.transformPath(path);
        }
    };
    PerspectiveTransform.prototype.transformCompoundPath = function (path) {
        for (var _i = 0, _a = path.children; _i < _a.length; _i++) {
            var p = _a[_i];
            this.transformPath(p);
        }
    };
    PerspectiveTransform.prototype.transformPath = function (path) {
        for (var _i = 0, _a = path.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            var origPoint = segment.point;
            var newPoint = this.transformPoint(segment.point);
            origPoint.x = newPoint.x;
            origPoint.y = newPoint.y;
        }
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
var sampleText = "Fiddlesticks";
var AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
var Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
var Roboto500 = 'fonts/Roboto-500.ttf';
var createSVG = function (str, attrs) {
    if (attrs) {
        // Similar to SVGExport's createElement / setAttributes.
        var node = document.createElementNS('http://www.w3.org/2000/svg', str);
        for (var key in attrs)
            node.setAttribute(key, attrs[key]);
        return node;
    }
    else {
        return new window.DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + str + '</svg>', 'text/xml');
    }
};
var TextWarpController = (function () {
    function TextWarpController() {
        var _this = this;
        var lineDraw = new LineDrawTool();
        var prevPath;
        lineDraw.onPathFinished = function (path) {
            path.flatten(20);
            //this.layoutTextBaseline(sampleText, path);
            if (prevPath) {
                _this.layoutMatrixProjection(sampleText, prevPath, path);
            }
            prevPath = path;
        };
    }
    TextWarpController.prototype.marker = function (point, color) {
        var shape = paper.Shape.Circle(point, 5);
        shape.strokeColor = color;
    };
    // layoutPathProjection(text: string, bottom: paper.Path, top: paper.Path){
    //     new FontLoader(Roboto500, font => {
    //         let letterPaths = font.getPaths(sampleText, 0, 100, 200)
    //             .map(p => this.importOpenTypePath(p));
    //         let linearTextOrigin = letterPaths[0].bounds.bottomLeft; 
    //         let linearLength = letterPaths[letterPaths.length - 1].bounds.right
    //             - linearTextOrigin.x;
    //         let bottomScaling = new PathOffsetScaling(linearLength, bottom); 
    //         let topScaling = new PathOffsetScaling(linearLength, top); 
    //         for(let letterPath of letterPaths){
    //             letterPath.strokeColor = 'red';
    //             let linearOffset = letterPath.bounds.left - linearTextOrigin.x;
    //             let letterOutline = this.outlinePath(letterPath, 1000);
    //             //letterPath.remove();
    //             letterOutline.fillColor = '#07698A';
    //             // line up letter on lower left point
    //             letterOutline.position = bottomScaling.getToPointAt(linearOffset)
    //                 .add(letterOutline.bounds.center
    //                     .subtract(letterOutline.bounds.bottomLeft));
    //         }
    //     });
    // };
    TextWarpController.prototype.layoutMatrixProjection = function (text, bottom, top) {
        var _this = this;
        new FontLoader(Roboto500, function (font) {
            var letterPaths = font.getPaths(sampleText, 0, 100, 200)
                .map(function (p) { return _this.importOpenTypePath(p); });
            var linearTextOrigin = letterPaths[0].bounds.bottomLeft;
            var linearLength = letterPaths[letterPaths.length - 1].bounds.right
                - linearTextOrigin.x;
            var bottomScaling = new PathOffsetScaling(linearLength, bottom);
            var topScaling = new PathOffsetScaling(linearLength, top);
            //'#07698A'
            for (var _i = 0; _i < letterPaths.length; _i++) {
                var letterPath = letterPaths[_i];
                var linearOffset = letterPath.bounds.left - linearTextOrigin.x;
                var letterOutline = PathHelper.tracePathItem(letterPath, 400);
                letterPath.remove();
                //letterOutline.strokeColor = '#07698A';
                //letterOutline.position.y += 100;
                // line up letter on lower left point
                letterOutline.position = bottomScaling.getToPointAt(linearOffset)
                    .add(letterOutline.bounds.center
                    .subtract(letterOutline.bounds.bottomLeft));
                // get source and dest quads for mapping                                        
                var sourceQuad = Quad.fromRectangle(letterOutline.bounds);
                var destQuad = new Quad(topScaling.getToPointAt(linearOffset), topScaling.getToPointAt(linearOffset + letterOutline.bounds.width), bottomScaling.getToPointAt(linearOffset), bottomScaling.getToPointAt(linearOffset + letterOutline.bounds.width));
                // paper.Path.Line(sourceQuad.a, sourceQuad.d).strokeColor = "lightgray";
                // paper.Path.Line(sourceQuad.b, sourceQuad.c).strokeColor = "lightgray";
                // paper.Path.Line(destQuad.a, destQuad.d).strokeColor = "yellow";
                // paper.Path.Line(destQuad.b, destQuad.c).strokeColor = "yellow";
                var transform = new PerspectiveTransform(sourceQuad, destQuad);
                transform.transformPathItem(letterOutline);
            }
        });
    };
    TextWarpController.prototype.importOpenTypePath = function (openPath) {
        return new paper.CompoundPath(openPath.toPathData());
        // let path = new paper.CompoundPath(openPath.toPathData());
        // if(path.children.length === 1){
        //     return <paper.Path>path.children[0];
        // }
        // return path;
        // let svg = openPath.toSVG(4);
        // return <paper.Path>paper.project.importSVG(svg);
    };
    TextWarpController.prototype.layoutTextBaseline = function (text, layoutPath) {
        new FontLoader(AmaticUrl, function (font) {
            var letterPaths = font.getPaths(sampleText, 0, 100, 200)
                .map(function (p) { return new paper.CompoundPath(p.toPathData()); });
            var textOrigin = letterPaths[0].bounds.bottomLeft;
            var linearLength = letterPaths[letterPaths.length - 1].bounds.right
                - textOrigin.x;
            var layoutPathLength = layoutPath.length;
            var offsetScaling = layoutPathLength / linearLength;
            var idx = 0;
            for (var _i = 0; _i < letterPaths.length; _i++) {
                var letterPath = letterPaths[_i];
                letterPath.strokeColor = '#07698A';
                var letterOffset = (letterPath.bounds.left - textOrigin.x) * offsetScaling;
                var bottomLeftPrime = layoutPath.getPointAt(letterOffset);
                var bottomRightPrime = layoutPath.getPointAt(Math.min(layoutPathLength, letterOffset + letterPath.bounds.width * offsetScaling));
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
        });
    };
    TextWarpController.prototype.drawPathsDemo = function () {
        new FontLoader(Roboto100, function (font) {
            for (var _i = 0, _a = font.getPaths("Fatty Two by Four", 0, 100, 200); _i < _a.length; _i++) {
                var openPath = _a[_i];
                var paperPath = new paper.CompoundPath(openPath.toPathData());
                paperPath.strokeColor = '#07698A';
                paperPath.position.y += 50 + Math.random() * 30;
            }
            paper.project.activeLayer.scale(.5, new paper.Point(0.5, 0.5));
        });
    };
    TextWarpController.prototype.drawDemo = function () {
        var _this = this;
        new FontLoader(AmaticUrl, function (font) {
            console.log('drawing in', font);
            var offset = new paper.Point(0, 100);
            var letters = "PoughKepsie".split('');
            var prevPath;
            var intersectionGroup = new paper.Group();
            for (var _i = 0; _i < letters.length; _i++) {
                var letter = letters[_i];
                var path = _this.demoTextPath(font, letter, offset);
                if (prevPath) {
                    var intersections = path.getIntersections(prevPath);
                    for (var i = 0; i < intersections.length; i++) {
                        var intersectionPath = paper.Path.Circle({
                            center: intersections[i].point,
                            radius: 4,
                            fillColor: 'red',
                            parent: intersectionGroup
                        });
                    }
                    var intersect = path.intersect(prevPath);
                    intersect.fillColor = 'green';
                }
                offset = offset.add(new paper.Point(path.bounds.width * 0.9, (-0.5 + Math.random()) * path.bounds.height * 0.3));
                prevPath = path;
            }
            paper.project.activeLayer.scale(2, new paper.Point(0.5, 0.5));
        });
    };
    TextWarpController.prototype.demoTextPath = function (openTextFont, text, position) {
        if (!position)
            position = new paper.Point(0, 0);
        var openTextPath = openTextFont.getPath(text, 0, 100, 200);
        var paperPath = new paper.CompoundPath(openTextPath.toPathData());
        paperPath.strokeColor = '#07698A';
        paperPath.position = position.add(new paper.Point(paperPath.bounds.width / 2, paperPath.bounds.height / 2));
        return paperPath;
    };
    ;
    return TextWarpController;
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
// <reference path="typings/paper.d.ts" />
var warp = new TextWarpController();
//warp.drawDemo();
//warp.drawPathsDemo(); 
//# sourceMappingURL=app.js.map