var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AcidReflux;
(function (AcidReflux) {
    function run(container, render, initialState) {
        var currentContainer;
        var state;
        var dom;
        var output = new Rx.Subject();
        var rendering;
        var dispatch = function (action) {
            if (rendering) {
                console.error('dispatch call is not allowed within render function');
                return;
            }
            state = _.clone(state);
            action(state);
            rendering = true;
            dom = render(state, dispatch);
            rendering = false;
            currentContainer = patch(currentContainer, dom);
            output.onNext(currentContainer);
        };
        state = _.clone(initialState);
        dom = render(state, dispatch);
        currentContainer = patch(container, dom);
        output.onNext(currentContainer);
        return output;
    }
    AcidReflux.run = run;
})(AcidReflux || (AcidReflux = {}));
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
}());
function logtap(message, stream) {
    return stream.tap(function (t) { return console.log(message, t); });
}
function newid() {
    return (new Date().getTime() + Math.random()).toString(36);
}
var TRux;
(function (TRux) {
    /**
     * Static facade for accessing TRux features.
     */
    function newActionSubject() {
        var subject = new Rx.Subject();
        mixinTypedSubject(subject);
        return subject;
    }
    TRux.newActionSubject = newActionSubject;
    function newEventSubject() {
        var subject = new Rx.Subject();
        mixinTypedSubject(subject);
        return subject;
    }
    TRux.newEventSubject = newEventSubject;
    /**
     * Adds methods to subject, returing same instance as passed.
     */
    function mixinTypedSubject(subject) {
        var typed = subject;
        if (typed.ofType) {
            // already has mixin
            return typed;
        }
        typed.ofType = function () {
            var types = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                types[_i - 0] = arguments[_i];
            }
            var result;
            if (!types || types.length === 0) {
                result = subject.concat();
            }
            else if (types.length === 1) {
                var type_1 = types[0];
                result = subject.filter(function (a) { return a.type === type_1; });
            }
            else {
                result = subject.filter(function (a) { return types.indexOf(a.type) >= 0; });
            }
            result.typeFilter = types;
            return result;
        };
        return typed;
    }
    TRux.mixinTypedSubject = mixinTypedSubject;
})(TRux || (TRux = {}));
var Topic = (function () {
    function Topic(channel, topic) {
        this._channel = channel;
        this._name = topic;
    }
    Topic.prototype.observe = function () {
        return this._channel.observe(this._name);
    };
    Topic.prototype.publish = function (data) {
        this._channel.publish(this._name, data);
    };
    Topic.prototype.subscribe = function (callback) {
        return this._channel.subscribe(this._name, callback);
    };
    Topic.prototype.subtopic = function (name) {
        return new Topic(this._channel, this._name + '.' + name);
    };
    Topic.prototype.subtopicOf = function (name) {
        return new Topic(this._channel, this._name + '.' + name);
    };
    return Topic;
}());
postal.observe = function (options) {
    var self = this;
    var channel = options.channel;
    var topic = options.topic;
    return Rx.Observable.fromEventPattern(function addHandler(h) {
        return self.subscribe({
            channel: channel,
            topic: topic,
            callback: h,
        });
    }, function delHandler(_, sub) {
        sub.unsubscribe();
    });
};
// add observe to ChannelDefinition
postal.ChannelDefinition.prototype.observe = function (topic) {
    var self = this;
    return Rx.Observable.fromEventPattern(function addHandler(h) {
        return self.bus.subscribe({
            channel: self.channel,
            topic: topic,
            callback: h,
        });
    }, function delHandler(_, sub) {
        sub.unsubscribe();
    });
};
var ReactiveDom = (function () {
    function ReactiveDom() {
    }
    /**
     * Render a reactive component within container.
     */
    ReactiveDom.renderStream = function (dom$, container) {
        var current = container;
        var sink = new Rx.Subject();
        dom$.subscribe(function (dom) {
            current = patch(current, dom);
            sink.onNext(current);
        });
        return sink;
    };
    /**
     * Render a reactive component within container.
     */
    ReactiveDom.renderComponent = function (component, container) {
        var current = container;
        var sink = new Rx.Subject();
        component.dom$.subscribe(function (dom) {
            current = patch(current, dom);
            sink.onNext(current);
        });
        return sink;
    };
    /**
     * Render within container whenever source changes.
     */
    ReactiveDom.liveRender = function (container, source, render) {
        var current = container;
        var sink = new Rx.Subject();
        source.subscribe(function (data) {
            var node = render(data);
            current = patch(current, node);
            sink.onNext(current);
        });
        return sink;
    };
    return ReactiveDom;
}());
var ColorPicker = (function () {
    function ColorPicker() {
    }
    ColorPicker.setup = function (elem, onChange) {
        var sel = $(elem);
        $(elem).spectrum({
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
            change: onChange
        });
    };
    ;
    return ColorPicker;
}());
var AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
var Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
var Roboto500 = 'fonts/Roboto-500.ttf';
var AquafinaScript = 'fonts/AguafinaScript-Regular/AguafinaScript-Regular.ttf';
var DesignerController = (function () {
    function DesignerController(event$, onFontLoaded) {
        var _this = this;
        this.fonts = [];
        this.loadFont(Roboto500, function (font) {
            _this.workspaceController = new WorkspaceController(event$, font);
            onFontLoaded();
        });
    }
    DesignerController.prototype.loadFont = function (url, onComplete) {
        var _this = this;
        new FontLoader(url, function (font) {
            _this.fonts.push(font);
            onComplete(font);
        });
    };
    return DesignerController;
}());
// interface Intent {
//     tag: string;
//     action: string;
//     data: any;
// }
// const Dispatcher = new Rx.Subject<Intent>();
// const UserList$ = Dispatcher
//     .filter(x => x.action === 'ListUsers');
// // const UserList$ = Dispatcher
// //     .filter(x => x.action === 'ListUsers')
// //     // Fetch a list of users from GitHub.
// //     .flatMap(() => Rx.DOM.getJSON('https://api.github.com/users'))
// //     // Format the response. Carry the action through.
// //     .map(users => ({action: 'ListUsers', data: users}))
// //     // Cache the response so multiple subscribers can grab
// //     // this data without triggering redundant ajax requests.
// //     .shareReplay(1);
// const store$ = Rx.Observable.merge(UserList$);
// const ListView$ = store$
//     .filter(x => x.action === 'ListUsers')
//     .map(function({data}) {
//         return (
//             h('ul', [
//                 data.map(login => h('li'))
//             ])
//         );
//     });
// const userDetail$ = Dispatcher
//     .filter(x => x.tag === 'UserDetail')
//     .pluck('data', 'login')
//     .flatMap(login => Rx.DOM.getJSON(`https://api.github.com/users/${login}`))
//     .map(x => ({tag: 'UserDetail', data: x}))
//     .shareReplay(1);
// const allViews$ = Rx.Observable.merge(userDetail$);
// allViews$.subscribe(function(content) {
//     ReactiveDom.render(content,
//         document.querySelector('#content'));
// });
function RenderSketchEditor(sketch) {
    return h('div', [
        h('input.background-color', {
            type: 'text',
            hook: {
                insert: function (vnode) {
                    return ColorPicker.setup(vnode.elm, function (color) {
                        dispatch({
                            type: "sketch.update",
                            payload: { backgroundColor: color && color.toHexString() }
                        });
                    });
                }
            }
        }),
        sketch.textBlocks.map(function (tb) { return RenderTextBlockEditor(tb); })
    ]);
}
;
function RenderTextBlockEditor(textBlock) {
    var tbUpdate = function (partial) {
        dispatch({
            type: "textblock.update",
            payload: partial
        });
    };
    return h('div', { style: { color: '#000' } }, [
        h('textarea', {
            text: textBlock.text,
            on: {
                keyup: function (e) { return tbUpdate(function (tb) { return tb.text = e.target.value; }); },
                change: function (e) { return tbUpdate(function (tb) { return tb.text = e.target.value; }); }
            }
        }),
        h('input.text-color', {
            type: 'text',
            hook: {
                insert: function (vnode) {
                    return ColorPicker.setup(vnode.elm, function (color) { return tbUpdate({ textColor: color && color.toHexString() }); });
                }
            }
        }),
        h('input.background-color', {
            type: 'text',
            hook: {
                insert: function (vnode) {
                    return ColorPicker.setup(vnode.elm, function (color) { return tbUpdate({ backgroundColor: color && color.toHexString() }); });
                }
            }
        }),
    ]);
}
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
}());
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
}());
var Sketch = (function () {
    function Sketch() {
        this.textBlocks = [];
    }
    return Sketch;
}());
var RootStore = (function () {
    function RootStore(action$, event$) {
        var _this = this;
        this.action$ = action$;
        this.event$ = event$;
        action$.ofType("sketch.create")
            .subscribe(function () {
            _this.state = new Sketch();
            _this.sendEvent("sketch.loaded", _this.state);
        });
        action$.ofType("sketch.update")
            .subscribe(function (ev) {
            _.assign(_this.state, ev.payload);
            _this.sendEvent("sketch.changed", _this.state);
        });
        action$.ofType("textblock.add")
            .subscribe(function (ev) {
            var patch = ev.payload;
            var block = { _id: newid() };
            _.assign(block, patch);
            _this.state.textBlocks.push(block);
            _this.sendEvent("textblock.added", block);
        });
        action$.ofType("textblock.update")
            .subscribe(function (ev) {
            var patch = ev.payload;
            var block = _.find(_this.state.textBlocks, function (tb) { return tb._id === patch._id; });
            if (block) {
                _.assign(block, patch);
            }
            _this.sendEvent("textblock.changed", block);
        });
    }
    RootStore.prototype.sendEvent = function (type, eventData) {
        this.event$.onNext({
            type: type,
            eventData: eventData,
            rootData: this.state
        });
    };
    return RootStore;
}());
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
                if (_this.onDragStart) {
                    _this.onDragStart(event);
                }
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
}(paper.Shape));
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
}(paper.Tool));
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
}());
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
}());
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
}());
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
            onDragStart: function (event) {
                if (_this.onDragStart) {
                    _this.onDragStart(event);
                }
            },
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
}(paper.Shape));
var StretchyPath = (function (_super) {
    __extends(StretchyPath, _super);
    function StretchyPath(sourcePath, options) {
        var _this = this;
        _super.call(this);
        this._options = options || {
            pathFillColor: 'gray'
        };
        this.setPath(sourcePath);
        this.createOutline();
        this.createSegmentMarkers();
        this.updateMidpiontMarkers();
        this.setEditElementsVisibility(false);
        this.arrangeContents();
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
    }
    Object.defineProperty(StretchyPath.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (value) {
            if (!value) {
                return;
            }
            this._options = value;
            this.updateBackgroundColor();
            if (this.arrangedPath) {
                this.arrangedPath.fillColor = value.pathFillColor;
            }
        },
        enumerable: true,
        configurable: true
    });
    StretchyPath.prototype.updatePath = function (path) {
        this.setPath(path);
        if (!this.shapeChanged) {
            this.outline.bounds.size = this.sourcePath.bounds.size;
            this.updateMidpiontMarkers();
            this.createSegmentMarkers();
        }
        this.arrangeContents();
    };
    StretchyPath.prototype.setPath = function (path) {
        if (this.sourcePath) {
            this.sourcePath.remove();
        }
        this.sourcePath = path;
        path.visible = false;
    };
    StretchyPath.prototype.setEditElementsVisibility = function (value) {
        this.segmentMarkersGroup.visible = value;
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
        for (var _i = 0, sides_1 = sides; _i < sides_1.length; _i++) {
            var side = sides_1[_i];
            side.remove();
        }
        var newPath = PaperHelpers.traceCompoundPath(this.sourcePath, StretchyPath.OUTLINE_POINTS);
        newPath.visible = true;
        newPath.fillColor = this.options.pathFillColor;
        this.arrangedPath = newPath;
        this.updateBackgroundColor();
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
        for (var _i = 0, segmentList_1 = segmentList; _i < segmentList_1.length; _i++) {
            var segment = segmentList_1[_i];
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
        outline.closed = true;
        outline.dashArray = [5, 5];
        this.outline = outline;
        // track corners so we know how to arrange the text
        this.corners = outline.segments.map(function (s) { return s; });
        this.addChild(outline);
        this.updateBackgroundColor();
    };
    StretchyPath.prototype.updateBackgroundColor = function () {
        if (this.options && this.options.backgroundColor) {
            this.outline.fillColor = this.options.backgroundColor;
            this.outline.opacity = .9;
        }
        else {
            this.outline.fillColor = 'white';
            this.outline.opacity = 0;
        }
    };
    StretchyPath.prototype.createSegmentMarkers = function () {
        var _this = this;
        if (this.segmentMarkersGroup) {
            this.segmentMarkersGroup.remove();
        }
        var bounds = this.sourcePath.bounds;
        this.segmentMarkersGroup = new paper.Group();
        for (var _i = 0, _a = this.outline.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            var handle = new SegmentHandle(segment);
            handle.onDragStart = function () { return _this.shapeChanged = true; };
            handle.onChangeComplete = function () { return _this.arrangeContents(); };
            this.segmentMarkersGroup.addChild(handle);
        }
        this.addChild(this.segmentMarkersGroup);
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
            handle.onDragStart = function () { return _this.shapeChanged = true; };
            handle.onDragEnd = function (newSegment, event) {
                var newHandle = new SegmentHandle(newSegment);
                newHandle.onChangeComplete = function () { return _this.arrangeContents(); };
                _this.segmentMarkersGroup.addChild(newHandle);
                handle.remove();
                _this.arrangeContents();
            };
            _this.midpointGroup.addChild(handle);
        });
        this.addChild(this.midpointGroup);
    };
    StretchyPath.OUTLINE_POINTS = 230;
    return StretchyPath;
}(paper.Group));
var StretchyText = (function (_super) {
    __extends(StretchyText, _super);
    function StretchyText(font, options) {
        _super.call(this, StretchyText.getTextPath(font, options), options);
        this.ffont = font;
    }
    StretchyText.prototype.update = function (options) {
        this.options = options;
        _super.prototype.updatePath.call(this, StretchyText.getTextPath(this.ffont, options));
    };
    StretchyText.getTextPath = function (font, options) {
        var openTypePath = font.getPath(options.text, 0, 0, options.fontSize || 32);
        return PaperHelpers.importOpenTypePath(openTypePath);
    };
    return StretchyText;
}(StretchyPath));
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
        for (var _i = 0, glyphPairs_1 = glyphPairs; _i < glyphPairs_1.length; _i++) {
            var glyphPair = glyphPairs_1[_i];
            glyphPair.remove();
        }
        return xOffsets;
    };
    return TextRuler;
}());
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
}());
var Workspace = (function (_super) {
    __extends(Workspace, _super);
    function Workspace(size) {
        var _this = this;
        _super.call(this);
        var sheet = paper.Shape.Rectangle(new paper.Point(0, 0), size);
        sheet.style.shadowColor = 'gray';
        sheet.style.shadowBlur = 6;
        sheet.style.shadowOffset = new paper.Point(5, 5);
        this.sheet = sheet;
        this.addChild(sheet);
        this.backgroundColor = null;
        this.mouseBehavior = {
            onClick: function (e) {
                paper.project.deselectAll();
            },
            onDragMove: function (e) { return _this.position = _this.position.add(e.delta); }
        };
    }
    Object.defineProperty(Workspace.prototype, "backgroundColor", {
        get: function () {
            return this.sheet.opacity == 0
                ? null
                : this.sheet.fillColor.toString();
        },
        set: function (value) {
            if (value) {
                this.sheet.fillColor = value;
                this.sheet.opacity = 1;
            }
            else {
                // preserve hit testing
                this.sheet.fillColor = 'white';
                this.sheet.opacity = 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    return Workspace;
}(paper.Group));
var WorkspaceController = (function () {
    function WorkspaceController(event$, font) {
        var _this = this;
        this.defaultSize = new paper.Size(4000, 3000);
        this._textBlockItems = {};
        this.font = font;
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
        event$.ofType("sketch.loaded").subscribe(function (ev) { return _this._sketch = ev.eventData; });
        event$.ofType("sketch.changed").subscribe(function (ev) { return _this.workspace.backgroundColor = ev.eventData.backgroundColor; });
        event$.subscribe(function (x) { return console.log('booger', x); });
        event$.ofType("textblock.added", "textblock.changed").subscribe(function (ev) { return _this.textBlockReceived(ev.eventData); });
        // events.textBlockChanged$
        //     .subscribe(tb => this.tbNext(tb));
        // RootState.actions.sketchAttrUpdate({
        //     backgroundColor: '#F2F1E1'
        // })
    }
    WorkspaceController.prototype.textBlockReceived = function (textBlock) {
        console.log('textBlockReceived', textBlock);
        if (!textBlock.text.length) {
            return;
        }
        if (!textBlock._id) {
            textBlock._id = newid();
        }
        var options = {
            text: textBlock.text,
            fontSize: 128,
            pathFillColor: textBlock.textColor || 'black',
            backgroundColor: textBlock.backgroundColor
        };
        var item = this._textBlockItems[textBlock._id];
        if (!item) {
            item = new StretchyText(this.font, options);
            item.data = textBlock._id;
            this.workspace.addChild(item);
            item.position = this.project.view.bounds.point.add(new paper.Point(item.bounds.width / 2, item.bounds.height / 2)
                .add(50));
            this._textBlockItems[textBlock._id] = item;
        }
        else {
            item.update(options);
        }
    };
    return WorkspaceController;
}());
// namespace TodoExperiment {
//     interface Todo {
//         id: number;
//         text: string;
//         complete?: boolean;
//     }
//     class TodoList {
//         todos: Todo[] = [];
//     }
//     type TodosAction = AcidReflux.Action<TodoList>;
//     function completeTodo(todoId: number): TodosAction {
//         return (root: TodoList) => {
//             let todo = _.find(root.todos, t => t.id == todoId);
//             todo.complete = true;
//         };
//     }
//     function buildView(state: TodoList, dispatch: AcidReflux.Dispatch<TodoList>): VNode {
//         return h('div',
//             state.todos.map(t =>
//                 h('button',
//                     {
//                         on: {
//                             'click': () => dispatch(completeTodo(t.id))
//                         }
//                     },
//                     [t.text + (t.complete ? " [x]" : " [ ]")]
//                 )
//             )
//         );
//     }
//     export function run(elementId: string) {
//         var list = new TodoList();
//         list.todos.push({ id: 1, text: "build rocket sled" });
//         list.todos.push({ id: 2, text: "eat a sandwich" });
//         AcidReflux.run(document.getElementById(elementId), buildView, list)
//             .subscribe(dom => console.log('rendered', dom));
//     }
// }
// // TodoExperiment.run('designer'); 
var action$ = TRux.newActionSubject();
action$.subscribe(function (a) { return console.log('action$', a); });
var dispatch = action$.onNext;
var event$ = TRux.newEventSubject();
event$.subscribe(function (a) { return console.log('event$', a); });
var rootStore = new RootStore(action$, event$);
var sketchState$ = event$.ofType("sketch.loaded", "sketch.changed", "textblock.added", "textblock.changed");
var dom$ = sketchState$.map(function (ev) { return RenderSketchEditor(ev.rootData); });
dom$.subscribe(function (a) { return console.log('dom$', a); });
ReactiveDom.renderStream(dom$, document.getElementById('designer'));
var designerController = new DesignerController(event$, function () {
    action$.onNext({
        type: "sketch.create"
    });
    action$.onNext({
        type: "textblock.add",
        payload: {
            text: "blaargh"
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9fX2ZyYW1ld29yay9BY2lkUmVmbHV4LnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL0ZvbnRMb2FkZXIudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvSGVscGVycy50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay9UUnV4LnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL3Bvc3RhbC9Ub3BpYy50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay9wb3N0YWwvcG9zdGFsLW9ic2VydmUudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvdmRvbS9SZWFjdGl2ZURvbS50cyIsIi4uL3NyYy9fY29tbW9uL2NvbnN0YW50cy50cyIsIi4uL3NyYy9kZXNpZ25lci9Db2xvclBpY2tlci50cyIsIi4uL3NyYy9kZXNpZ25lci9EZXNpZ25lckNvbnRyb2xsZXIudHMiLCIuLi9zcmMvZGVzaWduZXIvYWxsLWluLW9uZS50cyIsIi4uL3NyYy9kZXNpZ25lci9lZGl0b3ItZG9tLnRzIiwiLi4vc3JjL21hdGgvUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHMiLCIuLi9zcmMvbW9kZWwvU2tldGNoLnRzIiwiLi4vc3JjL21vZGVsL1RleHRCbG9jay50cyIsIi4uL3NyYy9zdG9yZS9Sb290U3RvcmUudHMiLCIuLi9zcmMvd29ya3NwYWNlL0N1cnZlU3BsaXR0ZXJIYW5kbGUudHMiLCIuLi9zcmMvd29ya3NwYWNlL01vdXNlQmVoYXZpb3JUb29sLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9QYXBlckhlbHBlcnMudHMiLCIuLi9zcmMvd29ya3NwYWNlL1BhdGhTZWN0aW9uLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9QYXRoVHJhbnNmb3JtLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9TZWdtZW50SGFuZGxlLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9TdHJldGNoeVBhdGgudHMiLCIuLi9zcmMvd29ya3NwYWNlL1N0cmV0Y2h5VGV4dC50cyIsIi4uL3NyYy93b3Jrc3BhY2UvVGV4dFJ1bGVyLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9WaWV3Wm9vbS50cyIsIi4uL3NyYy93b3Jrc3BhY2UvV29ya3NwYWNlLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9Xb3Jrc3BhY2VDb250cm9sbGVyLnRzIiwiLi4vc3JjL3pfYXBwL1RvZG9FeHBlcmltZW50LnRzIiwiLi4vc3JjL3pfYXBwL3J1bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLElBQVUsVUFBVSxDQXlDbkI7QUF6Q0QsV0FBVSxVQUFVLEVBQUMsQ0FBQztJQU1sQixhQUNJLFNBQThCLEVBQzlCLE1BQTRELEVBQzVELFlBQW9CO1FBR3BCLElBQUksZ0JBQXVCLENBQUM7UUFDNUIsSUFBSSxLQUFhLENBQUM7UUFDbEIsSUFBSSxHQUFVLENBQUM7UUFDZixJQUFJLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQVMsQ0FBQztRQUVyQyxJQUFJLFNBQWtCLENBQUM7UUFDdkIsSUFBSSxRQUFRLEdBQUcsVUFBQyxNQUFzQjtZQUNsQyxFQUFFLENBQUEsQ0FBQyxTQUFTLENBQUMsQ0FBQSxDQUFDO2dCQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMscURBQXFELENBQUMsQ0FBQztnQkFDckUsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVkLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDakIsR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDOUIsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUVsQixnQkFBZ0IsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQztRQUVGLEtBQUssR0FBRyxDQUFDLENB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QyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDbEUsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0UsQ0FBQztRQUVELElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFCLE1BQU0sQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixDQUFDLEVBQUssQ0FBQyxFQUFFLENBQUMsRUFBSyxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFLLENBQUM7U0FDdEIsQ0FBQyxHQUFHLENBQUMsVUFBUyxDQUFDO1lBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCwyRUFBMkU7SUFDM0UscUNBQXFDO0lBQ3JDLHFDQUFxQztJQUNyQyxxQ0FBcUM7SUFDckMscUNBQXFDO0lBQzlCLDZCQUFRLEdBQWYsVUFBZ0IsTUFBTSxFQUFFLE1BQU07UUFDMUIsTUFBTSxDQUFDO1lBQ0gsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDbEcsQ0FBQztJQUNOLENBQUM7SUFDTCwyQkFBQztBQUFELENBQUMsQUFsRUQsSUFrRUM7QUFFRDtJQU1JLGNBQVksQ0FBYyxFQUFFLENBQWMsRUFBRSxDQUFjLEVBQUUsQ0FBYztRQUN0RSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFTSxrQkFB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IHtcclxuXHJcbiAgICBleHBvcnQgdHlwZSBSZW5kZXI8VFN0YXRlLCBUQWN0aW9ucz4gPSAoc3RhdGU6IFRTdGF0ZSwgYWN0aW9uczogVEFjdGlvbnMpID0+IFZOb2RlXHJcbiAgICBleHBvcnQgdHlwZSBBY3Rpb248VFN0YXRlPiA9IChzdGF0ZTogVFN0YXRlKSA9PiB2b2lkO1xyXG4gICAgZXhwb3J0IHR5cGUgRGlzcGF0Y2g8VFN0YXRlPiA9IChhY3Rpb246IEFjdGlvbjxUU3RhdGU+KSA9PiB2b2lkO1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBydW48VFN0YXRlPihcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50IHwgVk5vZGUsXHJcbiAgICAgICAgcmVuZGVyOiAoc3RhdGU6IFRTdGF0ZSwgZGlzcGF0Y2g6IERpc3BhdGNoPFRTdGF0ZT4pID0+IFZOb2RlLFxyXG4gICAgICAgIGluaXRpYWxTdGF0ZTogVFN0YXRlKVxyXG4gICAgICAgIDogUnguT2JzZXJ2YWJsZTxWTm9kZT4ge1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudENvbnRhaW5lcjogVk5vZGU7XHJcbiAgICAgICAgbGV0IHN0YXRlOiBUU3RhdGU7XHJcbiAgICAgICAgbGV0IGRvbTogVk5vZGU7XHJcbiAgICAgICAgbGV0IG91dHB1dCA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG5cclxuICAgICAgICBsZXQgcmVuZGVyaW5nOiBib29sZWFuO1xyXG4gICAgICAgIGxldCBkaXNwYXRjaCA9IChhY3Rpb246IEFjdGlvbjxUU3RhdGU+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHJlbmRlcmluZyl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdkaXNwYXRjaCBjYWxsIGlzIG5vdCBhbGxvd2VkIHdpdGhpbiByZW5kZXIgZnVuY3Rpb24nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdGF0ZSA9IF8uY2xvbmUoc3RhdGUpO1xyXG4gICAgICAgICAgICBhY3Rpb24oc3RhdGUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmVuZGVyaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgZG9tID0gcmVuZGVyKHN0YXRlLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgICAgIHJlbmRlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3VycmVudENvbnRhaW5lciA9IHBhdGNoKGN1cnJlbnRDb250YWluZXIsIGRvbSk7XHJcbiAgICAgICAgICAgIG91dHB1dC5vbk5leHQoY3VycmVudENvbnRhaW5lcik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc3RhdGUgPSBfLmNsb25lKGluaXRpYWxTdGF0ZSk7XHJcbiAgICAgICAgZG9tID0gcmVuZGVyKHN0YXRlLCBkaXNwYXRjaCk7XHJcbiAgICAgICAgY3VycmVudENvbnRhaW5lciA9IHBhdGNoKGNvbnRhaW5lciwgZG9tKTtcclxuICAgICAgICBvdXRwdXQub25OZXh0KGN1cnJlbnRDb250YWluZXIpO1xyXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuIiwiXHJcbmNsYXNzIEZvbnRMb2FkZXIge1xyXG5cclxuICAgIGlzTG9hZGVkOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnRVcmw6IHN0cmluZywgb25Mb2FkZWQ6IChmb250OiBvcGVudHlwZS5Gb250KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgb3BlbnR5cGUubG9hZChmb250VXJsLCBmdW5jdGlvbihlcnIsIGZvbnQpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9uTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgb25Mb2FkZWQuY2FsbCh0aGlzLCBmb250KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiXHJcbmZ1bmN0aW9uIGxvZ3RhcDxUPihtZXNzYWdlOiBzdHJpbmcsIHN0cmVhbTogUnguT2JzZXJ2YWJsZTxUPik6IFJ4Lk9ic2VydmFibGU8VD57XHJcbiAgICByZXR1cm4gc3RyZWFtLnRhcCh0ID0+IGNvbnNvbGUubG9nKG1lc3NhZ2UsIHQpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbmV3aWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAobmV3IERhdGUoKS5nZXRUaW1lKCkrTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMzYpO1xyXG59XHJcbiIsIlxyXG5uYW1lc3BhY2UgVFJ1eCB7XHJcblxyXG4gICAgLy8gLS0tIENvcmUgdHlwZXMgLS0tXHJcblxyXG4gICAgdHlwZSBTZXJpYWxpemFibGUgPSBPYmplY3QgfCBBcnJheTxhbnk+IHwgbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiB8IERhdGU7XHJcblxyXG4gICAgdHlwZSBWYWx1ZSA9IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBEYXRlO1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVR5cGVkSXRlbTxUSXRlbVR5cGVzIGV4dGVuZHMgVmFsdWU+IHtcclxuICAgICAgICB0eXBlOiBUSXRlbVR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVN1YmplY3Q8VD4gZXh0ZW5kcyBSeC5PYnNlcnZhYmxlPFQ+LCBSeC5JT2JzZXJ2ZXI8VD4ge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVwcmVzZW50cyBhIHN0cmVhbSBvZiB0eXBlZCBvYmplY3RzLlxyXG4gICAgICogUHJvdmlkZXMgY29udmVuaWVuY2UgbWV0aG9kcyBmb3IgZmlsdGVyaW5nLiBcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJVHlwZWRPYnNlcnZhYmxlPFRJdGVtVHlwZXMgZXh0ZW5kcyBWYWx1ZT4gZXh0ZW5kcyBSeC5PYnNlcnZhYmxlPElUeXBlZEl0ZW08VEl0ZW1UeXBlcz4+IHtcclxuICAgICAgICB0eXBlRmlsdGVyOiBUSXRlbVR5cGVzW107XHJcbiAgICAgICAgLy9vZlR5cGUoLi4udHlwZTogVEl0ZW1UeXBlc1tdKTogSVR5cGVkT2JzZXJ2YWJsZTxUSXRlbVR5cGVzPjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElUeXBlZFN1YmplY3Q8VEl0ZW1UeXBlcyBleHRlbmRzIFZhbHVlPlxyXG4gICAgICAgIGV4dGVuZHMgSVN1YmplY3Q8SVR5cGVkSXRlbTxUSXRlbVR5cGVzPj4ge1xyXG4gICAgICAgIC8vb2ZUeXBlKC4uLnR5cGVzOiBUSXRlbVR5cGVzW10pOiBJVHlwZWRPYnNlcnZhYmxlPFRJdGVtVHlwZXM+O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLSBGbHV4IHBpcGVsaW5lIHR5cGVzIC0tLVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW4gYWN0aW9uIG1lc3NhZ2UgdG8gYmUgaGFuZGxlZCBieSB0aGUgc3lzdGVtLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEFjdGlvbjxUQWN0aW9uVHlwZXMgZXh0ZW5kcyBWYWx1ZT4gZXh0ZW5kcyBJVHlwZWRJdGVtPFRBY3Rpb25UeXBlcz4ge1xyXG4gICAgICAgIHBheWxvYWQ/OiBTZXJpYWxpemFibGU7XHJcbiAgICAgICAgZXJyb3I/OiBib29sZWFuO1xyXG4gICAgICAgIG1ldGE/OiBTZXJpYWxpemFibGVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuIGV2ZW50IG1lc3NhZ2Ugb3JpZ2luYXRpbmcgZnJvbSB0aGUgc3lzdGVtLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEV2ZW50PFRFdmVudFR5cGVzIGV4dGVuZHMgVmFsdWU+IGV4dGVuZHMgSVR5cGVkSXRlbTxURXZlbnRUeXBlcz4ge1xyXG4gICAgICAgIGV2ZW50RGF0YT86IFNlcmlhbGl6YWJsZTtcclxuICAgICAgICByb290RGF0YT86IFNlcmlhbGl6YWJsZTtcclxuICAgICAgICBtZXRhPzogU2VyaWFsaXphYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSBwdXNoYWJsZSBzdHJlYW0gb2YgYWN0aW9ucy5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQWN0aW9uU3ViamVjdDxUQWN0aW9uVHlwZXMgZXh0ZW5kcyBWYWx1ZT4gZXh0ZW5kcyBJU3ViamVjdDxBY3Rpb248VEFjdGlvblR5cGVzPj4ge1xyXG4gICAgICAgIG9mVHlwZSguLi50eXBlczogVEFjdGlvblR5cGVzW10pOiBJQWN0aW9uT2JzZXJ2YWJsZTxUQWN0aW9uVHlwZXM+O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW4gb2JzZXJ2YWJsZSBzdHJlYW0gb2YgYWN0aW9ucy5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQWN0aW9uT2JzZXJ2YWJsZTxUQWN0aW9uVHlwZXMgZXh0ZW5kcyBWYWx1ZT4gZXh0ZW5kcyBSeC5PYnNlcnZhYmxlPEFjdGlvbjxUQWN0aW9uVHlwZXM+PiB7XHJcbiAgICAgICAgb2ZUeXBlKC4uLnR5cGVzOiBUQWN0aW9uVHlwZXNbXSk6IElBY3Rpb25PYnNlcnZhYmxlPFRBY3Rpb25UeXBlcz47XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQSBwdXNoYWJsZSBzdHJlYW0gb2YgZXZlbnRzLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElFdmVudFN1YmplY3Q8VEV2ZW50VHlwZXMgZXh0ZW5kcyBWYWx1ZT4gZXh0ZW5kcyBJU3ViamVjdDxFdmVudDxURXZlbnRUeXBlcz4+IHtcclxuICAgICAgICBvZlR5cGUoLi4udHlwZXM6IFRFdmVudFR5cGVzW10pOiBJRXZlbnRPYnNlcnZhYmxlPFRFdmVudFR5cGVzPjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuIG9ic2VydmFibGUgc3RyZWFtIG9mIGV2ZW50cy5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJRXZlbnRPYnNlcnZhYmxlPFRFdmVudFR5cGVzIGV4dGVuZHMgVmFsdWU+IGV4dGVuZHMgUnguT2JzZXJ2YWJsZTxFdmVudDxURXZlbnRUeXBlcz4+IHtcclxuICAgICAgICBvZlR5cGUoLi4udHlwZXM6IFRFdmVudFR5cGVzW10pOiBJRXZlbnRPYnNlcnZhYmxlPFRFdmVudFR5cGVzPjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN0YXRpYyBmYWNhZGUgZm9yIGFjY2Vzc2luZyBUUnV4IGZlYXR1cmVzLlxyXG4gICAgICovXHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG5ld0FjdGlvblN1YmplY3Q8VEFjdGlvblR5cGVzIGV4dGVuZHMgVmFsdWU+KCk6IElBY3Rpb25TdWJqZWN0PFRBY3Rpb25UeXBlcz4ge1xyXG4gICAgICAgIGxldCBzdWJqZWN0ID0gbmV3IFJ4LlN1YmplY3Q8QWN0aW9uPFRBY3Rpb25UeXBlcz4+KCk7XHJcbiAgICAgICAgbWl4aW5UeXBlZFN1YmplY3Qoc3ViamVjdCk7XHJcbiAgICAgICAgcmV0dXJuIHN1YmplY3QgYXMgYW55IGFzIElBY3Rpb25TdWJqZWN0PFRBY3Rpb25UeXBlcz47XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG5ld0V2ZW50U3ViamVjdDxURXZlbnRUeXBlcyBleHRlbmRzIFZhbHVlPigpOiBJRXZlbnRTdWJqZWN0PFRFdmVudFR5cGVzPiB7XHJcbiAgICAgICAgbGV0IHN1YmplY3QgPSBuZXcgUnguU3ViamVjdDxFdmVudDxURXZlbnRUeXBlcz4+KCk7XHJcbiAgICAgICAgbWl4aW5UeXBlZFN1YmplY3Qoc3ViamVjdCk7XHJcbiAgICAgICAgcmV0dXJuIHN1YmplY3QgYXMgYW55IGFzIElFdmVudFN1YmplY3Q8VEV2ZW50VHlwZXM+O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBtZXRob2RzIHRvIHN1YmplY3QsIHJldHVyaW5nIHNhbWUgaW5zdGFuY2UgYXMgcGFzc2VkLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWl4aW5UeXBlZFN1YmplY3Q8VEl0ZW1UeXBlcyBleHRlbmRzIFZhbHVlPihzdWJqZWN0OiBJU3ViamVjdDxJVHlwZWRJdGVtPFRJdGVtVHlwZXM+Pik6IFxyXG4gICAgICAgIElUeXBlZFN1YmplY3Q8VEl0ZW1UeXBlcz4ge1xyXG4gICAgICAgIGxldCB0eXBlZCA9IHN1YmplY3QgYXMgYW55O1xyXG4gICAgICAgIGlmICh0eXBlZC5vZlR5cGUpIHtcclxuICAgICAgICAgICAgLy8gYWxyZWFkeSBoYXMgbWl4aW5cclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0eXBlZC5vZlR5cGUgPSAoLi4udHlwZXM6IFRJdGVtVHlwZXNbXSk6IElUeXBlZE9ic2VydmFibGU8VEl0ZW1UeXBlcz4gPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0OiBJVHlwZWRPYnNlcnZhYmxlPFRJdGVtVHlwZXM+O1xyXG4gICAgICAgICAgICBpZiAoIXR5cGVzIHx8IHR5cGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gc3ViamVjdC5jb25jYXQoKSBhcyBhbnkgYXMgSVR5cGVkT2JzZXJ2YWJsZTxUSXRlbVR5cGVzPjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gdHlwZXNbMF07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBzdWJqZWN0LmZpbHRlcihhID0+IGEudHlwZSA9PT0gdHlwZSkgYXMgYW55IGFzIElUeXBlZE9ic2VydmFibGU8VEl0ZW1UeXBlcz47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBzdWJqZWN0LmZpbHRlcihhID0+IHR5cGVzLmluZGV4T2YoYS50eXBlKSA+PSAwKSBhcyBhbnkgYXMgSVR5cGVkT2JzZXJ2YWJsZTxUSXRlbVR5cGVzPjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQudHlwZUZpbHRlciA9IHR5cGVzO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHlwZWQ7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4iLCJcclxuY2xhc3MgVG9waWM8VD4ge1xyXG5cclxuICAgIHByaXZhdGUgX2NoYW5uZWw6IElDaGFubmVsRGVmaW5pdGlvbjxPYmplY3Q+O1xyXG4gICAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNoYW5uZWw6IElDaGFubmVsRGVmaW5pdGlvbjxPYmplY3Q+LCB0b3BpYzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fY2hhbm5lbCA9IGNoYW5uZWw7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IHRvcGljO1xyXG4gICAgfVxyXG5cclxuICAgIG9ic2VydmUoKTogUnguT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIDxSeC5PYnNlcnZhYmxlPFQ+PnRoaXMuX2NoYW5uZWwub2JzZXJ2ZSh0aGlzLl9uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaXNoKGRhdGE6IFQpIHtcclxuICAgICAgICB0aGlzLl9jaGFubmVsLnB1Ymxpc2godGhpcy5fbmFtZSwgZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlKGNhbGxiYWNrOiBJQ2FsbGJhY2s8VD4pOiBJU3Vic2NyaXB0aW9uRGVmaW5pdGlvbjxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWwuc3Vic2NyaWJlKHRoaXMuX25hbWUsIGNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc3VidG9waWMobmFtZSk6IFRvcGljPFQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFRvcGljPFQ+KHRoaXMuX2NoYW5uZWwsIHRoaXMuX25hbWUgKyAnLicgKyBuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc3VidG9waWNPZjxVIGV4dGVuZHMgVD4obmFtZSk6IFRvcGljPFU+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFRvcGljPFU+KHRoaXMuX2NoYW5uZWwsIHRoaXMuX25hbWUgKyAnLicgKyBuYW1lKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuaW50ZXJmYWNlIElQb3N0YWwge1xyXG4gICAgb2JzZXJ2ZTogKG9wdGlvbnM6IFBvc3RhbE9ic2VydmVPcHRpb25zKSA9PiBSeC5PYnNlcnZhYmxlPGFueT47XHJcbn1cclxuXHJcbmludGVyZmFjZSBQb3N0YWxPYnNlcnZlT3B0aW9ucyB7XHJcbiAgICBjaGFubmVsOiBzdHJpbmc7XHJcbiAgICB0b3BpYzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSUNoYW5uZWxEZWZpbml0aW9uPFQ+IHtcclxuICAgIG9ic2VydmUodG9waWM6IHN0cmluZyk6IFJ4Lk9ic2VydmFibGU8VD47XHJcbn1cclxuXHJcbnBvc3RhbC5vYnNlcnZlID0gZnVuY3Rpb24ob3B0aW9uczogUG9zdGFsT2JzZXJ2ZU9wdGlvbnMpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBjaGFubmVsID0gb3B0aW9ucy5jaGFubmVsO1xyXG4gICAgdmFyIHRvcGljID0gb3B0aW9ucy50b3BpYztcclxuXHJcbiAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuKFxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZEhhbmRsZXIoaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5zdWJzY3JpYmUoe1xyXG4gICAgICAgICAgICAgICAgY2hhbm5lbDogY2hhbm5lbCxcclxuICAgICAgICAgICAgICAgIHRvcGljOiB0b3BpYyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBoLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbEhhbmRsZXIoXywgc3ViKSB7XHJcbiAgICAgICAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn07XHJcblxyXG4vLyBhZGQgb2JzZXJ2ZSB0byBDaGFubmVsRGVmaW5pdGlvblxyXG4oPGFueT5wb3N0YWwpLkNoYW5uZWxEZWZpbml0aW9uLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24odG9waWM6IHN0cmluZykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm4oXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkSGFuZGxlcihoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmJ1cy5zdWJzY3JpYmUoe1xyXG4gICAgICAgICAgICAgICAgY2hhbm5lbDogc2VsZi5jaGFubmVsLFxyXG4gICAgICAgICAgICAgICAgdG9waWM6IHRvcGljLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsSGFuZGxlcihfLCBzdWIpIHtcclxuICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufTtcclxuIiwiXHJcbmludGVyZmFjZSBSZWFjdGl2ZURvbUNvbXBvbmVudCB7XHJcbiAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPjtcclxufVxyXG5cclxuY2xhc3MgUmVhY3RpdmVEb20ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIGEgcmVhY3RpdmUgY29tcG9uZW50IHdpdGhpbiBjb250YWluZXIuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXJTdHJlYW0oXHJcbiAgICAgICAgZG9tJDogUnguT2JzZXJ2YWJsZTxWTm9kZT4sXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudCB8IFZOb2RlXHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjb250YWluZXI7XHJcbiAgICAgICAgbGV0IHNpbmsgPSBuZXcgUnguU3ViamVjdDxWTm9kZT4oKTtcclxuICAgICAgICBkb20kLnN1YnNjcmliZShkb20gPT4ge1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIGEgcmVhY3RpdmUgY29tcG9uZW50IHdpdGhpbiBjb250YWluZXIuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXJDb21wb25lbnQoXHJcbiAgICAgICAgY29tcG9uZW50OiBSZWFjdGl2ZURvbUNvbXBvbmVudCxcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50IHwgVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGNvbXBvbmVudC5kb20kLnN1YnNjcmliZShkb20gPT4ge1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIHdpdGhpbiBjb250YWluZXIgd2hlbmV2ZXIgc291cmNlIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsaXZlUmVuZGVyPFQ+KFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZSxcclxuICAgICAgICBzb3VyY2U6IFJ4Lk9ic2VydmFibGU8VD4sXHJcbiAgICAgICAgcmVuZGVyOiAobmV4dDogVCkgPT4gVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gcmVuZGVyKGRhdGEpO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgbm9kZSk7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbn0iLCJcclxudHlwZSBBY3Rpb25UeXBlcyA9IFxyXG4gICAgXCJza2V0Y2guY3JlYXRlXCJcclxuICAgIHwgXCJza2V0Y2gudXBkYXRlXCJcclxuICAgIHwgXCJ0ZXh0YmxvY2suYWRkXCJcclxuICAgIHwgXCJ0ZXh0YmxvY2sudXBkYXRlXCI7XHJcbiAgICBcclxudHlwZSBFdmVudFR5cGVzID1cclxuICAgIFwic2tldGNoLmxvYWRlZFwiXHJcbiAgICB8IFwic2tldGNoLmNoYW5nZWRcIlxyXG4gICAgfCBcInRleHRibG9jay5hZGRlZFwiXHJcbiAgICB8IFwidGV4dGJsb2NrLmNoYW5nZWRcIjtcclxuICIsIlxyXG5jbGFzcyBDb2xvclBpY2tlciB7XHJcbiAgICBzdGF0aWMgc2V0dXAoZWxlbSwgb25DaGFuZ2UpIHtcclxuICAgICAgICBsZXQgc2VsID0gPGFueT4kKGVsZW0pO1xyXG4gICAgICAgICg8YW55PiQoZWxlbSkpLnNwZWN0cnVtKHtcclxuICAgICAgICAgICAgc2hvd0lucHV0OiB0cnVlLFxyXG4gICAgICAgICAgICBhbGxvd0VtcHR5OiB0cnVlLFxyXG4gICAgICAgICAgICBwcmVmZXJyZWRGb3JtYXQ6IFwiaGV4XCIsXHJcbiAgICAgICAgICAgIHNob3dCdXR0b25zOiBmYWxzZSxcclxuICAgICAgICAgICAgc2hvd0FscGhhOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93UGFsZXR0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd1NlbGVjdGlvblBhbGV0dGU6IHRydWUsXHJcbiAgICAgICAgICAgIHBhbGV0dGU6IFtcclxuICAgICAgICAgICAgICAgIFtcIiMwMDBcIiwgXCIjNDQ0XCIsIFwiIzY2NlwiLCBcIiM5OTlcIiwgXCIjY2NjXCIsIFwiI2VlZVwiLCBcIiNmM2YzZjNcIiwgXCIjZmZmXCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiI2YwMFwiLCBcIiNmOTBcIiwgXCIjZmYwXCIsIFwiIzBmMFwiLCBcIiMwZmZcIiwgXCIjMDBmXCIsIFwiIzkwZlwiLCBcIiNmMGZcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjZjRjY2NjXCIsIFwiI2ZjZTVjZFwiLCBcIiNmZmYyY2NcIiwgXCIjZDllYWQzXCIsIFwiI2QwZTBlM1wiLCBcIiNjZmUyZjNcIiwgXCIjZDlkMmU5XCIsIFwiI2VhZDFkY1wiXSxcclxuICAgICAgICAgICAgICAgIFtcIiNlYTk5OTlcIiwgXCIjZjljYjljXCIsIFwiI2ZmZTU5OVwiLCBcIiNiNmQ3YThcIiwgXCIjYTJjNGM5XCIsIFwiIzlmYzVlOFwiLCBcIiNiNGE3ZDZcIiwgXCIjZDVhNmJkXCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiI2UwNjY2NlwiLCBcIiNmNmIyNmJcIiwgXCIjZmZkOTY2XCIsIFwiIzkzYzQ3ZFwiLCBcIiM3NmE1YWZcIiwgXCIjNmZhOGRjXCIsIFwiIzhlN2NjM1wiLCBcIiNjMjdiYTBcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjYzAwXCIsIFwiI2U2OTEzOFwiLCBcIiNmMWMyMzJcIiwgXCIjNmFhODRmXCIsIFwiIzQ1ODE4ZVwiLCBcIiMzZDg1YzZcIiwgXCIjNjc0ZWE3XCIsIFwiI2E2NGQ3OVwiXSxcclxuICAgICAgICAgICAgICAgIFtcIiM5MDBcIiwgXCIjYjQ1ZjA2XCIsIFwiI2JmOTAwMFwiLCBcIiMzODc2MWRcIiwgXCIjMTM0ZjVjXCIsIFwiIzBiNTM5NFwiLCBcIiMzNTFjNzVcIiwgXCIjNzQxYjQ3XCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiIzYwMFwiLCBcIiM3ODNmMDRcIiwgXCIjN2Y2MDAwXCIsIFwiIzI3NGUxM1wiLCBcIiMwYzM0M2RcIiwgXCIjMDczNzYzXCIsIFwiIzIwMTI0ZFwiLCBcIiM0YzExMzBcIl1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlS2V5OiBcInNrZXRjaHRleHRcIixcclxuICAgICAgICAgICAgY2hhbmdlOiBvbkNoYW5nZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufSIsIlxyXG5jb25zdCBBbWF0aWNVcmwgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3MvYW1hdGljc2MvdjgvSURua1JUUEdjclNWbzUwVXlZTks3eTNVU0JuU3Zwa29wUWFVUi0ycjdpVS50dGYnO1xyXG5jb25zdCBSb2JvdG8xMDAgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3Mvcm9ib3RvL3YxNS83TXlncVRlMnpzOVlrUDBhZEE5UVFRLnR0Zic7XHJcbmNvbnN0IFJvYm90bzUwMCA9ICdmb250cy9Sb2JvdG8tNTAwLnR0Zic7XHJcbmNvbnN0IEFxdWFmaW5hU2NyaXB0ID0gJ2ZvbnRzL0FndWFmaW5hU2NyaXB0LVJlZ3VsYXIvQWd1YWZpbmFTY3JpcHQtUmVndWxhci50dGYnXHJcblxyXG5jbGFzcyBEZXNpZ25lckNvbnRyb2xsZXIge1xyXG5cclxuICAgIGZvbnRzOiBvcGVudHlwZS5Gb250W10gPSBbXTtcclxuICAgIHdvcmtzcGFjZUNvbnRyb2xsZXI6IFdvcmtzcGFjZUNvbnRyb2xsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZXZlbnQkOiBJRXZlbnRTdHJlYW0sIG9uRm9udExvYWRlZDooKSA9PiB2b2lkKSB7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEZvbnQoUm9ib3RvNTAwLCBmb250ID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud29ya3NwYWNlQ29udHJvbGxlciA9IG5ldyBXb3Jrc3BhY2VDb250cm9sbGVyKGV2ZW50JCwgZm9udCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBvbkZvbnRMb2FkZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkRm9udCh1cmw6IHN0cmluZywgb25Db21wbGV0ZTogKGY6IG9wZW50eXBlLkZvbnQpID0+IHZvaWQpIHtcclxuICAgICAgICBuZXcgRm9udExvYWRlcih1cmwsIGZvbnQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnRzLnB1c2goZm9udCk7XHJcbiAgICAgICAgICAgIG9uQ29tcGxldGUoZm9udCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJcclxuLy8gaW50ZXJmYWNlIEludGVudCB7XHJcbi8vICAgICB0YWc6IHN0cmluZztcclxuLy8gICAgIGFjdGlvbjogc3RyaW5nO1xyXG4vLyAgICAgZGF0YTogYW55O1xyXG4vLyB9XHJcblxyXG4vLyBjb25zdCBEaXNwYXRjaGVyID0gbmV3IFJ4LlN1YmplY3Q8SW50ZW50PigpO1xyXG5cclxuLy8gY29uc3QgVXNlckxpc3QkID0gRGlzcGF0Y2hlclxyXG4vLyAgICAgLmZpbHRlcih4ID0+IHguYWN0aW9uID09PSAnTGlzdFVzZXJzJyk7XHJcbiAgICBcclxuLy8gLy8gY29uc3QgVXNlckxpc3QkID0gRGlzcGF0Y2hlclxyXG4vLyAvLyAgICAgLmZpbHRlcih4ID0+IHguYWN0aW9uID09PSAnTGlzdFVzZXJzJylcclxuLy8gLy8gICAgIC8vIEZldGNoIGEgbGlzdCBvZiB1c2VycyBmcm9tIEdpdEh1Yi5cclxuLy8gLy8gICAgIC5mbGF0TWFwKCgpID0+IFJ4LkRPTS5nZXRKU09OKCdodHRwczovL2FwaS5naXRodWIuY29tL3VzZXJzJykpXHJcbi8vIC8vICAgICAvLyBGb3JtYXQgdGhlIHJlc3BvbnNlLiBDYXJyeSB0aGUgYWN0aW9uIHRocm91Z2guXHJcbi8vIC8vICAgICAubWFwKHVzZXJzID0+ICh7YWN0aW9uOiAnTGlzdFVzZXJzJywgZGF0YTogdXNlcnN9KSlcclxuLy8gLy8gICAgIC8vIENhY2hlIHRoZSByZXNwb25zZSBzbyBtdWx0aXBsZSBzdWJzY3JpYmVycyBjYW4gZ3JhYlxyXG4vLyAvLyAgICAgLy8gdGhpcyBkYXRhIHdpdGhvdXQgdHJpZ2dlcmluZyByZWR1bmRhbnQgYWpheCByZXF1ZXN0cy5cclxuLy8gLy8gICAgIC5zaGFyZVJlcGxheSgxKTtcclxuXHJcbi8vIGNvbnN0IHN0b3JlJCA9IFJ4Lk9ic2VydmFibGUubWVyZ2UoVXNlckxpc3QkKTtcclxuXHJcbi8vIGNvbnN0IExpc3RWaWV3JCA9IHN0b3JlJFxyXG4vLyAgICAgLmZpbHRlcih4ID0+IHguYWN0aW9uID09PSAnTGlzdFVzZXJzJylcclxuLy8gICAgIC5tYXAoZnVuY3Rpb24oe2RhdGF9KSB7XHJcbi8vICAgICAgICAgcmV0dXJuIChcclxuLy8gICAgICAgICAgICAgaCgndWwnLCBbXHJcbi8vICAgICAgICAgICAgICAgICBkYXRhLm1hcChsb2dpbiA9PiBoKCdsaScpKVxyXG4vLyAgICAgICAgICAgICBdKVxyXG4vLyAgICAgICAgICk7XHJcbi8vICAgICB9KTtcclxuXHJcbi8vIGNvbnN0IHVzZXJEZXRhaWwkID0gRGlzcGF0Y2hlclxyXG4vLyAgICAgLmZpbHRlcih4ID0+IHgudGFnID09PSAnVXNlckRldGFpbCcpXHJcbi8vICAgICAucGx1Y2soJ2RhdGEnLCAnbG9naW4nKVxyXG4vLyAgICAgLmZsYXRNYXAobG9naW4gPT4gUnguRE9NLmdldEpTT04oYGh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcnMvJHtsb2dpbn1gKSlcclxuLy8gICAgIC5tYXAoeCA9PiAoe3RhZzogJ1VzZXJEZXRhaWwnLCBkYXRhOiB4fSkpXHJcbi8vICAgICAuc2hhcmVSZXBsYXkoMSk7XHJcbiAgICBcclxuLy8gY29uc3QgYWxsVmlld3MkID0gUnguT2JzZXJ2YWJsZS5tZXJnZSh1c2VyRGV0YWlsJCk7XHJcblxyXG4vLyBhbGxWaWV3cyQuc3Vic2NyaWJlKGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuLy8gICAgIFJlYWN0aXZlRG9tLnJlbmRlcihjb250ZW50LFxyXG4vLyAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50JykpO1xyXG4vLyB9KTtcclxuXHJcblxyXG4iLCJcclxuZnVuY3Rpb24gUmVuZGVyU2tldGNoRWRpdG9yKHNrZXRjaDogU2tldGNoKTogVk5vZGUge1xyXG4gICAgcmV0dXJuICBoKCdkaXYnLCBbXHJcbiAgICAgICAgICAgIGgoJ2lucHV0LmJhY2tncm91bmQtY29sb3InLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcclxuICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJza2V0Y2gudXBkYXRlXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDoge2JhY2tncm91bmRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBza2V0Y2gudGV4dEJsb2Nrcy5tYXAodGIgPT4gUmVuZGVyVGV4dEJsb2NrRWRpdG9yKHRiKSlcclxuICAgICAgICAgICAgXSk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBSZW5kZXJUZXh0QmxvY2tFZGl0b3IodGV4dEJsb2NrOiBUZXh0QmxvY2spIDogVk5vZGUge1xyXG4gICAgbGV0IHRiVXBkYXRlID0gKHBhcnRpYWw6IFRleHRCbG9jaykgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHtcclxuICAgICAgICAgICAgdHlwZTogXCJ0ZXh0YmxvY2sudXBkYXRlXCIsXHJcbiAgICAgICAgICAgIHBheWxvYWQ6IHBhcnRpYWxcclxuICAgICAgICB9KTsgICAgICAgIFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGgoJ2RpdicsIHsgc3R5bGU6IHsgY29sb3I6ICcjMDAwJyB9IH0sIFtcclxuICAgICAgICBoKCd0ZXh0YXJlYScsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IHRleHRCbG9jay50ZXh0LFxyXG4gICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICBrZXl1cDogZSA9PiB0YlVwZGF0ZSh0YiA9PiB0Yi50ZXh0ID0gZS50YXJnZXQudmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZSA9PiB0YlVwZGF0ZSh0YiA9PiB0Yi50ZXh0ID0gZS50YXJnZXQudmFsdWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgIGgoJ2lucHV0LnRleHQtY29sb3InLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXHJcbiAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdGJVcGRhdGUoeyB0ZXh0Q29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCl9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgIGgoJ2lucHV0LmJhY2tncm91bmQtY29sb3InLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXHJcbiAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdGJVcGRhdGUoeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCl9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgXSk7XHJcbn1cclxuIiwiXHJcbmRlY2xhcmUgdmFyIHNvbHZlOiAoYTogYW55LCBiOiBhbnksIGZhc3Q6IGJvb2xlYW4pID0+IHZvaWQ7XHJcblxyXG5jbGFzcyBQZXJzcGVjdGl2ZVRyYW5zZm9ybSB7XHJcbiAgICBcclxuICAgIHNvdXJjZTogUXVhZDtcclxuICAgIGRlc3Q6IFF1YWQ7XHJcbiAgICBwZXJzcDogYW55O1xyXG4gICAgbWF0cml4OiBudW1iZXJbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc291cmNlOiBRdWFkLCBkZXN0OiBRdWFkKXtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLmRlc3QgPSBkZXN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0uY3JlYXRlTWF0cml4KHNvdXJjZSwgZGVzdCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEdpdmVuIGEgNHg0IHBlcnNwZWN0aXZlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCwgYW5kIGEgMkQgcG9pbnQgKGEgMngxIHZlY3RvciksXHJcbiAgICAvLyBhcHBsaWVzIHRoZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggYnkgY29udmVydGluZyB0aGUgcG9pbnQgdG8gaG9tb2dlbmVvdXNcclxuICAgIC8vIGNvb3JkaW5hdGVzIGF0IHo9MCwgcG9zdC1tdWx0aXBseWluZywgYW5kIHRoZW4gYXBwbHlpbmcgYSBwZXJzcGVjdGl2ZSBkaXZpZGUuXHJcbiAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgbGV0IHAzID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0ubXVsdGlwbHkodGhpcy5tYXRyaXgsIFtwb2ludC54LCBwb2ludC55LCAwLCAxXSk7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBwYXBlci5Qb2ludChwM1swXSAvIHAzWzNdLCBwM1sxXSAvIHAzWzNdKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgY3JlYXRlTWF0cml4KHNvdXJjZTogUXVhZCwgdGFyZ2V0OiBRdWFkKTogbnVtYmVyW10ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzb3VyY2VQb2ludHMgPSBbXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYS54LCBzb3VyY2UuYS55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYi54LCBzb3VyY2UuYi55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYy54LCBzb3VyY2UuYy55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuZC54LCBzb3VyY2UuZC55XV07XHJcbiAgICAgICAgbGV0IHRhcmdldFBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3RhcmdldC5hLngsIHRhcmdldC5hLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5iLngsIHRhcmdldC5iLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5jLngsIHRhcmdldC5jLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5kLngsIHRhcmdldC5kLnldXTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBhID0gW10sIGIgPSBbXSwgaSA9IDAsIG4gPSBzb3VyY2VQb2ludHMubGVuZ3RoOyBpIDwgbjsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBzID0gc291cmNlUG9pbnRzW2ldLCB0ID0gdGFyZ2V0UG9pbnRzW2ldO1xyXG4gICAgICAgICAgICBhLnB1c2goW3NbMF0sIHNbMV0sIDEsIDAsIDAsIDAsIC1zWzBdICogdFswXSwgLXNbMV0gKiB0WzBdXSksIGIucHVzaCh0WzBdKTtcclxuICAgICAgICAgICAgYS5wdXNoKFswLCAwLCAwLCBzWzBdLCBzWzFdLCAxLCAtc1swXSAqIHRbMV0sIC1zWzFdICogdFsxXV0pLCBiLnB1c2godFsxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgWCA9IHNvbHZlKGEsIGIsIHRydWUpOyBcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBYWzBdLCBYWzNdLCAwLCBYWzZdLFxyXG4gICAgICAgICAgICBYWzFdLCBYWzRdLCAwLCBYWzddLFxyXG4gICAgICAgICAgICAgICAwLCAgICAwLCAxLCAgICAwLFxyXG4gICAgICAgICAgICBYWzJdLCBYWzVdLCAwLCAgICAxXHJcbiAgICAgICAgXS5tYXAoZnVuY3Rpb24oeCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh4ICogMTAwMDAwKSAvIDEwMDAwMDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQb3N0LW11bHRpcGx5IGEgNHg0IG1hdHJpeCBpbiBjb2x1bW4tbWFqb3Igb3JkZXIgYnkgYSA0eDEgY29sdW1uIHZlY3RvcjpcclxuICAgIC8vIFsgbTAgbTQgbTggIG0xMiBdICAgWyB2MCBdICAgWyB4IF1cclxuICAgIC8vIFsgbTEgbTUgbTkgIG0xMyBdICogWyB2MSBdID0gWyB5IF1cclxuICAgIC8vIFsgbTIgbTYgbTEwIG0xNCBdICAgWyB2MiBdICAgWyB6IF1cclxuICAgIC8vIFsgbTMgbTcgbTExIG0xNSBdICAgWyB2MyBdICAgWyB3IF1cclxuICAgIHN0YXRpYyBtdWx0aXBseShtYXRyaXgsIHZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIG1hdHJpeFswXSAqIHZlY3RvclswXSArIG1hdHJpeFs0XSAqIHZlY3RvclsxXSArIG1hdHJpeFs4IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTJdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMV0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNV0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbOSBdICogdmVjdG9yWzJdICsgbWF0cml4WzEzXSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzJdICogdmVjdG9yWzBdICsgbWF0cml4WzZdICogdmVjdG9yWzFdICsgbWF0cml4WzEwXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNF0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFszXSAqIHZlY3RvclswXSArIG1hdHJpeFs3XSAqIHZlY3RvclsxXSArIG1hdHJpeFsxMV0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTVdICogdmVjdG9yWzNdXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUXVhZCB7XHJcbiAgICBhOiBwYXBlci5Qb2ludDtcclxuICAgIGI6IHBhcGVyLlBvaW50O1xyXG4gICAgYzogcGFwZXIuUG9pbnQ7XHJcbiAgICBkOiBwYXBlci5Qb2ludDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50LCBjOiBwYXBlci5Qb2ludCwgZDogcGFwZXIuUG9pbnQpe1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmMgPSBjO1xyXG4gICAgICAgIHRoaXMuZCA9IGQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tUmVjdGFuZ2xlKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICByZWN0LnRvcExlZnQsXHJcbiAgICAgICAgICAgIHJlY3QudG9wUmlnaHQsXHJcbiAgICAgICAgICAgIHJlY3QuYm90dG9tTGVmdCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21SaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tQ29vcmRzKGNvb3JkczogbnVtYmVyW10pIDogUXVhZCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzBdLCBjb29yZHNbMV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzJdLCBjb29yZHNbM10pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzRdLCBjb29yZHNbNV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzZdLCBjb29yZHNbN10pXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhc0Nvb3JkcygpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgdGhpcy5hLngsIHRoaXMuYS55LFxyXG4gICAgICAgICAgICB0aGlzLmIueCwgdGhpcy5iLnksXHJcbiAgICAgICAgICAgIHRoaXMuYy54LCB0aGlzLmMueSxcclxuICAgICAgICAgICAgdGhpcy5kLngsIHRoaXMuZC55XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBTa2V0Y2gge1xyXG5cclxuICAgIGJhY2tncm91bmRDb2xvcjogc3RyaW5nO1xyXG5cclxuICAgIHRleHRCbG9ja3M6IFRleHRCbG9ja1tdID0gW107XHJcbiAgICBcclxufVxyXG4iLCJcclxuaW50ZXJmYWNlIFRleHRCbG9jayB7XHJcbiAgICBfaWQ/OiBzdHJpbmc7XHJcbiAgICB0ZXh0Pzogc3RyaW5nO1xyXG4gICAgdGV4dENvbG9yPzogc3RyaW5nO1xyXG4gICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgZm9udD86IHN0cmluZztcclxuICAgIGZvbnRTaXplPzogbnVtYmVyO1xyXG59IiwiXHJcbmNsYXNzIFJvb3RTdG9yZSB7XHJcblxyXG4gICAgc3RhdGU6IFNrZXRjaDtcclxuICAgIGFjdGlvbiQ6IFRSdXguSUFjdGlvblN1YmplY3Q8QWN0aW9uVHlwZXM+O1xyXG4gICAgZXZlbnQkOiBUUnV4LklFdmVudFN1YmplY3Q8RXZlbnRUeXBlcz47XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgYWN0aW9uJDogVFJ1eC5JQWN0aW9uU3ViamVjdDxBY3Rpb25UeXBlcz4sXHJcbiAgICAgICAgZXZlbnQkOiBUUnV4LklFdmVudFN1YmplY3Q8RXZlbnRUeXBlcz4pIHtcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpb24kID0gYWN0aW9uJDtcclxuICAgICAgICB0aGlzLmV2ZW50JCA9IGV2ZW50JDtcclxuXHJcbiAgICAgICAgYWN0aW9uJC5vZlR5cGUoXCJza2V0Y2guY3JlYXRlXCIpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IG5ldyBTa2V0Y2goKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZEV2ZW50KFwic2tldGNoLmxvYWRlZFwiLCB0aGlzLnN0YXRlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbiQub2ZUeXBlKFwic2tldGNoLnVwZGF0ZVwiKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIF8uYXNzaWduKHRoaXMuc3RhdGUsIGV2LnBheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kRXZlbnQoXCJza2V0Y2guY2hhbmdlZFwiLCB0aGlzLnN0YXRlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbiQub2ZUeXBlKFwidGV4dGJsb2NrLmFkZFwiKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXRjaCA9IGV2LnBheWxvYWQgYXMgVGV4dEJsb2NrO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0geyBfaWQ6IG5ld2lkKCkgfSBhcyBUZXh0QmxvY2s7XHJcbiAgICAgICAgICAgICAgICBfLmFzc2lnbihibG9jaywgcGF0Y2gpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS50ZXh0QmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kRXZlbnQoXCJ0ZXh0YmxvY2suYWRkZWRcIiwgYmxvY2spO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9uJC5vZlR5cGUoXCJ0ZXh0YmxvY2sudXBkYXRlXCIpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gZXYucGF5bG9hZCBhcyBUZXh0QmxvY2s7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSBfLmZpbmQodGhpcy5zdGF0ZS50ZXh0QmxvY2tzLCB0YiA9PiB0Yi5faWQgPT09IHBhdGNoLl9pZCk7XHJcbiAgICAgICAgICAgICAgICBpZihibG9jayl7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5hc3NpZ24oYmxvY2ssIHBhdGNoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZEV2ZW50KFwidGV4dGJsb2NrLmNoYW5nZWRcIiwgYmxvY2spO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2VuZEV2ZW50KHR5cGU6IEV2ZW50VHlwZXMsIGV2ZW50RGF0YTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5ldmVudCQub25OZXh0KHtcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgZXZlbnREYXRhOiBldmVudERhdGEsXHJcbiAgICAgICAgICAgIHJvb3REYXRhOiB0aGlzLnN0YXRlXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbn0iLCJcclxuLyoqXHJcbiAqIEhhbmRsZSB0aGF0IHNpdHMgb24gbWlkcG9pbnQgb2YgY3VydmVcclxuICogICB3aGljaCB3aWxsIHNwbGl0IHRoZSBjdXJ2ZSB3aGVuIGRyYWdnZWQuXHJcbiAqL1xyXG5jbGFzcyBDdXJ2ZVNwbGl0dGVySGFuZGxlIGV4dGVuZHMgcGFwZXIuU2hhcGUge1xyXG4gXHJcbiAgICBjdXJ2ZTogcGFwZXIuQ3VydmU7XHJcbiAgICBvbkRyYWdTdGFydDogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbkRyYWdFbmQ6IChuZXdTZWdtZW50OiBwYXBlci5TZWdtZW50LCBldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gXHJcbiAgICBjb25zdHJ1Y3RvcihjdXJ2ZTogcGFwZXIuQ3VydmUpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VydmUgPSBjdXJ2ZTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc2VsZiA9IDxhbnk+dGhpcztcclxuICAgICAgICBzZWxmLl90eXBlID0gJ2NpcmNsZSc7XHJcbiAgICAgICAgc2VsZi5fcmFkaXVzID0gMTU7XHJcbiAgICAgICAgc2VsZi5fc2l6ZSA9IG5ldyBwYXBlci5TaXplKHNlbGYuX3JhZGl1cyAqIDIpO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKGN1cnZlLmdldFBvaW50QXQoMC41ICogY3VydmUubGVuZ3RoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDI7XHJcbiAgICAgICAgdGhpcy5zdHJva2VDb2xvciA9ICdibHVlJztcclxuICAgICAgICB0aGlzLmZpbGxDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gMC41ICogMC4zOyBcclxuIFxyXG4gICAgICAgIGxldCBuZXdTZWdtZW50OiBwYXBlci5TZWdtZW50O1xyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IDxNb3VzZUJlaGF2aW9yPntcclxuICAgICAgICAgICAgb25EcmFnU3RhcnQ6IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudCA9IG5ldyBwYXBlci5TZWdtZW50KHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY3VydmUucGF0aC5pbnNlcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmUuaW5kZXggKyAxLCBcclxuICAgICAgICAgICAgICAgICAgICBuZXdTZWdtZW50XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkRyYWdTdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkRyYWdTdGFydChldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ01vdmU6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdQb3MgPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zO1xyXG4gICAgICAgICAgICAgICAgbmV3U2VnbWVudC5wb2ludCA9IG5ld1BvcztcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ0VuZDogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkRyYWdFbmQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25EcmFnRW5kKG5ld1NlZ21lbnQsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcclxuICAgIGludGVyZmFjZSBJdGVtIHtcclxuICAgICAgICBtb3VzZUJlaGF2aW9yOiBNb3VzZUJlaGF2aW9yO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgTW91c2VCZWhhdmlvciB7XHJcbiAgICBvbkNsaWNrPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gICAgb25PdmVyU3RhcnQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uT3Zlck1vdmU/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uT3ZlckVuZD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICAgIG9uRHJhZ1N0YXJ0PzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbkRyYWdNb3ZlPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbkRyYWdFbmQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxufVxyXG5cclxuaW50ZXJmYWNlIE1vdXNlQWN0aW9uIHtcclxuICAgIHN0YXJ0RXZlbnQ6IHBhcGVyLlRvb2xFdmVudDtcclxuICAgIGl0ZW06IHBhcGVyLkl0ZW07XHJcbiAgICBkcmFnZ2VkOiBib29sZWFuO1xyXG59XHJcblxyXG5jbGFzcyBNb3VzZUJlaGF2aW9yVG9vbCBleHRlbmRzIHBhcGVyLlRvb2wge1xyXG5cclxuICAgIGhpdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgc2VnbWVudHM6IHRydWUsXHJcbiAgICAgICAgc3Ryb2tlOiB0cnVlLFxyXG4gICAgICAgIGZpbGw6IHRydWUsXHJcbiAgICAgICAgdG9sZXJhbmNlOiA1XHJcbiAgICB9O1xyXG5cclxuICAgIHByZXNzQWN0aW9uOiBNb3VzZUFjdGlvbjtcclxuICAgIGhvdmVyQWN0aW9uOiBNb3VzZUFjdGlvbjtcclxuICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvamVjdDogcGFwZXIuUHJvamVjdCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93biA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIHRoaXMucHJlc3NBY3Rpb24gPSBudWxsO1xyXG5cclxuICAgICAgICB2YXIgaGl0UmVzdWx0ID0gdGhpcy5wcm9qZWN0LmhpdFRlc3QoXHJcbiAgICAgICAgICAgIGV2ZW50LnBvaW50LFxyXG4gICAgICAgICAgICB0aGlzLmhpdE9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAoaGl0UmVzdWx0ICYmIGhpdFJlc3VsdC5pdGVtKSB7XHJcbiAgICAgICAgICAgIGxldCBkcmFnZ2FibGUgPSB0aGlzLmZpbmREcmFnSGFuZGxlcihoaXRSZXN1bHQuaXRlbSk7XHJcbiAgICAgICAgICAgIGlmIChkcmFnZ2FibGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24gPSA8TW91c2VBY3Rpb24+e1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06IGRyYWdnYWJsZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlTW92ZSA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIHZhciBoaXRSZXN1bHQgPSB0aGlzLnByb2plY3QuaGl0VGVzdChcclxuICAgICAgICAgICAgZXZlbnQucG9pbnQsXHJcbiAgICAgICAgICAgIHRoaXMuaGl0T3B0aW9ucyk7XHJcbiAgICAgICAgbGV0IGhhbmRsZXJJdGVtID0gaGl0UmVzdWx0XHJcbiAgICAgICAgICAgICYmIHRoaXMuZmluZE92ZXJIYW5kbGVyKGhpdFJlc3VsdC5pdGVtKTtcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAvLyB3ZXJlIHByZXZpb3VzbHkgaG92ZXJpbmdcclxuICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvblxyXG4gICAgICAgICAgICAmJiAoXHJcbiAgICAgICAgICAgICAgICAvLyBub3QgaG92ZXJpbmcgb3ZlciBhbnl0aGluZyBub3dcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJJdGVtID09IG51bGxcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBob3ZlcmluZyBvdmVyIGN1cnJlbnQgaGFuZGxlciBvciBkZXNjZW5kZW50IHRoZXJlb2ZcclxuICAgICAgICAgICAgICAgIHx8ICFNb3VzZUJlaGF2aW9yVG9vbC5pc1NhbWVPckFuY2VzdG9yKFxyXG4gICAgICAgICAgICAgICAgICAgIGhpdFJlc3VsdC5pdGVtLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24uaXRlbSkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vIGp1c3QgbGVhdmluZ1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ob3ZlckFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25PdmVyRW5kKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbk92ZXJFbmQoZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGhhbmRsZXJJdGVtICYmIGhhbmRsZXJJdGVtLm1vdXNlQmVoYXZpb3IpIHtcclxuICAgICAgICAgICAgbGV0IGJlaGF2aW9yID0gaGFuZGxlckl0ZW0ubW91c2VCZWhhdmlvcjtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhvdmVyQWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uID0gPE1vdXNlQWN0aW9uPntcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiBoYW5kbGVySXRlbVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmIChiZWhhdmlvci5vbk92ZXJTdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yLm9uT3ZlclN0YXJ0KGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYmVoYXZpb3IgJiYgYmVoYXZpb3Iub25PdmVyTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgYmVoYXZpb3Iub25PdmVyTW92ZShldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURyYWcgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5wcmVzc0FjdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucHJlc3NBY3Rpb24uZHJhZ2dlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5kcmFnZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdTdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ1N0YXJ0LmNhbGwoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24uaXRlbSwgdGhpcy5wcmVzc0FjdGlvbi5zdGFydEV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnTW92ZS5jYWxsKHRoaXMucHJlc3NBY3Rpb24uaXRlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGxldCBhY3Rpb24gPSB0aGlzLnByZXNzQWN0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChhY3Rpb24uZHJhZ2dlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gZHJhZ1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnRW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdFbmQuY2FsbChhY3Rpb24uaXRlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY2xpY2tcclxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uQ2xpY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uQ2xpY2suY2FsbChhY3Rpb24uaXRlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uS2V5RG93biA9IChldmVudCkgPT4ge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZSBpZiBjb250YWluZXIgaXMgYW4gYW5jZXN0b3Igb2YgaXRlbS4gXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpc1NhbWVPckFuY2VzdG9yKGl0ZW06IHBhcGVyLkl0ZW0sIGNvbnRhaW5lcjogcGFwZXIuSXRlbSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhIVBhcGVySGVscGVycy5maW5kU2VsZk9yQW5jZXN0b3IoaXRlbSwgcGEgPT4gcGEgPT09IGNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZERyYWdIYW5kbGVyKGl0ZW06IHBhcGVyLkl0ZW0pOiBwYXBlci5JdGVtIHtcclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvcihcclxuICAgICAgICAgICAgaXRlbSwgXHJcbiAgICAgICAgICAgIHBhID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYiA9IHBhLm1vdXNlQmVoYXZpb3I7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gISEobWIgJiZcclxuICAgICAgICAgICAgICAgICAgICAobWIub25EcmFnU3RhcnQgfHwgbWIub25EcmFnTW92ZSB8fCBtYi5vbkRyYWdFbmQpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZpbmRPdmVySGFuZGxlcihpdGVtOiBwYXBlci5JdGVtKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kU2VsZk9yQW5jZXN0b3IoXHJcbiAgICAgICAgICAgIGl0ZW0sIFxyXG4gICAgICAgICAgICBwYSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWIgPSBwYS5tb3VzZUJlaGF2aW9yO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKG1iICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKG1iLm9uT3ZlclN0YXJ0IHx8IG1iLm9uT3Zlck1vdmUgfHwgbWIub25PdmVyRW5kICkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgUGFwZXJIZWxwZXJzIHtcclxuXHJcbiAgICBzdGF0aWMgaW1wb3J0T3BlblR5cGVQYXRoKG9wZW5QYXRoOiBvcGVudHlwZS5QYXRoKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChvcGVuUGF0aC50b1BhdGhEYXRhKCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGxldCBzdmcgPSBvcGVuUGF0aC50b1NWRyg0KTtcclxuICAgICAgICAvLyByZXR1cm4gPHBhcGVyLlBhdGg+cGFwZXIucHJvamVjdC5pbXBvcnRTVkcoc3ZnKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdHJhY2VQYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuUGF0aEl0ZW0ge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VDb21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgsIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgaWYgKCFwYXRoLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBhdGhzID0gcGF0aC5jaGlsZHJlbi5tYXAocCA9PlxyXG4gICAgICAgICAgICB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wLCBwb2ludHNQZXJQYXRoKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgoe1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogcGF0aHMsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZVBhdGgocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAvLyBpZighcGF0aCB8fCAhcGF0aC5zZWdtZW50cyB8fCBwYXRoLnNlZ21lbnRzLmxlbmd0aCl7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBsZXQgcGF0aExlbmd0aCA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGxldCBvZmZzZXRJbmNyID0gcGF0aExlbmd0aCAvIG51bVBvaW50cztcclxuICAgICAgICBsZXQgcG9pbnRzID0gW107XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAoaSsrIDwgbnVtUG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IHBhdGguZ2V0UG9pbnRBdChNYXRoLm1pbihvZmZzZXQsIHBhdGhMZW5ndGgpKTtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gb2Zmc2V0SW5jcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgIHNlZ21lbnRzOiBwb2ludHMsXHJcbiAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzYW5kd2ljaFBhdGhQcm9qZWN0aW9uKHRvcFBhdGg6IHBhcGVyLkN1cnZlbGlrZSwgYm90dG9tUGF0aDogcGFwZXIuQ3VydmVsaWtlKVxyXG4gICAgICAgIDogKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBjb25zdCB0b3BQYXRoTGVuZ3RoID0gdG9wUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgYm90dG9tUGF0aExlbmd0aCA9IGJvdHRvbVBhdGgubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbih1bml0UG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgICAgICBsZXQgdG9wUG9pbnQgPSB0b3BQYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiB0b3BQYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICAgbGV0IGJvdHRvbVBvaW50ID0gYm90dG9tUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogYm90dG9tUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGlmICh0b3BQb2ludCA9PSBudWxsIHx8IGJvdHRvbVBvaW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiY291bGQgbm90IGdldCBwcm9qZWN0ZWQgcG9pbnQgZm9yIHVuaXQgcG9pbnQgXCIgKyB1bml0UG9pbnQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdG9wUG9pbnQuYWRkKGJvdHRvbVBvaW50LnN1YnRyYWN0KHRvcFBvaW50KS5tdWx0aXBseSh1bml0UG9pbnQueSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyR3JvdXA6IHBhcGVyLkdyb3VwO1xyXG5cclxuICAgIHN0YXRpYyByZXNldE1hcmtlcnMoKXtcclxuICAgICAgICBpZihQYXBlckhlbHBlcnMubWFya2VyR3JvdXApe1xyXG4gICAgICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5vcGFjaXR5ID0gMC4yO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXJrZXJMaW5lKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCk6IHBhcGVyLkl0ZW17XHJcbiAgICAgICAgbGV0IGxpbmUgPSBwYXBlci5QYXRoLkxpbmUoYSxiKTtcclxuICAgICAgICBsaW5lLnN0cm9rZUNvbG9yID0gJ2dyZWVuJztcclxuICAgICAgICAvL2xpbmUuZGFzaEFycmF5ID0gWzUsIDVdO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChsaW5lKTtcclxuICAgICAgICByZXR1cm4gbGluZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyKHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIGxldCBtYXJrZXIgPSBwYXBlci5TaGFwZS5DaXJjbGUocG9pbnQsIDIpO1xyXG4gICAgICAgIG1hcmtlci5zdHJva2VDb2xvciA9ICdyZWQnO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChtYXJrZXIpO1xyXG4gICAgICAgIHJldHVybiBtYXJrZXI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNpbXBsaWZ5KHBhdGg6IHBhcGVyLlBhdGhJdGVtLCB0b2xlcmFuY2U/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNpbXBsaWZ5KDxwYXBlci5QYXRoSXRlbT5wLCB0b2xlcmFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKDxwYXBlci5QYXRoPnBhdGgpLnNpbXBsaWZ5KHRvbGVyYW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluZCBzZWxmIG9yIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovICAgIFxyXG4gICAgc3RhdGljIGZpbmRTZWxmT3JBbmNlc3RvcihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKXtcclxuICAgICAgICBpZihwcmVkaWNhdGUoaXRlbSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kQW5jZXN0b3IoaXRlbSwgcHJlZGljYXRlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZmluZEFuY2VzdG9yKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pe1xyXG4gICAgICAgIGlmKCFpdGVtKXtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwcmlvcjogcGFwZXIuSXRlbTtcclxuICAgICAgICBsZXQgY2hlY2tpbmcgPSBpdGVtLnBhcmVudDtcclxuICAgICAgICB3aGlsZShjaGVja2luZyAmJiBjaGVja2luZyAhPT0gcHJpb3Ipe1xyXG4gICAgICAgICAgICBpZihwcmVkaWNhdGUoY2hlY2tpbmcpKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjaGVja2luZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmlvciA9IGNoZWNraW5nO1xyXG4gICAgICAgICAgICBjaGVja2luZyA9IGNoZWNraW5nLnBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogVGhlIGNvcm5lcnMgb2YgdGhlIHJlY3QsIGNsb2Nrd2lzZSBzdGFydGluZyBmcm9tIHRvcExlZnRcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvcm5lcnMocmVjdDogcGFwZXIuUmVjdGFuZ2xlKTogcGFwZXIuUG9pbnRbXXtcclxuICAgICAgICByZXR1cm4gW3JlY3QudG9wTGVmdCwgcmVjdC50b3BSaWdodCwgcmVjdC5ib3R0b21SaWdodCwgcmVjdC5ib3R0b21MZWZ0XTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBQYXRoU2VjdGlvbiBpbXBsZW1lbnRzIHBhcGVyLkN1cnZlbGlrZSB7XHJcbiAgICBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgb2Zmc2V0OiBudW1iZXI7XHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocGF0aDogcGFwZXIuUGF0aCwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRQb2ludEF0KG9mZnNldDogbnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXRoLmdldFBvaW50QXQob2Zmc2V0ICsgdGhpcy5vZmZzZXQpO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFBhdGhUcmFuc2Zvcm0ge1xyXG4gICAgcG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRUcmFuc2Zvcm0gPSBwb2ludFRyYW5zZm9ybTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRUcmFuc2Zvcm0ocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBhdGhJdGVtKHBhdGg6IHBhcGVyLlBhdGhJdGVtKSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtQ29tcG91bmRQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCkge1xyXG4gICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBhdGgocGF0aDogcGFwZXIuUGF0aCkge1xyXG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2YgcGF0aC5zZWdtZW50cykge1xyXG4gICAgICAgICAgICBsZXQgb3JpZ1BvaW50ID0gc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgbGV0IG5ld1BvaW50ID0gdGhpcy50cmFuc2Zvcm1Qb2ludChzZWdtZW50LnBvaW50KTtcclxuICAgICAgICAgICAgb3JpZ1BvaW50LnggPSBuZXdQb2ludC54O1xyXG4gICAgICAgICAgICBvcmlnUG9pbnQueSA9IG5ld1BvaW50Lnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbiIsIlxyXG5jbGFzcyBTZWdtZW50SGFuZGxlIGV4dGVuZHMgcGFwZXIuU2hhcGUge1xyXG4gXHJcbiAgICBzZWdtZW50OiBwYXBlci5TZWdtZW50O1xyXG4gICAgb25EcmFnU3RhcnQ6IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25DaGFuZ2VDb21wbGV0ZTogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3Ntb290aGVkOiBib29sZWFuO1xyXG4gXHJcbiAgICBjb25zdHJ1Y3RvcihzZWdtZW50OiBwYXBlci5TZWdtZW50LCByYWRpdXM/OiBudW1iZXIpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZWdtZW50ID0gc2VnbWVudDtcclxuXHJcbiAgICAgICAgbGV0IHNlbGYgPSA8YW55PnRoaXM7XHJcbiAgICAgICAgc2VsZi5fdHlwZSA9ICdjaXJjbGUnO1xyXG4gICAgICAgIHNlbGYuX3JhZGl1cyA9IDE1O1xyXG4gICAgICAgIHNlbGYuX3NpemUgPSBuZXcgcGFwZXIuU2l6ZShzZWxmLl9yYWRpdXMgKiAyKTtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShzZWdtZW50LnBvaW50KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0cm9rZVdpZHRoID0gMjtcclxuICAgICAgICB0aGlzLnN0cm9rZUNvbG9yID0gJ2JsdWUnO1xyXG4gICAgICAgIHRoaXMuZmlsbENvbG9yID0gJ3doaXRlJztcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAwLjc7IFxyXG5cclxuICAgICAgICB0aGlzLm1vdXNlQmVoYXZpb3IgPSA8TW91c2VCZWhhdmlvcj57XHJcbiAgICAgICAgICAgIG9uRHJhZ1N0YXJ0OiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgaWYodGhpcy5vbkRyYWdTdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMub25EcmFnU3RhcnQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgIH0gIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3UG9zID0gdGhpcy5wb3NpdGlvbi5hZGQoZXZlbnQuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ld1BvcztcclxuICAgICAgICAgICAgICAgIHNlZ21lbnQucG9pbnQgPSBuZXdQb3M7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ0VuZDogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc21vb3RoZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMub25DaGFuZ2VDb21wbGV0ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5nZUNvbXBsZXRlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25DbGljazogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zbW9vdGhlZCA9ICF0aGlzLnNtb290aGVkO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkNoYW5nZUNvbXBsZXRlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbmdlQ29tcGxldGUoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgc21vb3RoZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Ntb290aGVkO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXQgc21vb3RoZWQodmFsdWU6IGJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuX3Ntb290aGVkID0gdmFsdWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudC5oYW5kbGVJbiA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudC5oYW5kbGVPdXQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgU3RyZXRjaHlQYXRoIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG4gICAgICAgICAgICBcclxuICAgIHNvdXJjZVBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIGRpc3BsYXlQYXRoOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBhcnJhbmdlZFBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIGNvcm5lcnM6IHBhcGVyLlNlZ21lbnRbXTtcclxuICAgIG91dGxpbmU6IHBhcGVyLlBhdGg7XHJcbiAgICBzaGFwZUNoYW5nZWQ6IGJvb2xlYW47XHJcbiAgICBcclxuICAgIHByaXZhdGUgX29wdGlvbnM6IFN0cmV0Y2h5UGF0aE9wdGlvbnM7ICAgIFxyXG4gICAgXHJcbiAgICBzdGF0aWMgT1VUTElORV9QT0lOVFMgPSAyMzA7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRm9yIHJlYnVpbGRpbmcgdGhlIG1pZHBvaW50IGhhbmRsZXNcclxuICAgICAqIGFzIG91dGxpbmUgY2hhbmdlcy5cclxuICAgICAqL1xyXG4gICAgbWlkcG9pbnRHcm91cDogcGFwZXIuR3JvdXA7XHJcbiAgICBzZWdtZW50TWFya2Vyc0dyb3VwOiBwYXBlci5Hcm91cDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VQYXRoOiBwYXBlci5Db21wb3VuZFBhdGgsIG9wdGlvbnM/OiBTdHJldGNoeVBhdGhPcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfHwgPFN0cmV0Y2h5UGF0aE9wdGlvbnM+e1xyXG4gICAgICAgICAgICBwYXRoRmlsbENvbG9yOiAnZ3JheSdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldFBhdGgoc291cmNlUGF0aCk7XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLmNyZWF0ZU91dGxpbmUoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVNlZ21lbnRNYXJrZXJzKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNaWRwaW9udE1hcmtlcnMoKTtcclxuICAgICAgICB0aGlzLnNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkoZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0ge1xyXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ1N0YXJ0OiAoKSA9PiB0aGlzLmJyaW5nVG9Gcm9udCgpLFxyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uT3ZlclN0YXJ0OiAoKSA9PiB0aGlzLnNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkodHJ1ZSksXHJcbiAgICAgICAgICAgIG9uT3ZlckVuZDogKCkgPT4gdGhpcy5zZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KGZhbHNlKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG9wdGlvbnMoKSA6IFN0cmV0Y2h5UGF0aE9wdGlvbnMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBvcHRpb25zKHZhbHVlOiBTdHJldGNoeVBhdGhPcHRpb25zKXtcclxuICAgICAgICBpZighdmFsdWUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUJhY2tncm91bmRDb2xvcigpO1xyXG4gICAgICAgIGlmKHRoaXMuYXJyYW5nZWRQYXRoKXtcclxuICAgICAgICAgICAgdGhpcy5hcnJhbmdlZFBhdGguZmlsbENvbG9yID0gdmFsdWUucGF0aEZpbGxDb2xvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpe1xyXG4gICAgICAgIHRoaXMuc2V0UGF0aChwYXRoKTtcclxuICAgICAgICBpZighdGhpcy5zaGFwZUNoYW5nZWQpe1xyXG4gICAgICAgICAgICB0aGlzLm91dGxpbmUuYm91bmRzLnNpemUgPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzLnNpemU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTWlkcGlvbnRNYXJrZXJzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2VnbWVudE1hcmtlcnMoKTsgICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0UGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpe1xyXG4gICAgICAgIGlmKHRoaXMuc291cmNlUGF0aCl7XHJcbiAgICAgICAgICAgIHRoaXMuc291cmNlUGF0aC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXRoID0gcGF0aDtcclxuICAgICAgICBwYXRoLnZpc2libGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KHZhbHVlOiBib29sZWFuKXtcclxuICAgICAgICB0aGlzLnNlZ21lbnRNYXJrZXJzR3JvdXAudmlzaWJsZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubWlkcG9pbnRHcm91cC52aXNpYmxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lLnN0cm9rZUNvbG9yID0gdmFsdWUgPyAnbGlnaHRncmF5JyA6IG51bGw7IFxyXG4gICAgfVxyXG5cclxuICAgIGFycmFuZ2VDb250ZW50cygpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1pZHBpb250TWFya2VycygpO1xyXG4gICAgICAgIHRoaXMuYXJyYW5nZVBhdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBhcnJhbmdlUGF0aCgpIHtcclxuICAgICAgICBsZXQgb3J0aE9yaWdpbiA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMudG9wTGVmdDtcclxuICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy53aWR0aDtcclxuICAgICAgICBsZXQgb3J0aEhlaWdodCA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBzaWRlcyA9IHRoaXMuZ2V0T3V0bGluZVNpZGVzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHRvcCA9IHNpZGVzWzBdO1xyXG4gICAgICAgIGxldCBib3R0b20gPSBzaWRlc1syXTtcclxuICAgICAgICBib3R0b20ucmV2ZXJzZSgpO1xyXG4gICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLnNhbmR3aWNoUGF0aFByb2plY3Rpb24odG9wLCBib3R0b20pO1xyXG4gICAgICAgIGxldCB0cmFuc2Zvcm0gPSBuZXcgUGF0aFRyYW5zZm9ybShwb2ludCA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KG9ydGhPcmlnaW4pO1xyXG4gICAgICAgICAgICBsZXQgdW5pdCA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gb3J0aEhlaWdodCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0ZWQgPSBwcm9qZWN0aW9uKHVuaXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IobGV0IHNpZGUgb2Ygc2lkZXMpe1xyXG4gICAgICAgICAgICBzaWRlLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBsZXQgbmV3UGF0aCA9IFBhcGVySGVscGVycy50cmFjZUNvbXBvdW5kUGF0aCh0aGlzLnNvdXJjZVBhdGgsIFxyXG4gICAgICAgICAgICBTdHJldGNoeVBhdGguT1VUTElORV9QT0lOVFMpO1xyXG4gICAgICAgIG5ld1BhdGgudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgbmV3UGF0aC5maWxsQ29sb3IgPSB0aGlzLm9wdGlvbnMucGF0aEZpbGxDb2xvcjtcclxuICAgICAgICB0aGlzLmFycmFuZ2VkUGF0aCA9IG5ld1BhdGg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cGRhdGVCYWNrZ3JvdW5kQ29sb3IoKTtcclxuXHJcbiAgICAgICAgdHJhbnNmb3JtLnRyYW5zZm9ybVBhdGhJdGVtKG5ld1BhdGgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXNwbGF5UGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlQYXRoLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5UGF0aCA9IG5ld1BhdGg7XHJcbiAgICAgICAgdGhpcy5pbnNlcnRDaGlsZCgxLCBuZXdQYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE91dGxpbmVTaWRlcygpOiBwYXBlci5QYXRoW10ge1xyXG4gICAgICAgIGxldCBzaWRlczogcGFwZXIuUGF0aFtdID0gW107XHJcbiAgICAgICAgbGV0IHNlZ21lbnRHcm91cDogcGFwZXIuU2VnbWVudFtdID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNvcm5lclBvaW50cyA9IHRoaXMuY29ybmVycy5tYXAoYyA9PiBjLnBvaW50KTtcclxuICAgICAgICBsZXQgZmlyc3QgPSBjb3JuZXJQb2ludHMuc2hpZnQoKTsgXHJcbiAgICAgICAgY29ybmVyUG9pbnRzLnB1c2goZmlyc3QpO1xyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0Q29ybmVyID0gY29ybmVyUG9pbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgbGV0IHNlZ21lbnRMaXN0ID0gdGhpcy5vdXRsaW5lLnNlZ21lbnRzLm1hcCh4ID0+IHgpO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBzZWdtZW50TGlzdC5wdXNoKHNlZ21lbnRMaXN0WzBdKTtcclxuICAgICAgICBmb3IobGV0IHNlZ21lbnQgb2Ygc2VnbWVudExpc3Qpe1xyXG4gICAgICAgICAgICBzZWdtZW50R3JvdXAucHVzaChzZWdtZW50KTtcclxuICAgICAgICAgICAgaWYodGFyZ2V0Q29ybmVyLmlzQ2xvc2Uoc2VnbWVudC5wb2ludCwgcGFwZXIuTnVtZXJpY2FsLkVQU0lMT04pKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmaW5pc2ggcGF0aFxyXG4gICAgICAgICAgICAgICAgc2lkZXMucHVzaChuZXcgcGFwZXIuUGF0aChzZWdtZW50R3JvdXApKTtcclxuICAgICAgICAgICAgICAgIHNlZ21lbnRHcm91cCA9IFtzZWdtZW50XTtcclxuICAgICAgICAgICAgICAgIHRhcmdldENvcm5lciA9IGNvcm5lclBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoc2lkZXMubGVuZ3RoICE9PSA0KXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignc2lkZXMnLCBzaWRlcyk7XHJcbiAgICAgICAgICAgIHRocm93ICdmYWlsZWQgdG8gZ2V0IHNpZGVzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHNpZGVzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZU91dGxpbmUoKSB7XHJcbiAgICAgICAgbGV0IGJvdW5kcyA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHM7XHJcbiAgICAgICAgbGV0IG91dGxpbmUgPSBuZXcgcGFwZXIuUGF0aChcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLmNvcm5lcnModGhpcy5zb3VyY2VQYXRoLmJvdW5kcykpO1xyXG5cclxuICAgICAgICBvdXRsaW5lLmNsb3NlZCA9IHRydWU7XHJcbiAgICAgICAgb3V0bGluZS5kYXNoQXJyYXkgPSBbNSwgNV07XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lID0gb3V0bGluZTtcclxuXHJcbiAgICAgICAgLy8gdHJhY2sgY29ybmVycyBzbyB3ZSBrbm93IGhvdyB0byBhcnJhbmdlIHRoZSB0ZXh0XHJcbiAgICAgICAgdGhpcy5jb3JuZXJzID0gb3V0bGluZS5zZWdtZW50cy5tYXAocyA9PiBzKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChvdXRsaW5lKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUJhY2tncm91bmRDb2xvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlQmFja2dyb3VuZENvbG9yKCl7XHJcbiAgICAgICAgaWYodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3Ipe1xyXG4gICAgICAgICAgICB0aGlzLm91dGxpbmUuZmlsbENvbG9yID0gdGhpcy5vcHRpb25zLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5vdXRsaW5lLm9wYWNpdHkgPSAuOTsgICAgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vdXRsaW5lLmZpbGxDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgIHRoaXMub3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTZWdtZW50TWFya2VycygpIHtcclxuICAgICAgICBpZih0aGlzLnNlZ21lbnRNYXJrZXJzR3JvdXApe1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnRNYXJrZXJzR3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBib3VuZHMgPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzO1xyXG4gICAgICAgIHRoaXMuc2VnbWVudE1hcmtlcnNHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2YgdGhpcy5vdXRsaW5lLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGUgPSBuZXcgU2VnbWVudEhhbmRsZShzZWdtZW50KTtcclxuICAgICAgICAgICAgaGFuZGxlLm9uRHJhZ1N0YXJ0ID0gKCkgPT4gdGhpcy5zaGFwZUNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBoYW5kbGUub25DaGFuZ2VDb21wbGV0ZSA9ICgpID0+IHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudE1hcmtlcnNHcm91cC5hZGRDaGlsZChoYW5kbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuc2VnbWVudE1hcmtlcnNHcm91cCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgdXBkYXRlTWlkcGlvbnRNYXJrZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMubWlkcG9pbnRHcm91cCl7XHJcbiAgICAgICAgICAgIHRoaXMubWlkcG9pbnRHcm91cC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lLmN1cnZlcy5mb3JFYWNoKGN1cnZlID0+IHtcclxuICAgICAgICAgICAgLy8gc2tpcCBsZWZ0IGFuZCByaWdodCBzaWRlc1xyXG4gICAgICAgICAgICBpZihjdXJ2ZS5zZWdtZW50MSA9PT0gdGhpcy5jb3JuZXJzWzFdXHJcbiAgICAgICAgICAgICAgICB8fCBjdXJ2ZS5zZWdtZW50MSA9PT0gdGhpcy5jb3JuZXJzWzNdKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47ICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGUgPSBuZXcgQ3VydmVTcGxpdHRlckhhbmRsZShjdXJ2ZSk7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbkRyYWdTdGFydCA9ICgpID0+IHRoaXMuc2hhcGVDaGFuZ2VkID0gdHJ1ZTsgXHJcbiAgICAgICAgICAgIGhhbmRsZS5vbkRyYWdFbmQgPSAobmV3U2VnbWVudCwgZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdIYW5kbGUgPSBuZXcgU2VnbWVudEhhbmRsZShuZXdTZWdtZW50KTtcclxuICAgICAgICAgICAgICAgIG5ld0hhbmRsZS5vbkNoYW5nZUNvbXBsZXRlID0gKCkgPT4gdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VnbWVudE1hcmtlcnNHcm91cC5hZGRDaGlsZChuZXdIYW5kbGUpO1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLm1pZHBvaW50R3JvdXApO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgU3RyZXRjaHlQYXRoT3B0aW9ucyB7XHJcbiAgICBwYXRoRmlsbENvbG9yOiBzdHJpbmc7XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcclxufVxyXG4iLCJcclxuY2xhc3MgU3RyZXRjaHlUZXh0IGV4dGVuZHMgU3RyZXRjaHlQYXRoIHtcclxuXHJcbiAgICBmZm9udDogb3BlbnR5cGUuRm9udDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBvcGVudHlwZS5Gb250LCBvcHRpb25zOiBTdHJldGNoeVRleHRPcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIoU3RyZXRjaHlUZXh0LmdldFRleHRQYXRoKGZvbnQsIG9wdGlvbnMpLCBvcHRpb25zKTtcclxuICAgICAgICB0aGlzLmZmb250ID0gZm9udDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKG9wdGlvbnM6IFN0cmV0Y2h5VGV4dE9wdGlvbnMpe1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlUGF0aChTdHJldGNoeVRleHQuZ2V0VGV4dFBhdGgodGhpcy5mZm9udCwgb3B0aW9ucykpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgZ2V0VGV4dFBhdGgoZm9udDogb3BlbnR5cGUuRm9udCwgb3B0aW9uczogU3RyZXRjaHlUZXh0T3B0aW9ucyl7XHJcbiAgICAgICAgbGV0IG9wZW5UeXBlUGF0aCA9IGZvbnQuZ2V0UGF0aChcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMudGV4dCwgXHJcbiAgICAgICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5mb250U2l6ZSB8fCAzMik7XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5pbXBvcnRPcGVuVHlwZVBhdGgob3BlblR5cGVQYXRoKTtcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIFN0cmV0Y2h5VGV4dE9wdGlvbnMgZXh0ZW5kcyBTdHJldGNoeVBhdGhPcHRpb25zIHtcclxuICAgIHRleHQ6IHN0cmluZztcclxuICAgIGZvbnRTaXplOiBudW1iZXI7XHJcbn1cclxuIiwiXHJcbi8qKlxyXG4gKiBNZWFzdXJlcyBvZmZzZXRzIG9mIHRleHQgZ2x5cGhzLlxyXG4gKi9cclxuY2xhc3MgVGV4dFJ1bGVyIHtcclxuICAgIFxyXG4gICAgZm9udEZhbWlseTogc3RyaW5nO1xyXG4gICAgZm9udFdlaWdodDogbnVtYmVyO1xyXG4gICAgZm9udFNpemU6IG51bWJlcjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQb2ludFRleHQgKHRleHQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICB2YXIgcG9pbnRUZXh0ID0gbmV3IHBhcGVyLlBvaW50VGV4dCgpO1xyXG4gICAgICAgIHBvaW50VGV4dC5jb250ZW50ID0gdGV4dDtcclxuICAgICAgICBwb2ludFRleHQuanVzdGlmaWNhdGlvbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgaWYodGhpcy5mb250RmFtaWx5KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRGYW1pbHkgPSB0aGlzLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFdlaWdodCl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250V2VpZ2h0ID0gdGhpcy5mb250V2VpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmZvbnRTaXplKXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHBvaW50VGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUZXh0T2Zmc2V0cyh0ZXh0KXtcclxuICAgICAgICAvLyBNZWFzdXJlIGdseXBocyBpbiBwYWlycyB0byBjYXB0dXJlIHdoaXRlIHNwYWNlLlxyXG4gICAgICAgIC8vIFBhaXJzIGFyZSBjaGFyYWN0ZXJzIGkgYW5kIGkrMS5cclxuICAgICAgICB2YXIgZ2x5cGhQYWlycyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBnbHlwaFBhaXJzW2ldID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSwgaSsxKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZvciBlYWNoIGNoYXJhY3RlciwgZmluZCBjZW50ZXIgb2Zmc2V0LlxyXG4gICAgICAgIHZhciB4T2Zmc2V0cyA9IFswXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIE1lYXN1cmUgdGhyZWUgY2hhcmFjdGVycyBhdCBhIHRpbWUgdG8gZ2V0IHRoZSBhcHByb3ByaWF0ZSBcclxuICAgICAgICAgICAgLy8gICBzcGFjZSBiZWZvcmUgYW5kIGFmdGVyIHRoZSBnbHlwaC5cclxuICAgICAgICAgICAgdmFyIHRyaWFkVGV4dCA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGkgLSAxLCBpICsgMSkpO1xyXG4gICAgICAgICAgICB0cmlhZFRleHQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCBvdXQgaGFsZiBvZiBwcmlvciBnbHlwaCBwYWlyIFxyXG4gICAgICAgICAgICAvLyAgIGFuZCBoYWxmIG9mIGN1cnJlbnQgZ2x5cGggcGFpci5cclxuICAgICAgICAgICAgLy8gTXVzdCBiZSByaWdodCwgYmVjYXVzZSBpdCB3b3Jrcy5cclxuICAgICAgICAgICAgbGV0IG9mZnNldFdpZHRoID0gdHJpYWRUZXh0LmJvdW5kcy53aWR0aCBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpIC0gMV0uYm91bmRzLndpZHRoIC8gMiBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpXS5ib3VuZHMud2lkdGggLyAyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQWRkIG9mZnNldCB3aWR0aCB0byBwcmlvciBvZmZzZXQuIFxyXG4gICAgICAgICAgICB4T2Zmc2V0c1tpXSA9IHhPZmZzZXRzW2kgLSAxXSArIG9mZnNldFdpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGdseXBoUGFpciBvZiBnbHlwaFBhaXJzKXtcclxuICAgICAgICAgICAgZ2x5cGhQYWlyLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4geE9mZnNldHM7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFZpZXdab29tIHtcclxuXHJcbiAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgZmFjdG9yID0gMS4yNTtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfbWluWm9vbTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbWF4Wm9vbTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb2plY3Q6IHBhcGVyLlByb2plY3QpIHtcclxuICAgICAgICB0aGlzLnByb2plY3QgPSBwcm9qZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcblxyXG4gICAgICAgICg8YW55PiQodmlldy5lbGVtZW50KSkubW91c2V3aGVlbCgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IG1vdXNlUG9zaXRpb24gPSBuZXcgcGFwZXIuUG9pbnQoZXZlbnQub2Zmc2V0WCwgZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlWm9vbUNlbnRlcmVkKGV2ZW50LmRlbHRhWSwgbW91c2VQb3NpdGlvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHpvb20oKTogbnVtYmVye1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2plY3Qudmlldy56b29tO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB6b29tUmFuZ2UoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgem9vbSBsZXZlbC5cclxuICAgICAqIEByZXR1cm5zIHpvb20gbGV2ZWwgdGhhdCB3YXMgc2V0LCBvciBudWxsIGlmIGl0IHdhcyBub3QgY2hhbmdlZFxyXG4gICAgICovXHJcbiAgICBzZXRab29tQ29uc3RyYWluZWQoem9vbTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICBpZih0aGlzLl9taW5ab29tKSB7XHJcbiAgICAgICAgICAgIHpvb20gPSBNYXRoLm1heCh6b29tLCB0aGlzLl9taW5ab29tKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fbWF4Wm9vbSl7XHJcbiAgICAgICAgICAgIHpvb20gPSBNYXRoLm1pbih6b29tLCB0aGlzLl9tYXhab29tKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICBpZih6b29tICE9IHZpZXcuem9vbSl7XHJcbiAgICAgICAgICAgIHZpZXcuem9vbSA9IHpvb207XHJcbiAgICAgICAgICAgIHJldHVybiB6b29tO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRab29tUmFuZ2UocmFuZ2U6IHBhcGVyLlNpemVbXSk6IG51bWJlcltdIHtcclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGxldCBhU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgbGV0IGJTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICBsZXQgYSA9IGFTaXplICYmIE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYVNpemUuaGVpZ2h0LCAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGFTaXplLndpZHRoKTtcclxuICAgICAgICBsZXQgYiA9IGJTaXplICYmIE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYlNpemUuaGVpZ2h0LCAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGJTaXplLndpZHRoKTtcclxuICAgICAgICBsZXQgbWluID0gTWF0aC5taW4oYSxiKTtcclxuICAgICAgICBpZihtaW4pe1xyXG4gICAgICAgICAgICB0aGlzLl9taW5ab29tID0gbWluO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbWF4ID0gTWF0aC5tYXgoYSxiKTtcclxuICAgICAgICBpZihtYXgpe1xyXG4gICAgICAgICAgICB0aGlzLl9tYXhab29tID0gbWF4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVpvb21DZW50ZXJlZChkZWx0YVk6IG51bWJlciwgbW91c2VQb3M6IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgaWYgKCFkZWx0YVkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGxldCBvbGRab29tID0gdmlldy56b29tO1xyXG4gICAgICAgIGxldCBvbGRDZW50ZXIgPSB2aWV3LmNlbnRlcjtcclxuICAgICAgICBsZXQgdmlld1BvcyA9IHZpZXcudmlld1RvUHJvamVjdChtb3VzZVBvcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG5ld1pvb20gPSBkZWx0YVkgPiAwXHJcbiAgICAgICAgICAgID8gdmlldy56b29tICogdGhpcy5mYWN0b3JcclxuICAgICAgICAgICAgOiB2aWV3Lnpvb20gLyB0aGlzLmZhY3RvcjtcclxuICAgICAgICBuZXdab29tID0gdGhpcy5zZXRab29tQ29uc3RyYWluZWQobmV3Wm9vbSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIW5ld1pvb20pe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgem9vbVNjYWxlID0gb2xkWm9vbSAvIG5ld1pvb207XHJcbiAgICAgICAgbGV0IGNlbnRlckFkanVzdCA9IHZpZXdQb3Muc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gdmlld1Bvcy5zdWJ0cmFjdChjZW50ZXJBZGp1c3QubXVsdGlwbHkoem9vbVNjYWxlKSlcclxuICAgICAgICAgICAgLnN1YnRyYWN0KG9sZENlbnRlcik7XHJcblxyXG4gICAgICAgIHZpZXcuY2VudGVyID0gdmlldy5jZW50ZXIuYWRkKG9mZnNldCk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB6b29tVG8ocmVjdDogcGFwZXIuUmVjdGFuZ2xlKXtcclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIHZpZXcuY2VudGVyID0gcmVjdC5jZW50ZXI7XHJcbiAgICAgICAgdmlldy56b29tID0gTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyByZWN0LmhlaWdodCwgICAgICAgICBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMud2lkdGggLyByZWN0LndpZHRoKSAqIDAuOTU7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFdvcmtzcGFjZSBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuICAgIFxyXG4gICAgc2hlZXQ6IHBhcGVyLlNoYXBlO1xyXG4gICAgXHJcbiAgICBnZXQgYmFja2dyb3VuZENvbG9yKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hlZXQub3BhY2l0eSA9PSAwXHJcbiAgICAgICAgICAgID8gbnVsbFxyXG4gICAgICAgICAgICA6IHRoaXMuc2hlZXQuZmlsbENvbG9yLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldCBiYWNrZ3JvdW5kQ29sb3IodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmKHZhbHVlKXtcclxuICAgICAgICAgICAgdGhpcy5zaGVldC5maWxsQ29sb3IgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5zaGVldC5vcGFjaXR5ID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHByZXNlcnZlIGhpdCB0ZXN0aW5nXHJcbiAgICAgICAgICAgIHRoaXMuc2hlZXQuZmlsbENvbG9yID0gJ3doaXRlJztcclxuICAgICAgICAgICAgdGhpcy5zaGVldC5vcGFjaXR5ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHNpemU6IHBhcGVyLlNpemUpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNoZWV0ID0gcGFwZXIuU2hhcGUuUmVjdGFuZ2xlKFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMCwwKSwgc2l6ZSk7XHJcbiAgICAgICAgc2hlZXQuc3R5bGUuc2hhZG93Q29sb3IgPSAnZ3JheSc7IFxyXG4gICAgICAgIHNoZWV0LnN0eWxlLnNoYWRvd0JsdXIgPSA2O1xyXG4gICAgICAgIHNoZWV0LnN0eWxlLnNoYWRvd09mZnNldCA9IG5ldyBwYXBlci5Qb2ludCg1LCA1KVxyXG4gICAgICAgIHRoaXMuc2hlZXQgPSBzaGVldDtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKHNoZWV0KTtcclxuXHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IDxNb3VzZUJlaGF2aW9yPiB7XHJcbiAgICAgICAgICAgIG9uQ2xpY2s6IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGFwZXIucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBlID0+IHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZChlLmRlbHRhKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBXb3Jrc3BhY2VDb250cm9sbGVyIHtcclxuXHJcbiAgICBkZWZhdWx0U2l6ZSA9IG5ldyBwYXBlci5TaXplKDQwMDAsIDMwMDApO1xyXG5cclxuICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICB3b3Jrc3BhY2U6IFdvcmtzcGFjZTtcclxuICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcbiAgICBmb250OiBvcGVudHlwZS5Gb250O1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9za2V0Y2g6IFNrZXRjaDtcclxuICAgIHByaXZhdGUgX3RleHRCbG9ja0l0ZW1zOiB7IFt0ZXh0QmxvY2tJZDogc3RyaW5nXSA6IFN0cmV0Y2h5VGV4dDsgfSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGV2ZW50JDogSUV2ZW50U3RyZWFtLCBmb250OiBvcGVudHlwZS5Gb250KSB7XHJcbiAgICAgICAgdGhpcy5mb250ID0gZm9udDsgICAgICBcclxuICAgICAgICBwYXBlci5zZXR0aW5ncy5oYW5kbGVTaXplID0gMTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5DYW52YXMnKTtcclxuICAgICAgICBwYXBlci5zZXR1cCh0aGlzLmNhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcGFwZXIucHJvamVjdDtcclxuXHJcbiAgICAgICAgbmV3IE1vdXNlQmVoYXZpb3JUb29sKHRoaXMucHJvamVjdCk7XHJcblxyXG4gICAgICAgIGxldCBtb3VzZVpvb20gPSBuZXcgVmlld1pvb20odGhpcy5wcm9qZWN0KTtcclxuICAgICAgICB0aGlzLndvcmtzcGFjZSA9IG5ldyBXb3Jrc3BhY2UodGhpcy5kZWZhdWx0U2l6ZSk7XHJcbiAgICAgICAgbGV0IHNoZWV0Qm91bmRzID0gdGhpcy53b3Jrc3BhY2Uuc2hlZXQuYm91bmRzO1xyXG4gICAgICAgIG1vdXNlWm9vbS5zZXRab29tUmFuZ2UoXHJcbiAgICAgICAgICAgIFtzaGVldEJvdW5kcy5zY2FsZSgwLjAyKS5zaXplLCBzaGVldEJvdW5kcy5zY2FsZSgxLjEpLnNpemVdKTtcclxuICAgICAgICBtb3VzZVpvb20uem9vbVRvKHNoZWV0Qm91bmRzLnNjYWxlKDAuNSkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGV2ZW50JC5vZlR5cGUoXCJza2V0Y2gubG9hZGVkXCIpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZXYgPT4gdGhpcy5fc2tldGNoID0gPFNrZXRjaD5ldi5ldmVudERhdGEgXHJcbiAgICAgICAgKTtcclxuICAgICAgICBcclxuICAgICAgICBldmVudCQub2ZUeXBlKFwic2tldGNoLmNoYW5nZWRcIikuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICBldiA9PiB0aGlzLndvcmtzcGFjZS5iYWNrZ3JvdW5kQ29sb3IgPSAoPFNrZXRjaD5ldi5ldmVudERhdGEpLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZXZlbnQkLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKCdib29nZXInLCB4KSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZXZlbnQkLm9mVHlwZShcInRleHRibG9jay5hZGRlZFwiLCBcInRleHRibG9jay5jaGFuZ2VkXCIpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZXYgPT4gdGhpcy50ZXh0QmxvY2tSZWNlaXZlZCg8VGV4dEJsb2NrPmV2LmV2ZW50RGF0YSkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGV2ZW50cy50ZXh0QmxvY2tDaGFuZ2VkJFxyXG4gICAgICAgIC8vICAgICAuc3Vic2NyaWJlKHRiID0+IHRoaXMudGJOZXh0KHRiKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gUm9vdFN0YXRlLmFjdGlvbnMuc2tldGNoQXR0clVwZGF0ZSh7XHJcbiAgICAgICAgLy8gICAgIGJhY2tncm91bmRDb2xvcjogJyNGMkYxRTEnXHJcbiAgICAgICAgLy8gfSlcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGV4dEJsb2NrUmVjZWl2ZWQodGV4dEJsb2NrOiBUZXh0QmxvY2spe1xyXG5jb25zb2xlLmxvZygndGV4dEJsb2NrUmVjZWl2ZWQnLCB0ZXh0QmxvY2spO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCF0ZXh0QmxvY2sudGV4dC5sZW5ndGgpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCF0ZXh0QmxvY2suX2lkKXtcclxuICAgICAgICAgICAgdGV4dEJsb2NrLl9pZCA9IG5ld2lkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBvcHRpb25zID0gPFN0cmV0Y2h5VGV4dE9wdGlvbnM+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHRleHRCbG9jay50ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMjgsXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aEZpbGxDb2xvcjogdGV4dEJsb2NrLnRleHRDb2xvciB8fCAnYmxhY2snLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW3RleHRCbG9jay5faWRdO1xyXG4gICAgICAgIGlmKCFpdGVtKSB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSBuZXcgU3RyZXRjaHlUZXh0KHRoaXMuZm9udCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGl0ZW0uZGF0YSA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgIHRoaXMud29ya3NwYWNlLmFkZENoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLnBvaW50LmFkZChcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChpdGVtLmJvdW5kcy53aWR0aCAvIDIsIGl0ZW0uYm91bmRzLmhlaWdodCAvIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZCg1MCkpO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtc1t0ZXh0QmxvY2suX2lkXSA9IGl0ZW07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaXRlbS51cGRhdGUob3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8gbmFtZXNwYWNlIFRvZG9FeHBlcmltZW50IHtcclxuXHJcbi8vICAgICBpbnRlcmZhY2UgVG9kbyB7XHJcbi8vICAgICAgICAgaWQ6IG51bWJlcjtcclxuLy8gICAgICAgICB0ZXh0OiBzdHJpbmc7XHJcbi8vICAgICAgICAgY29tcGxldGU/OiBib29sZWFuO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIGNsYXNzIFRvZG9MaXN0IHtcclxuLy8gICAgICAgICB0b2RvczogVG9kb1tdID0gW107XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgdHlwZSBUb2Rvc0FjdGlvbiA9IEFjaWRSZWZsdXguQWN0aW9uPFRvZG9MaXN0PjtcclxuXHJcbi8vICAgICBmdW5jdGlvbiBjb21wbGV0ZVRvZG8odG9kb0lkOiBudW1iZXIpOiBUb2Rvc0FjdGlvbiB7XHJcbi8vICAgICAgICAgcmV0dXJuIChyb290OiBUb2RvTGlzdCkgPT4ge1xyXG4vLyAgICAgICAgICAgICBsZXQgdG9kbyA9IF8uZmluZChyb290LnRvZG9zLCB0ID0+IHQuaWQgPT0gdG9kb0lkKTtcclxuLy8gICAgICAgICAgICAgdG9kby5jb21wbGV0ZSA9IHRydWU7XHJcbi8vICAgICAgICAgfTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBmdW5jdGlvbiBidWlsZFZpZXcoc3RhdGU6IFRvZG9MaXN0LCBkaXNwYXRjaDogQWNpZFJlZmx1eC5EaXNwYXRjaDxUb2RvTGlzdD4pOiBWTm9kZSB7XHJcbi8vICAgICAgICAgcmV0dXJuIGgoJ2RpdicsXHJcbi8vICAgICAgICAgICAgIHN0YXRlLnRvZG9zLm1hcCh0ID0+XHJcbi8vICAgICAgICAgICAgICAgICBoKCdidXR0b24nLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGljayc6ICgpID0+IGRpc3BhdGNoKGNvbXBsZXRlVG9kbyh0LmlkKSlcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAgW3QudGV4dCArICh0LmNvbXBsZXRlID8gXCIgW3hdXCIgOiBcIiBbIF1cIildXHJcbi8vICAgICAgICAgICAgICAgICApXHJcbi8vICAgICAgICAgICAgIClcclxuLy8gICAgICAgICApO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIGV4cG9ydCBmdW5jdGlvbiBydW4oZWxlbWVudElkOiBzdHJpbmcpIHtcclxuLy8gICAgICAgICB2YXIgbGlzdCA9IG5ldyBUb2RvTGlzdCgpO1xyXG4vLyAgICAgICAgIGxpc3QudG9kb3MucHVzaCh7IGlkOiAxLCB0ZXh0OiBcImJ1aWxkIHJvY2tldCBzbGVkXCIgfSk7XHJcbi8vICAgICAgICAgbGlzdC50b2Rvcy5wdXNoKHsgaWQ6IDIsIHRleHQ6IFwiZWF0IGEgc2FuZHdpY2hcIiB9KTtcclxuXHJcbi8vICAgICAgICAgQWNpZFJlZmx1eC5ydW4oZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKSwgYnVpbGRWaWV3LCBsaXN0KVxyXG4vLyAgICAgICAgICAgICAuc3Vic2NyaWJlKGRvbSA9PiBjb25zb2xlLmxvZygncmVuZGVyZWQnLCBkb20pKTtcclxuLy8gICAgIH1cclxuXHJcbi8vIH1cclxuXHJcbi8vIC8vIFRvZG9FeHBlcmltZW50LnJ1bignZGVzaWduZXInKTsiLCJcclxudHlwZSBJQWN0aW9uU3RyZWFtID0gVFJ1eC5JQWN0aW9uT2JzZXJ2YWJsZTxBY3Rpb25UeXBlcz47XHJcbnR5cGUgSUV2ZW50U3RyZWFtID0gVFJ1eC5JRXZlbnRPYnNlcnZhYmxlPEV2ZW50VHlwZXM+O1xyXG5cclxuY29uc3QgYWN0aW9uJCA9IFRSdXgubmV3QWN0aW9uU3ViamVjdDxBY3Rpb25UeXBlcz4oKTtcclxuICAgICAgICAgICAgYWN0aW9uJC5zdWJzY3JpYmUoYSA9PiBjb25zb2xlLmxvZygnYWN0aW9uJCcsIGEpKTtcclxuY29uc3QgZGlzcGF0Y2ggPSBhY3Rpb24kLm9uTmV4dDtcclxuXHJcbmNvbnN0IGV2ZW50JCA9IFRSdXgubmV3RXZlbnRTdWJqZWN0PEV2ZW50VHlwZXM+KCk7XHJcbiAgICAgICAgICAgIGV2ZW50JC5zdWJzY3JpYmUoYSA9PiBjb25zb2xlLmxvZygnZXZlbnQkJywgYSkpO1xyXG5cclxuY29uc3Qgcm9vdFN0b3JlID0gbmV3IFJvb3RTdG9yZShhY3Rpb24kLCBldmVudCQpO1xyXG5cclxuY29uc3Qgc2tldGNoU3RhdGUkID0gZXZlbnQkLm9mVHlwZShcInNrZXRjaC5sb2FkZWRcIiwgXCJza2V0Y2guY2hhbmdlZFwiLCBcInRleHRibG9jay5hZGRlZFwiLCBcInRleHRibG9jay5jaGFuZ2VkXCIpO1xyXG5jb25zdCBkb20kID0gc2tldGNoU3RhdGUkLm1hcChldiA9PiBSZW5kZXJTa2V0Y2hFZGl0b3IoZXYucm9vdERhdGEgYXMgU2tldGNoKSk7XHJcbiAgICAgICAgICAgIGRvbSQuc3Vic2NyaWJlKGEgPT4gY29uc29sZS5sb2coJ2RvbSQnLCBhKSk7XHJcblxyXG5SZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oZG9tJCwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2lnbmVyJykpO1xyXG5jb25zdCBkZXNpZ25lckNvbnRyb2xsZXIgPSBuZXcgRGVzaWduZXJDb250cm9sbGVyKGV2ZW50JCwgKCkgPT4ge1xyXG4gICAgYWN0aW9uJC5vbk5leHQoe1xyXG4gICAgICAgIHR5cGU6IFwic2tldGNoLmNyZWF0ZVwiXHJcbiAgICB9KTtcclxuXHJcbiAgICBhY3Rpb24kLm9uTmV4dCh7XHJcbiAgICAgICAgdHlwZTogXCJ0ZXh0YmxvY2suYWRkXCIsXHJcbiAgICAgICAgcGF5bG9hZDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcImJsYWFyZ2hcIlxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTtcclxuXHJcblxyXG5cclxuIFxyXG4iXX0=