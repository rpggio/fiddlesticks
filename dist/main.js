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
var BootScript;
(function (BootScript) {
    function dropdown(args) {
        return h("div.dropdown", [
            h("button.btn.btn-default.dropdown-toggle", {
                "attrs": {
                    id: args.id,
                    type: "button",
                    "data-toggle": "dropdown",
                    className: "btn btn-default dropdown-toggle"
                },
            }, [
                args.content,
                h("span.caret")
            ]),
            h("ul.dropdown-menu", {}, args.items.map(function (item) {
                return h("li", {
                    on: {
                        click: function (ev) { return item.onClick && item.onClick(); }
                    }
                }, [
                    h('a', {}, [item.content])
                ]);
            }))
        ]);
    }
    BootScript.dropdown = dropdown;
})(BootScript || (BootScript = {}));
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
        this.sketch = new Sketch();
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
            setEditingItem: this.topic("sketch.seteditingitem"),
            setSelection: this.topic("sketch.setselection"),
        };
        this.textBlock = {
            add: this.topic("textblock.add"),
            update: this.topic("textblock.update"),
            remove: this.topic("textblock.remove")
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
            editingItemChanged: this.topic("sketch.editingitemchanged"),
            selectionChanged: this.topic("sketch.selectionchanged"),
        };
        this.textblock = {
            added: this.topic("textblock.added"),
            changed: this.topic("textblock.changed"),
            removed: this.topic("textblock.removed")
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
        // ----- Sketch -----
        actions.sketch.create
            .subscribe(function (m) {
            _this.state.sketch = new Sketch();
            var attr = m.data || {};
            attr.backgroundColor = attr.backgroundColor || '#f6f3eb';
            _this.state.sketch.attr = attr;
            _this.events.sketch.loaded.dispatchContext(_this.state, _this.state.sketch);
        });
        actions.sketch.attrUpdate
            .subscribe(function (ev) {
            _this.assign(_this.state.sketch.attr, ev.data);
            _this.events.sketch.attrchanged.dispatchContext(_this.state, _this.state.sketch.attr);
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
        actions.sketch.setSelection.subscribe(function (m) {
            if (m.data.itemType && m.data.itemType !== "TextBlock") {
                throw "Unhandled type " + m.type;
            }
            _this.state.sketch.selection = {
                itemId: m.data.itemId,
                itemType: m.data.itemType,
                priorSelectionItemId: _this.state.sketch.selection
                    && _this.state.sketch.selection.itemId
            };
            events.sketch.selectionChanged.dispatch(_this.state.sketch.selection);
        });
        // ----- TextBlock -----
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
        actions.textBlock.remove
            .subscribe(function (ev) {
            var didDelete = false;
            _.remove(_this.state.sketch.textBlocks, function (tb) {
                if (tb._id === ev.data._id) {
                    didDelete = true;
                    return true;
                }
            });
            if (didDelete) {
                _this.events.textblock.removed.dispatchContext(_this.state, { _id: ev.data._id });
                if (_this.state.sketch.editingItem.itemId == ev.data._id) {
                    _this.state.sketch.editingItem = {};
                    events.sketch.editingItemChanged.dispatch(_this.state.sketch.editingItem);
                }
            }
        });
        // actions.textBlock.setSelected
        //     .subscribe(ev => {
        //         let block = this.state.sketch.getBlock(ev.data._id);
        //         if (block) {
        //             block.selected = ev.data.selected;
        //             this.events.textblock.selectedChanged.dispatchContext(this.state, block);
        //         }
        //     });
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
            h("label", "Add text: "),
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
            h("label", "Background: "),
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
            BootScript.dropdown({
                id: "sketchMenu",
                content: "Fiddle",
                items: [
                    {
                        content: "New",
                        attrs: {
                            title: "Create new sketch"
                        },
                        onClick: function () { return _this.actions.sketch.create.dispatch(); }
                    }
                ]
            })
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
        return h("div.text-block-editor", {}, [
            h("textarea", {
                attrs: {},
                props: {
                    value: textBlock.text
                },
                on: {
                    keyup: function (e) { return update({ text: e.target.value }); },
                    change: function (e) { return update({ text: e.target.value }); }
                }
            }),
            h("div", {}, [
                h("div.font-color-icon.fore", {}, "A"),
                h("input.text-color", {
                    attrs: {
                        type: "text"
                    },
                    props: {
                        title: "Text color",
                        value: textBlock.textColor
                    },
                    hook: {
                        insert: function (vnode) {
                            return ColorPicker.setup(vnode.elm, function (color) { return update({ textColor: color && color.toHexString() }); });
                        },
                        destroy: function (vnode) { return ColorPicker.destroy(vnode.elm); }
                    }
                })
            ]),
            h("div", {}, [
                h("div.font-color-icon.back", {}, "A"),
                h("input.background-color", {
                    attrs: {
                        type: "text"
                    },
                    props: {
                        title: "Background color",
                        value: textBlock.backgroundColor
                    },
                    hook: {
                        insert: function (vnode) {
                            return ColorPicker.setup(vnode.elm, function (color) { return update({ backgroundColor: color && color.toHexString() }); });
                        },
                        destroy: function (vnode) { return ColorPicker.destroy(vnode.elm); }
                    }
                })
            ]),
            h("button.delete-textblock.btn.btn-danger", {
                type: "button",
                props: {
                    title: "Delete"
                },
                on: {
                    click: function (e) { return _this.actions.textBlock.remove.dispatch(textBlock); }
                }
            }, [
                h("span.glyphicon.glyphicon-trash")
            ])
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
        this.attr = {};
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
            // warning: MouseBehavior events are also set within WorkspaceController. 
            //          Collision will happen eventually.
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
        sheet.style.shadowBlur = 3;
        sheet.style.shadowOffset = new paper.Point(5, 5);
        this.sheet = sheet;
        this.addChild(sheet);
        this.sheet.fillColor = this.defaultBackgroundColor;
        //this.layer.onMouseDrag = (event) => console.log('mousedrag', event);
        this.mouseBehavior = {
            // onClick: e => {
            //     paper.project.deselectAll();
            // },
            onDragMove: function (e) { return _this.position = _this.position.add(e.delta); }
        };
    }
    Object.defineProperty(Workspace.prototype, "backgroundColor", {
        get: function () {
            return this.sheet.fillColor.toString();
        },
        set: function (value) {
            this.sheet.fillColor = value || this.defaultBackgroundColor;
            // Hide stroke when possible because it has a weird shadow. 
            // Assume canvas is white.
            this.sheet.strokeColor = this.sheet.fillColor.brightness > 0.97
                ? "lightgray"
                : null;
        },
        enumerable: true,
        configurable: true
    });
    return Workspace;
}(paper.Group));
var WorkspaceController = (function () {
    function WorkspaceController(channels, font) {
        var _this = this;
        this.defaultSize = new paper.Size(50000, 40000);
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
        mouseZoom.setZoomRange([sheetBounds.scale(0.005).size, sheetBounds.scale(0.25).size]);
        mouseZoom.zoomTo(sheetBounds.scale(0.05));
        this.workspace.mouseBehavior.onClick = function (ev) {
            _this.channels.actions.sketch.setSelection.dispatch({});
        };
        channels.events.sketch.loaded.subscribe(function (ev) {
            _this._sketch = ev.data;
            _this.workspace.backgroundColor = ev.data.attr.backgroundColor;
            _.forOwn(_this._textBlockItems, function (block, id) {
                block.remove();
            });
            _this._textBlockItems = {};
        });
        channels.events.sketch.attrchanged.subscribe(function (ev) { return _this.workspace.backgroundColor = ev.data.backgroundColor; });
        channels.events.mergeTyped(channels.events.textblock.added, channels.events.textblock.changed).subscribe(function (ev) { return _this.textBlockReceived(ev.data); });
        channels.events.textblock.removed.subscribe(function (m) {
            var item = _this._textBlockItems[m.data._id];
            if (item) {
                item.remove();
                delete _this._textBlockItems[m.data._id];
            }
        });
        channels.events.sketch.selectionChanged.subscribe(function (m) {
            if (m.data && m.data.priorSelectionItemId) {
                var prior = _this._textBlockItems[m.data.priorSelectionItemId];
                if (prior) {
                    prior.selected = false;
                }
            }
            var item = m.data.itemId && _this._textBlockItems[m.data.itemId];
            if (item) {
                item.selected = true;
            }
        });
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
            // warning: MouseBehavior events are also set within StretchyPath. 
            //          Collision will happen eventuall.
            // todo: Fix drag handler in paper.js so it doesn't fire click.
            //       Then we can use the item.click event.
            item.mouseBehavior.onClick = function (ev) {
                item.bringToFront();
                var editorAt = _this.project.view.projectToView(PaperHelpers.midpoint(item.bounds.topLeft, item.bounds.center));
                // select
                if (!textBlock.selected) {
                    _this.channels.actions.sketch.setSelection.dispatch({ itemId: textBlock._id, itemType: "TextBlock" });
                }
                // edit
                _this.channels.actions.sketch.setEditingItem.dispatch({
                    itemId: textBlock._id,
                    itemType: "TextBlock",
                    clientX: editorAt.x,
                    clientY: editorAt.y
                });
            };
            item.mouseBehavior.onDragStart = function (ev) {
                item.bringToFront();
                if (!textBlock.selected) {
                    _this.channels.actions.sketch.setSelection.dispatch({ itemId: textBlock._id, itemType: "TextBlock" });
                }
            };
            item.mouseBehavior.onDragMove = function (ev) {
                item.position = item.position.add(ev.delta);
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
    var selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), channels);
    var designerController = new DesignerController(channels, function () {
        actions.sketch.create.dispatch();
        actions.textBlock.add.dispatch({ text: "FIDDLESTICKS" });
    });
}
bootstrap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9fX2ZyYW1ld29yay9Gb250TG9hZGVyLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL0hlbHBlcnMudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL2Jvb3RzY3JpcHQvYm9vdHNjcmlwdC50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay9wb3N0YWwvVG9waWMudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvcG9zdGFsL3Bvc3RhbC1vYnNlcnZlLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL3Zkb20vQ29tcG9uZW50LnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL3Zkb20vUmVhY3RpdmVEb20udHMiLCIuLi9zcmMvX2NvbW1vbi9BcHBTdGF0ZS50cyIsIi4uL3NyYy9fY29tbW9uL0NoYW5uZWxzLnRzIiwiLi4vc3JjL19jb21tb24vU3RvcmUudHMiLCIuLi9zcmMvX2NvbW1vbi9jb25zdGFudHMudHMiLCIuLi9zcmMvZGVzaWduZXIvQ29sb3JQaWNrZXIudHMiLCIuLi9zcmMvZGVzaWduZXIvRGVzaWduZXJDb250cm9sbGVyLnRzIiwiLi4vc3JjL2Rlc2lnbmVyL1NlbGVjdGVkSXRlbUVkaXRvci50cyIsIi4uL3NyYy9kZXNpZ25lci9Ta2V0Y2hFZGl0b3IudHMiLCIuLi9zcmMvZGVzaWduZXIvVGV4dEJsb2NrRWRpdG9yLnRzIiwiLi4vc3JjL21hdGgvUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHMiLCIuLi9zcmMvbW9kZWwvU2tldGNoLnRzIiwiLi4vc3JjL21vZGVsL1RleHRCbG9jay50cyIsIi4uL3NyYy9tb2RlbC9za2V0Y2ggaXRlbXMudHMiLCIuLi9zcmMvd29ya3NwYWNlL0N1cnZlU3BsaXR0ZXJIYW5kbGUudHMiLCIuLi9zcmMvd29ya3NwYWNlL01vdXNlQmVoYXZpb3JUb29sLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9QYXBlckhlbHBlcnMudHMiLCIuLi9zcmMvd29ya3NwYWNlL1BhdGhTZWN0aW9uLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9QYXRoVHJhbnNmb3JtLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9TZWdtZW50SGFuZGxlLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9TdHJldGNoeVBhdGgudHMiLCIuLi9zcmMvd29ya3NwYWNlL1N0cmV0Y2h5VGV4dC50cyIsIi4uL3NyYy93b3Jrc3BhY2UvVGV4dFJ1bGVyLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9WaWV3Wm9vbS50cyIsIi4uL3NyYy93b3Jrc3BhY2UvV29ya3NwYWNlLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9Xb3Jrc3BhY2VDb250cm9sbGVyLnRzIiwiLi4vc3JjL3pfYXBwL2Jvb3RzdHJhcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBO0lBSUksb0JBQVksT0FBZSxFQUFFLFFBQXVDO1FBQ2hFLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQVMsR0FBRyxFQUFFLElBQUk7WUFDckMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDTixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNYLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO29CQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDTCxpQkFBQztBQUFELENBQUMsQUFoQkQsSUFnQkM7QUNoQkQsZ0JBQW1CLE9BQWUsRUFBRSxNQUF3QjtJQUN4RCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FB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LEdBQWYsVUFBZ0IsTUFBTSxFQUFFLE1BQU07UUFDMUIsTUFBTSxDQUFDO1lBQ0gsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDbEcsQ0FBQztJQUNOLENBQUM7SUFDTCwyQkFBQztBQUFELENBQUMsQUFsRUQsSUFrRUM7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akQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7SUFFM0MsSUFBTSxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRTdDLElBQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQzNCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1NBQy9DLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBdEMsQ0FBc0MsQ0FBQyxDQUFDO0lBQ3RELFdBQVcsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUUxRSxJQUFNLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUV0RyxJQUFNLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLENBQUMsUUFBUSxFQUFFO1FBQ3hELE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2pDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVELFNBQVMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmNsYXNzIEZvbnRMb2FkZXIge1xyXG5cclxuICAgIGlzTG9hZGVkOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnRVcmw6IHN0cmluZywgb25Mb2FkZWQ6IChmb250OiBvcGVudHlwZS5Gb250KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgb3BlbnR5cGUubG9hZChmb250VXJsLCBmdW5jdGlvbihlcnIsIGZvbnQpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9uTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgb25Mb2FkZWQuY2FsbCh0aGlzLCBmb250KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiXHJcbmZ1bmN0aW9uIGxvZ3RhcDxUPihtZXNzYWdlOiBzdHJpbmcsIHN0cmVhbTogUnguT2JzZXJ2YWJsZTxUPik6IFJ4Lk9ic2VydmFibGU8VD57XHJcbiAgICByZXR1cm4gc3RyZWFtLnRhcCh0ID0+IGNvbnNvbGUubG9nKG1lc3NhZ2UsIHQpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbmV3aWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAobmV3IERhdGUoKS5nZXRUaW1lKCkrTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMzYpO1xyXG59XHJcbiIsIlxyXG5uYW1lc3BhY2UgVHlwZWRDaGFubmVsIHtcclxuXHJcbiAgICAvLyAtLS0gQ29yZSB0eXBlcyAtLS1cclxuXHJcbiAgICB0eXBlIFNlcmlhbGl6YWJsZSA9IE9iamVjdCB8IEFycmF5PGFueT4gfCBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuIHwgRGF0ZSB8IHZvaWQ7XHJcblxyXG4gICAgdHlwZSBWYWx1ZSA9IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBEYXRlO1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZTxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZSwgVENvbnRleHREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIGRhdGE/OiBURGF0YTtcclxuICAgICAgICByb290RGF0YT86IFRDb250ZXh0RGF0YTtcclxuICAgICAgICBtZXRhPzogT2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHR5cGUgSVN1YmplY3Q8VD4gPSBSeC5PYnNlcnZlcjxUPiAmIFJ4Lk9ic2VydmFibGU8VD47XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIENoYW5uZWxUb3BpYzxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZSwgVENvbnRleHREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIGNoYW5uZWw6IElTdWJqZWN0PE1lc3NhZ2U8VERhdGEsIFRDb250ZXh0RGF0YT4+O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihjaGFubmVsOiBJU3ViamVjdDxNZXNzYWdlPFREYXRhLCBUQ29udGV4dERhdGE+PiwgdHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWJzY3JpYmUob2JzZXJ2ZXI6IChtZXNzYWdlOiBNZXNzYWdlPFREYXRhLCBUQ29udGV4dERhdGE+KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgpLnN1YnNjcmliZShvYnNlcnZlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXNwYXRjaChkYXRhPzogVERhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsLm9uTmV4dCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGlzcGF0Y2hDb250ZXh0KGNvbnRleHQ6IFRDb250ZXh0RGF0YSwgZGF0YTogVERhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsLm9uTmV4dCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgICAgICByb290RGF0YTogY29udGV4dCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YSwgVENvbnRleHREYXRhPj4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFubmVsLmZpbHRlcihtID0+IG0udHlwZSA9PT0gdGhpcy50eXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIENoYW5uZWw8VENvbnRleHREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgc3ViamVjdDogSVN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGUsIFRDb250ZXh0RGF0YT4+O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihzdWJqZWN0PzogSVN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGUsIFRDb250ZXh0RGF0YT4+LCB0eXBlPzogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3ViamVjdCA9IHN1YmplY3QgfHwgbmV3IFJ4LlN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGUsIFRDb250ZXh0RGF0YT4+KCk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWJzY3JpYmUob25OZXh0PzogKHZhbHVlOiBNZXNzYWdlPFNlcmlhbGl6YWJsZSwgVENvbnRleHREYXRhPikgPT4gdm9pZCk6IFJ4LklEaXNwb3NhYmxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5zdWJzY3JpYmUob25OZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvcGljPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPih0eXBlOiBzdHJpbmcpIDogQ2hhbm5lbFRvcGljPFREYXRhLCBUQ29udGV4dERhdGE+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VERhdGEsIFRDb250ZXh0RGF0YT4odGhpcy5zdWJqZWN0IGFzIElTdWJqZWN0PE1lc3NhZ2U8VERhdGEsIFRDb250ZXh0RGF0YT4+LFxyXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID8gdGhpcy50eXBlICsgJy4nICsgdHlwZSA6IHR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBtZXJnZVR5cGVkPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiguLi50b3BpY3M6IENoYW5uZWxUb3BpYzxURGF0YSwgVENvbnRleHREYXRhPltdKSBcclxuICAgICAgICAgICAgOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGEsIFRDb250ZXh0RGF0YT4+IHtcclxuICAgICAgICAgICAgY29uc3QgdHlwZXMgPSB0b3BpY3MubWFwKHQgPT4gdC50eXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5maWx0ZXIobSA9PiB0eXBlcy5pbmRleE9mKG0udHlwZSkgPj0gMCApIGFzIFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YSwgVENvbnRleHREYXRhPj47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lcmdlKC4uLnRvcGljczogQ2hhbm5lbFRvcGljPFNlcmlhbGl6YWJsZSwgVENvbnRleHREYXRhPltdKSBcclxuICAgICAgICAgICAgOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8U2VyaWFsaXphYmxlLCBUQ29udGV4dERhdGE+PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdG9waWNzLm1hcCh0ID0+IHQudHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuZmlsdGVyKG0gPT4gdHlwZXMuaW5kZXhPZihtLnR5cGUpID49IDAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIlxyXG5uYW1lc3BhY2UgQm9vdFNjcmlwdCB7XHJcblxyXG4gICAgaW50ZXJmYWNlIE1lbnVJdGVtIHtcclxuICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgYXR0cnM/OiBPYmplY3QsXHJcbiAgICAgICAgb25DbGljaz86ICgpID0+IHZvaWRcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZHJvcGRvd24oXHJcbiAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgICBpZDogc3RyaW5nLFxyXG4gICAgICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgICAgIGl0ZW1zOiBNZW51SXRlbVtdXHJcbiAgICAgICAgfSk6IFZOb2RlIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXYuZHJvcGRvd25cIiwgW1xyXG4gICAgICAgICAgICBoKFwiYnV0dG9uLmJ0bi5idG4tZGVmYXVsdC5kcm9wZG93bi10b2dnbGVcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImF0dHJzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFyZ3MuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS10b2dnbGVcIjogXCJkcm9wZG93blwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgYXJncy5jb250ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuLmNhcmV0XCIpXHJcbiAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgaChcInVsLmRyb3Bkb3duLW1lbnVcIixcclxuICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgYXJncy5pdGVtcy5tYXAoaXRlbSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJsaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoZXYpID0+IGl0ZW0ub25DbGljayAmJiBpdGVtLm9uQ2xpY2soKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKCdhJywge30sIFtpdGVtLmNvbnRlbnRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG4vLyBjbGFzcyBPbGRUb3BpYzxUPiB7XHJcblxyXG4vLyAgICAgcHJpdmF0ZSBfY2hhbm5lbDogSUNoYW5uZWxEZWZpbml0aW9uPE9iamVjdD47XHJcbi8vICAgICBwcml2YXRlIF9uYW1lOiBzdHJpbmc7XHJcblxyXG4vLyAgICAgY29uc3RydWN0b3IoY2hhbm5lbDogSUNoYW5uZWxEZWZpbml0aW9uPE9iamVjdD4sIHRvcGljOiBzdHJpbmcpIHtcclxuLy8gICAgICAgICB0aGlzLl9jaGFubmVsID0gY2hhbm5lbDtcclxuLy8gICAgICAgICB0aGlzLl9uYW1lID0gdG9waWM7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgb2JzZXJ2ZSgpOiBSeC5PYnNlcnZhYmxlPFQ+IHtcclxuLy8gICAgICAgICByZXR1cm4gPFJ4Lk9ic2VydmFibGU8VD4+dGhpcy5fY2hhbm5lbC5vYnNlcnZlKHRoaXMuX25hbWUpO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHB1Ymxpc2goZGF0YTogVCkge1xyXG4vLyAgICAgICAgIHRoaXMuX2NoYW5uZWwucHVibGlzaCh0aGlzLl9uYW1lLCBkYXRhKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBzdWJzY3JpYmUoY2FsbGJhY2s6IElDYWxsYmFjazxUPik6IElTdWJzY3JpcHRpb25EZWZpbml0aW9uPFQ+IHtcclxuLy8gICAgICAgICByZXR1cm4gdGhpcy5fY2hhbm5lbC5zdWJzY3JpYmUodGhpcy5fbmFtZSwgY2FsbGJhY2spO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHByb3RlY3RlZCBzdWJ0b3BpYyhuYW1lKTogQ2hhbm5lbFRvcGljPFQ+IHtcclxuLy8gICAgICAgICByZXR1cm4gbmV3IENoYW5uZWxUb3BpYzxUPih0aGlzLl9jaGFubmVsLCB0aGlzLl9uYW1lICsgJy4nICsgbmFtZSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHJvdGVjdGVkIHN1YnRvcGljT2Y8VSBleHRlbmRzIFQ+KG5hbWUpOiBDaGFubmVsVG9waWM8VT4ge1xyXG4vLyAgICAgICAgIHJldHVybiBuZXcgQ2hhbm5lbFRvcGljPFU+KHRoaXMuX2NoYW5uZWwsIHRoaXMuX25hbWUgKyAnLicgKyBuYW1lKTtcclxuLy8gICAgIH1cclxuLy8gfVxyXG4iLCJcclxuaW50ZXJmYWNlIElQb3N0YWwge1xyXG4gICAgb2JzZXJ2ZTogKG9wdGlvbnM6IFBvc3RhbE9ic2VydmVPcHRpb25zKSA9PiBSeC5PYnNlcnZhYmxlPGFueT47XHJcbn1cclxuXHJcbmludGVyZmFjZSBQb3N0YWxPYnNlcnZlT3B0aW9ucyB7XHJcbiAgICBjaGFubmVsOiBzdHJpbmc7XHJcbiAgICB0b3BpYzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSUNoYW5uZWxEZWZpbml0aW9uPFQ+IHtcclxuICAgIG9ic2VydmUodG9waWM6IHN0cmluZyk6IFJ4Lk9ic2VydmFibGU8VD47XHJcbn1cclxuXHJcbnBvc3RhbC5vYnNlcnZlID0gZnVuY3Rpb24ob3B0aW9uczogUG9zdGFsT2JzZXJ2ZU9wdGlvbnMpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBjaGFubmVsID0gb3B0aW9ucy5jaGFubmVsO1xyXG4gICAgdmFyIHRvcGljID0gb3B0aW9ucy50b3BpYztcclxuXHJcbiAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuKFxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZEhhbmRsZXIoaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5zdWJzY3JpYmUoe1xyXG4gICAgICAgICAgICAgICAgY2hhbm5lbDogY2hhbm5lbCxcclxuICAgICAgICAgICAgICAgIHRvcGljOiB0b3BpYyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBoLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbEhhbmRsZXIoXywgc3ViKSB7XHJcbiAgICAgICAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn07XHJcblxyXG4vLyBhZGQgb2JzZXJ2ZSB0byBDaGFubmVsRGVmaW5pdGlvblxyXG4oPGFueT5wb3N0YWwpLkNoYW5uZWxEZWZpbml0aW9uLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24odG9waWM6IHN0cmluZykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm4oXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkSGFuZGxlcihoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmJ1cy5zdWJzY3JpYmUoe1xyXG4gICAgICAgICAgICAgICAgY2hhbm5lbDogc2VsZi5jaGFubmVsLFxyXG4gICAgICAgICAgICAgICAgdG9waWM6IHRvcGljLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsSGFuZGxlcihfLCBzdWIpIHtcclxuICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufTtcclxuIiwiXHJcbmFic3RyYWN0IGNsYXNzIENvbXBvbmVudDxUPiB7XHJcbiAgICBhYnN0cmFjdCByZW5kZXIoZGF0YTogVCk6IFZOb2RlO1xyXG59IiwiXHJcbmludGVyZmFjZSBSZWFjdGl2ZURvbUNvbXBvbmVudCB7XHJcbiAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPjtcclxufVxyXG5cclxuY2xhc3MgUmVhY3RpdmVEb20ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIGEgcmVhY3RpdmUgY29tcG9uZW50IHdpdGhpbiBjb250YWluZXIuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXJTdHJlYW0oXHJcbiAgICAgICAgZG9tJDogUnguT2JzZXJ2YWJsZTxWTm9kZT4sXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudFxyXG4gICAgKTogUnguT2JzZXJ2YWJsZTxWTm9kZT4ge1xyXG4gICAgICAgIGNvbnN0IGlkID0gY29udGFpbmVyLmlkO1xyXG4gICAgICAgIGxldCBjdXJyZW50OiBIVE1MRWxlbWVudCB8IFZOb2RlID0gY29udGFpbmVyO1xyXG4gICAgICAgIGNvbnN0IHNpbmsgPSBuZXcgUnguU3ViamVjdDxWTm9kZT4oKTtcclxuICAgICAgICBkb20kLnN1YnNjcmliZShkb20gPT4ge1xyXG4gICAgICAgICAgICBpZighZG9tKSByZXR1cm47XHJcbmNvbnNvbGUubG9nKCdyZW5kZXJpbmcgZG9tJywgZG9tKTsgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyByZXRhaW4gSURcclxuICAgICAgICAgICAgY29uc3QgcGF0Y2hlZCA9IHBhdGNoKGN1cnJlbnQsIGRvbSk7XHJcbiAgICAgICAgICAgIGlmKGlkICYmICFwYXRjaGVkLmVsbS5pZCl7XHJcbiAgICAgICAgICAgICAgICBwYXRjaGVkLmVsbS5pZCA9IGlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2hlZDtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIGEgcmVhY3RpdmUgY29tcG9uZW50IHdpdGhpbiBjb250YWluZXIuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXJDb21wb25lbnQoXHJcbiAgICAgICAgY29tcG9uZW50OiBSZWFjdGl2ZURvbUNvbXBvbmVudCxcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50IHwgVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGNvbXBvbmVudC5kb20kLnN1YnNjcmliZShkb20gPT4ge1xyXG4gICAgICAgICAgICBpZighZG9tKSByZXR1cm47XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgd2l0aGluIGNvbnRhaW5lciB3aGVuZXZlciBzb3VyY2UgY2hhbmdlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxpdmVSZW5kZXI8VD4oXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudCB8IFZOb2RlLFxyXG4gICAgICAgIHNvdXJjZTogUnguT2JzZXJ2YWJsZTxUPixcclxuICAgICAgICByZW5kZXI6IChuZXh0OiBUKSA9PiBWTm9kZVxyXG4gICAgKTogUnguT2JzZXJ2YWJsZTxWTm9kZT4ge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gY29udGFpbmVyO1xyXG4gICAgICAgIGxldCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XHJcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSByZW5kZXIoZGF0YSk7XHJcbiAgICAgICAgICAgIGlmKCFub2RlKSByZXR1cm47XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaChjdXJyZW50LCBub2RlKTtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5jbGFzcyBBcHBTdGF0ZSB7XHJcbiAgICBza2V0Y2g6IFNrZXRjaCA9IG5ldyBTa2V0Y2goKTtcclxufSIsIlxyXG5jbGFzcyBBY3Rpb25zIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWw8dm9pZD4ge1xyXG4gICAgXHJcbiAgICBza2V0Y2ggPSB7XHJcbiAgICAgICAgY3JlYXRlOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmNyZWF0ZVwiKSxcclxuICAgICAgICBhdHRyVXBkYXRlOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmF0dHJ1cGRhdGVcIiksXHJcbiAgICAgICAgc2V0RWRpdGluZ0l0ZW06IHRoaXMudG9waWM8UG9zaXRpb25lZEl0ZW0+KFwic2tldGNoLnNldGVkaXRpbmdpdGVtXCIpLFxyXG4gICAgICAgIHNldFNlbGVjdGlvbjogdGhpcy50b3BpYzxJdGVtU2VsZWN0aW9uPihcInNrZXRjaC5zZXRzZWxlY3Rpb25cIiksXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRleHRCbG9jayA9IHtcclxuICAgICAgICBhZGQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hZGRcIiksXHJcbiAgICAgICAgdXBkYXRlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sudXBkYXRlXCIpLFxyXG4gICAgICAgIHJlbW92ZTogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLnJlbW92ZVwiKVxyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbmNsYXNzIEV2ZW50cyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsPEFwcFN0YXRlPiB7XHJcbiAgICBcclxuICAgIHNrZXRjaCA9IHtcclxuICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5sb2FkZWRcIiksXHJcbiAgICAgICAgYXR0cmNoYW5nZWQ6IHRoaXMudG9waWM8U2tldGNoQXR0cj4oXCJza2V0Y2guYXR0cmNoYW5nZWRcIiksXHJcbiAgICAgICAgZWRpdGluZ0l0ZW1DaGFuZ2VkOiB0aGlzLnRvcGljPFBvc2l0aW9uZWRJdGVtPihcInNrZXRjaC5lZGl0aW5naXRlbWNoYW5nZWRcIiksXHJcbiAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogdGhpcy50b3BpYzxJdGVtU2VsZWN0aW9uPihcInNrZXRjaC5zZWxlY3Rpb25jaGFuZ2VkXCIpLFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0ZXh0YmxvY2sgPSB7XHJcbiAgICAgICAgYWRkZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hZGRlZFwiKSxcclxuICAgICAgICBjaGFuZ2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suY2hhbmdlZFwiKSxcclxuICAgICAgICByZW1vdmVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sucmVtb3ZlZFwiKVxyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbmNsYXNzIENoYW5uZWxzIHtcclxuICAgIGFjdGlvbnM6IEFjdGlvbnMgPSBuZXcgQWN0aW9ucygpO1xyXG4gICAgZXZlbnRzOiBFdmVudHMgPSBuZXcgRXZlbnRzKCk7XHJcbn1cclxuIiwiXHJcbmNsYXNzIFN0b3JlIHtcclxuXHJcbiAgICBzdGF0ZSA9IG5ldyBBcHBTdGF0ZSgpO1xyXG4gICAgYWN0aW9uczogQWN0aW9ucztcclxuICAgIGV2ZW50czogRXZlbnRzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGFjdGlvbnM6IEFjdGlvbnMsXHJcbiAgICAgICAgZXZlbnRzOiBFdmVudHMpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpb25zID0gYWN0aW9ucztcclxuICAgICAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gU2tldGNoIC0tLS0tXHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLmNyZWF0ZVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaCA9IG5ldyBTa2V0Y2goKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBtLmRhdGEgfHwge307XHJcbiAgICAgICAgICAgICAgICBhdHRyLmJhY2tncm91bmRDb2xvciA9IGF0dHIuYmFja2dyb3VuZENvbG9yIHx8ICcjZjZmM2ViJztcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoLmF0dHIgPSBhdHRyO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmxvYWRlZC5kaXNwYXRjaENvbnRleHQodGhpcy5zdGF0ZSwgdGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduKHRoaXMuc3RhdGUuc2tldGNoLmF0dHIsIGV2LmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmF0dHJjaGFuZ2VkLmRpc3BhdGNoQ29udGV4dCh0aGlzLnN0YXRlLCB0aGlzLnN0YXRlLnNrZXRjaC5hdHRyKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLnNldEVkaXRpbmdJdGVtLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgaWYgKG0uZGF0YS5pdGVtVHlwZSAhPT0gXCJUZXh0QmxvY2tcIikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgYFVuaGFuZGxlZCB0eXBlICR7bS50eXBlfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuc3RhdGUuc2tldGNoLmdldEJsb2NrKG0uZGF0YS5pdGVtSWQpO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaC5lZGl0aW5nSXRlbSA9IHtcclxuICAgICAgICAgICAgICAgIGl0ZW1JZDogbS5kYXRhLml0ZW1JZCxcclxuICAgICAgICAgICAgICAgIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiLFxyXG4gICAgICAgICAgICAgICAgaXRlbTogaXRlbSxcclxuICAgICAgICAgICAgICAgIGNsaWVudFg6IG0uZGF0YS5jbGllbnRYLFxyXG4gICAgICAgICAgICAgICAgY2xpZW50WTogbS5kYXRhLmNsaWVudFlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2guZWRpdGluZ0l0ZW0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBpZiAobS5kYXRhLml0ZW1UeXBlICYmIG0uZGF0YS5pdGVtVHlwZSAhPT0gXCJUZXh0QmxvY2tcIikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgYFVuaGFuZGxlZCB0eXBlICR7bS50eXBlfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guc2VsZWN0aW9uID0gPEl0ZW1TZWxlY3Rpb24+e1xyXG4gICAgICAgICAgICAgICAgaXRlbUlkOiBtLmRhdGEuaXRlbUlkLFxyXG4gICAgICAgICAgICAgICAgaXRlbVR5cGU6IG0uZGF0YS5pdGVtVHlwZSxcclxuICAgICAgICAgICAgICAgIHByaW9yU2VsZWN0aW9uSXRlbUlkOiB0aGlzLnN0YXRlLnNrZXRjaC5zZWxlY3Rpb24gXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5zdGF0ZS5za2V0Y2guc2VsZWN0aW9uLml0ZW1JZFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBldmVudHMuc2tldGNoLnNlbGVjdGlvbkNoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2guc2VsZWN0aW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIC0tLS0tIFRleHRCbG9jayAtLS0tLVxyXG5cclxuICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5hZGRcclxuICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGF0Y2ggPSBldi5kYXRhO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0geyBfaWQ6IG5ld2lkKCkgfSBhcyBUZXh0QmxvY2s7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbihibG9jaywgcGF0Y2gpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2gudGV4dEJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5hZGRlZC5kaXNwYXRjaENvbnRleHQodGhpcy5zdGF0ZSwgYmxvY2spO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gZXYuZGF0YTtcclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuc3RhdGUuc2tldGNoLmdldEJsb2NrKGV2LmRhdGEuX2lkKTtcclxuICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduKGJsb2NrLCBwYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmNoYW5nZWQuZGlzcGF0Y2hDb250ZXh0KHRoaXMuc3RhdGUsIGJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBkaWREZWxldGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIF8ucmVtb3ZlKHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsIHRiID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGIuX2lkID09PSBldi5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWREZWxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5kaXNwYXRjaENvbnRleHQodGhpcy5zdGF0ZSwge19pZDogZXYuZGF0YS5faWR9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnN0YXRlLnNrZXRjaC5lZGl0aW5nSXRlbS5pdGVtSWQgPT0gZXYuZGF0YS5faWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaC5lZGl0aW5nSXRlbSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnNrZXRjaC5lZGl0aW5nSXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gYWN0aW9ucy50ZXh0QmxvY2suc2V0U2VsZWN0ZWRcclxuICAgICAgICAvLyAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICBsZXQgYmxvY2sgPSB0aGlzLnN0YXRlLnNrZXRjaC5nZXRCbG9jayhldi5kYXRhLl9pZCk7XHJcbiAgICAgICAgLy8gICAgICAgICBpZiAoYmxvY2spIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICBibG9jay5zZWxlY3RlZCA9IGV2LmRhdGEuc2VsZWN0ZWQ7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLnNlbGVjdGVkQ2hhbmdlZC5kaXNwYXRjaENvbnRleHQodGhpcy5zdGF0ZSwgYmxvY2spO1xyXG4gICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXNzaWduPFQ+KGRlc3Q6IFQsIHNvdXJjZTogVCkge1xyXG4gICAgICAgIF8uYXNzaWduKGRlc3QsIHNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbnR5cGUgQWN0aW9uVHlwZXMgPSBcclxuICAgIFwic2tldGNoLmNyZWF0ZVwiXHJcbiAgICB8IFwic2tldGNoLnVwZGF0ZVwiXHJcbiAgICB8IFwidGV4dGJsb2NrLmFkZFwiXHJcbiAgICB8IFwidGV4dGJsb2NrLnVwZGF0ZVwiO1xyXG5cclxudHlwZSBFdmVudFR5cGVzID1cclxuICAgIFwic2tldGNoLmxvYWRlZFwiXHJcbiAgICB8IFwic2tldGNoLmNoYW5nZWRcIlxyXG4gICAgfCBcInRleHRibG9jay5hZGRlZFwiXHJcbiAgICB8IFwidGV4dGJsb2NrLmNoYW5nZWRcIjtcclxuIiwiXHJcbmNsYXNzIENvbG9yUGlja2VyIHtcclxuICAgIHN0YXRpYyBzZXR1cChlbGVtLCBvbkNoYW5nZSkge1xyXG4gICAgICAgIGxldCBzZWwgPSA8YW55PiQoZWxlbSk7XHJcbiAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oe1xyXG4gICAgICAgICAgICBzaG93SW5wdXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGFsbG93RW1wdHk6IHRydWUsXHJcbiAgICAgICAgICAgIHByZWZlcnJlZEZvcm1hdDogXCJoZXhcIixcclxuICAgICAgICAgICAgc2hvd0J1dHRvbnM6IGZhbHNlLFxyXG4gICAgICAgICAgICBzaG93QWxwaGE6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dQYWxldHRlOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93U2VsZWN0aW9uUGFsZXR0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgcGFsZXR0ZTogW1xyXG4gICAgICAgICAgICAgICAgW1wiIzAwMFwiLCBcIiM0NDRcIiwgXCIjNjY2XCIsIFwiIzk5OVwiLCBcIiNjY2NcIiwgXCIjZWVlXCIsIFwiI2YzZjNmM1wiLCBcIiNmZmZcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjZjAwXCIsIFwiI2Y5MFwiLCBcIiNmZjBcIiwgXCIjMGYwXCIsIFwiIzBmZlwiLCBcIiMwMGZcIiwgXCIjOTBmXCIsIFwiI2YwZlwiXSxcclxuICAgICAgICAgICAgICAgIFtcIiNmNGNjY2NcIiwgXCIjZmNlNWNkXCIsIFwiI2ZmZjJjY1wiLCBcIiNkOWVhZDNcIiwgXCIjZDBlMGUzXCIsIFwiI2NmZTJmM1wiLCBcIiNkOWQyZTlcIiwgXCIjZWFkMWRjXCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiI2VhOTk5OVwiLCBcIiNmOWNiOWNcIiwgXCIjZmZlNTk5XCIsIFwiI2I2ZDdhOFwiLCBcIiNhMmM0YzlcIiwgXCIjOWZjNWU4XCIsIFwiI2I0YTdkNlwiLCBcIiNkNWE2YmRcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjZTA2NjY2XCIsIFwiI2Y2YjI2YlwiLCBcIiNmZmQ5NjZcIiwgXCIjOTNjNDdkXCIsIFwiIzc2YTVhZlwiLCBcIiM2ZmE4ZGNcIiwgXCIjOGU3Y2MzXCIsIFwiI2MyN2JhMFwiXSxcclxuICAgICAgICAgICAgICAgIFtcIiNjMDBcIiwgXCIjZTY5MTM4XCIsIFwiI2YxYzIzMlwiLCBcIiM2YWE4NGZcIiwgXCIjNDU4MThlXCIsIFwiIzNkODVjNlwiLCBcIiM2NzRlYTdcIiwgXCIjYTY0ZDc5XCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiIzkwMFwiLCBcIiNiNDVmMDZcIiwgXCIjYmY5MDAwXCIsIFwiIzM4NzYxZFwiLCBcIiMxMzRmNWNcIiwgXCIjMGI1Mzk0XCIsIFwiIzM1MWM3NVwiLCBcIiM3NDFiNDdcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjNjAwXCIsIFwiIzc4M2YwNFwiLCBcIiM3ZjYwMDBcIiwgXCIjMjc0ZTEzXCIsIFwiIzBjMzQzZFwiLCBcIiMwNzM3NjNcIiwgXCIjMjAxMjRkXCIsIFwiIzRjMTEzMFwiXVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VLZXk6IFwic2tldGNodGV4dFwiLFxyXG4gICAgICAgICAgICBjaGFuZ2U6IG9uQ2hhbmdlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBzdGF0aWMgZGVzdHJveShlbGVtKXtcclxuICAgICAgICg8YW55PiQoZWxlbSkpLnNwZWN0cnVtKFwiZGVzdHJveVwiKTtcclxuICAgIH1cclxufSIsIlxyXG5jb25zdCBBbWF0aWNVcmwgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3MvYW1hdGljc2MvdjgvSURua1JUUEdjclNWbzUwVXlZTks3eTNVU0JuU3Zwa29wUWFVUi0ycjdpVS50dGYnO1xyXG5jb25zdCBSb2JvdG8xMDAgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3Mvcm9ib3RvL3YxNS83TXlncVRlMnpzOVlrUDBhZEE5UVFRLnR0Zic7XHJcbmNvbnN0IFJvYm90bzUwMCA9ICdmb250cy9Sb2JvdG8tNTAwLnR0Zic7XHJcbmNvbnN0IEFxdWFmaW5hU2NyaXB0ID0gJ2ZvbnRzL0FndWFmaW5hU2NyaXB0LVJlZ3VsYXIvQWd1YWZpbmFTY3JpcHQtUmVndWxhci50dGYnXHJcblxyXG5jbGFzcyBEZXNpZ25lckNvbnRyb2xsZXIge1xyXG5cclxuICAgIGZvbnRzOiBvcGVudHlwZS5Gb250W10gPSBbXTtcclxuICAgIHdvcmtzcGFjZUNvbnRyb2xsZXI6IFdvcmtzcGFjZUNvbnRyb2xsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2hhbm5lbHM6IENoYW5uZWxzLCBvbkZvbnRMb2FkZWQ6KCkgPT4gdm9pZCkge1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRGb250KFJvYm90bzUwMCwgZm9udCA9PiB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndvcmtzcGFjZUNvbnRyb2xsZXIgPSBuZXcgV29ya3NwYWNlQ29udHJvbGxlcihjaGFubmVscywgZm9udCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBvbkZvbnRMb2FkZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkRm9udCh1cmw6IHN0cmluZywgb25Db21wbGV0ZTogKGY6IG9wZW50eXBlLkZvbnQpID0+IHZvaWQpIHtcclxuICAgICAgICBuZXcgRm9udExvYWRlcih1cmwsIGZvbnQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnRzLnB1c2goZm9udCk7XHJcbiAgICAgICAgICAgIG9uQ29tcGxldGUoZm9udCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgU2VsZWN0ZWRJdGVtRWRpdG9yIHtcclxuXHJcbiAgICBjaGFubmVsczogQ2hhbm5lbHM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgY2hhbm5lbHM6IENoYW5uZWxzKSB7XHJcbiAgICAgICAgdGhpcy5jaGFubmVscyA9IGNoYW5uZWxzO1xyXG5cclxuICAgICAgICBjb25zdCBkb20kID0gY2hhbm5lbHMuZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWQub2JzZXJ2ZSgpLm1hcChpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmICghaS5kYXRhIHx8ICFpLmRhdGEuaXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaCgnZGl2I2VkaXRvck92ZXJsYXknLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwibm9uZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGkuZGF0YS5pdGVtVHlwZSAhPT0gJ1RleHRCbG9jaycpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGJsb2NrID0gaS5kYXRhLml0ZW0gYXMgVGV4dEJsb2NrO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBpLmRhdGEuY2xpZW50WCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBpLmRhdGEuY2xpZW50WSArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDFcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBUZXh0QmxvY2tFZGl0b3IoY2hhbm5lbHMuYWN0aW9ucykucmVuZGVyKGJsb2NrKVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oZG9tJCwgY29udGFpbmVyKTtcclxuXHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFNrZXRjaEVkaXRvciBleHRlbmRzIENvbXBvbmVudDxTa2V0Y2g+IHtcclxuICAgIGFjdGlvbnM6IEFjdGlvbnM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYWN0aW9uczogQWN0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zID0gYWN0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoc2tldGNoOiBTa2V0Y2gpIHtcclxuICAgICAgICByZXR1cm4gaChcImRpdlwiLCBbXHJcbiAgICAgICAgICAgIGgoXCJsYWJlbFwiLCBcIkFkZCB0ZXh0OiBcIiksXHJcbiAgICAgICAgICAgIGgoXCJpbnB1dC5hZGQtdGV4dFwiLCB7XHJcbiAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleXByZXNzOiAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2LndoaWNoID09PSAxMyB8fCBldi5rZXlDb2RlID09PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGV2LnRhcmdldCAmJiBldi50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbnMudGV4dEJsb2NrLmFkZC5kaXNwYXRjaCh7IHRleHQ6IHRleHQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYudGFyZ2V0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIlByZXNzIFtFbnRlcl0gdG8gYWRkXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgaChcImxhYmVsXCIsIFwiQmFja2dyb3VuZDogXCIpLFxyXG4gICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogc2tldGNoLmF0dHIuYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25zLnNrZXRjaC5hdHRyVXBkYXRlLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgIEJvb3RTY3JpcHQuZHJvcGRvd24oeyBcclxuICAgICAgICAgICAgICAgIGlkOiBcInNrZXRjaE1lbnVcIixcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRmlkZGxlXCIsXHJcbiAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiTmV3XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDcmVhdGUgbmV3IHNrZXRjaFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHRoaXMuYWN0aW9ucy5za2V0Y2guY3JlYXRlLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIF1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIFRleHRCbG9ja0VkaXRvciBleHRlbmRzIENvbXBvbmVudDxUZXh0QmxvY2s+IHtcclxuICAgIGFjdGlvbnM6IEFjdGlvbnM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYWN0aW9uczogQWN0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zID0gYWN0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGV4dEJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XHJcbiAgICAgICAgbGV0IHVwZGF0ZSA9IHRiID0+IHtcclxuICAgICAgICAgICAgdGIuX2lkID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLnRleHRCbG9jay51cGRhdGUuZGlzcGF0Y2godGIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXYudGV4dC1ibG9jay1lZGl0b3JcIixcclxuICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIGgoXCJ0ZXh0YXJlYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2sudGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5dXA6IGUgPT4gdXBkYXRlKHsgdGV4dDogZS50YXJnZXQudmFsdWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGUgPT4gdXBkYXRlKHsgdGV4dDogZS50YXJnZXQudmFsdWUgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG5cclxuICAgICAgICAgICAgICAgIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICB7fSxcclxuICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1jb2xvci1pY29uLmZvcmVcIiwge30sIFwiQVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcImlucHV0LnRleHQtY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiVGV4dCBjb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLnRleHRDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZub2RlLmVsbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB1cGRhdGUoeyB0ZXh0Q29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICh2bm9kZSkgPT4gQ29sb3JQaWNrZXIuZGVzdHJveSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBdKSxcclxuXHJcbiAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5iYWNrXCIsIHt9LCBcIkFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC5iYWNrZ3JvdW5kLWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkJhY2tncm91bmQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgYmFja2dyb3VuZENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImJ1dHRvbi5kZWxldGUtdGV4dGJsb2NrLmJ0bi5idG4tZGFuZ2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRGVsZXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBlID0+IHRoaXMuYWN0aW9ucy50ZXh0QmxvY2sucmVtb3ZlLmRpc3BhdGNoKHRleHRCbG9jaylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwic3Bhbi5nbHlwaGljb24uZ2x5cGhpY29uLXRyYXNoXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBdKTtcclxuICAgIH1cclxuXHJcbn0iLCJcclxuZGVjbGFyZSB2YXIgc29sdmU6IChhOiBhbnksIGI6IGFueSwgZmFzdDogYm9vbGVhbikgPT4gdm9pZDtcclxuXHJcbmNsYXNzIFBlcnNwZWN0aXZlVHJhbnNmb3JtIHtcclxuICAgIFxyXG4gICAgc291cmNlOiBRdWFkO1xyXG4gICAgZGVzdDogUXVhZDtcclxuICAgIHBlcnNwOiBhbnk7XHJcbiAgICBtYXRyaXg6IG51bWJlcltdO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2U6IFF1YWQsIGRlc3Q6IFF1YWQpe1xyXG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuZGVzdCA9IGRlc3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5jcmVhdGVNYXRyaXgoc291cmNlLCBkZXN0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gR2l2ZW4gYSA0eDQgcGVyc3BlY3RpdmUgdHJhbnNmb3JtYXRpb24gbWF0cml4LCBhbmQgYSAyRCBwb2ludCAoYSAyeDEgdmVjdG9yKSxcclxuICAgIC8vIGFwcGxpZXMgdGhlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCBieSBjb252ZXJ0aW5nIHRoZSBwb2ludCB0byBob21vZ2VuZW91c1xyXG4gICAgLy8gY29vcmRpbmF0ZXMgYXQgej0wLCBwb3N0LW11bHRpcGx5aW5nLCBhbmQgdGhlbiBhcHBseWluZyBhIHBlcnNwZWN0aXZlIGRpdmlkZS5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBsZXQgcDMgPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5tdWx0aXBseSh0aGlzLm1hdHJpeCwgW3BvaW50LngsIHBvaW50LnksIDAsIDFdKTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IHBhcGVyLlBvaW50KHAzWzBdIC8gcDNbM10sIHAzWzFdIC8gcDNbM10pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBjcmVhdGVNYXRyaXgoc291cmNlOiBRdWFkLCB0YXJnZXQ6IFF1YWQpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNvdXJjZVBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3NvdXJjZS5hLngsIHNvdXJjZS5hLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5iLngsIHNvdXJjZS5iLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5jLngsIHNvdXJjZS5jLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5kLngsIHNvdXJjZS5kLnldXTtcclxuICAgICAgICBsZXQgdGFyZ2V0UG9pbnRzID0gW1xyXG4gICAgICAgICAgICBbdGFyZ2V0LmEueCwgdGFyZ2V0LmEueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmIueCwgdGFyZ2V0LmIueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmMueCwgdGFyZ2V0LmMueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmQueCwgdGFyZ2V0LmQueV1dO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGEgPSBbXSwgYiA9IFtdLCBpID0gMCwgbiA9IHNvdXJjZVBvaW50cy5sZW5ndGg7IGkgPCBuOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHMgPSBzb3VyY2VQb2ludHNbaV0sIHQgPSB0YXJnZXRQb2ludHNbaV07XHJcbiAgICAgICAgICAgIGEucHVzaChbc1swXSwgc1sxXSwgMSwgMCwgMCwgMCwgLXNbMF0gKiB0WzBdLCAtc1sxXSAqIHRbMF1dKSwgYi5wdXNoKHRbMF0pO1xyXG4gICAgICAgICAgICBhLnB1c2goWzAsIDAsIDAsIHNbMF0sIHNbMV0sIDEsIC1zWzBdICogdFsxXSwgLXNbMV0gKiB0WzFdXSksIGIucHVzaCh0WzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBYID0gc29sdmUoYSwgYiwgdHJ1ZSk7IFxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIFhbMF0sIFhbM10sIDAsIFhbNl0sXHJcbiAgICAgICAgICAgIFhbMV0sIFhbNF0sIDAsIFhbN10sXHJcbiAgICAgICAgICAgICAgIDAsICAgIDAsIDEsICAgIDAsXHJcbiAgICAgICAgICAgIFhbMl0sIFhbNV0sIDAsICAgIDFcclxuICAgICAgICBdLm1hcChmdW5jdGlvbih4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHggKiAxMDAwMDApIC8gMTAwMDAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBvc3QtbXVsdGlwbHkgYSA0eDQgbWF0cml4IGluIGNvbHVtbi1tYWpvciBvcmRlciBieSBhIDR4MSBjb2x1bW4gdmVjdG9yOlxyXG4gICAgLy8gWyBtMCBtNCBtOCAgbTEyIF0gICBbIHYwIF0gICBbIHggXVxyXG4gICAgLy8gWyBtMSBtNSBtOSAgbTEzIF0gKiBbIHYxIF0gPSBbIHkgXVxyXG4gICAgLy8gWyBtMiBtNiBtMTAgbTE0IF0gICBbIHYyIF0gICBbIHogXVxyXG4gICAgLy8gWyBtMyBtNyBtMTEgbTE1IF0gICBbIHYzIF0gICBbIHcgXVxyXG4gICAgc3RhdGljIG11bHRpcGx5KG1hdHJpeCwgdmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgbWF0cml4WzBdICogdmVjdG9yWzBdICsgbWF0cml4WzRdICogdmVjdG9yWzFdICsgbWF0cml4WzggXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxMl0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFsxXSAqIHZlY3RvclswXSArIG1hdHJpeFs1XSAqIHZlY3RvclsxXSArIG1hdHJpeFs5IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTNdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMl0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNl0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbMTBdICogdmVjdG9yWzJdICsgbWF0cml4WzE0XSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzNdICogdmVjdG9yWzBdICsgbWF0cml4WzddICogdmVjdG9yWzFdICsgbWF0cml4WzExXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNV0gKiB2ZWN0b3JbM11cclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBRdWFkIHtcclxuICAgIGE6IHBhcGVyLlBvaW50O1xyXG4gICAgYjogcGFwZXIuUG9pbnQ7XHJcbiAgICBjOiBwYXBlci5Qb2ludDtcclxuICAgIGQ6IHBhcGVyLlBvaW50O1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQsIGM6IHBhcGVyLlBvaW50LCBkOiBwYXBlci5Qb2ludCl7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYyA9IGM7XHJcbiAgICAgICAgdGhpcy5kID0gZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21SZWN0YW5nbGUocmVjdDogcGFwZXIuUmVjdGFuZ2xlKXtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIHJlY3QudG9wTGVmdCxcclxuICAgICAgICAgICAgcmVjdC50b3BSaWdodCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21MZWZ0LFxyXG4gICAgICAgICAgICByZWN0LmJvdHRvbVJpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21Db29yZHMoY29vcmRzOiBudW1iZXJbXSkgOiBRdWFkIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMF0sIGNvb3Jkc1sxXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMl0sIGNvb3Jkc1szXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNF0sIGNvb3Jkc1s1XSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNl0sIGNvb3Jkc1s3XSlcclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFzQ29vcmRzKCk6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB0aGlzLmEueCwgdGhpcy5hLnksXHJcbiAgICAgICAgICAgIHRoaXMuYi54LCB0aGlzLmIueSxcclxuICAgICAgICAgICAgdGhpcy5jLngsIHRoaXMuYy55LFxyXG4gICAgICAgICAgICB0aGlzLmQueCwgdGhpcy5kLnlcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFNrZXRjaCB7XHJcblxyXG4gICAgYXR0cjogU2tldGNoQXR0ciA9IHsgXHJcbiAgICB9O1xyXG5cclxuICAgIHRleHRCbG9ja3M6IFRleHRCbG9ja1tdID0gW107XHJcblxyXG4gICAgc2VsZWN0aW9uOiBJdGVtU2VsZWN0aW9uO1xyXG5cclxuICAgIGVkaXRpbmdJdGVtOiBQb3NpdGlvbmVkSXRlbTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBnZXRCbG9jayhpZCl7XHJcbiAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnRleHRCbG9ja3MsIHQgPT4gdC5faWQgPT09IGlkKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmludGVyZmFjZSBTa2V0Y2hBdHRyIHtcclxuXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcblxyXG59IiwiXHJcbmludGVyZmFjZSBUZXh0QmxvY2sge1xyXG4gICAgX2lkPzogc3RyaW5nO1xyXG4gICAgdGV4dD86IHN0cmluZztcclxuICAgIHRleHRDb2xvcj86IHN0cmluZztcclxuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIGZvbnQ/OiBzdHJpbmc7XHJcbiAgICBmb250U2l6ZT86IG51bWJlcjtcclxuICAgIFxyXG4gICAgc2VsZWN0ZWQ/OiBib29sZWFuO1xyXG4gICAgZWRpdGluZz86IGJvb2xlYW47XHJcbn0iLCJcclxuaW50ZXJmYWNlIFBvc2l0aW9uZWRJdGVtIHtcclxuICAgIGl0ZW1JZD86IHN0cmluZztcclxuICAgIGl0ZW1UeXBlPzogc3RyaW5nO1xyXG4gICAgaXRlbT86IE9iamVjdDtcclxuICAgIGNsaWVudFg/OiBudW1iZXI7XHJcbiAgICBjbGllbnRZPzogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSXRlbVNlbGVjdGlvbiB7XHJcbiAgICBpdGVtSWQ/OiBzdHJpbmc7XHJcbiAgICBpdGVtVHlwZT86IHN0cmluZztcclxuICAgIHByaW9yU2VsZWN0aW9uSXRlbUlkPzogc3RyaW5nO1xyXG59IiwiXHJcbi8qKlxyXG4gKiBIYW5kbGUgdGhhdCBzaXRzIG9uIG1pZHBvaW50IG9mIGN1cnZlXHJcbiAqICAgd2hpY2ggd2lsbCBzcGxpdCB0aGUgY3VydmUgd2hlbiBkcmFnZ2VkLlxyXG4gKi9cclxuY2xhc3MgQ3VydmVTcGxpdHRlckhhbmRsZSBleHRlbmRzIHBhcGVyLlNoYXBlIHtcclxuIFxyXG4gICAgY3VydmU6IHBhcGVyLkN1cnZlO1xyXG4gICAgb25EcmFnU3RhcnQ6IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25EcmFnRW5kOiAobmV3U2VnbWVudDogcGFwZXIuU2VnbWVudCwgZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuIFxyXG4gICAgY29uc3RydWN0b3IoY3VydmU6IHBhcGVyLkN1cnZlKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnZlID0gY3VydmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNlbGYgPSA8YW55PnRoaXM7XHJcbiAgICAgICAgc2VsZi5fdHlwZSA9ICdjaXJjbGUnO1xyXG4gICAgICAgIHNlbGYuX3JhZGl1cyA9IDE1O1xyXG4gICAgICAgIHNlbGYuX3NpemUgPSBuZXcgcGFwZXIuU2l6ZShzZWxmLl9yYWRpdXMgKiAyKTtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShjdXJ2ZS5nZXRQb2ludEF0KDAuNSAqIGN1cnZlLmxlbmd0aCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSAyO1xyXG4gICAgICAgIHRoaXMuc3Ryb2tlQ29sb3IgPSAnYmx1ZSc7XHJcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eSA9IDAuMzsgXHJcbiBcclxuICAgICAgICBsZXQgbmV3U2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgICAgICB0aGlzLm1vdXNlQmVoYXZpb3IgPSA8TW91c2VCZWhhdmlvcj57XHJcbiAgICAgICAgICAgIG9uRHJhZ1N0YXJ0OiAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIG5ld1NlZ21lbnQgPSBuZXcgcGFwZXIuU2VnbWVudCh0aGlzLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIGN1cnZlLnBhdGguaW5zZXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlLmluZGV4ICsgMSwgXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3U2VnbWVudFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMub25EcmFnU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25EcmFnU3RhcnQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3UG9zID0gdGhpcy5wb3NpdGlvbi5hZGQoZXZlbnQuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ld1BvcztcclxuICAgICAgICAgICAgICAgIG5ld1NlZ21lbnQucG9pbnQgPSBuZXdQb3M7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdFbmQ6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMub25EcmFnRW5kKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRHJhZ0VuZChuZXdTZWdtZW50LCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5kZWNsYXJlIG1vZHVsZSBwYXBlciB7XHJcbiAgICBpbnRlcmZhY2UgSXRlbSB7XHJcbiAgICAgICAgbW91c2VCZWhhdmlvcjogTW91c2VCZWhhdmlvcjtcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIE1vdXNlQmVoYXZpb3Ige1xyXG4gICAgb25DbGljaz86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICAgIG9uT3ZlclN0YXJ0PzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbk92ZXJNb3ZlPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbk92ZXJFbmQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuXHJcbiAgICBvbkRyYWdTdGFydD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25EcmFnTW92ZT86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25EcmFnRW5kPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbn1cclxuXHJcbmludGVyZmFjZSBNb3VzZUFjdGlvbiB7XHJcbiAgICBzdGFydEV2ZW50OiBwYXBlci5Ub29sRXZlbnQ7XHJcbiAgICBpdGVtOiBwYXBlci5JdGVtO1xyXG4gICAgZHJhZ2dlZDogYm9vbGVhbjtcclxufVxyXG5cclxuY2xhc3MgTW91c2VCZWhhdmlvclRvb2wgZXh0ZW5kcyBwYXBlci5Ub29sIHtcclxuXHJcbiAgICBoaXRPcHRpb25zID0ge1xyXG4gICAgICAgIHNlZ21lbnRzOiB0cnVlLFxyXG4gICAgICAgIHN0cm9rZTogdHJ1ZSxcclxuICAgICAgICBmaWxsOiB0cnVlLFxyXG4gICAgICAgIHRvbGVyYW5jZTogNVxyXG4gICAgfTtcclxuXHJcbiAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG5cclxuICAgIG9uVG9vbE1vdXNlRG93bjogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gICAgcHJpdmF0ZSBwcmVzc0FjdGlvbjogTW91c2VBY3Rpb247XHJcbiAgICBwcml2YXRlIGhvdmVyQWN0aW9uOiBNb3VzZUFjdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9qZWN0OiBwYXBlci5Qcm9qZWN0KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnByb2plY3QgPSBwcm9qZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duID0gKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHtcclxuICAgICAgICBpZih0aGlzLm9uVG9vbE1vdXNlRG93bil7XHJcbiAgICAgICAgICAgIHRoaXMub25Ub29sTW91c2VEb3duKGV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLnByZXNzQWN0aW9uID0gbnVsbDtcclxuXHJcbiAgICAgICAgdmFyIGhpdFJlc3VsdCA9IHRoaXMucHJvamVjdC5oaXRUZXN0KFxyXG4gICAgICAgICAgICBldmVudC5wb2ludCxcclxuICAgICAgICAgICAgdGhpcy5oaXRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgaWYgKGhpdFJlc3VsdCAmJiBoaXRSZXN1bHQuaXRlbSkge1xyXG4gICAgICAgICAgICBsZXQgZHJhZ2dhYmxlID0gdGhpcy5maW5kRHJhZ0hhbmRsZXIoaGl0UmVzdWx0Lml0ZW0pO1xyXG4gICAgICAgICAgICBpZiAoZHJhZ2dhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uID0gPE1vdXNlQWN0aW9uPntcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiBkcmFnZ2FibGVcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU1vdmUgPSAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4ge1xyXG4gICAgICAgIHZhciBoaXRSZXN1bHQgPSB0aGlzLnByb2plY3QuaGl0VGVzdChcclxuICAgICAgICAgICAgZXZlbnQucG9pbnQsXHJcbiAgICAgICAgICAgIHRoaXMuaGl0T3B0aW9ucyk7XHJcbiAgICAgICAgbGV0IGhhbmRsZXJJdGVtID0gaGl0UmVzdWx0XHJcbiAgICAgICAgICAgICYmIHRoaXMuZmluZE92ZXJIYW5kbGVyKGhpdFJlc3VsdC5pdGVtKTtcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAvLyB3ZXJlIHByZXZpb3VzbHkgaG92ZXJpbmdcclxuICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvblxyXG4gICAgICAgICAgICAmJiAoXHJcbiAgICAgICAgICAgICAgICAvLyBub3QgaG92ZXJpbmcgb3ZlciBhbnl0aGluZyBub3dcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJJdGVtID09IG51bGxcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBob3ZlcmluZyBvdmVyIGN1cnJlbnQgaGFuZGxlciBvciBkZXNjZW5kZW50IHRoZXJlb2ZcclxuICAgICAgICAgICAgICAgIHx8ICFNb3VzZUJlaGF2aW9yVG9vbC5pc1NhbWVPckFuY2VzdG9yKFxyXG4gICAgICAgICAgICAgICAgICAgIGhpdFJlc3VsdC5pdGVtLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24uaXRlbSkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vIGp1c3QgbGVhdmluZ1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ob3ZlckFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25PdmVyRW5kKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbk92ZXJFbmQoZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGhhbmRsZXJJdGVtICYmIGhhbmRsZXJJdGVtLm1vdXNlQmVoYXZpb3IpIHtcclxuICAgICAgICAgICAgbGV0IGJlaGF2aW9yID0gaGFuZGxlckl0ZW0ubW91c2VCZWhhdmlvcjtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhvdmVyQWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uID0gPE1vdXNlQWN0aW9uPntcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiBoYW5kbGVySXRlbVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmIChiZWhhdmlvci5vbk92ZXJTdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yLm9uT3ZlclN0YXJ0KGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYmVoYXZpb3IgJiYgYmVoYXZpb3Iub25PdmVyTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgYmVoYXZpb3Iub25PdmVyTW92ZShldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURyYWcgPSAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wcmVzc0FjdGlvbi5kcmFnZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uLmRyYWdnZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlc3NBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ1N0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnU3RhcnQuY2FsbChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLCB0aGlzLnByZXNzQWN0aW9uLnN0YXJ0RXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdNb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdNb3ZlLmNhbGwodGhpcy5wcmVzc0FjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwID0gKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5wcmVzc0FjdGlvbikge1xyXG4gICAgICAgICAgICBsZXQgYWN0aW9uID0gdGhpcy5wcmVzc0FjdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoYWN0aW9uLmRyYWdnZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRyYWdcclxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ0VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnRW5kLmNhbGwoYWN0aW9uLml0ZW0sIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNsaWNrXHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkNsaWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkNsaWNrLmNhbGwoYWN0aW9uLml0ZW0sIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgb25Eb3VibGVDbGljayA9IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB7XHJcbiAgICB9XHJcblxyXG4gICAgb25LZXlEb3duID0gKGV2ZW50OiBwYXBlci5LZXlFdmVudCkgPT4ge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbktleVVwID0gKGV2ZW50OiBwYXBlci5LZXlFdmVudCkgPT4ge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZSBpZiBjb250YWluZXIgaXMgYW4gYW5jZXN0b3Igb2YgaXRlbS4gXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpc1NhbWVPckFuY2VzdG9yKGl0ZW06IHBhcGVyLkl0ZW0sIGNvbnRhaW5lcjogcGFwZXIuSXRlbSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhIVBhcGVySGVscGVycy5maW5kU2VsZk9yQW5jZXN0b3IoaXRlbSwgcGEgPT4gcGEgPT09IGNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZERyYWdIYW5kbGVyKGl0ZW06IHBhcGVyLkl0ZW0pOiBwYXBlci5JdGVtIHtcclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvcihcclxuICAgICAgICAgICAgaXRlbSwgXHJcbiAgICAgICAgICAgIHBhID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYiA9IHBhLm1vdXNlQmVoYXZpb3I7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gISEobWIgJiZcclxuICAgICAgICAgICAgICAgICAgICAobWIub25EcmFnU3RhcnQgfHwgbWIub25EcmFnTW92ZSB8fCBtYi5vbkRyYWdFbmQpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZpbmRPdmVySGFuZGxlcihpdGVtOiBwYXBlci5JdGVtKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kU2VsZk9yQW5jZXN0b3IoXHJcbiAgICAgICAgICAgIGl0ZW0sIFxyXG4gICAgICAgICAgICBwYSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWIgPSBwYS5tb3VzZUJlaGF2aW9yO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKG1iICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKG1iLm9uT3ZlclN0YXJ0IHx8IG1iLm9uT3Zlck1vdmUgfHwgbWIub25PdmVyRW5kICkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgUGFwZXJIZWxwZXJzIHtcclxuXHJcbiAgICBzdGF0aWMgaW1wb3J0T3BlblR5cGVQYXRoKG9wZW5QYXRoOiBvcGVudHlwZS5QYXRoKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChvcGVuUGF0aC50b1BhdGhEYXRhKCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGxldCBzdmcgPSBvcGVuUGF0aC50b1NWRyg0KTtcclxuICAgICAgICAvLyByZXR1cm4gPHBhcGVyLlBhdGg+cGFwZXIucHJvamVjdC5pbXBvcnRTVkcoc3ZnKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdHJhY2VQYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuUGF0aEl0ZW0ge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VDb21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgsIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgaWYgKCFwYXRoLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBhdGhzID0gcGF0aC5jaGlsZHJlbi5tYXAocCA9PlxyXG4gICAgICAgICAgICB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wLCBwb2ludHNQZXJQYXRoKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgoe1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogcGF0aHMsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZVBhdGgocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAvLyBpZighcGF0aCB8fCAhcGF0aC5zZWdtZW50cyB8fCBwYXRoLnNlZ21lbnRzLmxlbmd0aCl7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBsZXQgcGF0aExlbmd0aCA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGxldCBvZmZzZXRJbmNyID0gcGF0aExlbmd0aCAvIG51bVBvaW50cztcclxuICAgICAgICBsZXQgcG9pbnRzID0gW107XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAoaSsrIDwgbnVtUG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IHBhdGguZ2V0UG9pbnRBdChNYXRoLm1pbihvZmZzZXQsIHBhdGhMZW5ndGgpKTtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gb2Zmc2V0SW5jcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgIHNlZ21lbnRzOiBwb2ludHMsXHJcbiAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzYW5kd2ljaFBhdGhQcm9qZWN0aW9uKHRvcFBhdGg6IHBhcGVyLkN1cnZlbGlrZSwgYm90dG9tUGF0aDogcGFwZXIuQ3VydmVsaWtlKVxyXG4gICAgICAgIDogKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBjb25zdCB0b3BQYXRoTGVuZ3RoID0gdG9wUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgYm90dG9tUGF0aExlbmd0aCA9IGJvdHRvbVBhdGgubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbih1bml0UG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgICAgICBsZXQgdG9wUG9pbnQgPSB0b3BQYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiB0b3BQYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICAgbGV0IGJvdHRvbVBvaW50ID0gYm90dG9tUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogYm90dG9tUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGlmICh0b3BQb2ludCA9PSBudWxsIHx8IGJvdHRvbVBvaW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiY291bGQgbm90IGdldCBwcm9qZWN0ZWQgcG9pbnQgZm9yIHVuaXQgcG9pbnQgXCIgKyB1bml0UG9pbnQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdG9wUG9pbnQuYWRkKGJvdHRvbVBvaW50LnN1YnRyYWN0KHRvcFBvaW50KS5tdWx0aXBseSh1bml0UG9pbnQueSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyR3JvdXA6IHBhcGVyLkdyb3VwO1xyXG5cclxuICAgIHN0YXRpYyByZXNldE1hcmtlcnMoKXtcclxuICAgICAgICBpZihQYXBlckhlbHBlcnMubWFya2VyR3JvdXApe1xyXG4gICAgICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5vcGFjaXR5ID0gMC4yO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXJrZXJMaW5lKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCk6IHBhcGVyLkl0ZW17XHJcbiAgICAgICAgbGV0IGxpbmUgPSBwYXBlci5QYXRoLkxpbmUoYSxiKTtcclxuICAgICAgICBsaW5lLnN0cm9rZUNvbG9yID0gJ2dyZWVuJztcclxuICAgICAgICAvL2xpbmUuZGFzaEFycmF5ID0gWzUsIDVdO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChsaW5lKTtcclxuICAgICAgICByZXR1cm4gbGluZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyKHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIGxldCBtYXJrZXIgPSBwYXBlci5TaGFwZS5DaXJjbGUocG9pbnQsIDIpO1xyXG4gICAgICAgIG1hcmtlci5zdHJva2VDb2xvciA9ICdyZWQnO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChtYXJrZXIpO1xyXG4gICAgICAgIHJldHVybiBtYXJrZXI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNpbXBsaWZ5KHBhdGg6IHBhcGVyLlBhdGhJdGVtLCB0b2xlcmFuY2U/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNpbXBsaWZ5KDxwYXBlci5QYXRoSXRlbT5wLCB0b2xlcmFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKDxwYXBlci5QYXRoPnBhdGgpLnNpbXBsaWZ5KHRvbGVyYW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluZCBzZWxmIG9yIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovICAgIFxyXG4gICAgc3RhdGljIGZpbmRTZWxmT3JBbmNlc3RvcihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKXtcclxuICAgICAgICBpZihwcmVkaWNhdGUoaXRlbSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kQW5jZXN0b3IoaXRlbSwgcHJlZGljYXRlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZmluZEFuY2VzdG9yKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pe1xyXG4gICAgICAgIGlmKCFpdGVtKXtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwcmlvcjogcGFwZXIuSXRlbTtcclxuICAgICAgICBsZXQgY2hlY2tpbmcgPSBpdGVtLnBhcmVudDtcclxuICAgICAgICB3aGlsZShjaGVja2luZyAmJiBjaGVja2luZyAhPT0gcHJpb3Ipe1xyXG4gICAgICAgICAgICBpZihwcmVkaWNhdGUoY2hlY2tpbmcpKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjaGVja2luZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmlvciA9IGNoZWNraW5nO1xyXG4gICAgICAgICAgICBjaGVja2luZyA9IGNoZWNraW5nLnBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogVGhlIGNvcm5lcnMgb2YgdGhlIHJlY3QsIGNsb2Nrd2lzZSBzdGFydGluZyBmcm9tIHRvcExlZnRcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvcm5lcnMocmVjdDogcGFwZXIuUmVjdGFuZ2xlKTogcGFwZXIuUG9pbnRbXXtcclxuICAgICAgICByZXR1cm4gW3JlY3QudG9wTGVmdCwgcmVjdC50b3BSaWdodCwgcmVjdC5ib3R0b21SaWdodCwgcmVjdC5ib3R0b21MZWZ0XTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiB0aGUgbWlkcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBtaWRwb2ludChhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQpe1xyXG4gICAgICAgIHJldHVybiBiLnN1YnRyYWN0KGEpLmRpdmlkZSgyKS5hZGQoYSk7XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgUGF0aFNlY3Rpb24gaW1wbGVtZW50cyBwYXBlci5DdXJ2ZWxpa2Uge1xyXG4gICAgcGF0aDogcGFwZXIuUGF0aDtcclxuICAgIG9mZnNldDogbnVtYmVyO1xyXG4gICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHBhcGVyLlBhdGgsIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcil7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aC5nZXRQb2ludEF0KG9mZnNldCArIHRoaXMub2Zmc2V0KTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBQYXRoVHJhbnNmb3JtIHtcclxuICAgIHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICB0aGlzLnBvaW50VHJhbnNmb3JtID0gcG9pbnRUcmFuc2Zvcm07XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUG9pbnQocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50VHJhbnNmb3JtKHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1QYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSkge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1Db21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1QYXRoKHBhdGg6IHBhcGVyLlBhdGgpIHtcclxuICAgICAgICBmb3IgKGxldCBzZWdtZW50IG9mIHBhdGguc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgbGV0IG9yaWdQb2ludCA9IHNlZ21lbnQucG9pbnQ7XHJcbiAgICAgICAgICAgIGxldCBuZXdQb2ludCA9IHRoaXMudHJhbnNmb3JtUG9pbnQoc2VnbWVudC5wb2ludCk7XHJcbiAgICAgICAgICAgIG9yaWdQb2ludC54ID0gbmV3UG9pbnQueDtcclxuICAgICAgICAgICAgb3JpZ1BvaW50LnkgPSBuZXdQb2ludC55O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4iLCJcclxuY2xhc3MgU2VnbWVudEhhbmRsZSBleHRlbmRzIHBhcGVyLlNoYXBlIHtcclxuIFxyXG4gICAgc2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgIG9uRHJhZ1N0YXJ0OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uQ2hhbmdlQ29tcGxldGU6IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9zbW9vdGhlZDogYm9vbGVhbjtcclxuIFxyXG4gICAgY29uc3RydWN0b3Ioc2VnbWVudDogcGFwZXIuU2VnbWVudCwgcmFkaXVzPzogbnVtYmVyKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2VnbWVudCA9IHNlZ21lbnQ7XHJcblxyXG4gICAgICAgIGxldCBzZWxmID0gPGFueT50aGlzO1xyXG4gICAgICAgIHNlbGYuX3R5cGUgPSAnY2lyY2xlJztcclxuICAgICAgICBzZWxmLl9yYWRpdXMgPSAxNTtcclxuICAgICAgICBzZWxmLl9zaXplID0gbmV3IHBhcGVyLlNpemUoc2VsZi5fcmFkaXVzICogMik7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGUoc2VnbWVudC5wb2ludCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDI7XHJcbiAgICAgICAgdGhpcy5zdHJva2VDb2xvciA9ICdibHVlJztcclxuICAgICAgICB0aGlzLmZpbGxDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gMC43OyBcclxuXHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0gPE1vdXNlQmVoYXZpb3I+e1xyXG4gICAgICAgICAgICBvbkRyYWdTdGFydDogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgIGlmKHRoaXMub25EcmFnU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLm9uRHJhZ1N0YXJ0KGV2ZW50KTtcclxuICAgICAgICAgICAgICB9ICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnTW92ZTogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1BvcyA9IHRoaXMucG9zaXRpb24uYWRkKGV2ZW50LmRlbHRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3M7XHJcbiAgICAgICAgICAgICAgICBzZWdtZW50LnBvaW50ID0gbmV3UG9zO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdFbmQ6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Ntb290aGVkKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uQ2hhbmdlQ29tcGxldGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DaGFuZ2VDb21wbGV0ZShldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc21vb3RoZWQgPSAhdGhpcy5zbW9vdGhlZDtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMub25DaGFuZ2VDb21wbGV0ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5nZUNvbXBsZXRlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHNtb290aGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zbW9vdGhlZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IHNtb290aGVkKHZhbHVlOiBib29sZWFuKXtcclxuICAgICAgICB0aGlzLl9zbW9vdGhlZCA9IHZhbHVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnQuaGFuZGxlSW4gPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnQuaGFuZGxlT3V0ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFN0cmV0Y2h5UGF0aCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuICAgICAgICAgICAgXHJcbiAgICBzb3VyY2VQYXRoOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBkaXNwbGF5UGF0aDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgYXJyYW5nZWRQYXRoOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBjb3JuZXJzOiBwYXBlci5TZWdtZW50W107XHJcbiAgICBvdXRsaW5lOiBwYXBlci5QYXRoO1xyXG4gICAgc2hhcGVDaGFuZ2VkOiBib29sZWFuO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9vcHRpb25zOiBTdHJldGNoeVBhdGhPcHRpb25zOyAgICBcclxuICAgIFxyXG4gICAgc3RhdGljIE9VVExJTkVfUE9JTlRTID0gMjMwO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEZvciByZWJ1aWxkaW5nIHRoZSBtaWRwb2ludCBoYW5kbGVzXHJcbiAgICAgKiBhcyBvdXRsaW5lIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIG1pZHBvaW50R3JvdXA6IHBhcGVyLkdyb3VwO1xyXG4gICAgc2VnbWVudE1hcmtlcnNHcm91cDogcGFwZXIuR3JvdXA7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc291cmNlUGF0aDogcGFwZXIuQ29tcG91bmRQYXRoLCBvcHRpb25zPzogU3RyZXRjaHlQYXRoT3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIHx8IDxTdHJldGNoeVBhdGhPcHRpb25zPntcclxuICAgICAgICAgICAgcGF0aEZpbGxDb2xvcjogJ2dyYXknXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQYXRoKHNvdXJjZVBhdGgpO1xyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5jcmVhdGVPdXRsaW5lKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVTZWdtZW50TWFya2VycygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWlkcGlvbnRNYXJrZXJzKCk7XHJcbiAgICAgICAgdGhpcy5zZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KGZhbHNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IHtcclxuICAgICAgICAgICAgLy8gd2FybmluZzogTW91c2VCZWhhdmlvciBldmVudHMgYXJlIGFsc28gc2V0IHdpdGhpbiBXb3Jrc3BhY2VDb250cm9sbGVyLiBcclxuICAgICAgICAgICAgLy8gICAgICAgICAgQ29sbGlzaW9uIHdpbGwgaGFwcGVuIGV2ZW50dWFsbHkuXHJcbiAgICAgICAgICAgIG9uT3ZlclN0YXJ0OiAoKSA9PiB0aGlzLnNldEVkaXRFbGVtZW50c1Zpc2liaWxpdHkodHJ1ZSksXHJcbiAgICAgICAgICAgIG9uT3ZlckVuZDogKCkgPT4gdGhpcy5zZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KGZhbHNlKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG9wdGlvbnMoKSA6IFN0cmV0Y2h5UGF0aE9wdGlvbnMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBvcHRpb25zKHZhbHVlOiBTdHJldGNoeVBhdGhPcHRpb25zKXtcclxuICAgICAgICBpZighdmFsdWUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUJhY2tncm91bmRDb2xvcigpO1xyXG4gICAgICAgIGlmKHRoaXMuYXJyYW5nZWRQYXRoKXtcclxuICAgICAgICAgICAgdGhpcy5hcnJhbmdlZFBhdGguZmlsbENvbG9yID0gdmFsdWUucGF0aEZpbGxDb2xvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpe1xyXG4gICAgICAgIHRoaXMuc2V0UGF0aChwYXRoKTtcclxuICAgICAgICBpZighdGhpcy5zaGFwZUNoYW5nZWQpe1xyXG4gICAgICAgICAgICB0aGlzLm91dGxpbmUuYm91bmRzLnNpemUgPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzLnNpemU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTWlkcGlvbnRNYXJrZXJzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2VnbWVudE1hcmtlcnMoKTsgICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0UGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpe1xyXG4gICAgICAgIGlmKHRoaXMuc291cmNlUGF0aCl7XHJcbiAgICAgICAgICAgIHRoaXMuc291cmNlUGF0aC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXRoID0gcGF0aDtcclxuICAgICAgICBwYXRoLnZpc2libGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KHZhbHVlOiBib29sZWFuKXtcclxuICAgICAgICB0aGlzLnNlZ21lbnRNYXJrZXJzR3JvdXAudmlzaWJsZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubWlkcG9pbnRHcm91cC52aXNpYmxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lLnN0cm9rZUNvbG9yID0gdmFsdWUgPyAnbGlnaHRncmF5JyA6IG51bGw7IFxyXG4gICAgfVxyXG5cclxuICAgIGFycmFuZ2VDb250ZW50cygpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1pZHBpb250TWFya2VycygpO1xyXG4gICAgICAgIHRoaXMuYXJyYW5nZVBhdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBhcnJhbmdlUGF0aCgpIHtcclxuICAgICAgICBsZXQgb3J0aE9yaWdpbiA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMudG9wTGVmdDtcclxuICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy53aWR0aDtcclxuICAgICAgICBsZXQgb3J0aEhlaWdodCA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBzaWRlcyA9IHRoaXMuZ2V0T3V0bGluZVNpZGVzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHRvcCA9IHNpZGVzWzBdO1xyXG4gICAgICAgIGxldCBib3R0b20gPSBzaWRlc1syXTtcclxuICAgICAgICBib3R0b20ucmV2ZXJzZSgpO1xyXG4gICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLnNhbmR3aWNoUGF0aFByb2plY3Rpb24odG9wLCBib3R0b20pO1xyXG4gICAgICAgIGxldCB0cmFuc2Zvcm0gPSBuZXcgUGF0aFRyYW5zZm9ybShwb2ludCA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KG9ydGhPcmlnaW4pO1xyXG4gICAgICAgICAgICBsZXQgdW5pdCA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gb3J0aEhlaWdodCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0ZWQgPSBwcm9qZWN0aW9uKHVuaXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IobGV0IHNpZGUgb2Ygc2lkZXMpe1xyXG4gICAgICAgICAgICBzaWRlLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBsZXQgbmV3UGF0aCA9IFBhcGVySGVscGVycy50cmFjZUNvbXBvdW5kUGF0aCh0aGlzLnNvdXJjZVBhdGgsIFxyXG4gICAgICAgICAgICBTdHJldGNoeVBhdGguT1VUTElORV9QT0lOVFMpO1xyXG4gICAgICAgIG5ld1BhdGgudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgbmV3UGF0aC5maWxsQ29sb3IgPSB0aGlzLm9wdGlvbnMucGF0aEZpbGxDb2xvcjtcclxuICAgICAgICB0aGlzLmFycmFuZ2VkUGF0aCA9IG5ld1BhdGg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cGRhdGVCYWNrZ3JvdW5kQ29sb3IoKTtcclxuXHJcbiAgICAgICAgdHJhbnNmb3JtLnRyYW5zZm9ybVBhdGhJdGVtKG5ld1BhdGgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXNwbGF5UGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlQYXRoLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5UGF0aCA9IG5ld1BhdGg7XHJcbiAgICAgICAgdGhpcy5pbnNlcnRDaGlsZCgxLCBuZXdQYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE91dGxpbmVTaWRlcygpOiBwYXBlci5QYXRoW10ge1xyXG4gICAgICAgIGxldCBzaWRlczogcGFwZXIuUGF0aFtdID0gW107XHJcbiAgICAgICAgbGV0IHNlZ21lbnRHcm91cDogcGFwZXIuU2VnbWVudFtdID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNvcm5lclBvaW50cyA9IHRoaXMuY29ybmVycy5tYXAoYyA9PiBjLnBvaW50KTtcclxuICAgICAgICBsZXQgZmlyc3QgPSBjb3JuZXJQb2ludHMuc2hpZnQoKTsgXHJcbiAgICAgICAgY29ybmVyUG9pbnRzLnB1c2goZmlyc3QpO1xyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0Q29ybmVyID0gY29ybmVyUG9pbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgbGV0IHNlZ21lbnRMaXN0ID0gdGhpcy5vdXRsaW5lLnNlZ21lbnRzLm1hcCh4ID0+IHgpO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBzZWdtZW50TGlzdC5wdXNoKHNlZ21lbnRMaXN0WzBdKTtcclxuICAgICAgICBmb3IobGV0IHNlZ21lbnQgb2Ygc2VnbWVudExpc3Qpe1xyXG4gICAgICAgICAgICBzZWdtZW50R3JvdXAucHVzaChzZWdtZW50KTtcclxuICAgICAgICAgICAgaWYodGFyZ2V0Q29ybmVyLmlzQ2xvc2Uoc2VnbWVudC5wb2ludCwgcGFwZXIuTnVtZXJpY2FsLkVQU0lMT04pKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmaW5pc2ggcGF0aFxyXG4gICAgICAgICAgICAgICAgc2lkZXMucHVzaChuZXcgcGFwZXIuUGF0aChzZWdtZW50R3JvdXApKTtcclxuICAgICAgICAgICAgICAgIHNlZ21lbnRHcm91cCA9IFtzZWdtZW50XTtcclxuICAgICAgICAgICAgICAgIHRhcmdldENvcm5lciA9IGNvcm5lclBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoc2lkZXMubGVuZ3RoICE9PSA0KXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignc2lkZXMnLCBzaWRlcyk7XHJcbiAgICAgICAgICAgIHRocm93ICdmYWlsZWQgdG8gZ2V0IHNpZGVzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHNpZGVzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZU91dGxpbmUoKSB7XHJcbiAgICAgICAgbGV0IGJvdW5kcyA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHM7XHJcbiAgICAgICAgbGV0IG91dGxpbmUgPSBuZXcgcGFwZXIuUGF0aChcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLmNvcm5lcnModGhpcy5zb3VyY2VQYXRoLmJvdW5kcykpO1xyXG5cclxuICAgICAgICBvdXRsaW5lLmNsb3NlZCA9IHRydWU7XHJcbiAgICAgICAgb3V0bGluZS5kYXNoQXJyYXkgPSBbNSwgNV07XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lID0gb3V0bGluZTtcclxuXHJcbiAgICAgICAgLy8gdHJhY2sgY29ybmVycyBzbyB3ZSBrbm93IGhvdyB0byBhcnJhbmdlIHRoZSB0ZXh0XHJcbiAgICAgICAgdGhpcy5jb3JuZXJzID0gb3V0bGluZS5zZWdtZW50cy5tYXAocyA9PiBzKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChvdXRsaW5lKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUJhY2tncm91bmRDb2xvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlQmFja2dyb3VuZENvbG9yKCl7XHJcbiAgICAgICAgaWYodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3Ipe1xyXG4gICAgICAgICAgICB0aGlzLm91dGxpbmUuZmlsbENvbG9yID0gdGhpcy5vcHRpb25zLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5vdXRsaW5lLm9wYWNpdHkgPSAuOTsgICAgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vdXRsaW5lLmZpbGxDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgIHRoaXMub3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTZWdtZW50TWFya2VycygpIHtcclxuICAgICAgICBpZih0aGlzLnNlZ21lbnRNYXJrZXJzR3JvdXApe1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnRNYXJrZXJzR3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBib3VuZHMgPSB0aGlzLnNvdXJjZVBhdGguYm91bmRzO1xyXG4gICAgICAgIHRoaXMuc2VnbWVudE1hcmtlcnNHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2YgdGhpcy5vdXRsaW5lLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGUgPSBuZXcgU2VnbWVudEhhbmRsZShzZWdtZW50KTtcclxuICAgICAgICAgICAgaGFuZGxlLm9uRHJhZ1N0YXJ0ID0gKCkgPT4gdGhpcy5zaGFwZUNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBoYW5kbGUub25DaGFuZ2VDb21wbGV0ZSA9ICgpID0+IHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudE1hcmtlcnNHcm91cC5hZGRDaGlsZChoYW5kbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuc2VnbWVudE1hcmtlcnNHcm91cCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgdXBkYXRlTWlkcGlvbnRNYXJrZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMubWlkcG9pbnRHcm91cCl7XHJcbiAgICAgICAgICAgIHRoaXMubWlkcG9pbnRHcm91cC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5vdXRsaW5lLmN1cnZlcy5mb3JFYWNoKGN1cnZlID0+IHtcclxuICAgICAgICAgICAgLy8gc2tpcCBsZWZ0IGFuZCByaWdodCBzaWRlc1xyXG4gICAgICAgICAgICBpZihjdXJ2ZS5zZWdtZW50MSA9PT0gdGhpcy5jb3JuZXJzWzFdXHJcbiAgICAgICAgICAgICAgICB8fCBjdXJ2ZS5zZWdtZW50MSA9PT0gdGhpcy5jb3JuZXJzWzNdKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47ICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGUgPSBuZXcgQ3VydmVTcGxpdHRlckhhbmRsZShjdXJ2ZSk7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbkRyYWdTdGFydCA9ICgpID0+IHRoaXMuc2hhcGVDaGFuZ2VkID0gdHJ1ZTsgXHJcbiAgICAgICAgICAgIGhhbmRsZS5vbkRyYWdFbmQgPSAobmV3U2VnbWVudCwgZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdIYW5kbGUgPSBuZXcgU2VnbWVudEhhbmRsZShuZXdTZWdtZW50KTtcclxuICAgICAgICAgICAgICAgIG5ld0hhbmRsZS5vbkNoYW5nZUNvbXBsZXRlID0gKCkgPT4gdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VnbWVudE1hcmtlcnNHcm91cC5hZGRDaGlsZChuZXdIYW5kbGUpO1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5taWRwb2ludEdyb3VwLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLm1pZHBvaW50R3JvdXApO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgU3RyZXRjaHlQYXRoT3B0aW9ucyB7XHJcbiAgICBwYXRoRmlsbENvbG9yOiBzdHJpbmc7XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcclxufVxyXG4iLCJcclxuY2xhc3MgU3RyZXRjaHlUZXh0IGV4dGVuZHMgU3RyZXRjaHlQYXRoIHtcclxuXHJcbiAgICBmZm9udDogb3BlbnR5cGUuRm9udDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihmb250OiBvcGVudHlwZS5Gb250LCBvcHRpb25zOiBTdHJldGNoeVRleHRPcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIoU3RyZXRjaHlUZXh0LmdldFRleHRQYXRoKGZvbnQsIG9wdGlvbnMpLCBvcHRpb25zKTtcclxuICAgICAgICB0aGlzLmZmb250ID0gZm9udDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKG9wdGlvbnM6IFN0cmV0Y2h5VGV4dE9wdGlvbnMpe1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlUGF0aChTdHJldGNoeVRleHQuZ2V0VGV4dFBhdGgodGhpcy5mZm9udCwgb3B0aW9ucykpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgZ2V0VGV4dFBhdGgoZm9udDogb3BlbnR5cGUuRm9udCwgb3B0aW9uczogU3RyZXRjaHlUZXh0T3B0aW9ucyl7XHJcbiAgICAgICAgbGV0IG9wZW5UeXBlUGF0aCA9IGZvbnQuZ2V0UGF0aChcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMudGV4dCwgXHJcbiAgICAgICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5mb250U2l6ZSB8fCAzMik7XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5pbXBvcnRPcGVuVHlwZVBhdGgob3BlblR5cGVQYXRoKTtcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIFN0cmV0Y2h5VGV4dE9wdGlvbnMgZXh0ZW5kcyBTdHJldGNoeVBhdGhPcHRpb25zIHtcclxuICAgIHRleHQ6IHN0cmluZztcclxuICAgIGZvbnRTaXplOiBudW1iZXI7XHJcbn1cclxuIiwiXHJcbi8qKlxyXG4gKiBNZWFzdXJlcyBvZmZzZXRzIG9mIHRleHQgZ2x5cGhzLlxyXG4gKi9cclxuY2xhc3MgVGV4dFJ1bGVyIHtcclxuICAgIFxyXG4gICAgZm9udEZhbWlseTogc3RyaW5nO1xyXG4gICAgZm9udFdlaWdodDogbnVtYmVyO1xyXG4gICAgZm9udFNpemU6IG51bWJlcjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQb2ludFRleHQgKHRleHQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICB2YXIgcG9pbnRUZXh0ID0gbmV3IHBhcGVyLlBvaW50VGV4dCgpO1xyXG4gICAgICAgIHBvaW50VGV4dC5jb250ZW50ID0gdGV4dDtcclxuICAgICAgICBwb2ludFRleHQuanVzdGlmaWNhdGlvbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgaWYodGhpcy5mb250RmFtaWx5KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRGYW1pbHkgPSB0aGlzLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFdlaWdodCl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250V2VpZ2h0ID0gdGhpcy5mb250V2VpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmZvbnRTaXplKXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHBvaW50VGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUZXh0T2Zmc2V0cyh0ZXh0KXtcclxuICAgICAgICAvLyBNZWFzdXJlIGdseXBocyBpbiBwYWlycyB0byBjYXB0dXJlIHdoaXRlIHNwYWNlLlxyXG4gICAgICAgIC8vIFBhaXJzIGFyZSBjaGFyYWN0ZXJzIGkgYW5kIGkrMS5cclxuICAgICAgICB2YXIgZ2x5cGhQYWlycyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBnbHlwaFBhaXJzW2ldID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSwgaSsxKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZvciBlYWNoIGNoYXJhY3RlciwgZmluZCBjZW50ZXIgb2Zmc2V0LlxyXG4gICAgICAgIHZhciB4T2Zmc2V0cyA9IFswXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIE1lYXN1cmUgdGhyZWUgY2hhcmFjdGVycyBhdCBhIHRpbWUgdG8gZ2V0IHRoZSBhcHByb3ByaWF0ZSBcclxuICAgICAgICAgICAgLy8gICBzcGFjZSBiZWZvcmUgYW5kIGFmdGVyIHRoZSBnbHlwaC5cclxuICAgICAgICAgICAgdmFyIHRyaWFkVGV4dCA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGkgLSAxLCBpICsgMSkpO1xyXG4gICAgICAgICAgICB0cmlhZFRleHQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCBvdXQgaGFsZiBvZiBwcmlvciBnbHlwaCBwYWlyIFxyXG4gICAgICAgICAgICAvLyAgIGFuZCBoYWxmIG9mIGN1cnJlbnQgZ2x5cGggcGFpci5cclxuICAgICAgICAgICAgLy8gTXVzdCBiZSByaWdodCwgYmVjYXVzZSBpdCB3b3Jrcy5cclxuICAgICAgICAgICAgbGV0IG9mZnNldFdpZHRoID0gdHJpYWRUZXh0LmJvdW5kcy53aWR0aCBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpIC0gMV0uYm91bmRzLndpZHRoIC8gMiBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpXS5ib3VuZHMud2lkdGggLyAyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQWRkIG9mZnNldCB3aWR0aCB0byBwcmlvciBvZmZzZXQuIFxyXG4gICAgICAgICAgICB4T2Zmc2V0c1tpXSA9IHhPZmZzZXRzW2kgLSAxXSArIG9mZnNldFdpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGdseXBoUGFpciBvZiBnbHlwaFBhaXJzKXtcclxuICAgICAgICAgICAgZ2x5cGhQYWlyLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4geE9mZnNldHM7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFZpZXdab29tIHtcclxuXHJcbiAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgZmFjdG9yID0gMS4yNTtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfbWluWm9vbTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbWF4Wm9vbTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb2plY3Q6IHBhcGVyLlByb2plY3QpIHtcclxuICAgICAgICB0aGlzLnByb2plY3QgPSBwcm9qZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcblxyXG4gICAgICAgICg8YW55PiQodmlldy5lbGVtZW50KSkubW91c2V3aGVlbCgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgbGV0IG1vdXNlUG9zaXRpb24gPSBuZXcgcGFwZXIuUG9pbnQoZXZlbnQub2Zmc2V0WCwgZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlWm9vbUNlbnRlcmVkKGV2ZW50LmRlbHRhWSwgbW91c2VQb3NpdGlvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHpvb20oKTogbnVtYmVye1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2plY3Qudmlldy56b29tO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB6b29tUmFuZ2UoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgem9vbSBsZXZlbC5cclxuICAgICAqIEByZXR1cm5zIHpvb20gbGV2ZWwgdGhhdCB3YXMgc2V0LCBvciBudWxsIGlmIGl0IHdhcyBub3QgY2hhbmdlZFxyXG4gICAgICovXHJcbiAgICBzZXRab29tQ29uc3RyYWluZWQoem9vbTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICBpZih0aGlzLl9taW5ab29tKSB7XHJcbiAgICAgICAgICAgIHpvb20gPSBNYXRoLm1heCh6b29tLCB0aGlzLl9taW5ab29tKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fbWF4Wm9vbSl7XHJcbiAgICAgICAgICAgIHpvb20gPSBNYXRoLm1pbih6b29tLCB0aGlzLl9tYXhab29tKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICBpZih6b29tICE9IHZpZXcuem9vbSl7XHJcbiAgICAgICAgICAgIHZpZXcuem9vbSA9IHpvb207XHJcbiAgICAgICAgICAgIHJldHVybiB6b29tO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRab29tUmFuZ2UocmFuZ2U6IHBhcGVyLlNpemVbXSk6IG51bWJlcltdIHtcclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGxldCBhU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgbGV0IGJTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICBsZXQgYSA9IGFTaXplICYmIE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYVNpemUuaGVpZ2h0LCAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGFTaXplLndpZHRoKTtcclxuICAgICAgICBsZXQgYiA9IGJTaXplICYmIE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYlNpemUuaGVpZ2h0LCAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGJTaXplLndpZHRoKTtcclxuICAgICAgICBsZXQgbWluID0gTWF0aC5taW4oYSxiKTtcclxuICAgICAgICBpZihtaW4pe1xyXG4gICAgICAgICAgICB0aGlzLl9taW5ab29tID0gbWluO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbWF4ID0gTWF0aC5tYXgoYSxiKTtcclxuICAgICAgICBpZihtYXgpe1xyXG4gICAgICAgICAgICB0aGlzLl9tYXhab29tID0gbWF4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVpvb21DZW50ZXJlZChkZWx0YVk6IG51bWJlciwgbW91c2VQb3M6IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgaWYgKCFkZWx0YVkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGxldCBvbGRab29tID0gdmlldy56b29tO1xyXG4gICAgICAgIGxldCBvbGRDZW50ZXIgPSB2aWV3LmNlbnRlcjtcclxuICAgICAgICBsZXQgdmlld1BvcyA9IHZpZXcudmlld1RvUHJvamVjdChtb3VzZVBvcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG5ld1pvb20gPSBkZWx0YVkgPiAwXHJcbiAgICAgICAgICAgID8gdmlldy56b29tICogdGhpcy5mYWN0b3JcclxuICAgICAgICAgICAgOiB2aWV3Lnpvb20gLyB0aGlzLmZhY3RvcjtcclxuICAgICAgICBuZXdab29tID0gdGhpcy5zZXRab29tQ29uc3RyYWluZWQobmV3Wm9vbSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIW5ld1pvb20pe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgem9vbVNjYWxlID0gb2xkWm9vbSAvIG5ld1pvb207XHJcbiAgICAgICAgbGV0IGNlbnRlckFkanVzdCA9IHZpZXdQb3Muc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gdmlld1Bvcy5zdWJ0cmFjdChjZW50ZXJBZGp1c3QubXVsdGlwbHkoem9vbVNjYWxlKSlcclxuICAgICAgICAgICAgLnN1YnRyYWN0KG9sZENlbnRlcik7XHJcblxyXG4gICAgICAgIHZpZXcuY2VudGVyID0gdmlldy5jZW50ZXIuYWRkKG9mZnNldCk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB6b29tVG8ocmVjdDogcGFwZXIuUmVjdGFuZ2xlKXtcclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIHZpZXcuY2VudGVyID0gcmVjdC5jZW50ZXI7XHJcbiAgICAgICAgdmlldy56b29tID0gTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyByZWN0LmhlaWdodCwgICAgICAgICBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMud2lkdGggLyByZWN0LndpZHRoKSAqIDAuOTU7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFdvcmtzcGFjZSBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuXHJcbiAgICBkZWZhdWx0QmFja2dyb3VuZENvbG9yID0gJyNmZGZkZmQnO1xyXG5cclxuICAgIHNoZWV0OiBwYXBlci5TaGFwZTtcclxuXHJcbiAgICBnZXQgYmFja2dyb3VuZENvbG9yKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hlZXQuZmlsbENvbG9yLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGJhY2tncm91bmRDb2xvcih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zaGVldC5maWxsQ29sb3IgPSB2YWx1ZSB8fCB0aGlzLmRlZmF1bHRCYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gSGlkZSBzdHJva2Ugd2hlbiBwb3NzaWJsZSBiZWNhdXNlIGl0IGhhcyBhIHdlaXJkIHNoYWRvdy4gXHJcbiAgICAgICAgLy8gQXNzdW1lIGNhbnZhcyBpcyB3aGl0ZS5cclxuICAgICAgICB0aGlzLnNoZWV0LnN0cm9rZUNvbG9yID0gKDxwYXBlci5Db2xvcj50aGlzLnNoZWV0LmZpbGxDb2xvcikuYnJpZ2h0bmVzcyA+IDAuOTdcclxuICAgICAgICAgICAgPyBcImxpZ2h0Z3JheVwiXHJcbiAgICAgICAgICAgIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzaXplOiBwYXBlci5TaXplKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgbGV0IHNoZWV0ID0gcGFwZXIuU2hhcGUuUmVjdGFuZ2xlKFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMCwgMCksIHNpemUpO1xyXG4gICAgICAgIHNoZWV0LnN0eWxlLnNoYWRvd0NvbG9yID0gJ2dyYXknO1xyXG4gICAgICAgIHNoZWV0LnN0eWxlLnNoYWRvd0JsdXIgPSAzO1xyXG4gICAgICAgIHNoZWV0LnN0eWxlLnNoYWRvd09mZnNldCA9IG5ldyBwYXBlci5Qb2ludCg1LCA1KVxyXG4gICAgICAgIHRoaXMuc2hlZXQgPSBzaGVldDtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKHNoZWV0KTtcclxuXHJcbiAgICAgICAgdGhpcy5zaGVldC5maWxsQ29sb3IgPSB0aGlzLmRlZmF1bHRCYWNrZ3JvdW5kQ29sb3I7XHJcblxyXG4gICAgICAgIC8vdGhpcy5sYXllci5vbk1vdXNlRHJhZyA9IChldmVudCkgPT4gY29uc29sZS5sb2coJ21vdXNlZHJhZycsIGV2ZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0gPE1vdXNlQmVoYXZpb3I+e1xyXG4gICAgICAgICAgICAvLyBvbkNsaWNrOiBlID0+IHtcclxuICAgICAgICAgICAgLy8gICAgIHBhcGVyLnByb2plY3QuZGVzZWxlY3RBbGwoKTtcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgb25EcmFnTW92ZTogZSA9PiB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQoZS5kZWx0YSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgV29ya3NwYWNlQ29udHJvbGxlciB7XHJcblxyXG4gICAgZGVmYXVsdFNpemUgPSBuZXcgcGFwZXIuU2l6ZSg1MDAwMCwgNDAwMDApO1xyXG5cclxuICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICB3b3Jrc3BhY2U6IFdvcmtzcGFjZTtcclxuICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcbiAgICBmb250OiBvcGVudHlwZS5Gb250O1xyXG5cclxuICAgIHByaXZhdGUgY2hhbm5lbHM6IENoYW5uZWxzO1xyXG4gICAgcHJpdmF0ZSBfc2tldGNoOiBTa2V0Y2g7XHJcbiAgICBwcml2YXRlIF90ZXh0QmxvY2tJdGVtczogeyBbdGV4dEJsb2NrSWQ6IHN0cmluZ106IFN0cmV0Y2h5VGV4dDsgfSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNoYW5uZWxzOiBDaGFubmVscywgZm9udDogb3BlbnR5cGUuRm9udCkge1xyXG4gICAgICAgIHRoaXMuY2hhbm5lbHMgPSBjaGFubmVscztcclxuICAgICAgICB0aGlzLmZvbnQgPSBmb250O1xyXG4gICAgICAgIHBhcGVyLnNldHRpbmdzLmhhbmRsZVNpemUgPSAxO1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkNhbnZhcycpO1xyXG4gICAgICAgIHBhcGVyLnNldHVwKHRoaXMuY2FudmFzKTtcclxuICAgICAgICB0aGlzLnByb2plY3QgPSBwYXBlci5wcm9qZWN0O1xyXG5cclxuICAgICAgICBjb25zdCBtb3VzZVRvb2wgPSBuZXcgTW91c2VCZWhhdmlvclRvb2wodGhpcy5wcm9qZWN0KTtcclxuICAgICAgICBtb3VzZVRvb2wub25Ub29sTW91c2VEb3duID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWxzLmV2ZW50cy5za2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkLmRpc3BhdGNoKHt9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgbW91c2Vab29tID0gbmV3IFZpZXdab29tKHRoaXMucHJvamVjdCk7XHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSBuZXcgV29ya3NwYWNlKHRoaXMuZGVmYXVsdFNpemUpO1xyXG4gICAgICAgIGxldCBzaGVldEJvdW5kcyA9IHRoaXMud29ya3NwYWNlLnNoZWV0LmJvdW5kcztcclxuICAgICAgICBtb3VzZVpvb20uc2V0Wm9vbVJhbmdlKFxyXG4gICAgICAgICAgICBbc2hlZXRCb3VuZHMuc2NhbGUoMC4wMDUpLnNpemUsIHNoZWV0Qm91bmRzLnNjYWxlKDAuMjUpLnNpemVdKTtcclxuICAgICAgICBtb3VzZVpvb20uem9vbVRvKHNoZWV0Qm91bmRzLnNjYWxlKDAuMDUpKTtcclxuXHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UubW91c2VCZWhhdmlvci5vbkNsaWNrID0gZXYgPT4gXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWxzLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaCh7fSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFubmVscy5ldmVudHMuc2tldGNoLmxvYWRlZC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NrZXRjaCA9IGV2LmRhdGE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmtzcGFjZS5iYWNrZ3JvdW5kQ29sb3IgPSBldi5kYXRhLmF0dHIuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICAgICAgXy5mb3JPd24odGhpcy5fdGV4dEJsb2NrSXRlbXMsIChibG9jaywgaWQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGV4dEJsb2NrSXRlbXMgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNoYW5uZWxzLmV2ZW50cy5za2V0Y2guYXR0cmNoYW5nZWQuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICBldiA9PiB0aGlzLndvcmtzcGFjZS5iYWNrZ3JvdW5kQ29sb3IgPSBldi5kYXRhLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNoYW5uZWxzLmV2ZW50cy5tZXJnZVR5cGVkKFxyXG4gICAgICAgICAgICBjaGFubmVscy5ldmVudHMudGV4dGJsb2NrLmFkZGVkLFxyXG4gICAgICAgICAgICBjaGFubmVscy5ldmVudHMudGV4dGJsb2NrLmNoYW5nZWRcclxuICAgICAgICApLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZXYgPT4gdGhpcy50ZXh0QmxvY2tSZWNlaXZlZChldi5kYXRhKSk7XHJcblxyXG4gICAgICAgIGNoYW5uZWxzLmV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY2hhbm5lbHMuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgaWYobS5kYXRhICYmIG0uZGF0YS5wcmlvclNlbGVjdGlvbkl0ZW1JZCl7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJpb3IgPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEucHJpb3JTZWxlY3Rpb25JdGVtSWRdO1xyXG4gICAgICAgICAgICAgICAgaWYocHJpb3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgIHByaW9yLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gbS5kYXRhLml0ZW1JZCAmJiB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuaXRlbUlkXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGV4dEJsb2NrUmVjZWl2ZWQodGV4dEJsb2NrOiBUZXh0QmxvY2spIHtcclxuXHJcbiAgICAgICAgaWYgKCF0ZXh0QmxvY2sgfHwgIXRleHRCbG9jay50ZXh0IHx8ICF0ZXh0QmxvY2sudGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRleHRCbG9jay5faWQpIHtcclxuICAgICAgICAgICAgdGV4dEJsb2NrLl9pZCA9IG5ld2lkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBvcHRpb25zID0gPFN0cmV0Y2h5VGV4dE9wdGlvbnM+e1xyXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0QmxvY2sudGV4dCxcclxuICAgICAgICAgICAgZm9udFNpemU6IDEyOCxcclxuICAgICAgICAgICAgcGF0aEZpbGxDb2xvcjogdGV4dEJsb2NrLnRleHRDb2xvciB8fCAnYmxhY2snLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbdGV4dEJsb2NrLl9pZF07XHJcbiAgICAgICAgaWYgKCFpdGVtKSB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSBuZXcgU3RyZXRjaHlUZXh0KHRoaXMuZm9udCwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAvLyB3YXJuaW5nOiBNb3VzZUJlaGF2aW9yIGV2ZW50cyBhcmUgYWxzbyBzZXQgd2l0aGluIFN0cmV0Y2h5UGF0aC4gXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgIENvbGxpc2lvbiB3aWxsIGhhcHBlbiBldmVudHVhbGwuXHJcbiAgICAgICAgICAgIC8vIHRvZG86IEZpeCBkcmFnIGhhbmRsZXIgaW4gcGFwZXIuanMgc28gaXQgZG9lc24ndCBmaXJlIGNsaWNrLlxyXG4gICAgICAgICAgICAvLyAgICAgICBUaGVuIHdlIGNhbiB1c2UgdGhlIGl0ZW0uY2xpY2sgZXZlbnQuXHJcbiAgICAgICAgICAgIGl0ZW0ubW91c2VCZWhhdmlvci5vbkNsaWNrID0gZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5icmluZ1RvRnJvbnQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVkaXRvckF0ID0gdGhpcy5wcm9qZWN0LnZpZXcucHJvamVjdFRvVmlldyhcclxuICAgICAgICAgICAgICAgICAgICBQYXBlckhlbHBlcnMubWlkcG9pbnQoaXRlbS5ib3VuZHMudG9wTGVmdCwgaXRlbS5ib3VuZHMuY2VudGVyKSk7XHJcbiAgICAgICAgICAgICAgICAvLyBzZWxlY3RcclxuICAgICAgICAgICAgICAgIGlmKCF0ZXh0QmxvY2suc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5uZWxzLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW1JZDogdGV4dEJsb2NrLl9pZCwgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCJ9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGVkaXRcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMuYWN0aW9ucy5za2V0Y2guc2V0RWRpdGluZ0l0ZW0uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtSWQ6IHRleHRCbG9jay5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRYOiBlZGl0b3JBdC54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRZOiBlZGl0b3JBdC55XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnU3RhcnQgPSBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICAgICAgaWYoIXRleHRCbG9jay5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7aXRlbUlkOiB0ZXh0QmxvY2suX2lkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIn0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ01vdmUgPSBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbi5hZGQoZXYuZGVsdGEpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaXRlbS5kYXRhID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2UuYWRkQ2hpbGQoaXRlbSk7XHJcbiAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSB0aGlzLnByb2plY3Qudmlldy5ib3VuZHMucG9pbnQuYWRkKFxyXG4gICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGl0ZW0uYm91bmRzLndpZHRoIC8gMiwgaXRlbS5ib3VuZHMuaGVpZ2h0IC8gMilcclxuICAgICAgICAgICAgICAgICAgICAuYWRkKDUwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHRCbG9ja0l0ZW1zW3RleHRCbG9jay5faWRdID0gaXRlbTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpdGVtLnVwZGF0ZShvcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJcclxuXHJcbmZ1bmN0aW9uIGJvb3RzdHJhcCgpIHtcclxuICAgIGNvbnN0IGNoYW5uZWxzID0gbmV3IENoYW5uZWxzKCk7XHJcbiAgICBjb25zdCBhY3Rpb25zID0gY2hhbm5lbHMuYWN0aW9ucywgZXZlbnRzID0gY2hhbm5lbHMuZXZlbnRzO1xyXG5cclxuYWN0aW9ucy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZygnYWN0aW9uJywgeCkpO1xyXG5ldmVudHMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coJ2V2ZW50JywgeCkpO1xyXG5cclxuICAgIGNvbnN0IHJvb3RTdG9yZSA9IG5ldyBTdG9yZShhY3Rpb25zLCBldmVudHMpO1xyXG5cclxuICAgIGNvbnN0IHNrZXRjaEVkaXRvciA9IG5ldyBTa2V0Y2hFZGl0b3IoYWN0aW9ucyk7IFxyXG4gICAgY29uc3Qgc2tldGNoRG9tJCA9IGV2ZW50cy5tZXJnZShcclxuICAgICAgICBldmVudHMuc2tldGNoLmxvYWRlZCwgZXZlbnRzLnNrZXRjaC5hdHRyY2hhbmdlZClcclxuICAgICAgICAubWFwKG0gPT4gc2tldGNoRWRpdG9yLnJlbmRlcihtLnJvb3REYXRhLnNrZXRjaCkpO1xyXG4gICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKHNrZXRjaERvbSQsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNpZ25lcicpKTtcclxuXHJcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1FZGl0b3IgPSBuZXcgU2VsZWN0ZWRJdGVtRWRpdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdG9yT3ZlcmxheVwiKSwgY2hhbm5lbHMpO1xyXG5cclxuICAgIGNvbnN0IGRlc2lnbmVyQ29udHJvbGxlciA9IG5ldyBEZXNpZ25lckNvbnRyb2xsZXIoY2hhbm5lbHMsICgpID0+IHtcclxuICAgICAgICBhY3Rpb25zLnNrZXRjaC5jcmVhdGUuZGlzcGF0Y2goKTtcclxuICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5hZGQuZGlzcGF0Y2goeyB0ZXh0OiBcIkZJRERMRVNUSUNLU1wiIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmJvb3RzdHJhcCgpOyJdfQ==