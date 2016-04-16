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
            // this.store.events.subscribe(m => console.log("event", m.type, m.data));
            // this.store.actions.subscribe(m => console.log("action", m.type, m.data));
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
            this.project.importSVG("img/spiral-logo.svg", function (watermark) {
                _this._watermark = watermark;
                _this._watermark.remove();
            });
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
                _this.getSnapshotPNG(72).then(function (data) {
                    store.actions.editor.updateSnapshot.dispatch({
                        sketchId: _this.store.state.sketch._id, pngDataUrl: data
                    });
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
            var _this = this;
            return new Promise(function (callback) {
                var background = _this.insertBackground(true);
                var raster = _this._workspace.rasterize(dpi, false);
                var data = raster.toDataURL();
                background.remove();
                callback(data);
            });
        };
        WorkspaceController.prototype.downloadPNG = function () {
            var _this = this;
            // Half of max DPI produces approx 4000x4000.
            var dpi = 0.5 * PaperHelpers.getMaxExportDpi(this._workspace.bounds.size);
            this.getSnapshotPNG(dpi).then(function (data) {
                ;
                var fileName = SketchEditor.SketchHelpers.getSketchFileName(_this.store.state.sketch, 40, "png");
                var blob = DomHelpers.dataURLToBlob(data);
                saveAs(blob, fileName);
            });
        };
        WorkspaceController.prototype.downloadSVG = function () {
            var _this = this;
            var completeDownload = function () {
                _this.project.deselectAll();
                var dataUrl = "data:image/svg+xml;utf8," + encodeURIComponent(_this._workspace.exportSVG({ asString: true }));
                var blob = DomHelpers.dataURLToBlob(dataUrl);
                var fileName = SketchEditor.SketchHelpers.getSketchFileName(_this.store.state.sketch, 40, "svg");
                saveAs(blob, fileName);
            };
            if (this.store.state.sketch.backgroundColor) {
                var background = this.insertBackground(false);
                completeDownload();
                background.remove();
            }
            else {
                completeDownload();
            }
        };
        /**
         * Insert sketch background to provide background fill (if necessary)
         *   and add margin around edges.
         */
        WorkspaceController.prototype.insertBackground = function (watermark) {
            var sketchBounds = this.getViewableBounds();
            var margin = Math.max(sketchBounds.width, sketchBounds.height) * 0.02;
            var imageBounds = new paper.Rectangle(sketchBounds.topLeft.subtract(margin), sketchBounds.bottomRight.add(margin));
            var fill = paper.Shape.Rectangle(imageBounds);
            fill.fillColor = this.store.state.sketch.backgroundColor;
            var background = new paper.Group([fill]);
            if (watermark) {
                var watermarkDim = Math.sqrt(imageBounds.size.width * imageBounds.size.height) * 0.1;
                this._watermark.bounds.size = new paper.Size(watermarkDim, watermarkDim);
                this._watermark.position = imageBounds.bottomRight.subtract(watermarkDim);
                var watermarkPath = this._watermark.getItem({ class: paper.CompoundPath });
                var backgroundColor = fill.fillColor;
                if (backgroundColor.lightness > 0.4) {
                    watermarkPath.fillColor = "black";
                    watermarkPath.opacity = 0.05;
                }
                else {
                    watermarkPath.fillColor = "white";
                    watermarkPath.opacity = 0.2;
                }
                background.addChild(this._watermark);
            }
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
                return xPath;
            });
            this._warped.removeChildren();
            this._warped.addChildren(newPaths);
            for (var _i = 0, _a = this._warped.children; _i < _a.length; _i++) {
                var c = _a[_i];
                c.simplify(0.002);
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Eb21IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0Rvd25sb2FkSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL1NlZWRSYW5kb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2NvbGxlY3Rpb25zLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2V2ZW50cy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJOb3RpZnkudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvVmlld1pvb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvbW91c2VFdmVudEV4dC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9wYXBlci9wYXBlci1leHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9Db21wb25lbnQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9WRG9tSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwQ29va2llcy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L2FwcC9BcHBSb3V0ZXIudHMiLCIuLi8uLi9jbGllbnQvYXBwL1N0b3JlLnRzIiwiLi4vLi4vY2xpZW50L2RlbW8vRGVtb01vZHVsZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL0J1aWxkZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9Nb2R1bGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9QcmV2aWV3Q2FudmFzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvUmVuZGVyQ2FudmFzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvU2hhcmVPcHRpb25zVUkudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL21vZGVscy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL2NvbnRyb2xzL0NvbnRyb2xIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvRm9udENob29zZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9JbWFnZUNob29zZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9UZW1wbGF0ZUZvbnRDaG9vc2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvVGV4dElucHV0LnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvdGVtcGxhdGVzL0RpY2tlbnMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL0RvY3VtZW50S2V5SGFuZGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvU2tldGNoRWRpdG9yTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9Ta2V0Y2hIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvV29ya3NwYWNlQ29udHJvbGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvY2hhbm5lbHMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL2NvbnN0YW50cy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvbW9kZWxzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9vcGVyYXRpb25zL1VwbG9hZEltYWdlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9zZXJ2aWNlcy9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivc2VydmljZXMvUzNBY2Nlc3MudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0NvbG9yUGlja2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9FZGl0b3JCYXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0ZvbnRQaWNrZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0hlbHBEaWFsb2cudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL09wZXJhdGlvblBhbmVsLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9TZWxlY3RlZEl0ZW1FZGl0b3IudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL1RleHRCbG9ja0VkaXRvci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL0R1YWxCb3VuZHNQYXRoV2FycC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1BhdGhIYW5kbGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9TdHJldGNoUGF0aC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1RleHRSdWxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1RleHRXYXJwLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLElBQVUsVUFBVSxDQXdMbkI7QUF4TEQsV0FBVSxVQUFVLEVBQUMsQ0FBQztJQUVsQjs7Ozs7O09BTUc7SUFDSCx1QkFBOEIsT0FBTztRQUNqQyxJQUFJLGFBQWEsR0FBRyxVQUFVLENBQUM7UUFDL0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLElBQUksR0FBRyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXZDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUVELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekMsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFFM0IsSUFBSSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFM0MsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNqQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBdEJlLHdCQUFhLGdCQXNCNUIsQ0FBQTtJQUVELDBCQUFpQyxNQUFtQztRQUVoRSxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQXFCO1lBRWpFLElBQUksQ0FBQztnQkFDRCxJQUFJLFFBQVEsR0FBRyxVQUFBLFdBQVc7b0JBRXRCLElBQUksQ0FBQzt3QkFFRCxJQUFNLElBQUksR0FBRzs0QkFDVCxPQUFPLEVBQUUsR0FBRzs0QkFDWixJQUFJLEVBQUUsSUFBSTs0QkFDVixJQUFJLEVBQUUsSUFBSTs0QkFDVixHQUFHLEVBQUUsR0FBRzs0QkFDUixLQUFLLEVBQUUsV0FBVzt5QkFDckIsQ0FBQzt3QkFFRixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRWpCLENBQ0E7b0JBQUEsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDVCxPQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM5QyxDQUFDO2dCQUNMLENBQUMsQ0FBQztnQkFFRixJQUFJLE9BQU8sR0FBRyxVQUFBLEdBQUc7b0JBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDO2dCQUVGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBUyxLQUFLLENBQUMsQ0FBQztnQkFDckMsQ0FBQztnQkFFRCxJQUFNLE9BQU8sR0FBRyxPQUFPLEtBQUssS0FBSyxRQUFRO3NCQUNuQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUM7c0JBQ2hCLEtBQUssQ0FBQztnQkFFWixJQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztxQkFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQztxQkFDZCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFeEIsQ0FDQTtZQUFBLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM3QyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO0lBR04sQ0FBQztJQWhEZSwyQkFBZ0IsbUJBZ0QvQixDQUFBO0lBRVksbUJBQVEsR0FBRztRQUNwQixTQUFTLEVBQUUsQ0FBQztRQUNaLEdBQUcsRUFBRSxDQUFDO1FBQ04sS0FBSyxFQUFFLEVBQUU7UUFDVCxLQUFLLEVBQUUsRUFBRTtRQUNULElBQUksRUFBRSxFQUFFO1FBQ1IsR0FBRyxFQUFFLEVBQUU7UUFDUCxVQUFVLEVBQUUsRUFBRTtRQUNkLFFBQVEsRUFBRSxFQUFFO1FBQ1osR0FBRyxFQUFFLEVBQUU7UUFDUCxNQUFNLEVBQUUsRUFBRTtRQUNWLFFBQVEsRUFBRSxFQUFFO1FBQ1osR0FBRyxFQUFFLEVBQUU7UUFDUCxJQUFJLEVBQUUsRUFBRTtRQUNSLFNBQVMsRUFBRSxFQUFFO1FBQ2IsT0FBTyxFQUFFLEVBQUU7UUFDWCxVQUFVLEVBQUUsRUFBRTtRQUNkLFNBQVMsRUFBRSxFQUFFO1FBQ2IsTUFBTSxFQUFFLEVBQUU7UUFDVixNQUFNLEVBQUUsRUFBRTtRQUNWLE1BQU0sRUFBRSxFQUFFO1FBQ1YsTUFBTSxFQUFFLEVBQUU7UUFDVixNQUFNLEVBQUUsRUFBRTtRQUNWLE1BQU0sRUFBRSxFQUFFO1FBQ1YsTUFBTSxFQUFFLEVBQUU7UUFDVixNQUFNLEVBQUUsRUFBRTtRQUNWLE1BQU0sRUFBRSxFQUFFO1FBQ1YsTUFBTSxFQUFFLEVBQUU7UUFDVixNQUFNLEVBQUUsRUFBRTtRQUNWLE1BQU0sRUFBRSxFQUFFO1FBQ1YsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLFVBQVUsRUFBRSxFQUFFO1FBQ2QsV0FBVyxFQUFFLEVBQUU7UUFDZixTQUFTLEVBQUUsRUFBRTtRQUNiLE9BQU8sRUFBRSxFQUFFO1FBQ1gsT0FBTyxFQUFFLEVBQUU7UUFDWCxPQUFPLEVBQUUsRUFBRTtRQUNYLE9BQU8sRUFBRSxFQUFFO1FBQ1gsT0FBTyxFQUFFLEdBQUc7UUFDWixPQUFPLEVBQUUsR0FBRztRQUNaLE9BQU8sRUFBRSxHQUFHO1FBQ1osT0FBTyxFQUFFLEdBQUc7UUFDWixPQUFPLEVBQUUsR0FBRztRQUNaLE9BQU8sRUFBRSxHQUFHO1FBQ1osUUFBUSxFQUFFLEdBQUc7UUFDYixHQUFHLEVBQUUsR0FBRztRQUNSLFFBQVEsRUFBRSxHQUFHO1FBQ2IsWUFBWSxFQUFFLEdBQUc7UUFDakIsTUFBTSxFQUFFLEdBQUc7UUFDWCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLEdBQUc7UUFDUCxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLEdBQUc7UUFDUixPQUFPLEVBQUUsR0FBRztRQUNaLFVBQVUsRUFBRSxHQUFHO1FBQ2YsU0FBUyxFQUFFLEdBQUc7UUFDZCxLQUFLLEVBQUUsR0FBRztRQUNWLEtBQUssRUFBRSxHQUFHO1FBQ1YsSUFBSSxFQUFFLEdBQUc7UUFDVCxNQUFNLEVBQUUsR0FBRztRQUNYLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFdBQVcsRUFBRSxHQUFHO1FBQ2hCLFdBQVcsRUFBRSxHQUFHO1FBQ2hCLFNBQVMsRUFBRSxHQUFHO1FBQ2QsWUFBWSxFQUFFLEdBQUc7UUFDakIsV0FBVyxFQUFFLEdBQUc7S0FDbkIsQ0FBQztBQUVOLENBQUMsRUF4TFMsVUFBVSxLQUFWLFVBQVUsUUF3TG5CO0FDekxELElBQVUsSUFBSSxDQWlCYjtBQWpCRCxXQUFVLElBQUk7SUFBQyxJQUFBLFNBQVMsQ0FpQnZCO0lBakJjLFdBQUEsU0FBUyxFQUFDLENBQUM7UUFFdEIsd0JBQStCLElBQVksRUFBRSxTQUFpQixFQUFFLFNBQWlCO1lBQzdFLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNkLEdBQUcsQ0FBQyxDQUFlLFVBQWdCLEVBQWhCLEtBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBaEIsY0FBZ0IsRUFBaEIsSUFBZ0IsQ0FBQztnQkFBL0IsSUFBTSxJQUFJLFNBQUE7Z0JBQ1gsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNkLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQSxDQUFDO3dCQUN6RCxLQUFLLENBQUM7b0JBQ1YsQ0FBQztvQkFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO3dCQUFDLElBQUksSUFBSSxHQUFHLENBQUM7b0JBQzdCLElBQUksSUFBSSxJQUFJLENBQUM7Z0JBQ2pCLENBQUM7YUFDSjtZQUNELE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQztRQUNsQyxDQUFDO1FBYmUsd0JBQWMsaUJBYTdCLENBQUE7SUFFTCxDQUFDLEVBakJjLFNBQVMsR0FBVCxjQUFTLEtBQVQsY0FBUyxRQWlCdkI7QUFBRCxDQUFDLEVBakJTLElBQUksS0FBSixJQUFJLFFBaUJiO0FDaEJELElBQVUsV0FBVyxDQTBDcEI7QUExQ0QsV0FBVSxXQUFXLEVBQUMsQ0FBQztJQVNuQixxQkFBNEIsTUFBYyxFQUFFLE9BQWdCLEVBQUUsSUFBYTtRQUN2RSxJQUFJLEtBQUssR0FBcUIsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDckQsRUFBRSxDQUFBLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsQ0FBQztZQUMxQyxLQUFLLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMvQixDQUFDO1FBQ0QsSUFBSSxPQUFPLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELEVBQUUsQ0FBQSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQztZQUMxQixLQUFLLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMxQyxDQUFDO1FBQ0QsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQztZQUNMLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQzFCLENBQUM7UUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFiZSx1QkFBVyxjQWExQixDQUFBO0lBRUQsd0JBQStCLE1BQWMsRUFBRSxPQUFlLEVBQUUsSUFBYTtRQUN6RSxJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixFQUFFLENBQUEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUEsQ0FBQztZQUNwQixLQUFLLENBQUMsSUFBSSxDQUFDLGtCQUFnQixRQUFRLENBQUMsVUFBVSxNQUFHLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBQ0QsRUFBRSxDQUFBLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFBLENBQUM7WUFDcEIsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBZSxRQUFRLENBQUMsVUFBWSxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUNELEVBQUUsQ0FBQSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQSxDQUFDO1lBQ25CLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWMsUUFBUSxDQUFDLFNBQVcsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFDRCxFQUFFLENBQUEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUEsQ0FBQztZQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWEsUUFBUSxDQUFDLFFBQVUsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBaEJlLDBCQUFjLGlCQWdCN0IsQ0FBQTtBQUVMLENBQUMsRUExQ1MsV0FBVyxLQUFYLFdBQVcsUUEwQ3BCO0FDM0NELElBQVUsU0FBUyxDQVdsQjtBQVhELFdBQVUsU0FBUyxFQUFDLENBQUM7SUFFakIsZ0JBQTBCLE9BQWUsRUFBRSxNQUF3QjtRQUMvRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUZlLGdCQUFNLFNBRXJCLENBQUE7SUFFRDtRQUNJLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ3hDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFIZSxlQUFLLFFBR3BCLENBQUE7QUFFTCxDQUFDLEVBWFMsU0FBUyxLQUFULFNBQVMsUUFXbEI7QUNYRCxJQUFVLFNBQVMsQ0FtQmxCO0FBbkJELFdBQVUsU0FBUyxFQUFDLENBQUM7SUFFakI7UUFLSSxvQkFBWSxJQUE0QjtZQUE1QixvQkFBNEIsR0FBNUIsT0FBZSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3BDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckMsQ0FBQztRQUVELDJCQUFNLEdBQU47WUFDSSxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDeEQsSUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7WUFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBQ0wsaUJBQUM7SUFBRCxDQUFDLEFBZkQsSUFlQztJQWZZLG9CQUFVLGFBZXRCLENBQUE7QUFFTCxDQUFDLEVBbkJTLFNBQVMsS0FBVCxTQUFTLFFBbUJsQjtBQ2xCRCxJQUFVLFlBQVksQ0FzRnJCO0FBdEZELFdBQVUsWUFBWSxFQUFDLENBQUM7SUFlcEI7UUFJSSxzQkFBWSxPQUFpQyxFQUFFLElBQVk7WUFDdkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDckIsQ0FBQztRQUVELGdDQUFTLEdBQVQsVUFBVSxRQUEyQztZQUNqRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFFRCwwQkFBRyxHQUFILFVBQUksUUFBK0I7WUFDL0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBQ0QsK0JBQVEsR0FBUixVQUFTLElBQVk7WUFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0JBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixJQUFJLEVBQUUsSUFBSTthQUNiLENBQUMsQ0FBQztRQUNQLENBQUM7UUFFRCw4QkFBTyxHQUFQO1lBQUEsaUJBRUM7WUFERyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUksQ0FBQyxJQUFJLEVBQXBCLENBQW9CLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBRUQsa0NBQVcsR0FBWDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBRUQsOEJBQU8sR0FBUCxVQUFRLE9BQTRCO1lBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFDTCxtQkFBQztJQUFELENBQUMsQUFsQ0QsSUFrQ0M7SUFsQ1kseUJBQVksZUFrQ3hCLENBQUE7SUFFRDtRQUlJLGlCQUFZLE9BQXlDLEVBQUUsSUFBYTtZQUNoRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQXlCLENBQUM7WUFDbEUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDckIsQ0FBQztRQUVELDJCQUFTLEdBQVQsVUFBVSxNQUErQztZQUNyRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUVELHlCQUFPLEdBQVA7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN2QyxDQUFDO1FBRUQsdUJBQUssR0FBTCxVQUFrQyxJQUFZO1lBQzFDLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBUSxJQUFJLENBQUMsT0FBbUMsRUFDbkUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVELDRCQUFVLEdBQVY7WUFBdUMsZ0JBQWdDO2lCQUFoQyxXQUFnQyxDQUFoQyxzQkFBZ0MsQ0FBaEMsSUFBZ0M7Z0JBQWhDLCtCQUFnQzs7WUFFbkUsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQU4sQ0FBTSxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUExQixDQUEwQixDQUFtQyxDQUFDO1FBQ2xHLENBQUM7UUFFRCx1QkFBSyxHQUFMO1lBQU0sZ0JBQXVDO2lCQUF2QyxXQUF1QyxDQUF2QyxzQkFBdUMsQ0FBdkMsSUFBdUM7Z0JBQXZDLCtCQUF1Qzs7WUFFekMsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQU4sQ0FBTSxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUExQixDQUEwQixDQUFFLENBQUM7UUFDakUsQ0FBQztRQUNMLGNBQUM7SUFBRCxDQUFDLEFBakNELElBaUNDO0lBakNZLG9CQUFPLFVBaUNuQixDQUFBO0FBRUwsQ0FBQyxFQXRGUyxZQUFZLEtBQVosWUFBWSxRQXNGckI7QUV0RkQ7SUFBQTtRQUVZLGlCQUFZLEdBQThCLEVBQUUsQ0FBQztJQWlEekQsQ0FBQztJQS9DRzs7T0FFRztJQUNILG1DQUFTLEdBQVQsVUFBVSxPQUE4QjtRQUF4QyxpQkFLQztRQUpHLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBLENBQUM7WUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBekIsQ0FBeUIsQ0FBQztJQUMzQyxDQUFDO0lBRUQscUNBQVcsR0FBWCxVQUFZLFFBQStCO1FBQ3ZDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRCxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7SUFDTCxDQUFDO0lBRUQsaUNBQU8sR0FBUDtRQUFBLGlCQU1DO1FBTEcsSUFBSSxLQUFVLENBQUM7UUFDZixNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FDakMsVUFBQyxZQUFZLElBQUssT0FBQSxLQUFJLENBQUMsU0FBUyxDQUF3QixZQUFZLENBQUMsRUFBbkQsQ0FBbUQsRUFDckUsVUFBQyxlQUFlLElBQUssT0FBQSxLQUFJLENBQUMsV0FBVyxDQUF3QixlQUFlLENBQUMsRUFBeEQsQ0FBd0QsQ0FDaEYsQ0FBQztJQUNOLENBQUM7SUFFRDs7T0FFRztJQUNILHNDQUFZLEdBQVosVUFBYSxRQUErQjtRQUN4QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUN4QixLQUFLLEVBQUUsQ0FBQztZQUNSLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxnQ0FBTSxHQUFOLFVBQU8sUUFBVztRQUNkLEdBQUcsQ0FBQSxDQUFtQixVQUFpQixFQUFqQixLQUFBLElBQUksQ0FBQyxZQUFZLEVBQWpCLGNBQWlCLEVBQWpCLElBQWlCLENBQUM7WUFBcEMsSUFBSSxVQUFVLFNBQUE7WUFDZCxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNuQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILCtCQUFLLEdBQUw7UUFDSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0FBQyxBQW5ERCxJQW1EQztBQ25ERCxJQUFVLFVBQVUsQ0E0Q25CO0FBNUNELFdBQVUsVUFBVSxFQUFDLENBQUM7SUFRbEIsa0JBQ0ksSUFJQztRQUVELE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBYyxFQUFFO1lBQ3JCLENBQUMsQ0FBQyx3Q0FBd0MsRUFDdEM7Z0JBQ0ksT0FBTyxFQUFFO29CQUNMLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDWCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxhQUFhLEVBQUUsVUFBVTtvQkFDekIsU0FBUyxFQUFFLGlDQUFpQztpQkFDL0M7YUFDSixFQUNEO2dCQUNJLElBQUksQ0FBQyxPQUFPO2dCQUNaLENBQUMsQ0FBQyxZQUFZLENBQUM7YUFDbEIsQ0FBQztZQUNOLENBQUMsQ0FBQyxrQkFBa0IsRUFDaEIsRUFBRSxFQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtnQkFDZixPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQ0YsRUFDQyxFQUNEO29CQUNJLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzdDLENBQ0o7WUFORCxDQU1DLENBQ0osQ0FDSjtTQUNKLENBQUMsQ0FBQztJQUVQLENBQUM7SUFuQ2UsbUJBQVEsV0FtQ3ZCLENBQUE7QUFDTCxDQUFDLEVBNUNTLFVBQVUsS0FBVixVQUFVLFFBNENuQjtBQzlCRCxJQUFVLFdBQVcsQ0F3SHBCO0FBeEhELFdBQVUsV0FBVyxFQUFDLENBQUM7SUFFbkIsV0FBWSxVQUFVO1FBQ2xCLG9FQUFvRTtRQUNwRSw0RUFBNEU7UUFDNUUsdURBQWdCLENBQUE7UUFDaEIsa0NBQWtDO1FBQ2xDLG1EQUFjLENBQUE7UUFDZCxzRUFBc0U7UUFDdEUsVUFBVTtRQUNWLHFEQUFlLENBQUE7UUFDZiwrQkFBK0I7UUFDL0IsbURBQWMsQ0FBQTtRQUNkLHNFQUFzRTtRQUN0RSxzRUFBc0U7UUFDdEUsb0RBQWUsQ0FBQTtRQUNmLG9DQUFvQztRQUNwQyxnREFBYSxDQUFBO1FBQ2Isb0NBQW9DO1FBQ3BDLDhDQUFZLENBQUE7UUFDWiwyRUFBMkU7UUFDM0UsdURBQWdCLENBQUE7UUFDaEIsZUFBZTtRQUNmLG1EQUFlLENBQUE7UUFDZixnQkFBZ0I7UUFDaEIsaURBQWMsQ0FBQTtRQUNkLHFDQUFxQztRQUNyQyxzREFBZ0IsQ0FBQTtRQUNoQixnQ0FBZ0M7UUFDaEMsOENBQVksQ0FBQTtJQUNoQixDQUFDLEVBNUJXLHNCQUFVLEtBQVYsc0JBQVUsUUE0QnJCO0lBNUJELElBQVksVUFBVSxHQUFWLHNCQTRCWCxDQUFBO0lBRUQsaUVBQWlFO0lBQ2pFLFdBQVksT0FBTztRQUNmLHNFQUFzRTtRQUN0RSxrQkFBa0I7UUFDbEIsOENBQTRFLENBQUE7UUFDNUUsNEVBQTRFO1FBQzVFLCtDQUF3RCxDQUFBO1FBQ3hELDZDQUFzRCxDQUFBO1FBQ3RELDhDQUE0RSxDQUFBO1FBQzVFLDBDQUFxRSxDQUFBO1FBQ3JFLHdDQUFnRCxDQUFBO1FBQ2hELGlEQUF3RCxDQUFBO1FBQ3hELDZDQUEwRSxDQUFBO1FBQzFFLDJDQUFrRCxDQUFBO1FBQ2xELHdDQUE4QyxDQUFBO0lBQ2xELENBQUMsRUFkVyxtQkFBTyxLQUFQLG1CQUFPLFFBY2xCO0lBZEQsSUFBWSxPQUFPLEdBQVAsbUJBY1gsQ0FBQTtJQUFBLENBQUM7SUFFRjtRQUVJLHdCQUF3QjtRQUN4QixJQUFNLFNBQVMsR0FBUyxLQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUM5QyxTQUFTLENBQUMsU0FBUyxHQUFHLFVBQVMsT0FBMEI7WUFBbkMsaUJBYXJCO1lBWkcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7WUFDM0IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFDRCxNQUFNLENBQUM7Z0JBQ0gsSUFBSSxLQUFLLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNiLEtBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsQ0FBQztZQUNMLENBQUMsQ0FBQTtRQUNMLENBQUMsQ0FBQTtRQUVELG1CQUFtQjtRQUNuQixJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQ3BDLFNBQVMsQ0FBQyxNQUFNLEdBQUc7WUFDZixVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUM3QixDQUFDLENBQUE7UUFFRCx3QkFBd0I7UUFDeEIsSUFBTSxZQUFZLEdBQVEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDbEQsSUFBTSxjQUFjLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUM3QyxZQUFZLENBQUMsUUFBUSxHQUFHLFVBQVMsS0FBaUIsRUFBRSxJQUFnQjtZQUNoRSxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN0QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQU0sSUFBSSxHQUFTLElBQUssQ0FBQyxZQUFZLENBQUM7Z0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsR0FBRyxDQUFDLENBQVUsVUFBSSxFQUFKLGFBQUksRUFBSixrQkFBSSxFQUFKLElBQUksQ0FBQzt3QkFBZCxJQUFJLENBQUMsYUFBQTt3QkFDTixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDdkI7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUE7SUFDTCxDQUFDO0lBeENlLHNCQUFVLGFBd0N6QixDQUFBO0lBRUQsa0JBQXlCLEtBQWlCO1FBQ3RDLElBQUksUUFBUSxHQUFhLEVBQUUsQ0FBQztRQUM1QixDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFDLEtBQUssRUFBRSxHQUFHO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFSZSxvQkFBUSxXQVF2QixDQUFBO0lBRUQsaUJBQXdCLElBQWdCLEVBQUUsS0FBaUI7UUFHdkQsSUFBSSxLQUFpQixDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUNqQyxVQUFBLFVBQVU7WUFDTixLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7Z0JBQ3BCLEVBQUUsQ0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQSxDQUFDO29CQUNWLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxFQUNELFVBQUEsYUFBYTtZQUNULEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFBLENBQUM7Z0JBQ04sS0FBSyxFQUFFLENBQUM7WUFDWixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBakJlLG1CQUFPLFVBaUJ0QixDQUFBO0FBRUwsQ0FBQyxFQXhIUyxXQUFXLEtBQVgsV0FBVyxRQXdIcEI7QUFFRCxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUM7QUMvSHpCLElBQVUsUUFBUSxDQStKakI7QUEvSkQsV0FBVSxRQUFRLEVBQUMsQ0FBQztJQUVoQjtRQVdJLGtCQUFZLE9BQXNCO1lBWHRDLGlCQTJKQztZQXhKRyxXQUFNLEdBQUcsSUFBSSxDQUFDO1lBTU4saUJBQVksR0FBRyxJQUFJLGVBQWUsRUFBbUIsQ0FBQztZQUcxRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUVqQixDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFFLENBQUMsVUFBVSxDQUFDLFVBQUMsS0FBSztnQkFDakQsSUFBTSxhQUFhLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNwRSxLQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztZQUN6RCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztZQUVwQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBQSxFQUFFO2dCQUM5QyxJQUFNLElBQUksR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDL0IsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztvQkFDekIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDTix1QkFBdUI7d0JBQ3ZCLE1BQU0sQ0FBQztvQkFDWCxDQUFDO29CQUNELEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO29CQUNwQyxxREFBcUQ7b0JBQ3JELG9DQUFvQztvQkFDcEMsS0FBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM3RSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNyRCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQU0sV0FBVyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FDL0IsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFDM0MsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FDOUMsQ0FBQztvQkFDRiwrQ0FBK0M7b0JBQy9DLGtDQUFrQztvQkFDbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUM1QixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQzt5QkFDcEMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ25CLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFBLEVBQUU7Z0JBQzVDLElBQU0sSUFBSSxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO29CQUN6QixLQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO29CQUM5QixLQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO29CQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMvQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNWLEtBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDdEMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDcEIsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsc0JBQUksaUNBQVc7aUJBQWY7Z0JBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDN0IsQ0FBQzs7O1dBQUE7UUFFRCxzQkFBSSwwQkFBSTtpQkFBUjtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2xDLENBQUM7OztXQUFBO1FBRUQsc0JBQUksK0JBQVM7aUJBQWI7Z0JBQ0ksTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUMsQ0FBQzs7O1dBQUE7UUFFRCwrQkFBWSxHQUFaLFVBQWEsS0FBbUI7WUFDNUIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDL0IsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzVCLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM1QixJQUFNLENBQUMsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLElBQU0sQ0FBQyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxFQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckMsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztZQUN4QixDQUFDO1lBQ0QsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztZQUN4QixDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUVELHlCQUFNLEdBQU4sVUFBTyxJQUFxQjtZQUN4QixFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQSxDQUFDO2dCQUN4RCxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxNQUFNLENBQUM7WUFDWCxDQUFDO1lBQ0QsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzFCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztZQUN0QixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUVELHFDQUFrQixHQUFsQixVQUFtQixLQUFhLEVBQUUsUUFBcUI7WUFDbkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNULE1BQU0sQ0FBQztZQUNYLENBQUM7WUFDRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUMvQixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzFCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDOUIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU3QyxJQUFJLE9BQU8sR0FBRyxLQUFLLEdBQUcsQ0FBQztrQkFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTTtrQkFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzlCLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxJQUFNLFNBQVMsR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ3BDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDakQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUM1RCxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV0QyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsQ0FBQzs7UUFFRDs7O1dBR0c7UUFDSyxxQ0FBa0IsR0FBMUIsVUFBMkIsSUFBWTtZQUNuQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6QyxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsQ0FBQztZQUNELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNMLGVBQUM7SUFBRCxDQUFDLEFBM0pELElBMkpDO0lBM0pZLGlCQUFRLFdBMkpwQixDQUFBO0FBRUwsQ0FBQyxFQS9KUyxRQUFRLEtBQVIsUUFBUSxRQStKakI7QUN6S0QsSUFBVSxRQUFRLENBZ0NqQjtBQWhDRCxXQUFVLFFBQVEsRUFBQyxDQUFDO0lBRWhCOzs7T0FHRztJQUNRLGtCQUFTLEdBQUc7UUFDbkIsY0FBYyxFQUFFLGdCQUFnQjtRQUNoQyxZQUFZLEVBQUUsY0FBYztLQUMvQixDQUFBO0lBRUQsMkJBQWtDLElBQWdCO1FBRTlDLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztRQUVyQixJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLFVBQUEsRUFBRTtZQUNqQyxFQUFFLENBQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFBLENBQUM7Z0JBQ1YsUUFBUSxHQUFHLElBQUksQ0FBQztnQkFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNyRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQUEsRUFBRTtZQUMvQixFQUFFLENBQUEsQ0FBQyxRQUFRLENBQUMsQ0FBQSxDQUFDO2dCQUNULFFBQVEsR0FBRyxLQUFLLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQy9DLGdCQUFnQjtnQkFDaEIsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQXBCZSwwQkFBaUIsb0JBb0JoQyxDQUFBO0FBQ0wsQ0FBQyxFQWhDUyxRQUFRLEtBQVIsUUFBUSxRQWdDakI7QUMvQkQsSUFBTyxLQUFLLENBZ0JYO0FBaEJELFdBQU8sS0FBSyxFQUFDLENBQUM7SUFFQyxlQUFTLEdBQUc7UUFDbkIsS0FBSyxFQUFFLE9BQU87UUFDZCxTQUFTLEVBQUUsV0FBVztRQUN0QixPQUFPLEVBQUUsU0FBUztRQUNsQixTQUFTLEVBQUUsV0FBVztRQUN0QixLQUFLLEVBQUUsT0FBTztRQUNkLFdBQVcsRUFBRSxhQUFhO1FBQzFCLFNBQVMsRUFBRSxXQUFXO1FBQ3RCLFVBQVUsRUFBRSxZQUFZO1FBQ3hCLFVBQVUsRUFBRSxZQUFZO1FBQ3hCLEtBQUssRUFBRSxPQUFPO1FBQ2QsT0FBTyxFQUFFLFNBQVM7S0FDckIsQ0FBQTtBQUVMLENBQUMsRUFoQk0sS0FBSyxLQUFMLEtBQUssUUFnQlg7QUNoQkQ7SUFBQTtJQUVBLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FDRUQsSUFBVSxXQUFXLENBTXBCO0FBTkQsV0FBVSxXQUFXLEVBQUMsQ0FBQztJQUNuQix1QkFBOEIsU0FBc0IsRUFBRSxLQUFZO1FBQzlELElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUMsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwQyxTQUFTLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBSmUseUJBQWEsZ0JBSTVCLENBQUE7QUFDTCxDQUFDLEVBTlMsV0FBVyxLQUFYLFdBQVcsUUFNcEI7QUFFRDtJQUFBO0lBNEZBLENBQUM7SUExRkc7O09BRUc7SUFDSSx3QkFBWSxHQUFuQixVQUNJLElBQTBCLEVBQzFCLFNBQXNCO1FBRjFCLGlCQWdDQztRQTVCRyxJQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDO1FBQ3hCLElBQUksT0FBTyxHQUF3QixTQUFTLENBQUM7UUFDN0MsSUFBTSxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFTLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFBLEdBQUc7WUFDZCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFFakIsS0FBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLElBQUksT0FBYyxDQUFDO1lBQ25CLElBQUksQ0FBQztnQkFDRCxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNsQyxDQUNBO1lBQUEsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDVCxPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFO29CQUNoQyxTQUFBLE9BQU87b0JBQ1AsS0FBQSxHQUFHO29CQUNILEtBQUEsR0FBRztpQkFDTixDQUFDLENBQUM7Z0JBQ0gsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsWUFBWTtnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDeEIsQ0FBQztZQUVELE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBUSxPQUFPLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksNEJBQWdCLEdBQXZCLFVBQXdCLElBQVc7UUFDL0IsRUFBRSxDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQSxDQUFDO1lBQ3hDLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFDRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUgsQ0FBRyxDQUFDLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUMsT0FBTyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDN0IsQ0FBQztRQUNELEdBQUcsQ0FBQyxDQUFnQixVQUFhLEVBQWIsS0FBQSxJQUFJLENBQUMsUUFBUSxFQUFiLGNBQWEsRUFBYixJQUFhLENBQUM7WUFBN0IsSUFBTSxLQUFLLFNBQUE7WUFDWixJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDaEM7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSSwyQkFBZSxHQUF0QixVQUNJLFNBQStCLEVBQy9CLFNBQThCO1FBRTlCLElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUN4QixJQUFJLElBQUksR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQVMsQ0FBQztRQUNuQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFBLEdBQUc7WUFDeEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQ2pCLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQVEsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7T0FFRztJQUNJLHNCQUFVLEdBQWpCLFVBQ0ksU0FBOEIsRUFDOUIsTUFBd0IsRUFDeEIsTUFBMEI7UUFFMUIsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDO1FBQ3hCLElBQUksSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBUyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJO1lBQ2pCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDbEIsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBUSxPQUFPLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVMLGtCQUFDO0FBQUQsQ0FBQyxBQTVGRCxJQTRGQztBQ3hHRCxJQUFVLEdBQUcsQ0EwQlo7QUExQkQsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUVYO1FBQUE7UUFzQkEsQ0FBQztRQWhCRyxzQkFBSSx5Q0FBaUI7aUJBQXJCO2dCQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQzVELENBQUM7aUJBRUQsVUFBc0IsS0FBYTtnQkFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzFGLENBQUM7OztXQUpBO1FBTUQsc0JBQUksaUNBQVM7aUJBQWI7Z0JBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2xELENBQUM7aUJBRUQsVUFBYyxLQUFhO2dCQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ2hGLENBQUM7OztXQUpBO1FBZE0sZUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNYLHlCQUFjLEdBQUcsV0FBVyxDQUFDO1FBQzdCLG1DQUF3QixHQUFHLG1CQUFtQixDQUFDO1FBa0IxRCxpQkFBQztJQUFELENBQUMsQUF0QkQsSUFzQkM7SUF0QlksY0FBVSxhQXNCdEIsQ0FBQTtBQUVMLENBQUMsRUExQlMsR0FBRyxLQUFILEdBQUcsUUEwQlo7QUMzQkQsSUFBVSxHQUFHLENBb0JaO0FBcEJELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFFWDtRQUtJO1lBQ0ksWUFBWSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFFbkMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFNBQUssRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hFLENBQUM7UUFFRCx5QkFBSyxHQUFMO1lBQ0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixDQUFDO1FBRUwsZ0JBQUM7SUFBRCxDQUFDLEFBaEJELElBZ0JDO0lBaEJZLGFBQVMsWUFnQnJCLENBQUE7QUFFTCxDQUFDLEVBcEJTLEdBQUcsS0FBSCxHQUFHLFFBb0JaO0FDbkJELElBQVUsR0FBRyxDQXFDWjtBQXJDRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBRVg7UUFBK0IsNkJBQU87UUFFbEM7WUFDSSxrQkFBTTtnQkFDRixJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO2dCQUMxQixJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLENBQUM7YUFDL0MsRUFDRztnQkFDSSxPQUFPLEVBQUUsS0FBSztnQkFDZCxZQUFZLEVBQUUsTUFBTTthQUN2QixDQUFDLENBQUM7WUFFUCxnQ0FBZ0M7WUFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQ3BDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUM1QyxDQUFDO1FBRUQsa0NBQWMsR0FBZCxVQUFlLFFBQWdCO1lBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUVELHNCQUFJLDRCQUFLO2lCQUFUO2dCQUNJLHNDQUFzQztnQkFDdEMsTUFBTSxDQUFxQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDL0MsQ0FBQzs7O1dBQUE7UUFDTCxnQkFBQztJQUFELENBQUMsQUF6QkQsQ0FBK0IsT0FBTyxHQXlCckM7SUF6QlksYUFBUyxZQXlCckIsQ0FBQTtBQVVMLENBQUMsRUFyQ1MsR0FBRyxLQUFILEdBQUcsUUFxQ1o7QUNyQ0QsSUFBVSxHQUFHLENBb0ZaO0FBcEZELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFFWDtRQVNJO1lBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGFBQVMsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGNBQVUsRUFBRSxDQUFDO1lBRWhDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDOUIsQ0FBQztRQUVELHlCQUFTLEdBQVQ7WUFDSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFFRCxrQ0FBa0IsR0FBbEI7WUFBQSxpQkFRQztZQVBHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUTtnQkFDeEMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsVUFBQSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsVUFBQSxFQUFFO2dCQUNqQyxLQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztZQUN4QyxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUM7UUFFRCwyQkFBVyxHQUFYO1lBQUEsaUJBUUM7WUFQRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUcsRUFBRSxLQUFLO2dCQUN6QixLQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ04sT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2xDLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUwsWUFBQztJQUFELENBQUMsQUE1Q0QsSUE0Q0M7SUE1Q1ksU0FBSyxRQTRDakIsQ0FBQTtJQUVEO1FBS0ksa0JBQVksT0FBbUIsRUFBRSxNQUFpQjtZQUM5QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUVyQixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUQseUJBQXlCO1lBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUN2QyxDQUFDO1FBRUQsc0JBQUksdUNBQWlCO2lCQUFyQjtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztZQUMxQyxDQUFDOzs7V0FBQTtRQUVELHNCQUFJLCtCQUFTO2lCQUFiO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNsQyxDQUFDOzs7V0FBQTtRQUVELHNCQUFJLDJCQUFLO2lCQUFUO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUM3QixDQUFDOzs7V0FBQTtRQUNMLGVBQUM7SUFBRCxDQUFDLEFBekJELElBeUJDO0lBekJZLFlBQVEsV0F5QnBCLENBQUE7SUFFRDtRQUE2QiwyQkFBb0I7UUFBakQ7WUFBNkIsOEJBQW9CO1lBQzdDLHVCQUFrQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQVMsb0JBQW9CLENBQUMsQ0FBQztZQUM5RCxzQkFBaUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFTLG1CQUFtQixDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUFELGNBQUM7SUFBRCxDQUFDLEFBSEQsQ0FBNkIsWUFBWSxDQUFDLE9BQU8sR0FHaEQ7SUFIWSxXQUFPLFVBR25CLENBQUE7SUFFRDtRQUE0QiwwQkFBb0I7UUFBaEQ7WUFBNEIsOEJBQW9CO1lBQzVDLGlCQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBZ0IsY0FBYyxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUFELGFBQUM7SUFBRCxDQUFDLEFBRkQsQ0FBNEIsWUFBWSxDQUFDLE9BQU8sR0FFL0M7SUFGWSxVQUFNLFNBRWxCLENBQUE7QUFFTCxDQUFDLEVBcEZTLEdBQUcsS0FBSCxHQUFHLFFBb0ZaO0FDckZELElBQVUsSUFBSSxDQStDYjtBQS9DRCxXQUFVLElBQUksRUFBQyxDQUFDO0lBRVo7UUFFSSxvQkFBWSxNQUF5QjtZQUVqQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXhCLENBQUM7UUFFRCwwQkFBSyxHQUFMO1lBQ0ksSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztZQUV4QixJQUFNLFdBQVcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxXQUFXLENBQUMsY0FBUSxDQUFDLENBQUMsQ0FBQztZQUN6RCxXQUFXLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFFLFVBQUEsTUFBTTtnQkFFL0MsSUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ3JFLElBQU0sT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDakQsT0FBTyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDNUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7Z0JBRWpDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FDakQsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFDcEIsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FDM0IsQ0FBQyxDQUFDO2dCQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRWxCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO2dCQUNqQyxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztnQkFFdkIsSUFBTSxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDekQsUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUV4QyxJQUFJLENBQUMsT0FBTyxHQUFHO29CQUNYLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3RCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDMUIsQ0FBQyxDQUFBO2dCQUVELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVoQixDQUFDLENBQUMsQ0FBQztRQUVQLENBQUM7UUFFTCxpQkFBQztJQUFELENBQUMsQUEzQ0QsSUEyQ0M7SUEzQ1ksZUFBVSxhQTJDdEIsQ0FBQTtBQUVMLENBQUMsRUEvQ1MsSUFBSSxLQUFKLElBQUksUUErQ2I7QUMvQ0QsSUFBVSxhQUFhLENBc0R0QjtBQXRERCxXQUFVLGFBQWEsRUFBQyxDQUFDO0lBRXJCO1FBSUksaUJBQVksU0FBc0IsRUFBRSxLQUFZO1lBRTVDLElBQU0sT0FBTyxHQUFzQjtnQkFDL0IsSUFBSSxXQUFXLEtBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUEsQ0FBQyxDQUFDO2dCQUM5QyxZQUFZLEVBQUUsVUFBQyxNQUFNLEVBQUUsUUFBUTtvQkFDM0IsS0FBSyxDQUFDLE1BQU0sQ0FBQzt3QkFDVCxNQUFNLEVBQUUsTUFBTTt3QkFDZCxVQUFBLFFBQVE7cUJBQ1gsQ0FBQyxDQUFDO2dCQUNQLENBQUM7Z0JBQ0QsaUJBQWlCLEVBQUU7b0JBQ2YsTUFBTSxDQUFDLElBQUksaUNBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFDLENBQUM7YUFDSixDQUFBO1lBRUQsZ0JBQWdCO1lBQ2hCLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztnQkFDdkQsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQzVDLElBQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDOUMsRUFBRSxDQUFDLENBQUMsY0FBYyxJQUFJLGNBQWMsQ0FBQyxJQUFJLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUN0RSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQztnQkFDckQsQ0FBQztnQkFDRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUMsQ0FBQztZQUVILElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxjQUFjO2lCQUM1QixHQUFHLENBQUMsVUFBQSxFQUFFO2dCQUNILElBQUksUUFBUSxDQUFDO2dCQUNiLElBQUksQ0FBQztvQkFDRCxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2hELENBQ0E7Z0JBQUEsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDVCxPQUFPLENBQUMsS0FBSyxDQUFDLG1CQUFpQixLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksY0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN4RSxDQUFDO2dCQUVELEdBQUcsQ0FBQyxDQUFZLFVBQVEsRUFBUixxQkFBUSxFQUFSLHNCQUFRLEVBQVIsSUFBUSxDQUFDO29CQUFwQixJQUFNLENBQUMsaUJBQUE7b0JBQ1IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEVBQTVCLENBQTRCLENBQUMsQ0FBQztpQkFDekQ7Z0JBQ0QsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQztnQkFDbEQsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLHNCQUFzQixFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztZQUVQLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUE5Q00sc0JBQWMsR0FBRyxzQkFBc0IsQ0FBQztRQWdEbkQsY0FBQztJQUFELENBQUMsQUFsREQsSUFrREM7SUFsRFkscUJBQU8sVUFrRG5CLENBQUE7QUFFTCxDQUFDLEVBdERTLGFBQWEsS0FBYixhQUFhLFFBc0R0QjtBQ3RERCxJQUFVLGFBQWEsQ0F3Q3RCO0FBeENELFdBQVUsYUFBYSxFQUFDLENBQUM7SUFFckI7UUFJSSxnQkFDSSxnQkFBNkIsRUFDN0IsYUFBZ0MsRUFDaEMsWUFBK0IsRUFDL0IsV0FBd0I7WUFFeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLG1CQUFLLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUkscUJBQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFekQsSUFBSSwyQkFBYSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQztZQUM1RSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDO1lBRWhFLElBQUksNEJBQWMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFFRCxzQkFBSyxHQUFMO1lBQUEsaUJBYUM7WUFaRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7Z0JBQ3BCLEtBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNsQyxLQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUMxQixFQUFFLE1BQU0sRUFDSjt3QkFDSSxPQUFPLEVBQUU7NEJBQ0wsSUFBSSxFQUFFLDZDQUE2Qzt5QkFDdEQ7cUJBQ0o7aUJBQ0osQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUE7UUFFTixDQUFDO1FBRUwsYUFBQztJQUFELENBQUMsQUFwQ0QsSUFvQ0M7SUFwQ1ksb0JBQU0sU0FvQ2xCLENBQUE7QUFFTCxDQUFDLEVBeENTLGFBQWEsS0FBYixhQUFhLFFBd0N0QjtBQ3hDRCxJQUFVLGFBQWEsQ0EwR3RCO0FBMUdELFdBQVUsYUFBYSxFQUFDLENBQUM7SUFFckI7UUFZSSx1QkFBWSxNQUF5QixFQUFFLEtBQVk7WUFadkQsaUJBdUdDO1lBL0ZXLGNBQVMsR0FBRyxLQUFLLENBQUM7WUFLdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFFbkIsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVuQyxTQUFTLENBQUMseUJBQXlCLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQztZQUV4RCxJQUFJLENBQUMsT0FBTyxHQUFHO2dCQUNYLE9BQU8sRUFBRSxVQUFBLFNBQVM7b0JBQ2QsSUFBSSxHQUFXLENBQUM7b0JBQ2hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ2xDLEdBQUcsR0FBRyxxQkFBTyxDQUFDLGNBQWMsQ0FBQztvQkFDakMsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixHQUFHLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDOytCQUM1RCxxQkFBTyxDQUFDLGNBQWMsQ0FBQztvQkFDbEMsQ0FBQztvQkFDRCxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO3lCQUM1QixJQUFJLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLENBQUMsSUFBSSxFQUFYLENBQVcsQ0FBQyxDQUFDO2dCQUNyQyxDQUFDO2FBQ0osQ0FBQztZQUVGLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFVBQUMsRUFBaUI7Z0JBQzdDLHFDQUFxQztnQkFDckMsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLG1DQUFtQztvQkFDbkMsS0FBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO29CQUM5QixNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxLQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsV0FBVyxFQUFFLEVBQWxCLENBQWtCLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBRU8sbUNBQVcsR0FBbkI7WUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU87bUJBQ3ZCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUk7bUJBQy9CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLENBQUM7WUFDWCxDQUFDO1lBQ0QsNkNBQTZDO1lBQzdDLElBQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNwRCxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDaEMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDMUYsSUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFFTywwQ0FBa0IsR0FBMUI7WUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDM0IsQ0FBQztRQUNMLENBQUM7UUFFTyw4QkFBTSxHQUFkLFVBQWUsTUFBYztZQUE3QixpQkE2QkM7WUE1QkcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUM3QyxDQUFDO1lBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDM0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtnQkFDNUQsSUFBSSxDQUFDO29CQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUM3QyxNQUFNLENBQUM7b0JBQ1gsQ0FBQztvQkFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO29CQUNyRCxLQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEMsQ0FBQzt3QkFDTyxDQUFDO29CQUNMLEtBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2dCQUMzQixDQUFDO2dCQUVELHVDQUF1QztnQkFDdkMsS0FBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDOUIsQ0FBQyxFQUNHLFVBQUEsR0FBRztnQkFDQyxPQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDckQsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRUwsb0JBQUM7SUFBRCxDQUFDLEFBdkdELElBdUdDO0lBdkdZLDJCQUFhLGdCQXVHekIsQ0FBQTtBQUNMLENBQUMsRUExR1MsYUFBYSxLQUFiLGFBQWEsUUEwR3RCO0FDMUdELDRCQUE0QjtBQUU1QixrQ0FBa0M7QUFFbEMscUNBQXFDO0FBQ3JDLHdCQUF3QjtBQUN4QixtQ0FBbUM7QUFFbkMsaUVBQWlFO0FBQ2pFLGtDQUFrQztBQUNsQyxtQ0FBbUM7QUFFbkMsZ0NBQWdDO0FBQ2hDLDBDQUEwQztBQUMxQyx1Q0FBdUM7QUFDdkMsNkRBQTZEO0FBQzdELHdEQUF3RDtBQUN4RCwrQkFBK0I7QUFDL0IsOEZBQThGO0FBQzlGLHlEQUF5RDtBQUN6RCx3QkFBd0I7QUFDeEIsd0RBQXdEO0FBQ3hELHdEQUF3RDtBQUN4RCxvQkFBb0I7QUFDcEIsaUJBQWlCO0FBRWpCLDZEQUE2RDtBQUM3RCxnREFBZ0Q7QUFDaEQsbUVBQW1FO0FBQ25FLDREQUE0RDtBQUM1RCw4REFBOEQ7QUFDOUQsNEVBQTRFO0FBQzVFLHFGQUFxRjtBQUNyRixxQ0FBcUM7QUFDckMsNERBQTREO0FBQzVELDZDQUE2QztBQUM3QyxxQkFBcUI7QUFDckIsNkJBQTZCO0FBQzdCLG9FQUFvRTtBQUNwRSw2Q0FBNkM7QUFDN0Msc0JBQXNCO0FBQ3RCLGtCQUFrQjtBQUNsQixxQ0FBcUM7QUFFckMsWUFBWTtBQUVaLFFBQVE7QUFDUixJQUFJO0FDL0NKLElBQU8sYUFBYSxDQTJCbkI7QUEzQkQsV0FBTyxhQUFhLEVBQUMsQ0FBQztJQUVsQjtRQUlJLHdCQUFZLFNBQXNCLEVBQUUsS0FBWTtZQUpwRCxpQkF1QkM7WUFsQk8sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFFbkIsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkMsV0FBVyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsU0FBUyxFQUFFLEVBQWhCLENBQWdCLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzRSxDQUFDO1FBRUQsa0NBQVMsR0FBVDtZQUFBLGlCQVVDO1lBVEcsTUFBTSxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDL0IsS0FBSyxFQUFFO29CQUNILElBQUksRUFBRSxRQUFRO2lCQUNqQjtnQkFDRCxFQUFFLEVBQUU7b0JBQ0EsS0FBSyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUF4QixDQUF3QjtpQkFDeEM7YUFDSixFQUNELENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBRUwscUJBQUM7SUFBRCxDQUFDLEFBdkJELElBdUJDO0lBdkJZLDRCQUFjLGlCQXVCMUIsQ0FBQTtBQUVMLENBQUMsRUEzQk0sYUFBYSxLQUFiLGFBQWEsUUEyQm5CO0FDM0JELElBQVUsYUFBYSxDQXlIdEI7QUF6SEQsV0FBVSxhQUFhLEVBQUMsQ0FBQztJQUVyQjtRQWVJO1lBWlEsZUFBVSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBWSxDQUFDO1lBQ3hDLG9CQUFlLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFpQixDQUFDO1lBQ2xELGFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQWlCLENBQUM7WUFLM0MsbUJBQWMsR0FBRyxJQUFJLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQWVwRCxXQUFNLEdBQUc7Z0JBQ0wsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQU8sc0JBQXNCLENBQUM7YUFDaEYsQ0FBQTtZQVhHLElBQUksQ0FBQyxNQUFNLEdBQUc7Z0JBQ1YsYUFBYSxFQUFFO29CQUNYLE1BQU0sRUFBRSxFQUFFO2lCQUNiO2FBQ0osQ0FBQztZQUVGLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxTQUFTLENBQUMsV0FBVyxDQUFDLGNBQVEsQ0FBQyxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQU1ELHNCQUFJLHdCQUFLO2lCQUFUO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3ZCLENBQUM7OztXQUFBO1FBRUQsc0JBQUksOEJBQVc7aUJBQWY7Z0JBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDN0IsQ0FBQzs7O1dBQUE7UUFFRCxzQkFBSSw4QkFBVztpQkFBZjtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUM3QixDQUFDOzs7V0FBQTtRQUVELHNCQUFJLGlDQUFjO2lCQUFsQjtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUNoQyxDQUFDOzs7V0FBQTtRQUVELHNCQUFJLDRCQUFTO2lCQUFiO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQzNCLENBQUM7OztXQUFBO1FBRUQsc0JBQUksMEJBQU87aUJBQVg7Z0JBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQSxtQ0FBbUM7WUFDNUQsQ0FBQzs7O1dBQUE7UUFFRCxzQkFBSSwyQkFBUTtpQkFBWjtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7WUFDL0IsQ0FBQzs7O1dBQUE7UUFFRCxzQkFBSSx5QkFBTTtpQkFBVjtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO1lBQ3ZFLENBQUM7OztXQUFBO1FBRUQsb0JBQUksR0FBSjtZQUFBLGlCQVlDO1lBWEcsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBLENBQUM7Z0JBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUNuRCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFRLFVBQUEsUUFBUTtnQkFDOUIsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUM7cUJBQ3JELElBQUksQ0FBQyxVQUFBLENBQUM7b0JBQ0gsS0FBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7b0JBQ3RCLEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO29CQUN4QixRQUFRLENBQUMsS0FBSSxDQUFDLENBQUM7Z0JBQ25CLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDO1FBRUQsMkJBQVcsR0FBWDtZQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEQsQ0FBQztRQUVELDJCQUFXLEdBQVgsVUFBWSxJQUFZO1lBQ3BCLElBQUksUUFBa0IsQ0FBQztZQUN2QixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsUUFBUSxHQUFHLElBQUksYUFBYSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyRCxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQW9CLElBQU0sQ0FBQyxDQUFDO1lBQ2hELENBQUM7WUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUVELHlCQUFTLEdBQVQsVUFBVSxLQUFhO1lBQ25CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO1FBQzVDLENBQUM7UUFFRCxtQ0FBbUIsR0FBbkIsVUFBb0IsTUFBMkI7WUFDM0MsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUUxQyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7WUFDL0MsRUFBRSxDQUFBLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3RFLHNCQUFzQjtnQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQ3RELElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN6RCxDQUFDO1lBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBRUQsZ0NBQWdCLEdBQWhCLFVBQWlCLEtBQW9CO1lBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztZQUNsQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBRUQsc0JBQU0sR0FBTixVQUFPLE9BQXNCO1lBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFTCxZQUFDO0lBQUQsQ0FBQyxBQXJIRCxJQXFIQztJQXJIWSxtQkFBSyxRQXFIakIsQ0FBQTtBQUVMLENBQUMsRUF6SFMsYUFBYSxLQUFiLGFBQWEsUUF5SHRCO0FFekhELElBQVUsYUFBYSxDQWtDdEI7QUFsQ0QsV0FBVSxhQUFhLEVBQUMsQ0FBQztJQUVyQixJQUFpQixjQUFjLENBOEI5QjtJQTlCRCxXQUFpQixjQUFjLEVBQUMsQ0FBQztRQUU1QixpQkFDSSxPQUFpQjtZQUVsQixNQUFNLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFDakIsRUFBRSxFQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxNQUFNO2dCQUNkLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUNoQjtvQkFDSSxLQUFLLEVBQUU7d0JBQ0gsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO3FCQUN4QjtvQkFDRCxFQUFFLEVBQUU7d0JBQ0EsS0FBSyxFQUFFLFVBQUEsRUFBRTs0QkFDTCxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQ3RCLENBQUM7cUJBQ0o7aUJBQ0osRUFDRCxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBQ3RCLENBQUMsQ0FBQyxDQUNMLENBQUM7UUFDTixDQUFDO1FBcEJnQixzQkFBTyxVQW9CdkIsQ0FBQTtJQVFMLENBQUMsRUE5QmdCLGNBQWMsR0FBZCw0QkFBYyxLQUFkLDRCQUFjLFFBOEI5QjtBQUVMLENBQUMsRUFsQ1MsYUFBYSxLQUFiLGFBQWEsUUFrQ3RCO0FDbENELElBQVUsYUFBYSxDQWlHdEI7QUFqR0QsV0FBVSxhQUFhLEVBQUMsQ0FBQztJQUVyQjtRQU9JLHFCQUFZLFdBQWtDO1lBSnRDLFlBQU8sR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQW9CLENBQUM7WUFFckQsZ0JBQVcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBRzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1lBRS9CLElBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFO2lCQUNuRCxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUE3QixDQUE2QixDQUFDLENBQUM7WUFDN0MsU0FBUyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBRUQsc0JBQUksK0JBQU07aUJBQVY7Z0JBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDeEIsQ0FBQzs7O1dBQUE7UUFFRCxnQ0FBVSxHQUFWLFVBQVcsS0FBd0I7WUFBbkMsaUJBbUVDO1lBbEVHLElBQU0sUUFBUSxHQUFZLEVBQUUsQ0FBQztZQUU3QixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3BELElBQU0sZUFBZSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQSxRQUFRO2dCQUMzQyxJQUFJLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RCxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ25FLENBQUM7Z0JBQ0QsSUFBTSxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLE1BQU0sQ0FBd0I7b0JBQzFCLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxFQUNWO3dCQUNJLEtBQUssRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQztxQkFDOUMsRUFDRCxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNmLE1BQU0sRUFBRSxLQUFLLENBQUMsUUFBUSxLQUFLLFFBQVE7b0JBQ25DLFFBQVEsRUFBRTt3QkFDTixTQUFTLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUM7d0JBQzNELEtBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBQSxRQUFRLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7b0JBQzNELENBQUM7aUJBQ0osQ0FBQTtZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLElBQUksQ0FBQyw0QkFBYyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBRXZELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUNuQixRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNuRCxDQUFDO2dCQUNELElBQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxNQUFNO29CQUNyQyxNQUFNLENBQXdCO3dCQUMxQixJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFDVjs0QkFDSSxLQUFLLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7eUJBQ3pDLEVBQ0QsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDYixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sS0FBSyxNQUFNO3dCQUMvQixRQUFRLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBQSxNQUFNLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQTVDLENBQTRDO3FCQUMvRCxDQUFBO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUNILFFBQVEsQ0FBQyxJQUFJLENBQUMsNEJBQWMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN6RCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1RCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRTVDLElBQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPO3dCQUN2QyxNQUFNLENBQXdCOzRCQUMxQixJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFDVjtnQ0FDSSxLQUFLLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQzs2QkFDeEQsRUFDRCxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUNkLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxLQUFLLE9BQU87NEJBQ2pDLFFBQVEsRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFBLE9BQU8sRUFBRSxDQUFDLEVBQWhDLENBQWdDO3lCQUNuRCxDQUFBO29CQUNMLENBQUMsQ0FBQyxDQUFDO29CQUNILFFBQVEsQ0FBQyxJQUFJLENBQUMsNEJBQWMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDMUQsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0wsa0JBQUM7SUFBRCxDQUFDLEFBdkZELElBdUZDO0lBdkZZLHlCQUFXLGNBdUZ2QixDQUFBO0FBUUwsQ0FBQyxFQWpHUyxhQUFhLEtBQWIsYUFBYSxRQWlHdEI7QUNqR0QsSUFBVSxhQUFhLENBbUV0QjtBQW5FRCxXQUFVLGFBQWEsRUFBQyxDQUFDO0lBRXJCO1FBQUE7WUFFWSxhQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFlLENBQUM7UUFpRHJELENBQUM7UUEvQ0csaUNBQVUsR0FBVixVQUFXLE9BQTRCO1lBQXZDLGlCQXlDQztZQXhDRyxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7Z0JBQ3JDLElBQUksR0FBVSxDQUFDO2dCQUNmLElBQU0sT0FBTyxHQUFHO29CQUNaLEtBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixDQUFDLENBQUE7Z0JBQ0QsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsS0FBSztzQkFDckMsWUFBWTtzQkFDWixLQUFLLENBQUM7Z0JBQ1osRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2QsSUFBSSxNQUFNLFNBQUEsQ0FBQztvQkFDWCxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFDWjt3QkFDSSxFQUFFLEVBQUU7NEJBQ0EsS0FBSyxFQUFFLE9BQU87eUJBQ2pCO3dCQUNELElBQUksRUFBRTs0QkFDRixzQkFBc0I7NEJBQ3RCLE1BQU0sRUFBRSxVQUFBLEtBQUssSUFBSSxPQUFBLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUF0QixDQUFzQjt5QkFDMUM7cUJBQ0osRUFDRCxFQUFFLENBQ0wsQ0FBQztnQkFFTixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUNaO3dCQUNJLEtBQUssRUFBRTs0QkFDSCxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVE7eUJBQ25CO3dCQUNELEVBQUUsRUFBRTs0QkFDQSxLQUFLLEVBQUUsT0FBTzt5QkFDakI7cUJBQ0osQ0FDSixDQUFBO2dCQUNMLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO29CQUNmLEdBQUc7aUJBQ04sQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUE7WUFDRixNQUFNLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUVELHNCQUFJLGlDQUFPO2lCQUFYO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3pCLENBQUM7OztXQUFBO1FBRUwsbUJBQUM7SUFBRCxDQUFDLEFBbkRELElBbURDO0lBbkRZLDBCQUFZLGVBbUR4QixDQUFBO0FBY0wsQ0FBQyxFQW5FUyxhQUFhLEtBQWIsYUFBYSxRQW1FdEI7QUNuRUQsSUFBVSxhQUFhLENBbUN0QjtBQW5DRCxXQUFVLGFBQWEsRUFBQyxDQUFDO0lBRXJCO1FBSUksNkJBQVksS0FBWTtZQUNwQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUkseUJBQVcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFdkQsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3ZDLENBQUM7UUFFRCx3Q0FBVSxHQUFWLFVBQVcsS0FBb0I7WUFDM0IsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQW1CO2dCQUNsRCxRQUFRLEVBQUUsS0FBSyxDQUFDLFlBQVk7Z0JBQzVCLE1BQU0sRUFBRSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU07Z0JBQzNCLE9BQU8sRUFBRSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU87YUFDaEMsQ0FBQyxDQUFBO1FBQ04sQ0FBQztRQUVELHNCQUFJLHVDQUFNO2lCQUFWO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxNQUFNLElBQUksT0FBZTtvQkFDekQsWUFBWSxFQUFFLE1BQU0sQ0FBQyxRQUFRO29CQUM3QixNQUFNLEVBQUU7d0JBQ0osSUFBSSxFQUFFOzRCQUNGLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTs0QkFDckIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO3lCQUMxQjtxQkFDSjtpQkFDSixFQVI2QyxDQVE3QyxDQUFDLENBQUM7WUFDUCxDQUFDOzs7V0FBQTtRQUVMLDBCQUFDO0lBQUQsQ0FBQyxBQS9CRCxJQStCQztJQS9CWSxpQ0FBbUIsc0JBK0IvQixDQUFBO0FBRUwsQ0FBQyxFQW5DUyxhQUFhLEtBQWIsYUFBYSxRQW1DdEI7QUNuQ0QsSUFBVSxhQUFhLENBc0N0QjtBQXRDRCxXQUFVLGFBQWEsRUFBQyxDQUFDO0lBRXJCO1FBQUE7WUFFWSxZQUFPLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFVLENBQUM7UUFnQy9DLENBQUM7UUE5QkcsOEJBQVUsR0FBVixVQUFXLEtBQWMsRUFBRSxXQUFvQixFQUFFLFFBQWtCO1lBQW5FLGlCQXlCQztZQXhCRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxVQUFVLEdBQUcsT0FBTyxFQUN0QztnQkFDSSxLQUFLLEVBQUU7b0JBQ0gsSUFBSSxFQUFFLFFBQVEsR0FBRyxTQUFTLEdBQUcsTUFBTTtvQkFDbkMsV0FBVyxFQUFFLFdBQVc7aUJBQzNCO2dCQUNELEtBQUssRUFBRTtvQkFDSCxLQUFLLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxFQUFFLEVBQUU7b0JBQ0EsUUFBUSxFQUFFLFVBQUMsRUFBaUI7d0JBQ3hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzRCQUN6RCxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ3BCLElBQU0sS0FBSyxHQUFxQixFQUFFLENBQUMsTUFBTSxDQUFDOzRCQUMxQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ2pCLENBQUM7b0JBQ0wsQ0FBQztvQkFDRCxNQUFNLEVBQUUsVUFBQyxFQUFFO3dCQUNQLEtBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pDLENBQUM7aUJBQ0o7YUFDSixFQUNELEVBQUUsQ0FDTCxDQUFDO1FBQ04sQ0FBQztRQUVELHNCQUFJLDZCQUFNO2lCQUFWO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ3hCLENBQUM7OztXQUFBO1FBQ0wsZ0JBQUM7SUFBRCxDQUFDLEFBbENELElBa0NDO0lBbENZLHVCQUFTLFlBa0NyQixDQUFBO0FBRUwsQ0FBQyxFQXRDUyxhQUFhLEtBQWIsYUFBYSxRQXNDdEI7QUN0Q0QsSUFBVSxhQUFhLENBc1d0QjtBQXRXRCxXQUFVLGFBQWE7SUFBQyxJQUFBLFNBQVMsQ0FzV2hDO0lBdFd1QixXQUFBLFNBQVMsRUFBQyxDQUFDO1FBRS9CO1lBQUE7Z0JBRUksU0FBSSxHQUFHLFNBQVMsQ0FBQztnQkFHakIsd0JBQW1CLEdBQUcsR0FBRyxDQUFDO2dCQUMxQixvQkFBZSxHQUFHLEdBQUcsQ0FBQztnQkFDdEIsaUJBQVksR0FBRyxJQUFJLENBQUM7Z0JBaVVwQixrQkFBYSxHQUFHO29CQUNaLFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxZQUFZO29CQUNaLFNBQVM7b0JBQ1QsU0FBUztvQkFFVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBRVQsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUVULFNBQVM7b0JBQ1QsU0FBUztvQkFDVCxTQUFTO29CQUNULFNBQVM7b0JBQ1QsU0FBUztpQkFDWixDQUFDO1lBRU4sQ0FBQztZQXpWRywyQkFBUyxHQUFULFVBQVUsT0FBMEI7Z0JBQ2hDLElBQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE1BQU0sQ0FBZ0I7b0JBQ2xCLE1BQU0sRUFBRTt3QkFDSixLQUFLLEVBQUUsUUFBUTt3QkFDZixJQUFJLEVBQUU7NEJBQ0YsTUFBTSxFQUFFLGlCQUFpQixDQUFDLE1BQU07eUJBQ25DO3dCQUNELElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFO3FCQUN0QjtvQkFDRCxZQUFZLEVBQUUsaUJBQWlCLENBQUMsUUFBUTtpQkFDM0MsQ0FBQTtZQUNMLENBQUM7WUFFRCwwQkFBUSxHQUFSLFVBQVMsT0FBMEI7Z0JBQy9CLE1BQU0sQ0FBQztvQkFDSCxJQUFJLENBQUMsZUFBZSxFQUFFO29CQUN0QixJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDO29CQUNoQyxJQUFJLENBQUMsc0JBQXNCLEVBQUU7b0JBQzdCLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTtvQkFDM0IsSUFBSSxDQUFDLG9CQUFvQixFQUFFO2lCQUM5QixDQUFDO1lBQ04sQ0FBQztZQUVELHVCQUFLLEdBQUwsVUFBTSxNQUFjLEVBQUUsT0FBNkI7Z0JBQW5ELGlCQXNHQztnQkFyR0csRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDakMsQ0FBQztnQkFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtvQkFDekMsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRWxFLElBQU0sVUFBVSxHQUFHLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FDdkMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDdkQsSUFBSSxZQUFvQixDQUFDO29CQUN6QixNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDbkIsS0FBSyxVQUFVOzRCQUNYLFlBQVksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBWixDQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2xFLEtBQUssQ0FBQzt3QkFDVixLQUFLLE1BQU07NEJBQ1AsSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFBOzRCQUNsQixZQUFZLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQVosQ0FBWSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7NEJBQzlELEtBQUssQ0FBQzt3QkFDVjs0QkFDSSxZQUFZLEdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUMsQ0FBQyxDQUFDOzRCQUN2RCxLQUFLLENBQUM7b0JBQ2QsQ0FBQztvQkFDRCxZQUFZLElBQUksQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUNoRCxJQUFNLEtBQUssR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFFckQsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUM7b0JBQ2xFLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQztvQkFDOUIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQzFDLGlDQUEyRCxFQUExRCxpQkFBUyxFQUFFLHVCQUFlLENBQWlDO29CQUNoRSxDQUFDO29CQUVELElBQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUU5QixJQUFNLGVBQWUsR0FBRyxVQUFDLENBQVMsRUFBRSxJQUEyQjt3QkFBM0Isb0JBQTJCLEdBQTNCLE9BQU8sS0FBSSxDQUFDLGVBQWU7d0JBQzNELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7d0JBQzFELE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQzVDLENBQUMsQ0FBQztvQkFDRixJQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTt3QkFDOUIsTUFBTSxDQUFDOzRCQUNILEtBQUssRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDOzRCQUM1QixNQUFBLElBQUk7eUJBQ1AsQ0FBQTtvQkFDTCxDQUFDLENBQUMsQ0FBQztvQkFFSCxJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQXBCLENBQW9CLENBQUMsQ0FBQyxDQUFDO29CQUNuRSxJQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLElBQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztvQkFFdEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDO3dCQUN2QixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDckIsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7cUJBQy9CLENBQUMsQ0FBQztvQkFDSCxJQUFJLEtBQWlCLENBQUM7b0JBQ3RCLElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7b0JBRW5DLEdBQUcsQ0FBQyxDQUFxQixVQUFXLEVBQVgsMkJBQVcsRUFBWCx5QkFBVyxFQUFYLElBQVcsQ0FBQzt3QkFBaEMsSUFBTSxVQUFVLG9CQUFBO3dCQUNqQixFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNuQixJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzs0QkFDaEMsMkJBQTJCOzRCQUMzQixLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDO2dDQUNuQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDO2dDQUN0QyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDOzZCQUNoRCxDQUFDLENBQUM7d0JBQ1AsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixLQUFLLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQzdDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDO3dCQUN2QyxDQUFDO3dCQUNELElBQU0sT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLHlCQUF5QixDQUNuRCxVQUFVLENBQUMsS0FBSyxFQUNoQixFQUFFLE9BQUEsS0FBSyxFQUFFLE9BQUEsS0FBSyxFQUFFLENBQUMsQ0FBQzt3QkFDdEIsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7d0JBQzlCLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3RCLEtBQUssR0FBRyxLQUFLLENBQUM7d0JBQ2QsS0FBSyxHQUFHLElBQUksQ0FBQztxQkFDaEI7b0JBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUN4QixJQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQzt3QkFDeEYsV0FBVyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7d0JBQ2xDLFdBQVcsQ0FBQyxTQUFTLENBQ2pCLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FDdkIsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUNYLFFBQVEsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxjQUFjO3dCQUNuRCxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsK0JBQStCO3lCQUM5RCxDQUFDLENBQUMsQ0FBQzt3QkFDaEIsRUFBRSxDQUFBLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUEsQ0FBQzs0QkFDNUIsOEJBQThCOzRCQUM5QixXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7d0JBQ2hDLENBQUM7d0JBQ0QsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDOUIsQ0FBQztvQkFFRCxJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNsQyxNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQzFELE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7b0JBQ2xDLElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNqRCxVQUFVLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQztvQkFDdkMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7b0JBRS9CLE1BQU0sQ0FBQyxHQUFHLENBQUM7O2dCQUNmLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUVPLG9DQUFrQixHQUExQixVQUNJLEtBQWlCLEVBQ2pCLFNBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFnQztnQkFFaEMsSUFBTSxNQUFNLEdBQWtCLEVBQUUsQ0FBQztnQkFDakMsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDVixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUNqQyxJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxTQUFTLENBQUM7b0JBQzdGLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLENBQUM7Z0JBQ0QsSUFBTSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDNUUsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1lBRU8sOEJBQVksR0FBcEIsVUFBcUIsS0FBZSxFQUFFLFlBQW9CO2dCQUN0RCxJQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7Z0JBQzNCLElBQU0sU0FBUyxHQUFHLFVBQUMsSUFBWTtvQkFDM0IsT0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQWpELENBQWlELENBQUM7Z0JBRXRELElBQUksV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDdkIsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUV6QixPQUFPLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDbEIsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUMzQixJQUFNLE9BQU8sR0FBRyxXQUFXLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztvQkFDekMsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNwQyxFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksUUFBUSxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQzFDLFNBQVM7d0JBQ1QsV0FBVyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7d0JBQzFCLFlBQVksR0FBRyxRQUFRLENBQUM7b0JBQzVCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osV0FBVzt3QkFDWCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOzRCQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQzVCLENBQUM7d0JBQ0QsV0FBVyxHQUFHLElBQUksQ0FBQzt3QkFDbkIsWUFBWSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDMUMsQ0FBQztnQkFDTCxDQUFDO2dCQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUVPLGlDQUFlLEdBQXZCO2dCQUNJLElBQU0sYUFBYSxHQUFHLElBQUksdUJBQVMsRUFBRSxDQUFDO2dCQUN0QyxJQUFNLGVBQWUsR0FBRyxJQUFJLHVCQUFTLEVBQUUsQ0FBQztnQkFDeEMsTUFBTSxDQUFDO29CQUNILFVBQVUsRUFBRSxVQUFDLEtBQW9CO3dCQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFDVjs0QkFDSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUN4QixhQUFhLENBQUMsVUFBVSxDQUNwQixLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUMxRCwwQkFBMEIsRUFDMUIsSUFBSSxDQUFDOzRCQUNULGVBQWUsQ0FBQyxVQUFVLENBQ3RCLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQzVELCtCQUErQixFQUMvQixJQUFJLENBQUM7eUJBQ1osQ0FBQyxDQUFDO29CQUNYLENBQUM7b0JBQ0QsTUFBTSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUN2QixhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7d0JBQ3RCLE9BQXFCLEVBQUUsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7b0JBQXpELENBQXlELENBQUMsRUFDNUQsZUFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO3dCQUMxQixPQUFxQixFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO29CQUEzRCxDQUEyRCxDQUFDLENBQ25FO2lCQUNKLENBQUE7WUFDTCxDQUFDO1lBRU8sb0NBQWtCLEdBQTFCLFVBQTJCLE9BQTBCO2dCQUNqRCxJQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQXVCLENBQUM7Z0JBQ3JELE1BQU0sQ0FBaUI7b0JBQ25CLFVBQVUsRUFBRSxVQUFDLEVBQWlCO3dCQUMxQixJQUFNLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUMxQix5Q0FBeUM7d0JBQ3pDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNoRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUM1QixDQUFDO3dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3BCLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLLElBQUksT0FBdUI7NEJBQ3ZELElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxFQUNWLEVBQUUsRUFDRixDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUNaLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxLQUFLOzRCQUNqQyxRQUFRLEVBQUU7Z0NBQ04sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQUEsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzRCQUN6QyxDQUFDO3lCQUNKLEVBUm1DLENBUW5DLENBQUMsQ0FBQzt3QkFFSCxJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxFQUNoQjs0QkFDSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUN0Qiw0QkFBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7eUJBQ2xDLENBQUMsQ0FBQzt3QkFDUCxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUVoQixDQUFDO29CQUNELE1BQU0sRUFBRSxNQUFNLENBQUMsWUFBWSxFQUFFO2lCQUNoQyxDQUFDO1lBQ04sQ0FBQztZQUVPLHdDQUFzQixHQUE5QjtnQkFDSSxJQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQXVCLENBQUM7Z0JBQ3JELE1BQU0sQ0FBaUI7b0JBQ25CLFVBQVUsRUFBRSxVQUFDLEVBQWlCO3dCQUUxQixJQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsWUFBWSxFQUN6Qjs0QkFDSSxLQUFLLEVBQUU7Z0NBQ0gsSUFBSSxFQUFFLFFBQVE7NkJBQ2pCOzRCQUNELEVBQUUsRUFBRTtnQ0FDQSxLQUFLLEVBQUUsY0FBTSxPQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFsRCxDQUFrRDs2QkFDbEU7eUJBQ0osRUFDRCxDQUFDLE1BQU0sQ0FBQyxDQUNYLENBQUM7d0JBRUYsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFDaEI7NEJBQ0ksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQzs0QkFDMUIsTUFBTTt5QkFDVCxDQUFDLENBQUM7d0JBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFFaEIsQ0FBQztvQkFDRCxNQUFNLEVBQUUsTUFBTSxDQUFDLFlBQVksRUFBRTtpQkFDaEMsQ0FBQztZQUNOLENBQUM7WUFFTyxzQ0FBb0IsR0FBNUI7Z0JBQ0ksSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQWxCLENBQWtCLENBQUMsQ0FBQztnQkFDckUsSUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxFQUFMLENBQUssQ0FBQztxQkFDNUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBYixDQUFhLENBQUMsQ0FBQztnQkFFN0IsSUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUF1QixDQUFDO2dCQUNyRCxNQUFNLENBQWlCO29CQUNuQixVQUFVLEVBQUUsVUFBQyxFQUFpQjt3QkFDMUIsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7d0JBQ2xDLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLOzRCQUM1QixPQUF1QjtnQ0FDbkIsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFDckI7b0NBQ0ksS0FBSyxFQUFFO3dDQUNILGVBQWUsRUFBRSxLQUFLO3FDQUN6QjtpQ0FDSixDQUFDO2dDQUNOLE1BQU0sRUFBRSxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssS0FBSyxLQUFLO2dDQUMxQyxRQUFRLEVBQUU7b0NBQ04sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLE9BQUEsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0NBQ3RELENBQUM7NkJBQ0o7d0JBWEQsQ0FXQyxDQUFDLENBQUM7d0JBRVAsSUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRTs0QkFDeEIsQ0FBQyxDQUFDLE9BQU8sRUFBRTtnQ0FDUCxDQUFDLENBQUMsT0FBTyxFQUNMO29DQUNJLEtBQUssRUFBRTt3Q0FDSCxJQUFJLEVBQUUsVUFBVTt3Q0FDaEIsT0FBTyxFQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTTtxQ0FDckM7b0NBQ0QsRUFBRSxFQUFFO3dDQUNBLE1BQU0sRUFBRSxVQUFBLEVBQUUsSUFBSSxPQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBckUsQ0FBcUU7cUNBQ3RGO2lDQUNKLENBQ0o7Z0NBQ0QsY0FBYzs2QkFDakIsQ0FBQzt5QkFDTCxDQUFDLENBQUM7d0JBRUgsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixFQUM3Qjs0QkFDSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUN0Qiw0QkFBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7NEJBQy9CLFVBQVU7eUJBQ2IsQ0FBQyxDQUFDO3dCQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUM7b0JBRWhCLENBQUM7b0JBQ0QsTUFBTSxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUU7aUJBQ2hDLENBQUM7WUFFTixDQUFDO1lBNEJMLGNBQUM7UUFBRCxDQUFDLEFBbFdELElBa1dDO1FBbFdZLGlCQUFPLFVBa1duQixDQUFBO0lBRUwsQ0FBQyxFQXRXdUIsU0FBUyxHQUFULHVCQUFTLEtBQVQsdUJBQVMsUUFzV2hDO0FBQUQsQ0FBQyxFQXRXUyxhQUFhLEtBQWIsYUFBYSxRQXNXdEI7QUN0V0QsSUFBVSxZQUFZLENBaUJyQjtBQWpCRCxXQUFVLFlBQVksRUFBQyxDQUFDO0lBRXBCO1FBRUksNEJBQVksS0FBWTtZQUVwQixzQ0FBc0M7WUFDdEMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLENBQUM7Z0JBQ3hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyRCxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFUCxDQUFDO1FBRUwseUJBQUM7SUFBRCxDQUFDLEFBYkQsSUFhQztJQWJZLCtCQUFrQixxQkFhOUIsQ0FBQTtBQUVMLENBQUMsRUFqQlMsWUFBWSxLQUFaLFlBQVksUUFpQnJCO0FDakJELElBQVUsWUFBWSxDQTREckI7QUE1REQsV0FBVSxZQUFZLEVBQUMsQ0FBQztJQUVwQjtRQU1JLDRCQUFZLFFBQW1CO1lBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBRXpCLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFBLFNBQVM7Z0JBQ2pDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzFDLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQ0gsR0FBRyxFQUFFLG9CQUFvQjtvQkFDekIsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLE1BQU07b0JBQ2hCLFdBQVcsRUFBRSxrQkFBa0I7b0JBQy9CLElBQUksRUFBRSxPQUFPO2lCQUNoQixDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxrQkFBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWpDLElBQU0sR0FBRyxHQUFHLElBQUksc0JBQVMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzRSxJQUFNLGtCQUFrQixHQUFHLElBQUksK0JBQWtCLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEcsSUFBTSxVQUFVLEdBQUcsSUFBSSx1QkFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RGLElBQU0sY0FBYyxHQUFHLElBQUksMkJBQWMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWpHLDBFQUEwRTtZQUMxRSw0RUFBNEU7UUFDaEYsQ0FBQztRQUVELGtDQUFLLEdBQUw7WUFBQSxpQkFtQkM7WUFqQkcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDO2dCQUU3RCxLQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxnQ0FBbUIsQ0FBQyxLQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFdkUsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFFbkQsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQztvQkFFOUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUU7d0JBQ3pCLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7NEJBQ2pDLE1BQU0sQ0FBQyx3Q0FBd0MsQ0FBQzt3QkFDcEQsQ0FBQztvQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFFUCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBRVAsQ0FBQztRQUVELHVDQUFVLEdBQVYsVUFBVyxFQUFVO1lBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFFTCx5QkFBQztJQUFELENBQUMsQUF4REQsSUF3REM7SUF4RFksK0JBQWtCLHFCQXdEOUIsQ0FBQTtBQUVMLENBQUMsRUE1RFMsWUFBWSxLQUFaLFlBQVksUUE0RHJCO0FDNURELElBQVUsWUFBWSxDQXNDckI7QUF0Q0QsV0FBVSxZQUFZLEVBQUMsQ0FBQztJQUVwQjtRQUFBO1FBa0NBLENBQUM7UUFoQ1UseUJBQVcsR0FBbEIsVUFBbUIsTUFBYztZQUM3QixJQUFJLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN0QyxHQUFHLENBQUMsQ0FBZ0IsVUFBaUIsRUFBakIsS0FBQSxNQUFNLENBQUMsVUFBVSxFQUFqQixjQUFpQixFQUFqQixJQUFpQixDQUFDO2dCQUFqQyxJQUFNLEtBQUssU0FBQTtnQkFDWixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDaEM7WUFDRCxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxJQUFJLElBQUksRUFBVCxDQUFTLENBQUMsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUVNLCtCQUFpQixHQUF4QixVQUF5QixNQUFjLEVBQUUsTUFBYyxFQUFFLFNBQWlCO1lBQ3RFLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNkLEtBQUssRUFDTCxHQUFHLENBQUMsQ0FBZ0IsVUFBaUIsRUFBakIsS0FBQSxNQUFNLENBQUMsVUFBVSxFQUFqQixjQUFpQixFQUFqQixJQUFpQixDQUFDO2dCQUFqQyxJQUFNLEtBQUssU0FBQTtnQkFDWixHQUFHLENBQUMsQ0FBZSxVQUFzQixFQUF0QixLQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUF0QixjQUFzQixFQUF0QixJQUFzQixDQUFDO29CQUFyQyxJQUFNLElBQUksU0FBQTtvQkFDWCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDNUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ2QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs0QkFBQyxJQUFJLElBQUksR0FBRyxDQUFDO3dCQUM3QixJQUFJLElBQUksSUFBSSxDQUFDO29CQUNqQixDQUFDO29CQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDeEIsS0FBSyxDQUFDLEtBQUssQ0FBQztvQkFDaEIsQ0FBQztpQkFDSjthQUNKO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLEdBQUcsUUFBUSxDQUFDO1lBQ3BCLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUM7UUFDbEMsQ0FBQztRQUVMLG9CQUFDO0lBQUQsQ0FBQyxBQWxDRCxJQWtDQztJQWxDWSwwQkFBYSxnQkFrQ3pCLENBQUE7QUFFTCxDQUFDLEVBdENTLFlBQVksS0FBWixZQUFZLFFBc0NyQjtBQ3JDRCxJQUFVLFlBQVksQ0FnaEJyQjtBQWhoQkQsV0FBVSxZQUFZLEVBQUMsQ0FBQztJQUVwQjs7Ozs7Ozs7Ozs7O09BWUc7SUFDSDtRQXFCSSxlQUFZLFFBQW1CO1lBWC9CLGtCQUFhLEdBQUcsR0FBRyxDQUFDO1lBRXBCLFVBQUssR0FBZ0IsRUFBRSxDQUFDO1lBQ3hCLGNBQVMsR0FBbUIsRUFBRSxDQUFDO1lBQy9CLFlBQU8sR0FBRyxJQUFJLG9CQUFPLEVBQUUsQ0FBQztZQUN4QixXQUFNLEdBQUcsSUFBSSxtQkFBTSxFQUFFLENBQUM7WUFHZCxnQkFBVyxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBYSxDQUFDO1lBQzFDLG1CQUFjLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFXLENBQUM7WUFHL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFFekIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBRWxCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBRTFCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBRUQsMEJBQVUsR0FBVjtZQUNJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNsRixDQUFDO1FBQ0wsQ0FBQztRQUVELGtDQUFrQixHQUFsQjtZQUFBLGlCQWtOQztZQWpORyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBRW5ELGtCQUFrQjtZQUVsQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztnQkFDdkMsSUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBQzVDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLGFBQWEsS0FBSyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNyRSxLQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxxQkFBcUI7WUFFckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFO2lCQUNqQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQyxDQUFDO2lCQUN6RSxTQUFTLENBQUMsVUFBQSxDQUFDO2dCQUNSLEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM5QixLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFFaEMsSUFBTSxRQUFRLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRO3VCQUNuRCxLQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztnQkFDN0MsSUFBSSxPQUEyQixDQUFDO2dCQUNoQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNYLE9BQU8sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN4QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE9BQU8sR0FBRyxLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDeEMsQ0FBQztnQkFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxFQUE3QyxDQUE2QyxDQUFDLENBQUM7Z0JBRWxFLHlDQUF5QztnQkFDekMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDO3FCQUN0RCxTQUFTLENBQUM7b0JBQ1AsSUFBTSxNQUFNLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7b0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxhQUFhOzJCQUN0QixLQUFJLENBQUMsS0FBSyxDQUFDLGFBQWE7MkJBQ3hCLE1BQU0sQ0FBQyxHQUFHOzJCQUNWLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDOUIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDNUIsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1lBRVAsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztnQkFDL0IsT0FBQSxLQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUF0QyxDQUFzQyxDQUFDLENBQUM7WUFFNUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUM1QixNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFFdEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztnQkFDaEMsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDeEIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztnQkFDaEMsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDeEIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQXNCO29CQUFyQixzQkFBUSxFQUFFLDBCQUFVO2dCQUNwRCxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDckMsSUFBTSxRQUFRLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQztvQkFDbkMsSUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDbEQscUJBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbEQsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO2dCQUNoQyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2dCQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoRSxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLGtCQUFrQixFQUFFLEVBQXpCLENBQXlCLENBQUMsQ0FBQztZQUUvRCxxQkFBcUI7WUFFckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsRUFBRTtnQkFDdEIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4QixDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUk7Z0JBQzNCLEtBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ3JCLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQTtZQUVGLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztnQkFDM0IsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN6QyxLQUFLLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDOUIsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztnQkFDdkMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZCLEtBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztnQkFDakMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDMUMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLDJEQUEyRCxDQUFDLENBQUM7WUFDdkYsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBQSxFQUFFO2dCQUNsQyxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUM5QixLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN2QixLQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7Z0JBQ25DLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxQixLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztZQUdILHdCQUF3QjtZQUV4QixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUc7aUJBQ2hCLFNBQVMsQ0FBQyxVQUFBLEVBQUU7Z0JBQ1QsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFMUIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztnQkFDcEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFDRCxJQUFJLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQWUsQ0FBQztnQkFDcEQsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRXpCLEtBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDO2dCQUNuRSxLQUFLLENBQUMsZUFBZSxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQztnQkFDL0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsS0FBSyxDQUFDLFVBQVUsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUM7b0JBQ3JFLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDO2dCQUMzRSxDQUFDO2dCQUVELEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkMsS0FBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7Z0JBRTVCLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQztZQUVQLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVTtpQkFDdkIsU0FBUyxDQUFDLFVBQUEsRUFBRTtnQkFDVCxJQUFJLEtBQUssR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1IsSUFBSSxPQUFLLEdBQWM7d0JBQ25CLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUk7d0JBQ2xCLGVBQWUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWU7d0JBQ3hDLFNBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVM7d0JBQzVCLFVBQVUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVU7d0JBQzlCLFdBQVcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVc7cUJBQ25DLENBQUM7b0JBQ0YsSUFBTSxXQUFXLEdBQUcsT0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsVUFBVTsyQkFDbEQsT0FBSyxDQUFDLFdBQVcsS0FBSyxLQUFLLENBQUMsV0FBVyxDQUFDO29CQUMvQyxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFLLENBQUMsQ0FBQztvQkFFekIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO3dCQUN6QyxJQUFNLE1BQU0sR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUN0RSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzRCQUNULGdDQUFnQzs0QkFDaEMsS0FBSyxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDckUsQ0FBQztvQkFDTCxDQUFDO29CQUVELEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLG9CQUFvQixHQUFHO3dCQUNyQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7d0JBQzFCLGVBQWUsRUFBRSxLQUFLLENBQUMsZUFBZTt3QkFDdEMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO3dCQUM1QixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7cUJBQ2pDLENBQUM7b0JBRUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM3QyxLQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztvQkFFNUIsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzt3QkFDZCxLQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2xDLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRVAsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNO2lCQUNuQixTQUFTLENBQUMsVUFBQSxFQUFFO2dCQUNULElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsVUFBQSxFQUFFO29CQUNyQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDekIsU0FBUyxHQUFHLElBQUksQ0FBQzt3QkFDakIsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDaEIsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFDSCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNaLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7b0JBQ3hELEtBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO29CQUM1QixLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM5QixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFUCxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWE7aUJBQzFCLFNBQVMsQ0FBQyxVQUFBLEVBQUU7Z0JBQ1QsSUFBSSxLQUFLLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNSLEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ2xDLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7b0JBQ2hDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDaEQsS0FBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7Z0JBQ2hDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCxzQkFBSSw2QkFBVTtpQkFBZDtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUMzQyxDQUFDOzs7V0FBQTtRQUVELHNCQUFJLGdDQUFhO2lCQUFqQjtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUM5QyxDQUFDOzs7V0FBQTtRQUVNLDZCQUFhLEdBQXBCLFVBQXFCLFNBQW9CO1lBQXpDLGlCQVFDO1lBUEcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQ2pDLFNBQVMsQ0FBQyxPQUFPLEdBQUc7Z0JBQ2hCLEVBQUUsQ0FBQSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFBLENBQUM7b0JBQ25DLEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDekIsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUNELElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFFTSw2QkFBYSxHQUFwQjtZQUNJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRU0sNkJBQWEsR0FBcEIsVUFBcUIsR0FBVztZQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7WUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQyxFQUFFLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUEsQ0FBQztnQkFDekIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixDQUFDO1FBQ0wsQ0FBQztRQUVNLG1DQUFtQixHQUExQjtZQUNJLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUEsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQztRQUVNLCtCQUFlLEdBQXRCLFVBQXVCLEtBQWU7WUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVPLDBCQUFVLEdBQWxCLFVBQW1CLEVBQVU7WUFBN0IsaUJBdUJDO1lBdEJHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFDRCxNQUFNLENBQUMscUJBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQztpQkFDaEMsSUFBSSxDQUNMLFVBQUMsTUFBYztnQkFDWCxLQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUV4QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsS0FBSyxLQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztnQkFDdEQsQ0FBQztnQkFDRCxJQUFJLENBQUMsQ0FBQztvQkFDRixPQUFPLENBQUMsR0FBRyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7Z0JBQzdELENBQUM7Z0JBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNsQixDQUFDLEVBQ0QsVUFBQSxHQUFHO2dCQUNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2pELEtBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUVPLDBCQUFVLEdBQWxCLFVBQW1CLE1BQWM7WUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDakMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFFN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUQsR0FBRyxDQUFDLENBQWEsVUFBNEIsRUFBNUIsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQTVCLGNBQTRCLEVBQTVCLElBQTRCLENBQUM7Z0JBQXpDLElBQU0sRUFBRSxTQUFBO2dCQUNULElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUM5QjtZQUVELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRWpELElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUNyQyxDQUFDO1FBRU8sa0NBQWtCLEdBQTFCO1lBQUEsaUJBT0M7WUFORyxNQUFNLENBQUMscUJBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixHQUFHLE9BQU8sQ0FBQztpQkFDdEQsSUFBSSxDQUFDLFVBQUMsTUFBYztnQkFDakIsTUFBTSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxTQUFTLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7Z0JBQ3hDLEtBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRU8sMkJBQVcsR0FBbkI7WUFDSSxJQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUNoRCxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFTyw2QkFBYSxHQUFyQjtZQUFBLGlCQWlCQztZQWhCRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxXQUFXLENBQUMsVUFBQSxNQUFNO2dCQUN6RCxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUFuRCxDQUFtRCxDQUFDLENBQUE7WUFFeEQsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUM7aUJBQ3JELElBQUksQ0FBQyxVQUFBLE9BQU87Z0JBQ1QsS0FBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO2dCQUVyQyxzQ0FBc0M7Z0JBQ3RDLFNBQVMsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQ3BDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxNQUFNLEVBQVIsQ0FBUSxDQUFDLENBQUMsQ0FBQztnQkFFNUQsS0FBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEVBQU07d0JBQUwsY0FBSTtvQkFDL0QsT0FBQSxLQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxJQUFJO2dCQUFsQyxDQUFrQyxDQUFDLENBQUM7Z0JBRXhDLEtBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRU8sOEJBQWMsR0FBdEIsVUFBdUIsT0FBZTtZQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1RCxDQUFDO1FBQ0wsQ0FBQztRQUVPLGdDQUFnQixHQUF4QixVQUF5QixPQUFlO1lBQXhDLGlCQUdDO1lBRkcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QixVQUFVLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUE1QixDQUE0QixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFFTyxxQ0FBcUIsR0FBN0I7WUFDSSxtRUFBbUU7WUFDbkUsSUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWE7bUJBQ2xDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2tCQUM1QixTQUFTO2tCQUNULE9BQU8sQ0FBQztZQUNkLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUVPLGlDQUFpQixHQUF6QixVQUEwQixLQUFnQjtZQUExQyxpQkFNQztZQUxHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN0RSxJQUFJLENBQUMsVUFBQyxFQUFNO29CQUFMLGNBQUk7Z0JBQ1IsT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUNwQyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQUEsSUFBSSxFQUFFLENBQUM7WUFEckMsQ0FDcUMsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFFTyxvQ0FBb0IsR0FBNUI7WUFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ2pDLENBQUM7UUFFTyxxQkFBSyxHQUFiLFVBQWlCLElBQU8sRUFBRSxNQUFTO1lBQy9CLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFFTyx5QkFBUyxHQUFqQixVQUFrQixJQUFpQjtZQUMvQixJQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUNoRCxNQUFNLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUVPLGlDQUFpQixHQUF6QjtZQUNJLE1BQU0sQ0FBYTtnQkFDZixTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTO2dCQUMvQixvQkFBb0IsRUFBRTtvQkFDbEIsVUFBVSxFQUFFLFFBQVE7b0JBQ3BCLFdBQVcsRUFBRSxTQUFTO29CQUN0QixTQUFTLEVBQUUsTUFBTTtpQkFDcEI7Z0JBQ0QsZUFBZSxFQUFFLE9BQU87Z0JBQ3hCLFVBQVUsRUFBZSxFQUFFO2FBQzlCLENBQUM7UUFDTixDQUFDO1FBRU8sMEJBQVUsR0FBbEIsVUFBbUIsTUFBYztZQUFqQyxpQkFpQkM7WUFoQkcsSUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvQixJQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUIscUJBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLEVBQ2pDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQzFDLElBQUksQ0FBQztnQkFDRixLQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7Z0JBQ2pDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7Z0JBQ2hDLEtBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2dCQUM3QixLQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3RCxLQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELENBQUMsRUFDRDtnQkFDSSxLQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRU8sNEJBQVksR0FBcEIsVUFBcUIsSUFBd0IsRUFBRSxLQUFxQjtZQUFyQixxQkFBcUIsR0FBckIsWUFBcUI7WUFDaEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNULDBCQUEwQjtnQkFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDUCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVM7MkJBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDakQsTUFBTSxDQUFDO29CQUNYLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDeEIsTUFBTSxDQUFDO29CQUNYLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFFTyw4QkFBYyxHQUF0QixVQUF1QixJQUF5QixFQUFFLEtBQWU7WUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNULDBCQUEwQjtnQkFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDUCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVc7MkJBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDbkQsTUFBTSxDQUFDO29CQUNYLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzt3QkFDMUIsTUFBTSxDQUFDO29CQUNYLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLGlDQUFpQztnQkFFakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQ2xELElBQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDekUsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO3dCQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7b0JBQ3JFLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLHVDQUF1QztnQkFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixDQUFDO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBRU8sd0JBQVEsR0FBaEIsVUFBaUIsRUFBVTtZQUN2QixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBYixDQUFhLENBQUMsQ0FBQztRQUNyRSxDQUFDO1FBM2ZNLG9CQUFjLEdBQUcsV0FBVyxDQUFDO1FBQzdCLHVCQUFpQixHQUFHLHVCQUF1QixDQUFDO1FBQzVDLHVCQUFpQixHQUFHLFFBQVEsQ0FBQztRQUM3Qiw0QkFBc0IsR0FBRyw0QkFBNEIsQ0FBQztRQUN0RCwwQkFBb0IsR0FBRyxJQUFJLENBQUM7UUFDNUIsMEJBQW9CLEdBQUcsS0FBSyxDQUFDO1FBQzdCLHdCQUFrQixHQUFHLGVBQWUsQ0FBQztRQXVmaEQsWUFBQztJQUFELENBQUMsQUEvZkQsSUErZkM7SUEvZlksa0JBQUssUUErZmpCLENBQUE7QUFFTCxDQUFDLEVBaGhCUyxZQUFZLEtBQVosWUFBWSxRQWdoQnJCO0FDN2dCRCxJQUFVLFlBQVksQ0E0WnJCO0FBNVpELFdBQVUsWUFBWSxFQUFDLENBQUM7SUFFcEI7UUFvQkksNkJBQVksS0FBWSxFQUFFLFlBQTJCO1lBcEJ6RCxpQkF3WkM7WUFuWkcsZ0JBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzNDLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1lBU1osb0JBQWUsR0FBd0MsRUFBRSxDQUFDO1lBTTlELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1lBQ2pDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztZQUU5QixJQUFJLENBQUMsTUFBTSxHQUFzQixRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3ZFLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUM3QixNQUFNLENBQUMsUUFBUSxHQUFHLGNBQU0sT0FBQSxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBeEIsQ0FBd0IsQ0FBQztZQUVqRCxJQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUNuQixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQzFCLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FDbEMsQ0FBQyxTQUFTLENBQUMsVUFBQSxFQUFFO2dCQUNWLE9BQUEsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUExRCxDQUEwRCxDQUN6RCxDQUFDO1lBRU4sSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO2dCQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07Z0JBQ3RDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFNLGNBQWMsR0FBRyxVQUFDLEVBQXlCO2dCQUM3QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JELENBQUM7WUFDTCxDQUFDLENBQUE7WUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxVQUFBLEVBQUU7Z0JBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN2QixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUVqRSxJQUFNLFVBQVUsR0FBRyxJQUFJLCtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWpELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLHFCQUFxQixFQUFFLFVBQUMsU0FBcUI7Z0JBQ2hFLEtBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO2dCQUM1QixLQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFDO1lBRUgsdUJBQXVCO1lBRXZCLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQztnQkFDekMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7Z0JBQzdDLEtBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQztnQkFDN0MsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxDQUFDO1lBRUgsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDO2dCQUN2QyxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkIsQ0FBQyxDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDO2dCQUNwQyxLQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7b0JBQzdCLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7d0JBQ3pDLFFBQVEsRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxJQUFJO3FCQUMxRCxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztZQUVILHFCQUFxQjtZQUVyQixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUNoQyxVQUFBLEVBQUU7Z0JBQ0UsS0FBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUV2QixLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNyQixLQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUMzQixLQUFJLENBQUMsVUFBVSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNwQyxLQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztZQUM5QixDQUFDLENBQ0osQ0FBQztZQUVGLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7Z0JBQzVDLEtBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDakUsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQzNCLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO29CQUMxQixDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILHdCQUF3QjtZQUV4QixLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FDbkIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUM1QixLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQ2hDLENBQUMsU0FBUyxDQUNQLFVBQUEsRUFBRSxJQUFJLE9BQUEsS0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQztZQUVsQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXO2lCQUM3QixPQUFPLEVBQUU7aUJBQ1QsUUFBUSxDQUFDLG1CQUFtQixDQUFDLDhCQUE4QixDQUFDO2lCQUM1RCxTQUFTLENBQUMsVUFBQSxDQUFDO2dCQUNSLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDUCxJQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7b0JBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUc7d0JBQ2YsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO3dCQUM5QixlQUFlLEVBQUUsU0FBUyxDQUFDLGVBQWU7cUJBQzdDLENBQUE7Z0JBQ0wsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRVAsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7Z0JBQ3JDLElBQU0sSUFBSSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNwRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNQLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDMUIsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7Z0JBQ3RDLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDUCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2QsT0FBTyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzVDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDO2dCQUMzQyxJQUFJLElBQUksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUMxQixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRztnQkFDckMsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDO1lBRUgsS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsVUFBQSxLQUFLO2dCQUMvQixLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQTtRQUVOLENBQUM7UUFFRCx1Q0FBUyxHQUFUO1lBQ0ksSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDeEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDNUMsQ0FBQztRQUNMLENBQUM7UUFFTywrQ0FBaUIsR0FBekI7WUFDSSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztZQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQ3RCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3JCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDekMsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUVEOztXQUVHO1FBQ0ssNENBQWMsR0FBdEIsVUFBdUIsR0FBVztZQUFsQyxpQkFRQztZQVBHLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBUyxVQUFBLFFBQVE7Z0JBQy9CLElBQU0sVUFBVSxHQUFHLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0MsSUFBTSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNyRCxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2hDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDcEIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVPLHlDQUFXLEdBQW5CO1lBQUEsaUJBU0M7WUFSRyw2Q0FBNkM7WUFDN0MsSUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO2dCQUFLLENBQUM7Z0JBQ3BDLElBQU0sUUFBUSxHQUFHLDBCQUFhLENBQUMsaUJBQWlCLENBQzVDLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3hDLElBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRU8seUNBQVcsR0FBbkI7WUFBQSxpQkFrQkM7WUFqQkcsSUFBTSxnQkFBZ0IsR0FBRztnQkFDckIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDM0IsSUFBSSxPQUFPLEdBQUcsMEJBQTBCLEdBQUcsa0JBQWtCLENBQ2pELEtBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDM0QsSUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDL0MsSUFBTSxRQUFRLEdBQUcsMEJBQWEsQ0FBQyxpQkFBaUIsQ0FDNUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUM7WUFFRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDMUMsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNoRCxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNuQixVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDeEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLGdCQUFnQixFQUFFLENBQUM7WUFDdkIsQ0FBQztRQUNMLENBQUM7UUFFRDs7O1dBR0c7UUFDSyw4Q0FBZ0IsR0FBeEIsVUFBeUIsU0FBa0I7WUFDdkMsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDOUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDeEUsSUFBTSxXQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUNuQyxZQUFZLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFDckMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUUxQyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFFekQsSUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUUzQyxFQUFFLENBQUEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNYLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQ3ZGLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUN6RSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFFMUUsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFlBQVksRUFBQyxDQUFDLENBQUM7Z0JBQzNFLElBQU0sZUFBZSxHQUFnQixJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNwRCxFQUFFLENBQUEsQ0FBQyxlQUFlLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxDQUFBLENBQUM7b0JBQ2hDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO29CQUNsQyxhQUFhLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDakMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixhQUFhLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztvQkFDbEMsYUFBYSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7Z0JBQ2hDLENBQUM7Z0JBQ0QsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDekMsQ0FBQztZQUVELElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3RCLENBQUM7UUFFTyxzQ0FBUSxHQUFoQixVQUFpQixTQUFvQjtZQUFyQyxpQkE2R0M7WUE1R0csRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNiLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLDJCQUEyQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzFELENBQUM7WUFFRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztnQkFDcEUsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUksTUFBMEQsQ0FBQztZQUUvRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsSUFBTSxXQUFXLEdBQUcsVUFBQyxNQUFxQjtvQkFDdEMsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QixFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDekIsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FDcEIsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUMxQixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN2QyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELENBQUM7b0JBQ0QsZ0RBQWdEO29CQUNoRCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN0RCxDQUFDLENBQUM7Z0JBQ0YsTUFBTSxHQUFHO29CQUNMLEtBQUssRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztvQkFDdEQsS0FBSyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO2lCQUM1RCxDQUFDO1lBQ04sQ0FBQztZQUVELElBQUksR0FBRyxJQUFJLHFCQUFRLENBQ2YsSUFBSSxDQUFDLFlBQVksRUFDakIsU0FBUyxDQUFDLElBQUksRUFDZCxNQUFNLEVBQ04sSUFBSSxFQUFFO2dCQUNGLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxJQUFJLEtBQUs7Z0JBQ3ZDLGVBQWUsRUFBRSxTQUFTLENBQUMsZUFBZTthQUM3QyxDQUFDLENBQUM7WUFFUCxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUvQixRQUFRLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEQsQ0FBQztZQUVELElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsVUFBQSxFQUFFO2dCQUM3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsMEJBQTBCO29CQUMxQixJQUFJLFNBQVMsR0FBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsZUFBZSxDQUFFO3lCQUN2RCxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUF6QyxDQUF5QyxDQUFDLENBQUM7b0JBQzVELElBQU0sV0FBUyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEtBQUssRUFBUCxDQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkQsRUFBRSxDQUFDLENBQUMsV0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDWixXQUFTLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3pCLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLGVBQWUsRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsS0FBSyxXQUFTLEVBQWYsQ0FBZSxDQUFDLENBQUM7d0JBQ3RFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7NEJBQ1YsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQzNDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQzt3QkFDcEQsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUNwQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FDM0MsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztvQkFDMUQsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLFVBQUEsRUFBRTtnQkFDekMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxVQUFBLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxVQUFBLEVBQUU7Z0JBQ3ZDLElBQUksS0FBSyxHQUFjLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEQsS0FBSyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO2dCQUMxQixLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDM0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDakIsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQzNDLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7Z0JBQzFELENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILElBQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0UsV0FBVztpQkFDTixRQUFRLENBQUMsbUJBQW1CLENBQUMsK0JBQStCLENBQUM7aUJBQzdELFNBQVMsQ0FBQztnQkFDUCxJQUFJLEtBQUssR0FBYyxLQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RELEtBQUssQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztnQkFDMUIsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0QsQ0FBQyxDQUFDLENBQUM7WUFFUCxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FDOUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7cUJBQ3pELEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLENBQUM7WUFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDL0MsQ0FBQztRQUVPLGlEQUFtQixHQUEzQixVQUE0QixJQUFjO1lBQ3RDLGdFQUFnRTtZQUNoRSx5QkFBeUI7WUFDekIsSUFBTSxHQUFHLEdBQWUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RSxJQUFNLE1BQU0sR0FBZSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXpFLE1BQU0sQ0FBQztnQkFDSCxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsT0FBTyxFQUFFLEVBQUUsS0FBQSxHQUFHLEVBQUUsUUFBQSxNQUFNLEVBQUU7YUFDM0IsQ0FBQTtRQUNMLENBQUM7UUFFTyxnREFBa0IsR0FBMUIsVUFBMkIsR0FBVztZQUF0QyxpQkFpQkM7WUFoQkcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNQLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbkMsQ0FBQztnQkFDRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBQ2pDLENBQUM7WUFFRCxJQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0IsTUFBTyxDQUFDLE1BQU0sR0FBRztnQkFDbkIsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNwQixNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7Z0JBQzNDLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbkMsQ0FBQztnQkFDRCxLQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO1lBQ25DLENBQUMsQ0FBQztRQUNOLENBQUM7UUFyWk0sa0RBQThCLEdBQUcsR0FBRyxDQUFDO1FBQ3JDLG1EQUErQixHQUFHLEdBQUcsQ0FBQztRQXFaakQsMEJBQUM7SUFBRCxDQUFDLEFBeFpELElBd1pDO0lBeFpZLGdDQUFtQixzQkF3Wi9CLENBQUE7QUFFTCxDQUFDLEVBNVpTLFlBQVksS0FBWixZQUFZLFFBNFpyQjtBQ2hhRCxJQUFVLFlBQVksQ0E4RXJCO0FBOUVELFdBQVUsWUFBWSxFQUFDLENBQUM7SUFFcEI7UUFBNkIsMkJBQW9CO1FBQWpEO1lBQTZCLDhCQUFvQjtZQUU3QyxXQUFNLEdBQUc7Z0JBQ0wsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQU8sd0JBQXdCLENBQUM7Z0JBQ3pELFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFTLG1CQUFtQixDQUFDO2dCQUNqRCxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBTyxvQkFBb0IsQ0FBQztnQkFDakQsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQU8sc0JBQXNCLENBQUM7Z0JBQ3hELFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFPLG9CQUFvQixDQUFDO2dCQUNqRCxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBTyxvQkFBb0IsQ0FBQztnQkFDakQsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQWtCLHNCQUFzQixDQUFDO2dCQUNoRSxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBMkMseUJBQXlCLENBQUM7Z0JBQy9GLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFPLHFCQUFxQixDQUFDO2dCQUNuRCxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBTyxxQkFBcUIsQ0FBQzthQUN0RCxDQUFBO1lBRUQsV0FBTSxHQUFHO2dCQUNMLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFhLGVBQWUsQ0FBQztnQkFDL0MsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQU8sY0FBYyxDQUFDO2dCQUN2QyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBYSxjQUFjLENBQUM7Z0JBQzdDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFTLGFBQWEsQ0FBQztnQkFDdkMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQWEsbUJBQW1CLENBQUM7Z0JBQ3ZELFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFxQixxQkFBcUIsQ0FBQzthQUN0RSxDQUFDO1lBRUYsY0FBUyxHQUFHO2dCQUNSLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFZLGVBQWUsQ0FBQztnQkFDM0MsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVksc0JBQXNCLENBQUM7Z0JBQ3pELGFBQWEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFZLHlCQUF5QixDQUFDO2dCQUMvRCxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSxrQkFBa0IsQ0FBQzthQUNwRCxDQUFDO1FBRU4sQ0FBQztRQUFELGNBQUM7SUFBRCxDQUFDLEFBL0JELENBQTZCLFlBQVksQ0FBQyxPQUFPLEdBK0JoRDtJQS9CWSxvQkFBTyxVQStCbkIsQ0FBQTtJQUVEO1FBQTRCLDBCQUFvQjtRQUFoRDtZQUE0Qiw4QkFBb0I7WUFFNUMsV0FBTSxHQUFHO2dCQUNMLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFVLG9CQUFvQixDQUFDO2dCQUN6RCxvQkFBb0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFPLDBCQUEwQixDQUFDO2dCQUNsRSxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBZ0IsZ0JBQWdCLENBQUM7Z0JBQ3ZELGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQU8sNkJBQTZCLENBQUM7Z0JBQ25FLGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQU8sNkJBQTZCLENBQUM7Z0JBQ25FLGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQU8sNkJBQTZCLENBQUM7Z0JBQ25FLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFrQixzQkFBc0IsQ0FBQztnQkFDaEUsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVMsMEJBQTBCLENBQUM7Z0JBQy9ELGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQVMsNkJBQTZCLENBQUM7Z0JBQ3JFLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFVLDBCQUEwQixDQUFDO2FBQ25FLENBQUM7WUFFRixXQUFNLEdBQUc7Z0JBQ0wsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVMsZUFBZSxDQUFDO2dCQUMzQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBUyxvQkFBb0IsQ0FBQztnQkFDckQsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVMsdUJBQXVCLENBQUM7Z0JBQzNELGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQXNCLDJCQUEyQixDQUFDO2dCQUNoRixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFxQix5QkFBeUIsQ0FBQztnQkFDM0Usa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBTyxxQ0FBcUMsQ0FBQztnQkFDM0UsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVMsZUFBZSxDQUFDO2dCQUMzQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBUyxzQkFBc0IsQ0FBQzthQUM1RCxDQUFDO1lBRUYsY0FBUyxHQUFHO2dCQUNSLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFZLGlCQUFpQixDQUFDO2dCQUMvQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSx1QkFBdUIsQ0FBQztnQkFDM0QsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQStDLHFCQUFxQixDQUFDO2dCQUMxRixjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSwwQkFBMEIsQ0FBQztnQkFDakUsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQVksbUJBQW1CLENBQUM7Z0JBQ25ELE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFZLGtCQUFrQixDQUFDO2dCQUNqRCxZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBWSx3QkFBd0IsQ0FBQzthQUNoRSxDQUFDO1FBRU4sQ0FBQztRQUFELGFBQUM7SUFBRCxDQUFDLEFBcENELENBQTRCLFlBQVksQ0FBQyxPQUFPLEdBb0MvQztJQXBDWSxtQkFBTSxTQW9DbEIsQ0FBQTtJQUVEO1FBQUE7WUFDSSxZQUFPLEdBQVksSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNqQyxXQUFNLEdBQVcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUNsQyxDQUFDO1FBQUQsZUFBQztJQUFELENBQUMsQUFIRCxJQUdDO0lBSFkscUJBQVEsV0FHcEIsQ0FBQTtBQUVMLENBQUMsRUE5RVMsWUFBWSxLQUFaLFlBQVksUUE4RXJCO0FHOUVELElBQVUsWUFBWSxDQXdDckI7QUF4Q0QsV0FBVSxZQUFZLEVBQUMsQ0FBQztJQUVwQjtRQUtJLHFCQUFZLEtBQVk7WUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQztRQUVELDRCQUFNLEdBQU47WUFBQSxpQkFrQkM7WUFqQkcsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQ1Y7Z0JBQ0ksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUN6QixDQUFDLENBQUMsT0FBTyxFQUNMO29CQUNJLEtBQUssRUFBRTt3QkFDSCxJQUFJLEVBQUUsTUFBTTtxQkFDZjtvQkFDRCxFQUFFLEVBQUU7d0JBQ0EsTUFBTSxFQUFFLFVBQUEsRUFBRTs0QkFDTixJQUFJLElBQUksR0FBc0IsRUFBRSxDQUFDLE1BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2xELEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3RCLENBQUM7cUJBQ0o7aUJBQ0osQ0FDSjthQUNKLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFTyw0QkFBTSxHQUFkLFVBQWUsSUFBSTtZQUNmLElBQUksR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7WUFDdEIsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ3pDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkMsQ0FBQztRQUNMLGtCQUFDO0lBQUQsQ0FBQyxBQXBDRCxJQW9DQztJQXBDWSx3QkFBVyxjQW9DdkIsQ0FBQTtBQUVMLENBQUMsRUF4Q1MsWUFBWSxLQUFaLFlBQVksUUF3Q3JCO0FDdkNELElBQVUsWUFBWSxDQWlCckI7QUFqQkQsV0FBVSxZQUFZLEVBQUMsQ0FBQztJQUVwQiw0QkFBbUMsTUFBOEIsRUFBRSxPQUFnQjtRQUUvRSxJQUFJLEdBQVcsQ0FBQztRQUNoQixHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksU0FBUyxDQUFDLENBQUM7UUFDekMsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDO1lBQ0wsR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUNELE1BQU0sQ0FBQztZQUNILE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtZQUNyQixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7WUFDekIsT0FBTyxFQUFFLE9BQU87WUFDaEIsS0FBQSxHQUFHO1NBQ04sQ0FBQTtJQUNMLENBQUM7SUFiZSwrQkFBa0IscUJBYWpDLENBQUE7QUFFTCxDQUFDLEVBakJTLFlBQVksS0FBWixZQUFZLFFBaUJyQjtBQ2xCRCxJQUFVLFlBQVksQ0E2RXJCO0FBN0VELFdBQVUsWUFBWSxFQUFDLENBQUM7SUFFcEI7UUFBQTtRQXlFQSxDQUFDO1FBdkVHOzs7V0FHRztRQUNJLGdCQUFPLEdBQWQsVUFBZSxRQUFnQixFQUFFLFFBQWdCLEVBQUUsSUFBbUI7WUFHbEUsa0RBQWtEO1lBQ2xELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELElBQUksT0FBTyxHQUFHLGlCQUFpQixDQUFDO2dCQUNoQyxRQUFRLElBQUksT0FBTyxDQUFDO1lBQ3hCLENBQUM7WUFFRCxJQUFNLE9BQU8sR0FBRyxrQ0FBZ0MsUUFBUSxrQkFBYSxRQUFVLENBQUM7WUFDaEYsaUJBQWlCO1lBQ2pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztpQkFDcEIsSUFBSSxDQUNMLFVBQUEsWUFBWTtnQkFFUixXQUFXO2dCQUNYLElBQU0sVUFBVSxHQUFHO29CQUNmLE1BQU0sRUFBRSxLQUFLO29CQUNiLEtBQUssRUFBRSxLQUFLO29CQUNaLEdBQUcsRUFBRSxZQUFZLENBQUMsYUFBYTtvQkFDL0IsT0FBTyxFQUFFO3dCQUNMLFdBQVcsRUFBRSxhQUFhO3FCQUM3QjtvQkFDRCxJQUFJLEVBQUUsSUFBSTtvQkFDVixXQUFXLEVBQUUsS0FBSztvQkFDbEIsV0FBVyxFQUFFLFFBQVE7b0JBQ3JCLE1BQU0sRUFBRSxrQkFBa0I7aUJBQzdCLENBQUM7Z0JBRUYsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO3FCQUNwQixJQUFJLENBQ0wsVUFBQSxXQUFXO29CQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDL0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUM7Z0JBQzVCLENBQUMsRUFDRCxVQUFBLEdBQUc7b0JBQ0MsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDaEQsQ0FBQyxDQUFDLENBQUM7WUFDWCxDQUFDLEVBQ0QsVUFBQSxHQUFHO2dCQUNDLE9BQU8sQ0FBQyxLQUFLLENBQUMsOEJBQThCLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxnQkFBTyxHQUFkLFVBQWUsUUFBZ0I7WUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO2lCQUMzQixJQUFJLENBQUMsVUFBQSxRQUFRO2dCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDekMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQ1YsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHO29CQUNqQixRQUFRLEVBQUUsTUFBTTtvQkFDaEIsS0FBSyxFQUFFLEtBQUs7aUJBQ2YsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRU0sbUJBQVUsR0FBakIsVUFBa0IsUUFBZ0I7WUFDOUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ1YsR0FBRyxFQUFFLCtCQUE2QixRQUFVO2dCQUM1QyxRQUFRLEVBQUUsTUFBTTtnQkFDaEIsS0FBSyxFQUFFLEtBQUs7YUFDZixDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUwsZUFBQztJQUFELENBQUMsQUF6RUQsSUF5RUM7SUF6RVkscUJBQVEsV0F5RXBCLENBQUE7QUFFTCxDQUFDLEVBN0VTLFlBQVksS0FBWixZQUFZLFFBNkVyQjtBQzdFRCxJQUFVLFlBQVksQ0ErR3JCO0FBL0dELFdBQVUsWUFBWSxFQUFDLENBQUM7SUFFcEI7UUFBQTtRQTJHQSxDQUFDO1FBNUNVLGlCQUFLLEdBQVosVUFBYSxJQUFJLEVBQUUsY0FBd0IsRUFBRSxRQUFRO1lBQ2pELElBQU0sY0FBYyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRWxELHlCQUF5QjtZQUN6QixJQUFNLG9CQUFvQixHQUFHLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLO2dCQUNyRSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFsQixDQUFrQixDQUFDLENBQUM7Z0JBQ3JELHlDQUF5QztnQkFDekMsSUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsU0FBUyxFQUFYLENBQVcsQ0FBQztxQkFDcEQsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQ1gsR0FBRyxDQUFDLFVBQUEsQ0FBQztvQkFDRixJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ3JCLEVBQUUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUNwQixNQUFNLENBQUMsRUFBRSxDQUFDO2dCQUNkLENBQUMsQ0FBQyxDQUFDO2dCQUNQLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM1QyxXQUFXLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsU0FBUyxFQUFYLENBQVcsQ0FBQyxDQUFDO2dCQUN0RCxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQWIsQ0FBYSxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDNUQsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFdkMsSUFBSSxHQUFHLEdBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBQ3BCLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixlQUFlLEVBQUUsS0FBSztnQkFDdEIsV0FBVyxFQUFFLEtBQUs7Z0JBQ2xCLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixvQkFBb0IsRUFBRSxLQUFLO2dCQUMzQixPQUFPLEVBQUUsT0FBTztnQkFDaEIsZUFBZSxFQUFFLFlBQVk7Z0JBQzdCLE1BQU0sRUFBRSxRQUFRO2FBQ25CLENBQUMsQ0FBQztRQUNQLENBQUM7O1FBRU0sZUFBRyxHQUFWLFVBQVcsSUFBaUIsRUFBRSxLQUFhO1lBQ2pDLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFFTSxtQkFBTyxHQUFkLFVBQWUsSUFBSTtZQUNULENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQXhHTSxrQ0FBc0IsR0FBRztZQUM1QjtnQkFDSSw2Q0FBNkM7Z0JBQzdDLFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUzthQUNaO1lBQ0Q7Z0JBQ0ksNkNBQTZDO2dCQUM3QyxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7YUFDWjtZQUNEO2dCQUNJLDZDQUE2QztnQkFDN0MsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2FBQ1o7WUFDRDtnQkFDSSw2Q0FBNkM7Z0JBQzdDLFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUzthQUNaO1lBQ0Q7Z0JBQ0ksNkNBQTZDO2dCQUM3QyxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7YUFDWjtZQUNEO2dCQUNJLDZDQUE2QztnQkFDN0MsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2FBQ1o7WUFDRDtnQkFDSSw2Q0FBNkM7Z0JBQzdDLFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUzthQUNaO1NBQ0osQ0FBQztRQUVLLHdCQUFZLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUE4QzlGLGtCQUFDO0lBQUQsQ0FBQyxBQTNHRCxJQTJHQztJQTNHWSx3QkFBVyxjQTJHdkIsQ0FBQTtBQUVMLENBQUMsRUEvR1MsWUFBWSxLQUFaLFlBQVksUUErR3JCO0FDL0dELElBQVUsWUFBWSxDQW1OckI7QUFuTkQsV0FBVSxZQUFZLEVBQUMsQ0FBQztJQUVwQjtRQUErQiw2QkFBc0I7UUFJakQsbUJBQVksU0FBc0IsRUFBRSxLQUFZO1lBSnBELGlCQStNQztZQTFNTyxpQkFBTyxDQUFDO1lBRVIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFFbkIsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ2pDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFDMUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUMvQixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQztpQkFDdEMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQXhCLENBQXdCLENBQUMsQ0FBQztZQUN4QyxXQUFXLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUVwRCxDQUFDO1FBRUQsMEJBQU0sR0FBTixVQUFPLEtBQWtCO1lBQXpCLGlCQTRMQztZQTNMRyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQzVCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztZQUVsQixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDWixDQUFDLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztnQkFDeEIsQ0FBQyxDQUFDLGdCQUFnQixFQUFFO29CQUNoQixFQUFFLEVBQUU7d0JBQ0EsUUFBUSxFQUFFLFVBQUMsRUFBRTs0QkFDVCxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQ0FDekQsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztnQ0FDMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0NBQ2QsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztvQ0FDMUQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2dDQUN6QixDQUFDOzRCQUNMLENBQUM7d0JBQ0wsQ0FBQztxQkFDSjtvQkFDRCxLQUFLLEVBQUU7d0JBQ0gsSUFBSSxFQUFFLE1BQU07cUJBQ2Y7b0JBQ0QsS0FBSyxFQUFFO3dCQUNILFdBQVcsRUFBRSxzQkFBc0I7cUJBQ3RDO29CQUNELEtBQUssRUFBRSxFQUNOO2lCQUNKLENBQUM7Z0JBRUYsQ0FBQyxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyx3QkFBd0IsRUFDdEI7b0JBQ0ksS0FBSyxFQUFFO3dCQUNILElBQUksRUFBRSxNQUFNO3dCQUNaLEtBQUssRUFBRSxNQUFNLENBQUMsZUFBZTtxQkFDaEM7b0JBQ0QsSUFBSSxFQUFFO3dCQUNGLE1BQU0sRUFBRSxVQUFDLEtBQUs7NEJBQ1YsT0FBQSx3QkFBVyxDQUFDLEtBQUssQ0FDYixLQUFLLENBQUMsR0FBRyxFQUNULDBCQUFhLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUNsRCxVQUFBLEtBQUs7Z0NBQ0QsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQ3pDLEVBQUUsZUFBZSxFQUFFLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQzs0QkFDakUsQ0FBQyxDQUNKO3dCQVBELENBT0M7d0JBQ0wsTUFBTSxFQUFFLFVBQUMsUUFBUSxFQUFFLEtBQUs7NEJBQ3BCLHdCQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO3dCQUN2RCxDQUFDO3dCQUNELE9BQU8sRUFBRSxVQUFDLEtBQUssSUFBSyxPQUFBLHdCQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUIsQ0FBOEI7cUJBQ3JEO2lCQUNKLENBQUM7Z0JBRU4sVUFBVSxDQUFDLFFBQVEsQ0FBQztvQkFDaEIsRUFBRSxFQUFFLFlBQVk7b0JBQ2hCLE9BQU8sRUFBRSxTQUFTO29CQUNsQixLQUFLLEVBQUU7d0JBQ0g7NEJBQ0ksT0FBTyxFQUFFLEtBQUs7NEJBQ2QsT0FBTyxFQUFFO2dDQUNMLEtBQUssRUFBRTtvQ0FDSCxLQUFLLEVBQUUsbUJBQW1CO2lDQUM3QjtnQ0FDRCxFQUFFLEVBQUU7b0NBQ0EsS0FBSyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUEzQyxDQUEyQztpQ0FDM0Q7NkJBQ0o7eUJBQ0o7d0JBQ0Q7NEJBQ0ksT0FBTyxFQUFFLFdBQVc7NEJBQ3BCLE9BQU8sRUFBRTtnQ0FDTCxLQUFLLEVBQUU7b0NBQ0gsS0FBSyxFQUFFLHVCQUF1QjtpQ0FDakM7Z0NBQ0QsRUFBRSxFQUFFO29DQUNBLEtBQUssRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBMUMsQ0FBMEM7aUNBQzFEOzZCQUNKO3lCQUNKO3dCQUNEOzRCQUNJLE9BQU8sRUFBRSxhQUFhOzRCQUN0QixPQUFPLEVBQUU7Z0NBQ0wsS0FBSyxFQUFFO29DQUNILEtBQUssRUFBRSxzQkFBc0I7aUNBQ2hDO2dDQUNELEVBQUUsRUFBRTtvQ0FDQSxLQUFLLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQTlDLENBQThDO2lDQUM5RDs2QkFDSjt5QkFDSjt3QkFDRDs0QkFDSSxPQUFPLEVBQUUscUJBQXFCOzRCQUM5QixPQUFPLEVBQUU7Z0NBQ0wsS0FBSyxFQUFFO29DQUNILEtBQUssRUFBRSxxQ0FBcUM7aUNBQy9DO2dDQUNELEVBQUUsRUFBRTtvQ0FDQSxLQUFLLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQTFELENBQTBEO2lDQUMxRTs2QkFDSjt5QkFDSjt3QkFDRDs0QkFDSSxPQUFPLEVBQUUsc0JBQXNCOzRCQUMvQixPQUFPLEVBQUU7Z0NBQ0wsS0FBSyxFQUFFO29DQUNILEtBQUssRUFBRSx5Q0FBeUM7aUNBQ25EO2dDQUNELEVBQUUsRUFBRTtvQ0FDQSxLQUFLLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksd0JBQVcsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBckQsQ0FBcUQ7aUNBQ3JFOzZCQUNKO3lCQUNKO3dCQUNEOzRCQUNJLE9BQU8sRUFBRSxzQkFBc0I7NEJBQy9CLE9BQU8sRUFBRTtnQ0FDTCxLQUFLLEVBQUU7b0NBQ0gsS0FBSyxFQUFFLGlDQUFpQztpQ0FDM0M7Z0NBQ0QsRUFBRSxFQUFFO29DQUNBLEtBQUssRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxFQUFoQyxDQUFnQztpQ0FDaEQ7NkJBQ0o7eUJBQ0o7d0JBQ0Q7NEJBQ0ksT0FBTyxFQUFFLGNBQWM7NEJBQ3ZCLE9BQU8sRUFBRTtnQ0FDTCxLQUFLLEVBQUU7b0NBQ0gsS0FBSyxFQUFFLHNCQUFzQjtpQ0FDaEM7Z0NBQ0QsRUFBRSxFQUFFO29DQUNBLEtBQUssRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBOUMsQ0FBOEM7aUNBQzlEOzZCQUNKO3lCQUNKO3dCQUNEOzRCQUNJLE9BQU8sRUFBRSxZQUFZOzRCQUNyQixPQUFPLEVBQUU7Z0NBQ0wsS0FBSyxFQUFFO29DQUNILEtBQUssRUFBRSxrQ0FBa0M7aUNBQzVDO2dDQUNELEVBQUUsRUFBRTtvQ0FDQSxLQUFLLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQTlDLENBQThDO2lDQUM5RDs2QkFDSjt5QkFDSjt3QkFDRDs0QkFDSSxPQUFPLEVBQUUsa0JBQWtCOzRCQUMzQixPQUFPLEVBQUU7Z0NBQ0wsS0FBSyxFQUFFO29DQUNILEtBQUssRUFBRSxnREFBZ0Q7aUNBQzFEO2dDQUNELEVBQUUsRUFBRTtvQ0FDQSxLQUFLLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQTFDLENBQTBDO2lDQUMxRDs2QkFDSjt5QkFDSjt3QkFDRDs0QkFDSSxPQUFPLEVBQUUsb0JBQW9COzRCQUM3QixPQUFPLEVBQUU7Z0NBQ0wsS0FBSyxFQUFFO29DQUNILEtBQUssRUFBRSxtQ0FBbUM7aUNBQzdDO2dDQUNELEVBQUUsRUFBRTtvQ0FDQSxLQUFLLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLEVBQS9DLENBQStDO2lDQUMvRDs2QkFDSjt5QkFDSjtxQkFDSjtpQkFDSixDQUFDO2dCQUlGLENBQUMsQ0FBQyxlQUFlLEVBQ2IsRUFBRSxFQUNGO29CQUNJLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFDO29CQUVwRCxDQUFDLENBQUMsaURBQWlELEVBQy9DO3dCQUNJLEVBQUUsRUFBRTs0QkFDQSxLQUFLLEVBQUU7Z0NBQ0gsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs0QkFDcEQsQ0FBQzt5QkFDSjtxQkFDSixDQUFDO2lCQUNULENBQUM7YUFFVCxDQUNBLENBQUM7UUFDTixDQUFDO1FBQ0wsZ0JBQUM7SUFBRCxDQUFDLEFBL01ELENBQStCLFNBQVMsR0ErTXZDO0lBL01ZLHNCQUFTLFlBK01yQixDQUFBO0FBRUwsQ0FBQyxFQW5OUyxZQUFZLEtBQVosWUFBWSxRQW1OckI7QUM5TUQsSUFBVSxZQUFZLENBMEhyQjtBQTFIRCxXQUFVLFlBQVksRUFBQyxDQUFDO0lBRXBCO1FBT0ksb0JBQVksU0FBc0IsRUFBRSxLQUFZLEVBQUUsS0FBZ0I7WUFQdEUsaUJBc0hDO1lBcEhHLHNCQUFpQixHQUFHLFFBQVEsQ0FBQztZQUM3QixvQkFBZSxHQUFHLE1BQU0sQ0FBQztZQUtyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFNLElBQUksR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7aUJBQ2pDLEtBQUssQ0FDTixLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO2lCQUN2QyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsR0FBRyxFQUF4QixDQUF3QixDQUFDO2lCQUNyQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQyxDQUNwQjtpQkFDQSxHQUFHLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFmLENBQWUsQ0FBQyxDQUFDO1lBQ2hDLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFFRCwyQkFBTSxHQUFOLFVBQU8sS0FBZ0I7WUFBdkIsaUJBaUdDO1lBaEdHLElBQUksTUFBTSxHQUFHLFVBQUEsS0FBSztnQkFDZCxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ3RCLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVELENBQUMsQ0FBQztZQUNGLElBQU0sUUFBUSxHQUFZLEVBQUUsQ0FBQztZQUM3QixRQUFRLENBQUMsSUFBSSxDQUNULENBQUMsQ0FBQyxRQUFRLEVBQ047Z0JBQ0ksR0FBRyxFQUFFLGNBQWM7Z0JBQ25CLEtBQUssRUFBRTtvQkFDSCxlQUFlLEVBQUUsSUFBSTtpQkFDeEI7Z0JBQ0QsS0FBSyxFQUFFLEVBQ047Z0JBQ0QsSUFBSSxFQUFFO29CQUNGLE1BQU0sRUFBRSxVQUFBLEtBQUs7d0JBQ1QsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDaEMsQ0FBQztvQkFDRCxPQUFPLEVBQUUsVUFBQSxLQUFLO3dCQUNWLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUN6QyxDQUFDO2lCQUNKO2dCQUNELEVBQUUsRUFBRTtvQkFDQSxNQUFNLEVBQUUsVUFBQSxFQUFFLElBQUksT0FBQSxNQUFNLENBQUM7d0JBQ2pCLFVBQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUs7d0JBQzNCLFdBQVcsRUFBRSxTQUFTLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FDN0MsS0FBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUNuRSxDQUFDLEVBSlksQ0FJWjtpQkFDTDthQUNKLEVBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVztpQkFDM0IsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO2lCQUNqQyxHQUFHLENBQUMsVUFBQyxNQUE4QixJQUFLLE9BQUEsQ0FBQyxDQUFDLFFBQVEsRUFDL0M7Z0JBQ0ksS0FBSyxFQUFFO29CQUNILFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxVQUFVO29CQUM1QyxjQUFjLEVBQUUsbUJBQWdCLFdBQVcsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSSxDQUFDLGVBQWUsQ0FBQyxXQUFLLE1BQU0sQ0FBQyxNQUFNLFlBQVM7aUJBQ25JO2FBQ0osRUFDRCxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQVBxQixDQU9yQixDQUNuQixDQUNSLENBQ0osQ0FBQztZQUNGLElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3BGLEVBQUUsQ0FBQyxDQUFDLGNBQWMsSUFBSSxjQUFjLENBQUMsUUFBUTttQkFDdEMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUNwQjtvQkFDSSxHQUFHLEVBQUUsZUFBZTtvQkFDcEIsS0FBSyxFQUFFO3dCQUNILGdCQUFnQixFQUFFLElBQUk7cUJBQ3pCO29CQUNELEtBQUssRUFBRSxFQUNOO29CQUNELElBQUksRUFBRTt3QkFDRixNQUFNLEVBQUUsVUFBQSxLQUFLOzRCQUNULENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ2hDLENBQUM7d0JBQ0QsT0FBTyxFQUFFLFVBQUEsS0FBSzs0QkFDVixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQTt3QkFDeEMsQ0FBQzt3QkFDRCxTQUFTLEVBQUUsVUFBQyxRQUFRLEVBQUUsS0FBSzs0QkFDdkIsVUFBVSxDQUFDO2dDQUNQLHNEQUFzRDtnQ0FDdEQsc0NBQXNDO2dDQUN0QyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQ0FDckMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQzs0QkFDaEMsQ0FBQyxDQUFDLENBQUM7d0JBRVAsQ0FBQztxQkFDSjtvQkFDRCxFQUFFLEVBQUU7d0JBQ0EsTUFBTSxFQUFFLFVBQUEsRUFBRSxJQUFJLE9BQUEsTUFBTSxDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBeEMsQ0FBd0M7cUJBQ3pEO2lCQUNKLEVBQ0QsY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO29CQUN6QixNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFDYjt3QkFDSSxLQUFLLEVBQUU7NEJBQ0gsUUFBUSxFQUFFLENBQUMsS0FBSyxLQUFLLENBQUMsV0FBVzs0QkFDakMsS0FBSyxFQUFFLENBQUM7NEJBQ1IsZ0JBQWdCLEVBQUUsTUFBTTs0QkFDeEIsY0FBYyxFQUFFLG1CQUFnQixXQUFXLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUksQ0FBQyxlQUFlLENBQUMsV0FBSyxDQUFDLFlBQVM7eUJBQzVIO3FCQUNKLEVBQ0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNaLENBQUMsQ0FDQSxDQUNKLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFDVjtnQkFDSSxLQUFLLEVBQUUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFO2FBQ2pDLEVBQ0QsUUFBUSxDQUNYLENBQUM7UUFDTixDQUFDO1FBRUwsaUJBQUM7SUFBRCxDQUFDLEFBdEhELElBc0hDO0lBdEhZLHVCQUFVLGFBc0h0QixDQUFBO0FBRUwsQ0FBQyxFQTFIUyxZQUFZLEtBQVosWUFBWSxRQTBIckI7QUMvSEQsSUFBVSxZQUFZLENBMkJyQjtBQTNCRCxXQUFVLFlBQVksRUFBQyxDQUFDO0lBRXBCO1FBSUksb0JBQVksU0FBc0IsRUFBRSxLQUFZO1lBSnBELGlCQXVCQztZQWxCTyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDM0IsS0FBSyxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3pDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxVQUFBLENBQUM7Z0JBQ3hCLElBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO2dCQUNwRSxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFBLEVBQUU7b0JBQ2hCLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3BELENBQUMsQ0FBQyxDQUFDO2dCQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNaLE1BQU0sQ0FBQyxLQUFLLENBQUM7cUJBQ2IsTUFBTSxDQUFDLHdFQUF3RSxDQUFDLENBQUM7WUFDM0YsQ0FBQyxDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtnQkFDeEMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDdEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUwsaUJBQUM7SUFBRCxDQUFDLEFBdkJELElBdUJDO0lBdkJZLHVCQUFVLGFBdUJ0QixDQUFBO0FBRUwsQ0FBQyxFQTNCUyxZQUFZLEtBQVosWUFBWSxRQTJCckI7QUMzQkQsSUFBVSxZQUFZLENBb0JyQjtBQXBCRCxXQUFVLFlBQVksRUFBQyxDQUFDO0lBRXBCO1FBSUksd0JBQVksU0FBc0IsRUFBRSxLQUFZO1lBRTVDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsRUFBRTtnQkFDaEMsRUFBRSxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFDO29CQUNKLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzNCLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQyxDQUFBO1lBQ0YsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFOUMsQ0FBQztRQUVMLHFCQUFDO0lBQUQsQ0FBQyxBQWhCRCxJQWdCQztJQWhCWSwyQkFBYyxpQkFnQjFCLENBQUE7QUFFTCxDQUFDLEVBcEJTLFlBQVksS0FBWixZQUFZLFFBb0JyQjtBQ3BCRCxJQUFVLFlBQVksQ0E0Q3JCO0FBNUNELFdBQVUsWUFBWSxFQUFDLENBQUM7SUFFcEI7UUFFSSw0QkFBWSxTQUFzQixFQUFFLEtBQVk7WUFFNUMsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFO2lCQUN4RCxHQUFHLENBQUMsVUFBQSxDQUFDO2dCQUVGLElBQU0sT0FBTyxHQUF3QixDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUU1QyxJQUFNLEtBQUssR0FBRyxPQUFPO3VCQUNkLE9BQU8sQ0FBQyxRQUFRLEtBQUssV0FBVzt1QkFDaEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQ25DLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxPQUFPLENBQUMsTUFBTSxFQUF4QixDQUF3QixDQUFDLENBQUM7Z0JBRXZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixFQUN4Qjt3QkFDSSxLQUFLLEVBQUU7NEJBQ0gsT0FBTyxFQUFFLE1BQU07eUJBQ2xCO3FCQUNKLENBQUMsQ0FBQztnQkFDWCxDQUFDO2dCQUVELE1BQU0sQ0FBQyxDQUFDLENBQUMsbUJBQW1CLEVBQ3hCO29CQUNJLEtBQUssRUFBRTt3QkFDSCxnQ0FBZ0M7d0JBQ2hDLCtCQUErQjt3QkFDL0IsU0FBUyxFQUFFLENBQUM7cUJBQ2Y7aUJBQ0osRUFDRDtvQkFDSSxJQUFJLDRCQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztpQkFDM0MsQ0FBQyxDQUFDO1lBRVgsQ0FBQyxDQUFDLENBQUM7WUFFUCxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUU5QyxDQUFDO1FBQ0wseUJBQUM7SUFBRCxDQUFDLEFBeENELElBd0NDO0lBeENZLCtCQUFrQixxQkF3QzlCLENBQUE7QUFFTCxDQUFDLEVBNUNTLFlBQVksS0FBWixZQUFZLFFBNENyQjtBQzVDRCxJQUFVLFlBQVksQ0FxSXJCO0FBcklELFdBQVUsWUFBWSxFQUFDLENBQUM7SUFFcEI7UUFBcUMsbUNBQW9CO1FBR3JELHlCQUFZLEtBQVk7WUFDcEIsaUJBQU8sQ0FBQztZQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUM7UUFFRCxnQ0FBTSxHQUFOLFVBQU8sU0FBb0I7WUFBM0IsaUJBdUhDO1lBdEhHLElBQUksTUFBTSxHQUFHLFVBQUEsRUFBRTtnQkFDWCxFQUFFLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7Z0JBQ3ZCLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pELENBQUMsQ0FBQztZQUVGLE1BQU0sQ0FBQyxDQUFDLENBQUMsdUJBQXVCLEVBQzVCO2dCQUNJLEdBQUcsRUFBRSxTQUFTLENBQUMsR0FBRzthQUNyQixFQUNEO2dCQUNJLENBQUMsQ0FBQyxVQUFVLEVBQ1I7b0JBQ0ksS0FBSyxFQUFFLEVBQ047b0JBQ0QsS0FBSyxFQUFFO3dCQUNILEtBQUssRUFBRSxTQUFTLENBQUMsSUFBSTtxQkFDeEI7b0JBQ0QsRUFBRSxFQUFFO3dCQUNBLFFBQVEsRUFBRSxVQUFDLEVBQWlCOzRCQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQ0FDekQsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dDQUNwQixNQUFNLENBQUMsRUFBRSxJQUFJLEVBQXdCLEVBQUUsQ0FBQyxNQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzs0QkFDN0QsQ0FBQzt3QkFDTCxDQUFDO3dCQUNELE1BQU0sRUFBRSxVQUFBLEVBQUUsSUFBSSxPQUFBLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQWpDLENBQWlDO3FCQUNsRDtpQkFDSixDQUFDO2dCQUVOLENBQUMsQ0FBQyxLQUFLLEVBQ0gsRUFBRSxFQUNGO29CQUNJLENBQUMsQ0FBQywwQkFBMEIsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO29CQUN0QyxDQUFDLENBQUMsa0JBQWtCLEVBQ2hCO3dCQUNJLEtBQUssRUFBRTs0QkFDSCxJQUFJLEVBQUUsTUFBTTt5QkFDZjt3QkFDRCxLQUFLLEVBQUU7NEJBQ0gsS0FBSyxFQUFFLFlBQVk7NEJBQ25CLEtBQUssRUFBRSxTQUFTLENBQUMsU0FBUzt5QkFDN0I7d0JBQ0QsSUFBSSxFQUFFOzRCQUNGLE1BQU0sRUFBRSxVQUFDLEtBQUs7Z0NBQ1YsT0FBQSx3QkFBVyxDQUFDLEtBQUssQ0FDYixLQUFLLENBQUMsR0FBRyxFQUNULDBCQUFhLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUNsRCxVQUFBLEtBQUssSUFBSSxPQUFBLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBbkQsQ0FBbUQsQ0FDL0Q7NEJBSkQsQ0FJQzs0QkFDTCxPQUFPLEVBQUUsVUFBQyxLQUFLLElBQUssT0FBQSx3QkFBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlCLENBQThCO3lCQUNyRDtxQkFDSixDQUFDO2lCQUNULENBQUM7Z0JBRU4sQ0FBQyxDQUFDLEtBQUssRUFDSCxFQUFFLEVBQ0Y7b0JBQ0ksQ0FBQyxDQUFDLDBCQUEwQixFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7b0JBQ3RDLENBQUMsQ0FBQyx3QkFBd0IsRUFDdEI7d0JBQ0ksS0FBSyxFQUFFOzRCQUNILElBQUksRUFBRSxNQUFNO3lCQUNmO3dCQUNELEtBQUssRUFBRTs0QkFDSCxLQUFLLEVBQUUsa0JBQWtCOzRCQUN6QixLQUFLLEVBQUUsU0FBUyxDQUFDLGVBQWU7eUJBQ25DO3dCQUNELElBQUksRUFBRTs0QkFDRixNQUFNLEVBQUUsVUFBQyxLQUFLO2dDQUNWLE9BQUEsd0JBQVcsQ0FBQyxLQUFLLENBQ2IsS0FBSyxDQUFDLEdBQUcsRUFDVCwwQkFBYSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFDbEQsVUFBQSxLQUFLLElBQUksT0FBQSxNQUFNLENBQUMsRUFBRSxlQUFlLEVBQUUsS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQXpELENBQXlELENBQ3JFOzRCQUpELENBSUM7NEJBQ0wsT0FBTyxFQUFFLFVBQUMsS0FBSyxJQUFLLE9BQUEsd0JBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QixDQUE4Qjt5QkFDckQ7cUJBQ0osQ0FBQztpQkFDVCxDQUFDO2dCQUVOLENBQUMsQ0FBQyx3Q0FBd0MsRUFDdEM7b0JBQ0ksSUFBSSxFQUFFLFFBQVE7b0JBQ2QsS0FBSyxFQUFFO3dCQUNILEtBQUssRUFBRSxRQUFRO3FCQUNsQjtvQkFDRCxFQUFFLEVBQUU7d0JBQ0EsS0FBSyxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQXZELENBQXVEO3FCQUN0RTtpQkFDSixFQUNEO29CQUNJLENBQUMsQ0FBQyxnQ0FBZ0MsQ0FBQztpQkFDdEMsQ0FDSjtnQkFFRCxDQUFDLENBQUMsMkJBQTJCLEVBQ3pCO29CQUNJLElBQUksRUFBRTt3QkFDRixNQUFNLEVBQUUsVUFBQyxLQUFLOzRCQUNWLE9BQUEsSUFBSSx1QkFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUM7d0JBQWhELENBQWdEO3FCQUN2RDtpQkFjSixFQUNELEVBQ0MsQ0FDSjthQUVKLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFTCxzQkFBQztJQUFELENBQUMsQUFqSUQsQ0FBcUMsU0FBUyxHQWlJN0M7SUFqSVksNEJBQWUsa0JBaUkzQixDQUFBO0FBRUwsQ0FBQyxFQXJJUyxZQUFZLEtBQVosWUFBWSxRQXFJckI7QUNySUQsSUFBVSxZQUFZLENBMktyQjtBQTNLRCxXQUFVLFlBQVksRUFBQyxDQUFDO0lBRXBCO1FBQXdDLHNDQUFXO1FBWS9DLDRCQUNJLE1BQTBCLEVBQzFCLE1BQTJELEVBQzNELFdBQTZCO1lBZnJDLGlCQXVLQztZQXRKTyxpQkFBTyxDQUFDO1lBRVIsdUJBQXVCO1lBRXZCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFdEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDVCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksd0JBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSx3QkFBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoRCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHdCQUFXLENBQUM7b0JBQzFCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztvQkFDeEMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO2lCQUM1QyxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHdCQUFXLENBQUM7b0JBQzFCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztvQkFDM0MsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO2lCQUMvQyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBRUQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztZQUVqQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFFcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUUxQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRXBCLHFCQUFxQjtZQUVyQixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFMUUscUJBQXFCO1lBRXJCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxJQUFJO2dCQUM5QixXQUFXLEVBQUUsTUFBTTthQUN0QixDQUFDO1lBRUYseUJBQXlCO1lBRXpCLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxFQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDakMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQztpQkFDNUMsU0FBUyxDQUFDLFVBQUEsSUFBSTtnQkFDWCxLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDMUIsS0FBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNwQixLQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbkQsQ0FBQyxDQUFDLENBQUM7WUFFUCxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQUEsS0FBSztnQkFDaEIsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQ3hDLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUM7d0JBQ3BDLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3hDLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELHNCQUFJLHFDQUFLO2lCQUFUO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUM1QixDQUFDOzs7V0FBQTtRQUVELHNCQUFJLHFDQUFLO2lCQUFUO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUM1QixDQUFDOzs7V0FBQTtRQUVELHNCQUFJLHNDQUFNO2lCQUFWLFVBQVcsS0FBeUI7Z0JBQ2hDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1IsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUN0QyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDckIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUN4QixDQUFDO1lBQ0wsQ0FBQzs7O1dBQUE7UUFFRCxzQkFBSSwyQ0FBVztpQkFBZjtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUM3QixDQUFDO2lCQUVELFVBQWdCLEtBQXNCO2dCQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztnQkFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUMzQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztvQkFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztvQkFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QixDQUFDO1lBQ0wsQ0FBQzs7O1dBWkE7UUFjRCxzQkFBSSxvREFBb0I7aUJBQXhCLFVBQXlCLEtBQWE7Z0JBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUN0RCxDQUFDOzs7V0FBQTtRQUVELDRDQUFlLEdBQWYsVUFBZ0IsS0FBa0I7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFFTyx5Q0FBWSxHQUFwQjtZQUNJLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUM3QyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDMUMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBRTVDLElBQUksVUFBVSxHQUFHLFlBQVksQ0FBQyx3QkFBd0IsQ0FDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxJQUFJLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBQSxLQUFLO2dCQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDakIsQ0FBQztnQkFDRCxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUMxQyxJQUFJLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQ3RCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsU0FBUyxFQUN0QixRQUFRLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7aUJBQ2pDLEdBQUcsQ0FBQyxVQUFBLElBQUk7Z0JBQ0wsSUFBTSxJQUFJLEdBQWUsSUFBSSxDQUFDO2dCQUM5QixJQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUMvQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUM7cUJBQ2xDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FBQztnQkFDM0MsSUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDO29CQUN6QixRQUFRLEVBQUUsT0FBTztvQkFDakIsTUFBTSxFQUFFLElBQUk7b0JBQ1osU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO2lCQUM1QixDQUFDLENBQUM7Z0JBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQTtZQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbkMsR0FBRyxDQUFBLENBQVksVUFBcUIsRUFBckIsS0FBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBckIsY0FBcUIsRUFBckIsSUFBcUIsQ0FBQztnQkFBakMsSUFBTSxDQUFDLFNBQUE7Z0JBQ00sQ0FBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNuQztRQUNMLENBQUM7UUFFTywrQ0FBa0IsR0FBMUI7WUFDSSxJQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEQsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNuQixDQUFDO1FBbktNLGtDQUFlLEdBQUcsR0FBRyxDQUFDO1FBQ3RCLGtDQUFlLEdBQUcsR0FBRyxDQUFDO1FBb0tqQyx5QkFBQztJQUFELENBQUMsQUF2S0QsQ0FBd0MsS0FBSyxDQUFDLEtBQUssR0F1S2xEO0lBdktZLCtCQUFrQixxQkF1SzlCLENBQUE7QUFFTCxDQUFDLEVBM0tTLFlBQVksS0FBWixZQUFZLFFBMktyQjtBQzNLRCxJQUFVLFlBQVksQ0FvSXJCO0FBcElELFdBQVUsWUFBWSxFQUFDLENBQUM7SUFFcEI7UUFBZ0MsOEJBQVc7UUFjdkMsb0JBQVksTUFBbUM7WUFkbkQsaUJBZ0lDO1lBakhPLGlCQUFPLENBQUM7WUFMSixnQkFBVyxHQUFHLElBQUksZUFBZSxFQUFVLENBQUM7WUFPaEQsSUFBSSxRQUFxQixDQUFDO1lBQzFCLElBQUksSUFBZ0IsQ0FBQztZQUNyQixFQUFFLENBQUMsQ0FBQyxNQUFNLFlBQVksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQWtCLE1BQU0sQ0FBQztnQkFDdEMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUMvQixJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDOUIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLFlBQVksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxNQUFNLEdBQWdCLE1BQU0sQ0FBQztnQkFDbEMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDNUIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0saUNBQWlDLENBQUM7WUFDNUMsQ0FBQztZQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQzlFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztZQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7WUFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUU1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzFCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDeEIsQ0FBQztZQUVELFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLFVBQUEsRUFBRTtnQkFDekMsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ2QsNENBQTRDO29CQUU1QyxLQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztvQkFDekIsS0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUMvQyxJQUFNLFFBQVEsR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztvQkFDbkMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUNuQixRQUFRLEdBQUcsQ0FBQyxFQUNaLEtBQUksQ0FBQyxRQUFRLENBQ2hCLENBQUM7b0JBQ0YsS0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ25CLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDdEIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3JDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBQSxFQUFFO2dCQUNqQyxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsS0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQztvQkFDbEMsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pCLEtBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQzNCLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxLQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFVBQUEsRUFBRTtnQkFDN0IsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLEtBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNuQyxDQUFDO2dCQUNELEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQSxLQUFLO2dCQUN6QyxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSSxDQUFDLFFBQVE7dUJBQzFCLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvQyxLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNuRSxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFUCxDQUFDO1FBRUQsc0JBQUksZ0NBQVE7aUJBQVo7Z0JBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDMUIsQ0FBQztpQkFFRCxVQUFhLEtBQWM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2dCQUV2QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQzNCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO29CQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBQ25DLENBQUM7WUFDTCxDQUFDOzs7V0FYQTtRQWFELHNCQUFJLGtDQUFVO2lCQUFkO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzVCLENBQUM7OztXQUFBO1FBRUQsc0JBQUksOEJBQU07aUJBQVY7Z0JBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDekIsQ0FBQztpQkFFRCxVQUFXLEtBQWtCO2dCQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUMxQixDQUFDOzs7V0FKQTtRQU1PLG1DQUFjLEdBQXRCO1lBQ0ksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMscUJBQXFCLENBQUM7UUFDM0QsQ0FBQztRQUVPLGlDQUFZLEdBQXBCO1lBQ0ksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQztRQUN6RCxDQUFDO1FBNUhNLGdDQUFxQixHQUFHLEVBQUUsQ0FBQztRQUMzQiw4QkFBbUIsR0FBRyxDQUFDLENBQUM7UUFDeEIseUJBQWMsR0FBRyxDQUFDLENBQUM7UUE0SDlCLGlCQUFDO0lBQUQsQ0FBQyxBQWhJRCxDQUFnQyxLQUFLLENBQUMsS0FBSyxHQWdJMUM7SUFoSVksdUJBQVUsYUFnSXRCLENBQUE7QUFFTCxDQUFDLEVBcElTLFlBQVksS0FBWixZQUFZLFFBb0lyQjtBQ3BJRCxJQUFVLFlBQVksQ0E4RHJCO0FBOURELFdBQVUsWUFBWSxFQUFDLENBQUM7SUFFcEI7UUFBaUMsK0JBQVc7UUFLeEMscUJBQVksUUFBeUIsRUFBRSxLQUFtQjtZQUN0RCxpQkFBTyxDQUFDO1lBSEosaUJBQVksR0FBRyxJQUFJLGVBQWUsRUFBYyxDQUFDO1lBS3JELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTFCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQzdCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUMvQixDQUFDO1lBRUQsR0FBRyxDQUFDLENBQVksVUFBbUIsRUFBbkIsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBbkIsY0FBbUIsRUFBbkIsSUFBbUIsQ0FBQztnQkFBL0IsSUFBTSxDQUFDLFNBQUE7Z0JBQ1IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzVCO1lBRUQsR0FBRyxDQUFDLENBQVksVUFBaUIsRUFBakIsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBakIsY0FBaUIsRUFBakIsSUFBaUIsQ0FBQztnQkFBN0IsSUFBTSxDQUFDLFNBQUE7Z0JBQ1IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMxQjtRQUNMLENBQUM7UUFFRCxzQkFBSSw2QkFBSTtpQkFBUjtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN0QixDQUFDOzs7V0FBQTtRQUVELHNCQUFJLG9DQUFXO2lCQUFmO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQzdCLENBQUM7OztXQUFBO1FBRU8sc0NBQWdCLEdBQXhCLFVBQXlCLE9BQXNCO1lBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSx1QkFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUVPLG9DQUFjLEdBQXRCLFVBQXVCLEtBQWtCO1lBQXpDLGlCQU9DO1lBTkcsSUFBSSxNQUFNLEdBQUcsSUFBSSx1QkFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFVBQUEsUUFBUTtnQkFDbkMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pELENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBRU8sK0JBQVMsR0FBakIsVUFBa0IsTUFBa0I7WUFBcEMsaUJBU0M7WUFSRyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDOUIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxVQUFBLEVBQUU7Z0JBQ25DLEtBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsVUFBQSxFQUFFO2dCQUMvQixLQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDLENBQUE7WUFDRixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFDTCxrQkFBQztJQUFELENBQUMsQUExREQsQ0FBaUMsS0FBSyxDQUFDLEtBQUssR0EwRDNDO0lBMURZLHdCQUFXLGNBMER2QixDQUFBO0FBRUwsQ0FBQyxFQTlEUyxZQUFZLEtBQVosWUFBWSxRQThEckI7QUM5REQsSUFBVSxZQUFZLENBZ0VyQjtBQWhFRCxXQUFVLFlBQVksRUFBQyxDQUFDO0lBRXBCOztPQUVHO0lBQ0g7UUFBQTtRQXlEQSxDQUFDO1FBbkRXLG1DQUFlLEdBQXZCLFVBQXdCLElBQUk7WUFDeEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdEMsU0FBUyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDekIsU0FBUyxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLFNBQVMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUMzQyxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLFNBQVMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUMzQyxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN2QyxDQUFDO1lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNyQixDQUFDO1FBRUQsa0NBQWMsR0FBZCxVQUFlLElBQUk7WUFDZixrREFBa0Q7WUFDbEQsa0NBQWtDO1lBQ2xDLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUNwQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDbkMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkUsQ0FBQztZQUVELDBDQUEwQztZQUMxQyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUVuQyw2REFBNkQ7Z0JBQzdELHNDQUFzQztnQkFDdEMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25FLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFFbkIseUNBQXlDO2dCQUN6QyxvQ0FBb0M7Z0JBQ3BDLG1DQUFtQztnQkFDbkMsSUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLO3NCQUNsQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQztzQkFDbEMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUVyQyxxQ0FBcUM7Z0JBQ3JDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQztZQUNoRCxDQUFDO1lBRUQsR0FBRyxDQUFDLENBQWtCLFVBQVUsRUFBVix5QkFBVSxFQUFWLHdCQUFVLEVBQVYsSUFBVSxDQUFDO2dCQUE1QixJQUFJLFNBQVMsbUJBQUE7Z0JBQ2QsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ3RCO1lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDO1FBQ0wsZ0JBQUM7SUFBRCxDQUFDLEFBekRELElBeURDO0lBekRZLHNCQUFTLFlBeURyQixDQUFBO0FBRUwsQ0FBQyxFQWhFUyxZQUFZLEtBQVosWUFBWSxRQWdFckI7QUNoRUQsSUFBVSxZQUFZLENBd0VyQjtBQXhFRCxXQUFVLFlBQVksRUFBQyxDQUFDO0lBRXBCO1FBQThCLDRCQUFrQjtRQVE1QyxrQkFDSSxJQUFtQixFQUNuQixJQUFZLEVBQ1osTUFBMkQsRUFDM0QsUUFBaUIsRUFDakIsS0FBdUI7WUFFdkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNaLFFBQVEsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUM7WUFDMUMsQ0FBQztZQUVELElBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM1RCxJQUFNLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFOUMsa0JBQU0sSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUUzQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUN0QixDQUFDO1FBRUQsc0JBQUksMEJBQUk7aUJBQVI7Z0JBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDdEIsQ0FBQztpQkFFRCxVQUFTLEtBQWE7Z0JBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNuQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDMUIsQ0FBQzs7O1dBTEE7UUFPRCxzQkFBSSw4QkFBUTtpQkFBWjtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUMxQixDQUFDO2lCQUVELFVBQWEsS0FBYTtnQkFDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDMUIsQ0FBQzs7O1dBUkE7UUFVRCxzQkFBSSwwQkFBSTtpQkFBUixVQUFTLEtBQW9CO2dCQUN6QixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUNuQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQzFCLENBQUM7WUFDTCxDQUFDOzs7V0FBQTtRQUVELGlDQUFjLEdBQWQ7WUFDSSxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUNqQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFFYyxvQkFBVyxHQUExQixVQUEyQixJQUFtQixFQUMxQyxJQUFZLEVBQUUsUUFBMEI7WUFDeEMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDckMsQ0FBQztRQWpFTSwwQkFBaUIsR0FBRyxHQUFHLENBQUM7UUFrRW5DLGVBQUM7SUFBRCxDQUFDLEFBcEVELENBQThCLCtCQUFrQixHQW9FL0M7SUFwRVkscUJBQVEsV0FvRXBCLENBQUE7QUFFTCxDQUFDLEVBeEVTLFlBQVksS0FBWixZQUFZLFFBd0VyQjtBQ2xFQSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5uYW1lc3BhY2UgRG9tSGVscGVycyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgYmxvYiBmcm9tIGEgZGF0YSBVUkwgKGVpdGhlciBiYXNlNjQgZW5jb2RlZCBvciBub3QpLlxyXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL2ViaWRlbC9maWxlci5qcy9ibG9iL21hc3Rlci9zcmMvZmlsZXIuanMjTDEzN1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhVVJMIFRoZSBkYXRhIFVSTCB0byBjb252ZXJ0LlxyXG4gICAgICogQHJldHVybiB7QmxvYn0gQSBibG9iIHJlcHJlc2VudGluZyB0aGUgYXJyYXkgYnVmZmVyIGRhdGEuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkYXRhVVJMVG9CbG9iKGRhdGFVUkwpOiBCbG9iIHtcclxuICAgICAgICB2YXIgQkFTRTY0X01BUktFUiA9ICc7YmFzZTY0LCc7XHJcbiAgICAgICAgaWYgKGRhdGFVUkwuaW5kZXhPZihCQVNFNjRfTUFSS0VSKSA9PSAtMSkge1xyXG4gICAgICAgICAgICB2YXIgcGFydHMgPSBkYXRhVVJMLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50VHlwZSA9IHBhcnRzWzBdLnNwbGl0KCc6JylbMV07XHJcbiAgICAgICAgICAgIHZhciByYXcgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBCbG9iKFtyYXddLCB7IHR5cGU6IGNvbnRlbnRUeXBlIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBhcnRzID0gZGF0YVVSTC5zcGxpdChCQVNFNjRfTUFSS0VSKTtcclxuICAgICAgICB2YXIgY29udGVudFR5cGUgPSBwYXJ0c1swXS5zcGxpdCgnOicpWzFdO1xyXG4gICAgICAgIHZhciByYXcgPSB3aW5kb3cuYXRvYihwYXJ0c1sxXSk7XHJcbiAgICAgICAgdmFyIHJhd0xlbmd0aCA9IHJhdy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHZhciB1SW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkocmF3TGVuZ3RoKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdMZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB1SW50OEFycmF5W2ldID0gcmF3LmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEJsb2IoW3VJbnQ4QXJyYXldLCB7IHR5cGU6IGNvbnRlbnRUeXBlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbml0RXJyb3JIYW5kbGVyKGxvZ2dlcjogKGVycm9yRGF0YTogT2JqZWN0KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5vbmVycm9yID0gZnVuY3Rpb24obXNnLCBmaWxlLCBsaW5lLCBjb2wsIGVycm9yOiBFcnJvciB8IHN0cmluZykge1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHN0YWNrZnJhbWVzID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBtc2csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogbGluZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbDogY29sLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6IHN0YWNrZnJhbWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gbG9nIGVycm9yXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyYmFjayA9IGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBsb2cgZXJyb3JcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKDxzdHJpbmc+ZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGFzRXJyb3IgPSB0eXBlb2YgZXJyb3IgPT09IFwic3RyaW5nXCJcclxuICAgICAgICAgICAgICAgICAgICA/IG5ldyBFcnJvcihlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICA6IGVycm9yO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gU3RhY2tUcmFjZS5mcm9tRXJyb3IoYXNFcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihjYWxsYmFjaylcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyYmFjayk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImZhaWxlZCB0byBsb2cgZXJyb3JcIiwgZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBLZXlDb2RlcyA9IHtcclxuICAgICAgICBCYWNrU3BhY2U6IDgsXHJcbiAgICAgICAgVGFiOiA5LFxyXG4gICAgICAgIEVudGVyOiAxMyxcclxuICAgICAgICBTaGlmdDogMTYsXHJcbiAgICAgICAgQ3RybDogMTcsXHJcbiAgICAgICAgQWx0OiAxOCxcclxuICAgICAgICBQYXVzZUJyZWFrOiAxOSxcclxuICAgICAgICBDYXBzTG9jazogMjAsXHJcbiAgICAgICAgRXNjOiAyNyxcclxuICAgICAgICBQYWdlVXA6IDMzLFxyXG4gICAgICAgIFBhZ2VEb3duOiAzNCxcclxuICAgICAgICBFbmQ6IDM1LFxyXG4gICAgICAgIEhvbWU6IDM2LFxyXG4gICAgICAgIEFycm93TGVmdDogMzcsXHJcbiAgICAgICAgQXJyb3dVcDogMzgsXHJcbiAgICAgICAgQXJyb3dSaWdodDogMzksXHJcbiAgICAgICAgQXJyb3dEb3duOiA0MCxcclxuICAgICAgICBJbnNlcnQ6IDQ1LFxyXG4gICAgICAgIERlbGV0ZTogNDYsXHJcbiAgICAgICAgRGlnaXQwOiA0OCxcclxuICAgICAgICBEaWdpdDE6IDQ5LFxyXG4gICAgICAgIERpZ2l0MjogNTAsXHJcbiAgICAgICAgRGlnaXQzOiA1MSxcclxuICAgICAgICBEaWdpdDQ6IDUyLFxyXG4gICAgICAgIERpZ2l0NTogNTMsXHJcbiAgICAgICAgRGlnaXQ2OiA1NCxcclxuICAgICAgICBEaWdpdDc6IDU1LFxyXG4gICAgICAgIERpZ2l0ODogNTYsXHJcbiAgICAgICAgRGlnaXQ5OiA1NyxcclxuICAgICAgICBBOiA2NSxcclxuICAgICAgICBCOiA2NixcclxuICAgICAgICBDOiA2NyxcclxuICAgICAgICBEOiA2OCxcclxuICAgICAgICBFOiA2OSxcclxuICAgICAgICBGOiA3MCxcclxuICAgICAgICBHOiA3MSxcclxuICAgICAgICBIOiA3MixcclxuICAgICAgICBJOiA3MyxcclxuICAgICAgICBKOiA3NCxcclxuICAgICAgICBLOiA3NSxcclxuICAgICAgICBMOiA3NixcclxuICAgICAgICBNOiA3NyxcclxuICAgICAgICBOOiA3OCxcclxuICAgICAgICBPOiA3OSxcclxuICAgICAgICBQOiA4MCxcclxuICAgICAgICBROiA4MSxcclxuICAgICAgICBSOiA4MixcclxuICAgICAgICBTOiA4MyxcclxuICAgICAgICBUOiA4NCxcclxuICAgICAgICBVOiA4NSxcclxuICAgICAgICBWOiA4NixcclxuICAgICAgICBXOiA4NyxcclxuICAgICAgICBYOiA4OCxcclxuICAgICAgICBZOiA4OSxcclxuICAgICAgICBaOiA5MCxcclxuICAgICAgICBXaW5kb3dMZWZ0OiA5MSxcclxuICAgICAgICBXaW5kb3dSaWdodDogOTIsXHJcbiAgICAgICAgU2VsZWN0S2V5OiA5MyxcclxuICAgICAgICBOdW1wYWQwOiA5NixcclxuICAgICAgICBOdW1wYWQxOiA5NyxcclxuICAgICAgICBOdW1wYWQyOiA5OCxcclxuICAgICAgICBOdW1wYWQzOiA5OSxcclxuICAgICAgICBOdW1wYWQ0OiAxMDAsXHJcbiAgICAgICAgTnVtcGFkNTogMTAxLFxyXG4gICAgICAgIE51bXBhZDY6IDEwMixcclxuICAgICAgICBOdW1wYWQ3OiAxMDMsXHJcbiAgICAgICAgTnVtcGFkODogMTA0LFxyXG4gICAgICAgIE51bXBhZDk6IDEwNSxcclxuICAgICAgICBNdWx0aXBseTogMTA2LFxyXG4gICAgICAgIEFkZDogMTA3LFxyXG4gICAgICAgIFN1YnRyYWN0OiAxMDksXHJcbiAgICAgICAgRGVjaW1hbFBvaW50OiAxMTAsXHJcbiAgICAgICAgRGl2aWRlOiAxMTEsXHJcbiAgICAgICAgRjE6IDExMixcclxuICAgICAgICBGMjogMTEzLFxyXG4gICAgICAgIEYzOiAxMTQsXHJcbiAgICAgICAgRjQ6IDExNSxcclxuICAgICAgICBGNTogMTE2LFxyXG4gICAgICAgIEY2OiAxMTcsXHJcbiAgICAgICAgRjc6IDExOCxcclxuICAgICAgICBGODogMTE5LFxyXG4gICAgICAgIEY5OiAxMjAsXHJcbiAgICAgICAgRjEwOiAxMjEsXHJcbiAgICAgICAgRjExOiAxMjIsXHJcbiAgICAgICAgRjEyOiAxMjMsXHJcbiAgICAgICAgTnVtTG9jazogMTQ0LFxyXG4gICAgICAgIFNjcm9sbExvY2s6IDE0NSxcclxuICAgICAgICBTZW1pQ29sb246IDE4NixcclxuICAgICAgICBFcXVhbDogMTg3LFxyXG4gICAgICAgIENvbW1hOiAxODgsXHJcbiAgICAgICAgRGFzaDogMTg5LFxyXG4gICAgICAgIFBlcmlvZDogMTkwLFxyXG4gICAgICAgIEZvcndhcmRTbGFzaDogMTkxLFxyXG4gICAgICAgIEdyYXZlQWNjZW50OiAxOTIsXHJcbiAgICAgICAgQnJhY2tldE9wZW46IDIxOSxcclxuICAgICAgICBCYWNrU2xhc2g6IDIyMCxcclxuICAgICAgICBCcmFja2V0Q2xvc2U6IDIyMSxcclxuICAgICAgICBTaW5nbGVRdW90ZTogMjIyXHJcbiAgICB9O1xyXG5cclxufSIsIm5hbWVzcGFjZSBGc3R4LkZyYW1ld29yayB7XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZpbGVOYW1lKHRleHQ6IHN0cmluZywgbWF4TGVuZ3RoOiBudW1iZXIsIGV4dGVuc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgZm9yIChjb25zdCB3b3JkIG9mIHRleHQuc3BsaXQoL1xccy8pKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyaW0gPSB3b3JkLnJlcGxhY2UoL1xcVy9nLCAnJykudHJpbSgpO1xyXG4gICAgICAgICAgICBpZiAodHJpbS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmKG5hbWUubGVuZ3RoICYmIG5hbWUubGVuZ3RoICsgdHJpbS5sZW5ndGggKyAxID4gbWF4TGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChuYW1lLmxlbmd0aCkgbmFtZSArPSBcIiBcIjtcclxuICAgICAgICAgICAgICAgIG5hbWUgKz0gdHJpbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmFtZSArIFwiLlwiICsgZXh0ZW5zaW9uO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5uYW1lc3BhY2UgRm9udEhlbHBlcnMge1xyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEVsZW1lbnRGb250U3R5bGUge1xyXG4gICAgICAgIGZvbnRGYW1pbHk/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFdlaWdodD86IHN0cmluZztcclxuICAgICAgICBmb250U3R5bGU/OiBzdHJpbmc7IFxyXG4gICAgICAgIGZvbnRTaXplPzogc3RyaW5nOyBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldENzc1N0eWxlKGZhbWlseTogc3RyaW5nLCB2YXJpYW50Pzogc3RyaW5nLCBzaXplPzogc3RyaW5nKXtcclxuICAgICAgICBsZXQgc3R5bGUgPSA8RWxlbWVudEZvbnRTdHlsZT57IGZvbnRGYW1pbHk6IGZhbWlseSB9O1xyXG4gICAgICAgIGlmKHZhcmlhbnQgJiYgdmFyaWFudC5pbmRleE9mKFwiaXRhbGljXCIpID49IDApe1xyXG4gICAgICAgICAgICBzdHlsZS5mb250U3R5bGUgPSBcIml0YWxpY1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbnVtZXJpYyA9IHZhcmlhbnQgJiYgdmFyaWFudC5yZXBsYWNlKC9bXlxcZF0vZywgXCJcIik7XHJcbiAgICAgICAgaWYobnVtZXJpYyAmJiBudW1lcmljLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHN0eWxlLmZvbnRXZWlnaHQgPSBudW1lcmljLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHNpemUpe1xyXG4gICAgICAgICAgICBzdHlsZS5mb250U2l6ZSA9IHNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHlsZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldFN0eWxlU3RyaW5nKGZhbWlseTogc3RyaW5nLCB2YXJpYW50OiBzdHJpbmcsIHNpemU/OiBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgc3R5bGVPYmogPSBnZXRDc3NTdHlsZShmYW1pbHksIHZhcmlhbnQsIHNpemUpO1xyXG4gICAgICAgIGxldCBwYXJ0cyA9IFtdO1xyXG4gICAgICAgIGlmKHN0eWxlT2JqLmZvbnRGYW1pbHkpe1xyXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LWZhbWlseTonJHtzdHlsZU9iai5mb250RmFtaWx5fSdgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc3R5bGVPYmouZm9udFdlaWdodCl7XHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goYGZvbnQtd2VpZ2h0OiR7c3R5bGVPYmouZm9udFdlaWdodH1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc3R5bGVPYmouZm9udFN0eWxlKXtcclxuICAgICAgICAgICAgcGFydHMucHVzaChgZm9udC1zdHlsZToke3N0eWxlT2JqLmZvbnRTdHlsZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc3R5bGVPYmouZm9udFNpemUpe1xyXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LXNpemU6JHtzdHlsZU9iai5mb250U2l6ZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oXCI7IFwiKTtcclxuICAgIH1cclxuICAgIFxyXG59IiwibmFtZXNwYWNlIEZyYW1ld29yayB7XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGxvZ3RhcDxUPihtZXNzYWdlOiBzdHJpbmcsIHN0cmVhbTogUnguT2JzZXJ2YWJsZTxUPik6IFJ4Lk9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiBzdHJlYW0udGFwKHQgPT4gY29uc29sZS5sb2cobWVzc2FnZSwgdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBuZXdpZCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAobmV3IERhdGUoKS5nZXRUaW1lKCkgKyBNYXRoLnJhbmRvbSgpKVxyXG4gICAgICAgICAgICAudG9TdHJpbmcoMzYpLnJlcGxhY2UoJy4nLCAnJyk7XHJcbiAgICB9XHJcbiAgIFxyXG59XHJcbiIsIm5hbWVzcGFjZSBGcmFtZXdvcmsge1xyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgU2VlZFJhbmRvbSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2VlZDogbnVtYmVyO1xyXG4gICAgICAgIG5leHRTZWVkOiBudW1iZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc2VlZDogbnVtYmVyID0gTWF0aC5yYW5kb20oKSl7XHJcbiAgICAgICAgICAgIHRoaXMuc2VlZCA9IHRoaXMubmV4dFNlZWQgPSBzZWVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByYW5kb20oKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgY29uc3QgeCA9IE1hdGguc2luKHRoaXMubmV4dFNlZWQgKiAyICogTWF0aC5QSSkgKiAxMDAwMDtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geCAtIE1hdGguZmxvb3IoeCk7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dFNlZWQgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJcclxubmFtZXNwYWNlIFR5cGVkQ2hhbm5lbCB7XHJcblxyXG4gICAgLy8gLS0tIENvcmUgdHlwZXMgLS0tXHJcblxyXG4gICAgdHlwZSBTZXJpYWxpemFibGUgPSBPYmplY3QgfCBBcnJheTxhbnk+IHwgbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiB8IERhdGUgfCB2b2lkO1xyXG5cclxuICAgIHR5cGUgVmFsdWUgPSBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuIHwgRGF0ZTtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2U8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgZGF0YT86IFREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHR5cGUgSVN1YmplY3Q8VD4gPSBSeC5PYnNlcnZlcjxUPiAmIFJ4Lk9ic2VydmFibGU8VD47XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIENoYW5uZWxUb3BpYzxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4ge1xyXG4gICAgICAgIHR5cGU6IHN0cmluZztcclxuICAgICAgICBjaGFubmVsOiBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoYW5uZWw6IElTdWJqZWN0PE1lc3NhZ2U8VERhdGE+PiwgdHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWJzY3JpYmUob2JzZXJ2ZXI6IChtZXNzYWdlOiBNZXNzYWdlPFREYXRhPikgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmUoKS5zdWJzY3JpYmUob2JzZXJ2ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3ViKG9ic2VydmVyOiAoZGF0YTogVERhdGEpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCkuc3Vic2NyaWJlKG0gPT4gb2JzZXJ2ZXIobS5kYXRhKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpc3BhdGNoKGRhdGE/OiBURGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwub25OZXh0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5maWx0ZXIobSA9PiBtLnR5cGUgPT09IHRoaXMudHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG9ic2VydmVEYXRhKCk6IFJ4Lk9ic2VydmFibGU8VERhdGE+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub2JzZXJ2ZSgpLm1hcChtID0+IG0uZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcndhcmQoY2hhbm5lbDogQ2hhbm5lbFRvcGljPFREYXRhPikge1xyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZShtID0+IGNoYW5uZWwuZGlzcGF0Y2gobS5kYXRhKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDaGFubmVsIHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBzdWJqZWN0OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihzdWJqZWN0PzogSVN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGU+PiwgdHlwZT86IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnN1YmplY3QgPSBzdWJqZWN0IHx8IG5ldyBSeC5TdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4oKTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YnNjcmliZShvbk5leHQ/OiAodmFsdWU6IE1lc3NhZ2U8U2VyaWFsaXphYmxlPikgPT4gdm9pZCk6IFJ4LklEaXNwb3NhYmxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5zdWJzY3JpYmUob25OZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9ic2VydmUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b3BpYzxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4odHlwZTogc3RyaW5nKSA6IENoYW5uZWxUb3BpYzxURGF0YT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENoYW5uZWxUb3BpYzxURGF0YT4odGhpcy5zdWJqZWN0IGFzIElTdWJqZWN0PE1lc3NhZ2U8VERhdGE+PixcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA/IHRoaXMudHlwZSArICcuJyArIHR5cGUgOiB0eXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVyZ2VUeXBlZDxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4oLi4udG9waWNzOiBDaGFubmVsVG9waWM8VERhdGE+W10pIFxyXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+IHtcclxuICAgICAgICAgICAgY29uc3QgdHlwZXMgPSB0b3BpY3MubWFwKHQgPT4gdC50eXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5maWx0ZXIobSA9PiB0eXBlcy5pbmRleE9mKG0udHlwZSkgPj0gMCApIGFzIFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBtZXJnZSguLi50b3BpY3M6IENoYW5uZWxUb3BpYzxTZXJpYWxpemFibGU+W10pIFxyXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxTZXJpYWxpemFibGU+PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdG9waWNzLm1hcCh0ID0+IHQudHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuZmlsdGVyKG0gPT4gdHlwZXMuaW5kZXhPZihtLnR5cGUpID49IDAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIlxyXG50eXBlIERpY3Rpb25hcnk8VD4gPSBfLkRpY3Rpb25hcnk8VD47XHJcbiIsIlxyXG5jbGFzcyBPYnNlcnZhYmxlRXZlbnQ8VD4ge1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF9zdWJzY3JpYmVyczogKChldmVudEFyZzogVCkgPT4gdm9pZClbXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGZvciBub3RpZmljYXRpb24uIFJldHVybnMgdW5zdWJzY3JpYmUgZnVuY3Rpb24uXHJcbiAgICAgKi8gICAgXHJcbiAgICBzdWJzY3JpYmUoaGFuZGxlcjogKGV2ZW50QXJnOiBUKSA9PiB2b2lkKTogKCgpID0+IHZvaWQpIHtcclxuICAgICAgICBpZih0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGhhbmRsZXIpIDwgMCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnB1c2goaGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoKSA9PiB0aGlzLnVuc3Vic2NyaWJlKGhhbmRsZXIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1bnN1YnNjcmliZShjYWxsYmFjazogKGV2ZW50QXJnOiBUKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihjYWxsYmFjaywgMCk7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgb2JzZXJ2ZSgpOiBSeC5PYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBsZXQgdW5zdWI6IGFueTtcclxuICAgICAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuPFQ+KFxyXG4gICAgICAgICAgICAoaGFuZGxlclRvQWRkKSA9PiB0aGlzLnN1YnNjcmliZSg8KGV2ZW50QXJnOiBUKSA9PiB2b2lkPmhhbmRsZXJUb0FkZCksXHJcbiAgICAgICAgICAgIChoYW5kbGVyVG9SZW1vdmUpID0+IHRoaXMudW5zdWJzY3JpYmUoPChldmVudEFyZzogVCkgPT4gdm9pZD5oYW5kbGVyVG9SZW1vdmUpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJzY3JpYmUgZm9yIG9uZSBub3RpZmljYXRpb24uXHJcbiAgICAgKi9cclxuICAgIHN1YnNjcmliZU9uZShjYWxsYmFjazogKGV2ZW50QXJnOiBUKSA9PiB2b2lkKXtcclxuICAgICAgICBsZXQgdW5zdWIgPSB0aGlzLnN1YnNjcmliZSh0ID0+IHtcclxuICAgICAgICAgICAgdW5zdWIoKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sodCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG5vdGlmeShldmVudEFyZzogVCl7XHJcbiAgICAgICAgZm9yKGxldCBzdWJzY3JpYmVyIG9mIHRoaXMuX3N1YnNjcmliZXJzKXtcclxuICAgICAgICAgICAgc3Vic2NyaWJlci5jYWxsKHRoaXMsIGV2ZW50QXJnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbGwgc3Vic2NyaWJlcnMuXHJcbiAgICAgKi9cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbn0iLCJcclxubmFtZXNwYWNlIEJvb3RTY3JpcHQge1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTWVudUl0ZW0ge1xyXG4gICAgICAgIGNvbnRlbnQ6IGFueSxcclxuICAgICAgICBvcHRpb25zPzogT2JqZWN0XHJcbiAgICAgICAgLy9vbkNsaWNrPzogKCkgPT4gdm9pZFxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkcm9wZG93bihcclxuICAgICAgICBhcmdzOiB7XHJcbiAgICAgICAgICAgIGlkOiBzdHJpbmcsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IGFueSxcclxuICAgICAgICAgICAgaXRlbXM6IE1lbnVJdGVtW11cclxuICAgICAgICB9KTogVk5vZGUge1xyXG5cclxuICAgICAgICByZXR1cm4gaChcImRpdi5kcm9wZG93blwiLCBbXHJcbiAgICAgICAgICAgIGgoXCJidXR0b24uYnRuLmJ0bi1kZWZhdWx0LmRyb3Bkb3duLXRvZ2dsZVwiLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYXR0cnNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYXJncy5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLXRvZ2dsZVwiOiBcImRyb3Bkb3duXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzLmNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgaChcInNwYW4uY2FyZXRcIilcclxuICAgICAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICBoKFwidWwuZHJvcGRvd24tbWVudVwiLFxyXG4gICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICBhcmdzLml0ZW1zLm1hcChpdGVtID0+XHJcbiAgICAgICAgICAgICAgICAgICAgaChcImxpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaCgnYScsIGl0ZW0ub3B0aW9ucyB8fCB7fSwgW2l0ZW0uY29udGVudF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICBdKTtcclxuXHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbnR5cGUgSXRlbUNoYW5nZUhhbmRsZXIgPSAoZmxhZ3M6IFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcpID0+IHZvaWQ7XHJcbnR5cGUgQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJdGVtIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTdWJzY3JpYmUgdG8gYWxsIGNoYW5nZXMgaW4gaXRlbS4gUmV0dXJucyB1bi1zdWJzY3JpYmUgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3Vic2NyaWJlKGhhbmRsZXI6IEl0ZW1DaGFuZ2VIYW5kbGVyKTogQ2FsbGJhY2s7XHJcbiAgICAgICAgXHJcbiAgICAgICAgX2NoYW5nZWQoZmxhZ3M6IFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcpOiB2b2lkO1xyXG4gICAgfVxyXG59XHJcblxyXG5uYW1lc3BhY2UgUGFwZXJOb3RpZnkge1xyXG5cclxuICAgIGV4cG9ydCBlbnVtIENoYW5nZUZsYWcge1xyXG4gICAgICAgIC8vIEFueXRoaW5nIGFmZmVjdGluZyB0aGUgYXBwZWFyYW5jZSBvZiBhbiBpdGVtLCBpbmNsdWRpbmcgR0VPTUVUUlksXHJcbiAgICAgICAgLy8gU1RST0tFLCBTVFlMRSBhbmQgQVRUUklCVVRFIChleGNlcHQgZm9yIHRoZSBpbnZpc2libGUgb25lczogbG9ja2VkLCBuYW1lKVxyXG4gICAgICAgIEFQUEVBUkFOQ0UgPSAweDEsXHJcbiAgICAgICAgLy8gQSBjaGFuZ2UgaW4gdGhlIGl0ZW0ncyBjaGlsZHJlblxyXG4gICAgICAgIENISUxEUkVOID0gMHgyLFxyXG4gICAgICAgIC8vIEEgY2hhbmdlIG9mIHRoZSBpdGVtJ3MgcGxhY2UgaW4gdGhlIHNjZW5lIGdyYXBoIChyZW1vdmVkLCBpbnNlcnRlZCxcclxuICAgICAgICAvLyBtb3ZlZCkuXHJcbiAgICAgICAgSU5TRVJUSU9OID0gMHg0LFxyXG4gICAgICAgIC8vIEl0ZW0gZ2VvbWV0cnkgKHBhdGgsIGJvdW5kcylcclxuICAgICAgICBHRU9NRVRSWSA9IDB4OCxcclxuICAgICAgICAvLyBPbmx5IHNlZ21lbnQocykgaGF2ZSBjaGFuZ2VkLCBhbmQgYWZmZWN0ZWQgY3VydmVzIGhhdmUgYWxyZWFkeSBiZWVuXHJcbiAgICAgICAgLy8gbm90aWZpZWQuIFRoaXMgaXMgdG8gaW1wbGVtZW50IGFuIG9wdGltaXphdGlvbiBpbiBfY2hhbmdlZCgpIGNhbGxzLlxyXG4gICAgICAgIFNFR01FTlRTID0gMHgxMCxcclxuICAgICAgICAvLyBTdHJva2UgZ2VvbWV0cnkgKGV4Y2x1ZGluZyBjb2xvcilcclxuICAgICAgICBTVFJPS0UgPSAweDIwLFxyXG4gICAgICAgIC8vIEZpbGwgc3R5bGUgb3Igc3Ryb2tlIGNvbG9yIC8gZGFzaFxyXG4gICAgICAgIFNUWUxFID0gMHg0MCxcclxuICAgICAgICAvLyBJdGVtIGF0dHJpYnV0ZXM6IHZpc2libGUsIGJsZW5kTW9kZSwgbG9ja2VkLCBuYW1lLCBvcGFjaXR5LCBjbGlwTWFzayAuLi5cclxuICAgICAgICBBVFRSSUJVVEUgPSAweDgwLFxyXG4gICAgICAgIC8vIFRleHQgY29udGVudFxyXG4gICAgICAgIENPTlRFTlQgPSAweDEwMCxcclxuICAgICAgICAvLyBSYXN0ZXIgcGl4ZWxzXHJcbiAgICAgICAgUElYRUxTID0gMHgyMDAsXHJcbiAgICAgICAgLy8gQ2xpcHBpbmcgaW4gb25lIG9mIHRoZSBjaGlsZCBpdGVtc1xyXG4gICAgICAgIENMSVBQSU5HID0gMHg0MDAsXHJcbiAgICAgICAgLy8gVGhlIHZpZXcgaGFzIGJlZW4gdHJhbnNmb3JtZWRcclxuICAgICAgICBWSUVXID0gMHg4MDBcclxuICAgIH1cclxuXHJcbiAgICAvLyBTaG9ydGN1dHMgdG8gb2Z0ZW4gdXNlZCBDaGFuZ2VGbGFnIHZhbHVlcyBpbmNsdWRpbmcgQVBQRUFSQU5DRVxyXG4gICAgZXhwb3J0IGVudW0gQ2hhbmdlcyB7XHJcbiAgICAgICAgLy8gQ0hJTERSRU4gYWxzbyBjaGFuZ2VzIEdFT01FVFJZLCBzaW5jZSByZW1vdmluZyBjaGlsZHJlbiBmcm9tIGdyb3Vwc1xyXG4gICAgICAgIC8vIGNoYW5nZXMgYm91bmRzLlxyXG4gICAgICAgIENISUxEUkVOID0gQ2hhbmdlRmxhZy5DSElMRFJFTiB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgLy8gQ2hhbmdpbmcgdGhlIGluc2VydGlvbiBjYW4gY2hhbmdlIHRoZSBhcHBlYXJhbmNlIHRocm91Z2ggcGFyZW50J3MgbWF0cml4LlxyXG4gICAgICAgIElOU0VSVElPTiA9IENoYW5nZUZsYWcuSU5TRVJUSU9OIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIEdFT01FVFJZID0gQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBTRUdNRU5UUyA9IENoYW5nZUZsYWcuU0VHTUVOVFMgfCBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNUUk9LRSA9IENoYW5nZUZsYWcuU1RST0tFIHwgQ2hhbmdlRmxhZy5TVFlMRSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBTVFlMRSA9IENoYW5nZUZsYWcuU1RZTEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgQVRUUklCVVRFID0gQ2hhbmdlRmxhZy5BVFRSSUJVVEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgQ09OVEVOVCA9IENoYW5nZUZsYWcuQ09OVEVOVCB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgUElYRUxTID0gQ2hhbmdlRmxhZy5QSVhFTFMgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgVklFVyA9IENoYW5nZUZsYWcuVklFVyB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRVxyXG4gICAgfTtcclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICBcclxuICAgICAgICAvLyBJbmplY3QgSXRlbS5zdWJzY3JpYmVcclxuICAgICAgICBjb25zdCBpdGVtUHJvdG8gPSAoPGFueT5wYXBlcikuSXRlbS5wcm90b3R5cGU7XHJcbiAgICAgICAgaXRlbVByb3RvLnN1YnNjcmliZSA9IGZ1bmN0aW9uKGhhbmRsZXI6IEl0ZW1DaGFuZ2VIYW5kbGVyKTogQ2FsbGJhY2sge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3N1YnNjcmliZXJzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGhhbmRsZXIpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMucHVzaChoYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyLCAwKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gV3JhcCBJdGVtLnJlbW92ZVxyXG4gICAgICAgIGNvbnN0IGl0ZW1SZW1vdmUgPSBpdGVtUHJvdG8ucmVtb3ZlO1xyXG4gICAgICAgIGl0ZW1Qcm90by5yZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXRlbVJlbW92ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXcmFwIFByb2plY3QuX2NoYW5nZWRcclxuICAgICAgICBjb25zdCBwcm9qZWN0UHJvdG8gPSA8YW55PnBhcGVyLlByb2plY3QucHJvdG90eXBlO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RDaGFuZ2VkID0gcHJvamVjdFByb3RvLl9jaGFuZ2VkO1xyXG4gICAgICAgIHByb2plY3RQcm90by5fY2hhbmdlZCA9IGZ1bmN0aW9uKGZsYWdzOiBDaGFuZ2VGbGFnLCBpdGVtOiBwYXBlci5JdGVtKSB7XHJcbiAgICAgICAgICAgIHByb2plY3RDaGFuZ2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJzID0gKDxhbnk+aXRlbSkuX3N1YnNjcmliZXJzO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1YnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBzIG9mIHN1YnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcy5jYWxsKGl0ZW0sIGZsYWdzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRlc2NyaWJlKGZsYWdzOiBDaGFuZ2VGbGFnKSB7XHJcbiAgICAgICAgbGV0IGZsYWdMaXN0OiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIF8uZm9yT3duKENoYW5nZUZsYWcsICh2YWx1ZSwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICgodHlwZW9mIHZhbHVlKSA9PT0gXCJudW1iZXJcIiAmJiAodmFsdWUgJiBmbGFncykpIHtcclxuICAgICAgICAgICAgICAgIGZsYWdMaXN0LnB1c2goa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmbGFnTGlzdC5qb2luKCcgfCAnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmUoaXRlbTogcGFwZXIuSXRlbSwgZmxhZ3M6IENoYW5nZUZsYWcpOiBcclxuICAgICAgICBSeC5PYnNlcnZhYmxlPENoYW5nZUZsYWc+IFxyXG4gICAge1xyXG4gICAgICAgIGxldCB1bnN1YjogKCkgPT4gdm9pZDtcclxuICAgICAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuPENoYW5nZUZsYWc+KFxyXG4gICAgICAgICAgICBhZGRIYW5kbGVyID0+IHtcclxuICAgICAgICAgICAgICAgIHVuc3ViID0gaXRlbS5zdWJzY3JpYmUoZiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZiAmIGZsYWdzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkSGFuZGxlcihmKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgIHJlbW92ZUhhbmRsZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodW5zdWIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHVuc3ViKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuUGFwZXJOb3RpZnkuaW5pdGlhbGl6ZSgpO1xyXG4iLCJkZWNsYXJlIG1vZHVsZSBwYXBlciB7XHJcbiAgICBpbnRlcmZhY2UgVmlldyB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW50ZXJuYWwgbWV0aG9kIGZvciBpbml0aWF0aW5nIG1vdXNlIGV2ZW50cyBvbiB2aWV3LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGVtaXRNb3VzZUV2ZW50cyh2aWV3OiBwYXBlci5WaWV3LCBpdGVtOiBwYXBlci5JdGVtLCB0eXBlOiBzdHJpbmcsXHJcbiAgICAgICAgICAgIGV2ZW50OiBhbnksIHBvaW50OiBwYXBlci5Qb2ludCwgcHJldlBvaW50OiBwYXBlci5Qb2ludCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBwYXBlckV4dCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFZpZXdab29tIHtcclxuXHJcbiAgICAgICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuICAgICAgICBmYWN0b3IgPSAxLjI1O1xyXG5cclxuICAgICAgICBwcml2YXRlIF9taW5ab29tOiBudW1iZXI7XHJcbiAgICAgICAgcHJpdmF0ZSBfbWF4Wm9vbTogbnVtYmVyO1xyXG4gICAgICAgIHByaXZhdGUgX21vdXNlTmF0aXZlU3RhcnQ6IHBhcGVyLlBvaW50O1xyXG4gICAgICAgIHByaXZhdGUgX3ZpZXdDZW50ZXJTdGFydDogcGFwZXIuUG9pbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBfdmlld0NoYW5nZWQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlJlY3RhbmdsZT4oKTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJvamVjdDogcGFwZXIuUHJvamVjdCkge1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3QgPSBwcm9qZWN0O1xyXG5cclxuICAgICAgICAgICAgKDxhbnk+JCh0aGlzLnByb2plY3Qudmlldy5lbGVtZW50KSkubW91c2V3aGVlbCgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1vdXNlUG9zaXRpb24gPSBuZXcgcGFwZXIuUG9pbnQoZXZlbnQub2Zmc2V0WCwgZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVpvb21DZW50ZXJlZChldmVudC5kZWx0YVksIG1vdXNlUG9zaXRpb24pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBkaWREcmFnID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByb2plY3Qudmlldy5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoaXQgPSBwcm9qZWN0LmhpdFRlc3QoZXYucG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl92aWV3Q2VudGVyU3RhcnQpIHsgIC8vIG5vdCBhbHJlYWR5IGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhpdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkb24ndCBzdGFydCBkcmFnZ2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDZW50ZXJTdGFydCA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhdmUgdG8gdXNlIG5hdGl2ZSBtb3VzZSBvZmZzZXQsIGJlY2F1c2UgZXYuZGVsdGEgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gIGNoYW5nZXMgYXMgdGhlIHZpZXcgaXMgc2Nyb2xsZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG5ldyBwYXBlci5Qb2ludChldi5ldmVudC5vZmZzZXRYLCBldi5ldmVudC5vZmZzZXRZKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LmVtaXQocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ1N0YXJ0LCBldik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdGl2ZURlbHRhID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldi5ldmVudC5vZmZzZXRYIC0gdGhpcy5fbW91c2VOYXRpdmVTdGFydC54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldi5ldmVudC5vZmZzZXRZIC0gdGhpcy5fbW91c2VOYXRpdmVTdGFydC55XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBNb3ZlIGludG8gdmlldyBjb29yZGluYXRlcyB0byBzdWJyYWN0IGRlbHRhLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICB0aGVuIGJhY2sgaW50byBwcm9qZWN0IGNvb3Jkcy5cclxuICAgICAgICAgICAgICAgICAgICB2aWV3LmNlbnRlciA9IHZpZXcudmlld1RvUHJvamVjdChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5wcm9qZWN0VG9WaWV3KHRoaXMuX3ZpZXdDZW50ZXJTdGFydClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChuYXRpdmVEZWx0YSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpZERyYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdC52aWV3Lm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZVVwLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbW91c2VOYXRpdmVTdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDZW50ZXJTdGFydCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5lbWl0KHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdFbmQsIGV2KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlkRHJhZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWREcmFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB2aWV3Q2hhbmdlZCgpOiBPYnNlcnZhYmxlRXZlbnQ8cGFwZXIuUmVjdGFuZ2xlPiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92aWV3Q2hhbmdlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB6b29tKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2plY3Qudmlldy56b29tO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHpvb21SYW5nZSgpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRab29tUmFuZ2UocmFuZ2U6IHBhcGVyLlNpemVbXSk6IG51bWJlcltdIHtcclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgICAgICBjb25zdCBhU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICAgICAgY29uc3QgYSA9IGFTaXplICYmIE1hdGgubWluKFxyXG4gICAgICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYVNpemUuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgdmlldy5ib3VuZHMud2lkdGggLyBhU2l6ZS53aWR0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGIgPSBiU2l6ZSAmJiBNYXRoLm1pbihcclxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIGJTaXplLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYlNpemUud2lkdGgpO1xyXG4gICAgICAgICAgICBjb25zdCBtaW4gPSBNYXRoLm1pbihhLCBiKTtcclxuICAgICAgICAgICAgaWYgKG1pbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWluWm9vbSA9IG1pbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heChhLCBiKTtcclxuICAgICAgICAgICAgaWYgKG1heCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF4Wm9vbSA9IG1heDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgem9vbVRvKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSkge1xyXG4gICAgICAgICAgICBpZihyZWN0LmlzRW1wdHkoKSB8fCByZWN0LndpZHRoID09PSAwIHx8IHJlY3QuaGVpZ2h0ID09PSAwKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInNraXBwaW5nIHpvb20gdG9cIiwgcmVjdCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgICAgICB2aWV3LmNlbnRlciA9IHJlY3QuY2VudGVyO1xyXG4gICAgICAgICAgICBjb25zdCB6b29tTGV2ZWwgPSBNYXRoLm1pbihcclxuICAgICAgICAgICAgICAgIHZpZXcudmlld1NpemUuaGVpZ2h0IC8gcmVjdC5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB2aWV3LnZpZXdTaXplLndpZHRoIC8gcmVjdC53aWR0aCk7XHJcbiAgICAgICAgICAgIHZpZXcuem9vbSA9IHpvb21MZXZlbDtcclxuICAgICAgICAgICAgdGhpcy5fdmlld0NoYW5nZWQubm90aWZ5KHZpZXcuYm91bmRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYW5nZVpvb21DZW50ZXJlZChkZWx0YTogbnVtYmVyLCBtb3VzZVBvczogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICAgICAgaWYgKCFkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICAgICAgY29uc3Qgb2xkWm9vbSA9IHZpZXcuem9vbTtcclxuICAgICAgICAgICAgY29uc3Qgb2xkQ2VudGVyID0gdmlldy5jZW50ZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXdQb3MgPSB2aWV3LnZpZXdUb1Byb2plY3QobW91c2VQb3MpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld1pvb20gPSBkZWx0YSA+IDBcclxuICAgICAgICAgICAgICAgID8gdmlldy56b29tICogdGhpcy5mYWN0b3JcclxuICAgICAgICAgICAgICAgIDogdmlldy56b29tIC8gdGhpcy5mYWN0b3I7XHJcbiAgICAgICAgICAgIG5ld1pvb20gPSB0aGlzLnNldFpvb21Db25zdHJhaW5lZChuZXdab29tKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbmV3Wm9vbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB6b29tU2NhbGUgPSBvbGRab29tIC8gbmV3Wm9vbTtcclxuICAgICAgICAgICAgY29uc3QgY2VudGVyQWRqdXN0ID0gdmlld1Bvcy5zdWJ0cmFjdChvbGRDZW50ZXIpO1xyXG4gICAgICAgICAgICBjb25zdCBvZmZzZXQgPSB2aWV3UG9zLnN1YnRyYWN0KGNlbnRlckFkanVzdC5tdWx0aXBseSh6b29tU2NhbGUpKVxyXG4gICAgICAgICAgICAgICAgLnN1YnRyYWN0KG9sZENlbnRlcik7XHJcblxyXG4gICAgICAgICAgICB2aWV3LmNlbnRlciA9IHZpZXcuY2VudGVyLmFkZChvZmZzZXQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdmlld0NoYW5nZWQubm90aWZ5KHZpZXcuYm91bmRzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXQgem9vbSBsZXZlbC5cclxuICAgICAgICAgKiBAcmV0dXJucyB6b29tIGxldmVsIHRoYXQgd2FzIHNldCwgb3IgbnVsbCBpZiBpdCB3YXMgbm90IGNoYW5nZWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHNldFpvb21Db25zdHJhaW5lZCh6b29tOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbWluWm9vbSkge1xyXG4gICAgICAgICAgICAgICAgem9vbSA9IE1hdGgubWF4KHpvb20sIHRoaXMuX21pblpvb20pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXhab29tKSB7XHJcbiAgICAgICAgICAgICAgICB6b29tID0gTWF0aC5taW4oem9vbSwgdGhpcy5fbWF4Wm9vbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgICAgICBpZiAoem9vbSAhPSB2aWV3Lnpvb20pIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuem9vbSA9IHpvb207XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gem9vbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIHBhcGVyRXh0IHtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBVc2Ugb2YgdGhlc2UgZXZlbnRzIHJlcXVpcmVzIGZpcnN0IGNhbGxpbmcgZXh0ZW5kTW91c2VFdmVudHNcclxuICAgICAqICAgb24gdGhlIGl0ZW0uIFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgdmFyIEV2ZW50VHlwZSA9IHtcclxuICAgICAgICBtb3VzZURyYWdTdGFydDogXCJtb3VzZURyYWdTdGFydFwiLFxyXG4gICAgICAgIG1vdXNlRHJhZ0VuZDogXCJtb3VzZURyYWdFbmRcIlxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBleHRlbmRNb3VzZUV2ZW50cyhpdGVtOiBwYXBlci5JdGVtKXtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYoIWRyYWdnaW5nKXtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGl0ZW0ub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlVXAsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYoZHJhZ2dpbmcpe1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnRW5kLCBldik7XHJcbiAgICAgICAgICAgICAgICAvLyBwcmV2ZW50IGNsaWNrXHJcbiAgICAgICAgICAgICAgICBldi5zdG9wKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIH1cclxufSIsIlxyXG5tb2R1bGUgcGFwZXIge1xyXG5cclxuICAgIGV4cG9ydCB2YXIgRXZlbnRUeXBlID0ge1xyXG4gICAgICAgIGZyYW1lOiBcImZyYW1lXCIsXHJcbiAgICAgICAgbW91c2VEb3duOiBcIm1vdXNlZG93blwiLFxyXG4gICAgICAgIG1vdXNlVXA6IFwibW91c2V1cFwiLFxyXG4gICAgICAgIG1vdXNlRHJhZzogXCJtb3VzZWRyYWdcIixcclxuICAgICAgICBjbGljazogXCJjbGlja1wiLFxyXG4gICAgICAgIGRvdWJsZUNsaWNrOiBcImRvdWJsZWNsaWNrXCIsXHJcbiAgICAgICAgbW91c2VNb3ZlOiBcIm1vdXNlbW92ZVwiLFxyXG4gICAgICAgIG1vdXNlRW50ZXI6IFwibW91c2VlbnRlclwiLFxyXG4gICAgICAgIG1vdXNlTGVhdmU6IFwibW91c2VsZWF2ZVwiLFxyXG4gICAgICAgIGtleXVwOiBcImtleXVwXCIsXHJcbiAgICAgICAga2V5ZG93bjogXCJrZXlkb3duXCJcclxuICAgIH1cclxuXHJcbn0iLCJcclxuYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50PFQ+IHtcclxuICAgIGFic3RyYWN0IHJlbmRlcihkYXRhOiBUKTogVk5vZGU7XHJcbn0iLCJcclxuaW50ZXJmYWNlIFJlYWN0aXZlRG9tQ29tcG9uZW50IHtcclxuICAgIGRvbSQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+O1xyXG59XHJcblxyXG5uYW1lc3BhY2UgVkRvbUhlbHBlcnMge1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckFzQ2hpbGQoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgdm5vZGU6IFZOb2RlKSB7XHJcbiAgICAgICAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGNvbnN0IHBhdGNoZWQgPSBwYXRjaChjaGlsZCwgdm5vZGUpO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwYXRjaGVkLmVsbSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFJlYWN0aXZlRG9tIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciBhIHJlYWN0aXZlIGNvbXBvbmVudCB3aXRoaW4gY29udGFpbmVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyU3RyZWFtKFxyXG4gICAgICAgIGRvbSQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+LFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnRcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBjb25zdCBpZCA9IGNvbnRhaW5lci5pZDtcclxuICAgICAgICBsZXQgY3VycmVudDogSFRNTEVsZW1lbnQgfCBWTm9kZSA9IGNvbnRhaW5lcjtcclxuICAgICAgICBjb25zdCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XHJcbiAgICAgICAgZG9tJC5zdWJzY3JpYmUoZG9tID0+IHtcclxuICAgICAgICAgICAgaWYgKCFkb20pIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRW1wdHlOb2Rlcyhkb20pO1xyXG4gICAgICAgICAgICBsZXQgcGF0Y2hlZDogVk5vZGU7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBwYXRjaGVkID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3IgcGF0Y2hpbmcgZG9tXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGRvbSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpZCAmJiAhcGF0Y2hlZC5lbG0uaWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJldGFpbiBJRFxyXG4gICAgICAgICAgICAgICAgcGF0Y2hlZC5lbG0uaWQgPSBpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoZWQ7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2l2ZWx5IHJlbW92ZSBlbXB0eSBjaGlsZHJlbiBmcm9tIHRyZWUuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW1vdmVFbXB0eU5vZGVzKG5vZGU6IFZOb2RlKSB7XHJcbiAgICAgICAgaWYoIW5vZGUuY2hpbGRyZW4gfHwgIW5vZGUuY2hpbGRyZW4ubGVuZ3RoKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBub3RFbXB0eSA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKGMgPT4gISFjKTtcclxuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbi5sZW5ndGggIT0gbm90RW1wdHkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcInJlbW92ZWQgZW1wdHkgY2hpbGRyZW4gZnJvbVwiLCBub2RlLmNoaWxkcmVuKTtcclxuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG5vdEVtcHR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVFbXB0eU5vZGVzKGNoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSByZWFjdGl2ZSBjb21wb25lbnQgd2l0aGluIGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlckNvbXBvbmVudChcclxuICAgICAgICBjb21wb25lbnQ6IFJlYWN0aXZlRG9tQ29tcG9uZW50LFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZVxyXG4gICAgKTogUnguT2JzZXJ2YWJsZTxWTm9kZT4ge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gY29udGFpbmVyO1xyXG4gICAgICAgIGxldCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XHJcbiAgICAgICAgY29tcG9uZW50LmRvbSQuc3Vic2NyaWJlKGRvbSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZG9tKSByZXR1cm47XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgd2l0aGluIGNvbnRhaW5lciB3aGVuZXZlciBzb3VyY2UgY2hhbmdlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxpdmVSZW5kZXI8VD4oXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudCB8IFZOb2RlLFxyXG4gICAgICAgIHNvdXJjZTogUnguT2JzZXJ2YWJsZTxUPixcclxuICAgICAgICByZW5kZXI6IChuZXh0OiBUKSA9PiBWTm9kZVxyXG4gICAgKTogUnguT2JzZXJ2YWJsZTxWTm9kZT4ge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gY29udGFpbmVyO1xyXG4gICAgICAgIGxldCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XHJcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSByZW5kZXIoZGF0YSk7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgbm9kZSk7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbn0iLCJcclxubmFtZXNwYWNlIEFwcCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFwcENvb2tpZXMge1xyXG5cclxuICAgICAgICBzdGF0aWMgWUVBUiA9IDM2NTtcclxuICAgICAgICBzdGF0aWMgQlJPV1NFUl9JRF9LRVkgPSBcImJyb3dzZXJJZFwiO1xyXG4gICAgICAgIHN0YXRpYyBMQVNUX1NBVkVEX1NLRVRDSF9JRF9LRVkgPSBcImxhc3RTYXZlZFNrZXRjaElkXCI7XHJcblxyXG4gICAgICAgIGdldCBsYXN0U2F2ZWRTa2V0Y2hJZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXMuZ2V0KEFwcENvb2tpZXMuTEFTVF9TQVZFRF9TS0VUQ0hfSURfS0VZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldCBsYXN0U2F2ZWRTa2V0Y2hJZCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIENvb2tpZXMuc2V0KEFwcENvb2tpZXMuTEFTVF9TQVZFRF9TS0VUQ0hfSURfS0VZLCB2YWx1ZSwgeyBleHBpcmVzOiBBcHBDb29raWVzLllFQVIgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgYnJvd3NlcklkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llcy5nZXQoQXBwQ29va2llcy5CUk9XU0VSX0lEX0tFWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgYnJvd3NlcklkKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgQ29va2llcy5zZXQoQXBwQ29va2llcy5CUk9XU0VSX0lEX0tFWSwgdmFsdWUsIHsgZXhwaXJlczogQXBwQ29va2llcy5ZRUFSIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIEFwcCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7XHJcblxyXG4gICAgICAgIHN0b3JlOiBTdG9yZTtcclxuICAgICAgICBlZGl0b3JNb2R1bGU6IFNrZXRjaEVkaXRvci5Ta2V0Y2hFZGl0b3JNb2R1bGU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNob3VsZExvZ0luZm8gPSBmYWxzZTsgICAgICAgXHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gbmV3IFN0b3JlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yTW9kdWxlID0gbmV3IFNrZXRjaEVkaXRvci5Ta2V0Y2hFZGl0b3JNb2R1bGUodGhpcy5zdG9yZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHN0YXJ0KCkgeyAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yTW9kdWxlLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmludGVyZmFjZSBXaW5kb3cge1xyXG4gICAgYXBwOiBBcHAuQXBwTW9kdWxlO1xyXG59IiwiXHJcbm5hbWVzcGFjZSBBcHAge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBcHBSb3V0ZXIgZXh0ZW5kcyBSb3V0ZXI1IHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFtcclxuICAgICAgICAgICAgICAgIG5ldyBSb3V0ZU5vZGUoXCJob21lXCIsIFwiL1wiKSxcclxuICAgICAgICAgICAgICAgIG5ldyBSb3V0ZU5vZGUoXCJza2V0Y2hcIiwgXCIvc2tldGNoLzpza2V0Y2hJZFwiKSwgLy8gPFthLWZBLUYwLTldezE0fT5cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VIYXNoOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Um91dGU6IFwiaG9tZVwiXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy51c2VQbHVnaW4obG9nZ2VyUGx1Z2luKCkpXHJcbiAgICAgICAgICAgIHRoaXMudXNlUGx1Z2luKGxpc3RlbmVyc1BsdWdpbi5kZWZhdWx0KCkpXHJcbiAgICAgICAgICAgICAgICAudXNlUGx1Z2luKGhpc3RvcnlQbHVnaW4uZGVmYXVsdCgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvU2tldGNoRWRpdG9yKHNrZXRjaElkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZShcInNrZXRjaFwiLCB7IHNrZXRjaElkOiBza2V0Y2hJZCB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBzdGF0ZSgpIHtcclxuICAgICAgICAgICAgLy8gY291bGQgZG8gcm91dGUgdmFsaWRhdGlvbiBzb21ld2hlcmVcclxuICAgICAgICAgICAgcmV0dXJuIDxBcHBSb3V0ZVN0YXRlPjxhbnk+dGhpcy5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEFwcFJvdXRlU3RhdGUge1xyXG4gICAgICAgIG5hbWU6IFwiaG9tZVwifFwic2tldGNoXCIsXHJcbiAgICAgICAgcGFyYW1zPzoge1xyXG4gICAgICAgICAgICBza2V0Y2hJZD86IHN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGF0aD86IHN0cmluZ1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5uYW1lc3BhY2UgQXBwIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3RvcmUge1xyXG5cclxuICAgICAgICBzdGF0ZTogQXBwU3RhdGU7XHJcbiAgICAgICAgYWN0aW9uczogQWN0aW9ucztcclxuICAgICAgICBldmVudHM6IEV2ZW50cztcclxuXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IEFwcFJvdXRlcjtcclxuICAgICAgICBwcml2YXRlIGNvb2tpZXM6IEFwcENvb2tpZXM7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlciA9IG5ldyBBcHBSb3V0ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29va2llcyA9IG5ldyBBcHBDb29raWVzKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Um91dGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFN0YXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEFjdGlvbkhhbmRsZXJzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0U3RhdGUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBuZXcgQXBwU3RhdGUodGhpcy5jb29raWVzLCB0aGlzLnJvdXRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGluaXRBY3Rpb25IYW5kbGVycygpIHtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLmVkaXRvckxvYWRlZFNrZXRjaC5zdWIoc2tldGNoSWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoXCJza2V0Y2hcIiwgeyBza2V0Y2hJZCB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMuZWRpdG9yU2F2ZWRTa2V0Y2guc3ViKGlkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29va2llcy5sYXN0U2F2ZWRTa2V0Y2hJZCA9IGlkO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzdGFydFJvdXRlcigpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIuc3RhcnQoKGVyciwgc3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnJvdXRlQ2hhbmdlZC5kaXNwYXRjaChzdGF0ZSk7IFxyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInJvdXRlciBlcnJvclwiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwiaG9tZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQXBwU3RhdGUge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgY29va2llczogQXBwQ29va2llcztcclxuICAgICAgICBwcml2YXRlIHJvdXRlcjogQXBwUm91dGVyOyBcclxuICAgICAgICBcclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb29raWVzOiBBcHBDb29raWVzLCByb3V0ZXI6IEFwcFJvdXRlcil7XHJcbiAgICAgICAgICAgIHRoaXMuY29va2llcyA9IGNvb2tpZXM7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyID0gcm91dGVyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgYnJvd3NlcklkID0gdGhpcy5jb29raWVzLmJyb3dzZXJJZCB8fCBGcmFtZXdvcmsubmV3aWQoKTtcclxuICAgICAgICAgICAgLy8gaW5pdCBvciByZWZyZXNoIGNvb2tpZVxyXG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMuYnJvd3NlcklkID0gYnJvd3NlcklkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBnZXQgbGFzdFNhdmVkU2tldGNoSWQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvb2tpZXMubGFzdFNhdmVkU2tldGNoSWQ7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBnZXQgYnJvd3NlcklkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb29raWVzLmJyb3dzZXJJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0IHJvdXRlKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZXIuc3RhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBY3Rpb25zIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWwge1xyXG4gICAgICAgIGVkaXRvckxvYWRlZFNrZXRjaCA9IHRoaXMudG9waWM8c3RyaW5nPihcImVkaXRvckxvYWRlZFNrZXRjaFwiKTtcclxuICAgICAgICBlZGl0b3JTYXZlZFNrZXRjaCA9IHRoaXMudG9waWM8c3RyaW5nPihcImVkaXRvclNhdmVkU2tldGNoXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBFdmVudHMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XHJcbiAgICAgICAgcm91dGVDaGFuZ2VkID0gdGhpcy50b3BpYzxBcHBSb3V0ZVN0YXRlPihcInJvdXRlQ2hhbmdlZFwiKTtcclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgRGVtbyB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIERlbW9Nb2R1bGUge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcblxyXG4gICAgICAgICAgICBwYXBlci5zZXR1cChjYW52YXMpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXJ0KCkge1xyXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gcGFwZXIudmlldztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZEZvbnRzID0gbmV3IEZvbnRTaGFwZS5QYXJzZWRGb250cygoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICBwYXJzZWRGb250cy5nZXQoXCJmb250cy9Sb2JvdG8tNTAwLnR0ZlwiKS50aGVuKCBwYXJzZWQgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IHBhcnNlZC5mb250LmdldFBhdGgoXCJTTkFQXCIsIDAsIDAsIDEyOCkudG9QYXRoRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuICAgICAgICAgICAgICAgICBjb250ZW50LnBvc2l0aW9uID0gY29udGVudC5wb3NpdGlvbi5hZGQoNTApO1xyXG4gICAgICAgICAgICAgICAgIGNvbnRlbnQuZmlsbENvbG9yID0gXCJsaWdodGdyYXlcIjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWdpb24gPSBwYXBlci5QYXRoLkVsbGlwc2UobmV3IHBhcGVyLlJlY3RhbmdsZShcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMCwwKSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2l6ZSg2MDAsIDMwMClcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgcmVnaW9uLnJvdGF0ZSgzMCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJlZ2lvbi5ib3VuZHMuY2VudGVyID0gdmlldy5jZW50ZXI7XHJcbiAgICAgICAgICAgICAgICByZWdpb24uc3Ryb2tlQ29sb3IgPSBcImxpZ2h0Z3JheVwiO1xyXG4gICAgICAgICAgICAgICAgcmVnaW9uLnN0cm9rZVdpZHRoID0gMztcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzbmFwUGF0aCA9IG5ldyBGb250U2hhcGUuU25hcFBhdGgocmVnaW9uLCBjb250ZW50KTtcclxuICAgICAgICAgICAgICAgIHNuYXBQYXRoLmNvcm5lcnMgPSBbMCwgMC40LCAwLjQ1LCAwLjk1XTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmlldy5vbkZyYW1lID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNuYXBQYXRoLnNsaWRlKDAuMDAxKTtcclxuICAgICAgICAgICAgICAgICAgICBzbmFwUGF0aC51cGRhdGVQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZpZXcuZHJhdygpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICBcclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEJ1aWxkZXIge1xyXG5cclxuICAgICAgICBzdGF0aWMgZGVmYXVsdEZvbnRVcmwgPSBcImZvbnRzL1JvYm90by01MDAudHRmXCI7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY29udGV4dCA9IDxUZW1wbGF0ZVVJQ29udGV4dD57XHJcbiAgICAgICAgICAgICAgICBnZXQgZm9udENhdGFsb2coKSB7IHJldHVybiBzdG9yZS5mb250Q2F0YWxvZyB9LFxyXG4gICAgICAgICAgICAgICAgcmVuZGVyRGVzaWduOiAoZGVzaWduLCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLnJlbmRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2lnbjogZGVzaWduLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNyZWF0ZUZvbnRDaG9vc2VyOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBUZW1wbGF0ZUZvbnRDaG9vc2VyKHN0b3JlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gYXN5bmMgb2JzZXJ2ZVxyXG4gICAgICAgICAgICBzdG9yZS50ZW1wbGF0ZSQub2JzZXJ2ZU9uKFJ4LlNjaGVkdWxlci5kZWZhdWx0KS5zdWJzY3JpYmUodCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q29udGVudCA9IHN0b3JlLmRlc2lnbi5jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VGVtcGxhdGVTdGF0ZSA9IHQuY3JlYXRlTmV3KGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRDb250ZW50ICYmIGN1cnJlbnRDb250ZW50LnRleHQgJiYgY3VycmVudENvbnRlbnQudGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdUZW1wbGF0ZVN0YXRlLmRlc2lnbi5jb250ZW50ID0gY3VycmVudENvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5zZXRUZW1wbGF0ZVN0YXRlKG5ld1RlbXBsYXRlU3RhdGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRvbSQgPSBzdG9yZS50ZW1wbGF0ZVN0YXRlJFxyXG4gICAgICAgICAgICAgICAgLm1hcCh0cyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRyb2xzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xzID0gc3RvcmUudGVtcGxhdGUuY3JlYXRlVUkoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgY2FsbGluZyAke3N0b3JlLnRlbXBsYXRlLm5hbWV9LmNyZWF0ZVVJYCwgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBjb250cm9scykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjLnZhbHVlJC5zdWJzY3JpYmUoZCA9PiBzdG9yZS51cGRhdGVUZW1wbGF0ZVN0YXRlKGQpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBjb250cm9scy5tYXAoYyA9PiBjLmNyZWF0ZU5vZGUodHMpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2bm9kZSA9IGgoXCJkaXYjdGVtcGxhdGVDb250cm9sc1wiLCB7fSwgbm9kZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2bm9kZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKGRvbSQsIGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIE1vZHVsZSB7XHJcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIGJ1aWxkZXI6IEJ1aWxkZXI7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBidWlsZGVyQ29udGFpbmVyOiBIVE1MRWxlbWVudCxcclxuICAgICAgICAgICAgcHJldmlld0NhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsXHJcbiAgICAgICAgICAgIHJlbmRlckNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsXHJcbiAgICAgICAgICAgIGJlbG93Q2FudmFzOiBIVE1MRWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IG5ldyBTdG9yZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkZXIgPSBuZXcgQnVpbGRlcihidWlsZGVyQ29udGFpbmVyLCB0aGlzLnN0b3JlKTtcclxuXHJcbiAgICAgICAgICAgIG5ldyBQcmV2aWV3Q2FudmFzKHByZXZpZXdDYW52YXMsIHRoaXMuc3RvcmUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdG9yZS50ZW1wbGF0ZVN0YXRlJC5zdWJzY3JpYmUodHMgPT4gY29uc29sZS5sb2coXCJ0ZW1wbGF0ZVN0YXRlXCIsIHRzKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUudGVtcGxhdGUkLnN1YnNjcmliZSh0ID0+IGNvbnNvbGUubG9nKFwidGVtcGxhdGVcIiwgdCkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbmV3IFNoYXJlT3B0aW9uc1VJKGJlbG93Q2FudmFzLCB0aGlzLnN0b3JlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXJ0KCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmluaXQoKS50aGVuKHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5zZXRUZW1wbGF0ZShcIkRpY2tlbnNcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZVRlbXBsYXRlU3RhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgeyBkZXNpZ246XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiVGhlIHJhaW4gaW4gU3BhaW4gZmFsbHMgbWFpbmx5IGluIHRoZSBwbGFpblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUHJldmlld0NhbnZhcyB7XHJcblxyXG4gICAgICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIGJ1aWx0RGVzaWduOiBwYXBlci5JdGVtO1xyXG4gICAgICAgIGNvbnRleHQ6IFRlbXBsYXRlQnVpbGRDb250ZXh0O1xyXG5cclxuICAgICAgICBwcml2YXRlIGxhc3RSZWNlaXZlZDogRGVzaWduO1xyXG4gICAgICAgIHByaXZhdGUgcmVuZGVyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgICAgIHByaXZhdGUgd29ya3NwYWNlOiBwYXBlci5Hcm91cDtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuXHJcbiAgICAgICAgICAgIHBhcGVyLnNldHVwKGNhbnZhcyk7XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdCA9IHBhcGVyLnByb2plY3Q7XHJcbiAgICAgICAgICAgIHRoaXMud29ya3NwYWNlID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcblxyXG4gICAgICAgICAgICBGb250U2hhcGUuVmVydGljYWxCb3VuZHNTdHJldGNoUGF0aC5wb2ludHNQZXJQYXRoID0gNDAwO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgZ2V0Rm9udDogc3BlY2lmaWVyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzcGVjaWZpZXIgfHwgIXNwZWNpZmllci5mYW1pbHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gQnVpbGRlci5kZWZhdWx0Rm9udFVybDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBzdG9yZS5mb250Q2F0YWxvZy5nZXRVcmwoc3BlY2lmaWVyLmZhbWlseSwgc3BlY2lmaWVyLnZhcmlhbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBCdWlsZGVyLmRlZmF1bHRGb250VXJsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmUucGFyc2VkRm9udHMuZ2V0KHVybClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHJlc3VsdC5mb250KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLnRlbXBsYXRlU3RhdGUkLnN1YnNjcmliZSgodHM6IFRlbXBsYXRlU3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIG9ubHkgcHJvY2VzcyBvbmUgcmVxdWVzdCBhdCBhIHRpbWVcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsd2F5cyBwcm9jZXNzIHRoZSBsYXN0IHJlY2VpdmVkXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0UmVjZWl2ZWQgPSB0cy5kZXNpZ247XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHRzLmRlc2lnbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmRvd25sb2FkUE5HUmVxdWVzdGVkLnN1YigoKSA9PiB0aGlzLmRvd25sb2FkUE5HKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkb3dubG9hZFBORygpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0b3JlLmRlc2lnbi5jb250ZW50IFxyXG4gICAgICAgICAgICAgICAgfHwgIXRoaXMuc3RvcmUuZGVzaWduLmNvbnRlbnQudGV4dCBcclxuICAgICAgICAgICAgICAgIHx8ICF0aGlzLnN0b3JlLmRlc2lnbi5jb250ZW50LnRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gSGFsZiBvZiBtYXggRFBJIHByb2R1Y2VzIGFwcHJveCA0MjAweDQyMDAuXHJcbiAgICAgICAgICAgIGNvbnN0IGRwaSA9IDAuNSAqIFBhcGVySGVscGVycy5nZXRNYXhFeHBvcnREcGkodGhpcy53b3Jrc3BhY2UuYm91bmRzLnNpemUpO1xyXG4gICAgICAgICAgICBjb25zdCByYXN0ZXIgPSB0aGlzLndvcmtzcGFjZS5yYXN0ZXJpemUoZHBpLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByYXN0ZXIudG9EYXRhVVJMKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gRnN0eC5GcmFtZXdvcmsuY3JlYXRlRmlsZU5hbWUodGhpcy5zdG9yZS5kZXNpZ24uY29udGVudC50ZXh0LCA0MCwgXCJwbmdcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBEb21IZWxwZXJzLmRhdGFVUkxUb0Jsb2IoZGF0YSk7XHJcbiAgICAgICAgICAgIHNhdmVBcyhibG9iLCBmaWxlTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHJlbmRlckxhc3RSZWNlaXZlZCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubGFzdFJlY2VpdmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZW5kZXJpbmcgPSB0aGlzLmxhc3RSZWNlaXZlZDtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdFJlY2VpdmVkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHJlbmRlcmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVuZGVyKGRlc2lnbjogRGVzaWduKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmluZykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVuZGVyIGlzIGluIHByb2dyZXNzXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLndvcmtzcGFjZSA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS50ZW1wbGF0ZS5idWlsZChkZXNpZ24sIHRoaXMuY29udGV4dCkudGhlbihpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gcmVuZGVyIHJlc3VsdCBmcm9tXCIsIGRlc2lnbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZml0Qm91bmRzKHRoaXMucHJvamVjdC52aWV3LmJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5ib3VuZHMucG9pbnQgPSB0aGlzLnByb2plY3Qudmlldy5ib3VuZHMudG9wTGVmdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmtzcGFjZS5hZGRDaGlsZChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaGFuZGxlIGFueSByZWNlaXZlZCB3aGlsZSByZW5kZXJpbmcgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckxhc3RSZWNlaXZlZCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcmVuZGVyaW5nIGRlc2lnblwiLCBlcnIsIGRlc2lnbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0iLCIvLyBuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4vLyAgICAgZXhwb3J0IGNsYXNzIFJlbmRlckNhbnZhcyB7XHJcblxyXG4vLyAgICAgICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbi8vICAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG4vLyAgICAgICAgIGJ1aWx0RGVzaWduOiBwYXBlci5JdGVtO1xyXG5cclxuLy8gICAgICAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuLy8gICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4vLyAgICAgICAgICAgICBwYXBlci5zZXR1cChjYW52YXMpO1xyXG4gICAgICAgICAgICBcclxuLy8gICAgICAgICAgICAgY29uc3QgY29udGV4dCA9IHtcclxuLy8gICAgICAgICAgICAgICAgIGdldEZvbnQ6IHNwZWNpZmllciA9PiB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgbGV0IHVybDogc3RyaW5nO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGlmICghc3BlY2lmaWVyIHx8ICFzcGVjaWZpZXIuZmFtaWx5KSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IEJ1aWxkZXIuZGVmYXVsdEZvbnRVcmw7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gc3RvcmUuZm9udENhdGFsb2cuZ2V0VXJsKHNwZWNpZmllci5mYW1pbHksIHNwZWNpZmllci52YXJpYW50KVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgQnVpbGRlci5kZWZhdWx0Rm9udFVybDtcclxuLy8gICAgICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLnBhcnNlZEZvbnRzLmdldCh1cmwpXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQuZm9udCk7XHJcbi8vICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgIH07XHJcblxyXG4vLyAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVkID0gc3RvcmUucmVuZGVyJC5jb250cm9sbGVkKCk7XHJcbi8vICAgICAgICAgICAgIGNvbnRyb2xsZWQuc3Vic2NyaWJlKHJlcXVlc3QgPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgbGV0IGRlc2lnbiA9IDxEZXNpZ24+Xy5jbG9uZSh0aGlzLnN0b3JlLmRlc2lnbik7XHJcbi8vICAgICAgICAgICAgICAgICBkZXNpZ24gPSBfLm1lcmdlKGRlc2lnbiwgcmVxdWVzdC5kZXNpZ24pO1xyXG4vLyAgICAgICAgICAgICAgICAgcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5yZW1vdmVDaGlsZHJlbigpO1xyXG4vLyAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS50ZW1wbGF0ZS5idWlsZChkZXNpZ24sIGNvbnRleHQpLnRoZW4oaXRlbSA9PiB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFzdGVyID0gcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5yYXN0ZXJpemUoNzIsIGZhbHNlKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbW92ZSgpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3QuY2FsbGJhY2socmFzdGVyLnRvRGF0YVVSTCgpKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVkLnJlcXVlc3QoMSk7XHJcbi8vICAgICAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICAgICAgKGVycikgPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImVycm9yIG9uIHRlbXBsYXRlLmJ1aWxkXCIsIGVycik7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlZC5yZXF1ZXN0KDEpO1xyXG4vLyAgICAgICAgICAgICAgICAgfSk7XHJcbi8vICAgICAgICAgICAgIH0pO1xyXG4vLyAgICAgICAgICAgICBjb250cm9sbGVkLnJlcXVlc3QoMSk7XHJcblxyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICB9XHJcbi8vIH0iLCJtb2R1bGUgU2tldGNoQnVpbGRlciB7XHJcbiAgICBcclxuICAgIGV4cG9ydCBjbGFzcyBTaGFyZU9wdGlvbnNVSSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKXtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBSeC5PYnNlcnZhYmxlLmp1c3QobnVsbCk7XHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShzdGF0ZS5tYXAoKCkgPT4gdGhpcy5jcmVhdGVEb20oKSksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNyZWF0ZURvbSgpOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiYnV0dG9uLmJ0bi5idG4tcHJpbWFyeVwiLCB7XHJcbiAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmRvd25sb2FkUE5HKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgW1wiRG93bmxvYWRcIl0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdG9yZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGUkID0gbmV3IFJ4LlN1YmplY3Q8VGVtcGxhdGU+KCk7XHJcbiAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGVTdGF0ZSQgPSBuZXcgUnguU3ViamVjdDxUZW1wbGF0ZVN0YXRlPigpO1xyXG4gICAgICAgIHByaXZhdGUgX3JlbmRlciQgPSBuZXcgUnguU3ViamVjdDxSZW5kZXJSZXF1ZXN0PigpO1xyXG4gICAgICAgIHByaXZhdGUgX3N0YXRlOiB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlPzogVGVtcGxhdGU7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlU3RhdGU6IFRlbXBsYXRlU3RhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgX2V2ZW50c0NoYW5uZWwgPSBuZXcgVHlwZWRDaGFubmVsLkNoYW5uZWwoKTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfcGFyc2VkRm9udHM6IEZvbnRTaGFwZS5QYXJzZWRGb250cztcclxuICAgICAgICBwcml2YXRlIF9mb250Q2F0YWxvZzogRm9udFNoYXBlLkZvbnRDYXRhbG9nO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVN0YXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzaWduOiB7fVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcGFyc2VkRm9udHMgPSBuZXcgRm9udFNoYXBlLlBhcnNlZEZvbnRzKCgpID0+IHsgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBldmVudHMgPSB7XHJcbiAgICAgICAgICAgIGRvd25sb2FkUE5HUmVxdWVzdGVkOiB0aGlzLl9ldmVudHNDaGFubmVsLnRvcGljPHZvaWQ+KFwiZG93bmxvYWRQTkdSZXF1ZXN0ZWRcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBzdGF0ZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHBhcnNlZEZvbnRzKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyc2VkRm9udHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgZm9udENhdGFsb2coKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250Q2F0YWxvZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB0ZW1wbGF0ZVN0YXRlJCgpOiBSeC5PYnNlcnZhYmxlPFRlbXBsYXRlU3RhdGU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlU3RhdGUkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHRlbXBsYXRlJCgpOiBSeC5PYnNlcnZhYmxlPFRlbXBsYXRlPiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZSQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgcmVuZGVyJCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlciQ7Ly8ub2JzZXJ2ZU9uKFJ4LlNjaGVkdWxlci5kZWZhdWx0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUudGVtcGxhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgZGVzaWduKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS50ZW1wbGF0ZVN0YXRlICYmIHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZS5kZXNpZ247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0KCk6IFByb21pc2U8U3RvcmU+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5pbml0aWFsaXplZCl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdG9yZSBpcyBhbHJlYWR5IGluaXRhbGl6ZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPFN0b3JlPihjYWxsYmFjayA9PiB7XHJcbiAgICAgICAgICAgICAgICBGb250U2hhcGUuRm9udENhdGFsb2cuZnJvbUxvY2FsKFwiZm9udHMvZ29vZ2xlLWZvbnRzLmpzb25cIilcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihjID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9udENhdGFsb2cgPSBjO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb3dubG9hZFBORygpe1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5kb3dubG9hZFBOR1JlcXVlc3RlZC5kaXNwYXRjaCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0VGVtcGxhdGUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZTogVGVtcGxhdGU7XHJcbiAgICAgICAgICAgIGlmICgvRGlja2Vucy9pLnRlc3QobmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gbmV3IFNrZXRjaEJ1aWxkZXIuVGVtcGxhdGVzLkRpY2tlbnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdGVtcGxhdGUgJHtuYW1lfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcclxuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUkLm9uTmV4dCh0ZW1wbGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXREZXNpZ24odmFsdWU6IERlc2lnbikge1xyXG4gICAgICAgICAgICB0aGlzLnNldFRlbXBsYXRlU3RhdGUoeyBkZXNpZ246IHZhbHVlIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGRhdGVUZW1wbGF0ZVN0YXRlKGNoYW5nZTogVGVtcGxhdGVTdGF0ZUNoYW5nZSkge1xyXG4gICAgICAgICAgICBfLm1lcmdlKHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZSwgY2hhbmdlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGRlc2lnbiA9IHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZS5kZXNpZ247XHJcbiAgICAgICAgICAgIGlmKGRlc2lnbiAmJiBkZXNpZ24uZm9udCAmJiBkZXNpZ24uZm9udC5mYW1pbHkgJiYgIWRlc2lnbi5mb250LnZhcmlhbnQpIHtcclxuICAgICAgICAgICAgICAgLy8gc2V0IGRlZmF1bHQgdmFyaWFudFxyXG4gICAgICAgICAgICAgICAgZGVzaWduLmZvbnQudmFyaWFudCA9IEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5kZWZhdWx0VmFyaWFudChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb250Q2F0YWxvZy5nZXRSZWNvcmQoZGVzaWduLmZvbnQuZmFtaWx5KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlU3RhdGUkLm9uTmV4dCh0aGlzLnN0YXRlLnRlbXBsYXRlU3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzZXRUZW1wbGF0ZVN0YXRlKHN0YXRlOiBUZW1wbGF0ZVN0YXRlKXtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUudGVtcGxhdGVTdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVN0YXRlJC5vbk5leHQoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVuZGVyKHJlcXVlc3Q6IFJlbmRlclJlcXVlc3QpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyJC5vbk5leHQocmVxdWVzdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGUge1xyXG4gICAgICAgIG5hbWU6IHN0cmluZztcclxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgICAgIGltYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgY3JlYXRlTmV3KGNvbnRleHQ6IFRlbXBsYXRlVUlDb250ZXh0KTogVGVtcGxhdGVTdGF0ZTtcclxuICAgICAgICBjcmVhdGVVSShjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IEJ1aWxkZXJDb250cm9sW107XHJcbiAgICAgICAgYnVpbGQoZGVzaWduOiBEZXNpZ24sIGNvbnRleHQ6IFRlbXBsYXRlQnVpbGRDb250ZXh0KTogUHJvbWlzZTxwYXBlci5JdGVtPjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlVUlDb250ZXh0IHtcclxuICAgICAgICByZW5kZXJEZXNpZ24oZGVzaWduOiBEZXNpZ24sIGNhbGxiYWNrOiAoaW1hZ2VEYXRhVXJsOiBzdHJpbmcpID0+IHZvaWQpO1xyXG4gICAgICAgIGZvbnRDYXRhbG9nOiBGb250U2hhcGUuRm9udENhdGFsb2c7XHJcbiAgICAgICAgY3JlYXRlRm9udENob29zZXIoKTogQnVpbGRlckNvbnRyb2w7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGVCdWlsZENvbnRleHQge1xyXG4gICAgICAgIGdldEZvbnQoZGVzYzogRm9udFNoYXBlLkZvbnRTcGVjaWZpZXIpOiBQcm9taXNlPG9wZW50eXBlLkZvbnQ+O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlU3RhdGUge1xyXG4gICAgICAgIGRlc2lnbjogRGVzaWduO1xyXG4gICAgICAgIGZvbnRDYXRlZ29yeT86IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlU3RhdGVDaGFuZ2Uge1xyXG4gICAgICAgIGRlc2lnbj86IERlc2lnbjtcclxuICAgICAgICBmb250Q2F0ZWdvcnk/OiBzdHJpbmc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVzaWduIHtcclxuICAgICAgICBjb250ZW50PzogYW55O1xyXG4gICAgICAgIHNoYXBlPzogc3RyaW5nO1xyXG4gICAgICAgIGZvbnQ/OiBGb250U2hhcGUuRm9udFNwZWNpZmllcjtcclxuICAgICAgICBwYWxldHRlPzogRGVzaWduUGFsZXR0ZTtcclxuICAgICAgICBzZWVkPzogbnVtYmVyO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIERlc2lnblBhbGV0dGUge1xyXG4gICAgICAgIGNvbG9yPzogc3RyaW5nO1xyXG4gICAgICAgIGludmVydD86IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBEZXNpZ25DaGFuZ2UgZXh0ZW5kcyBEZXNpZ257XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyUmVxdWVzdCB7XHJcbiAgICAgICAgZGVzaWduOiBEZXNpZ247XHJcbiAgICAgICAgYXJlYT86IG51bWJlcjtcclxuICAgICAgICBjYWxsYmFjazogKGltYWdlRGF0YVVybDogc3RyaW5nKSA9PiB2b2lkO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJ1aWxkZXJDb250cm9sIHtcclxuICAgICAgICB2YWx1ZSQ6IFJ4Lk9ic2VydmFibGU8VGVtcGxhdGVTdGF0ZUNoYW5nZT47XHJcbiAgICAgICAgY3JlYXRlTm9kZSh2YWx1ZTogVGVtcGxhdGVTdGF0ZSk6IFZOb2RlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFZhbHVlQ29udHJvbDxUPiB7XHJcbiAgICAgICAgdmFsdWUkOiBSeC5PYnNlcnZhYmxlPFQ+O1xyXG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU/OiBUKTogVk5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBPcHRpb25DaG9vc2VyPFQ+IHtcclxuICAgICAgICB2YWx1ZSQ6IFJ4Lk9ic2VydmFibGU8VD47XHJcbiAgICAgICAgY3JlYXRlTm9kZShjaG9pY2VzOiBUW10sIHZhbHVlPzogVCk6IFZOb2RlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBleHBvcnQgaW50ZXJmYWNlIFZOb2RlQ2hvb3NlciB7XHJcbiAgICAvLyAgICAgY3JlYXRlTm9kZShjaG9pY2VzOiBWTm9kZVtdLCBjaG9zZW5LZXk6IHN0cmluZyk6IFZOb2RlO1xyXG4gICAgLy8gICAgIGNob3NlbiQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+O1xyXG4gICAgLy8gfVxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG4gICAgXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIENvbnRyb2xIZWxwZXJzIHtcclxuICAgICAgICBcclxuICAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGNob29zZXI8VD4oXHJcbiAgICAgICAgICAgICBjaG9pY2VzOiBDaG9pY2VbXSlcclxuICAgICAgICAgICAgIDogVk5vZGV7XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwidWwuY2hvb3NlclwiLFxyXG4gICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzLm1hcChjaG9pY2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoKFwibGkuY2hvaWNlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvc2VuOiBjaG9pY2UuY2hvc2VuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9pY2UuY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjaG9pY2Uubm9kZV0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDaG9pY2Uge1xyXG4gICAgICAgICAgICAgbm9kZTogVk5vZGUsIFxyXG4gICAgICAgICAgICAgY2hvc2VuPzogYm9vbGVhbiwgXHJcbiAgICAgICAgICAgICBjYWxsYmFjaz86ICgpID0+IHZvaWRcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRm9udENob29zZXIgaW1wbGVtZW50cyBWYWx1ZUNvbnRyb2w8Rm9udENob29zZXJTdGF0ZT4ge1xyXG5cclxuICAgICAgICBwcml2YXRlIGZvbnRDYXRhbG9nOiBGb250U2hhcGUuRm9udENhdGFsb2c7XHJcbiAgICAgICAgcHJpdmF0ZSBfdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8Rm9udENob29zZXJTdGF0ZT4oKTtcclxuXHJcbiAgICAgICAgbWF4RmFtaWxpZXMgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihmb250Q2F0YWxvZzogRm9udFNoYXBlLkZvbnRDYXRhbG9nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udENhdGFsb2cgPSBmb250Q2F0YWxvZztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHByZWxvYWRGYW1pbGllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0Q2F0ZWdvcmllcygpXHJcbiAgICAgICAgICAgICAgICAubWFwKGMgPT4gZm9udENhdGFsb2cuZ2V0RmFtaWxpZXMoYylbMF0pO1xyXG4gICAgICAgICAgICBGb250U2hhcGUuRm9udENhdGFsb2cubG9hZFByZXZpZXdTdWJzZXRzKHByZWxvYWRGYW1pbGllcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdmFsdWUkKCk6IFJ4Lk9ic2VydmFibGU8Rm9udENob29zZXJTdGF0ZT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWUkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3JlYXRlTm9kZSh2YWx1ZT86IEZvbnRDaG9vc2VyU3RhdGUpOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuOiBWTm9kZVtdID0gW107XHJcblxyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGgoXCJoM1wiLCBbXCJGb250IENhdGVnb3JpZXNcIl0pKTtcclxuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcmllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0Q2F0ZWdvcmllcygpO1xyXG4gICAgICAgICAgICBjb25zdCBjYXRlZ29yeUNob2ljZXMgPSBjYXRlZ29yaWVzLm1hcChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2F0ZWdvcnlGYW1pbGllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0RmFtaWxpZXMoY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4RmFtaWxpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeUZhbWlsaWVzID0gY2F0ZWdvcnlGYW1pbGllcy5zbGljZSgwLCB0aGlzLm1heEZhbWlsaWVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0RmFtaWx5ID0gY2F0ZWdvcnlGYW1pbGllc1swXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcclxuICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwic3BhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogRm9udEhlbHBlcnMuZ2V0Q3NzU3R5bGUoZmlyc3RGYW1pbHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjYXRlZ29yeV0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGNob3NlbjogdmFsdWUuY2F0ZWdvcnkgPT09IGNhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5sb2FkUHJldmlld1N1YnNldHMoY2F0ZWdvcnlGYW1pbGllcyk7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZSQub25OZXh0KHsgY2F0ZWdvcnksIGZhbWlseTogZmlyc3RGYW1pbHkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChDb250cm9sSGVscGVycy5jaG9vc2VyKGNhdGVnb3J5Q2hvaWNlcykpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlLmNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGgoXCJoM1wiLCB7fSwgW1wiRm9udHNcIl0pKTtcclxuICAgICAgICAgICAgICAgIGxldCBmYW1pbGllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0RmFtaWxpZXModmFsdWUuY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4RmFtaWxpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmYW1pbGllcyA9IGZhbWlsaWVzLnNsaWNlKDAsIHRoaXMubWF4RmFtaWxpZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZmFtaWx5T3B0aW9ucyA9IGZhbWlsaWVzLm1hcChmYW1pbHkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogaChcInNwYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogRm9udEhlbHBlcnMuZ2V0Q3NzU3R5bGUoZmFtaWx5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtmYW1pbHldKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hvc2VuOiB2YWx1ZS5mYW1pbHkgPT09IGZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuX3ZhbHVlJC5vbk5leHQoeyBmYW1pbHksIHZhcmlhbnQ6IFwiXCIgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goQ29udHJvbEhlbHBlcnMuY2hvb3NlcihmYW1pbHlPcHRpb25zKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5mYW1pbHkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhbnRzID0gdGhpcy5mb250Q2F0YWxvZy5nZXRWYXJpYW50cyh2YWx1ZS5mYW1pbHkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhcmlhbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGgoXCJoM1wiLCB7fSwgW1wiRm9udCBTdHlsZXNcIl0pKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFyaWFudE9wdGlvbnMgPSB2YXJpYW50cy5tYXAodmFyaWFudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGgoXCJzcGFuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogRm9udEhlbHBlcnMuZ2V0Q3NzU3R5bGUodmFsdWUuZmFtaWx5LCB2YXJpYW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3ZhcmlhbnRdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3NlbjogdmFsdWUudmFyaWFudCA9PT0gdmFyaWFudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLl92YWx1ZSQub25OZXh0KHsgdmFyaWFudCB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChDb250cm9sSGVscGVycy5jaG9vc2VyKHZhcmlhbnRPcHRpb25zKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2LmZvbnRDaG9vc2VyXCIsIHt9LCBjaGlsZHJlbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRm9udENob29zZXJTdGF0ZSB7XHJcbiAgICAgICAgY2F0ZWdvcnk/OiBzdHJpbmc7XHJcbiAgICAgICAgZmFtaWx5Pzogc3RyaW5nO1xyXG4gICAgICAgIHZhcmlhbnQ/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBJbWFnZUNob29zZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9jaG9zZW4kID0gbmV3IFJ4LlN1YmplY3Q8SW1hZ2VDaG9pY2U+KCk7XHJcblxyXG4gICAgICAgIGNyZWF0ZU5vZGUob3B0aW9uczogSW1hZ2VDaG9vc2VyT3B0aW9ucyk6IFZOb2RlIHtcclxuICAgICAgICAgICAgY29uc3QgY2hvaWNlTm9kZXMgPSBvcHRpb25zLmNob2ljZXMubWFwKGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGltZzogVk5vZGU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbkNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nob3NlbiQub25OZXh0KGMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBvcHRpb25zLmNob3NlbiA9PT0gYy52YWx1ZSBcclxuICAgICAgICAgICAgICAgICAgICA/IFwiaW1nLmNob3NlblwiIFxyXG4gICAgICAgICAgICAgICAgICAgIDogXCJpbWdcIjtcclxuICAgICAgICAgICAgICAgIGlmIChjLmxvYWRJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWdFbG07XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nID0gaChzZWxlY3RvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogb25DbGlja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBraWNrIG9mZiBpbWFnZSBsb2FkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiB2bm9kZSA9PiBjLmxvYWRJbWFnZSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpbWcgPSBoKHNlbGVjdG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY6IGMuaW1hZ2VVcmxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBvbkNsaWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJsaVwiLCB7fSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIGltZ1xyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBoKFwidWwuY2hvb3NlclwiLCB7fSwgY2hvaWNlTm9kZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGNob3NlbiQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaG9zZW4kO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbWFnZUNob29zZXJPcHRpb25zIHtcclxuICAgICAgICBjaG9pY2VzOiBJbWFnZUNob2ljZVtdLFxyXG4gICAgICAgIGNob3Nlbj86IHN0cmluZ1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1hZ2VDaG9pY2Uge1xyXG4gICAgICAgIHZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgbGFiZWw6IHN0cmluZztcclxuICAgICAgICBpbWFnZVVybD86IHN0cmluZztcclxuICAgICAgICBsb2FkSW1hZ2U/OiAoZWxlbWVudDogSFRNTEltYWdlRWxlbWVudCkgPT4gdm9pZDtcclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRlbXBsYXRlRm9udENob29zZXIgaW1wbGVtZW50cyBCdWlsZGVyQ29udHJvbHtcclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIF9mb250Q2hvb3NlcjogRm9udENob29zZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRDaG9vc2VyID0gbmV3IEZvbnRDaG9vc2VyKHN0b3JlLmZvbnRDYXRhbG9nKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRDaG9vc2VyLm1heEZhbWlsaWVzID0gMTU7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjcmVhdGVOb2RlKHZhbHVlOiBUZW1wbGF0ZVN0YXRlKTogVk5vZGUge1xyXG4gICAgICAgICAgICBjb25zdCBmb250ID0gdmFsdWUuZGVzaWduICYmIHZhbHVlLmRlc2lnbi5mb250O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udENob29zZXIuY3JlYXRlTm9kZSg8Rm9udENob29zZXJTdGF0ZT57XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogdmFsdWUuZm9udENhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgZmFtaWx5OiBmb250ICYmIGZvbnQuZmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgdmFyaWFudDogZm9udCAmJiBmb250LnZhcmlhbnRcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0IHZhbHVlJCgpOiBSeC5PYnNlcnZhYmxlPFRlbXBsYXRlU3RhdGU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRDaG9vc2VyLnZhbHVlJC5tYXAoY2hvaWNlID0+IDxUZW1wbGF0ZVN0YXRlPntcclxuICAgICAgICAgICAgICAgIGZvbnRDYXRlZ29yeTogY2hvaWNlLmNhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgZGVzaWduOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYW1pbHk6IGNob2ljZS5mYW1pbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ6IGNob2ljZS52YXJpYW50XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9IFxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dElucHV0IGltcGxlbWVudHMgVmFsdWVDb250cm9sPHN0cmluZz4ge1xyXG5cclxuICAgICAgICBwcml2YXRlIF92YWx1ZSQgPSBuZXcgUnguU3ViamVjdDxzdHJpbmc+KCk7XHJcblxyXG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU/OiBzdHJpbmcsIHBsYWNlaG9sZGVyPzogc3RyaW5nLCB0ZXh0YXJlYT86IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoXCJ0ZXh0YXJlYVwiID8gXCJ0ZXh0YXJlYVwiIDogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRleHRhcmVhID8gdW5kZWZpbmVkIDogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlclxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2OiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGV2LndoaWNoIHx8IGV2LmtleUNvZGUpID09PSBEb21IZWxwZXJzLktleUNvZGVzLkVudGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IDxIVE1MSW5wdXRFbGVtZW50PmV2LnRhcmdldDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5ibHVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZSQub25OZXh0KGV2LnRhcmdldC52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW11cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB2YWx1ZSQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZSQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyLlRlbXBsYXRlcyB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIERpY2tlbnMgaW1wbGVtZW50cyBTa2V0Y2hCdWlsZGVyLlRlbXBsYXRlIHtcclxuXHJcbiAgICAgICAgbmFtZSA9IFwiRGlja2Vuc1wiO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlN0YWNrIGJsb2NrcyBvZiB0ZXh0IGluIHRoZSBmb3JtIG9mIGEgd2F2eSBsYWRkZXIuXCI7XHJcbiAgICAgICAgaW1hZ2U6IHN0cmluZztcclxuICAgICAgICBsaW5lSGVpZ2h0VmFyaWF0aW9uID0gMC44O1xyXG4gICAgICAgIGRlZmF1bHRGb250U2l6ZSA9IDEyODtcclxuICAgICAgICBtYXJnaW5GYWN0b3IgPSAwLjE0O1xyXG5cclxuICAgICAgICBjcmVhdGVOZXcoY29udGV4dDogVGVtcGxhdGVVSUNvbnRleHQpOiBUZW1wbGF0ZVN0YXRlIHtcclxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdEZvbnRSZWNvcmQgPSBjb250ZXh0LmZvbnRDYXRhbG9nLmdldExpc3QoMSlbMF07XHJcbiAgICAgICAgICAgIHJldHVybiA8VGVtcGxhdGVTdGF0ZT57XHJcbiAgICAgICAgICAgICAgICBkZXNpZ246IHtcclxuICAgICAgICAgICAgICAgICAgICBzaGFwZTogXCJuYXJyb3dcIixcclxuICAgICAgICAgICAgICAgICAgICBmb250OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbWlseTogZGVmYXVsdEZvbnRSZWNvcmQuZmFtaWx5XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzZWVkOiBNYXRoLnJhbmRvbSgpXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZm9udENhdGVnb3J5OiBkZWZhdWx0Rm9udFJlY29yZC5jYXRlZ29yeVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjcmVhdGVVSShjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IEJ1aWxkZXJDb250cm9sW10ge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUZXh0RW50cnkoKSxcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhcGVDaG9vc2VyKGNvbnRleHQpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVWYXJpYXRpb25Db250cm9sKCksXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmNyZWF0ZUZvbnRDaG9vc2VyKCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVBhbGV0dGVDaG9vc2VyKClcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJ1aWxkKGRlc2lnbjogRGVzaWduLCBjb250ZXh0OiBUZW1wbGF0ZUJ1aWxkQ29udGV4dCk6IFByb21pc2U8cGFwZXIuSXRlbT4ge1xyXG4gICAgICAgICAgICBpZiAoIWRlc2lnbi5jb250ZW50IHx8ICFkZXNpZ24uY29udGVudC50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5nZXRGb250KGRlc2lnbi5mb250KS50aGVuKGZvbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd29yZHMgPSBkZXNpZ24uY29udGVudC50ZXh0LnRvTG9jYWxlVXBwZXJDYXNlKCkuc3BsaXQoL1xccy8pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZWRSYW5kb20gPSBuZXcgRnJhbWV3b3JrLlNlZWRSYW5kb20oXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzaWduLnNlZWQgPT0gbnVsbCA/IE1hdGgucmFuZG9tKCkgOiBkZXNpZ24uc2VlZCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0TGVuZ3RoOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGRlc2lnbi5zaGFwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJiYWxhbmNlZFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZW5ndGggPSAyICogTWF0aC5zcXJ0KF8uc3VtKHdvcmRzLm1hcCh3ID0+IHcubGVuZ3RoICsgMSkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIndpZGVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbnVtTGluZXMgPSAzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlbmd0aCA9IF8uc3VtKHdvcmRzLm1hcCh3ID0+IHcubGVuZ3RoICsgMSkpIC8gbnVtTGluZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlbmd0aCA9IDxudW1iZXI+Xy5tYXgod29yZHMubWFwKHcgPT4gdy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRMZW5ndGggKj0gKDEgKyBzZWVkUmFuZG9tLnJhbmRvbSgpICogMC41KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gdGhpcy5iYWxhbmNlTGluZXMod29yZHMsIHRhcmdldExlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHRleHRDb2xvciA9IGRlc2lnbi5wYWxldHRlICYmIGRlc2lnbi5wYWxldHRlLmNvbG9yIHx8IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGVzaWduLnBhbGV0dGUgJiYgZGVzaWduLnBhbGV0dGUuaW52ZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgW3RleHRDb2xvciwgYmFja2dyb3VuZENvbG9yXSA9IFtiYWNrZ3JvdW5kQ29sb3IsIHRleHRDb2xvcl07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYm94ID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlVGV4dEJsb2NrID0gKHM6IHN0cmluZywgc2l6ZSA9IHRoaXMuZGVmYXVsdEZvbnRTaXplKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBmb250LmdldFBhdGgocywgMCwgMCwgc2l6ZSkudG9QYXRoRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsYXlvdXRJdGVtcyA9IGxpbmVzLm1hcChsaW5lID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jazogY3JlYXRlVGV4dEJsb2NrKGxpbmUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF4V2lkdGggPSBfLm1heChsYXlvdXRJdGVtcy5tYXAoYiA9PiBiLmJsb2NrLmJvdW5kcy53aWR0aCkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXJyYW5nZVBhdGhQb2ludHMgPSBNYXRoLm1pbig0LCBNYXRoLnJvdW5kKG1heFdpZHRoIC8gMikpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGluZUhlaWdodCA9IGxheW91dEl0ZW1zWzBdLmJsb2NrLmJvdW5kcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHVwcGVyID0gbmV3IHBhcGVyLlBhdGgoW1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLCAwKSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQobWF4V2lkdGgsIDApXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIGxldCBsb3dlcjogcGFwZXIuUGF0aDtcclxuICAgICAgICAgICAgICAgIGxldCByZW1haW5pbmcgPSBsYXlvdXRJdGVtcy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBsYXlvdXRJdGVtIG9mIGxheW91dEl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKC0tcmVtYWluaW5nIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWlkID0gdXBwZXIuYm91bmRzLmNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGFzdCBsb3dlciBsaW5lIGlzIGxldmVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VyID0gbmV3IHBhcGVyLlBhdGgoW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsIG1pZC55ICsgbGluZUhlaWdodCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQobWF4V2lkdGgsIG1pZC55ICsgbGluZUhlaWdodClcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG93ZXIgPSB0aGlzLnJhbmRvbUxvd2VyUGF0aEZvcih1cHBlciwgbGluZUhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmFuZ2VQYXRoUG9pbnRzLCBzZWVkUmFuZG9tKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RyZXRjaCA9IG5ldyBGb250U2hhcGUuVmVydGljYWxCb3VuZHNTdHJldGNoUGF0aChcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0SXRlbS5ibG9jayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB1cHBlciwgbG93ZXIgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyZXRjaC5maWxsQ29sb3IgPSB0ZXh0Q29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LmFkZENoaWxkKHN0cmV0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwcGVyID0gbG93ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgbG93ZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkZXNpZ24uY29udGVudC5zb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2VCbG9jayA9IGNyZWF0ZVRleHRCbG9jayhkZXNpZ24uY29udGVudC5zb3VyY2UsIHRoaXMuZGVmYXVsdEZvbnRTaXplICogMC4zMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlQmxvY2suZmlsbENvbG9yID0gdGV4dENvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2NrLnRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXIuYm91bmRzLmJvdHRvbUxlZnQuYWRkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFdpZHRoIC0gc291cmNlQmxvY2suYm91bmRzLndpZHRoLCAvLyByaWdodC1hbGlnblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2NrLmJvdW5kcy5oZWlnaHQgKiAxLjEgLy8gc2hpZnQgaGVpZ2h0IHBsdXMgdG9wIG1hcmdpblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihzb3VyY2VCbG9jay5ib3VuZHMubGVmdCA8IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGp1c3QgZm9yIGxvbmcgc291cmNlIGxpbmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlQmxvY2suYm91bmRzLmxlZnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBib3guYWRkQ2hpbGQoc291cmNlQmxvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IGJveC5ib3VuZHMuY2xvbmUoKTtcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5zaXplID0gYm91bmRzLnNpemUubXVsdGlwbHkoMSArIHRoaXMubWFyZ2luRmFjdG9yKTtcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5jZW50ZXIgPSBib3guYm91bmRzLmNlbnRlcjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSBwYXBlci5TaGFwZS5SZWN0YW5nbGUoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQuZmlsbENvbG9yID0gYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICAgICAgYm94Lmluc2VydENoaWxkKDAsIGJhY2tncm91bmQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBib3g7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSByYW5kb21Mb3dlclBhdGhGb3IoXHJcbiAgICAgICAgICAgIHVwcGVyOiBwYXBlci5QYXRoLFxyXG4gICAgICAgICAgICBhdmdIZWlnaHQ6IG51bWJlcixcclxuICAgICAgICAgICAgbnVtUG9pbnRzLFxyXG4gICAgICAgICAgICBzZWVkUmFuZG9tOiBGcmFtZXdvcmsuU2VlZFJhbmRvbVxyXG4gICAgICAgICk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgICAgICBjb25zdCBwb2ludHM6IHBhcGVyLlBvaW50W10gPSBbXTtcclxuICAgICAgICAgICAgbGV0IHVwcGVyQ2VudGVyID0gdXBwZXIuYm91bmRzLmNlbnRlcjtcclxuICAgICAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVBvaW50czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gdXBwZXJDZW50ZXIueSArIChzZWVkUmFuZG9tLnJhbmRvbSgpIC0gMC41KSAqIHRoaXMubGluZUhlaWdodFZhcmlhdGlvbiAqIGF2Z0hlaWdodDtcclxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKG5ldyBwYXBlci5Qb2ludCh4LCB5KSk7XHJcbiAgICAgICAgICAgICAgICB4ICs9IHVwcGVyLmJvdW5kcy53aWR0aCAvIChudW1Qb2ludHMgLSAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbmV3IHBhcGVyLlBhdGgocG9pbnRzKTtcclxuICAgICAgICAgICAgcGF0aC5zbW9vdGgoKTtcclxuICAgICAgICAgICAgcGF0aC5ib3VuZHMuY2VudGVyID0gdXBwZXIuYm91bmRzLmNlbnRlci5hZGQobmV3IHBhcGVyLlBvaW50KDAsIGF2Z0hlaWdodCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYmFsYW5jZUxpbmVzKHdvcmRzOiBzdHJpbmdbXSwgdGFyZ2V0TGVuZ3RoOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGNTY29yZSA9ICh0ZXh0OiBzdHJpbmcpID0+XHJcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhNYXRoLmFicyh0YXJnZXRMZW5ndGggLSB0ZXh0Lmxlbmd0aCksIDIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRMaW5lID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRTY29yZSA9IDEwMDAwO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKHdvcmRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd29yZCA9IHdvcmRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdMaW5lID0gY3VycmVudExpbmUgKyBcIiBcIiArIHdvcmQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdTY29yZSA9IGNhbGNTY29yZShuZXdMaW5lKTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TGluZSAmJiBuZXdTY29yZSA8PSBjdXJyZW50U2NvcmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBhcHBlbmRcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TGluZSArPSBcIiBcIiArIHdvcmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjb3JlID0gbmV3U2NvcmU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG5ldyBsaW5lXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRMaW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goY3VycmVudExpbmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IHdvcmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjb3JlID0gY2FsY1Njb3JlKGN1cnJlbnRMaW5lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsaW5lcy5wdXNoKGN1cnJlbnRMaW5lKTtcclxuICAgICAgICAgICAgcmV0dXJuIGxpbmVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVUZXh0RW50cnkoKTogQnVpbGRlckNvbnRyb2wge1xyXG4gICAgICAgICAgICBjb25zdCBtYWluVGV4dElucHV0ID0gbmV3IFRleHRJbnB1dCgpO1xyXG4gICAgICAgICAgICBjb25zdCBzb3VyY2VUZXh0SW5wdXQgPSBuZXcgVGV4dElucHV0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVOb2RlOiAodmFsdWU6IFRlbXBsYXRlU3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaDNcIiwge30sIFtcIk1lc3NhZ2VcIl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpblRleHRJbnB1dC5jcmVhdGVOb2RlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICYmIHZhbHVlLmRlc2lnbi5jb250ZW50ICYmIHZhbHVlLmRlc2lnbi5jb250ZW50LnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJXaGF0IGRvIHlvdSB3YW50IHRvIHNheT9cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVRleHRJbnB1dC5jcmVhdGVOb2RlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICYmIHZhbHVlLmRlc2lnbi5jb250ZW50ICYmIHZhbHVlLmRlc2lnbi5jb250ZW50LnNvdXJjZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlNvdXJjZSAoYXV0aG9yLCBwYXNzYWdlLCBldGMpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWUkOiBSeC5PYnNlcnZhYmxlLm1lcmdlKFxyXG4gICAgICAgICAgICAgICAgICAgIG1haW5UZXh0SW5wdXQudmFsdWUkLm1hcCh0ID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPnsgZGVzaWduOiB7IGNvbnRlbnQ6IHsgdGV4dDogdCB9IH0gfSlcclxuICAgICAgICAgICAgICAgICAgICAsIHNvdXJjZVRleHRJbnB1dC52YWx1ZSQubWFwKHQgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFRlbXBsYXRlU3RhdGVDaGFuZ2U+eyBkZXNpZ246IHsgY29udGVudDogeyBzb3VyY2U6IHQgfSB9IH0pXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlU2hhcGVDaG9vc2VyKGNvbnRleHQ6IFRlbXBsYXRlVUlDb250ZXh0KTogQnVpbGRlckNvbnRyb2wge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSQgPSBuZXcgUnguU3ViamVjdDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPigpO1xyXG4gICAgICAgICAgICByZXR1cm4gPEJ1aWxkZXJDb250cm9sPntcclxuICAgICAgICAgICAgICAgIGNyZWF0ZU5vZGU6ICh0czogVGVtcGxhdGVTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlcyA9IFtcIm5hcnJvd1wiXTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBiYWxhbmNlZCBvbmx5IGF2YWlsYWJsZSBmb3IgPj0gTiB3b3Jkc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cy5kZXNpZ24uY29udGVudCAmJiB0cy5kZXNpZ24uY29udGVudC50ZXh0ICYmIHRzLmRlc2lnbi5jb250ZW50LnRleHQuc3BsaXQoL1xccy8pLmxlbmd0aCA+PSA3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlcy5wdXNoKFwiYmFsYW5jZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlcy5wdXNoKFwid2lkZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaG9pY2VzID0gc2hhcGVzLm1hcChzaGFwZSA9PiA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogaChcInNwYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3NoYXBlXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob3NlbjogdHMuZGVzaWduLnNoYXBlID09PSBzaGFwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlJC5vbk5leHQoeyBkZXNpZ246IHsgc2hhcGUgfSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaDNcIiwge30sIFtcIlNoYXBlXCJdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbnRyb2xIZWxwZXJzLmNob29zZXIoY2hvaWNlcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbHVlJDogdmFsdWUkLmFzT2JzZXJ2YWJsZSgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVZhcmlhdGlvbkNvbnRyb2woKTogQnVpbGRlckNvbnRyb2wge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSQgPSBuZXcgUnguU3ViamVjdDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPigpO1xyXG4gICAgICAgICAgICByZXR1cm4gPEJ1aWxkZXJDb250cm9sPntcclxuICAgICAgICAgICAgICAgIGNyZWF0ZU5vZGU6ICh0czogVGVtcGxhdGVTdGF0ZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBidXR0b24gPSBoKFwiYnV0dG9uLmJ0blwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB2YWx1ZSQub25OZXh0KHsgZGVzaWduOiB7IHNlZWQ6IE1hdGgucmFuZG9tKCkgfSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCJOZXh0XCJdXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImgzXCIsIHt9LCBbXCJWYXJpYXRpb25cIl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSQ6IHZhbHVlJC5hc09ic2VydmFibGUoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVQYWxldHRlQ2hvb3NlcigpOiBCdWlsZGVyQ29udHJvbCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZENvbG9ycyA9IHRoaXMucGFsZXR0ZUNvbG9ycy5tYXAoYyA9PiBuZXcgcGFwZXIuQ29sb3IoYykpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xvcnMgPSBfLnNvcnRCeShwYXJzZWRDb2xvcnMsIGMgPT4gYy5odWUpXHJcbiAgICAgICAgICAgICAgICAubWFwKGMgPT4gYy50b0NTUyh0cnVlKSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSQgPSBuZXcgUnguU3ViamVjdDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPigpO1xyXG4gICAgICAgICAgICByZXR1cm4gPEJ1aWxkZXJDb250cm9sPntcclxuICAgICAgICAgICAgICAgIGNyZWF0ZU5vZGU6ICh0czogVGVtcGxhdGVTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhbGV0dGUgPSB0cy5kZXNpZ24ucGFsZXR0ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaG9pY2VzID0gY29sb3JzLm1hcChjb2xvciA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGgoXCJkaXYucGFsZXR0ZVRpbGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3NlbjogcGFsZXR0ZSAmJiBwYWxldHRlLmNvbG9yID09PSBjb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUkLm9uTmV4dCh7IGRlc2lnbjogeyBwYWxldHRlOiB7IGNvbG9yIH0gfSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGludmVydE5vZGUgPSBoKFwiZGl2XCIsIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcImxhYmVsXCIsIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6IHBhbGV0dGUgJiYgcGFsZXR0ZS5pbnZlcnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZXYgPT4gdmFsdWUkLm9uTmV4dCh7IGRlc2lnbjogeyBwYWxldHRlOiB7IGludmVydDogZXYudGFyZ2V0LmNoZWNrZWQgfSB9IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJJbnZlcnQgY29sb3JcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gaChcImRpdi5jb2xvckNob29zZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImgzXCIsIHt9LCBbXCJDb2xvclwiXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb250cm9sSGVscGVycy5jaG9vc2VyKGNob2ljZXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJ0Tm9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWUkOiB2YWx1ZSQuYXNPYnNlcnZhYmxlKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwYWxldHRlQ29sb3JzID0gW1xyXG4gICAgICAgICAgICBcIiM0YjM4MzJcIixcclxuICAgICAgICAgICAgXCIjODU0NDQyXCIsXHJcbiAgICAgICAgICAgIC8vXCIjZmZmNGU2XCIsXHJcbiAgICAgICAgICAgIFwiIzNjMmYyZlwiLFxyXG4gICAgICAgICAgICBcIiNiZTliN2JcIixcclxuXHJcbiAgICAgICAgICAgIFwiIzFiODViOFwiLFxyXG4gICAgICAgICAgICBcIiM1YTUyNTVcIixcclxuICAgICAgICAgICAgXCIjNTU5ZTgzXCIsXHJcbiAgICAgICAgICAgIFwiI2FlNWE0MVwiLFxyXG4gICAgICAgICAgICBcIiNjM2NiNzFcIixcclxuXHJcbiAgICAgICAgICAgIFwiIzBlMWE0MFwiLFxyXG4gICAgICAgICAgICBcIiMyMjJmNWJcIixcclxuICAgICAgICAgICAgXCIjNWQ1ZDVkXCIsXHJcbiAgICAgICAgICAgIFwiIzk0NmIyZFwiLFxyXG4gICAgICAgICAgICBcIiMwMDAwMDBcIixcclxuXHJcbiAgICAgICAgICAgIFwiI2VkYzk1MVwiLFxyXG4gICAgICAgICAgICBcIiNlYjY4NDFcIixcclxuICAgICAgICAgICAgXCIjY2MyYTM2XCIsXHJcbiAgICAgICAgICAgIFwiIzRmMzcyZFwiLFxyXG4gICAgICAgICAgICBcIiMwMGEwYjBcIixcclxuICAgICAgICBdO1xyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRG9jdW1lbnRLZXlIYW5kbGVyIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBub3RlOiB1bmRpc3Bvc2VkIGV2ZW50IHN1YnNjcmlwdGlvblxyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5rZXl1cChmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IERvbUhlbHBlcnMuS2V5Q29kZXMuRXNjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU2tldGNoRWRpdG9yTW9kdWxlIHtcclxuXHJcbiAgICAgICAgYXBwU3RvcmU6IEFwcC5TdG9yZTtcclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgd29ya3NwYWNlQ29udHJvbGxlcjogV29ya3NwYWNlQ29udHJvbGxlcjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoYXBwU3RvcmU6IEFwcC5TdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlID0gYXBwU3RvcmU7XHJcblxyXG4gICAgICAgICAgICBEb21IZWxwZXJzLmluaXRFcnJvckhhbmRsZXIoZXJyb3JEYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShlcnJvckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS9jbGllbnQtZXJyb3JzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBjb250ZW50XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoYXBwU3RvcmUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYmFyID0gbmV3IEVkaXRvckJhcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduZXInKSwgdGhpcy5zdG9yZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbUVkaXRvciA9IG5ldyBTZWxlY3RlZEl0ZW1FZGl0b3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0b3JPdmVybGF5XCIpLCB0aGlzLnN0b3JlKTtcclxuICAgICAgICAgICAgY29uc3QgaGVscERpYWxvZyA9IG5ldyBIZWxwRGlhbG9nKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVscC1kaWFsb2dcIiksIHRoaXMuc3RvcmUpO1xyXG4gICAgICAgICAgICBjb25zdCBvcGVyYXRpb25QYW5lbCA9IG5ldyBPcGVyYXRpb25QYW5lbChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZXJhdGlvblBhbmVsXCIpLCB0aGlzLnN0b3JlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRoaXMuc3RvcmUuZXZlbnRzLnN1YnNjcmliZShtID0+IGNvbnNvbGUubG9nKFwiZXZlbnRcIiwgbS50eXBlLCBtLmRhdGEpKTtcclxuICAgICAgICAgICAgLy8gdGhpcy5zdG9yZS5hY3Rpb25zLnN1YnNjcmliZShtID0+IGNvbnNvbGUubG9nKFwiYWN0aW9uXCIsIG0udHlwZSwgbS5kYXRhKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGFydCgpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZXZlbnRzLmVkaXRvci5mb250TG9hZGVkLm9ic2VydmUoKS5maXJzdCgpLnN1YnNjcmliZShtID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmtzcGFjZUNvbnRyb2xsZXIgPSBuZXcgV29ya3NwYWNlQ29udHJvbGxlcih0aGlzLnN0b3JlLCBtLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3IuaW5pdFdvcmtzcGFjZS5kaXNwYXRjaCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuZXZlbnRzLmVkaXRvci53b3Jrc3BhY2VJbml0aWFsaXplZC5zdWIoKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oXCJiZWZvcmV1bmxvYWRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2hJc0RpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJZb3VyIGxhdGVzdCBjaGFuZ2VzIGFyZSBub3Qgc2F2ZWQgeWV0LlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9wZW5Ta2V0Y2goaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLm9wZW4uZGlzcGF0Y2goaWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTa2V0Y2hIZWxwZXJzIHtcclxuXHJcbiAgICAgICAgc3RhdGljIGNvbG9yc0luVXNlKHNrZXRjaDogU2tldGNoKTogc3RyaW5nW10ge1xyXG4gICAgICAgICAgICBsZXQgY29sb3JzID0gW3NrZXRjaC5iYWNrZ3JvdW5kQ29sb3JdO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIHNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcnMucHVzaChibG9jay5iYWNrZ3JvdW5kQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgY29sb3JzLnB1c2goYmxvY2sudGV4dENvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb2xvcnMgPSBfLnVuaXEoY29sb3JzLmZpbHRlcihjID0+IGMgIT0gbnVsbCkpO1xyXG4gICAgICAgICAgICBjb2xvcnMuc29ydCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29sb3JzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzdGF0aWMgZ2V0U2tldGNoRmlsZU5hbWUoc2tldGNoOiBTa2V0Y2gsIGxlbmd0aDogbnVtYmVyLCBleHRlbnNpb246IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gXCJcIjtcclxuICAgICAgICAgICAgb3V0ZXI6XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmxvY2sgb2Ygc2tldGNoLnRleHRCbG9ja3MpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBibG9jay50ZXh0LnNwbGl0KC9cXHMvKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyaW0gPSB3b3JkLnJlcGxhY2UoL1xcVy9nLCAnJykudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cmltLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGgpIG5hbWUgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgKz0gdHJpbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUubGVuZ3RoID49IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhayBvdXRlcjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFuYW1lLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IFwiZmlkZGxlXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgKyBcIi5cIiArIGV4dGVuc2lvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIlxyXG5uYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBzaW5nbGV0b24gU3RvcmUgY29udHJvbHMgYWxsIGFwcGxpY2F0aW9uIHN0YXRlLlxyXG4gICAgICogTm8gcGFydHMgb3V0c2lkZSBvZiB0aGUgU3RvcmUgbW9kaWZ5IGFwcGxpY2F0aW9uIHN0YXRlLlxyXG4gICAgICogQ29tbXVuaWNhdGlvbiB3aXRoIHRoZSBTdG9yZSBpcyBkb25lIHRocm91Z2ggbWVzc2FnZSBDaGFubmVsczogXHJcbiAgICAgKiAgIC0gQWN0aW9ucyBjaGFubmVsIHRvIHNlbmQgaW50byB0aGUgU3RvcmUsXHJcbiAgICAgKiAgIC0gRXZlbnRzIGNoYW5uZWwgdG8gcmVjZWl2ZSBub3RpZmljYXRpb24gZnJvbSB0aGUgU3RvcmUuXHJcbiAgICAgKiBPbmx5IHRoZSBTdG9yZSBjYW4gcmVjZWl2ZSBhY3Rpb24gbWVzc2FnZXMuXHJcbiAgICAgKiBPbmx5IHRoZSBTdG9yZSBjYW4gc2VuZCBldmVudCBtZXNzYWdlcy5cclxuICAgICAqIFRoZSBTdG9yZSBjYW5ub3Qgc2VuZCBhY3Rpb25zIG9yIGxpc3RlbiB0byBldmVudHMgKHRvIGF2b2lkIGxvb3BzKS5cclxuICAgICAqIE1lc3NhZ2VzIGFyZSB0byBiZSB0cmVhdGVkIGFzIGltbXV0YWJsZS5cclxuICAgICAqIEFsbCBtZW50aW9ucyBvZiB0aGUgU3RvcmUgY2FuIGJlIGFzc3VtZWQgdG8gbWVhbiwgb2YgY291cnNlLFxyXG4gICAgICogICBcIlRoZSBTdG9yZSBhbmQgaXRzIHN1Yi1jb21wb25lbnRzLlwiXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBTdG9yZSB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBCUk9XU0VSX0lEX0tFWSA9IFwiYnJvd3NlcklkXCI7XHJcbiAgICAgICAgc3RhdGljIEZBTExCQUNLX0ZPTlRfVVJMID0gXCIvZm9udHMvUm9ib3RvLTUwMC50dGZcIjtcclxuICAgICAgICBzdGF0aWMgREVGQVVMVF9GT05UX05BTUUgPSBcIlJvYm90b1wiO1xyXG4gICAgICAgIHN0YXRpYyBTS0VUQ0hfTE9DQUxfQ0FDSEVfS0VZID0gXCJmaWRkbGVzdGlja3MuaW8ubGFzdFNrZXRjaFwiO1xyXG4gICAgICAgIHN0YXRpYyBMT0NBTF9DQUNIRV9ERUxBWV9NUyA9IDEwMDA7XHJcbiAgICAgICAgc3RhdGljIFNFUlZFUl9TQVZFX0RFTEFZX01TID0gMTAwMDA7XHJcbiAgICAgICAgc3RhdGljIEdSRUVUSU5HX1NLRVRDSF9JRCA9IFwiaW0yYmE5MmkxNzE0aVwiO1xyXG5cclxuICAgICAgICBmb250TGlzdExpbWl0ID0gMjUwO1xyXG5cclxuICAgICAgICBzdGF0ZTogRWRpdG9yU3RhdGUgPSB7fTtcclxuICAgICAgICByZXNvdXJjZXM6IFN0b3JlUmVzb3VyY2VzID0ge307XHJcbiAgICAgICAgYWN0aW9ucyA9IG5ldyBBY3Rpb25zKCk7XHJcbiAgICAgICAgZXZlbnRzID0gbmV3IEV2ZW50cygpO1xyXG5cclxuICAgICAgICBwcml2YXRlIGFwcFN0b3JlOiBBcHAuU3RvcmU7XHJcbiAgICAgICAgcHJpdmF0ZSBfb3BlcmF0aW9uJCA9IG5ldyBSeC5TdWJqZWN0PE9wZXJhdGlvbj4oKTtcclxuICAgICAgICBwcml2YXRlIF90cmFuc3BhcmVuY3kkID0gbmV3IFJ4LlN1YmplY3Q8Ym9vbGVhbj4oKTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoYXBwU3RvcmU6IEFwcC5TdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlID0gYXBwU3RvcmU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldHVwU3RhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0dXBTdWJzY3JpcHRpb25zKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxvYWRSZXNvdXJjZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldHVwU3RhdGUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuYnJvd3NlcklkID0gQ29va2llcy5nZXQoU3RvcmUuQlJPV1NFUl9JRF9LRVkpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYnJvd3NlcklkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmJyb3dzZXJJZCA9IEZyYW1ld29yay5uZXdpZCgpO1xyXG4gICAgICAgICAgICAgICAgQ29va2llcy5zZXQoU3RvcmUuQlJPV1NFUl9JRF9LRVksIHRoaXMuc3RhdGUuYnJvd3NlcklkLCB7IGV4cGlyZXM6IDIgKiAzNjUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldHVwU3Vic2NyaXB0aW9ucygpIHtcclxuICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuYWN0aW9ucywgZXZlbnRzID0gdGhpcy5ldmVudHM7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBBcHAgLS0tLS1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUuZXZlbnRzLnJvdXRlQ2hhbmdlZC5zdWIocm91dGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm91dGVTa2V0Y2hJZCA9IHJvdXRlLnBhcmFtcy5za2V0Y2hJZDtcclxuICAgICAgICAgICAgICAgIGlmIChyb3V0ZS5uYW1lID09PSBcInNrZXRjaFwiICYmIHJvdXRlU2tldGNoSWQgIT09IHRoaXMuc3RhdGUuc2tldGNoLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlblNrZXRjaChyb3V0ZVNrZXRjaElkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBFZGl0b3IgLS0tLS1cclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmluaXRXb3Jrc3BhY2Uub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgICAgICAucGF1c2FibGVCdWZmZXJlZChldmVudHMuZWRpdG9yLnJlc291cmNlc1JlYWR5Lm9ic2VydmUoKS5tYXAobSA9PiBtLmRhdGEpKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBza2V0Y2hJZCA9IHRoaXMuYXBwU3RvcmUuc3RhdGUucm91dGUucGFyYW1zLnNrZXRjaElkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IHRoaXMuYXBwU3RvcmUuc3RhdGUubGFzdFNhdmVkU2tldGNoSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb21pc2U6IEpRdWVyeVByb21pc2U8YW55PjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2tldGNoSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9IHRoaXMub3BlblNrZXRjaChza2V0Y2hJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9IHRoaXMubG9hZEdyZWV0aW5nU2tldGNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbigoKSA9PiBldmVudHMuZWRpdG9yLndvcmtzcGFjZUluaXRpYWxpemVkLmRpc3BhdGNoKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBvbiBhbnkgYWN0aW9uLCB1cGRhdGUgc2F2ZSBkZWxheSB0aW1lclxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5vYnNlcnZlKCkuZGVib3VuY2UoU3RvcmUuU0VSVkVSX1NBVkVfREVMQVlfTVMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2tldGNoID0gdGhpcy5zdGF0ZS5za2V0Y2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHNrZXRjaC5faWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBza2V0Y2gudGV4dEJsb2Nrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVTa2V0Y2goc2tldGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmxvYWRGb250LnN1YnNjcmliZShtID0+XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcy5wYXJzZWRGb250cy5nZXQobS5kYXRhKSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci56b29tVG9GaXQuZm9yd2FyZChcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5lZGl0b3Iuem9vbVRvRml0UmVxdWVzdGVkKTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmV4cG9ydFBORy5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLmV4cG9ydFBOR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmV4cG9ydFNWRy5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLmV4cG9ydFNWR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLnZpZXdDaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5lZGl0b3Iudmlld0NoYW5nZWQuZGlzcGF0Y2gobS5kYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci51cGRhdGVTbmFwc2hvdC5zdWIoKHtza2V0Y2hJZCwgcG5nRGF0YVVybH0pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChza2V0Y2hJZCA9PT0gdGhpcy5zdGF0ZS5za2V0Y2guX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBza2V0Y2hJZCArIFwiLnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBEb21IZWxwZXJzLmRhdGFVUkxUb0Jsb2IocG5nRGF0YVVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgUzNBY2Nlc3MucHV0RmlsZShmaWxlTmFtZSwgXCJpbWFnZS9wbmdcIiwgYmxvYik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3IudG9nZ2xlSGVscC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zaG93SGVscCA9ICF0aGlzLnN0YXRlLnNob3dIZWxwO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLmVkaXRvci5zaG93SGVscENoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5zaG93SGVscCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3Iub3BlblNhbXBsZS5zdWIoKCkgPT4gdGhpcy5sb2FkR3JlZXRpbmdTa2V0Y2goKSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBTa2V0Y2ggLS0tLS1cclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLm9wZW4uc3ViKGlkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblNrZXRjaChpZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guY3JlYXRlLnN1YigoYXR0cikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdTa2V0Y2goYXR0cik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guY2xlYXIuc3ViKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJTa2V0Y2goKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLmNsb25lLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9uZSA9IF8uY2xvbmUodGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgY2xvbmUuX2lkID0gRnJhbWV3b3JrLm5ld2lkKCk7XHJcbiAgICAgICAgICAgICAgICBjbG9uZS5icm93c2VySWQgPSB0aGlzLnN0YXRlLmJyb3dzZXJJZDtcclxuICAgICAgICAgICAgICAgIGNsb25lLnNhdmVkQXQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKGNsb25lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmNsb25lZC5kaXNwYXRjaChjbG9uZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1bHNlVXNlck1lc3NhZ2UoXCJEdXBsaWNhdGVkIHNrZXRjaC4gQWRkcmVzcyBvZiB0aGlzIHBhZ2UgaGFzIGJlZW4gdXBkYXRlZC5cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZS5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXJnZSh0aGlzLnN0YXRlLnNrZXRjaCwgZXYuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obS5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obS5kYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gVGV4dEJsb2NrIC0tLS0tXHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5hZGRcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRjaCA9IGV2LmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXRjaC50ZXh0IHx8ICFwYXRjaC50ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHsgX2lkOiBGcmFtZXdvcmsubmV3aWQoKSB9IGFzIFRleHRCbG9jaztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lcmdlKGJsb2NrLCBwYXRjaCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnRleHRDb2xvciA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLnRleHRDb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ci5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFibG9jay5mb250RmFtaWx5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLmZvbnRGYW1pbHkgPSB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ci5mb250RmFtaWx5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5mb250VmFyaWFudCA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLmZvbnRWYXJpYW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2gudGV4dEJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmFkZGVkLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRleHRCbG9ja0ZvbnQoYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB0aGlzLmdldEJsb2NrKGV2LmRhdGEuX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gPFRleHRCbG9jaz57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBldi5kYXRhLnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGV2LmRhdGEuYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBldi5kYXRhLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGV2LmRhdGEuZm9udEZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRWYXJpYW50OiBldi5kYXRhLmZvbnRWYXJpYW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvbnRDaGFuZ2VkID0gcGF0Y2guZm9udEZhbWlseSAhPT0gYmxvY2suZm9udEZhbWlseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgcGF0Y2guZm9udFZhcmlhbnQgIT09IGJsb2NrLmZvbnRWYXJpYW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lcmdlKGJsb2NrLCBwYXRjaCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2suZm9udEZhbWlseSAmJiAhYmxvY2suZm9udFZhcmlhbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMucmVzb3VyY2VzLmZvbnRDYXRhbG9nLmdldFJlY29yZChibG9jay5mb250RmFtaWx5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWd1bGFyIG9yIGVsc2UgZmlyc3QgdmFyaWFudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLmZvbnRWYXJpYW50ID0gRm9udFNoYXBlLkZvbnRDYXRhbG9nLmRlZmF1bHRWYXJpYW50KHJlY29yZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBibG9jay50ZXh0Q29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGJsb2NrLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGJsb2NrLmZvbnRGYW1pbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogYmxvY2suZm9udFZhcmlhbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm9udENoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRleHRCbG9ja0ZvbnQoYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5yZW1vdmVcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaWREZWxldGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBfLnJlbW92ZSh0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLCB0YiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0Yi5faWQgPT09IGV2LmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWREZWxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlkRGVsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5kaXNwYXRjaCh7IF9pZDogZXYuZGF0YS5faWQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2VcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuZ2V0QmxvY2soZXYuZGF0YS5faWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5wb3NpdGlvbiA9IGV2LmRhdGEucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLm91dGxpbmUgPSBldi5kYXRhLm91dGxpbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXJyYW5nZUNoYW5nZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgb3BlcmF0aW9uJCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29wZXJhdGlvbiQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdHJhbnNwYXJlbmN5JCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zcGFyZW5jeSQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyBzaG93T3BlcmF0aW9uKG9wZXJhdGlvbjogT3BlcmF0aW9uKXtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5vcGVyYXRpb24gPSBvcGVyYXRpb247XHJcbiAgICAgICAgICAgIG9wZXJhdGlvbi5vbkNsb3NlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zdGF0ZS5vcGVyYXRpb24gPT09IG9wZXJhdGlvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlT3BlcmF0aW9uKCk7IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX29wZXJhdGlvbiQub25OZXh0KG9wZXJhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyBoaWRlT3BlcmF0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLm9wZXJhdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX29wZXJhdGlvbiQub25OZXh0KG51bGwpOyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaW1hZ2VVcGxvYWRlZChzcmM6IHN0cmluZyl7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudXBsb2FkZWRJbWFnZSA9IHNyYztcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmltYWdlVXBsb2FkZWQuZGlzcGF0Y2goc3JjKTtcclxuICAgICAgICAgICAgaWYoIXRoaXMuc3RhdGUudHJhbnNwYXJlbmN5KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VHJhbnNwYXJlbmN5KHRydWUpO1xyXG4gICAgICAgICAgICB9ICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyByZW1vdmVVcGxvYWRlZEltYWdlKCl7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudXBsb2FkZWRJbWFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5pbWFnZVVwbG9hZGVkLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgICAgICBpZih0aGlzLnN0YXRlLnRyYW5zcGFyZW5jeSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRyYW5zcGFyZW5jeShmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzZXRUcmFuc3BhcmVuY3kodmFsdWU/OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudHJhbnNwYXJlbmN5ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zcGFyZW5jeSQub25OZXh0KHRoaXMuc3RhdGUudHJhbnNwYXJlbmN5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgb3BlblNrZXRjaChpZDogc3RyaW5nKTogSlF1ZXJ5UHJvbWlzZTxTa2V0Y2g+IHtcclxuICAgICAgICAgICAgaWYgKCFpZCB8fCAhaWQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFMzQWNjZXNzLmdldEpzb24oaWQgKyBcIi5qc29uXCIpXHJcbiAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgIChza2V0Y2g6IFNrZXRjaCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJldHJpZXZlZCBza2V0Y2hcIiwgc2tldGNoLl9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNrZXRjaC5icm93c2VySWQgPT09IHRoaXMuc3RhdGUuYnJvd3NlcklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTa2V0Y2ggd2FzIGNyZWF0ZWQgaW4gdGhpcyBicm93c2VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2tldGNoIHdhcyBjcmVhdGVkIGluIGEgZGlmZmVyZW50IGJyb3dzZXInKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBza2V0Y2g7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJlcnJvciBnZXR0aW5nIHJlbW90ZSBza2V0Y2hcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRHcmVldGluZ1NrZXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGxvYWRTa2V0Y2goc2tldGNoOiBTa2V0Y2gpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5sb2FkaW5nU2tldGNoID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2ggPSBza2V0Y2g7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmxvYWRlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnNrZXRjaCk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUuYWN0aW9ucy5lZGl0b3JMb2FkZWRTa2V0Y2guZGlzcGF0Y2goc2tldGNoLl9pZCk7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgdGIgb2YgdGhpcy5zdGF0ZS5za2V0Y2gudGV4dEJsb2Nrcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmxvYWRlZC5kaXNwYXRjaCh0Yik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRUZXh0QmxvY2tGb250KHRiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnpvb21Ub0ZpdFJlcXVlc3RlZC5kaXNwYXRjaCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5sb2FkaW5nU2tldGNoID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGxvYWRHcmVldGluZ1NrZXRjaCgpOiBKUXVlcnlQcm9taXNlPGFueT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUzNBY2Nlc3MuZ2V0SnNvbihTdG9yZS5HUkVFVElOR19TS0VUQ0hfSUQgKyBcIi5qc29uXCIpXHJcbiAgICAgICAgICAgICAgICAuZG9uZSgoc2tldGNoOiBTa2V0Y2gpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBza2V0Y2guX2lkID0gRnJhbWV3b3JrLm5ld2lkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tldGNoLmJyb3dzZXJJZCA9IHRoaXMuc3RhdGUuYnJvd3NlcklkO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNsZWFyU2tldGNoKCkge1xyXG4gICAgICAgICAgICBjb25zdCBza2V0Y2ggPSA8U2tldGNoPnRoaXMuZGVmYXVsdFNrZXRjaEF0dHIoKTtcclxuICAgICAgICAgICAgc2tldGNoLl9pZCA9IHRoaXMuc3RhdGUuc2tldGNoLl9pZDtcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKHNrZXRjaCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGxvYWRSZXNvdXJjZXMoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzID0gbmV3IEZvbnRTaGFwZS5QYXJzZWRGb250cyhwYXJzZWQgPT5cclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVkaXRvci5mb250TG9hZGVkLmRpc3BhdGNoKHBhcnNlZC5mb250KSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5mcm9tTG9jYWwoXCJmb250cy9nb29nbGUtZm9udHMuanNvblwiKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oY2F0YWxvZyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMuZm9udENhdGFsb2cgPSBjYXRhbG9nO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvYWQgZm9udHMgaW50byBicm93c2VyIGZvciBwcmV2aWV3XHJcbiAgICAgICAgICAgICAgICAgICAgRm9udFNoYXBlLkZvbnRDYXRhbG9nLmxvYWRQcmV2aWV3U3Vic2V0cyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0YWxvZy5nZXRMaXN0KHRoaXMuZm9udExpc3RMaW1pdCkubWFwKGYgPT4gZi5mYW1pbHkpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KFN0b3JlLkZBTExCQUNLX0ZPTlRfVVJMKS50aGVuKCh7Zm9udH0pID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZhbGxiYWNrRm9udCA9IGZvbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lZGl0b3IucmVzb3VyY2VzUmVhZHkuZGlzcGF0Y2godHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0VXNlck1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnVzZXJNZXNzYWdlICE9PSBtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnVzZXJNZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVkaXRvci51c2VyTWVzc2FnZUNoYW5nZWQuZGlzcGF0Y2gobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcHVsc2VVc2VyTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRVc2VyTWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpLCA0MDAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0RGVmYXVsdFVzZXJNZXNzYWdlKCkge1xyXG4gICAgICAgICAgICAvLyBpZiBub3QgdGhlIGxhc3Qgc2F2ZWQgc2tldGNoLCBvciBza2V0Y2ggaXMgZGlydHksIHNob3cgXCJVbnNhdmVkXCJcclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9ICh0aGlzLnN0YXRlLnNrZXRjaElzRGlydHlcclxuICAgICAgICAgICAgICAgIHx8ICF0aGlzLnN0YXRlLnNrZXRjaC5zYXZlZEF0KVxyXG4gICAgICAgICAgICAgICAgPyBcIlVuc2F2ZWRcIlxyXG4gICAgICAgICAgICAgICAgOiBcIlNhdmVkXCI7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlck1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGxvYWRUZXh0QmxvY2tGb250KGJsb2NrOiBUZXh0QmxvY2spIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMuZm9udENhdGFsb2cuZ2V0VXJsKGJsb2NrLmZvbnRGYW1pbHksIGJsb2NrLmZvbnRWYXJpYW50KSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCh7Zm9udH0pID0+XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmZvbnRSZWFkeS5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0QmxvY2tJZDogYmxvY2suX2lkLCBmb250IH0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY2hhbmdlZFNrZXRjaENvbnRlbnQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5jb250ZW50Q2hhbmdlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnNrZXRjaCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGVmYXVsdFVzZXJNZXNzYWdlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIG1lcmdlPFQ+KGRlc3Q6IFQsIHNvdXJjZTogVCkge1xyXG4gICAgICAgICAgICBfLm1lcmdlKGRlc3QsIHNvdXJjZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIG5ld1NrZXRjaChhdHRyPzogU2tldGNoQXR0cik6IFNrZXRjaCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNrZXRjaCA9IDxTa2V0Y2g+dGhpcy5kZWZhdWx0U2tldGNoQXR0cigpO1xyXG4gICAgICAgICAgICBza2V0Y2guX2lkID0gRnJhbWV3b3JrLm5ld2lkKCk7XHJcbiAgICAgICAgICAgIGlmIChhdHRyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lcmdlKHNrZXRjaCwgYXR0cik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKHNrZXRjaCk7XHJcbiAgICAgICAgICAgIHJldHVybiBza2V0Y2g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRlZmF1bHRTa2V0Y2hBdHRyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gPFNrZXRjaEF0dHI+e1xyXG4gICAgICAgICAgICAgICAgYnJvd3NlcklkOiB0aGlzLnN0YXRlLmJyb3dzZXJJZCxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRUZXh0QmxvY2tBdHRyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJSb2JvdG9cIixcclxuICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogXCJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBcImdyYXlcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ3aGl0ZVwiLFxyXG4gICAgICAgICAgICAgICAgdGV4dEJsb2NrczogPFRleHRCbG9ja1tdPltdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNhdmVTa2V0Y2goc2tldGNoOiBTa2V0Y2gpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2F2aW5nID0gXy5jbG9uZShza2V0Y2gpO1xyXG4gICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBzYXZpbmcuc2F2ZWRBdCA9IG5vdztcclxuICAgICAgICAgICAgdGhpcy5zZXRVc2VyTWVzc2FnZShcIlNhdmluZ1wiKTtcclxuICAgICAgICAgICAgUzNBY2Nlc3MucHV0RmlsZShza2V0Y2guX2lkICsgXCIuanNvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCIsIEpTT04uc3RyaW5naWZ5KHNhdmluZykpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guc2F2ZWRBdCA9IG5vdztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUuYWN0aW9ucy5lZGl0b3JTYXZlZFNrZXRjaC5kaXNwYXRjaChza2V0Y2guX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lZGl0b3Iuc25hcHNob3RFeHBpcmVkLmRpc3BhdGNoKHNrZXRjaCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VXNlck1lc3NhZ2UoXCJVbmFibGUgdG8gc2F2ZVwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRTZWxlY3Rpb24oaXRlbTogV29ya3NwYWNlT2JqZWN0UmVmLCBmb3JjZTogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICAgICAgaWYgKCFmb3JjZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZWFybHkgZXhpdCBvbiBubyBjaGFuZ2VcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuc2VsZWN0aW9uLml0ZW1JZCA9PT0gaXRlbS5pdGVtSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNlbGVjdGlvbiA9IGl0ZW07XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLmRpc3BhdGNoKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRFZGl0aW5nSXRlbShpdGVtOiBQb3NpdGlvbmVkT2JqZWN0UmVmLCBmb3JjZT86IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKCFmb3JjZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZWFybHkgZXhpdCBvbiBubyBjaGFuZ2VcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbS5pdGVtSWQgPT09IGl0ZW0uaXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2lnbmFsIGNsb3NpbmcgZWRpdG9yIGZvciBpdGVtXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0uaXRlbVR5cGUgPT09IFwiVGV4dEJsb2NrXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RWRpdGluZ0Jsb2NrID0gdGhpcy5nZXRCbG9jayh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtLml0ZW1JZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRFZGl0aW5nQmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmVkaXRvckNsb3NlZC5kaXNwYXRjaChjdXJyZW50RWRpdGluZ0Jsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBlZGl0aW5nIGl0ZW0gc2hvdWxkIGJlIHNlbGVjdGVkIGl0ZW1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmVkaXRpbmdJdGVtID0gaXRlbTtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5kaXNwYXRjaChpdGVtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZ2V0QmxvY2soaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsIHRiID0+IHRiLl9pZCA9PT0gaWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwiaW50ZXJmYWNlIFdpbmRvdyB7XHJcbiAgICB3ZWJraXRVUkw6IFVSTDtcclxufVxyXG5cclxubmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFdvcmtzcGFjZUNvbnRyb2xsZXIge1xyXG5cclxuICAgICAgICBzdGF0aWMgVEVYVF9DSEFOR0VfUkVOREVSX1RIUk9UVExFX01TID0gNTAwO1xyXG4gICAgICAgIHN0YXRpYyBCTE9DS19CT1VORFNfQ0hBTkdFX1RIUk9UVExFX01TID0gNTAwO1xyXG5cclxuICAgICAgICBkZWZhdWx0U2l6ZSA9IG5ldyBwYXBlci5TaXplKDUwMDAwLCA0MDAwMCk7XHJcbiAgICAgICAgZGVmYXVsdFNjYWxlID0gMC4wMjtcclxuXHJcbiAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgICAgIGZhbGxiYWNrRm9udDogb3BlbnR5cGUuRm9udDtcclxuICAgICAgICB2aWV3Wm9vbTogcGFwZXJFeHQuVmlld1pvb207XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIHByaXZhdGUgX3NrZXRjaDogU2tldGNoO1xyXG4gICAgICAgIHByaXZhdGUgX3RleHRCbG9ja0l0ZW1zOiB7IFt0ZXh0QmxvY2tJZDogc3RyaW5nXTogVGV4dFdhcnAgfSA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgX3dvcmtzcGFjZTogcGFwZXIuSXRlbTtcclxuICAgICAgICBwcml2YXRlIF9iYWNrZ3JvdW5kSW1hZ2U6IHBhcGVyLlJhc3RlcjtcclxuICAgICAgICBwcml2YXRlIF93YXRlcm1hcms6IHBhcGVyLkl0ZW07XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSwgZmFsbGJhY2tGb250OiBvcGVudHlwZS5Gb250KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgdGhpcy5mYWxsYmFja0ZvbnQgPSBmYWxsYmFja0ZvbnQ7XHJcbiAgICAgICAgICAgIHBhcGVyLnNldHRpbmdzLmhhbmRsZVNpemUgPSAxO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5DYW52YXMnKTtcclxuICAgICAgICAgICAgcGFwZXIuc2V0dXAodGhpcy5jYW52YXMpO1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3QgPSBwYXBlci5wcm9qZWN0O1xyXG4gICAgICAgICAgICB3aW5kb3cub25yZXNpemUgPSAoKSA9PiB0aGlzLnByb2plY3Qudmlldy5kcmF3KCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjYW52YXNTZWwgPSAkKHRoaXMuY2FudmFzKTtcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLm1lcmdlVHlwZWQoXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZCxcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWRcclxuICAgICAgICAgICAgKS5zdWJzY3JpYmUoZXYgPT5cclxuICAgICAgICAgICAgICAgIGNhbnZhc1NlbC5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGV2LmRhdGEuYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudmlld1pvb20gPSBuZXcgcGFwZXJFeHQuVmlld1pvb20odGhpcy5wcm9qZWN0KTtcclxuICAgICAgICAgICAgdGhpcy52aWV3Wm9vbS5zZXRab29tUmFuZ2UoW1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2l6ZS5tdWx0aXBseSh0aGlzLmRlZmF1bHRTY2FsZSAqIDAuMSksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTaXplLm11bHRpcGx5KDAuNSldKTtcclxuICAgICAgICAgICAgdGhpcy52aWV3Wm9vbS52aWV3Q2hhbmdlZC5zdWJzY3JpYmUoYm91bmRzID0+IHtcclxuICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuZWRpdG9yLnZpZXdDaGFuZ2VkLmRpc3BhdGNoKGJvdW5kcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY2xlYXJTZWxlY3Rpb24gPSAoZXY6IHBhcGVyLlBhcGVyTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0b3JlLnN0YXRlLnNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYXBlci52aWV3Lm9uKHBhcGVyLkV2ZW50VHlwZS5jbGljaywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByb2plY3QuaGl0VGVzdChldi5wb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbihldik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBwYXBlci52aWV3Lm9uKHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdTdGFydCwgY2xlYXJTZWxlY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qga2V5SGFuZGxlciA9IG5ldyBEb2N1bWVudEtleUhhbmRsZXIoc3RvcmUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmltcG9ydFNWRyhcImltZy9zcGlyYWwtbG9nby5zdmdcIiwgKHdhdGVybWFyazogcGFwZXIuSXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2F0ZXJtYXJrID0gd2F0ZXJtYXJrO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2F0ZXJtYXJrLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tIERlc2lnbmVyIC0tLS0tXHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLndvcmtzcGFjZUluaXRpYWxpemVkLnN1YigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3Qudmlldy5kcmF3KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci56b29tVG9GaXRSZXF1ZXN0ZWQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuem9vbVRvRml0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5leHBvcnRTVkdSZXF1ZXN0ZWQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZG93bmxvYWRTVkcoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLmV4cG9ydFBOR1JlcXVlc3RlZC5zdWIoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb3dubG9hZFBORygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5lZGl0b3Iuc25hcHNob3RFeHBpcmVkLnN1YigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldFNuYXBzaG90UE5HKDcyKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuZWRpdG9yLnVwZGF0ZVNuYXBzaG90LmRpc3BhdGNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2tldGNoSWQ6IHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLl9pZCwgcG5nRGF0YVVybDogZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gU2tldGNoIC0tLS0tXHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2tldGNoID0gZXYuZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd29ya3NwYWNlID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGV4dEJsb2NrSXRlbXMgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guc2VsZWN0aW9uQ2hhbmdlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuZGVzZWxlY3RBbGwoKTtcclxuICAgICAgICAgICAgICAgIGlmIChtLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSBtLmRhdGEuaXRlbUlkICYmIHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5pdGVtSWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jayAmJiAhYmxvY2suc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2suc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBUZXh0QmxvY2sgLS0tLS1cclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5tZXJnZVR5cGVkKFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5hZGRlZCxcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2subG9hZGVkXHJcbiAgICAgICAgICAgICkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgZXYgPT4gdGhpcy5hZGRCbG9jayhldi5kYXRhKSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmF0dHJDaGFuZ2VkXHJcbiAgICAgICAgICAgICAgICAub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgICAgICAudGhyb3R0bGUoV29ya3NwYWNlQ29udHJvbGxlci5URVhUX0NIQU5HRV9SRU5ERVJfVEhST1RUTEVfTVMpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dEJsb2NrID0gbS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnRleHQgPSB0ZXh0QmxvY2sudGV4dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jdXN0b21TdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogdGV4dEJsb2NrLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmZvbnRSZWFkeS5zdWIoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbZGF0YS50ZXh0QmxvY2tJZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZm9udCA9IGRhdGEuZm9udDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLnJlbW92ZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5lZGl0b3JDbG9zZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guaW1hZ2VVcGxvYWRlZC5zdWIodXJsID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QmFja2dyb3VuZEltYWdlKHVybCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUudHJhbnNwYXJlbmN5JC5zdWJzY3JpYmUodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd29ya3NwYWNlLm9wYWNpdHkgPSB2YWx1ZSA/IDAuNzUgOiAxO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHpvb21Ub0ZpdCgpIHtcclxuICAgICAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRWaWV3YWJsZUJvdW5kcygpO1xyXG4gICAgICAgICAgICBpZiAoYm91bmRzLndpZHRoID4gMCAmJiBib3VuZHMuaGVpZ2h0ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Wm9vbS56b29tVG8oYm91bmRzLnNjYWxlKDEuMikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGdldFZpZXdhYmxlQm91bmRzKCk6IHBhcGVyLlJlY3RhbmdsZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuX3dvcmtzcGFjZS5ib3VuZHM7XHJcbiAgICAgICAgICAgIGlmICghYm91bmRzIHx8IGJvdW5kcy53aWR0aCA9PT0gMCB8fCBib3VuZHMuaGVpZ2h0ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlJlY3RhbmdsZShcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMCwgMCksXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2l6ZS5tdWx0aXBseSgwLjA1KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEByZXR1cm5zIGRhdGEgVVJMXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBnZXRTbmFwc2hvdFBORyhkcGk6IG51bWJlcik6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KGNhbGxiYWNrID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSB0aGlzLmluc2VydEJhY2tncm91bmQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByYXN0ZXIgPSB0aGlzLl93b3Jrc3BhY2UucmFzdGVyaXplKGRwaSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHJhc3Rlci50b0RhdGFVUkwoKTtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRvd25sb2FkUE5HKCkge1xyXG4gICAgICAgICAgICAvLyBIYWxmIG9mIG1heCBEUEkgcHJvZHVjZXMgYXBwcm94IDQwMDB4NDAwMC5cclxuICAgICAgICAgICAgY29uc3QgZHBpID0gMC41ICogUGFwZXJIZWxwZXJzLmdldE1heEV4cG9ydERwaSh0aGlzLl93b3Jrc3BhY2UuYm91bmRzLnNpemUpO1xyXG4gICAgICAgICAgICB0aGlzLmdldFNuYXBzaG90UE5HKGRwaSkudGhlbihkYXRhID0+IHs7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IFNrZXRjaEhlbHBlcnMuZ2V0U2tldGNoRmlsZU5hbWUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gsIDQwLCBcInBuZ1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBEb21IZWxwZXJzLmRhdGFVUkxUb0Jsb2IoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZG93bmxvYWRTVkcoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBsZXRlRG93bmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuZGVzZWxlY3RBbGwoKTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhVXJsID0gXCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCxcIiArIGVuY29kZVVSSUNvbXBvbmVudChcclxuICAgICAgICAgICAgICAgICAgICA8c3RyaW5nPnRoaXMuX3dvcmtzcGFjZS5leHBvcnRTVkcoeyBhc1N0cmluZzogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBibG9iID0gRG9tSGVscGVycy5kYXRhVVJMVG9CbG9iKGRhdGFVcmwpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBTa2V0Y2hIZWxwZXJzLmdldFNrZXRjaEZpbGVOYW1lKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLCA0MCwgXCJzdmdcIik7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHRoaXMuaW5zZXJ0QmFja2dyb3VuZChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZURvd25sb2FkKCk7XHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGVEb3dubG9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbnNlcnQgc2tldGNoIGJhY2tncm91bmQgdG8gcHJvdmlkZSBiYWNrZ3JvdW5kIGZpbGwgKGlmIG5lY2Vzc2FyeSlcclxuICAgICAgICAgKiAgIGFuZCBhZGQgbWFyZ2luIGFyb3VuZCBlZGdlcy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIGluc2VydEJhY2tncm91bmQod2F0ZXJtYXJrOiBib29sZWFuKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNrZXRjaEJvdW5kcyA9IHRoaXMuZ2V0Vmlld2FibGVCb3VuZHMoKTtcclxuICAgICAgICAgICAgY29uc3QgbWFyZ2luID0gTWF0aC5tYXgoc2tldGNoQm91bmRzLndpZHRoLCBza2V0Y2hCb3VuZHMuaGVpZ2h0KSAqIDAuMDI7XHJcbiAgICAgICAgICAgIGNvbnN0IGltYWdlQm91bmRzID0gbmV3IHBhcGVyLlJlY3RhbmdsZShcclxuICAgICAgICAgICAgICAgIHNrZXRjaEJvdW5kcy50b3BMZWZ0LnN1YnRyYWN0KG1hcmdpbiksXHJcbiAgICAgICAgICAgICAgICBza2V0Y2hCb3VuZHMuYm90dG9tUmlnaHQuYWRkKG1hcmdpbikpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgZmlsbCA9IHBhcGVyLlNoYXBlLlJlY3RhbmdsZShpbWFnZUJvdW5kcyk7XHJcbiAgICAgICAgICAgIGZpbGwuZmlsbENvbG9yID0gdGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2guYmFja2dyb3VuZENvbG9yO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IG5ldyBwYXBlci5Hcm91cChbZmlsbF0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHdhdGVybWFyaykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd2F0ZXJtYXJrRGltID0gTWF0aC5zcXJ0KGltYWdlQm91bmRzLnNpemUud2lkdGggKiBpbWFnZUJvdW5kcy5zaXplLmhlaWdodCkgKiAwLjE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93YXRlcm1hcmsuYm91bmRzLnNpemUgPSBuZXcgcGFwZXIuU2l6ZSh3YXRlcm1hcmtEaW0sIHdhdGVybWFya0RpbSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93YXRlcm1hcmsucG9zaXRpb24gPSBpbWFnZUJvdW5kcy5ib3R0b21SaWdodC5zdWJ0cmFjdCh3YXRlcm1hcmtEaW0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHdhdGVybWFya1BhdGggPSB0aGlzLl93YXRlcm1hcmsuZ2V0SXRlbSh7Y2xhc3M6IHBhcGVyLkNvbXBvdW5kUGF0aH0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmFja2dyb3VuZENvbG9yID0gPHBhcGVyLkNvbG9yPmZpbGwuZmlsbENvbG9yO1xyXG4gICAgICAgICAgICAgICAgaWYoYmFja2dyb3VuZENvbG9yLmxpZ2h0bmVzcyA+IDAuNCl7XHJcbiAgICAgICAgICAgICAgICAgICAgd2F0ZXJtYXJrUGF0aC5maWxsQ29sb3IgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgd2F0ZXJtYXJrUGF0aC5vcGFjaXR5ID0gMC4wNTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2F0ZXJtYXJrUGF0aC5maWxsQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgd2F0ZXJtYXJrUGF0aC5vcGFjaXR5ID0gMC4yO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZC5hZGRDaGlsZCh0aGlzLl93YXRlcm1hcmspO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX3dvcmtzcGFjZS5pbnNlcnRDaGlsZCgwLCBiYWNrZ3JvdW5kKTtcclxuICAgICAgICAgICAgcmV0dXJuIGJhY2tncm91bmQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGFkZEJsb2NrKHRleHRCbG9jazogVGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdGV4dEJsb2NrLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigncmVjZWl2ZWQgYmxvY2sgd2l0aG91dCBpZCcsIHRleHRCbG9jayk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbdGV4dEJsb2NrLl9pZF07XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUmVjZWl2ZWQgYWRkQmxvY2sgZm9yIGJsb2NrIHRoYXQgaXMgYWxyZWFkeSBsb2FkZWRcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBib3VuZHM6IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRleHRCbG9jay5vdXRsaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2FkU2VnbWVudCA9IChyZWNvcmQ6IFNlZ21lbnRSZWNvcmQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludCA9IHJlY29yZFswXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocG9pbnQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlNlZ21lbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZFsxXSAmJiBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzFdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZFsyXSAmJiBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzJdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuU2VnbWVudChuZXcgcGFwZXIuUG9pbnQocmVjb3JkKSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgYm91bmRzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwcGVyOiB0ZXh0QmxvY2sub3V0bGluZS50b3Auc2VnbWVudHMubWFwKGxvYWRTZWdtZW50KSxcclxuICAgICAgICAgICAgICAgICAgICBsb3dlcjogdGV4dEJsb2NrLm91dGxpbmUuYm90dG9tLnNlZ21lbnRzLm1hcChsb2FkU2VnbWVudClcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGl0ZW0gPSBuZXcgVGV4dFdhcnAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZhbGxiYWNrRm9udCxcclxuICAgICAgICAgICAgICAgIHRleHRCbG9jay50ZXh0LFxyXG4gICAgICAgICAgICAgICAgYm91bmRzLFxyXG4gICAgICAgICAgICAgICAgbnVsbCwge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogdGV4dEJsb2NrLnRleHRDb2xvciB8fCBcInJlZFwiLCAgICAvLyB0ZXh0Q29sb3Igc2hvdWxkIGhhdmUgYmVlbiBzZXQgZWxzZXdoZXJlIFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl93b3Jrc3BhY2UuYWRkQ2hpbGQoaXRlbSk7XHJcblxyXG4gICAgICAgICAgICBwYXBlckV4dC5leHRlbmRNb3VzZUV2ZW50cyhpdGVtKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGV4dEJsb2NrLm91dGxpbmUgJiYgdGV4dEJsb2NrLnBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gbmV3IHBhcGVyLlBvaW50KHRleHRCbG9jay5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGl0ZW0ub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNlbGVjdCBuZXh0IGl0ZW0gYmVoaW5kXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG90aGVySGl0cyA9ICg8VGV4dFdhcnBbXT5fLnZhbHVlcyh0aGlzLl90ZXh0QmxvY2tJdGVtcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoaSA9PiBpLmlkICE9PSBpdGVtLmlkICYmICEhaS5oaXRUZXN0KGV2LnBvaW50KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJJdGVtID0gXy5zb3J0Qnkob3RoZXJIaXRzLCBpID0+IGkuaW5kZXgpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdGhlckl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJJdGVtLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvdGhlcklkID0gXy5maW5kS2V5KHRoaXMuX3RleHRCbG9ja0l0ZW1zLCBpID0+IGkgPT09IG90aGVySXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdGhlcklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGl0ZW1JZDogb3RoZXJJZCwgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IHRleHRCbG9jay5faWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdGVtLm9uKHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdTdGFydCwgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5icmluZ1RvRnJvbnQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW0udHJhbnNsYXRlKGV2LmRlbHRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdGVtLm9uKHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdFbmQsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+dGhpcy5nZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgYmxvY2suX2lkID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IHRleHRCbG9jay5faWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1DaGFuZ2UkID0gUGFwZXJOb3RpZnkub2JzZXJ2ZShpdGVtLCBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkdFT01FVFJZKTtcclxuICAgICAgICAgICAgaXRlbUNoYW5nZSRcclxuICAgICAgICAgICAgICAgIC5kZWJvdW5jZShXb3Jrc3BhY2VDb250cm9sbGVyLkJMT0NLX0JPVU5EU19DSEFOR0VfVEhST1RUTEVfTVMpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSA8VGV4dEJsb2NrPnRoaXMuZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5faWQgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0ZW0uZGF0YSA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgIGlmICghdGV4dEJsb2NrLnBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLnBvaW50LmFkZChcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoaXRlbS5ib3VuZHMud2lkdGggLyAyLCBpdGVtLmJvdW5kcy5oZWlnaHQgLyAyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKDUwKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdGV4dEJsb2NrSXRlbXNbdGV4dEJsb2NrLl9pZF0gPSBpdGVtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBnZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW06IFRleHRXYXJwKTogQmxvY2tBcnJhbmdlbWVudCB7XHJcbiAgICAgICAgICAgIC8vIGV4cG9ydCByZXR1cm5zIGFuIGFycmF5IHdpdGggaXRlbSB0eXBlIGFuZCBzZXJpYWxpemVkIG9iamVjdDpcclxuICAgICAgICAgICAgLy8gICBbXCJQYXRoXCIsIFBhdGhSZWNvcmRdXHJcbiAgICAgICAgICAgIGNvbnN0IHRvcCA9IDxQYXRoUmVjb3JkPml0ZW0udXBwZXIuZXhwb3J0SlNPTih7IGFzU3RyaW5nOiBmYWxzZSB9KVsxXTtcclxuICAgICAgICAgICAgY29uc3QgYm90dG9tID0gPFBhdGhSZWNvcmQ+aXRlbS5sb3dlci5leHBvcnRKU09OKHsgYXNTdHJpbmc6IGZhbHNlIH0pWzFdO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBbaXRlbS5wb3NpdGlvbi54LCBpdGVtLnBvc2l0aW9uLnldLFxyXG4gICAgICAgICAgICAgICAgb3V0bGluZTogeyB0b3AsIGJvdHRvbSB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0QmFja2dyb3VuZEltYWdlKHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghdXJsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYmFja2dyb3VuZEltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZEltYWdlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZEltYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcmFzdGVyID0gbmV3IHBhcGVyLlJhc3Rlcih1cmwpO1xyXG4gICAgICAgICAgICAoPGFueT5yYXN0ZXIpLm9uTG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJhc3Rlci5zZW5kVG9CYWNrKCk7XHJcbiAgICAgICAgICAgICAgICByYXN0ZXIuZml0Qm91bmRzKHRoaXMuZ2V0Vmlld2FibGVCb3VuZHMoKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYmFja2dyb3VuZEltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZEltYWdlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZEltYWdlID0gcmFzdGVyO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQWN0aW9ucyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcclxuXHJcbiAgICAgICAgZWRpdG9yID0ge1xyXG4gICAgICAgICAgICBpbml0V29ya3NwYWNlOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuaW5pdFdvcmtzcGFjZVwiKSxcclxuICAgICAgICAgICAgbG9hZEZvbnQ6IHRoaXMudG9waWM8c3RyaW5nPihcImRlc2lnbmVyLmxvYWRGb250XCIpLFxyXG4gICAgICAgICAgICB6b29tVG9GaXQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci56b29tVG9GaXRcIiksXHJcbiAgICAgICAgICAgIGV4cG9ydGluZ0ltYWdlOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0SW1hZ2VcIiksXHJcbiAgICAgICAgICAgIGV4cG9ydFBORzogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydFBOR1wiKSxcclxuICAgICAgICAgICAgZXhwb3J0U1ZHOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0U1ZHXCIpLFxyXG4gICAgICAgICAgICB2aWV3Q2hhbmdlZDogdGhpcy50b3BpYzxwYXBlci5SZWN0YW5nbGU+KFwiZGVzaWduZXIudmlld0NoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIHVwZGF0ZVNuYXBzaG90OiB0aGlzLnRvcGljPHsgc2tldGNoSWQ6IHN0cmluZywgcG5nRGF0YVVybDogc3RyaW5nIH0+KFwiZGVzaWduZXIudXBkYXRlU25hcHNob3RcIiksXHJcbiAgICAgICAgICAgIHRvZ2dsZUhlbHA6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci50b2dnbGVIZWxwXCIpLFxyXG4gICAgICAgICAgICBvcGVuU2FtcGxlOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIub3BlblNhbXBsZVwiKSxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNrZXRjaCA9IHtcclxuICAgICAgICAgICAgY3JlYXRlOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmNyZWF0ZVwiKSxcclxuICAgICAgICAgICAgY2xlYXI6IHRoaXMudG9waWM8dm9pZD4oXCJza2V0Y2guY2xlYXJcIiksXHJcbiAgICAgICAgICAgIGNsb25lOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmNsb25lXCIpLFxyXG4gICAgICAgICAgICBvcGVuOiB0aGlzLnRvcGljPHN0cmluZz4oXCJza2V0Y2gub3BlblwiKSxcclxuICAgICAgICAgICAgYXR0clVwZGF0ZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5hdHRyVXBkYXRlXCIpLFxyXG4gICAgICAgICAgICBzZXRTZWxlY3Rpb246IHRoaXMudG9waWM8V29ya3NwYWNlT2JqZWN0UmVmPihcInNrZXRjaC5zZXRTZWxlY3Rpb25cIiksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGV4dEJsb2NrID0ge1xyXG4gICAgICAgICAgICBhZGQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRCbG9jay5hZGRcIiksXHJcbiAgICAgICAgICAgIHVwZGF0ZUF0dHI6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRCbG9jay51cGRhdGVBdHRyXCIpLFxyXG4gICAgICAgICAgICB1cGRhdGVBcnJhbmdlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0QmxvY2sudXBkYXRlQXJyYW5nZVwiKSxcclxuICAgICAgICAgICAgcmVtb3ZlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0QmxvY2sucmVtb3ZlXCIpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50cyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcclxuXHJcbiAgICAgICAgZWRpdG9yID0ge1xyXG4gICAgICAgICAgICByZXNvdXJjZXNSZWFkeTogdGhpcy50b3BpYzxib29sZWFuPihcImFwcC5yZXNvdXJjZXNSZWFkeVwiKSxcclxuICAgICAgICAgICAgd29ya3NwYWNlSW5pdGlhbGl6ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJhcHAud29ya3NwYWNlSW5pdGlhbGl6ZWRcIiksXHJcbiAgICAgICAgICAgIGZvbnRMb2FkZWQ6IHRoaXMudG9waWM8b3BlbnR5cGUuRm9udD4oXCJhcHAuZm9udExvYWRlZFwiKSxcclxuICAgICAgICAgICAgem9vbVRvRml0UmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkXCIpLFxyXG4gICAgICAgICAgICBleHBvcnRQTkdSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRQTkdSZXF1ZXN0ZWRcIiksXHJcbiAgICAgICAgICAgIGV4cG9ydFNWR1JlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydFNWR1JlcXVlc3RlZFwiKSxcclxuICAgICAgICAgICAgdmlld0NoYW5nZWQ6IHRoaXMudG9waWM8cGFwZXIuUmVjdGFuZ2xlPihcImRlc2lnbmVyLnZpZXdDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBzbmFwc2hvdEV4cGlyZWQ6IHRoaXMudG9waWM8U2tldGNoPihcImRlc2lnbmVyLnNuYXBzaG90RXhwaXJlZFwiKSxcclxuICAgICAgICAgICAgdXNlck1lc3NhZ2VDaGFuZ2VkOiB0aGlzLnRvcGljPHN0cmluZz4oXCJkZXNpZ25lci51c2VyTWVzc2FnZUNoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIHNob3dIZWxwQ2hhbmdlZDogdGhpcy50b3BpYzxib29sZWFuPihcImRlc2lnbmVyLnNob3dIZWxwQ2hhbmdlZFwiKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNrZXRjaCA9IHtcclxuICAgICAgICAgICAgbG9hZGVkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2gubG9hZGVkXCIpLFxyXG4gICAgICAgICAgICBhdHRyQ2hhbmdlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmF0dHJDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBjb250ZW50Q2hhbmdlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmNvbnRlbnRDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBlZGl0aW5nSXRlbUNoYW5nZWQ6IHRoaXMudG9waWM8UG9zaXRpb25lZE9iamVjdFJlZj4oXCJza2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkOiB0aGlzLnRvcGljPFdvcmtzcGFjZU9iamVjdFJlZj4oXCJza2V0Y2guc2VsZWN0aW9uQ2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgc2F2ZUxvY2FsUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwic2tldGNoLnNhdmVsb2NhbC5zYXZlTG9jYWxSZXF1ZXN0ZWRcIiksXHJcbiAgICAgICAgICAgIGNsb25lZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmNsb25lZFwiKSxcclxuICAgICAgICAgICAgaW1hZ2VVcGxvYWRlZDogdGhpcy50b3BpYzxzdHJpbmc+KFwic2tldGNoLmltYWdlVXBsb2FkZWRcIiksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGV4dGJsb2NrID0ge1xyXG4gICAgICAgICAgICBhZGRlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFkZGVkXCIpLFxyXG4gICAgICAgICAgICBhdHRyQ2hhbmdlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmF0dHJDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBmb250UmVhZHk6IHRoaXMudG9waWM8eyB0ZXh0QmxvY2tJZDogc3RyaW5nLCBmb250OiBvcGVudHlwZS5Gb250IH0+KFwidGV4dGJsb2NrLmZvbnRSZWFkeVwiKSxcclxuICAgICAgICAgICAgYXJyYW5nZUNoYW5nZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hcnJhbmdlQ2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgcmVtb3ZlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLnJlbW92ZWRcIiksXHJcbiAgICAgICAgICAgIGxvYWRlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmxvYWRlZFwiKSxcclxuICAgICAgICAgICAgZWRpdG9yQ2xvc2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suZWRpdG9yQ2xvc2VkXCIpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDaGFubmVscyB7XHJcbiAgICAgICAgYWN0aW9uczogQWN0aW9ucyA9IG5ldyBBY3Rpb25zKCk7XHJcbiAgICAgICAgZXZlbnRzOiBFdmVudHMgPSBuZXcgRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgdHlwZSBBY3Rpb25UeXBlcyA9XHJcbiAgICAgICAgXCJza2V0Y2guY3JlYXRlXCJcclxuICAgICAgICB8IFwic2tldGNoLnVwZGF0ZVwiXHJcbiAgICAgICAgfCBcInRleHRibG9jay5hZGRcIlxyXG4gICAgICAgIHwgXCJ0ZXh0YmxvY2sudXBkYXRlXCI7XHJcblxyXG4gICAgdHlwZSBFdmVudFR5cGVzID1cclxuICAgICAgICBcInNrZXRjaC5sb2FkZWRcIlxyXG4gICAgICAgIHwgXCJza2V0Y2guY2hhbmdlZFwiXHJcbiAgICAgICAgfCBcInRleHRibG9jay5hZGRlZFwiXHJcbiAgICAgICAgfCBcInRleHRibG9jay5jaGFuZ2VkXCI7XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBWQ29udHJvbCB7XHJcbiAgICAgICAgcmVuZGVyKCk6IFZOb2RlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIE9wZXJhdGlvbiBleHRlbmRzIFZDb250cm9sIHtcclxuICAgICAgICBvbkNsb3NlOiAoKSA9PiB2b2lkOyBcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEVkaXRvclN0YXRlIHtcclxuICAgICAgICBicm93c2VySWQ/OiBzdHJpbmc7XHJcbiAgICAgICAgZWRpdGluZ0l0ZW0/OiBQb3NpdGlvbmVkT2JqZWN0UmVmO1xyXG4gICAgICAgIHNlbGVjdGlvbj86IFdvcmtzcGFjZU9iamVjdFJlZjtcclxuICAgICAgICBsb2FkaW5nU2tldGNoPzogYm9vbGVhbjtcclxuICAgICAgICB1c2VyTWVzc2FnZT86IHN0cmluZztcclxuICAgICAgICBza2V0Y2g/OiBTa2V0Y2g7XHJcbiAgICAgICAgc2hvd0hlbHA/OiBib29sZWFuO1xyXG4gICAgICAgIHNrZXRjaElzRGlydHk/OiBib29sZWFuO1xyXG4gICAgICAgIG9wZXJhdGlvbj86IE9wZXJhdGlvbjtcclxuICAgICAgICB0cmFuc3BhcmVuY3k/OiBib29sZWFuO1xyXG4gICAgICAgIHVwbG9hZGVkSW1hZ2U/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBTdG9yZVJlc291cmNlcyB7XHJcbiAgICAgICAgZmFsbGJhY2tGb250Pzogb3BlbnR5cGUuRm9udFxyXG4gICAgICAgIGZvbnRDYXRhbG9nPzogRm9udFNoYXBlLkZvbnRDYXRhbG9nXHJcbiAgICAgICAgcGFyc2VkRm9udHM/OiBGb250U2hhcGUuUGFyc2VkRm9udHNcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFNrZXRjaCBleHRlbmRzIFNrZXRjaEF0dHIge1xyXG4gICAgICAgIF9pZDogc3RyaW5nO1xyXG4gICAgICAgIGJyb3dzZXJJZD86IHN0cmluZztcclxuICAgICAgICBzYXZlZEF0PzogRGF0ZTtcclxuICAgICAgICB0ZXh0QmxvY2tzPzogVGV4dEJsb2NrW107XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBTa2V0Y2hBdHRyIHtcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgICAgICAgZGVmYXVsdFRleHRCbG9ja0F0dHI/OiBUZXh0QmxvY2s7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBGb250RGVzY3JpcHRpb24ge1xyXG4gICAgICAgIGZhbWlseTogc3RyaW5nO1xyXG4gICAgICAgIGNhdGVnb3J5OiBzdHJpbmc7XHJcbiAgICAgICAgdmFyaWFudDogc3RyaW5nO1xyXG4gICAgICAgIHVybDogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgV29ya3NwYWNlT2JqZWN0UmVmIHtcclxuICAgICAgICBpdGVtSWQ6IHN0cmluZztcclxuICAgICAgICBpdGVtVHlwZT86IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uZWRPYmplY3RSZWYgZXh0ZW5kcyBXb3Jrc3BhY2VPYmplY3RSZWYge1xyXG4gICAgICAgIGNsaWVudFg/OiBudW1iZXI7XHJcbiAgICAgICAgY2xpZW50WT86IG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRleHRCbG9jayBleHRlbmRzIEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgICAgIF9pZD86IHN0cmluZztcclxuICAgICAgICB0ZXh0Pzogc3RyaW5nO1xyXG4gICAgICAgIHRleHRDb2xvcj86IHN0cmluZztcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udEZhbWlseT86IHN0cmluZztcclxuICAgICAgICBmb250VmFyaWFudD86IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgICAgIHBvc2l0aW9uPzogbnVtYmVyW10sXHJcbiAgICAgICAgb3V0bGluZT86IHtcclxuICAgICAgICAgICAgdG9wOiBQYXRoUmVjb3JkLFxyXG4gICAgICAgICAgICBib3R0b206IFBhdGhSZWNvcmRcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCYWNrZ3JvdW5kQWN0aW9uU3RhdHVzIHtcclxuICAgICAgICBhY3Rpb24/OiBPYmplY3Q7XHJcbiAgICAgICAgcmVqZWN0ZWQ/OiBib29sZWFuO1xyXG4gICAgICAgIGVycm9yPzogYm9vbGVhblxyXG4gICAgICAgIG1lc3NhZ2U/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYXRoUmVjb3JkIHtcclxuICAgICAgICBzZWdtZW50czogU2VnbWVudFJlY29yZFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2luZ2xlLXBvaW50IHNlZ21lbnRzIGFyZSBzdG9yZWQgYXMgbnVtYmVyWzJdXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCB0eXBlIFNlZ21lbnRSZWNvcmQgPSBBcnJheTxQb2ludFJlY29yZD4gfCBBcnJheTxudW1iZXI+O1xyXG5cclxuICAgIGV4cG9ydCB0eXBlIFBvaW50UmVjb3JkID0gQXJyYXk8bnVtYmVyPjtcclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVXBsb2FkSW1hZ2UgaW1wbGVtZW50cyBPcGVyYXRpb24ge1xyXG5cclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgb25DbG9zZTogKCkgPT4gdm9pZDtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbmRlcigpOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgaChcImgzXCIsIFtcIlVwbG9hZCBpbWFnZVwiXSksXHJcbiAgICAgICAgICAgICAgICAgICAgaChcImlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJmaWxlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZSA9ICg8SFRNTElucHV0RWxlbWVudD5ldi50YXJnZXQpLmZpbGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZChmaWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdXBsb2FkKGZpbGUpIHtcclxuICAgICAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMO1xyXG4gICAgICAgICAgICB2YXIgc3JjID0gdXJsLmNyZWF0ZU9iamVjdFVSTChmaWxlKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5pbWFnZVVwbG9hZGVkKHNyYyk7XHJcbiAgICAgICAgICAgIHRoaXMub25DbG9zZSAmJiB0aGlzLm9uQ2xvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiICAgIFxyXG5uYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldEZvbnREZXNjcmlwdGlvbihmYW1pbHk6IEZvbnRTaGFwZS5GYW1pbHlSZWNvcmQsIHZhcmlhbnQ/OiBzdHJpbmcpXHJcbiAgICAgICAgOiBGb250RGVzY3JpcHRpb24ge1xyXG4gICAgICAgIGxldCB1cmw6IHN0cmluZztcclxuICAgICAgICB1cmwgPSBmYW1pbHkuZmlsZXNbdmFyaWFudCB8fCBcInJlZ3VsYXJcIl07XHJcbiAgICAgICAgaWYoIXVybCl7XHJcbiAgICAgICAgICAgIHVybCA9IGZhbWlseS5maWxlc1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZmFtaWx5OiBmYW1pbHkuZmFtaWx5LFxyXG4gICAgICAgICAgICBjYXRlZ29yeTogZmFtaWx5LmNhdGVnb3J5LFxyXG4gICAgICAgICAgICB2YXJpYW50OiB2YXJpYW50LFxyXG4gICAgICAgICAgICB1cmxcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTM0FjY2VzcyB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVwbG9hZCBmaWxlIHRvIGFwcGxpY2F0aW9uIFMzIGJ1Y2tldC5cclxuICAgICAgICAgKiBSZXR1cm5zIHVwbG9hZCBVUkwgYXMgYSBwcm9taXNlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBwdXRGaWxlKGZpbGVOYW1lOiBzdHJpbmcsIGZpbGVUeXBlOiBzdHJpbmcsIGRhdGE6IEJsb2IgfCBzdHJpbmcpXHJcbiAgICAgICAgICAgIDogSlF1ZXJ5UHJvbWlzZTxzdHJpbmc+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLXNkay1qcy9pc3N1ZXMvMTkwICAgXHJcbiAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9GaXJlZm94LykgJiYgIWZpbGVUeXBlLm1hdGNoKC87LykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGFyc2V0ID0gJzsgY2hhcnNldD1VVEYtOCc7XHJcbiAgICAgICAgICAgICAgICBmaWxlVHlwZSArPSBjaGFyc2V0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzaWduVXJsID0gYC9hcGkvc3RvcmFnZS9hY2Nlc3M/ZmlsZU5hbWU9JHtmaWxlTmFtZX0mZmlsZVR5cGU9JHtmaWxlVHlwZX1gO1xyXG4gICAgICAgICAgICAvLyBnZXQgc2lnbmVkIFVSTFxyXG4gICAgICAgICAgICByZXR1cm4gJC5nZXRKU09OKHNpZ25VcmwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgIHNpZ25SZXNwb25zZSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFBVVCBmaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHV0UmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogc2lnblJlc3BvbnNlLnNpZ25lZFJlcXVlc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwieC1hbXotYWNsXCI6IFwicHVibGljLXJlYWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmaWxlVHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmFqYXgocHV0UmVxdWVzdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1dFJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBsb2FkZWQgZmlsZVwiLCBzaWduUmVzcG9uc2UudXJsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzaWduUmVzcG9uc2UudXJsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIHVwbG9hZGluZyB0byBTM1wiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciBvbiAvYXBpL3N0b3JhZ2UvYWNjZXNzXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERvd25sb2FkIGZpbGUgZnJvbSBidWNrZXRcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgZ2V0SnNvbihmaWxlTmFtZTogc3RyaW5nKTogSlF1ZXJ5UHJvbWlzZTxPYmplY3Q+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RmlsZVVybChmaWxlTmFtZSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvd25sb2FkaW5nXCIsIHJlc3BvbnNlLnVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogcmVzcG9uc2UudXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgZ2V0RmlsZVVybChmaWxlTmFtZTogc3RyaW5nKTogSlF1ZXJ5UHJvbWlzZTx7IHVybDogc3RyaW5nIH0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IGAvYXBpL3N0b3JhZ2UvdXJsP2ZpbGVOYW1lPSR7ZmlsZU5hbWV9YCxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDb2xvclBpY2tlciB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBERUZBVUxUX1BBTEVUVEVfR1JPVVBTID0gW1xyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS84MDdcclxuICAgICAgICAgICAgICAgIFwiI2VlNDAzNVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZjM3NzM2XCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmZGY0OThcIixcclxuICAgICAgICAgICAgICAgIFwiIzdiYzA0M1wiLFxyXG4gICAgICAgICAgICAgICAgXCIjMDM5MmNmXCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzg5NFxyXG4gICAgICAgICAgICAgICAgXCIjZWRjOTUxXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNlYjY4NDFcIixcclxuICAgICAgICAgICAgICAgIFwiI2NjMmEzNlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjNGYzNzJkXCIsXHJcbiAgICAgICAgICAgICAgICBcIiMwMGEwYjBcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvMTY0XHJcbiAgICAgICAgICAgICAgICBcIiMxYjg1YjhcIixcclxuICAgICAgICAgICAgICAgIFwiIzVhNTI1NVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjNTU5ZTgzXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNhZTVhNDFcIixcclxuICAgICAgICAgICAgICAgIFwiI2MzY2I3MVwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS8zODlcclxuICAgICAgICAgICAgICAgIFwiIzRiMzgzMlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjODU0NDQyXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmZmY0ZTZcIixcclxuICAgICAgICAgICAgICAgIFwiIzNjMmYyZlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjYmU5YjdiXCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzQ1NVxyXG4gICAgICAgICAgICAgICAgXCIjZmY0ZTUwXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmYzkxM2FcIixcclxuICAgICAgICAgICAgICAgIFwiI2Y5ZDYyZVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZWFlMzc0XCIsXHJcbiAgICAgICAgICAgICAgICBcIiNlMmY0YzdcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvNzAwXHJcbiAgICAgICAgICAgICAgICBcIiNkMTExNDFcIixcclxuICAgICAgICAgICAgICAgIFwiIzAwYjE1OVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjMDBhZWRiXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmMzc3MzVcIixcclxuICAgICAgICAgICAgICAgIFwiI2ZmYzQyNVwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS84MjZcclxuICAgICAgICAgICAgICAgIFwiI2U4ZDE3NFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZTM5ZTU0XCIsXHJcbiAgICAgICAgICAgICAgICBcIiNkNjRkNGRcIixcclxuICAgICAgICAgICAgICAgIFwiIzRkNzM1OFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjOWVkNjcwXCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgc3RhdGljIE1PTk9fUEFMRVRURSA9IFtcIiMwMDBcIiwgXCIjNDQ0XCIsIFwiIzY2NlwiLCBcIiM5OTlcIiwgXCIjY2NjXCIsIFwiI2VlZVwiLCBcIiNmM2YzZjNcIiwgXCIjZmZmXCJdO1xyXG5cclxuICAgICAgICBzdGF0aWMgc2V0dXAoZWxlbSwgZmVhdHVyZWRDb2xvcnM6IHN0cmluZ1tdLCBvbkNoYW5nZSkge1xyXG4gICAgICAgICAgICBjb25zdCBmZWF0dXJlZEdyb3VwcyA9IF8uY2h1bmsoZmVhdHVyZWRDb2xvcnMsIDUpO1xyXG5cclxuICAgICAgICAgICAgLy8gZm9yIGVhY2ggcGFsZXR0ZSBncm91cFxyXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0UGFsZXR0ZUdyb3VwcyA9IENvbG9yUGlja2VyLkRFRkFVTFRfUEFMRVRURV9HUk9VUFMubWFwKGdyb3VwID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJzZWRHcm91cCA9IGdyb3VwLm1hcChjID0+IG5ldyBwYXBlci5Db2xvcihjKSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgbGlnaHQgdmFyaWFudHMgb2YgZGFya2VzdCB0aHJlZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWRkQ29sb3JzID0gXy5zb3J0QnkocGFyc2VkR3JvdXAsIGMgPT4gYy5saWdodG5lc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgLnNsaWNlKDAsIDMpXHJcbiAgICAgICAgICAgICAgICAgICAgLm1hcChjID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYzIgPSBjLmNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMyLmxpZ2h0bmVzcyA9IDAuODU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjMjtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHBhcnNlZEdyb3VwID0gcGFyc2VkR3JvdXAuY29uY2F0KGFkZENvbG9ycyk7XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRHcm91cCA9IF8uc29ydEJ5KHBhcnNlZEdyb3VwLCBjID0+IGMubGlnaHRuZXNzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWRHcm91cC5tYXAoYyA9PiBjLnRvQ1NTKHRydWUpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYWxldHRlID0gZmVhdHVyZWRHcm91cHMuY29uY2F0KGRlZmF1bHRQYWxldHRlR3JvdXBzKTtcclxuICAgICAgICAgICAgcGFsZXR0ZS5wdXNoKENvbG9yUGlja2VyLk1PTk9fUEFMRVRURSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2VsID0gPGFueT4kKGVsZW0pO1xyXG4gICAgICAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bSh7XHJcbiAgICAgICAgICAgICAgICBzaG93SW5wdXQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhbGxvd0VtcHR5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcHJlZmVycmVkRm9ybWF0OiBcImhleFwiLFxyXG4gICAgICAgICAgICAgICAgc2hvd0J1dHRvbnM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2hvd0FscGhhOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2hvd1BhbGV0dGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzaG93U2VsZWN0aW9uUGFsZXR0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwYWxldHRlOiBwYWxldHRlLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlS2V5OiBcInNrZXRjaHRleHRcIixcclxuICAgICAgICAgICAgICAgIGNoYW5nZTogb25DaGFuZ2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc3RhdGljIHNldChlbGVtOiBIVE1MRWxlbWVudCwgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bShcInNldFwiLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgZGVzdHJveShlbGVtKSB7XHJcbiAgICAgICAgICAgICg8YW55PiQoZWxlbSkpLnNwZWN0cnVtKFwiZGVzdHJveVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEVkaXRvckJhciBleHRlbmRzIENvbXBvbmVudDxFZGl0b3JTdGF0ZT4ge1xyXG5cclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2tldGNoRG9tJCA9IHN0b3JlLmV2ZW50cy5tZXJnZShcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5hdHRyQ2hhbmdlZCxcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5lZGl0b3IudXNlck1lc3NhZ2VDaGFuZ2VkKVxyXG4gICAgICAgICAgICAgICAgLm1hcChtID0+IHRoaXMucmVuZGVyKHN0b3JlLnN0YXRlKSk7XHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShza2V0Y2hEb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbmRlcihzdGF0ZTogRWRpdG9yU3RhdGUpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2tldGNoID0gc3RhdGUuc2tldGNoO1xyXG4gICAgICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsIFtcclxuICAgICAgICAgICAgICAgIGgoXCJsYWJlbFwiLCBcIkFkZCB0ZXh0OiBcIiksXHJcbiAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYWRkLXRleHRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXByZXNzOiAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gZXYudGFyZ2V0ICYmIGV2LnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay5hZGQuZGlzcGF0Y2goeyB0ZXh0OiB0ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldi50YXJnZXQudmFsdWUgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwiUHJlc3MgW0VudGVyXSB0byBhZGRcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJCYWNrZ3JvdW5kOiBcIiksXHJcbiAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHNrZXRjaC5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZub2RlLmVsbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2tldGNoSGVscGVycy5jb2xvcnNJblVzZSh0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZS5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGJhY2tncm91bmRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKSB8fCBcIlwiIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZTogKG9sZFZub2RlLCB2bm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldCh2bm9kZS5lbG0sIHNrZXRjaC5iYWNrZ3JvdW5kQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICh2bm9kZSkgPT4gQ29sb3JQaWNrZXIuZGVzdHJveSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgICAgICBCb290U2NyaXB0LmRyb3Bkb3duKHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogXCJza2V0Y2hNZW51XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJBY3Rpb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJOZXdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDcmVhdGUgbmV3IHNrZXRjaFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5jcmVhdGUuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJDbGVhciBhbGxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDbGVhciBza2V0Y2ggY29udGVudHNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guY2xlYXIuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJab29tIHRvIGZpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkZpdCBjb250ZW50cyBpbiB2aWV3XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnpvb21Ub0ZpdC5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlRvZ2dsZSB0cmFuc3BhcmVuY3lcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJTZWUgdGhyb3VnaCB0ZXh0IHRvIGVsZW1lbnRzIGJlaGluZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5zZXRUcmFuc3BhcmVuY3koIXRoaXMuc3RvcmUuc3RhdGUudHJhbnNwYXJlbmN5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJVcGxvYWQgdHJhY2luZyBpbWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlVwbG9hZCBpbWFnZSBpbnRvIHdvcmtzcGFjZSBmb3IgdHJhY2luZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5zaG93T3BlcmF0aW9uKG5ldyBVcGxvYWRJbWFnZSh0aGlzLnN0b3JlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiUmVtb3ZlIHRyYWNpbmcgaW1hZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJSZW1vdmUgYmFja2dyb3VuZCB0cmFjaW5nIGltYWdlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLnJlbW92ZVVwbG9hZGVkSW1hZ2UoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJFeHBvcnQgaW1hZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFeHBvcnQgc2tldGNoIGFzIFBOR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3IuZXhwb3J0UE5HLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRXhwb3J0IFNWR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkV4cG9ydCBza2V0Y2ggYXMgdmVjdG9yIGdyYXBoaWNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLmV4cG9ydFNWRy5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkR1cGxpY2F0ZSBza2V0Y2hcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDb3B5IGNvbnRlbnRzIGludG8gYSBza2V0Y2ggd2l0aCBhIG5ldyBhZGRyZXNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmNsb25lLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiT3BlbiBzYW1wbGUgc2tldGNoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiT3BlbiBhIHNhbXBsZSBza2V0Y2ggdG8gcGxheSB3aXRoXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLm9wZW5TYW1wbGUuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGgoXCJkaXYjcmlnaHRTaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2I3VzZXItbWVzc2FnZVwiLCB7fSwgW3N0YXRlLnVzZXJNZXNzYWdlIHx8IFwiXCJdKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYjc2hvdy1oZWxwLmdseXBoaWNvbi5nbHlwaGljb24tcXVlc3Rpb24tc2lnblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuZGlzcGF0Y2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcblxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImludGVyZmFjZSBKUXVlcnkge1xyXG4gICAgc2VsZWN0cGlja2VyKC4uLmFyZ3M6IGFueVtdKTtcclxuICAgIC8vcmVwbGFjZU9wdGlvbnMob3B0aW9uczogQXJyYXk8e3ZhbHVlOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmd9Pik7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBGb250UGlja2VyIHtcclxuXHJcbiAgICAgICAgZGVmYXVsdEZvbnRGYW1pbHkgPSBcIlJvYm90b1wiO1xyXG4gICAgICAgIHByZXZpZXdGb250U2l6ZSA9IFwiMjhweFwiO1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlLCBibG9jazogVGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgY29uc3QgZG9tJCA9IFJ4Lk9ic2VydmFibGUuanVzdChibG9jaylcclxuICAgICAgICAgICAgICAgIC5tZXJnZShcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihtID0+IG0uZGF0YS5faWQgPT09IGJsb2NrLl9pZClcclxuICAgICAgICAgICAgICAgICAgICAubWFwKG0gPT4gbS5kYXRhKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgLm1hcCh0YiA9PiB0aGlzLnJlbmRlcih0YikpO1xyXG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oZG9tJCwgY29udGFpbmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbmRlcihibG9jazogVGV4dEJsb2NrKTogVk5vZGUge1xyXG4gICAgICAgICAgICBsZXQgdXBkYXRlID0gcGF0Y2ggPT4ge1xyXG4gICAgICAgICAgICAgICAgcGF0Y2guX2lkID0gYmxvY2suX2lkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyLmRpc3BhdGNoKHBhdGNoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudHM6IFZOb2RlW10gPSBbXTtcclxuICAgICAgICAgICAgZWxlbWVudHMucHVzaChcclxuICAgICAgICAgICAgICAgIGgoXCJzZWxlY3RcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJzZWxlY3RQaWNrZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZmFtaWx5LXBpY2tlclwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB2bm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHVwZGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogZXYudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRWYXJpYW50OiBGb250U2hhcGUuRm9udENhdGFsb2cuZGVmYXVsdFZhcmlhbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUucmVzb3VyY2VzLmZvbnRDYXRhbG9nLmdldFJlY29yZChldi50YXJnZXQudmFsdWUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5yZXNvdXJjZXMuZm9udENhdGFsb2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldExpc3QodGhpcy5zdG9yZS5mb250TGlzdExpbWl0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChyZWNvcmQ6IEZvbnRTaGFwZS5GYW1pbHlSZWNvcmQpID0+IGgoXCJvcHRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogcmVjb3JkLmZhbWlseSA9PT0gYmxvY2suZm9udEZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWNvbnRlbnRcIjogYDxzcGFuIHN0eWxlPVwiJHtGb250SGVscGVycy5nZXRTdHlsZVN0cmluZyhyZWNvcmQuZmFtaWx5LCBudWxsLCB0aGlzLnByZXZpZXdGb250U2l6ZSl9XCI+JHtyZWNvcmQuZmFtaWx5fTwvc3Bhbj5gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcmVjb3JkLmZhbWlseV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRGYW1pbHkgPSB0aGlzLnN0b3JlLnJlc291cmNlcy5mb250Q2F0YWxvZy5nZXRSZWNvcmQoYmxvY2suZm9udEZhbWlseSk7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEZhbWlseSAmJiBzZWxlY3RlZEZhbWlseS52YXJpYW50c1xyXG4gICAgICAgICAgICAgICAgJiYgc2VsZWN0ZWRGYW1pbHkudmFyaWFudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChoKFwic2VsZWN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwidmFyaWFudFBpY2tlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYW50LXBpY2tlclwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB2bm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0cGF0Y2g6IChvbGRWbm9kZSwgdm5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUTogd2h5IGNhbid0IHdlIGp1c3QgZG8gc2VsZWN0cGlja2VyKHJlZnJlc2gpIGhlcmU/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEE6IHNlbGVjdHBpY2tlciBoYXMgbWVudGFsIHByb2JsZW1zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoXCJkZXN0cm95XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoeyBmb250VmFyaWFudDogZXYudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmFtaWx5LnZhcmlhbnRzLm1hcCh2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJvcHRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogdiA9PT0gYmxvY2suZm9udFZhcmlhbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGFpbmVyXCI6IFwiYm9keVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGVudFwiOiBgPHNwYW4gc3R5bGU9XCIke0ZvbnRIZWxwZXJzLmdldFN0eWxlU3RyaW5nKHNlbGVjdGVkRmFtaWx5LmZhbWlseSwgdiwgdGhpcy5wcmV2aWV3Rm9udFNpemUpfVwiPiR7dn08L3NwYW4+YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdl0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHsgXCJmb250LXBpY2tlclwiOiB0cnVlIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50c1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEhlbHBEaWFsb2cge1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgY29uc3Qgb3V0ZXIgPSAkKGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIG91dGVyLmFwcGVuZChcIjxoMz5HZXR0aW5nIHN0YXJ0ZWQ8L2gzPlwiKTtcclxuICAgICAgICAgICAgc3RvcmUuc3RhdGUuc2hvd0hlbHAgPyBvdXRlci5zaG93KCkgOiBvdXRlci5oaWRlKCk7XHJcbiAgICAgICAgICAgICQuZ2V0KFwiY29udGVudC9oZWxwLmh0bWxcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9zZSA9ICQoXCI8YnV0dG9uIGNsYXNzPSdidG4gYnRuLWRlZmF1bHQnPiBDbG9zZSA8L2J1dHRvbj5cIik7XHJcbiAgICAgICAgICAgICAgICBjbG9zZS5vbihcImNsaWNrXCIsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuZGlzcGF0Y2goKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgb3V0ZXIuYXBwZW5kKCQoZCkpXHJcbiAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoY2xvc2UpXHJcbiAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXCI8YSBjbGFzcz0ncmlnaHQnIGhyZWY9J21haWx0bzpmaWRkbGVzdGlja3NAY29kZWZsaWdodC5pbyc+RW1haWwgdXM8L2E+XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5zaG93SGVscENoYW5nZWQuc3ViKHNob3cgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2hvdyA/IG91dGVyLnNob3coKSA6IG91dGVyLmhpZGUoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgT3BlcmF0aW9uUGFuZWwge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSl7XHJcbiBcclxuICAgICAgICAgICAgY29uc3QgZG9tJCA9IHN0b3JlLm9wZXJhdGlvbiQubWFwKG9wID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKCFvcCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXYuaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXYub3BlcmF0aW9uXCIsIFtvcC5yZW5kZXIoKV0pO1xyXG4gICAgICAgICAgICB9KSAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTZWxlY3RlZEl0ZW1FZGl0b3Ige1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRvbSQgPSBzdG9yZS5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5vYnNlcnZlKClcclxuICAgICAgICAgICAgICAgIC5tYXAoaSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc0l0ZW0gPSA8UG9zaXRpb25lZE9iamVjdFJlZj5pLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gcG9zSXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBwb3NJdGVtLml0ZW1UeXBlID09PSAnVGV4dEJsb2NrJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBfLmZpbmQoc3RvcmUuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiID0+IGIuX2lkID09PSBwb3NJdGVtLml0ZW1JZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0OiBwb3NJdGVtLmNsaWVudFggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9wOiBwb3NJdGVtLmNsaWVudFkgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFRleHRCbG9ja0VkaXRvcihzdG9yZSkucmVuZGVyKGJsb2NrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRCbG9ja0VkaXRvciBleHRlbmRzIENvbXBvbmVudDxUZXh0QmxvY2s+IHtcclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW5kZXIodGV4dEJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIGxldCB1cGRhdGUgPSB0YiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0Yi5faWQgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyLmRpc3BhdGNoKHRiKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2LnRleHQtYmxvY2stZWRpdG9yXCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiB0ZXh0QmxvY2suX2lkXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJ0ZXh0YXJlYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2OiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoeyB0ZXh0OiAoPEhUTUxUZXh0QXJlYUVsZW1lbnQ+ZXYudGFyZ2V0KS52YWx1ZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoeyB0ZXh0OiBldi50YXJnZXQudmFsdWUgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1jb2xvci1pY29uLmZvcmVcIiwge30sIFwiQVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC50ZXh0LWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlRleHQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2sudGV4dENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB1cGRhdGUoeyB0ZXh0Q29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5iYWNrXCIsIHt9LCBcIkFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCYWNrZ3JvdW5kIGNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTa2V0Y2hIZWxwZXJzLmNvbG9yc0luVXNlKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgYmFja2dyb3VuZENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICh2bm9kZSkgPT4gQ29sb3JQaWNrZXIuZGVzdHJveSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaChcImJ1dHRvbi5kZWxldGUtdGV4dGJsb2NrLmJ0bi5idG4tZGFuZ2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZS5kaXNwYXRjaCh0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuLmdseXBoaWNvbi5nbHlwaGljb24tdHJhc2hcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1waWNrZXItY29udGFpbmVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEZvbnRQaWNrZXIodm5vZGUuZWxtLCB0aGlzLnN0b3JlLCB0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGluc2VydDogKHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IHByb3BzOiBGb250UGlja2VyUHJvcHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBzdG9yZTogdGhpcy5zdG9yZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHNlbGVjdGlvbjogdGV4dEJsb2NrLmZvbnREZXNjLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogKGZvbnREZXNjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgdXBkYXRlKHsgZm9udERlc2MgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIFJlYWN0RE9NLnJlbmRlcihyaChGb250UGlja2VyLCBwcm9wcyksIHZub2RlLmVsbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEdWFsQm91bmRzUGF0aFdhcnAgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBQT0lOVFNfUEVSX1BBVEggPSAyMDA7XHJcbiAgICAgICAgc3RhdGljIFVQREFURV9ERUJPVU5DRSA9IDE1MDtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc291cmNlOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICAgICAgcHJpdmF0ZSBfdXBwZXI6IFN0cmV0Y2hQYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX2xvd2VyOiBTdHJldGNoUGF0aDtcclxuICAgICAgICBwcml2YXRlIF93YXJwZWQ6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgICAgICBwcml2YXRlIF9vdXRsaW5lOiBwYXBlci5QYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX2N1c3RvbVN0eWxlOiBTa2V0Y2hJdGVtU3R5bGU7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBzb3VyY2U6IHBhcGVyLkNvbXBvdW5kUGF0aCxcclxuICAgICAgICAgICAgYm91bmRzPzogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH0sXHJcbiAgICAgICAgICAgIGN1c3RvbVN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcblxyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYnVpbGQgY2hpbGRyZW4gLS1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJvdW5kcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIgPSBuZXcgU3RyZXRjaFBhdGgoYm91bmRzLnVwcGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvd2VyID0gbmV3IFN0cmV0Y2hQYXRoKGJvdW5kcy5sb3dlcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cHBlciA9IG5ldyBTdHJldGNoUGF0aChbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy50b3BMZWZ0KSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLnRvcFJpZ2h0KVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb3dlciA9IG5ldyBTdHJldGNoUGF0aChbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy5ib3R0b21MZWZ0KSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLmJvdHRvbVJpZ2h0KVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbEJvdW5kc09wYWNpdHkgPSAwLjc1O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvd2VyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZSA9IG5ldyBwYXBlci5QYXRoKHsgY2xvc2VkOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVTaGFwZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChzb3VyY2UucGF0aERhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYWRkIGNoaWxkcmVuIC0tXHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkcmVuKFt0aGlzLl9vdXRsaW5lLCB0aGlzLl93YXJwZWQsIHRoaXMuX3VwcGVyLCB0aGlzLl9sb3dlcl0pO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYXNzaWduIHN0eWxlIC0tXHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1c3RvbVN0eWxlID0gY3VzdG9tU3R5bGUgfHwge1xyXG4gICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwiZ3JheVwiXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyAtLSBzZXQgdXAgb2JzZXJ2ZXJzIC0tXHJcblxyXG4gICAgICAgICAgICBSeC5PYnNlcnZhYmxlLm1lcmdlKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG93ZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpKVxyXG4gICAgICAgICAgICAgICAgLmRlYm91bmNlKER1YWxCb3VuZHNQYXRoV2FycC5VUERBVEVfREVCT1VOQ0UpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHBhdGggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT3V0bGluZVNoYXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVXYXJwZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VkKFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZShmbGFncyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkFUVFJJQlVURSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl91cHBlci52aXNpYmxlICE9PSB0aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb3dlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHVwcGVyKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdXBwZXIucGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBsb3dlcigpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvd2VyLnBhdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgc291cmNlKHZhbHVlOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2UgJiYgdGhpcy5fc291cmNlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc291cmNlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgY3VzdG9tU3R5bGUoKTogU2tldGNoSXRlbVN0eWxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1c3RvbVN0eWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGN1c3RvbVN0eWxlKHZhbHVlOiBTa2V0Y2hJdGVtU3R5bGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VzdG9tU3R5bGUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLnN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5iYWNrZ3JvdW5kQ29sb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGxpbmUuZmlsbENvbG9yID0gdmFsdWUuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGxpbmUuZmlsbENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGNvbnRyb2xCb3VuZHNPcGFjaXR5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIub3BhY2l0eSA9IHRoaXMuX2xvd2VyLm9wYWNpdHkgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG91dGxpbmVDb250YWlucyhwb2ludDogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX291dGxpbmUuY29udGFpbnMocG9pbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVXYXJwZWQoKSB7XHJcbiAgICAgICAgICAgIGxldCBvcnRoT3JpZ2luID0gdGhpcy5fc291cmNlLmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5fc291cmNlLmJvdW5kcy53aWR0aDtcclxuICAgICAgICAgICAgbGV0IG9ydGhIZWlnaHQgPSB0aGlzLl9zb3VyY2UuYm91bmRzLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLmR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbihcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyLnBhdGgsIHRoaXMuX2xvd2VyLnBhdGgpO1xyXG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtID0gbmV3IEZvbnRTaGFwZS5QYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChvcnRoT3JpZ2luKTtcclxuICAgICAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIG9ydGhIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhzID0gdGhpcy5fc291cmNlLmNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSA8cGFwZXIuUGF0aD5pdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhQb2ludHMgPSBQYXBlckhlbHBlcnMudHJhY2VQYXRoQXNQb2ludHMocGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgRHVhbEJvdW5kc1BhdGhXYXJwLlBPSU5UU19QRVJfUEFUSClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChwID0+IHRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludChwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFBhdGggPSBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geFBhdGg7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLmFkZENoaWxkcmVuKG5ld1BhdGhzKTtcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGMgb2YgdGhpcy5fd2FycGVkLmNoaWxkcmVuKXtcclxuICAgICAgICAgICAgICAgICg8cGFwZXIuUGF0aD5jKS5zaW1wbGlmeSgwLjAwMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlT3V0bGluZVNoYXBlKCkge1xyXG4gICAgICAgICAgICBjb25zdCBsb3dlciA9IG5ldyBwYXBlci5QYXRoKHRoaXMuX2xvd2VyLnBhdGguc2VnbWVudHMpO1xyXG4gICAgICAgICAgICBsb3dlci5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGxpbmUuc2VnbWVudHMgPSB0aGlzLl91cHBlci5wYXRoLnNlZ21lbnRzLmNvbmNhdChsb3dlci5zZWdtZW50cyk7XHJcbiAgICAgICAgICAgIGxvd2VyLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFBhdGhIYW5kbGUgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBTRUdNRU5UX01BUktFUl9SQURJVVMgPSAxMDtcclxuICAgICAgICBzdGF0aWMgQ1VSVkVfTUFSS0VSX1JBRElVUyA9IDY7XHJcbiAgICAgICAgc3RhdGljIERSQUdfVEhSRVNIT0xEID0gMztcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfbWFya2VyOiBwYXBlci5TaGFwZTtcclxuICAgICAgICBwcml2YXRlIF9zZWdtZW50OiBwYXBlci5TZWdtZW50O1xyXG4gICAgICAgIHByaXZhdGUgX2N1cnZlOiBwYXBlci5DdXJ2ZTtcclxuICAgICAgICBwcml2YXRlIF9zbW9vdGhlZDogYm9vbGVhbjtcclxuICAgICAgICBwcml2YXRlIF9jdXJ2ZVNwbGl0ID0gbmV3IE9ic2VydmFibGVFdmVudDxudW1iZXI+KCk7XHJcbiAgICAgICAgcHJpdmF0ZSBfY3VydmVDaGFuZ2VVbnN1YjogKCkgPT4gdm9pZDtcclxuICAgICAgICBwcml2YXRlIGRyYWdnaW5nO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihhdHRhY2g6IHBhcGVyLlNlZ21lbnQgfCBwYXBlci5DdXJ2ZSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uOiBwYXBlci5Qb2ludDtcclxuICAgICAgICAgICAgbGV0IHBhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgICAgIGlmIChhdHRhY2ggaW5zdGFuY2VvZiBwYXBlci5TZWdtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gPHBhcGVyLlNlZ21lbnQ+YXR0YWNoO1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLl9zZWdtZW50LnBvaW50O1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHRoaXMuX3NlZ21lbnQucGF0aDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChhdHRhY2ggaW5zdGFuY2VvZiBwYXBlci5DdXJ2ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VydmUgPSA8cGFwZXIuQ3VydmU+YXR0YWNoO1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gdGhpcy5fY3VydmUucGF0aDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiYXR0YWNoIG11c3QgYmUgU2VnbWVudCBvciBDdXJ2ZVwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIgPSBwYXBlci5TaGFwZS5DaXJjbGUocG9zaXRpb24sIFBhdGhIYW5kbGUuU0VHTUVOVF9NQVJLRVJfUkFESVVTKTtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLnN0cm9rZUNvbG9yID0gXCJibHVlXCI7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5maWxsQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5zZWxlY3RlZENvbG9yID0gbmV3IHBhcGVyLkNvbG9yKDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX21hcmtlcik7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZUFzU2VnbWVudCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZUFzQ3VydmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcGFwZXJFeHQuZXh0ZW5kTW91c2VFdmVudHModGhpcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uKHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdTdGFydCwgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3BsaXQgdGhlIGN1cnZlLCBwdXBhdGUgdG8gc2VnbWVudCBoYW5kbGVcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VydmVDaGFuZ2VVbnN1YigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQgPSBuZXcgcGFwZXIuU2VnbWVudCh0aGlzLmNlbnRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VydmVJZHggPSB0aGlzLl9jdXJ2ZS5pbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZS5wYXRoLmluc2VydChcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VydmVJZHggKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZUFzU2VnbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VydmVTcGxpdC5ub3RpZnkoY3VydmVJZHgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlRHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LnBvaW50ID0gdGhpcy5jZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3Ntb290aGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2xhdGUoZXYuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgZXYuc3RvcCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc21vb3RoZWQgPSAhdGhpcy5zbW9vdGhlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGV2LnN0b3AoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jdXJ2ZUNoYW5nZVVuc3ViID0gcGF0aC5zdWJzY3JpYmUoZmxhZ3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnZlICYmICF0aGlzLl9zZWdtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgJiYgKGZsYWdzICYgUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5TRUdNRU5UUykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuX2N1cnZlLmdldFBvaW50QXQodGhpcy5fY3VydmUubGVuZ3RoICogMC41KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHNtb290aGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc21vb3RoZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgc21vb3RoZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdGhpcy5fc21vb3RoZWQgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuaGFuZGxlSW4gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5oYW5kbGVPdXQgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgY3VydmVTcGxpdCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnZlU3BsaXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgY2VudGVyKCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgY2VudGVyKHBvaW50OiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9pbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0eWxlQXNTZWdtZW50KCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIub3BhY2l0eSA9IDAuODtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLmRhc2hBcnJheSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5yYWRpdXMgPSBQYXRoSGFuZGxlLlNFR01FTlRfTUFSS0VSX1JBRElVUztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3R5bGVBc0N1cnZlKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIub3BhY2l0eSA9IDAuODtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLmRhc2hBcnJheSA9IFsyLCAyXTtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLnJhZGl1cyA9IFBhdGhIYW5kbGUuQ1VSVkVfTUFSS0VSX1JBRElVUztcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdHJldGNoUGF0aCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfcGF0aDogcGFwZXIuUGF0aDtcclxuICAgICAgICBwcml2YXRlIF9wYXRoQ2hhbmdlZCA9IG5ldyBPYnNlcnZhYmxlRXZlbnQ8cGFwZXIuUGF0aD4oKTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc2VnbWVudHM6IHBhcGVyLlNlZ21lbnRbXSwgc3R5bGU/OiBwYXBlci5TdHlsZSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcGF0aCA9IG5ldyBwYXBlci5QYXRoKHNlZ21lbnRzKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9wYXRoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdHlsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHlsZSA9IHN0eWxlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHJva2VDb2xvciA9IFwibGlnaHRncmF5XCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXRoLnN0cm9rZVdpZHRoID0gNjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBzIG9mIHRoaXMuX3BhdGguc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkU2VnbWVudEhhbmRsZShzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBjIG9mIHRoaXMuX3BhdGguY3VydmVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKGMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgcGF0aCgpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgcGF0aENoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXRoQ2hhbmdlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYWRkU2VnbWVudEhhbmRsZShzZWdtZW50OiBwYXBlci5TZWdtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkSGFuZGxlKG5ldyBQYXRoSGFuZGxlKHNlZ21lbnQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYWRkQ3VydmVIYW5kbGUoY3VydmU6IHBhcGVyLkN1cnZlKSB7XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGUgPSBuZXcgUGF0aEhhbmRsZShjdXJ2ZSk7XHJcbiAgICAgICAgICAgIGhhbmRsZS5jdXJ2ZVNwbGl0LnN1YnNjcmliZU9uZShjdXJ2ZUlkeCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKHRoaXMuX3BhdGguY3VydmVzW2N1cnZlSWR4XSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKHRoaXMuX3BhdGguY3VydmVzW2N1cnZlSWR4ICsgMV0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5hZGRIYW5kbGUoaGFuZGxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYWRkSGFuZGxlKGhhbmRsZTogUGF0aEhhbmRsZSkge1xyXG4gICAgICAgICAgICBoYW5kbGUudmlzaWJsZSA9IHRoaXMudmlzaWJsZTtcclxuICAgICAgICAgICAgaGFuZGxlLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGhDaGFuZ2VkLm5vdGlmeSh0aGlzLl9wYXRoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGhDaGFuZ2VkLm5vdGlmeSh0aGlzLl9wYXRoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChoYW5kbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1lYXN1cmVzIG9mZnNldHMgb2YgdGV4dCBnbHlwaHMuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBUZXh0UnVsZXIge1xyXG5cclxuICAgICAgICBmb250RmFtaWx5OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFdlaWdodDogbnVtYmVyO1xyXG4gICAgICAgIGZvbnRTaXplOiBudW1iZXI7XHJcblxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlUG9pbnRUZXh0KHRleHQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICAgICAgdmFyIHBvaW50VGV4dCA9IG5ldyBwYXBlci5Qb2ludFRleHQoKTtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmNvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgICAgICBwb2ludFRleHQuanVzdGlmaWNhdGlvbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZvbnRGYW1pbHkpIHtcclxuICAgICAgICAgICAgICAgIHBvaW50VGV4dC5mb250RmFtaWx5ID0gdGhpcy5mb250RmFtaWx5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZvbnRXZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHBvaW50VGV4dC5mb250V2VpZ2h0ID0gdGhpcy5mb250V2VpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZvbnRTaXplKSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludFRleHQuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcG9pbnRUZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0VGV4dE9mZnNldHModGV4dCkge1xyXG4gICAgICAgICAgICAvLyBNZWFzdXJlIGdseXBocyBpbiBwYWlycyB0byBjYXB0dXJlIHdoaXRlIHNwYWNlLlxyXG4gICAgICAgICAgICAvLyBQYWlycyBhcmUgY2hhcmFjdGVycyBpIGFuZCBpKzEuXHJcbiAgICAgICAgICAgIHZhciBnbHlwaFBhaXJzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2x5cGhQYWlyc1tpXSA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGksIGkgKyAxKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEZvciBlYWNoIGNoYXJhY3RlciwgZmluZCBjZW50ZXIgb2Zmc2V0LlxyXG4gICAgICAgICAgICB2YXIgeE9mZnNldHMgPSBbMF07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE1lYXN1cmUgdGhyZWUgY2hhcmFjdGVycyBhdCBhIHRpbWUgdG8gZ2V0IHRoZSBhcHByb3ByaWF0ZSBcclxuICAgICAgICAgICAgICAgIC8vICAgc3BhY2UgYmVmb3JlIGFuZCBhZnRlciB0aGUgZ2x5cGguXHJcbiAgICAgICAgICAgICAgICB2YXIgdHJpYWRUZXh0ID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSAtIDEsIGkgKyAxKSk7XHJcbiAgICAgICAgICAgICAgICB0cmlhZFRleHQucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3VidHJhY3Qgb3V0IGhhbGYgb2YgcHJpb3IgZ2x5cGggcGFpciBcclxuICAgICAgICAgICAgICAgIC8vICAgYW5kIGhhbGYgb2YgY3VycmVudCBnbHlwaCBwYWlyLlxyXG4gICAgICAgICAgICAgICAgLy8gTXVzdCBiZSByaWdodCwgYmVjYXVzZSBpdCB3b3Jrcy5cclxuICAgICAgICAgICAgICAgIGxldCBvZmZzZXRXaWR0aCA9IHRyaWFkVGV4dC5ib3VuZHMud2lkdGhcclxuICAgICAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaSAtIDFdLmJvdW5kcy53aWR0aCAvIDJcclxuICAgICAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaV0uYm91bmRzLndpZHRoIC8gMjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHdpZHRoIHRvIHByaW9yIG9mZnNldC4gXHJcbiAgICAgICAgICAgICAgICB4T2Zmc2V0c1tpXSA9IHhPZmZzZXRzW2kgLSAxXSArIG9mZnNldFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBnbHlwaFBhaXIgb2YgZ2x5cGhQYWlycykge1xyXG4gICAgICAgICAgICAgICAgZ2x5cGhQYWlyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4geE9mZnNldHM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBUZXh0V2FycCBleHRlbmRzIER1YWxCb3VuZHNQYXRoV2FycCB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBERUZBVUxUX0ZPTlRfU0laRSA9IDEyODtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfZm9udDogb3BlbnR5cGUuRm9udDtcclxuICAgICAgICBwcml2YXRlIF90ZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBfZm9udFNpemU6IG51bWJlcjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgIGZvbnQ6IG9wZW50eXBlLkZvbnQsXHJcbiAgICAgICAgICAgIHRleHQ6IHN0cmluZyxcclxuICAgICAgICAgICAgYm91bmRzPzogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH0sXHJcbiAgICAgICAgICAgIGZvbnRTaXplPzogbnVtYmVyLFxyXG4gICAgICAgICAgICBzdHlsZT86IFNrZXRjaEl0ZW1TdHlsZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFmb250U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgZm9udFNpemUgPSBUZXh0V2FycC5ERUZBVUxUX0ZPTlRfU0laRTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBUZXh0V2FycC5nZXRQYXRoRGF0YShmb250LCB0ZXh0LCBmb250U2l6ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIHN1cGVyKHBhdGgsIGJvdW5kcywgc3R5bGUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHQgPSB0ZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgdGV4dCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGZvbnRTaXplKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldCBmb250U2l6ZSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgZm9udCh2YWx1ZTogb3BlbnR5cGUuRm9udCkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IHRoaXMuX2ZvbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGV4dFBhdGgoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXBkYXRlVGV4dFBhdGgoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGhEYXRhID0gVGV4dFdhcnAuZ2V0UGF0aERhdGEoXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250LCB0aGlzLl90ZXh0LCB0aGlzLl9mb250U2l6ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBnZXRQYXRoRGF0YShmb250OiBvcGVudHlwZS5Gb250LFxyXG4gICAgICAgICAgICB0ZXh0OiBzdHJpbmcsIGZvbnRTaXplPzogc3RyaW5nIHwgbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IG9wZW5UeXBlUGF0aCA9IGZvbnQuZ2V0UGF0aCh0ZXh0LCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgTnVtYmVyKGZvbnRTaXplKSB8fCBUZXh0V2FycC5ERUZBVUxUX0ZPTlRfU0laRSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvcGVuVHlwZVBhdGgudG9QYXRoRGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFNrZXRjaEl0ZW1TdHlsZSBleHRlbmRzIHBhcGVyLklTdHlsZSB7XHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxufSJdfQ==