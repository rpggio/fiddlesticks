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
var Fstx;
(function (Fstx) {
    var Framework;
    (function (Framework) {
        var Watermark = (function () {
            function Watermark(project, path, scaleFactor) {
                var _this = this;
                if (scaleFactor === void 0) { scaleFactor = 0.1; }
                this._project = project;
                this._project.importSVG(path, function (imported) {
                    _this._mark = imported.getItem({ class: paper.CompoundPath });
                    if (!_this._mark) {
                        throw new Error("Could not load CompoundPath from " + path);
                    }
                    _this._mark.remove();
                });
                this._scaleFactor = scaleFactor;
            }
            Watermark.prototype.placeInto = function (container, backgroundColor) {
                var watermarkDim = Math.sqrt(container.bounds.size.width * container.bounds.size.height) * this._scaleFactor;
                this._mark.bounds.size = new paper.Size(watermarkDim, watermarkDim);
                // just inside lower right
                this._mark.position = container.bounds.bottomRight.subtract(watermarkDim / 2 + 1);
                if (backgroundColor.lightness > 0.4) {
                    this._mark.fillColor = "black";
                    this._mark.opacity = 0.05;
                }
                else {
                    this._mark.fillColor = "white";
                    this._mark.opacity = 0.2;
                }
                container.addChild(this._mark);
            };
            Watermark.prototype.remove = function () {
                this._mark.remove();
            };
            return Watermark;
        }());
        Framework.Watermark = Watermark;
    })(Framework = Fstx.Framework || (Fstx.Framework = {}));
})(Fstx || (Fstx = {}));
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
            this.mark = new Fstx.Framework.Watermark(this.project, "img/spiral-logo.svg", 0.06);
            store.templateState$.subscribe(function (ts) {
                // only process one request at a time
                if (_this.rendering) {
                    // always process the last received
                    _this.lastReceived = ts.design;
                    return;
                }
                _this.render(ts.design);
            });
            store.events.downloadPNGRequested.sub(function (pixels) { return _this.downloadPNG(pixels); });
        }
        PreviewCanvas.prototype.downloadPNG = function (pixels) {
            if (!this.store.design.content
                || !this.store.design.content.text
                || !this.store.design.content.text.length) {
                return;
            }
            // very fragile way to get bg color
            var shape = this.workspace.getItem({ class: paper.Shape });
            var bgColor = shape.fillColor;
            this.mark.placeInto(this.workspace, bgColor);
            // Half of max DPI produces approx 4200x4200.
            var dpi = 0.5 * PaperHelpers.getExportDpi(this.workspace.bounds.size, pixels);
            var raster = this.workspace.rasterize(dpi, false);
            var data = raster.toDataURL();
            var fileName = Fstx.Framework.createFileName(this.store.design.content.text, 40, "png");
            var blob = DomHelpers.dataURLToBlob(data);
            saveAs(blob, fileName);
            this.mark.remove();
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
            return h("div.controls", [
                h("button.btn.btn-primary", {
                    attrs: {
                        type: "button"
                    },
                    on: {
                        click: function () { return _this.store.downloadPNG(100 * 1000); }
                    }
                }, ["Download small"]),
                h("button.btn.btn-primary", {
                    attrs: {
                        type: "button"
                    },
                    on: {
                        click: function () { return _this.store.downloadPNG(500 * 1000); }
                    }
                }, ["Download medium"]),
            ]);
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
        Store.prototype.downloadPNG = function (pixels) {
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
            this._mark = new Fstx.Framework.Watermark(this.project, "img/spiral-logo.svg");
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
            store.events.editor.exportPNGRequested.sub(function (options) {
                _this.downloadPNG(options);
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
        WorkspaceController.prototype.downloadPNG = function (options) {
            var _this = this;
            var dpi = PaperHelpers.getExportDpi(this._workspace.bounds.size, options.pixels || 600 * 600);
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
                this._mark.placeInto(background, fill.fillColor);
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
                            content: "Export small image",
                            options: {
                                attrs: {
                                    title: "Export sketch as PNG",
                                },
                                on: {
                                    click: function () { return _this.store.actions.editor.exportPNG.dispatch({
                                        pixels: 100 * 1000
                                    }); }
                                }
                            }
                        },
                        {
                            content: "Export medium image",
                            options: {
                                attrs: {
                                    title: "Export sketch as PNG",
                                },
                                on: {
                                    click: function () { return _this.store.actions.editor.exportPNG.dispatch({
                                        pixels: 500 * 1000
                                    }); }
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
                            content: "Duplicate sketch (new URL)",
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
                            content: "Load sample sketch",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Eb21IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0Rvd25sb2FkSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL1NlZWRSYW5kb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL1dhdGVybWFyay50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9jb2xsZWN0aW9ucy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ldmVudHMudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvYm9vdHNjcmlwdC9ib290c2NyaXB0LnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3BhcGVyL1BhcGVyTm90aWZ5LnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3BhcGVyL1ZpZXdab29tLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3BhcGVyL21vdXNlRXZlbnRFeHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvcGFwZXItZXh0LnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3Zkb20vQ29tcG9uZW50LnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL3Zkb20vVkRvbUhlbHBlcnMudHMiLCIuLi8uLi9jbGllbnQvYXBwL0FwcENvb2tpZXMudHMiLCIuLi8uLi9jbGllbnQvYXBwL0FwcE1vZHVsZS50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwUm91dGVyLnRzIiwiLi4vLi4vY2xpZW50L2FwcC9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9kZW1vL0RlbW9Nb2R1bGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9CdWlsZGVyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvUHJldmlld0NhbnZhcy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL1JlbmRlckNhbnZhcy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL1NoYXJlT3B0aW9uc1VJLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvU3RvcmUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9tb2RlbHMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9Db250cm9sSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL2NvbnRyb2xzL0ZvbnRDaG9vc2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvSW1hZ2VDaG9vc2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvVGVtcGxhdGVGb250Q2hvb3Nlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL2NvbnRyb2xzL1RleHRJbnB1dC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL3RlbXBsYXRlcy9EaWNrZW5zLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9Eb2N1bWVudEtleUhhbmRsZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL1NrZXRjaEVkaXRvck1vZHVsZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvU2tldGNoSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvU3RvcmUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL1dvcmtzcGFjZUNvbnRyb2xsZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL2NoYW5uZWxzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9jb25zdGFudHMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL21vZGVscy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivb3BlcmF0aW9ucy9VcGxvYWRJbWFnZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivc2VydmljZXMvRm9udEhlbHBlcnMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3NlcnZpY2VzL1MzQWNjZXNzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9Db2xvclBpY2tlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivdmlld3MvRWRpdG9yQmFyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9Gb250UGlja2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9IZWxwRGlhbG9nLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9PcGVyYXRpb25QYW5lbC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivdmlld3MvU2VsZWN0ZWRJdGVtRWRpdG9yLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9UZXh0QmxvY2tFZGl0b3IudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9EdWFsQm91bmRzUGF0aFdhcnAudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9QYXRoSGFuZGxlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvU3RyZXRjaFBhdGgudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9UZXh0UnVsZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9UZXh0V2FycC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNl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QUUsRUFBRTtRQUNWLE1BQU0sRUFBRSxFQUFFO1FBQ1YsTUFBTSxFQUFFLEVBQUU7UUFDVixNQUFNLEVBQUUsRUFBRTtRQUNWLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxVQUFVLEVBQUUsRUFBRTtRQUNkLFdBQVcsRUFBRSxFQUFFO1FBQ2YsU0FBUyxFQUFFLEVBQUU7UUFDYixPQUFPLEVBQUUsRUFBRTtRQUNYLE9BQU8sRUFBRSxFQUFFO1FBQ1gsT0FBTyxFQUFFLEVBQUU7UUFDWCxPQUFPLEVBQUUsRUFBRTtRQUNYLE9BQU8sRUFBRSxHQUFHO1FBQ1osT0FBTyxFQUFFLEdBQUc7UUFDWixPQUFPLEVBQUUsR0FBRztRQUNaLE9BQU8sRUFBRSxHQUFHO1FBQ1osT0FBTyxFQUFFLEdBQUc7UUFDWixPQUFPLEVBQUUsR0FBRztRQUNaLFFBQVEsRUFBRSxHQUFHO1FBQ2IsR0FBRyxFQUFFLEdBQUc7UUFDUixRQUFRLEVB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LENBQUE7QUFFTCxDQUFDLEVBeEVTLFlBQVksS0FBWixZQUFZLFFBd0VyQjtBQ2xFQSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5uYW1lc3BhY2UgRG9tSGVscGVycyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgYmxvYiBmcm9tIGEgZGF0YSBVUkwgKGVpdGhlciBiYXNlNjQgZW5jb2RlZCBvciBub3QpLlxyXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL2ViaWRlbC9maWxlci5qcy9ibG9iL21hc3Rlci9zcmMvZmlsZXIuanMjTDEzN1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhVVJMIFRoZSBkYXRhIFVSTCB0byBjb252ZXJ0LlxyXG4gICAgICogQHJldHVybiB7QmxvYn0gQSBibG9iIHJlcHJlc2VudGluZyB0aGUgYXJyYXkgYnVmZmVyIGRhdGEuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkYXRhVVJMVG9CbG9iKGRhdGFVUkwpOiBCbG9iIHtcclxuICAgICAgICB2YXIgQkFTRTY0X01BUktFUiA9ICc7YmFzZTY0LCc7XHJcbiAgICAgICAgaWYgKGRhdGFVUkwuaW5kZXhPZihCQVNFNjRfTUFSS0VSKSA9PSAtMSkge1xyXG4gICAgICAgICAgICB2YXIgcGFydHMgPSBkYXRhVVJMLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50VHlwZSA9IHBhcnRzWzBdLnNwbGl0KCc6JylbMV07XHJcbiAgICAgICAgICAgIHZhciByYXcgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBCbG9iKFtyYXddLCB7IHR5cGU6IGNvbnRlbnRUeXBlIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBhcnRzID0gZGF0YVVSTC5zcGxpdChCQVNFNjRfTUFSS0VSKTtcclxuICAgICAgICB2YXIgY29udGVudFR5cGUgPSBwYXJ0c1swXS5zcGxpdCgnOicpWzFdO1xyXG4gICAgICAgIHZhciByYXcgPSB3aW5kb3cuYXRvYihwYXJ0c1sxXSk7XHJcbiAgICAgICAgdmFyIHJhd0xlbmd0aCA9IHJhdy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHZhciB1SW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkocmF3TGVuZ3RoKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdMZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB1SW50OEFycmF5W2ldID0gcmF3LmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEJsb2IoW3VJbnQ4QXJyYXldLCB7IHR5cGU6IGNvbnRlbnRUeXBlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbml0RXJyb3JIYW5kbGVyKGxvZ2dlcjogKGVycm9yRGF0YTogT2JqZWN0KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5vbmVycm9yID0gZnVuY3Rpb24obXNnLCBmaWxlLCBsaW5lLCBjb2wsIGVycm9yOiBFcnJvciB8IHN0cmluZykge1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHN0YWNrZnJhbWVzID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBtc2csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogbGluZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbDogY29sLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6IHN0YWNrZnJhbWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gbG9nIGVycm9yXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyYmFjayA9IGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBsb2cgZXJyb3JcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKDxzdHJpbmc+ZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGFzRXJyb3IgPSB0eXBlb2YgZXJyb3IgPT09IFwic3RyaW5nXCJcclxuICAgICAgICAgICAgICAgICAgICA/IG5ldyBFcnJvcihlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICA6IGVycm9yO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gU3RhY2tUcmFjZS5mcm9tRXJyb3IoYXNFcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihjYWxsYmFjaylcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyYmFjayk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImZhaWxlZCB0byBsb2cgZXJyb3JcIiwgZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBLZXlDb2RlcyA9IHtcclxuICAgICAgICBCYWNrU3BhY2U6IDgsXHJcbiAgICAgICAgVGFiOiA5LFxyXG4gICAgICAgIEVudGVyOiAxMyxcclxuICAgICAgICBTaGlmdDogMTYsXHJcbiAgICAgICAgQ3RybDogMTcsXHJcbiAgICAgICAgQWx0OiAxOCxcclxuICAgICAgICBQYXVzZUJyZWFrOiAxOSxcclxuICAgICAgICBDYXBzTG9jazogMjAsXHJcbiAgICAgICAgRXNjOiAyNyxcclxuICAgICAgICBQYWdlVXA6IDMzLFxyXG4gICAgICAgIFBhZ2VEb3duOiAzNCxcclxuICAgICAgICBFbmQ6IDM1LFxyXG4gICAgICAgIEhvbWU6IDM2LFxyXG4gICAgICAgIEFycm93TGVmdDogMzcsXHJcbiAgICAgICAgQXJyb3dVcDogMzgsXHJcbiAgICAgICAgQXJyb3dSaWdodDogMzksXHJcbiAgICAgICAgQXJyb3dEb3duOiA0MCxcclxuICAgICAgICBJbnNlcnQ6IDQ1LFxyXG4gICAgICAgIERlbGV0ZTogNDYsXHJcbiAgICAgICAgRGlnaXQwOiA0OCxcclxuICAgICAgICBEaWdpdDE6IDQ5LFxyXG4gICAgICAgIERpZ2l0MjogNTAsXHJcbiAgICAgICAgRGlnaXQzOiA1MSxcclxuICAgICAgICBEaWdpdDQ6IDUyLFxyXG4gICAgICAgIERpZ2l0NTogNTMsXHJcbiAgICAgICAgRGlnaXQ2OiA1NCxcclxuICAgICAgICBEaWdpdDc6IDU1LFxyXG4gICAgICAgIERpZ2l0ODogNTYsXHJcbiAgICAgICAgRGlnaXQ5OiA1NyxcclxuICAgICAgICBBOiA2NSxcclxuICAgICAgICBCOiA2NixcclxuICAgICAgICBDOiA2NyxcclxuICAgICAgICBEOiA2OCxcclxuICAgICAgICBFOiA2OSxcclxuICAgICAgICBGOiA3MCxcclxuICAgICAgICBHOiA3MSxcclxuICAgICAgICBIOiA3MixcclxuICAgICAgICBJOiA3MyxcclxuICAgICAgICBKOiA3NCxcclxuICAgICAgICBLOiA3NSxcclxuICAgICAgICBMOiA3NixcclxuICAgICAgICBNOiA3NyxcclxuICAgICAgICBOOiA3OCxcclxuICAgICAgICBPOiA3OSxcclxuICAgICAgICBQOiA4MCxcclxuICAgICAgICBROiA4MSxcclxuICAgICAgICBSOiA4MixcclxuICAgICAgICBTOiA4MyxcclxuICAgICAgICBUOiA4NCxcclxuICAgICAgICBVOiA4NSxcclxuICAgICAgICBWOiA4NixcclxuICAgICAgICBXOiA4NyxcclxuICAgICAgICBYOiA4OCxcclxuICAgICAgICBZOiA4OSxcclxuICAgICAgICBaOiA5MCxcclxuICAgICAgICBXaW5kb3dMZWZ0OiA5MSxcclxuICAgICAgICBXaW5kb3dSaWdodDogOTIsXHJcbiAgICAgICAgU2VsZWN0S2V5OiA5MyxcclxuICAgICAgICBOdW1wYWQwOiA5NixcclxuICAgICAgICBOdW1wYWQxOiA5NyxcclxuICAgICAgICBOdW1wYWQyOiA5OCxcclxuICAgICAgICBOdW1wYWQzOiA5OSxcclxuICAgICAgICBOdW1wYWQ0OiAxMDAsXHJcbiAgICAgICAgTnVtcGFkNTogMTAxLFxyXG4gICAgICAgIE51bXBhZDY6IDEwMixcclxuICAgICAgICBOdW1wYWQ3OiAxMDMsXHJcbiAgICAgICAgTnVtcGFkODogMTA0LFxyXG4gICAgICAgIE51bXBhZDk6IDEwNSxcclxuICAgICAgICBNdWx0aXBseTogMTA2LFxyXG4gICAgICAgIEFkZDogMTA3LFxyXG4gICAgICAgIFN1YnRyYWN0OiAxMDksXHJcbiAgICAgICAgRGVjaW1hbFBvaW50OiAxMTAsXHJcbiAgICAgICAgRGl2aWRlOiAxMTEsXHJcbiAgICAgICAgRjE6IDExMixcclxuICAgICAgICBGMjogMTEzLFxyXG4gICAgICAgIEYzOiAxMTQsXHJcbiAgICAgICAgRjQ6IDExNSxcclxuICAgICAgICBGNTogMTE2LFxyXG4gICAgICAgIEY2OiAxMTcsXHJcbiAgICAgICAgRjc6IDExOCxcclxuICAgICAgICBGODogMTE5LFxyXG4gICAgICAgIEY5OiAxMjAsXHJcbiAgICAgICAgRjEwOiAxMjEsXHJcbiAgICAgICAgRjExOiAxMjIsXHJcbiAgICAgICAgRjEyOiAxMjMsXHJcbiAgICAgICAgTnVtTG9jazogMTQ0LFxyXG4gICAgICAgIFNjcm9sbExvY2s6IDE0NSxcclxuICAgICAgICBTZW1pQ29sb246IDE4NixcclxuICAgICAgICBFcXVhbDogMTg3LFxyXG4gICAgICAgIENvbW1hOiAxODgsXHJcbiAgICAgICAgRGFzaDogMTg5LFxyXG4gICAgICAgIFBlcmlvZDogMTkwLFxyXG4gICAgICAgIEZvcndhcmRTbGFzaDogMTkxLFxyXG4gICAgICAgIEdyYXZlQWNjZW50OiAxOTIsXHJcbiAgICAgICAgQnJhY2tldE9wZW46IDIxOSxcclxuICAgICAgICBCYWNrU2xhc2g6IDIyMCxcclxuICAgICAgICBCcmFja2V0Q2xvc2U6IDIyMSxcclxuICAgICAgICBTaW5nbGVRdW90ZTogMjIyXHJcbiAgICB9O1xyXG5cclxufSIsIm5hbWVzcGFjZSBGc3R4LkZyYW1ld29yayB7XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZpbGVOYW1lKHRleHQ6IHN0cmluZywgbWF4TGVuZ3RoOiBudW1iZXIsIGV4dGVuc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgZm9yIChjb25zdCB3b3JkIG9mIHRleHQuc3BsaXQoL1xccy8pKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyaW0gPSB3b3JkLnJlcGxhY2UoL1xcVy9nLCAnJykudHJpbSgpO1xyXG4gICAgICAgICAgICBpZiAodHJpbS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmKG5hbWUubGVuZ3RoICYmIG5hbWUubGVuZ3RoICsgdHJpbS5sZW5ndGggKyAxID4gbWF4TGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChuYW1lLmxlbmd0aCkgbmFtZSArPSBcIiBcIjtcclxuICAgICAgICAgICAgICAgIG5hbWUgKz0gdHJpbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmFtZSArIFwiLlwiICsgZXh0ZW5zaW9uO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5uYW1lc3BhY2UgRm9udEhlbHBlcnMge1xyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEVsZW1lbnRGb250U3R5bGUge1xyXG4gICAgICAgIGZvbnRGYW1pbHk/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFdlaWdodD86IHN0cmluZztcclxuICAgICAgICBmb250U3R5bGU/OiBzdHJpbmc7IFxyXG4gICAgICAgIGZvbnRTaXplPzogc3RyaW5nOyBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldENzc1N0eWxlKGZhbWlseTogc3RyaW5nLCB2YXJpYW50Pzogc3RyaW5nLCBzaXplPzogc3RyaW5nKXtcclxuICAgICAgICBsZXQgc3R5bGUgPSA8RWxlbWVudEZvbnRTdHlsZT57IGZvbnRGYW1pbHk6IGZhbWlseSB9O1xyXG4gICAgICAgIGlmKHZhcmlhbnQgJiYgdmFyaWFudC5pbmRleE9mKFwiaXRhbGljXCIpID49IDApe1xyXG4gICAgICAgICAgICBzdHlsZS5mb250U3R5bGUgPSBcIml0YWxpY1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbnVtZXJpYyA9IHZhcmlhbnQgJiYgdmFyaWFudC5yZXBsYWNlKC9bXlxcZF0vZywgXCJcIik7XHJcbiAgICAgICAgaWYobnVtZXJpYyAmJiBudW1lcmljLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHN0eWxlLmZvbnRXZWlnaHQgPSBudW1lcmljLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHNpemUpe1xyXG4gICAgICAgICAgICBzdHlsZS5mb250U2l6ZSA9IHNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHlsZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldFN0eWxlU3RyaW5nKGZhbWlseTogc3RyaW5nLCB2YXJpYW50OiBzdHJpbmcsIHNpemU/OiBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgc3R5bGVPYmogPSBnZXRDc3NTdHlsZShmYW1pbHksIHZhcmlhbnQsIHNpemUpO1xyXG4gICAgICAgIGxldCBwYXJ0cyA9IFtdO1xyXG4gICAgICAgIGlmKHN0eWxlT2JqLmZvbnRGYW1pbHkpe1xyXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LWZhbWlseTonJHtzdHlsZU9iai5mb250RmFtaWx5fSdgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc3R5bGVPYmouZm9udFdlaWdodCl7XHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goYGZvbnQtd2VpZ2h0OiR7c3R5bGVPYmouZm9udFdlaWdodH1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc3R5bGVPYmouZm9udFN0eWxlKXtcclxuICAgICAgICAgICAgcGFydHMucHVzaChgZm9udC1zdHlsZToke3N0eWxlT2JqLmZvbnRTdHlsZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc3R5bGVPYmouZm9udFNpemUpe1xyXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LXNpemU6JHtzdHlsZU9iai5mb250U2l6ZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oXCI7IFwiKTtcclxuICAgIH1cclxuICAgIFxyXG59IiwibmFtZXNwYWNlIEZyYW1ld29yayB7XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGxvZ3RhcDxUPihtZXNzYWdlOiBzdHJpbmcsIHN0cmVhbTogUnguT2JzZXJ2YWJsZTxUPik6IFJ4Lk9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiBzdHJlYW0udGFwKHQgPT4gY29uc29sZS5sb2cobWVzc2FnZSwgdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBuZXdpZCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAobmV3IERhdGUoKS5nZXRUaW1lKCkgKyBNYXRoLnJhbmRvbSgpKVxyXG4gICAgICAgICAgICAudG9TdHJpbmcoMzYpLnJlcGxhY2UoJy4nLCAnJyk7XHJcbiAgICB9XHJcbiAgIFxyXG59XHJcbiIsIm5hbWVzcGFjZSBGcmFtZXdvcmsge1xyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgU2VlZFJhbmRvbSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2VlZDogbnVtYmVyO1xyXG4gICAgICAgIG5leHRTZWVkOiBudW1iZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc2VlZDogbnVtYmVyID0gTWF0aC5yYW5kb20oKSl7XHJcbiAgICAgICAgICAgIHRoaXMuc2VlZCA9IHRoaXMubmV4dFNlZWQgPSBzZWVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByYW5kb20oKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgY29uc3QgeCA9IE1hdGguc2luKHRoaXMubmV4dFNlZWQgKiAyICogTWF0aC5QSSkgKiAxMDAwMDtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geCAtIE1hdGguZmxvb3IoeCk7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dFNlZWQgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJcclxubmFtZXNwYWNlIFR5cGVkQ2hhbm5lbCB7XHJcblxyXG4gICAgLy8gLS0tIENvcmUgdHlwZXMgLS0tXHJcblxyXG4gICAgdHlwZSBTZXJpYWxpemFibGUgPSBPYmplY3QgfCBBcnJheTxhbnk+IHwgbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiB8IERhdGUgfCB2b2lkO1xyXG5cclxuICAgIHR5cGUgVmFsdWUgPSBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuIHwgRGF0ZTtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2U8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgZGF0YT86IFREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHR5cGUgSVN1YmplY3Q8VD4gPSBSeC5PYnNlcnZlcjxUPiAmIFJ4Lk9ic2VydmFibGU8VD47XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIENoYW5uZWxUb3BpYzxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4ge1xyXG4gICAgICAgIHR5cGU6IHN0cmluZztcclxuICAgICAgICBjaGFubmVsOiBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoYW5uZWw6IElTdWJqZWN0PE1lc3NhZ2U8VERhdGE+PiwgdHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWJzY3JpYmUob2JzZXJ2ZXI6IChtZXNzYWdlOiBNZXNzYWdlPFREYXRhPikgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmUoKS5zdWJzY3JpYmUob2JzZXJ2ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3ViKG9ic2VydmVyOiAoZGF0YTogVERhdGEpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCkuc3Vic2NyaWJlKG0gPT4gb2JzZXJ2ZXIobS5kYXRhKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpc3BhdGNoKGRhdGE/OiBURGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwub25OZXh0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5maWx0ZXIobSA9PiBtLnR5cGUgPT09IHRoaXMudHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG9ic2VydmVEYXRhKCk6IFJ4Lk9ic2VydmFibGU8VERhdGE+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub2JzZXJ2ZSgpLm1hcChtID0+IG0uZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcndhcmQoY2hhbm5lbDogQ2hhbm5lbFRvcGljPFREYXRhPikge1xyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZShtID0+IGNoYW5uZWwuZGlzcGF0Y2gobS5kYXRhKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDaGFubmVsIHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBzdWJqZWN0OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihzdWJqZWN0PzogSVN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGU+PiwgdHlwZT86IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnN1YmplY3QgPSBzdWJqZWN0IHx8IG5ldyBSeC5TdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4oKTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YnNjcmliZShvbk5leHQ/OiAodmFsdWU6IE1lc3NhZ2U8U2VyaWFsaXphYmxlPikgPT4gdm9pZCk6IFJ4LklEaXNwb3NhYmxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5zdWJzY3JpYmUob25OZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9ic2VydmUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b3BpYzxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4odHlwZTogc3RyaW5nKSA6IENoYW5uZWxUb3BpYzxURGF0YT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENoYW5uZWxUb3BpYzxURGF0YT4odGhpcy5zdWJqZWN0IGFzIElTdWJqZWN0PE1lc3NhZ2U8VERhdGE+PixcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA/IHRoaXMudHlwZSArICcuJyArIHR5cGUgOiB0eXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVyZ2VUeXBlZDxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4oLi4udG9waWNzOiBDaGFubmVsVG9waWM8VERhdGE+W10pIFxyXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+IHtcclxuICAgICAgICAgICAgY29uc3QgdHlwZXMgPSB0b3BpY3MubWFwKHQgPT4gdC50eXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5maWx0ZXIobSA9PiB0eXBlcy5pbmRleE9mKG0udHlwZSkgPj0gMCApIGFzIFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBtZXJnZSguLi50b3BpY3M6IENoYW5uZWxUb3BpYzxTZXJpYWxpemFibGU+W10pIFxyXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxTZXJpYWxpemFibGU+PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdG9waWNzLm1hcCh0ID0+IHQudHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuZmlsdGVyKG0gPT4gdHlwZXMuaW5kZXhPZihtLnR5cGUpID49IDAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBGc3R4LkZyYW1ld29yayB7XHJcbiAgICBcclxuICAgIGV4cG9ydCBjbGFzcyBXYXRlcm1hcmsge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgX3Byb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBfbWFyazogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX3NjYWxlRmFjdG9yOiBudW1iZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJvamVjdDogcGFwZXIuUHJvamVjdCwgcGF0aDogc3RyaW5nLCBzY2FsZUZhY3RvciA9IDAuMSl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgICAgICAgICAgdGhpcy5fcHJvamVjdC5pbXBvcnRTVkcocGF0aCwgKGltcG9ydGVkOiBwYXBlci5JdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXJrID0gPHBhcGVyLkNvbXBvdW5kUGF0aD5pbXBvcnRlZC5nZXRJdGVtKHtjbGFzczogcGFwZXIuQ29tcG91bmRQYXRofSk7XHJcbiAgICAgICAgICAgICAgICBpZighdGhpcy5fbWFyayl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgbG9hZCBDb21wb3VuZFBhdGggZnJvbSAke3BhdGh9YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXJrLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fc2NhbGVGYWN0b3IgPSBzY2FsZUZhY3RvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcGxhY2VJbnRvKGNvbnRhaW5lcjogcGFwZXIuSXRlbSwgYmFja2dyb3VuZENvbG9yOiBwYXBlci5Db2xvcil7XHJcbiAgICAgICAgICAgIGNvbnN0IHdhdGVybWFya0RpbSA9IE1hdGguc3FydChjb250YWluZXIuYm91bmRzLnNpemUud2lkdGggKiBjb250YWluZXIuYm91bmRzLnNpemUuaGVpZ2h0KSAqIHRoaXMuX3NjYWxlRmFjdG9yO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrLmJvdW5kcy5zaXplID0gbmV3IHBhcGVyLlNpemUod2F0ZXJtYXJrRGltLCB3YXRlcm1hcmtEaW0pO1xyXG4gICAgICAgICAgICAvLyBqdXN0IGluc2lkZSBsb3dlciByaWdodFxyXG4gICAgICAgICAgICB0aGlzLl9tYXJrLnBvc2l0aW9uID0gY29udGFpbmVyLmJvdW5kcy5ib3R0b21SaWdodC5zdWJ0cmFjdCh3YXRlcm1hcmtEaW0gLyAyICsgMSk7XHJcblxyXG4gICAgICAgICAgICBpZihiYWNrZ3JvdW5kQ29sb3IubGlnaHRuZXNzID4gMC40KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcmsuZmlsbENvbG9yID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5vcGFjaXR5ID0gMC4wNTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcmsuZmlsbENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5vcGFjaXR5ID0gMC4yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLl9tYXJrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmVtb3ZlKCl7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmsucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJcclxudHlwZSBEaWN0aW9uYXJ5PFQ+ID0gXy5EaWN0aW9uYXJ5PFQ+O1xyXG4iLCJcclxuY2xhc3MgT2JzZXJ2YWJsZUV2ZW50PFQ+IHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfc3Vic2NyaWJlcnM6ICgoZXZlbnRBcmc6IFQpID0+IHZvaWQpW10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmb3Igbm90aWZpY2F0aW9uLiBSZXR1cm5zIHVuc3Vic2NyaWJlIGZ1bmN0aW9uLlxyXG4gICAgICovICAgIFxyXG4gICAgc3Vic2NyaWJlKGhhbmRsZXI6IChldmVudEFyZzogVCkgPT4gdm9pZCk6ICgoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgaWYodGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyKSA8IDApe1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5wdXNoKGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKCkgPT4gdGhpcy51bnN1YnNjcmliZShoYW5kbGVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdW5zdWJzY3JpYmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoY2FsbGJhY2ssIDApO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9ic2VydmUoKTogUnguT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHVuc3ViOiBhbnk7XHJcbiAgICAgICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybjxUPihcclxuICAgICAgICAgICAgKGhhbmRsZXJUb0FkZCkgPT4gdGhpcy5zdWJzY3JpYmUoPChldmVudEFyZzogVCkgPT4gdm9pZD5oYW5kbGVyVG9BZGQpLFxyXG4gICAgICAgICAgICAoaGFuZGxlclRvUmVtb3ZlKSA9PiB0aGlzLnVuc3Vic2NyaWJlKDwoZXZlbnRBcmc6IFQpID0+IHZvaWQ+aGFuZGxlclRvUmVtb3ZlKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGZvciBvbmUgbm90aWZpY2F0aW9uLlxyXG4gICAgICovXHJcbiAgICBzdWJzY3JpYmVPbmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCl7XHJcbiAgICAgICAgbGV0IHVuc3ViID0gdGhpcy5zdWJzY3JpYmUodCA9PiB7XHJcbiAgICAgICAgICAgIHVuc3ViKCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBub3RpZnkoZXZlbnRBcmc6IFQpe1xyXG4gICAgICAgIGZvcihsZXQgc3Vic2NyaWJlciBvZiB0aGlzLl9zdWJzY3JpYmVycyl7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY2FsbCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIHN1YnNjcmliZXJzLlxyXG4gICAgICovXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG59IiwiXHJcbm5hbWVzcGFjZSBCb290U2NyaXB0IHtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIE1lbnVJdGVtIHtcclxuICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgb3B0aW9ucz86IE9iamVjdFxyXG4gICAgICAgIC8vb25DbGljaz86ICgpID0+IHZvaWRcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZHJvcGRvd24oXHJcbiAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgICBpZDogc3RyaW5nLFxyXG4gICAgICAgICAgICBjb250ZW50OiBhbnksXHJcbiAgICAgICAgICAgIGl0ZW1zOiBNZW51SXRlbVtdXHJcbiAgICAgICAgfSk6IFZOb2RlIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIGgoXCJkaXYuZHJvcGRvd25cIiwgW1xyXG4gICAgICAgICAgICBoKFwiYnV0dG9uLmJ0bi5idG4tZGVmYXVsdC5kcm9wZG93bi10b2dnbGVcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImF0dHJzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFyZ3MuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS10b2dnbGVcIjogXCJkcm9wZG93blwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgYXJncy5jb250ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuLmNhcmV0XCIpXHJcbiAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgaChcInVsLmRyb3Bkb3duLW1lbnVcIixcclxuICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgYXJncy5pdGVtcy5tYXAoaXRlbSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJsaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoJ2EnLCBpdGVtLm9wdGlvbnMgfHwge30sIFtpdGVtLmNvbnRlbnRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG50eXBlIEl0ZW1DaGFuZ2VIYW5kbGVyID0gKGZsYWdzOiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnKSA9PiB2b2lkO1xyXG50eXBlIENhbGxiYWNrID0gKCkgPT4gdm9pZDtcclxuXHJcbmRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSXRlbSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU3Vic2NyaWJlIHRvIGFsbCBjaGFuZ2VzIGluIGl0ZW0uIFJldHVybnMgdW4tc3Vic2NyaWJlIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN1YnNjcmliZShoYW5kbGVyOiBJdGVtQ2hhbmdlSGFuZGxlcik6IENhbGxiYWNrO1xyXG4gICAgICAgIFxyXG4gICAgICAgIF9jaGFuZ2VkKGZsYWdzOiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnKTogdm9pZDtcclxuICAgIH1cclxufVxyXG5cclxubmFtZXNwYWNlIFBhcGVyTm90aWZ5IHtcclxuXHJcbiAgICBleHBvcnQgZW51bSBDaGFuZ2VGbGFnIHtcclxuICAgICAgICAvLyBBbnl0aGluZyBhZmZlY3RpbmcgdGhlIGFwcGVhcmFuY2Ugb2YgYW4gaXRlbSwgaW5jbHVkaW5nIEdFT01FVFJZLFxyXG4gICAgICAgIC8vIFNUUk9LRSwgU1RZTEUgYW5kIEFUVFJJQlVURSAoZXhjZXB0IGZvciB0aGUgaW52aXNpYmxlIG9uZXM6IGxvY2tlZCwgbmFtZSlcclxuICAgICAgICBBUFBFQVJBTkNFID0gMHgxLFxyXG4gICAgICAgIC8vIEEgY2hhbmdlIGluIHRoZSBpdGVtJ3MgY2hpbGRyZW5cclxuICAgICAgICBDSElMRFJFTiA9IDB4MixcclxuICAgICAgICAvLyBBIGNoYW5nZSBvZiB0aGUgaXRlbSdzIHBsYWNlIGluIHRoZSBzY2VuZSBncmFwaCAocmVtb3ZlZCwgaW5zZXJ0ZWQsXHJcbiAgICAgICAgLy8gbW92ZWQpLlxyXG4gICAgICAgIElOU0VSVElPTiA9IDB4NCxcclxuICAgICAgICAvLyBJdGVtIGdlb21ldHJ5IChwYXRoLCBib3VuZHMpXHJcbiAgICAgICAgR0VPTUVUUlkgPSAweDgsXHJcbiAgICAgICAgLy8gT25seSBzZWdtZW50KHMpIGhhdmUgY2hhbmdlZCwgYW5kIGFmZmVjdGVkIGN1cnZlcyBoYXZlIGFscmVhZHkgYmVlblxyXG4gICAgICAgIC8vIG5vdGlmaWVkLiBUaGlzIGlzIHRvIGltcGxlbWVudCBhbiBvcHRpbWl6YXRpb24gaW4gX2NoYW5nZWQoKSBjYWxscy5cclxuICAgICAgICBTRUdNRU5UUyA9IDB4MTAsXHJcbiAgICAgICAgLy8gU3Ryb2tlIGdlb21ldHJ5IChleGNsdWRpbmcgY29sb3IpXHJcbiAgICAgICAgU1RST0tFID0gMHgyMCxcclxuICAgICAgICAvLyBGaWxsIHN0eWxlIG9yIHN0cm9rZSBjb2xvciAvIGRhc2hcclxuICAgICAgICBTVFlMRSA9IDB4NDAsXHJcbiAgICAgICAgLy8gSXRlbSBhdHRyaWJ1dGVzOiB2aXNpYmxlLCBibGVuZE1vZGUsIGxvY2tlZCwgbmFtZSwgb3BhY2l0eSwgY2xpcE1hc2sgLi4uXHJcbiAgICAgICAgQVRUUklCVVRFID0gMHg4MCxcclxuICAgICAgICAvLyBUZXh0IGNvbnRlbnRcclxuICAgICAgICBDT05URU5UID0gMHgxMDAsXHJcbiAgICAgICAgLy8gUmFzdGVyIHBpeGVsc1xyXG4gICAgICAgIFBJWEVMUyA9IDB4MjAwLFxyXG4gICAgICAgIC8vIENsaXBwaW5nIGluIG9uZSBvZiB0aGUgY2hpbGQgaXRlbXNcclxuICAgICAgICBDTElQUElORyA9IDB4NDAwLFxyXG4gICAgICAgIC8vIFRoZSB2aWV3IGhhcyBiZWVuIHRyYW5zZm9ybWVkXHJcbiAgICAgICAgVklFVyA9IDB4ODAwXHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2hvcnRjdXRzIHRvIG9mdGVuIHVzZWQgQ2hhbmdlRmxhZyB2YWx1ZXMgaW5jbHVkaW5nIEFQUEVBUkFOQ0VcclxuICAgIGV4cG9ydCBlbnVtIENoYW5nZXMge1xyXG4gICAgICAgIC8vIENISUxEUkVOIGFsc28gY2hhbmdlcyBHRU9NRVRSWSwgc2luY2UgcmVtb3ZpbmcgY2hpbGRyZW4gZnJvbSBncm91cHNcclxuICAgICAgICAvLyBjaGFuZ2VzIGJvdW5kcy5cclxuICAgICAgICBDSElMRFJFTiA9IENoYW5nZUZsYWcuQ0hJTERSRU4gfCBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIC8vIENoYW5naW5nIHRoZSBpbnNlcnRpb24gY2FuIGNoYW5nZSB0aGUgYXBwZWFyYW5jZSB0aHJvdWdoIHBhcmVudCdzIG1hdHJpeC5cclxuICAgICAgICBJTlNFUlRJT04gPSBDaGFuZ2VGbGFnLklOU0VSVElPTiB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBHRU9NRVRSWSA9IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgU0VHTUVOVFMgPSBDaGFuZ2VGbGFnLlNFR01FTlRTIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBTVFJPS0UgPSBDaGFuZ2VGbGFnLlNUUk9LRSB8IENoYW5nZUZsYWcuU1RZTEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgU1RZTEUgPSBDaGFuZ2VGbGFnLlNUWUxFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIEFUVFJJQlVURSA9IENoYW5nZUZsYWcuQVRUUklCVVRFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIENPTlRFTlQgPSBDaGFuZ2VGbGFnLkNPTlRFTlQgfCBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFBJWEVMUyA9IENoYW5nZUZsYWcuUElYRUxTIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFZJRVcgPSBDaGFuZ2VGbGFnLlZJRVcgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0VcclxuICAgIH07XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gSW5qZWN0IEl0ZW0uc3Vic2NyaWJlXHJcbiAgICAgICAgY29uc3QgaXRlbVByb3RvID0gKDxhbnk+cGFwZXIpLkl0ZW0ucHJvdG90eXBlO1xyXG4gICAgICAgIGl0ZW1Qcm90by5zdWJzY3JpYmUgPSBmdW5jdGlvbihoYW5kbGVyOiBJdGVtQ2hhbmdlSGFuZGxlcik6IENhbGxiYWNrIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9zdWJzY3JpYmVycykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyKSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnB1c2goaGFuZGxlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoaGFuZGxlciwgMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdyYXAgSXRlbS5yZW1vdmVcclxuICAgICAgICBjb25zdCBpdGVtUmVtb3ZlID0gaXRlbVByb3RvLnJlbW92ZTtcclxuICAgICAgICBpdGVtUHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0ZW1SZW1vdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gV3JhcCBQcm9qZWN0Ll9jaGFuZ2VkXHJcbiAgICAgICAgY29uc3QgcHJvamVjdFByb3RvID0gPGFueT5wYXBlci5Qcm9qZWN0LnByb3RvdHlwZTtcclxuICAgICAgICBjb25zdCBwcm9qZWN0Q2hhbmdlZCA9IHByb2plY3RQcm90by5fY2hhbmdlZDtcclxuICAgICAgICBwcm9qZWN0UHJvdG8uX2NoYW5nZWQgPSBmdW5jdGlvbihmbGFnczogQ2hhbmdlRmxhZywgaXRlbTogcGFwZXIuSXRlbSkge1xyXG4gICAgICAgICAgICBwcm9qZWN0Q2hhbmdlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3VicyA9ICg8YW55Pml0ZW0pLl9zdWJzY3JpYmVycztcclxuICAgICAgICAgICAgICAgIGlmIChzdWJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcyBvZiBzdWJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuY2FsbChpdGVtLCBmbGFncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZShmbGFnczogQ2hhbmdlRmxhZykge1xyXG4gICAgICAgIGxldCBmbGFnTGlzdDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBfLmZvck93bihDaGFuZ2VGbGFnLCAodmFsdWUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB2YWx1ZSkgPT09IFwibnVtYmVyXCIgJiYgKHZhbHVlICYgZmxhZ3MpKSB7XHJcbiAgICAgICAgICAgICAgICBmbGFnTGlzdC5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmxhZ0xpc3Quam9pbignIHwgJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlKGl0ZW06IHBhcGVyLkl0ZW0sIGZsYWdzOiBDaGFuZ2VGbGFnKTogXHJcbiAgICAgICAgUnguT2JzZXJ2YWJsZTxDaGFuZ2VGbGFnPiBcclxuICAgIHtcclxuICAgICAgICBsZXQgdW5zdWI6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybjxDaGFuZ2VGbGFnPihcclxuICAgICAgICAgICAgYWRkSGFuZGxlciA9PiB7XHJcbiAgICAgICAgICAgICAgICB1bnN1YiA9IGl0ZW0uc3Vic2NyaWJlKGYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGYgJiBmbGFncyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEhhbmRsZXIoZik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICByZW1vdmVIYW5kbGVyID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHVuc3ViKXtcclxuICAgICAgICAgICAgICAgICAgICB1bnN1YigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblBhcGVyTm90aWZ5LmluaXRpYWxpemUoKTtcclxuIiwiZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgaW50ZXJmYWNlIFZpZXcge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEludGVybmFsIG1ldGhvZCBmb3IgaW5pdGlhdGluZyBtb3VzZSBldmVudHMgb24gdmlldy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBlbWl0TW91c2VFdmVudHModmlldzogcGFwZXIuVmlldywgaXRlbTogcGFwZXIuSXRlbSwgdHlwZTogc3RyaW5nLFxyXG4gICAgICAgICAgICBldmVudDogYW55LCBwb2ludDogcGFwZXIuUG9pbnQsIHByZXZQb2ludDogcGFwZXIuUG9pbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5uYW1lc3BhY2UgcGFwZXJFeHQge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBWaWV3Wm9vbSB7XHJcblxyXG4gICAgICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcbiAgICAgICAgZmFjdG9yID0gMS4yNTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfbWluWm9vbTogbnVtYmVyO1xyXG4gICAgICAgIHByaXZhdGUgX21heFpvb206IG51bWJlcjtcclxuICAgICAgICBwcml2YXRlIF9tb3VzZU5hdGl2ZVN0YXJ0OiBwYXBlci5Qb2ludDtcclxuICAgICAgICBwcml2YXRlIF92aWV3Q2VudGVyU3RhcnQ6IHBhcGVyLlBvaW50O1xyXG4gICAgICAgIHByaXZhdGUgX3ZpZXdDaGFuZ2VkID0gbmV3IE9ic2VydmFibGVFdmVudDxwYXBlci5SZWN0YW5nbGU+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByb2plY3Q6IHBhcGVyLlByb2plY3QpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuXHJcbiAgICAgICAgICAgICg8YW55PiQodGhpcy5wcm9qZWN0LnZpZXcuZWxlbWVudCkpLm1vdXNld2hlZWwoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtb3VzZVBvc2l0aW9uID0gbmV3IHBhcGVyLlBvaW50KGV2ZW50Lm9mZnNldFgsIGV2ZW50Lm9mZnNldFkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2Vab29tQ2VudGVyZWQoZXZlbnQuZGVsdGFZLCBtb3VzZVBvc2l0aW9uKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGlkRHJhZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0LnZpZXcub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlRHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGl0ID0gcHJvamVjdC5oaXRUZXN0KGV2LnBvaW50KTtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fdmlld0NlbnRlclN0YXJ0KSB7ICAvLyBub3QgYWxyZWFkeSBkcmFnZ2luZ1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChoaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG9uJ3Qgc3RhcnQgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2VudGVyU3RhcnQgPSB2aWV3LmNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICAvLyBIYXZlIHRvIHVzZSBuYXRpdmUgbW91c2Ugb2Zmc2V0LCBiZWNhdXNlIGV2LmRlbHRhIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICBjaGFuZ2VzIGFzIHRoZSB2aWV3IGlzIHNjcm9sbGVkLlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQgPSBuZXcgcGFwZXIuUG9pbnQoZXYuZXZlbnQub2Zmc2V0WCwgZXYuZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5lbWl0KHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdTdGFydCwgZXYpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYXRpdmVEZWx0YSA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXYuZXZlbnQub2Zmc2V0WCAtIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXYuZXZlbnQub2Zmc2V0WSAtIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQueVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTW92ZSBpbnRvIHZpZXcgY29vcmRpbmF0ZXMgdG8gc3VicmFjdCBkZWx0YSxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgdGhlbiBiYWNrIGludG8gcHJvamVjdCBjb29yZHMuXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LnZpZXdUb1Byb2plY3QoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcucHJvamVjdFRvVmlldyh0aGlzLl92aWV3Q2VudGVyU3RhcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3VidHJhY3QobmF0aXZlRGVsdGEpKTtcclxuICAgICAgICAgICAgICAgICAgICBkaWREcmFnID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByb2plY3Qudmlldy5vbihwYXBlci5FdmVudFR5cGUubW91c2VVcCwgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21vdXNlTmF0aXZlU3RhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZU5hdGl2ZVN0YXJ0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2VudGVyU3RhcnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnRW5kLCBldik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpZERyYWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlld0NoYW5nZWQubm90aWZ5KHZpZXcuYm91bmRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlkRHJhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdmlld0NoYW5nZWQoKTogT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlJlY3RhbmdsZT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmlld0NoYW5nZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgem9vbSgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qZWN0LnZpZXcuem9vbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB6b29tUmFuZ2UoKTogbnVtYmVyW10ge1xyXG4gICAgICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0Wm9vbVJhbmdlKHJhbmdlOiBwYXBlci5TaXplW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICAgICAgY29uc3QgYVNpemUgPSByYW5nZS5zaGlmdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBiU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBhU2l6ZSAmJiBNYXRoLm1pbihcclxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIGFTaXplLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYVNpemUud2lkdGgpO1xyXG4gICAgICAgICAgICBjb25zdCBiID0gYlNpemUgJiYgTWF0aC5taW4oXHJcbiAgICAgICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBiU2l6ZS5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGJTaXplLndpZHRoKTtcclxuICAgICAgICAgICAgY29uc3QgbWluID0gTWF0aC5taW4oYSwgYik7XHJcbiAgICAgICAgICAgIGlmIChtaW4pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21pblpvb20gPSBtaW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoYSwgYik7XHJcbiAgICAgICAgICAgIGlmIChtYXgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21heFpvb20gPSBtYXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFt0aGlzLl9taW5ab29tLCB0aGlzLl9tYXhab29tXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHpvb21UbyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpIHtcclxuICAgICAgICAgICAgaWYocmVjdC5pc0VtcHR5KCkgfHwgcmVjdC53aWR0aCA9PT0gMCB8fCByZWN0LmhlaWdodCA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJza2lwcGluZyB6b29tIHRvXCIsIHJlY3QpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICAgICAgdmlldy5jZW50ZXIgPSByZWN0LmNlbnRlcjtcclxuICAgICAgICAgICAgY29uc3Qgem9vbUxldmVsID0gTWF0aC5taW4oXHJcbiAgICAgICAgICAgICAgICB2aWV3LnZpZXdTaXplLmhlaWdodCAvIHJlY3QuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgdmlldy52aWV3U2l6ZS53aWR0aCAvIHJlY3Qud2lkdGgpO1xyXG4gICAgICAgICAgICB2aWV3Lnpvb20gPSB6b29tTGV2ZWw7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXdDaGFuZ2VkLm5vdGlmeSh2aWV3LmJvdW5kcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFuZ2Vab29tQ2VudGVyZWQoZGVsdGE6IG51bWJlciwgbW91c2VQb3M6IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgICAgIGlmICghZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgICAgIGNvbnN0IG9sZFpvb20gPSB2aWV3Lnpvb207XHJcbiAgICAgICAgICAgIGNvbnN0IG9sZENlbnRlciA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgICAgICBjb25zdCB2aWV3UG9zID0gdmlldy52aWV3VG9Qcm9qZWN0KG1vdXNlUG9zKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdab29tID0gZGVsdGEgPiAwXHJcbiAgICAgICAgICAgICAgICA/IHZpZXcuem9vbSAqIHRoaXMuZmFjdG9yXHJcbiAgICAgICAgICAgICAgICA6IHZpZXcuem9vbSAvIHRoaXMuZmFjdG9yO1xyXG4gICAgICAgICAgICBuZXdab29tID0gdGhpcy5zZXRab29tQ29uc3RyYWluZWQobmV3Wm9vbSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5ld1pvb20pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgem9vbVNjYWxlID0gb2xkWm9vbSAvIG5ld1pvb207XHJcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlckFkanVzdCA9IHZpZXdQb3Muc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gdmlld1Bvcy5zdWJ0cmFjdChjZW50ZXJBZGp1c3QubXVsdGlwbHkoem9vbVNjYWxlKSlcclxuICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChvbGRDZW50ZXIpO1xyXG5cclxuICAgICAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LmNlbnRlci5hZGQob2Zmc2V0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXdDaGFuZ2VkLm5vdGlmeSh2aWV3LmJvdW5kcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2V0IHpvb20gbGV2ZWwuXHJcbiAgICAgICAgICogQHJldHVybnMgem9vbSBsZXZlbCB0aGF0IHdhcyBzZXQsIG9yIG51bGwgaWYgaXQgd2FzIG5vdCBjaGFuZ2VkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRab29tQ29uc3RyYWluZWQoem9vbTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX21pblpvb20pIHtcclxuICAgICAgICAgICAgICAgIHpvb20gPSBNYXRoLm1heCh6b29tLCB0aGlzLl9taW5ab29tKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fbWF4Wm9vbSkge1xyXG4gICAgICAgICAgICAgICAgem9vbSA9IE1hdGgubWluKHpvb20sIHRoaXMuX21heFpvb20pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICAgICAgaWYgKHpvb20gIT0gdmlldy56b29tKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3Lnpvb20gPSB6b29tO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHpvb207XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBwYXBlckV4dCB7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogVXNlIG9mIHRoZXNlIGV2ZW50cyByZXF1aXJlcyBmaXJzdCBjYWxsaW5nIGV4dGVuZE1vdXNlRXZlbnRzXHJcbiAgICAgKiAgIG9uIHRoZSBpdGVtLiBcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IHZhciBFdmVudFR5cGUgPSB7XHJcbiAgICAgICAgbW91c2VEcmFnU3RhcnQ6IFwibW91c2VEcmFnU3RhcnRcIixcclxuICAgICAgICBtb3VzZURyYWdFbmQ6IFwibW91c2VEcmFnRW5kXCJcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZXh0ZW5kTW91c2VFdmVudHMoaXRlbTogcGFwZXIuSXRlbSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaXRlbS5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFkcmFnZ2luZyl7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ1N0YXJ0LCBldik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZVVwLCBldiA9PiB7XHJcbiAgICAgICAgICAgIGlmKGRyYWdnaW5nKXtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ0VuZCwgZXYpO1xyXG4gICAgICAgICAgICAgICAgLy8gcHJldmVudCBjbGlja1xyXG4gICAgICAgICAgICAgICAgZXYuc3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJcclxubW9kdWxlIHBhcGVyIHtcclxuXHJcbiAgICBleHBvcnQgdmFyIEV2ZW50VHlwZSA9IHtcclxuICAgICAgICBmcmFtZTogXCJmcmFtZVwiLFxyXG4gICAgICAgIG1vdXNlRG93bjogXCJtb3VzZWRvd25cIixcclxuICAgICAgICBtb3VzZVVwOiBcIm1vdXNldXBcIixcclxuICAgICAgICBtb3VzZURyYWc6IFwibW91c2VkcmFnXCIsXHJcbiAgICAgICAgY2xpY2s6IFwiY2xpY2tcIixcclxuICAgICAgICBkb3VibGVDbGljazogXCJkb3VibGVjbGlja1wiLFxyXG4gICAgICAgIG1vdXNlTW92ZTogXCJtb3VzZW1vdmVcIixcclxuICAgICAgICBtb3VzZUVudGVyOiBcIm1vdXNlZW50ZXJcIixcclxuICAgICAgICBtb3VzZUxlYXZlOiBcIm1vdXNlbGVhdmVcIixcclxuICAgICAgICBrZXl1cDogXCJrZXl1cFwiLFxyXG4gICAgICAgIGtleWRvd246IFwia2V5ZG93blwiXHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmFic3RyYWN0IGNsYXNzIENvbXBvbmVudDxUPiB7XHJcbiAgICBhYnN0cmFjdCByZW5kZXIoZGF0YTogVCk6IFZOb2RlO1xyXG59IiwiXHJcbmludGVyZmFjZSBSZWFjdGl2ZURvbUNvbXBvbmVudCB7XHJcbiAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPjtcclxufVxyXG5cclxubmFtZXNwYWNlIFZEb21IZWxwZXJzIHtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiByZW5kZXJBc0NoaWxkKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHZub2RlOiBWTm9kZSkge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBjb25zdCBwYXRjaGVkID0gcGF0Y2goY2hpbGQsIHZub2RlKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGF0Y2hlZC5lbG0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWFjdGl2ZURvbSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSByZWFjdGl2ZSBjb21wb25lbnQgd2l0aGluIGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlclN0cmVhbShcclxuICAgICAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPixcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50XHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBjb250YWluZXIuaWQ7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQ6IEhUTUxFbGVtZW50IHwgVk5vZGUgPSBjb250YWluZXI7XHJcbiAgICAgICAgY29uc3Qgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGRvbSQuc3Vic2NyaWJlKGRvbSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZG9tKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUVtcHR5Tm9kZXMoZG9tKTtcclxuICAgICAgICAgICAgbGV0IHBhdGNoZWQ6IFZOb2RlO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcGF0Y2hlZCA9IHBhdGNoKGN1cnJlbnQsIGRvbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIHBhdGNoaW5nIGRvbVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudCxcclxuICAgICAgICAgICAgICAgICAgICBkb20sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaWQgJiYgIXBhdGNoZWQuZWxtLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyByZXRhaW4gSURcclxuICAgICAgICAgICAgICAgIHBhdGNoZWQuZWxtLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaGVkO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmVseSByZW1vdmUgZW1wdHkgY2hpbGRyZW4gZnJvbSB0cmVlLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVtb3ZlRW1wdHlOb2Rlcyhub2RlOiBWTm9kZSkge1xyXG4gICAgICAgIGlmKCFub2RlLmNoaWxkcmVuIHx8ICFub2RlLmNoaWxkcmVuLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgbm90RW1wdHkgPSBub2RlLmNoaWxkcmVuLmZpbHRlcihjID0+ICEhYyk7XHJcbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoICE9IG5vdEVtcHR5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJyZW1vdmVkIGVtcHR5IGNoaWxkcmVuIGZyb21cIiwgbm9kZS5jaGlsZHJlbik7XHJcbiAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4gPSBub3RFbXB0eTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRW1wdHlOb2RlcyhjaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIGEgcmVhY3RpdmUgY29tcG9uZW50IHdpdGhpbiBjb250YWluZXIuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXJDb21wb25lbnQoXHJcbiAgICAgICAgY29tcG9uZW50OiBSZWFjdGl2ZURvbUNvbXBvbmVudCxcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50IHwgVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGNvbXBvbmVudC5kb20kLnN1YnNjcmliZShkb20gPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWRvbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIHdpdGhpbiBjb250YWluZXIgd2hlbmV2ZXIgc291cmNlIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsaXZlUmVuZGVyPFQ+KFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZSxcclxuICAgICAgICBzb3VyY2U6IFJ4Lk9ic2VydmFibGU8VD4sXHJcbiAgICAgICAgcmVuZGVyOiAobmV4dDogVCkgPT4gVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gcmVuZGVyKGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHJldHVybjtcclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoKGN1cnJlbnQsIG5vZGUpO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbm5hbWVzcGFjZSBBcHAge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBcHBDb29raWVzIHtcclxuXHJcbiAgICAgICAgc3RhdGljIFlFQVIgPSAzNjU7XHJcbiAgICAgICAgc3RhdGljIEJST1dTRVJfSURfS0VZID0gXCJicm93c2VySWRcIjtcclxuICAgICAgICBzdGF0aWMgTEFTVF9TQVZFRF9TS0VUQ0hfSURfS0VZID0gXCJsYXN0U2F2ZWRTa2V0Y2hJZFwiO1xyXG5cclxuICAgICAgICBnZXQgbGFzdFNhdmVkU2tldGNoSWQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzLmdldChBcHBDb29raWVzLkxBU1RfU0FWRURfU0tFVENIX0lEX0tFWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgbGFzdFNhdmVkU2tldGNoSWQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBDb29raWVzLnNldChBcHBDb29raWVzLkxBU1RfU0FWRURfU0tFVENIX0lEX0tFWSwgdmFsdWUsIHsgZXhwaXJlczogQXBwQ29va2llcy5ZRUFSIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGJyb3dzZXJJZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXMuZ2V0KEFwcENvb2tpZXMuQlJPV1NFUl9JRF9LRVkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGJyb3dzZXJJZCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIENvb2tpZXMuc2V0KEFwcENvb2tpZXMuQlJPV1NFUl9JRF9LRVksIHZhbHVlLCB7IGV4cGlyZXM6IEFwcENvb2tpZXMuWUVBUiB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBBcHAge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBcHBNb2R1bGUge1xyXG5cclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgZWRpdG9yTW9kdWxlOiBTa2V0Y2hFZGl0b3IuU2tldGNoRWRpdG9yTW9kdWxlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgICAgIFBhcGVySGVscGVycy5zaG91bGRMb2dJbmZvID0gZmFsc2U7ICAgICAgIFxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IG5ldyBTdG9yZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRvck1vZHVsZSA9IG5ldyBTa2V0Y2hFZGl0b3IuU2tldGNoRWRpdG9yTW9kdWxlKHRoaXMuc3RvcmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzdGFydCgpIHsgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmVkaXRvck1vZHVsZS5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5pbnRlcmZhY2UgV2luZG93IHtcclxuICAgIGFwcDogQXBwLkFwcE1vZHVsZTtcclxufSIsIlxyXG5uYW1lc3BhY2UgQXBwIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQXBwUm91dGVyIGV4dGVuZHMgUm91dGVyNSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcihbXHJcbiAgICAgICAgICAgICAgICBuZXcgUm91dGVOb2RlKFwiaG9tZVwiLCBcIi9cIiksXHJcbiAgICAgICAgICAgICAgICBuZXcgUm91dGVOb2RlKFwic2tldGNoXCIsIFwiL3NrZXRjaC86c2tldGNoSWRcIiksIC8vIDxbYS1mQS1GMC05XXsxNH0+XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlSGFzaDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFJvdXRlOiBcImhvbWVcIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvL3RoaXMudXNlUGx1Z2luKGxvZ2dlclBsdWdpbigpKVxyXG4gICAgICAgICAgICB0aGlzLnVzZVBsdWdpbihsaXN0ZW5lcnNQbHVnaW4uZGVmYXVsdCgpKVxyXG4gICAgICAgICAgICAgICAgLnVzZVBsdWdpbihoaXN0b3J5UGx1Z2luLmRlZmF1bHQoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b1NrZXRjaEVkaXRvcihza2V0Y2hJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGUoXCJza2V0Y2hcIiwgeyBza2V0Y2hJZDogc2tldGNoSWQgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgc3RhdGUoKSB7XHJcbiAgICAgICAgICAgIC8vIGNvdWxkIGRvIHJvdXRlIHZhbGlkYXRpb24gc29tZXdoZXJlXHJcbiAgICAgICAgICAgIHJldHVybiA8QXBwUm91dGVTdGF0ZT48YW55PnRoaXMuZ2V0U3RhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBBcHBSb3V0ZVN0YXRlIHtcclxuICAgICAgICBuYW1lOiBcImhvbWVcInxcInNrZXRjaFwiLFxyXG4gICAgICAgIHBhcmFtcz86IHtcclxuICAgICAgICAgICAgc2tldGNoSWQ/OiBzdHJpbmdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBhdGg/OiBzdHJpbmdcclxuICAgIH1cclxuXHJcbn0iLCJcclxubmFtZXNwYWNlIEFwcCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN0b3JlIHtcclxuXHJcbiAgICAgICAgc3RhdGU6IEFwcFN0YXRlO1xyXG4gICAgICAgIGFjdGlvbnM6IEFjdGlvbnM7XHJcbiAgICAgICAgZXZlbnRzOiBFdmVudHM7XHJcblxyXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBBcHBSb3V0ZXI7XHJcbiAgICAgICAgcHJpdmF0ZSBjb29raWVzOiBBcHBDb29raWVzO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIgPSBuZXcgQXBwUm91dGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IG5ldyBBY3Rpb25zKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IEV2ZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMgPSBuZXcgQXBwQ29va2llcygpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5zdGFydFJvdXRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRBY3Rpb25IYW5kbGVycygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdFN0YXRlKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gbmV3IEFwcFN0YXRlKHRoaXMuY29va2llcywgdGhpcy5yb3V0ZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpbml0QWN0aW9uSGFuZGxlcnMoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5lZGl0b3JMb2FkZWRTa2V0Y2guc3ViKHNrZXRjaElkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwic2tldGNoXCIsIHsgc2tldGNoSWQgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLmVkaXRvclNhdmVkU2tldGNoLnN1YihpZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvb2tpZXMubGFzdFNhdmVkU2tldGNoSWQgPSBpZDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3RhcnRSb3V0ZXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyLnN0YXJ0KChlcnIsIHN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5yb3V0ZUNoYW5nZWQuZGlzcGF0Y2goc3RhdGUpOyBcclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJyb3V0ZXIgZXJyb3JcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcImhvbWVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFwcFN0YXRlIHtcclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIGNvb2tpZXM6IEFwcENvb2tpZXM7XHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IEFwcFJvdXRlcjsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29va2llczogQXBwQ29va2llcywgcm91dGVyOiBBcHBSb3V0ZXIpe1xyXG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMgPSBjb29raWVzO1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlciA9IHJvdXRlcjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGJyb3dzZXJJZCA9IHRoaXMuY29va2llcy5icm93c2VySWQgfHwgRnJhbWV3b3JrLm5ld2lkKCk7XHJcbiAgICAgICAgICAgIC8vIGluaXQgb3IgcmVmcmVzaCBjb29raWVcclxuICAgICAgICAgICAgdGhpcy5jb29raWVzLmJyb3dzZXJJZCA9IGJyb3dzZXJJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0IGxhc3RTYXZlZFNrZXRjaElkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb29raWVzLmxhc3RTYXZlZFNrZXRjaElkOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0IGJyb3dzZXJJZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29va2llcy5icm93c2VySWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdldCByb3V0ZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm91dGVyLnN0YXRlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQWN0aW9ucyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcclxuICAgICAgICBlZGl0b3JMb2FkZWRTa2V0Y2ggPSB0aGlzLnRvcGljPHN0cmluZz4oXCJlZGl0b3JMb2FkZWRTa2V0Y2hcIik7XHJcbiAgICAgICAgZWRpdG9yU2F2ZWRTa2V0Y2ggPSB0aGlzLnRvcGljPHN0cmluZz4oXCJlZGl0b3JTYXZlZFNrZXRjaFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRXZlbnRzIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWwge1xyXG4gICAgICAgIHJvdXRlQ2hhbmdlZCA9IHRoaXMudG9waWM8QXBwUm91dGVTdGF0ZT4oXCJyb3V0ZUNoYW5nZWRcIik7XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIERlbW8ge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEZW1vTW9kdWxlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG5cclxuICAgICAgICAgICAgcGFwZXIuc2V0dXAoY2FudmFzKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGFydCgpIHtcclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHBhcGVyLnZpZXc7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYXJzZWRGb250cyA9IG5ldyBGb250U2hhcGUuUGFyc2VkRm9udHMoKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgcGFyc2VkRm9udHMuZ2V0KFwiZm9udHMvUm9ib3RvLTUwMC50dGZcIikudGhlbiggcGFyc2VkID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBwYXJzZWQuZm9udC5nZXRQYXRoKFwiU05BUFwiLCAwLCAwLCAxMjgpLnRvUGF0aERhdGEoKTtcclxuICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgY29udGVudC5wb3NpdGlvbiA9IGNvbnRlbnQucG9zaXRpb24uYWRkKDUwKTtcclxuICAgICAgICAgICAgICAgICBjb250ZW50LmZpbGxDb2xvciA9IFwibGlnaHRncmF5XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gcGFwZXIuUGF0aC5FbGxpcHNlKG5ldyBwYXBlci5SZWN0YW5nbGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsMCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNpemUoNjAwLCAzMDApXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbi5yb3RhdGUoMzApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZWdpb24uYm91bmRzLmNlbnRlciA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgcmVnaW9uLnN0cm9rZUNvbG9yID0gXCJsaWdodGdyYXlcIjtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbi5zdHJva2VXaWR0aCA9IDM7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc25hcFBhdGggPSBuZXcgRm9udFNoYXBlLlNuYXBQYXRoKHJlZ2lvbiwgY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICBzbmFwUGF0aC5jb3JuZXJzID0gWzAsIDAuNCwgMC40NSwgMC45NV07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZpZXcub25GcmFtZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzbmFwUGF0aC5zbGlkZSgwLjAwMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc25hcFBhdGgudXBkYXRlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2aWV3LmRyYXcoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBCdWlsZGVyIHtcclxuXHJcbiAgICAgICAgc3RhdGljIGRlZmF1bHRGb250VXJsID0gXCJmb250cy9Sb2JvdG8tNTAwLnR0ZlwiO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSA8VGVtcGxhdGVVSUNvbnRleHQ+e1xyXG4gICAgICAgICAgICAgICAgZ2V0IGZvbnRDYXRhbG9nKCkgeyByZXR1cm4gc3RvcmUuZm9udENhdGFsb2cgfSxcclxuICAgICAgICAgICAgICAgIHJlbmRlckRlc2lnbjogKGRlc2lnbiwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5yZW5kZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNpZ246IGRlc2lnbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVGb250Q2hvb3NlcjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVGVtcGxhdGVGb250Q2hvb3NlcihzdG9yZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGFzeW5jIG9ic2VydmVcclxuICAgICAgICAgICAgc3RvcmUudGVtcGxhdGUkLm9ic2VydmVPbihSeC5TY2hlZHVsZXIuZGVmYXVsdCkuc3Vic2NyaWJlKHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudENvbnRlbnQgPSBzdG9yZS5kZXNpZ24uY29udGVudDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RlbXBsYXRlU3RhdGUgPSB0LmNyZWF0ZU5ldyhjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Q29udGVudCAmJiBjdXJyZW50Q29udGVudC50ZXh0ICYmIGN1cnJlbnRDb250ZW50LnRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VGVtcGxhdGVTdGF0ZS5kZXNpZ24uY29udGVudCA9IGN1cnJlbnRDb250ZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RvcmUuc2V0VGVtcGxhdGVTdGF0ZShuZXdUZW1wbGF0ZVN0YXRlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkb20kID0gc3RvcmUudGVtcGxhdGVTdGF0ZSRcclxuICAgICAgICAgICAgICAgIC5tYXAodHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250cm9scztcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9scyA9IHN0b3JlLnRlbXBsYXRlLmNyZWF0ZVVJKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGNhbGxpbmcgJHtzdG9yZS50ZW1wbGF0ZS5uYW1lfS5jcmVhdGVVSWAsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY29udHJvbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy52YWx1ZSQuc3Vic2NyaWJlKGQgPT4gc3RvcmUudXBkYXRlVGVtcGxhdGVTdGF0ZShkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVzID0gY29udHJvbHMubWFwKGMgPT4gYy5jcmVhdGVOb2RlKHRzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdm5vZGUgPSBoKFwiZGl2I3RlbXBsYXRlQ29udHJvbHNcIiwge30sIG5vZGVzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm5vZGU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBNb2R1bGUge1xyXG4gICAgICAgIHN0b3JlOiBTdG9yZTtcclxuICAgICAgICBidWlsZGVyOiBCdWlsZGVyO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgYnVpbGRlckNvbnRhaW5lcjogSFRNTEVsZW1lbnQsXHJcbiAgICAgICAgICAgIHByZXZpZXdDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxyXG4gICAgICAgICAgICByZW5kZXJDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxyXG4gICAgICAgICAgICBiZWxvd0NhbnZhczogSFRNTEVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoKTtcclxuICAgICAgICAgICAgdGhpcy5idWlsZGVyID0gbmV3IEJ1aWxkZXIoYnVpbGRlckNvbnRhaW5lciwgdGhpcy5zdG9yZSk7XHJcblxyXG4gICAgICAgICAgICBuZXcgUHJldmlld0NhbnZhcyhwcmV2aWV3Q2FudmFzLCB0aGlzLnN0b3JlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUudGVtcGxhdGVTdGF0ZSQuc3Vic2NyaWJlKHRzID0+IGNvbnNvbGUubG9nKFwidGVtcGxhdGVTdGF0ZVwiLCB0cykpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnRlbXBsYXRlJC5zdWJzY3JpYmUodCA9PiBjb25zb2xlLmxvZyhcInRlbXBsYXRlXCIsIHQpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIG5ldyBTaGFyZU9wdGlvbnNVSShiZWxvd0NhbnZhcywgdGhpcy5zdG9yZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGFydCgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5pbml0KCkudGhlbihzID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuc2V0VGVtcGxhdGUoXCJEaWNrZW5zXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGVUZW1wbGF0ZVN0YXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHsgZGVzaWduOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlRoZSByYWluIGluIFNwYWluIGZhbGxzIG1haW5seSBpbiB0aGUgcGxhaW5cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFByZXZpZXdDYW52YXMge1xyXG5cclxuICAgICAgICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgIHN0b3JlOiBTdG9yZTtcclxuICAgICAgICBidWlsdERlc2lnbjogcGFwZXIuSXRlbTtcclxuICAgICAgICBjb250ZXh0OiBUZW1wbGF0ZUJ1aWxkQ29udGV4dDtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsYXN0UmVjZWl2ZWQ6IERlc2lnbjtcclxuICAgICAgICBwcml2YXRlIHJlbmRlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuICAgICAgICBwcml2YXRlIHdvcmtzcGFjZTogcGFwZXIuR3JvdXA7XHJcbiAgICAgICAgcHJpdmF0ZSBtYXJrOiBGc3R4LkZyYW1ld29yay5XYXRlcm1hcms7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcblxyXG4gICAgICAgICAgICBwYXBlci5zZXR1cChjYW52YXMpO1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3QgPSBwYXBlci5wcm9qZWN0O1xyXG4gICAgICAgICAgICB0aGlzLndvcmtzcGFjZSA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG5cclxuICAgICAgICAgICAgRm9udFNoYXBlLlZlcnRpY2FsQm91bmRzU3RyZXRjaFBhdGgucG9pbnRzUGVyUGF0aCA9IDQwMDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgIGdldEZvbnQ6IHNwZWNpZmllciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVybDogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3BlY2lmaWVyIHx8ICFzcGVjaWZpZXIuZmFtaWx5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IEJ1aWxkZXIuZGVmYXVsdEZvbnRVcmw7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gc3RvcmUuZm9udENhdGFsb2cuZ2V0VXJsKHNwZWNpZmllci5mYW1pbHksIHNwZWNpZmllci52YXJpYW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgQnVpbGRlci5kZWZhdWx0Rm9udFVybDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLnBhcnNlZEZvbnRzLmdldCh1cmwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQuZm9udCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1hcmsgPSBuZXcgRnN0eC5GcmFtZXdvcmsuV2F0ZXJtYXJrKHRoaXMucHJvamVjdCwgXCJpbWcvc3BpcmFsLWxvZ28uc3ZnXCIsIDAuMDYpO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUudGVtcGxhdGVTdGF0ZSQuc3Vic2NyaWJlKCh0czogVGVtcGxhdGVTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gb25seSBwcm9jZXNzIG9uZSByZXF1ZXN0IGF0IGEgdGltZVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWx3YXlzIHByb2Nlc3MgdGhlIGxhc3QgcmVjZWl2ZWRcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RSZWNlaXZlZCA9IHRzLmRlc2lnbjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIodHMuZGVzaWduKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZG93bmxvYWRQTkdSZXF1ZXN0ZWQuc3ViKHBpeGVscyA9PiB0aGlzLmRvd25sb2FkUE5HKHBpeGVscykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkb3dubG9hZFBORyhwaXhlbHM6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RvcmUuZGVzaWduLmNvbnRlbnQgXHJcbiAgICAgICAgICAgICAgICB8fCAhdGhpcy5zdG9yZS5kZXNpZ24uY29udGVudC50ZXh0IFxyXG4gICAgICAgICAgICAgICAgfHwgIXRoaXMuc3RvcmUuZGVzaWduLmNvbnRlbnQudGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gdmVyeSBmcmFnaWxlIHdheSB0byBnZXQgYmcgY29sb3JcclxuICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLndvcmtzcGFjZS5nZXRJdGVtKHtjbGFzczogcGFwZXIuU2hhcGUgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJnQ29sb3IgPSA8cGFwZXIuQ29sb3I+c2hhcGUuZmlsbENvbG9yO1xyXG4gICAgICAgICAgICB0aGlzLm1hcmsucGxhY2VJbnRvKHRoaXMud29ya3NwYWNlLCBiZ0NvbG9yKTsgICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIEhhbGYgb2YgbWF4IERQSSBwcm9kdWNlcyBhcHByb3ggNDIwMHg0MjAwLlxyXG4gICAgICAgICAgICBjb25zdCBkcGkgPSAwLjUgKiBQYXBlckhlbHBlcnMuZ2V0RXhwb3J0RHBpKHRoaXMud29ya3NwYWNlLmJvdW5kcy5zaXplLCBwaXhlbHMpO1xyXG4gICAgICAgICAgICBjb25zdCByYXN0ZXIgPSB0aGlzLndvcmtzcGFjZS5yYXN0ZXJpemUoZHBpLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByYXN0ZXIudG9EYXRhVVJMKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gRnN0eC5GcmFtZXdvcmsuY3JlYXRlRmlsZU5hbWUodGhpcy5zdG9yZS5kZXNpZ24uY29udGVudC50ZXh0LCA0MCwgXCJwbmdcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBEb21IZWxwZXJzLmRhdGFVUkxUb0Jsb2IoZGF0YSk7XHJcbiAgICAgICAgICAgIHNhdmVBcyhibG9iLCBmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLm1hcmsucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHJlbmRlckxhc3RSZWNlaXZlZCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubGFzdFJlY2VpdmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZW5kZXJpbmcgPSB0aGlzLmxhc3RSZWNlaXZlZDtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdFJlY2VpdmVkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHJlbmRlcmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVuZGVyKGRlc2lnbjogRGVzaWduKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmluZykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVuZGVyIGlzIGluIHByb2dyZXNzXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLndvcmtzcGFjZSA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS50ZW1wbGF0ZS5idWlsZChkZXNpZ24sIHRoaXMuY29udGV4dCkudGhlbihpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gcmVuZGVyIHJlc3VsdCBmcm9tXCIsIGRlc2lnbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZml0Qm91bmRzKHRoaXMucHJvamVjdC52aWV3LmJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5ib3VuZHMucG9pbnQgPSB0aGlzLnByb2plY3Qudmlldy5ib3VuZHMudG9wTGVmdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmtzcGFjZS5hZGRDaGlsZChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaGFuZGxlIGFueSByZWNlaXZlZCB3aGlsZSByZW5kZXJpbmcgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckxhc3RSZWNlaXZlZCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcmVuZGVyaW5nIGRlc2lnblwiLCBlcnIsIGRlc2lnbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0iLCIvLyBuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4vLyAgICAgZXhwb3J0IGNsYXNzIFJlbmRlckNhbnZhcyB7XHJcblxyXG4vLyAgICAgICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbi8vICAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG4vLyAgICAgICAgIGJ1aWx0RGVzaWduOiBwYXBlci5JdGVtO1xyXG5cclxuLy8gICAgICAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuLy8gICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4vLyAgICAgICAgICAgICBwYXBlci5zZXR1cChjYW52YXMpO1xyXG4gICAgICAgICAgICBcclxuLy8gICAgICAgICAgICAgY29uc3QgY29udGV4dCA9IHtcclxuLy8gICAgICAgICAgICAgICAgIGdldEZvbnQ6IHNwZWNpZmllciA9PiB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgbGV0IHVybDogc3RyaW5nO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGlmICghc3BlY2lmaWVyIHx8ICFzcGVjaWZpZXIuZmFtaWx5KSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IEJ1aWxkZXIuZGVmYXVsdEZvbnRVcmw7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gc3RvcmUuZm9udENhdGFsb2cuZ2V0VXJsKHNwZWNpZmllci5mYW1pbHksIHNwZWNpZmllci52YXJpYW50KVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgQnVpbGRlci5kZWZhdWx0Rm9udFVybDtcclxuLy8gICAgICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLnBhcnNlZEZvbnRzLmdldCh1cmwpXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQuZm9udCk7XHJcbi8vICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgIH07XHJcblxyXG4vLyAgICAgICAgICAgICBjb25zdCBjb250cm9sbGVkID0gc3RvcmUucmVuZGVyJC5jb250cm9sbGVkKCk7XHJcbi8vICAgICAgICAgICAgIGNvbnRyb2xsZWQuc3Vic2NyaWJlKHJlcXVlc3QgPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgbGV0IGRlc2lnbiA9IDxEZXNpZ24+Xy5jbG9uZSh0aGlzLnN0b3JlLmRlc2lnbik7XHJcbi8vICAgICAgICAgICAgICAgICBkZXNpZ24gPSBfLm1lcmdlKGRlc2lnbiwgcmVxdWVzdC5kZXNpZ24pO1xyXG4vLyAgICAgICAgICAgICAgICAgcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5yZW1vdmVDaGlsZHJlbigpO1xyXG4vLyAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS50ZW1wbGF0ZS5idWlsZChkZXNpZ24sIGNvbnRleHQpLnRoZW4oaXRlbSA9PiB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFzdGVyID0gcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5yYXN0ZXJpemUoNzIsIGZhbHNlKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbW92ZSgpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3QuY2FsbGJhY2socmFzdGVyLnRvRGF0YVVSTCgpKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVkLnJlcXVlc3QoMSk7XHJcbi8vICAgICAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICAgICAgKGVycikgPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImVycm9yIG9uIHRlbXBsYXRlLmJ1aWxkXCIsIGVycik7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlZC5yZXF1ZXN0KDEpO1xyXG4vLyAgICAgICAgICAgICAgICAgfSk7XHJcbi8vICAgICAgICAgICAgIH0pO1xyXG4vLyAgICAgICAgICAgICBjb250cm9sbGVkLnJlcXVlc3QoMSk7XHJcblxyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICB9XHJcbi8vIH0iLCJtb2R1bGUgU2tldGNoQnVpbGRlciB7XHJcbiAgICBcclxuICAgIGV4cG9ydCBjbGFzcyBTaGFyZU9wdGlvbnNVSSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKXtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBSeC5PYnNlcnZhYmxlLmp1c3QobnVsbCk7XHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShzdGF0ZS5tYXAoKCkgPT4gdGhpcy5jcmVhdGVEb20oKSksIGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNyZWF0ZURvbSgpOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2LmNvbnRyb2xzXCIsIFsgXHJcbiAgICAgICAgICAgICAgICBoKFwiYnV0dG9uLmJ0bi5idG4tcHJpbWFyeVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuZG93bmxvYWRQTkcoMTAwICogMTAwMClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1wiRG93bmxvYWQgc21hbGxcIl0pLFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBoKFwiYnV0dG9uLmJ0bi5idG4tcHJpbWFyeVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuZG93bmxvYWRQTkcoNTAwICogMTAwMClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1wiRG93bmxvYWQgbWVkaXVtXCJdKSxcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN0b3JlIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpbml0aWFsaXplZDogYm9vbGVhbjtcclxuICAgICAgICBwcml2YXRlIF90ZW1wbGF0ZSQgPSBuZXcgUnguU3ViamVjdDxUZW1wbGF0ZT4oKTtcclxuICAgICAgICBwcml2YXRlIF90ZW1wbGF0ZVN0YXRlJCA9IG5ldyBSeC5TdWJqZWN0PFRlbXBsYXRlU3RhdGU+KCk7XHJcbiAgICAgICAgcHJpdmF0ZSBfcmVuZGVyJCA9IG5ldyBSeC5TdWJqZWN0PFJlbmRlclJlcXVlc3Q+KCk7XHJcbiAgICAgICAgcHJpdmF0ZSBfc3RhdGU6IHtcclxuICAgICAgICAgICAgdGVtcGxhdGU/OiBUZW1wbGF0ZTtcclxuICAgICAgICAgICAgdGVtcGxhdGVTdGF0ZTogVGVtcGxhdGVTdGF0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBfZXZlbnRzQ2hhbm5lbCA9IG5ldyBUeXBlZENoYW5uZWwuQ2hhbm5lbCgpO1xyXG5cclxuICAgICAgICBwcml2YXRlIF9wYXJzZWRGb250czogRm9udFNoYXBlLlBhcnNlZEZvbnRzO1xyXG4gICAgICAgIHByaXZhdGUgX2ZvbnRDYXRhbG9nOiBGb250U2hhcGUuRm9udENhdGFsb2c7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlU3RhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBkZXNpZ246IHt9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9wYXJzZWRGb250cyA9IG5ldyBGb250U2hhcGUuUGFyc2VkRm9udHMoKCkgPT4geyB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV2ZW50cyA9IHtcclxuICAgICAgICAgICAgZG93bmxvYWRQTkdSZXF1ZXN0ZWQ6IHRoaXMuX2V2ZW50c0NoYW5uZWwudG9waWM8bnVtYmVyPihcImRvd25sb2FkUE5HUmVxdWVzdGVkXCIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgc3RhdGUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBwYXJzZWRGb250cygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlZEZvbnRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGZvbnRDYXRhbG9nKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udENhdGFsb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdGVtcGxhdGVTdGF0ZSQoKTogUnguT2JzZXJ2YWJsZTxUZW1wbGF0ZVN0YXRlPiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZVN0YXRlJDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB0ZW1wbGF0ZSQoKTogUnguT2JzZXJ2YWJsZTxUZW1wbGF0ZT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGUkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHJlbmRlciQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXIkOy8vLm9ic2VydmVPbihSeC5TY2hlZHVsZXIuZGVmYXVsdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXRlLnRlbXBsYXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGRlc2lnbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZSAmJiB0aGlzLnN0YXRlLnRlbXBsYXRlU3RhdGUuZGVzaWduO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCgpOiBQcm9taXNlPFN0b3JlPiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaW5pdGlhbGl6ZWQpe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3RvcmUgaXMgYWxyZWFkeSBpbml0YWxpemVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxTdG9yZT4oY2FsbGJhY2sgPT4ge1xyXG4gICAgICAgICAgICAgICAgRm9udFNoYXBlLkZvbnRDYXRhbG9nLmZyb21Mb2NhbChcImZvbnRzL2dvb2dsZS1mb250cy5qc29uXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oYyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRDYXRhbG9nID0gYztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG93bmxvYWRQTkcocGl4ZWxzOiBudW1iZXIpe1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5kb3dubG9hZFBOR1JlcXVlc3RlZC5kaXNwYXRjaCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0VGVtcGxhdGUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZTogVGVtcGxhdGU7XHJcbiAgICAgICAgICAgIGlmICgvRGlja2Vucy9pLnRlc3QobmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gbmV3IFNrZXRjaEJ1aWxkZXIuVGVtcGxhdGVzLkRpY2tlbnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdGVtcGxhdGUgJHtuYW1lfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcclxuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUkLm9uTmV4dCh0ZW1wbGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXREZXNpZ24odmFsdWU6IERlc2lnbikge1xyXG4gICAgICAgICAgICB0aGlzLnNldFRlbXBsYXRlU3RhdGUoeyBkZXNpZ246IHZhbHVlIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGRhdGVUZW1wbGF0ZVN0YXRlKGNoYW5nZTogVGVtcGxhdGVTdGF0ZUNoYW5nZSkge1xyXG4gICAgICAgICAgICBfLm1lcmdlKHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZSwgY2hhbmdlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGRlc2lnbiA9IHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZS5kZXNpZ247XHJcbiAgICAgICAgICAgIGlmKGRlc2lnbiAmJiBkZXNpZ24uZm9udCAmJiBkZXNpZ24uZm9udC5mYW1pbHkgJiYgIWRlc2lnbi5mb250LnZhcmlhbnQpIHtcclxuICAgICAgICAgICAgICAgLy8gc2V0IGRlZmF1bHQgdmFyaWFudFxyXG4gICAgICAgICAgICAgICAgZGVzaWduLmZvbnQudmFyaWFudCA9IEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5kZWZhdWx0VmFyaWFudChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb250Q2F0YWxvZy5nZXRSZWNvcmQoZGVzaWduLmZvbnQuZmFtaWx5KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlU3RhdGUkLm9uTmV4dCh0aGlzLnN0YXRlLnRlbXBsYXRlU3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzZXRUZW1wbGF0ZVN0YXRlKHN0YXRlOiBUZW1wbGF0ZVN0YXRlKXtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUudGVtcGxhdGVTdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVN0YXRlJC5vbk5leHQoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVuZGVyKHJlcXVlc3Q6IFJlbmRlclJlcXVlc3QpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyJC5vbk5leHQocmVxdWVzdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGUge1xyXG4gICAgICAgIG5hbWU6IHN0cmluZztcclxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgICAgIGltYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgY3JlYXRlTmV3KGNvbnRleHQ6IFRlbXBsYXRlVUlDb250ZXh0KTogVGVtcGxhdGVTdGF0ZTtcclxuICAgICAgICBjcmVhdGVVSShjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IEJ1aWxkZXJDb250cm9sW107XHJcbiAgICAgICAgYnVpbGQoZGVzaWduOiBEZXNpZ24sIGNvbnRleHQ6IFRlbXBsYXRlQnVpbGRDb250ZXh0KTogUHJvbWlzZTxwYXBlci5JdGVtPjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlVUlDb250ZXh0IHtcclxuICAgICAgICByZW5kZXJEZXNpZ24oZGVzaWduOiBEZXNpZ24sIGNhbGxiYWNrOiAoaW1hZ2VEYXRhVXJsOiBzdHJpbmcpID0+IHZvaWQpO1xyXG4gICAgICAgIGZvbnRDYXRhbG9nOiBGb250U2hhcGUuRm9udENhdGFsb2c7XHJcbiAgICAgICAgY3JlYXRlRm9udENob29zZXIoKTogQnVpbGRlckNvbnRyb2w7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGVCdWlsZENvbnRleHQge1xyXG4gICAgICAgIGdldEZvbnQoZGVzYzogRm9udFNoYXBlLkZvbnRTcGVjaWZpZXIpOiBQcm9taXNlPG9wZW50eXBlLkZvbnQ+O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlU3RhdGUge1xyXG4gICAgICAgIGRlc2lnbjogRGVzaWduO1xyXG4gICAgICAgIGZvbnRDYXRlZ29yeT86IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlU3RhdGVDaGFuZ2Uge1xyXG4gICAgICAgIGRlc2lnbj86IERlc2lnbjtcclxuICAgICAgICBmb250Q2F0ZWdvcnk/OiBzdHJpbmc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVzaWduIHtcclxuICAgICAgICBjb250ZW50PzogYW55O1xyXG4gICAgICAgIHNoYXBlPzogc3RyaW5nO1xyXG4gICAgICAgIGZvbnQ/OiBGb250U2hhcGUuRm9udFNwZWNpZmllcjtcclxuICAgICAgICBwYWxldHRlPzogRGVzaWduUGFsZXR0ZTtcclxuICAgICAgICBzZWVkPzogbnVtYmVyO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIERlc2lnblBhbGV0dGUge1xyXG4gICAgICAgIGNvbG9yPzogc3RyaW5nO1xyXG4gICAgICAgIGludmVydD86IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBEZXNpZ25DaGFuZ2UgZXh0ZW5kcyBEZXNpZ257XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyUmVxdWVzdCB7XHJcbiAgICAgICAgZGVzaWduOiBEZXNpZ247XHJcbiAgICAgICAgYXJlYT86IG51bWJlcjtcclxuICAgICAgICBjYWxsYmFjazogKGltYWdlRGF0YVVybDogc3RyaW5nKSA9PiB2b2lkO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJ1aWxkZXJDb250cm9sIHtcclxuICAgICAgICB2YWx1ZSQ6IFJ4Lk9ic2VydmFibGU8VGVtcGxhdGVTdGF0ZUNoYW5nZT47XHJcbiAgICAgICAgY3JlYXRlTm9kZSh2YWx1ZTogVGVtcGxhdGVTdGF0ZSk6IFZOb2RlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFZhbHVlQ29udHJvbDxUPiB7XHJcbiAgICAgICAgdmFsdWUkOiBSeC5PYnNlcnZhYmxlPFQ+O1xyXG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU/OiBUKTogVk5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBPcHRpb25DaG9vc2VyPFQ+IHtcclxuICAgICAgICB2YWx1ZSQ6IFJ4Lk9ic2VydmFibGU8VD47XHJcbiAgICAgICAgY3JlYXRlTm9kZShjaG9pY2VzOiBUW10sIHZhbHVlPzogVCk6IFZOb2RlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBleHBvcnQgaW50ZXJmYWNlIFZOb2RlQ2hvb3NlciB7XHJcbiAgICAvLyAgICAgY3JlYXRlTm9kZShjaG9pY2VzOiBWTm9kZVtdLCBjaG9zZW5LZXk6IHN0cmluZyk6IFZOb2RlO1xyXG4gICAgLy8gICAgIGNob3NlbiQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+O1xyXG4gICAgLy8gfVxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG4gICAgXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIENvbnRyb2xIZWxwZXJzIHtcclxuICAgICAgICBcclxuICAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGNob29zZXI8VD4oXHJcbiAgICAgICAgICAgICBjaG9pY2VzOiBDaG9pY2VbXSlcclxuICAgICAgICAgICAgIDogVk5vZGV7XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwidWwuY2hvb3NlclwiLFxyXG4gICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzLm1hcChjaG9pY2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoKFwibGkuY2hvaWNlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvc2VuOiBjaG9pY2UuY2hvc2VuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9pY2UuY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjaG9pY2Uubm9kZV0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDaG9pY2Uge1xyXG4gICAgICAgICAgICAgbm9kZTogVk5vZGUsIFxyXG4gICAgICAgICAgICAgY2hvc2VuPzogYm9vbGVhbiwgXHJcbiAgICAgICAgICAgICBjYWxsYmFjaz86ICgpID0+IHZvaWRcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRm9udENob29zZXIgaW1wbGVtZW50cyBWYWx1ZUNvbnRyb2w8Rm9udENob29zZXJTdGF0ZT4ge1xyXG5cclxuICAgICAgICBwcml2YXRlIGZvbnRDYXRhbG9nOiBGb250U2hhcGUuRm9udENhdGFsb2c7XHJcbiAgICAgICAgcHJpdmF0ZSBfdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8Rm9udENob29zZXJTdGF0ZT4oKTtcclxuXHJcbiAgICAgICAgbWF4RmFtaWxpZXMgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihmb250Q2F0YWxvZzogRm9udFNoYXBlLkZvbnRDYXRhbG9nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udENhdGFsb2cgPSBmb250Q2F0YWxvZztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHByZWxvYWRGYW1pbGllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0Q2F0ZWdvcmllcygpXHJcbiAgICAgICAgICAgICAgICAubWFwKGMgPT4gZm9udENhdGFsb2cuZ2V0RmFtaWxpZXMoYylbMF0pO1xyXG4gICAgICAgICAgICBGb250U2hhcGUuRm9udENhdGFsb2cubG9hZFByZXZpZXdTdWJzZXRzKHByZWxvYWRGYW1pbGllcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdmFsdWUkKCk6IFJ4Lk9ic2VydmFibGU8Rm9udENob29zZXJTdGF0ZT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWUkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3JlYXRlTm9kZSh2YWx1ZT86IEZvbnRDaG9vc2VyU3RhdGUpOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuOiBWTm9kZVtdID0gW107XHJcblxyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGgoXCJoM1wiLCBbXCJGb250IENhdGVnb3JpZXNcIl0pKTtcclxuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcmllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0Q2F0ZWdvcmllcygpO1xyXG4gICAgICAgICAgICBjb25zdCBjYXRlZ29yeUNob2ljZXMgPSBjYXRlZ29yaWVzLm1hcChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2F0ZWdvcnlGYW1pbGllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0RmFtaWxpZXMoY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4RmFtaWxpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeUZhbWlsaWVzID0gY2F0ZWdvcnlGYW1pbGllcy5zbGljZSgwLCB0aGlzLm1heEZhbWlsaWVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0RmFtaWx5ID0gY2F0ZWdvcnlGYW1pbGllc1swXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcclxuICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwic3BhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogRm9udEhlbHBlcnMuZ2V0Q3NzU3R5bGUoZmlyc3RGYW1pbHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjYXRlZ29yeV0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGNob3NlbjogdmFsdWUuY2F0ZWdvcnkgPT09IGNhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5sb2FkUHJldmlld1N1YnNldHMoY2F0ZWdvcnlGYW1pbGllcyk7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZSQub25OZXh0KHsgY2F0ZWdvcnksIGZhbWlseTogZmlyc3RGYW1pbHkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChDb250cm9sSGVscGVycy5jaG9vc2VyKGNhdGVnb3J5Q2hvaWNlcykpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlLmNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGgoXCJoM1wiLCB7fSwgW1wiRm9udHNcIl0pKTtcclxuICAgICAgICAgICAgICAgIGxldCBmYW1pbGllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0RmFtaWxpZXModmFsdWUuY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4RmFtaWxpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmYW1pbGllcyA9IGZhbWlsaWVzLnNsaWNlKDAsIHRoaXMubWF4RmFtaWxpZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZmFtaWx5T3B0aW9ucyA9IGZhbWlsaWVzLm1hcChmYW1pbHkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogaChcInNwYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogRm9udEhlbHBlcnMuZ2V0Q3NzU3R5bGUoZmFtaWx5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtmYW1pbHldKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hvc2VuOiB2YWx1ZS5mYW1pbHkgPT09IGZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuX3ZhbHVlJC5vbk5leHQoeyBmYW1pbHksIHZhcmlhbnQ6IFwiXCIgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goQ29udHJvbEhlbHBlcnMuY2hvb3NlcihmYW1pbHlPcHRpb25zKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5mYW1pbHkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhbnRzID0gdGhpcy5mb250Q2F0YWxvZy5nZXRWYXJpYW50cyh2YWx1ZS5mYW1pbHkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhcmlhbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGgoXCJoM1wiLCB7fSwgW1wiRm9udCBTdHlsZXNcIl0pKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFyaWFudE9wdGlvbnMgPSB2YXJpYW50cy5tYXAodmFyaWFudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGgoXCJzcGFuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogRm9udEhlbHBlcnMuZ2V0Q3NzU3R5bGUodmFsdWUuZmFtaWx5LCB2YXJpYW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3ZhcmlhbnRdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3NlbjogdmFsdWUudmFyaWFudCA9PT0gdmFyaWFudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLl92YWx1ZSQub25OZXh0KHsgdmFyaWFudCB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChDb250cm9sSGVscGVycy5jaG9vc2VyKHZhcmlhbnRPcHRpb25zKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2LmZvbnRDaG9vc2VyXCIsIHt9LCBjaGlsZHJlbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRm9udENob29zZXJTdGF0ZSB7XHJcbiAgICAgICAgY2F0ZWdvcnk/OiBzdHJpbmc7XHJcbiAgICAgICAgZmFtaWx5Pzogc3RyaW5nO1xyXG4gICAgICAgIHZhcmlhbnQ/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBJbWFnZUNob29zZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9jaG9zZW4kID0gbmV3IFJ4LlN1YmplY3Q8SW1hZ2VDaG9pY2U+KCk7XHJcblxyXG4gICAgICAgIGNyZWF0ZU5vZGUob3B0aW9uczogSW1hZ2VDaG9vc2VyT3B0aW9ucyk6IFZOb2RlIHtcclxuICAgICAgICAgICAgY29uc3QgY2hvaWNlTm9kZXMgPSBvcHRpb25zLmNob2ljZXMubWFwKGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGltZzogVk5vZGU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbkNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nob3NlbiQub25OZXh0KGMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBvcHRpb25zLmNob3NlbiA9PT0gYy52YWx1ZSBcclxuICAgICAgICAgICAgICAgICAgICA/IFwiaW1nLmNob3NlblwiIFxyXG4gICAgICAgICAgICAgICAgICAgIDogXCJpbWdcIjtcclxuICAgICAgICAgICAgICAgIGlmIChjLmxvYWRJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWdFbG07XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nID0gaChzZWxlY3RvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogb25DbGlja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBraWNrIG9mZiBpbWFnZSBsb2FkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiB2bm9kZSA9PiBjLmxvYWRJbWFnZSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpbWcgPSBoKHNlbGVjdG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY6IGMuaW1hZ2VVcmxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBvbkNsaWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJsaVwiLCB7fSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIGltZ1xyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBoKFwidWwuY2hvb3NlclwiLCB7fSwgY2hvaWNlTm9kZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGNob3NlbiQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaG9zZW4kO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbWFnZUNob29zZXJPcHRpb25zIHtcclxuICAgICAgICBjaG9pY2VzOiBJbWFnZUNob2ljZVtdLFxyXG4gICAgICAgIGNob3Nlbj86IHN0cmluZ1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1hZ2VDaG9pY2Uge1xyXG4gICAgICAgIHZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgbGFiZWw6IHN0cmluZztcclxuICAgICAgICBpbWFnZVVybD86IHN0cmluZztcclxuICAgICAgICBsb2FkSW1hZ2U/OiAoZWxlbWVudDogSFRNTEltYWdlRWxlbWVudCkgPT4gdm9pZDtcclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRlbXBsYXRlRm9udENob29zZXIgaW1wbGVtZW50cyBCdWlsZGVyQ29udHJvbHtcclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIF9mb250Q2hvb3NlcjogRm9udENob29zZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRDaG9vc2VyID0gbmV3IEZvbnRDaG9vc2VyKHN0b3JlLmZvbnRDYXRhbG9nKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRDaG9vc2VyLm1heEZhbWlsaWVzID0gMTU7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjcmVhdGVOb2RlKHZhbHVlOiBUZW1wbGF0ZVN0YXRlKTogVk5vZGUge1xyXG4gICAgICAgICAgICBjb25zdCBmb250ID0gdmFsdWUuZGVzaWduICYmIHZhbHVlLmRlc2lnbi5mb250O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udENob29zZXIuY3JlYXRlTm9kZSg8Rm9udENob29zZXJTdGF0ZT57XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogdmFsdWUuZm9udENhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgZmFtaWx5OiBmb250ICYmIGZvbnQuZmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgdmFyaWFudDogZm9udCAmJiBmb250LnZhcmlhbnRcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0IHZhbHVlJCgpOiBSeC5PYnNlcnZhYmxlPFRlbXBsYXRlU3RhdGU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRDaG9vc2VyLnZhbHVlJC5tYXAoY2hvaWNlID0+IDxUZW1wbGF0ZVN0YXRlPntcclxuICAgICAgICAgICAgICAgIGZvbnRDYXRlZ29yeTogY2hvaWNlLmNhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgZGVzaWduOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYW1pbHk6IGNob2ljZS5mYW1pbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ6IGNob2ljZS52YXJpYW50XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9IFxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dElucHV0IGltcGxlbWVudHMgVmFsdWVDb250cm9sPHN0cmluZz4ge1xyXG5cclxuICAgICAgICBwcml2YXRlIF92YWx1ZSQgPSBuZXcgUnguU3ViamVjdDxzdHJpbmc+KCk7XHJcblxyXG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU/OiBzdHJpbmcsIHBsYWNlaG9sZGVyPzogc3RyaW5nLCB0ZXh0YXJlYT86IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoXCJ0ZXh0YXJlYVwiID8gXCJ0ZXh0YXJlYVwiIDogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRleHRhcmVhID8gdW5kZWZpbmVkIDogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlclxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2OiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGV2LndoaWNoIHx8IGV2LmtleUNvZGUpID09PSBEb21IZWxwZXJzLktleUNvZGVzLkVudGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IDxIVE1MSW5wdXRFbGVtZW50PmV2LnRhcmdldDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5ibHVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZSQub25OZXh0KGV2LnRhcmdldC52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW11cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB2YWx1ZSQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZSQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyLlRlbXBsYXRlcyB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIERpY2tlbnMgaW1wbGVtZW50cyBTa2V0Y2hCdWlsZGVyLlRlbXBsYXRlIHtcclxuXHJcbiAgICAgICAgbmFtZSA9IFwiRGlja2Vuc1wiO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlN0YWNrIGJsb2NrcyBvZiB0ZXh0IGluIHRoZSBmb3JtIG9mIGEgd2F2eSBsYWRkZXIuXCI7XHJcbiAgICAgICAgaW1hZ2U6IHN0cmluZztcclxuICAgICAgICBsaW5lSGVpZ2h0VmFyaWF0aW9uID0gMC44O1xyXG4gICAgICAgIGRlZmF1bHRGb250U2l6ZSA9IDEyODtcclxuICAgICAgICBtYXJnaW5GYWN0b3IgPSAwLjE0O1xyXG5cclxuICAgICAgICBjcmVhdGVOZXcoY29udGV4dDogVGVtcGxhdGVVSUNvbnRleHQpOiBUZW1wbGF0ZVN0YXRlIHtcclxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdEZvbnRSZWNvcmQgPSBjb250ZXh0LmZvbnRDYXRhbG9nLmdldExpc3QoMSlbMF07XHJcbiAgICAgICAgICAgIHJldHVybiA8VGVtcGxhdGVTdGF0ZT57XHJcbiAgICAgICAgICAgICAgICBkZXNpZ246IHtcclxuICAgICAgICAgICAgICAgICAgICBzaGFwZTogXCJuYXJyb3dcIixcclxuICAgICAgICAgICAgICAgICAgICBmb250OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbWlseTogZGVmYXVsdEZvbnRSZWNvcmQuZmFtaWx5XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzZWVkOiBNYXRoLnJhbmRvbSgpXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZm9udENhdGVnb3J5OiBkZWZhdWx0Rm9udFJlY29yZC5jYXRlZ29yeVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjcmVhdGVVSShjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IEJ1aWxkZXJDb250cm9sW10ge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUZXh0RW50cnkoKSxcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhcGVDaG9vc2VyKGNvbnRleHQpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVWYXJpYXRpb25Db250cm9sKCksXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmNyZWF0ZUZvbnRDaG9vc2VyKCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVBhbGV0dGVDaG9vc2VyKClcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJ1aWxkKGRlc2lnbjogRGVzaWduLCBjb250ZXh0OiBUZW1wbGF0ZUJ1aWxkQ29udGV4dCk6IFByb21pc2U8cGFwZXIuSXRlbT4ge1xyXG4gICAgICAgICAgICBpZiAoIWRlc2lnbi5jb250ZW50IHx8ICFkZXNpZ24uY29udGVudC50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5nZXRGb250KGRlc2lnbi5mb250KS50aGVuKGZvbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd29yZHMgPSBkZXNpZ24uY29udGVudC50ZXh0LnRvTG9jYWxlVXBwZXJDYXNlKCkuc3BsaXQoL1xccy8pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZWRSYW5kb20gPSBuZXcgRnJhbWV3b3JrLlNlZWRSYW5kb20oXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzaWduLnNlZWQgPT0gbnVsbCA/IE1hdGgucmFuZG9tKCkgOiBkZXNpZ24uc2VlZCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0TGVuZ3RoOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGRlc2lnbi5zaGFwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJiYWxhbmNlZFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZW5ndGggPSAyICogTWF0aC5zcXJ0KF8uc3VtKHdvcmRzLm1hcCh3ID0+IHcubGVuZ3RoICsgMSkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIndpZGVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbnVtTGluZXMgPSAzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlbmd0aCA9IF8uc3VtKHdvcmRzLm1hcCh3ID0+IHcubGVuZ3RoICsgMSkpIC8gbnVtTGluZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlbmd0aCA9IDxudW1iZXI+Xy5tYXgod29yZHMubWFwKHcgPT4gdy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRMZW5ndGggKj0gKDEgKyBzZWVkUmFuZG9tLnJhbmRvbSgpICogMC41KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gdGhpcy5iYWxhbmNlTGluZXMod29yZHMsIHRhcmdldExlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHRleHRDb2xvciA9IGRlc2lnbi5wYWxldHRlICYmIGRlc2lnbi5wYWxldHRlLmNvbG9yIHx8IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGVzaWduLnBhbGV0dGUgJiYgZGVzaWduLnBhbGV0dGUuaW52ZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgW3RleHRDb2xvciwgYmFja2dyb3VuZENvbG9yXSA9IFtiYWNrZ3JvdW5kQ29sb3IsIHRleHRDb2xvcl07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYm94ID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlVGV4dEJsb2NrID0gKHM6IHN0cmluZywgc2l6ZSA9IHRoaXMuZGVmYXVsdEZvbnRTaXplKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBmb250LmdldFBhdGgocywgMCwgMCwgc2l6ZSkudG9QYXRoRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsYXlvdXRJdGVtcyA9IGxpbmVzLm1hcChsaW5lID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jazogY3JlYXRlVGV4dEJsb2NrKGxpbmUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF4V2lkdGggPSBfLm1heChsYXlvdXRJdGVtcy5tYXAoYiA9PiBiLmJsb2NrLmJvdW5kcy53aWR0aCkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXJyYW5nZVBhdGhQb2ludHMgPSBNYXRoLm1pbig0LCBNYXRoLnJvdW5kKG1heFdpZHRoIC8gMikpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGluZUhlaWdodCA9IGxheW91dEl0ZW1zWzBdLmJsb2NrLmJvdW5kcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHVwcGVyID0gbmV3IHBhcGVyLlBhdGgoW1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLCAwKSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQobWF4V2lkdGgsIDApXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIGxldCBsb3dlcjogcGFwZXIuUGF0aDtcclxuICAgICAgICAgICAgICAgIGxldCByZW1haW5pbmcgPSBsYXlvdXRJdGVtcy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBsYXlvdXRJdGVtIG9mIGxheW91dEl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKC0tcmVtYWluaW5nIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWlkID0gdXBwZXIuYm91bmRzLmNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGFzdCBsb3dlciBsaW5lIGlzIGxldmVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VyID0gbmV3IHBhcGVyLlBhdGgoW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsIG1pZC55ICsgbGluZUhlaWdodCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQobWF4V2lkdGgsIG1pZC55ICsgbGluZUhlaWdodClcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG93ZXIgPSB0aGlzLnJhbmRvbUxvd2VyUGF0aEZvcih1cHBlciwgbGluZUhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmFuZ2VQYXRoUG9pbnRzLCBzZWVkUmFuZG9tKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RyZXRjaCA9IG5ldyBGb250U2hhcGUuVmVydGljYWxCb3VuZHNTdHJldGNoUGF0aChcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0SXRlbS5ibG9jayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB1cHBlciwgbG93ZXIgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyZXRjaC5maWxsQ29sb3IgPSB0ZXh0Q29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LmFkZENoaWxkKHN0cmV0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwcGVyID0gbG93ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgbG93ZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkZXNpZ24uY29udGVudC5zb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2VCbG9jayA9IGNyZWF0ZVRleHRCbG9jayhkZXNpZ24uY29udGVudC5zb3VyY2UsIHRoaXMuZGVmYXVsdEZvbnRTaXplICogMC4zMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlQmxvY2suZmlsbENvbG9yID0gdGV4dENvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2NrLnRyYW5zbGF0ZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXIuYm91bmRzLmJvdHRvbUxlZnQuYWRkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFdpZHRoIC0gc291cmNlQmxvY2suYm91bmRzLndpZHRoLCAvLyByaWdodC1hbGlnblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2NrLmJvdW5kcy5oZWlnaHQgKiAxLjEgLy8gc2hpZnQgaGVpZ2h0IHBsdXMgdG9wIG1hcmdpblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihzb3VyY2VCbG9jay5ib3VuZHMubGVmdCA8IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGp1c3QgZm9yIGxvbmcgc291cmNlIGxpbmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlQmxvY2suYm91bmRzLmxlZnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBib3guYWRkQ2hpbGQoc291cmNlQmxvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IGJveC5ib3VuZHMuY2xvbmUoKTtcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5zaXplID0gYm91bmRzLnNpemUubXVsdGlwbHkoMSArIHRoaXMubWFyZ2luRmFjdG9yKTtcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5jZW50ZXIgPSBib3guYm91bmRzLmNlbnRlcjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSBwYXBlci5TaGFwZS5SZWN0YW5nbGUoYm91bmRzKTtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQuZmlsbENvbG9yID0gYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICAgICAgYm94Lmluc2VydENoaWxkKDAsIGJhY2tncm91bmQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBib3g7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSByYW5kb21Mb3dlclBhdGhGb3IoXHJcbiAgICAgICAgICAgIHVwcGVyOiBwYXBlci5QYXRoLFxyXG4gICAgICAgICAgICBhdmdIZWlnaHQ6IG51bWJlcixcclxuICAgICAgICAgICAgbnVtUG9pbnRzLFxyXG4gICAgICAgICAgICBzZWVkUmFuZG9tOiBGcmFtZXdvcmsuU2VlZFJhbmRvbVxyXG4gICAgICAgICk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgICAgICBjb25zdCBwb2ludHM6IHBhcGVyLlBvaW50W10gPSBbXTtcclxuICAgICAgICAgICAgbGV0IHVwcGVyQ2VudGVyID0gdXBwZXIuYm91bmRzLmNlbnRlcjtcclxuICAgICAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVBvaW50czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gdXBwZXJDZW50ZXIueSArIChzZWVkUmFuZG9tLnJhbmRvbSgpIC0gMC41KSAqIHRoaXMubGluZUhlaWdodFZhcmlhdGlvbiAqIGF2Z0hlaWdodDtcclxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKG5ldyBwYXBlci5Qb2ludCh4LCB5KSk7XHJcbiAgICAgICAgICAgICAgICB4ICs9IHVwcGVyLmJvdW5kcy53aWR0aCAvIChudW1Qb2ludHMgLSAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbmV3IHBhcGVyLlBhdGgocG9pbnRzKTtcclxuICAgICAgICAgICAgcGF0aC5zbW9vdGgoKTtcclxuICAgICAgICAgICAgcGF0aC5ib3VuZHMuY2VudGVyID0gdXBwZXIuYm91bmRzLmNlbnRlci5hZGQobmV3IHBhcGVyLlBvaW50KDAsIGF2Z0hlaWdodCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYmFsYW5jZUxpbmVzKHdvcmRzOiBzdHJpbmdbXSwgdGFyZ2V0TGVuZ3RoOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGNTY29yZSA9ICh0ZXh0OiBzdHJpbmcpID0+XHJcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhNYXRoLmFicyh0YXJnZXRMZW5ndGggLSB0ZXh0Lmxlbmd0aCksIDIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRMaW5lID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRTY29yZSA9IDEwMDAwO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKHdvcmRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd29yZCA9IHdvcmRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdMaW5lID0gY3VycmVudExpbmUgKyBcIiBcIiArIHdvcmQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdTY29yZSA9IGNhbGNTY29yZShuZXdMaW5lKTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TGluZSAmJiBuZXdTY29yZSA8PSBjdXJyZW50U2NvcmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBhcHBlbmRcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TGluZSArPSBcIiBcIiArIHdvcmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjb3JlID0gbmV3U2NvcmU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG5ldyBsaW5lXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRMaW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goY3VycmVudExpbmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IHdvcmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjb3JlID0gY2FsY1Njb3JlKGN1cnJlbnRMaW5lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsaW5lcy5wdXNoKGN1cnJlbnRMaW5lKTtcclxuICAgICAgICAgICAgcmV0dXJuIGxpbmVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVUZXh0RW50cnkoKTogQnVpbGRlckNvbnRyb2wge1xyXG4gICAgICAgICAgICBjb25zdCBtYWluVGV4dElucHV0ID0gbmV3IFRleHRJbnB1dCgpO1xyXG4gICAgICAgICAgICBjb25zdCBzb3VyY2VUZXh0SW5wdXQgPSBuZXcgVGV4dElucHV0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVOb2RlOiAodmFsdWU6IFRlbXBsYXRlU3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaDNcIiwge30sIFtcIk1lc3NhZ2VcIl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpblRleHRJbnB1dC5jcmVhdGVOb2RlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICYmIHZhbHVlLmRlc2lnbi5jb250ZW50ICYmIHZhbHVlLmRlc2lnbi5jb250ZW50LnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJXaGF0IGRvIHlvdSB3YW50IHRvIHNheT9cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVRleHRJbnB1dC5jcmVhdGVOb2RlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICYmIHZhbHVlLmRlc2lnbi5jb250ZW50ICYmIHZhbHVlLmRlc2lnbi5jb250ZW50LnNvdXJjZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlNvdXJjZSAoYXV0aG9yLCBwYXNzYWdlLCBldGMpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWUkOiBSeC5PYnNlcnZhYmxlLm1lcmdlKFxyXG4gICAgICAgICAgICAgICAgICAgIG1haW5UZXh0SW5wdXQudmFsdWUkLm1hcCh0ID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPnsgZGVzaWduOiB7IGNvbnRlbnQ6IHsgdGV4dDogdCB9IH0gfSlcclxuICAgICAgICAgICAgICAgICAgICAsIHNvdXJjZVRleHRJbnB1dC52YWx1ZSQubWFwKHQgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFRlbXBsYXRlU3RhdGVDaGFuZ2U+eyBkZXNpZ246IHsgY29udGVudDogeyBzb3VyY2U6IHQgfSB9IH0pXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlU2hhcGVDaG9vc2VyKGNvbnRleHQ6IFRlbXBsYXRlVUlDb250ZXh0KTogQnVpbGRlckNvbnRyb2wge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSQgPSBuZXcgUnguU3ViamVjdDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPigpO1xyXG4gICAgICAgICAgICByZXR1cm4gPEJ1aWxkZXJDb250cm9sPntcclxuICAgICAgICAgICAgICAgIGNyZWF0ZU5vZGU6ICh0czogVGVtcGxhdGVTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlcyA9IFtcIm5hcnJvd1wiXTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBiYWxhbmNlZCBvbmx5IGF2YWlsYWJsZSBmb3IgPj0gTiB3b3Jkc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cy5kZXNpZ24uY29udGVudCAmJiB0cy5kZXNpZ24uY29udGVudC50ZXh0ICYmIHRzLmRlc2lnbi5jb250ZW50LnRleHQuc3BsaXQoL1xccy8pLmxlbmd0aCA+PSA3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlcy5wdXNoKFwiYmFsYW5jZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlcy5wdXNoKFwid2lkZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaG9pY2VzID0gc2hhcGVzLm1hcChzaGFwZSA9PiA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogaChcInNwYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3NoYXBlXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob3NlbjogdHMuZGVzaWduLnNoYXBlID09PSBzaGFwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlJC5vbk5leHQoeyBkZXNpZ246IHsgc2hhcGUgfSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaDNcIiwge30sIFtcIlNoYXBlXCJdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbnRyb2xIZWxwZXJzLmNob29zZXIoY2hvaWNlcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbHVlJDogdmFsdWUkLmFzT2JzZXJ2YWJsZSgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVZhcmlhdGlvbkNvbnRyb2woKTogQnVpbGRlckNvbnRyb2wge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSQgPSBuZXcgUnguU3ViamVjdDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPigpO1xyXG4gICAgICAgICAgICByZXR1cm4gPEJ1aWxkZXJDb250cm9sPntcclxuICAgICAgICAgICAgICAgIGNyZWF0ZU5vZGU6ICh0czogVGVtcGxhdGVTdGF0ZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBidXR0b24gPSBoKFwiYnV0dG9uLmJ0blwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB2YWx1ZSQub25OZXh0KHsgZGVzaWduOiB7IHNlZWQ6IE1hdGgucmFuZG9tKCkgfSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCJOZXh0XCJdXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImgzXCIsIHt9LCBbXCJWYXJpYXRpb25cIl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSQ6IHZhbHVlJC5hc09ic2VydmFibGUoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVQYWxldHRlQ2hvb3NlcigpOiBCdWlsZGVyQ29udHJvbCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZENvbG9ycyA9IHRoaXMucGFsZXR0ZUNvbG9ycy5tYXAoYyA9PiBuZXcgcGFwZXIuQ29sb3IoYykpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xvcnMgPSBfLnNvcnRCeShwYXJzZWRDb2xvcnMsIGMgPT4gYy5odWUpXHJcbiAgICAgICAgICAgICAgICAubWFwKGMgPT4gYy50b0NTUyh0cnVlKSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSQgPSBuZXcgUnguU3ViamVjdDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPigpO1xyXG4gICAgICAgICAgICByZXR1cm4gPEJ1aWxkZXJDb250cm9sPntcclxuICAgICAgICAgICAgICAgIGNyZWF0ZU5vZGU6ICh0czogVGVtcGxhdGVTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhbGV0dGUgPSB0cy5kZXNpZ24ucGFsZXR0ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaG9pY2VzID0gY29sb3JzLm1hcChjb2xvciA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGgoXCJkaXYucGFsZXR0ZVRpbGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3NlbjogcGFsZXR0ZSAmJiBwYWxldHRlLmNvbG9yID09PSBjb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUkLm9uTmV4dCh7IGRlc2lnbjogeyBwYWxldHRlOiB7IGNvbG9yIH0gfSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGludmVydE5vZGUgPSBoKFwiZGl2XCIsIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcImxhYmVsXCIsIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6IHBhbGV0dGUgJiYgcGFsZXR0ZS5pbnZlcnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZXYgPT4gdmFsdWUkLm9uTmV4dCh7IGRlc2lnbjogeyBwYWxldHRlOiB7IGludmVydDogZXYudGFyZ2V0LmNoZWNrZWQgfSB9IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJJbnZlcnQgY29sb3JcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gaChcImRpdi5jb2xvckNob29zZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImgzXCIsIHt9LCBbXCJDb2xvclwiXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb250cm9sSGVscGVycy5jaG9vc2VyKGNob2ljZXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJ0Tm9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWUkOiB2YWx1ZSQuYXNPYnNlcnZhYmxlKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwYWxldHRlQ29sb3JzID0gW1xyXG4gICAgICAgICAgICBcIiM0YjM4MzJcIixcclxuICAgICAgICAgICAgXCIjODU0NDQyXCIsXHJcbiAgICAgICAgICAgIC8vXCIjZmZmNGU2XCIsXHJcbiAgICAgICAgICAgIFwiIzNjMmYyZlwiLFxyXG4gICAgICAgICAgICBcIiNiZTliN2JcIixcclxuXHJcbiAgICAgICAgICAgIFwiIzFiODViOFwiLFxyXG4gICAgICAgICAgICBcIiM1YTUyNTVcIixcclxuICAgICAgICAgICAgXCIjNTU5ZTgzXCIsXHJcbiAgICAgICAgICAgIFwiI2FlNWE0MVwiLFxyXG4gICAgICAgICAgICBcIiNjM2NiNzFcIixcclxuXHJcbiAgICAgICAgICAgIFwiIzBlMWE0MFwiLFxyXG4gICAgICAgICAgICBcIiMyMjJmNWJcIixcclxuICAgICAgICAgICAgXCIjNWQ1ZDVkXCIsXHJcbiAgICAgICAgICAgIFwiIzk0NmIyZFwiLFxyXG4gICAgICAgICAgICBcIiMwMDAwMDBcIixcclxuXHJcbiAgICAgICAgICAgIFwiI2VkYzk1MVwiLFxyXG4gICAgICAgICAgICBcIiNlYjY4NDFcIixcclxuICAgICAgICAgICAgXCIjY2MyYTM2XCIsXHJcbiAgICAgICAgICAgIFwiIzRmMzcyZFwiLFxyXG4gICAgICAgICAgICBcIiMwMGEwYjBcIixcclxuICAgICAgICBdO1xyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRG9jdW1lbnRLZXlIYW5kbGVyIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBub3RlOiB1bmRpc3Bvc2VkIGV2ZW50IHN1YnNjcmlwdGlvblxyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5rZXl1cChmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IERvbUhlbHBlcnMuS2V5Q29kZXMuRXNjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU2tldGNoRWRpdG9yTW9kdWxlIHtcclxuXHJcbiAgICAgICAgYXBwU3RvcmU6IEFwcC5TdG9yZTtcclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgd29ya3NwYWNlQ29udHJvbGxlcjogV29ya3NwYWNlQ29udHJvbGxlcjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoYXBwU3RvcmU6IEFwcC5TdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlID0gYXBwU3RvcmU7XHJcblxyXG4gICAgICAgICAgICBEb21IZWxwZXJzLmluaXRFcnJvckhhbmRsZXIoZXJyb3JEYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShlcnJvckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS9jbGllbnQtZXJyb3JzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBjb250ZW50XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoYXBwU3RvcmUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYmFyID0gbmV3IEVkaXRvckJhcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduZXInKSwgdGhpcy5zdG9yZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbUVkaXRvciA9IG5ldyBTZWxlY3RlZEl0ZW1FZGl0b3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0b3JPdmVybGF5XCIpLCB0aGlzLnN0b3JlKTtcclxuICAgICAgICAgICAgY29uc3QgaGVscERpYWxvZyA9IG5ldyBIZWxwRGlhbG9nKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVscC1kaWFsb2dcIiksIHRoaXMuc3RvcmUpO1xyXG4gICAgICAgICAgICBjb25zdCBvcGVyYXRpb25QYW5lbCA9IG5ldyBPcGVyYXRpb25QYW5lbChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZXJhdGlvblBhbmVsXCIpLCB0aGlzLnN0b3JlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRoaXMuc3RvcmUuZXZlbnRzLnN1YnNjcmliZShtID0+IGNvbnNvbGUubG9nKFwiZXZlbnRcIiwgbS50eXBlLCBtLmRhdGEpKTtcclxuICAgICAgICAgICAgLy8gdGhpcy5zdG9yZS5hY3Rpb25zLnN1YnNjcmliZShtID0+IGNvbnNvbGUubG9nKFwiYWN0aW9uXCIsIG0udHlwZSwgbS5kYXRhKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGFydCgpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZXZlbnRzLmVkaXRvci5mb250TG9hZGVkLm9ic2VydmUoKS5maXJzdCgpLnN1YnNjcmliZShtID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmtzcGFjZUNvbnRyb2xsZXIgPSBuZXcgV29ya3NwYWNlQ29udHJvbGxlcih0aGlzLnN0b3JlLCBtLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3IuaW5pdFdvcmtzcGFjZS5kaXNwYXRjaCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuZXZlbnRzLmVkaXRvci53b3Jrc3BhY2VJbml0aWFsaXplZC5zdWIoKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oXCJiZWZvcmV1bmxvYWRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2hJc0RpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJZb3VyIGxhdGVzdCBjaGFuZ2VzIGFyZSBub3Qgc2F2ZWQgeWV0LlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9wZW5Ta2V0Y2goaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLm9wZW4uZGlzcGF0Y2goaWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTa2V0Y2hIZWxwZXJzIHtcclxuXHJcbiAgICAgICAgc3RhdGljIGNvbG9yc0luVXNlKHNrZXRjaDogU2tldGNoKTogc3RyaW5nW10ge1xyXG4gICAgICAgICAgICBsZXQgY29sb3JzID0gW3NrZXRjaC5iYWNrZ3JvdW5kQ29sb3JdO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIHNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcnMucHVzaChibG9jay5iYWNrZ3JvdW5kQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgY29sb3JzLnB1c2goYmxvY2sudGV4dENvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb2xvcnMgPSBfLnVuaXEoY29sb3JzLmZpbHRlcihjID0+IGMgIT0gbnVsbCkpO1xyXG4gICAgICAgICAgICBjb2xvcnMuc29ydCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29sb3JzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzdGF0aWMgZ2V0U2tldGNoRmlsZU5hbWUoc2tldGNoOiBTa2V0Y2gsIGxlbmd0aDogbnVtYmVyLCBleHRlbnNpb246IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gXCJcIjtcclxuICAgICAgICAgICAgb3V0ZXI6XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmxvY2sgb2Ygc2tldGNoLnRleHRCbG9ja3MpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBibG9jay50ZXh0LnNwbGl0KC9cXHMvKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyaW0gPSB3b3JkLnJlcGxhY2UoL1xcVy9nLCAnJykudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cmltLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGgpIG5hbWUgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgKz0gdHJpbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUubGVuZ3RoID49IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhayBvdXRlcjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFuYW1lLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IFwiZmlkZGxlXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgKyBcIi5cIiArIGV4dGVuc2lvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIlxyXG5uYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBzaW5nbGV0b24gU3RvcmUgY29udHJvbHMgYWxsIGFwcGxpY2F0aW9uIHN0YXRlLlxyXG4gICAgICogTm8gcGFydHMgb3V0c2lkZSBvZiB0aGUgU3RvcmUgbW9kaWZ5IGFwcGxpY2F0aW9uIHN0YXRlLlxyXG4gICAgICogQ29tbXVuaWNhdGlvbiB3aXRoIHRoZSBTdG9yZSBpcyBkb25lIHRocm91Z2ggbWVzc2FnZSBDaGFubmVsczogXHJcbiAgICAgKiAgIC0gQWN0aW9ucyBjaGFubmVsIHRvIHNlbmQgaW50byB0aGUgU3RvcmUsXHJcbiAgICAgKiAgIC0gRXZlbnRzIGNoYW5uZWwgdG8gcmVjZWl2ZSBub3RpZmljYXRpb24gZnJvbSB0aGUgU3RvcmUuXHJcbiAgICAgKiBPbmx5IHRoZSBTdG9yZSBjYW4gcmVjZWl2ZSBhY3Rpb24gbWVzc2FnZXMuXHJcbiAgICAgKiBPbmx5IHRoZSBTdG9yZSBjYW4gc2VuZCBldmVudCBtZXNzYWdlcy5cclxuICAgICAqIFRoZSBTdG9yZSBjYW5ub3Qgc2VuZCBhY3Rpb25zIG9yIGxpc3RlbiB0byBldmVudHMgKHRvIGF2b2lkIGxvb3BzKS5cclxuICAgICAqIE1lc3NhZ2VzIGFyZSB0byBiZSB0cmVhdGVkIGFzIGltbXV0YWJsZS5cclxuICAgICAqIEFsbCBtZW50aW9ucyBvZiB0aGUgU3RvcmUgY2FuIGJlIGFzc3VtZWQgdG8gbWVhbiwgb2YgY291cnNlLFxyXG4gICAgICogICBcIlRoZSBTdG9yZSBhbmQgaXRzIHN1Yi1jb21wb25lbnRzLlwiXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBTdG9yZSB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBCUk9XU0VSX0lEX0tFWSA9IFwiYnJvd3NlcklkXCI7XHJcbiAgICAgICAgc3RhdGljIEZBTExCQUNLX0ZPTlRfVVJMID0gXCIvZm9udHMvUm9ib3RvLTUwMC50dGZcIjtcclxuICAgICAgICBzdGF0aWMgREVGQVVMVF9GT05UX05BTUUgPSBcIlJvYm90b1wiO1xyXG4gICAgICAgIHN0YXRpYyBTS0VUQ0hfTE9DQUxfQ0FDSEVfS0VZID0gXCJmaWRkbGVzdGlja3MuaW8ubGFzdFNrZXRjaFwiO1xyXG4gICAgICAgIHN0YXRpYyBMT0NBTF9DQUNIRV9ERUxBWV9NUyA9IDEwMDA7XHJcbiAgICAgICAgc3RhdGljIFNFUlZFUl9TQVZFX0RFTEFZX01TID0gMTAwMDA7XHJcbiAgICAgICAgc3RhdGljIEdSRUVUSU5HX1NLRVRDSF9JRCA9IFwiaW0yYmE5MmkxNzE0aVwiO1xyXG5cclxuICAgICAgICBmb250TGlzdExpbWl0ID0gMjUwO1xyXG5cclxuICAgICAgICBzdGF0ZTogRWRpdG9yU3RhdGUgPSB7fTtcclxuICAgICAgICByZXNvdXJjZXM6IFN0b3JlUmVzb3VyY2VzID0ge307XHJcbiAgICAgICAgYWN0aW9ucyA9IG5ldyBBY3Rpb25zKCk7XHJcbiAgICAgICAgZXZlbnRzID0gbmV3IEV2ZW50cygpO1xyXG5cclxuICAgICAgICBwcml2YXRlIGFwcFN0b3JlOiBBcHAuU3RvcmU7XHJcbiAgICAgICAgcHJpdmF0ZSBfb3BlcmF0aW9uJCA9IG5ldyBSeC5TdWJqZWN0PE9wZXJhdGlvbj4oKTtcclxuICAgICAgICBwcml2YXRlIF90cmFuc3BhcmVuY3kkID0gbmV3IFJ4LlN1YmplY3Q8Ym9vbGVhbj4oKTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoYXBwU3RvcmU6IEFwcC5TdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlID0gYXBwU3RvcmU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldHVwU3RhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0dXBTdWJzY3JpcHRpb25zKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxvYWRSZXNvdXJjZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldHVwU3RhdGUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuYnJvd3NlcklkID0gQ29va2llcy5nZXQoU3RvcmUuQlJPV1NFUl9JRF9LRVkpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYnJvd3NlcklkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmJyb3dzZXJJZCA9IEZyYW1ld29yay5uZXdpZCgpO1xyXG4gICAgICAgICAgICAgICAgQ29va2llcy5zZXQoU3RvcmUuQlJPV1NFUl9JRF9LRVksIHRoaXMuc3RhdGUuYnJvd3NlcklkLCB7IGV4cGlyZXM6IDIgKiAzNjUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldHVwU3Vic2NyaXB0aW9ucygpIHtcclxuICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuYWN0aW9ucywgZXZlbnRzID0gdGhpcy5ldmVudHM7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBBcHAgLS0tLS1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUuZXZlbnRzLnJvdXRlQ2hhbmdlZC5zdWIocm91dGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm91dGVTa2V0Y2hJZCA9IHJvdXRlLnBhcmFtcy5za2V0Y2hJZDtcclxuICAgICAgICAgICAgICAgIGlmIChyb3V0ZS5uYW1lID09PSBcInNrZXRjaFwiICYmIHJvdXRlU2tldGNoSWQgIT09IHRoaXMuc3RhdGUuc2tldGNoLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlblNrZXRjaChyb3V0ZVNrZXRjaElkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBFZGl0b3IgLS0tLS1cclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmluaXRXb3Jrc3BhY2Uub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgICAgICAucGF1c2FibGVCdWZmZXJlZChldmVudHMuZWRpdG9yLnJlc291cmNlc1JlYWR5Lm9ic2VydmUoKS5tYXAobSA9PiBtLmRhdGEpKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBza2V0Y2hJZCA9IHRoaXMuYXBwU3RvcmUuc3RhdGUucm91dGUucGFyYW1zLnNrZXRjaElkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IHRoaXMuYXBwU3RvcmUuc3RhdGUubGFzdFNhdmVkU2tldGNoSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb21pc2U6IEpRdWVyeVByb21pc2U8YW55PjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2tldGNoSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9IHRoaXMub3BlblNrZXRjaChza2V0Y2hJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9IHRoaXMubG9hZEdyZWV0aW5nU2tldGNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbigoKSA9PiBldmVudHMuZWRpdG9yLndvcmtzcGFjZUluaXRpYWxpemVkLmRpc3BhdGNoKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBvbiBhbnkgYWN0aW9uLCB1cGRhdGUgc2F2ZSBkZWxheSB0aW1lclxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5vYnNlcnZlKCkuZGVib3VuY2UoU3RvcmUuU0VSVkVSX1NBVkVfREVMQVlfTVMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2tldGNoID0gdGhpcy5zdGF0ZS5za2V0Y2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHNrZXRjaC5faWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBza2V0Y2gudGV4dEJsb2Nrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVTa2V0Y2goc2tldGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmxvYWRGb250LnN1YnNjcmliZShtID0+XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcy5wYXJzZWRGb250cy5nZXQobS5kYXRhKSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci56b29tVG9GaXQuZm9yd2FyZChcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5lZGl0b3Iuem9vbVRvRml0UmVxdWVzdGVkKTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmV4cG9ydFBORy5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLmV4cG9ydFBOR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmV4cG9ydFNWRy5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLmV4cG9ydFNWR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLnZpZXdDaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5lZGl0b3Iudmlld0NoYW5nZWQuZGlzcGF0Y2gobS5kYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci51cGRhdGVTbmFwc2hvdC5zdWIoKHtza2V0Y2hJZCwgcG5nRGF0YVVybH0pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChza2V0Y2hJZCA9PT0gdGhpcy5zdGF0ZS5za2V0Y2guX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBza2V0Y2hJZCArIFwiLnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBEb21IZWxwZXJzLmRhdGFVUkxUb0Jsb2IocG5nRGF0YVVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgUzNBY2Nlc3MucHV0RmlsZShmaWxlTmFtZSwgXCJpbWFnZS9wbmdcIiwgYmxvYik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3IudG9nZ2xlSGVscC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zaG93SGVscCA9ICF0aGlzLnN0YXRlLnNob3dIZWxwO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLmVkaXRvci5zaG93SGVscENoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5zaG93SGVscCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3Iub3BlblNhbXBsZS5zdWIoKCkgPT4gdGhpcy5sb2FkR3JlZXRpbmdTa2V0Y2goKSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBTa2V0Y2ggLS0tLS1cclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLm9wZW4uc3ViKGlkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblNrZXRjaChpZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guY3JlYXRlLnN1YigoYXR0cikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdTa2V0Y2goYXR0cik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guY2xlYXIuc3ViKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJTa2V0Y2goKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLmNsb25lLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9uZSA9IF8uY2xvbmUodGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgY2xvbmUuX2lkID0gRnJhbWV3b3JrLm5ld2lkKCk7XHJcbiAgICAgICAgICAgICAgICBjbG9uZS5icm93c2VySWQgPSB0aGlzLnN0YXRlLmJyb3dzZXJJZDtcclxuICAgICAgICAgICAgICAgIGNsb25lLnNhdmVkQXQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKGNsb25lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmNsb25lZC5kaXNwYXRjaChjbG9uZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1bHNlVXNlck1lc3NhZ2UoXCJEdXBsaWNhdGVkIHNrZXRjaC4gQWRkcmVzcyBvZiB0aGlzIHBhZ2UgaGFzIGJlZW4gdXBkYXRlZC5cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZS5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXJnZSh0aGlzLnN0YXRlLnNrZXRjaCwgZXYuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obS5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obS5kYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gVGV4dEJsb2NrIC0tLS0tXHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5hZGRcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRjaCA9IGV2LmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXRjaC50ZXh0IHx8ICFwYXRjaC50ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHsgX2lkOiBGcmFtZXdvcmsubmV3aWQoKSB9IGFzIFRleHRCbG9jaztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lcmdlKGJsb2NrLCBwYXRjaCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLnRleHRDb2xvciA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLnRleHRDb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ci5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFibG9jay5mb250RmFtaWx5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLmZvbnRGYW1pbHkgPSB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ci5mb250RmFtaWx5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5mb250VmFyaWFudCA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLmZvbnRWYXJpYW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2gudGV4dEJsb2Nrcy5wdXNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmFkZGVkLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRleHRCbG9ja0ZvbnQoYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB0aGlzLmdldEJsb2NrKGV2LmRhdGEuX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gPFRleHRCbG9jaz57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBldi5kYXRhLnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGV2LmRhdGEuYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBldi5kYXRhLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGV2LmRhdGEuZm9udEZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRWYXJpYW50OiBldi5kYXRhLmZvbnRWYXJpYW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvbnRDaGFuZ2VkID0gcGF0Y2guZm9udEZhbWlseSAhPT0gYmxvY2suZm9udEZhbWlseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgcGF0Y2guZm9udFZhcmlhbnQgIT09IGJsb2NrLmZvbnRWYXJpYW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lcmdlKGJsb2NrLCBwYXRjaCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2suZm9udEZhbWlseSAmJiAhYmxvY2suZm9udFZhcmlhbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMucmVzb3VyY2VzLmZvbnRDYXRhbG9nLmdldFJlY29yZChibG9jay5mb250RmFtaWx5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWd1bGFyIG9yIGVsc2UgZmlyc3QgdmFyaWFudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLmZvbnRWYXJpYW50ID0gRm9udFNoYXBlLkZvbnRDYXRhbG9nLmRlZmF1bHRWYXJpYW50KHJlY29yZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBibG9jay50ZXh0Q29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGJsb2NrLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGJsb2NrLmZvbnRGYW1pbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogYmxvY2suZm9udFZhcmlhbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm9udENoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRleHRCbG9ja0ZvbnQoYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5yZW1vdmVcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaWREZWxldGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBfLnJlbW92ZSh0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLCB0YiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0Yi5faWQgPT09IGV2LmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWREZWxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlkRGVsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5kaXNwYXRjaCh7IF9pZDogZXYuZGF0YS5faWQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2VcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuZ2V0QmxvY2soZXYuZGF0YS5faWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5wb3NpdGlvbiA9IGV2LmRhdGEucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLm91dGxpbmUgPSBldi5kYXRhLm91dGxpbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXJyYW5nZUNoYW5nZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgb3BlcmF0aW9uJCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29wZXJhdGlvbiQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdHJhbnNwYXJlbmN5JCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zcGFyZW5jeSQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyBzaG93T3BlcmF0aW9uKG9wZXJhdGlvbjogT3BlcmF0aW9uKXtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5vcGVyYXRpb24gPSBvcGVyYXRpb247XHJcbiAgICAgICAgICAgIG9wZXJhdGlvbi5vbkNsb3NlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zdGF0ZS5vcGVyYXRpb24gPT09IG9wZXJhdGlvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlT3BlcmF0aW9uKCk7IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX29wZXJhdGlvbiQub25OZXh0KG9wZXJhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyBoaWRlT3BlcmF0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLm9wZXJhdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX29wZXJhdGlvbiQub25OZXh0KG51bGwpOyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaW1hZ2VVcGxvYWRlZChzcmM6IHN0cmluZyl7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudXBsb2FkZWRJbWFnZSA9IHNyYztcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmltYWdlVXBsb2FkZWQuZGlzcGF0Y2goc3JjKTtcclxuICAgICAgICAgICAgaWYoIXRoaXMuc3RhdGUudHJhbnNwYXJlbmN5KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VHJhbnNwYXJlbmN5KHRydWUpO1xyXG4gICAgICAgICAgICB9ICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyByZW1vdmVVcGxvYWRlZEltYWdlKCl7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudXBsb2FkZWRJbWFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5pbWFnZVVwbG9hZGVkLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgICAgICBpZih0aGlzLnN0YXRlLnRyYW5zcGFyZW5jeSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRyYW5zcGFyZW5jeShmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzZXRUcmFuc3BhcmVuY3kodmFsdWU/OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudHJhbnNwYXJlbmN5ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zcGFyZW5jeSQub25OZXh0KHRoaXMuc3RhdGUudHJhbnNwYXJlbmN5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgb3BlblNrZXRjaChpZDogc3RyaW5nKTogSlF1ZXJ5UHJvbWlzZTxTa2V0Y2g+IHtcclxuICAgICAgICAgICAgaWYgKCFpZCB8fCAhaWQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFMzQWNjZXNzLmdldEpzb24oaWQgKyBcIi5qc29uXCIpXHJcbiAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgIChza2V0Y2g6IFNrZXRjaCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJldHJpZXZlZCBza2V0Y2hcIiwgc2tldGNoLl9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNrZXRjaC5icm93c2VySWQgPT09IHRoaXMuc3RhdGUuYnJvd3NlcklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTa2V0Y2ggd2FzIGNyZWF0ZWQgaW4gdGhpcyBicm93c2VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2tldGNoIHdhcyBjcmVhdGVkIGluIGEgZGlmZmVyZW50IGJyb3dzZXInKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBza2V0Y2g7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJlcnJvciBnZXR0aW5nIHJlbW90ZSBza2V0Y2hcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRHcmVldGluZ1NrZXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGxvYWRTa2V0Y2goc2tldGNoOiBTa2V0Y2gpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5sb2FkaW5nU2tldGNoID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2ggPSBza2V0Y2g7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmxvYWRlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnNrZXRjaCk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUuYWN0aW9ucy5lZGl0b3JMb2FkZWRTa2V0Y2guZGlzcGF0Y2goc2tldGNoLl9pZCk7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgdGIgb2YgdGhpcy5zdGF0ZS5za2V0Y2gudGV4dEJsb2Nrcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmxvYWRlZC5kaXNwYXRjaCh0Yik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRUZXh0QmxvY2tGb250KHRiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnpvb21Ub0ZpdFJlcXVlc3RlZC5kaXNwYXRjaCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5sb2FkaW5nU2tldGNoID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGxvYWRHcmVldGluZ1NrZXRjaCgpOiBKUXVlcnlQcm9taXNlPGFueT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUzNBY2Nlc3MuZ2V0SnNvbihTdG9yZS5HUkVFVElOR19TS0VUQ0hfSUQgKyBcIi5qc29uXCIpXHJcbiAgICAgICAgICAgICAgICAuZG9uZSgoc2tldGNoOiBTa2V0Y2gpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBza2V0Y2guX2lkID0gRnJhbWV3b3JrLm5ld2lkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tldGNoLmJyb3dzZXJJZCA9IHRoaXMuc3RhdGUuYnJvd3NlcklkO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNsZWFyU2tldGNoKCkge1xyXG4gICAgICAgICAgICBjb25zdCBza2V0Y2ggPSA8U2tldGNoPnRoaXMuZGVmYXVsdFNrZXRjaEF0dHIoKTtcclxuICAgICAgICAgICAgc2tldGNoLl9pZCA9IHRoaXMuc3RhdGUuc2tldGNoLl9pZDtcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKHNrZXRjaCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGxvYWRSZXNvdXJjZXMoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzID0gbmV3IEZvbnRTaGFwZS5QYXJzZWRGb250cyhwYXJzZWQgPT5cclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVkaXRvci5mb250TG9hZGVkLmRpc3BhdGNoKHBhcnNlZC5mb250KSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5mcm9tTG9jYWwoXCJmb250cy9nb29nbGUtZm9udHMuanNvblwiKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oY2F0YWxvZyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMuZm9udENhdGFsb2cgPSBjYXRhbG9nO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvYWQgZm9udHMgaW50byBicm93c2VyIGZvciBwcmV2aWV3XHJcbiAgICAgICAgICAgICAgICAgICAgRm9udFNoYXBlLkZvbnRDYXRhbG9nLmxvYWRQcmV2aWV3U3Vic2V0cyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0YWxvZy5nZXRMaXN0KHRoaXMuZm9udExpc3RMaW1pdCkubWFwKGYgPT4gZi5mYW1pbHkpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KFN0b3JlLkZBTExCQUNLX0ZPTlRfVVJMKS50aGVuKCh7Zm9udH0pID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZhbGxiYWNrRm9udCA9IGZvbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lZGl0b3IucmVzb3VyY2VzUmVhZHkuZGlzcGF0Y2godHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0VXNlck1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnVzZXJNZXNzYWdlICE9PSBtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnVzZXJNZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVkaXRvci51c2VyTWVzc2FnZUNoYW5nZWQuZGlzcGF0Y2gobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcHVsc2VVc2VyTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRVc2VyTWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpLCA0MDAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0RGVmYXVsdFVzZXJNZXNzYWdlKCkge1xyXG4gICAgICAgICAgICAvLyBpZiBub3QgdGhlIGxhc3Qgc2F2ZWQgc2tldGNoLCBvciBza2V0Y2ggaXMgZGlydHksIHNob3cgXCJVbnNhdmVkXCJcclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9ICh0aGlzLnN0YXRlLnNrZXRjaElzRGlydHlcclxuICAgICAgICAgICAgICAgIHx8ICF0aGlzLnN0YXRlLnNrZXRjaC5zYXZlZEF0KVxyXG4gICAgICAgICAgICAgICAgPyBcIlVuc2F2ZWRcIlxyXG4gICAgICAgICAgICAgICAgOiBcIlNhdmVkXCI7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlck1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGxvYWRUZXh0QmxvY2tGb250KGJsb2NrOiBUZXh0QmxvY2spIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMuZm9udENhdGFsb2cuZ2V0VXJsKGJsb2NrLmZvbnRGYW1pbHksIGJsb2NrLmZvbnRWYXJpYW50KSlcclxuICAgICAgICAgICAgICAgIC50aGVuKCh7Zm9udH0pID0+XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmZvbnRSZWFkeS5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0QmxvY2tJZDogYmxvY2suX2lkLCBmb250IH0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY2hhbmdlZFNrZXRjaENvbnRlbnQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5jb250ZW50Q2hhbmdlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnNrZXRjaCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGVmYXVsdFVzZXJNZXNzYWdlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIG1lcmdlPFQ+KGRlc3Q6IFQsIHNvdXJjZTogVCkge1xyXG4gICAgICAgICAgICBfLm1lcmdlKGRlc3QsIHNvdXJjZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIG5ld1NrZXRjaChhdHRyPzogU2tldGNoQXR0cik6IFNrZXRjaCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNrZXRjaCA9IDxTa2V0Y2g+dGhpcy5kZWZhdWx0U2tldGNoQXR0cigpO1xyXG4gICAgICAgICAgICBza2V0Y2guX2lkID0gRnJhbWV3b3JrLm5ld2lkKCk7XHJcbiAgICAgICAgICAgIGlmIChhdHRyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lcmdlKHNrZXRjaCwgYXR0cik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKHNrZXRjaCk7XHJcbiAgICAgICAgICAgIHJldHVybiBza2V0Y2g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRlZmF1bHRTa2V0Y2hBdHRyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gPFNrZXRjaEF0dHI+e1xyXG4gICAgICAgICAgICAgICAgYnJvd3NlcklkOiB0aGlzLnN0YXRlLmJyb3dzZXJJZCxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRUZXh0QmxvY2tBdHRyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJSb2JvdG9cIixcclxuICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogXCJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBcImdyYXlcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ3aGl0ZVwiLFxyXG4gICAgICAgICAgICAgICAgdGV4dEJsb2NrczogPFRleHRCbG9ja1tdPltdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNhdmVTa2V0Y2goc2tldGNoOiBTa2V0Y2gpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2F2aW5nID0gXy5jbG9uZShza2V0Y2gpO1xyXG4gICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBzYXZpbmcuc2F2ZWRBdCA9IG5vdztcclxuICAgICAgICAgICAgdGhpcy5zZXRVc2VyTWVzc2FnZShcIlNhdmluZ1wiKTtcclxuICAgICAgICAgICAgUzNBY2Nlc3MucHV0RmlsZShza2V0Y2guX2lkICsgXCIuanNvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCIsIEpTT04uc3RyaW5naWZ5KHNhdmluZykpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guc2F2ZWRBdCA9IG5vdztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUuYWN0aW9ucy5lZGl0b3JTYXZlZFNrZXRjaC5kaXNwYXRjaChza2V0Y2guX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lZGl0b3Iuc25hcHNob3RFeHBpcmVkLmRpc3BhdGNoKHNrZXRjaCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VXNlck1lc3NhZ2UoXCJVbmFibGUgdG8gc2F2ZVwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRTZWxlY3Rpb24oaXRlbTogV29ya3NwYWNlT2JqZWN0UmVmLCBmb3JjZTogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICAgICAgaWYgKCFmb3JjZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZWFybHkgZXhpdCBvbiBubyBjaGFuZ2VcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuc2VsZWN0aW9uLml0ZW1JZCA9PT0gaXRlbS5pdGVtSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNlbGVjdGlvbiA9IGl0ZW07XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLmRpc3BhdGNoKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRFZGl0aW5nSXRlbShpdGVtOiBQb3NpdGlvbmVkT2JqZWN0UmVmLCBmb3JjZT86IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKCFmb3JjZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZWFybHkgZXhpdCBvbiBubyBjaGFuZ2VcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbS5pdGVtSWQgPT09IGl0ZW0uaXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2lnbmFsIGNsb3NpbmcgZWRpdG9yIGZvciBpdGVtXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0uaXRlbVR5cGUgPT09IFwiVGV4dEJsb2NrXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RWRpdGluZ0Jsb2NrID0gdGhpcy5nZXRCbG9jayh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtLml0ZW1JZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRFZGl0aW5nQmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmVkaXRvckNsb3NlZC5kaXNwYXRjaChjdXJyZW50RWRpdGluZ0Jsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBlZGl0aW5nIGl0ZW0gc2hvdWxkIGJlIHNlbGVjdGVkIGl0ZW1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmVkaXRpbmdJdGVtID0gaXRlbTtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5kaXNwYXRjaChpdGVtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZ2V0QmxvY2soaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsIHRiID0+IHRiLl9pZCA9PT0gaWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwiaW50ZXJmYWNlIFdpbmRvdyB7XHJcbiAgICB3ZWJraXRVUkw6IFVSTDtcclxufVxyXG5cclxubmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFdvcmtzcGFjZUNvbnRyb2xsZXIge1xyXG5cclxuICAgICAgICBzdGF0aWMgVEVYVF9DSEFOR0VfUkVOREVSX1RIUk9UVExFX01TID0gNTAwO1xyXG4gICAgICAgIHN0YXRpYyBCTE9DS19CT1VORFNfQ0hBTkdFX1RIUk9UVExFX01TID0gNTAwO1xyXG5cclxuICAgICAgICBkZWZhdWx0U2l6ZSA9IG5ldyBwYXBlci5TaXplKDUwMDAwLCA0MDAwMCk7XHJcbiAgICAgICAgZGVmYXVsdFNjYWxlID0gMC4wMjtcclxuXHJcbiAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgICAgIGZhbGxiYWNrRm9udDogb3BlbnR5cGUuRm9udDtcclxuICAgICAgICB2aWV3Wm9vbTogcGFwZXJFeHQuVmlld1pvb207XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIHByaXZhdGUgX3NrZXRjaDogU2tldGNoO1xyXG4gICAgICAgIHByaXZhdGUgX3RleHRCbG9ja0l0ZW1zOiB7IFt0ZXh0QmxvY2tJZDogc3RyaW5nXTogVGV4dFdhcnAgfSA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgX3dvcmtzcGFjZTogcGFwZXIuSXRlbTtcclxuICAgICAgICBwcml2YXRlIF9iYWNrZ3JvdW5kSW1hZ2U6IHBhcGVyLlJhc3RlcjtcclxuICAgICAgICBwcml2YXRlIF9tYXJrOiBGc3R4LkZyYW1ld29yay5XYXRlcm1hcms7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSwgZmFsbGJhY2tGb250OiBvcGVudHlwZS5Gb250KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgdGhpcy5mYWxsYmFja0ZvbnQgPSBmYWxsYmFja0ZvbnQ7XHJcbiAgICAgICAgICAgIHBhcGVyLnNldHRpbmdzLmhhbmRsZVNpemUgPSAxO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5DYW52YXMnKTtcclxuICAgICAgICAgICAgcGFwZXIuc2V0dXAodGhpcy5jYW52YXMpO1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3QgPSBwYXBlci5wcm9qZWN0O1xyXG4gICAgICAgICAgICB3aW5kb3cub25yZXNpemUgPSAoKSA9PiB0aGlzLnByb2plY3Qudmlldy5kcmF3KCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjYW52YXNTZWwgPSAkKHRoaXMuY2FudmFzKTtcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLm1lcmdlVHlwZWQoXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZCxcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWRcclxuICAgICAgICAgICAgKS5zdWJzY3JpYmUoZXYgPT5cclxuICAgICAgICAgICAgICAgIGNhbnZhc1NlbC5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGV2LmRhdGEuYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudmlld1pvb20gPSBuZXcgcGFwZXJFeHQuVmlld1pvb20odGhpcy5wcm9qZWN0KTtcclxuICAgICAgICAgICAgdGhpcy52aWV3Wm9vbS5zZXRab29tUmFuZ2UoW1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2l6ZS5tdWx0aXBseSh0aGlzLmRlZmF1bHRTY2FsZSAqIDAuMSksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTaXplLm11bHRpcGx5KDAuNSldKTtcclxuICAgICAgICAgICAgdGhpcy52aWV3Wm9vbS52aWV3Q2hhbmdlZC5zdWJzY3JpYmUoYm91bmRzID0+IHtcclxuICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuZWRpdG9yLnZpZXdDaGFuZ2VkLmRpc3BhdGNoKGJvdW5kcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY2xlYXJTZWxlY3Rpb24gPSAoZXY6IHBhcGVyLlBhcGVyTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0b3JlLnN0YXRlLnNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYXBlci52aWV3Lm9uKHBhcGVyLkV2ZW50VHlwZS5jbGljaywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByb2plY3QuaGl0VGVzdChldi5wb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbihldik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBwYXBlci52aWV3Lm9uKHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdTdGFydCwgY2xlYXJTZWxlY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qga2V5SGFuZGxlciA9IG5ldyBEb2N1bWVudEtleUhhbmRsZXIoc3RvcmUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fbWFyayA9IG5ldyBGc3R4LkZyYW1ld29yay5XYXRlcm1hcmsodGhpcy5wcm9qZWN0LCBcImltZy9zcGlyYWwtbG9nby5zdmdcIik7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBEZXNpZ25lciAtLS0tLVxyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci53b3Jrc3BhY2VJbml0aWFsaXplZC5zdWIoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LnZpZXcuZHJhdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5lZGl0b3Iuem9vbVRvRml0UmVxdWVzdGVkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnpvb21Ub0ZpdCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5lZGl0b3IuZXhwb3J0U1ZHUmVxdWVzdGVkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvd25sb2FkU1ZHKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5leHBvcnRQTkdSZXF1ZXN0ZWQuc3ViKG9wdGlvbnMgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb3dubG9hZFBORyhvcHRpb25zKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLnNuYXBzaG90RXhwaXJlZC5zdWIoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRTbmFwc2hvdFBORyg3MikudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLmVkaXRvci51cGRhdGVTbmFwc2hvdC5kaXNwYXRjaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNrZXRjaElkOiB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaC5faWQsIHBuZ0RhdGFVcmw6IGRhdGFcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tIFNrZXRjaCAtLS0tLVxyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5sb2FkZWQuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NrZXRjaCA9IGV2LmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dvcmtzcGFjZSA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RleHRCbG9ja0l0ZW1zID0ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLnNlbGVjdGlvbkNoYW5nZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAobS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gbS5kYXRhLml0ZW1JZCAmJiB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuaXRlbUlkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2sgJiYgIWJsb2NrLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gVGV4dEJsb2NrIC0tLS0tXHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMubWVyZ2VUeXBlZChcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYWRkZWQsXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmxvYWRlZFxyXG4gICAgICAgICAgICApLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgIGV2ID0+IHRoaXMuYWRkQmxvY2soZXYuZGF0YSkpO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5hdHRyQ2hhbmdlZFxyXG4gICAgICAgICAgICAgICAgLm9ic2VydmUoKVxyXG4gICAgICAgICAgICAgICAgLnRocm90dGxlKFdvcmtzcGFjZUNvbnRyb2xsZXIuVEVYVF9DSEFOR0VfUkVOREVSX1RIUk9UVExFX01TKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHRCbG9jayA9IG0uZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS50ZXh0ID0gdGV4dEJsb2NrLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY3VzdG9tU3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IHRleHRCbG9jay50ZXh0Q29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5mb250UmVhZHkuc3ViKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW2RhdGEudGV4dEJsb2NrSWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmZvbnQgPSBkYXRhLmZvbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5yZW1vdmVkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suZWRpdG9yQ2xvc2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udXBkYXRlVGV4dFBhdGgoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmltYWdlVXBsb2FkZWQuc3ViKHVybCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEJhY2tncm91bmRJbWFnZSh1cmwpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLnRyYW5zcGFyZW5jeSQuc3Vic2NyaWJlKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dvcmtzcGFjZS5vcGFjaXR5ID0gdmFsdWUgPyAwLjc1IDogMTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB6b29tVG9GaXQoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0Vmlld2FibGVCb3VuZHMoKTtcclxuICAgICAgICAgICAgaWYgKGJvdW5kcy53aWR0aCA+IDAgJiYgYm91bmRzLmhlaWdodCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld1pvb20uem9vbVRvKGJvdW5kcy5zY2FsZSgxLjIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBnZXRWaWV3YWJsZUJvdW5kcygpOiBwYXBlci5SZWN0YW5nbGUge1xyXG4gICAgICAgICAgICBjb25zdCBib3VuZHMgPSB0aGlzLl93b3Jrc3BhY2UuYm91bmRzO1xyXG4gICAgICAgICAgICBpZiAoIWJvdW5kcyB8fCBib3VuZHMud2lkdGggPT09IDAgfHwgYm91bmRzLmhlaWdodCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5SZWN0YW5nbGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsIDApLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFNpemUubXVsdGlwbHkoMC4wNSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBib3VuZHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcmV0dXJucyBkYXRhIFVSTFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgZ2V0U25hcHNob3RQTkcoZHBpOiBudW1iZXIpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPihjYWxsYmFjayA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYWNrZ3JvdW5kID0gdGhpcy5pbnNlcnRCYWNrZ3JvdW5kKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmFzdGVyID0gdGhpcy5fd29ya3NwYWNlLnJhc3Rlcml6ZShkcGksIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByYXN0ZXIudG9EYXRhVVJMKCk7XHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkb3dubG9hZFBORyhvcHRpb25zOiBJbWFnZUV4cG9ydE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgY29uc3QgZHBpID0gUGFwZXJIZWxwZXJzLmdldEV4cG9ydERwaSh0aGlzLl93b3Jrc3BhY2UuYm91bmRzLnNpemUsIFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5waXhlbHMgfHwgNjAwICogNjAwKTtcclxuICAgICAgICAgICAgdGhpcy5nZXRTbmFwc2hvdFBORyhkcGkpLnRoZW4oZGF0YSA9PiB7O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBTa2V0Y2hIZWxwZXJzLmdldFNrZXRjaEZpbGVOYW1lKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLCA0MCwgXCJwbmdcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBibG9iID0gRG9tSGVscGVycy5kYXRhVVJMVG9CbG9iKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgc2F2ZUFzKGJsb2IsIGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRvd25sb2FkU1ZHKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb21wbGV0ZURvd25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmRlc2VsZWN0QWxsKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YVVybCA9IFwiZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsXCIgKyBlbmNvZGVVUklDb21wb25lbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgPHN0cmluZz50aGlzLl93b3Jrc3BhY2UuZXhwb3J0U1ZHKHsgYXNTdHJpbmc6IHRydWUgfSkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmxvYiA9IERvbUhlbHBlcnMuZGF0YVVSTFRvQmxvYihkYXRhVXJsKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gU2tldGNoSGVscGVycy5nZXRTa2V0Y2hGaWxlTmFtZShcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCwgNDAsIFwic3ZnXCIpO1xyXG4gICAgICAgICAgICAgICAgc2F2ZUFzKGJsb2IsIGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaC5iYWNrZ3JvdW5kQ29sb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSB0aGlzLmluc2VydEJhY2tncm91bmQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGVEb3dubG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlRG93bmxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5zZXJ0IHNrZXRjaCBiYWNrZ3JvdW5kIHRvIHByb3ZpZGUgYmFja2dyb3VuZCBmaWxsIChpZiBuZWNlc3NhcnkpXHJcbiAgICAgICAgICogICBhbmQgYWRkIG1hcmdpbiBhcm91bmQgZWRnZXMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBpbnNlcnRCYWNrZ3JvdW5kKHdhdGVybWFyazogYm9vbGVhbik6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgICAgICBjb25zdCBza2V0Y2hCb3VuZHMgPSB0aGlzLmdldFZpZXdhYmxlQm91bmRzKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcmdpbiA9IE1hdGgubWF4KHNrZXRjaEJvdW5kcy53aWR0aCwgc2tldGNoQm91bmRzLmhlaWdodCkgKiAwLjAyO1xyXG4gICAgICAgICAgICBjb25zdCBpbWFnZUJvdW5kcyA9IG5ldyBwYXBlci5SZWN0YW5nbGUoXHJcbiAgICAgICAgICAgICAgICBza2V0Y2hCb3VuZHMudG9wTGVmdC5zdWJ0cmFjdChtYXJnaW4pLFxyXG4gICAgICAgICAgICAgICAgc2tldGNoQm91bmRzLmJvdHRvbVJpZ2h0LmFkZChtYXJnaW4pKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGwgPSBwYXBlci5TaGFwZS5SZWN0YW5nbGUoaW1hZ2VCb3VuZHMpO1xyXG4gICAgICAgICAgICBmaWxsLmZpbGxDb2xvciA9IHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLmJhY2tncm91bmRDb2xvcjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSBuZXcgcGFwZXIuR3JvdXAoW2ZpbGxdKTtcclxuXHJcbiAgICAgICAgICAgIGlmKHdhdGVybWFyaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5wbGFjZUludG8oYmFja2dyb3VuZCwgPHBhcGVyLkNvbG9yPmZpbGwuZmlsbENvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl93b3Jrc3BhY2UuaW5zZXJ0Q2hpbGQoMCwgYmFja2dyb3VuZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBiYWNrZ3JvdW5kO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBhZGRCbG9jayh0ZXh0QmxvY2s6IFRleHRCbG9jaykge1xyXG4gICAgICAgICAgICBpZiAoIXRleHRCbG9jaykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRleHRCbG9jay5faWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3JlY2VpdmVkIGJsb2NrIHdpdGhvdXQgaWQnLCB0ZXh0QmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW3RleHRCbG9jay5faWRdO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlJlY2VpdmVkIGFkZEJsb2NrIGZvciBibG9jayB0aGF0IGlzIGFscmVhZHkgbG9hZGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYm91bmRzOiB7IHVwcGVyOiBwYXBlci5TZWdtZW50W10sIGxvd2VyOiBwYXBlci5TZWdtZW50W10gfTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0ZXh0QmxvY2sub3V0bGluZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9hZFNlZ21lbnQgPSAocmVjb3JkOiBTZWdtZW50UmVjb3JkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnQgPSByZWNvcmRbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvaW50IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KHJlY29yZFswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRbMV0gJiYgbmV3IHBhcGVyLlBvaW50KHJlY29yZFsxXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRbMl0gJiYgbmV3IHBhcGVyLlBvaW50KHJlY29yZFsyXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBTaW5nbGUtcG9pbnQgc2VnbWVudHMgYXJlIHN0b3JlZCBhcyBudW1iZXJbMl1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlNlZ21lbnQobmV3IHBhcGVyLlBvaW50KHJlY29yZCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGJvdW5kcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICB1cHBlcjogdGV4dEJsb2NrLm91dGxpbmUudG9wLnNlZ21lbnRzLm1hcChsb2FkU2VnbWVudCksXHJcbiAgICAgICAgICAgICAgICAgICAgbG93ZXI6IHRleHRCbG9jay5vdXRsaW5lLmJvdHRvbS5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpdGVtID0gbmV3IFRleHRXYXJwKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5mYWxsYmFja0ZvbnQsXHJcbiAgICAgICAgICAgICAgICB0ZXh0QmxvY2sudGV4dCxcclxuICAgICAgICAgICAgICAgIGJvdW5kcyxcclxuICAgICAgICAgICAgICAgIG51bGwsIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IHRleHRCbG9jay50ZXh0Q29sb3IgfHwgXCJyZWRcIiwgICAgLy8gdGV4dENvbG9yIHNob3VsZCBoYXZlIGJlZW4gc2V0IGVsc2V3aGVyZSBcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fd29ya3NwYWNlLmFkZENoaWxkKGl0ZW0pO1xyXG5cclxuICAgICAgICAgICAgcGFwZXJFeHQuZXh0ZW5kTW91c2VFdmVudHMoaXRlbSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRleHRCbG9jay5vdXRsaW5lICYmIHRleHRCbG9jay5wb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5wb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludCh0ZXh0QmxvY2sucG9zaXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5jbGljaywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZWxlY3QgbmV4dCBpdGVtIGJlaGluZFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvdGhlckhpdHMgPSAoPFRleHRXYXJwW10+Xy52YWx1ZXModGhpcy5fdGV4dEJsb2NrSXRlbXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGkgPT4gaS5pZCAhPT0gaXRlbS5pZCAmJiAhIWkuaGl0VGVzdChldi5wb2ludCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG90aGVySXRlbSA9IF8uc29ydEJ5KG90aGVySGl0cywgaSA9PiBpLmluZGV4KVswXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVySXRlbS5icmluZ1RvRnJvbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJJZCA9IF8uZmluZEtleSh0aGlzLl90ZXh0QmxvY2tJdGVtcywgaSA9PiBpID09PSBvdGhlckl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IG90aGVySWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaXRlbUlkOiB0ZXh0QmxvY2suX2lkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIiB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXRlbS5vbihwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXRlbS5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnRyYW5zbGF0ZShldi5kZWx0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXRlbS5vbihwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnRW5kLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSA8VGV4dEJsb2NrPnRoaXMuZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtKTtcclxuICAgICAgICAgICAgICAgIGJsb2NrLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2UuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgaXRlbUlkOiB0ZXh0QmxvY2suX2lkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIiB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpdGVtQ2hhbmdlJCA9IFBhcGVyTm90aWZ5Lm9ic2VydmUoaXRlbSwgUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5HRU9NRVRSWSk7XHJcbiAgICAgICAgICAgIGl0ZW1DaGFuZ2UkXHJcbiAgICAgICAgICAgICAgICAuZGVib3VuY2UoV29ya3NwYWNlQ29udHJvbGxlci5CTE9DS19CT1VORFNfQ0hBTkdFX1RIUk9UVExFX01TKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gPFRleHRCbG9jaz50aGlzLmdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suX2lkID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2UuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdGVtLmRhdGEgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICBpZiAoIXRleHRCbG9jay5wb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5wb3NpdGlvbiA9IHRoaXMucHJvamVjdC52aWV3LmJvdW5kcy5wb2ludC5hZGQoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGl0ZW0uYm91bmRzLndpZHRoIC8gMiwgaXRlbS5ib3VuZHMuaGVpZ2h0IC8gMilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCg1MCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHRCbG9ja0l0ZW1zW3RleHRCbG9jay5faWRdID0gaXRlbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtOiBUZXh0V2FycCk6IEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgICAgICAgICAvLyBleHBvcnQgcmV0dXJucyBhbiBhcnJheSB3aXRoIGl0ZW0gdHlwZSBhbmQgc2VyaWFsaXplZCBvYmplY3Q6XHJcbiAgICAgICAgICAgIC8vICAgW1wiUGF0aFwiLCBQYXRoUmVjb3JkXVxyXG4gICAgICAgICAgICBjb25zdCB0b3AgPSA8UGF0aFJlY29yZD5pdGVtLnVwcGVyLmV4cG9ydEpTT04oeyBhc1N0cmluZzogZmFsc2UgfSlbMV07XHJcbiAgICAgICAgICAgIGNvbnN0IGJvdHRvbSA9IDxQYXRoUmVjb3JkPml0ZW0ubG93ZXIuZXhwb3J0SlNPTih7IGFzU3RyaW5nOiBmYWxzZSB9KVsxXTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogW2l0ZW0ucG9zaXRpb24ueCwgaXRlbS5wb3NpdGlvbi55XSxcclxuICAgICAgICAgICAgICAgIG91dGxpbmU6IHsgdG9wLCBib3R0b20gfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNldEJhY2tncm91bmRJbWFnZSh1cmw6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXVybCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2JhY2tncm91bmRJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmRJbWFnZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmRJbWFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJhc3RlciA9IG5ldyBwYXBlci5SYXN0ZXIodXJsKTtcclxuICAgICAgICAgICAgKDxhbnk+cmFzdGVyKS5vbkxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByYXN0ZXIuc2VuZFRvQmFjaygpO1xyXG4gICAgICAgICAgICAgICAgcmFzdGVyLmZpdEJvdW5kcyh0aGlzLmdldFZpZXdhYmxlQm91bmRzKCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2JhY2tncm91bmRJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmRJbWFnZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmRJbWFnZSA9IHJhc3RlcjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFjdGlvbnMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XHJcblxyXG4gICAgICAgIGVkaXRvciA9IHtcclxuICAgICAgICAgICAgaW5pdFdvcmtzcGFjZTogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmluaXRXb3Jrc3BhY2VcIiksXHJcbiAgICAgICAgICAgIGxvYWRGb250OiB0aGlzLnRvcGljPHN0cmluZz4oXCJkZXNpZ25lci5sb2FkRm9udFwiKSxcclxuICAgICAgICAgICAgem9vbVRvRml0OiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuem9vbVRvRml0XCIpLFxyXG4gICAgICAgICAgICBleHBvcnRpbmdJbWFnZTogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydEltYWdlXCIpLFxyXG4gICAgICAgICAgICBleHBvcnRQTkc6IHRoaXMudG9waWM8SW1hZ2VFeHBvcnRPcHRpb25zPihcImRlc2lnbmVyLmV4cG9ydFBOR1wiKSxcclxuICAgICAgICAgICAgZXhwb3J0U1ZHOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0U1ZHXCIpLFxyXG4gICAgICAgICAgICB2aWV3Q2hhbmdlZDogdGhpcy50b3BpYzxwYXBlci5SZWN0YW5nbGU+KFwiZGVzaWduZXIudmlld0NoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIHVwZGF0ZVNuYXBzaG90OiB0aGlzLnRvcGljPHsgc2tldGNoSWQ6IHN0cmluZywgcG5nRGF0YVVybDogc3RyaW5nIH0+KFwiZGVzaWduZXIudXBkYXRlU25hcHNob3RcIiksXHJcbiAgICAgICAgICAgIHRvZ2dsZUhlbHA6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci50b2dnbGVIZWxwXCIpLFxyXG4gICAgICAgICAgICBvcGVuU2FtcGxlOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIub3BlblNhbXBsZVwiKSxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNrZXRjaCA9IHtcclxuICAgICAgICAgICAgY3JlYXRlOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmNyZWF0ZVwiKSxcclxuICAgICAgICAgICAgY2xlYXI6IHRoaXMudG9waWM8dm9pZD4oXCJza2V0Y2guY2xlYXJcIiksXHJcbiAgICAgICAgICAgIGNsb25lOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmNsb25lXCIpLFxyXG4gICAgICAgICAgICBvcGVuOiB0aGlzLnRvcGljPHN0cmluZz4oXCJza2V0Y2gub3BlblwiKSxcclxuICAgICAgICAgICAgYXR0clVwZGF0ZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5hdHRyVXBkYXRlXCIpLFxyXG4gICAgICAgICAgICBzZXRTZWxlY3Rpb246IHRoaXMudG9waWM8V29ya3NwYWNlT2JqZWN0UmVmPihcInNrZXRjaC5zZXRTZWxlY3Rpb25cIiksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGV4dEJsb2NrID0ge1xyXG4gICAgICAgICAgICBhZGQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRCbG9jay5hZGRcIiksXHJcbiAgICAgICAgICAgIHVwZGF0ZUF0dHI6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRCbG9jay51cGRhdGVBdHRyXCIpLFxyXG4gICAgICAgICAgICB1cGRhdGVBcnJhbmdlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0QmxvY2sudXBkYXRlQXJyYW5nZVwiKSxcclxuICAgICAgICAgICAgcmVtb3ZlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0QmxvY2sucmVtb3ZlXCIpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50cyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcclxuXHJcbiAgICAgICAgZWRpdG9yID0ge1xyXG4gICAgICAgICAgICByZXNvdXJjZXNSZWFkeTogdGhpcy50b3BpYzxib29sZWFuPihcImFwcC5yZXNvdXJjZXNSZWFkeVwiKSxcclxuICAgICAgICAgICAgd29ya3NwYWNlSW5pdGlhbGl6ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJhcHAud29ya3NwYWNlSW5pdGlhbGl6ZWRcIiksXHJcbiAgICAgICAgICAgIGZvbnRMb2FkZWQ6IHRoaXMudG9waWM8b3BlbnR5cGUuRm9udD4oXCJhcHAuZm9udExvYWRlZFwiKSxcclxuICAgICAgICAgICAgem9vbVRvRml0UmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkXCIpLFxyXG4gICAgICAgICAgICBleHBvcnRQTkdSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8SW1hZ2VFeHBvcnRPcHRpb25zPihcImRlc2lnbmVyLmV4cG9ydFBOR1JlcXVlc3RlZFwiKSxcclxuICAgICAgICAgICAgZXhwb3J0U1ZHUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0U1ZHUmVxdWVzdGVkXCIpLFxyXG4gICAgICAgICAgICB2aWV3Q2hhbmdlZDogdGhpcy50b3BpYzxwYXBlci5SZWN0YW5nbGU+KFwiZGVzaWduZXIudmlld0NoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIHNuYXBzaG90RXhwaXJlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwiZGVzaWduZXIuc25hcHNob3RFeHBpcmVkXCIpLFxyXG4gICAgICAgICAgICB1c2VyTWVzc2FnZUNoYW5nZWQ6IHRoaXMudG9waWM8c3RyaW5nPihcImRlc2lnbmVyLnVzZXJNZXNzYWdlQ2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgc2hvd0hlbHBDaGFuZ2VkOiB0aGlzLnRvcGljPGJvb2xlYW4+KFwiZGVzaWduZXIuc2hvd0hlbHBDaGFuZ2VkXCIpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2tldGNoID0ge1xyXG4gICAgICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5sb2FkZWRcIiksXHJcbiAgICAgICAgICAgIGF0dHJDaGFuZ2VkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2guYXR0ckNoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIGNvbnRlbnRDaGFuZ2VkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2guY29udGVudENoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIGVkaXRpbmdJdGVtQ2hhbmdlZDogdGhpcy50b3BpYzxQb3NpdGlvbmVkT2JqZWN0UmVmPihcInNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIHNlbGVjdGlvbkNoYW5nZWQ6IHRoaXMudG9waWM8V29ya3NwYWNlT2JqZWN0UmVmPihcInNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBzYXZlTG9jYWxSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJza2V0Y2guc2F2ZWxvY2FsLnNhdmVMb2NhbFJlcXVlc3RlZFwiKSxcclxuICAgICAgICAgICAgY2xvbmVkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2guY2xvbmVkXCIpLFxyXG4gICAgICAgICAgICBpbWFnZVVwbG9hZGVkOiB0aGlzLnRvcGljPHN0cmluZz4oXCJza2V0Y2guaW1hZ2VVcGxvYWRlZFwiKSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0ZXh0YmxvY2sgPSB7XHJcbiAgICAgICAgICAgIGFkZGVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYWRkZWRcIiksXHJcbiAgICAgICAgICAgIGF0dHJDaGFuZ2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYXR0ckNoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIGZvbnRSZWFkeTogdGhpcy50b3BpYzx7IHRleHRCbG9ja0lkOiBzdHJpbmcsIGZvbnQ6IG9wZW50eXBlLkZvbnQgfT4oXCJ0ZXh0YmxvY2suZm9udFJlYWR5XCIpLFxyXG4gICAgICAgICAgICBhcnJhbmdlQ2hhbmdlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFycmFuZ2VDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICByZW1vdmVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2sucmVtb3ZlZFwiKSxcclxuICAgICAgICAgICAgbG9hZGVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2subG9hZGVkXCIpLFxyXG4gICAgICAgICAgICBlZGl0b3JDbG9zZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5lZGl0b3JDbG9zZWRcIiksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIENoYW5uZWxzIHtcclxuICAgICAgICBhY3Rpb25zOiBBY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgICAgICBldmVudHM6IEV2ZW50cyA9IG5ldyBFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICB0eXBlIEFjdGlvblR5cGVzID1cclxuICAgICAgICBcInNrZXRjaC5jcmVhdGVcIlxyXG4gICAgICAgIHwgXCJza2V0Y2gudXBkYXRlXCJcclxuICAgICAgICB8IFwidGV4dGJsb2NrLmFkZFwiXHJcbiAgICAgICAgfCBcInRleHRibG9jay51cGRhdGVcIjtcclxuXHJcbiAgICB0eXBlIEV2ZW50VHlwZXMgPVxyXG4gICAgICAgIFwic2tldGNoLmxvYWRlZFwiXHJcbiAgICAgICAgfCBcInNrZXRjaC5jaGFuZ2VkXCJcclxuICAgICAgICB8IFwidGV4dGJsb2NrLmFkZGVkXCJcclxuICAgICAgICB8IFwidGV4dGJsb2NrLmNoYW5nZWRcIjtcclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFZDb250cm9sIHtcclxuICAgICAgICByZW5kZXIoKTogVk5vZGU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgT3BlcmF0aW9uIGV4dGVuZHMgVkNvbnRyb2wge1xyXG4gICAgICAgIG9uQ2xvc2U6ICgpID0+IHZvaWQ7IFxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRWRpdG9yU3RhdGUge1xyXG4gICAgICAgIGJyb3dzZXJJZD86IHN0cmluZztcclxuICAgICAgICBlZGl0aW5nSXRlbT86IFBvc2l0aW9uZWRPYmplY3RSZWY7XHJcbiAgICAgICAgc2VsZWN0aW9uPzogV29ya3NwYWNlT2JqZWN0UmVmO1xyXG4gICAgICAgIGxvYWRpbmdTa2V0Y2g/OiBib29sZWFuO1xyXG4gICAgICAgIHVzZXJNZXNzYWdlPzogc3RyaW5nO1xyXG4gICAgICAgIHNrZXRjaD86IFNrZXRjaDtcclxuICAgICAgICBzaG93SGVscD86IGJvb2xlYW47XHJcbiAgICAgICAgc2tldGNoSXNEaXJ0eT86IGJvb2xlYW47XHJcbiAgICAgICAgb3BlcmF0aW9uPzogT3BlcmF0aW9uO1xyXG4gICAgICAgIHRyYW5zcGFyZW5jeT86IGJvb2xlYW47XHJcbiAgICAgICAgdXBsb2FkZWRJbWFnZT86IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFN0b3JlUmVzb3VyY2VzIHtcclxuICAgICAgICBmYWxsYmFja0ZvbnQ/OiBvcGVudHlwZS5Gb250XHJcbiAgICAgICAgZm9udENhdGFsb2c/OiBGb250U2hhcGUuRm9udENhdGFsb2dcclxuICAgICAgICBwYXJzZWRGb250cz86IEZvbnRTaGFwZS5QYXJzZWRGb250c1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2tldGNoIGV4dGVuZHMgU2tldGNoQXR0ciB7XHJcbiAgICAgICAgX2lkOiBzdHJpbmc7XHJcbiAgICAgICAgYnJvd3NlcklkPzogc3RyaW5nO1xyXG4gICAgICAgIHNhdmVkQXQ/OiBEYXRlO1xyXG4gICAgICAgIHRleHRCbG9ja3M/OiBUZXh0QmxvY2tbXTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFNrZXRjaEF0dHIge1xyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgICAgICBkZWZhdWx0VGV4dEJsb2NrQXR0cj86IFRleHRCbG9jaztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEZvbnREZXNjcmlwdGlvbiB7XHJcbiAgICAgICAgZmFtaWx5OiBzdHJpbmc7XHJcbiAgICAgICAgY2F0ZWdvcnk6IHN0cmluZztcclxuICAgICAgICB2YXJpYW50OiBzdHJpbmc7XHJcbiAgICAgICAgdXJsOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBXb3Jrc3BhY2VPYmplY3RSZWYge1xyXG4gICAgICAgIGl0ZW1JZDogc3RyaW5nO1xyXG4gICAgICAgIGl0ZW1UeXBlPzogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUG9zaXRpb25lZE9iamVjdFJlZiBleHRlbmRzIFdvcmtzcGFjZU9iamVjdFJlZiB7XHJcbiAgICAgICAgY2xpZW50WD86IG51bWJlcjtcclxuICAgICAgICBjbGllbnRZPzogbnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGV4dEJsb2NrIGV4dGVuZHMgQmxvY2tBcnJhbmdlbWVudCB7XHJcbiAgICAgICAgX2lkPzogc3RyaW5nO1xyXG4gICAgICAgIHRleHQ/OiBzdHJpbmc7XHJcbiAgICAgICAgdGV4dENvbG9yPzogc3RyaW5nO1xyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgICAgICBmb250RmFtaWx5Pzogc3RyaW5nO1xyXG4gICAgICAgIGZvbnRWYXJpYW50Pzogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmxvY2tBcnJhbmdlbWVudCB7XHJcbiAgICAgICAgcG9zaXRpb24/OiBudW1iZXJbXSxcclxuICAgICAgICBvdXRsaW5lPzoge1xyXG4gICAgICAgICAgICB0b3A6IFBhdGhSZWNvcmQsXHJcbiAgICAgICAgICAgIGJvdHRvbTogUGF0aFJlY29yZFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJhY2tncm91bmRBY3Rpb25TdGF0dXMge1xyXG4gICAgICAgIGFjdGlvbj86IE9iamVjdDtcclxuICAgICAgICByZWplY3RlZD86IGJvb2xlYW47XHJcbiAgICAgICAgZXJyb3I/OiBib29sZWFuXHJcbiAgICAgICAgbWVzc2FnZT86IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFBhdGhSZWNvcmQge1xyXG4gICAgICAgIHNlZ21lbnRzOiBTZWdtZW50UmVjb3JkW107XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbWFnZUV4cG9ydE9wdGlvbnMge1xyXG4gICAgICAgIHBpeGVscz86IG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgdHlwZSBTZWdtZW50UmVjb3JkID0gQXJyYXk8UG9pbnRSZWNvcmQ+IHwgQXJyYXk8bnVtYmVyPjtcclxuXHJcbiAgICBleHBvcnQgdHlwZSBQb2ludFJlY29yZCA9IEFycmF5PG51bWJlcj47XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEltYWdlIGltcGxlbWVudHMgT3BlcmF0aW9uIHtcclxuXHJcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIG9uQ2xvc2U6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW5kZXIoKTogVk5vZGUge1xyXG4gICAgICAgICAgICByZXR1cm4gaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJoM1wiLCBbXCJVcGxvYWQgaW1hZ2VcIl0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZmlsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZXYudGFyZ2V0KS5maWxlc1swXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWQoZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHVwbG9hZChmaWxlKSB7XHJcbiAgICAgICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgdmFyIHVybCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTDtcclxuICAgICAgICAgICAgdmFyIHNyYyA9IHVybC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuaW1hZ2VVcGxvYWRlZChzcmMpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2UgJiYgdGhpcy5vbkNsb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIiAgICBcclxubmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRGb250RGVzY3JpcHRpb24oZmFtaWx5OiBGb250U2hhcGUuRmFtaWx5UmVjb3JkLCB2YXJpYW50Pzogc3RyaW5nKVxyXG4gICAgICAgIDogRm9udERlc2NyaXB0aW9uIHtcclxuICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XHJcbiAgICAgICAgdXJsID0gZmFtaWx5LmZpbGVzW3ZhcmlhbnQgfHwgXCJyZWd1bGFyXCJdO1xyXG4gICAgICAgIGlmKCF1cmwpe1xyXG4gICAgICAgICAgICB1cmwgPSBmYW1pbHkuZmlsZXNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZhbWlseTogZmFtaWx5LmZhbWlseSxcclxuICAgICAgICAgICAgY2F0ZWdvcnk6IGZhbWlseS5jYXRlZ29yeSxcclxuICAgICAgICAgICAgdmFyaWFudDogdmFyaWFudCxcclxuICAgICAgICAgICAgdXJsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUzNBY2Nlc3Mge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVcGxvYWQgZmlsZSB0byBhcHBsaWNhdGlvbiBTMyBidWNrZXQuXHJcbiAgICAgICAgICogUmV0dXJucyB1cGxvYWQgVVJMIGFzIGEgcHJvbWlzZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgcHV0RmlsZShmaWxlTmFtZTogc3RyaW5nLCBmaWxlVHlwZTogc3RyaW5nLCBkYXRhOiBCbG9iIHwgc3RyaW5nKVxyXG4gICAgICAgICAgICA6IEpRdWVyeVByb21pc2U8c3RyaW5nPiB7XHJcblxyXG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMvaXNzdWVzLzE5MCAgIFxyXG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvRmlyZWZveC8pICYmICFmaWxlVHlwZS5tYXRjaCgvOy8pKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hhcnNldCA9ICc7IGNoYXJzZXQ9VVRGLTgnO1xyXG4gICAgICAgICAgICAgICAgZmlsZVR5cGUgKz0gY2hhcnNldDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2lnblVybCA9IGAvYXBpL3N0b3JhZ2UvYWNjZXNzP2ZpbGVOYW1lPSR7ZmlsZU5hbWV9JmZpbGVUeXBlPSR7ZmlsZVR5cGV9YDtcclxuICAgICAgICAgICAgLy8gZ2V0IHNpZ25lZCBVUkxcclxuICAgICAgICAgICAgcmV0dXJuICQuZ2V0SlNPTihzaWduVXJsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBzaWduUmVzcG9uc2UgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBQVVQgZmlsZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1dFJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHNpZ25SZXNwb25zZS5zaWduZWRSZXF1ZXN0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIngtYW16LWFjbFwiOiBcInB1YmxpYy1yZWFkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmlsZVR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5hamF4KHB1dFJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXRSZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVwbG9hZGVkIGZpbGVcIiwgc2lnblJlc3BvbnNlLnVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2lnblJlc3BvbnNlLnVybDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciB1cGxvYWRpbmcgdG8gUzNcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3Igb24gL2FwaS9zdG9yYWdlL2FjY2Vzc1wiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEb3dubG9hZCBmaWxlIGZyb20gYnVja2V0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGdldEpzb24oZmlsZU5hbWU6IHN0cmluZyk6IEpRdWVyeVByb21pc2U8T2JqZWN0PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZpbGVVcmwoZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb3dubG9hZGluZ1wiLCByZXNwb25zZS51cmwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHJlc3BvbnNlLnVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGdldEZpbGVVcmwoZmlsZU5hbWU6IHN0cmluZyk6IEpRdWVyeVByb21pc2U8eyB1cmw6IHN0cmluZyB9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBgL2FwaS9zdG9yYWdlL3VybD9maWxlTmFtZT0ke2ZpbGVOYW1lfWAsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ29sb3JQaWNrZXIge1xyXG5cclxuICAgICAgICBzdGF0aWMgREVGQVVMVF9QQUxFVFRFX0dST1VQUyA9IFtcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvODA3XHJcbiAgICAgICAgICAgICAgICBcIiNlZTQwMzVcIixcclxuICAgICAgICAgICAgICAgIFwiI2YzNzczNlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmRmNDk4XCIsXHJcbiAgICAgICAgICAgICAgICBcIiM3YmMwNDNcIixcclxuICAgICAgICAgICAgICAgIFwiIzAzOTJjZlwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS84OTRcclxuICAgICAgICAgICAgICAgIFwiI2VkYzk1MVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZWI2ODQxXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNjYzJhMzZcIixcclxuICAgICAgICAgICAgICAgIFwiIzRmMzcyZFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjMDBhMGIwXCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzE2NFxyXG4gICAgICAgICAgICAgICAgXCIjMWI4NWI4XCIsXHJcbiAgICAgICAgICAgICAgICBcIiM1YTUyNTVcIixcclxuICAgICAgICAgICAgICAgIFwiIzU1OWU4M1wiLFxyXG4gICAgICAgICAgICAgICAgXCIjYWU1YTQxXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNjM2NiNzFcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvMzg5XHJcbiAgICAgICAgICAgICAgICBcIiM0YjM4MzJcIixcclxuICAgICAgICAgICAgICAgIFwiIzg1NDQ0MlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmZmNGU2XCIsXHJcbiAgICAgICAgICAgICAgICBcIiMzYzJmMmZcIixcclxuICAgICAgICAgICAgICAgIFwiI2JlOWI3YlwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS80NTVcclxuICAgICAgICAgICAgICAgIFwiI2ZmNGU1MFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmM5MTNhXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmOWQ2MmVcIixcclxuICAgICAgICAgICAgICAgIFwiI2VhZTM3NFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZTJmNGM3XCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzcwMFxyXG4gICAgICAgICAgICAgICAgXCIjZDExMTQxXCIsXHJcbiAgICAgICAgICAgICAgICBcIiMwMGIxNTlcIixcclxuICAgICAgICAgICAgICAgIFwiIzAwYWVkYlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZjM3NzM1XCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmZmM0MjVcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvODI2XHJcbiAgICAgICAgICAgICAgICBcIiNlOGQxNzRcIixcclxuICAgICAgICAgICAgICAgIFwiI2UzOWU1NFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZDY0ZDRkXCIsXHJcbiAgICAgICAgICAgICAgICBcIiM0ZDczNThcIixcclxuICAgICAgICAgICAgICAgIFwiIzllZDY3MFwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHN0YXRpYyBNT05PX1BBTEVUVEUgPSBbXCIjMDAwXCIsIFwiIzQ0NFwiLCBcIiM2NjZcIiwgXCIjOTk5XCIsIFwiI2NjY1wiLCBcIiNlZWVcIiwgXCIjZjNmM2YzXCIsIFwiI2ZmZlwiXTtcclxuXHJcbiAgICAgICAgc3RhdGljIHNldHVwKGVsZW0sIGZlYXR1cmVkQ29sb3JzOiBzdHJpbmdbXSwgb25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgY29uc3QgZmVhdHVyZWRHcm91cHMgPSBfLmNodW5rKGZlYXR1cmVkQ29sb3JzLCA1KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZvciBlYWNoIHBhbGV0dGUgZ3JvdXBcclxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFBhbGV0dGVHcm91cHMgPSBDb2xvclBpY2tlci5ERUZBVUxUX1BBTEVUVEVfR1JPVVBTLm1hcChncm91cCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyc2VkR3JvdXAgPSBncm91cC5tYXAoYyA9PiBuZXcgcGFwZXIuQ29sb3IoYykpO1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGxpZ2h0IHZhcmlhbnRzIG9mIGRhcmtlc3QgdGhyZWVcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFkZENvbG9ycyA9IF8uc29ydEJ5KHBhcnNlZEdyb3VwLCBjID0+IGMubGlnaHRuZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zbGljZSgwLCAzKVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoYyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGMyID0gYy5jbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjMi5saWdodG5lc3MgPSAwLjg1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYzI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRHcm91cCA9IHBhcnNlZEdyb3VwLmNvbmNhdChhZGRDb2xvcnMpO1xyXG4gICAgICAgICAgICAgICAgcGFyc2VkR3JvdXAgPSBfLnNvcnRCeShwYXJzZWRHcm91cCwgYyA9PiBjLmxpZ2h0bmVzcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkR3JvdXAubWFwKGMgPT4gYy50b0NTUyh0cnVlKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcGFsZXR0ZSA9IGZlYXR1cmVkR3JvdXBzLmNvbmNhdChkZWZhdWx0UGFsZXR0ZUdyb3Vwcyk7XHJcbiAgICAgICAgICAgIHBhbGV0dGUucHVzaChDb2xvclBpY2tlci5NT05PX1BBTEVUVEUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNlbCA9IDxhbnk+JChlbGVtKTtcclxuICAgICAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oe1xyXG4gICAgICAgICAgICAgICAgc2hvd0lucHV0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dFbXB0eTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHByZWZlcnJlZEZvcm1hdDogXCJoZXhcIixcclxuICAgICAgICAgICAgICAgIHNob3dCdXR0b25zOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNob3dBbHBoYTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNob3dQYWxldHRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2hvd1NlbGVjdGlvblBhbGV0dGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcGFsZXR0ZTogcGFsZXR0ZSxcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZUtleTogXCJza2V0Y2h0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2U6IG9uQ2hhbmdlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHN0YXRpYyBzZXQoZWxlbTogSFRNTEVsZW1lbnQsIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oXCJzZXRcIiwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGRlc3Ryb3koZWxlbSkge1xyXG4gICAgICAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bShcImRlc3Ryb3lcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBFZGl0b3JCYXIgZXh0ZW5kcyBDb21wb25lbnQ8RWRpdG9yU3RhdGU+IHtcclxuXHJcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNrZXRjaERvbSQgPSBzdG9yZS5ldmVudHMubWVyZ2UoXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZCxcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQsXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLnVzZXJNZXNzYWdlQ2hhbmdlZClcclxuICAgICAgICAgICAgICAgIC5tYXAobSA9PiB0aGlzLnJlbmRlcihzdG9yZS5zdGF0ZSkpO1xyXG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oc2tldGNoRG9tJCwgY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW5kZXIoc3RhdGU6IEVkaXRvclN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNrZXRjaCA9IHN0YXRlLnNrZXRjaDtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaChcImRpdlwiLCBbXHJcbiAgICAgICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJBZGQgdGV4dDogXCIpLFxyXG4gICAgICAgICAgICAgICAgaChcImlucHV0LmFkZC10ZXh0XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGV2LndoaWNoIHx8IGV2LmtleUNvZGUpID09PSBEb21IZWxwZXJzLktleUNvZGVzLkVudGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGV2LnRhcmdldCAmJiBldi50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2suYWRkLmRpc3BhdGNoKHsgdGV4dDogdGV4dCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYudGFyZ2V0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIlByZXNzIFtFbnRlcl0gdG8gYWRkXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImxhYmVsXCIsIFwiQmFja2dyb3VuZDogXCIpLFxyXG4gICAgICAgICAgICAgICAgaChcImlucHV0LmJhY2tncm91bmQtY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBza2V0Y2guYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmF0dHJVcGRhdGUuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfHwgXCJcIiB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU6IChvbGRWbm9kZSwgdm5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXQodm5vZGUuZWxtLCBza2V0Y2guYmFja2dyb3VuZENvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICAgICAgQm9vdFNjcmlwdC5kcm9wZG93bih7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IFwic2tldGNoTWVudVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiQWN0aW9uc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiTmV3XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiQ3JlYXRlIG5ldyBza2V0Y2hcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guY3JlYXRlLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiQ2xlYXIgYWxsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiQ2xlYXIgc2tldGNoIGNvbnRlbnRzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmNsZWFyLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiWm9vbSB0byBmaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJGaXQgY29udGVudHMgaW4gdmlld1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci56b29tVG9GaXQuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRXhwb3J0IHNtYWxsIGltYWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRXhwb3J0IHNrZXRjaCBhcyBQTkdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLmV4cG9ydFBORy5kaXNwYXRjaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXhlbHM6IDEwMCAqIDEwMDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkV4cG9ydCBtZWRpdW0gaW1hZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFeHBvcnQgc2tldGNoIGFzIFBOR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3IuZXhwb3J0UE5HLmRpc3BhdGNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpeGVsczogNTAwICogMTAwMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRXhwb3J0IFNWR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkV4cG9ydCBza2V0Y2ggYXMgdmVjdG9yIGdyYXBoaWNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLmV4cG9ydFNWRy5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkR1cGxpY2F0ZSBza2V0Y2ggKG5ldyBVUkwpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiQ29weSBjb250ZW50cyBpbnRvIGEgc2tldGNoIHdpdGggYSBuZXcgYWRkcmVzc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5jbG9uZS5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkxvYWQgc2FtcGxlIHNrZXRjaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIk9wZW4gYSBzYW1wbGUgc2tldGNoIHRvIHBsYXkgd2l0aFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci5vcGVuU2FtcGxlLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiVXBsb2FkIHRyYWNpbmcgaW1hZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJVcGxvYWQgaW1hZ2UgaW50byB3b3Jrc3BhY2UgZm9yIHRyYWNpbmdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuc2hvd09wZXJhdGlvbihuZXcgVXBsb2FkSW1hZ2UodGhpcy5zdG9yZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiUmVtb3ZlIHRyYWNpbmcgaW1hZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJSZW1vdmUgYmFja2dyb3VuZCB0cmFjaW5nIGltYWdlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLnJlbW92ZVVwbG9hZGVkSW1hZ2UoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlRvZ2dsZSB0cmFuc3BhcmVuY3lcIixcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJTZWUgdGhyb3VnaCB0ZXh0IHRvIGVsZW1lbnRzIGJlaGluZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5zZXRUcmFuc3BhcmVuY3koIXRoaXMuc3RvcmUuc3RhdGUudHJhbnNwYXJlbmN5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGgoXCJkaXYjcmlnaHRTaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2I3VzZXItbWVzc2FnZVwiLCB7fSwgW3N0YXRlLnVzZXJNZXNzYWdlIHx8IFwiXCJdKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYjc2hvdy1oZWxwLmdseXBoaWNvbi5nbHlwaGljb24tcXVlc3Rpb24tc2lnblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuZGlzcGF0Y2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcblxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImludGVyZmFjZSBKUXVlcnkge1xyXG4gICAgc2VsZWN0cGlja2VyKC4uLmFyZ3M6IGFueVtdKTtcclxuICAgIC8vcmVwbGFjZU9wdGlvbnMob3B0aW9uczogQXJyYXk8e3ZhbHVlOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmd9Pik7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBGb250UGlja2VyIHtcclxuXHJcbiAgICAgICAgZGVmYXVsdEZvbnRGYW1pbHkgPSBcIlJvYm90b1wiO1xyXG4gICAgICAgIHByZXZpZXdGb250U2l6ZSA9IFwiMjhweFwiO1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlLCBibG9jazogVGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgY29uc3QgZG9tJCA9IFJ4Lk9ic2VydmFibGUuanVzdChibG9jaylcclxuICAgICAgICAgICAgICAgIC5tZXJnZShcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihtID0+IG0uZGF0YS5faWQgPT09IGJsb2NrLl9pZClcclxuICAgICAgICAgICAgICAgICAgICAubWFwKG0gPT4gbS5kYXRhKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgLm1hcCh0YiA9PiB0aGlzLnJlbmRlcih0YikpO1xyXG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oZG9tJCwgY29udGFpbmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbmRlcihibG9jazogVGV4dEJsb2NrKTogVk5vZGUge1xyXG4gICAgICAgICAgICBsZXQgdXBkYXRlID0gcGF0Y2ggPT4ge1xyXG4gICAgICAgICAgICAgICAgcGF0Y2guX2lkID0gYmxvY2suX2lkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyLmRpc3BhdGNoKHBhdGNoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudHM6IFZOb2RlW10gPSBbXTtcclxuICAgICAgICAgICAgZWxlbWVudHMucHVzaChcclxuICAgICAgICAgICAgICAgIGgoXCJzZWxlY3RcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJzZWxlY3RQaWNrZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZmFtaWx5LXBpY2tlclwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB2bm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHVwZGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogZXYudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRWYXJpYW50OiBGb250U2hhcGUuRm9udENhdGFsb2cuZGVmYXVsdFZhcmlhbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUucmVzb3VyY2VzLmZvbnRDYXRhbG9nLmdldFJlY29yZChldi50YXJnZXQudmFsdWUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5yZXNvdXJjZXMuZm9udENhdGFsb2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmdldExpc3QodGhpcy5zdG9yZS5mb250TGlzdExpbWl0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChyZWNvcmQ6IEZvbnRTaGFwZS5GYW1pbHlSZWNvcmQpID0+IGgoXCJvcHRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogcmVjb3JkLmZhbWlseSA9PT0gYmxvY2suZm9udEZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWNvbnRlbnRcIjogYDxzcGFuIHN0eWxlPVwiJHtGb250SGVscGVycy5nZXRTdHlsZVN0cmluZyhyZWNvcmQuZmFtaWx5LCBudWxsLCB0aGlzLnByZXZpZXdGb250U2l6ZSl9XCI+JHtyZWNvcmQuZmFtaWx5fTwvc3Bhbj5gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcmVjb3JkLmZhbWlseV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRGYW1pbHkgPSB0aGlzLnN0b3JlLnJlc291cmNlcy5mb250Q2F0YWxvZy5nZXRSZWNvcmQoYmxvY2suZm9udEZhbWlseSk7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEZhbWlseSAmJiBzZWxlY3RlZEZhbWlseS52YXJpYW50c1xyXG4gICAgICAgICAgICAgICAgJiYgc2VsZWN0ZWRGYW1pbHkudmFyaWFudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChoKFwic2VsZWN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwidmFyaWFudFBpY2tlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYW50LXBpY2tlclwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB2bm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0cGF0Y2g6IChvbGRWbm9kZSwgdm5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUTogd2h5IGNhbid0IHdlIGp1c3QgZG8gc2VsZWN0cGlja2VyKHJlZnJlc2gpIGhlcmU/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEE6IHNlbGVjdHBpY2tlciBoYXMgbWVudGFsIHByb2JsZW1zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoXCJkZXN0cm95XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoeyBmb250VmFyaWFudDogZXYudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmFtaWx5LnZhcmlhbnRzLm1hcCh2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJvcHRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogdiA9PT0gYmxvY2suZm9udFZhcmlhbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGFpbmVyXCI6IFwiYm9keVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGVudFwiOiBgPHNwYW4gc3R5bGU9XCIke0ZvbnRIZWxwZXJzLmdldFN0eWxlU3RyaW5nKHNlbGVjdGVkRmFtaWx5LmZhbWlseSwgdiwgdGhpcy5wcmV2aWV3Rm9udFNpemUpfVwiPiR7dn08L3NwYW4+YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdl0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHsgXCJmb250LXBpY2tlclwiOiB0cnVlIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50c1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEhlbHBEaWFsb2cge1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgY29uc3Qgb3V0ZXIgPSAkKGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIG91dGVyLmFwcGVuZChcIjxoMz5HZXR0aW5nIHN0YXJ0ZWQ8L2gzPlwiKTtcclxuICAgICAgICAgICAgc3RvcmUuc3RhdGUuc2hvd0hlbHAgPyBvdXRlci5zaG93KCkgOiBvdXRlci5oaWRlKCk7XHJcbiAgICAgICAgICAgICQuZ2V0KFwiY29udGVudC9oZWxwLmh0bWxcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9zZSA9ICQoXCI8YnV0dG9uIGNsYXNzPSdidG4gYnRuLWRlZmF1bHQnPiBDbG9zZSA8L2J1dHRvbj5cIik7XHJcbiAgICAgICAgICAgICAgICBjbG9zZS5vbihcImNsaWNrXCIsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuZGlzcGF0Y2goKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgb3V0ZXIuYXBwZW5kKCQoZCkpXHJcbiAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoY2xvc2UpXHJcbiAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXCI8YSBjbGFzcz0ncmlnaHQnIGhyZWY9J21haWx0bzpmaWRkbGVzdGlja3NAY29kZWZsaWdodC5pbyc+RW1haWwgdXM8L2E+XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5zaG93SGVscENoYW5nZWQuc3ViKHNob3cgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2hvdyA/IG91dGVyLnNob3coKSA6IG91dGVyLmhpZGUoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgT3BlcmF0aW9uUGFuZWwge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSl7XHJcbiBcclxuICAgICAgICAgICAgY29uc3QgZG9tJCA9IHN0b3JlLm9wZXJhdGlvbiQubWFwKG9wID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKCFvcCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXYuaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXYub3BlcmF0aW9uXCIsIFtvcC5yZW5kZXIoKV0pO1xyXG4gICAgICAgICAgICB9KSAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTZWxlY3RlZEl0ZW1FZGl0b3Ige1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRvbSQgPSBzdG9yZS5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5vYnNlcnZlKClcclxuICAgICAgICAgICAgICAgIC5tYXAoaSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc0l0ZW0gPSA8UG9zaXRpb25lZE9iamVjdFJlZj5pLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gcG9zSXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBwb3NJdGVtLml0ZW1UeXBlID09PSAnVGV4dEJsb2NrJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBfLmZpbmQoc3RvcmUuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiID0+IGIuX2lkID09PSBwb3NJdGVtLml0ZW1JZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0OiBwb3NJdGVtLmNsaWVudFggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9wOiBwb3NJdGVtLmNsaWVudFkgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFRleHRCbG9ja0VkaXRvcihzdG9yZSkucmVuZGVyKGJsb2NrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRCbG9ja0VkaXRvciBleHRlbmRzIENvbXBvbmVudDxUZXh0QmxvY2s+IHtcclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW5kZXIodGV4dEJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIGxldCB1cGRhdGUgPSB0YiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0Yi5faWQgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyLmRpc3BhdGNoKHRiKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2LnRleHQtYmxvY2stZWRpdG9yXCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiB0ZXh0QmxvY2suX2lkXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJ0ZXh0YXJlYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2OiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoeyB0ZXh0OiAoPEhUTUxUZXh0QXJlYUVsZW1lbnQ+ZXYudGFyZ2V0KS52YWx1ZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoeyB0ZXh0OiBldi50YXJnZXQudmFsdWUgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1jb2xvci1pY29uLmZvcmVcIiwge30sIFwiQVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC50ZXh0LWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlRleHQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2sudGV4dENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB1cGRhdGUoeyB0ZXh0Q29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5iYWNrXCIsIHt9LCBcIkFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCYWNrZ3JvdW5kIGNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTa2V0Y2hIZWxwZXJzLmNvbG9yc0luVXNlKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgYmFja2dyb3VuZENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICh2bm9kZSkgPT4gQ29sb3JQaWNrZXIuZGVzdHJveSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaChcImJ1dHRvbi5kZWxldGUtdGV4dGJsb2NrLmJ0bi5idG4tZGFuZ2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZS5kaXNwYXRjaCh0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuLmdseXBoaWNvbi5nbHlwaGljb24tdHJhc2hcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1waWNrZXItY29udGFpbmVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEZvbnRQaWNrZXIodm5vZGUuZWxtLCB0aGlzLnN0b3JlLCB0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGluc2VydDogKHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IHByb3BzOiBGb250UGlja2VyUHJvcHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBzdG9yZTogdGhpcy5zdG9yZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHNlbGVjdGlvbjogdGV4dEJsb2NrLmZvbnREZXNjLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogKGZvbnREZXNjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgdXBkYXRlKHsgZm9udERlc2MgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIFJlYWN0RE9NLnJlbmRlcihyaChGb250UGlja2VyLCBwcm9wcyksIHZub2RlLmVsbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEdWFsQm91bmRzUGF0aFdhcnAgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBQT0lOVFNfUEVSX1BBVEggPSAyMDA7XHJcbiAgICAgICAgc3RhdGljIFVQREFURV9ERUJPVU5DRSA9IDE1MDtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc291cmNlOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICAgICAgcHJpdmF0ZSBfdXBwZXI6IFN0cmV0Y2hQYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX2xvd2VyOiBTdHJldGNoUGF0aDtcclxuICAgICAgICBwcml2YXRlIF93YXJwZWQ6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgICAgICBwcml2YXRlIF9vdXRsaW5lOiBwYXBlci5QYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX2N1c3RvbVN0eWxlOiBTa2V0Y2hJdGVtU3R5bGU7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBzb3VyY2U6IHBhcGVyLkNvbXBvdW5kUGF0aCxcclxuICAgICAgICAgICAgYm91bmRzPzogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH0sXHJcbiAgICAgICAgICAgIGN1c3RvbVN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcblxyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYnVpbGQgY2hpbGRyZW4gLS1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJvdW5kcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIgPSBuZXcgU3RyZXRjaFBhdGgoYm91bmRzLnVwcGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvd2VyID0gbmV3IFN0cmV0Y2hQYXRoKGJvdW5kcy5sb3dlcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cHBlciA9IG5ldyBTdHJldGNoUGF0aChbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy50b3BMZWZ0KSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLnRvcFJpZ2h0KVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb3dlciA9IG5ldyBTdHJldGNoUGF0aChbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy5ib3R0b21MZWZ0KSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLmJvdHRvbVJpZ2h0KVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbEJvdW5kc09wYWNpdHkgPSAwLjc1O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvd2VyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZSA9IG5ldyBwYXBlci5QYXRoKHsgY2xvc2VkOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVTaGFwZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChzb3VyY2UucGF0aERhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYWRkIGNoaWxkcmVuIC0tXHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkcmVuKFt0aGlzLl9vdXRsaW5lLCB0aGlzLl93YXJwZWQsIHRoaXMuX3VwcGVyLCB0aGlzLl9sb3dlcl0pO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYXNzaWduIHN0eWxlIC0tXHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1c3RvbVN0eWxlID0gY3VzdG9tU3R5bGUgfHwge1xyXG4gICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwiZ3JheVwiXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyAtLSBzZXQgdXAgb2JzZXJ2ZXJzIC0tXHJcblxyXG4gICAgICAgICAgICBSeC5PYnNlcnZhYmxlLm1lcmdlKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG93ZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpKVxyXG4gICAgICAgICAgICAgICAgLmRlYm91bmNlKER1YWxCb3VuZHNQYXRoV2FycC5VUERBVEVfREVCT1VOQ0UpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHBhdGggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT3V0bGluZVNoYXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVXYXJwZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VkKFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZShmbGFncyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkFUVFJJQlVURSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl91cHBlci52aXNpYmxlICE9PSB0aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb3dlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHVwcGVyKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdXBwZXIucGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBsb3dlcigpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvd2VyLnBhdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgc291cmNlKHZhbHVlOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2UgJiYgdGhpcy5fc291cmNlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc291cmNlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgY3VzdG9tU3R5bGUoKTogU2tldGNoSXRlbVN0eWxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1c3RvbVN0eWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGN1c3RvbVN0eWxlKHZhbHVlOiBTa2V0Y2hJdGVtU3R5bGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VzdG9tU3R5bGUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLnN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5iYWNrZ3JvdW5kQ29sb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGxpbmUuZmlsbENvbG9yID0gdmFsdWUuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGxpbmUuZmlsbENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGNvbnRyb2xCb3VuZHNPcGFjaXR5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIub3BhY2l0eSA9IHRoaXMuX2xvd2VyLm9wYWNpdHkgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG91dGxpbmVDb250YWlucyhwb2ludDogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX291dGxpbmUuY29udGFpbnMocG9pbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVXYXJwZWQoKSB7XHJcbiAgICAgICAgICAgIGxldCBvcnRoT3JpZ2luID0gdGhpcy5fc291cmNlLmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5fc291cmNlLmJvdW5kcy53aWR0aDtcclxuICAgICAgICAgICAgbGV0IG9ydGhIZWlnaHQgPSB0aGlzLl9zb3VyY2UuYm91bmRzLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLmR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbihcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyLnBhdGgsIHRoaXMuX2xvd2VyLnBhdGgpO1xyXG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtID0gbmV3IEZvbnRTaGFwZS5QYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChvcnRoT3JpZ2luKTtcclxuICAgICAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIG9ydGhIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhzID0gdGhpcy5fc291cmNlLmNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSA8cGFwZXIuUGF0aD5pdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhQb2ludHMgPSBQYXBlckhlbHBlcnMudHJhY2VQYXRoQXNQb2ludHMocGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgRHVhbEJvdW5kc1BhdGhXYXJwLlBPSU5UU19QRVJfUEFUSClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChwID0+IHRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludChwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFBhdGggPSBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geFBhdGg7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLmFkZENoaWxkcmVuKG5ld1BhdGhzKTtcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGMgb2YgdGhpcy5fd2FycGVkLmNoaWxkcmVuKXtcclxuICAgICAgICAgICAgICAgICg8cGFwZXIuUGF0aD5jKS5zaW1wbGlmeSgwLjAwMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlT3V0bGluZVNoYXBlKCkge1xyXG4gICAgICAgICAgICBjb25zdCBsb3dlciA9IG5ldyBwYXBlci5QYXRoKHRoaXMuX2xvd2VyLnBhdGguc2VnbWVudHMpO1xyXG4gICAgICAgICAgICBsb3dlci5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGxpbmUuc2VnbWVudHMgPSB0aGlzLl91cHBlci5wYXRoLnNlZ21lbnRzLmNvbmNhdChsb3dlci5zZWdtZW50cyk7XHJcbiAgICAgICAgICAgIGxvd2VyLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFBhdGhIYW5kbGUgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBTRUdNRU5UX01BUktFUl9SQURJVVMgPSAxMDtcclxuICAgICAgICBzdGF0aWMgQ1VSVkVfTUFSS0VSX1JBRElVUyA9IDY7XHJcbiAgICAgICAgc3RhdGljIERSQUdfVEhSRVNIT0xEID0gMztcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfbWFya2VyOiBwYXBlci5TaGFwZTtcclxuICAgICAgICBwcml2YXRlIF9zZWdtZW50OiBwYXBlci5TZWdtZW50O1xyXG4gICAgICAgIHByaXZhdGUgX2N1cnZlOiBwYXBlci5DdXJ2ZTtcclxuICAgICAgICBwcml2YXRlIF9zbW9vdGhlZDogYm9vbGVhbjtcclxuICAgICAgICBwcml2YXRlIF9jdXJ2ZVNwbGl0ID0gbmV3IE9ic2VydmFibGVFdmVudDxudW1iZXI+KCk7XHJcbiAgICAgICAgcHJpdmF0ZSBfY3VydmVDaGFuZ2VVbnN1YjogKCkgPT4gdm9pZDtcclxuICAgICAgICBwcml2YXRlIGRyYWdnaW5nO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihhdHRhY2g6IHBhcGVyLlNlZ21lbnQgfCBwYXBlci5DdXJ2ZSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uOiBwYXBlci5Qb2ludDtcclxuICAgICAgICAgICAgbGV0IHBhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgICAgIGlmIChhdHRhY2ggaW5zdGFuY2VvZiBwYXBlci5TZWdtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gPHBhcGVyLlNlZ21lbnQ+YXR0YWNoO1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLl9zZWdtZW50LnBvaW50O1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHRoaXMuX3NlZ21lbnQucGF0aDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChhdHRhY2ggaW5zdGFuY2VvZiBwYXBlci5DdXJ2ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VydmUgPSA8cGFwZXIuQ3VydmU+YXR0YWNoO1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gdGhpcy5fY3VydmUucGF0aDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiYXR0YWNoIG11c3QgYmUgU2VnbWVudCBvciBDdXJ2ZVwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIgPSBwYXBlci5TaGFwZS5DaXJjbGUocG9zaXRpb24sIFBhdGhIYW5kbGUuU0VHTUVOVF9NQVJLRVJfUkFESVVTKTtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLnN0cm9rZUNvbG9yID0gXCJibHVlXCI7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5maWxsQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5zZWxlY3RlZENvbG9yID0gbmV3IHBhcGVyLkNvbG9yKDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX21hcmtlcik7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZUFzU2VnbWVudCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZUFzQ3VydmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcGFwZXJFeHQuZXh0ZW5kTW91c2VFdmVudHModGhpcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uKHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdTdGFydCwgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3BsaXQgdGhlIGN1cnZlLCBwdXBhdGUgdG8gc2VnbWVudCBoYW5kbGVcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VydmVDaGFuZ2VVbnN1YigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQgPSBuZXcgcGFwZXIuU2VnbWVudCh0aGlzLmNlbnRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VydmVJZHggPSB0aGlzLl9jdXJ2ZS5pbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZS5wYXRoLmluc2VydChcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VydmVJZHggKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZUFzU2VnbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VydmVTcGxpdC5ub3RpZnkoY3VydmVJZHgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlRHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LnBvaW50ID0gdGhpcy5jZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3Ntb290aGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2xhdGUoZXYuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgZXYuc3RvcCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc21vb3RoZWQgPSAhdGhpcy5zbW9vdGhlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGV2LnN0b3AoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jdXJ2ZUNoYW5nZVVuc3ViID0gcGF0aC5zdWJzY3JpYmUoZmxhZ3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnZlICYmICF0aGlzLl9zZWdtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgJiYgKGZsYWdzICYgUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5TRUdNRU5UUykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuX2N1cnZlLmdldFBvaW50QXQodGhpcy5fY3VydmUubGVuZ3RoICogMC41KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHNtb290aGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc21vb3RoZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgc21vb3RoZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdGhpcy5fc21vb3RoZWQgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuaGFuZGxlSW4gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5oYW5kbGVPdXQgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgY3VydmVTcGxpdCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnZlU3BsaXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgY2VudGVyKCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgY2VudGVyKHBvaW50OiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9pbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0eWxlQXNTZWdtZW50KCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIub3BhY2l0eSA9IDAuODtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLmRhc2hBcnJheSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5yYWRpdXMgPSBQYXRoSGFuZGxlLlNFR01FTlRfTUFSS0VSX1JBRElVUztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3R5bGVBc0N1cnZlKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIub3BhY2l0eSA9IDAuODtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLmRhc2hBcnJheSA9IFsyLCAyXTtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLnJhZGl1cyA9IFBhdGhIYW5kbGUuQ1VSVkVfTUFSS0VSX1JBRElVUztcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdHJldGNoUGF0aCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfcGF0aDogcGFwZXIuUGF0aDtcclxuICAgICAgICBwcml2YXRlIF9wYXRoQ2hhbmdlZCA9IG5ldyBPYnNlcnZhYmxlRXZlbnQ8cGFwZXIuUGF0aD4oKTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc2VnbWVudHM6IHBhcGVyLlNlZ21lbnRbXSwgc3R5bGU/OiBwYXBlci5TdHlsZSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcGF0aCA9IG5ldyBwYXBlci5QYXRoKHNlZ21lbnRzKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9wYXRoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdHlsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHlsZSA9IHN0eWxlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHJva2VDb2xvciA9IFwibGlnaHRncmF5XCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXRoLnN0cm9rZVdpZHRoID0gNjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBzIG9mIHRoaXMuX3BhdGguc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkU2VnbWVudEhhbmRsZShzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBjIG9mIHRoaXMuX3BhdGguY3VydmVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKGMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgcGF0aCgpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgcGF0aENoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXRoQ2hhbmdlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYWRkU2VnbWVudEhhbmRsZShzZWdtZW50OiBwYXBlci5TZWdtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkSGFuZGxlKG5ldyBQYXRoSGFuZGxlKHNlZ21lbnQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYWRkQ3VydmVIYW5kbGUoY3VydmU6IHBhcGVyLkN1cnZlKSB7XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGUgPSBuZXcgUGF0aEhhbmRsZShjdXJ2ZSk7XHJcbiAgICAgICAgICAgIGhhbmRsZS5jdXJ2ZVNwbGl0LnN1YnNjcmliZU9uZShjdXJ2ZUlkeCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKHRoaXMuX3BhdGguY3VydmVzW2N1cnZlSWR4XSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKHRoaXMuX3BhdGguY3VydmVzW2N1cnZlSWR4ICsgMV0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5hZGRIYW5kbGUoaGFuZGxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYWRkSGFuZGxlKGhhbmRsZTogUGF0aEhhbmRsZSkge1xyXG4gICAgICAgICAgICBoYW5kbGUudmlzaWJsZSA9IHRoaXMudmlzaWJsZTtcclxuICAgICAgICAgICAgaGFuZGxlLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGhDaGFuZ2VkLm5vdGlmeSh0aGlzLl9wYXRoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGhDaGFuZ2VkLm5vdGlmeSh0aGlzLl9wYXRoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChoYW5kbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1lYXN1cmVzIG9mZnNldHMgb2YgdGV4dCBnbHlwaHMuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBUZXh0UnVsZXIge1xyXG5cclxuICAgICAgICBmb250RmFtaWx5OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFdlaWdodDogbnVtYmVyO1xyXG4gICAgICAgIGZvbnRTaXplOiBudW1iZXI7XHJcblxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlUG9pbnRUZXh0KHRleHQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICAgICAgdmFyIHBvaW50VGV4dCA9IG5ldyBwYXBlci5Qb2ludFRleHQoKTtcclxuICAgICAgICAgICAgcG9pbnRUZXh0LmNvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgICAgICBwb2ludFRleHQuanVzdGlmaWNhdGlvbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZvbnRGYW1pbHkpIHtcclxuICAgICAgICAgICAgICAgIHBvaW50VGV4dC5mb250RmFtaWx5ID0gdGhpcy5mb250RmFtaWx5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZvbnRXZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHBvaW50VGV4dC5mb250V2VpZ2h0ID0gdGhpcy5mb250V2VpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZvbnRTaXplKSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludFRleHQuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcG9pbnRUZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0VGV4dE9mZnNldHModGV4dCkge1xyXG4gICAgICAgICAgICAvLyBNZWFzdXJlIGdseXBocyBpbiBwYWlycyB0byBjYXB0dXJlIHdoaXRlIHNwYWNlLlxyXG4gICAgICAgICAgICAvLyBQYWlycyBhcmUgY2hhcmFjdGVycyBpIGFuZCBpKzEuXHJcbiAgICAgICAgICAgIHZhciBnbHlwaFBhaXJzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2x5cGhQYWlyc1tpXSA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGksIGkgKyAxKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEZvciBlYWNoIGNoYXJhY3RlciwgZmluZCBjZW50ZXIgb2Zmc2V0LlxyXG4gICAgICAgICAgICB2YXIgeE9mZnNldHMgPSBbMF07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE1lYXN1cmUgdGhyZWUgY2hhcmFjdGVycyBhdCBhIHRpbWUgdG8gZ2V0IHRoZSBhcHByb3ByaWF0ZSBcclxuICAgICAgICAgICAgICAgIC8vICAgc3BhY2UgYmVmb3JlIGFuZCBhZnRlciB0aGUgZ2x5cGguXHJcbiAgICAgICAgICAgICAgICB2YXIgdHJpYWRUZXh0ID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSAtIDEsIGkgKyAxKSk7XHJcbiAgICAgICAgICAgICAgICB0cmlhZFRleHQucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3VidHJhY3Qgb3V0IGhhbGYgb2YgcHJpb3IgZ2x5cGggcGFpciBcclxuICAgICAgICAgICAgICAgIC8vICAgYW5kIGhhbGYgb2YgY3VycmVudCBnbHlwaCBwYWlyLlxyXG4gICAgICAgICAgICAgICAgLy8gTXVzdCBiZSByaWdodCwgYmVjYXVzZSBpdCB3b3Jrcy5cclxuICAgICAgICAgICAgICAgIGxldCBvZmZzZXRXaWR0aCA9IHRyaWFkVGV4dC5ib3VuZHMud2lkdGhcclxuICAgICAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaSAtIDFdLmJvdW5kcy53aWR0aCAvIDJcclxuICAgICAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaV0uYm91bmRzLndpZHRoIC8gMjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHdpZHRoIHRvIHByaW9yIG9mZnNldC4gXHJcbiAgICAgICAgICAgICAgICB4T2Zmc2V0c1tpXSA9IHhPZmZzZXRzW2kgLSAxXSArIG9mZnNldFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBnbHlwaFBhaXIgb2YgZ2x5cGhQYWlycykge1xyXG4gICAgICAgICAgICAgICAgZ2x5cGhQYWlyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4geE9mZnNldHM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBUZXh0V2FycCBleHRlbmRzIER1YWxCb3VuZHNQYXRoV2FycCB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBERUZBVUxUX0ZPTlRfU0laRSA9IDEyODtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfZm9udDogb3BlbnR5cGUuRm9udDtcclxuICAgICAgICBwcml2YXRlIF90ZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBfZm9udFNpemU6IG51bWJlcjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgIGZvbnQ6IG9wZW50eXBlLkZvbnQsXHJcbiAgICAgICAgICAgIHRleHQ6IHN0cmluZyxcclxuICAgICAgICAgICAgYm91bmRzPzogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH0sXHJcbiAgICAgICAgICAgIGZvbnRTaXplPzogbnVtYmVyLFxyXG4gICAgICAgICAgICBzdHlsZT86IFNrZXRjaEl0ZW1TdHlsZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFmb250U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgZm9udFNpemUgPSBUZXh0V2FycC5ERUZBVUxUX0ZPTlRfU0laRTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBUZXh0V2FycC5nZXRQYXRoRGF0YShmb250LCB0ZXh0LCBmb250U2l6ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIHN1cGVyKHBhdGgsIGJvdW5kcywgc3R5bGUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHQgPSB0ZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgdGV4dCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGZvbnRTaXplKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldCBmb250U2l6ZSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9mb250U2l6ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgZm9udCh2YWx1ZTogb3BlbnR5cGUuRm9udCkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IHRoaXMuX2ZvbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGV4dFBhdGgoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXBkYXRlVGV4dFBhdGgoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGhEYXRhID0gVGV4dFdhcnAuZ2V0UGF0aERhdGEoXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250LCB0aGlzLl90ZXh0LCB0aGlzLl9mb250U2l6ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBnZXRQYXRoRGF0YShmb250OiBvcGVudHlwZS5Gb250LFxyXG4gICAgICAgICAgICB0ZXh0OiBzdHJpbmcsIGZvbnRTaXplPzogc3RyaW5nIHwgbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IG9wZW5UeXBlUGF0aCA9IGZvbnQuZ2V0UGF0aCh0ZXh0LCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgTnVtYmVyKGZvbnRTaXplKSB8fCBUZXh0V2FycC5ERUZBVUxUX0ZPTlRfU0laRSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvcGVuVHlwZVBhdGgudG9QYXRoRGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFNrZXRjaEl0ZW1TdHlsZSBleHRlbmRzIHBhcGVyLklTdHlsZSB7XHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxufSJdfQ==