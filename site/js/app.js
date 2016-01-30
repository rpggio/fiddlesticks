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
        this.currentPath = new paper.Path({ strokeColor: 'gray', strokeWidth: 3 });
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
var sampleText = "Yellow world";
var AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
var Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
var TextWarpController = (function () {
    function TextWarpController() {
        var _this = this;
        var lineDraw = new LineDrawTool();
        lineDraw.onPathFinished = function (path) {
            path.flatten(20);
            _this.layoutTextBaseline(sampleText, path);
        };
    }
    TextWarpController.prototype.marker = function (point, color) {
        var shape = paper.Shape.Circle(point, 5);
        shape.strokeColor = color;
    };
    TextWarpController.prototype.layoutTextBaseline = function (text, layoutPath) {
        new FontLoader(Roboto100, function (font) {
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
                // this.marker(bottomLeftPrime, "green");
                // this.marker(bottomRightPrime, "blue");
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
            // var offset = new paper.Point(0, 150);
            // for (let letter of "Yellow World".split('')) {
            //     var openTextPath = font.getPath(letter, 0, 100, 200);
            //     var paperPath = new paper.CompoundPath(openTextPath.toPathData());
            //     paperPath.strokeColor = '#07698A';
            //     paperPath.bounds.bottomLeft = offset;
            //     offset = offset.add(
            //         new paper.Point(
            //             paperPath.bounds.width,
            //             0))
            // }
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
// <reference path="typings/paper.d.ts" />
var warp = new TextWarpController();
//warp.drawDemo();
//warp.drawPathsDemo(); 
//# sourceMappingURL=app.js.map