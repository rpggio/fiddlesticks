$(document).ready(function () {
    window.app = new AppController();
});
var AppController = (function () {
    function AppController() {
        this.designerController = new DesignerController(this);
    }
    return AppController;
})();
var AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
var Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
var Roboto500 = 'fonts/Roboto-500.ttf';
var AquafinaScript = 'fonts/AguafinaScript-Regular/AguafinaScript-Regular.ttf';
var DesignerController = (function () {
    function DesignerController(app) {
        var _this = this;
        this.fonts = [];
        this.app = app;
        this.workspaceController = new WorkspaceController();
        // set up color pickers
        $(".color-picker").spectrum({
            showInput: true,
            allowEmpty: true,
            preferredFormat: "hex",
            showButtons: false,
            showAlpha: true,
            showPalette: true,
            showSelectionPalette: true,
            palette: [
                ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ],
            localStorageKey: "sketchtext",
        });
        window.rivets.configure({
            handler: function (target, event, binding) {
                return this.call(binding.model, event, binding.view.models);
            }
        });
        // set up rivets.js
        window.rivets.bind($('body'), this);
        // add new text block
        this.loadFont(Roboto500, function (font) {
            _this.newSketch();
            // for testing
            _this.sketch.textBlocks.push({
                _id: newid(),
                text: 'FIDDLESTICKS',
                textColor: 'gray',
                font: font
            });
            _this.sketch.onChanged();
        });
    }
    DesignerController.prototype.loadFont = function (url, onComplete) {
        var _this = this;
        new FontLoader(url, function (font) {
            _this.fonts.push(font);
            onComplete(font);
        });
    };
    DesignerController.prototype.newSketch = function () {
        this.sketch = new Sketch();
        this.workspaceController.sketch = this.sketch;
    };
    DesignerController.prototype.addText = function () {
        var text = $('#newText').val();
        if (text.trim().length) {
            var block = {
                _id: newid(),
                text: text,
                textColor: $('#textColor').val(),
                backgroundColor: $('#backgroundColor').val(),
                //no this binding????
                font: this.fonts[0]
            };
            this.sketch.textBlocks.push(block);
            this.sketch.onChanged();
        }
    };
    return DesignerController;
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
var Sketch = (function () {
    function Sketch() {
        this.textBlocks = [];
    }
    return Sketch;
})();
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Workspace = (function (_super) {
    __extends(Workspace, _super);
    function Workspace(size) {
        var _this = this;
        _super.call(this);
        var sheet = paper.Shape.Rectangle(new paper.Point(0, 0), size);
        sheet.fillColor = '#F2F1E1';
        sheet.style.shadowColor = 'gray';
        sheet.style.shadowBlur = 6;
        sheet.style.shadowOffset = new paper.Point(5, 5);
        this.sheet = sheet;
        this.addChild(sheet);
        this.mouseBehavior = {
            onClick: function (e) {
                paper.project.deselectAll();
            },
            onDragMove: function (e) { return _this.position = _this.position.add(e.delta); }
        };
    }
    return Workspace;
})(paper.Group);
var WorkspaceController = (function () {
    function WorkspaceController() {
        this.defaultSize = new paper.Size(4000, 3000);
        paper.settings.handleSize = 1;
        this.canvas = document.getElementById('mainCanvas');
        paper.setup(this.canvas);
        this.project = paper.project;
        new MouseBehaviorTool(this.project);
        var mouseZoom = new ViewZoom(this.project);
        this.workspace = new Workspace(this.defaultSize);
        var sheetBounds = this.workspace.sheet.bounds;
        mouseZoom.setZoomRange([sheetBounds.scale(0.02).size, sheetBounds.scale(1.1).size]);
        mouseZoom.zoomTo(sheetBounds.scale(0.5));
    }
    Object.defineProperty(WorkspaceController.prototype, "sketch", {
        get: function () {
            return this._sketch;
        },
        set: function (value) {
            var _this = this;
            this._sketch = value;
            if (this._sketch) {
                this._sketch.onChanged = null;
            }
            this._sketch.onChanged = function () { return _this.update(); };
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    WorkspaceController.prototype.update = function () {
        for (var _i = 0, _a = this._sketch.textBlocks; _i < _a.length; _i++) {
            var block = _a[_i];
            if (!block.item) {
                var textBlock = new StretchyText(block.text, block.font, {
                    fontSize: 128,
                    pathFillColor: block.textColor,
                    backgroundColor: block.backgroundColor
                });
                this.workspace.addChild(textBlock);
                textBlock.position = this.project.view.bounds.point.add(new paper.Point(textBlock.bounds.width / 2, textBlock.bounds.height / 2)
                    .add(50));
                block.item = textBlock;
            }
        }
    };
    return WorkspaceController;
})();
var NotifyArray = (function (_super) {
    __extends(NotifyArray, _super);
    function NotifyArray() {
        _super.apply(this, arguments);
    }
    return NotifyArray;
})(Array);
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
        self._radius = 15;
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
    function MouseBehaviorTool(project) {
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
            var hitResult = _this.project.hitTest(event.point, _this.hitOptions);
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
            var hitResult = _this.project.hitTest(event.point, _this.hitOptions);
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
        };
        this.project = project;
    }
    /**
     * Determine if container is an ancestor of item.
     */
    MouseBehaviorTool.isSameOrAncestor = function (item, container) {
        return !!PaperHelpers.findSelfOrAncestor(item, function (pa) { return pa === container; });
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
        self._radius = 15;
        self._size = new paper.Size(self._radius * 2);
        this.translate(segment.point);
        this.strokeWidth = 2;
        this.strokeColor = 'blue';
        this.fillColor = 'white';
        this.opacity = 0.7;
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
            onClick: function () {
                _this.bringToFront();
                _this.selected = true;
            },
            onDragStart: function () { return _this.bringToFront(); },
            onDragMove: function (event) {
                _this.selected = true;
                _this.position = _this.position.add(event.delta);
            },
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
            outline.fillColor = 'white';
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
    StretchyPath.OUTLINE_POINTS = 230;
    return StretchyPath;
})(paper.Group);
var StretchyText = (function (_super) {
    __extends(StretchyText, _super);
    function StretchyText(text, font, options) {
        this.options = options || {
            fontSize: 32
        };
        var openTypePath = font.getPath(text, 0, 0, this.options.fontSize);
        var textPath = PaperHelpers.importOpenTypePath(openTypePath);
        _super.call(this, textPath, options);
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
var ViewZoom = (function () {
    function ViewZoom(project) {
        var _this = this;
        this.factor = 1.25;
        this.project = project;
        var view = this.project.view;
        $(view.element).mousewheel(function (event) {
            var mousePosition = new paper.Point(event.offsetX, event.offsetY);
            _this.changeZoomCentered(event.deltaY, mousePosition);
        });
    }
    Object.defineProperty(ViewZoom.prototype, "zoom", {
        get: function () {
            return this.project.view.zoom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewZoom.prototype, "zoomRange", {
        get: function () {
            return [this._minZoom, this._maxZoom];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set zoom level.
     * @returns zoom level that was set, or null if it was not changed
     */
    ViewZoom.prototype.setZoomConstrained = function (zoom) {
        if (this._minZoom) {
            zoom = Math.max(zoom, this._minZoom);
        }
        if (this._maxZoom) {
            zoom = Math.min(zoom, this._maxZoom);
        }
        var view = this.project.view;
        if (zoom != view.zoom) {
            view.zoom = zoom;
            return zoom;
        }
        return null;
    };
    ViewZoom.prototype.setZoomRange = function (range) {
        var view = this.project.view;
        var aSize = range.shift();
        var bSize = range.shift();
        var a = aSize && Math.min(view.bounds.height / aSize.height, view.bounds.width / aSize.width);
        var b = bSize && Math.min(view.bounds.height / bSize.height, view.bounds.width / bSize.width);
        var min = Math.min(a, b);
        if (min) {
            this._minZoom = min;
        }
        var max = Math.max(a, b);
        if (max) {
            this._maxZoom = max;
        }
        return [this._minZoom, this._maxZoom];
    };
    ViewZoom.prototype.changeZoomCentered = function (deltaY, mousePos) {
        if (!deltaY) {
            return;
        }
        var view = this.project.view;
        var oldZoom = view.zoom;
        var oldCenter = view.center;
        var viewPos = view.viewToProject(mousePos);
        var newZoom = deltaY > 0
            ? view.zoom * this.factor
            : view.zoom / this.factor;
        newZoom = this.setZoomConstrained(newZoom);
        if (!newZoom) {
            return;
        }
        var zoomScale = oldZoom / newZoom;
        var centerAdjust = viewPos.subtract(oldCenter);
        var offset = viewPos.subtract(centerAdjust.multiply(zoomScale))
            .subtract(oldCenter);
        view.center = view.center.add(offset);
    };
    ;
    ViewZoom.prototype.zoomTo = function (rect) {
        var view = this.project.view;
        view.center = rect.center;
        view.zoom = Math.min(view.bounds.height / rect.height, view.bounds.width / rect.width) * 0.95;
    };
    return ViewZoom;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyIsIi4uLy4uL3NyYy9hcHAvQXBwQ29udHJvbGxlci50cyIsIi4uLy4uL3NyYy9hcHAvRGVzaWduZXJDb250cm9sbGVyLnRzIiwiLi4vLi4vc3JjL2FwcC9Gb250TG9hZGVyLnRzIiwiLi4vLi4vc3JjL2FwcC9IZWxwZXJzLnRzIiwiLi4vLi4vc3JjL2FwcC9Ta2V0Y2gudHMiLCIuLi8uLi9zcmMvYXBwL1RleHRCbG9jay50cyIsIi4uLy4uL3NyYy9hcHAvV29ya3NwYWNlLnRzIiwiLi4vLi4vc3JjL2FwcC9Xb3Jrc3BhY2VDb250cm9sbGVyLnRzIiwiLi4vLi4vc3JjL2NvcmUvTm90aWZ5QXJyYXkudHMiLCIuLi8uLi9zcmMvbWF0aC9QZXJzcGVjdGl2ZVRyYW5zZm9ybS50cyIsIi4uLy4uL3NyYy9wYXBlci9DdXJ2ZVNwbGl0dGVySGFuZGxlLnRzIiwiLi4vLi4vc3JjL3BhcGVyL01vdXNlQmVoYXZpb3JUb29sLnRzIiwiLi4vLi4vc3JjL3BhcGVyL1BhcGVySGVscGVycy50cyIsIi4uLy4uL3NyYy9wYXBlci9QYXRoU2VjdGlvbi50cyIsIi4uLy4uL3NyYy9wYXBlci9QYXRoVHJhbnNmb3JtLnRzIiwiLi4vLi4vc3JjL3BhcGVyL1NlZ21lbnRIYW5kbGUudHMiLCIuLi8uLi9zcmMvcGFwZXIvU3RyZXRjaHlQYXRoLnRzIiwiLi4vLi4vc3JjL3BhcGVyL1N0cmV0Y2h5VGV4dC50cyIsIi4uLy4uL3NyYy9wYXBlci9UZXh0UnVsZXIudHMiLCIuLi8uLi9zcmMvcGFwZXIvVmlld1pvb20udHMiXSwibmFtZXMiOlsiQXBwQ29udHJvbGxlciIsIkFwcENvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJEZXNpZ25lckNvbnRyb2xsZXIiLCJEZXNpZ25lckNvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJEZXNpZ25lckNvbnRyb2xsZXIubG9hZEZvbnQiLCJEZXNpZ25lckNvbnRyb2xsZXIubmV3U2tldGNoIiwiRGVzaWduZXJDb250cm9sbGVyLmFkZFRleHQiLCJGb250TG9hZGVyIiwiRm9udExvYWRlci5jb25zdHJ1Y3RvciIsIm5ld2lkIiwiU2tldGNoIiwiU2tldGNoLmNvbnN0cnVjdG9yIiwiV29ya3NwYWNlIiwiV29ya3NwYWNlLmNvbnN0cnVjdG9yIiwiV29ya3NwYWNlQ29udHJvbGxlciIsIldvcmtzcGFjZUNvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJXb3Jrc3BhY2VDb250cm9sbGVyLnNrZXRjaCIsIldvcmtzcGFjZUNvbnRyb2xsZXIudXBkYXRlIiwiTm90aWZ5QXJyYXkiLCJOb3RpZnlBcnJheS5jb25zdHJ1Y3RvciIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtIiwiUGVyc3BlY3RpdmVUcmFuc2Zvcm0uY29uc3RydWN0b3IiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludCIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtLmNyZWF0ZU1hdHJpeCIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtLm11bHRpcGx5IiwiUXVhZCIsIlF1YWQuY29uc3RydWN0b3IiLCJRdWFkLmZyb21SZWN0YW5nbGUiLCJRdWFkLmZyb21Db29yZHMiLCJRdWFkLmFzQ29vcmRzIiwiQ3VydmVTcGxpdHRlckhhbmRsZSIsIkN1cnZlU3BsaXR0ZXJIYW5kbGUuY29uc3RydWN0b3IiLCJNb3VzZUJlaGF2aW9yVG9vbCIsIk1vdXNlQmVoYXZpb3JUb29sLmNvbnN0cnVjdG9yIiwiTW91c2VCZWhhdmlvclRvb2wuaXNTYW1lT3JBbmNlc3RvciIsIk1vdXNlQmVoYXZpb3JUb29sLmZpbmREcmFnSGFuZGxlciIsIk1vdXNlQmVoYXZpb3JUb29sLmZpbmRPdmVySGFuZGxlciIsIlBhcGVySGVscGVycyIsIlBhcGVySGVscGVycy5jb25zdHJ1Y3RvciIsIlBhcGVySGVscGVycy5pbXBvcnRPcGVuVHlwZVBhdGgiLCJQYXBlckhlbHBlcnMudHJhY2VQYXRoSXRlbSIsIlBhcGVySGVscGVycy50cmFjZUNvbXBvdW5kUGF0aCIsIlBhcGVySGVscGVycy50cmFjZVBhdGgiLCJQYXBlckhlbHBlcnMuc2FuZHdpY2hQYXRoUHJvamVjdGlvbiIsIlBhcGVySGVscGVycy5yZXNldE1hcmtlcnMiLCJQYXBlckhlbHBlcnMubWFya2VyTGluZSIsIlBhcGVySGVscGVycy5tYXJrZXIiLCJQYXBlckhlbHBlcnMuc2ltcGxpZnkiLCJQYXBlckhlbHBlcnMuZmluZFNlbGZPckFuY2VzdG9yIiwiUGFwZXJIZWxwZXJzLmZpbmRBbmNlc3RvciIsIlBhcGVySGVscGVycy5jb3JuZXJzIiwiUGF0aFNlY3Rpb24iLCJQYXRoU2VjdGlvbi5jb25zdHJ1Y3RvciIsIlBhdGhTZWN0aW9uLmdldFBvaW50QXQiLCJQYXRoVHJhbnNmb3JtIiwiUGF0aFRyYW5zZm9ybS5jb25zdHJ1Y3RvciIsIlBhdGhUcmFuc2Zvcm0udHJhbnNmb3JtUG9pbnQiLCJQYXRoVHJhbnNmb3JtLnRyYW5zZm9ybVBhdGhJdGVtIiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1Db21wb3VuZFBhdGgiLCJQYXRoVHJhbnNmb3JtLnRyYW5zZm9ybVBhdGgiLCJTZWdtZW50SGFuZGxlIiwiU2VnbWVudEhhbmRsZS5jb25zdHJ1Y3RvciIsIlNlZ21lbnRIYW5kbGUuc21vb3RoZWQiLCJTdHJldGNoeVBhdGgiLCJTdHJldGNoeVBhdGguY29uc3RydWN0b3IiLCJTdHJldGNoeVBhdGguc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eSIsIlN0cmV0Y2h5UGF0aC5hcnJhbmdlQ29udGVudHMiLCJTdHJldGNoeVBhdGguYXJyYW5nZVBhdGgiLCJTdHJldGNoeVBhdGguZ2V0T3V0bGluZVNpZGVzIiwiU3RyZXRjaHlQYXRoLmNyZWF0ZU91dGxpbmUiLCJTdHJldGNoeVBhdGguY3JlYXRlU2VnbWVudE1hcmtlcnMiLCJTdHJldGNoeVBhdGgudXBkYXRlTWlkcGlvbnRNYXJrZXJzIiwiU3RyZXRjaHlUZXh0IiwiU3RyZXRjaHlUZXh0LmNvbnN0cnVjdG9yIiwiVGV4dFJ1bGVyIiwiVGV4dFJ1bGVyLmNvbnN0cnVjdG9yIiwiVGV4dFJ1bGVyLmNyZWF0ZVBvaW50VGV4dCIsIlRleHRSdWxlci5nZXRUZXh0T2Zmc2V0cyIsIlZpZXdab29tIiwiVmlld1pvb20uY29uc3RydWN0b3IiLCJWaWV3Wm9vbS56b29tIiwiVmlld1pvb20uem9vbVJhbmdlIiwiVmlld1pvb20uc2V0Wm9vbUNvbnN0cmFpbmVkIiwiVmlld1pvb20uc2V0Wm9vbVJhbmdlIiwiVmlld1pvb20uY2hhbmdlWm9vbUNlbnRlcmVkIiwiVmlld1pvb20uem9vbVRvIl0sIm1hcHBpbmdzIjoiQUFNQSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBS2QsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO0FBRXJDLENBQUMsQ0FBQyxDQUFDO0FDWkg7SUFJSUE7UUFFSUMsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxHQUFHQSxJQUFJQSxrQkFBa0JBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBRTNEQSxDQUFDQTtJQUNMRCxvQkFBQ0E7QUFBREEsQ0FBQ0EsQUFURCxJQVNDO0FDVEQsSUFBTSxTQUFTLEdBQUcsd0ZBQXdGLENBQUM7QUFDM0csSUFBTSxTQUFTLEdBQUcsa0VBQWtFLENBQUM7QUFDckYsSUFBTSxTQUFTLEdBQUcsc0JBQXNCLENBQUM7QUFDekMsSUFBTSxjQUFjLEdBQUcseURBQXlELENBQUE7QUFFaEY7SUFPSUUsNEJBQVlBLEdBQWtCQTtRQVBsQ0MsaUJBeUZDQTtRQXRGR0EsVUFBS0EsR0FBb0JBLEVBQUVBLENBQUNBO1FBS3hCQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUVmQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEdBQUdBLElBQUlBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7UUFFckRBLHVCQUF1QkE7UUFDakJBLENBQUNBLENBQUNBLGVBQWVBLENBQUVBLENBQUNBLFFBQVFBLENBQUNBO1lBQy9CQSxTQUFTQSxFQUFFQSxJQUFJQTtZQUNmQSxVQUFVQSxFQUFFQSxJQUFJQTtZQUNoQkEsZUFBZUEsRUFBRUEsS0FBS0E7WUFDdEJBLFdBQVdBLEVBQUVBLEtBQUtBO1lBQ2xCQSxTQUFTQSxFQUFFQSxJQUFJQTtZQUNmQSxXQUFXQSxFQUFFQSxJQUFJQTtZQUNqQkEsb0JBQW9CQSxFQUFFQSxJQUFJQTtZQUMxQkEsT0FBT0EsRUFBRUE7Z0JBQ0xBLENBQUNBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLFNBQVNBLEVBQUVBLE1BQU1BLENBQUNBO2dCQUNuRUEsQ0FBQ0EsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsQ0FBQ0E7Z0JBQ2hFQSxDQUFDQSxTQUFTQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxDQUFDQTtnQkFDeEZBLENBQUNBLFNBQVNBLEVBQUVBLFNBQVNBLEVBQUVBLFNBQVNBLEVBQUVBLFNBQVNBLEVBQUVBLFNBQVNBLEVBQUVBLFNBQVNBLEVBQUVBLFNBQVNBLEVBQUVBLFNBQVNBLENBQUNBO2dCQUN4RkEsQ0FBQ0EsU0FBU0EsRUFBRUEsU0FBU0EsRUFBRUEsU0FBU0EsRUFBRUEsU0FBU0EsRUFBRUEsU0FBU0EsRUFBRUEsU0FBU0EsRUFBRUEsU0FBU0EsRUFBRUEsU0FBU0EsQ0FBQ0E7Z0JBQ3hGQSxDQUFDQSxNQUFNQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxFQUFFQSxTQUFTQSxDQUFDQTtnQkFDckZBLENBQUNBLE1BQU1BLEVBQUVBLFNBQVNBLEVBQUVBLFNBQVNBLEVBQUVBLFNBQVNBLEVBQUVBLFNBQVNBLEVBQUVBLFNBQVNBLEVBQUVBLFNBQVNBLEVBQUVBLFNBQVNBLENBQUNBO2dCQUNyRkEsQ0FBQ0EsTUFBTUEsRUFBRUEsU0FBU0EsRUFBRUEsU0FBU0EsRUFBRUEsU0FBU0EsRUFBRUEsU0FBU0EsRUFBRUEsU0FBU0EsRUFBRUEsU0FBU0EsRUFBRUEsU0FBU0EsQ0FBQ0E7YUFDeEZBO1lBQ0RBLGVBQWVBLEVBQUVBLFlBQVlBO1NBQ2hDQSxDQUFDQSxDQUFDQTtRQUVIQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQTtZQUNwQkEsT0FBT0EsRUFBRUEsVUFBU0EsTUFBTUEsRUFBRUEsS0FBS0EsRUFBRUEsT0FBT0E7Z0JBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEUsQ0FBQztTQUNKQSxDQUFDQSxDQUFDQTtRQUVIQSxtQkFBbUJBO1FBQ25CQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUVwQ0EscUJBQXFCQTtRQUNyQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsRUFBRUEsVUFBQUEsSUFBSUE7WUFDekJBLEtBQUlBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO1lBRWpCQSxjQUFjQTtZQUNkQSxLQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUNaQTtnQkFDUEEsR0FBR0EsRUFBRUEsS0FBS0EsRUFBRUE7Z0JBQ1pBLElBQUlBLEVBQUVBLGNBQWNBO2dCQUNwQkEsU0FBU0EsRUFBRUEsTUFBTUE7Z0JBQ2pCQSxJQUFJQSxFQUFFQSxJQUFJQTthQUNiQSxDQUNKQSxDQUFDQTtZQUNGQSxLQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUM1QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDUEEsQ0FBQ0E7SUFFREQscUNBQVFBLEdBQVJBLFVBQVNBLEdBQVdBLEVBQUVBLFVBQXNDQTtRQUE1REUsaUJBS0NBO1FBSkdBLElBQUlBLFVBQVVBLENBQUNBLEdBQUdBLEVBQUVBLFVBQUFBLElBQUlBO1lBQ3BCQSxLQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUN0QkEsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDckJBLENBQUNBLENBQUNBLENBQUNBO0lBQ1BBLENBQUNBO0lBRURGLHNDQUFTQSxHQUFUQTtRQUNJRyxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxNQUFNQSxFQUFFQSxDQUFDQTtRQUMzQkEsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtJQUVsREEsQ0FBQ0E7SUFFREgsb0NBQU9BLEdBQVBBO1FBQ0lJLElBQUlBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO1FBRS9CQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNyQkEsSUFBSUEsS0FBS0EsR0FBY0E7Z0JBQ25CQSxHQUFHQSxFQUFFQSxLQUFLQSxFQUFFQTtnQkFDWkEsSUFBSUEsRUFBRUEsSUFBSUE7Z0JBQ1ZBLFNBQVNBLEVBQUVBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBO2dCQUNoQ0EsZUFBZUEsRUFBRUEsQ0FBQ0EsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQTtnQkFDNUNBLHFCQUFxQkE7Z0JBQ3JCQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTthQUN0QkEsQ0FBQ0E7WUFDRkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDbkNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO1FBQzVCQSxDQUFDQTtJQUNMQSxDQUFDQTtJQUNMSix5QkFBQ0E7QUFBREEsQ0FBQ0EsQUF6RkQsSUF5RkM7QUM5RkQ7SUFJSUssb0JBQVlBLE9BQWVBLEVBQUVBLFFBQXVDQTtRQUNoRUMsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsVUFBU0EsR0FBR0EsRUFBRUEsSUFBSUE7WUFDckMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDTixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNYLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO29CQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUNBLENBQUNBO0lBQ1BBLENBQUNBO0lBQ0xELGlCQUFDQTtBQUFEQSxDQUFDQSxBQWhCRCxJQWdCQztBQ2hCRDtJQUNJRSxNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxFQUFFQSxDQUFDQSxPQUFPQSxFQUFFQSxHQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtBQUM3REEsQ0FBQ0E7QUNGRDtJQUFBQztRQUVJQyxlQUFVQSxHQUFnQkEsRUFBRUEsQ0FBQ0E7SUFLakNBLENBQUNBO0lBQURELGFBQUNBO0FBQURBLENBQUNBLEFBUEQsSUFPQzs7Ozs7O0FFUEQ7SUFBd0JFLDZCQUFXQTtJQUkvQkEsbUJBQVlBLElBQWdCQTtRQUpoQ0MsaUJBdUJDQTtRQWxCT0EsaUJBQU9BLENBQUNBO1FBRVJBLElBQUlBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLFNBQVNBLENBQzdCQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUNoQ0EsS0FBS0EsQ0FBQ0EsU0FBU0EsR0FBR0EsU0FBU0EsQ0FBQ0E7UUFDNUJBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLFdBQVdBLEdBQUdBLE1BQU1BLENBQUNBO1FBQ2pDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxVQUFVQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUMzQkEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQUE7UUFDaERBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ25CQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUVyQkEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBbUJBO1lBQ2pDQSxPQUFPQSxFQUFFQSxVQUFBQSxDQUFDQTtnQkFDTkEsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7WUFDaENBLENBQUNBO1lBQ0RBLFVBQVVBLEVBQUVBLFVBQUFBLENBQUNBLElBQUlBLE9BQUFBLEtBQUlBLENBQUNBLFFBQVFBLEdBQUdBLEtBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEVBQTFDQSxDQUEwQ0E7U0FDOURBLENBQUFBO0lBQ0xBLENBQUNBO0lBQ0xELGdCQUFDQTtBQUFEQSxDQUFDQSxBQXZCRCxFQUF3QixLQUFLLENBQUMsS0FBSyxFQXVCbEM7QUN2QkQ7SUFVSUU7UUFSQUMsZ0JBQVdBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBU3JDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxVQUFVQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUU5QkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBc0JBLFFBQVFBLENBQUNBLGNBQWNBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO1FBQ3ZFQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUN6QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFFN0JBLElBQUlBLGlCQUFpQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFFcENBLElBQUlBLFNBQVNBLEdBQUdBLElBQUlBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBQzNDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtRQUNqREEsSUFBSUEsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDOUNBLFNBQVNBLENBQUNBLFlBQVlBLENBQ2xCQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxXQUFXQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNqRUEsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDN0NBLENBQUNBO0lBRURELHNCQUFJQSx1Q0FBTUE7YUFTVkE7WUFDSUUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDeEJBLENBQUNBO2FBWERGLFVBQVdBLEtBQWFBO1lBQXhCRSxpQkFPQ0E7WUFOR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDckJBLEVBQUVBLENBQUFBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUFBLENBQUNBO2dCQUNiQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUNsQ0EsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsU0FBU0EsR0FBR0EsY0FBTUEsT0FBQUEsS0FBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsRUFBYkEsQ0FBYUEsQ0FBQ0E7WUFDN0NBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1FBQ2xCQSxDQUFDQTs7O09BQUFGO0lBTURBLG9DQUFNQSxHQUFOQTtRQUNJRyxHQUFHQSxDQUFDQSxDQUFjQSxVQUF1QkEsRUFBdkJBLEtBQUFBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLEVBQXBDQSxjQUFTQSxFQUFUQSxJQUFvQ0EsQ0FBQ0E7WUFBckNBLElBQUlBLEtBQUtBLFNBQUFBO1lBQ1ZBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUNkQSxJQUFJQSxTQUFTQSxHQUFHQSxJQUFJQSxZQUFZQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxFQUN2Q0EsS0FBS0EsQ0FBQ0EsSUFBSUEsRUFDV0E7b0JBQ2pCQSxRQUFRQSxFQUFFQSxHQUFHQTtvQkFDYkEsYUFBYUEsRUFBRUEsS0FBS0EsQ0FBQ0EsU0FBU0E7b0JBQzlCQSxlQUFlQSxFQUFFQSxLQUFLQSxDQUFDQSxlQUFlQTtpQkFDekNBLENBQUNBLENBQUNBO2dCQUNQQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtnQkFDbkNBLFNBQVNBLENBQUNBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQ25EQSxJQUFJQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxFQUFFQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtxQkFDbkVBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUVsQkEsS0FBS0EsQ0FBQ0EsSUFBSUEsR0FBR0EsU0FBU0EsQ0FBQ0E7WUFDM0JBLENBQUNBO1NBQ0pBO0lBQ0xBLENBQUNBO0lBQ0xILDBCQUFDQTtBQUFEQSxDQUFDQSxBQTNERCxJQTJEQztBQ3ZERDtJQUEwQkksK0JBQUtBO0lBQS9CQTtRQUEwQkMsOEJBQUtBO0lBRS9CQSxDQUFDQTtJQUFERCxrQkFBQ0E7QUFBREEsQ0FBQ0EsQUFGRCxFQUEwQixLQUFLLEVBRTlCO0FDSkQ7SUFPSUUsOEJBQVlBLE1BQVlBLEVBQUVBLElBQVVBO1FBQ2hDQyxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxNQUFNQSxDQUFDQTtRQUNyQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFFakJBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLG9CQUFvQkEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDbEVBLENBQUNBO0lBRURELGdGQUFnRkE7SUFDaEZBLDJFQUEyRUE7SUFDM0VBLGdGQUFnRkE7SUFDaEZBLDZDQUFjQSxHQUFkQSxVQUFlQSxLQUFrQkE7UUFDN0JFLElBQUlBLEVBQUVBLEdBQUdBLG9CQUFvQkEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDOUVBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQzNEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtJQUNsQkEsQ0FBQ0E7SUFFTUYsaUNBQVlBLEdBQW5CQSxVQUFvQkEsTUFBWUEsRUFBRUEsTUFBWUE7UUFFMUNHLElBQUlBLFlBQVlBLEdBQUdBO1lBQ2ZBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQzlCQSxJQUFJQSxZQUFZQSxHQUFHQTtZQUNmQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUU5QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsWUFBWUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDbEVBLElBQUlBLENBQUNBLEdBQUdBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzdDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDL0VBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBQzFCQSxNQUFNQSxDQUFDQTtZQUNIQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEJBLENBQUNBLEVBQUtBLENBQUNBLEVBQUVBLENBQUNBLEVBQUtBLENBQUNBO1lBQ25CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFLQSxDQUFDQTtTQUN0QkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBU0EsQ0FBQ0E7WUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzNDLENBQUMsQ0FBQ0EsQ0FBQ0E7SUFDUEEsQ0FBQ0E7SUFFREgsMkVBQTJFQTtJQUMzRUEscUNBQXFDQTtJQUNyQ0EscUNBQXFDQTtJQUNyQ0EscUNBQXFDQTtJQUNyQ0EscUNBQXFDQTtJQUM5QkEsNkJBQVFBLEdBQWZBLFVBQWdCQSxNQUFNQSxFQUFFQSxNQUFNQTtRQUMxQkksTUFBTUEsQ0FBQ0E7WUFDSEEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0ZBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUVBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQy9GQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvRkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FB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SUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDN0JBLElBQUlBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1FBQzFCQSxJQUFJQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsR0FBR0EsS0FBS0EsSUFBSUEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FDckJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBLE1BQU1BLEVBQ2pDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUNyQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsS0FBS0EsSUFBSUEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FDckJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBLE1BQU1BLEVBQ2pDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUNyQ0EsSUFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDeEJBLEVBQUVBLENBQUFBLENBQUNBLEdBQUdBLENBQUNBLENBQUFBLENBQUNBO1lBQ0pBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLEdBQUdBLENBQUNBO1FBQ3hCQSxDQUFDQTtRQUNEQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUN4QkEsRUFBRUEsQ0FBQUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7WUFDSkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFDeEJBLENBQUNBO1FBQ0RBLE1BQU1BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO0lBQzFDQSxDQUFDQTtJQUVETCxxQ0FBa0JBLEdBQWxCQSxVQUFtQkEsTUFBY0EsRUFBRUEsUUFBcUJBO1FBQ3BETSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNWQSxNQUFNQSxDQUFDQTtRQUNYQSxDQUFDQTtRQUNEQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUM3QkEsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDeEJBLElBQUlBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1FBQzVCQSxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUUzQ0EsSUFBSUEsT0FBT0EsR0FBR0EsTUFBTUEsR0FBR0EsQ0FBQ0E7Y0FDbEJBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BO2NBQ3ZCQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUM5QkEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUUzQ0EsRUFBRUEsQ0FBQUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQUEsQ0FBQ0E7WUFDVEEsTUFBTUEsQ0FBQ0E7UUFDWEEsQ0FBQ0E7UUFFREEsSUFBSUEsU0FBU0EsR0FBR0EsT0FBT0EsR0FBR0EsT0FBT0EsQ0FBQ0E7UUFDbENBLElBQUlBLFlBQVlBLEdBQUdBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO1FBQy9DQSxJQUFJQSxNQUFNQSxHQUFHQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxZQUFZQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTthQUMxREEsUUFBUUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFFekJBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO0lBQzFDQSxDQUFDQTs7SUFFRE4seUJBQU1BLEdBQU5BLFVBQU9BLElBQXFCQTtRQUN4Qk8sSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDN0JBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUNoQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFDaENBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBO0lBQy9DQSxDQUFDQTtJQUNMUCxlQUFDQTtBQUFEQSxDQUFDQSxBQXBHRCxJQW9HQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbnRlcmZhY2UgV2luZG93IHtcclxuICAgIGFwcDogQXBwQ29udHJvbGxlcjtcclxufVxyXG5cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkgeyAgXHJcbiAgIFxyXG4gICBcclxuXHJcbiAgIFxyXG4gICAgd2luZG93LmFwcCA9IG5ldyBBcHBDb250cm9sbGVyKCk7XHJcbiAgICBcclxufSk7XHJcbiIsIlxyXG5jbGFzcyBBcHBDb250cm9sbGVyIHtcclxuXHJcbiAgICBkZXNpZ25lckNvbnRyb2xsZXI6IERlc2lnbmVyQ29udHJvbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZGVzaWduZXJDb250cm9sbGVyID0gbmV3IERlc2lnbmVyQ29udHJvbGxlcih0aGlzKTtcclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG4iLCJcclxuY29uc3QgQW1hdGljVXJsID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL2FtYXRpY3NjL3Y4L0lEbmtSVFBHY3JTVm81MFV5WU5LN3kzVVNCblN2cGtvcFFhVVItMnI3aVUudHRmJztcclxuY29uc3QgUm9ib3RvMTAwID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL3JvYm90by92MTUvN015Z3FUZTJ6czlZa1AwYWRBOVFRUS50dGYnO1xyXG5jb25zdCBSb2JvdG81MDAgPSAnZm9udHMvUm9ib3RvLTUwMC50dGYnO1xyXG5jb25zdCBBcXVhZmluYVNjcmlwdCA9ICdmb250cy9BZ3VhZmluYVNjcmlwdC1SZWd1bGFyL0FndWFmaW5hU2NyaXB0LVJlZ3VsYXIudHRmJ1xyXG5cclxuY2xhc3MgRGVzaWduZXJDb250cm9sbGVyIHtcclxuXHJcbiAgICBhcHA6IEFwcENvbnRyb2xsZXI7XHJcbiAgICBmb250czogb3BlbnR5cGUuRm9udFtdID0gW107XHJcbiAgICBza2V0Y2g6IFNrZXRjaDtcclxuICAgIHdvcmtzcGFjZUNvbnRyb2xsZXI6IFdvcmtzcGFjZUNvbnRyb2xsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHBDb250cm9sbGVyKSB7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcblxyXG4gICAgICAgIHRoaXMud29ya3NwYWNlQ29udHJvbGxlciA9IG5ldyBXb3Jrc3BhY2VDb250cm9sbGVyKCk7XHJcblxyXG4gICAgICAgIC8vIHNldCB1cCBjb2xvciBwaWNrZXJzXHJcbiAgICAgICAgKDxhbnk+JChcIi5jb2xvci1waWNrZXJcIikpLnNwZWN0cnVtKHtcclxuICAgICAgICAgICAgc2hvd0lucHV0OiB0cnVlLFxyXG4gICAgICAgICAgICBhbGxvd0VtcHR5OiB0cnVlLFxyXG4gICAgICAgICAgICBwcmVmZXJyZWRGb3JtYXQ6IFwiaGV4XCIsXHJcbiAgICAgICAgICAgIHNob3dCdXR0b25zOiBmYWxzZSxcclxuICAgICAgICAgICAgc2hvd0FscGhhOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93UGFsZXR0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd1NlbGVjdGlvblBhbGV0dGU6IHRydWUsXHJcbiAgICAgICAgICAgIHBhbGV0dGU6IFtcclxuICAgICAgICAgICAgICAgIFtcIiMwMDBcIiwgXCIjNDQ0XCIsIFwiIzY2NlwiLCBcIiM5OTlcIiwgXCIjY2NjXCIsIFwiI2VlZVwiLCBcIiNmM2YzZjNcIiwgXCIjZmZmXCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiI2YwMFwiLCBcIiNmOTBcIiwgXCIjZmYwXCIsIFwiIzBmMFwiLCBcIiMwZmZcIiwgXCIjMDBmXCIsIFwiIzkwZlwiLCBcIiNmMGZcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjZjRjY2NjXCIsIFwiI2ZjZTVjZFwiLCBcIiNmZmYyY2NcIiwgXCIjZDllYWQzXCIsIFwiI2QwZTBlM1wiLCBcIiNjZmUyZjNcIiwgXCIjZDlkMmU5XCIsIFwiI2VhZDFkY1wiXSxcclxuICAgICAgICAgICAgICAgIFtcIiNlYTk5OTlcIiwgXCIjZjljYjljXCIsIFwiI2ZmZTU5OVwiLCBcIiNiNmQ3YThcIiwgXCIjYTJjNGM5XCIsIFwiIzlmYzVlOFwiLCBcIiNiNGE3ZDZcIiwgXCIjZDVhNmJkXCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiI2UwNjY2NlwiLCBcIiNmNmIyNmJcIiwgXCIjZmZkOTY2XCIsIFwiIzkzYzQ3ZFwiLCBcIiM3NmE1YWZcIiwgXCIjNmZhOGRjXCIsIFwiIzhlN2NjM1wiLCBcIiNjMjdiYTBcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjYzAwXCIsIFwiI2U2OTEzOFwiLCBcIiNmMWMyMzJcIiwgXCIjNmFhODRmXCIsIFwiIzQ1ODE4ZVwiLCBcIiMzZDg1YzZcIiwgXCIjNjc0ZWE3XCIsIFwiI2E2NGQ3OVwiXSxcclxuICAgICAgICAgICAgICAgIFtcIiM5MDBcIiwgXCIjYjQ1ZjA2XCIsIFwiI2JmOTAwMFwiLCBcIiMzODc2MWRcIiwgXCIjMTM0ZjVjXCIsIFwiIzBiNTM5NFwiLCBcIiMzNTFjNzVcIiwgXCIjNzQxYjQ3XCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiIzYwMFwiLCBcIiM3ODNmMDRcIiwgXCIjN2Y2MDAwXCIsIFwiIzI3NGUxM1wiLCBcIiMwYzM0M2RcIiwgXCIjMDczNzYzXCIsIFwiIzIwMTI0ZFwiLCBcIiM0YzExMzBcIl1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlS2V5OiBcInNrZXRjaHRleHRcIixcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93LnJpdmV0cy5jb25maWd1cmUoe1xyXG4gICAgICAgICAgICBoYW5kbGVyOiBmdW5jdGlvbih0YXJnZXQsIGV2ZW50LCBiaW5kaW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jYWxsKGJpbmRpbmcubW9kZWwsIGV2ZW50LCBiaW5kaW5nLnZpZXcubW9kZWxzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBzZXQgdXAgcml2ZXRzLmpzXHJcbiAgICAgICAgd2luZG93LnJpdmV0cy5iaW5kKCQoJ2JvZHknKSwgdGhpcyk7ICAgICAgIFxyXG5cclxuICAgICAgICAvLyBhZGQgbmV3IHRleHQgYmxvY2tcclxuICAgICAgICB0aGlzLmxvYWRGb250KFJvYm90bzUwMCwgZm9udCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubmV3U2tldGNoKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBmb3IgdGVzdGluZ1xyXG4gICAgICAgICAgICB0aGlzLnNrZXRjaC50ZXh0QmxvY2tzLnB1c2goXHJcbiAgICAgICAgICAgICAgICA8VGV4dEJsb2NrPntcclxuICAgICAgICAgICAgICAgICAgICBfaWQ6IG5ld2lkKCksXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0ZJRERMRVNUSUNLUycsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiAnZ3JheScsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udDogZm9udFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLnNrZXRjaC5vbkNoYW5nZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkRm9udCh1cmw6IHN0cmluZywgb25Db21wbGV0ZTogKGY6IG9wZW50eXBlLkZvbnQpID0+IHZvaWQpIHtcclxuICAgICAgICBuZXcgRm9udExvYWRlcih1cmwsIGZvbnQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnRzLnB1c2goZm9udCk7XHJcbiAgICAgICAgICAgIG9uQ29tcGxldGUoZm9udCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmV3U2tldGNoKCkge1xyXG4gICAgICAgIHRoaXMuc2tldGNoID0gbmV3IFNrZXRjaCgpO1xyXG4gICAgICAgIHRoaXMud29ya3NwYWNlQ29udHJvbGxlci5za2V0Y2ggPSB0aGlzLnNrZXRjaDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWRkVGV4dCgpIHtcclxuICAgICAgICBsZXQgdGV4dCA9ICQoJyNuZXdUZXh0JykudmFsKCk7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0LnRyaW0oKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbGV0IGJsb2NrID0gPFRleHRCbG9jaz57XHJcbiAgICAgICAgICAgICAgICBfaWQ6IG5ld2lkKCksXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICAgICAgdGV4dENvbG9yOiAkKCcjdGV4dENvbG9yJykudmFsKCksXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICQoJyNiYWNrZ3JvdW5kQ29sb3InKS52YWwoKSxcclxuICAgICAgICAgICAgICAgIC8vbm8gdGhpcyBiaW5kaW5nPz8/P1xyXG4gICAgICAgICAgICAgICAgZm9udDogdGhpcy5mb250c1swXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnNrZXRjaC50ZXh0QmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICB0aGlzLnNrZXRjaC5vbkNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgRm9udExvYWRlciB7XHJcblxyXG4gICAgaXNMb2FkZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udFVybDogc3RyaW5nLCBvbkxvYWRlZDogKGZvbnQ6IG9wZW50eXBlLkZvbnQpID0+IHZvaWQpIHtcclxuICAgICAgICBvcGVudHlwZS5sb2FkKGZvbnRVcmwsIGZ1bmN0aW9uKGVyciwgZm9udCkge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob25Mb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBvbkxvYWRlZC5jYWxsKHRoaXMsIGZvbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJcclxuZnVuY3Rpb24gbmV3aWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAobmV3IERhdGUoKS5nZXRUaW1lKCkrTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMzYpO1xyXG59XHJcbiIsIlxyXG5jbGFzcyBTa2V0Y2ggaW1wbGVtZW50cyBDaGFuZ2VOb3RpZmllciB7XHJcbiAgICBcclxuICAgIHRleHRCbG9ja3M6IFRleHRCbG9ja1tdID0gW107XHJcbiAgICBcclxuICAgIC8vIHRoaXMgaXMgZnJhZ2lsZTogbmVlZCByZWFsIHB1Yi1zdWJcclxuICAgIG9uQ2hhbmdlZDogKCkgPT4gdm9pZDtcclxuICAgIFxyXG59IiwiXHJcbmludGVyZmFjZSBUZXh0QmxvY2sge1xyXG4gICAgX2lkOiBzdHJpbmc7XHJcbiAgICB0ZXh0OiBzdHJpbmc7XHJcbiAgICBpdGVtOiBwYXBlci5JdGVtO1xyXG4gICAgdGV4dENvbG9yOiBzdHJpbmc7XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcclxuICAgIGZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbn0iLCJcclxuY2xhc3MgV29ya3NwYWNlIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG4gICAgXHJcbiAgICBzaGVldDogcGFwZXIuU2hhcGU7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHNpemU6IHBhcGVyLlNpemUpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNoZWV0ID0gcGFwZXIuU2hhcGUuUmVjdGFuZ2xlKFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMCwwKSwgc2l6ZSk7XHJcbiAgICAgICAgc2hlZXQuZmlsbENvbG9yID0gJyNGMkYxRTEnO1xyXG4gICAgICAgIHNoZWV0LnN0eWxlLnNoYWRvd0NvbG9yID0gJ2dyYXknOyBcclxuICAgICAgICBzaGVldC5zdHlsZS5zaGFkb3dCbHVyID0gNjtcclxuICAgICAgICBzaGVldC5zdHlsZS5zaGFkb3dPZmZzZXQgPSBuZXcgcGFwZXIuUG9pbnQoNSwgNSlcclxuICAgICAgICB0aGlzLnNoZWV0ID0gc2hlZXQ7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChzaGVldCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0gPE1vdXNlQmVoYXZpb3I+IHtcclxuICAgICAgICAgICAgb25DbGljazogZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwYXBlci5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ01vdmU6IGUgPT4gdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKGUuZGVsdGEpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFdvcmtzcGFjZUNvbnRyb2xsZXIge1xyXG5cclxuICAgIGRlZmF1bHRTaXplID0gbmV3IHBhcGVyLlNpemUoNDAwMCwgMzAwMCk7XHJcblxyXG4gICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHdvcmtzcGFjZTogV29ya3NwYWNlO1xyXG4gICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfc2tldGNoOiBTa2V0Y2g7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgcGFwZXIuc2V0dGluZ3MuaGFuZGxlU2l6ZSA9IDE7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluQ2FudmFzJyk7XHJcbiAgICAgICAgcGFwZXIuc2V0dXAodGhpcy5jYW52YXMpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdCA9IHBhcGVyLnByb2plY3Q7XHJcblxyXG4gICAgICAgIG5ldyBNb3VzZUJlaGF2aW9yVG9vbCh0aGlzLnByb2plY3QpO1xyXG5cclxuICAgICAgICBsZXQgbW91c2Vab29tID0gbmV3IFZpZXdab29tKHRoaXMucHJvamVjdCk7XHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSBuZXcgV29ya3NwYWNlKHRoaXMuZGVmYXVsdFNpemUpO1xyXG4gICAgICAgIGxldCBzaGVldEJvdW5kcyA9IHRoaXMud29ya3NwYWNlLnNoZWV0LmJvdW5kcztcclxuICAgICAgICBtb3VzZVpvb20uc2V0Wm9vbVJhbmdlKFxyXG4gICAgICAgICAgICBbc2hlZXRCb3VuZHMuc2NhbGUoMC4wMikuc2l6ZSwgc2hlZXRCb3VuZHMuc2NhbGUoMS4xKS5zaXplXSk7XHJcbiAgICAgICAgbW91c2Vab29tLnpvb21UbyhzaGVldEJvdW5kcy5zY2FsZSgwLjUpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2tldGNoKHZhbHVlOiBTa2V0Y2gpe1xyXG4gICAgICAgIHRoaXMuX3NrZXRjaCA9IHZhbHVlO1xyXG4gICAgICAgIGlmKHRoaXMuX3NrZXRjaCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3NrZXRjaC5vbkNoYW5nZWQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9za2V0Y2gub25DaGFuZ2VkID0gKCkgPT4gdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgc2tldGNoKCkgOiBTa2V0Y2gge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9za2V0Y2g7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIGZvciAobGV0IGJsb2NrIG9mIHRoaXMuX3NrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgIGlmICghYmxvY2suaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRleHRCbG9jayA9IG5ldyBTdHJldGNoeVRleHQoYmxvY2sudGV4dCxcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5mb250LFxyXG4gICAgICAgICAgICAgICAgICAgIDxTdHJldGNoeVRleHRPcHRpb25zPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyOCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aEZpbGxDb2xvcjogYmxvY2sudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGJsb2NrLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2UuYWRkQ2hpbGQodGV4dEJsb2NrKTtcclxuICAgICAgICAgICAgICAgIHRleHRCbG9jay5wb3NpdGlvbiA9IHRoaXMucHJvamVjdC52aWV3LmJvdW5kcy5wb2ludC5hZGQoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KHRleHRCbG9jay5ib3VuZHMud2lkdGggLyAyLCB0ZXh0QmxvY2suYm91bmRzLmhlaWdodCAvIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoNTApKTtcclxuXHJcbiAgICAgICAgICAgICAgICBibG9jay5pdGVtID0gdGV4dEJsb2NrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbmludGVyZmFjZSBDaGFuZ2VOb3RpZmllciB7XHJcbiAgICBcclxufVxyXG5cclxuY2xhc3MgTm90aWZ5QXJyYXkgZXh0ZW5kcyBBcnJheSBpbXBsZW1lbnRzIENoYW5nZU5vdGlmaWVyIHtcclxuICAgIG9uQ2hhbmdlZDogKCkgPT4gdm9pZDsgICAgXHJcbn1cclxuIiwiXHJcbmRlY2xhcmUgdmFyIHNvbHZlOiAoYTogYW55LCBiOiBhbnksIGZhc3Q6IGJvb2xlYW4pID0+IHZvaWQ7XHJcblxyXG5jbGFzcyBQZXJzcGVjdGl2ZVRyYW5zZm9ybSB7XHJcbiAgICBcclxuICAgIHNvdXJjZTogUXVhZDtcclxuICAgIGRlc3Q6IFF1YWQ7XHJcbiAgICBwZXJzcDogYW55O1xyXG4gICAgbWF0cml4OiBudW1iZXJbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc291cmNlOiBRdWFkLCBkZXN0OiBRdWFkKXtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLmRlc3QgPSBkZXN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0uY3JlYXRlTWF0cml4KHNvdXJjZSwgZGVzdCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEdpdmVuIGEgNHg0IHBlcnNwZWN0aXZlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCwgYW5kIGEgMkQgcG9pbnQgKGEgMngxIHZlY3RvciksXHJcbiAgICAvLyBhcHBsaWVzIHRoZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggYnkgY29udmVydGluZyB0aGUgcG9pbnQgdG8gaG9tb2dlbmVvdXNcclxuICAgIC8vIGNvb3JkaW5hdGVzIGF0IHo9MCwgcG9zdC1tdWx0aXBseWluZywgYW5kIHRoZW4gYXBwbHlpbmcgYSBwZXJzcGVjdGl2ZSBkaXZpZGUuXHJcbiAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgbGV0IHAzID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0ubXVsdGlwbHkodGhpcy5tYXRyaXgsIFtwb2ludC54LCBwb2ludC55LCAwLCAxXSk7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBwYXBlci5Qb2ludChwM1swXSAvIHAzWzNdLCBwM1sxXSAvIHAzWzNdKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgY3JlYXRlTWF0cml4KHNvdXJjZTogUXVhZCwgdGFyZ2V0OiBRdWFkKTogbnVtYmVyW10ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzb3VyY2VQb2ludHMgPSBbXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYS54LCBzb3VyY2UuYS55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYi54LCBzb3VyY2UuYi55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYy54LCBzb3VyY2UuYy55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuZC54LCBzb3VyY2UuZC55XV07XHJcbiAgICAgICAgbGV0IHRhcmdldFBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3RhcmdldC5hLngsIHRhcmdldC5hLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5iLngsIHRhcmdldC5iLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5jLngsIHRhcmdldC5jLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5kLngsIHRhcmdldC5kLnldXTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBhID0gW10sIGIgPSBbXSwgaSA9IDAsIG4gPSBzb3VyY2VQb2ludHMubGVuZ3RoOyBpIDwgbjsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBzID0gc291cmNlUG9pbnRzW2ldLCB0ID0gdGFyZ2V0UG9pbnRzW2ldO1xyXG4gICAgICAgICAgICBhLnB1c2goW3NbMF0sIHNbMV0sIDEsIDAsIDAsIDAsIC1zWzBdICogdFswXSwgLXNbMV0gKiB0WzBdXSksIGIucHVzaCh0WzBdKTtcclxuICAgICAgICAgICAgYS5wdXNoKFswLCAwLCAwLCBzWzBdLCBzWzFdLCAxLCAtc1swXSAqIHRbMV0sIC1zWzFdICogdFsxXV0pLCBiLnB1c2godFsxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgWCA9IHNvbHZlKGEsIGIsIHRydWUpOyBcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBYWzBdLCBYWzNdLCAwLCBYWzZdLFxyXG4gICAgICAgICAgICBYWzFdLCBYWzRdLCAwLCBYWzddLFxyXG4gICAgICAgICAgICAgICAwLCAgICAwLCAxLCAgICAwLFxyXG4gICAgICAgICAgICBYWzJdLCBYWzVdLCAwLCAgICAxXHJcbiAgICAgICAgXS5tYXAoZnVuY3Rpb24oeCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh4ICogMTAwMDAwKSAvIDEwMDAwMDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQb3N0LW11bHRpcGx5IGEgNHg0IG1hdHJpeCBpbiBjb2x1bW4tbWFqb3Igb3JkZXIgYnkgYSA0eDEgY29sdW1uIHZlY3RvcjpcclxuICAgIC8vIFsgbTAgbTQgbTggIG0xMiBdICAgWyB2MCBdICAgWyB4IF1cclxuICAgIC8vIFsgbTEgbTUgbTkgIG0xMyBdICogWyB2MSBdID0gWyB5IF1cclxuICAgIC8vIFsgbTIgbTYgbTEwIG0xNCBdICAgWyB2MiBdICAgWyB6IF1cclxuICAgIC8vIFsgbTMgbTcgbTExIG0xNSBdICAgWyB2MyBdICAgWyB3IF1cclxuICAgIHN0YXRpYyBtdWx0aXBseShtYXRyaXgsIHZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIG1hdHJpeFswXSAqIHZlY3RvclswXSArIG1hdHJpeFs0XSAqIHZlY3RvclsxXSArIG1hdHJpeFs4IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTJdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMV0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNV0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbOSBdICogdmVjdG9yWzJdICsgbWF0cml4WzEzXSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzJdICogdmVjdG9yWzBdICsgbWF0cml4WzZdICogdmVjdG9yWzFdICsgbWF0cml4WzEwXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNF0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFszXSAqIHZlY3RvclswXSArIG1hdHJpeFs3XSAqIHZlY3RvclsxXSArIG1hdHJpeFsxMV0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTVdICogdmVjdG9yWzNdXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUXVhZCB7XHJcbiAgICBhOiBwYXBlci5Qb2ludDtcclxuICAgIGI6IHBhcGVyLlBvaW50O1xyXG4gICAgYzogcGFwZXIuUG9pbnQ7XHJcbiAgICBkOiBwYXBlci5Qb2ludDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50LCBjOiBwYXBlci5Qb2ludCwgZDogcGFwZXIuUG9pbnQpe1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmMgPSBjO1xyXG4gICAgICAgIHRoaXMuZCA9IGQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tUmVjdGFuZ2xlKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICByZWN0LnRvcExlZnQsXHJcbiAgICAgICAgICAgIHJlY3QudG9wUmlnaHQsXHJcbiAgICAgICAgICAgIHJlY3QuYm90dG9tTGVmdCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21SaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tQ29vcmRzKGNvb3JkczogbnVtYmVyW10pIDogUXVhZCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzBdLCBjb29yZHNbMV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzJdLCBjb29yZHNbM10pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzRdLCBjb29yZHNbNV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzZdLCBjb29yZHNbN10pXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhc0Nvb3JkcygpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgdGhpcy5hLngsIHRoaXMuYS55LFxyXG4gICAgICAgICAgICB0aGlzLmIueCwgdGhpcy5iLnksXHJcbiAgICAgICAgICAgIHRoaXMuYy54LCB0aGlzLmMueSxcclxuICAgICAgICAgICAgdGhpcy5kLngsIHRoaXMuZC55XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufSIsIlxyXG4vKipcclxuICogSGFuZGxlIHRoYXQgc2l0cyBvbiBtaWRwb2ludCBvZiBjdXJ2ZVxyXG4gKiAgIHdoaWNoIHdpbGwgc3BsaXQgdGhlIGN1cnZlIHdoZW4gZHJhZ2dlZC5cclxuICovXHJcbmNsYXNzIEN1cnZlU3BsaXR0ZXJIYW5kbGUgZXh0ZW5kcyBwYXBlci5TaGFwZSB7XHJcbiBcclxuICAgIGN1cnZlOiBwYXBlci5DdXJ2ZTtcclxuICAgIG9uRHJhZ0VuZDogKG5ld1NlZ21lbnQ6IHBhcGVyLlNlZ21lbnQsIGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiBcclxuICAgIGNvbnN0cnVjdG9yKGN1cnZlOiBwYXBlci5DdXJ2ZSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJ2ZSA9IGN1cnZlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzZWxmID0gPGFueT50aGlzO1xyXG4gICAgICAgIHNlbGYuX3R5cGUgPSAnY2lyY2xlJztcclxuICAgICAgICBzZWxmLl9yYWRpdXMgPSAxNTtcclxuICAgICAgICBzZWxmLl9zaXplID0gbmV3IHBhcGVyLlNpemUoc2VsZi5fcmFkaXVzICogMik7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGUoY3VydmUuZ2V0UG9pbnRBdCgwLjUgKiBjdXJ2ZS5sZW5ndGgpKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0cm9rZVdpZHRoID0gMjtcclxuICAgICAgICB0aGlzLnN0cm9rZUNvbG9yID0gJ2JsdWUnO1xyXG4gICAgICAgIHRoaXMuZmlsbENvbG9yID0gJ3doaXRlJztcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAwLjUgKiAwLjM7IFxyXG4gXHJcbiAgICAgICAgbGV0IG5ld1NlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0gPE1vdXNlQmVoYXZpb3I+e1xyXG4gICAgICAgICAgICBvbkRyYWdTdGFydDogKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuZXdTZWdtZW50ID0gbmV3IHBhcGVyLlNlZ21lbnQodGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICBjdXJ2ZS5wYXRoLmluc2VydChcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZS5pbmRleCArIDEsIFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1NlZ21lbnRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ01vdmU6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdQb3MgPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zO1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudC5wb2ludCA9IG5ld1BvcztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnRW5kOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uRHJhZ0VuZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkRyYWdFbmQobmV3U2VnbWVudCwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgaW50ZXJmYWNlIEl0ZW0ge1xyXG4gICAgICAgIG1vdXNlQmVoYXZpb3I6IE1vdXNlQmVoYXZpb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBNb3VzZUJlaGF2aW9yIHtcclxuICAgIG9uQ2xpY2s/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuXHJcbiAgICBvbk92ZXJTdGFydD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25PdmVyTW92ZT86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25PdmVyRW5kPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gICAgb25EcmFnU3RhcnQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uRHJhZ01vdmU/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uRHJhZ0VuZD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgTW91c2VBY3Rpb24ge1xyXG4gICAgc3RhcnRFdmVudDogcGFwZXIuVG9vbEV2ZW50O1xyXG4gICAgaXRlbTogcGFwZXIuSXRlbTtcclxuICAgIGRyYWdnZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmNsYXNzIE1vdXNlQmVoYXZpb3JUb29sIGV4dGVuZHMgcGFwZXIuVG9vbCB7XHJcblxyXG4gICAgaGl0T3B0aW9ucyA9IHtcclxuICAgICAgICBzZWdtZW50czogdHJ1ZSxcclxuICAgICAgICBzdHJva2U6IHRydWUsXHJcbiAgICAgICAgZmlsbDogdHJ1ZSxcclxuICAgICAgICB0b2xlcmFuY2U6IDVcclxuICAgIH07XHJcblxyXG4gICAgcHJlc3NBY3Rpb246IE1vdXNlQWN0aW9uO1xyXG4gICAgaG92ZXJBY3Rpb246IE1vdXNlQWN0aW9uO1xyXG4gICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9qZWN0OiBwYXBlci5Qcm9qZWN0KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnByb2plY3QgPSBwcm9qZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wcmVzc0FjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgICAgIHZhciBoaXRSZXN1bHQgPSB0aGlzLnByb2plY3QuaGl0VGVzdChcclxuICAgICAgICAgICAgZXZlbnQucG9pbnQsXHJcbiAgICAgICAgICAgIHRoaXMuaGl0T3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGlmIChoaXRSZXN1bHQgJiYgaGl0UmVzdWx0Lml0ZW0pIHtcclxuICAgICAgICAgICAgbGV0IGRyYWdnYWJsZSA9IHRoaXMuZmluZERyYWdIYW5kbGVyKGhpdFJlc3VsdC5pdGVtKTtcclxuICAgICAgICAgICAgaWYgKGRyYWdnYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbiA9IDxNb3VzZUFjdGlvbj57XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogZHJhZ2dhYmxlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgdmFyIGhpdFJlc3VsdCA9IHRoaXMucHJvamVjdC5oaXRUZXN0KFxyXG4gICAgICAgICAgICBldmVudC5wb2ludCxcclxuICAgICAgICAgICAgdGhpcy5oaXRPcHRpb25zKTtcclxuICAgICAgICBsZXQgaGFuZGxlckl0ZW0gPSBoaXRSZXN1bHRcclxuICAgICAgICAgICAgJiYgdGhpcy5maW5kT3ZlckhhbmRsZXIoaGl0UmVzdWx0Lml0ZW0pO1xyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIC8vIHdlcmUgcHJldmlvdXNseSBob3ZlcmluZ1xyXG4gICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uXHJcbiAgICAgICAgICAgICYmIChcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBob3ZlcmluZyBvdmVyIGFueXRoaW5nIG5vd1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlckl0ZW0gPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgLy8gbm90IGhvdmVyaW5nIG92ZXIgY3VycmVudCBoYW5kbGVyIG9yIGRlc2NlbmRlbnQgdGhlcmVvZlxyXG4gICAgICAgICAgICAgICAgfHwgIU1vdXNlQmVoYXZpb3JUb29sLmlzU2FtZU9yQW5jZXN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgaGl0UmVzdWx0Lml0ZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvbi5pdGVtKSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLy8ganVzdCBsZWF2aW5nXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhvdmVyQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbk92ZXJFbmQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uT3ZlckVuZChldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaGFuZGxlckl0ZW0gJiYgaGFuZGxlckl0ZW0ubW91c2VCZWhhdmlvcikge1xyXG4gICAgICAgICAgICBsZXQgYmVoYXZpb3IgPSBoYW5kbGVySXRlbS5tb3VzZUJlaGF2aW9yO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaG92ZXJBY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24gPSA8TW91c2VBY3Rpb24+e1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06IGhhbmRsZXJJdGVtXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgaWYgKGJlaGF2aW9yLm9uT3ZlclN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3Iub25PdmVyU3RhcnQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChiZWhhdmlvciAmJiBiZWhhdmlvci5vbk92ZXJNb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICBiZWhhdmlvci5vbk92ZXJNb3ZlKGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRHJhZyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wcmVzc0FjdGlvbi5kcmFnZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uLmRyYWdnZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlc3NBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ1N0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnU3RhcnQuY2FsbChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLCB0aGlzLnByZXNzQWN0aW9uLnN0YXJ0RXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdNb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdNb3ZlLmNhbGwodGhpcy5wcmVzc0FjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJlc3NBY3Rpb24pIHtcclxuICAgICAgICAgICAgbGV0IGFjdGlvbiA9IHRoaXMucHJlc3NBY3Rpb247XHJcbiAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24gPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFjdGlvbi5kcmFnZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkcmFnXHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdFbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ0VuZC5jYWxsKGFjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjbGlja1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25DbGljaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25DbGljay5jYWxsKGFjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25LZXlEb3duID0gKGV2ZW50KSA9PiB7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lIGlmIGNvbnRhaW5lciBpcyBhbiBhbmNlc3RvciBvZiBpdGVtLiBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGlzU2FtZU9yQW5jZXN0b3IoaXRlbTogcGFwZXIuSXRlbSwgY29udGFpbmVyOiBwYXBlci5JdGVtKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICEhUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvcihpdGVtLCBwYSA9PiBwYSA9PT0gY29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kRHJhZ0hhbmRsZXIoaXRlbTogcGFwZXIuSXRlbSk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHJldHVybiBQYXBlckhlbHBlcnMuZmluZFNlbGZPckFuY2VzdG9yKFxyXG4gICAgICAgICAgICBpdGVtLCBcclxuICAgICAgICAgICAgcGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1iID0gcGEubW91c2VCZWhhdmlvcjtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhIShtYiAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChtYi5vbkRyYWdTdGFydCB8fCBtYi5vbkRyYWdNb3ZlIHx8IG1iLm9uRHJhZ0VuZCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZmluZE92ZXJIYW5kbGVyKGl0ZW06IHBhcGVyLkl0ZW0pOiBwYXBlci5JdGVtIHtcclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvcihcclxuICAgICAgICAgICAgaXRlbSwgXHJcbiAgICAgICAgICAgIHBhID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYiA9IHBhLm1vdXNlQmVoYXZpb3I7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gISEobWIgJiZcclxuICAgICAgICAgICAgICAgICAgICAobWIub25PdmVyU3RhcnQgfHwgbWIub25PdmVyTW92ZSB8fCBtYi5vbk92ZXJFbmQgKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBQYXBlckhlbHBlcnMge1xyXG5cclxuICAgIHN0YXRpYyBpbXBvcnRPcGVuVHlwZVBhdGgob3BlblBhdGg6IG9wZW50eXBlLlBhdGgpOiBwYXBlci5Db21wb3VuZFBhdGgge1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKG9wZW5QYXRoLnRvUGF0aERhdGEoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gbGV0IHN2ZyA9IG9wZW5QYXRoLnRvU1ZHKDQpO1xyXG4gICAgICAgIC8vIHJldHVybiA8cGFwZXIuUGF0aD5wYXBlci5wcm9qZWN0LmltcG9ydFNWRyhzdmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZVBhdGhJdGVtKHBhdGg6IHBhcGVyLlBhdGhJdGVtLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5QYXRoSXRlbSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRyYWNlQ29tcG91bmRQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICBpZiAoIXBhdGguY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcGF0aHMgPSBwYXRoLmNoaWxkcmVuLm1hcChwID0+XHJcbiAgICAgICAgICAgIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnAsIHBvaW50c1BlclBhdGgpKTtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aCh7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBwYXRocyxcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRyYWNlUGF0aChwYXRoOiBwYXBlci5QYXRoLCBudW1Qb2ludHM6IG51bWJlcik6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgIC8vIGlmKCFwYXRoIHx8ICFwYXRoLnNlZ21lbnRzIHx8IHBhdGguc2VnbWVudHMubGVuZ3RoKXtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIG5ldyBwYXBlci5QYXRoKCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGxldCBwYXRoTGVuZ3RoID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG9mZnNldEluY3IgPSBwYXRoTGVuZ3RoIC8gbnVtUG9pbnRzO1xyXG4gICAgICAgIGxldCBwb2ludHMgPSBbXTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDA7XHJcblxyXG4gICAgICAgIHdoaWxlIChpKysgPCBudW1Qb2ludHMpIHtcclxuICAgICAgICAgICAgbGV0IHBvaW50ID0gcGF0aC5nZXRQb2ludEF0KE1hdGgubWluKG9mZnNldCwgcGF0aExlbmd0aCkpO1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChwb2ludCk7XHJcbiAgICAgICAgICAgIG9mZnNldCArPSBvZmZzZXRJbmNyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5QYXRoKHtcclxuICAgICAgICAgICAgc2VnbWVudHM6IHBvaW50cyxcclxuICAgICAgICAgICAgY2xvc2VkOiB0cnVlLFxyXG4gICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNhbmR3aWNoUGF0aFByb2plY3Rpb24odG9wUGF0aDogcGFwZXIuQ3VydmVsaWtlLCBib3R0b21QYXRoOiBwYXBlci5DdXJ2ZWxpa2UpXHJcbiAgICAgICAgOiAodW5pdFBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIGNvbnN0IHRvcFBhdGhMZW5ndGggPSB0b3BQYXRoLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBib3R0b21QYXRoTGVuZ3RoID0gYm90dG9tUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgICAgIGxldCB0b3BQb2ludCA9IHRvcFBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIHRvcFBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgICBsZXQgYm90dG9tUG9pbnQgPSBib3R0b21QYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiBib3R0b21QYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICAgaWYgKHRvcFBvaW50ID09IG51bGwgfHwgYm90dG9tUG9pbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJjb3VsZCBub3QgZ2V0IHByb2plY3RlZCBwb2ludCBmb3IgdW5pdCBwb2ludCBcIiArIHVuaXRQb2ludC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0b3BQb2ludC5hZGQoYm90dG9tUG9pbnQuc3VidHJhY3QodG9wUG9pbnQpLm11bHRpcGx5KHVuaXRQb2ludC55KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXJrZXJHcm91cDogcGFwZXIuR3JvdXA7XHJcblxyXG4gICAgc3RhdGljIHJlc2V0TWFya2Vycygpe1xyXG4gICAgICAgIGlmKFBhcGVySGVscGVycy5tYXJrZXJHcm91cCl7XHJcbiAgICAgICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLm9wYWNpdHkgPSAwLjI7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1hcmtlckxpbmUoYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50KTogcGFwZXIuSXRlbXtcclxuICAgICAgICBsZXQgbGluZSA9IHBhcGVyLlBhdGguTGluZShhLGIpO1xyXG4gICAgICAgIGxpbmUuc3Ryb2tlQ29sb3IgPSAnZ3JlZW4nO1xyXG4gICAgICAgIC8vbGluZS5kYXNoQXJyYXkgPSBbNSwgNV07XHJcbiAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLmFkZENoaWxkKGxpbmUpO1xyXG4gICAgICAgIHJldHVybiBsaW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXJrZXIocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgbGV0IG1hcmtlciA9IHBhcGVyLlNoYXBlLkNpcmNsZShwb2ludCwgMik7XHJcbiAgICAgICAgbWFya2VyLnN0cm9rZUNvbG9yID0gJ3JlZCc7XHJcbiAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLmFkZENoaWxkKG1hcmtlcik7XHJcbiAgICAgICAgcmV0dXJuIG1hcmtlcjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2ltcGxpZnkocGF0aDogcGFwZXIuUGF0aEl0ZW0sIHRvbGVyYW5jZT86IG51bWJlcikge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBQYXBlckhlbHBlcnMuc2ltcGxpZnkoPHBhcGVyLlBhdGhJdGVtPnAsIHRvbGVyYW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAoPHBhcGVyLlBhdGg+cGF0aCkuc2ltcGxpZnkodG9sZXJhbmNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIHNlbGYgb3IgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXHJcbiAgICAgKi8gICAgXHJcbiAgICBzdGF0aWMgZmluZFNlbGZPckFuY2VzdG9yKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pe1xyXG4gICAgICAgIGlmKHByZWRpY2F0ZShpdGVtKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRBbmNlc3RvcihpdGVtLCBwcmVkaWNhdGUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBmaW5kQW5jZXN0b3IoaXRlbTogcGFwZXIuSXRlbSwgcHJlZGljYXRlOiAoaTogcGFwZXIuSXRlbSkgPT4gYm9vbGVhbil7XHJcbiAgICAgICAgaWYoIWl0ZW0pe1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHByaW9yOiBwYXBlci5JdGVtO1xyXG4gICAgICAgIGxldCBjaGVja2luZyA9IGl0ZW0ucGFyZW50O1xyXG4gICAgICAgIHdoaWxlKGNoZWNraW5nICYmIGNoZWNraW5nICE9PSBwcmlvcil7XHJcbiAgICAgICAgICAgIGlmKHByZWRpY2F0ZShjaGVja2luZykpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNraW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByaW9yID0gY2hlY2tpbmc7XHJcbiAgICAgICAgICAgIGNoZWNraW5nID0gY2hlY2tpbmcucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgY29ybmVycyBvZiB0aGUgcmVjdCwgY2xvY2t3aXNlIHN0YXJ0aW5nIGZyb20gdG9wTGVmdFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29ybmVycyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpOiBwYXBlci5Qb2ludFtde1xyXG4gICAgICAgIHJldHVybiBbcmVjdC50b3BMZWZ0LCByZWN0LnRvcFJpZ2h0LCByZWN0LmJvdHRvbVJpZ2h0LCByZWN0LmJvdHRvbUxlZnRdO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFBhdGhTZWN0aW9uIGltcGxlbWVudHMgcGFwZXIuQ3VydmVsaWtlIHtcclxuICAgIHBhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICBvZmZzZXQ6IG51bWJlcjtcclxuICAgIGxlbmd0aDogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBwYXBlci5QYXRoLCBvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFBvaW50QXQob2Zmc2V0OiBudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhdGguZ2V0UG9pbnRBdChvZmZzZXQgKyB0aGlzLm9mZnNldCk7XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgUGF0aFRyYW5zZm9ybSB7XHJcbiAgICBwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludFRyYW5zZm9ybSA9IHBvaW50VHJhbnNmb3JtO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludFRyYW5zZm9ybShwb2ludCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aEl0ZW0ocGF0aDogcGFwZXIuUGF0aEl0ZW0pIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1Db21wb3VuZFBhdGgocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aChwYXRoOiBwYXBlci5QYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiBwYXRoLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBvcmlnUG9pbnQgPSBzZWdtZW50LnBvaW50O1xyXG4gICAgICAgICAgICBsZXQgbmV3UG9pbnQgPSB0aGlzLnRyYW5zZm9ybVBvaW50KHNlZ21lbnQucG9pbnQpO1xyXG4gICAgICAgICAgICBvcmlnUG9pbnQueCA9IG5ld1BvaW50Lng7XHJcbiAgICAgICAgICAgIG9yaWdQb2ludC55ID0gbmV3UG9pbnQueTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuIiwiXHJcbmNsYXNzIFNlZ21lbnRIYW5kbGUgZXh0ZW5kcyBwYXBlci5TaGFwZSB7XHJcbiBcclxuICAgIHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XHJcbiAgICBvbkNoYW5nZUNvbXBsZXRlOiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfc21vb3RoZWQ6IGJvb2xlYW47XHJcbiBcclxuICAgIGNvbnN0cnVjdG9yKHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQsIHJhZGl1cz86IG51bWJlcil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNlZ21lbnQgPSBzZWdtZW50O1xyXG5cclxuICAgICAgICBsZXQgc2VsZiA9IDxhbnk+dGhpcztcclxuICAgICAgICBzZWxmLl90eXBlID0gJ2NpcmNsZSc7XHJcbiAgICAgICAgc2VsZi5fcmFkaXVzID0gMTU7XHJcbiAgICAgICAgc2VsZi5fc2l6ZSA9IG5ldyBwYXBlci5TaXplKHNlbGYuX3JhZGl1cyAqIDIpO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKHNlZ21lbnQucG9pbnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSAyO1xyXG4gICAgICAgIHRoaXMuc3Ryb2tlQ29sb3IgPSAnYmx1ZSc7XHJcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eSA9IDAuNzsgXHJcblxyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IDxNb3VzZUJlaGF2aW9yPntcclxuICAgICAgICAgICAgb25EcmFnTW92ZTogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1BvcyA9IHRoaXMucG9zaXRpb24uYWRkKGV2ZW50LmRlbHRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3M7XHJcbiAgICAgICAgICAgICAgICBzZWdtZW50LnBvaW50ID0gbmV3UG9zO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdFbmQ6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Ntb290aGVkKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uQ2hhbmdlQ29tcGxldGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DaGFuZ2VDb21wbGV0ZShldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc21vb3RoZWQgPSAhdGhpcy5zbW9vdGhlZDtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMub25DaGFuZ2VDb21wbGV0ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5nZUNvbXBsZXRlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHNtb290aGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zbW9vdGhlZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IHNtb290aGVkKHZhbHVlOiBib29sZWFuKXtcclxuICAgICAgICB0aGlzLl9zbW9vdGhlZCA9IHZhbHVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnQuaGFuZGxlSW4gPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnQuaGFuZGxlT3V0ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFN0cmV0Y2h5UGF0aCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuXHJcbiAgICBvcHRpb25zOiBTdHJldGNoeVBhdGhPcHRpb25zO1xyXG4gICAgICAgIFxyXG4gICAgc291cmNlUGF0aDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgZGlzcGxheVBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIGNvcm5lcnM6IHBhcGVyLlNlZ21lbnRbXTtcclxuICAgIG91dGxpbmU6IHBhcGVyLlBhdGg7XHJcbiAgICBcclxuICAgIHN0YXRpYyBPVVRMSU5FX1BPSU5UUyA9IDIzMDtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3IgcmVidWlsZGluZyB0aGUgbWlkcG9pbnQgaGFuZGxlc1xyXG4gICAgICogYXMgb3V0bGluZSBjaGFuZ2VzLlxyXG4gICAgICovXHJcbiAgICBtaWRwb2ludEdyb3VwOiBwYXBlci5Hcm91cDtcclxuICAgIHNlZ21lbnRHcm91cDogcGFwZXIuR3JvdXA7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc291cmNlUGF0aDogcGFwZXIuQ29tcG91bmRQYXRoLCBvcHRpb25zPzogU3RyZXRjaHlQYXRoT3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgPFN0cmV0Y2h5UGF0aE9wdGlvbnM+e1xyXG4gICAgICAgICAgICBwYXRoRmlsbENvbG9yOiAnZ3JheSdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNvdXJjZVBhdGggPSBzb3VyY2VQYXRoO1xyXG4gICAgICAgIHRoaXMuc291cmNlUGF0aC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlT3V0bGluZSgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlU2VnbWVudE1hcmtlcnMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1pZHBpb250TWFya2VycygpO1xyXG5cclxuICAgICAgICB0aGlzLm1vdXNlQmVoYXZpb3IgPSB7XHJcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnU3RhcnQ6ICgpID0+IHRoaXMuYnJpbmdUb0Zyb250KCksXHJcbiAgICAgICAgICAgIG9uRHJhZ01vdmU6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKGV2ZW50LmRlbHRhKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25PdmVyU3RhcnQ6ICgpID0+IHRoaXMuc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eSh0cnVlKSxcclxuICAgICAgICAgICAgb25PdmVyRW5kOiAoKSA9PiB0aGlzLnNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkoZmFsc2UpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkodmFsdWU6IGJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuc2VnbWVudEdyb3VwLnZpc2libGUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAudmlzaWJsZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMub3V0bGluZS5zdHJva2VDb2xvciA9IHZhbHVlID8gJ2xpZ2h0Z3JheScgOiBudWxsOyBcclxuICAgIH1cclxuXHJcbiAgICBhcnJhbmdlQ29udGVudHMoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNaWRwaW9udE1hcmtlcnMoKTtcclxuICAgICAgICB0aGlzLmFycmFuZ2VQYXRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXJyYW5nZVBhdGgoKSB7XHJcbiAgICAgICAgbGV0IG9ydGhPcmlnaW4gPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzLnRvcExlZnQ7XHJcbiAgICAgICAgbGV0IG9ydGhXaWR0aCA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMud2lkdGg7XHJcbiAgICAgICAgbGV0IG9ydGhIZWlnaHQgPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzLmhlaWdodDtcclxuICAgICAgICBsZXQgc2lkZXMgPSB0aGlzLmdldE91dGxpbmVTaWRlcygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB0b3AgPSBzaWRlc1swXTtcclxuICAgICAgICBsZXQgYm90dG9tID0gc2lkZXNbMl07XHJcbiAgICAgICAgYm90dG9tLnJldmVyc2UoKTtcclxuICAgICAgICBsZXQgcHJvamVjdGlvbiA9IFBhcGVySGVscGVycy5zYW5kd2ljaFBhdGhQcm9qZWN0aW9uKHRvcCwgYm90dG9tKTtcclxuICAgICAgICBsZXQgdHJhbnNmb3JtID0gbmV3IFBhdGhUcmFuc2Zvcm0ocG9pbnQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChvcnRoT3JpZ2luKTtcclxuICAgICAgICAgICAgbGV0IHVuaXQgPSBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS54IC8gb3J0aFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIG9ydGhIZWlnaHQpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdGVkID0gcHJvamVjdGlvbih1bml0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb2plY3RlZDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBzaWRlIG9mIHNpZGVzKXtcclxuICAgICAgICAgICAgc2lkZS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG5ld1BhdGggPSBQYXBlckhlbHBlcnMudHJhY2VDb21wb3VuZFBhdGgodGhpcy5zb3VyY2VQYXRoLCBcclxuICAgICAgICAgICAgU3RyZXRjaHlQYXRoLk9VVExJTkVfUE9JTlRTKTtcclxuICAgICAgICBuZXdQYXRoLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIG5ld1BhdGguZmlsbENvbG9yID0gdGhpcy5vcHRpb25zLnBhdGhGaWxsQ29sb3I7XHJcblxyXG4gICAgICAgIHRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoSXRlbShuZXdQYXRoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheVBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5UGF0aC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGxheVBhdGggPSBuZXdQYXRoO1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0Q2hpbGQoMSwgbmV3UGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRPdXRsaW5lU2lkZXMoKTogcGFwZXIuUGF0aFtdIHtcclxuICAgICAgICBsZXQgc2lkZXM6IHBhcGVyLlBhdGhbXSA9IFtdO1xyXG4gICAgICAgIGxldCBzZWdtZW50R3JvdXA6IHBhcGVyLlNlZ21lbnRbXSA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjb3JuZXJQb2ludHMgPSB0aGlzLmNvcm5lcnMubWFwKGMgPT4gYy5wb2ludCk7XHJcbiAgICAgICAgbGV0IGZpcnN0ID0gY29ybmVyUG9pbnRzLnNoaWZ0KCk7IFxyXG4gICAgICAgIGNvcm5lclBvaW50cy5wdXNoKGZpcnN0KTtcclxuXHJcbiAgICAgICAgbGV0IHRhcmdldENvcm5lciA9IGNvcm5lclBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgIGxldCBzZWdtZW50TGlzdCA9IHRoaXMub3V0bGluZS5zZWdtZW50cy5tYXAoeCA9PiB4KTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgc2VnbWVudExpc3QucHVzaChzZWdtZW50TGlzdFswXSk7XHJcbiAgICAgICAgZm9yKGxldCBzZWdtZW50IG9mIHNlZ21lbnRMaXN0KXtcclxuICAgICAgICAgICAgc2VnbWVudEdyb3VwLnB1c2goc2VnbWVudCk7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldENvcm5lci5pc0Nsb3NlKHNlZ21lbnQucG9pbnQsIHBhcGVyLk51bWVyaWNhbC5FUFNJTE9OKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZmluaXNoIHBhdGhcclxuICAgICAgICAgICAgICAgIHNpZGVzLnB1c2gobmV3IHBhcGVyLlBhdGgoc2VnbWVudEdyb3VwKSk7XHJcbiAgICAgICAgICAgICAgICBzZWdtZW50R3JvdXAgPSBbc2VnbWVudF07XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRDb3JuZXIgPSBjb3JuZXJQb2ludHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHNpZGVzLmxlbmd0aCAhPT0gNCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3NpZGVzJywgc2lkZXMpO1xyXG4gICAgICAgICAgICB0aHJvdyAnZmFpbGVkIHRvIGdldCBzaWRlcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzaWRlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjcmVhdGVPdXRsaW5lKCkge1xyXG4gICAgICAgIGxldCBib3VuZHMgPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzO1xyXG4gICAgICAgIGxldCBvdXRsaW5lID0gbmV3IHBhcGVyLlBhdGgoXHJcbiAgICAgICAgICAgIFBhcGVySGVscGVycy5jb3JuZXJzKHRoaXMuc291cmNlUGF0aC5ib3VuZHMpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5vcHRpb25zLmJhY2tncm91bmRDb2xvcil7XHJcbiAgICAgICAgICAgIG91dGxpbmUuZmlsbENvbG9yID0gdGhpcy5vcHRpb25zLmJhY2tncm91bmRDb2xvcjsgICAgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3V0bGluZS5maWxsQ29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBvdXRsaW5lLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXRsaW5lLmNsb3NlZCA9IHRydWU7XHJcbiAgICAgICAgb3V0bGluZS5kYXNoQXJyYXkgPSBbNSwgNV07XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lID0gb3V0bGluZTtcclxuXHJcbiAgICAgICAgLy8gdHJhY2sgY29ybmVycyBzbyB3ZSBrbm93IGhvdyB0byBhcnJhbmdlIHRoZSB0ZXh0XHJcbiAgICAgICAgdGhpcy5jb3JuZXJzID0gb3V0bGluZS5zZWdtZW50cy5tYXAocyA9PiBzKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChvdXRsaW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNlZ21lbnRNYXJrZXJzKCkge1xyXG4gICAgICAgIGxldCBib3VuZHMgPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzO1xyXG4gICAgICAgIHRoaXMuc2VnbWVudEdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiB0aGlzLm91dGxpbmUuc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgbGV0IGhhbmRsZSA9IG5ldyBTZWdtZW50SGFuZGxlKHNlZ21lbnQpO1xyXG4gICAgICAgICAgICBoYW5kbGUub25DaGFuZ2VDb21wbGV0ZSA9ICgpID0+IHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudEdyb3VwLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5zZWdtZW50R3JvdXApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlTWlkcGlvbnRNYXJrZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMubWlkcG9pbnRHcm91cCl7XHJcbiAgICAgICAgICAgIHRoaXMubWlkcG9pbnRHcm91cC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lLmN1cnZlcy5mb3JFYWNoKGN1cnZlID0+IHtcclxuICAgICAgICAgICAgLy8gc2tpcCBsZWZ0IGFuZCByaWdodCBzaWRlc1xyXG4gICAgICAgICAgICBpZihjdXJ2ZS5zZWdtZW50MSA9PT0gdGhpcy5jb3JuZXJzWzFdXHJcbiAgICAgICAgICAgICAgICB8fCBjdXJ2ZS5zZWdtZW50MSA9PT0gdGhpcy5jb3JuZXJzWzNdKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47ICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGUgPSBuZXcgQ3VydmVTcGxpdHRlckhhbmRsZShjdXJ2ZSk7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbkRyYWdFbmQgPSAobmV3U2VnbWVudCwgZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdIYW5kbGUgPSBuZXcgU2VnbWVudEhhbmRsZShuZXdTZWdtZW50KTtcclxuICAgICAgICAgICAgICAgIG5ld0hhbmRsZS5vbkNoYW5nZUNvbXBsZXRlID0gKCkgPT4gdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VnbWVudEdyb3VwLmFkZENoaWxkKG5ld0hhbmRsZSk7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGUucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAuYWRkQ2hpbGQoaGFuZGxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMubWlkcG9pbnRHcm91cCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBTdHJldGNoeVBhdGhPcHRpb25zIHtcclxuICAgIHBhdGhGaWxsQ29sb3I6IHN0cmluZztcclxuICAgIGJhY2tncm91bmRDb2xvcjogc3RyaW5nO1xyXG59XHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoeVRleHQgZXh0ZW5kcyBTdHJldGNoeVBhdGgge1xyXG5cclxuICAgIG9wdGlvbnM6IFN0cmV0Y2h5VGV4dE9wdGlvbnM7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGV4dDogc3RyaW5nLCBmb250OiBvcGVudHlwZS5Gb250LCBvcHRpb25zPzogU3RyZXRjaHlUZXh0T3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgPFN0cmV0Y2h5VGV4dE9wdGlvbnM+e1xyXG4gICAgICAgICAgICBmb250U2l6ZTogMzJcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBvcGVuVHlwZVBhdGggPSBmb250LmdldFBhdGgodGV4dCwgMCwgMCwgdGhpcy5vcHRpb25zLmZvbnRTaXplKTtcclxuICAgICAgICBsZXQgdGV4dFBhdGggPSBQYXBlckhlbHBlcnMuaW1wb3J0T3BlblR5cGVQYXRoKG9wZW5UeXBlUGF0aCk7XHJcblxyXG4gICAgICAgIHN1cGVyKHRleHRQYXRoLCBvcHRpb25zKTtcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIFN0cmV0Y2h5VGV4dE9wdGlvbnMgZXh0ZW5kcyBTdHJldGNoeVBhdGhPcHRpb25zIHtcclxuICAgIGZvbnRTaXplOiBudW1iZXI7XHJcbn1cclxuIiwiXHJcbi8qKlxyXG4gKiBNZWFzdXJlcyBvZmZzZXRzIG9mIHRleHQgZ2x5cGhzLlxyXG4gKi9cclxuY2xhc3MgVGV4dFJ1bGVyIHtcclxuICAgIFxyXG4gICAgZm9udEZhbWlseTogc3RyaW5nO1xyXG4gICAgZm9udFdlaWdodDogbnVtYmVyO1xyXG4gICAgZm9udFNpemU6IG51bWJlcjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQb2ludFRleHQgKHRleHQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICB2YXIgcG9pbnRUZXh0ID0gbmV3IHBhcGVyLlBvaW50VGV4dCgpO1xyXG4gICAgICAgIHBvaW50VGV4dC5jb250ZW50ID0gdGV4dDtcclxuICAgICAgICBwb2ludFRleHQuanVzdGlmaWNhdGlvbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgaWYodGhpcy5mb250RmFtaWx5KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRGYW1pbHkgPSB0aGlzLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFdlaWdodCl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250V2VpZ2h0ID0gdGhpcy5mb250V2VpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmZvbnRTaXplKXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHBvaW50VGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUZXh0T2Zmc2V0cyh0ZXh0KXtcclxuICAgICAgICAvLyBNZWFzdXJlIGdseXBocyBpbiBwYWlycyB0byBjYXB0dXJlIHdoaXRlIHNwYWNlLlxyXG4gICAgICAgIC8vIFBhaXJzIGFyZSBjaGFyYWN0ZXJzIGkgYW5kIGkrMS5cclxuICAgICAgICB2YXIgZ2x5cGhQYWlycyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBnbHlwaFBhaXJzW2ldID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSwgaSsxKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZvciBlYWNoIGNoYXJhY3RlciwgZmluZCBjZW50ZXIgb2Zmc2V0LlxyXG4gICAgICAgIHZhciB4T2Zmc2V0cyA9IFswXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIE1lYXN1cmUgdGhyZWUgY2hhcmFjdGVycyBhdCBhIHRpbWUgdG8gZ2V0IHRoZSBhcHByb3ByaWF0ZSBcclxuICAgICAgICAgICAgLy8gICBzcGFjZSBiZWZvcmUgYW5kIGFmdGVyIHRoZSBnbHlwaC5cclxuICAgICAgICAgICAgdmFyIHRyaWFkVGV4dCA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGkgLSAxLCBpICsgMSkpO1xyXG4gICAgICAgICAgICB0cmlhZFRleHQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCBvdXQgaGFsZiBvZiBwcmlvciBnbHlwaCBwYWlyIFxyXG4gICAgICAgICAgICAvLyAgIGFuZCBoYWxmIG9mIGN1cnJlbnQgZ2x5cGggcGFpci5cclxuICAgICAgICAgICAgLy8gTXVzdCBiZSByaWdodCwgYmVjYXVzZSBpdCB3b3Jrcy5cclxuICAgICAgICAgICAgbGV0IG9mZnNldFdpZHRoID0gdHJpYWRUZXh0LmJvdW5kcy53aWR0aCBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpIC0gMV0uYm91bmRzLndpZHRoIC8gMiBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpXS5ib3VuZHMud2lkdGggLyAyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQWRkIG9mZnNldCB3aWR0aCB0byBwcmlvciBvZmZzZXQuIFxyXG4gICAgICAgICAgICB4T2Zmc2V0c1tpXSA9IHhPZmZzZXRzW2kgLSAxXSArIG9mZnNldFdpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGdseXBoUGFpciBvZiBnbHlwaFBhaXJzKXtcclxuICAgICAgICAgICAgZ2x5cGhQYWlyLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4geE9mZnNldHM7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFZpZXdab29tIHtcclxuXHJcbiAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgZmFjdG9yID0gMS4yNTtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfbWluWm9vbTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbWF4Wm9vbTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb2plY3Q6IHBhcGVyLlByb2plY3QpIHtcclxuICAgICAgICB0aGlzLnByb2plY3QgPSBwcm9qZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcblxyXG4gICAgICAgICg8YW55PiQodmlldy5lbGVtZW50KSkubW91c2V3aGVlbCgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IG1vdXNlUG9zaXRpb24gPSBuZXcgcGFwZXIuUG9pbnQoZXZlbnQub2Zmc2V0WCwgZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlWm9vbUNlbnRlcmVkKGV2ZW50LmRlbHRhWSwgbW91c2VQb3NpdGlvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHpvb20oKTogbnVtYmVye1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2plY3Qudmlldy56b29tO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB6b29tUmFuZ2UoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgem9vbSBsZXZlbC5cclxuICAgICAqIEByZXR1cm5zIHpvb20gbGV2ZWwgdGhhdCB3YXMgc2V0LCBvciBudWxsIGlmIGl0IHdhcyBub3QgY2hhbmdlZFxyXG4gICAgICovXHJcbiAgICBzZXRab29tQ29uc3RyYWluZWQoem9vbTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICBpZih0aGlzLl9taW5ab29tKSB7XHJcbiAgICAgICAgICAgIHpvb20gPSBNYXRoLm1heCh6b29tLCB0aGlzLl9taW5ab29tKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fbWF4Wm9vbSl7XHJcbiAgICAgICAgICAgIHpvb20gPSBNYXRoLm1pbih6b29tLCB0aGlzLl9tYXhab29tKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICBpZih6b29tICE9IHZpZXcuem9vbSl7XHJcbiAgICAgICAgICAgIHZpZXcuem9vbSA9IHpvb207XHJcbiAgICAgICAgICAgIHJldHVybiB6b29tO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRab29tUmFuZ2UocmFuZ2U6IHBhcGVyLlNpemVbXSk6IG51bWJlcltdIHtcclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGxldCBhU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgbGV0IGJTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICBsZXQgYSA9IGFTaXplICYmIE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYVNpemUuaGVpZ2h0LCAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGFTaXplLndpZHRoKTtcclxuICAgICAgICBsZXQgYiA9IGJTaXplICYmIE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYlNpemUuaGVpZ2h0LCAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGJTaXplLndpZHRoKTtcclxuICAgICAgICBsZXQgbWluID0gTWF0aC5taW4oYSxiKTtcclxuICAgICAgICBpZihtaW4pe1xyXG4gICAgICAgICAgICB0aGlzLl9taW5ab29tID0gbWluO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbWF4ID0gTWF0aC5tYXgoYSxiKTtcclxuICAgICAgICBpZihtYXgpe1xyXG4gICAgICAgICAgICB0aGlzLl9tYXhab29tID0gbWF4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVpvb21DZW50ZXJlZChkZWx0YVk6IG51bWJlciwgbW91c2VQb3M6IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgaWYgKCFkZWx0YVkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGxldCBvbGRab29tID0gdmlldy56b29tO1xyXG4gICAgICAgIGxldCBvbGRDZW50ZXIgPSB2aWV3LmNlbnRlcjtcclxuICAgICAgICBsZXQgdmlld1BvcyA9IHZpZXcudmlld1RvUHJvamVjdChtb3VzZVBvcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG5ld1pvb20gPSBkZWx0YVkgPiAwXHJcbiAgICAgICAgICAgID8gdmlldy56b29tICogdGhpcy5mYWN0b3JcclxuICAgICAgICAgICAgOiB2aWV3Lnpvb20gLyB0aGlzLmZhY3RvcjtcclxuICAgICAgICBuZXdab29tID0gdGhpcy5zZXRab29tQ29uc3RyYWluZWQobmV3Wm9vbSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIW5ld1pvb20pe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgem9vbVNjYWxlID0gb2xkWm9vbSAvIG5ld1pvb207XHJcbiAgICAgICAgbGV0IGNlbnRlckFkanVzdCA9IHZpZXdQb3Muc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gdmlld1Bvcy5zdWJ0cmFjdChjZW50ZXJBZGp1c3QubXVsdGlwbHkoem9vbVNjYWxlKSlcclxuICAgICAgICAgICAgLnN1YnRyYWN0KG9sZENlbnRlcik7XHJcblxyXG4gICAgICAgIHZpZXcuY2VudGVyID0gdmlldy5jZW50ZXIuYWRkKG9mZnNldCk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB6b29tVG8ocmVjdDogcGFwZXIuUmVjdGFuZ2xlKXtcclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIHZpZXcuY2VudGVyID0gcmVjdC5jZW50ZXI7XHJcbiAgICAgICAgdmlldy56b29tID0gTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyByZWN0LmhlaWdodCwgICAgICAgICBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMud2lkdGggLyByZWN0LndpZHRoKSAqIDAuOTU7XHJcbiAgICB9XHJcbn1cclxuIl19