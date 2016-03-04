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
var PaperHelpers;
(function (PaperHelpers) {
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
    PaperHelpers.tracePathAsPoints = function (path, numPoints) {
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
        return points;
    };
    PaperHelpers.tracePath = function (path, numPoints) {
        var points = PaperHelpers.tracePathAsPoints(path, numPoints);
        return new paper.Path({
            segments: points,
            closed: true,
            clockwise: path.clockwise
        });
    };
    PaperHelpers.dualBoundsPathProjection = function (topPath, bottomPath) {
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
    PaperHelpers.cloneSegment = function (segment) {
        return new paper.Segment(segment.point, segment.handleIn, segment.handleOut);
    };
    /**
     * Make an item draggable, adding related events.
     */
    PaperHelpers.addSmartDrag = function (item) {
        item.isSmartDraggable = true;
        item.on(paper.EventType.mouseDrag, function (ev) {
            if (!item.isSmartDragging) {
                item.isSmartDragging = true;
                item.emit(PaperHelpers.EventType.smartDragStart, ev);
            }
            item.position = item.position.add(ev.delta);
            ev.stop();
            item.emit(PaperHelpers.EventType.smartDragMove, ev);
        });
        item.on(paper.EventType.mouseUp, function (ev) {
            if (item.isSmartDragging) {
                item.isSmartDragging = false;
                if (item.emit(PaperHelpers.EventType.smartDragEnd, ev)) {
                    ev.stop();
                }
            }
            else {
                if (item.emit(PaperHelpers.EventType.clickWithoutDrag, ev)) {
                    ev.stop();
                }
            }
        });
    };
    PaperHelpers.EventType = {
        /**
         * Drag action has started.
         */
        smartDragStart: "smartDragStart",
        /**
         * Dragged item has moved.
         */
        smartDragMove: "smartDragMove",
        /**
         * Drag action has ended.
         */
        smartDragEnd: "smartDragEnd",
        /**
         * The normal click event will fire even at the end of a drag.
         * This click event does not.
         */
        clickWithoutDrag: "clickWithoutDrag"
    };
})(PaperHelpers || (PaperHelpers = {}));
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
        var flagList = [];
        _.forOwn(ChangeFlag, function (value, key) {
            if ((typeof value) === "number" && (value & flags)) {
                flagList.push(key);
            }
        });
        return flagList.join(' | ');
    }
    PaperNotify.describe = describe;
})(PaperNotify || (PaperNotify = {}));
PaperNotify.initialize();
var paper;
(function (paper) {
    paper.EventType = {
        frame: "frame",
        mouseDown: "mousedown",
        mouseUp: "mouseup",
        mouseDrag: "mousedrag",
        click: "click",
        doubleClick: "doubleclick",
        mouseMove: "mousemove",
        mouseEnter: "mouseenter",
        mouseLeave: "mouseleave"
    };
})(paper || (paper = {}));
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
var AppController = (function () {
    function AppController(channels, store, sketchEditor, selectedItemEditor, designerController) {
        var actions = channels.actions, events = channels.events;
        actions.subscribe(function (x) { return console.log(x); });
        events.subscribe(function (x) { return console.log(x); });
        events.app.fontsReadyChanged.subscribe(function (m) {
            if (m.data === true) {
                events.app.retainedStateLoadAttemptComplete.subscribe(function (m) {
                    if (!m.data) {
                        // no autosave data loaded
                        actions.sketch.create.dispatch();
                        actions.textBlock.add.dispatch({ text: "FIDDLESTICKS", textColor: "lightblue", fontSize: 128 });
                    }
                    // Auto-save in one line: gotta love it.
                    events.app.retainedStateChanged.observe().debounce(800).subscribe(function (state) {
                        actions.app.saveRetainedState.dispatch();
                    });
                });
                actions.app.loadRetainedState.dispatch();
            }
        });
    }
    return AppController;
}());
var Actions = (function (_super) {
    __extends(Actions, _super);
    function Actions() {
        _super.apply(this, arguments);
        this.app = {
            /**
             * Instructs Store to load retained state from local storage, if it exists.
             */
            loadRetainedState: this.topic("app.loadRetainedState"),
            /**
             * Instructs Store to save retained state to local storage.
             */
            saveRetainedState: this.topic("app.saveRetainedState"),
            setFontsReady: this.topic("app.setFontsReady")
        };
        this.designer = {
            zoomToFit: this.topic("designer.zoomToFit")
        };
        this.sketch = {
            create: this.topic("sketch.create"),
            attrUpdate: this.topic("sketch.attrupdate"),
            setEditingItem: this.topic("sketch.seteditingitem"),
            setSelection: this.topic("sketch.setselection"),
        };
        this.textBlock = {
            add: this.topic("textblock.add"),
            updateAttr: this.topic("textblock.updateAttr"),
            updateArrange: this.topic("textblock.updateArrange"),
            remove: this.topic("textblock.remove")
        };
    }
    return Actions;
}(TypedChannel.Channel));
var Events = (function (_super) {
    __extends(Events, _super);
    function Events() {
        _super.apply(this, arguments);
        this.app = {
            retainedStateLoadAttemptComplete: this.topic("app.retainedStateLoadAttemptComplete"),
            retainedStateChanged: this.topic("app.retainedStateChanged"),
            fontsReadyChanged: this.topic("app.fontsReadyChanged")
        };
        this.designer = {
            zoomToFitRequested: this.topic("designer.zoomToFitRequested")
        };
        this.sketch = {
            loaded: this.topic("sketch.loaded"),
            attrChanged: this.topic("sketch.attrChanged"),
            editingItemChanged: this.topic("sketch.editingItemChanged"),
            selectionChanged: this.topic("sketch.selectionChanged"),
            saveLocalRequested: this.topic("sketch.savelocal.saveLocalRequested")
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
/**
 * The singleton Store controls all application state.
 * No parts outside of the Store modify application state.
 * Communication with the Store is done through message Channels:
 *   - Actions channel to send into the Store,
 *   - Events channel to receive notification from the Store.
 * Only the Store can receive action messages.
 * Only the Store can send event messages.
 * The Store cannot send actions or listen to events (to avoid loops).
 * Messages are to be treated as immutable.
 * All mentions of the Store can be assumed to mean, of course,
 *   "The Store and its sub-components."
 */
var Store = (function () {
    function Store(channels) {
        var _this = this;
        this.state = {
            retained: {
                sketch: this.createSketch()
            },
            disposable: {}
        };
        this.channels = channels;
        var actions = channels.actions, events = channels.events;
        // ----- App -----
        actions.app.loadRetainedState.subscribe(function (m) {
            var success = false;
            if (!localStorage || !localStorage.getItem) {
                // not supported
                return;
            }
            var saved = localStorage.getItem(Store.AUTOSAVE_KEY);
            if (saved) {
                var loaded = JSON.parse(saved);
                if (loaded && loaded.sketch && loaded.sketch.textBlocks) {
                    // data seems legit
                    _this.state.retained = loaded;
                    events.sketch.loaded.dispatchContext(_this.state, _this.state.retained.sketch);
                    for (var _i = 0, _a = _this.state.retained.sketch.textBlocks; _i < _a.length; _i++) {
                        var tb = _a[_i];
                        events.textblock.loaded.dispatchContext(_this.state, tb);
                    }
                    events.designer.zoomToFitRequested.dispatch();
                    success = true;
                }
            }
            events.app.retainedStateLoadAttemptComplete.dispatch(success);
        });
        actions.app.saveRetainedState.subscribe(function (m) {
            if (!localStorage || !localStorage.getItem) {
                // not supported
                return;
            }
            localStorage.setItem(Store.AUTOSAVE_KEY, JSON.stringify(_this.state.retained));
        });
        actions.app.setFontsReady.subscribe(function (m) {
            if (m.data !== _this.state.disposable.fontsReady) {
                _this.state.disposable.fontsReady = m.data;
                events.app.fontsReadyChanged.dispatchContext(_this.state, _this.state.disposable.fontsReady);
            }
        });
        // ----- Designer -----
        actions.designer.zoomToFit.subscribe(function (m) {
            events.designer.zoomToFitRequested.dispatch(null);
        });
        // ----- Sketch -----
        actions.sketch.create
            .subscribe(function (m) {
            _this.state.retained.sketch = _this.createSketch();
            var attr = m.data || {};
            attr.backgroundColor = attr.backgroundColor || '#f6f3eb';
            _this.state.retained.sketch.attr = attr;
            events.sketch.loaded.dispatchContext(_this.state, _this.state.retained.sketch);
            events.designer.zoomToFitRequested.dispatchContext(_this.state);
            _this.changedRetainedState();
        });
        actions.sketch.attrUpdate
            .subscribe(function (ev) {
            _this.assign(_this.state.retained.sketch.attr, ev.data);
            events.sketch.attrChanged.dispatchContext(_this.state, _this.state.retained.sketch.attr);
            _this.changedRetainedState();
        });
        actions.sketch.setEditingItem.subscribe(function (m) {
            if (m.data.itemType !== "TextBlock") {
                throw "Unhandled type " + m.type;
            }
            var item = _this.getBlock(m.data.itemId);
            _this.state.disposable.editingItem = {
                itemId: m.data.itemId,
                itemType: "TextBlock",
                item: item,
                clientX: m.data.clientX,
                clientY: m.data.clientY
            };
            events.sketch.editingItemChanged.dispatchContext(_this.state, _this.state.disposable.editingItem);
        });
        actions.sketch.setSelection.subscribe(function (m) {
            if (m.data.itemType && m.data.itemType !== "TextBlock") {
                throw "Unhandled type " + m.type;
            }
            if ((m.data && m.data.itemId)
                === (_this.state.disposable.selection && _this.state.disposable.selection.itemId)) {
                // nothing to do
                return;
            }
            _this.state.disposable.selection = {
                itemId: m.data.itemId,
                itemType: m.data.itemType,
                priorSelectionItemId: _this.state.disposable.selection
                    && _this.state.disposable.selection.itemId
            };
            events.sketch.selectionChanged.dispatchContext(_this.state, _this.state.disposable.selection);
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
                block.fontSize = 128;
            }
            if (!block.textColor) {
                block.textColor = "gray";
            }
            _this.state.retained.sketch.textBlocks.push(block);
            events.textblock.added.dispatchContext(_this.state, block);
            _this.changedRetainedState();
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
                events.textblock.attrChanged.dispatchContext(_this.state, block);
                _this.changedRetainedState();
            }
        });
        actions.textBlock.remove
            .subscribe(function (ev) {
            var didDelete = false;
            _.remove(_this.state.retained.sketch.textBlocks, function (tb) {
                if (tb._id === ev.data._id) {
                    didDelete = true;
                    return true;
                }
            });
            if (didDelete) {
                events.textblock.removed.dispatchContext(_this.state, { _id: ev.data._id });
                if (_this.state.disposable.editingItem.itemId == ev.data._id) {
                    _this.state.disposable.editingItem = {};
                    events.sketch.editingItemChanged.dispatch(_this.state.disposable.editingItem);
                }
                _this.changedRetainedState();
            }
        });
        actions.textBlock.updateArrange
            .subscribe(function (ev) {
            var block = _this.getBlock(ev.data._id);
            if (block) {
                block.position = ev.data.position;
                block.outline = ev.data.outline;
                events.textblock.arrangeChanged.dispatchContext(_this.state, block);
                _this.changedRetainedState();
            }
        });
    }
    Store.prototype.changedRetainedState = function () {
        this.channels.events.app.retainedStateChanged.dispatch(this.state.retained);
    };
    Store.prototype.assign = function (dest, source) {
        _.merge(dest, source);
    };
    Store.prototype.createSketch = function () {
        return {
            attr: {},
            textBlocks: []
        };
    };
    Store.prototype.getBlock = function (id) {
        return _.find(this.state.retained.sketch.textBlocks, function (tb) { return tb._id === id; });
    };
    Store.AUTOSAVE_KEY = "Fiddlesticks.retainedState";
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
    function DesignerController(channels) {
        var _this = this;
        this.fonts = [];
        this.loadFont(Roboto500, function (font) {
            _this.workspaceController = new WorkspaceController(channels, font);
            channels.actions.app.setFontsReady.dispatch(true);
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
    function SketchEditor(container, channels) {
        var _this = this;
        _super.call(this);
        this.actions = channels.actions;
        var sketchDom$ = channels.events.merge(channels.events.sketch.loaded, channels.events.sketch.attrChanged)
            .map(function (m) { return _this.render(m.rootData.retained.sketch); });
        ReactiveDom.renderStream(sketchDom$, container);
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
                    // { 
                    //     content: "Load from local",
                    //     attrs: {
                    //         title: "Load from local browser storage"
                    //     },
                    //     onClick: () => this.actions.app.loadRetainedState.dispatch()
                    // },
                    {
                        content: "Zoom to fit",
                        attrs: {
                            title: "Fit sketch contents in view"
                        },
                        onClick: function () { return _this.actions.designer.zoomToFit.dispatch(); }
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
        this.defaultScale = 0.02;
        this._textBlockItems = {};
        this.channels = channels;
        this.font = font;
        paper.settings.handleSize = 1;
        this.canvas = document.getElementById('mainCanvas');
        paper.setup(this.canvas);
        this.project = paper.project;
        this.viewZoom = new ViewZoom(this.project);
        channels.events.sketch.loaded.subscribe(function (ev) {
            _this._sketch = ev.data;
            _this.project.clear();
            _this.project.deselectAll();
            _this._textBlockItems = {};
            var clearSelection = function (ev) {
                return _this.channels.actions.sketch.setSelection.dispatch({});
            };
            if (_this.workspace) {
                _this.workspace.off(paper.EventType.click, clearSelection);
                _this.workspace.off(PaperHelpers.EventType.smartDragStart, clearSelection);
            }
            _this.workspace = new Workspace(_this.defaultSize);
            _this.workspace.bounds.center = new paper.Point(0, 0);
            _this.workspace.backgroundColor = ev.data.attr.backgroundColor;
            _this.workspace.on(paper.EventType.click, clearSelection);
            _this.workspace.on(PaperHelpers.EventType.smartDragStart, clearSelection);
            var sheetBounds = _this.workspace.sheet.bounds;
            _this.viewZoom.setZoomRange([sheetBounds.scale(0.005).size, sheetBounds.scale(0.25).size]);
        });
        channels.events.sketch.attrChanged.subscribe(function (ev) { return _this.workspace.backgroundColor = ev.data.backgroundColor; });
        channels.events.mergeTyped(channels.events.textblock.added, channels.events.textblock.loaded).subscribe(function (ev) { return _this.addBlock(ev.data); });
        channels.events.textblock.attrChanged.subscribe(function (m) {
            var item = _this._textBlockItems[m.data._id];
            if (item) {
                var textBlock = m.data;
                item.text = textBlock.text;
                item.customStyle = {
                    fontSize: textBlock.fontSize,
                    fillColor: textBlock.textColor,
                    backgroundColor: textBlock.backgroundColor
                };
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
            if (!m.data || !m.data.itemId) {
                _this.project.deselectAll();
                _this.channels.events.sketch.editingItemChanged.dispatch({});
                return;
            }
            var item = m.data.itemId && _this._textBlockItems[m.data.itemId];
            if (item && !item.selected) {
                _this.project.deselectAll();
                _this.channels.events.sketch.editingItemChanged.dispatch({});
                item.selected = true;
            }
        });
        channels.events.designer.zoomToFitRequested.subscribe(function () {
            _this.zoomToFit();
        });
    }
    WorkspaceController.prototype.zoomToFit = function () {
        var bounds;
        _.forOwn(this._textBlockItems, function (item) {
            bounds = bounds
                ? bounds.unite(item.bounds)
                : item.bounds;
        });
        if (!bounds) {
            bounds = new paper.Rectangle(new paper.Point(0, 0), this.defaultSize.multiply(this.defaultScale));
        }
        this.viewZoom.zoomTo(bounds.scale(1.05));
    };
    WorkspaceController.prototype.addBlock = function (textBlock) {
        var _this = this;
        if (!textBlock) {
            return;
        }
        if (!textBlock._id) {
            console.error('received block without id', textBlock);
        }
        var item = this._textBlockItems[textBlock._id];
        if (item) {
            console.error("Received addBlock for block that is already loaded");
            return;
        }
        var bounds;
        if (textBlock.outline) {
            var loadSegment = function (record) {
                var point = record[0];
                if (point instanceof Array) {
                    return new paper.Segment(new paper.Point(record[0]), record[1] && new paper.Point(record[1]), record[2] && new paper.Point(record[2]));
                }
                // Single-point segments are stored as number[2]
                return new paper.Segment(new paper.Point(record));
            };
            bounds = {
                upper: textBlock.outline.top.segments.map(loadSegment),
                lower: textBlock.outline.bottom.segments.map(loadSegment)
            };
        }
        item = new TextWarp(this.font, textBlock.text, bounds, textBlock.fontSize, {
            fontSize: textBlock.fontSize,
            fillColor: textBlock.textColor || "red",
            backgroundColor: textBlock.backgroundColor
        });
        if (!textBlock.outline && textBlock.position) {
            item.position = new paper.Point(textBlock.position);
        }
        item.on(PaperHelpers.EventType.clickWithoutDrag, function (ev) {
            item.bringToFront();
            if (item.selected) {
                // edit
                var editorAt = _this.project.view.projectToView(PaperHelpers.midpoint(item.bounds.topLeft, item.bounds.center));
                _this.channels.actions.sketch.setEditingItem.dispatch({
                    itemId: textBlock._id,
                    itemType: "TextBlock",
                    clientX: editorAt.x,
                    clientY: editorAt.y
                });
            }
            else {
                // select
                _this.channels.actions.sketch.setSelection.dispatch({ itemId: textBlock._id, itemType: "TextBlock" });
            }
        });
        item.on(PaperHelpers.EventType.smartDragStart, function (ev) {
            item.bringToFront();
            if (!item.selected) {
                _this.channels.actions.sketch.setSelection.dispatch({ itemId: textBlock._id, itemType: "TextBlock" });
            }
        });
        item.on(PaperHelpers.EventType.smartDragEnd, function (ev) {
            var block = _this.getBlockArrangement(item);
            block._id = textBlock._id;
            _this.channels.actions.textBlock.updateArrange.dispatch(block);
        });
        item.observe(function (flags) {
            if (flags & PaperNotify.ChangeFlag.GEOMETRY) {
                var block = _this.getBlockArrangement(item);
                block._id = textBlock._id;
                _this.channels.actions.textBlock.updateArrange.dispatch(block);
            }
        });
        item.data = textBlock._id;
        this.workspace.addChild(item);
        if (!textBlock.position) {
            item.position = this.project.view.bounds.point.add(new paper.Point(item.bounds.width / 2, item.bounds.height / 2)
                .add(50));
        }
        this._textBlockItems[textBlock._id] = item;
    };
    WorkspaceController.prototype.getBlockArrangement = function (item) {
        // export returns an array with item type and serialized object:
        //   ["Path", { segments:[][] }]
        var top = item.upper.exportJSON({ asString: false })[1];
        var bottom = item.lower.exportJSON({ asString: false })[1];
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
var DualBoundsPathWarp = (function (_super) {
    __extends(DualBoundsPathWarp, _super);
    function DualBoundsPathWarp(source, bounds, customStyle) {
        var _this = this;
        _super.call(this);
        // -- build children --
        this._source = source;
        this._source.visible = false;
        if (bounds) {
            this._upper = new StretchPath(bounds.upper);
            this._lower = new StretchPath(bounds.lower);
        }
        else {
            this._upper = new StretchPath([
                new paper.Segment(source.bounds.topLeft),
                new paper.Segment(source.bounds.topRight)
            ]);
            this._lower = new StretchPath([
                new paper.Segment(source.bounds.bottomLeft),
                new paper.Segment(source.bounds.bottomRight)
            ]);
        }
        this._upper.visible = this.selected;
        this._lower.visible = this.selected;
        this._outline = new paper.Path({ closed: true });
        this.updateOutlineShape();
        this._warped = new paper.CompoundPath(source.pathData);
        this.updateWarped();
        // -- add children --
        this.addChildren([this._outline, this._warped, this._upper, this._lower]);
        // -- assign style --
        this.customStyle = customStyle || {
            strokeColor: "lightgray"
        };
        PaperHelpers.addSmartDrag(this);
        // -- set up observers --
        var boundsWatch = function (flags) {
            if (flags & PaperNotify.ChangeFlag.SEGMENTS) {
                _this.updateOutlineShape();
                _this.updateWarped();
                _this._changed(PaperNotify.ChangeFlag.GEOMETRY);
            }
        };
        this._upper.observe(boundsWatch);
        this._lower.observe(boundsWatch);
        this.observe(function (flags) {
            if (flags & PaperNotify.ChangeFlag.ATTRIBUTE) {
                if (_this._upper.visible !== _this.selected) {
                    _this._upper.visible = _this.selected;
                    _this._lower.visible = _this.selected;
                }
            }
        });
    }
    Object.defineProperty(DualBoundsPathWarp.prototype, "upper", {
        get: function () {
            return this._upper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DualBoundsPathWarp.prototype, "lower", {
        get: function () {
            return this._lower;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DualBoundsPathWarp.prototype, "source", {
        get: function () {
            return this._source.clone();
        },
        set: function (value) {
            this._source = value;
            this.updateWarped();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DualBoundsPathWarp.prototype, "customStyle", {
        get: function () {
            return this._customStyle;
        },
        set: function (value) {
            this._customStyle = value;
            this._warped.style = value;
            if (value.backgroundColor) {
                this._outline.fillColor = value.backgroundColor;
                this._outline.opacity = 1;
            }
            else {
                this._outline.fillColor = "white";
                this._outline.opacity = 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    DualBoundsPathWarp.prototype.updateWarped = function () {
        console.warn("warp");
        var orthOrigin = this._source.bounds.topLeft;
        var orthWidth = this._source.bounds.width;
        var orthHeight = this._source.bounds.height;
        var projection = PaperHelpers.dualBoundsPathProjection(this._upper, this._lower);
        var transform = new PathTransform(function (point) {
            if (!point) {
                return point;
            }
            var relative = point.subtract(orthOrigin);
            var unit = new paper.Point(relative.x / orthWidth, relative.y / orthHeight);
            var projected = projection(unit);
            return projected;
        });
        var newPaths = this._source.children
            .map(function (item) {
            var path = item;
            var xPoints = PaperHelpers.tracePathAsPoints(path, DualBoundsPathWarp.POINTS_PER_PATH)
                .map(function (p) { return transform.transformPoint(p); });
            var xPath = new paper.Path({
                segments: xPoints,
                closed: true,
                clockwise: path.clockwise
            });
            //xPath.simplify();
            return xPath;
        });
        this._warped.removeChildren();
        this._warped.addChildren(newPaths);
    };
    DualBoundsPathWarp.prototype.updateOutlineShape = function () {
        var lower = new paper.Path(this._lower.segments);
        lower.reverse();
        this._outline.segments = this._upper.segments.concat(lower.segments);
        lower.remove();
    };
    DualBoundsPathWarp.POINTS_PER_PATH = 200;
    return DualBoundsPathWarp;
}(paper.Group));
var PathHandle = (function (_super) {
    __extends(PathHandle, _super);
    function PathHandle(attach) {
        var _this = this;
        _super.call(this);
        this._curveSplit = new ObservableEvent();
        var position;
        var path;
        if (attach instanceof paper.Segment) {
            this._segment = attach;
            position = this._segment.point;
            path = this._segment.path;
        }
        else if (attach instanceof paper.Curve) {
            this._curve = attach;
            position = this._curve.getPointAt(this._curve.length * 0.5);
            path = this._curve.path;
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
        PaperHelpers.addSmartDrag(this);
        this.on(PaperHelpers.EventType.smartDragStart, function (ev) {
            if (_this._curve) {
                // split the curve, pupate to segment handle
                //this._unSub();
                _this._segment = new paper.Segment(_this.position);
                var curveIdx = _this._curve.index;
                _this._curve.path.insert(curveIdx + 1, _this._segment);
                _this._curve = null;
                _this.styleAsSegment();
                _this.curveSplit.notify(curveIdx);
            }
        });
        this.on(PaperHelpers.EventType.smartDragMove, function (ev) {
            if (_this._segment) {
                _this._segment.point = _this.position;
                if (_this._smoothed) {
                    _this._segment.smooth();
                }
            }
        });
        this.on(PaperHelpers.EventType.clickWithoutDrag, function (ev) {
            if (_this._segment) {
                _this.smoothed = !_this.smoothed;
            }
        });
        this._unSub = path.observe(function (flags) {
            if (flags & PaperNotify.ChangeFlag.GEOMETRY) {
                if (_this._segment) {
                    _this.center = _this._segment.point;
                }
                else if (_this._curve) {
                    _this.center = _this._curve.getPointAt(_this._curve.length * 0.5);
                }
            }
        });
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
    PathHandle.MARKER_RADIUS = 8;
    PathHandle.DRAG_THRESHOLD = 3;
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
var StretchPath = (function (_super) {
    __extends(StretchPath, _super);
    function StretchPath(segments, style) {
        var _this = this;
        _super.call(this, segments);
        this._handles = [];
        if (style) {
            this.style = style;
        }
        else {
            this.strokeColor = "lightgray";
            this.strokeWidth = 6;
        }
        for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
            var s = _a[_i];
            this.addSegmentHandle(s);
        }
        for (var _b = 0, _c = this.curves; _b < _c.length; _b++) {
            var c = _c[_b];
            this.addCurveHandle(c);
        }
        this.observe(function (flags) {
            if (flags & PaperNotify.ChangeFlag.ATTRIBUTE) {
                if (_this._handles[0].visible != _this.visible)
                    for (var _i = 0, _a = _this._handles; _i < _a.length; _i++) {
                        var h_1 = _a[_i];
                        h_1.visible = _this.visible;
                    }
            }
        });
    }
    StretchPath.prototype.addSegmentHandle = function (segment) {
        var handle = new PathHandle(segment);
        handle.visible = this.visible;
        this._handles.push(handle);
        this.addChild(handle);
    };
    StretchPath.prototype.addCurveHandle = function (curve) {
        var _this = this;
        var handle = new PathHandle(curve);
        handle.visible = this.visible;
        handle.curveSplit.subscribeOne(function (curveIdx) {
            _this.addCurveHandle(_this.curves[curveIdx]);
            _this.addCurveHandle(_this.curves[curveIdx + 1]);
        });
        this._handles.push(handle);
        this.addChild(handle);
    };
    return StretchPath;
}(paper.Path));
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
var TextWarp = (function (_super) {
    __extends(TextWarp, _super);
    function TextWarp(font, text, bounds, fontSize, style) {
        if (!fontSize) {
            fontSize = TextWarp.DEFAULT_FONT_SIZE;
        }
        var pathData = TextWarp.getPathData(font, text, fontSize);
        var path = new paper.CompoundPath(pathData);
        _super.call(this, path, bounds, style);
        this._font = font;
        this._text = text;
    }
    Object.defineProperty(TextWarp.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
            this.updateTextPath();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextWarp.prototype, "fontSize", {
        get: function () {
            return this._fontSize;
        },
        set: function (value) {
            if (!value) {
                return;
            }
            this._fontSize = value;
            this.updateTextPath();
        },
        enumerable: true,
        configurable: true
    });
    TextWarp.prototype.updateTextPath = function () {
        var pathData = TextWarp.getPathData(this._font, this._text, this._fontSize);
        this.source = new paper.CompoundPath(pathData);
    };
    TextWarp.getPathData = function (font, text, fontSize) {
        var openTypePath = font.getPath(text, 0, 0, Number(fontSize) || TextWarp.DEFAULT_FONT_SIZE);
        return openTypePath.toPathData();
    };
    TextWarp.DEFAULT_FONT_SIZE = 64;
    return TextWarp;
}(DualBoundsPathWarp));
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
        view.zoom = Math.min(view.viewSize.height / rect.height, view.viewSize.width / rect.width);
    };
    return ViewZoom;
}());
var Workspace = (function (_super) {
    __extends(Workspace, _super);
    function Workspace(size) {
        _super.call(this);
        this.defaultBackgroundColor = '#fdfdfd';
        var sheet = paper.Shape.Rectangle(new paper.Point(0, 0), size);
        sheet.style.shadowColor = 'gray';
        sheet.style.shadowBlur = 3;
        sheet.style.shadowOffset = new paper.Point(5, 5);
        this.sheet = sheet;
        this.addChild(sheet);
        this.sheet.fillColor = this.defaultBackgroundColor;
        PaperHelpers.addSmartDrag(this);
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
    var store = new Store(channels);
    var sketchEditor = new SketchEditor(document.getElementById('designer'), channels);
    var selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), channels);
    var designerController = new DesignerController(channels);
    var appController = new AppController(channels, store, sketchEditor, selectedItemEditor, designerController);
}
bootstrap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9fX2ZyYW1ld29yay9Gb250TG9hZGVyLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL0hlbHBlcnMudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL2V2ZW50cy50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJIZWxwZXJzLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL3BhcGVyL1BhcGVyTm90aWZ5LnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL3BhcGVyL3BhcGVyLWV4dC50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay9wb3N0YWwvVG9waWMudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvcG9zdGFsL3Bvc3RhbC1vYnNlcnZlLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL3Zkb20vQ29tcG9uZW50LnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL3Zkb20vUmVhY3RpdmVEb20udHMiLCIuLi9zcmMvX2NvbW1vbi9BcHBDb250cm9sbGVyLnRzIiwiLi4vc3JjL19jb21tb24vQ2hhbm5lbHMudHMiLCIuLi9zcmMvX2NvbW1vbi9TdG9yZS50cyIsIi4uL3NyYy9fY29tbW9uL2NvbnN0YW50cy50cyIsIi4uL3NyYy9fY29tbW9uL21vZGVscy50cyIsIi4uL3NyYy9kZXNpZ25lci9Db2xvclBpY2tlci50cyIsIi4uL3NyYy9kZXNpZ25lci9EZXNpZ25lckNvbnRyb2xsZXIudHMiLCIuLi9zcmMvZGVzaWduZXIvU2VsZWN0ZWRJdGVtRWRpdG9yLnRzIiwiLi4vc3JjL2Rlc2lnbmVyL1NrZXRjaEVkaXRvci50cyIsIi4uL3NyYy9kZXNpZ25lci9UZXh0QmxvY2tFZGl0b3IudHMiLCIuLi9zcmMvZGVzaWduZXIvV29ya3NwYWNlQ29udHJvbGxlci50cyIsIi4uL3NyYy9tYXRoL1BlcnNwZWN0aXZlVHJhbnNmb3JtLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9EdWFsQm91bmRzUGF0aFdhcnAudHMiLCIuLi9zcmMvd29ya3NwYWNlL1BhdGhIYW5kbGUudHMiLCIuLi9zcmMvd29ya3NwYWNlL1BhdGhTZWN0aW9uLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9QYXRoVHJhbnNmb3JtLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9TdHJldGNoUGF0aC50cyIsIi4uL3NyYy93b3Jrc3BhY2UvVGV4dFJ1bGVyLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9UZXh0V2FycC50cyIsIi4uL3NyYy93b3Jrc3BhY2UvVmlld1pvb20udHMiLCIuLi9zcmMvd29ya3NwYWNlL1dvcmtzcGFjZS50cyIsIi4uL3NyYy93b3Jrc3BhY2UvaW50ZXJmYWNlcy50cyIsIi4uL3NyYy96X2FwcC9ib290c3RyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQTtJQUlJLG9CQUFZLE9BQWUsRUFBRSxRQUF1QztRQUNoRSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFTLEdBQUcsRUFBRSxJQUFJO1lBQ3JDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDWCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztvQkFDckIsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzlCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsaUJBQUM7QUFBRCxDQUFDLEFBaEJELElBZ0JDO0FDaEJELGdCQUFtQixPQUFlLEVBQUUsTUFBd0I7SUFDeEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxH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QyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDbEUsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0UsQ0FBQztRQUVELElBQUksQ0FB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QUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNyRixJQUFNLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0RyxJQUFNLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFNUQsSUFBTSxhQUFhLEdBQUcsSUFBSSxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUssRUFDbkQsWUFBWSxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFFOUQsQ0FBQztBQUVELFNBQVMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmNsYXNzIEZvbnRMb2FkZXIge1xyXG5cclxuICAgIGlzTG9hZGVkOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnRVcmw6IHN0cmluZywgb25Mb2FkZWQ6IChmb250OiBvcGVudHlwZS5Gb250KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgb3BlbnR5cGUubG9hZChmb250VXJsLCBmdW5jdGlvbihlcnIsIGZvbnQpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9uTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgb25Mb2FkZWQuY2FsbCh0aGlzLCBmb250KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiXHJcbmZ1bmN0aW9uIGxvZ3RhcDxUPihtZXNzYWdlOiBzdHJpbmcsIHN0cmVhbTogUnguT2JzZXJ2YWJsZTxUPik6IFJ4Lk9ic2VydmFibGU8VD57XHJcbiAgICByZXR1cm4gc3RyZWFtLnRhcCh0ID0+IGNvbnNvbGUubG9nKG1lc3NhZ2UsIHQpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbmV3aWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAobmV3IERhdGUoKS5nZXRUaW1lKCkrTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMzYpO1xyXG59XHJcbiIsIlxyXG5uYW1lc3BhY2UgVHlwZWRDaGFubmVsIHtcclxuXHJcbiAgICAvLyAtLS0gQ29yZSB0eXBlcyAtLS1cclxuXHJcbiAgICB0eXBlIFNlcmlhbGl6YWJsZSA9IE9iamVjdCB8IEFycmF5PGFueT4gfCBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuIHwgRGF0ZSB8IHZvaWQ7XHJcblxyXG4gICAgdHlwZSBWYWx1ZSA9IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBEYXRlO1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZTxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZSwgVENvbnRleHREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIGRhdGE/OiBURGF0YTtcclxuICAgICAgICByb290RGF0YT86IFRDb250ZXh0RGF0YTtcclxuICAgICAgICBtZXRhPzogT2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHR5cGUgSVN1YmplY3Q8VD4gPSBSeC5PYnNlcnZlcjxUPiAmIFJ4Lk9ic2VydmFibGU8VD47XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIENoYW5uZWxUb3BpYzxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZSwgVENvbnRleHREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIGNoYW5uZWw6IElTdWJqZWN0PE1lc3NhZ2U8VERhdGEsIFRDb250ZXh0RGF0YT4+O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihjaGFubmVsOiBJU3ViamVjdDxNZXNzYWdlPFREYXRhLCBUQ29udGV4dERhdGE+PiwgdHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWJzY3JpYmUob2JzZXJ2ZXI6IChtZXNzYWdlOiBNZXNzYWdlPFREYXRhLCBUQ29udGV4dERhdGE+KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgpLnN1YnNjcmliZShvYnNlcnZlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXNwYXRjaChkYXRhPzogVERhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsLm9uTmV4dCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBfLmNsb25lKGRhdGEpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGlzcGF0Y2hDb250ZXh0KGNvbnRleHQ6IFRDb250ZXh0RGF0YSwgZGF0YT86IFREYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbC5vbk5leHQoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICAgICAgICAgICAgcm9vdERhdGE6IGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBfLmNsb25lKGRhdGEpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JzZXJ2ZSgpOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGEsIFRDb250ZXh0RGF0YT4+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5maWx0ZXIobSA9PiBtLnR5cGUgPT09IHRoaXMudHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDaGFubmVsPFRDb250ZXh0RGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4ge1xyXG4gICAgICAgIHR5cGU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIHN1YmplY3Q6IElTdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlLCBUQ29udGV4dERhdGE+PjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3ViamVjdD86IElTdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlLCBUQ29udGV4dERhdGE+PiwgdHlwZT86IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnN1YmplY3QgPSBzdWJqZWN0IHx8IG5ldyBSeC5TdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlLCBUQ29udGV4dERhdGE+PigpO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3Vic2NyaWJlKG9uTmV4dD86ICh2YWx1ZTogTWVzc2FnZTxTZXJpYWxpemFibGUsIFRDb250ZXh0RGF0YT4pID0+IHZvaWQpOiBSeC5JRGlzcG9zYWJsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3Quc3Vic2NyaWJlKG9uTmV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b3BpYzxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4odHlwZTogc3RyaW5nKSA6IENoYW5uZWxUb3BpYzxURGF0YSwgVENvbnRleHREYXRhPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ2hhbm5lbFRvcGljPFREYXRhLCBUQ29udGV4dERhdGE+KHRoaXMuc3ViamVjdCBhcyBJU3ViamVjdDxNZXNzYWdlPFREYXRhLCBUQ29udGV4dERhdGE+PixcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA/IHRoaXMudHlwZSArICcuJyArIHR5cGUgOiB0eXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVyZ2VUeXBlZDxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4oLi4udG9waWNzOiBDaGFubmVsVG9waWM8VERhdGEsIFRDb250ZXh0RGF0YT5bXSkgXHJcbiAgICAgICAgICAgIDogUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhLCBUQ29udGV4dERhdGE+PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdG9waWNzLm1hcCh0ID0+IHQudHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuZmlsdGVyKG0gPT4gdHlwZXMuaW5kZXhPZihtLnR5cGUpID49IDAgKSBhcyBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGEsIFRDb250ZXh0RGF0YT4+O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBtZXJnZSguLi50b3BpY3M6IENoYW5uZWxUb3BpYzxTZXJpYWxpemFibGUsIFRDb250ZXh0RGF0YT5bXSkgXHJcbiAgICAgICAgICAgIDogUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFNlcmlhbGl6YWJsZSwgVENvbnRleHREYXRhPj4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRvcGljcy5tYXAodCA9PiB0LnR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmZpbHRlcihtID0+IHR5cGVzLmluZGV4T2YobS50eXBlKSA+PSAwICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJcclxuY2xhc3MgT2JzZXJ2YWJsZUV2ZW50PFQ+IHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfc3Vic2NyaWJlcnM6ICgoZXZlbnRBcmc6IFQpID0+IHZvaWQpW10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmb3Igbm90aWZpY2F0aW9uLiBSZXR1cm5zIHVuc3Vic2NyaWJlIGZ1bmN0aW9uLlxyXG4gICAgICovICAgIFxyXG4gICAgc3Vic2NyaWJlKGNhbGxiYWNrOiAoZXZlbnRBcmc6IFQpID0+IHZvaWQpOiAoKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoY2FsbGJhY2spIDwgMCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGNhbGxiYWNrLCAwKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGZvciBvbmUgbm90aWZpY2F0aW9uLlxyXG4gICAgICovXHJcbiAgICBzdWJzY3JpYmVPbmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCl7XHJcbiAgICAgICAgbGV0IHVuc3ViID0gdGhpcy5zdWJzY3JpYmUodCA9PiB7XHJcbiAgICAgICAgICAgIHVuc3ViKCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBub3RpZnkoZXZlbnRBcmc6IFQpe1xyXG4gICAgICAgIGZvcihsZXQgc3Vic2NyaWJlciBvZiB0aGlzLl9zdWJzY3JpYmVycyl7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY2FsbCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIHN1YnNjcmliZXJzLlxyXG4gICAgICovXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG59IiwiXHJcbm5hbWVzcGFjZSBCb290U2NyaXB0IHtcclxuXHJcbiAgICBpbnRlcmZhY2UgTWVudUl0ZW0ge1xyXG4gICAgICAgIGNvbnRlbnQ6IGFueSxcclxuICAgICAgICBhdHRycz86IE9iamVjdCxcclxuICAgICAgICBvbkNsaWNrPzogKCkgPT4gdm9pZFxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkcm9wZG93bihcclxuICAgICAgICBhcmdzOiB7XHJcbiAgICAgICAgICAgIGlkOiBzdHJpbmcsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IGFueSxcclxuICAgICAgICAgICAgaXRlbXM6IE1lbnVJdGVtW11cclxuICAgICAgICB9KTogVk5vZGUge1xyXG5cclxuICAgICAgICByZXR1cm4gaChcImRpdi5kcm9wZG93blwiLCBbXHJcbiAgICAgICAgICAgIGgoXCJidXR0b24uYnRuLmJ0bi1kZWZhdWx0LmRyb3Bkb3duLXRvZ2dsZVwiLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYXR0cnNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYXJncy5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLXRvZ2dsZVwiOiBcImRyb3Bkb3duXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzLmNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgaChcInNwYW4uY2FyZXRcIilcclxuICAgICAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICBoKFwidWwuZHJvcGRvd24tbWVudVwiLFxyXG4gICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICBhcmdzLml0ZW1zLm1hcChpdGVtID0+XHJcbiAgICAgICAgICAgICAgICAgICAgaChcImxpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IChldikgPT4gaXRlbS5vbkNsaWNrICYmIGl0ZW0ub25DbGljaygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoJ2EnLCB7fSwgW2l0ZW0uY29udGVudF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICBdKTtcclxuXHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbm5hbWVzcGFjZSBQYXBlckhlbHBlcnMge1xyXG5cclxuICAgIGV4cG9ydCBjb25zdCBpbXBvcnRPcGVuVHlwZVBhdGggPSBmdW5jdGlvbihvcGVuUGF0aDogb3BlbnR5cGUuUGF0aCk6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgob3BlblBhdGgudG9QYXRoRGF0YSgpKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBsZXQgc3ZnID0gb3BlblBhdGgudG9TVkcoNCk7XHJcbiAgICAgICAgLy8gcmV0dXJuIDxwYXBlci5QYXRoPnBhcGVyLnByb2plY3QuaW1wb3J0U1ZHKHN2Zyk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlUGF0aEl0ZW0gPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoSXRlbSwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuUGF0aEl0ZW0ge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VDb21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCB0cmFjZUNvbXBvdW5kUGF0aCA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICBpZiAoIXBhdGguY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcGF0aHMgPSBwYXRoLmNoaWxkcmVuLm1hcChwID0+XHJcbiAgICAgICAgICAgIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnAsIHBvaW50c1BlclBhdGgpKTtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aCh7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBwYXRocyxcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlUGF0aEFzUG9pbnRzID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5Qb2ludFtdIHtcclxuICAgICAgICBsZXQgcGF0aExlbmd0aCA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGxldCBvZmZzZXRJbmNyID0gcGF0aExlbmd0aCAvIG51bVBvaW50cztcclxuICAgICAgICBsZXQgcG9pbnRzID0gW107XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAoaSsrIDwgbnVtUG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IHBhdGguZ2V0UG9pbnRBdChNYXRoLm1pbihvZmZzZXQsIHBhdGhMZW5ndGgpKTtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gb2Zmc2V0SW5jcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwb2ludHM7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlUGF0aCA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGgsIG51bVBvaW50czogbnVtYmVyKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgbGV0IHBvaW50cyA9IFBhcGVySGVscGVycy50cmFjZVBhdGhBc1BvaW50cyhwYXRoLCBudW1Qb2ludHMpO1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgIHNlZ21lbnRzOiBwb2ludHMsXHJcbiAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBkdWFsQm91bmRzUGF0aFByb2plY3Rpb24gPSBmdW5jdGlvbih0b3BQYXRoOiBwYXBlci5DdXJ2ZWxpa2UsIGJvdHRvbVBhdGg6IHBhcGVyLkN1cnZlbGlrZSlcclxuICAgICAgICA6ICh1bml0UG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgY29uc3QgdG9wUGF0aExlbmd0aCA9IHRvcFBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGJvdHRvbVBhdGhMZW5ndGggPSBib3R0b21QYXRoLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24odW5pdFBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICAgICAgbGV0IHRvcFBvaW50ID0gdG9wUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogdG9wUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGxldCBib3R0b21Qb2ludCA9IGJvdHRvbVBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIGJvdHRvbVBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgICBpZiAodG9wUG9pbnQgPT0gbnVsbCB8fCBib3R0b21Qb2ludCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcImNvdWxkIG5vdCBnZXQgcHJvamVjdGVkIHBvaW50IGZvciB1bml0IHBvaW50IFwiICsgdW5pdFBvaW50LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRvcFBvaW50LmFkZChib3R0b21Qb2ludC5zdWJ0cmFjdCh0b3BQb2ludCkubXVsdGlwbHkodW5pdFBvaW50LnkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBtYXJrZXJHcm91cDogcGFwZXIuR3JvdXA7XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHJlc2V0TWFya2VycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChQYXBlckhlbHBlcnMubWFya2VyR3JvdXApIHtcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrZXJHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIG1hcmtlckdyb3VwLm9wYWNpdHkgPSAwLjI7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBtYXJrZXJMaW5lID0gZnVuY3Rpb24oYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50KTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgbGV0IGxpbmUgPSBwYXBlci5QYXRoLkxpbmUoYSwgYik7XHJcbiAgICAgICAgbGluZS5zdHJva2VDb2xvciA9ICdncmVlbic7XHJcbiAgICAgICAgLy9saW5lLmRhc2hBcnJheSA9IFs1LCA1XTtcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobGluZSk7XHJcbiAgICAgICAgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IG1hcmtlciA9IGZ1bmN0aW9uKHBvaW50OiBwYXBlci5Qb2ludCwgbGFiZWw6IHN0cmluZyk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIC8vbGV0IG1hcmtlciA9IHBhcGVyLlNoYXBlLkNpcmNsZShwb2ludCwgMTApO1xyXG4gICAgICAgIGxldCBtYXJrZXIgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KHBvaW50KTtcclxuICAgICAgICBtYXJrZXIuZm9udFNpemUgPSAzNjtcclxuICAgICAgICBtYXJrZXIuY29udGVudCA9IGxhYmVsO1xyXG4gICAgICAgIG1hcmtlci5zdHJva2VDb2xvciA9IFwicmVkXCI7XHJcbiAgICAgICAgbWFya2VyLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgIC8vUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLmFkZENoaWxkKG1hcmtlcik7XHJcbiAgICAgICAgcmV0dXJuIG1hcmtlcjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3Qgc2ltcGxpZnkgPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoSXRlbSwgdG9sZXJhbmNlPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5zaW1wbGlmeSg8cGFwZXIuUGF0aEl0ZW0+cCwgdG9sZXJhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICg8cGFwZXIuUGF0aD5wYXRoKS5zaW1wbGlmeSh0b2xlcmFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgc2VsZiBvciBuZWFyZXN0IGFuY2VzdG9yIHNhdGlzZnlpbmcgdGhlIHByZWRpY2F0ZS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGZpbmRTZWxmT3JBbmNlc3RvciA9IGZ1bmN0aW9uKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRBbmNlc3RvcihpdGVtLCBwcmVkaWNhdGUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBmaW5kQW5jZXN0b3IgPSBmdW5jdGlvbihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCFpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJpb3I6IHBhcGVyLkl0ZW07XHJcbiAgICAgICAgbGV0IGNoZWNraW5nID0gaXRlbS5wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKGNoZWNraW5nICYmIGNoZWNraW5nICE9PSBwcmlvcikge1xyXG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKGNoZWNraW5nKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNraW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByaW9yID0gY2hlY2tpbmc7XHJcbiAgICAgICAgICAgIGNoZWNraW5nID0gY2hlY2tpbmcucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgY29ybmVycyBvZiB0aGUgcmVjdCwgY2xvY2t3aXNlIHN0YXJ0aW5nIGZyb20gdG9wTGVmdFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgY29ybmVycyA9IGZ1bmN0aW9uKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSk6IHBhcGVyLlBvaW50W10ge1xyXG4gICAgICAgIHJldHVybiBbcmVjdC50b3BMZWZ0LCByZWN0LnRvcFJpZ2h0LCByZWN0LmJvdHRvbVJpZ2h0LCByZWN0LmJvdHRvbUxlZnRdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIHRoZSBtaWRwb2ludCBiZXR3ZWVuIHR3byBwb2ludHNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IG1pZHBvaW50ID0gZnVuY3Rpb24oYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGIuc3VidHJhY3QoYSkuZGl2aWRlKDIpLmFkZChhKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgY2xvbmVTZWdtZW50ID0gZnVuY3Rpb24oc2VnbWVudDogcGFwZXIuU2VnbWVudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuU2VnbWVudChzZWdtZW50LnBvaW50LCBzZWdtZW50LmhhbmRsZUluLCBzZWdtZW50LmhhbmRsZU91dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWtlIGFuIGl0ZW0gZHJhZ2dhYmxlLCBhZGRpbmcgcmVsYXRlZCBldmVudHMuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBhZGRTbWFydERyYWcgPSBmdW5jdGlvbihpdGVtOiBwYXBlci5JdGVtKSB7XHJcbiAgICAgICAgaXRlbS5pc1NtYXJ0RHJhZ2dhYmxlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaXRlbS5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmICghaXRlbS5pc1NtYXJ0RHJhZ2dpbmcpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uaXNTbWFydERyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZW1pdChFdmVudFR5cGUuc21hcnREcmFnU3RhcnQsIGV2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaXRlbS5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb24uYWRkKGV2LmRlbHRhKTtcclxuICAgICAgICAgICAgZXYuc3RvcCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaXRlbS5lbWl0KEV2ZW50VHlwZS5zbWFydERyYWdNb3ZlLCBldik7IFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZVVwLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmlzU21hcnREcmFnZ2luZykge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5pc1NtYXJ0RHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmKGl0ZW0uZW1pdChFdmVudFR5cGUuc21hcnREcmFnRW5kLCBldikpe1xyXG4gICAgICAgICAgICAgICAgICAgIGV2LnN0b3AoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmKGl0ZW0uZW1pdChFdmVudFR5cGUuY2xpY2tXaXRob3V0RHJhZywgZXYpKXtcclxuICAgICAgICAgICAgICAgICAgICBldi5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgRXZlbnRUeXBlID0ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERyYWcgYWN0aW9uIGhhcyBzdGFydGVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNtYXJ0RHJhZ1N0YXJ0OiBcInNtYXJ0RHJhZ1N0YXJ0XCIsXHJcbiAgICAgICAgXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZ2dlZCBpdGVtIGhhcyBtb3ZlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzbWFydERyYWdNb3ZlOiBcInNtYXJ0RHJhZ01vdmVcIixcclxuICAgICAgICBcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEcmFnIGFjdGlvbiBoYXMgZW5kZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc21hcnREcmFnRW5kOiBcInNtYXJ0RHJhZ0VuZFwiLFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBub3JtYWwgY2xpY2sgZXZlbnQgd2lsbCBmaXJlIGV2ZW4gYXQgdGhlIGVuZCBvZiBhIGRyYWcuXHJcbiAgICAgICAgICogVGhpcyBjbGljayBldmVudCBkb2VzIG5vdC4gXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY2xpY2tXaXRob3V0RHJhZzogXCJjbGlja1dpdGhvdXREcmFnXCJcclxuICAgIH1cclxufVxyXG5cclxuZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJdGVtIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEcmFnZ2luZyBiZWhhdmlvciBhZGRlZCBieSBQYXBlckhlbHBlcnM6IGlzIHRoZSBpdGVtIGJlaW5nIGRyYWdnZWQ/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNTbWFydERyYWdnaW5nOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEcmFnZ2luZyBiZWhhdmlvciBhZGRlZCBieSBQYXBlckhlbHBlcnM6IGlzIHRoZSBpdGVtIGRyYWdnYWJsZT9cclxuICAgICAgICAgKi9cclxuICAgICAgICBpc1NtYXJ0RHJhZ2dhYmxlOiBib29sZWFuO1xyXG4gICAgfVxyXG59IiwiXHJcbnR5cGUgSXRlbUNoYW5nZUhhbmRsZXIgPSAoZmxhZ3M6IFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcpID0+IHZvaWQ7XHJcbnR5cGUgQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgaW50ZXJmYWNlIEl0ZW0ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE9ic2VydmUgYWxsIGNoYW5nZXMgaW4gaXRlbS4gUmV0dXJucyB1bi1vYnNlcnZlIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9ic2VydmUoaGFuZGxlcjogSXRlbUNoYW5nZUhhbmRsZXIpOiBDYWxsYmFjaztcclxuICAgICAgICBcclxuICAgICAgICBfY2hhbmdlZChmbGFnczogUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZyk6IHZvaWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBQYXBlck5vdGlmeSB7XHJcblxyXG4gICAgZXhwb3J0IGVudW0gQ2hhbmdlRmxhZyB7XHJcbiAgICAgICAgLy8gQW55dGhpbmcgYWZmZWN0aW5nIHRoZSBhcHBlYXJhbmNlIG9mIGFuIGl0ZW0sIGluY2x1ZGluZyBHRU9NRVRSWSxcclxuICAgICAgICAvLyBTVFJPS0UsIFNUWUxFIGFuZCBBVFRSSUJVVEUgKGV4Y2VwdCBmb3IgdGhlIGludmlzaWJsZSBvbmVzOiBsb2NrZWQsIG5hbWUpXHJcbiAgICAgICAgQVBQRUFSQU5DRSA9IDB4MSxcclxuICAgICAgICAvLyBBIGNoYW5nZSBpbiB0aGUgaXRlbSdzIGNoaWxkcmVuXHJcbiAgICAgICAgQ0hJTERSRU4gPSAweDIsXHJcbiAgICAgICAgLy8gQSBjaGFuZ2Ugb2YgdGhlIGl0ZW0ncyBwbGFjZSBpbiB0aGUgc2NlbmUgZ3JhcGggKHJlbW92ZWQsIGluc2VydGVkLFxyXG4gICAgICAgIC8vIG1vdmVkKS5cclxuICAgICAgICBJTlNFUlRJT04gPSAweDQsXHJcbiAgICAgICAgLy8gSXRlbSBnZW9tZXRyeSAocGF0aCwgYm91bmRzKVxyXG4gICAgICAgIEdFT01FVFJZID0gMHg4LFxyXG4gICAgICAgIC8vIE9ubHkgc2VnbWVudChzKSBoYXZlIGNoYW5nZWQsIGFuZCBhZmZlY3RlZCBjdXJ2ZXMgaGF2ZSBhbHJlYWR5IGJlZW5cclxuICAgICAgICAvLyBub3RpZmllZC4gVGhpcyBpcyB0byBpbXBsZW1lbnQgYW4gb3B0aW1pemF0aW9uIGluIF9jaGFuZ2VkKCkgY2FsbHMuXHJcbiAgICAgICAgU0VHTUVOVFMgPSAweDEwLFxyXG4gICAgICAgIC8vIFN0cm9rZSBnZW9tZXRyeSAoZXhjbHVkaW5nIGNvbG9yKVxyXG4gICAgICAgIFNUUk9LRSA9IDB4MjAsXHJcbiAgICAgICAgLy8gRmlsbCBzdHlsZSBvciBzdHJva2UgY29sb3IgLyBkYXNoXHJcbiAgICAgICAgU1RZTEUgPSAweDQwLFxyXG4gICAgICAgIC8vIEl0ZW0gYXR0cmlidXRlczogdmlzaWJsZSwgYmxlbmRNb2RlLCBsb2NrZWQsIG5hbWUsIG9wYWNpdHksIGNsaXBNYXNrIC4uLlxyXG4gICAgICAgIEFUVFJJQlVURSA9IDB4ODAsXHJcbiAgICAgICAgLy8gVGV4dCBjb250ZW50XHJcbiAgICAgICAgQ09OVEVOVCA9IDB4MTAwLFxyXG4gICAgICAgIC8vIFJhc3RlciBwaXhlbHNcclxuICAgICAgICBQSVhFTFMgPSAweDIwMCxcclxuICAgICAgICAvLyBDbGlwcGluZyBpbiBvbmUgb2YgdGhlIGNoaWxkIGl0ZW1zXHJcbiAgICAgICAgQ0xJUFBJTkcgPSAweDQwMCxcclxuICAgICAgICAvLyBUaGUgdmlldyBoYXMgYmVlbiB0cmFuc2Zvcm1lZFxyXG4gICAgICAgIFZJRVcgPSAweDgwMFxyXG4gICAgfVxyXG5cclxuICAgIC8vIFNob3J0Y3V0cyB0byBvZnRlbiB1c2VkIENoYW5nZUZsYWcgdmFsdWVzIGluY2x1ZGluZyBBUFBFQVJBTkNFXHJcbiAgICBleHBvcnQgZW51bSBDaGFuZ2VzIHtcclxuICAgICAgICAvLyBDSElMRFJFTiBhbHNvIGNoYW5nZXMgR0VPTUVUUlksIHNpbmNlIHJlbW92aW5nIGNoaWxkcmVuIGZyb20gZ3JvdXBzXHJcbiAgICAgICAgLy8gY2hhbmdlcyBib3VuZHMuXHJcbiAgICAgICAgQ0hJTERSRU4gPSBDaGFuZ2VGbGFnLkNISUxEUkVOIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICAvLyBDaGFuZ2luZyB0aGUgaW5zZXJ0aW9uIGNhbiBjaGFuZ2UgdGhlIGFwcGVhcmFuY2UgdGhyb3VnaCBwYXJlbnQncyBtYXRyaXguXHJcbiAgICAgICAgSU5TRVJUSU9OID0gQ2hhbmdlRmxhZy5JTlNFUlRJT04gfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgR0VPTUVUUlkgPSBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNFR01FTlRTID0gQ2hhbmdlRmxhZy5TRUdNRU5UUyB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgU1RST0tFID0gQ2hhbmdlRmxhZy5TVFJPS0UgfCBDaGFuZ2VGbGFnLlNUWUxFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNUWUxFID0gQ2hhbmdlRmxhZy5TVFlMRSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBBVFRSSUJVVEUgPSBDaGFuZ2VGbGFnLkFUVFJJQlVURSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBDT05URU5UID0gQ2hhbmdlRmxhZy5DT05URU5UIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBQSVhFTFMgPSBDaGFuZ2VGbGFnLlBJWEVMUyB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBWSUVXID0gQ2hhbmdlRmxhZy5WSUVXIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFXHJcbiAgICB9O1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEluamVjdCBJdGVtLm9ic2VydmVcclxuICAgICAgICBjb25zdCBpdGVtUHJvdG8gPSA8YW55PnBhcGVyLkl0ZW0ucHJvdG90eXBlO1xyXG4gICAgICAgIGl0ZW1Qcm90by5vYnNlcnZlID0gZnVuY3Rpb24oaGFuZGxlcjogSXRlbUNoYW5nZUhhbmRsZXIpOiBDYWxsYmFjayB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fb2JzZXJ2ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vYnNlcnZlcnMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fb2JzZXJ2ZXJzLmluZGV4T2YoaGFuZGxlcikgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vYnNlcnZlcnMucHVzaChoYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fb2JzZXJ2ZXJzLmluZGV4T2YoaGFuZGxlciwgMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29ic2VydmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXcmFwIEl0ZW0ucmVtb3ZlXHJcbiAgICAgICAgY29uc3QgaXRlbVJlbW92ZSA9IGl0ZW1Qcm90by5yZW1vdmU7XHJcbiAgICAgICAgaXRlbVByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdGVtUmVtb3ZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIHRoaXMuX29ic2VydmVycyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXcmFwIFByb2plY3QuX2NoYW5nZWRcclxuICAgICAgICBjb25zdCBwcm9qZWN0UHJvdG8gPSA8YW55PnBhcGVyLlByb2plY3QucHJvdG90eXBlO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RDaGFuZ2VkID0gcHJvamVjdFByb3RvLl9jaGFuZ2VkO1xyXG4gICAgICAgIHByb2plY3RQcm90by5fY2hhbmdlZCA9IGZ1bmN0aW9uKGZsYWdzOiBDaGFuZ2VGbGFnLCBpdGVtOiBwYXBlci5JdGVtKSB7XHJcbiAgICAgICAgICAgIHByb2plY3RDaGFuZ2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJzID0gKDxhbnk+aXRlbSkuX29ic2VydmVycztcclxuICAgICAgICAgICAgICAgIGlmIChzdWJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcyBvZiBzdWJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuY2FsbChpdGVtLCBmbGFncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZShmbGFnczogQ2hhbmdlRmxhZykge1xyXG4gICAgICAgIGxldCBmbGFnTGlzdDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBfLmZvck93bihDaGFuZ2VGbGFnLCAodmFsdWUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB2YWx1ZSkgPT09IFwibnVtYmVyXCIgJiYgKHZhbHVlICYgZmxhZ3MpKSB7XHJcbiAgICAgICAgICAgICAgICBmbGFnTGlzdC5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmxhZ0xpc3Quam9pbignIHwgJyk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5QYXBlck5vdGlmeS5pbml0aWFsaXplKCk7XHJcbiIsIlxyXG5tb2R1bGUgcGFwZXIge1xyXG5cclxuICAgIGV4cG9ydCB2YXIgRXZlbnRUeXBlID0ge1xyXG4gICAgICAgIGZyYW1lOiBcImZyYW1lXCIsXHJcbiAgICAgICAgbW91c2VEb3duOiBcIm1vdXNlZG93blwiLFxyXG4gICAgICAgIG1vdXNlVXA6IFwibW91c2V1cFwiLFxyXG4gICAgICAgIG1vdXNlRHJhZzogXCJtb3VzZWRyYWdcIixcclxuICAgICAgICBjbGljazogXCJjbGlja1wiLFxyXG4gICAgICAgIGRvdWJsZUNsaWNrOiBcImRvdWJsZWNsaWNrXCIsXHJcbiAgICAgICAgbW91c2VNb3ZlOiBcIm1vdXNlbW92ZVwiLFxyXG4gICAgICAgIG1vdXNlRW50ZXI6IFwibW91c2VlbnRlclwiLFxyXG4gICAgICAgIG1vdXNlTGVhdmU6IFwibW91c2VsZWF2ZVwiXHJcbiAgICB9XHJcblxyXG59IiwiXHJcbi8vIGNsYXNzIE9sZFRvcGljPFQ+IHtcclxuXHJcbi8vICAgICBwcml2YXRlIF9jaGFubmVsOiBJQ2hhbm5lbERlZmluaXRpb248T2JqZWN0PjtcclxuLy8gICAgIHByaXZhdGUgX25hbWU6IHN0cmluZztcclxuXHJcbi8vICAgICBjb25zdHJ1Y3RvcihjaGFubmVsOiBJQ2hhbm5lbERlZmluaXRpb248T2JqZWN0PiwgdG9waWM6IHN0cmluZykge1xyXG4vLyAgICAgICAgIHRoaXMuX2NoYW5uZWwgPSBjaGFubmVsO1xyXG4vLyAgICAgICAgIHRoaXMuX25hbWUgPSB0b3BpYztcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiA8UnguT2JzZXJ2YWJsZTxUPj50aGlzLl9jaGFubmVsLm9ic2VydmUodGhpcy5fbmFtZSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHVibGlzaChkYXRhOiBUKSB7XHJcbi8vICAgICAgICAgdGhpcy5fY2hhbm5lbC5wdWJsaXNoKHRoaXMuX25hbWUsIGRhdGEpO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHN1YnNjcmliZShjYWxsYmFjazogSUNhbGxiYWNrPFQ+KTogSVN1YnNjcmlwdGlvbkRlZmluaXRpb248VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiB0aGlzLl9jaGFubmVsLnN1YnNjcmliZSh0aGlzLl9uYW1lLCBjYWxsYmFjayk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHJvdGVjdGVkIHN1YnRvcGljKG5hbWUpOiBDaGFubmVsVG9waWM8VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiBuZXcgQ2hhbm5lbFRvcGljPFQ+KHRoaXMuX2NoYW5uZWwsIHRoaXMuX25hbWUgKyAnLicgKyBuYW1lKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBwcm90ZWN0ZWQgc3VidG9waWNPZjxVIGV4dGVuZHMgVD4obmFtZSk6IENoYW5uZWxUb3BpYzxVPiB7XHJcbi8vICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VT4odGhpcy5fY2hhbm5lbCwgdGhpcy5fbmFtZSArICcuJyArIG5hbWUpO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcbiIsIlxyXG5pbnRlcmZhY2UgSVBvc3RhbCB7XHJcbiAgICBvYnNlcnZlOiAob3B0aW9uczogUG9zdGFsT2JzZXJ2ZU9wdGlvbnMpID0+IFJ4Lk9ic2VydmFibGU8YW55PjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFBvc3RhbE9ic2VydmVPcHRpb25zIHtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIHRvcGljOiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJQ2hhbm5lbERlZmluaXRpb248VD4ge1xyXG4gICAgb2JzZXJ2ZSh0b3BpYzogc3RyaW5nKTogUnguT2JzZXJ2YWJsZTxUPjtcclxufVxyXG5cclxucG9zdGFsLm9ic2VydmUgPSBmdW5jdGlvbihvcHRpb25zOiBQb3N0YWxPYnNlcnZlT3B0aW9ucykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGNoYW5uZWwgPSBvcHRpb25zLmNoYW5uZWw7XHJcbiAgICB2YXIgdG9waWMgPSBvcHRpb25zLnRvcGljO1xyXG5cclxuICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm4oXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkSGFuZGxlcihoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgICAgICBjaGFubmVsOiBjaGFubmVsLFxyXG4gICAgICAgICAgICAgICAgdG9waWM6IHRvcGljLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsSGFuZGxlcihfLCBzdWIpIHtcclxuICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufTtcclxuXHJcbi8vIGFkZCBvYnNlcnZlIHRvIENoYW5uZWxEZWZpbml0aW9uXHJcbig8YW55PnBvc3RhbCkuQ2hhbm5lbERlZmluaXRpb24ucHJvdG90eXBlLm9ic2VydmUgPSBmdW5jdGlvbih0b3BpYzogc3RyaW5nKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybihcclxuICAgICAgICBmdW5jdGlvbiBhZGRIYW5kbGVyKGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuYnVzLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgICAgICBjaGFubmVsOiBzZWxmLmNoYW5uZWwsXHJcbiAgICAgICAgICAgICAgICB0b3BpYzogdG9waWMsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogaCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiBkZWxIYW5kbGVyKF8sIHN1Yikge1xyXG4gICAgICAgICAgICBzdWIudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG59O1xyXG4iLCJcclxuYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50PFQ+IHtcclxuICAgIGFic3RyYWN0IHJlbmRlcihkYXRhOiBUKTogVk5vZGU7XHJcbn0iLCJcclxuaW50ZXJmYWNlIFJlYWN0aXZlRG9tQ29tcG9uZW50IHtcclxuICAgIGRvbSQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+O1xyXG59XHJcblxyXG5jbGFzcyBSZWFjdGl2ZURvbSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSByZWFjdGl2ZSBjb21wb25lbnQgd2l0aGluIGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlclN0cmVhbShcclxuICAgICAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPixcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50XHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBjb250YWluZXIuaWQ7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQ6IEhUTUxFbGVtZW50IHwgVk5vZGUgPSBjb250YWluZXI7XHJcbiAgICAgICAgY29uc3Qgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGRvbSQuc3Vic2NyaWJlKGRvbSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFkb20pIHJldHVybjtcclxuLy9jb25zb2xlLmxvZygncmVuZGVyaW5nIGRvbScsIGRvbSk7IC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gcmV0YWluIElEXHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGNoZWQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xyXG4gICAgICAgICAgICBpZihpZCAmJiAhcGF0Y2hlZC5lbG0uaWQpe1xyXG4gICAgICAgICAgICAgICAgcGF0Y2hlZC5lbG0uaWQgPSBpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoZWQ7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciBhIHJlYWN0aXZlIGNvbXBvbmVudCB3aXRoaW4gY29udGFpbmVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyQ29tcG9uZW50KFxyXG4gICAgICAgIGNvbXBvbmVudDogUmVhY3RpdmVEb21Db21wb25lbnQsXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudCB8IFZOb2RlXHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjb250YWluZXI7XHJcbiAgICAgICAgbGV0IHNpbmsgPSBuZXcgUnguU3ViamVjdDxWTm9kZT4oKTtcclxuICAgICAgICBjb21wb25lbnQuZG9tJC5zdWJzY3JpYmUoZG9tID0+IHtcclxuICAgICAgICAgICAgaWYoIWRvbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIHdpdGhpbiBjb250YWluZXIgd2hlbmV2ZXIgc291cmNlIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsaXZlUmVuZGVyPFQ+KFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZSxcclxuICAgICAgICBzb3VyY2U6IFJ4Lk9ic2VydmFibGU8VD4sXHJcbiAgICAgICAgcmVuZGVyOiAobmV4dDogVCkgPT4gVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gcmVuZGVyKGRhdGEpO1xyXG4gICAgICAgICAgICBpZighbm9kZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgbm9kZSk7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbn0iLCJcclxuY2xhc3MgQXBwQ29udHJvbGxlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgY2hhbm5lbHM6IENoYW5uZWxzLFxyXG4gICAgICAgIHN0b3JlOiBTdG9yZSxcclxuICAgICAgICBza2V0Y2hFZGl0b3I6IFNrZXRjaEVkaXRvcixcclxuICAgICAgICBzZWxlY3RlZEl0ZW1FZGl0b3I6IFNlbGVjdGVkSXRlbUVkaXRvcixcclxuICAgICAgICBkZXNpZ25lckNvbnRyb2xsZXI6IERlc2lnbmVyQ29udHJvbGxlcikge1xyXG5cclxuICAgICAgICBjb25zdCBhY3Rpb25zID0gY2hhbm5lbHMuYWN0aW9ucywgZXZlbnRzID0gY2hhbm5lbHMuZXZlbnRzO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcclxuICAgICAgICBldmVudHMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xyXG5cclxuICAgICAgICBldmVudHMuYXBwLmZvbnRzUmVhZHlDaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgaWYgKG0uZGF0YSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGV2ZW50cy5hcHAucmV0YWluZWRTdGF0ZUxvYWRBdHRlbXB0Q29tcGxldGUuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vIGF1dG9zYXZlIGRhdGEgbG9hZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLmNyZWF0ZS5kaXNwYXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5hZGQuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6IFwiRklERExFU1RJQ0tTXCIsIHRleHRDb2xvcjogXCJsaWdodGJsdWVcIiwgZm9udFNpemU6IDEyOCB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQXV0by1zYXZlIGluIG9uZSBsaW5lOiBnb3R0YSBsb3ZlIGl0LlxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5hcHAucmV0YWluZWRTdGF0ZUNoYW5nZWQub2JzZXJ2ZSgpLmRlYm91bmNlKDgwMCkuc3Vic2NyaWJlKHN0YXRlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy5hcHAuc2F2ZVJldGFpbmVkU3RhdGUuZGlzcGF0Y2goKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGFjdGlvbnMuYXBwLmxvYWRSZXRhaW5lZFN0YXRlLmRpc3BhdGNoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJcclxuY2xhc3MgQWN0aW9ucyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsPHZvaWQ+IHtcclxuICAgIFxyXG4gICAgYXBwID0ge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluc3RydWN0cyBTdG9yZSB0byBsb2FkIHJldGFpbmVkIHN0YXRlIGZyb20gbG9jYWwgc3RvcmFnZSwgaWYgaXQgZXhpc3RzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxvYWRSZXRhaW5lZFN0YXRlOiB0aGlzLnRvcGljPHZvaWQ+KFwiYXBwLmxvYWRSZXRhaW5lZFN0YXRlXCIpLFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluc3RydWN0cyBTdG9yZSB0byBzYXZlIHJldGFpbmVkIHN0YXRlIHRvIGxvY2FsIHN0b3JhZ2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2F2ZVJldGFpbmVkU3RhdGU6IHRoaXMudG9waWM8dm9pZD4oXCJhcHAuc2F2ZVJldGFpbmVkU3RhdGVcIiksXHJcbiAgICAgICAgXHJcbiAgICAgICAgc2V0Rm9udHNSZWFkeTogdGhpcy50b3BpYzxib29sZWFuPihcImFwcC5zZXRGb250c1JlYWR5XCIpXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBkZXNpZ25lciA9IHtcclxuICAgICAgICB6b29tVG9GaXQ6IHRoaXMudG9waWM8SXRlbVNlbGVjdGlvbj4oXCJkZXNpZ25lci56b29tVG9GaXRcIilcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2tldGNoID0ge1xyXG4gICAgICAgIGNyZWF0ZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5jcmVhdGVcIiksXHJcbiAgICAgICAgYXR0clVwZGF0ZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5hdHRydXBkYXRlXCIpLFxyXG4gICAgICAgIHNldEVkaXRpbmdJdGVtOiB0aGlzLnRvcGljPFBvc2l0aW9uZWRJdGVtPihcInNrZXRjaC5zZXRlZGl0aW5naXRlbVwiKSxcclxuICAgICAgICBzZXRTZWxlY3Rpb246IHRoaXMudG9waWM8SXRlbVNlbGVjdGlvbj4oXCJza2V0Y2guc2V0c2VsZWN0aW9uXCIpLFxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGV4dEJsb2NrID0ge1xyXG4gICAgICAgIGFkZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFkZFwiKSxcclxuICAgICAgICB1cGRhdGVBdHRyOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sudXBkYXRlQXR0clwiKSxcclxuICAgICAgICB1cGRhdGVBcnJhbmdlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sudXBkYXRlQXJyYW5nZVwiKSxcclxuICAgICAgICByZW1vdmU6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5yZW1vdmVcIilcclxuICAgIH07XHJcbiAgICBcclxufVxyXG5cclxuY2xhc3MgRXZlbnRzIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWw8QXBwU3RhdGU+IHtcclxuICAgIFxyXG4gICAgYXBwID0ge1xyXG4gICAgICAgIHJldGFpbmVkU3RhdGVMb2FkQXR0ZW1wdENvbXBsZXRlOiB0aGlzLnRvcGljPGJvb2xlYW4+KFwiYXBwLnJldGFpbmVkU3RhdGVMb2FkQXR0ZW1wdENvbXBsZXRlXCIpLFxyXG4gICAgICAgIHJldGFpbmVkU3RhdGVDaGFuZ2VkOiB0aGlzLnRvcGljPFJldGFpbmVkU3RhdGU+KFwiYXBwLnJldGFpbmVkU3RhdGVDaGFuZ2VkXCIpLFxyXG4gICAgICAgIGZvbnRzUmVhZHlDaGFuZ2VkOiB0aGlzLnRvcGljPGJvb2xlYW4+KFwiYXBwLmZvbnRzUmVhZHlDaGFuZ2VkXCIpXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGRlc2lnbmVyID0ge1xyXG4gICAgICAgIHpvb21Ub0ZpdFJlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZFwiKVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2tldGNoID0ge1xyXG4gICAgICAgIGxvYWRlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmxvYWRlZFwiKSxcclxuICAgICAgICBhdHRyQ2hhbmdlZDogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5hdHRyQ2hhbmdlZFwiKSxcclxuICAgICAgICBlZGl0aW5nSXRlbUNoYW5nZWQ6IHRoaXMudG9waWM8UG9zaXRpb25lZEl0ZW0+KFwic2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZFwiKSxcclxuICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkOiB0aGlzLnRvcGljPEl0ZW1TZWxlY3Rpb24+KFwic2tldGNoLnNlbGVjdGlvbkNoYW5nZWRcIiksXHJcbiAgICAgICAgc2F2ZUxvY2FsUmVxdWVzdGVkOiB0aGlzLnRvcGljPEl0ZW1TZWxlY3Rpb24+KFwic2tldGNoLnNhdmVsb2NhbC5zYXZlTG9jYWxSZXF1ZXN0ZWRcIilcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRleHRibG9jayA9IHtcclxuICAgICAgICBhZGRlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFkZGVkXCIpLFxyXG4gICAgICAgIGF0dHJDaGFuZ2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYXR0cmNoYW5nZWRcIiksXHJcbiAgICAgICAgYXJyYW5nZUNoYW5nZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hcnJhbmdlY2hhbmdlZFwiKSxcclxuICAgICAgICByZW1vdmVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sucmVtb3ZlZFwiKSxcclxuICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5sb2FkZWRcIiksXHJcbiAgICB9O1xyXG4gICAgXHJcbn1cclxuXHJcbmNsYXNzIENoYW5uZWxzIHtcclxuICAgIGFjdGlvbnM6IEFjdGlvbnMgPSBuZXcgQWN0aW9ucygpO1xyXG4gICAgZXZlbnRzOiBFdmVudHMgPSBuZXcgRXZlbnRzKCk7XHJcbn1cclxuIiwiXHJcbi8qKlxyXG4gKiBUaGUgc2luZ2xldG9uIFN0b3JlIGNvbnRyb2xzIGFsbCBhcHBsaWNhdGlvbiBzdGF0ZS5cclxuICogTm8gcGFydHMgb3V0c2lkZSBvZiB0aGUgU3RvcmUgbW9kaWZ5IGFwcGxpY2F0aW9uIHN0YXRlLlxyXG4gKiBDb21tdW5pY2F0aW9uIHdpdGggdGhlIFN0b3JlIGlzIGRvbmUgdGhyb3VnaCBtZXNzYWdlIENoYW5uZWxzOiBcclxuICogICAtIEFjdGlvbnMgY2hhbm5lbCB0byBzZW5kIGludG8gdGhlIFN0b3JlLFxyXG4gKiAgIC0gRXZlbnRzIGNoYW5uZWwgdG8gcmVjZWl2ZSBub3RpZmljYXRpb24gZnJvbSB0aGUgU3RvcmUuXHJcbiAqIE9ubHkgdGhlIFN0b3JlIGNhbiByZWNlaXZlIGFjdGlvbiBtZXNzYWdlcy5cclxuICogT25seSB0aGUgU3RvcmUgY2FuIHNlbmQgZXZlbnQgbWVzc2FnZXMuXHJcbiAqIFRoZSBTdG9yZSBjYW5ub3Qgc2VuZCBhY3Rpb25zIG9yIGxpc3RlbiB0byBldmVudHMgKHRvIGF2b2lkIGxvb3BzKS5cclxuICogTWVzc2FnZXMgYXJlIHRvIGJlIHRyZWF0ZWQgYXMgaW1tdXRhYmxlLlxyXG4gKiBBbGwgbWVudGlvbnMgb2YgdGhlIFN0b3JlIGNhbiBiZSBhc3N1bWVkIHRvIG1lYW4sIG9mIGNvdXJzZSxcclxuICogICBcIlRoZSBTdG9yZSBhbmQgaXRzIHN1Yi1jb21wb25lbnRzLlwiXHJcbiAqL1xyXG5jbGFzcyBTdG9yZSB7XHJcblxyXG4gICAgc3RhdGljIEFVVE9TQVZFX0tFWSA9IFwiRmlkZGxlc3RpY2tzLnJldGFpbmVkU3RhdGVcIjtcclxuXHJcbiAgICBzdGF0ZTogQXBwU3RhdGUgPSB7XHJcbiAgICAgICAgcmV0YWluZWQ6IHtcclxuICAgICAgICAgICAgc2tldGNoOiB0aGlzLmNyZWF0ZVNrZXRjaCgpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkaXNwb3NhYmxlOiB7fVxyXG4gICAgfVxyXG4gICAgY2hhbm5lbHM6IENoYW5uZWxzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNoYW5uZWxzOiBDaGFubmVscykge1xyXG5cclxuICAgICAgICB0aGlzLmNoYW5uZWxzID0gY2hhbm5lbHM7XHJcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IGNoYW5uZWxzLmFjdGlvbnMsIGV2ZW50cyA9IGNoYW5uZWxzLmV2ZW50cztcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gQXBwIC0tLS0tXHJcblxyXG4gICAgICAgIGFjdGlvbnMuYXBwLmxvYWRSZXRhaW5lZFN0YXRlLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgbGV0IHN1Y2Nlc3MgPSBmYWxzZTsgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZSB8fCAhbG9jYWxTdG9yYWdlLmdldEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBzdXBwb3J0ZWRcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2F2ZWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTdG9yZS5BVVRPU0FWRV9LRVkpO1xyXG4gICAgICAgICAgICBpZiAoc2F2ZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRlZCA9IDxSZXRhaW5lZFN0YXRlPkpTT04ucGFyc2Uoc2F2ZWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvYWRlZCAmJiBsb2FkZWQuc2tldGNoICYmIGxvYWRlZC5za2V0Y2gudGV4dEJsb2Nrcykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGRhdGEgc2VlbXMgbGVnaXRcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJldGFpbmVkID0gbG9hZGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5za2V0Y2gubG9hZGVkLmRpc3BhdGNoQ29udGV4dChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSwgdGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdGIgb2YgdGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gudGV4dEJsb2Nrcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmxvYWRlZC5kaXNwYXRjaENvbnRleHQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLCB0Yik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy5kZXNpZ25lci56b29tVG9GaXRSZXF1ZXN0ZWQuZGlzcGF0Y2goKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZXZlbnRzLmFwcC5yZXRhaW5lZFN0YXRlTG9hZEF0dGVtcHRDb21wbGV0ZS5kaXNwYXRjaChzdWNjZXNzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5hcHAuc2F2ZVJldGFpbmVkU3RhdGUuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZSB8fCAhbG9jYWxTdG9yYWdlLmdldEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBzdXBwb3J0ZWRcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU3RvcmUuQVVUT1NBVkVfS0VZLCBKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXRlLnJldGFpbmVkKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuYXBwLnNldEZvbnRzUmVhZHkuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBpZiAobS5kYXRhICE9PSB0aGlzLnN0YXRlLmRpc3Bvc2FibGUuZm9udHNSZWFkeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5kaXNwb3NhYmxlLmZvbnRzUmVhZHkgPSBtLmRhdGE7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuYXBwLmZvbnRzUmVhZHlDaGFuZ2VkLmRpc3BhdGNoQ29udGV4dCh0aGlzLnN0YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZGlzcG9zYWJsZS5mb250c1JlYWR5KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIC0tLS0tIERlc2lnbmVyIC0tLS0tXHJcbiAgICAgICAgXHJcbiAgICAgICAgYWN0aW9ucy5kZXNpZ25lci56b29tVG9GaXQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBldmVudHMuZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gLS0tLS0gU2tldGNoIC0tLS0tXHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLmNyZWF0ZVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaCA9IHRoaXMuY3JlYXRlU2tldGNoKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0gbS5kYXRhIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgYXR0ci5iYWNrZ3JvdW5kQ29sb3IgPSBhdHRyLmJhY2tncm91bmRDb2xvciB8fCAnI2Y2ZjNlYic7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5hdHRyID0gYXR0cjtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5za2V0Y2gubG9hZGVkLmRpc3BhdGNoQ29udGV4dCh0aGlzLnN0YXRlLCB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaCk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkLmRpc3BhdGNoQ29udGV4dCh0aGlzLnN0YXRlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFJldGFpbmVkU3RhdGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLmF0dHJVcGRhdGVcclxuICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbih0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5hdHRyLCBldi5kYXRhKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQuZGlzcGF0Y2hDb250ZXh0KHRoaXMuc3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2guYXR0cik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRSZXRhaW5lZFN0YXRlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnNrZXRjaC5zZXRFZGl0aW5nSXRlbS5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtLmRhdGEuaXRlbVR5cGUgIT09IFwiVGV4dEJsb2NrXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGBVbmhhbmRsZWQgdHlwZSAke20udHlwZX1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmdldEJsb2NrKG0uZGF0YS5pdGVtSWQpO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmRpc3Bvc2FibGUuZWRpdGluZ0l0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtSWQ6IG0uZGF0YS5pdGVtSWQsXHJcbiAgICAgICAgICAgICAgICBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIixcclxuICAgICAgICAgICAgICAgIGl0ZW06IGl0ZW0sXHJcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBtLmRhdGEuY2xpZW50WCxcclxuICAgICAgICAgICAgICAgIGNsaWVudFk6IG0uZGF0YS5jbGllbnRZXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGV2ZW50cy5za2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkLmRpc3BhdGNoQ29udGV4dChcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUsIHRoaXMuc3RhdGUuZGlzcG9zYWJsZS5lZGl0aW5nSXRlbSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtLmRhdGEuaXRlbVR5cGUgJiYgbS5kYXRhLml0ZW1UeXBlICE9PSBcIlRleHRCbG9ja1wiKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBgVW5oYW5kbGVkIHR5cGUgJHttLnR5cGV9YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKChtLmRhdGEgJiYgbS5kYXRhLml0ZW1JZClcclxuICAgICAgICAgICAgICAgID09PSAodGhpcy5zdGF0ZS5kaXNwb3NhYmxlLnNlbGVjdGlvbiAmJiB0aGlzLnN0YXRlLmRpc3Bvc2FibGUuc2VsZWN0aW9uLml0ZW1JZCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vdGhpbmcgdG8gZG9cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5kaXNwb3NhYmxlLnNlbGVjdGlvbiA9IDxJdGVtU2VsZWN0aW9uPntcclxuICAgICAgICAgICAgICAgIGl0ZW1JZDogbS5kYXRhLml0ZW1JZCxcclxuICAgICAgICAgICAgICAgIGl0ZW1UeXBlOiBtLmRhdGEuaXRlbVR5cGUsXHJcbiAgICAgICAgICAgICAgICBwcmlvclNlbGVjdGlvbkl0ZW1JZDogdGhpcy5zdGF0ZS5kaXNwb3NhYmxlLnNlbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5zdGF0ZS5kaXNwb3NhYmxlLnNlbGVjdGlvbi5pdGVtSWRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLmRpc3BhdGNoQ29udGV4dChcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUsIHRoaXMuc3RhdGUuZGlzcG9zYWJsZS5zZWxlY3Rpb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvLyAtLS0tLSBUZXh0QmxvY2sgLS0tLS1cclxuXHJcbiAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2suYWRkXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gZXYuZGF0YTtcclxuICAgICAgICAgICAgICAgIGlmICghcGF0Y2gudGV4dCB8fCAhcGF0Y2gudGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB7IF9pZDogbmV3aWQoKSB9IGFzIFRleHRCbG9jaztcclxuICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduKGJsb2NrLCBwYXRjaCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJsb2NrLmZvbnRTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZm9udFNpemUgPSAxMjg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJsb2NrLnRleHRDb2xvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnRleHRDb2xvciA9IFwiZ3JheVwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC50ZXh0QmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLnRleHRibG9jay5hZGRlZC5kaXNwYXRjaENvbnRleHQodGhpcy5zdGF0ZSwgYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkUmV0YWluZWRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXR0clxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuZ2V0QmxvY2soZXYuZGF0YS5faWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gPFRleHRCbG9jaz57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGV2LmRhdGEudGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBldi5kYXRhLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBldi5kYXRhLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogZXYuZGF0YS5mb250LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogZXYuZGF0YS5mb250U2l6ZVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hc3NpZ24oYmxvY2ssIHBhdGNoKTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmF0dHJDaGFuZ2VkLmRpc3BhdGNoQ29udGV4dCh0aGlzLnN0YXRlLCBibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkUmV0YWluZWRTdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2sucmVtb3ZlXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRpZERlbGV0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXy5yZW1vdmUodGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gudGV4dEJsb2NrcywgdGIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0Yi5faWQgPT09IGV2LmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZERlbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpZERlbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5kaXNwYXRjaENvbnRleHQodGhpcy5zdGF0ZSwgeyBfaWQ6IGV2LmRhdGEuX2lkIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmRpc3Bvc2FibGUuZWRpdGluZ0l0ZW0uaXRlbUlkID09IGV2LmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZGlzcG9zYWJsZS5lZGl0aW5nSXRlbSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLmRpc3Bvc2FibGUuZWRpdGluZ0l0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRSZXRhaW5lZFN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnRleHRCbG9jay51cGRhdGVBcnJhbmdlXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5nZXRCbG9jayhldi5kYXRhLl9pZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5wb3NpdGlvbiA9IGV2LmRhdGEucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sub3V0bGluZSA9IGV2LmRhdGEub3V0bGluZTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmFycmFuZ2VDaGFuZ2VkLmRpc3BhdGNoQ29udGV4dCh0aGlzLnN0YXRlLCBibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkUmV0YWluZWRTdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VkUmV0YWluZWRTdGF0ZSgpIHtcclxuICAgICAgICB0aGlzLmNoYW5uZWxzLmV2ZW50cy5hcHAucmV0YWluZWRTdGF0ZUNoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5yZXRhaW5lZCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXNzaWduPFQ+KGRlc3Q6IFQsIHNvdXJjZTogVCkge1xyXG4gICAgICAgIF8ubWVyZ2UoZGVzdCwgc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTa2V0Y2goKTogU2tldGNoIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhdHRyOiB7fSxcclxuICAgICAgICAgICAgdGV4dEJsb2NrczogPFRleHRCbG9ja1tdPltdXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEJsb2NrKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoLnRleHRCbG9ja3MsIHRiID0+IHRiLl9pZCA9PT0gaWQpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG50eXBlIEFjdGlvblR5cGVzID0gXHJcbiAgICBcInNrZXRjaC5jcmVhdGVcIlxyXG4gICAgfCBcInNrZXRjaC51cGRhdGVcIlxyXG4gICAgfCBcInRleHRibG9jay5hZGRcIlxyXG4gICAgfCBcInRleHRibG9jay51cGRhdGVcIjtcclxuXHJcbnR5cGUgRXZlbnRUeXBlcyA9XHJcbiAgICBcInNrZXRjaC5sb2FkZWRcIlxyXG4gICAgfCBcInNrZXRjaC5jaGFuZ2VkXCJcclxuICAgIHwgXCJ0ZXh0YmxvY2suYWRkZWRcIlxyXG4gICAgfCBcInRleHRibG9jay5jaGFuZ2VkXCI7XHJcbiIsIlxyXG5pbnRlcmZhY2UgQXBwU3RhdGUge1xyXG4gICAgcmV0YWluZWQ6IFJldGFpbmVkU3RhdGU7XHJcbiAgICBkaXNwb3NhYmxlOiBEaXNwb3NhYmxlU3RhdGU7XHJcbn1cclxuXHJcbmludGVyZmFjZSBSZXRhaW5lZFN0YXRlIHtcclxuICAgIHNrZXRjaDogU2tldGNoO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRGlzcG9zYWJsZVN0YXRlIHtcclxuICAgIGVkaXRpbmdJdGVtPzogUG9zaXRpb25lZEl0ZW07XHJcbiAgICBmb250c1JlYWR5PzogYm9vbGVhbjtcclxuICAgIHNlbGVjdGlvbj86IEl0ZW1TZWxlY3Rpb247XHJcbn1cclxuXHJcbmludGVyZmFjZSBTa2V0Y2gge1xyXG4gICAgYXR0cjogU2tldGNoQXR0cjtcclxuICAgIHRleHRCbG9ja3M6IFRleHRCbG9ja1tdO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgU2tldGNoQXR0ciB7XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBQb3NpdGlvbmVkSXRlbSB7XHJcbiAgICBpdGVtSWQ/OiBzdHJpbmc7XHJcbiAgICBpdGVtVHlwZT86IHN0cmluZztcclxuICAgIGl0ZW0/OiBPYmplY3Q7XHJcbiAgICBjbGllbnRYPzogbnVtYmVyO1xyXG4gICAgY2xpZW50WT86IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIEl0ZW1TZWxlY3Rpb24ge1xyXG4gICAgaXRlbUlkPzogc3RyaW5nO1xyXG4gICAgaXRlbVR5cGU/OiBzdHJpbmc7XHJcbiAgICBwcmlvclNlbGVjdGlvbkl0ZW1JZD86IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFRleHRCbG9jayBleHRlbmRzIEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgX2lkPzogc3RyaW5nO1xyXG4gICAgdGV4dD86IHN0cmluZztcclxuICAgIHRleHRDb2xvcj86IHN0cmluZztcclxuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIGZvbnQ/OiBzdHJpbmc7XHJcbiAgICBmb250U2l6ZT86IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgcG9zaXRpb24/OiBudW1iZXJbXSxcclxuICAgIG91dGxpbmU/OiB7XHJcbiAgICAgICAgdG9wOiBQYXRoUmVjb3JkLFxyXG4gICAgICAgIGJvdHRvbTogUGF0aFJlY29yZFxyXG4gICAgfSAgICBcclxufVxyXG5cclxuaW50ZXJmYWNlIEJhY2tncm91bmRBY3Rpb25TdGF0dXMge1xyXG4gICAgYWN0aW9uPzogT2JqZWN0O1xyXG4gICAgcmVqZWN0ZWQ/OiBib29sZWFuO1xyXG4gICAgZXJyb3I/OiBib29sZWFuXHJcbiAgICBtZXNzYWdlPzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUGF0aFJlY29yZCB7XHJcbiAgICBzZWdtZW50czogU2VnbWVudFJlY29yZFtdO1xyXG59XHJcblxyXG4vKipcclxuICogU2luZ2xlLXBvaW50IHNlZ21lbnRzIGFyZSBzdG9yZWQgYXMgbnVtYmVyWzJdXHJcbiAqL1xyXG50eXBlIFNlZ21lbnRSZWNvcmQgPSBBcnJheTxQb2ludFJlY29yZD4gfCBBcnJheTxudW1iZXI+O1xyXG5cclxudHlwZSBQb2ludFJlY29yZCA9IEFycmF5PG51bWJlcj47XHJcbiIsIlxyXG5jbGFzcyBDb2xvclBpY2tlciB7XHJcbiAgICBzdGF0aWMgc2V0dXAoZWxlbSwgb25DaGFuZ2UpIHtcclxuICAgICAgICBsZXQgc2VsID0gPGFueT4kKGVsZW0pO1xyXG4gICAgICAgICg8YW55PiQoZWxlbSkpLnNwZWN0cnVtKHtcclxuICAgICAgICAgICAgc2hvd0lucHV0OiB0cnVlLFxyXG4gICAgICAgICAgICBhbGxvd0VtcHR5OiB0cnVlLFxyXG4gICAgICAgICAgICBwcmVmZXJyZWRGb3JtYXQ6IFwiaGV4XCIsXHJcbiAgICAgICAgICAgIHNob3dCdXR0b25zOiBmYWxzZSxcclxuICAgICAgICAgICAgc2hvd0FscGhhOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93UGFsZXR0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd1NlbGVjdGlvblBhbGV0dGU6IHRydWUsXHJcbiAgICAgICAgICAgIHBhbGV0dGU6IFtcclxuICAgICAgICAgICAgICAgIFtcIiMwMDBcIiwgXCIjNDQ0XCIsIFwiIzY2NlwiLCBcIiM5OTlcIiwgXCIjY2NjXCIsIFwiI2VlZVwiLCBcIiNmM2YzZjNcIiwgXCIjZmZmXCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiI2YwMFwiLCBcIiNmOTBcIiwgXCIjZmYwXCIsIFwiIzBmMFwiLCBcIiMwZmZcIiwgXCIjMDBmXCIsIFwiIzkwZlwiLCBcIiNmMGZcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjZjRjY2NjXCIsIFwiI2ZjZTVjZFwiLCBcIiNmZmYyY2NcIiwgXCIjZDllYWQzXCIsIFwiI2QwZTBlM1wiLCBcIiNjZmUyZjNcIiwgXCIjZDlkMmU5XCIsIFwiI2VhZDFkY1wiXSxcclxuICAgICAgICAgICAgICAgIFtcIiNlYTk5OTlcIiwgXCIjZjljYjljXCIsIFwiI2ZmZTU5OVwiLCBcIiNiNmQ3YThcIiwgXCIjYTJjNGM5XCIsIFwiIzlmYzVlOFwiLCBcIiNiNGE3ZDZcIiwgXCIjZDVhNmJkXCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiI2UwNjY2NlwiLCBcIiNmNmIyNmJcIiwgXCIjZmZkOTY2XCIsIFwiIzkzYzQ3ZFwiLCBcIiM3NmE1YWZcIiwgXCIjNmZhOGRjXCIsIFwiIzhlN2NjM1wiLCBcIiNjMjdiYTBcIl0sXHJcbiAgICAgICAgICAgICAgICBbXCIjYzAwXCIsIFwiI2U2OTEzOFwiLCBcIiNmMWMyMzJcIiwgXCIjNmFhODRmXCIsIFwiIzQ1ODE4ZVwiLCBcIiMzZDg1YzZcIiwgXCIjNjc0ZWE3XCIsIFwiI2E2NGQ3OVwiXSxcclxuICAgICAgICAgICAgICAgIFtcIiM5MDBcIiwgXCIjYjQ1ZjA2XCIsIFwiI2JmOTAwMFwiLCBcIiMzODc2MWRcIiwgXCIjMTM0ZjVjXCIsIFwiIzBiNTM5NFwiLCBcIiMzNTFjNzVcIiwgXCIjNzQxYjQ3XCJdLFxyXG4gICAgICAgICAgICAgICAgW1wiIzYwMFwiLCBcIiM3ODNmMDRcIiwgXCIjN2Y2MDAwXCIsIFwiIzI3NGUxM1wiLCBcIiMwYzM0M2RcIiwgXCIjMDczNzYzXCIsIFwiIzIwMTI0ZFwiLCBcIiM0YzExMzBcIl1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlS2V5OiBcInNrZXRjaHRleHRcIixcclxuICAgICAgICAgICAgY2hhbmdlOiBvbkNoYW5nZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc3RhdGljIGRlc3Ryb3koZWxlbSl7XHJcbiAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bShcImRlc3Ryb3lcIik7XHJcbiAgICB9XHJcbn0iLCJcclxuY29uc3QgQW1hdGljVXJsID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL2FtYXRpY3NjL3Y4L0lEbmtSVFBHY3JTVm81MFV5WU5LN3kzVVNCblN2cGtvcFFhVVItMnI3aVUudHRmJztcclxuY29uc3QgUm9ib3RvMTAwID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL3JvYm90by92MTUvN015Z3FUZTJ6czlZa1AwYWRBOVFRUS50dGYnO1xyXG5jb25zdCBSb2JvdG81MDAgPSAnZm9udHMvUm9ib3RvLTUwMC50dGYnO1xyXG5jb25zdCBBcXVhZmluYVNjcmlwdCA9ICdmb250cy9BZ3VhZmluYVNjcmlwdC1SZWd1bGFyL0FndWFmaW5hU2NyaXB0LVJlZ3VsYXIudHRmJ1xyXG5cclxuY2xhc3MgRGVzaWduZXJDb250cm9sbGVyIHtcclxuXHJcbiAgICBmb250czogb3BlbnR5cGUuRm9udFtdID0gW107XHJcbiAgICB3b3Jrc3BhY2VDb250cm9sbGVyOiBXb3Jrc3BhY2VDb250cm9sbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNoYW5uZWxzOiBDaGFubmVscykge1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRGb250KFJvYm90bzUwMCwgZm9udCA9PiB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndvcmtzcGFjZUNvbnRyb2xsZXIgPSBuZXcgV29ya3NwYWNlQ29udHJvbGxlcihjaGFubmVscywgZm9udCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjaGFubmVscy5hY3Rpb25zLmFwcC5zZXRGb250c1JlYWR5LmRpc3BhdGNoKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGb250KHVybDogc3RyaW5nLCBvbkNvbXBsZXRlOiAoZjogb3BlbnR5cGUuRm9udCkgPT4gdm9pZCkge1xyXG4gICAgICAgIG5ldyBGb250TG9hZGVyKHVybCwgZm9udCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udHMucHVzaChmb250KTtcclxuICAgICAgICAgICAgb25Db21wbGV0ZShmb250KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBTZWxlY3RlZEl0ZW1FZGl0b3Ige1xyXG5cclxuICAgIGNoYW5uZWxzOiBDaGFubmVscztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBjaGFubmVsczogQ2hhbm5lbHMpIHtcclxuICAgICAgICB0aGlzLmNoYW5uZWxzID0gY2hhbm5lbHM7XHJcblxyXG4gICAgICAgIGNvbnN0IGRvbSQgPSBjaGFubmVscy5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5vYnNlcnZlKCkubWFwKGkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFpLmRhdGEgfHwgIWkuZGF0YS5pdGVtSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBoKCdkaXYjZWRpdG9yT3ZlcmxheScsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJub25lXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaS5kYXRhLml0ZW1UeXBlICE9PSAnVGV4dEJsb2NrJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYmxvY2sgPSBpLmRhdGEuaXRlbSBhcyBUZXh0QmxvY2s7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaCgnZGl2I2VkaXRvck92ZXJsYXknLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGkuZGF0YS5jbGllbnRYICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IGkuZGF0YS5jbGllbnRZICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IFRleHRCbG9ja0VkaXRvcihjaGFubmVscy5hY3Rpb25zKS5yZW5kZXIoYmxvY2spXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgU2tldGNoRWRpdG9yIGV4dGVuZHMgQ29tcG9uZW50PFNrZXRjaD4ge1xyXG4gICAgYWN0aW9uczogQWN0aW9ucztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBjaGFubmVsczogQ2hhbm5lbHMpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IGNoYW5uZWxzLmFjdGlvbnM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgc2tldGNoRG9tJCA9IGNoYW5uZWxzLmV2ZW50cy5tZXJnZShcclxuICAgICAgICAgICAgY2hhbm5lbHMuZXZlbnRzLnNrZXRjaC5sb2FkZWQsIFxyXG4gICAgICAgICAgICBjaGFubmVscy5ldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkKVxyXG4gICAgICAgICAgICAubWFwKG0gPT4gdGhpcy5yZW5kZXIobS5yb290RGF0YS5yZXRhaW5lZC5za2V0Y2gpKTtcclxuICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oc2tldGNoRG9tJCwgY29udGFpbmVyKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoc2tldGNoOiBTa2V0Y2gpIHtcclxuICAgICAgICByZXR1cm4gaChcImRpdlwiLCBbXHJcbiAgICAgICAgICAgIGgoXCJsYWJlbFwiLCBcIkFkZCB0ZXh0OiBcIiksXHJcbiAgICAgICAgICAgIGgoXCJpbnB1dC5hZGQtdGV4dFwiLCB7XHJcbiAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleXByZXNzOiAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2LndoaWNoID09PSAxMyB8fCBldi5rZXlDb2RlID09PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGV2LnRhcmdldCAmJiBldi50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbnMudGV4dEJsb2NrLmFkZC5kaXNwYXRjaCh7IHRleHQ6IHRleHQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYudGFyZ2V0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIlByZXNzIFtFbnRlcl0gdG8gYWRkXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgaChcImxhYmVsXCIsIFwiQmFja2dyb3VuZDogXCIpLFxyXG4gICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogc2tldGNoLmF0dHIuYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25zLnNrZXRjaC5hdHRyVXBkYXRlLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgIEJvb3RTY3JpcHQuZHJvcGRvd24oeyBcclxuICAgICAgICAgICAgICAgIGlkOiBcInNrZXRjaE1lbnVcIixcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRmlkZGxlXCIsXHJcbiAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiTmV3XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDcmVhdGUgbmV3IHNrZXRjaFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHRoaXMuYWN0aW9ucy5za2V0Y2guY3JlYXRlLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvbnRlbnQ6IFwiTG9hZCBmcm9tIGxvY2FsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aXRsZTogXCJMb2FkIGZyb20gbG9jYWwgYnJvd3NlciBzdG9yYWdlXCJcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgb25DbGljazogKCkgPT4gdGhpcy5hY3Rpb25zLmFwcC5sb2FkUmV0YWluZWRTdGF0ZS5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgICAgICB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlpvb20gdG8gZml0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJGaXQgc2tldGNoIGNvbnRlbnRzIGluIHZpZXdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB0aGlzLmFjdGlvbnMuZGVzaWduZXIuem9vbVRvRml0LmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIF1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIFRleHRCbG9ja0VkaXRvciBleHRlbmRzIENvbXBvbmVudDxUZXh0QmxvY2s+IHtcclxuICAgIGFjdGlvbnM6IEFjdGlvbnM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYWN0aW9uczogQWN0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zID0gYWN0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGV4dEJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XHJcbiAgICAgICAgbGV0IHVwZGF0ZSA9IHRiID0+IHtcclxuICAgICAgICAgICAgdGIuX2lkID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyLmRpc3BhdGNoKHRiKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBoKFwiZGl2LnRleHQtYmxvY2stZWRpdG9yXCIsXHJcbiAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICBoKFwidGV4dGFyZWFcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLnRleHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleXVwOiBlID0+IHVwZGF0ZSh7IHRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBlID0+IHVwZGF0ZSh7IHRleHQ6IGUudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5mb3JlXCIsIHt9LCBcIkFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC50ZXh0LWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlRleHQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0Q29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgdGV4dENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcImRpdi5mb250LWNvbG9yLWljb24uYmFja1wiLCB7fSwgXCJBXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCYWNrZ3JvdW5kIGNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHVwZGF0ZSh7IGJhY2tncm91bmRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgICAgIGgoXCJidXR0b24uZGVsZXRlLXRleHRibG9jay5idG4uYnRuLWRhbmdlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZSA9PiB0aGlzLmFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZS5kaXNwYXRjaCh0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcInNwYW4uZ2x5cGhpY29uLmdseXBoaWNvbi10cmFzaFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgXSk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmNsYXNzIFdvcmtzcGFjZUNvbnRyb2xsZXIge1xyXG5cclxuICAgIGRlZmF1bHRTaXplID0gbmV3IHBhcGVyLlNpemUoNTAwMDAsIDQwMDAwKTtcclxuICAgIGRlZmF1bHRTY2FsZSA9IDAuMDI7XHJcblxyXG4gICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHdvcmtzcGFjZTogV29ya3NwYWNlO1xyXG4gICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuICAgIGZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICB2aWV3Wm9vbTogVmlld1pvb207XHJcblxyXG4gICAgcHJpdmF0ZSBjaGFubmVsczogQ2hhbm5lbHM7XHJcbiAgICBwcml2YXRlIF9za2V0Y2g6IFNrZXRjaDtcclxuICAgIHByaXZhdGUgX3RleHRCbG9ja0l0ZW1zOiB7IFt0ZXh0QmxvY2tJZDogc3RyaW5nXTogVGV4dFdhcnAgfSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNoYW5uZWxzOiBDaGFubmVscywgZm9udDogb3BlbnR5cGUuRm9udCkge1xyXG4gICAgICAgIHRoaXMuY2hhbm5lbHMgPSBjaGFubmVscztcclxuICAgICAgICB0aGlzLmZvbnQgPSBmb250O1xyXG4gICAgICAgIHBhcGVyLnNldHRpbmdzLmhhbmRsZVNpemUgPSAxO1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkNhbnZhcycpO1xyXG4gICAgICAgIHBhcGVyLnNldHVwKHRoaXMuY2FudmFzKTtcclxuICAgICAgICB0aGlzLnByb2plY3QgPSBwYXBlci5wcm9qZWN0O1xyXG5cclxuICAgICAgICB0aGlzLnZpZXdab29tID0gbmV3IFZpZXdab29tKHRoaXMucHJvamVjdCk7XHJcblxyXG4gICAgICAgIGNoYW5uZWxzLmV2ZW50cy5za2V0Y2gubG9hZGVkLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2tldGNoID0gZXYuZGF0YTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtcyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNsZWFyU2VsZWN0aW9uID0gKGV2OiBwYXBlci5Ub29sRXZlbnQpID0+IFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKHt9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLndvcmtzcGFjZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2Uub2ZmKHBhcGVyLkV2ZW50VHlwZS5jbGljaywgY2xlYXJTZWxlY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ya3NwYWNlLm9mZihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLnNtYXJ0RHJhZ1N0YXJ0LCBjbGVhclNlbGVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSBuZXcgV29ya3NwYWNlKHRoaXMuZGVmYXVsdFNpemUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2UuYm91bmRzLmNlbnRlciA9IG5ldyBwYXBlci5Qb2ludCgwLCAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud29ya3NwYWNlLmJhY2tncm91bmRDb2xvciA9IGV2LmRhdGEuYXR0ci5iYWNrZ3JvdW5kQ29sb3I7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2Uub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBjbGVhclNlbGVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmtzcGFjZS5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLnNtYXJ0RHJhZ1N0YXJ0LCBjbGVhclNlbGVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCBzaGVldEJvdW5kcyA9IHRoaXMud29ya3NwYWNlLnNoZWV0LmJvdW5kcztcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld1pvb20uc2V0Wm9vbVJhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgIFtzaGVldEJvdW5kcy5zY2FsZSgwLjAwNSkuc2l6ZSwgc2hlZXRCb3VuZHMuc2NhbGUoMC4yNSkuc2l6ZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY2hhbm5lbHMuZXZlbnRzLnNrZXRjaC5hdHRyQ2hhbmdlZC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGV2ID0+IHRoaXMud29ya3NwYWNlLmJhY2tncm91bmRDb2xvciA9IGV2LmRhdGEuYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY2hhbm5lbHMuZXZlbnRzLm1lcmdlVHlwZWQoXHJcbiAgICAgICAgICAgIGNoYW5uZWxzLmV2ZW50cy50ZXh0YmxvY2suYWRkZWQsXHJcbiAgICAgICAgICAgIGNoYW5uZWxzLmV2ZW50cy50ZXh0YmxvY2subG9hZGVkXHJcbiAgICAgICAgKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGV2ID0+IHRoaXMuYWRkQmxvY2soZXYuZGF0YSkpO1xyXG5cclxuICAgICAgICBjaGFubmVscy5ldmVudHMudGV4dGJsb2NrLmF0dHJDaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRCbG9jayA9IG0uZGF0YTtcclxuICAgICAgICAgICAgICAgIGl0ZW0udGV4dCA9IHRleHRCbG9jay50ZXh0O1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jdXN0b21TdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGV4dEJsb2NrLmZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogdGV4dEJsb2NrLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjaGFubmVscy5ldmVudHMudGV4dGJsb2NrLnJlbW92ZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjaGFubmVscy5ldmVudHMuc2tldGNoLnNlbGVjdGlvbkNoYW5nZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoIW0uZGF0YSB8fCAhbS5kYXRhLml0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5uZWxzLmV2ZW50cy5za2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkLmRpc3BhdGNoKHt9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSBtLmRhdGEuaXRlbUlkICYmIHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5pdGVtSWRdO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSAmJiAhaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5uZWxzLmV2ZW50cy5za2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkLmRpc3BhdGNoKHt9KTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNoYW5uZWxzLmV2ZW50cy5kZXNpZ25lci56b29tVG9GaXRSZXF1ZXN0ZWQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tVG9GaXQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB6b29tVG9GaXQoKSB7XHJcbiAgICAgICAgbGV0IGJvdW5kczogcGFwZXIuUmVjdGFuZ2xlO1xyXG4gICAgICAgIF8uZm9yT3duKHRoaXMuX3RleHRCbG9ja0l0ZW1zLCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBib3VuZHMgPSBib3VuZHNcclxuICAgICAgICAgICAgICAgID8gYm91bmRzLnVuaXRlKGl0ZW0uYm91bmRzKVxyXG4gICAgICAgICAgICAgICAgOiBpdGVtLmJvdW5kcztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFib3VuZHMpIHtcclxuICAgICAgICAgICAgYm91bmRzID0gbmV3IHBhcGVyLlJlY3RhbmdsZShuZXcgcGFwZXIuUG9pbnQoMCwgMCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTaXplLm11bHRpcGx5KHRoaXMuZGVmYXVsdFNjYWxlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZpZXdab29tLnpvb21Ubyhib3VuZHMuc2NhbGUoMS4wNSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEJsb2NrKHRleHRCbG9jazogVGV4dEJsb2NrKSB7XHJcbiAgICAgICAgaWYgKCF0ZXh0QmxvY2spIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0ZXh0QmxvY2suX2lkKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3JlY2VpdmVkIGJsb2NrIHdpdGhvdXQgaWQnLCB0ZXh0QmxvY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1t0ZXh0QmxvY2suX2lkXTtcclxuICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUmVjZWl2ZWQgYWRkQmxvY2sgZm9yIGJsb2NrIHRoYXQgaXMgYWxyZWFkeSBsb2FkZWRcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBib3VuZHM6IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9O1xyXG5cclxuICAgICAgICBpZiAodGV4dEJsb2NrLm91dGxpbmUpIHtcclxuICAgICAgICAgICAgY29uc3QgbG9hZFNlZ21lbnQgPSAocmVjb3JkOiBTZWdtZW50UmVjb3JkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb2ludCA9IHJlY29yZFswXTtcclxuICAgICAgICAgICAgICAgIGlmIChwb2ludCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkWzFdICYmIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMV0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRbMl0gJiYgbmV3IHBhcGVyLlBvaW50KHJlY29yZFsyXSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gU2luZ2xlLXBvaW50IHNlZ21lbnRzIGFyZSBzdG9yZWQgYXMgbnVtYmVyWzJdXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlNlZ21lbnQobmV3IHBhcGVyLlBvaW50KHJlY29yZCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBib3VuZHMgPSB7XHJcbiAgICAgICAgICAgICAgICB1cHBlcjogdGV4dEJsb2NrLm91dGxpbmUudG9wLnNlZ21lbnRzLm1hcChsb2FkU2VnbWVudCksXHJcbiAgICAgICAgICAgICAgICBsb3dlcjogdGV4dEJsb2NrLm91dGxpbmUuYm90dG9tLnNlZ21lbnRzLm1hcChsb2FkU2VnbWVudClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW0gPSBuZXcgVGV4dFdhcnAoXHJcbiAgICAgICAgICAgIHRoaXMuZm9udCxcclxuICAgICAgICAgICAgdGV4dEJsb2NrLnRleHQsXHJcbiAgICAgICAgICAgIGJvdW5kcyxcclxuICAgICAgICAgICAgdGV4dEJsb2NrLmZvbnRTaXplLCB7XHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogdGV4dEJsb2NrLmZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yIHx8IFwicmVkXCIsICAgIC8vIHRleHRDb2xvciBzaG91bGQgaGF2ZSBiZWVuIHNldCBlbHNld2hlcmUgXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghdGV4dEJsb2NrLm91dGxpbmUgJiYgdGV4dEJsb2NrLnBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSBuZXcgcGFwZXIuUG9pbnQodGV4dEJsb2NrLnBvc2l0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW0ub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5jbGlja1dpdGhvdXREcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBlZGl0XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlZGl0b3JBdCA9IHRoaXMucHJvamVjdC52aWV3LnByb2plY3RUb1ZpZXcoXHJcbiAgICAgICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLm1pZHBvaW50KGl0ZW0uYm91bmRzLnRvcExlZnQsIGl0ZW0uYm91bmRzLmNlbnRlcikpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFubmVscy5hY3Rpb25zLnNrZXRjaC5zZXRFZGl0aW5nSXRlbS5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1JZDogdGV4dEJsb2NrLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudFg6IGVkaXRvckF0LngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudFk6IGVkaXRvckF0LnlcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFubmVscy5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IHRleHRCbG9jay5faWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ZW0ub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICBpZiAoIWl0ZW0uc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHsgaXRlbUlkOiB0ZXh0QmxvY2suX2lkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIiB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGl0ZW0ub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdFbmQsIGV2ID0+IHtcclxuICAgICAgICAgICAgbGV0IGJsb2NrID0gPFRleHRCbG9jaz50aGlzLmdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbSk7XHJcbiAgICAgICAgICAgIGJsb2NrLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ZW0ub2JzZXJ2ZShmbGFncyA9PiB7XHJcbiAgICAgICAgICAgIGlmIChmbGFncyAmIFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+dGhpcy5nZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgYmxvY2suX2lkID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXRlbS5kYXRhID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICB0aGlzLndvcmtzcGFjZS5hZGRDaGlsZChpdGVtKTtcclxuICAgICAgICBpZiAoIXRleHRCbG9jay5wb3NpdGlvbikge1xyXG4gICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLnBvaW50LmFkZChcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChpdGVtLmJvdW5kcy53aWR0aCAvIDIsIGl0ZW0uYm91bmRzLmhlaWdodCAvIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZCg1MCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtc1t0ZXh0QmxvY2suX2lkXSA9IGl0ZW07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW06IFRleHRXYXJwKTogQmxvY2tBcnJhbmdlbWVudCB7XHJcbiAgICAgICAgLy8gZXhwb3J0IHJldHVybnMgYW4gYXJyYXkgd2l0aCBpdGVtIHR5cGUgYW5kIHNlcmlhbGl6ZWQgb2JqZWN0OlxyXG4gICAgICAgIC8vICAgW1wiUGF0aFwiLCB7IHNlZ21lbnRzOltdW10gfV1cclxuICAgICAgICBjb25zdCB0b3AgPSA8UGF0aFJlY29yZD5pdGVtLnVwcGVyLmV4cG9ydEpTT04oeyBhc1N0cmluZzogZmFsc2UgfSlbMV07XHJcbiAgICAgICAgY29uc3QgYm90dG9tID0gPFBhdGhSZWNvcmQ+aXRlbS5sb3dlci5leHBvcnRKU09OKHsgYXNTdHJpbmc6IGZhbHNlIH0pWzFdO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogW2l0ZW0ucG9zaXRpb24ueCwgaXRlbS5wb3NpdGlvbi55XSxcclxuICAgICAgICAgICAgb3V0bGluZTogeyB0b3AsIGJvdHRvbSB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbmRlY2xhcmUgdmFyIHNvbHZlOiAoYTogYW55LCBiOiBhbnksIGZhc3Q6IGJvb2xlYW4pID0+IHZvaWQ7XHJcblxyXG5jbGFzcyBQZXJzcGVjdGl2ZVRyYW5zZm9ybSB7XHJcbiAgICBcclxuICAgIHNvdXJjZTogUXVhZDtcclxuICAgIGRlc3Q6IFF1YWQ7XHJcbiAgICBwZXJzcDogYW55O1xyXG4gICAgbWF0cml4OiBudW1iZXJbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc291cmNlOiBRdWFkLCBkZXN0OiBRdWFkKXtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLmRlc3QgPSBkZXN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0uY3JlYXRlTWF0cml4KHNvdXJjZSwgZGVzdCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEdpdmVuIGEgNHg0IHBlcnNwZWN0aXZlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCwgYW5kIGEgMkQgcG9pbnQgKGEgMngxIHZlY3RvciksXHJcbiAgICAvLyBhcHBsaWVzIHRoZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggYnkgY29udmVydGluZyB0aGUgcG9pbnQgdG8gaG9tb2dlbmVvdXNcclxuICAgIC8vIGNvb3JkaW5hdGVzIGF0IHo9MCwgcG9zdC1tdWx0aXBseWluZywgYW5kIHRoZW4gYXBwbHlpbmcgYSBwZXJzcGVjdGl2ZSBkaXZpZGUuXHJcbiAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgbGV0IHAzID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0ubXVsdGlwbHkodGhpcy5tYXRyaXgsIFtwb2ludC54LCBwb2ludC55LCAwLCAxXSk7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBwYXBlci5Qb2ludChwM1swXSAvIHAzWzNdLCBwM1sxXSAvIHAzWzNdKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgY3JlYXRlTWF0cml4KHNvdXJjZTogUXVhZCwgdGFyZ2V0OiBRdWFkKTogbnVtYmVyW10ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzb3VyY2VQb2ludHMgPSBbXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYS54LCBzb3VyY2UuYS55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYi54LCBzb3VyY2UuYi55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYy54LCBzb3VyY2UuYy55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuZC54LCBzb3VyY2UuZC55XV07XHJcbiAgICAgICAgbGV0IHRhcmdldFBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3RhcmdldC5hLngsIHRhcmdldC5hLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5iLngsIHRhcmdldC5iLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5jLngsIHRhcmdldC5jLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5kLngsIHRhcmdldC5kLnldXTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBhID0gW10sIGIgPSBbXSwgaSA9IDAsIG4gPSBzb3VyY2VQb2ludHMubGVuZ3RoOyBpIDwgbjsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBzID0gc291cmNlUG9pbnRzW2ldLCB0ID0gdGFyZ2V0UG9pbnRzW2ldO1xyXG4gICAgICAgICAgICBhLnB1c2goW3NbMF0sIHNbMV0sIDEsIDAsIDAsIDAsIC1zWzBdICogdFswXSwgLXNbMV0gKiB0WzBdXSksIGIucHVzaCh0WzBdKTtcclxuICAgICAgICAgICAgYS5wdXNoKFswLCAwLCAwLCBzWzBdLCBzWzFdLCAxLCAtc1swXSAqIHRbMV0sIC1zWzFdICogdFsxXV0pLCBiLnB1c2godFsxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgWCA9IHNvbHZlKGEsIGIsIHRydWUpOyBcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBYWzBdLCBYWzNdLCAwLCBYWzZdLFxyXG4gICAgICAgICAgICBYWzFdLCBYWzRdLCAwLCBYWzddLFxyXG4gICAgICAgICAgICAgICAwLCAgICAwLCAxLCAgICAwLFxyXG4gICAgICAgICAgICBYWzJdLCBYWzVdLCAwLCAgICAxXHJcbiAgICAgICAgXS5tYXAoZnVuY3Rpb24oeCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh4ICogMTAwMDAwKSAvIDEwMDAwMDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQb3N0LW11bHRpcGx5IGEgNHg0IG1hdHJpeCBpbiBjb2x1bW4tbWFqb3Igb3JkZXIgYnkgYSA0eDEgY29sdW1uIHZlY3RvcjpcclxuICAgIC8vIFsgbTAgbTQgbTggIG0xMiBdICAgWyB2MCBdICAgWyB4IF1cclxuICAgIC8vIFsgbTEgbTUgbTkgIG0xMyBdICogWyB2MSBdID0gWyB5IF1cclxuICAgIC8vIFsgbTIgbTYgbTEwIG0xNCBdICAgWyB2MiBdICAgWyB6IF1cclxuICAgIC8vIFsgbTMgbTcgbTExIG0xNSBdICAgWyB2MyBdICAgWyB3IF1cclxuICAgIHN0YXRpYyBtdWx0aXBseShtYXRyaXgsIHZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIG1hdHJpeFswXSAqIHZlY3RvclswXSArIG1hdHJpeFs0XSAqIHZlY3RvclsxXSArIG1hdHJpeFs4IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTJdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMV0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNV0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbOSBdICogdmVjdG9yWzJdICsgbWF0cml4WzEzXSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzJdICogdmVjdG9yWzBdICsgbWF0cml4WzZdICogdmVjdG9yWzFdICsgbWF0cml4WzEwXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNF0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFszXSAqIHZlY3RvclswXSArIG1hdHJpeFs3XSAqIHZlY3RvclsxXSArIG1hdHJpeFsxMV0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTVdICogdmVjdG9yWzNdXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUXVhZCB7XHJcbiAgICBhOiBwYXBlci5Qb2ludDtcclxuICAgIGI6IHBhcGVyLlBvaW50O1xyXG4gICAgYzogcGFwZXIuUG9pbnQ7XHJcbiAgICBkOiBwYXBlci5Qb2ludDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50LCBjOiBwYXBlci5Qb2ludCwgZDogcGFwZXIuUG9pbnQpe1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmMgPSBjO1xyXG4gICAgICAgIHRoaXMuZCA9IGQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tUmVjdGFuZ2xlKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICByZWN0LnRvcExlZnQsXHJcbiAgICAgICAgICAgIHJlY3QudG9wUmlnaHQsXHJcbiAgICAgICAgICAgIHJlY3QuYm90dG9tTGVmdCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21SaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tQ29vcmRzKGNvb3JkczogbnVtYmVyW10pIDogUXVhZCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzBdLCBjb29yZHNbMV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzJdLCBjb29yZHNbM10pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzRdLCBjb29yZHNbNV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzZdLCBjb29yZHNbN10pXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhc0Nvb3JkcygpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgdGhpcy5hLngsIHRoaXMuYS55LFxyXG4gICAgICAgICAgICB0aGlzLmIueCwgdGhpcy5iLnksXHJcbiAgICAgICAgICAgIHRoaXMuYy54LCB0aGlzLmMueSxcclxuICAgICAgICAgICAgdGhpcy5kLngsIHRoaXMuZC55XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBEdWFsQm91bmRzUGF0aFdhcnAgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgc3RhdGljIFBPSU5UU19QRVJfUEFUSCA9IDIwMDtcclxuXHJcbiAgICBwcml2YXRlIF9zb3VyY2U6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIHByaXZhdGUgX3VwcGVyOiBTdHJldGNoUGF0aDtcclxuICAgIHByaXZhdGUgX2xvd2VyOiBTdHJldGNoUGF0aDtcclxuICAgIHByaXZhdGUgX3dhcnBlZDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgcHJpdmF0ZSBfb3V0bGluZTogcGFwZXIuUGF0aDtcclxuICAgIHByaXZhdGUgX2N1c3RvbVN0eWxlOiBTa2V0Y2hJdGVtU3R5bGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc291cmNlOiBwYXBlci5Db21wb3VuZFBhdGgsXHJcbiAgICAgICAgYm91bmRzPzogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH0sXHJcbiAgICAgICAgY3VzdG9tU3R5bGU/OiBTa2V0Y2hJdGVtU3R5bGUpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy8gLS0gYnVpbGQgY2hpbGRyZW4gLS1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKGJvdW5kcykge1xyXG4gICAgICAgICAgICB0aGlzLl91cHBlciA9IG5ldyBTdHJldGNoUGF0aChib3VuZHMudXBwZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9sb3dlciA9IG5ldyBTdHJldGNoUGF0aChib3VuZHMubG93ZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwcGVyID0gbmV3IFN0cmV0Y2hQYXRoKFtcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMudG9wTGVmdCksXHJcbiAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLnRvcFJpZ2h0KVxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgdGhpcy5fbG93ZXIgPSBuZXcgU3RyZXRjaFBhdGgoW1xyXG4gICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy5ib3R0b21MZWZ0KSxcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMuYm90dG9tUmlnaHQpXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgdGhpcy5fbG93ZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcblxyXG4gICAgICAgIHRoaXMuX291dGxpbmUgPSBuZXcgcGFwZXIuUGF0aCh7Y2xvc2VkOiB0cnVlfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lU2hhcGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fd2FycGVkID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChzb3VyY2UucGF0aERhdGEpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlV2FycGVkKCk7XHJcblxyXG4gICAgICAgIC8vIC0tIGFkZCBjaGlsZHJlbiAtLVxyXG5cclxuICAgICAgICB0aGlzLmFkZENoaWxkcmVuKFt0aGlzLl9vdXRsaW5lLCB0aGlzLl93YXJwZWQsIHRoaXMuX3VwcGVyLCB0aGlzLl9sb3dlcl0pO1xyXG5cclxuICAgICAgICAvLyAtLSBhc3NpZ24gc3R5bGUgLS1cclxuXHJcbiAgICAgICAgdGhpcy5jdXN0b21TdHlsZSA9IGN1c3RvbVN0eWxlIHx8IHtcclxuICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwibGlnaHRncmF5XCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBQYXBlckhlbHBlcnMuYWRkU21hcnREcmFnKHRoaXMpO1xyXG5cclxuICAgICAgICAvLyAtLSBzZXQgdXAgb2JzZXJ2ZXJzIC0tXHJcblxyXG4gICAgICAgIGNvbnN0IGJvdW5kc1dhdGNoID0gKGZsYWdzOiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChmbGFncyAmIFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuU0VHTUVOVFMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT3V0bGluZVNoYXBlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZWQoUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5HRU9NRVRSWSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX3VwcGVyLm9ic2VydmUoYm91bmRzV2F0Y2gpO1xyXG4gICAgICAgIHRoaXMuX2xvd2VyLm9ic2VydmUoYm91bmRzV2F0Y2gpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZShmbGFncyA9PiB7XHJcbiAgICAgICAgICAgaWYoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkFUVFJJQlVURSl7XHJcbiAgICAgICAgICAgICAgIGlmKHRoaXMuX3VwcGVyLnZpc2libGUgIT09IHRoaXMuc2VsZWN0ZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLl9sb3dlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH0gXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHVwcGVyKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91cHBlcjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbG93ZXIoKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvd2VyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzb3VyY2UoKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICByZXR1cm4gPHBhcGVyLkNvbXBvdW5kUGF0aD50aGlzLl9zb3VyY2UuY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc291cmNlKHZhbHVlOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXN0b21TdHlsZSgpOiBTa2V0Y2hJdGVtU3R5bGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXN0b21TdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY3VzdG9tU3R5bGUodmFsdWU6IFNrZXRjaEl0ZW1TdHlsZSkge1xyXG4gICAgICAgIHRoaXMuX2N1c3RvbVN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fd2FycGVkLnN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IHZhbHVlLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVXYXJwZWQoKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKFwid2FycFwiKTtcclxuICAgICAgICBsZXQgb3J0aE9yaWdpbiA9IHRoaXMuX3NvdXJjZS5ib3VuZHMudG9wTGVmdDtcclxuICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5fc291cmNlLmJvdW5kcy53aWR0aDtcclxuICAgICAgICBsZXQgb3J0aEhlaWdodCA9IHRoaXMuX3NvdXJjZS5ib3VuZHMuaGVpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgcHJvamVjdGlvbiA9IFBhcGVySGVscGVycy5kdWFsQm91bmRzUGF0aFByb2plY3Rpb24oXHJcbiAgICAgICAgICAgIHRoaXMuX3VwcGVyLCB0aGlzLl9sb3dlcik7XHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgaWYgKCFwb2ludCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KG9ydGhPcmlnaW4pO1xyXG4gICAgICAgICAgICBsZXQgdW5pdCA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gb3J0aEhlaWdodCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0ZWQgPSBwcm9qZWN0aW9uKHVuaXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdQYXRocyA9IHRoaXMuX3NvdXJjZS5jaGlsZHJlblxyXG4gICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IDxwYXBlci5QYXRoPml0ZW07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4UG9pbnRzID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEFzUG9pbnRzKHBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgRHVhbEJvdW5kc1BhdGhXYXJwLlBPSU5UU19QRVJfUEFUSClcclxuICAgICAgICAgICAgICAgICAgICAubWFwKHAgPT4gdHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50KHApKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHhQYXRoID0gbmV3IHBhcGVyLlBhdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8veFBhdGguc2ltcGxpZnkoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4UGF0aDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB0aGlzLl93YXJwZWQucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgICAgICB0aGlzLl93YXJwZWQuYWRkQ2hpbGRyZW4obmV3UGF0aHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlT3V0bGluZVNoYXBlKCkge1xyXG4gICAgICAgIGNvbnN0IGxvd2VyID0gbmV3IHBhcGVyLlBhdGgodGhpcy5fbG93ZXIuc2VnbWVudHMpO1xyXG4gICAgICAgIGxvd2VyLnJldmVyc2UoKTtcclxuICAgICAgICB0aGlzLl9vdXRsaW5lLnNlZ21lbnRzID0gdGhpcy5fdXBwZXIuc2VnbWVudHMuY29uY2F0KGxvd2VyLnNlZ21lbnRzKTtcclxuICAgICAgICBsb3dlci5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbn0iLCJcclxuY2xhc3MgUGF0aEhhbmRsZSBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuXHJcbiAgICBzdGF0aWMgTUFSS0VSX1JBRElVUyA9IDg7XHJcbiAgICBzdGF0aWMgRFJBR19USFJFU0hPTEQgPSAzO1xyXG5cclxuICAgIHByaXZhdGUgX21hcmtlcjogcGFwZXIuU2hhcGU7XHJcbiAgICBwcml2YXRlIF9zZWdtZW50OiBwYXBlci5TZWdtZW50O1xyXG4gICAgcHJpdmF0ZSBfY3VydmU6IHBhcGVyLkN1cnZlO1xyXG4gICAgcHJpdmF0ZSBfc21vb3RoZWQ6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9jdXJ2ZVNwbGl0ID0gbmV3IE9ic2VydmFibGVFdmVudDxudW1iZXI+KCk7XHJcbiAgICBwcml2YXRlIF91blN1YjogKCkgPT4gdm9pZDtcclxuICAgIHByaXZhdGUgZHJhZ2dpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXR0YWNoOiBwYXBlci5TZWdtZW50IHwgcGFwZXIuQ3VydmUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBsZXQgcG9zaXRpb246IHBhcGVyLlBvaW50O1xyXG4gICAgICAgIGxldCBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgICAgIGlmIChhdHRhY2ggaW5zdGFuY2VvZiBwYXBlci5TZWdtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQgPSA8cGFwZXIuU2VnbWVudD5hdHRhY2g7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgcGF0aCA9IHRoaXMuX3NlZ21lbnQucGF0aDtcclxuICAgICAgICB9IGVsc2UgaWYgKGF0dGFjaCBpbnN0YW5jZW9mIHBhcGVyLkN1cnZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnZlID0gPHBhcGVyLkN1cnZlPmF0dGFjaDtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XHJcbiAgICAgICAgICAgIHBhdGggPSB0aGlzLl9jdXJ2ZS5wYXRoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwiYXR0YWNoIG11c3QgYmUgU2VnbWVudCBvciBDdXJ2ZVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvc2l0aW9uLCBQYXRoSGFuZGxlLk1BUktFUl9SQURJVVMpO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5zdHJva2VDb2xvciA9IFwiYmx1ZVwiO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5maWxsQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9tYXJrZXIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlQXNTZWdtZW50KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZUFzQ3VydmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFBhcGVySGVscGVycy5hZGRTbWFydERyYWcodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VydmUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBjdXJ2ZSwgcHVwYXRlIHRvIHNlZ21lbnQgaGFuZGxlXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvL3RoaXMuX3VuU3ViKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gbmV3IHBhcGVyLlNlZ21lbnQodGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJ2ZUlkeCA9IHRoaXMuX2N1cnZlLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VydmUucGF0aC5pbnNlcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmVJZHggKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlQXNTZWdtZW50KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnZlU3BsaXQubm90aWZ5KGN1cnZlSWR4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnTW92ZSwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5wb2ludCA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc21vb3RoZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5jbGlja1dpdGhvdXREcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZWdtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNtb290aGVkID0gIXRoaXMuc21vb3RoZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fdW5TdWIgPSBwYXRoLm9ic2VydmUoZmxhZ3MgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkdFT01FVFJZKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VudGVyID0gdGhpcy5fc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fY3VydmUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuX2N1cnZlLmdldFBvaW50QXQodGhpcy5fY3VydmUubGVuZ3RoICogMC41KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQgc21vb3RoZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Ntb290aGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzbW9vdGhlZCh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3Ntb290aGVkID0gdmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuaGFuZGxlSW4gPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWdtZW50LmhhbmRsZU91dCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJ2ZVNwbGl0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJ2ZVNwbGl0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjZW50ZXIoKTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjZW50ZXIocG9pbnQ6IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvaW50O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3R5bGVBc1NlZ21lbnQoKSB7XHJcbiAgICAgICAgdGhpcy5fbWFya2VyLm9wYWNpdHkgPSAwLjg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdHlsZUFzQ3VydmUoKSB7XHJcbiAgICAgICAgdGhpcy5fbWFya2VyLm9wYWNpdHkgPSAwLjM7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmNsYXNzIFBhdGhTZWN0aW9uIGltcGxlbWVudHMgcGFwZXIuQ3VydmVsaWtlIHtcclxuICAgIHBhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICBvZmZzZXQ6IG51bWJlcjtcclxuICAgIGxlbmd0aDogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBwYXBlci5QYXRoLCBvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFBvaW50QXQob2Zmc2V0OiBudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhdGguZ2V0UG9pbnRBdChvZmZzZXQgKyB0aGlzLm9mZnNldCk7XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgUGF0aFRyYW5zZm9ybSB7XHJcbiAgICBwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludFRyYW5zZm9ybSA9IHBvaW50VHJhbnNmb3JtO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludFRyYW5zZm9ybShwb2ludCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aEl0ZW0ocGF0aDogcGFwZXIuUGF0aEl0ZW0pIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1Db21wb3VuZFBhdGgocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aChwYXRoOiBwYXBlci5QYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiBwYXRoLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBvcmlnUG9pbnQgPSBzZWdtZW50LnBvaW50O1xyXG4gICAgICAgICAgICBsZXQgbmV3UG9pbnQgPSB0aGlzLnRyYW5zZm9ybVBvaW50KHNlZ21lbnQucG9pbnQpO1xyXG4gICAgICAgICAgICBvcmlnUG9pbnQueCA9IG5ld1BvaW50Lng7XHJcbiAgICAgICAgICAgIG9yaWdQb2ludC55ID0gbmV3UG9pbnQueTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuIiwiXHJcbmNsYXNzIFN0cmV0Y2hQYXRoIGV4dGVuZHMgcGFwZXIuUGF0aCB7XHJcblxyXG4gICAgcHJpdmF0ZSBfaGFuZGxlczogUGF0aEhhbmRsZVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2VnbWVudHM6IHBhcGVyLlNlZ21lbnRbXSwgc3R5bGU/OiBwYXBlci5TdHlsZSkge1xyXG4gICAgICAgIHN1cGVyKHNlZ21lbnRzKTtcclxuXHJcbiAgICAgICAgaWYoc3R5bGUpe1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlID0gc3R5bGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHJva2VDb2xvciA9IFwibGlnaHRncmF5XCI7XHJcbiAgICAgICAgICAgIHRoaXMuc3Ryb2tlV2lkdGggPSA2O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IoY29uc3QgcyBvZiB0aGlzLnNlZ21lbnRzKXtcclxuICAgICAgICAgICAgdGhpcy5hZGRTZWdtZW50SGFuZGxlKHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IoY29uc3QgYyBvZiB0aGlzLmN1cnZlcyl7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ3VydmVIYW5kbGUoYyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZShmbGFncyA9PiB7XHJcbiAgICAgICAgICAgaWYoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkFUVFJJQlVURSl7XHJcbiAgICAgICAgICAgICAgIGlmKHRoaXMuX2hhbmRsZXNbMF0udmlzaWJsZSAhPSB0aGlzLnZpc2libGUpXHJcbiAgICAgICAgICAgICAgIGZvcihjb25zdCBoIG9mIHRoaXMuX2hhbmRsZXMpe1xyXG4gICAgICAgICAgICAgICAgICAgaC52aXNpYmxlID0gdGhpcy52aXNpYmxlO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfSBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBhZGRTZWdtZW50SGFuZGxlKHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQpe1xyXG4gICAgICAgIGxldCBoYW5kbGUgPSBuZXcgUGF0aEhhbmRsZShzZWdtZW50KTtcclxuICAgICAgICBoYW5kbGUudmlzaWJsZSA9IHRoaXMudmlzaWJsZTtcclxuICAgICAgICB0aGlzLl9oYW5kbGVzLnB1c2goaGFuZGxlKTtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgYWRkQ3VydmVIYW5kbGUoY3VydmU6IHBhcGVyLkN1cnZlKXtcclxuICAgICAgICBsZXQgaGFuZGxlID0gbmV3IFBhdGhIYW5kbGUoY3VydmUpO1xyXG4gICAgICAgIGhhbmRsZS52aXNpYmxlID0gdGhpcy52aXNpYmxlO1xyXG4gICAgICAgIGhhbmRsZS5jdXJ2ZVNwbGl0LnN1YnNjcmliZU9uZShjdXJ2ZUlkeCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ3VydmVIYW5kbGUodGhpcy5jdXJ2ZXNbY3VydmVJZHhdKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZSh0aGlzLmN1cnZlc1tjdXJ2ZUlkeCArIDFdKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9oYW5kbGVzLnB1c2goaGFuZGxlKTtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICB9XHJcbn0iLCJcclxuLyoqXHJcbiAqIE1lYXN1cmVzIG9mZnNldHMgb2YgdGV4dCBnbHlwaHMuXHJcbiAqL1xyXG5jbGFzcyBUZXh0UnVsZXIge1xyXG4gICAgXHJcbiAgICBmb250RmFtaWx5OiBzdHJpbmc7XHJcbiAgICBmb250V2VpZ2h0OiBudW1iZXI7XHJcbiAgICBmb250U2l6ZTogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCAodGV4dCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XHJcbiAgICAgICAgcG9pbnRUZXh0LmNvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgIHBvaW50VGV4dC5qdXN0aWZpY2F0aW9uID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBpZih0aGlzLmZvbnRGYW1pbHkpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udEZhbWlseSA9IHRoaXMuZm9udEZhbWlseTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5mb250V2VpZ2h0KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRXZWlnaHQgPSB0aGlzLmZvbnRXZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFNpemUpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcG9pbnRUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRleHRPZmZzZXRzKHRleHQpe1xyXG4gICAgICAgIC8vIE1lYXN1cmUgZ2x5cGhzIGluIHBhaXJzIHRvIGNhcHR1cmUgd2hpdGUgc3BhY2UuXHJcbiAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxyXG4gICAgICAgIHZhciBnbHlwaFBhaXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpKzEpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRm9yIGVhY2ggY2hhcmFjdGVyLCBmaW5kIGNlbnRlciBvZmZzZXQuXHJcbiAgICAgICAgdmFyIHhPZmZzZXRzID0gWzBdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gTWVhc3VyZSB0aHJlZSBjaGFyYWN0ZXJzIGF0IGEgdGltZSB0byBnZXQgdGhlIGFwcHJvcHJpYXRlIFxyXG4gICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxyXG4gICAgICAgICAgICB2YXIgdHJpYWRUZXh0ID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSAtIDEsIGkgKyAxKSk7XHJcbiAgICAgICAgICAgIHRyaWFkVGV4dC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXHJcbiAgICAgICAgICAgIC8vICAgYW5kIGhhbGYgb2YgY3VycmVudCBnbHlwaCBwYWlyLlxyXG4gICAgICAgICAgICAvLyBNdXN0IGJlIHJpZ2h0LCBiZWNhdXNlIGl0IHdvcmtzLlxyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2kgLSAxXS5ib3VuZHMud2lkdGggLyAyIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHdpZHRoIHRvIHByaW9yIG9mZnNldC4gXHJcbiAgICAgICAgICAgIHhPZmZzZXRzW2ldID0geE9mZnNldHNbaSAtIDFdICsgb2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgZ2x5cGhQYWlyIG9mIGdseXBoUGFpcnMpe1xyXG4gICAgICAgICAgICBnbHlwaFBhaXIucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB4T2Zmc2V0cztcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgVGV4dFdhcnAgZXh0ZW5kcyBEdWFsQm91bmRzUGF0aFdhcnAge1xyXG5cclxuICAgIHN0YXRpYyBERUZBVUxUX0ZPTlRfU0laRSA9IDY0O1xyXG5cclxuICAgIHByaXZhdGUgX2ZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICBwcml2YXRlIF90ZXh0OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9mb250U2l6ZTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZvbnQ6IG9wZW50eXBlLkZvbnQsXHJcbiAgICAgICAgdGV4dDogc3RyaW5nLFxyXG4gICAgICAgIGJvdW5kcz86IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9LFxyXG4gICAgICAgIGZvbnRTaXplPzogbnVtYmVyLFxyXG4gICAgICAgIHN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZighZm9udFNpemUpe1xyXG4gICAgICAgICAgICAgICAgZm9udFNpemUgPSBUZXh0V2FycC5ERUZBVUxUX0ZPTlRfU0laRTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBUZXh0V2FycC5nZXRQYXRoRGF0YShmb250LCB0ZXh0LCBmb250U2l6ZSk7IFxyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzdXBlcihwYXRoLCBib3VuZHMsIHN0eWxlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSBmb250O1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0ID0gdGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl90ZXh0ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmb250U2l6ZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IGZvbnRTaXplKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZighdmFsdWUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2ZvbnRTaXplID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlVGV4dFBhdGgoKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aERhdGEgPSBUZXh0V2FycC5nZXRQYXRoRGF0YShcclxuICAgICAgICAgICAgdGhpcy5fZm9udCwgdGhpcy5fdGV4dCwgdGhpcy5fZm9udFNpemUpO1xyXG4gICAgICAgIHRoaXMuc291cmNlID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UGF0aERhdGEoZm9udDogb3BlbnR5cGUuRm9udCxcclxuICAgICAgICB0ZXh0OiBzdHJpbmcsIGZvbnRTaXplPzogc3RyaW5nfG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IG9wZW5UeXBlUGF0aCA9IGZvbnQuZ2V0UGF0aCh0ZXh0LCAwLCAwLFxyXG4gICAgICAgICAgICBOdW1iZXIoZm9udFNpemUpIHx8IFRleHRXYXJwLkRFRkFVTFRfRk9OVF9TSVpFKTtcclxuICAgICAgICByZXR1cm4gb3BlblR5cGVQYXRoLnRvUGF0aERhdGEoKTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBWaWV3Wm9vbSB7XHJcblxyXG4gICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuICAgIGZhY3RvciA9IDEuMjU7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX21pblpvb206IG51bWJlcjtcclxuICAgIHByaXZhdGUgX21heFpvb206IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9qZWN0OiBwYXBlci5Qcm9qZWN0KSB7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG5cclxuICAgICAgICAoPGFueT4kKHZpZXcuZWxlbWVudCkpLm1vdXNld2hlZWwoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBtb3VzZVBvc2l0aW9uID0gbmV3IHBhcGVyLlBvaW50KGV2ZW50Lm9mZnNldFgsIGV2ZW50Lm9mZnNldFkpO1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVpvb21DZW50ZXJlZChldmVudC5kZWx0YVksIG1vdXNlUG9zaXRpb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB6b29tKCk6IG51bWJlcntcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9qZWN0LnZpZXcuem9vbTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgem9vbVJhbmdlKCk6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHpvb20gbGV2ZWwuXHJcbiAgICAgKiBAcmV0dXJucyB6b29tIGxldmVsIHRoYXQgd2FzIHNldCwgb3IgbnVsbCBpZiBpdCB3YXMgbm90IGNoYW5nZWRcclxuICAgICAqL1xyXG4gICAgc2V0Wm9vbUNvbnN0cmFpbmVkKHpvb206IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgaWYodGhpcy5fbWluWm9vbSkge1xyXG4gICAgICAgICAgICB6b29tID0gTWF0aC5tYXgoem9vbSwgdGhpcy5fbWluWm9vbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX21heFpvb20pe1xyXG4gICAgICAgICAgICB6b29tID0gTWF0aC5taW4oem9vbSwgdGhpcy5fbWF4Wm9vbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgaWYoem9vbSAhPSB2aWV3Lnpvb20pe1xyXG4gICAgICAgICAgICB2aWV3Lnpvb20gPSB6b29tO1xyXG4gICAgICAgICAgICByZXR1cm4gem9vbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Wm9vbVJhbmdlKHJhbmdlOiBwYXBlci5TaXplW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICBsZXQgYVNpemUgPSByYW5nZS5zaGlmdCgpO1xyXG4gICAgICAgIGxldCBiU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgbGV0IGEgPSBhU2l6ZSAmJiBNYXRoLm1pbiggXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIGFTaXplLmhlaWdodCwgICAgICAgICBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMud2lkdGggLyBhU2l6ZS53aWR0aCk7XHJcbiAgICAgICAgbGV0IGIgPSBiU2l6ZSAmJiBNYXRoLm1pbiggXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIGJTaXplLmhlaWdodCwgICAgICAgICBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMud2lkdGggLyBiU2l6ZS53aWR0aCk7XHJcbiAgICAgICAgbGV0IG1pbiA9IE1hdGgubWluKGEsYik7XHJcbiAgICAgICAgaWYobWluKXtcclxuICAgICAgICAgICAgdGhpcy5fbWluWm9vbSA9IG1pbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG1heCA9IE1hdGgubWF4KGEsYik7XHJcbiAgICAgICAgaWYobWF4KXtcclxuICAgICAgICAgICAgdGhpcy5fbWF4Wm9vbSA9IG1heDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLl9taW5ab29tLCB0aGlzLl9tYXhab29tXTtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2Vab29tQ2VudGVyZWQoZGVsdGFZOiBudW1iZXIsIG1vdXNlUG9zOiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIGlmICghZGVsdGFZKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICBsZXQgb2xkWm9vbSA9IHZpZXcuem9vbTtcclxuICAgICAgICBsZXQgb2xkQ2VudGVyID0gdmlldy5jZW50ZXI7XHJcbiAgICAgICAgbGV0IHZpZXdQb3MgPSB2aWV3LnZpZXdUb1Byb2plY3QobW91c2VQb3MpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBuZXdab29tID0gZGVsdGFZID4gMFxyXG4gICAgICAgICAgICA/IHZpZXcuem9vbSAqIHRoaXMuZmFjdG9yXHJcbiAgICAgICAgICAgIDogdmlldy56b29tIC8gdGhpcy5mYWN0b3I7XHJcbiAgICAgICAgbmV3Wm9vbSA9IHRoaXMuc2V0Wm9vbUNvbnN0cmFpbmVkKG5ld1pvb20pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCFuZXdab29tKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHpvb21TY2FsZSA9IG9sZFpvb20gLyBuZXdab29tO1xyXG4gICAgICAgIGxldCBjZW50ZXJBZGp1c3QgPSB2aWV3UG9zLnN1YnRyYWN0KG9sZENlbnRlcik7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IHZpZXdQb3Muc3VidHJhY3QoY2VudGVyQWRqdXN0Lm11bHRpcGx5KHpvb21TY2FsZSkpXHJcbiAgICAgICAgICAgIC5zdWJ0cmFjdChvbGRDZW50ZXIpO1xyXG5cclxuICAgICAgICB2aWV3LmNlbnRlciA9IHZpZXcuY2VudGVyLmFkZChvZmZzZXQpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgem9vbVRvKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSl7XHJcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICB2aWV3LmNlbnRlciA9IHJlY3QuY2VudGVyO1xyXG4gICAgICAgIHZpZXcuem9vbSA9IE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy52aWV3U2l6ZS5oZWlnaHQgLyByZWN0LmhlaWdodCwgXHJcbiAgICAgICAgICAgIHZpZXcudmlld1NpemUud2lkdGggLyByZWN0LndpZHRoKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgV29ya3NwYWNlIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgIGRlZmF1bHRCYWNrZ3JvdW5kQ29sb3IgPSAnI2ZkZmRmZCc7XHJcblxyXG4gICAgc2hlZXQ6IHBhcGVyLlNoYXBlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNpemU6IHBhcGVyLlNpemUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzaGVldCA9IHBhcGVyLlNoYXBlLlJlY3RhbmdsZShcclxuICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsIDApLCBzaXplKTtcclxuICAgICAgICBzaGVldC5zdHlsZS5zaGFkb3dDb2xvciA9ICdncmF5JztcclxuICAgICAgICBzaGVldC5zdHlsZS5zaGFkb3dCbHVyID0gMztcclxuICAgICAgICBzaGVldC5zdHlsZS5zaGFkb3dPZmZzZXQgPSBuZXcgcGFwZXIuUG9pbnQoNSwgNSlcclxuICAgICAgICB0aGlzLnNoZWV0ID0gc2hlZXQ7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChzaGVldCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2hlZXQuZmlsbENvbG9yID0gdGhpcy5kZWZhdWx0QmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFBhcGVySGVscGVycy5hZGRTbWFydERyYWcodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGJhY2tncm91bmRDb2xvcigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNoZWV0LmZpbGxDb2xvci50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBiYWNrZ3JvdW5kQ29sb3IodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2hlZXQuZmlsbENvbG9yID0gdmFsdWUgfHwgdGhpcy5kZWZhdWx0QmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEhpZGUgc3Ryb2tlIHdoZW4gcG9zc2libGUgYmVjYXVzZSBpdCBoYXMgYSB3ZWlyZCBzaGFkb3cuIFxyXG4gICAgICAgIC8vIEFzc3VtZSBjYW52YXMgaXMgd2hpdGUuXHJcbiAgICAgICAgdGhpcy5zaGVldC5zdHJva2VDb2xvciA9ICg8cGFwZXIuQ29sb3I+dGhpcy5zaGVldC5maWxsQ29sb3IpLmJyaWdodG5lc3MgPiAwLjk3XHJcbiAgICAgICAgICAgID8gXCJsaWdodGdyYXlcIlxyXG4gICAgICAgICAgICA6IG51bGw7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmludGVyZmFjZSBTa2V0Y2hJdGVtU3R5bGUgZXh0ZW5kcyBwYXBlci5JU3R5bGUge1xyXG4gICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG59XHJcbiIsIlxyXG5cclxuZnVuY3Rpb24gYm9vdHN0cmFwKCkge1xyXG4gICAgXHJcbiAgICBjb25zdCBjaGFubmVscyA9IG5ldyBDaGFubmVscygpO1xyXG4gICAgY29uc3QgYWN0aW9ucyA9IGNoYW5uZWxzLmFjdGlvbnMsIGV2ZW50cyA9IGNoYW5uZWxzLmV2ZW50cztcclxuICAgIGNvbnN0IHN0b3JlID0gbmV3IFN0b3JlKGNoYW5uZWxzKTtcclxuICAgIFxyXG4gICAgY29uc3Qgc2tldGNoRWRpdG9yID0gbmV3IFNrZXRjaEVkaXRvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduZXInKSwgY2hhbm5lbHMpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtRWRpdG9yID0gbmV3IFNlbGVjdGVkSXRlbUVkaXRvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRvck92ZXJsYXlcIiksIGNoYW5uZWxzKTtcclxuICAgIGNvbnN0IGRlc2lnbmVyQ29udHJvbGxlciA9IG5ldyBEZXNpZ25lckNvbnRyb2xsZXIoY2hhbm5lbHMpO1xyXG4gICAgXHJcbiAgICBjb25zdCBhcHBDb250cm9sbGVyID0gbmV3IEFwcENvbnRyb2xsZXIoY2hhbm5lbHMsIHN0b3JlLCBcclxuICAgICAgICBza2V0Y2hFZGl0b3IsIHNlbGVjdGVkSXRlbUVkaXRvciwgZGVzaWduZXJDb250cm9sbGVyKTtcclxuXHJcbn1cclxuXHJcbmJvb3RzdHJhcCgpO1xyXG4iXX0=