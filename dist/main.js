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
var TextBlockEdit = function (_a) {
    var DOM = _a.DOM, props$ = _a.props$;
    var newValue$ = DOM.select('.text-block-edit')
        .events('input')
        .map(function (ev) { return ev.target.value; });
    var vtree$ = Rx.Observable.combineLatest(props$, function (props, value) {
        return CycleDOM.div('.text-block-edit', [
            CycleDOM.textarea('.text', ['foo'])
        ]);
    });
    return {
        DOM: vtree$,
        text$: newValue$
    };
};
var DesignerHtmlApp = function (_a) {
    var DOM = _a.DOM;
    var editProps$ = Rx.Observable.just({
        text: 'WHIFFLES'
    });
    var blockEdit = TextBlockEdit({ DOM: DOM, props$: editProps$ });
    blockEdit.text$.subscribe(function (t) { return console.log(t); });
    return {
        DOM: blockEdit.DOM
    };
};
Cycle.run(DesignerHtmlApp, {
    DOM: CycleDOM.makeDOMDriver('#cycle-app'),
    props$: function () { return Rx.Observable.from([{}]); }
});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiLCIuLi9zcmMvYXBwL0FwcENvbnRyb2xsZXIudHMiLCIuLi9zcmMvYXBwL0Rlc2lnbmVyQ29udHJvbGxlci50cyIsIi4uL3NyYy9hcHAvRm9udExvYWRlci50cyIsIi4uL3NyYy9hcHAvSGVscGVycy50cyIsIi4uL3NyYy9hcHAvU2tldGNoLnRzIiwiLi4vc3JjL2FwcC9UZXh0QmxvY2sudHMiLCIuLi9zcmMvYXBwL1dvcmtzcGFjZS50cyIsIi4uL3NyYy9hcHAvV29ya3NwYWNlQ29udHJvbGxlci50cyIsIi4uL3NyYy9jb3JlL05vdGlmeUFycmF5LnRzIiwiLi4vc3JjL2N5Y2xlL1RleHRCbG9ja0VkaXQudHMiLCIuLi9zcmMvY3ljbGUvY3ljbGUtYXBwLnRzIiwiLi4vc3JjL21hdGgvUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHMiLCIuLi9zcmMvcGFwZXIvQ3VydmVTcGxpdHRlckhhbmRsZS50cyIsIi4uL3NyYy9wYXBlci9Nb3VzZUJlaGF2aW9yVG9vbC50cyIsIi4uL3NyYy9wYXBlci9QYXBlckhlbHBlcnMudHMiLCIuLi9zcmMvcGFwZXIvUGF0aFNlY3Rpb24udHMiLCIuLi9zcmMvcGFwZXIvUGF0aFRyYW5zZm9ybS50cyIsIi4uL3NyYy9wYXBlci9TZWdtZW50SGFuZGxlLnRzIiwiLi4vc3JjL3BhcGVyL1N0cmV0Y2h5UGF0aC50cyIsIi4uL3NyYy9wYXBlci9TdHJldGNoeVRleHQudHMiLCIuLi9zcmMvcGFwZXIvVGV4dFJ1bGVyLnRzIiwiLi4vc3JjL3BhcGVyL1ZpZXdab29tLnRzIl0sIm5hbWVzIjpbIkFwcENvbnRyb2xsZXIiLCJBcHBDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiRGVzaWduZXJDb250cm9sbGVyIiwiRGVzaWduZXJDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiRGVzaWduZXJDb250cm9sbGVyLmxvYWRGb250IiwiRGVzaWduZXJDb250cm9sbGVyLm5ld1NrZXRjaCIsIkRlc2lnbmVyQ29udHJvbGxlci5hZGRUZXh0IiwiRm9udExvYWRlciIsIkZvbnRMb2FkZXIuY29uc3RydWN0b3IiLCJuZXdpZCIsIlNrZXRjaCIsIlNrZXRjaC5jb25zdHJ1Y3RvciIsIldvcmtzcGFjZSIsIldvcmtzcGFjZS5jb25zdHJ1Y3RvciIsIldvcmtzcGFjZUNvbnRyb2xsZXIiLCJXb3Jrc3BhY2VDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiV29ya3NwYWNlQ29udHJvbGxlci5za2V0Y2giLCJXb3Jrc3BhY2VDb250cm9sbGVyLnVwZGF0ZSIsIk5vdGlmeUFycmF5IiwiTm90aWZ5QXJyYXkuY29uc3RydWN0b3IiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybSIsIlBlcnNwZWN0aXZlVHJhbnNmb3JtLmNvbnN0cnVjdG9yIiwiUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHJhbnNmb3JtUG9pbnQiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS5jcmVhdGVNYXRyaXgiLCJQZXJzcGVjdGl2ZVRyYW5zZm9ybS5tdWx0aXBseSIsIlF1YWQiLCJRdWFkLmNvbnN0cnVjdG9yIiwiUXVhZC5mcm9tUmVjdGFuZ2xlIiwiUXVhZC5mcm9tQ29vcmRzIiwiUXVhZC5hc0Nvb3JkcyIsIkN1cnZlU3BsaXR0ZXJIYW5kbGUiLCJDdXJ2ZVNwbGl0dGVySGFuZGxlLmNvbnN0cnVjdG9yIiwiTW91c2VCZWhhdmlvclRvb2wiLCJNb3VzZUJlaGF2aW9yVG9vbC5jb25zdHJ1Y3RvciIsIk1vdXNlQmVoYXZpb3JUb29sLmlzU2FtZU9yQW5jZXN0b3IiLCJNb3VzZUJlaGF2aW9yVG9vbC5maW5kRHJhZ0hhbmRsZXIiLCJNb3VzZUJlaGF2aW9yVG9vbC5maW5kT3ZlckhhbmRsZXIiLCJQYXBlckhlbHBlcnMiLCJQYXBlckhlbHBlcnMuY29uc3RydWN0b3IiLCJQYXBlckhlbHBlcnMuaW1wb3J0T3BlblR5cGVQYXRoIiwiUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEl0ZW0iLCJQYXBlckhlbHBlcnMudHJhY2VDb21wb3VuZFBhdGgiLCJQYXBlckhlbHBlcnMudHJhY2VQYXRoIiwiUGFwZXJIZWxwZXJzLnNhbmR3aWNoUGF0aFByb2plY3Rpb24iLCJQYXBlckhlbHBlcnMucmVzZXRNYXJrZXJzIiwiUGFwZXJIZWxwZXJzLm1hcmtlckxpbmUiLCJQYXBlckhlbHBlcnMubWFya2VyIiwiUGFwZXJIZWxwZXJzLnNpbXBsaWZ5IiwiUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvciIsIlBhcGVySGVscGVycy5maW5kQW5jZXN0b3IiLCJQYXBlckhlbHBlcnMuY29ybmVycyIsIlBhdGhTZWN0aW9uIiwiUGF0aFNlY3Rpb24uY29uc3RydWN0b3IiLCJQYXRoU2VjdGlvbi5nZXRQb2ludEF0IiwiUGF0aFRyYW5zZm9ybSIsIlBhdGhUcmFuc2Zvcm0uY29uc3RydWN0b3IiLCJQYXRoVHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50IiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoSXRlbSIsIlBhdGhUcmFuc2Zvcm0udHJhbnNmb3JtQ29tcG91bmRQYXRoIiwiUGF0aFRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoIiwiU2VnbWVudEhhbmRsZSIsIlNlZ21lbnRIYW5kbGUuY29uc3RydWN0b3IiLCJTZWdtZW50SGFuZGxlLnNtb290aGVkIiwiU3RyZXRjaHlQYXRoIiwiU3RyZXRjaHlQYXRoLmNvbnN0cnVjdG9yIiwiU3RyZXRjaHlQYXRoLnNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkiLCJTdHJldGNoeVBhdGguYXJyYW5nZUNvbnRlbnRzIiwiU3RyZXRjaHlQYXRoLmFycmFuZ2VQYXRoIiwiU3RyZXRjaHlQYXRoLmdldE91dGxpbmVTaWRlcyIsIlN0cmV0Y2h5UGF0aC5jcmVhdGVPdXRsaW5lIiwiU3RyZXRjaHlQYXRoLmNyZWF0ZVNlZ21lbnRNYXJrZXJzIiwiU3RyZXRjaHlQYXRoLnVwZGF0ZU1pZHBpb250TWFya2VycyIsIlN0cmV0Y2h5VGV4dCIsIlN0cmV0Y2h5VGV4dC5jb25zdHJ1Y3RvciIsIlRleHRSdWxlciIsIlRleHRSdWxlci5jb25zdHJ1Y3RvciIsIlRleHRSdWxlci5jcmVhdGVQb2ludFRleHQiLCJUZXh0UnVsZXIuZ2V0VGV4dE9mZnNldHMiLCJWaWV3Wm9vbSIsIlZpZXdab29tLmNvbnN0cnVjdG9yIiwiVmlld1pvb20uem9vbSIsIlZpZXdab29tLnpvb21SYW5nZSIsIlZpZXdab29tLnNldFpvb21Db25zdHJhaW5lZCIsIlZpZXdab29tLnNldFpvb21SYW5nZSIsIlZpZXdab29tLmNoYW5nZVpvb21DZW50ZXJlZCIsIlZpZXdab29tLnpvb21UbyJdLCJtYXBwaW5ncyI6IkFBVUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUVkLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztBQUVyQyxDQUFDLENBQUMsQ0FBQztBQ2JIO0lBSUlBO1FBRUlDLElBQUlBLENBQUNBLGtCQUFrQkEsR0FBR0EsSUFBSUEsa0JBQWtCQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUUzREEsQ0FBQ0E7SUFDTEQsb0JBQUNBO0FBQURBLENBQUNBLEFBVEQsSUFTQztBQ1RELElBQU0sU0FBUyxHQUFHLHdGQUF3RixDQUFDO0FBQzNHLElBQU0sU0FBUyxHQUFHLGtFQUFrRSxDQUFDO0FBQ3JGLElBQU0sU0FBUyxHQUFHLHNCQUFzQixDQUFDO0FBQ3pDLElBQU0sY0FBYyxHQUFHLHlEQUF5RCxDQUFBO0FBRWhGO0lBT0lFLDRCQUFZQSxHQUFrQkE7UUFQbENDLGlCQWdGQ0E7UUE3RUdBLFVBQUtBLEdBQW9CQSxFQUFFQSxDQUFDQTtRQUt4QkEsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFFZkEsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxHQUFHQSxJQUFJQSxtQkFBbUJBLEVBQUVBLENBQUNBO1FBRXJEQSx1QkFBdUJBO1FBQ2pCQSxDQUFDQSxDQUFDQSxlQUFlQSxDQUFFQSxDQUFDQSxRQUFRQSxDQUFDQTtZQUMvQkEsU0FBU0EsRUFBRUEsSUFBSUE7WUFDZkEsVUFBVUEs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QUFDQTtRQUMzREEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7SUFDbEJBLENBQUNBO0lBRU1GLGlDQUFZQSxHQUFuQkEsVUFBb0JBLE1BQVlBLEVBQUVBLE1BQVlBO1FBRTFDRyxJQUFJQSxZQUFZQSxHQUFHQTtZQUNmQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM5QkEsSUFBSUEsWUFBWUEsR0FBR0E7WUFDZkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hCQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFOUJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFlBQVlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBO1lBQ2xFQSxJQUFJQSxDQUFDQSxHQUFHQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM3Q0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDM0VBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQy9FQSxDQUFDQTtRQUVEQSxJQUFJQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMxQkEsTUFBTUEsQ0FBQ0E7WUFDSEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hCQSxDQUFDQSxFQUFLQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFLQSxDQUFDQTtZQUNuQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBS0EsQ0FBQ0E7U0FDdEJBLENBQUNBLEdBQUdBLENBQUNBLFVBQVNBLENBQUNBO1lBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUMzQyxDQUFDLENBQUNBLENBQUNBO0lBQ1BBLENBQUNBO0lBRURILDJFQUEyRUE7SUFDM0VBLHFDQUFxQ0E7SUFDckNBLHFDQUFxQ0E7SUFDckNBLHFDQUFxQ0E7SUFDckNBLHFDQUFxQ0E7SUFDOUJBLDZCQUFRQSxHQUFmQSxVQUFnQkEsTUFBTUEsRUFBRUEsTUFBTUE7UUFDMUJJLE1BQU1BLENBQUNBO1lBQ0hBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUVBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQy9GQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFFQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvRkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0ZBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1NBQ2xHQSxDQUFDQTtJQUNOQSxDQUFDQTtJQUNMSiwyQkFBQ0E7QUFBREEsQ0FBQ0EsQUFsRUQsSUFrRUM7QUFFRDtJQU1JSyxj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LENBQUNBLENBQUNBO29CQUNoQ0EsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxJQUFJQSxRQUFRQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDbENBLFFBQVFBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO2dCQUMvQkEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7UUFDTEEsQ0FBQ0EsQ0FBQUE7UUFFREEsZ0JBQVdBLEdBQUdBLFVBQUNBLEtBQUtBO1lBQ2hCQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkJBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO29CQUM1QkEsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBQ2hDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbERBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQ2hEQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxFQUFFQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtvQkFDNURBLENBQUNBO2dCQUNMQSxDQUFDQTtnQkFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxLQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFJ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MUJBLElBQUlBLENBQUNBLEdBQUdBLEtBQUtBLElBQUlBLElBQUlBLENBQUNBLEdBQUdBLENBQ3JCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUNqQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDckNBLElBQUlBLENBQUNBLEdBQUdBLEtBQUtBLElBQUlBLElBQUlBLENBQUNBLEdBQUdBLENBQ3JCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUNqQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDckNBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ3hCQSxFQUFFQSxDQUFBQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFBQSxDQUFDQTtZQUNKQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUN4QkEsQ0FBQ0E7UUFDREEsSUFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDeEJBLEVBQUVBLENBQUFBLENBQUNBLEdBQUdBLENBQUNBLENBQUFBLENBQUNBO1lBQ0pBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLEdBQUdBLENBQUNBO1FBQ3hCQSxDQUFDQTtRQUNEQSxNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUFFQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtJQUMxQ0EsQ0FBQ0E7SUFFREwscUNBQWtCQSxHQUFsQkEsVUFBbUJBLE1BQWNBLEVBQUVBLFFBQXFCQTtRQUNwRE0sRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDVkEsTUFBTUEsQ0FBQ0E7UUFDWEEsQ0FBQ0E7UUFDREEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDN0JBLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBO1FBQ3hCQSxJQUFJQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUM1QkEsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFFM0NBLElBQUlBLE9BQU9BLEdBQUdBLE1BQU1BLEdBQUdBLENBQUNBO2NBQ2xCQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQTtjQUN2QkEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDOUJBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFFM0NBLEVBQUVBLENBQUFBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLENBQUFBLENBQUNBO1lBQ1RBLE1BQU1BLENBQUNBO1FBQ1hBLENBQUNBO1FBRURBLElBQUlBLFNBQVNBLEdBQUdBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBO1FBQ2xDQSxJQUFJQSxZQUFZQSxHQUFHQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUMvQ0EsSUFBSUEsTUFBTUEsR0FBR0EsT0FBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7YUFDMURBLFFBQVFBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO1FBRXpCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtJQUMxQ0EsQ0FBQ0E7O0lBRUROLHlCQUFNQSxHQUFOQSxVQUFPQSxJQUFxQkE7UUFDeEJPLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBO1FBQzdCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FDaEJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLEVBQ2hDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUMvQ0EsQ0FBQ0E7SUFDTFAsZUFBQ0E7QUFBREEsQ0FBQ0EsQUFwR0QsSUFvR0MiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW50ZXJmYWNlIFdpbmRvdyB7XHJcbiAgICBhcHA6IEFwcENvbnRyb2xsZXI7XHJcbn1cclxuXHJcblxyXG5kZWNsYXJlIHZhciBDeWNsZTogYW55O1xyXG5kZWNsYXJlIHZhciBDeWNsZURPTTogYW55O1xyXG5kZWNsYXJlIHZhciBDeWNsZUlzb2xhdGU6IGFueTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkgeyAgXHJcbiAgIFxyXG4gICAgd2luZG93LmFwcCA9IG5ldyBBcHBDb250cm9sbGVyKCk7XHJcbiAgICBcclxufSk7XHJcbiIsIlxyXG5jbGFzcyBBcHBDb250cm9sbGVyIHtcclxuXHJcbiAgICBkZXNpZ25lckNvbnRyb2xsZXI6IERlc2lnbmVyQ29udHJvbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZGVzaWduZXJDb250cm9sbGVyID0gbmV3IERlc2lnbmVyQ29udHJvbGxlcih0aGlzKTtcclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG4iLCJcclxuY29uc3QgQW1hdGljVXJsID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL2FtYXRpY3NjL3Y4L0lEbmtSVFBHY3JTVm81MFV5WU5LN3kzVVNCblN2cGtvcFFhVVItMnI3aVUudHRmJztcclxuY29uc3QgUm9ib3RvMTAwID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL3JvYm90by92MTUvN015Z3FUZTJ6czlZa1AwYWRBOVFRUS50dGYnO1xyXG5jb25zdCBSb2JvdG81MDAgPSAnZm9udHMvUm9ib3RvLTUwMC50dGYnO1xyXG5jb25zdCBBcXVhZmluYVNjcmlwdCA9ICdmb250cy9BZ3VhZmluYVNjcmlwdC1SZWd1bGFyL0FndWFmaW5hU2NyaXB0LVJlZ3VsYXIudHRmJ1xyXG5cclxuY2xhc3MgRGVzaWduZXJDb250cm9sbGVyIHtcclxuXHJcbiAgICBhcHA6IEFwcENvbnRyb2xsZXI7XHJcbiAgICBmb250czogb3BlbnR5cGUuRm9udFtdID0gW107XHJcbiAgICBza2V0Y2g6IFNrZXRjaDtcclxuICAgIHdvcmtzcGFjZUNvbnRyb2xsZXI6IFdvcmtzcGFjZUNvbnRyb2xsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHBDb250cm9sbGVyKSB7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcblxyXG4gICAgICAgIHRoaXMud29ya3NwYWNlQ29udHJvbGxlciA9IG5ldyBXb3Jrc3BhY2VDb250cm9sbGVyKCk7XHJcblxyXG4gICAgICAgIC8vIHNldCB1cCBjb2xvciBwaWNrZXJzXHJcbiAgICAgICAgKDxhbnk+JChcIi5jb2xvci1waWNrZXJcIikpLnNwZWN0cnVtKHtcclxuICAgICAgICAgICAgc2hvd0lucHV0OiB0cnVlLFxyXG4gICAgICAgICAgICBhbGxvd0VtcHR5OiB0cnVlLFxyXG4gICAgICAgICAgICBwcmVmZXJyZWRGb3JtYXQ6IFwiaGV4XCIsXHJcbiAgICAgICAgICAgIHNob3dCdXR0b25zOiBmYWxzZSxcclxuICAgICAgICAgICAgc2hvd0FscGhhOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93UGFsZXR0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd1NlbGVjdGlvblBhbGV0dGU6IHRydWUsXHJcbiAgICAgICAgICAgIHBhbGV0dGU6IFtcclxuICAgICAgICAgICAgICAgIFtcIiMwMDBcIiwgXCIjNDQ0XCIsIFwiIzY2NlwiLCBcIiM5OTlcIiwgXCIjY2NjXCIsIFwiI2VlZVwiLCBcIiNmM2YzZjNcIiwgXCIjZmZmXCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiI2YwMFwiLCBcIiNmOTBcIiwgXCIjZmYwXCIsIFwiIzBmMFwiLCBcIiMwZmZcIiwgXCIjMDBmXCIsIFwiIzkwZlwiLCBcIiNmMGZcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjZjRjY2NjXCIsIFwiI2ZjZTVjZFwiLCBcIiNmZmYyY2NcIiwgXCIjZDllYWQzXCIsIFwiI2QwZTBlM1wiLCBcIiNjZmUyZjNcIiwgXCIjZDlkMmU5XCIsIFwiI2VhZDFkY1wiXSxcclxuICAgICAgICAgICAgICAgIFtcIiNlYTk5OTlcIiwgXCIjZjljYjljXCIsIFwiI2ZmZTU5OVwiLCBcIiNiNmQ3YThcIiwgXCIjYTJjNGM5XCIsIFwiIzlmYzVlOFwiLCBcIiNiNGE3ZDZcIiwgXCIjZDVhNmJkXCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiI2UwNjY2NlwiLCBcIiNmNmIyNmJcIiwgXCIjZmZkOTY2XCIsIFwiIzkzYzQ3ZFwiLCBcIiM3NmE1YWZcIiwgXCIjNmZhOGRjXCIsIFwiIzhlN2NjM1wiLCBcIiNjMjdiYTBcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjYzAwXCIsIFwiI2U2OTEzOFwiLCBcIiNmMWMyMzJcIiwgXCIjNmFhODRmXCIsIFwiIzQ1ODE4ZVwiLCBcIiMzZDg1YzZcIiwgXCIjNjc0ZWE3XCIsIFwiI2E2NGQ3OVwiXSxcclxuICAgICAgICAgICAgICAgIFtcIiM5MDBcIiwgXCIjYjQ1ZjA2XCIsIFwiI2JmOTAwMFwiLCBcIiMzODc2MWRcIiwgXCIjMTM0ZjVjXCIsIFwiIzBiNTM5NFwiLCBcIiMzNTFjNzVcIiwgXCIjNzQxYjQ3XCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiIzYwMFwiLCBcIiM3ODNmMDRcIiwgXCIjN2Y2MDAwXCIsIFwiIzI3NGUxM1wiLCBcIiMwYzM0M2RcIiwgXCIjMDczNzYzXCIsIFwiIzIwMTI0ZFwiLCBcIiM0YzExMzBcIl1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlS2V5OiBcInNrZXRjaHRleHRcIixcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gYWRkIG5ldyB0ZXh0IGJsb2NrXHJcbiAgICAgICAgdGhpcy5sb2FkRm9udChSb2JvdG81MDAsIGZvbnQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm5ld1NrZXRjaCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gZm9yIHRlc3RpbmdcclxuICAgICAgICAgICAgdGhpcy5za2V0Y2gudGV4dEJsb2Nrcy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgPFRleHRCbG9jaz57XHJcbiAgICAgICAgICAgICAgICAgICAgX2lkOiBuZXdpZCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdGSURETEVTVElDS1MnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHRDb2xvcjogJ2dyYXknLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQ6IGZvbnRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5za2V0Y2gub25DaGFuZ2VkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZvbnQodXJsOiBzdHJpbmcsIG9uQ29tcGxldGU6IChmOiBvcGVudHlwZS5Gb250KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgbmV3IEZvbnRMb2FkZXIodXJsLCBmb250ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mb250cy5wdXNoKGZvbnQpO1xyXG4gICAgICAgICAgICBvbkNvbXBsZXRlKGZvbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG5ld1NrZXRjaCgpIHtcclxuICAgICAgICB0aGlzLnNrZXRjaCA9IG5ldyBTa2V0Y2goKTtcclxuICAgICAgICB0aGlzLndvcmtzcGFjZUNvbnRyb2xsZXIuc2tldGNoID0gdGhpcy5za2V0Y2g7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZFRleHQoKSB7XHJcbiAgICAgICAgbGV0IHRleHQgPSAkKCcjbmV3VGV4dCcpLnZhbCgpO1xyXG5cclxuICAgICAgICBpZiAodGV4dC50cmltKCkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+e1xyXG4gICAgICAgICAgICAgICAgX2lkOiBuZXdpZCgpLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICAgICAgICAgIHRleHRDb2xvcjogJCgnI3RleHRDb2xvcicpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAkKCcjYmFja2dyb3VuZENvbG9yJykudmFsKCksXHJcbiAgICAgICAgICAgICAgICAvL25vIHRoaXMgYmluZGluZz8/Pz9cclxuICAgICAgICAgICAgICAgIGZvbnQ6IHRoaXMuZm9udHNbMF1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5za2V0Y2gudGV4dEJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgICAgICAgICAgdGhpcy5za2V0Y2gub25DaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIEZvbnRMb2FkZXIge1xyXG5cclxuICAgIGlzTG9hZGVkOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnRVcmw6IHN0cmluZywgb25Mb2FkZWQ6IChmb250OiBvcGVudHlwZS5Gb250KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgb3BlbnR5cGUubG9hZChmb250VXJsLCBmdW5jdGlvbihlcnIsIGZvbnQpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9uTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgb25Mb2FkZWQuY2FsbCh0aGlzLCBmb250KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiXHJcbmZ1bmN0aW9uIG5ld2lkKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gKG5ldyBEYXRlKCkuZ2V0VGltZSgpK01hdGgucmFuZG9tKCkpLnRvU3RyaW5nKDM2KTtcclxufVxyXG4iLCJcclxuY2xhc3MgU2tldGNoIGltcGxlbWVudHMgQ2hhbmdlTm90aWZpZXIge1xyXG4gICAgXHJcbiAgICB0ZXh0QmxvY2tzOiBUZXh0QmxvY2tbXSA9IFtdO1xyXG4gICAgXHJcbiAgICAvLyB0aGlzIGlzIGZyYWdpbGU6IG5lZWQgcmVhbCBwdWItc3ViXHJcbiAgICBvbkNoYW5nZWQ6ICgpID0+IHZvaWQ7XHJcbiAgICBcclxufSIsIlxyXG5pbnRlcmZhY2UgVGV4dEJsb2NrIHtcclxuICAgIF9pZDogc3RyaW5nO1xyXG4gICAgdGV4dDogc3RyaW5nO1xyXG4gICAgaXRlbTogcGFwZXIuSXRlbTtcclxuICAgIHRleHRDb2xvcjogc3RyaW5nO1xyXG4gICAgYmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XHJcbiAgICBmb250OiBvcGVudHlwZS5Gb250O1xyXG59IiwiXHJcbmNsYXNzIFdvcmtzcGFjZSBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuICAgIFxyXG4gICAgc2hlZXQ6IHBhcGVyLlNoYXBlO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihzaXplOiBwYXBlci5TaXplKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzaGVldCA9IHBhcGVyLlNoYXBlLlJlY3RhbmdsZShcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsMCksIHNpemUpO1xyXG4gICAgICAgIHNoZWV0LmZpbGxDb2xvciA9ICcjRjJGMUUxJztcclxuICAgICAgICBzaGVldC5zdHlsZS5zaGFkb3dDb2xvciA9ICdncmF5JzsgXHJcbiAgICAgICAgc2hlZXQuc3R5bGUuc2hhZG93Qmx1ciA9IDY7XHJcbiAgICAgICAgc2hlZXQuc3R5bGUuc2hhZG93T2Zmc2V0ID0gbmV3IHBhcGVyLlBvaW50KDUsIDUpXHJcbiAgICAgICAgdGhpcy5zaGVldCA9IHNoZWV0O1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoc2hlZXQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IDxNb3VzZUJlaGF2aW9yPiB7XHJcbiAgICAgICAgICAgIG9uQ2xpY2s6IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGFwZXIucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBlID0+IHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZChlLmRlbHRhKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBXb3Jrc3BhY2VDb250cm9sbGVyIHtcclxuXHJcbiAgICBkZWZhdWx0U2l6ZSA9IG5ldyBwYXBlci5TaXplKDQwMDAsIDMwMDApO1xyXG5cclxuICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICB3b3Jrc3BhY2U6IFdvcmtzcGFjZTtcclxuICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3NrZXRjaDogU2tldGNoO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHBhcGVyLnNldHRpbmdzLmhhbmRsZVNpemUgPSAxO1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkNhbnZhcycpO1xyXG4gICAgICAgIHBhcGVyLnNldHVwKHRoaXMuY2FudmFzKTtcclxuICAgICAgICB0aGlzLnByb2plY3QgPSBwYXBlci5wcm9qZWN0O1xyXG5cclxuICAgICAgICBuZXcgTW91c2VCZWhhdmlvclRvb2wodGhpcy5wcm9qZWN0KTtcclxuXHJcbiAgICAgICAgbGV0IG1vdXNlWm9vbSA9IG5ldyBWaWV3Wm9vbSh0aGlzLnByb2plY3QpO1xyXG4gICAgICAgIHRoaXMud29ya3NwYWNlID0gbmV3IFdvcmtzcGFjZSh0aGlzLmRlZmF1bHRTaXplKTtcclxuICAgICAgICBsZXQgc2hlZXRCb3VuZHMgPSB0aGlzLndvcmtzcGFjZS5zaGVldC5ib3VuZHM7XHJcbiAgICAgICAgbW91c2Vab29tLnNldFpvb21SYW5nZShcclxuICAgICAgICAgICAgW3NoZWV0Qm91bmRzLnNjYWxlKDAuMDIpLnNpemUsIHNoZWV0Qm91bmRzLnNjYWxlKDEuMSkuc2l6ZV0pO1xyXG4gICAgICAgIG1vdXNlWm9vbS56b29tVG8oc2hlZXRCb3VuZHMuc2NhbGUoMC41KSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNrZXRjaCh2YWx1ZTogU2tldGNoKXtcclxuICAgICAgICB0aGlzLl9za2V0Y2ggPSB2YWx1ZTtcclxuICAgICAgICBpZih0aGlzLl9za2V0Y2gpe1xyXG4gICAgICAgICAgICB0aGlzLl9za2V0Y2gub25DaGFuZ2VkID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2tldGNoLm9uQ2hhbmdlZCA9ICgpID0+IHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHNrZXRjaCgpIDogU2tldGNoIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2tldGNoO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICBmb3IgKGxldCBibG9jayBvZiB0aGlzLl9za2V0Y2gudGV4dEJsb2Nrcykge1xyXG4gICAgICAgICAgICBpZiAoIWJsb2NrLml0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZXh0QmxvY2sgPSBuZXcgU3RyZXRjaHlUZXh0KGJsb2NrLnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZm9udCxcclxuICAgICAgICAgICAgICAgICAgICA8U3RyZXRjaHlUZXh0T3B0aW9ucz57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMjgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhGaWxsQ29sb3I6IGJsb2NrLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBibG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMud29ya3NwYWNlLmFkZENoaWxkKHRleHRCbG9jayk7XHJcbiAgICAgICAgICAgICAgICB0ZXh0QmxvY2sucG9zaXRpb24gPSB0aGlzLnByb2plY3Qudmlldy5ib3VuZHMucG9pbnQuYWRkKFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCh0ZXh0QmxvY2suYm91bmRzLndpZHRoIC8gMiwgdGV4dEJsb2NrLmJvdW5kcy5oZWlnaHQgLyAyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKDUwKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgYmxvY2suaXRlbSA9IHRleHRCbG9jaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIlxyXG5pbnRlcmZhY2UgQ2hhbmdlTm90aWZpZXIge1xyXG4gICAgXHJcbn1cclxuXHJcbmNsYXNzIE5vdGlmeUFycmF5IGV4dGVuZHMgQXJyYXkgaW1wbGVtZW50cyBDaGFuZ2VOb3RpZmllciB7XHJcbiAgICBvbkNoYW5nZWQ6ICgpID0+IHZvaWQ7ICAgIFxyXG59XHJcbiIsIlxyXG5cclxubGV0IFRleHRCbG9ja0VkaXQgPSBmdW5jdGlvbih7RE9NLCBwcm9wcyR9KSA6IFxyXG4gICAgeyBET006IFJ4Lk9ic2VydmFibGU8YW55PiwgdGV4dCQ6IFJ4Lk9ic2VydmFibGU8c3RyaW5nPiB9IFxyXG57XHJcblxyXG4gICAgbGV0IG5ld1ZhbHVlJCA9IERPTS5zZWxlY3QoJy50ZXh0LWJsb2NrLWVkaXQnKVxyXG4gICAgICAgIC5ldmVudHMoJ2lucHV0JylcclxuICAgICAgICAubWFwKGV2ID0+IGV2LnRhcmdldC52YWx1ZSk7XHJcblxyXG4gICAgbGV0IHZ0cmVlJCA9IFJ4Lk9ic2VydmFibGUuY29tYmluZUxhdGVzdChwcm9wcyQsIChwcm9wczogYW55LCB2YWx1ZSkgPT5cclxuICAgICAgICBDeWNsZURPTS5kaXYoJy50ZXh0LWJsb2NrLWVkaXQnLCBbXHJcbiAgICAgICAgICAgIEN5Y2xlRE9NLnRleHRhcmVhKCcudGV4dCcsIFsnZm9vJ10pXHJcbiAgICAgICAgXSlcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBET006IHZ0cmVlJCxcclxuICAgICAgICB0ZXh0JDogbmV3VmFsdWUkXHJcbiAgICB9O1xyXG59IiwiXHJcbmxldCBEZXNpZ25lckh0bWxBcHAgPSBmdW5jdGlvbih7RE9NfSkge1xyXG5cclxuICAgIGxldCBlZGl0UHJvcHMkID0gUnguT2JzZXJ2YWJsZS5qdXN0KHtcclxuICAgICAgICB0ZXh0OiAnV0hJRkZMRVMnXHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgYmxvY2tFZGl0ID0gVGV4dEJsb2NrRWRpdCh7IERPTSwgcHJvcHMkOiBlZGl0UHJvcHMkIH0pO1xyXG5cclxuICAgIGJsb2NrRWRpdC50ZXh0JC5zdWJzY3JpYmUodCA9PiBjb25zb2xlLmxvZyh0KSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBET006IGJsb2NrRWRpdC5ET01cclxuICAgIH1cclxufVxyXG5cclxuQ3ljbGUucnVuKERlc2lnbmVySHRtbEFwcCwge1xyXG4gICAgRE9NOiBDeWNsZURPTS5tYWtlRE9NRHJpdmVyKCcjY3ljbGUtYXBwJyksXHJcbiAgICBwcm9wcyQ6ICgpID0+IFJ4Lk9ic2VydmFibGUuZnJvbShbe31dKVxyXG59KTtcclxuXHJcbiAgICBcclxuICAgICIsIlxyXG5kZWNsYXJlIHZhciBzb2x2ZTogKGE6IGFueSwgYjogYW55LCBmYXN0OiBib29sZWFuKSA9PiB2b2lkO1xyXG5cclxuY2xhc3MgUGVyc3BlY3RpdmVUcmFuc2Zvcm0ge1xyXG4gICAgXHJcbiAgICBzb3VyY2U6IFF1YWQ7XHJcbiAgICBkZXN0OiBRdWFkO1xyXG4gICAgcGVyc3A6IGFueTtcclxuICAgIG1hdHJpeDogbnVtYmVyW107XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZTogUXVhZCwgZGVzdDogUXVhZCl7XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5kZXN0ID0gZGVzdDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm1hdHJpeCA9IFBlcnNwZWN0aXZlVHJhbnNmb3JtLmNyZWF0ZU1hdHJpeChzb3VyY2UsIGRlc3QpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBHaXZlbiBhIDR4NCBwZXJzcGVjdGl2ZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXgsIGFuZCBhIDJEIHBvaW50IChhIDJ4MSB2ZWN0b3IpLFxyXG4gICAgLy8gYXBwbGllcyB0aGUgdHJhbnNmb3JtYXRpb24gbWF0cml4IGJ5IGNvbnZlcnRpbmcgdGhlIHBvaW50IHRvIGhvbW9nZW5lb3VzXHJcbiAgICAvLyBjb29yZGluYXRlcyBhdCB6PTAsIHBvc3QtbXVsdGlwbHlpbmcsIGFuZCB0aGVuIGFwcGx5aW5nIGEgcGVyc3BlY3RpdmUgZGl2aWRlLlxyXG4gICAgdHJhbnNmb3JtUG9pbnQocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIGxldCBwMyA9IFBlcnNwZWN0aXZlVHJhbnNmb3JtLm11bHRpcGx5KHRoaXMubWF0cml4LCBbcG9pbnQueCwgcG9pbnQueSwgMCwgMV0pO1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgcGFwZXIuUG9pbnQocDNbMF0gLyBwM1szXSwgcDNbMV0gLyBwM1szXSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGNyZWF0ZU1hdHJpeChzb3VyY2U6IFF1YWQsIHRhcmdldDogUXVhZCk6IG51bWJlcltdIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc291cmNlUG9pbnRzID0gW1xyXG4gICAgICAgICAgICBbc291cmNlLmEueCwgc291cmNlLmEueV0sIFxyXG4gICAgICAgICAgICBbc291cmNlLmIueCwgc291cmNlLmIueV0sIFxyXG4gICAgICAgICAgICBbc291cmNlLmMueCwgc291cmNlLmMueV0sIFxyXG4gICAgICAgICAgICBbc291cmNlLmQueCwgc291cmNlLmQueV1dO1xyXG4gICAgICAgIGxldCB0YXJnZXRQb2ludHMgPSBbXHJcbiAgICAgICAgICAgIFt0YXJnZXQuYS54LCB0YXJnZXQuYS55XSwgXHJcbiAgICAgICAgICAgIFt0YXJnZXQuYi54LCB0YXJnZXQuYi55XSwgXHJcbiAgICAgICAgICAgIFt0YXJnZXQuYy54LCB0YXJnZXQuYy55XSwgXHJcbiAgICAgICAgICAgIFt0YXJnZXQuZC54LCB0YXJnZXQuZC55XV07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IFtdLCBiID0gW10sIGkgPSAwLCBuID0gc291cmNlUG9pbnRzLmxlbmd0aDsgaSA8IG47ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgcyA9IHNvdXJjZVBvaW50c1tpXSwgdCA9IHRhcmdldFBvaW50c1tpXTtcclxuICAgICAgICAgICAgYS5wdXNoKFtzWzBdLCBzWzFdLCAxLCAwLCAwLCAwLCAtc1swXSAqIHRbMF0sIC1zWzFdICogdFswXV0pLCBiLnB1c2godFswXSk7XHJcbiAgICAgICAgICAgIGEucHVzaChbMCwgMCwgMCwgc1swXSwgc1sxXSwgMSwgLXNbMF0gKiB0WzFdLCAtc1sxXSAqIHRbMV1dKSwgYi5wdXNoKHRbMV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IFggPSBzb2x2ZShhLCBiLCB0cnVlKTsgXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgWFswXSwgWFszXSwgMCwgWFs2XSxcclxuICAgICAgICAgICAgWFsxXSwgWFs0XSwgMCwgWFs3XSxcclxuICAgICAgICAgICAgICAgMCwgICAgMCwgMSwgICAgMCxcclxuICAgICAgICAgICAgWFsyXSwgWFs1XSwgMCwgICAgMVxyXG4gICAgICAgIF0ubWFwKGZ1bmN0aW9uKHgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoeCAqIDEwMDAwMCkgLyAxMDAwMDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUG9zdC1tdWx0aXBseSBhIDR4NCBtYXRyaXggaW4gY29sdW1uLW1ham9yIG9yZGVyIGJ5IGEgNHgxIGNvbHVtbiB2ZWN0b3I6XHJcbiAgICAvLyBbIG0wIG00IG04ICBtMTIgXSAgIFsgdjAgXSAgIFsgeCBdXHJcbiAgICAvLyBbIG0xIG01IG05ICBtMTMgXSAqIFsgdjEgXSA9IFsgeSBdXHJcbiAgICAvLyBbIG0yIG02IG0xMCBtMTQgXSAgIFsgdjIgXSAgIFsgeiBdXHJcbiAgICAvLyBbIG0zIG03IG0xMSBtMTUgXSAgIFsgdjMgXSAgIFsgdyBdXHJcbiAgICBzdGF0aWMgbXVsdGlwbHkobWF0cml4LCB2ZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBtYXRyaXhbMF0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNF0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbOCBdICogdmVjdG9yWzJdICsgbWF0cml4WzEyXSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzFdICogdmVjdG9yWzBdICsgbWF0cml4WzVdICogdmVjdG9yWzFdICsgbWF0cml4WzkgXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxM10gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFsyXSAqIHZlY3RvclswXSArIG1hdHJpeFs2XSAqIHZlY3RvclsxXSArIG1hdHJpeFsxMF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTRdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbM10gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbN10gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbMTFdICogdmVjdG9yWzJdICsgbWF0cml4WzE1XSAqIHZlY3RvclszXVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFF1YWQge1xyXG4gICAgYTogcGFwZXIuUG9pbnQ7XHJcbiAgICBiOiBwYXBlci5Qb2ludDtcclxuICAgIGM6IHBhcGVyLlBvaW50O1xyXG4gICAgZDogcGFwZXIuUG9pbnQ7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCwgYzogcGFwZXIuUG9pbnQsIGQ6IHBhcGVyLlBvaW50KXtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgICAgIHRoaXMuYiA9IGI7XHJcbiAgICAgICAgdGhpcy5jID0gYztcclxuICAgICAgICB0aGlzLmQgPSBkO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgZnJvbVJlY3RhbmdsZShyZWN0OiBwYXBlci5SZWN0YW5nbGUpe1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhZChcclxuICAgICAgICAgICAgcmVjdC50b3BMZWZ0LFxyXG4gICAgICAgICAgICByZWN0LnRvcFJpZ2h0LFxyXG4gICAgICAgICAgICByZWN0LmJvdHRvbUxlZnQsXHJcbiAgICAgICAgICAgIHJlY3QuYm90dG9tUmlnaHRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgZnJvbUNvb3Jkcyhjb29yZHM6IG51bWJlcltdKSA6IFF1YWQge1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhZChcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1swXSwgY29vcmRzWzFdKSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1syXSwgY29vcmRzWzNdKSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1s0XSwgY29vcmRzWzVdKSxcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGNvb3Jkc1s2XSwgY29vcmRzWzddKVxyXG4gICAgICAgIClcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXNDb29yZHMoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHRoaXMuYS54LCB0aGlzLmEueSxcclxuICAgICAgICAgICAgdGhpcy5iLngsIHRoaXMuYi55LFxyXG4gICAgICAgICAgICB0aGlzLmMueCwgdGhpcy5jLnksXHJcbiAgICAgICAgICAgIHRoaXMuZC54LCB0aGlzLmQueVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn0iLCJcclxuLyoqXHJcbiAqIEhhbmRsZSB0aGF0IHNpdHMgb24gbWlkcG9pbnQgb2YgY3VydmVcclxuICogICB3aGljaCB3aWxsIHNwbGl0IHRoZSBjdXJ2ZSB3aGVuIGRyYWdnZWQuXHJcbiAqL1xyXG5jbGFzcyBDdXJ2ZVNwbGl0dGVySGFuZGxlIGV4dGVuZHMgcGFwZXIuU2hhcGUge1xyXG4gXHJcbiAgICBjdXJ2ZTogcGFwZXIuQ3VydmU7XHJcbiAgICBvbkRyYWdFbmQ6IChuZXdTZWdtZW50OiBwYXBlci5TZWdtZW50LCBldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gXHJcbiAgICBjb25zdHJ1Y3RvcihjdXJ2ZTogcGFwZXIuQ3VydmUpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VydmUgPSBjdXJ2ZTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc2VsZiA9IDxhbnk+dGhpcztcclxuICAgICAgICBzZWxmLl90eXBlID0gJ2NpcmNsZSc7XHJcbiAgICAgICAgc2VsZi5fcmFkaXVzID0gMTU7XHJcbiAgICAgICAgc2VsZi5fc2l6ZSA9IG5ldyBwYXBlci5TaXplKHNlbGYuX3JhZGl1cyAqIDIpO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKGN1cnZlLmdldFBvaW50QXQoMC41ICogY3VydmUubGVuZ3RoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDI7XHJcbiAgICAgICAgdGhpcy5zdHJva2VDb2xvciA9ICdibHVlJztcclxuICAgICAgICB0aGlzLmZpbGxDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gMC41ICogMC4zOyBcclxuIFxyXG4gICAgICAgIGxldCBuZXdTZWdtZW50OiBwYXBlci5TZWdtZW50O1xyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IDxNb3VzZUJlaGF2aW9yPntcclxuICAgICAgICAgICAgb25EcmFnU3RhcnQ6IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudCA9IG5ldyBwYXBlci5TZWdtZW50KHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY3VydmUucGF0aC5pbnNlcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmUuaW5kZXggKyAxLCBcclxuICAgICAgICAgICAgICAgICAgICBuZXdTZWdtZW50XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3UG9zID0gdGhpcy5wb3NpdGlvbi5hZGQoZXZlbnQuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ld1BvcztcclxuICAgICAgICAgICAgICAgIG5ld1NlZ21lbnQucG9pbnQgPSBuZXdQb3M7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ0VuZDogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkRyYWdFbmQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25EcmFnRW5kKG5ld1NlZ21lbnQsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcclxuICAgIGludGVyZmFjZSBJdGVtIHtcclxuICAgICAgICBtb3VzZUJlaGF2aW9yOiBNb3VzZUJlaGF2aW9yO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgTW91c2VCZWhhdmlvciB7XHJcbiAgICBvbkNsaWNrPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gICAgb25PdmVyU3RhcnQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uT3Zlck1vdmU/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uT3ZlckVuZD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICAgIG9uRHJhZ1N0YXJ0PzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbkRyYWdNb3ZlPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbkRyYWdFbmQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxufVxyXG5cclxuaW50ZXJmYWNlIE1vdXNlQWN0aW9uIHtcclxuICAgIHN0YXJ0RXZlbnQ6IHBhcGVyLlRvb2xFdmVudDtcclxuICAgIGl0ZW06IHBhcGVyLkl0ZW07XHJcbiAgICBkcmFnZ2VkOiBib29sZWFuO1xyXG59XHJcblxyXG5jbGFzcyBNb3VzZUJlaGF2aW9yVG9vbCBleHRlbmRzIHBhcGVyLlRvb2wge1xyXG5cclxuICAgIGhpdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgc2VnbWVudHM6IHRydWUsXHJcbiAgICAgICAgc3Ryb2tlOiB0cnVlLFxyXG4gICAgICAgIGZpbGw6IHRydWUsXHJcbiAgICAgICAgdG9sZXJhbmNlOiA1XHJcbiAgICB9O1xyXG5cclxuICAgIHByZXNzQWN0aW9uOiBNb3VzZUFjdGlvbjtcclxuICAgIGhvdmVyQWN0aW9uOiBNb3VzZUFjdGlvbjtcclxuICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvamVjdDogcGFwZXIuUHJvamVjdCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93biA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIHRoaXMucHJlc3NBY3Rpb24gPSBudWxsO1xyXG5cclxuICAgICAgICB2YXIgaGl0UmVzdWx0ID0gdGhpcy5wcm9qZWN0LmhpdFRlc3QoXHJcbiAgICAgICAgICAgIGV2ZW50LnBvaW50LFxyXG4gICAgICAgICAgICB0aGlzLmhpdE9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAoaGl0UmVzdWx0ICYmIGhpdFJlc3VsdC5pdGVtKSB7XHJcbiAgICAgICAgICAgIGxldCBkcmFnZ2FibGUgPSB0aGlzLmZpbmREcmFnSGFuZGxlcihoaXRSZXN1bHQuaXRlbSk7XHJcbiAgICAgICAgICAgIGlmIChkcmFnZ2FibGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24gPSA8TW91c2VBY3Rpb24+e1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06IGRyYWdnYWJsZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlTW92ZSA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIHZhciBoaXRSZXN1bHQgPSB0aGlzLnByb2plY3QuaGl0VGVzdChcclxuICAgICAgICAgICAgZXZlbnQucG9pbnQsXHJcbiAgICAgICAgICAgIHRoaXMuaGl0T3B0aW9ucyk7XHJcbiAgICAgICAgbGV0IGhhbmRsZXJJdGVtID0gaGl0UmVzdWx0XHJcbiAgICAgICAgICAgICYmIHRoaXMuZmluZE92ZXJIYW5kbGVyKGhpdFJlc3VsdC5pdGVtKTtcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAvLyB3ZXJlIHByZXZpb3VzbHkgaG92ZXJpbmdcclxuICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvblxyXG4gICAgICAgICAgICAmJiAoXHJcbiAgICAgICAgICAgICAgICAvLyBub3QgaG92ZXJpbmcgb3ZlciBhbnl0aGluZyBub3dcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJJdGVtID09IG51bGxcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBob3ZlcmluZyBvdmVyIGN1cnJlbnQgaGFuZGxlciBvciBkZXNjZW5kZW50IHRoZXJlb2ZcclxuICAgICAgICAgICAgICAgIHx8ICFNb3VzZUJlaGF2aW9yVG9vbC5pc1NhbWVPckFuY2VzdG9yKFxyXG4gICAgICAgICAgICAgICAgICAgIGhpdFJlc3VsdC5pdGVtLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24uaXRlbSkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vIGp1c3QgbGVhdmluZ1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ob3ZlckFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25PdmVyRW5kKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbk92ZXJFbmQoZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGhhbmRsZXJJdGVtICYmIGhhbmRsZXJJdGVtLm1vdXNlQmVoYXZpb3IpIHtcclxuICAgICAgICAgICAgbGV0IGJlaGF2aW9yID0gaGFuZGxlckl0ZW0ubW91c2VCZWhhdmlvcjtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhvdmVyQWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uID0gPE1vdXNlQWN0aW9uPntcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiBoYW5kbGVySXRlbVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmIChiZWhhdmlvci5vbk92ZXJTdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yLm9uT3ZlclN0YXJ0KGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYmVoYXZpb3IgJiYgYmVoYXZpb3Iub25PdmVyTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgYmVoYXZpb3Iub25PdmVyTW92ZShldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURyYWcgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5wcmVzc0FjdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucHJlc3NBY3Rpb24uZHJhZ2dlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5kcmFnZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdTdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ1N0YXJ0LmNhbGwoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24uaXRlbSwgdGhpcy5wcmVzc0FjdGlvbi5zdGFydEV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnTW92ZS5jYWxsKHRoaXMucHJlc3NBY3Rpb24uaXRlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGxldCBhY3Rpb24gPSB0aGlzLnByZXNzQWN0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChhY3Rpb24uZHJhZ2dlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gZHJhZ1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnRW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdFbmQuY2FsbChhY3Rpb24uaXRlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY2xpY2tcclxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uQ2xpY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uQ2xpY2suY2FsbChhY3Rpb24uaXRlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uS2V5RG93biA9IChldmVudCkgPT4ge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZSBpZiBjb250YWluZXIgaXMgYW4gYW5jZXN0b3Igb2YgaXRlbS4gXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpc1NhbWVPckFuY2VzdG9yKGl0ZW06IHBhcGVyLkl0ZW0sIGNvbnRhaW5lcjogcGFwZXIuSXRlbSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhIVBhcGVySGVscGVycy5maW5kU2VsZk9yQW5jZXN0b3IoaXRlbSwgcGEgPT4gcGEgPT09IGNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZERyYWdIYW5kbGVyKGl0ZW06IHBhcGVyLkl0ZW0pOiBwYXBlci5JdGVtIHtcclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvcihcclxuICAgICAgICAgICAgaXRlbSwgXHJcbiAgICAgICAgICAgIHBhID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYiA9IHBhLm1vdXNlQmVoYXZpb3I7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gISEobWIgJiZcclxuICAgICAgICAgICAgICAgICAgICAobWIub25EcmFnU3RhcnQgfHwgbWIub25EcmFnTW92ZSB8fCBtYi5vbkRyYWdFbmQpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZpbmRPdmVySGFuZGxlcihpdGVtOiBwYXBlci5JdGVtKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kU2VsZk9yQW5jZXN0b3IoXHJcbiAgICAgICAgICAgIGl0ZW0sIFxyXG4gICAgICAgICAgICBwYSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWIgPSBwYS5tb3VzZUJlaGF2aW9yO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKG1iICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKG1iLm9uT3ZlclN0YXJ0IHx8IG1iLm9uT3Zlck1vdmUgfHwgbWIub25PdmVyRW5kICkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgUGFwZXJIZWxwZXJzIHtcclxuXHJcbiAgICBzdGF0aWMgaW1wb3J0T3BlblR5cGVQYXRoKG9wZW5QYXRoOiBvcGVudHlwZS5QYXRoKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChvcGVuUGF0aC50b1BhdGhEYXRhKCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGxldCBzdmcgPSBvcGVuUGF0aC50b1NWRyg0KTtcclxuICAgICAgICAvLyByZXR1cm4gPHBhcGVyLlBhdGg+cGFwZXIucHJvamVjdC5pbXBvcnRTVkcoc3ZnKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdHJhY2VQYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuUGF0aEl0ZW0ge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VDb21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgsIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgaWYgKCFwYXRoLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBhdGhzID0gcGF0aC5jaGlsZHJlbi5tYXAocCA9PlxyXG4gICAgICAgICAgICB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wLCBwb2ludHNQZXJQYXRoKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgoe1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogcGF0aHMsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZVBhdGgocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAvLyBpZighcGF0aCB8fCAhcGF0aC5zZWdtZW50cyB8fCBwYXRoLnNlZ21lbnRzLmxlbmd0aCl7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBsZXQgcGF0aExlbmd0aCA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGxldCBvZmZzZXRJbmNyID0gcGF0aExlbmd0aCAvIG51bVBvaW50cztcclxuICAgICAgICBsZXQgcG9pbnRzID0gW107XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAoaSsrIDwgbnVtUG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IHBhdGguZ2V0UG9pbnRBdChNYXRoLm1pbihvZmZzZXQsIHBhdGhMZW5ndGgpKTtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gb2Zmc2V0SW5jcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgIHNlZ21lbnRzOiBwb2ludHMsXHJcbiAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzYW5kd2ljaFBhdGhQcm9qZWN0aW9uKHRvcFBhdGg6IHBhcGVyLkN1cnZlbGlrZSwgYm90dG9tUGF0aDogcGFwZXIuQ3VydmVsaWtlKVxyXG4gICAgICAgIDogKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBjb25zdCB0b3BQYXRoTGVuZ3RoID0gdG9wUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgYm90dG9tUGF0aExlbmd0aCA9IGJvdHRvbVBhdGgubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbih1bml0UG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgICAgICBsZXQgdG9wUG9pbnQgPSB0b3BQYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiB0b3BQYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICAgbGV0IGJvdHRvbVBvaW50ID0gYm90dG9tUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogYm90dG9tUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGlmICh0b3BQb2ludCA9PSBudWxsIHx8IGJvdHRvbVBvaW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiY291bGQgbm90IGdldCBwcm9qZWN0ZWQgcG9pbnQgZm9yIHVuaXQgcG9pbnQgXCIgKyB1bml0UG9pbnQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdG9wUG9pbnQuYWRkKGJvdHRvbVBvaW50LnN1YnRyYWN0KHRvcFBvaW50KS5tdWx0aXBseSh1bml0UG9pbnQueSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyR3JvdXA6IHBhcGVyLkdyb3VwO1xyXG5cclxuICAgIHN0YXRpYyByZXNldE1hcmtlcnMoKXtcclxuICAgICAgICBpZihQYXBlckhlbHBlcnMubWFya2VyR3JvdXApe1xyXG4gICAgICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5vcGFjaXR5ID0gMC4yO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXJrZXJMaW5lKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCk6IHBhcGVyLkl0ZW17XHJcbiAgICAgICAgbGV0IGxpbmUgPSBwYXBlci5QYXRoLkxpbmUoYSxiKTtcclxuICAgICAgICBsaW5lLnN0cm9rZUNvbG9yID0gJ2dyZWVuJztcclxuICAgICAgICAvL2xpbmUuZGFzaEFycmF5ID0gWzUsIDVdO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChsaW5lKTtcclxuICAgICAgICByZXR1cm4gbGluZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyKHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIGxldCBtYXJrZXIgPSBwYXBlci5TaGFwZS5DaXJjbGUocG9pbnQsIDIpO1xyXG4gICAgICAgIG1hcmtlci5zdHJva2VDb2xvciA9ICdyZWQnO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChtYXJrZXIpO1xyXG4gICAgICAgIHJldHVybiBtYXJrZXI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNpbXBsaWZ5KHBhdGg6IHBhcGVyLlBhdGhJdGVtLCB0b2xlcmFuY2U/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNpbXBsaWZ5KDxwYXBlci5QYXRoSXRlbT5wLCB0b2xlcmFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKDxwYXBlci5QYXRoPnBhdGgpLnNpbXBsaWZ5KHRvbGVyYW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluZCBzZWxmIG9yIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovICAgIFxyXG4gICAgc3RhdGljIGZpbmRTZWxmT3JBbmNlc3RvcihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKXtcclxuICAgICAgICBpZihwcmVkaWNhdGUoaXRlbSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kQW5jZXN0b3IoaXRlbSwgcHJlZGljYXRlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZmluZEFuY2VzdG9yKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pe1xyXG4gICAgICAgIGlmKCFpdGVtKXtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwcmlvcjogcGFwZXIuSXRlbTtcclxuICAgICAgICBsZXQgY2hlY2tpbmcgPSBpdGVtLnBhcmVudDtcclxuICAgICAgICB3aGlsZShjaGVja2luZyAmJiBjaGVja2luZyAhPT0gcHJpb3Ipe1xyXG4gICAgICAgICAgICBpZihwcmVkaWNhdGUoY2hlY2tpbmcpKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjaGVja2luZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmlvciA9IGNoZWNraW5nO1xyXG4gICAgICAgICAgICBjaGVja2luZyA9IGNoZWNraW5nLnBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogVGhlIGNvcm5lcnMgb2YgdGhlIHJlY3QsIGNsb2Nrd2lzZSBzdGFydGluZyBmcm9tIHRvcExlZnRcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvcm5lcnMocmVjdDogcGFwZXIuUmVjdGFuZ2xlKTogcGFwZXIuUG9pbnRbXXtcclxuICAgICAgICByZXR1cm4gW3JlY3QudG9wTGVmdCwgcmVjdC50b3BSaWdodCwgcmVjdC5ib3R0b21SaWdodCwgcmVjdC5ib3R0b21MZWZ0XTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBQYXRoU2VjdGlvbiBpbXBsZW1lbnRzIHBhcGVyLkN1cnZlbGlrZSB7XHJcbiAgICBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgb2Zmc2V0OiBudW1iZXI7XHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocGF0aDogcGFwZXIuUGF0aCwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRQb2ludEF0KG9mZnNldDogbnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXRoLmdldFBvaW50QXQob2Zmc2V0ICsgdGhpcy5vZmZzZXQpO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFBhdGhUcmFuc2Zvcm0ge1xyXG4gICAgcG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRUcmFuc2Zvcm0gPSBwb2ludFRyYW5zZm9ybTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRUcmFuc2Zvcm0ocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBhdGhJdGVtKHBhdGg6IHBhcGVyLlBhdGhJdGVtKSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtQ29tcG91bmRQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCkge1xyXG4gICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBhdGgocGF0aDogcGFwZXIuUGF0aCkge1xyXG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2YgcGF0aC5zZWdtZW50cykge1xyXG4gICAgICAgICAgICBsZXQgb3JpZ1BvaW50ID0gc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgbGV0IG5ld1BvaW50ID0gdGhpcy50cmFuc2Zvcm1Qb2ludChzZWdtZW50LnBvaW50KTtcclxuICAgICAgICAgICAgb3JpZ1BvaW50LnggPSBuZXdQb2ludC54O1xyXG4gICAgICAgICAgICBvcmlnUG9pbnQueSA9IG5ld1BvaW50Lnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbiIsIlxyXG5jbGFzcyBTZWdtZW50SGFuZGxlIGV4dGVuZHMgcGFwZXIuU2hhcGUge1xyXG4gXHJcbiAgICBzZWdtZW50OiBwYXBlci5TZWdtZW50O1xyXG4gICAgb25DaGFuZ2VDb21wbGV0ZTogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3Ntb290aGVkOiBib29sZWFuO1xyXG4gXHJcbiAgICBjb25zdHJ1Y3RvcihzZWdtZW50OiBwYXBlci5TZWdtZW50LCByYWRpdXM/OiBudW1iZXIpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZWdtZW50ID0gc2VnbWVudDtcclxuXHJcbiAgICAgICAgbGV0IHNlbGYgPSA8YW55PnRoaXM7XHJcbiAgICAgICAgc2VsZi5fdHlwZSA9ICdjaXJjbGUnO1xyXG4gICAgICAgIHNlbGYuX3JhZGl1cyA9IDE1O1xyXG4gICAgICAgIHNlbGYuX3NpemUgPSBuZXcgcGFwZXIuU2l6ZShzZWxmLl9yYWRpdXMgKiAyKTtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShzZWdtZW50LnBvaW50KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0cm9rZVdpZHRoID0gMjtcclxuICAgICAgICB0aGlzLnN0cm9rZUNvbG9yID0gJ2JsdWUnO1xyXG4gICAgICAgIHRoaXMuZmlsbENvbG9yID0gJ3doaXRlJztcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAwLjc7IFxyXG5cclxuICAgICAgICB0aGlzLm1vdXNlQmVoYXZpb3IgPSA8TW91c2VCZWhhdmlvcj57XHJcbiAgICAgICAgICAgIG9uRHJhZ01vdmU6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdQb3MgPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zO1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5wb2ludCA9IG5ld1BvcztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnRW5kOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9zbW9vdGhlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkNoYW5nZUNvbXBsZXRlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbmdlQ29tcGxldGUoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkNsaWNrOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNtb290aGVkID0gIXRoaXMuc21vb3RoZWQ7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uQ2hhbmdlQ29tcGxldGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DaGFuZ2VDb21wbGV0ZShldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBzbW9vdGhlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc21vb3RoZWQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldCBzbW9vdGhlZCh2YWx1ZTogYm9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5fc21vb3RoZWQgPSB2YWx1ZTtcclxuICAgICAgICBcclxuICAgICAgICBpZih2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50LmhhbmRsZU91dCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoeVBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgb3B0aW9uczogU3RyZXRjaHlQYXRoT3B0aW9ucztcclxuICAgICAgICBcclxuICAgIHNvdXJjZVBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIGRpc3BsYXlQYXRoOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBjb3JuZXJzOiBwYXBlci5TZWdtZW50W107XHJcbiAgICBvdXRsaW5lOiBwYXBlci5QYXRoO1xyXG4gICAgXHJcbiAgICBzdGF0aWMgT1VUTElORV9QT0lOVFMgPSAyMzA7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRm9yIHJlYnVpbGRpbmcgdGhlIG1pZHBvaW50IGhhbmRsZXNcclxuICAgICAqIGFzIG91dGxpbmUgY2hhbmdlcy5cclxuICAgICAqL1xyXG4gICAgbWlkcG9pbnRHcm91cDogcGFwZXIuR3JvdXA7XHJcbiAgICBzZWdtZW50R3JvdXA6IHBhcGVyLkdyb3VwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZVBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCwgb3B0aW9ucz86IFN0cmV0Y2h5UGF0aE9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IDxTdHJldGNoeVBhdGhPcHRpb25zPntcclxuICAgICAgICAgICAgcGF0aEZpbGxDb2xvcjogJ2dyYXknXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXRoID0gc291cmNlUGF0aDtcclxuICAgICAgICB0aGlzLnNvdXJjZVBhdGgudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZU91dGxpbmUoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVNlZ21lbnRNYXJrZXJzKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNaWRwaW9udE1hcmtlcnMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0ge1xyXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ1N0YXJ0OiAoKSA9PiB0aGlzLmJyaW5nVG9Gcm9udCgpLFxyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uT3ZlclN0YXJ0OiAoKSA9PiB0aGlzLnNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkodHJ1ZSksXHJcbiAgICAgICAgICAgIG9uT3ZlckVuZDogKCkgPT4gdGhpcy5zZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KGZhbHNlKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KHZhbHVlOiBib29sZWFuKXtcclxuICAgICAgICB0aGlzLnNlZ21lbnRHcm91cC52aXNpYmxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwLnZpc2libGUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm91dGxpbmUuc3Ryb2tlQ29sb3IgPSB2YWx1ZSA/ICdsaWdodGdyYXknIDogbnVsbDsgXHJcbiAgICB9XHJcblxyXG4gICAgYXJyYW5nZUNvbnRlbnRzKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWlkcGlvbnRNYXJrZXJzKCk7XHJcbiAgICAgICAgdGhpcy5hcnJhbmdlUGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFycmFuZ2VQYXRoKCkge1xyXG4gICAgICAgIGxldCBvcnRoT3JpZ2luID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgIGxldCBvcnRoV2lkdGggPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzLndpZHRoO1xyXG4gICAgICAgIGxldCBvcnRoSGVpZ2h0ID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IHNpZGVzID0gdGhpcy5nZXRPdXRsaW5lU2lkZXMoKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdG9wID0gc2lkZXNbMF07XHJcbiAgICAgICAgbGV0IGJvdHRvbSA9IHNpZGVzWzJdO1xyXG4gICAgICAgIGJvdHRvbS5yZXZlcnNlKCk7XHJcbiAgICAgICAgbGV0IHByb2plY3Rpb24gPSBQYXBlckhlbHBlcnMuc2FuZHdpY2hQYXRoUHJvamVjdGlvbih0b3AsIGJvdHRvbSk7XHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlbGF0aXZlID0gcG9pbnQuc3VidHJhY3Qob3J0aE9yaWdpbik7XHJcbiAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpdmUueCAvIG9ydGhXaWR0aCxcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnkgLyBvcnRoSGVpZ2h0KTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0ZWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgc2lkZSBvZiBzaWRlcyl7XHJcbiAgICAgICAgICAgIHNpZGUucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBuZXdQYXRoID0gUGFwZXJIZWxwZXJzLnRyYWNlQ29tcG91bmRQYXRoKHRoaXMuc291cmNlUGF0aCwgXHJcbiAgICAgICAgICAgIFN0cmV0Y2h5UGF0aC5PVVRMSU5FX1BPSU5UUyk7XHJcbiAgICAgICAgbmV3UGF0aC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBuZXdQYXRoLmZpbGxDb2xvciA9IHRoaXMub3B0aW9ucy5wYXRoRmlsbENvbG9yO1xyXG5cclxuICAgICAgICB0cmFuc2Zvcm0udHJhbnNmb3JtUGF0aEl0ZW0obmV3UGF0aCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc3BsYXlQYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheVBhdGgucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BsYXlQYXRoID0gbmV3UGF0aDtcclxuICAgICAgICB0aGlzLmluc2VydENoaWxkKDEsIG5ld1BhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0T3V0bGluZVNpZGVzKCk6IHBhcGVyLlBhdGhbXSB7XHJcbiAgICAgICAgbGV0IHNpZGVzOiBwYXBlci5QYXRoW10gPSBbXTtcclxuICAgICAgICBsZXQgc2VnbWVudEdyb3VwOiBwYXBlci5TZWdtZW50W10gPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY29ybmVyUG9pbnRzID0gdGhpcy5jb3JuZXJzLm1hcChjID0+IGMucG9pbnQpO1xyXG4gICAgICAgIGxldCBmaXJzdCA9IGNvcm5lclBvaW50cy5zaGlmdCgpOyBcclxuICAgICAgICBjb3JuZXJQb2ludHMucHVzaChmaXJzdCk7XHJcblxyXG4gICAgICAgIGxldCB0YXJnZXRDb3JuZXIgPSBjb3JuZXJQb2ludHMuc2hpZnQoKTtcclxuICAgICAgICBsZXQgc2VnbWVudExpc3QgPSB0aGlzLm91dGxpbmUuc2VnbWVudHMubWFwKHggPT4geCk7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIHNlZ21lbnRMaXN0LnB1c2goc2VnbWVudExpc3RbMF0pO1xyXG4gICAgICAgIGZvcihsZXQgc2VnbWVudCBvZiBzZWdtZW50TGlzdCl7XHJcbiAgICAgICAgICAgIHNlZ21lbnRHcm91cC5wdXNoKHNlZ21lbnQpO1xyXG4gICAgICAgICAgICBpZih0YXJnZXRDb3JuZXIuaXNDbG9zZShzZWdtZW50LnBvaW50LCBwYXBlci5OdW1lcmljYWwuRVBTSUxPTikpIHtcclxuICAgICAgICAgICAgICAgIC8vIGZpbmlzaCBwYXRoXHJcbiAgICAgICAgICAgICAgICBzaWRlcy5wdXNoKG5ldyBwYXBlci5QYXRoKHNlZ21lbnRHcm91cCkpO1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudEdyb3VwID0gW3NlZ21lbnRdO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Q29ybmVyID0gY29ybmVyUG9pbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZihzaWRlcy5sZW5ndGggIT09IDQpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdzaWRlcycsIHNpZGVzKTtcclxuICAgICAgICAgICAgdGhyb3cgJ2ZhaWxlZCB0byBnZXQgc2lkZXMnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc2lkZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgY3JlYXRlT3V0bGluZSgpIHtcclxuICAgICAgICBsZXQgYm91bmRzID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcztcclxuICAgICAgICBsZXQgb3V0bGluZSA9IG5ldyBwYXBlci5QYXRoKFxyXG4gICAgICAgICAgICBQYXBlckhlbHBlcnMuY29ybmVycyh0aGlzLnNvdXJjZVBhdGguYm91bmRzKSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3Ipe1xyXG4gICAgICAgICAgICBvdXRsaW5lLmZpbGxDb2xvciA9IHRoaXMub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3I7ICAgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG91dGxpbmUuZmlsbENvbG9yID0gJ3doaXRlJztcclxuICAgICAgICAgICAgb3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0bGluZS5jbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgIG91dGxpbmUuZGFzaEFycmF5ID0gWzUsIDVdO1xyXG4gICAgICAgIHRoaXMub3V0bGluZSA9IG91dGxpbmU7XHJcblxyXG4gICAgICAgIC8vIHRyYWNrIGNvcm5lcnMgc28gd2Uga25vdyBob3cgdG8gYXJyYW5nZSB0aGUgdGV4dFxyXG4gICAgICAgIHRoaXMuY29ybmVycyA9IG91dGxpbmUuc2VnbWVudHMubWFwKHMgPT4gcyk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQob3V0bGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTZWdtZW50TWFya2VycygpIHtcclxuICAgICAgICBsZXQgYm91bmRzID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcztcclxuICAgICAgICB0aGlzLnNlZ21lbnRHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2YgdGhpcy5vdXRsaW5lLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGUgPSBuZXcgU2VnbWVudEhhbmRsZShzZWdtZW50KTtcclxuICAgICAgICAgICAgaGFuZGxlLm9uQ2hhbmdlQ29tcGxldGUgPSAoKSA9PiB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnRHcm91cC5hZGRDaGlsZChoYW5kbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuc2VnbWVudEdyb3VwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZU1pZHBpb250TWFya2VycygpIHtcclxuICAgICAgICBpZih0aGlzLm1pZHBvaW50R3JvdXApe1xyXG4gICAgICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWlkcG9pbnRHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIHRoaXMub3V0bGluZS5jdXJ2ZXMuZm9yRWFjaChjdXJ2ZSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHNraXAgbGVmdCBhbmQgcmlnaHQgc2lkZXNcclxuICAgICAgICAgICAgaWYoY3VydmUuc2VnbWVudDEgPT09IHRoaXMuY29ybmVyc1sxXVxyXG4gICAgICAgICAgICAgICAgfHwgY3VydmUuc2VnbWVudDEgPT09IHRoaXMuY29ybmVyc1szXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgaGFuZGxlID0gbmV3IEN1cnZlU3BsaXR0ZXJIYW5kbGUoY3VydmUpO1xyXG4gICAgICAgICAgICBoYW5kbGUub25EcmFnRW5kID0gKG5ld1NlZ21lbnQsIGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3SGFuZGxlID0gbmV3IFNlZ21lbnRIYW5kbGUobmV3U2VnbWVudCk7XHJcbiAgICAgICAgICAgICAgICBuZXdIYW5kbGUub25DaGFuZ2VDb21wbGV0ZSA9ICgpID0+IHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlZ21lbnRHcm91cC5hZGRDaGlsZChuZXdIYW5kbGUpO1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLm1pZHBvaW50R3JvdXApO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgU3RyZXRjaHlQYXRoT3B0aW9ucyB7XHJcbiAgICBwYXRoRmlsbENvbG9yOiBzdHJpbmc7XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcclxufVxyXG4iLCJcclxuY2xhc3MgU3RyZXRjaHlUZXh0IGV4dGVuZHMgU3RyZXRjaHlQYXRoIHtcclxuXHJcbiAgICBvcHRpb25zOiBTdHJldGNoeVRleHRPcHRpb25zO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZywgZm9udDogb3BlbnR5cGUuRm9udCwgb3B0aW9ucz86IFN0cmV0Y2h5VGV4dE9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IDxTdHJldGNoeVRleHRPcHRpb25zPntcclxuICAgICAgICAgICAgZm9udFNpemU6IDMyXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgb3BlblR5cGVQYXRoID0gZm9udC5nZXRQYXRoKHRleHQsIDAsIDAsIHRoaXMub3B0aW9ucy5mb250U2l6ZSk7XHJcbiAgICAgICAgbGV0IHRleHRQYXRoID0gUGFwZXJIZWxwZXJzLmltcG9ydE9wZW5UeXBlUGF0aChvcGVuVHlwZVBhdGgpO1xyXG5cclxuICAgICAgICBzdXBlcih0ZXh0UGF0aCwgb3B0aW9ucyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBTdHJldGNoeVRleHRPcHRpb25zIGV4dGVuZHMgU3RyZXRjaHlQYXRoT3B0aW9ucyB7XHJcbiAgICBmb250U2l6ZTogbnVtYmVyO1xyXG59XHJcbiIsIlxyXG4vKipcclxuICogTWVhc3VyZXMgb2Zmc2V0cyBvZiB0ZXh0IGdseXBocy5cclxuICovXHJcbmNsYXNzIFRleHRSdWxlciB7XHJcbiAgICBcclxuICAgIGZvbnRGYW1pbHk6IHN0cmluZztcclxuICAgIGZvbnRXZWlnaHQ6IG51bWJlcjtcclxuICAgIGZvbnRTaXplOiBudW1iZXI7XHJcbiAgICBcclxuICAgIHByaXZhdGUgY3JlYXRlUG9pbnRUZXh0ICh0ZXh0KTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgdmFyIHBvaW50VGV4dCA9IG5ldyBwYXBlci5Qb2ludFRleHQoKTtcclxuICAgICAgICBwb2ludFRleHQuY29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgcG9pbnRUZXh0Lmp1c3RpZmljYXRpb24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgIGlmKHRoaXMuZm9udEZhbWlseSl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250RmFtaWx5ID0gdGhpcy5mb250RmFtaWx5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmZvbnRXZWlnaHQpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udFdlaWdodCA9IHRoaXMuZm9udFdlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5mb250U2l6ZSl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250U2l6ZSA9IHRoaXMuZm9udFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBwb2ludFRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGV4dE9mZnNldHModGV4dCl7XHJcbiAgICAgICAgLy8gTWVhc3VyZSBnbHlwaHMgaW4gcGFpcnMgdG8gY2FwdHVyZSB3aGl0ZSBzcGFjZS5cclxuICAgICAgICAvLyBQYWlycyBhcmUgY2hhcmFjdGVycyBpIGFuZCBpKzEuXHJcbiAgICAgICAgdmFyIGdseXBoUGFpcnMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZ2x5cGhQYWlyc1tpXSA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGksIGkrMSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBGb3IgZWFjaCBjaGFyYWN0ZXIsIGZpbmQgY2VudGVyIG9mZnNldC5cclxuICAgICAgICB2YXIgeE9mZnNldHMgPSBbMF07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBNZWFzdXJlIHRocmVlIGNoYXJhY3RlcnMgYXQgYSB0aW1lIHRvIGdldCB0aGUgYXBwcm9wcmlhdGUgXHJcbiAgICAgICAgICAgIC8vICAgc3BhY2UgYmVmb3JlIGFuZCBhZnRlciB0aGUgZ2x5cGguXHJcbiAgICAgICAgICAgIHZhciB0cmlhZFRleHQgPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpIC0gMSwgaSArIDEpKTtcclxuICAgICAgICAgICAgdHJpYWRUZXh0LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gU3VidHJhY3Qgb3V0IGhhbGYgb2YgcHJpb3IgZ2x5cGggcGFpciBcclxuICAgICAgICAgICAgLy8gICBhbmQgaGFsZiBvZiBjdXJyZW50IGdseXBoIHBhaXIuXHJcbiAgICAgICAgICAgIC8vIE11c3QgYmUgcmlnaHQsIGJlY2F1c2UgaXQgd29ya3MuXHJcbiAgICAgICAgICAgIGxldCBvZmZzZXRXaWR0aCA9IHRyaWFkVGV4dC5ib3VuZHMud2lkdGggXHJcbiAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaSAtIDFdLmJvdW5kcy53aWR0aCAvIDIgXHJcbiAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaV0uYm91bmRzLndpZHRoIC8gMjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEFkZCBvZmZzZXQgd2lkdGggdG8gcHJpb3Igb2Zmc2V0LiBcclxuICAgICAgICAgICAgeE9mZnNldHNbaV0gPSB4T2Zmc2V0c1tpIC0gMV0gKyBvZmZzZXRXaWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBnbHlwaFBhaXIgb2YgZ2x5cGhQYWlycyl7XHJcbiAgICAgICAgICAgIGdseXBoUGFpci5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHhPZmZzZXRzO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBWaWV3Wm9vbSB7XHJcblxyXG4gICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuICAgIGZhY3RvciA9IDEuMjU7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX21pblpvb206IG51bWJlcjtcclxuICAgIHByaXZhdGUgX21heFpvb206IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9qZWN0OiBwYXBlci5Qcm9qZWN0KSB7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG5cclxuICAgICAgICAoPGFueT4kKHZpZXcuZWxlbWVudCkpLm1vdXNld2hlZWwoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBtb3VzZVBvc2l0aW9uID0gbmV3IHBhcGVyLlBvaW50KGV2ZW50Lm9mZnNldFgsIGV2ZW50Lm9mZnNldFkpO1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVpvb21DZW50ZXJlZChldmVudC5kZWx0YVksIG1vdXNlUG9zaXRpb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB6b29tKCk6IG51bWJlcntcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9qZWN0LnZpZXcuem9vbTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgem9vbVJhbmdlKCk6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHpvb20gbGV2ZWwuXHJcbiAgICAgKiBAcmV0dXJucyB6b29tIGxldmVsIHRoYXQgd2FzIHNldCwgb3IgbnVsbCBpZiBpdCB3YXMgbm90IGNoYW5nZWRcclxuICAgICAqL1xyXG4gICAgc2V0Wm9vbUNvbnN0cmFpbmVkKHpvb206IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgaWYodGhpcy5fbWluWm9vbSkge1xyXG4gICAgICAgICAgICB6b29tID0gTWF0aC5tYXgoem9vbSwgdGhpcy5fbWluWm9vbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX21heFpvb20pe1xyXG4gICAgICAgICAgICB6b29tID0gTWF0aC5taW4oem9vbSwgdGhpcy5fbWF4Wm9vbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgaWYoem9vbSAhPSB2aWV3Lnpvb20pe1xyXG4gICAgICAgICAgICB2aWV3Lnpvb20gPSB6b29tO1xyXG4gICAgICAgICAgICByZXR1cm4gem9vbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Wm9vbVJhbmdlKHJhbmdlOiBwYXBlci5TaXplW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICBsZXQgYVNpemUgPSByYW5nZS5zaGlmdCgpO1xyXG4gICAgICAgIGxldCBiU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgbGV0IGEgPSBhU2l6ZSAmJiBNYXRoLm1pbiggXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIGFTaXplLmhlaWdodCwgICAgICAgICBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMud2lkdGggLyBhU2l6ZS53aWR0aCk7XHJcbiAgICAgICAgbGV0IGIgPSBiU2l6ZSAmJiBNYXRoLm1pbiggXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIGJTaXplLmhlaWdodCwgICAgICAgICBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMud2lkdGggLyBiU2l6ZS53aWR0aCk7XHJcbiAgICAgICAgbGV0IG1pbiA9IE1hdGgubWluKGEsYik7XHJcbiAgICAgICAgaWYobWluKXtcclxuICAgICAgICAgICAgdGhpcy5fbWluWm9vbSA9IG1pbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG1heCA9IE1hdGgubWF4KGEsYik7XHJcbiAgICAgICAgaWYobWF4KXtcclxuICAgICAgICAgICAgdGhpcy5fbWF4Wm9vbSA9IG1heDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLl9taW5ab29tLCB0aGlzLl9tYXhab29tXTtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2Vab29tQ2VudGVyZWQoZGVsdGFZOiBudW1iZXIsIG1vdXNlUG9zOiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIGlmICghZGVsdGFZKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICBsZXQgb2xkWm9vbSA9IHZpZXcuem9vbTtcclxuICAgICAgICBsZXQgb2xkQ2VudGVyID0gdmlldy5jZW50ZXI7XHJcbiAgICAgICAgbGV0IHZpZXdQb3MgPSB2aWV3LnZpZXdUb1Byb2plY3QobW91c2VQb3MpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBuZXdab29tID0gZGVsdGFZID4gMFxyXG4gICAgICAgICAgICA/IHZpZXcuem9vbSAqIHRoaXMuZmFjdG9yXHJcbiAgICAgICAgICAgIDogdmlldy56b29tIC8gdGhpcy5mYWN0b3I7XHJcbiAgICAgICAgbmV3Wm9vbSA9IHRoaXMuc2V0Wm9vbUNvbnN0cmFpbmVkKG5ld1pvb20pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCFuZXdab29tKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHpvb21TY2FsZSA9IG9sZFpvb20gLyBuZXdab29tO1xyXG4gICAgICAgIGxldCBjZW50ZXJBZGp1c3QgPSB2aWV3UG9zLnN1YnRyYWN0KG9sZENlbnRlcik7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IHZpZXdQb3Muc3VidHJhY3QoY2VudGVyQWRqdXN0Lm11bHRpcGx5KHpvb21TY2FsZSkpXHJcbiAgICAgICAgICAgIC5zdWJ0cmFjdChvbGRDZW50ZXIpO1xyXG5cclxuICAgICAgICB2aWV3LmNlbnRlciA9IHZpZXcuY2VudGVyLmFkZChvZmZzZXQpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgem9vbVRvKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSl7XHJcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICB2aWV3LmNlbnRlciA9IHJlY3QuY2VudGVyO1xyXG4gICAgICAgIHZpZXcuem9vbSA9IE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gcmVjdC5oZWlnaHQsICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gcmVjdC53aWR0aCkgKiAwLjk1O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==