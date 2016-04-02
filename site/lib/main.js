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
            var view = this.project.view;
            $(view.element).mousewheel(function (event) {
                var mousePosition = new paper.Point(event.offsetX, event.offsetY);
                _this.changeZoomCentered(event.deltaY, mousePosition);
            });
            var didDrag = false;
            view.on(paper.EventType.mouseDrag, function (ev) {
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
            view.on(paper.EventType.mouseUp, function (ev) {
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
                var currentText = store.design.text;
                var newTemplateState = t.createNew(context);
                if (currentText && currentText.length) {
                    newTemplateState.design.text = currentText;
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
                _this.store.updateTemplateState({ design: { text: "The rain in Spain falls mainly in the plain" }
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
            FontShape.VerticalBoundsStretchPath.pointsPerPath = 300;
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
            if (!this.store.design.text || !this.store.design.text.length) {
                return;
            }
            // Half of max DPI produces approx 4200x4200.
            var dpi = 0.5 * PaperHelpers.getMaxExportDpi(this.project.activeLayer.bounds.size);
            var raster = this.project.activeLayer.rasterize(dpi, false);
            var data = raster.toDataURL();
            var fileName = Fstx.Framework.createFileName(this.store.design.text, 40, "png");
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
            return this.store.template.build(design, this.context).then(function (item) {
                try {
                    if (!item) {
                        console.log("no render result from", design);
                        return;
                    }
                    item.fitBounds(_this.project.view.bounds);
                    item.bounds.point = _this.project.view.bounds.topLeft;
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
            this.state.templateState = { design: value };
            this._templateState$.onNext(this.state.templateState);
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
                if (!design.text) {
                    return Promise.resolve(null);
                }
                return context.getFont(design.font).then(function (font) {
                    var words = design.text.toLocaleUpperCase().split(/\s/);
                    var lines;
                    switch (design.shape) {
                        case "narrow":
                            lines = _this.splitWordsNarrow(words);
                            break;
                        case "wide":
                            lines = _this.splitWordsWide(words);
                            break;
                        default:
                            lines = _this.splitWordsNarrow(words);
                            break;
                    }
                    var textColor = design.palette && design.palette.color || "black";
                    var backgroundColor = "white";
                    if (design.palette && design.palette.invert) {
                        _a = [backgroundColor, textColor], textColor = _a[0], backgroundColor = _a[1];
                    }
                    var box = new paper.Group();
                    var blocks = lines.map(function (l) {
                        var pathData = font.getPath(l, 0, 0, _this.defaultFontSize).toPathData();
                        return new paper.CompoundPath(pathData);
                    });
                    var maxWidth = _.max(blocks.map(function (b) { return b.bounds.width; }));
                    var lineHeight = blocks[0].bounds.height;
                    var upper = new paper.Path([
                        new paper.Point(0, 0),
                        new paper.Point(maxWidth, 0)
                    ]);
                    var lower;
                    var remaining = blocks.length;
                    var seedRandom = new Framework.SeedRandom(design.seed == null ? Math.random() : design.seed);
                    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
                        var block = blocks_1[_i];
                        if (--remaining <= 0) {
                            var mid = upper.bounds.center;
                            // last lower line is level
                            lower = new paper.Path([
                                new paper.Point(0, mid.y + lineHeight),
                                new paper.Point(maxWidth, mid.y + lineHeight)
                            ]);
                        }
                        else {
                            lower = _this.randomLowerPathFor(upper, lineHeight, seedRandom);
                        }
                        var stretch = new FontShape.VerticalBoundsStretchPath(block, { upper: upper, lower: lower });
                        stretch.fillColor = textColor;
                        box.addChild(stretch);
                        upper = lower;
                        lower = null;
                    }
                    var bounds = box.bounds.clone();
                    bounds.size = bounds.size.multiply(1.1);
                    bounds.center = box.bounds.center;
                    var background = paper.Shape.Rectangle(bounds);
                    background.fillColor = backgroundColor;
                    box.insertChild(0, background);
                    return box;
                    var _a;
                });
            };
            Dickens.prototype.randomLowerPathFor = function (upper, avgHeight, seedRandom) {
                var points = [];
                var upperCenter = upper.bounds.center;
                var x = 0;
                var numPoints = 4;
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
            Dickens.prototype.splitWordsNarrow = function (words) {
                var lines = [];
                var ideal = _.max(words.map(function (w) { return w.length; }));
                var calcScore = function (text) {
                    return Math.pow(Math.abs(ideal - text.length), 2);
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
            Dickens.prototype.splitWordsWide = function (words) {
                var targetLength = _.sum(words.map(function (w) { return w.length + 1; })) / 2;
                var firstLine = words;
                var secondLine = [];
                var secondLineLength = 0;
                while (secondLineLength < targetLength) {
                    var word = words.pop();
                    secondLine.unshift(word);
                    secondLineLength += word.length + 1;
                }
                return [
                    firstLine.join(" "),
                    secondLine.join(" ")
                ];
            };
            Dickens.prototype.createTextEntry = function () {
                var textInput = new SketchBuilder.TextInput();
                return {
                    createNode: function (value) {
                        return h("div", [
                            h("h3", {}, ["Message"]),
                            textInput.createNode(value && value.design.text, "What do you want to say?", true)
                        ]);
                    },
                    value$: textInput.value$.map(function (v) {
                        return { design: { text: v } };
                    })
                };
            };
            Dickens.prototype.createShapeChooser = function (context) {
                var value$ = new Rx.Subject();
                return {
                    createNode: function (ts) {
                        var choices = ["narrow", "wide"].map(function (shape) { return {
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
            // events.subscribe(m => console.log("event", m.type, m.data));
            // actions.subscribe(m => console.log("action", m.type, m.data));
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
        /**
         * @returns data URL
         */
        WorkspaceController.prototype.getSnapshotPNG = function (dpi) {
            var background = this.insertBackground();
            var raster = this.project.activeLayer.rasterize(dpi, false);
            var data = raster.toDataURL();
            background.remove();
            return data;
        };
        WorkspaceController.prototype.downloadPNG = function () {
            // Half of max DPI produces approx 4200x4200.
            var dpi = 0.5 * PaperHelpers.getMaxExportDpi(this.project.activeLayer.bounds.size);
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
                                _this.store.actions.sketch.attrUpdate.dispatch({ backgroundColor: color && color.toHexString() });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Eb21IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0Rvd25sb2FkSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL1NlZWRSYW5kb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2NvbGxlY3Rpb25zLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2V2ZW50cy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJOb3RpZnkudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvVmlld1pvb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvbW91c2VFdmVudEV4dC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9wYXBlci9wYXBlci1leHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9Db21wb25lbnQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9WRG9tSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwQ29va2llcy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L2FwcC9BcHBSb3V0ZXIudHMiLCIuLi8uLi9jbGllbnQvYXBwL1N0b3JlLnRzIiwiLi4vLi4vY2xpZW50L2RlbW8vRGVtb01vZHVsZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL0J1aWxkZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9Nb2R1bGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9QcmV2aWV3Q2FudmFzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvUmVuZGVyQ2FudmFzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvU2hhcmVPcHRpb25zVUkudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL21vZGVscy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL2NvbnRyb2xzL0NvbnRyb2xIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvRm9udENob29zZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9JbWFnZUNob29zZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9UZW1wbGF0ZUZvbnRDaG9vc2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvVGV4dElucHV0LnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvdGVtcGxhdGVzL0RpY2tlbnMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL0RvY3VtZW50S2V5SGFuZGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvU2tldGNoRWRpdG9yTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9Ta2V0Y2hIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvV29ya3NwYWNlQ29udHJvbGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvY2hhbm5lbHMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL2NvbnN0YW50cy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvbW9kZWxzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9zZXJ2aWNlcy9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivc2VydmljZXMvUzNBY2Nlc3MudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0NvbG9yUGlja2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9FZGl0b3JCYXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0ZvbnRQaWNrZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0hlbHBEaWFsb2cudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL1NlbGVjdGVkSXRlbUVkaXRvci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivdmlld3MvVGV4dEJsb2NrRWRpdG9yLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvRHVhbEJvdW5kc1BhdGhXYXJwLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvUGF0aEhhbmRsZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1N0cmV0Y2hQYXRoLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvVGV4dFJ1bGVyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvVGV4dFdhcnAudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9pbnRlcmZhY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsSUFBVSxVQUFVLENBd0xuQjtBQXhMRCxXQUFVLFVBQVUsRUFBQyxDQUFDO0lBRWxCOzs7Ozs7T0FNRztJQUNILHVCQUE4QixPQUFPO1FBQ2pDLElBQUksYUFBYSxHQUFH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QUMsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDbkIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUMxQixDQUFDO1lBQ0wsQ0FBQzs7O1dBQUE7UUFFRCxpQ0FBYyxHQUFkO1lBQ0ksSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FDakMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBRWMsb0JBQVcsR0FBMUIsVUFBMkIsSUFBbUIsRUFDMUMsSUFBWSxFQUFFLFFBQTBCO1lBQ3hDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3RDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNwRCxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3JDLENBQUM7UUFqRU0sMEJBQWlCLEdBQUcsR0FBRyxDQUFDO1FBa0VuQyxlQUFDO0lBQUQsQ0FBQyxBQXBFRCxDQUE4QiwrQkFBa0IsR0FvRS9DO0lBcEVZLHFCQUFRLFdBb0VwQixDQUFBO0FBRUwsQ0FBQyxFQXhFUyxZQUFZLEtBQVosWUFBWSxRQXdFckI7QUNsRUEiLCJzb3VyY2VzQ29udGVudCI6WyJcclxubmFtZXNwYWNlIERvbUhlbHBlcnMge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIGJsb2IgZnJvbSBhIGRhdGEgVVJMIChlaXRoZXIgYmFzZTY0IGVuY29kZWQgb3Igbm90KS5cclxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9lYmlkZWwvZmlsZXIuanMvYmxvYi9tYXN0ZXIvc3JjL2ZpbGVyLmpzI0wxMzdcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YVVSTCBUaGUgZGF0YSBVUkwgdG8gY29udmVydC5cclxuICAgICAqIEByZXR1cm4ge0Jsb2J9IEEgYmxvYiByZXByZXNlbnRpbmcgdGhlIGFycmF5IGJ1ZmZlciBkYXRhLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGF0YVVSTFRvQmxvYihkYXRhVVJMKTogQmxvYiB7XHJcbiAgICAgICAgdmFyIEJBU0U2NF9NQVJLRVIgPSAnO2Jhc2U2NCwnO1xyXG4gICAgICAgIGlmIChkYXRhVVJMLmluZGV4T2YoQkFTRTY0X01BUktFUikgPT0gLTEpIHtcclxuICAgICAgICAgICAgdmFyIHBhcnRzID0gZGF0YVVSTC5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSBwYXJ0c1swXS5zcGxpdCgnOicpWzFdO1xyXG4gICAgICAgICAgICB2YXIgcmF3ID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQmxvYihbcmF3XSwgeyB0eXBlOiBjb250ZW50VHlwZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwYXJ0cyA9IGRhdGFVUkwuc3BsaXQoQkFTRTY0X01BUktFUik7XHJcbiAgICAgICAgdmFyIGNvbnRlbnRUeXBlID0gcGFydHNbMF0uc3BsaXQoJzonKVsxXTtcclxuICAgICAgICB2YXIgcmF3ID0gd2luZG93LmF0b2IocGFydHNbMV0pO1xyXG4gICAgICAgIHZhciByYXdMZW5ndGggPSByYXcubGVuZ3RoO1xyXG5cclxuICAgICAgICB2YXIgdUludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KHJhd0xlbmd0aCk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3TGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdUludDhBcnJheVtpXSA9IHJhdy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBCbG9iKFt1SW50OEFycmF5XSwgeyB0eXBlOiBjb250ZW50VHlwZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5pdEVycm9ySGFuZGxlcihsb2dnZXI6IChlcnJvckRhdGE6IE9iamVjdCkgPT4gdm9pZCkge1xyXG5cclxuICAgICAgICB3aW5kb3cub25lcnJvciA9IGZ1bmN0aW9uKG1zZywgZmlsZSwgbGluZSwgY29sLCBlcnJvcjogRXJyb3IgfCBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBzdGFja2ZyYW1lcyA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbXNnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6IGxpbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2w6IGNvbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrOiBzdGFja2ZyYW1lc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGxvZyBlcnJvclwiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGVycmJhY2sgPSBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gbG9nIGVycm9yXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3IgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcig8c3RyaW5nPmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhc0Vycm9yID0gdHlwZW9mIGVycm9yID09PSBcInN0cmluZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgPyBuZXcgRXJyb3IoZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgOiBlcnJvcjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFjayA9IFN0YWNrVHJhY2UuZnJvbUVycm9yKGFzRXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycmJhY2spO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmYWlsZWQgdG8gbG9nIGVycm9yXCIsIGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgS2V5Q29kZXMgPSB7XHJcbiAgICAgICAgQmFja1NwYWNlOiA4LFxyXG4gICAgICAgIFRhYjogOSxcclxuICAgICAgICBFbnRlcjogMTMsXHJcbiAgICAgICAgU2hpZnQ6IDE2LFxyXG4gICAgICAgIEN0cmw6IDE3LFxyXG4gICAgICAgIEFsdDogMTgsXHJcbiAgICAgICAgUGF1c2VCcmVhazogMTksXHJcbiAgICAgICAgQ2Fwc0xvY2s6IDIwLFxyXG4gICAgICAgIEVzYzogMjcsXHJcbiAgICAgICAgUGFnZVVwOiAzMyxcclxuICAgICAgICBQYWdlRG93bjogMzQsXHJcbiAgICAgICAgRW5kOiAzNSxcclxuICAgICAgICBIb21lOiAzNixcclxuICAgICAgICBBcnJvd0xlZnQ6IDM3LFxyXG4gICAgICAgIEFycm93VXA6IDM4LFxyXG4gICAgICAgIEFycm93UmlnaHQ6IDM5LFxyXG4gICAgICAgIEFycm93RG93bjogNDAsXHJcbiAgICAgICAgSW5zZXJ0OiA0NSxcclxuICAgICAgICBEZWxldGU6IDQ2LFxyXG4gICAgICAgIERpZ2l0MDogNDgsXHJcbiAgICAgICAgRGlnaXQxOiA0OSxcclxuICAgICAgICBEaWdpdDI6IDUwLFxyXG4gICAgICAgIERpZ2l0MzogNTEsXHJcbiAgICAgICAgRGlnaXQ0OiA1MixcclxuICAgICAgICBEaWdpdDU6IDUzLFxyXG4gICAgICAgIERpZ2l0NjogNTQsXHJcbiAgICAgICAgRGlnaXQ3OiA1NSxcclxuICAgICAgICBEaWdpdDg6IDU2LFxyXG4gICAgICAgIERpZ2l0OTogNTcsXHJcbiAgICAgICAgQTogNjUsXHJcbiAgICAgICAgQjogNjYsXHJcbiAgICAgICAgQzogNjcsXHJcbiAgICAgICAgRDogNjgsXHJcbiAgICAgICAgRTogNjksXHJcbiAgICAgICAgRjogNzAsXHJcbiAgICAgICAgRzogNzEsXHJcbiAgICAgICAgSDogNzIsXHJcbiAgICAgICAgSTogNzMsXHJcbiAgICAgICAgSjogNzQsXHJcbiAgICAgICAgSzogNzUsXHJcbiAgICAgICAgTDogNzYsXHJcbiAgICAgICAgTTogNzcsXHJcbiAgICAgICAgTjogNzgsXHJcbiAgICAgICAgTzogNzksXHJcbiAgICAgICAgUDogODAsXHJcbiAgICAgICAgUTogODEsXHJcbiAgICAgICAgUjogODIsXHJcbiAgICAgICAgUzogODMsXHJcbiAgICAgICAgVDogODQsXHJcbiAgICAgICAgVTogODUsXHJcbiAgICAgICAgVjogODYsXHJcbiAgICAgICAgVzogODcsXHJcbiAgICAgICAgWDogODgsXHJcbiAgICAgICAgWTogODksXHJcbiAgICAgICAgWjogOTAsXHJcbiAgICAgICAgV2luZG93TGVmdDogOTEsXHJcbiAgICAgICAgV2luZG93UmlnaHQ6IDkyLFxyXG4gICAgICAgIFNlbGVjdEtleTogOTMsXHJcbiAgICAgICAgTnVtcGFkMDogOTYsXHJcbiAgICAgICAgTnVtcGFkMTogOTcsXHJcbiAgICAgICAgTnVtcGFkMjogOTgsXHJcbiAgICAgICAgTnVtcGFkMzogOTksXHJcbiAgICAgICAgTnVtcGFkNDogMTAwLFxyXG4gICAgICAgIE51bXBhZDU6IDEwMSxcclxuICAgICAgICBOdW1wYWQ2OiAxMDIsXHJcbiAgICAgICAgTnVtcGFkNzogMTAzLFxyXG4gICAgICAgIE51bXBhZDg6IDEwNCxcclxuICAgICAgICBOdW1wYWQ5OiAxMDUsXHJcbiAgICAgICAgTXVsdGlwbHk6IDEwNixcclxuICAgICAgICBBZGQ6IDEwNyxcclxuICAgICAgICBTdWJ0cmFjdDogMTA5LFxyXG4gICAgICAgIERlY2ltYWxQb2ludDogMTEwLFxyXG4gICAgICAgIERpdmlkZTogMTExLFxyXG4gICAgICAgIEYxOiAxMTIsXHJcbiAgICAgICAgRjI6IDExMyxcclxuICAgICAgICBGMzogMTE0LFxyXG4gICAgICAgIEY0OiAxMTUsXHJcbiAgICAgICAgRjU6IDExNixcclxuICAgICAgICBGNjogMTE3LFxyXG4gICAgICAgIEY3OiAxMTgsXHJcbiAgICAgICAgRjg6IDExOSxcclxuICAgICAgICBGOTogMTIwLFxyXG4gICAgICAgIEYxMDogMTIxLFxyXG4gICAgICAgIEYxMTogMTIyLFxyXG4gICAgICAgIEYxMjogMTIzLFxyXG4gICAgICAgIE51bUxvY2s6IDE0NCxcclxuICAgICAgICBTY3JvbGxMb2NrOiAxNDUsXHJcbiAgICAgICAgU2VtaUNvbG9uOiAxODYsXHJcbiAgICAgICAgRXF1YWw6IDE4NyxcclxuICAgICAgICBDb21tYTogMTg4LFxyXG4gICAgICAgIERhc2g6IDE4OSxcclxuICAgICAgICBQZXJpb2Q6IDE5MCxcclxuICAgICAgICBGb3J3YXJkU2xhc2g6IDE5MSxcclxuICAgICAgICBHcmF2ZUFjY2VudDogMTkyLFxyXG4gICAgICAgIEJyYWNrZXRPcGVuOiAyMTksXHJcbiAgICAgICAgQmFja1NsYXNoOiAyMjAsXHJcbiAgICAgICAgQnJhY2tldENsb3NlOiAyMjEsXHJcbiAgICAgICAgU2luZ2xlUXVvdGU6IDIyMlxyXG4gICAgfTtcclxuXHJcbn0iLCJuYW1lc3BhY2UgRnN0eC5GcmFtZXdvcmsge1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGaWxlTmFtZSh0ZXh0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBleHRlbnNpb246IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IG5hbWUgPSBcIlwiO1xyXG4gICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiB0ZXh0LnNwbGl0KC9cXHMvKSkge1xyXG4gICAgICAgICAgICBjb25zdCB0cmltID0gd29yZC5yZXBsYWNlKC9cXFcvZywgJycpLnRyaW0oKTtcclxuICAgICAgICAgICAgaWYgKHRyaW0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZihuYW1lLmxlbmd0aCAmJiBuYW1lLmxlbmd0aCArIHRyaW0ubGVuZ3RoICsgMSA+IG1heExlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGgpIG5hbWUgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICBuYW1lICs9IHRyaW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5hbWUgKyBcIi5cIiArIGV4dGVuc2lvbjtcclxuICAgIH1cclxuXHJcbn0iLCJcclxubmFtZXNwYWNlIEZvbnRIZWxwZXJzIHtcclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBFbGVtZW50Rm9udFN0eWxlIHtcclxuICAgICAgICBmb250RmFtaWx5Pzogc3RyaW5nO1xyXG4gICAgICAgIGZvbnRXZWlnaHQ/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFN0eWxlPzogc3RyaW5nOyBcclxuICAgICAgICBmb250U2l6ZT86IHN0cmluZzsgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRDc3NTdHlsZShmYW1pbHk6IHN0cmluZywgdmFyaWFudD86IHN0cmluZywgc2l6ZT86IHN0cmluZyl7XHJcbiAgICAgICAgbGV0IHN0eWxlID0gPEVsZW1lbnRGb250U3R5bGU+eyBmb250RmFtaWx5OiBmYW1pbHkgfTtcclxuICAgICAgICBpZih2YXJpYW50ICYmIHZhcmlhbnQuaW5kZXhPZihcIml0YWxpY1wiKSA+PSAwKXtcclxuICAgICAgICAgICAgc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG51bWVyaWMgPSB2YXJpYW50ICYmIHZhcmlhbnQucmVwbGFjZSgvW15cXGRdL2csIFwiXCIpO1xyXG4gICAgICAgIGlmKG51bWVyaWMgJiYgbnVtZXJpYy5sZW5ndGgpe1xyXG4gICAgICAgICAgICBzdHlsZS5mb250V2VpZ2h0ID0gbnVtZXJpYy50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzaXplKXtcclxuICAgICAgICAgICAgc3R5bGUuZm9udFNpemUgPSBzaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3R5bGU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRTdHlsZVN0cmluZyhmYW1pbHk6IHN0cmluZywgdmFyaWFudDogc3RyaW5nLCBzaXplPzogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHN0eWxlT2JqID0gZ2V0Q3NzU3R5bGUoZmFtaWx5LCB2YXJpYW50LCBzaXplKTtcclxuICAgICAgICBsZXQgcGFydHMgPSBbXTtcclxuICAgICAgICBpZihzdHlsZU9iai5mb250RmFtaWx5KXtcclxuICAgICAgICAgICAgcGFydHMucHVzaChgZm9udC1mYW1pbHk6JyR7c3R5bGVPYmouZm9udEZhbWlseX0nYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0eWxlT2JqLmZvbnRXZWlnaHQpe1xyXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LXdlaWdodDoke3N0eWxlT2JqLmZvbnRXZWlnaHR9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0eWxlT2JqLmZvbnRTdHlsZSl7XHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goYGZvbnQtc3R5bGU6JHtzdHlsZU9iai5mb250U3R5bGV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0eWxlT2JqLmZvbnRTaXplKXtcclxuICAgICAgICAgICAgcGFydHMucHVzaChgZm9udC1zaXplOiR7c3R5bGVPYmouZm9udFNpemV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXJ0cy5qb2luKFwiOyBcIik7XHJcbiAgICB9XHJcbiAgICBcclxufSIsIm5hbWVzcGFjZSBGcmFtZXdvcmsge1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBsb2d0YXA8VD4obWVzc2FnZTogc3RyaW5nLCBzdHJlYW06IFJ4Lk9ic2VydmFibGU8VD4pOiBSeC5PYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICByZXR1cm4gc3RyZWFtLnRhcCh0ID0+IGNvbnNvbGUubG9nKG1lc3NhZ2UsIHQpKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbmV3aWQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gKG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgTWF0aC5yYW5kb20oKSlcclxuICAgICAgICAgICAgLnRvU3RyaW5nKDM2KS5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgfVxyXG4gICBcclxufVxyXG4iLCJuYW1lc3BhY2UgRnJhbWV3b3JrIHtcclxuICAgIFxyXG4gICAgZXhwb3J0IGNsYXNzIFNlZWRSYW5kb20ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNlZWQ6IG51bWJlcjtcclxuICAgICAgICBuZXh0U2VlZDogbnVtYmVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHNlZWQ6IG51bWJlciA9IE1hdGgucmFuZG9tKCkpe1xyXG4gICAgICAgICAgICB0aGlzLnNlZWQgPSB0aGlzLm5leHRTZWVkID0gc2VlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmFuZG9tKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGNvbnN0IHggPSBNYXRoLnNpbih0aGlzLm5leHRTZWVkICogMiAqIE1hdGguUEkpICogMTAwMDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHggLSBNYXRoLmZsb29yKHgpO1xyXG4gICAgICAgICAgICB0aGlzLm5leHRTZWVkID0gcmVzdWx0O1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiXHJcbm5hbWVzcGFjZSBUeXBlZENoYW5uZWwge1xyXG5cclxuICAgIC8vIC0tLSBDb3JlIHR5cGVzIC0tLVxyXG5cclxuICAgIHR5cGUgU2VyaWFsaXphYmxlID0gT2JqZWN0IHwgQXJyYXk8YW55PiB8IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBEYXRlIHwgdm9pZDtcclxuXHJcbiAgICB0eXBlIFZhbHVlID0gbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiB8IERhdGU7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIGRhdGE/OiBURGF0YTtcclxuICAgIH1cclxuXHJcbiAgICB0eXBlIElTdWJqZWN0PFQ+ID0gUnguT2JzZXJ2ZXI8VD4gJiBSeC5PYnNlcnZhYmxlPFQ+O1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDaGFubmVsVG9waWM8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgY2hhbm5lbDogSVN1YmplY3Q8TWVzc2FnZTxURGF0YT4+O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihjaGFubmVsOiBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj4sIHR5cGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3Vic2NyaWJlKG9ic2VydmVyOiAobWVzc2FnZTogTWVzc2FnZTxURGF0YT4pID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCkuc3Vic2NyaWJlKG9ic2VydmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YihvYnNlcnZlcjogKGRhdGE6IFREYXRhKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgpLnN1YnNjcmliZShtID0+IG9ic2VydmVyKG0uZGF0YSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXNwYXRjaChkYXRhPzogVERhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsLm9uTmV4dCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JzZXJ2ZSgpOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGE+PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuZmlsdGVyKG0gPT4gbS50eXBlID09PSB0aGlzLnR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBvYnNlcnZlRGF0YSgpOiBSeC5PYnNlcnZhYmxlPFREYXRhPiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9ic2VydmUoKS5tYXAobSA9PiBtLmRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3J3YXJkKGNoYW5uZWw6IENoYW5uZWxUb3BpYzxURGF0YT4pIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmUobSA9PiBjaGFubmVsLmRpc3BhdGNoKG0uZGF0YSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbCB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgc3ViamVjdDogSVN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGU+PjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3ViamVjdD86IElTdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4sIHR5cGU/OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJqZWN0ID0gc3ViamVjdCB8fCBuZXcgUnguU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+KCk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWJzY3JpYmUob25OZXh0PzogKHZhbHVlOiBNZXNzYWdlPFNlcmlhbGl6YWJsZT4pID0+IHZvaWQpOiBSeC5JRGlzcG9zYWJsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3Quc3Vic2NyaWJlKG9uTmV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYnNlcnZlKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9waWM8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+KHR5cGU6IHN0cmluZykgOiBDaGFubmVsVG9waWM8VERhdGE+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VERhdGE+KHRoaXMuc3ViamVjdCBhcyBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj4sXHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPyB0aGlzLnR5cGUgKyAnLicgKyB0eXBlIDogdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lcmdlVHlwZWQ8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+KC4uLnRvcGljczogQ2hhbm5lbFRvcGljPFREYXRhPltdKSBcclxuICAgICAgICAgICAgOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGE+PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdG9waWNzLm1hcCh0ID0+IHQudHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuZmlsdGVyKG0gPT4gdHlwZXMuaW5kZXhPZihtLnR5cGUpID49IDAgKSBhcyBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGE+PjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVyZ2UoLi4udG9waWNzOiBDaGFubmVsVG9waWM8U2VyaWFsaXphYmxlPltdKSBcclxuICAgICAgICAgICAgOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRvcGljcy5tYXAodCA9PiB0LnR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmZpbHRlcihtID0+IHR5cGVzLmluZGV4T2YobS50eXBlKSA+PSAwICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJcclxudHlwZSBEaWN0aW9uYXJ5PFQ+ID0gXy5EaWN0aW9uYXJ5PFQ+O1xyXG4iLCJcclxuY2xhc3MgT2JzZXJ2YWJsZUV2ZW50PFQ+IHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfc3Vic2NyaWJlcnM6ICgoZXZlbnRBcmc6IFQpID0+IHZvaWQpW10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmb3Igbm90aWZpY2F0aW9uLiBSZXR1cm5zIHVuc3Vic2NyaWJlIGZ1bmN0aW9uLlxyXG4gICAgICovICAgIFxyXG4gICAgc3Vic2NyaWJlKGhhbmRsZXI6IChldmVudEFyZzogVCkgPT4gdm9pZCk6ICgoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgaWYodGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyKSA8IDApe1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5wdXNoKGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKCkgPT4gdGhpcy51bnN1YnNjcmliZShoYW5kbGVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdW5zdWJzY3JpYmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoY2FsbGJhY2ssIDApO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9ic2VydmUoKTogUnguT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHVuc3ViOiBhbnk7XHJcbiAgICAgICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybjxUPihcclxuICAgICAgICAgICAgKGhhbmRsZXJUb0FkZCkgPT4gdGhpcy5zdWJzY3JpYmUoPChldmVudEFyZzogVCkgPT4gdm9pZD5oYW5kbGVyVG9BZGQpLFxyXG4gICAgICAgICAgICAoaGFuZGxlclRvUmVtb3ZlKSA9PiB0aGlzLnVuc3Vic2NyaWJlKDwoZXZlbnRBcmc6IFQpID0+IHZvaWQ+aGFuZGxlclRvUmVtb3ZlKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGZvciBvbmUgbm90aWZpY2F0aW9uLlxyXG4gICAgICovXHJcbiAgICBzdWJzY3JpYmVPbmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCl7XHJcbiAgICAgICAgbGV0IHVuc3ViID0gdGhpcy5zdWJzY3JpYmUodCA9PiB7XHJcbiAgICAgICAgICAgIHVuc3ViKCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBub3RpZnkoZXZlbnRBcmc6IFQpe1xyXG4gICAgICAgIGZvcihsZXQgc3Vic2NyaWJlciBvZiB0aGlzLl9zdWJzY3JpYmVycyl7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY2FsbCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIHN1YnNjcmliZXJzLlxyXG4gICAgICovXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG59IiwiXHJcbm5hbWVzcGFjZSBCb290U2NyaXB0IHtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIE1lbnVJdGVtIHtcclxuICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgb3B0aW9ucz86IE9iamVjdFxyXG4gICAgICAgIC8vb25DbGljaz86ICgpID0+IHZvaWRcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZHJvcGRvd24oXHJcbiAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgICBpZDogc3RyaW5nLFxyXG4gICAgICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgICAgIGl0ZW1zOiBNZW51SXRlbVtdXHJcbiAgICAgICAgfSk6IFZOb2RlIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXYuZHJvcGRvd25cIiwgW1xyXG4gICAgICAgICAgICBoKFwiYnV0dG9uLmJ0bi5idG4tZGVmYXVsdC5kcm9wZG93bi10b2dnbGVcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImF0dHJzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFyZ3MuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS10b2dnbGVcIjogXCJkcm9wZG93blwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgYXJncy5jb250ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuLmNhcmV0XCIpXHJcbiAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgaChcInVsLmRyb3Bkb3duLW1lbnVcIixcclxuICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgYXJncy5pdGVtcy5tYXAoaXRlbSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJsaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoJ2EnLCBpdGVtLm9wdGlvbnMgfHwge30sIFtpdGVtLmNvbnRlbnRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG50eXBlIEl0ZW1DaGFuZ2VIYW5kbGVyID0gKGZsYWdzOiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnKSA9PiB2b2lkO1xyXG50eXBlIENhbGxiYWNrID0gKCkgPT4gdm9pZDtcclxuXHJcbmRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSXRlbSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU3Vic2NyaWJlIHRvIGFsbCBjaGFuZ2VzIGluIGl0ZW0uIFJldHVybnMgdW4tc3Vic2NyaWJlIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN1YnNjcmliZShoYW5kbGVyOiBJdGVtQ2hhbmdlSGFuZGxlcik6IENhbGxiYWNrO1xyXG4gICAgICAgIFxyXG4gICAgICAgIF9jaGFuZ2VkKGZsYWdzOiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnKTogdm9pZDtcclxuICAgIH1cclxufVxyXG5cclxubmFtZXNwYWNlIFBhcGVyTm90aWZ5IHtcclxuXHJcbiAgICBleHBvcnQgZW51bSBDaGFuZ2VGbGFnIHtcclxuICAgICAgICAvLyBBbnl0aGluZyBhZmZlY3RpbmcgdGhlIGFwcGVhcmFuY2Ugb2YgYW4gaXRlbSwgaW5jbHVkaW5nIEdFT01FVFJZLFxyXG4gICAgICAgIC8vIFNUUk9LRSwgU1RZTEUgYW5kIEFUVFJJQlVURSAoZXhjZXB0IGZvciB0aGUgaW52aXNpYmxlIG9uZXM6IGxvY2tlZCwgbmFtZSlcclxuICAgICAgICBBUFBFQVJBTkNFID0gMHgxLFxyXG4gICAgICAgIC8vIEEgY2hhbmdlIGluIHRoZSBpdGVtJ3MgY2hpbGRyZW5cclxuICAgICAgICBDSElMRFJFTiA9IDB4MixcclxuICAgICAgICAvLyBBIGNoYW5nZSBvZiB0aGUgaXRlbSdzIHBsYWNlIGluIHRoZSBzY2VuZSBncmFwaCAocmVtb3ZlZCwgaW5zZXJ0ZWQsXHJcbiAgICAgICAgLy8gbW92ZWQpLlxyXG4gICAgICAgIElOU0VSVElPTiA9IDB4NCxcclxuICAgICAgICAvLyBJdGVtIGdlb21ldHJ5IChwYXRoLCBib3VuZHMpXHJcbiAgICAgICAgR0VPTUVUUlkgPSAweDgsXHJcbiAgICAgICAgLy8gT25seSBzZWdtZW50KHMpIGhhdmUgY2hhbmdlZCwgYW5kIGFmZmVjdGVkIGN1cnZlcyBoYXZlIGFscmVhZHkgYmVlblxyXG4gICAgICAgIC8vIG5vdGlmaWVkLiBUaGlzIGlzIHRvIGltcGxlbWVudCBhbiBvcHRpbWl6YXRpb24gaW4gX2NoYW5nZWQoKSBjYWxscy5cclxuICAgICAgICBTRUdNRU5UUyA9IDB4MTAsXHJcbiAgICAgICAgLy8gU3Ryb2tlIGdlb21ldHJ5IChleGNsdWRpbmcgY29sb3IpXHJcbiAgICAgICAgU1RST0tFID0gMHgyMCxcclxuICAgICAgICAvLyBGaWxsIHN0eWxlIG9yIHN0cm9rZSBjb2xvciAvIGRhc2hcclxuICAgICAgICBTVFlMRSA9IDB4NDAsXHJcbiAgICAgICAgLy8gSXRlbSBhdHRyaWJ1dGVzOiB2aXNpYmxlLCBibGVuZE1vZGUsIGxvY2tlZCwgbmFtZSwgb3BhY2l0eSwgY2xpcE1hc2sgLi4uXHJcbiAgICAgICAgQVRUUklCVVRFID0gMHg4MCxcclxuICAgICAgICAvLyBUZXh0IGNvbnRlbnRcclxuICAgICAgICBDT05URU5UID0gMHgxMDAsXHJcbiAgICAgICAgLy8gUmFzdGVyIHBpeGVsc1xyXG4gICAgICAgIFBJWEVMUyA9IDB4MjAwLFxyXG4gICAgICAgIC8vIENsaXBwaW5nIGluIG9uZSBvZiB0aGUgY2hpbGQgaXRlbXNcclxuICAgICAgICBDTElQUElORyA9IDB4NDAwLFxyXG4gICAgICAgIC8vIFRoZSB2aWV3IGhhcyBiZWVuIHRyYW5zZm9ybWVkXHJcbiAgICAgICAgVklFVyA9IDB4ODAwXHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2hvcnRjdXRzIHRvIG9mdGVuIHVzZWQgQ2hhbmdlRmxhZyB2YWx1ZXMgaW5jbHVkaW5nIEFQUEVBUkFOQ0VcclxuICAgIGV4cG9ydCBlbnVtIENoYW5nZXMge1xyXG4gICAgICAgIC8vIENISUxEUkVOIGFsc28gY2hhbmdlcyBHRU9NRVRSWSwgc2luY2UgcmVtb3ZpbmcgY2hpbGRyZW4gZnJvbSBncm91cHNcclxuICAgICAgICAvLyBjaGFuZ2VzIGJvdW5kcy5cclxuICAgICAgICBDSElMRFJFTiA9IENoYW5nZUZsYWcuQ0hJTERSRU4gfCBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIC8vIENoYW5naW5nIHRoZSBpbnNlcnRpb24gY2FuIGNoYW5nZSB0aGUgYXBwZWFyYW5jZSB0aHJvdWdoIHBhcmVudCdzIG1hdHJpeC5cclxuICAgICAgICBJTlNFUlRJT04gPSBDaGFuZ2VGbGFnLklOU0VSVElPTiB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBHRU9NRVRSWSA9IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgU0VHTUVOVFMgPSBDaGFuZ2VGbGFnLlNFR01FTlRTIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBTVFJPS0UgPSBDaGFuZ2VGbGFnLlNUUk9LRSB8IENoYW5nZUZsYWcuU1RZTEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgU1RZTEUgPSBDaGFuZ2VGbGFnLlNUWUxFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIEFUVFJJQlVURSA9IENoYW5nZUZsYWcuQVRUUklCVVRFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIENPTlRFTlQgPSBDaGFuZ2VGbGFnLkNPTlRFTlQgfCBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFBJWEVMUyA9IENoYW5nZUZsYWcuUElYRUxTIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFZJRVcgPSBDaGFuZ2VGbGFnLlZJRVcgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0VcclxuICAgIH07XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gSW5qZWN0IEl0ZW0uc3Vic2NyaWJlXHJcbiAgICAgICAgY29uc3QgaXRlbVByb3RvID0gKDxhbnk+cGFwZXIpLkl0ZW0ucHJvdG90eXBlO1xyXG4gICAgICAgIGl0ZW1Qcm90by5zdWJzY3JpYmUgPSBmdW5jdGlvbihoYW5kbGVyOiBJdGVtQ2hhbmdlSGFuZGxlcik6IENhbGxiYWNrIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9zdWJzY3JpYmVycykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyKSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnB1c2goaGFuZGxlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoaGFuZGxlciwgMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdyYXAgSXRlbS5yZW1vdmVcclxuICAgICAgICBjb25zdCBpdGVtUmVtb3ZlID0gaXRlbVByb3RvLnJlbW92ZTtcclxuICAgICAgICBpdGVtUHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0ZW1SZW1vdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gV3JhcCBQcm9qZWN0Ll9jaGFuZ2VkXHJcbiAgICAgICAgY29uc3QgcHJvamVjdFByb3RvID0gPGFueT5wYXBlci5Qcm9qZWN0LnByb3RvdHlwZTtcclxuICAgICAgICBjb25zdCBwcm9qZWN0Q2hhbmdlZCA9IHByb2plY3RQcm90by5fY2hhbmdlZDtcclxuICAgICAgICBwcm9qZWN0UHJvdG8uX2NoYW5nZWQgPSBmdW5jdGlvbihmbGFnczogQ2hhbmdlRmxhZywgaXRlbTogcGFwZXIuSXRlbSkge1xyXG4gICAgICAgICAgICBwcm9qZWN0Q2hhbmdlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3VicyA9ICg8YW55Pml0ZW0pLl9zdWJzY3JpYmVycztcclxuICAgICAgICAgICAgICAgIGlmIChzdWJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcyBvZiBzdWJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuY2FsbChpdGVtLCBmbGFncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZShmbGFnczogQ2hhbmdlRmxhZykge1xyXG4gICAgICAgIGxldCBmbGFnTGlzdDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBfLmZvck93bihDaGFuZ2VGbGFnLCAodmFsdWUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB2YWx1ZSkgPT09IFwibnVtYmVyXCIgJiYgKHZhbHVlICYgZmxhZ3MpKSB7XHJcbiAgICAgICAgICAgICAgICBmbGFnTGlzdC5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmxhZ0xpc3Quam9pbignIHwgJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlKGl0ZW06IHBhcGVyLkl0ZW0sIGZsYWdzOiBDaGFuZ2VGbGFnKTogXHJcbiAgICAgICAgUnguT2JzZXJ2YWJsZTxDaGFuZ2VGbGFnPiBcclxuICAgIHtcclxuICAgICAgICBsZXQgdW5zdWI6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybjxDaGFuZ2VGbGFnPihcclxuICAgICAgICAgICAgYWRkSGFuZGxlciA9PiB7XHJcbiAgICAgICAgICAgICAgICB1bnN1YiA9IGl0ZW0uc3Vic2NyaWJlKGYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGYgJiBmbGFncyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEhhbmRsZXIoZik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICByZW1vdmVIYW5kbGVyID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHVuc3ViKXtcclxuICAgICAgICAgICAgICAgICAgICB1bnN1YigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblBhcGVyTm90aWZ5LmluaXRpYWxpemUoKTtcclxuIiwiZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgaW50ZXJmYWNlIFZpZXcge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEludGVybmFsIG1ldGhvZCBmb3IgaW5pdGlhdGluZyBtb3VzZSBldmVudHMgb24gdmlldy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBlbWl0TW91c2VFdmVudHModmlldzogcGFwZXIuVmlldywgaXRlbTogcGFwZXIuSXRlbSwgdHlwZTogc3RyaW5nLFxyXG4gICAgICAgICAgICBldmVudDogYW55LCBwb2ludDogcGFwZXIuUG9pbnQsIHByZXZQb2ludDogcGFwZXIuUG9pbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5uYW1lc3BhY2UgcGFwZXJFeHQge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBWaWV3Wm9vbSB7XHJcblxyXG4gICAgICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcbiAgICAgICAgZmFjdG9yID0gMS4yNTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfbWluWm9vbTogbnVtYmVyO1xyXG4gICAgICAgIHByaXZhdGUgX21heFpvb206IG51bWJlcjtcclxuICAgICAgICBwcml2YXRlIF9tb3VzZU5hdGl2ZVN0YXJ0OiBwYXBlci5Qb2ludDtcclxuICAgICAgICBwcml2YXRlIF92aWV3Q2VudGVyU3RhcnQ6IHBhcGVyLlBvaW50O1xyXG4gICAgICAgIHByaXZhdGUgX3ZpZXdDaGFuZ2VkID0gbmV3IE9ic2VydmFibGVFdmVudDxwYXBlci5SZWN0YW5nbGU+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByb2plY3Q6IHBhcGVyLlByb2plY3QpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuXHJcbiAgICAgICAgICAgICg8YW55PiQodmlldy5lbGVtZW50KSkubW91c2V3aGVlbCgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1vdXNlUG9zaXRpb24gPSBuZXcgcGFwZXIuUG9pbnQoZXZlbnQub2Zmc2V0WCwgZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVpvb21DZW50ZXJlZChldmVudC5kZWx0YVksIG1vdXNlUG9zaXRpb24pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBkaWREcmFnID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB2aWV3Lm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhpdCA9IHByb2plY3QuaGl0VGVzdChldi5wb2ludCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX3ZpZXdDZW50ZXJTdGFydCkgeyAgLy8gbm90IGFscmVhZHkgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaGl0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvbid0IHN0YXJ0IGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlld0NlbnRlclN0YXJ0ID0gdmlldy5jZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGF2ZSB0byB1c2UgbmF0aXZlIG1vdXNlIG9mZnNldCwgYmVjYXVzZSBldi5kZWx0YSBcclxuICAgICAgICAgICAgICAgICAgICAvLyAgY2hhbmdlcyBhcyB0aGUgdmlldyBpcyBzY3JvbGxlZC5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZU5hdGl2ZVN0YXJ0ID0gbmV3IHBhcGVyLlBvaW50KGV2LmV2ZW50Lm9mZnNldFgsIGV2LmV2ZW50Lm9mZnNldFkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmF0aXZlRGVsdGEgPSBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2LmV2ZW50Lm9mZnNldFggLSB0aGlzLl9tb3VzZU5hdGl2ZVN0YXJ0LngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2LmV2ZW50Lm9mZnNldFkgLSB0aGlzLl9tb3VzZU5hdGl2ZVN0YXJ0LnlcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIE1vdmUgaW50byB2aWV3IGNvb3JkaW5hdGVzIHRvIHN1YnJhY3QgZGVsdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gIHRoZW4gYmFjayBpbnRvIHByb2plY3QgY29vcmRzLlxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuY2VudGVyID0gdmlldy52aWV3VG9Qcm9qZWN0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnByb2plY3RUb1ZpZXcodGhpcy5fdmlld0NlbnRlclN0YXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnRyYWN0KG5hdGl2ZURlbHRhKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlkRHJhZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmlldy5vbihwYXBlci5FdmVudFR5cGUubW91c2VVcCwgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21vdXNlTmF0aXZlU3RhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZU5hdGl2ZVN0YXJ0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2VudGVyU3RhcnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnRW5kLCBldik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpZERyYWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlld0NoYW5nZWQubm90aWZ5KHZpZXcuYm91bmRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlkRHJhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdmlld0NoYW5nZWQoKTogT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlJlY3RhbmdsZT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmlld0NoYW5nZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgem9vbSgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qZWN0LnZpZXcuem9vbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB6b29tUmFuZ2UoKTogbnVtYmVyW10ge1xyXG4gICAgICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0Wm9vbVJhbmdlKHJhbmdlOiBwYXBlci5TaXplW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICAgICAgY29uc3QgYVNpemUgPSByYW5nZS5zaGlmdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBiU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBhU2l6ZSAmJiBNYXRoLm1pbihcclxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIGFTaXplLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYVNpemUud2lkdGgpO1xyXG4gICAgICAgICAgICBjb25zdCBiID0gYlNpemUgJiYgTWF0aC5taW4oXHJcbiAgICAgICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBiU2l6ZS5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGJTaXplLndpZHRoKTtcclxuICAgICAgICAgICAgY29uc3QgbWluID0gTWF0aC5taW4oYSwgYik7XHJcbiAgICAgICAgICAgIGlmIChtaW4pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21pblpvb20gPSBtaW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoYSwgYik7XHJcbiAgICAgICAgICAgIGlmIChtYXgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21heFpvb20gPSBtYXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFt0aGlzLl9taW5ab29tLCB0aGlzLl9tYXhab29tXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHpvb21UbyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpIHtcclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgICAgICB2aWV3LmNlbnRlciA9IHJlY3QuY2VudGVyO1xyXG4gICAgICAgICAgICB2aWV3Lnpvb20gPSBNYXRoLm1pbihcclxuICAgICAgICAgICAgICAgIHZpZXcudmlld1NpemUuaGVpZ2h0IC8gcmVjdC5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB2aWV3LnZpZXdTaXplLndpZHRoIC8gcmVjdC53aWR0aCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXdDaGFuZ2VkLm5vdGlmeSh2aWV3LmJvdW5kcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFuZ2Vab29tQ2VudGVyZWQoZGVsdGE6IG51bWJlciwgbW91c2VQb3M6IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgICAgIGlmICghZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgICAgIGNvbnN0IG9sZFpvb20gPSB2aWV3Lnpvb207XHJcbiAgICAgICAgICAgIGNvbnN0IG9sZENlbnRlciA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgICAgICBjb25zdCB2aWV3UG9zID0gdmlldy52aWV3VG9Qcm9qZWN0KG1vdXNlUG9zKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdab29tID0gZGVsdGEgPiAwXHJcbiAgICAgICAgICAgICAgICA/IHZpZXcuem9vbSAqIHRoaXMuZmFjdG9yXHJcbiAgICAgICAgICAgICAgICA6IHZpZXcuem9vbSAvIHRoaXMuZmFjdG9yO1xyXG4gICAgICAgICAgICBuZXdab29tID0gdGhpcy5zZXRab29tQ29uc3RyYWluZWQobmV3Wm9vbSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5ld1pvb20pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgem9vbVNjYWxlID0gb2xkWm9vbSAvIG5ld1pvb207XHJcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlckFkanVzdCA9IHZpZXdQb3Muc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gdmlld1Bvcy5zdWJ0cmFjdChjZW50ZXJBZGp1c3QubXVsdGlwbHkoem9vbVNjYWxlKSlcclxuICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChvbGRDZW50ZXIpO1xyXG5cclxuICAgICAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LmNlbnRlci5hZGQob2Zmc2V0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXdDaGFuZ2VkLm5vdGlmeSh2aWV3LmJvdW5kcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2V0IHpvb20gbGV2ZWwuXHJcbiAgICAgICAgICogQHJldHVybnMgem9vbSBsZXZlbCB0aGF0IHdhcyBzZXQsIG9yIG51bGwgaWYgaXQgd2FzIG5vdCBjaGFuZ2VkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRab29tQ29uc3RyYWluZWQoem9vbTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX21pblpvb20pIHtcclxuICAgICAgICAgICAgICAgIHpvb20gPSBNYXRoLm1heCh6b29tLCB0aGlzLl9taW5ab29tKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fbWF4Wm9vbSkge1xyXG4gICAgICAgICAgICAgICAgem9vbSA9IE1hdGgubWluKHpvb20sIHRoaXMuX21heFpvb20pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICAgICAgaWYgKHpvb20gIT0gdmlldy56b29tKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3Lnpvb20gPSB6b29tO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHpvb207XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBwYXBlckV4dCB7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogVXNlIG9mIHRoZXNlIGV2ZW50cyByZXF1aXJlcyBmaXJzdCBjYWxsaW5nIGV4dGVuZE1vdXNlRXZlbnRzXHJcbiAgICAgKiAgIG9uIHRoZSBpdGVtLiBcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IHZhciBFdmVudFR5cGUgPSB7XHJcbiAgICAgICAgbW91c2VEcmFnU3RhcnQ6IFwibW91c2VEcmFnU3RhcnRcIixcclxuICAgICAgICBtb3VzZURyYWdFbmQ6IFwibW91c2VEcmFnRW5kXCJcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZXh0ZW5kTW91c2VFdmVudHMoaXRlbTogcGFwZXIuSXRlbSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaXRlbS5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFkcmFnZ2luZyl7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ1N0YXJ0LCBldik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZVVwLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmKGRyYWdnaW5nKXtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ0VuZCwgZXYpO1xyXG4gICAgICAgICAgICAgICAgLy8gcHJldmVudCBjbGlja1xyXG4gICAgICAgICAgICAgICAgZXYuc3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJcclxubW9kdWxlIHBhcGVyIHtcclxuXHJcbiAgICBleHBvcnQgdmFyIEV2ZW50VHlwZSA9IHtcclxuICAgICAgICBmcmFtZTogXCJmcmFtZVwiLFxyXG4gICAgICAgIG1vdXNlRG93bjogXCJtb3VzZWRvd25cIixcclxuICAgICAgICBtb3VzZVVwOiBcIm1vdXNldXBcIixcclxuICAgICAgICBtb3VzZURyYWc6IFwibW91c2VkcmFnXCIsXHJcbiAgICAgICAgY2xpY2s6IFwiY2xpY2tcIixcclxuICAgICAgICBkb3VibGVDbGljazogXCJkb3VibGVjbGlja1wiLFxyXG4gICAgICAgIG1vdXNlTW92ZTogXCJtb3VzZW1vdmVcIixcclxuICAgICAgICBtb3VzZUVudGVyOiBcIm1vdXNlZW50ZXJcIixcclxuICAgICAgICBtb3VzZUxlYXZlOiBcIm1vdXNlbGVhdmVcIixcclxuICAgICAgICBrZXl1cDogXCJrZXl1cFwiLFxyXG4gICAgICAgIGtleWRvd246IFwia2V5ZG93blwiXHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmFic3RyYWN0IGNsYXNzIENvbXBvbmVudDxUPiB7XHJcbiAgICBhYnN0cmFjdCByZW5kZXIoZGF0YTogVCk6IFZOb2RlO1xyXG59IiwiXHJcbmludGVyZmFjZSBSZWFjdGl2ZURvbUNvbXBvbmVudCB7XHJcbiAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPjtcclxufVxyXG5cclxubmFtZXNwYWNlIFZEb21IZWxwZXJzIHtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiByZW5kZXJBc0NoaWxkKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHZub2RlOiBWTm9kZSkge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBjb25zdCBwYXRjaGVkID0gcGF0Y2goY2hpbGQsIHZub2RlKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGF0Y2hlZC5lbG0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWFjdGl2ZURvbSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSByZWFjdGl2ZSBjb21wb25lbnQgd2l0aGluIGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlclN0cmVhbShcclxuICAgICAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPixcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50XHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBjb250YWluZXIuaWQ7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQ6IEhUTUxFbGVtZW50IHwgVk5vZGUgPSBjb250YWluZXI7XHJcbiAgICAgICAgY29uc3Qgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGRvbSQuc3Vic2NyaWJlKGRvbSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZG9tKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUVtcHR5Tm9kZXMoZG9tKTtcclxuICAgICAgICAgICAgbGV0IHBhdGNoZWQ6IFZOb2RlO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcGF0Y2hlZCA9IHBhdGNoKGN1cnJlbnQsIGRvbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIHBhdGNoaW5nIGRvbVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudCxcclxuICAgICAgICAgICAgICAgICAgICBkb20sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaWQgJiYgIXBhdGNoZWQuZWxtLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyByZXRhaW4gSURcclxuICAgICAgICAgICAgICAgIHBhdGNoZWQuZWxtLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaGVkO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmVseSByZW1vdmUgZW1wdHkgY2hpbGRyZW4gZnJvbSB0cmVlLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVtb3ZlRW1wdHlOb2Rlcyhub2RlOiBWTm9kZSkge1xyXG4gICAgICAgIGlmKCFub2RlLmNoaWxkcmVuIHx8ICFub2RlLmNoaWxkcmVuLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgbm90RW1wdHkgPSBub2RlLmNoaWxkcmVuLmZpbHRlcihjID0+ICEhYyk7XHJcbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoICE9IG5vdEVtcHR5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJyZW1vdmVkIGVtcHR5IGNoaWxkcmVuIGZyb21cIiwgbm9kZS5jaGlsZHJlbik7XHJcbiAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4gPSBub3RFbXB0eTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRW1wdHlOb2RlcyhjaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIGEgcmVhY3RpdmUgY29tcG9uZW50IHdpdGhpbiBjb250YWluZXIuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXJDb21wb25lbnQoXHJcbiAgICAgICAgY29tcG9uZW50OiBSZWFjdGl2ZURvbUNvbXBvbmVudCxcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50IHwgVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGNvbXBvbmVudC5kb20kLnN1YnNjcmliZShkb20gPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWRvbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIHdpdGhpbiBjb250YWluZXIgd2hlbmV2ZXIgc291cmNlIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsaXZlUmVuZGVyPFQ+KFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZSxcclxuICAgICAgICBzb3VyY2U6IFJ4Lk9ic2VydmFibGU8VD4sXHJcbiAgICAgICAgcmVuZGVyOiAobmV4dDogVCkgPT4gVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gcmVuZGVyKGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHJldHVybjtcclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoKGN1cnJlbnQsIG5vZGUpO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbm5hbWVzcGFjZSBBcHAge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBcHBDb29raWVzIHtcclxuXHJcbiAgICAgICAgc3RhdGljIFlFQVIgPSAzNjU7XHJcbiAgICAgICAgc3RhdGljIEJST1dTRVJfSURfS0VZID0gXCJicm93c2VySWRcIjtcclxuICAgICAgICBzdGF0aWMgTEFTVF9TQVZFRF9TS0VUQ0hfSURfS0VZID0gXCJsYXN0U2F2ZWRTa2V0Y2hJZFwiO1xyXG5cclxuICAgICAgICBnZXQgbGFzdFNhdmVkU2tldGNoSWQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzLmdldChBcHBDb29raWVzLkxBU1RfU0FWRURfU0tFVENIX0lEX0tFWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgbGFzdFNhdmVkU2tldGNoSWQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBDb29raWVzLnNldChBcHBDb29raWVzLkxBU1RfU0FWRURfU0tFVENIX0lEX0tFWSwgdmFsdWUsIHsgZXhwaXJlczogQXBwQ29va2llcy5ZRUFSIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGJyb3dzZXJJZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXMuZ2V0KEFwcENvb2tpZXMuQlJPV1NFUl9JRF9LRVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGJyb3dzZXJJZCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIENvb2tpZXMuc2V0KEFwcENvb2tpZXMuQlJPV1NFUl9JRF9LRVksIHZhbHVlLCB7IGV4cGlyZXM6IEFwcENvb2tpZXMuWUVBUiB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBBcHAge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBcHBNb2R1bGUge1xyXG5cclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgZWRpdG9yTW9kdWxlOiBTa2V0Y2hFZGl0b3IuU2tldGNoRWRpdG9yTW9kdWxlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgICAgIFBhcGVySGVscGVycy5zaG91bGRMb2dJbmZvID0gZmFsc2U7ICAgICAgIFxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IG5ldyBTdG9yZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRvck1vZHVsZSA9IG5ldyBTa2V0Y2hFZGl0b3IuU2tldGNoRWRpdG9yTW9kdWxlKHRoaXMuc3RvcmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzdGFydCgpIHsgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmVkaXRvck1vZHVsZS5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5pbnRlcmZhY2UgV2luZG93IHtcclxuICAgIGFwcDogQXBwLkFwcE1vZHVsZTtcclxufSIsIlxyXG5uYW1lc3BhY2UgQXBwIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQXBwUm91dGVyIGV4dGVuZHMgUm91dGVyNSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcihbXHJcbiAgICAgICAgICAgICAgICBuZXcgUm91dGVOb2RlKFwiaG9tZVwiLCBcIi9cIiksXHJcbiAgICAgICAgICAgICAgICBuZXcgUm91dGVOb2RlKFwic2tldGNoXCIsIFwiL3NrZXRjaC86c2tldGNoSWRcIiksIC8vIDxbYS1mQS1GMC05XXsxNH0+XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlSGFzaDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFJvdXRlOiBcImhvbWVcIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvL3RoaXMudXNlUGx1Z2luKGxvZ2dlclBsdWdpbigpKVxyXG4gICAgICAgICAgICB0aGlzLnVzZVBsdWdpbihsaXN0ZW5lcnNQbHVnaW4uZGVmYXVsdCgpKVxyXG4gICAgICAgICAgICAgICAgLnVzZVBsdWdpbihoaXN0b3J5UGx1Z2luLmRlZmF1bHQoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b1NrZXRjaEVkaXRvcihza2V0Y2hJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGUoXCJza2V0Y2hcIiwgeyBza2V0Y2hJZDogc2tldGNoSWQgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgc3RhdGUoKSB7XHJcbiAgICAgICAgICAgIC8vIGNvdWxkIGRvIHJvdXRlIHZhbGlkYXRpb24gc29tZXdoZXJlXHJcbiAgICAgICAgICAgIHJldHVybiA8QXBwUm91dGVTdGF0ZT48YW55PnRoaXMuZ2V0U3RhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBBcHBSb3V0ZVN0YXRlIHtcclxuICAgICAgICBuYW1lOiBcImhvbWVcInxcInNrZXRjaFwiLFxyXG4gICAgICAgIHBhcmFtcz86IHtcclxuICAgICAgICAgICAgc2tldGNoSWQ/OiBzdHJpbmdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBhdGg/OiBzdHJpbmdcclxuICAgIH1cclxuXHJcbn0iLCJcclxubmFtZXNwYWNlIEFwcCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN0b3JlIHtcclxuXHJcbiAgICAgICAgc3RhdGU6IEFwcFN0YXRlO1xyXG4gICAgICAgIGFjdGlvbnM6IEFjdGlvbnM7XHJcbiAgICAgICAgZXZlbnRzOiBFdmVudHM7XHJcblxyXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBBcHBSb3V0ZXI7XHJcbiAgICAgICAgcHJpdmF0ZSBjb29raWVzOiBBcHBDb29raWVzO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIgPSBuZXcgQXBwUm91dGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IG5ldyBBY3Rpb25zKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IEV2ZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMgPSBuZXcgQXBwQ29va2llcygpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5zdGFydFJvdXRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRBY3Rpb25IYW5kbGVycygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdFN0YXRlKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gbmV3IEFwcFN0YXRlKHRoaXMuY29va2llcywgdGhpcy5yb3V0ZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpbml0QWN0aW9uSGFuZGxlcnMoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5lZGl0b3JMb2FkZWRTa2V0Y2guc3ViKHNrZXRjaElkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwic2tldGNoXCIsIHsgc2tldGNoSWQgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLmVkaXRvclNhdmVkU2tldGNoLnN1YihpZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvb2tpZXMubGFzdFNhdmVkU2tldGNoSWQgPSBpZDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3RhcnRSb3V0ZXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyLnN0YXJ0KChlcnIsIHN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5yb3V0ZUNoYW5nZWQuZGlzcGF0Y2goc3RhdGUpOyBcclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJyb3V0ZXIgZXJyb3JcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcImhvbWVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFwcFN0YXRlIHtcclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIGNvb2tpZXM6IEFwcENvb2tpZXM7XHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IEFwcFJvdXRlcjsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29va2llczogQXBwQ29va2llcywgcm91dGVyOiBBcHBSb3V0ZXIpe1xyXG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMgPSBjb29raWVzO1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlciA9IHJvdXRlcjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGJyb3dzZXJJZCA9IHRoaXMuY29va2llcy5icm93c2VySWQgfHwgRnJhbWV3b3JrLm5ld2lkKCk7XHJcbiAgICAgICAgICAgIC8vIGluaXQgb3IgcmVmcmVzaCBjb29raWVcclxuICAgICAgICAgICAgdGhpcy5jb29raWVzLmJyb3dzZXJJZCA9IGJyb3dzZXJJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0IGxhc3RTYXZlZFNrZXRjaElkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb29raWVzLmxhc3RTYXZlZFNrZXRjaElkOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0IGJyb3dzZXJJZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29va2llcy5icm93c2VySWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdldCByb3V0ZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm91dGVyLnN0YXRlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQWN0aW9ucyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcclxuICAgICAgICBlZGl0b3JMb2FkZWRTa2V0Y2ggPSB0aGlzLnRvcGljPHN0cmluZz4oXCJlZGl0b3JMb2FkZWRTa2V0Y2hcIik7XHJcbiAgICAgICAgZWRpdG9yU2F2ZWRTa2V0Y2ggPSB0aGlzLnRvcGljPHN0cmluZz4oXCJlZGl0b3JTYXZlZFNrZXRjaFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRXZlbnRzIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWwge1xyXG4gICAgICAgIHJvdXRlQ2hhbmdlZCA9IHRoaXMudG9waWM8QXBwUm91dGVTdGF0ZT4oXCJyb3V0ZUNoYW5nZWRcIik7XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIERlbW8ge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEZW1vTW9kdWxlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgcGFwZXIuc2V0dXAoY2FudmFzKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGFydCgpIHtcclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHBhcGVyLnZpZXc7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYXJzZWRGb250cyA9IG5ldyBGb250U2hhcGUuUGFyc2VkRm9udHMoKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgcGFyc2VkRm9udHMuZ2V0KFwiZm9udHMvUm9ib3RvLTUwMC50dGZcIikudGhlbiggcGFyc2VkID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBwYXJzZWQuZm9udC5nZXRQYXRoKFwiU05BUFwiLCAwLCAwLCAxMjgpLnRvUGF0aERhdGEoKTtcclxuICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgY29udGVudC5wb3NpdGlvbiA9IGNvbnRlbnQucG9zaXRpb24uYWRkKDUwKTtcclxuICAgICAgICAgICAgICAgICBjb250ZW50LmZpbGxDb2xvciA9IFwibGlnaHRncmF5XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gcGFwZXIuUGF0aC5FbGxpcHNlKG5ldyBwYXBlci5SZWN0YW5nbGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsMCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNpemUoNjAwLCAzMDApXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbi5yb3RhdGUoMzApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZWdpb24uYm91bmRzLmNlbnRlciA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgcmVnaW9uLnN0cm9rZUNvbG9yID0gXCJsaWdodGdyYXlcIjtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbi5zdHJva2VXaWR0aCA9IDM7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc25hcFBhdGggPSBuZXcgRm9udFNoYXBlLlNuYXBQYXRoKHJlZ2lvbiwgY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICBzbmFwUGF0aC5jb3JuZXJzID0gWzAsIDAuNCwgMC40NSwgMC45NV07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZpZXcub25GcmFtZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzbmFwUGF0aC5zbGlkZSgwLjAwMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc25hcFBhdGgudXBkYXRlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2aWV3LmRyYXcoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBCdWlsZGVyIHtcclxuXHJcbiAgICAgICAgc3RhdGljIGRlZmF1bHRGb250VXJsID0gXCJmb250cy9Sb2JvdG8tNTAwLnR0ZlwiO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSA8VGVtcGxhdGVVSUNvbnRleHQ+e1xyXG4gICAgICAgICAgICAgICAgZ2V0IGZvbnRDYXRhbG9nKCkgeyByZXR1cm4gc3RvcmUuZm9udENhdGFsb2cgfSxcclxuICAgICAgICAgICAgICAgIHJlbmRlckRlc2lnbjogKGRlc2lnbiwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5yZW5kZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNpZ246IGRlc2lnbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVGb250Q2hvb3NlcjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVGVtcGxhdGVGb250Q2hvb3NlcihzdG9yZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGFzeW5jIG9ic2VydmVcclxuICAgICAgICAgICAgc3RvcmUudGVtcGxhdGUkLm9ic2VydmVPbihSeC5TY2hlZHVsZXIuZGVmYXVsdCkuc3Vic2NyaWJlKHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFRleHQgPSBzdG9yZS5kZXNpZ24udGV4dDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RlbXBsYXRlU3RhdGUgPSB0LmNyZWF0ZU5ldyhjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VGV4dCAmJiBjdXJyZW50VGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdUZW1wbGF0ZVN0YXRlLmRlc2lnbi50ZXh0ID0gY3VycmVudFRleHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5zZXRUZW1wbGF0ZVN0YXRlKG5ld1RlbXBsYXRlU3RhdGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRvbSQgPSBzdG9yZS50ZW1wbGF0ZVN0YXRlJFxyXG4gICAgICAgICAgICAgICAgLm1hcCh0cyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRyb2xzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xzID0gc3RvcmUudGVtcGxhdGUuY3JlYXRlVUkoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgY2FsbGluZyAke3N0b3JlLnRlbXBsYXRlLm5hbWV9LmNyZWF0ZVVJYCwgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBjb250cm9scykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjLnZhbHVlJC5zdWJzY3JpYmUoZCA9PiBzdG9yZS51cGRhdGVUZW1wbGF0ZVN0YXRlKGQpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBjb250cm9scy5tYXAoYyA9PiBjLmNyZWF0ZU5vZGUodHMpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2bm9kZSA9IGgoXCJkaXYjdGVtcGxhdGVDb250cm9sc1wiLCB7fSwgbm9kZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2bm9kZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKGRvbSQsIGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIE1vZHVsZSB7XHJcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIGJ1aWxkZXI6IEJ1aWxkZXI7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBidWlsZGVyQ29udGFpbmVyOiBIVE1MRWxlbWVudCxcclxuICAgICAgICAgICAgcHJldmlld0NhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsXHJcbiAgICAgICAgICAgIHJlbmRlckNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsXHJcbiAgICAgICAgICAgIGJlbG93Q2FudmFzOiBIVE1MRWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IG5ldyBTdG9yZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkZXIgPSBuZXcgQnVpbGRlcihidWlsZGVyQ29udGFpbmVyLCB0aGlzLnN0b3JlKTtcclxuXHJcbiAgICAgICAgICAgIG5ldyBQcmV2aWV3Q2FudmFzKHByZXZpZXdDYW52YXMsIHRoaXMuc3RvcmUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdG9yZS50ZW1wbGF0ZVN0YXRlJC5zdWJzY3JpYmUodHMgPT4gY29uc29sZS5sb2coXCJ0ZW1wbGF0ZVN0YXRlXCIsIHRzKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUudGVtcGxhdGUkLnN1YnNjcmliZSh0ID0+IGNvbnNvbGUubG9nKFwidGVtcGxhdGVcIiwgdCkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbmV3IFNoYXJlT3B0aW9uc1VJKGJlbG93Q2FudmFzLCB0aGlzLnN0b3JlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXJ0KCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmluaXQoKS50aGVuKHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5zZXRUZW1wbGF0ZShcIkRpY2tlbnNcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZVRlbXBsYXRlU3RhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgeyBkZXNpZ246XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogXCJUaGUgcmFpbiBpbiBTcGFpbiBmYWxscyBtYWlubHkgaW4gdGhlIHBsYWluXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUHJldmlld0NhbnZhcyB7XHJcblxyXG4gICAgICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIGJ1aWx0RGVzaWduOiBwYXBlci5JdGVtO1xyXG4gICAgICAgIGNvbnRleHQ6IFRlbXBsYXRlQnVpbGRDb250ZXh0O1xyXG5cclxuICAgICAgICBwcml2YXRlIGxhc3RSZWNlaXZlZDogRGVzaWduO1xyXG4gICAgICAgIHByaXZhdGUgcmVuZGVyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG5cclxuICAgICAgICAgICAgcGFwZXIuc2V0dXAoY2FudmFzKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0ID0gcGFwZXIucHJvamVjdDtcclxuXHJcbiAgICAgICAgICAgIEZvbnRTaGFwZS5WZXJ0aWNhbEJvdW5kc1N0cmV0Y2hQYXRoLnBvaW50c1BlclBhdGggPSAzMDA7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQgPSB7XHJcbiAgICAgICAgICAgICAgICBnZXRGb250OiBzcGVjaWZpZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB1cmw6IHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNwZWNpZmllciB8fCAhc3BlY2lmaWVyLmZhbWlseSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBCdWlsZGVyLmRlZmF1bHRGb250VXJsO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IHN0b3JlLmZvbnRDYXRhbG9nLmdldFVybChzcGVjaWZpZXIuZmFtaWx5LCBzcGVjaWZpZXIudmFyaWFudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IEJ1aWxkZXIuZGVmYXVsdEZvbnRVcmw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZS5wYXJzZWRGb250cy5nZXQodXJsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0LmZvbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgc3RvcmUudGVtcGxhdGVTdGF0ZSQuc3Vic2NyaWJlKCh0czogVGVtcGxhdGVTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gb25seSBwcm9jZXNzIG9uZSByZXF1ZXN0IGF0IGEgdGltZVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWx3YXlzIHByb2Nlc3MgdGhlIGxhc3QgcmVjZWl2ZWRcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RSZWNlaXZlZCA9IHRzLmRlc2lnbjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIodHMuZGVzaWduKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZG93bmxvYWRQTkdSZXF1ZXN0ZWQuc3ViKCgpID0+IHRoaXMuZG93bmxvYWRQTkcoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRvd25sb2FkUE5HKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RvcmUuZGVzaWduLnRleHQgfHwgIXRoaXMuc3RvcmUuZGVzaWduLnRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gSGFsZiBvZiBtYXggRFBJIHByb2R1Y2VzIGFwcHJveCA0MjAweDQyMDAuXHJcbiAgICAgICAgICAgIGNvbnN0IGRwaSA9IDAuNSAqIFBhcGVySGVscGVycy5nZXRNYXhFeHBvcnREcGkodGhpcy5wcm9qZWN0LmFjdGl2ZUxheWVyLmJvdW5kcy5zaXplKTtcclxuICAgICAgICAgICAgY29uc3QgcmFzdGVyID0gdGhpcy5wcm9qZWN0LmFjdGl2ZUxheWVyLnJhc3Rlcml6ZShkcGksIGZhbHNlKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHJhc3Rlci50b0RhdGFVUkwoKTtcclxuICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBGc3R4LkZyYW1ld29yay5jcmVhdGVGaWxlTmFtZSh0aGlzLnN0b3JlLmRlc2lnbi50ZXh0LCA0MCwgXCJwbmdcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBEb21IZWxwZXJzLmRhdGFVUkxUb0Jsb2IoZGF0YSk7XHJcbiAgICAgICAgICAgIHNhdmVBcyhibG9iLCBmaWxlTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHJlbmRlckxhc3RSZWNlaXZlZCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubGFzdFJlY2VpdmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZW5kZXJpbmcgPSB0aGlzLmxhc3RSZWNlaXZlZDtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdFJlY2VpdmVkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHJlbmRlcmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVuZGVyKGRlc2lnbjogRGVzaWduKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmluZykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVuZGVyIGlzIGluIHByb2dyZXNzXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS50ZW1wbGF0ZS5idWlsZChkZXNpZ24sIHRoaXMuY29udGV4dCkudGhlbihpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gcmVuZGVyIHJlc3VsdCBmcm9tXCIsIGRlc2lnbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZml0Qm91bmRzKHRoaXMucHJvamVjdC52aWV3LmJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5ib3VuZHMucG9pbnQgPSB0aGlzLnByb2plY3Qudmlldy5ib3VuZHMudG9wTGVmdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaGFuZGxlIGFueSByZWNlaXZlZCB3aGlsZSByZW5kZXJpbmcgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckxhc3RSZWNlaXZlZCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcmVuZGVyaW5nIGRlc2lnblwiLCBlcnIsIGRlc2lnbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0iLCIvLyBuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4vLyAgICAgZXhwb3J0IGNsYXNzIFJlbmRlckNhbnZhcyB7XHJcblxyXG4vLyAgICAgICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbi8vICAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG4vLyAgICAgICAgIGJ1aWx0RGVzaWduOiBwYXBlci5JdGVtO1xyXG5cclxuLy8gICAgICAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuLy8gICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4vLyAgICAgICAgICAgICBwYXBlci5zZXR1cChjYW52YXMpO1xyXG4gICAgICAgICAgICBcclxuLy8gICAgICAgICAgICAgY29uc3QgY29udGV4dCA9IHtcclxuLy8gICAgICAgICAgICAgICAgIGdldEZvbnQ6IHNwZWNpZmllciA9PiB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgbGV0IHVybDogc3RyaW5nO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGlmICghc3BlY2lmaWVyIHx8ICFzcGVjaWZpZXIuZmFtaWx5KSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IEJ1aWxkZXIuZGVmYXVsdEZvbnRVcmw7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gc3RvcmUuZm9udENhdGFsb2cuZ2V0VXJsKHNwZWNpZmllci5mYW1pbHksIHNwZWNpZmllci52YXJpYW50KVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgQnVpbGRlci5kZWZhdWx0Rm9udFVybDtcclxuLy8gICAgICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLnBhcnNlZEZvbnRzLmdldCh1cmwpXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQuZm9udCk7XHJcbi8vICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgIH07XHJcblxyXG4vLyAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVkID0gc3RvcmUucmVuZGVyJC5jb250cm9sbGVkKCk7XHJcbi8vICAgICAgICAgICAgIGNvbnRyb2xsZWQuc3Vic2NyaWJlKHJlcXVlc3QgPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgbGV0IGRlc2lnbiA9IDxEZXNpZ24+Xy5jbG9uZSh0aGlzLnN0b3JlLmRlc2lnbik7XHJcbi8vICAgICAgICAgICAgICAgICBkZXNpZ24gPSBfLm1lcmdlKGRlc2lnbiwgcmVxdWVzdC5kZXNpZ24pO1xyXG4vLyAgICAgICAgICAgICAgICAgcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5yZW1vdmVDaGlsZHJlbigpO1xyXG4vLyAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS50ZW1wbGF0ZS5idWlsZChkZXNpZ24sIGNvbnRleHQpLnRoZW4oaXRlbSA9PiB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFzdGVyID0gcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5yYXN0ZXJpemUoNzIsIGZhbHNlKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbW92ZSgpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3QuY2FsbGJhY2socmFzdGVyLnRvRGF0YVVSTCgpKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVkLnJlcXVlc3QoMSk7XHJcbi8vICAgICAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICAgICAgKGVycikgPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImVycm9yIG9uIHRlbXBsYXRlLmJ1aWxkXCIsIGVycik7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlZC5yZXF1ZXN0KDEpO1xyXG4vLyAgICAgICAgICAgICAgICAgfSk7XHJcbi8vICAgICAgICAgICAgIH0pO1xyXG4vLyAgICAgICAgICAgICBjb250cm9sbGVkLnJlcXVlc3QoMSk7XHJcblxyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICB9XHJcbi8vIH0iLCJtb2R1bGUgU2tldGNoQnVpbGRlciB7XHJcbiAgICBcclxuICAgIGV4cG9ydCBjbGFzcyBTaGFyZU9wdGlvbnNVSSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKXtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBSeC5PYnNlcnZhYmxlLmp1c3QobnVsbCk7XHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShzdGF0ZS5tYXAoKCkgPT4gdGhpcy5jcmVhdGVEb20oKSksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNyZWF0ZURvbSgpOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiYnV0dG9uLmJ0bi5idG4tcHJpbWFyeVwiLCB7XHJcbiAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmRvd25sb2FkUE5HKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgW1wiRG93bmxvYWRcIl0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdG9yZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGUkID0gbmV3IFJ4LlN1YmplY3Q8VGVtcGxhdGU+KCk7XHJcbiAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGVTdGF0ZSQgPSBuZXcgUnguU3ViamVjdDxUZW1wbGF0ZVN0YXRlPigpO1xyXG4gICAgICAgIHByaXZhdGUgX3JlbmRlciQgPSBuZXcgUnguU3ViamVjdDxSZW5kZXJSZXF1ZXN0PigpO1xyXG4gICAgICAgIHByaXZhdGUgX3N0YXRlOiB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlPzogVGVtcGxhdGU7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlU3RhdGU6IFRlbXBsYXRlU3RhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgX2V2ZW50c0NoYW5uZWwgPSBuZXcgVHlwZWRDaGFubmVsLkNoYW5uZWwoKTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfcGFyc2VkRm9udHM6IEZvbnRTaGFwZS5QYXJzZWRGb250cztcclxuICAgICAgICBwcml2YXRlIF9mb250Q2F0YWxvZzogRm9udFNoYXBlLkZvbnRDYXRhbG9nO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVN0YXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzaWduOiB7fVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcGFyc2VkRm9udHMgPSBuZXcgRm9udFNoYXBlLlBhcnNlZEZvbnRzKCgpID0+IHsgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBldmVudHMgPSB7XHJcbiAgICAgICAgICAgIGRvd25sb2FkUE5HUmVxdWVzdGVkOiB0aGlzLl9ldmVudHNDaGFubmVsLnRvcGljPHZvaWQ+KFwiZG93bmxvYWRQTkdSZXF1ZXN0ZWRcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBzdGF0ZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHBhcnNlZEZvbnRzKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyc2VkRm9udHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgZm9udENhdGFsb2coKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250Q2F0YWxvZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB0ZW1wbGF0ZVN0YXRlJCgpOiBSeC5PYnNlcnZhYmxlPFRlbXBsYXRlU3RhdGU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlU3RhdGUkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHRlbXBsYXRlJCgpOiBSeC5PYnNlcnZhYmxlPFRlbXBsYXRlPiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZSQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgcmVuZGVyJCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlciQ7Ly8ub2JzZXJ2ZU9uKFJ4LlNjaGVkdWxlci5kZWZhdWx0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUudGVtcGxhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgZGVzaWduKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS50ZW1wbGF0ZVN0YXRlICYmIHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZS5kZXNpZ247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0KCk6IFByb21pc2U8U3RvcmU+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5pbml0aWFsaXplZCl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdG9yZSBpcyBhbHJlYWR5IGluaXRhbGl6ZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPFN0b3JlPihjYWxsYmFjayA9PiB7XHJcbiAgICAgICAgICAgICAgICBGb250U2hhcGUuRm9udENhdGFsb2cuZnJvbUxvY2FsKFwiZm9udHMvZ29vZ2xlLWZvbnRzLmpzb25cIilcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihjID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9udENhdGFsb2cgPSBjO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb3dubG9hZFBORygpe1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5kb3dubG9hZFBOR1JlcXVlc3RlZC5kaXNwYXRjaCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0VGVtcGxhdGUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZTogVGVtcGxhdGU7XHJcbiAgICAgICAgICAgIGlmICgvRGlja2Vucy9pLnRlc3QobmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gbmV3IFNrZXRjaEJ1aWxkZXIuVGVtcGxhdGVzLkRpY2tlbnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdGVtcGxhdGUgJHtuYW1lfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcclxuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUkLm9uTmV4dCh0ZW1wbGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXREZXNpZ24odmFsdWU6IERlc2lnbikge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnRlbXBsYXRlU3RhdGUgPSB7IGRlc2lnbjogdmFsdWUgfTtcclxuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVTdGF0ZSQub25OZXh0KHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGRhdGVUZW1wbGF0ZVN0YXRlKGNoYW5nZTogVGVtcGxhdGVTdGF0ZUNoYW5nZSkge1xyXG4gICAgICAgICAgICBfLm1lcmdlKHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZSwgY2hhbmdlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGRlc2lnbiA9IHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZS5kZXNpZ247XHJcbiAgICAgICAgICAgIGlmKGRlc2lnbiAmJiBkZXNpZ24uZm9udCAmJiBkZXNpZ24uZm9udC5mYW1pbHkgJiYgIWRlc2lnbi5mb250LnZhcmlhbnQpIHtcclxuICAgICAgICAgICAgICAgLy8gc2V0IGRlZmF1bHQgdmFyaWFudFxyXG4gICAgICAgICAgICAgICAgZGVzaWduLmZvbnQudmFyaWFudCA9IEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5kZWZhdWx0VmFyaWFudChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb250Q2F0YWxvZy5nZXRSZWNvcmQoZGVzaWduLmZvbnQuZmFtaWx5KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlU3RhdGUkLm9uTmV4dCh0aGlzLnN0YXRlLnRlbXBsYXRlU3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzZXRUZW1wbGF0ZVN0YXRlKHN0YXRlOiBUZW1wbGF0ZVN0YXRlKXtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUudGVtcGxhdGVTdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVN0YXRlJC5vbk5leHQoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHJlbmRlcihyZXF1ZXN0OiBSZW5kZXJSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlciQub25OZXh0KHJlcXVlc3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlIHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZztcclxuICAgICAgICBpbWFnZTogc3RyaW5nO1xyXG4gICAgICAgIGNyZWF0ZU5ldyhjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IFRlbXBsYXRlU3RhdGU7XHJcbiAgICAgICAgY3JlYXRlVUkoY29udGV4dDogVGVtcGxhdGVVSUNvbnRleHQpOiBCdWlsZGVyQ29udHJvbFtdO1xyXG4gICAgICAgIGJ1aWxkKGRlc2lnbjogRGVzaWduLCBjb250ZXh0OiBUZW1wbGF0ZUJ1aWxkQ29udGV4dCk6IFByb21pc2U8cGFwZXIuSXRlbT47XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZVVJQ29udGV4dCB7XHJcbiAgICAgICAgcmVuZGVyRGVzaWduKGRlc2lnbjogRGVzaWduLCBjYWxsYmFjazogKGltYWdlRGF0YVVybDogc3RyaW5nKSA9PiB2b2lkKTtcclxuICAgICAgICBmb250Q2F0YWxvZzogRm9udFNoYXBlLkZvbnRDYXRhbG9nO1xyXG4gICAgICAgIGNyZWF0ZUZvbnRDaG9vc2VyKCk6IEJ1aWxkZXJDb250cm9sO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlQnVpbGRDb250ZXh0IHtcclxuICAgICAgICBnZXRGb250KGRlc2M6IEZvbnRTaGFwZS5Gb250U3BlY2lmaWVyKTogUHJvbWlzZTxvcGVudHlwZS5Gb250PjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZVN0YXRlIHtcclxuICAgICAgICBkZXNpZ246IERlc2lnbjtcclxuICAgICAgICBmb250Q2F0ZWdvcnk/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZVN0YXRlQ2hhbmdlIHtcclxuICAgICAgICBkZXNpZ24/OiBEZXNpZ247XHJcbiAgICAgICAgZm9udENhdGVnb3J5Pzogc3RyaW5nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIERlc2lnbiB7XHJcbiAgICAgICAgdGV4dD86IHN0cmluZztcclxuICAgICAgICBzaGFwZT86IHN0cmluZztcclxuICAgICAgICBmb250PzogRm9udFNoYXBlLkZvbnRTcGVjaWZpZXI7XHJcbiAgICAgICAgcGFsZXR0ZT86IERlc2lnblBhbGV0dGU7XHJcbiAgICAgICAgc2VlZD86IG51bWJlcjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBEZXNpZ25QYWxldHRlIHtcclxuICAgICAgICBjb2xvcj86IHN0cmluZztcclxuICAgICAgICBpbnZlcnQ/OiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVzaWduQ2hhbmdlIGV4dGVuZHMgRGVzaWdue1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmRlclJlcXVlc3Qge1xyXG4gICAgICAgIGRlc2lnbjogRGVzaWduO1xyXG4gICAgICAgIGFyZWE/OiBudW1iZXI7XHJcbiAgICAgICAgY2FsbGJhY2s6IChpbWFnZURhdGFVcmw6IHN0cmluZykgPT4gdm9pZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCdWlsZGVyQ29udHJvbCB7XHJcbiAgICAgICAgdmFsdWUkOiBSeC5PYnNlcnZhYmxlPFRlbXBsYXRlU3RhdGVDaGFuZ2U+O1xyXG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU6IFRlbXBsYXRlU3RhdGUpOiBWTm9kZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBWYWx1ZUNvbnRyb2w8VD4ge1xyXG4gICAgICAgIHZhbHVlJDogUnguT2JzZXJ2YWJsZTxUPjtcclxuICAgICAgICBjcmVhdGVOb2RlKHZhbHVlPzogVCk6IFZOb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uQ2hvb3NlcjxUPiB7XHJcbiAgICAgICAgdmFsdWUkOiBSeC5PYnNlcnZhYmxlPFQ+O1xyXG4gICAgICAgIGNyZWF0ZU5vZGUoY2hvaWNlczogVFtdLCB2YWx1ZT86IFQpOiBWTm9kZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gZXhwb3J0IGludGVyZmFjZSBWTm9kZUNob29zZXIge1xyXG4gICAgLy8gICAgIGNyZWF0ZU5vZGUoY2hvaWNlczogVk5vZGVbXSwgY2hvc2VuS2V5OiBzdHJpbmcpOiBWTm9kZTtcclxuICAgIC8vICAgICBjaG9zZW4kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPjtcclxuICAgIC8vIH1cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuICAgIFxyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBDb250cm9sSGVscGVycyB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgIGV4cG9ydCBmdW5jdGlvbiBjaG9vc2VyPFQ+KFxyXG4gICAgICAgICAgICAgY2hvaWNlczogQ2hvaWNlW10pXHJcbiAgICAgICAgICAgICA6IFZOb2Rle1xyXG4gICAgICAgICAgICByZXR1cm4gaChcInVsLmNob29zZXJcIixcclxuICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlcy5tYXAoY2hvaWNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaChcImxpLmNob2ljZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3NlbjogY2hvaWNlLmNob3NlblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvaWNlLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2hvaWNlLm5vZGVdKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2hvaWNlIHtcclxuICAgICAgICAgICAgIG5vZGU6IFZOb2RlLCBcclxuICAgICAgICAgICAgIGNob3Nlbj86IGJvb2xlYW4sIFxyXG4gICAgICAgICAgICAgY2FsbGJhY2s/OiAoKSA9PiB2b2lkXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEZvbnRDaG9vc2VyIGltcGxlbWVudHMgVmFsdWVDb250cm9sPEZvbnRDaG9vc2VyU3RhdGU+IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBmb250Q2F0YWxvZzogRm9udFNoYXBlLkZvbnRDYXRhbG9nO1xyXG4gICAgICAgIHByaXZhdGUgX3ZhbHVlJCA9IG5ldyBSeC5TdWJqZWN0PEZvbnRDaG9vc2VyU3RhdGU+KCk7XHJcblxyXG4gICAgICAgIG1heEZhbWlsaWVzID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoZm9udENhdGFsb2c6IEZvbnRTaGFwZS5Gb250Q2F0YWxvZykge1xyXG4gICAgICAgICAgICB0aGlzLmZvbnRDYXRhbG9nID0gZm9udENhdGFsb2c7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBwcmVsb2FkRmFtaWxpZXMgPSB0aGlzLmZvbnRDYXRhbG9nLmdldENhdGVnb3JpZXMoKVxyXG4gICAgICAgICAgICAgICAgLm1hcChjID0+IGZvbnRDYXRhbG9nLmdldEZhbWlsaWVzKGMpWzBdKTtcclxuICAgICAgICAgICAgRm9udFNoYXBlLkZvbnRDYXRhbG9nLmxvYWRQcmV2aWV3U3Vic2V0cyhwcmVsb2FkRmFtaWxpZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHZhbHVlJCgpOiBSeC5PYnNlcnZhYmxlPEZvbnRDaG9vc2VyU3RhdGU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlJDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU/OiBGb250Q2hvb3NlclN0YXRlKTogVk5vZGUge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZHJlbjogVk5vZGVbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChoKFwiaDNcIiwgW1wiRm9udCBDYXRlZ29yaWVzXCJdKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhdGVnb3JpZXMgPSB0aGlzLmZvbnRDYXRhbG9nLmdldENhdGVnb3JpZXMoKTtcclxuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlDaG9pY2VzID0gY2F0ZWdvcmllcy5tYXAoY2F0ZWdvcnkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhdGVnb3J5RmFtaWxpZXMgPSB0aGlzLmZvbnRDYXRhbG9nLmdldEZhbWlsaWVzKGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1heEZhbWlsaWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlGYW1pbGllcyA9IGNhdGVnb3J5RmFtaWxpZXMuc2xpY2UoMCwgdGhpcy5tYXhGYW1pbGllcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmaXJzdEZhbWlseSA9IGNhdGVnb3J5RmFtaWxpZXNbMF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gPENvbnRyb2xIZWxwZXJzLkNob2ljZT57XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZTogaChcInNwYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IEZvbnRIZWxwZXJzLmdldENzc1N0eWxlKGZpcnN0RmFtaWx5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2F0ZWdvcnldKSxcclxuICAgICAgICAgICAgICAgICAgICBjaG9zZW46IHZhbHVlLmNhdGVnb3J5ID09PSBjYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGb250U2hhcGUuRm9udENhdGFsb2cubG9hZFByZXZpZXdTdWJzZXRzKGNhdGVnb3J5RmFtaWxpZXMpOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUkLm9uTmV4dCh7IGNhdGVnb3J5LCBmYW1pbHk6IGZpcnN0RmFtaWx5IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goQ29udHJvbEhlbHBlcnMuY2hvb3NlcihjYXRlZ29yeUNob2ljZXMpKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5jYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChoKFwiaDNcIiwge30sIFtcIkZvbnRzXCJdKSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZmFtaWxpZXMgPSB0aGlzLmZvbnRDYXRhbG9nLmdldEZhbWlsaWVzKHZhbHVlLmNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1heEZhbWlsaWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmFtaWxpZXMgPSBmYW1pbGllcy5zbGljZSgwLCB0aGlzLm1heEZhbWlsaWVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGZhbWlseU9wdGlvbnMgPSBmYW1pbGllcy5tYXAoZmFtaWx5ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gPENvbnRyb2xIZWxwZXJzLkNob2ljZT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGgoXCJzcGFuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IEZvbnRIZWxwZXJzLmdldENzc1N0eWxlKGZhbWlseSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZmFtaWx5XSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob3NlbjogdmFsdWUuZmFtaWx5ID09PSBmYW1pbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLl92YWx1ZSQub25OZXh0KHsgZmFtaWx5LCB2YXJpYW50OiBcIlwiIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKENvbnRyb2xIZWxwZXJzLmNob29zZXIoZmFtaWx5T3B0aW9ucykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodmFsdWUuZmFtaWx5KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YXJpYW50cyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0VmFyaWFudHModmFsdWUuZmFtaWx5KTtcclxuICAgICAgICAgICAgICAgIGlmICh2YXJpYW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChoKFwiaDNcIiwge30sIFtcIkZvbnQgU3R5bGVzXCJdKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhbnRPcHRpb25zID0gdmFyaWFudHMubWFwKHZhcmlhbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPENvbnRyb2xIZWxwZXJzLkNob2ljZT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwic3BhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IEZvbnRIZWxwZXJzLmdldENzc1N0eWxlKHZhbHVlLmZhbWlseSwgdmFyaWFudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt2YXJpYW50XSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9zZW46IHZhbHVlLnZhcmlhbnQgPT09IHZhcmlhbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5fdmFsdWUkLm9uTmV4dCh7IHZhcmlhbnQgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goQ29udHJvbEhlbHBlcnMuY2hvb3Nlcih2YXJpYW50T3B0aW9ucykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gaChcImRpdi5mb250Q2hvb3NlclwiLCB7fSwgY2hpbGRyZW4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEZvbnRDaG9vc2VyU3RhdGUge1xyXG4gICAgICAgIGNhdGVnb3J5Pzogc3RyaW5nO1xyXG4gICAgICAgIGZhbWlseT86IHN0cmluZztcclxuICAgICAgICB2YXJpYW50Pzogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgSW1hZ2VDaG9vc2VyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfY2hvc2VuJCA9IG5ldyBSeC5TdWJqZWN0PEltYWdlQ2hvaWNlPigpO1xyXG5cclxuICAgICAgICBjcmVhdGVOb2RlKG9wdGlvbnM6IEltYWdlQ2hvb3Nlck9wdGlvbnMpOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNob2ljZU5vZGVzID0gb3B0aW9ucy5jaG9pY2VzLm1hcChjID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpbWc6IFZOb2RlO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb25DbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaG9zZW4kLm9uTmV4dChjKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdG9yID0gb3B0aW9ucy5jaG9zZW4gPT09IGMudmFsdWUgXHJcbiAgICAgICAgICAgICAgICAgICAgPyBcImltZy5jaG9zZW5cIiBcclxuICAgICAgICAgICAgICAgICAgICA6IFwiaW1nXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoYy5sb2FkSW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1nRWxtO1xyXG4gICAgICAgICAgICAgICAgICAgIGltZyA9IGgoc2VsZWN0b3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IG9uQ2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ga2ljayBvZmYgaW1hZ2UgbG9hZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogdm5vZGUgPT4gYy5sb2FkSW1hZ2Uodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW11cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nID0gaChzZWxlY3RvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmOiBjLmltYWdlVXJsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogb25DbGlja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBoKFwibGlcIiwge30sIFtcclxuICAgICAgICAgICAgICAgICAgICBpbWdcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gaChcInVsLmNob29zZXJcIiwge30sIGNob2ljZU5vZGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBjaG9zZW4kKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hvc2VuJDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1hZ2VDaG9vc2VyT3B0aW9ucyB7XHJcbiAgICAgICAgY2hvaWNlczogSW1hZ2VDaG9pY2VbXSxcclxuICAgICAgICBjaG9zZW4/OiBzdHJpbmdcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEltYWdlQ2hvaWNlIHtcclxuICAgICAgICB2YWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIGxhYmVsOiBzdHJpbmc7XHJcbiAgICAgICAgaW1hZ2VVcmw/OiBzdHJpbmc7XHJcbiAgICAgICAgbG9hZEltYWdlPzogKGVsZW1lbnQ6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHZvaWQ7XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBUZW1wbGF0ZUZvbnRDaG9vc2VyIGltcGxlbWVudHMgQnVpbGRlckNvbnRyb2x7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBfZm9udENob29zZXI6IEZvbnRDaG9vc2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9mb250Q2hvb3NlciA9IG5ldyBGb250Q2hvb3NlcihzdG9yZS5mb250Q2F0YWxvZyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9mb250Q2hvb3Nlci5tYXhGYW1pbGllcyA9IDE1OyBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgY3JlYXRlTm9kZSh2YWx1ZTogVGVtcGxhdGVTdGF0ZSk6IFZOb2RlIHtcclxuICAgICAgICAgICAgY29uc3QgZm9udCA9IHZhbHVlLmRlc2lnbiAmJiB2YWx1ZS5kZXNpZ24uZm9udDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRDaG9vc2VyLmNyZWF0ZU5vZGUoPEZvbnRDaG9vc2VyU3RhdGU+e1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IHZhbHVlLmZvbnRDYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgIGZhbWlseTogZm9udCAmJiBmb250LmZhbWlseSxcclxuICAgICAgICAgICAgICAgIHZhcmlhbnQ6IGZvbnQgJiYgZm9udC52YXJpYW50XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdldCB2YWx1ZSQoKTogUnguT2JzZXJ2YWJsZTxUZW1wbGF0ZVN0YXRlPiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250Q2hvb3Nlci52YWx1ZSQubWFwKGNob2ljZSA9PiA8VGVtcGxhdGVTdGF0ZT57XHJcbiAgICAgICAgICAgICAgICBmb250Q2F0ZWdvcnk6IGNob2ljZS5jYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgIGRlc2lnbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFtaWx5OiBjaG9pY2UuZmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50OiBjaG9pY2UudmFyaWFudFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSBcclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRJbnB1dCBpbXBsZW1lbnRzIFZhbHVlQ29udHJvbDxzdHJpbmc+IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8c3RyaW5nPigpO1xyXG5cclxuICAgICAgICBjcmVhdGVOb2RlKHZhbHVlPzogc3RyaW5nLCBwbGFjZWhvbGRlcj86IHN0cmluZywgdGV4dGFyZWE/OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwidGV4dGFyZWFcIiA/IFwidGV4dGFyZWFcIiA6IFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0ZXh0YXJlYSA/IHVuZGVmaW5lZCA6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogcGxhY2Vob2xkZXJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5cHJlc3M6IChldjogS2V5Ym9hcmRFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChldi53aGljaCB8fCBldi5rZXlDb2RlKSA9PT0gRG9tSGVscGVycy5LZXlDb2Rlcy5FbnRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSA8SFRNTElucHV0RWxlbWVudD5ldi50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuYmx1cigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUkLm9uTmV4dChldi50YXJnZXQudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdmFsdWUkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWUkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlci5UZW1wbGF0ZXMge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEaWNrZW5zIGltcGxlbWVudHMgU2tldGNoQnVpbGRlci5UZW1wbGF0ZSB7XHJcblxyXG4gICAgICAgIG5hbWUgPSBcIkRpY2tlbnNcIjtcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJTdGFjayBibG9ja3Mgb2YgdGV4dCBpbiB0aGUgZm9ybSBvZiBhIHdhdnkgbGFkZGVyLlwiO1xyXG4gICAgICAgIGltYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgbGluZUhlaWdodFZhcmlhdGlvbiA9IDAuODtcclxuICAgICAgICBkZWZhdWx0Rm9udFNpemUgPSAxMjg7XHJcblxyXG4gICAgICAgIGNyZWF0ZU5ldyhjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IFRlbXBsYXRlU3RhdGUge1xyXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0Rm9udFJlY29yZCA9IGNvbnRleHQuZm9udENhdGFsb2cuZ2V0TGlzdCgxKVswXTtcclxuICAgICAgICAgICAgcmV0dXJuIDxUZW1wbGF0ZVN0YXRlPntcclxuICAgICAgICAgICAgICAgIGRlc2lnbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlOiBcIm5hcnJvd1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFtaWx5OiBkZWZhdWx0Rm9udFJlY29yZC5mYW1pbHlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNlZWQ6IE1hdGgucmFuZG9tKClcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmb250Q2F0ZWdvcnk6IGRlZmF1bHRGb250UmVjb3JkLmNhdGVnb3J5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNyZWF0ZVVJKGNvbnRleHQ6IFRlbXBsYXRlVUlDb250ZXh0KTogQnVpbGRlckNvbnRyb2xbXSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRleHRFbnRyeSgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVTaGFwZUNob29zZXIoY29udGV4dCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVZhcmlhdGlvbkNvbnRyb2woKSxcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuY3JlYXRlRm9udENob29zZXIoKSxcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUGFsZXR0ZUNob29zZXIoKVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYnVpbGQoZGVzaWduOiBEZXNpZ24sIGNvbnRleHQ6IFRlbXBsYXRlQnVpbGRDb250ZXh0KTogUHJvbWlzZTxwYXBlci5JdGVtPiB7XHJcbiAgICAgICAgICAgIGlmICghZGVzaWduLnRleHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0LmdldEZvbnQoZGVzaWduLmZvbnQpLnRoZW4oZm9udCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3b3JkcyA9IGRlc2lnbi50ZXh0LnRvTG9jYWxlVXBwZXJDYXNlKCkuc3BsaXQoL1xccy8pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsaW5lczogc3RyaW5nW107XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGRlc2lnbi5zaGFwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYXJyb3dcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMgPSB0aGlzLnNwbGl0V29yZHNOYXJyb3cod29yZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid2lkZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IHRoaXMuc3BsaXRXb3Jkc1dpZGUod29yZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IHRoaXMuc3BsaXRXb3Jkc05hcnJvdyh3b3Jkcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCB0ZXh0Q29sb3IgPSBkZXNpZ24ucGFsZXR0ZSAmJiBkZXNpZ24ucGFsZXR0ZS5jb2xvciB8fCBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlc2lnbi5wYWxldHRlICYmIGRlc2lnbi5wYWxldHRlLmludmVydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIFt0ZXh0Q29sb3IsIGJhY2tncm91bmRDb2xvcl0gPSBbYmFja2dyb3VuZENvbG9yLCB0ZXh0Q29sb3JdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGJveCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrcyA9IGxpbmVzLm1hcChsID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IGZvbnQuZ2V0UGF0aChsLCAwLCAwLCB0aGlzLmRlZmF1bHRGb250U2l6ZSkudG9QYXRoRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5tYXgoYmxvY2tzLm1hcChiID0+IGIuYm91bmRzLndpZHRoKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lSGVpZ2h0ID0gYmxvY2tzWzBdLmJvdW5kcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHVwcGVyID0gbmV3IHBhcGVyLlBhdGgoW1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLCAwKSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQobWF4V2lkdGgsIDApXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIGxldCBsb3dlcjogcGFwZXIuUGF0aDtcclxuICAgICAgICAgICAgICAgIGxldCByZW1haW5pbmcgPSBibG9ja3MubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZWRSYW5kb20gPSBuZXcgRnJhbWV3b3JrLlNlZWRSYW5kb20oXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzaWduLnNlZWQgPT0gbnVsbCA/IE1hdGgucmFuZG9tKCkgOiBkZXNpZ24uc2VlZCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIGJsb2Nrcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgtLXJlbWFpbmluZyA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1pZCA9IHVwcGVyLmJvdW5kcy5jZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxhc3QgbG93ZXIgbGluZSBpcyBsZXZlbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dlciA9IG5ldyBwYXBlci5QYXRoKFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLCBtaWQueSArIGxpbmVIZWlnaHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KG1heFdpZHRoLCBtaWQueSArIGxpbmVIZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VyID0gdGhpcy5yYW5kb21Mb3dlclBhdGhGb3IodXBwZXIsIGxpbmVIZWlnaHQsIHNlZWRSYW5kb20pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHJldGNoID0gbmV3IEZvbnRTaGFwZS5WZXJ0aWNhbEJvdW5kc1N0cmV0Y2hQYXRoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jaywgeyB1cHBlciwgbG93ZXIgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyZXRjaC5maWxsQ29sb3IgPSB0ZXh0Q29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LmFkZENoaWxkKHN0cmV0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwcGVyID0gbG93ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgbG93ZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IGJveC5ib3VuZHMuY2xvbmUoKTtcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5zaXplID0gYm91bmRzLnNpemUubXVsdGlwbHkoMS4xKTtcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5jZW50ZXIgPSBib3guYm91bmRzLmNlbnRlcjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSBwYXBlci5TaGFwZS5SZWN0YW5nbGUoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQuZmlsbENvbG9yID0gYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICAgICAgYm94Lmluc2VydENoaWxkKDAsIGJhY2tncm91bmQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBib3g7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSByYW5kb21Mb3dlclBhdGhGb3IodXBwZXI6IHBhcGVyLlBhdGgsIGF2Z0hlaWdodDogbnVtYmVyLCBzZWVkUmFuZG9tOiBGcmFtZXdvcmsuU2VlZFJhbmRvbSk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgICAgICBjb25zdCBwb2ludHM6IHBhcGVyLlBvaW50W10gPSBbXTtcclxuICAgICAgICAgICAgbGV0IHVwcGVyQ2VudGVyID0gdXBwZXIuYm91bmRzLmNlbnRlcjtcclxuICAgICAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgICAgICBjb25zdCBudW1Qb2ludHMgPSA0O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVBvaW50czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gdXBwZXJDZW50ZXIueSArIChzZWVkUmFuZG9tLnJhbmRvbSgpIC0gMC41KSAqIHRoaXMubGluZUhlaWdodFZhcmlhdGlvbiAqIGF2Z0hlaWdodDtcclxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKG5ldyBwYXBlci5Qb2ludCh4LCB5KSk7XHJcbiAgICAgICAgICAgICAgICB4ICs9IHVwcGVyLmJvdW5kcy53aWR0aCAvIChudW1Qb2ludHMgLSAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbmV3IHBhcGVyLlBhdGgocG9pbnRzKTtcclxuICAgICAgICAgICAgcGF0aC5zbW9vdGgoKTtcclxuICAgICAgICAgICAgcGF0aC5ib3VuZHMuY2VudGVyID0gdXBwZXIuYm91bmRzLmNlbnRlci5hZGQobmV3IHBhcGVyLlBvaW50KDAsIGF2Z0hlaWdodCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3BsaXRXb3Jkc05hcnJvdyh3b3Jkczogc3RyaW5nW10pOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgICAgICBjb25zdCBpZGVhbCA9IF8ubWF4KHdvcmRzLm1hcCh3ID0+IHcubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGNTY29yZSA9ICh0ZXh0OiBzdHJpbmcpID0+XHJcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhNYXRoLmFicyhpZGVhbCAtIHRleHQubGVuZ3RoKSwgMik7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3VycmVudExpbmUgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFNjb3JlID0gMTAwMDA7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAod29yZHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3b3JkID0gd29yZHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xpbmUgPSBjdXJyZW50TGluZSArIFwiIFwiICsgd29yZDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Njb3JlID0gY2FsY1Njb3JlKG5ld0xpbmUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRMaW5lICYmIG5ld1Njb3JlIDw9IGN1cnJlbnRTY29yZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFwcGVuZFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lICs9IFwiIFwiICsgd29yZDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NvcmUgPSBuZXdTY29yZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGxpbmVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudExpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaChjdXJyZW50TGluZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gd29yZDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NvcmUgPSBjYWxjU2NvcmUoY3VycmVudExpbmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxpbmVzLnB1c2goY3VycmVudExpbmUpO1xyXG4gICAgICAgICAgICByZXR1cm4gbGluZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNwbGl0V29yZHNXaWRlKHdvcmRzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRMZW5ndGggPSBfLnN1bSh3b3Jkcy5tYXAodyA9PiB3Lmxlbmd0aCArIDEpKSAvIDI7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0TGluZSA9IHdvcmRzO1xyXG4gICAgICAgICAgICBjb25zdCBzZWNvbmRMaW5lID0gW107XHJcbiAgICAgICAgICAgIGxldCBzZWNvbmRMaW5lTGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKHNlY29uZExpbmVMZW5ndGggPCB0YXJnZXRMZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmQgPSB3b3Jkcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZExpbmUudW5zaGlmdCh3b3JkKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZExpbmVMZW5ndGggKz0gd29yZC5sZW5ndGggKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICBmaXJzdExpbmUuam9pbihcIiBcIiksXHJcbiAgICAgICAgICAgICAgICBzZWNvbmRMaW5lLmpvaW4oXCIgXCIpXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVRleHRFbnRyeSgpOiBCdWlsZGVyQ29udHJvbCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRleHRJbnB1dCA9IG5ldyBUZXh0SW5wdXQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZU5vZGU6ICh2YWx1ZTogVGVtcGxhdGVTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJoM1wiLCB7fSwgW1wiTWVzc2FnZVwiXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0SW5wdXQuY3JlYXRlTm9kZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSAmJiB2YWx1ZS5kZXNpZ24udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIldoYXQgZG8geW91IHdhbnQgdG8gc2F5P1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbHVlJDogdGV4dElucHV0LnZhbHVlJC5tYXAodiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPnsgZGVzaWduOiB7IHRleHQ6IHYgfSB9O1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVTaGFwZUNob29zZXIoY29udGV4dDogVGVtcGxhdGVVSUNvbnRleHQpOiBCdWlsZGVyQ29udHJvbCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlJCA9IG5ldyBSeC5TdWJqZWN0PFRlbXBsYXRlU3RhdGVDaGFuZ2U+KCk7XHJcbiAgICAgICAgICAgIHJldHVybiA8QnVpbGRlckNvbnRyb2w+e1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlTm9kZTogKHRzOiBUZW1wbGF0ZVN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hvaWNlcyA9IFtcIm5hcnJvd1wiLCBcIndpZGVcIl0ubWFwKHNoYXBlID0+IDxDb250cm9sSGVscGVycy5DaG9pY2U+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwic3BhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc2hhcGVdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hvc2VuOiB0cy5kZXNpZ24uc2hhcGUgPT09IHNoYXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUkLm9uTmV4dCh7IGRlc2lnbjogeyBzaGFwZSB9IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJoM1wiLCB7fSwgW1wiU2hhcGVcIl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29udHJvbEhlbHBlcnMuY2hvb3NlcihjaG9pY2VzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWUkOiB2YWx1ZSQuYXNPYnNlcnZhYmxlKClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlVmFyaWF0aW9uQ29udHJvbCgpOiBCdWlsZGVyQ29udHJvbCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlJCA9IG5ldyBSeC5TdWJqZWN0PFRlbXBsYXRlU3RhdGVDaGFuZ2U+KCk7XHJcbiAgICAgICAgICAgIHJldHVybiA8QnVpbGRlckNvbnRyb2w+e1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlTm9kZTogKHRzOiBUZW1wbGF0ZVN0YXRlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IGgoXCJidXR0b24uYnRuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHZhbHVlJC5vbk5leHQoeyBkZXNpZ246IHsgc2VlZDogTWF0aC5yYW5kb20oKSB9IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIk5leHRcIl1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaDNcIiwge30sIFtcIlZhcmlhdGlvblwiXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbHVlJDogdmFsdWUkLmFzT2JzZXJ2YWJsZSgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVBhbGV0dGVDaG9vc2VyKCk6IEJ1aWxkZXJDb250cm9sIHtcclxuICAgICAgICAgICAgY29uc3QgcGFyc2VkQ29sb3JzID0gdGhpcy5wYWxldHRlQ29sb3JzLm1hcChjID0+IG5ldyBwYXBlci5Db2xvcihjKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9ycyA9IF8uc29ydEJ5KHBhcnNlZENvbG9ycywgYyA9PiBjLmh1ZSlcclxuICAgICAgICAgICAgICAgIC5tYXAoYyA9PiBjLnRvQ1NTKHRydWUpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlJCA9IG5ldyBSeC5TdWJqZWN0PFRlbXBsYXRlU3RhdGVDaGFuZ2U+KCk7XHJcbiAgICAgICAgICAgIHJldHVybiA8QnVpbGRlckNvbnRyb2w+e1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlTm9kZTogKHRzOiBUZW1wbGF0ZVN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFsZXR0ZSA9IHRzLmRlc2lnbi5wYWxldHRlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNob2ljZXMgPSBjb2xvcnMubWFwKGNvbG9yID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb250cm9sSGVscGVycy5DaG9pY2U+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogaChcImRpdi5wYWxldHRlVGlsZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvc2VuOiBwYWxldHRlICYmIHBhbGV0dGUuY29sb3IgPT09IGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSQub25OZXh0KHsgZGVzaWduOiB7IHBhbGV0dGU6IHsgY29sb3IgfSB9IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW52ZXJ0Tm9kZSA9IGgoXCJkaXZcIiwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwibGFiZWxcIiwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZDogcGFsZXR0ZSAmJiBwYWxldHRlLmludmVydFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB2YWx1ZSQub25OZXh0KHsgZGVzaWduOiB7IHBhbGV0dGU6IHsgaW52ZXJ0OiBldi50YXJnZXQuY2hlY2tlZCB9IH0gfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkludmVydCBjb2xvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBoKFwiZGl2LmNvbG9yQ2hvb3NlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaDNcIiwge30sIFtcIkNvbG9yXCJdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbnRyb2xIZWxwZXJzLmNob29zZXIoY2hvaWNlcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnROb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSQ6IHZhbHVlJC5hc09ic2VydmFibGUoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBhbGV0dGVDb2xvcnMgPSBbXHJcbiAgICAgICAgICAgIFwiIzRiMzgzMlwiLFxyXG4gICAgICAgICAgICBcIiM4NTQ0NDJcIixcclxuICAgICAgICAgICAgLy9cIiNmZmY0ZTZcIixcclxuICAgICAgICAgICAgXCIjM2MyZjJmXCIsXHJcbiAgICAgICAgICAgIFwiI2JlOWI3YlwiLFxyXG5cclxuICAgICAgICAgICAgXCIjMWI4NWI4XCIsXHJcbiAgICAgICAgICAgIFwiIzVhNTI1NVwiLFxyXG4gICAgICAgICAgICBcIiM1NTllODNcIixcclxuICAgICAgICAgICAgXCIjYWU1YTQxXCIsXHJcbiAgICAgICAgICAgIFwiI2MzY2I3MVwiLFxyXG5cclxuICAgICAgICAgICAgXCIjMGUxYTQwXCIsXHJcbiAgICAgICAgICAgIFwiIzIyMmY1YlwiLFxyXG4gICAgICAgICAgICBcIiM1ZDVkNWRcIixcclxuICAgICAgICAgICAgXCIjOTQ2YjJkXCIsXHJcbiAgICAgICAgICAgIFwiIzAwMDAwMFwiLFxyXG5cclxuICAgICAgICAgICAgXCIjZWRjOTUxXCIsXHJcbiAgICAgICAgICAgIFwiI2ViNjg0MVwiLFxyXG4gICAgICAgICAgICBcIiNjYzJhMzZcIixcclxuICAgICAgICAgICAgXCIjNGYzNzJkXCIsXHJcbiAgICAgICAgICAgIFwiIzAwYTBiMFwiLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEb2N1bWVudEtleUhhbmRsZXIge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihzdG9yZTogU3RvcmUpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIG5vdGU6IHVuZGlzcG9zZWQgZXZlbnQgc3Vic2NyaXB0aW9uXHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLmtleXVwKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gRG9tSGVscGVycy5LZXlDb2Rlcy5Fc2MpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2gobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTa2V0Y2hFZGl0b3JNb2R1bGUge1xyXG5cclxuICAgICAgICBhcHBTdG9yZTogQXBwLlN0b3JlO1xyXG4gICAgICAgIHN0b3JlOiBTdG9yZTtcclxuICAgICAgICB3b3Jrc3BhY2VDb250cm9sbGVyOiBXb3Jrc3BhY2VDb250cm9sbGVyO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihhcHBTdG9yZTogQXBwLlN0b3JlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUgPSBhcHBTdG9yZTtcclxuXHJcbiAgICAgICAgICAgIERvbUhlbHBlcnMuaW5pdEVycm9ySGFuZGxlcihlcnJvckRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IEpTT04uc3RyaW5naWZ5KGVycm9yRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL2NsaWVudC1lcnJvcnNcIixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGNvbnRlbnRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IG5ldyBTdG9yZShhcHBTdG9yZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBiYXIgPSBuZXcgRWRpdG9yQmFyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNpZ25lcicpLCB0aGlzLnN0b3JlKTtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtRWRpdG9yID0gbmV3IFNlbGVjdGVkSXRlbUVkaXRvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRvck92ZXJsYXlcIiksIHRoaXMuc3RvcmUpO1xyXG4gICAgICAgICAgICBjb25zdCBoZWxwRGlhbG9nID0gbmV3IEhlbHBEaWFsb2coZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWxwLWRpYWxvZ1wiKSwgdGhpcy5zdG9yZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBldmVudHMuc3Vic2NyaWJlKG0gPT4gY29uc29sZS5sb2coXCJldmVudFwiLCBtLnR5cGUsIG0uZGF0YSkpO1xyXG4gICAgICAgICAgICAvLyBhY3Rpb25zLnN1YnNjcmliZShtID0+IGNvbnNvbGUubG9nKFwiYWN0aW9uXCIsIG0udHlwZSwgbS5kYXRhKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGFydCgpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZXZlbnRzLmVkaXRvci5mb250TG9hZGVkLm9ic2VydmUoKS5maXJzdCgpLnN1YnNjcmliZShtID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmtzcGFjZUNvbnRyb2xsZXIgPSBuZXcgV29ya3NwYWNlQ29udHJvbGxlcih0aGlzLnN0b3JlLCBtLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3IuaW5pdFdvcmtzcGFjZS5kaXNwYXRjaCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuZXZlbnRzLmVkaXRvci53b3Jrc3BhY2VJbml0aWFsaXplZC5zdWIoKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oXCJiZWZvcmV1bmxvYWRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2hJc0RpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJZb3VyIGxhdGVzdCBjaGFuZ2VzIGFyZSBub3Qgc2F2ZWQgeWV0LlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3BlblNrZXRjaChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2gub3Blbi5kaXNwYXRjaChpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFNrZXRjaEhlbHBlcnMge1xyXG5cclxuICAgICAgICBzdGF0aWMgY29sb3JzSW5Vc2Uoc2tldGNoOiBTa2V0Y2gpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgICAgIGxldCBjb2xvcnMgPSBbc2tldGNoLmJhY2tncm91bmRDb2xvcl07XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmxvY2sgb2Ygc2tldGNoLnRleHRCbG9ja3MpIHtcclxuICAgICAgICAgICAgICAgIGNvbG9ycy5wdXNoKGJsb2NrLmJhY2tncm91bmRDb2xvcik7XHJcbiAgICAgICAgICAgICAgICBjb2xvcnMucHVzaChibG9jay50ZXh0Q29sb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbG9ycyA9IF8udW5pcShjb2xvcnMuZmlsdGVyKGMgPT4gYyAhPSBudWxsKSk7XHJcbiAgICAgICAgICAgIGNvbG9ycy5zb3J0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2xvcnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHN0YXRpYyBnZXRTa2V0Y2hGaWxlTmFtZShza2V0Y2g6IFNrZXRjaCwgbGVuZ3RoOiBudW1iZXIsIGV4dGVuc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IG5hbWUgPSBcIlwiO1xyXG4gICAgICAgICAgICBvdXRlcjpcclxuICAgICAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiBza2V0Y2gudGV4dEJsb2Nrcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB3b3JkIG9mIGJsb2NrLnRleHQuc3BsaXQoL1xccy8pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJpbSA9IHdvcmQucmVwbGFjZSgvXFxXL2csICcnKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyaW0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lLmxlbmd0aCkgbmFtZSArPSBcIiBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSArPSB0cmltO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGggPj0gbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIW5hbWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gXCJmaWRkbGVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmFtZSArIFwiLlwiICsgZXh0ZW5zaW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwiXHJcbm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIHNpbmdsZXRvbiBTdG9yZSBjb250cm9scyBhbGwgYXBwbGljYXRpb24gc3RhdGUuXHJcbiAgICAgKiBObyBwYXJ0cyBvdXRzaWRlIG9mIHRoZSBTdG9yZSBtb2RpZnkgYXBwbGljYXRpb24gc3RhdGUuXHJcbiAgICAgKiBDb21tdW5pY2F0aW9uIHdpdGggdGhlIFN0b3JlIGlzIGRvbmUgdGhyb3VnaCBtZXNzYWdlIENoYW5uZWxzOiBcclxuICAgICAqICAgLSBBY3Rpb25zIGNoYW5uZWwgdG8gc2VuZCBpbnRvIHRoZSBTdG9yZSxcclxuICAgICAqICAgLSBFdmVudHMgY2hhbm5lbCB0byByZWNlaXZlIG5vdGlmaWNhdGlvbiBmcm9tIHRoZSBTdG9yZS5cclxuICAgICAqIE9ubHkgdGhlIFN0b3JlIGNhbiByZWNlaXZlIGFjdGlvbiBtZXNzYWdlcy5cclxuICAgICAqIE9ubHkgdGhlIFN0b3JlIGNhbiBzZW5kIGV2ZW50IG1lc3NhZ2VzLlxyXG4gICAgICogVGhlIFN0b3JlIGNhbm5vdCBzZW5kIGFjdGlvbnMgb3IgbGlzdGVuIHRvIGV2ZW50cyAodG8gYXZvaWQgbG9vcHMpLlxyXG4gICAgICogTWVzc2FnZXMgYXJlIHRvIGJlIHRyZWF0ZWQgYXMgaW1tdXRhYmxlLlxyXG4gICAgICogQWxsIG1lbnRpb25zIG9mIHRoZSBTdG9yZSBjYW4gYmUgYXNzdW1lZCB0byBtZWFuLCBvZiBjb3Vyc2UsXHJcbiAgICAgKiAgIFwiVGhlIFN0b3JlIGFuZCBpdHMgc3ViLWNvbXBvbmVudHMuXCJcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFN0b3JlIHtcclxuXHJcbiAgICAgICAgc3RhdGljIEJST1dTRVJfSURfS0VZID0gXCJicm93c2VySWRcIjtcclxuICAgICAgICBzdGF0aWMgRkFMTEJBQ0tfRk9OVF9VUkwgPSBcIi9mb250cy9Sb2JvdG8tNTAwLnR0ZlwiO1xyXG4gICAgICAgIHN0YXRpYyBERUZBVUxUX0ZPTlRfTkFNRSA9IFwiUm9ib3RvXCI7XHJcbiAgICAgICAgc3RhdGljIFNLRVRDSF9MT0NBTF9DQUNIRV9LRVkgPSBcImZpZGRsZXN0aWNrcy5pby5sYXN0U2tldGNoXCI7XHJcbiAgICAgICAgc3RhdGljIExPQ0FMX0NBQ0hFX0RFTEFZX01TID0gMTAwMDtcclxuICAgICAgICBzdGF0aWMgU0VSVkVSX1NBVkVfREVMQVlfTVMgPSAxMDAwMDtcclxuICAgICAgICBzdGF0aWMgR1JFRVRJTkdfU0tFVENIX0lEID0gXCJpbTJiYTkyaTE3MTRpXCI7XHJcblxyXG4gICAgICAgIGZvbnRMaXN0TGltaXQgPSAyNTA7XHJcblxyXG4gICAgICAgIHN0YXRlOiBFZGl0b3JTdGF0ZSA9IHt9O1xyXG4gICAgICAgIHJlc291cmNlczogU3RvcmVSZXNvdXJjZXMgPSB7fTtcclxuICAgICAgICBhY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgICAgICBldmVudHMgPSBuZXcgRXZlbnRzKCk7XHJcblxyXG4gICAgICAgIHByaXZhdGUgYXBwU3RvcmU6IEFwcC5TdG9yZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoYXBwU3RvcmU6IEFwcC5TdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlID0gYXBwU3RvcmU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldHVwU3RhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0dXBTdWJzY3JpcHRpb25zKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxvYWRSZXNvdXJjZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldHVwU3RhdGUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuYnJvd3NlcklkID0gQ29va2llcy5nZXQoU3RvcmUuQlJPV1NFUl9JRF9LRVkpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYnJvd3NlcklkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmJyb3dzZXJJZCA9IEZyYW1ld29yay5uZXdpZCgpO1xyXG4gICAgICAgICAgICAgICAgQ29va2llcy5zZXQoU3RvcmUuQlJPV1NFUl9JRF9LRVksIHRoaXMuc3RhdGUuYnJvd3NlcklkLCB7IGV4cGlyZXM6IDIgKiAzNjUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldHVwU3Vic2NyaXB0aW9ucygpIHtcclxuICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuYWN0aW9ucywgZXZlbnRzID0gdGhpcy5ldmVudHM7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBBcHAgLS0tLS1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUuZXZlbnRzLnJvdXRlQ2hhbmdlZC5zdWIocm91dGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm91dGVTa2V0Y2hJZCA9IHJvdXRlLnBhcmFtcy5za2V0Y2hJZDtcclxuICAgICAgICAgICAgICAgIGlmIChyb3V0ZS5uYW1lID09PSBcInNrZXRjaFwiICYmIHJvdXRlU2tldGNoSWQgIT09IHRoaXMuc3RhdGUuc2tldGNoLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlblNrZXRjaChyb3V0ZVNrZXRjaElkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBFZGl0b3IgLS0tLS1cclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmluaXRXb3Jrc3BhY2Uub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgICAgICAucGF1c2FibGVCdWZmZXJlZChldmVudHMuZWRpdG9yLnJlc291cmNlc1JlYWR5Lm9ic2VydmUoKS5tYXAobSA9PiBtLmRhdGEpKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBza2V0Y2hJZCA9IHRoaXMuYXBwU3RvcmUuc3RhdGUucm91dGUucGFyYW1zLnNrZXRjaElkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IHRoaXMuYXBwU3RvcmUuc3RhdGUubGFzdFNhdmVkU2tldGNoSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb21pc2U6IEpRdWVyeVByb21pc2U8YW55PjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2tldGNoSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9IHRoaXMub3BlblNrZXRjaChza2V0Y2hJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9IHRoaXMubG9hZEdyZWV0aW5nU2tldGNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbigoKSA9PiBldmVudHMuZWRpdG9yLndvcmtzcGFjZUluaXRpYWxpemVkLmRpc3BhdGNoKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBvbiBhbnkgYWN0aW9uLCB1cGRhdGUgc2F2ZSBkZWxheSB0aW1lclxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5vYnNlcnZlKCkuZGVib3VuY2UoU3RvcmUuU0VSVkVSX1NBVkVfREVMQVlfTVMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2tldGNoID0gdGhpcy5zdGF0ZS5za2V0Y2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHNrZXRjaC5faWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBza2V0Y2gudGV4dEJsb2Nrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVTa2V0Y2goc2tldGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmxvYWRGb250LnN1YnNjcmliZShtID0+XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcy5wYXJzZWRGb250cy5nZXQobS5kYXRhKSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci56b29tVG9GaXQuZm9yd2FyZChcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5lZGl0b3Iuem9vbVRvRml0UmVxdWVzdGVkKTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmV4cG9ydFBORy5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLmV4cG9ydFBOR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmV4cG9ydFNWRy5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLmV4cG9ydFNWR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLnZpZXdDaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5lZGl0b3Iudmlld0NoYW5nZWQuZGlzcGF0Y2gobS5kYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci51cGRhdGVTbmFwc2hvdC5zdWIoKHtza2V0Y2hJZCwgcG5nRGF0YVVybH0pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChza2V0Y2hJZCA9PT0gdGhpcy5zdGF0ZS5za2V0Y2guX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBza2V0Y2hJZCArIFwiLnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBEb21IZWxwZXJzLmRhdGFVUkxUb0Jsb2IocG5nRGF0YVVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgUzNBY2Nlc3MucHV0RmlsZShmaWxlTmFtZSwgXCJpbWFnZS9wbmdcIiwgYmxvYik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3IudG9nZ2xlSGVscC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zaG93SGVscCA9ICF0aGlzLnN0YXRlLnNob3dIZWxwO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLmVkaXRvci5zaG93SGVscENoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5zaG93SGVscCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3Iub3BlblNhbXBsZS5zdWIoKCkgPT4gdGhpcy5sb2FkR3JlZXRpbmdTa2V0Y2goKSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBTa2V0Y2ggLS0tLS1cclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLm9wZW4uc3ViKGlkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblNrZXRjaChpZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guY3JlYXRlLnN1YigoYXR0cikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdTa2V0Y2goYXR0cik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guY2xlYXIuc3ViKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJTa2V0Y2goKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLmNsb25lLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9uZSA9IF8uY2xvbmUodGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgY2xvbmUuX2lkID0gRnJhbWV3b3JrLm5ld2lkKCk7XHJcbiAgICAgICAgICAgICAgICBjbG9uZS5icm93c2VySWQgPSB0aGlzLnN0YXRlLmJyb3dzZXJJZDtcclxuICAgICAgICAgICAgICAgIGNsb25lLnNhdmVkQXQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKGNsb25lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmNsb25lZC5kaXNwYXRjaChjbG9uZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1bHNlVXNlck1lc3NhZ2UoXCJEdXBsaWNhdGVkIHNrZXRjaC4gQWRkcmVzcyBvZiB0aGlzIHBhZ2UgaGFzIGJlZW4gdXBkYXRlZC5cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZS5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXJnZSh0aGlzLnN0YXRlLnNrZXRjaCwgZXYuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obS5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obS5kYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gVGV4dEJsb2NrIC0tLS0tXHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5hZGRcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRjaCA9IGV2LmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXRjaC50ZXh0IHx8ICFwYXRjaC50ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHsgX2lkOiBGcmFtZXdvcmsubmV3aWQoKSB9IGFzIFRleHRCbG9jaztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lcmdlKGJsb2NrLCBwYXRjaCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnRleHRDb2xvciA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLnRleHRDb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ci5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFibG9jay5mb250RmFtaWx5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLmZvbnRGYW1pbHkgPSB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ci5mb250RmFtaWx5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5mb250VmFyaWFudCA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLmZvbnRWYXJpYW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2gudGV4dEJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmFkZGVkLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRleHRCbG9ja0ZvbnQoYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB0aGlzLmdldEJsb2NrKGV2LmRhdGEuX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gPFRleHRCbG9jaz57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBldi5kYXRhLnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGV2LmRhdGEuYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBldi5kYXRhLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGV2LmRhdGEuZm9udEZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRWYXJpYW50OiBldi5kYXRhLmZvbnRWYXJpYW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvbnRDaGFuZ2VkID0gcGF0Y2guZm9udEZhbWlseSAhPT0gYmxvY2suZm9udEZhbWlseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgcGF0Y2guZm9udFZhcmlhbnQgIT09IGJsb2NrLmZvbnRWYXJpYW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lcmdlKGJsb2NrLCBwYXRjaCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2suZm9udEZhbWlseSAmJiAhYmxvY2suZm9udFZhcmlhbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMucmVzb3VyY2VzLmZvbnRDYXRhbG9nLmdldFJlY29yZChibG9jay5mb250RmFtaWx5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWd1bGFyIG9yIGVsc2UgZmlyc3QgdmFyaWFudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLmZvbnRWYXJpYW50ID0gRm9udFNoYXBlLkZvbnRDYXRhbG9nLmRlZmF1bHRWYXJpYW50KHJlY29yZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBibG9jay50ZXh0Q29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGJsb2NrLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGJsb2NrLmZvbnRGYW1pbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogYmxvY2suZm9udFZhcmlhbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm9udENoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRleHRCbG9ja0ZvbnQoYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5yZW1vdmVcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaWREZWxldGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBfLnJlbW92ZSh0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLCB0YiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0Yi5faWQgPT09IGV2LmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWREZWxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlkRGVsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5kaXNwYXRjaCh7IF9pZDogZXYuZGF0YS5faWQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2VcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuZ2V0QmxvY2soZXYuZGF0YS5faWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5wb3NpdGlvbiA9IGV2LmRhdGEucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLm91dGxpbmUgPSBldi5kYXRhLm91dGxpbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXJyYW5nZUNoYW5nZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIG9wZW5Ta2V0Y2goaWQ6IHN0cmluZyk6IEpRdWVyeVByb21pc2U8U2tldGNoPiB7XHJcbiAgICAgICAgICAgIGlmICghaWQgfHwgIWlkLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBTM0FjY2Vzcy5nZXRKc29uKGlkICsgXCIuanNvblwiKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAoc2tldGNoOiBTa2V0Y2gpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goc2tldGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXRyaWV2ZWQgc2tldGNoXCIsIHNrZXRjaC5faWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChza2V0Y2guYnJvd3NlcklkID09PSB0aGlzLnN0YXRlLmJyb3dzZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2tldGNoIHdhcyBjcmVhdGVkIGluIHRoaXMgYnJvd3NlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NrZXRjaCB3YXMgY3JlYXRlZCBpbiBhIGRpZmZlcmVudCBicm93c2VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2tldGNoO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiZXJyb3IgZ2V0dGluZyByZW1vdGUgc2tldGNoXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkR3JlZXRpbmdTa2V0Y2goKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkU2tldGNoKHNrZXRjaDogU2tldGNoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoID0gc2tldGNoO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0VXNlck1lc3NhZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5sb2FkZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlLmFjdGlvbnMuZWRpdG9yTG9hZGVkU2tldGNoLmRpc3BhdGNoKHNrZXRjaC5faWQpO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRiIG9mIHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5sb2FkZWQuZGlzcGF0Y2godGIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkVGV4dEJsb2NrRm9udCh0Yik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVkaXRvci56b29tVG9GaXRSZXF1ZXN0ZWQuZGlzcGF0Y2goKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkR3JlZXRpbmdTa2V0Y2goKTogSlF1ZXJ5UHJvbWlzZTxhbnk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFMzQWNjZXNzLmdldEpzb24oU3RvcmUuR1JFRVRJTkdfU0tFVENIX0lEICsgXCIuanNvblwiKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoKHNrZXRjaDogU2tldGNoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tldGNoLl9pZCA9IEZyYW1ld29yay5uZXdpZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNrZXRjaC5icm93c2VySWQgPSB0aGlzLnN0YXRlLmJyb3dzZXJJZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goc2tldGNoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjbGVhclNrZXRjaCgpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2tldGNoID0gPFNrZXRjaD50aGlzLmRlZmF1bHRTa2V0Y2hBdHRyKCk7XHJcbiAgICAgICAgICAgIHNrZXRjaC5faWQgPSB0aGlzLnN0YXRlLnNrZXRjaC5faWQ7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkUmVzb3VyY2VzKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlcy5wYXJzZWRGb250cyA9IG5ldyBGb250U2hhcGUuUGFyc2VkRm9udHMocGFyc2VkID0+XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lZGl0b3IuZm9udExvYWRlZC5kaXNwYXRjaChwYXJzZWQuZm9udCkpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBGb250U2hhcGUuRm9udENhdGFsb2cuZnJvbUxvY2FsKFwiZm9udHMvZ29vZ2xlLWZvbnRzLmpzb25cIilcclxuICAgICAgICAgICAgICAgIC50aGVuKGNhdGFsb2cgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZvbnRDYXRhbG9nID0gY2F0YWxvZztcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBsb2FkIGZvbnRzIGludG8gYnJvd3NlciBmb3IgcHJldmlld1xyXG4gICAgICAgICAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5sb2FkUHJldmlld1N1YnNldHMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGFsb2cuZ2V0TGlzdCh0aGlzLmZvbnRMaXN0TGltaXQpLm1hcChmID0+IGYuZmFtaWx5KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChTdG9yZS5GQUxMQkFDS19GT05UX1VSTCkudGhlbigoe2ZvbnR9KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcy5mYWxsYmFja0ZvbnQgPSBmb250KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnJlc291cmNlc1JlYWR5LmRpc3BhdGNoKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNldFVzZXJNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS51c2VyTWVzc2FnZSAhPT0gbWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS51c2VyTWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lZGl0b3IudXNlck1lc3NhZ2VDaGFuZ2VkLmRpc3BhdGNoKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHB1bHNlVXNlck1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlck1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXREZWZhdWx0VXNlck1lc3NhZ2UoKSwgNDAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNldERlZmF1bHRVc2VyTWVzc2FnZSgpIHtcclxuICAgICAgICAgICAgLy8gaWYgbm90IHRoZSBsYXN0IHNhdmVkIHNrZXRjaCwgb3Igc2tldGNoIGlzIGRpcnR5LCBzaG93IFwiVW5zYXZlZFwiXHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAodGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5XHJcbiAgICAgICAgICAgICAgICB8fCAhdGhpcy5zdGF0ZS5za2V0Y2guc2F2ZWRBdClcclxuICAgICAgICAgICAgICAgID8gXCJVbnNhdmVkXCJcclxuICAgICAgICAgICAgICAgIDogXCJTYXZlZFwiO1xyXG4gICAgICAgICAgICB0aGlzLnNldFVzZXJNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkVGV4dEJsb2NrRm9udChibG9jazogVGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZvbnRDYXRhbG9nLmdldFVybChibG9jay5mb250RmFtaWx5LCBibG9jay5mb250VmFyaWFudCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoe2ZvbnR9KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5mb250UmVhZHkuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dEJsb2NrSWQ6IGJsb2NrLl9pZCwgZm9udCB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNoYW5nZWRTa2V0Y2hDb250ZW50KCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guY29udGVudENoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBtZXJnZTxUPihkZXN0OiBULCBzb3VyY2U6IFQpIHtcclxuICAgICAgICAgICAgXy5tZXJnZShkZXN0LCBzb3VyY2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBuZXdTa2V0Y2goYXR0cj86IFNrZXRjaEF0dHIpOiBTa2V0Y2gge1xyXG4gICAgICAgICAgICBjb25zdCBza2V0Y2ggPSA8U2tldGNoPnRoaXMuZGVmYXVsdFNrZXRjaEF0dHIoKTtcclxuICAgICAgICAgICAgc2tldGNoLl9pZCA9IEZyYW1ld29yay5uZXdpZCgpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXJnZShza2V0Y2gsIGF0dHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2tldGNoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkZWZhdWx0U2tldGNoQXR0cigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDxTa2V0Y2hBdHRyPntcclxuICAgICAgICAgICAgICAgIGJyb3dzZXJJZDogdGhpcy5zdGF0ZS5icm93c2VySWQsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0VGV4dEJsb2NrQXR0cjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwiUm9ib3RvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFZhcmlhbnQ6IFwicmVndWxhclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHRDb2xvcjogXCJncmF5XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwid2hpdGVcIixcclxuICAgICAgICAgICAgICAgIHRleHRCbG9ja3M6IDxUZXh0QmxvY2tbXT5bXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzYXZlU2tldGNoKHNrZXRjaDogU2tldGNoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNhdmluZyA9IF8uY2xvbmUoc2tldGNoKTtcclxuICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgc2F2aW5nLnNhdmVkQXQgPSBub3c7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlck1lc3NhZ2UoXCJTYXZpbmdcIik7XHJcbiAgICAgICAgICAgIFMzQWNjZXNzLnB1dEZpbGUoc2tldGNoLl9pZCArIFwiLmpzb25cIixcclxuICAgICAgICAgICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiLCBKU09OLnN0cmluZ2lmeShzYXZpbmcpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoLnNhdmVkQXQgPSBub3c7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0VXNlck1lc3NhZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcFN0b3JlLmFjdGlvbnMuZWRpdG9yU2F2ZWRTa2V0Y2guZGlzcGF0Y2goc2tldGNoLl9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnNuYXBzaG90RXhwaXJlZC5kaXNwYXRjaChza2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFVzZXJNZXNzYWdlKFwiVW5hYmxlIHRvIHNhdmVcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0U2VsZWN0aW9uKGl0ZW06IFdvcmtzcGFjZU9iamVjdFJlZiwgZm9yY2U6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGlmICghZm9yY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVhcmx5IGV4aXQgb24gbm8gY2hhbmdlXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLnN0YXRlLnNlbGVjdGlvbi5pdGVtSWQgPT09IGl0ZW0uaXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5zZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3Rpb24gPSBpdGVtO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guc2VsZWN0aW9uQ2hhbmdlZC5kaXNwYXRjaChpdGVtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0RWRpdGluZ0l0ZW0oaXRlbTogUG9zaXRpb25lZE9iamVjdFJlZiwgZm9yY2U/OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICghZm9yY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVhcmx5IGV4aXQgb24gbm8gY2hhbmdlXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0uaXRlbUlkID09PSBpdGVtLml0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0pIHtcclxuICAgICAgICAgICAgICAgIC8vIHNpZ25hbCBjbG9zaW5nIGVkaXRvciBmb3IgaXRlbVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtLml0ZW1UeXBlID09PSBcIlRleHRCbG9ja1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEVkaXRpbmdCbG9jayA9IHRoaXMuZ2V0QmxvY2sodGhpcy5zdGF0ZS5lZGl0aW5nSXRlbS5pdGVtSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RWRpdGluZ0Jsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5lZGl0b3JDbG9zZWQuZGlzcGF0Y2goY3VycmVudEVkaXRpbmdCbG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZWRpdGluZyBpdGVtIHNob3VsZCBiZSBzZWxlY3RlZCBpdGVtXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWQuZGlzcGF0Y2goaXRlbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGdldEJsb2NrKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLCB0YiA9PiB0Yi5faWQgPT09IGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBXb3Jrc3BhY2VDb250cm9sbGVyIHtcclxuXHJcbiAgICAgICAgc3RhdGljIFRFWFRfQ0hBTkdFX1JFTkRFUl9USFJPVFRMRV9NUyA9IDUwMDtcclxuICAgICAgICBzdGF0aWMgQkxPQ0tfQk9VTkRTX0NIQU5HRV9USFJPVFRMRV9NUyA9IDUwMDtcclxuXHJcbiAgICAgICAgZGVmYXVsdFNpemUgPSBuZXcgcGFwZXIuU2l6ZSg1MDAwMCwgNDAwMDApO1xyXG4gICAgICAgIGRlZmF1bHRTY2FsZSA9IDAuMDI7XHJcblxyXG4gICAgICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAgICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuICAgICAgICBmYWxsYmFja0ZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICAgICAgdmlld1pvb206IHBhcGVyRXh0LlZpZXdab29tO1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuICAgICAgICBwcml2YXRlIF9za2V0Y2g6IFNrZXRjaDtcclxuICAgICAgICBwcml2YXRlIF90ZXh0QmxvY2tJdGVtczogeyBbdGV4dEJsb2NrSWQ6IHN0cmluZ106IFRleHRXYXJwIH0gPSB7fTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlLCBmYWxsYmFja0ZvbnQ6IG9wZW50eXBlLkZvbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4gICAgICAgICAgICB0aGlzLmZhbGxiYWNrRm9udCA9IGZhbGxiYWNrRm9udDtcclxuICAgICAgICAgICAgcGFwZXIuc2V0dGluZ3MuaGFuZGxlU2l6ZSA9IDE7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkNhbnZhcycpO1xyXG4gICAgICAgICAgICBwYXBlci5zZXR1cCh0aGlzLmNhbnZhcyk7XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdCA9IHBhcGVyLnByb2plY3Q7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vbnJlc2l6ZSA9ICgpID0+IHRoaXMucHJvamVjdC52aWV3LmRyYXcoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhc1NlbCA9ICQodGhpcy5jYW52YXMpO1xyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMubWVyZ2VUeXBlZChcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5hdHRyQ2hhbmdlZFxyXG4gICAgICAgICAgICApLnN1YnNjcmliZShldiA9PlxyXG4gICAgICAgICAgICAgICAgY2FudmFzU2VsLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgZXYuZGF0YS5iYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy52aWV3Wm9vbSA9IG5ldyBwYXBlckV4dC5WaWV3Wm9vbSh0aGlzLnByb2plY3QpO1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdab29tLnNldFpvb21SYW5nZShbXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTaXplLm11bHRpcGx5KHRoaXMuZGVmYXVsdFNjYWxlICogMC4xKSxcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFNpemUubXVsdGlwbHkoMC41KV0pO1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdab29tLnZpZXdDaGFuZ2VkLnN1YnNjcmliZShib3VuZHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5lZGl0b3Iudmlld0NoYW5nZWQuZGlzcGF0Y2goYm91bmRzKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjbGVhclNlbGVjdGlvbiA9IChldjogcGFwZXIuUGFwZXJNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RvcmUuc3RhdGUuc2VsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBhcGVyLnZpZXcub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvamVjdC5oaXRUZXN0KGV2LnBvaW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKGV2KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHBhcGVyLnZpZXcub24ocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ1N0YXJ0LCBjbGVhclNlbGVjdGlvbik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBrZXlIYW5kbGVyID0gbmV3IERvY3VtZW50S2V5SGFuZGxlcihzdG9yZSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBEZXNpZ25lciAtLS0tLVxyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci53b3Jrc3BhY2VJbml0aWFsaXplZC5zdWIoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LnZpZXcuZHJhdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5lZGl0b3Iuem9vbVRvRml0UmVxdWVzdGVkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnpvb21Ub0ZpdCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5lZGl0b3IuZXhwb3J0U1ZHUmVxdWVzdGVkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvd25sb2FkU1ZHKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5leHBvcnRQTkdSZXF1ZXN0ZWQuc3ViKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZG93bmxvYWRQTkcoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLnNuYXBzaG90RXhwaXJlZC5zdWIoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0U25hcHNob3RQTkcoNzIpO1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5lZGl0b3IudXBkYXRlU25hcHNob3QuZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHNrZXRjaElkOiB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaC5faWQsIHBuZ0RhdGFVcmw6IGRhdGFcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tIFNrZXRjaCAtLS0tLVxyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5sb2FkZWQuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NrZXRjaCA9IGV2LmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGV4dEJsb2NrSXRlbXMgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guc2VsZWN0aW9uQ2hhbmdlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuZGVzZWxlY3RBbGwoKTtcclxuICAgICAgICAgICAgICAgIGlmIChtLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSBtLmRhdGEuaXRlbUlkICYmIHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5pdGVtSWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jayAmJiAhYmxvY2suc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2suc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBUZXh0QmxvY2sgLS0tLS1cclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5tZXJnZVR5cGVkKFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5hZGRlZCxcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2subG9hZGVkXHJcbiAgICAgICAgICAgICkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgZXYgPT4gdGhpcy5hZGRCbG9jayhldi5kYXRhKSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmF0dHJDaGFuZ2VkXHJcbiAgICAgICAgICAgICAgICAub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgICAgICAudGhyb3R0bGUoV29ya3NwYWNlQ29udHJvbGxlci5URVhUX0NIQU5HRV9SRU5ERVJfVEhST1RUTEVfTVMpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dEJsb2NrID0gbS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnRleHQgPSB0ZXh0QmxvY2sudGV4dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jdXN0b21TdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogdGV4dEJsb2NrLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmZvbnRSZWFkeS5zdWIoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbZGF0YS50ZXh0QmxvY2tJZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZm9udCA9IGRhdGEuZm9udDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmVkaXRvckNsb3NlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB6b29tVG9GaXQoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0Vmlld2FibGVCb3VuZHMoKTtcclxuICAgICAgICAgICAgdGhpcy52aWV3Wm9vbS56b29tVG8oYm91bmRzLnNjYWxlKDEuMikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBnZXRWaWV3YWJsZUJvdW5kcygpOiBwYXBlci5SZWN0YW5nbGUge1xyXG4gICAgICAgICAgICBsZXQgYm91bmRzOiBwYXBlci5SZWN0YW5nbGU7XHJcbiAgICAgICAgICAgIF8uZm9yT3duKHRoaXMuX3RleHRCbG9ja0l0ZW1zLCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYm91bmRzID0gYm91bmRzXHJcbiAgICAgICAgICAgICAgICAgICAgPyBib3VuZHMudW5pdGUoaXRlbS5ib3VuZHMpXHJcbiAgICAgICAgICAgICAgICAgICAgOiBpdGVtLmJvdW5kcztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmICghYm91bmRzKSB7XHJcbiAgICAgICAgICAgICAgICBib3VuZHMgPSBuZXcgcGFwZXIuUmVjdGFuZ2xlKG5ldyBwYXBlci5Qb2ludCgwLCAwKSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTaXplLm11bHRpcGx5KHRoaXMuZGVmYXVsdFNjYWxlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEByZXR1cm5zIGRhdGEgVVJMXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBnZXRTbmFwc2hvdFBORyhkcGk6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSB0aGlzLmluc2VydEJhY2tncm91bmQoKTtcclxuICAgICAgICAgICAgY29uc3QgcmFzdGVyID0gdGhpcy5wcm9qZWN0LmFjdGl2ZUxheWVyLnJhc3Rlcml6ZShkcGksIGZhbHNlKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHJhc3Rlci50b0RhdGFVUkwoKTtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRvd25sb2FkUE5HKCkge1xyXG4gICAgICAgICAgICAvLyBIYWxmIG9mIG1heCBEUEkgcHJvZHVjZXMgYXBwcm94IDQyMDB4NDIwMC5cclxuICAgICAgICAgICAgY29uc3QgZHBpID0gMC41ICogUGFwZXJIZWxwZXJzLmdldE1heEV4cG9ydERwaSh0aGlzLnByb2plY3QuYWN0aXZlTGF5ZXIuYm91bmRzLnNpemUpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRTbmFwc2hvdFBORyhkcGkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBTa2V0Y2hIZWxwZXJzLmdldFNrZXRjaEZpbGVOYW1lKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gsIDQwLCBcInBuZ1wiKTtcclxuICAgICAgICAgICAgY29uc3QgYmxvYiA9IERvbUhlbHBlcnMuZGF0YVVSTFRvQmxvYihkYXRhKTtcclxuICAgICAgICAgICAgc2F2ZUFzKGJsb2IsIGZpbGVOYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZG93bmxvYWRTVkcoKSB7XHJcbiAgICAgICAgICAgIGxldCBiYWNrZ3JvdW5kOiBwYXBlci5JdGVtO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2guYmFja2dyb3VuZENvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kID0gdGhpcy5pbnNlcnRCYWNrZ3JvdW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRhVXJsID0gXCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCxcIiArIGVuY29kZVVSSUNvbXBvbmVudChcclxuICAgICAgICAgICAgICAgIDxzdHJpbmc+dGhpcy5wcm9qZWN0LmV4cG9ydFNWRyh7IGFzU3RyaW5nOiB0cnVlIH0pKTtcclxuICAgICAgICAgICAgY29uc3QgYmxvYiA9IERvbUhlbHBlcnMuZGF0YVVSTFRvQmxvYihkYXRhVXJsKTtcclxuICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBTa2V0Y2hIZWxwZXJzLmdldFNrZXRjaEZpbGVOYW1lKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gsIDQwLCBcInN2Z1wiKTtcclxuICAgICAgICAgICAgc2F2ZUFzKGJsb2IsIGZpbGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChiYWNrZ3JvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbnNlcnQgc2tldGNoIGJhY2tncm91bmQgdG8gcHJvdmlkZSBiYWNrZ3JvdW5kIGZpbGwgKGlmIG5lY2Vzc2FyeSlcclxuICAgICAgICAgKiAgIGFuZCBhZGQgbWFyZ2luIGFyb3VuZCBlZGdlcy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIGluc2VydEJhY2tncm91bmQoKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0Vmlld2FibGVCb3VuZHMoKTtcclxuICAgICAgICAgICAgY29uc3QgbWFyZ2luID0gTWF0aC5tYXgoYm91bmRzLndpZHRoLCBib3VuZHMuaGVpZ2h0KSAqIDAuMDI7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSBwYXBlci5TaGFwZS5SZWN0YW5nbGUoXHJcbiAgICAgICAgICAgICAgICBib3VuZHMudG9wTGVmdC5zdWJ0cmFjdChtYXJnaW4pLFxyXG4gICAgICAgICAgICAgICAgYm91bmRzLmJvdHRvbVJpZ2h0LmFkZChtYXJnaW4pKTtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC5maWxsQ29sb3IgPSB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaC5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQuc2VuZFRvQmFjaygpO1xyXG4gICAgICAgICAgICByZXR1cm4gYmFja2dyb3VuZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYWRkQmxvY2sodGV4dEJsb2NrOiBUZXh0QmxvY2spIHtcclxuICAgICAgICAgICAgaWYgKCF0ZXh0QmxvY2spIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF0ZXh0QmxvY2suX2lkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdyZWNlaXZlZCBibG9jayB3aXRob3V0IGlkJywgdGV4dEJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1t0ZXh0QmxvY2suX2lkXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJSZWNlaXZlZCBhZGRCbG9jayBmb3IgYmxvY2sgdGhhdCBpcyBhbHJlYWR5IGxvYWRlZFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGJvdW5kczogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH07XHJcblxyXG4gICAgICAgICAgICBpZiAodGV4dEJsb2NrLm91dGxpbmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRTZWdtZW50ID0gKHJlY29yZDogU2VnbWVudFJlY29yZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gcmVjb3JkWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwb2ludCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuU2VnbWVudChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkWzFdICYmIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMV0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkWzJdICYmIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMl0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luZ2xlLXBvaW50IHNlZ21lbnRzIGFyZSBzdG9yZWQgYXMgbnVtYmVyWzJdXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KG5ldyBwYXBlci5Qb2ludChyZWNvcmQpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBib3VuZHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBwZXI6IHRleHRCbG9jay5vdXRsaW5lLnRvcC5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvd2VyOiB0ZXh0QmxvY2sub3V0bGluZS5ib3R0b20uc2VnbWVudHMubWFwKGxvYWRTZWdtZW50KVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXRlbSA9IG5ldyBUZXh0V2FycChcclxuICAgICAgICAgICAgICAgIHRoaXMuZmFsbGJhY2tGb250LFxyXG4gICAgICAgICAgICAgICAgdGV4dEJsb2NrLnRleHQsXHJcbiAgICAgICAgICAgICAgICBib3VuZHMsXHJcbiAgICAgICAgICAgICAgICBudWxsLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yIHx8IFwicmVkXCIsICAgIC8vIHRleHRDb2xvciBzaG91bGQgaGF2ZSBiZWVuIHNldCBlbHNld2hlcmUgXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHBhcGVyRXh0LmV4dGVuZE1vdXNlRXZlbnRzKGl0ZW0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0ZXh0QmxvY2sub3V0bGluZSAmJiB0ZXh0QmxvY2sucG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSBuZXcgcGFwZXIuUG9pbnQodGV4dEJsb2NrLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXRlbS5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VsZWN0IG5leHQgaXRlbSBiZWhpbmRcclxuICAgICAgICAgICAgICAgICAgICBsZXQgb3RoZXJIaXRzID0gKDxUZXh0V2FycFtdPl8udmFsdWVzKHRoaXMuX3RleHRCbG9ja0l0ZW1zKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihpID0+IGkuaWQgIT09IGl0ZW0uaWQgJiYgISFpLmhpdFRlc3QoZXYucG9pbnQpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvdGhlckl0ZW0gPSBfLnNvcnRCeShvdGhlckhpdHMsIGkgPT4gaS5pbmRleClbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVySXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlckl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG90aGVySWQgPSBfLmZpbmRLZXkodGhpcy5fdGV4dEJsb2NrSXRlbXMsIGkgPT4gaSA9PT0gb3RoZXJJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVySWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaXRlbUlkOiBvdGhlcklkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIiB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5icmluZ1RvRnJvbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGl0ZW1JZDogdGV4dEJsb2NrLl9pZCwgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0ZW0ub24ocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ1N0YXJ0LCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0ZW0ub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlRHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS50cmFuc2xhdGUoZXYuZGVsdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0ZW0ub24ocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ0VuZCwgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gPFRleHRCbG9jaz50aGlzLmdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICBibG9jay5faWQgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBcnJhbmdlLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgIGlmICghaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGl0ZW1JZDogdGV4dEJsb2NrLl9pZCwgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaXRlbUNoYW5nZSQgPSBQYXBlck5vdGlmeS5vYnNlcnZlKGl0ZW0sIFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpO1xyXG4gICAgICAgICAgICBpdGVtQ2hhbmdlJFxyXG4gICAgICAgICAgICAgICAgLmRlYm91bmNlKFdvcmtzcGFjZUNvbnRyb2xsZXIuQkxPQ0tfQk9VTkRTX0NIQU5HRV9USFJPVFRMRV9NUylcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+dGhpcy5nZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBcnJhbmdlLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXRlbS5kYXRhID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgaWYgKCF0ZXh0QmxvY2sucG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSB0aGlzLnByb2plY3Qudmlldy5ib3VuZHMucG9pbnQuYWRkKFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChpdGVtLmJvdW5kcy53aWR0aCAvIDIsIGl0ZW0uYm91bmRzLmhlaWdodCAvIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoNTApKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtc1t0ZXh0QmxvY2suX2lkXSA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbTogVGV4dFdhcnApOiBCbG9ja0FycmFuZ2VtZW50IHtcclxuICAgICAgICAgICAgLy8gZXhwb3J0IHJldHVybnMgYW4gYXJyYXkgd2l0aCBpdGVtIHR5cGUgYW5kIHNlcmlhbGl6ZWQgb2JqZWN0OlxyXG4gICAgICAgICAgICAvLyAgIFtcIlBhdGhcIiwgUGF0aFJlY29yZF1cclxuICAgICAgICAgICAgY29uc3QgdG9wID0gPFBhdGhSZWNvcmQ+aXRlbS51cHBlci5leHBvcnRKU09OKHsgYXNTdHJpbmc6IGZhbHNlIH0pWzFdO1xyXG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSA8UGF0aFJlY29yZD5pdGVtLmxvd2VyLmV4cG9ydEpTT04oeyBhc1N0cmluZzogZmFsc2UgfSlbMV07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IFtpdGVtLnBvc2l0aW9uLngsIGl0ZW0ucG9zaXRpb24ueV0sXHJcbiAgICAgICAgICAgICAgICBvdXRsaW5lOiB7IHRvcCwgYm90dG9tIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQWN0aW9ucyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcclxuXHJcbiAgICAgICAgZWRpdG9yID0ge1xyXG4gICAgICAgICAgICBpbml0V29ya3NwYWNlOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuaW5pdFdvcmtzcGFjZVwiKSxcclxuICAgICAgICAgICAgbG9hZEZvbnQ6IHRoaXMudG9waWM8c3RyaW5nPihcImRlc2lnbmVyLmxvYWRGb250XCIpLFxyXG4gICAgICAgICAgICB6b29tVG9GaXQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci56b29tVG9GaXRcIiksXHJcbiAgICAgICAgICAgIGV4cG9ydGluZ0ltYWdlOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0SW1hZ2VcIiksXHJcbiAgICAgICAgICAgIGV4cG9ydFBORzogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydFBOR1wiKSxcclxuICAgICAgICAgICAgZXhwb3J0U1ZHOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0U1ZHXCIpLFxyXG4gICAgICAgICAgICB2aWV3Q2hhbmdlZDogdGhpcy50b3BpYzxwYXBlci5SZWN0YW5nbGU+KFwiZGVzaWduZXIudmlld0NoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIHVwZGF0ZVNuYXBzaG90OiB0aGlzLnRvcGljPHsgc2tldGNoSWQ6IHN0cmluZywgcG5nRGF0YVVybDogc3RyaW5nIH0+KFwiZGVzaWduZXIudXBkYXRlU25hcHNob3RcIiksXHJcbiAgICAgICAgICAgIHRvZ2dsZUhlbHA6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci50b2dnbGVIZWxwXCIpLFxyXG4gICAgICAgICAgICBvcGVuU2FtcGxlOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIub3BlblNhbXBsZVwiKSxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNrZXRjaCA9IHtcclxuICAgICAgICAgICAgY3JlYXRlOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmNyZWF0ZVwiKSxcclxuICAgICAgICAgICAgY2xlYXI6IHRoaXMudG9waWM8dm9pZD4oXCJza2V0Y2guY2xlYXJcIiksXHJcbiAgICAgICAgICAgIGNsb25lOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmNsb25lXCIpLFxyXG4gICAgICAgICAgICBvcGVuOiB0aGlzLnRvcGljPHN0cmluZz4oXCJza2V0Y2gub3BlblwiKSxcclxuICAgICAgICAgICAgYXR0clVwZGF0ZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5hdHRyVXBkYXRlXCIpLFxyXG4gICAgICAgICAgICBzZXRTZWxlY3Rpb246IHRoaXMudG9waWM8V29ya3NwYWNlT2JqZWN0UmVmPihcInNrZXRjaC5zZXRTZWxlY3Rpb25cIiksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGV4dEJsb2NrID0ge1xyXG4gICAgICAgICAgICBhZGQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRCbG9jay5hZGRcIiksXHJcbiAgICAgICAgICAgIHVwZGF0ZUF0dHI6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRCbG9jay51cGRhdGVBdHRyXCIpLFxyXG4gICAgICAgICAgICB1cGRhdGVBcnJhbmdlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0QmxvY2sudXBkYXRlQXJyYW5nZVwiKSxcclxuICAgICAgICAgICAgcmVtb3ZlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0QmxvY2sucmVtb3ZlXCIpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50cyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcclxuXHJcbiAgICAgICAgZWRpdG9yID0ge1xyXG4gICAgICAgICAgICByZXNvdXJjZXNSZWFkeTogdGhpcy50b3BpYzxib29sZWFuPihcImFwcC5yZXNvdXJjZXNSZWFkeVwiKSxcclxuICAgICAgICAgICAgd29ya3NwYWNlSW5pdGlhbGl6ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJhcHAud29ya3NwYWNlSW5pdGlhbGl6ZWRcIiksXHJcbiAgICAgICAgICAgIGZvbnRMb2FkZWQ6IHRoaXMudG9waWM8b3BlbnR5cGUuRm9udD4oXCJhcHAuZm9udExvYWRlZFwiKSxcclxuICAgICAgICAgICAgem9vbVRvRml0UmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkXCIpLFxyXG4gICAgICAgICAgICBleHBvcnRQTkdSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRQTkdSZXF1ZXN0ZWRcIiksXHJcbiAgICAgICAgICAgIGV4cG9ydFNWR1JlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydFNWR1JlcXVlc3RlZFwiKSxcclxuICAgICAgICAgICAgdmlld0NoYW5nZWQ6IHRoaXMudG9waWM8cGFwZXIuUmVjdGFuZ2xlPihcImRlc2lnbmVyLnZpZXdDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBzbmFwc2hvdEV4cGlyZWQ6IHRoaXMudG9waWM8U2tldGNoPihcImRlc2lnbmVyLnNuYXBzaG90RXhwaXJlZFwiKSxcclxuICAgICAgICAgICAgdXNlck1lc3NhZ2VDaGFuZ2VkOiB0aGlzLnRvcGljPHN0cmluZz4oXCJkZXNpZ25lci51c2VyTWVzc2FnZUNoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIHNob3dIZWxwQ2hhbmdlZDogdGhpcy50b3BpYzxib29sZWFuPihcImRlc2lnbmVyLnNob3dIZWxwQ2hhbmdlZFwiKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNrZXRjaCA9IHtcclxuICAgICAgICAgICAgbG9hZGVkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2gubG9hZGVkXCIpLFxyXG4gICAgICAgICAgICBhdHRyQ2hhbmdlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmF0dHJDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBjb250ZW50Q2hhbmdlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmNvbnRlbnRDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBlZGl0aW5nSXRlbUNoYW5nZWQ6IHRoaXMudG9waWM8UG9zaXRpb25lZE9iamVjdFJlZj4oXCJza2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkOiB0aGlzLnRvcGljPFdvcmtzcGFjZU9iamVjdFJlZj4oXCJza2V0Y2guc2VsZWN0aW9uQ2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgc2F2ZUxvY2FsUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwic2tldGNoLnNhdmVsb2NhbC5zYXZlTG9jYWxSZXF1ZXN0ZWRcIiksXHJcbiAgICAgICAgICAgIGNsb25lZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmNsb25lZFwiKSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0ZXh0YmxvY2sgPSB7XHJcbiAgICAgICAgICAgIGFkZGVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYWRkZWRcIiksXHJcbiAgICAgICAgICAgIGF0dHJDaGFuZ2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYXR0ckNoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIGZvbnRSZWFkeTogdGhpcy50b3BpYzx7IHRleHRCbG9ja0lkOiBzdHJpbmcsIGZvbnQ6IG9wZW50eXBlLkZvbnQgfT4oXCJ0ZXh0YmxvY2suZm9udFJlYWR5XCIpLFxyXG4gICAgICAgICAgICBhcnJhbmdlQ2hhbmdlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFycmFuZ2VDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICByZW1vdmVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sucmVtb3ZlZFwiKSxcclxuICAgICAgICAgICAgbG9hZGVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2subG9hZGVkXCIpLFxyXG4gICAgICAgICAgICBlZGl0b3JDbG9zZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5lZGl0b3JDbG9zZWRcIiksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIENoYW5uZWxzIHtcclxuICAgICAgICBhY3Rpb25zOiBBY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgICAgICBldmVudHM6IEV2ZW50cyA9IG5ldyBFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICB0eXBlIEFjdGlvblR5cGVzID1cclxuICAgICAgICBcInNrZXRjaC5jcmVhdGVcIlxyXG4gICAgICAgIHwgXCJza2V0Y2gudXBkYXRlXCJcclxuICAgICAgICB8IFwidGV4dGJsb2NrLmFkZFwiXHJcbiAgICAgICAgfCBcInRleHRibG9jay51cGRhdGVcIjtcclxuXHJcbiAgICB0eXBlIEV2ZW50VHlwZXMgPVxyXG4gICAgICAgIFwic2tldGNoLmxvYWRlZFwiXHJcbiAgICAgICAgfCBcInNrZXRjaC5jaGFuZ2VkXCJcclxuICAgICAgICB8IFwidGV4dGJsb2NrLmFkZGVkXCJcclxuICAgICAgICB8IFwidGV4dGJsb2NrLmNoYW5nZWRcIjtcclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEVkaXRvclN0YXRlIHtcclxuICAgICAgICBicm93c2VySWQ/OiBzdHJpbmc7XHJcbiAgICAgICAgZWRpdGluZ0l0ZW0/OiBQb3NpdGlvbmVkT2JqZWN0UmVmO1xyXG4gICAgICAgIHNlbGVjdGlvbj86IFdvcmtzcGFjZU9iamVjdFJlZjtcclxuICAgICAgICBsb2FkaW5nU2tldGNoPzogYm9vbGVhbjtcclxuICAgICAgICB1c2VyTWVzc2FnZT86IHN0cmluZztcclxuICAgICAgICBza2V0Y2g/OiBTa2V0Y2g7XHJcbiAgICAgICAgc2hvd0hlbHA/OiBib29sZWFuO1xyXG4gICAgICAgIHNrZXRjaElzRGlydHk/OiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU3RvcmVSZXNvdXJjZXMge1xyXG4gICAgICAgIGZhbGxiYWNrRm9udD86IG9wZW50eXBlLkZvbnRcclxuICAgICAgICBmb250Q2F0YWxvZz86IEZvbnRTaGFwZS5Gb250Q2F0YWxvZ1xyXG4gICAgICAgIHBhcnNlZEZvbnRzPzogRm9udFNoYXBlLlBhcnNlZEZvbnRzXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBTa2V0Y2ggZXh0ZW5kcyBTa2V0Y2hBdHRyIHtcclxuICAgICAgICBfaWQ6IHN0cmluZztcclxuICAgICAgICBicm93c2VySWQ/OiBzdHJpbmc7XHJcbiAgICAgICAgc2F2ZWRBdD86IERhdGU7XHJcbiAgICAgICAgdGV4dEJsb2Nrcz86IFRleHRCbG9ja1tdO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2tldGNoQXR0ciB7XHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgICAgIGRlZmF1bHRUZXh0QmxvY2tBdHRyPzogVGV4dEJsb2NrO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRm9udERlc2NyaXB0aW9uIHtcclxuICAgICAgICBmYW1pbHk6IHN0cmluZztcclxuICAgICAgICBjYXRlZ29yeTogc3RyaW5nO1xyXG4gICAgICAgIHZhcmlhbnQ6IHN0cmluZztcclxuICAgICAgICB1cmw6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFdvcmtzcGFjZU9iamVjdFJlZiB7XHJcbiAgICAgICAgaXRlbUlkOiBzdHJpbmc7XHJcbiAgICAgICAgaXRlbVR5cGU/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQb3NpdGlvbmVkT2JqZWN0UmVmIGV4dGVuZHMgV29ya3NwYWNlT2JqZWN0UmVmIHtcclxuICAgICAgICBjbGllbnRYPzogbnVtYmVyO1xyXG4gICAgICAgIGNsaWVudFk/OiBudW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZXh0QmxvY2sgZXh0ZW5kcyBCbG9ja0FycmFuZ2VtZW50IHtcclxuICAgICAgICBfaWQ/OiBzdHJpbmc7XHJcbiAgICAgICAgdGV4dD86IHN0cmluZztcclxuICAgICAgICB0ZXh0Q29sb3I/OiBzdHJpbmc7XHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgICAgIGZvbnRGYW1pbHk/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFZhcmlhbnQ/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCbG9ja0FycmFuZ2VtZW50IHtcclxuICAgICAgICBwb3NpdGlvbj86IG51bWJlcltdLFxyXG4gICAgICAgIG91dGxpbmU/OiB7XHJcbiAgICAgICAgICAgIHRvcDogUGF0aFJlY29yZCxcclxuICAgICAgICAgICAgYm90dG9tOiBQYXRoUmVjb3JkXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFja2dyb3VuZEFjdGlvblN0YXR1cyB7XHJcbiAgICAgICAgYWN0aW9uPzogT2JqZWN0O1xyXG4gICAgICAgIHJlamVjdGVkPzogYm9vbGVhbjtcclxuICAgICAgICBlcnJvcj86IGJvb2xlYW5cclxuICAgICAgICBtZXNzYWdlPzogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUGF0aFJlY29yZCB7XHJcbiAgICAgICAgc2VnbWVudHM6IFNlZ21lbnRSZWNvcmRbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgdHlwZSBTZWdtZW50UmVjb3JkID0gQXJyYXk8UG9pbnRSZWNvcmQ+IHwgQXJyYXk8bnVtYmVyPjtcclxuXHJcbiAgICBleHBvcnQgdHlwZSBQb2ludFJlY29yZCA9IEFycmF5PG51bWJlcj47XHJcblxyXG59IiwiICAgIFxyXG5uYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldEZvbnREZXNjcmlwdGlvbihmYW1pbHk6IEZvbnRTaGFwZS5GYW1pbHlSZWNvcmQsIHZhcmlhbnQ/OiBzdHJpbmcpXHJcbiAgICAgICAgOiBGb250RGVzY3JpcHRpb24ge1xyXG4gICAgICAgIGxldCB1cmw6IHN0cmluZztcclxuICAgICAgICB1cmwgPSBmYW1pbHkuZmlsZXNbdmFyaWFudCB8fCBcInJlZ3VsYXJcIl07XHJcbiAgICAgICAgaWYoIXVybCl7XHJcbiAgICAgICAgICAgIHVybCA9IGZhbWlseS5maWxlc1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZmFtaWx5OiBmYW1pbHkuZmFtaWx5LFxyXG4gICAgICAgICAgICBjYXRlZ29yeTogZmFtaWx5LmNhdGVnb3J5LFxyXG4gICAgICAgICAgICB2YXJpYW50OiB2YXJpYW50LFxyXG4gICAgICAgICAgICB1cmxcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTM0FjY2VzcyB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVwbG9hZCBmaWxlIHRvIGFwcGxpY2F0aW9uIFMzIGJ1Y2tldC5cclxuICAgICAgICAgKiBSZXR1cm5zIHVwbG9hZCBVUkwgYXMgYSBwcm9taXNlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBwdXRGaWxlKGZpbGVOYW1lOiBzdHJpbmcsIGZpbGVUeXBlOiBzdHJpbmcsIGRhdGE6IEJsb2IgfCBzdHJpbmcpXHJcbiAgICAgICAgICAgIDogSlF1ZXJ5UHJvbWlzZTxzdHJpbmc+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLXNkay1qcy9pc3N1ZXMvMTkwICAgXHJcbiAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9GaXJlZm94LykgJiYgIWZpbGVUeXBlLm1hdGNoKC87LykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGFyc2V0ID0gJzsgY2hhcnNldD1VVEYtOCc7XHJcbiAgICAgICAgICAgICAgICBmaWxlVHlwZSArPSBjaGFyc2V0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzaWduVXJsID0gYC9hcGkvc3RvcmFnZS9hY2Nlc3M/ZmlsZU5hbWU9JHtmaWxlTmFtZX0mZmlsZVR5cGU9JHtmaWxlVHlwZX1gO1xyXG4gICAgICAgICAgICAvLyBnZXQgc2lnbmVkIFVSTFxyXG4gICAgICAgICAgICByZXR1cm4gJC5nZXRKU09OKHNpZ25VcmwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgIHNpZ25SZXNwb25zZSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFBVVCBmaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHV0UmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogc2lnblJlc3BvbnNlLnNpZ25lZFJlcXVlc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwieC1hbXotYWNsXCI6IFwicHVibGljLXJlYWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmaWxlVHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmFqYXgocHV0UmVxdWVzdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1dFJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBsb2FkZWQgZmlsZVwiLCBzaWduUmVzcG9uc2UudXJsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzaWduUmVzcG9uc2UudXJsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIHVwbG9hZGluZyB0byBTM1wiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciBvbiAvYXBpL3N0b3JhZ2UvYWNjZXNzXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERvd25sb2FkIGZpbGUgZnJvbSBidWNrZXRcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgZ2V0SnNvbihmaWxlTmFtZTogc3RyaW5nKTogSlF1ZXJ5UHJvbWlzZTxPYmplY3Q+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RmlsZVVybChmaWxlTmFtZSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvd25sb2FkaW5nXCIsIHJlc3BvbnNlLnVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogcmVzcG9uc2UudXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgZ2V0RmlsZVVybChmaWxlTmFtZTogc3RyaW5nKTogSlF1ZXJ5UHJvbWlzZTx7IHVybDogc3RyaW5nIH0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IGAvYXBpL3N0b3JhZ2UvdXJsP2ZpbGVOYW1lPSR7ZmlsZU5hbWV9YCxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDb2xvclBpY2tlciB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBERUZBVUxUX1BBTEVUVEVfR1JPVVBTID0gW1xyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS84MDdcclxuICAgICAgICAgICAgICAgIFwiI2VlNDAzNVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZjM3NzM2XCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmZGY0OThcIixcclxuICAgICAgICAgICAgICAgIFwiIzdiYzA0M1wiLFxyXG4gICAgICAgICAgICAgICAgXCIjMDM5MmNmXCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzg5NFxyXG4gICAgICAgICAgICAgICAgXCIjZWRjOTUxXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNlYjY4NDFcIixcclxuICAgICAgICAgICAgICAgIFwiI2NjMmEzNlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjNGYzNzJkXCIsXHJcbiAgICAgICAgICAgICAgICBcIiMwMGEwYjBcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvMTY0XHJcbiAgICAgICAgICAgICAgICBcIiMxYjg1YjhcIixcclxuICAgICAgICAgICAgICAgIFwiIzVhNTI1NVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjNTU5ZTgzXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNhZTVhNDFcIixcclxuICAgICAgICAgICAgICAgIFwiI2MzY2I3MVwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS8zODlcclxuICAgICAgICAgICAgICAgIFwiIzRiMzgzMlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjODU0NDQyXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmZmY0ZTZcIixcclxuICAgICAgICAgICAgICAgIFwiIzNjMmYyZlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjYmU5YjdiXCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzQ1NVxyXG4gICAgICAgICAgICAgICAgXCIjZmY0ZTUwXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmYzkxM2FcIixcclxuICAgICAgICAgICAgICAgIFwiI2Y5ZDYyZVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZWFlMzc0XCIsXHJcbiAgICAgICAgICAgICAgICBcIiNlMmY0YzdcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvNzAwXHJcbiAgICAgICAgICAgICAgICBcIiNkMTExNDFcIixcclxuICAgICAgICAgICAgICAgIFwiIzAwYjE1OVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjMDBhZWRiXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmMzc3MzVcIixcclxuICAgICAgICAgICAgICAgIFwiI2ZmYzQyNVwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS84MjZcclxuICAgICAgICAgICAgICAgIFwiI2U4ZDE3NFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZTM5ZTU0XCIsXHJcbiAgICAgICAgICAgICAgICBcIiNkNjRkNGRcIixcclxuICAgICAgICAgICAgICAgIFwiIzRkNzM1OFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjOWVkNjcwXCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgc3RhdGljIE1PTk9fUEFMRVRURSA9IFtcIiMwMDBcIiwgXCIjNDQ0XCIsIFwiIzY2NlwiLCBcIiM5OTlcIiwgXCIjY2NjXCIsIFwiI2VlZVwiLCBcIiNmM2YzZjNcIiwgXCIjZmZmXCJdO1xyXG5cclxuICAgICAgICBzdGF0aWMgc2V0dXAoZWxlbSwgZmVhdHVyZWRDb2xvcnM6IHN0cmluZ1tdLCBvbkNoYW5nZSkge1xyXG4gICAgICAgICAgICBjb25zdCBmZWF0dXJlZEdyb3VwcyA9IF8uY2h1bmsoZmVhdHVyZWRDb2xvcnMsIDUpO1xyXG5cclxuICAgICAgICAgICAgLy8gZm9yIGVhY2ggcGFsZXR0ZSBncm91cFxyXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0UGFsZXR0ZUdyb3VwcyA9IENvbG9yUGlja2VyLkRFRkFVTFRfUEFMRVRURV9HUk9VUFMubWFwKGdyb3VwID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJzZWRHcm91cCA9IGdyb3VwLm1hcChjID0+IG5ldyBwYXBlci5Db2xvcihjKSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgbGlnaHQgdmFyaWFudHMgb2YgZGFya2VzdCB0aHJlZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWRkQ29sb3JzID0gXy5zb3J0QnkocGFyc2VkR3JvdXAsIGMgPT4gYy5saWdodG5lc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgLnNsaWNlKDAsIDMpXHJcbiAgICAgICAgICAgICAgICAgICAgLm1hcChjID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYzIgPSBjLmNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMyLmxpZ2h0bmVzcyA9IDAuODU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjMjtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHBhcnNlZEdyb3VwID0gcGFyc2VkR3JvdXAuY29uY2F0KGFkZENvbG9ycyk7XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRHcm91cCA9IF8uc29ydEJ5KHBhcnNlZEdyb3VwLCBjID0+IGMubGlnaHRuZXNzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWRHcm91cC5tYXAoYyA9PiBjLnRvQ1NTKHRydWUpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYWxldHRlID0gZmVhdHVyZWRHcm91cHMuY29uY2F0KGRlZmF1bHRQYWxldHRlR3JvdXBzKTtcclxuICAgICAgICAgICAgcGFsZXR0ZS5wdXNoKENvbG9yUGlja2VyLk1PTk9fUEFMRVRURSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2VsID0gPGFueT4kKGVsZW0pO1xyXG4gICAgICAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bSh7XHJcbiAgICAgICAgICAgICAgICBzaG93SW5wdXQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhbGxvd0VtcHR5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcHJlZmVycmVkRm9ybWF0OiBcImhleFwiLFxyXG4gICAgICAgICAgICAgICAgc2hvd0J1dHRvbnM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2hvd0FscGhhOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2hvd1BhbGV0dGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzaG93U2VsZWN0aW9uUGFsZXR0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwYWxldHRlOiBwYWxldHRlLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlS2V5OiBcInNrZXRjaHRleHRcIixcclxuICAgICAgICAgICAgICAgIGNoYW5nZTogb25DaGFuZ2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc3RhdGljIHNldChlbGVtOiBIVE1MRWxlbWVudCwgdmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bShcInNldFwiLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgZGVzdHJveShlbGVtKSB7XHJcbiAgICAgICAgICAgICg8YW55PiQoZWxlbSkpLnNwZWN0cnVtKFwiZGVzdHJveVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEVkaXRvckJhciBleHRlbmRzIENvbXBvbmVudDxFZGl0b3JTdGF0ZT4ge1xyXG5cclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2tldGNoRG9tJCA9IHN0b3JlLmV2ZW50cy5tZXJnZShcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5hdHRyQ2hhbmdlZCxcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5lZGl0b3IudXNlck1lc3NhZ2VDaGFuZ2VkKVxyXG4gICAgICAgICAgICAgICAgLm1hcChtID0+IHRoaXMucmVuZGVyKHN0b3JlLnN0YXRlKSk7XHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShza2V0Y2hEb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbmRlcihzdGF0ZTogRWRpdG9yU3RhdGUpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2tldGNoID0gc3RhdGUuc2tldGNoO1xyXG4gICAgICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsIFtcclxuICAgICAgICAgICAgICAgIGgoXCJsYWJlbFwiLCBcIkFkZCB0ZXh0OiBcIiksXHJcbiAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYWRkLXRleHRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXByZXNzOiAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gZXYudGFyZ2V0ICYmIGV2LnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay5hZGQuZGlzcGF0Y2goeyB0ZXh0OiB0ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldi50YXJnZXQudmFsdWUgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwiUHJlc3MgW0VudGVyXSB0byBhZGRcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJCYWNrZ3JvdW5kOiBcIiksXHJcbiAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHNrZXRjaC5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZub2RlLmVsbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2tldGNoSGVscGVycy5jb2xvcnNJblVzZSh0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZS5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGJhY2tncm91bmRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU6IChvbGRWbm9kZSwgdm5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXQodm5vZGUuZWxtLCBza2V0Y2guYmFja2dyb3VuZENvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICAgICAgQm9vdFNjcmlwdC5kcm9wZG93bih7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IFwic2tldGNoTWVudVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiQWN0aW9uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiTmV3XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiQ3JlYXRlIG5ldyBza2V0Y2hcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guY3JlYXRlLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiQ2xlYXIgYWxsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiQ2xlYXIgc2tldGNoIGNvbnRlbnRzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmNsZWFyLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiWm9vbSB0byBmaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJGaXQgY29udGVudHMgaW4gdmlld1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci56b29tVG9GaXQuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJFeHBvcnQgaW1hZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFeHBvcnQgc2tldGNoIGFzIFBOR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3IuZXhwb3J0UE5HLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRXhwb3J0IFNWR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkV4cG9ydCBza2V0Y2ggYXMgdmVjdG9yIGdyYXBoaWNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLmV4cG9ydFNWRy5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkR1cGxpY2F0ZSBza2V0Y2hcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDb3B5IGNvbnRlbnRzIGludG8gYSBza2V0Y2ggd2l0aCBhIG5ldyBhZGRyZXNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmNsb25lLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiT3BlbiBzYW1wbGUgc2tldGNoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiT3BlbiBhIHNhbXBsZSBza2V0Y2ggdG8gcGxheSB3aXRoXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLm9wZW5TYW1wbGUuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGgoXCJkaXYjcmlnaHRTaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2I3VzZXItbWVzc2FnZVwiLCB7fSwgW3N0YXRlLnVzZXJNZXNzYWdlIHx8IFwiXCJdKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYjc2hvdy1oZWxwLmdseXBoaWNvbi5nbHlwaGljb24tcXVlc3Rpb24tc2lnblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuZGlzcGF0Y2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcblxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImludGVyZmFjZSBKUXVlcnkge1xyXG4gICAgc2VsZWN0cGlja2VyKC4uLmFyZ3M6IGFueVtdKTtcclxuICAgIC8vcmVwbGFjZU9wdGlvbnMob3B0aW9uczogQXJyYXk8e3ZhbHVlOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmd9Pik7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBGb250UGlja2VyIHtcclxuXHJcbiAgICAgICAgZGVmYXVsdEZvbnRGYW1pbHkgPSBcIlJvYm90b1wiO1xyXG4gICAgICAgIHByZXZpZXdGb250U2l6ZSA9IFwiMjhweFwiO1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlLCBibG9jazogVGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgY29uc3QgZG9tJCA9IFJ4Lk9ic2VydmFibGUuanVzdChibG9jaylcclxuICAgICAgICAgICAgICAgIC5tZXJnZShcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihtID0+IG0uZGF0YS5faWQgPT09IGJsb2NrLl9pZClcclxuICAgICAgICAgICAgICAgICAgICAubWFwKG0gPT4gbS5kYXRhKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgLm1hcCh0YiA9PiB0aGlzLnJlbmRlcih0YikpO1xyXG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oZG9tJCwgY29udGFpbmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbmRlcihibG9jazogVGV4dEJsb2NrKTogVk5vZGUge1xyXG4gICAgICAgICAgICBsZXQgdXBkYXRlID0gcGF0Y2ggPT4ge1xyXG4gICAgICAgICAgICAgICAgcGF0Y2guX2lkID0gYmxvY2suX2lkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyLmRpc3BhdGNoKHBhdGNoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudHM6IFZOb2RlW10gPSBbXTtcclxuICAgICAgICAgICAgZWxlbWVudHMucHVzaChcclxuICAgICAgICAgICAgICAgIGgoXCJzZWxlY3RcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJzZWxlY3RQaWNrZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZmFtaWx5LXBpY2tlclwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB2bm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHVwZGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogZXYudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRWYXJpYW50OiBGb250U2hhcGUuRm9udENhdGFsb2cuZGVmYXVsdFZhcmlhbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUucmVzb3VyY2VzLmZvbnRDYXRhbG9nLmdldFJlY29yZChldi50YXJnZXQudmFsdWUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5yZXNvdXJjZXMuZm9udENhdGFsb2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldExpc3QodGhpcy5zdG9yZS5mb250TGlzdExpbWl0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChyZWNvcmQ6IEZvbnRTaGFwZS5GYW1pbHlSZWNvcmQpID0+IGgoXCJvcHRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogcmVjb3JkLmZhbWlseSA9PT0gYmxvY2suZm9udEZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWNvbnRlbnRcIjogYDxzcGFuIHN0eWxlPVwiJHtGb250SGVscGVycy5nZXRTdHlsZVN0cmluZyhyZWNvcmQuZmFtaWx5LCBudWxsLCB0aGlzLnByZXZpZXdGb250U2l6ZSl9XCI+JHtyZWNvcmQuZmFtaWx5fTwvc3Bhbj5gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcmVjb3JkLmZhbWlseV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRGYW1pbHkgPSB0aGlzLnN0b3JlLnJlc291cmNlcy5mb250Q2F0YWxvZy5nZXRSZWNvcmQoYmxvY2suZm9udEZhbWlseSk7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEZhbWlseSAmJiBzZWxlY3RlZEZhbWlseS52YXJpYW50c1xyXG4gICAgICAgICAgICAgICAgJiYgc2VsZWN0ZWRGYW1pbHkudmFyaWFudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChoKFwic2VsZWN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwidmFyaWFudFBpY2tlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYW50LXBpY2tlclwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB2bm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0cGF0Y2g6IChvbGRWbm9kZSwgdm5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUTogd2h5IGNhbid0IHdlIGp1c3QgZG8gc2VsZWN0cGlja2VyKHJlZnJlc2gpIGhlcmU/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEE6IHNlbGVjdHBpY2tlciBoYXMgbWVudGFsIHByb2JsZW1zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoXCJkZXN0cm95XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoeyBmb250VmFyaWFudDogZXYudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmFtaWx5LnZhcmlhbnRzLm1hcCh2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJvcHRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogdiA9PT0gYmxvY2suZm9udFZhcmlhbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGFpbmVyXCI6IFwiYm9keVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGVudFwiOiBgPHNwYW4gc3R5bGU9XCIke0ZvbnRIZWxwZXJzLmdldFN0eWxlU3RyaW5nKHNlbGVjdGVkRmFtaWx5LmZhbWlseSwgdiwgdGhpcy5wcmV2aWV3Rm9udFNpemUpfVwiPiR7dn08L3NwYW4+YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdl0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHsgXCJmb250LXBpY2tlclwiOiB0cnVlIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50c1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEhlbHBEaWFsb2cge1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgY29uc3Qgb3V0ZXIgPSAkKGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIG91dGVyLmFwcGVuZChcIjxoMz5HZXR0aW5nIHN0YXJ0ZWQ8L2gzPlwiKTtcclxuICAgICAgICAgICAgc3RvcmUuc3RhdGUuc2hvd0hlbHAgPyBvdXRlci5zaG93KCkgOiBvdXRlci5oaWRlKCk7XHJcbiAgICAgICAgICAgICQuZ2V0KFwiY29udGVudC9oZWxwLmh0bWxcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9zZSA9ICQoXCI8YnV0dG9uIGNsYXNzPSdidG4gYnRuLWRlZmF1bHQnPiBDbG9zZSA8L2J1dHRvbj5cIik7XHJcbiAgICAgICAgICAgICAgICBjbG9zZS5vbihcImNsaWNrXCIsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuZGlzcGF0Y2goKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgb3V0ZXIuYXBwZW5kKCQoZCkpXHJcbiAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoY2xvc2UpXHJcbiAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXCI8YSBjbGFzcz0ncmlnaHQnIGhyZWY9J21haWx0bzpmaWRkbGVzdGlja3NAY29kZWZsaWdodC5pbyc+RW1haWwgdXM8L2E+XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5zaG93SGVscENoYW5nZWQuc3ViKHNob3cgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2hvdyA/IG91dGVyLnNob3coKSA6IG91dGVyLmhpZGUoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTZWxlY3RlZEl0ZW1FZGl0b3Ige1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRvbSQgPSBzdG9yZS5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5vYnNlcnZlKClcclxuICAgICAgICAgICAgICAgIC5tYXAoaSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc0l0ZW0gPSA8UG9zaXRpb25lZE9iamVjdFJlZj5pLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gcG9zSXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBwb3NJdGVtLml0ZW1UeXBlID09PSAnVGV4dEJsb2NrJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBfLmZpbmQoc3RvcmUuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiID0+IGIuX2lkID09PSBwb3NJdGVtLml0ZW1JZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0OiBwb3NJdGVtLmNsaWVudFggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9wOiBwb3NJdGVtLmNsaWVudFkgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFRleHRCbG9ja0VkaXRvcihzdG9yZSkucmVuZGVyKGJsb2NrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRCbG9ja0VkaXRvciBleHRlbmRzIENvbXBvbmVudDxUZXh0QmxvY2s+IHtcclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW5kZXIodGV4dEJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIGxldCB1cGRhdGUgPSB0YiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0Yi5faWQgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyLmRpc3BhdGNoKHRiKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2LnRleHQtYmxvY2stZWRpdG9yXCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiB0ZXh0QmxvY2suX2lkXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJ0ZXh0YXJlYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2OiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoeyB0ZXh0OiAoPEhUTUxUZXh0QXJlYUVsZW1lbnQ+ZXYudGFyZ2V0KS52YWx1ZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoeyB0ZXh0OiBldi50YXJnZXQudmFsdWUgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1jb2xvci1pY29uLmZvcmVcIiwge30sIFwiQVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC50ZXh0LWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlRleHQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2sudGV4dENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB1cGRhdGUoeyB0ZXh0Q29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5iYWNrXCIsIHt9LCBcIkFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCYWNrZ3JvdW5kIGNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTa2V0Y2hIZWxwZXJzLmNvbG9yc0luVXNlKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgYmFja2dyb3VuZENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICh2bm9kZSkgPT4gQ29sb3JQaWNrZXIuZGVzdHJveSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaChcImJ1dHRvbi5kZWxldGUtdGV4dGJsb2NrLmJ0bi5idG4tZGFuZ2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZS5kaXNwYXRjaCh0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuLmdseXBoaWNvbi5nbHlwaGljb24tdHJhc2hcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1waWNrZXItY29udGFpbmVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEZvbnRQaWNrZXIodm5vZGUuZWxtLCB0aGlzLnN0b3JlLCB0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGluc2VydDogKHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IHByb3BzOiBGb250UGlja2VyUHJvcHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBzdG9yZTogdGhpcy5zdG9yZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHNlbGVjdGlvbjogdGV4dEJsb2NrLmZvbnREZXNjLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogKGZvbnREZXNjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgdXBkYXRlKHsgZm9udERlc2MgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIFJlYWN0RE9NLnJlbmRlcihyaChGb250UGlja2VyLCBwcm9wcyksIHZub2RlLmVsbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEdWFsQm91bmRzUGF0aFdhcnAgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBQT0lOVFNfUEVSX1BBVEggPSAyMDA7XHJcbiAgICAgICAgc3RhdGljIFVQREFURV9ERUJPVU5DRSA9IDE1MDtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc291cmNlOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICAgICAgcHJpdmF0ZSBfdXBwZXI6IFN0cmV0Y2hQYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX2xvd2VyOiBTdHJldGNoUGF0aDtcclxuICAgICAgICBwcml2YXRlIF93YXJwZWQ6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgICAgICBwcml2YXRlIF9vdXRsaW5lOiBwYXBlci5QYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX2N1c3RvbVN0eWxlOiBTa2V0Y2hJdGVtU3R5bGU7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBzb3VyY2U6IHBhcGVyLkNvbXBvdW5kUGF0aCxcclxuICAgICAgICAgICAgYm91bmRzPzogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH0sXHJcbiAgICAgICAgICAgIGN1c3RvbVN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcblxyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYnVpbGQgY2hpbGRyZW4gLS1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJvdW5kcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIgPSBuZXcgU3RyZXRjaFBhdGgoYm91bmRzLnVwcGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvd2VyID0gbmV3IFN0cmV0Y2hQYXRoKGJvdW5kcy5sb3dlcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cHBlciA9IG5ldyBTdHJldGNoUGF0aChbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy50b3BMZWZ0KSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLnRvcFJpZ2h0KVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb3dlciA9IG5ldyBTdHJldGNoUGF0aChbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy5ib3R0b21MZWZ0KSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLmJvdHRvbVJpZ2h0KVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbEJvdW5kc09wYWNpdHkgPSAwLjc1O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvd2VyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZSA9IG5ldyBwYXBlci5QYXRoKHsgY2xvc2VkOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVTaGFwZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChzb3VyY2UucGF0aERhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYWRkIGNoaWxkcmVuIC0tXHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkcmVuKFt0aGlzLl9vdXRsaW5lLCB0aGlzLl93YXJwZWQsIHRoaXMuX3VwcGVyLCB0aGlzLl9sb3dlcl0pO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYXNzaWduIHN0eWxlIC0tXHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1c3RvbVN0eWxlID0gY3VzdG9tU3R5bGUgfHwge1xyXG4gICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwiZ3JheVwiXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyAtLSBzZXQgdXAgb2JzZXJ2ZXJzIC0tXHJcblxyXG4gICAgICAgICAgICBSeC5PYnNlcnZhYmxlLm1lcmdlKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG93ZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpKVxyXG4gICAgICAgICAgICAgICAgLmRlYm91bmNlKER1YWxCb3VuZHNQYXRoV2FycC5VUERBVEVfREVCT1VOQ0UpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHBhdGggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT3V0bGluZVNoYXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVXYXJwZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VkKFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZShmbGFncyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkFUVFJJQlVURSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl91cHBlci52aXNpYmxlICE9PSB0aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb3dlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHVwcGVyKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdXBwZXIucGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBsb3dlcigpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvd2VyLnBhdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgc291cmNlKHZhbHVlOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2UgJiYgdGhpcy5fc291cmNlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc291cmNlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgY3VzdG9tU3R5bGUoKTogU2tldGNoSXRlbVN0eWxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1c3RvbVN0eWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGN1c3RvbVN0eWxlKHZhbHVlOiBTa2V0Y2hJdGVtU3R5bGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VzdG9tU3R5bGUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLnN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5iYWNrZ3JvdW5kQ29sb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGxpbmUuZmlsbENvbG9yID0gdmFsdWUuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGxpbmUuZmlsbENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGNvbnRyb2xCb3VuZHNPcGFjaXR5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIub3BhY2l0eSA9IHRoaXMuX2xvd2VyLm9wYWNpdHkgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG91dGxpbmVDb250YWlucyhwb2ludDogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX291dGxpbmUuY29udGFpbnMocG9pbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVXYXJwZWQoKSB7XHJcbiAgICAgICAgICAgIGxldCBvcnRoT3JpZ2luID0gdGhpcy5fc291cmNlLmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5fc291cmNlLmJvdW5kcy53aWR0aDtcclxuICAgICAgICAgICAgbGV0IG9ydGhIZWlnaHQgPSB0aGlzLl9zb3VyY2UuYm91bmRzLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLmR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbihcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyLnBhdGgsIHRoaXMuX2xvd2VyLnBhdGgpO1xyXG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtID0gbmV3IEZvbnRTaGFwZS5QYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChvcnRoT3JpZ2luKTtcclxuICAgICAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIG9ydGhIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhzID0gdGhpcy5fc291cmNlLmNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSA8cGFwZXIuUGF0aD5pdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhQb2ludHMgPSBQYXBlckhlbHBlcnMudHJhY2VQYXRoQXNQb2ludHMocGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgRHVhbEJvdW5kc1BhdGhXYXJwLlBPSU5UU19QRVJfUEFUSClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChwID0+IHRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludChwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFBhdGggPSBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3hQYXRoLnNpbXBsaWZ5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHhQYXRoO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLnJlbW92ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5hZGRDaGlsZHJlbihuZXdQYXRocyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZU91dGxpbmVTaGFwZSgpIHtcclxuICAgICAgICAgICAgY29uc3QgbG93ZXIgPSBuZXcgcGFwZXIuUGF0aCh0aGlzLl9sb3dlci5wYXRoLnNlZ21lbnRzKTtcclxuICAgICAgICAgICAgbG93ZXIucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLnNlZ21lbnRzID0gdGhpcy5fdXBwZXIucGF0aC5zZWdtZW50cy5jb25jYXQobG93ZXIuc2VnbWVudHMpO1xyXG4gICAgICAgICAgICBsb3dlci5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBQYXRoSGFuZGxlIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgICAgICBzdGF0aWMgU0VHTUVOVF9NQVJLRVJfUkFESVVTID0gMTA7XHJcbiAgICAgICAgc3RhdGljIENVUlZFX01BUktFUl9SQURJVVMgPSA2O1xyXG4gICAgICAgIHN0YXRpYyBEUkFHX1RIUkVTSE9MRCA9IDM7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX21hcmtlcjogcGFwZXIuU2hhcGU7XHJcbiAgICAgICAgcHJpdmF0ZSBfc2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgICAgICBwcml2YXRlIF9jdXJ2ZTogcGFwZXIuQ3VydmU7XHJcbiAgICAgICAgcHJpdmF0ZSBfc21vb3RoZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgcHJpdmF0ZSBfY3VydmVTcGxpdCA9IG5ldyBPYnNlcnZhYmxlRXZlbnQ8bnVtYmVyPigpO1xyXG4gICAgICAgIHByaXZhdGUgX2N1cnZlQ2hhbmdlVW5zdWI6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcHJpdmF0ZSBkcmFnZ2luZztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoYXR0YWNoOiBwYXBlci5TZWdtZW50IHwgcGFwZXIuQ3VydmUpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbjogcGFwZXIuUG9pbnQ7XHJcbiAgICAgICAgICAgIGxldCBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgICAgICAgICBpZiAoYXR0YWNoIGluc3RhbmNlb2YgcGFwZXIuU2VnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudCA9IDxwYXBlci5TZWdtZW50PmF0dGFjaDtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgICAgIHBhdGggPSB0aGlzLl9zZWdtZW50LnBhdGg7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXR0YWNoIGluc3RhbmNlb2YgcGFwZXIuQ3VydmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlID0gPHBhcGVyLkN1cnZlPmF0dGFjaDtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fY3VydmUuZ2V0UG9pbnRBdCh0aGlzLl9jdXJ2ZS5sZW5ndGggKiAwLjUpO1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHRoaXMuX2N1cnZlLnBhdGg7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcImF0dGFjaCBtdXN0IGJlIFNlZ21lbnQgb3IgQ3VydmVcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvc2l0aW9uLCBQYXRoSGFuZGxlLlNFR01FTlRfTUFSS0VSX1JBRElVUyk7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5zdHJva2VDb2xvciA9IFwiYmx1ZVwiO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIuZmlsbENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIuc2VsZWN0ZWRDb2xvciA9IG5ldyBwYXBlci5Db2xvcigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9tYXJrZXIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBc1NlZ21lbnQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBc0N1cnZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBhcGVyRXh0LmV4dGVuZE1vdXNlRXZlbnRzKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vbihwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJ2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBjdXJ2ZSwgcHVwYXRlIHRvIHNlZ21lbnQgaGFuZGxlXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlQ2hhbmdlVW5zdWIoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gbmV3IHBhcGVyLlNlZ21lbnQodGhpcy5jZW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnZlSWR4ID0gdGhpcy5fY3VydmUuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VydmUucGF0aC5pbnNlcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlSWR4ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VydmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBc1NlZ21lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnZlU3BsaXQubm90aWZ5KGN1cnZlSWR4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZWdtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5wb2ludCA9IHRoaXMuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zbW9vdGhlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNsYXRlKGV2LmRlbHRhKTtcclxuICAgICAgICAgICAgICAgIGV2LnN0b3AoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uKHBhcGVyLkV2ZW50VHlwZS5jbGljaywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNtb290aGVkID0gIXRoaXMuc21vb3RoZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBldi5zdG9wKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY3VydmVDaGFuZ2VVbnN1YiA9IHBhdGguc3Vic2NyaWJlKGZsYWdzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJ2ZSAmJiAhdGhpcy5fc2VnbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICYmIChmbGFncyAmIFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuU0VHTUVOVFMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBzbW9vdGhlZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Ntb290aGVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IHNtb290aGVkKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Ntb290aGVkID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuaGFuZGxlT3V0ID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGN1cnZlU3BsaXQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jdXJ2ZVNwbGl0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGNlbnRlcigpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGNlbnRlcihwb2ludDogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvaW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdHlsZUFzU2VnbWVudCgpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLm9wYWNpdHkgPSAwLjg7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5kYXNoQXJyYXkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIucmFkaXVzID0gUGF0aEhhbmRsZS5TRUdNRU5UX01BUktFUl9SQURJVVM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0eWxlQXNDdXJ2ZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLm9wYWNpdHkgPSAwLjg7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5kYXNoQXJyYXkgPSBbMiwgMl07XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5yYWRpdXMgPSBQYXRoSGFuZGxlLkNVUlZFX01BUktFUl9SQURJVVM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3RyZXRjaFBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3BhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgcHJpdmF0ZSBfcGF0aENoYW5nZWQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlBhdGg+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHNlZ21lbnRzOiBwYXBlci5TZWdtZW50W10sIHN0eWxlPzogcGFwZXIuU3R5bGUpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3BhdGggPSBuZXcgcGFwZXIuUGF0aChzZWdtZW50cyk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fcGF0aCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3R5bGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGguc3R5bGUgPSBzdHlsZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGguc3Ryb2tlQ29sb3IgPSBcImxpZ2h0Z3JheVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHJva2VXaWR0aCA9IDY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcyBvZiB0aGlzLl9wYXRoLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFNlZ21lbnRIYW5kbGUocyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiB0aGlzLl9wYXRoLmN1cnZlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZShjKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHBhdGgoKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHBhdGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGF0aENoYW5nZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGFkZFNlZ21lbnRIYW5kbGUoc2VnbWVudDogcGFwZXIuU2VnbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZEhhbmRsZShuZXcgUGF0aEhhbmRsZShzZWdtZW50KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGFkZEN1cnZlSGFuZGxlKGN1cnZlOiBwYXBlci5DdXJ2ZSkge1xyXG4gICAgICAgICAgICBsZXQgaGFuZGxlID0gbmV3IFBhdGhIYW5kbGUoY3VydmUpO1xyXG4gICAgICAgICAgICBoYW5kbGUuY3VydmVTcGxpdC5zdWJzY3JpYmVPbmUoY3VydmVJZHggPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZSh0aGlzLl9wYXRoLmN1cnZlc1tjdXJ2ZUlkeF0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZSh0aGlzLl9wYXRoLmN1cnZlc1tjdXJ2ZUlkeCArIDFdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkSGFuZGxlKGhhbmRsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGFkZEhhbmRsZShoYW5kbGU6IFBhdGhIYW5kbGUpIHtcclxuICAgICAgICAgICAgaGFuZGxlLnZpc2libGUgPSB0aGlzLnZpc2libGU7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXRoQ2hhbmdlZC5ub3RpZnkodGhpcy5fcGF0aCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBoYW5kbGUub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXRoQ2hhbmdlZC5ub3RpZnkodGhpcy5fcGF0aCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoaGFuZGxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNZWFzdXJlcyBvZmZzZXRzIG9mIHRleHQgZ2x5cGhzLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dFJ1bGVyIHtcclxuXHJcbiAgICAgICAgZm9udEZhbWlseTogc3RyaW5nO1xyXG4gICAgICAgIGZvbnRXZWlnaHQ6IG51bWJlcjtcclxuICAgICAgICBmb250U2l6ZTogbnVtYmVyO1xyXG5cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCh0ZXh0KTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5jb250ZW50ID0gdGV4dDtcclxuICAgICAgICAgICAgcG9pbnRUZXh0Lmp1c3RpZmljYXRpb24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5mb250RmFtaWx5KSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludFRleHQuZm9udEZhbWlseSA9IHRoaXMuZm9udEZhbWlseTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5mb250V2VpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludFRleHQuZm9udFdlaWdodCA9IHRoaXMuZm9udFdlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5mb250U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBvaW50VGV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldFRleHRPZmZzZXRzKHRleHQpIHtcclxuICAgICAgICAgICAgLy8gTWVhc3VyZSBnbHlwaHMgaW4gcGFpcnMgdG8gY2FwdHVyZSB3aGl0ZSBzcGFjZS5cclxuICAgICAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxyXG4gICAgICAgICAgICB2YXIgZ2x5cGhQYWlycyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpICsgMSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBGb3IgZWFjaCBjaGFyYWN0ZXIsIGZpbmQgY2VudGVyIG9mZnNldC5cclxuICAgICAgICAgICAgdmFyIHhPZmZzZXRzID0gWzBdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBNZWFzdXJlIHRocmVlIGNoYXJhY3RlcnMgYXQgYSB0aW1lIHRvIGdldCB0aGUgYXBwcm9wcmlhdGUgXHJcbiAgICAgICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxyXG4gICAgICAgICAgICAgICAgdmFyIHRyaWFkVGV4dCA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGkgLSAxLCBpICsgMSkpO1xyXG4gICAgICAgICAgICAgICAgdHJpYWRUZXh0LnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXHJcbiAgICAgICAgICAgICAgICAvLyAgIGFuZCBoYWxmIG9mIGN1cnJlbnQgZ2x5cGggcGFpci5cclxuICAgICAgICAgICAgICAgIC8vIE11c3QgYmUgcmlnaHQsIGJlY2F1c2UgaXQgd29ya3MuXHJcbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoXHJcbiAgICAgICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2kgLSAxXS5ib3VuZHMud2lkdGggLyAyXHJcbiAgICAgICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQWRkIG9mZnNldCB3aWR0aCB0byBwcmlvciBvZmZzZXQuIFxyXG4gICAgICAgICAgICAgICAgeE9mZnNldHNbaV0gPSB4T2Zmc2V0c1tpIC0gMV0gKyBvZmZzZXRXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgZ2x5cGhQYWlyIG9mIGdseXBoUGFpcnMpIHtcclxuICAgICAgICAgICAgICAgIGdseXBoUGFpci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHhPZmZzZXRzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dFdhcnAgZXh0ZW5kcyBEdWFsQm91bmRzUGF0aFdhcnAge1xyXG5cclxuICAgICAgICBzdGF0aWMgREVGQVVMVF9GT05UX1NJWkUgPSAxMjg7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2ZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBfdGV4dDogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX2ZvbnRTaXplOiBudW1iZXI7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBmb250OiBvcGVudHlwZS5Gb250LFxyXG4gICAgICAgICAgICB0ZXh0OiBzdHJpbmcsXHJcbiAgICAgICAgICAgIGJvdW5kcz86IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9LFxyXG4gICAgICAgICAgICBmb250U2l6ZT86IG51bWJlcixcclxuICAgICAgICAgICAgc3R5bGU/OiBTa2V0Y2hJdGVtU3R5bGUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghZm9udFNpemUpIHtcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplID0gVGV4dFdhcnAuREVGQVVMVF9GT05UX1NJWkU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGhEYXRhID0gVGV4dFdhcnAuZ2V0UGF0aERhdGEoZm9udCwgdGV4dCwgZm9udFNpemUpO1xyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcblxyXG4gICAgICAgICAgICBzdXBlcihwYXRoLCBib3VuZHMsIHN0eWxlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSBmb250O1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0ID0gdGV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB0ZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IHRleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGV4dFBhdGgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBmb250U2l6ZSgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgZm9udFNpemUodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGZvbnQodmFsdWU6IG9wZW50eXBlLkZvbnQpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl9mb250KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVwZGF0ZVRleHRQYXRoKCkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IFRleHRXYXJwLmdldFBhdGhEYXRhKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udCwgdGhpcy5fdGV4dCwgdGhpcy5fZm9udFNpemUpO1xyXG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IG5ldyBwYXBlci5Db21wb3VuZFBhdGgocGF0aERhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UGF0aERhdGEoZm9udDogb3BlbnR5cGUuRm9udCxcclxuICAgICAgICAgICAgdGV4dDogc3RyaW5nLCBmb250U2l6ZT86IHN0cmluZyB8IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBvcGVuVHlwZVBhdGggPSBmb250LmdldFBhdGgodGV4dCwgMCwgMCxcclxuICAgICAgICAgICAgICAgIE51bWJlcihmb250U2l6ZSkgfHwgVGV4dFdhcnAuREVGQVVMVF9GT05UX1NJWkUpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3BlblR5cGVQYXRoLnRvUGF0aERhdGEoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBTa2V0Y2hJdGVtU3R5bGUgZXh0ZW5kcyBwYXBlci5JU3R5bGUge1xyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIH1cclxuXHJcbn0iXX0=