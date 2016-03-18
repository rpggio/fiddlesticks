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
    function initErrorHandler(logger) {
        window.onerror = function (msg, file, line, col, error) {
            try {
                var callback = function (stackframes) {
                    try {
                        var data = {
                            message: msg,
                            file: file,
                            line: line,
                            col: col,
                            stack: stackframes
                        };
                        logger(data);
                    }
                    catch (err) {
                        console.error("Failed to log error", err);
                    }
                };
                var errback = function (err) {
                    console.error("Failed to log error", err);
                };
                if (typeof error === "string") {
                    error = new Error(error);
                }
                var asError = typeof error === "string"
                    ? new Error(error)
                    : error;
                var stack = StackTrace.fromError(asError)
                    .then(callback)
                    .catch(errback);
            }
            catch (ex) {
                console.error("failed to log error", ex);
            }
        };
    }
    DomHelpers.initErrorHandler = initErrorHandler;
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
    function getCssStyle(family, variant, size) {
        var style = { fontFamily: family };
        if (variant && variant.indexOf("italic") >= 0) {
            style.fontStyle = "italic";
        }
        var numeric = variant && variant.replace(/[^\d]/g, "");
        if (numeric && numeric.length) {
            style.fontWeight = numeric.toString();
        }
        if (size) {
            style.fontSize = size;
        }
        return style;
    }
    FontHelpers.getCssStyle = getCssStyle;
    function getStyleString(family, variant, size) {
        var styleObj = getCssStyle(family, variant, size);
        var parts = [];
        if (styleObj.fontFamily) {
            parts.push("font-family:'" + styleObj.fontFamily + "'");
        }
        if (styleObj.fontWeight) {
            parts.push("font-weight:" + styleObj.fontWeight);
        }
        if (styleObj.fontStyle) {
            parts.push("font-style:" + styleObj.fontStyle);
        }
        if (styleObj.fontSize) {
            parts.push("font-size:" + styleObj.fontSize);
        }
        return parts.join("; ");
    }
    FontHelpers.getStyleString = getStyleString;
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
    return (new Date().getTime() + Math.random())
        .toString(36).replace('.', '');
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
        ChannelTopic.prototype.subscribeData = function (observer) {
            this.observe().subscribe(function (m) { return observer(m.data); });
        };
        ChannelTopic.prototype.dispatch = function (data) {
            this.channel.onNext({
                type: this.type,
                data: data
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
            // if (ev.smartDragItem) {
            //     console.warn("Will not assign smartDragItem: value was already " + ev.smartDragItem);
            // } else {
            //     ev.smartDragItem = item;
            // }
            if (item.isSmartDragging) {
                item.isSmartDragging = false;
                log("emitting smartDrag.smartDragEnd");
                if (item.responds(PaperHelpers.EventType.smartDragEnd)) {
                    item.emit(PaperHelpers.EventType.smartDragEnd, ev);
                    ev.stop();
                }
            }
            else {
                if (item.responds(PaperHelpers.EventType.clickWithoutDrag)) {
                    log("emitting smartDrag.clickWithoutDrag");
                    item.emit(PaperHelpers.EventType.clickWithoutDrag, ev);
                    ev.stop();
                }
            }
            //ev.preventDefault();
            //ev.stopPropagation();
            //ev.stop();
        });
        var lastClick;
        item.on(PaperHelpers.EventType.clickWithoutDrag, function (ev) {
            if (lastClick && (new Date()).getTime() - lastClick < 700) {
                item.emit(PaperHelpers.EventType.doubleClickWithoutDrag, ev);
            }
            lastClick = (new Date()).getTime();
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
        clickWithoutDrag: "clickWithoutDrag",
        doubleClickWithoutDrag: "doubleClickWithoutDrag"
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
var VDomHelpers;
(function (VDomHelpers) {
    function renderAsChild(container, dom) {
        var child = document.createElement("div");
        var patched = patch(child, dom);
        container.appendChild(patched.elm);
    }
    VDomHelpers.renderAsChild = renderAsChild;
})(VDomHelpers || (VDomHelpers = {}));
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
var App = (function () {
    function App() {
        DomHelpers.initErrorHandler(function (errorData) {
            var content = JSON.stringify(errorData);
            $.ajax({
                url: "/api/client-errors",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: content
            });
        });
        this.router = new AppRouter();
        this.store = new Store(this.router);
        var sketchEditor = new SketchEditor(document.getElementById('designer'), this.store);
        var selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), this.store);
        var helpDialog = new HelpDialog(document.getElementById("help-dialog"), this.store);
        var actions = this.store.actions, events = this.store.events;
    }
    App.prototype.start = function () {
        var _this = this;
        this.store.events.app.fontLoaded.observe().first().subscribe(function (m) {
            _this.workspaceController = new WorkspaceController(_this.store, m.data);
            _this.store.events.app.workspaceInitialized.subscribe(function (m) {
                if (_this.store.state.sketch.textBlocks.length == 0) {
                    _this.store.actions.textBlock.add.dispatch({ text: "SKETCH WITH WORDS" });
                }
            });
            _this.store.actions.app.initWorkspace.dispatch();
        });
    };
    return App;
}());
var AppRouter = (function (_super) {
    __extends(AppRouter, _super);
    function AppRouter() {
        var _this = this;
        _super.call(this, [
            new RouteNode("home", "/"),
            new RouteNode("sketch", "/sketch/:sketchId"),
        ], {
            useHash: false
        });
        //this.usePlugin(loggerPlugin())
        this.usePlugin(listenersPlugin.default())
            .usePlugin(historyPlugin.default());
        this.start(function (err, state) {
            if (err) {
                console.warn("router error", err);
                _this.navigate("home");
            }
        });
    }
    return AppRouter;
}(Router5));
var DocumentKeyHandler = (function () {
    function DocumentKeyHandler(store) {
        // note: undisposed event subscription
        $(document).keyup(function (e) {
            if (e.keyCode == DomHelpers.KeyCodes.Esc) {
                store.actions.sketch.setSelection.dispatch(null);
            }
        });
    }
    return DocumentKeyHandler;
}());
// namespace SketchEditor {
//     export class EditorModule {
//     }
// }
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
    function Store(router) {
        var _this = this;
        this.state = {};
        this.resources = {
            fallbackFont: opentype.Font,
            fontFamilies: new FontFamilies(),
            parsedFonts: new ParsedFonts(function (url, font) {
                return _this.events.app.fontLoaded.dispatch(font);
            })
        };
        this.actions = new Actions();
        this.events = new Events();
        this._sketchContent$ = new Rx.Subject();
        this.router = router;
        this.setupState();
        this.setupSubscriptions();
        this.loadResources();
    }
    Store.prototype.setupState = function () {
        this.state.browserId = Cookies.get(Store.BROWSER_ID_KEY);
        if (!this.state.browserId) {
            this.state.browserId = newid();
            Cookies.set(Store.BROWSER_ID_KEY, this.state.browserId, { expires: 2 * 365 });
        }
    };
    Store.prototype.setupSubscriptions = function () {
        var _this = this;
        var actions = this.actions, events = this.events;
        // ----- App -----
        actions.app.initWorkspace.observe()
            .pausableBuffered(events.app.resourcesReady.observe().map(function (m) { return m.data; }))
            .subscribe(function (m) {
            _this.setSelection(null, true);
            _this.setEditingItem(null, true);
            var sketchIdParam = _this.sketchIdUrlParam;
            if (sketchIdParam) {
                S3Access.getFile(sketchIdParam + ".json")
                    .done(function (sketch) {
                    _this.loadSketch(sketch);
                    console.log("Retrieved sketch", sketch._id);
                    if (sketch.browserId === _this.state.browserId) {
                        console.log('Sketch was created in this browser');
                    }
                    else {
                        console.log('Sketch was created in a different browser');
                    }
                    events.app.workspaceInitialized.dispatch(_this.state.sketch);
                })
                    .fail(function (err) {
                    console.warn("error getting remote sketch", err);
                    _this.loadSketch(_this.createSketch());
                    events.app.workspaceInitialized.dispatch(_this.state.sketch);
                });
            }
            else {
                _this.loadSketch(_this.createSketch());
            }
            /* --- Set up sketch state watched --- */
            // this._sketchContent$
            //     .debounce(Store.LOCAL_CACHE_DELAY_MS)
            //     .subscribe(rs => {
            //         if (!localStorage || !localStorage.getItem) {
            //             // not supported
            //             return;
            //         }
            //         localStorage.setItem(
            //             Store.SKETCH_LOCAL_CACHE_KEY,
            //             JSON.stringify(this.state.sketch));
            //     });
            _this._sketchContent$.debounce(Store.SERVER_SAVE_DELAY_MS)
                .subscribe(function (sketch) {
                if (sketch && sketch._id && sketch.textBlocks.length) {
                    _this.saveSketch(sketch);
                }
            });
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
            events.designer.viewChanged.dispatch(m.data);
        });
        actions.designer.updateSnapshot.subscribe(function (m) {
            if (m.data.sketch._id) {
                var filename = m.data.sketch._id + ".png";
                var blob = DomHelpers.dataURLToBlob(m.data.pngDataUrl);
                S3Access.putFile(filename, "image/png", blob);
            }
        });
        actions.designer.toggleHelp.subscribe(function () {
            _this.state.showHelp = !_this.state.showHelp;
            events.designer.showHelpChanged.dispatch(_this.state.showHelp);
        });
        // ----- Sketch -----
        actions.sketch.create.subscribe(function (m) {
            var sketch = _this.createSketch();
            var patch = m.data || {};
            patch.backgroundColor = patch.backgroundColor || '#f6f3eb';
            _this.assign(sketch, patch);
            _this.loadSketch(sketch);
            _this.resources.parsedFonts.get(_this.state.sketch.defaultTextBlockAttr.fontFamily);
            _this.setEditingItem(null);
            _this.changedSketch();
        });
        actions.sketch.clone.subscribe(function () {
            var newSketch = _.clone(_this.state.sketch);
            newSketch._id = newid();
            _this.loadSketch(newSketch);
        });
        actions.sketch.attrUpdate.subscribe(function (ev) {
            _this.assign(_this.state.sketch, ev.data);
            events.sketch.attrChanged.dispatch(_this.state.sketch);
            _this.changedSketch();
        });
        actions.sketch.setSelection.subscribe(function (m) {
            _this.setSelection(m.data);
            _this.setEditingItem(m.data);
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
            if (!block.textColor) {
                block.textColor = _this.state.sketch.defaultTextBlockAttr.textColor;
            }
            if (!block.fontFamily) {
                block.fontFamily = _this.state.sketch.defaultTextBlockAttr.fontFamily;
                block.fontVariant = _this.state.sketch.defaultTextBlockAttr.fontVariant;
            }
            _this.state.sketch.textBlocks.push(block);
            events.textblock.added.dispatch(block);
            _this.changedSketch();
            _this.loadTextBlockFont(block);
        });
        actions.textBlock.updateAttr
            .subscribe(function (ev) {
            var block = _this.getBlock(ev.data._id);
            if (block) {
                var patch_1 = {
                    text: ev.data.text,
                    backgroundColor: ev.data.backgroundColor,
                    textColor: ev.data.textColor,
                    fontFamily: ev.data.fontFamily,
                    fontVariant: ev.data.fontVariant
                };
                var fontChanged = patch_1.fontFamily !== block.fontFamily
                    || patch_1.fontVariant !== block.fontVariant;
                _this.assign(block, patch_1);
                if (block.fontFamily && !block.fontVariant) {
                    var famDef = _this.resources.fontFamilies.get(block.fontFamily);
                    if (famDef) {
                        // regular or else first variant
                        block.fontVariant = _this.resources.fontFamilies.defaultVariant(famDef);
                    }
                }
                _this.state.sketch.defaultTextBlockAttr = {
                    textColor: block.textColor,
                    backgroundColor: block.backgroundColor,
                    fontFamily: block.fontFamily,
                    fontVariant: block.fontVariant
                };
                events.textblock.attrChanged.dispatch(block);
                _this.changedSketch();
                if (fontChanged) {
                    _this.loadTextBlockFont(block);
                }
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
                events.textblock.removed.dispatch({ _id: ev.data._id });
                _this.changedSketch();
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
                _this.changedSketch();
            }
        });
    };
    Store.prototype.loadSketch = function (sketch) {
        this.state.loadingSketch = true;
        this.state.sketch = sketch;
        this.sketchIdUrlParam = sketch._id;
        this.events.sketch.loaded.dispatch(this.state.sketch);
        for (var _i = 0, _a = this.state.sketch.textBlocks; _i < _a.length; _i++) {
            var tb = _a[_i];
            this.events.textblock.loaded.dispatch(tb);
            this.loadTextBlockFont(tb);
        }
        this.events.designer.zoomToFitRequested.dispatch();
        this.state.loadingSketch = false;
    };
    Store.prototype.loadResources = function () {
        var _this = this;
        this.resources.fontFamilies.loadCatalogLocal(function (families) {
            // load fonts into browser for preview
            _this.resources.fontFamilies.loadPreviewSubsets(families.map(function (f) { return f.family; }));
            _this.resources.parsedFonts.get(Store.FALLBACK_FONT_URL, function (url, font) { return _this.resources.fallbackFont = font; });
            _this.events.app.resourcesReady.dispatch(true);
        });
    };
    Store.prototype.showUserMessage = function (message) {
        var _this = this;
        this.state.userMessage = message;
        this.events.designer.userMessageChanged.dispatch(message);
        setTimeout(function () {
            _this.state.userMessage = null;
            _this.events.designer.userMessageChanged.dispatch(null);
        }, 1500);
    };
    Store.prototype.loadTextBlockFont = function (block) {
        var _this = this;
        this.resources.parsedFonts.get(this.resources.fontFamilies.getUrl(block.fontFamily, block.fontVariant), function (url, font) { return _this.events.textblock.fontReady.dispatch({ textBlockId: block._id, font: font }); });
    };
    Store.prototype.changedSketch = function () {
        this.events.sketch.contentChanged.dispatch(this.state.sketch);
        this._sketchContent$.onNext(this.state.sketch);
    };
    Store.prototype.assign = function (dest, source) {
        _.merge(dest, source);
    };
    Store.prototype.createSketch = function () {
        return {
            _id: newid(),
            browserId: this.state.browserId,
            defaultTextBlockAttr: {
                fontFamily: "Roboto",
                fontVariant: "regular",
                textColor: "lightgray"
            },
            textBlocks: []
        };
    };
    Object.defineProperty(Store.prototype, "sketchIdUrlParam", {
        get: function () {
            var routeState = this.router.getState();
            return routeState.params.sketchId;
        },
        set: function (value) {
            this.router.navigate("sketch", { sketchId: value });
        },
        enumerable: true,
        configurable: true
    });
    Store.prototype.saveSketch = function (sketch) {
        S3Access.putFile(sketch._id + ".json", "application/json", JSON.stringify(sketch));
        this.showUserMessage("Saved");
        this.events.designer.snapshotExpired.dispatch(sketch);
    };
    Store.prototype.setSelection = function (item, force) {
        if (!force) {
            // early exit on no change
            if (item) {
                if (this.state.selection
                    && this.state.selection.itemId === item.itemId) {
                    return;
                }
            }
            else {
                if (!this.state.selection) {
                    return;
                }
            }
        }
        this.state.selection = item;
        this.events.sketch.selectionChanged.dispatch(item);
    };
    Store.prototype.setEditingItem = function (item, force) {
        if (!force) {
            // early exit on no change
            if (item) {
                if (this.state.editingItem
                    && this.state.editingItem.itemId === item.itemId) {
                    return;
                }
            }
            else {
                if (!this.state.editingItem) {
                    return;
                }
            }
        }
        if (this.state.editingItem) {
            // signal closing editor for item
            if (this.state.editingItem.itemType === "TextBlock") {
                var currentEditingBlock = this.getBlock(this.state.editingItem.itemId);
                if (currentEditingBlock) {
                    this.events.textblock.editorClosed.dispatch(currentEditingBlock);
                }
            }
        }
        if (item) {
            // editing item should be selected item
            this.setSelection(item);
        }
        this.state.editingItem = item;
        this.events.sketch.editingItemChanged.dispatch(item);
    };
    Store.prototype.getBlock = function (id) {
        return _.find(this.state.sketch.textBlocks, function (tb) { return tb._id === id; });
    };
    Store.BROWSER_ID_KEY = "browserId";
    Store.FALLBACK_FONT_URL = "/fonts/Roboto-500.ttf";
    Store.DEFAULT_FONT_NAME = "Roboto";
    Store.FONT_LIST_LIMIT = 100;
    Store.SKETCH_LOCAL_CACHE_KEY = "fiddlesticks.io.lastSketch";
    Store.LOCAL_CACHE_DELAY_MS = 1000;
    Store.SERVER_SAVE_DELAY_MS = 6000;
    return Store;
}());
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
        var canvasSel = $(this.canvas);
        store.events.mergeTyped(store.events.sketch.loaded, store.events.sketch.attrChanged).subscribe(function (ev) {
            return canvasSel.css("background-color", ev.data.backgroundColor);
        });
        this.viewZoom = new ViewZoom(this.project);
        this.viewZoom.viewChanged.subscribe(function (bounds) {
            store.actions.designer.viewChanged.dispatch(bounds);
        });
        var clearSelection = function (ev) {
            if (store.state.selection) {
                store.actions.sketch.setSelection.dispatch(null);
            }
        };
        paper.view.on(paper.EventType.click, clearSelection);
        paper.view.on(PaperHelpers.EventType.smartDragStart, clearSelection);
        var keyHandler = new DocumentKeyHandler(store);
        // ----- Designer -----
        store.events.designer.zoomToFitRequested.subscribe(function () {
            _this.zoomToFit();
        });
        store.events.designer.exportPNGRequested.subscribe(function () {
            var fileName = _this.getSketchFileName(40, "png");
            var data = _this.getSnapshotPNG();
            DomHelpers.downloadFile(data, fileName);
        });
        store.events.designer.exportSVGRequested.subscribe(function () {
            _this.downloadSVG();
        });
        store.events.designer.snapshotExpired.subscribe(function (m) {
            var dataUrl = _this.getSnapshotPNG();
            store.actions.designer.updateSnapshot.dispatch({
                sketch: m.data, pngDataUrl: dataUrl
            });
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
                item.customStyle = {
                    fillColor: textBlock.textColor,
                    backgroundColor: textBlock.backgroundColor
                };
            }
        });
        store.events.textblock.fontReady.subscribeData(function (data) {
            var item = _this._textBlockItems[data.textBlockId];
            if (item) {
                item.font = data.font;
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
        var bounds = this.getViewableBounds();
        this.viewZoom.zoomTo(bounds.scale(1.2));
    };
    WorkspaceController.prototype.getViewableBounds = function () {
        var bounds;
        _.forOwn(this._textBlockItems, function (item) {
            bounds = bounds
                ? bounds.unite(item.bounds)
                : item.bounds;
        });
        if (!bounds) {
            bounds = new paper.Rectangle(new paper.Point(0, 0), this.defaultSize.multiply(this.defaultScale));
        }
        return bounds;
    };
    WorkspaceController.prototype.getSnapshotPNG = function () {
        var background = this.insertBackground();
        var raster = this.project.activeLayer.rasterize(300, false);
        var data = raster.toDataURL();
        background.remove();
        return data;
    };
    WorkspaceController.prototype.downloadSVG = function () {
        var background;
        if (this.store.state.sketch.backgroundColor) {
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
        outer: for (var _i = 0, _a = this.store.state.sketch.textBlocks; _i < _a.length; _i++) {
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
        var bounds = this.getViewableBounds();
        var margin = Math.max(bounds.width, bounds.height) * 0.02;
        var background = paper.Shape.Rectangle(bounds.topLeft.subtract(margin), bounds.bottomRight.add(margin));
        background.fillColor = this.store.state.sketch.backgroundColor;
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
        item = new TextWarp(this.fallbackFont, textBlock.text, bounds, null, {
            fillColor: textBlock.textColor || "red",
            backgroundColor: textBlock.backgroundColor
        });
        if (!textBlock.outline && textBlock.position) {
            item.position = new paper.Point(textBlock.position);
        }
        item.on(PaperHelpers.EventType.clickWithoutDrag, function (ev) {
            if (item.selected) {
                // select next item behind
                var otherHits = _.values(_this._textBlockItems)
                    .filter(function (i) { return i.id !== item.id && i.contains(ev.point); });
                var otherItem_1 = _.sortBy(otherHits, function (i) { return i.index; })[0];
                if (otherItem_1) {
                    otherItem_1.bringToFront();
                    var otherId = _.findKey(_this._textBlockItems, function (i) { return i === otherItem_1; });
                    if (otherId) {
                        _this.store.actions.sketch.setSelection.dispatch({ itemId: otherId, itemType: "TextBlock" });
                    }
                }
            }
            else {
                item.bringToFront();
                if (!item.selected) {
                    _this.store.actions.sketch.setSelection.dispatch({ itemId: textBlock._id, itemType: "TextBlock" });
                }
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
var Actions = (function (_super) {
    __extends(Actions, _super);
    function Actions() {
        _super.apply(this, arguments);
        this.app = {
            /**
             * Instructs Store to load retained state from local storage, if it exists.
             */
            initWorkspace: this.topic("app.initWorkspace"),
            loadFont: this.topic("app.loadFont")
        };
        this.designer = {
            zoomToFit: this.topic("designer.zoomToFit"),
            exportingImage: this.topic("designer.exportImage"),
            exportPNG: this.topic("designer.exportPNG"),
            exportSVG: this.topic("designer.exportSVG"),
            viewChanged: this.topic("designer.viewChanged"),
            updateSnapshot: this.topic("designer.updateSnapshot"),
            toggleHelp: this.topic("designer.toggleHelp"),
        };
        this.sketch = {
            create: this.topic("sketch.create"),
            clone: this.topic("sketch.clone"),
            attrUpdate: this.topic("sketch.attrUpdate"),
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
            workspaceInitialized: this.topic("app.workspaceInitialized"),
            fontLoaded: this.topic("app.fontLoaded")
        };
        this.designer = {
            zoomToFitRequested: this.topic("designer.zoomToFitRequested"),
            exportPNGRequested: this.topic("designer.exportPNGRequested"),
            exportSVGRequested: this.topic("designer.exportSVGRequested"),
            viewChanged: this.topic("designer.viewChanged"),
            snapshotExpired: this.topic("designer.snapshotExpired"),
            userMessageChanged: this.topic("designer.userMessageChanged"),
            showHelpChanged: this.topic("designer.showHelpChanged")
        };
        this.sketch = {
            loaded: this.topic("sketch.loaded"),
            attrChanged: this.topic("sketch.attrChanged"),
            contentChanged: this.topic("sketch.contentChanged"),
            editingItemChanged: this.topic("sketch.editingItemChanged"),
            selectionChanged: this.topic("sketch.selectionChanged"),
            saveLocalRequested: this.topic("sketch.savelocal.saveLocalRequested")
        };
        this.textblock = {
            added: this.topic("textblock.added"),
            attrChanged: this.topic("textblock.attrChanged"),
            fontReady: this.topic("textblock.fontReady"),
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
var FontFamilies = (function () {
    function FontFamilies() {
        this.catalog = [];
    }
    FontFamilies.prototype.get = function (family) {
        return _.find(this.catalog, function (ff) { return ff.family === family; });
    };
    FontFamilies.prototype.getUrl = function (family, variant) {
        var famDef = this.get(family);
        if (!famDef) {
            console.warn("no definition available for family", family);
            return null;
        }
        var file = famDef.files[variant];
        if (!file) {
            console.warn("no font file available for variant", family, variant);
            file = famDef.files[0];
        }
        return file;
    };
    FontFamilies.prototype.defaultVariant = function (famDef) {
        if (!famDef)
            return null;
        if (famDef.variants.indexOf("regular") >= 0) {
            return "regular";
        }
        return famDef.variants[0];
    };
    FontFamilies.prototype.loadCatalogLocal = function (callback) {
        var _this = this;
        $.ajax({
            url: "fonts/google-fonts.json",
            dataType: 'json',
            cache: true,
            success: function (response) {
                var filteredItems = response.items.slice(0, FontFamilies.CATALOG_LIMIT);
                // make files htts
                var _loop_1 = function(fam) {
                    _.forOwn(fam.files, function (val, key) {
                        if (_.startsWith(val, "http:")) {
                            fam.files[key] = val.replace("http:", "https:");
                        }
                    });
                };
                for (var _i = 0, filteredItems_1 = filteredItems; _i < filteredItems_1.length; _i++) {
                    var fam = filteredItems_1[_i];
                    _loop_1(fam);
                }
                _this.catalog = filteredItems;
                callback(_this.catalog);
            },
            error: function (xhr, status, err) {
                console.error("google-fonts.json", status, err.toString());
            }
        });
    };
    // loadCatalogRemote(callback: (families: FontFamily[]) => void) {
    //     var url = 'https://www.googleapis.com/webfonts/v1/webfonts?';
    //     var key = 'key=GOOGLE-API-KEY';
    //     var sort = "popularity";
    //     var opt = 'sort=' + sort + '&';
    //     var req = url + opt + key;
    //     $.ajax({
    //         url: req,
    //         dataType: 'json',
    //         cache: true,
    //         success: (response: { kind: string, items: FontFamily[] }) => {
    //             callback(response.items);
    //         },
    //         error: (xhr, status, err) => {
    //             console.error(url, status, err.toString());
    //         }
    //     });
    // }
    /**
     * For a list of families, load alphanumeric chars into browser
     *   to support previewing.
     */
    FontFamilies.prototype.loadPreviewSubsets = function (families) {
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
    FontFamilies.CATALOG_LIMIT = 150;
    return FontFamilies;
}());
var ParsedFonts = (function () {
    function ParsedFonts(fontLoaded) {
        this.fonts = {};
        this._fontLoaded = fontLoaded;
    }
    ParsedFonts.prototype.get = function (fontUrl, onReady) {
        var _this = this;
        if (onReady === void 0) { onReady = null; }
        if (!fontUrl) {
            return;
        }
        var font = this.fonts[fontUrl];
        if (font) {
            onReady && onReady(fontUrl, font);
            return;
        }
        opentype.load(fontUrl, function (err, font) {
            if (err) {
                console.error(err, { fontUrl: fontUrl });
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
    function putFile(fileName, fileType, data) {
        // https://github.com/aws/aws-sdk-js/issues/190   
        if (navigator.userAgent.match(/Firefox/) && !fileType.match(/;/)) {
            var charset = '; charset=UTF-8';
            fileType += charset;
        }
        var signUrl = "/api/storage/access?fileName=" + fileName + "&fileType=" + fileType;
        // get signed URL
        $.getJSON(signUrl)
            .done(function (signResponse) {
            // PUT file
            var putRequest = {
                method: "PUT",
                cache: false,
                url: signResponse.signedRequest,
                headers: {
                    "x-amz-acl": "public-read"
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
            console.error("error on /api/storage/access", err);
        });
    }
    S3Access.putFile = putFile;
    /**
     * Download file from bucket
     */
    function getFile(fileName) {
        return $.ajax({
            url: "/api/storage/url?fileName=" + fileName,
            dataType: "json",
            cache: false
        })
            .then(function (response) {
            console.log("downloading", response.url);
            return $.ajax({
                url: response.url,
                dataType: "json",
                cache: false
            });
        });
    }
    S3Access.getFile = getFile;
})(S3Access || (S3Access = {}));
var ColorPicker;
(function (ColorPicker) {
    var DEFAULT_PALETTE_GROUPS = [
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
    ];
    var MONO_PALETTE = ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"];
    function setup(elem, featuredColors, onChange) {
        var featuredGroups = _.chunk(featuredColors, 5);
        // for each palette group
        var defaultPaletteGroups = DEFAULT_PALETTE_GROUPS.map(function (group) {
            var parsedGroup = group.map(function (c) { return new paper.Color(c); });
            // create light variants of darkest three
            var addColors = _.sortBy(parsedGroup, function (c) { return c.lightness; })
                .slice(0, 3)
                .map(function (c) {
                var c2 = c.clone();
                c2.lightness = 0.85;
                return c2;
            });
            parsedGroup = parsedGroup.concat(addColors);
            parsedGroup = _.sortBy(parsedGroup, function (c) { return c.lightness; });
            return parsedGroup.map(function (c) { return c.toCSS(true); });
        });
        var palette = featuredGroups.concat(defaultPaletteGroups);
        palette.push(MONO_PALETTE);
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
var FontPicker = (function () {
    function FontPicker(container, store, block) {
        var _this = this;
        this.defaultFontFamily = "Roboto";
        this.previewFontSize = "28px";
        this.store = store;
        var dom$ = Rx.Observable.just(block)
            .merge(store.events.textblock.attrChanged.observe()
            .filter(function (m) { return m.data._id === block._id; })
            .map(function (m) { return m.data; }))
            .map(function (tb) { return _this.render(tb); });
        ReactiveDom.renderStream(dom$, container);
    }
    FontPicker.prototype.render = function (block) {
        var _this = this;
        var update = function (patch) {
            patch._id = block._id;
            _this.store.actions.textBlock.updateAttr.dispatch(patch);
        };
        var elements = [];
        elements.push(h("select", {
            key: "selectPicker",
            class: {
                "family-picker": true
            },
            attrs: {},
            hook: {
                insert: function (vnode) {
                    $(vnode.elm).selectpicker();
                },
                destroy: function (vnode) {
                    $(vnode.elm).selectpicker("destroy");
                }
            },
            on: {
                change: function (ev) { return update({
                    fontFamily: ev.target.value,
                    fontVariant: _this.store.resources.fontFamilies.defaultVariant(_this.store.resources.fontFamilies.get(ev.target.value))
                }); }
            }
        }, this.store.resources.fontFamilies.catalog
            .map(function (ff) { return h("option", {
            attrs: {
                selected: ff.family === block.fontFamily,
                "data-content": "<span style=\"" + FontHelpers.getStyleString(ff.family, null, _this.previewFontSize) + "\">" + ff.family + "</span>"
            },
        }, [ff.family]); })));
        var selectedFamily = this.store.resources.fontFamilies.get(block.fontFamily);
        if (selectedFamily && selectedFamily.variants
            && selectedFamily.variants.length > 1) {
            elements.push(h("select", {
                key: "variantPicker",
                class: {
                    "variant-picker": true
                },
                attrs: {},
                hook: {
                    insert: function (vnode) {
                        $(vnode.elm).selectpicker();
                    },
                    destroy: function (vnode) {
                        $(vnode.elm).selectpicker("destroy");
                    },
                    postpatch: function (oldVnode, vnode) {
                        setTimeout(function () {
                            // Q: why can't we just do selectpicker(refresh) here?
                            // A: selectpicker has mental problems
                            $(vnode.elm).selectpicker("destroy");
                            $(vnode.elm).selectpicker();
                        });
                    }
                },
                on: {
                    change: function (ev) { return update({ fontVariant: ev.target.value }); }
                }
            }, selectedFamily.variants.map(function (v) {
                return h("option", {
                    attrs: {
                        selected: v === block.fontVariant,
                        value: v,
                        "data-container": "body",
                        "data-content": "<span style=\"" + FontHelpers.getStyleString(selectedFamily.family, v, _this.previewFontSize) + "\">" + v + "</span>"
                    }
                }, [v]);
            })));
        }
        return h("div", {
            class: { "font-picker": true }
        }, elements);
    };
    return FontPicker;
}());
var HelpDialog = (function () {
    function HelpDialog(container, store) {
        var _this = this;
        this.store = store;
        var outer = $(container);
        outer.append("<h3>Getting started</h3>");
        store.state.showHelp ? outer.show() : outer.hide();
        $.get("content/help.html", function (d) {
            $(d).appendTo(outer);
            outer.append("<i>click to close</i>");
        });
        outer.on("click", function (ev) {
            _this.store.actions.designer.toggleHelp.dispatch();
        });
        store.events.designer.showHelpChanged.subscribeData(function (show) {
            show ? outer.show() : outer.hide();
        });
    }
    return HelpDialog;
}());
var SelectedItemEditor = (function () {
    function SelectedItemEditor(container, store) {
        var dom$ = store.events.sketch.editingItemChanged.observe()
            .map(function (i) {
            var posItem = i.data;
            var block = posItem
                && posItem.itemType === 'TextBlock'
                && _.find(store.state.sketch.textBlocks, function (b) { return b._id === posItem.itemId; });
            if (!block) {
                return h('div#editorOverlay', {
                    style: {
                        display: "none"
                    }
                });
            }
            return h('div#editorOverlay', {
                style: {
                    // left: posItem.clientX + "px",
                    // top: posItem.clientY + "px",
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
        var sketchDom$ = store.events.merge(store.events.sketch.loaded, store.events.sketch.attrChanged, store.events.designer.userMessageChanged)
            .map(function (m) { return _this.render(store.state); });
        ReactiveDom.renderStream(sketchDom$, container);
    }
    SketchEditor.prototype.render = function (state) {
        var _this = this;
        var sketch = state.sketch;
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
                        return ColorPicker.setup(vnode.elm, SketchHelpers.colorsInUse(_this.store.state.sketch), function (color) {
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
                    {
                        content: "Duplicate sketch",
                        options: {
                            attrs: {
                                title: "Copy contents into new sketch"
                            },
                            on: {
                                click: function () { return _this.store.actions.sketch.clone.dispatch(); }
                            }
                        }
                    },
                ]
            }),
            h("div#rightSide", {}, [
                h("div#user-message", {}, [state.userMessage || ""]),
                h("div#show-help.glyphicon.glyphicon-question-sign", {
                    on: {
                        click: function () {
                            _this.store.actions.designer.toggleHelp.dispatch();
                        }
                    }
                }),
            ])
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
        return h("div.text-block-editor", {
            key: textBlock._id
        }, [
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
                            return ColorPicker.setup(vnode.elm, SketchHelpers.colorsInUse(_this.store.state.sketch), function (color) { return update({ textColor: color && color.toHexString() }); });
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
                            return ColorPicker.setup(vnode.elm, SketchHelpers.colorsInUse(_this.store.state.sketch), function (color) { return update({ backgroundColor: color && color.toHexString() }); });
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
                        return new FontPicker(vnode.elm, _this.store, textBlock);
                    }
                }
            }, []),
        ]);
    };
    return TextBlockEditor;
}(Component));
var DualBoundsPathWarp = (function (_super) {
    __extends(DualBoundsPathWarp, _super);
    function DualBoundsPathWarp(source, bounds, customStyle) {
        var _this = this;
        _super.call(this);
        // -- build children --
        this._source = source;
        this._source.remove();
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
        set: function (value) {
            if (value) {
                this._source && this._source.remove();
                this._source = value;
                this.updateWarped();
            }
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
    DualBoundsPathWarp.prototype.outlineContains = function (point) {
        return this._outline.contains(point);
    };
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
        this._marker = paper.Shape.Circle(position, PathHandle.SEGMENT_MARKER_RADIUS);
        this._marker.strokeColor = "blue";
        this._marker.fillColor = "white";
        this._marker.selectedColor = new paper.Color(0, 0);
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
        this._marker.dashArray = null;
        this._marker.radius = PathHandle.SEGMENT_MARKER_RADIUS;
    };
    PathHandle.prototype.styleAsCurve = function () {
        this._marker.opacity = 0.8;
        this._marker.dashArray = [2, 2];
        this._marker.radius = PathHandle.CURVE_MARKER_RADIUS;
    };
    PathHandle.SEGMENT_MARKER_RADIUS = 10;
    PathHandle.CURVE_MARKER_RADIUS = 6;
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
    TextWarp.DEFAULT_FONT_SIZE = 128;
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
PaperHelpers.shouldLogInfo = false;
var app = new App();
// events.subscribe(m => console.log("event", m.type, m.data));
// actions.subscribe(m => console.log("action", m.type, m.data));
app.start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Eb21IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0ZvbnRIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0hlbHBlcnMudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2NvbGxlY3Rpb25zLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2V2ZW50cy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3BhcGVyL1BhcGVyTm90aWZ5LnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3BhcGVyL3BhcGVyLWV4dC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9wb3N0YWwvVG9waWMudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcG9zdGFsL3Bvc3RhbC1vYnNlcnZlLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3JlYWN0L1JlYWN0SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay92ZG9tL0NvbXBvbmVudC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay92ZG9tL1ZEb21IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L2FwcC9BcHAudHMiLCIuLi8uLi9jbGllbnQvYXBwL0FwcFJvdXRlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvRG9jdW1lbnRLZXlIYW5kbGVyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9FZGl0b3JNb2R1bGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL1N0b3JlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9Xb3Jrc3BhY2VDb250cm9sbGVyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9jaGFubmVscy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvY29uc3RhbnRzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9tb2RlbC1oZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9tb2RlbHMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3NlcnZpY2VzL0ZvbnRGYW1pbGllcy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivc2VydmljZXMvUGFyc2VkRm9udHMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3NlcnZpY2VzL1MzQWNjZXNzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9Db2xvclBpY2tlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivdmlld3MvRm9udFBpY2tlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivdmlld3MvSGVscERpYWxvZy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivdmlld3MvU2VsZWN0ZWRJdGVtRWRpdG9yLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9Ta2V0Y2hFZGl0b3IudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL1RleHRCbG9ja0VkaXRvci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL0R1YWxCb3VuZHNQYXRoV2FycC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1BhdGhIYW5kbGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9QYXRoU2VjdGlvbi50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1BhdGhUcmFuc2Zvcm0udHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9TdHJldGNoUGF0aC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1RleHRSdWxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1RleHRXYXJwLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvVmlld1pvb20udHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9pbnRlcmZhY2VzLnRzIiwiLi4vLi4vY2xpZW50L3pfbWFpbi96X21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxJQUFVLFVBQVUsQ0FvTW5CO0FBcE1ELFdBQVUsVUFBVSxFQUFDLENBQUM7SUFFbEIsc0RBQXNEO0lBQ3RELHNCQUE2QixPQUFlLEVBQUUsUUFBZ0I7UUFDMUQsSUFBSSxJQUFJLEdBQVEsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ3BCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFUZSx1QkFBWSxlQVMzQixDQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsdUJBQThCLE9BQU87UUFDakMsSUFBSSxhQUFhLEdBQUcsVUFBVSxDQUFDO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxD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SSxHQUFHLElBQUksQ0FBQztZQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDTCxlQUFDO0FBQUQsQ0FBQyxBQW5KRCxJQW1KQztBRW5KRCxZQUFZLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztBQUVuQyxJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRXRCLCtEQUErRDtBQUMvRCxpRUFBaUU7QUFFakUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbm5hbWVzcGFjZSBEb21IZWxwZXJzIHtcclxuXHJcbiAgICAvLyAgaHR0cHM6Ly9zdXBwb3J0Lm1vemlsbGEub3JnL2VuLVVTL3F1ZXN0aW9ucy85Njg5OTJcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkb3dubG9hZEZpbGUoZGF0YVVybDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGxpbmsgPSA8YW55PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIGxpbmsuaWQgPSBuZXdpZCgpO1xyXG4gICAgICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlbmFtZTtcclxuICAgICAgICBsaW5rLmhyZWYgPSBkYXRhVXJsO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICAgICAgbGluay50YXJnZXQgPSBcIl9zZWxmXCI7XHJcbiAgICAgICAgbGluay5jbGljaygpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgYmxvYiBmcm9tIGEgZGF0YSBVUkwgKGVpdGhlciBiYXNlNjQgZW5jb2RlZCBvciBub3QpLlxyXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL2ViaWRlbC9maWxlci5qcy9ibG9iL21hc3Rlci9zcmMvZmlsZXIuanMjTDEzN1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhVVJMIFRoZSBkYXRhIFVSTCB0byBjb252ZXJ0LlxyXG4gICAgICogQHJldHVybiB7QmxvYn0gQSBibG9iIHJlcHJlc2VudGluZyB0aGUgYXJyYXkgYnVmZmVyIGRhdGEuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkYXRhVVJMVG9CbG9iKGRhdGFVUkwpOiBCbG9iIHtcclxuICAgICAgICB2YXIgQkFTRTY0X01BUktFUiA9ICc7YmFzZTY0LCc7XHJcbiAgICAgICAgaWYgKGRhdGFVUkwuaW5kZXhPZihCQVNFNjRfTUFSS0VSKSA9PSAtMSkge1xyXG4gICAgICAgICAgICB2YXIgcGFydHMgPSBkYXRhVVJMLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50VHlwZSA9IHBhcnRzWzBdLnNwbGl0KCc6JylbMV07XHJcbiAgICAgICAgICAgIHZhciByYXcgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBCbG9iKFtyYXddLCB7IHR5cGU6IGNvbnRlbnRUeXBlIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBhcnRzID0gZGF0YVVSTC5zcGxpdChCQVNFNjRfTUFSS0VSKTtcclxuICAgICAgICB2YXIgY29udGVudFR5cGUgPSBwYXJ0c1swXS5zcGxpdCgnOicpWzFdO1xyXG4gICAgICAgIHZhciByYXcgPSB3aW5kb3cuYXRvYihwYXJ0c1sxXSk7XHJcbiAgICAgICAgdmFyIHJhd0xlbmd0aCA9IHJhdy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHZhciB1SW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkocmF3TGVuZ3RoKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdMZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB1SW50OEFycmF5W2ldID0gcmF3LmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEJsb2IoW3VJbnQ4QXJyYXldLCB7IHR5cGU6IGNvbnRlbnRUeXBlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbml0RXJyb3JIYW5kbGVyKGxvZ2dlcjogKGVycm9yRGF0YTogT2JqZWN0KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5vbmVycm9yID0gZnVuY3Rpb24obXNnLCBmaWxlLCBsaW5lLCBjb2wsIGVycm9yOiBFcnJvciB8IHN0cmluZykge1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHN0YWNrZnJhbWVzID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBtc2csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogbGluZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbDogY29sLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6IHN0YWNrZnJhbWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gbG9nIGVycm9yXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyYmFjayA9IGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBsb2cgZXJyb3JcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKDxzdHJpbmc+ZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGFzRXJyb3IgPSB0eXBlb2YgZXJyb3IgPT09IFwic3RyaW5nXCJcclxuICAgICAgICAgICAgICAgICAgICA/IG5ldyBFcnJvcihlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICA6IGVycm9yO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gU3RhY2tUcmFjZS5mcm9tRXJyb3IoYXNFcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihjYWxsYmFjaylcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyYmFjayk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImZhaWxlZCB0byBsb2cgZXJyb3JcIiwgZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBLZXlDb2RlcyA9IHtcclxuICAgICAgICBCYWNrU3BhY2U6IDgsXHJcbiAgICAgICAgVGFiOiA5LFxyXG4gICAgICAgIEVudGVyOiAxMyxcclxuICAgICAgICBTaGlmdDogMTYsXHJcbiAgICAgICAgQ3RybDogMTcsXHJcbiAgICAgICAgQWx0OiAxOCxcclxuICAgICAgICBQYXVzZUJyZWFrOiAxOSxcclxuICAgICAgICBDYXBzTG9jazogMjAsXHJcbiAgICAgICAgRXNjOiAyNyxcclxuICAgICAgICBQYWdlVXA6IDMzLFxyXG4gICAgICAgIFBhZ2VEb3duOiAzNCxcclxuICAgICAgICBFbmQ6IDM1LFxyXG4gICAgICAgIEhvbWU6IDM2LFxyXG4gICAgICAgIEFycm93TGVmdDogMzcsXHJcbiAgICAgICAgQXJyb3dVcDogMzgsXHJcbiAgICAgICAgQXJyb3dSaWdodDogMzksXHJcbiAgICAgICAgQXJyb3dEb3duOiA0MCxcclxuICAgICAgICBJbnNlcnQ6IDQ1LFxyXG4gICAgICAgIERlbGV0ZTogNDYsXHJcbiAgICAgICAgRGlnaXQwOiA0OCxcclxuICAgICAgICBEaWdpdDE6IDQ5LFxyXG4gICAgICAgIERpZ2l0MjogNTAsXHJcbiAgICAgICAgRGlnaXQzOiA1MSxcclxuICAgICAgICBEaWdpdDQ6IDUyLFxyXG4gICAgICAgIERpZ2l0NTogNTMsXHJcbiAgICAgICAgRGlnaXQ2OiA1NCxcclxuICAgICAgICBEaWdpdDc6IDU1LFxyXG4gICAgICAgIERpZ2l0ODogNTYsXHJcbiAgICAgICAgRGlnaXQ5OiA1NyxcclxuICAgICAgICBBOiA2NSxcclxuICAgICAgICBCOiA2NixcclxuICAgICAgICBDOiA2NyxcclxuICAgICAgICBEOiA2OCxcclxuICAgICAgICBFOiA2OSxcclxuICAgICAgICBGOiA3MCxcclxuICAgICAgICBHOiA3MSxcclxuICAgICAgICBIOiA3MixcclxuICAgICAgICBJOiA3MyxcclxuICAgICAgICBKOiA3NCxcclxuICAgICAgICBLOiA3NSxcclxuICAgICAgICBMOiA3NixcclxuICAgICAgICBNOiA3NyxcclxuICAgICAgICBOOiA3OCxcclxuICAgICAgICBPOiA3OSxcclxuICAgICAgICBQOiA4MCxcclxuICAgICAgICBROiA4MSxcclxuICAgICAgICBSOiA4MixcclxuICAgICAgICBTOiA4MyxcclxuICAgICAgICBUOiA4NCxcclxuICAgICAgICBVOiA4NSxcclxuICAgICAgICBWOiA4NixcclxuICAgICAgICBXOiA4NyxcclxuICAgICAgICBYOiA4OCxcclxuICAgICAgICBZOiA4OSxcclxuICAgICAgICBaOiA5MCxcclxuICAgICAgICBXaW5kb3dMZWZ0OiA5MSxcclxuICAgICAgICBXaW5kb3dSaWdodDogOTIsXHJcbiAgICAgICAgU2VsZWN0S2V5OiA5MyxcclxuICAgICAgICBOdW1wYWQwOiA5NixcclxuICAgICAgICBOdW1wYWQxOiA5NyxcclxuICAgICAgICBOdW1wYWQyOiA5OCxcclxuICAgICAgICBOdW1wYWQzOiA5OSxcclxuICAgICAgICBOdW1wYWQ0OiAxMDAsXHJcbiAgICAgICAgTnVtcGFkNTogMTAxLFxyXG4gICAgICAgIE51bXBhZDY6IDEwMixcclxuICAgICAgICBOdW1wYWQ3OiAxMDMsXHJcbiAgICAgICAgTnVtcGFkODogMTA0LFxyXG4gICAgICAgIE51bXBhZDk6IDEwNSxcclxuICAgICAgICBNdWx0aXBseTogMTA2LFxyXG4gICAgICAgIEFkZDogMTA3LFxyXG4gICAgICAgIFN1YnRyYWN0OiAxMDksXHJcbiAgICAgICAgRGVjaW1hbFBvaW50OiAxMTAsXHJcbiAgICAgICAgRGl2aWRlOiAxMTEsXHJcbiAgICAgICAgRjE6IDExMixcclxuICAgICAgICBGMjogMTEzLFxyXG4gICAgICAgIEYzOiAxMTQsXHJcbiAgICAgICAgRjQ6IDExNSxcclxuICAgICAgICBGNTogMTE2LFxyXG4gICAgICAgIEY2OiAxMTcsXHJcbiAgICAgICAgRjc6IDExOCxcclxuICAgICAgICBGODogMTE5LFxyXG4gICAgICAgIEY5OiAxMjAsXHJcbiAgICAgICAgRjEwOiAxMjEsXHJcbiAgICAgICAgRjExOiAxMjIsXHJcbiAgICAgICAgRjEyOiAxMjMsXHJcbiAgICAgICAgTnVtTG9jazogMTQ0LFxyXG4gICAgICAgIFNjcm9sbExvY2s6IDE0NSxcclxuICAgICAgICBTZW1pQ29sb246IDE4NixcclxuICAgICAgICBFcXVhbDogMTg3LFxyXG4gICAgICAgIENvbW1hOiAxODgsXHJcbiAgICAgICAgRGFzaDogMTg5LFxyXG4gICAgICAgIFBlcmlvZDogMTkwLFxyXG4gICAgICAgIEZvcndhcmRTbGFzaDogMTkxLFxyXG4gICAgICAgIEdyYXZlQWNjZW50OiAxOTIsXHJcbiAgICAgICAgQnJhY2tldE9wZW46IDIxOSxcclxuICAgICAgICBCYWNrU2xhc2g6IDIyMCxcclxuICAgICAgICBCcmFja2V0Q2xvc2U6IDIyMSxcclxuICAgICAgICBTaW5nbGVRdW90ZTogMjIyXHJcbiAgICB9O1xyXG5cclxufSIsIlxyXG5uYW1lc3BhY2UgRm9udEhlbHBlcnMge1xyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEVsZW1lbnRGb250U3R5bGUge1xyXG4gICAgICAgIGZvbnRGYW1pbHk/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFdlaWdodD86IHN0cmluZztcclxuICAgICAgICBmb250U3R5bGU/OiBzdHJpbmc7IFxyXG4gICAgICAgIGZvbnRTaXplPzogc3RyaW5nOyBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldENzc1N0eWxlKGZhbWlseTogc3RyaW5nLCB2YXJpYW50OiBzdHJpbmcsIHNpemU/OiBzdHJpbmcpe1xyXG4gICAgICAgIGxldCBzdHlsZSA9IDxFbGVtZW50Rm9udFN0eWxlPnsgZm9udEZhbWlseTogZmFtaWx5IH07XHJcbiAgICAgICAgaWYodmFyaWFudCAmJiB2YXJpYW50LmluZGV4T2YoXCJpdGFsaWNcIikgPj0gMCl7XHJcbiAgICAgICAgICAgIHN0eWxlLmZvbnRTdHlsZSA9IFwiaXRhbGljXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBudW1lcmljID0gdmFyaWFudCAmJiB2YXJpYW50LnJlcGxhY2UoL1teXFxkXS9nLCBcIlwiKTtcclxuICAgICAgICBpZihudW1lcmljICYmIG51bWVyaWMubGVuZ3RoKXtcclxuICAgICAgICAgICAgc3R5bGUuZm9udFdlaWdodCA9IG51bWVyaWMudG9TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc2l6ZSl7XHJcbiAgICAgICAgICAgIHN0eWxlLmZvbnRTaXplID0gc2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0eWxlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0U3R5bGVTdHJpbmcoZmFtaWx5OiBzdHJpbmcsIHZhcmlhbnQ6IHN0cmluZywgc2l6ZT86IHN0cmluZykge1xyXG4gICAgICAgIGxldCBzdHlsZU9iaiA9IGdldENzc1N0eWxlKGZhbWlseSwgdmFyaWFudCwgc2l6ZSk7XHJcbiAgICAgICAgbGV0IHBhcnRzID0gW107XHJcbiAgICAgICAgaWYoc3R5bGVPYmouZm9udEZhbWlseSl7XHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goYGZvbnQtZmFtaWx5Oicke3N0eWxlT2JqLmZvbnRGYW1pbHl9J2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzdHlsZU9iai5mb250V2VpZ2h0KXtcclxuICAgICAgICAgICAgcGFydHMucHVzaChgZm9udC13ZWlnaHQ6JHtzdHlsZU9iai5mb250V2VpZ2h0fWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzdHlsZU9iai5mb250U3R5bGUpe1xyXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LXN0eWxlOiR7c3R5bGVPYmouZm9udFN0eWxlfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzdHlsZU9iai5mb250U2l6ZSl7XHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goYGZvbnQtc2l6ZToke3N0eWxlT2JqLmZvbnRTaXplfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFydHMuam9pbihcIjsgXCIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0RGVzY3JpcHRpb24oZmFtaWx5OiBGb250RmFtaWx5LCB2YXJpYW50Pzogc3RyaW5nKTogRm9udERlc2NyaXB0aW9uIHtcclxuICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XHJcbiAgICAgICAgdXJsID0gZmFtaWx5LmZpbGVzW3ZhcmlhbnQgfHwgXCJyZWd1bGFyXCJdO1xyXG4gICAgICAgIGlmKCF1cmwpe1xyXG4gICAgICAgICAgICB1cmwgPSBmYW1pbHkuZmlsZXNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZhbWlseTogZmFtaWx5LmZhbWlseSxcclxuICAgICAgICAgICAgY2F0ZWdvcnk6IGZhbWlseS5jYXRlZ29yeSxcclxuICAgICAgICAgICAgdmFyaWFudDogdmFyaWFudCxcclxuICAgICAgICAgICAgdXJsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJcclxuZnVuY3Rpb24gbG9ndGFwPFQ+KG1lc3NhZ2U6IHN0cmluZywgc3RyZWFtOiBSeC5PYnNlcnZhYmxlPFQ+KTogUnguT2JzZXJ2YWJsZTxUPntcclxuICAgIHJldHVybiBzdHJlYW0udGFwKHQgPT4gY29uc29sZS5sb2cobWVzc2FnZSwgdCkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBuZXdpZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSgpLmdldFRpbWUoKSArIE1hdGgucmFuZG9tKCkpXHJcbiAgICAgICAgLnRvU3RyaW5nKDM2KS5yZXBsYWNlKCcuJywgJycpO1xyXG59XHJcbiIsIlxyXG5uYW1lc3BhY2UgVHlwZWRDaGFubmVsIHtcclxuXHJcbiAgICAvLyAtLS0gQ29yZSB0eXBlcyAtLS1cclxuXHJcbiAgICB0eXBlIFNlcmlhbGl6YWJsZSA9IE9iamVjdCB8IEFycmF5PGFueT4gfCBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuIHwgRGF0ZSB8IHZvaWQ7XHJcblxyXG4gICAgdHlwZSBWYWx1ZSA9IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBEYXRlO1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZTxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4ge1xyXG4gICAgICAgIHR5cGU6IHN0cmluZztcclxuICAgICAgICBkYXRhPzogVERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZSBJU3ViamVjdDxUPiA9IFJ4Lk9ic2VydmVyPFQ+ICYgUnguT2JzZXJ2YWJsZTxUPjtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbFRvcGljPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIGNoYW5uZWw6IElTdWJqZWN0PE1lc3NhZ2U8VERhdGE+PjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY2hhbm5lbDogSVN1YmplY3Q8TWVzc2FnZTxURGF0YT4+LCB0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YnNjcmliZShvYnNlcnZlcjogKG1lc3NhZ2U6IE1lc3NhZ2U8VERhdGE+KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgpLnN1YnNjcmliZShvYnNlcnZlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWJzY3JpYmVEYXRhKG9ic2VydmVyOiAoZGF0YTogVERhdGEpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCkuc3Vic2NyaWJlKG0gPT4gb2JzZXJ2ZXIobS5kYXRhKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpc3BhdGNoKGRhdGE/OiBURGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwub25OZXh0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5maWx0ZXIobSA9PiBtLnR5cGUgPT09IHRoaXMudHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcndhcmQoY2hhbm5lbDogQ2hhbm5lbFRvcGljPFREYXRhPikge1xyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZShtID0+IGNoYW5uZWwuZGlzcGF0Y2gobS5kYXRhKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDaGFubmVsIHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBzdWJqZWN0OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihzdWJqZWN0PzogSVN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGU+PiwgdHlwZT86IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnN1YmplY3QgPSBzdWJqZWN0IHx8IG5ldyBSeC5TdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4oKTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YnNjcmliZShvbk5leHQ/OiAodmFsdWU6IE1lc3NhZ2U8U2VyaWFsaXphYmxlPikgPT4gdm9pZCk6IFJ4LklEaXNwb3NhYmxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5zdWJzY3JpYmUob25OZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvcGljPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPih0eXBlOiBzdHJpbmcpIDogQ2hhbm5lbFRvcGljPFREYXRhPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ2hhbm5lbFRvcGljPFREYXRhPih0aGlzLnN1YmplY3QgYXMgSVN1YmplY3Q8TWVzc2FnZTxURGF0YT4+LFxyXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID8gdGhpcy50eXBlICsgJy4nICsgdHlwZSA6IHR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBtZXJnZVR5cGVkPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiguLi50b3BpY3M6IENoYW5uZWxUb3BpYzxURGF0YT5bXSkgXHJcbiAgICAgICAgICAgIDogUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhPj4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRvcGljcy5tYXAodCA9PiB0LnR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmZpbHRlcihtID0+IHR5cGVzLmluZGV4T2YobS50eXBlKSA+PSAwICkgYXMgUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhPj47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lcmdlKC4uLnRvcGljczogQ2hhbm5lbFRvcGljPFNlcmlhbGl6YWJsZT5bXSkgXHJcbiAgICAgICAgICAgIDogUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+IHtcclxuICAgICAgICAgICAgY29uc3QgdHlwZXMgPSB0b3BpY3MubWFwKHQgPT4gdC50eXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5maWx0ZXIobSA9PiB0eXBlcy5pbmRleE9mKG0udHlwZSkgPj0gMCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIiwiXHJcbnR5cGUgRGljdGlvbmFyeTxUPiA9IF8uRGljdGlvbmFyeTxUPjtcclxuIiwiXHJcbmNsYXNzIE9ic2VydmFibGVFdmVudDxUPiB7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3N1YnNjcmliZXJzOiAoKGV2ZW50QXJnOiBUKSA9PiB2b2lkKVtdID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJzY3JpYmUgZm9yIG5vdGlmaWNhdGlvbi4gUmV0dXJucyB1bnN1YnNjcmliZSBmdW5jdGlvbi5cclxuICAgICAqLyAgICBcclxuICAgIHN1YnNjcmliZShoYW5kbGVyOiAoZXZlbnRBcmc6IFQpID0+IHZvaWQpOiAoKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoaGFuZGxlcikgPCAwKXtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMucHVzaChoYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHRoaXMudW5zdWJzY3JpYmUoaGFuZGxlcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHVuc3Vic2NyaWJlKGNhbGxiYWNrOiAoZXZlbnRBcmc6IFQpID0+IHZvaWQpIHtcclxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGNhbGxiYWNrLCAwKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIGxldCB1bnN1YjogYW55O1xyXG4gICAgICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm48VD4oXHJcbiAgICAgICAgICAgIChoYW5kbGVyVG9BZGQpID0+IHRoaXMuc3Vic2NyaWJlKDwoZXZlbnRBcmc6IFQpID0+IHZvaWQ+aGFuZGxlclRvQWRkKSxcclxuICAgICAgICAgICAgKGhhbmRsZXJUb1JlbW92ZSkgPT4gdGhpcy51bnN1YnNjcmliZSg8KGV2ZW50QXJnOiBUKSA9PiB2b2lkPmhhbmRsZXJUb1JlbW92ZSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmb3Igb25lIG5vdGlmaWNhdGlvbi5cclxuICAgICAqL1xyXG4gICAgc3Vic2NyaWJlT25lKGNhbGxiYWNrOiAoZXZlbnRBcmc6IFQpID0+IHZvaWQpe1xyXG4gICAgICAgIGxldCB1bnN1YiA9IHRoaXMuc3Vic2NyaWJlKHQgPT4ge1xyXG4gICAgICAgICAgICB1bnN1YigpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayh0KTsgICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbm90aWZ5KGV2ZW50QXJnOiBUKXtcclxuICAgICAgICBmb3IobGV0IHN1YnNjcmliZXIgb2YgdGhpcy5fc3Vic2NyaWJlcnMpe1xyXG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNhbGwodGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBzdWJzY3JpYmVycy5cclxuICAgICAqL1xyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcclxuICAgIH1cclxufSIsIlxyXG5uYW1lc3BhY2UgQm9vdFNjcmlwdCB7XHJcblxyXG4gICAgaW50ZXJmYWNlIE1lbnVJdGVtIHtcclxuICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgb3B0aW9ucz86IE9iamVjdFxyXG4gICAgICAgIC8vb25DbGljaz86ICgpID0+IHZvaWRcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZHJvcGRvd24oXHJcbiAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgICBpZDogc3RyaW5nLFxyXG4gICAgICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgICAgIGl0ZW1zOiBNZW51SXRlbVtdXHJcbiAgICAgICAgfSk6IFZOb2RlIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXYuZHJvcGRvd25cIiwgW1xyXG4gICAgICAgICAgICBoKFwiYnV0dG9uLmJ0bi5idG4tZGVmYXVsdC5kcm9wZG93bi10b2dnbGVcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImF0dHJzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFyZ3MuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS10b2dnbGVcIjogXCJkcm9wZG93blwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgYXJncy5jb250ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuLmNhcmV0XCIpXHJcbiAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgaChcInVsLmRyb3Bkb3duLW1lbnVcIixcclxuICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgYXJncy5pdGVtcy5tYXAoaXRlbSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJsaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoJ2EnLCBpdGVtLm9wdGlvbnMgfHwge30sIFtpdGVtLmNvbnRlbnRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5pbnRlcmZhY2UgQ29uc29sZSB7XHJcbiAgICBsb2cobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZDtcclxuICAgIGxvZyguLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkO1xyXG59XHJcblxyXG5uYW1lc3BhY2UgUGFwZXJIZWxwZXJzIHtcclxuXHJcbiAgICBleHBvcnQgdmFyIHNob3VsZExvZ0luZm86IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3QgbG9nID0gZnVuY3Rpb24oLi4ucGFyYW1zOiBhbnlbXSkge1xyXG4gICAgICAgIGlmIChzaG91bGRMb2dJbmZvKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLnBhcmFtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBpbXBvcnRPcGVuVHlwZVBhdGggPSBmdW5jdGlvbihvcGVuUGF0aDogb3BlbnR5cGUuUGF0aCk6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgob3BlblBhdGgudG9QYXRoRGF0YSgpKTtcclxuXHJcbiAgICAgICAgLy8gbGV0IHN2ZyA9IG9wZW5QYXRoLnRvU1ZHKDQpO1xyXG4gICAgICAgIC8vIHJldHVybiA8cGFwZXIuUGF0aD5wYXBlci5wcm9qZWN0LmltcG9ydFNWRyhzdmcpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCB0cmFjZVBhdGhJdGVtID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aEl0ZW0sIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLlBhdGhJdGVtIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNlQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgdHJhY2VDb21wb3VuZFBhdGggPSBmdW5jdGlvbihwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgsIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgaWYgKCFwYXRoLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBhdGhzID0gcGF0aC5jaGlsZHJlbi5tYXAocCA9PlxyXG4gICAgICAgICAgICB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wLCBwb2ludHNQZXJQYXRoKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgoe1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogcGF0aHMsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCB0cmFjZVBhdGhBc1BvaW50cyA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGgsIG51bVBvaW50czogbnVtYmVyKTogcGFwZXIuUG9pbnRbXSB7XHJcbiAgICAgICAgbGV0IHBhdGhMZW5ndGggPSBwYXRoLmxlbmd0aDtcclxuICAgICAgICBsZXQgb2Zmc2V0SW5jciA9IHBhdGhMZW5ndGggLyBudW1Qb2ludHM7XHJcbiAgICAgICAgbGV0IHBvaW50cyA9IFtdO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGkrKyA8IG51bVBvaW50cykge1xyXG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBwYXRoLmdldFBvaW50QXQoTWF0aC5taW4ob2Zmc2V0LCBwYXRoTGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IG9mZnNldEluY3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcG9pbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCB0cmFjZVBhdGggPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoLCBudW1Qb2ludHM6IG51bWJlcik6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgIGxldCBwb2ludHMgPSBQYXBlckhlbHBlcnMudHJhY2VQYXRoQXNQb2ludHMocGF0aCwgbnVtUG9pbnRzKTtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlBhdGgoe1xyXG4gICAgICAgICAgICBzZWdtZW50czogcG9pbnRzLFxyXG4gICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgZHVhbEJvdW5kc1BhdGhQcm9qZWN0aW9uID0gZnVuY3Rpb24odG9wUGF0aDogcGFwZXIuQ3VydmVsaWtlLCBib3R0b21QYXRoOiBwYXBlci5DdXJ2ZWxpa2UpXHJcbiAgICAgICAgOiAodW5pdFBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIGNvbnN0IHRvcFBhdGhMZW5ndGggPSB0b3BQYXRoLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBib3R0b21QYXRoTGVuZ3RoID0gYm90dG9tUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgICAgIGxldCB0b3BQb2ludCA9IHRvcFBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIHRvcFBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgICBsZXQgYm90dG9tUG9pbnQgPSBib3R0b21QYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiBib3R0b21QYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICAgaWYgKHRvcFBvaW50ID09IG51bGwgfHwgYm90dG9tUG9pbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJjb3VsZCBub3QgZ2V0IHByb2plY3RlZCBwb2ludCBmb3IgdW5pdCBwb2ludCBcIiArIHVuaXRQb2ludC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0b3BQb2ludC5hZGQoYm90dG9tUG9pbnQuc3VidHJhY3QodG9wUG9pbnQpLm11bHRpcGx5KHVuaXRQb2ludC55KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFya2VyR3JvdXA6IHBhcGVyLkdyb3VwO1xyXG5cclxuICAgIGV4cG9ydCBjb25zdCByZXNldE1hcmtlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwKSB7XHJcbiAgICAgICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya2VyR3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICBtYXJrZXJHcm91cC5vcGFjaXR5ID0gMC4yO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgbWFya2VyTGluZSA9IGZ1bmN0aW9uKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIGxldCBsaW5lID0gcGFwZXIuUGF0aC5MaW5lKGEsIGIpO1xyXG4gICAgICAgIGxpbmUuc3Ryb2tlQ29sb3IgPSAnZ3JlZW4nO1xyXG4gICAgICAgIC8vbGluZS5kYXNoQXJyYXkgPSBbNSwgNV07XHJcbiAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLmFkZENoaWxkKGxpbmUpO1xyXG4gICAgICAgIHJldHVybiBsaW5lO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBtYXJrZXIgPSBmdW5jdGlvbihwb2ludDogcGFwZXIuUG9pbnQsIGxhYmVsOiBzdHJpbmcpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICAvL2xldCBtYXJrZXIgPSBwYXBlci5TaGFwZS5DaXJjbGUocG9pbnQsIDEwKTtcclxuICAgICAgICBsZXQgbWFya2VyID0gbmV3IHBhcGVyLlBvaW50VGV4dChwb2ludCk7XHJcbiAgICAgICAgbWFya2VyLmZvbnRTaXplID0gMzY7XHJcbiAgICAgICAgbWFya2VyLmNvbnRlbnQgPSBsYWJlbDtcclxuICAgICAgICBtYXJrZXIuc3Ryb2tlQ29sb3IgPSBcInJlZFwiO1xyXG4gICAgICAgIG1hcmtlci5icmluZ1RvRnJvbnQoKTtcclxuICAgICAgICAvL1BhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChtYXJrZXIpO1xyXG4gICAgICAgIHJldHVybiBtYXJrZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHNpbXBsaWZ5ID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aEl0ZW0sIHRvbGVyYW5jZT86IG51bWJlcikge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBQYXBlckhlbHBlcnMuc2ltcGxpZnkoPHBhcGVyLlBhdGhJdGVtPnAsIHRvbGVyYW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAoPHBhcGVyLlBhdGg+cGF0aCkuc2ltcGxpZnkodG9sZXJhbmNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIHNlbGYgb3IgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBmaW5kU2VsZk9yQW5jZXN0b3IgPSBmdW5jdGlvbihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZShpdGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kQW5jZXN0b3IoaXRlbSwgcHJlZGljYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBmaW5kQW5jZXN0b3IgPSBmdW5jdGlvbihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCFpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJpb3I6IHBhcGVyLkl0ZW07XHJcbiAgICAgICAgbGV0IGNoZWNraW5nID0gaXRlbS5wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKGNoZWNraW5nICYmIGNoZWNraW5nICE9PSBwcmlvcikge1xyXG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKGNoZWNraW5nKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNraW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByaW9yID0gY2hlY2tpbmc7XHJcbiAgICAgICAgICAgIGNoZWNraW5nID0gY2hlY2tpbmcucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBjb3JuZXJzIG9mIHRoZSByZWN0LCBjbG9ja3dpc2Ugc3RhcnRpbmcgZnJvbSB0b3BMZWZ0XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBjb3JuZXJzID0gZnVuY3Rpb24ocmVjdDogcGFwZXIuUmVjdGFuZ2xlKTogcGFwZXIuUG9pbnRbXSB7XHJcbiAgICAgICAgcmV0dXJuIFtyZWN0LnRvcExlZnQsIHJlY3QudG9wUmlnaHQsIHJlY3QuYm90dG9tUmlnaHQsIHJlY3QuYm90dG9tTGVmdF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0aGUgbWlkcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBtaWRwb2ludCA9IGZ1bmN0aW9uKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIHJldHVybiBiLnN1YnRyYWN0KGEpLmRpdmlkZSgyKS5hZGQoYSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IGNsb25lU2VnbWVudCA9IGZ1bmN0aW9uKHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlNlZ21lbnQoc2VnbWVudC5wb2ludCwgc2VnbWVudC5oYW5kbGVJbiwgc2VnbWVudC5oYW5kbGVPdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFrZSBhbiBpdGVtIGRyYWdnYWJsZSwgYWRkaW5nIHJlbGF0ZWQgZXZlbnRzLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgYWRkU21hcnREcmFnID0gZnVuY3Rpb24oaXRlbTogcGFwZXIuSXRlbSkge1xyXG4gICAgICAgIGl0ZW0uaXNTbWFydERyYWdnYWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgIGl0ZW0ub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlRHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICBsb2coXCJzbWFydERyYWcub25Nb3VzZURyYWdcIiwgaXRlbSwgZXYpO1xyXG4gICAgICAgICAgICBpZiAoZXYuc21hcnREcmFnSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiV2lsbCBub3QgYXNzaWduIHNtYXJ0RHJhZ0l0ZW06IHZhbHVlIHdhcyBhbHJlYWR5IFwiICsgZXYuc21hcnREcmFnSXRlbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBldi5zbWFydERyYWdJdGVtID0gaXRlbTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFpdGVtLmlzU21hcnREcmFnZ2luZykge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5pc1NtYXJ0RHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgbG9nKFwiZW1pdHRpbmcgc21hcnREcmFnLnNtYXJ0RHJhZ1N0YXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5lbWl0KEV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbi5hZGQoZXYuZGVsdGEpO1xyXG5cclxuICAgICAgICAgICAgbG9nKFwiZW1pdHRpbmcgc21hcnREcmFnLnNtYXJ0RHJhZ01vdmVcIik7XHJcbiAgICAgICAgICAgIGl0ZW0uZW1pdChFdmVudFR5cGUuc21hcnREcmFnTW92ZSwgZXYpO1xyXG5cclxuICAgICAgICAgICAgZXYuc3RvcCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZVVwLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGxvZyhcInNtYXJ0RHJhZy5vbk1vdXNlVXBcIiwgaXRlbSwgZXYpO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgKGV2LnNtYXJ0RHJhZ0l0ZW0pIHtcclxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUud2FybihcIldpbGwgbm90IGFzc2lnbiBzbWFydERyYWdJdGVtOiB2YWx1ZSB3YXMgYWxyZWFkeSBcIiArIGV2LnNtYXJ0RHJhZ0l0ZW0pO1xyXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAgICAgZXYuc21hcnREcmFnSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtLmlzU21hcnREcmFnZ2luZykge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5pc1NtYXJ0RHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGxvZyhcImVtaXR0aW5nIHNtYXJ0RHJhZy5zbWFydERyYWdFbmRcIik7XHJcbiAgICAgICAgICAgICAgICBpZihpdGVtLnJlc3BvbmRzKEV2ZW50VHlwZS5zbWFydERyYWdFbmQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5lbWl0KEV2ZW50VHlwZS5zbWFydERyYWdFbmQsIGV2KTtcclxuICAgICAgICAgICAgICAgICAgICBldi5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZihpdGVtLnJlc3BvbmRzKEV2ZW50VHlwZS5jbGlja1dpdGhvdXREcmFnKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nKFwiZW1pdHRpbmcgc21hcnREcmFnLmNsaWNrV2l0aG91dERyYWdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5lbWl0KEV2ZW50VHlwZS5jbGlja1dpdGhvdXREcmFnLCBldik7XHJcbiAgICAgICAgICAgICAgICAgICAgZXYuc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL2V2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIC8vZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIC8vZXYuc3RvcCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsYXN0Q2xpY2s6IG51bWJlcjsgXHJcbiAgICAgICAgaXRlbS5vbihFdmVudFR5cGUuY2xpY2tXaXRob3V0RHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZihsYXN0Q2xpY2sgJiYgKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAtIGxhc3RDbGljayA8IDcwMCl7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQoRXZlbnRUeXBlLmRvdWJsZUNsaWNrV2l0aG91dERyYWcsIGV2KTtcclxuICAgICAgICAgICAgfSAgICBcclxuICAgICAgICAgICAgbGFzdENsaWNrID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGNvbnN0IEV2ZW50VHlwZSA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZyBhY3Rpb24gaGFzIHN0YXJ0ZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc21hcnREcmFnU3RhcnQ6IFwic21hcnREcmFnU3RhcnRcIixcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZ2dlZCBpdGVtIGhhcyBtb3ZlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzbWFydERyYWdNb3ZlOiBcInNtYXJ0RHJhZ01vdmVcIixcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZyBhY3Rpb24gaGFzIGVuZGVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNtYXJ0RHJhZ0VuZDogXCJzbWFydERyYWdFbmRcIixcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIG5vcm1hbCBjbGljayBldmVudCB3aWxsIGZpcmUgZXZlbiBhdCB0aGUgZW5kIG9mIGEgZHJhZy5cclxuICAgICAgICAgKiBUaGlzIGNsaWNrIGV2ZW50IGRvZXMgbm90LiBcclxuICAgICAgICAgKi9cclxuICAgICAgICBjbGlja1dpdGhvdXREcmFnOiBcImNsaWNrV2l0aG91dERyYWdcIixcclxuXHJcbiAgICAgICAgZG91YmxlQ2xpY2tXaXRob3V0RHJhZzogXCJkb3VibGVDbGlja1dpdGhvdXREcmFnXCJcclxuICAgIH1cclxufVxyXG5cclxuZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJdGVtIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEcmFnZ2luZyBiZWhhdmlvciBhZGRlZCBieSBQYXBlckhlbHBlcnM6IGlzIHRoZSBpdGVtIGJlaW5nIGRyYWdnZWQ/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNTbWFydERyYWdnaW5nOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEcmFnZ2luZyBiZWhhdmlvciBhZGRlZCBieSBQYXBlckhlbHBlcnM6IGlzIHRoZSBpdGVtIGRyYWdnYWJsZT9cclxuICAgICAgICAgKi9cclxuICAgICAgICBpc1NtYXJ0RHJhZ2dhYmxlOiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVG9vbEV2ZW50IHtcclxuICAgICAgICBzbWFydERyYWdJdGVtOiBJdGVtO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUGFwZXJNb3VzZUV2ZW50IHtcclxuICAgICAgICBzbWFydERyYWdJdGVtOiBJdGVtO1xyXG4gICAgfVxyXG59IiwiXHJcbnR5cGUgSXRlbUNoYW5nZUhhbmRsZXIgPSAoZmxhZ3M6IFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcpID0+IHZvaWQ7XHJcbnR5cGUgQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgaW50ZXJmYWNlIEl0ZW0ge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFN1YnNjcmliZSB0byBhbGwgY2hhbmdlcyBpbiBpdGVtLiBSZXR1cm5zIHVuLXN1YnNjcmliZSBmdW5jdGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzdWJzY3JpYmUoaGFuZGxlcjogSXRlbUNoYW5nZUhhbmRsZXIpOiBDYWxsYmFjaztcclxuICAgICAgICBcclxuICAgICAgICBfY2hhbmdlZChmbGFnczogUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZyk6IHZvaWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBQYXBlck5vdGlmeSB7XHJcblxyXG4gICAgZXhwb3J0IGVudW0gQ2hhbmdlRmxhZyB7XHJcbiAgICAgICAgLy8gQW55dGhpbmcgYWZmZWN0aW5nIHRoZSBhcHBlYXJhbmNlIG9mIGFuIGl0ZW0sIGluY2x1ZGluZyBHRU9NRVRSWSxcclxuICAgICAgICAvLyBTVFJPS0UsIFNUWUxFIGFuZCBBVFRSSUJVVEUgKGV4Y2VwdCBmb3IgdGhlIGludmlzaWJsZSBvbmVzOiBsb2NrZWQsIG5hbWUpXHJcbiAgICAgICAgQVBQRUFSQU5DRSA9IDB4MSxcclxuICAgICAgICAvLyBBIGNoYW5nZSBpbiB0aGUgaXRlbSdzIGNoaWxkcmVuXHJcbiAgICAgICAgQ0hJTERSRU4gPSAweDIsXHJcbiAgICAgICAgLy8gQSBjaGFuZ2Ugb2YgdGhlIGl0ZW0ncyBwbGFjZSBpbiB0aGUgc2NlbmUgZ3JhcGggKHJlbW92ZWQsIGluc2VydGVkLFxyXG4gICAgICAgIC8vIG1vdmVkKS5cclxuICAgICAgICBJTlNFUlRJT04gPSAweDQsXHJcbiAgICAgICAgLy8gSXRlbSBnZW9tZXRyeSAocGF0aCwgYm91bmRzKVxyXG4gICAgICAgIEdFT01FVFJZID0gMHg4LFxyXG4gICAgICAgIC8vIE9ubHkgc2VnbWVudChzKSBoYXZlIGNoYW5nZWQsIGFuZCBhZmZlY3RlZCBjdXJ2ZXMgaGF2ZSBhbHJlYWR5IGJlZW5cclxuICAgICAgICAvLyBub3RpZmllZC4gVGhpcyBpcyB0byBpbXBsZW1lbnQgYW4gb3B0aW1pemF0aW9uIGluIF9jaGFuZ2VkKCkgY2FsbHMuXHJcbiAgICAgICAgU0VHTUVOVFMgPSAweDEwLFxyXG4gICAgICAgIC8vIFN0cm9rZSBnZW9tZXRyeSAoZXhjbHVkaW5nIGNvbG9yKVxyXG4gICAgICAgIFNUUk9LRSA9IDB4MjAsXHJcbiAgICAgICAgLy8gRmlsbCBzdHlsZSBvciBzdHJva2UgY29sb3IgLyBkYXNoXHJcbiAgICAgICAgU1RZTEUgPSAweDQwLFxyXG4gICAgICAgIC8vIEl0ZW0gYXR0cmlidXRlczogdmlzaWJsZSwgYmxlbmRNb2RlLCBsb2NrZWQsIG5hbWUsIG9wYWNpdHksIGNsaXBNYXNrIC4uLlxyXG4gICAgICAgIEFUVFJJQlVURSA9IDB4ODAsXHJcbiAgICAgICAgLy8gVGV4dCBjb250ZW50XHJcbiAgICAgICAgQ09OVEVOVCA9IDB4MTAwLFxyXG4gICAgICAgIC8vIFJhc3RlciBwaXhlbHNcclxuICAgICAgICBQSVhFTFMgPSAweDIwMCxcclxuICAgICAgICAvLyBDbGlwcGluZyBpbiBvbmUgb2YgdGhlIGNoaWxkIGl0ZW1zXHJcbiAgICAgICAgQ0xJUFBJTkcgPSAweDQwMCxcclxuICAgICAgICAvLyBUaGUgdmlldyBoYXMgYmVlbiB0cmFuc2Zvcm1lZFxyXG4gICAgICAgIFZJRVcgPSAweDgwMFxyXG4gICAgfVxyXG5cclxuICAgIC8vIFNob3J0Y3V0cyB0byBvZnRlbiB1c2VkIENoYW5nZUZsYWcgdmFsdWVzIGluY2x1ZGluZyBBUFBFQVJBTkNFXHJcbiAgICBleHBvcnQgZW51bSBDaGFuZ2VzIHtcclxuICAgICAgICAvLyBDSElMRFJFTiBhbHNvIGNoYW5nZXMgR0VPTUVUUlksIHNpbmNlIHJlbW92aW5nIGNoaWxkcmVuIGZyb20gZ3JvdXBzXHJcbiAgICAgICAgLy8gY2hhbmdlcyBib3VuZHMuXHJcbiAgICAgICAgQ0hJTERSRU4gPSBDaGFuZ2VGbGFnLkNISUxEUkVOIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICAvLyBDaGFuZ2luZyB0aGUgaW5zZXJ0aW9uIGNhbiBjaGFuZ2UgdGhlIGFwcGVhcmFuY2UgdGhyb3VnaCBwYXJlbnQncyBtYXRyaXguXHJcbiAgICAgICAgSU5TRVJUSU9OID0gQ2hhbmdlRmxhZy5JTlNFUlRJT04gfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgR0VPTUVUUlkgPSBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNFR01FTlRTID0gQ2hhbmdlRmxhZy5TRUdNRU5UUyB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgU1RST0tFID0gQ2hhbmdlRmxhZy5TVFJPS0UgfCBDaGFuZ2VGbGFnLlNUWUxFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNUWUxFID0gQ2hhbmdlRmxhZy5TVFlMRSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBBVFRSSUJVVEUgPSBDaGFuZ2VGbGFnLkFUVFJJQlVURSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBDT05URU5UID0gQ2hhbmdlRmxhZy5DT05URU5UIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBQSVhFTFMgPSBDaGFuZ2VGbGFnLlBJWEVMUyB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBWSUVXID0gQ2hhbmdlRmxhZy5WSUVXIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFXHJcbiAgICB9O1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEluamVjdCBJdGVtLnN1YnNjcmliZVxyXG4gICAgICAgIGNvbnN0IGl0ZW1Qcm90byA9ICg8YW55PnBhcGVyKS5JdGVtLnByb3RvdHlwZTtcclxuICAgICAgICBpdGVtUHJvdG8uc3Vic2NyaWJlID0gZnVuY3Rpb24oaGFuZGxlcjogSXRlbUNoYW5nZUhhbmRsZXIpOiBDYWxsYmFjayB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fc3Vic2NyaWJlcnMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoaGFuZGxlcikgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5wdXNoKGhhbmRsZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGhhbmRsZXIsIDApO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXcmFwIEl0ZW0ucmVtb3ZlXHJcbiAgICAgICAgY29uc3QgaXRlbVJlbW92ZSA9IGl0ZW1Qcm90by5yZW1vdmU7XHJcbiAgICAgICAgaXRlbVByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdGVtUmVtb3ZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdyYXAgUHJvamVjdC5fY2hhbmdlZFxyXG4gICAgICAgIGNvbnN0IHByb2plY3RQcm90byA9IDxhbnk+cGFwZXIuUHJvamVjdC5wcm90b3R5cGU7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdENoYW5nZWQgPSBwcm9qZWN0UHJvdG8uX2NoYW5nZWQ7XHJcbiAgICAgICAgcHJvamVjdFByb3RvLl9jaGFuZ2VkID0gZnVuY3Rpb24oZmxhZ3M6IENoYW5nZUZsYWcsIGl0ZW06IHBhcGVyLkl0ZW0pIHtcclxuICAgICAgICAgICAgcHJvamVjdENoYW5nZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN1YnMgPSAoPGFueT5pdGVtKS5fc3Vic2NyaWJlcnM7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3Vicykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHMgb2Ygc3Vicykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzLmNhbGwoaXRlbSwgZmxhZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGVzY3JpYmUoZmxhZ3M6IENoYW5nZUZsYWcpIHtcclxuICAgICAgICBsZXQgZmxhZ0xpc3Q6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgXy5mb3JPd24oQ2hhbmdlRmxhZywgKHZhbHVlLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgaWYgKCh0eXBlb2YgdmFsdWUpID09PSBcIm51bWJlclwiICYmICh2YWx1ZSAmIGZsYWdzKSkge1xyXG4gICAgICAgICAgICAgICAgZmxhZ0xpc3QucHVzaChrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZsYWdMaXN0LmpvaW4oJyB8ICcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZShpdGVtOiBwYXBlci5JdGVtLCBmbGFnczogQ2hhbmdlRmxhZyk6IFxyXG4gICAgICAgIFJ4Lk9ic2VydmFibGU8Q2hhbmdlRmxhZz4gXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHVuc3ViOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm48Q2hhbmdlRmxhZz4oXHJcbiAgICAgICAgICAgIGFkZEhhbmRsZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgdW5zdWIgPSBpdGVtLnN1YnNjcmliZShmID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZihmICYgZmxhZ3Mpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRIYW5kbGVyKGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgcmVtb3ZlSGFuZGxlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih1bnN1Yil7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5zdWIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5QYXBlck5vdGlmeS5pbml0aWFsaXplKCk7XHJcbiIsIlxyXG5tb2R1bGUgcGFwZXIge1xyXG5cclxuICAgIGV4cG9ydCB2YXIgRXZlbnRUeXBlID0ge1xyXG4gICAgICAgIGZyYW1lOiBcImZyYW1lXCIsXHJcbiAgICAgICAgbW91c2VEb3duOiBcIm1vdXNlZG93blwiLFxyXG4gICAgICAgIG1vdXNlVXA6IFwibW91c2V1cFwiLFxyXG4gICAgICAgIG1vdXNlRHJhZzogXCJtb3VzZWRyYWdcIixcclxuICAgICAgICBjbGljazogXCJjbGlja1wiLFxyXG4gICAgICAgIGRvdWJsZUNsaWNrOiBcImRvdWJsZWNsaWNrXCIsXHJcbiAgICAgICAgbW91c2VNb3ZlOiBcIm1vdXNlbW92ZVwiLFxyXG4gICAgICAgIG1vdXNlRW50ZXI6IFwibW91c2VlbnRlclwiLFxyXG4gICAgICAgIG1vdXNlTGVhdmU6IFwibW91c2VsZWF2ZVwiLFxyXG4gICAgICAgIGtleXVwOiBcImtleXVwXCIsXHJcbiAgICAgICAga2V5ZG93bjogXCJrZXlkb3duXCJcclxuICAgIH1cclxuXHJcbn0iLCJcclxuLy8gY2xhc3MgT2xkVG9waWM8VD4ge1xyXG5cclxuLy8gICAgIHByaXZhdGUgX2NoYW5uZWw6IElDaGFubmVsRGVmaW5pdGlvbjxPYmplY3Q+O1xyXG4vLyAgICAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xyXG5cclxuLy8gICAgIGNvbnN0cnVjdG9yKGNoYW5uZWw6IElDaGFubmVsRGVmaW5pdGlvbjxPYmplY3Q+LCB0b3BpYzogc3RyaW5nKSB7XHJcbi8vICAgICAgICAgdGhpcy5fY2hhbm5lbCA9IGNoYW5uZWw7XHJcbi8vICAgICAgICAgdGhpcy5fbmFtZSA9IHRvcGljO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIG9ic2VydmUoKTogUnguT2JzZXJ2YWJsZTxUPiB7XHJcbi8vICAgICAgICAgcmV0dXJuIDxSeC5PYnNlcnZhYmxlPFQ+PnRoaXMuX2NoYW5uZWwub2JzZXJ2ZSh0aGlzLl9uYW1lKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBwdWJsaXNoKGRhdGE6IFQpIHtcclxuLy8gICAgICAgICB0aGlzLl9jaGFubmVsLnB1Ymxpc2godGhpcy5fbmFtZSwgZGF0YSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgc3Vic2NyaWJlKGNhbGxiYWNrOiBJQ2FsbGJhY2s8VD4pOiBJU3Vic2NyaXB0aW9uRGVmaW5pdGlvbjxUPiB7XHJcbi8vICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWwuc3Vic2NyaWJlKHRoaXMuX25hbWUsIGNhbGxiYWNrKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBwcm90ZWN0ZWQgc3VidG9waWMobmFtZSk6IENoYW5uZWxUb3BpYzxUPiB7XHJcbi8vICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VD4odGhpcy5fY2hhbm5lbCwgdGhpcy5fbmFtZSArICcuJyArIG5hbWUpO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHByb3RlY3RlZCBzdWJ0b3BpY09mPFUgZXh0ZW5kcyBUPihuYW1lKTogQ2hhbm5lbFRvcGljPFU+IHtcclxuLy8gICAgICAgICByZXR1cm4gbmV3IENoYW5uZWxUb3BpYzxVPih0aGlzLl9jaGFubmVsLCB0aGlzLl9uYW1lICsgJy4nICsgbmFtZSk7XHJcbi8vICAgICB9XHJcbi8vIH1cclxuIiwiXHJcbmludGVyZmFjZSBJUG9zdGFsIHtcclxuICAgIG9ic2VydmU6IChvcHRpb25zOiBQb3N0YWxPYnNlcnZlT3B0aW9ucykgPT4gUnguT2JzZXJ2YWJsZTxhbnk+O1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUG9zdGFsT2JzZXJ2ZU9wdGlvbnMge1xyXG4gICAgY2hhbm5lbDogc3RyaW5nO1xyXG4gICAgdG9waWM6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIElDaGFubmVsRGVmaW5pdGlvbjxUPiB7XHJcbiAgICBvYnNlcnZlKHRvcGljOiBzdHJpbmcpOiBSeC5PYnNlcnZhYmxlPFQ+O1xyXG59XHJcblxyXG5wb3N0YWwub2JzZXJ2ZSA9IGZ1bmN0aW9uKG9wdGlvbnM6IFBvc3RhbE9ic2VydmVPcHRpb25zKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgY2hhbm5lbCA9IG9wdGlvbnMuY2hhbm5lbDtcclxuICAgIHZhciB0b3BpYyA9IG9wdGlvbnMudG9waWM7XHJcblxyXG4gICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybihcclxuICAgICAgICBmdW5jdGlvbiBhZGRIYW5kbGVyKGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuc3Vic2NyaWJlKHtcclxuICAgICAgICAgICAgICAgIGNoYW5uZWw6IGNoYW5uZWwsXHJcbiAgICAgICAgICAgICAgICB0b3BpYzogdG9waWMsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogaCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiBkZWxIYW5kbGVyKF8sIHN1Yikge1xyXG4gICAgICAgICAgICBzdWIudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG59O1xyXG5cclxuLy8gYWRkIG9ic2VydmUgdG8gQ2hhbm5lbERlZmluaXRpb25cclxuKDxhbnk+cG9zdGFsKS5DaGFubmVsRGVmaW5pdGlvbi5wcm90b3R5cGUub2JzZXJ2ZSA9IGZ1bmN0aW9uKHRvcGljOiBzdHJpbmcpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuKFxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZEhhbmRsZXIoaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5idXMuc3Vic2NyaWJlKHtcclxuICAgICAgICAgICAgICAgIGNoYW5uZWw6IHNlbGYuY2hhbm5lbCxcclxuICAgICAgICAgICAgICAgIHRvcGljOiB0b3BpYyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBoLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbEhhbmRsZXIoXywgc3ViKSB7XHJcbiAgICAgICAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn07XHJcbiIsIlxyXG5jb25zdCByaCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQ7XHJcbiIsIlxyXG5hYnN0cmFjdCBjbGFzcyBDb21wb25lbnQ8VD4ge1xyXG4gICAgYWJzdHJhY3QgcmVuZGVyKGRhdGE6IFQpOiBWTm9kZTtcclxufSIsIlxyXG5pbnRlcmZhY2UgUmVhY3RpdmVEb21Db21wb25lbnQge1xyXG4gICAgZG9tJDogUnguT2JzZXJ2YWJsZTxWTm9kZT47XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBWRG9tSGVscGVycyB7XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmVuZGVyQXNDaGlsZChjb250YWluZXI6IEhUTUxFbGVtZW50LCBkb206IFZOb2RlKXtcclxuICAgICAgICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgY29uc3QgcGF0Y2hlZCA9IHBhdGNoKGNoaWxkLCBkb20pO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwYXRjaGVkLmVsbSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFJlYWN0aXZlRG9tIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciBhIHJlYWN0aXZlIGNvbXBvbmVudCB3aXRoaW4gY29udGFpbmVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyU3RyZWFtKFxyXG4gICAgICAgIGRvbSQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+LFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnRcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBjb25zdCBpZCA9IGNvbnRhaW5lci5pZDtcclxuICAgICAgICBsZXQgY3VycmVudDogSFRNTEVsZW1lbnQgfCBWTm9kZSA9IGNvbnRhaW5lcjtcclxuICAgICAgICBjb25zdCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XHJcbiAgICAgICAgZG9tJC5zdWJzY3JpYmUoZG9tID0+IHtcclxuICAgICAgICAgICAgaWYoIWRvbSkgcmV0dXJuO1xyXG4vL2NvbnNvbGUubG9nKCdyZW5kZXJpbmcgZG9tJywgZG9tKTsgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyByZXRhaW4gSURcclxuICAgICAgICAgICAgY29uc3QgcGF0Y2hlZCA9IHBhdGNoKGN1cnJlbnQsIGRvbSk7XHJcbiAgICAgICAgICAgIGlmKGlkICYmICFwYXRjaGVkLmVsbS5pZCl7XHJcbiAgICAgICAgICAgICAgICBwYXRjaGVkLmVsbS5pZCA9IGlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2hlZDtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIGEgcmVhY3RpdmUgY29tcG9uZW50IHdpdGhpbiBjb250YWluZXIuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXJDb21wb25lbnQoXHJcbiAgICAgICAgY29tcG9uZW50OiBSZWFjdGl2ZURvbUNvbXBvbmVudCxcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50IHwgVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGNvbXBvbmVudC5kb20kLnN1YnNjcmliZShkb20gPT4ge1xyXG4gICAgICAgICAgICBpZighZG9tKSByZXR1cm47XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgd2l0aGluIGNvbnRhaW5lciB3aGVuZXZlciBzb3VyY2UgY2hhbmdlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxpdmVSZW5kZXI8VD4oXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudCB8IFZOb2RlLFxyXG4gICAgICAgIHNvdXJjZTogUnguT2JzZXJ2YWJsZTxUPixcclxuICAgICAgICByZW5kZXI6IChuZXh0OiBUKSA9PiBWTm9kZVxyXG4gICAgKTogUnguT2JzZXJ2YWJsZTxWTm9kZT4ge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gY29udGFpbmVyO1xyXG4gICAgICAgIGxldCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XHJcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSByZW5kZXIoZGF0YSk7XHJcbiAgICAgICAgICAgIGlmKCFub2RlKSByZXR1cm47XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaChjdXJyZW50LCBub2RlKTtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5jbGFzcyBBcHAge1xyXG5cclxuICAgIHN0b3JlOiBTdG9yZTtcclxuICAgIHJvdXRlcjogQXBwUm91dGVyO1xyXG4gICAgd29ya3NwYWNlQ29udHJvbGxlcjogV29ya3NwYWNlQ29udHJvbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgRG9tSGVscGVycy5pbml0RXJyb3JIYW5kbGVyKGVycm9yRGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShlcnJvckRhdGEpO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvY2xpZW50LWVycm9yc1wiLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBjb250ZW50XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRoaXMucm91dGVyID0gbmV3IEFwcFJvdXRlcigpO1xyXG4gICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUodGhpcy5yb3V0ZXIpO1xyXG5cclxuICAgICAgICBjb25zdCBza2V0Y2hFZGl0b3IgPSBuZXcgU2tldGNoRWRpdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNpZ25lcicpLCB0aGlzLnN0b3JlKTtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZEl0ZW1FZGl0b3IgPSBuZXcgU2VsZWN0ZWRJdGVtRWRpdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdG9yT3ZlcmxheVwiKSwgdGhpcy5zdG9yZSk7XHJcbiAgICAgICAgY29uc3QgaGVscERpYWxvZyA9IG5ldyBIZWxwRGlhbG9nKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVscC1kaWFsb2dcIiksIHRoaXMuc3RvcmUpO1xyXG5cclxuICAgICAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5zdG9yZS5hY3Rpb25zLCBldmVudHMgPSB0aGlzLnN0b3JlLmV2ZW50cztcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhcnQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc3RvcmUuZXZlbnRzLmFwcC5mb250TG9hZGVkLm9ic2VydmUoKS5maXJzdCgpLnN1YnNjcmliZShtID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud29ya3NwYWNlQ29udHJvbGxlciA9IG5ldyBXb3Jrc3BhY2VDb250cm9sbGVyKHRoaXMuc3RvcmUsIG0uZGF0YSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmV2ZW50cy5hcHAud29ya3NwYWNlSW5pdGlhbGl6ZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLmFkZC5kaXNwYXRjaCh7IHRleHQ6IFwiU0tFVENIIFdJVEggV09SRFNcIiB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuYXBwLmluaXRXb3Jrc3BhY2UuZGlzcGF0Y2goKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbn1cclxuIiwiXHJcbmNsYXNzIEFwcFJvdXRlciBleHRlbmRzIFJvdXRlcjUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKFtcclxuICAgICAgICAgICAgbmV3IFJvdXRlTm9kZShcImhvbWVcIiwgXCIvXCIpLFxyXG4gICAgICAgICAgICBuZXcgUm91dGVOb2RlKFwic2tldGNoXCIsIFwiL3NrZXRjaC86c2tldGNoSWRcIiksIC8vIDxbYS1mQS1GMC05XXsxNH0+XHJcbiAgICAgICAgXSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdXNlSGFzaDogZmFsc2VcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vdGhpcy51c2VQbHVnaW4obG9nZ2VyUGx1Z2luKCkpXHJcbiAgICAgICAgdGhpcy51c2VQbHVnaW4obGlzdGVuZXJzUGx1Z2luLmRlZmF1bHQoKSlcclxuICAgICAgICAgICAgLnVzZVBsdWdpbihoaXN0b3J5UGx1Z2luLmRlZmF1bHQoKSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnQoKGVyciwgc3RhdGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwicm91dGVyIGVycm9yXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlKFwiaG9tZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuaW50ZXJmYWNlIFNrZXRjaFJvdXRlU3RhdGUge1xyXG4gICAgc2tldGNoSWQ/OiBzdHJpbmc7XHJcbn1cclxuIiwiXHJcbmNsYXNzIERvY3VtZW50S2V5SGFuZGxlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlKSB7XHJcblxyXG4gICAgICAgIC8vIG5vdGU6IHVuZGlzcG9zZWQgZXZlbnQgc3Vic2NyaXB0aW9uXHJcbiAgICAgICAgJChkb2N1bWVudCkua2V5dXAoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IERvbUhlbHBlcnMuS2V5Q29kZXMuRXNjKSB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2gobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG59IiwiLy8gbmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcbiAgICBcclxuLy8gICAgIGV4cG9ydCBjbGFzcyBFZGl0b3JNb2R1bGUge1xyXG4gICAgICAgIFxyXG4vLyAgICAgfVxyXG4gICAgXHJcbi8vIH1cclxuIiwiXHJcbi8qKlxyXG4gKiBUaGUgc2luZ2xldG9uIFN0b3JlIGNvbnRyb2xzIGFsbCBhcHBsaWNhdGlvbiBzdGF0ZS5cclxuICogTm8gcGFydHMgb3V0c2lkZSBvZiB0aGUgU3RvcmUgbW9kaWZ5IGFwcGxpY2F0aW9uIHN0YXRlLlxyXG4gKiBDb21tdW5pY2F0aW9uIHdpdGggdGhlIFN0b3JlIGlzIGRvbmUgdGhyb3VnaCBtZXNzYWdlIENoYW5uZWxzOiBcclxuICogICAtIEFjdGlvbnMgY2hhbm5lbCB0byBzZW5kIGludG8gdGhlIFN0b3JlLFxyXG4gKiAgIC0gRXZlbnRzIGNoYW5uZWwgdG8gcmVjZWl2ZSBub3RpZmljYXRpb24gZnJvbSB0aGUgU3RvcmUuXHJcbiAqIE9ubHkgdGhlIFN0b3JlIGNhbiByZWNlaXZlIGFjdGlvbiBtZXNzYWdlcy5cclxuICogT25seSB0aGUgU3RvcmUgY2FuIHNlbmQgZXZlbnQgbWVzc2FnZXMuXHJcbiAqIFRoZSBTdG9yZSBjYW5ub3Qgc2VuZCBhY3Rpb25zIG9yIGxpc3RlbiB0byBldmVudHMgKHRvIGF2b2lkIGxvb3BzKS5cclxuICogTWVzc2FnZXMgYXJlIHRvIGJlIHRyZWF0ZWQgYXMgaW1tdXRhYmxlLlxyXG4gKiBBbGwgbWVudGlvbnMgb2YgdGhlIFN0b3JlIGNhbiBiZSBhc3N1bWVkIHRvIG1lYW4sIG9mIGNvdXJzZSxcclxuICogICBcIlRoZSBTdG9yZSBhbmQgaXRzIHN1Yi1jb21wb25lbnRzLlwiXHJcbiAqL1xyXG5jbGFzcyBTdG9yZSB7XHJcblxyXG4gICAgc3RhdGljIEJST1dTRVJfSURfS0VZID0gXCJicm93c2VySWRcIjtcclxuICAgIHN0YXRpYyBGQUxMQkFDS19GT05UX1VSTCA9IFwiL2ZvbnRzL1JvYm90by01MDAudHRmXCI7XHJcbiAgICBzdGF0aWMgREVGQVVMVF9GT05UX05BTUUgPSBcIlJvYm90b1wiO1xyXG4gICAgc3RhdGljIEZPTlRfTElTVF9MSU1JVCA9IDEwMDtcclxuICAgIHN0YXRpYyBTS0VUQ0hfTE9DQUxfQ0FDSEVfS0VZID0gXCJmaWRkbGVzdGlja3MuaW8ubGFzdFNrZXRjaFwiO1xyXG4gICAgc3RhdGljIExPQ0FMX0NBQ0hFX0RFTEFZX01TID0gMTAwMDtcclxuICAgIHN0YXRpYyBTRVJWRVJfU0FWRV9ERUxBWV9NUyA9IDYwMDA7XHJcblxyXG4gICAgc3RhdGU6IEFwcFN0YXRlID0ge307XHJcbiAgICByZXNvdXJjZXMgPSB7XHJcbiAgICAgICAgZmFsbGJhY2tGb250OiBvcGVudHlwZS5Gb250LFxyXG4gICAgICAgIGZvbnRGYW1pbGllczogbmV3IEZvbnRGYW1pbGllcygpLFxyXG4gICAgICAgIHBhcnNlZEZvbnRzOiBuZXcgUGFyc2VkRm9udHMoKHVybCwgZm9udCkgPT5cclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuYXBwLmZvbnRMb2FkZWQuZGlzcGF0Y2goZm9udCkpXHJcbiAgICB9O1xyXG4gICAgcm91dGVyOiBBcHBSb3V0ZXI7XHJcbiAgICBhY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgIGV2ZW50cyA9IG5ldyBFdmVudHMoKTtcclxuXHJcbiAgICBwcml2YXRlIF9za2V0Y2hDb250ZW50JCA9IG5ldyBSeC5TdWJqZWN0PFNrZXRjaD4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihyb3V0ZXI6IEFwcFJvdXRlcikge1xyXG4gICAgICAgIHRoaXMucm91dGVyID0gcm91dGVyO1xyXG5cclxuICAgICAgICB0aGlzLnNldHVwU3RhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFN1YnNjcmlwdGlvbnMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkUmVzb3VyY2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBTdGF0ZSgpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmJyb3dzZXJJZCA9IENvb2tpZXMuZ2V0KFN0b3JlLkJST1dTRVJfSURfS0VZKTtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYnJvd3NlcklkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuYnJvd3NlcklkID0gbmV3aWQoKTtcclxuICAgICAgICAgICAgQ29va2llcy5zZXQoU3RvcmUuQlJPV1NFUl9JRF9LRVksIHRoaXMuc3RhdGUuYnJvd3NlcklkLCB7IGV4cGlyZXM6IDIgKiAzNjUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldHVwU3Vic2NyaXB0aW9ucygpIHtcclxuICAgICAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5hY3Rpb25zLCBldmVudHMgPSB0aGlzLmV2ZW50cztcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gQXBwIC0tLS0tXHJcblxyXG4gICAgICAgIGFjdGlvbnMuYXBwLmluaXRXb3Jrc3BhY2Uub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgIC5wYXVzYWJsZUJ1ZmZlcmVkKGV2ZW50cy5hcHAucmVzb3VyY2VzUmVhZHkub2JzZXJ2ZSgpLm1hcChtID0+IG0uZGF0YSkpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2tldGNoSWRQYXJhbSA9IHRoaXMuc2tldGNoSWRVcmxQYXJhbTtcclxuICAgICAgICAgICAgICAgIGlmIChza2V0Y2hJZFBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgUzNBY2Nlc3MuZ2V0RmlsZShza2V0Y2hJZFBhcmFtICsgXCIuanNvblwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9uZShza2V0Y2ggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKHNrZXRjaCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXRyaWV2ZWQgc2tldGNoXCIsIHNrZXRjaC5faWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNrZXRjaC5icm93c2VySWQgPT09IHRoaXMuc3RhdGUuYnJvd3NlcklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NrZXRjaCB3YXMgY3JlYXRlZCBpbiB0aGlzIGJyb3dzZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTa2V0Y2ggd2FzIGNyZWF0ZWQgaW4gYSBkaWZmZXJlbnQgYnJvd3NlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy5hcHAud29ya3NwYWNlSW5pdGlhbGl6ZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiZXJyb3IgZ2V0dGluZyByZW1vdGUgc2tldGNoXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2godGhpcy5jcmVhdGVTa2V0Y2goKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHMuYXBwLndvcmtzcGFjZUluaXRpYWxpemVkLmRpc3BhdGNoKHRoaXMuc3RhdGUuc2tldGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaCh0aGlzLmNyZWF0ZVNrZXRjaCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiAtLS0gU2V0IHVwIHNrZXRjaCBzdGF0ZSB3YXRjaGVkIC0tLSAqL1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHRoaXMuX3NrZXRjaENvbnRlbnQkXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLmRlYm91bmNlKFN0b3JlLkxPQ0FMX0NBQ0hFX0RFTEFZX01TKVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIC5zdWJzY3JpYmUocnMgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZSB8fCAhbG9jYWxTdG9yYWdlLmdldEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIC8vIG5vdCBzdXBwb3J0ZWRcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIFN0b3JlLlNLRVRDSF9MT0NBTF9DQUNIRV9LRVksXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXRlLnNrZXRjaCkpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuX3NrZXRjaENvbnRlbnQkLmRlYm91bmNlKFN0b3JlLlNFUlZFUl9TQVZFX0RFTEFZX01TKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoc2tldGNoID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNrZXRjaCAmJiBza2V0Y2guX2lkICYmIHNrZXRjaC50ZXh0QmxvY2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlU2tldGNoKHNrZXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuYXBwLmxvYWRGb250LnN1YnNjcmliZShtID0+XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChtLmRhdGEpKTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gRGVzaWduZXIgLS0tLS1cclxuXHJcbiAgICAgICAgYWN0aW9ucy5kZXNpZ25lci56b29tVG9GaXQuZm9yd2FyZChcclxuICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZCk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuZGVzaWduZXIuZXhwb3J0UE5HLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgIGV2ZW50cy5kZXNpZ25lci5leHBvcnRQTkdSZXF1ZXN0ZWQuZGlzcGF0Y2gobS5kYXRhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5kZXNpZ25lci5leHBvcnRTVkcuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLmV4cG9ydFNWR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLmRlc2lnbmVyLnZpZXdDaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLnZpZXdDaGFuZ2VkLmRpc3BhdGNoKG0uZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuZGVzaWduZXIudXBkYXRlU25hcHNob3Quc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBpZiAobS5kYXRhLnNrZXRjaC5faWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVuYW1lID0gbS5kYXRhLnNrZXRjaC5faWQgKyBcIi5wbmdcIjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBEb21IZWxwZXJzLmRhdGFVUkxUb0Jsb2IobS5kYXRhLnBuZ0RhdGFVcmwpO1xyXG4gICAgICAgICAgICAgICAgUzNBY2Nlc3MucHV0RmlsZShmaWxlbmFtZSwgXCJpbWFnZS9wbmdcIiwgYmxvYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5kZXNpZ25lci50b2dnbGVIZWxwLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2hvd0hlbHAgPSAhdGhpcy5zdGF0ZS5zaG93SGVscDtcclxuICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLnNob3dIZWxwQ2hhbmdlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnNob3dIZWxwKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gU2tldGNoIC0tLS0tXHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLmNyZWF0ZS5zdWJzY3JpYmUoKG0pID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc2tldGNoID0gdGhpcy5jcmVhdGVTa2V0Y2goKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGNoOiBTa2V0Y2hBdHRyID0gbS5kYXRhIHx8IHt9O1xyXG4gICAgICAgICAgICBwYXRjaC5iYWNrZ3JvdW5kQ29sb3IgPSBwYXRjaC5iYWNrZ3JvdW5kQ29sb3IgfHwgJyNmNmYzZWInO1xyXG4gICAgICAgICAgICB0aGlzLmFzc2lnbihza2V0Y2gsIHBhdGNoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpXHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlcy5wYXJzZWRGb250cy5nZXQodGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIuZm9udEZhbWlseSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VkU2tldGNoKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLmNsb25lLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1NrZXRjaCA9IF8uY2xvbmUodGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICBuZXdTa2V0Y2guX2lkID0gbmV3aWQoKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKG5ld1NrZXRjaCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuc2tldGNoLmF0dHJVcGRhdGUuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hc3NpZ24odGhpcy5zdGF0ZS5za2V0Y2gsIGV2LmRhdGEpO1xyXG4gICAgICAgICAgICBldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2goKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obS5kYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShtLmRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gLS0tLS0gVGV4dEJsb2NrIC0tLS0tXHJcblxyXG4gICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLmFkZFxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gZXYuZGF0YTtcclxuICAgICAgICAgICAgICAgIGlmICghcGF0Y2gudGV4dCB8fCAhcGF0Y2gudGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB7IF9pZDogbmV3aWQoKSB9IGFzIFRleHRCbG9jaztcclxuICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduKGJsb2NrLCBwYXRjaCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFibG9jay50ZXh0Q29sb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay50ZXh0Q29sb3IgPSB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ci50ZXh0Q29sb3I7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFibG9jay5mb250RmFtaWx5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZm9udEZhbWlseSA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZm9udFZhcmlhbnQgPSB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ci5mb250VmFyaWFudDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLnRleHRibG9jay5hZGRlZC5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2goKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRUZXh0QmxvY2tGb250KGJsb2NrKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUF0dHJcclxuICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB0aGlzLmdldEJsb2NrKGV2LmRhdGEuX2lkKTtcclxuICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRjaCA9IDxUZXh0QmxvY2s+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBldi5kYXRhLnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogZXYuZGF0YS5iYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRDb2xvcjogZXYuZGF0YS50ZXh0Q29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGV2LmRhdGEuZm9udEZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFZhcmlhbnQ6IGV2LmRhdGEuZm9udFZhcmlhbnRcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvbnRDaGFuZ2VkID0gcGF0Y2guZm9udEZhbWlseSAhPT0gYmxvY2suZm9udEZhbWlseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCBwYXRjaC5mb250VmFyaWFudCAhPT0gYmxvY2suZm9udFZhcmlhbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hc3NpZ24oYmxvY2ssIHBhdGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLmZvbnRGYW1pbHkgJiYgIWJsb2NrLmZvbnRWYXJpYW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhbURlZiA9IHRoaXMucmVzb3VyY2VzLmZvbnRGYW1pbGllcy5nZXQoYmxvY2suZm9udEZhbWlseSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmYW1EZWYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlZ3VsYXIgb3IgZWxzZSBmaXJzdCB2YXJpYW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jay5mb250VmFyaWFudCA9IHRoaXMucmVzb3VyY2VzLmZvbnRGYW1pbGllcy5kZWZhdWx0VmFyaWFudChmYW1EZWYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBibG9jay50ZXh0Q29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogYmxvY2suYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBibG9jay5mb250RmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogYmxvY2suZm9udFZhcmlhbnRcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmF0dHJDaGFuZ2VkLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2goKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvbnRDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRleHRCbG9ja0ZvbnQoYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBkaWREZWxldGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIF8ucmVtb3ZlKHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsIHRiID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGIuX2lkID09PSBldi5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWREZWxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLnJlbW92ZWQuZGlzcGF0Y2goeyBfaWQ6IGV2LmRhdGEuX2lkIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnRleHRCbG9jay51cGRhdGVBcnJhbmdlXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5nZXRCbG9jayhldi5kYXRhLl9pZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5wb3NpdGlvbiA9IGV2LmRhdGEucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sub3V0bGluZSA9IGV2LmRhdGEub3V0bGluZTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmFycmFuZ2VDaGFuZ2VkLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2goKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb2FkU2tldGNoKHNrZXRjaDogU2tldGNoKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5sb2FkaW5nU2tldGNoID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaCA9IHNrZXRjaDtcclxuICAgICAgICB0aGlzLnNrZXRjaElkVXJsUGFyYW0gPSBza2V0Y2guX2lkO1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5sb2FkZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgIGZvciAoY29uc3QgdGIgb2YgdGhpcy5zdGF0ZS5za2V0Y2gudGV4dEJsb2Nrcykge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy50ZXh0YmxvY2subG9hZGVkLmRpc3BhdGNoKHRiKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkVGV4dEJsb2NrRm9udCh0Yik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZXZlbnRzLmRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZC5kaXNwYXRjaCgpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9hZFJlc291cmNlcygpIHtcclxuICAgICAgICB0aGlzLnJlc291cmNlcy5mb250RmFtaWxpZXMubG9hZENhdGFsb2dMb2NhbChmYW1pbGllcyA9PiB7XHJcbiAgICAgICAgICAgIC8vIGxvYWQgZm9udHMgaW50byBicm93c2VyIGZvciBwcmV2aWV3XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZvbnRGYW1pbGllcy5sb2FkUHJldmlld1N1YnNldHMoZmFtaWxpZXMubWFwKGYgPT4gZi5mYW1pbHkpKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChcclxuICAgICAgICAgICAgICAgIFN0b3JlLkZBTExCQUNLX0ZPTlRfVVJMLFxyXG4gICAgICAgICAgICAgICAgKHVybCwgZm9udCkgPT4gdGhpcy5yZXNvdXJjZXMuZmFsbGJhY2tGb250ID0gZm9udCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5hcHAucmVzb3VyY2VzUmVhZHkuZGlzcGF0Y2godHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93VXNlck1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS51c2VyTWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgdGhpcy5ldmVudHMuZGVzaWduZXIudXNlck1lc3NhZ2VDaGFuZ2VkLmRpc3BhdGNoKG1lc3NhZ2UpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnVzZXJNZXNzYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuZGVzaWduZXIudXNlck1lc3NhZ2VDaGFuZ2VkLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgIH0sIDE1MDApXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb2FkVGV4dEJsb2NrRm9udChibG9jazogVGV4dEJsb2NrKSB7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KFxyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlcy5mb250RmFtaWxpZXMuZ2V0VXJsKGJsb2NrLmZvbnRGYW1pbHksIGJsb2NrLmZvbnRWYXJpYW50KSxcclxuICAgICAgICAgICAgKHVybCwgZm9udCkgPT4gdGhpcy5ldmVudHMudGV4dGJsb2NrLmZvbnRSZWFkeS5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgIHsgdGV4dEJsb2NrSWQ6IGJsb2NrLl9pZCwgZm9udDogZm9udCB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VkU2tldGNoKCkge1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5jb250ZW50Q2hhbmdlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnNrZXRjaCk7XHJcbiAgICAgICAgdGhpcy5fc2tldGNoQ29udGVudCQub25OZXh0KHRoaXMuc3RhdGUuc2tldGNoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzc2lnbjxUPihkZXN0OiBULCBzb3VyY2U6IFQpIHtcclxuICAgICAgICBfLm1lcmdlKGRlc3QsIHNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTa2V0Y2goKTogU2tldGNoIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBfaWQ6IG5ld2lkKCksXHJcbiAgICAgICAgICAgIGJyb3dzZXJJZDogdGhpcy5zdGF0ZS5icm93c2VySWQsXHJcbiAgICAgICAgICAgIGRlZmF1bHRUZXh0QmxvY2tBdHRyOiB7XHJcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcIlJvYm90b1wiLFxyXG4gICAgICAgICAgICAgICAgZm9udFZhcmlhbnQ6IFwicmVndWxhclwiLFxyXG4gICAgICAgICAgICAgICAgdGV4dENvbG9yOiBcImxpZ2h0Z3JheVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRleHRCbG9ja3M6IDxUZXh0QmxvY2tbXT5bXVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgc2tldGNoSWRVcmxQYXJhbSgpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHJvdXRlU3RhdGUgPSA8Um91dGVTdGF0ZT50aGlzLnJvdXRlci5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiByb3V0ZVN0YXRlLnBhcmFtcy5za2V0Y2hJZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldCBza2V0Y2hJZFVybFBhcmFtKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcInNrZXRjaFwiLCB7IHNrZXRjaElkOiB2YWx1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNhdmVTa2V0Y2goc2tldGNoOiBTa2V0Y2gpIHtcclxuICAgICAgICBTM0FjY2Vzcy5wdXRGaWxlKHNrZXRjaC5faWQgKyBcIi5qc29uXCIsXHJcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiLCBKU09OLnN0cmluZ2lmeShza2V0Y2gpKTtcclxuICAgICAgICB0aGlzLnNob3dVc2VyTWVzc2FnZShcIlNhdmVkXCIpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLmRlc2lnbmVyLnNuYXBzaG90RXhwaXJlZC5kaXNwYXRjaChza2V0Y2gpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0U2VsZWN0aW9uKGl0ZW06IFdvcmtzcGFjZU9iamVjdFJlZiwgZm9yY2U/OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCFmb3JjZSkge1xyXG4gICAgICAgICAgICAvLyBlYXJseSBleGl0IG9uIG5vIGNoYW5nZVxyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uaXRlbUlkID09PSBpdGVtLml0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5zZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0aW9uID0gaXRlbTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guc2VsZWN0aW9uQ2hhbmdlZC5kaXNwYXRjaChpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEVkaXRpbmdJdGVtKGl0ZW06IFBvc2l0aW9uZWRPYmplY3RSZWYsIGZvcmNlPzogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICghZm9yY2UpIHtcclxuICAgICAgICAgICAgLy8gZWFybHkgZXhpdCBvbiBubyBjaGFuZ2VcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbS5pdGVtSWQgPT09IGl0ZW0uaXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmVkaXRpbmdJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSkge1xyXG4gICAgICAgICAgICAvLyBzaWduYWwgY2xvc2luZyBlZGl0b3IgZm9yIGl0ZW1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtLml0ZW1UeXBlID09PSBcIlRleHRCbG9ja1wiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RWRpdGluZ0Jsb2NrID0gdGhpcy5nZXRCbG9jayh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtLml0ZW1JZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEVkaXRpbmdCbG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5lZGl0b3JDbG9zZWQuZGlzcGF0Y2goY3VycmVudEVkaXRpbmdCbG9jayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgIC8vIGVkaXRpbmcgaXRlbSBzaG91bGQgYmUgc2VsZWN0ZWQgaXRlbVxyXG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihpdGVtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0gPSBpdGVtO1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWQuZGlzcGF0Y2goaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRCbG9jayhpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLCB0YiA9PiB0Yi5faWQgPT09IGlkKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY2xhc3MgV29ya3NwYWNlQ29udHJvbGxlciB7XHJcblxyXG4gICAgc3RhdGljIFRFWFRfQ0hBTkdFX1JFTkRFUl9USFJPVFRMRV9NUyA9IDUwMDtcclxuICAgIHN0YXRpYyBCTE9DS19CT1VORFNfQ0hBTkdFX1RIUk9UVExFX01TID0gNTAwO1xyXG5cclxuICAgIGRlZmF1bHRTaXplID0gbmV3IHBhcGVyLlNpemUoNTAwMDAsIDQwMDAwKTtcclxuICAgIGRlZmF1bHRTY2FsZSA9IDAuMDI7XHJcblxyXG4gICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcbiAgICBmYWxsYmFja0ZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICB2aWV3Wm9vbTogVmlld1pvb207XHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU7XHJcbiAgICBwcml2YXRlIF9za2V0Y2g6IFNrZXRjaDtcclxuICAgIHByaXZhdGUgX3RleHRCbG9ja0l0ZW1zOiB7IFt0ZXh0QmxvY2tJZDogc3RyaW5nXTogVGV4dFdhcnAgfSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSwgZmFsbGJhY2tGb250OiBvcGVudHlwZS5Gb250KSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4gICAgICAgIHRoaXMuZmFsbGJhY2tGb250ID0gZmFsbGJhY2tGb250O1xyXG4gICAgICAgIHBhcGVyLnNldHRpbmdzLmhhbmRsZVNpemUgPSAxO1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkNhbnZhcycpO1xyXG4gICAgICAgIHBhcGVyLnNldHVwKHRoaXMuY2FudmFzKTtcclxuICAgICAgICB0aGlzLnByb2plY3QgPSBwYXBlci5wcm9qZWN0O1xyXG5cclxuICAgICAgICBjb25zdCBjYW52YXNTZWwgPSAkKHRoaXMuY2FudmFzKTtcclxuICAgICAgICBzdG9yZS5ldmVudHMubWVyZ2VUeXBlZChcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5sb2FkZWQsXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQgICAgXHJcbiAgICAgICAgKS5zdWJzY3JpYmUoZXYgPT5cclxuICAgICAgICAgICAgY2FudmFzU2VsLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgZXYuZGF0YS5iYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy52aWV3Wm9vbSA9IG5ldyBWaWV3Wm9vbSh0aGlzLnByb2plY3QpO1xyXG4gICAgICAgIHRoaXMudmlld1pvb20udmlld0NoYW5nZWQuc3Vic2NyaWJlKGJvdW5kcyA9PiB7XHJcbiAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuZGVzaWduZXIudmlld0NoYW5nZWQuZGlzcGF0Y2goYm91bmRzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgY2xlYXJTZWxlY3Rpb24gPSAoZXY6IHBhcGVyLlBhcGVyTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3RvcmUuc3RhdGUuc2VsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2gobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcGFwZXIudmlldy5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGNsZWFyU2VsZWN0aW9uKTtcclxuICAgICAgICBwYXBlci52aWV3Lm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnU3RhcnQsIGNsZWFyU2VsZWN0aW9uKTtcclxuXHJcbiAgICAgICAgY29uc3Qga2V5SGFuZGxlciA9IG5ldyBEb2N1bWVudEtleUhhbmRsZXIoc3RvcmUpO1xyXG5cclxuICAgICAgICAvLyAtLS0tLSBEZXNpZ25lciAtLS0tLVxyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMuZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuem9vbVRvRml0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHN0b3JlLmV2ZW50cy5kZXNpZ25lci5leHBvcnRQTkdSZXF1ZXN0ZWQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSB0aGlzLmdldFNrZXRjaEZpbGVOYW1lKDQwLCBcInBuZ1wiKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0U25hcHNob3RQTkcoKTtcclxuICAgICAgICAgICAgRG9tSGVscGVycy5kb3dubG9hZEZpbGUoZGF0YSwgZmlsZU5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMuZGVzaWduZXIuZXhwb3J0U1ZHUmVxdWVzdGVkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZG93bmxvYWRTVkcoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLmRlc2lnbmVyLnNuYXBzaG90RXhwaXJlZC5zdWJzY3JpYmUoKG0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YVVybCA9IHRoaXMuZ2V0U25hcHNob3RQTkcoKTtcclxuICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5kZXNpZ25lci51cGRhdGVTbmFwc2hvdC5kaXNwYXRjaCh7XHJcbiAgICAgICAgICAgICAgICBza2V0Y2g6IG0uZGF0YSwgcG5nRGF0YVVybDogZGF0YVVybFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gU2tldGNoIC0tLS0tXHJcblxyXG4gICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2tldGNoID0gZXYuZGF0YTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtcyA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgIGlmIChtLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IG0uZGF0YS5pdGVtSWQgJiYgdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLml0ZW1JZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2sgJiYgIWJsb2NrLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIFRleHRCbG9jayAtLS0tLVxyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMubWVyZ2VUeXBlZChcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5hZGRlZCxcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5sb2FkZWRcclxuICAgICAgICApLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZXYgPT4gdGhpcy5hZGRCbG9jayhldi5kYXRhKSk7XHJcblxyXG4gICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWRcclxuICAgICAgICAgICAgLm9ic2VydmUoKVxyXG4gICAgICAgICAgICAudGhyb3R0bGUoV29ya3NwYWNlQ29udHJvbGxlci5URVhUX0NIQU5HRV9SRU5ERVJfVEhST1RUTEVfTVMpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0QmxvY2sgPSBtLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50ZXh0ID0gdGV4dEJsb2NrLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jdXN0b21TdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmZvbnRSZWFkeS5zdWJzY3JpYmVEYXRhKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbZGF0YS50ZXh0QmxvY2tJZF07XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmZvbnQgPSBkYXRhLmZvbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLnJlbW92ZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmVkaXRvckNsb3NlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHpvb21Ub0ZpdCgpIHtcclxuICAgICAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFZpZXdhYmxlQm91bmRzKCk7XHJcbiAgICAgICAgdGhpcy52aWV3Wm9vbS56b29tVG8oYm91bmRzLnNjYWxlKDEuMikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Vmlld2FibGVCb3VuZHMoKTogcGFwZXIuUmVjdGFuZ2xlIHtcclxuICAgICAgICBsZXQgYm91bmRzOiBwYXBlci5SZWN0YW5nbGU7XHJcbiAgICAgICAgXy5mb3JPd24odGhpcy5fdGV4dEJsb2NrSXRlbXMsIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGJvdW5kcyA9IGJvdW5kc1xyXG4gICAgICAgICAgICAgICAgPyBib3VuZHMudW5pdGUoaXRlbS5ib3VuZHMpXHJcbiAgICAgICAgICAgICAgICA6IGl0ZW0uYm91bmRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICghYm91bmRzKSB7XHJcbiAgICAgICAgICAgIGJvdW5kcyA9IG5ldyBwYXBlci5SZWN0YW5nbGUobmV3IHBhcGVyLlBvaW50KDAsIDApLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2l6ZS5tdWx0aXBseSh0aGlzLmRlZmF1bHRTY2FsZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYm91bmRzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U25hcHNob3RQTkcoKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBiYWNrZ3JvdW5kID0gdGhpcy5pbnNlcnRCYWNrZ3JvdW5kKCk7XHJcbiAgICAgICAgY29uc3QgcmFzdGVyID0gdGhpcy5wcm9qZWN0LmFjdGl2ZUxheWVyLnJhc3Rlcml6ZSgzMDAsIGZhbHNlKTtcclxuICAgICAgICBjb25zdCBkYXRhID0gcmFzdGVyLnRvRGF0YVVSTCgpO1xyXG4gICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkb3dubG9hZFNWRygpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZDogcGFwZXIuSXRlbTtcclxuICAgICAgICBpZiAodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2guYmFja2dyb3VuZENvbG9yKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQgPSB0aGlzLmluc2VydEJhY2tncm91bmQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB1cmwgPSBcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LFwiICsgZW5jb2RlVVJJQ29tcG9uZW50KFxyXG4gICAgICAgICAgICA8c3RyaW5nPnRoaXMucHJvamVjdC5leHBvcnRTVkcoeyBhc1N0cmluZzogdHJ1ZSB9KSk7XHJcbiAgICAgICAgRG9tSGVscGVycy5kb3dubG9hZEZpbGUodXJsLCB0aGlzLmdldFNrZXRjaEZpbGVOYW1lKDQwLCBcInN2Z1wiKSk7XHJcblxyXG4gICAgICAgIGlmIChiYWNrZ3JvdW5kKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U2tldGNoRmlsZU5hbWUobGVuZ3RoOiBudW1iZXIsIGV4dGVuc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgb3V0ZXI6XHJcbiAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBibG9jay50ZXh0LnNwbGl0KC9cXHMvKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHJpbSA9IHdvcmQucmVwbGFjZSgvXFxXL2csICcnKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJpbS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGgpIG5hbWUgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZSArPSB0cmltO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUubGVuZ3RoID49IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghbmFtZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbmFtZSA9IFwiZmlkZGxlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuYW1lICsgXCIuXCIgKyBleHRlbnNpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgc2tldGNoIGJhY2tncm91bmQgdG8gcHJvdmlkZSBiYWNrZ3JvdW5kIGZpbGwgKGlmIG5lY2Vzc2FyeSlcclxuICAgICAqICAgYW5kIGFkZCBtYXJnaW4gYXJvdW5kIGVkZ2VzLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluc2VydEJhY2tncm91bmQoKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRWaWV3YWJsZUJvdW5kcygpO1xyXG4gICAgICAgIGNvbnN0IG1hcmdpbiA9IE1hdGgubWF4KGJvdW5kcy53aWR0aCwgYm91bmRzLmhlaWdodCkgKiAwLjAyO1xyXG4gICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSBwYXBlci5TaGFwZS5SZWN0YW5nbGUoXHJcbiAgICAgICAgICAgIGJvdW5kcy50b3BMZWZ0LnN1YnRyYWN0KG1hcmdpbiksXHJcbiAgICAgICAgICAgIGJvdW5kcy5ib3R0b21SaWdodC5hZGQobWFyZ2luKSk7XHJcbiAgICAgICAgYmFja2dyb3VuZC5maWxsQ29sb3IgPSB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaC5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgYmFja2dyb3VuZC5zZW5kVG9CYWNrKCk7XHJcbiAgICAgICAgcmV0dXJuIGJhY2tncm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRCbG9jayh0ZXh0QmxvY2s6IFRleHRCbG9jaykge1xyXG4gICAgICAgIGlmICghdGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGV4dEJsb2NrLl9pZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdyZWNlaXZlZCBibG9jayB3aXRob3V0IGlkJywgdGV4dEJsb2NrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbdGV4dEJsb2NrLl9pZF07XHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlJlY2VpdmVkIGFkZEJsb2NrIGZvciBibG9jayB0aGF0IGlzIGFscmVhZHkgbG9hZGVkXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYm91bmRzOiB7IHVwcGVyOiBwYXBlci5TZWdtZW50W10sIGxvd2VyOiBwYXBlci5TZWdtZW50W10gfTtcclxuXHJcbiAgICAgICAgaWYgKHRleHRCbG9jay5vdXRsaW5lKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvYWRTZWdtZW50ID0gKHJlY29yZDogU2VnbWVudFJlY29yZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9pbnQgPSByZWNvcmRbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuU2VnbWVudChcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KHJlY29yZFswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZFsxXSAmJiBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkWzJdICYmIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMl0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KG5ldyBwYXBlci5Qb2ludChyZWNvcmQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgYm91bmRzID0ge1xyXG4gICAgICAgICAgICAgICAgdXBwZXI6IHRleHRCbG9jay5vdXRsaW5lLnRvcC5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpLFxyXG4gICAgICAgICAgICAgICAgbG93ZXI6IHRleHRCbG9jay5vdXRsaW5lLmJvdHRvbS5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtID0gbmV3IFRleHRXYXJwKFxyXG4gICAgICAgICAgICB0aGlzLmZhbGxiYWNrRm9udCxcclxuICAgICAgICAgICAgdGV4dEJsb2NrLnRleHQsXHJcbiAgICAgICAgICAgIGJvdW5kcyxcclxuICAgICAgICAgICAgbnVsbCwge1xyXG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yIHx8IFwicmVkXCIsICAgIC8vIHRleHRDb2xvciBzaG91bGQgaGF2ZSBiZWVuIHNldCBlbHNld2hlcmUgXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghdGV4dEJsb2NrLm91dGxpbmUgJiYgdGV4dEJsb2NrLnBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSBuZXcgcGFwZXIuUG9pbnQodGV4dEJsb2NrLnBvc2l0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW0ub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5jbGlja1dpdGhvdXREcmFnLCBldiA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2VsZWN0IG5leHQgaXRlbSBiZWhpbmRcclxuICAgICAgICAgICAgICAgIGxldCBvdGhlckhpdHMgPSAoPFRleHRXYXJwW10+Xy52YWx1ZXModGhpcy5fdGV4dEJsb2NrSXRlbXMpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoaSA9PiBpLmlkICE9PSBpdGVtLmlkICYmIGkuY29udGFpbnMoZXYucG9pbnQpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG90aGVySXRlbSA9IF8uc29ydEJ5KG90aGVySGl0cywgaSA9PiBpLmluZGV4KVswXTtcclxuICAgICAgICAgICAgICAgIGlmIChvdGhlckl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBvdGhlckl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJJZCA9IF8uZmluZEtleSh0aGlzLl90ZXh0QmxvY2tJdGVtcywgaSA9PiBpID09PSBvdGhlckl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdGhlcklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IG90aGVySWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgICAgICBpZighaXRlbS5zZWxlY3RlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgaXRlbUlkOiB0ZXh0QmxvY2suX2lkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIiB9KTsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ZW0ub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICBpZiAoIWl0ZW0uc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHsgaXRlbUlkOiB0ZXh0QmxvY2suX2lkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIiB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdGVtLm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnRW5kLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+dGhpcy5nZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW0pO1xyXG4gICAgICAgICAgICBibG9jay5faWQgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2UuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBpdGVtQ2hhbmdlJCA9IFBhcGVyTm90aWZ5Lm9ic2VydmUoaXRlbSwgUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5HRU9NRVRSWSk7XHJcbiAgICAgICAgaXRlbUNoYW5nZSRcclxuICAgICAgICAgICAgLmRlYm91bmNlKFdvcmtzcGFjZUNvbnRyb2xsZXIuQkxPQ0tfQk9VTkRTX0NIQU5HRV9USFJPVFRMRV9NUylcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSA8VGV4dEJsb2NrPnRoaXMuZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtKTtcclxuICAgICAgICAgICAgICAgIGJsb2NrLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2UuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXRlbS5kYXRhID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICBpZiAoIXRleHRCbG9jay5wb3NpdGlvbikge1xyXG4gICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLnBvaW50LmFkZChcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChpdGVtLmJvdW5kcy53aWR0aCAvIDIsIGl0ZW0uYm91bmRzLmhlaWdodCAvIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZCg1MCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtc1t0ZXh0QmxvY2suX2lkXSA9IGl0ZW07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW06IFRleHRXYXJwKTogQmxvY2tBcnJhbmdlbWVudCB7XHJcbiAgICAgICAgLy8gZXhwb3J0IHJldHVybnMgYW4gYXJyYXkgd2l0aCBpdGVtIHR5cGUgYW5kIHNlcmlhbGl6ZWQgb2JqZWN0OlxyXG4gICAgICAgIC8vICAgW1wiUGF0aFwiLCBQYXRoUmVjb3JkXVxyXG4gICAgICAgIGNvbnN0IHRvcCA9IDxQYXRoUmVjb3JkPml0ZW0udXBwZXIuZXhwb3J0SlNPTih7IGFzU3RyaW5nOiBmYWxzZSB9KVsxXTtcclxuICAgICAgICBjb25zdCBib3R0b20gPSA8UGF0aFJlY29yZD5pdGVtLmxvd2VyLmV4cG9ydEpTT04oeyBhc1N0cmluZzogZmFsc2UgfSlbMV07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBbaXRlbS5wb3NpdGlvbi54LCBpdGVtLnBvc2l0aW9uLnldLFxyXG4gICAgICAgICAgICBvdXRsaW5lOiB7IHRvcCwgYm90dG9tIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgQWN0aW9ucyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcclxuICAgIFxyXG4gICAgYXBwID0geyAgICAgICBcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbnN0cnVjdHMgU3RvcmUgdG8gbG9hZCByZXRhaW5lZCBzdGF0ZSBmcm9tIGxvY2FsIHN0b3JhZ2UsIGlmIGl0IGV4aXN0cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpbml0V29ya3NwYWNlOiB0aGlzLnRvcGljPHZvaWQ+KFwiYXBwLmluaXRXb3Jrc3BhY2VcIiksXHJcbiAgICAgICAgXHJcbiAgICAgICAgbG9hZEZvbnQ6IHRoaXMudG9waWM8c3RyaW5nPihcImFwcC5sb2FkRm9udFwiKVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgZGVzaWduZXIgPSB7XHJcbiAgICAgICAgem9vbVRvRml0OiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuem9vbVRvRml0XCIpLFxyXG4gICAgICAgIGV4cG9ydGluZ0ltYWdlOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0SW1hZ2VcIiksXHJcbiAgICAgICAgZXhwb3J0UE5HOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0UE5HXCIpLFxyXG4gICAgICAgIGV4cG9ydFNWRzogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydFNWR1wiKSxcclxuICAgICAgICB2aWV3Q2hhbmdlZDogdGhpcy50b3BpYzxwYXBlci5SZWN0YW5nbGU+KFwiZGVzaWduZXIudmlld0NoYW5nZWRcIiksXHJcbiAgICAgICAgdXBkYXRlU25hcHNob3Q6IHRoaXMudG9waWM8e3NrZXRjaDogU2tldGNoLCBwbmdEYXRhVXJsOiBzdHJpbmd9PihcImRlc2lnbmVyLnVwZGF0ZVNuYXBzaG90XCIpLFxyXG4gICAgICAgIHRvZ2dsZUhlbHA6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci50b2dnbGVIZWxwXCIpLFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBza2V0Y2ggPSB7XHJcbiAgICAgICAgY3JlYXRlOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmNyZWF0ZVwiKSxcclxuICAgICAgICBjbG9uZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5jbG9uZVwiKSxcclxuICAgICAgICBhdHRyVXBkYXRlOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmF0dHJVcGRhdGVcIiksXHJcbiAgICAgICAgc2V0U2VsZWN0aW9uOiB0aGlzLnRvcGljPFdvcmtzcGFjZU9iamVjdFJlZj4oXCJza2V0Y2guc2V0U2VsZWN0aW9uXCIpLFxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGV4dEJsb2NrID0ge1xyXG4gICAgICAgIGFkZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFkZFwiKSxcclxuICAgICAgICB1cGRhdGVBdHRyOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sudXBkYXRlQXR0clwiKSxcclxuICAgICAgICB1cGRhdGVBcnJhbmdlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sudXBkYXRlQXJyYW5nZVwiKSxcclxuICAgICAgICByZW1vdmU6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5yZW1vdmVcIilcclxuICAgIH07XHJcbiAgICBcclxufVxyXG5cclxuY2xhc3MgRXZlbnRzIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWwge1xyXG4gICAgXHJcbiAgICBhcHAgPSB7XHJcbiAgICAgICAgcmVzb3VyY2VzUmVhZHk6IHRoaXMudG9waWM8Ym9vbGVhbj4oXCJhcHAucmVzb3VyY2VzUmVhZHlcIiksXHJcbiAgICAgICAgd29ya3NwYWNlSW5pdGlhbGl6ZWQ6IHRoaXMudG9waWM8U2tldGNoPihcImFwcC53b3Jrc3BhY2VJbml0aWFsaXplZFwiKSxcclxuICAgICAgICBmb250TG9hZGVkOiB0aGlzLnRvcGljPG9wZW50eXBlLkZvbnQ+KFwiYXBwLmZvbnRMb2FkZWRcIilcclxuICAgIH1cclxuICAgIFxyXG4gICAgZGVzaWduZXIgPSB7XHJcbiAgICAgICAgem9vbVRvRml0UmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkXCIpLFxyXG4gICAgICAgIGV4cG9ydFBOR1JlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydFBOR1JlcXVlc3RlZFwiKSxcclxuICAgICAgICBleHBvcnRTVkdSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRTVkdSZXF1ZXN0ZWRcIiksXHJcbiAgICAgICAgdmlld0NoYW5nZWQ6IHRoaXMudG9waWM8cGFwZXIuUmVjdGFuZ2xlPihcImRlc2lnbmVyLnZpZXdDaGFuZ2VkXCIpLFxyXG4gICAgICAgIHNuYXBzaG90RXhwaXJlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwiZGVzaWduZXIuc25hcHNob3RFeHBpcmVkXCIpLFxyXG4gICAgICAgIHVzZXJNZXNzYWdlQ2hhbmdlZDogdGhpcy50b3BpYzxzdHJpbmc+KFwiZGVzaWduZXIudXNlck1lc3NhZ2VDaGFuZ2VkXCIpLFxyXG4gICAgICAgIHNob3dIZWxwQ2hhbmdlZDogdGhpcy50b3BpYzxib29sZWFuPihcImRlc2lnbmVyLnNob3dIZWxwQ2hhbmdlZFwiKVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgc2tldGNoID0ge1xyXG4gICAgICAgIGxvYWRlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmxvYWRlZFwiKSxcclxuICAgICAgICBhdHRyQ2hhbmdlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmF0dHJDaGFuZ2VkXCIpLFxyXG4gICAgICAgIGNvbnRlbnRDaGFuZ2VkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2guY29udGVudENoYW5nZWRcIiksXHJcbiAgICAgICAgZWRpdGluZ0l0ZW1DaGFuZ2VkOiB0aGlzLnRvcGljPFBvc2l0aW9uZWRPYmplY3RSZWY+KFwic2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZFwiKSxcclxuICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkOiB0aGlzLnRvcGljPFdvcmtzcGFjZU9iamVjdFJlZj4oXCJza2V0Y2guc2VsZWN0aW9uQ2hhbmdlZFwiKSxcclxuICAgICAgICBzYXZlTG9jYWxSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJza2V0Y2guc2F2ZWxvY2FsLnNhdmVMb2NhbFJlcXVlc3RlZFwiKVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGV4dGJsb2NrID0ge1xyXG4gICAgICAgIGFkZGVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYWRkZWRcIiksXHJcbiAgICAgICAgYXR0ckNoYW5nZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hdHRyQ2hhbmdlZFwiKSxcclxuICAgICAgICBmb250UmVhZHk6IHRoaXMudG9waWM8e3RleHRCbG9ja0lkOiBzdHJpbmcsIGZvbnQ6IG9wZW50eXBlLkZvbnR9PihcInRleHRibG9jay5mb250UmVhZHlcIiksXHJcbiAgICAgICAgYXJyYW5nZUNoYW5nZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hcnJhbmdlQ2hhbmdlZFwiKSxcclxuICAgICAgICByZW1vdmVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sucmVtb3ZlZFwiKSxcclxuICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5sb2FkZWRcIiksXHJcbiAgICAgICAgZWRpdG9yQ2xvc2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suZWRpdG9yQ2xvc2VkXCIpLFxyXG4gICAgfTtcclxuICAgIFxyXG59XHJcblxyXG5jbGFzcyBDaGFubmVscyB7XHJcbiAgICBhY3Rpb25zOiBBY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgIGV2ZW50czogRXZlbnRzID0gbmV3IEV2ZW50cygpO1xyXG59XHJcbiIsIlxyXG50eXBlIEFjdGlvblR5cGVzID0gXHJcbiAgICBcInNrZXRjaC5jcmVhdGVcIlxyXG4gICAgfCBcInNrZXRjaC51cGRhdGVcIlxyXG4gICAgfCBcInRleHRibG9jay5hZGRcIlxyXG4gICAgfCBcInRleHRibG9jay51cGRhdGVcIjtcclxuXHJcbnR5cGUgRXZlbnRUeXBlcyA9XHJcbiAgICBcInNrZXRjaC5sb2FkZWRcIlxyXG4gICAgfCBcInNrZXRjaC5jaGFuZ2VkXCJcclxuICAgIHwgXCJ0ZXh0YmxvY2suYWRkZWRcIlxyXG4gICAgfCBcInRleHRibG9jay5jaGFuZ2VkXCI7XHJcbiIsIlxyXG5jb25zdCBTa2V0Y2hIZWxwZXJzID0ge1xyXG4gICAgXHJcbiAgICBjb2xvcnNJblVzZShza2V0Y2g6IFNrZXRjaCk6IHN0cmluZ1tdIHtcclxuICAgICAgICBsZXQgY29sb3JzID0gWyBza2V0Y2guYmFja2dyb3VuZENvbG9yIF07XHJcbiAgICAgICAgZm9yKGNvbnN0IGJsb2NrIG9mIHNrZXRjaC50ZXh0QmxvY2tzKXtcclxuICAgICAgICAgICAgY29sb3JzLnB1c2goYmxvY2suYmFja2dyb3VuZENvbG9yKTtcclxuICAgICAgICAgICAgY29sb3JzLnB1c2goYmxvY2sudGV4dENvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29sb3JzID0gXy51bmlxKGNvbG9ycy5maWx0ZXIoYyA9PiBjICE9IG51bGwpKTtcclxuICAgICAgICBjb2xvcnMuc29ydCgpO1xyXG4gICAgICAgIHJldHVybiBjb2xvcnM7XHJcbiAgICB9XHJcbiAgICBcclxufSIsIlxyXG5pbnRlcmZhY2UgQXBwU3RhdGUge1xyXG4gICAgYnJvd3NlcklkPzogc3RyaW5nO1xyXG4gICAgZWRpdGluZ0l0ZW0/OiBQb3NpdGlvbmVkT2JqZWN0UmVmO1xyXG4gICAgc2VsZWN0aW9uPzogV29ya3NwYWNlT2JqZWN0UmVmO1xyXG4gICAgbG9hZGluZ1NrZXRjaD86IGJvb2xlYW47XHJcbiAgICB1c2VyTWVzc2FnZT86IHN0cmluZztcclxuICAgIHNrZXRjaD86IFNrZXRjaDtcclxuICAgIHNob3dIZWxwPzogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFNrZXRjaCBleHRlbmRzIFNrZXRjaEF0dHIge1xyXG4gICAgX2lkOiBzdHJpbmc7XHJcbiAgICBicm93c2VySWQ/OiBzdHJpbmc7XHJcbiAgICB0ZXh0QmxvY2tzPzogVGV4dEJsb2NrW107XHJcbn1cclxuXHJcbmludGVyZmFjZSBTa2V0Y2hBdHRyIHtcclxuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIGRlZmF1bHRUZXh0QmxvY2tBdHRyPzogVGV4dEJsb2NrO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRm9udEZhbWlseSB7XHJcbiAgICBraW5kPzogc3RyaW5nO1xyXG4gICAgZmFtaWx5Pzogc3RyaW5nO1xyXG4gICAgY2F0ZWdvcnk/OiBzdHJpbmc7XHJcbiAgICB2YXJpYW50cz86IHN0cmluZ1tdO1xyXG4gICAgc3Vic2V0cz86IHN0cmluZ1tdO1xyXG4gICAgdmVyc2lvbj86IHN0cmluZztcclxuICAgIGxhc3RNb2RpZmllZD86IHN0cmluZztcclxuICAgIGZpbGVzPzogeyBbdmFyaWFudDogc3RyaW5nXSA6IHN0cmluZzsgfTtcclxufVxyXG5cclxuaW50ZXJmYWNlIEZvbnREZXNjcmlwdGlvbiB7XHJcbiAgICBmYW1pbHk6IHN0cmluZztcclxuICAgIGNhdGVnb3J5OiBzdHJpbmc7XHJcbiAgICB2YXJpYW50OiBzdHJpbmc7XHJcbiAgICB1cmw6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFdvcmtzcGFjZU9iamVjdFJlZiB7XHJcbiAgICBpdGVtSWQ6IHN0cmluZztcclxuICAgIGl0ZW1UeXBlPzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUG9zaXRpb25lZE9iamVjdFJlZiBleHRlbmRzIFdvcmtzcGFjZU9iamVjdFJlZiB7XHJcbiAgICBjbGllbnRYPzogbnVtYmVyO1xyXG4gICAgY2xpZW50WT86IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFRleHRCbG9jayBleHRlbmRzIEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgX2lkPzogc3RyaW5nO1xyXG4gICAgdGV4dD86IHN0cmluZztcclxuICAgIHRleHRDb2xvcj86IHN0cmluZztcclxuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIGZvbnRGYW1pbHk/OiBzdHJpbmc7XHJcbiAgICBmb250VmFyaWFudD86IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgcG9zaXRpb24/OiBudW1iZXJbXSxcclxuICAgIG91dGxpbmU/OiB7XHJcbiAgICAgICAgdG9wOiBQYXRoUmVjb3JkLFxyXG4gICAgICAgIGJvdHRvbTogUGF0aFJlY29yZFxyXG4gICAgfSAgICBcclxufVxyXG5cclxuaW50ZXJmYWNlIEJhY2tncm91bmRBY3Rpb25TdGF0dXMge1xyXG4gICAgYWN0aW9uPzogT2JqZWN0O1xyXG4gICAgcmVqZWN0ZWQ/OiBib29sZWFuO1xyXG4gICAgZXJyb3I/OiBib29sZWFuXHJcbiAgICBtZXNzYWdlPzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUGF0aFJlY29yZCB7XHJcbiAgICBzZWdtZW50czogU2VnbWVudFJlY29yZFtdO1xyXG59XHJcblxyXG4vKipcclxuICogU2luZ2xlLXBvaW50IHNlZ21lbnRzIGFyZSBzdG9yZWQgYXMgbnVtYmVyWzJdXHJcbiAqL1xyXG50eXBlIFNlZ21lbnRSZWNvcmQgPSBBcnJheTxQb2ludFJlY29yZD4gfCBBcnJheTxudW1iZXI+O1xyXG5cclxudHlwZSBQb2ludFJlY29yZCA9IEFycmF5PG51bWJlcj47XHJcbiIsIlxyXG5jbGFzcyBGb250RmFtaWxpZXMge1xyXG5cclxuICAgIHN0YXRpYyBDQVRBTE9HX0xJTUlUID0gMTUwO1xyXG5cclxuICAgIHB1YmxpYyBjYXRhbG9nOiBGb250RmFtaWx5W10gPSBbXTtcclxuXHJcbiAgICBnZXQoZmFtaWx5OiBzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBfLmZpbmQodGhpcy5jYXRhbG9nLCBmZiA9PiBmZi5mYW1pbHkgPT09IGZhbWlseSk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBnZXRVcmwoZmFtaWx5OiBzdHJpbmcsIHZhcmlhbnQ6IHN0cmluZyl7XHJcbiAgICAgICAgY29uc3QgZmFtRGVmID0gdGhpcy5nZXQoZmFtaWx5KTtcclxuICAgICAgICBpZighZmFtRGVmKXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwibm8gZGVmaW5pdGlvbiBhdmFpbGFibGUgZm9yIGZhbWlseVwiLCBmYW1pbHkpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZpbGUgPSBmYW1EZWYuZmlsZXNbdmFyaWFudF07XHJcbiAgICAgICAgaWYoIWZpbGUpe1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJubyBmb250IGZpbGUgYXZhaWxhYmxlIGZvciB2YXJpYW50XCIsIGZhbWlseSwgdmFyaWFudCk7XHJcbiAgICAgICAgICAgIGZpbGUgPSBmYW1EZWYuZmlsZXNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmaWxlO1xyXG4gICAgfVxyXG5cclxuICAgIGRlZmF1bHRWYXJpYW50KGZhbURlZjogRm9udEZhbWlseSk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYoIWZhbURlZikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYoZmFtRGVmLnZhcmlhbnRzLmluZGV4T2YoXCJyZWd1bGFyXCIpID49IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwicmVndWxhclwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFtRGVmLnZhcmlhbnRzWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRDYXRhbG9nTG9jYWwoY2FsbGJhY2s6IChmYW1pbGllczogRm9udEZhbWlseVtdKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiBcImZvbnRzL2dvb2dsZS1mb250cy5qc29uXCIsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2U6IHsga2luZDogc3RyaW5nLCBpdGVtczogRm9udEZhbWlseVtdIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyZWRJdGVtcyA9IHJlc3BvbnNlLml0ZW1zLnNsaWNlKDAsIEZvbnRGYW1pbGllcy5DQVRBTE9HX0xJTUlUKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gbWFrZSBmaWxlcyBodHRzXHJcbiAgICAgICAgICAgICAgICBmb3IoY29uc3QgZmFtIG9mIGZpbHRlcmVkSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmZvck93bihmYW0uZmlsZXMsICh2YWw6IHN0cmluZywga2V5OnN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihfLnN0YXJ0c1dpdGgodmFsLCBcImh0dHA6XCIpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbS5maWxlc1trZXldID0gdmFsLnJlcGxhY2UoXCJodHRwOlwiLCBcImh0dHBzOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhdGFsb2cgPSBmaWx0ZXJlZEl0ZW1zO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpcy5jYXRhbG9nKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6ICh4aHIsIHN0YXR1cywgZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZ29vZ2xlLWZvbnRzLmpzb25cIiwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBsb2FkQ2F0YWxvZ1JlbW90ZShjYWxsYmFjazogKGZhbWlsaWVzOiBGb250RmFtaWx5W10pID0+IHZvaWQpIHtcclxuICAgIC8vICAgICB2YXIgdXJsID0gJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3dlYmZvbnRzL3YxL3dlYmZvbnRzPyc7XHJcbiAgICAvLyAgICAgdmFyIGtleSA9ICdrZXk9R09PR0xFLUFQSS1LRVknO1xyXG4gICAgLy8gICAgIHZhciBzb3J0ID0gXCJwb3B1bGFyaXR5XCI7XHJcbiAgICAvLyAgICAgdmFyIG9wdCA9ICdzb3J0PScgKyBzb3J0ICsgJyYnO1xyXG4gICAgLy8gICAgIHZhciByZXEgPSB1cmwgKyBvcHQgKyBrZXk7XHJcblxyXG4gICAgLy8gICAgICQuYWpheCh7XHJcbiAgICAvLyAgICAgICAgIHVybDogcmVxLFxyXG4gICAgLy8gICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgLy8gICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgIC8vICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlOiB7IGtpbmQ6IHN0cmluZywgaXRlbXM6IEZvbnRGYW1pbHlbXSB9KSA9PiB7XHJcbiAgICAvLyAgICAgICAgICAgICBjYWxsYmFjayhyZXNwb25zZS5pdGVtcyk7XHJcbiAgICAvLyAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgIGVycm9yOiAoeGhyLCBzdGF0dXMsIGVycikgPT4ge1xyXG4gICAgLy8gICAgICAgICAgICAgY29uc29sZS5lcnJvcih1cmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3IgYSBsaXN0IG9mIGZhbWlsaWVzLCBsb2FkIGFscGhhbnVtZXJpYyBjaGFycyBpbnRvIGJyb3dzZXJcclxuICAgICAqICAgdG8gc3VwcG9ydCBwcmV2aWV3aW5nLlxyXG4gICAgICovXHJcbiAgICBsb2FkUHJldmlld1N1YnNldHMoZmFtaWxpZXM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaHVuayBvZiBfLmNodW5rKGZhbWlsaWVzLCAxMCkpIHtcclxuICAgICAgICAgICAgV2ViRm9udC5sb2FkKHtcclxuICAgICAgICAgICAgICAgIGNsYXNzZXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZ29vZ2xlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmFtaWxpZXM6IDxzdHJpbmdbXT5jaHVuayxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbnR5cGUgUGFyc2VkRm9udExvYWRlZCA9ICh1cmw6IHN0cmluZywgZm9udDogb3BlbnR5cGUuRm9udCkgPT4gdm9pZDsgXHJcblxyXG5jbGFzcyBQYXJzZWRGb250cyB7XHJcblxyXG4gICAgZm9udHM6IHsgW3VybDogc3RyaW5nXTogb3BlbnR5cGUuRm9udDsgfSA9IHt9O1xyXG5cclxuICAgIHByaXZhdGUgX2ZvbnRMb2FkZWQ6IFBhcnNlZEZvbnRMb2FkZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZm9udExvYWRlZDogUGFyc2VkRm9udExvYWRlZCl7XHJcbiAgICAgICAgdGhpcy5fZm9udExvYWRlZCA9IGZvbnRMb2FkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGZvbnRVcmw6IHN0cmluZywgb25SZWFkeTogUGFyc2VkRm9udExvYWRlZCA9IG51bGwpIHtcclxuICAgICAgICBpZighZm9udFVybCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGZvbnQgPSB0aGlzLmZvbnRzW2ZvbnRVcmxdO1xyXG5cclxuICAgICAgICBpZiAoZm9udCkge1xyXG4gICAgICAgICAgICBvblJlYWR5ICYmIG9uUmVhZHkoZm9udFVybCwgZm9udCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9wZW50eXBlLmxvYWQoZm9udFVybCwgKGVyciwgZm9udCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVyciwge2ZvbnRVcmx9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9udHNbZm9udFVybF0gPSBmb250O1xyXG4gICAgICAgICAgICAgICAgb25SZWFkeSAmJiBvblJlYWR5KGZvbnRVcmwsIGZvbnQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udExvYWRlZChmb250VXJsLCBmb250KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiXHJcbm5hbWVzcGFjZSBTM0FjY2VzcyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGxvYWQgZmlsZSB0byBhcHBsaWNhdGlvbiBTMyBidWNrZXRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHB1dEZpbGUoZmlsZU5hbWU6IHN0cmluZywgZmlsZVR5cGU6IHN0cmluZywgZGF0YTogQmxvYiB8IHN0cmluZykge1xyXG5cclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMvaXNzdWVzLzE5MCAgIFxyXG4gICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9GaXJlZm94LykgJiYgIWZpbGVUeXBlLm1hdGNoKC87LykpIHtcclxuICAgICAgICAgICAgdmFyIGNoYXJzZXQgPSAnOyBjaGFyc2V0PVVURi04JztcclxuICAgICAgICAgICAgZmlsZVR5cGUgKz0gY2hhcnNldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNpZ25VcmwgPSBgL2FwaS9zdG9yYWdlL2FjY2Vzcz9maWxlTmFtZT0ke2ZpbGVOYW1lfSZmaWxlVHlwZT0ke2ZpbGVUeXBlfWA7XHJcbiAgICAgICAgLy8gZ2V0IHNpZ25lZCBVUkxcclxuICAgICAgICAkLmdldEpTT04oc2lnblVybClcclxuICAgICAgICAgICAgLmRvbmUoc2lnblJlc3BvbnNlID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBQVVQgZmlsZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcHV0UmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogc2lnblJlc3BvbnNlLnNpZ25lZFJlcXVlc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIngtYW16LWFjbFwiOiBcInB1YmxpYy1yZWFkXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmaWxlVHlwZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmFqYXgocHV0UmVxdWVzdClcclxuICAgICAgICAgICAgICAgICAgICAuZG9uZShwdXRSZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBsb2FkZWQgZmlsZVwiLCBzaWduUmVzcG9uc2UudXJsKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmZhaWwoZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIHVwbG9hZGluZyB0byBTM1wiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciBvbiAvYXBpL3N0b3JhZ2UvYWNjZXNzXCIsIGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRG93bmxvYWQgZmlsZSBmcm9tIGJ1Y2tldFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0RmlsZShmaWxlTmFtZTogc3RyaW5nKTogSlF1ZXJ5UHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiBgL2FwaS9zdG9yYWdlL3VybD9maWxlTmFtZT0ke2ZpbGVOYW1lfWAsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlXHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb3dubG9hZGluZ1wiLCByZXNwb25zZS51cmwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiByZXNwb25zZS51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBDb2xvclBpY2tlciB7XHJcblxyXG4gICAgY29uc3QgREVGQVVMVF9QQUxFVFRFX0dST1VQUyA9IFtcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzgwN1xyXG4gICAgICAgICAgICBcIiNlZTQwMzVcIixcclxuICAgICAgICAgICAgXCIjZjM3NzM2XCIsXHJcbiAgICAgICAgICAgIFwiI2ZkZjQ5OFwiLFxyXG4gICAgICAgICAgICBcIiM3YmMwNDNcIixcclxuICAgICAgICAgICAgXCIjMDM5MmNmXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzg5NFxyXG4gICAgICAgICAgICBcIiNlZGM5NTFcIixcclxuICAgICAgICAgICAgXCIjZWI2ODQxXCIsXHJcbiAgICAgICAgICAgIFwiI2NjMmEzNlwiLFxyXG4gICAgICAgICAgICBcIiM0ZjM3MmRcIixcclxuICAgICAgICAgICAgXCIjMDBhMGIwXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzE2NFxyXG4gICAgICAgICAgICBcIiMxYjg1YjhcIixcclxuICAgICAgICAgICAgXCIjNWE1MjU1XCIsXHJcbiAgICAgICAgICAgIFwiIzU1OWU4M1wiLFxyXG4gICAgICAgICAgICBcIiNhZTVhNDFcIixcclxuICAgICAgICAgICAgXCIjYzNjYjcxXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzM4OVxyXG4gICAgICAgICAgICBcIiM0YjM4MzJcIixcclxuICAgICAgICAgICAgXCIjODU0NDQyXCIsXHJcbiAgICAgICAgICAgIFwiI2ZmZjRlNlwiLFxyXG4gICAgICAgICAgICBcIiMzYzJmMmZcIixcclxuICAgICAgICAgICAgXCIjYmU5YjdiXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzQ1NVxyXG4gICAgICAgICAgICBcIiNmZjRlNTBcIixcclxuICAgICAgICAgICAgXCIjZmM5MTNhXCIsXHJcbiAgICAgICAgICAgIFwiI2Y5ZDYyZVwiLFxyXG4gICAgICAgICAgICBcIiNlYWUzNzRcIixcclxuICAgICAgICAgICAgXCIjZTJmNGM3XCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzcwMFxyXG4gICAgICAgICAgICBcIiNkMTExNDFcIixcclxuICAgICAgICAgICAgXCIjMDBiMTU5XCIsXHJcbiAgICAgICAgICAgIFwiIzAwYWVkYlwiLFxyXG4gICAgICAgICAgICBcIiNmMzc3MzVcIixcclxuICAgICAgICAgICAgXCIjZmZjNDI1XCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzgyNlxyXG4gICAgICAgICAgICBcIiNlOGQxNzRcIixcclxuICAgICAgICAgICAgXCIjZTM5ZTU0XCIsXHJcbiAgICAgICAgICAgIFwiI2Q2NGQ0ZFwiLFxyXG4gICAgICAgICAgICBcIiM0ZDczNThcIixcclxuICAgICAgICAgICAgXCIjOWVkNjcwXCIsXHJcbiAgICAgICAgXSxcclxuICAgIF07XHJcblxyXG4gICAgY29uc3QgTU9OT19QQUxFVFRFID0gW1wiIzAwMFwiLFwiIzQ0NFwiLFwiIzY2NlwiLFwiIzk5OVwiLFwiI2NjY1wiLFwiI2VlZVwiLFwiI2YzZjNmM1wiLFwiI2ZmZlwiXTtcclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gc2V0dXAoZWxlbSwgZmVhdHVyZWRDb2xvcnM6IHN0cmluZ1tdLCBvbkNoYW5nZSkge1xyXG4gICAgICAgIGNvbnN0IGZlYXR1cmVkR3JvdXBzID0gXy5jaHVuayhmZWF0dXJlZENvbG9ycywgNSk7XHJcblxyXG4gICAgICAgIC8vIGZvciBlYWNoIHBhbGV0dGUgZ3JvdXBcclxuICAgICAgICBjb25zdCBkZWZhdWx0UGFsZXR0ZUdyb3VwcyA9IERFRkFVTFRfUEFMRVRURV9HUk9VUFMubWFwKGdyb3VwID0+IHtcclxuICAgICAgICAgICAgbGV0IHBhcnNlZEdyb3VwID0gZ3JvdXAubWFwKGMgPT4gbmV3IHBhcGVyLkNvbG9yKGMpKTtcclxuICAgICAgICAgICAgLy8gY3JlYXRlIGxpZ2h0IHZhcmlhbnRzIG9mIGRhcmtlc3QgdGhyZWVcclxuICAgICAgICAgICAgY29uc3QgYWRkQ29sb3JzID0gXy5zb3J0QnkocGFyc2VkR3JvdXAsIGMgPT4gYy5saWdodG5lc3MpXHJcbiAgICAgICAgICAgICAgICAuc2xpY2UoMCwgMylcclxuICAgICAgICAgICAgICAgIC5tYXAoYyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYzIgPSBjLmNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYzIubGlnaHRuZXNzID0gMC44NTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYzI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcGFyc2VkR3JvdXAgPSBwYXJzZWRHcm91cC5jb25jYXQoYWRkQ29sb3JzKTtcclxuICAgICAgICAgICAgcGFyc2VkR3JvdXAgPSBfLnNvcnRCeShwYXJzZWRHcm91cCwgYyA9PiBjLmxpZ2h0bmVzcyk7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZWRHcm91cC5tYXAoYyA9PiBjLnRvQ1NTKHRydWUpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgcGFsZXR0ZSA9IGZlYXR1cmVkR3JvdXBzLmNvbmNhdChkZWZhdWx0UGFsZXR0ZUdyb3Vwcyk7XHJcbiAgICAgICAgcGFsZXR0ZS5wdXNoKE1PTk9fUEFMRVRURSk7XHJcblxyXG4gICAgICAgIGxldCBzZWwgPSA8YW55PiQoZWxlbSk7XHJcbiAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oe1xyXG4gICAgICAgICAgICBzaG93SW5wdXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGFsbG93RW1wdHk6IHRydWUsXHJcbiAgICAgICAgICAgIHByZWZlcnJlZEZvcm1hdDogXCJoZXhcIixcclxuICAgICAgICAgICAgc2hvd0J1dHRvbnM6IGZhbHNlLFxyXG4gICAgICAgICAgICBzaG93QWxwaGE6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dQYWxldHRlOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93U2VsZWN0aW9uUGFsZXR0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHBhbGV0dGU6IHBhbGV0dGUsXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZUtleTogXCJza2V0Y2h0ZXh0XCIsXHJcbiAgICAgICAgICAgIGNoYW5nZTogb25DaGFuZ2VcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHNldChlbGVtOiBIVE1MRWxlbWVudCwgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICg8YW55PiQoZWxlbSkpLnNwZWN0cnVtKFwic2V0XCIsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGVzdHJveShlbGVtKSB7XHJcbiAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oXCJkZXN0cm95XCIpO1xyXG4gICAgfVxyXG59XHJcbiIsImludGVyZmFjZSBKUXVlcnkge1xyXG4gICAgc2VsZWN0cGlja2VyKC4uLmFyZ3M6IGFueVtdKTtcclxuICAgIC8vcmVwbGFjZU9wdGlvbnMob3B0aW9uczogQXJyYXk8e3ZhbHVlOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmd9Pik7XHJcbn1cclxuXHJcbmNsYXNzIEZvbnRQaWNrZXIge1xyXG5cclxuICAgIGRlZmF1bHRGb250RmFtaWx5ID0gXCJSb2JvdG9cIjtcclxuICAgIHByZXZpZXdGb250U2l6ZSA9IFwiMjhweFwiO1xyXG5cclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSwgYmxvY2s6IFRleHRCbG9jaykge1xyXG4gICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICBjb25zdCBkb20kID0gUnguT2JzZXJ2YWJsZS5qdXN0KGJsb2NrKVxyXG4gICAgICAgICAgICAubWVyZ2UoXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKG0gPT4gbS5kYXRhLl9pZCA9PT0gYmxvY2suX2lkKVxyXG4gICAgICAgICAgICAgICAgLm1hcChtID0+IG0uZGF0YSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAubWFwKHRiID0+IHRoaXMucmVuZGVyKHRiKSk7XHJcbiAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKGRvbSQsIGNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKGJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XHJcbiAgICAgICAgbGV0IHVwZGF0ZSA9IHBhdGNoID0+IHtcclxuICAgICAgICAgICAgcGF0Y2guX2lkID0gYmxvY2suX2lkO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUF0dHIuZGlzcGF0Y2gocGF0Y2gpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgZWxlbWVudHM6IFZOb2RlW10gPSBbXTtcclxuICAgICAgICBlbGVtZW50cy5wdXNoKFxyXG4gICAgICAgICAgICBoKFwic2VsZWN0XCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiBcInNlbGVjdFBpY2tlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZmFtaWx5LXBpY2tlclwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IHZub2RlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZXYgPT4gdXBkYXRlKHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBldi50YXJnZXQudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogdGhpcy5zdG9yZS5yZXNvdXJjZXMuZm9udEZhbWlsaWVzLmRlZmF1bHRWYXJpYW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUucmVzb3VyY2VzLmZvbnRGYW1pbGllcy5nZXQoZXYudGFyZ2V0LnZhbHVlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5yZXNvdXJjZXMuZm9udEZhbWlsaWVzLmNhdGFsb2dcclxuICAgICAgICAgICAgICAgICAgICAubWFwKChmZjogRm9udEZhbWlseSkgPT4gaChcIm9wdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkOiBmZi5mYW1pbHkgPT09IGJsb2NrLmZvbnRGYW1pbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWNvbnRlbnRcIjogYDxzcGFuIHN0eWxlPVwiJHtGb250SGVscGVycy5nZXRTdHlsZVN0cmluZyhmZi5mYW1pbHksIG51bGwsIHRoaXMucHJldmlld0ZvbnRTaXplKX1cIj4ke2ZmLmZhbWlseX08L3NwYW4+YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW2ZmLmZhbWlseV0pXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZEZhbWlseSA9IHRoaXMuc3RvcmUucmVzb3VyY2VzLmZvbnRGYW1pbGllcy5nZXQoYmxvY2suZm9udEZhbWlseSk7XHJcbiAgICAgICAgaWYgKHNlbGVjdGVkRmFtaWx5ICYmIHNlbGVjdGVkRmFtaWx5LnZhcmlhbnRzIFxyXG4gICAgICAgICAgICAmJiBzZWxlY3RlZEZhbWlseS52YXJpYW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goaChcInNlbGVjdFwiLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleTogXCJ2YXJpYW50UGlja2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYW50LXBpY2tlclwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IHZub2RlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zdHBhdGNoOiAob2xkVm5vZGUsIHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBROiB3aHkgY2FuJ3Qgd2UganVzdCBkbyBzZWxlY3RwaWNrZXIocmVmcmVzaCkgaGVyZT9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBOiBzZWxlY3RwaWNrZXIgaGFzIG1lbnRhbCBwcm9ibGVtc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoXCJkZXN0cm95XCIpOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHVwZGF0ZSh7IGZvbnRWYXJpYW50OiBldi50YXJnZXQudmFsdWUgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRGYW1pbHkudmFyaWFudHMubWFwKHYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoKFwib3B0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHYgPT09IGJsb2NrLmZvbnRWYXJpYW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS1jb250YWluZXJcIjogXCJib2R5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWNvbnRlbnRcIjogYDxzcGFuIHN0eWxlPVwiJHtGb250SGVscGVycy5nZXRTdHlsZVN0cmluZyhzZWxlY3RlZEZhbWlseS5mYW1pbHksIHYsIHRoaXMucHJldmlld0ZvbnRTaXplKX1cIj4ke3Z9PC9zcGFuPmBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3ZdKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXZcIixcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2xhc3M6IHsgXCJmb250LXBpY2tlclwiOiB0cnVlIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZWxlbWVudHNcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5jbGFzcyBIZWxwRGlhbG9nIHtcclxuXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgY29uc3Qgb3V0ZXIgPSAkKGNvbnRhaW5lcik7XHJcbiAgICAgICAgb3V0ZXIuYXBwZW5kKFwiPGgzPkdldHRpbmcgc3RhcnRlZDwvaDM+XCIpO1xyXG4gICAgICAgIHN0b3JlLnN0YXRlLnNob3dIZWxwID8gb3V0ZXIuc2hvdygpIDogb3V0ZXIuaGlkZSgpO1xyXG4gICAgICAgICQuZ2V0KFwiY29udGVudC9oZWxwLmh0bWxcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICQoZCkuYXBwZW5kVG8ob3V0ZXIpO1xyXG4gICAgICAgICAgICBvdXRlci5hcHBlbmQoXCI8aT5jbGljayB0byBjbG9zZTwvaT5cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb3V0ZXIub24oXCJjbGlja1wiLCBldiA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5kZXNpZ25lci50b2dnbGVIZWxwLmRpc3BhdGNoKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLmRlc2lnbmVyLnNob3dIZWxwQ2hhbmdlZC5zdWJzY3JpYmVEYXRhKHNob3cgPT4ge1xyXG4gICAgICAgICAgICBzaG93ID8gb3V0ZXIuc2hvdygpIDogb3V0ZXIuaGlkZSgpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxufSIsIlxyXG5jbGFzcyBTZWxlY3RlZEl0ZW1FZGl0b3Ige1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xyXG5cclxuICAgICAgICBjb25zdCBkb20kID0gc3RvcmUuZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWQub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgIC5tYXAoaSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwb3NJdGVtID0gPFBvc2l0aW9uZWRPYmplY3RSZWY+aS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBwb3NJdGVtXHJcbiAgICAgICAgICAgICAgICAmJiBwb3NJdGVtLml0ZW1UeXBlID09PSAnVGV4dEJsb2NrJ1xyXG4gICAgICAgICAgICAgICAgJiYgXy5maW5kKHN0b3JlLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLCBcclxuICAgICAgICAgICAgICAgICAgICBiID0+IGIuX2lkID09PSBwb3NJdGVtLml0ZW1JZCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaCgnZGl2I2VkaXRvck92ZXJsYXknLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwibm9uZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0OiBwb3NJdGVtLmNsaWVudFggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvcDogcG9zSXRlbS5jbGllbnRZICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IFRleHRCbG9ja0VkaXRvcihzdG9yZSkucmVuZGVyKGJsb2NrKVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oZG9tJCwgY29udGFpbmVyKTtcclxuXHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFNrZXRjaEVkaXRvciBleHRlbmRzIENvbXBvbmVudDxBcHBTdGF0ZT4ge1xyXG5cclxuICAgIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcblxyXG4gICAgICAgIGNvbnN0IHNrZXRjaERvbSQgPSBzdG9yZS5ldmVudHMubWVyZ2UoXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLFxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkLFxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZGVzaWduZXIudXNlck1lc3NhZ2VDaGFuZ2VkKVxyXG4gICAgICAgICAgICAubWFwKG0gPT4gdGhpcy5yZW5kZXIoc3RvcmUuc3RhdGUpKTtcclxuICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oc2tldGNoRG9tJCwgY29udGFpbmVyKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHN0YXRlOiBBcHBTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHNrZXRjaCA9IHN0YXRlLnNrZXRjaDtcclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXZcIiwgW1xyXG4gICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJBZGQgdGV4dDogXCIpLFxyXG4gICAgICAgICAgICBoKFwiaW5wdXQuYWRkLXRleHRcIiwge1xyXG4gICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBldi50YXJnZXQgJiYgZXYudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay5hZGQuZGlzcGF0Y2goeyB0ZXh0OiB0ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnRhcmdldC52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJQcmVzcyBbRW50ZXJdIHRvIGFkZFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJCYWNrZ3JvdW5kOiBcIiksXHJcbiAgICAgICAgICAgIGgoXCJpbnB1dC5iYWNrZ3JvdW5kLWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBza2V0Y2guYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5hdHRyVXBkYXRlLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlOiAob2xkVm5vZGUsIHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXQodm5vZGUuZWxtLCBza2V0Y2guYmFja2dyb3VuZENvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgIEJvb3RTY3JpcHQuZHJvcGRvd24oe1xyXG4gICAgICAgICAgICAgICAgaWQ6IFwic2tldGNoTWVudVwiLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogXCJBY3Rpb25zXCIsXHJcbiAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJOZXdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDcmVhdGUgbmV3IHNrZXRjaFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5jcmVhdGUuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiWm9vbSB0byBmaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJGaXQgY29udGVudHMgaW4gdmlld1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmRlc2lnbmVyLnpvb21Ub0ZpdC5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJFeHBvcnQgaW1hZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFeHBvcnQgRmlkZGxlIGFzIFBOR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5kZXNpZ25lci5leHBvcnRQTkcuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRXhwb3J0IFNWR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkV4cG9ydCBGaWRkbGUgYXMgdmVjdG9yIGdyYXBoaWNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZGVzaWduZXIuZXhwb3J0U1ZHLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkR1cGxpY2F0ZSBza2V0Y2hcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDb3B5IGNvbnRlbnRzIGludG8gbmV3IHNrZXRjaFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5jbG9uZS5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KSxcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgaChcImRpdiNyaWdodFNpZGVcIixcclxuICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXYjdXNlci1tZXNzYWdlXCIsIHt9LCBbc3RhdGUudXNlck1lc3NhZ2UgfHwgXCJcIl0pLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBoKFwiZGl2I3Nob3ctaGVscC5nbHlwaGljb24uZ2x5cGhpY29uLXF1ZXN0aW9uLXNpZ25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZGVzaWduZXIudG9nZ2xlSGVscC5kaXNwYXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBdKVxyXG5cclxuICAgICAgICBdXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iLCJjbGFzcyBUZXh0QmxvY2tFZGl0b3IgZXh0ZW5kcyBDb21wb25lbnQ8VGV4dEJsb2NrPiB7XHJcbiAgICBzdG9yZTogU3RvcmU7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRleHRCbG9jazogVGV4dEJsb2NrKTogVk5vZGUge1xyXG4gICAgICAgIGxldCB1cGRhdGUgPSB0YiA9PiB7XHJcbiAgICAgICAgICAgIHRiLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXR0ci5kaXNwYXRjaCh0Yik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXYudGV4dC1ibG9jay1lZGl0b3JcIixcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAga2V5OiB0ZXh0QmxvY2suX2lkXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIGgoXCJ0ZXh0YXJlYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2sudGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5cHJlc3M6IChldjogS2V5Ym9hcmRFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKHsgdGV4dDogKDxIVE1MVGV4dEFyZWFFbGVtZW50PmV2LnRhcmdldCkudmFsdWUgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZXYgPT4gdXBkYXRlKHsgdGV4dDogZXYudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5mb3JlXCIsIHt9LCBcIkFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC50ZXh0LWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlRleHQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0Q29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2tldGNoSGVscGVycy5jb2xvcnNJblVzZSh0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgdGV4dENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcImRpdi5mb250LWNvbG9yLWljb24uYmFja1wiLCB7fSwgXCJBXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCYWNrZ3JvdW5kIGNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHVwZGF0ZSh7IGJhY2tncm91bmRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgICAgIGgoXCJidXR0b24uZGVsZXRlLXRleHRibG9jay5idG4uYnRuLWRhbmdlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZS5kaXNwYXRjaCh0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcInNwYW4uZ2x5cGhpY29uLmdseXBoaWNvbi10cmFzaFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImRpdi5mb250LXBpY2tlci1jb250YWluZXJcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBGb250UGlja2VyKHZub2RlLmVsbSwgdGhpcy5zdG9yZSwgdGV4dEJsb2NrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBpbnNlcnQ6ICh2bm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IHByb3BzOiBGb250UGlja2VyUHJvcHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHN0b3JlOiB0aGlzLnN0b3JlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBzZWxlY3Rpb246IHRleHRCbG9jay5mb250RGVzYyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogKGZvbnREZXNjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB1cGRhdGUoeyBmb250RGVzYyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgUmVhY3RET00ucmVuZGVyKHJoKEZvbnRQaWNrZXIsIHByb3BzKSwgdm5vZGUuZWxtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICApLFxyXG5cclxuICAgICAgICAgICAgXSk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmNsYXNzIER1YWxCb3VuZHNQYXRoV2FycCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuXHJcbiAgICBzdGF0aWMgUE9JTlRTX1BFUl9QQVRIID0gMjAwO1xyXG4gICAgc3RhdGljIFVQREFURV9ERUJPVU5DRSA9IDE1MDtcclxuXHJcbiAgICBwcml2YXRlIF9zb3VyY2U6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIHByaXZhdGUgX3VwcGVyOiBTdHJldGNoUGF0aDtcclxuICAgIHByaXZhdGUgX2xvd2VyOiBTdHJldGNoUGF0aDtcclxuICAgIHByaXZhdGUgX3dhcnBlZDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgcHJpdmF0ZSBfb3V0bGluZTogcGFwZXIuUGF0aDtcclxuICAgIHByaXZhdGUgX2N1c3RvbVN0eWxlOiBTa2V0Y2hJdGVtU3R5bGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc291cmNlOiBwYXBlci5Db21wb3VuZFBhdGgsXHJcbiAgICAgICAgYm91bmRzPzogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH0sXHJcbiAgICAgICAgY3VzdG9tU3R5bGU/OiBTa2V0Y2hJdGVtU3R5bGUpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy8gLS0gYnVpbGQgY2hpbGRyZW4gLS1cclxuXHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgaWYgKGJvdW5kcykge1xyXG4gICAgICAgICAgICB0aGlzLl91cHBlciA9IG5ldyBTdHJldGNoUGF0aChib3VuZHMudXBwZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9sb3dlciA9IG5ldyBTdHJldGNoUGF0aChib3VuZHMubG93ZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwcGVyID0gbmV3IFN0cmV0Y2hQYXRoKFtcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMudG9wTGVmdCksXHJcbiAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLnRvcFJpZ2h0KVxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgdGhpcy5fbG93ZXIgPSBuZXcgU3RyZXRjaFBhdGgoW1xyXG4gICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy5ib3R0b21MZWZ0KSxcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMuYm90dG9tUmlnaHQpXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sQm91bmRzT3BhY2l0eSA9IDAuNzU7XHJcblxyXG4gICAgICAgIHRoaXMuX3VwcGVyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG4gICAgICAgIHRoaXMuX2xvd2VyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG5cclxuICAgICAgICB0aGlzLl9vdXRsaW5lID0gbmV3IHBhcGVyLlBhdGgoeyBjbG9zZWQ6IHRydWUgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lU2hhcGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fd2FycGVkID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChzb3VyY2UucGF0aERhdGEpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlV2FycGVkKCk7XHJcblxyXG4gICAgICAgIC8vIC0tIGFkZCBjaGlsZHJlbiAtLVxyXG5cclxuICAgICAgICB0aGlzLmFkZENoaWxkcmVuKFt0aGlzLl9vdXRsaW5lLCB0aGlzLl93YXJwZWQsIHRoaXMuX3VwcGVyLCB0aGlzLl9sb3dlcl0pO1xyXG5cclxuICAgICAgICAvLyAtLSBhc3NpZ24gc3R5bGUgLS1cclxuXHJcbiAgICAgICAgdGhpcy5jdXN0b21TdHlsZSA9IGN1c3RvbVN0eWxlIHx8IHtcclxuICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwibGlnaHRncmF5XCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBQYXBlckhlbHBlcnMuYWRkU21hcnREcmFnKHRoaXMpO1xyXG5cclxuICAgICAgICAvLyAtLSBzZXQgdXAgb2JzZXJ2ZXJzIC0tXHJcblxyXG4gICAgICAgIFJ4Lk9ic2VydmFibGUubWVyZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuX3VwcGVyLnBhdGhDaGFuZ2VkLm9ic2VydmUoKSxcclxuICAgICAgICAgICAgdGhpcy5fbG93ZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpKVxyXG4gICAgICAgICAgICAuZGVib3VuY2UoRHVhbEJvdW5kc1BhdGhXYXJwLlVQREFURV9ERUJPVU5DRSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZShwYXRoID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT3V0bGluZVNoYXBlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlZChQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkdFT01FVFJZKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlKGZsYWdzID0+IHtcclxuICAgICAgICAgICAgaWYgKGZsYWdzICYgUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5BVFRSSUJVVEUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl91cHBlci52aXNpYmxlICE9PSB0aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG93ZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdXBwZXIoKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwcGVyLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvd2VyKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb3dlci5wYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzb3VyY2UodmFsdWU6IHBhcGVyLkNvbXBvdW5kUGF0aCkge1xyXG4gICAgICAgIGlmKHZhbHVlKXtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlICYmIHRoaXMuX3NvdXJjZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlV2FycGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXN0b21TdHlsZSgpOiBTa2V0Y2hJdGVtU3R5bGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXN0b21TdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY3VzdG9tU3R5bGUodmFsdWU6IFNrZXRjaEl0ZW1TdHlsZSkge1xyXG4gICAgICAgIHRoaXMuX2N1c3RvbVN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fd2FycGVkLnN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IHZhbHVlLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNvbnRyb2xCb3VuZHNPcGFjaXR5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl91cHBlci5vcGFjaXR5ID0gdGhpcy5fbG93ZXIub3BhY2l0eSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIG91dGxpbmVDb250YWlucyhwb2ludDogcGFwZXIuUG9pbnQpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vdXRsaW5lLmNvbnRhaW5zKHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVdhcnBlZCgpIHtcclxuICAgICAgICBsZXQgb3J0aE9yaWdpbiA9IHRoaXMuX3NvdXJjZS5ib3VuZHMudG9wTGVmdDtcclxuICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5fc291cmNlLmJvdW5kcy53aWR0aDtcclxuICAgICAgICBsZXQgb3J0aEhlaWdodCA9IHRoaXMuX3NvdXJjZS5ib3VuZHMuaGVpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgcHJvamVjdGlvbiA9IFBhcGVySGVscGVycy5kdWFsQm91bmRzUGF0aFByb2plY3Rpb24oXHJcbiAgICAgICAgICAgIHRoaXMuX3VwcGVyLnBhdGgsIHRoaXMuX2xvd2VyLnBhdGgpO1xyXG4gICAgICAgIGxldCB0cmFuc2Zvcm0gPSBuZXcgUGF0aFRyYW5zZm9ybShwb2ludCA9PiB7XHJcbiAgICAgICAgICAgIGlmICghcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwb2ludDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChvcnRoT3JpZ2luKTtcclxuICAgICAgICAgICAgbGV0IHVuaXQgPSBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS54IC8gb3J0aFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIG9ydGhIZWlnaHQpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdGVkID0gcHJvamVjdGlvbih1bml0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb2plY3RlZDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3UGF0aHMgPSB0aGlzLl9zb3VyY2UuY2hpbGRyZW5cclxuICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSA8cGFwZXIuUGF0aD5pdGVtO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeFBvaW50cyA9IFBhcGVySGVscGVycy50cmFjZVBhdGhBc1BvaW50cyhwYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgIER1YWxCb3VuZHNQYXRoV2FycC5QT0lOVFNfUEVSX1BBVEgpXHJcbiAgICAgICAgICAgICAgICAgICAgLm1hcChwID0+IHRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludChwKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4UGF0aCA9IG5ldyBwYXBlci5QYXRoKHtcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogeFBvaW50cyxcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvL3hQYXRoLnNpbXBsaWZ5KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geFBhdGg7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5fd2FycGVkLnJlbW92ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgdGhpcy5fd2FycGVkLmFkZENoaWxkcmVuKG5ld1BhdGhzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZU91dGxpbmVTaGFwZSgpIHtcclxuICAgICAgICBjb25zdCBsb3dlciA9IG5ldyBwYXBlci5QYXRoKHRoaXMuX2xvd2VyLnBhdGguc2VnbWVudHMpO1xyXG4gICAgICAgIGxvd2VyLnJldmVyc2UoKTtcclxuICAgICAgICB0aGlzLl9vdXRsaW5lLnNlZ21lbnRzID0gdGhpcy5fdXBwZXIucGF0aC5zZWdtZW50cy5jb25jYXQobG93ZXIuc2VnbWVudHMpO1xyXG4gICAgICAgIGxvd2VyLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5jbGFzcyBQYXRoSGFuZGxlIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgIHN0YXRpYyBTRUdNRU5UX01BUktFUl9SQURJVVMgPSAxMDtcclxuICAgIHN0YXRpYyBDVVJWRV9NQVJLRVJfUkFESVVTID0gNjtcclxuICAgIHN0YXRpYyBEUkFHX1RIUkVTSE9MRCA9IDM7XHJcblxyXG4gICAgcHJpdmF0ZSBfbWFya2VyOiBwYXBlci5TaGFwZTtcclxuICAgIHByaXZhdGUgX3NlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XHJcbiAgICBwcml2YXRlIF9jdXJ2ZTogcGFwZXIuQ3VydmU7XHJcbiAgICBwcml2YXRlIF9zbW9vdGhlZDogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX2N1cnZlU3BsaXQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PG51bWJlcj4oKTtcclxuICAgIHByaXZhdGUgX2N1cnZlQ2hhbmdlVW5zdWI6ICgpID0+IHZvaWQ7XHJcbiAgICBwcml2YXRlIGRyYWdnaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGF0dGFjaDogcGFwZXIuU2VnbWVudCB8IHBhcGVyLkN1cnZlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgbGV0IHBvc2l0aW9uOiBwYXBlci5Qb2ludDtcclxuICAgICAgICBsZXQgcGF0aDogcGFwZXIuUGF0aDtcclxuICAgICAgICBpZiAoYXR0YWNoIGluc3RhbmNlb2YgcGFwZXIuU2VnbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gPHBhcGVyLlNlZ21lbnQ+YXR0YWNoO1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuX3NlZ21lbnQucG9pbnQ7XHJcbiAgICAgICAgICAgIHBhdGggPSB0aGlzLl9zZWdtZW50LnBhdGg7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhdHRhY2ggaW5zdGFuY2VvZiBwYXBlci5DdXJ2ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJ2ZSA9IDxwYXBlci5DdXJ2ZT5hdHRhY2g7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fY3VydmUuZ2V0UG9pbnRBdCh0aGlzLl9jdXJ2ZS5sZW5ndGggKiAwLjUpO1xyXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5fY3VydmUucGF0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBcImF0dGFjaCBtdXN0IGJlIFNlZ21lbnQgb3IgQ3VydmVcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21hcmtlciA9IHBhcGVyLlNoYXBlLkNpcmNsZShwb3NpdGlvbiwgUGF0aEhhbmRsZS5TRUdNRU5UX01BUktFUl9SQURJVVMpO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5zdHJva2VDb2xvciA9IFwiYmx1ZVwiO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5maWxsQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgdGhpcy5fbWFya2VyLnNlbGVjdGVkQ29sb3IgPSBuZXcgcGFwZXIuQ29sb3IoMCwgMCk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9tYXJrZXIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlQXNTZWdtZW50KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZUFzQ3VydmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFBhcGVySGVscGVycy5hZGRTbWFydERyYWcodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VydmUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBjdXJ2ZSwgcHVwYXRlIHRvIHNlZ21lbnQgaGFuZGxlXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlQ2hhbmdlVW5zdWIoKTsgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gbmV3IHBhcGVyLlNlZ21lbnQodGhpcy5jZW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VydmVJZHggPSB0aGlzLl9jdXJ2ZS5pbmRleDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlLnBhdGguaW5zZXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlSWR4ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VydmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZUFzU2VnbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJ2ZVNwbGl0Lm5vdGlmeShjdXJ2ZUlkeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLnNtYXJ0RHJhZ01vdmUsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQucG9pbnQgPSB0aGlzLmNlbnRlcjtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zbW9vdGhlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLmNsaWNrV2l0aG91dERyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc21vb3RoZWQgPSAhdGhpcy5zbW9vdGhlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9jdXJ2ZUNoYW5nZVVuc3ViID0gcGF0aC5zdWJzY3JpYmUoZmxhZ3MgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VydmUgJiYgIXRoaXMuX3NlZ21lbnQgXHJcbiAgICAgICAgICAgICAgICAmJiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLlNFR01FTlRTKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNtb290aGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zbW9vdGhlZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc21vb3RoZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9zbW9vdGhlZCA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5oYW5kbGVPdXQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VydmVTcGxpdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY3VydmVTcGxpdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2VudGVyKCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY2VudGVyKHBvaW50OiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb2ludDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0eWxlQXNTZWdtZW50KCkge1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5vcGFjaXR5ID0gMC44O1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5kYXNoQXJyYXkgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5yYWRpdXMgPSBQYXRoSGFuZGxlLlNFR01FTlRfTUFSS0VSX1JBRElVUztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0eWxlQXNDdXJ2ZSgpIHtcclxuICAgICAgICB0aGlzLl9tYXJrZXIub3BhY2l0eSA9IDAuODtcclxuICAgICAgICB0aGlzLl9tYXJrZXIuZGFzaEFycmF5ID0gWzIsIDJdO1xyXG4gICAgICAgIHRoaXMuX21hcmtlci5yYWRpdXMgPSBQYXRoSGFuZGxlLkNVUlZFX01BUktFUl9SQURJVVM7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmNsYXNzIFBhdGhTZWN0aW9uIGltcGxlbWVudHMgcGFwZXIuQ3VydmVsaWtlIHtcclxuICAgIHBhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICBvZmZzZXQ6IG51bWJlcjtcclxuICAgIGxlbmd0aDogbnVtYmVyO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBwYXBlci5QYXRoLCBvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFBvaW50QXQob2Zmc2V0OiBudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhdGguZ2V0UG9pbnRBdChvZmZzZXQgKyB0aGlzLm9mZnNldCk7XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgUGF0aFRyYW5zZm9ybSB7XHJcbiAgICBwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludFRyYW5zZm9ybSA9IHBvaW50VHJhbnNmb3JtO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludFRyYW5zZm9ybShwb2ludCk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aEl0ZW0ocGF0aDogcGFwZXIuUGF0aEl0ZW0pIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1Db21wb3VuZFBhdGgocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUGF0aChwYXRoOiBwYXBlci5QYXRoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiBwYXRoLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBvcmlnUG9pbnQgPSBzZWdtZW50LnBvaW50O1xyXG4gICAgICAgICAgICBsZXQgbmV3UG9pbnQgPSB0aGlzLnRyYW5zZm9ybVBvaW50KHNlZ21lbnQucG9pbnQpO1xyXG4gICAgICAgICAgICBvcmlnUG9pbnQueCA9IG5ld1BvaW50Lng7XHJcbiAgICAgICAgICAgIG9yaWdQb2ludC55ID0gbmV3UG9pbnQueTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuIiwiXHJcbmNsYXNzIFN0cmV0Y2hQYXRoIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgIHByaXZhdGUgX3BhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICBwcml2YXRlIF9wYXRoQ2hhbmdlZCA9IG5ldyBPYnNlcnZhYmxlRXZlbnQ8cGFwZXIuUGF0aD4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzZWdtZW50czogcGFwZXIuU2VnbWVudFtdLCBzdHlsZT86IHBhcGVyLlN0eWxlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcGF0aCA9IG5ldyBwYXBlci5QYXRoKHNlZ21lbnRzKTtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3BhdGgpO1xyXG5cclxuICAgICAgICBpZihzdHlsZSl7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhdGguc3R5bGUgPSBzdHlsZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9wYXRoLnN0cm9rZUNvbG9yID0gXCJsaWdodGdyYXlcIjtcclxuICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHJva2VXaWR0aCA9IDY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihjb25zdCBzIG9mIHRoaXMuX3BhdGguc2VnbWVudHMpe1xyXG4gICAgICAgICAgICB0aGlzLmFkZFNlZ21lbnRIYW5kbGUocyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihjb25zdCBjIG9mIHRoaXMuX3BhdGguY3VydmVzKXtcclxuICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZShjKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBwYXRoKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgcGF0aENoYW5nZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGhDaGFuZ2VkO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGFkZFNlZ21lbnRIYW5kbGUoc2VnbWVudDogcGFwZXIuU2VnbWVudCl7XHJcbiAgICAgICAgdGhpcy5hZGRIYW5kbGUobmV3IFBhdGhIYW5kbGUoc2VnbWVudCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGFkZEN1cnZlSGFuZGxlKGN1cnZlOiBwYXBlci5DdXJ2ZSl7XHJcbiAgICAgICAgbGV0IGhhbmRsZSA9IG5ldyBQYXRoSGFuZGxlKGN1cnZlKTtcclxuICAgICAgICBoYW5kbGUuY3VydmVTcGxpdC5zdWJzY3JpYmVPbmUoY3VydmVJZHggPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKHRoaXMuX3BhdGguY3VydmVzW2N1cnZlSWR4XSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ3VydmVIYW5kbGUodGhpcy5fcGF0aC5jdXJ2ZXNbY3VydmVJZHggKyAxXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hZGRIYW5kbGUoaGFuZGxlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBhZGRIYW5kbGUoaGFuZGxlOiBQYXRoSGFuZGxlKXtcclxuICAgICAgICBoYW5kbGUudmlzaWJsZSA9IHRoaXMudmlzaWJsZTtcclxuICAgICAgICBoYW5kbGUub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdNb3ZlLCBldiA9PiB7XHJcbiAgICAgICAgICAgdGhpcy5fcGF0aENoYW5nZWQubm90aWZ5KHRoaXMuX3BhdGgpOyBcclxuICAgICAgICB9KTtcclxuICAgICAgICBoYW5kbGUub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5jbGlja1dpdGhvdXREcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgdGhpcy5fcGF0aENoYW5nZWQubm90aWZ5KHRoaXMuX3BhdGgpOyBcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoaGFuZGxlKTsgICAgICAgIFxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG4vKipcclxuICogTWVhc3VyZXMgb2Zmc2V0cyBvZiB0ZXh0IGdseXBocy5cclxuICovXHJcbmNsYXNzIFRleHRSdWxlciB7XHJcbiAgICBcclxuICAgIGZvbnRGYW1pbHk6IHN0cmluZztcclxuICAgIGZvbnRXZWlnaHQ6IG51bWJlcjtcclxuICAgIGZvbnRTaXplOiBudW1iZXI7XHJcbiAgICBcclxuICAgIHByaXZhdGUgY3JlYXRlUG9pbnRUZXh0ICh0ZXh0KTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgdmFyIHBvaW50VGV4dCA9IG5ldyBwYXBlci5Qb2ludFRleHQoKTtcclxuICAgICAgICBwb2ludFRleHQuY29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgcG9pbnRUZXh0Lmp1c3RpZmljYXRpb24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgIGlmKHRoaXMuZm9udEZhbWlseSl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250RmFtaWx5ID0gdGhpcy5mb250RmFtaWx5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmZvbnRXZWlnaHQpe1xyXG4gICAgICAgICAgICBwb2ludFRleHQuZm9udFdlaWdodCA9IHRoaXMuZm9udFdlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5mb250U2l6ZSl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250U2l6ZSA9IHRoaXMuZm9udFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBwb2ludFRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGV4dE9mZnNldHModGV4dCl7XHJcbiAgICAgICAgLy8gTWVhc3VyZSBnbHlwaHMgaW4gcGFpcnMgdG8gY2FwdHVyZSB3aGl0ZSBzcGFjZS5cclxuICAgICAgICAvLyBQYWlycyBhcmUgY2hhcmFjdGVycyBpIGFuZCBpKzEuXHJcbiAgICAgICAgdmFyIGdseXBoUGFpcnMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZ2x5cGhQYWlyc1tpXSA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGksIGkrMSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBGb3IgZWFjaCBjaGFyYWN0ZXIsIGZpbmQgY2VudGVyIG9mZnNldC5cclxuICAgICAgICB2YXIgeE9mZnNldHMgPSBbMF07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBNZWFzdXJlIHRocmVlIGNoYXJhY3RlcnMgYXQgYSB0aW1lIHRvIGdldCB0aGUgYXBwcm9wcmlhdGUgXHJcbiAgICAgICAgICAgIC8vICAgc3BhY2UgYmVmb3JlIGFuZCBhZnRlciB0aGUgZ2x5cGguXHJcbiAgICAgICAgICAgIHZhciB0cmlhZFRleHQgPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpIC0gMSwgaSArIDEpKTtcclxuICAgICAgICAgICAgdHJpYWRUZXh0LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gU3VidHJhY3Qgb3V0IGhhbGYgb2YgcHJpb3IgZ2x5cGggcGFpciBcclxuICAgICAgICAgICAgLy8gICBhbmQgaGFsZiBvZiBjdXJyZW50IGdseXBoIHBhaXIuXHJcbiAgICAgICAgICAgIC8vIE11c3QgYmUgcmlnaHQsIGJlY2F1c2UgaXQgd29ya3MuXHJcbiAgICAgICAgICAgIGxldCBvZmZzZXRXaWR0aCA9IHRyaWFkVGV4dC5ib3VuZHMud2lkdGggXHJcbiAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaSAtIDFdLmJvdW5kcy53aWR0aCAvIDIgXHJcbiAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaV0uYm91bmRzLndpZHRoIC8gMjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEFkZCBvZmZzZXQgd2lkdGggdG8gcHJpb3Igb2Zmc2V0LiBcclxuICAgICAgICAgICAgeE9mZnNldHNbaV0gPSB4T2Zmc2V0c1tpIC0gMV0gKyBvZmZzZXRXaWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBnbHlwaFBhaXIgb2YgZ2x5cGhQYWlycyl7XHJcbiAgICAgICAgICAgIGdseXBoUGFpci5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHhPZmZzZXRzO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBUZXh0V2FycCBleHRlbmRzIER1YWxCb3VuZHNQYXRoV2FycCB7XHJcblxyXG4gICAgc3RhdGljIERFRkFVTFRfRk9OVF9TSVpFID0gMTI4O1xyXG5cclxuICAgIHByaXZhdGUgX2ZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICBwcml2YXRlIF90ZXh0OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9mb250U2l6ZTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZvbnQ6IG9wZW50eXBlLkZvbnQsXHJcbiAgICAgICAgdGV4dDogc3RyaW5nLFxyXG4gICAgICAgIGJvdW5kcz86IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9LFxyXG4gICAgICAgIGZvbnRTaXplPzogbnVtYmVyLFxyXG4gICAgICAgIHN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZighZm9udFNpemUpe1xyXG4gICAgICAgICAgICAgICAgZm9udFNpemUgPSBUZXh0V2FycC5ERUZBVUxUX0ZPTlRfU0laRTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBUZXh0V2FycC5nZXRQYXRoRGF0YShmb250LCB0ZXh0LCBmb250U2l6ZSk7IFxyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzdXBlcihwYXRoLCBib3VuZHMsIHN0eWxlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSBmb250O1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0ID0gdGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl90ZXh0ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmb250U2l6ZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IGZvbnRTaXplKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZighdmFsdWUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2ZvbnRTaXplID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmb250KHZhbHVlOiBvcGVudHlwZS5Gb250KXtcclxuICAgICAgICBpZih2YWx1ZSAhPT0gdGhpcy5fZm9udCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVUZXh0UGF0aCgpIHtcclxuICAgICAgICBjb25zdCBwYXRoRGF0YSA9IFRleHRXYXJwLmdldFBhdGhEYXRhKFxyXG4gICAgICAgICAgICB0aGlzLl9mb250LCB0aGlzLl90ZXh0LCB0aGlzLl9mb250U2l6ZSk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRQYXRoRGF0YShmb250OiBvcGVudHlwZS5Gb250LFxyXG4gICAgICAgIHRleHQ6IHN0cmluZywgZm9udFNpemU/OiBzdHJpbmd8bnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgb3BlblR5cGVQYXRoID0gZm9udC5nZXRQYXRoKHRleHQsIDAsIDAsXHJcbiAgICAgICAgICAgIE51bWJlcihmb250U2l6ZSkgfHwgVGV4dFdhcnAuREVGQVVMVF9GT05UX1NJWkUpO1xyXG4gICAgICAgIHJldHVybiBvcGVuVHlwZVBhdGgudG9QYXRoRGF0YSgpO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIFZpZXdab29tIHtcclxuXHJcbiAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgZmFjdG9yID0gMS4yNTtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfbWluWm9vbTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbWF4Wm9vbTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbW91c2VOYXRpdmVTdGFydDogcGFwZXIuUG9pbnQ7XHJcbiAgICBwcml2YXRlIF92aWV3Q2VudGVyU3RhcnQ6IHBhcGVyLlBvaW50O1xyXG4gICAgcHJpdmF0ZSBfdmlld0NoYW5nZWQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlJlY3RhbmdsZT4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9qZWN0OiBwYXBlci5Qcm9qZWN0KSB7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcblxyXG4gICAgICAgICg8YW55PiQodmlldy5lbGVtZW50KSkubW91c2V3aGVlbCgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludChldmVudC5vZmZzZXRYLCBldmVudC5vZmZzZXRZKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2Vab29tQ2VudGVyZWQoZXZlbnQuZGVsdGFZLCBtb3VzZVBvc2l0aW9uKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZGlkRHJhZyA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZpZXcub24oXCJtb3VzZWRyYWdcIiwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZighdGhpcy5fdmlld0NlbnRlclN0YXJ0KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDZW50ZXJTdGFydCA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgLy8gSGF2ZSB0byB1c2UgbmF0aXZlIG1vdXNlIG9mZnNldCwgYmVjYXVzZSBldi5kZWx0YSBcclxuICAgICAgICAgICAgICAgIC8vICBjaGFuZ2VzIGFzIHRoZSB2aWV3IGlzIHNjcm9sbGVkLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG5ldyBwYXBlci5Qb2ludChldi5ldmVudC5vZmZzZXRYLCBldi5ldmVudC5vZmZzZXRZKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3LmVtaXQoUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmF0aXZlRGVsdGEgPSBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgZXYuZXZlbnQub2Zmc2V0WCAtIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQueCxcclxuICAgICAgICAgICAgICAgICAgICBldi5ldmVudC5vZmZzZXRZIC0gdGhpcy5fbW91c2VOYXRpdmVTdGFydC55XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgLy8gTW92ZSBpbnRvIHZpZXcgY29vcmRpbmF0ZXMgdG8gc3VicmFjdCBkZWx0YSxcclxuICAgICAgICAgICAgICAgIC8vICB0aGVuIGJhY2sgaW50byBwcm9qZWN0IGNvb3Jkcy5cclxuICAgICAgICAgICAgICAgIHZpZXcuY2VudGVyID0gdmlldy52aWV3VG9Qcm9qZWN0KCBcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnByb2plY3RUb1ZpZXcodGhpcy5fdmlld0NlbnRlclN0YXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChuYXRpdmVEZWx0YSkpO1xyXG4gICAgICAgICAgICAgICAgdmlldy5lbWl0KFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnTW92ZSwgZXYpO1xyXG4gICAgICAgICAgICAgICAgZGlkRHJhZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB2aWV3Lm9uKFwibW91c2V1cFwiLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX21vdXNlTmF0aXZlU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2VudGVyU3RhcnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmlldy5lbWl0KFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnRW5kLCBldik7XHJcbiAgICAgICAgICAgICAgICBpZihkaWREcmFnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlld0NoYW5nZWQubm90aWZ5KHZpZXcuYm91bmRzKTtcclxuICAgICAgICAgICAgICAgICAgICBkaWREcmFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmlld0NoYW5nZWQoKSA6IE9ic2VydmFibGVFdmVudDxwYXBlci5SZWN0YW5nbGU+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlld0NoYW5nZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHpvb20oKTogbnVtYmVye1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2plY3Qudmlldy56b29tO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB6b29tUmFuZ2UoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Wm9vbVJhbmdlKHJhbmdlOiBwYXBlci5TaXplW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGNvbnN0IGFTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICBjb25zdCBiU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgY29uc3QgYSA9IGFTaXplICYmIE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYVNpemUuaGVpZ2h0LCAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGFTaXplLndpZHRoKTtcclxuICAgICAgICBjb25zdCBiID0gYlNpemUgJiYgTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBiU2l6ZS5oZWlnaHQsICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYlNpemUud2lkdGgpO1xyXG4gICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKGEsYik7XHJcbiAgICAgICAgaWYobWluKXtcclxuICAgICAgICAgICAgdGhpcy5fbWluWm9vbSA9IG1pbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoYSxiKTtcclxuICAgICAgICBpZihtYXgpe1xyXG4gICAgICAgICAgICB0aGlzLl9tYXhab29tID0gbWF4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgfVxyXG5cclxuICAgIHpvb21UbyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpe1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICB2aWV3LmNlbnRlciA9IHJlY3QuY2VudGVyO1xyXG4gICAgICAgIHZpZXcuem9vbSA9IE1hdGgubWluKCBcclxuICAgICAgICAgICAgdmlldy52aWV3U2l6ZS5oZWlnaHQgLyByZWN0LmhlaWdodCwgXHJcbiAgICAgICAgICAgIHZpZXcudmlld1NpemUud2lkdGggLyByZWN0LndpZHRoKTtcclxuICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVpvb21DZW50ZXJlZChkZWx0YTogbnVtYmVyLCBtb3VzZVBvczogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICBpZiAoIWRlbHRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIGNvbnN0IG9sZFpvb20gPSB2aWV3Lnpvb207XHJcbiAgICAgICAgY29uc3Qgb2xkQ2VudGVyID0gdmlldy5jZW50ZXI7XHJcbiAgICAgICAgY29uc3Qgdmlld1BvcyA9IHZpZXcudmlld1RvUHJvamVjdChtb3VzZVBvcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG5ld1pvb20gPSBkZWx0YSA+IDBcclxuICAgICAgICAgICAgPyB2aWV3Lnpvb20gKiB0aGlzLmZhY3RvclxyXG4gICAgICAgICAgICA6IHZpZXcuem9vbSAvIHRoaXMuZmFjdG9yO1xyXG4gICAgICAgIG5ld1pvb20gPSB0aGlzLnNldFpvb21Db25zdHJhaW5lZChuZXdab29tKTtcclxuICAgICAgICBcclxuICAgICAgICBpZighbmV3Wm9vbSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHpvb21TY2FsZSA9IG9sZFpvb20gLyBuZXdab29tO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlckFkanVzdCA9IHZpZXdQb3Muc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuICAgICAgICBjb25zdCBvZmZzZXQgPSB2aWV3UG9zLnN1YnRyYWN0KGNlbnRlckFkanVzdC5tdWx0aXBseSh6b29tU2NhbGUpKVxyXG4gICAgICAgICAgICAuc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuXHJcbiAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LmNlbnRlci5hZGQob2Zmc2V0KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgem9vbSBsZXZlbC5cclxuICAgICAqIEByZXR1cm5zIHpvb20gbGV2ZWwgdGhhdCB3YXMgc2V0LCBvciBudWxsIGlmIGl0IHdhcyBub3QgY2hhbmdlZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNldFpvb21Db25zdHJhaW5lZCh6b29tOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGlmKHRoaXMuX21pblpvb20pIHtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWF4KHpvb20sIHRoaXMuX21pblpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9tYXhab29tKXtcclxuICAgICAgICAgICAgem9vbSA9IE1hdGgubWluKHpvb20sIHRoaXMuX21heFpvb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgaWYoem9vbSAhPSB2aWV3Lnpvb20pe1xyXG4gICAgICAgICAgICB2aWV3Lnpvb20gPSB6b29tO1xyXG4gICAgICAgICAgICByZXR1cm4gem9vbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmludGVyZmFjZSBTa2V0Y2hJdGVtU3R5bGUgZXh0ZW5kcyBwYXBlci5JU3R5bGUge1xyXG4gICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG59XHJcbiIsIlxyXG5QYXBlckhlbHBlcnMuc2hvdWxkTG9nSW5mbyA9IGZhbHNlOyAgICAgICBcclxuXHJcbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcclxuXHJcbi8vIGV2ZW50cy5zdWJzY3JpYmUobSA9PiBjb25zb2xlLmxvZyhcImV2ZW50XCIsIG0udHlwZSwgbS5kYXRhKSk7XHJcbi8vIGFjdGlvbnMuc3Vic2NyaWJlKG0gPT4gY29uc29sZS5sb2coXCJhY3Rpb25cIiwgbS50eXBlLCBtLmRhdGEpKTtcclxuXHJcbmFwcC5zdGFydCgpO1xyXG4iXX0=