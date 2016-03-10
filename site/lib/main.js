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
    /**
     * Creates and returns a blob from a data URL (either base64 encoded or not).
     * https://github.com/ebidel/filer.js/blob/master/src/filer.js#L137
     *
     * @param {string} dataURL The data URL to convert.
     * @return {Blob} A blob representing the array buffer data.
     */
    function dataURLToBlob(dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = decodeURIComponent(parts[1]);
            return new Blob([raw], { type: contentType });
        }
        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);
        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: contentType });
    }
    DomHelpers.dataURLToBlob = dataURLToBlob;
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
        events.subscribe(function (m) { return console.log("event", m.type, m.data); });
        actions.subscribe(function (m) { return console.log("action", m.type, m.data); });
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
                // make files htts
                var _loop_1 = function(fam) {
                    _.forOwn(fam.files, function (val, key) {
                        if (_.startsWith(val, "http:")) {
                            fam.files[key] = val.replace("http:", "https:");
                        }
                    });
                };
                for (var _i = 0, _a = response.items; _i < _a.length; _i++) {
                    var fam = _a[_i];
                    _loop_1(fam);
                }
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
var S3Access;
(function (S3Access) {
    /**
     * Upload file to application S3 bucket
     */
    function upload(fileName, fileType, data) {
        var signUrl = "/sign_s3?file_name=" + fileName + "&file_type=" + fileType;
        // get signed URL
        $.getJSON(signUrl)
            .done(function (signResponse) {
            // PUT file
            var putRequest = {
                method: "PUT",
                url: signResponse.signed_request,
                headers: {
                    'x-amz-acl': 'public-read'
                },
                data: data,
                processData: false,
                contentType: fileType
            };
            $.ajax(putRequest)
                .done(function (putResponse) {
                console.log("uploaded file", signResponse.url);
            })
                .fail(function (err) {
                console.error("error uploading to S3", err);
            });
        })
            .fail(function (err) {
            console.error("error on sign_s3", err);
        });
    }
    S3Access.upload = upload;
})(S3Access || (S3Access = {}));
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
        actions.designer.exportPNG.subscribe(function (m) {
            _this.setSelection(null);
            _this.setEditingItem(null);
            events.designer.exportPNGRequested.dispatch(m.data);
        });
        actions.designer.exportSVG.subscribe(function (m) {
            _this.setSelection(null);
            _this.setEditingItem(null);
            events.designer.exportSVGRequested.dispatch(m.data);
        });
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
        this.viewZoom.zoomTo(bounds.scale(1.2));
    };
    WorkspaceController.prototype.downloadPNG = function () {
        var background = this.insertBackground();
        var raster = app.workspaceController.project.activeLayer.rasterize(300, false);
        var fileName = this.getSketchFileName(40, "png");
        var data = raster.toDataURL();
        DomHelpers.downloadFile(data, fileName);
        background.remove();
        S3Access.upload(fileName, "image/png", DomHelpers.dataURLToBlob(data));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Eb21IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0ZvbnRIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0hlbHBlcnMudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2NvbGxlY3Rpb25zLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2V2ZW50cy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3BhcGVyL1BhcGVyTm90aWZ5LnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3BhcGVyL3BhcGVyLWV4dC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9wb3N0YWwvVG9waWMudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcG9zdGFsL3Bvc3RhbC1vYnNlcnZlLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3JlYWN0L1JlYWN0SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay92ZG9tL0NvbXBvbmVudC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay92ZG9tL1JlYWN0aXZlRG9tLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vQXBwQ29udHJvbGxlci50cyIsIi4uLy4uL2NsaWVudC9fY29tbW9uL0NoYW5uZWxzLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vRm9udEZhbWlsaWVzTG9hZGVyLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vUGFyc2VkRm9udHMudHMiLCIuLi8uLi9jbGllbnQvX2NvbW1vbi9TM0FjY2Vzcy50cyIsIi4uLy4uL2NsaWVudC9fY29tbW9uL1N0b3JlLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vY29uc3RhbnRzLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vbW9kZWwtaGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fY29tbW9uL21vZGVscy50cyIsIi4uLy4uL2NsaWVudC9kZXNpZ25lci9Db2xvclBpY2tlci50cyIsIi4uLy4uL2NsaWVudC9kZXNpZ25lci9Eb2N1bWVudEtleUhhbmRsZXIudHMiLCIuLi8uLi9jbGllbnQvZGVzaWduZXIvRm9udFBpY2tlci50cyIsIi4uLy4uL2NsaWVudC9kZXNpZ25lci9TZWxlY3RlZEl0ZW1FZGl0b3IudHMiLCIuLi8uLi9jbGllbnQvZGVzaWduZXIvU2tldGNoRWRpdG9yLnRzIiwiLi4vLi4vY2xpZW50L2Rlc2lnbmVyL1RleHRCbG9ja0VkaXRvci50cyIsIi4uLy4uL2NsaWVudC9kZXNpZ25lci9Xb3Jrc3BhY2VDb250cm9sbGVyLnRzIiwiLi4vLi4vY2xpZW50L21hdGgvUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHMiLCIuLi8uLi9jbGllbnQvd29ya3NwYWNlL0R1YWxCb3VuZHNQYXRoV2FycC50cyIsIi4uLy4uL2NsaWVudC93b3Jrc3BhY2UvUGF0aEhhbmRsZS50cyIsIi4uLy4uL2NsaWVudC93b3Jrc3BhY2UvUGF0aFNlY3Rpb24udHMiLCIuLi8uLi9jbGllbnQvd29ya3NwYWNlL1BhdGhUcmFuc2Zvcm0udHMiLCIuLi8uLi9jbGllbnQvd29ya3NwYWNlL1N0cmV0Y2hQYXRoLnRzIiwiLi4vLi4vY2xpZW50L3dvcmtzcGFjZS9UZXh0UnVsZXIudHMiLCIuLi8uLi9jbGllbnQvd29ya3NwYWNlL1RleHRXYXJwLnRzIiwiLi4vLi4vY2xpZW50L3dvcmtzcGFjZS9WaWV3Wm9vbS50cyIsIi4uLy4uL2NsaWVudC93b3Jrc3BhY2UvaW50ZXJmYWNlcy50cyIsIi4uLy4uL2NsaWVudC96X2FwcC9ib290c3RyYXAudHMi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UUFDeEIsSUFBSSxFQUFrQixFQUFFO1FBQ3hCLFNBQVMsRUFBYSxFQUFFO1FBQ3hCLE9BQU8sRUFBZSxFQUFFO1FBQ3hCLFVBQVUsRUFBWSxFQUFFO1FBQ3hCLFNBQVMsRUFBYSxFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FB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QUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTlCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2xFLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMs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QUM7WUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0wsZUFBQztBQUFELENBQUMsQUFuSkQsSUFtSkM7QUVsSkQ7SUFFSSxJQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBRTFCLElBQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEYsSUFBTSxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFbkcsTUFBTSxDQUFDLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUV0RSxDQUFDO0FBRUQsSUFBTSxHQUFHLEdBQUcsU0FBUyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxubmFtZXNwYWNlIERvbUhlbHBlcnMge1xyXG4gICAgXHJcbiAgICAvLyAgaHR0cHM6Ly9zdXBwb3J0Lm1vemlsbGEub3JnL2VuLVVTL3F1ZXN0aW9ucy85Njg5OTJcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkb3dubG9hZEZpbGUoZGF0YVVybDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nKXtcclxuICAgICAgICB2YXIgbGluayA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgbGluay5pZCA9IG5ld2lkKCk7XHJcbiAgICAgICAgbGluay5kb3dubG9hZCA9IGZpbGVuYW1lO1xyXG4gICAgICAgIGxpbmsuaHJlZiA9IGRhdGFVcmw7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgICAgICBsaW5rLnRhcmdldCA9IFwiX3NlbGZcIjtcclxuICAgICAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBibG9iIGZyb20gYSBkYXRhIFVSTCAoZWl0aGVyIGJhc2U2NCBlbmNvZGVkIG9yIG5vdCkuXHJcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vZWJpZGVsL2ZpbGVyLmpzL2Jsb2IvbWFzdGVyL3NyYy9maWxlci5qcyNMMTM3XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGRhdGFVUkwgVGhlIGRhdGEgVVJMIHRvIGNvbnZlcnQuXHJcbiAgICAgKiBAcmV0dXJuIHtCbG9ifSBBIGJsb2IgcmVwcmVzZW50aW5nIHRoZSBhcnJheSBidWZmZXIgZGF0YS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRhdGFVUkxUb0Jsb2IoZGF0YVVSTCk6IEJsb2Ige1xyXG4gICAgICAgIHZhciBCQVNFNjRfTUFSS0VSID0gJztiYXNlNjQsJztcclxuICAgICAgICBpZiAoZGF0YVVSTC5pbmRleE9mKEJBU0U2NF9NQVJLRVIpID09IC0xKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IGRhdGFVUkwuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnRUeXBlID0gcGFydHNbMF0uc3BsaXQoJzonKVsxXTtcclxuICAgICAgICAgICAgdmFyIHJhdyA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEJsb2IoW3Jhd10sIHt0eXBlOiBjb250ZW50VHlwZX0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBhcnRzID0gZGF0YVVSTC5zcGxpdChCQVNFNjRfTUFSS0VSKTtcclxuICAgICAgICB2YXIgY29udGVudFR5cGUgPSBwYXJ0c1swXS5zcGxpdCgnOicpWzFdO1xyXG4gICAgICAgIHZhciByYXcgPSB3aW5kb3cuYXRvYihwYXJ0c1sxXSk7XHJcbiAgICAgICAgdmFyIHJhd0xlbmd0aCA9IHJhdy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHZhciB1SW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkocmF3TGVuZ3RoKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdMZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB1SW50OEFycmF5W2ldID0gcmF3LmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEJsb2IoW3VJbnQ4QXJyYXldLCB7dHlwZTogY29udGVudFR5cGV9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgS2V5Q29kZXMgPSB7XHJcbiAgICAgICAgQmFja1NwYWNlICAgICAgICAgICA6IDggICxcclxuICAgICAgICBUYWIgICAgICAgICAgICAgICAgIDogOSAgLFxyXG4gICAgICAgIEVudGVyICAgICAgICAgICAgICAgOiAxMyAsXHJcbiAgICAgICAgU2hpZnQgICAgICAgICAgICAgICA6IDE2ICxcclxuICAgICAgICBDdHJsICAgICAgICAgICAgICAgIDogMTcgLFxyXG4gICAgICAgIEFsdCAgICAgICAgICAgICAgICAgOiAxOCAsXHJcbiAgICAgICAgUGF1c2VCcmVhayAgICAgICAgICA6IDE5ICxcclxuICAgICAgICBDYXBzTG9jayAgICAgICAgICAgIDogMjAgLFxyXG4gICAgICAgIEVzYyAgICAgICAgICAgICAgICAgOiAyNyAsXHJcbiAgICAgICAgUGFnZVVwICAgICAgICAgICAgICA6IDMzICxcclxuICAgICAgICBQYWdlRG93biAgICAgICAgICAgIDogMzQgLFxyXG4gICAgICAgIEVuZCAgICAgICAgICAgICAgICAgOiAzNSAsXHJcbiAgICAgICAgSG9tZSAgICAgICAgICAgICAgICA6IDM2ICxcclxuICAgICAgICBBcnJvd0xlZnQgICAgICAgICAgIDogMzcgLFxyXG4gICAgICAgIEFycm93VXAgICAgICAgICAgICAgOiAzOCAsXHJcbiAgICAgICAgQXJyb3dSaWdodCAgICAgICAgICA6IDM5ICxcclxuICAgICAgICBBcnJvd0Rvd24gICAgICAgICAgIDogNDAgLFxyXG4gICAgICAgIEluc2VydCAgICAgICAgICAgICAgOiA0NSAsXHJcbiAgICAgICAgRGVsZXRlICAgICAgICAgICAgICA6IDQ2ICxcclxuICAgICAgICBEaWdpdDAgICAgICAgICAgICAgIDogNDggLFxyXG4gICAgICAgIERpZ2l0MSAgICAgICAgICAgICAgOiA0OSAsXHJcbiAgICAgICAgRGlnaXQyICAgICAgICAgICAgICA6IDUwICxcclxuICAgICAgICBEaWdpdDMgICAgICAgICAgICAgIDogNTEgLFxyXG4gICAgICAgIERpZ2l0NCAgICAgICAgICAgICAgOiA1MiAsXHJcbiAgICAgICAgRGlnaXQ1ICAgICAgICAgICAgICA6IDUzICxcclxuICAgICAgICBEaWdpdDYgICAgICAgICAgICAgIDogNTQgLFxyXG4gICAgICAgIERpZ2l0NyAgICAgICAgICAgICAgOiA1NSAsXHJcbiAgICAgICAgRGlnaXQ4ICAgICAgICAgICAgICA6IDU2ICxcclxuICAgICAgICBEaWdpdDkgICAgICAgICAgICAgIDogNTcgLFxyXG4gICAgICAgIEEgICAgICAgICAgICAgICAgICAgOiA2NSAsXHJcbiAgICAgICAgQiAgICAgICAgICAgICAgICAgICA6IDY2ICxcclxuICAgICAgICBDICAgICAgICAgICAgICAgICAgIDogNjcgLFxyXG4gICAgICAgIEQgICAgICAgICAgICAgICAgICAgOiA2OCAsXHJcbiAgICAgICAgRSAgICAgICAgICAgICAgICAgICA6IDY5ICxcclxuICAgICAgICBGICAgICAgICAgICAgICAgICAgIDogNzAgLFxyXG4gICAgICAgIEcgICAgICAgICAgICAgICAgICAgOiA3MSAsXHJcbiAgICAgICAgSCAgICAgICAgICAgICAgICAgICA6IDcyICxcclxuICAgICAgICBJICAgICAgICAgICAgICAgICAgIDogNzMgLFxyXG4gICAgICAgIEogICAgICAgICAgICAgICAgICAgOiA3NCAsXHJcbiAgICAgICAgSyAgICAgICAgICAgICAgICAgICA6IDc1ICxcclxuICAgICAgICBMICAgICAgICAgICAgICAgICAgIDogNzYgLFxyXG4gICAgICAgIE0gICAgICAgICAgICAgICAgICAgOiA3NyAsXHJcbiAgICAgICAgTiAgICAgICAgICAgICAgICAgICA6IDc4ICxcclxuICAgICAgICBPICAgICAgICAgICAgICAgICAgIDogNzkgLFxyXG4gICAgICAgIFAgICAgICAgICAgICAgICAgICAgOiA4MCAsXHJcbiAgICAgICAgUSAgICAgICAgICAgICAgICAgICA6IDgxICxcclxuICAgICAgICBSICAgICAgICAgICAgICAgICAgIDogODIgLFxyXG4gICAgICAgIFMgICAgICAgICAgICAgICAgICAgOiA4MyAsXHJcbiAgICAgICAgVCAgICAgICAgICAgICAgICAgICA6IDg0ICxcclxuICAgICAgICBVICAgICAgICAgICAgICAgICAgIDogODUgLFxyXG4gICAgICAgIFYgICAgICAgICAgICAgICAgICAgOiA4NiAsXHJcbiAgICAgICAgVyAgICAgICAgICAgICAgICAgICA6IDg3ICxcclxuICAgICAgICBYICAgICAgICAgICAgICAgICAgIDogODggLFxyXG4gICAgICAgIFkgICAgICAgICAgICAgICAgICAgOiA4OSAsXHJcbiAgICAgICAgWiAgICAgICAgICAgICAgICAgICA6IDkwICxcclxuICAgICAgICBXaW5kb3dMZWZ0ICAgICAgICAgIDogOTEgLFxyXG4gICAgICAgIFdpbmRvd1JpZ2h0ICAgICAgICAgOiA5MiAsXHJcbiAgICAgICAgU2VsZWN0S2V5ICAgICAgICAgICA6IDkzICxcclxuICAgICAgICBOdW1wYWQwICAgICAgICAgICAgIDogOTYgLFxyXG4gICAgICAgIE51bXBhZDEgICAgICAgICAgICAgOiA5NyAsXHJcbiAgICAgICAgTnVtcGFkMiAgICAgICAgICAgICA6IDk4ICxcclxuICAgICAgICBOdW1wYWQzICAgICAgICAgICAgIDogOTkgLFxyXG4gICAgICAgIE51bXBhZDQgICAgICAgICAgICAgOiAxMDAsXHJcbiAgICAgICAgTnVtcGFkNSAgICAgICAgICAgICA6IDEwMSxcclxuICAgICAgICBOdW1wYWQ2ICAgICAgICAgICAgIDogMTAyLFxyXG4gICAgICAgIE51bXBhZDcgICAgICAgICAgICAgOiAxMDMsIFxyXG4gICAgICAgIE51bXBhZDggICAgICAgICAgICAgOiAxMDQsXHJcbiAgICAgICAgTnVtcGFkOSAgICAgICAgICAgICA6IDEwNSxcclxuICAgICAgICBNdWx0aXBseSAgICAgICAgICAgIDogMTA2LFxyXG4gICAgICAgIEFkZCAgICAgICAgICAgICAgICAgOiAxMDcsXHJcbiAgICAgICAgU3VidHJhY3QgICAgICAgICAgICA6IDEwOSxcclxuICAgICAgICBEZWNpbWFsUG9pbnQgICAgICAgIDogMTEwLFxyXG4gICAgICAgIERpdmlkZSAgICAgICAgICAgICAgOiAxMTEsXHJcbiAgICAgICAgRjEgICAgICAgICAgICAgICAgICA6IDExMixcclxuICAgICAgICBGMiAgICAgICAgICAgICAgICAgIDogMTEzLFxyXG4gICAgICAgIEYzICAgICAgICAgICAgICAgICAgOiAxMTQsXHJcbiAgICAgICAgRjQgICAgICAgICAgICAgICAgICA6IDExNSxcclxuICAgICAgICBGNSAgICAgICAgICAgICAgICAgIDogMTE2LFxyXG4gICAgICAgIEY2ICAgICAgICAgICAgICAgICAgOiAxMTcsXHJcbiAgICAgICAgRjcgICAgICAgICAgICAgICAgICA6IDExOCxcclxuICAgICAgICBGOCAgICAgICAgICAgICAgICAgIDogMTE5LFxyXG4gICAgICAgIEY5ICAgICAgICAgICAgICAgICAgOiAxMjAsXHJcbiAgICAgICAgRjEwICAgICAgICAgICAgICAgICA6IDEyMSxcclxuICAgICAgICBGMTEgICAgICAgICAgICAgICAgIDogMTIyLFxyXG4gICAgICAgIEYxMiAgICAgICAgICAgICAgICAgOiAxMjMsXHJcbiAgICAgICAgTnVtTG9jayAgICAgICAgICAgICA6IDE0NCxcclxuICAgICAgICBTY3JvbGxMb2NrICAgICAgICAgIDogMTQ1LFxyXG4gICAgICAgIFNlbWlDb2xvbiAgICAgICAgICAgOiAxODYsXHJcbiAgICAgICAgRXF1YWwgICAgICAgICAgICAgICA6IDE4NyxcclxuICAgICAgICBDb21tYSAgICAgICAgICAgICAgIDogMTg4LFxyXG4gICAgICAgIERhc2ggICAgICAgICAgICAgICAgOiAxODksXHJcbiAgICAgICAgUGVyaW9kICAgICAgICAgICAgICA6IDE5MCxcclxuICAgICAgICBGb3J3YXJkU2xhc2ggICAgICAgIDogMTkxLFxyXG4gICAgICAgIEdyYXZlQWNjZW50ICAgICAgICAgOiAxOTIsXHJcbiAgICAgICAgQnJhY2tldE9wZW4gICAgICAgICA6IDIxOSxcclxuICAgICAgICBCYWNrU2xhc2ggICAgICAgICAgIDogMjIwLFxyXG4gICAgICAgIEJyYWNrZXRDbG9zZSAgICAgICAgOiAyMjEsXHJcbiAgICAgICAgU2luZ2xlUXVvdGUgICAgICAgICA6IDIyMiBcclxuICAgIH07XHJcbiAgICBcclxufSIsIlxyXG5uYW1lc3BhY2UgRm9udEhlbHBlcnMge1xyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFZhcmlhbnRTdHlsZSB7XHJcbiAgICAgICAgZm9udEZhbWlseT86IHN0cmluZztcclxuICAgICAgICBmb250V2VpZ2h0Pzogc3RyaW5nO1xyXG4gICAgICAgIGZvbnRTdHlsZT86IHN0cmluZzsgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q3NzU3R5bGUoZmFtaWx5OiBzdHJpbmcsIHZhcmlhbnQ6IHN0cmluZyl7XHJcbiAgICAgICAgbGV0IHN0eWxlID0gPFZhcmlhbnRTdHlsZT57IGZvbnRGYW1pbHk6IGZhbWlseSB9O1xyXG4gICAgICAgIGlmKHZhcmlhbnQuaW5kZXhPZihcIml0YWxpY1wiKSA+PSAwKXtcclxuICAgICAgICAgICAgc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG51bWVyaWMgPSB2YXJpYW50LnJlcGxhY2UoL1teXFxkXS9nLCBcIlwiKTtcclxuICAgICAgICBpZihudW1lcmljLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHN0eWxlLmZvbnRXZWlnaHQgPSBudW1lcmljLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHlsZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldERlc2NyaXB0aW9uKGZhbWlseTogRm9udEZhbWlseSwgdmFyaWFudD86IHN0cmluZyk6IEZvbnREZXNjcmlwdGlvbiB7XHJcbiAgICAgICAgbGV0IHVybDogc3RyaW5nO1xyXG4gICAgICAgIHVybCA9IGZhbWlseS5maWxlc1t2YXJpYW50IHx8IFwicmVndWxhclwiXTtcclxuICAgICAgICBpZighdXJsKXtcclxuICAgICAgICAgICAgdXJsID0gZmFtaWx5LmZpbGVzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmYW1pbHk6IGZhbWlseS5mYW1pbHksXHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBmYW1pbHkuY2F0ZWdvcnksXHJcbiAgICAgICAgICAgIHZhcmlhbnQ6IHZhcmlhbnQsXHJcbiAgICAgICAgICAgIHVybFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiXHJcbmZ1bmN0aW9uIGxvZ3RhcDxUPihtZXNzYWdlOiBzdHJpbmcsIHN0cmVhbTogUnguT2JzZXJ2YWJsZTxUPik6IFJ4Lk9ic2VydmFibGU8VD57XHJcbiAgICByZXR1cm4gc3RyZWFtLnRhcCh0ID0+IGNvbnNvbGUubG9nKG1lc3NhZ2UsIHQpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbmV3aWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAobmV3IERhdGUoKS5nZXRUaW1lKCkrTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMzYpO1xyXG59XHJcbiIsIlxyXG5uYW1lc3BhY2UgVHlwZWRDaGFubmVsIHtcclxuXHJcbiAgICAvLyAtLS0gQ29yZSB0eXBlcyAtLS1cclxuXHJcbiAgICB0eXBlIFNlcmlhbGl6YWJsZSA9IE9iamVjdCB8IEFycmF5PGFueT4gfCBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuIHwgRGF0ZSB8IHZvaWQ7XHJcblxyXG4gICAgdHlwZSBWYWx1ZSA9IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBEYXRlO1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZTxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4ge1xyXG4gICAgICAgIHR5cGU6IHN0cmluZztcclxuICAgICAgICBkYXRhPzogVERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZSBJU3ViamVjdDxUPiA9IFJ4Lk9ic2VydmVyPFQ+ICYgUnguT2JzZXJ2YWJsZTxUPjtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbFRvcGljPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIGNoYW5uZWw6IElTdWJqZWN0PE1lc3NhZ2U8VERhdGE+PjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY2hhbm5lbDogSVN1YmplY3Q8TWVzc2FnZTxURGF0YT4+LCB0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YnNjcmliZShvYnNlcnZlcjogKG1lc3NhZ2U6IE1lc3NhZ2U8VERhdGE+KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgpLnN1YnNjcmliZShvYnNlcnZlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXNwYXRjaChkYXRhPzogVERhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsLm9uTmV4dCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBfLmNsb25lKGRhdGEpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JzZXJ2ZSgpOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGE+PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuZmlsdGVyKG0gPT4gbS50eXBlID09PSB0aGlzLnR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3J3YXJkKGNoYW5uZWw6IENoYW5uZWxUb3BpYzxURGF0YT4pIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmUobSA9PiBjaGFubmVsLmRpc3BhdGNoKG0uZGF0YSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbCB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgc3ViamVjdDogSVN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGU+PjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3ViamVjdD86IElTdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4sIHR5cGU/OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJqZWN0ID0gc3ViamVjdCB8fCBuZXcgUnguU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+KCk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWJzY3JpYmUob25OZXh0PzogKHZhbHVlOiBNZXNzYWdlPFNlcmlhbGl6YWJsZT4pID0+IHZvaWQpOiBSeC5JRGlzcG9zYWJsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3Quc3Vic2NyaWJlKG9uTmV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b3BpYzxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4odHlwZTogc3RyaW5nKSA6IENoYW5uZWxUb3BpYzxURGF0YT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENoYW5uZWxUb3BpYzxURGF0YT4odGhpcy5zdWJqZWN0IGFzIElTdWJqZWN0PE1lc3NhZ2U8VERhdGE+PixcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA/IHRoaXMudHlwZSArICcuJyArIHR5cGUgOiB0eXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVyZ2VUeXBlZDxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4oLi4udG9waWNzOiBDaGFubmVsVG9waWM8VERhdGE+W10pIFxyXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+IHtcclxuICAgICAgICAgICAgY29uc3QgdHlwZXMgPSB0b3BpY3MubWFwKHQgPT4gdC50eXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5maWx0ZXIobSA9PiB0eXBlcy5pbmRleE9mKG0udHlwZSkgPj0gMCApIGFzIFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBtZXJnZSguLi50b3BpY3M6IENoYW5uZWxUb3BpYzxTZXJpYWxpemFibGU+W10pIFxyXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxTZXJpYWxpemFibGU+PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdG9waWNzLm1hcCh0ID0+IHQudHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuZmlsdGVyKG0gPT4gdHlwZXMuaW5kZXhPZihtLnR5cGUpID49IDAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIlxyXG50eXBlIERpY3Rpb25hcnk8VD4gPSBfLkRpY3Rpb25hcnk8VD47XHJcbiIsIlxyXG5jbGFzcyBPYnNlcnZhYmxlRXZlbnQ8VD4ge1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9zdWJzY3JpYmVyczogKChldmVudEFyZzogVCkgPT4gdm9pZClbXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGZvciBub3RpZmljYXRpb24uIFJldHVybnMgdW5zdWJzY3JpYmUgZnVuY3Rpb24uXHJcbiAgICAgKi8gICAgXHJcbiAgICBzdWJzY3JpYmUoaGFuZGxlcjogKGV2ZW50QXJnOiBUKSA9PiB2b2lkKTogKCgpID0+IHZvaWQpIHtcclxuICAgICAgICBpZih0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGhhbmRsZXIpIDwgMCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnB1c2goaGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoKSA9PiB0aGlzLnVuc3Vic2NyaWJlKGhhbmRsZXIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1bnN1YnNjcmliZShjYWxsYmFjazogKGV2ZW50QXJnOiBUKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihjYWxsYmFjaywgMCk7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgb2JzZXJ2ZSgpOiBSeC5PYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBsZXQgdW5zdWI6IGFueTtcclxuICAgICAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuPFQ+KFxyXG4gICAgICAgICAgICAoaGFuZGxlclRvQWRkKSA9PiB0aGlzLnN1YnNjcmliZSg8KGV2ZW50QXJnOiBUKSA9PiB2b2lkPmhhbmRsZXJUb0FkZCksXHJcbiAgICAgICAgICAgIChoYW5kbGVyVG9SZW1vdmUpID0+IHRoaXMudW5zdWJzY3JpYmUoPChldmVudEFyZzogVCkgPT4gdm9pZD5oYW5kbGVyVG9SZW1vdmUpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJzY3JpYmUgZm9yIG9uZSBub3RpZmljYXRpb24uXHJcbiAgICAgKi9cclxuICAgIHN1YnNjcmliZU9uZShjYWxsYmFjazogKGV2ZW50QXJnOiBUKSA9PiB2b2lkKXtcclxuICAgICAgICBsZXQgdW5zdWIgPSB0aGlzLnN1YnNjcmliZSh0ID0+IHtcclxuICAgICAgICAgICAgdW5zdWIoKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sodCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG5vdGlmeShldmVudEFyZzogVCl7XHJcbiAgICAgICAgZm9yKGxldCBzdWJzY3JpYmVyIG9mIHRoaXMuX3N1YnNjcmliZXJzKXtcclxuICAgICAgICAgICAgc3Vic2NyaWJlci5jYWxsKHRoaXMsIGV2ZW50QXJnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbGwgc3Vic2NyaWJlcnMuXHJcbiAgICAgKi9cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbn0iLCJcclxubmFtZXNwYWNlIEJvb3RTY3JpcHQge1xyXG5cclxuICAgIGludGVyZmFjZSBNZW51SXRlbSB7XHJcbiAgICAgICAgY29udGVudDogYW55LFxyXG4gICAgICAgIG9wdGlvbnM/OiBPYmplY3RcclxuICAgICAgICAvL29uQ2xpY2s/OiAoKSA9PiB2b2lkXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRyb3Bkb3duKFxyXG4gICAgICAgIGFyZ3M6IHtcclxuICAgICAgICAgICAgaWQ6IHN0cmluZyxcclxuICAgICAgICAgICAgY29udGVudDogYW55LFxyXG4gICAgICAgICAgICBpdGVtczogTWVudUl0ZW1bXVxyXG4gICAgICAgIH0pOiBWTm9kZSB7XHJcblxyXG4gICAgICAgIHJldHVybiBoKFwiZGl2LmRyb3Bkb3duXCIsIFtcclxuICAgICAgICAgICAgaChcImJ1dHRvbi5idG4uYnRuLWRlZmF1bHQuZHJvcGRvd24tdG9nZ2xlXCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJhdHRyc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBhcmdzLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtdG9nZ2xlXCI6IFwiZHJvcGRvd25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MuY29udGVudCxcclxuICAgICAgICAgICAgICAgICAgICBoKFwic3Bhbi5jYXJldFwiKVxyXG4gICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgIGgoXCJ1bC5kcm9wZG93bi1tZW51XCIsXHJcbiAgICAgICAgICAgICAgICB7fSxcclxuICAgICAgICAgICAgICAgIGFyZ3MuaXRlbXMubWFwKGl0ZW0gPT5cclxuICAgICAgICAgICAgICAgICAgICBoKFwibGlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKCdhJywgaXRlbS5vcHRpb25zIHx8IHt9LCBbaXRlbS5jb250ZW50XSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgIH1cclxufVxyXG4iLCJcclxuaW50ZXJmYWNlIENvbnNvbGUge1xyXG4gICAgbG9nKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSk6IHZvaWQ7XHJcbiAgICBsb2coLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZDtcclxufVxyXG5cclxubmFtZXNwYWNlIFBhcGVySGVscGVycyB7XHJcblxyXG4gICAgZXhwb3J0IHZhciBzaG91bGRMb2dJbmZvOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0IGxvZyA9IGZ1bmN0aW9uKC4uLnBhcmFtczogYW55W10pIHtcclxuICAgICAgICBpZiAoc2hvdWxkTG9nSW5mbykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyguLi5wYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgaW1wb3J0T3BlblR5cGVQYXRoID0gZnVuY3Rpb24ob3BlblBhdGg6IG9wZW50eXBlLlBhdGgpOiBwYXBlci5Db21wb3VuZFBhdGgge1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKG9wZW5QYXRoLnRvUGF0aERhdGEoKSk7XHJcblxyXG4gICAgICAgIC8vIGxldCBzdmcgPSBvcGVuUGF0aC50b1NWRyg0KTtcclxuICAgICAgICAvLyByZXR1cm4gPHBhcGVyLlBhdGg+cGFwZXIucHJvamVjdC5pbXBvcnRTVkcoc3ZnKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgdHJhY2VQYXRoSXRlbSA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGhJdGVtLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5QYXRoSXRlbSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlQ29tcG91bmRQYXRoID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5Db21wb3VuZFBhdGgge1xyXG4gICAgICAgIGlmICghcGF0aC5jaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwYXRocyA9IHBhdGguY2hpbGRyZW4ubWFwKHAgPT5cclxuICAgICAgICAgICAgdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cCwgcG9pbnRzUGVyUGF0aCkpO1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHtcclxuICAgICAgICAgICAgY2hpbGRyZW46IHBhdGhzLFxyXG4gICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgdHJhY2VQYXRoQXNQb2ludHMgPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoLCBudW1Qb2ludHM6IG51bWJlcik6IHBhcGVyLlBvaW50W10ge1xyXG4gICAgICAgIGxldCBwYXRoTGVuZ3RoID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG9mZnNldEluY3IgPSBwYXRoTGVuZ3RoIC8gbnVtUG9pbnRzO1xyXG4gICAgICAgIGxldCBwb2ludHMgPSBbXTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDA7XHJcblxyXG4gICAgICAgIHdoaWxlIChpKysgPCBudW1Qb2ludHMpIHtcclxuICAgICAgICAgICAgbGV0IHBvaW50ID0gcGF0aC5nZXRQb2ludEF0KE1hdGgubWluKG9mZnNldCwgcGF0aExlbmd0aCkpO1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChwb2ludCk7XHJcbiAgICAgICAgICAgIG9mZnNldCArPSBvZmZzZXRJbmNyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBvaW50cztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgdHJhY2VQYXRoID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICBsZXQgcG9pbnRzID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEFzUG9pbnRzKHBhdGgsIG51bVBvaW50cyk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5QYXRoKHtcclxuICAgICAgICAgICAgc2VnbWVudHM6IHBvaW50cyxcclxuICAgICAgICAgICAgY2xvc2VkOiB0cnVlLFxyXG4gICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IGR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbiA9IGZ1bmN0aW9uKHRvcFBhdGg6IHBhcGVyLkN1cnZlbGlrZSwgYm90dG9tUGF0aDogcGFwZXIuQ3VydmVsaWtlKVxyXG4gICAgICAgIDogKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBjb25zdCB0b3BQYXRoTGVuZ3RoID0gdG9wUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgYm90dG9tUGF0aExlbmd0aCA9IGJvdHRvbVBhdGgubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbih1bml0UG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgICAgICBsZXQgdG9wUG9pbnQgPSB0b3BQYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiB0b3BQYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICAgbGV0IGJvdHRvbVBvaW50ID0gYm90dG9tUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogYm90dG9tUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGlmICh0b3BQb2ludCA9PSBudWxsIHx8IGJvdHRvbVBvaW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiY291bGQgbm90IGdldCBwcm9qZWN0ZWQgcG9pbnQgZm9yIHVuaXQgcG9pbnQgXCIgKyB1bml0UG9pbnQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdG9wUG9pbnQuYWRkKGJvdHRvbVBvaW50LnN1YnRyYWN0KHRvcFBvaW50KS5tdWx0aXBseSh1bml0UG9pbnQueSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG1hcmtlckdyb3VwOiBwYXBlci5Hcm91cDtcclxuXHJcbiAgICBleHBvcnQgY29uc3QgcmVzZXRNYXJrZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKFBhcGVySGVscGVycy5tYXJrZXJHcm91cCkge1xyXG4gICAgICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcmtlckdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgbWFya2VyR3JvdXAub3BhY2l0eSA9IDAuMjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IG1hcmtlckxpbmUgPSBmdW5jdGlvbihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICBsZXQgbGluZSA9IHBhcGVyLlBhdGguTGluZShhLCBiKTtcclxuICAgICAgICBsaW5lLnN0cm9rZUNvbG9yID0gJ2dyZWVuJztcclxuICAgICAgICAvL2xpbmUuZGFzaEFycmF5ID0gWzUsIDVdO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChsaW5lKTtcclxuICAgICAgICByZXR1cm4gbGluZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgbWFya2VyID0gZnVuY3Rpb24ocG9pbnQ6IHBhcGVyLlBvaW50LCBsYWJlbDogc3RyaW5nKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgLy9sZXQgbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvaW50LCAxMCk7XHJcbiAgICAgICAgbGV0IG1hcmtlciA9IG5ldyBwYXBlci5Qb2ludFRleHQocG9pbnQpO1xyXG4gICAgICAgIG1hcmtlci5mb250U2l6ZSA9IDM2O1xyXG4gICAgICAgIG1hcmtlci5jb250ZW50ID0gbGFiZWw7XHJcbiAgICAgICAgbWFya2VyLnN0cm9rZUNvbG9yID0gXCJyZWRcIjtcclxuICAgICAgICBtYXJrZXIuYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgLy9QYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobWFya2VyKTtcclxuICAgICAgICByZXR1cm4gbWFya2VyO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBzaW1wbGlmeSA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGhJdGVtLCB0b2xlcmFuY2U/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNpbXBsaWZ5KDxwYXBlci5QYXRoSXRlbT5wLCB0b2xlcmFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKDxwYXBlci5QYXRoPnBhdGgpLnNpbXBsaWZ5KHRvbGVyYW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluZCBzZWxmIG9yIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgZmluZFNlbGZPckFuY2VzdG9yID0gZnVuY3Rpb24oaXRlbTogcGFwZXIuSXRlbSwgcHJlZGljYXRlOiAoaTogcGFwZXIuSXRlbSkgPT4gYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUoaXRlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQYXBlckhlbHBlcnMuZmluZEFuY2VzdG9yKGl0ZW0sIHByZWRpY2F0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgZmluZEFuY2VzdG9yID0gZnVuY3Rpb24oaXRlbTogcGFwZXIuSXRlbSwgcHJlZGljYXRlOiAoaTogcGFwZXIuSXRlbSkgPT4gYm9vbGVhbikge1xyXG4gICAgICAgIGlmICghaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHByaW9yOiBwYXBlci5JdGVtO1xyXG4gICAgICAgIGxldCBjaGVja2luZyA9IGl0ZW0ucGFyZW50O1xyXG4gICAgICAgIHdoaWxlIChjaGVja2luZyAmJiBjaGVja2luZyAhPT0gcHJpb3IpIHtcclxuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShjaGVja2luZykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjaGVja2luZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmlvciA9IGNoZWNraW5nO1xyXG4gICAgICAgICAgICBjaGVja2luZyA9IGNoZWNraW5nLnBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgY29ybmVycyBvZiB0aGUgcmVjdCwgY2xvY2t3aXNlIHN0YXJ0aW5nIGZyb20gdG9wTGVmdFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgY29ybmVycyA9IGZ1bmN0aW9uKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSk6IHBhcGVyLlBvaW50W10ge1xyXG4gICAgICAgIHJldHVybiBbcmVjdC50b3BMZWZ0LCByZWN0LnRvcFJpZ2h0LCByZWN0LmJvdHRvbVJpZ2h0LCByZWN0LmJvdHRvbUxlZnRdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdGhlIG1pZHBvaW50IGJldHdlZW4gdHdvIHBvaW50c1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgbWlkcG9pbnQgPSBmdW5jdGlvbihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICByZXR1cm4gYi5zdWJ0cmFjdChhKS5kaXZpZGUoMikuYWRkKGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBjbG9uZVNlZ21lbnQgPSBmdW5jdGlvbihzZWdtZW50OiBwYXBlci5TZWdtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KHNlZ21lbnQucG9pbnQsIHNlZ21lbnQuaGFuZGxlSW4sIHNlZ21lbnQuaGFuZGxlT3V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1ha2UgYW4gaXRlbSBkcmFnZ2FibGUsIGFkZGluZyByZWxhdGVkIGV2ZW50cy5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGFkZFNtYXJ0RHJhZyA9IGZ1bmN0aW9uKGl0ZW06IHBhcGVyLkl0ZW0pIHtcclxuICAgICAgICBpdGVtLmlzU21hcnREcmFnZ2FibGUgPSB0cnVlO1xyXG5cclxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgbG9nKFwic21hcnREcmFnLm9uTW91c2VEcmFnXCIsIGl0ZW0sIGV2KTtcclxuICAgICAgICAgICAgaWYgKGV2LnNtYXJ0RHJhZ0l0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIldpbGwgbm90IGFzc2lnbiBzbWFydERyYWdJdGVtOiB2YWx1ZSB3YXMgYWxyZWFkeSBcIiArIGV2LnNtYXJ0RHJhZ0l0ZW0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXYuc21hcnREcmFnSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghaXRlbS5pc1NtYXJ0RHJhZ2dpbmcpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uaXNTbWFydERyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxvZyhcImVtaXR0aW5nIHNtYXJ0RHJhZy5zbWFydERyYWdTdGFydFwiKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZW1pdChFdmVudFR5cGUuc21hcnREcmFnU3RhcnQsIGV2KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXRlbS5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb24uYWRkKGV2LmRlbHRhKTtcclxuXHJcbiAgICAgICAgICAgIGxvZyhcImVtaXR0aW5nIHNtYXJ0RHJhZy5zbWFydERyYWdNb3ZlXCIpO1xyXG4gICAgICAgICAgICBpdGVtLmVtaXQoRXZlbnRUeXBlLnNtYXJ0RHJhZ01vdmUsIGV2KTtcclxuXHJcbiAgICAgICAgICAgIGV2LnN0b3AoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXRlbS5vbihwYXBlci5FdmVudFR5cGUubW91c2VVcCwgZXYgPT4ge1xyXG4gICAgICAgICAgICBsb2coXCJzbWFydERyYWcub25Nb3VzZVVwXCIsIGl0ZW0sIGV2KTtcclxuICAgICAgICAgICAgaWYgKGV2LnNtYXJ0RHJhZ0l0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIldpbGwgbm90IGFzc2lnbiBzbWFydERyYWdJdGVtOiB2YWx1ZSB3YXMgYWxyZWFkeSBcIiArIGV2LnNtYXJ0RHJhZ0l0ZW0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXYuc21hcnREcmFnSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtLmlzU21hcnREcmFnZ2luZykge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5pc1NtYXJ0RHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGxvZyhcImVtaXR0aW5nIHNtYXJ0RHJhZy5zbWFydERyYWdFbmRcIik7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQoRXZlbnRUeXBlLnNtYXJ0RHJhZ0VuZCwgZXYpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG9nKFwiZW1pdHRpbmcgc21hcnREcmFnLmNsaWNrV2l0aG91dERyYWdcIik7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQoRXZlbnRUeXBlLmNsaWNrV2l0aG91dERyYWcsIGV2KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZXYuc3RvcCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgY29uc3QgRXZlbnRUeXBlID0ge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEcmFnIGFjdGlvbiBoYXMgc3RhcnRlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzbWFydERyYWdTdGFydDogXCJzbWFydERyYWdTdGFydFwiLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEcmFnZ2VkIGl0ZW0gaGFzIG1vdmVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNtYXJ0RHJhZ01vdmU6IFwic21hcnREcmFnTW92ZVwiLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEcmFnIGFjdGlvbiBoYXMgZW5kZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc21hcnREcmFnRW5kOiBcInNtYXJ0RHJhZ0VuZFwiLFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgbm9ybWFsIGNsaWNrIGV2ZW50IHdpbGwgZmlyZSBldmVuIGF0IHRoZSBlbmQgb2YgYSBkcmFnLlxyXG4gICAgICAgICAqIFRoaXMgY2xpY2sgZXZlbnQgZG9lcyBub3QuIFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNsaWNrV2l0aG91dERyYWc6IFwiY2xpY2tXaXRob3V0RHJhZ1wiXHJcbiAgICB9XHJcbn1cclxuXHJcbmRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSXRlbSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZ2dpbmcgYmVoYXZpb3IgYWRkZWQgYnkgUGFwZXJIZWxwZXJzOiBpcyB0aGUgaXRlbSBiZWluZyBkcmFnZ2VkP1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzU21hcnREcmFnZ2luZzogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZ2dpbmcgYmVoYXZpb3IgYWRkZWQgYnkgUGFwZXJIZWxwZXJzOiBpcyB0aGUgaXRlbSBkcmFnZ2FibGU/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNTbWFydERyYWdnYWJsZTogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRvb2xFdmVudCB7XHJcbiAgICAgICAgc21hcnREcmFnSXRlbTogSXRlbTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFBhcGVyTW91c2VFdmVudCB7XHJcbiAgICAgICAgc21hcnREcmFnSXRlbTogSXRlbTtcclxuICAgIH1cclxufSIsIlxyXG50eXBlIEl0ZW1DaGFuZ2VIYW5kbGVyID0gKGZsYWdzOiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnKSA9PiB2b2lkO1xyXG50eXBlIENhbGxiYWNrID0gKCkgPT4gdm9pZDtcclxuXHJcbmRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcclxuICAgIGludGVyZmFjZSBJdGVtIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTdWJzY3JpYmUgdG8gYWxsIGNoYW5nZXMgaW4gaXRlbS4gUmV0dXJucyB1bi1zdWJzY3JpYmUgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3Vic2NyaWJlKGhhbmRsZXI6IEl0ZW1DaGFuZ2VIYW5kbGVyKTogQ2FsbGJhY2s7XHJcbiAgICAgICAgXHJcbiAgICAgICAgX2NoYW5nZWQoZmxhZ3M6IFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcpOiB2b2lkO1xyXG4gICAgfVxyXG59XHJcblxyXG5uYW1lc3BhY2UgUGFwZXJOb3RpZnkge1xyXG5cclxuICAgIGV4cG9ydCBlbnVtIENoYW5nZUZsYWcge1xyXG4gICAgICAgIC8vIEFueXRoaW5nIGFmZmVjdGluZyB0aGUgYXBwZWFyYW5jZSBvZiBhbiBpdGVtLCBpbmNsdWRpbmcgR0VPTUVUUlksXHJcbiAgICAgICAgLy8gU1RST0tFLCBTVFlMRSBhbmQgQVRUUklCVVRFIChleGNlcHQgZm9yIHRoZSBpbnZpc2libGUgb25lczogbG9ja2VkLCBuYW1lKVxyXG4gICAgICAgIEFQUEVBUkFOQ0UgPSAweDEsXHJcbiAgICAgICAgLy8gQSBjaGFuZ2UgaW4gdGhlIGl0ZW0ncyBjaGlsZHJlblxyXG4gICAgICAgIENISUxEUkVOID0gMHgyLFxyXG4gICAgICAgIC8vIEEgY2hhbmdlIG9mIHRoZSBpdGVtJ3MgcGxhY2UgaW4gdGhlIHNjZW5lIGdyYXBoIChyZW1vdmVkLCBpbnNlcnRlZCxcclxuICAgICAgICAvLyBtb3ZlZCkuXHJcbiAgICAgICAgSU5TRVJUSU9OID0gMHg0LFxyXG4gICAgICAgIC8vIEl0ZW0gZ2VvbWV0cnkgKHBhdGgsIGJvdW5kcylcclxuICAgICAgICBHRU9NRVRSWSA9IDB4OCxcclxuICAgICAgICAvLyBPbmx5IHNlZ21lbnQocykgaGF2ZSBjaGFuZ2VkLCBhbmQgYWZmZWN0ZWQgY3VydmVzIGhhdmUgYWxyZWFkeSBiZWVuXHJcbiAgICAgICAgLy8gbm90aWZpZWQuIFRoaXMgaXMgdG8gaW1wbGVtZW50IGFuIG9wdGltaXphdGlvbiBpbiBfY2hhbmdlZCgpIGNhbGxzLlxyXG4gICAgICAgIFNFR01FTlRTID0gMHgxMCxcclxuICAgICAgICAvLyBTdHJva2UgZ2VvbWV0cnkgKGV4Y2x1ZGluZyBjb2xvcilcclxuICAgICAgICBTVFJPS0UgPSAweDIwLFxyXG4gICAgICAgIC8vIEZpbGwgc3R5bGUgb3Igc3Ryb2tlIGNvbG9yIC8gZGFzaFxyXG4gICAgICAgIFNUWUxFID0gMHg0MCxcclxuICAgICAgICAvLyBJdGVtIGF0dHJpYnV0ZXM6IHZpc2libGUsIGJsZW5kTW9kZSwgbG9ja2VkLCBuYW1lLCBvcGFjaXR5LCBjbGlwTWFzayAuLi5cclxuICAgICAgICBBVFRSSUJVVEUgPSAweDgwLFxyXG4gICAgICAgIC8vIFRleHQgY29udGVudFxyXG4gICAgICAgIENPTlRFTlQgPSAweDEwMCxcclxuICAgICAgICAvLyBSYXN0ZXIgcGl4ZWxzXHJcbiAgICAgICAgUElYRUxTID0gMHgyMDAsXHJcbiAgICAgICAgLy8gQ2xpcHBpbmcgaW4gb25lIG9mIHRoZSBjaGlsZCBpdGVtc1xyXG4gICAgICAgIENMSVBQSU5HID0gMHg0MDAsXHJcbiAgICAgICAgLy8gVGhlIHZpZXcgaGFzIGJlZW4gdHJhbnNmb3JtZWRcclxuICAgICAgICBWSUVXID0gMHg4MDBcclxuICAgIH1cclxuXHJcbiAgICAvLyBTaG9ydGN1dHMgdG8gb2Z0ZW4gdXNlZCBDaGFuZ2VGbGFnIHZhbHVlcyBpbmNsdWRpbmcgQVBQRUFSQU5DRVxyXG4gICAgZXhwb3J0IGVudW0gQ2hhbmdlcyB7XHJcbiAgICAgICAgLy8gQ0hJTERSRU4gYWxzbyBjaGFuZ2VzIEdFT01FVFJZLCBzaW5jZSByZW1vdmluZyBjaGlsZHJlbiBmcm9tIGdyb3Vwc1xyXG4gICAgICAgIC8vIGNoYW5nZXMgYm91bmRzLlxyXG4gICAgICAgIENISUxEUkVOID0gQ2hhbmdlRmxhZy5DSElMRFJFTiB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgLy8gQ2hhbmdpbmcgdGhlIGluc2VydGlvbiBjYW4gY2hhbmdlIHRoZSBhcHBlYXJhbmNlIHRocm91Z2ggcGFyZW50J3MgbWF0cml4LlxyXG4gICAgICAgIElOU0VSVElPTiA9IENoYW5nZUZsYWcuSU5TRVJUSU9OIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIEdFT01FVFJZID0gQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBTRUdNRU5UUyA9IENoYW5nZUZsYWcuU0VHTUVOVFMgfCBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNUUk9LRSA9IENoYW5nZUZsYWcuU1RST0tFIHwgQ2hhbmdlRmxhZy5TVFlMRSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBTVFlMRSA9IENoYW5nZUZsYWcuU1RZTEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgQVRUUklCVVRFID0gQ2hhbmdlRmxhZy5BVFRSSUJVVEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgQ09OVEVOVCA9IENoYW5nZUZsYWcuQ09OVEVOVCB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgUElYRUxTID0gQ2hhbmdlRmxhZy5QSVhFTFMgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgVklFVyA9IENoYW5nZUZsYWcuVklFVyB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRVxyXG4gICAgfTtcclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICBcclxuICAgICAgICAvLyBJbmplY3QgSXRlbS5zdWJzY3JpYmVcclxuICAgICAgICBjb25zdCBpdGVtUHJvdG8gPSAoPGFueT5wYXBlcikuSXRlbS5wcm90b3R5cGU7XHJcbiAgICAgICAgaXRlbVByb3RvLnN1YnNjcmliZSA9IGZ1bmN0aW9uKGhhbmRsZXI6IEl0ZW1DaGFuZ2VIYW5kbGVyKTogQ2FsbGJhY2sge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3N1YnNjcmliZXJzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGhhbmRsZXIpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMucHVzaChoYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyLCAwKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gV3JhcCBJdGVtLnJlbW92ZVxyXG4gICAgICAgIGNvbnN0IGl0ZW1SZW1vdmUgPSBpdGVtUHJvdG8ucmVtb3ZlO1xyXG4gICAgICAgIGl0ZW1Qcm90by5yZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXRlbVJlbW92ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXcmFwIFByb2plY3QuX2NoYW5nZWRcclxuICAgICAgICBjb25zdCBwcm9qZWN0UHJvdG8gPSA8YW55PnBhcGVyLlByb2plY3QucHJvdG90eXBlO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RDaGFuZ2VkID0gcHJvamVjdFByb3RvLl9jaGFuZ2VkO1xyXG4gICAgICAgIHByb2plY3RQcm90by5fY2hhbmdlZCA9IGZ1bmN0aW9uKGZsYWdzOiBDaGFuZ2VGbGFnLCBpdGVtOiBwYXBlci5JdGVtKSB7XHJcbiAgICAgICAgICAgIHByb2plY3RDaGFuZ2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJzID0gKDxhbnk+aXRlbSkuX3N1YnNjcmliZXJzO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1YnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBzIG9mIHN1YnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcy5jYWxsKGl0ZW0sIGZsYWdzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRlc2NyaWJlKGZsYWdzOiBDaGFuZ2VGbGFnKSB7XHJcbiAgICAgICAgbGV0IGZsYWdMaXN0OiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIF8uZm9yT3duKENoYW5nZUZsYWcsICh2YWx1ZSwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICgodHlwZW9mIHZhbHVlKSA9PT0gXCJudW1iZXJcIiAmJiAodmFsdWUgJiBmbGFncykpIHtcclxuICAgICAgICAgICAgICAgIGZsYWdMaXN0LnB1c2goa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmbGFnTGlzdC5qb2luKCcgfCAnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmUoaXRlbTogcGFwZXIuSXRlbSwgZmxhZ3M6IENoYW5nZUZsYWcpOiBcclxuICAgICAgICBSeC5PYnNlcnZhYmxlPENoYW5nZUZsYWc+IFxyXG4gICAge1xyXG4gICAgICAgIGxldCB1bnN1YjogKCkgPT4gdm9pZDtcclxuICAgICAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuPENoYW5nZUZsYWc+KFxyXG4gICAgICAgICAgICBhZGRIYW5kbGVyID0+IHtcclxuICAgICAgICAgICAgICAgIHVuc3ViID0gaXRlbS5zdWJzY3JpYmUoZiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZiAmIGZsYWdzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkSGFuZGxlcihmKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgIHJlbW92ZUhhbmRsZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodW5zdWIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHVuc3ViKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuUGFwZXJOb3RpZnkuaW5pdGlhbGl6ZSgpO1xyXG4iLCJcclxubW9kdWxlIHBhcGVyIHtcclxuXHJcbiAgICBleHBvcnQgdmFyIEV2ZW50VHlwZSA9IHtcclxuICAgICAgICBmcmFtZTogXCJmcmFtZVwiLFxyXG4gICAgICAgIG1vdXNlRG93bjogXCJtb3VzZWRvd25cIixcclxuICAgICAgICBtb3VzZVVwOiBcIm1vdXNldXBcIixcclxuICAgICAgICBtb3VzZURyYWc6IFwibW91c2VkcmFnXCIsXHJcbiAgICAgICAgY2xpY2s6IFwiY2xpY2tcIixcclxuICAgICAgICBkb3VibGVDbGljazogXCJkb3VibGVjbGlja1wiLFxyXG4gICAgICAgIG1vdXNlTW92ZTogXCJtb3VzZW1vdmVcIixcclxuICAgICAgICBtb3VzZUVudGVyOiBcIm1vdXNlZW50ZXJcIixcclxuICAgICAgICBtb3VzZUxlYXZlOiBcIm1vdXNlbGVhdmVcIixcclxuICAgICAgICBrZXl1cDogXCJrZXl1cFwiLFxyXG4gICAgICAgIGtleWRvd246IFwia2V5ZG93blwiXHJcbiAgICB9XHJcblxyXG59IiwiXHJcbi8vIGNsYXNzIE9sZFRvcGljPFQ+IHtcclxuXHJcbi8vICAgICBwcml2YXRlIF9jaGFubmVsOiBJQ2hhbm5lbERlZmluaXRpb248T2JqZWN0PjtcclxuLy8gICAgIHByaXZhdGUgX25hbWU6IHN0cmluZztcclxuXHJcbi8vICAgICBjb25zdHJ1Y3RvcihjaGFubmVsOiBJQ2hhbm5lbERlZmluaXRpb248T2JqZWN0PiwgdG9waWM6IHN0cmluZykge1xyXG4vLyAgICAgICAgIHRoaXMuX2NoYW5uZWwgPSBjaGFubmVsO1xyXG4vLyAgICAgICAgIHRoaXMuX25hbWUgPSB0b3BpYztcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiA8UnguT2JzZXJ2YWJsZTxUPj50aGlzLl9jaGFubmVsLm9ic2VydmUodGhpcy5fbmFtZSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHVibGlzaChkYXRhOiBUKSB7XHJcbi8vICAgICAgICAgdGhpcy5fY2hhbm5lbC5wdWJsaXNoKHRoaXMuX25hbWUsIGRhdGEpO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHN1YnNjcmliZShjYWxsYmFjazogSUNhbGxiYWNrPFQ+KTogSVN1YnNjcmlwdGlvbkRlZmluaXRpb248VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiB0aGlzLl9jaGFubmVsLnN1YnNjcmliZSh0aGlzLl9uYW1lLCBjYWxsYmFjayk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHJvdGVjdGVkIHN1YnRvcGljKG5hbWUpOiBDaGFubmVsVG9waWM8VD4ge1xyXG4vLyAgICAgICAgIHJldHVybiBuZXcgQ2hhbm5lbFRvcGljPFQ+KHRoaXMuX2NoYW5uZWwsIHRoaXMuX25hbWUgKyAnLicgKyBuYW1lKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBwcm90ZWN0ZWQgc3VidG9waWNPZjxVIGV4dGVuZHMgVD4obmFtZSk6IENoYW5uZWxUb3BpYzxVPiB7XHJcbi8vICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VT4odGhpcy5fY2hhbm5lbCwgdGhpcy5fbmFtZSArICcuJyArIG5hbWUpO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcbiIsIlxyXG5pbnRlcmZhY2UgSVBvc3RhbCB7XHJcbiAgICBvYnNlcnZlOiAob3B0aW9uczogUG9zdGFsT2JzZXJ2ZU9wdGlvbnMpID0+IFJ4Lk9ic2VydmFibGU8YW55PjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFBvc3RhbE9ic2VydmVPcHRpb25zIHtcclxuICAgIGNoYW5uZWw6IHN0cmluZztcclxuICAgIHRvcGljOiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJQ2hhbm5lbERlZmluaXRpb248VD4ge1xyXG4gICAgb2JzZXJ2ZSh0b3BpYzogc3RyaW5nKTogUnguT2JzZXJ2YWJsZTxUPjtcclxufVxyXG5cclxucG9zdGFsLm9ic2VydmUgPSBmdW5jdGlvbihvcHRpb25zOiBQb3N0YWxPYnNlcnZlT3B0aW9ucykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIGNoYW5uZWwgPSBvcHRpb25zLmNoYW5uZWw7XHJcbiAgICB2YXIgdG9waWMgPSBvcHRpb25zLnRvcGljO1xyXG5cclxuICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm4oXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkSGFuZGxlcihoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgICAgICBjaGFubmVsOiBjaGFubmVsLFxyXG4gICAgICAgICAgICAgICAgdG9waWM6IHRvcGljLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsSGFuZGxlcihfLCBzdWIpIHtcclxuICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufTtcclxuXHJcbi8vIGFkZCBvYnNlcnZlIHRvIENoYW5uZWxEZWZpbml0aW9uXHJcbig8YW55PnBvc3RhbCkuQ2hhbm5lbERlZmluaXRpb24ucHJvdG90eXBlLm9ic2VydmUgPSBmdW5jdGlvbih0b3BpYzogc3RyaW5nKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybihcclxuICAgICAgICBmdW5jdGlvbiBhZGRIYW5kbGVyKGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuYnVzLnN1YnNjcmliZSh7XHJcbiAgICAgICAgICAgICAgICBjaGFubmVsOiBzZWxmLmNoYW5uZWwsXHJcbiAgICAgICAgICAgICAgICB0b3BpYzogdG9waWMsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogaCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiBkZWxIYW5kbGVyKF8sIHN1Yikge1xyXG4gICAgICAgICAgICBzdWIudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG59O1xyXG4iLCJcclxuY29uc3QgcmggPSBSZWFjdC5jcmVhdGVFbGVtZW50O1xyXG4iLCJcclxuYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50PFQ+IHtcclxuICAgIGFic3RyYWN0IHJlbmRlcihkYXRhOiBUKTogVk5vZGU7XHJcbn0iLCJcclxuaW50ZXJmYWNlIFJlYWN0aXZlRG9tQ29tcG9uZW50IHtcclxuICAgIGRvbSQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+O1xyXG59XHJcblxyXG5jbGFzcyBSZWFjdGl2ZURvbSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSByZWFjdGl2ZSBjb21wb25lbnQgd2l0aGluIGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlclN0cmVhbShcclxuICAgICAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPixcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50XHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBjb250YWluZXIuaWQ7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQ6IEhUTUxFbGVtZW50IHwgVk5vZGUgPSBjb250YWluZXI7XHJcbiAgICAgICAgY29uc3Qgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGRvbSQuc3Vic2NyaWJlKGRvbSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFkb20pIHJldHVybjtcclxuLy9jb25zb2xlLmxvZygncmVuZGVyaW5nIGRvbScsIGRvbSk7IC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gcmV0YWluIElEXHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGNoZWQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xyXG4gICAgICAgICAgICBpZihpZCAmJiAhcGF0Y2hlZC5lbG0uaWQpe1xyXG4gICAgICAgICAgICAgICAgcGF0Y2hlZC5lbG0uaWQgPSBpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoZWQ7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciBhIHJlYWN0aXZlIGNvbXBvbmVudCB3aXRoaW4gY29udGFpbmVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyQ29tcG9uZW50KFxyXG4gICAgICAgIGNvbXBvbmVudDogUmVhY3RpdmVEb21Db21wb25lbnQsXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudCB8IFZOb2RlXHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjb250YWluZXI7XHJcbiAgICAgICAgbGV0IHNpbmsgPSBuZXcgUnguU3ViamVjdDxWTm9kZT4oKTtcclxuICAgICAgICBjb21wb25lbnQuZG9tJC5zdWJzY3JpYmUoZG9tID0+IHtcclxuICAgICAgICAgICAgaWYoIWRvbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIHdpdGhpbiBjb250YWluZXIgd2hlbmV2ZXIgc291cmNlIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsaXZlUmVuZGVyPFQ+KFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZSxcclxuICAgICAgICBzb3VyY2U6IFJ4Lk9ic2VydmFibGU8VD4sXHJcbiAgICAgICAgcmVuZGVyOiAobmV4dDogVCkgPT4gVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gcmVuZGVyKGRhdGEpO1xyXG4gICAgICAgICAgICBpZighbm9kZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgbm9kZSk7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbn0iLCIvLyBjb25zdCBBbWF0aWNVcmwgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3MvYW1hdGljc2MvdjgvSURua1JUUEdjclNWbzUwVXlZTks3eTNVU0JuU3Zwa29wUWFVUi0ycjdpVS50dGYnO1xyXG4vLyBjb25zdCBSb2JvdG8xMDAgPSAnaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3Mvcm9ib3RvL3YxNS83TXlncVRlMnpzOVlrUDBhZEE5UVFRLnR0Zic7XHJcbi8vIGNvbnN0IFJvYm90bzUwMCA9ICdmb250cy9Sb2JvdG8tNTAwLnR0Zic7XHJcbi8vIGNvbnN0IFJvYm90bzkwMCA9IFwiaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3Mvcm9ib3RvL3YxNS9IMXZCMzRuT0tXWHF6S290cTI1cGNnLnR0ZlwiO1xyXG4vLyBjb25zdCBPcGVuU2Fuc1JlZ3VsYXIgPSBcImZvbnRzL09wZW5TYW5zL09wZW5TYW5zLVJlZ3VsYXIudHRmXCI7XHJcbi8vIGNvbnN0IE9wZW5TYW5zRXh0cmFCb2xkID0gXCJmb250cy9PcGVuU2Fucy9PcGVuU2Fucy1FeHRyYUJvbGQudHRmXCI7XHJcbi8vIGNvbnN0IEFxdWFmaW5hU2NyaXB0ID0gJ2ZvbnRzL0FndWFmaW5hU2NyaXB0LVJlZ3VsYXIvQWd1YWZpbmFTY3JpcHQtUmVndWxhci50dGYnXHJcbi8vIGNvbnN0IE5vcmljYW4gPSBcImh0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL25vcmljYW4vdjQvU0huU3FoWUFXRzVzWlRXY1B6RUhpZy50dGZcIjtcclxuXHJcbmNsYXNzIEFwcENvbnRyb2xsZXIge1xyXG5cclxuICAgIHN0b3JlOiBTdG9yZTtcclxuICAgIHdvcmtzcGFjZUNvbnRyb2xsZXI6IFdvcmtzcGFjZUNvbnRyb2xsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc3RvcmU6IFN0b3JlLFxyXG4gICAgICAgIHNrZXRjaEVkaXRvcjogU2tldGNoRWRpdG9yLFxyXG4gICAgICAgIHNlbGVjdGVkSXRlbUVkaXRvcjogU2VsZWN0ZWRJdGVtRWRpdG9yKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGFjdGlvbnMgPSBzdG9yZS5hY3Rpb25zLCBldmVudHMgPSBzdG9yZS5ldmVudHM7XHJcblxyXG4gICAgICAgIGV2ZW50cy5zdWJzY3JpYmUobSA9PiBjb25zb2xlLmxvZyhcImV2ZW50XCIsIG0udHlwZSwgbS5kYXRhKSk7XHJcbiAgICAgICAgYWN0aW9ucy5zdWJzY3JpYmUobSA9PiBjb25zb2xlLmxvZyhcImFjdGlvblwiLCBtLnR5cGUsIG0uZGF0YSkpO1xyXG5cclxuICAgICAgICBldmVudHMuYXBwLmZvbnRMb2FkZWQub2JzZXJ2ZSgpLmZpcnN0KCkuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2VDb250cm9sbGVyID0gbmV3IFdvcmtzcGFjZUNvbnRyb2xsZXIoc3RvcmUsIG0uZGF0YSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBldmVudHMuYXBwLnJldGFpbmVkU3RhdGVMb2FkQXR0ZW1wdENvbXBsZXRlLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghbS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbm8gYXV0b3NhdmUgZGF0YSBsb2FkZWRcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5jcmVhdGUuZGlzcGF0Y2goKTtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5hZGQuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogXCJGSURETEVTVElDS1NcIiwgdGV4dENvbG9yOiBcImxpZ2h0Ymx1ZVwiLCBmb250U2l6ZTogMTI4IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gQXV0by1zYXZlIGluIG9uZSBsaW5lOiBnb3R0YSBsb3ZlIGl0LlxyXG4gICAgICAgICAgICAgICAgZXZlbnRzLmFwcC5yZXRhaW5lZFN0YXRlQ2hhbmdlZC5vYnNlcnZlKCkuZGVib3VuY2UoODAwKS5zdWJzY3JpYmUoc3RhdGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnMuYXBwLnNhdmVSZXRhaW5lZFN0YXRlLmRpc3BhdGNoKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmFwcC5sb2FkUmV0YWluZWRTdGF0ZS5kaXNwYXRjaCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBldmVudHMuc2tldGNoLmxvYWRlZC5zdWJzY3JpYmUoZXYgPT5cclxuICAgICAgICAgICAgJChcIiNtYWluQ2FudmFzXCIpLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgZXYuZGF0YS5iYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZXZlbnRzLnNrZXRjaC5hdHRyQ2hhbmdlZC5zdWJzY3JpYmUoZXYgPT5cclxuICAgICAgICAgICAgJChcIiNtYWluQ2FudmFzXCIpLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgZXYuZGF0YS5iYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbn0iLCJcclxuY2xhc3MgQWN0aW9ucyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcclxuICAgIFxyXG4gICAgYXBwID0geyAgICAgICBcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbnN0cnVjdHMgU3RvcmUgdG8gbG9hZCByZXRhaW5lZCBzdGF0ZSBmcm9tIGxvY2FsIHN0b3JhZ2UsIGlmIGl0IGV4aXN0cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsb2FkUmV0YWluZWRTdGF0ZTogdGhpcy50b3BpYzx2b2lkPihcImFwcC5sb2FkUmV0YWluZWRTdGF0ZVwiKSxcclxuICAgICAgICBcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbnN0cnVjdHMgU3RvcmUgdG8gc2F2ZSByZXRhaW5lZCBzdGF0ZSB0byBsb2NhbCBzdG9yYWdlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNhdmVSZXRhaW5lZFN0YXRlOiB0aGlzLnRvcGljPHZvaWQ+KFwiYXBwLnNhdmVSZXRhaW5lZFN0YXRlXCIpLFxyXG4gICAgICAgIFxyXG4gICAgICAgIGxvYWRGb250OiB0aGlzLnRvcGljPHN0cmluZz4oXCJhcHAubG9hZEZvbnRcIilcclxuICAgIH07XHJcbiAgICBcclxuICAgIGRlc2lnbmVyID0ge1xyXG4gICAgICAgIHpvb21Ub0ZpdDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLnpvb21Ub0ZpdFwiKSxcclxuICAgICAgICBleHBvcnRpbmdJbWFnZTogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydEltYWdlXCIpLFxyXG4gICAgICAgIGV4cG9ydFBORzogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydFBOR1wiKSxcclxuICAgICAgICBleHBvcnRTVkc6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRTVkdcIiksXHJcbiAgICAgICAgdmlld0NoYW5nZWQ6IHRoaXMudG9waWM8cGFwZXIuUmVjdGFuZ2xlPihcImRlc2lnbmVyLnZpZXdDaGFuZ2VkXCIpXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNrZXRjaCA9IHtcclxuICAgICAgICBjcmVhdGU6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5jcmVhdGVcIiksXHJcbiAgICAgICAgYXR0clVwZGF0ZTogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmF0dHJVcGRhdGVcIiksXHJcbiAgICAgICAgc2V0RWRpdGluZ0l0ZW06IHRoaXMudG9waWM8UG9zaXRpb25lZE9iamVjdFJlZj4oXCJza2V0Y2guc2V0RWRpdGluZ0l0ZW1cIiksXHJcbiAgICAgICAgc2V0U2VsZWN0aW9uOiB0aGlzLnRvcGljPFdvcmtzcGFjZU9iamVjdFJlZj4oXCJza2V0Y2guc2V0U2VsZWN0aW9uXCIpLFxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGV4dEJsb2NrID0ge1xyXG4gICAgICAgIGFkZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFkZFwiKSxcclxuICAgICAgICB1cGRhdGVBdHRyOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sudXBkYXRlQXR0clwiKSxcclxuICAgICAgICB1cGRhdGVBcnJhbmdlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sudXBkYXRlQXJyYW5nZVwiKSxcclxuICAgICAgICByZW1vdmU6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5yZW1vdmVcIilcclxuICAgIH07XHJcbiAgICBcclxufVxyXG5cclxuY2xhc3MgRXZlbnRzIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWwge1xyXG4gICAgXHJcbiAgICBhcHAgPSB7XHJcbiAgICAgICAgcmVzb3VyY2VzUmVhZHk6IHRoaXMudG9waWM8Ym9vbGVhbj4oXCJhcHAucmVzb3VyY2VzUmVhZHlcIiksXHJcbiAgICAgICAgcmV0YWluZWRTdGF0ZUxvYWRBdHRlbXB0Q29tcGxldGU6IHRoaXMudG9waWM8Ym9vbGVhbj4oXCJhcHAucmV0YWluZWRTdGF0ZUxvYWRBdHRlbXB0Q29tcGxldGVcIiksXHJcbiAgICAgICAgcmV0YWluZWRTdGF0ZUNoYW5nZWQ6IHRoaXMudG9waWM8UmV0YWluZWRTdGF0ZT4oXCJhcHAucmV0YWluZWRTdGF0ZUNoYW5nZWRcIiksXHJcbiAgICAgICAgZm9udExvYWRlZDogdGhpcy50b3BpYzxvcGVudHlwZS5Gb250PihcImFwcC5mb250TG9hZGVkXCIpXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGRlc2lnbmVyID0ge1xyXG4gICAgICAgIHpvb21Ub0ZpdFJlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZFwiKSxcclxuICAgICAgICBleHBvcnRQTkdSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRQTkdSZXF1ZXN0ZWRcIiksXHJcbiAgICAgICAgZXhwb3J0U1ZHUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0U1ZHUmVxdWVzdGVkXCIpLFxyXG4gICAgICAgIHZpZXdDaGFuZ2VkOiB0aGlzLnRvcGljPHBhcGVyLlJlY3RhbmdsZT4oXCJkZXNpZ25lci52aWV3Q2hhbmdlZFwiKVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2tldGNoID0ge1xyXG4gICAgICAgIGxvYWRlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmxvYWRlZFwiKSxcclxuICAgICAgICBhdHRyQ2hhbmdlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmF0dHJDaGFuZ2VkXCIpLFxyXG4gICAgICAgIGVkaXRpbmdJdGVtQ2hhbmdlZDogdGhpcy50b3BpYzxQb3NpdGlvbmVkT2JqZWN0UmVmPihcInNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWRcIiksXHJcbiAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogdGhpcy50b3BpYzxXb3Jrc3BhY2VPYmplY3RSZWY+KFwic2tldGNoLnNlbGVjdGlvbkNoYW5nZWRcIiksXHJcbiAgICAgICAgc2F2ZUxvY2FsUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwic2tldGNoLnNhdmVsb2NhbC5zYXZlTG9jYWxSZXF1ZXN0ZWRcIilcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRleHRibG9jayA9IHtcclxuICAgICAgICBhZGRlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFkZGVkXCIpLFxyXG4gICAgICAgIGF0dHJDaGFuZ2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYXR0ckNoYW5nZWRcIiksXHJcbiAgICAgICAgYXJyYW5nZUNoYW5nZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hcnJhbmdlQ2hhbmdlZFwiKSxcclxuICAgICAgICByZW1vdmVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sucmVtb3ZlZFwiKSxcclxuICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5sb2FkZWRcIiksXHJcbiAgICAgICAgZWRpdG9yQ2xvc2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suZWRpdG9yQ2xvc2VkXCIpLFxyXG4gICAgfTtcclxuICAgIFxyXG59XHJcblxyXG5jbGFzcyBDaGFubmVscyB7XHJcbiAgICBhY3Rpb25zOiBBY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgIGV2ZW50czogRXZlbnRzID0gbmV3IEV2ZW50cygpO1xyXG59XHJcbiIsIlxyXG5jbGFzcyBGb250RmFtaWxpZXNMb2FkZXIge1xyXG5cclxuICAgIGxvYWRMaXN0TG9jYWwoY2FsbGJhY2s6IChmYW1pbGllczogRm9udEZhbWlseVtdKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiBcImZvbnRzL2dvb2dsZS1mb250cy5qc29uXCIsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2U6IHsga2luZDogc3RyaW5nLCBpdGVtczogRm9udEZhbWlseVtdIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIG1ha2UgZmlsZXMgaHR0c1xyXG4gICAgICAgICAgICAgICAgZm9yKGNvbnN0IGZhbSBvZiByZXNwb25zZS5pdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uZm9yT3duKGZhbS5maWxlcywgKHZhbDogc3RyaW5nLCBrZXk6c3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKF8uc3RhcnRzV2l0aCh2YWwsIFwiaHR0cDpcIikpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFtLmZpbGVzW2tleV0gPSB2YWwucmVwbGFjZShcImh0dHA6XCIsIFwiaHR0cHM6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJlc3BvbnNlLml0ZW1zKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6ICh4aHIsIHN0YXR1cywgZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZ29vZ2xlLWZvbnRzLmpzb25cIiwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkTGlzdFJlbW90ZShjYWxsYmFjazogKGZhbWlsaWVzOiBGb250RmFtaWx5W10pID0+IHZvaWQpIHtcclxuICAgICAgICB2YXIgdXJsID0gJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3dlYmZvbnRzL3YxL3dlYmZvbnRzPyc7XHJcbiAgICAgICAgdmFyIGtleSA9ICdrZXk9R09PR0xFLUFQSS1LRVknO1xyXG4gICAgICAgIHZhciBzb3J0ID0gXCJwb3B1bGFyaXR5XCI7XHJcbiAgICAgICAgdmFyIG9wdCA9ICdzb3J0PScgKyBzb3J0ICsgJyYnO1xyXG4gICAgICAgIHZhciByZXEgPSB1cmwgKyBvcHQgKyBrZXk7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogcmVxLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlOiB7IGtpbmQ6IHN0cmluZywgaXRlbXM6IEZvbnRGYW1pbHlbXSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhyZXNwb25zZS5pdGVtcyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiAoeGhyLCBzdGF0dXMsIGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcih1cmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZvclByZXZpZXcoZmFtaWxpZXM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaHVuayBvZiBfLmNodW5rKGZhbWlsaWVzLCAxMCkpIHtcclxuICAgICAgICAgICAgV2ViRm9udC5sb2FkKHtcclxuICAgICAgICAgICAgICAgIGNsYXNzZXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZ29vZ2xlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmFtaWxpZXM6IDxzdHJpbmdbXT5jaHVuayxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbnR5cGUgUGFyc2VkRm9udExvYWRlZCA9ICh1cmw6IHN0cmluZywgZm9udDogb3BlbnR5cGUuRm9udCkgPT4gdm9pZDsgXHJcblxyXG5jbGFzcyBQYXJzZWRGb250cyB7XHJcblxyXG4gICAgZm9udHM6IHsgW3VybDogc3RyaW5nXTogb3BlbnR5cGUuRm9udDsgfSA9IHt9O1xyXG5cclxuICAgIHByaXZhdGUgX2ZvbnRMb2FkZWQ6IFBhcnNlZEZvbnRMb2FkZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udExvYWRlZDogUGFyc2VkRm9udExvYWRlZCl7XHJcbiAgICAgICAgdGhpcy5fZm9udExvYWRlZCA9IGZvbnRMb2FkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGZvbnRVcmw6IHN0cmluZywgb25SZWFkeTogUGFyc2VkRm9udExvYWRlZCA9IG51bGwpIHtcclxuICAgICAgICBsZXQgZm9udCA9IHRoaXMuZm9udHNbZm9udFVybF07XHJcblxyXG4gICAgICAgIGlmIChmb250KSB7XHJcbiAgICAgICAgICAgIG9uUmVhZHkgJiYgb25SZWFkeShmb250VXJsLCBmb250KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3BlbnR5cGUubG9hZChmb250VXJsLCAoZXJyLCBmb250KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9udHNbZm9udFVybF0gPSBmb250O1xyXG4gICAgICAgICAgICAgICAgb25SZWFkeSAmJiBvblJlYWR5KGZvbnRVcmwsIGZvbnQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udExvYWRlZChmb250VXJsLCBmb250KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiXHJcbm5hbWVzcGFjZSBTM0FjY2VzcyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGxvYWQgZmlsZSB0byBhcHBsaWNhdGlvbiBTMyBidWNrZXRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHVwbG9hZChmaWxlTmFtZTogc3RyaW5nLCBmaWxlVHlwZTogc3RyaW5nLCBkYXRhOiBCbG9iKSB7XHJcbiAgICAgICAgY29uc3Qgc2lnblVybCA9IGAvc2lnbl9zMz9maWxlX25hbWU9JHtmaWxlTmFtZX0mZmlsZV90eXBlPSR7ZmlsZVR5cGV9YDtcclxuICAgICAgICAvLyBnZXQgc2lnbmVkIFVSTFxyXG4gICAgICAgICQuZ2V0SlNPTihzaWduVXJsKVxyXG4gICAgICAgICAgICAuZG9uZShzaWduUmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBQVVQgZmlsZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcHV0UmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBzaWduUmVzcG9uc2Uuc2lnbmVkX3JlcXVlc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hbXotYWNsJzogJ3B1YmxpYy1yZWFkJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZpbGVUeXBlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHB1dFJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAuZG9uZShwdXRSZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cGxvYWRlZCBmaWxlXCIsIHNpZ25SZXNwb25zZS51cmwpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZhaWwoZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3IgdXBsb2FkaW5nIHRvIFMzXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIG9uIHNpZ25fczNcIiwgZXJyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4vLyAgICAgZXhwb3J0IGZ1bmN0aW9uIGdldF9zaWduZWRfcmVxdWVzdChmaWxlKSB7XHJcbi8vICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4vLyAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiL3NpZ25fczM/ZmlsZV9uYW1lPVwiICsgZmlsZS5uYW1lIFxyXG4vLyAgICAgICAgICAgICArIFwiJmZpbGVfdHlwZT1cIiArIGZpbGUudHlwZSk7XHJcbi8vICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4vLyAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcclxuLy8gICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHVwbG9hZF9maWxlKGZpbGUsIHJlc3BvbnNlLnNpZ25lZF9yZXF1ZXN0LCByZXNwb25zZS51cmwpO1xyXG4vLyAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJDb3VsZCBub3QgZ2V0IHNpZ25lZCBVUkwuXCIpO1xyXG4vLyAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfTtcclxuLy8gICAgICAgICB4aHIuc2VuZCgpO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIGV4cG9ydCBmdW5jdGlvbiB1cGxvYWRfZmlsZShmaWxlLCBzaWduZWRfcmVxdWVzdCwgdXJsKSB7XHJcbi8vICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4vLyAgICAgICAgIHhoci5vcGVuKFwiUFVUXCIsIHNpZ25lZF9yZXF1ZXN0KTtcclxuLy8gICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcigneC1hbXotYWNsJywgJ3B1YmxpYy1yZWFkJyk7XHJcbi8vICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4vLyAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcbi8vICAgICAgICAgICAgICAgICAoPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByZXZpZXdcIikpLnNyYyA9IHVybDtcclxuLy8gICAgICAgICAgICAgICAgICg8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXZhdGFyX3VybFwiKSkudmFsdWUgPSB1cmw7XHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICB9O1xyXG4vLyAgICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcbi8vICAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IHVwbG9hZCBmaWxlLlwiKTtcclxuLy8gICAgICAgICB9O1xyXG4vLyAgICAgICAgIHhoci5zZW5kKGZpbGUpO1xyXG4vLyAgICAgfVxyXG5cclxufSIsIlxyXG4vKipcclxuICogVGhlIHNpbmdsZXRvbiBTdG9yZSBjb250cm9scyBhbGwgYXBwbGljYXRpb24gc3RhdGUuXHJcbiAqIE5vIHBhcnRzIG91dHNpZGUgb2YgdGhlIFN0b3JlIG1vZGlmeSBhcHBsaWNhdGlvbiBzdGF0ZS5cclxuICogQ29tbXVuaWNhdGlvbiB3aXRoIHRoZSBTdG9yZSBpcyBkb25lIHRocm91Z2ggbWVzc2FnZSBDaGFubmVsczogXHJcbiAqICAgLSBBY3Rpb25zIGNoYW5uZWwgdG8gc2VuZCBpbnRvIHRoZSBTdG9yZSxcclxuICogICAtIEV2ZW50cyBjaGFubmVsIHRvIHJlY2VpdmUgbm90aWZpY2F0aW9uIGZyb20gdGhlIFN0b3JlLlxyXG4gKiBPbmx5IHRoZSBTdG9yZSBjYW4gcmVjZWl2ZSBhY3Rpb24gbWVzc2FnZXMuXHJcbiAqIE9ubHkgdGhlIFN0b3JlIGNhbiBzZW5kIGV2ZW50IG1lc3NhZ2VzLlxyXG4gKiBUaGUgU3RvcmUgY2Fubm90IHNlbmQgYWN0aW9ucyBvciBsaXN0ZW4gdG8gZXZlbnRzICh0byBhdm9pZCBsb29wcykuXHJcbiAqIE1lc3NhZ2VzIGFyZSB0byBiZSB0cmVhdGVkIGFzIGltbXV0YWJsZS5cclxuICogQWxsIG1lbnRpb25zIG9mIHRoZSBTdG9yZSBjYW4gYmUgYXNzdW1lZCB0byBtZWFuLCBvZiBjb3Vyc2UsXHJcbiAqICAgXCJUaGUgU3RvcmUgYW5kIGl0cyBzdWItY29tcG9uZW50cy5cIlxyXG4gKi9cclxuY2xhc3MgU3RvcmUge1xyXG5cclxuICAgIHN0YXRpYyBST0JPVE9fNTAwX0xPQ0FMID0gJ2ZvbnRzL1JvYm90by01MDAudHRmJztcclxuICAgIHN0YXRpYyBBVVRPU0FWRV9LRVkgPSBcIkZpZGRsZXN0aWNrcy5yZXRhaW5lZFN0YXRlXCI7XHJcbiAgICBzdGF0aWMgREVGQVVMVF9GT05UX05BTUUgPSBcIlJvYm90b1wiO1xyXG4gICAgc3RhdGljIEZPTlRfTElTVF9MSU1JVCA9IDEwMDtcclxuXHJcbiAgICBzdGF0ZSA9IHtcclxuICAgICAgICByZXRhaW5lZDogPFJldGFpbmVkU3RhdGU+e1xyXG4gICAgICAgICAgICBza2V0Y2g6IHRoaXMuY3JlYXRlU2tldGNoKClcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRpc3Bvc2FibGU6IDxEaXNwb3NhYmxlU3RhdGU+e31cclxuICAgIH1cclxuICAgIHJlc291cmNlcyA9IHtcclxuICAgICAgICBmb250RmFtaWxpZXM6IDxEaWN0aW9uYXJ5PEZvbnRGYW1pbHk+Pnt9LFxyXG4gICAgICAgIHBhcnNlZEZvbnRzOiBuZXcgUGFyc2VkRm9udHMoKHVybCwgZm9udCkgPT5cclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuYXBwLmZvbnRMb2FkZWQuZGlzcGF0Y2goZm9udCkpXHJcbiAgICB9XHJcbiAgICBhY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgIGV2ZW50cyA9IG5ldyBFdmVudHMoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnNldHVwU3Vic2NyaXB0aW9ucygpO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRSZXNvdXJjZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFN1YnNjcmlwdGlvbnMoKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuYWN0aW9ucywgZXZlbnRzID0gdGhpcy5ldmVudHM7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIEFwcCAtLS0tLVxyXG5cclxuICAgICAgICBhY3Rpb25zLmFwcC5sb2FkUmV0YWluZWRTdGF0ZS5vYnNlcnZlKClcclxuICAgICAgICAgICAgLy8gV2FybmluZzogc3Vic2NyaWJpbmcgdG8gZXZlbnQgd2l0aGluIFN0b3JlIC0gY3Jhenkgb3Igbm90Pz9cclxuICAgICAgICAgICAgLy8gd2FpdCB0byBsb2FkIHVudGlsIHJlc291cmNlcyBhcmUgcmVhZHlcclxuICAgICAgICAgICAgLnBhdXNhYmxlQnVmZmVyZWQoZXZlbnRzLmFwcC5yZXNvdXJjZXNSZWFkeS5vYnNlcnZlKCkubWFwKG0gPT4gbS5kYXRhKSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzdWNjZXNzID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFsb2NhbFN0b3JhZ2UgfHwgIWxvY2FsU3RvcmFnZS5nZXRJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90IHN1cHBvcnRlZFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzYXZlZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFN0b3JlLkFVVE9TQVZFX0tFWSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2F2ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2FkZWQgPSA8UmV0YWluZWRTdGF0ZT5KU09OLnBhcnNlKHNhdmVkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9hZGVkICYmIGxvYWRlZC5za2V0Y2ggJiYgbG9hZGVkLnNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRhdGEgc2VlbXMgbGVnaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXRhaW5lZCA9IGxvYWRlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy5za2V0Y2gubG9hZGVkLmRpc3BhdGNoKHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCB0YiBvZiB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmxvYWRlZC5kaXNwYXRjaCh0Yik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZC5kaXNwYXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBldmVudHMuYXBwLnJldGFpbmVkU3RhdGVMb2FkQXR0ZW1wdENvbXBsZXRlLmRpc3BhdGNoKHN1Y2Nlc3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5hcHAuc2F2ZVJldGFpbmVkU3RhdGUuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZSB8fCAhbG9jYWxTdG9yYWdlLmdldEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBzdXBwb3J0ZWRcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU3RvcmUuQVVUT1NBVkVfS0VZLCBKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXRlLnJldGFpbmVkKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuYXBwLmxvYWRGb250LnN1YnNjcmliZShtID0+XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChtLmRhdGEpKTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gRGVzaWduZXIgLS0tLS1cclxuXHJcbiAgICAgICAgYWN0aW9ucy5kZXNpZ25lci56b29tVG9GaXQuZm9yd2FyZChcclxuICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZCk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuZGVzaWduZXIuZXhwb3J0UE5HLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgIGV2ZW50cy5kZXNpZ25lci5leHBvcnRQTkdSZXF1ZXN0ZWQuZGlzcGF0Y2gobS5kYXRhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5kZXNpZ25lci5leHBvcnRTVkcuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLmV4cG9ydFNWR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLmRlc2lnbmVyLnZpZXdDaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgLy8gQ2FuJ3QgZG8gdGhpcywgZHVlIHRvIGNoYW5jZSBvZiBhY2NpZGVudGFsIGNsb3NpbmcgICBcclxuICAgICAgICAgICAgLy8gdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLnZpZXdDaGFuZ2VkLmRpc3BhdGNoKG0uZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIFNrZXRjaCAtLS0tLVxyXG5cclxuICAgICAgICBhY3Rpb25zLnNrZXRjaC5jcmVhdGVcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgobSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2ggPSB0aGlzLmNyZWF0ZVNrZXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0Y2ggPSBtLmRhdGEgfHwge307XHJcbiAgICAgICAgICAgICAgICBwYXRjaC5iYWNrZ3JvdW5kQ29sb3IgPSBwYXRjaC5iYWNrZ3JvdW5kQ29sb3IgfHwgJyNmNmYzZWInO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ24odGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gsIHBhdGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBldmVudHMuc2tldGNoLmxvYWRlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaCk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkLmRpc3BhdGNoKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoLmRlZmF1bHRGb250RGVzYy51cmwpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkUmV0YWluZWRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduKHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoLCBldi5kYXRhKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkUmV0YWluZWRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guc2V0RWRpdGluZ0l0ZW0uc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG0uZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKG0uZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvLyAtLS0tLSBUZXh0QmxvY2sgLS0tLS1cclxuXHJcbiAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2suYWRkXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcGF0Y2ggPSBldi5kYXRhO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwYXRjaC50ZXh0IHx8ICFwYXRjaC50ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHsgX2lkOiBuZXdpZCgpIH0gYXMgVGV4dEJsb2NrO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ24oYmxvY2ssIHBhdGNoKTtcclxuICAgICAgICAgICAgICAgIGlmICghYmxvY2suZm9udFNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5mb250U2l6ZSA9IDEyODtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghYmxvY2sudGV4dENvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sudGV4dENvbG9yID0gXCJncmF5XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChibG9jay5mb250RGVzYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoLmRlZmF1bHRGb250RGVzYyA9IGJsb2NrLmZvbnREZXNjO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5mb250RGVzYyA9IHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoLmRlZmF1bHRGb250RGVzYztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC50ZXh0QmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLnRleHRibG9jay5hZGRlZC5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRSZXRhaW5lZFN0YXRlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5nZXRCbG9jayhldi5kYXRhLl9pZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGF0Y2ggPSA8VGV4dEJsb2NrPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXYuZGF0YS50ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGV2LmRhdGEuYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Q29sb3I6IGV2LmRhdGEudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250RGVzYzogZXYuZGF0YS5mb250RGVzYyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IGV2LmRhdGEuZm9udFNpemVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduKGJsb2NrLCBwYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLmZvbnREZXNjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoLmRlZmF1bHRGb250RGVzYyA9IGJsb2NrLmZvbnREZXNjO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmF0dHJDaGFuZ2VkLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRSZXRhaW5lZFN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5yZW1vdmVcclxuICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGlkRGVsZXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBfLnJlbW92ZSh0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC50ZXh0QmxvY2tzLCB0YiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRiLl9pZCA9PT0gZXYuZGF0YS5faWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlkRGVsZXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlkRGVsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnRleHRibG9jay5yZW1vdmVkLmRpc3BhdGNoKHsgX2lkOiBldi5kYXRhLl9pZCB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRSZXRhaW5lZFN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2VcclxuICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB0aGlzLmdldEJsb2NrKGV2LmRhdGEuX2lkKTtcclxuICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnBvc2l0aW9uID0gZXYuZGF0YS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5vdXRsaW5lID0gZXYuZGF0YS5vdXRsaW5lO1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXJyYW5nZUNoYW5nZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFJldGFpbmVkU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFJlc291cmNlcygpIHtcclxuICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgRm9udEZhbWlsaWVzTG9hZGVyKCk7XHJcbiAgICAgICAgbG9hZGVyLmxvYWRMaXN0TG9jYWwoZmFtaWxpZXMgPT4ge1xyXG4gICAgICAgICAgICBmYW1pbGllcy5sZW5ndGggPSBTdG9yZS5GT05UX0xJU1RfTElNSVQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpY3QgPSB0aGlzLnJlc291cmNlcy5mb250RmFtaWxpZXM7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmFtaWx5R3JvdXAgb2YgZmFtaWxpZXMpIHtcclxuICAgICAgICAgICAgICAgIGRpY3RbZmFtaWx5R3JvdXAuZmFtaWx5XSA9IGZhbWlseUdyb3VwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBsb2FkIGZvbnRzIGludG8gYnJvd3NlciBmb3IgcHJldmlld1xyXG4gICAgICAgICAgICBsb2FkZXIubG9hZEZvclByZXZpZXcoZmFtaWxpZXMubWFwKGYgPT4gZi5mYW1pbHkpKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChTdG9yZS5ST0JPVE9fNTAwX0xPQ0FMKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmFwcC5yZXNvdXJjZXNSZWFkeS5kaXNwYXRjaCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VkUmV0YWluZWRTdGF0ZSgpIHtcclxuICAgICAgICB0aGlzLmV2ZW50cy5hcHAucmV0YWluZWRTdGF0ZUNoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5yZXRhaW5lZCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXNzaWduPFQ+KGRlc3Q6IFQsIHNvdXJjZTogVCkge1xyXG4gICAgICAgIF8ubWVyZ2UoZGVzdCwgc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTa2V0Y2goKTogU2tldGNoIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkZWZhdWx0Rm9udERlc2M6IHtcclxuICAgICAgICAgICAgICAgIGZhbWlseTogXCJSb2JvdG9cIixcclxuICAgICAgICAgICAgICAgIHZhcmlhbnQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogbnVsbCxcclxuICAgICAgICAgICAgICAgIHVybDogU3RvcmUuUk9CT1RPXzUwMF9MT0NBTFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0ZXh0QmxvY2tzOiA8VGV4dEJsb2NrW10+W11cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0U2VsZWN0aW9uKGl0ZW06IFdvcmtzcGFjZU9iamVjdFJlZikge1xyXG4gICAgICAgIC8vIGVhcmx5IGV4aXQgb24gbm8gY2hhbmdlXHJcbiAgICAgICAgaWYoaXRlbSl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuc3RhdGUuZGlzcG9zYWJsZS5zZWxlY3Rpb24gXHJcbiAgICAgICAgICAgICAgICAmJiB0aGlzLnN0YXRlLmRpc3Bvc2FibGUuc2VsZWN0aW9uLml0ZW1JZCA9PT0gaXRlbS5pdGVtSWQpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYoIXRoaXMuc3RhdGUuZGlzcG9zYWJsZS5zZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZS5kaXNwb3NhYmxlLnNlbGVjdGlvbiA9IGl0ZW07XHJcbiAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLnNlbGVjdGlvbkNoYW5nZWQuZGlzcGF0Y2goaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRFZGl0aW5nSXRlbShpdGVtOiBQb3NpdGlvbmVkT2JqZWN0UmVmKSB7XHJcbiAgICAgICAgLy8gZWFybHkgZXhpdCBvbiBubyBjaGFuZ2VcclxuICAgICAgICBpZihpdGVtKXtcclxuICAgICAgICAgICAgaWYodGhpcy5zdGF0ZS5kaXNwb3NhYmxlLmVkaXRpbmdJdGVtIFxyXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5zdGF0ZS5kaXNwb3NhYmxlLmVkaXRpbmdJdGVtLml0ZW1JZCA9PT0gaXRlbS5pdGVtSWQpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYoIXRoaXMuc3RhdGUuZGlzcG9zYWJsZS5lZGl0aW5nSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmRpc3Bvc2FibGUuZWRpdGluZ0l0ZW0pIHtcclxuICAgICAgICAgICAgLy8gc2lnbmFsIGNsb3NpbmcgZWRpdG9yIGZvciBpdGVtXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZih0aGlzLnN0YXRlLmRpc3Bvc2FibGUuZWRpdGluZ0l0ZW0uaXRlbVR5cGUgPT09IFwiVGV4dEJsb2NrXCIpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEVkaXRpbmdCbG9jayA9IHRoaXMuZ2V0QmxvY2sodGhpcy5zdGF0ZS5kaXNwb3NhYmxlLmVkaXRpbmdJdGVtLml0ZW1JZCk7XHJcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50RWRpdGluZ0Jsb2NrKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy50ZXh0YmxvY2suZWRpdG9yQ2xvc2VkLmRpc3BhdGNoKGN1cnJlbnRFZGl0aW5nQmxvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGl0ZW0pe1xyXG4gICAgICAgICAgICAvLyBlZGl0aW5nIGl0ZW0gc2hvdWxkIGJlIHNlbGVjdGVkIGl0ZW1cclxuICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24oaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RhdGUuZGlzcG9zYWJsZS5lZGl0aW5nSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5kaXNwYXRjaChpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEJsb2NrKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoLnRleHRCbG9ja3MsIHRiID0+IHRiLl9pZCA9PT0gaWQpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG50eXBlIEFjdGlvblR5cGVzID0gXHJcbiAgICBcInNrZXRjaC5jcmVhdGVcIlxyXG4gICAgfCBcInNrZXRjaC51cGRhdGVcIlxyXG4gICAgfCBcInRleHRibG9jay5hZGRcIlxyXG4gICAgfCBcInRleHRibG9jay51cGRhdGVcIjtcclxuXHJcbnR5cGUgRXZlbnRUeXBlcyA9XHJcbiAgICBcInNrZXRjaC5sb2FkZWRcIlxyXG4gICAgfCBcInNrZXRjaC5jaGFuZ2VkXCJcclxuICAgIHwgXCJ0ZXh0YmxvY2suYWRkZWRcIlxyXG4gICAgfCBcInRleHRibG9jay5jaGFuZ2VkXCI7XHJcbiIsIlxyXG5jb25zdCBTa2V0Y2hIZWxwZXJzID0ge1xyXG4gICAgXHJcbiAgICBjb2xvcnNJblVzZShza2V0Y2g6IFNrZXRjaCk6IHN0cmluZ1tdIHtcclxuICAgICAgICBsZXQgY29sb3JzID0gWyBza2V0Y2guYmFja2dyb3VuZENvbG9yIF07XHJcbiAgICAgICAgZm9yKGNvbnN0IGJsb2NrIG9mIHNrZXRjaC50ZXh0QmxvY2tzKXtcclxuICAgICAgICAgICAgY29sb3JzLnB1c2goYmxvY2suYmFja2dyb3VuZENvbG9yKTtcclxuICAgICAgICAgICAgY29sb3JzLnB1c2goYmxvY2sudGV4dENvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29sb3JzID0gXy51bmlxKGNvbG9ycy5maWx0ZXIoYyA9PiBjICE9IG51bGwpKTtcclxuICAgICAgICBjb2xvcnMuc29ydCgpO1xyXG4gICAgICAgIHJldHVybiBjb2xvcnM7XHJcbiAgICB9XHJcbiAgICBcclxufSIsIlxyXG5pbnRlcmZhY2UgUmV0YWluZWRTdGF0ZSB7XHJcbiAgICBza2V0Y2g6IFNrZXRjaDtcclxufVxyXG5cclxuaW50ZXJmYWNlIERpc3Bvc2FibGVTdGF0ZSB7XHJcbiAgICBlZGl0aW5nSXRlbT86IFBvc2l0aW9uZWRPYmplY3RSZWY7XHJcbiAgICBzZWxlY3Rpb24/OiBXb3Jrc3BhY2VPYmplY3RSZWY7XHJcbn1cclxuXHJcbmludGVyZmFjZSBTa2V0Y2gge1xyXG4gICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgZGVmYXVsdEZvbnREZXNjPzogRm9udERlc2NyaXB0aW9uO1xyXG4gICAgdGV4dEJsb2Nrcz86IFRleHRCbG9ja1tdO1xyXG4gICAgbG9hZGluZz86IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBGb250RmFtaWx5IHtcclxuICAgIGtpbmQ/OiBzdHJpbmc7XHJcbiAgICBmYW1pbHk/OiBzdHJpbmc7XHJcbiAgICBjYXRlZ29yeT86IHN0cmluZztcclxuICAgIHZhcmlhbnRzPzogc3RyaW5nW107XHJcbiAgICBzdWJzZXRzPzogc3RyaW5nW107XHJcbiAgICB2ZXJzaW9uPzogc3RyaW5nO1xyXG4gICAgbGFzdE1vZGlmaWVkPzogc3RyaW5nO1xyXG4gICAgZmlsZXM/OiB7IFt2YXJpYW50OiBzdHJpbmddIDogc3RyaW5nOyB9O1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRm9udERlc2NyaXB0aW9uIHtcclxuICAgIGZhbWlseTogc3RyaW5nO1xyXG4gICAgY2F0ZWdvcnk6IHN0cmluZztcclxuICAgIHZhcmlhbnQ6IHN0cmluZztcclxuICAgIHVybDogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgV29ya3NwYWNlT2JqZWN0UmVmIHtcclxuICAgIGl0ZW1JZDogc3RyaW5nO1xyXG4gICAgaXRlbVR5cGU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBQb3NpdGlvbmVkT2JqZWN0UmVmIGV4dGVuZHMgV29ya3NwYWNlT2JqZWN0UmVmIHtcclxuICAgIGNsaWVudFg/OiBudW1iZXI7XHJcbiAgICBjbGllbnRZPzogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVGV4dEJsb2NrIGV4dGVuZHMgQmxvY2tBcnJhbmdlbWVudCB7XHJcbiAgICBfaWQ/OiBzdHJpbmc7XHJcbiAgICB0ZXh0Pzogc3RyaW5nO1xyXG4gICAgdGV4dENvbG9yPzogc3RyaW5nO1xyXG4gICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgZm9udERlc2M/OiBGb250RGVzY3JpcHRpb247XHJcbiAgICBmb250U2l6ZT86IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgcG9zaXRpb24/OiBudW1iZXJbXSxcclxuICAgIG91dGxpbmU/OiB7XHJcbiAgICAgICAgdG9wOiBQYXRoUmVjb3JkLFxyXG4gICAgICAgIGJvdHRvbTogUGF0aFJlY29yZFxyXG4gICAgfSAgICBcclxufVxyXG5cclxuaW50ZXJmYWNlIEJhY2tncm91bmRBY3Rpb25TdGF0dXMge1xyXG4gICAgYWN0aW9uPzogT2JqZWN0O1xyXG4gICAgcmVqZWN0ZWQ/OiBib29sZWFuO1xyXG4gICAgZXJyb3I/OiBib29sZWFuXHJcbiAgICBtZXNzYWdlPzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUGF0aFJlY29yZCB7XHJcbiAgICBzZWdtZW50czogU2VnbWVudFJlY29yZFtdO1xyXG59XHJcblxyXG4vKipcclxuICogU2luZ2xlLXBvaW50IHNlZ21lbnRzIGFyZSBzdG9yZWQgYXMgbnVtYmVyWzJdXHJcbiAqL1xyXG50eXBlIFNlZ21lbnRSZWNvcmQgPSBBcnJheTxQb2ludFJlY29yZD4gfCBBcnJheTxudW1iZXI+O1xyXG5cclxudHlwZSBQb2ludFJlY29yZCA9IEFycmF5PG51bWJlcj47XHJcbiIsIm5hbWVzcGFjZSBDb2xvclBpY2tlciB7XHJcblxyXG4gICAgY29uc3QgREVGQVVMVF9QQUxFVFRFID0gW1xyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvODA3XHJcbiAgICAgICAgICAgIFwiI2VlNDAzNVwiLFxyXG4gICAgICAgICAgICBcIiNmMzc3MzZcIixcclxuICAgICAgICAgICAgXCIjZmRmNDk4XCIsXHJcbiAgICAgICAgICAgIFwiIzdiYzA0M1wiLFxyXG4gICAgICAgICAgICBcIiMwMzkyY2ZcIixcclxuICAgICAgICBdLFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvODk0XHJcbiAgICAgICAgICAgIFwiI2VkYzk1MVwiLFxyXG4gICAgICAgICAgICBcIiNlYjY4NDFcIixcclxuICAgICAgICAgICAgXCIjY2MyYTM2XCIsXHJcbiAgICAgICAgICAgIFwiIzRmMzcyZFwiLFxyXG4gICAgICAgICAgICBcIiMwMGEwYjBcIixcclxuICAgICAgICBdLFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvMTY0XHJcbiAgICAgICAgICAgIFwiIzFiODViOFwiLFxyXG4gICAgICAgICAgICBcIiM1YTUyNTVcIixcclxuICAgICAgICAgICAgXCIjNTU5ZTgzXCIsXHJcbiAgICAgICAgICAgIFwiI2FlNWE0MVwiLFxyXG4gICAgICAgICAgICBcIiNjM2NiNzFcIixcclxuICAgICAgICBdLFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvMzg5XHJcbiAgICAgICAgICAgIFwiIzRiMzgzMlwiLFxyXG4gICAgICAgICAgICBcIiM4NTQ0NDJcIixcclxuICAgICAgICAgICAgXCIjZmZmNGU2XCIsXHJcbiAgICAgICAgICAgIFwiIzNjMmYyZlwiLFxyXG4gICAgICAgICAgICBcIiNiZTliN2JcIixcclxuICAgICAgICBdLFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvNDU1XHJcbiAgICAgICAgICAgIFwiI2ZmNGU1MFwiLFxyXG4gICAgICAgICAgICBcIiNmYzkxM2FcIixcclxuICAgICAgICAgICAgXCIjZjlkNjJlXCIsXHJcbiAgICAgICAgICAgIFwiI2VhZTM3NFwiLFxyXG4gICAgICAgICAgICBcIiNlMmY0YzdcIixcclxuICAgICAgICBdLFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvNzAwXHJcbiAgICAgICAgICAgIFwiI2QxMTE0MVwiLFxyXG4gICAgICAgICAgICBcIiMwMGIxNTlcIixcclxuICAgICAgICAgICAgXCIjMDBhZWRiXCIsXHJcbiAgICAgICAgICAgIFwiI2YzNzczNVwiLFxyXG4gICAgICAgICAgICBcIiNmZmM0MjVcIixcclxuICAgICAgICBdLFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvODI2XHJcbiAgICAgICAgICAgIFwiI2U4ZDE3NFwiLFxyXG4gICAgICAgICAgICBcIiNlMzllNTRcIixcclxuICAgICAgICAgICAgXCIjZDY0ZDRkXCIsXHJcbiAgICAgICAgICAgIFwiIzRkNzM1OFwiLFxyXG4gICAgICAgICAgICBcIiM5ZWQ2NzBcIixcclxuICAgICAgICBdLFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvMTIyM1xyXG4gICAgICAgICAgICBcIiNmZmQ0ZTVcIixcclxuICAgICAgICAgICAgXCIjZDRmZmVhXCIsXHJcbiAgICAgICAgICAgIFwiI2VlY2JmZlwiLFxyXG4gICAgICAgICAgICBcIiNmZWZmYTNcIixcclxuICAgICAgICAgICAgXCIjZGJkY2ZmXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIFwiIzAwMFwiLCBcIiM2NjZcIiwgXCIjY2NjXCIsIFwiI2VlZVwiLCBcIiNmZmZcIlxyXG4gICAgICAgIF0sXHJcbiAgICBdO1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBzZXR1cChlbGVtLCB0b3BDb2xvcnM6IHN0cmluZ1tdLCBvbkNoYW5nZSkge1xyXG4gICAgICAgIGNvbnN0IHRvcENvbG9yc0dyb3VwZWQgPSBfLmNodW5rKHRvcENvbG9ycywgNSk7XHJcbiAgICAgICAgY29uc3QgcGFsZXR0ZSA9IHRvcENvbG9yc0dyb3VwZWQuY29uY2F0KERFRkFVTFRfUEFMRVRURSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNlbCA9IDxhbnk+JChlbGVtKTtcclxuICAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bSh7XHJcbiAgICAgICAgICAgIHNob3dJbnB1dDogdHJ1ZSxcclxuICAgICAgICAgICAgYWxsb3dFbXB0eTogdHJ1ZSxcclxuICAgICAgICAgICAgcHJlZmVycmVkRm9ybWF0OiBcImhleFwiLFxyXG4gICAgICAgICAgICBzaG93QnV0dG9uczogZmFsc2UsXHJcbiAgICAgICAgICAgIHNob3dBbHBoYTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd1BhbGV0dGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dTZWxlY3Rpb25QYWxldHRlOiBmYWxzZSxcclxuICAgICAgICAgICAgcGFsZXR0ZTogcGFsZXR0ZSxcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlS2V5OiBcInNrZXRjaHRleHRcIixcclxuICAgICAgICAgICAgY2hhbmdlOiBvbkNoYW5nZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gc2V0KGVsZW06IEhUTUxFbGVtZW50LCB2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oXCJzZXRcIiwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZXN0cm95KGVsZW0pIHtcclxuICAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bShcImRlc3Ryb3lcIik7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIERvY3VtZW50S2V5SGFuZGxlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlKSB7XHJcblxyXG4gICAgICAgIC8vIG5vdGU6IHVuZGlzcG9zZWQgZXZlbnQgc3Vic2NyaXB0aW9uXHJcbiAgICAgICAgJChkb2N1bWVudCkua2V5dXAoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IERvbUhlbHBlcnMuS2V5Q29kZXMuRXNjKSB7XHJcbiAgICAgICAgICAgICAgICBpZihzdG9yZS5zdGF0ZS5kaXNwb3NhYmxlLmVkaXRpbmdJdGVtKXtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRFZGl0aW5nSXRlbS5kaXNwYXRjaChudWxsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxufSIsIlxyXG5kZWNsYXJlIHZhciBSZWFjdFNlbGVjdDtcclxuXHJcbmludGVyZmFjZSBGb250UGlja2VyUHJvcHMge1xyXG4gICAgc3RvcmU6IFN0b3JlOyAgICBcclxuICAgIHNlbGVjdGlvbj86IEZvbnREZXNjcmlwdGlvbjtcclxuICAgIHNlbGVjdGlvbkNoYW5nZWQ6IChzZWxlY3Rpb246IEZvbnREZXNjcmlwdGlvbikgPT4gdm9pZDtcclxufVxyXG5cclxuaW50ZXJmYWNlIEZvbnRQaWNrZXJTdGF0ZSB7XHJcbiAgICBmYW1pbHlPYmplY3Q/OiBGb250RmFtaWx5O1xyXG4gICAgdmFyaWFudD86IHN0cmluZztcclxufVxyXG5cclxuY2xhc3MgRm9udFBpY2tlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxGb250UGlja2VyUHJvcHMsIEZvbnRQaWNrZXJTdGF0ZT4ge1xyXG4gICAgXHJcbiAgICBwcmV2aWV3Rm9udFNpemUgPSBcIjI4cHhcIjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IEZvbnRQaWNrZXJQcm9wcyl7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7fTtcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLnByb3BzLnNlbGVjdGlvbil7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZmFtaWx5T2JqZWN0ID0gdGhpcy5wcm9wcy5zdG9yZS5yZXNvdXJjZXMuZm9udEZhbWlsaWVzW3RoaXMucHJvcHMuc2VsZWN0aW9uLmZhbWlseV07XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudmFyaWFudCA9IHRoaXMucHJvcHMuc2VsZWN0aW9uLnZhcmlhbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgZmFtaWx5T3B0aW9uUmVuZGVyID0gKG9wdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmb250RmFtaWx5ID0gb3B0aW9uLnZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gcmgoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzLnByZXZpZXdGb250U2l6ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBbZm9udEZhbWlseV0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgdmFyaWFudE9wdGlvblJlbmRlciA9IChvcHRpb24pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZm9udFZhcmlhbnQgPSBvcHRpb24udmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlID0gPGFueT5Gb250SGVscGVycy5nZXRDc3NTdHlsZSh0aGlzLnN0YXRlLmZhbWlseU9iamVjdC5mYW1pbHksIGZvbnRWYXJpYW50KTtcclxuICAgICAgICAgICAgc3R5bGUuZm9udFNpemUgPSB0aGlzLnByZXZpZXdGb250U2l6ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHJoKFwiZGl2XCIsIHsgc3R5bGUgfSwgXHJcbiAgICAgICAgICAgICAgIFtgJHt0aGlzLnN0YXRlLmZhbWlseU9iamVjdC5mYW1pbHl9ICR7b3B0aW9uLnZhbHVlfWBdKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiByaChcImRpdlwiLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImZvbnQtcGlja2VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgcmgoUmVhY3RTZWxlY3QsIHsgXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImZvbnQtZmFtaWx5XCIsIFxyXG4gICAgICAgICAgICAgICAga2V5OiBcImZvbnQtZmFtaWx5XCIsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZm9udC1mYW1pbHlcIiwgXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5zdGF0ZS5mYW1pbHlPYmplY3QgJiYgdGhpcy5zdGF0ZS5mYW1pbHlPYmplY3QuZmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgY2xlYXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMuZ2V0RmFtaWx5T3B0aW9ucygpLCBcclxuICAgICAgICAgICAgICAgIG9wdGlvblJlbmRlcmVyOiBmYW1pbHlPcHRpb25SZW5kZXIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZVJlbmRlcmVyOiBmYW1pbHlPcHRpb25SZW5kZXIsXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZTogKGYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmYW1pbHlPYmplY3QgPSB0aGlzLnByb3BzLnN0b3JlLnJlc291cmNlcy5mb250RmFtaWxpZXNbZl07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFyaWFudCA9IF8ubGFzdChmYW1pbHlPYmplY3QudmFyaWFudHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih2ID0+IHYuaW5kZXhPZihcIml0YWxpY1wiKSA8IDApKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYW1pbHlPYmplY3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnRcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHRoaXMuc2VuZFNlbGVjdGlvbkNoYW5nZWQoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAvLyBvbmx5IHNob3cgZm9yIG11bHRpcGxlIHZhcmlhbnRzXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZmFtaWx5T2JqZWN0ICYmIHRoaXMuc3RhdGUuZmFtaWx5T2JqZWN0LnZhcmlhbnRzLmxlbmd0aCA+IDEgJiZcclxuICAgICAgICAgICAgcmgoUmVhY3RTZWxlY3QsIHsgXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImZvbnQtdmFyaWFudFwiLCBcclxuICAgICAgICAgICAgICAgIGtleTogXCJmb250LXZhcmlhbnRcIixcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJmb250LXZhcmlhbnRcIiwgXHJcbiAgICAgICAgICAgICAgICBjbGVhcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuc3RhdGUudmFyaWFudCxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMuc3RhdGUuZmFtaWx5T2JqZWN0ICYmIHRoaXMuc3RhdGUuZmFtaWx5T2JqZWN0LnZhcmlhbnRzLm1hcCh2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogdiwgbGFiZWw6IHYgfTtcclxuICAgICAgICAgICAgICAgIH0pLCBcclxuICAgICAgICAgICAgICAgIG9wdGlvblJlbmRlcmVyOiB2YXJpYW50T3B0aW9uUmVuZGVyLFxyXG4gICAgICAgICAgICAgICAgdmFsdWVSZW5kZXJlcjogdmFyaWFudE9wdGlvblJlbmRlcixcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbWlseU9iamVjdDogdGhpcy5zdGF0ZS5mYW1pbHlPYmplY3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ6IHZhbHVlIFxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB0aGlzLnNlbmRTZWxlY3Rpb25DaGFuZ2VkKCkgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZW5kU2VsZWN0aW9uQ2hhbmdlZCgpe1xyXG4gICAgICAgIHRoaXMucHJvcHMuc2VsZWN0aW9uQ2hhbmdlZChcclxuICAgICAgICAgICAgRm9udEhlbHBlcnMuZ2V0RGVzY3JpcHRpb24odGhpcy5zdGF0ZS5mYW1pbHlPYmplY3QsIHRoaXMuc3RhdGUudmFyaWFudCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGdldEZhbWlseU9wdGlvbnMoKTogeyB2YWx1ZTogRm9udEZhbWlseSwgbGFiZWw6IHN0cmluZ31bXSB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IF8udmFsdWVzKHRoaXMucHJvcHMuc3RvcmUucmVzb3VyY2VzLmZvbnRGYW1pbGllcylcclxuICAgICAgICAgICAgLm1hcCgoZm9udEZhbWlseTogRm9udEZhbWlseSkgPT4gXHJcbiAgICAgICAgICAgICAgICB7IHJldHVybiB7IHZhbHVlOiBmb250RmFtaWx5LmZhbWlseSwgbGFiZWw6IGZvbnRGYW1pbHkuZmFtaWx5IH07IH0pO1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBTZWxlY3RlZEl0ZW1FZGl0b3Ige1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xyXG5cclxuICAgICAgICBjb25zdCBkb20kID0gc3RvcmUuZXZlbnRzLm1lcmdlVHlwZWQ8YW55PiggXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZCxcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkXHJcbiAgICAgICAgICAgICkubWFwKGkgPT4ge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcG9zSXRlbSA9IDxQb3NpdGlvbmVkT2JqZWN0UmVmPmkuZGF0YTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gcG9zSXRlbVxyXG4gICAgICAgICAgICAgICAgJiYgcG9zSXRlbS5pdGVtVHlwZSA9PT0gJ1RleHRCbG9jaydcclxuICAgICAgICAgICAgICAgICYmIF8uZmluZChzdG9yZS5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gudGV4dEJsb2NrcywgXHJcbiAgICAgICAgICAgICAgICAgICAgYiA9PiBiLl9pZCA9PT0gcG9zSXRlbS5pdGVtSWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFibG9jaykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoKCdkaXYjZWRpdG9yT3ZlcmxheScsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogcG9zSXRlbS5jbGllbnRYICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHBvc0l0ZW0uY2xpZW50WSArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDFcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBUZXh0QmxvY2tFZGl0b3Ioc3RvcmUpLnJlbmRlcihibG9jaylcclxuICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKGRvbSQsIGNvbnRhaW5lcik7XHJcblxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBTa2V0Y2hFZGl0b3IgZXh0ZW5kcyBDb21wb25lbnQ8U2tldGNoPiB7XHJcblxyXG4gICAgc3RvcmU6IFN0b3JlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2tldGNoRG9tJCA9IHN0b3JlLmV2ZW50cy5tZXJnZShcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5sb2FkZWQsXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQpXHJcbiAgICAgICAgICAgIC5tYXAobSA9PiB0aGlzLnJlbmRlcihzdG9yZS5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gpKTtcclxuICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oc2tldGNoRG9tJCwgY29udGFpbmVyKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHNrZXRjaDogU2tldGNoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4gaChcImRpdlwiLCBbXHJcbiAgICAgICAgICAgIGgoXCJsYWJlbFwiLCBcIkFkZCB0ZXh0OiBcIiksXHJcbiAgICAgICAgICAgIGgoXCJpbnB1dC5hZGQtdGV4dFwiLCB7XHJcbiAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleXByZXNzOiAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChldi53aGljaCB8fCBldi5rZXlDb2RlKSA9PT0gRG9tSGVscGVycy5LZXlDb2Rlcy5FbnRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGV2LnRhcmdldCAmJiBldi50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLmFkZC5kaXNwYXRjaCh7IHRleHQ6IHRleHQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYudGFyZ2V0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIlByZXNzIFtFbnRlcl0gdG8gYWRkXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgIGgoXCJsYWJlbFwiLCBcIkJhY2tncm91bmQ6IFwiKSxcclxuICAgICAgICAgICAgaChcImlucHV0LmJhY2tncm91bmQtY29sb3JcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHNrZXRjaC5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2tldGNoSGVscGVycy5jb2xvcnNJblVzZSh0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmF0dHJVcGRhdGUuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGJhY2tncm91bmRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU6IChvbGRWbm9kZSwgdm5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldCh2bm9kZS5lbG0sIHNrZXRjaC5iYWNrZ3JvdW5kQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pLFxyXG5cclxuICAgICAgICAgICAgQm9vdFNjcmlwdC5kcm9wZG93bih7XHJcbiAgICAgICAgICAgICAgICBpZDogXCJza2V0Y2hNZW51XCIsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIkFjdGlvbnNcIixcclxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIk5ld1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkNyZWF0ZSBuZXcgc2tldGNoXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmNyZWF0ZS5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJab29tIHRvIGZpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkZpdCBjb250ZW50cyBpbiB2aWV3XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZGVzaWduZXIuem9vbVRvRml0LmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkV4cG9ydCBpbWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkV4cG9ydCBGaWRkbGUgYXMgUE5HXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmRlc2lnbmVyLmV4cG9ydFBORy5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJFeHBvcnQgU1ZHXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRXhwb3J0IEZpZGRsZSBhcyB2ZWN0b3IgZ3JhcGhpY3NcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5kZXNpZ25lci5leHBvcnRTVkcuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgXVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwiY2xhc3MgVGV4dEJsb2NrRWRpdG9yIGV4dGVuZHMgQ29tcG9uZW50PFRleHRCbG9jaz4ge1xyXG4gICAgc3RvcmU6IFN0b3JlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcih0ZXh0QmxvY2s6IFRleHRCbG9jayk6IFZOb2RlIHtcclxuICAgICAgICBsZXQgdXBkYXRlID0gdGIgPT4ge1xyXG4gICAgICAgICAgICB0Yi5faWQgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUF0dHIuZGlzcGF0Y2godGIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXYudGV4dC1ibG9jay1lZGl0b3JcIixcclxuICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIGgoXCJ0ZXh0YXJlYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2sudGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5cHJlc3M6IChldjpLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChldi53aGljaCB8fCBldi5rZXlDb2RlKSA9PT0gRG9tSGVscGVycy5LZXlDb2Rlcy5FbnRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoeyB0ZXh0OiAoPEhUTUxUZXh0QXJlYUVsZW1lbnQ+ZXYudGFyZ2V0KS52YWx1ZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRFZGl0aW5nSXRlbS5kaXNwYXRjaChudWxsKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoeyB0ZXh0OiBldi50YXJnZXQudmFsdWUgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG5cclxuICAgICAgICAgICAgICAgIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICB7fSxcclxuICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1jb2xvci1pY29uLmZvcmVcIiwge30sIFwiQVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcImlucHV0LnRleHQtY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiVGV4dCBjb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLnRleHRDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZub2RlLmVsbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTa2V0Y2hIZWxwZXJzLmNvbG9yc0luVXNlKHRoaXMuc3RvcmUuc3RhdGUucmV0YWluZWQuc2tldGNoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB1cGRhdGUoeyB0ZXh0Q29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICh2bm9kZSkgPT4gQ29sb3JQaWNrZXIuZGVzdHJveSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBdKSxcclxuXHJcbiAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5iYWNrXCIsIHt9LCBcIkFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC5iYWNrZ3JvdW5kLWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkJhY2tncm91bmQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2tldGNoSGVscGVycy5jb2xvcnNJblVzZSh0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgYmFja2dyb3VuZENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImJ1dHRvbi5kZWxldGUtdGV4dGJsb2NrLmJ0bi5idG4tZGFuZ2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRGVsZXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBlID0+IHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sucmVtb3ZlLmRpc3BhdGNoKHRleHRCbG9jaylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwic3Bhbi5nbHlwaGljb24uZ2x5cGhpY29uLXRyYXNoXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgKSxcclxuXHJcbiAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtcGlja2VyLWNvbnRhaW5lclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9wczogRm9udFBpY2tlclByb3BzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZTogdGhpcy5zdG9yZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uOiB0ZXh0QmxvY2suZm9udERlc2MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkNoYW5nZWQ6IChmb250RGVzYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKHsgZm9udERlc2MgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0RE9NLnJlbmRlcihyaChGb250UGlja2VyLCBwcm9wcyksIHZub2RlLmVsbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKSxcclxuXHJcbiAgICAgICAgICAgICAgICBoKFwiZGl2LmVuZC1jb250cm9sc1wiLCB7fSxcclxuICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgXSk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmNsYXNzIFdvcmtzcGFjZUNvbnRyb2xsZXIge1xyXG5cclxuICAgIHN0YXRpYyBURVhUX0NIQU5HRV9SRU5ERVJfVEhST1RUTEVfTVMgPSA1MDA7XHJcbiAgICBzdGF0aWMgQkxPQ0tfQk9VTkRTX0NIQU5HRV9USFJPVFRMRV9NUyA9IDUwMDtcclxuXHJcbiAgICBkZWZhdWx0U2l6ZSA9IG5ldyBwYXBlci5TaXplKDUwMDAwLCA0MDAwMCk7XHJcbiAgICBkZWZhdWx0U2NhbGUgPSAwLjAyO1xyXG5cclxuICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgZmFsbGJhY2tGb250OiBvcGVudHlwZS5Gb250O1xyXG4gICAgdmlld1pvb206IFZpZXdab29tO1xyXG5cclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG4gICAgcHJpdmF0ZSBfc2tldGNoOiBTa2V0Y2g7XHJcbiAgICBwcml2YXRlIF90ZXh0QmxvY2tJdGVtczogeyBbdGV4dEJsb2NrSWQ6IHN0cmluZ106IFRleHRXYXJwIH0gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdG9yZTogU3RvcmUsIGZhbGxiYWNrRm9udDogb3BlbnR5cGUuRm9udCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICB0aGlzLmZhbGxiYWNrRm9udCA9IGZhbGxiYWNrRm9udDtcclxuICAgICAgICBwYXBlci5zZXR0aW5ncy5oYW5kbGVTaXplID0gMTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5DYW52YXMnKTtcclxuICAgICAgICBwYXBlci5zZXR1cCh0aGlzLmNhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcGFwZXIucHJvamVjdDtcclxuXHJcbiAgICAgICAgdGhpcy52aWV3Wm9vbSA9IG5ldyBWaWV3Wm9vbSh0aGlzLnByb2plY3QpO1xyXG4gICAgICAgIHRoaXMudmlld1pvb20udmlld0NoYW5nZWQuc3Vic2NyaWJlKGJvdW5kcyA9PiB7XHJcbiAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5kZXNpZ25lci52aWV3Q2hhbmdlZC5kaXNwYXRjaChib3VuZHMpOyBcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjbGVhclNlbGVjdGlvbiA9IChldjogcGFwZXIuUGFwZXJNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHN0b3JlLnN0YXRlLmRpc3Bvc2FibGUuZWRpdGluZ0l0ZW0pe1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0RWRpdGluZ0l0ZW0uZGlzcGF0Y2gobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihzdG9yZS5zdGF0ZS5kaXNwb3NhYmxlLnNlbGVjdGlvbil7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2gobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcGFwZXIudmlldy5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGNsZWFyU2VsZWN0aW9uKTtcclxuICAgICAgICBwYXBlci52aWV3Lm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnU3RhcnQsIGNsZWFyU2VsZWN0aW9uKTtcclxuICAgICAgICAvLyBwYXBlci52aWV3Lm9uKFwia2V5dXBcIiwgKGV2OiBwYXBlci5LZXlFdmVudCkgPT4ge1xyXG4gICAgICAgIC8vIH0pOyBcclxuXHJcbiAgICAgICAgY29uc3Qga2V5SGFuZGxlciA9IG5ldyBEb2N1bWVudEtleUhhbmRsZXIoc3RvcmUpO1xyXG5cclxuICAgICAgICAvLyAtLS0tLSBEZXNpZ25lciAtLS0tLVxyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMuZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuem9vbVRvRml0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHN0b3JlLmV2ZW50cy5kZXNpZ25lci5leHBvcnRQTkdSZXF1ZXN0ZWQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kb3dubG9hZFBORygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMuZGVzaWduZXIuZXhwb3J0U1ZHUmVxdWVzdGVkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZG93bmxvYWRTVkcoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gU2tldGNoIC0tLS0tXHJcblxyXG4gICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2tldGNoID0gZXYuZGF0YTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtcyA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgIGlmKG0uZGF0YSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSBtLmRhdGEuaXRlbUlkICYmIHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5pdGVtSWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrICYmICFibG9jay5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAtLS0tLSBUZXh0QmxvY2sgLS0tLS1cclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLm1lcmdlVHlwZWQoXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYWRkZWQsXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2subG9hZGVkXHJcbiAgICAgICAgKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGV2ID0+IHRoaXMuYWRkQmxvY2soZXYuZGF0YSkpO1xyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmF0dHJDaGFuZ2VkXHJcbiAgICAgICAgICAgIC5vYnNlcnZlKClcclxuICAgICAgICAgICAgLnRocm90dGxlKFdvcmtzcGFjZUNvbnRyb2xsZXIuVEVYVF9DSEFOR0VfUkVOREVSX1RIUk9UVExFX01TKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dEJsb2NrID0gbS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udGV4dCA9IHRleHRCbG9jay50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0QmxvY2suZm9udERlc2MgJiYgdGV4dEJsb2NrLmZvbnREZXNjLnVybCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwdXNoIGluIGZvbnQgd2hlbiByZWFkeVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KHRleHRCbG9jay5mb250RGVzYy51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodXJsLCBmb250KSA9PiBpdGVtLmZvbnQgPSBmb250KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jdXN0b21TdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IHRleHRCbG9jay5mb250U2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLnJlbW92ZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmVkaXRvckNsb3NlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHpvb21Ub0ZpdCgpIHtcclxuICAgICAgICBsZXQgYm91bmRzOiBwYXBlci5SZWN0YW5nbGU7XHJcbiAgICAgICAgXy5mb3JPd24odGhpcy5fdGV4dEJsb2NrSXRlbXMsIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGJvdW5kcyA9IGJvdW5kc1xyXG4gICAgICAgICAgICAgICAgPyBib3VuZHMudW5pdGUoaXRlbS5ib3VuZHMpXHJcbiAgICAgICAgICAgICAgICA6IGl0ZW0uYm91bmRzO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoIWJvdW5kcykge1xyXG4gICAgICAgICAgICBib3VuZHMgPSBuZXcgcGFwZXIuUmVjdGFuZ2xlKG5ldyBwYXBlci5Qb2ludCgwLCAwKSxcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFNpemUubXVsdGlwbHkodGhpcy5kZWZhdWx0U2NhbGUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmlld1pvb20uem9vbVRvKGJvdW5kcy5zY2FsZSgxLjIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRvd25sb2FkUE5HKCkge1xyXG4gICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSB0aGlzLmluc2VydEJhY2tncm91bmQoKTtcclxuICAgICAgICBjb25zdCByYXN0ZXIgPSBhcHAud29ya3NwYWNlQ29udHJvbGxlci5wcm9qZWN0LmFjdGl2ZUxheWVyLnJhc3Rlcml6ZSgzMDAsIGZhbHNlKTtcclxuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IHRoaXMuZ2V0U2tldGNoRmlsZU5hbWUoNDAsIFwicG5nXCIpO1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSByYXN0ZXIudG9EYXRhVVJMKCk7XHJcbiAgICAgICBcclxuICAgICAgICBEb21IZWxwZXJzLmRvd25sb2FkRmlsZShkYXRhLCBmaWxlTmFtZSk7XHJcbiAgICAgICAgYmFja2dyb3VuZC5yZW1vdmUoKTtcclxuICAgICAgICBcclxuICAgICAgICBTM0FjY2Vzcy51cGxvYWQoZmlsZU5hbWUsIFwiaW1hZ2UvcG5nXCIsIERvbUhlbHBlcnMuZGF0YVVSTFRvQmxvYihkYXRhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkb3dubG9hZFNWRygpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZDogcGFwZXIuSXRlbTtcclxuICAgICAgICBpZih0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5iYWNrZ3JvdW5kQ29sb3Ipe1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kID0gdGhpcy5pbnNlcnRCYWNrZ3JvdW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB1cmwgPSBcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LFwiICsgZW5jb2RlVVJJQ29tcG9uZW50KFxyXG4gICAgICAgICAgICA8c3RyaW5nPnRoaXMucHJvamVjdC5leHBvcnRTVkcoeyBhc1N0cmluZzogdHJ1ZSB9KSk7XHJcbiAgICAgICAgRG9tSGVscGVycy5kb3dubG9hZEZpbGUodXJsLCB0aGlzLmdldFNrZXRjaEZpbGVOYW1lKDQwLCBcInN2Z1wiKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoYmFja2dyb3VuZCl7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U2tldGNoRmlsZU5hbWUobGVuZ3RoOiBudW1iZXIsIGV4dGVuc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgb3V0ZXI6XHJcbiAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiB0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBibG9jay50ZXh0LnNwbGl0KC9cXHMvKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHJpbSA9IHdvcmQucmVwbGFjZSgvXFxXL2csICcnKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJpbS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGgpIG5hbWUgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZSArPSB0cmltO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUubGVuZ3RoID49IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghbmFtZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbmFtZSA9IFwiZmlkZGxlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuYW1lICsgXCIuXCIgKyBleHRlbnNpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgc2tldGNoIGJhY2tncm91bmQgdG8gcHJvdmlkZSBiYWNrZ3JvdW5kIGZpbGwgKGlmIG5lY2Vzc2FyeSlcclxuICAgICAqICAgYW5kIGFkZCBtYXJnaW4gYXJvdW5kIGVkZ2VzLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluc2VydEJhY2tncm91bmQoKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgY29uc3QgYm91bmRzID0gYXBwLndvcmtzcGFjZUNvbnRyb2xsZXIucHJvamVjdC5hY3RpdmVMYXllci5ib3VuZHM7XHJcbiAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHBhcGVyLlNoYXBlLlJlY3RhbmdsZShcclxuICAgICAgICAgICAgYm91bmRzLnRvcExlZnQuc3VidHJhY3QoMjApLFxyXG4gICAgICAgICAgICBib3VuZHMuYm90dG9tUmlnaHQuYWRkKDIwKSk7XHJcbiAgICAgICAgYmFja2dyb3VuZC5maWxsQ29sb3IgPSB0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgYmFja2dyb3VuZC5zZW5kVG9CYWNrKCk7XHJcbiAgICAgICAgcmV0dXJuIGJhY2tncm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRCbG9jayh0ZXh0QmxvY2s6IFRleHRCbG9jaykge1xyXG4gICAgICAgIGlmICghdGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGV4dEJsb2NrLl9pZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdyZWNlaXZlZCBibG9jayB3aXRob3V0IGlkJywgdGV4dEJsb2NrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbdGV4dEJsb2NrLl9pZF07XHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlJlY2VpdmVkIGFkZEJsb2NrIGZvciBibG9jayB0aGF0IGlzIGFscmVhZHkgbG9hZGVkXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYm91bmRzOiB7IHVwcGVyOiBwYXBlci5TZWdtZW50W10sIGxvd2VyOiBwYXBlci5TZWdtZW50W10gfTtcclxuXHJcbiAgICAgICAgaWYgKHRleHRCbG9jay5vdXRsaW5lKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvYWRTZWdtZW50ID0gKHJlY29yZDogU2VnbWVudFJlY29yZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9pbnQgPSByZWNvcmRbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuU2VnbWVudChcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KHJlY29yZFswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZFsxXSAmJiBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkWzJdICYmIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMl0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KG5ldyBwYXBlci5Qb2ludChyZWNvcmQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgYm91bmRzID0ge1xyXG4gICAgICAgICAgICAgICAgdXBwZXI6IHRleHRCbG9jay5vdXRsaW5lLnRvcC5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpLFxyXG4gICAgICAgICAgICAgICAgbG93ZXI6IHRleHRCbG9jay5vdXRsaW5lLmJvdHRvbS5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtID0gbmV3IFRleHRXYXJwKFxyXG4gICAgICAgICAgICB0aGlzLmZhbGxiYWNrRm9udCxcclxuICAgICAgICAgICAgdGV4dEJsb2NrLnRleHQsXHJcbiAgICAgICAgICAgIGJvdW5kcyxcclxuICAgICAgICAgICAgdGV4dEJsb2NrLmZvbnRTaXplLCB7XHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogdGV4dEJsb2NrLmZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yIHx8IFwicmVkXCIsICAgIC8vIHRleHRDb2xvciBzaG91bGQgaGF2ZSBiZWVuIHNldCBlbHNld2hlcmUgXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0QmxvY2suZm9udERlc2MgJiYgdGV4dEJsb2NrLmZvbnREZXNjLnVybCkge1xyXG4gICAgICAgICAgICAvLyBwdXNoIGluIGZvbnQgd2hlbiByZWFkeVxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnJlc291cmNlcy5wYXJzZWRGb250cy5nZXQodGV4dEJsb2NrLmZvbnREZXNjLnVybCxcclxuICAgICAgICAgICAgICAgICh1cmwsIGZvbnQpID0+IGl0ZW0uZm9udCA9IGZvbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0ZXh0QmxvY2sub3V0bGluZSAmJiB0ZXh0QmxvY2sucG9zaXRpb24pIHtcclxuICAgICAgICAgICAgaXRlbS5wb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludCh0ZXh0QmxvY2sucG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2VuZEVkaXRBY3Rpb24gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVkaXRvckF0ID0gdGhpcy5wcm9qZWN0LnZpZXcucHJvamVjdFRvVmlldyhcclxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5taWRwb2ludChpdGVtLmJvdW5kcy50b3BMZWZ0LCBpdGVtLmJvdW5kcy5jZW50ZXIpKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRFZGl0aW5nSXRlbS5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtSWQ6IHRleHRCbG9jay5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50WDogZWRpdG9yQXQueCxcclxuICAgICAgICAgICAgICAgICAgICBjbGllbnRZOiBlZGl0b3JBdC55XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpdGVtLm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuY2xpY2tXaXRob3V0RHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgc2VuZEVkaXRBY3Rpb24oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHNlbGVjdCBpdGVtXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICB7IGl0ZW1JZDogdGV4dEJsb2NrLl9pZCwgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXRlbS5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLnNtYXJ0RHJhZ1N0YXJ0LCBldiA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgIGlmICghaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IHRleHRCbG9jay5faWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ZW0ub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdFbmQsIGV2ID0+IHtcclxuICAgICAgICAgICAgbGV0IGJsb2NrID0gPFRleHRCbG9jaz50aGlzLmdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbSk7XHJcbiAgICAgICAgICAgIGJsb2NrLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGl0ZW1DaGFuZ2UkID0gUGFwZXJOb3RpZnkub2JzZXJ2ZShpdGVtLCBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkdFT01FVFJZKTtcclxuICAgICAgICBpdGVtQ2hhbmdlJFxyXG4gICAgICAgICAgICAuZGVib3VuY2UoV29ya3NwYWNlQ29udHJvbGxlci5CTE9DS19CT1VORFNfQ0hBTkdFX1RIUk9UVExFX01TKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+dGhpcy5nZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgYmxvY2suX2lkID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdGVtLmRhdGEgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgIGlmICghdGV4dEJsb2NrLnBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSB0aGlzLnByb2plY3Qudmlldy5ib3VuZHMucG9pbnQuYWRkKFxyXG4gICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGl0ZW0uYm91bmRzLndpZHRoIC8gMiwgaXRlbS5ib3VuZHMuaGVpZ2h0IC8gMilcclxuICAgICAgICAgICAgICAgICAgICAuYWRkKDUwKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3RleHRCbG9ja0l0ZW1zW3RleHRCbG9jay5faWRdID0gaXRlbTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5sb2FkaW5nXHJcbiAgICAgICAgICAgICYmIHRoaXMuc3RvcmUuc3RhdGUucmV0YWluZWQuc2tldGNoLnRleHRCbG9ja3MubGVuZ3RoIDw9IDEpIHtcclxuICAgICAgICAgICAgLy8gb3BlbiBlZGl0b3IgZm9yIG5ld2x5IGFkZGVkIGJsb2NrXHJcbiAgICAgICAgICAgIHNlbmRFZGl0QWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtOiBUZXh0V2FycCk6IEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgICAgIC8vIGV4cG9ydCByZXR1cm5zIGFuIGFycmF5IHdpdGggaXRlbSB0eXBlIGFuZCBzZXJpYWxpemVkIG9iamVjdDpcclxuICAgICAgICAvLyAgIFtcIlBhdGhcIiwgUGF0aFJlY29yZF1cclxuICAgICAgICBjb25zdCB0b3AgPSA8UGF0aFJlY29yZD5pdGVtLnVwcGVyLmV4cG9ydEpTT04oeyBhc1N0cmluZzogZmFsc2UgfSlbMV07XHJcbiAgICAgICAgY29uc3QgYm90dG9tID0gPFBhdGhSZWNvcmQ+aXRlbS5sb3dlci5leHBvcnRKU09OKHsgYXNTdHJpbmc6IGZhbHNlIH0pWzFdO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogW2l0ZW0ucG9zaXRpb24ueCwgaXRlbS5wb3NpdGlvbi55XSxcclxuICAgICAgICAgICAgb3V0bGluZTogeyB0b3AsIGJvdHRvbSB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbmRlY2xhcmUgdmFyIHNvbHZlOiAoYTogYW55LCBiOiBhbnksIGZhc3Q6IGJvb2xlYW4pID0+IHZvaWQ7XHJcblxyXG5jbGFzcyBQZXJzcGVjdGl2ZVRyYW5zZm9ybSB7XHJcbiAgICBcclxuICAgIHNvdXJjZTogUXVhZDtcclxuICAgIGRlc3Q6IFF1YWQ7XHJcbiAgICBwZXJzcDogYW55O1xyXG4gICAgbWF0cml4OiBudW1iZXJbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc291cmNlOiBRdWFkLCBkZXN0OiBRdWFkKXtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLmRlc3QgPSBkZXN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0uY3JlYXRlTWF0cml4KHNvdXJjZSwgZGVzdCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEdpdmVuIGEgNHg0IHBlcnNwZWN0aXZlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCwgYW5kIGEgMkQgcG9pbnQgKGEgMngxIHZlY3RvciksXHJcbiAgICAvLyBhcHBsaWVzIHRoZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggYnkgY29udmVydGluZyB0aGUgcG9pbnQgdG8gaG9tb2dlbmVvdXNcclxuICAgIC8vIGNvb3JkaW5hdGVzIGF0IHo9MCwgcG9zdC1tdWx0aXBseWluZywgYW5kIHRoZW4gYXBwbHlpbmcgYSBwZXJzcGVjdGl2ZSBkaXZpZGUuXHJcbiAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgbGV0IHAzID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0ubXVsdGlwbHkodGhpcy5tYXRyaXgsIFtwb2ludC54LCBwb2ludC55LCAwLCAxXSk7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBwYXBlci5Qb2ludChwM1swXSAvIHAzWzNdLCBwM1sxXSAvIHAzWzNdKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgY3JlYXRlTWF0cml4KHNvdXJjZTogUXVhZCwgdGFyZ2V0OiBRdWFkKTogbnVtYmVyW10ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzb3VyY2VQb2ludHMgPSBbXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYS54LCBzb3VyY2UuYS55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYi54LCBzb3VyY2UuYi55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYy54LCBzb3VyY2UuYy55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuZC54LCBzb3VyY2UuZC55XV07XHJcbiAgICAgICAgbGV0IHRhcmdldFBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3RhcmdldC5hLngsIHRhcmdldC5hLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5iLngsIHRhcmdldC5iLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5jLngsIHRhcmdldC5jLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5kLngsIHRhcmdldC5kLnldXTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBhID0gW10sIGIgPSBbXSwgaSA9IDAsIG4gPSBzb3VyY2VQb2ludHMubGVuZ3RoOyBpIDwgbjsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBzID0gc291cmNlUG9pbnRzW2ldLCB0ID0gdGFyZ2V0UG9pbnRzW2ldO1xyXG4gICAgICAgICAgICBhLnB1c2goW3NbMF0sIHNbMV0sIDEsIDAsIDAsIDAsIC1zWzBdICogdFswXSwgLXNbMV0gKiB0WzBdXSksIGIucHVzaCh0WzBdKTtcclxuICAgICAgICAgICAgYS5wdXNoKFswLCAwLCAwLCBzWzBdLCBzWzFdLCAxLCAtc1swXSAqIHRbMV0sIC1zWzFdICogdFsxXV0pLCBiLnB1c2godFsxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgWCA9IHNvbHZlKGEsIGIsIHRydWUpOyBcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBYWzBdLCBYWzNdLCAwLCBYWzZdLFxyXG4gICAgICAgICAgICBYWzFdLCBYWzRdLCAwLCBYWzddLFxyXG4gICAgICAgICAgICAgICAwLCAgICAwLCAxLCAgICAwLFxyXG4gICAgICAgICAgICBYWzJdLCBYWzVdLCAwLCAgICAxXHJcbiAgICAgICAgXS5tYXAoZnVuY3Rpb24oeCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh4ICogMTAwMDAwKSAvIDEwMDAwMDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQb3N0LW11bHRpcGx5IGEgNHg0IG1hdHJpeCBpbiBjb2x1bW4tbWFqb3Igb3JkZXIgYnkgYSA0eDEgY29sdW1uIHZlY3RvcjpcclxuICAgIC8vIFsgbTAgbTQgbTggIG0xMiBdICAgWyB2MCBdICAgWyB4IF1cclxuICAgIC8vIFsgbTEgbTUgbTkgIG0xMyBdICogWyB2MSBdID0gWyB5IF1cclxuICAgIC8vIFsgbTIgbTYgbTEwIG0xNCBdICAgWyB2MiBdICAgWyB6IF1cclxuICAgIC8vIFsgbTMgbTcgbTExIG0xNSBdICAgWyB2MyBdICAgWyB3IF1cclxuICAgIHN0YXRpYyBtdWx0aXBseShtYXRyaXgsIHZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIG1hdHJpeFswXSAqIHZlY3RvclswXSArIG1hdHJpeFs0XSAqIHZlY3RvclsxXSArIG1hdHJpeFs4IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTJdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMV0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNV0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbOSBdICogdmVjdG9yWzJdICsgbWF0cml4WzEzXSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzJdICogdmVjdG9yWzBdICsgbWF0cml4WzZdICogdmVjdG9yWzFdICsgbWF0cml4WzEwXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNF0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFszXSAqIHZlY3RvclswXSArIG1hdHJpeFs3XSAqIHZlY3RvclsxXSArIG1hdHJpeFsxMV0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTVdICogdmVjdG9yWzNdXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUXVhZCB7XHJcbiAgICBhOiBwYXBlci5Qb2ludDtcclxuICAgIGI6IHBhcGVyLlBvaW50O1xyXG4gICAgYzogcGFwZXIuUG9pbnQ7XHJcbiAgICBkOiBwYXBlci5Qb2ludDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50LCBjOiBwYXBlci5Qb2ludCwgZDogcGFwZXIuUG9pbnQpe1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmMgPSBjO1xyXG4gICAgICAgIHRoaXMuZCA9IGQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tUmVjdGFuZ2xlKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICByZWN0LnRvcExlZnQsXHJcbiAgICAgICAgICAgIHJlY3QudG9wUmlnaHQsXHJcbiAgICAgICAgICAgIHJlY3QuYm90dG9tTGVmdCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21SaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tQ29vcmRzKGNvb3JkczogbnVtYmVyW10pIDogUXVhZCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzBdLCBjb29yZHNbMV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzJdLCBjb29yZHNbM10pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzRdLCBjb29yZHNbNV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzZdLCBjb29yZHNbN10pXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhc0Nvb3JkcygpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgdGhpcy5hLngsIHRoaXMuYS55LFxyXG4gICAgICAgICAgICB0aGlzLmIueCwgdGhpcy5iLnksXHJcbiAgICAgICAgICAgIHRoaXMuYy54LCB0aGlzLmMueSxcclxuICAgICAgICAgICAgdGhpcy5kLngsIHRoaXMuZC55XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBEdWFsQm91bmRzUGF0aFdhcnAgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgc3RhdGljIFBPSU5UU19QRVJfUEFUSCA9IDIwMDtcclxuICAgIHN0YXRpYyBVUERBVEVfREVCT1VOQ0UgPSAxNTA7XHJcblxyXG4gICAgcHJpdmF0ZSBfc291cmNlOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBwcml2YXRlIF91cHBlcjogU3RyZXRjaFBhdGg7XHJcbiAgICBwcml2YXRlIF9sb3dlcjogU3RyZXRjaFBhdGg7XHJcbiAgICBwcml2YXRlIF93YXJwZWQ6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIHByaXZhdGUgX291dGxpbmU6IHBhcGVyLlBhdGg7XHJcbiAgICBwcml2YXRlIF9jdXN0b21TdHlsZTogU2tldGNoSXRlbVN0eWxlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHNvdXJjZTogcGFwZXIuQ29tcG91bmRQYXRoLFxyXG4gICAgICAgIGJvdW5kcz86IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9LFxyXG4gICAgICAgIGN1c3RvbVN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vIC0tIGJ1aWxkIGNoaWxkcmVuIC0tXHJcblxyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLl9zb3VyY2UudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoYm91bmRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwcGVyID0gbmV3IFN0cmV0Y2hQYXRoKGJvdW5kcy51cHBlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvd2VyID0gbmV3IFN0cmV0Y2hQYXRoKGJvdW5kcy5sb3dlcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIgPSBuZXcgU3RyZXRjaFBhdGgoW1xyXG4gICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy50b3BMZWZ0KSxcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMudG9wUmlnaHQpXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB0aGlzLl9sb3dlciA9IG5ldyBTdHJldGNoUGF0aChbXHJcbiAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLmJvdHRvbUxlZnQpLFxyXG4gICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy5ib3R0b21SaWdodClcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xCb3VuZHNPcGFjaXR5ID0gMC43NTtcclxuXHJcbiAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgdGhpcy5fbG93ZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcblxyXG4gICAgICAgIHRoaXMuX291dGxpbmUgPSBuZXcgcGFwZXIuUGF0aCh7IGNsb3NlZDogdHJ1ZSB9KTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVTaGFwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLl93YXJwZWQgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHNvdXJjZS5wYXRoRGF0YSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVXYXJwZWQoKTtcclxuXHJcbiAgICAgICAgLy8gLS0gYWRkIGNoaWxkcmVuIC0tXHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGRyZW4oW3RoaXMuX291dGxpbmUsIHRoaXMuX3dhcnBlZCwgdGhpcy5fdXBwZXIsIHRoaXMuX2xvd2VyXSk7XHJcblxyXG4gICAgICAgIC8vIC0tIGFzc2lnbiBzdHlsZSAtLVxyXG5cclxuICAgICAgICB0aGlzLmN1c3RvbVN0eWxlID0gY3VzdG9tU3R5bGUgfHwge1xyXG4gICAgICAgICAgICBzdHJva2VDb2xvcjogXCJsaWdodGdyYXlcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIFBhcGVySGVscGVycy5hZGRTbWFydERyYWcodGhpcyk7XHJcblxyXG4gICAgICAgIC8vIC0tIHNldCB1cCBvYnNlcnZlcnMgLS1cclxuXHJcbiAgICAgICAgUnguT2JzZXJ2YWJsZS5tZXJnZShcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpLFxyXG4gICAgICAgICAgICB0aGlzLl9sb3dlci5wYXRoQ2hhbmdlZC5vYnNlcnZlKCkpXHJcbiAgICAgICAgICAgIC5kZWJvdW5jZShEdWFsQm91bmRzUGF0aFdhcnAuVVBEQVRFX0RFQk9VTkNFKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKHBhdGggPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lU2hhcGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlV2FycGVkKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VkKFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zdWJzY3JpYmUoZmxhZ3MgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkFUVFJJQlVURSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3VwcGVyLnZpc2libGUgIT09IHRoaXMuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cHBlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb3dlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQgdXBwZXIoKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwcGVyLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvd2VyKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb3dlci5wYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzb3VyY2UoKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICByZXR1cm4gPHBhcGVyLkNvbXBvdW5kUGF0aD50aGlzLl9zb3VyY2UuY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc291cmNlKHZhbHVlOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXN0b21TdHlsZSgpOiBTa2V0Y2hJdGVtU3R5bGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXN0b21TdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY3VzdG9tU3R5bGUodmFsdWU6IFNrZXRjaEl0ZW1TdHlsZSkge1xyXG4gICAgICAgIHRoaXMuX2N1c3RvbVN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fd2FycGVkLnN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IHZhbHVlLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNvbnRyb2xCb3VuZHNPcGFjaXR5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl91cHBlci5vcGFjaXR5ID0gdGhpcy5fbG93ZXIub3BhY2l0eSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlV2FycGVkKCkge1xyXG4gICAgICAgIGxldCBvcnRoT3JpZ2luID0gdGhpcy5fc291cmNlLmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgIGxldCBvcnRoV2lkdGggPSB0aGlzLl9zb3VyY2UuYm91bmRzLndpZHRoO1xyXG4gICAgICAgIGxldCBvcnRoSGVpZ2h0ID0gdGhpcy5fc291cmNlLmJvdW5kcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLmR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbihcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aCwgdGhpcy5fbG93ZXIucGF0aCk7XHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgaWYgKCFwb2ludCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KG9ydGhPcmlnaW4pO1xyXG4gICAgICAgICAgICBsZXQgdW5pdCA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gb3J0aEhlaWdodCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0ZWQgPSBwcm9qZWN0aW9uKHVuaXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdQYXRocyA9IHRoaXMuX3NvdXJjZS5jaGlsZHJlblxyXG4gICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IDxwYXBlci5QYXRoPml0ZW07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4UG9pbnRzID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEFzUG9pbnRzKHBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgRHVhbEJvdW5kc1BhdGhXYXJwLlBPSU5UU19QRVJfUEFUSClcclxuICAgICAgICAgICAgICAgICAgICAubWFwKHAgPT4gdHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50KHApKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHhQYXRoID0gbmV3IHBhcGVyLlBhdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8veFBhdGguc2ltcGxpZnkoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4UGF0aDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB0aGlzLl93YXJwZWQucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgICAgICB0aGlzLl93YXJwZWQuYWRkQ2hpbGRyZW4obmV3UGF0aHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlT3V0bGluZVNoYXBlKCkge1xyXG4gICAgICAgIGNvbnN0IGxvd2VyID0gbmV3IHBhcGVyLlBhdGgodGhpcy5fbG93ZXIucGF0aC5zZWdtZW50cyk7XHJcbiAgICAgICAgbG93ZXIucmV2ZXJzZSgpO1xyXG4gICAgICAgIHRoaXMuX291dGxpbmUuc2VnbWVudHMgPSB0aGlzLl91cHBlci5wYXRoLnNlZ21lbnRzLmNvbmNhdChsb3dlci5zZWdtZW50cyk7XHJcbiAgICAgICAgbG93ZXIucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmNsYXNzIFBhdGhIYW5kbGUgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgc3RhdGljIE1BUktFUl9SQURJVVMgPSA4O1xyXG4gICAgc3RhdGljIERSQUdfVEhSRVNIT0xEID0gMztcclxuXHJcbiAgICBwcml2YXRlIF9tYXJrZXI6IHBhcGVyLlNoYXBlO1xyXG4gICAgcHJpdmF0ZSBfc2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgIHByaXZhdGUgX2N1cnZlOiBwYXBlci5DdXJ2ZTtcclxuICAgIHByaXZhdGUgX3Ntb290aGVkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfY3VydmVTcGxpdCA9IG5ldyBPYnNlcnZhYmxlRXZlbnQ8bnVtYmVyPigpO1xyXG4gICAgcHJpdmF0ZSBfY3VydmVDaGFuZ2VVbnN1YjogKCkgPT4gdm9pZDtcclxuICAgIHByaXZhdGUgZHJhZ2dpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXR0YWNoOiBwYXBlci5TZWdtZW50IHwgcGFwZXIuQ3VydmUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBsZXQgcG9zaXRpb246IHBhcGVyLlBvaW50O1xyXG4gICAgICAgIGxldCBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgICAgIGlmIChhdHRhY2ggaW5zdGFuY2VvZiBwYXBlci5TZWdtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQgPSA8cGFwZXIuU2VnbWVudD5hdHRhY2g7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgcGF0aCA9IHRoaXMuX3NlZ21lbnQucGF0aDtcclxuICAgICAgICB9IGVsc2UgaWYgKGF0dGFjaCBpbnN0YW5jZW9mIHBhcGVyLkN1cnZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnZlID0gPHBhcGVyLkN1cnZlPmF0dGFjaDtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XHJcbiAgICAgICAgICAgIHBhdGggPSB0aGlzLl9jdXJ2ZS5wYXRoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwiYXR0YWNoIG11c3QgYmUgU2VnbWVudCBvciBDdXJ2ZVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvc2l0aW9uLCBQYXRoSGFuZGxlLk1BUktFUl9SQURJVVMpO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5zdHJva2VDb2xvciA9IFwiYmx1ZVwiO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5maWxsQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9tYXJrZXIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlQXNTZWdtZW50KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZUFzQ3VydmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFBhcGVySGVscGVycy5hZGRTbWFydERyYWcodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VydmUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBjdXJ2ZSwgcHVwYXRlIHRvIHNlZ21lbnQgaGFuZGxlXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlQ2hhbmdlVW5zdWIoKTsgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gbmV3IHBhcGVyLlNlZ21lbnQodGhpcy5jZW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VydmVJZHggPSB0aGlzLl9jdXJ2ZS5pbmRleDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlLnBhdGguaW5zZXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlSWR4ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VydmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZUFzU2VnbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJ2ZVNwbGl0Lm5vdGlmeShjdXJ2ZUlkeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLnNtYXJ0RHJhZ01vdmUsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQucG9pbnQgPSB0aGlzLmNlbnRlcjtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zbW9vdGhlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLmNsaWNrV2l0aG91dERyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc21vb3RoZWQgPSAhdGhpcy5zbW9vdGhlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9jdXJ2ZUNoYW5nZVVuc3ViID0gcGF0aC5zdWJzY3JpYmUoZmxhZ3MgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VydmUgJiYgIXRoaXMuX3NlZ21lbnQgXHJcbiAgICAgICAgICAgICAgICAmJiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLlNFR01FTlRTKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNtb290aGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zbW9vdGhlZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc21vb3RoZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9zbW9vdGhlZCA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5oYW5kbGVPdXQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VydmVTcGxpdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY3VydmVTcGxpdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2VudGVyKCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY2VudGVyKHBvaW50OiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb2ludDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0eWxlQXNTZWdtZW50KCkge1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5vcGFjaXR5ID0gMC44O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3R5bGVBc0N1cnZlKCkge1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5vcGFjaXR5ID0gMC4zO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5jbGFzcyBQYXRoU2VjdGlvbiBpbXBsZW1lbnRzIHBhcGVyLkN1cnZlbGlrZSB7XHJcbiAgICBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgb2Zmc2V0OiBudW1iZXI7XHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocGF0aDogcGFwZXIuUGF0aCwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRQb2ludEF0KG9mZnNldDogbnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXRoLmdldFBvaW50QXQob2Zmc2V0ICsgdGhpcy5vZmZzZXQpO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFBhdGhUcmFuc2Zvcm0ge1xyXG4gICAgcG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRUcmFuc2Zvcm0gPSBwb2ludFRyYW5zZm9ybTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRUcmFuc2Zvcm0ocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBhdGhJdGVtKHBhdGg6IHBhcGVyLlBhdGhJdGVtKSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtQ29tcG91bmRQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCkge1xyXG4gICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBhdGgocGF0aDogcGFwZXIuUGF0aCkge1xyXG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2YgcGF0aC5zZWdtZW50cykge1xyXG4gICAgICAgICAgICBsZXQgb3JpZ1BvaW50ID0gc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgbGV0IG5ld1BvaW50ID0gdGhpcy50cmFuc2Zvcm1Qb2ludChzZWdtZW50LnBvaW50KTtcclxuICAgICAgICAgICAgb3JpZ1BvaW50LnggPSBuZXdQb2ludC54O1xyXG4gICAgICAgICAgICBvcmlnUG9pbnQueSA9IG5ld1BvaW50Lnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoUGF0aCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuXHJcbiAgICBwcml2YXRlIF9wYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgcHJpdmF0ZSBfcGF0aENoYW5nZWQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlBhdGg+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2VnbWVudHM6IHBhcGVyLlNlZ21lbnRbXSwgc3R5bGU/OiBwYXBlci5TdHlsZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3BhdGggPSBuZXcgcGFwZXIuUGF0aChzZWdtZW50cyk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9wYXRoKTtcclxuXHJcbiAgICAgICAgaWYoc3R5bGUpe1xyXG4gICAgICAgICAgICB0aGlzLl9wYXRoLnN0eWxlID0gc3R5bGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHJva2VDb2xvciA9IFwibGlnaHRncmF5XCI7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhdGguc3Ryb2tlV2lkdGggPSA2O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IoY29uc3QgcyBvZiB0aGlzLl9wYXRoLnNlZ21lbnRzKXtcclxuICAgICAgICAgICAgdGhpcy5hZGRTZWdtZW50SGFuZGxlKHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IoY29uc3QgYyBvZiB0aGlzLl9wYXRoLmN1cnZlcyl7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ3VydmVIYW5kbGUoYyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgcGF0aCgpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGF0aDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHBhdGhDaGFuZ2VkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoQ2hhbmdlZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBhZGRTZWdtZW50SGFuZGxlKHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQpe1xyXG4gICAgICAgIHRoaXMuYWRkSGFuZGxlKG5ldyBQYXRoSGFuZGxlKHNlZ21lbnQpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBhZGRDdXJ2ZUhhbmRsZShjdXJ2ZTogcGFwZXIuQ3VydmUpe1xyXG4gICAgICAgIGxldCBoYW5kbGUgPSBuZXcgUGF0aEhhbmRsZShjdXJ2ZSk7XHJcbiAgICAgICAgaGFuZGxlLmN1cnZlU3BsaXQuc3Vic2NyaWJlT25lKGN1cnZlSWR4ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZSh0aGlzLl9wYXRoLmN1cnZlc1tjdXJ2ZUlkeF0pO1xyXG4gICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKHRoaXMuX3BhdGguY3VydmVzW2N1cnZlSWR4ICsgMV0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYWRkSGFuZGxlKGhhbmRsZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgYWRkSGFuZGxlKGhhbmRsZTogUGF0aEhhbmRsZSl7XHJcbiAgICAgICAgaGFuZGxlLnZpc2libGUgPSB0aGlzLnZpc2libGU7XHJcbiAgICAgICAgaGFuZGxlLm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnTW92ZSwgZXYgPT4ge1xyXG4gICAgICAgICAgIHRoaXMuX3BhdGhDaGFuZ2VkLm5vdGlmeSh0aGlzLl9wYXRoKTsgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaGFuZGxlLm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuY2xpY2tXaXRob3V0RHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgIHRoaXMuX3BhdGhDaGFuZ2VkLm5vdGlmeSh0aGlzLl9wYXRoKTsgXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmFkZENoaWxkKGhhbmRsZSk7ICAgICAgICBcclxuICAgIH1cclxufVxyXG4iLCJcclxuLyoqXHJcbiAqIE1lYXN1cmVzIG9mZnNldHMgb2YgdGV4dCBnbHlwaHMuXHJcbiAqL1xyXG5jbGFzcyBUZXh0UnVsZXIge1xyXG4gICAgXHJcbiAgICBmb250RmFtaWx5OiBzdHJpbmc7XHJcbiAgICBmb250V2VpZ2h0OiBudW1iZXI7XHJcbiAgICBmb250U2l6ZTogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCAodGV4dCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XHJcbiAgICAgICAgcG9pbnRUZXh0LmNvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgIHBvaW50VGV4dC5qdXN0aWZpY2F0aW9uID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBpZih0aGlzLmZvbnRGYW1pbHkpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udEZhbWlseSA9IHRoaXMuZm9udEZhbWlseTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5mb250V2VpZ2h0KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRXZWlnaHQgPSB0aGlzLmZvbnRXZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFNpemUpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcG9pbnRUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRleHRPZmZzZXRzKHRleHQpe1xyXG4gICAgICAgIC8vIE1lYXN1cmUgZ2x5cGhzIGluIHBhaXJzIHRvIGNhcHR1cmUgd2hpdGUgc3BhY2UuXHJcbiAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxyXG4gICAgICAgIHZhciBnbHlwaFBhaXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpKzEpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRm9yIGVhY2ggY2hhcmFjdGVyLCBmaW5kIGNlbnRlciBvZmZzZXQuXHJcbiAgICAgICAgdmFyIHhPZmZzZXRzID0gWzBdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gTWVhc3VyZSB0aHJlZSBjaGFyYWN0ZXJzIGF0IGEgdGltZSB0byBnZXQgdGhlIGFwcHJvcHJpYXRlIFxyXG4gICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxyXG4gICAgICAgICAgICB2YXIgdHJpYWRUZXh0ID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSAtIDEsIGkgKyAxKSk7XHJcbiAgICAgICAgICAgIHRyaWFkVGV4dC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXHJcbiAgICAgICAgICAgIC8vICAgYW5kIGhhbGYgb2YgY3VycmVudCBnbHlwaCBwYWlyLlxyXG4gICAgICAgICAgICAvLyBNdXN0IGJlIHJpZ2h0LCBiZWNhdXNlIGl0IHdvcmtzLlxyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2kgLSAxXS5ib3VuZHMud2lkdGggLyAyIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHdpZHRoIHRvIHByaW9yIG9mZnNldC4gXHJcbiAgICAgICAgICAgIHhPZmZzZXRzW2ldID0geE9mZnNldHNbaSAtIDFdICsgb2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgZ2x5cGhQYWlyIG9mIGdseXBoUGFpcnMpe1xyXG4gICAgICAgICAgICBnbHlwaFBhaXIucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB4T2Zmc2V0cztcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgVGV4dFdhcnAgZXh0ZW5kcyBEdWFsQm91bmRzUGF0aFdhcnAge1xyXG5cclxuICAgIHN0YXRpYyBERUZBVUxUX0ZPTlRfU0laRSA9IDY0O1xyXG5cclxuICAgIHByaXZhdGUgX2ZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICBwcml2YXRlIF90ZXh0OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9mb250U2l6ZTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZvbnQ6IG9wZW50eXBlLkZvbnQsXHJcbiAgICAgICAgdGV4dDogc3RyaW5nLFxyXG4gICAgICAgIGJvdW5kcz86IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9LFxyXG4gICAgICAgIGZvbnRTaXplPzogbnVtYmVyLFxyXG4gICAgICAgIHN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZighZm9udFNpemUpe1xyXG4gICAgICAgICAgICAgICAgZm9udFNpemUgPSBUZXh0V2FycC5ERUZBVUxUX0ZPTlRfU0laRTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBUZXh0V2FycC5nZXRQYXRoRGF0YShmb250LCB0ZXh0LCBmb250U2l6ZSk7IFxyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzdXBlcihwYXRoLCBib3VuZHMsIHN0eWxlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSBmb250O1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0ID0gdGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl90ZXh0ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmb250U2l6ZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IGZvbnRTaXplKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZighdmFsdWUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2ZvbnRTaXplID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmb250KHZhbHVlOiBvcGVudHlwZS5Gb250KXtcclxuICAgICAgICBpZih2YWx1ZSAhPT0gdGhpcy5fZm9udCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVUZXh0UGF0aCgpIHtcclxuICAgICAgICBjb25zdCBwYXRoRGF0YSA9IFRleHRXYXJwLmdldFBhdGhEYXRhKFxyXG4gICAgICAgICAgICB0aGlzLl9mb250LCB0aGlzLl90ZXh0LCB0aGlzLl9mb250U2l6ZSk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRQYXRoRGF0YShmb250OiBvcGVudHlwZS5Gb250LFxyXG4gICAgICAgIHRleHQ6IHN0cmluZywgZm9udFNpemU/OiBzdHJpbmd8bnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgb3BlblR5cGVQYXRoID0gZm9udC5nZXRQYXRoKHRleHQsIDAsIDAsXHJcbiAgICAgICAgICAgIE51bWJlcihmb250U2l6ZSkgfHwgVGV4dFdhcnAuREVGQVVMVF9GT05UX1NJWkUpO1xyXG4gICAgICAgIHJldHVybiBvcGVuVHlwZVBhdGgudG9QYXRoRGF0YSgpO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFZpZXdab29tIHtcclxuXHJcbiAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgZmFjdG9yID0gMS4yNTtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfbWluWm9vbTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbWF4Wm9vbTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbW91c2VOYXRpdmVTdGFydDogcGFwZXIuUG9pbnQ7XHJcbiAgICBwcml2YXRlIF92aWV3Q2VudGVyU3RhcnQ6IHBhcGVyLlBvaW50O1xyXG4gICAgcHJpdmF0ZSBfdmlld0NoYW5nZWQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlJlY3RhbmdsZT4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9qZWN0OiBwYXBlci5Qcm9qZWN0KSB7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcblxyXG4gICAgICAgICg8YW55PiQodmlldy5lbGVtZW50KSkubW91c2V3aGVlbCgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludChldmVudC5vZmZzZXRYLCBldmVudC5vZmZzZXRZKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2Vab29tQ2VudGVyZWQoZXZlbnQuZGVsdGFZLCBtb3VzZVBvc2l0aW9uKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGlkRHJhZyA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZpZXcub24oXCJtb3VzZWRyYWdcIiwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZighdGhpcy5fdmlld0NlbnRlclN0YXJ0KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDZW50ZXJTdGFydCA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgLy8gSGF2ZSB0byB1c2UgbmF0aXZlIG1vdXNlIG9mZnNldCwgYmVjYXVzZSBldi5kZWx0YSBcclxuICAgICAgICAgICAgICAgIC8vICBjaGFuZ2VzIGFzIHRoZSB2aWV3IGlzIHNjcm9sbGVkLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG5ldyBwYXBlci5Qb2ludChldi5ldmVudC5vZmZzZXRYLCBldi5ldmVudC5vZmZzZXRZKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3LmVtaXQoUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmF0aXZlRGVsdGEgPSBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgZXYuZXZlbnQub2Zmc2V0WCAtIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQueCxcclxuICAgICAgICAgICAgICAgICAgICBldi5ldmVudC5vZmZzZXRZIC0gdGhpcy5fbW91c2VOYXRpdmVTdGFydC55XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgLy8gTW92ZSBpbnRvIHZpZXcgY29vcmRpbmF0ZXMgdG8gc3VicmFjdCBkZWx0YSxcclxuICAgICAgICAgICAgICAgIC8vICB0aGVuIGJhY2sgaW50byBwcm9qZWN0IGNvb3Jkcy5cclxuICAgICAgICAgICAgICAgIHZpZXcuY2VudGVyID0gdmlldy52aWV3VG9Qcm9qZWN0KCBcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnByb2plY3RUb1ZpZXcodGhpcy5fdmlld0NlbnRlclN0YXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChuYXRpdmVEZWx0YSkpO1xyXG4gICAgICAgICAgICAgICAgdmlldy5lbWl0KFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnTW92ZSwgZXYpO1xyXG4gICAgICAgICAgICAgICAgZGlkRHJhZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB2aWV3Lm9uKFwibW91c2V1cFwiLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX21vdXNlTmF0aXZlU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2VudGVyU3RhcnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmlldy5lbWl0KFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnRW5kLCBldik7XHJcbiAgICAgICAgICAgICAgICBpZihkaWREcmFnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlld0NoYW5nZWQubm90aWZ5KHZpZXcuYm91bmRzKTtcclxuICAgICAgICAgICAgICAgICAgICBkaWREcmFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmlld0NoYW5nZWQoKSA6IE9ic2VydmFibGVFdmVudDxwYXBlci5SZWN0YW5nbGU+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlld0NoYW5nZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHpvb20oKTogbnVtYmVye1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2plY3Qudmlldy56b29tO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB6b29tUmFuZ2UoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Wm9vbVJhbmdlKHJhbmdlOiBwYXBlci5TaXplW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGNvbnN0IGFTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICBjb25zdCBiU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgY29uc3QgYSA9IGFTaXplICYmIE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYVNpemUuaGVpZ2h0LCAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGFTaXplLndpZHRoKTtcclxuICAgICAgICBjb25zdCBiID0gYlNpemUgJiYgTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBiU2l6ZS5oZWlnaHQsICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYlNpemUud2lkdGgpO1xyXG4gICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKGEsYik7XHJcbiAgICAgICAgaWYobWluKXtcclxuICAgICAgICAgICAgdGhpcy5fbWluWm9vbSA9IG1pbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoYSxiKTtcclxuICAgICAgICBpZihtYXgpe1xyXG4gICAgICAgICAgICB0aGlzLl9tYXhab29tID0gbWF4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgfVxyXG5cclxuICAgIHpvb21UbyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpe1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICB2aWV3LmNlbnRlciA9IHJlY3QuY2VudGVyO1xyXG4gICAgICAgIHZpZXcuem9vbSA9IE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy52aWV3U2l6ZS5oZWlnaHQgLyByZWN0LmhlaWdodCwgXHJcbiAgICAgICAgICAgIHZpZXcudmlld1NpemUud2lkdGggLyByZWN0LndpZHRoKTtcclxuICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVpvb21DZW50ZXJlZChkZWx0YTogbnVtYmVyLCBtb3VzZVBvczogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICBpZiAoIWRlbHRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGNvbnN0IG9sZFpvb20gPSB2aWV3Lnpvb207XHJcbiAgICAgICAgY29uc3Qgb2xkQ2VudGVyID0gdmlldy5jZW50ZXI7XHJcbiAgICAgICAgY29uc3Qgdmlld1BvcyA9IHZpZXcudmlld1RvUHJvamVjdChtb3VzZVBvcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG5ld1pvb20gPSBkZWx0YSA+IDBcclxuICAgICAgICAgICAgPyB2aWV3Lnpvb20gKiB0aGlzLmZhY3RvclxyXG4gICAgICAgICAgICA6IHZpZXcuem9vbSAvIHRoaXMuZmFjdG9yO1xyXG4gICAgICAgIG5ld1pvb20gPSB0aGlzLnNldFpvb21Db25zdHJhaW5lZChuZXdab29tKTtcclxuICAgICAgICBcclxuICAgICAgICBpZighbmV3Wm9vbSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHpvb21TY2FsZSA9IG9sZFpvb20gLyBuZXdab29tO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlckFkanVzdCA9IHZpZXdQb3Muc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuICAgICAgICBjb25zdCBvZmZzZXQgPSB2aWV3UG9zLnN1YnRyYWN0KGNlbnRlckFkanVzdC5tdWx0aXBseSh6b29tU2NhbGUpKVxyXG4gICAgICAgICAgICAuc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuXHJcbiAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LmNlbnRlci5hZGQob2Zmc2V0KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgem9vbSBsZXZlbC5cclxuICAgICAqIEByZXR1cm5zIHpvb20gbGV2ZWwgdGhhdCB3YXMgc2V0LCBvciBudWxsIGlmIGl0IHdhcyBub3QgY2hhbmdlZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNldFpvb21Db25zdHJhaW5lZCh6b29tOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGlmKHRoaXMuX21pblpvb20pIHtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWF4KHpvb20sIHRoaXMuX21pblpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9tYXhab29tKXtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWluKHpvb20sIHRoaXMuX21heFpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgaWYoem9vbSAhPSB2aWV3Lnpvb20pe1xyXG4gICAgICAgICAgICB2aWV3Lnpvb20gPSB6b29tO1xyXG4gICAgICAgICAgICByZXR1cm4gem9vbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmludGVyZmFjZSBTa2V0Y2hJdGVtU3R5bGUgZXh0ZW5kcyBwYXBlci5JU3R5bGUge1xyXG4gICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG59XHJcbiIsIlxyXG5cclxuZnVuY3Rpb24gYm9vdHN0cmFwKCkge1xyXG4gICAgXHJcbiAgICBjb25zdCBzdG9yZSA9IG5ldyBTdG9yZSgpO1xyXG4gICAgXHJcbiAgICBjb25zdCBza2V0Y2hFZGl0b3IgPSBuZXcgU2tldGNoRWRpdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNpZ25lcicpLCBzdG9yZSk7XHJcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1FZGl0b3IgPSBuZXcgU2VsZWN0ZWRJdGVtRWRpdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdG9yT3ZlcmxheVwiKSwgc3RvcmUpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gbmV3IEFwcENvbnRyb2xsZXIoc3RvcmUsIHNrZXRjaEVkaXRvciwgc2VsZWN0ZWRJdGVtRWRpdG9yKTtcclxuXHJcbn1cclxuXHJcbmNvbnN0IGFwcCA9IGJvb3RzdHJhcCgpO1xyXG4iXX0=