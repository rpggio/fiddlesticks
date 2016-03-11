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
            _id: newid(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Eb21IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0ZvbnRIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0hlbHBlcnMudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2NvbGxlY3Rpb25zLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2V2ZW50cy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3BhcGVyL1BhcGVyTm90aWZ5LnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3BhcGVyL3BhcGVyLWV4dC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9wb3N0YWwvVG9waWMudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcG9zdGFsL3Bvc3RhbC1vYnNlcnZlLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3JlYWN0L1JlYWN0SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay92ZG9tL0NvbXBvbmVudC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay92ZG9tL1JlYWN0aXZlRG9tLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vQXBwQ29udHJvbGxlci50cyIsIi4uLy4uL2NsaWVudC9fY29tbW9uL0NoYW5uZWxzLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vRm9udEZhbWlsaWVzTG9hZGVyLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vUGFyc2VkRm9udHMudHMiLCIuLi8uLi9jbGllbnQvX2NvbW1vbi9TM0FjY2Vzcy50cyIsIi4uLy4uL2NsaWVudC9fY29tbW9uL1N0b3JlLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vY29uc3RhbnRzLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vbW9kZWwtaGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fY29tbW9uL21vZGVscy50cyIsIi4uLy4uL2NsaWVudC9kZXNpZ25lci9Db2xvclBpY2tlci50cyIsIi4uLy4uL2NsaWVudC9kZXNpZ25lci9Eb2N1bWVudEtleUhhbmRsZXIudHMiLCIuLi8uLi9jbGllbnQvZGVzaWduZXIvRm9udFBpY2tlci50cyIsIi4uLy4uL2NsaWVudC9kZXNpZ25lci9TZWxlY3RlZEl0ZW1FZGl0b3IudHMiLCIuLi8uLi9jbGllbnQvZGVzaWduZXIvU2tldGNoRWRpdG9yLnRzIiwiLi4vLi4vY2xpZW50L2Rlc2lnbmVyL1RleHRCbG9ja0VkaXRvci50cyIsIi4uLy4uL2NsaWVudC9kZXNpZ25lci9Xb3Jrc3BhY2VDb250cm9sbGVyLnRzIiwiLi4vLi4vY2xpZW50L21hdGgvUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHMiLCIuLi8uLi9jbGllbnQvd29ya3NwYWNlL0R1YWxCb3VuZHNQYXRoV2FycC50cyIsIi4uLy4uL2NsaWVudC93b3Jrc3BhY2UvUGF0aEhhbmRsZS50cyIsIi4uLy4uL2NsaWVudC93b3Jrc3BhY2UvUGF0aFNlY3Rpb24udHMiLCIuLi8uLi9jbGllbnQvd29ya3NwYWNlL1BhdGhUcmFuc2Zvcm0udHMiLCIuLi8uLi9jbGllbnQvd29ya3NwYWNlL1N0cmV0Y2hQYXRoLnRzIiwiLi4vLi4vY2xpZW50L3dvcmtzcGFjZS9UZXh0UnVsZXIudHMiLCIuLi8uLi9jbGllbnQvd29ya3NwYWNlL1RleHRXYXJwLnRzIiwiLi4vLi4vY2xpZW50L3dvcmtzcGFjZS9WaWV3Wm9vbS50cyIsIi4uLy4uL2NsaWVudC93b3Jrc3BhY2UvaW50ZXJmYWNlcy50cyIsIi4uLy4uL2NsaWVudC96X2FwcC9ib290c3RyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxJQUFVLFVBQVUsQ0FrSm5CO0FBbEpELFdBQVUsVUFBVSxFQUFDLENBQUM7SUFFbEIsc0RBQXNEO0lBQ3RELHNCQUE2QixPQUFlLEVBQUUsUUFBZ0I7UUFDMUQsSUFBSSxJQUFJLEdBQVEsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ3BCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFUZSx1QkFBWSxlQVMzQixDQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsdUJBQThCLE9BQU87UUFDakMsSUFBSSxhQUFhLEdBQUcsVUFBVSxDQUFDO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0IsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxJQUFJLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2QyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFFRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pDLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBRTNCLElBQUksVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTNDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDakMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQXRCZSx3QkFBYSxnQkFzQjVCLENBQUE7SUFFWSxtQkFBUSxHQUFHO1FBQ3BCLFNBQVMsRUFBYSxDQUFDO1FBQ3ZCLEdBQUcsRUFBbUIsQ0FBQztRQUN2QixLQUFLLEVBQWlCLEVBQUU7UUFDeEIsS0FBSyxFQUFpQixFQUFFO1FBQ3hCLElBQUksRUFBa0IsRUFBRTtRQUN4QixHQUFHLEVBQW1CLEVBQUU7UUFDeEIsVUFBVSxFQUFZLEVBQUU7UUFDeEIsUUFBUSxFQUFjLEVBQUU7UUFDeEIsR0FBRyxFQUFtQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixRQUFRLEVBQWMsRUFBRTtRQUN4QixHQUFHLEVBQW1CLEVBQUU7UUFDeEIsSUFBSSxFQUFrQixFQUFFO1FBQ3hCLFNBQVMsRUFBYSxFQUFFO1FBQ3hCLE9BQU8sRUFBZSxFQUFFO1FBQ3hCLFVBQVUsRUFBWSxFQUFFO1FBQ3hCLFNBQVMsRUFBYSxFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsVUFBVSxFQUFZLEVBQUU7UUFDeEIsV0FBVyxFQUFXLEVBQUU7UUFDeEIsU0FBUyxFQUFhLEVBQUU7UUFDeEIsT0FBTyxFQUFlLEVBQUU7UUFDeEIsT0FBTyxFQUFlLEVBQUU7UUFDeEIsT0FBTyxFQUFlLEVBQUU7UUFDeEIsT0FBTyxFQUFlLEVBQUU7UUFDeEIsT0FBTyxFQUFlLEdBQUc7UUFDekIsT0FBTyxFQUFlLEdBQUc7UUFDekIsT0FBTyxFQUFlLEdBQUc7UUFDekIsT0FBTyxFQUFlLEdBQUc7UUFDekIsT0FBTyxFQUFlLEdBQUc7UUFDekIsT0FBTyxFQUFlLEdBQUc7UUFDekIsUUFBUSxFQUFjLEdBQUc7UUFDekIsR0FBRyxFQUFtQixHQUFHO1FBQ3pCLFFBQVEsRUFBYyxHQUFHO1FBQ3pCLFlBQVksRUFBVSxHQUFHO1FBQ3pCLE1BQU0sRUFBZ0IsR0FBRztRQUN6QixFQUFFLEVBQW9CLEdBQUc7UUFDekIsRUFBRSxFQUFvQixHQUFHO1FBQ3pCLEVBQUUsRUFBb0IsR0FBRztRQUN6QixFQUFFLEVBQW9CLEdBQUc7UUFDekIsRUFBRSxFQUFvQixHQUFHO1FBQ3pCLEVBQUUsRUFBb0IsR0FBRztRQUN6QixFQUFFLEVBQW9CLEdBQUc7UUFDekIsRUFBRSxFQUFvQixHQUFHO1FBQ3pCLEVBQUUsRUFBb0IsR0FBRztRQUN6QixHQUFHLEVBQW1CLEdBQUc7UUFDekIsR0FBRyxFQUFtQixHQUFHO1FBQ3pCLEdBQUcsRUFBbUIsR0FBRztRQUN6QixPQUFPLEVBQWUsR0FBRztRQUN6QixVQUFVLEVBQVksR0FBRztRQUN6QixTQUFTLEVBQWEsR0FBRztRQUN6QixLQUFLLEVBQWlCLEdBQUc7UUFDekIsS0FBSyxFQUFpQixHQUFHO1FBQ3pCLElBQUksRUFBa0IsR0FBRztRQUN6QixNQUFNLEVBQWdCLEdBQUc7UUFDekIsWUFBWSxFQUFVLEdBQUc7UUFDekIsV0FBVyxFQUFXLEdBQUc7UUFDekIsV0FBVyxFQUFXLEdBQUc7UUFDekIsU0FBUyxFQUFhLEdBQUc7UUFDekIsWUFBWSxFQUFVLEdBQUc7UUFDekIsV0FBVyxFQUFXLEdBQUc7S0FDNUIsQ0FBQztBQUVOLENBQUMsRUFsSlMsVUFBVSxLQUFWLFVBQVUsUUFrSm5CO0FDbEpELElBQVUsV0FBVyxDQWtDcEI7QUFsQ0QsV0FBVSxXQUFXLEVBQUMsQ0FBQztJQVFuQixxQkFBNEIsTUFBYyxFQUFFLE9BQWU7UUFDdkQsSUFBSSxLQUFLLEdBQWlCLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQ2pELEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsQ0FBQztZQUMvQixLQUFLLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMvQixDQUFDO1FBQ0QsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUMsRUFBRSxDQUFBLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUM7WUFDZixLQUFLLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMxQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBVmUsdUJBQVcsY0FVMUIsQ0FBQTtJQUVELHdCQUErQixNQUFrQixFQUFFLE9BQWdCO1FBQy9ELElBQUksR0FBVyxDQUFDO1FBQ2hCLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsQ0FBQztRQUN6QyxFQUFFLENBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUM7WUFDTCxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixDQUFDO1FBQ0QsTUFBTSxDQUFDO1lBQ0gsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO1lBQ3JCLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUTtZQUN6QixPQUFPLEVBQUUsT0FBTztZQUNoQixLQUFBLEdBQUc7U0FDTixDQUFBO0lBQ0wsQ0FBQztJQVplLDBCQUFjLGlCQVk3QixDQUFBO0FBRUwsQ0FBQyxFQWxDUyxXQUFXLEtBQVgsV0FBVyxRQWtDcEI7QUNsQ0QsZ0JBQW1CLE9BQWUsRUFBRSxNQUF3QjtJQUN4RCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7QUFDcEQsQ0FBQztBQUVEO0lBQ0ksTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQ05ELElBQVUsWUFBWSxDQTJFckI7QUEzRUQsV0FBVSxZQUFZLEVBQUMsQ0FBQztJQWVwQjtRQUlJLHNCQUFZLE9BQWlDLEVBQUUsSUFBWTtZQUN2RCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNyQixDQUFDO1FBRUQsZ0NBQVMsR0FBVCxVQUFVLFFBQTJDO1lBQ2pELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUVELCtCQUFRLEdBQVIsVUFBUyxJQUFZO1lBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO2dCQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2FBQ3RCLENBQUMsQ0FBQztRQUNQLENBQUM7UUFFRCw4QkFBTyxHQUFQO1lBQUEsaUJBRUM7WUFERyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUksQ0FBQyxJQUFJLEVBQXBCLENBQW9CLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBRUQsOEJBQU8sR0FBUCxVQUFRLE9BQTRCO1lBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFDTCxtQkFBQztJQUFELENBQUMsQUEzQkQsSUEyQkM7SUEzQlkseUJBQVksZUEyQnhCLENBQUE7SUFFRDtRQUlJLGlCQUFZLE9BQXlDLEVBQUUsSUFBYTtZQUNoRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQXlCLENBQUM7WUFDbEUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDckIsQ0FBQztRQUVELDJCQUFTLEdBQVQsVUFBVSxNQUErQztZQUNyRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUVELHVCQUFLLEdBQUwsVUFBa0MsSUFBWTtZQUMxQyxNQUFNLENBQUMsSUFBSSxZQUFZLENBQVEsSUFBSSxDQUFDLE9BQW1DLEVBQ25FLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFFRCw0QkFBVSxHQUFWO1lBQXVDLGdCQUFnQztpQkFBaEMsV0FBZ0MsQ0FBaEMsc0JBQWdDLENBQWhDLElBQWdDO2dCQUFoQywrQkFBZ0M7O1lBRW5FLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBMUIsQ0FBMEIsQ0FBbUMsQ0FBQztRQUNsRyxDQUFDO1FBRUQsdUJBQUssR0FBTDtZQUFNLGdCQUF1QztpQkFBdkMsV0FBdUMsQ0FBdkMsc0JBQXVDLENBQXZDLElBQXVDO2dCQUF2QywrQkFBdUM7O1lBRXpDLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBMUIsQ0FBMEIsQ0FBRSxDQUFDO1FBQ2pFLENBQUM7UUFDTCxjQUFDO0lBQUQsQ0FBQyxBQTdCRCxJQTZCQztJQTdCWSxvQkFBTyxVQTZCbkIsQ0FBQTtBQUVMLENBQUMsRUEzRVMsWUFBWSxLQUFaLFlBQVksUUEyRXJCO0FFM0VEO0lBQUE7UUFFWSxpQkFBWSxHQUE4QixFQUFFLENBQUM7SUFpRHpELENBQUM7SUEvQ0c7O09BRUc7SUFDSCxtQ0FBUyxHQUFULFVBQVUsT0FBOEI7UUFBeEMsaUJBS0M7UUFKRyxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFDRCxNQUFNLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQXpCLENBQXlCLENBQUM7SUFDM0MsQ0FBQztJQUVELHFDQUFXLEdBQVgsVUFBWSxRQUErQjtRQUN2QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkQsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDO0lBQ0wsQ0FBQztJQUVELGlDQUFPLEdBQVA7UUFBQSxpQkFNQztRQUxHLElBQUksS0FBVSxDQUFDO1FBQ2YsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQ2pDLFVBQUMsWUFBWSxJQUFLLE9BQUEsS0FBSSxDQUFDLFNBQVMsQ0FBd0IsWUFBWSxDQUFDLEVBQW5ELENBQW1ELEVBQ3JFLFVBQUMsZUFBZSxJQUFLLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBd0IsZUFBZSxDQUFDLEVBQXhELENBQXdELENBQ2hGLENBQUM7SUFDTixDQUFDO0lBRUQ7O09BRUc7SUFDSCxzQ0FBWSxHQUFaLFVBQWEsUUFBK0I7UUFDeEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7WUFDeEIsS0FBSyxFQUFFLENBQUM7WUFDUixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsZ0NBQU0sR0FBTixVQUFPLFFBQVc7UUFDZCxHQUFHLENBQUEsQ0FBbUIsVUFBaUIsRUFBakIsS0FBQSxJQUFJLENBQUMsWUFBWSxFQUFqQixjQUFpQixFQUFqQixJQUFpQixDQUFDO1lBQXBDLElBQUksVUFBVSxTQUFBO1lBQ2QsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDbkM7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSCwrQkFBSyxHQUFMO1FBQ0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDTCxzQkFBQztBQUFELENBQUMsQUFuREQsSUFtREM7QUNuREQsSUFBVSxVQUFVLENBNENuQjtBQTVDRCxXQUFVLFVBQVUsRUFBQyxDQUFDO0lBUWxCLGtCQUNJLElBSUM7UUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRTtZQUNyQixDQUFDLENBQUMsd0NBQXdDLEVBQ3RDO2dCQUNJLE9BQU8sRUFBRTtvQkFDTCxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsYUFBYSxFQUFFLFVBQVU7b0JBQ3pCLFNBQVMsRUFBRSxpQ0FBaUM7aUJBQy9DO2FBQ0osRUFDRDtnQkFDSSxJQUFJLENBQUMsT0FBTztnQkFDWixDQUFDLENBQUMsWUFBWSxDQUFDO2FBQ2xCLENBQUM7WUFDTixDQUFDLENBQUMsa0JBQWtCLEVBQ2hCLEVBQUUsRUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7Z0JBQ2YsT0FBQSxDQUFDLENBQUMsSUFBSSxFQUNGLEVBQ0MsRUFDRDtvQkFDSSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUM3QyxDQUNKO1lBTkQsQ0FNQyxDQUNKLENBQ0o7U0FDSixDQUFDLENBQUM7SUFFUCxDQUFDO0lBbkNlLG1CQUFRLFdBbUN2QixDQUFBO0FBQ0wsQ0FBQyxFQTVDUyxVQUFVLEtBQVYsVUFBVSxRQTRDbkI7QUN2Q0QsSUFBVSxZQUFZLENBMk9yQjtBQTNPRCxXQUFVLFlBQVksRUFBQyxDQUFDO0lBSXBCLElBQU0sR0FBRyxHQUFHO1FBQVMsZ0JBQWdCO2FBQWhCLFdBQWdCLENBQWhCLHNCQUFnQixDQUFoQixJQUFnQjtZQUFoQiwrQkFBZ0I7O1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLDBCQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLE9BQVgsT0FBTyxFQUFRLE1BQU0sQ0FBQyxDQUFDO1FBQzNCLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFWSwrQkFBa0IsR0FBRyxVQUFTLFFBQXVCO1FBQzlELE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFckQsK0JBQStCO1FBQy9CLG1EQUFtRDtJQUN2RCxDQUFDLENBQUE7SUFFWSwwQkFBYSxHQUFHLFVBQVMsSUFBb0IsRUFBRSxhQUFxQjtRQUM3RSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBcUIsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzNFLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFhLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMzRCxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVksOEJBQWlCLEdBQUcsVUFBUyxJQUF3QixFQUFFLGFBQXFCO1FBQXhELGlCQVVoQztRQVRHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztZQUMzQixPQUFBLEtBQUksQ0FBQyxTQUFTLENBQWEsQ0FBQyxFQUFFLGFBQWEsQ0FBQztRQUE1QyxDQUE0QyxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQztZQUMxQixRQUFRLEVBQUUsS0FBSztZQUNmLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztTQUM1QixDQUFDLENBQUE7SUFDTixDQUFDLENBQUE7SUFFWSw4QkFBaUIsR0FBRyxVQUFTLElBQWdCLEVBQUUsU0FBaUI7UUFDekUsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM3QixJQUFJLFVBQVUsR0FBRyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQ3hDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFFZixPQUFPLENBQUMsRUFBRSxHQUFHLFNBQVMsRUFBRSxDQUFDO1lBQ3JCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLE1BQU0sSUFBSSxVQUFVLENBQUM7UUFDekIsQ0FBQztRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQyxDQUFBO0lBRVksc0JBQVMsR0FBRyxVQUFTLElBQWdCLEVBQUUsU0FBaUI7UUFDakUsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ2xCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLE1BQU0sRUFBRSxJQUFJO1lBQ1osU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1NBQzVCLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQTtJQUVZLHFDQUF3QixHQUFHLFVBQVMsT0FBd0IsRUFBRSxVQUEyQjtRQUVsRyxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ3JDLElBQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUMzQyxNQUFNLENBQUMsVUFBUyxTQUFzQjtZQUNsQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUM7WUFDL0QsSUFBSSxXQUFXLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLENBQUM7WUFDeEUsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksSUFBSSxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDMUMsTUFBTSwrQ0FBK0MsR0FBRyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDakYsQ0FBQztZQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLENBQUMsQ0FBQTtJQUNMLENBQUMsQ0FBQTtJQUlZLHlCQUFZLEdBQUc7UUFDeEIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDM0IsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN0QyxDQUFDO1FBQ0Qsd0JBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNoQyx3QkFBVyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFFOUIsQ0FBQyxDQUFBO0lBRVksdUJBQVUsR0FBRyxVQUFTLENBQWMsRUFBRSxDQUFjO1FBQzdELElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUMzQiwwQkFBMEI7UUFDMUIsWUFBWSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDLENBQUE7SUFFWSxtQkFBTSxHQUFHLFVBQVMsS0FBa0IsRUFBRSxLQUFhO1FBQzVELDZDQUE2QztRQUM3QyxJQUFJLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDckIsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDdkIsTUFBTSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDM0IsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLDRDQUE0QztRQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUMsQ0FBQTtJQUVZLHFCQUFRLEdBQUcsVUFBUyxJQUFvQixFQUFFLFNBQWtCO1FBQ3JFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNwQyxHQUFHLENBQUMsQ0FBVSxVQUFhLEVBQWIsS0FBQSxJQUFJLENBQUMsUUFBUSxFQUFiLGNBQWEsRUFBYixJQUFhLENBQUM7Z0JBQXZCLElBQUksQ0FBQyxTQUFBO2dCQUNOLFlBQVksQ0FBQyxRQUFRLENBQWlCLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUN2RDtRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNTLElBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0MsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVEOztPQUVHO0lBQ1UsK0JBQWtCLEdBQUcsVUFBUyxJQUFnQixFQUFFLFNBQXFDO1FBQzlGLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3RELENBQUMsQ0FBQTtJQUVEOztPQUVHO0lBQ1UseUJBQVksR0FBRyxVQUFTLElBQWdCLEVBQUUsU0FBcUM7UUFDeEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsSUFBSSxLQUFpQixDQUFDO1FBQ3RCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsT0FBTyxRQUFRLElBQUksUUFBUSxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDcEIsQ0FBQztZQUNELEtBQUssR0FBRyxRQUFRLENBQUM7WUFDakIsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDL0IsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFBO0lBRUQ7O09BRUc7SUFDVSxvQkFBTyxHQUFHLFVBQVMsSUFBcUI7UUFDakQsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzVFLENBQUMsQ0FBQTtJQUVEOztPQUVHO0lBQ1UscUJBQVEsR0FBRyxVQUFTLENBQWMsRUFBRSxDQUFjO1FBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFBO0lBRVkseUJBQVksR0FBRyxVQUFTLE9BQXNCO1FBQ3ZELE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRixDQUFDLENBQUE7SUFFRDs7T0FFRztJQUNVLHlCQUFZLEdBQUcsVUFBUyxJQUFnQjtRQUNqRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBRTdCLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBQSxFQUFFO1lBQ2pDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdkMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsbURBQW1ELEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3pGLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUM1QixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7Z0JBQzVCLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFTLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLENBQUM7WUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU1QyxHQUFHLENBQUMsa0NBQWtDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFTLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRXZDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFBLEVBQUU7WUFDL0IsR0FBRyxDQUFDLHFCQUFxQixFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNyQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxtREFBbUQsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDekYsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEVBQUUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzVCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7Z0JBQzdCLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFTLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBUyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLENBQUM7WUFFRCxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQTtJQUVZLHNCQUFTLEdBQUc7UUFFckI7O1dBRUc7UUFDSCxjQUFjLEVBQUUsZ0JBQWdCO1FBRWhDOztXQUVHO1FBQ0gsYUFBYSxFQUFFLGVBQWU7UUFFOUI7O1dBRUc7UUFDSCxZQUFZLEVBQUUsY0FBYztRQUU1Qjs7O1dBR0c7UUFDSCxnQkFBZ0IsRUFBRSxrQkFBa0I7S0FDdkMsQ0FBQTtBQUNMLENBQUMsRUEzT1MsWUFBWSxLQUFaLFlBQVksUUEyT3JCO0FDbE9ELElBQVUsV0FBVyxDQXdIcEI7QUF4SEQsV0FBVSxXQUFXLEVBQUMsQ0FBQztJQUVuQixXQUFZLFVBQVU7UUFDbEIsb0VBQW9FO1FBQ3BFLDRFQUE0RTtRQUM1RSx1REFBZ0IsQ0FBQTtRQUNoQixrQ0FBa0M7UUFDbEMsbURBQWMsQ0FBQTtRQUNkLHNFQUFzRTtRQUN0RSxVQUFVO1FBQ1YscURBQWUsQ0FBQTtRQUNmLCtCQUErQjtRQUMvQixtREFBYyxDQUFBO1FBQ2Qsc0VBQXNFO1FBQ3RFLHNFQUFzRTtRQUN0RSxvREFBZSxDQUFBO1FBQ2Ysb0NBQW9DO1FBQ3BDLGdEQUFhLENBQUE7UUFDYixvQ0FBb0M7UUFDcEMsOENBQVksQ0FBQTtRQUNaLDJFQUEyRTtRQUMzRSx1REFBZ0IsQ0FBQTtRQUNoQixlQUFlO1FBQ2YsbURBQWUsQ0FBQTtRQUNmLGdCQUFnQjtRQUNoQixpREFBYyxDQUFBO1FBQ2QscUNBQXFDO1FBQ3JDLHNEQUFnQixDQUFBO1FBQ2hCLGdDQUFnQztRQUNoQyw4Q0FBWSxDQUFBO0lBQ2hCLENBQUMsRUE1Qlcsc0JBQVUsS0FBVixzQkFBVSxRQTRCckI7SUE1QkQsSUFBWSxVQUFVLEdBQVYsc0JBNEJYLENBQUE7SUFFRCxpRUFBaUU7SUFDakUsV0FBWSxPQUFPO1FBQ2Ysc0VBQXNFO1FBQ3RFLGtCQUFrQjtRQUNsQiw4Q0FBNEUsQ0FBQTtRQUM1RSw0RUFBNEU7UUFDNUUsK0NBQXdELENBQUE7UUFDeEQsNkNBQXNELENBQUE7UUFDdEQsOENBQTRFLENBQUE7UUFDNUUsMENBQXFFLENBQUE7UUFDckUsd0NBQWdELENBQUE7UUFDaEQsaURBQXdELENBQUE7UUFDeEQsNkNBQTBFLENBQUE7UUFDMUUsMkNBQWtELENBQUE7UUFDbEQsd0NBQThDLENBQUE7SUFDbEQsQ0FBQyxFQWRXLG1CQUFPLEtBQVAsbUJBQU8sUUFjbEI7SUFkRCxJQUFZLE9BQU8sR0FBUCxtQkFjWCxDQUFBO0lBQUEsQ0FBQztJQUVGO1FBRUksd0JBQXdCO1FBQ3hCLElBQU0sU0FBUyxHQUFTLEtBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzlDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsVUFBUyxPQUEwQjtZQUFuQyxpQkFhckI7WUFaRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztZQUMzQixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUNELE1BQU0sQ0FBQztnQkFDSCxJQUFJLEtBQUssR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2IsS0FBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO1lBQ0wsQ0FBQyxDQUFBO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsbUJBQW1CO1FBQ25CLElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDcEMsU0FBUyxDQUFDLE1BQU0sR0FBRztZQUNmLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQzdCLENBQUMsQ0FBQTtRQUVELHdCQUF3QjtRQUN4QixJQUFNLFlBQVksR0FBUSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNsRCxJQUFNLGNBQWMsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQzdDLFlBQVksQ0FBQyxRQUFRLEdBQUcsVUFBUyxLQUFpQixFQUFFLElBQWdCO1lBQ2hFLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBTSxJQUFJLEdBQVMsSUFBSyxDQUFDLFlBQVksQ0FBQztnQkFDdEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDUCxHQUFHLENBQUMsQ0FBVSxVQUFJLEVBQUosYUFBSSxFQUFKLGtCQUFJLEVBQUosSUFBSSxDQUFDO3dCQUFkLElBQUksQ0FBQyxhQUFBO3dCQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO3FCQUN2QjtnQkFDTCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQTtJQUNMLENBQUM7SUF4Q2Usc0JBQVUsYUF3Q3pCLENBQUE7SUFFRCxrQkFBeUIsS0FBaUI7UUFDdEMsSUFBSSxRQUFRLEdBQWEsRUFBRSxDQUFDO1FBQzVCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFVBQUMsS0FBSyxFQUFFLEdBQUc7WUFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQVJlLG9CQUFRLFdBUXZCLENBQUE7SUFFRCxpQkFBd0IsSUFBZ0IsRUFBRSxLQUFpQjtRQUd2RCxJQUFJLEtBQWlCLENBQUM7UUFDdEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQ2pDLFVBQUEsVUFBVTtZQUNOLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztnQkFDcEIsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFBLENBQUM7b0JBQ1YsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLEVBQ0QsVUFBQSxhQUFhO1lBQ1QsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQztnQkFDTixLQUFLLEVBQUUsQ0FBQztZQUNaLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFqQmUsbUJBQU8sVUFpQnRCLENBQUE7QUFFTCxDQUFDLEVBeEhTLFdBQVcsS0FBWCxXQUFXLFFBd0hwQjtBQUVELFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQ3hJekIsSUFBTyxLQUFLLENBZ0JYO0FBaEJELFdBQU8sS0FBSyxFQUFDLENBQUM7SUFFQyxlQUFTLEdBQUc7UUFDbkIsS0FBSyxFQUFFLE9BQU87UUFDZCxTQUFTLEVBQUUsV0FBVztRQUN0QixPQUFPLEVBQUUsU0FBUztRQUNsQixTQUFTLEVBQUUsV0FBVztRQUN0QixLQUFLLEVBQUUsT0FBTztRQUNkLFdBQVcsRUFBRSxhQUFhO1FBQzFCLFNBQVMsRUFBRSxXQUFXO1FBQ3RCLFVBQVUsRUFBRSxZQUFZO1FBQ3hCLFVBQVUsRUFBRSxZQUFZO1FBQ3hCLEtBQUssRUFBRSxPQUFPO1FBQ2QsT0FBTyxFQUFFLFNBQVM7S0FDckIsQ0FBQTtBQUVMLENBQUMsRUFoQk0sS0FBSyxLQUFMLEtBQUssUUFnQlg7QUNoQkQsc0JBQXNCO0FBRXRCLG9EQUFvRDtBQUNwRCw2QkFBNkI7QUFFN0Isd0VBQXdFO0FBQ3hFLG1DQUFtQztBQUNuQyw4QkFBOEI7QUFDOUIsUUFBUTtBQUVSLG9DQUFvQztBQUNwQyxzRUFBc0U7QUFDdEUsUUFBUTtBQUVSLHlCQUF5QjtBQUN6QixtREFBbUQ7QUFDbkQsUUFBUTtBQUVSLHNFQUFzRTtBQUN0RSxnRUFBZ0U7QUFDaEUsUUFBUTtBQUVSLGtEQUFrRDtBQUNsRCw4RUFBOEU7QUFDOUUsUUFBUTtBQUVSLGlFQUFpRTtBQUNqRSw4RUFBOEU7QUFDOUUsUUFBUTtBQUNSLElBQUk7QUNoQkosTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLE9BQTZCO0lBQ25ELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztJQUNoQixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQzlCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFFMUIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQ2pDLG9CQUFvQixDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2xCLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLEtBQUssRUFBRSxLQUFLO1lBQ1osUUFBUSxFQUFFLENBQUM7U0FDZCxDQUFDLENBQUM7SUFDUCxDQUFDLEVBQ0Qsb0JBQW9CLENBQUMsRUFBRSxHQUFHO1FBQ3RCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN0QixDQUFDLENBQ0osQ0FBQztBQUNOLENBQUMsQ0FBQztBQUVGLG1DQUFtQztBQUM3QixNQUFPLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxVQUFTLEtBQWE7SUFDdEUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBRWhCLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUNqQyxvQkFBb0IsQ0FBQztRQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7WUFDdEIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLEtBQUssRUFBRSxLQUFLO1lBQ1osUUFBUSxFQUFFLENBQUM7U0FDZCxDQUFDLENBQUM7SUFDUCxDQUFDLEVBQ0Qsb0JBQW9CLENBQUMsRUFBRSxHQUFHO1FBQ3RCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN0QixDQUFDLENBQ0osQ0FBQztBQUNOLENBQUMsQ0FBQztBQ2hERixJQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO0FDQS9CO0lBQUE7SUFFQSxDQUFDO0lBQUQsZ0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQ0VEO0lBQUE7SUFnRUEsQ0FBQztJQTlERzs7T0FFRztJQUNJLHdCQUFZLEdBQW5CLFVBQ0ksSUFBMEIsRUFDMUIsU0FBc0I7UUFFdEIsSUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQztRQUN4QixJQUFJLE9BQU8sR0FBd0IsU0FBUyxDQUFDO1FBQzdDLElBQU0sSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBUyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHO1lBQ2QsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQzVCLDBEQUEwRDtZQUU5QyxZQUFZO1lBQ1osSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNwQyxFQUFFLENBQUEsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBLENBQUM7Z0JBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUN4QixDQUFDO1lBRUQsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUNsQixJQUFJLENBQUMsTUFBTSxDQUFRLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7O09BRUc7SUFDSSwyQkFBZSxHQUF0QixVQUNJLFNBQStCLEVBQy9CLFNBQThCO1FBRTlCLElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUN4QixJQUFJLElBQUksR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQVMsQ0FBQztRQUNuQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFBLEdBQUc7WUFDeEIsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQ2hCLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQVEsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7T0FFRztJQUNJLHNCQUFVLEdBQWpCLFVBQ0ksU0FBOEIsRUFDOUIsTUFBd0IsRUFDeEIsTUFBMEI7UUFFMUIsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDO1FBQ3hCLElBQUksSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBUyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJO1lBQ2pCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QixFQUFFLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDakIsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBUSxPQUFPLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVMLGtCQUFDO0FBQUQsQ0FBQyxBQWhFRCxJQWdFQztBQ3JFRCw4R0FBOEc7QUFDOUcsd0ZBQXdGO0FBQ3hGLDRDQUE0QztBQUM1Qyx3RkFBd0Y7QUFDeEYsaUVBQWlFO0FBQ2pFLHFFQUFxRTtBQUNyRSxtRkFBbUY7QUFDbkYsc0ZBQXNGO0FBRXRGO0lBS0ksdUJBQ0ksS0FBWSxFQUNaLFlBQTBCLEVBQzFCLGtCQUFzQztRQVI5QyxpQkE2Q0M7UUFuQ08sSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUVyRCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQXBDLENBQW9DLENBQUMsQ0FBQztRQUM1RCxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQXJDLENBQXFDLENBQUMsQ0FBQztRQUU5RCxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDO1lBRS9DLEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDO2dCQUNuRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNWLDBCQUEwQjtvQkFDMUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ2pDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FDMUIsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3pFLENBQUM7Z0JBRUQsd0NBQXdDO2dCQUN4QyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxLQUFLO29CQUNuRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUM3QyxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFBLEVBQUU7WUFDN0IsT0FBQSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQWpFLENBQWlFLENBQ3BFLENBQUM7UUFFRixNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBQSxFQUFFO1lBQ2xDLE9BQUEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUFqRSxDQUFpRSxDQUNwRSxDQUFDO0lBQ04sQ0FBQztJQUVMLG9CQUFDO0FBQUQsQ0FBQyxBQTdDRCxJQTZDQztBQ3JERDtJQUFzQiwyQkFBb0I7SUFBMUM7UUFBc0IsOEJBQW9CO1FBRXRDLFFBQUcsR0FBRztZQUNGOztlQUVHO1lBQ0gsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBTyx1QkFBdUIsQ0FBQztZQUU1RDs7ZUFFRztZQUNILGlCQUFpQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQU8sdUJBQXVCLENBQUM7WUFFNUQsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVMsY0FBYyxDQUFDO1NBQy9DLENBQUM7UUFFRixhQUFRLEdBQUc7WUFDUCxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBTyxvQkFBb0IsQ0FBQztZQUNqRCxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBTyxzQkFBc0IsQ0FBQztZQUN4RCxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBTyxvQkFBb0IsQ0FBQztZQUNqRCxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBTyxvQkFBb0IsQ0FBQztZQUNqRCxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBa0Isc0JBQXNCLENBQUM7U0FDbkUsQ0FBQTtRQUVELFdBQU0sR0FBRztZQUNMLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFhLGVBQWUsQ0FBQztZQUMvQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBYSxtQkFBbUIsQ0FBQztZQUN2RCxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBc0IsdUJBQXVCLENBQUM7WUFDeEUsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQXFCLHFCQUFxQixDQUFDO1NBQ3RFLENBQUM7UUFFRixjQUFTLEdBQUc7WUFDUixHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSxlQUFlLENBQUM7WUFDM0MsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVksc0JBQXNCLENBQUM7WUFDekQsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVkseUJBQXlCLENBQUM7WUFDL0QsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVksa0JBQWtCLENBQUM7U0FDcEQsQ0FBQztJQUVOLENBQUM7SUFBRCxjQUFDO0FBQUQsQ0FBQyxBQXRDRCxDQUFzQixZQUFZLENBQUMsT0FBTyxHQXNDekM7QUFFRDtJQUFxQiwwQkFBb0I7SUFBekM7UUFBcUIsOEJBQW9CO1FBRXJDLFFBQUcsR0FBRztZQUNGLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFVLG9CQUFvQixDQUFDO1lBQ3pELGdDQUFnQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVUsc0NBQXNDLENBQUM7WUFDN0Ysb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBZ0IsMEJBQTBCLENBQUM7WUFDM0UsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQWdCLGdCQUFnQixDQUFDO1NBQzFELENBQUE7UUFFRCxhQUFRLEdBQUc7WUFDUCxrQkFBa0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFPLDZCQUE2QixDQUFDO1lBQ25FLGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQU8sNkJBQTZCLENBQUM7WUFDbkUsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBTyw2QkFBNkIsQ0FBQztZQUNuRSxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBa0Isc0JBQXNCLENBQUM7U0FDbkUsQ0FBQztRQUVGLFdBQU0sR0FBRztZQUNMLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFTLGVBQWUsQ0FBQztZQUMzQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBUyxvQkFBb0IsQ0FBQztZQUNyRCxrQkFBa0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFzQiwyQkFBMkIsQ0FBQztZQUNoRixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFxQix5QkFBeUIsQ0FBQztZQUMzRSxrQkFBa0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFPLHFDQUFxQyxDQUFDO1NBQzlFLENBQUM7UUFFRixjQUFTLEdBQUc7WUFDUixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSxpQkFBaUIsQ0FBQztZQUMvQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSx1QkFBdUIsQ0FBQztZQUMzRCxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSwwQkFBMEIsQ0FBQztZQUNqRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSxtQkFBbUIsQ0FBQztZQUNuRCxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSxrQkFBa0IsQ0FBQztZQUNqRCxZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSx3QkFBd0IsQ0FBQztTQUNoRSxDQUFDO0lBRU4sQ0FBQztJQUFELGFBQUM7QUFBRCxDQUFDLEFBakNELENBQXFCLFlBQVksQ0FBQyxPQUFPLEdBaUN4QztBQUVEO0lBQUE7UUFDSSxZQUFPLEdBQVksSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNqQyxXQUFNLEdBQVcsSUFBSSxNQUFNLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBQUQsZUFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FDOUVEO0lBQUE7SUF3REEsQ0FBQztJQXRERywwQ0FBYSxHQUFiLFVBQWMsUUFBMEM7UUFDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNILEdBQUcsRUFBRSx5QkFBeUI7WUFDOUIsUUFBUSxFQUFFLE1BQU07WUFDaEIsS0FBSyxFQUFFLElBQUk7WUFDWCxPQUFPLEVBQUUsVUFBQyxRQUErQztnQkFDckQsa0JBQWtCO2dCQUNsQjtvQkFDSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsVUFBQyxHQUFXLEVBQUUsR0FBVTt3QkFDeEMsRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQSxDQUFDOzRCQUMzQixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUNwRCxDQUFDO29CQUNMLENBQUMsQ0FBQyxDQUFDOztnQkFMUCxHQUFHLENBQUEsQ0FBYyxVQUFjLEVBQWQsS0FBQSxRQUFRLENBQUMsS0FBSyxFQUFkLGNBQWMsRUFBZCxJQUFjLENBQUM7b0JBQTVCLElBQU0sR0FBRyxTQUFBOztpQkFNWjtnQkFFRCxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFDRCxLQUFLLEVBQUUsVUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUc7Z0JBQ3BCLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELENBQUM7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsMkNBQWMsR0FBZCxVQUFlLFFBQTBDO1FBQ3JELElBQUksR0FBRyxHQUFHLGtEQUFrRCxDQUFDO1FBQzdELElBQUksR0FBRyxHQUFHLG9CQUFvQixDQUFDO1FBQy9CLElBQUksSUFBSSxHQUFHLFlBQVksQ0FBQztRQUN4QixJQUFJLEdBQUcsR0FBRyxPQUFPLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUMvQixJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUUxQixDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ0gsR0FBRyxFQUFFLEdBQUc7WUFDUixRQUFRLEVBQUUsTUFBTTtZQUNoQixLQUFLLEVBQUUsSUFBSTtZQUNYLE9BQU8sRUFBRSxVQUFDLFFBQStDO2dCQUNyRCxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFDRCxLQUFLLEVBQUUsVUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUc7Z0JBQ3BCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUMvQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDJDQUFjLEdBQWQsVUFBZSxRQUFrQjtRQUM3QixHQUFHLENBQUMsQ0FBZ0IsVUFBcUIsRUFBckIsS0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBckIsY0FBcUIsRUFBckIsSUFBcUIsQ0FBQztZQUFyQyxJQUFNLEtBQUssU0FBQTtZQUNaLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ1QsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsTUFBTSxFQUFFO29CQUNKLFFBQVEsRUFBWSxLQUFLO29CQUN6QixJQUFJLEVBQUUsZ0VBQWdFO2lCQUN6RTthQUNKLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUNMLHlCQUFDO0FBQUQsQ0FBQyxBQXhERCxJQXdEQztBQ3RERDtJQU1JLHFCQUFZLFVBQTRCO1FBSnhDLFVBQUssR0FBc0MsRUFBRSxDQUFDO1FBSzFDLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0lBQ2xDLENBQUM7SUFFRCx5QkFBRyxHQUFILFVBQUksT0FBZSxFQUFFLE9BQWdDO1FBQXJELGlCQWlCQztRQWpCb0IsdUJBQWdDLEdBQWhDLGNBQWdDO1FBQ2pELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNQLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFDLEdBQUcsRUFBRSxJQUFJO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQzNCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNsQyxLQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQUFDLEFBNUJELElBNEJDO0FDOUJELElBQVUsUUFBUSxDQW9DakI7QUFwQ0QsV0FBVSxRQUFRLEVBQUMsQ0FBQztJQUVoQjs7T0FFRztJQUNILGdCQUF1QixRQUFnQixFQUFFLFFBQWdCLEVBQUUsSUFBVTtRQUNqRSxJQUFNLE9BQU8sR0FBRyx3QkFBc0IsUUFBUSxtQkFBYyxRQUFVLENBQUM7UUFDdkUsaUJBQWlCO1FBQ2pCLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2FBQ2IsSUFBSSxDQUFDLFVBQUEsWUFBWTtZQUVkLFdBQVc7WUFDWCxJQUFNLFVBQVUsR0FBRztnQkFDZixNQUFNLEVBQUUsS0FBSztnQkFDYixHQUFHLEVBQUUsWUFBWSxDQUFDLGNBQWM7Z0JBQ2hDLE9BQU8sRUFBRTtvQkFDTCxXQUFXLEVBQUUsYUFBYTtpQkFDN0I7Z0JBQ0QsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsV0FBVyxFQUFFLEtBQUs7Z0JBQ2xCLFdBQVcsRUFBRSxRQUFRO2FBQ3hCLENBQUM7WUFDRixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztpQkFDakIsSUFBSSxDQUFDLFVBQUEsV0FBVztnQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDbEQsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxVQUFBLEdBQUc7Z0JBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVQLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxVQUFBLEdBQUc7WUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQTdCZSxlQUFNLFNBNkJyQixDQUFBO0FBRUwsQ0FBQyxFQXBDUyxRQUFRLEtBQVIsUUFBUSxRQW9DakI7QUNwQ0Q7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0g7SUFxQkk7UUFyQkosaUJBZ1RDO1FBelNHLFVBQUssR0FBRztZQUNKLFFBQVEsRUFBaUI7Z0JBQ3JCLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFO2FBQzlCO1lBQ0QsVUFBVSxFQUFtQixFQUFFO1NBQ2xDLENBQUE7UUFDRCxjQUFTLEdBQUc7WUFDUixZQUFZLEVBQTBCLEVBQUU7WUFDeEMsV0FBVyxFQUFFLElBQUksV0FBVyxDQUFDLFVBQUMsR0FBRyxFQUFFLElBQUk7Z0JBQ25DLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFBekMsQ0FBeUMsQ0FBQztTQUNqRCxDQUFBO1FBQ0QsWUFBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDeEIsV0FBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFHbEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFMUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxrQ0FBa0IsR0FBbEI7UUFBQSxpQkF1TEM7UUF0TEcsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUVuRCxrQkFBa0I7UUFFbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUU7YUFHbEMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUMsQ0FBQzthQUN0RSxTQUFTLENBQUMsVUFBQSxDQUFDO1lBQ1IsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBRXBCLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLGdCQUFnQjtnQkFDaEIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3ZELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBTSxNQUFNLEdBQWtCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDdEQsbUJBQW1CO29CQUNuQixLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7b0JBQzdCLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO29CQUMxQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzFELEdBQUcsQ0FBQyxDQUFhLFVBQXFDLEVBQXJDLEtBQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBckMsY0FBcUMsRUFBckMsSUFBcUMsQ0FBQzt3QkFBbEQsSUFBTSxFQUFFLFNBQUE7d0JBQ1QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUN4QztvQkFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUM5QyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDM0MsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDbkIsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQztRQUVQLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxnQkFBZ0I7Z0JBQ2hCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDbEYsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDO1lBQzVCLE9BQUEsS0FBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFBdEMsQ0FBc0MsQ0FBQyxDQUFDO1FBRTVDLHVCQUF1QjtRQUV2QixPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQzlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUV4QyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDO1lBQ2xDLEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDO1lBQ2xDLEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDO1lBQ3BDLHdEQUF3RDtZQUN4RCw2QkFBNkI7WUFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFxQjtRQUVyQixPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU07YUFDaEIsU0FBUyxDQUFDLFVBQUMsQ0FBQztZQUNULEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDakQsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7WUFDM0IsS0FBSyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxJQUFJLFNBQVMsQ0FBQztZQUMzRCxLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUUvQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUU5QyxLQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUUvRSxLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTFCLEtBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBRVAsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVO2FBQ3BCLFNBQVMsQ0FBQyxVQUFBLEVBQUU7WUFDVCxLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUM5QixLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQyxLQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUVQLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7WUFDckMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDO1lBQ25DLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO1FBR0gsd0JBQXdCO1FBRXhCLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRzthQUNoQixTQUFTLENBQUMsVUFBQSxFQUFFO1lBQ1QsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUxQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELElBQUksS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFlLENBQUM7WUFDMUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7WUFDekIsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFBO1lBQzVCLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDakIsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1lBQ2hFLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDaEUsQ0FBQztZQUVELEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QyxLQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUVQLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVTthQUN2QixTQUFTLENBQUMsVUFBQSxFQUFFO1lBQ1QsSUFBSSxLQUFLLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxPQUFLLEdBQWM7b0JBQ25CLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUk7b0JBQ2xCLGVBQWUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWU7b0JBQ3hDLFNBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVM7b0JBQzVCLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQzFCLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVE7aUJBQzdCLENBQUM7Z0JBQ0YsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBSyxDQUFDLENBQUM7Z0JBQzFCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNqQixLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7Z0JBQ2hFLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM3QyxLQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFUCxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU07YUFDbkIsU0FBUyxDQUFDLFVBQUEsRUFBRTtZQUNULElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN0QixDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsVUFBQSxFQUFFO2dCQUM5QyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDekIsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDakIsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEIsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4RCxLQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztnQkFDNUIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFUCxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWE7YUFDMUIsU0FBUyxDQUFDLFVBQUEsRUFBRTtZQUNULElBQUksS0FBSyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNSLEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ2xDLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDaEQsS0FBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDaEMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELDZCQUFhLEdBQWI7UUFBQSxpQkFnQkM7UUFmRyxJQUFNLE1BQU0sR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDeEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFBLFFBQVE7WUFDekIsUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO1lBQ3hDLElBQU0sSUFBSSxHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDO1lBQ3pDLEdBQUcsQ0FBQyxDQUFzQixVQUFRLEVBQVIscUJBQVEsRUFBUixzQkFBUSxFQUFSLElBQVEsQ0FBQztnQkFBOUIsSUFBTSxXQUFXLGlCQUFBO2dCQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQzthQUMxQztZQUVELHNDQUFzQztZQUN0QyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxFQUFSLENBQVEsQ0FBQyxDQUFDLENBQUM7WUFFbkQsS0FBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBRXZELEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsb0NBQW9CLEdBQXBCO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELHNCQUFNLEdBQU4sVUFBVSxJQUFPLEVBQUUsTUFBUztRQUN4QixDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsNEJBQVksR0FBWjtRQUNJLE1BQU0sQ0FBQztZQUNILEdBQUcsRUFBRSxLQUFLLEVBQUU7WUFDWixlQUFlLEVBQUU7Z0JBQ2IsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLE9BQU8sRUFBRSxJQUFJO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLEdBQUcsRUFBRSxLQUFLLENBQUMsZ0JBQWdCO2FBQzlCO1lBQ0QsVUFBVSxFQUFlLEVBQUU7U0FDOUIsQ0FBQztJQUNOLENBQUM7SUFFTyw0QkFBWSxHQUFwQixVQUFxQixJQUF3QjtRQUN6QywwQkFBMEI7UUFDMUIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQztZQUNMLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVM7bUJBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUM7Z0JBQzNELE1BQU0sQ0FBQztZQUNYLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixFQUFFLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQztZQUNYLENBQUM7UUFDTCxDQUFDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVPLDhCQUFjLEdBQXRCLFVBQXVCLElBQXlCO1FBQzVDLDBCQUEwQjtRQUMxQixFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDO1lBQ0wsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsV0FBVzttQkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQztnQkFDN0QsTUFBTSxDQUFDO1lBQ1gsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxDQUFDO1lBQ1gsQ0FBQztRQUNMLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLGlDQUFpQztZQUVqQyxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxLQUFLLFdBQVcsQ0FBQyxDQUFBLENBQUM7Z0JBQzNELElBQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BGLEVBQUUsQ0FBQSxDQUFDLG1CQUFtQixDQUFDLENBQUEsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNyRSxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFFRCxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDO1lBQ0wsdUNBQXVDO1lBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFTyx3QkFBUSxHQUFoQixVQUFpQixFQUFVO1FBQ3ZCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBYixDQUFhLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBN1NNLHNCQUFnQixHQUFHLHNCQUFzQixDQUFDO0lBQzFDLGtCQUFZLEdBQUcsNEJBQTRCLENBQUM7SUFDNUMsdUJBQWlCLEdBQUcsUUFBUSxDQUFDO0lBQzdCLHFCQUFlLEdBQUcsR0FBRyxDQUFDO0lBMlNqQyxZQUFDO0FBQUQsQ0FBQyxBQWhURCxJQWdUQztBRTdURCxJQUFNLGFBQWEsR0FBRztJQUVsQixXQUFXLFlBQUMsTUFBYztRQUN0QixJQUFJLE1BQU0sR0FBRyxDQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUUsQ0FBQztRQUN4QyxHQUFHLENBQUEsQ0FBZ0IsVUFBaUIsRUFBakIsS0FBQSxNQUFNLENBQUMsVUFBVSxFQUFqQixjQUFpQixFQUFqQixJQUFpQixDQUFDO1lBQWpDLElBQU0sS0FBSyxTQUFBO1lBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDaEM7UUFDRCxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxJQUFJLElBQUksRUFBVCxDQUFTLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNkLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztDQUVKLENBQUE7QUVkRCxJQUFVLFdBQVcsQ0FrR3BCO0FBbEdELFdBQVUsV0FBVyxFQUFDLENBQUM7SUFFbkIsSUFBTSxlQUFlLEdBQUc7UUFDcEI7WUFDSSw2Q0FBNkM7WUFDN0MsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7U0FDWjtRQUNEO1lBQ0ksNkNBQTZDO1lBQzdDLFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1NBQ1o7UUFDRDtZQUNJLDZDQUE2QztZQUM3QyxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztTQUNaO1FBQ0Q7WUFDSSw2Q0FBNkM7WUFDN0MsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7U0FDWjtRQUNEO1lBQ0ksNkNBQTZDO1lBQzdDLFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1NBQ1o7UUFDRDtZQUNJLDZDQUE2QztZQUM3QyxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztTQUNaO1FBQ0Q7WUFDSSw2Q0FBNkM7WUFDN0MsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7U0FDWjtRQUNEO1lBQ0ksOENBQThDO1lBQzlDLFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1NBQ1o7UUFDRDtZQUNJLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1NBQ3pDO0tBQ0osQ0FBQztJQUVGLGVBQXNCLElBQUksRUFBRSxTQUFtQixFQUFFLFFBQVE7UUFDckQsSUFBTSxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFekQsSUFBSSxHQUFHLEdBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxRQUFRLENBQUM7WUFDcEIsU0FBUyxFQUFFLElBQUk7WUFDZixVQUFVLEVBQUUsSUFBSTtZQUNoQixlQUFlLEVBQUUsS0FBSztZQUN0QixXQUFXLEVBQUUsS0FBSztZQUNsQixTQUFTLEVBQUUsSUFBSTtZQUNmLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLG9CQUFvQixFQUFFLEtBQUs7WUFDM0IsT0FBTyxFQUFFLE9BQU87WUFDaEIsZUFBZSxFQUFFLFlBQVk7WUFDN0IsTUFBTSxFQUFFLFFBQVE7U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQWpCZSxpQkFBSyxRQWlCcEIsQ0FBQTtJQUFBLENBQUM7SUFFRixhQUFvQixJQUFpQixFQUFFLEtBQWE7UUFDMUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUZlLGVBQUcsTUFFbEIsQ0FBQTtJQUVELGlCQUF3QixJQUFJO1FBQ2xCLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUZlLG1CQUFPLFVBRXRCLENBQUE7QUFDTCxDQUFDLEVBbEdTLFdBQVcsS0FBWCxXQUFXLFFBa0dwQjtBQ2pHRDtJQUVJLDRCQUFZLEtBQVk7UUFFcEIsc0NBQXNDO1FBQ3RDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBUyxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQSxDQUFDO29CQUNuQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2RCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JELENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRUwseUJBQUM7QUFBRCxDQUFDLEFBakJELElBaUJDO0FDSkQ7SUFBeUIsOEJBQWlEO0lBSXRFLG9CQUFZLEtBQXNCO1FBQzlCLGtCQUFNLEtBQUssQ0FBQyxDQUFDO1FBSGpCLG9CQUFlLEdBQUcsTUFBTSxDQUFDO1FBS3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWhCLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUEsQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9GLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUN0RCxDQUFDO0lBQ0wsQ0FBQztJQUVELDJCQUFNLEdBQU47UUFBQSxpQkFpRUM7UUFoRUcsSUFBTSxrQkFBa0IsR0FBRyxVQUFDLE1BQU07WUFDOUIsSUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNoQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRTtnQkFDYixLQUFLLEVBQUU7b0JBQ0gsWUFBQSxVQUFVO29CQUNWLFFBQVEsRUFBRSxLQUFJLENBQUMsZUFBZTtpQkFDakM7YUFDSixFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNyQixDQUFDLENBQUM7UUFDRixJQUFNLG1CQUFtQixHQUFHLFVBQUMsTUFBTTtZQUMvQixJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pDLElBQU0sS0FBSyxHQUFRLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3hGLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQztZQUN0QyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQUEsS0FBSyxFQUFFLEVBQ3ZCLENBQUMsQ0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLFNBQUksTUFBTSxDQUFDLEtBQUssQ0FBRSxDQUFDLENBQUMsQ0FBQztRQUM5RCxDQUFDLENBQUM7UUFFRixNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFDZjtZQUNJLFNBQVMsRUFBRSxhQUFhO1NBQzNCLEVBQ0Q7WUFDSSxFQUFFLENBQUMsV0FBVyxFQUFFO2dCQUNaLElBQUksRUFBRSxhQUFhO2dCQUNuQixHQUFHLEVBQUUsYUFBYTtnQkFDbEIsU0FBUyxFQUFFLGFBQWE7Z0JBQ3hCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNO2dCQUNoRSxTQUFTLEVBQUUsS0FBSztnQkFDaEIsT0FBTyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDaEMsY0FBYyxFQUFFLGtCQUFrQjtnQkFDbEMsYUFBYSxFQUFFLGtCQUFrQjtnQkFDakMsUUFBUSxFQUFFLFVBQUMsQ0FBQztvQkFDUixJQUFNLFlBQVksR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRSxJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRO3lCQUN2QyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDLENBQUM7b0JBQzNDLEtBQUksQ0FBQyxRQUFRLENBQUM7d0JBQ1YsY0FBQSxZQUFZO3dCQUNaLFNBQUEsT0FBTztxQkFDVixFQUNELGNBQU0sT0FBQSxLQUFJLENBQUMsb0JBQW9CLEVBQUUsRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2FBQ0osQ0FBQztZQUNGLGtDQUFrQztZQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQ3RFLEVBQUUsQ0FBQyxXQUFXLEVBQUU7b0JBQ1osSUFBSSxFQUFFLGNBQWM7b0JBQ3BCLEdBQUcsRUFBRSxjQUFjO29CQUNuQixTQUFTLEVBQUUsY0FBYztvQkFDekIsU0FBUyxFQUFFLEtBQUs7b0JBQ2hCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU87b0JBQ3pCLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQzt3QkFDdEUsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQ2xDLENBQUMsQ0FBQztvQkFDRixjQUFjLEVBQUUsbUJBQW1CO29CQUNuQyxhQUFhLEVBQUUsbUJBQW1CO29CQUNsQyxRQUFRLEVBQUUsVUFBQyxLQUFLO3dCQUNaLEtBQUksQ0FBQyxRQUFRLENBQUM7NEJBQ1YsWUFBWSxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTs0QkFDckMsT0FBTyxFQUFFLEtBQUs7eUJBQ2pCLEVBQ0csY0FBTSxPQUFBLEtBQUksQ0FBQyxvQkFBb0IsRUFBRSxFQUEzQixDQUEyQixDQUFFLENBQUM7b0JBQzVDLENBQUM7aUJBQ0osQ0FBQztTQUNMLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyx5Q0FBb0IsR0FBNUI7UUFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUN2QixXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRU8scUNBQWdCLEdBQXhCO1FBQ0ksSUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDO2FBQzVELEdBQUcsQ0FBQyxVQUFDLFVBQXNCLElBQ3RCLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDTCxpQkFBQztBQUFELENBQUMsQUE3RkQsQ0FBeUIsS0FBSyxDQUFDLFNBQVMsR0E2RnZDO0FDMUdEO0lBRUksNEJBQVksU0FBc0IsRUFBRSxLQUFZO1FBRTVDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUM1QixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFDdEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUM3QixDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7WUFFUCxJQUFNLE9BQU8sR0FBd0IsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUU1QyxJQUFNLEtBQUssR0FBRyxPQUFPO21CQUNkLE9BQU8sQ0FBQyxRQUFRLEtBQUssV0FBVzttQkFDaEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUM1QyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssT0FBTyxDQUFDLE1BQU0sRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO1lBRXZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixFQUN4QjtvQkFDSSxLQUFLLEVBQUU7d0JBQ0gsT0FBTyxFQUFFLE1BQU07cUJBQ2xCO2lCQUNKLENBQUMsQ0FBQztZQUNYLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixFQUN4QjtnQkFDSSxLQUFLLEVBQUU7b0JBQ0gsSUFBSSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSTtvQkFDNUIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSTtvQkFDM0IsU0FBUyxFQUFFLENBQUM7aUJBQ2Y7YUFDSixFQUNEO2dCQUNJLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDM0MsQ0FBQyxDQUFDO1FBRVgsQ0FBQyxDQUFDLENBQUM7UUFFSCxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUU5QyxDQUFDO0lBQ0wseUJBQUM7QUFBRCxDQUFDLEFBMUNELElBMENDO0FDMUNEO0lBQTJCLGdDQUFpQjtJQUl4QyxzQkFBWSxTQUFzQixFQUFFLEtBQVk7UUFKcEQsaUJBMkhDO1FBdEhPLGlCQUFPLENBQUM7UUFFUixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FDakMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUMxQixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7YUFDL0IsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBeEMsQ0FBd0MsQ0FBQyxDQUFDO1FBQ3hELFdBQVcsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRXBELENBQUM7SUFFRCw2QkFBTSxHQUFOLFVBQU8sTUFBYztRQUFyQixpQkF5R0M7UUF2R0csSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWxCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ1osQ0FBQyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUM7WUFDeEIsQ0FBQyxDQUFDLGdCQUFnQixFQUFFO2dCQUNoQixFQUFFLEVBQUU7b0JBQ0EsUUFBUSxFQUFFLFVBQUMsRUFBRTt3QkFDVCxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs0QkFDekQsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzs0QkFDMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0NBQ2QsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQ0FDMUQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDOzRCQUN6QixDQUFDO3dCQUNMLENBQUM7b0JBQ0wsQ0FBQztpQkFDSjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0gsSUFBSSxFQUFFLE1BQU07aUJBQ2Y7Z0JBQ0QsS0FBSyxFQUFFO29CQUNILFdBQVcsRUFBRSxzQkFBc0I7aUJBQ3RDO2dCQUNELEtBQUssRUFBRSxFQUNOO2FBQ0osQ0FBQztZQUVGLENBQUMsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDO1lBQzFCLENBQUMsQ0FBQyx3QkFBd0IsRUFDdEI7Z0JBQ0ksS0FBSyxFQUFFO29CQUNILElBQUksRUFBRSxNQUFNO29CQUNaLEtBQUssRUFBRSxNQUFNLENBQUMsZUFBZTtpQkFDaEM7Z0JBQ0QsSUFBSSxFQUFFO29CQUNGLE1BQU0sRUFBRSxVQUFDLEtBQUs7d0JBQ1YsT0FBQSxXQUFXLENBQUMsS0FBSyxDQUNiLEtBQUssQ0FBQyxHQUFHLEVBQ1QsYUFBYSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQzNELFVBQUEsS0FBSzs0QkFDRCxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FDekMsRUFBRSxlQUFlLEVBQUUsS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBQzNELENBQUMsQ0FDSjtvQkFQRCxDQU9DO29CQUNMLE1BQU0sRUFBRSxVQUFDLFFBQVEsRUFBRSxLQUFLO3dCQUNwQixXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUN2RCxDQUFDO29CQUNELE9BQU8sRUFBRSxVQUFDLEtBQUssSUFBSyxPQUFBLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixDQUE4QjtpQkFDckQ7YUFDSixDQUFDO1lBRU4sVUFBVSxDQUFDLFFBQVEsQ0FBQztnQkFDaEIsRUFBRSxFQUFFLFlBQVk7Z0JBQ2hCLE9BQU8sRUFBRSxTQUFTO2dCQUNsQixLQUFLLEVBQUU7b0JBQ0g7d0JBQ0ksT0FBTyxFQUFFLEtBQUs7d0JBQ2QsT0FBTyxFQUFFOzRCQUNMLEtBQUssRUFBRTtnQ0FDSCxLQUFLLEVBQUUsbUJBQW1COzZCQUM3Qjs0QkFDRCxFQUFFLEVBQUU7Z0NBQ0EsS0FBSyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUEzQyxDQUEyQzs2QkFDM0Q7eUJBQ0o7cUJBQ0o7b0JBQ0Q7d0JBQ0ksT0FBTyxFQUFFLGFBQWE7d0JBQ3RCLE9BQU8sRUFBRTs0QkFDTCxLQUFLLEVBQUU7Z0NBQ0gsS0FBSyxFQUFFLHNCQUFzQjs2QkFDaEM7NEJBQ0QsRUFBRSxFQUFFO2dDQUNBLEtBQUssRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBaEQsQ0FBZ0Q7NkJBQ2hFO3lCQUNKO3FCQUNKO29CQUNEO3dCQUNJLE9BQU8sRUFBRSxjQUFjO3dCQUN2QixPQUFPLEVBQUU7NEJBQ0wsS0FBSyxFQUFFO2dDQUNILEtBQUssRUFBRSxzQkFBc0I7NkJBQ2hDOzRCQUNELEVBQUUsRUFBRTtnQ0FDQSxLQUFLLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQWhELENBQWdEOzZCQUNoRTt5QkFDSjtxQkFDSjtvQkFDRDt3QkFDSSxPQUFPLEVBQUUsWUFBWTt3QkFDckIsT0FBTyxFQUFFOzRCQUNMLEtBQUssRUFBRTtnQ0FDSCxLQUFLLEVBQUUsa0NBQWtDOzZCQUM1Qzs0QkFDRCxFQUFFLEVBQUU7Z0NBQ0EsS0FBSyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFoRCxDQUFnRDs2QkFDaEU7eUJBQ0o7cUJBQ0o7aUJBQ0o7YUFDSixDQUFDO1NBRUwsQ0FDQSxDQUFDO0lBQ04sQ0FBQztJQUNMLG1CQUFDO0FBQUQsQ0FBQyxBQTNIRCxDQUEyQixTQUFTLEdBMkhuQztBQzVIRDtJQUE4QixtQ0FBb0I7SUFHOUMseUJBQVksS0FBWTtRQUNwQixpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVELGdDQUFNLEdBQU4sVUFBTyxTQUFvQjtRQUEzQixpQkFpSEM7UUFoSEcsSUFBSSxNQUFNLEdBQUcsVUFBQSxFQUFFO1lBQ1gsRUFBRSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQ3ZCLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxDQUFDLENBQUMsdUJBQXVCLEVBQzVCLEVBQUUsRUFDRjtZQUNJLENBQUMsQ0FBQyxVQUFVLEVBQ1I7Z0JBQ0ksS0FBSyxFQUFFLEVBQ047Z0JBQ0QsS0FBSyxFQUFFO29CQUNILEtBQUssRUFBRSxTQUFTLENBQUMsSUFBSTtpQkFDeEI7Z0JBQ0QsRUFBRSxFQUFFO29CQUNBLFFBQVEsRUFBRSxVQUFDLEVBQWdCO3dCQUN2QixFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs0QkFDekQsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUNwQixNQUFNLENBQUMsRUFBRSxJQUFJLEVBQXdCLEVBQUUsQ0FBQyxNQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzs0QkFDekQsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzVELENBQUM7b0JBQ0wsQ0FBQztvQkFDRCxNQUFNLEVBQUUsVUFBQSxFQUFFLElBQUksT0FBQSxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFqQyxDQUFpQztpQkFDbEQ7YUFDSixDQUFDO1lBRU4sQ0FBQyxDQUFDLEtBQUssRUFDSCxFQUFFLEVBQ0Y7Z0JBQ0ksQ0FBQyxDQUFDLDBCQUEwQixFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxrQkFBa0IsRUFDaEI7b0JBQ0ksS0FBSyxFQUFFO3dCQUNILElBQUksRUFBRSxNQUFNO3FCQUNmO29CQUNELEtBQUssRUFBRTt3QkFDSCxLQUFLLEVBQUUsWUFBWTt3QkFDbkIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxTQUFTO3FCQUM3QjtvQkFDRCxJQUFJLEVBQUU7d0JBQ0YsTUFBTSxFQUFFLFVBQUMsS0FBSzs0QkFDVixPQUFBLFdBQVcsQ0FBQyxLQUFLLENBQ2IsS0FBSyxDQUFDLEdBQUcsRUFDVCxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFDM0QsVUFBQSxLQUFLLElBQUksT0FBQSxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQW5ELENBQW1ELENBQy9EO3dCQUpELENBSUM7d0JBQ0wsT0FBTyxFQUFFLFVBQUMsS0FBSyxJQUFLLE9BQUEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLENBQThCO3FCQUNyRDtpQkFDSixDQUFDO2FBQ1QsQ0FBQztZQUVOLENBQUMsQ0FBQyxLQUFLLEVBQ0gsRUFBRSxFQUNGO2dCQUNJLENBQUMsQ0FBQywwQkFBMEIsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO2dCQUN0QyxDQUFDLENBQUMsd0JBQXdCLEVBQ3RCO29CQUNJLEtBQUssRUFBRTt3QkFDSCxJQUFJLEVBQUUsTUFBTTtxQkFDZjtvQkFDRCxLQUFLLEVBQUU7d0JBQ0gsS0FBSyxFQUFFLGtCQUFrQjt3QkFDekIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxlQUFlO3FCQUNuQztvQkFDRCxJQUFJLEVBQUU7d0JBQ0YsTUFBTSxFQUFFLFVBQUMsS0FBSzs0QkFDVixPQUFBLFdBQVcsQ0FBQyxLQUFLLENBQ2IsS0FBSyxDQUFDLEdBQUcsRUFDVCxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFDM0QsVUFBQSxLQUFLLElBQUksT0FBQSxNQUFNLENBQUMsRUFBRSxlQUFlLEVBQUUsS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQXpELENBQXlELENBQ3JFO3dCQUpELENBSUM7d0JBQ0wsT0FBTyxFQUFFLFVBQUMsS0FBSyxJQUFLLE9BQUEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLENBQThCO3FCQUNyRDtpQkFDSixDQUFDO2FBQ1QsQ0FBQztZQUVOLENBQUMsQ0FBQyx3Q0FBd0MsRUFDdEM7Z0JBQ0ksSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsS0FBSyxFQUFFO29CQUNILEtBQUssRUFBRSxRQUFRO2lCQUNsQjtnQkFDRCxFQUFFLEVBQUU7b0JBQ0EsS0FBSyxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQXZELENBQXVEO2lCQUN0RTthQUNKLEVBQ0Q7Z0JBQ0ksQ0FBQyxDQUFDLGdDQUFnQyxDQUFDO2FBQ3RDLENBQ0o7WUFFRCxDQUFDLENBQUMsMkJBQTJCLEVBQ3pCO2dCQUNJLElBQUksRUFBRTtvQkFDRixNQUFNLEVBQUUsVUFBQyxLQUFLO3dCQUNWLElBQU0sS0FBSyxHQUFvQjs0QkFDM0IsS0FBSyxFQUFFLEtBQUksQ0FBQyxLQUFLOzRCQUNqQixTQUFTLEVBQUUsU0FBUyxDQUFDLFFBQVE7NEJBQzdCLGdCQUFnQixFQUFFLFVBQUMsUUFBUTtnQ0FDdkIsTUFBTSxDQUFDLEVBQUUsVUFBQSxRQUFRLEVBQUUsQ0FBQyxDQUFDOzRCQUN6QixDQUFDO3lCQUNKLENBQUM7d0JBQ0YsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdEQsQ0FBQztpQkFDSjthQUNKLENBQ0o7WUFFRCxDQUFDLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxFQUNwQixFQUNDLENBQUM7U0FDVCxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUwsc0JBQUM7QUFBRCxDQUFDLEFBM0hELENBQThCLFNBQVMsR0EySHRDO0FDMUhEO0lBaUJJLDZCQUFZLEtBQVksRUFBRSxZQUEyQjtRQWpCekQsaUJBeVVDO1FBcFVHLGdCQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzQyxpQkFBWSxHQUFHLElBQUksQ0FBQztRQVNaLG9CQUFlLEdBQXdDLEVBQUUsQ0FBQztRQUc5RCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFFOUIsSUFBSSxDQUFDLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN2RSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFFN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTTtZQUN2QyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBTSxjQUFjLEdBQUcsVUFBQyxFQUF5QjtZQUM3QyxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQSxDQUFDO2dCQUNuQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZELENBQUM7WUFDRCxJQUFJLENBQUMsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUEsQ0FBQztnQkFDdEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyRCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDckQsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDckUsbURBQW1EO1FBQ25ELE9BQU87UUFFUCxJQUFNLFVBQVUsR0FBRyxJQUFJLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWpELHVCQUF1QjtRQUV2QixLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7WUFDL0MsS0FBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDO1lBQy9DLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQztZQUMvQyxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBcUI7UUFFckIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FDaEMsVUFBQSxFQUFFO1lBQ0UsS0FBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDckIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMzQixLQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUM5QixDQUFDLENBQ0osQ0FBQztRQUVGLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7WUFDNUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMzQixFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQztnQkFDUCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2pFLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUMzQixLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztnQkFDMUIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILHdCQUF3QjtRQUV4QixLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FDbkIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUM1QixLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQ2hDLENBQUMsU0FBUyxDQUNQLFVBQUEsRUFBRSxJQUFJLE9BQUEsS0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQztRQUVsQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXO2FBQzdCLE9BQU8sRUFBRTthQUNULFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyw4QkFBOEIsQ0FBQzthQUM1RCxTQUFTLENBQUMsVUFBQSxDQUFDO1lBQ1IsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUMzQixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDL0MsMEJBQTBCO29CQUMxQixLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQ2xELFVBQUMsR0FBRyxFQUFFLElBQUksSUFBSyxPQUFBLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxFQUFoQixDQUFnQixDQUFDLENBQUM7Z0JBQ3pDLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRztvQkFDZixRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVE7b0JBQzVCLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUztvQkFDOUIsZUFBZSxFQUFFLFNBQVMsQ0FBQyxlQUFlO2lCQUM3QyxDQUFBO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRVAsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7WUFDdEMsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNkLE9BQU8sS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDO1lBQzNDLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUMxQixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsdUNBQVMsR0FBVDtRQUNJLElBQUksTUFBdUIsQ0FBQztRQUM1QixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsVUFBQyxJQUFJO1lBQ2hDLE1BQU0sR0FBRyxNQUFNO2tCQUNULE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztrQkFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNWLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDOUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDdEQsQ0FBQztRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRU8seUNBQVcsR0FBbkI7UUFDSSxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUMzQyxJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pGLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkQsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRWhDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRU8seUNBQVcsR0FBbkI7UUFDSSxJQUFJLFVBQXNCLENBQUM7UUFDM0IsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQSxDQUFDO1lBQ2pELFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN6QyxDQUFDO1FBRUQsSUFBSSxHQUFHLEdBQUcsMEJBQTBCLEdBQUcsa0JBQWtCLENBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4RCxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFaEUsRUFBRSxDQUFBLENBQUMsVUFBVSxDQUFDLENBQUEsQ0FBQztZQUNYLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN4QixDQUFDO0lBQ0wsQ0FBQztJQUVPLCtDQUFpQixHQUF6QixVQUEwQixNQUFjLEVBQUUsU0FBaUI7UUFDdkQsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsS0FBSyxFQUNMLEdBQUcsQ0FBQyxDQUFnQixVQUEyQyxFQUEzQyxLQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUEzQyxjQUEyQyxFQUEzQyxJQUEyQyxDQUFDO1lBQTNELElBQU0sS0FBSyxTQUFBO1lBQ1osR0FBRyxDQUFDLENBQWUsVUFBc0IsRUFBdEIsS0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBdEIsY0FBc0IsRUFBdEIsSUFBc0IsQ0FBQztnQkFBckMsSUFBTSxJQUFJLFNBQUE7Z0JBQ1gsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7d0JBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQztvQkFDN0IsSUFBSSxJQUFJLElBQUksQ0FBQztnQkFDakIsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ2hCLENBQUM7YUFDSjtTQUNKO1FBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksR0FBRyxRQUFRLENBQUM7UUFDcEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssOENBQWdCLEdBQXhCO1FBQ0ksSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQ2xFLElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFDM0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQyxVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDO1FBQ3hFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN4QixNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUFFTyxzQ0FBUSxHQUFoQixVQUFpQixTQUFvQjtRQUFyQyxpQkFrSEM7UUFqSEcsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBRUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztZQUNwRSxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBSSxNQUEwRCxDQUFDO1FBRS9ELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQU0sV0FBVyxHQUFHLFVBQUMsTUFBcUI7Z0JBQ3RDLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLENBQUMsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQ3BCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDMUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDdkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxDQUFDO2dCQUNELGdEQUFnRDtnQkFDaEQsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN0RCxDQUFDLENBQUM7WUFDRixNQUFNLEdBQUc7Z0JBQ0wsS0FBSyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO2dCQUN0RCxLQUFLLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7YUFDNUQsQ0FBQztRQUNOLENBQUM7UUFFRCxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQ2YsSUFBSSxDQUFDLFlBQVksRUFDakIsU0FBUyxDQUFDLElBQUksRUFDZCxNQUFNLEVBQ04sU0FBUyxDQUFDLFFBQVEsRUFBRTtZQUNoQixRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVE7WUFDNUIsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLElBQUksS0FBSztZQUN2QyxlQUFlLEVBQUUsU0FBUyxDQUFDLGVBQWU7U0FDN0MsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDL0MsMEJBQTBCO1lBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQ3ZELFVBQUMsR0FBRyxFQUFFLElBQUksSUFBSyxPQUFBLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxFQUFoQixDQUFnQixDQUFDLENBQUM7UUFDekMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVELElBQU0sY0FBYyxHQUFHO1lBQ25CLElBQU0sUUFBUSxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FDNUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDcEUsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQzdDO2dCQUNJLE1BQU0sRUFBRSxTQUFTLENBQUMsR0FBRztnQkFDckIsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQ3RCLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQztRQUVGLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFBLEVBQUU7WUFDL0MsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixjQUFjLEVBQUUsQ0FBQztZQUNyQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osY0FBYztnQkFDZCxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FDM0MsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUMxRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLFVBQUEsRUFBRTtZQUM3QyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDakIsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQzNDLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFDMUQsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxVQUFBLEVBQUU7WUFDM0MsSUFBSSxLQUFLLEdBQWMsS0FBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RELEtBQUssQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztZQUMxQixLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0UsV0FBVzthQUNOLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQywrQkFBK0IsQ0FBQzthQUM3RCxTQUFTLENBQUM7WUFDUCxJQUFJLEtBQUssR0FBYyxLQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEQsS0FBSyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQzFCLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO1FBRVAsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FDOUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7aUJBQ3pELEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLENBQUM7UUFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU87ZUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0Qsb0NBQW9DO1lBQ3BDLGNBQWMsRUFBRSxDQUFDO1FBQ3JCLENBQUM7SUFDTCxDQUFDO0lBRU8saURBQW1CLEdBQTNCLFVBQTRCLElBQWM7UUFDdEMsZ0VBQWdFO1FBQ2hFLHlCQUF5QjtRQUN6QixJQUFNLEdBQUcsR0FBZSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLElBQU0sTUFBTSxHQUFlLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekUsTUFBTSxDQUFDO1lBQ0gsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDNUMsT0FBTyxFQUFFLEVBQUUsS0FBQSxHQUFHLEVBQUUsUUFBQSxNQUFNLEVBQUU7U0FDM0IsQ0FBQTtJQUNMLENBQUM7SUF0VU0sa0RBQThCLEdBQUcsR0FBRyxDQUFDO0lBQ3JDLG1EQUErQixHQUFHLEdBQUcsQ0FBQztJQXNVakQsMEJBQUM7QUFBRCxDQUFDLEFBelVELElBeVVDO0FDdlVEO0lBT0ksOEJBQVksTUFBWSxFQUFFLElBQVU7UUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxnRkFBZ0Y7SUFDaEYsMkVBQTJFO0lBQzNFLGdGQUFnRjtJQUNoRiw2Q0FBYyxHQUFkLFVBQWUsS0FBa0I7UUFDN0IsSUFBSSxFQUFFLEdBQUcsb0JBQW9CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVNLGlDQUFZLEdBQW5CLFVBQW9CLE1BQVksRUFBRSxNQUFZO1FBRTFDLElBQUksWUFBWSxHQUFHO1lBQ2YsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsSUFBSSxZQUFZLEdBQUc7WUFDZixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNsRSxJQUFJLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENB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QUM7SUFDaEIsQ0FBQztJQUNMLGVBQUM7QUFBRCxDQUFDLEFBbkpELElBbUpDO0FFbEpEO0lBRUksSUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztJQUUxQixJQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xGLElBQU0sa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRW5HLE1BQU0sQ0FBQyxJQUFJLGFBQWEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFFdEUsQ0FBQztBQUVELElBQU0sR0FBRyxHQUFHLFNBQVMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbm5hbWVzcGFjZSBEb21IZWxwZXJzIHtcclxuICAgIFxyXG4gICAgLy8gIGh0dHBzOi8vc3VwcG9ydC5tb3ppbGxhLm9yZy9lbi1VUy9xdWVzdGlvbnMvOTY4OTkyXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZG93bmxvYWRGaWxlKGRhdGFVcmw6IHN0cmluZywgZmlsZW5hbWU6IHN0cmluZyl7XHJcbiAgICAgICAgdmFyIGxpbmsgPSA8YW55PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIGxpbmsuaWQgPSBuZXdpZCgpO1xyXG4gICAgICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlbmFtZTtcclxuICAgICAgICBsaW5rLmhyZWYgPSBkYXRhVXJsO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICAgICAgbGluay50YXJnZXQgPSBcIl9zZWxmXCI7XHJcbiAgICAgICAgbGluay5jbGljaygpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgYmxvYiBmcm9tIGEgZGF0YSBVUkwgKGVpdGhlciBiYXNlNjQgZW5jb2RlZCBvciBub3QpLlxyXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL2ViaWRlbC9maWxlci5qcy9ibG9iL21hc3Rlci9zcmMvZmlsZXIuanMjTDEzN1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhVVJMIFRoZSBkYXRhIFVSTCB0byBjb252ZXJ0LlxyXG4gICAgICogQHJldHVybiB7QmxvYn0gQSBibG9iIHJlcHJlc2VudGluZyB0aGUgYXJyYXkgYnVmZmVyIGRhdGEuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkYXRhVVJMVG9CbG9iKGRhdGFVUkwpOiBCbG9iIHtcclxuICAgICAgICB2YXIgQkFTRTY0X01BUktFUiA9ICc7YmFzZTY0LCc7XHJcbiAgICAgICAgaWYgKGRhdGFVUkwuaW5kZXhPZihCQVNFNjRfTUFSS0VSKSA9PSAtMSkge1xyXG4gICAgICAgICAgICB2YXIgcGFydHMgPSBkYXRhVVJMLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50VHlwZSA9IHBhcnRzWzBdLnNwbGl0KCc6JylbMV07XHJcbiAgICAgICAgICAgIHZhciByYXcgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBCbG9iKFtyYXddLCB7dHlwZTogY29udGVudFR5cGV9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwYXJ0cyA9IGRhdGFVUkwuc3BsaXQoQkFTRTY0X01BUktFUik7XHJcbiAgICAgICAgdmFyIGNvbnRlbnRUeXBlID0gcGFydHNbMF0uc3BsaXQoJzonKVsxXTtcclxuICAgICAgICB2YXIgcmF3ID0gd2luZG93LmF0b2IocGFydHNbMV0pO1xyXG4gICAgICAgIHZhciByYXdMZW5ndGggPSByYXcubGVuZ3RoO1xyXG5cclxuICAgICAgICB2YXIgdUludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KHJhd0xlbmd0aCk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3TGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdUludDhBcnJheVtpXSA9IHJhdy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBCbG9iKFt1SW50OEFycmF5XSwge3R5cGU6IGNvbnRlbnRUeXBlfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IEtleUNvZGVzID0ge1xyXG4gICAgICAgIEJhY2tTcGFjZSAgICAgICAgICAgOiA4ICAsXHJcbiAgICAgICAgVGFiICAgICAgICAgICAgICAgICA6IDkgICxcclxuICAgICAgICBFbnRlciAgICAgICAgICAgICAgIDogMTMgLFxyXG4gICAgICAgIFNoaWZ0ICAgICAgICAgICAgICAgOiAxNiAsXHJcbiAgICAgICAgQ3RybCAgICAgICAgICAgICAgICA6IDE3ICxcclxuICAgICAgICBBbHQgICAgICAgICAgICAgICAgIDogMTggLFxyXG4gICAgICAgIFBhdXNlQnJlYWsgICAgICAgICAgOiAxOSAsXHJcbiAgICAgICAgQ2Fwc0xvY2sgICAgICAgICAgICA6IDIwICxcclxuICAgICAgICBFc2MgICAgICAgICAgICAgICAgIDogMjcgLFxyXG4gICAgICAgIFBhZ2VVcCAgICAgICAgICAgICAgOiAzMyAsXHJcbiAgICAgICAgUGFnZURvd24gICAgICAgICAgICA6IDM0ICxcclxuICAgICAgICBFbmQgICAgICAgICAgICAgICAgIDogMzUgLFxyXG4gICAgICAgIEhvbWUgICAgICAgICAgICAgICAgOiAzNiAsXHJcbiAgICAgICAgQXJyb3dMZWZ0ICAgICAgICAgICA6IDM3ICxcclxuICAgICAgICBBcnJvd1VwICAgICAgICAgICAgIDogMzggLFxyXG4gICAgICAgIEFycm93UmlnaHQgICAgICAgICAgOiAzOSAsXHJcbiAgICAgICAgQXJyb3dEb3duICAgICAgICAgICA6IDQwICxcclxuICAgICAgICBJbnNlcnQgICAgICAgICAgICAgIDogNDUgLFxyXG4gICAgICAgIERlbGV0ZSAgICAgICAgICAgICAgOiA0NiAsXHJcbiAgICAgICAgRGlnaXQwICAgICAgICAgICAgICA6IDQ4ICxcclxuICAgICAgICBEaWdpdDEgICAgICAgICAgICAgIDogNDkgLFxyXG4gICAgICAgIERpZ2l0MiAgICAgICAgICAgICAgOiA1MCAsXHJcbiAgICAgICAgRGlnaXQzICAgICAgICAgICAgICA6IDUxICxcclxuICAgICAgICBEaWdpdDQgICAgICAgICAgICAgIDogNTIgLFxyXG4gICAgICAgIERpZ2l0NSAgICAgICAgICAgICAgOiA1MyAsXHJcbiAgICAgICAgRGlnaXQ2ICAgICAgICAgICAgICA6IDU0ICxcclxuICAgICAgICBEaWdpdDcgICAgICAgICAgICAgIDogNTUgLFxyXG4gICAgICAgIERpZ2l0OCAgICAgICAgICAgICAgOiA1NiAsXHJcbiAgICAgICAgRGlnaXQ5ICAgICAgICAgICAgICA6IDU3ICxcclxuICAgICAgICBBICAgICAgICAgICAgICAgICAgIDogNjUgLFxyXG4gICAgICAgIEIgICAgICAgICAgICAgICAgICAgOiA2NiAsXHJcbiAgICAgICAgQyAgICAgICAgICAgICAgICAgICA6IDY3ICxcclxuICAgICAgICBEICAgICAgICAgICAgICAgICAgIDogNjggLFxyXG4gICAgICAgIEUgICAgICAgICAgICAgICAgICAgOiA2OSAsXHJcbiAgICAgICAgRiAgICAgICAgICAgICAgICAgICA6IDcwICxcclxuICAgICAgICBHICAgICAgICAgICAgICAgICAgIDogNzEgLFxyXG4gICAgICAgIEggICAgICAgICAgICAgICAgICAgOiA3MiAsXHJcbiAgICAgICAgSSAgICAgICAgICAgICAgICAgICA6IDczICxcclxuICAgICAgICBKICAgICAgICAgICAgICAgICAgIDogNzQgLFxyXG4gICAgICAgIEsgICAgICAgICAgICAgICAgICAgOiA3NSAsXHJcbiAgICAgICAgTCAgICAgICAgICAgICAgICAgICA6IDc2ICxcclxuICAgICAgICBNICAgICAgICAgICAgICAgICAgIDogNzcgLFxyXG4gICAgICAgIE4gICAgICAgICAgICAgICAgICAgOiA3OCAsXHJcbiAgICAgICAgTyAgICAgICAgICAgICAgICAgICA6IDc5ICxcclxuICAgICAgICBQICAgICAgICAgICAgICAgICAgIDogODAgLFxyXG4gICAgICAgIFEgICAgICAgICAgICAgICAgICAgOiA4MSAsXHJcbiAgICAgICAgUiAgICAgICAgICAgICAgICAgICA6IDgyICxcclxuICAgICAgICBTICAgICAgICAgICAgICAgICAgIDogODMgLFxyXG4gICAgICAgIFQgICAgICAgICAgICAgICAgICAgOiA4NCAsXHJcbiAgICAgICAgVSAgICAgICAgICAgICAgICAgICA6IDg1ICxcclxuICAgICAgICBWICAgICAgICAgICAgICAgICAgIDogODYgLFxyXG4gICAgICAgIFcgICAgICAgICAgICAgICAgICAgOiA4NyAsXHJcbiAgICAgICAgWCAgICAgICAgICAgICAgICAgICA6IDg4ICxcclxuICAgICAgICBZICAgICAgICAgICAgICAgICAgIDogODkgLFxyXG4gICAgICAgIFogICAgICAgICAgICAgICAgICAgOiA5MCAsXHJcbiAgICAgICAgV2luZG93TGVmdCAgICAgICAgICA6IDkxICxcclxuICAgICAgICBXaW5kb3dSaWdodCAgICAgICAgIDogOTIgLFxyXG4gICAgICAgIFNlbGVjdEtleSAgICAgICAgICAgOiA5MyAsXHJcbiAgICAgICAgTnVtcGFkMCAgICAgICAgICAgICA6IDk2ICxcclxuICAgICAgICBOdW1wYWQxICAgICAgICAgICAgIDogOTcgLFxyXG4gICAgICAgIE51bXBhZDIgICAgICAgICAgICAgOiA5OCAsXHJcbiAgICAgICAgTnVtcGFkMyAgICAgICAgICAgICA6IDk5ICxcclxuICAgICAgICBOdW1wYWQ0ICAgICAgICAgICAgIDogMTAwLFxyXG4gICAgICAgIE51bXBhZDUgICAgICAgICAgICAgOiAxMDEsXHJcbiAgICAgICAgTnVtcGFkNiAgICAgICAgICAgICA6IDEwMixcclxuICAgICAgICBOdW1wYWQ3ICAgICAgICAgICAgIDogMTAzLCBcclxuICAgICAgICBOdW1wYWQ4ICAgICAgICAgICAgIDogMTA0LFxyXG4gICAgICAgIE51bXBhZDkgICAgICAgICAgICAgOiAxMDUsXHJcbiAgICAgICAgTXVsdGlwbHkgICAgICAgICAgICA6IDEwNixcclxuICAgICAgICBBZGQgICAgICAgICAgICAgICAgIDogMTA3LFxyXG4gICAgICAgIFN1YnRyYWN0ICAgICAgICAgICAgOiAxMDksXHJcbiAgICAgICAgRGVjaW1hbFBvaW50ICAgICAgICA6IDExMCxcclxuICAgICAgICBEaXZpZGUgICAgICAgICAgICAgIDogMTExLFxyXG4gICAgICAgIEYxICAgICAgICAgICAgICAgICAgOiAxMTIsXHJcbiAgICAgICAgRjIgICAgICAgICAgICAgICAgICA6IDExMyxcclxuICAgICAgICBGMyAgICAgICAgICAgICAgICAgIDogMTE0LFxyXG4gICAgICAgIEY0ICAgICAgICAgICAgICAgICAgOiAxMTUsXHJcbiAgICAgICAgRjUgICAgICAgICAgICAgICAgICA6IDExNixcclxuICAgICAgICBGNiAgICAgICAgICAgICAgICAgIDogMTE3LFxyXG4gICAgICAgIEY3ICAgICAgICAgICAgICAgICAgOiAxMTgsXHJcbiAgICAgICAgRjggICAgICAgICAgICAgICAgICA6IDExOSxcclxuICAgICAgICBGOSAgICAgICAgICAgICAgICAgIDogMTIwLFxyXG4gICAgICAgIEYxMCAgICAgICAgICAgICAgICAgOiAxMjEsXHJcbiAgICAgICAgRjExICAgICAgICAgICAgICAgICA6IDEyMixcclxuICAgICAgICBGMTIgICAgICAgICAgICAgICAgIDogMTIzLFxyXG4gICAgICAgIE51bUxvY2sgICAgICAgICAgICAgOiAxNDQsXHJcbiAgICAgICAgU2Nyb2xsTG9jayAgICAgICAgICA6IDE0NSxcclxuICAgICAgICBTZW1pQ29sb24gICAgICAgICAgIDogMTg2LFxyXG4gICAgICAgIEVxdWFsICAgICAgICAgICAgICAgOiAxODcsXHJcbiAgICAgICAgQ29tbWEgICAgICAgICAgICAgICA6IDE4OCxcclxuICAgICAgICBEYXNoICAgICAgICAgICAgICAgIDogMTg5LFxyXG4gICAgICAgIFBlcmlvZCAgICAgICAgICAgICAgOiAxOTAsXHJcbiAgICAgICAgRm9yd2FyZFNsYXNoICAgICAgICA6IDE5MSxcclxuICAgICAgICBHcmF2ZUFjY2VudCAgICAgICAgIDogMTkyLFxyXG4gICAgICAgIEJyYWNrZXRPcGVuICAgICAgICAgOiAyMTksXHJcbiAgICAgICAgQmFja1NsYXNoICAgICAgICAgICA6IDIyMCxcclxuICAgICAgICBCcmFja2V0Q2xvc2UgICAgICAgIDogMjIxLFxyXG4gICAgICAgIFNpbmdsZVF1b3RlICAgICAgICAgOiAyMjIgXHJcbiAgICB9O1xyXG4gICAgXHJcbn0iLCJcclxubmFtZXNwYWNlIEZvbnRIZWxwZXJzIHtcclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBWYXJpYW50U3R5bGUge1xyXG4gICAgICAgIGZvbnRGYW1pbHk/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFdlaWdodD86IHN0cmluZztcclxuICAgICAgICBmb250U3R5bGU/OiBzdHJpbmc7ICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldENzc1N0eWxlKGZhbWlseTogc3RyaW5nLCB2YXJpYW50OiBzdHJpbmcpe1xyXG4gICAgICAgIGxldCBzdHlsZSA9IDxWYXJpYW50U3R5bGU+eyBmb250RmFtaWx5OiBmYW1pbHkgfTtcclxuICAgICAgICBpZih2YXJpYW50LmluZGV4T2YoXCJpdGFsaWNcIikgPj0gMCl7XHJcbiAgICAgICAgICAgIHN0eWxlLmZvbnRTdHlsZSA9IFwiaXRhbGljXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBudW1lcmljID0gdmFyaWFudC5yZXBsYWNlKC9bXlxcZF0vZywgXCJcIik7XHJcbiAgICAgICAgaWYobnVtZXJpYy5sZW5ndGgpe1xyXG4gICAgICAgICAgICBzdHlsZS5mb250V2VpZ2h0ID0gbnVtZXJpYy50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3R5bGU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXREZXNjcmlwdGlvbihmYW1pbHk6IEZvbnRGYW1pbHksIHZhcmlhbnQ/OiBzdHJpbmcpOiBGb250RGVzY3JpcHRpb24ge1xyXG4gICAgICAgIGxldCB1cmw6IHN0cmluZztcclxuICAgICAgICB1cmwgPSBmYW1pbHkuZmlsZXNbdmFyaWFudCB8fCBcInJlZ3VsYXJcIl07XHJcbiAgICAgICAgaWYoIXVybCl7XHJcbiAgICAgICAgICAgIHVybCA9IGZhbWlseS5maWxlc1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZmFtaWx5OiBmYW1pbHkuZmFtaWx5LFxyXG4gICAgICAgICAgICBjYXRlZ29yeTogZmFtaWx5LmNhdGVnb3J5LFxyXG4gICAgICAgICAgICB2YXJpYW50OiB2YXJpYW50LFxyXG4gICAgICAgICAgICB1cmxcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxufSIsIlxyXG5mdW5jdGlvbiBsb2d0YXA8VD4obWVzc2FnZTogc3RyaW5nLCBzdHJlYW06IFJ4Lk9ic2VydmFibGU8VD4pOiBSeC5PYnNlcnZhYmxlPFQ+e1xyXG4gICAgcmV0dXJuIHN0cmVhbS50YXAodCA9PiBjb25zb2xlLmxvZyhtZXNzYWdlLCB0KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5ld2lkKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gKG5ldyBEYXRlKCkuZ2V0VGltZSgpK01hdGgucmFuZG9tKCkpLnRvU3RyaW5nKDM2KTtcclxufVxyXG4iLCJcclxubmFtZXNwYWNlIFR5cGVkQ2hhbm5lbCB7XHJcblxyXG4gICAgLy8gLS0tIENvcmUgdHlwZXMgLS0tXHJcblxyXG4gICAgdHlwZSBTZXJpYWxpemFibGUgPSBPYmplY3QgfCBBcnJheTxhbnk+IHwgbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiB8IERhdGUgfCB2b2lkO1xyXG5cclxuICAgIHR5cGUgVmFsdWUgPSBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuIHwgRGF0ZTtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2U8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgZGF0YT86IFREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHR5cGUgSVN1YmplY3Q8VD4gPSBSeC5PYnNlcnZlcjxUPiAmIFJ4Lk9ic2VydmFibGU8VD47XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIENoYW5uZWxUb3BpYzxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4ge1xyXG4gICAgICAgIHR5cGU6IHN0cmluZztcclxuICAgICAgICBjaGFubmVsOiBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoYW5uZWw6IElTdWJqZWN0PE1lc3NhZ2U8VERhdGE+PiwgdHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWJzY3JpYmUob2JzZXJ2ZXI6IChtZXNzYWdlOiBNZXNzYWdlPFREYXRhPikgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmUoKS5zdWJzY3JpYmUob2JzZXJ2ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGlzcGF0Y2goZGF0YT86IFREYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbC5vbk5leHQoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogXy5jbG9uZShkYXRhKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9ic2VydmUoKTogUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhPj4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFubmVsLmZpbHRlcihtID0+IG0udHlwZSA9PT0gdGhpcy50eXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yd2FyZChjaGFubmVsOiBDaGFubmVsVG9waWM8VERhdGE+KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlKG0gPT4gY2hhbm5lbC5kaXNwYXRjaChtLmRhdGEpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIENoYW5uZWwge1xyXG4gICAgICAgIHR5cGU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIHN1YmplY3Q6IElTdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlPj47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN1YmplY3Q/OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+LCB0eXBlPzogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3ViamVjdCA9IHN1YmplY3QgfHwgbmV3IFJ4LlN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGU+PigpO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3Vic2NyaWJlKG9uTmV4dD86ICh2YWx1ZTogTWVzc2FnZTxTZXJpYWxpemFibGU+KSA9PiB2b2lkKTogUnguSURpc3Bvc2FibGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LnN1YnNjcmliZShvbk5leHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9waWM8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+KHR5cGU6IHN0cmluZykgOiBDaGFubmVsVG9waWM8VERhdGE+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VERhdGE+KHRoaXMuc3ViamVjdCBhcyBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj4sXHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPyB0aGlzLnR5cGUgKyAnLicgKyB0eXBlIDogdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lcmdlVHlwZWQ8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+KC4uLnRvcGljczogQ2hhbm5lbFRvcGljPFREYXRhPltdKSBcclxuICAgICAgICAgICAgOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGE+PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdG9waWNzLm1hcCh0ID0+IHQudHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuZmlsdGVyKG0gPT4gdHlwZXMuaW5kZXhPZihtLnR5cGUpID49IDAgKSBhcyBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGE+PjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVyZ2UoLi4udG9waWNzOiBDaGFubmVsVG9waWM8U2VyaWFsaXphYmxlPltdKSBcclxuICAgICAgICAgICAgOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRvcGljcy5tYXAodCA9PiB0LnR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmZpbHRlcihtID0+IHR5cGVzLmluZGV4T2YobS50eXBlKSA+PSAwICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJcclxudHlwZSBEaWN0aW9uYXJ5PFQ+ID0gXy5EaWN0aW9uYXJ5PFQ+O1xyXG4iLCJcclxuY2xhc3MgT2JzZXJ2YWJsZUV2ZW50PFQ+IHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfc3Vic2NyaWJlcnM6ICgoZXZlbnRBcmc6IFQpID0+IHZvaWQpW10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmb3Igbm90aWZpY2F0aW9uLiBSZXR1cm5zIHVuc3Vic2NyaWJlIGZ1bmN0aW9uLlxyXG4gICAgICovICAgIFxyXG4gICAgc3Vic2NyaWJlKGhhbmRsZXI6IChldmVudEFyZzogVCkgPT4gdm9pZCk6ICgoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgaWYodGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyKSA8IDApe1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5wdXNoKGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKCkgPT4gdGhpcy51bnN1YnNjcmliZShoYW5kbGVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdW5zdWJzY3JpYmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoY2FsbGJhY2ssIDApO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9ic2VydmUoKTogUnguT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHVuc3ViOiBhbnk7XHJcbiAgICAgICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybjxUPihcclxuICAgICAgICAgICAgKGhhbmRsZXJUb0FkZCkgPT4gdGhpcy5zdWJzY3JpYmUoPChldmVudEFyZzogVCkgPT4gdm9pZD5oYW5kbGVyVG9BZGQpLFxyXG4gICAgICAgICAgICAoaGFuZGxlclRvUmVtb3ZlKSA9PiB0aGlzLnVuc3Vic2NyaWJlKDwoZXZlbnRBcmc6IFQpID0+IHZvaWQ+aGFuZGxlclRvUmVtb3ZlKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGZvciBvbmUgbm90aWZpY2F0aW9uLlxyXG4gICAgICovXHJcbiAgICBzdWJzY3JpYmVPbmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCl7XHJcbiAgICAgICAgbGV0IHVuc3ViID0gdGhpcy5zdWJzY3JpYmUodCA9PiB7XHJcbiAgICAgICAgICAgIHVuc3ViKCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBub3RpZnkoZXZlbnRBcmc6IFQpe1xyXG4gICAgICAgIGZvcihsZXQgc3Vic2NyaWJlciBvZiB0aGlzLl9zdWJzY3JpYmVycyl7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY2FsbCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIHN1YnNjcmliZXJzLlxyXG4gICAgICovXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG59IiwiXHJcbm5hbWVzcGFjZSBCb290U2NyaXB0IHtcclxuXHJcbiAgICBpbnRlcmZhY2UgTWVudUl0ZW0ge1xyXG4gICAgICAgIGNvbnRlbnQ6IGFueSxcclxuICAgICAgICBvcHRpb25zPzogT2JqZWN0XHJcbiAgICAgICAgLy9vbkNsaWNrPzogKCkgPT4gdm9pZFxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkcm9wZG93bihcclxuICAgICAgICBhcmdzOiB7XHJcbiAgICAgICAgICAgIGlkOiBzdHJpbmcsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IGFueSxcclxuICAgICAgICAgICAgaXRlbXM6IE1lbnVJdGVtW11cclxuICAgICAgICB9KTogVk5vZGUge1xyXG5cclxuICAgICAgICByZXR1cm4gaChcImRpdi5kcm9wZG93blwiLCBbXHJcbiAgICAgICAgICAgIGgoXCJidXR0b24uYnRuLmJ0bi1kZWZhdWx0LmRyb3Bkb3duLXRvZ2dsZVwiLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYXR0cnNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYXJncy5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLXRvZ2dsZVwiOiBcImRyb3Bkb3duXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzLmNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgaChcInNwYW4uY2FyZXRcIilcclxuICAgICAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICBoKFwidWwuZHJvcGRvd24tbWVudVwiLFxyXG4gICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICBhcmdzLml0ZW1zLm1hcChpdGVtID0+XHJcbiAgICAgICAgICAgICAgICAgICAgaChcImxpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaCgnYScsIGl0ZW0ub3B0aW9ucyB8fCB7fSwgW2l0ZW0uY29udGVudF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICBdKTtcclxuXHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmludGVyZmFjZSBDb25zb2xlIHtcclxuICAgIGxvZyhtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkO1xyXG4gICAgbG9nKC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSk6IHZvaWQ7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBQYXBlckhlbHBlcnMge1xyXG5cclxuICAgIGV4cG9ydCB2YXIgc2hvdWxkTG9nSW5mbzogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdCBsb2cgPSBmdW5jdGlvbiguLi5wYXJhbXM6IGFueVtdKSB7XHJcbiAgICAgICAgaWYgKHNob3VsZExvZ0luZm8pIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coLi4ucGFyYW1zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IGltcG9ydE9wZW5UeXBlUGF0aCA9IGZ1bmN0aW9uKG9wZW5QYXRoOiBvcGVudHlwZS5QYXRoKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChvcGVuUGF0aC50b1BhdGhEYXRhKCkpO1xyXG5cclxuICAgICAgICAvLyBsZXQgc3ZnID0gb3BlblBhdGgudG9TVkcoNCk7XHJcbiAgICAgICAgLy8gcmV0dXJuIDxwYXBlci5QYXRoPnBhcGVyLnByb2plY3QuaW1wb3J0U1ZHKHN2Zyk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlUGF0aEl0ZW0gPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoSXRlbSwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuUGF0aEl0ZW0ge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VDb21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCB0cmFjZUNvbXBvdW5kUGF0aCA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICBpZiAoIXBhdGguY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcGF0aHMgPSBwYXRoLmNoaWxkcmVuLm1hcChwID0+XHJcbiAgICAgICAgICAgIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnAsIHBvaW50c1BlclBhdGgpKTtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aCh7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBwYXRocyxcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlUGF0aEFzUG9pbnRzID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5Qb2ludFtdIHtcclxuICAgICAgICBsZXQgcGF0aExlbmd0aCA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGxldCBvZmZzZXRJbmNyID0gcGF0aExlbmd0aCAvIG51bVBvaW50cztcclxuICAgICAgICBsZXQgcG9pbnRzID0gW107XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAoaSsrIDwgbnVtUG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IHBhdGguZ2V0UG9pbnRBdChNYXRoLm1pbihvZmZzZXQsIHBhdGhMZW5ndGgpKTtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gb2Zmc2V0SW5jcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwb2ludHM7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlUGF0aCA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGgsIG51bVBvaW50czogbnVtYmVyKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgbGV0IHBvaW50cyA9IFBhcGVySGVscGVycy50cmFjZVBhdGhBc1BvaW50cyhwYXRoLCBudW1Qb2ludHMpO1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgIHNlZ21lbnRzOiBwb2ludHMsXHJcbiAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBkdWFsQm91bmRzUGF0aFByb2plY3Rpb24gPSBmdW5jdGlvbih0b3BQYXRoOiBwYXBlci5DdXJ2ZWxpa2UsIGJvdHRvbVBhdGg6IHBhcGVyLkN1cnZlbGlrZSlcclxuICAgICAgICA6ICh1bml0UG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgY29uc3QgdG9wUGF0aExlbmd0aCA9IHRvcFBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGJvdHRvbVBhdGhMZW5ndGggPSBib3R0b21QYXRoLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24odW5pdFBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICAgICAgbGV0IHRvcFBvaW50ID0gdG9wUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogdG9wUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGxldCBib3R0b21Qb2ludCA9IGJvdHRvbVBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIGJvdHRvbVBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgICBpZiAodG9wUG9pbnQgPT0gbnVsbCB8fCBib3R0b21Qb2ludCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcImNvdWxkIG5vdCBnZXQgcHJvamVjdGVkIHBvaW50IGZvciB1bml0IHBvaW50IFwiICsgdW5pdFBvaW50LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRvcFBvaW50LmFkZChib3R0b21Qb2ludC5zdWJ0cmFjdCh0b3BQb2ludCkubXVsdGlwbHkodW5pdFBvaW50LnkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBtYXJrZXJHcm91cDogcGFwZXIuR3JvdXA7XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHJlc2V0TWFya2VycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChQYXBlckhlbHBlcnMubWFya2VyR3JvdXApIHtcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrZXJHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIG1hcmtlckdyb3VwLm9wYWNpdHkgPSAwLjI7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBtYXJrZXJMaW5lID0gZnVuY3Rpb24oYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50KTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgbGV0IGxpbmUgPSBwYXBlci5QYXRoLkxpbmUoYSwgYik7XHJcbiAgICAgICAgbGluZS5zdHJva2VDb2xvciA9ICdncmVlbic7XHJcbiAgICAgICAgLy9saW5lLmRhc2hBcnJheSA9IFs1LCA1XTtcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobGluZSk7XHJcbiAgICAgICAgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IG1hcmtlciA9IGZ1bmN0aW9uKHBvaW50OiBwYXBlci5Qb2ludCwgbGFiZWw6IHN0cmluZyk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIC8vbGV0IG1hcmtlciA9IHBhcGVyLlNoYXBlLkNpcmNsZShwb2ludCwgMTApO1xyXG4gICAgICAgIGxldCBtYXJrZXIgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KHBvaW50KTtcclxuICAgICAgICBtYXJrZXIuZm9udFNpemUgPSAzNjtcclxuICAgICAgICBtYXJrZXIuY29udGVudCA9IGxhYmVsO1xyXG4gICAgICAgIG1hcmtlci5zdHJva2VDb2xvciA9IFwicmVkXCI7XHJcbiAgICAgICAgbWFya2VyLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgIC8vUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLmFkZENoaWxkKG1hcmtlcik7XHJcbiAgICAgICAgcmV0dXJuIG1hcmtlcjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3Qgc2ltcGxpZnkgPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoSXRlbSwgdG9sZXJhbmNlPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5zaW1wbGlmeSg8cGFwZXIuUGF0aEl0ZW0+cCwgdG9sZXJhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICg8cGFwZXIuUGF0aD5wYXRoKS5zaW1wbGlmeSh0b2xlcmFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgc2VsZiBvciBuZWFyZXN0IGFuY2VzdG9yIHNhdGlzZnlpbmcgdGhlIHByZWRpY2F0ZS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGZpbmRTZWxmT3JBbmNlc3RvciA9IGZ1bmN0aW9uKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRBbmNlc3RvcihpdGVtLCBwcmVkaWNhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluZCBuZWFyZXN0IGFuY2VzdG9yIHNhdGlzZnlpbmcgdGhlIHByZWRpY2F0ZS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGZpbmRBbmNlc3RvciA9IGZ1bmN0aW9uKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoIWl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwcmlvcjogcGFwZXIuSXRlbTtcclxuICAgICAgICBsZXQgY2hlY2tpbmcgPSBpdGVtLnBhcmVudDtcclxuICAgICAgICB3aGlsZSAoY2hlY2tpbmcgJiYgY2hlY2tpbmcgIT09IHByaW9yKSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUoY2hlY2tpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hlY2tpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJpb3IgPSBjaGVja2luZztcclxuICAgICAgICAgICAgY2hlY2tpbmcgPSBjaGVja2luZy5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGNvcm5lcnMgb2YgdGhlIHJlY3QsIGNsb2Nrd2lzZSBzdGFydGluZyBmcm9tIHRvcExlZnRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGNvcm5lcnMgPSBmdW5jdGlvbihyZWN0OiBwYXBlci5SZWN0YW5nbGUpOiBwYXBlci5Qb2ludFtdIHtcclxuICAgICAgICByZXR1cm4gW3JlY3QudG9wTGVmdCwgcmVjdC50b3BSaWdodCwgcmVjdC5ib3R0b21SaWdodCwgcmVjdC5ib3R0b21MZWZ0XTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRoZSBtaWRwb2ludCBiZXR3ZWVuIHR3byBwb2ludHNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IG1pZHBvaW50ID0gZnVuY3Rpb24oYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGIuc3VidHJhY3QoYSkuZGl2aWRlKDIpLmFkZChhKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgY2xvbmVTZWdtZW50ID0gZnVuY3Rpb24oc2VnbWVudDogcGFwZXIuU2VnbWVudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuU2VnbWVudChzZWdtZW50LnBvaW50LCBzZWdtZW50LmhhbmRsZUluLCBzZWdtZW50LmhhbmRsZU91dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWtlIGFuIGl0ZW0gZHJhZ2dhYmxlLCBhZGRpbmcgcmVsYXRlZCBldmVudHMuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBhZGRTbWFydERyYWcgPSBmdW5jdGlvbihpdGVtOiBwYXBlci5JdGVtKSB7XHJcbiAgICAgICAgaXRlbS5pc1NtYXJ0RHJhZ2dhYmxlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaXRlbS5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGxvZyhcInNtYXJ0RHJhZy5vbk1vdXNlRHJhZ1wiLCBpdGVtLCBldik7XHJcbiAgICAgICAgICAgIGlmIChldi5zbWFydERyYWdJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJXaWxsIG5vdCBhc3NpZ24gc21hcnREcmFnSXRlbTogdmFsdWUgd2FzIGFscmVhZHkgXCIgKyBldi5zbWFydERyYWdJdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV2LnNtYXJ0RHJhZ0l0ZW0gPSBpdGVtO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0uaXNTbWFydERyYWdnaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmlzU21hcnREcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBsb2coXCJlbWl0dGluZyBzbWFydERyYWcuc21hcnREcmFnU3RhcnRcIik7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQoRXZlbnRUeXBlLnNtYXJ0RHJhZ1N0YXJ0LCBldik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uLmFkZChldi5kZWx0YSk7XHJcblxyXG4gICAgICAgICAgICBsb2coXCJlbWl0dGluZyBzbWFydERyYWcuc21hcnREcmFnTW92ZVwiKTtcclxuICAgICAgICAgICAgaXRlbS5lbWl0KEV2ZW50VHlwZS5zbWFydERyYWdNb3ZlLCBldik7XHJcblxyXG4gICAgICAgICAgICBldi5zdG9wKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ZW0ub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlVXAsIGV2ID0+IHtcclxuICAgICAgICAgICAgbG9nKFwic21hcnREcmFnLm9uTW91c2VVcFwiLCBpdGVtLCBldik7XHJcbiAgICAgICAgICAgIGlmIChldi5zbWFydERyYWdJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJXaWxsIG5vdCBhc3NpZ24gc21hcnREcmFnSXRlbTogdmFsdWUgd2FzIGFscmVhZHkgXCIgKyBldi5zbWFydERyYWdJdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV2LnNtYXJ0RHJhZ0l0ZW0gPSBpdGVtO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbS5pc1NtYXJ0RHJhZ2dpbmcpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uaXNTbWFydERyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBsb2coXCJlbWl0dGluZyBzbWFydERyYWcuc21hcnREcmFnRW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5lbWl0KEV2ZW50VHlwZS5zbWFydERyYWdFbmQsIGV2KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvZyhcImVtaXR0aW5nIHNtYXJ0RHJhZy5jbGlja1dpdGhvdXREcmFnXCIpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5lbWl0KEV2ZW50VHlwZS5jbGlja1dpdGhvdXREcmFnLCBldik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGV2LnN0b3AoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGNvbnN0IEV2ZW50VHlwZSA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZyBhY3Rpb24gaGFzIHN0YXJ0ZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc21hcnREcmFnU3RhcnQ6IFwic21hcnREcmFnU3RhcnRcIixcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZ2dlZCBpdGVtIGhhcyBtb3ZlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzbWFydERyYWdNb3ZlOiBcInNtYXJ0RHJhZ01vdmVcIixcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZyBhY3Rpb24gaGFzIGVuZGVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNtYXJ0RHJhZ0VuZDogXCJzbWFydERyYWdFbmRcIixcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIG5vcm1hbCBjbGljayBldmVudCB3aWxsIGZpcmUgZXZlbiBhdCB0aGUgZW5kIG9mIGEgZHJhZy5cclxuICAgICAgICAgKiBUaGlzIGNsaWNrIGV2ZW50IGRvZXMgbm90LiBcclxuICAgICAgICAgKi9cclxuICAgICAgICBjbGlja1dpdGhvdXREcmFnOiBcImNsaWNrV2l0aG91dERyYWdcIlxyXG4gICAgfVxyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBwYXBlciB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEl0ZW0ge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERyYWdnaW5nIGJlaGF2aW9yIGFkZGVkIGJ5IFBhcGVySGVscGVyczogaXMgdGhlIGl0ZW0gYmVpbmcgZHJhZ2dlZD9cclxuICAgICAgICAgKi9cclxuICAgICAgICBpc1NtYXJ0RHJhZ2dpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERyYWdnaW5nIGJlaGF2aW9yIGFkZGVkIGJ5IFBhcGVySGVscGVyczogaXMgdGhlIGl0ZW0gZHJhZ2dhYmxlP1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzU21hcnREcmFnZ2FibGU6IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUb29sRXZlbnQge1xyXG4gICAgICAgIHNtYXJ0RHJhZ0l0ZW06IEl0ZW07XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYXBlck1vdXNlRXZlbnQge1xyXG4gICAgICAgIHNtYXJ0RHJhZ0l0ZW06IEl0ZW07XHJcbiAgICB9XHJcbn0iLCJcclxudHlwZSBJdGVtQ2hhbmdlSGFuZGxlciA9IChmbGFnczogUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZykgPT4gdm9pZDtcclxudHlwZSBDYWxsYmFjayA9ICgpID0+IHZvaWQ7XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBwYXBlciB7XHJcbiAgICBpbnRlcmZhY2UgSXRlbSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU3Vic2NyaWJlIHRvIGFsbCBjaGFuZ2VzIGluIGl0ZW0uIFJldHVybnMgdW4tc3Vic2NyaWJlIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN1YnNjcmliZShoYW5kbGVyOiBJdGVtQ2hhbmdlSGFuZGxlcik6IENhbGxiYWNrO1xyXG4gICAgICAgIFxyXG4gICAgICAgIF9jaGFuZ2VkKGZsYWdzOiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnKTogdm9pZDtcclxuICAgIH1cclxufVxyXG5cclxubmFtZXNwYWNlIFBhcGVyTm90aWZ5IHtcclxuXHJcbiAgICBleHBvcnQgZW51bSBDaGFuZ2VGbGFnIHtcclxuICAgICAgICAvLyBBbnl0aGluZyBhZmZlY3RpbmcgdGhlIGFwcGVhcmFuY2Ugb2YgYW4gaXRlbSwgaW5jbHVkaW5nIEdFT01FVFJZLFxyXG4gICAgICAgIC8vIFNUUk9LRSwgU1RZTEUgYW5kIEFUVFJJQlVURSAoZXhjZXB0IGZvciB0aGUgaW52aXNpYmxlIG9uZXM6IGxvY2tlZCwgbmFtZSlcclxuICAgICAgICBBUFBFQVJBTkNFID0gMHgxLFxyXG4gICAgICAgIC8vIEEgY2hhbmdlIGluIHRoZSBpdGVtJ3MgY2hpbGRyZW5cclxuICAgICAgICBDSElMRFJFTiA9IDB4MixcclxuICAgICAgICAvLyBBIGNoYW5nZSBvZiB0aGUgaXRlbSdzIHBsYWNlIGluIHRoZSBzY2VuZSBncmFwaCAocmVtb3ZlZCwgaW5zZXJ0ZWQsXHJcbiAgICAgICAgLy8gbW92ZWQpLlxyXG4gICAgICAgIElOU0VSVElPTiA9IDB4NCxcclxuICAgICAgICAvLyBJdGVtIGdlb21ldHJ5IChwYXRoLCBib3VuZHMpXHJcbiAgICAgICAgR0VPTUVUUlkgPSAweDgsXHJcbiAgICAgICAgLy8gT25seSBzZWdtZW50KHMpIGhhdmUgY2hhbmdlZCwgYW5kIGFmZmVjdGVkIGN1cnZlcyBoYXZlIGFscmVhZHkgYmVlblxyXG4gICAgICAgIC8vIG5vdGlmaWVkLiBUaGlzIGlzIHRvIGltcGxlbWVudCBhbiBvcHRpbWl6YXRpb24gaW4gX2NoYW5nZWQoKSBjYWxscy5cclxuICAgICAgICBTRUdNRU5UUyA9IDB4MTAsXHJcbiAgICAgICAgLy8gU3Ryb2tlIGdlb21ldHJ5IChleGNsdWRpbmcgY29sb3IpXHJcbiAgICAgICAgU1RST0tFID0gMHgyMCxcclxuICAgICAgICAvLyBGaWxsIHN0eWxlIG9yIHN0cm9rZSBjb2xvciAvIGRhc2hcclxuICAgICAgICBTVFlMRSA9IDB4NDAsXHJcbiAgICAgICAgLy8gSXRlbSBhdHRyaWJ1dGVzOiB2aXNpYmxlLCBibGVuZE1vZGUsIGxvY2tlZCwgbmFtZSwgb3BhY2l0eSwgY2xpcE1hc2sgLi4uXHJcbiAgICAgICAgQVRUUklCVVRFID0gMHg4MCxcclxuICAgICAgICAvLyBUZXh0IGNvbnRlbnRcclxuICAgICAgICBDT05URU5UID0gMHgxMDAsXHJcbiAgICAgICAgLy8gUmFzdGVyIHBpeGVsc1xyXG4gICAgICAgIFBJWEVMUyA9IDB4MjAwLFxyXG4gICAgICAgIC8vIENsaXBwaW5nIGluIG9uZSBvZiB0aGUgY2hpbGQgaXRlbXNcclxuICAgICAgICBDTElQUElORyA9IDB4NDAwLFxyXG4gICAgICAgIC8vIFRoZSB2aWV3IGhhcyBiZWVuIHRyYW5zZm9ybWVkXHJcbiAgICAgICAgVklFVyA9IDB4ODAwXHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2hvcnRjdXRzIHRvIG9mdGVuIHVzZWQgQ2hhbmdlRmxhZyB2YWx1ZXMgaW5jbHVkaW5nIEFQUEVBUkFOQ0VcclxuICAgIGV4cG9ydCBlbnVtIENoYW5nZXMge1xyXG4gICAgICAgIC8vIENISUxEUkVOIGFsc28gY2hhbmdlcyBHRU9NRVRSWSwgc2luY2UgcmVtb3ZpbmcgY2hpbGRyZW4gZnJvbSBncm91cHNcclxuICAgICAgICAvLyBjaGFuZ2VzIGJvdW5kcy5cclxuICAgICAgICBDSElMRFJFTiA9IENoYW5nZUZsYWcuQ0hJTERSRU4gfCBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIC8vIENoYW5naW5nIHRoZSBpbnNlcnRpb24gY2FuIGNoYW5nZSB0aGUgYXBwZWFyYW5jZSB0aHJvdWdoIHBhcmVudCdzIG1hdHJpeC5cclxuICAgICAgICBJTlNFUlRJT04gPSBDaGFuZ2VGbGFnLklOU0VSVElPTiB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBHRU9NRVRSWSA9IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgU0VHTUVOVFMgPSBDaGFuZ2VGbGFnLlNFR01FTlRTIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBTVFJPS0UgPSBDaGFuZ2VGbGFnLlNUUk9LRSB8IENoYW5nZUZsYWcuU1RZTEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgU1RZTEUgPSBDaGFuZ2VGbGFnLlNUWUxFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIEFUVFJJQlVURSA9IENoYW5nZUZsYWcuQVRUUklCVVRFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIENPTlRFTlQgPSBDaGFuZ2VGbGFnLkNPTlRFTlQgfCBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFBJWEVMUyA9IENoYW5nZUZsYWcuUElYRUxTIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFZJRVcgPSBDaGFuZ2VGbGFnLlZJRVcgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0VcclxuICAgIH07XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gSW5qZWN0IEl0ZW0uc3Vic2NyaWJlXHJcbiAgICAgICAgY29uc3QgaXRlbVByb3RvID0gKDxhbnk+cGFwZXIpLkl0ZW0ucHJvdG90eXBlO1xyXG4gICAgICAgIGl0ZW1Qcm90by5zdWJzY3JpYmUgPSBmdW5jdGlvbihoYW5kbGVyOiBJdGVtQ2hhbmdlSGFuZGxlcik6IENhbGxiYWNrIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9zdWJzY3JpYmVycykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyKSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnB1c2goaGFuZGxlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoaGFuZGxlciwgMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdyYXAgSXRlbS5yZW1vdmVcclxuICAgICAgICBjb25zdCBpdGVtUmVtb3ZlID0gaXRlbVByb3RvLnJlbW92ZTtcclxuICAgICAgICBpdGVtUHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0ZW1SZW1vdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gV3JhcCBQcm9qZWN0Ll9jaGFuZ2VkXHJcbiAgICAgICAgY29uc3QgcHJvamVjdFByb3RvID0gPGFueT5wYXBlci5Qcm9qZWN0LnByb3RvdHlwZTtcclxuICAgICAgICBjb25zdCBwcm9qZWN0Q2hhbmdlZCA9IHByb2plY3RQcm90by5fY2hhbmdlZDtcclxuICAgICAgICBwcm9qZWN0UHJvdG8uX2NoYW5nZWQgPSBmdW5jdGlvbihmbGFnczogQ2hhbmdlRmxhZywgaXRlbTogcGFwZXIuSXRlbSkge1xyXG4gICAgICAgICAgICBwcm9qZWN0Q2hhbmdlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3VicyA9ICg8YW55Pml0ZW0pLl9zdWJzY3JpYmVycztcclxuICAgICAgICAgICAgICAgIGlmIChzdWJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcyBvZiBzdWJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuY2FsbChpdGVtLCBmbGFncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZShmbGFnczogQ2hhbmdlRmxhZykge1xyXG4gICAgICAgIGxldCBmbGFnTGlzdDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBfLmZvck93bihDaGFuZ2VGbGFnLCAodmFsdWUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB2YWx1ZSkgPT09IFwibnVtYmVyXCIgJiYgKHZhbHVlICYgZmxhZ3MpKSB7XHJcbiAgICAgICAgICAgICAgICBmbGFnTGlzdC5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmxhZ0xpc3Quam9pbignIHwgJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlKGl0ZW06IHBhcGVyLkl0ZW0sIGZsYWdzOiBDaGFuZ2VGbGFnKTogXHJcbiAgICAgICAgUnguT2JzZXJ2YWJsZTxDaGFuZ2VGbGFnPiBcclxuICAgIHtcclxuICAgICAgICBsZXQgdW5zdWI6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybjxDaGFuZ2VGbGFnPihcclxuICAgICAgICAgICAgYWRkSGFuZGxlciA9PiB7XHJcbiAgICAgICAgICAgICAgICB1bnN1YiA9IGl0ZW0uc3Vic2NyaWJlKGYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGYgJiBmbGFncyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEhhbmRsZXIoZik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICByZW1vdmVIYW5kbGVyID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHVuc3ViKXtcclxuICAgICAgICAgICAgICAgICAgICB1bnN1YigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblBhcGVyTm90aWZ5LmluaXRpYWxpemUoKTtcclxuIiwiXHJcbm1vZHVsZSBwYXBlciB7XHJcblxyXG4gICAgZXhwb3J0IHZhciBFdmVudFR5cGUgPSB7XHJcbiAgICAgICAgZnJhbWU6IFwiZnJhbWVcIixcclxuICAgICAgICBtb3VzZURvd246IFwibW91c2Vkb3duXCIsXHJcbiAgICAgICAgbW91c2VVcDogXCJtb3VzZXVwXCIsXHJcbiAgICAgICAgbW91c2VEcmFnOiBcIm1vdXNlZHJhZ1wiLFxyXG4gICAgICAgIGNsaWNrOiBcImNsaWNrXCIsXHJcbiAgICAgICAgZG91YmxlQ2xpY2s6IFwiZG91YmxlY2xpY2tcIixcclxuICAgICAgICBtb3VzZU1vdmU6IFwibW91c2Vtb3ZlXCIsXHJcbiAgICAgICAgbW91c2VFbnRlcjogXCJtb3VzZWVudGVyXCIsXHJcbiAgICAgICAgbW91c2VMZWF2ZTogXCJtb3VzZWxlYXZlXCIsXHJcbiAgICAgICAga2V5dXA6IFwia2V5dXBcIixcclxuICAgICAgICBrZXlkb3duOiBcImtleWRvd25cIlxyXG4gICAgfVxyXG5cclxufSIsIlxyXG4vLyBjbGFzcyBPbGRUb3BpYzxUPiB7XHJcblxyXG4vLyAgICAgcHJpdmF0ZSBfY2hhbm5lbDogSUNoYW5uZWxEZWZpbml0aW9uPE9iamVjdD47XHJcbi8vICAgICBwcml2YXRlIF9uYW1lOiBzdHJpbmc7XHJcblxyXG4vLyAgICAgY29uc3RydWN0b3IoY2hhbm5lbDogSUNoYW5uZWxEZWZpbml0aW9uPE9iamVjdD4sIHRvcGljOiBzdHJpbmcpIHtcclxuLy8gICAgICAgICB0aGlzLl9jaGFubmVsID0gY2hhbm5lbDtcclxuLy8gICAgICAgICB0aGlzLl9uYW1lID0gdG9waWM7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgb2JzZXJ2ZSgpOiBSeC5PYnNlcnZhYmxlPFQ+IHtcclxuLy8gICAgICAgICByZXR1cm4gPFJ4Lk9ic2VydmFibGU8VD4+dGhpcy5fY2hhbm5lbC5vYnNlcnZlKHRoaXMuX25hbWUpO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHB1Ymxpc2goZGF0YTogVCkge1xyXG4vLyAgICAgICAgIHRoaXMuX2NoYW5uZWwucHVibGlzaCh0aGlzLl9uYW1lLCBkYXRhKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBzdWJzY3JpYmUoY2FsbGJhY2s6IElDYWxsYmFjazxUPik6IElTdWJzY3JpcHRpb25EZWZpbml0aW9uPFQ+IHtcclxuLy8gICAgICAgICByZXR1cm4gdGhpcy5fY2hhbm5lbC5zdWJzY3JpYmUodGhpcy5fbmFtZSwgY2FsbGJhY2spO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHByb3RlY3RlZCBzdWJ0b3BpYyhuYW1lKTogQ2hhbm5lbFRvcGljPFQ+IHtcclxuLy8gICAgICAgICByZXR1cm4gbmV3IENoYW5uZWxUb3BpYzxUPih0aGlzLl9jaGFubmVsLCB0aGlzLl9uYW1lICsgJy4nICsgbmFtZSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHJvdGVjdGVkIHN1YnRvcGljT2Y8VSBleHRlbmRzIFQ+KG5hbWUpOiBDaGFubmVsVG9waWM8VT4ge1xyXG4vLyAgICAgICAgIHJldHVybiBuZXcgQ2hhbm5lbFRvcGljPFU+KHRoaXMuX2NoYW5uZWwsIHRoaXMuX25hbWUgKyAnLicgKyBuYW1lKTtcclxuLy8gICAgIH1cclxuLy8gfVxyXG4iLCJcclxuaW50ZXJmYWNlIElQb3N0YWwge1xyXG4gICAgb2JzZXJ2ZTogKG9wdGlvbnM6IFBvc3RhbE9ic2VydmVPcHRpb25zKSA9PiBSeC5PYnNlcnZhYmxlPGFueT47XHJcbn1cclxuXHJcbmludGVyZmFjZSBQb3N0YWxPYnNlcnZlT3B0aW9ucyB7XHJcbiAgICBjaGFubmVsOiBzdHJpbmc7XHJcbiAgICB0b3BpYzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSUNoYW5uZWxEZWZpbml0aW9uPFQ+IHtcclxuICAgIG9ic2VydmUodG9waWM6IHN0cmluZyk6IFJ4Lk9ic2VydmFibGU8VD47XHJcbn1cclxuXHJcbnBvc3RhbC5vYnNlcnZlID0gZnVuY3Rpb24ob3B0aW9uczogUG9zdGFsT2JzZXJ2ZU9wdGlvbnMpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBjaGFubmVsID0gb3B0aW9ucy5jaGFubmVsO1xyXG4gICAgdmFyIHRvcGljID0gb3B0aW9ucy50b3BpYztcclxuXHJcbiAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuKFxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZEhhbmRsZXIoaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5zdWJzY3JpYmUoe1xyXG4gICAgICAgICAgICAgICAgY2hhbm5lbDogY2hhbm5lbCxcclxuICAgICAgICAgICAgICAgIHRvcGljOiB0b3BpYyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBoLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbEhhbmRsZXIoXywgc3ViKSB7XHJcbiAgICAgICAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn07XHJcblxyXG4vLyBhZGQgb2JzZXJ2ZSB0byBDaGFubmVsRGVmaW5pdGlvblxyXG4oPGFueT5wb3N0YWwpLkNoYW5uZWxEZWZpbml0aW9uLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24odG9waWM6IHN0cmluZykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm4oXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkSGFuZGxlcihoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmJ1cy5zdWJzY3JpYmUoe1xyXG4gICAgICAgICAgICAgICAgY2hhbm5lbDogc2VsZi5jaGFubmVsLFxyXG4gICAgICAgICAgICAgICAgdG9waWM6IHRvcGljLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGgsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsSGFuZGxlcihfLCBzdWIpIHtcclxuICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxufTtcclxuIiwiXHJcbmNvbnN0IHJoID0gUmVhY3QuY3JlYXRlRWxlbWVudDtcclxuIiwiXHJcbmFic3RyYWN0IGNsYXNzIENvbXBvbmVudDxUPiB7XHJcbiAgICBhYnN0cmFjdCByZW5kZXIoZGF0YTogVCk6IFZOb2RlO1xyXG59IiwiXHJcbmludGVyZmFjZSBSZWFjdGl2ZURvbUNvbXBvbmVudCB7XHJcbiAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPjtcclxufVxyXG5cclxuY2xhc3MgUmVhY3RpdmVEb20ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIGEgcmVhY3RpdmUgY29tcG9uZW50IHdpdGhpbiBjb250YWluZXIuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXJTdHJlYW0oXHJcbiAgICAgICAgZG9tJDogUnguT2JzZXJ2YWJsZTxWTm9kZT4sXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudFxyXG4gICAgKTogUnguT2JzZXJ2YWJsZTxWTm9kZT4ge1xyXG4gICAgICAgIGNvbnN0IGlkID0gY29udGFpbmVyLmlkO1xyXG4gICAgICAgIGxldCBjdXJyZW50OiBIVE1MRWxlbWVudCB8IFZOb2RlID0gY29udGFpbmVyO1xyXG4gICAgICAgIGNvbnN0IHNpbmsgPSBuZXcgUnguU3ViamVjdDxWTm9kZT4oKTtcclxuICAgICAgICBkb20kLnN1YnNjcmliZShkb20gPT4ge1xyXG4gICAgICAgICAgICBpZighZG9tKSByZXR1cm47XHJcbi8vY29uc29sZS5sb2coJ3JlbmRlcmluZyBkb20nLCBkb20pOyAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIHJldGFpbiBJRFxyXG4gICAgICAgICAgICBjb25zdCBwYXRjaGVkID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgaWYoaWQgJiYgIXBhdGNoZWQuZWxtLmlkKXtcclxuICAgICAgICAgICAgICAgIHBhdGNoZWQuZWxtLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaGVkO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSByZWFjdGl2ZSBjb21wb25lbnQgd2l0aGluIGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlckNvbXBvbmVudChcclxuICAgICAgICBjb21wb25lbnQ6IFJlYWN0aXZlRG9tQ29tcG9uZW50LFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZVxyXG4gICAgKTogUnguT2JzZXJ2YWJsZTxWTm9kZT4ge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gY29udGFpbmVyO1xyXG4gICAgICAgIGxldCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XHJcbiAgICAgICAgY29tcG9uZW50LmRvbSQuc3Vic2NyaWJlKGRvbSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFkb20pIHJldHVybjtcclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoKGN1cnJlbnQsIGRvbSk7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciB3aXRoaW4gY29udGFpbmVyIHdoZW5ldmVyIHNvdXJjZSBjaGFuZ2VzLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbGl2ZVJlbmRlcjxUPihcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50IHwgVk5vZGUsXHJcbiAgICAgICAgc291cmNlOiBSeC5PYnNlcnZhYmxlPFQ+LFxyXG4gICAgICAgIHJlbmRlcjogKG5leHQ6IFQpID0+IFZOb2RlXHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjb250YWluZXI7XHJcbiAgICAgICAgbGV0IHNpbmsgPSBuZXcgUnguU3ViamVjdDxWTm9kZT4oKTtcclxuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IHJlbmRlcihkYXRhKTtcclxuICAgICAgICAgICAgaWYoIW5vZGUpIHJldHVybjtcclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoKGN1cnJlbnQsIG5vZGUpO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG59IiwiLy8gY29uc3QgQW1hdGljVXJsID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL2FtYXRpY3NjL3Y4L0lEbmtSVFBHY3JTVm81MFV5WU5LN3kzVVNCblN2cGtvcFFhVVItMnI3aVUudHRmJztcclxuLy8gY29uc3QgUm9ib3RvMTAwID0gJ2h0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL3JvYm90by92MTUvN015Z3FUZTJ6czlZa1AwYWRBOVFRUS50dGYnO1xyXG4vLyBjb25zdCBSb2JvdG81MDAgPSAnZm9udHMvUm9ib3RvLTUwMC50dGYnO1xyXG4vLyBjb25zdCBSb2JvdG85MDAgPSBcImh0dHA6Ly9mb250cy5nc3RhdGljLmNvbS9zL3JvYm90by92MTUvSDF2QjM0bk9LV1hxektvdHEyNXBjZy50dGZcIjtcclxuLy8gY29uc3QgT3BlblNhbnNSZWd1bGFyID0gXCJmb250cy9PcGVuU2Fucy9PcGVuU2Fucy1SZWd1bGFyLnR0ZlwiO1xyXG4vLyBjb25zdCBPcGVuU2Fuc0V4dHJhQm9sZCA9IFwiZm9udHMvT3BlblNhbnMvT3BlblNhbnMtRXh0cmFCb2xkLnR0ZlwiO1xyXG4vLyBjb25zdCBBcXVhZmluYVNjcmlwdCA9ICdmb250cy9BZ3VhZmluYVNjcmlwdC1SZWd1bGFyL0FndWFmaW5hU2NyaXB0LVJlZ3VsYXIudHRmJ1xyXG4vLyBjb25zdCBOb3JpY2FuID0gXCJodHRwOi8vZm9udHMuZ3N0YXRpYy5jb20vcy9ub3JpY2FuL3Y0L1NIblNxaFlBV0c1c1pUV2NQekVIaWcudHRmXCI7XHJcblxyXG5jbGFzcyBBcHBDb250cm9sbGVyIHtcclxuXHJcbiAgICBzdG9yZTogU3RvcmU7XHJcbiAgICB3b3Jrc3BhY2VDb250cm9sbGVyOiBXb3Jrc3BhY2VDb250cm9sbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHN0b3JlOiBTdG9yZSxcclxuICAgICAgICBza2V0Y2hFZGl0b3I6IFNrZXRjaEVkaXRvcixcclxuICAgICAgICBzZWxlY3RlZEl0ZW1FZGl0b3I6IFNlbGVjdGVkSXRlbUVkaXRvcikge1xyXG5cclxuICAgICAgICBjb25zdCBhY3Rpb25zID0gc3RvcmUuYWN0aW9ucywgZXZlbnRzID0gc3RvcmUuZXZlbnRzO1xyXG5cclxuICAgICAgICBldmVudHMuc3Vic2NyaWJlKG0gPT4gY29uc29sZS5sb2coXCJldmVudFwiLCBtLnR5cGUsIG0uZGF0YSkpO1xyXG4gICAgICAgIGFjdGlvbnMuc3Vic2NyaWJlKG0gPT4gY29uc29sZS5sb2coXCJhY3Rpb25cIiwgbS50eXBlLCBtLmRhdGEpKTtcclxuXHJcbiAgICAgICAgZXZlbnRzLmFwcC5mb250TG9hZGVkLm9ic2VydmUoKS5maXJzdCgpLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMud29ya3NwYWNlQ29udHJvbGxlciA9IG5ldyBXb3Jrc3BhY2VDb250cm9sbGVyKHN0b3JlLCBtLmRhdGEpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZXZlbnRzLmFwcC5yZXRhaW5lZFN0YXRlTG9hZEF0dGVtcHRDb21wbGV0ZS5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW0uZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vIGF1dG9zYXZlIGRhdGEgbG9hZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guY3JlYXRlLmRpc3BhdGNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2suYWRkLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6IFwiRklERExFU1RJQ0tTXCIsIHRleHRDb2xvcjogXCJsaWdodGJsdWVcIiwgZm9udFNpemU6IDEyOCB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIEF1dG8tc2F2ZSBpbiBvbmUgbGluZTogZ290dGEgbG92ZSBpdC5cclxuICAgICAgICAgICAgICAgIGV2ZW50cy5hcHAucmV0YWluZWRTdGF0ZUNoYW5nZWQub2JzZXJ2ZSgpLmRlYm91bmNlKDgwMCkuc3Vic2NyaWJlKHN0YXRlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLmFwcC5zYXZlUmV0YWluZWRTdGF0ZS5kaXNwYXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5hcHAubG9hZFJldGFpbmVkU3RhdGUuZGlzcGF0Y2goKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZXZlbnRzLnNrZXRjaC5sb2FkZWQuc3Vic2NyaWJlKGV2ID0+XHJcbiAgICAgICAgICAgICQoXCIjbWFpbkNhbnZhc1wiKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGV2LmRhdGEuYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQuc3Vic2NyaWJlKGV2ID0+XHJcbiAgICAgICAgICAgICQoXCIjbWFpbkNhbnZhc1wiKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGV2LmRhdGEuYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmNsYXNzIEFjdGlvbnMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XHJcbiAgICBcclxuICAgIGFwcCA9IHsgICAgICAgXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5zdHJ1Y3RzIFN0b3JlIHRvIGxvYWQgcmV0YWluZWQgc3RhdGUgZnJvbSBsb2NhbCBzdG9yYWdlLCBpZiBpdCBleGlzdHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbG9hZFJldGFpbmVkU3RhdGU6IHRoaXMudG9waWM8dm9pZD4oXCJhcHAubG9hZFJldGFpbmVkU3RhdGVcIiksXHJcbiAgICAgICAgXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5zdHJ1Y3RzIFN0b3JlIHRvIHNhdmUgcmV0YWluZWQgc3RhdGUgdG8gbG9jYWwgc3RvcmFnZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzYXZlUmV0YWluZWRTdGF0ZTogdGhpcy50b3BpYzx2b2lkPihcImFwcC5zYXZlUmV0YWluZWRTdGF0ZVwiKSxcclxuICAgICAgICBcclxuICAgICAgICBsb2FkRm9udDogdGhpcy50b3BpYzxzdHJpbmc+KFwiYXBwLmxvYWRGb250XCIpXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBkZXNpZ25lciA9IHtcclxuICAgICAgICB6b29tVG9GaXQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci56b29tVG9GaXRcIiksXHJcbiAgICAgICAgZXhwb3J0aW5nSW1hZ2U6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRJbWFnZVwiKSxcclxuICAgICAgICBleHBvcnRQTkc6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRQTkdcIiksXHJcbiAgICAgICAgZXhwb3J0U1ZHOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0U1ZHXCIpLFxyXG4gICAgICAgIHZpZXdDaGFuZ2VkOiB0aGlzLnRvcGljPHBhcGVyLlJlY3RhbmdsZT4oXCJkZXNpZ25lci52aWV3Q2hhbmdlZFwiKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBza2V0Y2ggPSB7XHJcbiAgICAgICAgY3JlYXRlOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmNyZWF0ZVwiKSxcclxuICAgICAgICBhdHRyVXBkYXRlOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmF0dHJVcGRhdGVcIiksXHJcbiAgICAgICAgc2V0RWRpdGluZ0l0ZW06IHRoaXMudG9waWM8UG9zaXRpb25lZE9iamVjdFJlZj4oXCJza2V0Y2guc2V0RWRpdGluZ0l0ZW1cIiksXHJcbiAgICAgICAgc2V0U2VsZWN0aW9uOiB0aGlzLnRvcGljPFdvcmtzcGFjZU9iamVjdFJlZj4oXCJza2V0Y2guc2V0U2VsZWN0aW9uXCIpLFxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGV4dEJsb2NrID0ge1xyXG4gICAgICAgIGFkZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFkZFwiKSxcclxuICAgICAgICB1cGRhdGVBdHRyOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sudXBkYXRlQXR0clwiKSxcclxuICAgICAgICB1cGRhdGVBcnJhbmdlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sudXBkYXRlQXJyYW5nZVwiKSxcclxuICAgICAgICByZW1vdmU6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5yZW1vdmVcIilcclxuICAgIH07XHJcbiAgICBcclxufVxyXG5cclxuY2xhc3MgRXZlbnRzIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWwge1xyXG4gICAgXHJcbiAgICBhcHAgPSB7XHJcbiAgICAgICAgcmVzb3VyY2VzUmVhZHk6IHRoaXMudG9waWM8Ym9vbGVhbj4oXCJhcHAucmVzb3VyY2VzUmVhZHlcIiksXHJcbiAgICAgICAgcmV0YWluZWRTdGF0ZUxvYWRBdHRlbXB0Q29tcGxldGU6IHRoaXMudG9waWM8Ym9vbGVhbj4oXCJhcHAucmV0YWluZWRTdGF0ZUxvYWRBdHRlbXB0Q29tcGxldGVcIiksXHJcbiAgICAgICAgcmV0YWluZWRTdGF0ZUNoYW5nZWQ6IHRoaXMudG9waWM8UmV0YWluZWRTdGF0ZT4oXCJhcHAucmV0YWluZWRTdGF0ZUNoYW5nZWRcIiksXHJcbiAgICAgICAgZm9udExvYWRlZDogdGhpcy50b3BpYzxvcGVudHlwZS5Gb250PihcImFwcC5mb250TG9hZGVkXCIpXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGRlc2lnbmVyID0ge1xyXG4gICAgICAgIHpvb21Ub0ZpdFJlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZFwiKSxcclxuICAgICAgICBleHBvcnRQTkdSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRQTkdSZXF1ZXN0ZWRcIiksXHJcbiAgICAgICAgZXhwb3J0U1ZHUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0U1ZHUmVxdWVzdGVkXCIpLFxyXG4gICAgICAgIHZpZXdDaGFuZ2VkOiB0aGlzLnRvcGljPHBhcGVyLlJlY3RhbmdsZT4oXCJkZXNpZ25lci52aWV3Q2hhbmdlZFwiKVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2tldGNoID0ge1xyXG4gICAgICAgIGxvYWRlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmxvYWRlZFwiKSxcclxuICAgICAgICBhdHRyQ2hhbmdlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmF0dHJDaGFuZ2VkXCIpLFxyXG4gICAgICAgIGVkaXRpbmdJdGVtQ2hhbmdlZDogdGhpcy50b3BpYzxQb3NpdGlvbmVkT2JqZWN0UmVmPihcInNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWRcIiksXHJcbiAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogdGhpcy50b3BpYzxXb3Jrc3BhY2VPYmplY3RSZWY+KFwic2tldGNoLnNlbGVjdGlvbkNoYW5nZWRcIiksXHJcbiAgICAgICAgc2F2ZUxvY2FsUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwic2tldGNoLnNhdmVsb2NhbC5zYXZlTG9jYWxSZXF1ZXN0ZWRcIilcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRleHRibG9jayA9IHtcclxuICAgICAgICBhZGRlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFkZGVkXCIpLFxyXG4gICAgICAgIGF0dHJDaGFuZ2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYXR0ckNoYW5nZWRcIiksXHJcbiAgICAgICAgYXJyYW5nZUNoYW5nZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hcnJhbmdlQ2hhbmdlZFwiKSxcclxuICAgICAgICByZW1vdmVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sucmVtb3ZlZFwiKSxcclxuICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5sb2FkZWRcIiksXHJcbiAgICAgICAgZWRpdG9yQ2xvc2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suZWRpdG9yQ2xvc2VkXCIpLFxyXG4gICAgfTtcclxuICAgIFxyXG59XHJcblxyXG5jbGFzcyBDaGFubmVscyB7XHJcbiAgICBhY3Rpb25zOiBBY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgIGV2ZW50czogRXZlbnRzID0gbmV3IEV2ZW50cygpO1xyXG59XHJcbiIsIlxyXG5jbGFzcyBGb250RmFtaWxpZXNMb2FkZXIge1xyXG5cclxuICAgIGxvYWRMaXN0TG9jYWwoY2FsbGJhY2s6IChmYW1pbGllczogRm9udEZhbWlseVtdKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiBcImZvbnRzL2dvb2dsZS1mb250cy5qc29uXCIsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2U6IHsga2luZDogc3RyaW5nLCBpdGVtczogRm9udEZhbWlseVtdIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIG1ha2UgZmlsZXMgaHR0c1xyXG4gICAgICAgICAgICAgICAgZm9yKGNvbnN0IGZhbSBvZiByZXNwb25zZS5pdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uZm9yT3duKGZhbS5maWxlcywgKHZhbDogc3RyaW5nLCBrZXk6c3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKF8uc3RhcnRzV2l0aCh2YWwsIFwiaHR0cDpcIikpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFtLmZpbGVzW2tleV0gPSB2YWwucmVwbGFjZShcImh0dHA6XCIsIFwiaHR0cHM6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJlc3BvbnNlLml0ZW1zKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6ICh4aHIsIHN0YXR1cywgZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZ29vZ2xlLWZvbnRzLmpzb25cIiwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkTGlzdFJlbW90ZShjYWxsYmFjazogKGZhbWlsaWVzOiBGb250RmFtaWx5W10pID0+IHZvaWQpIHtcclxuICAgICAgICB2YXIgdXJsID0gJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3dlYmZvbnRzL3YxL3dlYmZvbnRzPyc7XHJcbiAgICAgICAgdmFyIGtleSA9ICdrZXk9R09PR0xFLUFQSS1LRVknO1xyXG4gICAgICAgIHZhciBzb3J0ID0gXCJwb3B1bGFyaXR5XCI7XHJcbiAgICAgICAgdmFyIG9wdCA9ICdzb3J0PScgKyBzb3J0ICsgJyYnO1xyXG4gICAgICAgIHZhciByZXEgPSB1cmwgKyBvcHQgKyBrZXk7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogcmVxLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlOiB7IGtpbmQ6IHN0cmluZywgaXRlbXM6IEZvbnRGYW1pbHlbXSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhyZXNwb25zZS5pdGVtcyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiAoeGhyLCBzdGF0dXMsIGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcih1cmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZvclByZXZpZXcoZmFtaWxpZXM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaHVuayBvZiBfLmNodW5rKGZhbWlsaWVzLCAxMCkpIHtcclxuICAgICAgICAgICAgV2ViRm9udC5sb2FkKHtcclxuICAgICAgICAgICAgICAgIGNsYXNzZXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZ29vZ2xlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmFtaWxpZXM6IDxzdHJpbmdbXT5jaHVuayxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbnR5cGUgUGFyc2VkRm9udExvYWRlZCA9ICh1cmw6IHN0cmluZywgZm9udDogb3BlbnR5cGUuRm9udCkgPT4gdm9pZDsgXHJcblxyXG5jbGFzcyBQYXJzZWRGb250cyB7XHJcblxyXG4gICAgZm9udHM6IHsgW3VybDogc3RyaW5nXTogb3BlbnR5cGUuRm9udDsgfSA9IHt9O1xyXG5cclxuICAgIHByaXZhdGUgX2ZvbnRMb2FkZWQ6IFBhcnNlZEZvbnRMb2FkZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udExvYWRlZDogUGFyc2VkRm9udExvYWRlZCl7XHJcbiAgICAgICAgdGhpcy5fZm9udExvYWRlZCA9IGZvbnRMb2FkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGZvbnRVcmw6IHN0cmluZywgb25SZWFkeTogUGFyc2VkRm9udExvYWRlZCA9IG51bGwpIHtcclxuICAgICAgICBsZXQgZm9udCA9IHRoaXMuZm9udHNbZm9udFVybF07XHJcblxyXG4gICAgICAgIGlmIChmb250KSB7XHJcbiAgICAgICAgICAgIG9uUmVhZHkgJiYgb25SZWFkeShmb250VXJsLCBmb250KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3BlbnR5cGUubG9hZChmb250VXJsLCAoZXJyLCBmb250KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9udHNbZm9udFVybF0gPSBmb250O1xyXG4gICAgICAgICAgICAgICAgb25SZWFkeSAmJiBvblJlYWR5KGZvbnRVcmwsIGZvbnQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udExvYWRlZChmb250VXJsLCBmb250KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiXHJcbm5hbWVzcGFjZSBTM0FjY2VzcyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGxvYWQgZmlsZSB0byBhcHBsaWNhdGlvbiBTMyBidWNrZXRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHVwbG9hZChmaWxlTmFtZTogc3RyaW5nLCBmaWxlVHlwZTogc3RyaW5nLCBkYXRhOiBCbG9iKSB7XHJcbiAgICAgICAgY29uc3Qgc2lnblVybCA9IGAvc2lnbl9zMz9maWxlX25hbWU9JHtmaWxlTmFtZX0mZmlsZV90eXBlPSR7ZmlsZVR5cGV9YDtcclxuICAgICAgICAvLyBnZXQgc2lnbmVkIFVSTFxyXG4gICAgICAgICQuZ2V0SlNPTihzaWduVXJsKVxyXG4gICAgICAgICAgICAuZG9uZShzaWduUmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBQVVQgZmlsZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcHV0UmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBzaWduUmVzcG9uc2Uuc2lnbmVkX3JlcXVlc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hbXotYWNsJzogJ3B1YmxpYy1yZWFkJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZpbGVUeXBlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHB1dFJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAuZG9uZShwdXRSZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cGxvYWRlZCBmaWxlXCIsIHNpZ25SZXNwb25zZS51cmwpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZhaWwoZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3IgdXBsb2FkaW5nIHRvIFMzXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIG9uIHNpZ25fczNcIiwgZXJyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxufSIsIlxyXG4vKipcclxuICogVGhlIHNpbmdsZXRvbiBTdG9yZSBjb250cm9scyBhbGwgYXBwbGljYXRpb24gc3RhdGUuXHJcbiAqIE5vIHBhcnRzIG91dHNpZGUgb2YgdGhlIFN0b3JlIG1vZGlmeSBhcHBsaWNhdGlvbiBzdGF0ZS5cclxuICogQ29tbXVuaWNhdGlvbiB3aXRoIHRoZSBTdG9yZSBpcyBkb25lIHRocm91Z2ggbWVzc2FnZSBDaGFubmVsczogXHJcbiAqICAgLSBBY3Rpb25zIGNoYW5uZWwgdG8gc2VuZCBpbnRvIHRoZSBTdG9yZSxcclxuICogICAtIEV2ZW50cyBjaGFubmVsIHRvIHJlY2VpdmUgbm90aWZpY2F0aW9uIGZyb20gdGhlIFN0b3JlLlxyXG4gKiBPbmx5IHRoZSBTdG9yZSBjYW4gcmVjZWl2ZSBhY3Rpb24gbWVzc2FnZXMuXHJcbiAqIE9ubHkgdGhlIFN0b3JlIGNhbiBzZW5kIGV2ZW50IG1lc3NhZ2VzLlxyXG4gKiBUaGUgU3RvcmUgY2Fubm90IHNlbmQgYWN0aW9ucyBvciBsaXN0ZW4gdG8gZXZlbnRzICh0byBhdm9pZCBsb29wcykuXHJcbiAqIE1lc3NhZ2VzIGFyZSB0byBiZSB0cmVhdGVkIGFzIGltbXV0YWJsZS5cclxuICogQWxsIG1lbnRpb25zIG9mIHRoZSBTdG9yZSBjYW4gYmUgYXNzdW1lZCB0byBtZWFuLCBvZiBjb3Vyc2UsXHJcbiAqICAgXCJUaGUgU3RvcmUgYW5kIGl0cyBzdWItY29tcG9uZW50cy5cIlxyXG4gKi9cclxuY2xhc3MgU3RvcmUge1xyXG5cclxuICAgIHN0YXRpYyBST0JPVE9fNTAwX0xPQ0FMID0gJ2ZvbnRzL1JvYm90by01MDAudHRmJztcclxuICAgIHN0YXRpYyBBVVRPU0FWRV9LRVkgPSBcIkZpZGRsZXN0aWNrcy5yZXRhaW5lZFN0YXRlXCI7XHJcbiAgICBzdGF0aWMgREVGQVVMVF9GT05UX05BTUUgPSBcIlJvYm90b1wiO1xyXG4gICAgc3RhdGljIEZPTlRfTElTVF9MSU1JVCA9IDEwMDtcclxuXHJcbiAgICBzdGF0ZSA9IHtcclxuICAgICAgICByZXRhaW5lZDogPFJldGFpbmVkU3RhdGU+e1xyXG4gICAgICAgICAgICBza2V0Y2g6IHRoaXMuY3JlYXRlU2tldGNoKClcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRpc3Bvc2FibGU6IDxEaXNwb3NhYmxlU3RhdGU+e31cclxuICAgIH1cclxuICAgIHJlc291cmNlcyA9IHtcclxuICAgICAgICBmb250RmFtaWxpZXM6IDxEaWN0aW9uYXJ5PEZvbnRGYW1pbHk+Pnt9LFxyXG4gICAgICAgIHBhcnNlZEZvbnRzOiBuZXcgUGFyc2VkRm9udHMoKHVybCwgZm9udCkgPT5cclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuYXBwLmZvbnRMb2FkZWQuZGlzcGF0Y2goZm9udCkpXHJcbiAgICB9XHJcbiAgICBhY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgIGV2ZW50cyA9IG5ldyBFdmVudHMoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnNldHVwU3Vic2NyaXB0aW9ucygpO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRSZXNvdXJjZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cFN1YnNjcmlwdGlvbnMoKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuYWN0aW9ucywgZXZlbnRzID0gdGhpcy5ldmVudHM7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIEFwcCAtLS0tLVxyXG5cclxuICAgICAgICBhY3Rpb25zLmFwcC5sb2FkUmV0YWluZWRTdGF0ZS5vYnNlcnZlKClcclxuICAgICAgICAgICAgLy8gV2FybmluZzogc3Vic2NyaWJpbmcgdG8gZXZlbnQgd2l0aGluIFN0b3JlIC0gY3Jhenkgb3Igbm90Pz9cclxuICAgICAgICAgICAgLy8gd2FpdCB0byBsb2FkIHVudGlsIHJlc291cmNlcyBhcmUgcmVhZHlcclxuICAgICAgICAgICAgLnBhdXNhYmxlQnVmZmVyZWQoZXZlbnRzLmFwcC5yZXNvdXJjZXNSZWFkeS5vYnNlcnZlKCkubWFwKG0gPT4gbS5kYXRhKSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzdWNjZXNzID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFsb2NhbFN0b3JhZ2UgfHwgIWxvY2FsU3RvcmFnZS5nZXRJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90IHN1cHBvcnRlZFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzYXZlZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFN0b3JlLkFVVE9TQVZFX0tFWSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2F2ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2FkZWQgPSA8UmV0YWluZWRTdGF0ZT5KU09OLnBhcnNlKHNhdmVkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9hZGVkICYmIGxvYWRlZC5za2V0Y2ggJiYgbG9hZGVkLnNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRhdGEgc2VlbXMgbGVnaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXRhaW5lZCA9IGxvYWRlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy5za2V0Y2gubG9hZGVkLmRpc3BhdGNoKHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCB0YiBvZiB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmxvYWRlZC5kaXNwYXRjaCh0Yik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZC5kaXNwYXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBldmVudHMuYXBwLnJldGFpbmVkU3RhdGVMb2FkQXR0ZW1wdENvbXBsZXRlLmRpc3BhdGNoKHN1Y2Nlc3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5hcHAuc2F2ZVJldGFpbmVkU3RhdGUuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZSB8fCAhbG9jYWxTdG9yYWdlLmdldEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBzdXBwb3J0ZWRcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU3RvcmUuQVVUT1NBVkVfS0VZLCBKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXRlLnJldGFpbmVkKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuYXBwLmxvYWRGb250LnN1YnNjcmliZShtID0+XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChtLmRhdGEpKTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gRGVzaWduZXIgLS0tLS1cclxuXHJcbiAgICAgICAgYWN0aW9ucy5kZXNpZ25lci56b29tVG9GaXQuZm9yd2FyZChcclxuICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZCk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuZGVzaWduZXIuZXhwb3J0UE5HLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgIGV2ZW50cy5kZXNpZ25lci5leHBvcnRQTkdSZXF1ZXN0ZWQuZGlzcGF0Y2gobS5kYXRhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5kZXNpZ25lci5leHBvcnRTVkcuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLmV4cG9ydFNWR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLmRlc2lnbmVyLnZpZXdDaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgLy8gQ2FuJ3QgZG8gdGhpcywgZHVlIHRvIGNoYW5jZSBvZiBhY2NpZGVudGFsIGNsb3NpbmcgICBcclxuICAgICAgICAgICAgLy8gdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLnZpZXdDaGFuZ2VkLmRpc3BhdGNoKG0uZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIFNrZXRjaCAtLS0tLVxyXG5cclxuICAgICAgICBhY3Rpb25zLnNrZXRjaC5jcmVhdGVcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgobSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2ggPSB0aGlzLmNyZWF0ZVNrZXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0Y2ggPSBtLmRhdGEgfHwge307XHJcbiAgICAgICAgICAgICAgICBwYXRjaC5iYWNrZ3JvdW5kQ29sb3IgPSBwYXRjaC5iYWNrZ3JvdW5kQ29sb3IgfHwgJyNmNmYzZWInO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ24odGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gsIHBhdGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBldmVudHMuc2tldGNoLmxvYWRlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaCk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkLmRpc3BhdGNoKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoLmRlZmF1bHRGb250RGVzYy51cmwpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkUmV0YWluZWRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduKHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoLCBldi5kYXRhKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkUmV0YWluZWRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guc2V0RWRpdGluZ0l0ZW0uc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG0uZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKG0uZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvLyAtLS0tLSBUZXh0QmxvY2sgLS0tLS1cclxuXHJcbiAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2suYWRkXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcGF0Y2ggPSBldi5kYXRhO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwYXRjaC50ZXh0IHx8ICFwYXRjaC50ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHsgX2lkOiBuZXdpZCgpIH0gYXMgVGV4dEJsb2NrO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ24oYmxvY2ssIHBhdGNoKTtcclxuICAgICAgICAgICAgICAgIGlmICghYmxvY2suZm9udFNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5mb250U2l6ZSA9IDEyODtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghYmxvY2sudGV4dENvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sudGV4dENvbG9yID0gXCJncmF5XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChibG9jay5mb250RGVzYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoLmRlZmF1bHRGb250RGVzYyA9IGJsb2NrLmZvbnREZXNjO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5mb250RGVzYyA9IHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoLmRlZmF1bHRGb250RGVzYztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC50ZXh0QmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLnRleHRibG9jay5hZGRlZC5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRSZXRhaW5lZFN0YXRlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5nZXRCbG9jayhldi5kYXRhLl9pZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGF0Y2ggPSA8VGV4dEJsb2NrPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXYuZGF0YS50ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGV2LmRhdGEuYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Q29sb3I6IGV2LmRhdGEudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250RGVzYzogZXYuZGF0YS5mb250RGVzYyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IGV2LmRhdGEuZm9udFNpemVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduKGJsb2NrLCBwYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLmZvbnREZXNjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucmV0YWluZWQuc2tldGNoLmRlZmF1bHRGb250RGVzYyA9IGJsb2NrLmZvbnREZXNjO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmF0dHJDaGFuZ2VkLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRSZXRhaW5lZFN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5yZW1vdmVcclxuICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGlkRGVsZXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBfLnJlbW92ZSh0aGlzLnN0YXRlLnJldGFpbmVkLnNrZXRjaC50ZXh0QmxvY2tzLCB0YiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRiLl9pZCA9PT0gZXYuZGF0YS5faWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlkRGVsZXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlkRGVsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnRleHRibG9jay5yZW1vdmVkLmRpc3BhdGNoKHsgX2lkOiBldi5kYXRhLl9pZCB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRSZXRhaW5lZFN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2VcclxuICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB0aGlzLmdldEJsb2NrKGV2LmRhdGEuX2lkKTtcclxuICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnBvc2l0aW9uID0gZXYuZGF0YS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5vdXRsaW5lID0gZXYuZGF0YS5vdXRsaW5lO1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXJyYW5nZUNoYW5nZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFJldGFpbmVkU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFJlc291cmNlcygpIHtcclxuICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgRm9udEZhbWlsaWVzTG9hZGVyKCk7XHJcbiAgICAgICAgbG9hZGVyLmxvYWRMaXN0TG9jYWwoZmFtaWxpZXMgPT4ge1xyXG4gICAgICAgICAgICBmYW1pbGllcy5sZW5ndGggPSBTdG9yZS5GT05UX0xJU1RfTElNSVQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpY3QgPSB0aGlzLnJlc291cmNlcy5mb250RmFtaWxpZXM7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmFtaWx5R3JvdXAgb2YgZmFtaWxpZXMpIHtcclxuICAgICAgICAgICAgICAgIGRpY3RbZmFtaWx5R3JvdXAuZmFtaWx5XSA9IGZhbWlseUdyb3VwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBsb2FkIGZvbnRzIGludG8gYnJvd3NlciBmb3IgcHJldmlld1xyXG4gICAgICAgICAgICBsb2FkZXIubG9hZEZvclByZXZpZXcoZmFtaWxpZXMubWFwKGYgPT4gZi5mYW1pbHkpKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChTdG9yZS5ST0JPVE9fNTAwX0xPQ0FMKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmFwcC5yZXNvdXJjZXNSZWFkeS5kaXNwYXRjaCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VkUmV0YWluZWRTdGF0ZSgpIHtcclxuICAgICAgICB0aGlzLmV2ZW50cy5hcHAucmV0YWluZWRTdGF0ZUNoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5yZXRhaW5lZCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXNzaWduPFQ+KGRlc3Q6IFQsIHNvdXJjZTogVCkge1xyXG4gICAgICAgIF8ubWVyZ2UoZGVzdCwgc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTa2V0Y2goKTogU2tldGNoIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBfaWQ6IG5ld2lkKCksXHJcbiAgICAgICAgICAgIGRlZmF1bHRGb250RGVzYzoge1xyXG4gICAgICAgICAgICAgICAgZmFtaWx5OiBcIlJvYm90b1wiLFxyXG4gICAgICAgICAgICAgICAgdmFyaWFudDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBTdG9yZS5ST0JPVE9fNTAwX0xPQ0FMXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRleHRCbG9ja3M6IDxUZXh0QmxvY2tbXT5bXVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRTZWxlY3Rpb24oaXRlbTogV29ya3NwYWNlT2JqZWN0UmVmKSB7XHJcbiAgICAgICAgLy8gZWFybHkgZXhpdCBvbiBubyBjaGFuZ2VcclxuICAgICAgICBpZihpdGVtKXtcclxuICAgICAgICAgICAgaWYodGhpcy5zdGF0ZS5kaXNwb3NhYmxlLnNlbGVjdGlvbiBcclxuICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuZGlzcG9zYWJsZS5zZWxlY3Rpb24uaXRlbUlkID09PSBpdGVtLml0ZW1JZCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZighdGhpcy5zdGF0ZS5kaXNwb3NhYmxlLnNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnN0YXRlLmRpc3Bvc2FibGUuc2VsZWN0aW9uID0gaXRlbTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guc2VsZWN0aW9uQ2hhbmdlZC5kaXNwYXRjaChpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEVkaXRpbmdJdGVtKGl0ZW06IFBvc2l0aW9uZWRPYmplY3RSZWYpIHtcclxuICAgICAgICAvLyBlYXJseSBleGl0IG9uIG5vIGNoYW5nZVxyXG4gICAgICAgIGlmKGl0ZW0pe1xyXG4gICAgICAgICAgICBpZih0aGlzLnN0YXRlLmRpc3Bvc2FibGUuZWRpdGluZ0l0ZW0gXHJcbiAgICAgICAgICAgICAgICAmJiB0aGlzLnN0YXRlLmRpc3Bvc2FibGUuZWRpdGluZ0l0ZW0uaXRlbUlkID09PSBpdGVtLml0ZW1JZCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZighdGhpcy5zdGF0ZS5kaXNwb3NhYmxlLmVkaXRpbmdJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZGlzcG9zYWJsZS5lZGl0aW5nSXRlbSkge1xyXG4gICAgICAgICAgICAvLyBzaWduYWwgY2xvc2luZyBlZGl0b3IgZm9yIGl0ZW1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHRoaXMuc3RhdGUuZGlzcG9zYWJsZS5lZGl0aW5nSXRlbS5pdGVtVHlwZSA9PT0gXCJUZXh0QmxvY2tcIil7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RWRpdGluZ0Jsb2NrID0gdGhpcy5nZXRCbG9jayh0aGlzLnN0YXRlLmRpc3Bvc2FibGUuZWRpdGluZ0l0ZW0uaXRlbUlkKTtcclxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRFZGl0aW5nQmxvY2spe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5lZGl0b3JDbG9zZWQuZGlzcGF0Y2goY3VycmVudEVkaXRpbmdCbG9jayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoaXRlbSl7XHJcbiAgICAgICAgICAgIC8vIGVkaXRpbmcgaXRlbSBzaG91bGQgYmUgc2VsZWN0ZWQgaXRlbVxyXG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdGF0ZS5kaXNwb3NhYmxlLmVkaXRpbmdJdGVtID0gaXRlbTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkLmRpc3BhdGNoKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0QmxvY2soaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBfLmZpbmQodGhpcy5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gudGV4dEJsb2NrcywgdGIgPT4gdGIuX2lkID09PSBpZCk7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbnR5cGUgQWN0aW9uVHlwZXMgPSBcclxuICAgIFwic2tldGNoLmNyZWF0ZVwiXHJcbiAgICB8IFwic2tldGNoLnVwZGF0ZVwiXHJcbiAgICB8IFwidGV4dGJsb2NrLmFkZFwiXHJcbiAgICB8IFwidGV4dGJsb2NrLnVwZGF0ZVwiO1xyXG5cclxudHlwZSBFdmVudFR5cGVzID1cclxuICAgIFwic2tldGNoLmxvYWRlZFwiXHJcbiAgICB8IFwic2tldGNoLmNoYW5nZWRcIlxyXG4gICAgfCBcInRleHRibG9jay5hZGRlZFwiXHJcbiAgICB8IFwidGV4dGJsb2NrLmNoYW5nZWRcIjtcclxuIiwiXHJcbmNvbnN0IFNrZXRjaEhlbHBlcnMgPSB7XHJcbiAgICBcclxuICAgIGNvbG9yc0luVXNlKHNrZXRjaDogU2tldGNoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIGxldCBjb2xvcnMgPSBbIHNrZXRjaC5iYWNrZ3JvdW5kQ29sb3IgXTtcclxuICAgICAgICBmb3IoY29uc3QgYmxvY2sgb2Ygc2tldGNoLnRleHRCbG9ja3Mpe1xyXG4gICAgICAgICAgICBjb2xvcnMucHVzaChibG9jay5iYWNrZ3JvdW5kQ29sb3IpO1xyXG4gICAgICAgICAgICBjb2xvcnMucHVzaChibG9jay50ZXh0Q29sb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb2xvcnMgPSBfLnVuaXEoY29sb3JzLmZpbHRlcihjID0+IGMgIT0gbnVsbCkpO1xyXG4gICAgICAgIGNvbG9ycy5zb3J0KCk7XHJcbiAgICAgICAgcmV0dXJuIGNvbG9ycztcclxuICAgIH1cclxuICAgIFxyXG59IiwiXHJcbmludGVyZmFjZSBSZXRhaW5lZFN0YXRlIHtcclxuICAgIHNrZXRjaDogU2tldGNoO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRGlzcG9zYWJsZVN0YXRlIHtcclxuICAgIGVkaXRpbmdJdGVtPzogUG9zaXRpb25lZE9iamVjdFJlZjtcclxuICAgIHNlbGVjdGlvbj86IFdvcmtzcGFjZU9iamVjdFJlZjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFNrZXRjaCBleHRlbmRzIFNrZXRjaEF0dHIge1xyXG4gICAgX2lkOiBzdHJpbmc7XHJcbiAgICB0ZXh0QmxvY2tzPzogVGV4dEJsb2NrW107XHJcbn1cclxuXHJcbmludGVyZmFjZSBTa2V0Y2hBdHRyIHtcclxuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIGRlZmF1bHRGb250RGVzYz86IEZvbnREZXNjcmlwdGlvbjtcclxuICAgIGxvYWRpbmc/OiBib29sZWFuO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRm9udEZhbWlseSB7XHJcbiAgICBraW5kPzogc3RyaW5nO1xyXG4gICAgZmFtaWx5Pzogc3RyaW5nO1xyXG4gICAgY2F0ZWdvcnk/OiBzdHJpbmc7XHJcbiAgICB2YXJpYW50cz86IHN0cmluZ1tdO1xyXG4gICAgc3Vic2V0cz86IHN0cmluZ1tdO1xyXG4gICAgdmVyc2lvbj86IHN0cmluZztcclxuICAgIGxhc3RNb2RpZmllZD86IHN0cmluZztcclxuICAgIGZpbGVzPzogeyBbdmFyaWFudDogc3RyaW5nXSA6IHN0cmluZzsgfTtcclxufVxyXG5cclxuaW50ZXJmYWNlIEZvbnREZXNjcmlwdGlvbiB7XHJcbiAgICBmYW1pbHk6IHN0cmluZztcclxuICAgIGNhdGVnb3J5OiBzdHJpbmc7XHJcbiAgICB2YXJpYW50OiBzdHJpbmc7XHJcbiAgICB1cmw6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFdvcmtzcGFjZU9iamVjdFJlZiB7XHJcbiAgICBpdGVtSWQ6IHN0cmluZztcclxuICAgIGl0ZW1UeXBlPzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUG9zaXRpb25lZE9iamVjdFJlZiBleHRlbmRzIFdvcmtzcGFjZU9iamVjdFJlZiB7XHJcbiAgICBjbGllbnRYPzogbnVtYmVyO1xyXG4gICAgY2xpZW50WT86IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFRleHRCbG9jayBleHRlbmRzIEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgX2lkPzogc3RyaW5nO1xyXG4gICAgdGV4dD86IHN0cmluZztcclxuICAgIHRleHRDb2xvcj86IHN0cmluZztcclxuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIGZvbnREZXNjPzogRm9udERlc2NyaXB0aW9uO1xyXG4gICAgZm9udFNpemU/OiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBCbG9ja0FycmFuZ2VtZW50IHtcclxuICAgIHBvc2l0aW9uPzogbnVtYmVyW10sXHJcbiAgICBvdXRsaW5lPzoge1xyXG4gICAgICAgIHRvcDogUGF0aFJlY29yZCxcclxuICAgICAgICBib3R0b206IFBhdGhSZWNvcmRcclxuICAgIH0gICAgXHJcbn1cclxuXHJcbmludGVyZmFjZSBCYWNrZ3JvdW5kQWN0aW9uU3RhdHVzIHtcclxuICAgIGFjdGlvbj86IE9iamVjdDtcclxuICAgIHJlamVjdGVkPzogYm9vbGVhbjtcclxuICAgIGVycm9yPzogYm9vbGVhblxyXG4gICAgbWVzc2FnZT86IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFBhdGhSZWNvcmQge1xyXG4gICAgc2VnbWVudHM6IFNlZ21lbnRSZWNvcmRbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxyXG4gKi9cclxudHlwZSBTZWdtZW50UmVjb3JkID0gQXJyYXk8UG9pbnRSZWNvcmQ+IHwgQXJyYXk8bnVtYmVyPjtcclxuXHJcbnR5cGUgUG9pbnRSZWNvcmQgPSBBcnJheTxudW1iZXI+O1xyXG4iLCJuYW1lc3BhY2UgQ29sb3JQaWNrZXIge1xyXG5cclxuICAgIGNvbnN0IERFRkFVTFRfUEFMRVRURSA9IFtcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzgwN1xyXG4gICAgICAgICAgICBcIiNlZTQwMzVcIixcclxuICAgICAgICAgICAgXCIjZjM3NzM2XCIsXHJcbiAgICAgICAgICAgIFwiI2ZkZjQ5OFwiLFxyXG4gICAgICAgICAgICBcIiM3YmMwNDNcIixcclxuICAgICAgICAgICAgXCIjMDM5MmNmXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzg5NFxyXG4gICAgICAgICAgICBcIiNlZGM5NTFcIixcclxuICAgICAgICAgICAgXCIjZWI2ODQxXCIsXHJcbiAgICAgICAgICAgIFwiI2NjMmEzNlwiLFxyXG4gICAgICAgICAgICBcIiM0ZjM3MmRcIixcclxuICAgICAgICAgICAgXCIjMDBhMGIwXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzE2NFxyXG4gICAgICAgICAgICBcIiMxYjg1YjhcIixcclxuICAgICAgICAgICAgXCIjNWE1MjU1XCIsXHJcbiAgICAgICAgICAgIFwiIzU1OWU4M1wiLFxyXG4gICAgICAgICAgICBcIiNhZTVhNDFcIixcclxuICAgICAgICAgICAgXCIjYzNjYjcxXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzM4OVxyXG4gICAgICAgICAgICBcIiM0YjM4MzJcIixcclxuICAgICAgICAgICAgXCIjODU0NDQyXCIsXHJcbiAgICAgICAgICAgIFwiI2ZmZjRlNlwiLFxyXG4gICAgICAgICAgICBcIiMzYzJmMmZcIixcclxuICAgICAgICAgICAgXCIjYmU5YjdiXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzQ1NVxyXG4gICAgICAgICAgICBcIiNmZjRlNTBcIixcclxuICAgICAgICAgICAgXCIjZmM5MTNhXCIsXHJcbiAgICAgICAgICAgIFwiI2Y5ZDYyZVwiLFxyXG4gICAgICAgICAgICBcIiNlYWUzNzRcIixcclxuICAgICAgICAgICAgXCIjZTJmNGM3XCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzcwMFxyXG4gICAgICAgICAgICBcIiNkMTExNDFcIixcclxuICAgICAgICAgICAgXCIjMDBiMTU5XCIsXHJcbiAgICAgICAgICAgIFwiIzAwYWVkYlwiLFxyXG4gICAgICAgICAgICBcIiNmMzc3MzVcIixcclxuICAgICAgICAgICAgXCIjZmZjNDI1XCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzgyNlxyXG4gICAgICAgICAgICBcIiNlOGQxNzRcIixcclxuICAgICAgICAgICAgXCIjZTM5ZTU0XCIsXHJcbiAgICAgICAgICAgIFwiI2Q2NGQ0ZFwiLFxyXG4gICAgICAgICAgICBcIiM0ZDczNThcIixcclxuICAgICAgICAgICAgXCIjOWVkNjcwXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzEyMjNcclxuICAgICAgICAgICAgXCIjZmZkNGU1XCIsXHJcbiAgICAgICAgICAgIFwiI2Q0ZmZlYVwiLFxyXG4gICAgICAgICAgICBcIiNlZWNiZmZcIixcclxuICAgICAgICAgICAgXCIjZmVmZmEzXCIsXHJcbiAgICAgICAgICAgIFwiI2RiZGNmZlwiLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICBcIiMwMDBcIiwgXCIjNjY2XCIsIFwiI2NjY1wiLCBcIiNlZWVcIiwgXCIjZmZmXCJcclxuICAgICAgICBdLFxyXG4gICAgXTtcclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gc2V0dXAoZWxlbSwgdG9wQ29sb3JzOiBzdHJpbmdbXSwgb25DaGFuZ2UpIHtcclxuICAgICAgICBjb25zdCB0b3BDb2xvcnNHcm91cGVkID0gXy5jaHVuayh0b3BDb2xvcnMsIDUpO1xyXG4gICAgICAgIGNvbnN0IHBhbGV0dGUgPSB0b3BDb2xvcnNHcm91cGVkLmNvbmNhdChERUZBVUxUX1BBTEVUVEUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzZWwgPSA8YW55PiQoZWxlbSk7XHJcbiAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oe1xyXG4gICAgICAgICAgICBzaG93SW5wdXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGFsbG93RW1wdHk6IHRydWUsXHJcbiAgICAgICAgICAgIHByZWZlcnJlZEZvcm1hdDogXCJoZXhcIixcclxuICAgICAgICAgICAgc2hvd0J1dHRvbnM6IGZhbHNlLFxyXG4gICAgICAgICAgICBzaG93QWxwaGE6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dQYWxldHRlOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93U2VsZWN0aW9uUGFsZXR0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHBhbGV0dGU6IHBhbGV0dGUsXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZUtleTogXCJza2V0Y2h0ZXh0XCIsXHJcbiAgICAgICAgICAgIGNoYW5nZTogb25DaGFuZ2VcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHNldChlbGVtOiBIVE1MRWxlbWVudCwgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICg8YW55PiQoZWxlbSkpLnNwZWN0cnVtKFwic2V0XCIsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGVzdHJveShlbGVtKSB7XHJcbiAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oXCJkZXN0cm95XCIpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBEb2N1bWVudEtleUhhbmRsZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG5cclxuICAgICAgICAvLyBub3RlOiB1bmRpc3Bvc2VkIGV2ZW50IHN1YnNjcmlwdGlvblxyXG4gICAgICAgICQoZG9jdW1lbnQpLmtleXVwKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSBEb21IZWxwZXJzLktleUNvZGVzLkVzYykge1xyXG4gICAgICAgICAgICAgICAgaWYoc3RvcmUuc3RhdGUuZGlzcG9zYWJsZS5lZGl0aW5nSXRlbSl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0RWRpdGluZ0l0ZW0uZGlzcGF0Y2gobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbn0iLCJcclxuZGVjbGFyZSB2YXIgUmVhY3RTZWxlY3Q7XHJcblxyXG5pbnRlcmZhY2UgRm9udFBpY2tlclByb3BzIHtcclxuICAgIHN0b3JlOiBTdG9yZTsgICAgXHJcbiAgICBzZWxlY3Rpb24/OiBGb250RGVzY3JpcHRpb247XHJcbiAgICBzZWxlY3Rpb25DaGFuZ2VkOiAoc2VsZWN0aW9uOiBGb250RGVzY3JpcHRpb24pID0+IHZvaWQ7XHJcbn1cclxuXHJcbmludGVyZmFjZSBGb250UGlja2VyU3RhdGUge1xyXG4gICAgZmFtaWx5T2JqZWN0PzogRm9udEZhbWlseTtcclxuICAgIHZhcmlhbnQ/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmNsYXNzIEZvbnRQaWNrZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8Rm9udFBpY2tlclByb3BzLCBGb250UGlja2VyU3RhdGU+IHtcclxuICAgIFxyXG4gICAgcHJldmlld0ZvbnRTaXplID0gXCIyOHB4XCI7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBGb250UGlja2VyUHJvcHMpe1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0YXRlID0ge307XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5wcm9wcy5zZWxlY3Rpb24pe1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmZhbWlseU9iamVjdCA9IHRoaXMucHJvcHMuc3RvcmUucmVzb3VyY2VzLmZvbnRGYW1pbGllc1t0aGlzLnByb3BzLnNlbGVjdGlvbi5mYW1pbHldO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnZhcmlhbnQgPSB0aGlzLnByb3BzLnNlbGVjdGlvbi52YXJpYW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGZhbWlseU9wdGlvblJlbmRlciA9IChvcHRpb24pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZm9udEZhbWlseSA9IG9wdGlvbi52YWx1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHJoKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcy5wcmV2aWV3Rm9udFNpemVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgW2ZvbnRGYW1pbHldKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHZhcmlhbnRPcHRpb25SZW5kZXIgPSAob3B0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnRWYXJpYW50ID0gb3B0aW9uLnZhbHVlO1xyXG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IDxhbnk+Rm9udEhlbHBlcnMuZ2V0Q3NzU3R5bGUodGhpcy5zdGF0ZS5mYW1pbHlPYmplY3QuZmFtaWx5LCBmb250VmFyaWFudCk7XHJcbiAgICAgICAgICAgIHN0eWxlLmZvbnRTaXplID0gdGhpcy5wcmV2aWV3Rm9udFNpemU7XHJcbiAgICAgICAgICAgIHJldHVybiByaChcImRpdlwiLCB7IHN0eWxlIH0sIFxyXG4gICAgICAgICAgICAgICBbYCR7dGhpcy5zdGF0ZS5mYW1pbHlPYmplY3QuZmFtaWx5fSAke29wdGlvbi52YWx1ZX1gXSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcmgoXCJkaXZcIixcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJmb250LXBpY2tlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIHJoKFJlYWN0U2VsZWN0LCB7IFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJmb250LWZhbWlseVwiLCBcclxuICAgICAgICAgICAgICAgIGtleTogXCJmb250LWZhbWlseVwiLFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImZvbnQtZmFtaWx5XCIsIFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuc3RhdGUuZmFtaWx5T2JqZWN0ICYmIHRoaXMuc3RhdGUuZmFtaWx5T2JqZWN0LmZhbWlseSxcclxuICAgICAgICAgICAgICAgIGNsZWFyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB0aGlzLmdldEZhbWlseU9wdGlvbnMoKSwgXHJcbiAgICAgICAgICAgICAgICBvcHRpb25SZW5kZXJlcjogZmFtaWx5T3B0aW9uUmVuZGVyLFxyXG4gICAgICAgICAgICAgICAgdmFsdWVSZW5kZXJlcjogZmFtaWx5T3B0aW9uUmVuZGVyLFxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U6IChmKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmFtaWx5T2JqZWN0ID0gdGhpcy5wcm9wcy5zdG9yZS5yZXNvdXJjZXMuZm9udEZhbWlsaWVzW2ZdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhbnQgPSBfLmxhc3QoZmFtaWx5T2JqZWN0LnZhcmlhbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIodiA9PiB2LmluZGV4T2YoXCJpdGFsaWNcIikgPCAwKSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFtaWx5T2JqZWN0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB0aGlzLnNlbmRTZWxlY3Rpb25DaGFuZ2VkKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgLy8gb25seSBzaG93IGZvciBtdWx0aXBsZSB2YXJpYW50c1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmZhbWlseU9iamVjdCAmJiB0aGlzLnN0YXRlLmZhbWlseU9iamVjdC52YXJpYW50cy5sZW5ndGggPiAxICYmXHJcbiAgICAgICAgICAgIHJoKFJlYWN0U2VsZWN0LCB7IFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJmb250LXZhcmlhbnRcIiwgXHJcbiAgICAgICAgICAgICAgICBrZXk6IFwiZm9udC12YXJpYW50XCIsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZm9udC12YXJpYW50XCIsIFxyXG4gICAgICAgICAgICAgICAgY2xlYXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnN0YXRlLnZhcmlhbnQsXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB0aGlzLnN0YXRlLmZhbWlseU9iamVjdCAmJiB0aGlzLnN0YXRlLmZhbWlseU9iamVjdC52YXJpYW50cy5tYXAodiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IHYsIGxhYmVsOiB2IH07XHJcbiAgICAgICAgICAgICAgICB9KSwgXHJcbiAgICAgICAgICAgICAgICBvcHRpb25SZW5kZXJlcjogdmFyaWFudE9wdGlvblJlbmRlcixcclxuICAgICAgICAgICAgICAgIHZhbHVlUmVuZGVyZXI6IHZhcmlhbnRPcHRpb25SZW5kZXIsXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZTogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYW1pbHlPYmplY3Q6IHRoaXMuc3RhdGUuZmFtaWx5T2JqZWN0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50OiB2YWx1ZSBcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4gdGhpcy5zZW5kU2VsZWN0aW9uQ2hhbmdlZCgpICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgIF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VuZFNlbGVjdGlvbkNoYW5nZWQoKXtcclxuICAgICAgICB0aGlzLnByb3BzLnNlbGVjdGlvbkNoYW5nZWQoXHJcbiAgICAgICAgICAgIEZvbnRIZWxwZXJzLmdldERlc2NyaXB0aW9uKHRoaXMuc3RhdGUuZmFtaWx5T2JqZWN0LCB0aGlzLnN0YXRlLnZhcmlhbnQpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBnZXRGYW1pbHlPcHRpb25zKCk6IHsgdmFsdWU6IEZvbnRGYW1pbHksIGxhYmVsOiBzdHJpbmd9W10ge1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBfLnZhbHVlcyh0aGlzLnByb3BzLnN0b3JlLnJlc291cmNlcy5mb250RmFtaWxpZXMpXHJcbiAgICAgICAgICAgIC5tYXAoKGZvbnRGYW1pbHk6IEZvbnRGYW1pbHkpID0+IFxyXG4gICAgICAgICAgICAgICAgeyByZXR1cm4geyB2YWx1ZTogZm9udEZhbWlseS5mYW1pbHksIGxhYmVsOiBmb250RmFtaWx5LmZhbWlseSB9OyB9KTtcclxuICAgICAgICByZXR1cm4gb3B0aW9ucztcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgU2VsZWN0ZWRJdGVtRWRpdG9yIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuXHJcbiAgICAgICAgY29uc3QgZG9tJCA9IHN0b3JlLmV2ZW50cy5tZXJnZVR5cGVkPGFueT4oIFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWQsXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZFxyXG4gICAgICAgICAgICApLm1hcChpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBvc0l0ZW0gPSA8UG9zaXRpb25lZE9iamVjdFJlZj5pLmRhdGE7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHBvc0l0ZW1cclxuICAgICAgICAgICAgICAgICYmIHBvc0l0ZW0uaXRlbVR5cGUgPT09ICdUZXh0QmxvY2snXHJcbiAgICAgICAgICAgICAgICAmJiBfLmZpbmQoc3RvcmUuc3RhdGUucmV0YWluZWQuc2tldGNoLnRleHRCbG9ja3MsIFxyXG4gICAgICAgICAgICAgICAgICAgIGIgPT4gYi5faWQgPT09IHBvc0l0ZW0uaXRlbUlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghYmxvY2spIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBoKCdkaXYjZWRpdG9yT3ZlcmxheScsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJub25lXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaCgnZGl2I2VkaXRvck92ZXJsYXknLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IHBvc0l0ZW0uY2xpZW50WCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBwb3NJdGVtLmNsaWVudFkgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiei1pbmRleFwiOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgVGV4dEJsb2NrRWRpdG9yKHN0b3JlKS5yZW5kZXIoYmxvY2spXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgU2tldGNoRWRpdG9yIGV4dGVuZHMgQ29tcG9uZW50PFNrZXRjaD4ge1xyXG5cclxuICAgIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcblxyXG4gICAgICAgIGNvbnN0IHNrZXRjaERvbSQgPSBzdG9yZS5ldmVudHMubWVyZ2UoXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLFxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkKVxyXG4gICAgICAgICAgICAubWFwKG0gPT4gdGhpcy5yZW5kZXIoc3RvcmUuc3RhdGUucmV0YWluZWQuc2tldGNoKSk7XHJcbiAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKHNrZXRjaERvbSQsIGNvbnRhaW5lcik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihza2V0Y2g6IFNrZXRjaCkge1xyXG5cclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXZcIiwgW1xyXG4gICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJBZGQgdGV4dDogXCIpLFxyXG4gICAgICAgICAgICBoKFwiaW5wdXQuYWRkLXRleHRcIiwge1xyXG4gICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBldi50YXJnZXQgJiYgZXYudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay5hZGQuZGlzcGF0Y2goeyB0ZXh0OiB0ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnRhcmdldC52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJQcmVzcyBbRW50ZXJdIHRvIGFkZFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJCYWNrZ3JvdW5kOiBcIiksXHJcbiAgICAgICAgICAgIGgoXCJpbnB1dC5iYWNrZ3JvdW5kLWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBza2V0Y2guYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5hdHRyVXBkYXRlLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlOiAob2xkVm5vZGUsIHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXQodm5vZGUuZWxtLCBza2V0Y2guYmFja2dyb3VuZENvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgIEJvb3RTY3JpcHQuZHJvcGRvd24oe1xyXG4gICAgICAgICAgICAgICAgaWQ6IFwic2tldGNoTWVudVwiLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogXCJBY3Rpb25zXCIsXHJcbiAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJOZXdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDcmVhdGUgbmV3IHNrZXRjaFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5jcmVhdGUuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiWm9vbSB0byBmaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJGaXQgY29udGVudHMgaW4gdmlld1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmRlc2lnbmVyLnpvb21Ub0ZpdC5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJFeHBvcnQgaW1hZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFeHBvcnQgRmlkZGxlIGFzIFBOR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5kZXNpZ25lci5leHBvcnRQTkcuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRXhwb3J0IFNWR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkV4cG9ydCBGaWRkbGUgYXMgdmVjdG9yIGdyYXBoaWNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZGVzaWduZXIuZXhwb3J0U1ZHLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIF1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIFRleHRCbG9ja0VkaXRvciBleHRlbmRzIENvbXBvbmVudDxUZXh0QmxvY2s+IHtcclxuICAgIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodGV4dEJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XHJcbiAgICAgICAgbGV0IHVwZGF0ZSA9IHRiID0+IHtcclxuICAgICAgICAgICAgdGIuX2lkID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyLmRpc3BhdGNoKHRiKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBoKFwiZGl2LnRleHQtYmxvY2stZWRpdG9yXCIsXHJcbiAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICBoKFwidGV4dGFyZWFcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLnRleHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleXByZXNzOiAoZXY6S2V5Ym9hcmRFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKHsgdGV4dDogKDxIVE1MVGV4dEFyZWFFbGVtZW50PmV2LnRhcmdldCkudmFsdWUgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0RWRpdGluZ0l0ZW0uZGlzcGF0Y2gobnVsbCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZXYgPT4gdXBkYXRlKHsgdGV4dDogZXYudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5mb3JlXCIsIHt9LCBcIkFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC50ZXh0LWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlRleHQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0Q29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2tldGNoSGVscGVycy5jb2xvcnNJblVzZSh0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgdGV4dENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcImRpdi5mb250LWNvbG9yLWljb24uYmFja1wiLCB7fSwgXCJBXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCYWNrZ3JvdW5kIGNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5yZXRhaW5lZC5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHVwZGF0ZSh7IGJhY2tncm91bmRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgICAgIGgoXCJidXR0b24uZGVsZXRlLXRleHRibG9jay5idG4uYnRuLWRhbmdlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZS5kaXNwYXRjaCh0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcInNwYW4uZ2x5cGhpY29uLmdseXBoaWNvbi10cmFzaFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImRpdi5mb250LXBpY2tlci1jb250YWluZXJcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvcHM6IEZvbnRQaWNrZXJQcm9wcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmU6IHRoaXMuc3RvcmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbjogdGV4dEJsb2NrLmZvbnREZXNjLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkOiAoZm9udERlc2MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSh7IGZvbnREZXNjIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdERPTS5yZW5kZXIocmgoRm9udFBpY2tlciwgcHJvcHMpLCB2bm9kZS5lbG0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImRpdi5lbmQtY29udHJvbHNcIiwge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5jbGFzcyBXb3Jrc3BhY2VDb250cm9sbGVyIHtcclxuXHJcbiAgICBzdGF0aWMgVEVYVF9DSEFOR0VfUkVOREVSX1RIUk9UVExFX01TID0gNTAwO1xyXG4gICAgc3RhdGljIEJMT0NLX0JPVU5EU19DSEFOR0VfVEhST1RUTEVfTVMgPSA1MDA7XHJcblxyXG4gICAgZGVmYXVsdFNpemUgPSBuZXcgcGFwZXIuU2l6ZSg1MDAwMCwgNDAwMDApO1xyXG4gICAgZGVmYXVsdFNjYWxlID0gMC4wMjtcclxuXHJcbiAgICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuICAgIGZhbGxiYWNrRm9udDogb3BlbnR5cGUuRm9udDtcclxuICAgIHZpZXdab29tOiBWaWV3Wm9vbTtcclxuXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuICAgIHByaXZhdGUgX3NrZXRjaDogU2tldGNoO1xyXG4gICAgcHJpdmF0ZSBfdGV4dEJsb2NrSXRlbXM6IHsgW3RleHRCbG9ja0lkOiBzdHJpbmddOiBUZXh0V2FycCB9ID0ge307XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlLCBmYWxsYmFja0ZvbnQ6IG9wZW50eXBlLkZvbnQpIHtcclxuICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgdGhpcy5mYWxsYmFja0ZvbnQgPSBmYWxsYmFja0ZvbnQ7XHJcbiAgICAgICAgcGFwZXIuc2V0dGluZ3MuaGFuZGxlU2l6ZSA9IDE7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluQ2FudmFzJyk7XHJcbiAgICAgICAgcGFwZXIuc2V0dXAodGhpcy5jYW52YXMpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdCA9IHBhcGVyLnByb2plY3Q7XHJcblxyXG4gICAgICAgIHRoaXMudmlld1pvb20gPSBuZXcgVmlld1pvb20odGhpcy5wcm9qZWN0KTtcclxuICAgICAgICB0aGlzLnZpZXdab29tLnZpZXdDaGFuZ2VkLnN1YnNjcmliZShib3VuZHMgPT4ge1xyXG4gICAgICAgICAgIHN0b3JlLmFjdGlvbnMuZGVzaWduZXIudmlld0NoYW5nZWQuZGlzcGF0Y2goYm91bmRzKTsgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY2xlYXJTZWxlY3Rpb24gPSAoZXY6IHBhcGVyLlBhcGVyTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZihzdG9yZS5zdGF0ZS5kaXNwb3NhYmxlLmVkaXRpbmdJdGVtKXtcclxuICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuc2tldGNoLnNldEVkaXRpbmdJdGVtLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoc3RvcmUuc3RhdGUuZGlzcG9zYWJsZS5zZWxlY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcGVyLnZpZXcub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBjbGVhclNlbGVjdGlvbik7XHJcbiAgICAgICAgcGFwZXIudmlldy5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLnNtYXJ0RHJhZ1N0YXJ0LCBjbGVhclNlbGVjdGlvbik7XHJcbiAgICAgICAgLy8gcGFwZXIudmlldy5vbihcImtleXVwXCIsIChldjogcGFwZXIuS2V5RXZlbnQpID0+IHtcclxuICAgICAgICAvLyB9KTsgXHJcblxyXG4gICAgICAgIGNvbnN0IGtleUhhbmRsZXIgPSBuZXcgRG9jdW1lbnRLZXlIYW5kbGVyKHN0b3JlKTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gRGVzaWduZXIgLS0tLS1cclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLmRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnpvb21Ub0ZpdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMuZGVzaWduZXIuZXhwb3J0UE5HUmVxdWVzdGVkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZG93bmxvYWRQTkcoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLmRlc2lnbmVyLmV4cG9ydFNWR1JlcXVlc3RlZC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRvd25sb2FkU1ZHKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIFNrZXRjaCAtLS0tLVxyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NrZXRjaCA9IGV2LmRhdGE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGV4dEJsb2NrSXRlbXMgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guc2VsZWN0aW9uQ2hhbmdlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICBpZihtLmRhdGEpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gbS5kYXRhLml0ZW1JZCAmJiB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuaXRlbUlkXTtcclxuICAgICAgICAgICAgICAgIGlmIChibG9jayAmJiAhYmxvY2suc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gVGV4dEJsb2NrIC0tLS0tXHJcblxyXG4gICAgICAgIHN0b3JlLmV2ZW50cy5tZXJnZVR5cGVkKFxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmFkZGVkLFxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmxvYWRlZFxyXG4gICAgICAgICkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICBldiA9PiB0aGlzLmFkZEJsb2NrKGV2LmRhdGEpKTtcclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5hdHRyQ2hhbmdlZFxyXG4gICAgICAgICAgICAub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgIC50aHJvdHRsZShXb3Jrc3BhY2VDb250cm9sbGVyLlRFWFRfQ0hBTkdFX1JFTkRFUl9USFJPVFRMRV9NUylcclxuICAgICAgICAgICAgLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHRCbG9jayA9IG0uZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnRleHQgPSB0ZXh0QmxvY2sudGV4dDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGV4dEJsb2NrLmZvbnREZXNjICYmIHRleHRCbG9jay5mb250RGVzYy51cmwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHVzaCBpbiBmb250IHdoZW4gcmVhZHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldCh0ZXh0QmxvY2suZm9udERlc2MudXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHVybCwgZm9udCkgPT4gaXRlbS5mb250ID0gZm9udCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY3VzdG9tU3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0ZXh0QmxvY2suZm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogdGV4dEJsb2NrLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5yZW1vdmVkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5lZGl0b3JDbG9zZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB6b29tVG9GaXQoKSB7XHJcbiAgICAgICAgbGV0IGJvdW5kczogcGFwZXIuUmVjdGFuZ2xlO1xyXG4gICAgICAgIF8uZm9yT3duKHRoaXMuX3RleHRCbG9ja0l0ZW1zLCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBib3VuZHMgPSBib3VuZHNcclxuICAgICAgICAgICAgICAgID8gYm91bmRzLnVuaXRlKGl0ZW0uYm91bmRzKVxyXG4gICAgICAgICAgICAgICAgOiBpdGVtLmJvdW5kcztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFib3VuZHMpIHtcclxuICAgICAgICAgICAgYm91bmRzID0gbmV3IHBhcGVyLlJlY3RhbmdsZShuZXcgcGFwZXIuUG9pbnQoMCwgMCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTaXplLm11bHRpcGx5KHRoaXMuZGVmYXVsdFNjYWxlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZpZXdab29tLnpvb21Ubyhib3VuZHMuc2NhbGUoMS4yKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkb3dubG9hZFBORygpIHtcclxuICAgICAgICBjb25zdCBiYWNrZ3JvdW5kID0gdGhpcy5pbnNlcnRCYWNrZ3JvdW5kKCk7XHJcbiAgICAgICAgY29uc3QgcmFzdGVyID0gYXBwLndvcmtzcGFjZUNvbnRyb2xsZXIucHJvamVjdC5hY3RpdmVMYXllci5yYXN0ZXJpemUoMzAwLCBmYWxzZSk7XHJcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSB0aGlzLmdldFNrZXRjaEZpbGVOYW1lKDQwLCBcInBuZ1wiKTtcclxuICAgICAgICBjb25zdCBkYXRhID0gcmFzdGVyLnRvRGF0YVVSTCgpO1xyXG4gICAgICAgXHJcbiAgICAgICAgRG9tSGVscGVycy5kb3dubG9hZEZpbGUoZGF0YSwgZmlsZU5hbWUpO1xyXG4gICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkb3dubG9hZFNWRygpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZDogcGFwZXIuSXRlbTtcclxuICAgICAgICBpZih0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5iYWNrZ3JvdW5kQ29sb3Ipe1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kID0gdGhpcy5pbnNlcnRCYWNrZ3JvdW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB1cmwgPSBcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LFwiICsgZW5jb2RlVVJJQ29tcG9uZW50KFxyXG4gICAgICAgICAgICA8c3RyaW5nPnRoaXMucHJvamVjdC5leHBvcnRTVkcoeyBhc1N0cmluZzogdHJ1ZSB9KSk7XHJcbiAgICAgICAgRG9tSGVscGVycy5kb3dubG9hZEZpbGUodXJsLCB0aGlzLmdldFNrZXRjaEZpbGVOYW1lKDQwLCBcInN2Z1wiKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoYmFja2dyb3VuZCl7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U2tldGNoRmlsZU5hbWUobGVuZ3RoOiBudW1iZXIsIGV4dGVuc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgb3V0ZXI6XHJcbiAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiB0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBibG9jay50ZXh0LnNwbGl0KC9cXHMvKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHJpbSA9IHdvcmQucmVwbGFjZSgvXFxXL2csICcnKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJpbS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGgpIG5hbWUgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZSArPSB0cmltO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUubGVuZ3RoID49IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghbmFtZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbmFtZSA9IFwiZmlkZGxlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuYW1lICsgXCIuXCIgKyBleHRlbnNpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgc2tldGNoIGJhY2tncm91bmQgdG8gcHJvdmlkZSBiYWNrZ3JvdW5kIGZpbGwgKGlmIG5lY2Vzc2FyeSlcclxuICAgICAqICAgYW5kIGFkZCBtYXJnaW4gYXJvdW5kIGVkZ2VzLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluc2VydEJhY2tncm91bmQoKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgY29uc3QgYm91bmRzID0gYXBwLndvcmtzcGFjZUNvbnRyb2xsZXIucHJvamVjdC5hY3RpdmVMYXllci5ib3VuZHM7XHJcbiAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHBhcGVyLlNoYXBlLlJlY3RhbmdsZShcclxuICAgICAgICAgICAgYm91bmRzLnRvcExlZnQuc3VidHJhY3QoMjApLFxyXG4gICAgICAgICAgICBib3VuZHMuYm90dG9tUmlnaHQuYWRkKDIwKSk7XHJcbiAgICAgICAgYmFja2dyb3VuZC5maWxsQ29sb3IgPSB0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgYmFja2dyb3VuZC5zZW5kVG9CYWNrKCk7XHJcbiAgICAgICAgcmV0dXJuIGJhY2tncm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRCbG9jayh0ZXh0QmxvY2s6IFRleHRCbG9jaykge1xyXG4gICAgICAgIGlmICghdGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGV4dEJsb2NrLl9pZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdyZWNlaXZlZCBibG9jayB3aXRob3V0IGlkJywgdGV4dEJsb2NrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbdGV4dEJsb2NrLl9pZF07XHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlJlY2VpdmVkIGFkZEJsb2NrIGZvciBibG9jayB0aGF0IGlzIGFscmVhZHkgbG9hZGVkXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYm91bmRzOiB7IHVwcGVyOiBwYXBlci5TZWdtZW50W10sIGxvd2VyOiBwYXBlci5TZWdtZW50W10gfTtcclxuXHJcbiAgICAgICAgaWYgKHRleHRCbG9jay5vdXRsaW5lKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvYWRTZWdtZW50ID0gKHJlY29yZDogU2VnbWVudFJlY29yZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9pbnQgPSByZWNvcmRbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuU2VnbWVudChcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KHJlY29yZFswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZFsxXSAmJiBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkWzJdICYmIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMl0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KG5ldyBwYXBlci5Qb2ludChyZWNvcmQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgYm91bmRzID0ge1xyXG4gICAgICAgICAgICAgICAgdXBwZXI6IHRleHRCbG9jay5vdXRsaW5lLnRvcC5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpLFxyXG4gICAgICAgICAgICAgICAgbG93ZXI6IHRleHRCbG9jay5vdXRsaW5lLmJvdHRvbS5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtID0gbmV3IFRleHRXYXJwKFxyXG4gICAgICAgICAgICB0aGlzLmZhbGxiYWNrRm9udCxcclxuICAgICAgICAgICAgdGV4dEJsb2NrLnRleHQsXHJcbiAgICAgICAgICAgIGJvdW5kcyxcclxuICAgICAgICAgICAgdGV4dEJsb2NrLmZvbnRTaXplLCB7XHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogdGV4dEJsb2NrLmZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yIHx8IFwicmVkXCIsICAgIC8vIHRleHRDb2xvciBzaG91bGQgaGF2ZSBiZWVuIHNldCBlbHNld2hlcmUgXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0QmxvY2suZm9udERlc2MgJiYgdGV4dEJsb2NrLmZvbnREZXNjLnVybCkge1xyXG4gICAgICAgICAgICAvLyBwdXNoIGluIGZvbnQgd2hlbiByZWFkeVxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnJlc291cmNlcy5wYXJzZWRGb250cy5nZXQodGV4dEJsb2NrLmZvbnREZXNjLnVybCxcclxuICAgICAgICAgICAgICAgICh1cmwsIGZvbnQpID0+IGl0ZW0uZm9udCA9IGZvbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0ZXh0QmxvY2sub3V0bGluZSAmJiB0ZXh0QmxvY2sucG9zaXRpb24pIHtcclxuICAgICAgICAgICAgaXRlbS5wb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludCh0ZXh0QmxvY2sucG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2VuZEVkaXRBY3Rpb24gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVkaXRvckF0ID0gdGhpcy5wcm9qZWN0LnZpZXcucHJvamVjdFRvVmlldyhcclxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5taWRwb2ludChpdGVtLmJvdW5kcy50b3BMZWZ0LCBpdGVtLmJvdW5kcy5jZW50ZXIpKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRFZGl0aW5nSXRlbS5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtSWQ6IHRleHRCbG9jay5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50WDogZWRpdG9yQXQueCxcclxuICAgICAgICAgICAgICAgICAgICBjbGllbnRZOiBlZGl0b3JBdC55XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpdGVtLm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuY2xpY2tXaXRob3V0RHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgc2VuZEVkaXRBY3Rpb24oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHNlbGVjdCBpdGVtXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICB7IGl0ZW1JZDogdGV4dEJsb2NrLl9pZCwgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXRlbS5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLnNtYXJ0RHJhZ1N0YXJ0LCBldiA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgIGlmICghaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IHRleHRCbG9jay5faWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ZW0ub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdFbmQsIGV2ID0+IHtcclxuICAgICAgICAgICAgbGV0IGJsb2NrID0gPFRleHRCbG9jaz50aGlzLmdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbSk7XHJcbiAgICAgICAgICAgIGJsb2NrLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGl0ZW1DaGFuZ2UkID0gUGFwZXJOb3RpZnkub2JzZXJ2ZShpdGVtLCBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkdFT01FVFJZKTtcclxuICAgICAgICBpdGVtQ2hhbmdlJFxyXG4gICAgICAgICAgICAuZGVib3VuY2UoV29ya3NwYWNlQ29udHJvbGxlci5CTE9DS19CT1VORFNfQ0hBTkdFX1RIUk9UVExFX01TKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+dGhpcy5nZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgYmxvY2suX2lkID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdGVtLmRhdGEgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgIGlmICghdGV4dEJsb2NrLnBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSB0aGlzLnByb2plY3Qudmlldy5ib3VuZHMucG9pbnQuYWRkKFxyXG4gICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGl0ZW0uYm91bmRzLndpZHRoIC8gMiwgaXRlbS5ib3VuZHMuaGVpZ2h0IC8gMilcclxuICAgICAgICAgICAgICAgICAgICAuYWRkKDUwKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3RleHRCbG9ja0l0ZW1zW3RleHRCbG9jay5faWRdID0gaXRlbTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnN0b3JlLnN0YXRlLnJldGFpbmVkLnNrZXRjaC5sb2FkaW5nXHJcbiAgICAgICAgICAgICYmIHRoaXMuc3RvcmUuc3RhdGUucmV0YWluZWQuc2tldGNoLnRleHRCbG9ja3MubGVuZ3RoIDw9IDEpIHtcclxuICAgICAgICAgICAgLy8gb3BlbiBlZGl0b3IgZm9yIG5ld2x5IGFkZGVkIGJsb2NrXHJcbiAgICAgICAgICAgIHNlbmRFZGl0QWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtOiBUZXh0V2FycCk6IEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgICAgIC8vIGV4cG9ydCByZXR1cm5zIGFuIGFycmF5IHdpdGggaXRlbSB0eXBlIGFuZCBzZXJpYWxpemVkIG9iamVjdDpcclxuICAgICAgICAvLyAgIFtcIlBhdGhcIiwgUGF0aFJlY29yZF1cclxuICAgICAgICBjb25zdCB0b3AgPSA8UGF0aFJlY29yZD5pdGVtLnVwcGVyLmV4cG9ydEpTT04oeyBhc1N0cmluZzogZmFsc2UgfSlbMV07XHJcbiAgICAgICAgY29uc3QgYm90dG9tID0gPFBhdGhSZWNvcmQ+aXRlbS5sb3dlci5leHBvcnRKU09OKHsgYXNTdHJpbmc6IGZhbHNlIH0pWzFdO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogW2l0ZW0ucG9zaXRpb24ueCwgaXRlbS5wb3NpdGlvbi55XSxcclxuICAgICAgICAgICAgb3V0bGluZTogeyB0b3AsIGJvdHRvbSB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbmRlY2xhcmUgdmFyIHNvbHZlOiAoYTogYW55LCBiOiBhbnksIGZhc3Q6IGJvb2xlYW4pID0+IHZvaWQ7XHJcblxyXG5jbGFzcyBQZXJzcGVjdGl2ZVRyYW5zZm9ybSB7XHJcbiAgICBcclxuICAgIHNvdXJjZTogUXVhZDtcclxuICAgIGRlc3Q6IFF1YWQ7XHJcbiAgICBwZXJzcDogYW55O1xyXG4gICAgbWF0cml4OiBudW1iZXJbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc291cmNlOiBRdWFkLCBkZXN0OiBRdWFkKXtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLmRlc3QgPSBkZXN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubWF0cml4ID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0uY3JlYXRlTWF0cml4KHNvdXJjZSwgZGVzdCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEdpdmVuIGEgNHg0IHBlcnNwZWN0aXZlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCwgYW5kIGEgMkQgcG9pbnQgKGEgMngxIHZlY3RvciksXHJcbiAgICAvLyBhcHBsaWVzIHRoZSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggYnkgY29udmVydGluZyB0aGUgcG9pbnQgdG8gaG9tb2dlbmVvdXNcclxuICAgIC8vIGNvb3JkaW5hdGVzIGF0IHo9MCwgcG9zdC1tdWx0aXBseWluZywgYW5kIHRoZW4gYXBwbHlpbmcgYSBwZXJzcGVjdGl2ZSBkaXZpZGUuXHJcbiAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgbGV0IHAzID0gUGVyc3BlY3RpdmVUcmFuc2Zvcm0ubXVsdGlwbHkodGhpcy5tYXRyaXgsIFtwb2ludC54LCBwb2ludC55LCAwLCAxXSk7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBwYXBlci5Qb2ludChwM1swXSAvIHAzWzNdLCBwM1sxXSAvIHAzWzNdKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgY3JlYXRlTWF0cml4KHNvdXJjZTogUXVhZCwgdGFyZ2V0OiBRdWFkKTogbnVtYmVyW10ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzb3VyY2VQb2ludHMgPSBbXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYS54LCBzb3VyY2UuYS55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYi54LCBzb3VyY2UuYi55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuYy54LCBzb3VyY2UuYy55XSwgXHJcbiAgICAgICAgICAgIFtzb3VyY2UuZC54LCBzb3VyY2UuZC55XV07XHJcbiAgICAgICAgbGV0IHRhcmdldFBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3RhcmdldC5hLngsIHRhcmdldC5hLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5iLngsIHRhcmdldC5iLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5jLngsIHRhcmdldC5jLnldLCBcclxuICAgICAgICAgICAgW3RhcmdldC5kLngsIHRhcmdldC5kLnldXTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBhID0gW10sIGIgPSBbXSwgaSA9IDAsIG4gPSBzb3VyY2VQb2ludHMubGVuZ3RoOyBpIDwgbjsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBzID0gc291cmNlUG9pbnRzW2ldLCB0ID0gdGFyZ2V0UG9pbnRzW2ldO1xyXG4gICAgICAgICAgICBhLnB1c2goW3NbMF0sIHNbMV0sIDEsIDAsIDAsIDAsIC1zWzBdICogdFswXSwgLXNbMV0gKiB0WzBdXSksIGIucHVzaCh0WzBdKTtcclxuICAgICAgICAgICAgYS5wdXNoKFswLCAwLCAwLCBzWzBdLCBzWzFdLCAxLCAtc1swXSAqIHRbMV0sIC1zWzFdICogdFsxXV0pLCBiLnB1c2godFsxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgWCA9IHNvbHZlKGEsIGIsIHRydWUpOyBcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBYWzBdLCBYWzNdLCAwLCBYWzZdLFxyXG4gICAgICAgICAgICBYWzFdLCBYWzRdLCAwLCBYWzddLFxyXG4gICAgICAgICAgICAgICAwLCAgICAwLCAxLCAgICAwLFxyXG4gICAgICAgICAgICBYWzJdLCBYWzVdLCAwLCAgICAxXHJcbiAgICAgICAgXS5tYXAoZnVuY3Rpb24oeCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh4ICogMTAwMDAwKSAvIDEwMDAwMDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQb3N0LW11bHRpcGx5IGEgNHg0IG1hdHJpeCBpbiBjb2x1bW4tbWFqb3Igb3JkZXIgYnkgYSA0eDEgY29sdW1uIHZlY3RvcjpcclxuICAgIC8vIFsgbTAgbTQgbTggIG0xMiBdICAgWyB2MCBdICAgWyB4IF1cclxuICAgIC8vIFsgbTEgbTUgbTkgIG0xMyBdICogWyB2MSBdID0gWyB5IF1cclxuICAgIC8vIFsgbTIgbTYgbTEwIG0xNCBdICAgWyB2MiBdICAgWyB6IF1cclxuICAgIC8vIFsgbTMgbTcgbTExIG0xNSBdICAgWyB2MyBdICAgWyB3IF1cclxuICAgIHN0YXRpYyBtdWx0aXBseShtYXRyaXgsIHZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIG1hdHJpeFswXSAqIHZlY3RvclswXSArIG1hdHJpeFs0XSAqIHZlY3RvclsxXSArIG1hdHJpeFs4IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTJdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMV0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNV0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbOSBdICogdmVjdG9yWzJdICsgbWF0cml4WzEzXSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzJdICogdmVjdG9yWzBdICsgbWF0cml4WzZdICogdmVjdG9yWzFdICsgbWF0cml4WzEwXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNF0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFszXSAqIHZlY3RvclswXSArIG1hdHJpeFs3XSAqIHZlY3RvclsxXSArIG1hdHJpeFsxMV0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTVdICogdmVjdG9yWzNdXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUXVhZCB7XHJcbiAgICBhOiBwYXBlci5Qb2ludDtcclxuICAgIGI6IHBhcGVyLlBvaW50O1xyXG4gICAgYzogcGFwZXIuUG9pbnQ7XHJcbiAgICBkOiBwYXBlci5Qb2ludDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50LCBjOiBwYXBlci5Qb2ludCwgZDogcGFwZXIuUG9pbnQpe1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmMgPSBjO1xyXG4gICAgICAgIHRoaXMuZCA9IGQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tUmVjdGFuZ2xlKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICByZWN0LnRvcExlZnQsXHJcbiAgICAgICAgICAgIHJlY3QudG9wUmlnaHQsXHJcbiAgICAgICAgICAgIHJlY3QuYm90dG9tTGVmdCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21SaWdodFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBmcm9tQ29vcmRzKGNvb3JkczogbnVtYmVyW10pIDogUXVhZCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFkKFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzBdLCBjb29yZHNbMV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzJdLCBjb29yZHNbM10pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzRdLCBjb29yZHNbNV0pLFxyXG4gICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoY29vcmRzWzZdLCBjb29yZHNbN10pXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhc0Nvb3JkcygpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgdGhpcy5hLngsIHRoaXMuYS55LFxyXG4gICAgICAgICAgICB0aGlzLmIueCwgdGhpcy5iLnksXHJcbiAgICAgICAgICAgIHRoaXMuYy54LCB0aGlzLmMueSxcclxuICAgICAgICAgICAgdGhpcy5kLngsIHRoaXMuZC55XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBEdWFsQm91bmRzUGF0aFdhcnAgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgc3RhdGljIFBPSU5UU19QRVJfUEFUSCA9IDIwMDtcclxuICAgIHN0YXRpYyBVUERBVEVfREVCT1VOQ0UgPSAxNTA7XHJcblxyXG4gICAgcHJpdmF0ZSBfc291cmNlOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICBwcml2YXRlIF91cHBlcjogU3RyZXRjaFBhdGg7XHJcbiAgICBwcml2YXRlIF9sb3dlcjogU3RyZXRjaFBhdGg7XHJcbiAgICBwcml2YXRlIF93YXJwZWQ6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIHByaXZhdGUgX291dGxpbmU6IHBhcGVyLlBhdGg7XHJcbiAgICBwcml2YXRlIF9jdXN0b21TdHlsZTogU2tldGNoSXRlbVN0eWxlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHNvdXJjZTogcGFwZXIuQ29tcG91bmRQYXRoLFxyXG4gICAgICAgIGJvdW5kcz86IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9LFxyXG4gICAgICAgIGN1c3RvbVN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vIC0tIGJ1aWxkIGNoaWxkcmVuIC0tXHJcblxyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLl9zb3VyY2UudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoYm91bmRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwcGVyID0gbmV3IFN0cmV0Y2hQYXRoKGJvdW5kcy51cHBlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvd2VyID0gbmV3IFN0cmV0Y2hQYXRoKGJvdW5kcy5sb3dlcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIgPSBuZXcgU3RyZXRjaFBhdGgoW1xyXG4gICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy50b3BMZWZ0KSxcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMudG9wUmlnaHQpXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB0aGlzLl9sb3dlciA9IG5ldyBTdHJldGNoUGF0aChbXHJcbiAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLmJvdHRvbUxlZnQpLFxyXG4gICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy5ib3R0b21SaWdodClcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xCb3VuZHNPcGFjaXR5ID0gMC43NTtcclxuXHJcbiAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgdGhpcy5fbG93ZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcblxyXG4gICAgICAgIHRoaXMuX291dGxpbmUgPSBuZXcgcGFwZXIuUGF0aCh7IGNsb3NlZDogdHJ1ZSB9KTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVTaGFwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLl93YXJwZWQgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHNvdXJjZS5wYXRoRGF0YSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVXYXJwZWQoKTtcclxuXHJcbiAgICAgICAgLy8gLS0gYWRkIGNoaWxkcmVuIC0tXHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGRyZW4oW3RoaXMuX291dGxpbmUsIHRoaXMuX3dhcnBlZCwgdGhpcy5fdXBwZXIsIHRoaXMuX2xvd2VyXSk7XHJcblxyXG4gICAgICAgIC8vIC0tIGFzc2lnbiBzdHlsZSAtLVxyXG5cclxuICAgICAgICB0aGlzLmN1c3RvbVN0eWxlID0gY3VzdG9tU3R5bGUgfHwge1xyXG4gICAgICAgICAgICBzdHJva2VDb2xvcjogXCJsaWdodGdyYXlcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIFBhcGVySGVscGVycy5hZGRTbWFydERyYWcodGhpcyk7XHJcblxyXG4gICAgICAgIC8vIC0tIHNldCB1cCBvYnNlcnZlcnMgLS1cclxuXHJcbiAgICAgICAgUnguT2JzZXJ2YWJsZS5tZXJnZShcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpLFxyXG4gICAgICAgICAgICB0aGlzLl9sb3dlci5wYXRoQ2hhbmdlZC5vYnNlcnZlKCkpXHJcbiAgICAgICAgICAgIC5kZWJvdW5jZShEdWFsQm91bmRzUGF0aFdhcnAuVVBEQVRFX0RFQk9VTkNFKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKHBhdGggPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lU2hhcGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlV2FycGVkKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VkKFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zdWJzY3JpYmUoZmxhZ3MgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkFUVFJJQlVURSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3VwcGVyLnZpc2libGUgIT09IHRoaXMuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cHBlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb3dlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQgdXBwZXIoKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwcGVyLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvd2VyKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb3dlci5wYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzb3VyY2UoKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICByZXR1cm4gPHBhcGVyLkNvbXBvdW5kUGF0aD50aGlzLl9zb3VyY2UuY2xvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc291cmNlKHZhbHVlOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXN0b21TdHlsZSgpOiBTa2V0Y2hJdGVtU3R5bGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXN0b21TdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY3VzdG9tU3R5bGUodmFsdWU6IFNrZXRjaEl0ZW1TdHlsZSkge1xyXG4gICAgICAgIHRoaXMuX2N1c3RvbVN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fd2FycGVkLnN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IHZhbHVlLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNvbnRyb2xCb3VuZHNPcGFjaXR5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl91cHBlci5vcGFjaXR5ID0gdGhpcy5fbG93ZXIub3BhY2l0eSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlV2FycGVkKCkge1xyXG4gICAgICAgIGxldCBvcnRoT3JpZ2luID0gdGhpcy5fc291cmNlLmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgIGxldCBvcnRoV2lkdGggPSB0aGlzLl9zb3VyY2UuYm91bmRzLndpZHRoO1xyXG4gICAgICAgIGxldCBvcnRoSGVpZ2h0ID0gdGhpcy5fc291cmNlLmJvdW5kcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLmR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbihcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aCwgdGhpcy5fbG93ZXIucGF0aCk7XHJcbiAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgaWYgKCFwb2ludCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KG9ydGhPcmlnaW4pO1xyXG4gICAgICAgICAgICBsZXQgdW5pdCA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gb3J0aEhlaWdodCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0ZWQgPSBwcm9qZWN0aW9uKHVuaXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdQYXRocyA9IHRoaXMuX3NvdXJjZS5jaGlsZHJlblxyXG4gICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IDxwYXBlci5QYXRoPml0ZW07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4UG9pbnRzID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEFzUG9pbnRzKHBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgRHVhbEJvdW5kc1BhdGhXYXJwLlBPSU5UU19QRVJfUEFUSClcclxuICAgICAgICAgICAgICAgICAgICAubWFwKHAgPT4gdHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50KHApKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHhQYXRoID0gbmV3IHBhcGVyLlBhdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8veFBhdGguc2ltcGxpZnkoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4UGF0aDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB0aGlzLl93YXJwZWQucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgICAgICB0aGlzLl93YXJwZWQuYWRkQ2hpbGRyZW4obmV3UGF0aHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlT3V0bGluZVNoYXBlKCkge1xyXG4gICAgICAgIGNvbnN0IGxvd2VyID0gbmV3IHBhcGVyLlBhdGgodGhpcy5fbG93ZXIucGF0aC5zZWdtZW50cyk7XHJcbiAgICAgICAgbG93ZXIucmV2ZXJzZSgpO1xyXG4gICAgICAgIHRoaXMuX291dGxpbmUuc2VnbWVudHMgPSB0aGlzLl91cHBlci5wYXRoLnNlZ21lbnRzLmNvbmNhdChsb3dlci5zZWdtZW50cyk7XHJcbiAgICAgICAgbG93ZXIucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmNsYXNzIFBhdGhIYW5kbGUgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgc3RhdGljIE1BUktFUl9SQURJVVMgPSA4O1xyXG4gICAgc3RhdGljIERSQUdfVEhSRVNIT0xEID0gMztcclxuXHJcbiAgICBwcml2YXRlIF9tYXJrZXI6IHBhcGVyLlNoYXBlO1xyXG4gICAgcHJpdmF0ZSBfc2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgIHByaXZhdGUgX2N1cnZlOiBwYXBlci5DdXJ2ZTtcclxuICAgIHByaXZhdGUgX3Ntb290aGVkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfY3VydmVTcGxpdCA9IG5ldyBPYnNlcnZhYmxlRXZlbnQ8bnVtYmVyPigpO1xyXG4gICAgcHJpdmF0ZSBfY3VydmVDaGFuZ2VVbnN1YjogKCkgPT4gdm9pZDtcclxuICAgIHByaXZhdGUgZHJhZ2dpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXR0YWNoOiBwYXBlci5TZWdtZW50IHwgcGFwZXIuQ3VydmUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBsZXQgcG9zaXRpb246IHBhcGVyLlBvaW50O1xyXG4gICAgICAgIGxldCBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgICAgIGlmIChhdHRhY2ggaW5zdGFuY2VvZiBwYXBlci5TZWdtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQgPSA8cGFwZXIuU2VnbWVudD5hdHRhY2g7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgcGF0aCA9IHRoaXMuX3NlZ21lbnQucGF0aDtcclxuICAgICAgICB9IGVsc2UgaWYgKGF0dGFjaCBpbnN0YW5jZW9mIHBhcGVyLkN1cnZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnZlID0gPHBhcGVyLkN1cnZlPmF0dGFjaDtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XHJcbiAgICAgICAgICAgIHBhdGggPSB0aGlzLl9jdXJ2ZS5wYXRoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwiYXR0YWNoIG11c3QgYmUgU2VnbWVudCBvciBDdXJ2ZVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvc2l0aW9uLCBQYXRoSGFuZGxlLk1BUktFUl9SQURJVVMpO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5zdHJva2VDb2xvciA9IFwiYmx1ZVwiO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5maWxsQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9tYXJrZXIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlQXNTZWdtZW50KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZUFzQ3VydmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFBhcGVySGVscGVycy5hZGRTbWFydERyYWcodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VydmUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBjdXJ2ZSwgcHVwYXRlIHRvIHNlZ21lbnQgaGFuZGxlXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlQ2hhbmdlVW5zdWIoKTsgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gbmV3IHBhcGVyLlNlZ21lbnQodGhpcy5jZW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VydmVJZHggPSB0aGlzLl9jdXJ2ZS5pbmRleDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlLnBhdGguaW5zZXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlSWR4ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VydmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZUFzU2VnbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJ2ZVNwbGl0Lm5vdGlmeShjdXJ2ZUlkeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLnNtYXJ0RHJhZ01vdmUsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQucG9pbnQgPSB0aGlzLmNlbnRlcjtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zbW9vdGhlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLmNsaWNrV2l0aG91dERyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc21vb3RoZWQgPSAhdGhpcy5zbW9vdGhlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9jdXJ2ZUNoYW5nZVVuc3ViID0gcGF0aC5zdWJzY3JpYmUoZmxhZ3MgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VydmUgJiYgIXRoaXMuX3NlZ21lbnQgXHJcbiAgICAgICAgICAgICAgICAmJiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLlNFR01FTlRTKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNtb290aGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zbW9vdGhlZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc21vb3RoZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9zbW9vdGhlZCA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5oYW5kbGVPdXQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VydmVTcGxpdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY3VydmVTcGxpdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2VudGVyKCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY2VudGVyKHBvaW50OiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb2ludDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0eWxlQXNTZWdtZW50KCkge1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5vcGFjaXR5ID0gMC44O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3R5bGVBc0N1cnZlKCkge1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5vcGFjaXR5ID0gMC4zO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5jbGFzcyBQYXRoU2VjdGlvbiBpbXBsZW1lbnRzIHBhcGVyLkN1cnZlbGlrZSB7XHJcbiAgICBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgb2Zmc2V0OiBudW1iZXI7XHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocGF0aDogcGFwZXIuUGF0aCwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRQb2ludEF0KG9mZnNldDogbnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXRoLmdldFBvaW50QXQob2Zmc2V0ICsgdGhpcy5vZmZzZXQpO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFBhdGhUcmFuc2Zvcm0ge1xyXG4gICAgcG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRUcmFuc2Zvcm0gPSBwb2ludFRyYW5zZm9ybTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRUcmFuc2Zvcm0ocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBhdGhJdGVtKHBhdGg6IHBhcGVyLlBhdGhJdGVtKSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtQ29tcG91bmRQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCkge1xyXG4gICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBhdGgocGF0aDogcGFwZXIuUGF0aCkge1xyXG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2YgcGF0aC5zZWdtZW50cykge1xyXG4gICAgICAgICAgICBsZXQgb3JpZ1BvaW50ID0gc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgbGV0IG5ld1BvaW50ID0gdGhpcy50cmFuc2Zvcm1Qb2ludChzZWdtZW50LnBvaW50KTtcclxuICAgICAgICAgICAgb3JpZ1BvaW50LnggPSBuZXdQb2ludC54O1xyXG4gICAgICAgICAgICBvcmlnUG9pbnQueSA9IG5ld1BvaW50Lnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbiIsIlxyXG5jbGFzcyBTdHJldGNoUGF0aCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuXHJcbiAgICBwcml2YXRlIF9wYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgcHJpdmF0ZSBfcGF0aENoYW5nZWQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlBhdGg+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2VnbWVudHM6IHBhcGVyLlNlZ21lbnRbXSwgc3R5bGU/OiBwYXBlci5TdHlsZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3BhdGggPSBuZXcgcGFwZXIuUGF0aChzZWdtZW50cyk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9wYXRoKTtcclxuXHJcbiAgICAgICAgaWYoc3R5bGUpe1xyXG4gICAgICAgICAgICB0aGlzLl9wYXRoLnN0eWxlID0gc3R5bGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHJva2VDb2xvciA9IFwibGlnaHRncmF5XCI7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhdGguc3Ryb2tlV2lkdGggPSA2O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IoY29uc3QgcyBvZiB0aGlzLl9wYXRoLnNlZ21lbnRzKXtcclxuICAgICAgICAgICAgdGhpcy5hZGRTZWdtZW50SGFuZGxlKHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IoY29uc3QgYyBvZiB0aGlzLl9wYXRoLmN1cnZlcyl7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ3VydmVIYW5kbGUoYyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgcGF0aCgpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGF0aDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHBhdGhDaGFuZ2VkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoQ2hhbmdlZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBhZGRTZWdtZW50SGFuZGxlKHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQpe1xyXG4gICAgICAgIHRoaXMuYWRkSGFuZGxlKG5ldyBQYXRoSGFuZGxlKHNlZ21lbnQpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBhZGRDdXJ2ZUhhbmRsZShjdXJ2ZTogcGFwZXIuQ3VydmUpe1xyXG4gICAgICAgIGxldCBoYW5kbGUgPSBuZXcgUGF0aEhhbmRsZShjdXJ2ZSk7XHJcbiAgICAgICAgaGFuZGxlLmN1cnZlU3BsaXQuc3Vic2NyaWJlT25lKGN1cnZlSWR4ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZSh0aGlzLl9wYXRoLmN1cnZlc1tjdXJ2ZUlkeF0pO1xyXG4gICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKHRoaXMuX3BhdGguY3VydmVzW2N1cnZlSWR4ICsgMV0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYWRkSGFuZGxlKGhhbmRsZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgYWRkSGFuZGxlKGhhbmRsZTogUGF0aEhhbmRsZSl7XHJcbiAgICAgICAgaGFuZGxlLnZpc2libGUgPSB0aGlzLnZpc2libGU7XHJcbiAgICAgICAgaGFuZGxlLm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnTW92ZSwgZXYgPT4ge1xyXG4gICAgICAgICAgIHRoaXMuX3BhdGhDaGFuZ2VkLm5vdGlmeSh0aGlzLl9wYXRoKTsgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaGFuZGxlLm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuY2xpY2tXaXRob3V0RHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgIHRoaXMuX3BhdGhDaGFuZ2VkLm5vdGlmeSh0aGlzLl9wYXRoKTsgXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmFkZENoaWxkKGhhbmRsZSk7ICAgICAgICBcclxuICAgIH1cclxufVxyXG4iLCJcclxuLyoqXHJcbiAqIE1lYXN1cmVzIG9mZnNldHMgb2YgdGV4dCBnbHlwaHMuXHJcbiAqL1xyXG5jbGFzcyBUZXh0UnVsZXIge1xyXG4gICAgXHJcbiAgICBmb250RmFtaWx5OiBzdHJpbmc7XHJcbiAgICBmb250V2VpZ2h0OiBudW1iZXI7XHJcbiAgICBmb250U2l6ZTogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCAodGV4dCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XHJcbiAgICAgICAgcG9pbnRUZXh0LmNvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgIHBvaW50VGV4dC5qdXN0aWZpY2F0aW9uID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBpZih0aGlzLmZvbnRGYW1pbHkpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udEZhbWlseSA9IHRoaXMuZm9udEZhbWlseTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5mb250V2VpZ2h0KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRXZWlnaHQgPSB0aGlzLmZvbnRXZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFNpemUpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcG9pbnRUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRleHRPZmZzZXRzKHRleHQpe1xyXG4gICAgICAgIC8vIE1lYXN1cmUgZ2x5cGhzIGluIHBhaXJzIHRvIGNhcHR1cmUgd2hpdGUgc3BhY2UuXHJcbiAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxyXG4gICAgICAgIHZhciBnbHlwaFBhaXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpKzEpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRm9yIGVhY2ggY2hhcmFjdGVyLCBmaW5kIGNlbnRlciBvZmZzZXQuXHJcbiAgICAgICAgdmFyIHhPZmZzZXRzID0gWzBdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gTWVhc3VyZSB0aHJlZSBjaGFyYWN0ZXJzIGF0IGEgdGltZSB0byBnZXQgdGhlIGFwcHJvcHJpYXRlIFxyXG4gICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxyXG4gICAgICAgICAgICB2YXIgdHJpYWRUZXh0ID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSAtIDEsIGkgKyAxKSk7XHJcbiAgICAgICAgICAgIHRyaWFkVGV4dC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXHJcbiAgICAgICAgICAgIC8vICAgYW5kIGhhbGYgb2YgY3VycmVudCBnbHlwaCBwYWlyLlxyXG4gICAgICAgICAgICAvLyBNdXN0IGJlIHJpZ2h0LCBiZWNhdXNlIGl0IHdvcmtzLlxyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2kgLSAxXS5ib3VuZHMud2lkdGggLyAyIFxyXG4gICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHdpZHRoIHRvIHByaW9yIG9mZnNldC4gXHJcbiAgICAgICAgICAgIHhPZmZzZXRzW2ldID0geE9mZnNldHNbaSAtIDFdICsgb2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgZ2x5cGhQYWlyIG9mIGdseXBoUGFpcnMpe1xyXG4gICAgICAgICAgICBnbHlwaFBhaXIucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB4T2Zmc2V0cztcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgVGV4dFdhcnAgZXh0ZW5kcyBEdWFsQm91bmRzUGF0aFdhcnAge1xyXG5cclxuICAgIHN0YXRpYyBERUZBVUxUX0ZPTlRfU0laRSA9IDY0O1xyXG5cclxuICAgIHByaXZhdGUgX2ZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICBwcml2YXRlIF90ZXh0OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9mb250U2l6ZTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZvbnQ6IG9wZW50eXBlLkZvbnQsXHJcbiAgICAgICAgdGV4dDogc3RyaW5nLFxyXG4gICAgICAgIGJvdW5kcz86IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9LFxyXG4gICAgICAgIGZvbnRTaXplPzogbnVtYmVyLFxyXG4gICAgICAgIHN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZighZm9udFNpemUpe1xyXG4gICAgICAgICAgICAgICAgZm9udFNpemUgPSBUZXh0V2FycC5ERUZBVUxUX0ZPTlRfU0laRTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBUZXh0V2FycC5nZXRQYXRoRGF0YShmb250LCB0ZXh0LCBmb250U2l6ZSk7IFxyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzdXBlcihwYXRoLCBib3VuZHMsIHN0eWxlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSBmb250O1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0ID0gdGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl90ZXh0ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmb250U2l6ZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IGZvbnRTaXplKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZighdmFsdWUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2ZvbnRTaXplID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmb250KHZhbHVlOiBvcGVudHlwZS5Gb250KXtcclxuICAgICAgICBpZih2YWx1ZSAhPT0gdGhpcy5fZm9udCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVUZXh0UGF0aCgpIHtcclxuICAgICAgICBjb25zdCBwYXRoRGF0YSA9IFRleHRXYXJwLmdldFBhdGhEYXRhKFxyXG4gICAgICAgICAgICB0aGlzLl9mb250LCB0aGlzLl90ZXh0LCB0aGlzLl9mb250U2l6ZSk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRQYXRoRGF0YShmb250OiBvcGVudHlwZS5Gb250LFxyXG4gICAgICAgIHRleHQ6IHN0cmluZywgZm9udFNpemU/OiBzdHJpbmd8bnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgb3BlblR5cGVQYXRoID0gZm9udC5nZXRQYXRoKHRleHQsIDAsIDAsXHJcbiAgICAgICAgICAgIE51bWJlcihmb250U2l6ZSkgfHwgVGV4dFdhcnAuREVGQVVMVF9GT05UX1NJWkUpO1xyXG4gICAgICAgIHJldHVybiBvcGVuVHlwZVBhdGgudG9QYXRoRGF0YSgpO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFZpZXdab29tIHtcclxuXHJcbiAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgZmFjdG9yID0gMS4yNTtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfbWluWm9vbTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbWF4Wm9vbTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbW91c2VOYXRpdmVTdGFydDogcGFwZXIuUG9pbnQ7XHJcbiAgICBwcml2YXRlIF92aWV3Q2VudGVyU3RhcnQ6IHBhcGVyLlBvaW50O1xyXG4gICAgcHJpdmF0ZSBfdmlld0NoYW5nZWQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlJlY3RhbmdsZT4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9qZWN0OiBwYXBlci5Qcm9qZWN0KSB7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcblxyXG4gICAgICAgICg8YW55PiQodmlldy5lbGVtZW50KSkubW91c2V3aGVlbCgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludChldmVudC5vZmZzZXRYLCBldmVudC5vZmZzZXRZKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2Vab29tQ2VudGVyZWQoZXZlbnQuZGVsdGFZLCBtb3VzZVBvc2l0aW9uKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGlkRHJhZyA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZpZXcub24oXCJtb3VzZWRyYWdcIiwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZighdGhpcy5fdmlld0NlbnRlclN0YXJ0KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDZW50ZXJTdGFydCA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgLy8gSGF2ZSB0byB1c2UgbmF0aXZlIG1vdXNlIG9mZnNldCwgYmVjYXVzZSBldi5kZWx0YSBcclxuICAgICAgICAgICAgICAgIC8vICBjaGFuZ2VzIGFzIHRoZSB2aWV3IGlzIHNjcm9sbGVkLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG5ldyBwYXBlci5Qb2ludChldi5ldmVudC5vZmZzZXRYLCBldi5ldmVudC5vZmZzZXRZKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3LmVtaXQoUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmF0aXZlRGVsdGEgPSBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgZXYuZXZlbnQub2Zmc2V0WCAtIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQueCxcclxuICAgICAgICAgICAgICAgICAgICBldi5ldmVudC5vZmZzZXRZIC0gdGhpcy5fbW91c2VOYXRpdmVTdGFydC55XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgLy8gTW92ZSBpbnRvIHZpZXcgY29vcmRpbmF0ZXMgdG8gc3VicmFjdCBkZWx0YSxcclxuICAgICAgICAgICAgICAgIC8vICB0aGVuIGJhY2sgaW50byBwcm9qZWN0IGNvb3Jkcy5cclxuICAgICAgICAgICAgICAgIHZpZXcuY2VudGVyID0gdmlldy52aWV3VG9Qcm9qZWN0KCBcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnByb2plY3RUb1ZpZXcodGhpcy5fdmlld0NlbnRlclN0YXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChuYXRpdmVEZWx0YSkpO1xyXG4gICAgICAgICAgICAgICAgdmlldy5lbWl0KFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnTW92ZSwgZXYpO1xyXG4gICAgICAgICAgICAgICAgZGlkRHJhZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB2aWV3Lm9uKFwibW91c2V1cFwiLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX21vdXNlTmF0aXZlU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2VudGVyU3RhcnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmlldy5lbWl0KFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnRW5kLCBldik7XHJcbiAgICAgICAgICAgICAgICBpZihkaWREcmFnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlld0NoYW5nZWQubm90aWZ5KHZpZXcuYm91bmRzKTtcclxuICAgICAgICAgICAgICAgICAgICBkaWREcmFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmlld0NoYW5nZWQoKSA6IE9ic2VydmFibGVFdmVudDxwYXBlci5SZWN0YW5nbGU+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlld0NoYW5nZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHpvb20oKTogbnVtYmVye1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2plY3Qudmlldy56b29tO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB6b29tUmFuZ2UoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Wm9vbVJhbmdlKHJhbmdlOiBwYXBlci5TaXplW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGNvbnN0IGFTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICBjb25zdCBiU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgY29uc3QgYSA9IGFTaXplICYmIE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYVNpemUuaGVpZ2h0LCAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGFTaXplLndpZHRoKTtcclxuICAgICAgICBjb25zdCBiID0gYlNpemUgJiYgTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBiU2l6ZS5oZWlnaHQsICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYlNpemUud2lkdGgpO1xyXG4gICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKGEsYik7XHJcbiAgICAgICAgaWYobWluKXtcclxuICAgICAgICAgICAgdGhpcy5fbWluWm9vbSA9IG1pbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoYSxiKTtcclxuICAgICAgICBpZihtYXgpe1xyXG4gICAgICAgICAgICB0aGlzLl9tYXhab29tID0gbWF4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgfVxyXG5cclxuICAgIHpvb21UbyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpe1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICB2aWV3LmNlbnRlciA9IHJlY3QuY2VudGVyO1xyXG4gICAgICAgIHZpZXcuem9vbSA9IE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy52aWV3U2l6ZS5oZWlnaHQgLyByZWN0LmhlaWdodCwgXHJcbiAgICAgICAgICAgIHZpZXcudmlld1NpemUud2lkdGggLyByZWN0LndpZHRoKTtcclxuICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVpvb21DZW50ZXJlZChkZWx0YTogbnVtYmVyLCBtb3VzZVBvczogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICBpZiAoIWRlbHRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGNvbnN0IG9sZFpvb20gPSB2aWV3Lnpvb207XHJcbiAgICAgICAgY29uc3Qgb2xkQ2VudGVyID0gdmlldy5jZW50ZXI7XHJcbiAgICAgICAgY29uc3Qgdmlld1BvcyA9IHZpZXcudmlld1RvUHJvamVjdChtb3VzZVBvcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG5ld1pvb20gPSBkZWx0YSA+IDBcclxuICAgICAgICAgICAgPyB2aWV3Lnpvb20gKiB0aGlzLmZhY3RvclxyXG4gICAgICAgICAgICA6IHZpZXcuem9vbSAvIHRoaXMuZmFjdG9yO1xyXG4gICAgICAgIG5ld1pvb20gPSB0aGlzLnNldFpvb21Db25zdHJhaW5lZChuZXdab29tKTtcclxuICAgICAgICBcclxuICAgICAgICBpZighbmV3Wm9vbSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHpvb21TY2FsZSA9IG9sZFpvb20gLyBuZXdab29tO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlckFkanVzdCA9IHZpZXdQb3Muc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuICAgICAgICBjb25zdCBvZmZzZXQgPSB2aWV3UG9zLnN1YnRyYWN0KGNlbnRlckFkanVzdC5tdWx0aXBseSh6b29tU2NhbGUpKVxyXG4gICAgICAgICAgICAuc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuXHJcbiAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LmNlbnRlci5hZGQob2Zmc2V0KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgem9vbSBsZXZlbC5cclxuICAgICAqIEByZXR1cm5zIHpvb20gbGV2ZWwgdGhhdCB3YXMgc2V0LCBvciBudWxsIGlmIGl0IHdhcyBub3QgY2hhbmdlZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNldFpvb21Db25zdHJhaW5lZCh6b29tOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGlmKHRoaXMuX21pblpvb20pIHtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWF4KHpvb20sIHRoaXMuX21pblpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9tYXhab29tKXtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWluKHpvb20sIHRoaXMuX21heFpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgaWYoem9vbSAhPSB2aWV3Lnpvb20pe1xyXG4gICAgICAgICAgICB2aWV3Lnpvb20gPSB6b29tO1xyXG4gICAgICAgICAgICByZXR1cm4gem9vbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmludGVyZmFjZSBTa2V0Y2hJdGVtU3R5bGUgZXh0ZW5kcyBwYXBlci5JU3R5bGUge1xyXG4gICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG59XHJcbiIsIlxyXG5cclxuZnVuY3Rpb24gYm9vdHN0cmFwKCkge1xyXG4gICAgXHJcbiAgICBjb25zdCBzdG9yZSA9IG5ldyBTdG9yZSgpO1xyXG4gICAgXHJcbiAgICBjb25zdCBza2V0Y2hFZGl0b3IgPSBuZXcgU2tldGNoRWRpdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNpZ25lcicpLCBzdG9yZSk7XHJcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1FZGl0b3IgPSBuZXcgU2VsZWN0ZWRJdGVtRWRpdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdG9yT3ZlcmxheVwiKSwgc3RvcmUpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gbmV3IEFwcENvbnRyb2xsZXIoc3RvcmUsIHNrZXRjaEVkaXRvciwgc2VsZWN0ZWRJdGVtRWRpdG9yKTtcclxuXHJcbn1cclxuXHJcbmNvbnN0IGFwcCA9IGJvb3RzdHJhcCgpO1xyXG4iXX0=