var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DomHelpers;
(function (DomHelpers) {
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
var Fstx;
(function (Fstx) {
    var Framework;
    (function (Framework) {
        function createFileName(text, maxLength, extension) {
            var name = "";
            for (var _i = 0, _a = text.split(/\s/); _i < _a.length; _i++) {
                var word = _a[_i];
                var trim = word.replace(/\W/g, '').trim();
                if (trim.length) {
                    if (name.length && name.length + trim.length + 1 > maxLength) {
                        break;
                    }
                    if (name.length)
                        name += " ";
                    name += trim;
                }
            }
            return name + "." + extension;
        }
        Framework.createFileName = createFileName;
    })(Framework = Fstx.Framework || (Fstx.Framework = {}));
})(Fstx || (Fstx = {}));
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
})(FontHelpers || (FontHelpers = {}));
var Framework;
(function (Framework) {
    function logtap(message, stream) {
        return stream.tap(function (t) { return console.log(message, t); });
    }
    Framework.logtap = logtap;
    function newid() {
        return (new Date().getTime() + Math.random())
            .toString(36).replace('.', '');
    }
    Framework.newid = newid;
})(Framework || (Framework = {}));
var Framework;
(function (Framework) {
    var SeedRandom = (function () {
        function SeedRandom(seed) {
            if (seed === void 0) { seed = Math.random(); }
            this.seed = this.nextSeed = seed;
        }
        SeedRandom.prototype.random = function () {
            var x = Math.sin(this.nextSeed * 2 * Math.PI) * 10000;
            var result = x - Math.floor(x);
            this.nextSeed = result;
            return result;
        };
        return SeedRandom;
    }());
    Framework.SeedRandom = SeedRandom;
})(Framework || (Framework = {}));
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
        ChannelTopic.prototype.sub = function (observer) {
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
        ChannelTopic.prototype.observeData = function () {
            return this.observe().map(function (m) { return m.data; });
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
        Channel.prototype.observe = function () {
            return this.subject.asObservable();
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
var paperExt;
(function (paperExt) {
    var ViewZoom = (function () {
        function ViewZoom(project) {
            var _this = this;
            this.factor = 1.25;
            this._viewChanged = new ObservableEvent();
            this.project = project;
            $(this.project.view.element).mousewheel(function (event) {
                var mousePosition = new paper.Point(event.offsetX, event.offsetY);
                _this.changeZoomCentered(event.deltaY, mousePosition);
            });
            var didDrag = false;
            this.project.view.on(paper.EventType.mouseDrag, function (ev) {
                var view = _this.project.view;
                var hit = project.hitTest(ev.point);
                if (!_this._viewCenterStart) {
                    if (hit) {
                        // don't start dragging
                        return;
                    }
                    _this._viewCenterStart = view.center;
                    // Have to use native mouse offset, because ev.delta 
                    //  changes as the view is scrolled.
                    _this._mouseNativeStart = new paper.Point(ev.event.offsetX, ev.event.offsetY);
                    view.emit(paperExt.EventType.mouseDragStart, ev);
                }
                else {
                    var nativeDelta = new paper.Point(ev.event.offsetX - _this._mouseNativeStart.x, ev.event.offsetY - _this._mouseNativeStart.y);
                    // Move into view coordinates to subract delta,
                    //  then back into project coords.
                    view.center = view.viewToProject(view.projectToView(_this._viewCenterStart)
                        .subtract(nativeDelta));
                    didDrag = true;
                }
            });
            this.project.view.on(paper.EventType.mouseUp, function (ev) {
                var view = _this.project.view;
                if (_this._mouseNativeStart) {
                    _this._mouseNativeStart = null;
                    _this._viewCenterStart = null;
                    view.emit(paperExt.EventType.mouseDragEnd, ev);
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
            if (rect.isEmpty() || rect.width === 0 || rect.height === 0) {
                console.warn("skipping zoom to", rect);
                return;
            }
            var view = this.project.view;
            view.center = rect.center;
            var zoomLevel = Math.min(view.viewSize.height / rect.height, view.viewSize.width / rect.width);
            view.zoom = zoomLevel;
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
    paperExt.ViewZoom = ViewZoom;
})(paperExt || (paperExt = {}));
var paperExt;
(function (paperExt) {
    /**
     * Use of these events requires first calling extendMouseEvents
     *   on the item.
     */
    paperExt.EventType = {
        mouseDragStart: "mouseDragStart",
        mouseDragEnd: "mouseDragEnd"
    };
    function extendMouseEvents(item) {
        var dragging = false;
        item.on(paper.EventType.mouseDrag, function (ev) {
            if (!dragging) {
                dragging = true;
                item.emit(paperExt.EventType.mouseDragStart, ev);
            }
        });
        item.on(paper.EventType.mouseUp, function (ev) {
            if (dragging) {
                dragging = false;
                item.emit(paperExt.EventType.mouseDragEnd, ev);
                // prevent click
                ev.stop();
            }
        });
    }
    paperExt.extendMouseEvents = extendMouseEvents;
})(paperExt || (paperExt = {}));
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
var Component = (function () {
    function Component() {
    }
    return Component;
}());
var VDomHelpers;
(function (VDomHelpers) {
    function renderAsChild(container, vnode) {
        var child = document.createElement("div");
        var patched = patch(child, vnode);
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
        var _this = this;
        var id = container.id;
        var current = container;
        var sink = new Rx.Subject();
        dom$.subscribe(function (dom) {
            if (!dom)
                return;
            _this.removeEmptyNodes(dom);
            var patched;
            try {
                patched = patch(current, dom);
            }
            catch (err) {
                console.error("error patching dom", {
                    current: current,
                    dom: dom,
                    err: err
                });
                return;
            }
            if (id && !patched.elm.id) {
                // retain ID
                patched.elm.id = id;
            }
            current = patched;
            sink.onNext(current);
        });
        return sink;
    };
    /**
     * Recursively remove empty children from tree.
     */
    ReactiveDom.removeEmptyNodes = function (node) {
        if (!node.children || !node.children.length) {
            return;
        }
        var notEmpty = node.children.filter(function (c) { return !!c; });
        if (node.children.length != notEmpty.length) {
            console.warn("removed empty children from", node.children);
            node.children = notEmpty;
        }
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            this.removeEmptyNodes(child);
        }
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
var App;
(function (App) {
    var AppCookies = (function () {
        function AppCookies() {
        }
        Object.defineProperty(AppCookies.prototype, "lastSavedSketchId", {
            get: function () {
                return Cookies.get(AppCookies.LAST_SAVED_SKETCH_ID_KEY);
            },
            set: function (value) {
                Cookies.set(AppCookies.LAST_SAVED_SKETCH_ID_KEY, value, { expires: AppCookies.YEAR });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppCookies.prototype, "browserId", {
            get: function () {
                return Cookies.get(AppCookies.BROWSER_ID_KEY);
            },
            set: function (value) {
                Cookies.set(AppCookies.BROWSER_ID_KEY, value, { expires: AppCookies.YEAR });
            },
            enumerable: true,
            configurable: true
        });
        AppCookies.YEAR = 365;
        AppCookies.BROWSER_ID_KEY = "browserId";
        AppCookies.LAST_SAVED_SKETCH_ID_KEY = "lastSavedSketchId";
        return AppCookies;
    }());
    App.AppCookies = AppCookies;
})(App || (App = {}));
var App;
(function (App) {
    var AppModule = (function () {
        function AppModule() {
            PaperHelpers.shouldLogInfo = false;
            this.store = new App.Store();
            this.editorModule = new SketchEditor.SketchEditorModule(this.store);
        }
        AppModule.prototype.start = function () {
            this.editorModule.start();
        };
        return AppModule;
    }());
    App.AppModule = AppModule;
})(App || (App = {}));
var App;
(function (App) {
    var AppRouter = (function (_super) {
        __extends(AppRouter, _super);
        function AppRouter() {
            _super.call(this, [
                new RouteNode("home", "/"),
                new RouteNode("sketch", "/sketch/:sketchId"),
            ], {
                useHash: false,
                defaultRoute: "home"
            });
            //this.usePlugin(loggerPlugin())
            this.usePlugin(listenersPlugin.default())
                .usePlugin(historyPlugin.default());
        }
        AppRouter.prototype.toSketchEditor = function (sketchId) {
            this.navigate("sketch", { sketchId: sketchId });
        };
        Object.defineProperty(AppRouter.prototype, "state", {
            get: function () {
                // could do route validation somewhere
                return this.getState();
            },
            enumerable: true,
            configurable: true
        });
        return AppRouter;
    }(Router5));
    App.AppRouter = AppRouter;
})(App || (App = {}));
var App;
(function (App) {
    var Store = (function () {
        function Store() {
            this.router = new App.AppRouter();
            this.actions = new Actions();
            this.events = new Events();
            this.cookies = new App.AppCookies();
            this.startRouter();
            this.initState();
            this.initActionHandlers();
        }
        Store.prototype.initState = function () {
            this.state = new AppState(this.cookies, this.router);
        };
        Store.prototype.initActionHandlers = function () {
            var _this = this;
            this.actions.editorLoadedSketch.sub(function (sketchId) {
                _this.router.navigate("sketch", { sketchId: sketchId });
            });
            this.actions.editorSavedSketch.sub(function (id) {
                _this.cookies.lastSavedSketchId = id;
            });
        };
        Store.prototype.startRouter = function () {
            var _this = this;
            this.router.start(function (err, state) {
                _this.events.routeChanged.dispatch(state);
                if (err) {
                    console.warn("router error", err);
                    _this.router.navigate("home");
                }
            });
        };
        return Store;
    }());
    App.Store = Store;
    var AppState = (function () {
        function AppState(cookies, router) {
            this.cookies = cookies;
            this.router = router;
            var browserId = this.cookies.browserId || Framework.newid();
            // init or refresh cookie
            this.cookies.browserId = browserId;
        }
        Object.defineProperty(AppState.prototype, "lastSavedSketchId", {
            get: function () {
                return this.cookies.lastSavedSketchId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppState.prototype, "browserId", {
            get: function () {
                return this.cookies.browserId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppState.prototype, "route", {
            get: function () {
                return this.router.state;
            },
            enumerable: true,
            configurable: true
        });
        return AppState;
    }());
    App.AppState = AppState;
    var Actions = (function (_super) {
        __extends(Actions, _super);
        function Actions() {
            _super.apply(this, arguments);
            this.editorLoadedSketch = this.topic("editorLoadedSketch");
            this.editorSavedSketch = this.topic("editorSavedSketch");
        }
        return Actions;
    }(TypedChannel.Channel));
    App.Actions = Actions;
    var Events = (function (_super) {
        __extends(Events, _super);
        function Events() {
            _super.apply(this, arguments);
            this.routeChanged = this.topic("routeChanged");
        }
        return Events;
    }(TypedChannel.Channel));
    App.Events = Events;
})(App || (App = {}));
var Demo;
(function (Demo) {
    var DemoModule = (function () {
        function DemoModule(canvas) {
            paper.setup(canvas);
        }
        DemoModule.prototype.start = function () {
            var view = paper.view;
            var parsedFonts = new FontShape.ParsedFonts(function () { });
            parsedFonts.get("fonts/Roboto-500.ttf").then(function (parsed) {
                var pathData = parsed.font.getPath("SNAP", 0, 0, 128).toPathData();
                var content = new paper.CompoundPath(pathData);
                content.position = content.position.add(50);
                content.fillColor = "lightgray";
                var region = paper.Path.Ellipse(new paper.Rectangle(new paper.Point(0, 0), new paper.Size(600, 300)));
                region.rotate(30);
                region.bounds.center = view.center;
                region.strokeColor = "lightgray";
                region.strokeWidth = 3;
                var snapPath = new FontShape.SnapPath(region, content);
                snapPath.corners = [0, 0.4, 0.45, 0.95];
                view.onFrame = function () {
                    snapPath.slide(0.001);
                    snapPath.updatePath();
                };
                view.draw();
            });
        };
        return DemoModule;
    }());
    Demo.DemoModule = DemoModule;
})(Demo || (Demo = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var Builder = (function () {
        function Builder(container, store) {
            var context = {
                get fontCatalog() { return store.fontCatalog; },
                renderDesign: function (design, callback) {
                    store.render({
                        design: design,
                        callback: callback
                    });
                },
                createFontChooser: function () {
                    return new SketchBuilder.TemplateFontChooser(store);
                }
            };
            // async observe
            store.template$.observeOn(Rx.Scheduler.default).subscribe(function (t) {
                var currentContent = store.design.content;
                var newTemplateState = t.createNew(context);
                if (currentContent && currentContent.text && currentContent.text.length) {
                    newTemplateState.design.content = currentContent;
                }
                store.setTemplateState(newTemplateState);
            });
            var dom$ = store.templateState$
                .map(function (ts) {
                var controls;
                try {
                    controls = store.template.createUI(context);
                }
                catch (err) {
                    console.error("Error calling " + store.template.name + ".createUI", err);
                }
                for (var _i = 0, controls_1 = controls; _i < controls_1.length; _i++) {
                    var c = controls_1[_i];
                    c.value$.subscribe(function (d) { return store.updateTemplateState(d); });
                }
                var nodes = controls.map(function (c) { return c.createNode(ts); });
                var vnode = h("div#templateControls", {}, nodes);
                return vnode;
            });
            ReactiveDom.renderStream(dom$, container);
        }
        Builder.defaultFontUrl = "fonts/Roboto-500.ttf";
        return Builder;
    }());
    SketchBuilder.Builder = Builder;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var Module = (function () {
        function Module(builderContainer, previewCanvas, renderCanvas, belowCanvas) {
            this.store = new SketchBuilder.Store();
            this.builder = new SketchBuilder.Builder(builderContainer, this.store);
            new SketchBuilder.PreviewCanvas(previewCanvas, this.store);
            this.store.templateState$.subscribe(function (ts) { return console.log("templateState", ts); });
            this.store.template$.subscribe(function (t) { return console.log("template", t); });
            new SketchBuilder.ShareOptionsUI(belowCanvas, this.store);
        }
        Module.prototype.start = function () {
            var _this = this;
            this.store.init().then(function (s) {
                _this.store.setTemplate("Dickens");
                _this.store.updateTemplateState({ design: {
                        content: {
                            text: "The rain in Spain falls mainly in the plain"
                        }
                    }
                });
            });
        };
        return Module;
    }());
    SketchBuilder.Module = Module;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var PreviewCanvas = (function () {
        function PreviewCanvas(canvas, store) {
            var _this = this;
            this.rendering = false;
            this.store = store;
            paper.setup(canvas);
            this.project = paper.project;
            this.workspace = new paper.Group();
            FontShape.VerticalBoundsStretchPath.pointsPerPath = 400;
            this.context = {
                getFont: function (specifier) {
                    var url;
                    if (!specifier || !specifier.family) {
                        url = SketchBuilder.Builder.defaultFontUrl;
                    }
                    else {
                        url = store.fontCatalog.getUrl(specifier.family, specifier.variant)
                            || SketchBuilder.Builder.defaultFontUrl;
                    }
                    return store.parsedFonts.get(url)
                        .then(function (result) { return result.font; });
                }
            };
            store.templateState$.subscribe(function (ts) {
                // only process one request at a time
                if (_this.rendering) {
                    // always process the last received
                    _this.lastReceived = ts.design;
                    return;
                }
                _this.render(ts.design);
            });
            store.events.downloadPNGRequested.sub(function () { return _this.downloadPNG(); });
        }
        PreviewCanvas.prototype.downloadPNG = function () {
            if (!this.store.design.content
                || !this.store.design.content.text
                || !this.store.design.content.text.length) {
                return;
            }
            // Half of max DPI produces approx 4200x4200.
            var dpi = 0.5 * PaperHelpers.getMaxExportDpi(this.workspace.bounds.size);
            var raster = this.workspace.rasterize(dpi, false);
            var data = raster.toDataURL();
            var fileName = Fstx.Framework.createFileName(this.store.design.content.text, 40, "png");
            var blob = DomHelpers.dataURLToBlob(data);
            saveAs(blob, fileName);
        };
        PreviewCanvas.prototype.renderLastReceived = function () {
            if (this.lastReceived) {
                var rendering = this.lastReceived;
                this.lastReceived = null;
                this.render(rendering);
            }
        };
        PreviewCanvas.prototype.render = function (design) {
            var _this = this;
            if (this.rendering) {
                throw new Error("render is in progress");
            }
            this.rendering = true;
            paper.project.activeLayer.removeChildren();
            this.workspace = new paper.Group();
            return this.store.template.build(design, this.context).then(function (item) {
                try {
                    if (!item) {
                        console.log("no render result from", design);
                        return;
                    }
                    item.fitBounds(_this.project.view.bounds);
                    item.bounds.point = _this.project.view.bounds.topLeft;
                    _this.workspace.addChild(item);
                }
                finally {
                    _this.rendering = false;
                }
                // handle any received while rendering 
                _this.renderLastReceived();
            }, function (err) {
                console.error("Error rendering design", err, design);
                _this.rendering = false;
            });
        };
        return PreviewCanvas;
    }());
    SketchBuilder.PreviewCanvas = PreviewCanvas;
})(SketchBuilder || (SketchBuilder = {}));
// namespace SketchBuilder {
//     export class RenderCanvas {
//         canvas: HTMLCanvasElement;
//         store: Store;
//         builtDesign: paper.Item;
//         constructor(canvas: HTMLCanvasElement, store: Store) {
//             this.store = store;
//             paper.setup(canvas);
//             const context = {
//                 getFont: specifier => {
//                     let url: string;
//                     if (!specifier || !specifier.family) {
//                         url = Builder.defaultFontUrl;
//                     } else {
//                         url = store.fontCatalog.getUrl(specifier.family, specifier.variant)
//                             || Builder.defaultFontUrl;
//                     }
//                     return store.parsedFonts.get(url)
//                         .then(result => result.font);
//                 }
//             };
//             const controlled = store.render$.controlled();
//             controlled.subscribe(request => {
//                 let design = <Design>_.clone(this.store.design);
//                 design = _.merge(design, request.design);
//                 paper.project.activeLayer.removeChildren();
//                 this.store.template.build(design, context).then(item => {
//                     const raster = paper.project.activeLayer.rasterize(72, false);
//                     item.remove();
//                     request.callback(raster.toDataURL());
//                     controlled.request(1);
//                 },
//                 (err) => {
//                     console.warn("error on template.build", err);
//                     controlled.request(1);
//                 });
//             });
//             controlled.request(1);
//         }
//     }
// } 
var SketchBuilder;
(function (SketchBuilder) {
    var ShareOptionsUI = (function () {
        function ShareOptionsUI(container, store) {
            var _this = this;
            this.store = store;
            var state = Rx.Observable.just(null);
            ReactiveDom.renderStream(state.map(function () { return _this.createDom(); }), container);
        }
        ShareOptionsUI.prototype.createDom = function () {
            var _this = this;
            return h("button.btn.btn-primary", {
                attrs: {
                    type: "button"
                },
                on: {
                    click: function () { return _this.store.downloadPNG(); }
                }
            }, ["Download"]);
        };
        return ShareOptionsUI;
    }());
    SketchBuilder.ShareOptionsUI = ShareOptionsUI;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var Store = (function () {
        function Store() {
            this._template$ = new Rx.Subject();
            this._templateState$ = new Rx.Subject();
            this._render$ = new Rx.Subject();
            this._eventsChannel = new TypedChannel.Channel();
            this.events = {
                downloadPNGRequested: this._eventsChannel.topic("downloadPNGRequested")
            };
            this._state = {
                templateState: {
                    design: {}
                }
            };
            this._parsedFonts = new FontShape.ParsedFonts(function () { });
        }
        Object.defineProperty(Store.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "parsedFonts", {
            get: function () {
                return this._parsedFonts;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "fontCatalog", {
            get: function () {
                return this._fontCatalog;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "templateState$", {
            get: function () {
                return this._templateState$;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "template$", {
            get: function () {
                return this._template$;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "render$", {
            get: function () {
                return this._render$; //.observeOn(Rx.Scheduler.default);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "template", {
            get: function () {
                return this.state.template;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "design", {
            get: function () {
                return this.state.templateState && this.state.templateState.design;
            },
            enumerable: true,
            configurable: true
        });
        Store.prototype.init = function () {
            var _this = this;
            if (this.initialized) {
                throw new Error("Store is already initalized");
            }
            return new Promise(function (callback) {
                FontShape.FontCatalog.fromLocal("fonts/google-fonts.json")
                    .then(function (c) {
                    _this._fontCatalog = c;
                    _this.initialized = true;
                    callback(_this);
                });
            });
        };
        Store.prototype.downloadPNG = function () {
            this.events.downloadPNGRequested.dispatch();
        };
        Store.prototype.setTemplate = function (name) {
            var template;
            if (/Dickens/i.test(name)) {
                template = new SketchBuilder.Templates.Dickens();
            }
            if (!template) {
                throw new Error("Invalid template " + name);
            }
            this.state.template = template;
            this._template$.onNext(template);
        };
        Store.prototype.setDesign = function (value) {
            this.setTemplateState({ design: value });
        };
        Store.prototype.updateTemplateState = function (change) {
            _.merge(this.state.templateState, change);
            var design = this.state.templateState.design;
            if (design && design.font && design.font.family && !design.font.variant) {
                // set default variant
                design.font.variant = FontShape.FontCatalog.defaultVariant(this._fontCatalog.getRecord(design.font.family));
            }
            this._templateState$.onNext(this.state.templateState);
        };
        Store.prototype.setTemplateState = function (state) {
            this._state.templateState = state;
            this._templateState$.onNext(state);
        };
        Store.prototype.render = function (request) {
            this._render$.onNext(request);
        };
        return Store;
    }());
    SketchBuilder.Store = Store;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var ControlHelpers;
    (function (ControlHelpers) {
        function chooser(choices) {
            return h("ul.chooser", {}, choices.map(function (choice) {
                return h("li.choice", {
                    class: {
                        chosen: choice.chosen
                    },
                    on: {
                        click: function (ev) {
                            choice.callback();
                        }
                    }
                }, [choice.node]);
            }));
        }
        ControlHelpers.chooser = chooser;
    })(ControlHelpers = SketchBuilder.ControlHelpers || (SketchBuilder.ControlHelpers = {}));
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var FontChooser = (function () {
        function FontChooser(fontCatalog) {
            this._value$ = new Rx.Subject();
            this.maxFamilies = Number.MAX_VALUE;
            this.fontCatalog = fontCatalog;
            var preloadFamilies = this.fontCatalog.getCategories()
                .map(function (c) { return fontCatalog.getFamilies(c)[0]; });
            FontShape.FontCatalog.loadPreviewSubsets(preloadFamilies);
        }
        Object.defineProperty(FontChooser.prototype, "value$", {
            get: function () {
                return this._value$;
            },
            enumerable: true,
            configurable: true
        });
        FontChooser.prototype.createNode = function (value) {
            var _this = this;
            var children = [];
            children.push(h("h3", ["Font Categories"]));
            var categories = this.fontCatalog.getCategories();
            var categoryChoices = categories.map(function (category) {
                var categoryFamilies = _this.fontCatalog.getFamilies(category);
                if (_this.maxFamilies) {
                    categoryFamilies = categoryFamilies.slice(0, _this.maxFamilies);
                }
                var firstFamily = categoryFamilies[0];
                return {
                    node: h("span", {
                        style: FontHelpers.getCssStyle(firstFamily)
                    }, [category]),
                    chosen: value.category === category,
                    callback: function () {
                        FontShape.FontCatalog.loadPreviewSubsets(categoryFamilies);
                        _this._value$.onNext({ category: category, family: firstFamily });
                    }
                };
            });
            children.push(SketchBuilder.ControlHelpers.chooser(categoryChoices));
            if (value.category) {
                children.push(h("h3", {}, ["Fonts"]));
                var families = this.fontCatalog.getFamilies(value.category);
                if (this.maxFamilies) {
                    families = families.slice(0, this.maxFamilies);
                }
                var familyOptions = families.map(function (family) {
                    return {
                        node: h("span", {
                            style: FontHelpers.getCssStyle(family)
                        }, [family]),
                        chosen: value.family === family,
                        callback: function () { return _this._value$.onNext({ family: family, variant: "" }); }
                    };
                });
                children.push(SketchBuilder.ControlHelpers.chooser(familyOptions));
            }
            if (value.family) {
                var variants = this.fontCatalog.getVariants(value.family);
                if (variants.length > 1) {
                    children.push(h("h3", {}, ["Font Styles"]));
                    var variantOptions = variants.map(function (variant) {
                        return {
                            node: h("span", {
                                style: FontHelpers.getCssStyle(value.family, variant)
                            }, [variant]),
                            chosen: value.variant === variant,
                            callback: function () { return _this._value$.onNext({ variant: variant }); }
                        };
                    });
                    children.push(SketchBuilder.ControlHelpers.chooser(variantOptions));
                }
            }
            return h("div.fontChooser", {}, children);
        };
        return FontChooser;
    }());
    SketchBuilder.FontChooser = FontChooser;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var ImageChooser = (function () {
        function ImageChooser() {
            this._chosen$ = new Rx.Subject();
        }
        ImageChooser.prototype.createNode = function (options) {
            var _this = this;
            var choiceNodes = options.choices.map(function (c) {
                var img;
                var onClick = function () {
                    _this._chosen$.onNext(c);
                };
                var selector = options.chosen === c.value
                    ? "img.chosen"
                    : "img";
                if (c.loadImage) {
                    var imgElm = void 0;
                    img = h(selector, {
                        on: {
                            click: onClick
                        },
                        hook: {
                            // kick off image load
                            insert: function (vnode) { return c.loadImage(vnode.elm); }
                        },
                    }, []);
                }
                else {
                    img = h(selector, {
                        attrs: {
                            href: c.imageUrl
                        },
                        on: {
                            click: onClick
                        },
                    });
                }
                return h("li", {}, [
                    img
                ]);
            });
            return h("ul.chooser", {}, choiceNodes);
        };
        Object.defineProperty(ImageChooser.prototype, "chosen$", {
            get: function () {
                return this._chosen$;
            },
            enumerable: true,
            configurable: true
        });
        return ImageChooser;
    }());
    SketchBuilder.ImageChooser = ImageChooser;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var TemplateFontChooser = (function () {
        function TemplateFontChooser(store) {
            this._fontChooser = new SketchBuilder.FontChooser(store.fontCatalog);
            this._fontChooser.maxFamilies = 15;
        }
        TemplateFontChooser.prototype.createNode = function (value) {
            var font = value.design && value.design.font;
            return this._fontChooser.createNode({
                category: value.fontCategory,
                family: font && font.family,
                variant: font && font.variant
            });
        };
        Object.defineProperty(TemplateFontChooser.prototype, "value$", {
            get: function () {
                return this._fontChooser.value$.map(function (choice) { return {
                    fontCategory: choice.category,
                    design: {
                        font: {
                            family: choice.family,
                            variant: choice.variant
                        }
                    }
                }; });
            },
            enumerable: true,
            configurable: true
        });
        return TemplateFontChooser;
    }());
    SketchBuilder.TemplateFontChooser = TemplateFontChooser;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var TextInput = (function () {
        function TextInput() {
            this._value$ = new Rx.Subject();
        }
        TextInput.prototype.createNode = function (value, placeholder, textarea) {
            var _this = this;
            return h("textarea" ? "textarea" : "input", {
                attrs: {
                    type: textarea ? undefined : "text",
                    placeholder: placeholder
                },
                props: {
                    value: value
                },
                on: {
                    keypress: function (ev) {
                        if ((ev.which || ev.keyCode) === DomHelpers.KeyCodes.Enter) {
                            ev.preventDefault();
                            var input = ev.target;
                            input.blur();
                        }
                    },
                    change: function (ev) {
                        _this._value$.onNext(ev.target.value);
                    }
                }
            }, []);
        };
        Object.defineProperty(TextInput.prototype, "value$", {
            get: function () {
                return this._value$;
            },
            enumerable: true,
            configurable: true
        });
        return TextInput;
    }());
    SketchBuilder.TextInput = TextInput;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var Templates;
    (function (Templates) {
        var Dickens = (function () {
            function Dickens() {
                this.name = "Dickens";
                this.lineHeightVariation = 0.8;
                this.defaultFontSize = 128;
                this.marginFactor = 0.14;
                this.paletteColors = [
                    "#4b3832",
                    "#854442",
                    //"#fff4e6",
                    "#3c2f2f",
                    "#be9b7b",
                    "#1b85b8",
                    "#5a5255",
                    "#559e83",
                    "#ae5a41",
                    "#c3cb71",
                    "#0e1a40",
                    "#222f5b",
                    "#5d5d5d",
                    "#946b2d",
                    "#000000",
                    "#edc951",
                    "#eb6841",
                    "#cc2a36",
                    "#4f372d",
                    "#00a0b0",
                ];
            }
            Dickens.prototype.createNew = function (context) {
                var defaultFontRecord = context.fontCatalog.getList(1)[0];
                return {
                    design: {
                        shape: "narrow",
                        font: {
                            family: defaultFontRecord.family
                        },
                        seed: Math.random()
                    },
                    fontCategory: defaultFontRecord.category
                };
            };
            Dickens.prototype.createUI = function (context) {
                return [
                    this.createTextEntry(),
                    this.createShapeChooser(context),
                    this.createVariationControl(),
                    context.createFontChooser(),
                    this.createPaletteChooser()
                ];
            };
            Dickens.prototype.build = function (design, context) {
                var _this = this;
                if (!design.content || !design.content.text) {
                    return Promise.resolve(null);
                }
                return context.getFont(design.font).then(function (font) {
                    var words = design.content.text.toLocaleUpperCase().split(/\s/);
                    var seedRandom = new Framework.SeedRandom(design.seed == null ? Math.random() : design.seed);
                    var targetLength;
                    switch (design.shape) {
                        case "balanced":
                            targetLength = 2 * Math.sqrt(_.sum(words.map(function (w) { return w.length + 1; })));
                            break;
                        case "wide":
                            var numLines = 3;
                            targetLength = _.sum(words.map(function (w) { return w.length + 1; })) / numLines;
                            break;
                        default:
                            targetLength = _.max(words.map(function (w) { return w.length; }));
                            break;
                    }
                    targetLength *= (1 + seedRandom.random() * 0.5);
                    var lines = _this.balanceLines(words, targetLength);
                    var textColor = design.palette && design.palette.color || "black";
                    var backgroundColor = "white";
                    if (design.palette && design.palette.invert) {
                        _a = [backgroundColor, textColor], textColor = _a[0], backgroundColor = _a[1];
                    }
                    var box = new paper.Group();
                    var createTextBlock = function (s, size) {
                        if (size === void 0) { size = _this.defaultFontSize; }
                        var pathData = font.getPath(s, 0, 0, size).toPathData();
                        return new paper.CompoundPath(pathData);
                    };
                    var layoutItems = lines.map(function (line) {
                        return {
                            block: createTextBlock(line),
                            line: line
                        };
                    });
                    var maxWidth = _.max(layoutItems.map(function (b) { return b.block.bounds.width; }));
                    var arrangePathPoints = Math.min(4, Math.round(maxWidth / 2));
                    var lineHeight = layoutItems[0].block.bounds.height;
                    var upper = new paper.Path([
                        new paper.Point(0, 0),
                        new paper.Point(maxWidth, 0)
                    ]);
                    var lower;
                    var remaining = layoutItems.length;
                    for (var _i = 0, layoutItems_1 = layoutItems; _i < layoutItems_1.length; _i++) {
                        var layoutItem = layoutItems_1[_i];
                        if (--remaining <= 0) {
                            var mid = upper.bounds.center;
                            // last lower line is level
                            lower = new paper.Path([
                                new paper.Point(0, mid.y + lineHeight),
                                new paper.Point(maxWidth, mid.y + lineHeight)
                            ]);
                        }
                        else {
                            lower = _this.randomLowerPathFor(upper, lineHeight, arrangePathPoints, seedRandom);
                        }
                        var stretch = new FontShape.VerticalBoundsStretchPath(layoutItem.block, { upper: upper, lower: lower });
                        stretch.fillColor = textColor;
                        box.addChild(stretch);
                        upper = lower;
                        lower = null;
                    }
                    if (design.content.source) {
                        var sourceBlock = createTextBlock(design.content.source, _this.defaultFontSize * 0.33);
                        sourceBlock.fillColor = textColor;
                        sourceBlock.translate(upper.bounds.bottomLeft.add(new paper.Point(maxWidth - sourceBlock.bounds.width, // right-align
                        sourceBlock.bounds.height * 1.1 // shift height plus top margin
                        )));
                        if (sourceBlock.bounds.left < 0) {
                            // adjust for long source line
                            sourceBlock.bounds.left = 0;
                        }
                        box.addChild(sourceBlock);
                    }
                    var bounds = box.bounds.clone();
                    bounds.size = bounds.size.multiply(1 + _this.marginFactor);
                    bounds.center = box.bounds.center;
                    var background = paper.Shape.Rectangle(bounds);
                    background.fillColor = backgroundColor;
                    box.insertChild(0, background);
                    return box;
                    var _a;
                });
            };
            Dickens.prototype.randomLowerPathFor = function (upper, avgHeight, numPoints, seedRandom) {
                var points = [];
                var upperCenter = upper.bounds.center;
                var x = 0;
                for (var i = 0; i < numPoints; i++) {
                    var y = upperCenter.y + (seedRandom.random() - 0.5) * this.lineHeightVariation * avgHeight;
                    points.push(new paper.Point(x, y));
                    x += upper.bounds.width / (numPoints - 1);
                }
                var path = new paper.Path(points);
                path.smooth();
                path.bounds.center = upper.bounds.center.add(new paper.Point(0, avgHeight));
                return path;
            };
            Dickens.prototype.balanceLines = function (words, targetLength) {
                var lines = [];
                var calcScore = function (text) {
                    return Math.pow(Math.abs(targetLength - text.length), 2);
                };
                var currentLine = null;
                var currentScore = 10000;
                while (words.length) {
                    var word = words.shift();
                    var newLine = currentLine + " " + word;
                    var newScore = calcScore(newLine);
                    if (currentLine && newScore <= currentScore) {
                        // append
                        currentLine += " " + word;
                        currentScore = newScore;
                    }
                    else {
                        // new line
                        if (currentLine) {
                            lines.push(currentLine);
                        }
                        currentLine = word;
                        currentScore = calcScore(currentLine);
                    }
                }
                lines.push(currentLine);
                return lines;
            };
            Dickens.prototype.createTextEntry = function () {
                var mainTextInput = new SketchBuilder.TextInput();
                var sourceTextInput = new SketchBuilder.TextInput();
                return {
                    createNode: function (value) {
                        return h("div", [
                            h("h3", {}, ["Message"]),
                            mainTextInput.createNode(value && value.design.content && value.design.content.text, "What do you want to say?", true),
                            sourceTextInput.createNode(value && value.design.content && value.design.content.source, "Source (author, passage, etc)", true)
                        ]);
                    },
                    value$: Rx.Observable.merge(mainTextInput.value$.map(function (t) {
                        return { design: { content: { text: t } } };
                    }), sourceTextInput.value$.map(function (t) {
                        return { design: { content: { source: t } } };
                    }))
                };
            };
            Dickens.prototype.createShapeChooser = function (context) {
                var value$ = new Rx.Subject();
                return {
                    createNode: function (ts) {
                        var shapes = ["narrow"];
                        // balanced only available for >= N words
                        if (ts.design.content && ts.design.content.text && ts.design.content.text.split(/\s/).length >= 7) {
                            shapes.push("balanced");
                        }
                        shapes.push("wide");
                        var choices = shapes.map(function (shape) { return {
                            node: h("span", {}, [shape]),
                            chosen: ts.design.shape === shape,
                            callback: function () {
                                value$.onNext({ design: { shape: shape } });
                            }
                        }; });
                        var node = h("div", [
                            h("h3", {}, ["Shape"]),
                            SketchBuilder.ControlHelpers.chooser(choices)
                        ]);
                        return node;
                    },
                    value$: value$.asObservable()
                };
            };
            Dickens.prototype.createVariationControl = function () {
                var value$ = new Rx.Subject();
                return {
                    createNode: function (ts) {
                        var button = h("button.btn", {
                            attrs: {
                                type: "button"
                            },
                            on: {
                                click: function () { return value$.onNext({ design: { seed: Math.random() } }); }
                            }
                        }, ["Next"]);
                        var node = h("div", [
                            h("h3", {}, ["Variation"]),
                            button
                        ]);
                        return node;
                    },
                    value$: value$.asObservable()
                };
            };
            Dickens.prototype.createPaletteChooser = function () {
                var parsedColors = this.paletteColors.map(function (c) { return new paper.Color(c); });
                var colors = _.sortBy(parsedColors, function (c) { return c.hue; })
                    .map(function (c) { return c.toCSS(true); });
                var value$ = new Rx.Subject();
                return {
                    createNode: function (ts) {
                        var palette = ts.design.palette;
                        var choices = colors.map(function (color) {
                            return {
                                node: h("div.paletteTile", {
                                    style: {
                                        backgroundColor: color
                                    }
                                }),
                                chosen: palette && palette.color === color,
                                callback: function () {
                                    value$.onNext({ design: { palette: { color: color } } });
                                }
                            };
                        });
                        var invertNode = h("div", [
                            h("label", [
                                h("input", {
                                    attrs: {
                                        type: "checkbox",
                                        checked: palette && palette.invert
                                    },
                                    on: {
                                        change: function (ev) { return value$.onNext({ design: { palette: { invert: ev.target.checked } } }); }
                                    }
                                }),
                                "Invert color"
                            ])
                        ]);
                        var node = h("div.colorChooser", [
                            h("h3", {}, ["Color"]),
                            SketchBuilder.ControlHelpers.chooser(choices),
                            invertNode
                        ]);
                        return node;
                    },
                    value$: value$.asObservable()
                };
            };
            return Dickens;
        }());
        Templates.Dickens = Dickens;
    })(Templates = SketchBuilder.Templates || (SketchBuilder.Templates = {}));
})(SketchBuilder || (SketchBuilder = {}));
var SketchEditor;
(function (SketchEditor) {
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
    SketchEditor.DocumentKeyHandler = DocumentKeyHandler;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var SketchEditorModule = (function () {
        function SketchEditorModule(appStore) {
            this.appStore = appStore;
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
            this.store = new SketchEditor.Store(appStore);
            var bar = new SketchEditor.EditorBar(document.getElementById('designer'), this.store);
            var selectedItemEditor = new SketchEditor.SelectedItemEditor(document.getElementById("editorOverlay"), this.store);
            var helpDialog = new SketchEditor.HelpDialog(document.getElementById("help-dialog"), this.store);
            var operationPanel = new SketchEditor.OperationPanel(document.getElementById("operationPanel"), this.store);
            this.store.events.subscribe(function (m) { return console.log("event", m.type, m.data); });
            this.store.actions.subscribe(function (m) { return console.log("action", m.type, m.data); });
        }
        SketchEditorModule.prototype.start = function () {
            var _this = this;
            this.store.events.editor.fontLoaded.observe().first().subscribe(function (m) {
                _this.workspaceController = new SketchEditor.WorkspaceController(_this.store, m.data);
                _this.store.actions.editor.initWorkspace.dispatch();
                _this.store.events.editor.workspaceInitialized.sub(function () {
                    $(window).on("beforeunload", function () {
                        if (_this.store.state.sketchIsDirty) {
                            return "Your latest changes are not saved yet.";
                        }
                    });
                });
            });
        };
        SketchEditorModule.prototype.openSketch = function (id) {
            this.store.actions.sketch.open.dispatch(id);
        };
        return SketchEditorModule;
    }());
    SketchEditor.SketchEditorModule = SketchEditorModule;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var SketchHelpers = (function () {
        function SketchHelpers() {
        }
        SketchHelpers.colorsInUse = function (sketch) {
            var colors = [sketch.backgroundColor];
            for (var _i = 0, _a = sketch.textBlocks; _i < _a.length; _i++) {
                var block = _a[_i];
                colors.push(block.backgroundColor);
                colors.push(block.textColor);
            }
            colors = _.uniq(colors.filter(function (c) { return c != null; }));
            colors.sort();
            return colors;
        };
        SketchHelpers.getSketchFileName = function (sketch, length, extension) {
            var name = "";
            outer: for (var _i = 0, _a = sketch.textBlocks; _i < _a.length; _i++) {
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
        return SketchHelpers;
    }());
    SketchEditor.SketchHelpers = SketchHelpers;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
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
        function Store(appStore) {
            this.fontListLimit = 250;
            this.state = {};
            this.resources = {};
            this.actions = new SketchEditor.Actions();
            this.events = new SketchEditor.Events();
            this._operation$ = new Rx.Subject();
            this._transparency$ = new Rx.Subject();
            this.appStore = appStore;
            this.setupState();
            this.setupSubscriptions();
            this.loadResources();
        }
        Store.prototype.setupState = function () {
            this.state.browserId = Cookies.get(Store.BROWSER_ID_KEY);
            if (!this.state.browserId) {
                this.state.browserId = Framework.newid();
                Cookies.set(Store.BROWSER_ID_KEY, this.state.browserId, { expires: 2 * 365 });
            }
        };
        Store.prototype.setupSubscriptions = function () {
            var _this = this;
            var actions = this.actions, events = this.events;
            // ----- App -----
            this.appStore.events.routeChanged.sub(function (route) {
                var routeSketchId = route.params.sketchId;
                if (route.name === "sketch" && routeSketchId !== _this.state.sketch._id) {
                    _this.openSketch(routeSketchId);
                }
            });
            // ----- Editor -----
            actions.editor.initWorkspace.observe()
                .pausableBuffered(events.editor.resourcesReady.observe().map(function (m) { return m.data; }))
                .subscribe(function (m) {
                _this.setSelection(null, true);
                _this.setEditingItem(null, true);
                var sketchId = _this.appStore.state.route.params.sketchId
                    || _this.appStore.state.lastSavedSketchId;
                var promise;
                if (sketchId) {
                    promise = _this.openSketch(sketchId);
                }
                else {
                    promise = _this.loadGreetingSketch();
                }
                promise.then(function () { return events.editor.workspaceInitialized.dispatch(); });
                // on any action, update save delay timer
                _this.actions.observe().debounce(Store.SERVER_SAVE_DELAY_MS)
                    .subscribe(function () {
                    var sketch = _this.state.sketch;
                    if (!_this.state.loadingSketch
                        && _this.state.sketchIsDirty
                        && sketch._id
                        && sketch.textBlocks.length) {
                        _this.saveSketch(sketch);
                    }
                });
            });
            actions.editor.loadFont.subscribe(function (m) {
                return _this.resources.parsedFonts.get(m.data);
            });
            actions.editor.zoomToFit.forward(events.editor.zoomToFitRequested);
            actions.editor.exportPNG.subscribe(function (m) {
                _this.setSelection(null);
                _this.setEditingItem(null);
                events.editor.exportPNGRequested.dispatch(m.data);
            });
            actions.editor.exportSVG.subscribe(function (m) {
                _this.setSelection(null);
                _this.setEditingItem(null);
                events.editor.exportSVGRequested.dispatch(m.data);
            });
            actions.editor.viewChanged.subscribe(function (m) {
                events.editor.viewChanged.dispatch(m.data);
            });
            actions.editor.updateSnapshot.sub(function (_a) {
                var sketchId = _a.sketchId, pngDataUrl = _a.pngDataUrl;
                if (sketchId === _this.state.sketch._id) {
                    var fileName = sketchId + ".png";
                    var blob = DomHelpers.dataURLToBlob(pngDataUrl);
                    SketchEditor.S3Access.putFile(fileName, "image/png", blob);
                }
            });
            actions.editor.toggleHelp.subscribe(function () {
                _this.state.showHelp = !_this.state.showHelp;
                events.editor.showHelpChanged.dispatch(_this.state.showHelp);
            });
            actions.editor.openSample.sub(function () { return _this.loadGreetingSketch(); });
            // ----- Sketch -----
            actions.sketch.open.sub(function (id) {
                _this.openSketch(id);
            });
            actions.sketch.create.sub(function (attr) {
                _this.newSketch(attr);
            });
            actions.sketch.clear.sub(function () {
                _this.clearSketch();
            });
            actions.sketch.clone.subscribe(function () {
                var clone = _.clone(_this.state.sketch);
                clone._id = Framework.newid();
                clone.browserId = _this.state.browserId;
                clone.savedAt = null;
                _this.loadSketch(clone);
                _this.state.sketchIsDirty = false;
                _this.events.sketch.cloned.dispatch(clone);
                _this.pulseUserMessage("Duplicated sketch. Address of this page has been updated.");
            });
            actions.sketch.attrUpdate.subscribe(function (ev) {
                _this.merge(_this.state.sketch, ev.data);
                events.sketch.attrChanged.dispatch(_this.state.sketch);
                _this.changedSketchContent();
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
                var block = { _id: Framework.newid() };
                _this.merge(block, patch);
                block.textColor = _this.state.sketch.defaultTextBlockAttr.textColor;
                block.backgroundColor = _this.state.sketch.defaultTextBlockAttr.backgroundColor;
                if (!block.fontFamily) {
                    block.fontFamily = _this.state.sketch.defaultTextBlockAttr.fontFamily;
                    block.fontVariant = _this.state.sketch.defaultTextBlockAttr.fontVariant;
                }
                _this.state.sketch.textBlocks.push(block);
                events.textblock.added.dispatch(block);
                _this.changedSketchContent();
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
                    _this.merge(block, patch_1);
                    if (block.fontFamily && !block.fontVariant) {
                        var record = _this.resources.fontCatalog.getRecord(block.fontFamily);
                        if (record) {
                            // regular or else first variant
                            block.fontVariant = FontShape.FontCatalog.defaultVariant(record);
                        }
                    }
                    _this.state.sketch.defaultTextBlockAttr = {
                        textColor: block.textColor,
                        backgroundColor: block.backgroundColor,
                        fontFamily: block.fontFamily,
                        fontVariant: block.fontVariant
                    };
                    events.textblock.attrChanged.dispatch(block);
                    _this.changedSketchContent();
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
                    _this.changedSketchContent();
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
                    _this.changedSketchContent();
                }
            });
        };
        Object.defineProperty(Store.prototype, "operation$", {
            get: function () {
                return this._operation$.asObservable();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "transparency$", {
            get: function () {
                return this._transparency$.asObservable();
            },
            enumerable: true,
            configurable: true
        });
        Store.prototype.showOperation = function (operation) {
            var _this = this;
            this.state.operation = operation;
            operation.onClose = function () {
                if (_this.state.operation === operation) {
                    _this.hideOperation();
                }
            };
            this._operation$.onNext(operation);
        };
        Store.prototype.hideOperation = function () {
            this.state.operation = null;
            this._operation$.onNext(null);
        };
        Store.prototype.imageUploaded = function (src) {
            this.state.uploadedImage = src;
            this.events.sketch.imageUploaded.dispatch(src);
            if (!this.state.transparency) {
                this.setTransparency(true);
            }
        };
        Store.prototype.removeUploadedImage = function () {
            this.state.uploadedImage = null;
            this.events.sketch.imageUploaded.dispatch(null);
            if (this.state.transparency) {
                this.setTransparency(false);
            }
        };
        Store.prototype.setTransparency = function (value) {
            this.state.transparency = value;
            this._transparency$.onNext(this.state.transparency);
        };
        Store.prototype.openSketch = function (id) {
            var _this = this;
            if (!id || !id.length) {
                return;
            }
            return SketchEditor.S3Access.getJson(id + ".json")
                .then(function (sketch) {
                _this.loadSketch(sketch);
                console.log("Retrieved sketch", sketch._id);
                if (sketch.browserId === _this.state.browserId) {
                    console.log('Sketch was created in this browser');
                }
                else {
                    console.log('Sketch was created in a different browser');
                }
                return sketch;
            }, function (err) {
                console.warn("error getting remote sketch", err);
                _this.loadGreetingSketch();
            });
        };
        Store.prototype.loadSketch = function (sketch) {
            this.state.loadingSketch = true;
            this.state.sketch = sketch;
            this.state.sketchIsDirty = false;
            this.setDefaultUserMessage();
            this.events.sketch.loaded.dispatch(this.state.sketch);
            this.appStore.actions.editorLoadedSketch.dispatch(sketch._id);
            for (var _i = 0, _a = this.state.sketch.textBlocks; _i < _a.length; _i++) {
                var tb = _a[_i];
                this.events.textblock.loaded.dispatch(tb);
                this.loadTextBlockFont(tb);
            }
            this.events.editor.zoomToFitRequested.dispatch();
            this.state.loadingSketch = false;
        };
        Store.prototype.loadGreetingSketch = function () {
            var _this = this;
            return SketchEditor.S3Access.getJson(Store.GREETING_SKETCH_ID + ".json")
                .done(function (sketch) {
                sketch._id = Framework.newid();
                sketch.browserId = _this.state.browserId;
                _this.loadSketch(sketch);
            });
        };
        Store.prototype.clearSketch = function () {
            var sketch = this.defaultSketchAttr();
            sketch._id = this.state.sketch._id;
            this.loadSketch(sketch);
        };
        Store.prototype.loadResources = function () {
            var _this = this;
            this.resources.parsedFonts = new FontShape.ParsedFonts(function (parsed) {
                return _this.events.editor.fontLoaded.dispatch(parsed.font);
            });
            FontShape.FontCatalog.fromLocal("fonts/google-fonts.json")
                .then(function (catalog) {
                _this.resources.fontCatalog = catalog;
                // load fonts into browser for preview
                FontShape.FontCatalog.loadPreviewSubsets(catalog.getList(_this.fontListLimit).map(function (f) { return f.family; }));
                _this.resources.parsedFonts.get(Store.FALLBACK_FONT_URL).then(function (_a) {
                    var font = _a.font;
                    return _this.resources.fallbackFont = font;
                });
                _this.events.editor.resourcesReady.dispatch(true);
            });
        };
        Store.prototype.setUserMessage = function (message) {
            if (this.state.userMessage !== message) {
                this.state.userMessage = message;
                this.events.editor.userMessageChanged.dispatch(message);
            }
        };
        Store.prototype.pulseUserMessage = function (message) {
            var _this = this;
            this.setUserMessage(message);
            setTimeout(function () { return _this.setDefaultUserMessage(); }, 4000);
        };
        Store.prototype.setDefaultUserMessage = function () {
            // if not the last saved sketch, or sketch is dirty, show "Unsaved"
            var message = (this.state.sketchIsDirty
                || !this.state.sketch.savedAt)
                ? "Unsaved"
                : "Saved";
            this.setUserMessage(message);
        };
        Store.prototype.loadTextBlockFont = function (block) {
            var _this = this;
            this.resources.parsedFonts.get(this.resources.fontCatalog.getUrl(block.fontFamily, block.fontVariant))
                .then(function (_a) {
                var font = _a.font;
                return _this.events.textblock.fontReady.dispatch({ textBlockId: block._id, font: font });
            });
        };
        Store.prototype.changedSketchContent = function () {
            this.state.sketchIsDirty = true;
            this.events.sketch.contentChanged.dispatch(this.state.sketch);
            this.setDefaultUserMessage();
        };
        Store.prototype.merge = function (dest, source) {
            _.merge(dest, source);
        };
        Store.prototype.newSketch = function (attr) {
            var sketch = this.defaultSketchAttr();
            sketch._id = Framework.newid();
            if (attr) {
                this.merge(sketch, attr);
            }
            this.loadSketch(sketch);
            return sketch;
        };
        Store.prototype.defaultSketchAttr = function () {
            return {
                browserId: this.state.browserId,
                defaultTextBlockAttr: {
                    fontFamily: "Roboto",
                    fontVariant: "regular",
                    textColor: "gray"
                },
                backgroundColor: "white",
                textBlocks: []
            };
        };
        Store.prototype.saveSketch = function (sketch) {
            var _this = this;
            var saving = _.clone(sketch);
            var now = new Date();
            saving.savedAt = now;
            this.setUserMessage("Saving");
            SketchEditor.S3Access.putFile(sketch._id + ".json", "application/json", JSON.stringify(saving))
                .then(function () {
                _this.state.sketchIsDirty = false;
                _this.state.sketch.savedAt = now;
                _this.setDefaultUserMessage();
                _this.appStore.actions.editorSavedSketch.dispatch(sketch._id);
                _this.events.editor.snapshotExpired.dispatch(sketch);
            }, function () {
                _this.setUserMessage("Unable to save");
            });
        };
        Store.prototype.setSelection = function (item, force) {
            if (force === void 0) { force = true; }
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
        Store.SKETCH_LOCAL_CACHE_KEY = "fiddlesticks.io.lastSketch";
        Store.LOCAL_CACHE_DELAY_MS = 1000;
        Store.SERVER_SAVE_DELAY_MS = 10000;
        Store.GREETING_SKETCH_ID = "im2ba92i1714i";
        return Store;
    }());
    SketchEditor.Store = Store;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
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
            window.onresize = function () { return _this.project.view.draw(); };
            var canvasSel = $(this.canvas);
            store.events.mergeTyped(store.events.sketch.loaded, store.events.sketch.attrChanged).subscribe(function (ev) {
                return canvasSel.css("background-color", ev.data.backgroundColor);
            });
            this.viewZoom = new paperExt.ViewZoom(this.project);
            this.viewZoom.setZoomRange([
                this.defaultSize.multiply(this.defaultScale * 0.1),
                this.defaultSize.multiply(0.5)]);
            this.viewZoom.viewChanged.subscribe(function (bounds) {
                store.actions.editor.viewChanged.dispatch(bounds);
            });
            var clearSelection = function (ev) {
                if (store.state.selection) {
                    store.actions.sketch.setSelection.dispatch(null);
                }
            };
            paper.view.on(paper.EventType.click, function (ev) {
                if (!_this.project.hitTest(ev.point)) {
                    clearSelection(ev);
                }
            });
            paper.view.on(paperExt.EventType.mouseDragStart, clearSelection);
            var keyHandler = new SketchEditor.DocumentKeyHandler(store);
            // ----- Designer -----
            store.events.editor.workspaceInitialized.sub(function () {
                _this.project.view.draw();
            });
            store.events.editor.zoomToFitRequested.subscribe(function () {
                _this.zoomToFit();
            });
            store.events.editor.exportSVGRequested.subscribe(function () {
                _this.downloadSVG();
            });
            store.events.editor.exportPNGRequested.sub(function () {
                _this.downloadPNG();
            });
            store.events.editor.snapshotExpired.sub(function () {
                var data = _this.getSnapshotPNG(72);
                store.actions.editor.updateSnapshot.dispatch({
                    sketchId: _this.store.state.sketch._id, pngDataUrl: data
                });
            });
            // ----- Sketch -----
            store.events.sketch.loaded.subscribe(function (ev) {
                _this._sketch = ev.data;
                _this.project.clear();
                _this.project.deselectAll();
                _this._workspace = new paper.Group();
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
            store.events.textblock.fontReady.sub(function (data) {
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
            store.events.sketch.imageUploaded.sub(function (url) {
                _this.setBackgroundImage(url);
            });
            store.transparency$.subscribe(function (value) {
                _this._workspace.opacity = value ? 0.75 : 1;
            });
        }
        WorkspaceController.prototype.zoomToFit = function () {
            var bounds = this.getViewableBounds();
            if (bounds.width > 0 && bounds.height > 0) {
                this.viewZoom.zoomTo(bounds.scale(1.2));
            }
        };
        WorkspaceController.prototype.getViewableBounds = function () {
            var bounds = this._workspace.bounds;
            if (!bounds || bounds.width === 0 || bounds.height === 0) {
                return new paper.Rectangle(new paper.Point(0, 0), this.defaultSize.multiply(0.05));
            }
            return bounds;
        };
        /**
         * @returns data URL
         */
        WorkspaceController.prototype.getSnapshotPNG = function (dpi) {
            var background = this.insertBackground();
            var raster = this._workspace.rasterize(dpi, false);
            var data = raster.toDataURL();
            background.remove();
            return data;
        };
        WorkspaceController.prototype.downloadPNG = function () {
            // Half of max DPI produces approx 4200x4200.
            var dpi = 0.5 * PaperHelpers.getMaxExportDpi(this._workspace.bounds.size);
            var data = this.getSnapshotPNG(dpi);
            var fileName = SketchEditor.SketchHelpers.getSketchFileName(this.store.state.sketch, 40, "png");
            var blob = DomHelpers.dataURLToBlob(data);
            saveAs(blob, fileName);
        };
        WorkspaceController.prototype.downloadSVG = function () {
            var background;
            if (this.store.state.sketch.backgroundColor) {
                background = this.insertBackground();
            }
            this.project.deselectAll();
            var dataUrl = "data:image/svg+xml;utf8," + encodeURIComponent(this.project.exportSVG({ asString: true }));
            var blob = DomHelpers.dataURLToBlob(dataUrl);
            var fileName = SketchEditor.SketchHelpers.getSketchFileName(this.store.state.sketch, 40, "svg");
            saveAs(blob, fileName);
            if (background) {
                background.remove();
            }
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
            this._workspace.insertChild(0, background);
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
            item = new SketchEditor.TextWarp(this.fallbackFont, textBlock.text, bounds, null, {
                fillColor: textBlock.textColor || "red",
                backgroundColor: textBlock.backgroundColor
            });
            this._workspace.addChild(item);
            paperExt.extendMouseEvents(item);
            if (!textBlock.outline && textBlock.position) {
                item.position = new paper.Point(textBlock.position);
            }
            item.on(paper.EventType.click, function (ev) {
                if (item.selected) {
                    // select next item behind
                    var otherHits = _.values(_this._textBlockItems)
                        .filter(function (i) { return i.id !== item.id && !!i.hitTest(ev.point); });
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
            item.on(paperExt.EventType.mouseDragStart, function (ev) {
                item.bringToFront();
            });
            item.on(paper.EventType.mouseDrag, function (ev) {
                item.translate(ev.delta);
            });
            item.on(paperExt.EventType.mouseDragEnd, function (ev) {
                var block = _this.getBlockArrangement(item);
                block._id = textBlock._id;
                _this.store.actions.textBlock.updateArrange.dispatch(block);
                if (!item.selected) {
                    _this.store.actions.sketch.setSelection.dispatch({ itemId: textBlock._id, itemType: "TextBlock" });
                }
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
        WorkspaceController.prototype.setBackgroundImage = function (url) {
            var _this = this;
            if (!url) {
                if (this._backgroundImage) {
                    this._backgroundImage.remove();
                }
                this._backgroundImage = null;
            }
            var raster = new paper.Raster(url);
            raster.onLoad = function () {
                raster.sendToBack();
                raster.fitBounds(_this.getViewableBounds());
                if (_this._backgroundImage) {
                    _this._backgroundImage.remove();
                }
                _this._backgroundImage = raster;
            };
        };
        WorkspaceController.TEXT_CHANGE_RENDER_THROTTLE_MS = 500;
        WorkspaceController.BLOCK_BOUNDS_CHANGE_THROTTLE_MS = 500;
        return WorkspaceController;
    }());
    SketchEditor.WorkspaceController = WorkspaceController;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var Actions = (function (_super) {
        __extends(Actions, _super);
        function Actions() {
            _super.apply(this, arguments);
            this.editor = {
                initWorkspace: this.topic("designer.initWorkspace"),
                loadFont: this.topic("designer.loadFont"),
                zoomToFit: this.topic("designer.zoomToFit"),
                exportingImage: this.topic("designer.exportImage"),
                exportPNG: this.topic("designer.exportPNG"),
                exportSVG: this.topic("designer.exportSVG"),
                viewChanged: this.topic("designer.viewChanged"),
                updateSnapshot: this.topic("designer.updateSnapshot"),
                toggleHelp: this.topic("designer.toggleHelp"),
                openSample: this.topic("designer.openSample"),
            };
            this.sketch = {
                create: this.topic("sketch.create"),
                clear: this.topic("sketch.clear"),
                clone: this.topic("sketch.clone"),
                open: this.topic("sketch.open"),
                attrUpdate: this.topic("sketch.attrUpdate"),
                setSelection: this.topic("sketch.setSelection"),
            };
            this.textBlock = {
                add: this.topic("textBlock.add"),
                updateAttr: this.topic("textBlock.updateAttr"),
                updateArrange: this.topic("textBlock.updateArrange"),
                remove: this.topic("textBlock.remove")
            };
        }
        return Actions;
    }(TypedChannel.Channel));
    SketchEditor.Actions = Actions;
    var Events = (function (_super) {
        __extends(Events, _super);
        function Events() {
            _super.apply(this, arguments);
            this.editor = {
                resourcesReady: this.topic("app.resourcesReady"),
                workspaceInitialized: this.topic("app.workspaceInitialized"),
                fontLoaded: this.topic("app.fontLoaded"),
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
                saveLocalRequested: this.topic("sketch.savelocal.saveLocalRequested"),
                cloned: this.topic("sketch.cloned"),
                imageUploaded: this.topic("sketch.imageUploaded"),
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
    SketchEditor.Events = Events;
    var Channels = (function () {
        function Channels() {
            this.actions = new Actions();
            this.events = new Events();
        }
        return Channels;
    }());
    SketchEditor.Channels = Channels;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var UploadImage = (function () {
        function UploadImage(store) {
            this.store = store;
        }
        UploadImage.prototype.render = function () {
            var _this = this;
            return h("div", [
                h("h3", ["Upload image"]),
                h("input", {
                    attrs: {
                        type: "file"
                    },
                    on: {
                        change: function (ev) {
                            var file = ev.target.files[0];
                            _this.upload(file);
                        }
                    }
                })
            ]);
        };
        UploadImage.prototype.upload = function (file) {
            var img = new Image();
            var url = window.URL || window.webkitURL;
            var src = url.createObjectURL(file);
            this.store.imageUploaded(src);
            this.onClose && this.onClose();
        };
        return UploadImage;
    }());
    SketchEditor.UploadImage = UploadImage;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    function getFontDescription(family, variant) {
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
    SketchEditor.getFontDescription = getFontDescription;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var S3Access = (function () {
        function S3Access() {
        }
        /**
         * Upload file to application S3 bucket.
         * Returns upload URL as a promise.
         */
        S3Access.putFile = function (fileName, fileType, data) {
            // https://github.com/aws/aws-sdk-js/issues/190   
            if (navigator.userAgent.match(/Firefox/) && !fileType.match(/;/)) {
                var charset = '; charset=UTF-8';
                fileType += charset;
            }
            var signUrl = "/api/storage/access?fileName=" + fileName + "&fileType=" + fileType;
            // get signed URL
            return $.getJSON(signUrl)
                .then(function (signResponse) {
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
                    contentType: fileType,
                    accept: "application/json"
                };
                return $.ajax(putRequest)
                    .then(function (putResponse) {
                    console.log("uploaded file", signResponse.url);
                    return signResponse.url;
                }, function (err) {
                    console.error("error uploading to S3", err);
                });
            }, function (err) {
                console.error("error on /api/storage/access", err);
            });
        };
        /**
         * Download file from bucket
         */
        S3Access.getJson = function (fileName) {
            return this.getFileUrl(fileName)
                .then(function (response) {
                console.log("downloading", response.url);
                return $.ajax({
                    url: response.url,
                    dataType: "json",
                    cache: false
                });
            });
        };
        S3Access.getFileUrl = function (fileName) {
            return $.ajax({
                url: "/api/storage/url?fileName=" + fileName,
                dataType: "json",
                cache: false
            });
        };
        return S3Access;
    }());
    SketchEditor.S3Access = S3Access;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var ColorPicker = (function () {
        function ColorPicker() {
        }
        ColorPicker.setup = function (elem, featuredColors, onChange) {
            var featuredGroups = _.chunk(featuredColors, 5);
            // for each palette group
            var defaultPaletteGroups = ColorPicker.DEFAULT_PALETTE_GROUPS.map(function (group) {
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
            palette.push(ColorPicker.MONO_PALETTE);
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
        };
        ;
        ColorPicker.set = function (elem, value) {
            $(elem).spectrum("set", value);
        };
        ColorPicker.destroy = function (elem) {
            $(elem).spectrum("destroy");
        };
        ColorPicker.DEFAULT_PALETTE_GROUPS = [
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
        ColorPicker.MONO_PALETTE = ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"];
        return ColorPicker;
    }());
    SketchEditor.ColorPicker = ColorPicker;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var EditorBar = (function (_super) {
        __extends(EditorBar, _super);
        function EditorBar(container, store) {
            var _this = this;
            _super.call(this);
            this.store = store;
            var sketchDom$ = store.events.merge(store.events.sketch.loaded, store.events.sketch.attrChanged, store.events.editor.userMessageChanged)
                .map(function (m) { return _this.render(store.state); });
            ReactiveDom.renderStream(sketchDom$, container);
        }
        EditorBar.prototype.render = function (state) {
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
                            return SketchEditor.ColorPicker.setup(vnode.elm, SketchEditor.SketchHelpers.colorsInUse(_this.store.state.sketch), function (color) {
                                console.warn("bg", color);
                                _this.store.actions.sketch.attrUpdate.dispatch({ backgroundColor: color && color.toHexString() || "" });
                            });
                        },
                        update: function (oldVnode, vnode) {
                            SketchEditor.ColorPicker.set(vnode.elm, sketch.backgroundColor);
                        },
                        destroy: function (vnode) { return SketchEditor.ColorPicker.destroy(vnode.elm); }
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
                            content: "Clear all",
                            options: {
                                attrs: {
                                    title: "Clear sketch contents"
                                },
                                on: {
                                    click: function () { return _this.store.actions.sketch.clear.dispatch(); }
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
                                    click: function () { return _this.store.actions.editor.zoomToFit.dispatch(); }
                                }
                            }
                        },
                        {
                            content: "Toggle transparency",
                            options: {
                                attrs: {
                                    title: "See through text to elements behind"
                                },
                                on: {
                                    click: function () { return _this.store.setTransparency(!_this.store.state.transparency); }
                                }
                            }
                        },
                        {
                            content: "Upload tracing image",
                            options: {
                                attrs: {
                                    title: "Upload image into workspace for tracing"
                                },
                                on: {
                                    click: function () { return _this.store.showOperation(new SketchEditor.UploadImage(_this.store)); }
                                }
                            }
                        },
                        {
                            content: "Remove tracing image",
                            options: {
                                attrs: {
                                    title: "Remove background tracing image"
                                },
                                on: {
                                    click: function () { return _this.store.removeUploadedImage(); }
                                }
                            }
                        },
                        {
                            content: "Export image",
                            options: {
                                attrs: {
                                    title: "Export sketch as PNG",
                                },
                                on: {
                                    click: function () { return _this.store.actions.editor.exportPNG.dispatch(); }
                                }
                            }
                        },
                        {
                            content: "Export SVG",
                            options: {
                                attrs: {
                                    title: "Export sketch as vector graphics"
                                },
                                on: {
                                    click: function () { return _this.store.actions.editor.exportSVG.dispatch(); }
                                }
                            }
                        },
                        {
                            content: "Duplicate sketch",
                            options: {
                                attrs: {
                                    title: "Copy contents into a sketch with a new address"
                                },
                                on: {
                                    click: function () { return _this.store.actions.sketch.clone.dispatch(); }
                                }
                            }
                        },
                        {
                            content: "Open sample sketch",
                            options: {
                                attrs: {
                                    title: "Open a sample sketch to play with"
                                },
                                on: {
                                    click: function () { return _this.store.actions.editor.openSample.dispatch(); }
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
                                _this.store.actions.editor.toggleHelp.dispatch();
                            }
                        }
                    }),
                ])
            ]);
        };
        return EditorBar;
    }(Component));
    SketchEditor.EditorBar = EditorBar;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
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
                        fontVariant: FontShape.FontCatalog.defaultVariant(_this.store.resources.fontCatalog.getRecord(ev.target.value))
                    }); }
                }
            }, this.store.resources.fontCatalog
                .getList(this.store.fontListLimit)
                .map(function (record) { return h("option", {
                attrs: {
                    selected: record.family === block.fontFamily,
                    "data-content": "<span style=\"" + FontHelpers.getStyleString(record.family, null, _this.previewFontSize) + "\">" + record.family + "</span>"
                },
            }, [record.family]); })));
            var selectedFamily = this.store.resources.fontCatalog.getRecord(block.fontFamily);
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
    SketchEditor.FontPicker = FontPicker;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var HelpDialog = (function () {
        function HelpDialog(container, store) {
            var _this = this;
            this.store = store;
            var outer = $(container);
            outer.append("<h3>Getting started</h3>");
            store.state.showHelp ? outer.show() : outer.hide();
            $.get("content/help.html", function (d) {
                var close = $("<button class='btn btn-default'> Close </button>");
                close.on("click", function (ev) {
                    _this.store.actions.editor.toggleHelp.dispatch();
                });
                outer.append($(d))
                    .append(close)
                    .append("<a class='right' href='mailto:fiddlesticks@codeflight.io'>Email us</a>");
            });
            store.events.editor.showHelpChanged.sub(function (show) {
                show ? outer.show() : outer.hide();
            });
        }
        return HelpDialog;
    }());
    SketchEditor.HelpDialog = HelpDialog;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var OperationPanel = (function () {
        function OperationPanel(container, store) {
            var dom$ = store.operation$.map(function (op) {
                if (!op) {
                    return h("div.hidden");
                }
                return h("div.operation", [op.render()]);
            });
            ReactiveDom.renderStream(dom$, container);
        }
        return OperationPanel;
    }());
    SketchEditor.OperationPanel = OperationPanel;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
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
                    new SketchEditor.TextBlockEditor(store).render(block)
                ]);
            });
            ReactiveDom.renderStream(dom$, container);
        }
        return SelectedItemEditor;
    }());
    SketchEditor.SelectedItemEditor = SelectedItemEditor;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
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
                                return SketchEditor.ColorPicker.setup(vnode.elm, SketchEditor.SketchHelpers.colorsInUse(_this.store.state.sketch), function (color) { return update({ textColor: color && color.toHexString() }); });
                            },
                            destroy: function (vnode) { return SketchEditor.ColorPicker.destroy(vnode.elm); }
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
                                return SketchEditor.ColorPicker.setup(vnode.elm, SketchEditor.SketchHelpers.colorsInUse(_this.store.state.sketch), function (color) { return update({ backgroundColor: color && color.toHexString() }); });
                            },
                            destroy: function (vnode) { return SketchEditor.ColorPicker.destroy(vnode.elm); }
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
                            return new SketchEditor.FontPicker(vnode.elm, _this.store, textBlock);
                        }
                    }
                }, []),
            ]);
        };
        return TextBlockEditor;
    }(Component));
    SketchEditor.TextBlockEditor = TextBlockEditor;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var DualBoundsPathWarp = (function (_super) {
        __extends(DualBoundsPathWarp, _super);
        function DualBoundsPathWarp(source, bounds, customStyle) {
            var _this = this;
            _super.call(this);
            // -- build children --
            this._source = source;
            this._source.remove();
            if (bounds) {
                this._upper = new SketchEditor.StretchPath(bounds.upper);
                this._lower = new SketchEditor.StretchPath(bounds.lower);
            }
            else {
                this._upper = new SketchEditor.StretchPath([
                    new paper.Segment(source.bounds.topLeft),
                    new paper.Segment(source.bounds.topRight)
                ]);
                this._lower = new SketchEditor.StretchPath([
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
                strokeColor: "gray"
            };
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
            var transform = new FontShape.PathTransform(function (point) {
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
    SketchEditor.DualBoundsPathWarp = DualBoundsPathWarp;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
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
            paperExt.extendMouseEvents(this);
            this.on(paperExt.EventType.mouseDragStart, function (ev) {
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
            this.on(paper.EventType.mouseDrag, function (ev) {
                if (_this._segment) {
                    _this._segment.point = _this.center;
                    if (_this._smoothed) {
                        _this._segment.smooth();
                    }
                }
                _this.translate(ev.delta);
                ev.stop();
            });
            this.on(paper.EventType.click, function (ev) {
                if (_this._segment) {
                    _this.smoothed = !_this.smoothed;
                }
                ev.stop();
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
    SketchEditor.PathHandle = PathHandle;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
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
            this.addHandle(new SketchEditor.PathHandle(segment));
        };
        StretchPath.prototype.addCurveHandle = function (curve) {
            var _this = this;
            var handle = new SketchEditor.PathHandle(curve);
            handle.curveSplit.subscribeOne(function (curveIdx) {
                _this.addCurveHandle(_this._path.curves[curveIdx]);
                _this.addCurveHandle(_this._path.curves[curveIdx + 1]);
            });
            this.addHandle(handle);
        };
        StretchPath.prototype.addHandle = function (handle) {
            var _this = this;
            handle.visible = this.visible;
            handle.on(paper.EventType.mouseDrag, function (ev) {
                _this._pathChanged.notify(_this._path);
            });
            handle.on(paper.EventType.click, function (ev) {
                _this._pathChanged.notify(_this._path);
            });
            this.addChild(handle);
        };
        return StretchPath;
    }(paper.Group));
    SketchEditor.StretchPath = StretchPath;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
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
    SketchEditor.TextRuler = TextRuler;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
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
    }(SketchEditor.DualBoundsPathWarp));
    SketchEditor.TextWarp = TextWarp;
})(SketchEditor || (SketchEditor = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Eb21IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0Rvd25sb2FkSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL1NlZWRSYW5kb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2NvbGxlY3Rpb25zLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2V2ZW50cy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJOb3RpZnkudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvVmlld1pvb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvbW91c2VFdmVudEV4dC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9wYXBlci9wYXBlci1leHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9Db21wb25lbnQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9WRG9tSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwQ29va2llcy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L2FwcC9BcHBSb3V0ZXIudHMiLCIuLi8uLi9jbGllbnQvYXBwL1N0b3JlLnRzIiwiLi4vLi4vY2xpZW50L2RlbW8vRGVtb01vZHVsZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL0J1aWxkZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9Nb2R1bGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9QcmV2aWV3Q2FudmFzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvUmVuZGVyQ2FudmFzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvU2hhcmVPcHRpb25zVUkudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL21vZGVscy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL2NvbnRyb2xzL0NvbnRyb2xIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvRm9udENob29zZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9JbWFnZUNob29zZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9UZW1wbGF0ZUZvbnRDaG9vc2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvVGV4dElucHV0LnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvdGVtcGxhdGVzL0RpY2tlbnMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL0RvY3VtZW50S2V5SGFuZGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvU2tldGNoRWRpdG9yTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9Ta2V0Y2hIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvV29ya3NwYWNlQ29udHJvbGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvY2hhbm5lbHMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL2NvbnN0YW50cy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvbW9kZWxzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9vcGVyYXRpb25zL1VwbG9hZEltYWdlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9zZXJ2aWNlcy9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivc2VydmljZXMvUzNBY2Nlc3MudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0NvbG9yUGlja2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9FZGl0b3JCYXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0ZvbnRQaWNrZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0hlbHBEaWFsb2cudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL09wZXJhdGlvblBhbmVsLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9TZWxlY3RlZEl0ZW1FZGl0b3IudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL1RleHRCbG9ja0VkaXRvci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL0R1YWxCb3VuZHNQYXRoV2FycC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1BhdGhIYW5kbGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9TdHJldGNoUGF0aC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1RleHRSdWxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1RleHRXYXJwLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoi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O2dCQUMxQixDQUFDO1lBQ0wsQ0FBQzs7O1dBQUE7UUFFRCxpQ0FBYyxHQUFkO1lBQ0ksSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FDakMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBRWMsb0JBQVcsR0FBMUIsVUFBMkIsSUFBbUIsRUFDMUMsSUFBWSxFQUFFLFFBQTBCO1lBQ3hDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3RDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNwRCxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3JDLENBQUM7UUFqRU0sMEJBQWlCLEdBQUcsR0FBRyxDQUFDO1FBa0VuQyxlQUFDO0lBQUQsQ0FBQyxBQXBFRCxDQUE4QiwrQkFBa0IsR0FvRS9DO0lBcEVZLHFCQUFRLFdBb0VwQixDQUFBO0FBRUwsQ0FBQyxFQXhFUyxZQUFZLEtBQVosWUFBWSxRQXdFckI7QUNsRUEiLCJzb3VyY2VzQ29udGVudCI6WyJcclxubmFtZXNwYWNlIERvbUhlbHBlcnMge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIGJsb2IgZnJvbSBhIGRhdGEgVVJMIChlaXRoZXIgYmFzZTY0IGVuY29kZWQgb3Igbm90KS5cclxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9lYmlkZWwvZmlsZXIuanMvYmxvYi9tYXN0ZXIvc3JjL2ZpbGVyLmpzI0wxMzdcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YVVSTCBUaGUgZGF0YSBVUkwgdG8gY29udmVydC5cclxuICAgICAqIEByZXR1cm4ge0Jsb2J9IEEgYmxvYiByZXByZXNlbnRpbmcgdGhlIGFycmF5IGJ1ZmZlciBkYXRhLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGF0YVVSTFRvQmxvYihkYXRhVVJMKTogQmxvYiB7XHJcbiAgICAgICAgdmFyIEJBU0U2NF9NQVJLRVIgPSAnO2Jhc2U2NCwnO1xyXG4gICAgICAgIGlmIChkYXRhVVJMLmluZGV4T2YoQkFTRTY0X01BUktFUikgPT0gLTEpIHtcclxuICAgICAgICAgICAgdmFyIHBhcnRzID0gZGF0YVVSTC5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSBwYXJ0c1swXS5zcGxpdCgnOicpWzFdO1xyXG4gICAgICAgICAgICB2YXIgcmF3ID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQmxvYihbcmF3XSwgeyB0eXBlOiBjb250ZW50VHlwZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwYXJ0cyA9IGRhdGFVUkwuc3BsaXQoQkFTRTY0X01BUktFUik7XHJcbiAgICAgICAgdmFyIGNvbnRlbnRUeXBlID0gcGFydHNbMF0uc3BsaXQoJzonKVsxXTtcclxuICAgICAgICB2YXIgcmF3ID0gd2luZG93LmF0b2IocGFydHNbMV0pO1xyXG4gICAgICAgIHZhciByYXdMZW5ndGggPSByYXcubGVuZ3RoO1xyXG5cclxuICAgICAgICB2YXIgdUludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KHJhd0xlbmd0aCk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3TGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdUludDhBcnJheVtpXSA9IHJhdy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBCbG9iKFt1SW50OEFycmF5XSwgeyB0eXBlOiBjb250ZW50VHlwZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5pdEVycm9ySGFuZGxlcihsb2dnZXI6IChlcnJvckRhdGE6IE9iamVjdCkgPT4gdm9pZCkge1xyXG5cclxuICAgICAgICB3aW5kb3cub25lcnJvciA9IGZ1bmN0aW9uKG1zZywgZmlsZSwgbGluZSwgY29sLCBlcnJvcjogRXJyb3IgfCBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBzdGFja2ZyYW1lcyA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbXNnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6IGxpbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2w6IGNvbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrOiBzdGFja2ZyYW1lc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGxvZyBlcnJvclwiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGVycmJhY2sgPSBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gbG9nIGVycm9yXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3IgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcig8c3RyaW5nPmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhc0Vycm9yID0gdHlwZW9mIGVycm9yID09PSBcInN0cmluZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgPyBuZXcgRXJyb3IoZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgOiBlcnJvcjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFjayA9IFN0YWNrVHJhY2UuZnJvbUVycm9yKGFzRXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycmJhY2spO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmYWlsZWQgdG8gbG9nIGVycm9yXCIsIGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgS2V5Q29kZXMgPSB7XHJcbiAgICAgICAgQmFja1NwYWNlOiA4LFxyXG4gICAgICAgIFRhYjogOSxcclxuICAgICAgICBFbnRlcjogMTMsXHJcbiAgICAgICAgU2hpZnQ6IDE2LFxyXG4gICAgICAgIEN0cmw6IDE3LFxyXG4gICAgICAgIEFsdDogMTgsXHJcbiAgICAgICAgUGF1c2VCcmVhazogMTksXHJcbiAgICAgICAgQ2Fwc0xvY2s6IDIwLFxyXG4gICAgICAgIEVzYzogMjcsXHJcbiAgICAgICAgUGFnZVVwOiAzMyxcclxuICAgICAgICBQYWdlRG93bjogMzQsXHJcbiAgICAgICAgRW5kOiAzNSxcclxuICAgICAgICBIb21lOiAzNixcclxuICAgICAgICBBcnJvd0xlZnQ6IDM3LFxyXG4gICAgICAgIEFycm93VXA6IDM4LFxyXG4gICAgICAgIEFycm93UmlnaHQ6IDM5LFxyXG4gICAgICAgIEFycm93RG93bjogNDAsXHJcbiAgICAgICAgSW5zZXJ0OiA0NSxcclxuICAgICAgICBEZWxldGU6IDQ2LFxyXG4gICAgICAgIERpZ2l0MDogNDgsXHJcbiAgICAgICAgRGlnaXQxOiA0OSxcclxuICAgICAgICBEaWdpdDI6IDUwLFxyXG4gICAgICAgIERpZ2l0MzogNTEsXHJcbiAgICAgICAgRGlnaXQ0OiA1MixcclxuICAgICAgICBEaWdpdDU6IDUzLFxyXG4gICAgICAgIERpZ2l0NjogNTQsXHJcbiAgICAgICAgRGlnaXQ3OiA1NSxcclxuICAgICAgICBEaWdpdDg6IDU2LFxyXG4gICAgICAgIERpZ2l0OTogNTcsXHJcbiAgICAgICAgQTogNjUsXHJcbiAgICAgICAgQjogNjYsXHJcbiAgICAgICAgQzogNjcsXHJcbiAgICAgICAgRDogNjgsXHJcbiAgICAgICAgRTogNjksXHJcbiAgICAgICAgRjogNzAsXHJcbiAgICAgICAgRzogNzEsXHJcbiAgICAgICAgSDogNzIsXHJcbiAgICAgICAgSTogNzMsXHJcbiAgICAgICAgSjogNzQsXHJcbiAgICAgICAgSzogNzUsXHJcbiAgICAgICAgTDogNzYsXHJcbiAgICAgICAgTTogNzcsXHJcbiAgICAgICAgTjogNzgsXHJcbiAgICAgICAgTzogNzksXHJcbiAgICAgICAgUDogODAsXHJcbiAgICAgICAgUTogODEsXHJcbiAgICAgICAgUjogODIsXHJcbiAgICAgICAgUzogODMsXHJcbiAgICAgICAgVDogODQsXHJcbiAgICAgICAgVTogODUsXHJcbiAgICAgICAgVjogODYsXHJcbiAgICAgICAgVzogODcsXHJcbiAgICAgICAgWDogODgsXHJcbiAgICAgICAgWTogODksXHJcbiAgICAgICAgWjogOTAsXHJcbiAgICAgICAgV2luZG93TGVmdDogOTEsXHJcbiAgICAgICAgV2luZG93UmlnaHQ6IDkyLFxyXG4gICAgICAgIFNlbGVjdEtleTogOTMsXHJcbiAgICAgICAgTnVtcGFkMDogOTYsXHJcbiAgICAgICAgTnVtcGFkMTogOTcsXHJcbiAgICAgICAgTnVtcGFkMjogOTgsXHJcbiAgICAgICAgTnVtcGFkMzogOTksXHJcbiAgICAgICAgTnVtcGFkNDogMTAwLFxyXG4gICAgICAgIE51bXBhZDU6IDEwMSxcclxuICAgICAgICBOdW1wYWQ2OiAxMDIsXHJcbiAgICAgICAgTnVtcGFkNzogMTAzLFxyXG4gICAgICAgIE51bXBhZDg6IDEwNCxcclxuICAgICAgICBOdW1wYWQ5OiAxMDUsXHJcbiAgICAgICAgTXVsdGlwbHk6IDEwNixcclxuICAgICAgICBBZGQ6IDEwNyxcclxuICAgICAgICBTdWJ0cmFjdDogMTA5LFxyXG4gICAgICAgIERlY2ltYWxQb2ludDogMTEwLFxyXG4gICAgICAgIERpdmlkZTogMTExLFxyXG4gICAgICAgIEYxOiAxMTIsXHJcbiAgICAgICAgRjI6IDExMyxcclxuICAgICAgICBGMzogMTE0LFxyXG4gICAgICAgIEY0OiAxMTUsXHJcbiAgICAgICAgRjU6IDExNixcclxuICAgICAgICBGNjogMTE3LFxyXG4gICAgICAgIEY3OiAxMTgsXHJcbiAgICAgICAgRjg6IDExOSxcclxuICAgICAgICBGOTogMTIwLFxyXG4gICAgICAgIEYxMDogMTIxLFxyXG4gICAgICAgIEYxMTogMTIyLFxyXG4gICAgICAgIEYxMjogMTIzLFxyXG4gICAgICAgIE51bUxvY2s6IDE0NCxcclxuICAgICAgICBTY3JvbGxMb2NrOiAxNDUsXHJcbiAgICAgICAgU2VtaUNvbG9uOiAxODYsXHJcbiAgICAgICAgRXF1YWw6IDE4NyxcclxuICAgICAgICBDb21tYTogMTg4LFxyXG4gICAgICAgIERhc2g6IDE4OSxcclxuICAgICAgICBQZXJpb2Q6IDE5MCxcclxuICAgICAgICBGb3J3YXJkU2xhc2g6IDE5MSxcclxuICAgICAgICBHcmF2ZUFjY2VudDogMTkyLFxyXG4gICAgICAgIEJyYWNrZXRPcGVuOiAyMTksXHJcbiAgICAgICAgQmFja1NsYXNoOiAyMjAsXHJcbiAgICAgICAgQnJhY2tldENsb3NlOiAyMjEsXHJcbiAgICAgICAgU2luZ2xlUXVvdGU6IDIyMlxyXG4gICAgfTtcclxuXHJcbn0iLCJuYW1lc3BhY2UgRnN0eC5GcmFtZXdvcmsge1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGaWxlTmFtZSh0ZXh0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBleHRlbnNpb246IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IG5hbWUgPSBcIlwiO1xyXG4gICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiB0ZXh0LnNwbGl0KC9cXHMvKSkge1xyXG4gICAgICAgICAgICBjb25zdCB0cmltID0gd29yZC5yZXBsYWNlKC9cXFcvZywgJycpLnRyaW0oKTtcclxuICAgICAgICAgICAgaWYgKHRyaW0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZihuYW1lLmxlbmd0aCAmJiBuYW1lLmxlbmd0aCArIHRyaW0ubGVuZ3RoICsgMSA+IG1heExlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGgpIG5hbWUgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICBuYW1lICs9IHRyaW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5hbWUgKyBcIi5cIiArIGV4dGVuc2lvbjtcclxuICAgIH1cclxuXHJcbn0iLCJcclxubmFtZXNwYWNlIEZvbnRIZWxwZXJzIHtcclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBFbGVtZW50Rm9udFN0eWxlIHtcclxuICAgICAgICBmb250RmFtaWx5Pzogc3RyaW5nO1xyXG4gICAgICAgIGZvbnRXZWlnaHQ/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFN0eWxlPzogc3RyaW5nOyBcclxuICAgICAgICBmb250U2l6ZT86IHN0cmluZzsgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRDc3NTdHlsZShmYW1pbHk6IHN0cmluZywgdmFyaWFudD86IHN0cmluZywgc2l6ZT86IHN0cmluZyl7XHJcbiAgICAgICAgbGV0IHN0eWxlID0gPEVsZW1lbnRGb250U3R5bGU+eyBmb250RmFtaWx5OiBmYW1pbHkgfTtcclxuICAgICAgICBpZih2YXJpYW50ICYmIHZhcmlhbnQuaW5kZXhPZihcIml0YWxpY1wiKSA+PSAwKXtcclxuICAgICAgICAgICAgc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG51bWVyaWMgPSB2YXJpYW50ICYmIHZhcmlhbnQucmVwbGFjZSgvW15cXGRdL2csIFwiXCIpO1xyXG4gICAgICAgIGlmKG51bWVyaWMgJiYgbnVtZXJpYy5sZW5ndGgpe1xyXG4gICAgICAgICAgICBzdHlsZS5mb250V2VpZ2h0ID0gbnVtZXJpYy50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzaXplKXtcclxuICAgICAgICAgICAgc3R5bGUuZm9udFNpemUgPSBzaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3R5bGU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRTdHlsZVN0cmluZyhmYW1pbHk6IHN0cmluZywgdmFyaWFudDogc3RyaW5nLCBzaXplPzogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHN0eWxlT2JqID0gZ2V0Q3NzU3R5bGUoZmFtaWx5LCB2YXJpYW50LCBzaXplKTtcclxuICAgICAgICBsZXQgcGFydHMgPSBbXTtcclxuICAgICAgICBpZihzdHlsZU9iai5mb250RmFtaWx5KXtcclxuICAgICAgICAgICAgcGFydHMucHVzaChgZm9udC1mYW1pbHk6JyR7c3R5bGVPYmouZm9udEZhbWlseX0nYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0eWxlT2JqLmZvbnRXZWlnaHQpe1xyXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LXdlaWdodDoke3N0eWxlT2JqLmZvbnRXZWlnaHR9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0eWxlT2JqLmZvbnRTdHlsZSl7XHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goYGZvbnQtc3R5bGU6JHtzdHlsZU9iai5mb250U3R5bGV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0eWxlT2JqLmZvbnRTaXplKXtcclxuICAgICAgICAgICAgcGFydHMucHVzaChgZm9udC1zaXplOiR7c3R5bGVPYmouZm9udFNpemV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXJ0cy5qb2luKFwiOyBcIik7XHJcbiAgICB9XHJcbiAgICBcclxufSIsIm5hbWVzcGFjZSBGcmFtZXdvcmsge1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBsb2d0YXA8VD4obWVzc2FnZTogc3RyaW5nLCBzdHJlYW06IFJ4Lk9ic2VydmFibGU8VD4pOiBSeC5PYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICByZXR1cm4gc3RyZWFtLnRhcCh0ID0+IGNvbnNvbGUubG9nKG1lc3NhZ2UsIHQpKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbmV3aWQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gKG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgTWF0aC5yYW5kb20oKSlcclxuICAgICAgICAgICAgLnRvU3RyaW5nKDM2KS5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgfVxyXG4gICBcclxufVxyXG4iLCJuYW1lc3BhY2UgRnJhbWV3b3JrIHtcclxuICAgIFxyXG4gICAgZXhwb3J0IGNsYXNzIFNlZWRSYW5kb20ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNlZWQ6IG51bWJlcjtcclxuICAgICAgICBuZXh0U2VlZDogbnVtYmVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHNlZWQ6IG51bWJlciA9IE1hdGgucmFuZG9tKCkpe1xyXG4gICAgICAgICAgICB0aGlzLnNlZWQgPSB0aGlzLm5leHRTZWVkID0gc2VlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmFuZG9tKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGNvbnN0IHggPSBNYXRoLnNpbih0aGlzLm5leHRTZWVkICogMiAqIE1hdGguUEkpICogMTAwMDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHggLSBNYXRoLmZsb29yKHgpO1xyXG4gICAgICAgICAgICB0aGlzLm5leHRTZWVkID0gcmVzdWx0O1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiXHJcbm5hbWVzcGFjZSBUeXBlZENoYW5uZWwge1xyXG5cclxuICAgIC8vIC0tLSBDb3JlIHR5cGVzIC0tLVxyXG5cclxuICAgIHR5cGUgU2VyaWFsaXphYmxlID0gT2JqZWN0IHwgQXJyYXk8YW55PiB8IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBEYXRlIHwgdm9pZDtcclxuXHJcbiAgICB0eXBlIFZhbHVlID0gbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiB8IERhdGU7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIGRhdGE/OiBURGF0YTtcclxuICAgIH1cclxuXHJcbiAgICB0eXBlIElTdWJqZWN0PFQ+ID0gUnguT2JzZXJ2ZXI8VD4gJiBSeC5PYnNlcnZhYmxlPFQ+O1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDaGFubmVsVG9waWM8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgY2hhbm5lbDogSVN1YmplY3Q8TWVzc2FnZTxURGF0YT4+O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihjaGFubmVsOiBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj4sIHR5cGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3Vic2NyaWJlKG9ic2VydmVyOiAobWVzc2FnZTogTWVzc2FnZTxURGF0YT4pID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCkuc3Vic2NyaWJlKG9ic2VydmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YihvYnNlcnZlcjogKGRhdGE6IFREYXRhKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgpLnN1YnNjcmliZShtID0+IG9ic2VydmVyKG0uZGF0YSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXNwYXRjaChkYXRhPzogVERhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsLm9uTmV4dCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JzZXJ2ZSgpOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGE+PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuZmlsdGVyKG0gPT4gbS50eXBlID09PSB0aGlzLnR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBvYnNlcnZlRGF0YSgpOiBSeC5PYnNlcnZhYmxlPFREYXRhPiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9ic2VydmUoKS5tYXAobSA9PiBtLmRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3J3YXJkKGNoYW5uZWw6IENoYW5uZWxUb3BpYzxURGF0YT4pIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmUobSA9PiBjaGFubmVsLmRpc3BhdGNoKG0uZGF0YSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbCB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgc3ViamVjdDogSVN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGU+PjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3ViamVjdD86IElTdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4sIHR5cGU/OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJqZWN0ID0gc3ViamVjdCB8fCBuZXcgUnguU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+KCk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWJzY3JpYmUob25OZXh0PzogKHZhbHVlOiBNZXNzYWdlPFNlcmlhbGl6YWJsZT4pID0+IHZvaWQpOiBSeC5JRGlzcG9zYWJsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3Quc3Vic2NyaWJlKG9uTmV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYnNlcnZlKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9waWM8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+KHR5cGU6IHN0cmluZykgOiBDaGFubmVsVG9waWM8VERhdGE+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VERhdGE+KHRoaXMuc3ViamVjdCBhcyBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj4sXHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPyB0aGlzLnR5cGUgKyAnLicgKyB0eXBlIDogdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lcmdlVHlwZWQ8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+KC4uLnRvcGljczogQ2hhbm5lbFRvcGljPFREYXRhPltdKSBcclxuICAgICAgICAgICAgOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGE+PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdG9waWNzLm1hcCh0ID0+IHQudHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuZmlsdGVyKG0gPT4gdHlwZXMuaW5kZXhPZihtLnR5cGUpID49IDAgKSBhcyBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGE+PjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVyZ2UoLi4udG9waWNzOiBDaGFubmVsVG9waWM8U2VyaWFsaXphYmxlPltdKSBcclxuICAgICAgICAgICAgOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRvcGljcy5tYXAodCA9PiB0LnR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmZpbHRlcihtID0+IHR5cGVzLmluZGV4T2YobS50eXBlKSA+PSAwICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJcclxudHlwZSBEaWN0aW9uYXJ5PFQ+ID0gXy5EaWN0aW9uYXJ5PFQ+O1xyXG4iLCJcclxuY2xhc3MgT2JzZXJ2YWJsZUV2ZW50PFQ+IHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfc3Vic2NyaWJlcnM6ICgoZXZlbnRBcmc6IFQpID0+IHZvaWQpW10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmb3Igbm90aWZpY2F0aW9uLiBSZXR1cm5zIHVuc3Vic2NyaWJlIGZ1bmN0aW9uLlxyXG4gICAgICovICAgIFxyXG4gICAgc3Vic2NyaWJlKGhhbmRsZXI6IChldmVudEFyZzogVCkgPT4gdm9pZCk6ICgoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgaWYodGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyKSA8IDApe1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5wdXNoKGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKCkgPT4gdGhpcy51bnN1YnNjcmliZShoYW5kbGVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdW5zdWJzY3JpYmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoY2FsbGJhY2ssIDApO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9ic2VydmUoKTogUnguT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHVuc3ViOiBhbnk7XHJcbiAgICAgICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybjxUPihcclxuICAgICAgICAgICAgKGhhbmRsZXJUb0FkZCkgPT4gdGhpcy5zdWJzY3JpYmUoPChldmVudEFyZzogVCkgPT4gdm9pZD5oYW5kbGVyVG9BZGQpLFxyXG4gICAgICAgICAgICAoaGFuZGxlclRvUmVtb3ZlKSA9PiB0aGlzLnVuc3Vic2NyaWJlKDwoZXZlbnRBcmc6IFQpID0+IHZvaWQ+aGFuZGxlclRvUmVtb3ZlKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGZvciBvbmUgbm90aWZpY2F0aW9uLlxyXG4gICAgICovXHJcbiAgICBzdWJzY3JpYmVPbmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCl7XHJcbiAgICAgICAgbGV0IHVuc3ViID0gdGhpcy5zdWJzY3JpYmUodCA9PiB7XHJcbiAgICAgICAgICAgIHVuc3ViKCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBub3RpZnkoZXZlbnRBcmc6IFQpe1xyXG4gICAgICAgIGZvcihsZXQgc3Vic2NyaWJlciBvZiB0aGlzLl9zdWJzY3JpYmVycyl7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY2FsbCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIHN1YnNjcmliZXJzLlxyXG4gICAgICovXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG59IiwiXHJcbm5hbWVzcGFjZSBCb290U2NyaXB0IHtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIE1lbnVJdGVtIHtcclxuICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgb3B0aW9ucz86IE9iamVjdFxyXG4gICAgICAgIC8vb25DbGljaz86ICgpID0+IHZvaWRcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZHJvcGRvd24oXHJcbiAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgICBpZDogc3RyaW5nLFxyXG4gICAgICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgICAgIGl0ZW1zOiBNZW51SXRlbVtdXHJcbiAgICAgICAgfSk6IFZOb2RlIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXYuZHJvcGRvd25cIiwgW1xyXG4gICAgICAgICAgICBoKFwiYnV0dG9uLmJ0bi5idG4tZGVmYXVsdC5kcm9wZG93bi10b2dnbGVcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImF0dHJzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFyZ3MuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS10b2dnbGVcIjogXCJkcm9wZG93blwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgYXJncy5jb250ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuLmNhcmV0XCIpXHJcbiAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgaChcInVsLmRyb3Bkb3duLW1lbnVcIixcclxuICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgYXJncy5pdGVtcy5tYXAoaXRlbSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJsaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoJ2EnLCBpdGVtLm9wdGlvbnMgfHwge30sIFtpdGVtLmNvbnRlbnRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG50eXBlIEl0ZW1DaGFuZ2VIYW5kbGVyID0gKGZsYWdzOiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnKSA9PiB2b2lkO1xyXG50eXBlIENhbGxiYWNrID0gKCkgPT4gdm9pZDtcclxuXHJcbmRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSXRlbSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU3Vic2NyaWJlIHRvIGFsbCBjaGFuZ2VzIGluIGl0ZW0uIFJldHVybnMgdW4tc3Vic2NyaWJlIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN1YnNjcmliZShoYW5kbGVyOiBJdGVtQ2hhbmdlSGFuZGxlcik6IENhbGxiYWNrO1xyXG4gICAgICAgIFxyXG4gICAgICAgIF9jaGFuZ2VkKGZsYWdzOiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnKTogdm9pZDtcclxuICAgIH1cclxufVxyXG5cclxubmFtZXNwYWNlIFBhcGVyTm90aWZ5IHtcclxuXHJcbiAgICBleHBvcnQgZW51bSBDaGFuZ2VGbGFnIHtcclxuICAgICAgICAvLyBBbnl0aGluZyBhZmZlY3RpbmcgdGhlIGFwcGVhcmFuY2Ugb2YgYW4gaXRlbSwgaW5jbHVkaW5nIEdFT01FVFJZLFxyXG4gICAgICAgIC8vIFNUUk9LRSwgU1RZTEUgYW5kIEFUVFJJQlVURSAoZXhjZXB0IGZvciB0aGUgaW52aXNpYmxlIG9uZXM6IGxvY2tlZCwgbmFtZSlcclxuICAgICAgICBBUFBFQVJBTkNFID0gMHgxLFxyXG4gICAgICAgIC8vIEEgY2hhbmdlIGluIHRoZSBpdGVtJ3MgY2hpbGRyZW5cclxuICAgICAgICBDSElMRFJFTiA9IDB4MixcclxuICAgICAgICAvLyBBIGNoYW5nZSBvZiB0aGUgaXRlbSdzIHBsYWNlIGluIHRoZSBzY2VuZSBncmFwaCAocmVtb3ZlZCwgaW5zZXJ0ZWQsXHJcbiAgICAgICAgLy8gbW92ZWQpLlxyXG4gICAgICAgIElOU0VSVElPTiA9IDB4NCxcclxuICAgICAgICAvLyBJdGVtIGdlb21ldHJ5IChwYXRoLCBib3VuZHMpXHJcbiAgICAgICAgR0VPTUVUUlkgPSAweDgsXHJcbiAgICAgICAgLy8gT25seSBzZWdtZW50KHMpIGhhdmUgY2hhbmdlZCwgYW5kIGFmZmVjdGVkIGN1cnZlcyBoYXZlIGFscmVhZHkgYmVlblxyXG4gICAgICAgIC8vIG5vdGlmaWVkLiBUaGlzIGlzIHRvIGltcGxlbWVudCBhbiBvcHRpbWl6YXRpb24gaW4gX2NoYW5nZWQoKSBjYWxscy5cclxuICAgICAgICBTRUdNRU5UUyA9IDB4MTAsXHJcbiAgICAgICAgLy8gU3Ryb2tlIGdlb21ldHJ5IChleGNsdWRpbmcgY29sb3IpXHJcbiAgICAgICAgU1RST0tFID0gMHgyMCxcclxuICAgICAgICAvLyBGaWxsIHN0eWxlIG9yIHN0cm9rZSBjb2xvciAvIGRhc2hcclxuICAgICAgICBTVFlMRSA9IDB4NDAsXHJcbiAgICAgICAgLy8gSXRlbSBhdHRyaWJ1dGVzOiB2aXNpYmxlLCBibGVuZE1vZGUsIGxvY2tlZCwgbmFtZSwgb3BhY2l0eSwgY2xpcE1hc2sgLi4uXHJcbiAgICAgICAgQVRUUklCVVRFID0gMHg4MCxcclxuICAgICAgICAvLyBUZXh0IGNvbnRlbnRcclxuICAgICAgICBDT05URU5UID0gMHgxMDAsXHJcbiAgICAgICAgLy8gUmFzdGVyIHBpeGVsc1xyXG4gICAgICAgIFBJWEVMUyA9IDB4MjAwLFxyXG4gICAgICAgIC8vIENsaXBwaW5nIGluIG9uZSBvZiB0aGUgY2hpbGQgaXRlbXNcclxuICAgICAgICBDTElQUElORyA9IDB4NDAwLFxyXG4gICAgICAgIC8vIFRoZSB2aWV3IGhhcyBiZWVuIHRyYW5zZm9ybWVkXHJcbiAgICAgICAgVklFVyA9IDB4ODAwXHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2hvcnRjdXRzIHRvIG9mdGVuIHVzZWQgQ2hhbmdlRmxhZyB2YWx1ZXMgaW5jbHVkaW5nIEFQUEVBUkFOQ0VcclxuICAgIGV4cG9ydCBlbnVtIENoYW5nZXMge1xyXG4gICAgICAgIC8vIENISUxEUkVOIGFsc28gY2hhbmdlcyBHRU9NRVRSWSwgc2luY2UgcmVtb3ZpbmcgY2hpbGRyZW4gZnJvbSBncm91cHNcclxuICAgICAgICAvLyBjaGFuZ2VzIGJvdW5kcy5cclxuICAgICAgICBDSElMRFJFTiA9IENoYW5nZUZsYWcuQ0hJTERSRU4gfCBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIC8vIENoYW5naW5nIHRoZSBpbnNlcnRpb24gY2FuIGNoYW5nZSB0aGUgYXBwZWFyYW5jZSB0aHJvdWdoIHBhcmVudCdzIG1hdHJpeC5cclxuICAgICAgICBJTlNFUlRJT04gPSBDaGFuZ2VGbGFnLklOU0VSVElPTiB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBHRU9NRVRSWSA9IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgU0VHTUVOVFMgPSBDaGFuZ2VGbGFnLlNFR01FTlRTIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBTVFJPS0UgPSBDaGFuZ2VGbGFnLlNUUk9LRSB8IENoYW5nZUZsYWcuU1RZTEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgU1RZTEUgPSBDaGFuZ2VGbGFnLlNUWUxFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIEFUVFJJQlVURSA9IENoYW5nZUZsYWcuQVRUUklCVVRFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIENPTlRFTlQgPSBDaGFuZ2VGbGFnLkNPTlRFTlQgfCBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFBJWEVMUyA9IENoYW5nZUZsYWcuUElYRUxTIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFZJRVcgPSBDaGFuZ2VGbGFnLlZJRVcgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0VcclxuICAgIH07XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gSW5qZWN0IEl0ZW0uc3Vic2NyaWJlXHJcbiAgICAgICAgY29uc3QgaXRlbVByb3RvID0gKDxhbnk+cGFwZXIpLkl0ZW0ucHJvdG90eXBlO1xyXG4gICAgICAgIGl0ZW1Qcm90by5zdWJzY3JpYmUgPSBmdW5jdGlvbihoYW5kbGVyOiBJdGVtQ2hhbmdlSGFuZGxlcik6IENhbGxiYWNrIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9zdWJzY3JpYmVycykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyKSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnB1c2goaGFuZGxlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoaGFuZGxlciwgMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdyYXAgSXRlbS5yZW1vdmVcclxuICAgICAgICBjb25zdCBpdGVtUmVtb3ZlID0gaXRlbVByb3RvLnJlbW92ZTtcclxuICAgICAgICBpdGVtUHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0ZW1SZW1vdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gV3JhcCBQcm9qZWN0Ll9jaGFuZ2VkXHJcbiAgICAgICAgY29uc3QgcHJvamVjdFByb3RvID0gPGFueT5wYXBlci5Qcm9qZWN0LnByb3RvdHlwZTtcclxuICAgICAgICBjb25zdCBwcm9qZWN0Q2hhbmdlZCA9IHByb2plY3RQcm90by5fY2hhbmdlZDtcclxuICAgICAgICBwcm9qZWN0UHJvdG8uX2NoYW5nZWQgPSBmdW5jdGlvbihmbGFnczogQ2hhbmdlRmxhZywgaXRlbTogcGFwZXIuSXRlbSkge1xyXG4gICAgICAgICAgICBwcm9qZWN0Q2hhbmdlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3VicyA9ICg8YW55Pml0ZW0pLl9zdWJzY3JpYmVycztcclxuICAgICAgICAgICAgICAgIGlmIChzdWJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcyBvZiBzdWJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuY2FsbChpdGVtLCBmbGFncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZShmbGFnczogQ2hhbmdlRmxhZykge1xyXG4gICAgICAgIGxldCBmbGFnTGlzdDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBfLmZvck93bihDaGFuZ2VGbGFnLCAodmFsdWUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB2YWx1ZSkgPT09IFwibnVtYmVyXCIgJiYgKHZhbHVlICYgZmxhZ3MpKSB7XHJcbiAgICAgICAgICAgICAgICBmbGFnTGlzdC5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmxhZ0xpc3Quam9pbignIHwgJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlKGl0ZW06IHBhcGVyLkl0ZW0sIGZsYWdzOiBDaGFuZ2VGbGFnKTogXHJcbiAgICAgICAgUnguT2JzZXJ2YWJsZTxDaGFuZ2VGbGFnPiBcclxuICAgIHtcclxuICAgICAgICBsZXQgdW5zdWI6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybjxDaGFuZ2VGbGFnPihcclxuICAgICAgICAgICAgYWRkSGFuZGxlciA9PiB7XHJcbiAgICAgICAgICAgICAgICB1bnN1YiA9IGl0ZW0uc3Vic2NyaWJlKGYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGYgJiBmbGFncyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEhhbmRsZXIoZik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICByZW1vdmVIYW5kbGVyID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHVuc3ViKXtcclxuICAgICAgICAgICAgICAgICAgICB1bnN1YigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblBhcGVyTm90aWZ5LmluaXRpYWxpemUoKTtcclxuIiwiZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgaW50ZXJmYWNlIFZpZXcge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEludGVybmFsIG1ldGhvZCBmb3IgaW5pdGlhdGluZyBtb3VzZSBldmVudHMgb24gdmlldy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBlbWl0TW91c2VFdmVudHModmlldzogcGFwZXIuVmlldywgaXRlbTogcGFwZXIuSXRlbSwgdHlwZTogc3RyaW5nLFxyXG4gICAgICAgICAgICBldmVudDogYW55LCBwb2ludDogcGFwZXIuUG9pbnQsIHByZXZQb2ludDogcGFwZXIuUG9pbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5uYW1lc3BhY2UgcGFwZXJFeHQge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBWaWV3Wm9vbSB7XHJcblxyXG4gICAgICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcbiAgICAgICAgZmFjdG9yID0gMS4yNTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfbWluWm9vbTogbnVtYmVyO1xyXG4gICAgICAgIHByaXZhdGUgX21heFpvb206IG51bWJlcjtcclxuICAgICAgICBwcml2YXRlIF9tb3VzZU5hdGl2ZVN0YXJ0OiBwYXBlci5Qb2ludDtcclxuICAgICAgICBwcml2YXRlIF92aWV3Q2VudGVyU3RhcnQ6IHBhcGVyLlBvaW50O1xyXG4gICAgICAgIHByaXZhdGUgX3ZpZXdDaGFuZ2VkID0gbmV3IE9ic2VydmFibGVFdmVudDxwYXBlci5SZWN0YW5nbGU+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByb2plY3Q6IHBhcGVyLlByb2plY3QpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuXHJcbiAgICAgICAgICAgICg8YW55PiQodGhpcy5wcm9qZWN0LnZpZXcuZWxlbWVudCkpLm1vdXNld2hlZWwoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtb3VzZVBvc2l0aW9uID0gbmV3IHBhcGVyLlBvaW50KGV2ZW50Lm9mZnNldFgsIGV2ZW50Lm9mZnNldFkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2Vab29tQ2VudGVyZWQoZXZlbnQuZGVsdGFZLCBtb3VzZVBvc2l0aW9uKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGlkRHJhZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0LnZpZXcub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlRHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGl0ID0gcHJvamVjdC5oaXRUZXN0KGV2LnBvaW50KTtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fdmlld0NlbnRlclN0YXJ0KSB7ICAvLyBub3QgYWxyZWFkeSBkcmFnZ2luZ1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChoaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG9uJ3Qgc3RhcnQgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2VudGVyU3RhcnQgPSB2aWV3LmNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICAvLyBIYXZlIHRvIHVzZSBuYXRpdmUgbW91c2Ugb2Zmc2V0LCBiZWNhdXNlIGV2LmRlbHRhIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICBjaGFuZ2VzIGFzIHRoZSB2aWV3IGlzIHNjcm9sbGVkLlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQgPSBuZXcgcGFwZXIuUG9pbnQoZXYuZXZlbnQub2Zmc2V0WCwgZXYuZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5lbWl0KHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdTdGFydCwgZXYpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYXRpdmVEZWx0YSA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXYuZXZlbnQub2Zmc2V0WCAtIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXYuZXZlbnQub2Zmc2V0WSAtIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQueVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTW92ZSBpbnRvIHZpZXcgY29vcmRpbmF0ZXMgdG8gc3VicmFjdCBkZWx0YSxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgdGhlbiBiYWNrIGludG8gcHJvamVjdCBjb29yZHMuXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LnZpZXdUb1Byb2plY3QoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcucHJvamVjdFRvVmlldyh0aGlzLl92aWV3Q2VudGVyU3RhcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3VidHJhY3QobmF0aXZlRGVsdGEpKTtcclxuICAgICAgICAgICAgICAgICAgICBkaWREcmFnID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByb2plY3Qudmlldy5vbihwYXBlci5FdmVudFR5cGUubW91c2VVcCwgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21vdXNlTmF0aXZlU3RhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZU5hdGl2ZVN0YXJ0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2VudGVyU3RhcnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnRW5kLCBldik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpZERyYWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlld0NoYW5nZWQubm90aWZ5KHZpZXcuYm91bmRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlkRHJhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdmlld0NoYW5nZWQoKTogT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlJlY3RhbmdsZT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmlld0NoYW5nZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgem9vbSgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qZWN0LnZpZXcuem9vbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB6b29tUmFuZ2UoKTogbnVtYmVyW10ge1xyXG4gICAgICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0Wm9vbVJhbmdlKHJhbmdlOiBwYXBlci5TaXplW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICAgICAgY29uc3QgYVNpemUgPSByYW5nZS5zaGlmdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBiU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBhU2l6ZSAmJiBNYXRoLm1pbihcclxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIGFTaXplLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYVNpemUud2lkdGgpO1xyXG4gICAgICAgICAgICBjb25zdCBiID0gYlNpemUgJiYgTWF0aC5taW4oXHJcbiAgICAgICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBiU2l6ZS5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGJTaXplLndpZHRoKTtcclxuICAgICAgICAgICAgY29uc3QgbWluID0gTWF0aC5taW4oYSwgYik7XHJcbiAgICAgICAgICAgIGlmIChtaW4pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21pblpvb20gPSBtaW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoYSwgYik7XHJcbiAgICAgICAgICAgIGlmIChtYXgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21heFpvb20gPSBtYXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFt0aGlzLl9taW5ab29tLCB0aGlzLl9tYXhab29tXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHpvb21UbyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpIHtcclxuICAgICAgICAgICAgaWYocmVjdC5pc0VtcHR5KCkgfHwgcmVjdC53aWR0aCA9PT0gMCB8fCByZWN0LmhlaWdodCA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJza2lwcGluZyB6b29tIHRvXCIsIHJlY3QpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICAgICAgdmlldy5jZW50ZXIgPSByZWN0LmNlbnRlcjtcclxuICAgICAgICAgICAgY29uc3Qgem9vbUxldmVsID0gTWF0aC5taW4oXHJcbiAgICAgICAgICAgICAgICB2aWV3LnZpZXdTaXplLmhlaWdodCAvIHJlY3QuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgdmlldy52aWV3U2l6ZS53aWR0aCAvIHJlY3Qud2lkdGgpO1xyXG4gICAgICAgICAgICB2aWV3Lnpvb20gPSB6b29tTGV2ZWw7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXdDaGFuZ2VkLm5vdGlmeSh2aWV3LmJvdW5kcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFuZ2Vab29tQ2VudGVyZWQoZGVsdGE6IG51bWJlciwgbW91c2VQb3M6IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgICAgIGlmICghZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgICAgIGNvbnN0IG9sZFpvb20gPSB2aWV3Lnpvb207XHJcbiAgICAgICAgICAgIGNvbnN0IG9sZENlbnRlciA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgICAgICBjb25zdCB2aWV3UG9zID0gdmlldy52aWV3VG9Qcm9qZWN0KG1vdXNlUG9zKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdab29tID0gZGVsdGEgPiAwXHJcbiAgICAgICAgICAgICAgICA/IHZpZXcuem9vbSAqIHRoaXMuZmFjdG9yXHJcbiAgICAgICAgICAgICAgICA6IHZpZXcuem9vbSAvIHRoaXMuZmFjdG9yO1xyXG4gICAgICAgICAgICBuZXdab29tID0gdGhpcy5zZXRab29tQ29uc3RyYWluZWQobmV3Wm9vbSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5ld1pvb20pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgem9vbVNjYWxlID0gb2xkWm9vbSAvIG5ld1pvb207XHJcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlckFkanVzdCA9IHZpZXdQb3Muc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gdmlld1Bvcy5zdWJ0cmFjdChjZW50ZXJBZGp1c3QubXVsdGlwbHkoem9vbVNjYWxlKSlcclxuICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChvbGRDZW50ZXIpO1xyXG5cclxuICAgICAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LmNlbnRlci5hZGQob2Zmc2V0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXdDaGFuZ2VkLm5vdGlmeSh2aWV3LmJvdW5kcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2V0IHpvb20gbGV2ZWwuXHJcbiAgICAgICAgICogQHJldHVybnMgem9vbSBsZXZlbCB0aGF0IHdhcyBzZXQsIG9yIG51bGwgaWYgaXQgd2FzIG5vdCBjaGFuZ2VkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRab29tQ29uc3RyYWluZWQoem9vbTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX21pblpvb20pIHtcclxuICAgICAgICAgICAgICAgIHpvb20gPSBNYXRoLm1heCh6b29tLCB0aGlzLl9taW5ab29tKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fbWF4Wm9vbSkge1xyXG4gICAgICAgICAgICAgICAgem9vbSA9IE1hdGgubWluKHpvb20sIHRoaXMuX21heFpvb20pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICAgICAgaWYgKHpvb20gIT0gdmlldy56b29tKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3Lnpvb20gPSB6b29tO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHpvb207XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBwYXBlckV4dCB7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogVXNlIG9mIHRoZXNlIGV2ZW50cyByZXF1aXJlcyBmaXJzdCBjYWxsaW5nIGV4dGVuZE1vdXNlRXZlbnRzXHJcbiAgICAgKiAgIG9uIHRoZSBpdGVtLiBcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IHZhciBFdmVudFR5cGUgPSB7XHJcbiAgICAgICAgbW91c2VEcmFnU3RhcnQ6IFwibW91c2VEcmFnU3RhcnRcIixcclxuICAgICAgICBtb3VzZURyYWdFbmQ6IFwibW91c2VEcmFnRW5kXCJcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZXh0ZW5kTW91c2VFdmVudHMoaXRlbTogcGFwZXIuSXRlbSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaXRlbS5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFkcmFnZ2luZyl7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ1N0YXJ0LCBldik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZVVwLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmKGRyYWdnaW5nKXtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ0VuZCwgZXYpO1xyXG4gICAgICAgICAgICAgICAgLy8gcHJldmVudCBjbGlja1xyXG4gICAgICAgICAgICAgICAgZXYuc3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJcclxubW9kdWxlIHBhcGVyIHtcclxuXHJcbiAgICBleHBvcnQgdmFyIEV2ZW50VHlwZSA9IHtcclxuICAgICAgICBmcmFtZTogXCJmcmFtZVwiLFxyXG4gICAgICAgIG1vdXNlRG93bjogXCJtb3VzZWRvd25cIixcclxuICAgICAgICBtb3VzZVVwOiBcIm1vdXNldXBcIixcclxuICAgICAgICBtb3VzZURyYWc6IFwibW91c2VkcmFnXCIsXHJcbiAgICAgICAgY2xpY2s6IFwiY2xpY2tcIixcclxuICAgICAgICBkb3VibGVDbGljazogXCJkb3VibGVjbGlja1wiLFxyXG4gICAgICAgIG1vdXNlTW92ZTogXCJtb3VzZW1vdmVcIixcclxuICAgICAgICBtb3VzZUVudGVyOiBcIm1vdXNlZW50ZXJcIixcclxuICAgICAgICBtb3VzZUxlYXZlOiBcIm1vdXNlbGVhdmVcIixcclxuICAgICAgICBrZXl1cDogXCJrZXl1cFwiLFxyXG4gICAgICAgIGtleWRvd246IFwia2V5ZG93blwiXHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmFic3RyYWN0IGNsYXNzIENvbXBvbmVudDxUPiB7XHJcbiAgICBhYnN0cmFjdCByZW5kZXIoZGF0YTogVCk6IFZOb2RlO1xyXG59IiwiXHJcbmludGVyZmFjZSBSZWFjdGl2ZURvbUNvbXBvbmVudCB7XHJcbiAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPjtcclxufVxyXG5cclxubmFtZXNwYWNlIFZEb21IZWxwZXJzIHtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiByZW5kZXJBc0NoaWxkKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHZub2RlOiBWTm9kZSkge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBjb25zdCBwYXRjaGVkID0gcGF0Y2goY2hpbGQsIHZub2RlKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGF0Y2hlZC5lbG0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWFjdGl2ZURvbSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSByZWFjdGl2ZSBjb21wb25lbnQgd2l0aGluIGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlclN0cmVhbShcclxuICAgICAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPixcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50XHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBjb250YWluZXIuaWQ7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQ6IEhUTUxFbGVtZW50IHwgVk5vZGUgPSBjb250YWluZXI7XHJcbiAgICAgICAgY29uc3Qgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGRvbSQuc3Vic2NyaWJlKGRvbSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZG9tKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUVtcHR5Tm9kZXMoZG9tKTtcclxuICAgICAgICAgICAgbGV0IHBhdGNoZWQ6IFZOb2RlO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcGF0Y2hlZCA9IHBhdGNoKGN1cnJlbnQsIGRvbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIHBhdGNoaW5nIGRvbVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudCxcclxuICAgICAgICAgICAgICAgICAgICBkb20sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaWQgJiYgIXBhdGNoZWQuZWxtLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyByZXRhaW4gSURcclxuICAgICAgICAgICAgICAgIHBhdGNoZWQuZWxtLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaGVkO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmVseSByZW1vdmUgZW1wdHkgY2hpbGRyZW4gZnJvbSB0cmVlLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVtb3ZlRW1wdHlOb2Rlcyhub2RlOiBWTm9kZSkge1xyXG4gICAgICAgIGlmKCFub2RlLmNoaWxkcmVuIHx8ICFub2RlLmNoaWxkcmVuLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgbm90RW1wdHkgPSBub2RlLmNoaWxkcmVuLmZpbHRlcihjID0+ICEhYyk7XHJcbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoICE9IG5vdEVtcHR5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJyZW1vdmVkIGVtcHR5IGNoaWxkcmVuIGZyb21cIiwgbm9kZS5jaGlsZHJlbik7XHJcbiAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4gPSBub3RFbXB0eTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRW1wdHlOb2RlcyhjaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIGEgcmVhY3RpdmUgY29tcG9uZW50IHdpdGhpbiBjb250YWluZXIuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXJDb21wb25lbnQoXHJcbiAgICAgICAgY29tcG9uZW50OiBSZWFjdGl2ZURvbUNvbXBvbmVudCxcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50IHwgVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGNvbXBvbmVudC5kb20kLnN1YnNjcmliZShkb20gPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWRvbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIHdpdGhpbiBjb250YWluZXIgd2hlbmV2ZXIgc291cmNlIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsaXZlUmVuZGVyPFQ+KFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZSxcclxuICAgICAgICBzb3VyY2U6IFJ4Lk9ic2VydmFibGU8VD4sXHJcbiAgICAgICAgcmVuZGVyOiAobmV4dDogVCkgPT4gVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gcmVuZGVyKGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHJldHVybjtcclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoKGN1cnJlbnQsIG5vZGUpO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbm5hbWVzcGFjZSBBcHAge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBcHBDb29raWVzIHtcclxuXHJcbiAgICAgICAgc3RhdGljIFlFQVIgPSAzNjU7XHJcbiAgICAgICAgc3RhdGljIEJST1dTRVJfSURfS0VZID0gXCJicm93c2VySWRcIjtcclxuICAgICAgICBzdGF0aWMgTEFTVF9TQVZFRF9TS0VUQ0hfSURfS0VZID0gXCJsYXN0U2F2ZWRTa2V0Y2hJZFwiO1xyXG5cclxuICAgICAgICBnZXQgbGFzdFNhdmVkU2tldGNoSWQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzLmdldChBcHBDb29raWVzLkxBU1RfU0FWRURfU0tFVENIX0lEX0tFWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgbGFzdFNhdmVkU2tldGNoSWQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBDb29raWVzLnNldChBcHBDb29raWVzLkxBU1RfU0FWRURfU0tFVENIX0lEX0tFWSwgdmFsdWUsIHsgZXhwaXJlczogQXBwQ29va2llcy5ZRUFSIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGJyb3dzZXJJZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXMuZ2V0KEFwcENvb2tpZXMuQlJPV1NFUl9JRF9LRVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGJyb3dzZXJJZCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIENvb2tpZXMuc2V0KEFwcENvb2tpZXMuQlJPV1NFUl9JRF9LRVksIHZhbHVlLCB7IGV4cGlyZXM6IEFwcENvb2tpZXMuWUVBUiB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBBcHAge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBcHBNb2R1bGUge1xyXG5cclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgZWRpdG9yTW9kdWxlOiBTa2V0Y2hFZGl0b3IuU2tldGNoRWRpdG9yTW9kdWxlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgICAgIFBhcGVySGVscGVycy5zaG91bGRMb2dJbmZvID0gZmFsc2U7ICAgICAgIFxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IG5ldyBTdG9yZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRvck1vZHVsZSA9IG5ldyBTa2V0Y2hFZGl0b3IuU2tldGNoRWRpdG9yTW9kdWxlKHRoaXMuc3RvcmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzdGFydCgpIHsgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmVkaXRvck1vZHVsZS5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5pbnRlcmZhY2UgV2luZG93IHtcclxuICAgIGFwcDogQXBwLkFwcE1vZHVsZTtcclxufSIsIlxyXG5uYW1lc3BhY2UgQXBwIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQXBwUm91dGVyIGV4dGVuZHMgUm91dGVyNSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcihbXHJcbiAgICAgICAgICAgICAgICBuZXcgUm91dGVOb2RlKFwiaG9tZVwiLCBcIi9cIiksXHJcbiAgICAgICAgICAgICAgICBuZXcgUm91dGVOb2RlKFwic2tldGNoXCIsIFwiL3NrZXRjaC86c2tldGNoSWRcIiksIC8vIDxbYS1mQS1GMC05XXsxNH0+XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlSGFzaDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFJvdXRlOiBcImhvbWVcIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvL3RoaXMudXNlUGx1Z2luKGxvZ2dlclBsdWdpbigpKVxyXG4gICAgICAgICAgICB0aGlzLnVzZVBsdWdpbihsaXN0ZW5lcnNQbHVnaW4uZGVmYXVsdCgpKVxyXG4gICAgICAgICAgICAgICAgLnVzZVBsdWdpbihoaXN0b3J5UGx1Z2luLmRlZmF1bHQoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b1NrZXRjaEVkaXRvcihza2V0Y2hJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGUoXCJza2V0Y2hcIiwgeyBza2V0Y2hJZDogc2tldGNoSWQgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgc3RhdGUoKSB7XHJcbiAgICAgICAgICAgIC8vIGNvdWxkIGRvIHJvdXRlIHZhbGlkYXRpb24gc29tZXdoZXJlXHJcbiAgICAgICAgICAgIHJldHVybiA8QXBwUm91dGVTdGF0ZT48YW55PnRoaXMuZ2V0U3RhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBBcHBSb3V0ZVN0YXRlIHtcclxuICAgICAgICBuYW1lOiBcImhvbWVcInxcInNrZXRjaFwiLFxyXG4gICAgICAgIHBhcmFtcz86IHtcclxuICAgICAgICAgICAgc2tldGNoSWQ/OiBzdHJpbmdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBhdGg/OiBzdHJpbmdcclxuICAgIH1cclxuXHJcbn0iLCJcclxubmFtZXNwYWNlIEFwcCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN0b3JlIHtcclxuXHJcbiAgICAgICAgc3RhdGU6IEFwcFN0YXRlO1xyXG4gICAgICAgIGFjdGlvbnM6IEFjdGlvbnM7XHJcbiAgICAgICAgZXZlbnRzOiBFdmVudHM7XHJcblxyXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBBcHBSb3V0ZXI7XHJcbiAgICAgICAgcHJpdmF0ZSBjb29raWVzOiBBcHBDb29raWVzO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIgPSBuZXcgQXBwUm91dGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IG5ldyBBY3Rpb25zKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IEV2ZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMgPSBuZXcgQXBwQ29va2llcygpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5zdGFydFJvdXRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRBY3Rpb25IYW5kbGVycygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdFN0YXRlKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gbmV3IEFwcFN0YXRlKHRoaXMuY29va2llcywgdGhpcy5yb3V0ZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpbml0QWN0aW9uSGFuZGxlcnMoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5lZGl0b3JMb2FkZWRTa2V0Y2guc3ViKHNrZXRjaElkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwic2tldGNoXCIsIHsgc2tldGNoSWQgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLmVkaXRvclNhdmVkU2tldGNoLnN1YihpZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvb2tpZXMubGFzdFNhdmVkU2tldGNoSWQgPSBpZDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3RhcnRSb3V0ZXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyLnN0YXJ0KChlcnIsIHN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5yb3V0ZUNoYW5nZWQuZGlzcGF0Y2goc3RhdGUpOyBcclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJyb3V0ZXIgZXJyb3JcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcImhvbWVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFwcFN0YXRlIHtcclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIGNvb2tpZXM6IEFwcENvb2tpZXM7XHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IEFwcFJvdXRlcjsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29va2llczogQXBwQ29va2llcywgcm91dGVyOiBBcHBSb3V0ZXIpe1xyXG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMgPSBjb29raWVzO1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlciA9IHJvdXRlcjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGJyb3dzZXJJZCA9IHRoaXMuY29va2llcy5icm93c2VySWQgfHwgRnJhbWV3b3JrLm5ld2lkKCk7XHJcbiAgICAgICAgICAgIC8vIGluaXQgb3IgcmVmcmVzaCBjb29raWVcclxuICAgICAgICAgICAgdGhpcy5jb29raWVzLmJyb3dzZXJJZCA9IGJyb3dzZXJJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0IGxhc3RTYXZlZFNrZXRjaElkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb29raWVzLmxhc3RTYXZlZFNrZXRjaElkOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0IGJyb3dzZXJJZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29va2llcy5icm93c2VySWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdldCByb3V0ZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm91dGVyLnN0YXRlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQWN0aW9ucyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcclxuICAgICAgICBlZGl0b3JMb2FkZWRTa2V0Y2ggPSB0aGlzLnRvcGljPHN0cmluZz4oXCJlZGl0b3JMb2FkZWRTa2V0Y2hcIik7XHJcbiAgICAgICAgZWRpdG9yU2F2ZWRTa2V0Y2ggPSB0aGlzLnRvcGljPHN0cmluZz4oXCJlZGl0b3JTYXZlZFNrZXRjaFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRXZlbnRzIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWwge1xyXG4gICAgICAgIHJvdXRlQ2hhbmdlZCA9IHRoaXMudG9waWM8QXBwUm91dGVTdGF0ZT4oXCJyb3V0ZUNoYW5nZWRcIik7XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIERlbW8ge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEZW1vTW9kdWxlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgcGFwZXIuc2V0dXAoY2FudmFzKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGFydCgpIHtcclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHBhcGVyLnZpZXc7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYXJzZWRGb250cyA9IG5ldyBGb250U2hhcGUuUGFyc2VkRm9udHMoKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgcGFyc2VkRm9udHMuZ2V0KFwiZm9udHMvUm9ib3RvLTUwMC50dGZcIikudGhlbiggcGFyc2VkID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBwYXJzZWQuZm9udC5nZXRQYXRoKFwiU05BUFwiLCAwLCAwLCAxMjgpLnRvUGF0aERhdGEoKTtcclxuICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgY29udGVudC5wb3NpdGlvbiA9IGNvbnRlbnQucG9zaXRpb24uYWRkKDUwKTtcclxuICAgICAgICAgICAgICAgICBjb250ZW50LmZpbGxDb2xvciA9IFwibGlnaHRncmF5XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gcGFwZXIuUGF0aC5FbGxpcHNlKG5ldyBwYXBlci5SZWN0YW5nbGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsMCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNpemUoNjAwLCAzMDApXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbi5yb3RhdGUoMzApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZWdpb24uYm91bmRzLmNlbnRlciA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgcmVnaW9uLnN0cm9rZUNvbG9yID0gXCJsaWdodGdyYXlcIjtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbi5zdHJva2VXaWR0aCA9IDM7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc25hcFBhdGggPSBuZXcgRm9udFNoYXBlLlNuYXBQYXRoKHJlZ2lvbiwgY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICBzbmFwUGF0aC5jb3JuZXJzID0gWzAsIDAuNCwgMC40NSwgMC45NV07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZpZXcub25GcmFtZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzbmFwUGF0aC5zbGlkZSgwLjAwMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc25hcFBhdGgudXBkYXRlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2aWV3LmRyYXcoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBCdWlsZGVyIHtcclxuXHJcbiAgICAgICAgc3RhdGljIGRlZmF1bHRGb250VXJsID0gXCJmb250cy9Sb2JvdG8tNTAwLnR0ZlwiO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSA8VGVtcGxhdGVVSUNvbnRleHQ+e1xyXG4gICAgICAgICAgICAgICAgZ2V0IGZvbnRDYXRhbG9nKCkgeyByZXR1cm4gc3RvcmUuZm9udENhdGFsb2cgfSxcclxuICAgICAgICAgICAgICAgIHJlbmRlckRlc2lnbjogKGRlc2lnbiwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5yZW5kZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNpZ246IGRlc2lnbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVGb250Q2hvb3NlcjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVGVtcGxhdGVGb250Q2hvb3NlcihzdG9yZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGFzeW5jIG9ic2VydmVcclxuICAgICAgICAgICAgc3RvcmUudGVtcGxhdGUkLm9ic2VydmVPbihSeC5TY2hlZHVsZXIuZGVmYXVsdCkuc3Vic2NyaWJlKHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudENvbnRlbnQgPSBzdG9yZS5kZXNpZ24uY29udGVudDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RlbXBsYXRlU3RhdGUgPSB0LmNyZWF0ZU5ldyhjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Q29udGVudCAmJiBjdXJyZW50Q29udGVudC50ZXh0ICYmIGN1cnJlbnRDb250ZW50LnRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VGVtcGxhdGVTdGF0ZS5kZXNpZ24uY29udGVudCA9IGN1cnJlbnRDb250ZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RvcmUuc2V0VGVtcGxhdGVTdGF0ZShuZXdUZW1wbGF0ZVN0YXRlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkb20kID0gc3RvcmUudGVtcGxhdGVTdGF0ZSRcclxuICAgICAgICAgICAgICAgIC5tYXAodHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250cm9scztcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9scyA9IHN0b3JlLnRlbXBsYXRlLmNyZWF0ZVVJKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGNhbGxpbmcgJHtzdG9yZS50ZW1wbGF0ZS5uYW1lfS5jcmVhdGVVSWAsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY29udHJvbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy52YWx1ZSQuc3Vic2NyaWJlKGQgPT4gc3RvcmUudXBkYXRlVGVtcGxhdGVTdGF0ZShkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVzID0gY29udHJvbHMubWFwKGMgPT4gYy5jcmVhdGVOb2RlKHRzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdm5vZGUgPSBoKFwiZGl2I3RlbXBsYXRlQ29udHJvbHNcIiwge30sIG5vZGVzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm5vZGU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBNb2R1bGUge1xyXG4gICAgICAgIHN0b3JlOiBTdG9yZTtcclxuICAgICAgICBidWlsZGVyOiBCdWlsZGVyO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgYnVpbGRlckNvbnRhaW5lcjogSFRNTEVsZW1lbnQsXHJcbiAgICAgICAgICAgIHByZXZpZXdDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxyXG4gICAgICAgICAgICByZW5kZXJDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxyXG4gICAgICAgICAgICBiZWxvd0NhbnZhczogSFRNTEVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoKTtcclxuICAgICAgICAgICAgdGhpcy5idWlsZGVyID0gbmV3IEJ1aWxkZXIoYnVpbGRlckNvbnRhaW5lciwgdGhpcy5zdG9yZSk7XHJcblxyXG4gICAgICAgICAgICBuZXcgUHJldmlld0NhbnZhcyhwcmV2aWV3Q2FudmFzLCB0aGlzLnN0b3JlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUudGVtcGxhdGVTdGF0ZSQuc3Vic2NyaWJlKHRzID0+IGNvbnNvbGUubG9nKFwidGVtcGxhdGVTdGF0ZVwiLCB0cykpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnRlbXBsYXRlJC5zdWJzY3JpYmUodCA9PiBjb25zb2xlLmxvZyhcInRlbXBsYXRlXCIsIHQpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIG5ldyBTaGFyZU9wdGlvbnNVSShiZWxvd0NhbnZhcywgdGhpcy5zdG9yZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGFydCgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5pbml0KCkudGhlbihzID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuc2V0VGVtcGxhdGUoXCJEaWNrZW5zXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGVUZW1wbGF0ZVN0YXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHsgZGVzaWduOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlRoZSByYWluIGluIFNwYWluIGZhbGxzIG1haW5seSBpbiB0aGUgcGxhaW5cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFByZXZpZXdDYW52YXMge1xyXG5cclxuICAgICAgICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgIHN0b3JlOiBTdG9yZTtcclxuICAgICAgICBidWlsdERlc2lnbjogcGFwZXIuSXRlbTtcclxuICAgICAgICBjb250ZXh0OiBUZW1wbGF0ZUJ1aWxkQ29udGV4dDtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsYXN0UmVjZWl2ZWQ6IERlc2lnbjtcclxuICAgICAgICBwcml2YXRlIHJlbmRlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuICAgICAgICBwcml2YXRlIHdvcmtzcGFjZTogcGFwZXIuR3JvdXA7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcblxyXG4gICAgICAgICAgICBwYXBlci5zZXR1cChjYW52YXMpO1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3QgPSBwYXBlci5wcm9qZWN0O1xyXG4gICAgICAgICAgICB0aGlzLndvcmtzcGFjZSA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG5cclxuICAgICAgICAgICAgRm9udFNoYXBlLlZlcnRpY2FsQm91bmRzU3RyZXRjaFBhdGgucG9pbnRzUGVyUGF0aCA9IDQwMDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgIGdldEZvbnQ6IHNwZWNpZmllciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVybDogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3BlY2lmaWVyIHx8ICFzcGVjaWZpZXIuZmFtaWx5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IEJ1aWxkZXIuZGVmYXVsdEZvbnRVcmw7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gc3RvcmUuZm9udENhdGFsb2cuZ2V0VXJsKHNwZWNpZmllci5mYW1pbHksIHNwZWNpZmllci52YXJpYW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgQnVpbGRlci5kZWZhdWx0Rm9udFVybDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLnBhcnNlZEZvbnRzLmdldCh1cmwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQuZm9udCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBzdG9yZS50ZW1wbGF0ZVN0YXRlJC5zdWJzY3JpYmUoKHRzOiBUZW1wbGF0ZVN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IHByb2Nlc3Mgb25lIHJlcXVlc3QgYXQgYSB0aW1lXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBhbHdheXMgcHJvY2VzcyB0aGUgbGFzdCByZWNlaXZlZFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFJlY2VpdmVkID0gdHMuZGVzaWduO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcih0cy5kZXNpZ24pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5kb3dubG9hZFBOR1JlcXVlc3RlZC5zdWIoKCkgPT4gdGhpcy5kb3dubG9hZFBORygpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZG93bmxvYWRQTkcoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdG9yZS5kZXNpZ24uY29udGVudCBcclxuICAgICAgICAgICAgICAgIHx8ICF0aGlzLnN0b3JlLmRlc2lnbi5jb250ZW50LnRleHQgXHJcbiAgICAgICAgICAgICAgICB8fCAhdGhpcy5zdG9yZS5kZXNpZ24uY29udGVudC50ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEhhbGYgb2YgbWF4IERQSSBwcm9kdWNlcyBhcHByb3ggNDIwMHg0MjAwLlxyXG4gICAgICAgICAgICBjb25zdCBkcGkgPSAwLjUgKiBQYXBlckhlbHBlcnMuZ2V0TWF4RXhwb3J0RHBpKHRoaXMud29ya3NwYWNlLmJvdW5kcy5zaXplKTtcclxuICAgICAgICAgICAgY29uc3QgcmFzdGVyID0gdGhpcy53b3Jrc3BhY2UucmFzdGVyaXplKGRwaSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gcmFzdGVyLnRvRGF0YVVSTCgpO1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IEZzdHguRnJhbWV3b3JrLmNyZWF0ZUZpbGVOYW1lKHRoaXMuc3RvcmUuZGVzaWduLmNvbnRlbnQudGV4dCwgNDAsIFwicG5nXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBibG9iID0gRG9tSGVscGVycy5kYXRhVVJMVG9CbG9iKGRhdGEpO1xyXG4gICAgICAgICAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJMYXN0UmVjZWl2ZWQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxhc3RSZWNlaXZlZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVuZGVyaW5nID0gdGhpcy5sYXN0UmVjZWl2ZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RSZWNlaXZlZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcihyZW5kZXJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHJlbmRlcihkZXNpZ246IERlc2lnbik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInJlbmRlciBpcyBpbiBwcm9ncmVzc1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHBhcGVyLnByb2plY3QuYWN0aXZlTGF5ZXIucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmUudGVtcGxhdGUuYnVpbGQoZGVzaWduLCB0aGlzLmNvbnRleHQpLnRoZW4oaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHJlbmRlciByZXN1bHQgZnJvbVwiLCBkZXNpZ24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmZpdEJvdW5kcyh0aGlzLnByb2plY3Qudmlldy5ib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYm91bmRzLnBvaW50ID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLnRvcExlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2UuYWRkQ2hpbGQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBhbnkgcmVjZWl2ZWQgd2hpbGUgcmVuZGVyaW5nIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJMYXN0UmVjZWl2ZWQoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHJlbmRlcmluZyBkZXNpZ25cIiwgZXJyLCBkZXNpZ24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59IiwiLy8gbmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuLy8gICAgIGV4cG9ydCBjbGFzcyBSZW5kZXJDYW52YXMge1xyXG5cclxuLy8gICAgICAgICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4vLyAgICAgICAgIHN0b3JlOiBTdG9yZTtcclxuLy8gICAgICAgICBidWlsdERlc2lnbjogcGFwZXIuSXRlbTtcclxuXHJcbi8vICAgICAgICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgc3RvcmU6IFN0b3JlKSB7XHJcbi8vICAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuLy8gICAgICAgICAgICAgcGFwZXIuc2V0dXAoY2FudmFzKTtcclxuICAgICAgICAgICAgXHJcbi8vICAgICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSB7XHJcbi8vICAgICAgICAgICAgICAgICBnZXRGb250OiBzcGVjaWZpZXIgPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGxldCB1cmw6IHN0cmluZztcclxuLy8gICAgICAgICAgICAgICAgICAgICBpZiAoIXNwZWNpZmllciB8fCAhc3BlY2lmaWVyLmZhbWlseSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBCdWlsZGVyLmRlZmF1bHRGb250VXJsO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IHN0b3JlLmZvbnRDYXRhbG9nLmdldFVybChzcGVjaWZpZXIuZmFtaWx5LCBzcGVjaWZpZXIudmFyaWFudClcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IEJ1aWxkZXIuZGVmYXVsdEZvbnRVcmw7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZS5wYXJzZWRGb250cy5nZXQodXJsKVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0LmZvbnQpO1xyXG4vLyAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICB9O1xyXG5cclxuLy8gICAgICAgICAgICAgY29uc3QgY29udHJvbGxlZCA9IHN0b3JlLnJlbmRlciQuY29udHJvbGxlZCgpO1xyXG4vLyAgICAgICAgICAgICBjb250cm9sbGVkLnN1YnNjcmliZShyZXF1ZXN0ID0+IHtcclxuLy8gICAgICAgICAgICAgICAgIGxldCBkZXNpZ24gPSA8RGVzaWduPl8uY2xvbmUodGhpcy5zdG9yZS5kZXNpZ24pO1xyXG4vLyAgICAgICAgICAgICAgICAgZGVzaWduID0gXy5tZXJnZShkZXNpZ24sIHJlcXVlc3QuZGVzaWduKTtcclxuLy8gICAgICAgICAgICAgICAgIHBhcGVyLnByb2plY3QuYWN0aXZlTGF5ZXIucmVtb3ZlQ2hpbGRyZW4oKTtcclxuLy8gICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUudGVtcGxhdGUuYnVpbGQoZGVzaWduLCBjb250ZXh0KS50aGVuKGl0ZW0gPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhc3RlciA9IHBhcGVyLnByb2plY3QuYWN0aXZlTGF5ZXIucmFzdGVyaXplKDcyLCBmYWxzZSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgaXRlbS5yZW1vdmUoKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LmNhbGxiYWNrKHJhc3Rlci50b0RhdGFVUkwoKSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlZC5yZXF1ZXN0KDEpO1xyXG4vLyAgICAgICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAgICAgIChlcnIpID0+IHtcclxuLy8gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJlcnJvciBvbiB0ZW1wbGF0ZS5idWlsZFwiLCBlcnIpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZWQucmVxdWVzdCgxKTtcclxuLy8gICAgICAgICAgICAgICAgIH0pO1xyXG4vLyAgICAgICAgICAgICB9KTtcclxuLy8gICAgICAgICAgICAgY29udHJvbGxlZC5yZXF1ZXN0KDEpO1xyXG5cclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgfVxyXG4vLyB9IiwibW9kdWxlIFNrZXRjaEJ1aWxkZXIge1xyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgU2hhcmVPcHRpb25zVUkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSl7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gUnguT2JzZXJ2YWJsZS5qdXN0KG51bGwpO1xyXG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oc3RhdGUubWFwKCgpID0+IHRoaXMuY3JlYXRlRG9tKCkpLCBjb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjcmVhdGVEb20oKTogVk5vZGUge1xyXG4gICAgICAgICAgICByZXR1cm4gaChcImJ1dHRvbi5idG4uYnRuLXByaW1hcnlcIiwge1xyXG4gICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5kb3dubG9hZFBORygpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFtcIkRvd25sb2FkXCJdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3RvcmUge1xyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRpYWxpemVkOiBib29sZWFuO1xyXG4gICAgICAgIHByaXZhdGUgX3RlbXBsYXRlJCA9IG5ldyBSeC5TdWJqZWN0PFRlbXBsYXRlPigpO1xyXG4gICAgICAgIHByaXZhdGUgX3RlbXBsYXRlU3RhdGUkID0gbmV3IFJ4LlN1YmplY3Q8VGVtcGxhdGVTdGF0ZT4oKTtcclxuICAgICAgICBwcml2YXRlIF9yZW5kZXIkID0gbmV3IFJ4LlN1YmplY3Q8UmVuZGVyUmVxdWVzdD4oKTtcclxuICAgICAgICBwcml2YXRlIF9zdGF0ZToge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZT86IFRlbXBsYXRlO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVN0YXRlOiBUZW1wbGF0ZVN0YXRlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIF9ldmVudHNDaGFubmVsID0gbmV3IFR5cGVkQ2hhbm5lbC5DaGFubmVsKCk7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3BhcnNlZEZvbnRzOiBGb250U2hhcGUuUGFyc2VkRm9udHM7XHJcbiAgICAgICAgcHJpdmF0ZSBfZm9udENhdGFsb2c6IEZvbnRTaGFwZS5Gb250Q2F0YWxvZztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVTdGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbjoge31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3BhcnNlZEZvbnRzID0gbmV3IEZvbnRTaGFwZS5QYXJzZWRGb250cygoKSA9PiB7IH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXZlbnRzID0ge1xyXG4gICAgICAgICAgICBkb3dubG9hZFBOR1JlcXVlc3RlZDogdGhpcy5fZXZlbnRzQ2hhbm5lbC50b3BpYzx2b2lkPihcImRvd25sb2FkUE5HUmVxdWVzdGVkXCIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgc3RhdGUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBwYXJzZWRGb250cygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlZEZvbnRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGZvbnRDYXRhbG9nKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udENhdGFsb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdGVtcGxhdGVTdGF0ZSQoKTogUnguT2JzZXJ2YWJsZTxUZW1wbGF0ZVN0YXRlPiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZVN0YXRlJDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB0ZW1wbGF0ZSQoKTogUnguT2JzZXJ2YWJsZTxUZW1wbGF0ZT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGUkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHJlbmRlciQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXIkOy8vLm9ic2VydmVPbihSeC5TY2hlZHVsZXIuZGVmYXVsdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXRlLnRlbXBsYXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGRlc2lnbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZSAmJiB0aGlzLnN0YXRlLnRlbXBsYXRlU3RhdGUuZGVzaWduO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCgpOiBQcm9taXNlPFN0b3JlPiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaW5pdGlhbGl6ZWQpe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3RvcmUgaXMgYWxyZWFkeSBpbml0YWxpemVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxTdG9yZT4oY2FsbGJhY2sgPT4ge1xyXG4gICAgICAgICAgICAgICAgRm9udFNoYXBlLkZvbnRDYXRhbG9nLmZyb21Mb2NhbChcImZvbnRzL2dvb2dsZS1mb250cy5qc29uXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oYyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRDYXRhbG9nID0gYztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG93bmxvYWRQTkcoKXtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuZG93bmxvYWRQTkdSZXF1ZXN0ZWQuZGlzcGF0Y2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRlbXBsYXRlKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGU6IFRlbXBsYXRlO1xyXG4gICAgICAgICAgICBpZiAoL0RpY2tlbnMvaS50ZXN0KG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IG5ldyBTa2V0Y2hCdWlsZGVyLlRlbXBsYXRlcy5EaWNrZW5zKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHRlbXBsYXRlICR7bmFtZX1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnRlbXBsYXRlID0gdGVtcGxhdGU7XHJcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlJC5vbk5leHQodGVtcGxhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0RGVzaWduKHZhbHVlOiBEZXNpZ24pIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRUZW1wbGF0ZVN0YXRlKHsgZGVzaWduOiB2YWx1ZSB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXBkYXRlVGVtcGxhdGVTdGF0ZShjaGFuZ2U6IFRlbXBsYXRlU3RhdGVDaGFuZ2UpIHtcclxuICAgICAgICAgICAgXy5tZXJnZSh0aGlzLnN0YXRlLnRlbXBsYXRlU3RhdGUsIGNoYW5nZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBkZXNpZ24gPSB0aGlzLnN0YXRlLnRlbXBsYXRlU3RhdGUuZGVzaWduO1xyXG4gICAgICAgICAgICBpZihkZXNpZ24gJiYgZGVzaWduLmZvbnQgJiYgZGVzaWduLmZvbnQuZmFtaWx5ICYmICFkZXNpZ24uZm9udC52YXJpYW50KSB7XHJcbiAgICAgICAgICAgICAgIC8vIHNldCBkZWZhdWx0IHZhcmlhbnRcclxuICAgICAgICAgICAgICAgIGRlc2lnbi5mb250LnZhcmlhbnQgPSBGb250U2hhcGUuRm9udENhdGFsb2cuZGVmYXVsdFZhcmlhbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9udENhdGFsb2cuZ2V0UmVjb3JkKGRlc2lnbi5mb250LmZhbWlseSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVN0YXRlJC5vbk5leHQodGhpcy5zdGF0ZS50ZW1wbGF0ZVN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2V0VGVtcGxhdGVTdGF0ZShzdGF0ZTogVGVtcGxhdGVTdGF0ZSl7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlLnRlbXBsYXRlU3RhdGUgPSBzdGF0ZTtcclxuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVTdGF0ZSQub25OZXh0KHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbmRlcihyZXF1ZXN0OiBSZW5kZXJSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlciQub25OZXh0KHJlcXVlc3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlIHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZztcclxuICAgICAgICBpbWFnZTogc3RyaW5nO1xyXG4gICAgICAgIGNyZWF0ZU5ldyhjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IFRlbXBsYXRlU3RhdGU7XHJcbiAgICAgICAgY3JlYXRlVUkoY29udGV4dDogVGVtcGxhdGVVSUNvbnRleHQpOiBCdWlsZGVyQ29udHJvbFtdO1xyXG4gICAgICAgIGJ1aWxkKGRlc2lnbjogRGVzaWduLCBjb250ZXh0OiBUZW1wbGF0ZUJ1aWxkQ29udGV4dCk6IFByb21pc2U8cGFwZXIuSXRlbT47XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZVVJQ29udGV4dCB7XHJcbiAgICAgICAgcmVuZGVyRGVzaWduKGRlc2lnbjogRGVzaWduLCBjYWxsYmFjazogKGltYWdlRGF0YVVybDogc3RyaW5nKSA9PiB2b2lkKTtcclxuICAgICAgICBmb250Q2F0YWxvZzogRm9udFNoYXBlLkZvbnRDYXRhbG9nO1xyXG4gICAgICAgIGNyZWF0ZUZvbnRDaG9vc2VyKCk6IEJ1aWxkZXJDb250cm9sO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlQnVpbGRDb250ZXh0IHtcclxuICAgICAgICBnZXRGb250KGRlc2M6IEZvbnRTaGFwZS5Gb250U3BlY2lmaWVyKTogUHJvbWlzZTxvcGVudHlwZS5Gb250PjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZVN0YXRlIHtcclxuICAgICAgICBkZXNpZ246IERlc2lnbjtcclxuICAgICAgICBmb250Q2F0ZWdvcnk/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZVN0YXRlQ2hhbmdlIHtcclxuICAgICAgICBkZXNpZ24/OiBEZXNpZ247XHJcbiAgICAgICAgZm9udENhdGVnb3J5Pzogc3RyaW5nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIERlc2lnbiB7XHJcbiAgICAgICAgY29udGVudD86IGFueTtcclxuICAgICAgICBzaGFwZT86IHN0cmluZztcclxuICAgICAgICBmb250PzogRm9udFNoYXBlLkZvbnRTcGVjaWZpZXI7XHJcbiAgICAgICAgcGFsZXR0ZT86IERlc2lnblBhbGV0dGU7XHJcbiAgICAgICAgc2VlZD86IG51bWJlcjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBEZXNpZ25QYWxldHRlIHtcclxuICAgICAgICBjb2xvcj86IHN0cmluZztcclxuICAgICAgICBpbnZlcnQ/OiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVzaWduQ2hhbmdlIGV4dGVuZHMgRGVzaWdue1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmRlclJlcXVlc3Qge1xyXG4gICAgICAgIGRlc2lnbjogRGVzaWduO1xyXG4gICAgICAgIGFyZWE/OiBudW1iZXI7XHJcbiAgICAgICAgY2FsbGJhY2s6IChpbWFnZURhdGFVcmw6IHN0cmluZykgPT4gdm9pZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCdWlsZGVyQ29udHJvbCB7XHJcbiAgICAgICAgdmFsdWUkOiBSeC5PYnNlcnZhYmxlPFRlbXBsYXRlU3RhdGVDaGFuZ2U+O1xyXG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU6IFRlbXBsYXRlU3RhdGUpOiBWTm9kZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBWYWx1ZUNvbnRyb2w8VD4ge1xyXG4gICAgICAgIHZhbHVlJDogUnguT2JzZXJ2YWJsZTxUPjtcclxuICAgICAgICBjcmVhdGVOb2RlKHZhbHVlPzogVCk6IFZOb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uQ2hvb3NlcjxUPiB7XHJcbiAgICAgICAgdmFsdWUkOiBSeC5PYnNlcnZhYmxlPFQ+O1xyXG4gICAgICAgIGNyZWF0ZU5vZGUoY2hvaWNlczogVFtdLCB2YWx1ZT86IFQpOiBWTm9kZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gZXhwb3J0IGludGVyZmFjZSBWTm9kZUNob29zZXIge1xyXG4gICAgLy8gICAgIGNyZWF0ZU5vZGUoY2hvaWNlczogVk5vZGVbXSwgY2hvc2VuS2V5OiBzdHJpbmcpOiBWTm9kZTtcclxuICAgIC8vICAgICBjaG9zZW4kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPjtcclxuICAgIC8vIH1cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuICAgIFxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBDb250cm9sSGVscGVycyB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgIGV4cG9ydCBmdW5jdGlvbiBjaG9vc2VyPFQ+KFxyXG4gICAgICAgICAgICAgY2hvaWNlczogQ2hvaWNlW10pXHJcbiAgICAgICAgICAgICA6IFZOb2Rle1xyXG4gICAgICAgICAgICByZXR1cm4gaChcInVsLmNob29zZXJcIixcclxuICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlcy5tYXAoY2hvaWNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaChcImxpLmNob2ljZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3NlbjogY2hvaWNlLmNob3NlblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvaWNlLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2hvaWNlLm5vZGVdKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2hvaWNlIHtcclxuICAgICAgICAgICAgIG5vZGU6IFZOb2RlLCBcclxuICAgICAgICAgICAgIGNob3Nlbj86IGJvb2xlYW4sIFxyXG4gICAgICAgICAgICAgY2FsbGJhY2s/OiAoKSA9PiB2b2lkXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEZvbnRDaG9vc2VyIGltcGxlbWVudHMgVmFsdWVDb250cm9sPEZvbnRDaG9vc2VyU3RhdGU+IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBmb250Q2F0YWxvZzogRm9udFNoYXBlLkZvbnRDYXRhbG9nO1xyXG4gICAgICAgIHByaXZhdGUgX3ZhbHVlJCA9IG5ldyBSeC5TdWJqZWN0PEZvbnRDaG9vc2VyU3RhdGU+KCk7XHJcblxyXG4gICAgICAgIG1heEZhbWlsaWVzID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoZm9udENhdGFsb2c6IEZvbnRTaGFwZS5Gb250Q2F0YWxvZykge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnRDYXRhbG9nID0gZm9udENhdGFsb2c7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBwcmVsb2FkRmFtaWxpZXMgPSB0aGlzLmZvbnRDYXRhbG9nLmdldENhdGVnb3JpZXMoKVxyXG4gICAgICAgICAgICAgICAgLm1hcChjID0+IGZvbnRDYXRhbG9nLmdldEZhbWlsaWVzKGMpWzBdKTtcclxuICAgICAgICAgICAgRm9udFNoYXBlLkZvbnRDYXRhbG9nLmxvYWRQcmV2aWV3U3Vic2V0cyhwcmVsb2FkRmFtaWxpZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHZhbHVlJCgpOiBSeC5PYnNlcnZhYmxlPEZvbnRDaG9vc2VyU3RhdGU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlJDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU/OiBGb250Q2hvb3NlclN0YXRlKTogVk5vZGUge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZHJlbjogVk5vZGVbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChoKFwiaDNcIiwgW1wiRm9udCBDYXRlZ29yaWVzXCJdKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhdGVnb3JpZXMgPSB0aGlzLmZvbnRDYXRhbG9nLmdldENhdGVnb3JpZXMoKTtcclxuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlDaG9pY2VzID0gY2F0ZWdvcmllcy5tYXAoY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhdGVnb3J5RmFtaWxpZXMgPSB0aGlzLmZvbnRDYXRhbG9nLmdldEZhbWlsaWVzKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1heEZhbWlsaWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlGYW1pbGllcyA9IGNhdGVnb3J5RmFtaWxpZXMuc2xpY2UoMCwgdGhpcy5tYXhGYW1pbGllcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmaXJzdEZhbWlseSA9IGNhdGVnb3J5RmFtaWxpZXNbMF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gPENvbnRyb2xIZWxwZXJzLkNob2ljZT57XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZTogaChcInNwYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IEZvbnRIZWxwZXJzLmdldENzc1N0eWxlKGZpcnN0RmFtaWx5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2F0ZWdvcnldKSxcclxuICAgICAgICAgICAgICAgICAgICBjaG9zZW46IHZhbHVlLmNhdGVnb3J5ID09PSBjYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGb250U2hhcGUuRm9udENhdGFsb2cubG9hZFByZXZpZXdTdWJzZXRzKGNhdGVnb3J5RmFtaWxpZXMpOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUkLm9uTmV4dCh7IGNhdGVnb3J5LCBmYW1pbHk6IGZpcnN0RmFtaWx5IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goQ29udHJvbEhlbHBlcnMuY2hvb3NlcihjYXRlZ29yeUNob2ljZXMpKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5jYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChoKFwiaDNcIiwge30sIFtcIkZvbnRzXCJdKSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZmFtaWxpZXMgPSB0aGlzLmZvbnRDYXRhbG9nLmdldEZhbWlsaWVzKHZhbHVlLmNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1heEZhbWlsaWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmFtaWxpZXMgPSBmYW1pbGllcy5zbGljZSgwLCB0aGlzLm1heEZhbWlsaWVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGZhbWlseU9wdGlvbnMgPSBmYW1pbGllcy5tYXAoZmFtaWx5ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gPENvbnRyb2xIZWxwZXJzLkNob2ljZT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGgoXCJzcGFuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IEZvbnRIZWxwZXJzLmdldENzc1N0eWxlKGZhbWlseSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZmFtaWx5XSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob3NlbjogdmFsdWUuZmFtaWx5ID09PSBmYW1pbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLl92YWx1ZSQub25OZXh0KHsgZmFtaWx5LCB2YXJpYW50OiBcIlwiIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKENvbnRyb2xIZWxwZXJzLmNob29zZXIoZmFtaWx5T3B0aW9ucykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodmFsdWUuZmFtaWx5KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YXJpYW50cyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0VmFyaWFudHModmFsdWUuZmFtaWx5KTtcclxuICAgICAgICAgICAgICAgIGlmICh2YXJpYW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChoKFwiaDNcIiwge30sIFtcIkZvbnQgU3R5bGVzXCJdKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhbnRPcHRpb25zID0gdmFyaWFudHMubWFwKHZhcmlhbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPENvbnRyb2xIZWxwZXJzLkNob2ljZT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwic3BhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IEZvbnRIZWxwZXJzLmdldENzc1N0eWxlKHZhbHVlLmZhbWlseSwgdmFyaWFudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt2YXJpYW50XSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9zZW46IHZhbHVlLnZhcmlhbnQgPT09IHZhcmlhbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5fdmFsdWUkLm9uTmV4dCh7IHZhcmlhbnQgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goQ29udHJvbEhlbHBlcnMuY2hvb3Nlcih2YXJpYW50T3B0aW9ucykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gaChcImRpdi5mb250Q2hvb3NlclwiLCB7fSwgY2hpbGRyZW4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEZvbnRDaG9vc2VyU3RhdGUge1xyXG4gICAgICAgIGNhdGVnb3J5Pzogc3RyaW5nO1xyXG4gICAgICAgIGZhbWlseT86IHN0cmluZztcclxuICAgICAgICB2YXJpYW50Pzogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgSW1hZ2VDaG9vc2VyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfY2hvc2VuJCA9IG5ldyBSeC5TdWJqZWN0PEltYWdlQ2hvaWNlPigpO1xyXG5cclxuICAgICAgICBjcmVhdGVOb2RlKG9wdGlvbnM6IEltYWdlQ2hvb3Nlck9wdGlvbnMpOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNob2ljZU5vZGVzID0gb3B0aW9ucy5jaG9pY2VzLm1hcChjID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpbWc6IFZOb2RlO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb25DbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaG9zZW4kLm9uTmV4dChjKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdG9yID0gb3B0aW9ucy5jaG9zZW4gPT09IGMudmFsdWUgXHJcbiAgICAgICAgICAgICAgICAgICAgPyBcImltZy5jaG9zZW5cIiBcclxuICAgICAgICAgICAgICAgICAgICA6IFwiaW1nXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoYy5sb2FkSW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1nRWxtO1xyXG4gICAgICAgICAgICAgICAgICAgIGltZyA9IGgoc2VsZWN0b3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IG9uQ2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ga2ljayBvZmYgaW1hZ2UgbG9hZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogdm5vZGUgPT4gYy5sb2FkSW1hZ2Uodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW11cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nID0gaChzZWxlY3RvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmOiBjLmltYWdlVXJsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogb25DbGlja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBoKFwibGlcIiwge30sIFtcclxuICAgICAgICAgICAgICAgICAgICBpbWdcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gaChcInVsLmNob29zZXJcIiwge30sIGNob2ljZU5vZGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBjaG9zZW4kKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hvc2VuJDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1hZ2VDaG9vc2VyT3B0aW9ucyB7XHJcbiAgICAgICAgY2hvaWNlczogSW1hZ2VDaG9pY2VbXSxcclxuICAgICAgICBjaG9zZW4/OiBzdHJpbmdcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEltYWdlQ2hvaWNlIHtcclxuICAgICAgICB2YWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIGxhYmVsOiBzdHJpbmc7XHJcbiAgICAgICAgaW1hZ2VVcmw/OiBzdHJpbmc7XHJcbiAgICAgICAgbG9hZEltYWdlPzogKGVsZW1lbnQ6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHZvaWQ7XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBUZW1wbGF0ZUZvbnRDaG9vc2VyIGltcGxlbWVudHMgQnVpbGRlckNvbnRyb2x7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBfZm9udENob29zZXI6IEZvbnRDaG9vc2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9mb250Q2hvb3NlciA9IG5ldyBGb250Q2hvb3NlcihzdG9yZS5mb250Q2F0YWxvZyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9mb250Q2hvb3Nlci5tYXhGYW1pbGllcyA9IDE1OyBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgY3JlYXRlTm9kZSh2YWx1ZTogVGVtcGxhdGVTdGF0ZSk6IFZOb2RlIHtcclxuICAgICAgICAgICAgY29uc3QgZm9udCA9IHZhbHVlLmRlc2lnbiAmJiB2YWx1ZS5kZXNpZ24uZm9udDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRDaG9vc2VyLmNyZWF0ZU5vZGUoPEZvbnRDaG9vc2VyU3RhdGU+e1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IHZhbHVlLmZvbnRDYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgIGZhbWlseTogZm9udCAmJiBmb250LmZhbWlseSxcclxuICAgICAgICAgICAgICAgIHZhcmlhbnQ6IGZvbnQgJiYgZm9udC52YXJpYW50XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdldCB2YWx1ZSQoKTogUnguT2JzZXJ2YWJsZTxUZW1wbGF0ZVN0YXRlPiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250Q2hvb3Nlci52YWx1ZSQubWFwKGNob2ljZSA9PiA8VGVtcGxhdGVTdGF0ZT57XHJcbiAgICAgICAgICAgICAgICBmb250Q2F0ZWdvcnk6IGNob2ljZS5jYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgIGRlc2lnbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFtaWx5OiBjaG9pY2UuZmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50OiBjaG9pY2UudmFyaWFudFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSBcclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRJbnB1dCBpbXBsZW1lbnRzIFZhbHVlQ29udHJvbDxzdHJpbmc+IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8c3RyaW5nPigpO1xyXG5cclxuICAgICAgICBjcmVhdGVOb2RlKHZhbHVlPzogc3RyaW5nLCBwbGFjZWhvbGRlcj86IHN0cmluZywgdGV4dGFyZWE/OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwidGV4dGFyZWFcIiA/IFwidGV4dGFyZWFcIiA6IFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0ZXh0YXJlYSA/IHVuZGVmaW5lZCA6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogcGxhY2Vob2xkZXJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5cHJlc3M6IChldjogS2V5Ym9hcmRFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChldi53aGljaCB8fCBldi5rZXlDb2RlKSA9PT0gRG9tSGVscGVycy5LZXlDb2Rlcy5FbnRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSA8SFRNTElucHV0RWxlbWVudD5ldi50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuYmx1cigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUkLm9uTmV4dChldi50YXJnZXQudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdmFsdWUkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWUkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlci5UZW1wbGF0ZXMge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEaWNrZW5zIGltcGxlbWVudHMgU2tldGNoQnVpbGRlci5UZW1wbGF0ZSB7XHJcblxyXG4gICAgICAgIG5hbWUgPSBcIkRpY2tlbnNcIjtcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJTdGFjayBibG9ja3Mgb2YgdGV4dCBpbiB0aGUgZm9ybSBvZiBhIHdhdnkgbGFkZGVyLlwiO1xyXG4gICAgICAgIGltYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgbGluZUhlaWdodFZhcmlhdGlvbiA9IDAuODtcclxuICAgICAgICBkZWZhdWx0Rm9udFNpemUgPSAxMjg7XHJcbiAgICAgICAgbWFyZ2luRmFjdG9yID0gMC4xNDtcclxuXHJcbiAgICAgICAgY3JlYXRlTmV3KGNvbnRleHQ6IFRlbXBsYXRlVUlDb250ZXh0KTogVGVtcGxhdGVTdGF0ZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRGb250UmVjb3JkID0gY29udGV4dC5mb250Q2F0YWxvZy5nZXRMaXN0KDEpWzBdO1xyXG4gICAgICAgICAgICByZXR1cm4gPFRlbXBsYXRlU3RhdGU+e1xyXG4gICAgICAgICAgICAgICAgZGVzaWduOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcGU6IFwibmFycm93XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYW1pbHk6IGRlZmF1bHRGb250UmVjb3JkLmZhbWlseVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2VlZDogTWF0aC5yYW5kb20oKVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZvbnRDYXRlZ29yeTogZGVmYXVsdEZvbnRSZWNvcmQuY2F0ZWdvcnlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3JlYXRlVUkoY29udGV4dDogVGVtcGxhdGVVSUNvbnRleHQpOiBCdWlsZGVyQ29udHJvbFtdIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVGV4dEVudHJ5KCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYXBlQ2hvb3Nlcihjb250ZXh0KSxcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVmFyaWF0aW9uQ29udHJvbCgpLFxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5jcmVhdGVGb250Q2hvb3NlcigpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVQYWxldHRlQ2hvb3NlcigpXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBidWlsZChkZXNpZ246IERlc2lnbiwgY29udGV4dDogVGVtcGxhdGVCdWlsZENvbnRleHQpOiBQcm9taXNlPHBhcGVyLkl0ZW0+IHtcclxuICAgICAgICAgICAgaWYgKCFkZXNpZ24uY29udGVudCB8fCAhZGVzaWduLmNvbnRlbnQudGV4dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuZ2V0Rm9udChkZXNpZ24uZm9udCkudGhlbihmb250ID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmRzID0gZGVzaWduLmNvbnRlbnQudGV4dC50b0xvY2FsZVVwcGVyQ2FzZSgpLnNwbGl0KC9cXHMvKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZWVkUmFuZG9tID0gbmV3IEZyYW1ld29yay5TZWVkUmFuZG9tKFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbi5zZWVkID09IG51bGwgPyBNYXRoLnJhbmRvbSgpIDogZGVzaWduLnNlZWQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldExlbmd0aDogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChkZXNpZ24uc2hhcGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmFsYW5jZWRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVuZ3RoID0gMiAqIE1hdGguc3FydChfLnN1bSh3b3Jkcy5tYXAodyA9PiB3Lmxlbmd0aCArIDEpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ3aWRlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG51bUxpbmVzID0gM1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZW5ndGggPSBfLnN1bSh3b3Jkcy5tYXAodyA9PiB3Lmxlbmd0aCArIDEpKSAvIG51bUxpbmVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZW5ndGggPSA8bnVtYmVyPl8ubWF4KHdvcmRzLm1hcCh3ID0+IHcubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVuZ3RoICo9ICgxICsgc2VlZFJhbmRvbS5yYW5kb20oKSAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lcyA9IHRoaXMuYmFsYW5jZUxpbmVzKHdvcmRzLCB0YXJnZXRMZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB0ZXh0Q29sb3IgPSBkZXNpZ24ucGFsZXR0ZSAmJiBkZXNpZ24ucGFsZXR0ZS5jb2xvciB8fCBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlc2lnbi5wYWxldHRlICYmIGRlc2lnbi5wYWxldHRlLmludmVydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIFt0ZXh0Q29sb3IsIGJhY2tncm91bmRDb2xvcl0gPSBbYmFja2dyb3VuZENvbG9yLCB0ZXh0Q29sb3JdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGJveCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZVRleHRCbG9jayA9IChzOiBzdHJpbmcsIHNpemUgPSB0aGlzLmRlZmF1bHRGb250U2l6ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGhEYXRhID0gZm9udC5nZXRQYXRoKHMsIDAsIDAsIHNpemUpLnRvUGF0aERhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGF5b3V0SXRlbXMgPSBsaW5lcy5tYXAobGluZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2s6IGNyZWF0ZVRleHRCbG9jayhsaW5lKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5tYXgobGF5b3V0SXRlbXMubWFwKGIgPT4gYi5ibG9jay5ib3VuZHMud2lkdGgpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFycmFuZ2VQYXRoUG9pbnRzID0gTWF0aC5taW4oNCwgTWF0aC5yb3VuZChtYXhXaWR0aCAvIDIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVIZWlnaHQgPSBsYXlvdXRJdGVtc1swXS5ibG9jay5ib3VuZHMuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB1cHBlciA9IG5ldyBwYXBlci5QYXRoKFtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMCwgMCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KG1heFdpZHRoLCAwKVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbG93ZXI6IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVtYWluaW5nID0gbGF5b3V0SXRlbXMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbGF5b3V0SXRlbSBvZiBsYXlvdXRJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgtLXJlbWFpbmluZyA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1pZCA9IHVwcGVyLmJvdW5kcy5jZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxhc3QgbG93ZXIgbGluZSBpcyBsZXZlbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dlciA9IG5ldyBwYXBlci5QYXRoKFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLCBtaWQueSArIGxpbmVIZWlnaHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KG1heFdpZHRoLCBtaWQueSArIGxpbmVIZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VyID0gdGhpcy5yYW5kb21Mb3dlclBhdGhGb3IodXBwZXIsIGxpbmVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJhbmdlUGF0aFBvaW50cywgc2VlZFJhbmRvbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0cmV0Y2ggPSBuZXcgRm9udFNoYXBlLlZlcnRpY2FsQm91bmRzU3RyZXRjaFBhdGgoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dEl0ZW0uYmxvY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdXBwZXIsIGxvd2VyIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0cmV0Y2guZmlsbENvbG9yID0gdGV4dENvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGJveC5hZGRDaGlsZChzdHJldGNoKTtcclxuICAgICAgICAgICAgICAgICAgICB1cHBlciA9IGxvd2VyO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvd2VyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVzaWduLmNvbnRlbnQuc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc291cmNlQmxvY2sgPSBjcmVhdGVUZXh0QmxvY2soZGVzaWduLmNvbnRlbnQuc291cmNlLCB0aGlzLmRlZmF1bHRGb250U2l6ZSAqIDAuMzMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2NrLmZpbGxDb2xvciA9IHRleHRDb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VCbG9jay50cmFuc2xhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwcGVyLmJvdW5kcy5ib3R0b21MZWZ0LmFkZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhXaWR0aCAtIHNvdXJjZUJsb2NrLmJvdW5kcy53aWR0aCwgLy8gcmlnaHQtYWxpZ25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VCbG9jay5ib3VuZHMuaGVpZ2h0ICogMS4xIC8vIHNoaWZ0IGhlaWdodCBwbHVzIHRvcCBtYXJnaW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc291cmNlQmxvY2suYm91bmRzLmxlZnQgPCAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRqdXN0IGZvciBsb25nIHNvdXJjZSBsaW5lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2NrLmJvdW5kcy5sZWZ0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LmFkZENoaWxkKHNvdXJjZUJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBib3VuZHMgPSBib3guYm91bmRzLmNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICBib3VuZHMuc2l6ZSA9IGJvdW5kcy5zaXplLm11bHRpcGx5KDEgKyB0aGlzLm1hcmdpbkZhY3Rvcik7XHJcbiAgICAgICAgICAgICAgICBib3VuZHMuY2VudGVyID0gYm94LmJvdW5kcy5jZW50ZXI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYWNrZ3JvdW5kID0gcGFwZXIuU2hhcGUuUmVjdGFuZ2xlKGJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLmZpbGxDb2xvciA9IGJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgIGJveC5pbnNlcnRDaGlsZCgwLCBiYWNrZ3JvdW5kKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYm94O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmFuZG9tTG93ZXJQYXRoRm9yKFxyXG4gICAgICAgICAgICB1cHBlcjogcGFwZXIuUGF0aCxcclxuICAgICAgICAgICAgYXZnSGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgICAgIG51bVBvaW50cyxcclxuICAgICAgICAgICAgc2VlZFJhbmRvbTogRnJhbWV3b3JrLlNlZWRSYW5kb21cclxuICAgICAgICApOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAgICAgY29uc3QgcG9pbnRzOiBwYXBlci5Qb2ludFtdID0gW107XHJcbiAgICAgICAgICAgIGxldCB1cHBlckNlbnRlciA9IHVwcGVyLmJvdW5kcy5jZW50ZXI7XHJcbiAgICAgICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Qb2ludHM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IHVwcGVyQ2VudGVyLnkgKyAoc2VlZFJhbmRvbS5yYW5kb20oKSAtIDAuNSkgKiB0aGlzLmxpbmVIZWlnaHRWYXJpYXRpb24gKiBhdmdIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChuZXcgcGFwZXIuUG9pbnQoeCwgeSkpO1xyXG4gICAgICAgICAgICAgICAgeCArPSB1cHBlci5ib3VuZHMud2lkdGggLyAobnVtUG9pbnRzIC0gMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IG5ldyBwYXBlci5QYXRoKHBvaW50cyk7XHJcbiAgICAgICAgICAgIHBhdGguc21vb3RoKCk7XHJcbiAgICAgICAgICAgIHBhdGguYm91bmRzLmNlbnRlciA9IHVwcGVyLmJvdW5kcy5jZW50ZXIuYWRkKG5ldyBwYXBlci5Qb2ludCgwLCBhdmdIZWlnaHQpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGJhbGFuY2VMaW5lcyh3b3Jkczogc3RyaW5nW10sIHRhcmdldExlbmd0aDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgICAgICBjb25zdCBjYWxjU2NvcmUgPSAodGV4dDogc3RyaW5nKSA9PlxyXG4gICAgICAgICAgICAgICAgTWF0aC5wb3coTWF0aC5hYnModGFyZ2V0TGVuZ3RoIC0gdGV4dC5sZW5ndGgpLCAyKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50TGluZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50U2NvcmUgPSAxMDAwMDtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICh3b3Jkcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmQgPSB3b3Jkcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3TGluZSA9IGN1cnJlbnRMaW5lICsgXCIgXCIgKyB3b3JkO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U2NvcmUgPSBjYWxjU2NvcmUobmV3TGluZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudExpbmUgJiYgbmV3U2NvcmUgPD0gY3VycmVudFNjb3JlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYXBwZW5kXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudExpbmUgKz0gXCIgXCIgKyB3b3JkO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTY29yZSA9IG5ld1Njb3JlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBuZXcgbGluZVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TGluZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKGN1cnJlbnRMaW5lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSB3b3JkO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTY29yZSA9IGNhbGNTY29yZShjdXJyZW50TGluZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGluZXMucHVzaChjdXJyZW50TGluZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBsaW5lcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlVGV4dEVudHJ5KCk6IEJ1aWxkZXJDb250cm9sIHtcclxuICAgICAgICAgICAgY29uc3QgbWFpblRleHRJbnB1dCA9IG5ldyBUZXh0SW5wdXQoKTtcclxuICAgICAgICAgICAgY29uc3Qgc291cmNlVGV4dElucHV0ID0gbmV3IFRleHRJbnB1dCgpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlTm9kZTogKHZhbHVlOiBUZW1wbGF0ZVN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImgzXCIsIHt9LCBbXCJNZXNzYWdlXCJdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5UZXh0SW5wdXQuY3JlYXRlTm9kZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSAmJiB2YWx1ZS5kZXNpZ24uY29udGVudCAmJiB2YWx1ZS5kZXNpZ24uY29udGVudC50ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiV2hhdCBkbyB5b3Ugd2FudCB0byBzYXk/XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VUZXh0SW5wdXQuY3JlYXRlTm9kZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSAmJiB2YWx1ZS5kZXNpZ24uY29udGVudCAmJiB2YWx1ZS5kZXNpZ24uY29udGVudC5zb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJTb3VyY2UgKGF1dGhvciwgcGFzc2FnZSwgZXRjKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbHVlJDogUnguT2JzZXJ2YWJsZS5tZXJnZShcclxuICAgICAgICAgICAgICAgICAgICBtYWluVGV4dElucHV0LnZhbHVlJC5tYXAodCA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8VGVtcGxhdGVTdGF0ZUNoYW5nZT57IGRlc2lnbjogeyBjb250ZW50OiB7IHRleHQ6IHQgfSB9IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLCBzb3VyY2VUZXh0SW5wdXQudmFsdWUkLm1hcCh0ID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPnsgZGVzaWduOiB7IGNvbnRlbnQ6IHsgc291cmNlOiB0IH0gfSB9KVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVNoYXBlQ2hvb3Nlcihjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IEJ1aWxkZXJDb250cm9sIHtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8VGVtcGxhdGVTdGF0ZUNoYW5nZT4oKTtcclxuICAgICAgICAgICAgcmV0dXJuIDxCdWlsZGVyQ29udHJvbD57XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVOb2RlOiAodHM6IFRlbXBsYXRlU3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGFwZXMgPSBbXCJuYXJyb3dcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYmFsYW5jZWQgb25seSBhdmFpbGFibGUgZm9yID49IE4gd29yZHNcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHMuZGVzaWduLmNvbnRlbnQgJiYgdHMuZGVzaWduLmNvbnRlbnQudGV4dCAmJiB0cy5kZXNpZ24uY29udGVudC50ZXh0LnNwbGl0KC9cXHMvKS5sZW5ndGggPj0gNykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFwZXMucHVzaChcImJhbGFuY2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzaGFwZXMucHVzaChcIndpZGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hvaWNlcyA9IHNoYXBlcy5tYXAoc2hhcGUgPT4gPENvbnRyb2xIZWxwZXJzLkNob2ljZT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGgoXCJzcGFuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7fSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzaGFwZV0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaG9zZW46IHRzLmRlc2lnbi5zaGFwZSA9PT0gc2hhcGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSQub25OZXh0KHsgZGVzaWduOiB7IHNoYXBlIH0gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImgzXCIsIHt9LCBbXCJTaGFwZVwiXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb250cm9sSGVscGVycy5jaG9vc2VyKGNob2ljZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSQ6IHZhbHVlJC5hc09ic2VydmFibGUoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVWYXJpYXRpb25Db250cm9sKCk6IEJ1aWxkZXJDb250cm9sIHtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8VGVtcGxhdGVTdGF0ZUNoYW5nZT4oKTtcclxuICAgICAgICAgICAgcmV0dXJuIDxCdWlsZGVyQ29udHJvbD57XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVOb2RlOiAodHM6IFRlbXBsYXRlU3RhdGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gaChcImJ1dHRvbi5idG5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdmFsdWUkLm9uTmV4dCh7IGRlc2lnbjogeyBzZWVkOiBNYXRoLnJhbmRvbSgpIH0gfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiTmV4dFwiXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJoM1wiLCB7fSwgW1wiVmFyaWF0aW9uXCJdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWUkOiB2YWx1ZSQuYXNPYnNlcnZhYmxlKClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlUGFsZXR0ZUNob29zZXIoKTogQnVpbGRlckNvbnRyb2wge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJzZWRDb2xvcnMgPSB0aGlzLnBhbGV0dGVDb2xvcnMubWFwKGMgPT4gbmV3IHBhcGVyLkNvbG9yKGMpKTtcclxuICAgICAgICAgICAgY29uc3QgY29sb3JzID0gXy5zb3J0QnkocGFyc2VkQ29sb3JzLCBjID0+IGMuaHVlKVxyXG4gICAgICAgICAgICAgICAgLm1hcChjID0+IGMudG9DU1ModHJ1ZSkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8VGVtcGxhdGVTdGF0ZUNoYW5nZT4oKTtcclxuICAgICAgICAgICAgcmV0dXJuIDxCdWlsZGVyQ29udHJvbD57XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVOb2RlOiAodHM6IFRlbXBsYXRlU3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWxldHRlID0gdHMuZGVzaWduLnBhbGV0dGU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hvaWNlcyA9IGNvbG9ycy5tYXAoY29sb3IgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbnRyb2xIZWxwZXJzLkNob2ljZT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwiZGl2LnBhbGV0dGVUaWxlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9zZW46IHBhbGV0dGUgJiYgcGFsZXR0ZS5jb2xvciA9PT0gY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlJC5vbk5leHQoeyBkZXNpZ246IHsgcGFsZXR0ZTogeyBjb2xvciB9IH0gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnZlcnROb2RlID0gaChcImRpdlwiLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJsYWJlbFwiLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNoZWNrYm94XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiBwYWxldHRlICYmIHBhbGV0dGUuaW52ZXJ0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHZhbHVlJC5vbk5leHQoeyBkZXNpZ246IHsgcGFsZXR0ZTogeyBpbnZlcnQ6IGV2LnRhcmdldC5jaGVja2VkIH0gfSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiSW52ZXJ0IGNvbG9yXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGgoXCJkaXYuY29sb3JDaG9vc2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJoM1wiLCB7fSwgW1wiQ29sb3JcIl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29udHJvbEhlbHBlcnMuY2hvb3NlcihjaG9pY2VzKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmVydE5vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbHVlJDogdmFsdWUkLmFzT2JzZXJ2YWJsZSgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGFsZXR0ZUNvbG9ycyA9IFtcclxuICAgICAgICAgICAgXCIjNGIzODMyXCIsXHJcbiAgICAgICAgICAgIFwiIzg1NDQ0MlwiLFxyXG4gICAgICAgICAgICAvL1wiI2ZmZjRlNlwiLFxyXG4gICAgICAgICAgICBcIiMzYzJmMmZcIixcclxuICAgICAgICAgICAgXCIjYmU5YjdiXCIsXHJcblxyXG4gICAgICAgICAgICBcIiMxYjg1YjhcIixcclxuICAgICAgICAgICAgXCIjNWE1MjU1XCIsXHJcbiAgICAgICAgICAgIFwiIzU1OWU4M1wiLFxyXG4gICAgICAgICAgICBcIiNhZTVhNDFcIixcclxuICAgICAgICAgICAgXCIjYzNjYjcxXCIsXHJcblxyXG4gICAgICAgICAgICBcIiMwZTFhNDBcIixcclxuICAgICAgICAgICAgXCIjMjIyZjViXCIsXHJcbiAgICAgICAgICAgIFwiIzVkNWQ1ZFwiLFxyXG4gICAgICAgICAgICBcIiM5NDZiMmRcIixcclxuICAgICAgICAgICAgXCIjMDAwMDAwXCIsXHJcblxyXG4gICAgICAgICAgICBcIiNlZGM5NTFcIixcclxuICAgICAgICAgICAgXCIjZWI2ODQxXCIsXHJcbiAgICAgICAgICAgIFwiI2NjMmEzNlwiLFxyXG4gICAgICAgICAgICBcIiM0ZjM3MmRcIixcclxuICAgICAgICAgICAgXCIjMDBhMGIwXCIsXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIERvY3VtZW50S2V5SGFuZGxlciB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG5cclxuICAgICAgICAgICAgLy8gbm90ZTogdW5kaXNwb3NlZCBldmVudCBzdWJzY3JpcHRpb25cclxuICAgICAgICAgICAgJChkb2N1bWVudCkua2V5dXAoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSBEb21IZWxwZXJzLktleUNvZGVzLkVzYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFNrZXRjaEVkaXRvck1vZHVsZSB7XHJcblxyXG4gICAgICAgIGFwcFN0b3JlOiBBcHAuU3RvcmU7XHJcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIHdvcmtzcGFjZUNvbnRyb2xsZXI6IFdvcmtzcGFjZUNvbnRyb2xsZXI7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGFwcFN0b3JlOiBBcHAuU3RvcmUpIHtcclxuICAgICAgICAgICAgdGhpcy5hcHBTdG9yZSA9IGFwcFN0b3JlO1xyXG5cclxuICAgICAgICAgICAgRG9tSGVscGVycy5pbml0RXJyb3JIYW5kbGVyKGVycm9yRGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoZXJyb3JEYXRhKTtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvY2xpZW50LWVycm9yc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY29udGVudFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gbmV3IFN0b3JlKGFwcFN0b3JlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJhciA9IG5ldyBFZGl0b3JCYXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2lnbmVyJyksIHRoaXMuc3RvcmUpO1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZEl0ZW1FZGl0b3IgPSBuZXcgU2VsZWN0ZWRJdGVtRWRpdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdG9yT3ZlcmxheVwiKSwgdGhpcy5zdG9yZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGhlbHBEaWFsb2cgPSBuZXcgSGVscERpYWxvZyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlbHAtZGlhbG9nXCIpLCB0aGlzLnN0b3JlKTtcclxuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9uUGFuZWwgPSBuZXcgT3BlcmF0aW9uUGFuZWwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVyYXRpb25QYW5lbFwiKSwgdGhpcy5zdG9yZSk7IFxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5ldmVudHMuc3Vic2NyaWJlKG0gPT4gY29uc29sZS5sb2coXCJldmVudFwiLCBtLnR5cGUsIG0uZGF0YSkpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc3Vic2NyaWJlKG0gPT4gY29uc29sZS5sb2coXCJhY3Rpb25cIiwgbS50eXBlLCBtLmRhdGEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXJ0KCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5ldmVudHMuZWRpdG9yLmZvbnRMb2FkZWQub2JzZXJ2ZSgpLmZpcnN0KCkuc3Vic2NyaWJlKG0gPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMud29ya3NwYWNlQ29udHJvbGxlciA9IG5ldyBXb3Jrc3BhY2VDb250cm9sbGVyKHRoaXMuc3RvcmUsIG0uZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci5pbml0V29ya3NwYWNlLmRpc3BhdGNoKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5ldmVudHMuZWRpdG9yLndvcmtzcGFjZUluaXRpYWxpemVkLnN1YigoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbihcImJlZm9yZXVubG9hZFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaElzRGlydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIllvdXIgbGF0ZXN0IGNoYW5nZXMgYXJlIG5vdCBzYXZlZCB5ZXQuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvcGVuU2tldGNoKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5vcGVuLmRpc3BhdGNoKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU2tldGNoSGVscGVycyB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBjb2xvcnNJblVzZShza2V0Y2g6IFNrZXRjaCk6IHN0cmluZ1tdIHtcclxuICAgICAgICAgICAgbGV0IGNvbG9ycyA9IFtza2V0Y2guYmFja2dyb3VuZENvbG9yXTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiBza2V0Y2gudGV4dEJsb2Nrcykge1xyXG4gICAgICAgICAgICAgICAgY29sb3JzLnB1c2goYmxvY2suYmFja2dyb3VuZENvbG9yKTtcclxuICAgICAgICAgICAgICAgIGNvbG9ycy5wdXNoKGJsb2NrLnRleHRDb2xvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29sb3JzID0gXy51bmlxKGNvbG9ycy5maWx0ZXIoYyA9PiBjICE9IG51bGwpKTtcclxuICAgICAgICAgICAgY29sb3JzLnNvcnQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbG9ycztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3RhdGljIGdldFNrZXRjaEZpbGVOYW1lKHNrZXRjaDogU2tldGNoLCBsZW5ndGg6IG51bWJlciwgZXh0ZW5zaW9uOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIG91dGVyOlxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIHNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHdvcmQgb2YgYmxvY2sudGV4dC5zcGxpdCgvXFxzLykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmltID0gd29yZC5yZXBsYWNlKC9cXFcvZywgJycpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHJpbS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUubGVuZ3RoKSBuYW1lICs9IFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lICs9IHRyaW07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuYW1lLmxlbmd0aCA+PSBsZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWsgb3V0ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghbmFtZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIG5hbWUgPSBcImZpZGRsZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lICsgXCIuXCIgKyBleHRlbnNpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJcclxubmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgc2luZ2xldG9uIFN0b3JlIGNvbnRyb2xzIGFsbCBhcHBsaWNhdGlvbiBzdGF0ZS5cclxuICAgICAqIE5vIHBhcnRzIG91dHNpZGUgb2YgdGhlIFN0b3JlIG1vZGlmeSBhcHBsaWNhdGlvbiBzdGF0ZS5cclxuICAgICAqIENvbW11bmljYXRpb24gd2l0aCB0aGUgU3RvcmUgaXMgZG9uZSB0aHJvdWdoIG1lc3NhZ2UgQ2hhbm5lbHM6IFxyXG4gICAgICogICAtIEFjdGlvbnMgY2hhbm5lbCB0byBzZW5kIGludG8gdGhlIFN0b3JlLFxyXG4gICAgICogICAtIEV2ZW50cyBjaGFubmVsIHRvIHJlY2VpdmUgbm90aWZpY2F0aW9uIGZyb20gdGhlIFN0b3JlLlxyXG4gICAgICogT25seSB0aGUgU3RvcmUgY2FuIHJlY2VpdmUgYWN0aW9uIG1lc3NhZ2VzLlxyXG4gICAgICogT25seSB0aGUgU3RvcmUgY2FuIHNlbmQgZXZlbnQgbWVzc2FnZXMuXHJcbiAgICAgKiBUaGUgU3RvcmUgY2Fubm90IHNlbmQgYWN0aW9ucyBvciBsaXN0ZW4gdG8gZXZlbnRzICh0byBhdm9pZCBsb29wcykuXHJcbiAgICAgKiBNZXNzYWdlcyBhcmUgdG8gYmUgdHJlYXRlZCBhcyBpbW11dGFibGUuXHJcbiAgICAgKiBBbGwgbWVudGlvbnMgb2YgdGhlIFN0b3JlIGNhbiBiZSBhc3N1bWVkIHRvIG1lYW4sIG9mIGNvdXJzZSxcclxuICAgICAqICAgXCJUaGUgU3RvcmUgYW5kIGl0cyBzdWItY29tcG9uZW50cy5cIlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgU3RvcmUge1xyXG5cclxuICAgICAgICBzdGF0aWMgQlJPV1NFUl9JRF9LRVkgPSBcImJyb3dzZXJJZFwiO1xyXG4gICAgICAgIHN0YXRpYyBGQUxMQkFDS19GT05UX1VSTCA9IFwiL2ZvbnRzL1JvYm90by01MDAudHRmXCI7XHJcbiAgICAgICAgc3RhdGljIERFRkFVTFRfRk9OVF9OQU1FID0gXCJSb2JvdG9cIjtcclxuICAgICAgICBzdGF0aWMgU0tFVENIX0xPQ0FMX0NBQ0hFX0tFWSA9IFwiZmlkZGxlc3RpY2tzLmlvLmxhc3RTa2V0Y2hcIjtcclxuICAgICAgICBzdGF0aWMgTE9DQUxfQ0FDSEVfREVMQVlfTVMgPSAxMDAwO1xyXG4gICAgICAgIHN0YXRpYyBTRVJWRVJfU0FWRV9ERUxBWV9NUyA9IDEwMDAwO1xyXG4gICAgICAgIHN0YXRpYyBHUkVFVElOR19TS0VUQ0hfSUQgPSBcImltMmJhOTJpMTcxNGlcIjtcclxuXHJcbiAgICAgICAgZm9udExpc3RMaW1pdCA9IDI1MDtcclxuXHJcbiAgICAgICAgc3RhdGU6IEVkaXRvclN0YXRlID0ge307XHJcbiAgICAgICAgcmVzb3VyY2VzOiBTdG9yZVJlc291cmNlcyA9IHt9O1xyXG4gICAgICAgIGFjdGlvbnMgPSBuZXcgQWN0aW9ucygpO1xyXG4gICAgICAgIGV2ZW50cyA9IG5ldyBFdmVudHMoKTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBhcHBTdG9yZTogQXBwLlN0b3JlO1xyXG4gICAgICAgIHByaXZhdGUgX29wZXJhdGlvbiQgPSBuZXcgUnguU3ViamVjdDxPcGVyYXRpb24+KCk7XHJcbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNwYXJlbmN5JCA9IG5ldyBSeC5TdWJqZWN0PGJvb2xlYW4+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGFwcFN0b3JlOiBBcHAuU3RvcmUpIHtcclxuICAgICAgICAgICAgdGhpcy5hcHBTdG9yZSA9IGFwcFN0b3JlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zZXR1cFN0YXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldHVwU3Vic2NyaXB0aW9ucygpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5sb2FkUmVzb3VyY2VzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXR1cFN0YXRlKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmJyb3dzZXJJZCA9IENvb2tpZXMuZ2V0KFN0b3JlLkJST1dTRVJfSURfS0VZKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmJyb3dzZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5icm93c2VySWQgPSBGcmFtZXdvcmsubmV3aWQoKTtcclxuICAgICAgICAgICAgICAgIENvb2tpZXMuc2V0KFN0b3JlLkJST1dTRVJfSURfS0VZLCB0aGlzLnN0YXRlLmJyb3dzZXJJZCwgeyBleHBpcmVzOiAyICogMzY1IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXR1cFN1YnNjcmlwdGlvbnMoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLmFjdGlvbnMsIGV2ZW50cyA9IHRoaXMuZXZlbnRzO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gQXBwIC0tLS0tXHJcblxyXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlLmV2ZW50cy5yb3V0ZUNoYW5nZWQuc3ViKHJvdXRlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdXRlU2tldGNoSWQgPSByb3V0ZS5wYXJhbXMuc2tldGNoSWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAocm91dGUubmFtZSA9PT0gXCJza2V0Y2hcIiAmJiByb3V0ZVNrZXRjaElkICE9PSB0aGlzLnN0YXRlLnNrZXRjaC5faWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5Ta2V0Y2gocm91dGVTa2V0Y2hJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gRWRpdG9yIC0tLS0tXHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci5pbml0V29ya3NwYWNlLm9ic2VydmUoKVxyXG4gICAgICAgICAgICAgICAgLnBhdXNhYmxlQnVmZmVyZWQoZXZlbnRzLmVkaXRvci5yZXNvdXJjZXNSZWFkeS5vYnNlcnZlKCkubWFwKG0gPT4gbS5kYXRhKSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2tldGNoSWQgPSB0aGlzLmFwcFN0b3JlLnN0YXRlLnJvdXRlLnBhcmFtcy5za2V0Y2hJZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCB0aGlzLmFwcFN0b3JlLnN0YXRlLmxhc3RTYXZlZFNrZXRjaElkO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9taXNlOiBKUXVlcnlQcm9taXNlPGFueT47XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNrZXRjaElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSB0aGlzLm9wZW5Ta2V0Y2goc2tldGNoSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSB0aGlzLmxvYWRHcmVldGluZ1NrZXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4gZXZlbnRzLmVkaXRvci53b3Jrc3BhY2VJbml0aWFsaXplZC5kaXNwYXRjaCgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb24gYW55IGFjdGlvbiwgdXBkYXRlIHNhdmUgZGVsYXkgdGltZXJcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbnMub2JzZXJ2ZSgpLmRlYm91bmNlKFN0b3JlLlNFUlZFUl9TQVZFX0RFTEFZX01TKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNrZXRjaCA9IHRoaXMuc3RhdGUuc2tldGNoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmxvYWRpbmdTa2V0Y2hcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBza2V0Y2guX2lkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgc2tldGNoLnRleHRCbG9ja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlU2tldGNoKHNrZXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci5sb2FkRm9udC5zdWJzY3JpYmUobSA9PlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KG0uZGF0YSkpO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3Iuem9vbVRvRml0LmZvcndhcmQoXHJcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLnpvb21Ub0ZpdFJlcXVlc3RlZCk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci5leHBvcnRQTkcuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLmVkaXRvci5leHBvcnRQTkdSZXF1ZXN0ZWQuZGlzcGF0Y2gobS5kYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci5leHBvcnRTVkcuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLmVkaXRvci5leHBvcnRTVkdSZXF1ZXN0ZWQuZGlzcGF0Y2gobS5kYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci52aWV3Q2hhbmdlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLnZpZXdDaGFuZ2VkLmRpc3BhdGNoKG0uZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3IudXBkYXRlU25hcHNob3Quc3ViKCh7c2tldGNoSWQsIHBuZ0RhdGFVcmx9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2tldGNoSWQgPT09IHRoaXMuc3RhdGUuc2tldGNoLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gc2tldGNoSWQgKyBcIi5wbmdcIjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBibG9iID0gRG9tSGVscGVycy5kYXRhVVJMVG9CbG9iKHBuZ0RhdGFVcmwpO1xyXG4gICAgICAgICAgICAgICAgICAgIFMzQWNjZXNzLnB1dEZpbGUoZmlsZU5hbWUsIFwiaW1hZ2UvcG5nXCIsIGJsb2IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2hvd0hlbHAgPSAhdGhpcy5zdGF0ZS5zaG93SGVscDtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5lZGl0b3Iuc2hvd0hlbHBDaGFuZ2VkLmRpc3BhdGNoKHRoaXMuc3RhdGUuc2hvd0hlbHApO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLm9wZW5TYW1wbGUuc3ViKCgpID0+IHRoaXMubG9hZEdyZWV0aW5nU2tldGNoKCkpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gU2tldGNoIC0tLS0tXHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5vcGVuLnN1YihpZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5Ta2V0Y2goaWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLmNyZWF0ZS5zdWIoKGF0dHIpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3U2tldGNoKGF0dHIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLmNsZWFyLnN1YigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyU2tldGNoKCk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5jbG9uZS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xvbmUgPSBfLmNsb25lKHRoaXMuc3RhdGUuc2tldGNoKTtcclxuICAgICAgICAgICAgICAgIGNsb25lLl9pZCA9IEZyYW1ld29yay5uZXdpZCgpO1xyXG4gICAgICAgICAgICAgICAgY2xvbmUuYnJvd3NlcklkID0gdGhpcy5zdGF0ZS5icm93c2VySWQ7XHJcbiAgICAgICAgICAgICAgICBjbG9uZS5zYXZlZEF0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChjbG9uZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5jbG9uZWQuZGlzcGF0Y2goY2xvbmUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdWxzZVVzZXJNZXNzYWdlKFwiRHVwbGljYXRlZCBza2V0Y2guIEFkZHJlc3Mgb2YgdGhpcyBwYWdlIGhhcyBiZWVuIHVwZGF0ZWQuXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLmF0dHJVcGRhdGUuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWVyZ2UodGhpcy5zdGF0ZS5za2V0Y2gsIGV2LmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLnNrZXRjaC5hdHRyQ2hhbmdlZC5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKG0uZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG0uZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tIFRleHRCbG9jayAtLS0tLVxyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2suYWRkXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGF0Y2ggPSBldi5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcGF0Y2gudGV4dCB8fCAhcGF0Y2gudGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB7IF9pZDogRnJhbWV3b3JrLm5ld2lkKCkgfSBhcyBUZXh0QmxvY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXJnZShibG9jaywgcGF0Y2gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBibG9jay50ZXh0Q29sb3IgPSB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ci50ZXh0Q29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suYmFja2dyb3VuZENvbG9yID0gdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghYmxvY2suZm9udEZhbWlseSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5mb250RmFtaWx5ID0gdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIuZm9udEZhbWlseTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2suZm9udFZhcmlhbnQgPSB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ci5mb250VmFyaWFudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MucHVzaChibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnRleHRibG9jay5hZGRlZC5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkU2tldGNoQ29udGVudCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRUZXh0QmxvY2tGb250KGJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXR0clxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5nZXRCbG9jayhldi5kYXRhLl9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXRjaCA9IDxUZXh0QmxvY2s+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXYuZGF0YS50ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBldi5kYXRhLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRDb2xvcjogZXYuZGF0YS50ZXh0Q29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBldi5kYXRhLmZvbnRGYW1pbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogZXYuZGF0YS5mb250VmFyaWFudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb250Q2hhbmdlZCA9IHBhdGNoLmZvbnRGYW1pbHkgIT09IGJsb2NrLmZvbnRGYW1pbHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHBhdGNoLmZvbnRWYXJpYW50ICE9PSBibG9jay5mb250VmFyaWFudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXJnZShibG9jaywgcGF0Y2gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLmZvbnRGYW1pbHkgJiYgIWJsb2NrLmZvbnRWYXJpYW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLnJlc291cmNlcy5mb250Q2F0YWxvZy5nZXRSZWNvcmQoYmxvY2suZm9udEZhbWlseSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVjb3JkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVndWxhciBvciBlbHNlIGZpcnN0IHZhcmlhbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jay5mb250VmFyaWFudCA9IEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5kZWZhdWx0VmFyaWFudChyZWNvcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRDb2xvcjogYmxvY2sudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBibG9jay5iYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBibG9jay5mb250RmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFZhcmlhbnQ6IGJsb2NrLmZvbnRWYXJpYW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmF0dHJDaGFuZ2VkLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkU2tldGNoQ29udGVudCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvbnRDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRUZXh0QmxvY2tGb250KGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2sucmVtb3ZlXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGlkRGVsZXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5yZW1vdmUodGhpcy5zdGF0ZS5za2V0Y2gudGV4dEJsb2NrcywgdGIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGIuX2lkID09PSBldi5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlkRGVsZXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpZERlbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLnJlbW92ZWQuZGlzcGF0Y2goeyBfaWQ6IGV2LmRhdGEuX2lkIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay51cGRhdGVBcnJhbmdlXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB0aGlzLmdldEJsb2NrKGV2LmRhdGEuX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sucG9zaXRpb24gPSBldi5kYXRhLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5vdXRsaW5lID0gZXYuZGF0YS5vdXRsaW5lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmFycmFuZ2VDaGFuZ2VkLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkU2tldGNoQ29udGVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IG9wZXJhdGlvbiQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vcGVyYXRpb24kLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHRyYW5zcGFyZW5jeSQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90cmFuc3BhcmVuY3kkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgc2hvd09wZXJhdGlvbihvcGVyYXRpb246IE9wZXJhdGlvbil7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUub3BlcmF0aW9uID0gb3BlcmF0aW9uO1xyXG4gICAgICAgICAgICBvcGVyYXRpb24ub25DbG9zZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RhdGUub3BlcmF0aW9uID09PSBvcGVyYXRpb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZU9wZXJhdGlvbigpOyBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9vcGVyYXRpb24kLm9uTmV4dChvcGVyYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgaGlkZU9wZXJhdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5vcGVyYXRpb24gPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9vcGVyYXRpb24kLm9uTmV4dChudWxsKTsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGltYWdlVXBsb2FkZWQoc3JjOiBzdHJpbmcpe1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnVwbG9hZGVkSW1hZ2UgPSBzcmM7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5pbWFnZVVwbG9hZGVkLmRpc3BhdGNoKHNyYyk7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLnN0YXRlLnRyYW5zcGFyZW5jeSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRyYW5zcGFyZW5jeSh0cnVlKTtcclxuICAgICAgICAgICAgfSAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlVXBsb2FkZWRJbWFnZSgpe1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnVwbG9hZGVkSW1hZ2UgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guaW1hZ2VVcGxvYWRlZC5kaXNwYXRjaChudWxsKTtcclxuICAgICAgICAgICAgaWYodGhpcy5zdGF0ZS50cmFuc3BhcmVuY3kpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUcmFuc3BhcmVuY3koZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc2V0VHJhbnNwYXJlbmN5KHZhbHVlPzogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnRyYW5zcGFyZW5jeSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLl90cmFuc3BhcmVuY3kkLm9uTmV4dCh0aGlzLnN0YXRlLnRyYW5zcGFyZW5jeSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIG9wZW5Ta2V0Y2goaWQ6IHN0cmluZyk6IEpRdWVyeVByb21pc2U8U2tldGNoPiB7XHJcbiAgICAgICAgICAgIGlmICghaWQgfHwgIWlkLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBTM0FjY2Vzcy5nZXRKc29uKGlkICsgXCIuanNvblwiKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAoc2tldGNoOiBTa2V0Y2gpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goc2tldGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXRyaWV2ZWQgc2tldGNoXCIsIHNrZXRjaC5faWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChza2V0Y2guYnJvd3NlcklkID09PSB0aGlzLnN0YXRlLmJyb3dzZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2tldGNoIHdhcyBjcmVhdGVkIGluIHRoaXMgYnJvd3NlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NrZXRjaCB3YXMgY3JlYXRlZCBpbiBhIGRpZmZlcmVudCBicm93c2VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2tldGNoO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiZXJyb3IgZ2V0dGluZyByZW1vdGUgc2tldGNoXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkR3JlZXRpbmdTa2V0Y2goKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkU2tldGNoKHNrZXRjaDogU2tldGNoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoID0gc2tldGNoO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0VXNlck1lc3NhZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5sb2FkZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlLmFjdGlvbnMuZWRpdG9yTG9hZGVkU2tldGNoLmRpc3BhdGNoKHNrZXRjaC5faWQpO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRiIG9mIHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5sb2FkZWQuZGlzcGF0Y2godGIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkVGV4dEJsb2NrRm9udCh0Yik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVkaXRvci56b29tVG9GaXRSZXF1ZXN0ZWQuZGlzcGF0Y2goKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkR3JlZXRpbmdTa2V0Y2goKTogSlF1ZXJ5UHJvbWlzZTxhbnk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFMzQWNjZXNzLmdldEpzb24oU3RvcmUuR1JFRVRJTkdfU0tFVENIX0lEICsgXCIuanNvblwiKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoKHNrZXRjaDogU2tldGNoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tldGNoLl9pZCA9IEZyYW1ld29yay5uZXdpZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNrZXRjaC5icm93c2VySWQgPSB0aGlzLnN0YXRlLmJyb3dzZXJJZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goc2tldGNoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjbGVhclNrZXRjaCgpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2tldGNoID0gPFNrZXRjaD50aGlzLmRlZmF1bHRTa2V0Y2hBdHRyKCk7XHJcbiAgICAgICAgICAgIHNrZXRjaC5faWQgPSB0aGlzLnN0YXRlLnNrZXRjaC5faWQ7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkUmVzb3VyY2VzKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlcy5wYXJzZWRGb250cyA9IG5ldyBGb250U2hhcGUuUGFyc2VkRm9udHMocGFyc2VkID0+XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lZGl0b3IuZm9udExvYWRlZC5kaXNwYXRjaChwYXJzZWQuZm9udCkpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBGb250U2hhcGUuRm9udENhdGFsb2cuZnJvbUxvY2FsKFwiZm9udHMvZ29vZ2xlLWZvbnRzLmpzb25cIilcclxuICAgICAgICAgICAgICAgIC50aGVuKGNhdGFsb2cgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZvbnRDYXRhbG9nID0gY2F0YWxvZztcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBsb2FkIGZvbnRzIGludG8gYnJvd3NlciBmb3IgcHJldmlld1xyXG4gICAgICAgICAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5sb2FkUHJldmlld1N1YnNldHMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGFsb2cuZ2V0TGlzdCh0aGlzLmZvbnRMaXN0TGltaXQpLm1hcChmID0+IGYuZmFtaWx5KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChTdG9yZS5GQUxMQkFDS19GT05UX1VSTCkudGhlbigoe2ZvbnR9KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcy5mYWxsYmFja0ZvbnQgPSBmb250KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnJlc291cmNlc1JlYWR5LmRpc3BhdGNoKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNldFVzZXJNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS51c2VyTWVzc2FnZSAhPT0gbWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS51c2VyTWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lZGl0b3IudXNlck1lc3NhZ2VDaGFuZ2VkLmRpc3BhdGNoKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHB1bHNlVXNlck1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlck1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXREZWZhdWx0VXNlck1lc3NhZ2UoKSwgNDAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNldERlZmF1bHRVc2VyTWVzc2FnZSgpIHtcclxuICAgICAgICAgICAgLy8gaWYgbm90IHRoZSBsYXN0IHNhdmVkIHNrZXRjaCwgb3Igc2tldGNoIGlzIGRpcnR5LCBzaG93IFwiVW5zYXZlZFwiXHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAodGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5XHJcbiAgICAgICAgICAgICAgICB8fCAhdGhpcy5zdGF0ZS5za2V0Y2guc2F2ZWRBdClcclxuICAgICAgICAgICAgICAgID8gXCJVbnNhdmVkXCJcclxuICAgICAgICAgICAgICAgIDogXCJTYXZlZFwiO1xyXG4gICAgICAgICAgICB0aGlzLnNldFVzZXJNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkVGV4dEJsb2NrRm9udChibG9jazogVGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZvbnRDYXRhbG9nLmdldFVybChibG9jay5mb250RmFtaWx5LCBibG9jay5mb250VmFyaWFudCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoe2ZvbnR9KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5mb250UmVhZHkuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dEJsb2NrSWQ6IGJsb2NrLl9pZCwgZm9udCB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNoYW5nZWRTa2V0Y2hDb250ZW50KCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guY29udGVudENoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBtZXJnZTxUPihkZXN0OiBULCBzb3VyY2U6IFQpIHtcclxuICAgICAgICAgICAgXy5tZXJnZShkZXN0LCBzb3VyY2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBuZXdTa2V0Y2goYXR0cj86IFNrZXRjaEF0dHIpOiBTa2V0Y2gge1xyXG4gICAgICAgICAgICBjb25zdCBza2V0Y2ggPSA8U2tldGNoPnRoaXMuZGVmYXVsdFNrZXRjaEF0dHIoKTtcclxuICAgICAgICAgICAgc2tldGNoLl9pZCA9IEZyYW1ld29yay5uZXdpZCgpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXJnZShza2V0Y2gsIGF0dHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2tldGNoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkZWZhdWx0U2tldGNoQXR0cigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDxTa2V0Y2hBdHRyPntcclxuICAgICAgICAgICAgICAgIGJyb3dzZXJJZDogdGhpcy5zdGF0ZS5icm93c2VySWQsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0VGV4dEJsb2NrQXR0cjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwiUm9ib3RvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFZhcmlhbnQ6IFwicmVndWxhclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHRDb2xvcjogXCJncmF5XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwid2hpdGVcIixcclxuICAgICAgICAgICAgICAgIHRleHRCbG9ja3M6IDxUZXh0QmxvY2tbXT5bXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzYXZlU2tldGNoKHNrZXRjaDogU2tldGNoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNhdmluZyA9IF8uY2xvbmUoc2tldGNoKTtcclxuICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgc2F2aW5nLnNhdmVkQXQgPSBub3c7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlck1lc3NhZ2UoXCJTYXZpbmdcIik7XHJcbiAgICAgICAgICAgIFMzQWNjZXNzLnB1dEZpbGUoc2tldGNoLl9pZCArIFwiLmpzb25cIixcclxuICAgICAgICAgICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiLCBKU09OLnN0cmluZ2lmeShzYXZpbmcpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoLnNhdmVkQXQgPSBub3c7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0VXNlck1lc3NhZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcFN0b3JlLmFjdGlvbnMuZWRpdG9yU2F2ZWRTa2V0Y2guZGlzcGF0Y2goc2tldGNoLl9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnNuYXBzaG90RXhwaXJlZC5kaXNwYXRjaChza2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFVzZXJNZXNzYWdlKFwiVW5hYmxlIHRvIHNhdmVcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0U2VsZWN0aW9uKGl0ZW06IFdvcmtzcGFjZU9iamVjdFJlZiwgZm9yY2U6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGlmICghZm9yY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVhcmx5IGV4aXQgb24gbm8gY2hhbmdlXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLnN0YXRlLnNlbGVjdGlvbi5pdGVtSWQgPT09IGl0ZW0uaXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5zZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3Rpb24gPSBpdGVtO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guc2VsZWN0aW9uQ2hhbmdlZC5kaXNwYXRjaChpdGVtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0RWRpdGluZ0l0ZW0oaXRlbTogUG9zaXRpb25lZE9iamVjdFJlZiwgZm9yY2U/OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICghZm9yY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVhcmx5IGV4aXQgb24gbm8gY2hhbmdlXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0uaXRlbUlkID09PSBpdGVtLml0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0pIHtcclxuICAgICAgICAgICAgICAgIC8vIHNpZ25hbCBjbG9zaW5nIGVkaXRvciBmb3IgaXRlbVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtLml0ZW1UeXBlID09PSBcIlRleHRCbG9ja1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEVkaXRpbmdCbG9jayA9IHRoaXMuZ2V0QmxvY2sodGhpcy5zdGF0ZS5lZGl0aW5nSXRlbS5pdGVtSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RWRpdGluZ0Jsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5lZGl0b3JDbG9zZWQuZGlzcGF0Y2goY3VycmVudEVkaXRpbmdCbG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZWRpdGluZyBpdGVtIHNob3VsZCBiZSBzZWxlY3RlZCBpdGVtXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWQuZGlzcGF0Y2goaXRlbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGdldEJsb2NrKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLCB0YiA9PiB0Yi5faWQgPT09IGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsImludGVyZmFjZSBXaW5kb3cge1xyXG4gICAgd2Via2l0VVJMOiBVUkw7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBXb3Jrc3BhY2VDb250cm9sbGVyIHtcclxuXHJcbiAgICAgICAgc3RhdGljIFRFWFRfQ0hBTkdFX1JFTkRFUl9USFJPVFRMRV9NUyA9IDUwMDtcclxuICAgICAgICBzdGF0aWMgQkxPQ0tfQk9VTkRTX0NIQU5HRV9USFJPVFRMRV9NUyA9IDUwMDtcclxuXHJcbiAgICAgICAgZGVmYXVsdFNpemUgPSBuZXcgcGFwZXIuU2l6ZSg1MDAwMCwgNDAwMDApO1xyXG4gICAgICAgIGRlZmF1bHRTY2FsZSA9IDAuMDI7XHJcblxyXG4gICAgICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAgICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuICAgICAgICBmYWxsYmFja0ZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICAgICAgdmlld1pvb206IHBhcGVyRXh0LlZpZXdab29tO1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuICAgICAgICBwcml2YXRlIF9za2V0Y2g6IFNrZXRjaDtcclxuICAgICAgICBwcml2YXRlIF90ZXh0QmxvY2tJdGVtczogeyBbdGV4dEJsb2NrSWQ6IHN0cmluZ106IFRleHRXYXJwIH0gPSB7fTtcclxuICAgICAgICBwcml2YXRlIF93b3Jrc3BhY2U6IHBhcGVyLkl0ZW07XHJcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZEltYWdlOiBwYXBlci5SYXN0ZXI7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSwgZmFsbGJhY2tGb250OiBvcGVudHlwZS5Gb250KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgdGhpcy5mYWxsYmFja0ZvbnQgPSBmYWxsYmFja0ZvbnQ7XHJcbiAgICAgICAgICAgIHBhcGVyLnNldHRpbmdzLmhhbmRsZVNpemUgPSAxO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5DYW52YXMnKTtcclxuICAgICAgICAgICAgcGFwZXIuc2V0dXAodGhpcy5jYW52YXMpO1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3QgPSBwYXBlci5wcm9qZWN0O1xyXG4gICAgICAgICAgICB3aW5kb3cub25yZXNpemUgPSAoKSA9PiB0aGlzLnByb2plY3Qudmlldy5kcmF3KCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjYW52YXNTZWwgPSAkKHRoaXMuY2FudmFzKTtcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLm1lcmdlVHlwZWQoXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZCxcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWRcclxuICAgICAgICAgICAgKS5zdWJzY3JpYmUoZXYgPT5cclxuICAgICAgICAgICAgICAgIGNhbnZhc1NlbC5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGV2LmRhdGEuYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudmlld1pvb20gPSBuZXcgcGFwZXJFeHQuVmlld1pvb20odGhpcy5wcm9qZWN0KTtcclxuICAgICAgICAgICAgdGhpcy52aWV3Wm9vbS5zZXRab29tUmFuZ2UoW1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2l6ZS5tdWx0aXBseSh0aGlzLmRlZmF1bHRTY2FsZSAqIDAuMSksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTaXplLm11bHRpcGx5KDAuNSldKTtcclxuICAgICAgICAgICAgdGhpcy52aWV3Wm9vbS52aWV3Q2hhbmdlZC5zdWJzY3JpYmUoYm91bmRzID0+IHtcclxuICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuZWRpdG9yLnZpZXdDaGFuZ2VkLmRpc3BhdGNoKGJvdW5kcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY2xlYXJTZWxlY3Rpb24gPSAoZXY6IHBhcGVyLlBhcGVyTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0b3JlLnN0YXRlLnNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYXBlci52aWV3Lm9uKHBhcGVyLkV2ZW50VHlwZS5jbGljaywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByb2plY3QuaGl0VGVzdChldi5wb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbihldik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBwYXBlci52aWV3Lm9uKHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdTdGFydCwgY2xlYXJTZWxlY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qga2V5SGFuZGxlciA9IG5ldyBEb2N1bWVudEtleUhhbmRsZXIoc3RvcmUpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gRGVzaWduZXIgLS0tLS1cclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5lZGl0b3Iud29ya3NwYWNlSW5pdGlhbGl6ZWQuc3ViKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC52aWV3LmRyYXcoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLnpvb21Ub0ZpdFJlcXVlc3RlZC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy56b29tVG9GaXQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLmV4cG9ydFNWR1JlcXVlc3RlZC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb3dubG9hZFNWRygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5lZGl0b3IuZXhwb3J0UE5HUmVxdWVzdGVkLnN1YigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvd25sb2FkUE5HKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5zbmFwc2hvdEV4cGlyZWQuc3ViKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdldFNuYXBzaG90UE5HKDcyKTtcclxuICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuZWRpdG9yLnVwZGF0ZVNuYXBzaG90LmRpc3BhdGNoKHtcclxuICAgICAgICAgICAgICAgICAgICBza2V0Y2hJZDogdGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2guX2lkLCBwbmdEYXRhVXJsOiBkYXRhXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBTa2V0Y2ggLS0tLS1cclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9za2V0Y2ggPSBldi5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuZGVzZWxlY3RBbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl93b3Jrc3BhY2UgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtcyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG0uZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IG0uZGF0YS5pdGVtSWQgJiYgdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLml0ZW1JZF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrICYmICFibG9jay5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tIFRleHRCbG9jayAtLS0tLVxyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLm1lcmdlVHlwZWQoXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmFkZGVkLFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5sb2FkZWRcclxuICAgICAgICAgICAgKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICBldiA9PiB0aGlzLmFkZEJsb2NrKGV2LmRhdGEpKTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWRcclxuICAgICAgICAgICAgICAgIC5vYnNlcnZlKClcclxuICAgICAgICAgICAgICAgIC50aHJvdHRsZShXb3Jrc3BhY2VDb250cm9sbGVyLlRFWFRfQ0hBTkdFX1JFTkRFUl9USFJPVFRMRV9NUylcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0QmxvY2sgPSBtLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udGV4dCA9IHRleHRCbG9jay50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmN1c3RvbVN0eWxlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suZm9udFJlYWR5LnN1YihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1tkYXRhLnRleHRCbG9ja0lkXTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5mb250ID0gZGF0YS5mb250O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmVkaXRvckNsb3NlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5pbWFnZVVwbG9hZGVkLnN1Yih1cmwgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRCYWNrZ3JvdW5kSW1hZ2UodXJsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzdG9yZS50cmFuc3BhcmVuY3kkLnN1YnNjcmliZSh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93b3Jrc3BhY2Uub3BhY2l0eSA9IHZhbHVlID8gMC43NSA6IDE7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgem9vbVRvRml0KCkge1xyXG4gICAgICAgICAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFZpZXdhYmxlQm91bmRzKCk7XHJcbiAgICAgICAgICAgIGlmKGJvdW5kcy53aWR0aCA+IDAgJiYgYm91bmRzLmhlaWdodCA+IDApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Wm9vbS56b29tVG8oYm91bmRzLnNjYWxlKDEuMikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGdldFZpZXdhYmxlQm91bmRzKCk6IHBhcGVyLlJlY3RhbmdsZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuX3dvcmtzcGFjZS5ib3VuZHM7XHJcbiAgICAgICAgICAgIGlmKCFib3VuZHMgfHwgYm91bmRzLndpZHRoID09PSAwIHx8IGJvdW5kcy5oZWlnaHQgPT09IDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5SZWN0YW5nbGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsMCksIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFNpemUubXVsdGlwbHkoMC4wNSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBib3VuZHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcmV0dXJucyBkYXRhIFVSTFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgZ2V0U25hcHNob3RQTkcoZHBpOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBiYWNrZ3JvdW5kID0gdGhpcy5pbnNlcnRCYWNrZ3JvdW5kKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhc3RlciA9IHRoaXMuX3dvcmtzcGFjZS5yYXN0ZXJpemUoZHBpLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByYXN0ZXIudG9EYXRhVVJMKCk7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkb3dubG9hZFBORygpIHtcclxuICAgICAgICAgICAgLy8gSGFsZiBvZiBtYXggRFBJIHByb2R1Y2VzIGFwcHJveCA0MjAweDQyMDAuXHJcbiAgICAgICAgICAgIGNvbnN0IGRwaSA9IDAuNSAqIFBhcGVySGVscGVycy5nZXRNYXhFeHBvcnREcGkodGhpcy5fd29ya3NwYWNlLmJvdW5kcy5zaXplKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0U25hcHNob3RQTkcoZHBpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gU2tldGNoSGVscGVycy5nZXRTa2V0Y2hGaWxlTmFtZShcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLCA0MCwgXCJwbmdcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBEb21IZWxwZXJzLmRhdGFVUkxUb0Jsb2IoZGF0YSk7XHJcbiAgICAgICAgICAgIHNhdmVBcyhibG9iLCBmaWxlTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRvd25sb2FkU1ZHKCkge1xyXG4gICAgICAgICAgICBsZXQgYmFja2dyb3VuZDogcGFwZXIuSXRlbTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZCA9IHRoaXMuaW5zZXJ0QmFja2dyb3VuZCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByb2plY3QuZGVzZWxlY3RBbGwoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGFVcmwgPSBcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LFwiICsgZW5jb2RlVVJJQ29tcG9uZW50KFxyXG4gICAgICAgICAgICAgICAgPHN0cmluZz50aGlzLnByb2plY3QuZXhwb3J0U1ZHKHsgYXNTdHJpbmc6IHRydWUgfSkpO1xyXG4gICAgICAgICAgICBjb25zdCBibG9iID0gRG9tSGVscGVycy5kYXRhVVJMVG9CbG9iKGRhdGFVcmwpO1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IFNrZXRjaEhlbHBlcnMuZ2V0U2tldGNoRmlsZU5hbWUoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCwgNDAsIFwic3ZnXCIpO1xyXG4gICAgICAgICAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJhY2tncm91bmQpIHtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluc2VydCBza2V0Y2ggYmFja2dyb3VuZCB0byBwcm92aWRlIGJhY2tncm91bmQgZmlsbCAoaWYgbmVjZXNzYXJ5KVxyXG4gICAgICAgICAqICAgYW5kIGFkZCBtYXJnaW4gYXJvdW5kIGVkZ2VzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgaW5zZXJ0QmFja2dyb3VuZCgpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRWaWV3YWJsZUJvdW5kcygpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXJnaW4gPSBNYXRoLm1heChib3VuZHMud2lkdGgsIGJvdW5kcy5oZWlnaHQpICogMC4wMjtcclxuICAgICAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHBhcGVyLlNoYXBlLlJlY3RhbmdsZShcclxuICAgICAgICAgICAgICAgIGJvdW5kcy50b3BMZWZ0LnN1YnRyYWN0KG1hcmdpbiksXHJcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tUmlnaHQuYWRkKG1hcmdpbikpO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLmZpbGxDb2xvciA9IHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC5zZW5kVG9CYWNrKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dvcmtzcGFjZS5pbnNlcnRDaGlsZCgwLCBiYWNrZ3JvdW5kKTtcclxuICAgICAgICAgICAgcmV0dXJuIGJhY2tncm91bmQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGFkZEJsb2NrKHRleHRCbG9jazogVGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdGV4dEJsb2NrLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigncmVjZWl2ZWQgYmxvY2sgd2l0aG91dCBpZCcsIHRleHRCbG9jayk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbdGV4dEJsb2NrLl9pZF07XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUmVjZWl2ZWQgYWRkQmxvY2sgZm9yIGJsb2NrIHRoYXQgaXMgYWxyZWFkeSBsb2FkZWRcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBib3VuZHM6IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRleHRCbG9jay5vdXRsaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2FkU2VnbWVudCA9IChyZWNvcmQ6IFNlZ21lbnRSZWNvcmQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludCA9IHJlY29yZFswXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocG9pbnQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlNlZ21lbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZFsxXSAmJiBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZFsyXSAmJiBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzJdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuU2VnbWVudChuZXcgcGFwZXIuUG9pbnQocmVjb3JkKSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgYm91bmRzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwcGVyOiB0ZXh0QmxvY2sub3V0bGluZS50b3Auc2VnbWVudHMubWFwKGxvYWRTZWdtZW50KSxcclxuICAgICAgICAgICAgICAgICAgICBsb3dlcjogdGV4dEJsb2NrLm91dGxpbmUuYm90dG9tLnNlZ21lbnRzLm1hcChsb2FkU2VnbWVudClcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGl0ZW0gPSBuZXcgVGV4dFdhcnAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZhbGxiYWNrRm9udCxcclxuICAgICAgICAgICAgICAgIHRleHRCbG9jay50ZXh0LFxyXG4gICAgICAgICAgICAgICAgYm91bmRzLFxyXG4gICAgICAgICAgICAgICAgbnVsbCwge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogdGV4dEJsb2NrLnRleHRDb2xvciB8fCBcInJlZFwiLCAgICAvLyB0ZXh0Q29sb3Igc2hvdWxkIGhhdmUgYmVlbiBzZXQgZWxzZXdoZXJlIFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl93b3Jrc3BhY2UuYWRkQ2hpbGQoaXRlbSk7XHJcblxyXG4gICAgICAgICAgICBwYXBlckV4dC5leHRlbmRNb3VzZUV2ZW50cyhpdGVtKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGV4dEJsb2NrLm91dGxpbmUgJiYgdGV4dEJsb2NrLnBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gbmV3IHBhcGVyLlBvaW50KHRleHRCbG9jay5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGl0ZW0ub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNlbGVjdCBuZXh0IGl0ZW0gYmVoaW5kXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG90aGVySGl0cyA9ICg8VGV4dFdhcnBbXT5fLnZhbHVlcyh0aGlzLl90ZXh0QmxvY2tJdGVtcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoaSA9PiBpLmlkICE9PSBpdGVtLmlkICYmICEhaS5oaXRUZXN0KGV2LnBvaW50KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJJdGVtID0gXy5zb3J0Qnkob3RoZXJIaXRzLCBpID0+IGkuaW5kZXgpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdGhlckl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJJdGVtLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvdGhlcklkID0gXy5maW5kS2V5KHRoaXMuX3RleHRCbG9ja0l0ZW1zLCBpID0+IGkgPT09IG90aGVySXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdGhlcklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGl0ZW1JZDogb3RoZXJJZCwgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IHRleHRCbG9jay5faWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdGVtLm9uKHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdTdGFydCwgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5icmluZ1RvRnJvbnQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW0udHJhbnNsYXRlKGV2LmRlbHRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdGVtLm9uKHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdFbmQsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+dGhpcy5nZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgYmxvY2suX2lkID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IHRleHRCbG9jay5faWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1DaGFuZ2UkID0gUGFwZXJOb3RpZnkub2JzZXJ2ZShpdGVtLCBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkdFT01FVFJZKTtcclxuICAgICAgICAgICAgaXRlbUNoYW5nZSRcclxuICAgICAgICAgICAgICAgIC5kZWJvdW5jZShXb3Jrc3BhY2VDb250cm9sbGVyLkJMT0NLX0JPVU5EU19DSEFOR0VfVEhST1RUTEVfTVMpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSA8VGV4dEJsb2NrPnRoaXMuZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5faWQgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0ZW0uZGF0YSA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgIGlmICghdGV4dEJsb2NrLnBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLnBvaW50LmFkZChcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoaXRlbS5ib3VuZHMud2lkdGggLyAyLCBpdGVtLmJvdW5kcy5oZWlnaHQgLyAyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKDUwKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdGV4dEJsb2NrSXRlbXNbdGV4dEJsb2NrLl9pZF0gPSBpdGVtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBnZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW06IFRleHRXYXJwKTogQmxvY2tBcnJhbmdlbWVudCB7XHJcbiAgICAgICAgICAgIC8vIGV4cG9ydCByZXR1cm5zIGFuIGFycmF5IHdpdGggaXRlbSB0eXBlIGFuZCBzZXJpYWxpemVkIG9iamVjdDpcclxuICAgICAgICAgICAgLy8gICBbXCJQYXRoXCIsIFBhdGhSZWNvcmRdXHJcbiAgICAgICAgICAgIGNvbnN0IHRvcCA9IDxQYXRoUmVjb3JkPml0ZW0udXBwZXIuZXhwb3J0SlNPTih7IGFzU3RyaW5nOiBmYWxzZSB9KVsxXTtcclxuICAgICAgICAgICAgY29uc3QgYm90dG9tID0gPFBhdGhSZWNvcmQ+aXRlbS5sb3dlci5leHBvcnRKU09OKHsgYXNTdHJpbmc6IGZhbHNlIH0pWzFdO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBbaXRlbS5wb3NpdGlvbi54LCBpdGVtLnBvc2l0aW9uLnldLFxyXG4gICAgICAgICAgICAgICAgb3V0bGluZTogeyB0b3AsIGJvdHRvbSB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRCYWNrZ3JvdW5kSW1hZ2UodXJsOiBzdHJpbmcpe1xyXG4gICAgICAgICAgICBpZighdXJsKXtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2JhY2tncm91bmRJbWFnZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZEltYWdlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZEltYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgcmFzdGVyID0gbmV3IHBhcGVyLlJhc3Rlcih1cmwpO1xyXG4gICAgICAgICAgICAoPGFueT5yYXN0ZXIpLm9uTG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJhc3Rlci5zZW5kVG9CYWNrKCk7XHJcbiAgICAgICAgICAgICAgICByYXN0ZXIuZml0Qm91bmRzKHRoaXMuZ2V0Vmlld2FibGVCb3VuZHMoKSk7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9iYWNrZ3JvdW5kSW1hZ2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmRJbWFnZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmRJbWFnZSA9IHJhc3RlcjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFjdGlvbnMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XHJcblxyXG4gICAgICAgIGVkaXRvciA9IHtcclxuICAgICAgICAgICAgaW5pdFdvcmtzcGFjZTogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmluaXRXb3Jrc3BhY2VcIiksXHJcbiAgICAgICAgICAgIGxvYWRGb250OiB0aGlzLnRvcGljPHN0cmluZz4oXCJkZXNpZ25lci5sb2FkRm9udFwiKSxcclxuICAgICAgICAgICAgem9vbVRvRml0OiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuem9vbVRvRml0XCIpLFxyXG4gICAgICAgICAgICBleHBvcnRpbmdJbWFnZTogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydEltYWdlXCIpLFxyXG4gICAgICAgICAgICBleHBvcnRQTkc6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRQTkdcIiksXHJcbiAgICAgICAgICAgIGV4cG9ydFNWRzogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydFNWR1wiKSxcclxuICAgICAgICAgICAgdmlld0NoYW5nZWQ6IHRoaXMudG9waWM8cGFwZXIuUmVjdGFuZ2xlPihcImRlc2lnbmVyLnZpZXdDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICB1cGRhdGVTbmFwc2hvdDogdGhpcy50b3BpYzx7IHNrZXRjaElkOiBzdHJpbmcsIHBuZ0RhdGFVcmw6IHN0cmluZyB9PihcImRlc2lnbmVyLnVwZGF0ZVNuYXBzaG90XCIpLFxyXG4gICAgICAgICAgICB0b2dnbGVIZWxwOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIudG9nZ2xlSGVscFwiKSxcclxuICAgICAgICAgICAgb3BlblNhbXBsZTogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLm9wZW5TYW1wbGVcIiksXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBza2V0Y2ggPSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5jcmVhdGVcIiksXHJcbiAgICAgICAgICAgIGNsZWFyOiB0aGlzLnRvcGljPHZvaWQ+KFwic2tldGNoLmNsZWFyXCIpLFxyXG4gICAgICAgICAgICBjbG9uZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5jbG9uZVwiKSxcclxuICAgICAgICAgICAgb3BlbjogdGhpcy50b3BpYzxzdHJpbmc+KFwic2tldGNoLm9wZW5cIiksXHJcbiAgICAgICAgICAgIGF0dHJVcGRhdGU6IHRoaXMudG9waWM8U2tldGNoQXR0cj4oXCJza2V0Y2guYXR0clVwZGF0ZVwiKSxcclxuICAgICAgICAgICAgc2V0U2VsZWN0aW9uOiB0aGlzLnRvcGljPFdvcmtzcGFjZU9iamVjdFJlZj4oXCJza2V0Y2guc2V0U2VsZWN0aW9uXCIpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRleHRCbG9jayA9IHtcclxuICAgICAgICAgICAgYWRkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0QmxvY2suYWRkXCIpLFxyXG4gICAgICAgICAgICB1cGRhdGVBdHRyOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0QmxvY2sudXBkYXRlQXR0clwiKSxcclxuICAgICAgICAgICAgdXBkYXRlQXJyYW5nZTogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2VcIiksXHJcbiAgICAgICAgICAgIHJlbW92ZTogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dEJsb2NrLnJlbW92ZVwiKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBFdmVudHMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XHJcblxyXG4gICAgICAgIGVkaXRvciA9IHtcclxuICAgICAgICAgICAgcmVzb3VyY2VzUmVhZHk6IHRoaXMudG9waWM8Ym9vbGVhbj4oXCJhcHAucmVzb3VyY2VzUmVhZHlcIiksXHJcbiAgICAgICAgICAgIHdvcmtzcGFjZUluaXRpYWxpemVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiYXBwLndvcmtzcGFjZUluaXRpYWxpemVkXCIpLFxyXG4gICAgICAgICAgICBmb250TG9hZGVkOiB0aGlzLnRvcGljPG9wZW50eXBlLkZvbnQ+KFwiYXBwLmZvbnRMb2FkZWRcIiksXHJcbiAgICAgICAgICAgIHpvb21Ub0ZpdFJlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZFwiKSxcclxuICAgICAgICAgICAgZXhwb3J0UE5HUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0UE5HUmVxdWVzdGVkXCIpLFxyXG4gICAgICAgICAgICBleHBvcnRTVkdSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRTVkdSZXF1ZXN0ZWRcIiksXHJcbiAgICAgICAgICAgIHZpZXdDaGFuZ2VkOiB0aGlzLnRvcGljPHBhcGVyLlJlY3RhbmdsZT4oXCJkZXNpZ25lci52aWV3Q2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgc25hcHNob3RFeHBpcmVkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJkZXNpZ25lci5zbmFwc2hvdEV4cGlyZWRcIiksXHJcbiAgICAgICAgICAgIHVzZXJNZXNzYWdlQ2hhbmdlZDogdGhpcy50b3BpYzxzdHJpbmc+KFwiZGVzaWduZXIudXNlck1lc3NhZ2VDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBzaG93SGVscENoYW5nZWQ6IHRoaXMudG9waWM8Ym9vbGVhbj4oXCJkZXNpZ25lci5zaG93SGVscENoYW5nZWRcIilcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBza2V0Y2ggPSB7XHJcbiAgICAgICAgICAgIGxvYWRlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmxvYWRlZFwiKSxcclxuICAgICAgICAgICAgYXR0ckNoYW5nZWQ6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5hdHRyQ2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgY29udGVudENoYW5nZWQ6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5jb250ZW50Q2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgZWRpdGluZ0l0ZW1DaGFuZ2VkOiB0aGlzLnRvcGljPFBvc2l0aW9uZWRPYmplY3RSZWY+KFwic2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogdGhpcy50b3BpYzxXb3Jrc3BhY2VPYmplY3RSZWY+KFwic2tldGNoLnNlbGVjdGlvbkNoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIHNhdmVMb2NhbFJlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcInNrZXRjaC5zYXZlbG9jYWwuc2F2ZUxvY2FsUmVxdWVzdGVkXCIpLFxyXG4gICAgICAgICAgICBjbG9uZWQ6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5jbG9uZWRcIiksXHJcbiAgICAgICAgICAgIGltYWdlVXBsb2FkZWQ6IHRoaXMudG9waWM8c3RyaW5nPihcInNrZXRjaC5pbWFnZVVwbG9hZGVkXCIpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRleHRibG9jayA9IHtcclxuICAgICAgICAgICAgYWRkZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hZGRlZFwiKSxcclxuICAgICAgICAgICAgYXR0ckNoYW5nZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hdHRyQ2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgZm9udFJlYWR5OiB0aGlzLnRvcGljPHsgdGV4dEJsb2NrSWQ6IHN0cmluZywgZm9udDogb3BlbnR5cGUuRm9udCB9PihcInRleHRibG9jay5mb250UmVhZHlcIiksXHJcbiAgICAgICAgICAgIGFycmFuZ2VDaGFuZ2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYXJyYW5nZUNoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIHJlbW92ZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5yZW1vdmVkXCIpLFxyXG4gICAgICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5sb2FkZWRcIiksXHJcbiAgICAgICAgICAgIGVkaXRvckNsb3NlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmVkaXRvckNsb3NlZFwiKSxcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbHMge1xyXG4gICAgICAgIGFjdGlvbnM6IEFjdGlvbnMgPSBuZXcgQWN0aW9ucygpO1xyXG4gICAgICAgIGV2ZW50czogRXZlbnRzID0gbmV3IEV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIHR5cGUgQWN0aW9uVHlwZXMgPVxyXG4gICAgICAgIFwic2tldGNoLmNyZWF0ZVwiXHJcbiAgICAgICAgfCBcInNrZXRjaC51cGRhdGVcIlxyXG4gICAgICAgIHwgXCJ0ZXh0YmxvY2suYWRkXCJcclxuICAgICAgICB8IFwidGV4dGJsb2NrLnVwZGF0ZVwiO1xyXG5cclxuICAgIHR5cGUgRXZlbnRUeXBlcyA9XHJcbiAgICAgICAgXCJza2V0Y2gubG9hZGVkXCJcclxuICAgICAgICB8IFwic2tldGNoLmNoYW5nZWRcIlxyXG4gICAgICAgIHwgXCJ0ZXh0YmxvY2suYWRkZWRcIlxyXG4gICAgICAgIHwgXCJ0ZXh0YmxvY2suY2hhbmdlZFwiO1xyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVkNvbnRyb2wge1xyXG4gICAgICAgIHJlbmRlcigpOiBWTm9kZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBPcGVyYXRpb24gZXh0ZW5kcyBWQ29udHJvbCB7XHJcbiAgICAgICAgb25DbG9zZTogKCkgPT4gdm9pZDsgXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBFZGl0b3JTdGF0ZSB7XHJcbiAgICAgICAgYnJvd3NlcklkPzogc3RyaW5nO1xyXG4gICAgICAgIGVkaXRpbmdJdGVtPzogUG9zaXRpb25lZE9iamVjdFJlZjtcclxuICAgICAgICBzZWxlY3Rpb24/OiBXb3Jrc3BhY2VPYmplY3RSZWY7XHJcbiAgICAgICAgbG9hZGluZ1NrZXRjaD86IGJvb2xlYW47XHJcbiAgICAgICAgdXNlck1lc3NhZ2U/OiBzdHJpbmc7XHJcbiAgICAgICAgc2tldGNoPzogU2tldGNoO1xyXG4gICAgICAgIHNob3dIZWxwPzogYm9vbGVhbjtcclxuICAgICAgICBza2V0Y2hJc0RpcnR5PzogYm9vbGVhbjtcclxuICAgICAgICBvcGVyYXRpb24/OiBPcGVyYXRpb247XHJcbiAgICAgICAgdHJhbnNwYXJlbmN5PzogYm9vbGVhbjtcclxuICAgICAgICB1cGxvYWRlZEltYWdlPzogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU3RvcmVSZXNvdXJjZXMge1xyXG4gICAgICAgIGZhbGxiYWNrRm9udD86IG9wZW50eXBlLkZvbnRcclxuICAgICAgICBmb250Q2F0YWxvZz86IEZvbnRTaGFwZS5Gb250Q2F0YWxvZ1xyXG4gICAgICAgIHBhcnNlZEZvbnRzPzogRm9udFNoYXBlLlBhcnNlZEZvbnRzXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBTa2V0Y2ggZXh0ZW5kcyBTa2V0Y2hBdHRyIHtcclxuICAgICAgICBfaWQ6IHN0cmluZztcclxuICAgICAgICBicm93c2VySWQ/OiBzdHJpbmc7XHJcbiAgICAgICAgc2F2ZWRBdD86IERhdGU7XHJcbiAgICAgICAgdGV4dEJsb2Nrcz86IFRleHRCbG9ja1tdO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2tldGNoQXR0ciB7XHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgICAgIGRlZmF1bHRUZXh0QmxvY2tBdHRyPzogVGV4dEJsb2NrO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRm9udERlc2NyaXB0aW9uIHtcclxuICAgICAgICBmYW1pbHk6IHN0cmluZztcclxuICAgICAgICBjYXRlZ29yeTogc3RyaW5nO1xyXG4gICAgICAgIHZhcmlhbnQ6IHN0cmluZztcclxuICAgICAgICB1cmw6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFdvcmtzcGFjZU9iamVjdFJlZiB7XHJcbiAgICAgICAgaXRlbUlkOiBzdHJpbmc7XHJcbiAgICAgICAgaXRlbVR5cGU/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQb3NpdGlvbmVkT2JqZWN0UmVmIGV4dGVuZHMgV29ya3NwYWNlT2JqZWN0UmVmIHtcclxuICAgICAgICBjbGllbnRYPzogbnVtYmVyO1xyXG4gICAgICAgIGNsaWVudFk/OiBudW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZXh0QmxvY2sgZXh0ZW5kcyBCbG9ja0FycmFuZ2VtZW50IHtcclxuICAgICAgICBfaWQ/OiBzdHJpbmc7XHJcbiAgICAgICAgdGV4dD86IHN0cmluZztcclxuICAgICAgICB0ZXh0Q29sb3I/OiBzdHJpbmc7XHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgICAgIGZvbnRGYW1pbHk/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFZhcmlhbnQ/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCbG9ja0FycmFuZ2VtZW50IHtcclxuICAgICAgICBwb3NpdGlvbj86IG51bWJlcltdLFxyXG4gICAgICAgIG91dGxpbmU/OiB7XHJcbiAgICAgICAgICAgIHRvcDogUGF0aFJlY29yZCxcclxuICAgICAgICAgICAgYm90dG9tOiBQYXRoUmVjb3JkXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFja2dyb3VuZEFjdGlvblN0YXR1cyB7XHJcbiAgICAgICAgYWN0aW9uPzogT2JqZWN0O1xyXG4gICAgICAgIHJlamVjdGVkPzogYm9vbGVhbjtcclxuICAgICAgICBlcnJvcj86IGJvb2xlYW5cclxuICAgICAgICBtZXNzYWdlPzogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUGF0aFJlY29yZCB7XHJcbiAgICAgICAgc2VnbWVudHM6IFNlZ21lbnRSZWNvcmRbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgdHlwZSBTZWdtZW50UmVjb3JkID0gQXJyYXk8UG9pbnRSZWNvcmQ+IHwgQXJyYXk8bnVtYmVyPjtcclxuXHJcbiAgICBleHBvcnQgdHlwZSBQb2ludFJlY29yZCA9IEFycmF5PG51bWJlcj47XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEltYWdlIGltcGxlbWVudHMgT3BlcmF0aW9uIHtcclxuXHJcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIG9uQ2xvc2U6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW5kZXIoKTogVk5vZGUge1xyXG4gICAgICAgICAgICByZXR1cm4gaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJoM1wiLCBbXCJVcGxvYWQgaW1hZ2VcIl0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZmlsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZXYudGFyZ2V0KS5maWxlc1swXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWQoZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHVwbG9hZChmaWxlKSB7XHJcbiAgICAgICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgdmFyIHVybCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTDtcclxuICAgICAgICAgICAgdmFyIHNyYyA9IHVybC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuaW1hZ2VVcGxvYWRlZChzcmMpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2UgJiYgdGhpcy5vbkNsb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIiAgICBcclxubmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRGb250RGVzY3JpcHRpb24oZmFtaWx5OiBGb250U2hhcGUuRmFtaWx5UmVjb3JkLCB2YXJpYW50Pzogc3RyaW5nKVxyXG4gICAgICAgIDogRm9udERlc2NyaXB0aW9uIHtcclxuICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XHJcbiAgICAgICAgdXJsID0gZmFtaWx5LmZpbGVzW3ZhcmlhbnQgfHwgXCJyZWd1bGFyXCJdO1xyXG4gICAgICAgIGlmKCF1cmwpe1xyXG4gICAgICAgICAgICB1cmwgPSBmYW1pbHkuZmlsZXNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZhbWlseTogZmFtaWx5LmZhbWlseSxcclxuICAgICAgICAgICAgY2F0ZWdvcnk6IGZhbWlseS5jYXRlZ29yeSxcclxuICAgICAgICAgICAgdmFyaWFudDogdmFyaWFudCxcclxuICAgICAgICAgICAgdXJsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUzNBY2Nlc3Mge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVcGxvYWQgZmlsZSB0byBhcHBsaWNhdGlvbiBTMyBidWNrZXQuXHJcbiAgICAgICAgICogUmV0dXJucyB1cGxvYWQgVVJMIGFzIGEgcHJvbWlzZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgcHV0RmlsZShmaWxlTmFtZTogc3RyaW5nLCBmaWxlVHlwZTogc3RyaW5nLCBkYXRhOiBCbG9iIHwgc3RyaW5nKVxyXG4gICAgICAgICAgICA6IEpRdWVyeVByb21pc2U8c3RyaW5nPiB7XHJcblxyXG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMvaXNzdWVzLzE5MCAgIFxyXG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvRmlyZWZveC8pICYmICFmaWxlVHlwZS5tYXRjaCgvOy8pKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hhcnNldCA9ICc7IGNoYXJzZXQ9VVRGLTgnO1xyXG4gICAgICAgICAgICAgICAgZmlsZVR5cGUgKz0gY2hhcnNldDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2lnblVybCA9IGAvYXBpL3N0b3JhZ2UvYWNjZXNzP2ZpbGVOYW1lPSR7ZmlsZU5hbWV9JmZpbGVUeXBlPSR7ZmlsZVR5cGV9YDtcclxuICAgICAgICAgICAgLy8gZ2V0IHNpZ25lZCBVUkxcclxuICAgICAgICAgICAgcmV0dXJuICQuZ2V0SlNPTihzaWduVXJsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBzaWduUmVzcG9uc2UgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBQVVQgZmlsZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1dFJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHNpZ25SZXNwb25zZS5zaWduZWRSZXF1ZXN0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIngtYW16LWFjbFwiOiBcInB1YmxpYy1yZWFkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmlsZVR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5hamF4KHB1dFJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXRSZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVwbG9hZGVkIGZpbGVcIiwgc2lnblJlc3BvbnNlLnVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2lnblJlc3BvbnNlLnVybDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciB1cGxvYWRpbmcgdG8gUzNcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3Igb24gL2FwaS9zdG9yYWdlL2FjY2Vzc1wiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEb3dubG9hZCBmaWxlIGZyb20gYnVja2V0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGdldEpzb24oZmlsZU5hbWU6IHN0cmluZyk6IEpRdWVyeVByb21pc2U8T2JqZWN0PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZpbGVVcmwoZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb3dubG9hZGluZ1wiLCByZXNwb25zZS51cmwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHJlc3BvbnNlLnVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGdldEZpbGVVcmwoZmlsZU5hbWU6IHN0cmluZyk6IEpRdWVyeVByb21pc2U8eyB1cmw6IHN0cmluZyB9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBgL2FwaS9zdG9yYWdlL3VybD9maWxlTmFtZT0ke2ZpbGVOYW1lfWAsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ29sb3JQaWNrZXIge1xyXG5cclxuICAgICAgICBzdGF0aWMgREVGQVVMVF9QQUxFVFRFX0dST1VQUyA9IFtcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvODA3XHJcbiAgICAgICAgICAgICAgICBcIiNlZTQwMzVcIixcclxuICAgICAgICAgICAgICAgIFwiI2YzNzczNlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmRmNDk4XCIsXHJcbiAgICAgICAgICAgICAgICBcIiM3YmMwNDNcIixcclxuICAgICAgICAgICAgICAgIFwiIzAzOTJjZlwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS84OTRcclxuICAgICAgICAgICAgICAgIFwiI2VkYzk1MVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZWI2ODQxXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNjYzJhMzZcIixcclxuICAgICAgICAgICAgICAgIFwiIzRmMzcyZFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjMDBhMGIwXCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzE2NFxyXG4gICAgICAgICAgICAgICAgXCIjMWI4NWI4XCIsXHJcbiAgICAgICAgICAgICAgICBcIiM1YTUyNTVcIixcclxuICAgICAgICAgICAgICAgIFwiIzU1OWU4M1wiLFxyXG4gICAgICAgICAgICAgICAgXCIjYWU1YTQxXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNjM2NiNzFcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvMzg5XHJcbiAgICAgICAgICAgICAgICBcIiM0YjM4MzJcIixcclxuICAgICAgICAgICAgICAgIFwiIzg1NDQ0MlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmZmNGU2XCIsXHJcbiAgICAgICAgICAgICAgICBcIiMzYzJmMmZcIixcclxuICAgICAgICAgICAgICAgIFwiI2JlOWI3YlwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS80NTVcclxuICAgICAgICAgICAgICAgIFwiI2ZmNGU1MFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmM5MTNhXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmOWQ2MmVcIixcclxuICAgICAgICAgICAgICAgIFwiI2VhZTM3NFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZTJmNGM3XCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzcwMFxyXG4gICAgICAgICAgICAgICAgXCIjZDExMTQxXCIsXHJcbiAgICAgICAgICAgICAgICBcIiMwMGIxNTlcIixcclxuICAgICAgICAgICAgICAgIFwiIzAwYWVkYlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZjM3NzM1XCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmZmM0MjVcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvODI2XHJcbiAgICAgICAgICAgICAgICBcIiNlOGQxNzRcIixcclxuICAgICAgICAgICAgICAgIFwiI2UzOWU1NFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZDY0ZDRkXCIsXHJcbiAgICAgICAgICAgICAgICBcIiM0ZDczNThcIixcclxuICAgICAgICAgICAgICAgIFwiIzllZDY3MFwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHN0YXRpYyBNT05PX1BBTEVUVEUgPSBbXCIjMDAwXCIsIFwiIzQ0NFwiLCBcIiM2NjZcIiwgXCIjOTk5XCIsIFwiI2NjY1wiLCBcIiNlZWVcIiwgXCIjZjNmM2YzXCIsIFwiI2ZmZlwiXTtcclxuXHJcbiAgICAgICAgc3RhdGljIHNldHVwKGVsZW0sIGZlYXR1cmVkQ29sb3JzOiBzdHJpbmdbXSwgb25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgY29uc3QgZmVhdHVyZWRHcm91cHMgPSBfLmNodW5rKGZlYXR1cmVkQ29sb3JzLCA1KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZvciBlYWNoIHBhbGV0dGUgZ3JvdXBcclxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFBhbGV0dGVHcm91cHMgPSBDb2xvclBpY2tlci5ERUZBVUxUX1BBTEVUVEVfR1JPVVBTLm1hcChncm91cCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyc2VkR3JvdXAgPSBncm91cC5tYXAoYyA9PiBuZXcgcGFwZXIuQ29sb3IoYykpO1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGxpZ2h0IHZhcmlhbnRzIG9mIGRhcmtlc3QgdGhyZWVcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFkZENvbG9ycyA9IF8uc29ydEJ5KHBhcnNlZEdyb3VwLCBjID0+IGMubGlnaHRuZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zbGljZSgwLCAzKVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoYyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGMyID0gYy5jbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjMi5saWdodG5lc3MgPSAwLjg1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYzI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRHcm91cCA9IHBhcnNlZEdyb3VwLmNvbmNhdChhZGRDb2xvcnMpO1xyXG4gICAgICAgICAgICAgICAgcGFyc2VkR3JvdXAgPSBfLnNvcnRCeShwYXJzZWRHcm91cCwgYyA9PiBjLmxpZ2h0bmVzcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkR3JvdXAubWFwKGMgPT4gYy50b0NTUyh0cnVlKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcGFsZXR0ZSA9IGZlYXR1cmVkR3JvdXBzLmNvbmNhdChkZWZhdWx0UGFsZXR0ZUdyb3Vwcyk7XHJcbiAgICAgICAgICAgIHBhbGV0dGUucHVzaChDb2xvclBpY2tlci5NT05PX1BBTEVUVEUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNlbCA9IDxhbnk+JChlbGVtKTtcclxuICAgICAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oe1xyXG4gICAgICAgICAgICAgICAgc2hvd0lucHV0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dFbXB0eTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHByZWZlcnJlZEZvcm1hdDogXCJoZXhcIixcclxuICAgICAgICAgICAgICAgIHNob3dCdXR0b25zOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNob3dBbHBoYTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNob3dQYWxldHRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2hvd1NlbGVjdGlvblBhbGV0dGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcGFsZXR0ZTogcGFsZXR0ZSxcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZUtleTogXCJza2V0Y2h0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2U6IG9uQ2hhbmdlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHN0YXRpYyBzZXQoZWxlbTogSFRNTEVsZW1lbnQsIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oXCJzZXRcIiwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGRlc3Ryb3koZWxlbSkge1xyXG4gICAgICAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bShcImRlc3Ryb3lcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBFZGl0b3JCYXIgZXh0ZW5kcyBDb21wb25lbnQ8RWRpdG9yU3RhdGU+IHtcclxuXHJcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNrZXRjaERvbSQgPSBzdG9yZS5ldmVudHMubWVyZ2UoXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZCxcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQsXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLnVzZXJNZXNzYWdlQ2hhbmdlZClcclxuICAgICAgICAgICAgICAgIC5tYXAobSA9PiB0aGlzLnJlbmRlcihzdG9yZS5zdGF0ZSkpO1xyXG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oc2tldGNoRG9tJCwgY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW5kZXIoc3RhdGU6IEVkaXRvclN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNrZXRjaCA9IHN0YXRlLnNrZXRjaDtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaChcImRpdlwiLCBbXHJcbiAgICAgICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJBZGQgdGV4dDogXCIpLFxyXG4gICAgICAgICAgICAgICAgaChcImlucHV0LmFkZC10ZXh0XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGV2LndoaWNoIHx8IGV2LmtleUNvZGUpID09PSBEb21IZWxwZXJzLktleUNvZGVzLkVudGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGV2LnRhcmdldCAmJiBldi50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2suYWRkLmRpc3BhdGNoKHsgdGV4dDogdGV4dCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYudGFyZ2V0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIlByZXNzIFtFbnRlcl0gdG8gYWRkXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImxhYmVsXCIsIFwiQmFja2dyb3VuZDogXCIpLFxyXG4gICAgICAgICAgICAgICAgaChcImlucHV0LmJhY2tncm91bmQtY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBza2V0Y2guYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB7XHJcbmNvbnNvbGUud2FybihcImJnXCIsIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZS5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGJhY2tncm91bmRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKSB8fCBcIlwiIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZTogKG9sZFZub2RlLCB2bm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldCh2bm9kZS5lbG0sIHNrZXRjaC5iYWNrZ3JvdW5kQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICh2bm9kZSkgPT4gQ29sb3JQaWNrZXIuZGVzdHJveSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgICAgICBCb290U2NyaXB0LmRyb3Bkb3duKHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogXCJza2V0Y2hNZW51XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJBY3Rpb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJOZXdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDcmVhdGUgbmV3IHNrZXRjaFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5jcmVhdGUuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJDbGVhciBhbGxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDbGVhciBza2V0Y2ggY29udGVudHNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guY2xlYXIuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJab29tIHRvIGZpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkZpdCBjb250ZW50cyBpbiB2aWV3XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnpvb21Ub0ZpdC5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlRvZ2dsZSB0cmFuc3BhcmVuY3lcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJTZWUgdGhyb3VnaCB0ZXh0IHRvIGVsZW1lbnRzIGJlaGluZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5zZXRUcmFuc3BhcmVuY3koIXRoaXMuc3RvcmUuc3RhdGUudHJhbnNwYXJlbmN5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJVcGxvYWQgdHJhY2luZyBpbWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlVwbG9hZCBpbWFnZSBpbnRvIHdvcmtzcGFjZSBmb3IgdHJhY2luZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5zaG93T3BlcmF0aW9uKG5ldyBVcGxvYWRJbWFnZSh0aGlzLnN0b3JlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiUmVtb3ZlIHRyYWNpbmcgaW1hZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJSZW1vdmUgYmFja2dyb3VuZCB0cmFjaW5nIGltYWdlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLnJlbW92ZVVwbG9hZGVkSW1hZ2UoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJFeHBvcnQgaW1hZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFeHBvcnQgc2tldGNoIGFzIFBOR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3IuZXhwb3J0UE5HLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRXhwb3J0IFNWR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkV4cG9ydCBza2V0Y2ggYXMgdmVjdG9yIGdyYXBoaWNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLmV4cG9ydFNWRy5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkR1cGxpY2F0ZSBza2V0Y2hcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDb3B5IGNvbnRlbnRzIGludG8gYSBza2V0Y2ggd2l0aCBhIG5ldyBhZGRyZXNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmNsb25lLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiT3BlbiBzYW1wbGUgc2tldGNoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiT3BlbiBhIHNhbXBsZSBza2V0Y2ggdG8gcGxheSB3aXRoXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLm9wZW5TYW1wbGUuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGgoXCJkaXYjcmlnaHRTaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2I3VzZXItbWVzc2FnZVwiLCB7fSwgW3N0YXRlLnVzZXJNZXNzYWdlIHx8IFwiXCJdKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYjc2hvdy1oZWxwLmdseXBoaWNvbi5nbHlwaGljb24tcXVlc3Rpb24tc2lnblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuZGlzcGF0Y2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcblxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImludGVyZmFjZSBKUXVlcnkge1xyXG4gICAgc2VsZWN0cGlja2VyKC4uLmFyZ3M6IGFueVtdKTtcclxuICAgIC8vcmVwbGFjZU9wdGlvbnMob3B0aW9uczogQXJyYXk8e3ZhbHVlOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmd9Pik7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBGb250UGlja2VyIHtcclxuXHJcbiAgICAgICAgZGVmYXVsdEZvbnRGYW1pbHkgPSBcIlJvYm90b1wiO1xyXG4gICAgICAgIHByZXZpZXdGb250U2l6ZSA9IFwiMjhweFwiO1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlLCBibG9jazogVGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgY29uc3QgZG9tJCA9IFJ4Lk9ic2VydmFibGUuanVzdChibG9jaylcclxuICAgICAgICAgICAgICAgIC5tZXJnZShcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihtID0+IG0uZGF0YS5faWQgPT09IGJsb2NrLl9pZClcclxuICAgICAgICAgICAgICAgICAgICAubWFwKG0gPT4gbS5kYXRhKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgLm1hcCh0YiA9PiB0aGlzLnJlbmRlcih0YikpO1xyXG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oZG9tJCwgY29udGFpbmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbmRlcihibG9jazogVGV4dEJsb2NrKTogVk5vZGUge1xyXG4gICAgICAgICAgICBsZXQgdXBkYXRlID0gcGF0Y2ggPT4ge1xyXG4gICAgICAgICAgICAgICAgcGF0Y2guX2lkID0gYmxvY2suX2lkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyLmRpc3BhdGNoKHBhdGNoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudHM6IFZOb2RlW10gPSBbXTtcclxuICAgICAgICAgICAgZWxlbWVudHMucHVzaChcclxuICAgICAgICAgICAgICAgIGgoXCJzZWxlY3RcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJzZWxlY3RQaWNrZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZmFtaWx5LXBpY2tlclwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB2bm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHVwZGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogZXYudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRWYXJpYW50OiBGb250U2hhcGUuRm9udENhdGFsb2cuZGVmYXVsdFZhcmlhbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUucmVzb3VyY2VzLmZvbnRDYXRhbG9nLmdldFJlY29yZChldi50YXJnZXQudmFsdWUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5yZXNvdXJjZXMuZm9udENhdGFsb2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldExpc3QodGhpcy5zdG9yZS5mb250TGlzdExpbWl0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChyZWNvcmQ6IEZvbnRTaGFwZS5GYW1pbHlSZWNvcmQpID0+IGgoXCJvcHRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogcmVjb3JkLmZhbWlseSA9PT0gYmxvY2suZm9udEZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWNvbnRlbnRcIjogYDxzcGFuIHN0eWxlPVwiJHtGb250SGVscGVycy5nZXRTdHlsZVN0cmluZyhyZWNvcmQuZmFtaWx5LCBudWxsLCB0aGlzLnByZXZpZXdGb250U2l6ZSl9XCI+JHtyZWNvcmQuZmFtaWx5fTwvc3Bhbj5gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcmVjb3JkLmZhbWlseV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRGYW1pbHkgPSB0aGlzLnN0b3JlLnJlc291cmNlcy5mb250Q2F0YWxvZy5nZXRSZWNvcmQoYmxvY2suZm9udEZhbWlseSk7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEZhbWlseSAmJiBzZWxlY3RlZEZhbWlseS52YXJpYW50c1xyXG4gICAgICAgICAgICAgICAgJiYgc2VsZWN0ZWRGYW1pbHkudmFyaWFudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChoKFwic2VsZWN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwidmFyaWFudFBpY2tlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYW50LXBpY2tlclwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB2bm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0cGF0Y2g6IChvbGRWbm9kZSwgdm5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUTogd2h5IGNhbid0IHdlIGp1c3QgZG8gc2VsZWN0cGlja2VyKHJlZnJlc2gpIGhlcmU/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEE6IHNlbGVjdHBpY2tlciBoYXMgbWVudGFsIHByb2JsZW1zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoXCJkZXN0cm95XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoeyBmb250VmFyaWFudDogZXYudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmFtaWx5LnZhcmlhbnRzLm1hcCh2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJvcHRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogdiA9PT0gYmxvY2suZm9udFZhcmlhbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGFpbmVyXCI6IFwiYm9keVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGVudFwiOiBgPHNwYW4gc3R5bGU9XCIke0ZvbnRIZWxwZXJzLmdldFN0eWxlU3RyaW5nKHNlbGVjdGVkRmFtaWx5LmZhbWlseSwgdiwgdGhpcy5wcmV2aWV3Rm9udFNpemUpfVwiPiR7dn08L3NwYW4+YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdl0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHsgXCJmb250LXBpY2tlclwiOiB0cnVlIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50c1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEhlbHBEaWFsb2cge1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgY29uc3Qgb3V0ZXIgPSAkKGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIG91dGVyLmFwcGVuZChcIjxoMz5HZXR0aW5nIHN0YXJ0ZWQ8L2gzPlwiKTtcclxuICAgICAgICAgICAgc3RvcmUuc3RhdGUuc2hvd0hlbHAgPyBvdXRlci5zaG93KCkgOiBvdXRlci5oaWRlKCk7XHJcbiAgICAgICAgICAgICQuZ2V0KFwiY29udGVudC9oZWxwLmh0bWxcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9zZSA9ICQoXCI8YnV0dG9uIGNsYXNzPSdidG4gYnRuLWRlZmF1bHQnPiBDbG9zZSA8L2J1dHRvbj5cIik7XHJcbiAgICAgICAgICAgICAgICBjbG9zZS5vbihcImNsaWNrXCIsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuZGlzcGF0Y2goKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgb3V0ZXIuYXBwZW5kKCQoZCkpXHJcbiAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoY2xvc2UpXHJcbiAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXCI8YSBjbGFzcz0ncmlnaHQnIGhyZWY9J21haWx0bzpmaWRkbGVzdGlja3NAY29kZWZsaWdodC5pbyc+RW1haWwgdXM8L2E+XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5zaG93SGVscENoYW5nZWQuc3ViKHNob3cgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2hvdyA/IG91dGVyLnNob3coKSA6IG91dGVyLmhpZGUoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgT3BlcmF0aW9uUGFuZWwge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSl7XHJcbiBcclxuICAgICAgICAgICAgY29uc3QgZG9tJCA9IHN0b3JlLm9wZXJhdGlvbiQubWFwKG9wID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKCFvcCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXYuaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXYub3BlcmF0aW9uXCIsIFtvcC5yZW5kZXIoKV0pO1xyXG4gICAgICAgICAgICB9KSAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTZWxlY3RlZEl0ZW1FZGl0b3Ige1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRvbSQgPSBzdG9yZS5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5vYnNlcnZlKClcclxuICAgICAgICAgICAgICAgIC5tYXAoaSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc0l0ZW0gPSA8UG9zaXRpb25lZE9iamVjdFJlZj5pLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gcG9zSXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBwb3NJdGVtLml0ZW1UeXBlID09PSAnVGV4dEJsb2NrJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBfLmZpbmQoc3RvcmUuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiID0+IGIuX2lkID09PSBwb3NJdGVtLml0ZW1JZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0OiBwb3NJdGVtLmNsaWVudFggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9wOiBwb3NJdGVtLmNsaWVudFkgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFRleHRCbG9ja0VkaXRvcihzdG9yZSkucmVuZGVyKGJsb2NrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRCbG9ja0VkaXRvciBleHRlbmRzIENvbXBvbmVudDxUZXh0QmxvY2s+IHtcclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW5kZXIodGV4dEJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIGxldCB1cGRhdGUgPSB0YiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0Yi5faWQgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyLmRpc3BhdGNoKHRiKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2LnRleHQtYmxvY2stZWRpdG9yXCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiB0ZXh0QmxvY2suX2lkXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJ0ZXh0YXJlYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2OiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoeyB0ZXh0OiAoPEhUTUxUZXh0QXJlYUVsZW1lbnQ+ZXYudGFyZ2V0KS52YWx1ZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoeyB0ZXh0OiBldi50YXJnZXQudmFsdWUgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1jb2xvci1pY29uLmZvcmVcIiwge30sIFwiQVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC50ZXh0LWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlRleHQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2sudGV4dENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB1cGRhdGUoeyB0ZXh0Q29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5iYWNrXCIsIHt9LCBcIkFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCYWNrZ3JvdW5kIGNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTa2V0Y2hIZWxwZXJzLmNvbG9yc0luVXNlKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgYmFja2dyb3VuZENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICh2bm9kZSkgPT4gQ29sb3JQaWNrZXIuZGVzdHJveSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaChcImJ1dHRvbi5kZWxldGUtdGV4dGJsb2NrLmJ0bi5idG4tZGFuZ2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZS5kaXNwYXRjaCh0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuLmdseXBoaWNvbi5nbHlwaGljb24tdHJhc2hcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1waWNrZXItY29udGFpbmVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEZvbnRQaWNrZXIodm5vZGUuZWxtLCB0aGlzLnN0b3JlLCB0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGluc2VydDogKHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IHByb3BzOiBGb250UGlja2VyUHJvcHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBzdG9yZTogdGhpcy5zdG9yZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHNlbGVjdGlvbjogdGV4dEJsb2NrLmZvbnREZXNjLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogKGZvbnREZXNjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgdXBkYXRlKHsgZm9udERlc2MgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIFJlYWN0RE9NLnJlbmRlcihyaChGb250UGlja2VyLCBwcm9wcyksIHZub2RlLmVsbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEdWFsQm91bmRzUGF0aFdhcnAgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBQT0lOVFNfUEVSX1BBVEggPSAyMDA7XHJcbiAgICAgICAgc3RhdGljIFVQREFURV9ERUJPVU5DRSA9IDE1MDtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc291cmNlOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICAgICAgcHJpdmF0ZSBfdXBwZXI6IFN0cmV0Y2hQYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX2xvd2VyOiBTdHJldGNoUGF0aDtcclxuICAgICAgICBwcml2YXRlIF93YXJwZWQ6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgICAgICBwcml2YXRlIF9vdXRsaW5lOiBwYXBlci5QYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX2N1c3RvbVN0eWxlOiBTa2V0Y2hJdGVtU3R5bGU7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBzb3VyY2U6IHBhcGVyLkNvbXBvdW5kUGF0aCxcclxuICAgICAgICAgICAgYm91bmRzPzogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH0sXHJcbiAgICAgICAgICAgIGN1c3RvbVN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcblxyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYnVpbGQgY2hpbGRyZW4gLS1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJvdW5kcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIgPSBuZXcgU3RyZXRjaFBhdGgoYm91bmRzLnVwcGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvd2VyID0gbmV3IFN0cmV0Y2hQYXRoKGJvdW5kcy5sb3dlcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cHBlciA9IG5ldyBTdHJldGNoUGF0aChbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy50b3BMZWZ0KSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLnRvcFJpZ2h0KVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb3dlciA9IG5ldyBTdHJldGNoUGF0aChbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy5ib3R0b21MZWZ0KSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLmJvdHRvbVJpZ2h0KVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbEJvdW5kc09wYWNpdHkgPSAwLjc1O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvd2VyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZSA9IG5ldyBwYXBlci5QYXRoKHsgY2xvc2VkOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVTaGFwZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChzb3VyY2UucGF0aERhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYWRkIGNoaWxkcmVuIC0tXHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkcmVuKFt0aGlzLl9vdXRsaW5lLCB0aGlzLl93YXJwZWQsIHRoaXMuX3VwcGVyLCB0aGlzLl9sb3dlcl0pO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYXNzaWduIHN0eWxlIC0tXHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1c3RvbVN0eWxlID0gY3VzdG9tU3R5bGUgfHwge1xyXG4gICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwiZ3JheVwiXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyAtLSBzZXQgdXAgb2JzZXJ2ZXJzIC0tXHJcblxyXG4gICAgICAgICAgICBSeC5PYnNlcnZhYmxlLm1lcmdlKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG93ZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpKVxyXG4gICAgICAgICAgICAgICAgLmRlYm91bmNlKER1YWxCb3VuZHNQYXRoV2FycC5VUERBVEVfREVCT1VOQ0UpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHBhdGggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT3V0bGluZVNoYXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVXYXJwZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VkKFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZShmbGFncyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkFUVFJJQlVURSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl91cHBlci52aXNpYmxlICE9PSB0aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb3dlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHVwcGVyKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdXBwZXIucGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBsb3dlcigpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvd2VyLnBhdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgc291cmNlKHZhbHVlOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2UgJiYgdGhpcy5fc291cmNlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc291cmNlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgY3VzdG9tU3R5bGUoKTogU2tldGNoSXRlbVN0eWxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1c3RvbVN0eWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGN1c3RvbVN0eWxlKHZhbHVlOiBTa2V0Y2hJdGVtU3R5bGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VzdG9tU3R5bGUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLnN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5iYWNrZ3JvdW5kQ29sb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGxpbmUuZmlsbENvbG9yID0gdmFsdWUuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGxpbmUuZmlsbENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGNvbnRyb2xCb3VuZHNPcGFjaXR5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIub3BhY2l0eSA9IHRoaXMuX2xvd2VyLm9wYWNpdHkgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG91dGxpbmVDb250YWlucyhwb2ludDogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX291dGxpbmUuY29udGFpbnMocG9pbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVXYXJwZWQoKSB7XHJcbiAgICAgICAgICAgIGxldCBvcnRoT3JpZ2luID0gdGhpcy5fc291cmNlLmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5fc291cmNlLmJvdW5kcy53aWR0aDtcclxuICAgICAgICAgICAgbGV0IG9ydGhIZWlnaHQgPSB0aGlzLl9zb3VyY2UuYm91bmRzLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLmR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbihcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyLnBhdGgsIHRoaXMuX2xvd2VyLnBhdGgpO1xyXG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtID0gbmV3IEZvbnRTaGFwZS5QYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChvcnRoT3JpZ2luKTtcclxuICAgICAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIG9ydGhIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhzID0gdGhpcy5fc291cmNlLmNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSA8cGFwZXIuUGF0aD5pdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhQb2ludHMgPSBQYXBlckhlbHBlcnMudHJhY2VQYXRoQXNQb2ludHMocGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgRHVhbEJvdW5kc1BhdGhXYXJwLlBPSU5UU19QRVJfUEFUSClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChwID0+IHRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludChwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFBhdGggPSBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3hQYXRoLnNpbXBsaWZ5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHhQYXRoO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLnJlbW92ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5hZGRDaGlsZHJlbihuZXdQYXRocyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZU91dGxpbmVTaGFwZSgpIHtcclxuICAgICAgICAgICAgY29uc3QgbG93ZXIgPSBuZXcgcGFwZXIuUGF0aCh0aGlzLl9sb3dlci5wYXRoLnNlZ21lbnRzKTtcclxuICAgICAgICAgICAgbG93ZXIucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLnNlZ21lbnRzID0gdGhpcy5fdXBwZXIucGF0aC5zZWdtZW50cy5jb25jYXQobG93ZXIuc2VnbWVudHMpO1xyXG4gICAgICAgICAgICBsb3dlci5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBQYXRoSGFuZGxlIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgICAgICBzdGF0aWMgU0VHTUVOVF9NQVJLRVJfUkFESVVTID0gMTA7XHJcbiAgICAgICAgc3RhdGljIENVUlZFX01BUktFUl9SQURJVVMgPSA2O1xyXG4gICAgICAgIHN0YXRpYyBEUkFHX1RIUkVTSE9MRCA9IDM7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX21hcmtlcjogcGFwZXIuU2hhcGU7XHJcbiAgICAgICAgcHJpdmF0ZSBfc2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgICAgICBwcml2YXRlIF9jdXJ2ZTogcGFwZXIuQ3VydmU7XHJcbiAgICAgICAgcHJpdmF0ZSBfc21vb3RoZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgcHJpdmF0ZSBfY3VydmVTcGxpdCA9IG5ldyBPYnNlcnZhYmxlRXZlbnQ8bnVtYmVyPigpO1xyXG4gICAgICAgIHByaXZhdGUgX2N1cnZlQ2hhbmdlVW5zdWI6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcHJpdmF0ZSBkcmFnZ2luZztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoYXR0YWNoOiBwYXBlci5TZWdtZW50IHwgcGFwZXIuQ3VydmUpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbjogcGFwZXIuUG9pbnQ7XHJcbiAgICAgICAgICAgIGxldCBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgICAgICAgICBpZiAoYXR0YWNoIGluc3RhbmNlb2YgcGFwZXIuU2VnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudCA9IDxwYXBlci5TZWdtZW50PmF0dGFjaDtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgICAgIHBhdGggPSB0aGlzLl9zZWdtZW50LnBhdGg7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXR0YWNoIGluc3RhbmNlb2YgcGFwZXIuQ3VydmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlID0gPHBhcGVyLkN1cnZlPmF0dGFjaDtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fY3VydmUuZ2V0UG9pbnRBdCh0aGlzLl9jdXJ2ZS5sZW5ndGggKiAwLjUpO1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHRoaXMuX2N1cnZlLnBhdGg7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcImF0dGFjaCBtdXN0IGJlIFNlZ21lbnQgb3IgQ3VydmVcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvc2l0aW9uLCBQYXRoSGFuZGxlLlNFR01FTlRfTUFSS0VSX1JBRElVUyk7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5zdHJva2VDb2xvciA9IFwiYmx1ZVwiO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIuZmlsbENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIuc2VsZWN0ZWRDb2xvciA9IG5ldyBwYXBlci5Db2xvcigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9tYXJrZXIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBc1NlZ21lbnQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBc0N1cnZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBhcGVyRXh0LmV4dGVuZE1vdXNlRXZlbnRzKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vbihwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJ2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBjdXJ2ZSwgcHVwYXRlIHRvIHNlZ21lbnQgaGFuZGxlXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlQ2hhbmdlVW5zdWIoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gbmV3IHBhcGVyLlNlZ21lbnQodGhpcy5jZW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnZlSWR4ID0gdGhpcy5fY3VydmUuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VydmUucGF0aC5pbnNlcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlSWR4ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VydmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBc1NlZ21lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnZlU3BsaXQubm90aWZ5KGN1cnZlSWR4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZWdtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5wb2ludCA9IHRoaXMuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zbW9vdGhlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNsYXRlKGV2LmRlbHRhKTtcclxuICAgICAgICAgICAgICAgIGV2LnN0b3AoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uKHBhcGVyLkV2ZW50VHlwZS5jbGljaywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNtb290aGVkID0gIXRoaXMuc21vb3RoZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBldi5zdG9wKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY3VydmVDaGFuZ2VVbnN1YiA9IHBhdGguc3Vic2NyaWJlKGZsYWdzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJ2ZSAmJiAhdGhpcy5fc2VnbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICYmIChmbGFncyAmIFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuU0VHTUVOVFMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBzbW9vdGhlZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Ntb290aGVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IHNtb290aGVkKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Ntb290aGVkID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuaGFuZGxlT3V0ID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGN1cnZlU3BsaXQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jdXJ2ZVNwbGl0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGNlbnRlcigpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGNlbnRlcihwb2ludDogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvaW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdHlsZUFzU2VnbWVudCgpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLm9wYWNpdHkgPSAwLjg7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5kYXNoQXJyYXkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIucmFkaXVzID0gUGF0aEhhbmRsZS5TRUdNRU5UX01BUktFUl9SQURJVVM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0eWxlQXNDdXJ2ZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLm9wYWNpdHkgPSAwLjg7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5kYXNoQXJyYXkgPSBbMiwgMl07XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5yYWRpdXMgPSBQYXRoSGFuZGxlLkNVUlZFX01BUktFUl9SQURJVVM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3RyZXRjaFBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3BhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgcHJpdmF0ZSBfcGF0aENoYW5nZWQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlBhdGg+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHNlZ21lbnRzOiBwYXBlci5TZWdtZW50W10sIHN0eWxlPzogcGFwZXIuU3R5bGUpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3BhdGggPSBuZXcgcGFwZXIuUGF0aChzZWdtZW50cyk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fcGF0aCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3R5bGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGguc3R5bGUgPSBzdHlsZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGguc3Ryb2tlQ29sb3IgPSBcImxpZ2h0Z3JheVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHJva2VXaWR0aCA9IDY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcyBvZiB0aGlzLl9wYXRoLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFNlZ21lbnRIYW5kbGUocyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiB0aGlzLl9wYXRoLmN1cnZlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZShjKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHBhdGgoKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHBhdGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGF0aENoYW5nZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGFkZFNlZ21lbnRIYW5kbGUoc2VnbWVudDogcGFwZXIuU2VnbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZEhhbmRsZShuZXcgUGF0aEhhbmRsZShzZWdtZW50KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGFkZEN1cnZlSGFuZGxlKGN1cnZlOiBwYXBlci5DdXJ2ZSkge1xyXG4gICAgICAgICAgICBsZXQgaGFuZGxlID0gbmV3IFBhdGhIYW5kbGUoY3VydmUpO1xyXG4gICAgICAgICAgICBoYW5kbGUuY3VydmVTcGxpdC5zdWJzY3JpYmVPbmUoY3VydmVJZHggPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZSh0aGlzLl9wYXRoLmN1cnZlc1tjdXJ2ZUlkeF0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZSh0aGlzLl9wYXRoLmN1cnZlc1tjdXJ2ZUlkeCArIDFdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkSGFuZGxlKGhhbmRsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGFkZEhhbmRsZShoYW5kbGU6IFBhdGhIYW5kbGUpIHtcclxuICAgICAgICAgICAgaGFuZGxlLnZpc2libGUgPSB0aGlzLnZpc2libGU7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXRoQ2hhbmdlZC5ub3RpZnkodGhpcy5fcGF0aCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBoYW5kbGUub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXRoQ2hhbmdlZC5ub3RpZnkodGhpcy5fcGF0aCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoaGFuZGxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNZWFzdXJlcyBvZmZzZXRzIG9mIHRleHQgZ2x5cGhzLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dFJ1bGVyIHtcclxuXHJcbiAgICAgICAgZm9udEZhbWlseTogc3RyaW5nO1xyXG4gICAgICAgIGZvbnRXZWlnaHQ6IG51bWJlcjtcclxuICAgICAgICBmb250U2l6ZTogbnVtYmVyO1xyXG5cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCh0ZXh0KTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5jb250ZW50ID0gdGV4dDtcclxuICAgICAgICAgICAgcG9pbnRUZXh0Lmp1c3RpZmljYXRpb24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5mb250RmFtaWx5KSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludFRleHQuZm9udEZhbWlseSA9IHRoaXMuZm9udEZhbWlseTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5mb250V2VpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludFRleHQuZm9udFdlaWdodCA9IHRoaXMuZm9udFdlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5mb250U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBvaW50VGV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldFRleHRPZmZzZXRzKHRleHQpIHtcclxuICAgICAgICAgICAgLy8gTWVhc3VyZSBnbHlwaHMgaW4gcGFpcnMgdG8gY2FwdHVyZSB3aGl0ZSBzcGFjZS5cclxuICAgICAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxyXG4gICAgICAgICAgICB2YXIgZ2x5cGhQYWlycyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpICsgMSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBGb3IgZWFjaCBjaGFyYWN0ZXIsIGZpbmQgY2VudGVyIG9mZnNldC5cclxuICAgICAgICAgICAgdmFyIHhPZmZzZXRzID0gWzBdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBNZWFzdXJlIHRocmVlIGNoYXJhY3RlcnMgYXQgYSB0aW1lIHRvIGdldCB0aGUgYXBwcm9wcmlhdGUgXHJcbiAgICAgICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxyXG4gICAgICAgICAgICAgICAgdmFyIHRyaWFkVGV4dCA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGkgLSAxLCBpICsgMSkpO1xyXG4gICAgICAgICAgICAgICAgdHJpYWRUZXh0LnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXHJcbiAgICAgICAgICAgICAgICAvLyAgIGFuZCBoYWxmIG9mIGN1cnJlbnQgZ2x5cGggcGFpci5cclxuICAgICAgICAgICAgICAgIC8vIE11c3QgYmUgcmlnaHQsIGJlY2F1c2UgaXQgd29ya3MuXHJcbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoXHJcbiAgICAgICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2kgLSAxXS5ib3VuZHMud2lkdGggLyAyXHJcbiAgICAgICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQWRkIG9mZnNldCB3aWR0aCB0byBwcmlvciBvZmZzZXQuIFxyXG4gICAgICAgICAgICAgICAgeE9mZnNldHNbaV0gPSB4T2Zmc2V0c1tpIC0gMV0gKyBvZmZzZXRXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgZ2x5cGhQYWlyIG9mIGdseXBoUGFpcnMpIHtcclxuICAgICAgICAgICAgICAgIGdseXBoUGFpci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHhPZmZzZXRzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dFdhcnAgZXh0ZW5kcyBEdWFsQm91bmRzUGF0aFdhcnAge1xyXG5cclxuICAgICAgICBzdGF0aWMgREVGQVVMVF9GT05UX1NJWkUgPSAxMjg7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2ZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBfdGV4dDogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX2ZvbnRTaXplOiBudW1iZXI7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBmb250OiBvcGVudHlwZS5Gb250LFxyXG4gICAgICAgICAgICB0ZXh0OiBzdHJpbmcsXHJcbiAgICAgICAgICAgIGJvdW5kcz86IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9LFxyXG4gICAgICAgICAgICBmb250U2l6ZT86IG51bWJlcixcclxuICAgICAgICAgICAgc3R5bGU/OiBTa2V0Y2hJdGVtU3R5bGUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghZm9udFNpemUpIHtcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplID0gVGV4dFdhcnAuREVGQVVMVF9GT05UX1NJWkU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGhEYXRhID0gVGV4dFdhcnAuZ2V0UGF0aERhdGEoZm9udCwgdGV4dCwgZm9udFNpemUpO1xyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcblxyXG4gICAgICAgICAgICBzdXBlcihwYXRoLCBib3VuZHMsIHN0eWxlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSBmb250O1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0ID0gdGV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB0ZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IHRleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGV4dFBhdGgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBmb250U2l6ZSgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgZm9udFNpemUodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGZvbnQodmFsdWU6IG9wZW50eXBlLkZvbnQpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl9mb250KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVwZGF0ZVRleHRQYXRoKCkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IFRleHRXYXJwLmdldFBhdGhEYXRhKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udCwgdGhpcy5fdGV4dCwgdGhpcy5fZm9udFNpemUpO1xyXG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IG5ldyBwYXBlci5Db21wb3VuZFBhdGgocGF0aERhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UGF0aERhdGEoZm9udDogb3BlbnR5cGUuRm9udCxcclxuICAgICAgICAgICAgdGV4dDogc3RyaW5nLCBmb250U2l6ZT86IHN0cmluZyB8IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBvcGVuVHlwZVBhdGggPSBmb250LmdldFBhdGgodGV4dCwgMCwgMCxcclxuICAgICAgICAgICAgICAgIE51bWJlcihmb250U2l6ZSkgfHwgVGV4dFdhcnAuREVGQVVMVF9GT05UX1NJWkUpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3BlblR5cGVQYXRoLnRvUGF0aERhdGEoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBTa2V0Y2hJdGVtU3R5bGUgZXh0ZW5kcyBwYXBlci5JU3R5bGUge1xyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIH1cclxuXHJcbn0iXX0=