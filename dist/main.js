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
                data: _.clone(data)
            });
        };
        ChannelTopic.prototype.dispatchContext = function (context, data) {
            this.channel.onNext({
                type: this.type,
                rootData: context,
                data: _.clone(data)
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
var ObservableEvent = (function () {
    function ObservableEvent() {
        this._subscribers = [];
    }
    /**
     * Subscribe for notification. Returns unsubscribe function.
     */
    ObservableEvent.prototype.subscribe = function (callback) {
        var _this = this;
        if (this._subscribers.indexOf(callback) < 0) {
            this._subscribers.push(callback);
        }
        return function () {
            var index = _this._subscribers.indexOf(callback, 0);
            if (index > -1) {
                _this._subscribers.splice(index, 1);
            }
        };
    };
    /**
     * Subscribe for one notification.
     */
    ObservableEvent.prototype.subscribeOne = function (callback) {
        var unsub = this.subscribe(function (t) {
            unsub();
            callback(t);
        });
    };
    ObservableEvent.prototype.notify = function (eventArg) {
        for (var _i = 0, _a = this._subscribers; _i < _a.length; _i++) {
            var subscriber = _a[_i];
            subscriber.call(this, eventArg);
        }
    };
    /**
     * Removes all subscribers.
     */
    ObservableEvent.prototype.clear = function () {
        this._subscribers.length = 0;
    };
    return ObservableEvent;
}());
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
var PaperNotify;
(function (PaperNotify) {
    (function (ChangeFlag) {
        // Anything affecting the appearance of an item, including GEOMETRY,
        // STROKE, STYLE and ATTRIBUTE (except for the invisible ones: locked, name)
        ChangeFlag[ChangeFlag["APPEARANCE"] = 1] = "APPEARANCE";
        // A change in the item's children
        ChangeFlag[ChangeFlag["CHILDREN"] = 2] = "CHILDREN";
        // A change of the item's place in the scene graph (removed, inserted,
        // moved).
        ChangeFlag[ChangeFlag["INSERTION"] = 4] = "INSERTION";
        // Item geometry (path, bounds)
        ChangeFlag[ChangeFlag["GEOMETRY"] = 8] = "GEOMETRY";
        // Only segment(s) have changed, and affected curves have already been
        // notified. This is to implement an optimization in _changed() calls.
        ChangeFlag[ChangeFlag["SEGMENTS"] = 16] = "SEGMENTS";
        // Stroke geometry (excluding color)
        ChangeFlag[ChangeFlag["STROKE"] = 32] = "STROKE";
        // Fill style or stroke color / dash
        ChangeFlag[ChangeFlag["STYLE"] = 64] = "STYLE";
        // Item attributes: visible, blendMode, locked, name, opacity, clipMask ...
        ChangeFlag[ChangeFlag["ATTRIBUTE"] = 128] = "ATTRIBUTE";
        // Text content
        ChangeFlag[ChangeFlag["CONTENT"] = 256] = "CONTENT";
        // Raster pixels
        ChangeFlag[ChangeFlag["PIXELS"] = 512] = "PIXELS";
        // Clipping in one of the child items
        ChangeFlag[ChangeFlag["CLIPPING"] = 1024] = "CLIPPING";
        // The view has been transformed
        ChangeFlag[ChangeFlag["VIEW"] = 2048] = "VIEW";
    })(PaperNotify.ChangeFlag || (PaperNotify.ChangeFlag = {}));
    var ChangeFlag = PaperNotify.ChangeFlag;
    // Shortcuts to often used ChangeFlag values including APPEARANCE
    (function (Changes) {
        // CHILDREN also changes GEOMETRY, since removing children from groups
        // changes bounds.
        Changes[Changes["CHILDREN"] = 11] = "CHILDREN";
        // Changing the insertion can change the appearance through parent's matrix.
        Changes[Changes["INSERTION"] = 5] = "INSERTION";
        Changes[Changes["GEOMETRY"] = 9] = "GEOMETRY";
        Changes[Changes["SEGMENTS"] = 25] = "SEGMENTS";
        Changes[Changes["STROKE"] = 97] = "STROKE";
        Changes[Changes["STYLE"] = 65] = "STYLE";
        Changes[Changes["ATTRIBUTE"] = 129] = "ATTRIBUTE";
        Changes[Changes["CONTENT"] = 265] = "CONTENT";
        Changes[Changes["PIXELS"] = 513] = "PIXELS";
        Changes[Changes["VIEW"] = 2049] = "VIEW";
    })(PaperNotify.Changes || (PaperNotify.Changes = {}));
    var Changes = PaperNotify.Changes;
    ;
    function initialize() {
        // Inject Item.observe
        var itemProto = paper.Item.prototype;
        itemProto.observe = function (handler) {
            var _this = this;
            if (!this._observers) {
                this._observers = [];
            }
            if (this._observers.indexOf(handler) < 0) {
                this._observers.push(handler);
            }
            return function () {
                var index = _this._observers.indexOf(handler, 0);
                if (index > -1) {
                    _this._observers.splice(index, 1);
                }
            };
        };
        // Wrap Item.remove
        var itemRemove = itemProto.remove;
        itemProto.remove = function () {
            itemRemove.apply(this, arguments);
            this._observers = null;
        };
        // Wrap Project._changed
        var projectProto = paper.Project.prototype;
        var projectChanged = projectProto._changed;
        projectProto._changed = function (flags, item) {
            projectChanged.apply(this, arguments);
            if (item) {
                var subs = item._observers;
                if (subs) {
                    for (var _i = 0, subs_1 = subs; _i < subs_1.length; _i++) {
                        var s = subs_1[_i];
                        s.call(item, flags);
                    }
                }
            }
        };
    }
    PaperNotify.initialize = initialize;
    function describe(flags) {
        var desc = ChangeFlag[flags];
        if (desc) {
            return "ChangeFlag." + desc;
        }
        desc = Changes[flags];
        if (desc) {
            return "Changes." + desc;
        }
        // todo: support arbitrary flag combos
    }
    PaperNotify.describe = describe;
})(PaperNotify || (PaperNotify = {}));
PaperNotify.initialize();
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
            //console.log('rendering dom', dom); /////////////////////
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
var Actions = (function (_super) {
    __extends(Actions, _super);
    function Actions() {
        _super.apply(this, arguments);
        this.designer = {
            saveLocal: this.topic("designer.savelocal"),
        };
        this.sketch = {
            create: this.topic("sketch.create"),
            attrUpdate: this.topic("sketch.attrupdate"),
            setEditingItem: this.topic("sketch.seteditingitem"),
            setSelection: this.topic("sketch.setselection"),
        };
        this.textBlock = {
            add: this.topic("textblock.add"),
            updateAttr: this.topic("textblock.updateattr"),
            updateArrange: this.topic("textblock.updatearrange"),
            remove: this.topic("textblock.remove")
        };
    }
    return Actions;
}(TypedChannel.Channel));
var Events = (function (_super) {
    __extends(Events, _super);
    function Events() {
        _super.apply(this, arguments);
        this.designer = {
            saveLocalRequested: this.topic("savelocalRequested"),
            backgroundActionCompleted: this.topic("backgroundActionCompleted"),
        };
        this.sketch = {
            loaded: this.topic("sketch.loaded"),
            attrChanged: this.topic("sketch.attrchanged"),
            editingItemChanged: this.topic("sketch.editingitemchanged"),
            selectionChanged: this.topic("sketch.selectionchanged"),
            saveLocalRequested: this.topic("sketch.savelocal.requested")
        };
        this.textblock = {
            added: this.topic("textblock.added"),
            attrChanged: this.topic("textblock.attrchanged"),
            arrangeChanged: this.topic("textblock.arrangechanged"),
            removed: this.topic("textblock.removed"),
            loaded: this.topic("textblock.loaded"),
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
        this.state = this.createAppState();
        this.actions = actions;
        this.events = events;
        // ----- Designer -----
        actions.designer.saveLocal.subscribe(function (m) {
            var json = JSON.stringify(_this.state);
            console.log('state', json);
            _this.state = JSON.parse(json);
            console.log('state loaded', _this.state);
            _this.events.sketch.loaded.dispatchContext(_this.state, _this.state.sketch);
            for (var _i = 0, _a = _this.state.sketch.textBlocks; _i < _a.length; _i++) {
                var tb = _a[_i];
                _this.events.textblock.loaded.dispatchContext(_this.state, tb);
            }
        });
        // ----- Sketch -----
        actions.sketch.create
            .subscribe(function (m) {
            _this.state.sketch = _this.createSketch();
            var attr = m.data || {};
            attr.backgroundColor = attr.backgroundColor || '#f6f3eb';
            _this.state.sketch.attr = attr;
            _this.events.sketch.loaded.dispatchContext(_this.state, _this.state.sketch);
        });
        actions.sketch.attrUpdate
            .subscribe(function (ev) {
            _this.assign(_this.state.sketch.attr, ev.data);
            _this.events.sketch.attrChanged.dispatchContext(_this.state, _this.state.sketch.attr);
        });
        actions.sketch.setEditingItem.subscribe(function (m) {
            if (m.data.itemType !== "TextBlock") {
                throw "Unhandled type " + m.type;
            }
            var item = _this.getBlock(m.data.itemId);
            _this.state.sketch.editingItem = {
                itemId: m.data.itemId,
                itemType: "TextBlock",
                item: item,
                clientX: m.data.clientX,
                clientY: m.data.clientY
            };
            events.sketch.editingItemChanged.dispatchContext(_this.state, _this.state.sketch.editingItem);
        });
        actions.sketch.setSelection.subscribe(function (m) {
            if (m.data.itemType && m.data.itemType !== "TextBlock") {
                throw "Unhandled type " + m.type;
            }
            if ((m.data && m.data.itemId)
                === (_this.state.sketch.selection && _this.state.sketch.selection.itemId)) {
                // nothing to do
                return;
            }
            _this.state.sketch.selection = {
                itemId: m.data.itemId,
                itemType: m.data.itemType,
                priorSelectionItemId: _this.state.sketch.selection
                    && _this.state.sketch.selection.itemId
            };
            events.sketch.selectionChanged.dispatchContext(_this.state, _this.state.sketch.selection);
        });
        // ----- TextBlock -----
        actions.textBlock.add
            .subscribe(function (ev) {
            var patch = ev.data;
            if (!patch.text || !patch.text.length) {
                return;
            }
            var block = { _id: newid() };
            _this.assign(block, patch);
            if (!block.fontSize) {
                block.fontSize = 64;
            }
            if (!block.textColor) {
                block.textColor = "gray";
            }
            _this.state.sketch.textBlocks.push(block);
            _this.events.textblock.added.dispatchContext(_this.state, block);
        });
        actions.textBlock.updateAttr
            .subscribe(function (ev) {
            var block = _this.getBlock(ev.data._id);
            if (block) {
                var patch_1 = {
                    text: ev.data.text,
                    backgroundColor: ev.data.backgroundColor,
                    textColor: ev.data.textColor,
                    font: ev.data.font,
                    fontSize: ev.data.fontSize
                };
                _this.assign(block, patch_1);
                _this.events.textblock.attrChanged.dispatchContext(_this.state, block);
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
        actions.textBlock.updateArrange
            .subscribe(function (ev) {
            var block = _this.getBlock(ev.data._id);
            if (block) {
                block.position = ev.data.position;
                block.outline = ev.data.outline;
                events.textblock.arrangeChanged.dispatchContext(_this.state, block);
            }
        });
    }
    Store.prototype.assign = function (dest, source) {
        _.merge(dest, source);
    };
    Store.prototype.createAppState = function () {
        return {
            sketch: this.createSketch()
        };
    };
    Store.prototype.createSketch = function () {
        return {
            attr: {},
            textBlocks: []
        };
    };
    Store.prototype.getBlock = function (id) {
        return _.find(this.state.sketch.textBlocks, function (tb) { return tb._id === id; });
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
                    },
                    {
                        content: "Save Local",
                        attrs: {
                            title: "Save to local browser storage"
                        },
                        onClick: function () { return _this.actions.designer.saveLocal.dispatch(); }
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
            _this.actions.textBlock.updateAttr.dispatch(tb);
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
        var viewCenter = this.project.view.bounds.center;
        var line = paper.Path.Line(viewCenter, viewCenter.add(200));
        var stretch = new StretchPath(line.segments);
        this.workspace.addChild(stretch);
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
        channels.events.sketch.attrChanged.subscribe(function (ev) { return _this.workspace.backgroundColor = ev.data.backgroundColor; });
        channels.events.mergeTyped(channels.events.textblock.added, channels.events.textblock.loaded).subscribe(function (ev) { return _this.addBlock(ev.data); });
        channels.events.textblock.attrChanged.subscribe(function (m) {
            var item = _this._textBlockItems[m.data._id];
            if (item) {
                var textBlock = m.data;
                var options = {
                    text: textBlock.text,
                    fontSize: textBlock.fontSize,
                    pathFillColor: textBlock.textColor,
                    backgroundColor: textBlock.backgroundColor
                };
                item.update(options);
            }
        });
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
                    prior.blockSelected = false;
                }
            }
            var item = m.data.itemId && _this._textBlockItems[m.data.itemId];
            if (item) {
                item.blockSelected = true;
            }
        });
        channels.events.designer.saveLocalRequested.subscribe(function (m) {
            _.forOwn(_this._textBlockItems, function (tbi) {
                var doc = _this.project.exportJSON(false);
                console.log(doc);
            });
        });
    }
    WorkspaceController.prototype.addBlock = function (textBlock) {
        var _this = this;
        if (!textBlock) {
            return;
        }
        if (!textBlock._id) {
            console.error('received block without id', textBlock);
        }
        var options = {
            text: textBlock.text,
            fontSize: textBlock.fontSize,
            // pink = should not happen
            pathFillColor: textBlock.textColor || 'pink',
            backgroundColor: textBlock.backgroundColor
        };
        var item = this._textBlockItems[textBlock._id];
        if (item) {
            console.error("Received addBlock for block that is already loaded");
            return;
        }
        item = new StretchyText(this.font, options, textBlock.position, textBlock.outline);
        // warning: MouseBehavior events are also set within StretchyPath. 
        //          Collision will happen eventuall.
        // todo: Fix drag handler in paper.js so it doesn't fire click.
        //       Then we can use the item.click event.
        item.mouseBehavior.onClick = function (ev) {
            item.bringToFront();
            var editorAt = _this.project.view.projectToView(PaperHelpers.midpoint(item.bounds.topLeft, item.bounds.center));
            // select
            if (!item.selected) {
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
            if (!item.selected) {
                _this.channels.actions.sketch.setSelection.dispatch({ itemId: textBlock._id, itemType: "TextBlock" });
            }
        };
        item.mouseBehavior.onDragMove = function (ev) {
            item.position = item.position.add(ev.delta);
        };
        item.mouseBehavior.onDragEnd = function (ev) {
            var block = _this.getBlockArrangement(item);
            block._id = textBlock._id;
            _this.channels.actions.textBlock.updateArrange.dispatch(block);
        };
        item.onOutlineChanged = function (outline) {
            var block = _this.getBlockArrangement(item);
            block._id = textBlock._id;
            _this.channels.actions.textBlock.updateArrange.dispatch(block);
        };
        item.data = textBlock._id;
        this.workspace.addChild(item);
        if (!textBlock.position) {
            item.position = this.project.view.bounds.point.add(new paper.Point(item.bounds.width / 2, item.bounds.height / 2)
                .add(50));
        }
        this._textBlockItems[textBlock._id] = item;
    };
    WorkspaceController.prototype.getBlockArrangement = function (item) {
        var sides = item.getOutlineSides();
        var top = sides[0].exportJSON({ asString: false });
        var bottom = sides[2].exportJSON({ asString: false });
        return {
            position: [item.position.x, item.position.y],
            outline: { top: top, bottom: bottom }
        };
    };
    return WorkspaceController;
}());
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
                _this.position = _this.position.add(event.delta);
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
    PaperHelpers.marker = function (point, label) {
        //let marker = paper.Shape.Circle(point, 10);
        var marker = new paper.PointText(point);
        marker.fontSize = 36;
        marker.content = label;
        marker.strokeColor = "red";
        marker.bringToFront();
        //PaperHelpers.markerGroup.addChild(marker);
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
var PathHandle = (function (_super) {
    __extends(PathHandle, _super);
    function PathHandle(attach) {
        var _this = this;
        _super.call(this);
        this._curveSplit = new ObservableEvent();
        var position;
        if (attach instanceof paper.Segment) {
            this._segment = attach;
            position = this._segment.point;
        }
        else if (attach instanceof paper.Curve) {
            this._curve = attach;
            position = this._curve.getPointAt(this._curve.length * 0.5);
            this._curveUnSub = this._curve.path.observe(function (flags) {
                if (flags & PaperNotify.ChangeFlag.GEOMETRY) {
                    _this.center = _this._curve.getPointAt(_this._curve.length * 0.5);
                }
            });
        }
        else {
            throw "attach must be Segment or Curve";
        }
        this._marker = paper.Shape.Circle(position, PathHandle.MARKER_RADIUS);
        this._marker.strokeColor = "blue";
        this._marker.fillColor = "white";
        this.addChild(this._marker);
        if (this._segment) {
            this.styleAsSegment();
        }
        else {
            this.styleAsCurve();
        }
        this.mouseBehavior = {
            onDragStart: function (event) {
                if (_this._curve) {
                    // split the curve, 'eclose' to segment handle
                    _this._curveUnSub();
                    _this._segment = new paper.Segment(_this.position);
                    var curveIdx = _this._curve.index;
                    _this._curve.path.insert(curveIdx + 1, _this._segment);
                    _this._curve = null;
                    _this.styleAsSegment();
                    _this.curveSplit.notify(curveIdx);
                }
            },
            onDragMove: function (event) {
                var newPos = _this.position.add(event.delta);
                _this.position = newPos;
                if (_this._segment) {
                    _this._segment.point = newPos;
                }
            },
            onDragEnd: function (event) {
                if (_this._smoothed) {
                    _this._segment.smooth();
                }
            },
            onClick: function (event) {
                if (_this._segment) {
                    _this.smoothed = !_this.smoothed;
                }
            }
        };
    }
    Object.defineProperty(PathHandle.prototype, "smoothed", {
        get: function () {
            return this._smoothed;
        },
        set: function (value) {
            this._smoothed = value;
            if (value) {
                this._segment.smooth();
            }
            else {
                this._segment.handleIn = null;
                this._segment.handleOut = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PathHandle.prototype, "curveSplit", {
        get: function () {
            return this._curveSplit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PathHandle.prototype, "center", {
        get: function () {
            return this.position;
        },
        set: function (point) {
            this.position = point;
        },
        enumerable: true,
        configurable: true
    });
    PathHandle.prototype.styleAsSegment = function () {
        this._marker.opacity = 0.8;
    };
    PathHandle.prototype.styleAsCurve = function () {
        this._marker.opacity = 0.3;
    };
    PathHandle.MARKER_RADIUS = 15;
    return PathHandle;
}(paper.Group));
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
var StretchPath = (function (_super) {
    __extends(StretchPath, _super);
    function StretchPath(segments, style) {
        _super.call(this);
        this._handles = [];
        this._path = new paper.Path(segments);
        if (style) {
            this._path.style = style;
        }
        else {
            this._path.strokeColor = "gray";
        }
        this.addChild(this._path);
        for (var _i = 0, _a = this._path.segments; _i < _a.length; _i++) {
            var s = _a[_i];
            this.addSegmentHandle(s);
        }
        for (var _b = 0, _c = this._path.curves; _b < _c.length; _b++) {
            var c = _c[_b];
            this.addCurveHandle(c);
        }
    }
    StretchPath.prototype.addSegmentHandle = function (segment) {
        var handle = new PathHandle(segment);
        this._handles.push(handle);
        this.addChild(handle);
    };
    StretchPath.prototype.addCurveHandle = function (curve) {
        var _this = this;
        var handle = new PathHandle(curve);
        handle.curveSplit.subscribeOne(function (curveIdx) {
            _this.addCurveHandle(_this._path.curves[curveIdx]);
            _this.addCurveHandle(_this._path.curves[curveIdx + 1]);
        });
        this._handles.push(handle);
        this.addChild(handle);
    };
    StretchPath.HANDLE_RADIUS = 15;
    return StretchPath;
}(paper.Group));
var StretchyPath = (function (_super) {
    __extends(StretchyPath, _super);
    function StretchyPath(sourcePath, options, position, paths) {
        _super.call(this);
        this._options = options || {
            pathFillColor: 'gray'
        };
        this.setPath(sourcePath);
        if (position && position.length) {
            this.position = new paper.Point(position);
        }
        this.createOutline(paths);
        this.createSegmentMarkers();
        this.updateMidpiontMarkers();
        this.setEditElementsVisibility(false);
        this.arrangeContents();
        this.mouseBehavior = {};
        // // warning: MouseBehavior events are also set within WorkspaceController. 
        // //          Collision will happen eventually.
        // onOverStart: () => this.setEditElementsVisibility(true),
        // onOverEnd: () => this.setEditElementsVisibility(false)
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
    Object.defineProperty(StretchyPath.prototype, "blockSelected", {
        get: function () {
            return this.selected;
        },
        set: function (value) {
            this.selected = value;
            this.setEditElementsVisibility(value);
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
    /**
     * Get paths for outline sides, starting with top.
     */
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
    /**
     * paths should be clockwise: top is L -> R, bottom is R - L
     */
    StretchyPath.prototype.createOutline = function (paths) {
        var outline;
        if (paths) {
            var top_1 = new paper.Path();
            top_1.importJSON(paths.top);
            var bottom = new paper.Path();
            bottom.importJSON(paths.bottom);
            var segments = top_1.segments.concat(bottom.segments);
            outline = new paper.Path(segments);
            // get corners as outline segment references
            this.corners = [
                outline.segments[0],
                outline.segments[top_1.segments.length - 1],
                outline.segments[top_1.segments.length],
                outline.segments[outline.segments.length - 1]
            ];
        }
        else {
            var bounds = this.sourcePath.bounds;
            outline = new paper.Path(PaperHelpers.corners(this.sourcePath.bounds));
            // get corners as outline segment references
            this.corners = outline.segments.map(function (s) { return s; });
        }
        outline.closed = true;
        outline.dashArray = [5, 5];
        this.outline = outline;
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
        if (this.segmentMarkersGroup) {
            this.segmentMarkersGroup.remove();
        }
        var bounds = this.sourcePath.bounds;
        this.segmentMarkersGroup = new paper.Group();
        this.segmentMarkersGroup.bringToFront();
        for (var _i = 0, _a = this.outline.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            this.createSegmentHandle(segment);
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
                // upgrade to segment hangle
                _this.createSegmentHandle(newSegment);
                // remove midpoint handle
                handle.remove();
                _this.onOutlineChanged && _this.onOutlineChanged(_this.outline);
                _this.arrangeContents();
            };
            _this.midpointGroup.addChild(handle);
        });
        this.addChild(this.midpointGroup);
    };
    StretchyPath.prototype.createSegmentHandle = function (segment) {
        var _this = this;
        var handle = new SegmentHandle(segment);
        handle.onDragStart = function () { return _this.shapeChanged = true; };
        handle.onChangeComplete = function () {
            _this.onOutlineChanged && _this.onOutlineChanged(_this.outline);
            _this.arrangeContents();
        };
        this.segmentMarkersGroup.addChild(handle);
    };
    StretchyPath.OUTLINE_POINTS = 230;
    return StretchyPath;
}(paper.Group));
var StretchyText = (function (_super) {
    __extends(StretchyText, _super);
    function StretchyText(font, options, position, paths) {
        _super.call(this, StretchyText.getTextPath(font, options), options, position, paths);
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
function bootstrap() {
    var channels = new Channels();
    var actions = channels.actions, events = channels.events;
    actions.subscribe(function (x) { return console.log(x); });
    events.subscribe(function (x) { return console.log(x); });
    var rootStore = new Store(actions, events);
    var sketchEditor = new SketchEditor(actions);
    var sketchDom$ = events.merge(events.sketch.loaded, events.sketch.attrChanged)
        .map(function (m) { return sketchEditor.render(m.rootData.sketch); });
    ReactiveDom.renderStream(sketchDom$, document.getElementById('designer'));
    var selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), channels);
    var designerController = new DesignerController(channels, function () {
        actions.sketch.create.dispatch();
        actions.textBlock.add.dispatch({ text: "FIDDLESTICKS", textColor: "lightblue", fontSize: 128 });
    });
}
bootstrap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9fX2ZyYW1ld29yay9Gb250TG9hZGVyLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL0hlbHBlcnMudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL2V2ZW50cy50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJOb3RpZnkudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvcG9zdGFsL1RvcGljLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL3Bvc3RhbC9wb3N0YWwtb2JzZXJ2ZS50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay92ZG9tL0NvbXBvbmVudC50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay92ZG9tL1JlYWN0aXZlRG9tLnRzIiwiLi4vc3JjL19jb21tb24vQ2hhbm5lbHMudHMiLCIuLi9zcmMvX2NvbW1vbi9TdG9yZS50cyIsIi4uL3NyYy9fY29tbW9uL2NvbnN0YW50cy50cyIsIi4uL3NyYy9fY29tbW9uL21vZGVscy50cyIsIi4uL3NyYy9kZXNpZ25lci9Db2xvclBpY2tlci50cyIsIi4uL3NyYy9kZXNpZ25lci9EZXNpZ25lckNvbnRyb2xsZXIudHMiLCIuLi9zcmMvZGVzaWduZXIvU2VsZWN0ZWRJdGVtRWRpdG9yLnRzIiwiLi4vc3JjL2Rlc2lnbmVyL1NrZXRjaEVkaXRvci50cyIsIi4uL3NyYy9kZXNpZ25lci9UZXh0QmxvY2tFZGl0b3IudHMiLCIuLi9zcmMvZGVzaWduZXIvV29ya3NwYWNlQ29udHJvbGxlci50cyIsIi4uL3NyYy9tYXRoL1BlcnNwZWN0aXZlVHJhbnNmb3JtLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9DdXJ2ZVNwbGl0dGVySGFuZGxlLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9Nb3VzZUJlaGF2aW9yVG9vbC50cyIsIi4uL3NyYy93b3Jrc3BhY2UvUGFwZXJIZWxwZXJzLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9QYXRoSGFuZGxlLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9QYXRoU2VjdGlvbi50cyIsIi4uL3NyYy93b3Jrc3BhY2UvUGF0aFRyYW5zZm9ybS50cyIsIi4uL3NyYy93b3Jrc3BhY2UvU2VnbWVudEhhbmRsZS50cyIsIi4uL3NyYy93b3Jrc3BhY2UvU3RyZXRjaFBhdGgudHMiLCIuLi9zcmMvd29ya3NwYWNlL1N0cmV0Y2h5UGF0aC50cyIsIi4uL3NyYy93b3Jrc3BhY2UvU3RyZXRjaHlUZXh0LnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9UZXh0UnVsZXIudHMiLCIuLi9zcmMvd29ya3NwYWNlL1ZpZXdab29tLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9Xb3Jrc3BhY2UudHMiLCIuLi9zcmMvel9hcHAvYm9vdHN0cmFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0E7SUFJSSxvQkFBWSxPQUFlLEVBQUUsUUFBdUM7UUFDaEUsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBUyxHQUFHLEVBQUUsSUFBSTtZQUNyQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQ3JCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM5QixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0FBQyxBQWhCRCxJQWdCQztBQ2hCRCxnQkFBbUIsT0FBZSxFQUFFLE1BQXdCO0lBQ3hELE1BQU0sQ0FBQyxNQUFNLENBQUMs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LENBQUM7WUFDeEIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDbEUsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFD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QUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDcEcsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQsU0FBUyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuY2xhc3MgRm9udExvYWRlciB7XHJcblxyXG4gICAgaXNMb2FkZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udFVybDogc3RyaW5nLCBvbkxvYWRlZDogKGZvbnQ6IG9wZW50eXBlLkZvbnQpID0+IHZvaWQpIHtcclxuICAgICAgICBvcGVudHlwZS5sb2FkKGZvbnRVcmwsIGZ1bmN0aW9uKGVyciwgZm9udCkge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob25Mb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBvbkxvYWRlZC5jYWxsKHRoaXMsIGZvbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJcclxuZnVuY3Rpb24gbG9ndGFwPFQ+KG1lc3NhZ2U6IHN0cmluZywgc3RyZWFtOiBSeC5PYnNlcnZhYmxlPFQ+KTogUnguT2JzZXJ2YWJsZTxUPntcclxuICAgIHJldHVybiBzdHJlYW0udGFwKHQgPT4gY29uc29sZS5sb2cobWVzc2FnZSwgdCkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBuZXdpZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSgpLmdldFRpbWUoKStNYXRoLnJhbmRvbSgpKS50b1N0cmluZygzNik7XHJcbn1cclxuIiwiXHJcbm5hbWVzcGFjZSBUeXBlZENoYW5uZWwge1xyXG5cclxuICAgIC8vIC0tLSBDb3JlIHR5cGVzIC0tLVxyXG5cclxuICAgIHR5cGUgU2VyaWFsaXphYmxlID0gT2JqZWN0IHwgQXJyYXk8YW55PiB8IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBEYXRlIHwgdm9pZDtcclxuXHJcbiAgICB0eXBlIFZhbHVlID0gbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiB8IERhdGU7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlLCBUQ29udGV4dERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgZGF0YT86IFREYXRhO1xyXG4gICAgICAgIHJvb3REYXRhPzogVENvbnRleHREYXRhO1xyXG4gICAgICAgIG1ldGE/OiBPYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZSBJU3ViamVjdDxUPiA9IFJ4Lk9ic2VydmVyPFQ+ICYgUnguT2JzZXJ2YWJsZTxUPjtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbFRvcGljPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlLCBUQ29udGV4dERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgY2hhbm5lbDogSVN1YmplY3Q8TWVzc2FnZTxURGF0YSwgVENvbnRleHREYXRhPj47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoYW5uZWw6IElTdWJqZWN0PE1lc3NhZ2U8VERhdGEsIFRDb250ZXh0RGF0YT4+LCB0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YnNjcmliZShvYnNlcnZlcjogKG1lc3NhZ2U6IE1lc3NhZ2U8VERhdGEsIFRDb250ZXh0RGF0YT4pID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCkuc3Vic2NyaWJlKG9ic2VydmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRpc3BhdGNoKGRhdGE/OiBURGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwub25OZXh0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IF8uY2xvbmUoZGF0YSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXNwYXRjaENvbnRleHQoY29udGV4dDogVENvbnRleHREYXRhLCBkYXRhOiBURGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwub25OZXh0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgICAgICAgICAgIHJvb3REYXRhOiBjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogXy5jbG9uZShkYXRhKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9ic2VydmUoKTogUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhLCBUQ29udGV4dERhdGE+PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuZmlsdGVyKG0gPT4gbS50eXBlID09PSB0aGlzLnR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbDxUQ29udGV4dERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBzdWJqZWN0OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZSwgVENvbnRleHREYXRhPj47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN1YmplY3Q/OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZSwgVENvbnRleHREYXRhPj4sIHR5cGU/OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJqZWN0ID0gc3ViamVjdCB8fCBuZXcgUnguU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZSwgVENvbnRleHREYXRhPj4oKTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YnNjcmliZShvbk5leHQ/OiAodmFsdWU6IE1lc3NhZ2U8U2VyaWFsaXphYmxlLCBUQ29udGV4dERhdGE+KSA9PiB2b2lkKTogUnguSURpc3Bvc2FibGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LnN1YnNjcmliZShvbk5leHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9waWM8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+KHR5cGU6IHN0cmluZykgOiBDaGFubmVsVG9waWM8VERhdGEsIFRDb250ZXh0RGF0YT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENoYW5uZWxUb3BpYzxURGF0YSwgVENvbnRleHREYXRhPih0aGlzLnN1YmplY3QgYXMgSVN1YmplY3Q8TWVzc2FnZTxURGF0YSwgVENvbnRleHREYXRhPj4sXHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPyB0aGlzLnR5cGUgKyAnLicgKyB0eXBlIDogdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lcmdlVHlwZWQ8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+KC4uLnRvcGljczogQ2hhbm5lbFRvcGljPFREYXRhLCBUQ29udGV4dERhdGE+W10pIFxyXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YSwgVENvbnRleHREYXRhPj4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRvcGljcy5tYXAodCA9PiB0LnR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmZpbHRlcihtID0+IHR5cGVzLmluZGV4T2YobS50eXBlKSA+PSAwICkgYXMgUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhLCBUQ29udGV4dERhdGE+PjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVyZ2UoLi4udG9waWNzOiBDaGFubmVsVG9waWM8U2VyaWFsaXphYmxlLCBUQ29udGV4dERhdGE+W10pIFxyXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxTZXJpYWxpemFibGUsIFRDb250ZXh0RGF0YT4+IHtcclxuICAgICAgICAgICAgY29uc3QgdHlwZXMgPSB0b3BpY3MubWFwKHQgPT4gdC50eXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5maWx0ZXIobSA9PiB0eXBlcy5pbmRleE9mKG0udHlwZSkgPj0gMCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIiwiXHJcbmNsYXNzIE9ic2VydmFibGVFdmVudDxUPiB7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3N1YnNjcmliZXJzOiAoKGV2ZW50QXJnOiBUKSA9PiB2b2lkKVtdID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJzY3JpYmUgZm9yIG5vdGlmaWNhdGlvbi4gUmV0dXJucyB1bnN1YnNjcmliZSBmdW5jdGlvbi5cclxuICAgICAqLyAgICBcclxuICAgIHN1YnNjcmliZShjYWxsYmFjazogKGV2ZW50QXJnOiBUKSA9PiB2b2lkKTogKCgpID0+IHZvaWQpIHtcclxuICAgICAgICBpZih0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGNhbGxiYWNrKSA8IDApe1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihjYWxsYmFjaywgMCk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmb3Igb25lIG5vdGlmaWNhdGlvbi5cclxuICAgICAqL1xyXG4gICAgc3Vic2NyaWJlT25lKGNhbGxiYWNrOiAoZXZlbnRBcmc6IFQpID0+IHZvaWQpe1xyXG4gICAgICAgIGxldCB1bnN1YiA9IHRoaXMuc3Vic2NyaWJlKHQgPT4ge1xyXG4gICAgICAgICAgICB1bnN1YigpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayh0KTsgICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbm90aWZ5KGV2ZW50QXJnOiBUKXtcclxuICAgICAgICBmb3IobGV0IHN1YnNjcmliZXIgb2YgdGhpcy5fc3Vic2NyaWJlcnMpe1xyXG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNhbGwodGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBzdWJzY3JpYmVycy5cclxuICAgICAqL1xyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcclxuICAgIH1cclxufSIsIlxyXG5uYW1lc3BhY2UgQm9vdFNjcmlwdCB7XHJcblxyXG4gICAgaW50ZXJmYWNlIE1lbnVJdGVtIHtcclxuICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgYXR0cnM/OiBPYmplY3QsXHJcbiAgICAgICAgb25DbGljaz86ICgpID0+IHZvaWRcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZHJvcGRvd24oXHJcbiAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgICBpZDogc3RyaW5nLFxyXG4gICAgICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgICAgIGl0ZW1zOiBNZW51SXRlbVtdXHJcbiAgICAgICAgfSk6IFZOb2RlIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXYuZHJvcGRvd25cIiwgW1xyXG4gICAgICAgICAgICBoKFwiYnV0dG9uLmJ0bi5idG4tZGVmYXVsdC5kcm9wZG93bi10b2dnbGVcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImF0dHJzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFyZ3MuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS10b2dnbGVcIjogXCJkcm9wZG93blwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgYXJncy5jb250ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuLmNhcmV0XCIpXHJcbiAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgaChcInVsLmRyb3Bkb3duLW1lbnVcIixcclxuICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgYXJncy5pdGVtcy5tYXAoaXRlbSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJsaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoZXYpID0+IGl0ZW0ub25DbGljayAmJiBpdGVtLm9uQ2xpY2soKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKCdhJywge30sIFtpdGVtLmNvbnRlbnRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG50eXBlIEl0ZW1DaGFuZ2VIYW5kbGVyID0gKGZsYWdzOiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnKSA9PiB2b2lkO1xyXG50eXBlIENhbGxiYWNrID0gKCkgPT4gdm9pZDtcclxuXHJcbmRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcclxuICAgIGludGVyZmFjZSBJdGVtIHtcclxuICAgICAgICBcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBPYnNlcnZlIGFsbCBjaGFuZ2VzIGluIGl0ZW0uIFJldHVybnMgdW4tb2JzZXJ2ZSBmdW5jdGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBvYnNlcnZlKGhhbmRsZXI6IEl0ZW1DaGFuZ2VIYW5kbGVyKTogQ2FsbGJhY2s7XHJcbiAgICB9XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBQYXBlck5vdGlmeSB7XHJcblxyXG4gICAgZXhwb3J0IGVudW0gQ2hhbmdlRmxhZyB7XHJcbiAgICAgICAgLy8gQW55dGhpbmcgYWZmZWN0aW5nIHRoZSBhcHBlYXJhbmNlIG9mIGFuIGl0ZW0sIGluY2x1ZGluZyBHRU9NRVRSWSxcclxuICAgICAgICAvLyBTVFJPS0UsIFNUWUxFIGFuZCBBVFRSSUJVVEUgKGV4Y2VwdCBmb3IgdGhlIGludmlzaWJsZSBvbmVzOiBsb2NrZWQsIG5hbWUpXHJcbiAgICAgICAgQVBQRUFSQU5DRSA9IDB4MSxcclxuICAgICAgICAvLyBBIGNoYW5nZSBpbiB0aGUgaXRlbSdzIGNoaWxkcmVuXHJcbiAgICAgICAgQ0hJTERSRU4gPSAweDIsXHJcbiAgICAgICAgLy8gQSBjaGFuZ2Ugb2YgdGhlIGl0ZW0ncyBwbGFjZSBpbiB0aGUgc2NlbmUgZ3JhcGggKHJlbW92ZWQsIGluc2VydGVkLFxyXG4gICAgICAgIC8vIG1vdmVkKS5cclxuICAgICAgICBJTlNFUlRJT04gPSAweDQsXHJcbiAgICAgICAgLy8gSXRlbSBnZW9tZXRyeSAocGF0aCwgYm91bmRzKVxyXG4gICAgICAgIEdFT01FVFJZID0gMHg4LFxyXG4gICAgICAgIC8vIE9ubHkgc2VnbWVudChzKSBoYXZlIGNoYW5nZWQsIGFuZCBhZmZlY3RlZCBjdXJ2ZXMgaGF2ZSBhbHJlYWR5IGJlZW5cclxuICAgICAgICAvLyBub3RpZmllZC4gVGhpcyBpcyB0byBpbXBsZW1lbnQgYW4gb3B0aW1pemF0aW9uIGluIF9jaGFuZ2VkKCkgY2FsbHMuXHJcbiAgICAgICAgU0VHTUVOVFMgPSAweDEwLFxyXG4gICAgICAgIC8vIFN0cm9rZSBnZW9tZXRyeSAoZXhjbHVkaW5nIGNvbG9yKVxyXG4gICAgICAgIFNUUk9LRSA9IDB4MjAsXHJcbiAgICAgICAgLy8gRmlsbCBzdHlsZSBvciBzdHJva2UgY29sb3IgLyBkYXNoXHJcbiAgICAgICAgU1RZTEUgPSAweDQwLFxyXG4gICAgICAgIC8vIEl0ZW0gYXR0cmlidXRlczogdmlzaWJsZSwgYmxlbmRNb2RlLCBsb2NrZWQsIG5hbWUsIG9wYWNpdHksIGNsaXBNYXNrIC4uLlxyXG4gICAgICAgIEFUVFJJQlVURSA9IDB4ODAsXHJcbiAgICAgICAgLy8gVGV4dCBjb250ZW50XHJcbiAgICAgICAgQ09OVEVOVCA9IDB4MTAwLFxyXG4gICAgICAgIC8vIFJhc3RlciBwaXhlbHNcclxuICAgICAgICBQSVhFTFMgPSAweDIwMCxcclxuICAgICAgICAvLyBDbGlwcGluZyBpbiBvbmUgb2YgdGhlIGNoaWxkIGl0ZW1zXHJcbiAgICAgICAgQ0xJUFBJTkcgPSAweDQwMCxcclxuICAgICAgICAvLyBUaGUgdmlldyBoYXMgYmVlbiB0cmFuc2Zvcm1lZFxyXG4gICAgICAgIFZJRVcgPSAweDgwMFxyXG4gICAgfVxyXG5cclxuICAgIC8vIFNob3J0Y3V0cyB0byBvZnRlbiB1c2VkIENoYW5nZUZsYWcgdmFsdWVzIGluY2x1ZGluZyBBUFBFQVJBTkNFXHJcbiAgICBleHBvcnQgZW51bSBDaGFuZ2VzIHtcclxuICAgICAgICAvLyBDSElMRFJFTiBhbHNvIGNoYW5nZXMgR0VPTUVUUlksIHNpbmNlIHJlbW92aW5nIGNoaWxkcmVuIGZyb20gZ3JvdXBzXHJcbiAgICAgICAgLy8gY2hhbmdlcyBib3VuZHMuXHJcbiAgICAgICAgQ0hJTERSRU4gPSBDaGFuZ2VGbGFnLkNISUxEUkVOIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICAvLyBDaGFuZ2luZyB0aGUgaW5zZXJ0aW9uIGNhbiBjaGFuZ2UgdGhlIGFwcGVhcmFuY2UgdGhyb3VnaCBwYXJlbnQncyBtYXRyaXguXHJcbiAgICAgICAgSU5TRVJUSU9OID0gQ2hhbmdlRmxhZy5JTlNFUlRJT04gfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgR0VPTUVUUlkgPSBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNFR01FTlRTID0gQ2hhbmdlRmxhZy5TRUdNRU5UUyB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgU1RST0tFID0gQ2hhbmdlRmxhZy5TVFJPS0UgfCBDaGFuZ2VGbGFnLlNUWUxFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNUWUxFID0gQ2hhbmdlRmxhZy5TVFlMRSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBBVFRSSUJVVEUgPSBDaGFuZ2VGbGFnLkFUVFJJQlVURSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBDT05URU5UID0gQ2hhbmdlRmxhZy5DT05URU5UIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBQSVhFTFMgPSBDaGFuZ2VGbGFnLlBJWEVMUyB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBWSUVXID0gQ2hhbmdlRmxhZy5WSUVXIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFXHJcbiAgICB9O1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEluamVjdCBJdGVtLm9ic2VydmVcclxuICAgICAgICBjb25zdCBpdGVtUHJvdG8gPSA8YW55PnBhcGVyLkl0ZW0ucHJvdG90eXBlO1xyXG4gICAgICAgIGl0ZW1Qcm90by5vYnNlcnZlID0gZnVuY3Rpb24oaGFuZGxlcjogSXRlbUNoYW5nZUhhbmRsZXIpOiBDYWxsYmFjayB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fb2JzZXJ2ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vYnNlcnZlcnMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fb2JzZXJ2ZXJzLmluZGV4T2YoaGFuZGxlcikgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vYnNlcnZlcnMucHVzaChoYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fb2JzZXJ2ZXJzLmluZGV4T2YoaGFuZGxlciwgMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29ic2VydmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXcmFwIEl0ZW0ucmVtb3ZlXHJcbiAgICAgICAgY29uc3QgaXRlbVJlbW92ZSA9IGl0ZW1Qcm90by5yZW1vdmU7XHJcbiAgICAgICAgaXRlbVByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdGVtUmVtb3ZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIHRoaXMuX29ic2VydmVycyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXcmFwIFByb2plY3QuX2NoYW5nZWRcclxuICAgICAgICBjb25zdCBwcm9qZWN0UHJvdG8gPSA8YW55PnBhcGVyLlByb2plY3QucHJvdG90eXBlO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RDaGFuZ2VkID0gcHJvamVjdFByb3RvLl9jaGFuZ2VkO1xyXG4gICAgICAgIHByb2plY3RQcm90by5fY2hhbmdlZCA9IGZ1bmN0aW9uKGZsYWdzOiBDaGFuZ2VGbGFnLCBpdGVtOiBwYXBlci5JdGVtKSB7XHJcbiAgICAgICAgICAgIHByb2plY3RDaGFuZ2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJzID0gKDxhbnk+aXRlbSkuX29ic2VydmVycztcclxuICAgICAgICAgICAgICAgIGlmIChzdWJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcyBvZiBzdWJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuY2FsbChpdGVtLCBmbGFncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGVzY3JpYmUoZmxhZ3M6IENoYW5nZUZsYWcpe1xyXG4gICAgICAgIGxldCBkZXNjID0gQ2hhbmdlRmxhZ1tmbGFnc107XHJcbiAgICAgICAgaWYgKGRlc2Mpe1xyXG4gICAgICAgICAgICByZXR1cm4gXCJDaGFuZ2VGbGFnLlwiICsgZGVzYztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVzYyA9IENoYW5nZXNbZmxhZ3NdO1xyXG4gICAgICAgIGlmKGRlc2Mpe1xyXG4gICAgICAgICAgICByZXR1cm4gXCJDaGFuZ2VzLlwiICsgZGVzYztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdG9kbzogc3VwcG9ydCBhcmJpdHJhcnkgZmxhZyBjb21ib3NcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblBhcGVyTm90aWZ5LmluaXRpYWxpemUoKTtcclxuIiwiXHJcbi8vIGNsYXNzIE9sZFRvcGljPFQ+IHtcclxuXHJcbi8vICAgICBwcml2YXRlIF9jaGFubmVsOiBJQ2hhbm5lbERlZmluaXRpb248T2JqZWN0PjtcclxuLy8gICAgIHByaXZhdGUgX25hbWU6IHN0cmluZztcclxuXHJcbi8vICAgICBjb25zdHJ1Y3RvcihjaGFubmVsOiBJQ2hhbm5lbERlZmluaXRpb248T2JqZWN0PiwgdG9waWM6IHN0cmluZykge1xyXG4vLyAgICAgICAgIHRoaXMuX2NoYW5uZWwgPSBjaGFubmVsO1xyXG4vLyAgICAgICAgIHRoaXMuX25hbWUgPSB0b3BpYztcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiA8UnguT2JzZXJ2YWJsZTxUPj50aGlzLl9jaGFubmVsLm9ic2VydmUodGhpcy5fbmFtZSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHVibGlzaChkYXRhOiBUKSB7XHJcbi8vICAgICAgICAgdGhpcy5fY2hhbm5lbC5wdWJsaXNoKHRoaXMuX25hbWUsIGRhdGEpO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHN1YnNjcmliZShjYWxsYmFjazogSUNhbGxiYWNrPFQ+KTogSVN1YnNjcmlwdGlvbkRlZmluaXRpb248VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiB0aGlzLl9jaGFubmVsLnN1YnNjcmliZSh0aGlzLl9uYW1lLCBjYWxsYmFjayk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHJvdGVjdGVkIHN1YnRvcGljKG5hbWUpOiBDaGFubmVsVG9waWM8VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiBuZXcgQ2hhbm5lbFRvcGljPFQ+KHRoaXMuX2NoYW5uZWwsIHRoaXMuX25hbWUgKyAnLicgKyBuYW1lKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBwcm90ZWN0ZWQgc3VidG9waWNPZjxVIGV4dGVuZHMgVD4obmFtZSk6IENoYW5uZWxUb3BpYzxVPiB7XHJcbi8vICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VT4odGhpcy5fY2hhbm5lbCwgdGhpcy5fbmFtZSArICcuJyArIG5hbWUpO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcbiIsIlxyXG5pbnRlcmZhY2UgSVBvc3RhbCB7XHJcbiAgICBvYnNlcnZlOiAob3B0aW9uczogUG9zdGFsT2JzZXJ2ZU9wdGlvbnMpID0+IFJ4Lk9ic2VydmFibGU8YW55PjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFBvc3RhbE9ic2VydmVPcHRpb25zIHtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIHRvcGljOiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJQ2hhbm5lbERlZmluaXRpb248VD4ge1xyXG4gICAgb2JzZXJ2ZSh0b3BpYzogc3RyaW5nKTogUnguT2JzZXJ2YWJsZTxUPjtcclxufVxyXG5cclxucG9zdGFsLm9ic2VydmUgPSBmdW5jdGlvbihvcHRpb25zOiBQb3N0YWxPYnNlcnZlT3B0aW9ucykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGNoYW5uZWwgPSBvcHRpb25zLmNoYW5uZWw7XHJcbiAgICB2YXIgdG9waWMgPSBvcHRpb25zLnRvcGljO1xyXG5cclxuICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm4oXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkSGFuZGxlcihoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgICAgICBjaGFubmVsOiBjaGFubmVsLFxyXG4gICAgICAgICAgICAgICAgdG9waWM6IHRvcGljLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsSGFuZGxlcihfLCBzdWIpIHtcclxuICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufTtcclxuXHJcbi8vIGFkZCBvYnNlcnZlIHRvIENoYW5uZWxEZWZpbml0aW9uXHJcbig8YW55PnBvc3RhbCkuQ2hhbm5lbERlZmluaXRpb24ucHJvdG90eXBlLm9ic2VydmUgPSBmdW5jdGlvbih0b3BpYzogc3RyaW5nKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybihcclxuICAgICAgICBmdW5jdGlvbiBhZGRIYW5kbGVyKGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuYnVzLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgICAgICBjaGFubmVsOiBzZWxmLmNoYW5uZWwsXHJcbiAgICAgICAgICAgICAgICB0b3BpYzogdG9waWMsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogaCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiBkZWxIYW5kbGVyKF8sIHN1Yikge1xyXG4gICAgICAgICAgICBzdWIudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG59O1xyXG4iLCJcclxuYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50PFQ+IHtcclxuICAgIGFic3RyYWN0IHJlbmRlcihkYXRhOiBUKTogVk5vZGU7XHJcbn0iLCJcclxuaW50ZXJmYWNlIFJlYWN0aXZlRG9tQ29tcG9uZW50IHtcclxuICAgIGRvbSQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+O1xyXG59XHJcblxyXG5jbGFzcyBSZWFjdGl2ZURvbSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSByZWFjdGl2ZSBjb21wb25lbnQgd2l0aGluIGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlclN0cmVhbShcclxuICAgICAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPixcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50XHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBjb250YWluZXIuaWQ7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQ6IEhUTUxFbGVtZW50IHwgVk5vZGUgPSBjb250YWluZXI7XHJcbiAgICAgICAgY29uc3Qgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGRvbSQuc3Vic2NyaWJlKGRvbSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFkb20pIHJldHVybjtcclxuLy9jb25zb2xlLmxvZygncmVuZGVyaW5nIGRvbScsIGRvbSk7IC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gcmV0YWluIElEXHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGNoZWQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xyXG4gICAgICAgICAgICBpZihpZCAmJiAhcGF0Y2hlZC5lbG0uaWQpe1xyXG4gICAgICAgICAgICAgICAgcGF0Y2hlZC5lbG0uaWQgPSBpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoZWQ7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciBhIHJlYWN0aXZlIGNvbXBvbmVudCB3aXRoaW4gY29udGFpbmVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyQ29tcG9uZW50KFxyXG4gICAgICAgIGNvbXBvbmVudDogUmVhY3RpdmVEb21Db21wb25lbnQsXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudCB8IFZOb2RlXHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjb250YWluZXI7XHJcbiAgICAgICAgbGV0IHNpbmsgPSBuZXcgUnguU3ViamVjdDxWTm9kZT4oKTtcclxuICAgICAgICBjb21wb25lbnQuZG9tJC5zdWJzY3JpYmUoZG9tID0+IHtcclxuICAgICAgICAgICAgaWYoIWRvbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIHdpdGhpbiBjb250YWluZXIgd2hlbmV2ZXIgc291cmNlIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsaXZlUmVuZGVyPFQ+KFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZSxcclxuICAgICAgICBzb3VyY2U6IFJ4Lk9ic2VydmFibGU8VD4sXHJcbiAgICAgICAgcmVuZGVyOiAobmV4dDogVCkgPT4gVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gcmVuZGVyKGRhdGEpO1xyXG4gICAgICAgICAgICBpZighbm9kZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgbm9kZSk7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbn0iLCJcclxuY2xhc3MgQWN0aW9ucyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsPHZvaWQ+IHtcclxuICAgIFxyXG4gICAgZGVzaWduZXIgPSB7XHJcbiAgICAgICAgc2F2ZUxvY2FsOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuc2F2ZWxvY2FsXCIpLFxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2tldGNoID0ge1xyXG4gICAgICAgIGNyZWF0ZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5jcmVhdGVcIiksXHJcbiAgICAgICAgYXR0clVwZGF0ZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5hdHRydXBkYXRlXCIpLFxyXG4gICAgICAgIHNldEVkaXRpbmdJdGVtOiB0aGlzLnRvcGljPFBvc2l0aW9uZWRJdGVtPihcInNrZXRjaC5zZXRlZGl0aW5naXRlbVwiKSxcclxuICAgICAgICBzZXRTZWxlY3Rpb246IHRoaXMudG9waWM8SXRlbVNlbGVjdGlvbj4oXCJza2V0Y2guc2V0c2VsZWN0aW9uXCIpLFxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGV4dEJsb2NrID0ge1xyXG4gICAgICAgIGFkZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFkZFwiKSxcclxuICAgICAgICB1cGRhdGVBdHRyOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sudXBkYXRlYXR0clwiKSxcclxuICAgICAgICB1cGRhdGVBcnJhbmdlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sudXBkYXRlYXJyYW5nZVwiKSxcclxuICAgICAgICByZW1vdmU6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5yZW1vdmVcIilcclxuICAgIH07XHJcbiAgICBcclxufVxyXG5cclxuY2xhc3MgRXZlbnRzIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWw8QXBwU3RhdGU+IHtcclxuICAgIFxyXG4gICAgZGVzaWduZXIgPSB7XHJcbiAgICAgICAgc2F2ZUxvY2FsUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwic2F2ZWxvY2FsUmVxdWVzdGVkXCIpLFxyXG4gICAgICAgIGJhY2tncm91bmRBY3Rpb25Db21wbGV0ZWQ6IHRoaXMudG9waWM8QmFja2dyb3VuZEFjdGlvblN0YXR1cz4oXCJiYWNrZ3JvdW5kQWN0aW9uQ29tcGxldGVkXCIpLFxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2tldGNoID0ge1xyXG4gICAgICAgIGxvYWRlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmxvYWRlZFwiKSxcclxuICAgICAgICBhdHRyQ2hhbmdlZDogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5hdHRyY2hhbmdlZFwiKSxcclxuICAgICAgICBlZGl0aW5nSXRlbUNoYW5nZWQ6IHRoaXMudG9waWM8UG9zaXRpb25lZEl0ZW0+KFwic2tldGNoLmVkaXRpbmdpdGVtY2hhbmdlZFwiKSxcclxuICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkOiB0aGlzLnRvcGljPEl0ZW1TZWxlY3Rpb24+KFwic2tldGNoLnNlbGVjdGlvbmNoYW5nZWRcIiksXHJcbiAgICAgICAgc2F2ZUxvY2FsUmVxdWVzdGVkOiB0aGlzLnRvcGljPEl0ZW1TZWxlY3Rpb24+KFwic2tldGNoLnNhdmVsb2NhbC5yZXF1ZXN0ZWRcIilcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRleHRibG9jayA9IHtcclxuICAgICAgICBhZGRlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFkZGVkXCIpLFxyXG4gICAgICAgIGF0dHJDaGFuZ2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYXR0cmNoYW5nZWRcIiksXHJcbiAgICAgICAgYXJyYW5nZUNoYW5nZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hcnJhbmdlY2hhbmdlZFwiKSxcclxuICAgICAgICByZW1vdmVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sucmVtb3ZlZFwiKSxcclxuICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5sb2FkZWRcIiksXHJcbiAgICB9O1xyXG4gICAgXHJcbn1cclxuXHJcbmNsYXNzIENoYW5uZWxzIHtcclxuICAgIGFjdGlvbnM6IEFjdGlvbnMgPSBuZXcgQWN0aW9ucygpO1xyXG4gICAgZXZlbnRzOiBFdmVudHMgPSBuZXcgRXZlbnRzKCk7XHJcbn1cclxuIiwiXHJcbmNsYXNzIFN0b3JlIHtcclxuXHJcbiAgICBzdGF0ZSA9IHRoaXMuY3JlYXRlQXBwU3RhdGUoKTtcclxuICAgIGFjdGlvbnM6IEFjdGlvbnM7XHJcbiAgICBldmVudHM6IEV2ZW50cztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBhY3Rpb25zOiBBY3Rpb25zLFxyXG4gICAgICAgIGV2ZW50czogRXZlbnRzKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IGFjdGlvbnM7XHJcbiAgICAgICAgdGhpcy5ldmVudHMgPSBldmVudHM7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIERlc2lnbmVyIC0tLS0tXHJcblxyXG4gICAgICAgIGFjdGlvbnMuZGVzaWduZXIuc2F2ZUxvY2FsLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUpO1xyXG5jb25zb2xlLmxvZygnc3RhdGUnLCBqc29uKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBKU09OLnBhcnNlKGpzb24pO1xyXG5jb25zb2xlLmxvZygnc3RhdGUgbG9hZGVkJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2gubG9hZGVkLmRpc3BhdGNoQ29udGV4dChcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUsIHRoaXMuc3RhdGUuc2tldGNoKTtcclxuICAgICAgICAgICAgZm9yKGNvbnN0IHRiIG9mIHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3Mpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmxvYWRlZC5kaXNwYXRjaENvbnRleHQoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLCB0Yik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIC0tLS0tIFNrZXRjaCAtLS0tLVxyXG5cclxuICAgICAgICBhY3Rpb25zLnNrZXRjaC5jcmVhdGVcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgobSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2ggPSB0aGlzLmNyZWF0ZVNrZXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IG0uZGF0YSB8fCB7fTtcclxuICAgICAgICAgICAgICAgIGF0dHIuYmFja2dyb3VuZENvbG9yID0gYXR0ci5iYWNrZ3JvdW5kQ29sb3IgfHwgJyNmNmYzZWInO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guYXR0ciA9IGF0dHI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2gubG9hZGVkLmRpc3BhdGNoQ29udGV4dCh0aGlzLnN0YXRlLCB0aGlzLnN0YXRlLnNrZXRjaCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnNrZXRjaC5hdHRyVXBkYXRlXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ24odGhpcy5zdGF0ZS5za2V0Y2guYXR0ciwgZXYuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQuZGlzcGF0Y2hDb250ZXh0KHRoaXMuc3RhdGUsIHRoaXMuc3RhdGUuc2tldGNoLmF0dHIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guc2V0RWRpdGluZ0l0ZW0uc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBpZiAobS5kYXRhLml0ZW1UeXBlICE9PSBcIlRleHRCbG9ja1wiKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBgVW5oYW5kbGVkIHR5cGUgJHttLnR5cGV9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5nZXRCbG9jayhtLmRhdGEuaXRlbUlkKTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guZWRpdGluZ0l0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtSWQ6IG0uZGF0YS5pdGVtSWQsXHJcbiAgICAgICAgICAgICAgICBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIixcclxuICAgICAgICAgICAgICAgIGl0ZW06IGl0ZW0sXHJcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBtLmRhdGEuY2xpZW50WCxcclxuICAgICAgICAgICAgICAgIGNsaWVudFk6IG0uZGF0YS5jbGllbnRZXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGV2ZW50cy5za2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkLmRpc3BhdGNoQ29udGV4dChcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUsIHRoaXMuc3RhdGUuc2tldGNoLmVkaXRpbmdJdGVtKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgaWYgKG0uZGF0YS5pdGVtVHlwZSAmJiBtLmRhdGEuaXRlbVR5cGUgIT09IFwiVGV4dEJsb2NrXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGBVbmhhbmRsZWQgdHlwZSAke20udHlwZX1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZigobS5kYXRhICYmIG0uZGF0YS5pdGVtSWQpIFxyXG4gICAgICAgICAgICAgICAgPT09ICh0aGlzLnN0YXRlLnNrZXRjaC5zZWxlY3Rpb24gJiYgdGhpcy5zdGF0ZS5za2V0Y2guc2VsZWN0aW9uLml0ZW1JZCkpe1xyXG4gICAgICAgICAgICAgICAgLy8gbm90aGluZyB0byBkb1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaC5zZWxlY3Rpb24gPSA8SXRlbVNlbGVjdGlvbj57XHJcbiAgICAgICAgICAgICAgICBpdGVtSWQ6IG0uZGF0YS5pdGVtSWQsXHJcbiAgICAgICAgICAgICAgICBpdGVtVHlwZTogbS5kYXRhLml0ZW1UeXBlLFxyXG4gICAgICAgICAgICAgICAgcHJpb3JTZWxlY3Rpb25JdGVtSWQ6IHRoaXMuc3RhdGUuc2tldGNoLnNlbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5zdGF0ZS5za2V0Y2guc2VsZWN0aW9uLml0ZW1JZFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBldmVudHMuc2tldGNoLnNlbGVjdGlvbkNoYW5nZWQuZGlzcGF0Y2hDb250ZXh0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSwgdGhpcy5zdGF0ZS5za2V0Y2guc2VsZWN0aW9uKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gVGV4dEJsb2NrIC0tLS0tXHJcblxyXG4gICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLmFkZFxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXRjaCA9IGV2LmRhdGE7XHJcbiAgICAgICAgICAgICAgICBpZighcGF0Y2gudGV4dCB8fCAhcGF0Y2gudGV4dC5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHsgX2lkOiBuZXdpZCgpIH0gYXMgVGV4dEJsb2NrO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ24oYmxvY2ssIHBhdGNoKTtcclxuICAgICAgICAgICAgICAgIGlmKCFibG9jay5mb250U2l6ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZm9udFNpemUgPSA2NDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKCFibG9jay50ZXh0Q29sb3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnRleHRDb2xvciA9IFwiZ3JheVwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmFkZGVkLmRpc3BhdGNoQ29udGV4dCh0aGlzLnN0YXRlLCBibG9jayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5nZXRCbG9jayhldi5kYXRhLl9pZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGF0Y2ggPSA8VGV4dEJsb2NrPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXYuZGF0YS50ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGV2LmRhdGEuYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Q29sb3I6IGV2LmRhdGEudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBldi5kYXRhLmZvbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBldi5kYXRhLmZvbnRTaXplICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hc3NpZ24oYmxvY2ssIHBhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQuZGlzcGF0Y2hDb250ZXh0KHRoaXMuc3RhdGUsIGJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBkaWREZWxldGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIF8ucmVtb3ZlKHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsIHRiID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGIuX2lkID09PSBldi5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWREZWxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5kaXNwYXRjaENvbnRleHQodGhpcy5zdGF0ZSwgeyBfaWQ6IGV2LmRhdGEuX2lkIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNrZXRjaC5lZGl0aW5nSXRlbS5pdGVtSWQgPT0gZXYuZGF0YS5faWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guZWRpdGluZ0l0ZW0gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2guZWRpdGluZ0l0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2VcclxuICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB0aGlzLmdldEJsb2NrKGV2LmRhdGEuX2lkKTtcclxuICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnBvc2l0aW9uID0gZXYuZGF0YS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5vdXRsaW5lID0gZXYuZGF0YS5vdXRsaW5lO1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXJyYW5nZUNoYW5nZWQuZGlzcGF0Y2hDb250ZXh0KHRoaXMuc3RhdGUsIGJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXNzaWduPFQ+KGRlc3Q6IFQsIHNvdXJjZTogVCkge1xyXG4gICAgICAgIF8ubWVyZ2UoZGVzdCwgc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVBcHBTdGF0ZSgpIDogQXBwU3RhdGUge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNrZXRjaDogdGhpcy5jcmVhdGVTa2V0Y2goKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTa2V0Y2goKSA6IFNrZXRjaCB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYXR0cjoge30sIFxyXG4gICAgICAgICAgICB0ZXh0QmxvY2tzOiA8VGV4dEJsb2NrW10+W10gXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBnZXRCbG9jayhpZDogc3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsIHRiID0+IHRiLl9pZCA9PT0gaWQpO1xyXG4gICAgfVxyXG59IiwiXHJcbnR5cGUgQWN0aW9uVHlwZXMgPSBcclxuICAgIFwic2tldGNoLmNyZWF0ZVwiXHJcbiAgICB8IFwic2tldGNoLnVwZGF0ZVwiXHJcbiAgICB8IFwidGV4dGJsb2NrLmFkZFwiXHJcbiAgICB8IFwidGV4dGJsb2NrLnVwZGF0ZVwiO1xyXG5cclxudHlwZSBFdmVudFR5cGVzID1cclxuICAgIFwic2tldGNoLmxvYWRlZFwiXHJcbiAgICB8IFwic2tldGNoLmNoYW5nZWRcIlxyXG4gICAgfCBcInRleHRibG9jay5hZGRlZFwiXHJcbiAgICB8IFwidGV4dGJsb2NrLmNoYW5nZWRcIjtcclxuIiwiXHJcbmludGVyZmFjZSBBcHBTdGF0ZSB7XHJcbiAgICBza2V0Y2g6IFNrZXRjaDtcclxufVxyXG5cclxuaW50ZXJmYWNlIFNrZXRjaCB7XHJcbiAgICBhdHRyOiBTa2V0Y2hBdHRyO1xyXG4gICAgdGV4dEJsb2NrczogVGV4dEJsb2NrW107XHJcbiAgICBzZWxlY3Rpb24/OiBJdGVtU2VsZWN0aW9uO1xyXG4gICAgZWRpdGluZ0l0ZW0/OiBQb3NpdGlvbmVkSXRlbTtcclxufVxyXG5cclxuaW50ZXJmYWNlIFNrZXRjaEF0dHIge1xyXG4gICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUG9zaXRpb25lZEl0ZW0ge1xyXG4gICAgaXRlbUlkPzogc3RyaW5nO1xyXG4gICAgaXRlbVR5cGU/OiBzdHJpbmc7XHJcbiAgICBpdGVtPzogT2JqZWN0O1xyXG4gICAgY2xpZW50WD86IG51bWJlcjtcclxuICAgIGNsaWVudFk/OiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJdGVtU2VsZWN0aW9uIHtcclxuICAgIGl0ZW1JZD86IHN0cmluZztcclxuICAgIGl0ZW1UeXBlPzogc3RyaW5nO1xyXG4gICAgcHJpb3JTZWxlY3Rpb25JdGVtSWQ/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBUZXh0QmxvY2sgZXh0ZW5kcyBCbG9ja0FycmFuZ2VtZW50IHtcclxuICAgIF9pZD86IHN0cmluZztcclxuICAgIHRleHQ/OiBzdHJpbmc7XHJcbiAgICB0ZXh0Q29sb3I/OiBzdHJpbmc7XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgICBmb250Pzogc3RyaW5nO1xyXG4gICAgZm9udFNpemU/OiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBCbG9ja0FycmFuZ2VtZW50IHtcclxuICAgIHBvc2l0aW9uPzogbnVtYmVyW10sXHJcbiAgICBvdXRsaW5lPzoge1xyXG4gICAgICAgIHRvcDogYW55LFxyXG4gICAgICAgIGJvdHRvbTogYW55XHJcbiAgICB9ICAgIFxyXG59XHJcblxyXG5pbnRlcmZhY2UgQmFja2dyb3VuZEFjdGlvblN0YXR1cyB7XHJcbiAgICBhY3Rpb24/OiBPYmplY3Q7XHJcbiAgICByZWplY3RlZD86IGJvb2xlYW47XHJcbiAgICBlcnJvcj86IGJvb2xlYW5cclxuICAgIG1lc3NhZ2U/OiBzdHJpbmc7XHJcbn0iLCJcclxuY2xhc3MgQ29sb3JQaWNrZXIge1xyXG4gICAgc3RhdGljIHNldHVwKGVsZW0sIG9uQ2hhbmdlKSB7XHJcbiAgICAgICAgbGV0IHNlbCA9IDxhbnk+JChlbGVtKTtcclxuICAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bSh7XHJcbiAgICAgICAgICAgIHNob3dJbnB1dDogdHJ1ZSxcclxuICAgICAgICAgICAgYWxsb3dFbXB0eTogdHJ1ZSxcclxuICAgICAgICAgICAgcHJlZmVycmVkRm9ybWF0OiBcImhleFwiLFxyXG4gICAgICAgICAgICBzaG93QnV0dG9uczogZmFsc2UsXHJcbiAgICAgICAgICAgIHNob3dBbHBoYTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd1BhbGV0dGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dTZWxlY3Rpb25QYWxldHRlOiB0cnVlLFxyXG4gICAgICAgICAgICBwYWxldHRlOiBbXHJcbiAgICAgICAgICAgICAgICBbXCIjMDAwXCIsIFwiIzQ0NFwiLCBcIiM2NjZcIiwgXCIjOTk5XCIsIFwiI2NjY1wiLCBcIiNlZWVcIiwgXCIjZjNmM2YzXCIsIFwiI2ZmZlwiXSxcclxuICAgICAgICAgICAgICAgIFtcIiNmMDBcIiwgXCIjZjkwXCIsIFwiI2ZmMFwiLCBcIiMwZjBcIiwgXCIjMGZmXCIsIFwiIzAwZlwiLCBcIiM5MGZcIiwgXCIjZjBmXCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiI2Y0Y2NjY1wiLCBcIiNmY2U1Y2RcIiwgXCIjZmZmMmNjXCIsIFwiI2Q5ZWFkM1wiLCBcIiNkMGUwZTNcIiwgXCIjY2ZlMmYzXCIsIFwiI2Q5ZDJlOVwiLCBcIiNlYWQxZGNcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjZWE5OTk5XCIsIFwiI2Y5Y2I5Y1wiLCBcIiNmZmU1OTlcIiwgXCIjYjZkN2E4XCIsIFwiI2EyYzRjOVwiLCBcIiM5ZmM1ZThcIiwgXCIjYjRhN2Q2XCIsIFwiI2Q1YTZiZFwiXSxcclxuICAgICAgICAgICAgICAgIFtcIiNlMDY2NjZcIiwgXCIjZjZiMjZiXCIsIFwiI2ZmZDk2NlwiLCBcIiM5M2M0N2RcIiwgXCIjNzZhNWFmXCIsIFwiIzZmYThkY1wiLCBcIiM4ZTdjYzNcIiwgXCIjYzI3YmEwXCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiI2MwMFwiLCBcIiNlNjkxMzhcIiwgXCIjZjFjMjMyXCIsIFwiIzZhYTg0ZlwiLCBcIiM0NTgxOGVcIiwgXCIjM2Q4NWM2XCIsIFwiIzY3NGVhN1wiLCBcIiNhNjRkNzlcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjOTAwXCIsIFwiI2I0NWYwNlwiLCBcIiNiZjkwMDBcIiwgXCIjMzg3NjFkXCIsIFwiIzEzNGY1Y1wiLCBcIiMwYjUzOTRcIiwgXCIjMzUxYzc1XCIsIFwiIzc0MWI0N1wiXSxcclxuICAgICAgICAgICAgICAgIFtcIiM2MDBcIiwgXCIjNzgzZjA0XCIsIFwiIzdmNjAwMFwiLCBcIiMyNzRlMTNcIiwgXCIjMGMzNDNkXCIsIFwiIzA3Mzc2M1wiLCBcIiMyMDEyNGRcIiwgXCIjNGMxMTMwXCJdXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZUtleTogXCJza2V0Y2h0ZXh0XCIsXHJcbiAgICAgICAgICAgIGNoYW5nZTogb25DaGFuZ2VcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHN0YXRpYyBkZXN0cm95KGVsZW0pe1xyXG4gICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oXCJkZXN0cm95XCIpO1xyXG4gICAgfVxyXG59IiwiXHJcbmNvbnN0IEFtYXRpY1VybCA9ICdodHRwOi8vZm9udHMuZ3N0YXRpYy5jb20vcy9hbWF0aWNzYy92OC9JRG5rUlRQR2NyU1ZvNTBVeVlOSzd5M1VTQm5TdnBrb3BRYVVSLTJyN2lVLnR0Zic7XHJcbmNvbnN0IFJvYm90bzEwMCA9ICdodHRwOi8vZm9udHMuZ3N0YXRpYy5jb20vcy9yb2JvdG8vdjE1LzdNeWdxVGUyenM5WWtQMGFkQTlRUVEudHRmJztcclxuY29uc3QgUm9ib3RvNTAwID0gJ2ZvbnRzL1JvYm90by01MDAudHRmJztcclxuY29uc3QgQXF1YWZpbmFTY3JpcHQgPSAnZm9udHMvQWd1YWZpbmFTY3JpcHQtUmVndWxhci9BZ3VhZmluYVNjcmlwdC1SZWd1bGFyLnR0ZidcclxuXHJcbmNsYXNzIERlc2lnbmVyQ29udHJvbGxlciB7XHJcblxyXG4gICAgZm9udHM6IG9wZW50eXBlLkZvbnRbXSA9IFtdO1xyXG4gICAgd29ya3NwYWNlQ29udHJvbGxlcjogV29ya3NwYWNlQ29udHJvbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjaGFubmVsczogQ2hhbm5lbHMsIG9uRm9udExvYWRlZDooKSA9PiB2b2lkKSB7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEZvbnQoUm9ib3RvNTAwLCBmb250ID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud29ya3NwYWNlQ29udHJvbGxlciA9IG5ldyBXb3Jrc3BhY2VDb250cm9sbGVyKGNoYW5uZWxzLCBmb250KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIG9uRm9udExvYWRlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGb250KHVybDogc3RyaW5nLCBvbkNvbXBsZXRlOiAoZjogb3BlbnR5cGUuRm9udCkgPT4gdm9pZCkge1xyXG4gICAgICAgIG5ldyBGb250TG9hZGVyKHVybCwgZm9udCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udHMucHVzaChmb250KTtcclxuICAgICAgICAgICAgb25Db21wbGV0ZShmb250KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBTZWxlY3RlZEl0ZW1FZGl0b3Ige1xyXG5cclxuICAgIGNoYW5uZWxzOiBDaGFubmVscztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBjaGFubmVsczogQ2hhbm5lbHMpIHtcclxuICAgICAgICB0aGlzLmNoYW5uZWxzID0gY2hhbm5lbHM7XHJcblxyXG4gICAgICAgIGNvbnN0IGRvbSQgPSBjaGFubmVscy5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5vYnNlcnZlKCkubWFwKGkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFpLmRhdGEgfHwgIWkuZGF0YS5pdGVtSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBoKCdkaXYjZWRpdG9yT3ZlcmxheScsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJub25lXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaS5kYXRhLml0ZW1UeXBlICE9PSAnVGV4dEJsb2NrJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYmxvY2sgPSBpLmRhdGEuaXRlbSBhcyBUZXh0QmxvY2s7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaCgnZGl2I2VkaXRvck92ZXJsYXknLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGkuZGF0YS5jbGllbnRYICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IGkuZGF0YS5jbGllbnRZICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IFRleHRCbG9ja0VkaXRvcihjaGFubmVscy5hY3Rpb25zKS5yZW5kZXIoYmxvY2spXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgU2tldGNoRWRpdG9yIGV4dGVuZHMgQ29tcG9uZW50PFNrZXRjaD4ge1xyXG4gICAgYWN0aW9uczogQWN0aW9ucztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhY3Rpb25zOiBBY3Rpb25zKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMgPSBhY3Rpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihza2V0Y2g6IFNrZXRjaCkge1xyXG4gICAgICAgIHJldHVybiBoKFwiZGl2XCIsIFtcclxuICAgICAgICAgICAgaChcImxhYmVsXCIsIFwiQWRkIHRleHQ6IFwiKSxcclxuICAgICAgICAgICAgaChcImlucHV0LmFkZC10ZXh0XCIsIHtcclxuICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5cHJlc3M6IChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXYud2hpY2ggPT09IDEzIHx8IGV2LmtleUNvZGUgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gZXYudGFyZ2V0ICYmIGV2LnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9ucy50ZXh0QmxvY2suYWRkLmRpc3BhdGNoKHsgdGV4dDogdGV4dCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldi50YXJnZXQudmFsdWUgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwiUHJlc3MgW0VudGVyXSB0byBhZGRcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJCYWNrZ3JvdW5kOiBcIiksXHJcbiAgICAgICAgICAgIGgoXCJpbnB1dC5iYWNrZ3JvdW5kLWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBza2V0Y2guYXR0ci5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbnMuc2tldGNoLmF0dHJVcGRhdGUuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGJhY2tncm91bmRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pLFxyXG5cclxuICAgICAgICAgICAgQm9vdFNjcmlwdC5kcm9wZG93bih7IFxyXG4gICAgICAgICAgICAgICAgaWQ6IFwic2tldGNoTWVudVwiLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogXCJGaWRkbGVcIixcclxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJOZXdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkNyZWF0ZSBuZXcgc2tldGNoXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljazogKCkgPT4gdGhpcy5hY3Rpb25zLnNrZXRjaC5jcmVhdGUuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJTYXZlIExvY2FsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJTYXZlIHRvIGxvY2FsIGJyb3dzZXIgc3RvcmFnZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHRoaXMuYWN0aW9ucy5kZXNpZ25lci5zYXZlTG9jYWwuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgXVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwiY2xhc3MgVGV4dEJsb2NrRWRpdG9yIGV4dGVuZHMgQ29tcG9uZW50PFRleHRCbG9jaz4ge1xyXG4gICAgYWN0aW9uczogQWN0aW9ucztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhY3Rpb25zOiBBY3Rpb25zKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMgPSBhY3Rpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0ZXh0QmxvY2s6IFRleHRCbG9jayk6IFZOb2RlIHtcclxuICAgICAgICBsZXQgdXBkYXRlID0gdGIgPT4ge1xyXG4gICAgICAgICAgICB0Yi5faWQgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUF0dHIuZGlzcGF0Y2godGIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXYudGV4dC1ibG9jay1lZGl0b3JcIixcclxuICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIGgoXCJ0ZXh0YXJlYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2sudGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5dXA6IGUgPT4gdXBkYXRlKHsgdGV4dDogZS50YXJnZXQudmFsdWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGUgPT4gdXBkYXRlKHsgdGV4dDogZS50YXJnZXQudmFsdWUgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG5cclxuICAgICAgICAgICAgICAgIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICB7fSxcclxuICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1jb2xvci1pY29uLmZvcmVcIiwge30sIFwiQVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcImlucHV0LnRleHQtY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiVGV4dCBjb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLnRleHRDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZub2RlLmVsbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB1cGRhdGUoeyB0ZXh0Q29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICh2bm9kZSkgPT4gQ29sb3JQaWNrZXIuZGVzdHJveSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBdKSxcclxuXHJcbiAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5iYWNrXCIsIHt9LCBcIkFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC5iYWNrZ3JvdW5kLWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkJhY2tncm91bmQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgYmFja2dyb3VuZENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImJ1dHRvbi5kZWxldGUtdGV4dGJsb2NrLmJ0bi5idG4tZGFuZ2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRGVsZXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBlID0+IHRoaXMuYWN0aW9ucy50ZXh0QmxvY2sucmVtb3ZlLmRpc3BhdGNoKHRleHRCbG9jaylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwic3Bhbi5nbHlwaGljb24uZ2x5cGhpY29uLXRyYXNoXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBdKTtcclxuICAgIH1cclxuXHJcbn0iLCJcclxuY2xhc3MgV29ya3NwYWNlQ29udHJvbGxlciB7XHJcblxyXG4gICAgZGVmYXVsdFNpemUgPSBuZXcgcGFwZXIuU2l6ZSg1MDAwMCwgNDAwMDApO1xyXG5cclxuICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICB3b3Jrc3BhY2U6IFdvcmtzcGFjZTtcclxuICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcbiAgICBmb250OiBvcGVudHlwZS5Gb250O1xyXG5cclxuICAgIHByaXZhdGUgY2hhbm5lbHM6IENoYW5uZWxzO1xyXG4gICAgcHJpdmF0ZSBfc2tldGNoOiBTa2V0Y2g7XHJcbiAgICBwcml2YXRlIF90ZXh0QmxvY2tJdGVtczogeyBbdGV4dEJsb2NrSWQ6IHN0cmluZ106IFN0cmV0Y2h5VGV4dDsgfSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNoYW5uZWxzOiBDaGFubmVscywgZm9udDogb3BlbnR5cGUuRm9udCkge1xyXG4gICAgICAgIHRoaXMuY2hhbm5lbHMgPSBjaGFubmVscztcclxuICAgICAgICB0aGlzLmZvbnQgPSBmb250O1xyXG4gICAgICAgIHBhcGVyLnNldHRpbmdzLmhhbmRsZVNpemUgPSAxO1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkNhbnZhcycpO1xyXG4gICAgICAgIHBhcGVyLnNldHVwKHRoaXMuY2FudmFzKTtcclxuICAgICAgICB0aGlzLnByb2plY3QgPSBwYXBlci5wcm9qZWN0O1xyXG5cclxuICAgICAgICBjb25zdCBtb3VzZVRvb2wgPSBuZXcgTW91c2VCZWhhdmlvclRvb2wodGhpcy5wcm9qZWN0KTtcclxuICAgICAgICBtb3VzZVRvb2wub25Ub29sTW91c2VEb3duID0gZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWxzLmV2ZW50cy5za2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkLmRpc3BhdGNoKHt9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgbW91c2Vab29tID0gbmV3IFZpZXdab29tKHRoaXMucHJvamVjdCk7XHJcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSBuZXcgV29ya3NwYWNlKHRoaXMuZGVmYXVsdFNpemUpO1xyXG4gICAgICAgIGxldCBzaGVldEJvdW5kcyA9IHRoaXMud29ya3NwYWNlLnNoZWV0LmJvdW5kcztcclxuICAgICAgICBtb3VzZVpvb20uc2V0Wm9vbVJhbmdlKFxyXG4gICAgICAgICAgICBbc2hlZXRCb3VuZHMuc2NhbGUoMC4wMDUpLnNpemUsIHNoZWV0Qm91bmRzLnNjYWxlKDAuMjUpLnNpemVdKTtcclxuICAgICAgICBtb3VzZVpvb20uem9vbVRvKHNoZWV0Qm91bmRzLnNjYWxlKDAuMDUpKTtcclxuXHJcblxyXG5cclxuICAgICAgICBjb25zdCB2aWV3Q2VudGVyID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLmNlbnRlcjtcclxuICAgICAgICBsZXQgbGluZSA9IHBhcGVyLlBhdGguTGluZSh2aWV3Q2VudGVyLCB2aWV3Q2VudGVyLmFkZCgyMDApKTtcclxuICAgICAgICBsZXQgc3RyZXRjaCA9IG5ldyBTdHJldGNoUGF0aChsaW5lLnNlZ21lbnRzKTtcclxuICAgICAgICB0aGlzLndvcmtzcGFjZS5hZGRDaGlsZChzdHJldGNoKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMud29ya3NwYWNlLm1vdXNlQmVoYXZpb3Iub25DbGljayA9IGV2ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVscy5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goe30pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhbm5lbHMuZXZlbnRzLnNrZXRjaC5sb2FkZWQuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9za2V0Y2ggPSBldi5kYXRhO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2UuYmFja2dyb3VuZENvbG9yID0gZXYuZGF0YS5hdHRyLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgIF8uZm9yT3duKHRoaXMuX3RleHRCbG9ja0l0ZW1zLCAoYmxvY2ssIGlkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RleHRCbG9ja0l0ZW1zID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjaGFubmVscy5ldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZXYgPT4gdGhpcy53b3Jrc3BhY2UuYmFja2dyb3VuZENvbG9yID0gZXYuZGF0YS5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjaGFubmVscy5ldmVudHMubWVyZ2VUeXBlZChcclxuICAgICAgICAgICAgY2hhbm5lbHMuZXZlbnRzLnRleHRibG9jay5hZGRlZCxcclxuICAgICAgICAgICAgY2hhbm5lbHMuZXZlbnRzLnRleHRibG9jay5sb2FkZWRcclxuICAgICAgICApLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZXYgPT4gdGhpcy5hZGRCbG9jayhldi5kYXRhKSk7XHJcblxyXG4gICAgICAgIGNoYW5uZWxzLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dEJsb2NrID0gbS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSA8U3RyZXRjaHlUZXh0T3B0aW9ucz57XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogdGV4dEJsb2NrLnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IHRleHRCbG9jay5mb250U2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBwYXRoRmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGl0ZW0udXBkYXRlKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNoYW5uZWxzLmV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNoYW5uZWxzLmV2ZW50cy5za2V0Y2guc2VsZWN0aW9uQ2hhbmdlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtLmRhdGEgJiYgbS5kYXRhLnByaW9yU2VsZWN0aW9uSXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJpb3IgPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEucHJpb3JTZWxlY3Rpb25JdGVtSWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByaW9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJpb3IuYmxvY2tTZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IG0uZGF0YS5pdGVtSWQgJiYgdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLml0ZW1JZF07XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmJsb2NrU2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNoYW5uZWxzLmV2ZW50cy5kZXNpZ25lci5zYXZlTG9jYWxSZXF1ZXN0ZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBfLmZvck93bih0aGlzLl90ZXh0QmxvY2tJdGVtcywgdGJpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRvYyA9IHRoaXMucHJvamVjdC5leHBvcnRKU09OKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRvYyk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQmxvY2sodGV4dEJsb2NrOiBUZXh0QmxvY2spIHtcclxuICAgICAgICBpZiAoIXRleHRCbG9jaykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRleHRCbG9jay5faWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcigncmVjZWl2ZWQgYmxvY2sgd2l0aG91dCBpZCcsIHRleHRCbG9jayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb3B0aW9ucyA9IDxTdHJldGNoeVRleHRPcHRpb25zPntcclxuICAgICAgICAgICAgdGV4dDogdGV4dEJsb2NrLnRleHQsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiB0ZXh0QmxvY2suZm9udFNpemUsXHJcbiAgICAgICAgICAgIC8vIHBpbmsgPSBzaG91bGQgbm90IGhhcHBlblxyXG4gICAgICAgICAgICBwYXRoRmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yIHx8ICdwaW5rJyxcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW3RleHRCbG9jay5faWRdO1xyXG4gICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJSZWNlaXZlZCBhZGRCbG9jayBmb3IgYmxvY2sgdGhhdCBpcyBhbHJlYWR5IGxvYWRlZFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpdGVtID0gbmV3IFN0cmV0Y2h5VGV4dCh0aGlzLmZvbnQsIG9wdGlvbnMsIHRleHRCbG9jay5wb3NpdGlvbiwgdGV4dEJsb2NrLm91dGxpbmUpO1xyXG5cclxuICAgICAgICAvLyB3YXJuaW5nOiBNb3VzZUJlaGF2aW9yIGV2ZW50cyBhcmUgYWxzbyBzZXQgd2l0aGluIFN0cmV0Y2h5UGF0aC4gXHJcbiAgICAgICAgLy8gICAgICAgICAgQ29sbGlzaW9uIHdpbGwgaGFwcGVuIGV2ZW50dWFsbC5cclxuICAgICAgICAvLyB0b2RvOiBGaXggZHJhZyBoYW5kbGVyIGluIHBhcGVyLmpzIHNvIGl0IGRvZXNuJ3QgZmlyZSBjbGljay5cclxuICAgICAgICAvLyAgICAgICBUaGVuIHdlIGNhbiB1c2UgdGhlIGl0ZW0uY2xpY2sgZXZlbnQuXHJcbiAgICAgICAgaXRlbS5tb3VzZUJlaGF2aW9yLm9uQ2xpY2sgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVkaXRvckF0ID0gdGhpcy5wcm9qZWN0LnZpZXcucHJvamVjdFRvVmlldyhcclxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5taWRwb2ludChpdGVtLmJvdW5kcy50b3BMZWZ0LCBpdGVtLmJvdW5kcy5jZW50ZXIpKTtcclxuICAgICAgICAgICAgLy8gc2VsZWN0XHJcbiAgICAgICAgICAgIGlmICghaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFubmVscy5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IHRleHRCbG9jay5faWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGVkaXRcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVscy5hY3Rpb25zLnNrZXRjaC5zZXRFZGl0aW5nSXRlbS5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtSWQ6IHRleHRCbG9jay5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50WDogZWRpdG9yQXQueCxcclxuICAgICAgICAgICAgICAgICAgICBjbGllbnRZOiBlZGl0b3JBdC55XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnU3RhcnQgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgIGlmICghaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFubmVscy5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IHRleHRCbG9jay5faWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ01vdmUgPSBldiA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uLmFkZChldi5kZWx0YSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ0VuZCA9IGV2ID0+IHtcclxuICAgICAgICAgICAgbGV0IGJsb2NrID0gPFRleHRCbG9jaz50aGlzLmdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbSk7XHJcbiAgICAgICAgICAgIGJsb2NrLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtLm9uT3V0bGluZUNoYW5nZWQgPSBvdXRsaW5lID0+IHtcclxuICAgICAgICAgICAgbGV0IGJsb2NrID0gPFRleHRCbG9jaz50aGlzLmdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbSk7XHJcbiAgICAgICAgICAgIGJsb2NrLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaXRlbS5kYXRhID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICB0aGlzLndvcmtzcGFjZS5hZGRDaGlsZChpdGVtKTtcclxuICAgICAgICBpZiAoIXRleHRCbG9jay5wb3NpdGlvbikge1xyXG4gICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLnBvaW50LmFkZChcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChpdGVtLmJvdW5kcy53aWR0aCAvIDIsIGl0ZW0uYm91bmRzLmhlaWdodCAvIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZCg1MCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtc1t0ZXh0QmxvY2suX2lkXSA9IGl0ZW07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW06IFN0cmV0Y2h5VGV4dCk6IEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgICAgIGxldCBzaWRlcyA9IGl0ZW0uZ2V0T3V0bGluZVNpZGVzKCk7XHJcbiAgICAgICAgY29uc3QgdG9wID0gc2lkZXNbMF0uZXhwb3J0SlNPTih7IGFzU3RyaW5nOiBmYWxzZSB9KTtcclxuICAgICAgICBjb25zdCBib3R0b20gPSBzaWRlc1syXS5leHBvcnRKU09OKHsgYXNTdHJpbmc6IGZhbHNlIH0pO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBbaXRlbS5wb3NpdGlvbi54LCBpdGVtLnBvc2l0aW9uLnldLFxyXG4gICAgICAgICAgICBvdXRsaW5lOiB7IHRvcCwgYm90dG9tIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJcclxuZGVjbGFyZSB2YXIgc29sdmU6IChhOiBhbnksIGI6IGFueSwgZmFzdDogYm9vbGVhbikgPT4gdm9pZDtcclxuXHJcbmNsYXNzIFBlcnNwZWN0aXZlVHJhbnNmb3JtIHtcclxuICAgIFxyXG4gICAgc291cmNlOiBRdWFkO1xyXG4gICAgZGVzdDogUXVhZDtcclxuICAgIHBlcnNwOiBhbnk7XHJcbiAgICBtYXRyaXg6IG51bWJlcltdO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2U6IFF1YWQsIGRlc3Q6IFF1YWQpe1xyXG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuZGVzdCA9IGRlc3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5jcmVhdGVNYXRyaXgoc291cmNlLCBkZXN0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gR2l2ZW4gYSA0eDQgcGVyc3BlY3RpdmUgdHJhbnNmb3JtYXRpb24gbWF0cml4LCBhbmQgYSAyRCBwb2ludCAoYSAyeDEgdmVjdG9yKSxcclxuICAgIC8vIGFwcGxpZXMgdGhlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCBieSBjb252ZXJ0aW5nIHRoZSBwb2ludCB0byBob21vZ2VuZW91c1xyXG4gICAgLy8gY29vcmRpbmF0ZXMgYXQgej0wLCBwb3N0LW11bHRpcGx5aW5nLCBhbmQgdGhlbiBhcHBseWluZyBhIHBlcnNwZWN0aXZlIGRpdmlkZS5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBsZXQgcDMgPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5tdWx0aXBseSh0aGlzLm1hdHJpeCwgW3BvaW50LngsIHBvaW50LnksIDAsIDFdKTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IHBhcGVyLlBvaW50KHAzWzBdIC8gcDNbM10sIHAzWzFdIC8gcDNbM10pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBjcmVhdGVNYXRyaXgoc291cmNlOiBRdWFkLCB0YXJnZXQ6IFF1YWQpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNvdXJjZVBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3NvdXJjZS5hLngsIHNvdXJjZS5hLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5iLngsIHNvdXJjZS5iLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5jLngsIHNvdXJjZS5jLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5kLngsIHNvdXJjZS5kLnldXTtcclxuICAgICAgICBsZXQgdGFyZ2V0UG9pbnRzID0gW1xyXG4gICAgICAgICAgICBbdGFyZ2V0LmEueCwgdGFyZ2V0LmEueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmIueCwgdGFyZ2V0LmIueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmMueCwgdGFyZ2V0LmMueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmQueCwgdGFyZ2V0LmQueV1dO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGEgPSBbXSwgYiA9IFtdLCBpID0gMCwgbiA9IHNvdXJjZVBvaW50cy5sZW5ndGg7IGkgPCBuOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHMgPSBzb3VyY2VQb2ludHNbaV0sIHQgPSB0YXJnZXRQb2ludHNbaV07XHJcbiAgICAgICAgICAgIGEucHVzaChbc1swXSwgc1sxXSwgMSwgMCwgMCwgMCwgLXNbMF0gKiB0WzBdLCAtc1sxXSAqIHRbMF1dKSwgYi5wdXNoKHRbMF0pO1xyXG4gICAgICAgICAgICBhLnB1c2goWzAsIDAsIDAsIHNbMF0sIHNbMV0sIDEsIC1zWzBdICogdFsxXSwgLXNbMV0gKiB0WzFdXSksIGIucHVzaCh0WzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBYID0gc29sdmUoYSwgYiwgdHJ1ZSk7IFxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIFhbMF0sIFhbM10sIDAsIFhbNl0sXHJcbiAgICAgICAgICAgIFhbMV0sIFhbNF0sIDAsIFhbN10sXHJcbiAgICAgICAgICAgICAgIDAsICAgIDAsIDEsICAgIDAsXHJcbiAgICAgICAgICAgIFhbMl0sIFhbNV0sIDAsICAgIDFcclxuICAgICAgICBdLm1hcChmdW5jdGlvbih4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHggKiAxMDAwMDApIC8gMTAwMDAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBvc3QtbXVsdGlwbHkgYSA0eDQgbWF0cml4IGluIGNvbHVtbi1tYWpvciBvcmRlciBieSBhIDR4MSBjb2x1bW4gdmVjdG9yOlxyXG4gICAgLy8gWyBtMCBtNCBtOCAgbTEyIF0gICBbIHYwIF0gICBbIHggXVxyXG4gICAgLy8gWyBtMSBtNSBtOSAgbTEzIF0gKiBbIHYxIF0gPSBbIHkgXVxyXG4gICAgLy8gWyBtMiBtNiBtMTAgbTE0IF0gICBbIHYyIF0gICBbIHogXVxyXG4gICAgLy8gWyBtMyBtNyBtMTEgbTE1IF0gICBbIHYzIF0gICBbIHcgXVxyXG4gICAgc3RhdGljIG11bHRpcGx5KG1hdHJpeCwgdmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgbWF0cml4WzBdICogdmVjdG9yWzBdICsgbWF0cml4WzRdICogdmVjdG9yWzFdICsgbWF0cml4WzggXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxMl0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFsxXSAqIHZlY3RvclswXSArIG1hdHJpeFs1XSAqIHZlY3RvclsxXSArIG1hdHJpeFs5IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTNdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMl0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNl0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbMTBdICogdmVjdG9yWzJdICsgbWF0cml4WzE0XSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzNdICogdmVjdG9yWzBdICsgbWF0cml4WzddICogdmVjdG9yWzFdICsgbWF0cml4WzExXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNV0gKiB2ZWN0b3JbM11cclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBRdWFkIHtcclxuICAgIGE6IHBhcGVyLlBvaW50O1xyXG4gICAgYjogcGFwZXIuUG9pbnQ7XHJcbiAgICBjOiBwYXBlci5Qb2ludDtcclxuICAgIGQ6IHBhcGVyLlBvaW50O1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQsIGM6IHBhcGVyLlBvaW50LCBkOiBwYXBlci5Qb2ludCl7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYyA9IGM7XHJcbiAgICAgICAgdGhpcy5kID0gZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21SZWN0YW5nbGUocmVjdDogcGFwZXIuUmVjdGFuZ2xlKXtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIHJlY3QudG9wTGVmdCxcclxuICAgICAgICAgICAgcmVjdC50b3BSaWdodCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21MZWZ0LFxyXG4gICAgICAgICAgICByZWN0LmJvdHRvbVJpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21Db29yZHMoY29vcmRzOiBudW1iZXJbXSkgOiBRdWFkIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMF0sIGNvb3Jkc1sxXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMl0sIGNvb3Jkc1szXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNF0sIGNvb3Jkc1s1XSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNl0sIGNvb3Jkc1s3XSlcclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFzQ29vcmRzKCk6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB0aGlzLmEueCwgdGhpcy5hLnksXHJcbiAgICAgICAgICAgIHRoaXMuYi54LCB0aGlzLmIueSxcclxuICAgICAgICAgICAgdGhpcy5jLngsIHRoaXMuYy55LFxyXG4gICAgICAgICAgICB0aGlzLmQueCwgdGhpcy5kLnlcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59IiwiXHJcbi8qKlxyXG4gKiBIYW5kbGUgdGhhdCBzaXRzIG9uIG1pZHBvaW50IG9mIGN1cnZlXHJcbiAqICAgd2hpY2ggd2lsbCBzcGxpdCB0aGUgY3VydmUgd2hlbiBkcmFnZ2VkLlxyXG4gKi9cclxuY2xhc3MgQ3VydmVTcGxpdHRlckhhbmRsZSBleHRlbmRzIHBhcGVyLlNoYXBlIHtcclxuIFxyXG4gICAgY3VydmU6IHBhcGVyLkN1cnZlO1xyXG4gICAgb25EcmFnU3RhcnQ6IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25EcmFnRW5kOiAobmV3U2VnbWVudDogcGFwZXIuU2VnbWVudCwgZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuIFxyXG4gICAgY29uc3RydWN0b3IoY3VydmU6IHBhcGVyLkN1cnZlKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnZlID0gY3VydmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNlbGYgPSA8YW55PnRoaXM7XHJcbiAgICAgICAgc2VsZi5fdHlwZSA9ICdjaXJjbGUnO1xyXG4gICAgICAgIHNlbGYuX3JhZGl1cyA9IDE1O1xyXG4gICAgICAgIHNlbGYuX3NpemUgPSBuZXcgcGFwZXIuU2l6ZShzZWxmLl9yYWRpdXMgKiAyKTtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShjdXJ2ZS5nZXRQb2ludEF0KDAuNSAqIGN1cnZlLmxlbmd0aCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSAyO1xyXG4gICAgICAgIHRoaXMuc3Ryb2tlQ29sb3IgPSAnYmx1ZSc7XHJcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgIHRoaXMub3BhY2l0eSA9IDAuMzsgXHJcbiBcclxuICAgICAgICBsZXQgbmV3U2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgICAgICB0aGlzLm1vdXNlQmVoYXZpb3IgPSA8TW91c2VCZWhhdmlvcj57XHJcbiAgICAgICAgICAgIG9uRHJhZ1N0YXJ0OiAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIG5ld1NlZ21lbnQgPSBuZXcgcGFwZXIuU2VnbWVudCh0aGlzLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIGN1cnZlLnBhdGguaW5zZXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlLmluZGV4ICsgMSwgXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3U2VnbWVudFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMub25EcmFnU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25EcmFnU3RhcnQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3UG9zID0gdGhpcy5wb3NpdGlvbi5hZGQoZXZlbnQuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKGV2ZW50LmRlbHRhKTtcclxuICAgICAgICAgICAgICAgIG5ld1NlZ21lbnQucG9pbnQgPSBuZXdQb3M7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdFbmQ6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMub25EcmFnRW5kKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRHJhZ0VuZChuZXdTZWdtZW50LCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5kZWNsYXJlIG1vZHVsZSBwYXBlciB7XHJcbiAgICBpbnRlcmZhY2UgSXRlbSB7XHJcbiAgICAgICAgbW91c2VCZWhhdmlvcjogTW91c2VCZWhhdmlvcjtcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIE1vdXNlQmVoYXZpb3Ige1xyXG4gICAgb25DbGljaz86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICAgIG9uT3ZlclN0YXJ0PzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbk92ZXJNb3ZlPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbiAgICBvbk92ZXJFbmQ/OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuXHJcbiAgICBvbkRyYWdTdGFydD86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25EcmFnTW92ZT86IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgb25EcmFnRW5kPzogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcbn1cclxuXHJcbmludGVyZmFjZSBNb3VzZUFjdGlvbiB7XHJcbiAgICBzdGFydEV2ZW50OiBwYXBlci5Ub29sRXZlbnQ7XHJcbiAgICBpdGVtOiBwYXBlci5JdGVtO1xyXG4gICAgZHJhZ2dlZDogYm9vbGVhbjtcclxufVxyXG5cclxuY2xhc3MgTW91c2VCZWhhdmlvclRvb2wgZXh0ZW5kcyBwYXBlci5Ub29sIHtcclxuXHJcbiAgICBoaXRPcHRpb25zID0ge1xyXG4gICAgICAgIHNlZ21lbnRzOiB0cnVlLFxyXG4gICAgICAgIHN0cm9rZTogdHJ1ZSxcclxuICAgICAgICBmaWxsOiB0cnVlLFxyXG4gICAgICAgIHRvbGVyYW5jZTogNVxyXG4gICAgfTtcclxuXHJcbiAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG5cclxuICAgIG9uVG9vbE1vdXNlRG93bjogKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gICAgcHJpdmF0ZSBwcmVzc0FjdGlvbjogTW91c2VBY3Rpb247XHJcbiAgICBwcml2YXRlIGhvdmVyQWN0aW9uOiBNb3VzZUFjdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9qZWN0OiBwYXBlci5Qcm9qZWN0KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnByb2plY3QgPSBwcm9qZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duID0gKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHtcclxuICAgICAgICBpZih0aGlzLm9uVG9vbE1vdXNlRG93bil7XHJcbiAgICAgICAgICAgIHRoaXMub25Ub29sTW91c2VEb3duKGV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLnByZXNzQWN0aW9uID0gbnVsbDtcclxuXHJcbiAgICAgICAgdmFyIGhpdFJlc3VsdCA9IHRoaXMucHJvamVjdC5oaXRUZXN0KFxyXG4gICAgICAgICAgICBldmVudC5wb2ludCxcclxuICAgICAgICAgICAgdGhpcy5oaXRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgaWYgKGhpdFJlc3VsdCAmJiBoaXRSZXN1bHQuaXRlbSkge1xyXG4gICAgICAgICAgICBsZXQgZHJhZ2dhYmxlID0gdGhpcy5maW5kRHJhZ0hhbmRsZXIoaGl0UmVzdWx0Lml0ZW0pO1xyXG4gICAgICAgICAgICBpZiAoZHJhZ2dhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uID0gPE1vdXNlQWN0aW9uPntcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiBkcmFnZ2FibGVcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU1vdmUgPSAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4ge1xyXG4gICAgICAgIHZhciBoaXRSZXN1bHQgPSB0aGlzLnByb2plY3QuaGl0VGVzdChcclxuICAgICAgICAgICAgZXZlbnQucG9pbnQsXHJcbiAgICAgICAgICAgIHRoaXMuaGl0T3B0aW9ucyk7XHJcbiAgICAgICAgbGV0IGhhbmRsZXJJdGVtID0gaGl0UmVzdWx0XHJcbiAgICAgICAgICAgICYmIHRoaXMuZmluZE92ZXJIYW5kbGVyKGhpdFJlc3VsdC5pdGVtKTtcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAvLyB3ZXJlIHByZXZpb3VzbHkgaG92ZXJpbmdcclxuICAgICAgICAgICAgdGhpcy5ob3ZlckFjdGlvblxyXG4gICAgICAgICAgICAmJiAoXHJcbiAgICAgICAgICAgICAgICAvLyBub3QgaG92ZXJpbmcgb3ZlciBhbnl0aGluZyBub3dcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJJdGVtID09IG51bGxcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBob3ZlcmluZyBvdmVyIGN1cnJlbnQgaGFuZGxlciBvciBkZXNjZW5kZW50IHRoZXJlb2ZcclxuICAgICAgICAgICAgICAgIHx8ICFNb3VzZUJlaGF2aW9yVG9vbC5pc1NhbWVPckFuY2VzdG9yKFxyXG4gICAgICAgICAgICAgICAgICAgIGhpdFJlc3VsdC5pdGVtLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24uaXRlbSkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vIGp1c3QgbGVhdmluZ1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ob3ZlckFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25PdmVyRW5kKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbk92ZXJFbmQoZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaG92ZXJBY3Rpb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGhhbmRsZXJJdGVtICYmIGhhbmRsZXJJdGVtLm1vdXNlQmVoYXZpb3IpIHtcclxuICAgICAgICAgICAgbGV0IGJlaGF2aW9yID0gaGFuZGxlckl0ZW0ubW91c2VCZWhhdmlvcjtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhvdmVyQWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyQWN0aW9uID0gPE1vdXNlQWN0aW9uPntcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiBoYW5kbGVySXRlbVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmIChiZWhhdmlvci5vbk92ZXJTdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yLm9uT3ZlclN0YXJ0KGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYmVoYXZpb3IgJiYgYmVoYXZpb3Iub25PdmVyTW92ZSkge1xyXG4gICAgICAgICAgICAgICAgYmVoYXZpb3Iub25PdmVyTW92ZShldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURyYWcgPSAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wcmVzc0FjdGlvbi5kcmFnZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uLmRyYWdnZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlc3NBY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ1N0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnU3RhcnQuY2FsbChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbi5pdGVtLCB0aGlzLnByZXNzQWN0aW9uLnN0YXJ0RXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdNb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXNzQWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkRyYWdNb3ZlLmNhbGwodGhpcy5wcmVzc0FjdGlvbi5pdGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwID0gKGV2ZW50OiBwYXBlci5Ub29sRXZlbnQpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5wcmVzc0FjdGlvbikge1xyXG4gICAgICAgICAgICBsZXQgYWN0aW9uID0gdGhpcy5wcmVzc0FjdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5wcmVzc0FjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoYWN0aW9uLmRyYWdnZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRyYWdcclxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24uaXRlbS5tb3VzZUJlaGF2aW9yLm9uRHJhZ0VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5pdGVtLm1vdXNlQmVoYXZpb3Iub25EcmFnRW5kLmNhbGwoYWN0aW9uLml0ZW0sIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNsaWNrXHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkNsaWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLml0ZW0ubW91c2VCZWhhdmlvci5vbkNsaWNrLmNhbGwoYWN0aW9uLml0ZW0sIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgb25Eb3VibGVDbGljayA9IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB7XHJcbiAgICB9XHJcblxyXG4gICAgb25LZXlEb3duID0gKGV2ZW50OiBwYXBlci5LZXlFdmVudCkgPT4ge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbktleVVwID0gKGV2ZW50OiBwYXBlci5LZXlFdmVudCkgPT4ge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZSBpZiBjb250YWluZXIgaXMgYW4gYW5jZXN0b3Igb2YgaXRlbS4gXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpc1NhbWVPckFuY2VzdG9yKGl0ZW06IHBhcGVyLkl0ZW0sIGNvbnRhaW5lcjogcGFwZXIuSXRlbSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhIVBhcGVySGVscGVycy5maW5kU2VsZk9yQW5jZXN0b3IoaXRlbSwgcGEgPT4gcGEgPT09IGNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZERyYWdIYW5kbGVyKGl0ZW06IHBhcGVyLkl0ZW0pOiBwYXBlci5JdGVtIHtcclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRTZWxmT3JBbmNlc3RvcihcclxuICAgICAgICAgICAgaXRlbSwgXHJcbiAgICAgICAgICAgIHBhID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYiA9IHBhLm1vdXNlQmVoYXZpb3I7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gISEobWIgJiZcclxuICAgICAgICAgICAgICAgICAgICAobWIub25EcmFnU3RhcnQgfHwgbWIub25EcmFnTW92ZSB8fCBtYi5vbkRyYWdFbmQpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZpbmRPdmVySGFuZGxlcihpdGVtOiBwYXBlci5JdGVtKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kU2VsZk9yQW5jZXN0b3IoXHJcbiAgICAgICAgICAgIGl0ZW0sIFxyXG4gICAgICAgICAgICBwYSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWIgPSBwYS5tb3VzZUJlaGF2aW9yO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKG1iICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKG1iLm9uT3ZlclN0YXJ0IHx8IG1iLm9uT3Zlck1vdmUgfHwgbWIub25PdmVyRW5kICkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgUGFwZXJIZWxwZXJzIHtcclxuXHJcbiAgICBzdGF0aWMgaW1wb3J0T3BlblR5cGVQYXRoKG9wZW5QYXRoOiBvcGVudHlwZS5QYXRoKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChvcGVuUGF0aC50b1BhdGhEYXRhKCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGxldCBzdmcgPSBvcGVuUGF0aC50b1NWRyg0KTtcclxuICAgICAgICAvLyByZXR1cm4gPHBhcGVyLlBhdGg+cGFwZXIucHJvamVjdC5pbXBvcnRTVkcoc3ZnKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdHJhY2VQYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuUGF0aEl0ZW0ge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VDb21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgsIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgaWYgKCFwYXRoLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBhdGhzID0gcGF0aC5jaGlsZHJlbi5tYXAocCA9PlxyXG4gICAgICAgICAgICB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wLCBwb2ludHNQZXJQYXRoKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgoe1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogcGF0aHMsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0cmFjZVBhdGgocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAvLyBpZighcGF0aCB8fCAhcGF0aC5zZWdtZW50cyB8fCBwYXRoLnNlZ21lbnRzLmxlbmd0aCl7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBsZXQgcGF0aExlbmd0aCA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGxldCBvZmZzZXRJbmNyID0gcGF0aExlbmd0aCAvIG51bVBvaW50cztcclxuICAgICAgICBsZXQgcG9pbnRzID0gW107XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAoaSsrIDwgbnVtUG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IHBhdGguZ2V0UG9pbnRBdChNYXRoLm1pbihvZmZzZXQsIHBhdGhMZW5ndGgpKTtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gb2Zmc2V0SW5jcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgIHNlZ21lbnRzOiBwb2ludHMsXHJcbiAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzYW5kd2ljaFBhdGhQcm9qZWN0aW9uKHRvcFBhdGg6IHBhcGVyLkN1cnZlbGlrZSwgYm90dG9tUGF0aDogcGFwZXIuQ3VydmVsaWtlKVxyXG4gICAgICAgIDogKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBjb25zdCB0b3BQYXRoTGVuZ3RoID0gdG9wUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgYm90dG9tUGF0aExlbmd0aCA9IGJvdHRvbVBhdGgubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbih1bml0UG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgICAgICBsZXQgdG9wUG9pbnQgPSB0b3BQYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiB0b3BQYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICAgbGV0IGJvdHRvbVBvaW50ID0gYm90dG9tUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogYm90dG9tUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGlmICh0b3BQb2ludCA9PSBudWxsIHx8IGJvdHRvbVBvaW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiY291bGQgbm90IGdldCBwcm9qZWN0ZWQgcG9pbnQgZm9yIHVuaXQgcG9pbnQgXCIgKyB1bml0UG9pbnQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdG9wUG9pbnQuYWRkKGJvdHRvbVBvaW50LnN1YnRyYWN0KHRvcFBvaW50KS5tdWx0aXBseSh1bml0UG9pbnQueSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyR3JvdXA6IHBhcGVyLkdyb3VwO1xyXG5cclxuICAgIHN0YXRpYyByZXNldE1hcmtlcnMoKXtcclxuICAgICAgICBpZihQYXBlckhlbHBlcnMubWFya2VyR3JvdXApe1xyXG4gICAgICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5vcGFjaXR5ID0gMC4yO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtYXJrZXJMaW5lKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCk6IHBhcGVyLkl0ZW17XHJcbiAgICAgICAgbGV0IGxpbmUgPSBwYXBlci5QYXRoLkxpbmUoYSxiKTtcclxuICAgICAgICBsaW5lLnN0cm9rZUNvbG9yID0gJ2dyZWVuJztcclxuICAgICAgICAvL2xpbmUuZGFzaEFycmF5ID0gWzUsIDVdO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChsaW5lKTtcclxuICAgICAgICByZXR1cm4gbGluZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbWFya2VyKHBvaW50OiBwYXBlci5Qb2ludCwgbGFiZWw6IHN0cmluZyk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIC8vbGV0IG1hcmtlciA9IHBhcGVyLlNoYXBlLkNpcmNsZShwb2ludCwgMTApO1xyXG4gICAgICAgIGxldCBtYXJrZXIgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KHBvaW50KTtcclxuICAgICAgICBtYXJrZXIuZm9udFNpemUgPSAzNjtcclxuICAgICAgICBtYXJrZXIuY29udGVudCA9IGxhYmVsO1xyXG4gICAgICAgIG1hcmtlci5zdHJva2VDb2xvciA9IFwicmVkXCI7XHJcbiAgICAgICAgbWFya2VyLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgIC8vUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLmFkZENoaWxkKG1hcmtlcik7XHJcbiAgICAgICAgcmV0dXJuIG1hcmtlcjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2ltcGxpZnkocGF0aDogcGFwZXIuUGF0aEl0ZW0sIHRvbGVyYW5jZT86IG51bWJlcikge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBQYXBlckhlbHBlcnMuc2ltcGxpZnkoPHBhcGVyLlBhdGhJdGVtPnAsIHRvbGVyYW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAoPHBhcGVyLlBhdGg+cGF0aCkuc2ltcGxpZnkodG9sZXJhbmNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIHNlbGYgb3IgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXHJcbiAgICAgKi8gICAgXHJcbiAgICBzdGF0aWMgZmluZFNlbGZPckFuY2VzdG9yKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pe1xyXG4gICAgICAgIGlmKHByZWRpY2F0ZShpdGVtKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRBbmNlc3RvcihpdGVtLCBwcmVkaWNhdGUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBmaW5kQW5jZXN0b3IoaXRlbTogcGFwZXIuSXRlbSwgcHJlZGljYXRlOiAoaTogcGFwZXIuSXRlbSkgPT4gYm9vbGVhbil7XHJcbiAgICAgICAgaWYoIWl0ZW0pe1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHByaW9yOiBwYXBlci5JdGVtO1xyXG4gICAgICAgIGxldCBjaGVja2luZyA9IGl0ZW0ucGFyZW50O1xyXG4gICAgICAgIHdoaWxlKGNoZWNraW5nICYmIGNoZWNraW5nICE9PSBwcmlvcil7XHJcbiAgICAgICAgICAgIGlmKHByZWRpY2F0ZShjaGVja2luZykpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNraW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByaW9yID0gY2hlY2tpbmc7XHJcbiAgICAgICAgICAgIGNoZWNraW5nID0gY2hlY2tpbmcucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgY29ybmVycyBvZiB0aGUgcmVjdCwgY2xvY2t3aXNlIHN0YXJ0aW5nIGZyb20gdG9wTGVmdFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29ybmVycyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpOiBwYXBlci5Qb2ludFtde1xyXG4gICAgICAgIHJldHVybiBbcmVjdC50b3BMZWZ0LCByZWN0LnRvcFJpZ2h0LCByZWN0LmJvdHRvbVJpZ2h0LCByZWN0LmJvdHRvbUxlZnRdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIHRoZSBtaWRwb2ludCBiZXR3ZWVuIHR3byBwb2ludHNcclxuICAgICAqL1xyXG4gICAgc3RhdGljIG1pZHBvaW50KGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCl7XHJcbiAgICAgICAgcmV0dXJuIGIuc3VidHJhY3QoYSkuZGl2aWRlKDIpLmFkZChhKTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBQYXRoSGFuZGxlIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgIHN0YXRpYyBNQVJLRVJfUkFESVVTID0gMTU7XHJcblxyXG4gICAgcHJpdmF0ZSBfbWFya2VyOiBwYXBlci5TaGFwZTtcclxuICAgIHByaXZhdGUgX3NlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XHJcbiAgICBwcml2YXRlIF9jdXJ2ZTogcGFwZXIuQ3VydmU7XHJcbiAgICBwcml2YXRlIF9zbW9vdGhlZDogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX2N1cnZlU3BsaXQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PG51bWJlcj4oKTtcclxuICAgIHByaXZhdGUgX2N1cnZlVW5TdWI6ICgpID0+IHZvaWQ7IFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGF0dGFjaDogcGFwZXIuU2VnbWVudCB8IHBhcGVyLkN1cnZlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgbGV0IHBvc2l0aW9uOiBwYXBlci5Qb2ludDtcclxuICAgICAgICBpZiAoYXR0YWNoIGluc3RhbmNlb2YgcGFwZXIuU2VnbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gPHBhcGVyLlNlZ21lbnQ+YXR0YWNoO1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuX3NlZ21lbnQucG9pbnQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhdHRhY2ggaW5zdGFuY2VvZiBwYXBlci5DdXJ2ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJ2ZSA9IDxwYXBlci5DdXJ2ZT5hdHRhY2g7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fY3VydmUuZ2V0UG9pbnRBdCh0aGlzLl9jdXJ2ZS5sZW5ndGggKiAwLjUpO1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJ2ZVVuU3ViID0gdGhpcy5fY3VydmUucGF0aC5vYnNlcnZlKGZsYWdzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChmbGFncyAmIFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuX2N1cnZlLmdldFBvaW50QXQodGhpcy5fY3VydmUubGVuZ3RoICogMC41KTtcclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwiYXR0YWNoIG11c3QgYmUgU2VnbWVudCBvciBDdXJ2ZVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvc2l0aW9uLCBQYXRoSGFuZGxlLk1BUktFUl9SQURJVVMpO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5zdHJva2VDb2xvciA9IFwiYmx1ZVwiO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5maWxsQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9tYXJrZXIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlQXNTZWdtZW50KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZUFzQ3VydmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IHtcclxuICAgICAgICAgICAgb25EcmFnU3RhcnQ6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJ2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBjdXJ2ZSwgJ2VjbG9zZScgdG8gc2VnbWVudCBoYW5kbGVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZVVuU3ViKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudCA9IG5ldyBwYXBlci5TZWdtZW50KHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnZlSWR4ID0gdGhpcy5fY3VydmUuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VydmUucGF0aC5pbnNlcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlSWR4ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VydmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBc1NlZ21lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnZlU3BsaXQubm90aWZ5KGN1cnZlSWR4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnTW92ZTogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1BvcyA9IHRoaXMucG9zaXRpb24uYWRkKGV2ZW50LmRlbHRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3M7IFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LnBvaW50ID0gbmV3UG9zO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdFbmQ6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zbW9vdGhlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNtb290aGVkID0gIXRoaXMuc21vb3RoZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNtb290aGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zbW9vdGhlZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc21vb3RoZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9zbW9vdGhlZCA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5oYW5kbGVPdXQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGN1cnZlU3BsaXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnZlU3BsaXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNlbnRlcigpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNlbnRlcihwb2ludDogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9pbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdHlsZUFzU2VnbWVudCgpIHtcclxuICAgICAgICB0aGlzLl9tYXJrZXIub3BhY2l0eSA9IDAuODtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0eWxlQXNDdXJ2ZSgpIHtcclxuICAgICAgICB0aGlzLl9tYXJrZXIub3BhY2l0eSA9IDAuMztcclxuICAgIH1cclxuXHJcbn0iLCJcclxuY2xhc3MgUGF0aFNlY3Rpb24gaW1wbGVtZW50cyBwYXBlci5DdXJ2ZWxpa2Uge1xyXG4gICAgcGF0aDogcGFwZXIuUGF0aDtcclxuICAgIG9mZnNldDogbnVtYmVyO1xyXG4gICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHBhcGVyLlBhdGgsIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcil7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aC5nZXRQb2ludEF0KG9mZnNldCArIHRoaXMub2Zmc2V0KTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBQYXRoVHJhbnNmb3JtIHtcclxuICAgIHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICB0aGlzLnBvaW50VHJhbnNmb3JtID0gcG9pbnRUcmFuc2Zvcm07XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUG9pbnQocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50VHJhbnNmb3JtKHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1QYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSkge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1Db21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1QYXRoKHBhdGg6IHBhcGVyLlBhdGgpIHtcclxuICAgICAgICBmb3IgKGxldCBzZWdtZW50IG9mIHBhdGguc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgbGV0IG9yaWdQb2ludCA9IHNlZ21lbnQucG9pbnQ7XHJcbiAgICAgICAgICAgIGxldCBuZXdQb2ludCA9IHRoaXMudHJhbnNmb3JtUG9pbnQoc2VnbWVudC5wb2ludCk7XHJcbiAgICAgICAgICAgIG9yaWdQb2ludC54ID0gbmV3UG9pbnQueDtcclxuICAgICAgICAgICAgb3JpZ1BvaW50LnkgPSBuZXdQb2ludC55O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4iLCJcclxuY2xhc3MgU2VnbWVudEhhbmRsZSBleHRlbmRzIHBhcGVyLlNoYXBlIHtcclxuIFxyXG4gICAgc2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgIG9uRHJhZ1N0YXJ0OiAoZXZlbnQ6IHBhcGVyLlRvb2xFdmVudCkgPT4gdm9pZDtcclxuICAgIG9uQ2hhbmdlQ29tcGxldGU6IChldmVudDogcGFwZXIuVG9vbEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9zbW9vdGhlZDogYm9vbGVhbjtcclxuIFxyXG4gICAgY29uc3RydWN0b3Ioc2VnbWVudDogcGFwZXIuU2VnbWVudCwgcmFkaXVzPzogbnVtYmVyKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2VnbWVudCA9IHNlZ21lbnQ7XHJcblxyXG4gICAgICAgIGxldCBzZWxmID0gPGFueT50aGlzO1xyXG4gICAgICAgIHNlbGYuX3R5cGUgPSAnY2lyY2xlJztcclxuICAgICAgICBzZWxmLl9yYWRpdXMgPSAxNTtcclxuICAgICAgICBzZWxmLl9zaXplID0gbmV3IHBhcGVyLlNpemUoc2VsZi5fcmFkaXVzICogMik7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGUoc2VnbWVudC5wb2ludCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdHJva2VXaWR0aCA9IDI7XHJcbiAgICAgICAgdGhpcy5zdHJva2VDb2xvciA9ICdibHVlJztcclxuICAgICAgICB0aGlzLmZpbGxDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gMC43OyBcclxuXHJcbiAgICAgICAgdGhpcy5tb3VzZUJlaGF2aW9yID0gPE1vdXNlQmVoYXZpb3I+e1xyXG4gICAgICAgICAgICBvbkRyYWdTdGFydDogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgIGlmKHRoaXMub25EcmFnU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLm9uRHJhZ1N0YXJ0KGV2ZW50KTtcclxuICAgICAgICAgICAgICB9ICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25EcmFnTW92ZTogZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1BvcyA9IHRoaXMucG9zaXRpb24uYWRkKGV2ZW50LmRlbHRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3M7XHJcbiAgICAgICAgICAgICAgICBzZWdtZW50LnBvaW50ID0gbmV3UG9zO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRyYWdFbmQ6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Ntb290aGVkKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uQ2hhbmdlQ29tcGxldGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DaGFuZ2VDb21wbGV0ZShldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc21vb3RoZWQgPSAhdGhpcy5zbW9vdGhlZDtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMub25DaGFuZ2VDb21wbGV0ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5nZUNvbXBsZXRlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHNtb290aGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zbW9vdGhlZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IHNtb290aGVkKHZhbHVlOiBib29sZWFuKXtcclxuICAgICAgICB0aGlzLl9zbW9vdGhlZCA9IHZhbHVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnQuaGFuZGxlSW4gPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnNlZ21lbnQuaGFuZGxlT3V0ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFN0cmV0Y2hQYXRoIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgIHN0YXRpYyBIQU5ETEVfUkFESVVTID0gMTU7XHJcblxyXG4gICAgcHJpdmF0ZSBfcGF0aDogcGFwZXIuUGF0aDtcclxuICAgIHByaXZhdGUgX2hhbmRsZXM6IFBhdGhIYW5kbGVbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNlZ21lbnRzOiBwYXBlci5TZWdtZW50W10sIHN0eWxlPzogcGFwZXIuU3R5bGUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLl9wYXRoID0gbmV3IHBhcGVyLlBhdGgoc2VnbWVudHMpO1xyXG4gICAgICAgIGlmKHN0eWxlKXtcclxuICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHlsZSA9IHN0eWxlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhdGguc3Ryb2tlQ29sb3IgPSBcImdyYXlcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9wYXRoKTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IoY29uc3QgcyBvZiB0aGlzLl9wYXRoLnNlZ21lbnRzKXtcclxuICAgICAgICAgICAgdGhpcy5hZGRTZWdtZW50SGFuZGxlKHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IoY29uc3QgYyBvZiB0aGlzLl9wYXRoLmN1cnZlcyl7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ3VydmVIYW5kbGUoYyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGFkZFNlZ21lbnRIYW5kbGUoc2VnbWVudDogcGFwZXIuU2VnbWVudCl7XHJcbiAgICAgICAgbGV0IGhhbmRsZSA9IG5ldyBQYXRoSGFuZGxlKHNlZ21lbnQpO1xyXG4gICAgICAgIHRoaXMuX2hhbmRsZXMucHVzaChoYW5kbGUpO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoaGFuZGxlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBhZGRDdXJ2ZUhhbmRsZShjdXJ2ZTogcGFwZXIuQ3VydmUpe1xyXG4gICAgICAgIGxldCBoYW5kbGUgPSBuZXcgUGF0aEhhbmRsZShjdXJ2ZSk7XHJcbiAgICAgICAgaGFuZGxlLmN1cnZlU3BsaXQuc3Vic2NyaWJlT25lKGN1cnZlSWR4ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZSh0aGlzLl9wYXRoLmN1cnZlc1tjdXJ2ZUlkeF0pO1xyXG4gICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKHRoaXMuX3BhdGguY3VydmVzW2N1cnZlSWR4ICsgMV0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2hhbmRsZXMucHVzaChoYW5kbGUpO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoaGFuZGxlKTtcclxuICAgIH1cclxuXHJcbn0iLCJcclxuY2xhc3MgU3RyZXRjaHlQYXRoIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgIHNvdXJjZVBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIGRpc3BsYXlQYXRoOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBhcnJhbmdlZFBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIGNvcm5lcnM6IHBhcGVyLlNlZ21lbnRbXTtcclxuICAgIG91dGxpbmU6IHBhcGVyLlBhdGg7XHJcbiAgICBcclxuICAgIC8vIFRydWUgaWYgd2UgYXJlIHVzaW5nIGEgY3VzdG9tIHNoYXBlIGluc3RlYWRcclxuICAgIC8vICAgIG9mIG9yaWdpbmFsIChsaW5lYXIpIHRleHQgc2hhcGUuXHJcbiAgICBzaGFwZUNoYW5nZWQ6IGJvb2xlYW47XHJcbiAgICBcclxuICAgIG9uT3V0bGluZUNoYW5nZWQ6IChvdXRsaW5lOiBwYXBlci5QYXRoKSA9PiB2b2lkO1xyXG5cclxuICAgIHByaXZhdGUgX29wdGlvbnM6IFN0cmV0Y2h5UGF0aE9wdGlvbnM7XHJcblxyXG4gICAgc3RhdGljIE9VVExJTkVfUE9JTlRTID0gMjMwO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEZvciByZWJ1aWxkaW5nIHRoZSBtaWRwb2ludCBoYW5kbGVzXHJcbiAgICAgKiBhcyBvdXRsaW5lIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIG1pZHBvaW50R3JvdXA6IHBhcGVyLkdyb3VwO1xyXG4gICAgc2VnbWVudE1hcmtlcnNHcm91cDogcGFwZXIuR3JvdXA7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc291cmNlUGF0aDogcGFwZXIuQ29tcG91bmRQYXRoLFxyXG4gICAgICAgIG9wdGlvbnM/OiBTdHJldGNoeVBhdGhPcHRpb25zLFxyXG4gICAgICAgIHBvc2l0aW9uPzogbnVtYmVyW10sXHJcbiAgICAgICAgcGF0aHM/OiB7IHRvcDogYW55LCBib3R0b206IGFueSB9KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfHwgPFN0cmV0Y2h5UGF0aE9wdGlvbnM+e1xyXG4gICAgICAgICAgICBwYXRoRmlsbENvbG9yOiAnZ3JheSdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldFBhdGgoc291cmNlUGF0aCk7XHJcblxyXG4gICAgICAgIGlmIChwb3NpdGlvbiAmJiBwb3NpdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludChwb3NpdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZU91dGxpbmUocGF0aHMpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlU2VnbWVudE1hcmtlcnMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1pZHBpb250TWFya2VycygpO1xyXG4gICAgICAgIHRoaXMuc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eShmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcblxyXG4gICAgICAgIHRoaXMubW91c2VCZWhhdmlvciA9IHt9XHJcbiAgICAgICAgICAgIC8vIC8vIHdhcm5pbmc6IE1vdXNlQmVoYXZpb3IgZXZlbnRzIGFyZSBhbHNvIHNldCB3aXRoaW4gV29ya3NwYWNlQ29udHJvbGxlci4gXHJcbiAgICAgICAgICAgIC8vIC8vICAgICAgICAgIENvbGxpc2lvbiB3aWxsIGhhcHBlbiBldmVudHVhbGx5LlxyXG4gICAgICAgICAgICAvLyBvbk92ZXJTdGFydDogKCkgPT4gdGhpcy5zZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KHRydWUpLFxyXG4gICAgICAgICAgICAvLyBvbk92ZXJFbmQ6ICgpID0+IHRoaXMuc2V0RWRpdEVsZW1lbnRzVmlzaWJpbGl0eShmYWxzZSlcclxuICAgIH1cclxuXHJcbiAgICBnZXQgb3B0aW9ucygpOiBTdHJldGNoeVBhdGhPcHRpb25zIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgb3B0aW9ucyh2YWx1ZTogU3RyZXRjaHlQYXRoT3B0aW9ucykge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9vcHRpb25zID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVCYWNrZ3JvdW5kQ29sb3IoKTtcclxuICAgICAgICBpZiAodGhpcy5hcnJhbmdlZFBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5hcnJhbmdlZFBhdGguZmlsbENvbG9yID0gdmFsdWUucGF0aEZpbGxDb2xvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGJsb2NrU2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldCBibG9ja1NlbGVjdGVkKHZhbHVlOiBib29sZWFuKXtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCkge1xyXG4gICAgICAgIHRoaXMuc2V0UGF0aChwYXRoKTtcclxuICAgICAgICBpZiAoIXRoaXMuc2hhcGVDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3V0bGluZS5ib3VuZHMuc2l6ZSA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMuc2l6ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVNaWRwaW9udE1hcmtlcnMoKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWdtZW50TWFya2VycygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFycmFuZ2VDb250ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0UGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICBpZiAodGhpcy5zb3VyY2VQYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc291cmNlUGF0aC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zb3VyY2VQYXRoID0gcGF0aDtcclxuICAgICAgICBwYXRoLnZpc2libGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRFZGl0RWxlbWVudHNWaXNpYmlsaXR5KHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5zZWdtZW50TWFya2Vyc0dyb3VwLnZpc2libGUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAudmlzaWJsZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMub3V0bGluZS5zdHJva2VDb2xvciA9IHZhbHVlID8gJ2xpZ2h0Z3JheScgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGFycmFuZ2VDb250ZW50cygpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1pZHBpb250TWFya2VycygpO1xyXG4gICAgICAgIHRoaXMuYXJyYW5nZVBhdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBhcnJhbmdlUGF0aCgpIHtcclxuICAgICAgICBsZXQgb3J0aE9yaWdpbiA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMudG9wTGVmdDtcclxuICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcy53aWR0aDtcclxuICAgICAgICBsZXQgb3J0aEhlaWdodCA9IHRoaXMuc291cmNlUGF0aC5ib3VuZHMuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBzaWRlcyA9IHRoaXMuZ2V0T3V0bGluZVNpZGVzKCk7XHJcblxyXG4gICAgICAgIGxldCB0b3AgPSBzaWRlc1swXTtcclxuICAgICAgICBsZXQgYm90dG9tID0gc2lkZXNbMl07XHJcbiAgICAgICAgYm90dG9tLnJldmVyc2UoKTtcclxuICAgICAgICBsZXQgcHJvamVjdGlvbiA9IFBhcGVySGVscGVycy5zYW5kd2ljaFBhdGhQcm9qZWN0aW9uKHRvcCwgYm90dG9tKTtcclxuICAgICAgICBsZXQgdHJhbnNmb3JtID0gbmV3IFBhdGhUcmFuc2Zvcm0ocG9pbnQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChvcnRoT3JpZ2luKTtcclxuICAgICAgICAgICAgbGV0IHVuaXQgPSBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS54IC8gb3J0aFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIG9ydGhIZWlnaHQpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdGVkID0gcHJvamVjdGlvbih1bml0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb2plY3RlZDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgc2lkZSBvZiBzaWRlcykge1xyXG4gICAgICAgICAgICBzaWRlLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5ld1BhdGggPSBQYXBlckhlbHBlcnMudHJhY2VDb21wb3VuZFBhdGgodGhpcy5zb3VyY2VQYXRoLFxyXG4gICAgICAgICAgICBTdHJldGNoeVBhdGguT1VUTElORV9QT0lOVFMpO1xyXG4gICAgICAgIG5ld1BhdGgudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgbmV3UGF0aC5maWxsQ29sb3IgPSB0aGlzLm9wdGlvbnMucGF0aEZpbGxDb2xvcjtcclxuICAgICAgICB0aGlzLmFycmFuZ2VkUGF0aCA9IG5ld1BhdGg7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQmFja2dyb3VuZENvbG9yKCk7XHJcblxyXG4gICAgICAgIHRyYW5zZm9ybS50cmFuc2Zvcm1QYXRoSXRlbShuZXdQYXRoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheVBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5UGF0aC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGxheVBhdGggPSBuZXdQYXRoO1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0Q2hpbGQoMSwgbmV3UGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgcGF0aHMgZm9yIG91dGxpbmUgc2lkZXMsIHN0YXJ0aW5nIHdpdGggdG9wLlxyXG4gICAgICovXHJcbiAgICBnZXRPdXRsaW5lU2lkZXMoKTogcGFwZXIuUGF0aFtdIHtcclxuICAgICAgICBsZXQgc2lkZXM6IHBhcGVyLlBhdGhbXSA9IFtdO1xyXG4gICAgICAgIGxldCBzZWdtZW50R3JvdXA6IHBhcGVyLlNlZ21lbnRbXSA9IFtdO1xyXG5cclxuICAgICAgICBsZXQgY29ybmVyUG9pbnRzID0gdGhpcy5jb3JuZXJzLm1hcChjID0+IGMucG9pbnQpO1xyXG4gICAgICAgIGxldCBmaXJzdCA9IGNvcm5lclBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgIGNvcm5lclBvaW50cy5wdXNoKGZpcnN0KTtcclxuXHJcbiAgICAgICAgbGV0IHRhcmdldENvcm5lciA9IGNvcm5lclBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgIGxldCBzZWdtZW50TGlzdCA9IHRoaXMub3V0bGluZS5zZWdtZW50cy5tYXAoeCA9PiB4KTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgc2VnbWVudExpc3QucHVzaChzZWdtZW50TGlzdFswXSk7XHJcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiBzZWdtZW50TGlzdCkge1xyXG4gICAgICAgICAgICBzZWdtZW50R3JvdXAucHVzaChzZWdtZW50KTtcclxuICAgICAgICAgICAgaWYgKHRhcmdldENvcm5lci5pc0Nsb3NlKHNlZ21lbnQucG9pbnQsIHBhcGVyLk51bWVyaWNhbC5FUFNJTE9OKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZmluaXNoIHBhdGhcclxuICAgICAgICAgICAgICAgIHNpZGVzLnB1c2gobmV3IHBhcGVyLlBhdGgoc2VnbWVudEdyb3VwKSk7XHJcbiAgICAgICAgICAgICAgICBzZWdtZW50R3JvdXAgPSBbc2VnbWVudF07XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRDb3JuZXIgPSBjb3JuZXJQb2ludHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2lkZXMubGVuZ3RoICE9PSA0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3NpZGVzJywgc2lkZXMpO1xyXG4gICAgICAgICAgICB0aHJvdyAnZmFpbGVkIHRvIGdldCBzaWRlcyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2lkZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogcGF0aHMgc2hvdWxkIGJlIGNsb2Nrd2lzZTogdG9wIGlzIEwgLT4gUiwgYm90dG9tIGlzIFIgLSBMXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY3JlYXRlT3V0bGluZShwYXRocz86IHsgdG9wOiBhbnksIGJvdHRvbTogYW55IH0pIHtcclxuICAgICAgICBsZXQgb3V0bGluZTogcGFwZXIuUGF0aFxyXG5cclxuICAgICAgICBpZiAocGF0aHMpIHtcclxuICAgICAgICAgICAgY29uc3QgdG9wID0gbmV3IHBhcGVyLlBhdGgoKTtcclxuICAgICAgICAgICAgdG9wLmltcG9ydEpTT04ocGF0aHMudG9wKTtcclxuICAgICAgICAgICAgY29uc3QgYm90dG9tID0gbmV3IHBhcGVyLlBhdGgoKTtcclxuICAgICAgICAgICAgYm90dG9tLmltcG9ydEpTT04ocGF0aHMuYm90dG9tKTtcclxuICAgICAgICAgICAgY29uc3Qgc2VnbWVudHMgPSB0b3Auc2VnbWVudHMuY29uY2F0KGJvdHRvbS5zZWdtZW50cyk7XHJcbiAgICAgICAgICAgIG91dGxpbmUgPSBuZXcgcGFwZXIuUGF0aChzZWdtZW50cyk7XHJcbiAgICAgICAgICAgIC8vIGdldCBjb3JuZXJzIGFzIG91dGxpbmUgc2VnbWVudCByZWZlcmVuY2VzXHJcbiAgICAgICAgICAgIHRoaXMuY29ybmVycyA9IFtcclxuICAgICAgICAgICAgICAgIG91dGxpbmUuc2VnbWVudHNbMF0sXHJcbiAgICAgICAgICAgICAgICBvdXRsaW5lLnNlZ21lbnRzW3RvcC5zZWdtZW50cy5sZW5ndGggLSAxXSwgICAgLy8gbGFzdCB0b3Agc2VnbWVudFxyXG4gICAgICAgICAgICAgICAgb3V0bGluZS5zZWdtZW50c1t0b3Auc2VnbWVudHMubGVuZ3RoXSwgICAgICAgIC8vIGZpcnN0IGJvdHRvbSBzZWdtZW50XHJcbiAgICAgICAgICAgICAgICBvdXRsaW5lLnNlZ21lbnRzW291dGxpbmUuc2VnbWVudHMubGVuZ3RoIC0gMV1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgYm91bmRzID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcztcclxuICAgICAgICAgICAgb3V0bGluZSA9IG5ldyBwYXBlci5QYXRoKFxyXG4gICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLmNvcm5lcnModGhpcy5zb3VyY2VQYXRoLmJvdW5kcykpO1xyXG4gICAgICAgICAgICAvLyBnZXQgY29ybmVycyBhcyBvdXRsaW5lIHNlZ21lbnQgcmVmZXJlbmNlc1xyXG4gICAgICAgICAgICB0aGlzLmNvcm5lcnMgPSBvdXRsaW5lLnNlZ21lbnRzLm1hcChzID0+IHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3V0bGluZS5jbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgIG91dGxpbmUuZGFzaEFycmF5ID0gWzUsIDVdO1xyXG4gICAgICAgIHRoaXMub3V0bGluZSA9IG91dGxpbmU7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChvdXRsaW5lKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUJhY2tncm91bmRDb2xvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlQmFja2dyb3VuZENvbG9yKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgICAgICB0aGlzLm91dGxpbmUuZmlsbENvbG9yID0gdGhpcy5vcHRpb25zLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5vdXRsaW5lLm9wYWNpdHkgPSAuOTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm91dGxpbmUuZmlsbENvbG9yID0gJ3doaXRlJztcclxuICAgICAgICAgICAgdGhpcy5vdXRsaW5lLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNlZ21lbnRNYXJrZXJzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNlZ21lbnRNYXJrZXJzR3JvdXApIHtcclxuICAgICAgICAgICAgdGhpcy5zZWdtZW50TWFya2Vyc0dyb3VwLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgYm91bmRzID0gdGhpcy5zb3VyY2VQYXRoLmJvdW5kcztcclxuICAgICAgICB0aGlzLnNlZ21lbnRNYXJrZXJzR3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICB0aGlzLnNlZ21lbnRNYXJrZXJzR3JvdXAuYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiB0aGlzLm91dGxpbmUuc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVTZWdtZW50SGFuZGxlKHNlZ21lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuc2VnbWVudE1hcmtlcnNHcm91cCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVNaWRwaW9udE1hcmtlcnMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubWlkcG9pbnRHcm91cCkge1xyXG4gICAgICAgICAgICB0aGlzLm1pZHBvaW50R3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWlkcG9pbnRHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIHRoaXMub3V0bGluZS5jdXJ2ZXMuZm9yRWFjaChjdXJ2ZSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHNraXAgbGVmdCBhbmQgcmlnaHQgc2lkZXNcclxuICAgICAgICAgICAgaWYgKGN1cnZlLnNlZ21lbnQxID09PSB0aGlzLmNvcm5lcnNbMV1cclxuICAgICAgICAgICAgICAgIHx8IGN1cnZlLnNlZ21lbnQxID09PSB0aGlzLmNvcm5lcnNbM10pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgaGFuZGxlID0gbmV3IEN1cnZlU3BsaXR0ZXJIYW5kbGUoY3VydmUpO1xyXG4gICAgICAgICAgICBoYW5kbGUub25EcmFnU3RhcnQgPSAoKSA9PiB0aGlzLnNoYXBlQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbkRyYWdFbmQgPSAobmV3U2VnbWVudCwgZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIHVwZ3JhZGUgdG8gc2VnbWVudCBoYW5nbGVcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2VnbWVudEhhbmRsZShuZXdTZWdtZW50KTtcclxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBtaWRwb2ludCBoYW5kbGVcclxuICAgICAgICAgICAgICAgIGhhbmRsZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub25PdXRsaW5lQ2hhbmdlZCAmJiB0aGlzLm9uT3V0bGluZUNoYW5nZWQodGhpcy5vdXRsaW5lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYW5nZUNvbnRlbnRzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMubWlkcG9pbnRHcm91cC5hZGRDaGlsZChoYW5kbGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5taWRwb2ludEdyb3VwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNlZ21lbnRIYW5kbGUoc2VnbWVudDogcGFwZXIuU2VnbWVudCkge1xyXG4gICAgICAgIGxldCBoYW5kbGUgPSBuZXcgU2VnbWVudEhhbmRsZShzZWdtZW50KTtcclxuICAgICAgICBoYW5kbGUub25EcmFnU3RhcnQgPSAoKSA9PiB0aGlzLnNoYXBlQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgaGFuZGxlLm9uQ2hhbmdlQ29tcGxldGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25PdXRsaW5lQ2hhbmdlZCAmJiB0aGlzLm9uT3V0bGluZUNoYW5nZWQodGhpcy5vdXRsaW5lKTtcclxuICAgICAgICAgICAgdGhpcy5hcnJhbmdlQ29udGVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZWdtZW50TWFya2Vyc0dyb3VwLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBTdHJldGNoeVBhdGhPcHRpb25zIHtcclxuICAgIHBhdGhGaWxsQ29sb3I6IHN0cmluZztcclxuICAgIGJhY2tncm91bmRDb2xvcjogc3RyaW5nO1xyXG59XHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoeVRleHQgZXh0ZW5kcyBTdHJldGNoeVBhdGgge1xyXG5cclxuICAgIGZmb250OiBvcGVudHlwZS5Gb250O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnQ6IG9wZW50eXBlLkZvbnQsIFxyXG4gICAgICAgIG9wdGlvbnM6IFN0cmV0Y2h5VGV4dE9wdGlvbnMsIFxyXG4gICAgICAgIHBvc2l0aW9uPzogbnVtYmVyW10sXHJcbiAgICAgICAgcGF0aHM/OiB7dG9wOmFueSwgYm90dG9tOiBhbnl9KSB7XHJcbiAgICAgICAgc3VwZXIoU3RyZXRjaHlUZXh0LmdldFRleHRQYXRoKGZvbnQsIG9wdGlvbnMpLCBvcHRpb25zLCBwb3NpdGlvbiwgcGF0aHMpO1xyXG4gICAgICAgIHRoaXMuZmZvbnQgPSBmb250O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUob3B0aW9uczogU3RyZXRjaHlUZXh0T3B0aW9ucyl7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICBzdXBlci51cGRhdGVQYXRoKFN0cmV0Y2h5VGV4dC5nZXRUZXh0UGF0aCh0aGlzLmZmb250LCBvcHRpb25zKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBnZXRUZXh0UGF0aChmb250OiBvcGVudHlwZS5Gb250LCBvcHRpb25zOiBTdHJldGNoeVRleHRPcHRpb25zKXtcclxuICAgICAgICBsZXQgb3BlblR5cGVQYXRoID0gZm9udC5nZXRQYXRoKFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy50ZXh0LCBcclxuICAgICAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmZvbnRTaXplIHx8IDMyKTtcclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmltcG9ydE9wZW5UeXBlUGF0aChvcGVuVHlwZVBhdGgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgU3RyZXRjaHlUZXh0T3B0aW9ucyBleHRlbmRzIFN0cmV0Y2h5UGF0aE9wdGlvbnMge1xyXG4gICAgdGV4dDogc3RyaW5nO1xyXG4gICAgZm9udFNpemU6IG51bWJlcjtcclxufVxyXG4iLCJcclxuLyoqXHJcbiAqIE1lYXN1cmVzIG9mZnNldHMgb2YgdGV4dCBnbHlwaHMuXHJcbiAqL1xyXG5jbGFzcyBUZXh0UnVsZXIge1xyXG4gICAgXHJcbiAgICBmb250RmFtaWx5OiBzdHJpbmc7XHJcbiAgICBmb250V2VpZ2h0OiBudW1iZXI7XHJcbiAgICBmb250U2l6ZTogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCAodGV4dCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XHJcbiAgICAgICAgcG9pbnRUZXh0LmNvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgIHBvaW50VGV4dC5qdXN0aWZpY2F0aW9uID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBpZih0aGlzLmZvbnRGYW1pbHkpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udEZhbWlseSA9IHRoaXMuZm9udEZhbWlseTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5mb250V2VpZ2h0KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRXZWlnaHQgPSB0aGlzLmZvbnRXZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFNpemUpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcG9pbnRUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRleHRPZmZzZXRzKHRleHQpe1xyXG4gICAgICAgIC8vIE1lYXN1cmUgZ2x5cGhzIGluIHBhaXJzIHRvIGNhcHR1cmUgd2hpdGUgc3BhY2UuXHJcbiAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxyXG4gICAgICAgIHZhciBnbHlwaFBhaXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpKzEpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRm9yIGVhY2ggY2hhcmFjdGVyLCBmaW5kIGNlbnRlciBvZmZzZXQuXHJcbiAgICAgICAgdmFyIHhPZmZzZXRzID0gWzBdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gTWVhc3VyZSB0aHJlZSBjaGFyYWN0ZXJzIGF0IGEgdGltZSB0byBnZXQgdGhlIGFwcHJvcHJpYXRlIFxyXG4gICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxyXG4gICAgICAgICAgICB2YXIgdHJpYWRUZXh0ID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSAtIDEsIGkgKyAxKSk7XHJcbiAgICAgICAgICAgIHRyaWFkVGV4dC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXHJcbiAgICAgICAgICAgIC8vICAgYW5kIGhhbGYgb2YgY3VycmVudCBnbHlwaCBwYWlyLlxyXG4gICAgICAgICAgICAvLyBNdXN0IGJlIHJpZ2h0LCBiZWNhdXNlIGl0IHdvcmtzLlxyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2kgLSAxXS5ib3VuZHMud2lkdGggLyAyIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHdpZHRoIHRvIHByaW9yIG9mZnNldC4gXHJcbiAgICAgICAgICAgIHhPZmZzZXRzW2ldID0geE9mZnNldHNbaSAtIDFdICsgb2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgZ2x5cGhQYWlyIG9mIGdseXBoUGFpcnMpe1xyXG4gICAgICAgICAgICBnbHlwaFBhaXIucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB4T2Zmc2V0cztcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgVmlld1pvb20ge1xyXG5cclxuICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcbiAgICBmYWN0b3IgPSAxLjI1O1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9taW5ab29tOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9tYXhab29tOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvamVjdDogcGFwZXIuUHJvamVjdCkge1xyXG4gICAgICAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuXHJcbiAgICAgICAgKDxhbnk+JCh2aWV3LmVsZW1lbnQpKS5tb3VzZXdoZWVsKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbW91c2VQb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludChldmVudC5vZmZzZXRYLCBldmVudC5vZmZzZXRZKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2Vab29tQ2VudGVyZWQoZXZlbnQuZGVsdGFZLCBtb3VzZVBvc2l0aW9uKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgem9vbSgpOiBudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvamVjdC52aWV3Lnpvb207XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHpvb21SYW5nZSgpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLl9taW5ab29tLCB0aGlzLl9tYXhab29tXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB6b29tIGxldmVsLlxyXG4gICAgICogQHJldHVybnMgem9vbSBsZXZlbCB0aGF0IHdhcyBzZXQsIG9yIG51bGwgaWYgaXQgd2FzIG5vdCBjaGFuZ2VkXHJcbiAgICAgKi9cclxuICAgIHNldFpvb21Db25zdHJhaW5lZCh6b29tOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGlmKHRoaXMuX21pblpvb20pIHtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWF4KHpvb20sIHRoaXMuX21pblpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9tYXhab29tKXtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWluKHpvb20sIHRoaXMuX21heFpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGlmKHpvb20gIT0gdmlldy56b29tKXtcclxuICAgICAgICAgICAgdmlldy56b29tID0gem9vbTtcclxuICAgICAgICAgICAgcmV0dXJuIHpvb207XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFpvb21SYW5nZShyYW5nZTogcGFwZXIuU2l6ZVtdKTogbnVtYmVyW10ge1xyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgbGV0IGFTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICBsZXQgYlNpemUgPSByYW5nZS5zaGlmdCgpO1xyXG4gICAgICAgIGxldCBhID0gYVNpemUgJiYgTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBhU2l6ZS5oZWlnaHQsICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYVNpemUud2lkdGgpO1xyXG4gICAgICAgIGxldCBiID0gYlNpemUgJiYgTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBiU2l6ZS5oZWlnaHQsICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYlNpemUud2lkdGgpO1xyXG4gICAgICAgIGxldCBtaW4gPSBNYXRoLm1pbihhLGIpO1xyXG4gICAgICAgIGlmKG1pbil7XHJcbiAgICAgICAgICAgIHRoaXMuX21pblpvb20gPSBtaW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBtYXggPSBNYXRoLm1heChhLGIpO1xyXG4gICAgICAgIGlmKG1heCl7XHJcbiAgICAgICAgICAgIHRoaXMuX21heFpvb20gPSBtYXg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlWm9vbUNlbnRlcmVkKGRlbHRhWTogbnVtYmVyLCBtb3VzZVBvczogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICBpZiAoIWRlbHRhWSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgbGV0IG9sZFpvb20gPSB2aWV3Lnpvb207XHJcbiAgICAgICAgbGV0IG9sZENlbnRlciA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgIGxldCB2aWV3UG9zID0gdmlldy52aWV3VG9Qcm9qZWN0KG1vdXNlUG9zKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbmV3Wm9vbSA9IGRlbHRhWSA+IDBcclxuICAgICAgICAgICAgPyB2aWV3Lnpvb20gKiB0aGlzLmZhY3RvclxyXG4gICAgICAgICAgICA6IHZpZXcuem9vbSAvIHRoaXMuZmFjdG9yO1xyXG4gICAgICAgIG5ld1pvb20gPSB0aGlzLnNldFpvb21Db25zdHJhaW5lZChuZXdab29tKTtcclxuICAgICAgICBcclxuICAgICAgICBpZighbmV3Wm9vbSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB6b29tU2NhbGUgPSBvbGRab29tIC8gbmV3Wm9vbTtcclxuICAgICAgICBsZXQgY2VudGVyQWRqdXN0ID0gdmlld1Bvcy5zdWJ0cmFjdChvbGRDZW50ZXIpO1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSB2aWV3UG9zLnN1YnRyYWN0KGNlbnRlckFkanVzdC5tdWx0aXBseSh6b29tU2NhbGUpKVxyXG4gICAgICAgICAgICAuc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuXHJcbiAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LmNlbnRlci5hZGQob2Zmc2V0KTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHpvb21UbyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpe1xyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgdmlldy5jZW50ZXIgPSByZWN0LmNlbnRlcjtcclxuICAgICAgICB2aWV3Lnpvb20gPSBNYXRoLm1pbiggXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIHJlY3QuaGVpZ2h0LCAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIHJlY3Qud2lkdGgpICogMC45NTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgV29ya3NwYWNlIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgIGRlZmF1bHRCYWNrZ3JvdW5kQ29sb3IgPSAnI2ZkZmRmZCc7XHJcblxyXG4gICAgc2hlZXQ6IHBhcGVyLlNoYXBlO1xyXG5cclxuICAgIGdldCBiYWNrZ3JvdW5kQ29sb3IoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zaGVldC5maWxsQ29sb3IudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgYmFja2dyb3VuZENvbG9yKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNoZWV0LmZpbGxDb2xvciA9IHZhbHVlIHx8IHRoaXMuZGVmYXVsdEJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICBcclxuICAgICAgICAvLyBIaWRlIHN0cm9rZSB3aGVuIHBvc3NpYmxlIGJlY2F1c2UgaXQgaGFzIGEgd2VpcmQgc2hhZG93LiBcclxuICAgICAgICAvLyBBc3N1bWUgY2FudmFzIGlzIHdoaXRlLlxyXG4gICAgICAgIHRoaXMuc2hlZXQuc3Ryb2tlQ29sb3IgPSAoPHBhcGVyLkNvbG9yPnRoaXMuc2hlZXQuZmlsbENvbG9yKS5icmlnaHRuZXNzID4gMC45N1xyXG4gICAgICAgICAgICA/IFwibGlnaHRncmF5XCJcclxuICAgICAgICAgICAgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNpemU6IHBhcGVyLlNpemUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBsZXQgc2hlZXQgPSBwYXBlci5TaGFwZS5SZWN0YW5nbGUoXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLCAwKSwgc2l6ZSk7XHJcbiAgICAgICAgc2hlZXQuc3R5bGUuc2hhZG93Q29sb3IgPSAnZ3JheSc7XHJcbiAgICAgICAgc2hlZXQuc3R5bGUuc2hhZG93Qmx1ciA9IDM7XHJcbiAgICAgICAgc2hlZXQuc3R5bGUuc2hhZG93T2Zmc2V0ID0gbmV3IHBhcGVyLlBvaW50KDUsIDUpXHJcbiAgICAgICAgdGhpcy5zaGVldCA9IHNoZWV0O1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoc2hlZXQpO1xyXG5cclxuICAgICAgICB0aGlzLnNoZWV0LmZpbGxDb2xvciA9IHRoaXMuZGVmYXVsdEJhY2tncm91bmRDb2xvcjtcclxuXHJcbiAgICAgICAgLy90aGlzLmxheWVyLm9uTW91c2VEcmFnID0gKGV2ZW50KSA9PiBjb25zb2xlLmxvZygnbW91c2VkcmFnJywgZXZlbnQpO1xyXG5cclxuICAgICAgICB0aGlzLm1vdXNlQmVoYXZpb3IgPSA8TW91c2VCZWhhdmlvcj57XHJcbiAgICAgICAgICAgIC8vIG9uQ2xpY2s6IGUgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgcGFwZXIucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBvbkRyYWdNb3ZlOiBlID0+IHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZChlLmRlbHRhKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIlxyXG5cclxuZnVuY3Rpb24gYm9vdHN0cmFwKCkge1xyXG4gICAgY29uc3QgY2hhbm5lbHMgPSBuZXcgQ2hhbm5lbHMoKTtcclxuICAgIGNvbnN0IGFjdGlvbnMgPSBjaGFubmVscy5hY3Rpb25zLCBldmVudHMgPSBjaGFubmVscy5ldmVudHM7XHJcblxyXG5hY3Rpb25zLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcclxuZXZlbnRzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcclxuXHJcbiAgICBjb25zdCByb290U3RvcmUgPSBuZXcgU3RvcmUoYWN0aW9ucywgZXZlbnRzKTtcclxuXHJcbiAgICBjb25zdCBza2V0Y2hFZGl0b3IgPSBuZXcgU2tldGNoRWRpdG9yKGFjdGlvbnMpOyBcclxuICAgIGNvbnN0IHNrZXRjaERvbSQgPSBldmVudHMubWVyZ2UoXHJcbiAgICAgICAgZXZlbnRzLnNrZXRjaC5sb2FkZWQsIGV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQpXHJcbiAgICAgICAgLm1hcChtID0+IHNrZXRjaEVkaXRvci5yZW5kZXIobS5yb290RGF0YS5za2V0Y2gpKTtcclxuICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShza2V0Y2hEb20kLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduZXInKSk7XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtRWRpdG9yID0gbmV3IFNlbGVjdGVkSXRlbUVkaXRvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRvck92ZXJsYXlcIiksIGNoYW5uZWxzKTtcclxuXHJcbiAgICBjb25zdCBkZXNpZ25lckNvbnRyb2xsZXIgPSBuZXcgRGVzaWduZXJDb250cm9sbGVyKGNoYW5uZWxzLCAoKSA9PiB7XHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guY3JlYXRlLmRpc3BhdGNoKCk7XHJcbiAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2suYWRkLmRpc3BhdGNoKHsgdGV4dDogXCJGSURETEVTVElDS1NcIiwgdGV4dENvbG9yOiBcImxpZ2h0Ymx1ZVwiLCBmb250U2l6ZTogMTI4IH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmJvb3RzdHJhcCgpOyJdfQ==