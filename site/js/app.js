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
// <reference path="typings/paper.d.ts" />
// <reference path="LinkedPaths.ts" />
window.textTrace = function () {
    console.log(paper);
    console.log('textTrace started');
    var ps23 = "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He leads me in paths of righteousness for his name's sake. Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me. You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows. Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the Lord forever.";
    var drawPaths = new LinkedPathGroup();
    var textSize = 64;
    var textPath = new PathText(drawPaths, ps23, { fontSize: textSize });
    var startTime = new Date();
    var currentPath;
    //---------------------------------------------
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
//# sourceMappingURL=app.js.map