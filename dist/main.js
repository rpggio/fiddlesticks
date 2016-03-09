var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DomHelpers;
(function (DomHelpers) {
    //  https://support.mozilla.org/en-US/questions/968992
    function downloadFile(dataUrl, filename) {
        var link = document.createElement("a");
        link.id = newid();
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.target = "_self";
        link.click();
        document.body.removeChild(link);
    }
    DomHelpers.downloadFile = downloadFile;
    DomHelpers.KeyCodes = {
        BackSpace: 8,
        Tab: 9,
        Enter: 13,
        Shift: 16,
        Ctrl: 17,
        Alt: 18,
        PauseBreak: 19,
        CapsLock: 20,
        Esc: 27,
        PageUp: 33,
        PageDown: 34,
        End: 35,
        Home: 36,
        ArrowLeft: 37,
        ArrowUp: 38,
        ArrowRight: 39,
        ArrowDown: 40,
        Insert: 45,
        Delete: 46,
        Digit0: 48,
        Digit1: 49,
        Digit2: 50,
        Digit3: 51,
        Digit4: 52,
        Digit5: 53,
        Digit6: 54,
        Digit7: 55,
        Digit8: 56,
        Digit9: 57,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        WindowLeft: 91,
        WindowRight: 92,
        SelectKey: 93,
        Numpad0: 96,
        Numpad1: 97,
        Numpad2: 98,
        Numpad3: 99,
        Numpad4: 100,
        Numpad5: 101,
        Numpad6: 102,
        Numpad7: 103,
        Numpad8: 104,
        Numpad9: 105,
        Multiply: 106,
        Add: 107,
        Subtract: 109,
        DecimalPoint: 110,
        Divide: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        NumLock: 144,
        ScrollLock: 145,
        SemiColon: 186,
        Equal: 187,
        Comma: 188,
        Dash: 189,
        Period: 190,
        ForwardSlash: 191,
        GraveAccent: 192,
        BracketOpen: 219,
        BackSlash: 220,
        BracketClose: 221,
        SingleQuote: 222
    };
})(DomHelpers || (DomHelpers = {}));
var FontHelpers;
(function (FontHelpers) {
    function getCssStyle(family, variant) {
        var style = { fontFamily: family };
        if (variant.indexOf("italic") >= 0) {
            style.fontStyle = "italic";
        }
        var numeric = variant.replace(/[^\d]/g, "");
        if (numeric.length) {
            style.fontWeight = numeric.toString();
        }
        return style;
    }
    FontHelpers.getCssStyle = getCssStyle;
    function getDescription(family, variant) {
        var url;
        url = family.files[variant || "regular"];
        if (!url) {
            url = family.files[0];
        }
        return {
            family: family.family,
            category: family.category,
            variant: variant,
            url: url
        };
    }
    FontHelpers.getDescription = getDescription;
})(FontHelpers || (FontHelpers = {}));
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
        ChannelTopic.prototype.observe = function () {
            var _this = this;
            return this.channel.filter(function (m) { return m.type === _this.type; });
        };
        ChannelTopic.prototype.forward = function (channel) {
            this.subscribe(function (m) { return channel.dispatch(m.data); });
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
    ObservableEvent.prototype.subscribe = function (handler) {
        var _this = this;
        if (this._subscribers.indexOf(handler) < 0) {
            this._subscribers.push(handler);
        }
        return function () { return _this.unsubscribe(handler); };
    };
    ObservableEvent.prototype.unsubscribe = function (callback) {
        var index = this._subscribers.indexOf(callback, 0);
        if (index > -1) {
            this._subscribers.splice(index, 1);
        }
    };
    ObservableEvent.prototype.observe = function () {
        var _this = this;
        var unsub;
        return Rx.Observable.fromEventPattern(function (handlerToAdd) { return _this.subscribe(handlerToAdd); }, function (handlerToRemove) { return _this.unsubscribe(handlerToRemove); });
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
                return h("li", {}, [
                    h('a', item.options || {}, [item.content])
                ]);
            }))
        ]);
    }
    BootScript.dropdown = dropdown;
})(BootScript || (BootScript = {}));
var PaperHelpers;
(function (PaperHelpers) {
    var log = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i - 0] = arguments[_i];
        }
        if (PaperHelpers.shouldLogInfo) {
            console.log.apply(console, params);
        }
    };
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
            log("smartDrag.onMouseDrag", item, ev);
            if (ev.smartDragItem) {
                console.warn("Will not assign smartDragItem: value was already " + ev.smartDragItem);
            }
            else {
                ev.smartDragItem = item;
            }
            if (!item.isSmartDragging) {
                item.isSmartDragging = true;
                log("emitting smartDrag.smartDragStart");
                item.emit(PaperHelpers.EventType.smartDragStart, ev);
            }
            item.position = item.position.add(ev.delta);
            log("emitting smartDrag.smartDragMove");
            item.emit(PaperHelpers.EventType.smartDragMove, ev);
            ev.stop();
        });
        item.on(paper.EventType.mouseUp, function (ev) {
            log("smartDrag.onMouseUp", item, ev);
            if (ev.smartDragItem) {
                console.warn("Will not assign smartDragItem: value was already " + ev.smartDragItem);
            }
            else {
                ev.smartDragItem = item;
            }
            if (item.isSmartDragging) {
                item.isSmartDragging = false;
                log("emitting smartDrag.smartDragEnd");
                item.emit(PaperHelpers.EventType.smartDragEnd, ev);
            }
            else {
                log("emitting smartDrag.clickWithoutDrag");
                item.emit(PaperHelpers.EventType.clickWithoutDrag, ev);
            }
            ev.stop();
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
        // Inject Item.subscribe
        var itemProto = paper.Item.prototype;
        itemProto.subscribe = function (handler) {
            var _this = this;
            if (!this._subscribers) {
                this._subscribers = [];
            }
            if (this._subscribers.indexOf(handler) < 0) {
                this._subscribers.push(handler);
            }
            return function () {
                var index = _this._subscribers.indexOf(handler, 0);
                if (index > -1) {
                    _this._subscribers.splice(index, 1);
                }
            };
        };
        // Wrap Item.remove
        var itemRemove = itemProto.remove;
        itemProto.remove = function () {
            itemRemove.apply(this, arguments);
            this._subscribers = null;
        };
        // Wrap Project._changed
        var projectProto = paper.Project.prototype;
        var projectChanged = projectProto._changed;
        projectProto._changed = function (flags, item) {
            projectChanged.apply(this, arguments);
            if (item) {
                var subs = item._subscribers;
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
    function observe(item, flags) {
        var unsub;
        return Rx.Observable.fromEventPattern(function (addHandler) {
            unsub = item.subscribe(function (f) {
                if (f & flags) {
                    addHandler(f);
                }
            });
        }, function (removeHandler) {
            if (unsub) {
                unsub();
            }
        });
    }
    PaperNotify.observe = observe;
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
        mouseLeave: "mouseleave",
        keyup: "keyup",
        keydown: "keydown"
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
var rh = React.createElement;
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
// const AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
// const Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
// const Roboto500 = 'fonts/Roboto-500.ttf';
// const Roboto900 = "http://fonts.gstatic.com/s/roboto/v15/H1vB34nOKWXqzKotq25pcg.ttf";
// const OpenSansRegular = "fonts/OpenSans/OpenSans-Regular.ttf";
// const OpenSansExtraBold = "fonts/OpenSans/OpenSans-ExtraBold.ttf";
// const AquafinaScript = 'fonts/AguafinaScript-Regular/AguafinaScript-Regular.ttf'
// const Norican = "http://fonts.gstatic.com/s/norican/v4/SHnSqhYAWG5sZTWcPzEHig.ttf";
var AppController = (function () {
    function AppController(store, sketchEditor, selectedItemEditor) {
        var _this = this;
        var actions = store.actions, events = store.events;
        events.subscribe(function (m) { return console.log("event", m); });
        actions.subscribe(function (m) { return console.log("action", m); });
        events.app.fontLoaded.observe().first().subscribe(function (m) {
            _this.workspaceController = new WorkspaceController(store, m.data);
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
        });
        events.sketch.loaded.subscribe(function (ev) {
            return $("#mainCanvas").css("background-color", ev.data.backgroundColor);
        });
        events.sketch.attrChanged.subscribe(function (ev) {
            return $("#mainCanvas").css("background-color", ev.data.backgroundColor);
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
            loadFont: this.topic("app.loadFont")
        };
        this.designer = {
            zoomToFit: this.topic("designer.zoomToFit"),
            exportingImage: this.topic("designer.exportImage"),
            exportPNG: this.topic("designer.exportPNG"),
            exportSVG: this.topic("designer.exportSVG"),
            viewChanged: this.topic("designer.viewChanged")
        };
        this.sketch = {
            create: this.topic("sketch.create"),
            attrUpdate: this.topic("sketch.attrUpdate"),
            setEditingItem: this.topic("sketch.setEditingItem"),
            setSelection: this.topic("sketch.setSelection"),
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
            resourcesReady: this.topic("app.resourcesReady"),
            retainedStateLoadAttemptComplete: this.topic("app.retainedStateLoadAttemptComplete"),
            retainedStateChanged: this.topic("app.retainedStateChanged"),
            fontLoaded: this.topic("app.fontLoaded")
        };
        this.designer = {
            zoomToFitRequested: this.topic("designer.zoomToFitRequested"),
            exportPNGRequested: this.topic("designer.exportPNGRequested"),
            exportSVGRequested: this.topic("designer.exportSVGRequested"),
            viewChanged: this.topic("designer.viewChanged")
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
            attrChanged: this.topic("textblock.attrChanged"),
            arrangeChanged: this.topic("textblock.arrangeChanged"),
            removed: this.topic("textblock.removed"),
            loaded: this.topic("textblock.loaded"),
            editorClosed: this.topic("textblock.editorClosed"),
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
var FontFamiliesLoader = (function () {
    function FontFamiliesLoader() {
    }
    FontFamiliesLoader.prototype.loadListLocal = function (callback) {
        $.ajax({
            url: "fonts/google-fonts.json",
            dataType: 'json',
            cache: true,
            success: function (response) {
                callback(response.items);
            },
            error: function (xhr, status, err) {
                console.error("google-fonts.json", status, err.toString());
            }
        });
    };
    FontFamiliesLoader.prototype.loadListRemote = function (callback) {
        var url = 'https://www.googleapis.com/webfonts/v1/webfonts?';
        var key = 'key=GOOGLE-API-KEY';
        var sort = "popularity";
        var opt = 'sort=' + sort + '&';
        var req = url + opt + key;
        $.ajax({
            url: req,
            dataType: 'json',
            cache: true,
            success: function (response) {
                callback(response.items);
            },
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
            }
        });
    };
    FontFamiliesLoader.prototype.loadForPreview = function (families) {
        for (var _i = 0, _a = _.chunk(families, 10); _i < _a.length; _i++) {
            var chunk = _a[_i];
            WebFont.load({
                classes: false,
                google: {
                    families: chunk,
                    text: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                }
            });
        }
    };
    return FontFamiliesLoader;
}());
var ParsedFonts = (function () {
    function ParsedFonts(fontLoaded) {
        this.fonts = {};
        this._fontLoaded = fontLoaded;
    }
    ParsedFonts.prototype.get = function (fontUrl, onReady) {
        var _this = this;
        if (onReady === void 0) { onReady = null; }
        var font = this.fonts[fontUrl];
        if (font) {
            onReady && onReady(fontUrl, font);
            return;
        }
        opentype.load(fontUrl, function (err, font) {
            if (err) {
                console.error(err);
            }
            else {
                _this.fonts[fontUrl] = font;
                onReady && onReady(fontUrl, font);
                _this._fontLoaded(fontUrl, font);
            }
        });
    };
    return ParsedFonts;
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
    function Store() {
        var _this = this;
        this.state = {
            retained: {
                sketch: this.createSketch()
            },
            disposable: {}
        };
        this.resources = {
            fontFamilies: {},
            parsedFonts: new ParsedFonts(function (url, font) {
                return _this.events.app.fontLoaded.dispatch(font);
            })
        };
        this.actions = new Actions();
        this.events = new Events();
        this.setupSubscriptions();
        this.loadResources();
    }
    Store.prototype.setupSubscriptions = function () {
        var _this = this;
        var actions = this.actions, events = this.events;
        // ----- App -----
        actions.app.loadRetainedState.observe()
            .pausableBuffered(events.app.resourcesReady.observe().map(function (m) { return m.data; }))
            .subscribe(function (m) {
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
                    _this.state.retained.sketch.loading = true;
                    events.sketch.loaded.dispatch(_this.state.retained.sketch);
                    for (var _i = 0, _a = _this.state.retained.sketch.textBlocks; _i < _a.length; _i++) {
                        var tb = _a[_i];
                        events.textblock.loaded.dispatch(tb);
                    }
                    events.designer.zoomToFitRequested.dispatch();
                    _this.state.retained.sketch.loading = false;
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
        actions.app.loadFont.subscribe(function (m) {
            return _this.resources.parsedFonts.get(m.data);
        });
        // ----- Designer -----
        actions.designer.zoomToFit.forward(events.designer.zoomToFitRequested);
        actions.designer.exportPNG.forward(events.designer.exportPNGRequested);
        actions.designer.exportSVG.forward(events.designer.exportSVGRequested);
        actions.designer.viewChanged.subscribe(function (m) {
            // Can't do this, due to chance of accidental closing   
            // this.setEditingItem(null);
            events.designer.viewChanged.dispatch(m.data);
        });
        // ----- Sketch -----
        actions.sketch.create
            .subscribe(function (m) {
            _this.state.retained.sketch = _this.createSketch();
            var patch = m.data || {};
            patch.backgroundColor = patch.backgroundColor || '#f6f3eb';
            _this.assign(_this.state.retained.sketch, patch);
            events.sketch.loaded.dispatch(_this.state.retained.sketch);
            events.designer.zoomToFitRequested.dispatch();
            _this.resources.parsedFonts.get(_this.state.retained.sketch.defaultFontDesc.url);
            _this.setEditingItem(null);
            _this.changedRetainedState();
        });
        actions.sketch.attrUpdate
            .subscribe(function (ev) {
            _this.assign(_this.state.retained.sketch, ev.data);
            events.sketch.attrChanged.dispatch(_this.state.retained.sketch);
            _this.changedRetainedState();
        });
        actions.sketch.setEditingItem.subscribe(function (m) {
            _this.setEditingItem(m.data);
        });
        actions.sketch.setSelection.subscribe(function (m) {
            _this.setSelection(m.data);
        });
        // ----- TextBlock -----
        actions.textBlock.add
            .subscribe(function (ev) {
            _this.setEditingItem(null);
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
            if (block.fontDesc) {
                _this.state.retained.sketch.defaultFontDesc = block.fontDesc;
            }
            else {
                block.fontDesc = _this.state.retained.sketch.defaultFontDesc;
            }
            _this.state.retained.sketch.textBlocks.push(block);
            events.textblock.added.dispatch(block);
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
                    fontDesc: ev.data.fontDesc,
                    fontSize: ev.data.fontSize
                };
                _this.assign(block, patch_1);
                if (block.fontDesc) {
                    _this.state.retained.sketch.defaultFontDesc = block.fontDesc;
                }
                events.textblock.attrChanged.dispatch(block);
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
                events.textblock.removed.dispatch({ _id: ev.data._id });
                _this.changedRetainedState();
                _this.setEditingItem(null);
            }
        });
        actions.textBlock.updateArrange
            .subscribe(function (ev) {
            var block = _this.getBlock(ev.data._id);
            if (block) {
                block.position = ev.data.position;
                block.outline = ev.data.outline;
                events.textblock.arrangeChanged.dispatch(block);
                _this.changedRetainedState();
            }
        });
    };
    Store.prototype.loadResources = function () {
        var _this = this;
        var loader = new FontFamiliesLoader();
        loader.loadListLocal(function (families) {
            families.length = Store.FONT_LIST_LIMIT;
            var dict = _this.resources.fontFamilies;
            for (var _i = 0, families_1 = families; _i < families_1.length; _i++) {
                var familyGroup = families_1[_i];
                dict[familyGroup.family] = familyGroup;
            }
            // load fonts into browser for preview
            loader.loadForPreview(families.map(function (f) { return f.family; }));
            _this.resources.parsedFonts.get(Store.ROBOTO_500_LOCAL);
            _this.events.app.resourcesReady.dispatch(true);
        });
    };
    Store.prototype.changedRetainedState = function () {
        this.events.app.retainedStateChanged.dispatch(this.state.retained);
    };
    Store.prototype.assign = function (dest, source) {
        _.merge(dest, source);
    };
    Store.prototype.createSketch = function () {
        return {
            defaultFontDesc: {
                family: "Roboto",
                variant: null,
                category: null,
                url: Store.ROBOTO_500_LOCAL
            },
            textBlocks: []
        };
    };
    Store.prototype.setSelection = function (item) {
        // early exit on no change
        if (item) {
            if (this.state.disposable.selection
                && this.state.disposable.selection.itemId === item.itemId) {
                return;
            }
        }
        else {
            if (!this.state.disposable.selection) {
                return;
            }
        }
        this.state.disposable.selection = item;
        this.events.sketch.selectionChanged.dispatch(item);
    };
    Store.prototype.setEditingItem = function (item) {
        // early exit on no change
        if (item) {
            if (this.state.disposable.editingItem
                && this.state.disposable.editingItem.itemId === item.itemId) {
                return;
            }
        }
        else {
            if (!this.state.disposable.editingItem) {
                return;
            }
        }
        if (this.state.disposable.editingItem) {
            // signal closing editor for item
            if (this.state.disposable.editingItem.itemType === "TextBlock") {
                var currentEditingBlock = this.getBlock(this.state.disposable.editingItem.itemId);
                if (currentEditingBlock) {
                    this.events.textblock.editorClosed.dispatch(currentEditingBlock);
                }
            }
        }
        if (item) {
            // editing item should be selected item
            this.setSelection(item);
        }
        this.state.disposable.editingItem = item;
        this.events.sketch.editingItemChanged.dispatch(item);
    };
    Store.prototype.getBlock = function (id) {
        return _.find(this.state.retained.sketch.textBlocks, function (tb) { return tb._id === id; });
    };
    Store.ROBOTO_500_LOCAL = 'fonts/Roboto-500.ttf';
    Store.AUTOSAVE_KEY = "Fiddlesticks.retainedState";
    Store.DEFAULT_FONT_NAME = "Roboto";
    Store.FONT_LIST_LIMIT = 100;
    return Store;
}());
var SketchHelpers = {
    colorsInUse: function (sketch) {
        var colors = [sketch.backgroundColor];
        for (var _i = 0, _a = sketch.textBlocks; _i < _a.length; _i++) {
            var block = _a[_i];
            colors.push(block.backgroundColor);
            colors.push(block.textColor);
        }
        colors = _.uniq(colors.filter(function (c) { return c != null; }));
        colors.sort();
        return colors;
    }
};
var ColorPicker;
(function (ColorPicker) {
    var DEFAULT_PALETTE = [
        [
            // http://www.color-hex.com/color-palette/807
            "#ee4035",
            "#f37736",
            "#fdf498",
            "#7bc043",
            "#0392cf",
        ],
        [
            // http://www.color-hex.com/color-palette/894
            "#edc951",
            "#eb6841",
            "#cc2a36",
            "#4f372d",
            "#00a0b0",
        ],
        [
            // http://www.color-hex.com/color-palette/164
            "#1b85b8",
            "#5a5255",
            "#559e83",
            "#ae5a41",
            "#c3cb71",
        ],
        [
            // http://www.color-hex.com/color-palette/389
            "#4b3832",
            "#854442",
            "#fff4e6",
            "#3c2f2f",
            "#be9b7b",
        ],
        [
            // http://www.color-hex.com/color-palette/455
            "#ff4e50",
            "#fc913a",
            "#f9d62e",
            "#eae374",
            "#e2f4c7",
        ],
        [
            // http://www.color-hex.com/color-palette/700
            "#d11141",
            "#00b159",
            "#00aedb",
            "#f37735",
            "#ffc425",
        ],
        [
            // http://www.color-hex.com/color-palette/826
            "#e8d174",
            "#e39e54",
            "#d64d4d",
            "#4d7358",
            "#9ed670",
        ],
        [
            // http://www.color-hex.com/color-palette/1223
            "#ffd4e5",
            "#d4ffea",
            "#eecbff",
            "#feffa3",
            "#dbdcff",
        ],
        [
            "#000", "#666", "#ccc", "#eee", "#fff"
        ],
    ];
    function setup(elem, topColors, onChange) {
        var topColorsGrouped = _.chunk(topColors, 5);
        var palette = topColorsGrouped.concat(DEFAULT_PALETTE);
        var sel = $(elem);
        $(elem).spectrum({
            showInput: true,
            allowEmpty: true,
            preferredFormat: "hex",
            showButtons: false,
            showAlpha: true,
            showPalette: true,
            showSelectionPalette: false,
            palette: palette,
            localStorageKey: "sketchtext",
            change: onChange
        });
    }
    ColorPicker.setup = setup;
    ;
    function set(elem, value) {
        $(elem).spectrum("set", value);
    }
    ColorPicker.set = set;
    function destroy(elem) {
        $(elem).spectrum("destroy");
    }
    ColorPicker.destroy = destroy;
})(ColorPicker || (ColorPicker = {}));
var DocumentKeyHandler = (function () {
    function DocumentKeyHandler(store) {
        // note: undisposed event subscription
        $(document).keyup(function (e) {
            if (e.keyCode == DomHelpers.KeyCodes.Esc) {
                if (store.state.disposable.editingItem) {
                    store.actions.sketch.setEditingItem.dispatch(null);
                }
                else {
                    store.actions.sketch.setSelection.dispatch(null);
                }
            }
        });
    }
    return DocumentKeyHandler;
}());
var FontPicker = (function (_super) {
    __extends(FontPicker, _super);
    function FontPicker(props) {
        _super.call(this, props);
        this.previewFontSize = "28px";
        this.state = {};
        if (this.props.selection) {
            this.state.familyObject = this.props.store.resources.fontFamilies[this.props.selection.family];
            this.state.variant = this.props.selection.variant;
        }
    }
    FontPicker.prototype.render = function () {
        var _this = this;
        var familyOptionRender = function (option) {
            var fontFamily = option.value;
            return rh("div", {
                style: {
                    fontFamily: fontFamily,
                    fontSize: _this.previewFontSize
                }
            }, [fontFamily]);
        };
        var variantOptionRender = function (option) {
            var fontVariant = option.value;
            var style = FontHelpers.getCssStyle(_this.state.familyObject.family, fontVariant);
            style.fontSize = _this.previewFontSize;
            return rh("div", { style: style }, [(_this.state.familyObject.family + " " + option.value)]);
        };
        return rh("div", {
            className: "font-picker"
        }, [
            rh(ReactSelect, {
                name: "font-family",
                key: "font-family",
                className: "font-family",
                value: this.state.familyObject && this.state.familyObject.family,
                clearable: false,
                options: this.getFamilyOptions(),
                optionRenderer: familyOptionRender,
                valueRenderer: familyOptionRender,
                onChange: function (f) {
                    var familyObject = _this.props.store.resources.fontFamilies[f];
                    var variant = _.last(familyObject.variants
                        .filter(function (v) { return v.indexOf("italic") < 0; }));
                    _this.setState({
                        familyObject: familyObject,
                        variant: variant
                    }, function () { return _this.sendSelectionChanged(); });
                }
            }),
            // only show for multiple variants
            this.state.familyObject && this.state.familyObject.variants.length > 1 &&
                rh(ReactSelect, {
                    name: "font-variant",
                    key: "font-variant",
                    className: "font-variant",
                    clearable: false,
                    value: this.state.variant,
                    options: this.state.familyObject && this.state.familyObject.variants.map(function (v) {
                        return { value: v, label: v };
                    }),
                    optionRenderer: variantOptionRender,
                    valueRenderer: variantOptionRender,
                    onChange: function (value) {
                        _this.setState({
                            familyObject: _this.state.familyObject,
                            variant: value
                        }, function () { return _this.sendSelectionChanged(); });
                    }
                }),
        ]);
    };
    FontPicker.prototype.sendSelectionChanged = function () {
        this.props.selectionChanged(FontHelpers.getDescription(this.state.familyObject, this.state.variant));
    };
    FontPicker.prototype.getFamilyOptions = function () {
        var options = _.values(this.props.store.resources.fontFamilies)
            .map(function (fontFamily) { return { value: fontFamily.family, label: fontFamily.family }; });
        return options;
    };
    return FontPicker;
}(React.Component));
var SelectedItemEditor = (function () {
    function SelectedItemEditor(container, store) {
        var dom$ = store.events.mergeTyped(store.events.sketch.editingItemChanged, store.events.sketch.loaded).map(function (i) {
            var posItem = i.data;
            var block = posItem
                && posItem.itemType === 'TextBlock'
                && _.find(store.state.retained.sketch.textBlocks, function (b) { return b._id === posItem.itemId; });
            if (!block) {
                return h('div#editorOverlay', {
                    style: {
                        display: "none"
                    }
                });
            }
            return h('div#editorOverlay', {
                style: {
                    left: posItem.clientX + "px",
                    top: posItem.clientY + "px",
                    "z-index": 1
                }
            }, [
                new TextBlockEditor(store).render(block)
            ]);
        });
        ReactiveDom.renderStream(dom$, container);
    }
    return SelectedItemEditor;
}());
var SketchEditor = (function (_super) {
    __extends(SketchEditor, _super);
    function SketchEditor(container, store) {
        var _this = this;
        _super.call(this);
        this.store = store;
        var sketchDom$ = store.events.merge(store.events.sketch.loaded, store.events.sketch.attrChanged)
            .map(function (m) { return _this.render(store.state.retained.sketch); });
        ReactiveDom.renderStream(sketchDom$, container);
    }
    SketchEditor.prototype.render = function (sketch) {
        var _this = this;
        var self = this;
        return h("div", [
            h("label", "Add text: "),
            h("input.add-text", {
                on: {
                    keypress: function (ev) {
                        if ((ev.which || ev.keyCode) === DomHelpers.KeyCodes.Enter) {
                            var text = ev.target && ev.target.value;
                            if (text.length) {
                                _this.store.actions.textBlock.add.dispatch({ text: text });
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
                    value: sketch.backgroundColor
                },
                hook: {
                    insert: function (vnode) {
                        return ColorPicker.setup(vnode.elm, SketchHelpers.colorsInUse(_this.store.state.retained.sketch), function (color) {
                            _this.store.actions.sketch.attrUpdate.dispatch({ backgroundColor: color && color.toHexString() });
                        });
                    },
                    update: function (oldVnode, vnode) {
                        ColorPicker.set(vnode.elm, sketch.backgroundColor);
                    },
                    destroy: function (vnode) { return ColorPicker.destroy(vnode.elm); }
                }
            }),
            BootScript.dropdown({
                id: "sketchMenu",
                content: "Actions",
                items: [
                    {
                        content: "New",
                        options: {
                            attrs: {
                                title: "Create new sketch"
                            },
                            on: {
                                click: function () { return _this.store.actions.sketch.create.dispatch(); }
                            }
                        }
                    },
                    {
                        content: "Zoom to fit",
                        options: {
                            attrs: {
                                title: "Fit contents in view"
                            },
                            on: {
                                click: function () { return _this.store.actions.designer.zoomToFit.dispatch(); }
                            }
                        }
                    },
                    {
                        content: "Export image",
                        options: {
                            attrs: {
                                title: "Export Fiddle as PNG",
                            },
                            on: {
                                click: function () { return _this.store.actions.designer.exportPNG.dispatch(); }
                            }
                        }
                    },
                    {
                        content: "Export SVG",
                        options: {
                            attrs: {
                                title: "Export Fiddle as vector graphics"
                            },
                            on: {
                                click: function () { return _this.store.actions.designer.exportSVG.dispatch(); }
                            }
                        }
                    },
                ]
            })
        ]);
    };
    return SketchEditor;
}(Component));
var TextBlockEditor = (function (_super) {
    __extends(TextBlockEditor, _super);
    function TextBlockEditor(store) {
        _super.call(this);
        this.store = store;
    }
    TextBlockEditor.prototype.render = function (textBlock) {
        var _this = this;
        var update = function (tb) {
            tb._id = textBlock._id;
            _this.store.actions.textBlock.updateAttr.dispatch(tb);
        };
        return h("div.text-block-editor", {}, [
            h("textarea", {
                attrs: {},
                props: {
                    value: textBlock.text
                },
                on: {
                    keypress: function (ev) {
                        if ((ev.which || ev.keyCode) === DomHelpers.KeyCodes.Enter) {
                            ev.preventDefault();
                            update({ text: ev.target.value });
                            _this.store.actions.sketch.setEditingItem.dispatch(null);
                        }
                    },
                    change: function (ev) { return update({ text: ev.target.value }); }
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
                            return ColorPicker.setup(vnode.elm, SketchHelpers.colorsInUse(_this.store.state.retained.sketch), function (color) { return update({ textColor: color && color.toHexString() }); });
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
                            return ColorPicker.setup(vnode.elm, SketchHelpers.colorsInUse(_this.store.state.retained.sketch), function (color) { return update({ backgroundColor: color && color.toHexString() }); });
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
                    click: function (e) { return _this.store.actions.textBlock.remove.dispatch(textBlock); }
                }
            }, [
                h("span.glyphicon.glyphicon-trash")
            ]),
            h("div.font-picker-container", {
                hook: {
                    insert: function (vnode) {
                        var props = {
                            store: _this.store,
                            selection: textBlock.fontDesc,
                            selectionChanged: function (fontDesc) {
                                update({ fontDesc: fontDesc });
                            }
                        };
                        ReactDOM.render(rh(FontPicker, props), vnode.elm);
                    },
                }
            }),
            h("div.end-controls", {}, [])
        ]);
    };
    return TextBlockEditor;
}(Component));
var WorkspaceController = (function () {
    function WorkspaceController(store, fallbackFont) {
        var _this = this;
        this.defaultSize = new paper.Size(50000, 40000);
        this.defaultScale = 0.02;
        this._textBlockItems = {};
        this.store = store;
        this.fallbackFont = fallbackFont;
        paper.settings.handleSize = 1;
        this.canvas = document.getElementById('mainCanvas');
        paper.setup(this.canvas);
        this.project = paper.project;
        this.viewZoom = new ViewZoom(this.project);
        this.viewZoom.viewChanged.subscribe(function (bounds) {
            store.actions.designer.viewChanged.dispatch(bounds);
        });
        var clearSelection = function (ev) {
            if (store.state.disposable.editingItem) {
                store.actions.sketch.setEditingItem.dispatch(null);
            }
            else if (store.state.disposable.selection) {
                store.actions.sketch.setSelection.dispatch(null);
            }
        };
        paper.view.on(paper.EventType.click, clearSelection);
        paper.view.on(PaperHelpers.EventType.smartDragStart, clearSelection);
        // paper.view.on("keyup", (ev: paper.KeyEvent) => {
        // }); 
        var keyHandler = new DocumentKeyHandler(store);
        // ----- Designer -----
        store.events.designer.zoomToFitRequested.subscribe(function () {
            _this.zoomToFit();
        });
        store.events.designer.exportPNGRequested.subscribe(function () {
            _this.downloadPNG();
        });
        store.events.designer.exportSVGRequested.subscribe(function () {
            _this.downloadSVG();
        });
        // ----- Sketch -----
        store.events.sketch.loaded.subscribe(function (ev) {
            _this._sketch = ev.data;
            _this.project.clear();
            _this.project.deselectAll();
            _this._textBlockItems = {};
        });
        store.events.sketch.selectionChanged.subscribe(function (m) {
            _this.project.deselectAll();
            if (m.data) {
                var block = m.data.itemId && _this._textBlockItems[m.data.itemId];
                if (block && !block.selected) {
                    block.selected = true;
                }
            }
        });
        // ----- TextBlock -----
        store.events.mergeTyped(store.events.textblock.added, store.events.textblock.loaded).subscribe(function (ev) { return _this.addBlock(ev.data); });
        store.events.textblock.attrChanged
            .observe()
            .throttle(WorkspaceController.TEXT_CHANGE_RENDER_THROTTLE_MS)
            .subscribe(function (m) {
            var item = _this._textBlockItems[m.data._id];
            if (item) {
                var textBlock = m.data;
                item.text = textBlock.text;
                if (textBlock.fontDesc && textBlock.fontDesc.url) {
                    // push in font when ready
                    store.resources.parsedFonts.get(textBlock.fontDesc.url, function (url, font) { return item.font = font; });
                }
                item.customStyle = {
                    fontSize: textBlock.fontSize,
                    fillColor: textBlock.textColor,
                    backgroundColor: textBlock.backgroundColor
                };
            }
        });
        store.events.textblock.removed.subscribe(function (m) {
            var item = _this._textBlockItems[m.data._id];
            if (item) {
                item.remove();
                delete _this._textBlockItems[m.data._id];
            }
        });
        store.events.textblock.editorClosed.subscribe(function (m) {
            var item = _this._textBlockItems[m.data._id];
            if (item) {
                item.updateTextPath();
            }
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
    WorkspaceController.prototype.downloadPNG = function () {
        var background = this.insertBackground();
        var raster = app.workspaceController.project.activeLayer.rasterize(300, false);
        var data = raster.toDataURL();
        DomHelpers.downloadFile(data, this.getSketchFileName(40, "png"));
        background.remove();
    };
    WorkspaceController.prototype.downloadSVG = function () {
        var background;
        if (this.store.state.retained.sketch.backgroundColor) {
            background = this.insertBackground();
        }
        var url = "data:image/svg+xml;utf8," + encodeURIComponent(this.project.exportSVG({ asString: true }));
        DomHelpers.downloadFile(url, this.getSketchFileName(40, "svg"));
        if (background) {
            background.remove();
        }
    };
    WorkspaceController.prototype.getSketchFileName = function (length, extension) {
        var name = "";
        outer: for (var _i = 0, _a = this.store.state.retained.sketch.textBlocks; _i < _a.length; _i++) {
            var block = _a[_i];
            for (var _b = 0, _c = block.text.split(/\s/); _b < _c.length; _b++) {
                var word = _c[_b];
                var trim = word.replace(/\W/g, '').trim();
                if (trim.length) {
                    if (name.length)
                        name += " ";
                    name += trim;
                }
                if (name.length >= length) {
                    break outer;
                }
            }
        }
        if (!name.length) {
            name = "fiddle";
        }
        return name + "." + extension;
    };
    /**
     * Insert sketch background to provide background fill (if necessary)
     *   and add margin around edges.
     */
    WorkspaceController.prototype.insertBackground = function () {
        var bounds = app.workspaceController.project.activeLayer.bounds;
        var background = paper.Shape.Rectangle(bounds.topLeft.subtract(20), bounds.bottomRight.add(20));
        background.fillColor = this.store.state.retained.sketch.backgroundColor;
        background.sendToBack();
        return background;
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
        item = new TextWarp(this.fallbackFont, textBlock.text, bounds, textBlock.fontSize, {
            fontSize: textBlock.fontSize,
            fillColor: textBlock.textColor || "red",
            backgroundColor: textBlock.backgroundColor
        });
        if (textBlock.fontDesc && textBlock.fontDesc.url) {
            // push in font when ready
            this.store.resources.parsedFonts.get(textBlock.fontDesc.url, function (url, font) { return item.font = font; });
        }
        if (!textBlock.outline && textBlock.position) {
            item.position = new paper.Point(textBlock.position);
        }
        var sendEditAction = function () {
            var editorAt = _this.project.view.projectToView(PaperHelpers.midpoint(item.bounds.topLeft, item.bounds.center));
            _this.store.actions.sketch.setEditingItem.dispatch({
                itemId: textBlock._id,
                itemType: "TextBlock",
                clientX: editorAt.x,
                clientY: editorAt.y
            });
        };
        item.on(PaperHelpers.EventType.clickWithoutDrag, function (ev) {
            item.bringToFront();
            if (item.selected) {
                sendEditAction();
            }
            else {
                // select item
                _this.store.actions.sketch.setSelection.dispatch({ itemId: textBlock._id, itemType: "TextBlock" });
            }
        });
        item.on(PaperHelpers.EventType.smartDragStart, function (ev) {
            item.bringToFront();
            if (!item.selected) {
                _this.store.actions.sketch.setSelection.dispatch({ itemId: textBlock._id, itemType: "TextBlock" });
            }
        });
        item.on(PaperHelpers.EventType.smartDragEnd, function (ev) {
            var block = _this.getBlockArrangement(item);
            block._id = textBlock._id;
            _this.store.actions.textBlock.updateArrange.dispatch(block);
        });
        var itemChange$ = PaperNotify.observe(item, PaperNotify.ChangeFlag.GEOMETRY);
        itemChange$
            .debounce(WorkspaceController.BLOCK_BOUNDS_CHANGE_THROTTLE_MS)
            .subscribe(function () {
            var block = _this.getBlockArrangement(item);
            block._id = textBlock._id;
            _this.store.actions.textBlock.updateArrange.dispatch(block);
        });
        item.data = textBlock._id;
        if (!textBlock.position) {
            item.position = this.project.view.bounds.point.add(new paper.Point(item.bounds.width / 2, item.bounds.height / 2)
                .add(50));
        }
        this._textBlockItems[textBlock._id] = item;
        if (!this.store.state.retained.sketch.loading
            && this.store.state.retained.sketch.textBlocks.length <= 1) {
            // open editor for newly added block
            sendEditAction();
        }
    };
    WorkspaceController.prototype.getBlockArrangement = function (item) {
        // export returns an array with item type and serialized object:
        //   ["Path", PathRecord]
        var top = item.upper.exportJSON({ asString: false })[1];
        var bottom = item.lower.exportJSON({ asString: false })[1];
        return {
            position: [item.position.x, item.position.y],
            outline: { top: top, bottom: bottom }
        };
    };
    WorkspaceController.TEXT_CHANGE_RENDER_THROTTLE_MS = 500;
    WorkspaceController.BLOCK_BOUNDS_CHANGE_THROTTLE_MS = 500;
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
        this.controlBoundsOpacity = 0.75;
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
        Rx.Observable.merge(this._upper.pathChanged.observe(), this._lower.pathChanged.observe())
            .debounce(DualBoundsPathWarp.UPDATE_DEBOUNCE)
            .subscribe(function (path) {
            _this.updateOutlineShape();
            _this.updateWarped();
            _this._changed(PaperNotify.ChangeFlag.GEOMETRY);
        });
        this.subscribe(function (flags) {
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
            return this._upper.path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DualBoundsPathWarp.prototype, "lower", {
        get: function () {
            return this._lower.path;
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
    Object.defineProperty(DualBoundsPathWarp.prototype, "controlBoundsOpacity", {
        set: function (value) {
            this._upper.opacity = this._lower.opacity = value;
        },
        enumerable: true,
        configurable: true
    });
    DualBoundsPathWarp.prototype.updateWarped = function () {
        var orthOrigin = this._source.bounds.topLeft;
        var orthWidth = this._source.bounds.width;
        var orthHeight = this._source.bounds.height;
        var projection = PaperHelpers.dualBoundsPathProjection(this._upper.path, this._lower.path);
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
        var lower = new paper.Path(this._lower.path.segments);
        lower.reverse();
        this._outline.segments = this._upper.path.segments.concat(lower.segments);
        lower.remove();
    };
    DualBoundsPathWarp.POINTS_PER_PATH = 200;
    DualBoundsPathWarp.UPDATE_DEBOUNCE = 150;
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
                _this._curveChangeUnsub();
                _this._segment = new paper.Segment(_this.center);
                var curveIdx = _this._curve.index;
                _this._curve.path.insert(curveIdx + 1, _this._segment);
                _this._curve = null;
                _this.styleAsSegment();
                _this.curveSplit.notify(curveIdx);
            }
        });
        this.on(PaperHelpers.EventType.smartDragMove, function (ev) {
            if (_this._segment) {
                _this._segment.point = _this.center;
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
        this._curveChangeUnsub = path.subscribe(function (flags) {
            if (_this._curve && !_this._segment
                && (flags & PaperNotify.ChangeFlag.SEGMENTS)) {
                _this.center = _this._curve.getPointAt(_this._curve.length * 0.5);
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
        _super.call(this);
        this._pathChanged = new ObservableEvent();
        this._path = new paper.Path(segments);
        this.addChild(this._path);
        if (style) {
            this._path.style = style;
        }
        else {
            this._path.strokeColor = "lightgray";
            this._path.strokeWidth = 6;
        }
        for (var _i = 0, _a = this._path.segments; _i < _a.length; _i++) {
            var s = _a[_i];
            this.addSegmentHandle(s);
        }
        for (var _b = 0, _c = this._path.curves; _b < _c.length; _b++) {
            var c = _c[_b];
            this.addCurveHandle(c);
        }
    }
    Object.defineProperty(StretchPath.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StretchPath.prototype, "pathChanged", {
        get: function () {
            return this._pathChanged;
        },
        enumerable: true,
        configurable: true
    });
    StretchPath.prototype.addSegmentHandle = function (segment) {
        this.addHandle(new PathHandle(segment));
    };
    StretchPath.prototype.addCurveHandle = function (curve) {
        var _this = this;
        var handle = new PathHandle(curve);
        handle.curveSplit.subscribeOne(function (curveIdx) {
            _this.addCurveHandle(_this._path.curves[curveIdx]);
            _this.addCurveHandle(_this._path.curves[curveIdx + 1]);
        });
        this.addHandle(handle);
    };
    StretchPath.prototype.addHandle = function (handle) {
        var _this = this;
        handle.visible = this.visible;
        handle.on(PaperHelpers.EventType.smartDragMove, function (ev) {
            _this._pathChanged.notify(_this._path);
        });
        handle.on(PaperHelpers.EventType.clickWithoutDrag, function (ev) {
            _this._pathChanged.notify(_this._path);
        });
        this.addChild(handle);
    };
    return StretchPath;
}(paper.Group));
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
    Object.defineProperty(TextWarp.prototype, "font", {
        set: function (value) {
            if (value !== this._font) {
                this._font = value;
                this.updateTextPath();
            }
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
        this._viewChanged = new ObservableEvent();
        this.project = project;
        var view = this.project.view;
        $(view.element).mousewheel(function (event) {
            var mousePosition = new paper.Point(event.offsetX, event.offsetY);
            _this.changeZoomCentered(event.deltaY, mousePosition);
        });
        var didDrag = false;
        view.on("mousedrag", function (ev) {
            if (!_this._viewCenterStart) {
                _this._viewCenterStart = view.center;
                // Have to use native mouse offset, because ev.delta 
                //  changes as the view is scrolled.
                _this._mouseNativeStart = new paper.Point(ev.event.offsetX, ev.event.offsetY);
                view.emit(PaperHelpers.EventType.smartDragStart, ev);
            }
            else {
                var nativeDelta = new paper.Point(ev.event.offsetX - _this._mouseNativeStart.x, ev.event.offsetY - _this._mouseNativeStart.y);
                // Move into view coordinates to subract delta,
                //  then back into project coords.
                view.center = view.viewToProject(view.projectToView(_this._viewCenterStart)
                    .subtract(nativeDelta));
                view.emit(PaperHelpers.EventType.smartDragMove, ev);
                didDrag = true;
            }
        });
        view.on("mouseup", function (ev) {
            if (_this._mouseNativeStart) {
                _this._mouseNativeStart = null;
                _this._viewCenterStart = null;
                view.emit(PaperHelpers.EventType.smartDragEnd, ev);
                if (didDrag) {
                    _this._viewChanged.notify(view.bounds);
                    didDrag = false;
                }
            }
        });
    }
    Object.defineProperty(ViewZoom.prototype, "viewChanged", {
        get: function () {
            return this._viewChanged;
        },
        enumerable: true,
        configurable: true
    });
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
    ViewZoom.prototype.zoomTo = function (rect) {
        var view = this.project.view;
        view.center = rect.center;
        view.zoom = Math.min(view.viewSize.height / rect.height, view.viewSize.width / rect.width);
        this._viewChanged.notify(view.bounds);
    };
    ViewZoom.prototype.changeZoomCentered = function (delta, mousePos) {
        if (!delta) {
            return;
        }
        var view = this.project.view;
        var oldZoom = view.zoom;
        var oldCenter = view.center;
        var viewPos = view.viewToProject(mousePos);
        var newZoom = delta > 0
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
        this._viewChanged.notify(view.bounds);
    };
    ;
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
    return ViewZoom;
}());
function bootstrap() {
    var store = new Store();
    var sketchEditor = new SketchEditor(document.getElementById('designer'), store);
    var selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), store);
    return new AppController(store, sketchEditor, selectedItemEditor);
}
var app = bootstrap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9fX2ZyYW1ld29yay9Eb21IZWxwZXJzLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL0ZvbnRIZWxwZXJzLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL0hlbHBlcnMudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL2NvbGxlY3Rpb25zLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL2V2ZW50cy50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJIZWxwZXJzLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL3BhcGVyL1BhcGVyTm90aWZ5LnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL3BhcGVyL3BhcGVyLWV4dC50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay9wb3N0YWwvVG9waWMudHMiLCIuLi9zcmMvX19mcmFtZXdvcmsvcG9zdGFsL3Bvc3RhbC1vYnNlcnZlLnRzIiwiLi4vc3JjL19fZnJhbWV3b3JrL3JlYWN0L1JlYWN0SGVscGVycy50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay92ZG9tL0NvbXBvbmVudC50cyIsIi4uL3NyYy9fX2ZyYW1ld29yay92ZG9tL1JlYWN0aXZlRG9tLnRzIiwiLi4vc3JjL19jb21tb24vQXBwQ29udHJvbGxlci50cyIsIi4uL3NyYy9fY29tbW9uL0NoYW5uZWxzLnRzIiwiLi4vc3JjL19jb21tb24vRm9udEZhbWlsaWVzTG9hZGVyLnRzIiwiLi4vc3JjL19jb21tb24vUGFyc2VkRm9udHMudHMiLCIuLi9zcmMvX2NvbW1vbi9TdG9yZS50cyIsIi4uL3NyYy9fY29tbW9uL2NvbnN0YW50cy50cyIsIi4uL3NyYy9fY29tbW9uL21vZGVsLWhlbHBlcnMudHMiLCIuLi9zcmMvX2NvbW1vbi9tb2RlbHMudHMiLCIuLi9zcmMvZGVzaWduZXIvQ29sb3JQaWNrZXIudHMiLCIuLi9zcmMvZGVzaWduZXIvRG9jdW1lbnRLZXlIYW5kbGVyLnRzIiwiLi4vc3JjL2Rlc2lnbmVyL0ZvbnRQaWNrZXIudHMiLCIuLi9zcmMvZGVzaWduZXIvU2VsZWN0ZWRJdGVtRWRpdG9yLnRzIiwiLi4vc3JjL2Rlc2lnbmVyL1NrZXRjaEVkaXRvci50cyIsIi4uL3NyYy9kZXNpZ25lci9UZXh0QmxvY2tFZGl0b3IudHMiLCIuLi9zcmMvZGVzaWduZXIvV29ya3NwYWNlQ29udHJvbGxlci50cyIsIi4uL3NyYy9tYXRoL1BlcnNwZWN0aXZlVHJhbnNmb3JtLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9EdWFsQm91bmRzUGF0aFdhcnAudHMiLCIuLi9zcmMvd29ya3NwYWNlL1BhdGhIYW5kbGUudHMiLCIuLi9zcmMvd29ya3NwYWNlL1BhdGhTZWN0aW9uLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9QYXRoVHJhbnNmb3JtLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9TdHJldGNoUGF0aC50cyIsIi4uL3NyYy93b3Jrc3BhY2UvVGV4dFJ1bGVyLnRzIiwiLi4vc3JjL3dvcmtzcGFjZS9UZXh0V2FycC50cyIsIi4uL3NyYy93b3Jrc3BhY2UvVmlld1pvb20udHMiLCIuLi9zcmMvd29ya3NwYWNlL2ludGVyZmFjZXMudHMiLCIuLi9zcmMvel9hcHAvYm9vdHN0cmFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsSUFBVSxVQUFVLENBbUhuQjtBQW5IRCxXQUFVLFVBQVUsRUFBQyxDQUFDO0lBRWxCLHNEQUFzRDtJQUN0RCxzQkFBNkIsT0FBZSxFQUFFLFFBQWdCO1FBQzFELElBQUksSUFBSSxHQUFRLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztRQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztRQUN0QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBVGUsdUJBQVksZUFTM0IsQ0FBQTtJQUVZLG1CQUFRLEdBQUc7UUFDcEIsU0FBUyxFQUFhLENBQUM7UUFDdkIsR0FBRyxFQUFtQixDQUFDO1FBQ3ZCLEtBQUssRUFBaUIsRUFBRTtRQUN4QixLQUFLLEVBQWlCLEVBQUU7UUFDeEIsSUFBSSxFQUFrQixFQUFFO1FBQ3hCLEdBQUcsRUFBbUIsRUFBRTtRQUN4QixVQUFVLEVBQVksRUFBRTtRQUN4QixRQUFRLEVBQWMsRUFBRTtRQUN4QixHQUFHLEVBQW1CLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLFFBQVEsRUFBYyxFQUFFO1FBQ3hCLEdBQUcsRUFBbUIsRUFBRTtRQUN4QixJQUFJLEVBQWtCLEVBQUU7UUFDeEIsU0FBUyxFQUFhLEVBQUU7UUFDeEIsT0FBTyxFQUFlLEVBQUU7UUFDeEIsVUFBVSxFQUFZLEVBQUU7UUFDeEIsU0FBUyxFQUFhLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixVQUFVLEVBQVksRUFBRTtRQUN4QixXQUFXLEVBQVcsRUFBRTtRQUN4QixTQUFTLEVBQWEsRUFBRTtRQUN4QixPQUFPLEVBQWUsRUFBRTtRQUN4QixPQUFPLEVBQWUsRUFBRTtRQUN4QixPQUFPLEVBQWUsRUFBRTtRQUN4QixPQUFPLEVBQWUsRUFBRTtRQUN4QixPQUFPLEVBQWUsR0FBRztRQUN6QixPQUFPLEVBQWUsR0FBRztRQUN6QixPQUFPLEVBQWUsR0FBRztRQUN6QixPQUFPLEVBQWUsR0FBRztRQUN6QixPQUFPLEVBQWUsR0FBRztRQUN6QixPQUFPLEVBQWUsR0FBRztRQUN6QixRQUFRLEVBQWMsR0FBRztRQUN6QixHQUFHLEVBQW1CLEdBQUc7UUFDekIsUUFBUSxFQUFjLEdBQUc7UUFDekIsWUFBWSxFQUFVLEdBQUc7UUFDekIsTUFBTSxFQUFn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QUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2xFLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9FLENBQUM7UUFFRCxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLENBQUMsQ0FBQyxD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LENBQUM7SUFFbkcsTUFBTSxDQUFDLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUV0RSxDQUFDO0FBRUQsSUFBTSxHQUFHLEdBQUcsU0FBUyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxubmFtZXNwYWNlIERvbUhlbHBlcnMge1xyXG4gICAgXHJcbiAgICAvLyAgaHR0cHM6Ly9zdXBwb3J0Lm1vemlsbGEub3JnL2VuLVVTL3F1ZXN0aW9ucy85Njg5OTJcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkb3dubG9hZEZpbGUoZGF0YVVybDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nKXtcclxuICAgICAgICB2YXIgbGluayA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgbGluay5pZCA9IG5ld2lkKCk7XHJcbiAgICAgICAgbGluay5kb3dubG9hZCA9IGZpbGVuYW1lO1xyXG4gICAgICAgIGxpbmsuaHJlZiA9IGRhdGFVcmw7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgICAgICBsaW5rLnRhcmdldCA9IFwiX3NlbGZcIjtcclxuICAgICAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgS2V5Q29kZXMgPSB7XHJcbiAgICAgICAgQmFja1NwYWNlICAgICAgICAgICA6IDggICxcclxuICAgICAgICBUYWIgICAgICAgICAgICAgICAgIDogOSAgLFxyXG4gICAgICAgIEVudGVyICAgICAgICAgICAgICAgOiAxMyAsXHJcbiAgICAgICAgU2hpZnQgICAgICAgICAgICAgICA6IDE2ICxcclxuICAgICAgICBDdHJsICAgICAgICAgICAgICAgIDogMTcgLFxyXG4gICAgICAgIEFsdCAgICAgICAgICAgICAgICAgOiAxOCAsXHJcbiAgICAgICAgUGF1c2VCcmVhayAgICAgICAgICA6IDE5ICxcclxuICAgICAgICBDYXBzTG9jayAgICAgICAgICAgIDogMjAgLFxyXG4gICAgICAgIEVzYyAgICAgICAgICAgICAgICAgOiAyNyAsXHJcbiAgICAgICAgUGFnZVVwICAgICAgICAgICAgICA6IDMzICxcclxuICAgICAgICBQYWdlRG93biAgICAgICAgICAgIDogMzQgLFxyXG4gICAgICAgIEVuZCAgICAgICAgICAgICAgICAgOiAzNSAsXHJcbiAgICAgICAgSG9tZSAgICAgICAgICAgICAgICA6IDM2ICxcclxuICAgICAgICBBcnJvd0xlZnQgICAgICAgICAgIDogMzcgLFxyXG4gICAgICAgIEFycm93VXAgICAgICAgICAgICAgOiAzOCAsXHJcbiAgICAgICAgQXJyb3dSaWdodCAgICAgICAgICA6IDM5ICxcclxuICAgICAgICBBcnJvd0Rvd24gICAgICAgICAgIDogNDAgLFxyXG4gICAgICAgIEluc2VydCAgICAgICAgICAgICAgOiA0NSAsXHJcbiAgICAgICAgRGVsZXRlICAgICAgICAgICAgICA6IDQ2ICxcclxuICAgICAgICBEaWdpdDAgICAgICAgICAgICAgIDogNDggLFxyXG4gICAgICAgIERpZ2l0MSAgICAgICAgICAgICAgOiA0OSAsXHJcbiAgICAgICAgRGlnaXQyICAgICAgICAgICAgICA6IDUwICxcclxuICAgICAgICBEaWdpdDMgICAgICAgICAgICAgIDogNTEgLFxyXG4gICAgICAgIERpZ2l0NCAgICAgICAgICAgICAgOiA1MiAsXHJcbiAgICAgICAgRGlnaXQ1ICAgICAgICAgICAgICA6IDUzICxcclxuICAgICAgICBEaWdpdDYgICAgICAgICAgICAgIDogNTQgLFxyXG4gICAgICAgIERpZ2l0NyAgICAgICAgICAgICAgOiA1NSAsXHJcbiAgICAgICAgRGlnaXQ4ICAgICAgICAgICAgICA6IDU2ICxcclxuICAgICAgICBEaWdpdDkgICAgICAgICAgICAgIDogNTcgLFxyXG4gICAgICAgIEEgICAgICAgICAgICAgICAgICAgOiA2NSAsXHJcbiAgICAgICAgQiAgICAgICAgICAgICAgICAgICA6IDY2ICxcclxuICAgICAgICBDICAgICAgICAgICAgICAgICAgIDogNjcgLFxyXG4gICAgICAgIEQgICAgICAgICAgICAgICAgICAgOiA2OCAsXHJcbiAgICAgICAgRSAgICAgICAgICAgICAgICAgICA6IDY5ICxcclxuICAgICAgICBGICAgICAgICAgICAgICAgICAgIDogNzAgLFxyXG4gICAgICAgIEcgICAgICAgICAgICAgICAgICAgOiA3MSAsXHJcbiAgICAgICAgSCAgICAgICAgICAgICAgICAgICA6IDcyICxcclxuICAgICAgICBJICAgICAgICAgICAgICAgICAgIDogNzMgLFxyXG4gICAgICAgIEogICAgICAgICAgICAgICAgICAgOiA3NCAsXHJcbiAgICAgICAgSyAgICAgICAgICAgICAgICAgICA6IDc1ICxcclxuICAgICAgICBMICAgICAgICAgICAgICAgICAgIDogNzYgLFxyXG4gICAgICAgIE0gICAgICAgICAgICAgICAgICAgOiA3NyAsXHJcbiAgICAgICAgTiAgICAgICAgICAgICAgICAgICA6IDc4ICxcclxuICAgICAgICBPICAgICAgICAgICAgICAgICAgIDogNzkgLFxyXG4gICAgICAgIFAgICAgICAgICAgICAgICAgICAgOiA4MCAsXHJcbiAgICAgICAgUSAgICAgICAgICAgICAgICAgICA6IDgxICxcclxuICAgICAgICBSICAgICAgICAgICAgICAgICAgIDogODIgLFxyXG4gICAgICAgIFMgICAgICAgICAgICAgICAgICAgOiA4MyAsXHJcbiAgICAgICAgVCAgICAgICAgICAgICAgICAgICA6IDg0ICxcclxuICAgICAgICBVICAgICAgICAgICAgICAgICAgIDogODUgLFxyXG4gICAgICAgIFYgICAgICAgICAgICAgICAgICAgOiA4NiAsXHJcbiAgICAgICAgVyAgICAgICAgICAgICAgICAgICA6IDg3ICxcclxuICAgICAgICBYICAgICAgICAgICAgICAgICAgIDogODggLFxyXG4gICAgICAgIFkgICAgICAgICAgICAgICAgICAgOiA4OSAsXHJcbiAgICAgICAgWiAgICAgICAgICAgICAgICAgICA6IDkwICxcclxuICAgICAgICBXaW5kb3dMZWZ0ICAgICAgICAgIDogOTEgLFxyXG4gICAgICAgIFdpbmRvd1JpZ2h0ICAgICAgICAgOiA5MiAsXHJcbiAgICAgICAgU2VsZWN0S2V5ICAgICAgICAgICA6IDkzICxcclxuICAgICAgICBOdW1wYWQwICAgICAgICAgICAgIDogOTYgLFxyXG4gICAgICAgIE51bXBhZDEgICAgICAgICAgICAgOiA5NyAsXHJcbiAgICAgICAgTnVtcGFkMiAgICAgICAgICAgICA6IDk4ICxcclxuICAgICAgICBOdW1wYWQzICAgICAgICAgICAgIDogOTkgLFxyXG4gICAgICAgIE51bXBhZDQgICAgICAgICAgICAgOiAxMDAsXHJcbiAgICAgICAgTnVtcGFkNSAgICAgICAgICAgICA6IDEwMSxcclxuICAgICAgICBOdW1wYWQ2ICAgICAgICAgICAgIDogMTAyLFxyXG4gICAgICAgIE51bXBhZDcgICAgICAgICAgICAgOiAxMDMsIFxyXG4gICAgICAgIE51bXBhZDggICAgICAgICAgICAgOiAxMDQsXHJcbiAgICAgICAgTnVtcGFkOSAgICAgICAgICAgICA6IDEwNSxcclxuICAgICAgICBNdWx0aXBseSAgICAgICAgICAgIDogMTA2LFxyXG4gICAgICAgIEFkZCAgICAgICAgICAgICAgICAgOiAxMDcsXHJcbiAgICAgICAgU3VidHJhY3QgICAgICAgICAgICA6IDEwOSxcclxuICAgICAgICBEZWNpbWFsUG9pbnQgICAgICAgIDogMTEwLFxyXG4gICAgICAgIERpdmlkZSAgICAgICAgICAgICAgOiAxMTEsXHJcbiAgICAgICAgRjEgICAgICAgICAgICAgICAgICA6IDExMixcclxuICAgICAgICBGMiAgICAgICAgICAgICAgICAgIDogMTEzLFxyXG4gICAgICAgIEYzICAgICAgICAgICAgICAgICAgOiAxMTQsXHJcbiAgICAgICAgRjQgICAgICAgICAgICAgICAgICA6IDExNSxcclxuICAgICAgICBGNSAgICAgICAgICAgICAgICAgIDogMTE2LFxyXG4gICAgICAgIEY2ICAgICAgICAgICAgICAgICAgOiAxMTcsXHJcbiAgICAgICAgRjcgICAgICAgICAgICAgICAgICA6IDExOCxcclxuICAgICAgICBGOCAgICAgICAgICAgICAgICAgIDogMTE5LFxyXG4gICAgICAgIEY5ICAgICAgICAgICAgICAgICAgOiAxMjAsXHJcbiAgICAgICAgRjEwICAgICAgICAgICAgICAgICA6IDEyMSxcclxuICAgICAgICBGMTEgICAgICAgICAgICAgICAgIDogMTIyLFxyXG4gICAgICAgIEYxMiAgICAgICAgICAgICAgICAgOiAxMjMsXHJcbiAgICAgICAgTnVtTG9jayAgICAgICAgICAgICA6IDE0NCxcclxuICAgICAgICBTY3JvbGxMb2NrICAgICAgICAgIDogMTQ1LFxyXG4gICAgICAgIFNlbWlDb2xvbiAgICAgICAgICAgOiAxODYsXHJcbiAgICAgICAgRXF1YWwgICAgICAgICAgICAgICA6IDE4NyxcclxuICAgICAgICBDb21tYSAgICAgICAgICAgICAgIDogMTg4LFxyXG4gICAgICAgIERhc2ggICAgICAgICAgICAgICAgOiAxODksXHJcbiAgICAgICAgUGVyaW9kICAgICAgICAgICAgICA6IDE5MCxcclxuICAgICAgICBGb3J3YXJkU2xhc2ggICAgICAgIDogMTkxLFxyXG4gICAgICAgIEdyYXZlQWNjZW50ICAgICAgICAgOiAxOTIsXHJcbiAgICAgICAgQnJhY2tldE9wZW4gICAgICAgICA6IDIxOSxcclxuICAgICAgICBCYWNrU2xhc2ggICAgICAgICAgIDogMjIwLFxyXG4gICAgICAgIEJyYWNrZXRDbG9zZSAgICAgICAgOiAyMjEsXHJcbiAgICAgICAgU2luZ2xlUXVvdGUgICAgICAgICA6IDIyMiBcclxuICAgIH07XHJcbiAgICBcclxufSIsIlxyXG5uYW1lc3BhY2UgRm9udEhlbHBlcnMge1xyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFZhcmlhbnRTdHlsZSB7XHJcbiAgICAgICAgZm9udEZhbWlseT86IHN0cmluZztcclxuICAgICAgICBmb250V2VpZ2h0Pzogc3RyaW5nO1xyXG4gICAgICAgIGZvbnRTdHlsZT86IHN0cmluZzsgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q3NzU3R5bGUoZmFtaWx5OiBzdHJpbmcsIHZhcmlhbnQ6IHN0cmluZyl7XHJcbiAgICAgICAgbGV0IHN0eWxlID0gPFZhcmlhbnRTdHlsZT57IGZvbnRGYW1pbHk6IGZhbWlseSB9O1xyXG4gICAgICAgIGlmKHZhcmlhbnQuaW5kZXhPZihcIml0YWxpY1wiKSA+PSAwKXtcclxuICAgICAgICAgICAgc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG51bWVyaWMgPSB2YXJpYW50LnJlcGxhY2UoL1teXFxkXS9nLCBcIlwiKTtcclxuICAgICAgICBpZihudW1lcmljLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHN0eWxlLmZvbnRXZWlnaHQgPSBudW1lcmljLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHlsZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldERlc2NyaXB0aW9uKGZhbWlseTogRm9udEZhbWlseSwgdmFyaWFudD86IHN0cmluZyk6IEZvbnREZXNjcmlwdGlvbiB7XHJcbiAgICAgICAgbGV0IHVybDogc3RyaW5nO1xyXG4gICAgICAgIHVybCA9IGZhbWlseS5maWxlc1t2YXJpYW50IHx8IFwicmVndWxhclwiXTtcclxuICAgICAgICBpZighdXJsKXtcclxuICAgICAgICAgICAgdXJsID0gZmFtaWx5LmZpbGVzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmYW1pbHk6IGZhbWlseS5mYW1pbHksXHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBmYW1pbHkuY2F0ZWdvcnksXHJcbiAgICAgICAgICAgIHZhcmlhbnQ6IHZhcmlhbnQsXHJcbiAgICAgICAgICAgIHVybFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiXHJcbmZ1bmN0aW9uIGxvZ3RhcDxUPihtZXNzYWdlOiBzdHJpbmcsIHN0cmVhbTogUnguT2JzZXJ2YWJsZTxUPik6IFJ4Lk9ic2VydmFibGU8VD57XHJcbiAgICByZXR1cm4gc3RyZWFtLnRhcCh0ID0+IGNvbnNvbGUubG9nKG1lc3NhZ2UsIHQpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbmV3aWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAobmV3IERhdGUoKS5nZXRUaW1lKCkrTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMzYpO1xyXG59XHJcbiIsIlxyXG5uYW1lc3BhY2UgVHlwZWRDaGFubmVsIHtcclxuXHJcbiAgICAvLyAtLS0gQ29yZSB0eXBlcyAtLS1cclxuXHJcbiAgICB0eXBlIFNlcmlhbGl6YWJsZSA9IE9iamVjdCB8IEFycmF5PGFueT4gfCBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuIHwgRGF0ZSB8IHZvaWQ7XHJcblxyXG4gICAgdHlwZSBWYWx1ZSA9IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBEYXRlO1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZTxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4ge1xyXG4gICAgICAgIHR5cGU6IHN0cmluZztcclxuICAgICAgICBkYXRhPzogVERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZSBJU3ViamVjdDxUPiA9IFJ4Lk9ic2VydmVyPFQ+ICYgUnguT2JzZXJ2YWJsZTxUPjtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbFRvcGljPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIGNoYW5uZWw6IElTdWJqZWN0PE1lc3NhZ2U8VERhdGE+PjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY2hhbm5lbDogSVN1YmplY3Q8TWVzc2FnZTxURGF0YT4+LCB0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YnNjcmliZShvYnNlcnZlcjogKG1lc3NhZ2U6IE1lc3NhZ2U8VERhdGE+KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgpLnN1YnNjcmliZShvYnNlcnZlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXNwYXRjaChkYXRhPzogVERhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsLm9uTmV4dCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBfLmNsb25lKGRhdGEpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JzZXJ2ZSgpOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGE+PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuZmlsdGVyKG0gPT4gbS50eXBlID09PSB0aGlzLnR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3J3YXJkKGNoYW5uZWw6IENoYW5uZWxUb3BpYzxURGF0YT4pIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmUobSA9PiBjaGFubmVsLmRpc3BhdGNoKG0uZGF0YSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbCB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgc3ViamVjdDogSVN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGU+PjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3ViamVjdD86IElTdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4sIHR5cGU/OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJqZWN0ID0gc3ViamVjdCB8fCBuZXcgUnguU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+KCk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWJzY3JpYmUob25OZXh0PzogKHZhbHVlOiBNZXNzYWdlPFNlcmlhbGl6YWJsZT4pID0+IHZvaWQpOiBSeC5JRGlzcG9zYWJsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3Quc3Vic2NyaWJlKG9uTmV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b3BpYzxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4odHlwZTogc3RyaW5nKSA6IENoYW5uZWxUb3BpYzxURGF0YT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENoYW5uZWxUb3BpYzxURGF0YT4odGhpcy5zdWJqZWN0IGFzIElTdWJqZWN0PE1lc3NhZ2U8VERhdGE+PixcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA/IHRoaXMudHlwZSArICcuJyArIHR5cGUgOiB0eXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVyZ2VUeXBlZDxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4oLi4udG9waWNzOiBDaGFubmVsVG9waWM8VERhdGE+W10pIFxyXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+IHtcclxuICAgICAgICAgICAgY29uc3QgdHlwZXMgPSB0b3BpY3MubWFwKHQgPT4gdC50eXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5maWx0ZXIobSA9PiB0eXBlcy5pbmRleE9mKG0udHlwZSkgPj0gMCApIGFzIFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBtZXJnZSguLi50b3BpY3M6IENoYW5uZWxUb3BpYzxTZXJpYWxpemFibGU+W10pIFxyXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxTZXJpYWxpemFibGU+PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdG9waWNzLm1hcCh0ID0+IHQudHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuZmlsdGVyKG0gPT4gdHlwZXMuaW5kZXhPZihtLnR5cGUpID49IDAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIlxyXG50eXBlIERpY3Rpb25hcnk8VD4gPSBfLkRpY3Rpb25hcnk8VD47XHJcbiIsIlxyXG5jbGFzcyBPYnNlcnZhYmxlRXZlbnQ8VD4ge1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9zdWJzY3JpYmVyczogKChldmVudEFyZzogVCkgPT4gdm9pZClbXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGZvciBub3RpZmljYXRpb24uIFJldHVybnMgdW5zdWJzY3JpYmUgZnVuY3Rpb24uXHJcbiAgICAgKi8gICAgXHJcbiAgICBzdWJzY3JpYmUoaGFuZGxlcjogKGV2ZW50QXJnOiBUKSA9PiB2b2lkKTogKCgpID0+IHZvaWQpIHtcclxuICAgICAgICBpZih0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGhhbmRsZXIpIDwgMCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnB1c2goaGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoKSA9PiB0aGlzLnVuc3Vic2NyaWJlKGhhbmRsZXIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1bnN1YnNjcmliZShjYWxsYmFjazogKGV2ZW50QXJnOiBUKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihjYWxsYmFjaywgMCk7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgb2JzZXJ2ZSgpOiBSeC5PYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBsZXQgdW5zdWI6IGFueTtcclxuICAgICAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuPFQ+KFxyXG4gICAgICAgICAgICAoaGFuZGxlclRvQWRkKSA9PiB0aGlzLnN1YnNjcmliZSg8KGV2ZW50QXJnOiBUKSA9PiB2b2lkPmhhbmRsZXJUb0FkZCksXHJcbiAgICAgICAgICAgIChoYW5kbGVyVG9SZW1vdmUpID0+IHRoaXMudW5zdWJzY3JpYmUoPChldmVudEFyZzogVCkgPT4gdm9pZD5oYW5kbGVyVG9SZW1vdmUpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJzY3JpYmUgZm9yIG9uZSBub3RpZmljYXRpb24uXHJcbiAgICAgKi9cclxuICAgIHN1YnNjcmliZU9uZShjYWxsYmFjazogKGV2ZW50QXJnOiBUKSA9PiB2b2lkKXtcclxuICAgICAgICBsZXQgdW5zdWIgPSB0aGlzLnN1YnNjcmliZSh0ID0+IHtcclxuICAgICAgICAgICAgdW5zdWIoKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sodCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG5vdGlmeShldmVudEFyZzogVCl7XHJcbiAgICAgICAgZm9yKGxldCBzdWJzY3JpYmVyIG9mIHRoaXMuX3N1YnNjcmliZXJzKXtcclxuICAgICAgICAgICAgc3Vic2NyaWJlci5jYWxsKHRoaXMsIGV2ZW50QXJnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbGwgc3Vic2NyaWJlcnMuXHJcbiAgICAgKi9cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbn0iLCJcclxubmFtZXNwYWNlIEJvb3RTY3JpcHQge1xyXG5cclxuICAgIGludGVyZmFjZSBNZW51SXRlbSB7XHJcbiAgICAgICAgY29udGVudDogYW55LFxyXG4gICAgICAgIG9wdGlvbnM/OiBPYmplY3RcclxuICAgICAgICAvL29uQ2xpY2s/OiAoKSA9PiB2b2lkXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRyb3Bkb3duKFxyXG4gICAgICAgIGFyZ3M6IHtcclxuICAgICAgICAgICAgaWQ6IHN0cmluZyxcclxuICAgICAgICAgICAgY29udGVudDogYW55LFxyXG4gICAgICAgICAgICBpdGVtczogTWVudUl0ZW1bXVxyXG4gICAgICAgIH0pOiBWTm9kZSB7XHJcblxyXG4gICAgICAgIHJldHVybiBoKFwiZGl2LmRyb3Bkb3duXCIsIFtcclxuICAgICAgICAgICAgaChcImJ1dHRvbi5idG4uYnRuLWRlZmF1bHQuZHJvcGRvd24tdG9nZ2xlXCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJhdHRyc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBhcmdzLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtdG9nZ2xlXCI6IFwiZHJvcGRvd25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MuY29udGVudCxcclxuICAgICAgICAgICAgICAgICAgICBoKFwic3Bhbi5jYXJldFwiKVxyXG4gICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgIGgoXCJ1bC5kcm9wZG93bi1tZW51XCIsXHJcbiAgICAgICAgICAgICAgICB7fSxcclxuICAgICAgICAgICAgICAgIGFyZ3MuaXRlbXMubWFwKGl0ZW0gPT5cclxuICAgICAgICAgICAgICAgICAgICBoKFwibGlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKCdhJywgaXRlbS5vcHRpb25zIHx8IHt9LCBbaXRlbS5jb250ZW50XSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgIH1cclxufVxyXG4iLCJcclxuaW50ZXJmYWNlIENvbnNvbGUge1xyXG4gICAgbG9nKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSk6IHZvaWQ7XHJcbiAgICBsb2coLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZDtcclxufVxyXG5cclxubmFtZXNwYWNlIFBhcGVySGVscGVycyB7XHJcblxyXG4gICAgZXhwb3J0IHZhciBzaG91bGRMb2dJbmZvOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0IGxvZyA9IGZ1bmN0aW9uKC4uLnBhcmFtczogYW55W10pIHtcclxuICAgICAgICBpZiAoc2hvdWxkTG9nSW5mbykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyguLi5wYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgaW1wb3J0T3BlblR5cGVQYXRoID0gZnVuY3Rpb24ob3BlblBhdGg6IG9wZW50eXBlLlBhdGgpOiBwYXBlci5Db21wb3VuZFBhdGgge1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKG9wZW5QYXRoLnRvUGF0aERhdGEoKSk7XHJcblxyXG4gICAgICAgIC8vIGxldCBzdmcgPSBvcGVuUGF0aC50b1NWRyg0KTtcclxuICAgICAgICAvLyByZXR1cm4gPHBhcGVyLlBhdGg+cGFwZXIucHJvamVjdC5pbXBvcnRTVkcoc3ZnKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgdHJhY2VQYXRoSXRlbSA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGhJdGVtLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5QYXRoSXRlbSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlQ29tcG91bmRQYXRoID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5Db21wb3VuZFBhdGgge1xyXG4gICAgICAgIGlmICghcGF0aC5jaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwYXRocyA9IHBhdGguY2hpbGRyZW4ubWFwKHAgPT5cclxuICAgICAgICAgICAgdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cCwgcG9pbnRzUGVyUGF0aCkpO1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHtcclxuICAgICAgICAgICAgY2hpbGRyZW46IHBhdGhzLFxyXG4gICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgdHJhY2VQYXRoQXNQb2ludHMgPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoLCBudW1Qb2ludHM6IG51bWJlcik6IHBhcGVyLlBvaW50W10ge1xyXG4gICAgICAgIGxldCBwYXRoTGVuZ3RoID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG9mZnNldEluY3IgPSBwYXRoTGVuZ3RoIC8gbnVtUG9pbnRzO1xyXG4gICAgICAgIGxldCBwb2ludHMgPSBbXTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDA7XHJcblxyXG4gICAgICAgIHdoaWxlIChpKysgPCBudW1Qb2ludHMpIHtcclxuICAgICAgICAgICAgbGV0IHBvaW50ID0gcGF0aC5nZXRQb2ludEF0KE1hdGgubWluKG9mZnNldCwgcGF0aExlbmd0aCkpO1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChwb2ludCk7XHJcbiAgICAgICAgICAgIG9mZnNldCArPSBvZmZzZXRJbmNyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBvaW50cztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgdHJhY2VQYXRoID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICBsZXQgcG9pbnRzID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEFzUG9pbnRzKHBhdGgsIG51bVBvaW50cyk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5QYXRoKHtcclxuICAgICAgICAgICAgc2VnbWVudHM6IHBvaW50cyxcclxuICAgICAgICAgICAgY2xvc2VkOiB0cnVlLFxyXG4gICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IGR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbiA9IGZ1bmN0aW9uKHRvcFBhdGg6IHBhcGVyLkN1cnZlbGlrZSwgYm90dG9tUGF0aDogcGFwZXIuQ3VydmVsaWtlKVxyXG4gICAgICAgIDogKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBjb25zdCB0b3BQYXRoTGVuZ3RoID0gdG9wUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgYm90dG9tUGF0aExlbmd0aCA9IGJvdHRvbVBhdGgubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbih1bml0UG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgICAgICBsZXQgdG9wUG9pbnQgPSB0b3BQYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiB0b3BQYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICAgbGV0IGJvdHRvbVBvaW50ID0gYm90dG9tUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogYm90dG9tUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGlmICh0b3BQb2ludCA9PSBudWxsIHx8IGJvdHRvbVBvaW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiY291bGQgbm90IGdldCBwcm9qZWN0ZWQgcG9pbnQgZm9yIHVuaXQgcG9pbnQgXCIgKyB1bml0UG9pbnQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdG9wUG9pbnQuYWRkKGJvdHRvbVBvaW50LnN1YnRyYWN0KHRvcFBvaW50KS5tdWx0aXBseSh1bml0UG9pbnQueSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG1hcmtlckdyb3VwOiBwYXBlci5Hcm91cDtcclxuXHJcbiAgICBleHBvcnQgY29uc3QgcmVzZXRNYXJrZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKFBhcGVySGVscGVycy5tYXJrZXJHcm91cCkge1xyXG4gICAgICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcmtlckdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgbWFya2VyR3JvdXAub3BhY2l0eSA9IDAuMjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IG1hcmtlckxpbmUgPSBmdW5jdGlvbihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICBsZXQgbGluZSA9IHBhcGVyLlBhdGguTGluZShhLCBiKTtcclxuICAgICAgICBsaW5lLnN0cm9rZUNvbG9yID0gJ2dyZWVuJztcclxuICAgICAgICAvL2xpbmUuZGFzaEFycmF5ID0gWzUsIDVdO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChsaW5lKTtcclxuICAgICAgICByZXR1cm4gbGluZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgbWFya2VyID0gZnVuY3Rpb24ocG9pbnQ6IHBhcGVyLlBvaW50LCBsYWJlbDogc3RyaW5nKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgLy9sZXQgbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvaW50LCAxMCk7XHJcbiAgICAgICAgbGV0IG1hcmtlciA9IG5ldyBwYXBlci5Qb2ludFRleHQocG9pbnQpO1xyXG4gICAgICAgIG1hcmtlci5mb250U2l6ZSA9IDM2O1xyXG4gICAgICAgIG1hcmtlci5jb250ZW50ID0gbGFiZWw7XHJcbiAgICAgICAgbWFya2VyLnN0cm9rZUNvbG9yID0gXCJyZWRcIjtcclxuICAgICAgICBtYXJrZXIuYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgLy9QYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobWFya2VyKTtcclxuICAgICAgICByZXR1cm4gbWFya2VyO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBzaW1wbGlmeSA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGhJdGVtLCB0b2xlcmFuY2U/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNpbXBsaWZ5KDxwYXBlci5QYXRoSXRlbT5wLCB0b2xlcmFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKDxwYXBlci5QYXRoPnBhdGgpLnNpbXBsaWZ5KHRvbGVyYW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluZCBzZWxmIG9yIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgZmluZFNlbGZPckFuY2VzdG9yID0gZnVuY3Rpb24oaXRlbTogcGFwZXIuSXRlbSwgcHJlZGljYXRlOiAoaTogcGFwZXIuSXRlbSkgPT4gYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUoaXRlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQYXBlckhlbHBlcnMuZmluZEFuY2VzdG9yKGl0ZW0sIHByZWRpY2F0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgZmluZEFuY2VzdG9yID0gZnVuY3Rpb24oaXRlbTogcGFwZXIuSXRlbSwgcHJlZGljYXRlOiAoaTogcGFwZXIuSXRlbSkgPT4gYm9vbGVhbikge1xyXG4gICAgICAgIGlmICghaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHByaW9yOiBwYXBlci5JdGVtO1xyXG4gICAgICAgIGxldCBjaGVja2luZyA9IGl0ZW0ucGFyZW50O1xyXG4gICAgICAgIHdoaWxlIChjaGVja2luZyAmJiBjaGVja2luZyAhPT0gcHJpb3IpIHtcclxuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShjaGVja2luZykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjaGVja2luZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmlvciA9IGNoZWNraW5nO1xyXG4gICAgICAgICAgICBjaGVja2luZyA9IGNoZWNraW5nLnBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgY29ybmVycyBvZiB0aGUgcmVjdCwgY2xvY2t3aXNlIHN0YXJ0aW5nIGZyb20gdG9wTGVmdFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgY29ybmVycyA9IGZ1bmN0aW9uKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSk6IHBhcGVyLlBvaW50W10ge1xyXG4gICAgICAgIHJldHVybiBbcmVjdC50b3BMZWZ0LCByZWN0LnRvcFJpZ2h0LCByZWN0LmJvdHRvbVJpZ2h0LCByZWN0LmJvdHRvbUxlZnRdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdGhlIG1pZHBvaW50IGJldHdlZW4gdHdvIHBvaW50c1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgbWlkcG9pbnQgPSBmdW5jdGlvbihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICByZXR1cm4gYi5zdWJ0cmFjdChhKS5kaXZpZGUoMikuYWRkKGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBjbG9uZVNlZ21lbnQgPSBmdW5jdGlvbihzZWdtZW50OiBwYXBlci5TZWdtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KHNlZ21lbnQucG9pbnQsIHNlZ21lbnQuaGFuZGxlSW4sIHNlZ21lbnQuaGFuZGxlT3V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1ha2UgYW4gaXRlbSBkcmFnZ2FibGUsIGFkZGluZyByZWxhdGVkIGV2ZW50cy5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGFkZFNtYXJ0RHJhZyA9IGZ1bmN0aW9uKGl0ZW06IHBhcGVyLkl0ZW0pIHtcclxuICAgICAgICBpdGVtLmlzU21hcnREcmFnZ2FibGUgPSB0cnVlO1xyXG5cclxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgbG9nKFwic21hcnREcmFnLm9uTW91c2VEcmFnXCIsIGl0ZW0sIGV2KTtcclxuICAgICAgICAgICAgaWYgKGV2LnNtYXJ0RHJhZ0l0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIldpbGwgbm90IGFzc2lnbiBzbWFydERyYWdJdGVtOiB2YWx1ZSB3YXMgYWxyZWFkeSBcIiArIGV2LnNtYXJ0RHJhZ0l0ZW0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXYuc21hcnREcmFnSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghaXRlbS5pc1NtYXJ0RHJhZ2dpbmcpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uaXNTbWFydERyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxvZyhcImVtaXR0aW5nIHNtYXJ0RHJhZy5zbWFydERyYWdTdGFydFwiKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZW1pdChFdmVudFR5cGUuc21hcnREcmFnU3RhcnQsIGV2KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXRlbS5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb24uYWRkKGV2LmRlbHRhKTtcclxuXHJcbiAgICAgICAgICAgIGxvZyhcImVtaXR0aW5nIHNtYXJ0RHJhZy5zbWFydERyYWdNb3ZlXCIpO1xyXG4gICAgICAgICAgICBpdGVtLmVtaXQoRXZlbnRUeXBlLnNtYXJ0RHJhZ01vdmUsIGV2KTtcclxuXHJcbiAgICAgICAgICAgIGV2LnN0b3AoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXRlbS5vbihwYXBlci5FdmVudFR5cGUubW91c2VVcCwgZXYgPT4ge1xyXG4gICAgICAgICAgICBsb2coXCJzbWFydERyYWcub25Nb3VzZVVwXCIsIGl0ZW0sIGV2KTtcclxuICAgICAgICAgICAgaWYgKGV2LnNtYXJ0RHJhZ0l0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIldpbGwgbm90IGFzc2lnbiBzbWFydERyYWdJdGVtOiB2YWx1ZSB3YXMgYWxyZWFkeSBcIiArIGV2LnNtYXJ0RHJhZ0l0ZW0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXYuc21hcnREcmFnSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtLmlzU21hcnREcmFnZ2luZykge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5pc1NtYXJ0RHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGxvZyhcImVtaXR0aW5nIHNtYXJ0RHJhZy5zbWFydERyYWdFbmRcIik7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQoRXZlbnRUeXBlLnNtYXJ0RHJhZ0VuZCwgZXYpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG9nKFwiZW1pdHRpbmcgc21hcnREcmFnLmNsaWNrV2l0aG91dERyYWdcIik7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQoRXZlbnRUeXBlLmNsaWNrV2l0aG91dERyYWcsIGV2KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZXYuc3RvcCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgY29uc3QgRXZlbnRUeXBlID0ge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEcmFnIGFjdGlvbiBoYXMgc3RhcnRlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzbWFydERyYWdTdGFydDogXCJzbWFydERyYWdTdGFydFwiLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEcmFnZ2VkIGl0ZW0gaGFzIG1vdmVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNtYXJ0RHJhZ01vdmU6IFwic21hcnREcmFnTW92ZVwiLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEcmFnIGFjdGlvbiBoYXMgZW5kZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc21hcnREcmFnRW5kOiBcInNtYXJ0RHJhZ0VuZFwiLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgbm9ybWFsIGNsaWNrIGV2ZW50IHdpbGwgZmlyZSBldmVuIGF0IHRoZSBlbmQgb2YgYSBkcmFnLlxyXG4gICAgICAgICAqIFRoaXMgY2xpY2sgZXZlbnQgZG9lcyBub3QuIFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNsaWNrV2l0aG91dERyYWc6IFwiY2xpY2tXaXRob3V0RHJhZ1wiXHJcbiAgICB9XHJcbn1cclxuXHJcbmRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSXRlbSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZ2dpbmcgYmVoYXZpb3IgYWRkZWQgYnkgUGFwZXJIZWxwZXJzOiBpcyB0aGUgaXRlbSBiZWluZyBkcmFnZ2VkP1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzU21hcnREcmFnZ2luZzogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZ2dpbmcgYmVoYXZpb3IgYWRkZWQgYnkgUGFwZXJIZWxwZXJzOiBpcyB0aGUgaXRlbSBkcmFnZ2FibGU/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNTbWFydERyYWdnYWJsZTogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRvb2xFdmVudCB7XHJcbiAgICAgICAgc21hcnREcmFnSXRlbTogSXRlbTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFBhcGVyTW91c2VFdmVudCB7XHJcbiAgICAgICAgc21hcnREcmFnSXRlbTogSXRlbTtcclxuICAgIH1cclxufSIsIlxyXG50eXBlIEl0ZW1DaGFuZ2VIYW5kbGVyID0gKGZsYWdzOiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnKSA9PiB2b2lkO1xyXG50eXBlIENhbGxiYWNrID0gKCkgPT4gdm9pZDtcclxuXHJcbmRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcclxuICAgIGludGVyZmFjZSBJdGVtIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTdWJzY3JpYmUgdG8gYWxsIGNoYW5nZXMgaW4gaXRlbS4gUmV0dXJucyB1bi1zdWJzY3JpYmUgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3Vic2NyaWJlKGhhbmRsZXI6IEl0ZW1DaGFuZ2VIYW5kbGVyKTogQ2FsbGJhY2s7XHJcbiAgICAgICAgXHJcbiAgICAgICAgX2NoYW5nZWQoZmxhZ3M6IFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcpOiB2b2lkO1xyXG4gICAgfVxyXG59XHJcblxyXG5uYW1lc3BhY2UgUGFwZXJOb3RpZnkge1xyXG5cclxuICAgIGV4cG9ydCBlbnVtIENoYW5nZUZsYWcge1xyXG4gICAgICAgIC8vIEFueXRoaW5nIGFmZmVjdGluZyB0aGUgYXBwZWFyYW5jZSBvZiBhbiBpdGVtLCBpbmNsdWRpbmcgR0VPTUVUUlksXHJcbiAgICAgICAgLy8gU1RST0tFLCBTVFlMRSBhbmQgQVRUUklCVVRFIChleGNlcHQgZm9yIHRoZSBpbnZpc2libGUgb25lczogbG9ja2VkLCBuYW1lKVxyXG4gICAgICAgIEFQUEVBUkFOQ0UgPSAweDEsXHJcbiAgICAgICAgLy8gQSBjaGFuZ2UgaW4gdGhlIGl0ZW0ncyBjaGlsZHJlblxyXG4gICAgICAgIENISUxEUkVOID0gMHgyLFxyXG4gICAgICAgIC8vIEEgY2hhbmdlIG9mIHRoZSBpdGVtJ3MgcGxhY2UgaW4gdGhlIHNjZW5lIGdyYXBoIChyZW1vdmVkLCBpbnNlcnRlZCxcclxuICAgICAgICAvLyBtb3ZlZCkuXHJcbiAgICAgICAgSU5TRVJUSU9OID0gMHg0LFxyXG4gICAgICAgIC8vIEl0ZW0gZ2VvbWV0cnkgKHBhdGgsIGJvdW5kcylcclxuICAgICAgICBHRU9NRVRSWSA9IDB4OCxcclxuICAgICAgICAvLyBPbmx5IHNlZ21lbnQocykgaGF2ZSBjaGFuZ2VkLCBhbmQgYWZmZWN0ZWQgY3VydmVzIGhhdmUgYWxyZWFkeSBiZWVuXHJcbiAgICAgICAgLy8gbm90aWZpZWQuIFRoaXMgaXMgdG8gaW1wbGVtZW50IGFuIG9wdGltaXphdGlvbiBpbiBfY2hhbmdlZCgpIGNhbGxzLlxyXG4gICAgICAgIFNFR01FTlRTID0gMHgxMCxcclxuICAgICAgICAvLyBTdHJva2UgZ2VvbWV0cnkgKGV4Y2x1ZGluZyBjb2xvcilcclxuICAgICAgICBTVFJPS0UgPSAweDIwLFxyXG4gICAgICAgIC8vIEZpbGwgc3R5bGUgb3Igc3Ryb2tlIGNvbG9yIC8gZGFzaFxyXG4gICAgICAgIFNUWUxFID0gMHg0MCxcclxuICAgICAgICAvLyBJdGVtIGF0dHJpYnV0ZXM6IHZpc2libGUsIGJsZW5kTW9kZSwgbG9ja2VkLCBuYW1lLCBvcGFjaXR5LCBjbGlwTWFzayAuLi5cclxuICAgICAgICBBVFRSSUJVVEUgPSAweDgwLFxyXG4gICAgICAgIC8vIFRleHQgY29udGVudFxyXG4gICAgICAgIENPTlRFTlQgPSAweDEwMCxcclxuICAgICAgICAvLyBSYXN0ZXIgcGl4ZWxzXHJcbiAgICAgICAgUElYRUxTID0gMHgyMDAsXHJcbiAgICAgICAgLy8gQ2xpcHBpbmcgaW4gb25lIG9mIHRoZSBjaGlsZCBpdGVtc1xyXG4gICAgICAgIENMSVBQSU5HID0gMHg0MDAsXHJcbiAgICAgICAgLy8gVGhlIHZpZXcgaGFzIGJlZW4gdHJhbnNmb3JtZWRcclxuICAgICAgICBWSUVXID0gMHg4MDBcclxuICAgIH1cclxuXHJcbiAgICAvLyBTaG9ydGN1dHMgdG8gb2Z0ZW4gdXNlZCBDaGFuZ2VGbGFnIHZhbHVlcyBpbmNsdWRpbmcgQVBQRUFSQU5DRVxyXG4gICAgZXhwb3J0IGVudW0gQ2hhbmdlcyB7XHJcbiAgICAgICAgLy8gQ0hJTERSRU4gYWxzbyBjaGFuZ2VzIEdFT01FVFJZLCBzaW5jZSByZW1vdmluZyBjaGlsZHJlbiBmcm9tIGdyb3Vwc1xyXG4gICAgICAgIC8vIGNoYW5nZXMgYm91bmRzLlxyXG4gICAgICAgIENISUxEUkVOID0gQ2hhbmdlRmxhZy5DSElMRFJFTiB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgLy8gQ2hhbmdpbmcgdGhlIGluc2VydGlvbiBjYW4gY2hhbmdlIHRoZSBhcHBlYXJhbmNlIHRocm91Z2ggcGFyZW50J3MgbWF0cml4LlxyXG4gICAgICAgIElOU0VSVElPTiA9IENoYW5nZUZsYWcuSU5TRVJUSU9OIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIEdFT01FVFJZID0gQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBTRUdNRU5UUyA9IENoYW5nZUZsYWcuU0VHTUVOVFMgfCBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNUUk9LRSA9IENoYW5nZUZsYWcuU1RST0tFIHwgQ2hhbmdlRmxhZy5TVFlMRSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBTVFlMRSA9IENoYW5nZUZsYWcuU1RZTEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgQVRUUklCVVRFID0gQ2hhbmdlRmxhZy5BVFRSSUJVVEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgQ09OVEVOVCA9IENoYW5nZUZsYWcuQ09OVEVOVCB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgUElYRUxTID0gQ2hhbmdlRmxhZy5QSVhFTFMgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgVklFVyA9IENoYW5nZUZsYWcuVklFVyB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRVxyXG4gICAgfTtcclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICBcclxuICAgICAgICAvLyBJbmplY3QgSXRlbS5zdWJzY3JpYmVcclxuICAgICAgICBjb25zdCBpdGVtUHJvdG8gPSAoPGFueT5wYXBlcikuSXRlbS5wcm90b3R5cGU7XHJcbiAgICAgICAgaXRlbVByb3RvLnN1YnNjcmliZSA9IGZ1bmN0aW9uKGhhbmRsZXI6IEl0ZW1DaGFuZ2VIYW5kbGVyKTogQ2FsbGJhY2sge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3N1YnNjcmliZXJzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGhhbmRsZXIpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMucHVzaChoYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyLCAwKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gV3JhcCBJdGVtLnJlbW92ZVxyXG4gICAgICAgIGNvbnN0IGl0ZW1SZW1vdmUgPSBpdGVtUHJvdG8ucmVtb3ZlO1xyXG4gICAgICAgIGl0ZW1Qcm90by5yZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXRlbVJlbW92ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXcmFwIFByb2plY3QuX2NoYW5nZWRcclxuICAgICAgICBjb25zdCBwcm9qZWN0UHJvdG8gPSA8YW55PnBhcGVyLlByb2plY3QucHJvdG90eXBlO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RDaGFuZ2VkID0gcHJvamVjdFByb3RvLl9jaGFuZ2VkO1xyXG4gICAgICAgIHByb2plY3RQcm90by5fY2hhbmdlZCA9IGZ1bmN0aW9uKGZsYWdzOiBDaGFuZ2VGbGFnLCBpdGVtOiBwYXBlci5JdGVtKSB7XHJcbiAgICAgICAgICAgIHByb2plY3RDaGFuZ2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJzID0gKDxhbnk+aXRlbSkuX3N1YnNjcmliZXJzO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1YnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBzIG9mIHN1YnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcy5jYWxsKGl0ZW0sIGZsYWdzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRlc2NyaWJlKGZsYWdzOiBDaGFuZ2VGbGFnKSB7XHJcbiAgICAgICAgbGV0IGZsYWdMaXN0OiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIF8uZm9yT3duKENoYW5nZUZsYWcsICh2YWx1ZSwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICgodHlwZW9mIHZhbHVlKSA9PT0gXCJudW1iZXJcIiAmJiAodmFsdWUgJiBmbGFncykpIHtcclxuICAgICAgICAgICAgICAgIGZsYWdMaXN0LnB1c2goa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmbGFnTGlzdC5qb2luKCcgfCAnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmUoaXRlbTogcGFwZXIuSXRlbSwgZmxhZ3M6IENoYW5nZUZsYWcpOiBcclxuICAgICAgICBSeC5PYnNlcnZhYmxlPENoYW5nZUZsYWc+IFxyXG4gICAge1xyXG4gICAgICAgIGxldCB1bnN1YjogKCkgPT4gdm9pZDtcclxuICAgICAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuPENoYW5nZUZsYWc+KFxyXG4gICAgICAgICAgICBhZGRIYW5kbGVyID0+IHtcclxuICAgICAgICAgICAgICAgIHVuc3ViID0gaXRlbS5zdWJzY3JpYmUoZiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZiAmIGZsYWdzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkSGFuZGxlcihmKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgIHJlbW92ZUhhbmRsZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodW5zdWIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHVuc3ViKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuUGFwZXJOb3RpZnkuaW5pdGlhbGl6ZSgpO1xyXG4iLCJcclxubW9kdWxlIHBhcGVyIHtcclxuXHJcbiAgICBleHBvcnQgdmFyIEV2ZW50VHlwZSA9IHtcclxuICAgICAgICBmcmFtZTogXCJmcmFtZVwiLFxyXG4gICAgICAgIG1vdXNlRG93bjogXCJtb3VzZWRvd25cIixcclxuICAgICAgICBtb3VzZVVwOiBcIm1vdXNldXBcIixcclxuICAgICAgICBtb3VzZURyYWc6IFwibW91c2VkcmFnXCIsXHJcbiAgICAgICAgY2xpY2s6IFwiY2xpY2tcIixcclxuICAgICAgICBkb3VibGVDbGljazogXCJkb3VibGVjbGlja1wiLFxyXG4gICAgICAgIG1vdXNlTW92ZTogXCJtb3VzZW1vdmVcIixcclxuICAgICAgICBtb3VzZUVudGVyOiBcIm1vdXNlZW50ZXJcIixcclxuICAgICAgICBtb3VzZUxlYXZlOiBcIm1vdXNlbGVhdmVcIixcclxuICAgICAgICBrZXl1cDogXCJrZXl1cFwiLFxyXG4gICAgICAgIGtleWRvd246IFwia2V5ZG93blwiXHJcbiAgICB9XHJcblxyXG59IiwiXHJcbi8vIGNsYXNzIE9sZFRvcGljPFQ+IHtcclxuXHJcbi8vICAgICBwcml2YXRlIF9jaGFubmVsOiBJQ2hhbm5lbERlZmluaXRpb248T2JqZWN0PjtcclxuLy8gICAgIHByaXZhdGUgX25hbWU6IHN0cmluZztcclxuXHJcbi8vICAgICBjb25zdHJ1Y3RvcihjaGFubmVsOiBJQ2hhbm5lbERlZmluaXRpb248T2JqZWN0PiwgdG9waWM6IHN0cmluZykge1xyXG4vLyAgICAgICAgIHRoaXMuX2NoYW5uZWwgPSBjaGFubmVsO1xyXG4vLyAgICAgICAgIHRoaXMuX25hbWUgPSB0b3BpYztcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiA8UnguT2JzZXJ2YWJsZTxUPj50aGlzLl9jaGFubmVsLm9ic2VydmUodGhpcy5fbmFtZSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHVibGlzaChkYXRhOiBUKSB7XHJcbi8vICAgICAgICAgdGhpcy5fY2hhbm5lbC5wdWJsaXNoKHRoaXMuX25hbWUsIGRhdGEpO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHN1YnNjcmliZShjYWxsYmFjazogSUNhbGxiYWNrPFQ+KTogSVN1YnNjcmlwdGlvbkRlZmluaXRpb248VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiB0aGlzLl9jaGFubmVsLnN1YnNjcmliZSh0aGlzLl9uYW1lLCBjYWxsYmFjayk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHJvdGVjdGVkIHN1YnRvcGljKG5hbWUpOiBDaGFubmVsVG9waWM8VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiBuZXcgQ2hhbm5lbFRvcGljPFQ+KHRoaXMuX2NoYW5uZWwsIHRoaXMuX25hbWUgKyAnLicgKyBuYW1lKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBwcm90ZWN0ZWQgc3VidG9waWNPZjxVIGV4dGVuZHMgVD4obmFtZSk6IENoYW5uZWxUb3BpYzxVPiB7XHJcbi8vICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VT4odGhpcy5fY2hhbm5lbCwgdGhpcy5fbmFtZSArICcuJyArIG5hbWUpO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcbiIsIlxyXG5pbnRlcmZhY2UgSVBvc3RhbCB7XHJcbiAgICBvYnNlcnZlOiAob3B0aW9uczogUG9zdGFsT2JzZXJ2ZU9wdGlvbnMpID0+IFJ4Lk9ic2VydmFibGU8YW55PjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFBvc3RhbE9ic2VydmVPcHRpb25zIHtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIHRvcGljOiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJQ2hhbm5lbERlZmluaXRpb248VD4ge1xyXG4gICAgb2JzZXJ2ZSh0b3BpYzogc3RyaW5nKTogUnguT2JzZXJ2YWJsZTxUPjtcclxufVxyXG5cclxucG9zdGFsLm9ic2VydmUgPSBmdW5jdGlvbihvcHRpb25zOiBQb3N0YWxPYnNlcnZlT3B0aW9ucykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGNoYW5uZWwgPSBvcHRpb25zLmNoYW5uZWw7XHJcbiAgICB2YXIgdG9waWMgPSBvcHRpb25zLnRvcGljO1xyXG5cclxuICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm4oXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkSGFuZGxlcihoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgICAgICBjaGFubmVsOiBjaGFubmVsLFxyXG4gICAgICAgICAgICAgICAgdG9waWM6IHRvcGljLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsSGFuZGxlcihfLCBzdWIpIHtcclxuICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufTtcclxuXHJcbi8vIGFkZCBvYnNlcnZlIHRvIENoYW5uZWxEZWZpbml0aW9uXHJcbig8YW55PnBvc3RhbCkuQ2hhbm5lbERlZmluaXRpb24ucHJvdG90eXBlLm9ic2VydmUgPSBmdW5jdGlvbih0b3BpYzogc3RyaW5nKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybihcclxuICAgICAgICBmdW5jdGlvbiBhZGRIYW5kbGVyKGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuYnVzLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgICAgICBjaGFubmVsOiBzZWxmLmNoYW5uZWwsXHJcbiAgICAgICAgICAgICAgICB0b3BpYzogdG9waWMsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogaCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiBkZWxIYW5kbGVyKF8sIHN1Yikge1xyXG4gICAgICAgICAgICBzdWIudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG59O1xyXG4iLCJcclxuY29uc3QgcmggPSBSZWFjdC5jcmVhdGVFbGVtZW50O1xyXG4iLCJcclxuYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50PFQ+IHtcclxuICAgIGFic3RyYWN0IHJlbmRlcihkYXRhOiBUKTogVk5vZGU7XHJcbn0iLCJcclxuaW50ZXJmYWNlIFJlYWN0aXZlRG9tQ29tcG9uZW50IHtcclxuICAgIGRvbSQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+O1xyXG59XHJcblxyXG5jbGFzcyBSZWFjdGl2ZURvbSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSByZWFjdGl2ZSBjb21wb25lbnQgd2l0aGluIGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlclN0cmVhbShcclxuICAgICAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPixcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50XHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBjb250YWluZXIuaWQ7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQ6IEhUTUxFbGVtZW50IHwgVk5vZGUgPSBjb250YWluZXI7XHJcbiAgICAgICAgY29uc3Qgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGRvbSQuc3Vic2NyaWJlKGRvbSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFkb20pIHJldHVybjtcclxuLy9jb25zb2xlLmxvZygncmVuZGVyaW5nIGRvbScsIGRvbSk7IC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gcmV0YWluIElEXHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGNoZWQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xyXG4gICAgICAgICAgICBpZihpZCAmJiAhcGF0Y2hlZC5lbG0uaWQpe1xyXG4gICAgICAgICAgICAgICAgcGF0Y2hlZC5lbG0uaWQgPSBpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoZWQ7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciBhIHJlYWN0aXZlIGNvbXBvbmVudCB3aXRoaW4gY29udGFpbmVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyQ29tcG9uZW50KFxyXG4gICAgICAgIGNvbXBvbmVudDogUmVhY3RpdmVEb21Db21wb25lbnQsXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudCB8IFZOb2RlXHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjb250YWluZXI7XHJcbiAgICAgICAgbGV0IHNpbmsgPSBuZXcgUnguU3ViamVjdDxWTm9kZT4oKTtcclxuICAgICAgICBjb21wb25lbnQuZG9tJC5zdWJzY3JpYmUoZG9tID0+IHtcclxuICAgICAgICAgICAgaWYoIWRvbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIHdpdGhpbiBjb250YWluZXIgd2hlbmV2ZXIgc291cmNlIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsaXZlUmVuZGVyPFQ+KFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZSxcclxuICAgICAgICBzb3VyY2U6IFJ4Lk9ic2VydmFibGU8VD4sXHJcbiAgICAgICAgcmVuZGVyOiAobmV4dDogVCkgPT4gVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gcmVuZGVyKGRhdGEpO1xyXG4gICAgICAgICAgICBpZighbm9kZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgbm9kZSk7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbn0iLCIvLyBjb25zdCBBbWF0aWNVcmwgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3MvYW1hdGljc2MvdjgvSURua1JUUEdjclNWbzUwVXlZTks3eTNVU0JuU3Zwa29wUWFVUi0ycjdpVS50dGYnO1xyXG4vLyBjb25zdCBSb2JvdG8xMDAgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3Mvcm9ib3RvL3YxNS83TXlncVRlMnpzOVlrUDBhZEE5UVFRLnR0Zic7XHJcbi8vIGNvbnN0IFJvYm90bzUwMCA9ICdmb250cy9Sb2JvdG8tNTAwLnR0Zic7XHJcbi8vIGNvbnN0IFJvYm90bzkwMCA9IFwiaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3Mvcm9ib3RvL3YxNS9IMXZCMzRuT0tXWHF6S290cTI1cGNnLnR0ZlwiO1xyXG4vLyBjb25zdCBPcGVuU2Fuc1JlZ3VsYXIgPSBcImZvbnRzL09wZW5TYW5zL09wZW5TYW5zLVJlZ3VsYXIudHRmXCI7XHJcbi8vIGNvbnN0IE9wZW5TYW5zRXh0cmFCb2xkID0gXCJmb250cy9PcGVuU2Fucy9PcGVuU2Fucy1FeHRyYUJvbGQudHRmXCI7XHJcbi8vIGNvbnN0IEFxdWFmaW5hU2NyaXB0ID0gJ2ZvbnRzL0FndWFmaW5hU2NyaXB0LVJlZ3VsYXIvQWd1YWZpbmFTY3JpcHQtUmVndWxhci50dGYnXHJcbi8vIGNvbnN0IE5vcmljYW4gPSBcImh0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL25vcmljYW4vdjQvU0huU3FoWUFXRzVzWlRXY1B6RUhpZy50dGZcIjtcclxuXHJcbmNsYXNzIEFwcENvbnRyb2xsZXIge1xyXG5cclxuICAgIHN0b3JlOiBTdG9yZTtcclxuICAgIHdvcmtzcGFjZUNvbnRyb2xsZXI6IFdvcmtzcGFjZUNvbnRyb2xsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc3RvcmU6IFN0b3JlLFxyXG4gICAgICAgIHNrZXRjaEVkaXRvcjogU2tldGNoRWRpdG9yLFxyXG4gICAgICAgIHNlbGVjdGVkSXRlbUVkaXRvcjogU2VsZWN0ZWRJdGVtRWRpdG9yKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGFjdGlvbnMgPSBzdG9yZS5hY3Rpb25zLCBldmVudHMgPSBzdG9yZS5ldmVudHM7XHJcblxyXG4gICAgICAgIGV2ZW50cy5zdWJzY3JpYmUobSA9PiBjb25zb2xlLmxvZyhcImV2ZW50XCIsIG0pKTtcclxuICAgICAgICBhY3Rpb25zLnN1YnNjcmliZShtID0+IGNvbnNvbGUubG9nKFwiYWN0aW9uXCIsIG0pKTtcclxuXHJcbiAgICAgICAgZXZlbnRzLmFwcC5mb250TG9hZGVkLm9ic2VydmUoKS5maXJzdCgpLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMud29ya3NwYWNlQ29udHJvbGxlciA9IG5ldyBXb3Jrc3BhY2VDb250cm9sbGVyKHN0b3JlLCBtLmRhdGEpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZXZlbnRzLmFwcC5yZXRhaW5lZFN0YXRlTG9hZEF0dGVtcHRDb21wbGV0ZS5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW0uZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vIGF1dG9zYXZlIGRhdGEgbG9hZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guY3JlYXRlLmRpc3BhdGNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2suYWRkLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6IFwiRklERExFU1RJQ0tTXCIsIHRleHRDb2xvcjogXCJsaWdodGJsdWVcIiwgZm9udFNpemU6IDEyOCB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIEF1dG8tc2F2ZSBpbiBvbmUgbGluZTogZ290dGEgbG92ZSBpdC5cclxuICAgICAgICAgICAgICAgIGV2ZW50cy5hcHAucmV0YWluZWRTdGF0ZUNoYW5nZWQub2JzZXJ2ZSgpLmRlYm91bmNlKDgwMCkuc3Vic2NyaWJlKHN0YXRlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLmFwcC5zYXZlUmV0YWluZWRTdGF0ZS5kaXNwYXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5hcHAubG9hZFJldGFpbmVkU3RhdGUuZGlzcGF0Y2goKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZXZlbnRzLnNrZXRjaC5sb2FkZWQuc3Vic2NyaWJlKGV2ID0+XHJcbiAgICAgICAgICAgICQoXCIjbWFpbkNhbnZhc1wiKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGV2LmRhdGEuYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQuc3Vic2NyaWJlKGV2ID0+XHJcbiAgICAgICAgICAgICQoXCIjbWFpbkNhbnZhc1wiKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGV2LmRhdGEuYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmNsYXNzIEFjdGlvbnMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XHJcbiAgICBcclxuICAgIGFwcCA9IHsgICAgICAgXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5zdHJ1Y3RzIFN0b3JlIHRvIGxvYWQgcmV0YWluZWQgc3RhdGUgZnJvbSBsb2NhbCBzdG9yYWdlLCBpZiBpdCBleGlzdHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbG9hZFJldGFpbmVkU3RhdGU6IHRoaXMudG9waWM8dm9pZD4oXCJhcHAubG9hZFJldGFpbmVkU3RhdGVcIiksXHJcbiAgICAgICAgXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5zdHJ1Y3RzIFN0b3JlIHRvIHNhdmUgcmV0YWluZWQgc3RhdGUgdG8gbG9jYWwgc3RvcmFnZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzYXZlUmV0YWluZWRTdGF0ZTogdGhpcy50b3BpYzx2b2lkPihcImFwcC5zYXZlUmV0YWluZWRTdGF0ZVwiKSxcclxuICAgICAgICBcclxuICAgICAgICBsb2FkRm9udDogdGhpcy50b3BpYzxzdHJpbmc+KFwiYXBwLmxvYWRGb250XCIpXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBkZXNpZ25lciA9IHtcclxuICAgICAgICB6b29tVG9GaXQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci56b29tVG9GaXRcIiksXHJcbiAgICAgICAgZXhwb3J0aW5nSW1hZ2U6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRJbWFnZVwiKSxcclxuICAgICAgICBleHBvcnRQTkc6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRQTkdcIiksXHJcbiAgICAgICAgZXhwb3J0U1ZHOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0U1ZHXCIpLFxyXG4gICAgICAgIHZpZXdDaGFuZ2VkOiB0aGlzLnRvcGljPHBhcGVyLlJlY3RhbmdsZT4oXCJkZXNpZ25lci52aWV3Q2hhbmdlZFwiKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBza2V0Y2ggPSB7XHJcbiAgICAgICAgY3JlYXRlOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2guY3JlYXRlXCIpLFxyXG4gICAgICAgIGF0dHJVcGRhdGU6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5hdHRyVXBkYXRlXCIpLFxyXG4gICAgICAgIHNldEVkaXRpbmdJdGVtOiB0aGlzLnRvcGljPFBvc2l0aW9uZWRPYmplY3RSZWY+KFwic2tldGNoLnNldEVkaXRpbmdJdGVtXCIpLFxyXG4gICAgICAgIHNldFNlbGVjdGlvbjogdGhpcy50b3BpYzxXb3Jrc3BhY2VPYmplY3RSZWY+KFwic2tldGNoLnNldFNlbGVjdGlvblwiKSxcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRleHRCbG9jayA9IHtcclxuICAgICAgICBhZGQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hZGRcIiksXHJcbiAgICAgICAgdXBkYXRlQXR0cjogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLnVwZGF0ZUF0dHJcIiksXHJcbiAgICAgICAgdXBkYXRlQXJyYW5nZTogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLnVwZGF0ZUFycmFuZ2VcIiksXHJcbiAgICAgICAgcmVtb3ZlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sucmVtb3ZlXCIpXHJcbiAgICB9O1xyXG4gICAgXHJcbn1cclxuXHJcbmNsYXNzIEV2ZW50cyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcclxuICAgIFxyXG4gICAgYXBwID0ge1xyXG4gICAgICAgIHJlc291cmNlc1JlYWR5OiB0aGlzLnRvcGljPGJvb2xlYW4+KFwiYXBwLnJlc291cmNlc1JlYWR5XCIpLFxyXG4gICAgICAgIHJldGFpbmVkU3RhdGVMb2FkQXR0ZW1wdENvbXBsZXRlOiB0aGlzLnRvcGljPGJvb2xlYW4+KFwiYXBwLnJldGFpbmVkU3RhdGVMb2FkQXR0ZW1wdENvbXBsZXRlXCIpLFxyXG4gICAgICAgIHJldGFpbmVkU3RhdGVDaGFuZ2VkOiB0aGlzLnRvcGljPFJldGFpbmVkU3RhdGU+KFwiYXBwLnJldGFpbmVkU3RhdGVDaGFuZ2VkXCIpLFxyXG4gICAgICAgIGZvbnRMb2FkZWQ6IHRoaXMudG9waWM8b3BlbnR5cGUuRm9udD4oXCJhcHAuZm9udExvYWRlZFwiKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBkZXNpZ25lciA9IHtcclxuICAgICAgICB6b29tVG9GaXRSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci56b29tVG9GaXRSZXF1ZXN0ZWRcIiksXHJcbiAgICAgICAgZXhwb3J0UE5HUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0UE5HUmVxdWVzdGVkXCIpLFxyXG4gICAgICAgIGV4cG9ydFNWR1JlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydFNWR1JlcXVlc3RlZFwiKSxcclxuICAgICAgICB2aWV3Q2hhbmdlZDogdGhpcy50b3BpYzxwYXBlci5SZWN0YW5nbGU+KFwiZGVzaWduZXIudmlld0NoYW5nZWRcIilcclxuICAgIH07XHJcbiAgICBcclxuICAgIHNrZXRjaCA9IHtcclxuICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5sb2FkZWRcIiksXHJcbiAgICAgICAgYXR0ckNoYW5nZWQ6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5hdHRyQ2hhbmdlZFwiKSxcclxuICAgICAgICBlZGl0aW5nSXRlbUNoYW5nZWQ6IHRoaXMudG9waWM8UG9zaXRpb25lZE9iamVjdFJlZj4oXCJza2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkXCIpLFxyXG4gICAgICAgIHNlbGVjdGlvbkNoYW5nZWQ6IHRoaXMudG9waWM8V29ya3NwYWNlT2JqZWN0UmVmPihcInNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkXCIpLFxyXG4gICAgICAgIHNhdmVMb2NhbFJlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcInNrZXRjaC5zYXZlbG9jYWwuc2F2ZUxvY2FsUmVxdWVzdGVkXCIpXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB0ZXh0YmxvY2sgPSB7XHJcbiAgICAgICAgYWRkZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hZGRlZFwiKSxcclxuICAgICAgICBhdHRyQ2hhbmdlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmF0dHJDaGFuZ2VkXCIpLFxyXG4gICAgICAgIGFycmFuZ2VDaGFuZ2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYXJyYW5nZUNoYW5nZWRcIiksXHJcbiAgICAgICAgcmVtb3ZlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLnJlbW92ZWRcIiksXHJcbiAgICAgICAgbG9hZGVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2subG9hZGVkXCIpLFxyXG4gICAgICAgIGVkaXRvckNsb3NlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmVkaXRvckNsb3NlZFwiKSxcclxuICAgIH07XHJcbiAgICBcclxufVxyXG5cclxuY2xhc3MgQ2hhbm5lbHMge1xyXG4gICAgYWN0aW9uczogQWN0aW9ucyA9IG5ldyBBY3Rpb25zKCk7XHJcbiAgICBldmVudHM6IEV2ZW50cyA9IG5ldyBFdmVudHMoKTtcclxufVxyXG4iLCJcclxuY2xhc3MgRm9udEZhbWlsaWVzTG9hZGVyIHtcclxuXHJcbiAgICBsb2FkTGlzdExvY2FsKGNhbGxiYWNrOiAoZmFtaWxpZXM6IEZvbnRGYW1pbHlbXSkgPT4gdm9pZCkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogXCJmb250cy9nb29nbGUtZm9udHMuanNvblwiLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlOiB7IGtpbmQ6IHN0cmluZywgaXRlbXM6IEZvbnRGYW1pbHlbXSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhyZXNwb25zZS5pdGVtcyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiAoeGhyLCBzdGF0dXMsIGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImdvb2dsZS1mb250cy5qc29uXCIsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZExpc3RSZW1vdGUoY2FsbGJhY2s6IChmYW1pbGllczogRm9udEZhbWlseVtdKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdmFyIHVybCA9ICdodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS93ZWJmb250cy92MS93ZWJmb250cz8nO1xyXG4gICAgICAgIHZhciBrZXkgPSAna2V5PUdPT0dMRS1BUEktS0VZJztcclxuICAgICAgICB2YXIgc29ydCA9IFwicG9wdWxhcml0eVwiO1xyXG4gICAgICAgIHZhciBvcHQgPSAnc29ydD0nICsgc29ydCArICcmJztcclxuICAgICAgICB2YXIgcmVxID0gdXJsICsgb3B0ICsga2V5O1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHJlcSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY2FjaGU6IHRydWUsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZTogeyBraW5kOiBzdHJpbmcsIGl0ZW1zOiBGb250RmFtaWx5W10gfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2socmVzcG9uc2UuaXRlbXMpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogKHhociwgc3RhdHVzLCBlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGb3JQcmV2aWV3KGZhbWlsaWVzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGZvciAoY29uc3QgY2h1bmsgb2YgXy5jaHVuayhmYW1pbGllcywgMTApKSB7XHJcbiAgICAgICAgICAgIFdlYkZvbnQubG9hZCh7XHJcbiAgICAgICAgICAgICAgICBjbGFzc2VzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGdvb2dsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGZhbWlsaWVzOiA8c3RyaW5nW10+Y2h1bmssXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OVwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIlxyXG50eXBlIFBhcnNlZEZvbnRMb2FkZWQgPSAodXJsOiBzdHJpbmcsIGZvbnQ6IG9wZW50eXBlLkZvbnQpID0+IHZvaWQ7IFxyXG5cclxuY2xhc3MgUGFyc2VkRm9udHMge1xyXG5cclxuICAgIGZvbnRzOiB7IFt1cmw6IHN0cmluZ106IG9wZW50eXBlLkZvbnQ7IH0gPSB7fTtcclxuXHJcbiAgICBwcml2YXRlIF9mb250TG9hZGVkOiBQYXJzZWRGb250TG9hZGVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnRMb2FkZWQ6IFBhcnNlZEZvbnRMb2FkZWQpe1xyXG4gICAgICAgIHRoaXMuX2ZvbnRMb2FkZWQgPSBmb250TG9hZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChmb250VXJsOiBzdHJpbmcsIG9uUmVhZHk6IFBhcnNlZEZvbnRMb2FkZWQgPSBudWxsKSB7XHJcbiAgICAgICAgbGV0IGZvbnQgPSB0aGlzLmZvbnRzW2ZvbnRVcmxdO1xyXG5cclxuICAgICAgICBpZiAoZm9udCkge1xyXG4gICAgICAgICAgICBvblJlYWR5ICYmIG9uUmVhZHkoZm9udFVybCwgZm9udCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9wZW50eXBlLmxvYWQoZm9udFVybCwgKGVyciwgZm9udCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRzW2ZvbnRVcmxdID0gZm9udDtcclxuICAgICAgICAgICAgICAgIG9uUmVhZHkgJiYgb25SZWFkeShmb250VXJsLCBmb250KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRMb2FkZWQoZm9udFVybCwgZm9udCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIlxyXG4vKipcclxuICogVGhlIHNpbmdsZXRvbiBTdG9yZSBjb250cm9scyBhbGwgYXBwbGljYXRpb24gc3RhdGUuXHJcbiAqIE5vIHBhcnRzIG91dHNpZGUgb2YgdGhlIFN0b3JlIG1vZGlmeSBhcHBsaWNhdGlvbiBzdGF0ZS5cclxuICogQ29tbXVuaWNhdGlvbiB3aXRoIHRoZSBTdG9yZSBpcyBkb25lIHRocm91Z2ggbWVzc2FnZSBDaGFubmVsczogXHJcbiAqICAgLSBBY3Rpb25zIGNoYW5uZWwgdG8gc2VuZCBpbnRvIHRoZSBTdG9yZSxcclxuICogICAtIEV2ZW50cyBjaGFubmVsIHRvIHJlY2VpdmUgbm90aWZpY2F0aW9uIGZyb20gdGhlIFN0b3JlLlxyXG4gKiBPbmx5IHRoZSBTdG9yZSBjYW4gcmVjZWl2ZSBhY3Rpb24gbWVzc2FnZXMuXHJcbiAqIE9ubHkgdGhlIFN0b3JlIGNhbiBzZW5kIGV2ZW50IG1lc3NhZ2VzLlxyXG4gKiBUaGUgU3RvcmUgY2Fubm90IHNlbmQgYWN0aW9ucyBvciBsaXN0ZW4gdG8gZXZlbnRzICh0byBhdm9pZCBsb29wcykuXHJcbiAqIE1lc3NhZ2VzIGFyZSB0byBiZSB0cmVhdGVkIGFzIGltbXV0YWJsZS5cclxuICogQWxsIG1lbnRpb25zIG9mIHRoZSBTdG9yZSBjYW4gYmUgYXNzdW1lZCB0byBtZWFuLCBvZiBjb3Vyc2UsXHJcbiAqICAgXCJUaGUgU3RvcmUgYW5kIGl0cyBzdWItY29tcG9uZW50cy5cIlxyXG4gKi9cclxuY2xhc3MgU3RvcmUge1xyXG5cclxuICAgIHN0YXRpYyBST0JPVE9fNTAwX0xPQ0FMID0gJ2ZvbnRzL1JvYm90by01MDAudHRmJztcclxuICAgIHN0YXRpYyBBVVRPU0FWRV9LRVkgPSBcIkZpZGRsZXN0aWNrcy5yZXRhaW5lZFN0YXRlXCI7XHJcbiAgICBzdGF0aWMgREVGQVVMVF9GT05UX05BTUUgPSBcIlJvYm90b1wiO1xyXG4gICAgc3RhdGljIEZPTlRfTElTVF9MSU1JVCA9IDEwMDtcclxuXHJcbiAgICBzdGF0ZSA9IHtcclxuICAgICAgICByZXRhaW5lZDogPFJldGFpbmVkU3RhdGU+e1xyXG4gICAgICAgICAgICBza2V0Y2g6IHRoaXMuY3JlYXRlU2tldGNoKClcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRpc3Bvc2FibGU6IDxEaXNwb3NhYmxlU3RhdGU+e31cclxuICAgIH1cclxuICAgIHJlc291cmNlcyA9IHtcclxuICAgICAgICBmb250RmFtaWxpZXM6IDxEaWN0aW9uYXJ5PEZvbnRGYW1pbHk+Pnt9LFxyXG4gICAgICAgIHBhcnNlZEZvbnRzOiBuZXcgUGFyc2VkRm9udHMoKHVybCwgZm9udCkgPT5cclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuYXBwLmZvbnRMb2FkZWQuZGlzcGF0Y2goZm9udCkpXHJcbiAgICB9XHJcbiAgICBhY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgIGV2ZW50cyA9IG5ldyBFdmVudHMoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnNldHVwU3Vic2NyaXB0aW9ucygpO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRSZXNvdXJjZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFN1YnNjcmlwdGlvbnMoKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuYWN0aW9ucywgZXZlbnRzID0gdGhpcy5ldmVudHM7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIEFwcCAtLS0tLVxyXG5cclxuICAgICAgICBhY3Rpb25zLmFwcC5sb2FkUmV0YWluZWRTdGF0ZS5vYnNlcnZlKClcclxuICAgICAgICAgICAgLy8gV2FybmluZzogc3Vic2NyaWJpbmcgdG8gZXZlbnQgd2l0aGluIFN0b3JlIC0gY3Jhenkgb3Igbm90Pz9cclxuICAgICAgICAgICAgLy8gd2FpdCB0byBsb2FkIHVudGlsIHJlc291cmNlcyBhcmUgcmVhZHlcclxuICAgICAgICAgICAgLnBhdXNhYmxlQnVmZmVyZWQoZXZlbnRzLmFwcC5yZXNvdXJjZXNSZWFkeS5vYnNlcnZlKCkubWFwKG0gPT4gbS5kYXRhKSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzdWNjZXNzID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFsb2NhbFN0b3JhZ2UgfHwgIWxvY2FsU3RvcmFnZS5nZXRJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90IHN1cHBvcnRlZFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzYXZlZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFN0b3JlLkFVVE9TQVZFX0tFWSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2F2ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2FkZWQgPSA8UmV0YWluZWRTdGF0ZT5KU09OLnBhcnNlKHNhdmVkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9hZGVkICYmIGxvYWRlZC5za2V0Y2ggJiYgbG9hZGVkLnNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRhdGEgc2VlbXMgbGVnaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXRhaW5lZCA9IGxvYWRlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy5za2V0Y2gubG9hZGVkLmRpc3BhdGNoKHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCB0YiBvZiB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmxvYWRlZC5kaXNwYXRjaCh0Yik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZC5kaXNwYXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBldmVudHMuYXBwLnJldGFpbmVkU3RhdGVMb2FkQXR0ZW1wdENvbXBsZXRlLmRpc3BhdGNoKHN1Y2Nlc3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5hcHAuc2F2ZVJldGFpbmVkU3RhdGUuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZSB8fCAhbG9jYWxTdG9yYWdlLmdldEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBzdXBwb3J0ZWRcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU3RvcmUuQVVUT1NBVkVfS0VZLCBKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXRlLnJldGFpbmVkKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuYXBwLmxvYWRGb250LnN1YnNjcmliZShtID0+XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChtLmRhdGEpKTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gRGVzaWduZXIgLS0tLS1cclxuXHJcbiAgICAgICAgYWN0aW9ucy5kZXNpZ25lci56b29tVG9GaXQuZm9yd2FyZChcclxuICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZCk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuZGVzaWduZXIuZXhwb3J0UE5HLmZvcndhcmQoXHJcbiAgICAgICAgICAgIGV2ZW50cy5kZXNpZ25lci5leHBvcnRQTkdSZXF1ZXN0ZWQpO1xyXG5cclxuICAgICAgICBhY3Rpb25zLmRlc2lnbmVyLmV4cG9ydFNWRy5mb3J3YXJkKFxyXG4gICAgICAgICAgICBldmVudHMuZGVzaWduZXIuZXhwb3J0U1ZHUmVxdWVzdGVkKTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5kZXNpZ25lci52aWV3Q2hhbmdlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIC8vIENhbid0IGRvIHRoaXMsIGR1ZSB0byBjaGFuY2Ugb2YgYWNjaWRlbnRhbCBjbG9zaW5nICAgXHJcbiAgICAgICAgICAgIC8vIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgIGV2ZW50cy5kZXNpZ25lci52aWV3Q2hhbmdlZC5kaXNwYXRjaChtLmRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAtLS0tLSBTa2V0Y2ggLS0tLS1cclxuXHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guY3JlYXRlXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKG0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoID0gdGhpcy5jcmVhdGVTa2V0Y2goKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGNoID0gbS5kYXRhIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgcGF0Y2guYmFja2dyb3VuZENvbG9yID0gcGF0Y2guYmFja2dyb3VuZENvbG9yIHx8ICcjZjZmM2ViJztcclxuICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduKHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoLCBwYXRjaCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXZlbnRzLnNrZXRjaC5sb2FkZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZC5kaXNwYXRjaCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldCh0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5kZWZhdWx0Rm9udERlc2MudXJsKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFJldGFpbmVkU3RhdGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLmF0dHJVcGRhdGVcclxuICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbih0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaCwgZXYuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFJldGFpbmVkU3RhdGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLnNldEVkaXRpbmdJdGVtLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShtLmRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihtLmRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gLS0tLS0gVGV4dEJsb2NrIC0tLS0tXHJcblxyXG4gICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLmFkZFxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gZXYuZGF0YTtcclxuICAgICAgICAgICAgICAgIGlmICghcGF0Y2gudGV4dCB8fCAhcGF0Y2gudGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB7IF9pZDogbmV3aWQoKSB9IGFzIFRleHRCbG9jaztcclxuICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduKGJsb2NrLCBwYXRjaCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJsb2NrLmZvbnRTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZm9udFNpemUgPSAxMjg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJsb2NrLnRleHRDb2xvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnRleHRDb2xvciA9IFwiZ3JheVwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2suZm9udERlc2MpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5kZWZhdWx0Rm9udERlc2MgPSBibG9jay5mb250RGVzYztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZm9udERlc2MgPSB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5kZWZhdWx0Rm9udERlc2M7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gudGV4dEJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYWRkZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkUmV0YWluZWRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXR0clxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuZ2V0QmxvY2soZXYuZGF0YS5faWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gPFRleHRCbG9jaz57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGV2LmRhdGEudGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBldi5kYXRhLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBldi5kYXRhLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udERlc2M6IGV2LmRhdGEuZm9udERlc2MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBldi5kYXRhLmZvbnRTaXplXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbihibG9jaywgcGF0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jay5mb250RGVzYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5kZWZhdWx0Rm9udERlc2MgPSBibG9jay5mb250RGVzYztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnRleHRibG9jay5hdHRyQ2hhbmdlZC5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkUmV0YWluZWRTdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2sucmVtb3ZlXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRpZERlbGV0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXy5yZW1vdmUodGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gudGV4dEJsb2NrcywgdGIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0Yi5faWQgPT09IGV2LmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZERlbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpZERlbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5kaXNwYXRjaCh7IF9pZDogZXYuZGF0YS5faWQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkUmV0YWluZWRTdGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnRleHRCbG9jay51cGRhdGVBcnJhbmdlXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5nZXRCbG9jayhldi5kYXRhLl9pZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5wb3NpdGlvbiA9IGV2LmRhdGEucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sub3V0bGluZSA9IGV2LmRhdGEub3V0bGluZTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmFycmFuZ2VDaGFuZ2VkLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRSZXRhaW5lZFN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZXNvdXJjZXMoKSB7XHJcbiAgICAgICAgY29uc3QgbG9hZGVyID0gbmV3IEZvbnRGYW1pbGllc0xvYWRlcigpO1xyXG4gICAgICAgIGxvYWRlci5sb2FkTGlzdExvY2FsKGZhbWlsaWVzID0+IHtcclxuICAgICAgICAgICAgZmFtaWxpZXMubGVuZ3RoID0gU3RvcmUuRk9OVF9MSVNUX0xJTUlUO1xyXG4gICAgICAgICAgICBjb25zdCBkaWN0ID0gdGhpcy5yZXNvdXJjZXMuZm9udEZhbWlsaWVzO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZhbWlseUdyb3VwIG9mIGZhbWlsaWVzKSB7XHJcbiAgICAgICAgICAgICAgICBkaWN0W2ZhbWlseUdyb3VwLmZhbWlseV0gPSBmYW1pbHlHcm91cDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gbG9hZCBmb250cyBpbnRvIGJyb3dzZXIgZm9yIHByZXZpZXdcclxuICAgICAgICAgICAgbG9hZGVyLmxvYWRGb3JQcmV2aWV3KGZhbWlsaWVzLm1hcChmID0+IGYuZmFtaWx5KSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlcy5wYXJzZWRGb250cy5nZXQoU3RvcmUuUk9CT1RPXzUwMF9MT0NBTCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5hcHAucmVzb3VyY2VzUmVhZHkuZGlzcGF0Y2godHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlZFJldGFpbmVkU3RhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5ldmVudHMuYXBwLnJldGFpbmVkU3RhdGVDaGFuZ2VkLmRpc3BhdGNoKHRoaXMuc3RhdGUucmV0YWluZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzc2lnbjxUPihkZXN0OiBULCBzb3VyY2U6IFQpIHtcclxuICAgICAgICBfLm1lcmdlKGRlc3QsIHNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU2tldGNoKCk6IFNrZXRjaCB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGVmYXVsdEZvbnREZXNjOiB7XHJcbiAgICAgICAgICAgICAgICBmYW1pbHk6IFwiUm9ib3RvXCIsXHJcbiAgICAgICAgICAgICAgICB2YXJpYW50OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IG51bGwsXHJcbiAgICAgICAgICAgICAgICB1cmw6IFN0b3JlLlJPQk9UT181MDBfTE9DQUxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGV4dEJsb2NrczogPFRleHRCbG9ja1tdPltdXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFNlbGVjdGlvbihpdGVtOiBXb3Jrc3BhY2VPYmplY3RSZWYpIHtcclxuICAgICAgICAvLyBlYXJseSBleGl0IG9uIG5vIGNoYW5nZVxyXG4gICAgICAgIGlmKGl0ZW0pe1xyXG4gICAgICAgICAgICBpZih0aGlzLnN0YXRlLmRpc3Bvc2FibGUuc2VsZWN0aW9uIFxyXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5zdGF0ZS5kaXNwb3NhYmxlLnNlbGVjdGlvbi5pdGVtSWQgPT09IGl0ZW0uaXRlbUlkKXtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLnN0YXRlLmRpc3Bvc2FibGUuc2VsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUuZGlzcG9zYWJsZS5zZWxlY3Rpb24gPSBpdGVtO1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLmRpc3BhdGNoKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0RWRpdGluZ0l0ZW0oaXRlbTogUG9zaXRpb25lZE9iamVjdFJlZikge1xyXG4gICAgICAgIC8vIGVhcmx5IGV4aXQgb24gbm8gY2hhbmdlXHJcbiAgICAgICAgaWYoaXRlbSl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuc3RhdGUuZGlzcG9zYWJsZS5lZGl0aW5nSXRlbSBcclxuICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuZGlzcG9zYWJsZS5lZGl0aW5nSXRlbS5pdGVtSWQgPT09IGl0ZW0uaXRlbUlkKXtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLnN0YXRlLmRpc3Bvc2FibGUuZWRpdGluZ0l0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5kaXNwb3NhYmxlLmVkaXRpbmdJdGVtKSB7XHJcbiAgICAgICAgICAgIC8vIHNpZ25hbCBjbG9zaW5nIGVkaXRvciBmb3IgaXRlbVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYodGhpcy5zdGF0ZS5kaXNwb3NhYmxlLmVkaXRpbmdJdGVtLml0ZW1UeXBlID09PSBcIlRleHRCbG9ja1wiKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFZGl0aW5nQmxvY2sgPSB0aGlzLmdldEJsb2NrKHRoaXMuc3RhdGUuZGlzcG9zYWJsZS5lZGl0aW5nSXRlbS5pdGVtSWQpO1xyXG4gICAgICAgICAgICAgICAgaWYoY3VycmVudEVkaXRpbmdCbG9jayl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmVkaXRvckNsb3NlZC5kaXNwYXRjaChjdXJyZW50RWRpdGluZ0Jsb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZihpdGVtKXtcclxuICAgICAgICAgICAgLy8gZWRpdGluZyBpdGVtIHNob3VsZCBiZSBzZWxlY3RlZCBpdGVtXHJcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0YXRlLmRpc3Bvc2FibGUuZWRpdGluZ0l0ZW0gPSBpdGVtO1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWQuZGlzcGF0Y2goaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRCbG9jayhpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC50ZXh0QmxvY2tzLCB0YiA9PiB0Yi5faWQgPT09IGlkKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxudHlwZSBBY3Rpb25UeXBlcyA9IFxyXG4gICAgXCJza2V0Y2guY3JlYXRlXCJcclxuICAgIHwgXCJza2V0Y2gudXBkYXRlXCJcclxuICAgIHwgXCJ0ZXh0YmxvY2suYWRkXCJcclxuICAgIHwgXCJ0ZXh0YmxvY2sudXBkYXRlXCI7XHJcblxyXG50eXBlIEV2ZW50VHlwZXMgPVxyXG4gICAgXCJza2V0Y2gubG9hZGVkXCJcclxuICAgIHwgXCJza2V0Y2guY2hhbmdlZFwiXHJcbiAgICB8IFwidGV4dGJsb2NrLmFkZGVkXCJcclxuICAgIHwgXCJ0ZXh0YmxvY2suY2hhbmdlZFwiO1xyXG4iLCJcclxuY29uc3QgU2tldGNoSGVscGVycyA9IHtcclxuICAgIFxyXG4gICAgY29sb3JzSW5Vc2Uoc2tldGNoOiBTa2V0Y2gpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgbGV0IGNvbG9ycyA9IFsgc2tldGNoLmJhY2tncm91bmRDb2xvciBdO1xyXG4gICAgICAgIGZvcihjb25zdCBibG9jayBvZiBza2V0Y2gudGV4dEJsb2Nrcyl7XHJcbiAgICAgICAgICAgIGNvbG9ycy5wdXNoKGJsb2NrLmJhY2tncm91bmRDb2xvcik7XHJcbiAgICAgICAgICAgIGNvbG9ycy5wdXNoKGJsb2NrLnRleHRDb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbG9ycyA9IF8udW5pcShjb2xvcnMuZmlsdGVyKGMgPT4gYyAhPSBudWxsKSk7XHJcbiAgICAgICAgY29sb3JzLnNvcnQoKTtcclxuICAgICAgICByZXR1cm4gY29sb3JzO1xyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJcclxuaW50ZXJmYWNlIFJldGFpbmVkU3RhdGUge1xyXG4gICAgc2tldGNoOiBTa2V0Y2g7XHJcbn1cclxuXHJcbmludGVyZmFjZSBEaXNwb3NhYmxlU3RhdGUge1xyXG4gICAgZWRpdGluZ0l0ZW0/OiBQb3NpdGlvbmVkT2JqZWN0UmVmO1xyXG4gICAgc2VsZWN0aW9uPzogV29ya3NwYWNlT2JqZWN0UmVmO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgU2tldGNoIHtcclxuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIGRlZmF1bHRGb250RGVzYz86IEZvbnREZXNjcmlwdGlvbjtcclxuICAgIHRleHRCbG9ja3M/OiBUZXh0QmxvY2tbXTtcclxuICAgIGxvYWRpbmc/OiBib29sZWFuO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRm9udEZhbWlseSB7XHJcbiAgICBraW5kPzogc3RyaW5nO1xyXG4gICAgZmFtaWx5Pzogc3RyaW5nO1xyXG4gICAgY2F0ZWdvcnk/OiBzdHJpbmc7XHJcbiAgICB2YXJpYW50cz86IHN0cmluZ1tdO1xyXG4gICAgc3Vic2V0cz86IHN0cmluZ1tdO1xyXG4gICAgdmVyc2lvbj86IHN0cmluZztcclxuICAgIGxhc3RNb2RpZmllZD86IHN0cmluZztcclxuICAgIGZpbGVzPzogeyBbdmFyaWFudDogc3RyaW5nXSA6IHN0cmluZzsgfTtcclxufVxyXG5cclxuaW50ZXJmYWNlIEZvbnREZXNjcmlwdGlvbiB7XHJcbiAgICBmYW1pbHk6IHN0cmluZztcclxuICAgIGNhdGVnb3J5OiBzdHJpbmc7XHJcbiAgICB2YXJpYW50OiBzdHJpbmc7XHJcbiAgICB1cmw6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFdvcmtzcGFjZU9iamVjdFJlZiB7XHJcbiAgICBpdGVtSWQ6IHN0cmluZztcclxuICAgIGl0ZW1UeXBlPzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUG9zaXRpb25lZE9iamVjdFJlZiBleHRlbmRzIFdvcmtzcGFjZU9iamVjdFJlZiB7XHJcbiAgICBjbGllbnRYPzogbnVtYmVyO1xyXG4gICAgY2xpZW50WT86IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFRleHRCbG9jayBleHRlbmRzIEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgX2lkPzogc3RyaW5nO1xyXG4gICAgdGV4dD86IHN0cmluZztcclxuICAgIHRleHRDb2xvcj86IHN0cmluZztcclxuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIGZvbnREZXNjPzogRm9udERlc2NyaXB0aW9uO1xyXG4gICAgZm9udFNpemU/OiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBCbG9ja0FycmFuZ2VtZW50IHtcclxuICAgIHBvc2l0aW9uPzogbnVtYmVyW10sXHJcbiAgICBvdXRsaW5lPzoge1xyXG4gICAgICAgIHRvcDogUGF0aFJlY29yZCxcclxuICAgICAgICBib3R0b206IFBhdGhSZWNvcmRcclxuICAgIH0gICAgXHJcbn1cclxuXHJcbmludGVyZmFjZSBCYWNrZ3JvdW5kQWN0aW9uU3RhdHVzIHtcclxuICAgIGFjdGlvbj86IE9iamVjdDtcclxuICAgIHJlamVjdGVkPzogYm9vbGVhbjtcclxuICAgIGVycm9yPzogYm9vbGVhblxyXG4gICAgbWVzc2FnZT86IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFBhdGhSZWNvcmQge1xyXG4gICAgc2VnbWVudHM6IFNlZ21lbnRSZWNvcmRbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxyXG4gKi9cclxudHlwZSBTZWdtZW50UmVjb3JkID0gQXJyYXk8UG9pbnRSZWNvcmQ+IHwgQXJyYXk8bnVtYmVyPjtcclxuXHJcbnR5cGUgUG9pbnRSZWNvcmQgPSBBcnJheTxudW1iZXI+O1xyXG4iLCJuYW1lc3BhY2UgQ29sb3JQaWNrZXIge1xyXG5cclxuICAgIGNvbnN0IERFRkFVTFRfUEFMRVRURSA9IFtcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzgwN1xyXG4gICAgICAgICAgICBcIiNlZTQwMzVcIixcclxuICAgICAgICAgICAgXCIjZjM3NzM2XCIsXHJcbiAgICAgICAgICAgIFwiI2ZkZjQ5OFwiLFxyXG4gICAgICAgICAgICBcIiM3YmMwNDNcIixcclxuICAgICAgICAgICAgXCIjMDM5MmNmXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzg5NFxyXG4gICAgICAgICAgICBcIiNlZGM5NTFcIixcclxuICAgICAgICAgICAgXCIjZWI2ODQxXCIsXHJcbiAgICAgICAgICAgIFwiI2NjMmEzNlwiLFxyXG4gICAgICAgICAgICBcIiM0ZjM3MmRcIixcclxuICAgICAgICAgICAgXCIjMDBhMGIwXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzE2NFxyXG4gICAgICAgICAgICBcIiMxYjg1YjhcIixcclxuICAgICAgICAgICAgXCIjNWE1MjU1XCIsXHJcbiAgICAgICAgICAgIFwiIzU1OWU4M1wiLFxyXG4gICAgICAgICAgICBcIiNhZTVhNDFcIixcclxuICAgICAgICAgICAgXCIjYzNjYjcxXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzM4OVxyXG4gICAgICAgICAgICBcIiM0YjM4MzJcIixcclxuICAgICAgICAgICAgXCIjODU0NDQyXCIsXHJcbiAgICAgICAgICAgIFwiI2ZmZjRlNlwiLFxyXG4gICAgICAgICAgICBcIiMzYzJmMmZcIixcclxuICAgICAgICAgICAgXCIjYmU5YjdiXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzQ1NVxyXG4gICAgICAgICAgICBcIiNmZjRlNTBcIixcclxuICAgICAgICAgICAgXCIjZmM5MTNhXCIsXHJcbiAgICAgICAgICAgIFwiI2Y5ZDYyZVwiLFxyXG4gICAgICAgICAgICBcIiNlYWUzNzRcIixcclxuICAgICAgICAgICAgXCIjZTJmNGM3XCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzcwMFxyXG4gICAgICAgICAgICBcIiNkMTExNDFcIixcclxuICAgICAgICAgICAgXCIjMDBiMTU5XCIsXHJcbiAgICAgICAgICAgIFwiIzAwYWVkYlwiLFxyXG4gICAgICAgICAgICBcIiNmMzc3MzVcIixcclxuICAgICAgICAgICAgXCIjZmZjNDI1XCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzgyNlxyXG4gICAgICAgICAgICBcIiNlOGQxNzRcIixcclxuICAgICAgICAgICAgXCIjZTM5ZTU0XCIsXHJcbiAgICAgICAgICAgIFwiI2Q2NGQ0ZFwiLFxyXG4gICAgICAgICAgICBcIiM0ZDczNThcIixcclxuICAgICAgICAgICAgXCIjOWVkNjcwXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzEyMjNcclxuICAgICAgICAgICAgXCIjZmZkNGU1XCIsXHJcbiAgICAgICAgICAgIFwiI2Q0ZmZlYVwiLFxyXG4gICAgICAgICAgICBcIiNlZWNiZmZcIixcclxuICAgICAgICAgICAgXCIjZmVmZmEzXCIsXHJcbiAgICAgICAgICAgIFwiI2RiZGNmZlwiLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICBcIiMwMDBcIiwgXCIjNjY2XCIsIFwiI2NjY1wiLCBcIiNlZWVcIiwgXCIjZmZmXCJcclxuICAgICAgICBdLFxyXG4gICAgXTtcclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gc2V0dXAoZWxlbSwgdG9wQ29sb3JzOiBzdHJpbmdbXSwgb25DaGFuZ2UpIHtcclxuICAgICAgICBjb25zdCB0b3BDb2xvcnNHcm91cGVkID0gXy5jaHVuayh0b3BDb2xvcnMsIDUpO1xyXG4gICAgICAgIGNvbnN0IHBhbGV0dGUgPSB0b3BDb2xvcnNHcm91cGVkLmNvbmNhdChERUZBVUxUX1BBTEVUVEUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzZWwgPSA8YW55PiQoZWxlbSk7XHJcbiAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oe1xyXG4gICAgICAgICAgICBzaG93SW5wdXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGFsbG93RW1wdHk6IHRydWUsXHJcbiAgICAgICAgICAgIHByZWZlcnJlZEZvcm1hdDogXCJoZXhcIixcclxuICAgICAgICAgICAgc2hvd0J1dHRvbnM6IGZhbHNlLFxyXG4gICAgICAgICAgICBzaG93QWxwaGE6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dQYWxldHRlOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93U2VsZWN0aW9uUGFsZXR0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHBhbGV0dGU6IHBhbGV0dGUsXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZUtleTogXCJza2V0Y2h0ZXh0XCIsXHJcbiAgICAgICAgICAgIGNoYW5nZTogb25DaGFuZ2VcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHNldChlbGVtOiBIVE1MRWxlbWVudCwgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICg8YW55PiQoZWxlbSkpLnNwZWN0cnVtKFwic2V0XCIsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGVzdHJveShlbGVtKSB7XHJcbiAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oXCJkZXN0cm95XCIpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBEb2N1bWVudEtleUhhbmRsZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG5cclxuICAgICAgICAvLyBub3RlOiB1bmRpc3Bvc2VkIGV2ZW50IHN1YnNjcmlwdGlvblxyXG4gICAgICAgICQoZG9jdW1lbnQpLmtleXVwKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSBEb21IZWxwZXJzLktleUNvZGVzLkVzYykge1xyXG4gICAgICAgICAgICAgICAgaWYoc3RvcmUuc3RhdGUuZGlzcG9zYWJsZS5lZGl0aW5nSXRlbSl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0RWRpdGluZ0l0ZW0uZGlzcGF0Y2gobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbn0iLCJcclxuZGVjbGFyZSB2YXIgUmVhY3RTZWxlY3Q7XHJcblxyXG5pbnRlcmZhY2UgRm9udFBpY2tlclByb3BzIHtcclxuICAgIHN0b3JlOiBTdG9yZTsgICAgXHJcbiAgICBzZWxlY3Rpb24/OiBGb250RGVzY3JpcHRpb247XHJcbiAgICBzZWxlY3Rpb25DaGFuZ2VkOiAoc2VsZWN0aW9uOiBGb250RGVzY3JpcHRpb24pID0+IHZvaWQ7XHJcbn1cclxuXHJcbmludGVyZmFjZSBGb250UGlja2VyU3RhdGUge1xyXG4gICAgZmFtaWx5T2JqZWN0PzogRm9udEZhbWlseTtcclxuICAgIHZhcmlhbnQ/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmNsYXNzIEZvbnRQaWNrZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8Rm9udFBpY2tlclByb3BzLCBGb250UGlja2VyU3RhdGU+IHtcclxuICAgIFxyXG4gICAgcHJldmlld0ZvbnRTaXplID0gXCIyOHB4XCI7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBGb250UGlja2VyUHJvcHMpe1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0YXRlID0ge307XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5wcm9wcy5zZWxlY3Rpb24pe1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmZhbWlseU9iamVjdCA9IHRoaXMucHJvcHMuc3RvcmUucmVzb3VyY2VzLmZvbnRGYW1pbGllc1t0aGlzLnByb3BzLnNlbGVjdGlvbi5mYW1pbHldO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnZhcmlhbnQgPSB0aGlzLnByb3BzLnNlbGVjdGlvbi52YXJpYW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGZhbWlseU9wdGlvblJlbmRlciA9IChvcHRpb24pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZm9udEZhbWlseSA9IG9wdGlvbi52YWx1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHJoKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcy5wcmV2aWV3Rm9udFNpemVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgW2ZvbnRGYW1pbHldKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHZhcmlhbnRPcHRpb25SZW5kZXIgPSAob3B0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnRWYXJpYW50ID0gb3B0aW9uLnZhbHVlO1xyXG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IDxhbnk+Rm9udEhlbHBlcnMuZ2V0Q3NzU3R5bGUodGhpcy5zdGF0ZS5mYW1pbHlPYmplY3QuZmFtaWx5LCBmb250VmFyaWFudCk7XHJcbiAgICAgICAgICAgIHN0eWxlLmZvbnRTaXplID0gdGhpcy5wcmV2aWV3Rm9udFNpemU7XHJcbiAgICAgICAgICAgIHJldHVybiByaChcImRpdlwiLCB7IHN0eWxlIH0sIFxyXG4gICAgICAgICAgICAgICBbYCR7dGhpcy5zdGF0ZS5mYW1pbHlPYmplY3QuZmFtaWx5fSAke29wdGlvbi52YWx1ZX1gXSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcmgoXCJkaXZcIixcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJmb250LXBpY2tlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIHJoKFJlYWN0U2VsZWN0LCB7IFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJmb250LWZhbWlseVwiLCBcclxuICAgICAgICAgICAgICAgIGtleTogXCJmb250LWZhbWlseVwiLFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImZvbnQtZmFtaWx5XCIsIFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuc3RhdGUuZmFtaWx5T2JqZWN0ICYmIHRoaXMuc3RhdGUuZmFtaWx5T2JqZWN0LmZhbWlseSxcclxuICAgICAgICAgICAgICAgIGNsZWFyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB0aGlzLmdldEZhbWlseU9wdGlvbnMoKSwgXHJcbiAgICAgICAgICAgICAgICBvcHRpb25SZW5kZXJlcjogZmFtaWx5T3B0aW9uUmVuZGVyLFxyXG4gICAgICAgICAgICAgICAgdmFsdWVSZW5kZXJlcjogZmFtaWx5T3B0aW9uUmVuZGVyLFxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U6IChmKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmFtaWx5T2JqZWN0ID0gdGhpcy5wcm9wcy5zdG9yZS5yZXNvdXJjZXMuZm9udEZhbWlsaWVzW2ZdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhbnQgPSBfLmxhc3QoZmFtaWx5T2JqZWN0LnZhcmlhbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIodiA9PiB2LmluZGV4T2YoXCJpdGFsaWNcIikgPCAwKSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFtaWx5T2JqZWN0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB0aGlzLnNlbmRTZWxlY3Rpb25DaGFuZ2VkKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgLy8gb25seSBzaG93IGZvciBtdWx0aXBsZSB2YXJpYW50c1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmZhbWlseU9iamVjdCAmJiB0aGlzLnN0YXRlLmZhbWlseU9iamVjdC52YXJpYW50cy5sZW5ndGggPiAxICYmXHJcbiAgICAgICAgICAgIHJoKFJlYWN0U2VsZWN0LCB7IFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJmb250LXZhcmlhbnRcIiwgXHJcbiAgICAgICAgICAgICAgICBrZXk6IFwiZm9udC12YXJpYW50XCIsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZm9udC12YXJpYW50XCIsIFxyXG4gICAgICAgICAgICAgICAgY2xlYXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnN0YXRlLnZhcmlhbnQsXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB0aGlzLnN0YXRlLmZhbWlseU9iamVjdCAmJiB0aGlzLnN0YXRlLmZhbWlseU9iamVjdC52YXJpYW50cy5tYXAodiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IHYsIGxhYmVsOiB2IH07XHJcbiAgICAgICAgICAgICAgICB9KSwgXHJcbiAgICAgICAgICAgICAgICBvcHRpb25SZW5kZXJlcjogdmFyaWFudE9wdGlvblJlbmRlcixcclxuICAgICAgICAgICAgICAgIHZhbHVlUmVuZGVyZXI6IHZhcmlhbnRPcHRpb25SZW5kZXIsXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZTogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYW1pbHlPYmplY3Q6IHRoaXMuc3RhdGUuZmFtaWx5T2JqZWN0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50OiB2YWx1ZSBcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4gdGhpcy5zZW5kU2VsZWN0aW9uQ2hhbmdlZCgpICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgIF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VuZFNlbGVjdGlvbkNoYW5nZWQoKXtcclxuICAgICAgICB0aGlzLnByb3BzLnNlbGVjdGlvbkNoYW5nZWQoXHJcbiAgICAgICAgICAgIEZvbnRIZWxwZXJzLmdldERlc2NyaXB0aW9uKHRoaXMuc3RhdGUuZmFtaWx5T2JqZWN0LCB0aGlzLnN0YXRlLnZhcmlhbnQpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBnZXRGYW1pbHlPcHRpb25zKCk6IHsgdmFsdWU6IEZvbnRGYW1pbHksIGxhYmVsOiBzdHJpbmd9W10ge1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBfLnZhbHVlcyh0aGlzLnByb3BzLnN0b3JlLnJlc291cmNlcy5mb250RmFtaWxpZXMpXHJcbiAgICAgICAgICAgIC5tYXAoKGZvbnRGYW1pbHk6IEZvbnRGYW1pbHkpID0+IFxyXG4gICAgICAgICAgICAgICAgeyByZXR1cm4geyB2YWx1ZTogZm9udEZhbWlseS5mYW1pbHksIGxhYmVsOiBmb250RmFtaWx5LmZhbWlseSB9OyB9KTtcclxuICAgICAgICByZXR1cm4gb3B0aW9ucztcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgU2VsZWN0ZWRJdGVtRWRpdG9yIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuXHJcbiAgICAgICAgY29uc3QgZG9tJCA9IHN0b3JlLmV2ZW50cy5tZXJnZVR5cGVkPGFueT4oIFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWQsXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZFxyXG4gICAgICAgICAgICApLm1hcChpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBvc0l0ZW0gPSA8UG9zaXRpb25lZE9iamVjdFJlZj5pLmRhdGE7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHBvc0l0ZW1cclxuICAgICAgICAgICAgICAgICYmIHBvc0l0ZW0uaXRlbVR5cGUgPT09ICdUZXh0QmxvY2snXHJcbiAgICAgICAgICAgICAgICAmJiBfLmZpbmQoc3RvcmUuc3RhdGUucmV0YWluZWQuc2tldGNoLnRleHRCbG9ja3MsIFxyXG4gICAgICAgICAgICAgICAgICAgIGIgPT4gYi5faWQgPT09IHBvc0l0ZW0uaXRlbUlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghYmxvY2spIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBoKCdkaXYjZWRpdG9yT3ZlcmxheScsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJub25lXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaCgnZGl2I2VkaXRvck92ZXJsYXknLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IHBvc0l0ZW0uY2xpZW50WCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBwb3NJdGVtLmNsaWVudFkgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiei1pbmRleFwiOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgVGV4dEJsb2NrRWRpdG9yKHN0b3JlKS5yZW5kZXIoYmxvY2spXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgU2tldGNoRWRpdG9yIGV4dGVuZHMgQ29tcG9uZW50PFNrZXRjaD4ge1xyXG5cclxuICAgIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcblxyXG4gICAgICAgIGNvbnN0IHNrZXRjaERvbSQgPSBzdG9yZS5ldmVudHMubWVyZ2UoXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLFxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkKVxyXG4gICAgICAgICAgICAubWFwKG0gPT4gdGhpcy5yZW5kZXIoc3RvcmUuc3RhdGUucmV0YWluZWQuc2tldGNoKSk7XHJcbiAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKHNrZXRjaERvbSQsIGNvbnRhaW5lcik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihza2V0Y2g6IFNrZXRjaCkge1xyXG5cclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXZcIiwgW1xyXG4gICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJBZGQgdGV4dDogXCIpLFxyXG4gICAgICAgICAgICBoKFwiaW5wdXQuYWRkLXRleHRcIiwge1xyXG4gICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBldi50YXJnZXQgJiYgZXYudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay5hZGQuZGlzcGF0Y2goeyB0ZXh0OiB0ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnRhcmdldC52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJQcmVzcyBbRW50ZXJdIHRvIGFkZFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJCYWNrZ3JvdW5kOiBcIiksXHJcbiAgICAgICAgICAgIGgoXCJpbnB1dC5iYWNrZ3JvdW5kLWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBza2V0Y2guYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5hdHRyVXBkYXRlLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlOiAob2xkVm5vZGUsIHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXQodm5vZGUuZWxtLCBza2V0Y2guYmFja2dyb3VuZENvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgIEJvb3RTY3JpcHQuZHJvcGRvd24oe1xyXG4gICAgICAgICAgICAgICAgaWQ6IFwic2tldGNoTWVudVwiLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogXCJBY3Rpb25zXCIsXHJcbiAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJOZXdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDcmVhdGUgbmV3IHNrZXRjaFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5jcmVhdGUuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiWm9vbSB0byBmaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJGaXQgY29udGVudHMgaW4gdmlld1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmRlc2lnbmVyLnpvb21Ub0ZpdC5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJFeHBvcnQgaW1hZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFeHBvcnQgRmlkZGxlIGFzIFBOR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5kZXNpZ25lci5leHBvcnRQTkcuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRXhwb3J0IFNWR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkV4cG9ydCBGaWRkbGUgYXMgdmVjdG9yIGdyYXBoaWNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZGVzaWduZXIuZXhwb3J0U1ZHLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIF1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIFRleHRCbG9ja0VkaXRvciBleHRlbmRzIENvbXBvbmVudDxUZXh0QmxvY2s+IHtcclxuICAgIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGV4dEJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XHJcbiAgICAgICAgbGV0IHVwZGF0ZSA9IHRiID0+IHtcclxuICAgICAgICAgICAgdGIuX2lkID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyLmRpc3BhdGNoKHRiKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBoKFwiZGl2LnRleHQtYmxvY2stZWRpdG9yXCIsXHJcbiAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICBoKFwidGV4dGFyZWFcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLnRleHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleXByZXNzOiAoZXY6S2V5Ym9hcmRFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKHsgdGV4dDogKDxIVE1MVGV4dEFyZWFFbGVtZW50PmV2LnRhcmdldCkudmFsdWUgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0RWRpdGluZ0l0ZW0uZGlzcGF0Y2gobnVsbCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZXYgPT4gdXBkYXRlKHsgdGV4dDogZXYudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5mb3JlXCIsIHt9LCBcIkFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC50ZXh0LWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlRleHQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0Q29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2tldGNoSGVscGVycy5jb2xvcnNJblVzZSh0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgdGV4dENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcImRpdi5mb250LWNvbG9yLWljb24uYmFja1wiLCB7fSwgXCJBXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCYWNrZ3JvdW5kIGNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHVwZGF0ZSh7IGJhY2tncm91bmRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgICAgIGgoXCJidXR0b24uZGVsZXRlLXRleHRibG9jay5idG4uYnRuLWRhbmdlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZS5kaXNwYXRjaCh0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcInNwYW4uZ2x5cGhpY29uLmdseXBoaWNvbi10cmFzaFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImRpdi5mb250LXBpY2tlci1jb250YWluZXJcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvcHM6IEZvbnRQaWNrZXJQcm9wcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmU6IHRoaXMuc3RvcmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbjogdGV4dEJsb2NrLmZvbnREZXNjLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkOiAoZm9udERlc2MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSh7IGZvbnREZXNjIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdERPTS5yZW5kZXIocmgoRm9udFBpY2tlciwgcHJvcHMpLCB2bm9kZS5lbG0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImRpdi5lbmQtY29udHJvbHNcIiwge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5jbGFzcyBXb3Jrc3BhY2VDb250cm9sbGVyIHtcclxuXHJcbiAgICBzdGF0aWMgVEVYVF9DSEFOR0VfUkVOREVSX1RIUk9UVExFX01TID0gNTAwO1xyXG4gICAgc3RhdGljIEJMT0NLX0JPVU5EU19DSEFOR0VfVEhST1RUTEVfTVMgPSA1MDA7XHJcblxyXG4gICAgZGVmYXVsdFNpemUgPSBuZXcgcGFwZXIuU2l6ZSg1MDAwMCwgNDAwMDApO1xyXG4gICAgZGVmYXVsdFNjYWxlID0gMC4wMjtcclxuXHJcbiAgICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuICAgIGZhbGxiYWNrRm9udDogb3BlbnR5cGUuRm9udDtcclxuICAgIHZpZXdab29tOiBWaWV3Wm9vbTtcclxuXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuICAgIHByaXZhdGUgX3NrZXRjaDogU2tldGNoO1xyXG4gICAgcHJpdmF0ZSBfdGV4dEJsb2NrSXRlbXM6IHsgW3RleHRCbG9ja0lkOiBzdHJpbmddOiBUZXh0V2FycCB9ID0ge307XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlLCBmYWxsYmFja0ZvbnQ6IG9wZW50eXBlLkZvbnQpIHtcclxuICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgdGhpcy5mYWxsYmFja0ZvbnQgPSBmYWxsYmFja0ZvbnQ7XHJcbiAgICAgICAgcGFwZXIuc2V0dGluZ3MuaGFuZGxlU2l6ZSA9IDE7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluQ2FudmFzJyk7XHJcbiAgICAgICAgcGFwZXIuc2V0dXAodGhpcy5jYW52YXMpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdCA9IHBhcGVyLnByb2plY3Q7XHJcblxyXG4gICAgICAgIHRoaXMudmlld1pvb20gPSBuZXcgVmlld1pvb20odGhpcy5wcm9qZWN0KTtcclxuICAgICAgICB0aGlzLnZpZXdab29tLnZpZXdDaGFuZ2VkLnN1YnNjcmliZShib3VuZHMgPT4ge1xyXG4gICAgICAgICAgIHN0b3JlLmFjdGlvbnMuZGVzaWduZXIudmlld0NoYW5nZWQuZGlzcGF0Y2goYm91bmRzKTsgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY2xlYXJTZWxlY3Rpb24gPSAoZXY6IHBhcGVyLlBhcGVyTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZihzdG9yZS5zdGF0ZS5kaXNwb3NhYmxlLmVkaXRpbmdJdGVtKXtcclxuICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuc2tldGNoLnNldEVkaXRpbmdJdGVtLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoc3RvcmUuc3RhdGUuZGlzcG9zYWJsZS5zZWxlY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcGVyLnZpZXcub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBjbGVhclNlbGVjdGlvbik7XHJcbiAgICAgICAgcGFwZXIudmlldy5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLnNtYXJ0RHJhZ1N0YXJ0LCBjbGVhclNlbGVjdGlvbik7XHJcbiAgICAgICAgLy8gcGFwZXIudmlldy5vbihcImtleXVwXCIsIChldjogcGFwZXIuS2V5RXZlbnQpID0+IHtcclxuICAgICAgICAvLyB9KTsgXHJcblxyXG4gICAgICAgIGNvbnN0IGtleUhhbmRsZXIgPSBuZXcgRG9jdW1lbnRLZXlIYW5kbGVyKHN0b3JlKTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gRGVzaWduZXIgLS0tLS1cclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLmRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnpvb21Ub0ZpdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMuZGVzaWduZXIuZXhwb3J0UE5HUmVxdWVzdGVkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZG93bmxvYWRQTkcoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLmRlc2lnbmVyLmV4cG9ydFNWR1JlcXVlc3RlZC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRvd25sb2FkU1ZHKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIFNrZXRjaCAtLS0tLVxyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NrZXRjaCA9IGV2LmRhdGE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGV4dEJsb2NrSXRlbXMgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guc2VsZWN0aW9uQ2hhbmdlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICBpZihtLmRhdGEpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gbS5kYXRhLml0ZW1JZCAmJiB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuaXRlbUlkXTtcclxuICAgICAgICAgICAgICAgIGlmIChibG9jayAmJiAhYmxvY2suc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gVGV4dEJsb2NrIC0tLS0tXHJcblxyXG4gICAgICAgIHN0b3JlLmV2ZW50cy5tZXJnZVR5cGVkKFxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmFkZGVkLFxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmxvYWRlZFxyXG4gICAgICAgICkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICBldiA9PiB0aGlzLmFkZEJsb2NrKGV2LmRhdGEpKTtcclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5hdHRyQ2hhbmdlZFxyXG4gICAgICAgICAgICAub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgIC50aHJvdHRsZShXb3Jrc3BhY2VDb250cm9sbGVyLlRFWFRfQ0hBTkdFX1JFTkRFUl9USFJPVFRMRV9NUylcclxuICAgICAgICAgICAgLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHRCbG9jayA9IG0uZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnRleHQgPSB0ZXh0QmxvY2sudGV4dDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGV4dEJsb2NrLmZvbnREZXNjICYmIHRleHRCbG9jay5mb250RGVzYy51cmwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHVzaCBpbiBmb250IHdoZW4gcmVhZHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldCh0ZXh0QmxvY2suZm9udERlc2MudXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHVybCwgZm9udCkgPT4gaXRlbS5mb250ID0gZm9udCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY3VzdG9tU3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0ZXh0QmxvY2suZm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogdGV4dEJsb2NrLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5yZW1vdmVkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5lZGl0b3JDbG9zZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB6b29tVG9GaXQoKSB7XHJcbiAgICAgICAgbGV0IGJvdW5kczogcGFwZXIuUmVjdGFuZ2xlO1xyXG4gICAgICAgIF8uZm9yT3duKHRoaXMuX3RleHRCbG9ja0l0ZW1zLCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBib3VuZHMgPSBib3VuZHNcclxuICAgICAgICAgICAgICAgID8gYm91bmRzLnVuaXRlKGl0ZW0uYm91bmRzKVxyXG4gICAgICAgICAgICAgICAgOiBpdGVtLmJvdW5kcztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFib3VuZHMpIHtcclxuICAgICAgICAgICAgYm91bmRzID0gbmV3IHBhcGVyLlJlY3RhbmdsZShuZXcgcGFwZXIuUG9pbnQoMCwgMCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTaXplLm11bHRpcGx5KHRoaXMuZGVmYXVsdFNjYWxlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZpZXdab29tLnpvb21Ubyhib3VuZHMuc2NhbGUoMS4wNSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZG93bmxvYWRQTkcoKSB7XHJcbiAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHRoaXMuaW5zZXJ0QmFja2dyb3VuZCgpO1xyXG4gICAgICAgIGNvbnN0IHJhc3RlciA9IGFwcC53b3Jrc3BhY2VDb250cm9sbGVyLnByb2plY3QuYWN0aXZlTGF5ZXIucmFzdGVyaXplKDMwMCwgZmFsc2UpO1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSByYXN0ZXIudG9EYXRhVVJMKCk7XHJcbiAgICAgICAgRG9tSGVscGVycy5kb3dubG9hZEZpbGUoZGF0YSwgdGhpcy5nZXRTa2V0Y2hGaWxlTmFtZSg0MCwgXCJwbmdcIikpO1xyXG4gICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkb3dubG9hZFNWRygpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZDogcGFwZXIuSXRlbTtcclxuICAgICAgICBpZih0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5iYWNrZ3JvdW5kQ29sb3Ipe1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kID0gdGhpcy5pbnNlcnRCYWNrZ3JvdW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB1cmwgPSBcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LFwiICsgZW5jb2RlVVJJQ29tcG9uZW50KFxyXG4gICAgICAgICAgICA8c3RyaW5nPnRoaXMucHJvamVjdC5leHBvcnRTVkcoeyBhc1N0cmluZzogdHJ1ZSB9KSk7XHJcbiAgICAgICAgRG9tSGVscGVycy5kb3dubG9hZEZpbGUodXJsLCB0aGlzLmdldFNrZXRjaEZpbGVOYW1lKDQwLCBcInN2Z1wiKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoYmFja2dyb3VuZCl7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U2tldGNoRmlsZU5hbWUobGVuZ3RoOiBudW1iZXIsIGV4dGVuc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgb3V0ZXI6XHJcbiAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiB0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBibG9jay50ZXh0LnNwbGl0KC9cXHMvKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHJpbSA9IHdvcmQucmVwbGFjZSgvXFxXL2csICcnKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJpbS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGgpIG5hbWUgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZSArPSB0cmltO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUubGVuZ3RoID49IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghbmFtZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbmFtZSA9IFwiZmlkZGxlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuYW1lICsgXCIuXCIgKyBleHRlbnNpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgc2tldGNoIGJhY2tncm91bmQgdG8gcHJvdmlkZSBiYWNrZ3JvdW5kIGZpbGwgKGlmIG5lY2Vzc2FyeSlcclxuICAgICAqICAgYW5kIGFkZCBtYXJnaW4gYXJvdW5kIGVkZ2VzLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluc2VydEJhY2tncm91bmQoKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgY29uc3QgYm91bmRzID0gYXBwLndvcmtzcGFjZUNvbnRyb2xsZXIucHJvamVjdC5hY3RpdmVMYXllci5ib3VuZHM7XHJcbiAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHBhcGVyLlNoYXBlLlJlY3RhbmdsZShcclxuICAgICAgICAgICAgYm91bmRzLnRvcExlZnQuc3VidHJhY3QoMjApLFxyXG4gICAgICAgICAgICBib3VuZHMuYm90dG9tUmlnaHQuYWRkKDIwKSk7XHJcbiAgICAgICAgYmFja2dyb3VuZC5maWxsQ29sb3IgPSB0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgYmFja2dyb3VuZC5zZW5kVG9CYWNrKCk7XHJcbiAgICAgICAgcmV0dXJuIGJhY2tncm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRCbG9jayh0ZXh0QmxvY2s6IFRleHRCbG9jaykge1xyXG4gICAgICAgIGlmICghdGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGV4dEJsb2NrLl9pZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdyZWNlaXZlZCBibG9jayB3aXRob3V0IGlkJywgdGV4dEJsb2NrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbdGV4dEJsb2NrLl9pZF07XHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlJlY2VpdmVkIGFkZEJsb2NrIGZvciBibG9jayB0aGF0IGlzIGFscmVhZHkgbG9hZGVkXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYm91bmRzOiB7IHVwcGVyOiBwYXBlci5TZWdtZW50W10sIGxvd2VyOiBwYXBlci5TZWdtZW50W10gfTtcclxuXHJcbiAgICAgICAgaWYgKHRleHRCbG9jay5vdXRsaW5lKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvYWRTZWdtZW50ID0gKHJlY29yZDogU2VnbWVudFJlY29yZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9pbnQgPSByZWNvcmRbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuU2VnbWVudChcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KHJlY29yZFswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZFsxXSAmJiBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkWzJdICYmIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMl0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KG5ldyBwYXBlci5Qb2ludChyZWNvcmQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgYm91bmRzID0ge1xyXG4gICAgICAgICAgICAgICAgdXBwZXI6IHRleHRCbG9jay5vdXRsaW5lLnRvcC5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpLFxyXG4gICAgICAgICAgICAgICAgbG93ZXI6IHRleHRCbG9jay5vdXRsaW5lLmJvdHRvbS5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtID0gbmV3IFRleHRXYXJwKFxyXG4gICAgICAgICAgICB0aGlzLmZhbGxiYWNrRm9udCxcclxuICAgICAgICAgICAgdGV4dEJsb2NrLnRleHQsXHJcbiAgICAgICAgICAgIGJvdW5kcyxcclxuICAgICAgICAgICAgdGV4dEJsb2NrLmZvbnRTaXplLCB7XHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogdGV4dEJsb2NrLmZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yIHx8IFwicmVkXCIsICAgIC8vIHRleHRDb2xvciBzaG91bGQgaGF2ZSBiZWVuIHNldCBlbHNld2hlcmUgXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0QmxvY2suZm9udERlc2MgJiYgdGV4dEJsb2NrLmZvbnREZXNjLnVybCkge1xyXG4gICAgICAgICAgICAvLyBwdXNoIGluIGZvbnQgd2hlbiByZWFkeVxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnJlc291cmNlcy5wYXJzZWRGb250cy5nZXQodGV4dEJsb2NrLmZvbnREZXNjLnVybCxcclxuICAgICAgICAgICAgICAgICh1cmwsIGZvbnQpID0+IGl0ZW0uZm9udCA9IGZvbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0ZXh0QmxvY2sub3V0bGluZSAmJiB0ZXh0QmxvY2sucG9zaXRpb24pIHtcclxuICAgICAgICAgICAgaXRlbS5wb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludCh0ZXh0QmxvY2sucG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2VuZEVkaXRBY3Rpb24gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVkaXRvckF0ID0gdGhpcy5wcm9qZWN0LnZpZXcucHJvamVjdFRvVmlldyhcclxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5taWRwb2ludChpdGVtLmJvdW5kcy50b3BMZWZ0LCBpdGVtLmJvdW5kcy5jZW50ZXIpKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRFZGl0aW5nSXRlbS5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtSWQ6IHRleHRCbG9jay5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50WDogZWRpdG9yQXQueCxcclxuICAgICAgICAgICAgICAgICAgICBjbGllbnRZOiBlZGl0b3JBdC55XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpdGVtLm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuY2xpY2tXaXRob3V0RHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgc2VuZEVkaXRBY3Rpb24oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHNlbGVjdCBpdGVtXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICB7IGl0ZW1JZDogdGV4dEJsb2NrLl9pZCwgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXRlbS5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLnNtYXJ0RHJhZ1N0YXJ0LCBldiA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgIGlmICghaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IHRleHRCbG9jay5faWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ZW0ub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdFbmQsIGV2ID0+IHtcclxuICAgICAgICAgICAgbGV0IGJsb2NrID0gPFRleHRCbG9jaz50aGlzLmdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbSk7XHJcbiAgICAgICAgICAgIGJsb2NrLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGl0ZW1DaGFuZ2UkID0gUGFwZXJOb3RpZnkub2JzZXJ2ZShpdGVtLCBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkdFT01FVFJZKTtcclxuICAgICAgICBpdGVtQ2hhbmdlJFxyXG4gICAgICAgICAgICAuZGVib3VuY2UoV29ya3NwYWNlQ29udHJvbGxlci5CTE9DS19CT1VORFNfQ0hBTkdFX1RIUk9UVExFX01TKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+dGhpcy5nZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgYmxvY2suX2lkID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdGVtLmRhdGEgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgIGlmICghdGV4dEJsb2NrLnBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSB0aGlzLnByb2plY3Qudmlldy5ib3VuZHMucG9pbnQuYWRkKFxyXG4gICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGl0ZW0uYm91bmRzLndpZHRoIC8gMiwgaXRlbS5ib3VuZHMuaGVpZ2h0IC8gMilcclxuICAgICAgICAgICAgICAgICAgICAuYWRkKDUwKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3RleHRCbG9ja0l0ZW1zW3RleHRCbG9jay5faWRdID0gaXRlbTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5sb2FkaW5nXHJcbiAgICAgICAgICAgICYmIHRoaXMuc3RvcmUuc3RhdGUucmV0YWluZWQuc2tldGNoLnRleHRCbG9ja3MubGVuZ3RoIDw9IDEpIHtcclxuICAgICAgICAgICAgLy8gb3BlbiBlZGl0b3IgZm9yIG5ld2x5IGFkZGVkIGJsb2NrXHJcbiAgICAgICAgICAgIHNlbmRFZGl0QWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtOiBUZXh0V2FycCk6IEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgICAgIC8vIGV4cG9ydCByZXR1cm5zIGFuIGFycmF5IHdpdGggaXRlbSB0eXBlIGFuZCBzZXJpYWxpemVkIG9iamVjdDpcclxuICAgICAgICAvLyAgIFtcIlBhdGhcIiwgUGF0aFJlY29yZF1cclxuICAgICAgICBjb25zdCB0b3AgPSA8UGF0aFJlY29yZD5pdGVtLnVwcGVyLmV4cG9ydEpTT04oeyBhc1N0cmluZzogZmFsc2UgfSlbMV07XHJcbiAgICAgICAgY29uc3QgYm90dG9tID0gPFBhdGhSZWNvcmQ+aXRlbS5sb3dlci5leHBvcnRKU09OKHsgYXNTdHJpbmc6IGZhbHNlIH0pWzFdO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogW2l0ZW0ucG9zaXRpb24ueCwgaXRlbS5wb3NpdGlvbi55XSxcclxuICAgICAgICAgICAgb3V0bGluZTogeyB0b3AsIGJvdHRvbSB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbmRlY2xhcmUgdmFyIHNvbHZlOiAoYTogYW55LCBiOiBhbnksIGZhc3Q6IGJvb2xlYW4pID0+IHZvaWQ7XHJcblxyXG5jbGFzcyBQZXJzcGVjdGl2ZVRyYW5zZm9ybSB7XHJcbiAgICBcclxuICAgIHNvdXJjZTogUXVhZDtcclxuICAgIGRlc3Q6IFF1YWQ7XHJcbiAgICBwZXJzcDogYW55O1xyXG4gICAgbWF0cml4OiBudW1iZXJbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc291cmNlOiBRdWFkLCBkZXN0OiBRdWFkKXtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLmRlc3QgPSBkZXN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0uY3JlYXRlTWF0cml4KHNvdXJjZSwgZGVzdCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEdpdmVuIGEgNHg0IHBlcnNwZWN0aXZlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCwgYW5kIGEgMkQgcG9pbnQgKGEgMngxIHZlY3RvciksXHJcbiAgICAvLyBhcHBsaWVzIHRoZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggYnkgY29udmVydGluZyB0aGUgcG9pbnQgdG8gaG9tb2dlbmVvdXNcclxuICAgIC8vIGNvb3JkaW5hdGVzIGF0IHo9MCwgcG9zdC1tdWx0aXBseWluZywgYW5kIHRoZW4gYXBwbHlpbmcgYSBwZXJzcGVjdGl2ZSBkaXZpZGUuXHJcbiAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgbGV0IHAzID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0ubXVsdGlwbHkodGhpcy5tYXRyaXgsIFtwb2ludC54LCBwb2ludC55LCAwLCAxXSk7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBwYXBlci5Qb2ludChwM1swXSAvIHAzWzNdLCBwM1sxXSAvIHAzWzNdKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgY3JlYXRlTWF0cml4KHNvdXJjZTogUXVhZCwgdGFyZ2V0OiBRdWFkKTogbnVtYmVyW10ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzb3VyY2VQb2ludHMgPSBbXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYS54LCBzb3VyY2UuYS55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYi54LCBzb3VyY2UuYi55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYy54LCBzb3VyY2UuYy55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuZC54LCBzb3VyY2UuZC55XV07XHJcbiAgICAgICAgbGV0IHRhcmdldFBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3RhcmdldC5hLngsIHRhcmdldC5hLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5iLngsIHRhcmdldC5iLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5jLngsIHRhcmdldC5jLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5kLngsIHRhcmdldC5kLnldXTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBhID0gW10sIGIgPSBbXSwgaSA9IDAsIG4gPSBzb3VyY2VQb2ludHMubGVuZ3RoOyBpIDwgbjsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBzID0gc291cmNlUG9pbnRzW2ldLCB0ID0gdGFyZ2V0UG9pbnRzW2ldO1xyXG4gICAgICAgICAgICBhLnB1c2goW3NbMF0sIHNbMV0sIDEsIDAsIDAsIDAsIC1zWzBdICogdFswXSwgLXNbMV0gKiB0WzBdXSksIGIucHVzaCh0WzBdKTtcclxuICAgICAgICAgICAgYS5wdXNoKFswLCAwLCAwLCBzWzBdLCBzWzFdLCAxLCAtc1swXSAqIHRbMV0sIC1zWzFdICogdFsxXV0pLCBiLnB1c2godFsxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgWCA9IHNvbHZlKGEsIGIsIHRydWUpOyBcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBYWzBdLCBYWzNdLCAwLCBYWzZdLFxyXG4gICAgICAgICAgICBYWzFdLCBYWzRdLCAwLCBYWzddLFxyXG4gICAgICAgICAgICAgICAwLCAgICAwLCAxLCAgICAwLFxyXG4gICAgICAgICAgICBYWzJdLCBYWzVdLCAwLCAgICAxXHJcbiAgICAgICAgXS5tYXAoZnVuY3Rpb24oeCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh4ICogMTAwMDAwKSAvIDEwMDAwMDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQb3N0LW11bHRpcGx5IGEgNHg0IG1hdHJpeCBpbiBjb2x1bW4tbWFqb3Igb3JkZXIgYnkgYSA0eDEgY29sdW1uIHZlY3RvcjpcclxuICAgIC8vIFsgbTAgbTQgbTggIG0xMiBdICAgWyB2MCBdICAgWyB4IF1cclxuICAgIC8vIFsgbTEgbTUgbTkgIG0xMyBdICogWyB2MSBdID0gWyB5IF1cclxuICAgIC8vIFsgbTIgbTYgbTEwIG0xNCBdICAgWyB2MiBdICAgWyB6IF1cclxuICAgIC8vIFsgbTMgbTcgbTExIG0xNSBdICAgWyB2MyBdICAgWyB3IF1cclxuICAgIHN0YXRpYyBtdWx0aXBseShtYXRyaXgsIHZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIG1hdHJpeFswXSAqIHZlY3RvclswXSArIG1hdHJpeFs0XSAqIHZlY3RvclsxXSArIG1hdHJpeFs4IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTJdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMV0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNV0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbOSBdICogdmVjdG9yWzJdICsgbWF0cml4WzEzXSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzJdICogdmVjdG9yWzBdICsgbWF0cml4WzZdICogdmVjdG9yWzFdICsgbWF0cml4WzEwXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNF0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFszXSAqIHZlY3RvclswXSArIG1hdHJpeFs3XSAqIHZlY3RvclsxXSArIG1hdHJpeFsxMV0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTVdICogdmVjdG9yWzNdXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUXVhZCB7XHJcbiAgICBhOiBwYXBlci5Qb2ludDtcclxuICAgIGI6IHBhcGVyLlBvaW50O1xyXG4gICAgYzogcGFwZXIuUG9pbnQ7XHJcbiAgICBkOiBwYXBlci5Qb2ludDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50LCBjOiBwYXBlci5Qb2ludCwgZDogcGFwZXIuUG9pbnQpe1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmMgPSBjO1xyXG4gICAgICAgIHRoaXMuZCA9IGQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tUmVjdGFuZ2xlKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICByZWN0LnRvcExlZnQsXHJcbiAgICAgICAgICAgIHJlY3QudG9wUmlnaHQsXHJcbiAgICAgICAgICAgIHJlY3QuYm90dG9tTGVmdCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21SaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tQ29vcmRzKGNvb3JkczogbnVtYmVyW10pIDogUXVhZCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzBdLCBjb29yZHNbMV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzJdLCBjb29yZHNbM10pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzRdLCBjb29yZHNbNV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzZdLCBjb29yZHNbN10pXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhc0Nvb3JkcygpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgdGhpcy5hLngsIHRoaXMuYS55LFxyXG4gICAgICAgICAgICB0aGlzLmIueCwgdGhpcy5iLnksXHJcbiAgICAgICAgICAgIHRoaXMuYy54LCB0aGlzLmMueSxcclxuICAgICAgICAgICAgdGhpcy5kLngsIHRoaXMuZC55XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBEdWFsQm91bmRzUGF0aFdhcnAgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgc3RhdGljIFBPSU5UU19QRVJfUEFUSCA9IDIwMDtcclxuICAgIHN0YXRpYyBVUERBVEVfREVCT1VOQ0UgPSAxNTA7XHJcblxyXG4gICAgcHJpdmF0ZSBfc291cmNlOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBwcml2YXRlIF91cHBlcjogU3RyZXRjaFBhdGg7XHJcbiAgICBwcml2YXRlIF9sb3dlcjogU3RyZXRjaFBhdGg7XHJcbiAgICBwcml2YXRlIF93YXJwZWQ6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIHByaXZhdGUgX291dGxpbmU6IHBhcGVyLlBhdGg7XHJcbiAgICBwcml2YXRlIF9jdXN0b21TdHlsZTogU2tldGNoSXRlbVN0eWxlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHNvdXJjZTogcGFwZXIuQ29tcG91bmRQYXRoLFxyXG4gICAgICAgIGJvdW5kcz86IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9LFxyXG4gICAgICAgIGN1c3RvbVN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vIC0tIGJ1aWxkIGNoaWxkcmVuIC0tXHJcblxyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLl9zb3VyY2UudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoYm91bmRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwcGVyID0gbmV3IFN0cmV0Y2hQYXRoKGJvdW5kcy51cHBlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvd2VyID0gbmV3IFN0cmV0Y2hQYXRoKGJvdW5kcy5sb3dlcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIgPSBuZXcgU3RyZXRjaFBhdGgoW1xyXG4gICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy50b3BMZWZ0KSxcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMudG9wUmlnaHQpXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB0aGlzLl9sb3dlciA9IG5ldyBTdHJldGNoUGF0aChbXHJcbiAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLmJvdHRvbUxlZnQpLFxyXG4gICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy5ib3R0b21SaWdodClcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xCb3VuZHNPcGFjaXR5ID0gMC43NTtcclxuXHJcbiAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgdGhpcy5fbG93ZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcblxyXG4gICAgICAgIHRoaXMuX291dGxpbmUgPSBuZXcgcGFwZXIuUGF0aCh7IGNsb3NlZDogdHJ1ZSB9KTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVTaGFwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLl93YXJwZWQgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHNvdXJjZS5wYXRoRGF0YSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVXYXJwZWQoKTtcclxuXHJcbiAgICAgICAgLy8gLS0gYWRkIGNoaWxkcmVuIC0tXHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGRyZW4oW3RoaXMuX291dGxpbmUsIHRoaXMuX3dhcnBlZCwgdGhpcy5fdXBwZXIsIHRoaXMuX2xvd2VyXSk7XHJcblxyXG4gICAgICAgIC8vIC0tIGFzc2lnbiBzdHlsZSAtLVxyXG5cclxuICAgICAgICB0aGlzLmN1c3RvbVN0eWxlID0gY3VzdG9tU3R5bGUgfHwge1xyXG4gICAgICAgICAgICBzdHJva2VDb2xvcjogXCJsaWdodGdyYXlcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIFBhcGVySGVscGVycy5hZGRTbWFydERyYWcodGhpcyk7XHJcblxyXG4gICAgICAgIC8vIC0tIHNldCB1cCBvYnNlcnZlcnMgLS1cclxuXHJcbiAgICAgICAgUnguT2JzZXJ2YWJsZS5tZXJnZShcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpLFxyXG4gICAgICAgICAgICB0aGlzLl9sb3dlci5wYXRoQ2hhbmdlZC5vYnNlcnZlKCkpXHJcbiAgICAgICAgICAgIC5kZWJvdW5jZShEdWFsQm91bmRzUGF0aFdhcnAuVVBEQVRFX0RFQk9VTkNFKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKHBhdGggPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lU2hhcGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlV2FycGVkKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VkKFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zdWJzY3JpYmUoZmxhZ3MgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkFUVFJJQlVURSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3VwcGVyLnZpc2libGUgIT09IHRoaXMuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cHBlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb3dlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQgdXBwZXIoKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwcGVyLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvd2VyKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb3dlci5wYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzb3VyY2UoKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICByZXR1cm4gPHBhcGVyLkNvbXBvdW5kUGF0aD50aGlzLl9zb3VyY2UuY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc291cmNlKHZhbHVlOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXN0b21TdHlsZSgpOiBTa2V0Y2hJdGVtU3R5bGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXN0b21TdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY3VzdG9tU3R5bGUodmFsdWU6IFNrZXRjaEl0ZW1TdHlsZSkge1xyXG4gICAgICAgIHRoaXMuX2N1c3RvbVN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fd2FycGVkLnN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IHZhbHVlLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNvbnRyb2xCb3VuZHNPcGFjaXR5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl91cHBlci5vcGFjaXR5ID0gdGhpcy5fbG93ZXIub3BhY2l0eSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlV2FycGVkKCkge1xyXG4gICAgICAgIGxldCBvcnRoT3JpZ2luID0gdGhpcy5fc291cmNlLmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgIGxldCBvcnRoV2lkdGggPSB0aGlzLl9zb3VyY2UuYm91bmRzLndpZHRoO1xyXG4gICAgICAgIGxldCBvcnRoSGVpZ2h0ID0gdGhpcy5fc291cmNlLmJvdW5kcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLmR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbihcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aCwgdGhpcy5fbG93ZXIucGF0aCk7XHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgaWYgKCFwb2ludCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KG9ydGhPcmlnaW4pO1xyXG4gICAgICAgICAgICBsZXQgdW5pdCA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gb3J0aEhlaWdodCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0ZWQgPSBwcm9qZWN0aW9uKHVuaXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdQYXRocyA9IHRoaXMuX3NvdXJjZS5jaGlsZHJlblxyXG4gICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IDxwYXBlci5QYXRoPml0ZW07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4UG9pbnRzID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEFzUG9pbnRzKHBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgRHVhbEJvdW5kc1BhdGhXYXJwLlBPSU5UU19QRVJfUEFUSClcclxuICAgICAgICAgICAgICAgICAgICAubWFwKHAgPT4gdHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50KHApKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHhQYXRoID0gbmV3IHBhcGVyLlBhdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8veFBhdGguc2ltcGxpZnkoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4UGF0aDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB0aGlzLl93YXJwZWQucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgICAgICB0aGlzLl93YXJwZWQuYWRkQ2hpbGRyZW4obmV3UGF0aHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlT3V0bGluZVNoYXBlKCkge1xyXG4gICAgICAgIGNvbnN0IGxvd2VyID0gbmV3IHBhcGVyLlBhdGgodGhpcy5fbG93ZXIucGF0aC5zZWdtZW50cyk7XHJcbiAgICAgICAgbG93ZXIucmV2ZXJzZSgpO1xyXG4gICAgICAgIHRoaXMuX291dGxpbmUuc2VnbWVudHMgPSB0aGlzLl91cHBlci5wYXRoLnNlZ21lbnRzLmNvbmNhdChsb3dlci5zZWdtZW50cyk7XHJcbiAgICAgICAgbG93ZXIucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmNsYXNzIFBhdGhIYW5kbGUgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgc3RhdGljIE1BUktFUl9SQURJVVMgPSA4O1xyXG4gICAgc3RhdGljIERSQUdfVEhSRVNIT0xEID0gMztcclxuXHJcbiAgICBwcml2YXRlIF9tYXJrZXI6IHBhcGVyLlNoYXBlO1xyXG4gICAgcHJpdmF0ZSBfc2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgIHByaXZhdGUgX2N1cnZlOiBwYXBlci5DdXJ2ZTtcclxuICAgIHByaXZhdGUgX3Ntb290aGVkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfY3VydmVTcGxpdCA9IG5ldyBPYnNlcnZhYmxlRXZlbnQ8bnVtYmVyPigpO1xyXG4gICAgcHJpdmF0ZSBfY3VydmVDaGFuZ2VVbnN1YjogKCkgPT4gdm9pZDtcclxuICAgIHByaXZhdGUgZHJhZ2dpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXR0YWNoOiBwYXBlci5TZWdtZW50IHwgcGFwZXIuQ3VydmUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBsZXQgcG9zaXRpb246IHBhcGVyLlBvaW50O1xyXG4gICAgICAgIGxldCBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgICAgIGlmIChhdHRhY2ggaW5zdGFuY2VvZiBwYXBlci5TZWdtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQgPSA8cGFwZXIuU2VnbWVudD5hdHRhY2g7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgcGF0aCA9IHRoaXMuX3NlZ21lbnQucGF0aDtcclxuICAgICAgICB9IGVsc2UgaWYgKGF0dGFjaCBpbnN0YW5jZW9mIHBhcGVyLkN1cnZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnZlID0gPHBhcGVyLkN1cnZlPmF0dGFjaDtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XHJcbiAgICAgICAgICAgIHBhdGggPSB0aGlzLl9jdXJ2ZS5wYXRoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwiYXR0YWNoIG11c3QgYmUgU2VnbWVudCBvciBDdXJ2ZVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvc2l0aW9uLCBQYXRoSGFuZGxlLk1BUktFUl9SQURJVVMpO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5zdHJva2VDb2xvciA9IFwiYmx1ZVwiO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5maWxsQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9tYXJrZXIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlQXNTZWdtZW50KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZUFzQ3VydmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFBhcGVySGVscGVycy5hZGRTbWFydERyYWcodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VydmUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBjdXJ2ZSwgcHVwYXRlIHRvIHNlZ21lbnQgaGFuZGxlXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlQ2hhbmdlVW5zdWIoKTsgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gbmV3IHBhcGVyLlNlZ21lbnQodGhpcy5jZW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VydmVJZHggPSB0aGlzLl9jdXJ2ZS5pbmRleDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlLnBhdGguaW5zZXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlSWR4ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VydmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZUFzU2VnbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJ2ZVNwbGl0Lm5vdGlmeShjdXJ2ZUlkeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLnNtYXJ0RHJhZ01vdmUsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQucG9pbnQgPSB0aGlzLmNlbnRlcjtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zbW9vdGhlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLmNsaWNrV2l0aG91dERyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc21vb3RoZWQgPSAhdGhpcy5zbW9vdGhlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9jdXJ2ZUNoYW5nZVVuc3ViID0gcGF0aC5zdWJzY3JpYmUoZmxhZ3MgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VydmUgJiYgIXRoaXMuX3NlZ21lbnQgXHJcbiAgICAgICAgICAgICAgICAmJiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLlNFR01FTlRTKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNtb290aGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zbW9vdGhlZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc21vb3RoZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9zbW9vdGhlZCA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5oYW5kbGVPdXQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VydmVTcGxpdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY3VydmVTcGxpdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2VudGVyKCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY2VudGVyKHBvaW50OiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb2ludDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0eWxlQXNTZWdtZW50KCkge1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5vcGFjaXR5ID0gMC44O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3R5bGVBc0N1cnZlKCkge1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5vcGFjaXR5ID0gMC4zO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5jbGFzcyBQYXRoU2VjdGlvbiBpbXBsZW1lbnRzIHBhcGVyLkN1cnZlbGlrZSB7XHJcbiAgICBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgb2Zmc2V0OiBudW1iZXI7XHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocGF0aDogcGFwZXIuUGF0aCwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRQb2ludEF0KG9mZnNldDogbnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXRoLmdldFBvaW50QXQob2Zmc2V0ICsgdGhpcy5vZmZzZXQpO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFBhdGhUcmFuc2Zvcm0ge1xyXG4gICAgcG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRUcmFuc2Zvcm0gPSBwb2ludFRyYW5zZm9ybTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRUcmFuc2Zvcm0ocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBhdGhJdGVtKHBhdGg6IHBhcGVyLlBhdGhJdGVtKSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtQ29tcG91bmRQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCkge1xyXG4gICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBhdGgocGF0aDogcGFwZXIuUGF0aCkge1xyXG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2YgcGF0aC5zZWdtZW50cykge1xyXG4gICAgICAgICAgICBsZXQgb3JpZ1BvaW50ID0gc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgbGV0IG5ld1BvaW50ID0gdGhpcy50cmFuc2Zvcm1Qb2ludChzZWdtZW50LnBvaW50KTtcclxuICAgICAgICAgICAgb3JpZ1BvaW50LnggPSBuZXdQb2ludC54O1xyXG4gICAgICAgICAgICBvcmlnUG9pbnQueSA9IG5ld1BvaW50Lnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoUGF0aCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuXHJcbiAgICBwcml2YXRlIF9wYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgcHJpdmF0ZSBfcGF0aENoYW5nZWQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlBhdGg+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2VnbWVudHM6IHBhcGVyLlNlZ21lbnRbXSwgc3R5bGU/OiBwYXBlci5TdHlsZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3BhdGggPSBuZXcgcGFwZXIuUGF0aChzZWdtZW50cyk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9wYXRoKTtcclxuXHJcbiAgICAgICAgaWYoc3R5bGUpe1xyXG4gICAgICAgICAgICB0aGlzLl9wYXRoLnN0eWxlID0gc3R5bGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHJva2VDb2xvciA9IFwibGlnaHRncmF5XCI7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhdGguc3Ryb2tlV2lkdGggPSA2O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IoY29uc3QgcyBvZiB0aGlzLl9wYXRoLnNlZ21lbnRzKXtcclxuICAgICAgICAgICAgdGhpcy5hZGRTZWdtZW50SGFuZGxlKHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IoY29uc3QgYyBvZiB0aGlzLl9wYXRoLmN1cnZlcyl7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ3VydmVIYW5kbGUoYyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgcGF0aCgpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGF0aDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHBhdGhDaGFuZ2VkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoQ2hhbmdlZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBhZGRTZWdtZW50SGFuZGxlKHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQpe1xyXG4gICAgICAgIHRoaXMuYWRkSGFuZGxlKG5ldyBQYXRoSGFuZGxlKHNlZ21lbnQpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBhZGRDdXJ2ZUhhbmRsZShjdXJ2ZTogcGFwZXIuQ3VydmUpe1xyXG4gICAgICAgIGxldCBoYW5kbGUgPSBuZXcgUGF0aEhhbmRsZShjdXJ2ZSk7XHJcbiAgICAgICAgaGFuZGxlLmN1cnZlU3BsaXQuc3Vic2NyaWJlT25lKGN1cnZlSWR4ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZSh0aGlzLl9wYXRoLmN1cnZlc1tjdXJ2ZUlkeF0pO1xyXG4gICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKHRoaXMuX3BhdGguY3VydmVzW2N1cnZlSWR4ICsgMV0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYWRkSGFuZGxlKGhhbmRsZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgYWRkSGFuZGxlKGhhbmRsZTogUGF0aEhhbmRsZSl7XHJcbiAgICAgICAgaGFuZGxlLnZpc2libGUgPSB0aGlzLnZpc2libGU7XHJcbiAgICAgICAgaGFuZGxlLm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnTW92ZSwgZXYgPT4ge1xyXG4gICAgICAgICAgIHRoaXMuX3BhdGhDaGFuZ2VkLm5vdGlmeSh0aGlzLl9wYXRoKTsgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaGFuZGxlLm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuY2xpY2tXaXRob3V0RHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgIHRoaXMuX3BhdGhDaGFuZ2VkLm5vdGlmeSh0aGlzLl9wYXRoKTsgXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmFkZENoaWxkKGhhbmRsZSk7ICAgICAgICBcclxuICAgIH1cclxufVxyXG4iLCJcclxuLyoqXHJcbiAqIE1lYXN1cmVzIG9mZnNldHMgb2YgdGV4dCBnbHlwaHMuXHJcbiAqL1xyXG5jbGFzcyBUZXh0UnVsZXIge1xyXG4gICAgXHJcbiAgICBmb250RmFtaWx5OiBzdHJpbmc7XHJcbiAgICBmb250V2VpZ2h0OiBudW1iZXI7XHJcbiAgICBmb250U2l6ZTogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCAodGV4dCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XHJcbiAgICAgICAgcG9pbnRUZXh0LmNvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgIHBvaW50VGV4dC5qdXN0aWZpY2F0aW9uID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBpZih0aGlzLmZvbnRGYW1pbHkpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udEZhbWlseSA9IHRoaXMuZm9udEZhbWlseTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5mb250V2VpZ2h0KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRXZWlnaHQgPSB0aGlzLmZvbnRXZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFNpemUpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcG9pbnRUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRleHRPZmZzZXRzKHRleHQpe1xyXG4gICAgICAgIC8vIE1lYXN1cmUgZ2x5cGhzIGluIHBhaXJzIHRvIGNhcHR1cmUgd2hpdGUgc3BhY2UuXHJcbiAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxyXG4gICAgICAgIHZhciBnbHlwaFBhaXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpKzEpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRm9yIGVhY2ggY2hhcmFjdGVyLCBmaW5kIGNlbnRlciBvZmZzZXQuXHJcbiAgICAgICAgdmFyIHhPZmZzZXRzID0gWzBdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gTWVhc3VyZSB0aHJlZSBjaGFyYWN0ZXJzIGF0IGEgdGltZSB0byBnZXQgdGhlIGFwcHJvcHJpYXRlIFxyXG4gICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxyXG4gICAgICAgICAgICB2YXIgdHJpYWRUZXh0ID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSAtIDEsIGkgKyAxKSk7XHJcbiAgICAgICAgICAgIHRyaWFkVGV4dC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXHJcbiAgICAgICAgICAgIC8vICAgYW5kIGhhbGYgb2YgY3VycmVudCBnbHlwaCBwYWlyLlxyXG4gICAgICAgICAgICAvLyBNdXN0IGJlIHJpZ2h0LCBiZWNhdXNlIGl0IHdvcmtzLlxyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2kgLSAxXS5ib3VuZHMud2lkdGggLyAyIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHdpZHRoIHRvIHByaW9yIG9mZnNldC4gXHJcbiAgICAgICAgICAgIHhPZmZzZXRzW2ldID0geE9mZnNldHNbaSAtIDFdICsgb2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgZ2x5cGhQYWlyIG9mIGdseXBoUGFpcnMpe1xyXG4gICAgICAgICAgICBnbHlwaFBhaXIucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB4T2Zmc2V0cztcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgVGV4dFdhcnAgZXh0ZW5kcyBEdWFsQm91bmRzUGF0aFdhcnAge1xyXG5cclxuICAgIHN0YXRpYyBERUZBVUxUX0ZPTlRfU0laRSA9IDY0O1xyXG5cclxuICAgIHByaXZhdGUgX2ZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICBwcml2YXRlIF90ZXh0OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9mb250U2l6ZTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZvbnQ6IG9wZW50eXBlLkZvbnQsXHJcbiAgICAgICAgdGV4dDogc3RyaW5nLFxyXG4gICAgICAgIGJvdW5kcz86IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9LFxyXG4gICAgICAgIGZvbnRTaXplPzogbnVtYmVyLFxyXG4gICAgICAgIHN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZighZm9udFNpemUpe1xyXG4gICAgICAgICAgICAgICAgZm9udFNpemUgPSBUZXh0V2FycC5ERUZBVUxUX0ZPTlRfU0laRTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBUZXh0V2FycC5nZXRQYXRoRGF0YShmb250LCB0ZXh0LCBmb250U2l6ZSk7IFxyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzdXBlcihwYXRoLCBib3VuZHMsIHN0eWxlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSBmb250O1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0ID0gdGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl90ZXh0ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmb250U2l6ZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IGZvbnRTaXplKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZighdmFsdWUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2ZvbnRTaXplID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmb250KHZhbHVlOiBvcGVudHlwZS5Gb250KXtcclxuICAgICAgICBpZih2YWx1ZSAhPT0gdGhpcy5fZm9udCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVUZXh0UGF0aCgpIHtcclxuICAgICAgICBjb25zdCBwYXRoRGF0YSA9IFRleHRXYXJwLmdldFBhdGhEYXRhKFxyXG4gICAgICAgICAgICB0aGlzLl9mb250LCB0aGlzLl90ZXh0LCB0aGlzLl9mb250U2l6ZSk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRQYXRoRGF0YShmb250OiBvcGVudHlwZS5Gb250LFxyXG4gICAgICAgIHRleHQ6IHN0cmluZywgZm9udFNpemU/OiBzdHJpbmd8bnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgb3BlblR5cGVQYXRoID0gZm9udC5nZXRQYXRoKHRleHQsIDAsIDAsXHJcbiAgICAgICAgICAgIE51bWJlcihmb250U2l6ZSkgfHwgVGV4dFdhcnAuREVGQVVMVF9GT05UX1NJWkUpO1xyXG4gICAgICAgIHJldHVybiBvcGVuVHlwZVBhdGgudG9QYXRoRGF0YSgpO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFZpZXdab29tIHtcclxuXHJcbiAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgZmFjdG9yID0gMS4yNTtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfbWluWm9vbTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbWF4Wm9vbTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbW91c2VOYXRpdmVTdGFydDogcGFwZXIuUG9pbnQ7XHJcbiAgICBwcml2YXRlIF92aWV3Q2VudGVyU3RhcnQ6IHBhcGVyLlBvaW50O1xyXG4gICAgcHJpdmF0ZSBfdmlld0NoYW5nZWQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlJlY3RhbmdsZT4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9qZWN0OiBwYXBlci5Qcm9qZWN0KSB7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcblxyXG4gICAgICAgICg8YW55PiQodmlldy5lbGVtZW50KSkubW91c2V3aGVlbCgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludChldmVudC5vZmZzZXRYLCBldmVudC5vZmZzZXRZKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2Vab29tQ2VudGVyZWQoZXZlbnQuZGVsdGFZLCBtb3VzZVBvc2l0aW9uKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGlkRHJhZyA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZpZXcub24oXCJtb3VzZWRyYWdcIiwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZighdGhpcy5fdmlld0NlbnRlclN0YXJ0KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDZW50ZXJTdGFydCA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgLy8gSGF2ZSB0byB1c2UgbmF0aXZlIG1vdXNlIG9mZnNldCwgYmVjYXVzZSBldi5kZWx0YSBcclxuICAgICAgICAgICAgICAgIC8vICBjaGFuZ2VzIGFzIHRoZSB2aWV3IGlzIHNjcm9sbGVkLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG5ldyBwYXBlci5Qb2ludChldi5ldmVudC5vZmZzZXRYLCBldi5ldmVudC5vZmZzZXRZKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3LmVtaXQoUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmF0aXZlRGVsdGEgPSBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgZXYuZXZlbnQub2Zmc2V0WCAtIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQueCxcclxuICAgICAgICAgICAgICAgICAgICBldi5ldmVudC5vZmZzZXRZIC0gdGhpcy5fbW91c2VOYXRpdmVTdGFydC55XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgLy8gTW92ZSBpbnRvIHZpZXcgY29vcmRpbmF0ZXMgdG8gc3VicmFjdCBkZWx0YSxcclxuICAgICAgICAgICAgICAgIC8vICB0aGVuIGJhY2sgaW50byBwcm9qZWN0IGNvb3Jkcy5cclxuICAgICAgICAgICAgICAgIHZpZXcuY2VudGVyID0gdmlldy52aWV3VG9Qcm9qZWN0KCBcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnByb2plY3RUb1ZpZXcodGhpcy5fdmlld0NlbnRlclN0YXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChuYXRpdmVEZWx0YSkpO1xyXG4gICAgICAgICAgICAgICAgdmlldy5lbWl0KFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnTW92ZSwgZXYpO1xyXG4gICAgICAgICAgICAgICAgZGlkRHJhZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB2aWV3Lm9uKFwibW91c2V1cFwiLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX21vdXNlTmF0aXZlU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2VudGVyU3RhcnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmlldy5lbWl0KFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnRW5kLCBldik7XHJcbiAgICAgICAgICAgICAgICBpZihkaWREcmFnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlld0NoYW5nZWQubm90aWZ5KHZpZXcuYm91bmRzKTtcclxuICAgICAgICAgICAgICAgICAgICBkaWREcmFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmlld0NoYW5nZWQoKSA6IE9ic2VydmFibGVFdmVudDxwYXBlci5SZWN0YW5nbGU+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlld0NoYW5nZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHpvb20oKTogbnVtYmVye1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2plY3Qudmlldy56b29tO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB6b29tUmFuZ2UoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Wm9vbVJhbmdlKHJhbmdlOiBwYXBlci5TaXplW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGNvbnN0IGFTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICBjb25zdCBiU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgY29uc3QgYSA9IGFTaXplICYmIE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYVNpemUuaGVpZ2h0LCAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGFTaXplLndpZHRoKTtcclxuICAgICAgICBjb25zdCBiID0gYlNpemUgJiYgTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBiU2l6ZS5oZWlnaHQsICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYlNpemUud2lkdGgpO1xyXG4gICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKGEsYik7XHJcbiAgICAgICAgaWYobWluKXtcclxuICAgICAgICAgICAgdGhpcy5fbWluWm9vbSA9IG1pbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoYSxiKTtcclxuICAgICAgICBpZihtYXgpe1xyXG4gICAgICAgICAgICB0aGlzLl9tYXhab29tID0gbWF4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgfVxyXG5cclxuICAgIHpvb21UbyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpe1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICB2aWV3LmNlbnRlciA9IHJlY3QuY2VudGVyO1xyXG4gICAgICAgIHZpZXcuem9vbSA9IE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy52aWV3U2l6ZS5oZWlnaHQgLyByZWN0LmhlaWdodCwgXHJcbiAgICAgICAgICAgIHZpZXcudmlld1NpemUud2lkdGggLyByZWN0LndpZHRoKTtcclxuICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVpvb21DZW50ZXJlZChkZWx0YTogbnVtYmVyLCBtb3VzZVBvczogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICBpZiAoIWRlbHRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGNvbnN0IG9sZFpvb20gPSB2aWV3Lnpvb207XHJcbiAgICAgICAgY29uc3Qgb2xkQ2VudGVyID0gdmlldy5jZW50ZXI7XHJcbiAgICAgICAgY29uc3Qgdmlld1BvcyA9IHZpZXcudmlld1RvUHJvamVjdChtb3VzZVBvcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG5ld1pvb20gPSBkZWx0YSA+IDBcclxuICAgICAgICAgICAgPyB2aWV3Lnpvb20gKiB0aGlzLmZhY3RvclxyXG4gICAgICAgICAgICA6IHZpZXcuem9vbSAvIHRoaXMuZmFjdG9yO1xyXG4gICAgICAgIG5ld1pvb20gPSB0aGlzLnNldFpvb21Db25zdHJhaW5lZChuZXdab29tKTtcclxuICAgICAgICBcclxuICAgICAgICBpZighbmV3Wm9vbSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHpvb21TY2FsZSA9IG9sZFpvb20gLyBuZXdab29tO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlckFkanVzdCA9IHZpZXdQb3Muc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuICAgICAgICBjb25zdCBvZmZzZXQgPSB2aWV3UG9zLnN1YnRyYWN0KGNlbnRlckFkanVzdC5tdWx0aXBseSh6b29tU2NhbGUpKVxyXG4gICAgICAgICAgICAuc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuXHJcbiAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LmNlbnRlci5hZGQob2Zmc2V0KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgem9vbSBsZXZlbC5cclxuICAgICAqIEByZXR1cm5zIHpvb20gbGV2ZWwgdGhhdCB3YXMgc2V0LCBvciBudWxsIGlmIGl0IHdhcyBub3QgY2hhbmdlZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNldFpvb21Db25zdHJhaW5lZCh6b29tOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGlmKHRoaXMuX21pblpvb20pIHtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWF4KHpvb20sIHRoaXMuX21pblpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9tYXhab29tKXtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWluKHpvb20sIHRoaXMuX21heFpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgaWYoem9vbSAhPSB2aWV3Lnpvb20pe1xyXG4gICAgICAgICAgICB2aWV3Lnpvb20gPSB6b29tO1xyXG4gICAgICAgICAgICByZXR1cm4gem9vbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmludGVyZmFjZSBTa2V0Y2hJdGVtU3R5bGUgZXh0ZW5kcyBwYXBlci5JU3R5bGUge1xyXG4gICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG59XHJcbiIsIlxyXG5cclxuZnVuY3Rpb24gYm9vdHN0cmFwKCkge1xyXG4gICAgXHJcbiAgICBjb25zdCBzdG9yZSA9IG5ldyBTdG9yZSgpO1xyXG4gICAgXHJcbiAgICBjb25zdCBza2V0Y2hFZGl0b3IgPSBuZXcgU2tldGNoRWRpdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNpZ25lcicpLCBzdG9yZSk7XHJcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1FZGl0b3IgPSBuZXcgU2VsZWN0ZWRJdGVtRWRpdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdG9yT3ZlcmxheVwiKSwgc3RvcmUpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gbmV3IEFwcENvbnRyb2xsZXIoc3RvcmUsIHNrZXRjaEVkaXRvciwgc2VsZWN0ZWRJdGVtRWRpdG9yKTtcclxuXHJcbn1cclxuXHJcbmNvbnN0IGFwcCA9IGJvb3RzdHJhcCgpO1xyXG4iXX0=