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
    function AppController(store, router, sketchEditor, selectedItemEditor) {
        var _this = this;
        this.store = store;
        this.router = router;
        var actions = store.actions, events = store.events;
        events.subscribe(function (m) { return console.log("event", m.type, m.data); });
        actions.subscribe(function (m) { return console.log("action", m.type, m.data); });
        events.app.fontLoaded.observe().first().subscribe(function (m) {
            _this.workspaceController = new WorkspaceController(store, m.data);
            events.app.workspaceInitialized.subscribe(function (m) {
                if (store.state.sketch.textBlocks.length == 0) {
                    actions.textBlock.add.dispatch({ text: "PLAY WITH TYPE" });
                }
            });
            actions.app.initWorkspace.dispatch();
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
            if (state) {
                console.log("router state", state);
            }
        });
    }
    return AppRouter;
}(Router5));
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
            userMessageChanged: this.topic("designer.userMessageChanged")
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
            dataType: "json"
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
                _this.state.sketch.defaultTextBlockAttr = _.clone(block);
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
        }, 3000);
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
    Store.prototype.setSelection = function (item) {
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
        this.state.selection = item;
        this.events.sketch.selectionChanged.dispatch(item);
    };
    Store.prototype.setEditingItem = function (item) {
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
    Store.FALLBACK_FONT_URL = 'fonts/Roboto-500.ttf';
    Store.DEFAULT_FONT_NAME = "Roboto";
    Store.FONT_LIST_LIMIT = 100;
    Store.SKETCH_LOCAL_CACHE_KEY = "fiddlesticks.io.lastSketch";
    Store.LOCAL_CACHE_DELAY_MS = 1000;
    Store.SERVER_SAVE_DELAY_MS = 10000;
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
                h("span#user-message", {}, [state.userMessage || ""])
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
function bootstrap() {
    var router = new AppRouter();
    var store = new Store(router);
    var sketchEditor = new SketchEditor(document.getElementById('designer'), store);
    var selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), store);
    return new AppController(store, router, sketchEditor, selectedItemEditor);
}
PaperHelpers.shouldLogInfo = false;
var app = bootstrap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Eb21IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0ZvbnRIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0hlbHBlcnMudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2NvbGxlY3Rpb25zLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2V2ZW50cy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3BhcGVyL1BhcGVyTm90aWZ5LnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3BhcGVyL3BhcGVyLWV4dC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9wb3N0YWwvVG9waWMudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcG9zdGFsL3Bvc3RhbC1vYnNlcnZlLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3JlYWN0L1JlYWN0SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay92ZG9tL0NvbXBvbmVudC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay92ZG9tL1JlYWN0aXZlRG9tLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vQXBwQ29udHJvbGxlci50cyIsIi4uLy4uL2NsaWVudC9fY29tbW9uL0FwcFJvdXRlci50cyIsIi4uLy4uL2NsaWVudC9fY29tbW9uL0NoYW5uZWxzLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vRm9udEZhbWlsaWVzLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vUGFyc2VkRm9udHMudHMiLCIuLi8uLi9jbGllbnQvX2NvbW1vbi9TM0FjY2Vzcy50cyIsIi4uLy4uL2NsaWVudC9fY29tbW9uL1N0b3JlLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vY29uc3RhbnRzLnRzIiwiLi4vLi4vY2xpZW50L19jb21tb24vbW9kZWwtaGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fY29tbW9uL21vZGVscy50cyIsIi4uLy4uL2NsaWVudC9kZXNpZ25lci9Db2xvclBpY2tlci50cyIsIi4uLy4uL2NsaWVudC9kZXNpZ25lci9Eb2N1bWVudEtleUhhbmRsZXIudHMiLCIuLi8uLi9jbGllbnQvZGVzaWduZXIvRm9udFBpY2tlci50cyIsIi4uLy4uL2NsaWVudC9kZXNpZ25lci9TZWxlY3RlZEl0ZW1FZGl0b3IudHMiLCIuLi8uLi9jbGllbnQvZGVzaWduZXIvU2tldGNoRWRpdG9yLnRzIiwiLi4vLi4vY2xpZW50L2Rlc2lnbmVyL1RleHRCbG9ja0VkaXRvci50cyIsIi4uLy4uL2NsaWVudC9kZXNpZ25lci9Xb3Jrc3BhY2VDb250cm9sbGVyLnRzIiwiLi4vLi4vY2xpZW50L21hdGgvUGVyc3BlY3RpdmVUcmFuc2Zvcm0udHMiLCIuLi8uLi9jbGllbnQvd29ya3NwYWNlL0R1YWxCb3VuZHNQYXRoV2FycC50cyIsIi4uLy4uL2NsaWVudC93b3Jrc3BhY2UvUGF0aEhhbmRsZS50cyIsIi4uLy4uL2NsaWVudC93b3Jrc3BhY2UvUGF0aFNlY3Rpb24udHMiLCIuLi8uLi9jbGllbnQvd29ya3NwYWNlL1BhdGhUcmFuc2Zvcm0udHMiLCIuLi8uLi9jbGllbnQvd29ya3NwYWNlL1N0cmV0Y2hQYXRoLnRzIiwiLi4vLi4vY2xpZW50L3dvcmtzcGFjZS9UZXh0UnVsZXIudHMiLCIuLi8uLi9jbGllbnQvd29ya3NwYWNlL1RleHRXYXJwLnRzIiwiLi4vLi4vY2xpZW50L3dvcmtzcGFjZS9WaWV3Wm9vbS50cyIsIi4uLy4uL2NsaWVudC93b3Jrc3BhY2UvaW50ZXJmYWNlcy50cyIsIi4u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QWMsRUFBRTtRQUN4QixHQUFHLEVBQW1CLEVBQUU7UUFDeEIsSUFBSSxFQUFrQixFQUFFO1FBQ3hCLFNBQVMsRUFBYSxFQUFFO1FBQ3hCLE9BQU8sRUFBZSxFQUFFO1FBQ3hCLFVBQVUsRUFBWSxFQUFFO1FBQ3hCLFNBQVMsRUFBYSxFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLE1BQU0sRUFBZ0IsRUFBRTtRQUN4QixNQUFNLEVBQWdCLEVBQUU7UUFDeEIsTUFBTSxFQUFnQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsQ0FBQyxFQUFxQixFQUFFO1FBQ3hCLENBQUMsRUFBcUIsRUFBRTtRQUN4QixDQUFDLEVBQXFCLEVBQUU7UUFDeEIsVUFBVSxFQUFZLEVBQUU7UUFDeEIsV0FBVyxFQUFXLEVBQUU7UUFDeEIsU0FBUyxFQUFhLEVBQUU7UUFDeEIsT0FBTyxFQUFlLEVBQUU7UUFDeEIsT0FBTyxFQUFlLEVBQUU7UUFDeEIsT0FBTyxFQUFlLEVBQUU7UUFDeEIsT0FBTyxFQUFlLEVBQUU7UUFDeEIsT0FBTyxFQUFlLEdBQUc7UUFDekIsT0FBTyxFQUFlLEdBQUc7UUFDekIsT0FBTyxFQUFlLEdBQUc7UUFDekIsT0FBTyxFQUFlLEdBQUc7UUFDekIsT0FBTyxFQUFlLEdBQUc7UUFDekIsT0FBTyxFQUFlLEdBQUc7UUFDekIsUUFBUSxFQUFjLEdBQUc7UUFDekIsR0FBRyxFQUFtQixHQUFHO1FBQ3pCLFFBQVEsRUFBYyxHQUFHO1FBQ3pCLFlBQVksRUFBVSxHQUFHO1FBQ3pCLE1BQU0sRUFBZ0IsR0FBRztRQUN6QixFQUFFLEVBQW9CLEdBQUc7UUFDekIsRUFBRSxFQUFvQixHQUFHO1FBQ3pCLEVBQUUsRUFBb0IsR0FBRztRQUN6QixFQUFFLEVBQW9CLEdBQUc7UUFDekIsRUFBRSxFQUFvQixHQUFHO1FBQ3pCLEVBQUUsRUFBb0IsR0FBRztRQUN6QixFQUFFLEVBQW9CLEdBQUc7UUFDekIsRUFBRSxFQUFvQixHQUFHO1FBQ3pCLEVBQUUsRUFBb0IsR0FBRztRQUN6QixHQUFHLEVBQW1CLEdBQUc7UUFDekIsR0FBRyxFQUFtQixHQUFHO1FBQ3pCLEdBQUcsRUFBbUIsR0FBRztRQUN6QixPQUFPLEVBQWUsR0FBRztRQUN6QixVQUFVLEVBQVksR0FBRztRQUN6QixTQUFTLEVBQWEsR0FBRztRQUN6QixLQUFLLEVBQWlCLEdBQUc7UUFDekIsS0FBSyxFQUFpQixHQUFHO1FBQ3pCLElBQUksRUFBa0IsR0FBRztRQUN6QixNQUFNLEVBQWdCLEdBQUc7UUFDekIsWUFBWSxFQUFVLEdBQUc7UUFDekIsV0FBVyxFQUFXLEdBQUc7UUFDekIsV0FBVyxFQUFXLEdBQUc7UUFDekIsU0FBUyxFQUFhLEdBQUc7UUFDekIsWUFBWSxFQUFVLEdBQUc7UUFDekIsV0FBVyxFQUFXLEdBQUc7S0FDNUIsQ0FBQztBQUVOLENBQUMsRUFsSlMsVUFBVSxLQUFWLFVBQVUsUUFrSm5CO0FDbEpELElBQVUsV0FBVyxDQXdEcEI7QUF4REQsV0FBVSxXQUFXLEVBQUMsQ0FBQztJQVNuQixxQkFBNEIsTUFBYyxFQUFFLE9BQWUsRUFBRSxJQUFhO1FBQ3RFLElBQUksS0FBSyxHQUFxQixFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsQ0FBQztRQUNyRCxFQUFFLENBQUEsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSxDQUFDO1lBQzFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQy9CLENBQUM7UUFDRCxJQUFJLE9BQU8sR0FBRyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdkQsRUFBRSxDQUFBLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQSxDQUFDO1lBQzFCLEtBQUssQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFDLENBQUM7UUFDRCxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDO1lBQ0wsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDMUIsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQWJlLHVCQUFXLGNBYTFCLENBQUE7SUFFRCx3QkFBK0IsTUFBYyxFQUFFLE9BQWUsRUFBRSxJQUFhO1FBQ3pFLElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2xELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLEVBQUUsQ0FBQSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQSxDQUFDO1lBQ3BCLEtBQUssQ0FBQyxJQUFJLENBQUMsa0JBQWdCLFFBQVEsQ0FBQyxVQUFVLE1BQUcsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFDRCxFQUFFLENBQUEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUEsQ0FBQztZQUNwQixLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFlLFFBQVEsQ0FBQyxVQUFZLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBQ0QsRUFBRSxDQUFBLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBLENBQUM7WUFDbkIsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBYyxRQUFRLENBQUMsU0FBVyxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUNELEVBQUUsQ0FBQSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQSxDQUFDO1lBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBYSxRQUFRLENBQUMsUUFBVSxDQUFDLENBQUM7UUFDakQsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFoQmUsMEJBQWMsaUJBZ0I3QixDQUFBO0lBRUQsd0JBQStCLE1BQWtCLEVBQUUsT0FBZ0I7UUFDL0QsSUFBSSxHQUFXLENBQUM7UUFDaEIsR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLFNBQVMsQ0FBQyxDQUFDO1FBQ3pDLEVBQUUsQ0FBQSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBQztZQUNMLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFDRCxNQUFNLENBQUM7WUFDSCxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07WUFDckIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO1lBQ3pCLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLEtBQUEsR0FBRztTQUNOLENBQUE7SUFDTCxDQUFDO0lBWmUsMEJBQWMsaUJBWTdCLENBQUE7QUFFTCxDQUFDLEVBeERTLFdBQVcsS0FBWCxXQUFXLFFBd0RwQjtBQ3hERCxnQkFBbUIsT0FBZSxFQUFFLE1BQXdCO0lBQ3hELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQXZCLENBQXVCLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRUQ7SUFDSSxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN4QyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FDUEQsSUFBVSxZQUFZLENBOEVyQjtBQTlFRCxXQUFVLFlBQVksRUFBQyxDQUFDO0lBZXBCO1FBSUksc0JBQVksT0FBaUMsRUFBRSxJQUFZO1lBQ3ZELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLENBQUM7UUFFRCxnQ0FBUyxHQUFULFVBQVUsUUFBMkM7WUFDakQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBRUQsb0NBQWEsR0FBYixVQUFjLFFBQStCO1lBQ3pDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUNELCtCQUFRLEdBQVIsVUFBUyxJQUFZO1lBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO2dCQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsSUFBSSxFQUFFLElBQUk7YUFDYixDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsOEJBQU8sR0FBUDtZQUFBLGlCQUVDO1lBREcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFJLENBQUMsSUFBSSxFQUFwQixDQUFvQixDQUFDLENBQUM7UUFDMUQsQ0FBQztRQUVELDhCQUFPLEdBQVAsVUFBUSxPQUE0QjtZQUNoQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQXhCLENBQXdCLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0wsbUJBQUM7SUFBRCxDQUFDLEFBOUJELElBOEJDO0lBOUJZLHlCQUFZLGVBOEJ4QixDQUFBO0lBRUQ7UUFJSSxpQkFBWSxPQUF5QyxFQUFFLElBQWE7WUFDaEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUF5QixDQUFDO1lBQ2xFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLENBQUM7UUFFRCwyQkFBUyxHQUFULFVBQVUsTUFBK0M7WUFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFFRCx1QkFBSyxHQUFMLFVBQWtDLElBQVk7WUFDMUMsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFRLElBQUksQ0FBQyxPQUFtQyxFQUNuRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBRUQsNEJBQVUsR0FBVjtZQUF1QyxnQkFBZ0M7aUJBQWhDLFdBQWdDLENBQWhDLHNCQUFnQyxDQUFoQyxJQUFnQztnQkFBaEMsK0JBQWdDOztZQUVuRSxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQTFCLENBQTBCLENBQW1DLENBQUM7UUFDbEcsQ0FBQztRQUVELHVCQUFLLEdBQUw7WUFBTSxnQkFBdUM7aUJBQXZDLFdBQXVDLENBQXZDLHNCQUF1QyxDQUF2QyxJQUF1QztnQkFBdkMsK0JBQXVDOztZQUV6QyxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQTFCLENBQTBCLENBQUUsQ0FBQztRQUNqRSxDQUFDO1FBQ0wsY0FBQztJQUFELENBQUMsQUE3QkQsSUE2QkM7SUE3Qlksb0JBQU8sVUE2Qm5CLENBQUE7QUFFTCxDQUFDLEVBOUVTLFlBQVksS0FBWixZQUFZLFFBOEVyQjtBRTlFRDtJQUFBO1FBRVksaUJBQVksR0FBOEIsRUFBRSxDQUFDO0lBaUR6RCxDQUFDO0lBL0NHOztPQUVHO0lBQ0gsbUNBQVMsR0FBVCxVQUFVLE9BQThCO1FBQXhDLGlCQUtDO1FBSkcsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUEsQ0FBQztZQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUF6QixDQUF5QixDQUFDO0lBQzNDLENBQUM7SUFFRCxxQ0FBVyxHQUFYLFVBQVksUUFBK0I7UUFDdkMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQztJQUNMLENBQUM7SUFFRCxpQ0FBTyxHQUFQO1FBQUEsaUJBTUM7UUFMRyxJQUFJLEtBQVUsQ0FBQztRQUNmLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUNqQyxVQUFDLFlBQVksSUFBSyxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQXdCLFlBQVksQ0FBQyxFQUFuRCxDQUFtRCxFQUNyRSxVQUFDLGVBQWUsSUFBSyxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQXdCLGVBQWUsQ0FBQyxFQUF4RCxDQUF3RCxDQUNoRixDQUFDO0lBQ04sQ0FBQztJQUVEOztPQUVHO0lBQ0gsc0NBQVksR0FBWixVQUFhLFFBQStCO1FBQ3hDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDO1lBQ3hCLEtBQUssRUFBRSxDQUFDO1lBQ1IsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGdDQUFNLEdBQU4sVUFBTyxRQUFXO1FBQ2QsR0FBRyxDQUFBLENBQW1CLFVBQWlCLEVBQWpCLEtBQUEsSUFBSSxDQUFDLFlBQVksRUFBakIsY0FBaUIsRUFBakIsSUFBaUIsQ0FBQztZQUFwQyxJQUFJLFVBQVUsU0FBQTtZQUNkLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ25DO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0gsK0JBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0wsc0JBQUM7QUFBRCxDQUFDLEFBbkRELElBbURDO0FDbkRELElBQVUsVUFBVSxDQTRDbkI7QUE1Q0QsV0FBVSxVQUFVLEVBQUMsQ0FBQztJQVFsQixrQkFDSSxJQUlDO1FBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxjQUFjLEVBQUU7WUFDckIsQ0FBQyxDQUFDLHdDQUF3QyxFQUN0QztnQkFDSSxPQUFPLEVBQUU7b0JBQ0wsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO29CQUNYLElBQUksRUFBRSxRQUFRO29CQUNkLGFBQWEsRUFBRSxVQUFVO29CQUN6QixTQUFTLEVBQUUsaUNBQWlDO2lCQUMvQzthQUNKLEVBQ0Q7Z0JBQ0ksSUFBSSxDQUFDLE9BQU87Z0JBQ1osQ0FBQyxDQUFDLFlBQVksQ0FBQzthQUNsQixDQUFDO1lBQ04sQ0FBQyxDQUFDLGtCQUFrQixFQUNoQixFQUFFLEVBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJO2dCQUNmLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFDRixFQUNDLEVBQ0Q7b0JBQ0ksQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDN0MsQ0FDSjtZQU5ELENBTUMsQ0FDSixDQUNKO1NBQ0osQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQW5DZSxtQkFBUSxXQW1DdkIsQ0FBQTtBQUNMLENBQUMsRUE1Q1MsVUFBVSxLQUFWLFVBQVUsUUE0Q25CO0FDdkNELElBQVUsWUFBWSxDQThQckI7QUE5UEQsV0FBVSxZQUFZLEVBQUMsQ0FBQztJQUlwQixJQUFNLEdBQUcsR0FBRztRQUFTLGdCQUFnQjthQUFoQixXQUFnQixDQUFoQixzQkFBZ0IsQ0FBaEIsSUFBZ0I7WUFBaEIsK0JBQWdCOztRQUNqQyxFQUFFLENBQUMsQ0FBQywwQkFBYSxDQUFDLENBQUMsQ0FBQztZQUNoQixPQUFPLENBQUMsR0FBRyxPQUFYLE9BQU8sRUFBUSxNQUFNLENBQUMsQ0FBQztRQUMzQixDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVksK0JBQWtCLEdBQUcsVUFBUyxRQUF1QjtRQUM5RCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBRXJELCtCQUErQjtRQUMvQixtREFBbUQ7SUFDdkQsQ0FBQyxDQUFBO0lBRVksMEJBQWEsR0FBRyxVQUFTLElBQW9CLEVBQUUsYUFBcUI7UUFDN0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQXFCLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMzRSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBYSxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDM0QsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVZLDhCQUFpQixHQUFHLFVBQVMsSUFBd0IsRUFBRSxhQUFxQjtRQUF4RCxpQkFVaEM7UUFURyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7WUFDM0IsT0FBQSxLQUFJLENBQUMsU0FBUyxDQUFhLENBQUMsRUFBRSxhQUFhLENBQUM7UUFBNUMsQ0FBNEMsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUM7WUFDMUIsUUFBUSxFQUFFLEtBQUs7WUFDZixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7U0FDNUIsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFBO0lBRVksOEJBQWlCLEdBQUcsVUFBUyxJQUFnQixFQUFFLFNBQWlCO1FBQ3pFLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDN0IsSUFBSSxVQUFVLEdBQUcsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUN4QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBRWYsT0FBTyxDQUFDLEVBQUUsR0FBRyxTQUFTLEVBQUUsQ0FBQztZQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixNQUFNLElBQUksVUFBVSxDQUFDO1FBQ3pCLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUMsQ0FBQTtJQUVZLHNCQUFTLEdBQUcsVUFBUyxJQUFnQixFQUFFLFNBQWlCO1FBQ2pFLElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQztZQUNsQixRQUFRLEVBQUUsTUFBTTtZQUNoQixNQUFNLEVBQUUsSUFBSTtZQUNaLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztTQUM1QixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUE7SUFFWSxxQ0FBd0IsR0FBRyxVQUFTLE9BQXdCLEVBQUUsVUFBMkI7UUFFbEcsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUNyQyxJQUFNLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDM0MsTUFBTSxDQUFDLFVBQVMsU0FBc0I7WUFDbEMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDO1lBQy9ELElBQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3hFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLElBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sK0NBQStDLEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pGLENBQUM7WUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxDQUFDLENBQUE7SUFDTCxDQUFDLENBQUE7SUFJWSx5QkFBWSxHQUFHO1FBQ3hCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzNCLFlBQVksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEMsQ0FBQztRQUNELHdCQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDaEMsd0JBQVcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBRTlCLENBQUMsQ0FBQTtJQUVZLHVCQUFVLEdBQUcsVUFBUyxDQUFjLEVBQUUsQ0FBYztRQUM3RCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7UUFDM0IsMEJBQTBCO1FBQzFCLFlBQVksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFBO0lBRVksbUJBQU0sR0FBRyxVQUFTLEtBQWtCLEVBQUUsS0FBYTtRQUM1RCw2Q0FBNkM7UUFDN0MsSUFBSSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0Qiw0Q0FBNEM7UUFDNUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDLENBQUE7SUFFWSxxQkFBUSxHQUFHLFVBQVMsSUFBb0IsRUFBRSxTQUFrQjtRQUNyRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsR0FBRyxDQUFDLENBQVUsVUFBYSxFQUFiLEtBQUEsSUFBSSxDQUFDLFFBQVEsRUFBYixjQUFhLEVBQWIsSUFBYSxDQUFDO2dCQUF2QixJQUFJLENBQUMsU0FBQTtnQkFDTixZQUFZLENBQUMsUUFBUSxDQUFpQixDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDdkQ7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUyxJQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFRDs7T0FFRztJQUNVLCtCQUFrQixHQUFHLFVBQVMsSUFBZ0IsRUFBRSxTQUFxQztRQUM5RixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN0RCxDQUFDLENBQUE7SUFFRDs7T0FFRztJQUNVLHlCQUFZLEdBQUcsVUFBUyxJQUFnQixFQUFFLFNBQXFDO1FBQ3hGLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELElBQUksS0FBaUIsQ0FBQztRQUN0QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLE9BQU8sUUFBUSxJQUFJLFFBQVEsS0FBSyxLQUFLLEVBQUUsQ0FBQztZQUNwQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3BCLENBQUM7WUFDRCxLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ2pCLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQy9CLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUMsQ0FBQTtJQUVEOztPQUVHO0lBQ1Usb0JBQU8sR0FBRyxVQUFTLElBQXFCO1FBQ2pELE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM1RSxDQUFDLENBQUE7SUFFRDs7T0FFRztJQUNVLHFCQUFRLEdBQUcsVUFBUyxDQUFjLEVBQUUsQ0FBYztRQUMzRCxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQTtJQUVZLHlCQUFZLEdBQUcsVUFBUyxPQUFzQjtRQUN2RCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakYsQ0FBQyxDQUFBO0lBRUQ7O09BRUc7SUFDVSx5QkFBWSxHQUFHLFVBQVMsSUFBZ0I7UUFDakQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUU3QixJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLFVBQUEsRUFBRTtZQUNqQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLG1EQUFtRCxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN6RixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osRUFBRSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDNUIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO2dCQUM1QixHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztnQkFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBUyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM1QyxDQUFDO1lBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFNUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBUyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUV2QyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBQSxFQUFFO1lBQy9CLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFckMsMEJBQTBCO1lBQzFCLDRGQUE0RjtZQUM1RixXQUFXO1lBQ1gsK0JBQStCO1lBQy9CLElBQUk7WUFFSixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7Z0JBQzdCLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO2dCQUN2QyxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLHNCQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFTLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUN0QyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2QsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLHNCQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBLENBQUM7b0JBQzFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO29CQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFTLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQzFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZCxDQUFDO1lBQ0wsQ0FBQztZQUVELHNCQUFzQjtZQUN0Qix1QkFBdUI7WUFDdkIsWUFBWTtRQUNoQixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksU0FBaUIsQ0FBQztRQUN0QixJQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFTLENBQUMsZ0JBQWdCLEVBQUUsVUFBQSxFQUFFO1lBQ2xDLEVBQUUsQ0FBQSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUEsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBUyxDQUFDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3BELENBQUM7WUFDRCxTQUFTLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUE7SUFFWSxzQkFBUyxHQUFHO1FBRXJCOztXQUVHO1FBQ0gsY0FBYyxFQUFFLGdCQUFnQjtRQUVoQzs7V0FFRztRQUNILGFBQWEsRUFBRSxlQUFlO1FBRTlCOztXQUVHO1FBQ0gsWUFBWSxFQUFFLGNBQWM7UUFFNUI7OztXQUdHO1FBQ0gsZ0JBQWdCLEVBQUUsa0JBQWtCO1FBRXBDLHNCQUFzQixFQUFFLHdCQUF3QjtLQUNuRCxDQUFBO0FBQ0wsQ0FBQyxFQTlQUyxZQUFZLEtBQVosWUFBWSxRQThQckI7QUNyUEQsSUFBVSxXQUFXLENBd0hwQjtBQXhIRCxXQUFVLFdBQVcsRUFBQyxDQUFDO0lBRW5CLFdBQVksVUFBVTtRQUNsQixvRUFBb0U7UUFDcEUsNEVBQTRFO1FBQzVFLHVEQUFnQixDQUFBO1FBQ2hCLGtDQUFrQztRQUNsQyxtREFBYyxDQUFBO1FBQ2Qsc0VBQXNFO1FBQ3RFLFVBQVU7UUFDVixxREFBZSxDQUFBO1FBQ2YsK0JBQStCO1FBQy9CLG1EQUFjLENBQUE7UUFDZCxzRUFBc0U7UUFDdEUsc0VBQXNFO1FBQ3RFLG9EQUFlLENBQUE7UUFDZixvQ0FBb0M7UUFDcEMsZ0RBQWEsQ0FBQTtRQUNiLG9DQUFvQztRQUNwQyw4Q0FBWSxDQUFBO1FBQ1osMkVBQTJFO1FBQzNFLHVEQUFnQixDQUFBO1FBQ2hCLGVBQWU7UUFDZixtREFBZSxDQUFBO1FBQ2YsZ0JBQWdCO1FBQ2hCLGlEQUFjLENBQUE7UUFDZCxxQ0FBcUM7UUFDckMsc0RBQWdCLENBQUE7UUFDaEIsZ0NBQWdDO1FBQ2hDLDhDQUFZLENBQUE7SUFDaEIsQ0FBQyxFQTVCVyxzQkFBVSxLQUFWLHNCQUFVLFFBNEJyQjtJQTVCRCxJQUFZLFVBQVUsR0FBVixzQkE0QlgsQ0FBQTtJQUVELGlFQUFpRTtJQUNqRSxXQUFZLE9BQU87UUFDZixzRUFBc0U7UUFDdEUsa0JBQWtCO1FBQ2xCLDhDQUE0RSxDQUFBO1FBQzVFLDRFQUE0RTtRQUM1RSwrQ0FBd0QsQ0FBQTtRQUN4RCw2Q0FBc0QsQ0FBQTtRQUN0RCw4Q0FBNEUsQ0FBQTtRQUM1RSwwQ0FBcUUsQ0FBQTtRQUNyRSx3Q0FBZ0QsQ0FBQTtRQUNoRCxpREFBd0QsQ0FBQTtRQUN4RCw2Q0FBMEUsQ0FBQTtRQUMxRSwyQ0FBa0QsQ0FBQTtRQUNsRCx3Q0FBOEMsQ0FBQTtJQUNsRCxDQUFDLEVBZFcsbUJBQU8sS0FBUCxtQkFBTyxRQWNsQjtJQWRELElBQVksT0FBTyxHQUFQLG1CQWNYLENBQUE7SUFBQSxDQUFDO0lBRUY7UUFFSSx3QkFBd0I7UUFDeEIsSUFBTSxTQUFTLEdBQVMsS0FBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDOUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxVQUFTLE9BQTBCO1lBQW5DLGlCQWFyQjtZQVpHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1lBQzNCLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBQ0QsTUFBTSxDQUFDO2dCQUNILElBQUksS0FBSyxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbEQsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDYixLQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUM7WUFDTCxDQUFDLENBQUE7UUFDTCxDQUFDLENBQUE7UUFFRCxtQkFBbUI7UUFDbkIsSUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUNwQyxTQUFTLENBQUMsTUFBTSxHQUFHO1lBQ2YsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDN0IsQ0FBQyxDQUFBO1FBRUQsd0JBQXdCO1FBQ3hCLElBQU0sWUFBWSxHQUFRLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQ2xELElBQU0sY0FBYyxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDN0MsWUFBWSxDQUFDLFFBQVEsR0FBRyxVQUFTLEtBQWlCLEVBQUUsSUFBZ0I7WUFDaEUsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDdEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFNLElBQUksR0FBUyxJQUFLLENBQUMsWUFBWSxDQUFDO2dCQUN0QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNQLEdBQUcsQ0FBQyxDQUFVLFVBQUksRUFBSixhQUFJLEVBQUosa0JBQUksRUFBSixJQUFJLENBQUM7d0JBQWQsSUFBSSxDQUFDLGFBQUE7d0JBQ04sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7cUJBQ3ZCO2dCQUNMLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQXhDZSxzQkFBVSxhQXdDekIsQ0FBQTtJQUVELGtCQUF5QixLQUFpQjtRQUN0QyxJQUFJLFFBQVEsR0FBYSxFQUFFLENBQUM7UUFDNUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsVUFBQyxLQUFLLEVBQUUsR0FBRztZQUM1QixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakQsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBUmUsb0JBQVEsV0FRdkIsQ0FBQTtJQUVELGlCQUF3QixJQUFnQixFQUFFLEtBQWlCO1FBR3ZELElBQUksS0FBaUIsQ0FBQztRQUN0QixNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FDakMsVUFBQSxVQUFVO1lBQ04sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDO2dCQUNwQixFQUFFLENBQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUEsQ0FBQztvQkFDVixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsRUFDRCxVQUFBLGFBQWE7WUFDVCxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDO2dCQUNOLEtBQUssRUFBRSxDQUFDO1lBQ1osQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQWpCZSxtQkFBTyxVQWlCdEIsQ0FBQTtBQUVMLENBQUMsRUF4SFMsV0FBVyxLQUFYLFdBQVcsUUF3SHBCO0FBRUQsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FDeEl6QixJQUFPLEtBQUssQ0FnQlg7QUFoQkQsV0FBTyxLQUFLLEVBQUMsQ0FBQztJQUVDLGVBQVMsR0FBRztRQUNuQixLQUFLLEVBQUUsT0FBTztRQUNkLFNBQVMsRUFBRSxXQUFXO1FBQ3RCLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLFNBQVMsRUFBRSxXQUFXO1FBQ3RCLEtBQUssRUFBRSxPQUFPO1FBQ2QsV0FBVyxFQUFFLGFBQWE7UUFDMUIsU0FBUyxFQUFFLFdBQVc7UUFDdEIsVUFBVSxFQUFFLFlBQVk7UUFDeEIsVUFBVSxFQUFFLFlBQVk7UUFDeEIsS0FBSyxFQUFFLE9BQU87UUFDZCxPQUFPLEVBQUUsU0FBUztLQUNyQixDQUFBO0FBRUwsQ0FBQyxFQWhCTSxLQUFLLEtBQUwsS0FBSyxRQWdCWDtBQ2hCRCxzQkFBc0I7QUFFdEIsb0RBQW9EO0FBQ3BELDZCQUE2QjtBQUU3Qix3RUFBd0U7QUFDeEUsbUNBQW1DO0FBQ25DLDhCQUE4QjtBQUM5QixRQUFRO0FBRVIsb0NBQW9DO0FBQ3BDLHNFQUFzRTtBQUN0RSxRQUFRO0FBRVIseUJBQXlCO0FBQ3pCLG1EQUFtRDtBQUNuRCxRQUFRO0FBRVIsc0VBQXNFO0FBQ3RFLGdFQUFnRTtBQUNoRSxRQUFRO0FBRVIsa0RBQWtEO0FBQ2xELDhFQUE4RTtBQUM5RSxRQUFRO0FBRVIsaUVBQWlFO0FBQ2pFLDhFQUE4RTtBQUM5RSxRQUFRO0FBQ1IsSUFBSTtBQ2hCSixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsT0FBNkI7SUFDbkQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFDOUIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUUxQixNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FDakMsb0JBQW9CLENBQUM7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDbEIsT0FBTyxFQUFFLE9BQU87WUFDaEIsS0FBSyxFQUFFLEtBQUs7WUFDWixRQUFRLEVBQUUsQ0FBQztTQUNkLENBQUMsQ0FBQztJQUNQLENBQUMsRUFDRCxvQkFBb0IsQ0FBQyxFQUFFLEdBQUc7UUFDdEIsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3RCLENBQUMsQ0FDSixDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUYsbUNBQW1DO0FBQzdCLE1BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVMsS0FBYTtJQUN0RSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7SUFFaEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQ2pDLG9CQUFvQixDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUN0QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsS0FBSyxFQUFFLEtBQUs7WUFDWixRQUFRLEVBQUUsQ0FBQztTQUNkLENBQUMsQ0FBQztJQUNQLENBQUMsRUFDRCxvQkFBb0IsQ0FBQyxFQUFFLEdBQUc7UUFDdEIsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3RCLENBQUMsQ0FDSixDQUFDO0FBQ04sQ0FBQyxDQUFDO0FDaERGLElBQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7QUNBL0I7SUFBQTtJQUVBLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FDRUQ7SUFBQTtJQWdFQSxDQUFDO0lBOURHOztPQUVHO0lBQ0ksd0JBQVksR0FBbkIsVUFDSSxJQUEwQixFQUMxQixTQUFzQjtRQUV0QixJQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDO1FBQ3hCLElBQUksT0FBTyxHQUF3QixTQUFTLENBQUM7UUFDN0MsSUFBTSxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFTLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFBLEdBQUc7WUFDZCxFQUFFLENBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDNUIsMERBQTBEO1lBRTlDLFlBQVk7WUFDWixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsQ0FBQSxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUEsQ0FBQztnQkFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLENBQUM7WUFFRCxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxNQUFNLENBQVEsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7T0FFRztJQUNJLDJCQUFlLEdBQXRCLFVBQ0ksU0FBK0IsRUFDL0IsU0FBOEI7UUFFOUIsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDO1FBQ3hCLElBQUksSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBUyxDQUFDO1FBQ25DLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQUEsR0FBRztZQUN4QixFQUFFLENBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDaEIsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBUSxPQUFPLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksc0JBQVUsR0FBakIsVUFDSSxTQUE4QixFQUM5QixNQUF3QixFQUN4QixNQUEwQjtRQUUxQixJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUM7UUFDeEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFTLENBQUM7UUFDbkMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFBLElBQUk7WUFDakIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUNqQixPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsTUFBTSxDQUFRLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUwsa0JBQUM7QUFBRCxDQUFDLEFBaEVELElBZ0VDO0FDckVELDhHQUE4RztBQUM5Ryx3RkFBd0Y7QUFDeEYsNENBQTRDO0FBQzVDLHdGQUF3RjtBQUN4RixpRUFBaUU7QUFDakUscUVBQXFFO0FBQ3JFLG1GQUFtRjtBQUNuRixzRkFBc0Y7QUFFdEY7SUFNSSx1QkFDSSxLQUFZLEVBQ1osTUFBaUIsRUFDakIsWUFBMEIsRUFDMUIsa0JBQXNDO1FBVjlDLGlCQTBDQztRQTlCTyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBRXJELE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBcEMsQ0FBb0MsQ0FBQyxDQUFDO1FBQzVELE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxDQUFDO1FBRTlELE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7WUFFL0MsS0FBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVsRSxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQztnQkFDL0QsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxFQUFFO1lBQzdCLE9BQUEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUFqRSxDQUFpRSxDQUNwRSxDQUFDO1FBRUYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQUEsRUFBRTtZQUNsQyxPQUFBLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7UUFBakUsQ0FBaUUsQ0FDcEUsQ0FBQztJQUNOLENBQUM7SUFFTCxvQkFBQztBQUFELENBQUMsQUExQ0QsSUEwQ0M7QUNsREQ7SUFBd0IsNkJBQU87SUFFM0I7UUFGSixpQkEwQkM7UUF2Qk8sa0JBQU07WUFDRixJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO1lBQzFCLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQztTQUMvQyxFQUNHO1lBQ0ksT0FBTyxFQUFFLEtBQUs7U0FDakIsQ0FBQyxDQUFDO1FBRVAsZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ3BDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUV4QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRyxFQUFFLEtBQUs7WUFDbEIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDTixPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbEMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxQixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN2QyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUwsZ0JBQUM7QUFBRCxDQUFDLEFBMUJELENBQXdCLE9BQU8sR0EwQjlCO0FDMUJEO0lBQXNCLDJCQUFvQjtJQUExQztRQUFzQiw4QkFBb0I7UUFFdEMsUUFBRyxHQUFHO1lBQ0Y7O2VBRUc7WUFDSCxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBTyxtQkFBbUIsQ0FBQztZQUVwRCxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBUyxjQUFjLENBQUM7U0FDL0MsQ0FBQztRQUVGLGFBQVEsR0FBRztZQUNQLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFPLG9CQUFvQixDQUFDO1lBQ2pELGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFPLHNCQUFzQixDQUFDO1lBQ3hELFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFPLG9CQUFvQixDQUFDO1lBQ2pELFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFPLG9CQUFvQixDQUFDO1lBQ2pELFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFrQixzQkFBc0IsQ0FBQztZQUNoRSxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBdUMseUJBQXlCLENBQUM7U0FDOUYsQ0FBQTtRQUVELFdBQU0sR0FBRztZQUNMLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFhLGVBQWUsQ0FBQztZQUMvQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBYSxjQUFjLENBQUM7WUFDN0MsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQWEsbUJBQW1CLENBQUM7WUFDdkQsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQXFCLHFCQUFxQixDQUFDO1NBQ3RFLENBQUM7UUFFRixjQUFTLEdBQUc7WUFDUixHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSxlQUFlLENBQUM7WUFDM0MsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVksc0JBQXNCLENBQUM7WUFDekQsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVkseUJBQXlCLENBQUM7WUFDL0QsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVksa0JBQWtCLENBQUM7U0FDcEQsQ0FBQztJQUVOLENBQUM7SUFBRCxjQUFDO0FBQUQsQ0FBQyxBQWxDRCxDQUFzQixZQUFZLENBQUMsT0FBTyxHQWtDekM7QUFFRDtJQUFxQiwwQkFBb0I7SUFBekM7UUFBcUIsOEJBQW9CO1FBRXJDLFFBQUcsR0FBRztZQUNGLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFVLG9CQUFvQixDQUFDO1lBQ3pELG9CQUFvQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQVMsMEJBQTBCLENBQUM7WUFDcEUsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQWdCLGdCQUFnQixDQUFDO1NBQzFELENBQUE7UUFFRCxhQUFRLEdBQUc7WUFDUCxrQkFBa0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFPLDZCQUE2QixDQUFDO1lBQ25FLGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQU8sNkJBQTZCLENBQUM7WUFDbkUsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBTyw2QkFBNkIsQ0FBQztZQUNuRSxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBa0Isc0JBQXNCLENBQUM7WUFDaEUsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVMsMEJBQTBCLENBQUM7WUFDL0Qsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBUyw2QkFBNkIsQ0FBQztTQUN4RSxDQUFDO1FBRUYsV0FBTSxHQUFHO1lBQ0wsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVMsZUFBZSxDQUFDO1lBQzNDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFTLG9CQUFvQixDQUFDO1lBQ3JELGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFTLHVCQUF1QixDQUFDO1lBQzNELGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQXNCLDJCQUEyQixDQUFDO1lBQ2hGLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQXFCLHlCQUF5QixDQUFDO1lBQzNFLGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQU8scUNBQXFDLENBQUM7U0FDOUUsQ0FBQztRQUVGLGNBQVMsR0FBRztZQUNSLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFZLGlCQUFpQixDQUFDO1lBQy9DLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFZLHVCQUF1QixDQUFDO1lBQzNELFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUE2QyxxQkFBcUIsQ0FBQztZQUN4RixjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSwwQkFBMEIsQ0FBQztZQUNqRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSxtQkFBbUIsQ0FBQztZQUNuRCxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSxrQkFBa0IsQ0FBQztZQUNqRCxZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSx3QkFBd0IsQ0FBQztTQUNoRSxDQUFDO0lBRU4sQ0FBQztJQUFELGFBQUM7QUFBRCxDQUFDLEFBcENELENBQXFCLFlBQVksQ0FBQyxPQUFPLEdBb0N4QztBQUVEO0lBQUE7UUFDSSxZQUFPLEdBQVksSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNqQyxXQUFNLEdBQVcsSUFBSSxNQUFNLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBQUQsZUFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FDN0VEO0lBQUE7UUFJVyxZQUFPLEdBQWlCLEVBQUUsQ0FBQztJQTBGdEMsQ0FBQztJQXhGRywwQkFBRyxHQUFILFVBQUksTUFBYztRQUNkLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCw2QkFBTSxHQUFOLFVBQU8sTUFBYyxFQUFFLE9BQWU7UUFDbEMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxFQUFFLENBQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUM7WUFDUixPQUFPLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakMsRUFBRSxDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDO1lBQ04sT0FBTyxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDcEUsSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELHFDQUFjLEdBQWQsVUFBZSxNQUFrQjtRQUM3QixFQUFFLENBQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEIsRUFBRSxDQUFBLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ3JCLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsdUNBQWdCLEdBQWhCLFVBQWlCLFFBQTBDO1FBQTNELGlCQXlCQztRQXhCRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ0gsR0FBRyxFQUFFLHlCQUF5QjtZQUM5QixRQUFRLEVBQUUsTUFBTTtZQUNoQixLQUFLLEVBQUUsSUFBSTtZQUNYLE9BQU8sRUFBRSxVQUFDLFFBQStDO2dCQUVyRCxJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUUxRSxrQkFBa0I7Z0JBQ2xCO29CQUNJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxVQUFDLEdBQVcsRUFBRSxHQUFVO3dCQUN4QyxFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBLENBQUM7NEJBQzNCLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBQ3BELENBQUM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7O2dCQUxQLEdBQUcsQ0FBQSxDQUFjLFVBQWEsRUFBYiwrQkFBYSxFQUFiLDJCQUFhLEVBQWIsSUFBYSxDQUFDO29CQUEzQixJQUFNLEdBQUcsc0JBQUE7O2lCQU1aO2dCQUVELEtBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDO2dCQUM3QixRQUFRLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNCLENBQUM7WUFDRCxLQUFLLEVBQUUsVUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUc7Z0JBQ3BCLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELENBQUM7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsa0VBQWtFO0lBQ2xFLG9FQUFvRTtJQUNwRSxzQ0FBc0M7SUFDdEMsK0JBQStCO0lBQy9CLHNDQUFzQztJQUN0QyxpQ0FBaUM7SUFFakMsZUFBZTtJQUNmLG9CQUFvQjtJQUNwQiw0QkFBNEI7SUFDNUIsdUJBQXVCO0lBQ3ZCLDBFQUEwRTtJQUMxRSx3Q0FBd0M7SUFDeEMsYUFBYTtJQUNiLHlDQUF5QztJQUN6QywwREFBMEQ7SUFDMUQsWUFBWTtJQUNaLFVBQVU7SUFDVixJQUFJO0lBRUo7OztPQUdHO0lBQ0gseUNBQWtCLEdBQWxCLFVBQW1CLFFBQWtCO1FBQ2pDLEdBQUcsQ0FBQyxDQUFnQixVQUFxQixFQUFyQixLQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFyQixjQUFxQixFQUFyQixJQUFxQixDQUFDO1lBQXJDLElBQU0sS0FBSyxTQUFBO1lBQ1osT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDVCxPQUFPLEVBQUUsS0FBSztnQkFDZCxNQUFNLEVBQUU7b0JBQ0osUUFBUSxFQUFZLEtBQUs7b0JBQ3pCLElBQUksRUFBRSxnRUFBZ0U7aUJBQ3pFO2FBQ0osQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBM0ZNLDBCQUFhLEdBQUcsR0FBRyxDQUFDO0lBNEYvQixtQkFBQztBQUFELENBQUMsQUE5RkQsSUE4RkM7QUM1RkQ7SUFNSSxxQkFBWSxVQUE0QjtRQUp4QyxVQUFLLEdBQXNDLEVBQUUsQ0FBQztRQUsxQyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRUQseUJBQUcsR0FBSCxVQUFJLE9BQWUsRUFBRSxPQUFnQztRQUFyRCxpQkFxQkM7UUFyQm9CLHVCQUFnQyxHQUFoQyxjQUFnQztRQUNqRCxFQUFFLENBQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBLENBQUM7WUFDVCxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1AsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbEMsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsR0FBRyxFQUFFLElBQUk7WUFDN0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDTixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFDLFNBQUEsT0FBTyxFQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQzNCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNsQyxLQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQUFDLEFBaENELElBZ0NDO0FDbENELElBQVUsUUFBUSxDQThEakI7QUE5REQsV0FBVSxRQUFRLEVBQUMsQ0FBQztJQUVoQjs7T0FFRztJQUNILGlCQUF3QixRQUFnQixFQUFFLFFBQWdCLEVBQUUsSUFBbUI7UUFFM0Usa0RBQWtEO1FBQ2xELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0QsSUFBSSxPQUFPLEdBQUcsaUJBQWlCLENBQUM7WUFDaEMsUUFBUSxJQUFJLE9BQU8sQ0FBQztRQUN4QixDQUFDO1FBRUQsSUFBTSxPQUFPLEdBQUcsa0NBQWdDLFFBQVEsa0JBQWEsUUFBVSxDQUFDO1FBQ2hGLGlCQUFpQjtRQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQzthQUNiLElBQUksQ0FBQyxVQUFBLFlBQVk7WUFFZCxXQUFXO1lBQ1gsSUFBTSxVQUFVLEdBQUc7Z0JBQ2YsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsR0FBRyxFQUFFLFlBQVksQ0FBQyxhQUFhO2dCQUMvQixPQUFPLEVBQUU7b0JBQ0wsV0FBVyxFQUFFLGFBQWE7aUJBQzdCO2dCQUNELElBQUksRUFBRSxJQUFJO2dCQUNWLFdBQVcsRUFBRSxLQUFLO2dCQUNsQixXQUFXLEVBQUUsUUFBUTthQUN4QixDQUFDO1lBRUYsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7aUJBQ2IsSUFBSSxDQUFDLFVBQUEsV0FBVztnQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDbEQsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxVQUFBLEdBQUc7Z0JBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVYLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxVQUFBLEdBQUc7WUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLDhCQUE4QixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQXJDZSxnQkFBTyxVQXFDdEIsQ0FBQTtJQUVEOztPQUVHO0lBQ0gsaUJBQXdCLFFBQWdCO1FBQ3BDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ1YsR0FBRyxFQUFFLCtCQUE2QixRQUFVO1lBQzVDLFFBQVEsRUFBRSxNQUFNO1NBQ25CLENBQUM7YUFDRyxJQUFJLENBQUMsVUFBQSxRQUFRO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNWLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRztnQkFDakIsUUFBUSxFQUFFLE1BQU07Z0JBQ2hCLEtBQUssRUFBRSxLQUFLO2FBQ2YsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBYmUsZ0JBQU8sVUFhdEIsQ0FBQTtBQUVMLENBQUMsRUE5RFMsUUFBUSxLQUFSLFFBQVEsUUE4RGpCO0FDOUREOzs7Ozs7Ozs7Ozs7R0FZRztBQUNIO0lBdUJJLGVBQVksTUFBaUI7UUF2QmpDLGlCQXNZQztRQTVYRyxVQUFLLEdBQWEsRUFBRSxDQUFDO1FBQ3JCLGNBQVMsR0FBRztZQUNSLFlBQVksRUFBRSxRQUFRLENBQUMsSUFBSTtZQUMzQixZQUFZLEVBQUUsSUFBSSxZQUFZLEVBQUU7WUFDaEMsV0FBVyxFQUFFLElBQUksV0FBVyxDQUFDLFVBQUMsR0FBRyxFQUFFLElBQUk7Z0JBQ25DLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFBekMsQ0FBeUMsQ0FBQztTQUNqRCxDQUFDO1FBRUYsWUFBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDeEIsV0FBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFFZCxvQkFBZSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBVSxDQUFDO1FBRy9DLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUVsQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUUxQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELDBCQUFVLEdBQVY7UUFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN6RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLEVBQUUsQ0FBQztZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEYsQ0FBQztJQUNMLENBQUM7SUFFRCxrQ0FBa0IsR0FBbEI7UUFBQSxpQkFxTkM7UUFwTkcsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUVuRCxrQkFBa0I7UUFFbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFO2FBQzlCLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQU4sQ0FBTSxDQUFDLENBQUM7YUFDdEUsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUNSLElBQU0sYUFBYSxHQUFHLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUM1QyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7cUJBQ3BDLElBQUksQ0FBQyxVQUFBLE1BQU07b0JBQ1IsS0FBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFFeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzVDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEtBQUssS0FBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7b0JBQ3RELENBQUM7b0JBQ0QsSUFBSSxDQUFDLENBQUM7d0JBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO29CQUM3RCxDQUFDO29CQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2hFLENBQUMsQ0FBQztxQkFDRCxJQUFJLENBQUMsVUFBQSxHQUFHO29CQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2pELEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7b0JBQ3JDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2hFLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7WUFDekMsQ0FBQztZQUVELHlDQUF5QztZQUV6Qyx1QkFBdUI7WUFDdkIsNENBQTRDO1lBQzVDLHlCQUF5QjtZQUN6Qix3REFBd0Q7WUFDeEQsK0JBQStCO1lBQy9CLHNCQUFzQjtZQUN0QixZQUFZO1lBQ1osZ0NBQWdDO1lBQ2hDLDRDQUE0QztZQUM1QyxrREFBa0Q7WUFDbEQsVUFBVTtZQUVWLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztpQkFDcEQsU0FBUyxDQUFDLFVBQUEsTUFBTTtnQkFDYixFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ25ELEtBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzVCLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO1FBRVAsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUM1QixPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQXRDLENBQXNDLENBQUMsQ0FBQztRQUU1Qyx1QkFBdUI7UUFFdkIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUM5QixNQUFNLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFeEMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUNsQyxLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUNsQyxLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUNwQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO2dCQUM1QyxJQUFNLElBQUksR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3pELFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBcUI7UUFFckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUMsQ0FBQztZQUM5QixJQUFNLE1BQU0sR0FBRyxLQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFbkMsSUFBTSxLQUFLLEdBQWUsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7WUFDdkMsS0FBSyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxJQUFJLFNBQVMsQ0FBQztZQUMzRCxLQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUUzQixLQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRXZCLEtBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVsRixLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTFCLEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUMzQixJQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0MsU0FBUyxDQUFDLEdBQUcsR0FBRyxLQUFLLEVBQUUsQ0FBQztZQUN4QixLQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQUEsRUFBRTtZQUNsQyxLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQzlCLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkIsS0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUNuQyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQixLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUdILHdCQUF3QjtRQUV4QixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUc7YUFDaEIsU0FBUyxDQUFDLFVBQUEsRUFBRTtZQUNULEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFMUIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztZQUNwQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFDRCxJQUFJLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBZSxDQUFDO1lBQzFDLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLEtBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDO1lBQ3ZFLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixLQUFLLENBQUMsVUFBVSxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQztnQkFDckUsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUM7WUFDM0UsQ0FBQztZQUVELEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUVyQixLQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFFUCxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVU7YUFDdkIsU0FBUyxDQUFDLFVBQUEsRUFBRTtZQUNULElBQUksS0FBSyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNSLElBQUksT0FBSyxHQUFjO29CQUNuQixJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJO29CQUNsQixlQUFlLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlO29CQUN4QyxTQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTO29CQUM1QixVQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVO29CQUM5QixXQUFXLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXO2lCQUNuQyxDQUFDO2dCQUNGLElBQU0sV0FBVyxHQUFHLE9BQUssQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLFVBQVU7dUJBQ2xELE9BQUssQ0FBQyxXQUFXLEtBQUssS0FBSyxDQUFDLFdBQVcsQ0FBQztnQkFDL0MsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBSyxDQUFDLENBQUM7Z0JBRTFCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDekMsSUFBTSxNQUFNLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDakUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDVCxnQ0FBZ0M7d0JBQ2hDLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUMzRSxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFeEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM3QyxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBRXJCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQ2QsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNsQyxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRVAsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNO2FBQ25CLFNBQVMsQ0FBQyxVQUFBLEVBQUU7WUFDVCxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsVUFBQSxFQUFFO2dCQUNyQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDekIsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDakIsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEIsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4RCxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3JCLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRVAsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhO2FBQzFCLFNBQVMsQ0FBQyxVQUFBLEVBQUU7WUFDVCxJQUFJLEtBQUssR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixLQUFLLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNsQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNoQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hELEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN6QixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRU8sMEJBQVUsR0FBbEIsVUFBbUIsTUFBYztRQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RCxHQUFHLENBQUMsQ0FBYSxVQUE0QixFQUE1QixLQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBNUIsY0FBNEIsRUFBNUIsSUFBNEIsQ0FBQztZQUF6QyxJQUFNLEVBQUUsU0FBQTtZQUNULElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0lBQ3JDLENBQUM7SUFFTyw2QkFBYSxHQUFyQjtRQUFBLGlCQVdDO1FBVkcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsVUFBQSxRQUFRO1lBQ2pELHNDQUFzQztZQUN0QyxLQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUMsQ0FBQyxDQUFDO1lBRTVFLEtBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDMUIsS0FBSyxDQUFDLGlCQUFpQixFQUN2QixVQUFDLEdBQUcsRUFBRSxJQUFJLElBQUssT0FBQSxLQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxJQUFJLEVBQWxDLENBQWtDLENBQUMsQ0FBQztZQUV2RCxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLCtCQUFlLEdBQXZCLFVBQXdCLE9BQWU7UUFBdkMsaUJBT0M7UUFORyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7UUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFELFVBQVUsQ0FBQztZQUNQLEtBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUM5QixLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0QsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ1osQ0FBQztJQUVPLGlDQUFpQixHQUF6QixVQUEwQixLQUFnQjtRQUExQyxpQkFNQztRQUxHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUN2RSxVQUFDLEdBQUcsRUFBRSxJQUFJLElBQUssT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUNuRCxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUQ1QixDQUM0QixDQUM5QyxDQUFDO0lBQ04sQ0FBQztJQUVPLDZCQUFhLEdBQXJCO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVPLHNCQUFNLEdBQWQsVUFBa0IsSUFBTyxFQUFFLE1BQVM7UUFDaEMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVPLDRCQUFZLEdBQXBCO1FBQ0ksTUFBTSxDQUFDO1lBQ0gsR0FBRyxFQUFFLEtBQUssRUFBRTtZQUNaLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVM7WUFDL0Isb0JBQW9CLEVBQUU7Z0JBQ2xCLFVBQVUsRUFBRSxRQUFRO2dCQUNwQixXQUFXLEVBQUUsU0FBUztnQkFDdEIsU0FBUyxFQUFFLFdBQVc7YUFDekI7WUFDRCxVQUFVLEVBQWUsRUFBRTtTQUM5QixDQUFDO0lBQ04sQ0FBQztJQUVELHNCQUFZLG1DQUFnQjthQUE1QjtZQUNJLElBQU0sVUFBVSxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3RDLENBQUM7YUFFRCxVQUE2QixLQUFhO1lBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELENBQUM7OztPQUpBO0lBTU8sMEJBQVUsR0FBbEIsVUFBbUIsTUFBYztRQUM3QixRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsT0FBTyxFQUNqQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTyw0QkFBWSxHQUFwQixVQUFxQixJQUF3QjtRQUN6QywwQkFBMEI7UUFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNQLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUzttQkFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUM7WUFDWCxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQztZQUNYLENBQUM7UUFDTCxDQUFDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRU8sOEJBQWMsR0FBdEIsVUFBdUIsSUFBeUI7UUFDNUMsMEJBQTBCO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVc7bUJBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxDQUFDO1lBQ1gsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLENBQUM7WUFDWCxDQUFDO1FBQ0wsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN6QixpQ0FBaUM7WUFFakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELElBQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDekUsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3JFLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUCx1Q0FBdUM7WUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU8sd0JBQVEsR0FBaEIsVUFBaUIsRUFBVTtRQUN2QixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBYixDQUFhLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBbllNLG9CQUFjLEdBQUcsV0FBVyxDQUFDO0lBQzdCLHVCQUFpQixHQUFHLHNCQUFzQixDQUFDO0lBQzNDLHVCQUFpQixHQUFHLFFBQVEsQ0FBQztJQUM3QixxQkFBZSxHQUFHLEdBQUcsQ0FBQztJQUN0Qiw0QkFBc0IsR0FBRyw0QkFBNEIsQ0FBQztJQUN0RCwwQkFBb0IsR0FBRyxJQUFJLENBQUM7SUFDNUIsMEJBQW9CLEdBQUcsS0FBSyxDQUFDO0lBOFh4QyxZQUFDO0FBQUQsQ0FBQyxBQXRZRCxJQXNZQztBRW5aRCxJQUFNLGFBQWEsR0FBRztJQUVsQixXQUFXLFlBQUMsTUFBYztRQUN0QixJQUFJLE1BQU0sR0FBRyxDQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUUsQ0FBQztRQUN4QyxHQUFHLENBQUEsQ0FBZ0IsVUFBaUIsRUFBakIsS0FBQSxNQUFNLENBQUMsVUFBVSxFQUFqQixjQUFpQixFQUFqQixJQUFpQixDQUFDO1lBQWpDLElBQU0sS0FBSyxTQUFBO1lBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDaEM7UUFDRCxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxJQUFJLElBQUksRUFBVCxDQUFTLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNkLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztDQUVKLENBQUE7QUVkRCxJQUFVLFdBQVcsQ0EyR3BCO0FBM0dELFdBQVUsV0FBVyxFQUFDLENBQUM7SUFFbkIsSUFBTSxzQkFBc0IsR0FBRztRQUMzQjtZQUNJLDZDQUE2QztZQUM3QyxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztTQUNaO1FBQ0Q7WUFDSSw2Q0FBNkM7WUFDN0MsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7U0FDWjtRQUNEO1lBQ0ksNkNBQTZDO1lBQzdDLFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1NBQ1o7UUFDRDtZQUNJLDZDQUE2QztZQUM3QyxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztTQUNaO1FBQ0Q7WUFDSSw2Q0FBNkM7WUFDN0MsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7U0FDWjtRQUNEO1lBQ0ksNkNBQTZDO1lBQzdDLFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1NBQ1o7UUFDRDtZQUNJLDZDQUE2QztZQUM3QyxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztTQUNaO0tBQ0osQ0FBQztJQUVGLElBQU0sWUFBWSxHQUFHLENBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWxGLGVBQXNCLElBQUksRUFBRSxjQUF3QixFQUFFLFFBQVE7UUFDMUQsSUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEQseUJBQXlCO1FBQ3pCLElBQU0sb0JBQW9CLEdBQUcsc0JBQXNCLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztZQUN6RCxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFsQixDQUFrQixDQUFDLENBQUM7WUFDckQseUNBQXlDO1lBQ3pDLElBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFNBQVMsRUFBWCxDQUFXLENBQUM7aUJBQ3BELEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUNYLEdBQUcsQ0FBQyxVQUFBLENBQUM7Z0JBQ0YsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNyQixFQUFFLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNkLENBQUMsQ0FBQyxDQUFDO1lBQ1AsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFNBQVMsRUFBWCxDQUFXLENBQUMsQ0FBQztZQUN0RCxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQWIsQ0FBYSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDNUQsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUUzQixJQUFJLEdBQUcsR0FBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDLFFBQVEsQ0FBQztZQUNwQixTQUFTLEVBQUUsSUFBSTtZQUNmLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsV0FBVyxFQUFFLElBQUk7WUFDakIsb0JBQW9CLEVBQUUsS0FBSztZQUMzQixPQUFPLEVBQUUsT0FBTztZQUNoQixlQUFlLEVBQUUsWUFBWTtZQUM3QixNQUFNLEVBQUUsUUFBUTtTQUNuQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBbkNlLGlCQUFLLFFBbUNwQixDQUFBO0lBQUEsQ0FBQztJQUVGLGFBQW9CLElBQWlCLEVBQUUsS0FBYTtRQUMxQyxDQUFDLENBQUMsSUFBSSxDQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRmUsZUFBRyxNQUVsQixDQUFBO0lBRUQsaUJBQXdCLElBQUk7UUFDbEIsQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRmUsbUJBQU8sVUFFdEIsQ0FBQTtBQUNMLENBQUMsRUEzR1MsV0FBVyxLQUFYLFdBQVcsUUEyR3BCO0FDMUdEO0lBRUksNEJBQVksS0FBWTtRQUVwQixzQ0FBc0M7UUFDdEMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckQsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUVMLHlCQUFDO0FBQUQsQ0FBQyxBQWJELElBYUM7QUNURDtJQU9JLG9CQUFZLFNBQXNCLEVBQUUsS0FBWSxFQUFFLEtBQWdCO1FBUHRFLGlCQXFIQztRQW5IRyxzQkFBaUIsR0FBRyxRQUFRLENBQUM7UUFDN0Isb0JBQWUsR0FBRyxNQUFNLENBQUM7UUFLckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ2pDLEtBQUssQ0FDTixLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO2FBQ3ZDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQXhCLENBQXdCLENBQUM7YUFDckMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUMsQ0FDcEI7YUFDQSxHQUFHLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFmLENBQWUsQ0FBQyxDQUFDO1FBQ2hDLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCwyQkFBTSxHQUFOLFVBQU8sS0FBZ0I7UUFBdkIsaUJBZ0dDO1FBL0ZHLElBQUksTUFBTSxHQUFHLFVBQUEsS0FBSztZQUNkLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUN0QixLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUM7UUFDRixJQUFNLFFBQVEsR0FBWSxFQUFFLENBQUM7UUFDN0IsUUFBUSxDQUFDLElBQUksQ0FDVCxDQUFDLENBQUMsUUFBUSxFQUNOO1lBQ0ksR0FBRyxFQUFFLGNBQWM7WUFDbkIsS0FBSyxFQUFFO2dCQUNILGVBQWUsRUFBRSxJQUFJO2FBQ3hCO1lBQ0QsS0FBSyxFQUFFLEVBQ047WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsTUFBTSxFQUFFLFVBQUEsS0FBSztvQkFDVCxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNoQyxDQUFDO2dCQUNELE9BQU8sRUFBRSxVQUFBLEtBQUs7b0JBQ1YsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3pDLENBQUM7YUFDSjtZQUNELEVBQUUsRUFBRTtnQkFDQSxNQUFNLEVBQUUsVUFBQSxFQUFFLElBQUksT0FBQSxNQUFNLENBQUM7b0JBQ2pCLFVBQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUs7b0JBQzNCLFdBQVcsRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUN6RCxLQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQzlELENBQUMsRUFKWSxDQUlaO2FBQ0w7U0FDSixFQUNELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxPQUFPO2FBQ3BDLEdBQUcsQ0FBQyxVQUFDLEVBQWMsSUFBSyxPQUFBLENBQUMsQ0FBQyxRQUFRLEVBQy9CO1lBQ0ksS0FBSyxFQUFFO2dCQUNILFFBQVEsRUFBRSxFQUFFLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxVQUFVO2dCQUN4QyxjQUFjLEVBQUUsbUJBQWdCLFdBQVcsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSSxDQUFDLGVBQWUsQ0FBQyxXQUFLLEVBQUUsQ0FBQyxNQUFNLFlBQVM7YUFDM0g7U0FDSixFQUNELENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBUFMsQ0FPVCxDQUNmLENBQ1IsQ0FDSixDQUFDO1FBQ0YsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0UsRUFBRSxDQUFDLENBQUMsY0FBYyxJQUFJLGNBQWMsQ0FBQyxRQUFRO2VBQ3RDLGNBQWMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUNwQjtnQkFDSSxHQUFHLEVBQUUsZUFBZTtnQkFDcEIsS0FBSyxFQUFFO29CQUNILGdCQUFnQixFQUFFLElBQUk7aUJBQ3pCO2dCQUNELEtBQUssRUFBRSxFQUNOO2dCQUNELElBQUksRUFBRTtvQkFDRixNQUFNLEVBQUUsVUFBQSxLQUFLO3dCQUNULENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ2hDLENBQUM7b0JBQ0QsT0FBTyxFQUFFLFVBQUEsS0FBSzt3QkFDVixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQTtvQkFDeEMsQ0FBQztvQkFDRCxTQUFTLEVBQUUsVUFBQyxRQUFRLEVBQUUsS0FBSzt3QkFDdkIsVUFBVSxDQUFDOzRCQUNQLHNEQUFzRDs0QkFDdEQsc0NBQXNDOzRCQUN0QyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzs0QkFDckMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQzt3QkFDaEMsQ0FBQyxDQUFDLENBQUM7b0JBRVAsQ0FBQztpQkFDSjtnQkFDRCxFQUFFLEVBQUU7b0JBQ0EsTUFBTSxFQUFFLFVBQUEsRUFBRSxJQUFJLE9BQUEsTUFBTSxDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBeEMsQ0FBd0M7aUJBQ3pEO2FBQ0osRUFDRCxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7Z0JBQ3pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUNiO29CQUNJLEtBQUssRUFBRTt3QkFDSCxRQUFRLEVBQUUsQ0FBQyxLQUFLLEtBQUssQ0FBQyxXQUFXO3dCQUNqQyxLQUFLLEVBQUUsQ0FBQzt3QkFDUixnQkFBZ0IsRUFBRSxNQUFNO3dCQUN4QixjQUFjLEVBQUUsbUJBQWdCLFdBQVcsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsS0FBSSxDQUFDLGVBQWUsQ0FBQyxXQUFLLENBQUMsWUFBUztxQkFDNUg7aUJBQ0osRUFDRCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDWixDQUFDLENBQ0EsQ0FDSixDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQ1Y7WUFDSSxLQUFLLEVBQUUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFO1NBQ2pDLEVBQ0QsUUFBUSxDQUNYLENBQUM7SUFDTixDQUFDO0lBRUwsaUJBQUM7QUFBRCxDQUFDLEFBckhELElBcUhDO0FDekhEO0lBRUksNEJBQVksU0FBc0IsRUFBRSxLQUFZO1FBRTVDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRTthQUN4RCxHQUFHLENBQUMsVUFBQSxDQUFDO1lBRU4sSUFBTSxPQUFPLEdBQXdCLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFNUMsSUFBTSxLQUFLLEdBQUcsT0FBTzttQkFDZCxPQUFPLENBQUMsUUFBUSxLQUFLLFdBQVc7bUJBQ2hDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUNuQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssT0FBTyxDQUFDLE1BQU0sRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO1lBRXZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixFQUN4QjtvQkFDSSxLQUFLLEVBQUU7d0JBQ0gsT0FBTyxFQUFFLE1BQU07cUJBQ2xCO2lCQUNKLENBQUMsQ0FBQztZQUNYLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixFQUN4QjtnQkFDSSxLQUFLLEVBQUU7b0JBQ0gsZ0NBQWdDO29CQUNoQywrQkFBK0I7b0JBQy9CLFNBQVMsRUFBRSxDQUFDO2lCQUNmO2FBQ0osRUFDRDtnQkFDSSxJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQzNDLENBQUMsQ0FBQztRQUVYLENBQUMsQ0FBQyxDQUFDO1FBRUgsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFOUMsQ0FBQztJQUNMLHlCQUFDO0FBQUQsQ0FBQyxBQXhDRCxJQXdDQztBQ3hDRDtJQUEyQixnQ0FBbUI7SUFJMUMsc0JBQVksU0FBc0IsRUFBRSxLQUFZO1FBSnBELGlCQTZJQztRQXhJTyxpQkFBTyxDQUFDO1FBRVIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFbkIsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ2pDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFDMUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUMvQixLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQzthQUN4QyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO1FBQ3hDLFdBQVcsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRXBELENBQUM7SUFFRCw2QkFBTSxHQUFOLFVBQU8sS0FBZTtRQUF0QixpQkEwSEM7UUF6SEcsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM1QixJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFFbEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDWixDQUFDLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztZQUN4QixDQUFDLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ2hCLEVBQUUsRUFBRTtvQkFDQSxRQUFRLEVBQUUsVUFBQyxFQUFFO3dCQUNULEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzRCQUN6RCxJQUFNLElBQUksR0FBRyxFQUFFLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDOzRCQUMxQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQ0FDZCxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dDQUMxRCxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7NEJBQ3pCLENBQUM7d0JBQ0wsQ0FBQztvQkFDTCxDQUFDO2lCQUNKO2dCQUNELEtBQUssRUFBRTtvQkFDSCxJQUFJLEVBQUUsTUFBTTtpQkFDZjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0gsV0FBVyxFQUFFLHNCQUFzQjtpQkFDdEM7Z0JBQ0QsS0FBSyxFQUFFLEVBQ047YUFDSixDQUFDO1lBRUYsQ0FBQyxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUM7WUFDMUIsQ0FBQyxDQUFDLHdCQUF3QixFQUN0QjtnQkFDSSxLQUFLLEVBQUU7b0JBQ0gsSUFBSSxFQUFFLE1BQU07b0JBQ1osS0FBSyxFQUFFLE1BQU0sQ0FBQyxlQUFlO2lCQUNoQztnQkFDRCxJQUFJLEVBQUU7b0JBQ0YsTUFBTSxFQUFFLFVBQUMsS0FBSzt3QkFDVixPQUFBLFdBQVcsQ0FBQyxLQUFLLENBQ2IsS0FBSyxDQUFDLEdBQUcsRUFDVCxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUNsRCxVQUFBLEtBQUs7NEJBQ0QsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQ3pDLEVBQUUsZUFBZSxFQUFFLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUMzRCxDQUFDLENBQ0o7b0JBUEQsQ0FPQztvQkFDTCxNQUFNLEVBQUUsVUFBQyxRQUFRLEVBQUUsS0FBSzt3QkFDcEIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFDdkQsQ0FBQztvQkFDRCxPQUFPLEVBQUUsVUFBQyxLQUFLLElBQUssT0FBQSxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsQ0FBOEI7aUJBQ3JEO2FBQ0osQ0FBQztZQUVOLFVBQVUsQ0FBQyxRQUFRLENBQUM7Z0JBQ2hCLEVBQUUsRUFBRSxZQUFZO2dCQUNoQixPQUFPLEVBQUUsU0FBUztnQkFDbEIsS0FBSyxFQUFFO29CQUNIO3dCQUNJLE9BQU8sRUFBRSxLQUFLO3dCQUNkLE9BQU8sRUFBRTs0QkFDTCxLQUFLLEVBQUU7Z0NBQ0gsS0FBSyxFQUFFLG1CQUFtQjs2QkFDN0I7NEJBQ0QsRUFBRSxFQUFFO2dDQUNBLEtBQUssRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBM0MsQ0FBMkM7NkJBQzNEO3lCQUNKO3FCQUNKO29CQUNEO3dCQUNJLE9BQU8sRUFBRSxhQUFhO3dCQUN0QixPQUFPLEVBQUU7NEJBQ0wsS0FBSyxFQUFFO2dDQUNILEtBQUssRUFBRSxzQkFBc0I7NkJBQ2hDOzRCQUNELEVBQUUsRUFBRTtnQ0FDQSxLQUFLLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQWhELENBQWdEOzZCQUNoRTt5QkFDSjtxQkFDSjtvQkFDRDt3QkFDSSxPQUFPLEVBQUUsY0FBYzt3QkFDdkIsT0FBTyxFQUFFOzRCQUNMLEtBQUssRUFBRTtnQ0FDSCxLQUFLLEVBQUUsc0JBQXNCOzZCQUNoQzs0QkFDRCxFQUFFLEVBQUU7Z0NBQ0EsS0FBSyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFoRCxDQUFnRDs2QkFDaEU7eUJBQ0o7cUJBQ0o7b0JBQ0Q7d0JBQ0ksT0FBTyxFQUFFLFlBQVk7d0JBQ3JCLE9BQU8sRUFBRTs0QkFDTCxLQUFLLEVBQUU7Z0NBQ0gsS0FBSyxFQUFFLGtDQUFrQzs2QkFDNUM7NEJBQ0QsRUFBRSxFQUFFO2dDQUNBLEtBQUssRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBaEQsQ0FBZ0Q7NkJBQ2hFO3lCQUNKO3FCQUNKO29CQUNGO3dCQUNLLE9BQU8sRUFBRSxrQkFBa0I7d0JBQzNCLE9BQU8sRUFBRTs0QkFDTCxLQUFLLEVBQUU7Z0NBQ0gsS0FBSyxFQUFFLCtCQUErQjs2QkFDekM7NEJBQ0QsRUFBRSxFQUFFO2dDQUNBLEtBQUssRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBMUMsQ0FBMEM7NkJBQzFEO3lCQUNKO3FCQUNKO2lCQUNKO2FBQ0osQ0FBQztZQUVGLENBQUMsQ0FBQyxlQUFlLEVBQ2pCLEVBQUUsRUFDRjtnQkFDSSxDQUFDLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUN4RCxDQUFDO1NBRUwsQ0FDQSxDQUFDO0lBQ04sQ0FBQztJQUNMLG1CQUFDO0FBQUQsQ0FBQyxBQTdJRCxDQUEyQixTQUFTLEdBNkluQztBQzlJRDtJQUE4QixtQ0FBb0I7SUFHOUMseUJBQVksS0FBWTtRQUNwQixpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVELGdDQUFNLEdBQU4sVUFBTyxTQUFvQjtRQUEzQixpQkF1SEM7UUF0SEcsSUFBSSxNQUFNLEdBQUcsVUFBQSxFQUFFO1lBQ1gsRUFBRSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQ3ZCLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQztRQUVGLE1BQU0sQ0FBQyxDQUFDLENBQUMsdUJBQXVCLEVBQzVCO1lBQ0ksR0FBRyxFQUFFLFNBQVMsQ0FBQyxHQUFHO1NBQ3JCLEVBQ0Q7WUFDSSxDQUFDLENBQUMsVUFBVSxFQUNSO2dCQUNJLEtBQUssRUFBRSxFQUNOO2dCQUNELEtBQUssRUFBRTtvQkFDSCxLQUFLLEVBQUUsU0FBUyxDQUFDLElBQUk7aUJBQ3hCO2dCQUNELEVBQUUsRUFBRTtvQkFDQSxRQUFRLEVBQUUsVUFBQyxFQUFpQjt3QkFDeEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ3pELEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs0QkFDcEIsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUF3QixFQUFFLENBQUMsTUFBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7d0JBQzdELENBQUM7b0JBQ0wsQ0FBQztvQkFDRCxNQUFNLEVBQUUsVUFBQSxFQUFFLElBQUksT0FBQSxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFqQyxDQUFpQztpQkFDbEQ7YUFDSixDQUFDO1lBRU4sQ0FBQyxDQUFDLEtBQUssRUFDSCxFQUFFLEVBQ0Y7Z0JBQ0ksQ0FBQyxDQUFDLDBCQUEwQixFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxrQkFBa0IsRUFDaEI7b0JBQ0ksS0FBSyxFQUFFO3dCQUNILElBQUksRUFBRSxNQUFNO3FCQUNmO29CQUNELEtBQUssRUFBRTt3QkFDSCxLQUFLLEVBQUUsWUFBWTt3QkFDbkIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxTQUFTO3FCQUM3QjtvQkFDRCxJQUFJLEVBQUU7d0JBQ0YsTUFBTSxFQUFFLFVBQUMsS0FBSzs0QkFDVixPQUFBLFdBQVcsQ0FBQyxLQUFLLENBQ2IsS0FBSyxDQUFDLEdBQUcsRUFDVCxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUNsRCxVQUFBLEtBQUssSUFBSSxPQUFBLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBbkQsQ0FBbUQsQ0FDL0Q7d0JBSkQsQ0FJQzt3QkFDTCxPQUFPLEVBQUUsVUFBQyxLQUFLLElBQUssT0FBQSxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsQ0FBOEI7cUJBQ3JEO2lCQUNKLENBQUM7YUFDVCxDQUFDO1lBRU4sQ0FBQyxDQUFDLEtBQUssRUFDSCxFQUFFLEVBQ0Y7Z0JBQ0ksQ0FBQyxDQUFDLDBCQUEwQixFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyx3QkFBd0IsRUFDdEI7b0JBQ0ksS0FBSyxFQUFFO3dCQUNILElBQUksRUFBRSxNQUFNO3FCQUNmO29CQUNELEtBQUssRUFBRTt3QkFDSCxLQUFLLEVBQUUsa0JBQWtCO3dCQUN6QixLQUFLLEVBQUUsU0FBUyxDQUFDLGVBQWU7cUJBQ25DO29CQUNELElBQUksRUFBRTt3QkFDRixNQUFNLEVBQUUsVUFBQyxLQUFLOzRCQUNWLE9BQUEsV0FBVyxDQUFDLEtBQUssQ0FDYixLQUFLLENBQUMsR0FBRyxFQUNULGFBQWEsQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQ2xELFVBQUEsS0FBSyxJQUFJLE9BQUEsTUFBTSxDQUFDLEVBQUUsZUFBZSxFQUFFLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUF6RCxDQUF5RCxDQUNyRTt3QkFKRCxDQUlDO3dCQUNMLE9BQU8sRUFBRSxVQUFDLEtBQUssSUFBSyxPQUFBLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixDQUE4QjtxQkFDckQ7aUJBQ0osQ0FBQzthQUNULENBQUM7WUFFTixDQUFDLENBQUMsd0NBQXdDLEVBQ3RDO2dCQUNJLElBQUksRUFBRSxRQUFRO2dCQUNkLEtBQUssRUFBRTtvQkFDSCxLQUFLLEVBQUUsUUFBUTtpQkFDbEI7Z0JBQ0QsRUFBRSxFQUFFO29CQUNBLEtBQUssRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUF2RCxDQUF1RDtpQkFDdEU7YUFDSixFQUNEO2dCQUNJLENBQUMsQ0FBQyxnQ0FBZ0MsQ0FBQzthQUN0QyxDQUNKO1lBRUQsQ0FBQyxDQUFDLDJCQUEyQixFQUN6QjtnQkFDSSxJQUFJLEVBQUU7b0JBQ0YsTUFBTSxFQUFFLFVBQUMsS0FBSzt3QkFDVixPQUFBLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUM7b0JBQWhELENBQWdEO2lCQUN2RDthQWNKLEVBQ0QsRUFDQyxDQUNKO1NBRUosQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVMLHNCQUFDO0FBQUQsQ0FBQyxBQWpJRCxDQUE4QixTQUFTLEdBaUl0QztBQ2hJRDtJQWlCSSw2QkFBWSxLQUFZLEVBQUUsWUFBMkI7UUFqQnpELGlCQW9VQztRQS9URyxnQkFBVyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0MsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFTWixvQkFBZSxHQUF3QyxFQUFFLENBQUM7UUFHOUQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRTlCLElBQUksQ0FBQyxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdkUsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBRTdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07WUFDdEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILElBQU0sY0FBYyxHQUFHLFVBQUMsRUFBeUI7WUFDN0MsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JELENBQUM7UUFDTCxDQUFDLENBQUE7UUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNyRCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUVyRSxJQUFNLFVBQVUsR0FBRyxJQUFJLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWpELHVCQUF1QjtRQUV2QixLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7WUFDL0MsS0FBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDO1lBQy9DLElBQU0sUUFBUSxHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbkQsSUFBTSxJQUFJLEdBQUcsS0FBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ25DLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDO1lBQy9DLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsVUFBQyxDQUFDO1lBQzlDLElBQU0sT0FBTyxHQUFHLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDO2dCQUMzQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTzthQUN0QyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFxQjtRQUVyQixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUNoQyxVQUFBLEVBQUU7WUFDRSxLQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDdkIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNyQixLQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzNCLEtBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO1FBQzlCLENBQUMsQ0FDSixDQUFDO1FBRUYsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUM1QyxLQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNULElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakUsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsd0JBQXdCO1FBRXhCLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUNuQixLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQzVCLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FDaEMsQ0FBQyxTQUFTLENBQ1AsVUFBQSxFQUFFLElBQUksT0FBQSxLQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDO1FBRWxDLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVc7YUFDN0IsT0FBTyxFQUFFO2FBQ1QsUUFBUSxDQUFDLG1CQUFtQixDQUFDLDhCQUE4QixDQUFDO2FBQzVELFNBQVMsQ0FBQyxVQUFBLENBQUM7WUFDUixJQUFJLElBQUksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUc7b0JBQ2YsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO29CQUM5QixlQUFlLEVBQUUsU0FBUyxDQUFDLGVBQWU7aUJBQzdDLENBQUE7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFUCxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQUEsSUFBSTtZQUMvQyxJQUFNLElBQUksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNwRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMxQixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUE7UUFFRixLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUN0QyxJQUFJLElBQUksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2QsT0FBTyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7WUFDM0MsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzFCLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCx1Q0FBUyxHQUFUO1FBQ0ksSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFTywrQ0FBaUIsR0FBekI7UUFDSSxJQUFJLE1BQXVCLENBQUM7UUFDNUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLFVBQUMsSUFBSTtZQUNoQyxNQUFNLEdBQUcsTUFBTTtrQkFDVCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7a0JBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVixNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQzlDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTyw0Q0FBYyxHQUF0QjtRQUNJLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzNDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUQsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTyx5Q0FBVyxHQUFuQjtRQUNJLElBQUksVUFBc0IsQ0FBQztRQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUMxQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDekMsQ0FBQztRQUVELElBQUksR0FBRyxHQUFHLDBCQUEwQixHQUFHLGtCQUFrQixDQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEQsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRWhFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDYixVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEIsQ0FBQztJQUNMLENBQUM7SUFFTywrQ0FBaUIsR0FBekIsVUFBMEIsTUFBYyxFQUFFLFNBQWlCO1FBQ3ZELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLEtBQUssRUFDTCxHQUFHLENBQUMsQ0FBZ0IsVUFBa0MsRUFBbEMsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFsQyxjQUFrQyxFQUFsQyxJQUFrQyxDQUFDO1lBQWxELElBQU0sS0FBSyxTQUFBO1lBQ1osR0FBRyxDQUFDLENBQWUsVUFBc0IsRUFBdEIsS0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBdEIsY0FBc0IsRUFBdEIsSUFBc0IsQ0FBQztnQkFBckMsSUFBTSxJQUFJLFNBQUE7Z0JBQ1gsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7d0JBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQztvQkFDN0IsSUFBSSxJQUFJLElBQUksQ0FBQztnQkFDakIsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ2hCLENBQUM7YUFDSjtTQUNKO1FBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksR0FBRyxRQUFRLENBQUM7UUFDcEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssOENBQWdCLEdBQXhCO1FBQ0ksSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDeEMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDNUQsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQ3BDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUMvQixNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztRQUMvRCxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDeEIsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBRU8sc0NBQVEsR0FBaEIsVUFBaUIsU0FBb0I7UUFBckMsaUJBc0dDO1FBckdHLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNiLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDMUQsQ0FBQztRQUVELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUCxPQUFPLENBQUMsS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7WUFDcEUsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUVELElBQUksTUFBMEQsQ0FBQztRQUUvRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFNLFdBQVcsR0FBRyxVQUFDLE1BQXFCO2dCQUN0QyxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN6QixNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUNwQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzFCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3ZDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakQsQ0FBQztnQkFDRCxnREFBZ0Q7Z0JBQ2hELE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDO1lBQ0YsTUFBTSxHQUFHO2dCQUNMLEtBQUssRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztnQkFDdEQsS0FBSyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO2FBQzVELENBQUM7UUFDTixDQUFDO1FBRUQsSUFBSSxHQUFHLElBQUksUUFBUSxDQUNmLElBQUksQ0FBQyxZQUFZLEVBQ2pCLFNBQVMsQ0FBQyxJQUFJLEVBQ2QsTUFBTSxFQUNOLElBQUksRUFBRTtZQUNGLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxJQUFJLEtBQUs7WUFDdkMsZUFBZSxFQUFFLFNBQVMsQ0FBQyxlQUFlO1NBQzdDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVELElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFBLEVBQUU7WUFFL0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLDBCQUEwQjtnQkFDMUIsSUFBSSxTQUFTLEdBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLGVBQWUsQ0FBRTtxQkFDdkQsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUF4QyxDQUF3QyxDQUFDLENBQUM7Z0JBQzNELElBQU0sV0FBUyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEtBQUssRUFBUCxDQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsRUFBRSxDQUFDLENBQUMsV0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDWixXQUFTLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ3pCLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLGVBQWUsRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsS0FBSyxXQUFTLEVBQWYsQ0FBZSxDQUFDLENBQUM7b0JBQ3RFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1YsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQzNDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztvQkFDcEQsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDcEIsRUFBRSxDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUEsQ0FBQztvQkFDZixLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FDM0MsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztnQkFDMUQsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsVUFBQSxFQUFFO1lBQzdDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FDM0MsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUMxRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFVBQUEsRUFBRTtZQUMzQyxJQUFJLEtBQUssR0FBYyxLQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEQsS0FBSyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQzFCLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvRSxXQUFXO2FBQ04sUUFBUSxDQUFDLG1CQUFtQixDQUFDLCtCQUErQixDQUFDO2FBQzdELFNBQVMsQ0FBQztZQUNQLElBQUksS0FBSyxHQUFjLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RCxLQUFLLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7WUFDMUIsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7UUFFUCxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7UUFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUM5QyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztpQkFDekQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEIsQ0FBQztRQUNELElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUMvQyxDQUFDO0lBRU8saURBQW1CLEdBQTNCLFVBQTRCLElBQWM7UUFDdEMsZ0VBQWdFO1FBQ2hFLHlCQUF5QjtRQUN6QixJQUFNLEdBQUcsR0FBZSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLElBQU0sTUFBTSxHQUFlLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekUsTUFBTSxDQUFDO1lBQ0gsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDNUMsT0FBTyxFQUFFLEVBQUUsS0FBQSxHQUFHLEVBQUUsUUFBQSxNQUFNLEVBQUU7U0FDM0IsQ0FBQTtJQUNMLENBQUM7SUFqVU0sa0RBQThCLEdBQUcsR0FBRyxDQUFDO0lBQ3JDLG1EQUErQixHQUFHLEdBQUcsQ0FBQztJQWlVakQsMEJBQUM7QUFBRCxDQUFDLEFBcFVELElBb1VDO0FDbFVEO0lBT0ksOEJBQVksTUFBWSxFQUFFLElBQVU7UUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxnRkFBZ0Y7SUFDaEYsMkVBQTJFO0lBQzNFLGdGQUFnRjtJQUNoRiw2Q0FBYyxHQUFkLFVBQWUsS0FBa0I7UUFDN0IsSUFBSSxFQUFFLEdBQUcsb0JBQW9CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVNLGlDQUFZLEdBQW5CLFVBQW9CLE1BQVksRUFBRSxNQUFZO1FBRTFDLElBQUksWUFBWSxHQUFHO1lBQ2YsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsSUFBSSxZQUFZLEdBQUc7WUFDZixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNsRSxJQUFJLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFH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QUFDO1FBQy9CLEVBQUUsQ0FBQSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQztZQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDTCxlQUFDO0FBQUQsQ0FBQyxBQW5KRCxJQW1KQztBRWxKRDtJQUVJLElBQU0sTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7SUFDL0IsSUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsSUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsRixJQUFNLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVuRyxNQUFNLENBQUMsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUM5RSxDQUFDO0FBRUQsWUFBWSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFFbkMsSUFBTSxHQUFHLEdBQUcsU0FBUyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxubmFtZXNwYWNlIERvbUhlbHBlcnMge1xyXG4gICAgXHJcbiAgICAvLyAgaHR0cHM6Ly9zdXBwb3J0Lm1vemlsbGEub3JnL2VuLVVTL3F1ZXN0aW9ucy85Njg5OTJcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkb3dubG9hZEZpbGUoZGF0YVVybDogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nKXtcclxuICAgICAgICB2YXIgbGluayA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgbGluay5pZCA9IG5ld2lkKCk7XHJcbiAgICAgICAgbGluay5kb3dubG9hZCA9IGZpbGVuYW1lO1xyXG4gICAgICAgIGxpbmsuaHJlZiA9IGRhdGFVcmw7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgICAgICBsaW5rLnRhcmdldCA9IFwiX3NlbGZcIjtcclxuICAgICAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBibG9iIGZyb20gYSBkYXRhIFVSTCAoZWl0aGVyIGJhc2U2NCBlbmNvZGVkIG9yIG5vdCkuXHJcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vZWJpZGVsL2ZpbGVyLmpzL2Jsb2IvbWFzdGVyL3NyYy9maWxlci5qcyNMMTM3XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGRhdGFVUkwgVGhlIGRhdGEgVVJMIHRvIGNvbnZlcnQuXHJcbiAgICAgKiBAcmV0dXJuIHtCbG9ifSBBIGJsb2IgcmVwcmVzZW50aW5nIHRoZSBhcnJheSBidWZmZXIgZGF0YS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRhdGFVUkxUb0Jsb2IoZGF0YVVSTCk6IEJsb2Ige1xyXG4gICAgICAgIHZhciBCQVNFNjRfTUFSS0VSID0gJztiYXNlNjQsJztcclxuICAgICAgICBpZiAoZGF0YVVSTC5pbmRleE9mKEJBU0U2NF9NQVJLRVIpID09IC0xKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IGRhdGFVUkwuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnRUeXBlID0gcGFydHNbMF0uc3BsaXQoJzonKVsxXTtcclxuICAgICAgICAgICAgdmFyIHJhdyA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEJsb2IoW3Jhd10sIHt0eXBlOiBjb250ZW50VHlwZX0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBhcnRzID0gZGF0YVVSTC5zcGxpdChCQVNFNjRfTUFSS0VSKTtcclxuICAgICAgICB2YXIgY29udGVudFR5cGUgPSBwYXJ0c1swXS5zcGxpdCgnOicpWzFdO1xyXG4gICAgICAgIHZhciByYXcgPSB3aW5kb3cuYXRvYihwYXJ0c1sxXSk7XHJcbiAgICAgICAgdmFyIHJhd0xlbmd0aCA9IHJhdy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHZhciB1SW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkocmF3TGVuZ3RoKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdMZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB1SW50OEFycmF5W2ldID0gcmF3LmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEJsb2IoW3VJbnQ4QXJyYXldLCB7dHlwZTogY29udGVudFR5cGV9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgS2V5Q29kZXMgPSB7XHJcbiAgICAgICAgQmFja1NwYWNlICAgICAgICAgICA6IDggICxcclxuICAgICAgICBUYWIgICAgICAgICAgICAgICAgIDogOSAgLFxyXG4gICAgICAgIEVudGVyICAgICAgICAgICAgICAgOiAxMyAsXHJcbiAgICAgICAgU2hpZnQgICAgICAgICAgICAgICA6IDE2ICxcclxuICAgICAgICBDdHJsICAgICAgICAgICAgICAgIDogMTcgLFxyXG4gICAgICAgIEFsdCAgICAgICAgICAgICAgICAgOiAxOCAsXHJcbiAgICAgICAgUGF1c2VCcmVhayAgICAgICAgICA6IDE5ICxcclxuICAgICAgICBDYXBzTG9jayAgICAgICAgICAgIDogMjAgLFxyXG4gICAgICAgIEVzYyAgICAgICAgICAgICAgICAgOiAyNyAsXHJcbiAgICAgICAgUGFnZVVwICAgICAgICAgICAgICA6IDMzICxcclxuICAgICAgICBQYWdlRG93biAgICAgICAgICAgIDogMzQgLFxyXG4gICAgICAgIEVuZCAgICAgICAgICAgICAgICAgOiAzNSAsXHJcbiAgICAgICAgSG9tZSAgICAgICAgICAgICAgICA6IDM2ICxcclxuICAgICAgICBBcnJvd0xlZnQgICAgICAgICAgIDogMzcgLFxyXG4gICAgICAgIEFycm93VXAgICAgICAgICAgICAgOiAzOCAsXHJcbiAgICAgICAgQXJyb3dSaWdodCAgICAgICAgICA6IDM5ICxcclxuICAgICAgICBBcnJvd0Rvd24gICAgICAgICAgIDogNDAgLFxyXG4gICAgICAgIEluc2VydCAgICAgICAgICAgICAgOiA0NSAsXHJcbiAgICAgICAgRGVsZXRlICAgICAgICAgICAgICA6IDQ2ICxcclxuICAgICAgICBEaWdpdDAgICAgICAgICAgICAgIDogNDggLFxyXG4gICAgICAgIERpZ2l0MSAgICAgICAgICAgICAgOiA0OSAsXHJcbiAgICAgICAgRGlnaXQyICAgICAgICAgICAgICA6IDUwICxcclxuICAgICAgICBEaWdpdDMgICAgICAgICAgICAgIDogNTEgLFxyXG4gICAgICAgIERpZ2l0NCAgICAgICAgICAgICAgOiA1MiAsXHJcbiAgICAgICAgRGlnaXQ1ICAgICAgICAgICAgICA6IDUzICxcclxuICAgICAgICBEaWdpdDYgICAgICAgICAgICAgIDogNTQgLFxyXG4gICAgICAgIERpZ2l0NyAgICAgICAgICAgICAgOiA1NSAsXHJcbiAgICAgICAgRGlnaXQ4ICAgICAgICAgICAgICA6IDU2ICxcclxuICAgICAgICBEaWdpdDkgICAgICAgICAgICAgIDogNTcgLFxyXG4gICAgICAgIEEgICAgICAgICAgICAgICAgICAgOiA2NSAsXHJcbiAgICAgICAgQiAgICAgICAgICAgICAgICAgICA6IDY2ICxcclxuICAgICAgICBDICAgICAgICAgICAgICAgICAgIDogNjcgLFxyXG4gICAgICAgIEQgICAgICAgICAgICAgICAgICAgOiA2OCAsXHJcbiAgICAgICAgRSAgICAgICAgICAgICAgICAgICA6IDY5ICxcclxuICAgICAgICBGICAgICAgICAgICAgICAgICAgIDogNzAgLFxyXG4gICAgICAgIEcgICAgICAgICAgICAgICAgICAgOiA3MSAsXHJcbiAgICAgICAgSCAgICAgICAgICAgICAgICAgICA6IDcyICxcclxuICAgICAgICBJICAgICAgICAgICAgICAgICAgIDogNzMgLFxyXG4gICAgICAgIEogICAgICAgICAgICAgICAgICAgOiA3NCAsXHJcbiAgICAgICAgSyAgICAgICAgICAgICAgICAgICA6IDc1ICxcclxuICAgICAgICBMICAgICAgICAgICAgICAgICAgIDogNzYgLFxyXG4gICAgICAgIE0gICAgICAgICAgICAgICAgICAgOiA3NyAsXHJcbiAgICAgICAgTiAgICAgICAgICAgICAgICAgICA6IDc4ICxcclxuICAgICAgICBPICAgICAgICAgICAgICAgICAgIDogNzkgLFxyXG4gICAgICAgIFAgICAgICAgICAgICAgICAgICAgOiA4MCAsXHJcbiAgICAgICAgUSAgICAgICAgICAgICAgICAgICA6IDgxICxcclxuICAgICAgICBSICAgICAgICAgICAgICAgICAgIDogODIgLFxyXG4gICAgICAgIFMgICAgICAgICAgICAgICAgICAgOiA4MyAsXHJcbiAgICAgICAgVCAgICAgICAgICAgICAgICAgICA6IDg0ICxcclxuICAgICAgICBVICAgICAgICAgICAgICAgICAgIDogODUgLFxyXG4gICAgICAgIFYgICAgICAgICAgICAgICAgICAgOiA4NiAsXHJcbiAgICAgICAgVyAgICAgICAgICAgICAgICAgICA6IDg3ICxcclxuICAgICAgICBYICAgICAgICAgICAgICAgICAgIDogODggLFxyXG4gICAgICAgIFkgICAgICAgICAgICAgICAgICAgOiA4OSAsXHJcbiAgICAgICAgWiAgICAgICAgICAgICAgICAgICA6IDkwICxcclxuICAgICAgICBXaW5kb3dMZWZ0ICAgICAgICAgIDogOTEgLFxyXG4gICAgICAgIFdpbmRvd1JpZ2h0ICAgICAgICAgOiA5MiAsXHJcbiAgICAgICAgU2VsZWN0S2V5ICAgICAgICAgICA6IDkzICxcclxuICAgICAgICBOdW1wYWQwICAgICAgICAgICAgIDogOTYgLFxyXG4gICAgICAgIE51bXBhZDEgICAgICAgICAgICAgOiA5NyAsXHJcbiAgICAgICAgTnVtcGFkMiAgICAgICAgICAgICA6IDk4ICxcclxuICAgICAgICBOdW1wYWQzICAgICAgICAgICAgIDogOTkgLFxyXG4gICAgICAgIE51bXBhZDQgICAgICAgICAgICAgOiAxMDAsXHJcbiAgICAgICAgTnVtcGFkNSAgICAgICAgICAgICA6IDEwMSxcclxuICAgICAgICBOdW1wYWQ2ICAgICAgICAgICAgIDogMTAyLFxyXG4gICAgICAgIE51bXBhZDcgICAgICAgICAgICAgOiAxMDMsIFxyXG4gICAgICAgIE51bXBhZDggICAgICAgICAgICAgOiAxMDQsXHJcbiAgICAgICAgTnVtcGFkOSAgICAgICAgICAgICA6IDEwNSxcclxuICAgICAgICBNdWx0aXBseSAgICAgICAgICAgIDogMTA2LFxyXG4gICAgICAgIEFkZCAgICAgICAgICAgICAgICAgOiAxMDcsXHJcbiAgICAgICAgU3VidHJhY3QgICAgICAgICAgICA6IDEwOSxcclxuICAgICAgICBEZWNpbWFsUG9pbnQgICAgICAgIDogMTEwLFxyXG4gICAgICAgIERpdmlkZSAgICAgICAgICAgICAgOiAxMTEsXHJcbiAgICAgICAgRjEgICAgICAgICAgICAgICAgICA6IDExMixcclxuICAgICAgICBGMiAgICAgICAgICAgICAgICAgIDogMTEzLFxyXG4gICAgICAgIEYzICAgICAgICAgICAgICAgICAgOiAxMTQsXHJcbiAgICAgICAgRjQgICAgICAgICAgICAgICAgICA6IDExNSxcclxuICAgICAgICBGNSAgICAgICAgICAgICAgICAgIDogMTE2LFxyXG4gICAgICAgIEY2ICAgICAgICAgICAgICAgICAgOiAxMTcsXHJcbiAgICAgICAgRjcgICAgICAgICAgICAgICAgICA6IDExOCxcclxuICAgICAgICBGOCAgICAgICAgICAgICAgICAgIDogMTE5LFxyXG4gICAgICAgIEY5ICAgICAgICAgICAgICAgICAgOiAxMjAsXHJcbiAgICAgICAgRjEwICAgICAgICAgICAgICAgICA6IDEyMSxcclxuICAgICAgICBGMTEgICAgICAgICAgICAgICAgIDogMTIyLFxyXG4gICAgICAgIEYxMiAgICAgICAgICAgICAgICAgOiAxMjMsXHJcbiAgICAgICAgTnVtTG9jayAgICAgICAgICAgICA6IDE0NCxcclxuICAgICAgICBTY3JvbGxMb2NrICAgICAgICAgIDogMTQ1LFxyXG4gICAgICAgIFNlbWlDb2xvbiAgICAgICAgICAgOiAxODYsXHJcbiAgICAgICAgRXF1YWwgICAgICAgICAgICAgICA6IDE4NyxcclxuICAgICAgICBDb21tYSAgICAgICAgICAgICAgIDogMTg4LFxyXG4gICAgICAgIERhc2ggICAgICAgICAgICAgICAgOiAxODksXHJcbiAgICAgICAgUGVyaW9kICAgICAgICAgICAgICA6IDE5MCxcclxuICAgICAgICBGb3J3YXJkU2xhc2ggICAgICAgIDogMTkxLFxyXG4gICAgICAgIEdyYXZlQWNjZW50ICAgICAgICAgOiAxOTIsXHJcbiAgICAgICAgQnJhY2tldE9wZW4gICAgICAgICA6IDIxOSxcclxuICAgICAgICBCYWNrU2xhc2ggICAgICAgICAgIDogMjIwLFxyXG4gICAgICAgIEJyYWNrZXRDbG9zZSAgICAgICAgOiAyMjEsXHJcbiAgICAgICAgU2luZ2xlUXVvdGUgICAgICAgICA6IDIyMiBcclxuICAgIH07XHJcbiAgICBcclxufSIsIlxyXG5uYW1lc3BhY2UgRm9udEhlbHBlcnMge1xyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEVsZW1lbnRGb250U3R5bGUge1xyXG4gICAgICAgIGZvbnRGYW1pbHk/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFdlaWdodD86IHN0cmluZztcclxuICAgICAgICBmb250U3R5bGU/OiBzdHJpbmc7IFxyXG4gICAgICAgIGZvbnRTaXplPzogc3RyaW5nOyBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldENzc1N0eWxlKGZhbWlseTogc3RyaW5nLCB2YXJpYW50OiBzdHJpbmcsIHNpemU/OiBzdHJpbmcpe1xyXG4gICAgICAgIGxldCBzdHlsZSA9IDxFbGVtZW50Rm9udFN0eWxlPnsgZm9udEZhbWlseTogZmFtaWx5IH07XHJcbiAgICAgICAgaWYodmFyaWFudCAmJiB2YXJpYW50LmluZGV4T2YoXCJpdGFsaWNcIikgPj0gMCl7XHJcbiAgICAgICAgICAgIHN0eWxlLmZvbnRTdHlsZSA9IFwiaXRhbGljXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBudW1lcmljID0gdmFyaWFudCAmJiB2YXJpYW50LnJlcGxhY2UoL1teXFxkXS9nLCBcIlwiKTtcclxuICAgICAgICBpZihudW1lcmljICYmIG51bWVyaWMubGVuZ3RoKXtcclxuICAgICAgICAgICAgc3R5bGUuZm9udFdlaWdodCA9IG51bWVyaWMudG9TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc2l6ZSl7XHJcbiAgICAgICAgICAgIHN0eWxlLmZvbnRTaXplID0gc2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0eWxlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0U3R5bGVTdHJpbmcoZmFtaWx5OiBzdHJpbmcsIHZhcmlhbnQ6IHN0cmluZywgc2l6ZT86IHN0cmluZykge1xyXG4gICAgICAgIGxldCBzdHlsZU9iaiA9IGdldENzc1N0eWxlKGZhbWlseSwgdmFyaWFudCwgc2l6ZSk7XHJcbiAgICAgICAgbGV0IHBhcnRzID0gW107XHJcbiAgICAgICAgaWYoc3R5bGVPYmouZm9udEZhbWlseSl7XHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goYGZvbnQtZmFtaWx5Oicke3N0eWxlT2JqLmZvbnRGYW1pbHl9J2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzdHlsZU9iai5mb250V2VpZ2h0KXtcclxuICAgICAgICAgICAgcGFydHMucHVzaChgZm9udC13ZWlnaHQ6JHtzdHlsZU9iai5mb250V2VpZ2h0fWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzdHlsZU9iai5mb250U3R5bGUpe1xyXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LXN0eWxlOiR7c3R5bGVPYmouZm9udFN0eWxlfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzdHlsZU9iai5mb250U2l6ZSl7XHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goYGZvbnQtc2l6ZToke3N0eWxlT2JqLmZvbnRTaXplfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFydHMuam9pbihcIjsgXCIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0RGVzY3JpcHRpb24oZmFtaWx5OiBGb250RmFtaWx5LCB2YXJpYW50Pzogc3RyaW5nKTogRm9udERlc2NyaXB0aW9uIHtcclxuICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XHJcbiAgICAgICAgdXJsID0gZmFtaWx5LmZpbGVzW3ZhcmlhbnQgfHwgXCJyZWd1bGFyXCJdO1xyXG4gICAgICAgIGlmKCF1cmwpe1xyXG4gICAgICAgICAgICB1cmwgPSBmYW1pbHkuZmlsZXNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZhbWlseTogZmFtaWx5LmZhbWlseSxcclxuICAgICAgICAgICAgY2F0ZWdvcnk6IGZhbWlseS5jYXRlZ29yeSxcclxuICAgICAgICAgICAgdmFyaWFudDogdmFyaWFudCxcclxuICAgICAgICAgICAgdXJsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJcclxuZnVuY3Rpb24gbG9ndGFwPFQ+KG1lc3NhZ2U6IHN0cmluZywgc3RyZWFtOiBSeC5PYnNlcnZhYmxlPFQ+KTogUnguT2JzZXJ2YWJsZTxUPntcclxuICAgIHJldHVybiBzdHJlYW0udGFwKHQgPT4gY29uc29sZS5sb2cobWVzc2FnZSwgdCkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBuZXdpZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSgpLmdldFRpbWUoKSArIE1hdGgucmFuZG9tKCkpXHJcbiAgICAgICAgLnRvU3RyaW5nKDM2KS5yZXBsYWNlKCcuJywgJycpO1xyXG59XHJcbiIsIlxyXG5uYW1lc3BhY2UgVHlwZWRDaGFubmVsIHtcclxuXHJcbiAgICAvLyAtLS0gQ29yZSB0eXBlcyAtLS1cclxuXHJcbiAgICB0eXBlIFNlcmlhbGl6YWJsZSA9IE9iamVjdCB8IEFycmF5PGFueT4gfCBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuIHwgRGF0ZSB8IHZvaWQ7XHJcblxyXG4gICAgdHlwZSBWYWx1ZSA9IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBEYXRlO1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZTxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4ge1xyXG4gICAgICAgIHR5cGU6IHN0cmluZztcclxuICAgICAgICBkYXRhPzogVERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZSBJU3ViamVjdDxUPiA9IFJ4Lk9ic2VydmVyPFQ+ICYgUnguT2JzZXJ2YWJsZTxUPjtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbFRvcGljPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIGNoYW5uZWw6IElTdWJqZWN0PE1lc3NhZ2U8VERhdGE+PjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY2hhbm5lbDogSVN1YmplY3Q8TWVzc2FnZTxURGF0YT4+LCB0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YnNjcmliZShvYnNlcnZlcjogKG1lc3NhZ2U6IE1lc3NhZ2U8VERhdGE+KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgpLnN1YnNjcmliZShvYnNlcnZlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWJzY3JpYmVEYXRhKG9ic2VydmVyOiAoZGF0YTogVERhdGEpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCkuc3Vic2NyaWJlKG0gPT4gb2JzZXJ2ZXIobS5kYXRhKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpc3BhdGNoKGRhdGE/OiBURGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwub25OZXh0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5maWx0ZXIobSA9PiBtLnR5cGUgPT09IHRoaXMudHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcndhcmQoY2hhbm5lbDogQ2hhbm5lbFRvcGljPFREYXRhPikge1xyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZShtID0+IGNoYW5uZWwuZGlzcGF0Y2gobS5kYXRhKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDaGFubmVsIHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBzdWJqZWN0OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihzdWJqZWN0PzogSVN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGU+PiwgdHlwZT86IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnN1YmplY3QgPSBzdWJqZWN0IHx8IG5ldyBSeC5TdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4oKTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YnNjcmliZShvbk5leHQ/OiAodmFsdWU6IE1lc3NhZ2U8U2VyaWFsaXphYmxlPikgPT4gdm9pZCk6IFJ4LklEaXNwb3NhYmxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5zdWJzY3JpYmUob25OZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvcGljPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPih0eXBlOiBzdHJpbmcpIDogQ2hhbm5lbFRvcGljPFREYXRhPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ2hhbm5lbFRvcGljPFREYXRhPih0aGlzLnN1YmplY3QgYXMgSVN1YmplY3Q8TWVzc2FnZTxURGF0YT4+LFxyXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID8gdGhpcy50eXBlICsgJy4nICsgdHlwZSA6IHR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBtZXJnZVR5cGVkPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiguLi50b3BpY3M6IENoYW5uZWxUb3BpYzxURGF0YT5bXSkgXHJcbiAgICAgICAgICAgIDogUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhPj4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRvcGljcy5tYXAodCA9PiB0LnR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmZpbHRlcihtID0+IHR5cGVzLmluZGV4T2YobS50eXBlKSA+PSAwICkgYXMgUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhPj47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lcmdlKC4uLnRvcGljczogQ2hhbm5lbFRvcGljPFNlcmlhbGl6YWJsZT5bXSkgXHJcbiAgICAgICAgICAgIDogUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+IHtcclxuICAgICAgICAgICAgY29uc3QgdHlwZXMgPSB0b3BpY3MubWFwKHQgPT4gdC50eXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5maWx0ZXIobSA9PiB0eXBlcy5pbmRleE9mKG0udHlwZSkgPj0gMCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIiwiXHJcbnR5cGUgRGljdGlvbmFyeTxUPiA9IF8uRGljdGlvbmFyeTxUPjtcclxuIiwiXHJcbmNsYXNzIE9ic2VydmFibGVFdmVudDxUPiB7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3N1YnNjcmliZXJzOiAoKGV2ZW50QXJnOiBUKSA9PiB2b2lkKVtdID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJzY3JpYmUgZm9yIG5vdGlmaWNhdGlvbi4gUmV0dXJucyB1bnN1YnNjcmliZSBmdW5jdGlvbi5cclxuICAgICAqLyAgICBcclxuICAgIHN1YnNjcmliZShoYW5kbGVyOiAoZXZlbnRBcmc6IFQpID0+IHZvaWQpOiAoKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoaGFuZGxlcikgPCAwKXtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMucHVzaChoYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHRoaXMudW5zdWJzY3JpYmUoaGFuZGxlcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHVuc3Vic2NyaWJlKGNhbGxiYWNrOiAoZXZlbnRBcmc6IFQpID0+IHZvaWQpIHtcclxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGNhbGxiYWNrLCAwKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIGxldCB1bnN1YjogYW55O1xyXG4gICAgICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm48VD4oXHJcbiAgICAgICAgICAgIChoYW5kbGVyVG9BZGQpID0+IHRoaXMuc3Vic2NyaWJlKDwoZXZlbnRBcmc6IFQpID0+IHZvaWQ+aGFuZGxlclRvQWRkKSxcclxuICAgICAgICAgICAgKGhhbmRsZXJUb1JlbW92ZSkgPT4gdGhpcy51bnN1YnNjcmliZSg8KGV2ZW50QXJnOiBUKSA9PiB2b2lkPmhhbmRsZXJUb1JlbW92ZSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmb3Igb25lIG5vdGlmaWNhdGlvbi5cclxuICAgICAqL1xyXG4gICAgc3Vic2NyaWJlT25lKGNhbGxiYWNrOiAoZXZlbnRBcmc6IFQpID0+IHZvaWQpe1xyXG4gICAgICAgIGxldCB1bnN1YiA9IHRoaXMuc3Vic2NyaWJlKHQgPT4ge1xyXG4gICAgICAgICAgICB1bnN1YigpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayh0KTsgICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbm90aWZ5KGV2ZW50QXJnOiBUKXtcclxuICAgICAgICBmb3IobGV0IHN1YnNjcmliZXIgb2YgdGhpcy5fc3Vic2NyaWJlcnMpe1xyXG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNhbGwodGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBzdWJzY3JpYmVycy5cclxuICAgICAqL1xyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcclxuICAgIH1cclxufSIsIlxyXG5uYW1lc3BhY2UgQm9vdFNjcmlwdCB7XHJcblxyXG4gICAgaW50ZXJmYWNlIE1lbnVJdGVtIHtcclxuICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgb3B0aW9ucz86IE9iamVjdFxyXG4gICAgICAgIC8vb25DbGljaz86ICgpID0+IHZvaWRcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZHJvcGRvd24oXHJcbiAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgICBpZDogc3RyaW5nLFxyXG4gICAgICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgICAgIGl0ZW1zOiBNZW51SXRlbVtdXHJcbiAgICAgICAgfSk6IFZOb2RlIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXYuZHJvcGRvd25cIiwgW1xyXG4gICAgICAgICAgICBoKFwiYnV0dG9uLmJ0bi5idG4tZGVmYXVsdC5kcm9wZG93bi10b2dnbGVcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImF0dHJzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFyZ3MuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS10b2dnbGVcIjogXCJkcm9wZG93blwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgYXJncy5jb250ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuLmNhcmV0XCIpXHJcbiAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgaChcInVsLmRyb3Bkb3duLW1lbnVcIixcclxuICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgYXJncy5pdGVtcy5tYXAoaXRlbSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJsaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoJ2EnLCBpdGVtLm9wdGlvbnMgfHwge30sIFtpdGVtLmNvbnRlbnRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5pbnRlcmZhY2UgQ29uc29sZSB7XHJcbiAgICBsb2cobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZDtcclxuICAgIGxvZyguLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkO1xyXG59XHJcblxyXG5uYW1lc3BhY2UgUGFwZXJIZWxwZXJzIHtcclxuXHJcbiAgICBleHBvcnQgdmFyIHNob3VsZExvZ0luZm86IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3QgbG9nID0gZnVuY3Rpb24oLi4ucGFyYW1zOiBhbnlbXSkge1xyXG4gICAgICAgIGlmIChzaG91bGRMb2dJbmZvKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLnBhcmFtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBpbXBvcnRPcGVuVHlwZVBhdGggPSBmdW5jdGlvbihvcGVuUGF0aDogb3BlbnR5cGUuUGF0aCk6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgob3BlblBhdGgudG9QYXRoRGF0YSgpKTtcclxuXHJcbiAgICAgICAgLy8gbGV0IHN2ZyA9IG9wZW5QYXRoLnRvU1ZHKDQpO1xyXG4gICAgICAgIC8vIHJldHVybiA8cGFwZXIuUGF0aD5wYXBlci5wcm9qZWN0LmltcG9ydFNWRyhzdmcpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCB0cmFjZVBhdGhJdGVtID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aEl0ZW0sIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLlBhdGhJdGVtIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNlQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgdHJhY2VDb21wb3VuZFBhdGggPSBmdW5jdGlvbihwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgsIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgaWYgKCFwYXRoLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBhdGhzID0gcGF0aC5jaGlsZHJlbi5tYXAocCA9PlxyXG4gICAgICAgICAgICB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wLCBwb2ludHNQZXJQYXRoKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgoe1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogcGF0aHMsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCB0cmFjZVBhdGhBc1BvaW50cyA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGgsIG51bVBvaW50czogbnVtYmVyKTogcGFwZXIuUG9pbnRbXSB7XHJcbiAgICAgICAgbGV0IHBhdGhMZW5ndGggPSBwYXRoLmxlbmd0aDtcclxuICAgICAgICBsZXQgb2Zmc2V0SW5jciA9IHBhdGhMZW5ndGggLyBudW1Qb2ludHM7XHJcbiAgICAgICAgbGV0IHBvaW50cyA9IFtdO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGkrKyA8IG51bVBvaW50cykge1xyXG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBwYXRoLmdldFBvaW50QXQoTWF0aC5taW4ob2Zmc2V0LCBwYXRoTGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IG9mZnNldEluY3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcG9pbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCB0cmFjZVBhdGggPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoLCBudW1Qb2ludHM6IG51bWJlcik6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgIGxldCBwb2ludHMgPSBQYXBlckhlbHBlcnMudHJhY2VQYXRoQXNQb2ludHMocGF0aCwgbnVtUG9pbnRzKTtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlBhdGgoe1xyXG4gICAgICAgICAgICBzZWdtZW50czogcG9pbnRzLFxyXG4gICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgZHVhbEJvdW5kc1BhdGhQcm9qZWN0aW9uID0gZnVuY3Rpb24odG9wUGF0aDogcGFwZXIuQ3VydmVsaWtlLCBib3R0b21QYXRoOiBwYXBlci5DdXJ2ZWxpa2UpXHJcbiAgICAgICAgOiAodW5pdFBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIGNvbnN0IHRvcFBhdGhMZW5ndGggPSB0b3BQYXRoLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBib3R0b21QYXRoTGVuZ3RoID0gYm90dG9tUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgICAgIGxldCB0b3BQb2ludCA9IHRvcFBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIHRvcFBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgICBsZXQgYm90dG9tUG9pbnQgPSBib3R0b21QYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiBib3R0b21QYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICAgaWYgKHRvcFBvaW50ID09IG51bGwgfHwgYm90dG9tUG9pbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJjb3VsZCBub3QgZ2V0IHByb2plY3RlZCBwb2ludCBmb3IgdW5pdCBwb2ludCBcIiArIHVuaXRQb2ludC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0b3BQb2ludC5hZGQoYm90dG9tUG9pbnQuc3VidHJhY3QodG9wUG9pbnQpLm11bHRpcGx5KHVuaXRQb2ludC55KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFya2VyR3JvdXA6IHBhcGVyLkdyb3VwO1xyXG5cclxuICAgIGV4cG9ydCBjb25zdCByZXNldE1hcmtlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwKSB7XHJcbiAgICAgICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya2VyR3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICBtYXJrZXJHcm91cC5vcGFjaXR5ID0gMC4yO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgbWFya2VyTGluZSA9IGZ1bmN0aW9uKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIGxldCBsaW5lID0gcGFwZXIuUGF0aC5MaW5lKGEsIGIpO1xyXG4gICAgICAgIGxpbmUuc3Ryb2tlQ29sb3IgPSAnZ3JlZW4nO1xyXG4gICAgICAgIC8vbGluZS5kYXNoQXJyYXkgPSBbNSwgNV07XHJcbiAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLmFkZENoaWxkKGxpbmUpO1xyXG4gICAgICAgIHJldHVybiBsaW5lO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBtYXJrZXIgPSBmdW5jdGlvbihwb2ludDogcGFwZXIuUG9pbnQsIGxhYmVsOiBzdHJpbmcpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICAvL2xldCBtYXJrZXIgPSBwYXBlci5TaGFwZS5DaXJjbGUocG9pbnQsIDEwKTtcclxuICAgICAgICBsZXQgbWFya2VyID0gbmV3IHBhcGVyLlBvaW50VGV4dChwb2ludCk7XHJcbiAgICAgICAgbWFya2VyLmZvbnRTaXplID0gMzY7XHJcbiAgICAgICAgbWFya2VyLmNvbnRlbnQgPSBsYWJlbDtcclxuICAgICAgICBtYXJrZXIuc3Ryb2tlQ29sb3IgPSBcInJlZFwiO1xyXG4gICAgICAgIG1hcmtlci5icmluZ1RvRnJvbnQoKTtcclxuICAgICAgICAvL1BhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChtYXJrZXIpO1xyXG4gICAgICAgIHJldHVybiBtYXJrZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHNpbXBsaWZ5ID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aEl0ZW0sIHRvbGVyYW5jZT86IG51bWJlcikge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBQYXBlckhlbHBlcnMuc2ltcGxpZnkoPHBhcGVyLlBhdGhJdGVtPnAsIHRvbGVyYW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAoPHBhcGVyLlBhdGg+cGF0aCkuc2ltcGxpZnkodG9sZXJhbmNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIHNlbGYgb3IgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBmaW5kU2VsZk9yQW5jZXN0b3IgPSBmdW5jdGlvbihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZShpdGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kQW5jZXN0b3IoaXRlbSwgcHJlZGljYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBmaW5kQW5jZXN0b3IgPSBmdW5jdGlvbihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCFpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJpb3I6IHBhcGVyLkl0ZW07XHJcbiAgICAgICAgbGV0IGNoZWNraW5nID0gaXRlbS5wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKGNoZWNraW5nICYmIGNoZWNraW5nICE9PSBwcmlvcikge1xyXG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKGNoZWNraW5nKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNraW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByaW9yID0gY2hlY2tpbmc7XHJcbiAgICAgICAgICAgIGNoZWNraW5nID0gY2hlY2tpbmcucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBjb3JuZXJzIG9mIHRoZSByZWN0LCBjbG9ja3dpc2Ugc3RhcnRpbmcgZnJvbSB0b3BMZWZ0XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBjb3JuZXJzID0gZnVuY3Rpb24ocmVjdDogcGFwZXIuUmVjdGFuZ2xlKTogcGFwZXIuUG9pbnRbXSB7XHJcbiAgICAgICAgcmV0dXJuIFtyZWN0LnRvcExlZnQsIHJlY3QudG9wUmlnaHQsIHJlY3QuYm90dG9tUmlnaHQsIHJlY3QuYm90dG9tTGVmdF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0aGUgbWlkcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBtaWRwb2ludCA9IGZ1bmN0aW9uKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIHJldHVybiBiLnN1YnRyYWN0KGEpLmRpdmlkZSgyKS5hZGQoYSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IGNsb25lU2VnbWVudCA9IGZ1bmN0aW9uKHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlNlZ21lbnQoc2VnbWVudC5wb2ludCwgc2VnbWVudC5oYW5kbGVJbiwgc2VnbWVudC5oYW5kbGVPdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFrZSBhbiBpdGVtIGRyYWdnYWJsZSwgYWRkaW5nIHJlbGF0ZWQgZXZlbnRzLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgYWRkU21hcnREcmFnID0gZnVuY3Rpb24oaXRlbTogcGFwZXIuSXRlbSkge1xyXG4gICAgICAgIGl0ZW0uaXNTbWFydERyYWdnYWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgIGl0ZW0ub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlRHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICBsb2coXCJzbWFydERyYWcub25Nb3VzZURyYWdcIiwgaXRlbSwgZXYpO1xyXG4gICAgICAgICAgICBpZiAoZXYuc21hcnREcmFnSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiV2lsbCBub3QgYXNzaWduIHNtYXJ0RHJhZ0l0ZW06IHZhbHVlIHdhcyBhbHJlYWR5IFwiICsgZXYuc21hcnREcmFnSXRlbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBldi5zbWFydERyYWdJdGVtID0gaXRlbTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFpdGVtLmlzU21hcnREcmFnZ2luZykge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5pc1NtYXJ0RHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgbG9nKFwiZW1pdHRpbmcgc21hcnREcmFnLnNtYXJ0RHJhZ1N0YXJ0XCIpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5lbWl0KEV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbi5hZGQoZXYuZGVsdGEpO1xyXG5cclxuICAgICAgICAgICAgbG9nKFwiZW1pdHRpbmcgc21hcnREcmFnLnNtYXJ0RHJhZ01vdmVcIik7XHJcbiAgICAgICAgICAgIGl0ZW0uZW1pdChFdmVudFR5cGUuc21hcnREcmFnTW92ZSwgZXYpO1xyXG5cclxuICAgICAgICAgICAgZXYuc3RvcCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZVVwLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGxvZyhcInNtYXJ0RHJhZy5vbk1vdXNlVXBcIiwgaXRlbSwgZXYpO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgKGV2LnNtYXJ0RHJhZ0l0ZW0pIHtcclxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUud2FybihcIldpbGwgbm90IGFzc2lnbiBzbWFydERyYWdJdGVtOiB2YWx1ZSB3YXMgYWxyZWFkeSBcIiArIGV2LnNtYXJ0RHJhZ0l0ZW0pO1xyXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAgICAgZXYuc21hcnREcmFnSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtLmlzU21hcnREcmFnZ2luZykge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5pc1NtYXJ0RHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGxvZyhcImVtaXR0aW5nIHNtYXJ0RHJhZy5zbWFydERyYWdFbmRcIik7XHJcbiAgICAgICAgICAgICAgICBpZihpdGVtLnJlc3BvbmRzKEV2ZW50VHlwZS5zbWFydERyYWdFbmQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5lbWl0KEV2ZW50VHlwZS5zbWFydERyYWdFbmQsIGV2KTtcclxuICAgICAgICAgICAgICAgICAgICBldi5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZihpdGVtLnJlc3BvbmRzKEV2ZW50VHlwZS5jbGlja1dpdGhvdXREcmFnKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nKFwiZW1pdHRpbmcgc21hcnREcmFnLmNsaWNrV2l0aG91dERyYWdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5lbWl0KEV2ZW50VHlwZS5jbGlja1dpdGhvdXREcmFnLCBldik7XHJcbiAgICAgICAgICAgICAgICAgICAgZXYuc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL2V2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIC8vZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIC8vZXYuc3RvcCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBsYXN0Q2xpY2s6IG51bWJlcjsgXHJcbiAgICAgICAgaXRlbS5vbihFdmVudFR5cGUuY2xpY2tXaXRob3V0RHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZihsYXN0Q2xpY2sgJiYgKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAtIGxhc3RDbGljayA8IDcwMCl7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQoRXZlbnRUeXBlLmRvdWJsZUNsaWNrV2l0aG91dERyYWcsIGV2KTtcclxuICAgICAgICAgICAgfSAgICBcclxuICAgICAgICAgICAgbGFzdENsaWNrID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGNvbnN0IEV2ZW50VHlwZSA9IHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZyBhY3Rpb24gaGFzIHN0YXJ0ZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc21hcnREcmFnU3RhcnQ6IFwic21hcnREcmFnU3RhcnRcIixcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZ2dlZCBpdGVtIGhhcyBtb3ZlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzbWFydERyYWdNb3ZlOiBcInNtYXJ0RHJhZ01vdmVcIixcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRHJhZyBhY3Rpb24gaGFzIGVuZGVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNtYXJ0RHJhZ0VuZDogXCJzbWFydERyYWdFbmRcIixcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIG5vcm1hbCBjbGljayBldmVudCB3aWxsIGZpcmUgZXZlbiBhdCB0aGUgZW5kIG9mIGEgZHJhZy5cclxuICAgICAgICAgKiBUaGlzIGNsaWNrIGV2ZW50IGRvZXMgbm90LiBcclxuICAgICAgICAgKi9cclxuICAgICAgICBjbGlja1dpdGhvdXREcmFnOiBcImNsaWNrV2l0aG91dERyYWdcIixcclxuXHJcbiAgICAgICAgZG91YmxlQ2xpY2tXaXRob3V0RHJhZzogXCJkb3VibGVDbGlja1dpdGhvdXREcmFnXCJcclxuICAgIH1cclxufVxyXG5cclxuZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJdGVtIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEcmFnZ2luZyBiZWhhdmlvciBhZGRlZCBieSBQYXBlckhlbHBlcnM6IGlzIHRoZSBpdGVtIGJlaW5nIGRyYWdnZWQ/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNTbWFydERyYWdnaW5nOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEcmFnZ2luZyBiZWhhdmlvciBhZGRlZCBieSBQYXBlckhlbHBlcnM6IGlzIHRoZSBpdGVtIGRyYWdnYWJsZT9cclxuICAgICAgICAgKi9cclxuICAgICAgICBpc1NtYXJ0RHJhZ2dhYmxlOiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVG9vbEV2ZW50IHtcclxuICAgICAgICBzbWFydERyYWdJdGVtOiBJdGVtO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUGFwZXJNb3VzZUV2ZW50IHtcclxuICAgICAgICBzbWFydERyYWdJdGVtOiBJdGVtO1xyXG4gICAgfVxyXG59IiwiXHJcbnR5cGUgSXRlbUNoYW5nZUhhbmRsZXIgPSAoZmxhZ3M6IFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcpID0+IHZvaWQ7XHJcbnR5cGUgQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgaW50ZXJmYWNlIEl0ZW0ge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFN1YnNjcmliZSB0byBhbGwgY2hhbmdlcyBpbiBpdGVtLiBSZXR1cm5zIHVuLXN1YnNjcmliZSBmdW5jdGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzdWJzY3JpYmUoaGFuZGxlcjogSXRlbUNoYW5nZUhhbmRsZXIpOiBDYWxsYmFjaztcclxuICAgICAgICBcclxuICAgICAgICBfY2hhbmdlZChmbGFnczogUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZyk6IHZvaWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBQYXBlck5vdGlmeSB7XHJcblxyXG4gICAgZXhwb3J0IGVudW0gQ2hhbmdlRmxhZyB7XHJcbiAgICAgICAgLy8gQW55dGhpbmcgYWZmZWN0aW5nIHRoZSBhcHBlYXJhbmNlIG9mIGFuIGl0ZW0sIGluY2x1ZGluZyBHRU9NRVRSWSxcclxuICAgICAgICAvLyBTVFJPS0UsIFNUWUxFIGFuZCBBVFRSSUJVVEUgKGV4Y2VwdCBmb3IgdGhlIGludmlzaWJsZSBvbmVzOiBsb2NrZWQsIG5hbWUpXHJcbiAgICAgICAgQVBQRUFSQU5DRSA9IDB4MSxcclxuICAgICAgICAvLyBBIGNoYW5nZSBpbiB0aGUgaXRlbSdzIGNoaWxkcmVuXHJcbiAgICAgICAgQ0hJTERSRU4gPSAweDIsXHJcbiAgICAgICAgLy8gQSBjaGFuZ2Ugb2YgdGhlIGl0ZW0ncyBwbGFjZSBpbiB0aGUgc2NlbmUgZ3JhcGggKHJlbW92ZWQsIGluc2VydGVkLFxyXG4gICAgICAgIC8vIG1vdmVkKS5cclxuICAgICAgICBJTlNFUlRJT04gPSAweDQsXHJcbiAgICAgICAgLy8gSXRlbSBnZW9tZXRyeSAocGF0aCwgYm91bmRzKVxyXG4gICAgICAgIEdFT01FVFJZID0gMHg4LFxyXG4gICAgICAgIC8vIE9ubHkgc2VnbWVudChzKSBoYXZlIGNoYW5nZWQsIGFuZCBhZmZlY3RlZCBjdXJ2ZXMgaGF2ZSBhbHJlYWR5IGJlZW5cclxuICAgICAgICAvLyBub3RpZmllZC4gVGhpcyBpcyB0byBpbXBsZW1lbnQgYW4gb3B0aW1pemF0aW9uIGluIF9jaGFuZ2VkKCkgY2FsbHMuXHJcbiAgICAgICAgU0VHTUVOVFMgPSAweDEwLFxyXG4gICAgICAgIC8vIFN0cm9rZSBnZW9tZXRyeSAoZXhjbHVkaW5nIGNvbG9yKVxyXG4gICAgICAgIFNUUk9LRSA9IDB4MjAsXHJcbiAgICAgICAgLy8gRmlsbCBzdHlsZSBvciBzdHJva2UgY29sb3IgLyBkYXNoXHJcbiAgICAgICAgU1RZTEUgPSAweDQwLFxyXG4gICAgICAgIC8vIEl0ZW0gYXR0cmlidXRlczogdmlzaWJsZSwgYmxlbmRNb2RlLCBsb2NrZWQsIG5hbWUsIG9wYWNpdHksIGNsaXBNYXNrIC4uLlxyXG4gICAgICAgIEFUVFJJQlVURSA9IDB4ODAsXHJcbiAgICAgICAgLy8gVGV4dCBjb250ZW50XHJcbiAgICAgICAgQ09OVEVOVCA9IDB4MTAwLFxyXG4gICAgICAgIC8vIFJhc3RlciBwaXhlbHNcclxuICAgICAgICBQSVhFTFMgPSAweDIwMCxcclxuICAgICAgICAvLyBDbGlwcGluZyBpbiBvbmUgb2YgdGhlIGNoaWxkIGl0ZW1zXHJcbiAgICAgICAgQ0xJUFBJTkcgPSAweDQwMCxcclxuICAgICAgICAvLyBUaGUgdmlldyBoYXMgYmVlbiB0cmFuc2Zvcm1lZFxyXG4gICAgICAgIFZJRVcgPSAweDgwMFxyXG4gICAgfVxyXG5cclxuICAgIC8vIFNob3J0Y3V0cyB0byBvZnRlbiB1c2VkIENoYW5nZUZsYWcgdmFsdWVzIGluY2x1ZGluZyBBUFBFQVJBTkNFXHJcbiAgICBleHBvcnQgZW51bSBDaGFuZ2VzIHtcclxuICAgICAgICAvLyBDSElMRFJFTiBhbHNvIGNoYW5nZXMgR0VPTUVUUlksIHNpbmNlIHJlbW92aW5nIGNoaWxkcmVuIGZyb20gZ3JvdXBzXHJcbiAgICAgICAgLy8gY2hhbmdlcyBib3VuZHMuXHJcbiAgICAgICAgQ0hJTERSRU4gPSBDaGFuZ2VGbGFnLkNISUxEUkVOIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICAvLyBDaGFuZ2luZyB0aGUgaW5zZXJ0aW9uIGNhbiBjaGFuZ2UgdGhlIGFwcGVhcmFuY2UgdGhyb3VnaCBwYXJlbnQncyBtYXRyaXguXHJcbiAgICAgICAgSU5TRVJUSU9OID0gQ2hhbmdlRmxhZy5JTlNFUlRJT04gfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgR0VPTUVUUlkgPSBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNFR01FTlRTID0gQ2hhbmdlRmxhZy5TRUdNRU5UUyB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgU1RST0tFID0gQ2hhbmdlRmxhZy5TVFJPS0UgfCBDaGFuZ2VGbGFnLlNUWUxFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNUWUxFID0gQ2hhbmdlRmxhZy5TVFlMRSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBBVFRSSUJVVEUgPSBDaGFuZ2VGbGFnLkFUVFJJQlVURSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBDT05URU5UID0gQ2hhbmdlRmxhZy5DT05URU5UIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBQSVhFTFMgPSBDaGFuZ2VGbGFnLlBJWEVMUyB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBWSUVXID0gQ2hhbmdlRmxhZy5WSUVXIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFXHJcbiAgICB9O1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEluamVjdCBJdGVtLnN1YnNjcmliZVxyXG4gICAgICAgIGNvbnN0IGl0ZW1Qcm90byA9ICg8YW55PnBhcGVyKS5JdGVtLnByb3RvdHlwZTtcclxuICAgICAgICBpdGVtUHJvdG8uc3Vic2NyaWJlID0gZnVuY3Rpb24oaGFuZGxlcjogSXRlbUNoYW5nZUhhbmRsZXIpOiBDYWxsYmFjayB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fc3Vic2NyaWJlcnMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoaGFuZGxlcikgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5wdXNoKGhhbmRsZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGhhbmRsZXIsIDApO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXcmFwIEl0ZW0ucmVtb3ZlXHJcbiAgICAgICAgY29uc3QgaXRlbVJlbW92ZSA9IGl0ZW1Qcm90by5yZW1vdmU7XHJcbiAgICAgICAgaXRlbVByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdGVtUmVtb3ZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdyYXAgUHJvamVjdC5fY2hhbmdlZFxyXG4gICAgICAgIGNvbnN0IHByb2plY3RQcm90byA9IDxhbnk+cGFwZXIuUHJvamVjdC5wcm90b3R5cGU7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdENoYW5nZWQgPSBwcm9qZWN0UHJvdG8uX2NoYW5nZWQ7XHJcbiAgICAgICAgcHJvamVjdFByb3RvLl9jaGFuZ2VkID0gZnVuY3Rpb24oZmxhZ3M6IENoYW5nZUZsYWcsIGl0ZW06IHBhcGVyLkl0ZW0pIHtcclxuICAgICAgICAgICAgcHJvamVjdENoYW5nZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN1YnMgPSAoPGFueT5pdGVtKS5fc3Vic2NyaWJlcnM7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3Vicykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHMgb2Ygc3Vicykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzLmNhbGwoaXRlbSwgZmxhZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGVzY3JpYmUoZmxhZ3M6IENoYW5nZUZsYWcpIHtcclxuICAgICAgICBsZXQgZmxhZ0xpc3Q6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgXy5mb3JPd24oQ2hhbmdlRmxhZywgKHZhbHVlLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgaWYgKCh0eXBlb2YgdmFsdWUpID09PSBcIm51bWJlclwiICYmICh2YWx1ZSAmIGZsYWdzKSkge1xyXG4gICAgICAgICAgICAgICAgZmxhZ0xpc3QucHVzaChrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZsYWdMaXN0LmpvaW4oJyB8ICcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZShpdGVtOiBwYXBlci5JdGVtLCBmbGFnczogQ2hhbmdlRmxhZyk6IFxyXG4gICAgICAgIFJ4Lk9ic2VydmFibGU8Q2hhbmdlRmxhZz4gXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHVuc3ViOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm48Q2hhbmdlRmxhZz4oXHJcbiAgICAgICAgICAgIGFkZEhhbmRsZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgdW5zdWIgPSBpdGVtLnN1YnNjcmliZShmID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZihmICYgZmxhZ3Mpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRIYW5kbGVyKGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgcmVtb3ZlSGFuZGxlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih1bnN1Yil7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5zdWIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5QYXBlck5vdGlmeS5pbml0aWFsaXplKCk7XHJcbiIsIlxyXG5tb2R1bGUgcGFwZXIge1xyXG5cclxuICAgIGV4cG9ydCB2YXIgRXZlbnRUeXBlID0ge1xyXG4gICAgICAgIGZyYW1lOiBcImZyYW1lXCIsXHJcbiAgICAgICAgbW91c2VEb3duOiBcIm1vdXNlZG93blwiLFxyXG4gICAgICAgIG1vdXNlVXA6IFwibW91c2V1cFwiLFxyXG4gICAgICAgIG1vdXNlRHJhZzogXCJtb3VzZWRyYWdcIixcclxuICAgICAgICBjbGljazogXCJjbGlja1wiLFxyXG4gICAgICAgIGRvdWJsZUNsaWNrOiBcImRvdWJsZWNsaWNrXCIsXHJcbiAgICAgICAgbW91c2VNb3ZlOiBcIm1vdXNlbW92ZVwiLFxyXG4gICAgICAgIG1vdXNlRW50ZXI6IFwibW91c2VlbnRlclwiLFxyXG4gICAgICAgIG1vdXNlTGVhdmU6IFwibW91c2VsZWF2ZVwiLFxyXG4gICAgICAgIGtleXVwOiBcImtleXVwXCIsXHJcbiAgICAgICAga2V5ZG93bjogXCJrZXlkb3duXCJcclxuICAgIH1cclxuXHJcbn0iLCJcclxuLy8gY2xhc3MgT2xkVG9waWM8VD4ge1xyXG5cclxuLy8gICAgIHByaXZhdGUgX2NoYW5uZWw6IElDaGFubmVsRGVmaW5pdGlvbjxPYmplY3Q+O1xyXG4vLyAgICAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xyXG5cclxuLy8gICAgIGNvbnN0cnVjdG9yKGNoYW5uZWw6IElDaGFubmVsRGVmaW5pdGlvbjxPYmplY3Q+LCB0b3BpYzogc3RyaW5nKSB7XHJcbi8vICAgICAgICAgdGhpcy5fY2hhbm5lbCA9IGNoYW5uZWw7XHJcbi8vICAgICAgICAgdGhpcy5fbmFtZSA9IHRvcGljO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIG9ic2VydmUoKTogUnguT2JzZXJ2YWJsZTxUPiB7XHJcbi8vICAgICAgICAgcmV0dXJuIDxSeC5PYnNlcnZhYmxlPFQ+PnRoaXMuX2NoYW5uZWwub2JzZXJ2ZSh0aGlzLl9uYW1lKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBwdWJsaXNoKGRhdGE6IFQpIHtcclxuLy8gICAgICAgICB0aGlzLl9jaGFubmVsLnB1Ymxpc2godGhpcy5fbmFtZSwgZGF0YSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgc3Vic2NyaWJlKGNhbGxiYWNrOiBJQ2FsbGJhY2s8VD4pOiBJU3Vic2NyaXB0aW9uRGVmaW5pdGlvbjxUPiB7XHJcbi8vICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWwuc3Vic2NyaWJlKHRoaXMuX25hbWUsIGNhbGxiYWNrKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBwcm90ZWN0ZWQgc3VidG9waWMobmFtZSk6IENoYW5uZWxUb3BpYzxUPiB7XHJcbi8vICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VD4odGhpcy5fY2hhbm5lbCwgdGhpcy5fbmFtZSArICcuJyArIG5hbWUpO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHByb3RlY3RlZCBzdWJ0b3BpY09mPFUgZXh0ZW5kcyBUPihuYW1lKTogQ2hhbm5lbFRvcGljPFU+IHtcclxuLy8gICAgICAgICByZXR1cm4gbmV3IENoYW5uZWxUb3BpYzxVPih0aGlzLl9jaGFubmVsLCB0aGlzLl9uYW1lICsgJy4nICsgbmFtZSk7XHJcbi8vICAgICB9XHJcbi8vIH1cclxuIiwiXHJcbmludGVyZmFjZSBJUG9zdGFsIHtcclxuICAgIG9ic2VydmU6IChvcHRpb25zOiBQb3N0YWxPYnNlcnZlT3B0aW9ucykgPT4gUnguT2JzZXJ2YWJsZTxhbnk+O1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUG9zdGFsT2JzZXJ2ZU9wdGlvbnMge1xyXG4gICAgY2hhbm5lbDogc3RyaW5nO1xyXG4gICAgdG9waWM6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIElDaGFubmVsRGVmaW5pdGlvbjxUPiB7XHJcbiAgICBvYnNlcnZlKHRvcGljOiBzdHJpbmcpOiBSeC5PYnNlcnZhYmxlPFQ+O1xyXG59XHJcblxyXG5wb3N0YWwub2JzZXJ2ZSA9IGZ1bmN0aW9uKG9wdGlvbnM6IFBvc3RhbE9ic2VydmVPcHRpb25zKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgY2hhbm5lbCA9IG9wdGlvbnMuY2hhbm5lbDtcclxuICAgIHZhciB0b3BpYyA9IG9wdGlvbnMudG9waWM7XHJcblxyXG4gICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybihcclxuICAgICAgICBmdW5jdGlvbiBhZGRIYW5kbGVyKGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuc3Vic2NyaWJlKHtcclxuICAgICAgICAgICAgICAgIGNoYW5uZWw6IGNoYW5uZWwsXHJcbiAgICAgICAgICAgICAgICB0b3BpYzogdG9waWMsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogaCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiBkZWxIYW5kbGVyKF8sIHN1Yikge1xyXG4gICAgICAgICAgICBzdWIudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG59O1xyXG5cclxuLy8gYWRkIG9ic2VydmUgdG8gQ2hhbm5lbERlZmluaXRpb25cclxuKDxhbnk+cG9zdGFsKS5DaGFubmVsRGVmaW5pdGlvbi5wcm90b3R5cGUub2JzZXJ2ZSA9IGZ1bmN0aW9uKHRvcGljOiBzdHJpbmcpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuKFxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZEhhbmRsZXIoaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5idXMuc3Vic2NyaWJlKHtcclxuICAgICAgICAgICAgICAgIGNoYW5uZWw6IHNlbGYuY2hhbm5lbCxcclxuICAgICAgICAgICAgICAgIHRvcGljOiB0b3BpYyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBoLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbEhhbmRsZXIoXywgc3ViKSB7XHJcbiAgICAgICAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn07XHJcbiIsIlxyXG5jb25zdCByaCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQ7XHJcbiIsIlxyXG5hYnN0cmFjdCBjbGFzcyBDb21wb25lbnQ8VD4ge1xyXG4gICAgYWJzdHJhY3QgcmVuZGVyKGRhdGE6IFQpOiBWTm9kZTtcclxufSIsIlxyXG5pbnRlcmZhY2UgUmVhY3RpdmVEb21Db21wb25lbnQge1xyXG4gICAgZG9tJDogUnguT2JzZXJ2YWJsZTxWTm9kZT47XHJcbn1cclxuXHJcbmNsYXNzIFJlYWN0aXZlRG9tIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciBhIHJlYWN0aXZlIGNvbXBvbmVudCB3aXRoaW4gY29udGFpbmVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyU3RyZWFtKFxyXG4gICAgICAgIGRvbSQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+LFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnRcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBjb25zdCBpZCA9IGNvbnRhaW5lci5pZDtcclxuICAgICAgICBsZXQgY3VycmVudDogSFRNTEVsZW1lbnQgfCBWTm9kZSA9IGNvbnRhaW5lcjtcclxuICAgICAgICBjb25zdCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XHJcbiAgICAgICAgZG9tJC5zdWJzY3JpYmUoZG9tID0+IHtcclxuICAgICAgICAgICAgaWYoIWRvbSkgcmV0dXJuO1xyXG4vL2NvbnNvbGUubG9nKCdyZW5kZXJpbmcgZG9tJywgZG9tKTsgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyByZXRhaW4gSURcclxuICAgICAgICAgICAgY29uc3QgcGF0Y2hlZCA9IHBhdGNoKGN1cnJlbnQsIGRvbSk7XHJcbiAgICAgICAgICAgIGlmKGlkICYmICFwYXRjaGVkLmVsbS5pZCl7XHJcbiAgICAgICAgICAgICAgICBwYXRjaGVkLmVsbS5pZCA9IGlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2hlZDtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIGEgcmVhY3RpdmUgY29tcG9uZW50IHdpdGhpbiBjb250YWluZXIuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXJDb21wb25lbnQoXHJcbiAgICAgICAgY29tcG9uZW50OiBSZWFjdGl2ZURvbUNvbXBvbmVudCxcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50IHwgVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGNvbXBvbmVudC5kb20kLnN1YnNjcmliZShkb20gPT4ge1xyXG4gICAgICAgICAgICBpZighZG9tKSByZXR1cm47XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgd2l0aGluIGNvbnRhaW5lciB3aGVuZXZlciBzb3VyY2UgY2hhbmdlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxpdmVSZW5kZXI8VD4oXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudCB8IFZOb2RlLFxyXG4gICAgICAgIHNvdXJjZTogUnguT2JzZXJ2YWJsZTxUPixcclxuICAgICAgICByZW5kZXI6IChuZXh0OiBUKSA9PiBWTm9kZVxyXG4gICAgKTogUnguT2JzZXJ2YWJsZTxWTm9kZT4ge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gY29udGFpbmVyO1xyXG4gICAgICAgIGxldCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XHJcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSByZW5kZXIoZGF0YSk7XHJcbiAgICAgICAgICAgIGlmKCFub2RlKSByZXR1cm47XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaChjdXJyZW50LCBub2RlKTtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxufSIsIi8vIGNvbnN0IEFtYXRpY1VybCA9ICdodHRwOi8vZm9udHMuZ3N0YXRpYy5jb20vcy9hbWF0aWNzYy92OC9JRG5rUlRQR2NyU1ZvNTBVeVlOSzd5M1VTQm5TdnBrb3BRYVVSLTJyN2lVLnR0Zic7XHJcbi8vIGNvbnN0IFJvYm90bzEwMCA9ICdodHRwOi8vZm9udHMuZ3N0YXRpYy5jb20vcy9yb2JvdG8vdjE1LzdNeWdxVGUyenM5WWtQMGFkQTlRUVEudHRmJztcclxuLy8gY29uc3QgUm9ib3RvNTAwID0gJ2ZvbnRzL1JvYm90by01MDAudHRmJztcclxuLy8gY29uc3QgUm9ib3RvOTAwID0gXCJodHRwOi8vZm9udHMuZ3N0YXRpYy5jb20vcy9yb2JvdG8vdjE1L0gxdkIzNG5PS1dYcXpLb3RxMjVwY2cudHRmXCI7XHJcbi8vIGNvbnN0IE9wZW5TYW5zUmVndWxhciA9IFwiZm9udHMvT3BlblNhbnMvT3BlblNhbnMtUmVndWxhci50dGZcIjtcclxuLy8gY29uc3QgT3BlblNhbnNFeHRyYUJvbGQgPSBcImZvbnRzL09wZW5TYW5zL09wZW5TYW5zLUV4dHJhQm9sZC50dGZcIjtcclxuLy8gY29uc3QgQXF1YWZpbmFTY3JpcHQgPSAnZm9udHMvQWd1YWZpbmFTY3JpcHQtUmVndWxhci9BZ3VhZmluYVNjcmlwdC1SZWd1bGFyLnR0ZidcclxuLy8gY29uc3QgTm9yaWNhbiA9IFwiaHR0cDovL2ZvbnRzLmdzdGF0aWMuY29tL3Mvbm9yaWNhbi92NC9TSG5TcWhZQVdHNXNaVFdjUHpFSGlnLnR0ZlwiO1xyXG5cclxuY2xhc3MgQXBwQ29udHJvbGxlciB7XHJcblxyXG4gICAgc3RvcmU6IFN0b3JlO1xyXG4gICAgcm91dGVyOiBBcHBSb3V0ZXI7XHJcbiAgICB3b3Jrc3BhY2VDb250cm9sbGVyOiBXb3Jrc3BhY2VDb250cm9sbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHN0b3JlOiBTdG9yZSxcclxuICAgICAgICByb3V0ZXI6IEFwcFJvdXRlcixcclxuICAgICAgICBza2V0Y2hFZGl0b3I6IFNrZXRjaEVkaXRvcixcclxuICAgICAgICBzZWxlY3RlZEl0ZW1FZGl0b3I6IFNlbGVjdGVkSXRlbUVkaXRvcikge1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXIgPSByb3V0ZXI7XHJcblxyXG4gICAgICAgIGNvbnN0IGFjdGlvbnMgPSBzdG9yZS5hY3Rpb25zLCBldmVudHMgPSBzdG9yZS5ldmVudHM7XHJcblxyXG4gICAgICAgIGV2ZW50cy5zdWJzY3JpYmUobSA9PiBjb25zb2xlLmxvZyhcImV2ZW50XCIsIG0udHlwZSwgbS5kYXRhKSk7XHJcbiAgICAgICAgYWN0aW9ucy5zdWJzY3JpYmUobSA9PiBjb25zb2xlLmxvZyhcImFjdGlvblwiLCBtLnR5cGUsIG0uZGF0YSkpO1xyXG5cclxuICAgICAgICBldmVudHMuYXBwLmZvbnRMb2FkZWQub2JzZXJ2ZSgpLmZpcnN0KCkuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2VDb250cm9sbGVyID0gbmV3IFdvcmtzcGFjZUNvbnRyb2xsZXIoc3RvcmUsIG0uZGF0YSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBldmVudHMuYXBwLndvcmtzcGFjZUluaXRpYWxpemVkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChzdG9yZS5zdGF0ZS5za2V0Y2gudGV4dEJsb2Nrcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLmFkZC5kaXNwYXRjaCh7IHRleHQ6IFwiUExBWSBXSVRIIFRZUEVcIiB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmFwcC5pbml0V29ya3NwYWNlLmRpc3BhdGNoKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGV2ZW50cy5za2V0Y2gubG9hZGVkLnN1YnNjcmliZShldiA9PlxyXG4gICAgICAgICAgICAkKFwiI21haW5DYW52YXNcIikuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLCBldi5kYXRhLmJhY2tncm91bmRDb2xvcilcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkLnN1YnNjcmliZShldiA9PlxyXG4gICAgICAgICAgICAkKFwiI21haW5DYW52YXNcIikuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLCBldi5kYXRhLmJhY2tncm91bmRDb2xvcilcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5jbGFzcyBBcHBSb3V0ZXIgZXh0ZW5kcyBSb3V0ZXI1IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihbXHJcbiAgICAgICAgICAgIG5ldyBSb3V0ZU5vZGUoXCJob21lXCIsIFwiL1wiKSxcclxuICAgICAgICAgICAgbmV3IFJvdXRlTm9kZShcInNrZXRjaFwiLCBcIi9za2V0Y2gvOnNrZXRjaElkXCIpLCAvLyA8W2EtZkEtRjAtOV17MTR9PlxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHVzZUhhc2g6IGZhbHNlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL3RoaXMudXNlUGx1Z2luKGxvZ2dlclBsdWdpbigpKVxyXG4gICAgICAgIHRoaXMudXNlUGx1Z2luKGxpc3RlbmVyc1BsdWdpbi5kZWZhdWx0KCkpXHJcbiAgICAgICAgICAgIC51c2VQbHVnaW4oaGlzdG9yeVBsdWdpbi5kZWZhdWx0KCkpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0KChlcnIsIHN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInJvdXRlciBlcnJvclwiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZShcImhvbWVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJvdXRlciBzdGF0ZVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmludGVyZmFjZSBTa2V0Y2hSb3V0ZVN0YXRlIHtcclxuICAgIHNrZXRjaElkPzogc3RyaW5nO1xyXG59XHJcbiIsIlxyXG5jbGFzcyBBY3Rpb25zIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWwge1xyXG4gICAgXHJcbiAgICBhcHAgPSB7ICAgICAgIFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluc3RydWN0cyBTdG9yZSB0byBsb2FkIHJldGFpbmVkIHN0YXRlIGZyb20gbG9jYWwgc3RvcmFnZSwgaWYgaXQgZXhpc3RzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGluaXRXb3Jrc3BhY2U6IHRoaXMudG9waWM8dm9pZD4oXCJhcHAuaW5pdFdvcmtzcGFjZVwiKSxcclxuICAgICAgICBcclxuICAgICAgICBsb2FkRm9udDogdGhpcy50b3BpYzxzdHJpbmc+KFwiYXBwLmxvYWRGb250XCIpXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBkZXNpZ25lciA9IHtcclxuICAgICAgICB6b29tVG9GaXQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci56b29tVG9GaXRcIiksXHJcbiAgICAgICAgZXhwb3J0aW5nSW1hZ2U6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRJbWFnZVwiKSxcclxuICAgICAgICBleHBvcnRQTkc6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRQTkdcIiksXHJcbiAgICAgICAgZXhwb3J0U1ZHOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0U1ZHXCIpLFxyXG4gICAgICAgIHZpZXdDaGFuZ2VkOiB0aGlzLnRvcGljPHBhcGVyLlJlY3RhbmdsZT4oXCJkZXNpZ25lci52aWV3Q2hhbmdlZFwiKSxcclxuICAgICAgICB1cGRhdGVTbmFwc2hvdDogdGhpcy50b3BpYzx7c2tldGNoOiBTa2V0Y2gsIHBuZ0RhdGFVcmw6IHN0cmluZ30+KFwiZGVzaWduZXIudXBkYXRlU25hcHNob3RcIiksXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNrZXRjaCA9IHtcclxuICAgICAgICBjcmVhdGU6IHRoaXMudG9waWM8U2tldGNoQXR0cj4oXCJza2V0Y2guY3JlYXRlXCIpLFxyXG4gICAgICAgIGNsb25lOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmNsb25lXCIpLFxyXG4gICAgICAgIGF0dHJVcGRhdGU6IHRoaXMudG9waWM8U2tldGNoQXR0cj4oXCJza2V0Y2guYXR0clVwZGF0ZVwiKSxcclxuICAgICAgICBzZXRTZWxlY3Rpb246IHRoaXMudG9waWM8V29ya3NwYWNlT2JqZWN0UmVmPihcInNrZXRjaC5zZXRTZWxlY3Rpb25cIiksXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB0ZXh0QmxvY2sgPSB7XHJcbiAgICAgICAgYWRkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYWRkXCIpLFxyXG4gICAgICAgIHVwZGF0ZUF0dHI6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay51cGRhdGVBdHRyXCIpLFxyXG4gICAgICAgIHVwZGF0ZUFycmFuZ2U6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay51cGRhdGVBcnJhbmdlXCIpLFxyXG4gICAgICAgIHJlbW92ZTogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLnJlbW92ZVwiKVxyXG4gICAgfTtcclxuICAgIFxyXG59XHJcblxyXG5jbGFzcyBFdmVudHMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XHJcbiAgICBcclxuICAgIGFwcCA9IHtcclxuICAgICAgICByZXNvdXJjZXNSZWFkeTogdGhpcy50b3BpYzxib29sZWFuPihcImFwcC5yZXNvdXJjZXNSZWFkeVwiKSxcclxuICAgICAgICB3b3Jrc3BhY2VJbml0aWFsaXplZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwiYXBwLndvcmtzcGFjZUluaXRpYWxpemVkXCIpLFxyXG4gICAgICAgIGZvbnRMb2FkZWQ6IHRoaXMudG9waWM8b3BlbnR5cGUuRm9udD4oXCJhcHAuZm9udExvYWRlZFwiKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBkZXNpZ25lciA9IHtcclxuICAgICAgICB6b29tVG9GaXRSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci56b29tVG9GaXRSZXF1ZXN0ZWRcIiksXHJcbiAgICAgICAgZXhwb3J0UE5HUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0UE5HUmVxdWVzdGVkXCIpLFxyXG4gICAgICAgIGV4cG9ydFNWR1JlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydFNWR1JlcXVlc3RlZFwiKSxcclxuICAgICAgICB2aWV3Q2hhbmdlZDogdGhpcy50b3BpYzxwYXBlci5SZWN0YW5nbGU+KFwiZGVzaWduZXIudmlld0NoYW5nZWRcIiksXHJcbiAgICAgICAgc25hcHNob3RFeHBpcmVkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJkZXNpZ25lci5zbmFwc2hvdEV4cGlyZWRcIiksXHJcbiAgICAgICAgdXNlck1lc3NhZ2VDaGFuZ2VkOiB0aGlzLnRvcGljPHN0cmluZz4oXCJkZXNpZ25lci51c2VyTWVzc2FnZUNoYW5nZWRcIilcclxuICAgIH07XHJcbiAgICBcclxuICAgIHNrZXRjaCA9IHtcclxuICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5sb2FkZWRcIiksXHJcbiAgICAgICAgYXR0ckNoYW5nZWQ6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5hdHRyQ2hhbmdlZFwiKSxcclxuICAgICAgICBjb250ZW50Q2hhbmdlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmNvbnRlbnRDaGFuZ2VkXCIpLFxyXG4gICAgICAgIGVkaXRpbmdJdGVtQ2hhbmdlZDogdGhpcy50b3BpYzxQb3NpdGlvbmVkT2JqZWN0UmVmPihcInNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWRcIiksXHJcbiAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogdGhpcy50b3BpYzxXb3Jrc3BhY2VPYmplY3RSZWY+KFwic2tldGNoLnNlbGVjdGlvbkNoYW5nZWRcIiksXHJcbiAgICAgICAgc2F2ZUxvY2FsUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwic2tldGNoLnNhdmVsb2NhbC5zYXZlTG9jYWxSZXF1ZXN0ZWRcIilcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRleHRibG9jayA9IHtcclxuICAgICAgICBhZGRlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFkZGVkXCIpLFxyXG4gICAgICAgIGF0dHJDaGFuZ2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYXR0ckNoYW5nZWRcIiksXHJcbiAgICAgICAgZm9udFJlYWR5OiB0aGlzLnRvcGljPHt0ZXh0QmxvY2tJZDogc3RyaW5nLCBmb250OiBvcGVudHlwZS5Gb250fT4oXCJ0ZXh0YmxvY2suZm9udFJlYWR5XCIpLFxyXG4gICAgICAgIGFycmFuZ2VDaGFuZ2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYXJyYW5nZUNoYW5nZWRcIiksXHJcbiAgICAgICAgcmVtb3ZlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLnJlbW92ZWRcIiksXHJcbiAgICAgICAgbG9hZGVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2subG9hZGVkXCIpLFxyXG4gICAgICAgIGVkaXRvckNsb3NlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmVkaXRvckNsb3NlZFwiKSxcclxuICAgIH07XHJcbiAgICBcclxufVxyXG5cclxuY2xhc3MgQ2hhbm5lbHMge1xyXG4gICAgYWN0aW9uczogQWN0aW9ucyA9IG5ldyBBY3Rpb25zKCk7XHJcbiAgICBldmVudHM6IEV2ZW50cyA9IG5ldyBFdmVudHMoKTtcclxufVxyXG4iLCJcclxuY2xhc3MgRm9udEZhbWlsaWVzIHtcclxuXHJcbiAgICBzdGF0aWMgQ0FUQUxPR19MSU1JVCA9IDE1MDtcclxuXHJcbiAgICBwdWJsaWMgY2F0YWxvZzogRm9udEZhbWlseVtdID0gW107XHJcblxyXG4gICAgZ2V0KGZhbWlseTogc3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuY2F0YWxvZywgZmYgPT4gZmYuZmFtaWx5ID09PSBmYW1pbHkpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VXJsKGZhbWlseTogc3RyaW5nLCB2YXJpYW50OiBzdHJpbmcpe1xyXG4gICAgICAgIGNvbnN0IGZhbURlZiA9IHRoaXMuZ2V0KGZhbWlseSk7XHJcbiAgICAgICAgaWYoIWZhbURlZil7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIm5vIGRlZmluaXRpb24gYXZhaWxhYmxlIGZvciBmYW1pbHlcIiwgZmFtaWx5KTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmaWxlID0gZmFtRGVmLmZpbGVzW3ZhcmlhbnRdO1xyXG4gICAgICAgIGlmKCFmaWxlKXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwibm8gZm9udCBmaWxlIGF2YWlsYWJsZSBmb3IgdmFyaWFudFwiLCBmYW1pbHksIHZhcmlhbnQpO1xyXG4gICAgICAgICAgICBmaWxlID0gZmFtRGVmLmZpbGVzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmlsZTtcclxuICAgIH1cclxuXHJcbiAgICBkZWZhdWx0VmFyaWFudChmYW1EZWY6IEZvbnRGYW1pbHkpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmKCFmYW1EZWYpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmKGZhbURlZi52YXJpYW50cy5pbmRleE9mKFwicmVndWxhclwiKSA+PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInJlZ3VsYXJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbURlZi52YXJpYW50c1swXTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkQ2F0YWxvZ0xvY2FsKGNhbGxiYWNrOiAoZmFtaWxpZXM6IEZvbnRGYW1pbHlbXSkgPT4gdm9pZCkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogXCJmb250cy9nb29nbGUtZm9udHMuanNvblwiLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlOiB7IGtpbmQ6IHN0cmluZywgaXRlbXM6IEZvbnRGYW1pbHlbXSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkSXRlbXMgPSByZXNwb25zZS5pdGVtcy5zbGljZSgwLCBGb250RmFtaWxpZXMuQ0FUQUxPR19MSU1JVCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIG1ha2UgZmlsZXMgaHR0c1xyXG4gICAgICAgICAgICAgICAgZm9yKGNvbnN0IGZhbSBvZiBmaWx0ZXJlZEl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JPd24oZmFtLmZpbGVzLCAodmFsOiBzdHJpbmcsIGtleTpzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoXy5zdGFydHNXaXRoKHZhbCwgXCJodHRwOlwiKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYW0uZmlsZXNba2V5XSA9IHZhbC5yZXBsYWNlKFwiaHR0cDpcIiwgXCJodHRwczpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXRhbG9nID0gZmlsdGVyZWRJdGVtcztcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMuY2F0YWxvZyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiAoeGhyLCBzdGF0dXMsIGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImdvb2dsZS1mb250cy5qc29uXCIsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbG9hZENhdGFsb2dSZW1vdGUoY2FsbGJhY2s6IChmYW1pbGllczogRm9udEZhbWlseVtdKSA9PiB2b2lkKSB7XHJcbiAgICAvLyAgICAgdmFyIHVybCA9ICdodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS93ZWJmb250cy92MS93ZWJmb250cz8nO1xyXG4gICAgLy8gICAgIHZhciBrZXkgPSAna2V5PUdPT0dMRS1BUEktS0VZJztcclxuICAgIC8vICAgICB2YXIgc29ydCA9IFwicG9wdWxhcml0eVwiO1xyXG4gICAgLy8gICAgIHZhciBvcHQgPSAnc29ydD0nICsgc29ydCArICcmJztcclxuICAgIC8vICAgICB2YXIgcmVxID0gdXJsICsgb3B0ICsga2V5O1xyXG5cclxuICAgIC8vICAgICAkLmFqYXgoe1xyXG4gICAgLy8gICAgICAgICB1cmw6IHJlcSxcclxuICAgIC8vICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgIC8vICAgICAgICAgY2FjaGU6IHRydWUsXHJcbiAgICAvLyAgICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZTogeyBraW5kOiBzdHJpbmcsIGl0ZW1zOiBGb250RmFtaWx5W10gfSkgPT4ge1xyXG4gICAgLy8gICAgICAgICAgICAgY2FsbGJhY2socmVzcG9uc2UuaXRlbXMpO1xyXG4gICAgLy8gICAgICAgICB9LFxyXG4gICAgLy8gICAgICAgICBlcnJvcjogKHhociwgc3RhdHVzLCBlcnIpID0+IHtcclxuICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IodXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRm9yIGEgbGlzdCBvZiBmYW1pbGllcywgbG9hZCBhbHBoYW51bWVyaWMgY2hhcnMgaW50byBicm93c2VyXHJcbiAgICAgKiAgIHRvIHN1cHBvcnQgcHJldmlld2luZy5cclxuICAgICAqL1xyXG4gICAgbG9hZFByZXZpZXdTdWJzZXRzKGZhbWlsaWVzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGZvciAoY29uc3QgY2h1bmsgb2YgXy5jaHVuayhmYW1pbGllcywgMTApKSB7XHJcbiAgICAgICAgICAgIFdlYkZvbnQubG9hZCh7XHJcbiAgICAgICAgICAgICAgICBjbGFzc2VzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGdvb2dsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGZhbWlsaWVzOiA8c3RyaW5nW10+Y2h1bmssXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OVwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIlxyXG50eXBlIFBhcnNlZEZvbnRMb2FkZWQgPSAodXJsOiBzdHJpbmcsIGZvbnQ6IG9wZW50eXBlLkZvbnQpID0+IHZvaWQ7IFxyXG5cclxuY2xhc3MgUGFyc2VkRm9udHMge1xyXG5cclxuICAgIGZvbnRzOiB7IFt1cmw6IHN0cmluZ106IG9wZW50eXBlLkZvbnQ7IH0gPSB7fTtcclxuXHJcbiAgICBwcml2YXRlIF9mb250TG9hZGVkOiBQYXJzZWRGb250TG9hZGVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZvbnRMb2FkZWQ6IFBhcnNlZEZvbnRMb2FkZWQpe1xyXG4gICAgICAgIHRoaXMuX2ZvbnRMb2FkZWQgPSBmb250TG9hZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChmb250VXJsOiBzdHJpbmcsIG9uUmVhZHk6IFBhcnNlZEZvbnRMb2FkZWQgPSBudWxsKSB7XHJcbiAgICAgICAgaWYoIWZvbnRVcmwpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBmb250ID0gdGhpcy5mb250c1tmb250VXJsXTtcclxuXHJcbiAgICAgICAgaWYgKGZvbnQpIHtcclxuICAgICAgICAgICAgb25SZWFkeSAmJiBvblJlYWR5KGZvbnRVcmwsIGZvbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvcGVudHlwZS5sb2FkKGZvbnRVcmwsIChlcnIsIGZvbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIsIHtmb250VXJsfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRzW2ZvbnRVcmxdID0gZm9udDtcclxuICAgICAgICAgICAgICAgIG9uUmVhZHkgJiYgb25SZWFkeShmb250VXJsLCBmb250KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRMb2FkZWQoZm9udFVybCwgZm9udCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIlxyXG5uYW1lc3BhY2UgUzNBY2Nlc3Mge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBsb2FkIGZpbGUgdG8gYXBwbGljYXRpb24gUzMgYnVja2V0XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBwdXRGaWxlKGZpbGVOYW1lOiBzdHJpbmcsIGZpbGVUeXBlOiBzdHJpbmcsIGRhdGE6IEJsb2IgfCBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3Mtc2RrLWpzL2lzc3Vlcy8xOTAgICBcclxuICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvRmlyZWZveC8pICYmICFmaWxlVHlwZS5tYXRjaCgvOy8pKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGFyc2V0ID0gJzsgY2hhcnNldD1VVEYtOCc7XHJcbiAgICAgICAgICAgIGZpbGVUeXBlICs9IGNoYXJzZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzaWduVXJsID0gYC9hcGkvc3RvcmFnZS9hY2Nlc3M/ZmlsZU5hbWU9JHtmaWxlTmFtZX0mZmlsZVR5cGU9JHtmaWxlVHlwZX1gO1xyXG4gICAgICAgIC8vIGdldCBzaWduZWQgVVJMXHJcbiAgICAgICAgJC5nZXRKU09OKHNpZ25VcmwpXHJcbiAgICAgICAgICAgIC5kb25lKHNpZ25SZXNwb25zZSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUFVUIGZpbGVcclxuICAgICAgICAgICAgICAgIGNvbnN0IHB1dFJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogc2lnblJlc3BvbnNlLnNpZ25lZFJlcXVlc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIngtYW16LWFjbFwiOiBcInB1YmxpYy1yZWFkXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmaWxlVHlwZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmFqYXgocHV0UmVxdWVzdClcclxuICAgICAgICAgICAgICAgICAgICAuZG9uZShwdXRSZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBsb2FkZWQgZmlsZVwiLCBzaWduUmVzcG9uc2UudXJsKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmZhaWwoZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIHVwbG9hZGluZyB0byBTM1wiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciBvbiAvYXBpL3N0b3JhZ2UvYWNjZXNzXCIsIGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRG93bmxvYWQgZmlsZSBmcm9tIGJ1Y2tldFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0RmlsZShmaWxlTmFtZTogc3RyaW5nKTogSlF1ZXJ5UHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiBgL2FwaS9zdG9yYWdlL3VybD9maWxlTmFtZT0ke2ZpbGVOYW1lfWAsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIlxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG93bmxvYWRpbmdcIiwgcmVzcG9uc2UudXJsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogcmVzcG9uc2UudXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn0iLCJcclxuLyoqXHJcbiAqIFRoZSBzaW5nbGV0b24gU3RvcmUgY29udHJvbHMgYWxsIGFwcGxpY2F0aW9uIHN0YXRlLlxyXG4gKiBObyBwYXJ0cyBvdXRzaWRlIG9mIHRoZSBTdG9yZSBtb2RpZnkgYXBwbGljYXRpb24gc3RhdGUuXHJcbiAqIENvbW11bmljYXRpb24gd2l0aCB0aGUgU3RvcmUgaXMgZG9uZSB0aHJvdWdoIG1lc3NhZ2UgQ2hhbm5lbHM6IFxyXG4gKiAgIC0gQWN0aW9ucyBjaGFubmVsIHRvIHNlbmQgaW50byB0aGUgU3RvcmUsXHJcbiAqICAgLSBFdmVudHMgY2hhbm5lbCB0byByZWNlaXZlIG5vdGlmaWNhdGlvbiBmcm9tIHRoZSBTdG9yZS5cclxuICogT25seSB0aGUgU3RvcmUgY2FuIHJlY2VpdmUgYWN0aW9uIG1lc3NhZ2VzLlxyXG4gKiBPbmx5IHRoZSBTdG9yZSBjYW4gc2VuZCBldmVudCBtZXNzYWdlcy5cclxuICogVGhlIFN0b3JlIGNhbm5vdCBzZW5kIGFjdGlvbnMgb3IgbGlzdGVuIHRvIGV2ZW50cyAodG8gYXZvaWQgbG9vcHMpLlxyXG4gKiBNZXNzYWdlcyBhcmUgdG8gYmUgdHJlYXRlZCBhcyBpbW11dGFibGUuXHJcbiAqIEFsbCBtZW50aW9ucyBvZiB0aGUgU3RvcmUgY2FuIGJlIGFzc3VtZWQgdG8gbWVhbiwgb2YgY291cnNlLFxyXG4gKiAgIFwiVGhlIFN0b3JlIGFuZCBpdHMgc3ViLWNvbXBvbmVudHMuXCJcclxuICovXHJcbmNsYXNzIFN0b3JlIHtcclxuXHJcbiAgICBzdGF0aWMgQlJPV1NFUl9JRF9LRVkgPSBcImJyb3dzZXJJZFwiO1xyXG4gICAgc3RhdGljIEZBTExCQUNLX0ZPTlRfVVJMID0gJ2ZvbnRzL1JvYm90by01MDAudHRmJztcclxuICAgIHN0YXRpYyBERUZBVUxUX0ZPTlRfTkFNRSA9IFwiUm9ib3RvXCI7XHJcbiAgICBzdGF0aWMgRk9OVF9MSVNUX0xJTUlUID0gMTAwO1xyXG4gICAgc3RhdGljIFNLRVRDSF9MT0NBTF9DQUNIRV9LRVkgPSBcImZpZGRsZXN0aWNrcy5pby5sYXN0U2tldGNoXCI7XHJcbiAgICBzdGF0aWMgTE9DQUxfQ0FDSEVfREVMQVlfTVMgPSAxMDAwO1xyXG4gICAgc3RhdGljIFNFUlZFUl9TQVZFX0RFTEFZX01TID0gMTAwMDA7XHJcblxyXG4gICAgc3RhdGU6IEFwcFN0YXRlID0ge307XHJcbiAgICByZXNvdXJjZXMgPSB7XHJcbiAgICAgICAgZmFsbGJhY2tGb250OiBvcGVudHlwZS5Gb250LFxyXG4gICAgICAgIGZvbnRGYW1pbGllczogbmV3IEZvbnRGYW1pbGllcygpLFxyXG4gICAgICAgIHBhcnNlZEZvbnRzOiBuZXcgUGFyc2VkRm9udHMoKHVybCwgZm9udCkgPT5cclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuYXBwLmZvbnRMb2FkZWQuZGlzcGF0Y2goZm9udCkpXHJcbiAgICB9O1xyXG4gICAgcm91dGVyOiBBcHBSb3V0ZXI7XHJcbiAgICBhY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgIGV2ZW50cyA9IG5ldyBFdmVudHMoKTtcclxuXHJcbiAgICBwcml2YXRlIF9za2V0Y2hDb250ZW50JCA9IG5ldyBSeC5TdWJqZWN0PFNrZXRjaD4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihyb3V0ZXI6IEFwcFJvdXRlcikge1xyXG4gICAgICAgIHRoaXMucm91dGVyID0gcm91dGVyO1xyXG5cclxuICAgICAgICB0aGlzLnNldHVwU3RhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cFN1YnNjcmlwdGlvbnMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkUmVzb3VyY2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBTdGF0ZSgpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmJyb3dzZXJJZCA9IENvb2tpZXMuZ2V0KFN0b3JlLkJST1dTRVJfSURfS0VZKTtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYnJvd3NlcklkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuYnJvd3NlcklkID0gbmV3aWQoKTtcclxuICAgICAgICAgICAgQ29va2llcy5zZXQoU3RvcmUuQlJPV1NFUl9JRF9LRVksIHRoaXMuc3RhdGUuYnJvd3NlcklkLCB7IGV4cGlyZXM6IDIgKiAzNjUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldHVwU3Vic2NyaXB0aW9ucygpIHtcclxuICAgICAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5hY3Rpb25zLCBldmVudHMgPSB0aGlzLmV2ZW50cztcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gQXBwIC0tLS0tXHJcblxyXG4gICAgICAgIGFjdGlvbnMuYXBwLmluaXRXb3Jrc3BhY2Uub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgIC5wYXVzYWJsZUJ1ZmZlcmVkKGV2ZW50cy5hcHAucmVzb3VyY2VzUmVhZHkub2JzZXJ2ZSgpLm1hcChtID0+IG0uZGF0YSkpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBza2V0Y2hJZFBhcmFtID0gdGhpcy5za2V0Y2hJZFVybFBhcmFtO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNrZXRjaElkUGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBTM0FjY2Vzcy5nZXRGaWxlKHNrZXRjaElkUGFyYW0gKyBcIi5qc29uXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb25lKHNrZXRjaCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goc2tldGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJldHJpZXZlZCBza2V0Y2hcIiwgc2tldGNoLl9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2tldGNoLmJyb3dzZXJJZCA9PT0gdGhpcy5zdGF0ZS5icm93c2VySWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2tldGNoIHdhcyBjcmVhdGVkIGluIHRoaXMgYnJvd3NlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NrZXRjaCB3YXMgY3JlYXRlZCBpbiBhIGRpZmZlcmVudCBicm93c2VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLmFwcC53b3Jrc3BhY2VJbml0aWFsaXplZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnNrZXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mYWlsKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJlcnJvciBnZXR0aW5nIHJlbW90ZSBza2V0Y2hcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaCh0aGlzLmNyZWF0ZVNrZXRjaCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy5hcHAud29ya3NwYWNlSW5pdGlhbGl6ZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKHRoaXMuY3JlYXRlU2tldGNoKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIC0tLSBTZXQgdXAgc2tldGNoIHN0YXRlIHdhdGNoZWQgLS0tICovXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fc2tldGNoQ29udGVudCRcclxuICAgICAgICAgICAgICAgIC8vICAgICAuZGVib3VuY2UoU3RvcmUuTE9DQUxfQ0FDSEVfREVMQVlfTVMpXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLnN1YnNjcmliZShycyA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlmICghbG9jYWxTdG9yYWdlIHx8ICFsb2NhbFN0b3JhZ2UuZ2V0SXRlbSkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgLy8gbm90IHN1cHBvcnRlZFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgU3RvcmUuU0tFVENIX0xPQ0FMX0NBQ0hFX0tFWSxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUuc2tldGNoKSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2tldGNoQ29udGVudCQuZGVib3VuY2UoU3RvcmUuU0VSVkVSX1NBVkVfREVMQVlfTVMpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShza2V0Y2ggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2tldGNoICYmIHNrZXRjaC5faWQgJiYgc2tldGNoLnRleHRCbG9ja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVTa2V0Y2goc2tldGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5hcHAubG9hZEZvbnQuc3Vic2NyaWJlKG0gPT5cclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KG0uZGF0YSkpO1xyXG5cclxuICAgICAgICAvLyAtLS0tLSBEZXNpZ25lciAtLS0tLVxyXG5cclxuICAgICAgICBhY3Rpb25zLmRlc2lnbmVyLnpvb21Ub0ZpdC5mb3J3YXJkKFxyXG4gICAgICAgICAgICBldmVudHMuZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkKTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5kZXNpZ25lci5leHBvcnRQTkcuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgZXZlbnRzLmRlc2lnbmVyLmV4cG9ydFBOR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLmRlc2lnbmVyLmV4cG9ydFNWRy5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwpO1xyXG4gICAgICAgICAgICBldmVudHMuZGVzaWduZXIuZXhwb3J0U1ZHUmVxdWVzdGVkLmRpc3BhdGNoKG0uZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMuZGVzaWduZXIudmlld0NoYW5nZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBldmVudHMuZGVzaWduZXIudmlld0NoYW5nZWQuZGlzcGF0Y2gobS5kYXRhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5kZXNpZ25lci51cGRhdGVTbmFwc2hvdC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtLmRhdGEuc2tldGNoLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBtLmRhdGEuc2tldGNoLl9pZCArIFwiLnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmxvYiA9IERvbUhlbHBlcnMuZGF0YVVSTFRvQmxvYihtLmRhdGEucG5nRGF0YVVybCk7XHJcbiAgICAgICAgICAgICAgICBTM0FjY2Vzcy5wdXRGaWxlKGZpbGVuYW1lLCBcImltYWdlL3BuZ1wiLCBibG9iKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAtLS0tLSBTa2V0Y2ggLS0tLS1cclxuXHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guY3JlYXRlLnN1YnNjcmliZSgobSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBza2V0Y2ggPSB0aGlzLmNyZWF0ZVNrZXRjaCgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcGF0Y2g6IFNrZXRjaEF0dHIgPSBtLmRhdGEgfHwge307XHJcbiAgICAgICAgICAgIHBhdGNoLmJhY2tncm91bmRDb2xvciA9IHBhdGNoLmJhY2tncm91bmRDb2xvciB8fCAnI2Y2ZjNlYic7XHJcbiAgICAgICAgICAgIHRoaXMuYXNzaWduKHNrZXRjaCwgcGF0Y2gpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKHNrZXRjaClcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldCh0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ci5mb250RmFtaWx5KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2goKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guY2xvbmUuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3U2tldGNoID0gXy5jbG9uZSh0aGlzLnN0YXRlLnNrZXRjaCk7XHJcbiAgICAgICAgICAgIG5ld1NrZXRjaC5faWQgPSBuZXdpZCgpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2gobmV3U2tldGNoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZS5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFzc2lnbih0aGlzLnN0YXRlLnNrZXRjaCwgZXYuZGF0YSk7XHJcbiAgICAgICAgICAgIGV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihtLmRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG0uZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvLyAtLS0tLSBUZXh0QmxvY2sgLS0tLS1cclxuXHJcbiAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2suYWRkXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcGF0Y2ggPSBldi5kYXRhO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwYXRjaC50ZXh0IHx8ICFwYXRjaC50ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHsgX2lkOiBuZXdpZCgpIH0gYXMgVGV4dEJsb2NrO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ24oYmxvY2ssIHBhdGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWJsb2NrLnRleHRDb2xvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnRleHRDb2xvciA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLnRleHRDb2xvcjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWJsb2NrLmZvbnRGYW1pbHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5mb250RmFtaWx5ID0gdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIuZm9udEZhbWlseTtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5mb250VmFyaWFudCA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLmZvbnRWYXJpYW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MucHVzaChibG9jayk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmFkZGVkLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFRleHRCbG9ja0ZvbnQoYmxvY2spO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXR0clxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuZ2V0QmxvY2soZXYuZGF0YS5faWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gPFRleHRCbG9jaz57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGV2LmRhdGEudGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBldi5kYXRhLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBldi5kYXRhLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogZXYuZGF0YS5mb250RmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogZXYuZGF0YS5mb250VmFyaWFudFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9udENoYW5nZWQgPSBwYXRjaC5mb250RmFtaWx5ICE9PSBibG9jay5mb250RmFtaWx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IHBhdGNoLmZvbnRWYXJpYW50ICE9PSBibG9jay5mb250VmFyaWFudDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbihibG9jaywgcGF0Y2gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2suZm9udEZhbWlseSAmJiAhYmxvY2suZm9udFZhcmlhbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmFtRGVmID0gdGhpcy5yZXNvdXJjZXMuZm9udEZhbWlsaWVzLmdldChibG9jay5mb250RmFtaWx5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZhbURlZikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVndWxhciBvciBlbHNlIGZpcnN0IHZhcmlhbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLmZvbnRWYXJpYW50ID0gdGhpcy5yZXNvdXJjZXMuZm9udEZhbWlsaWVzLmRlZmF1bHRWYXJpYW50KGZhbURlZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyID0gXy5jbG9uZShibG9jayk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZm9udENoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkVGV4dEJsb2NrRm9udChibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2sucmVtb3ZlXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRpZERlbGV0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXy5yZW1vdmUodGhpcy5zdGF0ZS5za2V0Y2gudGV4dEJsb2NrcywgdGIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0Yi5faWQgPT09IGV2LmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZERlbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpZERlbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5kaXNwYXRjaCh7IF9pZDogZXYuZGF0YS5faWQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkU2tldGNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2VcclxuICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB0aGlzLmdldEJsb2NrKGV2LmRhdGEuX2lkKTtcclxuICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnBvc2l0aW9uID0gZXYuZGF0YS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5vdXRsaW5lID0gZXYuZGF0YS5vdXRsaW5lO1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXJyYW5nZUNoYW5nZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRTa2V0Y2goc2tldGNoOiBTa2V0Y2gpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmxvYWRpbmdTa2V0Y2ggPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc3RhdGUuc2tldGNoID0gc2tldGNoO1xyXG4gICAgICAgIHRoaXMuc2tldGNoSWRVcmxQYXJhbSA9IHNrZXRjaC5faWQ7XHJcbiAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmxvYWRlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnNrZXRjaCk7XHJcbiAgICAgICAgZm9yIChjb25zdCB0YiBvZiB0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5sb2FkZWQuZGlzcGF0Y2godGIpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRUZXh0QmxvY2tGb250KHRiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ldmVudHMuZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkLmRpc3BhdGNoKCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5sb2FkaW5nU2tldGNoID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb2FkUmVzb3VyY2VzKCkge1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VzLmZvbnRGYW1pbGllcy5sb2FkQ2F0YWxvZ0xvY2FsKGZhbWlsaWVzID0+IHtcclxuICAgICAgICAgICAgLy8gbG9hZCBmb250cyBpbnRvIGJyb3dzZXIgZm9yIHByZXZpZXdcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMuZm9udEZhbWlsaWVzLmxvYWRQcmV2aWV3U3Vic2V0cyhmYW1pbGllcy5tYXAoZiA9PiBmLmZhbWlseSkpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KFxyXG4gICAgICAgICAgICAgICAgU3RvcmUuRkFMTEJBQ0tfRk9OVF9VUkwsXHJcbiAgICAgICAgICAgICAgICAodXJsLCBmb250KSA9PiB0aGlzLnJlc291cmNlcy5mYWxsYmFja0ZvbnQgPSBmb250KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmFwcC5yZXNvdXJjZXNSZWFkeS5kaXNwYXRjaCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3dVc2VyTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLnVzZXJNZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5kZXNpZ25lci51c2VyTWVzc2FnZUNoYW5nZWQuZGlzcGF0Y2gobWVzc2FnZSk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudXNlck1lc3NhZ2UgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5kZXNpZ25lci51c2VyTWVzc2FnZUNoYW5nZWQuZGlzcGF0Y2gobnVsbCk7XHJcbiAgICAgICAgfSwgMzAwMClcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRUZXh0QmxvY2tGb250KGJsb2NrOiBUZXh0QmxvY2spIHtcclxuICAgICAgICB0aGlzLnJlc291cmNlcy5wYXJzZWRGb250cy5nZXQoXHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZvbnRGYW1pbGllcy5nZXRVcmwoYmxvY2suZm9udEZhbWlseSwgYmxvY2suZm9udFZhcmlhbnQpLFxyXG4gICAgICAgICAgICAodXJsLCBmb250KSA9PiB0aGlzLmV2ZW50cy50ZXh0YmxvY2suZm9udFJlYWR5LmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0QmxvY2tJZDogYmxvY2suX2lkLCBmb250OiBmb250IH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoYW5nZWRTa2V0Y2goKSB7XHJcbiAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmNvbnRlbnRDaGFuZ2VkLmRpc3BhdGNoKHRoaXMuc3RhdGUuc2tldGNoKTtcclxuICAgICAgICB0aGlzLl9za2V0Y2hDb250ZW50JC5vbk5leHQodGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXNzaWduPFQ+KGRlc3Q6IFQsIHNvdXJjZTogVCkge1xyXG4gICAgICAgIF8ubWVyZ2UoZGVzdCwgc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNrZXRjaCgpOiBTa2V0Y2gge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIF9pZDogbmV3aWQoKSxcclxuICAgICAgICAgICAgYnJvd3NlcklkOiB0aGlzLnN0YXRlLmJyb3dzZXJJZCxcclxuICAgICAgICAgICAgZGVmYXVsdFRleHRCbG9ja0F0dHI6IHtcclxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwiUm9ib3RvXCIsXHJcbiAgICAgICAgICAgICAgICBmb250VmFyaWFudDogXCJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgICAgICB0ZXh0Q29sb3I6IFwibGlnaHRncmF5XCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGV4dEJsb2NrczogPFRleHRCbG9ja1tdPltdXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldCBza2V0Y2hJZFVybFBhcmFtKCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgcm91dGVTdGF0ZSA9IDxSb3V0ZVN0YXRlPnRoaXMucm91dGVyLmdldFN0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHJvdXRlU3RhdGUucGFyYW1zLnNrZXRjaElkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0IHNrZXRjaElkVXJsUGFyYW0odmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwic2tldGNoXCIsIHsgc2tldGNoSWQ6IHZhbHVlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2F2ZVNrZXRjaChza2V0Y2g6IFNrZXRjaCkge1xyXG4gICAgICAgIFMzQWNjZXNzLnB1dEZpbGUoc2tldGNoLl9pZCArIFwiLmpzb25cIixcclxuICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCIsIEpTT04uc3RyaW5naWZ5KHNrZXRjaCkpO1xyXG4gICAgICAgIHRoaXMuc2hvd1VzZXJNZXNzYWdlKFwiU2F2ZWRcIik7XHJcbiAgICAgICAgdGhpcy5ldmVudHMuZGVzaWduZXIuc25hcHNob3RFeHBpcmVkLmRpc3BhdGNoKHNrZXRjaCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRTZWxlY3Rpb24oaXRlbTogV29ya3NwYWNlT2JqZWN0UmVmKSB7XHJcbiAgICAgICAgLy8gZWFybHkgZXhpdCBvbiBubyBjaGFuZ2VcclxuICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3Rpb25cclxuICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuc2VsZWN0aW9uLml0ZW1JZCA9PT0gaXRlbS5pdGVtSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5zZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3Rpb24gPSBpdGVtO1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLmRpc3BhdGNoKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0RWRpdGluZ0l0ZW0oaXRlbTogUG9zaXRpb25lZE9iamVjdFJlZikge1xyXG4gICAgICAgIC8vIGVhcmx5IGV4aXQgb24gbm8gY2hhbmdlXHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW1cclxuICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0uaXRlbUlkID09PSBpdGVtLml0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmVkaXRpbmdJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtKSB7XHJcbiAgICAgICAgICAgIC8vIHNpZ25hbCBjbG9zaW5nIGVkaXRvciBmb3IgaXRlbVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0uaXRlbVR5cGUgPT09IFwiVGV4dEJsb2NrXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFZGl0aW5nQmxvY2sgPSB0aGlzLmdldEJsb2NrKHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0uaXRlbUlkKTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RWRpdGluZ0Jsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmVkaXRvckNsb3NlZC5kaXNwYXRjaChjdXJyZW50RWRpdGluZ0Jsb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgLy8gZWRpdGluZyBpdGVtIHNob3VsZCBiZSBzZWxlY3RlZCBpdGVtXHJcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5kaXNwYXRjaChpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEJsb2NrKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsIHRiID0+IHRiLl9pZCA9PT0gaWQpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG50eXBlIEFjdGlvblR5cGVzID0gXHJcbiAgICBcInNrZXRjaC5jcmVhdGVcIlxyXG4gICAgfCBcInNrZXRjaC51cGRhdGVcIlxyXG4gICAgfCBcInRleHRibG9jay5hZGRcIlxyXG4gICAgfCBcInRleHRibG9jay51cGRhdGVcIjtcclxuXHJcbnR5cGUgRXZlbnRUeXBlcyA9XHJcbiAgICBcInNrZXRjaC5sb2FkZWRcIlxyXG4gICAgfCBcInNrZXRjaC5jaGFuZ2VkXCJcclxuICAgIHwgXCJ0ZXh0YmxvY2suYWRkZWRcIlxyXG4gICAgfCBcInRleHRibG9jay5jaGFuZ2VkXCI7XHJcbiIsIlxyXG5jb25zdCBTa2V0Y2hIZWxwZXJzID0ge1xyXG4gICAgXHJcbiAgICBjb2xvcnNJblVzZShza2V0Y2g6IFNrZXRjaCk6IHN0cmluZ1tdIHtcclxuICAgICAgICBsZXQgY29sb3JzID0gWyBza2V0Y2guYmFja2dyb3VuZENvbG9yIF07XHJcbiAgICAgICAgZm9yKGNvbnN0IGJsb2NrIG9mIHNrZXRjaC50ZXh0QmxvY2tzKXtcclxuICAgICAgICAgICAgY29sb3JzLnB1c2goYmxvY2suYmFja2dyb3VuZENvbG9yKTtcclxuICAgICAgICAgICAgY29sb3JzLnB1c2goYmxvY2sudGV4dENvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29sb3JzID0gXy51bmlxKGNvbG9ycy5maWx0ZXIoYyA9PiBjICE9IG51bGwpKTtcclxuICAgICAgICBjb2xvcnMuc29ydCgpO1xyXG4gICAgICAgIHJldHVybiBjb2xvcnM7XHJcbiAgICB9XHJcbiAgICBcclxufSIsIlxyXG5pbnRlcmZhY2UgQXBwU3RhdGUge1xyXG4gICAgYnJvd3NlcklkPzogc3RyaW5nO1xyXG4gICAgZWRpdGluZ0l0ZW0/OiBQb3NpdGlvbmVkT2JqZWN0UmVmO1xyXG4gICAgc2VsZWN0aW9uPzogV29ya3NwYWNlT2JqZWN0UmVmO1xyXG4gICAgbG9hZGluZ1NrZXRjaD86IGJvb2xlYW47XHJcbiAgICB1c2VyTWVzc2FnZT86IHN0cmluZztcclxuICAgIHNrZXRjaD86IFNrZXRjaDtcclxufVxyXG5cclxuaW50ZXJmYWNlIFNrZXRjaCBleHRlbmRzIFNrZXRjaEF0dHIge1xyXG4gICAgX2lkOiBzdHJpbmc7XHJcbiAgICBicm93c2VySWQ/OiBzdHJpbmc7XHJcbiAgICB0ZXh0QmxvY2tzPzogVGV4dEJsb2NrW107XHJcbn1cclxuXHJcbmludGVyZmFjZSBTa2V0Y2hBdHRyIHtcclxuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIGRlZmF1bHRUZXh0QmxvY2tBdHRyPzogVGV4dEJsb2NrO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRm9udEZhbWlseSB7XHJcbiAgICBraW5kPzogc3RyaW5nO1xyXG4gICAgZmFtaWx5Pzogc3RyaW5nO1xyXG4gICAgY2F0ZWdvcnk/OiBzdHJpbmc7XHJcbiAgICB2YXJpYW50cz86IHN0cmluZ1tdO1xyXG4gICAgc3Vic2V0cz86IHN0cmluZ1tdO1xyXG4gICAgdmVyc2lvbj86IHN0cmluZztcclxuICAgIGxhc3RNb2RpZmllZD86IHN0cmluZztcclxuICAgIGZpbGVzPzogeyBbdmFyaWFudDogc3RyaW5nXSA6IHN0cmluZzsgfTtcclxufVxyXG5cclxuaW50ZXJmYWNlIEZvbnREZXNjcmlwdGlvbiB7XHJcbiAgICBmYW1pbHk6IHN0cmluZztcclxuICAgIGNhdGVnb3J5OiBzdHJpbmc7XHJcbiAgICB2YXJpYW50OiBzdHJpbmc7XHJcbiAgICB1cmw6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFdvcmtzcGFjZU9iamVjdFJlZiB7XHJcbiAgICBpdGVtSWQ6IHN0cmluZztcclxuICAgIGl0ZW1UeXBlPzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUG9zaXRpb25lZE9iamVjdFJlZiBleHRlbmRzIFdvcmtzcGFjZU9iamVjdFJlZiB7XHJcbiAgICBjbGllbnRYPzogbnVtYmVyO1xyXG4gICAgY2xpZW50WT86IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFRleHRCbG9jayBleHRlbmRzIEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgX2lkPzogc3RyaW5nO1xyXG4gICAgdGV4dD86IHN0cmluZztcclxuICAgIHRleHRDb2xvcj86IHN0cmluZztcclxuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIGZvbnRGYW1pbHk/OiBzdHJpbmc7XHJcbiAgICBmb250VmFyaWFudD86IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgcG9zaXRpb24/OiBudW1iZXJbXSxcclxuICAgIG91dGxpbmU/OiB7XHJcbiAgICAgICAgdG9wOiBQYXRoUmVjb3JkLFxyXG4gICAgICAgIGJvdHRvbTogUGF0aFJlY29yZFxyXG4gICAgfSAgICBcclxufVxyXG5cclxuaW50ZXJmYWNlIEJhY2tncm91bmRBY3Rpb25TdGF0dXMge1xyXG4gICAgYWN0aW9uPzogT2JqZWN0O1xyXG4gICAgcmVqZWN0ZWQ/OiBib29sZWFuO1xyXG4gICAgZXJyb3I/OiBib29sZWFuXHJcbiAgICBtZXNzYWdlPzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUGF0aFJlY29yZCB7XHJcbiAgICBzZWdtZW50czogU2VnbWVudFJlY29yZFtdO1xyXG59XHJcblxyXG4vKipcclxuICogU2luZ2xlLXBvaW50IHNlZ21lbnRzIGFyZSBzdG9yZWQgYXMgbnVtYmVyWzJdXHJcbiAqL1xyXG50eXBlIFNlZ21lbnRSZWNvcmQgPSBBcnJheTxQb2ludFJlY29yZD4gfCBBcnJheTxudW1iZXI+O1xyXG5cclxudHlwZSBQb2ludFJlY29yZCA9IEFycmF5PG51bWJlcj47XHJcbiIsIm5hbWVzcGFjZSBDb2xvclBpY2tlciB7XHJcblxyXG4gICAgY29uc3QgREVGQVVMVF9QQUxFVFRFX0dST1VQUyA9IFtcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzgwN1xyXG4gICAgICAgICAgICBcIiNlZTQwMzVcIixcclxuICAgICAgICAgICAgXCIjZjM3NzM2XCIsXHJcbiAgICAgICAgICAgIFwiI2ZkZjQ5OFwiLFxyXG4gICAgICAgICAgICBcIiM3YmMwNDNcIixcclxuICAgICAgICAgICAgXCIjMDM5MmNmXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzg5NFxyXG4gICAgICAgICAgICBcIiNlZGM5NTFcIixcclxuICAgICAgICAgICAgXCIjZWI2ODQxXCIsXHJcbiAgICAgICAgICAgIFwiI2NjMmEzNlwiLFxyXG4gICAgICAgICAgICBcIiM0ZjM3MmRcIixcclxuICAgICAgICAgICAgXCIjMDBhMGIwXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzE2NFxyXG4gICAgICAgICAgICBcIiMxYjg1YjhcIixcclxuICAgICAgICAgICAgXCIjNWE1MjU1XCIsXHJcbiAgICAgICAgICAgIFwiIzU1OWU4M1wiLFxyXG4gICAgICAgICAgICBcIiNhZTVhNDFcIixcclxuICAgICAgICAgICAgXCIjYzNjYjcxXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzM4OVxyXG4gICAgICAgICAgICBcIiM0YjM4MzJcIixcclxuICAgICAgICAgICAgXCIjODU0NDQyXCIsXHJcbiAgICAgICAgICAgIFwiI2ZmZjRlNlwiLFxyXG4gICAgICAgICAgICBcIiMzYzJmMmZcIixcclxuICAgICAgICAgICAgXCIjYmU5YjdiXCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzQ1NVxyXG4gICAgICAgICAgICBcIiNmZjRlNTBcIixcclxuICAgICAgICAgICAgXCIjZmM5MTNhXCIsXHJcbiAgICAgICAgICAgIFwiI2Y5ZDYyZVwiLFxyXG4gICAgICAgICAgICBcIiNlYWUzNzRcIixcclxuICAgICAgICAgICAgXCIjZTJmNGM3XCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzcwMFxyXG4gICAgICAgICAgICBcIiNkMTExNDFcIixcclxuICAgICAgICAgICAgXCIjMDBiMTU5XCIsXHJcbiAgICAgICAgICAgIFwiIzAwYWVkYlwiLFxyXG4gICAgICAgICAgICBcIiNmMzc3MzVcIixcclxuICAgICAgICAgICAgXCIjZmZjNDI1XCIsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzgyNlxyXG4gICAgICAgICAgICBcIiNlOGQxNzRcIixcclxuICAgICAgICAgICAgXCIjZTM5ZTU0XCIsXHJcbiAgICAgICAgICAgIFwiI2Q2NGQ0ZFwiLFxyXG4gICAgICAgICAgICBcIiM0ZDczNThcIixcclxuICAgICAgICAgICAgXCIjOWVkNjcwXCIsXHJcbiAgICAgICAgXSxcclxuICAgIF07XHJcblxyXG4gICAgY29uc3QgTU9OT19QQUxFVFRFID0gW1wiIzAwMFwiLFwiIzQ0NFwiLFwiIzY2NlwiLFwiIzk5OVwiLFwiI2NjY1wiLFwiI2VlZVwiLFwiI2YzZjNmM1wiLFwiI2ZmZlwiXTtcclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gc2V0dXAoZWxlbSwgZmVhdHVyZWRDb2xvcnM6IHN0cmluZ1tdLCBvbkNoYW5nZSkge1xyXG4gICAgICAgIGNvbnN0IGZlYXR1cmVkR3JvdXBzID0gXy5jaHVuayhmZWF0dXJlZENvbG9ycywgNSk7XHJcblxyXG4gICAgICAgIC8vIGZvciBlYWNoIHBhbGV0dGUgZ3JvdXBcclxuICAgICAgICBjb25zdCBkZWZhdWx0UGFsZXR0ZUdyb3VwcyA9IERFRkFVTFRfUEFMRVRURV9HUk9VUFMubWFwKGdyb3VwID0+IHtcclxuICAgICAgICAgICAgbGV0IHBhcnNlZEdyb3VwID0gZ3JvdXAubWFwKGMgPT4gbmV3IHBhcGVyLkNvbG9yKGMpKTtcclxuICAgICAgICAgICAgLy8gY3JlYXRlIGxpZ2h0IHZhcmlhbnRzIG9mIGRhcmtlc3QgdGhyZWVcclxuICAgICAgICAgICAgY29uc3QgYWRkQ29sb3JzID0gXy5zb3J0QnkocGFyc2VkR3JvdXAsIGMgPT4gYy5saWdodG5lc3MpXHJcbiAgICAgICAgICAgICAgICAuc2xpY2UoMCwgMylcclxuICAgICAgICAgICAgICAgIC5tYXAoYyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYzIgPSBjLmNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYzIubGlnaHRuZXNzID0gMC44NTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYzI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcGFyc2VkR3JvdXAgPSBwYXJzZWRHcm91cC5jb25jYXQoYWRkQ29sb3JzKTtcclxuICAgICAgICAgICAgcGFyc2VkR3JvdXAgPSBfLnNvcnRCeShwYXJzZWRHcm91cCwgYyA9PiBjLmxpZ2h0bmVzcyk7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZWRHcm91cC5tYXAoYyA9PiBjLnRvQ1NTKHRydWUpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgcGFsZXR0ZSA9IGZlYXR1cmVkR3JvdXBzLmNvbmNhdChkZWZhdWx0UGFsZXR0ZUdyb3Vwcyk7XHJcbiAgICAgICAgcGFsZXR0ZS5wdXNoKE1PTk9fUEFMRVRURSk7XHJcblxyXG4gICAgICAgIGxldCBzZWwgPSA8YW55PiQoZWxlbSk7XHJcbiAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oe1xyXG4gICAgICAgICAgICBzaG93SW5wdXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGFsbG93RW1wdHk6IHRydWUsXHJcbiAgICAgICAgICAgIHByZWZlcnJlZEZvcm1hdDogXCJoZXhcIixcclxuICAgICAgICAgICAgc2hvd0J1dHRvbnM6IGZhbHNlLFxyXG4gICAgICAgICAgICBzaG93QWxwaGE6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dQYWxldHRlOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93U2VsZWN0aW9uUGFsZXR0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHBhbGV0dGU6IHBhbGV0dGUsXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZUtleTogXCJza2V0Y2h0ZXh0XCIsXHJcbiAgICAgICAgICAgIGNoYW5nZTogb25DaGFuZ2VcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHNldChlbGVtOiBIVE1MRWxlbWVudCwgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICg8YW55PiQoZWxlbSkpLnNwZWN0cnVtKFwic2V0XCIsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGVzdHJveShlbGVtKSB7XHJcbiAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oXCJkZXN0cm95XCIpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jbGFzcyBEb2N1bWVudEtleUhhbmRsZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG5cclxuICAgICAgICAvLyBub3RlOiB1bmRpc3Bvc2VkIGV2ZW50IHN1YnNjcmlwdGlvblxyXG4gICAgICAgICQoZG9jdW1lbnQpLmtleXVwKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSBEb21IZWxwZXJzLktleUNvZGVzLkVzYykge1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxufSIsImludGVyZmFjZSBKUXVlcnkge1xyXG4gICAgc2VsZWN0cGlja2VyKC4uLmFyZ3M6IGFueVtdKTtcclxuICAgIC8vcmVwbGFjZU9wdGlvbnMob3B0aW9uczogQXJyYXk8e3ZhbHVlOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmd9Pik7XHJcbn1cclxuXHJcbmNsYXNzIEZvbnRQaWNrZXIge1xyXG5cclxuICAgIGRlZmF1bHRGb250RmFtaWx5ID0gXCJSb2JvdG9cIjtcclxuICAgIHByZXZpZXdGb250U2l6ZSA9IFwiMjhweFwiO1xyXG5cclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSwgYmxvY2s6IFRleHRCbG9jaykge1xyXG4gICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICBjb25zdCBkb20kID0gUnguT2JzZXJ2YWJsZS5qdXN0KGJsb2NrKVxyXG4gICAgICAgICAgICAubWVyZ2UoXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKG0gPT4gbS5kYXRhLl9pZCA9PT0gYmxvY2suX2lkKVxyXG4gICAgICAgICAgICAgICAgLm1hcChtID0+IG0uZGF0YSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAubWFwKHRiID0+IHRoaXMucmVuZGVyKHRiKSk7XHJcbiAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKGRvbSQsIGNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKGJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XHJcbiAgICAgICAgbGV0IHVwZGF0ZSA9IHBhdGNoID0+IHtcclxuICAgICAgICAgICAgcGF0Y2guX2lkID0gYmxvY2suX2lkO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUF0dHIuZGlzcGF0Y2gocGF0Y2gpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgZWxlbWVudHM6IFZOb2RlW10gPSBbXTtcclxuICAgICAgICBlbGVtZW50cy5wdXNoKFxyXG4gICAgICAgICAgICBoKFwic2VsZWN0XCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiBcInNlbGVjdFBpY2tlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZmFtaWx5LXBpY2tlclwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IHZub2RlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZXYgPT4gdXBkYXRlKHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBldi50YXJnZXQudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogdGhpcy5zdG9yZS5yZXNvdXJjZXMuZm9udEZhbWlsaWVzLmRlZmF1bHRWYXJpYW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUucmVzb3VyY2VzLmZvbnRGYW1pbGllcy5nZXQoZXYudGFyZ2V0LnZhbHVlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5yZXNvdXJjZXMuZm9udEZhbWlsaWVzLmNhdGFsb2dcclxuICAgICAgICAgICAgICAgICAgICAubWFwKChmZjogRm9udEZhbWlseSkgPT4gaChcIm9wdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkOiBmZi5mYW1pbHkgPT09IGJsb2NrLmZvbnRGYW1pbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWNvbnRlbnRcIjogYDxzcGFuIHN0eWxlPVwiJHtGb250SGVscGVycy5nZXRTdHlsZVN0cmluZyhmZi5mYW1pbHksIG51bGwsIHRoaXMucHJldmlld0ZvbnRTaXplKX1cIj4ke2ZmLmZhbWlseX08L3NwYW4+YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW2ZmLmZhbWlseV0pXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZEZhbWlseSA9IHRoaXMuc3RvcmUucmVzb3VyY2VzLmZvbnRGYW1pbGllcy5nZXQoYmxvY2suZm9udEZhbWlseSk7XHJcbiAgICAgICAgaWYgKHNlbGVjdGVkRmFtaWx5ICYmIHNlbGVjdGVkRmFtaWx5LnZhcmlhbnRzIFxyXG4gICAgICAgICAgICAmJiBzZWxlY3RlZEZhbWlseS52YXJpYW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goaChcInNlbGVjdFwiLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleTogXCJ2YXJpYW50UGlja2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYW50LXBpY2tlclwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IHZub2RlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zdHBhdGNoOiAob2xkVm5vZGUsIHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBROiB3aHkgY2FuJ3Qgd2UganVzdCBkbyBzZWxlY3RwaWNrZXIocmVmcmVzaCkgaGVyZT9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBOiBzZWxlY3RwaWNrZXIgaGFzIG1lbnRhbCBwcm9ibGVtc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoXCJkZXN0cm95XCIpOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHVwZGF0ZSh7IGZvbnRWYXJpYW50OiBldi50YXJnZXQudmFsdWUgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRGYW1pbHkudmFyaWFudHMubWFwKHYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoKFwib3B0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHYgPT09IGJsb2NrLmZvbnRWYXJpYW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS1jb250YWluZXJcIjogXCJib2R5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWNvbnRlbnRcIjogYDxzcGFuIHN0eWxlPVwiJHtGb250SGVscGVycy5nZXRTdHlsZVN0cmluZyhzZWxlY3RlZEZhbWlseS5mYW1pbHksIHYsIHRoaXMucHJldmlld0ZvbnRTaXplKX1cIj4ke3Z9PC9zcGFuPmBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3ZdKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXZcIixcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2xhc3M6IHsgXCJmb250LXBpY2tlclwiOiB0cnVlIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZWxlbWVudHNcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5jbGFzcyBTZWxlY3RlZEl0ZW1FZGl0b3Ige1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xyXG5cclxuICAgICAgICBjb25zdCBkb20kID0gc3RvcmUuZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWQub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgIC5tYXAoaSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwb3NJdGVtID0gPFBvc2l0aW9uZWRPYmplY3RSZWY+aS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBwb3NJdGVtXHJcbiAgICAgICAgICAgICAgICAmJiBwb3NJdGVtLml0ZW1UeXBlID09PSAnVGV4dEJsb2NrJ1xyXG4gICAgICAgICAgICAgICAgJiYgXy5maW5kKHN0b3JlLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLCBcclxuICAgICAgICAgICAgICAgICAgICBiID0+IGIuX2lkID09PSBwb3NJdGVtLml0ZW1JZCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaCgnZGl2I2VkaXRvck92ZXJsYXknLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwibm9uZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0OiBwb3NJdGVtLmNsaWVudFggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvcDogcG9zSXRlbS5jbGllbnRZICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IFRleHRCbG9ja0VkaXRvcihzdG9yZSkucmVuZGVyKGJsb2NrKVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oZG9tJCwgY29udGFpbmVyKTtcclxuXHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFNrZXRjaEVkaXRvciBleHRlbmRzIENvbXBvbmVudDxBcHBTdGF0ZT4ge1xyXG5cclxuICAgIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcblxyXG4gICAgICAgIGNvbnN0IHNrZXRjaERvbSQgPSBzdG9yZS5ldmVudHMubWVyZ2UoXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLFxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkLFxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZGVzaWduZXIudXNlck1lc3NhZ2VDaGFuZ2VkKVxyXG4gICAgICAgICAgICAubWFwKG0gPT4gdGhpcy5yZW5kZXIoc3RvcmUuc3RhdGUpKTtcclxuICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oc2tldGNoRG9tJCwgY29udGFpbmVyKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHN0YXRlOiBBcHBTdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHNrZXRjaCA9IHN0YXRlLnNrZXRjaDtcclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXZcIiwgW1xyXG4gICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJBZGQgdGV4dDogXCIpLFxyXG4gICAgICAgICAgICBoKFwiaW5wdXQuYWRkLXRleHRcIiwge1xyXG4gICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBldi50YXJnZXQgJiYgZXYudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay5hZGQuZGlzcGF0Y2goeyB0ZXh0OiB0ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnRhcmdldC52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJQcmVzcyBbRW50ZXJdIHRvIGFkZFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJCYWNrZ3JvdW5kOiBcIiksXHJcbiAgICAgICAgICAgIGgoXCJpbnB1dC5iYWNrZ3JvdW5kLWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBza2V0Y2guYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5hdHRyVXBkYXRlLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlOiAob2xkVm5vZGUsIHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXQodm5vZGUuZWxtLCBza2V0Y2guYmFja2dyb3VuZENvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgIEJvb3RTY3JpcHQuZHJvcGRvd24oe1xyXG4gICAgICAgICAgICAgICAgaWQ6IFwic2tldGNoTWVudVwiLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogXCJBY3Rpb25zXCIsXHJcbiAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJOZXdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDcmVhdGUgbmV3IHNrZXRjaFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5jcmVhdGUuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiWm9vbSB0byBmaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJGaXQgY29udGVudHMgaW4gdmlld1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmRlc2lnbmVyLnpvb21Ub0ZpdC5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJFeHBvcnQgaW1hZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFeHBvcnQgRmlkZGxlIGFzIFBOR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5kZXNpZ25lci5leHBvcnRQTkcuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRXhwb3J0IFNWR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkV4cG9ydCBGaWRkbGUgYXMgdmVjdG9yIGdyYXBoaWNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZGVzaWduZXIuZXhwb3J0U1ZHLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRHVwbGljYXRlIHNrZXRjaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkNvcHkgY29udGVudHMgaW50byBuZXcgc2tldGNoXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmNsb25lLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pLFxyXG5cclxuICAgICAgICAgICAgaChcImRpdiNyaWdodFNpZGVcIixcclxuICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIGgoXCJzcGFuI3VzZXItbWVzc2FnZVwiLCB7fSwgW3N0YXRlLnVzZXJNZXNzYWdlIHx8IFwiXCJdKVxyXG4gICAgICAgICAgICBdKVxyXG5cclxuICAgICAgICBdXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iLCJjbGFzcyBUZXh0QmxvY2tFZGl0b3IgZXh0ZW5kcyBDb21wb25lbnQ8VGV4dEJsb2NrPiB7XHJcbiAgICBzdG9yZTogU3RvcmU7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKHRleHRCbG9jazogVGV4dEJsb2NrKTogVk5vZGUge1xyXG4gICAgICAgIGxldCB1cGRhdGUgPSB0YiA9PiB7XHJcbiAgICAgICAgICAgIHRiLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXR0ci5kaXNwYXRjaCh0Yik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXYudGV4dC1ibG9jay1lZGl0b3JcIixcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAga2V5OiB0ZXh0QmxvY2suX2lkXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIGgoXCJ0ZXh0YXJlYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2sudGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5cHJlc3M6IChldjogS2V5Ym9hcmRFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKHsgdGV4dDogKDxIVE1MVGV4dEFyZWFFbGVtZW50PmV2LnRhcmdldCkudmFsdWUgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZXYgPT4gdXBkYXRlKHsgdGV4dDogZXYudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5mb3JlXCIsIHt9LCBcIkFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC50ZXh0LWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlRleHQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0Q29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2tldGNoSGVscGVycy5jb2xvcnNJblVzZSh0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgdGV4dENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcImRpdi5mb250LWNvbG9yLWljb24uYmFja1wiLCB7fSwgXCJBXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCYWNrZ3JvdW5kIGNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHVwZGF0ZSh7IGJhY2tncm91bmRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgICAgIGgoXCJidXR0b24uZGVsZXRlLXRleHRibG9jay5idG4uYnRuLWRhbmdlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZS5kaXNwYXRjaCh0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcInNwYW4uZ2x5cGhpY29uLmdseXBoaWNvbi10cmFzaFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImRpdi5mb250LXBpY2tlci1jb250YWluZXJcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBGb250UGlja2VyKHZub2RlLmVsbSwgdGhpcy5zdG9yZSwgdGV4dEJsb2NrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBpbnNlcnQ6ICh2bm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IHByb3BzOiBGb250UGlja2VyUHJvcHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHN0b3JlOiB0aGlzLnN0b3JlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBzZWxlY3Rpb246IHRleHRCbG9jay5mb250RGVzYyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogKGZvbnREZXNjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB1cGRhdGUoeyBmb250RGVzYyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgUmVhY3RET00ucmVuZGVyKHJoKEZvbnRQaWNrZXIsIHByb3BzKSwgdm5vZGUuZWxtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICApLFxyXG5cclxuICAgICAgICAgICAgXSk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmNsYXNzIFdvcmtzcGFjZUNvbnRyb2xsZXIge1xyXG5cclxuICAgIHN0YXRpYyBURVhUX0NIQU5HRV9SRU5ERVJfVEhST1RUTEVfTVMgPSA1MDA7XHJcbiAgICBzdGF0aWMgQkxPQ0tfQk9VTkRTX0NIQU5HRV9USFJPVFRMRV9NUyA9IDUwMDtcclxuXHJcbiAgICBkZWZhdWx0U2l6ZSA9IG5ldyBwYXBlci5TaXplKDUwMDAwLCA0MDAwMCk7XHJcbiAgICBkZWZhdWx0U2NhbGUgPSAwLjAyO1xyXG5cclxuICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgZmFsbGJhY2tGb250OiBvcGVudHlwZS5Gb250O1xyXG4gICAgdmlld1pvb206IFZpZXdab29tO1xyXG5cclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG4gICAgcHJpdmF0ZSBfc2tldGNoOiBTa2V0Y2g7XHJcbiAgICBwcml2YXRlIF90ZXh0QmxvY2tJdGVtczogeyBbdGV4dEJsb2NrSWQ6IHN0cmluZ106IFRleHRXYXJwIH0gPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzdG9yZTogU3RvcmUsIGZhbGxiYWNrRm9udDogb3BlbnR5cGUuRm9udCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICB0aGlzLmZhbGxiYWNrRm9udCA9IGZhbGxiYWNrRm9udDtcclxuICAgICAgICBwYXBlci5zZXR0aW5ncy5oYW5kbGVTaXplID0gMTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5DYW52YXMnKTtcclxuICAgICAgICBwYXBlci5zZXR1cCh0aGlzLmNhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcGFwZXIucHJvamVjdDtcclxuXHJcbiAgICAgICAgdGhpcy52aWV3Wm9vbSA9IG5ldyBWaWV3Wm9vbSh0aGlzLnByb2plY3QpO1xyXG4gICAgICAgIHRoaXMudmlld1pvb20udmlld0NoYW5nZWQuc3Vic2NyaWJlKGJvdW5kcyA9PiB7XHJcbiAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuZGVzaWduZXIudmlld0NoYW5nZWQuZGlzcGF0Y2goYm91bmRzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgY2xlYXJTZWxlY3Rpb24gPSAoZXY6IHBhcGVyLlBhcGVyTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3RvcmUuc3RhdGUuc2VsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2gobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcGFwZXIudmlldy5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGNsZWFyU2VsZWN0aW9uKTtcclxuICAgICAgICBwYXBlci52aWV3Lm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnU3RhcnQsIGNsZWFyU2VsZWN0aW9uKTtcclxuXHJcbiAgICAgICAgY29uc3Qga2V5SGFuZGxlciA9IG5ldyBEb2N1bWVudEtleUhhbmRsZXIoc3RvcmUpO1xyXG5cclxuICAgICAgICAvLyAtLS0tLSBEZXNpZ25lciAtLS0tLVxyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMuZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuem9vbVRvRml0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHN0b3JlLmV2ZW50cy5kZXNpZ25lci5leHBvcnRQTkdSZXF1ZXN0ZWQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSB0aGlzLmdldFNrZXRjaEZpbGVOYW1lKDQwLCBcInBuZ1wiKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0U25hcHNob3RQTkcoKTtcclxuICAgICAgICAgICAgRG9tSGVscGVycy5kb3dubG9hZEZpbGUoZGF0YSwgZmlsZU5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMuZGVzaWduZXIuZXhwb3J0U1ZHUmVxdWVzdGVkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZG93bmxvYWRTVkcoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLmRlc2lnbmVyLnNuYXBzaG90RXhwaXJlZC5zdWJzY3JpYmUoKG0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YVVybCA9IHRoaXMuZ2V0U25hcHNob3RQTkcoKTtcclxuICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5kZXNpZ25lci51cGRhdGVTbmFwc2hvdC5kaXNwYXRjaCh7XHJcbiAgICAgICAgICAgICAgICBza2V0Y2g6IG0uZGF0YSwgcG5nRGF0YVVybDogZGF0YVVybFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0gU2tldGNoIC0tLS0tXHJcblxyXG4gICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2tldGNoID0gZXYuZGF0YTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtcyA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgIGlmIChtLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IG0uZGF0YS5pdGVtSWQgJiYgdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLml0ZW1JZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2sgJiYgIWJsb2NrLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tIFRleHRCbG9jayAtLS0tLVxyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMubWVyZ2VUeXBlZChcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5hZGRlZCxcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5sb2FkZWRcclxuICAgICAgICApLnN1YnNjcmliZShcclxuICAgICAgICAgICAgZXYgPT4gdGhpcy5hZGRCbG9jayhldi5kYXRhKSk7XHJcblxyXG4gICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWRcclxuICAgICAgICAgICAgLm9ic2VydmUoKVxyXG4gICAgICAgICAgICAudGhyb3R0bGUoV29ya3NwYWNlQ29udHJvbGxlci5URVhUX0NIQU5HRV9SRU5ERVJfVEhST1RUTEVfTVMpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0QmxvY2sgPSBtLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50ZXh0ID0gdGV4dEJsb2NrLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jdXN0b21TdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmZvbnRSZWFkeS5zdWJzY3JpYmVEYXRhKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbZGF0YS50ZXh0QmxvY2tJZF07XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmZvbnQgPSBkYXRhLmZvbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLnJlbW92ZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmVkaXRvckNsb3NlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHpvb21Ub0ZpdCgpIHtcclxuICAgICAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFZpZXdhYmxlQm91bmRzKCk7XHJcbiAgICAgICAgdGhpcy52aWV3Wm9vbS56b29tVG8oYm91bmRzLnNjYWxlKDEuMikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Vmlld2FibGVCb3VuZHMoKTogcGFwZXIuUmVjdGFuZ2xlIHtcclxuICAgICAgICBsZXQgYm91bmRzOiBwYXBlci5SZWN0YW5nbGU7XHJcbiAgICAgICAgXy5mb3JPd24odGhpcy5fdGV4dEJsb2NrSXRlbXMsIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGJvdW5kcyA9IGJvdW5kc1xyXG4gICAgICAgICAgICAgICAgPyBib3VuZHMudW5pdGUoaXRlbS5ib3VuZHMpXHJcbiAgICAgICAgICAgICAgICA6IGl0ZW0uYm91bmRzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICghYm91bmRzKSB7XHJcbiAgICAgICAgICAgIGJvdW5kcyA9IG5ldyBwYXBlci5SZWN0YW5nbGUobmV3IHBhcGVyLlBvaW50KDAsIDApLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2l6ZS5tdWx0aXBseSh0aGlzLmRlZmF1bHRTY2FsZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYm91bmRzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U25hcHNob3RQTkcoKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBiYWNrZ3JvdW5kID0gdGhpcy5pbnNlcnRCYWNrZ3JvdW5kKCk7XHJcbiAgICAgICAgY29uc3QgcmFzdGVyID0gdGhpcy5wcm9qZWN0LmFjdGl2ZUxheWVyLnJhc3Rlcml6ZSgzMDAsIGZhbHNlKTtcclxuICAgICAgICBjb25zdCBkYXRhID0gcmFzdGVyLnRvRGF0YVVSTCgpO1xyXG4gICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkb3dubG9hZFNWRygpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZDogcGFwZXIuSXRlbTtcclxuICAgICAgICBpZiAodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2guYmFja2dyb3VuZENvbG9yKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQgPSB0aGlzLmluc2VydEJhY2tncm91bmQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB1cmwgPSBcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LFwiICsgZW5jb2RlVVJJQ29tcG9uZW50KFxyXG4gICAgICAgICAgICA8c3RyaW5nPnRoaXMucHJvamVjdC5leHBvcnRTVkcoeyBhc1N0cmluZzogdHJ1ZSB9KSk7XHJcbiAgICAgICAgRG9tSGVscGVycy5kb3dubG9hZEZpbGUodXJsLCB0aGlzLmdldFNrZXRjaEZpbGVOYW1lKDQwLCBcInN2Z1wiKSk7XHJcblxyXG4gICAgICAgIGlmIChiYWNrZ3JvdW5kKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U2tldGNoRmlsZU5hbWUobGVuZ3RoOiBudW1iZXIsIGV4dGVuc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgb3V0ZXI6XHJcbiAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBibG9jay50ZXh0LnNwbGl0KC9cXHMvKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHJpbSA9IHdvcmQucmVwbGFjZSgvXFxXL2csICcnKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJpbS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGgpIG5hbWUgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZSArPSB0cmltO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUubGVuZ3RoID49IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghbmFtZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbmFtZSA9IFwiZmlkZGxlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuYW1lICsgXCIuXCIgKyBleHRlbnNpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgc2tldGNoIGJhY2tncm91bmQgdG8gcHJvdmlkZSBiYWNrZ3JvdW5kIGZpbGwgKGlmIG5lY2Vzc2FyeSlcclxuICAgICAqICAgYW5kIGFkZCBtYXJnaW4gYXJvdW5kIGVkZ2VzLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluc2VydEJhY2tncm91bmQoKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRWaWV3YWJsZUJvdW5kcygpO1xyXG4gICAgICAgIGNvbnN0IG1hcmdpbiA9IE1hdGgubWF4KGJvdW5kcy53aWR0aCwgYm91bmRzLmhlaWdodCkgKiAwLjAyO1xyXG4gICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSBwYXBlci5TaGFwZS5SZWN0YW5nbGUoXHJcbiAgICAgICAgICAgIGJvdW5kcy50b3BMZWZ0LnN1YnRyYWN0KG1hcmdpbiksXHJcbiAgICAgICAgICAgIGJvdW5kcy5ib3R0b21SaWdodC5hZGQobWFyZ2luKSk7XHJcbiAgICAgICAgYmFja2dyb3VuZC5maWxsQ29sb3IgPSB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaC5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgYmFja2dyb3VuZC5zZW5kVG9CYWNrKCk7XHJcbiAgICAgICAgcmV0dXJuIGJhY2tncm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRCbG9jayh0ZXh0QmxvY2s6IFRleHRCbG9jaykge1xyXG4gICAgICAgIGlmICghdGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGV4dEJsb2NrLl9pZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdyZWNlaXZlZCBibG9jayB3aXRob3V0IGlkJywgdGV4dEJsb2NrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbdGV4dEJsb2NrLl9pZF07XHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlJlY2VpdmVkIGFkZEJsb2NrIGZvciBibG9jayB0aGF0IGlzIGFscmVhZHkgbG9hZGVkXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYm91bmRzOiB7IHVwcGVyOiBwYXBlci5TZWdtZW50W10sIGxvd2VyOiBwYXBlci5TZWdtZW50W10gfTtcclxuXHJcbiAgICAgICAgaWYgKHRleHRCbG9jay5vdXRsaW5lKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvYWRTZWdtZW50ID0gKHJlY29yZDogU2VnbWVudFJlY29yZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9pbnQgPSByZWNvcmRbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuU2VnbWVudChcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KHJlY29yZFswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZFsxXSAmJiBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkWzJdICYmIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMl0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KG5ldyBwYXBlci5Qb2ludChyZWNvcmQpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgYm91bmRzID0ge1xyXG4gICAgICAgICAgICAgICAgdXBwZXI6IHRleHRCbG9jay5vdXRsaW5lLnRvcC5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpLFxyXG4gICAgICAgICAgICAgICAgbG93ZXI6IHRleHRCbG9jay5vdXRsaW5lLmJvdHRvbS5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtID0gbmV3IFRleHRXYXJwKFxyXG4gICAgICAgICAgICB0aGlzLmZhbGxiYWNrRm9udCxcclxuICAgICAgICAgICAgdGV4dEJsb2NrLnRleHQsXHJcbiAgICAgICAgICAgIGJvdW5kcyxcclxuICAgICAgICAgICAgbnVsbCwge1xyXG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yIHx8IFwicmVkXCIsICAgIC8vIHRleHRDb2xvciBzaG91bGQgaGF2ZSBiZWVuIHNldCBlbHNld2hlcmUgXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghdGV4dEJsb2NrLm91dGxpbmUgJiYgdGV4dEJsb2NrLnBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSBuZXcgcGFwZXIuUG9pbnQodGV4dEJsb2NrLnBvc2l0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW0ub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5jbGlja1dpdGhvdXREcmFnLCBldiA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2VsZWN0IG5leHQgaXRlbSBiZWhpbmRcclxuICAgICAgICAgICAgICAgIGxldCBvdGhlckhpdHMgPSAoPFRleHRXYXJwW10+Xy52YWx1ZXModGhpcy5fdGV4dEJsb2NrSXRlbXMpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoaSA9PiBpLmlkICE9PSBpdGVtLmlkICYmIGkuY29udGFpbnMoZXYucG9pbnQpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG90aGVySXRlbSA9IF8uc29ydEJ5KG90aGVySGl0cywgaSA9PiBpLmluZGV4KVswXTtcclxuICAgICAgICAgICAgICAgIGlmIChvdGhlckl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBvdGhlckl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJJZCA9IF8uZmluZEtleSh0aGlzLl90ZXh0QmxvY2tJdGVtcywgaSA9PiBpID09PSBvdGhlckl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdGhlcklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IG90aGVySWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgICAgICBpZighaXRlbS5zZWxlY3RlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgaXRlbUlkOiB0ZXh0QmxvY2suX2lkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIiB9KTsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0ZW0ub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdTdGFydCwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICBpZiAoIWl0ZW0uc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHsgaXRlbUlkOiB0ZXh0QmxvY2suX2lkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIiB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdGVtLm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnRW5kLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+dGhpcy5nZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW0pO1xyXG4gICAgICAgICAgICBibG9jay5faWQgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2UuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBpdGVtQ2hhbmdlJCA9IFBhcGVyTm90aWZ5Lm9ic2VydmUoaXRlbSwgUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5HRU9NRVRSWSk7XHJcbiAgICAgICAgaXRlbUNoYW5nZSRcclxuICAgICAgICAgICAgLmRlYm91bmNlKFdvcmtzcGFjZUNvbnRyb2xsZXIuQkxPQ0tfQk9VTkRTX0NIQU5HRV9USFJPVFRMRV9NUylcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSA8VGV4dEJsb2NrPnRoaXMuZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtKTtcclxuICAgICAgICAgICAgICAgIGJsb2NrLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2UuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXRlbS5kYXRhID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICBpZiAoIXRleHRCbG9jay5wb3NpdGlvbikge1xyXG4gICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLnBvaW50LmFkZChcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChpdGVtLmJvdW5kcy53aWR0aCAvIDIsIGl0ZW0uYm91bmRzLmhlaWdodCAvIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZCg1MCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtc1t0ZXh0QmxvY2suX2lkXSA9IGl0ZW07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW06IFRleHRXYXJwKTogQmxvY2tBcnJhbmdlbWVudCB7XHJcbiAgICAgICAgLy8gZXhwb3J0IHJldHVybnMgYW4gYXJyYXkgd2l0aCBpdGVtIHR5cGUgYW5kIHNlcmlhbGl6ZWQgb2JqZWN0OlxyXG4gICAgICAgIC8vICAgW1wiUGF0aFwiLCBQYXRoUmVjb3JkXVxyXG4gICAgICAgIGNvbnN0IHRvcCA9IDxQYXRoUmVjb3JkPml0ZW0udXBwZXIuZXhwb3J0SlNPTih7IGFzU3RyaW5nOiBmYWxzZSB9KVsxXTtcclxuICAgICAgICBjb25zdCBib3R0b20gPSA8UGF0aFJlY29yZD5pdGVtLmxvd2VyLmV4cG9ydEpTT04oeyBhc1N0cmluZzogZmFsc2UgfSlbMV07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBbaXRlbS5wb3NpdGlvbi54LCBpdGVtLnBvc2l0aW9uLnldLFxyXG4gICAgICAgICAgICBvdXRsaW5lOiB7IHRvcCwgYm90dG9tIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJcclxuZGVjbGFyZSB2YXIgc29sdmU6IChhOiBhbnksIGI6IGFueSwgZmFzdDogYm9vbGVhbikgPT4gdm9pZDtcclxuXHJcbmNsYXNzIFBlcnNwZWN0aXZlVHJhbnNmb3JtIHtcclxuICAgIFxyXG4gICAgc291cmNlOiBRdWFkO1xyXG4gICAgZGVzdDogUXVhZDtcclxuICAgIHBlcnNwOiBhbnk7XHJcbiAgICBtYXRyaXg6IG51bWJlcltdO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2U6IFF1YWQsIGRlc3Q6IFF1YWQpe1xyXG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuZGVzdCA9IGRlc3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tYXRyaXggPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5jcmVhdGVNYXRyaXgoc291cmNlLCBkZXN0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gR2l2ZW4gYSA0eDQgcGVyc3BlY3RpdmUgdHJhbnNmb3JtYXRpb24gbWF0cml4LCBhbmQgYSAyRCBwb2ludCAoYSAyeDEgdmVjdG9yKSxcclxuICAgIC8vIGFwcGxpZXMgdGhlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCBieSBjb252ZXJ0aW5nIHRoZSBwb2ludCB0byBob21vZ2VuZW91c1xyXG4gICAgLy8gY29vcmRpbmF0ZXMgYXQgej0wLCBwb3N0LW11bHRpcGx5aW5nLCBhbmQgdGhlbiBhcHBseWluZyBhIHBlcnNwZWN0aXZlIGRpdmlkZS5cclxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBsZXQgcDMgPSBQZXJzcGVjdGl2ZVRyYW5zZm9ybS5tdWx0aXBseSh0aGlzLm1hdHJpeCwgW3BvaW50LngsIHBvaW50LnksIDAsIDFdKTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IHBhcGVyLlBvaW50KHAzWzBdIC8gcDNbM10sIHAzWzFdIC8gcDNbM10pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBjcmVhdGVNYXRyaXgoc291cmNlOiBRdWFkLCB0YXJnZXQ6IFF1YWQpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNvdXJjZVBvaW50cyA9IFtcclxuICAgICAgICAgICAgW3NvdXJjZS5hLngsIHNvdXJjZS5hLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5iLngsIHNvdXJjZS5iLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5jLngsIHNvdXJjZS5jLnldLCBcclxuICAgICAgICAgICAgW3NvdXJjZS5kLngsIHNvdXJjZS5kLnldXTtcclxuICAgICAgICBsZXQgdGFyZ2V0UG9pbnRzID0gW1xyXG4gICAgICAgICAgICBbdGFyZ2V0LmEueCwgdGFyZ2V0LmEueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmIueCwgdGFyZ2V0LmIueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmMueCwgdGFyZ2V0LmMueV0sIFxyXG4gICAgICAgICAgICBbdGFyZ2V0LmQueCwgdGFyZ2V0LmQueV1dO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGEgPSBbXSwgYiA9IFtdLCBpID0gMCwgbiA9IHNvdXJjZVBvaW50cy5sZW5ndGg7IGkgPCBuOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHMgPSBzb3VyY2VQb2ludHNbaV0sIHQgPSB0YXJnZXRQb2ludHNbaV07XHJcbiAgICAgICAgICAgIGEucHVzaChbc1swXSwgc1sxXSwgMSwgMCwgMCwgMCwgLXNbMF0gKiB0WzBdLCAtc1sxXSAqIHRbMF1dKSwgYi5wdXNoKHRbMF0pO1xyXG4gICAgICAgICAgICBhLnB1c2goWzAsIDAsIDAsIHNbMF0sIHNbMV0sIDEsIC1zWzBdICogdFsxXSwgLXNbMV0gKiB0WzFdXSksIGIucHVzaCh0WzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBYID0gc29sdmUoYSwgYiwgdHJ1ZSk7IFxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIFhbMF0sIFhbM10sIDAsIFhbNl0sXHJcbiAgICAgICAgICAgIFhbMV0sIFhbNF0sIDAsIFhbN10sXHJcbiAgICAgICAgICAgICAgIDAsICAgIDAsIDEsICAgIDAsXHJcbiAgICAgICAgICAgIFhbMl0sIFhbNV0sIDAsICAgIDFcclxuICAgICAgICBdLm1hcChmdW5jdGlvbih4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHggKiAxMDAwMDApIC8gMTAwMDAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBvc3QtbXVsdGlwbHkgYSA0eDQgbWF0cml4IGluIGNvbHVtbi1tYWpvciBvcmRlciBieSBhIDR4MSBjb2x1bW4gdmVjdG9yOlxyXG4gICAgLy8gWyBtMCBtNCBtOCAgbTEyIF0gICBbIHYwIF0gICBbIHggXVxyXG4gICAgLy8gWyBtMSBtNSBtOSAgbTEzIF0gKiBbIHYxIF0gPSBbIHkgXVxyXG4gICAgLy8gWyBtMiBtNiBtMTAgbTE0IF0gICBbIHYyIF0gICBbIHogXVxyXG4gICAgLy8gWyBtMyBtNyBtMTEgbTE1IF0gICBbIHYzIF0gICBbIHcgXVxyXG4gICAgc3RhdGljIG11bHRpcGx5KG1hdHJpeCwgdmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgbWF0cml4WzBdICogdmVjdG9yWzBdICsgbWF0cml4WzRdICogdmVjdG9yWzFdICsgbWF0cml4WzggXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxMl0gKiB2ZWN0b3JbM10sXHJcbiAgICAgICAgICAgIG1hdHJpeFsxXSAqIHZlY3RvclswXSArIG1hdHJpeFs1XSAqIHZlY3RvclsxXSArIG1hdHJpeFs5IF0gKiB2ZWN0b3JbMl0gKyBtYXRyaXhbMTNdICogdmVjdG9yWzNdLFxyXG4gICAgICAgICAgICBtYXRyaXhbMl0gKiB2ZWN0b3JbMF0gKyBtYXRyaXhbNl0gKiB2ZWN0b3JbMV0gKyBtYXRyaXhbMTBdICogdmVjdG9yWzJdICsgbWF0cml4WzE0XSAqIHZlY3RvclszXSxcclxuICAgICAgICAgICAgbWF0cml4WzNdICogdmVjdG9yWzBdICsgbWF0cml4WzddICogdmVjdG9yWzFdICsgbWF0cml4WzExXSAqIHZlY3RvclsyXSArIG1hdHJpeFsxNV0gKiB2ZWN0b3JbM11cclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBRdWFkIHtcclxuICAgIGE6IHBhcGVyLlBvaW50O1xyXG4gICAgYjogcGFwZXIuUG9pbnQ7XHJcbiAgICBjOiBwYXBlci5Qb2ludDtcclxuICAgIGQ6IHBhcGVyLlBvaW50O1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQsIGM6IHBhcGVyLlBvaW50LCBkOiBwYXBlci5Qb2ludCl7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYyA9IGM7XHJcbiAgICAgICAgdGhpcy5kID0gZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21SZWN0YW5nbGUocmVjdDogcGFwZXIuUmVjdGFuZ2xlKXtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIHJlY3QudG9wTGVmdCxcclxuICAgICAgICAgICAgcmVjdC50b3BSaWdodCxcclxuICAgICAgICAgICAgcmVjdC5ib3R0b21MZWZ0LFxyXG4gICAgICAgICAgICByZWN0LmJvdHRvbVJpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGZyb21Db29yZHMoY29vcmRzOiBudW1iZXJbXSkgOiBRdWFkIHtcclxuICAgICAgICByZXR1cm4gbmV3IFF1YWQoXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMF0sIGNvb3Jkc1sxXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbMl0sIGNvb3Jkc1szXSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNF0sIGNvb3Jkc1s1XSksXHJcbiAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChjb29yZHNbNl0sIGNvb3Jkc1s3XSlcclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFzQ29vcmRzKCk6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB0aGlzLmEueCwgdGhpcy5hLnksXHJcbiAgICAgICAgICAgIHRoaXMuYi54LCB0aGlzLmIueSxcclxuICAgICAgICAgICAgdGhpcy5jLngsIHRoaXMuYy55LFxyXG4gICAgICAgICAgICB0aGlzLmQueCwgdGhpcy5kLnlcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59IiwiXHJcbmNsYXNzIER1YWxCb3VuZHNQYXRoV2FycCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuXHJcbiAgICBzdGF0aWMgUE9JTlRTX1BFUl9QQVRIID0gMjAwO1xyXG4gICAgc3RhdGljIFVQREFURV9ERUJPVU5DRSA9IDE1MDtcclxuXHJcbiAgICBwcml2YXRlIF9zb3VyY2U6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgIHByaXZhdGUgX3VwcGVyOiBTdHJldGNoUGF0aDtcclxuICAgIHByaXZhdGUgX2xvd2VyOiBTdHJldGNoUGF0aDtcclxuICAgIHByaXZhdGUgX3dhcnBlZDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgcHJpdmF0ZSBfb3V0bGluZTogcGFwZXIuUGF0aDtcclxuICAgIHByaXZhdGUgX2N1c3RvbVN0eWxlOiBTa2V0Y2hJdGVtU3R5bGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc291cmNlOiBwYXBlci5Db21wb3VuZFBhdGgsXHJcbiAgICAgICAgYm91bmRzPzogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH0sXHJcbiAgICAgICAgY3VzdG9tU3R5bGU/OiBTa2V0Y2hJdGVtU3R5bGUpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgLy8gLS0gYnVpbGQgY2hpbGRyZW4gLS1cclxuXHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgaWYgKGJvdW5kcykge1xyXG4gICAgICAgICAgICB0aGlzLl91cHBlciA9IG5ldyBTdHJldGNoUGF0aChib3VuZHMudXBwZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9sb3dlciA9IG5ldyBTdHJldGNoUGF0aChib3VuZHMubG93ZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwcGVyID0gbmV3IFN0cmV0Y2hQYXRoKFtcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMudG9wTGVmdCksXHJcbiAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLnRvcFJpZ2h0KVxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgdGhpcy5fbG93ZXIgPSBuZXcgU3RyZXRjaFBhdGgoW1xyXG4gICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy5ib3R0b21MZWZ0KSxcclxuICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMuYm90dG9tUmlnaHQpXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sQm91bmRzT3BhY2l0eSA9IDAuNzU7XHJcblxyXG4gICAgICAgIHRoaXMuX3VwcGVyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG4gICAgICAgIHRoaXMuX2xvd2VyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG5cclxuICAgICAgICB0aGlzLl9vdXRsaW5lID0gbmV3IHBhcGVyLlBhdGgoeyBjbG9zZWQ6IHRydWUgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lU2hhcGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fd2FycGVkID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChzb3VyY2UucGF0aERhdGEpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlV2FycGVkKCk7XHJcblxyXG4gICAgICAgIC8vIC0tIGFkZCBjaGlsZHJlbiAtLVxyXG5cclxuICAgICAgICB0aGlzLmFkZENoaWxkcmVuKFt0aGlzLl9vdXRsaW5lLCB0aGlzLl93YXJwZWQsIHRoaXMuX3VwcGVyLCB0aGlzLl9sb3dlcl0pO1xyXG5cclxuICAgICAgICAvLyAtLSBhc3NpZ24gc3R5bGUgLS1cclxuXHJcbiAgICAgICAgdGhpcy5jdXN0b21TdHlsZSA9IGN1c3RvbVN0eWxlIHx8IHtcclxuICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwibGlnaHRncmF5XCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBQYXBlckhlbHBlcnMuYWRkU21hcnREcmFnKHRoaXMpO1xyXG5cclxuICAgICAgICAvLyAtLSBzZXQgdXAgb2JzZXJ2ZXJzIC0tXHJcblxyXG4gICAgICAgIFJ4Lk9ic2VydmFibGUubWVyZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuX3VwcGVyLnBhdGhDaGFuZ2VkLm9ic2VydmUoKSxcclxuICAgICAgICAgICAgdGhpcy5fbG93ZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpKVxyXG4gICAgICAgICAgICAuZGVib3VuY2UoRHVhbEJvdW5kc1BhdGhXYXJwLlVQREFURV9ERUJPVU5DRSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZShwYXRoID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT3V0bGluZVNoYXBlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlZChQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkdFT01FVFJZKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlKGZsYWdzID0+IHtcclxuICAgICAgICAgICAgaWYgKGZsYWdzICYgUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5BVFRSSUJVVEUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl91cHBlci52aXNpYmxlICE9PSB0aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG93ZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdXBwZXIoKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwcGVyLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvd2VyKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb3dlci5wYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzb3VyY2UodmFsdWU6IHBhcGVyLkNvbXBvdW5kUGF0aCkge1xyXG4gICAgICAgIGlmKHZhbHVlKXtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlICYmIHRoaXMuX3NvdXJjZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlV2FycGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXN0b21TdHlsZSgpOiBTa2V0Y2hJdGVtU3R5bGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXN0b21TdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY3VzdG9tU3R5bGUodmFsdWU6IFNrZXRjaEl0ZW1TdHlsZSkge1xyXG4gICAgICAgIHRoaXMuX2N1c3RvbVN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fd2FycGVkLnN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbHVlLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IHZhbHVlLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNvbnRyb2xCb3VuZHNPcGFjaXR5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl91cHBlci5vcGFjaXR5ID0gdGhpcy5fbG93ZXIub3BhY2l0eSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIG91dGxpbmVDb250YWlucyhwb2ludDogcGFwZXIuUG9pbnQpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vdXRsaW5lLmNvbnRhaW5zKHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVdhcnBlZCgpIHtcclxuICAgICAgICBsZXQgb3J0aE9yaWdpbiA9IHRoaXMuX3NvdXJjZS5ib3VuZHMudG9wTGVmdDtcclxuICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5fc291cmNlLmJvdW5kcy53aWR0aDtcclxuICAgICAgICBsZXQgb3J0aEhlaWdodCA9IHRoaXMuX3NvdXJjZS5ib3VuZHMuaGVpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgcHJvamVjdGlvbiA9IFBhcGVySGVscGVycy5kdWFsQm91bmRzUGF0aFByb2plY3Rpb24oXHJcbiAgICAgICAgICAgIHRoaXMuX3VwcGVyLnBhdGgsIHRoaXMuX2xvd2VyLnBhdGgpO1xyXG4gICAgICAgIGxldCB0cmFuc2Zvcm0gPSBuZXcgUGF0aFRyYW5zZm9ybShwb2ludCA9PiB7XHJcbiAgICAgICAgICAgIGlmICghcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwb2ludDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChvcnRoT3JpZ2luKTtcclxuICAgICAgICAgICAgbGV0IHVuaXQgPSBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICByZWxhdGl2ZS54IC8gb3J0aFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIG9ydGhIZWlnaHQpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdGVkID0gcHJvamVjdGlvbih1bml0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb2plY3RlZDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3UGF0aHMgPSB0aGlzLl9zb3VyY2UuY2hpbGRyZW5cclxuICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSA8cGFwZXIuUGF0aD5pdGVtO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeFBvaW50cyA9IFBhcGVySGVscGVycy50cmFjZVBhdGhBc1BvaW50cyhwYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgIER1YWxCb3VuZHNQYXRoV2FycC5QT0lOVFNfUEVSX1BBVEgpXHJcbiAgICAgICAgICAgICAgICAgICAgLm1hcChwID0+IHRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludChwKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4UGF0aCA9IG5ldyBwYXBlci5QYXRoKHtcclxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogeFBvaW50cyxcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvL3hQYXRoLnNpbXBsaWZ5KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geFBhdGg7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5fd2FycGVkLnJlbW92ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgdGhpcy5fd2FycGVkLmFkZENoaWxkcmVuKG5ld1BhdGhzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZU91dGxpbmVTaGFwZSgpIHtcclxuICAgICAgICBjb25zdCBsb3dlciA9IG5ldyBwYXBlci5QYXRoKHRoaXMuX2xvd2VyLnBhdGguc2VnbWVudHMpO1xyXG4gICAgICAgIGxvd2VyLnJldmVyc2UoKTtcclxuICAgICAgICB0aGlzLl9vdXRsaW5lLnNlZ21lbnRzID0gdGhpcy5fdXBwZXIucGF0aC5zZWdtZW50cy5jb25jYXQobG93ZXIuc2VnbWVudHMpO1xyXG4gICAgICAgIGxvd2VyLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5jbGFzcyBQYXRoSGFuZGxlIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgIHN0YXRpYyBNQVJLRVJfUkFESVVTID0gODtcclxuICAgIHN0YXRpYyBEUkFHX1RIUkVTSE9MRCA9IDM7XHJcblxyXG4gICAgcHJpdmF0ZSBfbWFya2VyOiBwYXBlci5TaGFwZTtcclxuICAgIHByaXZhdGUgX3NlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XHJcbiAgICBwcml2YXRlIF9jdXJ2ZTogcGFwZXIuQ3VydmU7XHJcbiAgICBwcml2YXRlIF9zbW9vdGhlZDogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX2N1cnZlU3BsaXQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PG51bWJlcj4oKTtcclxuICAgIHByaXZhdGUgX2N1cnZlQ2hhbmdlVW5zdWI6ICgpID0+IHZvaWQ7XHJcbiAgICBwcml2YXRlIGRyYWdnaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGF0dGFjaDogcGFwZXIuU2VnbWVudCB8IHBhcGVyLkN1cnZlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgbGV0IHBvc2l0aW9uOiBwYXBlci5Qb2ludDtcclxuICAgICAgICBsZXQgcGF0aDogcGFwZXIuUGF0aDtcclxuICAgICAgICBpZiAoYXR0YWNoIGluc3RhbmNlb2YgcGFwZXIuU2VnbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gPHBhcGVyLlNlZ21lbnQ+YXR0YWNoO1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuX3NlZ21lbnQucG9pbnQ7XHJcbiAgICAgICAgICAgIHBhdGggPSB0aGlzLl9zZWdtZW50LnBhdGg7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhdHRhY2ggaW5zdGFuY2VvZiBwYXBlci5DdXJ2ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJ2ZSA9IDxwYXBlci5DdXJ2ZT5hdHRhY2g7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fY3VydmUuZ2V0UG9pbnRBdCh0aGlzLl9jdXJ2ZS5sZW5ndGggKiAwLjUpO1xyXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5fY3VydmUucGF0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBcImF0dGFjaCBtdXN0IGJlIFNlZ21lbnQgb3IgQ3VydmVcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21hcmtlciA9IHBhcGVyLlNoYXBlLkNpcmNsZShwb3NpdGlvbiwgUGF0aEhhbmRsZS5NQVJLRVJfUkFESVVTKTtcclxuICAgICAgICB0aGlzLl9tYXJrZXIuc3Ryb2tlQ29sb3IgPSBcImJsdWVcIjtcclxuICAgICAgICB0aGlzLl9tYXJrZXIuZmlsbENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fbWFya2VyKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZUFzU2VnbWVudCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGVBc0N1cnZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBQYXBlckhlbHBlcnMuYWRkU21hcnREcmFnKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLm9uKFBhcGVySGVscGVycy5FdmVudFR5cGUuc21hcnREcmFnU3RhcnQsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnZlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzcGxpdCB0aGUgY3VydmUsIHB1cGF0ZSB0byBzZWdtZW50IGhhbmRsZVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZUNoYW5nZVVuc3ViKCk7ICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudCA9IG5ldyBwYXBlci5TZWdtZW50KHRoaXMuY2VudGVyKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnZlSWR4ID0gdGhpcy5fY3VydmUuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZS5wYXRoLmluc2VydChcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZUlkeCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBc1NlZ21lbnQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VydmVTcGxpdC5ub3RpZnkoY3VydmVJZHgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdNb3ZlLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZWdtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LnBvaW50ID0gdGhpcy5jZW50ZXI7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc21vb3RoZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMub24oUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5jbGlja1dpdGhvdXREcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZWdtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNtb290aGVkID0gIXRoaXMuc21vb3RoZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fY3VydmVDaGFuZ2VVbnN1YiA9IHBhdGguc3Vic2NyaWJlKGZsYWdzID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnZlICYmICF0aGlzLl9zZWdtZW50IFxyXG4gICAgICAgICAgICAgICAgJiYgKGZsYWdzICYgUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5TRUdNRU5UUykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2VudGVyID0gdGhpcy5fY3VydmUuZ2V0UG9pbnRBdCh0aGlzLl9jdXJ2ZS5sZW5ndGggKiAwLjUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldCBzbW9vdGhlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc21vb3RoZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNtb290aGVkKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fc21vb3RoZWQgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5oYW5kbGVJbiA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuaGFuZGxlT3V0ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnZlU3BsaXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnZlU3BsaXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNlbnRlcigpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNlbnRlcihwb2ludDogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9pbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdHlsZUFzU2VnbWVudCgpIHtcclxuICAgICAgICB0aGlzLl9tYXJrZXIub3BhY2l0eSA9IDAuODtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0eWxlQXNDdXJ2ZSgpIHtcclxuICAgICAgICB0aGlzLl9tYXJrZXIub3BhY2l0eSA9IDAuMztcclxuICAgIH1cclxuXHJcbn0iLCJcclxuY2xhc3MgUGF0aFNlY3Rpb24gaW1wbGVtZW50cyBwYXBlci5DdXJ2ZWxpa2Uge1xyXG4gICAgcGF0aDogcGFwZXIuUGF0aDtcclxuICAgIG9mZnNldDogbnVtYmVyO1xyXG4gICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHBhdGg6IHBhcGVyLlBhdGgsIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcil7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aC5nZXRQb2ludEF0KG9mZnNldCArIHRoaXMub2Zmc2V0KTtcclxuICAgIH1cclxufSIsIlxyXG5jbGFzcyBQYXRoVHJhbnNmb3JtIHtcclxuICAgIHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICB0aGlzLnBvaW50VHJhbnNmb3JtID0gcG9pbnRUcmFuc2Zvcm07XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtUG9pbnQocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50VHJhbnNmb3JtKHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1QYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSkge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1Db21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1QYXRoKHBhdGg6IHBhcGVyLlBhdGgpIHtcclxuICAgICAgICBmb3IgKGxldCBzZWdtZW50IG9mIHBhdGguc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgbGV0IG9yaWdQb2ludCA9IHNlZ21lbnQucG9pbnQ7XHJcbiAgICAgICAgICAgIGxldCBuZXdQb2ludCA9IHRoaXMudHJhbnNmb3JtUG9pbnQoc2VnbWVudC5wb2ludCk7XHJcbiAgICAgICAgICAgIG9yaWdQb2ludC54ID0gbmV3UG9pbnQueDtcclxuICAgICAgICAgICAgb3JpZ1BvaW50LnkgPSBuZXdQb2ludC55O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4iLCJcclxuY2xhc3MgU3RyZXRjaFBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgcHJpdmF0ZSBfcGF0aDogcGFwZXIuUGF0aDtcclxuICAgIHByaXZhdGUgX3BhdGhDaGFuZ2VkID0gbmV3IE9ic2VydmFibGVFdmVudDxwYXBlci5QYXRoPigpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNlZ21lbnRzOiBwYXBlci5TZWdtZW50W10sIHN0eWxlPzogcGFwZXIuU3R5bGUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLl9wYXRoID0gbmV3IHBhcGVyLlBhdGgoc2VnbWVudHMpO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fcGF0aCk7XHJcblxyXG4gICAgICAgIGlmKHN0eWxlKXtcclxuICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHlsZSA9IHN0eWxlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhdGguc3Ryb2tlQ29sb3IgPSBcImxpZ2h0Z3JheVwiO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXRoLnN0cm9rZVdpZHRoID0gNjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGNvbnN0IHMgb2YgdGhpcy5fcGF0aC5zZWdtZW50cyl7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkU2VnbWVudEhhbmRsZShzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGNvbnN0IGMgb2YgdGhpcy5fcGF0aC5jdXJ2ZXMpe1xyXG4gICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKGMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHBhdGgoKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBwYXRoQ2hhbmdlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGF0aENoYW5nZWQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgYWRkU2VnbWVudEhhbmRsZShzZWdtZW50OiBwYXBlci5TZWdtZW50KXtcclxuICAgICAgICB0aGlzLmFkZEhhbmRsZShuZXcgUGF0aEhhbmRsZShzZWdtZW50KSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgYWRkQ3VydmVIYW5kbGUoY3VydmU6IHBhcGVyLkN1cnZlKXtcclxuICAgICAgICBsZXQgaGFuZGxlID0gbmV3IFBhdGhIYW5kbGUoY3VydmUpO1xyXG4gICAgICAgIGhhbmRsZS5jdXJ2ZVNwbGl0LnN1YnNjcmliZU9uZShjdXJ2ZUlkeCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ3VydmVIYW5kbGUodGhpcy5fcGF0aC5jdXJ2ZXNbY3VydmVJZHhdKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZSh0aGlzLl9wYXRoLmN1cnZlc1tjdXJ2ZUlkeCArIDFdKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFkZEhhbmRsZShoYW5kbGUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGFkZEhhbmRsZShoYW5kbGU6IFBhdGhIYW5kbGUpe1xyXG4gICAgICAgIGhhbmRsZS52aXNpYmxlID0gdGhpcy52aXNpYmxlO1xyXG4gICAgICAgIGhhbmRsZS5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLnNtYXJ0RHJhZ01vdmUsIGV2ID0+IHtcclxuICAgICAgICAgICB0aGlzLl9wYXRoQ2hhbmdlZC5ub3RpZnkodGhpcy5fcGF0aCk7IFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGhhbmRsZS5vbihQYXBlckhlbHBlcnMuRXZlbnRUeXBlLmNsaWNrV2l0aG91dERyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICB0aGlzLl9wYXRoQ2hhbmdlZC5ub3RpZnkodGhpcy5fcGF0aCk7IFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChoYW5kbGUpOyAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbi8qKlxyXG4gKiBNZWFzdXJlcyBvZmZzZXRzIG9mIHRleHQgZ2x5cGhzLlxyXG4gKi9cclxuY2xhc3MgVGV4dFJ1bGVyIHtcclxuICAgIFxyXG4gICAgZm9udEZhbWlseTogc3RyaW5nO1xyXG4gICAgZm9udFdlaWdodDogbnVtYmVyO1xyXG4gICAgZm9udFNpemU6IG51bWJlcjtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQb2ludFRleHQgKHRleHQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICB2YXIgcG9pbnRUZXh0ID0gbmV3IHBhcGVyLlBvaW50VGV4dCgpO1xyXG4gICAgICAgIHBvaW50VGV4dC5jb250ZW50ID0gdGV4dDtcclxuICAgICAgICBwb2ludFRleHQuanVzdGlmaWNhdGlvbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgaWYodGhpcy5mb250RmFtaWx5KXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRGYW1pbHkgPSB0aGlzLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZm9udFdlaWdodCl7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5mb250V2VpZ2h0ID0gdGhpcy5mb250V2VpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmZvbnRTaXplKXtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHBvaW50VGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUZXh0T2Zmc2V0cyh0ZXh0KXtcclxuICAgICAgICAvLyBNZWFzdXJlIGdseXBocyBpbiBwYWlycyB0byBjYXB0dXJlIHdoaXRlIHNwYWNlLlxyXG4gICAgICAgIC8vIFBhaXJzIGFyZSBjaGFyYWN0ZXJzIGkgYW5kIGkrMS5cclxuICAgICAgICB2YXIgZ2x5cGhQYWlycyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBnbHlwaFBhaXJzW2ldID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSwgaSsxKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEZvciBlYWNoIGNoYXJhY3RlciwgZmluZCBjZW50ZXIgb2Zmc2V0LlxyXG4gICAgICAgIHZhciB4T2Zmc2V0cyA9IFswXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIE1lYXN1cmUgdGhyZWUgY2hhcmFjdGVycyBhdCBhIHRpbWUgdG8gZ2V0IHRoZSBhcHByb3ByaWF0ZSBcclxuICAgICAgICAgICAgLy8gICBzcGFjZSBiZWZvcmUgYW5kIGFmdGVyIHRoZSBnbHlwaC5cclxuICAgICAgICAgICAgdmFyIHRyaWFkVGV4dCA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGkgLSAxLCBpICsgMSkpO1xyXG4gICAgICAgICAgICB0cmlhZFRleHQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCBvdXQgaGFsZiBvZiBwcmlvciBnbHlwaCBwYWlyIFxyXG4gICAgICAgICAgICAvLyAgIGFuZCBoYWxmIG9mIGN1cnJlbnQgZ2x5cGggcGFpci5cclxuICAgICAgICAgICAgLy8gTXVzdCBiZSByaWdodCwgYmVjYXVzZSBpdCB3b3Jrcy5cclxuICAgICAgICAgICAgbGV0IG9mZnNldFdpZHRoID0gdHJpYWRUZXh0LmJvdW5kcy53aWR0aCBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpIC0gMV0uYm91bmRzLndpZHRoIC8gMiBcclxuICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpXS5ib3VuZHMud2lkdGggLyAyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQWRkIG9mZnNldCB3aWR0aCB0byBwcmlvciBvZmZzZXQuIFxyXG4gICAgICAgICAgICB4T2Zmc2V0c1tpXSA9IHhPZmZzZXRzW2kgLSAxXSArIG9mZnNldFdpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGdseXBoUGFpciBvZiBnbHlwaFBhaXJzKXtcclxuICAgICAgICAgICAgZ2x5cGhQYWlyLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4geE9mZnNldHM7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmNsYXNzIFRleHRXYXJwIGV4dGVuZHMgRHVhbEJvdW5kc1BhdGhXYXJwIHtcclxuXHJcbiAgICBzdGF0aWMgREVGQVVMVF9GT05UX1NJWkUgPSAxMjg7XHJcblxyXG4gICAgcHJpdmF0ZSBfZm9udDogb3BlbnR5cGUuRm9udDtcclxuICAgIHByaXZhdGUgX3RleHQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2ZvbnRTaXplOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZm9udDogb3BlbnR5cGUuRm9udCxcclxuICAgICAgICB0ZXh0OiBzdHJpbmcsXHJcbiAgICAgICAgYm91bmRzPzogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH0sXHJcbiAgICAgICAgZm9udFNpemU/OiBudW1iZXIsXHJcbiAgICAgICAgc3R5bGU/OiBTa2V0Y2hJdGVtU3R5bGUpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKCFmb250U2l6ZSl7XHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZSA9IFRleHRXYXJwLkRFRkFVTFRfRk9OVF9TSVpFO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IFRleHRXYXJwLmdldFBhdGhEYXRhKGZvbnQsIHRleHQsIGZvbnRTaXplKTsgXHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHN1cGVyKHBhdGgsIGJvdW5kcywgc3R5bGUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHQgPSB0ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0ZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHRleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX3RleHQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGZvbnRTaXplKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXQgZm9udFNpemUodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmKCF2YWx1ZSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZm9udFNpemUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGZvbnQodmFsdWU6IG9wZW50eXBlLkZvbnQpe1xyXG4gICAgICAgIGlmKHZhbHVlICE9PSB0aGlzLl9mb250KXtcclxuICAgICAgICAgICAgdGhpcy5fZm9udCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVRleHRQYXRoKCkge1xyXG4gICAgICAgIGNvbnN0IHBhdGhEYXRhID0gVGV4dFdhcnAuZ2V0UGF0aERhdGEoXHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQsIHRoaXMuX3RleHQsIHRoaXMuX2ZvbnRTaXplKTtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IG5ldyBwYXBlci5Db21wb3VuZFBhdGgocGF0aERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldFBhdGhEYXRhKGZvbnQ6IG9wZW50eXBlLkZvbnQsXHJcbiAgICAgICAgdGV4dDogc3RyaW5nLCBmb250U2l6ZT86IHN0cmluZ3xudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBvcGVuVHlwZVBhdGggPSBmb250LmdldFBhdGgodGV4dCwgMCwgMCxcclxuICAgICAgICAgICAgTnVtYmVyKGZvbnRTaXplKSB8fCBUZXh0V2FycC5ERUZBVUxUX0ZPTlRfU0laRSk7XHJcbiAgICAgICAgcmV0dXJuIG9wZW5UeXBlUGF0aC50b1BhdGhEYXRhKCk7XHJcbiAgICB9XHJcbn0iLCJcclxuY2xhc3MgVmlld1pvb20ge1xyXG5cclxuICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcbiAgICBmYWN0b3IgPSAxLjI1O1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9taW5ab29tOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9tYXhab29tOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9tb3VzZU5hdGl2ZVN0YXJ0OiBwYXBlci5Qb2ludDtcclxuICAgIHByaXZhdGUgX3ZpZXdDZW50ZXJTdGFydDogcGFwZXIuUG9pbnQ7XHJcbiAgICBwcml2YXRlIF92aWV3Q2hhbmdlZCA9IG5ldyBPYnNlcnZhYmxlRXZlbnQ8cGFwZXIuUmVjdGFuZ2xlPigpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb2plY3Q6IHBhcGVyLlByb2plY3QpIHtcclxuICAgICAgICB0aGlzLnByb2plY3QgPSBwcm9qZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuXHJcbiAgICAgICAgKDxhbnk+JCh2aWV3LmVsZW1lbnQpKS5tb3VzZXdoZWVsKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBtb3VzZVBvc2l0aW9uID0gbmV3IHBhcGVyLlBvaW50KGV2ZW50Lm9mZnNldFgsIGV2ZW50Lm9mZnNldFkpO1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVpvb21DZW50ZXJlZChldmVudC5kZWx0YVksIG1vdXNlUG9zaXRpb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBkaWREcmFnID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmlldy5vbihcIm1vdXNlZHJhZ1wiLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLl92aWV3Q2VudGVyU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmlld0NlbnRlclN0YXJ0ID0gdmlldy5jZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAvLyBIYXZlIHRvIHVzZSBuYXRpdmUgbW91c2Ugb2Zmc2V0LCBiZWNhdXNlIGV2LmRlbHRhIFxyXG4gICAgICAgICAgICAgICAgLy8gIGNoYW5nZXMgYXMgdGhlIHZpZXcgaXMgc2Nyb2xsZWQuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZU5hdGl2ZVN0YXJ0ID0gbmV3IHBhcGVyLlBvaW50KGV2LmV2ZW50Lm9mZnNldFgsIGV2LmV2ZW50Lm9mZnNldFkpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcuZW1pdChQYXBlckhlbHBlcnMuRXZlbnRUeXBlLnNtYXJ0RHJhZ1N0YXJ0LCBldik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYXRpdmVEZWx0YSA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgICAgICBldi5ldmVudC5vZmZzZXRYIC0gdGhpcy5fbW91c2VOYXRpdmVTdGFydC54LFxyXG4gICAgICAgICAgICAgICAgICAgIGV2LmV2ZW50Lm9mZnNldFkgLSB0aGlzLl9tb3VzZU5hdGl2ZVN0YXJ0LnlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAvLyBNb3ZlIGludG8gdmlldyBjb29yZGluYXRlcyB0byBzdWJyYWN0IGRlbHRhLFxyXG4gICAgICAgICAgICAgICAgLy8gIHRoZW4gYmFjayBpbnRvIHByb2plY3QgY29vcmRzLlxyXG4gICAgICAgICAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LnZpZXdUb1Byb2plY3QoIFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcucHJvamVjdFRvVmlldyh0aGlzLl92aWV3Q2VudGVyU3RhcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1YnRyYWN0KG5hdGl2ZURlbHRhKSk7XHJcbiAgICAgICAgICAgICAgICB2aWV3LmVtaXQoUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdNb3ZlLCBldik7XHJcbiAgICAgICAgICAgICAgICBkaWREcmFnID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZpZXcub24oXCJtb3VzZXVwXCIsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5fbW91c2VOYXRpdmVTdGFydCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZU5hdGl2ZVN0YXJ0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDZW50ZXJTdGFydCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2aWV3LmVtaXQoUGFwZXJIZWxwZXJzLkV2ZW50VHlwZS5zbWFydERyYWdFbmQsIGV2KTtcclxuICAgICAgICAgICAgICAgIGlmKGRpZERyYWcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpZERyYWcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2aWV3Q2hhbmdlZCgpIDogT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlJlY3RhbmdsZT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92aWV3Q2hhbmdlZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgem9vbSgpOiBudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvamVjdC52aWV3Lnpvb207XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHpvb21SYW5nZSgpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLl9taW5ab29tLCB0aGlzLl9tYXhab29tXTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRab29tUmFuZ2UocmFuZ2U6IHBhcGVyLlNpemVbXSk6IG51bWJlcltdIHtcclxuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgY29uc3QgYVNpemUgPSByYW5nZS5zaGlmdCgpO1xyXG4gICAgICAgIGNvbnN0IGJTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICBjb25zdCBhID0gYVNpemUgJiYgTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBhU2l6ZS5oZWlnaHQsICAgICAgICAgXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYVNpemUud2lkdGgpO1xyXG4gICAgICAgIGNvbnN0IGIgPSBiU2l6ZSAmJiBNYXRoLm1pbiggXHJcbiAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIGJTaXplLmhlaWdodCwgICAgICAgICBcclxuICAgICAgICAgICAgdmlldy5ib3VuZHMud2lkdGggLyBiU2l6ZS53aWR0aCk7XHJcbiAgICAgICAgY29uc3QgbWluID0gTWF0aC5taW4oYSxiKTtcclxuICAgICAgICBpZihtaW4pe1xyXG4gICAgICAgICAgICB0aGlzLl9taW5ab29tID0gbWluO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heChhLGIpO1xyXG4gICAgICAgIGlmKG1heCl7XHJcbiAgICAgICAgICAgIHRoaXMuX21heFpvb20gPSBtYXg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICB9XHJcblxyXG4gICAgem9vbVRvKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSl7XHJcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgIHZpZXcuY2VudGVyID0gcmVjdC5jZW50ZXI7XHJcbiAgICAgICAgdmlldy56b29tID0gTWF0aC5taW4oIFxyXG4gICAgICAgICAgICB2aWV3LnZpZXdTaXplLmhlaWdodCAvIHJlY3QuaGVpZ2h0LCBcclxuICAgICAgICAgICAgdmlldy52aWV3U2l6ZS53aWR0aCAvIHJlY3Qud2lkdGgpO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdDaGFuZ2VkLm5vdGlmeSh2aWV3LmJvdW5kcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlWm9vbUNlbnRlcmVkKGRlbHRhOiBudW1iZXIsIG1vdXNlUG9zOiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIGlmICghZGVsdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgY29uc3Qgb2xkWm9vbSA9IHZpZXcuem9vbTtcclxuICAgICAgICBjb25zdCBvbGRDZW50ZXIgPSB2aWV3LmNlbnRlcjtcclxuICAgICAgICBjb25zdCB2aWV3UG9zID0gdmlldy52aWV3VG9Qcm9qZWN0KG1vdXNlUG9zKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbmV3Wm9vbSA9IGRlbHRhID4gMFxyXG4gICAgICAgICAgICA/IHZpZXcuem9vbSAqIHRoaXMuZmFjdG9yXHJcbiAgICAgICAgICAgIDogdmlldy56b29tIC8gdGhpcy5mYWN0b3I7XHJcbiAgICAgICAgbmV3Wm9vbSA9IHRoaXMuc2V0Wm9vbUNvbnN0cmFpbmVkKG5ld1pvb20pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCFuZXdab29tKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgem9vbVNjYWxlID0gb2xkWm9vbSAvIG5ld1pvb207XHJcbiAgICAgICAgY29uc3QgY2VudGVyQWRqdXN0ID0gdmlld1Bvcy5zdWJ0cmFjdChvbGRDZW50ZXIpO1xyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHZpZXdQb3Muc3VidHJhY3QoY2VudGVyQWRqdXN0Lm11bHRpcGx5KHpvb21TY2FsZSkpXHJcbiAgICAgICAgICAgIC5zdWJ0cmFjdChvbGRDZW50ZXIpO1xyXG5cclxuICAgICAgICB2aWV3LmNlbnRlciA9IHZpZXcuY2VudGVyLmFkZChvZmZzZXQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3ZpZXdDaGFuZ2VkLm5vdGlmeSh2aWV3LmJvdW5kcyk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFNldCB6b29tIGxldmVsLlxyXG4gICAgICogQHJldHVybnMgem9vbSBsZXZlbCB0aGF0IHdhcyBzZXQsIG9yIG51bGwgaWYgaXQgd2FzIG5vdCBjaGFuZ2VkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc2V0Wm9vbUNvbnN0cmFpbmVkKHpvb206IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgaWYodGhpcy5fbWluWm9vbSkge1xyXG4gICAgICAgICAgICB6b29tID0gTWF0aC5tYXgoem9vbSwgdGhpcy5fbWluWm9vbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX21heFpvb20pe1xyXG4gICAgICAgICAgICB6b29tID0gTWF0aC5taW4oem9vbSwgdGhpcy5fbWF4Wm9vbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICBpZih6b29tICE9IHZpZXcuem9vbSl7XHJcbiAgICAgICAgICAgIHZpZXcuem9vbSA9IHpvb207XHJcbiAgICAgICAgICAgIHJldHVybiB6b29tO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG4iLCJcclxuaW50ZXJmYWNlIFNrZXRjaEl0ZW1TdHlsZSBleHRlbmRzIHBhcGVyLklTdHlsZSB7XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbn1cclxuIiwiXHJcblxyXG5mdW5jdGlvbiBib290c3RyYXAoKSB7XHJcbiAgICBcclxuICAgIGNvbnN0IHJvdXRlciA9IG5ldyBBcHBSb3V0ZXIoKTtcclxuICAgIGNvbnN0IHN0b3JlID0gbmV3IFN0b3JlKHJvdXRlcik7XHJcbiAgICBjb25zdCBza2V0Y2hFZGl0b3IgPSBuZXcgU2tldGNoRWRpdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNpZ25lcicpLCBzdG9yZSk7XHJcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1FZGl0b3IgPSBuZXcgU2VsZWN0ZWRJdGVtRWRpdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdG9yT3ZlcmxheVwiKSwgc3RvcmUpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gbmV3IEFwcENvbnRyb2xsZXIoc3RvcmUsIHJvdXRlciwgc2tldGNoRWRpdG9yLCBzZWxlY3RlZEl0ZW1FZGl0b3IpO1xyXG59XHJcblxyXG5QYXBlckhlbHBlcnMuc2hvdWxkTG9nSW5mbyA9IGZhbHNlO1xyXG5cclxuY29uc3QgYXBwID0gYm9vdHN0cmFwKCk7XHJcbiJdfQ==