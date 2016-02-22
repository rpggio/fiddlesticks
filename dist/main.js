var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var TypedChannel;
(function (TypedChannel) {
    var ChannelTopic = (function () {
        function ChannelTopic(channel, type) {
            this.channel = channel;
            this.type = type;
        }
        ChannelTopic.prototype.subscribe = function (observer) {
            this.observe().subscribe(observer);
        };
        ChannelTopic.prototype.dispatch = function (data) {
            this.channel.onNext({
                type: this.type,
                data: data
            });
        };
        ChannelTopic.prototype.dispatchContext = function (context, data) {
            this.channel.onNext({
                type: this.type,
                rootData: context,
                data: data
            });
        };
        ChannelTopic.prototype.observe = function () {
            var _this = this;
            return this.channel.filter(function (m) { return m.type === _this.type; });
        };
        return ChannelTopic;
    }());
    TypedChannel.ChannelTopic = ChannelTopic;
    var Channel = (function () {
        function Channel(subject, type) {
            this.subject = subject || new Rx.Subject();
            this.type = type;
        }
        Channel.prototype.subscribe = function (onNext) {
            return this.subject.subscribe(onNext);
        };
        Channel.prototype.topic = function (type) {
            return new ChannelTopic(this.subject, this.type ? this.type + '.' + type : type);
        };
        Channel.prototype.mergeTyped = function () {
            var topics = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                topics[_i - 0] = arguments[_i];
            }
            var types = topics.map(function (t) { return t.type; });
            return this.subject.filter(function (m) { return types.indexOf(m.type) >= 0; });
        };
        Channel.prototype.merge = function () {
            var topics = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                topics[_i - 0] = arguments[_i];
            }
            var types = topics.map(function (t) { return t.type; });
            return this.subject.filter(function (m) { return types.indexOf(m.type) >= 0; });
        };
        return Channel;
    }());
    TypedChannel.Channel = Channel;
})(TypedChannel || (TypedChannel = {}));
// class OldTopic<T> {
//     private _channel: IChannelDefinition<Object>;
//     private _name: string;
//     constructor(channel: IChannelDefinition<Object>, topic: string) {
//         this._channel = channel;
//         this._name = topic;
//     }
//     observe(): Rx.Observable<T> {
//         return <Rx.Observable<T>>this._channel.observe(this._name);
//     }
//     publish(data: T) {
//         this._channel.publish(this._name, data);
//     }
//     subscribe(callback: ICallback<T>): ISubscriptionDefinition<T> {
//         return this._channel.subscribe(this._name, callback);
//     }
//     protected subtopic(name): ChannelTopic<T> {
//         return new ChannelTopic<T>(this._channel, this._name + '.' + name);
//     }
//     protected subtopicOf<U extends T>(name): ChannelTopic<U> {
//         return new ChannelTopic<U>(this._channel, this._name + '.' + name);
//     }
// }
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
var Component = (function () {
    function Component() {
    }
    return Component;
}());
var ReactiveDom = (function () {
    function ReactiveDom() {
    }
    /**
     * Render a reactive component within container.
     */
    ReactiveDom.renderStream = function (dom$, container) {
        var id = container.id;
        var current = container;
        var sink = new Rx.Subject();
        dom$.subscribe(function (dom) {
            if (!dom)
                return;
            console.log('rendering dom', dom); /////////////////////
            // retain ID
            var patched = patch(current, dom);
            if (id && !patched.elm.id) {
                patched.elm.id = id;
            }
            current = patched;
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
            if (!dom)
                return;
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
            if (!node)
                return;
            current = patch(current, node);
            sink.onNext(current);
        });
        return sink;
    };
    return ReactiveDom;
}());
var AppState = (function () {
    function AppState() {
    }
    return AppState;
}());
var Actions = (function (_super) {
    __extends(Actions, _super);
    function Actions() {
        _super.apply(this, arguments);
        this.sketch = {
            create: this.topic("sketch.create"),
            attrUpdate: this.topic("sketch.attrupdate"),
            setEditingItem: this.topic("sketch.seteditingitem")
        };
        this.textBlock = {
            add: this.topic("textblock.add"),
            update: this.topic("textblock.update")
        };
    }
    return Actions;
}(TypedChannel.Channel));
var Events = (function (_super) {
    __extends(Events, _super);
    function Events() {
        _super.apply(this, arguments);
        this.sketch = {
            loaded: this.topic("sketch.loaded"),
            attrchanged: this.topic("sketch.attrchanged"),
            editingItemChanged: this.topic("sketch.editingitemchanged")
        };
        this.textblock = {
            added: this.topic("textblock.added"),
            changed: this.topic("textblock.changed"),
        };
    }
    return Events;
}(TypedChannel.Channel));
var Channels = (function () {
    function Channels() {
        this.actions = new Actions();
        this.events = new Events();
    }
    return Channels;
}());
var Store = (function () {
    function Store(actions, events) {
        var _this = this;
        this.state = new AppState();
        this.actions = actions;
        this.events = events;
        actions.sketch.create
            .subscribe(function () {
            _this.state.sketch = new Sketch();
            _this.events.sketch.loaded.dispatchContext(_this.state, _this.state.sketch);
        });
        actions.sketch.attrUpdate
            .subscribe(function (ev) {
            _this.assign(_this.state.sketch.attr, ev.data);
            _this.events.sketch.attrchanged.dispatchContext(_this.state, _this.state.sketch.attr);
        });
        actions.textBlock.add
            .subscribe(function (ev) {
            var patch = ev.data;
            var block = { _id: newid() };
            _this.assign(block, patch);
            _this.state.sketch.textBlocks.push(block);
            _this.events.textblock.added.dispatchContext(_this.state, block);
        });
        actions.textBlock.update
            .subscribe(function (ev) {
            var patch = ev.data;
            var block = _this.state.sketch.getBlock(ev.data._id);
            if (block) {
                _this.assign(block, patch);
                _this.events.textblock.changed.dispatchContext(_this.state, block);
            }
        });
        actions.sketch.setEditingItem.subscribe(function (m) {
            if (m.data.itemType !== "TextBlock") {
                throw "Unhandled type " + m.type;
            }
            var item = _this.state.sketch.getBlock(m.data.itemId);
            _this.state.sketch.editingItem = {
                itemId: m.data.itemId,
                itemType: "TextBlock",
                item: item,
                clientX: m.data.clientX,
                clientY: m.data.clientY
            };
            events.sketch.editingItemChanged.dispatch(_this.state.sketch.editingItem);
        });
    }
    Store.prototype.assign = function (dest, source) {
        _.assign(dest, source);
    };
    return Store;
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
    ColorPicker.destroy = function (elem) {
        $(elem).spectrum("destroy");
    };
    return ColorPicker;
}());
var AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
var Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
var Roboto500 = 'fonts/Roboto-500.ttf';
var AquafinaScript = 'fonts/AguafinaScript-Regular/AguafinaScript-Regular.ttf';
var DesignerController = (function () {
    function DesignerController(channels, onFontLoaded) {
        var _this = this;
        this.fonts = [];
        this.loadFont(Roboto500, function (font) {
            _this.workspaceController = new WorkspaceController(channels, font);
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
var SelectedItemEditor = (function () {
    function SelectedItemEditor(container, channels) {
        this.channels = channels;
        var dom$ = channels.events.sketch.editingItemChanged.observe().map(function (i) {
            if (!i.data || !i.data.itemId) {
                return h('div#editorOverlay', {
                    style: {
                        display: "none"
                    }
                });
            }
            if (i.data.itemType !== 'TextBlock') {
                return;
            }
            var block = i.data.item;
            return h('div#editorOverlay', {
                style: {
                    left: i.data.clientX + "px",
                    top: i.data.clientY + "px",
                    "z-index": 1
                }
            }, [
                new TextBlockEditor(channels.actions).render(block)
            ]);
        });
        ReactiveDom.renderStream(dom$, container);
    }
    return SelectedItemEditor;
}());
var SketchEditor = (function (_super) {
    __extends(SketchEditor, _super);
    function SketchEditor(actions) {
        _super.call(this);
        this.actions = actions;
    }
    SketchEditor.prototype.render = function (sketch) {
        var _this = this;
        return h("div", [
            "Add text: ",
            h("input.add-text", {
                on: {
                    keypress: function (ev) {
                        if (ev.which === 13 || ev.keyCode === 13) {
                            var text = ev.target && ev.target.value;
                            if (text.length) {
                                _this.actions.textBlock.add.dispatch({ text: text });
                                ev.target.value = '';
                            }
                        }
                    }
                },
                attrs: {
                    type: "text",
                },
                props: {
                    placeholder: "Press [Enter] to add"
                },
                style: {}
            }),
            "Background: ",
            h("input.background-color", {
                props: {
                    type: "text",
                    value: sketch.attr.backgroundColor
                },
                hook: {
                    insert: function (vnode) {
                        return ColorPicker.setup(vnode.elm, function (color) {
                            _this.actions.sketch.attrUpdate.dispatch({ backgroundColor: color && color.toHexString() });
                        });
                    },
                    destroy: function (vnode) { return ColorPicker.destroy(vnode.elm); }
                }
            }),
        ]);
    };
    return SketchEditor;
}(Component));
var TextBlockEditor = (function (_super) {
    __extends(TextBlockEditor, _super);
    function TextBlockEditor(actions) {
        _super.call(this);
        this.actions = actions;
    }
    TextBlockEditor.prototype.render = function (textBlock) {
        var _this = this;
        var update = function (tb) {
            tb._id = textBlock._id;
            _this.actions.textBlock.update.dispatch(tb);
        };
        return h('div.text-block-editor', {}, [
            h('textarea', {
                attrs: {},
                props: {
                    value: textBlock.text
                },
                on: {
                    keyup: function (e) { return update({ text: e.target.value }); },
                    change: function (e) { return update({ text: e.target.value }); }
                }
            }),
            h('input.text-color', {
                attrs: {
                    type: "text"
                },
                props: {
                    value: textBlock.textColor
                },
                hook: {
                    insert: function (vnode) {
                        return ColorPicker.setup(vnode.elm, function (color) { return update({ textColor: color && color.toHexString() }); });
                    },
                    destroy: function (vnode) { return ColorPicker.destroy(vnode.elm); }
                }
            }),
            h('input.background-color', {
                attrs: {
                    type: "text"
                },
                props: {
                    value: textBlock.backgroundColor
                },
                hook: {
                    insert: function (vnode) {
                        return ColorPicker.setup(vnode.elm, function (color) { return update({ backgroundColor: color && color.toHexString() }); });
                    },
                    destroy: function (vnode) { return ColorPicker.destroy(vnode.elm); }
                }
            }),
        ]);
    };
    return TextBlockEditor;
}(Component));
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
        this.attr = {
            backgroundColor: '#f6f1e3'
        };
        this.textBlocks = [];
    }
    Sketch.prototype.getBlock = function (id) {
        return _.find(this.textBlocks, function (t) { return t._id === id; });
    };
    return Sketch;
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
        this.opacity = 0.3;
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
            if (_this.onToolMouseDown) {
                _this.onToolMouseDown(event);
            }
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
        this.onDoubleClick = function (event) {
        };
        this.onKeyDown = function (event) {
        };
        this.onKeyUp = function (event) {
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
    /**
     * the midpoint between two points
     */
    PaperHelpers.midpoint = function (a, b) {
        return b.subtract(a).divide(2).add(a);
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
        this.defaultBackgroundColor = '#fdfdfd';
        var sheet = paper.Shape.Rectangle(new paper.Point(0, 0), size);
        sheet.style.shadowColor = 'gray';
        sheet.style.shadowBlur = 6;
        sheet.style.shadowOffset = new paper.Point(5, 5);
        this.sheet = sheet;
        this.addChild(sheet);
        this.backgroundColor = this.defaultBackgroundColor;
        this.mouseBehavior = {
            onClick: function (e) {
                paper.project.deselectAll();
            },
            onDragMove: function (e) { return _this.position = _this.position.add(e.delta); }
        };
    }
    Object.defineProperty(Workspace.prototype, "backgroundColor", {
        get: function () {
            return this.sheet.fillColor.toString();
        },
        set: function (value) {
            this.sheet.fillColor = value || this.defaultBackgroundColor;
        },
        enumerable: true,
        configurable: true
    });
    return Workspace;
}(paper.Group));
var WorkspaceController = (function () {
    function WorkspaceController(channels, font) {
        var _this = this;
        this.defaultSize = new paper.Size(4000, 3000);
        this._textBlockItems = {};
        this.channels = channels;
        this.font = font;
        paper.settings.handleSize = 1;
        this.canvas = document.getElementById('mainCanvas');
        paper.setup(this.canvas);
        this.project = paper.project;
        var mouseTool = new MouseBehaviorTool(this.project);
        mouseTool.onToolMouseDown = function (ev) {
            _this.channels.events.sketch.editingItemChanged.dispatch({});
        };
        var mouseZoom = new ViewZoom(this.project);
        this.workspace = new Workspace(this.defaultSize);
        var sheetBounds = this.workspace.sheet.bounds;
        mouseZoom.setZoomRange([sheetBounds.scale(0.02).size, sheetBounds.scale(1.1).size]);
        mouseZoom.zoomTo(sheetBounds.scale(0.5));
        channels.events.sketch.loaded.subscribe(function (ev) {
            _this._sketch = ev.data;
            _this.workspace.backgroundColor = ev.data.attr.backgroundColor;
        });
        channels.events.sketch.attrchanged.subscribe(function (ev) { return _this.workspace.backgroundColor = ev.data.backgroundColor; });
        channels.events.mergeTyped(channels.events.textblock.added, channels.events.textblock.changed).subscribe(function (ev) { return _this.textBlockReceived(ev.data); });
    }
    WorkspaceController.prototype.textBlockReceived = function (textBlock) {
        var _this = this;
        if (!textBlock || !textBlock.text || !textBlock.text.length) {
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
            item.onDoubleClick = function (ev) {
                var editorAt = _this.project.view.projectToView(PaperHelpers.midpoint(item.bounds.topLeft, item.bounds.center));
                _this.channels.actions.sketch.setEditingItem.dispatch({
                    itemId: textBlock._id,
                    itemType: "TextBlock",
                    clientX: editorAt.x,
                    clientY: editorAt.y
                });
            };
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
function bootstrap() {
    var channels = new Channels();
    var actions = channels.actions, events = channels.events;
    actions.subscribe(function (x) { return console.log('action', x); });
    events.subscribe(function (x) { return console.log('event', x); });
    var rootStore = new Store(actions, events);
    var sketchEditor = new SketchEditor(actions);
    var sketchDom$ = events.merge(events.sketch.loaded, events.sketch.attrchanged)
        .map(function (m) { return sketchEditor.render(m.rootData.sketch); });
    ReactiveDom.renderStream(sketchDom$, document.getElementById('designer'));
    // const blockEditor = new TextBlockEditor(actions);
    // const blockEditorDom$ = events.sketch.editingItemChanged
    //     .observe().map(tb => blockEditor.render(tb));
    // ReactiveDom.renderStream(blockEditorDom$, document.getElementById('textBlockEditor'));
    var selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), channels);
    var designerController = new DesignerController(channels, function () {
        actions.sketch.create.dispatch(null);
        actions.textBlock.add.dispatch({ text: "boogedy" });
    });
}
bootstrap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9leHBlcmltZW50LnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL0ZvbnRMb2FkZXIudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvSGVscGVycy50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay9UeXBlZENoYW5uZWwudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvcG9zdGFsL1RvcGljLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL3Bvc3RhbC9wb3N0YWwtb2JzZXJ2ZS50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay92ZG9tL0NvbXBvbmVudC50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay92ZG9tL1JlYWN0aXZlRG9tLnRzIiwiLi4vc3JjL19jb21tb24vQXBwU3RhdGUudHMiLCIuLi9zcmMvX2NvbW1vbi9DaGFubmVscy50cyIsIi4uL3NyYy9fY29tbW9uL1N0b3JlLnRzIiwiLi4vc3JjL19jb21tb24vY29uc3RhbnRzLnRzIiwiLi4vc3JjL2Rlc2lnbmVyL0NvbG9yUGlja2VyLnRzIiwiLi4vc3JjL2Rlc2lnbmVyL0Rlc2lnbmVyQ29udHJvbGxlci50cyIsIi4uL3NyYy9kZXNpZ25lci9TZWxlY3RlZEl0ZW1FZGl0b3IudHMiLCIuLi9zcmMvZGVzaWduZXIvU2tldGNoRWRpdG9yLnRzIiwiLi4vc3JjL2Rlc2lnbmVyL1RleHRCbG9ja0VkaXRvci50cyIsIi4uL3NyYy9tYXRoL1BlcnNwZWN0aXZlVHJhbnNmb3JtLnRzIiwiLi4vc3JjL21vZGVsL1Bvc2l0aW9uZWRJdGVtLnRzIiwiLi4vc3JjL21vZGVsL1NrZXRjaC50cyIsIi4uL3NyYy9tb2RlbC9UZXh0QmxvY2sudHMiLCIuLi9zcmMvd29ya3NwYWNlL0N1cnZlU3BsaXR0ZXJIYW5kbGUudHMiLCIuLi9zcmMvd29ya3NwYWNlL01vdXNlQmVoYXZpb3JUb29sLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9QYXBlckhlbHBlcnMudHMiLCIuLi9zcmMvd29ya3NwYWNlL1BhdGhTZWN0aW9uLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9QYXRoVHJhbnNmb3JtLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9TZWdtZW50SGFuZGxlLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9TdHJldGNoeVBhdGgudHMiLCIuLi9zcmMvd29ya3NwYWNlL1N0cmV0Y2h5VGV4dC50cyIsIi4uL3NyYy93b3Jrc3BhY2UvVGV4dFJ1bGVyLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9WaWV3Wm9vbS50cyIsIi4uL3NyYy93b3Jrc3BhY2UvV29ya3NwYWNlLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9Xb3Jrc3BhY2VDb250cm9sbGVyLnRzIiwiLi4vc3JjL3pfYXBwL2Jvb3RzdHJhcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQ0NBO0lBSUksb0JBQVksT0FBZSxFQUFFLFFBQXVDO1FBQ2hFLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQVMsR0FBRyxFQUFFLElBQUk7WUFDckMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDTixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNYLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO29CQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDTCxpQkFBQztBQUFELENBQUMsQUFoQkQsSUFnQkM7QUNoQkQsZ0JBQW1CLE9BQWUsRUFBRSxNQUF3QjtJQUN4RCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUF2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QUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLElBQUksWUFBWSxHQUFHO1lBQ2YsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDbEUsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0UsQ0FBQztRQUVELElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFCLE1BQU0sQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixDQUFDLEVBQUssQ0FBQyxFQUFFLENBQUMsRUFBSyxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFLLENBQUM7U0FDdEIsQ0FBQyxHQUFHLENBQUMsVUFBUyxDQUFDO1lBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCwyRUFBMkU7SUFDM0UscUNBQXFDO0lBQ3JDLHFDQUFxQztJQUNyQyxxQ0FBcUM7SUFDckMscUNBQXFDO0lBQzlCLDZCQUFRLEdBQWYsVUFBZ0IsTUFBTSxFQUFFLE1BQU07UUFDMUIsTUFBTSxDQUFDO1lBQ0gsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FB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QUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVELFNBQVMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcblxyXG4iLCJcclxuY2xhc3MgRm9udExvYWRlciB7XHJcblxyXG4gICAgaXNMb2FkZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udFVybDogc3RyaW5nLCBvbkxvYWRlZDogKGZvbnQ6IG9wZW50eXBlLkZvbnQpID0+IHZvaWQpIHtcclxuICAgICAgICBvcGVudHlwZS5sb2FkKGZvbnRVcmwsIGZ1bmN0aW9uKGVyciwgZm9udCkge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob25Mb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBvbkxvYWRlZC5jYWxsKHRoaXMsIGZvbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJcclxuZnVuY3Rpb24gbG9ndGFwPFQ+KG1lc3NhZ2U6IHN0cmluZywgc3RyZWFtOiBSeC5PYnNlcnZhYmxlPFQ+KTogUnguT2JzZXJ2YWJsZTxUPntcclxuICAgIHJldHVybiBzdHJlYW0udGFwKHQgPT4gY29uc29sZS5sb2cobWVzc2FnZSwgdCkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBuZXdpZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSgpLmdldFRpbWUoKStNYXRoLnJhbmRvbSgpKS50b1N0cmluZygzNik7XHJcbn1cclxuIiwiXHJcbm5hbWVzcGFjZSBUeXBlZENoYW5uZWwge1xyXG5cclxuICAgIC8vIC0tLSBDb3JlIHR5cGVzIC0tLVxyXG5cclxuICAgIHR5cGUgU2VyaWFsaXphYmxlID0gT2JqZWN0IHwgQXJyYXk8YW55PiB8IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBEYXRlIHwgdm9pZDtcclxuXHJcbiAgICB0eXBlIFZhbHVlID0gbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiB8IERhdGU7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlLCBUQ29udGV4dERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgZGF0YT86IFREYXRhO1xyXG4gICAgICAgIHJvb3REYXRhPzogVENvbnRleHREYXRhO1xyXG4gICAgICAgIG1ldGE/OiBPYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZSBJU3ViamVjdDxUPiA9IFJ4Lk9ic2VydmVyPFQ+ICYgUnguT2JzZXJ2YWJsZTxUPjtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbFRvcGljPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlLCBUQ29udGV4dERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgY2hhbm5lbDogSVN1YmplY3Q8TWVzc2FnZTxURGF0YSwgVENvbnRleHREYXRhPj47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoYW5uZWw6IElTdWJqZWN0PE1lc3NhZ2U8VERhdGEsIFRDb250ZXh0RGF0YT4+LCB0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YnNjcmliZShvYnNlcnZlcjogKG1lc3NhZ2U6IE1lc3NhZ2U8VERhdGEsIFRDb250ZXh0RGF0YT4pID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCkuc3Vic2NyaWJlKG9ic2VydmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRpc3BhdGNoKGRhdGE/OiBURGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwub25OZXh0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXNwYXRjaENvbnRleHQoY29udGV4dDogVENvbnRleHREYXRhLCBkYXRhOiBURGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwub25OZXh0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgICAgICAgICAgIHJvb3REYXRhOiBjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9ic2VydmUoKTogUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhLCBUQ29udGV4dERhdGE+PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuZmlsdGVyKG0gPT4gbS50eXBlID09PSB0aGlzLnR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbDxUQ29udGV4dERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBzdWJqZWN0OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZSwgVENvbnRleHREYXRhPj47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN1YmplY3Q/OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZSwgVENvbnRleHREYXRhPj4sIHR5cGU/OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJqZWN0ID0gc3ViamVjdCB8fCBuZXcgUnguU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZSwgVENvbnRleHREYXRhPj4oKTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YnNjcmliZShvbk5leHQ/OiAodmFsdWU6IE1lc3NhZ2U8U2VyaWFsaXphYmxlLCBUQ29udGV4dERhdGE+KSA9PiB2b2lkKTogUnguSURpc3Bvc2FibGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LnN1YnNjcmliZShvbk5leHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9waWM8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+KHR5cGU6IHN0cmluZykgOiBDaGFubmVsVG9waWM8VERhdGEsIFRDb250ZXh0RGF0YT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENoYW5uZWxUb3BpYzxURGF0YSwgVENvbnRleHREYXRhPih0aGlzLnN1YmplY3QgYXMgSVN1YmplY3Q8TWVzc2FnZTxURGF0YSwgVENvbnRleHREYXRhPj4sXHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPyB0aGlzLnR5cGUgKyAnLicgKyB0eXBlIDogdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lcmdlVHlwZWQ8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+KC4uLnRvcGljczogQ2hhbm5lbFRvcGljPFREYXRhLCBUQ29udGV4dERhdGE+W10pIFxyXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YSwgVENvbnRleHREYXRhPj4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRvcGljcy5tYXAodCA9PiB0LnR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmZpbHRlcihtID0+IHR5cGVzLmluZGV4T2YobS50eXBlKSA+PSAwICkgYXMgUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhLCBUQ29udGV4dERhdGE+PjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVyZ2UoLi4udG9waWNzOiBDaGFubmVsVG9waWM8U2VyaWFsaXphYmxlLCBUQ29udGV4dERhdGE+W10pIFxyXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxTZXJpYWxpemFibGUsIFRDb250ZXh0RGF0YT4+IHtcclxuICAgICAgICAgICAgY29uc3QgdHlwZXMgPSB0b3BpY3MubWFwKHQgPT4gdC50eXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5maWx0ZXIobSA9PiB0eXBlcy5pbmRleE9mKG0udHlwZSkgPj0gMCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIiwiXHJcbi8vIGNsYXNzIE9sZFRvcGljPFQ+IHtcclxuXHJcbi8vICAgICBwcml2YXRlIF9jaGFubmVsOiBJQ2hhbm5lbERlZmluaXRpb248T2JqZWN0PjtcclxuLy8gICAgIHByaXZhdGUgX25hbWU6IHN0cmluZztcclxuXHJcbi8vICAgICBjb25zdHJ1Y3RvcihjaGFubmVsOiBJQ2hhbm5lbERlZmluaXRpb248T2JqZWN0PiwgdG9waWM6IHN0cmluZykge1xyXG4vLyAgICAgICAgIHRoaXMuX2NoYW5uZWwgPSBjaGFubmVsO1xyXG4vLyAgICAgICAgIHRoaXMuX25hbWUgPSB0b3BpYztcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiA8UnguT2JzZXJ2YWJsZTxUPj50aGlzLl9jaGFubmVsLm9ic2VydmUodGhpcy5fbmFtZSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHVibGlzaChkYXRhOiBUKSB7XHJcbi8vICAgICAgICAgdGhpcy5fY2hhbm5lbC5wdWJsaXNoKHRoaXMuX25hbWUsIGRhdGEpO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHN1YnNjcmliZShjYWxsYmFjazogSUNhbGxiYWNrPFQ+KTogSVN1YnNjcmlwdGlvbkRlZmluaXRpb248VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiB0aGlzLl9jaGFubmVsLnN1YnNjcmliZSh0aGlzLl9uYW1lLCBjYWxsYmFjayk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHJvdGVjdGVkIHN1YnRvcGljKG5hbWUpOiBDaGFubmVsVG9waWM8VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiBuZXcgQ2hhbm5lbFRvcGljPFQ+KHRoaXMuX2NoYW5uZWwsIHRoaXMuX25hbWUgKyAnLicgKyBuYW1lKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBwcm90ZWN0ZWQgc3VidG9waWNPZjxVIGV4dGVuZHMgVD4obmFtZSk6IENoYW5uZWxUb3BpYzxVPiB7XHJcbi8vICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VT4odGhpcy5fY2hhbm5lbCwgdGhpcy5fbmFtZSArICcuJyArIG5hbWUpO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcbiIsIlxyXG5pbnRlcmZhY2UgSVBvc3RhbCB7XHJcbiAgICBvYnNlcnZlOiAob3B0aW9uczogUG9zdGFsT2JzZXJ2ZU9wdGlvbnMpID0+IFJ4Lk9ic2VydmFibGU8YW55PjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFBvc3RhbE9ic2VydmVPcHRpb25zIHtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIHRvcGljOiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJQ2hhbm5lbERlZmluaXRpb248VD4ge1xyXG4gICAgb2JzZXJ2ZSh0b3BpYzogc3RyaW5nKTogUnguT2JzZXJ2YWJsZTxUPjtcclxufVxyXG5cclxucG9zdGFsLm9ic2VydmUgPSBmdW5jdGlvbihvcHRpb25zOiBQb3N0YWxPYnNlcnZlT3B0aW9ucykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGNoYW5uZWwgPSBvcHRpb25zLmNoYW5uZWw7XHJcbiAgICB2YXIgdG9waWMgPSBvcHRpb25zLnRvcGljO1xyXG5cclxuICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm4oXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkSGFuZGxlcihoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgICAgICBjaGFubmVsOiBjaGFubmVsLFxyXG4gICAgICAgICAgICAgICAgdG9waWM6IHRvcGljLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsSGFuZGxlcihfLCBzdWIpIHtcclxuICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufTtcclxuXHJcbi8vIGFkZCBvYnNlcnZlIHRvIENoYW5uZWxEZWZpbml0aW9uXHJcbig8YW55PnBvc3RhbCkuQ2hhbm5lbERlZmluaXRpb24ucHJvdG90eXBlLm9ic2VydmUgPSBmdW5jdGlvbih0b3BpYzogc3RyaW5nKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybihcclxuICAgICAgICBmdW5jdGlvbiBhZGRIYW5kbGVyKGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuYnVzLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgICAgICBjaGFubmVsOiBzZWxmLmNoYW5uZWwsXHJcbiAgICAgICAgICAgICAgICB0b3BpYzogdG9waWMsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogaCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiBkZWxIYW5kbGVyKF8sIHN1Yikge1xyXG4gICAgICAgICAgICBzdWIudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG59O1xyXG4iLCJcclxuYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50PFQ+IHtcclxuICAgIGFic3RyYWN0IHJlbmRlcihkYXRhOiBUKTogVk5vZGU7XHJcbn0iLCJcclxuaW50ZXJmYWNlIFJlYWN0aXZlRG9tQ29tcG9uZW50IHtcclxuICAgIGRvbSQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+O1xyXG59XHJcblxyXG5jbGFzcyBSZWFjdGl2ZURvbSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSByZWFjdGl2ZSBjb21wb25lbnQgd2l0aGluIGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlclN0cmVhbShcclxuICAgICAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPixcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50XHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBjb250YWluZXIuaWQ7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQ6IEhUTUxFbGVtZW50IHwgVk5vZGUgPSBjb250YWluZXI7XHJcbiAgICAgICAgY29uc3Qgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGRvbSQuc3Vic2NyaWJlKGRvbSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFkb20pIHJldHVybjtcclxuY29uc29sZS5sb2coJ3JlbmRlcmluZyBkb20nLCBkb20pOyAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIHJldGFpbiBJRFxyXG4gICAgICAgICAgICBjb25zdCBwYXRjaGVkID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgaWYoaWQgJiYgIXBhdGNoZWQuZWxtLmlkKXtcclxuICAgICAgICAgICAgICAgIHBhdGNoZWQuZWxtLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaGVkO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSByZWFjdGl2ZSBjb21wb25lbnQgd2l0aGluIGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlckNvbXBvbmVudChcclxuICAgICAgICBjb21wb25lbnQ6IFJlYWN0aXZlRG9tQ29tcG9uZW50LFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZVxyXG4gICAgKTogUnguT2JzZXJ2YWJsZTxWTm9kZT4ge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gY29udGFpbmVyO1xyXG4gICAgICAgIGxldCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XHJcbiAgICAgICAgY29tcG9uZW50LmRvbSQuc3Vic2NyaWJlKGRvbSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFkb20pIHJldHVybjtcclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoKGN1cnJlbnQsIGRvbSk7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciB3aXRoaW4gY29udGFpbmVyIHdoZW5ldmVyIHNvdXJjZSBjaGFuZ2VzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbGl2ZVJlbmRlcjxUPihcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50IHwgVk5vZGUsXHJcbiAgICAgICAgc291cmNlOiBSeC5PYnNlcnZhYmxlPFQ+LFxyXG4gICAgICAgIHJlbmRlcjogKG5leHQ6IFQpID0+IFZOb2RlXHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjb250YWluZXI7XHJcbiAgICAgICAgbGV0IHNpbmsgPSBuZXcgUnguU3ViamVjdDxWTm9kZT4oKTtcclxuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IHJlbmRlcihkYXRhKTtcclxuICAgICAgICAgICAgaWYoIW5vZGUpIHJldHVybjtcclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoKGN1cnJlbnQsIG5vZGUpO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmNsYXNzIEFwcFN0YXRlIHtcclxuICAgIHNrZXRjaDogU2tldGNoO1xyXG59IiwiXHJcbmNsYXNzIEFjdGlvbnMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbDx2b2lkPiB7XHJcbiAgICBcclxuICAgIHNrZXRjaCA9IHtcclxuICAgICAgICBjcmVhdGU6IHRoaXMudG9waWM8YW55PihcInNrZXRjaC5jcmVhdGVcIiksXHJcbiAgICAgICAgYXR0clVwZGF0ZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5hdHRydXBkYXRlXCIpLFxyXG4gICAgICAgIHNldEVkaXRpbmdJdGVtOiB0aGlzLnRvcGljPFBvc2l0aW9uZWRJdGVtPihcInNrZXRjaC5zZXRlZGl0aW5naXRlbVwiKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0ZXh0QmxvY2sgPSB7XHJcbiAgICAgICAgYWRkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYWRkXCIpLFxyXG4gICAgICAgIHVwZGF0ZTogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLnVwZGF0ZVwiKVxyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbmNsYXNzIEV2ZW50cyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsPEFwcFN0YXRlPiB7XHJcbiAgICBcclxuICAgIHNrZXRjaCA9IHtcclxuICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5sb2FkZWRcIiksXHJcbiAgICAgICAgYXR0cmNoYW5nZWQ6IHRoaXMudG9waWM8U2tldGNoQXR0cj4oXCJza2V0Y2guYXR0cmNoYW5nZWRcIiksXHJcbiAgICAgICAgZWRpdGluZ0l0ZW1DaGFuZ2VkOiB0aGlzLnRvcGljPFBvc2l0aW9uZWRJdGVtPihcInNrZXRjaC5lZGl0aW5naXRlbWNoYW5nZWRcIilcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGV4dGJsb2NrID0ge1xyXG4gICAgICAgIGFkZGVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYWRkZWRcIiksXHJcbiAgICAgICAgY2hhbmdlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmNoYW5nZWRcIiksXHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuY2xhc3MgQ2hhbm5lbHMge1xyXG4gICAgYWN0aW9uczogQWN0aW9ucyA9IG5ldyBBY3Rpb25zKCk7XHJcbiAgICBldmVudHM6IEV2ZW50cyA9IG5ldyBFdmVudHMoKTtcclxufVxyXG4iLCJcclxuY2xhc3MgU3RvcmUge1xyXG5cclxuICAgIHN0YXRlID0gbmV3IEFwcFN0YXRlKCk7XHJcbiAgICBhY3Rpb25zOiBBY3Rpb25zO1xyXG4gICAgZXZlbnRzOiBFdmVudHM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgYWN0aW9uczogQWN0aW9ucyxcclxuICAgICAgICBldmVudHM6IEV2ZW50cykge1xyXG5cclxuICAgICAgICB0aGlzLmFjdGlvbnMgPSBhY3Rpb25zO1xyXG4gICAgICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnNrZXRjaC5jcmVhdGVcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaCA9IG5ldyBTa2V0Y2goKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5sb2FkZWQuZGlzcGF0Y2hDb250ZXh0KHRoaXMuc3RhdGUsIHRoaXMuc3RhdGUuc2tldGNoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLmF0dHJVcGRhdGVcclxuICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbih0aGlzLnN0YXRlLnNrZXRjaC5hdHRyLCBldi5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5hdHRyY2hhbmdlZC5kaXNwYXRjaENvbnRleHQodGhpcy5zdGF0ZSwgdGhpcy5zdGF0ZS5za2V0Y2guYXR0cik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5hZGRcclxuICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGF0Y2ggPSBldi5kYXRhO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0geyBfaWQ6IG5ld2lkKCkgfSBhcyBUZXh0QmxvY2s7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbihibG9jaywgcGF0Y2gpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2gudGV4dEJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5hZGRlZC5kaXNwYXRjaENvbnRleHQodGhpcy5zdGF0ZSwgYmxvY2spO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gZXYuZGF0YTtcclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuc3RhdGUuc2tldGNoLmdldEJsb2NrKGV2LmRhdGEuX2lkKTtcclxuICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduKGJsb2NrLCBwYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmNoYW5nZWQuZGlzcGF0Y2hDb250ZXh0KHRoaXMuc3RhdGUsIGJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLnNldEVkaXRpbmdJdGVtLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgaWYobS5kYXRhLml0ZW1UeXBlICE9PSBcIlRleHRCbG9ja1wiKXtcclxuICAgICAgICAgICAgICAgIHRocm93IGBVbmhhbmRsZWQgdHlwZSAke20udHlwZX1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnN0YXRlLnNrZXRjaC5nZXRCbG9jayhtLmRhdGEuaXRlbUlkKTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guZWRpdGluZ0l0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtSWQ6IG0uZGF0YS5pdGVtSWQsXHJcbiAgICAgICAgICAgICAgICBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIixcclxuICAgICAgICAgICAgICAgIGl0ZW06IGl0ZW0sXHJcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBtLmRhdGEuY2xpZW50WCxcclxuICAgICAgICAgICAgICAgIGNsaWVudFk6IG0uZGF0YS5jbGllbnRZXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGV2ZW50cy5za2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkLmRpc3BhdGNoKHRoaXMuc3RhdGUuc2tldGNoLmVkaXRpbmdJdGVtKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFzc2lnbjxUPihkZXN0OiBULCBzb3VyY2U6IFQpIHtcclxuICAgICAgICBfLmFzc2lnbihkZXN0LCBzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG50eXBlIEFjdGlvblR5cGVzID0gXHJcbiAgICBcInNrZXRjaC5jcmVhdGVcIlxyXG4gICAgfCBcInNrZXRjaC51cGRhdGVcIlxyXG4gICAgfCBcInRleHRibG9jay5hZGRcIlxyXG4gICAgfCBcInRleHRibG9jay51cGRhdGVcIjtcclxuXHJcbnR5cGUgRXZlbnRUeXBlcyA9XHJcbiAgICBcInNrZXRjaC5sb2FkZWRcIlxyXG4gICAgfCBcInNrZXRjaC5jaGFuZ2VkXCJcclxuICAgIHwgXCJ0ZXh0YmxvY2suYWRkZWRcIlxyXG4gICAgfCBcInRleHRibG9jay5jaGFuZ2VkXCI7XHJcbiIsIlxyXG5jbGFzcyBDb2xvclBpY2tlciB7XHJcbiAgICBzdGF0aWMgc2V0dXAoZWxlbSwgb25DaGFuZ2UpIHtcclxuICAgICAgICBsZXQgc2VsID0gPGFueT4kKGVsZW0pO1xyXG4gICAgICAgICg8YW55PiQoZWxlbSkpLnNwZWN0cnVtKHtcclxuICAgICAgICAgICAgc2hvd0lucHV0OiB0cnVlLFxyXG4gICAgICAgICAgICBhbGxvd0VtcHR5OiB0cnVlLFxyXG4gICAgICAgICAgICBwcmVmZXJyZWRGb3JtYXQ6IFwiaGV4XCIsXHJcbiAgICAgICAgICAgIHNob3dCdXR0b25zOiBmYWxzZSxcclxuICAgICAgICAgICAgc2hvd0FscGhhOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93UGFsZXR0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd1NlbGVjdGlvblBhbGV0dGU6IHRydWUsXHJcbiAgICAgICAgICAgIHBhbGV0dGU6IFtcclxuICAgICAgICAgICAgICAgIFtcIiMwMDBcIiwgXCIjNDQ0XCIsIFwiIzY2NlwiLCBcIiM5OTlcIiwgXCIjY2NjXCIsIFwiI2VlZVwiLCBcIiNmM2YzZjNcIiwgXCIjZmZmXCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiI2YwMFwiLCBcIiNmOTBcIiwgXCIjZmYwXCIsIFwiIzBmMFwiLCBcIiMwZmZcIiwgXCIjMDBmXCIsIFwiIzkwZlwiLCBcIiNmMGZcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjZjRjY2NjXCIsIFwiI2ZjZTVjZFwiLCBcIiNmZmYyY2NcIiwgXCIjZDllYWQzXCIsIFwiI2QwZTBlM1wiLCBcIiNjZmUyZjNcIiwgXCIjZDlkMmU5XCIsIFwiI2VhZDFkY1wiXSxcclxuICAgICAgICAgICAgICAgIFtcIiNlYTk5OTlcIiwgXCIjZjljYjljXCIsIFwiI2ZmZTU5OVwiLCBcIiNiNmQ3YThcIiwgXCIjYTJjNGM5XCIsIFwiIzlmYzVlOFwiLCBcIiNiNGE3ZDZcIiwgXCIjZDVhNmJkXCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiI2UwNjY2NlwiLCBcIiNmNmIyNmJcIiwgXCIjZmZkOTY2XCIsIFwiIzkzYzQ3ZFwiLCBcIiM3NmE1YWZcIiwgXCIjNmZhOGRjXCIsIFwiIzhlN2NjM1wiLCBcIiNjMjdiYTBcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjYzAwXCIsIFwiI2U2OTEzOFwiLCBcIiNmMWMyMzJcIiwgXCIjNmFhODRmXCIsIFwiIzQ1ODE4ZVwiLCBcIiMzZDg1YzZcIiwgXCIjNjc0ZWE3XCIsIFwiI2E2NGQ3OVwiXSxcclxuICAgICAgICAgICAgICAgIFtcIiM5MDBcIiwgXCIjYjQ1ZjA2XCIsIFwiI2JmOTAwMFwiLCBcIiMzODc2MWRcIiwgXCIjMTM0ZjVjXCIsIFwiIzBiNTM5NFwiLCBcIiMzNTFjNzVcIiwgXCIjNzQxYjQ3XCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiIzYwMFwiLCBcIiM3ODNmMDRcIiwgXCIjN2Y2MDAwXCIsIFwiIzI3NGUxM1wiLCBcIiMwYzM0M2RcIiwgXCIjMDczNzYzXCIsIFwiIzIwMTI0ZFwiLCBcIiM0YzExMzBcIl1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlS2V5OiBcInNrZXRjaHRleHRcIixcclxuICAgICAgICAgICAgY2hhbmdlOiBvbkNoYW5nZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc3RhdGljIGRlc3Ryb3koZWxlbSl7XHJcbiAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bShcImRlc3Ryb3lcIik7XHJcbiAgICB9XHJcbn0iLCJcclxuY29uc3QgQW1hdGljVXJsID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL2FtYXRpY3NjL3Y4L0lEbmtSVFBHY3JTVm81MFV5WU5LN3kzVVNCblN2cGtvcFFhVVItMnI3aVUudHRmJztcclxuY29uc3QgUm9ib3RvMTAwID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL3JvYm90by92MTUvN015Z3FUZTJ6czlZa1AwYWRBOVFRUS50dGYnO1xyXG5jb25zdCBSb2JvdG81MDAgPSAnZm9udHMvUm9ib3RvLTUwMC50dGYnO1xyXG5jb25zdCBBcXVhZmluYVNjcmlwdCA9ICdmb250cy9BZ3VhZmluYVNjcmlwdC1SZWd1bGFyL0FndWFmaW5hU2NyaXB0LVJlZ3VsYXIudHRmJ1xyXG5cclxuY2xhc3MgRGVzaWduZXJDb250cm9sbGVyIHtcclxuXHJcbiAgICBmb250czogb3BlbnR5cGUuRm9udFtdID0gW107XHJcbiAgICB3b3Jrc3BhY2VDb250cm9sbGVyOiBXb3Jrc3BhY2VDb250cm9sbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNoYW5uZWxzOiBDaGFubmVscywgb25Gb250TG9hZGVkOigpID0+IHZvaWQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkRm9udChSb2JvdG81MDAsIGZvbnQgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2VDb250cm9sbGVyID0gbmV3IFdvcmtzcGFjZUNvbnRyb2xsZXIoY2hhbm5lbHMsIGZvbnQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgb25Gb250TG9hZGVkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZvbnQodXJsOiBzdHJpbmcsIG9uQ29tcGxldGU6IChmOiBvcGVudHlwZS5Gb250KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgbmV3IEZvbnRMb2FkZXIodXJsLCBmb250ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mb250cy5wdXNoKGZvbnQpO1xyXG4gICAgICAgICAgICBvbkNvbXBsZXRlKGZvbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFNlbGVjdGVkSXRlbUVkaXRvciB7XHJcblxyXG4gICAgY2hhbm5lbHM6IENoYW5uZWxzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGNoYW5uZWxzOiBDaGFubmVscykge1xyXG4gICAgICAgIHRoaXMuY2hhbm5lbHMgPSBjaGFubmVscztcclxuXHJcbiAgICAgICAgY29uc3QgZG9tJCA9IGNoYW5uZWxzLmV2ZW50cy5za2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkLm9ic2VydmUoKS5tYXAoaSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWkuZGF0YSB8fCAhaS5kYXRhLml0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpLmRhdGEuaXRlbVR5cGUgIT09ICdUZXh0QmxvY2snKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBibG9jayA9IGkuZGF0YS5pdGVtIGFzIFRleHRCbG9jaztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoKCdkaXYjZWRpdG9yT3ZlcmxheScsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogaS5kYXRhLmNsaWVudFggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogaS5kYXRhLmNsaWVudFkgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiei1pbmRleFwiOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgVGV4dEJsb2NrRWRpdG9yKGNoYW5uZWxzLmFjdGlvbnMpLnJlbmRlcihibG9jaylcclxuICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKGRvbSQsIGNvbnRhaW5lcik7XHJcblxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBTa2V0Y2hFZGl0b3IgZXh0ZW5kcyBDb21wb25lbnQ8U2tldGNoPiB7XHJcbiAgICBhY3Rpb25zOiBBY3Rpb25zO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFjdGlvbnM6IEFjdGlvbnMpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IGFjdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHNrZXRjaDogU2tldGNoKSB7XHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXZcIiwgW1xyXG4gICAgICAgICAgICBcIkFkZCB0ZXh0OiBcIixcclxuICAgICAgICAgICAgaChcImlucHV0LmFkZC10ZXh0XCIsIHtcclxuICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5cHJlc3M6IChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihldi53aGljaCA9PT0gMTMgfHwgZXYua2V5Q29kZSA9PT0gMTMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGV2LnRhcmdldCAmJiBldi50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0ZXh0Lmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25zLnRleHRCbG9jay5hZGQuZGlzcGF0Y2goeyB0ZXh0OiB0ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnRhcmdldC52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIlByZXNzIFtFbnRlcl0gdG8gYWRkXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgXCJCYWNrZ3JvdW5kOiBcIixcclxuICAgICAgICAgICAgaChcImlucHV0LmJhY2tncm91bmQtY29sb3JcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHNrZXRjaC5hdHRyLmJhY2tncm91bmRDb2xvciAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZub2RlLmVsbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZS5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgYmFja2dyb3VuZENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICh2bm9kZSkgPT4gQ29sb3JQaWNrZXIuZGVzdHJveSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIFRleHRCbG9ja0VkaXRvciBleHRlbmRzIENvbXBvbmVudDxUZXh0QmxvY2s+IHtcclxuICAgIGFjdGlvbnM6IEFjdGlvbnM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYWN0aW9uczogQWN0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zID0gYWN0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGV4dEJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XHJcbiAgICAgICAgbGV0IHVwZGF0ZSA9IHRiID0+IHtcclxuICAgICAgICAgICAgdGIuX2lkID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLnRleHRCbG9jay51cGRhdGUuZGlzcGF0Y2godGIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGgoJ2Rpdi50ZXh0LWJsb2NrLWVkaXRvcicsXHJcbiAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICBoKCd0ZXh0YXJlYScsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXl1cDogZSA9PiB1cGRhdGUoeyB0ZXh0OiBlLnRhcmdldC52YWx1ZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZSA9PiB1cGRhdGUoeyB0ZXh0OiBlLnRhcmdldC52YWx1ZSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBoKCdpbnB1dC50ZXh0LWNvbG9yJyxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0Q29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZub2RlLmVsbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgdGV4dENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICh2bm9kZSkgPT4gQ29sb3JQaWNrZXIuZGVzdHJveSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIGgoJ2lucHV0LmJhY2tncm91bmQtY29sb3InLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB1cGRhdGUoeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBdKTtcclxuICAgIH1cclxuXHJcbn0iLCJcclxuZGVjbGFyZSB2YXIgc29sdmU6IChhOiBhbnksIGI6IGFueSwgZmFzdDogYm9vbGVhbikgPT4gdm9pZDtcclxuXHJcbmNsYXNzIFBlcnNwZWN0aXZlVHJhbnNmb3JtIHtcclxuICAgIFxyXG4gICAgc291cmNlOiBRdWFkO1xyXG4gICAgZGVzdDogUXVhZDtcclxuICAgIHBlcnNwOiBhbnk7XHJcbiAgICBtYXRyaXg6IG51bWJlcltdO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2U6IFF1YWQsIGRlc3Q6IFF1YWQpe1xyXG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuZGVzdCA9IGRlc3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5jcmVhdGVNYXRyaXgoc291cmNlLCBkZXN0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gR2l2ZW4gYSA0eDQgcGVyc3BlY3RpdmUgdHJhbnNmb3JtYXRpb24gbWF0cml4LCBhbmQgYSAyRCBwb2ludCAoYSAyeDEgdmVjdG9yKSxcclxuICAgIC8vIGFwcGxpZXMgdGhlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCBieSBjb252ZXJ0aW5nIHRoZSBwb2ludCB0byBob21vZ2VuZW91c1xyXG4gICAgLy8gY29vcmRpbmF0ZXMgYXQgej0wLCBwb3N0LW11bHRpcGx5aW5nLCBhbmQgdGhlbiBhcHBseWluZyBhIHBlcnNwZWN0aXZlIGRpdmlkZS5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBsZXQgcDMgPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5tdWx0aXBseSh0aGlzLm1hdHJpeCwgW3BvaW50LngsIHBvaW50LnksIDAsIDFdKTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IHBhcGVyLlBvaW50KHAzWzBdIC8gcDNbM10sIHAzWzFdIC8gcDNbM10pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBjcmVhdGVNYXRyaXgoc291cmNlOiBRdWFkLCB0YXJnZXQ6IFF1YWQpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNvdXJjZVBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3NvdXJjZS5hLngsIHNvdXJjZS5hLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5iLngsIHNvdXJjZS5iLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5jLngsIHNvdXJjZS5jLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5kLngsIHNvdXJjZS5kLnldXTtcclxuICAgICAgICBsZXQgdGFyZ2V0UG9pbnRzID0gW1xyXG4gICAgICAgICAgICBbdGFyZ2V0LmEueCwgdGFyZ2V0LmEueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmIueCwgdGFyZ2V0LmIueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmMueCwgdGFyZ2V0LmMueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmQueCwgdGFyZ2V0LmQueV1dO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGEgPSBbXSwgYiA9IFtdLCBpID0gMCwgbiA9IHNvdXJjZVBvaW50cy5sZW5ndGg7IGkgPCBuOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHMgPSBzb3VyY2VQb2ludHNbaV0sIHQgPSB0YXJnZXRQb2ludHNbaV07XHJcbiAgICAgICAgICAgIGEucHVzaChbc1swXSwgc1sxXSwgMSwgMCwgMCwgMCwgLXNbMF0gKiB0WzBdLCAtc1sxXSAqIHRbMF1dKSwgYi5wdXNoKHRbMF0pO1xyXG4gICAgICAgICAgICBhLnB1c2goWzAsIDAsIDAsIHNbMF0sIHNbMV0sIDEsIC1zWzBdICogdFsxXSwgLXNbMV0gKiB0WzFdXSksIGIucHVzaCh0WzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBYID0gc29sdmUoYSwgYiwgdHJ1ZSk7IFxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIFhbMF0sIFhbM10sIDAsIFhbNl0sXHJcbiAgICAgICAgICAgIFhbMV0sIFhbNF0sIDAsIFhbN10sXHJcbiAgICAgICAgICAgICAgIDAsICAgIDAsIDEsICAgIDAsXHJcbiAgICAgICAgICAgIFhbMl0sIFhbNV0sIDAsICAgIDFcclxuICAgICAgICBdLm1hcChmdW5jdGlvbih4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHggKiAxMDAwMDApIC8gMTAwMDAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBvc3QtbXVsdGlwbHkgYSA0eDQgbWF0cml4IGluIGNvbHVtbi1tYWpvciBvcmRlciBieSBhIDR4MSBjb2x1bW4gdmVjdG9yOlxyXG4gICAgLy8gWyBtMCBtNCBtOCAgbTEyIF0gICBbIHYwIF0gICBbIHggXVxyXG4gICAgLy8gWyBtMSBtNSBtOSAgbTEzIF0gKiBbIHYxIF0gPSBbIHkgXVxyXG4gICAgLy8gWyBtMiBtNiBtMTAgbTE0IF0gICBbIHYyIF0gICBbIHogXVxyXG4gICAgLy8gWyBtMyBtNyBtMTEgbTE1IF0gICBbIHYzIF0gICBbIHcgXVxyXG4gICAgc3RhdGljIG11bHRpcGx5KG1hdHJpeCwgdmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgbWF0cml4WzBdICogdmVjdG9yWzBdICsgbWF0cml4WzRdICogdmVjdG9yWzFdICsgbWF0cml4WzggXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxMl0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFsxXSAqIHZlY3RvclswXSArIG1hdHJpeFs1XSAqIHZlY3RvclsxXSArIG1hdHJpeFs5IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTNdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMl0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNl0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbMTBdICogdmVjdG9yWzJdICsgbWF0cml4WzE0XSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzNdICogdmVjdG9yWzBdICsgbWF0cml4WzddICogdmVjdG9yWzFdICsgbWF0cml4WzExXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNV0gKiB2ZWN0b3JbM11cclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBRdWFkIHtcclxuICAgIGE6IHBhcGVyLlBvaW50O1xyXG4gICAgYjogcGFwZXIuUG9pbnQ7XHJcbiAgICBjOiBwYXBlci5Qb2ludDtcclxuICAgIGQ6IHBhcGVyLlBvaW50O1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQsIGM6IHBhcGVyLlBvaW50LCBkOiBwYXBlci5Qb2ludCl7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYyA9IGM7XHJcbiAgICAgICAgdGhpcy5kID0gZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21SZWN0YW5nbGUocmVjdDogcGFwZXIuUmVjdGFuZ2xlKXtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIHJlY3QudG9wTGVmdCxcclxuICAgICAgICAgICAgcmVjdC50b3BSaWdodCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21MZWZ0LFxyXG4gICAgICAgICAgICByZWN0LmJvdHRvbVJpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21Db29yZHMoY29vcmRzOiBudW1iZXJbXSkgOiBRdWFkIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMF0sIGNvb3Jkc1sxXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMl0sIGNvb3Jkc1szXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNF0sIGNvb3Jkc1s1XSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNl0sIGNvb3Jkc1s3XSlcclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFzQ29vcmRzKCk6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB0aGlzLmEueCwgdGhpcy5hLnksXHJcbiAgICAgICAgICAgIHRoaXMuYi54LCB0aGlzLmIueSxcclxuICAgICAgICAgICAgdGhpcy5jLngsIHRoaXMuYy55LFxyXG4gICAgICAgICAgICB0aGlzLmQueCwgdGhpcy5kLnlcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59IiwiXHJcbmludGVyZmFjZSBQb3NpdGlvbmVkSXRlbSB7XHJcbiAgICBpdGVtSWQ/OiBzdHJpbmc7XHJcbiAgICBpdGVtVHlwZT86IHN0cmluZztcclxuICAgIGl0ZW0/OiBPYmplY3Q7XHJcbiAgICBjbGllbnRYPzogbnVtYmVyO1xyXG4gICAgY2xpZW50WT86IG51bWJlcjtcclxufSIsIlxyXG5jbGFzcyBTa2V0Y2gge1xyXG5cclxuICAgIGF0dHI6IFNrZXRjaEF0dHIgPSB7IFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmNmYxZTMnXHJcbiAgICB9O1xyXG5cclxuICAgIHRleHRCbG9ja3M6IFRleHRCbG9ja1tdID0gW107XHJcblxyXG4gICAgZWRpdGluZ0l0ZW06IFBvc2l0aW9uZWRJdGVtO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGdldEJsb2NrKGlkKXtcclxuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMudGV4dEJsb2NrcywgdCA9PiB0Ll9pZCA9PT0gaWQpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuaW50ZXJmYWNlIFNrZXRjaEF0dHIge1xyXG5cclxuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuXHJcbn0iLCJcclxuaW50ZXJmYWNlIFRleHRCbG9jayB7XHJcbiAgICBfaWQ/OiBzdHJpbmc7XHJcbiAgICB0ZXh0Pzogc3RyaW5nO1xyXG4gICAgdGV4dENvbG9yPzogc3RyaW5nO1xyXG4gICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgZm9udD86IHN0cmluZztcclxuICAgIGZvbnRTaXplPzogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBlZGl0aW5nPzogYm9vbGVhbjtcclxufSIsIlxyXG4vKipcclxuICogSGFuZGxlIHRoYXQgc2l0cyBvbiBtaWRwb2ludCBvZiBjdXJ2ZVxyXG4gKiAgIHdoaWNoIHdpbGwgc3BsaXQgdGhlIGN1cnZlIHdoZW4gZHJhZ2dlZC5cclxuICovXHJcbmNsYXNzIEN1cnZlU3BsaXR0ZXJIYW5kbGUgZXh0ZW5kcyBwYXBlci5TaGFwZSB7XHJcbiBcclxuICAgIGN1cnZlOiBwYXBlci5DdXJ2ZTtcclxuICAgIG9uRHJhZ1N0YXJ0OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uRHJhZ0VuZDogKG5ld1NlZ21lbnQ6IHBhcGVyLlNlZ21lbnQsIGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiBcclxuICAgIGNvbnN0cnVjdG9yKGN1cnZlOiBwYXBlci5DdXJ2ZSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJ2ZSA9IGN1cnZlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzZWxmID0gPGFueT50aGlzO1xyXG4gICAgICAgIHNlbGYuX3R5cGUgPSAnY2lyY2xlJztcclxuICAgICAgICBzZWxmLl9yYWRpdXMgPSAxNTtcclxuICAgICAgICBzZWxmLl9zaXplID0gbmV3IHBhcGVyLlNpemUoc2VsZi5fcmFkaXVzICogMik7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGUoY3VydmUuZ2V0UG9pbnRBdCgwLjUgKiBjdXJ2ZS5sZW5ndGgpKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0cm9rZVdpZHRoID0gMjtcclxuICAgICAgICB0aGlzLnN0cm9rZUNvbG9yID0gJ2JsdWUnO1xyXG4gICAgICAgIHRoaXMuZmlsbENvbG9yID0gJ3doaXRlJztcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAwLjM7IFxyXG4gXHJcbiAgICAgICAgbGV0IG5ld1NlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0gPE1vdXNlQmVoYXZpb3I+e1xyXG4gICAgICAgICAgICBvbkRyYWdTdGFydDogKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuZXdTZWdtZW50ID0gbmV3IHBhcGVyLlNlZ21lbnQodGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICBjdXJ2ZS5wYXRoLmluc2VydChcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZS5pbmRleCArIDEsIFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1NlZ21lbnRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uRHJhZ1N0YXJ0KXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRHJhZ1N0YXJ0KGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnTW92ZTogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1BvcyA9IHRoaXMucG9zaXRpb24uYWRkKGV2ZW50LmRlbHRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3M7XHJcbiAgICAgICAgICAgICAgICBuZXdTZWdtZW50LnBvaW50ID0gbmV3UG9zO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnRW5kOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uRHJhZ0VuZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkRyYWdFbmQobmV3U2VnbWVudCwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgaW50ZXJmYWNlIEl0ZW0ge1xyXG4gICAgICAgIG1vdXNlQmVoYXZpb3I6IE1vdXNlQmVoYXZpb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBNb3VzZUJlaGF2aW9yIHtcclxuICAgIG9uQ2xpY2s/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuXHJcbiAgICBvbk92ZXJTdGFydD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25PdmVyTW92ZT86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25PdmVyRW5kPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gICAgb25EcmFnU3RhcnQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uRHJhZ01vdmU/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uRHJhZ0VuZD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgTW91c2VBY3Rpb24ge1xyXG4gICAgc3RhcnRFdmVudDogcGFwZXIuVG9vbEV2ZW50O1xyXG4gICAgaXRlbTogcGFwZXIuSXRlbTtcclxuICAgIGRyYWdnZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmNsYXNzIE1vdXNlQmVoYXZpb3JUb29sIGV4dGVuZHMgcGFwZXIuVG9vbCB7XHJcblxyXG4gICAgaGl0T3B0aW9ucyA9IHtcclxuICAgICAgICBzZWdtZW50czogdHJ1ZSxcclxuICAgICAgICBzdHJva2U6IHRydWUsXHJcbiAgICAgICAgZmlsbDogdHJ1ZSxcclxuICAgICAgICB0b2xlcmFuY2U6IDVcclxuICAgIH07XHJcblxyXG4gICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuXHJcbiAgICBvblRvb2xNb3VzZURvd246IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICAgIHByaXZhdGUgcHJlc3NBY3Rpb246IE1vdXNlQWN0aW9uO1xyXG4gICAgcHJpdmF0ZSBob3ZlckFjdGlvbjogTW91c2VBY3Rpb247XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvamVjdDogcGFwZXIuUHJvamVjdCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93biA9IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYodGhpcy5vblRvb2xNb3VzZURvd24pe1xyXG4gICAgICAgICAgICB0aGlzLm9uVG9vbE1vdXNlRG93bihldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5wcmVzc0FjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgICAgIHZhciBoaXRSZXN1bHQgPSB0aGlzLnByb2plY3QuaGl0VGVzdChcclxuICAgICAgICAgICAgZXZlbnQucG9pbnQsXHJcbiAgICAgICAgICAgIHRoaXMuaGl0T3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGlmIChoaXRSZXN1bHQgJiYgaGl0UmVzdWx0Lml0ZW0pIHtcclxuICAgICAgICAgICAgbGV0IGRyYWdnYWJsZSA9IHRoaXMuZmluZERyYWdIYW5kbGVyKGhpdFJlc3VsdC5pdGVtKTtcclxuICAgICAgICAgICAgaWYgKGRyYWdnYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbiA9IDxNb3VzZUFjdGlvbj57XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogZHJhZ2dhYmxlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VNb3ZlID0gKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHtcclxuICAgICAgICB2YXIgaGl0UmVzdWx0ID0gdGhpcy5wcm9qZWN0LmhpdFRlc3QoXHJcbiAgICAgICAgICAgIGV2ZW50LnBvaW50LFxyXG4gICAgICAgICAgICB0aGlzLmhpdE9wdGlvbnMpO1xyXG4gICAgICAgIGxldCBoYW5kbGVySXRlbSA9IGhpdFJlc3VsdFxyXG4gICAgICAgICAgICAmJiB0aGlzLmZpbmRPdmVySGFuZGxlcihoaXRSZXN1bHQuaXRlbSk7XHJcblxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgLy8gd2VyZSBwcmV2aW91c2x5IGhvdmVyaW5nXHJcbiAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb25cclxuICAgICAgICAgICAgJiYgKFxyXG4gICAgICAgICAgICAgICAgLy8gbm90IGhvdmVyaW5nIG92ZXIgYW55dGhpbmcgbm93XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVySXRlbSA9PSBudWxsXHJcbiAgICAgICAgICAgICAgICAvLyBub3QgaG92ZXJpbmcgb3ZlciBjdXJyZW50IGhhbmRsZXIgb3IgZGVzY2VuZGVudCB0aGVyZW9mXHJcbiAgICAgICAgICAgICAgICB8fCAhTW91c2VCZWhhdmlvclRvb2wuaXNTYW1lT3JBbmNlc3RvcihcclxuICAgICAgICAgICAgICAgICAgICBoaXRSZXN1bHQuaXRlbSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uLml0ZW0pKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAvLyBqdXN0IGxlYXZpbmdcclxuICAgICAgICAgICAgaWYgKHRoaXMuaG92ZXJBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uT3ZlckVuZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25PdmVyRW5kKGV2ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChoYW5kbGVySXRlbSAmJiBoYW5kbGVySXRlbS5tb3VzZUJlaGF2aW9yKSB7XHJcbiAgICAgICAgICAgIGxldCBiZWhhdmlvciA9IGhhbmRsZXJJdGVtLm1vdXNlQmVoYXZpb3I7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5ob3ZlckFjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvbiA9IDxNb3VzZUFjdGlvbj57XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogaGFuZGxlckl0ZW1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBpZiAoYmVoYXZpb3Iub25PdmVyU3RhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvci5vbk92ZXJTdGFydChldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGJlaGF2aW9yICYmIGJlaGF2aW9yLm9uT3Zlck1vdmUpIHtcclxuICAgICAgICAgICAgICAgIGJlaGF2aW9yLm9uT3Zlck1vdmUoZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEcmFnID0gKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5wcmVzc0FjdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucHJlc3NBY3Rpb24uZHJhZ2dlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5kcmFnZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdTdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ1N0YXJ0LmNhbGwoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24uaXRlbSwgdGhpcy5wcmVzc0FjdGlvbi5zdGFydEV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnTW92ZS5jYWxsKHRoaXMucHJlc3NBY3Rpb24uaXRlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCA9IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJlc3NBY3Rpb24pIHtcclxuICAgICAgICAgICAgbGV0IGFjdGlvbiA9IHRoaXMucHJlc3NBY3Rpb247XHJcbiAgICAgICAgICAgIHRoaXMucHJlc3NBY3Rpb24gPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFjdGlvbi5kcmFnZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkcmFnXHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdFbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ0VuZC5jYWxsKGFjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjbGlja1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25DbGljaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25DbGljay5jYWxsKGFjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uRG91YmxlQ2xpY2sgPSAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4ge1xyXG4gICAgfVxyXG5cclxuICAgIG9uS2V5RG93biA9IChldmVudDogcGFwZXIuS2V5RXZlbnQpID0+IHtcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25LZXlVcCA9IChldmVudDogcGFwZXIuS2V5RXZlbnQpID0+IHtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXRlcm1pbmUgaWYgY29udGFpbmVyIGlzIGFuIGFuY2VzdG9yIG9mIGl0ZW0uIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaXNTYW1lT3JBbmNlc3RvcihpdGVtOiBwYXBlci5JdGVtLCBjb250YWluZXI6IHBhcGVyLkl0ZW0pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gISFQYXBlckhlbHBlcnMuZmluZFNlbGZPckFuY2VzdG9yKGl0ZW0sIHBhID0+IHBhID09PSBjb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmREcmFnSGFuZGxlcihpdGVtOiBwYXBlci5JdGVtKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kU2VsZk9yQW5jZXN0b3IoXHJcbiAgICAgICAgICAgIGl0ZW0sIFxyXG4gICAgICAgICAgICBwYSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWIgPSBwYS5tb3VzZUJlaGF2aW9yO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKG1iICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKG1iLm9uRHJhZ1N0YXJ0IHx8IG1iLm9uRHJhZ01vdmUgfHwgbWIub25EcmFnRW5kKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBmaW5kT3ZlckhhbmRsZXIoaXRlbTogcGFwZXIuSXRlbSk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHJldHVybiBQYXBlckhlbHBlcnMuZmluZFNlbGZPckFuY2VzdG9yKFxyXG4gICAgICAgICAgICBpdGVtLCBcclxuICAgICAgICAgICAgcGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1iID0gcGEubW91c2VCZWhhdmlvcjtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhIShtYiAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChtYi5vbk92ZXJTdGFydCB8fCBtYi5vbk92ZXJNb3ZlIHx8IG1iLm9uT3ZlckVuZCApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFBhcGVySGVscGVycyB7XHJcblxyXG4gICAgc3RhdGljIGltcG9ydE9wZW5UeXBlUGF0aChvcGVuUGF0aDogb3BlbnR5cGUuUGF0aCk6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgob3BlblBhdGgudG9QYXRoRGF0YSgpKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBsZXQgc3ZnID0gb3BlblBhdGgudG9TVkcoNCk7XHJcbiAgICAgICAgLy8gcmV0dXJuIDxwYXBlci5QYXRoPnBhcGVyLnByb2plY3QuaW1wb3J0U1ZHKHN2Zyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRyYWNlUGF0aEl0ZW0ocGF0aDogcGFwZXIuUGF0aEl0ZW0sIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLlBhdGhJdGVtIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNlQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdHJhY2VDb21wb3VuZFBhdGgocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5Db21wb3VuZFBhdGgge1xyXG4gICAgICAgIGlmICghcGF0aC5jaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwYXRocyA9IHBhdGguY2hpbGRyZW4ubWFwKHAgPT5cclxuICAgICAgICAgICAgdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cCwgcG9pbnRzUGVyUGF0aCkpO1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHtcclxuICAgICAgICAgICAgY2hpbGRyZW46IHBhdGhzLFxyXG4gICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdHJhY2VQYXRoKHBhdGg6IHBhcGVyLlBhdGgsIG51bVBvaW50czogbnVtYmVyKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgLy8gaWYoIXBhdGggfHwgIXBhdGguc2VnbWVudHMgfHwgcGF0aC5zZWdtZW50cy5sZW5ndGgpe1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gbmV3IHBhcGVyLlBhdGgoKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgbGV0IHBhdGhMZW5ndGggPSBwYXRoLmxlbmd0aDtcclxuICAgICAgICBsZXQgb2Zmc2V0SW5jciA9IHBhdGhMZW5ndGggLyBudW1Qb2ludHM7XHJcbiAgICAgICAgbGV0IHBvaW50cyA9IFtdO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGkrKyA8IG51bVBvaW50cykge1xyXG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBwYXRoLmdldFBvaW50QXQoTWF0aC5taW4ob2Zmc2V0LCBwYXRoTGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IG9mZnNldEluY3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlBhdGgoe1xyXG4gICAgICAgICAgICBzZWdtZW50czogcG9pbnRzLFxyXG4gICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2FuZHdpY2hQYXRoUHJvamVjdGlvbih0b3BQYXRoOiBwYXBlci5DdXJ2ZWxpa2UsIGJvdHRvbVBhdGg6IHBhcGVyLkN1cnZlbGlrZSlcclxuICAgICAgICA6ICh1bml0UG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgY29uc3QgdG9wUGF0aExlbmd0aCA9IHRvcFBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGJvdHRvbVBhdGhMZW5ndGggPSBib3R0b21QYXRoLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24odW5pdFBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICAgICAgbGV0IHRvcFBvaW50ID0gdG9wUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogdG9wUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGxldCBib3R0b21Qb2ludCA9IGJvdHRvbVBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIGJvdHRvbVBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgICBpZiAodG9wUG9pbnQgPT0gbnVsbCB8fCBib3R0b21Qb2ludCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcImNvdWxkIG5vdCBnZXQgcHJvamVjdGVkIHBvaW50IGZvciB1bml0IHBvaW50IFwiICsgdW5pdFBvaW50LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRvcFBvaW50LmFkZChib3R0b21Qb2ludC5zdWJ0cmFjdCh0b3BQb2ludCkubXVsdGlwbHkodW5pdFBvaW50LnkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1hcmtlckdyb3VwOiBwYXBlci5Hcm91cDtcclxuXHJcbiAgICBzdGF0aWMgcmVzZXRNYXJrZXJzKCl7XHJcbiAgICAgICAgaWYoUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwKXtcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAub3BhY2l0eSA9IDAuMjtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyTGluZShhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQpOiBwYXBlci5JdGVte1xyXG4gICAgICAgIGxldCBsaW5lID0gcGFwZXIuUGF0aC5MaW5lKGEsYik7XHJcbiAgICAgICAgbGluZS5zdHJva2VDb2xvciA9ICdncmVlbic7XHJcbiAgICAgICAgLy9saW5lLmRhc2hBcnJheSA9IFs1LCA1XTtcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobGluZSk7XHJcbiAgICAgICAgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1hcmtlcihwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICBsZXQgbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvaW50LCAyKTtcclxuICAgICAgICBtYXJrZXIuc3Ryb2tlQ29sb3IgPSAncmVkJztcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobWFya2VyKTtcclxuICAgICAgICByZXR1cm4gbWFya2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzaW1wbGlmeShwYXRoOiBwYXBlci5QYXRoSXRlbSwgdG9sZXJhbmNlPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5zaW1wbGlmeSg8cGFwZXIuUGF0aEl0ZW0+cCwgdG9sZXJhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICg8cGFwZXIuUGF0aD5wYXRoKS5zaW1wbGlmeSh0b2xlcmFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgc2VsZiBvciBuZWFyZXN0IGFuY2VzdG9yIHNhdGlzZnlpbmcgdGhlIHByZWRpY2F0ZS5cclxuICAgICAqLyAgICBcclxuICAgIHN0YXRpYyBmaW5kU2VsZk9yQW5jZXN0b3IoaXRlbTogcGFwZXIuSXRlbSwgcHJlZGljYXRlOiAoaTogcGFwZXIuSXRlbSkgPT4gYm9vbGVhbil7XHJcbiAgICAgICAgaWYocHJlZGljYXRlKGl0ZW0pKXtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQYXBlckhlbHBlcnMuZmluZEFuY2VzdG9yKGl0ZW0sIHByZWRpY2F0ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogRmluZCBuZWFyZXN0IGFuY2VzdG9yIHNhdGlzZnlpbmcgdGhlIHByZWRpY2F0ZS5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGZpbmRBbmNlc3RvcihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKXtcclxuICAgICAgICBpZighaXRlbSl7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJpb3I6IHBhcGVyLkl0ZW07XHJcbiAgICAgICAgbGV0IGNoZWNraW5nID0gaXRlbS5wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUoY2hlY2tpbmcgJiYgY2hlY2tpbmcgIT09IHByaW9yKXtcclxuICAgICAgICAgICAgaWYocHJlZGljYXRlKGNoZWNraW5nKSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hlY2tpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJpb3IgPSBjaGVja2luZztcclxuICAgICAgICAgICAgY2hlY2tpbmcgPSBjaGVja2luZy5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBjb3JuZXJzIG9mIHRoZSByZWN0LCBjbG9ja3dpc2Ugc3RhcnRpbmcgZnJvbSB0b3BMZWZ0XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb3JuZXJzKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSk6IHBhcGVyLlBvaW50W117XHJcbiAgICAgICAgcmV0dXJuIFtyZWN0LnRvcExlZnQsIHJlY3QudG9wUmlnaHQsIHJlY3QuYm90dG9tUmlnaHQsIHJlY3QuYm90dG9tTGVmdF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogdGhlIG1pZHBvaW50IGJldHdlZW4gdHdvIHBvaW50c1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbWlkcG9pbnQoYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50KXtcclxuICAgICAgICByZXR1cm4gYi5zdWJ0cmFjdChhKS5kaXZpZGUoMikuYWRkKGEpO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFBhdGhTZWN0aW9uIGltcGxlbWVudHMgcGFwZXIuQ3VydmVsaWtlIHtcclxuICAgIHBhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICBvZmZzZXQ6IG51bWJlcjtcclxuICAgIGxlbmd0aDogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBwYXBlci5QYXRoLCBvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFBvaW50QXQob2Zmc2V0OiBudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhdGguZ2V0UG9pbnRBdChvZmZzZXQgKyB0aGlzLm9mZnNldCk7XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgUGF0aFRyYW5zZm9ybSB7XHJcbiAgICBwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludFRyYW5zZm9ybSA9IHBvaW50VHJhbnNmb3JtO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludFRyYW5zZm9ybShwb2ludCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aEl0ZW0ocGF0aDogcGFwZXIuUGF0aEl0ZW0pIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1Db21wb3VuZFBhdGgocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aChwYXRoOiBwYXBlci5QYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiBwYXRoLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBvcmlnUG9pbnQgPSBzZWdtZW50LnBvaW50O1xyXG4gICAgICAgICAgICBsZXQgbmV3UG9pbnQgPSB0aGlzLnRyYW5zZm9ybVBvaW50KHNlZ21lbnQucG9pbnQpO1xyXG4gICAgICAgICAgICBvcmlnUG9pbnQueCA9IG5ld1BvaW50Lng7XHJcbiAgICAgICAgICAgIG9yaWdQb2ludC55ID0gbmV3UG9pbnQueTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuIiwiXHJcbmNsYXNzIFNlZ21lbnRIYW5kbGUgZXh0ZW5kcyBwYXBlci5TaGFwZSB7XHJcbiBcclxuICAgIHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XHJcbiAgICBvbkRyYWdTdGFydDogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbkNoYW5nZUNvbXBsZXRlOiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfc21vb3RoZWQ6IGJvb2xlYW47XHJcbiBcclxuICAgIGNvbnN0cnVjdG9yKHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQsIHJhZGl1cz86IG51bWJlcil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNlZ21lbnQgPSBzZWdtZW50O1xyXG5cclxuICAgICAgICBsZXQgc2VsZiA9IDxhbnk+dGhpcztcclxuICAgICAgICBzZWxmLl90eXBlID0gJ2NpcmNsZSc7XHJcbiAgICAgICAgc2VsZi5fcmFkaXVzID0gMTU7XHJcbiAgICAgICAgc2VsZi5fc2l6ZSA9IG5ldyBwYXBlci5TaXplKHNlbGYuX3JhZGl1cyAqIDIpO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRlKHNlZ21lbnQucG9pbnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSAyO1xyXG4gICAgICAgIHRoaXMuc3Ryb2tlQ29sb3IgPSAnYmx1ZSc7XHJcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eSA9IDAuNzsgXHJcblxyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IDxNb3VzZUJlaGF2aW9yPntcclxuICAgICAgICAgICAgb25EcmFnU3RhcnQ6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICBpZih0aGlzLm9uRHJhZ1N0YXJ0KXtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5vbkRyYWdTdGFydChldmVudCk7XHJcbiAgICAgICAgICAgICAgfSAgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ01vdmU6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdQb3MgPSB0aGlzLnBvc2l0aW9uLmFkZChldmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3UG9zO1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5wb2ludCA9IG5ld1BvcztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnRW5kOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9zbW9vdGhlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkNoYW5nZUNvbXBsZXRlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbmdlQ29tcGxldGUoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkNsaWNrOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNtb290aGVkID0gIXRoaXMuc21vb3RoZWQ7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uQ2hhbmdlQ29tcGxldGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DaGFuZ2VDb21wbGV0ZShldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBzbW9vdGhlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc21vb3RoZWQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldCBzbW9vdGhlZCh2YWx1ZTogYm9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5fc21vb3RoZWQgPSB2YWx1ZTtcclxuICAgICAgICBcclxuICAgICAgICBpZih2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50LmhhbmRsZU91dCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoeVBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgc291cmNlUGF0aDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgZGlzcGxheVBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIGFycmFuZ2VkUGF0aDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgY29ybmVyczogcGFwZXIuU2VnbWVudFtdO1xyXG4gICAgb3V0bGluZTogcGFwZXIuUGF0aDtcclxuICAgIHNoYXBlQ2hhbmdlZDogYm9vbGVhbjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfb3B0aW9uczogU3RyZXRjaHlQYXRoT3B0aW9uczsgICAgXHJcbiAgICBcclxuICAgIHN0YXRpYyBPVVRMSU5FX1BPSU5UUyA9IDIzMDtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3IgcmVidWlsZGluZyB0aGUgbWlkcG9pbnQgaGFuZGxlc1xyXG4gICAgICogYXMgb3V0bGluZSBjaGFuZ2VzLlxyXG4gICAgICovXHJcbiAgICBtaWRwb2ludEdyb3VwOiBwYXBlci5Hcm91cDtcclxuICAgIHNlZ21lbnRNYXJrZXJzR3JvdXA6IHBhcGVyLkdyb3VwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZVBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCwgb3B0aW9ucz86IFN0cmV0Y2h5UGF0aE9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB8fCA8U3RyZXRjaHlQYXRoT3B0aW9ucz57XHJcbiAgICAgICAgICAgIHBhdGhGaWxsQ29sb3I6ICdncmF5J1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UGF0aChzb3VyY2VQYXRoKTtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMuY3JlYXRlT3V0bGluZSgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlU2VnbWVudE1hcmtlcnMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1pZHBpb250TWFya2VycygpO1xyXG4gICAgICAgIHRoaXMuc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eShmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLm1vdXNlQmVoYXZpb3IgPSB7XHJcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnU3RhcnQ6ICgpID0+IHRoaXMuYnJpbmdUb0Zyb250KCksXHJcbiAgICAgICAgICAgIG9uRHJhZ01vdmU6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKGV2ZW50LmRlbHRhKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25PdmVyU3RhcnQ6ICgpID0+IHRoaXMuc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eSh0cnVlKSxcclxuICAgICAgICAgICAgb25PdmVyRW5kOiAoKSA9PiB0aGlzLnNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkoZmFsc2UpXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgb3B0aW9ucygpIDogU3RyZXRjaHlQYXRoT3B0aW9ucyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG9wdGlvbnModmFsdWU6IFN0cmV0Y2h5UGF0aE9wdGlvbnMpe1xyXG4gICAgICAgIGlmKCF2YWx1ZSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQmFja2dyb3VuZENvbG9yKCk7XHJcbiAgICAgICAgaWYodGhpcy5hcnJhbmdlZFBhdGgpe1xyXG4gICAgICAgICAgICB0aGlzLmFycmFuZ2VkUGF0aC5maWxsQ29sb3IgPSB2YWx1ZS5wYXRoRmlsbENvbG9yO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCl7XHJcbiAgICAgICAgdGhpcy5zZXRQYXRoKHBhdGgpO1xyXG4gICAgICAgIGlmKCF0aGlzLnNoYXBlQ2hhbmdlZCl7XHJcbiAgICAgICAgICAgIHRoaXMub3V0bGluZS5ib3VuZHMuc2l6ZSA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMuc2l6ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVNaWRwaW9udE1hcmtlcnMoKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWdtZW50TWFya2VycygpOyAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCl7XHJcbiAgICAgICAgaWYodGhpcy5zb3VyY2VQYXRoKXtcclxuICAgICAgICAgICAgdGhpcy5zb3VyY2VQYXRoLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNvdXJjZVBhdGggPSBwYXRoO1xyXG4gICAgICAgIHBhdGgudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkodmFsdWU6IGJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMuc2VnbWVudE1hcmtlcnNHcm91cC52aXNpYmxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwLnZpc2libGUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm91dGxpbmUuc3Ryb2tlQ29sb3IgPSB2YWx1ZSA/ICdsaWdodGdyYXknIDogbnVsbDsgXHJcbiAgICB9XHJcblxyXG4gICAgYXJyYW5nZUNvbnRlbnRzKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWlkcGlvbnRNYXJrZXJzKCk7XHJcbiAgICAgICAgdGhpcy5hcnJhbmdlUGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFycmFuZ2VQYXRoKCkge1xyXG4gICAgICAgIGxldCBvcnRoT3JpZ2luID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgIGxldCBvcnRoV2lkdGggPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzLndpZHRoO1xyXG4gICAgICAgIGxldCBvcnRoSGVpZ2h0ID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IHNpZGVzID0gdGhpcy5nZXRPdXRsaW5lU2lkZXMoKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdG9wID0gc2lkZXNbMF07XHJcbiAgICAgICAgbGV0IGJvdHRvbSA9IHNpZGVzWzJdO1xyXG4gICAgICAgIGJvdHRvbS5yZXZlcnNlKCk7XHJcbiAgICAgICAgbGV0IHByb2plY3Rpb24gPSBQYXBlckhlbHBlcnMuc2FuZHdpY2hQYXRoUHJvamVjdGlvbih0b3AsIGJvdHRvbSk7XHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlbGF0aXZlID0gcG9pbnQuc3VidHJhY3Qob3J0aE9yaWdpbik7XHJcbiAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpdmUueCAvIG9ydGhXaWR0aCxcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnkgLyBvcnRoSGVpZ2h0KTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0ZWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgc2lkZSBvZiBzaWRlcyl7XHJcbiAgICAgICAgICAgIHNpZGUucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBuZXdQYXRoID0gUGFwZXJIZWxwZXJzLnRyYWNlQ29tcG91bmRQYXRoKHRoaXMuc291cmNlUGF0aCwgXHJcbiAgICAgICAgICAgIFN0cmV0Y2h5UGF0aC5PVVRMSU5FX1BPSU5UUyk7XHJcbiAgICAgICAgbmV3UGF0aC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBuZXdQYXRoLmZpbGxDb2xvciA9IHRoaXMub3B0aW9ucy5wYXRoRmlsbENvbG9yO1xyXG4gICAgICAgIHRoaXMuYXJyYW5nZWRQYXRoID0gbmV3UGF0aDtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnVwZGF0ZUJhY2tncm91bmRDb2xvcigpO1xyXG5cclxuICAgICAgICB0cmFuc2Zvcm0udHJhbnNmb3JtUGF0aEl0ZW0obmV3UGF0aCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc3BsYXlQYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheVBhdGgucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpc3BsYXlQYXRoID0gbmV3UGF0aDtcclxuICAgICAgICB0aGlzLmluc2VydENoaWxkKDEsIG5ld1BhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0T3V0bGluZVNpZGVzKCk6IHBhcGVyLlBhdGhbXSB7XHJcbiAgICAgICAgbGV0IHNpZGVzOiBwYXBlci5QYXRoW10gPSBbXTtcclxuICAgICAgICBsZXQgc2VnbWVudEdyb3VwOiBwYXBlci5TZWdtZW50W10gPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY29ybmVyUG9pbnRzID0gdGhpcy5jb3JuZXJzLm1hcChjID0+IGMucG9pbnQpO1xyXG4gICAgICAgIGxldCBmaXJzdCA9IGNvcm5lclBvaW50cy5zaGlmdCgpOyBcclxuICAgICAgICBjb3JuZXJQb2ludHMucHVzaChmaXJzdCk7XHJcblxyXG4gICAgICAgIGxldCB0YXJnZXRDb3JuZXIgPSBjb3JuZXJQb2ludHMuc2hpZnQoKTtcclxuICAgICAgICBsZXQgc2VnbWVudExpc3QgPSB0aGlzLm91dGxpbmUuc2VnbWVudHMubWFwKHggPT4geCk7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIHNlZ21lbnRMaXN0LnB1c2goc2VnbWVudExpc3RbMF0pO1xyXG4gICAgICAgIGZvcihsZXQgc2VnbWVudCBvZiBzZWdtZW50TGlzdCl7XHJcbiAgICAgICAgICAgIHNlZ21lbnRHcm91cC5wdXNoKHNlZ21lbnQpO1xyXG4gICAgICAgICAgICBpZih0YXJnZXRDb3JuZXIuaXNDbG9zZShzZWdtZW50LnBvaW50LCBwYXBlci5OdW1lcmljYWwuRVBTSUxPTikpIHtcclxuICAgICAgICAgICAgICAgIC8vIGZpbmlzaCBwYXRoXHJcbiAgICAgICAgICAgICAgICBzaWRlcy5wdXNoKG5ldyBwYXBlci5QYXRoKHNlZ21lbnRHcm91cCkpO1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudEdyb3VwID0gW3NlZ21lbnRdO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Q29ybmVyID0gY29ybmVyUG9pbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZihzaWRlcy5sZW5ndGggIT09IDQpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdzaWRlcycsIHNpZGVzKTtcclxuICAgICAgICAgICAgdGhyb3cgJ2ZhaWxlZCB0byBnZXQgc2lkZXMnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc2lkZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgY3JlYXRlT3V0bGluZSgpIHtcclxuICAgICAgICBsZXQgYm91bmRzID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcztcclxuICAgICAgICBsZXQgb3V0bGluZSA9IG5ldyBwYXBlci5QYXRoKFxyXG4gICAgICAgICAgICBQYXBlckhlbHBlcnMuY29ybmVycyh0aGlzLnNvdXJjZVBhdGguYm91bmRzKSk7XHJcblxyXG4gICAgICAgIG91dGxpbmUuY2xvc2VkID0gdHJ1ZTtcclxuICAgICAgICBvdXRsaW5lLmRhc2hBcnJheSA9IFs1LCA1XTtcclxuICAgICAgICB0aGlzLm91dGxpbmUgPSBvdXRsaW5lO1xyXG5cclxuICAgICAgICAvLyB0cmFjayBjb3JuZXJzIHNvIHdlIGtub3cgaG93IHRvIGFycmFuZ2UgdGhlIHRleHRcclxuICAgICAgICB0aGlzLmNvcm5lcnMgPSBvdXRsaW5lLnNlZ21lbnRzLm1hcChzID0+IHMpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENoaWxkKG91dGxpbmUpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQmFja2dyb3VuZENvbG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVCYWNrZ3JvdW5kQ29sb3IoKXtcclxuICAgICAgICBpZih0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmJhY2tncm91bmRDb2xvcil7XHJcbiAgICAgICAgICAgIHRoaXMub3V0bGluZS5maWxsQ29sb3IgPSB0aGlzLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICB0aGlzLm91dGxpbmUub3BhY2l0eSA9IC45OyAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm91dGxpbmUuZmlsbENvbG9yID0gJ3doaXRlJztcclxuICAgICAgICAgICAgdGhpcy5vdXRsaW5lLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNlZ21lbnRNYXJrZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMuc2VnbWVudE1hcmtlcnNHcm91cCl7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudE1hcmtlcnNHcm91cC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGJvdW5kcyA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHM7XHJcbiAgICAgICAgdGhpcy5zZWdtZW50TWFya2Vyc0dyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiB0aGlzLm91dGxpbmUuc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgbGV0IGhhbmRsZSA9IG5ldyBTZWdtZW50SGFuZGxlKHNlZ21lbnQpO1xyXG4gICAgICAgICAgICBoYW5kbGUub25EcmFnU3RhcnQgPSAoKSA9PiB0aGlzLnNoYXBlQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbkNoYW5nZUNvbXBsZXRlID0gKCkgPT4gdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50TWFya2Vyc0dyb3VwLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5zZWdtZW50TWFya2Vyc0dyb3VwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSB1cGRhdGVNaWRwaW9udE1hcmtlcnMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5taWRwb2ludEdyb3VwKXtcclxuICAgICAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICB0aGlzLm91dGxpbmUuY3VydmVzLmZvckVhY2goY3VydmUgPT4ge1xyXG4gICAgICAgICAgICAvLyBza2lwIGxlZnQgYW5kIHJpZ2h0IHNpZGVzXHJcbiAgICAgICAgICAgIGlmKGN1cnZlLnNlZ21lbnQxID09PSB0aGlzLmNvcm5lcnNbMV1cclxuICAgICAgICAgICAgICAgIHx8IGN1cnZlLnNlZ21lbnQxID09PSB0aGlzLmNvcm5lcnNbM10pe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjsgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGhhbmRsZSA9IG5ldyBDdXJ2ZVNwbGl0dGVySGFuZGxlKGN1cnZlKTtcclxuICAgICAgICAgICAgaGFuZGxlLm9uRHJhZ1N0YXJ0ID0gKCkgPT4gdGhpcy5zaGFwZUNoYW5nZWQgPSB0cnVlOyBcclxuICAgICAgICAgICAgaGFuZGxlLm9uRHJhZ0VuZCA9IChuZXdTZWdtZW50LCBldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld0hhbmRsZSA9IG5ldyBTZWdtZW50SGFuZGxlKG5ld1NlZ21lbnQpO1xyXG4gICAgICAgICAgICAgICAgbmV3SGFuZGxlLm9uQ2hhbmdlQ29tcGxldGUgPSAoKSA9PiB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWdtZW50TWFya2Vyc0dyb3VwLmFkZENoaWxkKG5ld0hhbmRsZSk7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGUucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAuYWRkQ2hpbGQoaGFuZGxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMubWlkcG9pbnRHcm91cCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBTdHJldGNoeVBhdGhPcHRpb25zIHtcclxuICAgIHBhdGhGaWxsQ29sb3I6IHN0cmluZztcclxuICAgIGJhY2tncm91bmRDb2xvcjogc3RyaW5nO1xyXG59XHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoeVRleHQgZXh0ZW5kcyBTdHJldGNoeVBhdGgge1xyXG5cclxuICAgIGZmb250OiBvcGVudHlwZS5Gb250O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IG9wZW50eXBlLkZvbnQsIG9wdGlvbnM6IFN0cmV0Y2h5VGV4dE9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihTdHJldGNoeVRleHQuZ2V0VGV4dFBhdGgoZm9udCwgb3B0aW9ucyksIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuZmZvbnQgPSBmb250O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUob3B0aW9uczogU3RyZXRjaHlUZXh0T3B0aW9ucyl7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICBzdXBlci51cGRhdGVQYXRoKFN0cmV0Y2h5VGV4dC5nZXRUZXh0UGF0aCh0aGlzLmZmb250LCBvcHRpb25zKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBnZXRUZXh0UGF0aChmb250OiBvcGVudHlwZS5Gb250LCBvcHRpb25zOiBTdHJldGNoeVRleHRPcHRpb25zKXtcclxuICAgICAgICBsZXQgb3BlblR5cGVQYXRoID0gZm9udC5nZXRQYXRoKFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy50ZXh0LCBcclxuICAgICAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmZvbnRTaXplIHx8IDMyKTtcclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmltcG9ydE9wZW5UeXBlUGF0aChvcGVuVHlwZVBhdGgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgU3RyZXRjaHlUZXh0T3B0aW9ucyBleHRlbmRzIFN0cmV0Y2h5UGF0aE9wdGlvbnMge1xyXG4gICAgdGV4dDogc3RyaW5nO1xyXG4gICAgZm9udFNpemU6IG51bWJlcjtcclxufVxyXG4iLCJcclxuLyoqXHJcbiAqIE1lYXN1cmVzIG9mZnNldHMgb2YgdGV4dCBnbHlwaHMuXHJcbiAqL1xyXG5jbGFzcyBUZXh0UnVsZXIge1xyXG4gICAgXHJcbiAgICBmb250RmFtaWx5OiBzdHJpbmc7XHJcbiAgICBmb250V2VpZ2h0OiBudW1iZXI7XHJcbiAgICBmb250U2l6ZTogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCAodGV4dCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XHJcbiAgICAgICAgcG9pbnRUZXh0LmNvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgIHBvaW50VGV4dC5qdXN0aWZpY2F0aW9uID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBpZih0aGlzLmZvbnRGYW1pbHkpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udEZhbWlseSA9IHRoaXMuZm9udEZhbWlseTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5mb250V2VpZ2h0KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRXZWlnaHQgPSB0aGlzLmZvbnRXZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFNpemUpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcG9pbnRUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRleHRPZmZzZXRzKHRleHQpe1xyXG4gICAgICAgIC8vIE1lYXN1cmUgZ2x5cGhzIGluIHBhaXJzIHRvIGNhcHR1cmUgd2hpdGUgc3BhY2UuXHJcbiAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxyXG4gICAgICAgIHZhciBnbHlwaFBhaXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpKzEpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRm9yIGVhY2ggY2hhcmFjdGVyLCBmaW5kIGNlbnRlciBvZmZzZXQuXHJcbiAgICAgICAgdmFyIHhPZmZzZXRzID0gWzBdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gTWVhc3VyZSB0aHJlZSBjaGFyYWN0ZXJzIGF0IGEgdGltZSB0byBnZXQgdGhlIGFwcHJvcHJpYXRlIFxyXG4gICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxyXG4gICAgICAgICAgICB2YXIgdHJpYWRUZXh0ID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSAtIDEsIGkgKyAxKSk7XHJcbiAgICAgICAgICAgIHRyaWFkVGV4dC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXHJcbiAgICAgICAgICAgIC8vICAgYW5kIGhhbGYgb2YgY3VycmVudCBnbHlwaCBwYWlyLlxyXG4gICAgICAgICAgICAvLyBNdXN0IGJlIHJpZ2h0LCBiZWNhdXNlIGl0IHdvcmtzLlxyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2kgLSAxXS5ib3VuZHMud2lkdGggLyAyIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHdpZHRoIHRvIHByaW9yIG9mZnNldC4gXHJcbiAgICAgICAgICAgIHhPZmZzZXRzW2ldID0geE9mZnNldHNbaSAtIDFdICsgb2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgZ2x5cGhQYWlyIG9mIGdseXBoUGFpcnMpe1xyXG4gICAgICAgICAgICBnbHlwaFBhaXIucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB4T2Zmc2V0cztcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgVmlld1pvb20ge1xyXG5cclxuICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcbiAgICBmYWN0b3IgPSAxLjI1O1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9taW5ab29tOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9tYXhab29tOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvamVjdDogcGFwZXIuUHJvamVjdCkge1xyXG4gICAgICAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuXHJcbiAgICAgICAgKDxhbnk+JCh2aWV3LmVsZW1lbnQpKS5tb3VzZXdoZWVsKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbW91c2VQb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludChldmVudC5vZmZzZXRYLCBldmVudC5vZmZzZXRZKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2Vab29tQ2VudGVyZWQoZXZlbnQuZGVsdGFZLCBtb3VzZVBvc2l0aW9uKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgem9vbSgpOiBudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvamVjdC52aWV3Lnpvb207XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHpvb21SYW5nZSgpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLl9taW5ab29tLCB0aGlzLl9tYXhab29tXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB6b29tIGxldmVsLlxyXG4gICAgICogQHJldHVybnMgem9vbSBsZXZlbCB0aGF0IHdhcyBzZXQsIG9yIG51bGwgaWYgaXQgd2FzIG5vdCBjaGFuZ2VkXHJcbiAgICAgKi9cclxuICAgIHNldFpvb21Db25zdHJhaW5lZCh6b29tOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGlmKHRoaXMuX21pblpvb20pIHtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWF4KHpvb20sIHRoaXMuX21pblpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9tYXhab29tKXtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWluKHpvb20sIHRoaXMuX21heFpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGlmKHpvb20gIT0gdmlldy56b29tKXtcclxuICAgICAgICAgICAgdmlldy56b29tID0gem9vbTtcclxuICAgICAgICAgICAgcmV0dXJuIHpvb207XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFpvb21SYW5nZShyYW5nZTogcGFwZXIuU2l6ZVtdKTogbnVtYmVyW10ge1xyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgbGV0IGFTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICBsZXQgYlNpemUgPSByYW5nZS5zaGlmdCgpO1xyXG4gICAgICAgIGxldCBhID0gYVNpemUgJiYgTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBhU2l6ZS5oZWlnaHQsICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYVNpemUud2lkdGgpO1xyXG4gICAgICAgIGxldCBiID0gYlNpemUgJiYgTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBiU2l6ZS5oZWlnaHQsICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYlNpemUud2lkdGgpO1xyXG4gICAgICAgIGxldCBtaW4gPSBNYXRoLm1pbihhLGIpO1xyXG4gICAgICAgIGlmKG1pbil7XHJcbiAgICAgICAgICAgIHRoaXMuX21pblpvb20gPSBtaW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBtYXggPSBNYXRoLm1heChhLGIpO1xyXG4gICAgICAgIGlmKG1heCl7XHJcbiAgICAgICAgICAgIHRoaXMuX21heFpvb20gPSBtYXg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlWm9vbUNlbnRlcmVkKGRlbHRhWTogbnVtYmVyLCBtb3VzZVBvczogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICBpZiAoIWRlbHRhWSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgbGV0IG9sZFpvb20gPSB2aWV3Lnpvb207XHJcbiAgICAgICAgbGV0IG9sZENlbnRlciA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgIGxldCB2aWV3UG9zID0gdmlldy52aWV3VG9Qcm9qZWN0KG1vdXNlUG9zKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbmV3Wm9vbSA9IGRlbHRhWSA+IDBcclxuICAgICAgICAgICAgPyB2aWV3Lnpvb20gKiB0aGlzLmZhY3RvclxyXG4gICAgICAgICAgICA6IHZpZXcuem9vbSAvIHRoaXMuZmFjdG9yO1xyXG4gICAgICAgIG5ld1pvb20gPSB0aGlzLnNldFpvb21Db25zdHJhaW5lZChuZXdab29tKTtcclxuICAgICAgICBcclxuICAgICAgICBpZighbmV3Wm9vbSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB6b29tU2NhbGUgPSBvbGRab29tIC8gbmV3Wm9vbTtcclxuICAgICAgICBsZXQgY2VudGVyQWRqdXN0ID0gdmlld1Bvcy5zdWJ0cmFjdChvbGRDZW50ZXIpO1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSB2aWV3UG9zLnN1YnRyYWN0KGNlbnRlckFkanVzdC5tdWx0aXBseSh6b29tU2NhbGUpKVxyXG4gICAgICAgICAgICAuc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuXHJcbiAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LmNlbnRlci5hZGQob2Zmc2V0KTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHpvb21UbyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpe1xyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgdmlldy5jZW50ZXIgPSByZWN0LmNlbnRlcjtcclxuICAgICAgICB2aWV3Lnpvb20gPSBNYXRoLm1pbiggXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIHJlY3QuaGVpZ2h0LCAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIHJlY3Qud2lkdGgpICogMC45NTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgV29ya3NwYWNlIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG4gICAgXHJcbiAgICBkZWZhdWx0QmFja2dyb3VuZENvbG9yID0gJyNmZGZkZmQnO1xyXG4gICAgXHJcbiAgICBzaGVldDogcGFwZXIuU2hhcGU7XHJcbiAgICBcclxuICAgIGdldCBiYWNrZ3JvdW5kQ29sb3IoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zaGVldC5maWxsQ29sb3IudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IGJhY2tncm91bmRDb2xvcih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zaGVldC5maWxsQ29sb3IgPSB2YWx1ZSB8fCB0aGlzLmRlZmF1bHRCYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHNpemU6IHBhcGVyLlNpemUpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNoZWV0ID0gcGFwZXIuU2hhcGUuUmVjdGFuZ2xlKFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMCwwKSwgc2l6ZSk7XHJcbiAgICAgICAgc2hlZXQuc3R5bGUuc2hhZG93Q29sb3IgPSAnZ3JheSc7IFxyXG4gICAgICAgIHNoZWV0LnN0eWxlLnNoYWRvd0JsdXIgPSA2O1xyXG4gICAgICAgIHNoZWV0LnN0eWxlLnNoYWRvd09mZnNldCA9IG5ldyBwYXBlci5Qb2ludCg1LCA1KVxyXG4gICAgICAgIHRoaXMuc2hlZXQgPSBzaGVldDtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKHNoZWV0KTtcclxuXHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmRlZmF1bHRCYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0gPE1vdXNlQmVoYXZpb3I+IHtcclxuICAgICAgICAgICAgb25DbGljazogZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwYXBlci5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRHJhZ01vdmU6IGUgPT4gdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKGUuZGVsdGEpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFdvcmtzcGFjZUNvbnRyb2xsZXIge1xyXG5cclxuICAgIGRlZmF1bHRTaXplID0gbmV3IHBhcGVyLlNpemUoNDAwMCwgMzAwMCk7XHJcblxyXG4gICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHdvcmtzcGFjZTogV29ya3NwYWNlO1xyXG4gICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuICAgIGZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBjaGFubmVsczogQ2hhbm5lbHM7XHJcbiAgICBwcml2YXRlIF9za2V0Y2g6IFNrZXRjaDtcclxuICAgIHByaXZhdGUgX3RleHRCbG9ja0l0ZW1zOiB7IFt0ZXh0QmxvY2tJZDogc3RyaW5nXTogU3RyZXRjaHlUZXh0OyB9ID0ge307XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2hhbm5lbHM6IENoYW5uZWxzLCBmb250OiBvcGVudHlwZS5Gb250KSB7XHJcbiAgICAgICAgdGhpcy5jaGFubmVscyA9IGNoYW5uZWxzO1xyXG4gICAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgcGFwZXIuc2V0dGluZ3MuaGFuZGxlU2l6ZSA9IDE7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluQ2FudmFzJyk7XHJcbiAgICAgICAgcGFwZXIuc2V0dXAodGhpcy5jYW52YXMpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdCA9IHBhcGVyLnByb2plY3Q7XHJcblxyXG4gICAgICAgIGNvbnN0IG1vdXNlVG9vbCA9IG5ldyBNb3VzZUJlaGF2aW9yVG9vbCh0aGlzLnByb2plY3QpO1xyXG4gICAgICAgIG1vdXNlVG9vbC5vblRvb2xNb3VzZURvd24gPSBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMuZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWQuZGlzcGF0Y2goe30pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBtb3VzZVpvb20gPSBuZXcgVmlld1pvb20odGhpcy5wcm9qZWN0KTtcclxuICAgICAgICB0aGlzLndvcmtzcGFjZSA9IG5ldyBXb3Jrc3BhY2UodGhpcy5kZWZhdWx0U2l6ZSk7XHJcbiAgICAgICAgbGV0IHNoZWV0Qm91bmRzID0gdGhpcy53b3Jrc3BhY2Uuc2hlZXQuYm91bmRzO1xyXG4gICAgICAgIG1vdXNlWm9vbS5zZXRab29tUmFuZ2UoXHJcbiAgICAgICAgICAgIFtzaGVldEJvdW5kcy5zY2FsZSgwLjAyKS5zaXplLCBzaGVldEJvdW5kcy5zY2FsZSgxLjEpLnNpemVdKTtcclxuICAgICAgICBtb3VzZVpvb20uem9vbVRvKHNoZWV0Qm91bmRzLnNjYWxlKDAuNSkpO1xyXG5cclxuICAgICAgICBjaGFubmVscy5ldmVudHMuc2tldGNoLmxvYWRlZC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NrZXRjaCA9IGV2LmRhdGE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmtzcGFjZS5iYWNrZ3JvdW5kQ29sb3IgPSBldi5kYXRhLmF0dHIuYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjaGFubmVscy5ldmVudHMuc2tldGNoLmF0dHJjaGFuZ2VkLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZXYgPT4gdGhpcy53b3Jrc3BhY2UuYmFja2dyb3VuZENvbG9yID0gZXYuZGF0YS5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjaGFubmVscy5ldmVudHMubWVyZ2VUeXBlZChcclxuICAgICAgICAgICAgY2hhbm5lbHMuZXZlbnRzLnRleHRibG9jay5hZGRlZCxcclxuICAgICAgICAgICAgY2hhbm5lbHMuZXZlbnRzLnRleHRibG9jay5jaGFuZ2VkXHJcbiAgICAgICAgKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGV2ID0+IHRoaXMudGV4dEJsb2NrUmVjZWl2ZWQoZXYuZGF0YSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRleHRCbG9ja1JlY2VpdmVkKHRleHRCbG9jazogVGV4dEJsb2NrKSB7XHJcblxyXG4gICAgICAgIGlmICghdGV4dEJsb2NrIHx8ICF0ZXh0QmxvY2sudGV4dCB8fCAhdGV4dEJsb2NrLnRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0ZXh0QmxvY2suX2lkKSB7XHJcbiAgICAgICAgICAgIHRleHRCbG9jay5faWQgPSBuZXdpZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgb3B0aW9ucyA9IDxTdHJldGNoeVRleHRPcHRpb25zPntcclxuICAgICAgICAgICAgdGV4dDogdGV4dEJsb2NrLnRleHQsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiAxMjgsXHJcbiAgICAgICAgICAgIHBhdGhGaWxsQ29sb3I6IHRleHRCbG9jay50ZXh0Q29sb3IgfHwgJ2JsYWNrJyxcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW3RleHRCbG9jay5faWRdO1xyXG4gICAgICAgIGlmICghaXRlbSkge1xyXG4gICAgICAgICAgICBpdGVtID0gbmV3IFN0cmV0Y2h5VGV4dCh0aGlzLmZvbnQsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgaXRlbS5vbkRvdWJsZUNsaWNrID0gZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWRpdG9yQXQgPSB0aGlzLnByb2plY3Qudmlldy5wcm9qZWN0VG9WaWV3KFxyXG4gICAgICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5taWRwb2ludChpdGVtLmJvdW5kcy50b3BMZWZ0LCBpdGVtLmJvdW5kcy5jZW50ZXIpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMuYWN0aW9ucy5za2V0Y2guc2V0RWRpdGluZ0l0ZW0uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtSWQ6IHRleHRCbG9jay5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRYOiBlZGl0b3JBdC54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRZOiBlZGl0b3JBdC55XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGl0ZW0uZGF0YSA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgIHRoaXMud29ya3NwYWNlLmFkZENoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLnBvaW50LmFkZChcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChpdGVtLmJvdW5kcy53aWR0aCAvIDIsIGl0ZW0uYm91bmRzLmhlaWdodCAvIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZCg1MCkpO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtc1t0ZXh0QmxvY2suX2lkXSA9IGl0ZW07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaXRlbS51cGRhdGUob3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcblxyXG5mdW5jdGlvbiBib290c3RyYXAoKSB7XHJcbiAgICBjb25zdCBjaGFubmVscyA9IG5ldyBDaGFubmVscygpO1xyXG4gICAgY29uc3QgYWN0aW9ucyA9IGNoYW5uZWxzLmFjdGlvbnMsIGV2ZW50cyA9IGNoYW5uZWxzLmV2ZW50cztcclxuXHJcbmFjdGlvbnMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coJ2FjdGlvbicsIHgpKTtcclxuZXZlbnRzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKCdldmVudCcsIHgpKTtcclxuXHJcbiAgICBjb25zdCByb290U3RvcmUgPSBuZXcgU3RvcmUoYWN0aW9ucywgZXZlbnRzKTtcclxuXHJcbiAgICBjb25zdCBza2V0Y2hFZGl0b3IgPSBuZXcgU2tldGNoRWRpdG9yKGFjdGlvbnMpOyBcclxuICAgIGNvbnN0IHNrZXRjaERvbSQgPSBldmVudHMubWVyZ2UoXHJcbiAgICAgICAgZXZlbnRzLnNrZXRjaC5sb2FkZWQsIGV2ZW50cy5za2V0Y2guYXR0cmNoYW5nZWQpXHJcbiAgICAgICAgLm1hcChtID0+IHNrZXRjaEVkaXRvci5yZW5kZXIobS5yb290RGF0YS5za2V0Y2gpKTtcclxuICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShza2V0Y2hEb20kLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduZXInKSk7XHJcblxyXG4gICAgLy8gY29uc3QgYmxvY2tFZGl0b3IgPSBuZXcgVGV4dEJsb2NrRWRpdG9yKGFjdGlvbnMpO1xyXG4gICAgLy8gY29uc3QgYmxvY2tFZGl0b3JEb20kID0gZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWRcclxuICAgIC8vICAgICAub2JzZXJ2ZSgpLm1hcCh0YiA9PiBibG9ja0VkaXRvci5yZW5kZXIodGIpKTtcclxuICAgIC8vIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShibG9ja0VkaXRvckRvbSQsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0QmxvY2tFZGl0b3InKSk7XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtRWRpdG9yID0gbmV3IFNlbGVjdGVkSXRlbUVkaXRvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRvck92ZXJsYXlcIiksIGNoYW5uZWxzKTtcclxuXHJcbiAgICBjb25zdCBkZXNpZ25lckNvbnRyb2xsZXIgPSBuZXcgRGVzaWduZXJDb250cm9sbGVyKGNoYW5uZWxzLCAoKSA9PiB7XHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guY3JlYXRlLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLmFkZC5kaXNwYXRjaCh7IHRleHQ6IFwiYm9vZ2VkeVwiIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmJvb3RzdHJhcCgpOyJdfQ==