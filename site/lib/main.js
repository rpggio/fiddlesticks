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
            Object.defineProperty(Watermark.prototype, "item", {
                get: function () {
                    return this._mark;
                },
                enumerable: true,
                configurable: true
            });
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
function gaEvent(event) {
    ga("send", "event", event);
}
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
        function ViewZoom(project, getBackgroundItems) {
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
                        var backgroundItems = (getBackgroundItems && getBackgroundItems()) || [];
                        // if hit is on nothing or on a non-background item
                        if (!hit.item || !backgroundItems.some(function (bi) {
                            return bi && (bi === hit.item || bi.isAncestor(hit.item));
                        })) {
                            // then don't use dragging
                            return;
                        }
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
                var newTemplateState = t.createNew(context);
                _.merge(newTemplateState, store.state.templateState);
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
                            text: "Don't gobblefunk around with words.",
                            source: "- Roald Dahl, The BFG",
                        },
                        seed: 0.9959176457803123,
                        shape: "narrow",
                        font: {
                            family: "Amatic SC",
                            variant: "regular"
                        },
                        palette: {
                            color: "#854442",
                            invert: true
                        }
                    },
                    fontCategory: "handwriting",
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
            this.sendDesignGAEvent("export", pixels);
        };
        Store.prototype.sendDesignGAEvent = function (action, value) {
            var label = this._state.template.name;
            var font = this._state.templateState.design.font;
            if (font) {
                label += ";" + font.family + " " + font.variant;
            }
            gaEvent({
                eventCategory: "Design",
                eventAction: action,
                eventLabel: label,
                eventValue: value
            });
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
                    targetLength *= (0.8 + seedRandom.random() * 0.4);
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
                        }, ["Try another variation"]);
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
            return extension ? name + "." + extension : name;
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
                _this.sendGAExport(m.data.pixels);
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
        Store.prototype.sendGAExport = function (value) {
            var label = SketchEditor.SketchHelpers.getSketchFileName(this.state.sketch, 30);
            gaEvent({
                eventCategory: "Design",
                eventAction: "export-image",
                eventLabel: label,
                eventValue: value
            });
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
            this.viewZoom = new paperExt.ViewZoom(this.project, function () { return [_this._backgroundImage]; });
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
                h("a", {
                    attrs: {
                        href: "/"
                    }
                }, [
                    h("img.logo", {
                        attrs: {
                            src: "img/spiral-logo.white.50.png"
                        }
                    })
                ]),
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
                                _this.store.actions.sketch.attrUpdate.dispatch({ backgroundColor: color && color.toHexString() || "white" });
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
                        {
                            content: "Upload temporary tracing image",
                            options: {
                                attrs: {
                                    title: "Upload image into workspace for tracing. The image will not show in final output"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Eb21IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0Rvd25sb2FkSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL1NlZWRSYW5kb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL1dhdGVybWFyay50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9jb2xsZWN0aW9ucy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ldmVudHMudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvZ29vZ2xlLWFuYWx5dGljcy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJOb3RpZnkudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvVmlld1pvb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvbW91c2VFdmVudEV4dC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9wYXBlci9wYXBlci1leHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9Db21wb25lbnQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9WRG9tSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwQ29va2llcy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L2FwcC9BcHBSb3V0ZXIudHMiLCIuLi8uLi9jbGllbnQvYXBwL1N0b3JlLnRzIiwiLi4vLi4vY2xpZW50L2RlbW8vRGVtb01vZHVsZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL0J1aWxkZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9Nb2R1bGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9QcmV2aWV3Q2FudmFzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvUmVuZGVyQ2FudmFzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvU2hhcmVPcHRpb25zVUkudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL21vZGVscy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL2NvbnRyb2xzL0NvbnRyb2xIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvRm9udENob29zZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9JbWFnZUNob29zZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9UZW1wbGF0ZUZvbnRDaG9vc2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvVGV4dElucHV0LnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvdGVtcGxhdGVzL0RpY2tlbnMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL0RvY3VtZW50S2V5SGFuZGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvU2tldGNoRWRpdG9yTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9Ta2V0Y2hIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvV29ya3NwYWNlQ29udHJvbGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvY2hhbm5lbHMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL2NvbnN0YW50cy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvbW9kZWxzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9vcGVyYXRpb25zL1VwbG9hZEltYWdlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9zZXJ2aWNlcy9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivc2VydmljZXMvUzNBY2Nlc3MudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0NvbG9yUGlja2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9FZGl0b3JCYXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0ZvbnRQaWNrZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0hlbHBEaWFsb2cudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL09wZXJhdGlvblBhbmVsLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9TZWxlY3RlZEl0ZW1FZGl0b3IudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL1RleHRCbG9ja0VkaXRvci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL0R1YWxCb3VuZHNQYXRoV2FycC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1BhdGhIYW5kbGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9TdHJldGNoUGF0aC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1RleHRSdWxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1RleHRXYXJwLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLElBQVUsVUFBVSxDQXdMbkI7QUF4TEQsV0FBVSxVQUFVLEVBQUMsQ0FBQztJQUVsQjs7Ozs7O09BTUc7SUFDSCx1QkFBOEIsT0FBTztRQUNqQyxJQUFJLGFBQWEsR0FBRyxVQUFVLENBQUM7UUFDL0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLElBQUksR0FBRyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXZDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUVELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekMsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFFM0IsSUFBSSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFM0MsR0FB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TUFBTSxFQUFFLEVBQUU7UUFDVixNQUFNLEVBQUUsRUFBRTtRQUNWLE1BQU0sRUFBRSxFQUFFO1FBQ1YsTUFBTSxFQUFFLEVBQUU7UUFDVixNQUFNLEVBQUUsRUFBRTtRQUNWLE1BQU0sRUFBRSxFQUFFO1FBQ1YsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLFVBQVUsRUFBRSxFQUFFO1FBQ2QsV0FBVyxFQUFFLEVBQUU7UUFDZixTQUFTLEVBQUUsRUFBRTtRQUNiLE9BQU8sRUFBRSxFQUFFO1FBQ1gsT0FBTyxFQUFFLEVBQUU7UUFDWCxPQUFPLEVBQUUsRUFBRTtRQUNYLE9BQU8sRUFBRSxFQUFFO1FBQ1gsT0FBTyxFQUFFLEdBQUc7UUFDWixPQUFPLEVBQUUsR0FBRztRQUNaLE9BQU8sRUFBRSxHQUFHO1FBQ1osT0FBTyxFQUFFLEdBQUc7UUFDWixPQUFPLEVBQUUsR0FBRztRQUNaLE9BQU8sRUFBRSxHQUFHO1FBQ1os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Y2VzQ29udGVudCI6WyJcclxubmFtZXNwYWNlIERvbUhlbHBlcnMge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIGJsb2IgZnJvbSBhIGRhdGEgVVJMIChlaXRoZXIgYmFzZTY0IGVuY29kZWQgb3Igbm90KS5cclxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9lYmlkZWwvZmlsZXIuanMvYmxvYi9tYXN0ZXIvc3JjL2ZpbGVyLmpzI0wxMzdcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YVVSTCBUaGUgZGF0YSBVUkwgdG8gY29udmVydC5cclxuICAgICAqIEByZXR1cm4ge0Jsb2J9IEEgYmxvYiByZXByZXNlbnRpbmcgdGhlIGFycmF5IGJ1ZmZlciBkYXRhLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGF0YVVSTFRvQmxvYihkYXRhVVJMKTogQmxvYiB7XHJcbiAgICAgICAgdmFyIEJBU0U2NF9NQVJLRVIgPSAnO2Jhc2U2NCwnO1xyXG4gICAgICAgIGlmIChkYXRhVVJMLmluZGV4T2YoQkFTRTY0X01BUktFUikgPT0gLTEpIHtcclxuICAgICAgICAgICAgdmFyIHBhcnRzID0gZGF0YVVSTC5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSBwYXJ0c1swXS5zcGxpdCgnOicpWzFdO1xyXG4gICAgICAgICAgICB2YXIgcmF3ID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQmxvYihbcmF3XSwgeyB0eXBlOiBjb250ZW50VHlwZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwYXJ0cyA9IGRhdGFVUkwuc3BsaXQoQkFTRTY0X01BUktFUik7XHJcbiAgICAgICAgdmFyIGNvbnRlbnRUeXBlID0gcGFydHNbMF0uc3BsaXQoJzonKVsxXTtcclxuICAgICAgICB2YXIgcmF3ID0gd2luZG93LmF0b2IocGFydHNbMV0pO1xyXG4gICAgICAgIHZhciByYXdMZW5ndGggPSByYXcubGVuZ3RoO1xyXG5cclxuICAgICAgICB2YXIgdUludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KHJhd0xlbmd0aCk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3TGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdUludDhBcnJheVtpXSA9IHJhdy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBCbG9iKFt1SW50OEFycmF5XSwgeyB0eXBlOiBjb250ZW50VHlwZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5pdEVycm9ySGFuZGxlcihsb2dnZXI6IChlcnJvckRhdGE6IE9iamVjdCkgPT4gdm9pZCkge1xyXG5cclxuICAgICAgICB3aW5kb3cub25lcnJvciA9IGZ1bmN0aW9uKG1zZywgZmlsZSwgbGluZSwgY29sLCBlcnJvcjogRXJyb3IgfCBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBzdGFja2ZyYW1lcyA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbXNnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6IGxpbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2w6IGNvbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrOiBzdGFja2ZyYW1lc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGxvZyBlcnJvclwiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGVycmJhY2sgPSBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gbG9nIGVycm9yXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3IgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcig8c3RyaW5nPmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhc0Vycm9yID0gdHlwZW9mIGVycm9yID09PSBcInN0cmluZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgPyBuZXcgRXJyb3IoZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgOiBlcnJvcjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFjayA9IFN0YWNrVHJhY2UuZnJvbUVycm9yKGFzRXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycmJhY2spO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmYWlsZWQgdG8gbG9nIGVycm9yXCIsIGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgS2V5Q29kZXMgPSB7XHJcbiAgICAgICAgQmFja1NwYWNlOiA4LFxyXG4gICAgICAgIFRhYjogOSxcclxuICAgICAgICBFbnRlcjogMTMsXHJcbiAgICAgICAgU2hpZnQ6IDE2LFxyXG4gICAgICAgIEN0cmw6IDE3LFxyXG4gICAgICAgIEFsdDogMTgsXHJcbiAgICAgICAgUGF1c2VCcmVhazogMTksXHJcbiAgICAgICAgQ2Fwc0xvY2s6IDIwLFxyXG4gICAgICAgIEVzYzogMjcsXHJcbiAgICAgICAgUGFnZVVwOiAzMyxcclxuICAgICAgICBQYWdlRG93bjogMzQsXHJcbiAgICAgICAgRW5kOiAzNSxcclxuICAgICAgICBIb21lOiAzNixcclxuICAgICAgICBBcnJvd0xlZnQ6IDM3LFxyXG4gICAgICAgIEFycm93VXA6IDM4LFxyXG4gICAgICAgIEFycm93UmlnaHQ6IDM5LFxyXG4gICAgICAgIEFycm93RG93bjogNDAsXHJcbiAgICAgICAgSW5zZXJ0OiA0NSxcclxuICAgICAgICBEZWxldGU6IDQ2LFxyXG4gICAgICAgIERpZ2l0MDogNDgsXHJcbiAgICAgICAgRGlnaXQxOiA0OSxcclxuICAgICAgICBEaWdpdDI6IDUwLFxyXG4gICAgICAgIERpZ2l0MzogNTEsXHJcbiAgICAgICAgRGlnaXQ0OiA1MixcclxuICAgICAgICBEaWdpdDU6IDUzLFxyXG4gICAgICAgIERpZ2l0NjogNTQsXHJcbiAgICAgICAgRGlnaXQ3OiA1NSxcclxuICAgICAgICBEaWdpdDg6IDU2LFxyXG4gICAgICAgIERpZ2l0OTogNTcsXHJcbiAgICAgICAgQTogNjUsXHJcbiAgICAgICAgQjogNjYsXHJcbiAgICAgICAgQzogNjcsXHJcbiAgICAgICAgRDogNjgsXHJcbiAgICAgICAgRTogNjksXHJcbiAgICAgICAgRjogNzAsXHJcbiAgICAgICAgRzogNzEsXHJcbiAgICAgICAgSDogNzIsXHJcbiAgICAgICAgSTogNzMsXHJcbiAgICAgICAgSjogNzQsXHJcbiAgICAgICAgSzogNzUsXHJcbiAgICAgICAgTDogNzYsXHJcbiAgICAgICAgTTogNzcsXHJcbiAgICAgICAgTjogNzgsXHJcbiAgICAgICAgTzogNzksXHJcbiAgICAgICAgUDogODAsXHJcbiAgICAgICAgUTogODEsXHJcbiAgICAgICAgUjogODIsXHJcbiAgICAgICAgUzogODMsXHJcbiAgICAgICAgVDogODQsXHJcbiAgICAgICAgVTogODUsXHJcbiAgICAgICAgVjogODYsXHJcbiAgICAgICAgVzogODcsXHJcbiAgICAgICAgWDogODgsXHJcbiAgICAgICAgWTogODksXHJcbiAgICAgICAgWjogOTAsXHJcbiAgICAgICAgV2luZG93TGVmdDogOTEsXHJcbiAgICAgICAgV2luZG93UmlnaHQ6IDkyLFxyXG4gICAgICAgIFNlbGVjdEtleTogOTMsXHJcbiAgICAgICAgTnVtcGFkMDogOTYsXHJcbiAgICAgICAgTnVtcGFkMTogOTcsXHJcbiAgICAgICAgTnVtcGFkMjogOTgsXHJcbiAgICAgICAgTnVtcGFkMzogOTksXHJcbiAgICAgICAgTnVtcGFkNDogMTAwLFxyXG4gICAgICAgIE51bXBhZDU6IDEwMSxcclxuICAgICAgICBOdW1wYWQ2OiAxMDIsXHJcbiAgICAgICAgTnVtcGFkNzogMTAzLFxyXG4gICAgICAgIE51bXBhZDg6IDEwNCxcclxuICAgICAgICBOdW1wYWQ5OiAxMDUsXHJcbiAgICAgICAgTXVsdGlwbHk6IDEwNixcclxuICAgICAgICBBZGQ6IDEwNyxcclxuICAgICAgICBTdWJ0cmFjdDogMTA5LFxyXG4gICAgICAgIERlY2ltYWxQb2ludDogMTEwLFxyXG4gICAgICAgIERpdmlkZTogMTExLFxyXG4gICAgICAgIEYxOiAxMTIsXHJcbiAgICAgICAgRjI6IDExMyxcclxuICAgICAgICBGMzogMTE0LFxyXG4gICAgICAgIEY0OiAxMTUsXHJcbiAgICAgICAgRjU6IDExNixcclxuICAgICAgICBGNjogMTE3LFxyXG4gICAgICAgIEY3OiAxMTgsXHJcbiAgICAgICAgRjg6IDExOSxcclxuICAgICAgICBGOTogMTIwLFxyXG4gICAgICAgIEYxMDogMTIxLFxyXG4gICAgICAgIEYxMTogMTIyLFxyXG4gICAgICAgIEYxMjogMTIzLFxyXG4gICAgICAgIE51bUxvY2s6IDE0NCxcclxuICAgICAgICBTY3JvbGxMb2NrOiAxNDUsXHJcbiAgICAgICAgU2VtaUNvbG9uOiAxODYsXHJcbiAgICAgICAgRXF1YWw6IDE4NyxcclxuICAgICAgICBDb21tYTogMTg4LFxyXG4gICAgICAgIERhc2g6IDE4OSxcclxuICAgICAgICBQZXJpb2Q6IDE5MCxcclxuICAgICAgICBGb3J3YXJkU2xhc2g6IDE5MSxcclxuICAgICAgICBHcmF2ZUFjY2VudDogMTkyLFxyXG4gICAgICAgIEJyYWNrZXRPcGVuOiAyMTksXHJcbiAgICAgICAgQmFja1NsYXNoOiAyMjAsXHJcbiAgICAgICAgQnJhY2tldENsb3NlOiAyMjEsXHJcbiAgICAgICAgU2luZ2xlUXVvdGU6IDIyMlxyXG4gICAgfTtcclxuXHJcbn0iLCJuYW1lc3BhY2UgRnN0eC5GcmFtZXdvcmsge1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGaWxlTmFtZSh0ZXh0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBleHRlbnNpb246IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IG5hbWUgPSBcIlwiO1xyXG4gICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiB0ZXh0LnNwbGl0KC9cXHMvKSkge1xyXG4gICAgICAgICAgICBjb25zdCB0cmltID0gd29yZC5yZXBsYWNlKC9cXFcvZywgJycpLnRyaW0oKTtcclxuICAgICAgICAgICAgaWYgKHRyaW0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZihuYW1lLmxlbmd0aCAmJiBuYW1lLmxlbmd0aCArIHRyaW0ubGVuZ3RoICsgMSA+IG1heExlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGgpIG5hbWUgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICBuYW1lICs9IHRyaW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5hbWUgKyBcIi5cIiArIGV4dGVuc2lvbjtcclxuICAgIH1cclxuXHJcbn0iLCJcclxubmFtZXNwYWNlIEZvbnRIZWxwZXJzIHtcclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBFbGVtZW50Rm9udFN0eWxlIHtcclxuICAgICAgICBmb250RmFtaWx5Pzogc3RyaW5nO1xyXG4gICAgICAgIGZvbnRXZWlnaHQ/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFN0eWxlPzogc3RyaW5nOyBcclxuICAgICAgICBmb250U2l6ZT86IHN0cmluZzsgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRDc3NTdHlsZShmYW1pbHk6IHN0cmluZywgdmFyaWFudD86IHN0cmluZywgc2l6ZT86IHN0cmluZyl7XHJcbiAgICAgICAgbGV0IHN0eWxlID0gPEVsZW1lbnRGb250U3R5bGU+eyBmb250RmFtaWx5OiBmYW1pbHkgfTtcclxuICAgICAgICBpZih2YXJpYW50ICYmIHZhcmlhbnQuaW5kZXhPZihcIml0YWxpY1wiKSA+PSAwKXtcclxuICAgICAgICAgICAgc3R5bGUuZm9udFN0eWxlID0gXCJpdGFsaWNcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG51bWVyaWMgPSB2YXJpYW50ICYmIHZhcmlhbnQucmVwbGFjZSgvW15cXGRdL2csIFwiXCIpO1xyXG4gICAgICAgIGlmKG51bWVyaWMgJiYgbnVtZXJpYy5sZW5ndGgpe1xyXG4gICAgICAgICAgICBzdHlsZS5mb250V2VpZ2h0ID0gbnVtZXJpYy50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzaXplKXtcclxuICAgICAgICAgICAgc3R5bGUuZm9udFNpemUgPSBzaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3R5bGU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRTdHlsZVN0cmluZyhmYW1pbHk6IHN0cmluZywgdmFyaWFudDogc3RyaW5nLCBzaXplPzogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHN0eWxlT2JqID0gZ2V0Q3NzU3R5bGUoZmFtaWx5LCB2YXJpYW50LCBzaXplKTtcclxuICAgICAgICBsZXQgcGFydHMgPSBbXTtcclxuICAgICAgICBpZihzdHlsZU9iai5mb250RmFtaWx5KXtcclxuICAgICAgICAgICAgcGFydHMucHVzaChgZm9udC1mYW1pbHk6JyR7c3R5bGVPYmouZm9udEZhbWlseX0nYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0eWxlT2JqLmZvbnRXZWlnaHQpe1xyXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LXdlaWdodDoke3N0eWxlT2JqLmZvbnRXZWlnaHR9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0eWxlT2JqLmZvbnRTdHlsZSl7XHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goYGZvbnQtc3R5bGU6JHtzdHlsZU9iai5mb250U3R5bGV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHN0eWxlT2JqLmZvbnRTaXplKXtcclxuICAgICAgICAgICAgcGFydHMucHVzaChgZm9udC1zaXplOiR7c3R5bGVPYmouZm9udFNpemV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXJ0cy5qb2luKFwiOyBcIik7XHJcbiAgICB9XHJcbiAgICBcclxufSIsIm5hbWVzcGFjZSBGcmFtZXdvcmsge1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBsb2d0YXA8VD4obWVzc2FnZTogc3RyaW5nLCBzdHJlYW06IFJ4Lk9ic2VydmFibGU8VD4pOiBSeC5PYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICByZXR1cm4gc3RyZWFtLnRhcCh0ID0+IGNvbnNvbGUubG9nKG1lc3NhZ2UsIHQpKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbmV3aWQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gKG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgTWF0aC5yYW5kb20oKSlcclxuICAgICAgICAgICAgLnRvU3RyaW5nKDM2KS5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgfVxyXG4gICBcclxufVxyXG4iLCJuYW1lc3BhY2UgRnJhbWV3b3JrIHtcclxuICAgIFxyXG4gICAgZXhwb3J0IGNsYXNzIFNlZWRSYW5kb20ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNlZWQ6IG51bWJlcjtcclxuICAgICAgICBuZXh0U2VlZDogbnVtYmVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHNlZWQ6IG51bWJlciA9IE1hdGgucmFuZG9tKCkpe1xyXG4gICAgICAgICAgICB0aGlzLnNlZWQgPSB0aGlzLm5leHRTZWVkID0gc2VlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmFuZG9tKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGNvbnN0IHggPSBNYXRoLnNpbih0aGlzLm5leHRTZWVkICogMiAqIE1hdGguUEkpICogMTAwMDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHggLSBNYXRoLmZsb29yKHgpO1xyXG4gICAgICAgICAgICB0aGlzLm5leHRTZWVkID0gcmVzdWx0O1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiXHJcbm5hbWVzcGFjZSBUeXBlZENoYW5uZWwge1xyXG5cclxuICAgIC8vIC0tLSBDb3JlIHR5cGVzIC0tLVxyXG5cclxuICAgIHR5cGUgU2VyaWFsaXphYmxlID0gT2JqZWN0IHwgQXJyYXk8YW55PiB8IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBEYXRlIHwgdm9pZDtcclxuXHJcbiAgICB0eXBlIFZhbHVlID0gbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiB8IERhdGU7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIGRhdGE/OiBURGF0YTtcclxuICAgIH1cclxuXHJcbiAgICB0eXBlIElTdWJqZWN0PFQ+ID0gUnguT2JzZXJ2ZXI8VD4gJiBSeC5PYnNlcnZhYmxlPFQ+O1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDaGFubmVsVG9waWM8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgY2hhbm5lbDogSVN1YmplY3Q8TWVzc2FnZTxURGF0YT4+O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihjaGFubmVsOiBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj4sIHR5cGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3Vic2NyaWJlKG9ic2VydmVyOiAobWVzc2FnZTogTWVzc2FnZTxURGF0YT4pID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCkuc3Vic2NyaWJlKG9ic2VydmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YihvYnNlcnZlcjogKGRhdGE6IFREYXRhKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgpLnN1YnNjcmliZShtID0+IG9ic2VydmVyKG0uZGF0YSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXNwYXRjaChkYXRhPzogVERhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsLm9uTmV4dCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JzZXJ2ZSgpOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGE+PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuZmlsdGVyKG0gPT4gbS50eXBlID09PSB0aGlzLnR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBvYnNlcnZlRGF0YSgpOiBSeC5PYnNlcnZhYmxlPFREYXRhPiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9ic2VydmUoKS5tYXAobSA9PiBtLmRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3J3YXJkKGNoYW5uZWw6IENoYW5uZWxUb3BpYzxURGF0YT4pIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmUobSA9PiBjaGFubmVsLmRpc3BhdGNoKG0uZGF0YSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbCB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgc3ViamVjdDogSVN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGU+PjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3ViamVjdD86IElTdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4sIHR5cGU/OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJqZWN0ID0gc3ViamVjdCB8fCBuZXcgUnguU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+KCk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWJzY3JpYmUob25OZXh0PzogKHZhbHVlOiBNZXNzYWdlPFNlcmlhbGl6YWJsZT4pID0+IHZvaWQpOiBSeC5JRGlzcG9zYWJsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3Quc3Vic2NyaWJlKG9uTmV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYnNlcnZlKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9waWM8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+KHR5cGU6IHN0cmluZykgOiBDaGFubmVsVG9waWM8VERhdGE+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VERhdGE+KHRoaXMuc3ViamVjdCBhcyBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj4sXHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPyB0aGlzLnR5cGUgKyAnLicgKyB0eXBlIDogdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lcmdlVHlwZWQ8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+KC4uLnRvcGljczogQ2hhbm5lbFRvcGljPFREYXRhPltdKSBcclxuICAgICAgICAgICAgOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGE+PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdG9waWNzLm1hcCh0ID0+IHQudHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuZmlsdGVyKG0gPT4gdHlwZXMuaW5kZXhPZihtLnR5cGUpID49IDAgKSBhcyBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8VERhdGE+PjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWVyZ2UoLi4udG9waWNzOiBDaGFubmVsVG9waWM8U2VyaWFsaXphYmxlPltdKSBcclxuICAgICAgICAgICAgOiBSeC5PYnNlcnZhYmxlPE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRvcGljcy5tYXAodCA9PiB0LnR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmZpbHRlcihtID0+IHR5cGVzLmluZGV4T2YobS50eXBlKSA+PSAwICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgRnN0eC5GcmFtZXdvcmsge1xyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgV2F0ZXJtYXJrIHtcclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIF9wcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgICAgIHByaXZhdGUgX21hcms6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgICAgICBwcml2YXRlIF9zY2FsZUZhY3RvcjogbnVtYmVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGdldCBpdGVtKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFyaztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJvamVjdDogcGFwZXIuUHJvamVjdCwgcGF0aDogc3RyaW5nLCBzY2FsZUZhY3RvciA9IDAuMSl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgICAgICAgICAgdGhpcy5fcHJvamVjdC5pbXBvcnRTVkcocGF0aCwgKGltcG9ydGVkOiBwYXBlci5JdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXJrID0gPHBhcGVyLkNvbXBvdW5kUGF0aD5pbXBvcnRlZC5nZXRJdGVtKHtjbGFzczogcGFwZXIuQ29tcG91bmRQYXRofSk7XHJcbiAgICAgICAgICAgICAgICBpZighdGhpcy5fbWFyayl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgbG9hZCBDb21wb3VuZFBhdGggZnJvbSAke3BhdGh9YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXJrLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fc2NhbGVGYWN0b3IgPSBzY2FsZUZhY3RvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcGxhY2VJbnRvKGNvbnRhaW5lcjogcGFwZXIuSXRlbSwgYmFja2dyb3VuZENvbG9yOiBwYXBlci5Db2xvcil7XHJcbiAgICAgICAgICAgIGNvbnN0IHdhdGVybWFya0RpbSA9IE1hdGguc3FydChjb250YWluZXIuYm91bmRzLnNpemUud2lkdGggKiBjb250YWluZXIuYm91bmRzLnNpemUuaGVpZ2h0KSAqIHRoaXMuX3NjYWxlRmFjdG9yO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrLmJvdW5kcy5zaXplID0gbmV3IHBhcGVyLlNpemUod2F0ZXJtYXJrRGltLCB3YXRlcm1hcmtEaW0pO1xyXG4gICAgICAgICAgICAvLyBqdXN0IGluc2lkZSBsb3dlciByaWdodFxyXG4gICAgICAgICAgICB0aGlzLl9tYXJrLnBvc2l0aW9uID0gY29udGFpbmVyLmJvdW5kcy5ib3R0b21SaWdodC5zdWJ0cmFjdCh3YXRlcm1hcmtEaW0gLyAyICsgMSk7XHJcblxyXG4gICAgICAgICAgICBpZihiYWNrZ3JvdW5kQ29sb3IubGlnaHRuZXNzID4gMC40KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcmsuZmlsbENvbG9yID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5vcGFjaXR5ID0gMC4wNTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcmsuZmlsbENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5vcGFjaXR5ID0gMC4yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLl9tYXJrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmVtb3ZlKCl7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmsucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJcclxudHlwZSBEaWN0aW9uYXJ5PFQ+ID0gXy5EaWN0aW9uYXJ5PFQ+O1xyXG4iLCJcclxuY2xhc3MgT2JzZXJ2YWJsZUV2ZW50PFQ+IHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfc3Vic2NyaWJlcnM6ICgoZXZlbnRBcmc6IFQpID0+IHZvaWQpW10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmb3Igbm90aWZpY2F0aW9uLiBSZXR1cm5zIHVuc3Vic2NyaWJlIGZ1bmN0aW9uLlxyXG4gICAgICovICAgIFxyXG4gICAgc3Vic2NyaWJlKGhhbmRsZXI6IChldmVudEFyZzogVCkgPT4gdm9pZCk6ICgoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgaWYodGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyKSA8IDApe1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5wdXNoKGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKCkgPT4gdGhpcy51bnN1YnNjcmliZShoYW5kbGVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdW5zdWJzY3JpYmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoY2FsbGJhY2ssIDApO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9ic2VydmUoKTogUnguT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHVuc3ViOiBhbnk7XHJcbiAgICAgICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybjxUPihcclxuICAgICAgICAgICAgKGhhbmRsZXJUb0FkZCkgPT4gdGhpcy5zdWJzY3JpYmUoPChldmVudEFyZzogVCkgPT4gdm9pZD5oYW5kbGVyVG9BZGQpLFxyXG4gICAgICAgICAgICAoaGFuZGxlclRvUmVtb3ZlKSA9PiB0aGlzLnVuc3Vic2NyaWJlKDwoZXZlbnRBcmc6IFQpID0+IHZvaWQ+aGFuZGxlclRvUmVtb3ZlKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGZvciBvbmUgbm90aWZpY2F0aW9uLlxyXG4gICAgICovXHJcbiAgICBzdWJzY3JpYmVPbmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCl7XHJcbiAgICAgICAgbGV0IHVuc3ViID0gdGhpcy5zdWJzY3JpYmUodCA9PiB7XHJcbiAgICAgICAgICAgIHVuc3ViKCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHQpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBub3RpZnkoZXZlbnRBcmc6IFQpe1xyXG4gICAgICAgIGZvcihsZXQgc3Vic2NyaWJlciBvZiB0aGlzLl9zdWJzY3JpYmVycyl7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY2FsbCh0aGlzLCBldmVudEFyZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIHN1YnNjcmliZXJzLlxyXG4gICAgICovXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG59IiwiXHJcbmRlY2xhcmUgdHlwZSBHQUV2ZW50ID0ge1xyXG4gIGV2ZW50Q2F0ZWdvcnk/OiBzdHJpbmcsXHJcbiAgZXZlbnRBY3Rpb24/OiBzdHJpbmcsXHJcbiAgZXZlbnRMYWJlbD86IHN0cmluZ1xyXG4gIGV2ZW50VmFsdWU/OiBudW1iZXJcclxufVxyXG5cclxuZGVjbGFyZSBmdW5jdGlvbiBnYShjb21tYW5kOiBzdHJpbmcsIGhpdFR5cGU6IHN0cmluZywgZXZlbnQ6IEdBRXZlbnQpXHJcblxyXG5mdW5jdGlvbiBnYUV2ZW50KGV2ZW50OiBHQUV2ZW50KXtcclxuICAgIGdhKFwic2VuZFwiLCBcImV2ZW50XCIsIGV2ZW50KTtcclxufVxyXG4iLCJcclxubmFtZXNwYWNlIEJvb3RTY3JpcHQge1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTWVudUl0ZW0ge1xyXG4gICAgICAgIGNvbnRlbnQ6IGFueSxcclxuICAgICAgICBvcHRpb25zPzogT2JqZWN0XHJcbiAgICAgICAgLy9vbkNsaWNrPzogKCkgPT4gdm9pZFxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkcm9wZG93bihcclxuICAgICAgICBhcmdzOiB7XHJcbiAgICAgICAgICAgIGlkOiBzdHJpbmcsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IGFueSxcclxuICAgICAgICAgICAgaXRlbXM6IE1lbnVJdGVtW11cclxuICAgICAgICB9KTogVk5vZGUge1xyXG5cclxuICAgICAgICByZXR1cm4gaChcImRpdi5kcm9wZG93blwiLCBbXHJcbiAgICAgICAgICAgIGgoXCJidXR0b24uYnRuLmJ0bi1kZWZhdWx0LmRyb3Bkb3duLXRvZ2dsZVwiLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYXR0cnNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYXJncy5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLXRvZ2dsZVwiOiBcImRyb3Bkb3duXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzLmNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgaChcInNwYW4uY2FyZXRcIilcclxuICAgICAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICBoKFwidWwuZHJvcGRvd24tbWVudVwiLFxyXG4gICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICBhcmdzLml0ZW1zLm1hcChpdGVtID0+XHJcbiAgICAgICAgICAgICAgICAgICAgaChcImxpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaCgnYScsIGl0ZW0ub3B0aW9ucyB8fCB7fSwgW2l0ZW0uY29udGVudF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICBdKTtcclxuXHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbnR5cGUgSXRlbUNoYW5nZUhhbmRsZXIgPSAoZmxhZ3M6IFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcpID0+IHZvaWQ7XHJcbnR5cGUgQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJdGVtIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTdWJzY3JpYmUgdG8gYWxsIGNoYW5nZXMgaW4gaXRlbS4gUmV0dXJucyB1bi1zdWJzY3JpYmUgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3Vic2NyaWJlKGhhbmRsZXI6IEl0ZW1DaGFuZ2VIYW5kbGVyKTogQ2FsbGJhY2s7XHJcbiAgICAgICAgXHJcbiAgICAgICAgX2NoYW5nZWQoZmxhZ3M6IFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcpOiB2b2lkO1xyXG4gICAgfVxyXG59XHJcblxyXG5uYW1lc3BhY2UgUGFwZXJOb3RpZnkge1xyXG5cclxuICAgIGV4cG9ydCBlbnVtIENoYW5nZUZsYWcge1xyXG4gICAgICAgIC8vIEFueXRoaW5nIGFmZmVjdGluZyB0aGUgYXBwZWFyYW5jZSBvZiBhbiBpdGVtLCBpbmNsdWRpbmcgR0VPTUVUUlksXHJcbiAgICAgICAgLy8gU1RST0tFLCBTVFlMRSBhbmQgQVRUUklCVVRFIChleGNlcHQgZm9yIHRoZSBpbnZpc2libGUgb25lczogbG9ja2VkLCBuYW1lKVxyXG4gICAgICAgIEFQUEVBUkFOQ0UgPSAweDEsXHJcbiAgICAgICAgLy8gQSBjaGFuZ2UgaW4gdGhlIGl0ZW0ncyBjaGlsZHJlblxyXG4gICAgICAgIENISUxEUkVOID0gMHgyLFxyXG4gICAgICAgIC8vIEEgY2hhbmdlIG9mIHRoZSBpdGVtJ3MgcGxhY2UgaW4gdGhlIHNjZW5lIGdyYXBoIChyZW1vdmVkLCBpbnNlcnRlZCxcclxuICAgICAgICAvLyBtb3ZlZCkuXHJcbiAgICAgICAgSU5TRVJUSU9OID0gMHg0LFxyXG4gICAgICAgIC8vIEl0ZW0gZ2VvbWV0cnkgKHBhdGgsIGJvdW5kcylcclxuICAgICAgICBHRU9NRVRSWSA9IDB4OCxcclxuICAgICAgICAvLyBPbmx5IHNlZ21lbnQocykgaGF2ZSBjaGFuZ2VkLCBhbmQgYWZmZWN0ZWQgY3VydmVzIGhhdmUgYWxyZWFkeSBiZWVuXHJcbiAgICAgICAgLy8gbm90aWZpZWQuIFRoaXMgaXMgdG8gaW1wbGVtZW50IGFuIG9wdGltaXphdGlvbiBpbiBfY2hhbmdlZCgpIGNhbGxzLlxyXG4gICAgICAgIFNFR01FTlRTID0gMHgxMCxcclxuICAgICAgICAvLyBTdHJva2UgZ2VvbWV0cnkgKGV4Y2x1ZGluZyBjb2xvcilcclxuICAgICAgICBTVFJPS0UgPSAweDIwLFxyXG4gICAgICAgIC8vIEZpbGwgc3R5bGUgb3Igc3Ryb2tlIGNvbG9yIC8gZGFzaFxyXG4gICAgICAgIFNUWUxFID0gMHg0MCxcclxuICAgICAgICAvLyBJdGVtIGF0dHJpYnV0ZXM6IHZpc2libGUsIGJsZW5kTW9kZSwgbG9ja2VkLCBuYW1lLCBvcGFjaXR5LCBjbGlwTWFzayAuLi5cclxuICAgICAgICBBVFRSSUJVVEUgPSAweDgwLFxyXG4gICAgICAgIC8vIFRleHQgY29udGVudFxyXG4gICAgICAgIENPTlRFTlQgPSAweDEwMCxcclxuICAgICAgICAvLyBSYXN0ZXIgcGl4ZWxzXHJcbiAgICAgICAgUElYRUxTID0gMHgyMDAsXHJcbiAgICAgICAgLy8gQ2xpcHBpbmcgaW4gb25lIG9mIHRoZSBjaGlsZCBpdGVtc1xyXG4gICAgICAgIENMSVBQSU5HID0gMHg0MDAsXHJcbiAgICAgICAgLy8gVGhlIHZpZXcgaGFzIGJlZW4gdHJhbnNmb3JtZWRcclxuICAgICAgICBWSUVXID0gMHg4MDBcclxuICAgIH1cclxuXHJcbiAgICAvLyBTaG9ydGN1dHMgdG8gb2Z0ZW4gdXNlZCBDaGFuZ2VGbGFnIHZhbHVlcyBpbmNsdWRpbmcgQVBQRUFSQU5DRVxyXG4gICAgZXhwb3J0IGVudW0gQ2hhbmdlcyB7XHJcbiAgICAgICAgLy8gQ0hJTERSRU4gYWxzbyBjaGFuZ2VzIEdFT01FVFJZLCBzaW5jZSByZW1vdmluZyBjaGlsZHJlbiBmcm9tIGdyb3Vwc1xyXG4gICAgICAgIC8vIGNoYW5nZXMgYm91bmRzLlxyXG4gICAgICAgIENISUxEUkVOID0gQ2hhbmdlRmxhZy5DSElMRFJFTiB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgLy8gQ2hhbmdpbmcgdGhlIGluc2VydGlvbiBjYW4gY2hhbmdlIHRoZSBhcHBlYXJhbmNlIHRocm91Z2ggcGFyZW50J3MgbWF0cml4LlxyXG4gICAgICAgIElOU0VSVElPTiA9IENoYW5nZUZsYWcuSU5TRVJUSU9OIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIEdFT01FVFJZID0gQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBTRUdNRU5UUyA9IENoYW5nZUZsYWcuU0VHTUVOVFMgfCBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNUUk9LRSA9IENoYW5nZUZsYWcuU1RST0tFIHwgQ2hhbmdlRmxhZy5TVFlMRSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBTVFlMRSA9IENoYW5nZUZsYWcuU1RZTEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgQVRUUklCVVRFID0gQ2hhbmdlRmxhZy5BVFRSSUJVVEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgQ09OVEVOVCA9IENoYW5nZUZsYWcuQ09OVEVOVCB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgUElYRUxTID0gQ2hhbmdlRmxhZy5QSVhFTFMgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgVklFVyA9IENoYW5nZUZsYWcuVklFVyB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRVxyXG4gICAgfTtcclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICBcclxuICAgICAgICAvLyBJbmplY3QgSXRlbS5zdWJzY3JpYmVcclxuICAgICAgICBjb25zdCBpdGVtUHJvdG8gPSAoPGFueT5wYXBlcikuSXRlbS5wcm90b3R5cGU7XHJcbiAgICAgICAgaXRlbVByb3RvLnN1YnNjcmliZSA9IGZ1bmN0aW9uKGhhbmRsZXI6IEl0ZW1DaGFuZ2VIYW5kbGVyKTogQ2FsbGJhY2sge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3N1YnNjcmliZXJzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGhhbmRsZXIpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMucHVzaChoYW5kbGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyLCAwKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gV3JhcCBJdGVtLnJlbW92ZVxyXG4gICAgICAgIGNvbnN0IGl0ZW1SZW1vdmUgPSBpdGVtUHJvdG8ucmVtb3ZlO1xyXG4gICAgICAgIGl0ZW1Qcm90by5yZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXRlbVJlbW92ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXcmFwIFByb2plY3QuX2NoYW5nZWRcclxuICAgICAgICBjb25zdCBwcm9qZWN0UHJvdG8gPSA8YW55PnBhcGVyLlByb2plY3QucHJvdG90eXBlO1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RDaGFuZ2VkID0gcHJvamVjdFByb3RvLl9jaGFuZ2VkO1xyXG4gICAgICAgIHByb2plY3RQcm90by5fY2hhbmdlZCA9IGZ1bmN0aW9uKGZsYWdzOiBDaGFuZ2VGbGFnLCBpdGVtOiBwYXBlci5JdGVtKSB7XHJcbiAgICAgICAgICAgIHByb2plY3RDaGFuZ2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJzID0gKDxhbnk+aXRlbSkuX3N1YnNjcmliZXJzO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1YnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBzIG9mIHN1YnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcy5jYWxsKGl0ZW0sIGZsYWdzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRlc2NyaWJlKGZsYWdzOiBDaGFuZ2VGbGFnKSB7XHJcbiAgICAgICAgbGV0IGZsYWdMaXN0OiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIF8uZm9yT3duKENoYW5nZUZsYWcsICh2YWx1ZSwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICgodHlwZW9mIHZhbHVlKSA9PT0gXCJudW1iZXJcIiAmJiAodmFsdWUgJiBmbGFncykpIHtcclxuICAgICAgICAgICAgICAgIGZsYWdMaXN0LnB1c2goa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmbGFnTGlzdC5qb2luKCcgfCAnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmUoaXRlbTogcGFwZXIuSXRlbSwgZmxhZ3M6IENoYW5nZUZsYWcpOiBcclxuICAgICAgICBSeC5PYnNlcnZhYmxlPENoYW5nZUZsYWc+IFxyXG4gICAge1xyXG4gICAgICAgIGxldCB1bnN1YjogKCkgPT4gdm9pZDtcclxuICAgICAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuPENoYW5nZUZsYWc+KFxyXG4gICAgICAgICAgICBhZGRIYW5kbGVyID0+IHtcclxuICAgICAgICAgICAgICAgIHVuc3ViID0gaXRlbS5zdWJzY3JpYmUoZiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZiAmIGZsYWdzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkSGFuZGxlcihmKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgIHJlbW92ZUhhbmRsZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodW5zdWIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHVuc3ViKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuUGFwZXJOb3RpZnkuaW5pdGlhbGl6ZSgpO1xyXG4iLCJkZWNsYXJlIG1vZHVsZSBwYXBlciB7XHJcbiAgICBpbnRlcmZhY2UgVmlldyB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW50ZXJuYWwgbWV0aG9kIGZvciBpbml0aWF0aW5nIG1vdXNlIGV2ZW50cyBvbiB2aWV3LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGVtaXRNb3VzZUV2ZW50cyh2aWV3OiBwYXBlci5WaWV3LCBpdGVtOiBwYXBlci5JdGVtLCB0eXBlOiBzdHJpbmcsXHJcbiAgICAgICAgICAgIGV2ZW50OiBhbnksIHBvaW50OiBwYXBlci5Qb2ludCwgcHJldlBvaW50OiBwYXBlci5Qb2ludCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBwYXBlckV4dCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFZpZXdab29tIHtcclxuXHJcbiAgICAgICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcclxuICAgICAgICBmYWN0b3IgPSAxLjI1O1xyXG5cclxuICAgICAgICBwcml2YXRlIF9taW5ab29tOiBudW1iZXI7XHJcbiAgICAgICAgcHJpdmF0ZSBfbWF4Wm9vbTogbnVtYmVyO1xyXG4gICAgICAgIHByaXZhdGUgX21vdXNlTmF0aXZlU3RhcnQ6IHBhcGVyLlBvaW50O1xyXG4gICAgICAgIHByaXZhdGUgX3ZpZXdDZW50ZXJTdGFydDogcGFwZXIuUG9pbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBfdmlld0NoYW5nZWQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlJlY3RhbmdsZT4oKTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJvamVjdDogcGFwZXIuUHJvamVjdCxcclxuICAgICAgICAgICAgZ2V0QmFja2dyb3VuZEl0ZW1zPzogKCkgPT4gcGFwZXIuSXRlbVtdKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XHJcblxyXG4gICAgICAgICAgICAoPGFueT4kKHRoaXMucHJvamVjdC52aWV3LmVsZW1lbnQpKS5tb3VzZXdoZWVsKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludChldmVudC5vZmZzZXRYLCBldmVudC5vZmZzZXRZKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlWm9vbUNlbnRlcmVkKGV2ZW50LmRlbHRhWSwgbW91c2VQb3NpdGlvbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRpZERyYWcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdC52aWV3Lm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhpdCA9IHByb2plY3QuaGl0VGVzdChldi5wb2ludCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX3ZpZXdDZW50ZXJTdGFydCkgeyAgLy8gbm90IGFscmVhZHkgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaGl0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmRJdGVtcyA9IChnZXRCYWNrZ3JvdW5kSXRlbXMgJiYgZ2V0QmFja2dyb3VuZEl0ZW1zKCkpIHx8IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBoaXQgaXMgb24gbm90aGluZyBvciBvbiBhIG5vbi1iYWNrZ3JvdW5kIGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWhpdC5pdGVtIHx8ICFiYWNrZ3JvdW5kSXRlbXMuc29tZShiaSA9PiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpICYmIChiaSA9PT0gaGl0Lml0ZW0gfHwgYmkuaXNBbmNlc3RvcihoaXQuaXRlbSkpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBkb24ndCB1c2UgZHJhZ2dpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDZW50ZXJTdGFydCA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhdmUgdG8gdXNlIG5hdGl2ZSBtb3VzZSBvZmZzZXQsIGJlY2F1c2UgZXYuZGVsdGEgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gIGNoYW5nZXMgYXMgdGhlIHZpZXcgaXMgc2Nyb2xsZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG5ldyBwYXBlci5Qb2ludChldi5ldmVudC5vZmZzZXRYLCBldi5ldmVudC5vZmZzZXRZKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LmVtaXQocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ1N0YXJ0LCBldik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdGl2ZURlbHRhID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldi5ldmVudC5vZmZzZXRYIC0gdGhpcy5fbW91c2VOYXRpdmVTdGFydC54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldi5ldmVudC5vZmZzZXRZIC0gdGhpcy5fbW91c2VOYXRpdmVTdGFydC55XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBNb3ZlIGludG8gdmlldyBjb29yZGluYXRlcyB0byBzdWJyYWN0IGRlbHRhLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICB0aGVuIGJhY2sgaW50byBwcm9qZWN0IGNvb3Jkcy5cclxuICAgICAgICAgICAgICAgICAgICB2aWV3LmNlbnRlciA9IHZpZXcudmlld1RvUHJvamVjdChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5wcm9qZWN0VG9WaWV3KHRoaXMuX3ZpZXdDZW50ZXJTdGFydClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChuYXRpdmVEZWx0YSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpZERyYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdC52aWV3Lm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZVVwLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbW91c2VOYXRpdmVTdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDZW50ZXJTdGFydCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5lbWl0KHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdFbmQsIGV2KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlkRHJhZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWREcmFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB2aWV3Q2hhbmdlZCgpOiBPYnNlcnZhYmxlRXZlbnQ8cGFwZXIuUmVjdGFuZ2xlPiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92aWV3Q2hhbmdlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB6b29tKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2plY3Qudmlldy56b29tO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHpvb21SYW5nZSgpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRab29tUmFuZ2UocmFuZ2U6IHBhcGVyLlNpemVbXSk6IG51bWJlcltdIHtcclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgICAgICBjb25zdCBhU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICAgICAgY29uc3QgYSA9IGFTaXplICYmIE1hdGgubWluKFxyXG4gICAgICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYVNpemUuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgdmlldy5ib3VuZHMud2lkdGggLyBhU2l6ZS53aWR0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGIgPSBiU2l6ZSAmJiBNYXRoLm1pbihcclxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIGJTaXplLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYlNpemUud2lkdGgpO1xyXG4gICAgICAgICAgICBjb25zdCBtaW4gPSBNYXRoLm1pbihhLCBiKTtcclxuICAgICAgICAgICAgaWYgKG1pbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWluWm9vbSA9IG1pbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heChhLCBiKTtcclxuICAgICAgICAgICAgaWYgKG1heCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF4Wm9vbSA9IG1heDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgem9vbVRvKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSkge1xyXG4gICAgICAgICAgICBpZihyZWN0LmlzRW1wdHkoKSB8fCByZWN0LndpZHRoID09PSAwIHx8IHJlY3QuaGVpZ2h0ID09PSAwKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInNraXBwaW5nIHpvb20gdG9cIiwgcmVjdCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgICAgICB2aWV3LmNlbnRlciA9IHJlY3QuY2VudGVyO1xyXG4gICAgICAgICAgICBjb25zdCB6b29tTGV2ZWwgPSBNYXRoLm1pbihcclxuICAgICAgICAgICAgICAgIHZpZXcudmlld1NpemUuaGVpZ2h0IC8gcmVjdC5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB2aWV3LnZpZXdTaXplLndpZHRoIC8gcmVjdC53aWR0aCk7XHJcbiAgICAgICAgICAgIHZpZXcuem9vbSA9IHpvb21MZXZlbDtcclxuICAgICAgICAgICAgdGhpcy5fdmlld0NoYW5nZWQubm90aWZ5KHZpZXcuYm91bmRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYW5nZVpvb21DZW50ZXJlZChkZWx0YTogbnVtYmVyLCBtb3VzZVBvczogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICAgICAgaWYgKCFkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICAgICAgY29uc3Qgb2xkWm9vbSA9IHZpZXcuem9vbTtcclxuICAgICAgICAgICAgY29uc3Qgb2xkQ2VudGVyID0gdmlldy5jZW50ZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXdQb3MgPSB2aWV3LnZpZXdUb1Byb2plY3QobW91c2VQb3MpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld1pvb20gPSBkZWx0YSA+IDBcclxuICAgICAgICAgICAgICAgID8gdmlldy56b29tICogdGhpcy5mYWN0b3JcclxuICAgICAgICAgICAgICAgIDogdmlldy56b29tIC8gdGhpcy5mYWN0b3I7XHJcbiAgICAgICAgICAgIG5ld1pvb20gPSB0aGlzLnNldFpvb21Db25zdHJhaW5lZChuZXdab29tKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbmV3Wm9vbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB6b29tU2NhbGUgPSBvbGRab29tIC8gbmV3Wm9vbTtcclxuICAgICAgICAgICAgY29uc3QgY2VudGVyQWRqdXN0ID0gdmlld1Bvcy5zdWJ0cmFjdChvbGRDZW50ZXIpO1xyXG4gICAgICAgICAgICBjb25zdCBvZmZzZXQgPSB2aWV3UG9zLnN1YnRyYWN0KGNlbnRlckFkanVzdC5tdWx0aXBseSh6b29tU2NhbGUpKVxyXG4gICAgICAgICAgICAgICAgLnN1YnRyYWN0KG9sZENlbnRlcik7XHJcblxyXG4gICAgICAgICAgICB2aWV3LmNlbnRlciA9IHZpZXcuY2VudGVyLmFkZChvZmZzZXQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdmlld0NoYW5nZWQubm90aWZ5KHZpZXcuYm91bmRzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXQgem9vbSBsZXZlbC5cclxuICAgICAgICAgKiBAcmV0dXJucyB6b29tIGxldmVsIHRoYXQgd2FzIHNldCwgb3IgbnVsbCBpZiBpdCB3YXMgbm90IGNoYW5nZWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHNldFpvb21Db25zdHJhaW5lZCh6b29tOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbWluWm9vbSkge1xyXG4gICAgICAgICAgICAgICAgem9vbSA9IE1hdGgubWF4KHpvb20sIHRoaXMuX21pblpvb20pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXhab29tKSB7XHJcbiAgICAgICAgICAgICAgICB6b29tID0gTWF0aC5taW4oem9vbSwgdGhpcy5fbWF4Wm9vbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgICAgICBpZiAoem9vbSAhPSB2aWV3Lnpvb20pIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuem9vbSA9IHpvb207XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gem9vbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIHBhcGVyRXh0IHtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBVc2Ugb2YgdGhlc2UgZXZlbnRzIHJlcXVpcmVzIGZpcnN0IGNhbGxpbmcgZXh0ZW5kTW91c2VFdmVudHNcclxuICAgICAqICAgb24gdGhlIGl0ZW0uIFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgdmFyIEV2ZW50VHlwZSA9IHtcclxuICAgICAgICBtb3VzZURyYWdTdGFydDogXCJtb3VzZURyYWdTdGFydFwiLFxyXG4gICAgICAgIG1vdXNlRHJhZ0VuZDogXCJtb3VzZURyYWdFbmRcIlxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBleHRlbmRNb3VzZUV2ZW50cyhpdGVtOiBwYXBlci5JdGVtKXtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYoIWRyYWdnaW5nKXtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGl0ZW0ub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlVXAsIGV2ID0+IHtcclxuICAgICAgICAgICAgaWYoZHJhZ2dpbmcpe1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnRW5kLCBldik7XHJcbiAgICAgICAgICAgICAgICAvLyBwcmV2ZW50IGNsaWNrXHJcbiAgICAgICAgICAgICAgICBldi5zdG9wKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIH1cclxufSIsIlxyXG5tb2R1bGUgcGFwZXIge1xyXG5cclxuICAgIGV4cG9ydCB2YXIgRXZlbnRUeXBlID0ge1xyXG4gICAgICAgIGZyYW1lOiBcImZyYW1lXCIsXHJcbiAgICAgICAgbW91c2VEb3duOiBcIm1vdXNlZG93blwiLFxyXG4gICAgICAgIG1vdXNlVXA6IFwibW91c2V1cFwiLFxyXG4gICAgICAgIG1vdXNlRHJhZzogXCJtb3VzZWRyYWdcIixcclxuICAgICAgICBjbGljazogXCJjbGlja1wiLFxyXG4gICAgICAgIGRvdWJsZUNsaWNrOiBcImRvdWJsZWNsaWNrXCIsXHJcbiAgICAgICAgbW91c2VNb3ZlOiBcIm1vdXNlbW92ZVwiLFxyXG4gICAgICAgIG1vdXNlRW50ZXI6IFwibW91c2VlbnRlclwiLFxyXG4gICAgICAgIG1vdXNlTGVhdmU6IFwibW91c2VsZWF2ZVwiLFxyXG4gICAgICAgIGtleXVwOiBcImtleXVwXCIsXHJcbiAgICAgICAga2V5ZG93bjogXCJrZXlkb3duXCJcclxuICAgIH1cclxuXHJcbn0iLCJcclxuYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50PFQ+IHtcclxuICAgIGFic3RyYWN0IHJlbmRlcihkYXRhOiBUKTogVk5vZGU7XHJcbn0iLCJcclxuaW50ZXJmYWNlIFJlYWN0aXZlRG9tQ29tcG9uZW50IHtcclxuICAgIGRvbSQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+O1xyXG59XHJcblxyXG5uYW1lc3BhY2UgVkRvbUhlbHBlcnMge1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckFzQ2hpbGQoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgdm5vZGU6IFZOb2RlKSB7XHJcbiAgICAgICAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGNvbnN0IHBhdGNoZWQgPSBwYXRjaChjaGlsZCwgdm5vZGUpO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwYXRjaGVkLmVsbSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFJlYWN0aXZlRG9tIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciBhIHJlYWN0aXZlIGNvbXBvbmVudCB3aXRoaW4gY29udGFpbmVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyU3RyZWFtKFxyXG4gICAgICAgIGRvbSQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+LFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnRcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBjb25zdCBpZCA9IGNvbnRhaW5lci5pZDtcclxuICAgICAgICBsZXQgY3VycmVudDogSFRNTEVsZW1lbnQgfCBWTm9kZSA9IGNvbnRhaW5lcjtcclxuICAgICAgICBjb25zdCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XHJcbiAgICAgICAgZG9tJC5zdWJzY3JpYmUoZG9tID0+IHtcclxuICAgICAgICAgICAgaWYgKCFkb20pIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRW1wdHlOb2Rlcyhkb20pO1xyXG4gICAgICAgICAgICBsZXQgcGF0Y2hlZDogVk5vZGU7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBwYXRjaGVkID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3IgcGF0Y2hpbmcgZG9tXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGRvbSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpZCAmJiAhcGF0Y2hlZC5lbG0uaWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJldGFpbiBJRFxyXG4gICAgICAgICAgICAgICAgcGF0Y2hlZC5lbG0uaWQgPSBpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoZWQ7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2l2ZWx5IHJlbW92ZSBlbXB0eSBjaGlsZHJlbiBmcm9tIHRyZWUuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW1vdmVFbXB0eU5vZGVzKG5vZGU6IFZOb2RlKSB7XHJcbiAgICAgICAgaWYoIW5vZGUuY2hpbGRyZW4gfHwgIW5vZGUuY2hpbGRyZW4ubGVuZ3RoKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBub3RFbXB0eSA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKGMgPT4gISFjKTtcclxuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbi5sZW5ndGggIT0gbm90RW1wdHkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcInJlbW92ZWQgZW1wdHkgY2hpbGRyZW4gZnJvbVwiLCBub2RlLmNoaWxkcmVuKTtcclxuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG5vdEVtcHR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVFbXB0eU5vZGVzKGNoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSByZWFjdGl2ZSBjb21wb25lbnQgd2l0aGluIGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlckNvbXBvbmVudChcclxuICAgICAgICBjb21wb25lbnQ6IFJlYWN0aXZlRG9tQ29tcG9uZW50LFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZVxyXG4gICAgKTogUnguT2JzZXJ2YWJsZTxWTm9kZT4ge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gY29udGFpbmVyO1xyXG4gICAgICAgIGxldCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XHJcbiAgICAgICAgY29tcG9uZW50LmRvbSQuc3Vic2NyaWJlKGRvbSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZG9tKSByZXR1cm47XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xyXG4gICAgICAgICAgICBzaW5rLm9uTmV4dCg8Vk5vZGU+Y3VycmVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHNpbms7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgd2l0aGluIGNvbnRhaW5lciB3aGVuZXZlciBzb3VyY2UgY2hhbmdlcy5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxpdmVSZW5kZXI8VD4oXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudCB8IFZOb2RlLFxyXG4gICAgICAgIHNvdXJjZTogUnguT2JzZXJ2YWJsZTxUPixcclxuICAgICAgICByZW5kZXI6IChuZXh0OiBUKSA9PiBWTm9kZVxyXG4gICAgKTogUnguT2JzZXJ2YWJsZTxWTm9kZT4ge1xyXG4gICAgICAgIGxldCBjdXJyZW50ID0gY29udGFpbmVyO1xyXG4gICAgICAgIGxldCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XHJcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSByZW5kZXIoZGF0YSk7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgbm9kZSk7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbn0iLCJcclxubmFtZXNwYWNlIEFwcCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFwcENvb2tpZXMge1xyXG5cclxuICAgICAgICBzdGF0aWMgWUVBUiA9IDM2NTtcclxuICAgICAgICBzdGF0aWMgQlJPV1NFUl9JRF9LRVkgPSBcImJyb3dzZXJJZFwiO1xyXG4gICAgICAgIHN0YXRpYyBMQVNUX1NBVkVEX1NLRVRDSF9JRF9LRVkgPSBcImxhc3RTYXZlZFNrZXRjaElkXCI7XHJcblxyXG4gICAgICAgIGdldCBsYXN0U2F2ZWRTa2V0Y2hJZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXMuZ2V0KEFwcENvb2tpZXMuTEFTVF9TQVZFRF9TS0VUQ0hfSURfS0VZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldCBsYXN0U2F2ZWRTa2V0Y2hJZCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIENvb2tpZXMuc2V0KEFwcENvb2tpZXMuTEFTVF9TQVZFRF9TS0VUQ0hfSURfS0VZLCB2YWx1ZSwgeyBleHBpcmVzOiBBcHBDb29raWVzLllFQVIgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgYnJvd3NlcklkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llcy5nZXQoQXBwQ29va2llcy5CUk9XU0VSX0lEX0tFWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgYnJvd3NlcklkKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgQ29va2llcy5zZXQoQXBwQ29va2llcy5CUk9XU0VSX0lEX0tFWSwgdmFsdWUsIHsgZXhwaXJlczogQXBwQ29va2llcy5ZRUFSIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIEFwcCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7XHJcblxyXG4gICAgICAgIHN0b3JlOiBTdG9yZTtcclxuICAgICAgICBlZGl0b3JNb2R1bGU6IFNrZXRjaEVkaXRvci5Ta2V0Y2hFZGl0b3JNb2R1bGU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNob3VsZExvZ0luZm8gPSBmYWxzZTsgICAgICAgXHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gbmV3IFN0b3JlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yTW9kdWxlID0gbmV3IFNrZXRjaEVkaXRvci5Ta2V0Y2hFZGl0b3JNb2R1bGUodGhpcy5zdG9yZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHN0YXJ0KCkgeyAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yTW9kdWxlLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmludGVyZmFjZSBXaW5kb3cge1xyXG4gICAgYXBwOiBBcHAuQXBwTW9kdWxlO1xyXG59IiwiXHJcbm5hbWVzcGFjZSBBcHAge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBcHBSb3V0ZXIgZXh0ZW5kcyBSb3V0ZXI1IHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFtcclxuICAgICAgICAgICAgICAgIG5ldyBSb3V0ZU5vZGUoXCJob21lXCIsIFwiL1wiKSxcclxuICAgICAgICAgICAgICAgIG5ldyBSb3V0ZU5vZGUoXCJza2V0Y2hcIiwgXCIvc2tldGNoLzpza2V0Y2hJZFwiKSwgLy8gPFthLWZBLUYwLTldezE0fT5cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VIYXNoOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Um91dGU6IFwiaG9tZVwiXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy51c2VQbHVnaW4obG9nZ2VyUGx1Z2luKCkpXHJcbiAgICAgICAgICAgIHRoaXMudXNlUGx1Z2luKGxpc3RlbmVyc1BsdWdpbi5kZWZhdWx0KCkpXHJcbiAgICAgICAgICAgICAgICAudXNlUGx1Z2luKGhpc3RvcnlQbHVnaW4uZGVmYXVsdCgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvU2tldGNoRWRpdG9yKHNrZXRjaElkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZShcInNrZXRjaFwiLCB7IHNrZXRjaElkOiBza2V0Y2hJZCB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBzdGF0ZSgpIHtcclxuICAgICAgICAgICAgLy8gY291bGQgZG8gcm91dGUgdmFsaWRhdGlvbiBzb21ld2hlcmVcclxuICAgICAgICAgICAgcmV0dXJuIDxBcHBSb3V0ZVN0YXRlPjxhbnk+dGhpcy5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEFwcFJvdXRlU3RhdGUge1xyXG4gICAgICAgIG5hbWU6IFwiaG9tZVwifFwic2tldGNoXCIsXHJcbiAgICAgICAgcGFyYW1zPzoge1xyXG4gICAgICAgICAgICBza2V0Y2hJZD86IHN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGF0aD86IHN0cmluZ1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5uYW1lc3BhY2UgQXBwIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3RvcmUge1xyXG5cclxuICAgICAgICBzdGF0ZTogQXBwU3RhdGU7XHJcbiAgICAgICAgYWN0aW9uczogQWN0aW9ucztcclxuICAgICAgICBldmVudHM6IEV2ZW50cztcclxuXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IEFwcFJvdXRlcjtcclxuICAgICAgICBwcml2YXRlIGNvb2tpZXM6IEFwcENvb2tpZXM7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlciA9IG5ldyBBcHBSb3V0ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29va2llcyA9IG5ldyBBcHBDb29raWVzKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Um91dGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFN0YXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEFjdGlvbkhhbmRsZXJzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0U3RhdGUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBuZXcgQXBwU3RhdGUodGhpcy5jb29raWVzLCB0aGlzLnJvdXRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGluaXRBY3Rpb25IYW5kbGVycygpIHtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLmVkaXRvckxvYWRlZFNrZXRjaC5zdWIoc2tldGNoSWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoXCJza2V0Y2hcIiwgeyBza2V0Y2hJZCB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMuZWRpdG9yU2F2ZWRTa2V0Y2guc3ViKGlkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29va2llcy5sYXN0U2F2ZWRTa2V0Y2hJZCA9IGlkO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzdGFydFJvdXRlcigpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIuc3RhcnQoKGVyciwgc3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnJvdXRlQ2hhbmdlZC5kaXNwYXRjaChzdGF0ZSk7IFxyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInJvdXRlciBlcnJvclwiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwiaG9tZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQXBwU3RhdGUge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgY29va2llczogQXBwQ29va2llcztcclxuICAgICAgICBwcml2YXRlIHJvdXRlcjogQXBwUm91dGVyOyBcclxuICAgICAgICBcclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb29raWVzOiBBcHBDb29raWVzLCByb3V0ZXI6IEFwcFJvdXRlcil7XHJcbiAgICAgICAgICAgIHRoaXMuY29va2llcyA9IGNvb2tpZXM7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyID0gcm91dGVyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgYnJvd3NlcklkID0gdGhpcy5jb29raWVzLmJyb3dzZXJJZCB8fCBGcmFtZXdvcmsubmV3aWQoKTtcclxuICAgICAgICAgICAgLy8gaW5pdCBvciByZWZyZXNoIGNvb2tpZVxyXG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMuYnJvd3NlcklkID0gYnJvd3NlcklkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBnZXQgbGFzdFNhdmVkU2tldGNoSWQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvb2tpZXMubGFzdFNhdmVkU2tldGNoSWQ7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBnZXQgYnJvd3NlcklkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb29raWVzLmJyb3dzZXJJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0IHJvdXRlKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZXIuc3RhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBY3Rpb25zIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWwge1xyXG4gICAgICAgIGVkaXRvckxvYWRlZFNrZXRjaCA9IHRoaXMudG9waWM8c3RyaW5nPihcImVkaXRvckxvYWRlZFNrZXRjaFwiKTtcclxuICAgICAgICBlZGl0b3JTYXZlZFNrZXRjaCA9IHRoaXMudG9waWM8c3RyaW5nPihcImVkaXRvclNhdmVkU2tldGNoXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBFdmVudHMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XHJcbiAgICAgICAgcm91dGVDaGFuZ2VkID0gdGhpcy50b3BpYzxBcHBSb3V0ZVN0YXRlPihcInJvdXRlQ2hhbmdlZFwiKTtcclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgRGVtbyB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIERlbW9Nb2R1bGUge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcblxyXG4gICAgICAgICAgICBwYXBlci5zZXR1cChjYW52YXMpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXJ0KCkge1xyXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gcGFwZXIudmlldztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZEZvbnRzID0gbmV3IEZvbnRTaGFwZS5QYXJzZWRGb250cygoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICBwYXJzZWRGb250cy5nZXQoXCJmb250cy9Sb2JvdG8tNTAwLnR0ZlwiKS50aGVuKCBwYXJzZWQgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IHBhcnNlZC5mb250LmdldFBhdGgoXCJTTkFQXCIsIDAsIDAsIDEyOCkudG9QYXRoRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuICAgICAgICAgICAgICAgICBjb250ZW50LnBvc2l0aW9uID0gY29udGVudC5wb3NpdGlvbi5hZGQoNTApO1xyXG4gICAgICAgICAgICAgICAgIGNvbnRlbnQuZmlsbENvbG9yID0gXCJsaWdodGdyYXlcIjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWdpb24gPSBwYXBlci5QYXRoLkVsbGlwc2UobmV3IHBhcGVyLlJlY3RhbmdsZShcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMCwwKSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2l6ZSg2MDAsIDMwMClcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgcmVnaW9uLnJvdGF0ZSgzMCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJlZ2lvbi5ib3VuZHMuY2VudGVyID0gdmlldy5jZW50ZXI7XHJcbiAgICAgICAgICAgICAgICByZWdpb24uc3Ryb2tlQ29sb3IgPSBcImxpZ2h0Z3JheVwiO1xyXG4gICAgICAgICAgICAgICAgcmVnaW9uLnN0cm9rZVdpZHRoID0gMztcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzbmFwUGF0aCA9IG5ldyBGb250U2hhcGUuU25hcFBhdGgocmVnaW9uLCBjb250ZW50KTtcclxuICAgICAgICAgICAgICAgIHNuYXBQYXRoLmNvcm5lcnMgPSBbMCwgMC40LCAwLjQ1LCAwLjk1XTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmlldy5vbkZyYW1lID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNuYXBQYXRoLnNsaWRlKDAuMDAxKTtcclxuICAgICAgICAgICAgICAgICAgICBzbmFwUGF0aC51cGRhdGVQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZpZXcuZHJhdygpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICBcclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEJ1aWxkZXIge1xyXG5cclxuICAgICAgICBzdGF0aWMgZGVmYXVsdEZvbnRVcmwgPSBcImZvbnRzL1JvYm90by01MDAudHRmXCI7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY29udGV4dCA9IDxUZW1wbGF0ZVVJQ29udGV4dD57XHJcbiAgICAgICAgICAgICAgICBnZXQgZm9udENhdGFsb2coKSB7IHJldHVybiBzdG9yZS5mb250Q2F0YWxvZyB9LFxyXG4gICAgICAgICAgICAgICAgcmVuZGVyRGVzaWduOiAoZGVzaWduLCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLnJlbmRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2lnbjogZGVzaWduLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNyZWF0ZUZvbnRDaG9vc2VyOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBUZW1wbGF0ZUZvbnRDaG9vc2VyKHN0b3JlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gYXN5bmMgb2JzZXJ2ZVxyXG4gICAgICAgICAgICBzdG9yZS50ZW1wbGF0ZSQub2JzZXJ2ZU9uKFJ4LlNjaGVkdWxlci5kZWZhdWx0KS5zdWJzY3JpYmUodCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdUZW1wbGF0ZVN0YXRlID0gdC5jcmVhdGVOZXcoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICBfLm1lcmdlKG5ld1RlbXBsYXRlU3RhdGUsIHN0b3JlLnN0YXRlLnRlbXBsYXRlU3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuc2V0VGVtcGxhdGVTdGF0ZShuZXdUZW1wbGF0ZVN0YXRlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkb20kID0gc3RvcmUudGVtcGxhdGVTdGF0ZSRcclxuICAgICAgICAgICAgICAgIC5tYXAodHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250cm9scztcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9scyA9IHN0b3JlLnRlbXBsYXRlLmNyZWF0ZVVJKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGNhbGxpbmcgJHtzdG9yZS50ZW1wbGF0ZS5uYW1lfS5jcmVhdGVVSWAsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY29udHJvbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy52YWx1ZSQuc3Vic2NyaWJlKGQgPT4gc3RvcmUudXBkYXRlVGVtcGxhdGVTdGF0ZShkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVzID0gY29udHJvbHMubWFwKGMgPT4gYy5jcmVhdGVOb2RlKHRzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdm5vZGUgPSBoKFwiZGl2I3RlbXBsYXRlQ29udHJvbHNcIiwge30sIG5vZGVzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm5vZGU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBNb2R1bGUge1xyXG4gICAgICAgIHN0b3JlOiBTdG9yZTtcclxuICAgICAgICBidWlsZGVyOiBCdWlsZGVyO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgYnVpbGRlckNvbnRhaW5lcjogSFRNTEVsZW1lbnQsXHJcbiAgICAgICAgICAgIHByZXZpZXdDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxyXG4gICAgICAgICAgICByZW5kZXJDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxyXG4gICAgICAgICAgICBiZWxvd0NhbnZhczogSFRNTEVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoKTtcclxuICAgICAgICAgICAgdGhpcy5idWlsZGVyID0gbmV3IEJ1aWxkZXIoYnVpbGRlckNvbnRhaW5lciwgdGhpcy5zdG9yZSk7XHJcblxyXG4gICAgICAgICAgICBuZXcgUHJldmlld0NhbnZhcyhwcmV2aWV3Q2FudmFzLCB0aGlzLnN0b3JlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUudGVtcGxhdGVTdGF0ZSQuc3Vic2NyaWJlKHRzID0+IGNvbnNvbGUubG9nKFwidGVtcGxhdGVTdGF0ZVwiLCB0cykpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnRlbXBsYXRlJC5zdWJzY3JpYmUodCA9PiBjb25zb2xlLmxvZyhcInRlbXBsYXRlXCIsIHQpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIG5ldyBTaGFyZU9wdGlvbnNVSShiZWxvd0NhbnZhcywgdGhpcy5zdG9yZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGFydCgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5pbml0KCkudGhlbihzID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuc2V0VGVtcGxhdGUoXCJEaWNrZW5zXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGVUZW1wbGF0ZVN0YXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIHsgZGVzaWduOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkRvbid0IGdvYmJsZWZ1bmsgYXJvdW5kIHdpdGggd29yZHMuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBcIi0gUm9hbGQgRGFobCwgVGhlIEJGR1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZWQ6IDAuOTk1OTE3NjQ1NzgwMzEyMyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlOiBcIm5hcnJvd1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbWlseTogXCJBbWF0aWMgU0NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50OiBcInJlZ3VsYXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhbGV0dGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjODU0NDQyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52ZXJ0OiB0cnVlIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250Q2F0ZWdvcnk6IFwiaGFuZHdyaXRpbmdcIixcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBQcmV2aWV3Q2FudmFzIHtcclxuXHJcbiAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgYnVpbHREZXNpZ246IHBhcGVyLkl0ZW07XHJcbiAgICAgICAgY29udGV4dDogVGVtcGxhdGVCdWlsZENvbnRleHQ7XHJcblxyXG4gICAgICAgIHByaXZhdGUgbGFzdFJlY2VpdmVkOiBEZXNpZ247XHJcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJpbmcgPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XHJcbiAgICAgICAgcHJpdmF0ZSB3b3Jrc3BhY2U6IHBhcGVyLkdyb3VwO1xyXG4gICAgICAgIHByaXZhdGUgbWFyazogRnN0eC5GcmFtZXdvcmsuV2F0ZXJtYXJrO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG5cclxuICAgICAgICAgICAgcGFwZXIuc2V0dXAoY2FudmFzKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0ID0gcGFwZXIucHJvamVjdDtcclxuICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuXHJcbiAgICAgICAgICAgIEZvbnRTaGFwZS5WZXJ0aWNhbEJvdW5kc1N0cmV0Y2hQYXRoLnBvaW50c1BlclBhdGggPSA0MDA7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQgPSB7XHJcbiAgICAgICAgICAgICAgICBnZXRGb250OiBzcGVjaWZpZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB1cmw6IHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNwZWNpZmllciB8fCAhc3BlY2lmaWVyLmZhbWlseSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBCdWlsZGVyLmRlZmF1bHRGb250VXJsO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IHN0b3JlLmZvbnRDYXRhbG9nLmdldFVybChzcGVjaWZpZXIuZmFtaWx5LCBzcGVjaWZpZXIudmFyaWFudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IEJ1aWxkZXIuZGVmYXVsdEZvbnRVcmw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZS5wYXJzZWRGb250cy5nZXQodXJsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0LmZvbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXJrID0gbmV3IEZzdHguRnJhbWV3b3JrLldhdGVybWFyayh0aGlzLnByb2plY3QsIFwiaW1nL3NwaXJhbC1sb2dvLnN2Z1wiLCAwLjA2KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLnRlbXBsYXRlU3RhdGUkLnN1YnNjcmliZSgodHM6IFRlbXBsYXRlU3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIG9ubHkgcHJvY2VzcyBvbmUgcmVxdWVzdCBhdCBhIHRpbWVcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsd2F5cyBwcm9jZXNzIHRoZSBsYXN0IHJlY2VpdmVkXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0UmVjZWl2ZWQgPSB0cy5kZXNpZ247XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHRzLmRlc2lnbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmRvd25sb2FkUE5HUmVxdWVzdGVkLnN1YihwaXhlbHMgPT4gdGhpcy5kb3dubG9hZFBORyhwaXhlbHMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZG93bmxvYWRQTkcocGl4ZWxzOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0b3JlLmRlc2lnbi5jb250ZW50IFxyXG4gICAgICAgICAgICAgICAgfHwgIXRoaXMuc3RvcmUuZGVzaWduLmNvbnRlbnQudGV4dCBcclxuICAgICAgICAgICAgICAgIHx8ICF0aGlzLnN0b3JlLmRlc2lnbi5jb250ZW50LnRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIHZlcnkgZnJhZ2lsZSB3YXkgdG8gZ2V0IGJnIGNvbG9yXHJcbiAgICAgICAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy53b3Jrc3BhY2UuZ2V0SXRlbSh7Y2xhc3M6IHBhcGVyLlNoYXBlIH0pO1xyXG4gICAgICAgICAgICBjb25zdCBiZ0NvbG9yID0gPHBhcGVyLkNvbG9yPnNoYXBlLmZpbGxDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5tYXJrLnBsYWNlSW50byh0aGlzLndvcmtzcGFjZSwgYmdDb2xvcik7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBIYWxmIG9mIG1heCBEUEkgcHJvZHVjZXMgYXBwcm94IDQyMDB4NDIwMC5cclxuICAgICAgICAgICAgY29uc3QgZHBpID0gMC41ICogUGFwZXJIZWxwZXJzLmdldEV4cG9ydERwaSh0aGlzLndvcmtzcGFjZS5ib3VuZHMuc2l6ZSwgcGl4ZWxzKTtcclxuICAgICAgICAgICAgY29uc3QgcmFzdGVyID0gdGhpcy53b3Jrc3BhY2UucmFzdGVyaXplKGRwaSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gcmFzdGVyLnRvRGF0YVVSTCgpO1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IEZzdHguRnJhbWV3b3JrLmNyZWF0ZUZpbGVOYW1lKHRoaXMuc3RvcmUuZGVzaWduLmNvbnRlbnQudGV4dCwgNDAsIFwicG5nXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBibG9iID0gRG9tSGVscGVycy5kYXRhVVJMVG9CbG9iKGRhdGEpO1xyXG4gICAgICAgICAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5tYXJrLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJMYXN0UmVjZWl2ZWQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxhc3RSZWNlaXZlZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVuZGVyaW5nID0gdGhpcy5sYXN0UmVjZWl2ZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RSZWNlaXZlZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcihyZW5kZXJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHJlbmRlcihkZXNpZ246IERlc2lnbik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInJlbmRlciBpcyBpbiBwcm9ncmVzc1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHBhcGVyLnByb2plY3QuYWN0aXZlTGF5ZXIucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmUudGVtcGxhdGUuYnVpbGQoZGVzaWduLCB0aGlzLmNvbnRleHQpLnRoZW4oaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHJlbmRlciByZXN1bHQgZnJvbVwiLCBkZXNpZ24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmZpdEJvdW5kcyh0aGlzLnByb2plY3Qudmlldy5ib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYm91bmRzLnBvaW50ID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLnRvcExlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2UuYWRkQ2hpbGQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBhbnkgcmVjZWl2ZWQgd2hpbGUgcmVuZGVyaW5nIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJMYXN0UmVjZWl2ZWQoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHJlbmRlcmluZyBkZXNpZ25cIiwgZXJyLCBkZXNpZ24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59IiwiLy8gbmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuLy8gICAgIGV4cG9ydCBjbGFzcyBSZW5kZXJDYW52YXMge1xyXG5cclxuLy8gICAgICAgICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4vLyAgICAgICAgIHN0b3JlOiBTdG9yZTtcclxuLy8gICAgICAgICBidWlsdERlc2lnbjogcGFwZXIuSXRlbTtcclxuXHJcbi8vICAgICAgICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgc3RvcmU6IFN0b3JlKSB7XHJcbi8vICAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuLy8gICAgICAgICAgICAgcGFwZXIuc2V0dXAoY2FudmFzKTtcclxuICAgICAgICAgICAgXHJcbi8vICAgICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSB7XHJcbi8vICAgICAgICAgICAgICAgICBnZXRGb250OiBzcGVjaWZpZXIgPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGxldCB1cmw6IHN0cmluZztcclxuLy8gICAgICAgICAgICAgICAgICAgICBpZiAoIXNwZWNpZmllciB8fCAhc3BlY2lmaWVyLmZhbWlseSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBCdWlsZGVyLmRlZmF1bHRGb250VXJsO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IHN0b3JlLmZvbnRDYXRhbG9nLmdldFVybChzcGVjaWZpZXIuZmFtaWx5LCBzcGVjaWZpZXIudmFyaWFudClcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IEJ1aWxkZXIuZGVmYXVsdEZvbnRVcmw7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZS5wYXJzZWRGb250cy5nZXQodXJsKVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0LmZvbnQpO1xyXG4vLyAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICB9O1xyXG5cclxuLy8gICAgICAgICAgICAgY29uc3QgY29udHJvbGxlZCA9IHN0b3JlLnJlbmRlciQuY29udHJvbGxlZCgpO1xyXG4vLyAgICAgICAgICAgICBjb250cm9sbGVkLnN1YnNjcmliZShyZXF1ZXN0ID0+IHtcclxuLy8gICAgICAgICAgICAgICAgIGxldCBkZXNpZ24gPSA8RGVzaWduPl8uY2xvbmUodGhpcy5zdG9yZS5kZXNpZ24pO1xyXG4vLyAgICAgICAgICAgICAgICAgZGVzaWduID0gXy5tZXJnZShkZXNpZ24sIHJlcXVlc3QuZGVzaWduKTtcclxuLy8gICAgICAgICAgICAgICAgIHBhcGVyLnByb2plY3QuYWN0aXZlTGF5ZXIucmVtb3ZlQ2hpbGRyZW4oKTtcclxuLy8gICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUudGVtcGxhdGUuYnVpbGQoZGVzaWduLCBjb250ZXh0KS50aGVuKGl0ZW0gPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhc3RlciA9IHBhcGVyLnByb2plY3QuYWN0aXZlTGF5ZXIucmFzdGVyaXplKDcyLCBmYWxzZSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgaXRlbS5yZW1vdmUoKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LmNhbGxiYWNrKHJhc3Rlci50b0RhdGFVUkwoKSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlZC5yZXF1ZXN0KDEpO1xyXG4vLyAgICAgICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAgICAgIChlcnIpID0+IHtcclxuLy8gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJlcnJvciBvbiB0ZW1wbGF0ZS5idWlsZFwiLCBlcnIpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZWQucmVxdWVzdCgxKTtcclxuLy8gICAgICAgICAgICAgICAgIH0pO1xyXG4vLyAgICAgICAgICAgICB9KTtcclxuLy8gICAgICAgICAgICAgY29udHJvbGxlZC5yZXF1ZXN0KDEpO1xyXG5cclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgfVxyXG4vLyB9IiwibW9kdWxlIFNrZXRjaEJ1aWxkZXIge1xyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgU2hhcmVPcHRpb25zVUkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSl7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gUnguT2JzZXJ2YWJsZS5qdXN0KG51bGwpO1xyXG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oc3RhdGUubWFwKCgpID0+IHRoaXMuY3JlYXRlRG9tKCkpLCBjb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjcmVhdGVEb20oKTogVk5vZGUge1xyXG4gICAgICAgICAgICByZXR1cm4gaChcImRpdi5jb250cm9sc1wiLCBbIFxyXG4gICAgICAgICAgICAgICAgaChcImJ1dHRvbi5idG4uYnRuLXByaW1hcnlcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmRvd25sb2FkUE5HKDEwMCAqIDEwMDApXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtcIkRvd25sb2FkIHNtYWxsXCJdKSxcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaChcImJ1dHRvbi5idG4uYnRuLXByaW1hcnlcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmRvd25sb2FkUE5HKDUwMCAqIDEwMDApXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtcIkRvd25sb2FkIG1lZGl1bVwiXSksXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdG9yZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGUkID0gbmV3IFJ4LlN1YmplY3Q8VGVtcGxhdGU+KCk7XHJcbiAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGVTdGF0ZSQgPSBuZXcgUnguU3ViamVjdDxUZW1wbGF0ZVN0YXRlPigpO1xyXG4gICAgICAgIHByaXZhdGUgX3JlbmRlciQgPSBuZXcgUnguU3ViamVjdDxSZW5kZXJSZXF1ZXN0PigpO1xyXG4gICAgICAgIHByaXZhdGUgX3N0YXRlOiB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlPzogVGVtcGxhdGU7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlU3RhdGU6IFRlbXBsYXRlU3RhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgX2V2ZW50c0NoYW5uZWwgPSBuZXcgVHlwZWRDaGFubmVsLkNoYW5uZWwoKTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfcGFyc2VkRm9udHM6IEZvbnRTaGFwZS5QYXJzZWRGb250cztcclxuICAgICAgICBwcml2YXRlIF9mb250Q2F0YWxvZzogRm9udFNoYXBlLkZvbnRDYXRhbG9nO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVN0YXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzaWduOiB7fVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcGFyc2VkRm9udHMgPSBuZXcgRm9udFNoYXBlLlBhcnNlZEZvbnRzKCgpID0+IHsgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBldmVudHMgPSB7XHJcbiAgICAgICAgICAgIGRvd25sb2FkUE5HUmVxdWVzdGVkOiB0aGlzLl9ldmVudHNDaGFubmVsLnRvcGljPG51bWJlcj4oXCJkb3dubG9hZFBOR1JlcXVlc3RlZFwiKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHN0YXRlKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgcGFyc2VkRm9udHMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJzZWRGb250cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBmb250Q2F0YWxvZygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRDYXRhbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHRlbXBsYXRlU3RhdGUkKCk6IFJ4Lk9ic2VydmFibGU8VGVtcGxhdGVTdGF0ZT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVTdGF0ZSQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdGVtcGxhdGUkKCk6IFJ4Lk9ic2VydmFibGU8VGVtcGxhdGU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlJDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCByZW5kZXIkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyJDsvLy5vYnNlcnZlT24oUnguU2NoZWR1bGVyLmRlZmF1bHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS50ZW1wbGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBkZXNpZ24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXRlLnRlbXBsYXRlU3RhdGUgJiYgdGhpcy5zdGF0ZS50ZW1wbGF0ZVN0YXRlLmRlc2lnbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQoKTogUHJvbWlzZTxTdG9yZT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3RvcmUgaXMgYWxyZWFkeSBpbml0YWxpemVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxTdG9yZT4oY2FsbGJhY2sgPT4ge1xyXG4gICAgICAgICAgICAgICAgRm9udFNoYXBlLkZvbnRDYXRhbG9nLmZyb21Mb2NhbChcImZvbnRzL2dvb2dsZS1mb250cy5qc29uXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oYyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRDYXRhbG9nID0gYztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG93bmxvYWRQTkcocGl4ZWxzOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuZG93bmxvYWRQTkdSZXF1ZXN0ZWQuZGlzcGF0Y2goKTtcclxuICAgICAgICAgICAgdGhpcy5zZW5kRGVzaWduR0FFdmVudChcImV4cG9ydFwiLCBwaXhlbHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VuZERlc2lnbkdBRXZlbnQoYWN0aW9uOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgbGV0IGxhYmVsID0gdGhpcy5fc3RhdGUudGVtcGxhdGUubmFtZTtcclxuICAgICAgICAgICAgY29uc3QgZm9udCA9IHRoaXMuX3N0YXRlLnRlbXBsYXRlU3RhdGUuZGVzaWduLmZvbnQ7XHJcbiAgICAgICAgICAgIGlmIChmb250KSB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbCArPSBcIjtcIiArIGZvbnQuZmFtaWx5ICsgXCIgXCIgKyBmb250LnZhcmlhbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2FFdmVudCh7XHJcbiAgICAgICAgICAgICAgICBldmVudENhdGVnb3J5OiBcIkRlc2lnblwiLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRBY3Rpb246IGFjdGlvbixcclxuICAgICAgICAgICAgICAgIGV2ZW50TGFiZWw6IGxhYmVsLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRWYWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRUZW1wbGF0ZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlOiBUZW1wbGF0ZTtcclxuICAgICAgICAgICAgaWYgKC9EaWNrZW5zL2kudGVzdChuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBuZXcgU2tldGNoQnVpbGRlci5UZW1wbGF0ZXMuRGlja2VucygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0ZW1wbGF0ZSAke25hbWV9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xyXG4gICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSQub25OZXh0KHRlbXBsYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldERlc2lnbih2YWx1ZTogRGVzaWduKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VGVtcGxhdGVTdGF0ZSh7IGRlc2lnbjogdmFsdWUgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVwZGF0ZVRlbXBsYXRlU3RhdGUoY2hhbmdlOiBUZW1wbGF0ZVN0YXRlQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIF8ubWVyZ2UodGhpcy5zdGF0ZS50ZW1wbGF0ZVN0YXRlLCBjaGFuZ2UpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGVzaWduID0gdGhpcy5zdGF0ZS50ZW1wbGF0ZVN0YXRlLmRlc2lnbjtcclxuICAgICAgICAgICAgaWYgKGRlc2lnbiAmJiBkZXNpZ24uZm9udCAmJiBkZXNpZ24uZm9udC5mYW1pbHkgJiYgIWRlc2lnbi5mb250LnZhcmlhbnQpIHtcclxuICAgICAgICAgICAgICAgIC8vIHNldCBkZWZhdWx0IHZhcmlhbnRcclxuICAgICAgICAgICAgICAgIGRlc2lnbi5mb250LnZhcmlhbnQgPSBGb250U2hhcGUuRm9udENhdGFsb2cuZGVmYXVsdFZhcmlhbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9udENhdGFsb2cuZ2V0UmVjb3JkKGRlc2lnbi5mb250LmZhbWlseSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVN0YXRlJC5vbk5leHQodGhpcy5zdGF0ZS50ZW1wbGF0ZVN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRlbXBsYXRlU3RhdGUoc3RhdGU6IFRlbXBsYXRlU3RhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUudGVtcGxhdGVTdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVN0YXRlJC5vbk5leHQoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVuZGVyKHJlcXVlc3Q6IFJlbmRlclJlcXVlc3QpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyJC5vbk5leHQocmVxdWVzdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGUge1xyXG4gICAgICAgIG5hbWU6IHN0cmluZztcclxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgICAgIGltYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgY3JlYXRlTmV3KGNvbnRleHQ6IFRlbXBsYXRlVUlDb250ZXh0KTogVGVtcGxhdGVTdGF0ZTtcclxuICAgICAgICBjcmVhdGVVSShjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IEJ1aWxkZXJDb250cm9sW107XHJcbiAgICAgICAgYnVpbGQoZGVzaWduOiBEZXNpZ24sIGNvbnRleHQ6IFRlbXBsYXRlQnVpbGRDb250ZXh0KTogUHJvbWlzZTxwYXBlci5JdGVtPjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlVUlDb250ZXh0IHtcclxuICAgICAgICByZW5kZXJEZXNpZ24oZGVzaWduOiBEZXNpZ24sIGNhbGxiYWNrOiAoaW1hZ2VEYXRhVXJsOiBzdHJpbmcpID0+IHZvaWQpO1xyXG4gICAgICAgIGZvbnRDYXRhbG9nOiBGb250U2hhcGUuRm9udENhdGFsb2c7XHJcbiAgICAgICAgY3JlYXRlRm9udENob29zZXIoKTogQnVpbGRlckNvbnRyb2w7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGVCdWlsZENvbnRleHQge1xyXG4gICAgICAgIGdldEZvbnQoZGVzYzogRm9udFNoYXBlLkZvbnRTcGVjaWZpZXIpOiBQcm9taXNlPG9wZW50eXBlLkZvbnQ+O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlU3RhdGUge1xyXG4gICAgICAgIGRlc2lnbjogRGVzaWduO1xyXG4gICAgICAgIGZvbnRDYXRlZ29yeT86IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlU3RhdGVDaGFuZ2Uge1xyXG4gICAgICAgIGRlc2lnbj86IERlc2lnbjtcclxuICAgICAgICBmb250Q2F0ZWdvcnk/OiBzdHJpbmc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVzaWduIHtcclxuICAgICAgICBjb250ZW50PzogYW55O1xyXG4gICAgICAgIHNoYXBlPzogc3RyaW5nO1xyXG4gICAgICAgIGZvbnQ/OiBGb250U2hhcGUuRm9udFNwZWNpZmllcjtcclxuICAgICAgICBwYWxldHRlPzogRGVzaWduUGFsZXR0ZTtcclxuICAgICAgICBzZWVkPzogbnVtYmVyO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIERlc2lnblBhbGV0dGUge1xyXG4gICAgICAgIGNvbG9yPzogc3RyaW5nO1xyXG4gICAgICAgIGludmVydD86IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBEZXNpZ25DaGFuZ2UgZXh0ZW5kcyBEZXNpZ257XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyUmVxdWVzdCB7XHJcbiAgICAgICAgZGVzaWduOiBEZXNpZ247XHJcbiAgICAgICAgYXJlYT86IG51bWJlcjtcclxuICAgICAgICBjYWxsYmFjazogKGltYWdlRGF0YVVybDogc3RyaW5nKSA9PiB2b2lkO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJ1aWxkZXJDb250cm9sIHtcclxuICAgICAgICB2YWx1ZSQ6IFJ4Lk9ic2VydmFibGU8VGVtcGxhdGVTdGF0ZUNoYW5nZT47XHJcbiAgICAgICAgY3JlYXRlTm9kZSh2YWx1ZTogVGVtcGxhdGVTdGF0ZSk6IFZOb2RlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFZhbHVlQ29udHJvbDxUPiB7XHJcbiAgICAgICAgdmFsdWUkOiBSeC5PYnNlcnZhYmxlPFQ+O1xyXG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU/OiBUKTogVk5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBPcHRpb25DaG9vc2VyPFQ+IHtcclxuICAgICAgICB2YWx1ZSQ6IFJ4Lk9ic2VydmFibGU8VD47XHJcbiAgICAgICAgY3JlYXRlTm9kZShjaG9pY2VzOiBUW10sIHZhbHVlPzogVCk6IFZOb2RlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBleHBvcnQgaW50ZXJmYWNlIFZOb2RlQ2hvb3NlciB7XHJcbiAgICAvLyAgICAgY3JlYXRlTm9kZShjaG9pY2VzOiBWTm9kZVtdLCBjaG9zZW5LZXk6IHN0cmluZyk6IFZOb2RlO1xyXG4gICAgLy8gICAgIGNob3NlbiQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+O1xyXG4gICAgLy8gfVxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG4gICAgXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIENvbnRyb2xIZWxwZXJzIHtcclxuICAgICAgICBcclxuICAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGNob29zZXI8VD4oXHJcbiAgICAgICAgICAgICBjaG9pY2VzOiBDaG9pY2VbXSlcclxuICAgICAgICAgICAgIDogVk5vZGV7XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwidWwuY2hvb3NlclwiLFxyXG4gICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzLm1hcChjaG9pY2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoKFwibGkuY2hvaWNlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvc2VuOiBjaG9pY2UuY2hvc2VuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9pY2UuY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjaG9pY2Uubm9kZV0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDaG9pY2Uge1xyXG4gICAgICAgICAgICAgbm9kZTogVk5vZGUsIFxyXG4gICAgICAgICAgICAgY2hvc2VuPzogYm9vbGVhbiwgXHJcbiAgICAgICAgICAgICBjYWxsYmFjaz86ICgpID0+IHZvaWRcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRm9udENob29zZXIgaW1wbGVtZW50cyBWYWx1ZUNvbnRyb2w8Rm9udENob29zZXJTdGF0ZT4ge1xyXG5cclxuICAgICAgICBwcml2YXRlIGZvbnRDYXRhbG9nOiBGb250U2hhcGUuRm9udENhdGFsb2c7XHJcbiAgICAgICAgcHJpdmF0ZSBfdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8Rm9udENob29zZXJTdGF0ZT4oKTtcclxuXHJcbiAgICAgICAgbWF4RmFtaWxpZXMgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihmb250Q2F0YWxvZzogRm9udFNoYXBlLkZvbnRDYXRhbG9nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udENhdGFsb2cgPSBmb250Q2F0YWxvZztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHByZWxvYWRGYW1pbGllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0Q2F0ZWdvcmllcygpXHJcbiAgICAgICAgICAgICAgICAubWFwKGMgPT4gZm9udENhdGFsb2cuZ2V0RmFtaWxpZXMoYylbMF0pO1xyXG4gICAgICAgICAgICBGb250U2hhcGUuRm9udENhdGFsb2cubG9hZFByZXZpZXdTdWJzZXRzKHByZWxvYWRGYW1pbGllcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdmFsdWUkKCk6IFJ4Lk9ic2VydmFibGU8Rm9udENob29zZXJTdGF0ZT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWUkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3JlYXRlTm9kZSh2YWx1ZT86IEZvbnRDaG9vc2VyU3RhdGUpOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuOiBWTm9kZVtdID0gW107XHJcblxyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGgoXCJoM1wiLCBbXCJGb250IENhdGVnb3JpZXNcIl0pKTtcclxuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcmllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0Q2F0ZWdvcmllcygpO1xyXG4gICAgICAgICAgICBjb25zdCBjYXRlZ29yeUNob2ljZXMgPSBjYXRlZ29yaWVzLm1hcChjYXRlZ29yeSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2F0ZWdvcnlGYW1pbGllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0RmFtaWxpZXMoY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4RmFtaWxpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeUZhbWlsaWVzID0gY2F0ZWdvcnlGYW1pbGllcy5zbGljZSgwLCB0aGlzLm1heEZhbWlsaWVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0RmFtaWx5ID0gY2F0ZWdvcnlGYW1pbGllc1swXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcclxuICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwic3BhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogRm9udEhlbHBlcnMuZ2V0Q3NzU3R5bGUoZmlyc3RGYW1pbHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjYXRlZ29yeV0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGNob3NlbjogdmFsdWUuY2F0ZWdvcnkgPT09IGNhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5sb2FkUHJldmlld1N1YnNldHMoY2F0ZWdvcnlGYW1pbGllcyk7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZSQub25OZXh0KHsgY2F0ZWdvcnksIGZhbWlseTogZmlyc3RGYW1pbHkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChDb250cm9sSGVscGVycy5jaG9vc2VyKGNhdGVnb3J5Q2hvaWNlcykpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlLmNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGgoXCJoM1wiLCB7fSwgW1wiRm9udHNcIl0pKTtcclxuICAgICAgICAgICAgICAgIGxldCBmYW1pbGllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0RmFtaWxpZXModmFsdWUuY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4RmFtaWxpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmYW1pbGllcyA9IGZhbWlsaWVzLnNsaWNlKDAsIHRoaXMubWF4RmFtaWxpZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZmFtaWx5T3B0aW9ucyA9IGZhbWlsaWVzLm1hcChmYW1pbHkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogaChcInNwYW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogRm9udEhlbHBlcnMuZ2V0Q3NzU3R5bGUoZmFtaWx5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtmYW1pbHldKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hvc2VuOiB2YWx1ZS5mYW1pbHkgPT09IGZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuX3ZhbHVlJC5vbk5leHQoeyBmYW1pbHksIHZhcmlhbnQ6IFwiXCIgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goQ29udHJvbEhlbHBlcnMuY2hvb3NlcihmYW1pbHlPcHRpb25zKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5mYW1pbHkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhbnRzID0gdGhpcy5mb250Q2F0YWxvZy5nZXRWYXJpYW50cyh2YWx1ZS5mYW1pbHkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhcmlhbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGgoXCJoM1wiLCB7fSwgW1wiRm9udCBTdHlsZXNcIl0pKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFyaWFudE9wdGlvbnMgPSB2YXJpYW50cy5tYXAodmFyaWFudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IGgoXCJzcGFuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogRm9udEhlbHBlcnMuZ2V0Q3NzU3R5bGUodmFsdWUuZmFtaWx5LCB2YXJpYW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3ZhcmlhbnRdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3NlbjogdmFsdWUudmFyaWFudCA9PT0gdmFyaWFudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLl92YWx1ZSQub25OZXh0KHsgdmFyaWFudCB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChDb250cm9sSGVscGVycy5jaG9vc2VyKHZhcmlhbnRPcHRpb25zKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2LmZvbnRDaG9vc2VyXCIsIHt9LCBjaGlsZHJlbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRm9udENob29zZXJTdGF0ZSB7XHJcbiAgICAgICAgY2F0ZWdvcnk/OiBzdHJpbmc7XHJcbiAgICAgICAgZmFtaWx5Pzogc3RyaW5nO1xyXG4gICAgICAgIHZhcmlhbnQ/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBJbWFnZUNob29zZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9jaG9zZW4kID0gbmV3IFJ4LlN1YmplY3Q8SW1hZ2VDaG9pY2U+KCk7XHJcblxyXG4gICAgICAgIGNyZWF0ZU5vZGUob3B0aW9uczogSW1hZ2VDaG9vc2VyT3B0aW9ucyk6IFZOb2RlIHtcclxuICAgICAgICAgICAgY29uc3QgY2hvaWNlTm9kZXMgPSBvcHRpb25zLmNob2ljZXMubWFwKGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGltZzogVk5vZGU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbkNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nob3NlbiQub25OZXh0KGMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBvcHRpb25zLmNob3NlbiA9PT0gYy52YWx1ZSBcclxuICAgICAgICAgICAgICAgICAgICA/IFwiaW1nLmNob3NlblwiIFxyXG4gICAgICAgICAgICAgICAgICAgIDogXCJpbWdcIjtcclxuICAgICAgICAgICAgICAgIGlmIChjLmxvYWRJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWdFbG07XHJcbiAgICAgICAgICAgICAgICAgICAgaW1nID0gaChzZWxlY3RvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogb25DbGlja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBraWNrIG9mZiBpbWFnZSBsb2FkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiB2bm9kZSA9PiBjLmxvYWRJbWFnZSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpbWcgPSBoKHNlbGVjdG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY6IGMuaW1hZ2VVcmxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBvbkNsaWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJsaVwiLCB7fSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIGltZ1xyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBoKFwidWwuY2hvb3NlclwiLCB7fSwgY2hvaWNlTm9kZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGNob3NlbiQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaG9zZW4kO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbWFnZUNob29zZXJPcHRpb25zIHtcclxuICAgICAgICBjaG9pY2VzOiBJbWFnZUNob2ljZVtdLFxyXG4gICAgICAgIGNob3Nlbj86IHN0cmluZ1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1hZ2VDaG9pY2Uge1xyXG4gICAgICAgIHZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgbGFiZWw6IHN0cmluZztcclxuICAgICAgICBpbWFnZVVybD86IHN0cmluZztcclxuICAgICAgICBsb2FkSW1hZ2U/OiAoZWxlbWVudDogSFRNTEltYWdlRWxlbWVudCkgPT4gdm9pZDtcclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRlbXBsYXRlRm9udENob29zZXIgaW1wbGVtZW50cyBCdWlsZGVyQ29udHJvbHtcclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIF9mb250Q2hvb3NlcjogRm9udENob29zZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRDaG9vc2VyID0gbmV3IEZvbnRDaG9vc2VyKHN0b3JlLmZvbnRDYXRhbG9nKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRDaG9vc2VyLm1heEZhbWlsaWVzID0gMTU7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjcmVhdGVOb2RlKHZhbHVlOiBUZW1wbGF0ZVN0YXRlKTogVk5vZGUge1xyXG4gICAgICAgICAgICBjb25zdCBmb250ID0gdmFsdWUuZGVzaWduICYmIHZhbHVlLmRlc2lnbi5mb250O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udENob29zZXIuY3JlYXRlTm9kZSg8Rm9udENob29zZXJTdGF0ZT57XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogdmFsdWUuZm9udENhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgZmFtaWx5OiBmb250ICYmIGZvbnQuZmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgdmFyaWFudDogZm9udCAmJiBmb250LnZhcmlhbnRcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0IHZhbHVlJCgpOiBSeC5PYnNlcnZhYmxlPFRlbXBsYXRlU3RhdGU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRDaG9vc2VyLnZhbHVlJC5tYXAoY2hvaWNlID0+IDxUZW1wbGF0ZVN0YXRlPntcclxuICAgICAgICAgICAgICAgIGZvbnRDYXRlZ29yeTogY2hvaWNlLmNhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgZGVzaWduOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYW1pbHk6IGNob2ljZS5mYW1pbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ6IGNob2ljZS52YXJpYW50XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9IFxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dElucHV0IGltcGxlbWVudHMgVmFsdWVDb250cm9sPHN0cmluZz4ge1xyXG5cclxuICAgICAgICBwcml2YXRlIF92YWx1ZSQgPSBuZXcgUnguU3ViamVjdDxzdHJpbmc+KCk7XHJcblxyXG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU/OiBzdHJpbmcsIHBsYWNlaG9sZGVyPzogc3RyaW5nLCB0ZXh0YXJlYT86IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoXCJ0ZXh0YXJlYVwiID8gXCJ0ZXh0YXJlYVwiIDogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRleHRhcmVhID8gdW5kZWZpbmVkIDogXCJ0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlclxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2OiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGV2LndoaWNoIHx8IGV2LmtleUNvZGUpID09PSBEb21IZWxwZXJzLktleUNvZGVzLkVudGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IDxIVE1MSW5wdXRFbGVtZW50PmV2LnRhcmdldDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5ibHVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZSQub25OZXh0KGV2LnRhcmdldC52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW11cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB2YWx1ZSQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZSQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyLlRlbXBsYXRlcyB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIERpY2tlbnMgaW1wbGVtZW50cyBTa2V0Y2hCdWlsZGVyLlRlbXBsYXRlIHtcclxuXHJcbiAgICAgICAgbmFtZSA9IFwiRGlja2Vuc1wiO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlN0YWNrIGJsb2NrcyBvZiB0ZXh0IGluIHRoZSBmb3JtIG9mIGEgd2F2eSBsYWRkZXIuXCI7XHJcbiAgICAgICAgaW1hZ2U6IHN0cmluZztcclxuICAgICAgICBsaW5lSGVpZ2h0VmFyaWF0aW9uID0gMC44O1xyXG4gICAgICAgIGRlZmF1bHRGb250U2l6ZSA9IDEyODtcclxuICAgICAgICBtYXJnaW5GYWN0b3IgPSAwLjE0O1xyXG5cclxuICAgICAgICBjcmVhdGVOZXcoY29udGV4dDogVGVtcGxhdGVVSUNvbnRleHQpOiBUZW1wbGF0ZVN0YXRlIHtcclxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdEZvbnRSZWNvcmQgPSBjb250ZXh0LmZvbnRDYXRhbG9nLmdldExpc3QoMSlbMF07XHJcbiAgICAgICAgICAgIHJldHVybiA8VGVtcGxhdGVTdGF0ZT57XHJcbiAgICAgICAgICAgICAgICBkZXNpZ246IHtcclxuICAgICAgICAgICAgICAgICAgICBzaGFwZTogXCJuYXJyb3dcIixcclxuICAgICAgICAgICAgICAgICAgICBmb250OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbWlseTogZGVmYXVsdEZvbnRSZWNvcmQuZmFtaWx5XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzZWVkOiBNYXRoLnJhbmRvbSgpXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZm9udENhdGVnb3J5OiBkZWZhdWx0Rm9udFJlY29yZC5jYXRlZ29yeVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjcmVhdGVVSShjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IEJ1aWxkZXJDb250cm9sW10ge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUZXh0RW50cnkoKSxcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhcGVDaG9vc2VyKGNvbnRleHQpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVWYXJpYXRpb25Db250cm9sKCksXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmNyZWF0ZUZvbnRDaG9vc2VyKCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVBhbGV0dGVDaG9vc2VyKClcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJ1aWxkKGRlc2lnbjogRGVzaWduLCBjb250ZXh0OiBUZW1wbGF0ZUJ1aWxkQ29udGV4dCk6IFByb21pc2U8cGFwZXIuSXRlbT4ge1xyXG4gICAgICAgICAgICBpZiAoIWRlc2lnbi5jb250ZW50IHx8ICFkZXNpZ24uY29udGVudC50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5nZXRGb250KGRlc2lnbi5mb250KS50aGVuKGZvbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd29yZHMgPSBkZXNpZ24uY29udGVudC50ZXh0LnRvTG9jYWxlVXBwZXJDYXNlKCkuc3BsaXQoL1xccy8pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZWRSYW5kb20gPSBuZXcgRnJhbWV3b3JrLlNlZWRSYW5kb20oXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzaWduLnNlZWQgPT0gbnVsbCA/IE1hdGgucmFuZG9tKCkgOiBkZXNpZ24uc2VlZCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0TGVuZ3RoOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGRlc2lnbi5zaGFwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJiYWxhbmNlZFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZW5ndGggPSAyICogTWF0aC5zcXJ0KF8uc3VtKHdvcmRzLm1hcCh3ID0+IHcubGVuZ3RoICsgMSkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIndpZGVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbnVtTGluZXMgPSAzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlbmd0aCA9IF8uc3VtKHdvcmRzLm1hcCh3ID0+IHcubGVuZ3RoICsgMSkpIC8gbnVtTGluZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlbmd0aCA9IDxudW1iZXI+Xy5tYXgod29yZHMubWFwKHcgPT4gdy5sZW5ndGgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRMZW5ndGggKj0gKDAuOCArIHNlZWRSYW5kb20ucmFuZG9tKCkgKiAwLjQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGluZXMgPSB0aGlzLmJhbGFuY2VMaW5lcyh3b3JkcywgdGFyZ2V0TGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdGV4dENvbG9yID0gZGVzaWduLnBhbGV0dGUgJiYgZGVzaWduLnBhbGV0dGUuY29sb3IgfHwgXCJibGFja1wiO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgICAgIGlmIChkZXNpZ24ucGFsZXR0ZSAmJiBkZXNpZ24ucGFsZXR0ZS5pbnZlcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBbdGV4dENvbG9yLCBiYWNrZ3JvdW5kQ29sb3JdID0gW2JhY2tncm91bmRDb2xvciwgdGV4dENvbG9yXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBib3ggPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjcmVhdGVUZXh0QmxvY2sgPSAoczogc3RyaW5nLCBzaXplID0gdGhpcy5kZWZhdWx0Rm9udFNpemUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IGZvbnQuZ2V0UGF0aChzLCAwLCAwLCBzaXplKS50b1BhdGhEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgocGF0aERhdGEpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxheW91dEl0ZW1zID0gbGluZXMubWFwKGxpbmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrOiBjcmVhdGVUZXh0QmxvY2sobGluZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXhXaWR0aCA9IF8ubWF4KGxheW91dEl0ZW1zLm1hcChiID0+IGIuYmxvY2suYm91bmRzLndpZHRoKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhcnJhbmdlUGF0aFBvaW50cyA9IE1hdGgubWluKDQsIE1hdGgucm91bmQobWF4V2lkdGggLyAyKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lSGVpZ2h0ID0gbGF5b3V0SXRlbXNbMF0uYmxvY2suYm91bmRzLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdXBwZXIgPSBuZXcgcGFwZXIuUGF0aChbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsIDApLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChtYXhXaWR0aCwgMClcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxvd2VyOiBwYXBlci5QYXRoO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlbWFpbmluZyA9IGxheW91dEl0ZW1zLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGxheW91dEl0ZW0gb2YgbGF5b3V0SXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoLS1yZW1haW5pbmcgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtaWQgPSB1cHBlci5ib3VuZHMuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsYXN0IGxvd2VyIGxpbmUgaXMgbGV2ZWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG93ZXIgPSBuZXcgcGFwZXIuUGF0aChbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMCwgbWlkLnkgKyBsaW5lSGVpZ2h0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChtYXhXaWR0aCwgbWlkLnkgKyBsaW5lSGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dlciA9IHRoaXMucmFuZG9tTG93ZXJQYXRoRm9yKHVwcGVyLCBsaW5lSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYW5nZVBhdGhQb2ludHMsIHNlZWRSYW5kb20pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHJldGNoID0gbmV3IEZvbnRTaGFwZS5WZXJ0aWNhbEJvdW5kc1N0cmV0Y2hQYXRoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXRJdGVtLmJsb2NrLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHVwcGVyLCBsb3dlciB9KTtcclxuICAgICAgICAgICAgICAgICAgICBzdHJldGNoLmZpbGxDb2xvciA9IHRleHRDb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICBib3guYWRkQ2hpbGQoc3RyZXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBwZXIgPSBsb3dlcjtcclxuICAgICAgICAgICAgICAgICAgICBsb3dlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRlc2lnbi5jb250ZW50LnNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZUJsb2NrID0gY3JlYXRlVGV4dEJsb2NrKGRlc2lnbi5jb250ZW50LnNvdXJjZSwgdGhpcy5kZWZhdWx0Rm9udFNpemUgKiAwLjMzKTtcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VCbG9jay5maWxsQ29sb3IgPSB0ZXh0Q29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlQmxvY2sudHJhbnNsYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cHBlci5ib3VuZHMuYm90dG9tTGVmdC5hZGQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGggLSBzb3VyY2VCbG9jay5ib3VuZHMud2lkdGgsIC8vIHJpZ2h0LWFsaWduXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlQmxvY2suYm91bmRzLmhlaWdodCAqIDEuMSAvLyBzaGlmdCBoZWlnaHQgcGx1cyB0b3AgbWFyZ2luXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNvdXJjZUJsb2NrLmJvdW5kcy5sZWZ0IDwgMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkanVzdCBmb3IgbG9uZyBzb3VyY2UgbGluZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VCbG9jay5ib3VuZHMubGVmdCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJveC5hZGRDaGlsZChzb3VyY2VCbG9jayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYm91bmRzID0gYm94LmJvdW5kcy5jbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgYm91bmRzLnNpemUgPSBib3VuZHMuc2l6ZS5tdWx0aXBseSgxICsgdGhpcy5tYXJnaW5GYWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgYm91bmRzLmNlbnRlciA9IGJveC5ib3VuZHMuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHBhcGVyLlNoYXBlLlJlY3RhbmdsZShib3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZC5maWxsQ29sb3IgPSBiYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgICAgICBib3guaW5zZXJ0Q2hpbGQoMCwgYmFja2dyb3VuZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJveDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHJhbmRvbUxvd2VyUGF0aEZvcihcclxuICAgICAgICAgICAgdXBwZXI6IHBhcGVyLlBhdGgsXHJcbiAgICAgICAgICAgIGF2Z0hlaWdodDogbnVtYmVyLFxyXG4gICAgICAgICAgICBudW1Qb2ludHMsXHJcbiAgICAgICAgICAgIHNlZWRSYW5kb206IEZyYW1ld29yay5TZWVkUmFuZG9tXHJcbiAgICAgICAgKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50czogcGFwZXIuUG9pbnRbXSA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgdXBwZXJDZW50ZXIgPSB1cHBlci5ib3VuZHMuY2VudGVyO1xyXG4gICAgICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUG9pbnRzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSB1cHBlckNlbnRlci55ICsgKHNlZWRSYW5kb20ucmFuZG9tKCkgLSAwLjUpICogdGhpcy5saW5lSGVpZ2h0VmFyaWF0aW9uICogYXZnSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2gobmV3IHBhcGVyLlBvaW50KHgsIHkpKTtcclxuICAgICAgICAgICAgICAgIHggKz0gdXBwZXIuYm91bmRzLndpZHRoIC8gKG51bVBvaW50cyAtIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBuZXcgcGFwZXIuUGF0aChwb2ludHMpO1xyXG4gICAgICAgICAgICBwYXRoLnNtb290aCgpO1xyXG4gICAgICAgICAgICBwYXRoLmJvdW5kcy5jZW50ZXIgPSB1cHBlci5ib3VuZHMuY2VudGVyLmFkZChuZXcgcGFwZXIuUG9pbnQoMCwgYXZnSGVpZ2h0KSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBiYWxhbmNlTGluZXMod29yZHM6IHN0cmluZ1tdLCB0YXJnZXRMZW5ndGg6IG51bWJlcikge1xyXG4gICAgICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgICAgY29uc3QgY2FsY1Njb3JlID0gKHRleHQ6IHN0cmluZykgPT5cclxuICAgICAgICAgICAgICAgIE1hdGgucG93KE1hdGguYWJzKHRhcmdldExlbmd0aCAtIHRleHQubGVuZ3RoKSwgMik7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3VycmVudExpbmUgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFNjb3JlID0gMTAwMDA7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAod29yZHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3b3JkID0gd29yZHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xpbmUgPSBjdXJyZW50TGluZSArIFwiIFwiICsgd29yZDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Njb3JlID0gY2FsY1Njb3JlKG5ld0xpbmUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRMaW5lICYmIG5ld1Njb3JlIDw9IGN1cnJlbnRTY29yZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFwcGVuZFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lICs9IFwiIFwiICsgd29yZDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NvcmUgPSBuZXdTY29yZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGxpbmVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudExpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaChjdXJyZW50TGluZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gd29yZDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NvcmUgPSBjYWxjU2NvcmUoY3VycmVudExpbmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxpbmVzLnB1c2goY3VycmVudExpbmUpO1xyXG4gICAgICAgICAgICByZXR1cm4gbGluZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVRleHRFbnRyeSgpOiBCdWlsZGVyQ29udHJvbCB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1haW5UZXh0SW5wdXQgPSBuZXcgVGV4dElucHV0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVRleHRJbnB1dCA9IG5ldyBUZXh0SW5wdXQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZU5vZGU6ICh2YWx1ZTogVGVtcGxhdGVTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJoM1wiLCB7fSwgW1wiTWVzc2FnZVwiXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluVGV4dElucHV0LmNyZWF0ZU5vZGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgJiYgdmFsdWUuZGVzaWduLmNvbnRlbnQgJiYgdmFsdWUuZGVzaWduLmNvbnRlbnQudGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIldoYXQgZG8geW91IHdhbnQgdG8gc2F5P1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlVGV4dElucHV0LmNyZWF0ZU5vZGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgJiYgdmFsdWUuZGVzaWduLmNvbnRlbnQgJiYgdmFsdWUuZGVzaWduLmNvbnRlbnQuc291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiU291cmNlIChhdXRob3IsIHBhc3NhZ2UsIGV0YylcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSQ6IFJ4Lk9ic2VydmFibGUubWVyZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFpblRleHRJbnB1dC52YWx1ZSQubWFwKHQgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFRlbXBsYXRlU3RhdGVDaGFuZ2U+eyBkZXNpZ246IHsgY29udGVudDogeyB0ZXh0OiB0IH0gfSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICwgc291cmNlVGV4dElucHV0LnZhbHVlJC5tYXAodCA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8VGVtcGxhdGVTdGF0ZUNoYW5nZT57IGRlc2lnbjogeyBjb250ZW50OiB7IHNvdXJjZTogdCB9IH0gfSlcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVTaGFwZUNob29zZXIoY29udGV4dDogVGVtcGxhdGVVSUNvbnRleHQpOiBCdWlsZGVyQ29udHJvbCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlJCA9IG5ldyBSeC5TdWJqZWN0PFRlbXBsYXRlU3RhdGVDaGFuZ2U+KCk7XHJcbiAgICAgICAgICAgIHJldHVybiA8QnVpbGRlckNvbnRyb2w+e1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlTm9kZTogKHRzOiBUZW1wbGF0ZVN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVzID0gW1wibmFycm93XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGJhbGFuY2VkIG9ubHkgYXZhaWxhYmxlIGZvciA+PSBOIHdvcmRzXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRzLmRlc2lnbi5jb250ZW50ICYmIHRzLmRlc2lnbi5jb250ZW50LnRleHQgJiYgdHMuZGVzaWduLmNvbnRlbnQudGV4dC5zcGxpdCgvXFxzLykubGVuZ3RoID49IDcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcGVzLnB1c2goXCJiYWxhbmNlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVzLnB1c2goXCJ3aWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNob2ljZXMgPSBzaGFwZXMubWFwKHNoYXBlID0+IDxDb250cm9sSGVscGVycy5DaG9pY2U+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwic3BhblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc2hhcGVdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hvc2VuOiB0cy5kZXNpZ24uc2hhcGUgPT09IHNoYXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUkLm9uTmV4dCh7IGRlc2lnbjogeyBzaGFwZSB9IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJoM1wiLCB7fSwgW1wiU2hhcGVcIl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29udHJvbEhlbHBlcnMuY2hvb3NlcihjaG9pY2VzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWUkOiB2YWx1ZSQuYXNPYnNlcnZhYmxlKClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlVmFyaWF0aW9uQ29udHJvbCgpOiBCdWlsZGVyQ29udHJvbCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlJCA9IG5ldyBSeC5TdWJqZWN0PFRlbXBsYXRlU3RhdGVDaGFuZ2U+KCk7XHJcbiAgICAgICAgICAgIHJldHVybiA8QnVpbGRlckNvbnRyb2w+e1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlTm9kZTogKHRzOiBUZW1wbGF0ZVN0YXRlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IGgoXCJidXR0b24uYnRuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHZhbHVlJC5vbk5leHQoeyBkZXNpZ246IHsgc2VlZDogTWF0aC5yYW5kb20oKSB9IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIlRyeSBhbm90aGVyIHZhcmlhdGlvblwiXVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJoM1wiLCB7fSwgW1wiVmFyaWF0aW9uXCJdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWUkOiB2YWx1ZSQuYXNPYnNlcnZhYmxlKClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlUGFsZXR0ZUNob29zZXIoKTogQnVpbGRlckNvbnRyb2wge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJzZWRDb2xvcnMgPSB0aGlzLnBhbGV0dGVDb2xvcnMubWFwKGMgPT4gbmV3IHBhcGVyLkNvbG9yKGMpKTtcclxuICAgICAgICAgICAgY29uc3QgY29sb3JzID0gXy5zb3J0QnkocGFyc2VkQ29sb3JzLCBjID0+IGMuaHVlKVxyXG4gICAgICAgICAgICAgICAgLm1hcChjID0+IGMudG9DU1ModHJ1ZSkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8VGVtcGxhdGVTdGF0ZUNoYW5nZT4oKTtcclxuICAgICAgICAgICAgcmV0dXJuIDxCdWlsZGVyQ29udHJvbD57XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVOb2RlOiAodHM6IFRlbXBsYXRlU3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWxldHRlID0gdHMuZGVzaWduLnBhbGV0dGU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hvaWNlcyA9IGNvbG9ycy5tYXAoY29sb3IgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbnRyb2xIZWxwZXJzLkNob2ljZT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwiZGl2LnBhbGV0dGVUaWxlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9zZW46IHBhbGV0dGUgJiYgcGFsZXR0ZS5jb2xvciA9PT0gY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlJC5vbk5leHQoeyBkZXNpZ246IHsgcGFsZXR0ZTogeyBjb2xvciB9IH0gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnZlcnROb2RlID0gaChcImRpdlwiLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJsYWJlbFwiLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNoZWNrYm94XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiBwYWxldHRlICYmIHBhbGV0dGUuaW52ZXJ0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHZhbHVlJC5vbk5leHQoeyBkZXNpZ246IHsgcGFsZXR0ZTogeyBpbnZlcnQ6IGV2LnRhcmdldC5jaGVja2VkIH0gfSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiSW52ZXJ0IGNvbG9yXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGgoXCJkaXYuY29sb3JDaG9vc2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJoM1wiLCB7fSwgW1wiQ29sb3JcIl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29udHJvbEhlbHBlcnMuY2hvb3NlcihjaG9pY2VzKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmVydE5vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbHVlJDogdmFsdWUkLmFzT2JzZXJ2YWJsZSgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGFsZXR0ZUNvbG9ycyA9IFtcclxuICAgICAgICAgICAgXCIjNGIzODMyXCIsXHJcbiAgICAgICAgICAgIFwiIzg1NDQ0MlwiLFxyXG4gICAgICAgICAgICAvL1wiI2ZmZjRlNlwiLFxyXG4gICAgICAgICAgICBcIiMzYzJmMmZcIixcclxuICAgICAgICAgICAgXCIjYmU5YjdiXCIsXHJcblxyXG4gICAgICAgICAgICBcIiMxYjg1YjhcIixcclxuICAgICAgICAgICAgXCIjNWE1MjU1XCIsXHJcbiAgICAgICAgICAgIFwiIzU1OWU4M1wiLFxyXG4gICAgICAgICAgICBcIiNhZTVhNDFcIixcclxuICAgICAgICAgICAgXCIjYzNjYjcxXCIsXHJcblxyXG4gICAgICAgICAgICBcIiMwZTFhNDBcIixcclxuICAgICAgICAgICAgXCIjMjIyZjViXCIsXHJcbiAgICAgICAgICAgIFwiIzVkNWQ1ZFwiLFxyXG4gICAgICAgICAgICBcIiM5NDZiMmRcIixcclxuICAgICAgICAgICAgXCIjMDAwMDAwXCIsXHJcblxyXG4gICAgICAgICAgICBcIiNlZGM5NTFcIixcclxuICAgICAgICAgICAgXCIjZWI2ODQxXCIsXHJcbiAgICAgICAgICAgIFwiI2NjMmEzNlwiLFxyXG4gICAgICAgICAgICBcIiM0ZjM3MmRcIixcclxuICAgICAgICAgICAgXCIjMDBhMGIwXCIsXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIERvY3VtZW50S2V5SGFuZGxlciB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG5cclxuICAgICAgICAgICAgLy8gbm90ZTogdW5kaXNwb3NlZCBldmVudCBzdWJzY3JpcHRpb25cclxuICAgICAgICAgICAgJChkb2N1bWVudCkua2V5dXAoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSBEb21IZWxwZXJzLktleUNvZGVzLkVzYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFNrZXRjaEVkaXRvck1vZHVsZSB7XHJcblxyXG4gICAgICAgIGFwcFN0b3JlOiBBcHAuU3RvcmU7XHJcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIHdvcmtzcGFjZUNvbnRyb2xsZXI6IFdvcmtzcGFjZUNvbnRyb2xsZXI7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGFwcFN0b3JlOiBBcHAuU3RvcmUpIHtcclxuICAgICAgICAgICAgdGhpcy5hcHBTdG9yZSA9IGFwcFN0b3JlO1xyXG5cclxuICAgICAgICAgICAgRG9tSGVscGVycy5pbml0RXJyb3JIYW5kbGVyKGVycm9yRGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoZXJyb3JEYXRhKTtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvY2xpZW50LWVycm9yc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY29udGVudFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gbmV3IFN0b3JlKGFwcFN0b3JlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJhciA9IG5ldyBFZGl0b3JCYXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2lnbmVyJyksIHRoaXMuc3RvcmUpO1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZEl0ZW1FZGl0b3IgPSBuZXcgU2VsZWN0ZWRJdGVtRWRpdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdG9yT3ZlcmxheVwiKSwgdGhpcy5zdG9yZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGhlbHBEaWFsb2cgPSBuZXcgSGVscERpYWxvZyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlbHAtZGlhbG9nXCIpLCB0aGlzLnN0b3JlKTtcclxuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9uUGFuZWwgPSBuZXcgT3BlcmF0aW9uUGFuZWwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVyYXRpb25QYW5lbFwiKSwgdGhpcy5zdG9yZSk7XHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzLnN0b3JlLmV2ZW50cy5zdWJzY3JpYmUobSA9PiBjb25zb2xlLmxvZyhcImV2ZW50XCIsIG0udHlwZSwgbS5kYXRhKSk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuc3RvcmUuYWN0aW9ucy5zdWJzY3JpYmUobSA9PiBjb25zb2xlLmxvZyhcImFjdGlvblwiLCBtLnR5cGUsIG0uZGF0YSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhcnQoKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmV2ZW50cy5lZGl0b3IuZm9udExvYWRlZC5vYnNlcnZlKCkuZmlyc3QoKS5zdWJzY3JpYmUobSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2VDb250cm9sbGVyID0gbmV3IFdvcmtzcGFjZUNvbnRyb2xsZXIodGhpcy5zdG9yZSwgbS5kYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLmluaXRXb3Jrc3BhY2UuZGlzcGF0Y2goKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmV2ZW50cy5lZGl0b3Iud29ya3NwYWNlSW5pdGlhbGl6ZWQuc3ViKCgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKFwiYmVmb3JldW5sb2FkXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoSXNEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiWW91ciBsYXRlc3QgY2hhbmdlcyBhcmUgbm90IHNhdmVkIHlldC5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvcGVuU2tldGNoKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5vcGVuLmRpc3BhdGNoKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU2tldGNoSGVscGVycyB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBjb2xvcnNJblVzZShza2V0Y2g6IFNrZXRjaCk6IHN0cmluZ1tdIHtcclxuICAgICAgICAgICAgbGV0IGNvbG9ycyA9IFtza2V0Y2guYmFja2dyb3VuZENvbG9yXTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiBza2V0Y2gudGV4dEJsb2Nrcykge1xyXG4gICAgICAgICAgICAgICAgY29sb3JzLnB1c2goYmxvY2suYmFja2dyb3VuZENvbG9yKTtcclxuICAgICAgICAgICAgICAgIGNvbG9ycy5wdXNoKGJsb2NrLnRleHRDb2xvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29sb3JzID0gXy51bmlxKGNvbG9ycy5maWx0ZXIoYyA9PiBjICE9IG51bGwpKTtcclxuICAgICAgICAgICAgY29sb3JzLnNvcnQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbG9ycztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3RhdGljIGdldFNrZXRjaEZpbGVOYW1lKHNrZXRjaDogU2tldGNoLCBsZW5ndGg6IG51bWJlciwgZXh0ZW5zaW9uPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IG5hbWUgPSBcIlwiO1xyXG4gICAgICAgICAgICBvdXRlcjpcclxuICAgICAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiBza2V0Y2gudGV4dEJsb2Nrcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB3b3JkIG9mIGJsb2NrLnRleHQuc3BsaXQoL1xccy8pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJpbSA9IHdvcmQucmVwbGFjZSgvXFxXL2csICcnKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyaW0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lLmxlbmd0aCkgbmFtZSArPSBcIiBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSArPSB0cmltO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGggPj0gbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIW5hbWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gXCJmaWRkbGVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZXh0ZW5zaW9uID8gbmFtZSArIFwiLlwiICsgZXh0ZW5zaW9uIDogbmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIlxyXG5uYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBzaW5nbGV0b24gU3RvcmUgY29udHJvbHMgYWxsIGFwcGxpY2F0aW9uIHN0YXRlLlxyXG4gICAgICogTm8gcGFydHMgb3V0c2lkZSBvZiB0aGUgU3RvcmUgbW9kaWZ5IGFwcGxpY2F0aW9uIHN0YXRlLlxyXG4gICAgICogQ29tbXVuaWNhdGlvbiB3aXRoIHRoZSBTdG9yZSBpcyBkb25lIHRocm91Z2ggbWVzc2FnZSBDaGFubmVsczogXHJcbiAgICAgKiAgIC0gQWN0aW9ucyBjaGFubmVsIHRvIHNlbmQgaW50byB0aGUgU3RvcmUsXHJcbiAgICAgKiAgIC0gRXZlbnRzIGNoYW5uZWwgdG8gcmVjZWl2ZSBub3RpZmljYXRpb24gZnJvbSB0aGUgU3RvcmUuXHJcbiAgICAgKiBPbmx5IHRoZSBTdG9yZSBjYW4gcmVjZWl2ZSBhY3Rpb24gbWVzc2FnZXMuXHJcbiAgICAgKiBPbmx5IHRoZSBTdG9yZSBjYW4gc2VuZCBldmVudCBtZXNzYWdlcy5cclxuICAgICAqIFRoZSBTdG9yZSBjYW5ub3Qgc2VuZCBhY3Rpb25zIG9yIGxpc3RlbiB0byBldmVudHMgKHRvIGF2b2lkIGxvb3BzKS5cclxuICAgICAqIE1lc3NhZ2VzIGFyZSB0byBiZSB0cmVhdGVkIGFzIGltbXV0YWJsZS5cclxuICAgICAqIEFsbCBtZW50aW9ucyBvZiB0aGUgU3RvcmUgY2FuIGJlIGFzc3VtZWQgdG8gbWVhbiwgb2YgY291cnNlLFxyXG4gICAgICogICBcIlRoZSBTdG9yZSBhbmQgaXRzIHN1Yi1jb21wb25lbnRzLlwiXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBTdG9yZSB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBCUk9XU0VSX0lEX0tFWSA9IFwiYnJvd3NlcklkXCI7XHJcbiAgICAgICAgc3RhdGljIEZBTExCQUNLX0ZPTlRfVVJMID0gXCIvZm9udHMvUm9ib3RvLTUwMC50dGZcIjtcclxuICAgICAgICBzdGF0aWMgREVGQVVMVF9GT05UX05BTUUgPSBcIlJvYm90b1wiO1xyXG4gICAgICAgIHN0YXRpYyBTS0VUQ0hfTE9DQUxfQ0FDSEVfS0VZID0gXCJmaWRkbGVzdGlja3MuaW8ubGFzdFNrZXRjaFwiO1xyXG4gICAgICAgIHN0YXRpYyBMT0NBTF9DQUNIRV9ERUxBWV9NUyA9IDEwMDA7XHJcbiAgICAgICAgc3RhdGljIFNFUlZFUl9TQVZFX0RFTEFZX01TID0gMTAwMDA7XHJcbiAgICAgICAgc3RhdGljIEdSRUVUSU5HX1NLRVRDSF9JRCA9IFwiaW0yYmE5MmkxNzE0aVwiO1xyXG5cclxuICAgICAgICBmb250TGlzdExpbWl0ID0gMjUwO1xyXG5cclxuICAgICAgICBzdGF0ZTogRWRpdG9yU3RhdGUgPSB7fTtcclxuICAgICAgICByZXNvdXJjZXM6IFN0b3JlUmVzb3VyY2VzID0ge307XHJcbiAgICAgICAgYWN0aW9ucyA9IG5ldyBBY3Rpb25zKCk7XHJcbiAgICAgICAgZXZlbnRzID0gbmV3IEV2ZW50cygpO1xyXG5cclxuICAgICAgICBwcml2YXRlIGFwcFN0b3JlOiBBcHAuU3RvcmU7XHJcbiAgICAgICAgcHJpdmF0ZSBfb3BlcmF0aW9uJCA9IG5ldyBSeC5TdWJqZWN0PE9wZXJhdGlvbj4oKTtcclxuICAgICAgICBwcml2YXRlIF90cmFuc3BhcmVuY3kkID0gbmV3IFJ4LlN1YmplY3Q8Ym9vbGVhbj4oKTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoYXBwU3RvcmU6IEFwcC5TdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlID0gYXBwU3RvcmU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldHVwU3RhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0dXBTdWJzY3JpcHRpb25zKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxvYWRSZXNvdXJjZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldHVwU3RhdGUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuYnJvd3NlcklkID0gQ29va2llcy5nZXQoU3RvcmUuQlJPV1NFUl9JRF9LRVkpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYnJvd3NlcklkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmJyb3dzZXJJZCA9IEZyYW1ld29yay5uZXdpZCgpO1xyXG4gICAgICAgICAgICAgICAgQ29va2llcy5zZXQoU3RvcmUuQlJPV1NFUl9JRF9LRVksIHRoaXMuc3RhdGUuYnJvd3NlcklkLCB7IGV4cGlyZXM6IDIgKiAzNjUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldHVwU3Vic2NyaXB0aW9ucygpIHtcclxuICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuYWN0aW9ucywgZXZlbnRzID0gdGhpcy5ldmVudHM7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBBcHAgLS0tLS1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUuZXZlbnRzLnJvdXRlQ2hhbmdlZC5zdWIocm91dGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm91dGVTa2V0Y2hJZCA9IHJvdXRlLnBhcmFtcy5za2V0Y2hJZDtcclxuICAgICAgICAgICAgICAgIGlmIChyb3V0ZS5uYW1lID09PSBcInNrZXRjaFwiICYmIHJvdXRlU2tldGNoSWQgIT09IHRoaXMuc3RhdGUuc2tldGNoLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlblNrZXRjaChyb3V0ZVNrZXRjaElkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBFZGl0b3IgLS0tLS1cclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmluaXRXb3Jrc3BhY2Uub2JzZXJ2ZSgpXHJcbiAgICAgICAgICAgICAgICAucGF1c2FibGVCdWZmZXJlZChldmVudHMuZWRpdG9yLnJlc291cmNlc1JlYWR5Lm9ic2VydmUoKS5tYXAobSA9PiBtLmRhdGEpKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBza2V0Y2hJZCA9IHRoaXMuYXBwU3RvcmUuc3RhdGUucm91dGUucGFyYW1zLnNrZXRjaElkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IHRoaXMuYXBwU3RvcmUuc3RhdGUubGFzdFNhdmVkU2tldGNoSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb21pc2U6IEpRdWVyeVByb21pc2U8YW55PjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2tldGNoSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9IHRoaXMub3BlblNrZXRjaChza2V0Y2hJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9IHRoaXMubG9hZEdyZWV0aW5nU2tldGNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbigoKSA9PiBldmVudHMuZWRpdG9yLndvcmtzcGFjZUluaXRpYWxpemVkLmRpc3BhdGNoKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBvbiBhbnkgYWN0aW9uLCB1cGRhdGUgc2F2ZSBkZWxheSB0aW1lclxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5vYnNlcnZlKCkuZGVib3VuY2UoU3RvcmUuU0VSVkVSX1NBVkVfREVMQVlfTVMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2tldGNoID0gdGhpcy5zdGF0ZS5za2V0Y2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHNrZXRjaC5faWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBza2V0Y2gudGV4dEJsb2Nrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVTa2V0Y2goc2tldGNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmxvYWRGb250LnN1YnNjcmliZShtID0+XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcy5wYXJzZWRGb250cy5nZXQobS5kYXRhKSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci56b29tVG9GaXQuZm9yd2FyZChcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5lZGl0b3Iuem9vbVRvRml0UmVxdWVzdGVkKTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmV4cG9ydFBORy5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLmV4cG9ydFBOR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kR0FFeHBvcnQobS5kYXRhLnBpeGVscyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3IuZXhwb3J0U1ZHLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5lZGl0b3IuZXhwb3J0U1ZHUmVxdWVzdGVkLmRpc3BhdGNoKG0uZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3Iudmlld0NoYW5nZWQuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLmVkaXRvci52aWV3Q2hhbmdlZC5kaXNwYXRjaChtLmRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLnVwZGF0ZVNuYXBzaG90LnN1Yigoe3NrZXRjaElkLCBwbmdEYXRhVXJsfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNrZXRjaElkID09PSB0aGlzLnN0YXRlLnNrZXRjaC5faWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IHNrZXRjaElkICsgXCIucG5nXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxvYiA9IERvbUhlbHBlcnMuZGF0YVVSTFRvQmxvYihwbmdEYXRhVXJsKTtcclxuICAgICAgICAgICAgICAgICAgICBTM0FjY2Vzcy5wdXRGaWxlKGZpbGVOYW1lLCBcImltYWdlL3BuZ1wiLCBibG9iKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci50b2dnbGVIZWxwLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNob3dIZWxwID0gIXRoaXMuc3RhdGUuc2hvd0hlbHA7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLnNob3dIZWxwQ2hhbmdlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnNob3dIZWxwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci5vcGVuU2FtcGxlLnN1YigoKSA9PiB0aGlzLmxvYWRHcmVldGluZ1NrZXRjaCgpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tIFNrZXRjaCAtLS0tLVxyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2gub3Blbi5zdWIoaWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuU2tldGNoKGlkKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5jcmVhdGUuc3ViKChhdHRyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5ld1NrZXRjaChhdHRyKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5jbGVhci5zdWIoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclNrZXRjaCgpO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guY2xvbmUuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNsb25lID0gXy5jbG9uZSh0aGlzLnN0YXRlLnNrZXRjaCk7XHJcbiAgICAgICAgICAgICAgICBjbG9uZS5faWQgPSBGcmFtZXdvcmsubmV3aWQoKTtcclxuICAgICAgICAgICAgICAgIGNsb25lLmJyb3dzZXJJZCA9IHRoaXMuc3RhdGUuYnJvd3NlcklkO1xyXG4gICAgICAgICAgICAgICAgY2xvbmUuc2F2ZWRBdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goY2xvbmUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guY2xvbmVkLmRpc3BhdGNoKGNsb25lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVsc2VVc2VyTWVzc2FnZShcIkR1cGxpY2F0ZWQgc2tldGNoLiBBZGRyZXNzIG9mIHRoaXMgcGFnZSBoYXMgYmVlbiB1cGRhdGVkLlwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5hdHRyVXBkYXRlLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lcmdlKHRoaXMuc3RhdGUuc2tldGNoLCBldi5kYXRhKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkU2tldGNoQ29udGVudCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihtLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShtLmRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBUZXh0QmxvY2sgLS0tLS1cclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLmFkZFxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gZXYuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXBhdGNoLnRleHQgfHwgIXBhdGNoLnRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrID0geyBfaWQ6IEZyYW1ld29yay5uZXdpZCgpIH0gYXMgVGV4dEJsb2NrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVyZ2UoYmxvY2ssIHBhdGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sudGV4dENvbG9yID0gdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIudGV4dENvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmJhY2tncm91bmRDb2xvciA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWJsb2NrLmZvbnRGYW1pbHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2suZm9udEZhbWlseSA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLmZvbnRWYXJpYW50ID0gdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIuZm9udFZhcmlhbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYWRkZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkVGV4dEJsb2NrRm9udChibG9jayk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUF0dHJcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuZ2V0QmxvY2soZXYuZGF0YS5faWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGF0Y2ggPSA8VGV4dEJsb2NrPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGV2LmRhdGEudGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogZXYuZGF0YS5iYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Q29sb3I6IGV2LmRhdGEudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogZXYuZGF0YS5mb250RmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFZhcmlhbnQ6IGV2LmRhdGEuZm9udFZhcmlhbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9udENoYW5nZWQgPSBwYXRjaC5mb250RmFtaWx5ICE9PSBibG9jay5mb250RmFtaWx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBwYXRjaC5mb250VmFyaWFudCAhPT0gYmxvY2suZm9udFZhcmlhbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWVyZ2UoYmxvY2ssIHBhdGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibG9jay5mb250RmFtaWx5ICYmICFibG9jay5mb250VmFyaWFudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5yZXNvdXJjZXMuZm9udENhdGFsb2cuZ2V0UmVjb3JkKGJsb2NrLmZvbnRGYW1pbHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlY29yZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlZ3VsYXIgb3IgZWxzZSBmaXJzdCB2YXJpYW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2suZm9udFZhcmlhbnQgPSBGb250U2hhcGUuRm9udENhdGFsb2cuZGVmYXVsdFZhcmlhbnQocmVjb3JkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Q29sb3I6IGJsb2NrLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogYmxvY2suYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogYmxvY2suZm9udEZhbWlseSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRWYXJpYW50OiBibG9jay5mb250VmFyaWFudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnRleHRibG9jay5hdHRyQ2hhbmdlZC5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb250Q2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkVGV4dEJsb2NrRm9udChibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpZERlbGV0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIF8ucmVtb3ZlKHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsIHRiID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRiLl9pZCA9PT0gZXYuZGF0YS5faWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZERlbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnRleHRibG9jay5yZW1vdmVkLmRpc3BhdGNoKHsgX2lkOiBldi5kYXRhLl9pZCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkU2tldGNoQ29udGVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5nZXRCbG9jayhldi5kYXRhLl9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLnBvc2l0aW9uID0gZXYuZGF0YS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sub3V0bGluZSA9IGV2LmRhdGEub3V0bGluZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnRleHRibG9jay5hcnJhbmdlQ2hhbmdlZC5kaXNwYXRjaChibG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBvcGVyYXRpb24kKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3BlcmF0aW9uJC5hc09ic2VydmFibGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB0cmFuc3BhcmVuY3kkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNwYXJlbmN5JC5hc09ic2VydmFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHVibGljIHNob3dPcGVyYXRpb24ob3BlcmF0aW9uOiBPcGVyYXRpb24pe1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLm9wZXJhdGlvbiA9IG9wZXJhdGlvbjtcclxuICAgICAgICAgICAgb3BlcmF0aW9uLm9uQ2xvc2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnN0YXRlLm9wZXJhdGlvbiA9PT0gb3BlcmF0aW9uKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGVPcGVyYXRpb24oKTsgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fb3BlcmF0aW9uJC5vbk5leHQob3BlcmF0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHVibGljIGhpZGVPcGVyYXRpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUub3BlcmF0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fb3BlcmF0aW9uJC5vbk5leHQobnVsbCk7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBpbWFnZVVwbG9hZGVkKHNyYzogc3RyaW5nKXtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS51cGxvYWRlZEltYWdlID0gc3JjO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guaW1hZ2VVcGxvYWRlZC5kaXNwYXRjaChzcmMpO1xyXG4gICAgICAgICAgICBpZighdGhpcy5zdGF0ZS50cmFuc3BhcmVuY3kpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUcmFuc3BhcmVuY3kodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHJlbW92ZVVwbG9hZGVkSW1hZ2UoKXtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS51cGxvYWRlZEltYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmltYWdlVXBsb2FkZWQuZGlzcGF0Y2gobnVsbCk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuc3RhdGUudHJhbnNwYXJlbmN5KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VHJhbnNwYXJlbmN5KGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNldFRyYW5zcGFyZW5jeSh2YWx1ZT86IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS50cmFuc3BhcmVuY3kgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNwYXJlbmN5JC5vbk5leHQodGhpcy5zdGF0ZS50cmFuc3BhcmVuY3kpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBvcGVuU2tldGNoKGlkOiBzdHJpbmcpOiBKUXVlcnlQcm9taXNlPFNrZXRjaD4ge1xyXG4gICAgICAgICAgICBpZiAoIWlkIHx8ICFpZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gUzNBY2Nlc3MuZ2V0SnNvbihpZCArIFwiLmpzb25cIilcclxuICAgICAgICAgICAgICAgIC5mYWlsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gPFNrZXRjaD50aGlzLmRlZmF1bHRTa2V0Y2hBdHRyKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAoc2tldGNoOiBTa2V0Y2gpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goc2tldGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXRyaWV2ZWQgc2tldGNoXCIsIHNrZXRjaC5faWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChza2V0Y2guYnJvd3NlcklkID09PSB0aGlzLnN0YXRlLmJyb3dzZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2tldGNoIHdhcyBjcmVhdGVkIGluIHRoaXMgYnJvd3NlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NrZXRjaCB3YXMgY3JlYXRlZCBpbiBhIGRpZmZlcmVudCBicm93c2VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2tldGNoO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiZXJyb3IgZ2V0dGluZyByZW1vdGUgc2tldGNoXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkR3JlZXRpbmdTa2V0Y2goKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkU2tldGNoKHNrZXRjaDogU2tldGNoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoID0gc2tldGNoO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0VXNlck1lc3NhZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5sb2FkZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlLmFjdGlvbnMuZWRpdG9yTG9hZGVkU2tldGNoLmRpc3BhdGNoKHNrZXRjaC5faWQpO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRiIG9mIHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5sb2FkZWQuZGlzcGF0Y2godGIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkVGV4dEJsb2NrRm9udCh0Yik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVkaXRvci56b29tVG9GaXRSZXF1ZXN0ZWQuZGlzcGF0Y2goKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkR3JlZXRpbmdTa2V0Y2goKTogSlF1ZXJ5UHJvbWlzZTxhbnk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFMzQWNjZXNzLmdldEpzb24oU3RvcmUuR1JFRVRJTkdfU0tFVENIX0lEICsgXCIuanNvblwiKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoKHNrZXRjaDogU2tldGNoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tldGNoLl9pZCA9IEZyYW1ld29yay5uZXdpZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNrZXRjaC5icm93c2VySWQgPSB0aGlzLnN0YXRlLmJyb3dzZXJJZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goc2tldGNoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjbGVhclNrZXRjaCgpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2tldGNoID0gPFNrZXRjaD50aGlzLmRlZmF1bHRTa2V0Y2hBdHRyKCk7XHJcbiAgICAgICAgICAgIHNrZXRjaC5faWQgPSB0aGlzLnN0YXRlLnNrZXRjaC5faWQ7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkUmVzb3VyY2VzKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlcy5wYXJzZWRGb250cyA9IG5ldyBGb250U2hhcGUuUGFyc2VkRm9udHMocGFyc2VkID0+XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lZGl0b3IuZm9udExvYWRlZC5kaXNwYXRjaChwYXJzZWQuZm9udCkpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBGb250U2hhcGUuRm9udENhdGFsb2cuZnJvbUxvY2FsKFwiZm9udHMvZ29vZ2xlLWZvbnRzLmpzb25cIilcclxuICAgICAgICAgICAgICAgIC50aGVuKGNhdGFsb2cgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZvbnRDYXRhbG9nID0gY2F0YWxvZztcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBsb2FkIGZvbnRzIGludG8gYnJvd3NlciBmb3IgcHJldmlld1xyXG4gICAgICAgICAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5sb2FkUHJldmlld1N1YnNldHMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGFsb2cuZ2V0TGlzdCh0aGlzLmZvbnRMaXN0TGltaXQpLm1hcChmID0+IGYuZmFtaWx5KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChTdG9yZS5GQUxMQkFDS19GT05UX1VSTCkudGhlbigoe2ZvbnR9KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcy5mYWxsYmFja0ZvbnQgPSBmb250KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnJlc291cmNlc1JlYWR5LmRpc3BhdGNoKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNldFVzZXJNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS51c2VyTWVzc2FnZSAhPT0gbWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS51c2VyTWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lZGl0b3IudXNlck1lc3NhZ2VDaGFuZ2VkLmRpc3BhdGNoKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHB1bHNlVXNlck1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlck1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXREZWZhdWx0VXNlck1lc3NhZ2UoKSwgNDAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNldERlZmF1bHRVc2VyTWVzc2FnZSgpIHtcclxuICAgICAgICAgICAgLy8gaWYgbm90IHRoZSBsYXN0IHNhdmVkIHNrZXRjaCwgb3Igc2tldGNoIGlzIGRpcnR5LCBzaG93IFwiVW5zYXZlZFwiXHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAodGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5XHJcbiAgICAgICAgICAgICAgICB8fCAhdGhpcy5zdGF0ZS5za2V0Y2guc2F2ZWRBdClcclxuICAgICAgICAgICAgICAgID8gXCJVbnNhdmVkXCJcclxuICAgICAgICAgICAgICAgIDogXCJTYXZlZFwiO1xyXG4gICAgICAgICAgICB0aGlzLnNldFVzZXJNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkVGV4dEJsb2NrRm9udChibG9jazogVGV4dEJsb2NrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZvbnRDYXRhbG9nLmdldFVybChibG9jay5mb250RmFtaWx5LCBibG9jay5mb250VmFyaWFudCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoe2ZvbnR9KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5mb250UmVhZHkuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dEJsb2NrSWQ6IGJsb2NrLl9pZCwgZm9udCB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNoYW5nZWRTa2V0Y2hDb250ZW50KCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guY29udGVudENoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBtZXJnZTxUPihkZXN0OiBULCBzb3VyY2U6IFQpIHtcclxuICAgICAgICAgICAgXy5tZXJnZShkZXN0LCBzb3VyY2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBuZXdTa2V0Y2goYXR0cj86IFNrZXRjaEF0dHIpOiBTa2V0Y2gge1xyXG4gICAgICAgICAgICBjb25zdCBza2V0Y2ggPSA8U2tldGNoPnRoaXMuZGVmYXVsdFNrZXRjaEF0dHIoKTtcclxuICAgICAgICAgICAgc2tldGNoLl9pZCA9IEZyYW1ld29yay5uZXdpZCgpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXJnZShza2V0Y2gsIGF0dHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2tldGNoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkZWZhdWx0U2tldGNoQXR0cigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDxTa2V0Y2hBdHRyPntcclxuICAgICAgICAgICAgICAgIGJyb3dzZXJJZDogdGhpcy5zdGF0ZS5icm93c2VySWQsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0VGV4dEJsb2NrQXR0cjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwiUm9ib3RvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFZhcmlhbnQ6IFwicmVndWxhclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHRDb2xvcjogXCJncmF5XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwid2hpdGVcIixcclxuICAgICAgICAgICAgICAgIHRleHRCbG9ja3M6IDxUZXh0QmxvY2tbXT5bXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzYXZlU2tldGNoKHNrZXRjaDogU2tldGNoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNhdmluZyA9IF8uY2xvbmUoc2tldGNoKTtcclxuICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgc2F2aW5nLnNhdmVkQXQgPSBub3c7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlck1lc3NhZ2UoXCJTYXZpbmdcIik7XHJcbiAgICAgICAgICAgIFMzQWNjZXNzLnB1dEZpbGUoc2tldGNoLl9pZCArIFwiLmpzb25cIixcclxuICAgICAgICAgICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiLCBKU09OLnN0cmluZ2lmeShzYXZpbmcpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoLnNhdmVkQXQgPSBub3c7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0VXNlck1lc3NhZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcFN0b3JlLmFjdGlvbnMuZWRpdG9yU2F2ZWRTa2V0Y2guZGlzcGF0Y2goc2tldGNoLl9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnNuYXBzaG90RXhwaXJlZC5kaXNwYXRjaChza2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFVzZXJNZXNzYWdlKFwiVW5hYmxlIHRvIHNhdmVcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0U2VsZWN0aW9uKGl0ZW06IFdvcmtzcGFjZU9iamVjdFJlZiwgZm9yY2U6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGlmICghZm9yY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVhcmx5IGV4aXQgb24gbm8gY2hhbmdlXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLnN0YXRlLnNlbGVjdGlvbi5pdGVtSWQgPT09IGl0ZW0uaXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5zZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3Rpb24gPSBpdGVtO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guc2VsZWN0aW9uQ2hhbmdlZC5kaXNwYXRjaChpdGVtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0RWRpdGluZ0l0ZW0oaXRlbTogUG9zaXRpb25lZE9iamVjdFJlZiwgZm9yY2U/OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICghZm9yY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVhcmx5IGV4aXQgb24gbm8gY2hhbmdlXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0uaXRlbUlkID09PSBpdGVtLml0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0pIHtcclxuICAgICAgICAgICAgICAgIC8vIHNpZ25hbCBjbG9zaW5nIGVkaXRvciBmb3IgaXRlbVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtLml0ZW1UeXBlID09PSBcIlRleHRCbG9ja1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEVkaXRpbmdCbG9jayA9IHRoaXMuZ2V0QmxvY2sodGhpcy5zdGF0ZS5lZGl0aW5nSXRlbS5pdGVtSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RWRpdGluZ0Jsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5lZGl0b3JDbG9zZWQuZGlzcGF0Y2goY3VycmVudEVkaXRpbmdCbG9jayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZWRpdGluZyBpdGVtIHNob3VsZCBiZSBzZWxlY3RlZCBpdGVtXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWQuZGlzcGF0Y2goaXRlbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGdldEJsb2NrKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLCB0YiA9PiB0Yi5faWQgPT09IGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2VuZEdBRXhwb3J0KHZhbHVlOiBudW1iZXIpe1xyXG4gICAgICAgICAgICBsZXQgbGFiZWwgPSBTa2V0Y2hIZWxwZXJzLmdldFNrZXRjaEZpbGVOYW1lKHRoaXMuc3RhdGUuc2tldGNoLCAzMCk7XHJcbiAgICAgICAgICAgIGdhRXZlbnQoe1xyXG4gICAgICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogXCJEZXNpZ25cIixcclxuICAgICAgICAgICAgICAgIGV2ZW50QWN0aW9uOiBcImV4cG9ydC1pbWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRMYWJlbDogbGFiZWwsXHJcbiAgICAgICAgICAgICAgICBldmVudFZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW50ZXJmYWNlIFdpbmRvdyB7XHJcbiAgICB3ZWJraXRVUkw6IFVSTDtcclxufVxyXG5cclxubmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFdvcmtzcGFjZUNvbnRyb2xsZXIge1xyXG5cclxuICAgICAgICBzdGF0aWMgVEVYVF9DSEFOR0VfUkVOREVSX1RIUk9UVExFX01TID0gNTAwO1xyXG4gICAgICAgIHN0YXRpYyBCTE9DS19CT1VORFNfQ0hBTkdFX1RIUk9UVExFX01TID0gNTAwO1xyXG5cclxuICAgICAgICBkZWZhdWx0U2l6ZSA9IG5ldyBwYXBlci5TaXplKDUwMDAwLCA0MDAwMCk7XHJcbiAgICAgICAgZGVmYXVsdFNjYWxlID0gMC4wMjtcclxuXHJcbiAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgICAgIGZhbGxiYWNrRm9udDogb3BlbnR5cGUuRm9udDtcclxuICAgICAgICB2aWV3Wm9vbTogcGFwZXJFeHQuVmlld1pvb207XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIHByaXZhdGUgX3NrZXRjaDogU2tldGNoO1xyXG4gICAgICAgIHByaXZhdGUgX3RleHRCbG9ja0l0ZW1zOiB7IFt0ZXh0QmxvY2tJZDogc3RyaW5nXTogVGV4dFdhcnAgfSA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgX3dvcmtzcGFjZTogcGFwZXIuSXRlbTtcclxuICAgICAgICBwcml2YXRlIF9iYWNrZ3JvdW5kSW1hZ2U6IHBhcGVyLlJhc3RlcjtcclxuICAgICAgICBwcml2YXRlIF9tYXJrOiBGc3R4LkZyYW1ld29yay5XYXRlcm1hcms7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSwgZmFsbGJhY2tGb250OiBvcGVudHlwZS5Gb250KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgdGhpcy5mYWxsYmFja0ZvbnQgPSBmYWxsYmFja0ZvbnQ7XHJcbiAgICAgICAgICAgIHBhcGVyLnNldHRpbmdzLmhhbmRsZVNpemUgPSAxO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5DYW52YXMnKTtcclxuICAgICAgICAgICAgcGFwZXIuc2V0dXAodGhpcy5jYW52YXMpO1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3QgPSBwYXBlci5wcm9qZWN0O1xyXG4gICAgICAgICAgICB3aW5kb3cub25yZXNpemUgPSAoKSA9PiB0aGlzLnByb2plY3Qudmlldy5kcmF3KCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjYW52YXNTZWwgPSAkKHRoaXMuY2FudmFzKTtcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLm1lcmdlVHlwZWQoXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZCxcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWRcclxuICAgICAgICAgICAgKS5zdWJzY3JpYmUoZXYgPT5cclxuICAgICAgICAgICAgICAgIGNhbnZhc1NlbC5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGV2LmRhdGEuYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudmlld1pvb20gPSBuZXcgcGFwZXJFeHQuVmlld1pvb20odGhpcy5wcm9qZWN0LCAoKSA9PiBbdGhpcy5fYmFja2dyb3VuZEltYWdlXSk7XHJcbiAgICAgICAgICAgIHRoaXMudmlld1pvb20uc2V0Wm9vbVJhbmdlKFtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFNpemUubXVsdGlwbHkodGhpcy5kZWZhdWx0U2NhbGUgKiAwLjEpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2l6ZS5tdWx0aXBseSgwLjUpXSk7XHJcbiAgICAgICAgICAgIHRoaXMudmlld1pvb20udmlld0NoYW5nZWQuc3Vic2NyaWJlKGJvdW5kcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLmVkaXRvci52aWV3Q2hhbmdlZC5kaXNwYXRjaChib3VuZHMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNsZWFyU2VsZWN0aW9uID0gKGV2OiBwYXBlci5QYXBlck1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChzdG9yZS5zdGF0ZS5zZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2gobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGFwZXIudmlldy5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9qZWN0LmhpdFRlc3QoZXYucG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb24oZXYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcGFwZXIudmlldy5vbihwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGNsZWFyU2VsZWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGtleUhhbmRsZXIgPSBuZXcgRG9jdW1lbnRLZXlIYW5kbGVyKHN0b3JlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX21hcmsgPSBuZXcgRnN0eC5GcmFtZXdvcmsuV2F0ZXJtYXJrKHRoaXMucHJvamVjdCwgXCJpbWcvc3BpcmFsLWxvZ28uc3ZnXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gRGVzaWduZXIgLS0tLS1cclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5lZGl0b3Iud29ya3NwYWNlSW5pdGlhbGl6ZWQuc3ViKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC52aWV3LmRyYXcoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLnpvb21Ub0ZpdFJlcXVlc3RlZC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy56b29tVG9GaXQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLmV4cG9ydFNWR1JlcXVlc3RlZC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb3dubG9hZFNWRygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5lZGl0b3IuZXhwb3J0UE5HUmVxdWVzdGVkLnN1YihvcHRpb25zID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZG93bmxvYWRQTkcob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5zbmFwc2hvdEV4cGlyZWQuc3ViKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0U25hcHNob3RQTkcoNzIpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5lZGl0b3IudXBkYXRlU25hcHNob3QuZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBza2V0Y2hJZDogdGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2guX2lkLCBwbmdEYXRhVXJsOiBkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLSBTa2V0Y2ggLS0tLS1cclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9za2V0Y2ggPSBldi5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuZGVzZWxlY3RBbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl93b3Jrc3BhY2UgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtcyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG0uZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IG0uZGF0YS5pdGVtSWQgJiYgdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLml0ZW1JZF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrICYmICFibG9jay5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tIFRleHRCbG9jayAtLS0tLVxyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLm1lcmdlVHlwZWQoXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmFkZGVkLFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5sb2FkZWRcclxuICAgICAgICAgICAgKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICBldiA9PiB0aGlzLmFkZEJsb2NrKGV2LmRhdGEpKTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWRcclxuICAgICAgICAgICAgICAgIC5vYnNlcnZlKClcclxuICAgICAgICAgICAgICAgIC50aHJvdHRsZShXb3Jrc3BhY2VDb250cm9sbGVyLlRFWFRfQ0hBTkdFX1JFTkRFUl9USFJPVFRMRV9NUylcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0QmxvY2sgPSBtLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udGV4dCA9IHRleHRCbG9jay50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmN1c3RvbVN0eWxlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suZm9udFJlYWR5LnN1YihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1tkYXRhLnRleHRCbG9ja0lkXTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5mb250ID0gZGF0YS5mb250O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmVkaXRvckNsb3NlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5pbWFnZVVwbG9hZGVkLnN1Yih1cmwgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRCYWNrZ3JvdW5kSW1hZ2UodXJsKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS50cmFuc3BhcmVuY3kkLnN1YnNjcmliZSh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93b3Jrc3BhY2Uub3BhY2l0eSA9IHZhbHVlID8gMC43NSA6IDE7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgem9vbVRvRml0KCkge1xyXG4gICAgICAgICAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFZpZXdhYmxlQm91bmRzKCk7XHJcbiAgICAgICAgICAgIGlmIChib3VuZHMud2lkdGggPiAwICYmIGJvdW5kcy5oZWlnaHQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdab29tLnpvb21Ubyhib3VuZHMuc2NhbGUoMS4yKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZ2V0Vmlld2FibGVCb3VuZHMoKTogcGFwZXIuUmVjdGFuZ2xlIHtcclxuICAgICAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5fd29ya3NwYWNlLmJvdW5kcztcclxuICAgICAgICAgICAgaWYgKCFib3VuZHMgfHwgYm91bmRzLndpZHRoID09PSAwIHx8IGJvdW5kcy5oZWlnaHQgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuUmVjdGFuZ2xlKFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLCAwKSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTaXplLm11bHRpcGx5KDAuMDUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYm91bmRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHJldHVybnMgZGF0YSBVUkxcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIGdldFNuYXBzaG90UE5HKGRwaTogbnVtYmVyKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oY2FsbGJhY2sgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHRoaXMuaW5zZXJ0QmFja2dyb3VuZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhc3RlciA9IHRoaXMuX3dvcmtzcGFjZS5yYXN0ZXJpemUoZHBpLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gcmFzdGVyLnRvRGF0YVVSTCgpO1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZG93bmxvYWRQTkcob3B0aW9uczogSW1hZ2VFeHBvcnRPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRwaSA9IFBhcGVySGVscGVycy5nZXRFeHBvcnREcGkodGhpcy5fd29ya3NwYWNlLmJvdW5kcy5zaXplLCBcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMucGl4ZWxzIHx8IDYwMCAqIDYwMCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0U25hcHNob3RQTkcoZHBpKS50aGVuKGRhdGEgPT4geztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gU2tldGNoSGVscGVycy5nZXRTa2V0Y2hGaWxlTmFtZShcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCwgNDAsIFwicG5nXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmxvYiA9IERvbUhlbHBlcnMuZGF0YVVSTFRvQmxvYihkYXRhKTtcclxuICAgICAgICAgICAgICAgIHNhdmVBcyhibG9iLCBmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkb3dubG9hZFNWRygpIHtcclxuICAgICAgICAgICAgY29uc3QgY29tcGxldGVEb3dubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFVcmwgPSBcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LFwiICsgZW5jb2RlVVJJQ29tcG9uZW50KFxyXG4gICAgICAgICAgICAgICAgICAgIDxzdHJpbmc+dGhpcy5fd29ya3NwYWNlLmV4cG9ydFNWRyh7IGFzU3RyaW5nOiB0cnVlIH0pKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBEb21IZWxwZXJzLmRhdGFVUkxUb0Jsb2IoZGF0YVVybCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IFNrZXRjaEhlbHBlcnMuZ2V0U2tldGNoRmlsZU5hbWUoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gsIDQwLCBcInN2Z1wiKTtcclxuICAgICAgICAgICAgICAgIHNhdmVBcyhibG9iLCBmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2guYmFja2dyb3VuZENvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYWNrZ3JvdW5kID0gdGhpcy5pbnNlcnRCYWNrZ3JvdW5kKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlRG93bmxvYWQoKTtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZURvd25sb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluc2VydCBza2V0Y2ggYmFja2dyb3VuZCB0byBwcm92aWRlIGJhY2tncm91bmQgZmlsbCAoaWYgbmVjZXNzYXJ5KVxyXG4gICAgICAgICAqICAgYW5kIGFkZCBtYXJnaW4gYXJvdW5kIGVkZ2VzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgaW5zZXJ0QmFja2dyb3VuZCh3YXRlcm1hcms6IGJvb2xlYW4pOiBwYXBlci5JdGVtIHtcclxuICAgICAgICAgICAgY29uc3Qgc2tldGNoQm91bmRzID0gdGhpcy5nZXRWaWV3YWJsZUJvdW5kcygpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXJnaW4gPSBNYXRoLm1heChza2V0Y2hCb3VuZHMud2lkdGgsIHNrZXRjaEJvdW5kcy5oZWlnaHQpICogMC4wMjtcclxuICAgICAgICAgICAgY29uc3QgaW1hZ2VCb3VuZHMgPSBuZXcgcGFwZXIuUmVjdGFuZ2xlKFxyXG4gICAgICAgICAgICAgICAgc2tldGNoQm91bmRzLnRvcExlZnQuc3VidHJhY3QobWFyZ2luKSxcclxuICAgICAgICAgICAgICAgIHNrZXRjaEJvdW5kcy5ib3R0b21SaWdodC5hZGQobWFyZ2luKSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBmaWxsID0gcGFwZXIuU2hhcGUuUmVjdGFuZ2xlKGltYWdlQm91bmRzKTtcclxuICAgICAgICAgICAgZmlsbC5maWxsQ29sb3IgPSB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaC5iYWNrZ3JvdW5kQ29sb3I7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBiYWNrZ3JvdW5kID0gbmV3IHBhcGVyLkdyb3VwKFtmaWxsXSk7XHJcblxyXG4gICAgICAgICAgICBpZih3YXRlcm1hcmspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcmsucGxhY2VJbnRvKGJhY2tncm91bmQsIDxwYXBlci5Db2xvcj5maWxsLmZpbGxDb2xvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fd29ya3NwYWNlLmluc2VydENoaWxkKDAsIGJhY2tncm91bmQpO1xyXG4gICAgICAgICAgICByZXR1cm4gYmFja2dyb3VuZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYWRkQmxvY2sodGV4dEJsb2NrOiBUZXh0QmxvY2spIHtcclxuICAgICAgICAgICAgaWYgKCF0ZXh0QmxvY2spIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF0ZXh0QmxvY2suX2lkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdyZWNlaXZlZCBibG9jayB3aXRob3V0IGlkJywgdGV4dEJsb2NrKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1t0ZXh0QmxvY2suX2lkXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJSZWNlaXZlZCBhZGRCbG9jayBmb3IgYmxvY2sgdGhhdCBpcyBhbHJlYWR5IGxvYWRlZFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGJvdW5kczogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH07XHJcblxyXG4gICAgICAgICAgICBpZiAodGV4dEJsb2NrLm91dGxpbmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRTZWdtZW50ID0gKHJlY29yZDogU2VnbWVudFJlY29yZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gcmVjb3JkWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwb2ludCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuU2VnbWVudChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkWzFdICYmIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMV0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkWzJdICYmIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMl0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luZ2xlLXBvaW50IHNlZ21lbnRzIGFyZSBzdG9yZWQgYXMgbnVtYmVyWzJdXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KG5ldyBwYXBlci5Qb2ludChyZWNvcmQpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBib3VuZHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBwZXI6IHRleHRCbG9jay5vdXRsaW5lLnRvcC5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvd2VyOiB0ZXh0QmxvY2sub3V0bGluZS5ib3R0b20uc2VnbWVudHMubWFwKGxvYWRTZWdtZW50KVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXRlbSA9IG5ldyBUZXh0V2FycChcclxuICAgICAgICAgICAgICAgIHRoaXMuZmFsbGJhY2tGb250LFxyXG4gICAgICAgICAgICAgICAgdGV4dEJsb2NrLnRleHQsXHJcbiAgICAgICAgICAgICAgICBib3VuZHMsXHJcbiAgICAgICAgICAgICAgICBudWxsLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yIHx8IFwicmVkXCIsICAgIC8vIHRleHRDb2xvciBzaG91bGQgaGF2ZSBiZWVuIHNldCBlbHNld2hlcmUgXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3dvcmtzcGFjZS5hZGRDaGlsZChpdGVtKTtcclxuXHJcbiAgICAgICAgICAgIHBhcGVyRXh0LmV4dGVuZE1vdXNlRXZlbnRzKGl0ZW0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0ZXh0QmxvY2sub3V0bGluZSAmJiB0ZXh0QmxvY2sucG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSBuZXcgcGFwZXIuUG9pbnQodGV4dEJsb2NrLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXRlbS5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VsZWN0IG5leHQgaXRlbSBiZWhpbmRcclxuICAgICAgICAgICAgICAgICAgICBsZXQgb3RoZXJIaXRzID0gKDxUZXh0V2FycFtdPl8udmFsdWVzKHRoaXMuX3RleHRCbG9ja0l0ZW1zKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihpID0+IGkuaWQgIT09IGl0ZW0uaWQgJiYgISFpLmhpdFRlc3QoZXYucG9pbnQpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvdGhlckl0ZW0gPSBfLnNvcnRCeShvdGhlckhpdHMsIGkgPT4gaS5pbmRleClbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVySXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlckl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG90aGVySWQgPSBfLmZpbmRLZXkodGhpcy5fdGV4dEJsb2NrSXRlbXMsIGkgPT4gaSA9PT0gb3RoZXJJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVySWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaXRlbUlkOiBvdGhlcklkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIiB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5icmluZ1RvRnJvbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGl0ZW1JZDogdGV4dEJsb2NrLl9pZCwgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0ZW0ub24ocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ1N0YXJ0LCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0ZW0ub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlRHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS50cmFuc2xhdGUoZXYuZGVsdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0ZW0ub24ocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ0VuZCwgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gPFRleHRCbG9jaz50aGlzLmdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICBibG9jay5faWQgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBcnJhbmdlLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgIGlmICghaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGl0ZW1JZDogdGV4dEJsb2NrLl9pZCwgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaXRlbUNoYW5nZSQgPSBQYXBlck5vdGlmeS5vYnNlcnZlKGl0ZW0sIFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpO1xyXG4gICAgICAgICAgICBpdGVtQ2hhbmdlJFxyXG4gICAgICAgICAgICAgICAgLmRlYm91bmNlKFdvcmtzcGFjZUNvbnRyb2xsZXIuQkxPQ0tfQk9VTkRTX0NIQU5HRV9USFJPVFRMRV9NUylcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+dGhpcy5nZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBcnJhbmdlLmRpc3BhdGNoKGJsb2NrKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXRlbS5kYXRhID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgaWYgKCF0ZXh0QmxvY2sucG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSB0aGlzLnByb2plY3Qudmlldy5ib3VuZHMucG9pbnQuYWRkKFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChpdGVtLmJvdW5kcy53aWR0aCAvIDIsIGl0ZW0uYm91bmRzLmhlaWdodCAvIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoNTApKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtc1t0ZXh0QmxvY2suX2lkXSA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbTogVGV4dFdhcnApOiBCbG9ja0FycmFuZ2VtZW50IHtcclxuICAgICAgICAgICAgLy8gZXhwb3J0IHJldHVybnMgYW4gYXJyYXkgd2l0aCBpdGVtIHR5cGUgYW5kIHNlcmlhbGl6ZWQgb2JqZWN0OlxyXG4gICAgICAgICAgICAvLyAgIFtcIlBhdGhcIiwgUGF0aFJlY29yZF1cclxuICAgICAgICAgICAgY29uc3QgdG9wID0gPFBhdGhSZWNvcmQ+aXRlbS51cHBlci5leHBvcnRKU09OKHsgYXNTdHJpbmc6IGZhbHNlIH0pWzFdO1xyXG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSA8UGF0aFJlY29yZD5pdGVtLmxvd2VyLmV4cG9ydEpTT04oeyBhc1N0cmluZzogZmFsc2UgfSlbMV07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IFtpdGVtLnBvc2l0aW9uLngsIGl0ZW0ucG9zaXRpb24ueV0sXHJcbiAgICAgICAgICAgICAgICBvdXRsaW5lOiB7IHRvcCwgYm90dG9tIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRCYWNrZ3JvdW5kSW1hZ2UodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF1cmwpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9iYWNrZ3JvdW5kSW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2UucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2UgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCByYXN0ZXIgPSBuZXcgcGFwZXIuUmFzdGVyKHVybCk7XHJcbiAgICAgICAgICAgICg8YW55PnJhc3Rlcikub25Mb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmFzdGVyLnNlbmRUb0JhY2soKTtcclxuICAgICAgICAgICAgICAgIHJhc3Rlci5maXRCb3VuZHModGhpcy5nZXRWaWV3YWJsZUJvdW5kcygpKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9iYWNrZ3JvdW5kSW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2UucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2UgPSByYXN0ZXI7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBY3Rpb25zIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWwge1xyXG5cclxuICAgICAgICBlZGl0b3IgPSB7XHJcbiAgICAgICAgICAgIGluaXRXb3Jrc3BhY2U6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5pbml0V29ya3NwYWNlXCIpLFxyXG4gICAgICAgICAgICBsb2FkRm9udDogdGhpcy50b3BpYzxzdHJpbmc+KFwiZGVzaWduZXIubG9hZEZvbnRcIiksXHJcbiAgICAgICAgICAgIHpvb21Ub0ZpdDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLnpvb21Ub0ZpdFwiKSxcclxuICAgICAgICAgICAgZXhwb3J0aW5nSW1hZ2U6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRJbWFnZVwiKSxcclxuICAgICAgICAgICAgZXhwb3J0UE5HOiB0aGlzLnRvcGljPEltYWdlRXhwb3J0T3B0aW9ucz4oXCJkZXNpZ25lci5leHBvcnRQTkdcIiksXHJcbiAgICAgICAgICAgIGV4cG9ydFNWRzogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydFNWR1wiKSxcclxuICAgICAgICAgICAgdmlld0NoYW5nZWQ6IHRoaXMudG9waWM8cGFwZXIuUmVjdGFuZ2xlPihcImRlc2lnbmVyLnZpZXdDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICB1cGRhdGVTbmFwc2hvdDogdGhpcy50b3BpYzx7IHNrZXRjaElkOiBzdHJpbmcsIHBuZ0RhdGFVcmw6IHN0cmluZyB9PihcImRlc2lnbmVyLnVwZGF0ZVNuYXBzaG90XCIpLFxyXG4gICAgICAgICAgICB0b2dnbGVIZWxwOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIudG9nZ2xlSGVscFwiKSxcclxuICAgICAgICAgICAgb3BlblNhbXBsZTogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLm9wZW5TYW1wbGVcIiksXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBza2V0Y2ggPSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5jcmVhdGVcIiksXHJcbiAgICAgICAgICAgIGNsZWFyOiB0aGlzLnRvcGljPHZvaWQ+KFwic2tldGNoLmNsZWFyXCIpLFxyXG4gICAgICAgICAgICBjbG9uZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5jbG9uZVwiKSxcclxuICAgICAgICAgICAgb3BlbjogdGhpcy50b3BpYzxzdHJpbmc+KFwic2tldGNoLm9wZW5cIiksXHJcbiAgICAgICAgICAgIGF0dHJVcGRhdGU6IHRoaXMudG9waWM8U2tldGNoQXR0cj4oXCJza2V0Y2guYXR0clVwZGF0ZVwiKSxcclxuICAgICAgICAgICAgc2V0U2VsZWN0aW9uOiB0aGlzLnRvcGljPFdvcmtzcGFjZU9iamVjdFJlZj4oXCJza2V0Y2guc2V0U2VsZWN0aW9uXCIpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRleHRCbG9jayA9IHtcclxuICAgICAgICAgICAgYWRkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0QmxvY2suYWRkXCIpLFxyXG4gICAgICAgICAgICB1cGRhdGVBdHRyOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0QmxvY2sudXBkYXRlQXR0clwiKSxcclxuICAgICAgICAgICAgdXBkYXRlQXJyYW5nZTogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2VcIiksXHJcbiAgICAgICAgICAgIHJlbW92ZTogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dEJsb2NrLnJlbW92ZVwiKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBFdmVudHMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XHJcblxyXG4gICAgICAgIGVkaXRvciA9IHtcclxuICAgICAgICAgICAgcmVzb3VyY2VzUmVhZHk6IHRoaXMudG9waWM8Ym9vbGVhbj4oXCJhcHAucmVzb3VyY2VzUmVhZHlcIiksXHJcbiAgICAgICAgICAgIHdvcmtzcGFjZUluaXRpYWxpemVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiYXBwLndvcmtzcGFjZUluaXRpYWxpemVkXCIpLFxyXG4gICAgICAgICAgICBmb250TG9hZGVkOiB0aGlzLnRvcGljPG9wZW50eXBlLkZvbnQ+KFwiYXBwLmZvbnRMb2FkZWRcIiksXHJcbiAgICAgICAgICAgIHpvb21Ub0ZpdFJlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZFwiKSxcclxuICAgICAgICAgICAgZXhwb3J0UE5HUmVxdWVzdGVkOiB0aGlzLnRvcGljPEltYWdlRXhwb3J0T3B0aW9ucz4oXCJkZXNpZ25lci5leHBvcnRQTkdSZXF1ZXN0ZWRcIiksXHJcbiAgICAgICAgICAgIGV4cG9ydFNWR1JlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydFNWR1JlcXVlc3RlZFwiKSxcclxuICAgICAgICAgICAgdmlld0NoYW5nZWQ6IHRoaXMudG9waWM8cGFwZXIuUmVjdGFuZ2xlPihcImRlc2lnbmVyLnZpZXdDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBzbmFwc2hvdEV4cGlyZWQ6IHRoaXMudG9waWM8U2tldGNoPihcImRlc2lnbmVyLnNuYXBzaG90RXhwaXJlZFwiKSxcclxuICAgICAgICAgICAgdXNlck1lc3NhZ2VDaGFuZ2VkOiB0aGlzLnRvcGljPHN0cmluZz4oXCJkZXNpZ25lci51c2VyTWVzc2FnZUNoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIHNob3dIZWxwQ2hhbmdlZDogdGhpcy50b3BpYzxib29sZWFuPihcImRlc2lnbmVyLnNob3dIZWxwQ2hhbmdlZFwiKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNrZXRjaCA9IHtcclxuICAgICAgICAgICAgbG9hZGVkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2gubG9hZGVkXCIpLFxyXG4gICAgICAgICAgICBhdHRyQ2hhbmdlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmF0dHJDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBjb250ZW50Q2hhbmdlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmNvbnRlbnRDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBlZGl0aW5nSXRlbUNoYW5nZWQ6IHRoaXMudG9waWM8UG9zaXRpb25lZE9iamVjdFJlZj4oXCJza2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkOiB0aGlzLnRvcGljPFdvcmtzcGFjZU9iamVjdFJlZj4oXCJza2V0Y2guc2VsZWN0aW9uQ2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgc2F2ZUxvY2FsUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwic2tldGNoLnNhdmVsb2NhbC5zYXZlTG9jYWxSZXF1ZXN0ZWRcIiksXHJcbiAgICAgICAgICAgIGNsb25lZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmNsb25lZFwiKSxcclxuICAgICAgICAgICAgaW1hZ2VVcGxvYWRlZDogdGhpcy50b3BpYzxzdHJpbmc+KFwic2tldGNoLmltYWdlVXBsb2FkZWRcIiksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGV4dGJsb2NrID0ge1xyXG4gICAgICAgICAgICBhZGRlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFkZGVkXCIpLFxyXG4gICAgICAgICAgICBhdHRyQ2hhbmdlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmF0dHJDaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBmb250UmVhZHk6IHRoaXMudG9waWM8eyB0ZXh0QmxvY2tJZDogc3RyaW5nLCBmb250OiBvcGVudHlwZS5Gb250IH0+KFwidGV4dGJsb2NrLmZvbnRSZWFkeVwiKSxcclxuICAgICAgICAgICAgYXJyYW5nZUNoYW5nZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hcnJhbmdlQ2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgcmVtb3ZlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLnJlbW92ZWRcIiksXHJcbiAgICAgICAgICAgIGxvYWRlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmxvYWRlZFwiKSxcclxuICAgICAgICAgICAgZWRpdG9yQ2xvc2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suZWRpdG9yQ2xvc2VkXCIpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDaGFubmVscyB7XHJcbiAgICAgICAgYWN0aW9uczogQWN0aW9ucyA9IG5ldyBBY3Rpb25zKCk7XHJcbiAgICAgICAgZXZlbnRzOiBFdmVudHMgPSBuZXcgRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgdHlwZSBBY3Rpb25UeXBlcyA9XHJcbiAgICAgICAgXCJza2V0Y2guY3JlYXRlXCJcclxuICAgICAgICB8IFwic2tldGNoLnVwZGF0ZVwiXHJcbiAgICAgICAgfCBcInRleHRibG9jay5hZGRcIlxyXG4gICAgICAgIHwgXCJ0ZXh0YmxvY2sudXBkYXRlXCI7XHJcblxyXG4gICAgdHlwZSBFdmVudFR5cGVzID1cclxuICAgICAgICBcInNrZXRjaC5sb2FkZWRcIlxyXG4gICAgICAgIHwgXCJza2V0Y2guY2hhbmdlZFwiXHJcbiAgICAgICAgfCBcInRleHRibG9jay5hZGRlZFwiXHJcbiAgICAgICAgfCBcInRleHRibG9jay5jaGFuZ2VkXCI7XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBWQ29udHJvbCB7XHJcbiAgICAgICAgcmVuZGVyKCk6IFZOb2RlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIE9wZXJhdGlvbiBleHRlbmRzIFZDb250cm9sIHtcclxuICAgICAgICBvbkNsb3NlOiAoKSA9PiB2b2lkOyBcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEVkaXRvclN0YXRlIHtcclxuICAgICAgICBicm93c2VySWQ/OiBzdHJpbmc7XHJcbiAgICAgICAgZWRpdGluZ0l0ZW0/OiBQb3NpdGlvbmVkT2JqZWN0UmVmO1xyXG4gICAgICAgIHNlbGVjdGlvbj86IFdvcmtzcGFjZU9iamVjdFJlZjtcclxuICAgICAgICBsb2FkaW5nU2tldGNoPzogYm9vbGVhbjtcclxuICAgICAgICB1c2VyTWVzc2FnZT86IHN0cmluZztcclxuICAgICAgICBza2V0Y2g/OiBTa2V0Y2g7XHJcbiAgICAgICAgc2hvd0hlbHA/OiBib29sZWFuO1xyXG4gICAgICAgIHNrZXRjaElzRGlydHk/OiBib29sZWFuO1xyXG4gICAgICAgIG9wZXJhdGlvbj86IE9wZXJhdGlvbjtcclxuICAgICAgICB0cmFuc3BhcmVuY3k/OiBib29sZWFuO1xyXG4gICAgICAgIHVwbG9hZGVkSW1hZ2U/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBTdG9yZVJlc291cmNlcyB7XHJcbiAgICAgICAgZmFsbGJhY2tGb250Pzogb3BlbnR5cGUuRm9udFxyXG4gICAgICAgIGZvbnRDYXRhbG9nPzogRm9udFNoYXBlLkZvbnRDYXRhbG9nXHJcbiAgICAgICAgcGFyc2VkRm9udHM/OiBGb250U2hhcGUuUGFyc2VkRm9udHNcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFNrZXRjaCBleHRlbmRzIFNrZXRjaEF0dHIge1xyXG4gICAgICAgIF9pZDogc3RyaW5nO1xyXG4gICAgICAgIGJyb3dzZXJJZD86IHN0cmluZztcclxuICAgICAgICBzYXZlZEF0PzogRGF0ZTtcclxuICAgICAgICB0ZXh0QmxvY2tzPzogVGV4dEJsb2NrW107XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBTa2V0Y2hBdHRyIHtcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgICAgICAgZGVmYXVsdFRleHRCbG9ja0F0dHI/OiBUZXh0QmxvY2s7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBGb250RGVzY3JpcHRpb24ge1xyXG4gICAgICAgIGZhbWlseTogc3RyaW5nO1xyXG4gICAgICAgIGNhdGVnb3J5OiBzdHJpbmc7XHJcbiAgICAgICAgdmFyaWFudDogc3RyaW5nO1xyXG4gICAgICAgIHVybDogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgV29ya3NwYWNlT2JqZWN0UmVmIHtcclxuICAgICAgICBpdGVtSWQ6IHN0cmluZztcclxuICAgICAgICBpdGVtVHlwZT86IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uZWRPYmplY3RSZWYgZXh0ZW5kcyBXb3Jrc3BhY2VPYmplY3RSZWYge1xyXG4gICAgICAgIGNsaWVudFg/OiBudW1iZXI7XHJcbiAgICAgICAgY2xpZW50WT86IG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRleHRCbG9jayBleHRlbmRzIEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgICAgIF9pZD86IHN0cmluZztcclxuICAgICAgICB0ZXh0Pzogc3RyaW5nO1xyXG4gICAgICAgIHRleHRDb2xvcj86IHN0cmluZztcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udEZhbWlseT86IHN0cmluZztcclxuICAgICAgICBmb250VmFyaWFudD86IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgICAgIHBvc2l0aW9uPzogbnVtYmVyW10sXHJcbiAgICAgICAgb3V0bGluZT86IHtcclxuICAgICAgICAgICAgdG9wOiBQYXRoUmVjb3JkLFxyXG4gICAgICAgICAgICBib3R0b206IFBhdGhSZWNvcmRcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCYWNrZ3JvdW5kQWN0aW9uU3RhdHVzIHtcclxuICAgICAgICBhY3Rpb24/OiBPYmplY3Q7XHJcbiAgICAgICAgcmVqZWN0ZWQ/OiBib29sZWFuO1xyXG4gICAgICAgIGVycm9yPzogYm9vbGVhblxyXG4gICAgICAgIG1lc3NhZ2U/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYXRoUmVjb3JkIHtcclxuICAgICAgICBzZWdtZW50czogU2VnbWVudFJlY29yZFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1hZ2VFeHBvcnRPcHRpb25zIHtcclxuICAgICAgICBwaXhlbHM/OiBudW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaW5nbGUtcG9pbnQgc2VnbWVudHMgYXJlIHN0b3JlZCBhcyBudW1iZXJbMl1cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IHR5cGUgU2VnbWVudFJlY29yZCA9IEFycmF5PFBvaW50UmVjb3JkPiB8IEFycmF5PG51bWJlcj47XHJcblxyXG4gICAgZXhwb3J0IHR5cGUgUG9pbnRSZWNvcmQgPSBBcnJheTxudW1iZXI+O1xyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBVcGxvYWRJbWFnZSBpbXBsZW1lbnRzIE9wZXJhdGlvbiB7XHJcblxyXG4gICAgICAgIHN0b3JlOiBTdG9yZTtcclxuICAgICAgICBvbkNsb3NlOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVuZGVyKCk6IFZOb2RlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBoKFwiaDNcIiwgW1wiVXBsb2FkIGltYWdlXCJdKSxcclxuICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImZpbGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlID0gKDxIVE1MSW5wdXRFbGVtZW50PmV2LnRhcmdldCkuZmlsZXNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkKGZpbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB1cGxvYWQoZmlsZSkge1xyXG4gICAgICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkw7XHJcbiAgICAgICAgICAgIHZhciBzcmMgPSB1cmwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmltYWdlVXBsb2FkZWQoc3JjKTtcclxuICAgICAgICAgICAgdGhpcy5vbkNsb3NlICYmIHRoaXMub25DbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCIgICAgXHJcbm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Rm9udERlc2NyaXB0aW9uKGZhbWlseTogRm9udFNoYXBlLkZhbWlseVJlY29yZCwgdmFyaWFudD86IHN0cmluZylcclxuICAgICAgICA6IEZvbnREZXNjcmlwdGlvbiB7XHJcbiAgICAgICAgbGV0IHVybDogc3RyaW5nO1xyXG4gICAgICAgIHVybCA9IGZhbWlseS5maWxlc1t2YXJpYW50IHx8IFwicmVndWxhclwiXTtcclxuICAgICAgICBpZighdXJsKXtcclxuICAgICAgICAgICAgdXJsID0gZmFtaWx5LmZpbGVzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmYW1pbHk6IGZhbWlseS5mYW1pbHksXHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBmYW1pbHkuY2F0ZWdvcnksXHJcbiAgICAgICAgICAgIHZhcmlhbnQ6IHZhcmlhbnQsXHJcbiAgICAgICAgICAgIHVybFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFMzQWNjZXNzIHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVXBsb2FkIGZpbGUgdG8gYXBwbGljYXRpb24gUzMgYnVja2V0LlxyXG4gICAgICAgICAqIFJldHVybnMgdXBsb2FkIFVSTCBhcyBhIHByb21pc2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIHB1dEZpbGUoZmlsZU5hbWU6IHN0cmluZywgZmlsZVR5cGU6IHN0cmluZywgZGF0YTogQmxvYiB8IHN0cmluZylcclxuICAgICAgICAgICAgOiBKUXVlcnlQcm9taXNlPHN0cmluZz4ge1xyXG5cclxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3Mtc2RrLWpzL2lzc3Vlcy8xOTAgICBcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0ZpcmVmb3gvKSAmJiAhZmlsZVR5cGUubWF0Y2goLzsvKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoYXJzZXQgPSAnOyBjaGFyc2V0PVVURi04JztcclxuICAgICAgICAgICAgICAgIGZpbGVUeXBlICs9IGNoYXJzZXQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNpZ25VcmwgPSBgL2FwaS9zdG9yYWdlL2FjY2Vzcz9maWxlTmFtZT0ke2ZpbGVOYW1lfSZmaWxlVHlwZT0ke2ZpbGVUeXBlfWA7XHJcbiAgICAgICAgICAgIC8vIGdldCBzaWduZWQgVVJMXHJcbiAgICAgICAgICAgIHJldHVybiAkLmdldEpTT04oc2lnblVybClcclxuICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgc2lnblJlc3BvbnNlID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUFVUIGZpbGVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXRSZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBzaWduUmVzcG9uc2Uuc2lnbmVkUmVxdWVzdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ4LWFtei1hY2xcIjogXCJwdWJsaWMtcmVhZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZpbGVUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuYWpheChwdXRSZXF1ZXN0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHV0UmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cGxvYWRlZCBmaWxlXCIsIHNpZ25SZXNwb25zZS51cmwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNpZ25SZXNwb25zZS51cmw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3IgdXBsb2FkaW5nIHRvIFMzXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIG9uIC9hcGkvc3RvcmFnZS9hY2Nlc3NcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRG93bmxvYWQgZmlsZSBmcm9tIGJ1Y2tldFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBnZXRKc29uKGZpbGVOYW1lOiBzdHJpbmcpOiBKUXVlcnlQcm9taXNlPE9iamVjdD4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGaWxlVXJsKGZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG93bmxvYWRpbmdcIiwgcmVzcG9uc2UudXJsKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiByZXNwb25zZS51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBnZXRGaWxlVXJsKGZpbGVOYW1lOiBzdHJpbmcpOiBKUXVlcnlQcm9taXNlPHsgdXJsOiBzdHJpbmcgfT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogYC9hcGkvc3RvcmFnZS91cmw/ZmlsZU5hbWU9JHtmaWxlTmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIENvbG9yUGlja2VyIHtcclxuXHJcbiAgICAgICAgc3RhdGljIERFRkFVTFRfUEFMRVRURV9HUk9VUFMgPSBbXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzgwN1xyXG4gICAgICAgICAgICAgICAgXCIjZWU0MDM1XCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmMzc3MzZcIixcclxuICAgICAgICAgICAgICAgIFwiI2ZkZjQ5OFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjN2JjMDQzXCIsXHJcbiAgICAgICAgICAgICAgICBcIiMwMzkyY2ZcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvODk0XHJcbiAgICAgICAgICAgICAgICBcIiNlZGM5NTFcIixcclxuICAgICAgICAgICAgICAgIFwiI2ViNjg0MVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjY2MyYTM2XCIsXHJcbiAgICAgICAgICAgICAgICBcIiM0ZjM3MmRcIixcclxuICAgICAgICAgICAgICAgIFwiIzAwYTBiMFwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS8xNjRcclxuICAgICAgICAgICAgICAgIFwiIzFiODViOFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjNWE1MjU1XCIsXHJcbiAgICAgICAgICAgICAgICBcIiM1NTllODNcIixcclxuICAgICAgICAgICAgICAgIFwiI2FlNWE0MVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjYzNjYjcxXCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzM4OVxyXG4gICAgICAgICAgICAgICAgXCIjNGIzODMyXCIsXHJcbiAgICAgICAgICAgICAgICBcIiM4NTQ0NDJcIixcclxuICAgICAgICAgICAgICAgIFwiI2ZmZjRlNlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjM2MyZjJmXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNiZTliN2JcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvNDU1XHJcbiAgICAgICAgICAgICAgICBcIiNmZjRlNTBcIixcclxuICAgICAgICAgICAgICAgIFwiI2ZjOTEzYVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZjlkNjJlXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNlYWUzNzRcIixcclxuICAgICAgICAgICAgICAgIFwiI2UyZjRjN1wiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS83MDBcclxuICAgICAgICAgICAgICAgIFwiI2QxMTE0MVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjMDBiMTU5XCIsXHJcbiAgICAgICAgICAgICAgICBcIiMwMGFlZGJcIixcclxuICAgICAgICAgICAgICAgIFwiI2YzNzczNVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmZjNDI1XCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzgyNlxyXG4gICAgICAgICAgICAgICAgXCIjZThkMTc0XCIsXHJcbiAgICAgICAgICAgICAgICBcIiNlMzllNTRcIixcclxuICAgICAgICAgICAgICAgIFwiI2Q2NGQ0ZFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjNGQ3MzU4XCIsXHJcbiAgICAgICAgICAgICAgICBcIiM5ZWQ2NzBcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBzdGF0aWMgTU9OT19QQUxFVFRFID0gW1wiIzAwMFwiLCBcIiM0NDRcIiwgXCIjNjY2XCIsIFwiIzk5OVwiLCBcIiNjY2NcIiwgXCIjZWVlXCIsIFwiI2YzZjNmM1wiLCBcIiNmZmZcIl07XHJcblxyXG4gICAgICAgIHN0YXRpYyBzZXR1cChlbGVtLCBmZWF0dXJlZENvbG9yczogc3RyaW5nW10sIG9uQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZlYXR1cmVkR3JvdXBzID0gXy5jaHVuayhmZWF0dXJlZENvbG9ycywgNSk7XHJcblxyXG4gICAgICAgICAgICAvLyBmb3IgZWFjaCBwYWxldHRlIGdyb3VwXHJcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRQYWxldHRlR3JvdXBzID0gQ29sb3JQaWNrZXIuREVGQVVMVF9QQUxFVFRFX0dST1VQUy5tYXAoZ3JvdXAgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcnNlZEdyb3VwID0gZ3JvdXAubWFwKGMgPT4gbmV3IHBhcGVyLkNvbG9yKGMpKTtcclxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBsaWdodCB2YXJpYW50cyBvZiBkYXJrZXN0IHRocmVlXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhZGRDb2xvcnMgPSBfLnNvcnRCeShwYXJzZWRHcm91cCwgYyA9PiBjLmxpZ2h0bmVzcylcclxuICAgICAgICAgICAgICAgICAgICAuc2xpY2UoMCwgMylcclxuICAgICAgICAgICAgICAgICAgICAubWFwKGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjMiA9IGMuY2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYzIubGlnaHRuZXNzID0gMC44NTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMyO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcGFyc2VkR3JvdXAgPSBwYXJzZWRHcm91cC5jb25jYXQoYWRkQ29sb3JzKTtcclxuICAgICAgICAgICAgICAgIHBhcnNlZEdyb3VwID0gXy5zb3J0QnkocGFyc2VkR3JvdXAsIGMgPT4gYy5saWdodG5lc3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZEdyb3VwLm1hcChjID0+IGMudG9DU1ModHJ1ZSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhbGV0dGUgPSBmZWF0dXJlZEdyb3Vwcy5jb25jYXQoZGVmYXVsdFBhbGV0dGVHcm91cHMpO1xyXG4gICAgICAgICAgICBwYWxldHRlLnB1c2goQ29sb3JQaWNrZXIuTU9OT19QQUxFVFRFKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzZWwgPSA8YW55PiQoZWxlbSk7XHJcbiAgICAgICAgICAgICg8YW55PiQoZWxlbSkpLnNwZWN0cnVtKHtcclxuICAgICAgICAgICAgICAgIHNob3dJbnB1dDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGFsbG93RW1wdHk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwcmVmZXJyZWRGb3JtYXQ6IFwiaGV4XCIsXHJcbiAgICAgICAgICAgICAgICBzaG93QnV0dG9uczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzaG93QWxwaGE6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzaG93UGFsZXR0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNob3dTZWxlY3Rpb25QYWxldHRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBhbGV0dGU6IHBhbGV0dGUsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VLZXk6IFwic2tldGNodGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgY2hhbmdlOiBvbkNoYW5nZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzdGF0aWMgc2V0KGVsZW06IEhUTUxFbGVtZW50LCB2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICg8YW55PiQoZWxlbSkpLnNwZWN0cnVtKFwic2V0XCIsIHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBkZXN0cm95KGVsZW0pIHtcclxuICAgICAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oXCJkZXN0cm95XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRWRpdG9yQmFyIGV4dGVuZHMgQ29tcG9uZW50PEVkaXRvclN0YXRlPiB7XHJcblxyXG4gICAgICAgIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBza2V0Y2hEb20kID0gc3RvcmUuZXZlbnRzLm1lcmdlKFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5sb2FkZWQsXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkLFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci51c2VyTWVzc2FnZUNoYW5nZWQpXHJcbiAgICAgICAgICAgICAgICAubWFwKG0gPT4gdGhpcy5yZW5kZXIoc3RvcmUuc3RhdGUpKTtcclxuICAgICAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKHNrZXRjaERvbSQsIGNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVuZGVyKHN0YXRlOiBFZGl0b3JTdGF0ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBza2V0Y2ggPSBzdGF0ZS5za2V0Y2g7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXZcIiwgW1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBoKFwiYVwiLCBcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGhyZWY6IFwiL1wiXHJcbiAgICAgICAgICAgICAgICAgIH0gIFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBoKFwiaW1nLmxvZ29cIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM6IFwiaW1nL3NwaXJhbC1sb2dvLndoaXRlLjUwLnBuZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGgoXCJsYWJlbFwiLCBcIkFkZCB0ZXh0OiBcIiksXHJcbiAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYWRkLXRleHRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXByZXNzOiAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gZXYudGFyZ2V0ICYmIGV2LnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay5hZGQuZGlzcGF0Y2goeyB0ZXh0OiB0ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldi50YXJnZXQudmFsdWUgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwiUHJlc3MgW0VudGVyXSB0byBhZGRcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJCYWNrZ3JvdW5kOiBcIiksXHJcbiAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHNrZXRjaC5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZub2RlLmVsbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2tldGNoSGVscGVycy5jb2xvcnNJblVzZSh0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZS5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGJhY2tncm91bmRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKSB8fCBcIndoaXRlXCIgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlOiAob2xkVm5vZGUsIHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0KHZub2RlLmVsbSwgc2tldGNoLmJhY2tncm91bmRDb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG5cclxuICAgICAgICAgICAgICAgIEJvb3RTY3JpcHQuZHJvcGRvd24oe1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBcInNrZXRjaE1lbnVcIixcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkFjdGlvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIk5ld1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkNyZWF0ZSBuZXcgc2tldGNoXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmNyZWF0ZS5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkNsZWFyIGFsbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkNsZWFyIHNrZXRjaCBjb250ZW50c1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5jbGVhci5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlpvb20gdG8gZml0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRml0IGNvbnRlbnRzIGluIHZpZXdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3Iuem9vbVRvRml0LmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkV4cG9ydCBzbWFsbCBpbWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkV4cG9ydCBza2V0Y2ggYXMgUE5HXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci5leHBvcnRQTkcuZGlzcGF0Y2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGl4ZWxzOiAxMDAgKiAxMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJFeHBvcnQgbWVkaXVtIGltYWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRXhwb3J0IHNrZXRjaCBhcyBQTkdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLmV4cG9ydFBORy5kaXNwYXRjaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXhlbHM6IDUwMCAqIDEwMDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkV4cG9ydCBTVkdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFeHBvcnQgc2tldGNoIGFzIHZlY3RvciBncmFwaGljc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci5leHBvcnRTVkcuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRHVwbGljYXRlIHNrZXRjaCAobmV3IFVSTClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDb3B5IGNvbnRlbnRzIGludG8gYSBza2V0Y2ggd2l0aCBhIG5ldyBhZGRyZXNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmNsb25lLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkxvYWQgc2FtcGxlIHNrZXRjaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIk9wZW4gYSBzYW1wbGUgc2tldGNoIHRvIHBsYXkgd2l0aFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci5vcGVuU2FtcGxlLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlVwbG9hZCB0ZW1wb3JhcnkgdHJhY2luZyBpbWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlVwbG9hZCBpbWFnZSBpbnRvIHdvcmtzcGFjZSBmb3IgdHJhY2luZy4gVGhlIGltYWdlIHdpbGwgbm90IHNob3cgaW4gZmluYWwgb3V0cHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLnNob3dPcGVyYXRpb24obmV3IFVwbG9hZEltYWdlKHRoaXMuc3RvcmUpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJSZW1vdmUgdHJhY2luZyBpbWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlJlbW92ZSBiYWNrZ3JvdW5kIHRyYWNpbmcgaW1hZ2VcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUucmVtb3ZlVXBsb2FkZWRJbWFnZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlRvZ2dsZSB0cmFuc3BhcmVuY3lcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJTZWUgdGhyb3VnaCB0ZXh0IHRvIGVsZW1lbnRzIGJlaGluZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5zZXRUcmFuc3BhcmVuY3koIXRoaXMuc3RvcmUuc3RhdGUudHJhbnNwYXJlbmN5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImRpdiNyaWdodFNpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICB7fSxcclxuICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYjdXNlci1tZXNzYWdlXCIsIHt9LCBbc3RhdGUudXNlck1lc3NhZ2UgfHwgXCJcIl0pLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcImRpdiNzaG93LWhlbHAuZ2x5cGhpY29uLmdseXBoaWNvbi1xdWVzdGlvbi1zaWduXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3IudG9nZ2xlSGVscC5kaXNwYXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgXSlcclxuXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW50ZXJmYWNlIEpRdWVyeSB7XHJcbiAgICBzZWxlY3RwaWNrZXIoLi4uYXJnczogYW55W10pO1xyXG4gICAgLy9yZXBsYWNlT3B0aW9ucyhvcHRpb25zOiBBcnJheTx7dmFsdWU6IHN0cmluZywgdGV4dD86IHN0cmluZ30+KTtcclxufVxyXG5cclxubmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEZvbnRQaWNrZXIge1xyXG5cclxuICAgICAgICBkZWZhdWx0Rm9udEZhbWlseSA9IFwiUm9ib3RvXCI7XHJcbiAgICAgICAgcHJldmlld0ZvbnRTaXplID0gXCIyOHB4XCI7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUsIGJsb2NrOiBUZXh0QmxvY2spIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4gICAgICAgICAgICBjb25zdCBkb20kID0gUnguT2JzZXJ2YWJsZS5qdXN0KGJsb2NrKVxyXG4gICAgICAgICAgICAgICAgLm1lcmdlKFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5hdHRyQ2hhbmdlZC5vYnNlcnZlKClcclxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKG0gPT4gbS5kYXRhLl9pZCA9PT0gYmxvY2suX2lkKVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAobSA9PiBtLmRhdGEpXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAubWFwKHRiID0+IHRoaXMucmVuZGVyKHRiKSk7XHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVuZGVyKGJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIGxldCB1cGRhdGUgPSBwYXRjaCA9PiB7XHJcbiAgICAgICAgICAgICAgICBwYXRjaC5faWQgPSBibG9jay5faWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUF0dHIuZGlzcGF0Y2gocGF0Y2gpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBlbGVtZW50czogVk5vZGVbXSA9IFtdO1xyXG4gICAgICAgICAgICBlbGVtZW50cy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgaChcInNlbGVjdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcInNlbGVjdFBpY2tlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmYW1pbHktcGlja2VyXCI6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiB2bm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6IHZub2RlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKFwiZGVzdHJveVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZXYgPT4gdXBkYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBldi50YXJnZXQudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFZhcmlhbnQ6IEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5kZWZhdWx0VmFyaWFudChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5yZXNvdXJjZXMuZm9udENhdGFsb2cuZ2V0UmVjb3JkKGV2LnRhcmdldC52YWx1ZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnJlc291cmNlcy5mb250Q2F0YWxvZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0TGlzdCh0aGlzLnN0b3JlLmZvbnRMaXN0TGltaXQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKHJlY29yZDogRm9udFNoYXBlLkZhbWlseVJlY29yZCkgPT4gaChcIm9wdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkOiByZWNvcmQuZmFtaWx5ID09PSBibG9jay5mb250RmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGVudFwiOiBgPHNwYW4gc3R5bGU9XCIke0ZvbnRIZWxwZXJzLmdldFN0eWxlU3RyaW5nKHJlY29yZC5mYW1pbHksIG51bGwsIHRoaXMucHJldmlld0ZvbnRTaXplKX1cIj4ke3JlY29yZC5mYW1pbHl9PC9zcGFuPmBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtyZWNvcmQuZmFtaWx5XSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZEZhbWlseSA9IHRoaXMuc3RvcmUucmVzb3VyY2VzLmZvbnRDYXRhbG9nLmdldFJlY29yZChibG9jay5mb250RmFtaWx5KTtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRmFtaWx5ICYmIHNlbGVjdGVkRmFtaWx5LnZhcmlhbnRzXHJcbiAgICAgICAgICAgICAgICAmJiBzZWxlY3RlZEZhbWlseS52YXJpYW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKGgoXCJzZWxlY3RcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJ2YXJpYW50UGlja2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZhcmlhbnQtcGlja2VyXCI6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiB2bm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6IHZub2RlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKFwiZGVzdHJveVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RwYXRjaDogKG9sZFZub2RlLCB2bm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBROiB3aHkgY2FuJ3Qgd2UganVzdCBkbyBzZWxlY3RwaWNrZXIocmVmcmVzaCkgaGVyZT9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQTogc2VsZWN0cGlja2VyIGhhcyBtZW50YWwgcHJvYmxlbXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHVwZGF0ZSh7IGZvbnRWYXJpYW50OiBldi50YXJnZXQudmFsdWUgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGYW1pbHkudmFyaWFudHMubWFwKHYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaChcIm9wdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkOiB2ID09PSBibG9jay5mb250VmFyaWFudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS1jb250YWluZXJcIjogXCJib2R5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS1jb250ZW50XCI6IGA8c3BhbiBzdHlsZT1cIiR7Rm9udEhlbHBlcnMuZ2V0U3R5bGVTdHJpbmcoc2VsZWN0ZWRGYW1pbHkuZmFtaWx5LCB2LCB0aGlzLnByZXZpZXdGb250U2l6ZSl9XCI+JHt2fTwvc3Bhbj5gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt2XSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzczogeyBcImZvbnQtcGlja2VyXCI6IHRydWUgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRzXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgSGVscERpYWxvZyB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG4gICAgICAgICAgICBjb25zdCBvdXRlciA9ICQoY29udGFpbmVyKTtcclxuICAgICAgICAgICAgb3V0ZXIuYXBwZW5kKFwiPGgzPkdldHRpbmcgc3RhcnRlZDwvaDM+XCIpO1xyXG4gICAgICAgICAgICBzdG9yZS5zdGF0ZS5zaG93SGVscCA/IG91dGVyLnNob3coKSA6IG91dGVyLmhpZGUoKTtcclxuICAgICAgICAgICAgJC5nZXQoXCJjb250ZW50L2hlbHAuaHRtbFwiLCBkID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNsb3NlID0gJChcIjxidXR0b24gY2xhc3M9J2J0biBidG4tZGVmYXVsdCc+IENsb3NlIDwvYnV0dG9uPlwiKTtcclxuICAgICAgICAgICAgICAgIGNsb3NlLm9uKFwiY2xpY2tcIiwgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3IudG9nZ2xlSGVscC5kaXNwYXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBvdXRlci5hcHBlbmQoJChkKSlcclxuICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChjbG9zZSlcclxuICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcIjxhIGNsYXNzPSdyaWdodCcgaHJlZj0nbWFpbHRvOmZpZGRsZXN0aWNrc0Bjb2RlZmxpZ2h0LmlvJz5FbWFpbCB1czwvYT5cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLnNob3dIZWxwQ2hhbmdlZC5zdWIoc2hvdyA9PiB7XHJcbiAgICAgICAgICAgICAgICBzaG93ID8gb3V0ZXIuc2hvdygpIDogb3V0ZXIuaGlkZSgpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcbiAgICBcclxuICAgIGV4cG9ydCBjbGFzcyBPcGVyYXRpb25QYW5lbCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKXtcclxuIFxyXG4gICAgICAgICAgICBjb25zdCBkb20kID0gc3RvcmUub3BlcmF0aW9uJC5tYXAob3AgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoIW9wKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaChcImRpdi5oaWRkZW5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaChcImRpdi5vcGVyYXRpb25cIiwgW29wLnJlbmRlcigpXSk7XHJcbiAgICAgICAgICAgIH0pICAgICAgICAgICBcclxuICAgICAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKGRvbSQsIGNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFNlbGVjdGVkSXRlbUVkaXRvciB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZG9tJCA9IHN0b3JlLmV2ZW50cy5za2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkLm9ic2VydmUoKVxyXG4gICAgICAgICAgICAgICAgLm1hcChpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zSXRlbSA9IDxQb3NpdGlvbmVkT2JqZWN0UmVmPmkuZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBwb3NJdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHBvc0l0ZW0uaXRlbVR5cGUgPT09ICdUZXh0QmxvY2snXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIF8uZmluZChzdG9yZS5zdGF0ZS5za2V0Y2gudGV4dEJsb2NrcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgPT4gYi5faWQgPT09IHBvc0l0ZW0uaXRlbUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaCgnZGl2I2VkaXRvck92ZXJsYXknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwibm9uZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaCgnZGl2I2VkaXRvck92ZXJsYXknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxlZnQ6IHBvc0l0ZW0uY2xpZW50WCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0b3A6IHBvc0l0ZW0uY2xpZW50WSArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVGV4dEJsb2NrRWRpdG9yKHN0b3JlKS5yZW5kZXIoYmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKGRvbSQsIGNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dEJsb2NrRWRpdG9yIGV4dGVuZHMgQ29tcG9uZW50PFRleHRCbG9jaz4ge1xyXG4gICAgICAgIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbmRlcih0ZXh0QmxvY2s6IFRleHRCbG9jayk6IFZOb2RlIHtcclxuICAgICAgICAgICAgbGV0IHVwZGF0ZSA9IHRiID0+IHtcclxuICAgICAgICAgICAgICAgIHRiLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUF0dHIuZGlzcGF0Y2godGIpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXYudGV4dC1ibG9jay1lZGl0b3JcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXk6IHRleHRCbG9jay5faWRcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgaChcInRleHRhcmVhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLnRleHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleXByZXNzOiAoZXY6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChldi53aGljaCB8fCBldi5rZXlDb2RlKSA9PT0gRG9tSGVscGVycy5LZXlDb2Rlcy5FbnRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSh7IHRleHQ6ICg8SFRNTFRleHRBcmVhRWxlbWVudD5ldi50YXJnZXQpLnZhbHVlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHVwZGF0ZSh7IHRleHQ6IGV2LnRhcmdldC52YWx1ZSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaChcImRpdlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7fSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImRpdi5mb250LWNvbG9yLWljb24uZm9yZVwiLCB7fSwgXCJBXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImlucHV0LnRleHQtY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiVGV4dCBjb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0Q29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZub2RlLmVsbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2tldGNoSGVscGVycy5jb2xvcnNJblVzZSh0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHVwZGF0ZSh7IHRleHRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1jb2xvci1pY29uLmJhY2tcIiwge30sIFwiQVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC5iYWNrZ3JvdW5kLWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkJhY2tncm91bmQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB1cGRhdGUoeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBoKFwiYnV0dG9uLmRlbGV0ZS10ZXh0YmxvY2suYnRuLmJ0bi1kYW5nZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRGVsZXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBlID0+IHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sucmVtb3ZlLmRpc3BhdGNoKHRleHRCbG9jaylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcInNwYW4uZ2x5cGhpY29uLmdseXBoaWNvbi10cmFzaFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaChcImRpdi5mb250LXBpY2tlci1jb250YWluZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgRm9udFBpY2tlcih2bm9kZS5lbG0sIHRoaXMuc3RvcmUsIHRleHRCbG9jaylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaW5zZXJ0OiAodm5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgY29uc3QgcHJvcHM6IEZvbnRQaWNrZXJQcm9wcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHN0b3JlOiB0aGlzLnN0b3JlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgc2VsZWN0aW9uOiB0ZXh0QmxvY2suZm9udERlc2MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkOiAoZm9udERlc2MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB1cGRhdGUoeyBmb250RGVzYyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgUmVhY3RET00ucmVuZGVyKHJoKEZvbnRQaWNrZXIsIHByb3BzKSwgdm5vZGUuZWxtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICApLFxyXG5cclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIER1YWxCb3VuZHNQYXRoV2FycCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuXHJcbiAgICAgICAgc3RhdGljIFBPSU5UU19QRVJfUEFUSCA9IDIwMDtcclxuICAgICAgICBzdGF0aWMgVVBEQVRFX0RFQk9VTkNFID0gMTUwO1xyXG5cclxuICAgICAgICBwcml2YXRlIF9zb3VyY2U6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgICAgICBwcml2YXRlIF91cHBlcjogU3RyZXRjaFBhdGg7XHJcbiAgICAgICAgcHJpdmF0ZSBfbG93ZXI6IFN0cmV0Y2hQYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX3dhcnBlZDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX291dGxpbmU6IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgcHJpdmF0ZSBfY3VzdG9tU3R5bGU6IFNrZXRjaEl0ZW1TdHlsZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgIHNvdXJjZTogcGFwZXIuQ29tcG91bmRQYXRoLFxyXG4gICAgICAgICAgICBib3VuZHM/OiB7IHVwcGVyOiBwYXBlci5TZWdtZW50W10sIGxvd2VyOiBwYXBlci5TZWdtZW50W10gfSxcclxuICAgICAgICAgICAgY3VzdG9tU3R5bGU/OiBTa2V0Y2hJdGVtU3R5bGUpIHtcclxuXHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLSBidWlsZCBjaGlsZHJlbiAtLVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xyXG4gICAgICAgICAgICB0aGlzLl9zb3VyY2UucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYm91bmRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cHBlciA9IG5ldyBTdHJldGNoUGF0aChib3VuZHMudXBwZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG93ZXIgPSBuZXcgU3RyZXRjaFBhdGgoYm91bmRzLmxvd2VyKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyID0gbmV3IFN0cmV0Y2hQYXRoKFtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLnRvcExlZnQpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMudG9wUmlnaHQpXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvd2VyID0gbmV3IFN0cmV0Y2hQYXRoKFtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLmJvdHRvbUxlZnQpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMuYm90dG9tUmlnaHQpXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jb250cm9sQm91bmRzT3BhY2l0eSA9IDAuNzU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl91cHBlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgdGhpcy5fbG93ZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lID0gbmV3IHBhcGVyLlBhdGgoeyBjbG9zZWQ6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlT3V0bGluZVNoYXBlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHNvdXJjZS5wYXRoRGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlV2FycGVkKCk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLSBhZGQgY2hpbGRyZW4gLS1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGRyZW4oW3RoaXMuX291dGxpbmUsIHRoaXMuX3dhcnBlZCwgdGhpcy5fdXBwZXIsIHRoaXMuX2xvd2VyXSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLSBhc3NpZ24gc3R5bGUgLS1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tU3R5bGUgPSBjdXN0b21TdHlsZSB8fCB7XHJcbiAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogXCJncmF5XCJcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIC0tIHNldCB1cCBvYnNlcnZlcnMgLS1cclxuXHJcbiAgICAgICAgICAgIFJ4Lk9ic2VydmFibGUubWVyZ2UoXHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cHBlci5wYXRoQ2hhbmdlZC5vYnNlcnZlKCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb3dlci5wYXRoQ2hhbmdlZC5vYnNlcnZlKCkpXHJcbiAgICAgICAgICAgICAgICAuZGVib3VuY2UoRHVhbEJvdW5kc1BhdGhXYXJwLlVQREFURV9ERUJPVU5DRSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUocGF0aCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lU2hhcGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZWQoUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5HRU9NRVRSWSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlKGZsYWdzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChmbGFncyAmIFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuQVRUUklCVVRFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3VwcGVyLnZpc2libGUgIT09IHRoaXMuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvd2VyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdXBwZXIoKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91cHBlci5wYXRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGxvd2VyKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG93ZXIucGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldCBzb3VyY2UodmFsdWU6IHBhcGVyLkNvbXBvdW5kUGF0aCkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NvdXJjZSAmJiB0aGlzLl9zb3VyY2UucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2UgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlV2FycGVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBjdXN0b21TdHlsZSgpOiBTa2V0Y2hJdGVtU3R5bGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3VzdG9tU3R5bGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgY3VzdG9tU3R5bGUodmFsdWU6IFNrZXRjaEl0ZW1TdHlsZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXN0b21TdHlsZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQuc3R5bGUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlLmJhY2tncm91bmRDb2xvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5maWxsQ29sb3IgPSB2YWx1ZS5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRsaW5lLm9wYWNpdHkgPSAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5maWxsQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRsaW5lLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgY29udHJvbEJvdW5kc09wYWNpdHkodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLl91cHBlci5vcGFjaXR5ID0gdGhpcy5fbG93ZXIub3BhY2l0eSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3V0bGluZUNvbnRhaW5zKHBvaW50OiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3V0bGluZS5jb250YWlucyhwb2ludCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZVdhcnBlZCgpIHtcclxuICAgICAgICAgICAgbGV0IG9ydGhPcmlnaW4gPSB0aGlzLl9zb3VyY2UuYm91bmRzLnRvcExlZnQ7XHJcbiAgICAgICAgICAgIGxldCBvcnRoV2lkdGggPSB0aGlzLl9zb3VyY2UuYm91bmRzLndpZHRoO1xyXG4gICAgICAgICAgICBsZXQgb3J0aEhlaWdodCA9IHRoaXMuX3NvdXJjZS5ib3VuZHMuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgbGV0IHByb2plY3Rpb24gPSBQYXBlckhlbHBlcnMuZHVhbEJvdW5kc1BhdGhQcm9qZWN0aW9uKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aCwgdGhpcy5fbG93ZXIucGF0aCk7XHJcbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm0gPSBuZXcgRm9udFNoYXBlLlBhdGhUcmFuc2Zvcm0ocG9pbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwb2ludCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwb2ludDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KG9ydGhPcmlnaW4pO1xyXG4gICAgICAgICAgICAgICAgbGV0IHVuaXQgPSBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUueCAvIG9ydGhXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gb3J0aEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvamVjdGVkID0gcHJvamVjdGlvbih1bml0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qZWN0ZWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV3UGF0aHMgPSB0aGlzLl9zb3VyY2UuY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgIC5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IDxwYXBlci5QYXRoPml0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFBvaW50cyA9IFBhcGVySGVscGVycy50cmFjZVBhdGhBc1BvaW50cyhwYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBEdWFsQm91bmRzUGF0aFdhcnAuUE9JTlRTX1BFUl9QQVRIKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKHAgPT4gdHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50KHApKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4UGF0aCA9IG5ldyBwYXBlci5QYXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IHhQb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4UGF0aDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQuYWRkQ2hpbGRyZW4obmV3UGF0aHMpO1xyXG4gICAgICAgICAgICBmb3IoY29uc3QgYyBvZiB0aGlzLl93YXJwZWQuY2hpbGRyZW4pe1xyXG4gICAgICAgICAgICAgICAgKDxwYXBlci5QYXRoPmMpLnNpbXBsaWZ5KDAuMDAyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVPdXRsaW5lU2hhcGUoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvd2VyID0gbmV3IHBhcGVyLlBhdGgodGhpcy5fbG93ZXIucGF0aC5zZWdtZW50cyk7XHJcbiAgICAgICAgICAgIGxvd2VyLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5zZWdtZW50cyA9IHRoaXMuX3VwcGVyLnBhdGguc2VnbWVudHMuY29uY2F0KGxvd2VyLnNlZ21lbnRzKTtcclxuICAgICAgICAgICAgbG93ZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUGF0aEhhbmRsZSBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuXHJcbiAgICAgICAgc3RhdGljIFNFR01FTlRfTUFSS0VSX1JBRElVUyA9IDEwO1xyXG4gICAgICAgIHN0YXRpYyBDVVJWRV9NQVJLRVJfUkFESVVTID0gNjtcclxuICAgICAgICBzdGF0aWMgRFJBR19USFJFU0hPTEQgPSAzO1xyXG5cclxuICAgICAgICBwcml2YXRlIF9tYXJrZXI6IHBhcGVyLlNoYXBlO1xyXG4gICAgICAgIHByaXZhdGUgX3NlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBfY3VydmU6IHBhcGVyLkN1cnZlO1xyXG4gICAgICAgIHByaXZhdGUgX3Ntb290aGVkOiBib29sZWFuO1xyXG4gICAgICAgIHByaXZhdGUgX2N1cnZlU3BsaXQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PG51bWJlcj4oKTtcclxuICAgICAgICBwcml2YXRlIF9jdXJ2ZUNoYW5nZVVuc3ViOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIHByaXZhdGUgZHJhZ2dpbmc7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGF0dGFjaDogcGFwZXIuU2VnbWVudCB8IHBhcGVyLkN1cnZlKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcG9zaXRpb246IHBhcGVyLlBvaW50O1xyXG4gICAgICAgICAgICBsZXQgcGF0aDogcGFwZXIuUGF0aDtcclxuICAgICAgICAgICAgaWYgKGF0dGFjaCBpbnN0YW5jZW9mIHBhcGVyLlNlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQgPSA8cGFwZXIuU2VnbWVudD5hdHRhY2g7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuX3NlZ21lbnQucG9pbnQ7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gdGhpcy5fc2VnbWVudC5wYXRoO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGF0dGFjaCBpbnN0YW5jZW9mIHBhcGVyLkN1cnZlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZSA9IDxwYXBlci5DdXJ2ZT5hdHRhY2g7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuX2N1cnZlLmdldFBvaW50QXQodGhpcy5fY3VydmUubGVuZ3RoICogMC41KTtcclxuICAgICAgICAgICAgICAgIHBhdGggPSB0aGlzLl9jdXJ2ZS5wYXRoO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJhdHRhY2ggbXVzdCBiZSBTZWdtZW50IG9yIEN1cnZlXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlciA9IHBhcGVyLlNoYXBlLkNpcmNsZShwb3NpdGlvbiwgUGF0aEhhbmRsZS5TRUdNRU5UX01BUktFUl9SQURJVVMpO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIuc3Ryb2tlQ29sb3IgPSBcImJsdWVcIjtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLmZpbGxDb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLnNlbGVjdGVkQ29sb3IgPSBuZXcgcGFwZXIuQ29sb3IoMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fbWFya2VyKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZWdtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlQXNTZWdtZW50KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlQXNDdXJ2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwYXBlckV4dC5leHRlbmRNb3VzZUV2ZW50cyh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub24ocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ1N0YXJ0LCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VydmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzcGxpdCB0aGUgY3VydmUsIHB1cGF0ZSB0byBzZWdtZW50IGhhbmRsZVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZUNoYW5nZVVuc3ViKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudCA9IG5ldyBwYXBlci5TZWdtZW50KHRoaXMuY2VudGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJ2ZUlkeCA9IHRoaXMuX2N1cnZlLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlLnBhdGguaW5zZXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJ2ZUlkeCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnRcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlQXNTZWdtZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJ2ZVNwbGl0Lm5vdGlmeShjdXJ2ZUlkeCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQucG9pbnQgPSB0aGlzLmNlbnRlcjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc21vb3RoZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5zbW9vdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zbGF0ZShldi5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICBldi5zdG9wKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZWdtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zbW9vdGhlZCA9ICF0aGlzLnNtb290aGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZXYuc3RvcCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnZlQ2hhbmdlVW5zdWIgPSBwYXRoLnN1YnNjcmliZShmbGFncyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VydmUgJiYgIXRoaXMuX3NlZ21lbnRcclxuICAgICAgICAgICAgICAgICAgICAmJiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLlNFR01FTlRTKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VudGVyID0gdGhpcy5fY3VydmUuZ2V0UG9pbnRBdCh0aGlzLl9jdXJ2ZS5sZW5ndGggKiAwLjUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgc21vb3RoZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zbW9vdGhlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldCBzbW9vdGhlZCh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB0aGlzLl9zbW9vdGhlZCA9IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5oYW5kbGVJbiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LmhhbmRsZU91dCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBjdXJ2ZVNwbGl0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3VydmVTcGxpdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBjZW50ZXIoKTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldCBjZW50ZXIocG9pbnQ6IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBwb2ludDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3R5bGVBc1NlZ21lbnQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5vcGFjaXR5ID0gMC44O1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIuZGFzaEFycmF5ID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLnJhZGl1cyA9IFBhdGhIYW5kbGUuU0VHTUVOVF9NQVJLRVJfUkFESVVTO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdHlsZUFzQ3VydmUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5vcGFjaXR5ID0gMC44O1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIuZGFzaEFycmF5ID0gWzIsIDJdO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIucmFkaXVzID0gUGF0aEhhbmRsZS5DVVJWRV9NQVJLRVJfUkFESVVTO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN0cmV0Y2hQYXRoIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9wYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX3BhdGhDaGFuZ2VkID0gbmV3IE9ic2VydmFibGVFdmVudDxwYXBlci5QYXRoPigpO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihzZWdtZW50czogcGFwZXIuU2VnbWVudFtdLCBzdHlsZT86IHBhcGVyLlN0eWxlKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9wYXRoID0gbmV3IHBhcGVyLlBhdGgoc2VnbWVudHMpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3BhdGgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0eWxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXRoLnN0eWxlID0gc3R5bGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXRoLnN0cm9rZUNvbG9yID0gXCJsaWdodGdyYXlcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGguc3Ryb2tlV2lkdGggPSA2O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHMgb2YgdGhpcy5fcGF0aC5zZWdtZW50cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRTZWdtZW50SGFuZGxlKHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgdGhpcy5fcGF0aC5jdXJ2ZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ3VydmVIYW5kbGUoYyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBwYXRoKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBwYXRoQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGhDaGFuZ2VkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBhZGRTZWdtZW50SGFuZGxlKHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRIYW5kbGUobmV3IFBhdGhIYW5kbGUoc2VnbWVudCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBhZGRDdXJ2ZUhhbmRsZShjdXJ2ZTogcGFwZXIuQ3VydmUpIHtcclxuICAgICAgICAgICAgbGV0IGhhbmRsZSA9IG5ldyBQYXRoSGFuZGxlKGN1cnZlKTtcclxuICAgICAgICAgICAgaGFuZGxlLmN1cnZlU3BsaXQuc3Vic2NyaWJlT25lKGN1cnZlSWR4ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ3VydmVIYW5kbGUodGhpcy5fcGF0aC5jdXJ2ZXNbY3VydmVJZHhdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ3VydmVIYW5kbGUodGhpcy5fcGF0aC5jdXJ2ZXNbY3VydmVJZHggKyAxXSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmFkZEhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBhZGRIYW5kbGUoaGFuZGxlOiBQYXRoSGFuZGxlKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZS52aXNpYmxlID0gdGhpcy52aXNpYmxlO1xyXG4gICAgICAgICAgICBoYW5kbGUub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlRHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aENoYW5nZWQubm90aWZ5KHRoaXMuX3BhdGgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaGFuZGxlLm9uKHBhcGVyLkV2ZW50VHlwZS5jbGljaywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aENoYW5nZWQubm90aWZ5KHRoaXMuX3BhdGgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKGhhbmRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWVhc3VyZXMgb2Zmc2V0cyBvZiB0ZXh0IGdseXBocy5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRSdWxlciB7XHJcblxyXG4gICAgICAgIGZvbnRGYW1pbHk6IHN0cmluZztcclxuICAgICAgICBmb250V2VpZ2h0OiBudW1iZXI7XHJcbiAgICAgICAgZm9udFNpemU6IG51bWJlcjtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVQb2ludFRleHQodGV4dCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgICAgICB2YXIgcG9pbnRUZXh0ID0gbmV3IHBhcGVyLlBvaW50VGV4dCgpO1xyXG4gICAgICAgICAgICBwb2ludFRleHQuY29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5qdXN0aWZpY2F0aW9uID0gXCJjZW50ZXJcIjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZm9udEZhbWlseSkge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRGYW1pbHkgPSB0aGlzLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZm9udFdlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRXZWlnaHQgPSB0aGlzLmZvbnRXZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZm9udFNpemUpIHtcclxuICAgICAgICAgICAgICAgIHBvaW50VGV4dC5mb250U2l6ZSA9IHRoaXMuZm9udFNpemU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwb2ludFRleHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRUZXh0T2Zmc2V0cyh0ZXh0KSB7XHJcbiAgICAgICAgICAgIC8vIE1lYXN1cmUgZ2x5cGhzIGluIHBhaXJzIHRvIGNhcHR1cmUgd2hpdGUgc3BhY2UuXHJcbiAgICAgICAgICAgIC8vIFBhaXJzIGFyZSBjaGFyYWN0ZXJzIGkgYW5kIGkrMS5cclxuICAgICAgICAgICAgdmFyIGdseXBoUGFpcnMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBnbHlwaFBhaXJzW2ldID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSwgaSArIDEpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gRm9yIGVhY2ggY2hhcmFjdGVyLCBmaW5kIGNlbnRlciBvZmZzZXQuXHJcbiAgICAgICAgICAgIHZhciB4T2Zmc2V0cyA9IFswXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTWVhc3VyZSB0aHJlZSBjaGFyYWN0ZXJzIGF0IGEgdGltZSB0byBnZXQgdGhlIGFwcHJvcHJpYXRlIFxyXG4gICAgICAgICAgICAgICAgLy8gICBzcGFjZSBiZWZvcmUgYW5kIGFmdGVyIHRoZSBnbHlwaC5cclxuICAgICAgICAgICAgICAgIHZhciB0cmlhZFRleHQgPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpIC0gMSwgaSArIDEpKTtcclxuICAgICAgICAgICAgICAgIHRyaWFkVGV4dC5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBvdXQgaGFsZiBvZiBwcmlvciBnbHlwaCBwYWlyIFxyXG4gICAgICAgICAgICAgICAgLy8gICBhbmQgaGFsZiBvZiBjdXJyZW50IGdseXBoIHBhaXIuXHJcbiAgICAgICAgICAgICAgICAvLyBNdXN0IGJlIHJpZ2h0LCBiZWNhdXNlIGl0IHdvcmtzLlxyXG4gICAgICAgICAgICAgICAgbGV0IG9mZnNldFdpZHRoID0gdHJpYWRUZXh0LmJvdW5kcy53aWR0aFxyXG4gICAgICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpIC0gMV0uYm91bmRzLndpZHRoIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpXS5ib3VuZHMud2lkdGggLyAyO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFkZCBvZmZzZXQgd2lkdGggdG8gcHJpb3Igb2Zmc2V0LiBcclxuICAgICAgICAgICAgICAgIHhPZmZzZXRzW2ldID0geE9mZnNldHNbaSAtIDFdICsgb2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGdseXBoUGFpciBvZiBnbHlwaFBhaXJzKSB7XHJcbiAgICAgICAgICAgICAgICBnbHlwaFBhaXIucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB4T2Zmc2V0cztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRXYXJwIGV4dGVuZHMgRHVhbEJvdW5kc1BhdGhXYXJwIHtcclxuXHJcbiAgICAgICAgc3RhdGljIERFRkFVTFRfRk9OVF9TSVpFID0gMTI4O1xyXG5cclxuICAgICAgICBwcml2YXRlIF9mb250OiBvcGVudHlwZS5Gb250O1xyXG4gICAgICAgIHByaXZhdGUgX3RleHQ6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIF9mb250U2l6ZTogbnVtYmVyO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgZm9udDogb3BlbnR5cGUuRm9udCxcclxuICAgICAgICAgICAgdGV4dDogc3RyaW5nLFxyXG4gICAgICAgICAgICBib3VuZHM/OiB7IHVwcGVyOiBwYXBlci5TZWdtZW50W10sIGxvd2VyOiBwYXBlci5TZWdtZW50W10gfSxcclxuICAgICAgICAgICAgZm9udFNpemU/OiBudW1iZXIsXHJcbiAgICAgICAgICAgIHN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWZvbnRTaXplKSB7XHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZSA9IFRleHRXYXJwLkRFRkFVTFRfRk9OVF9TSVpFO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IFRleHRXYXJwLmdldFBhdGhEYXRhKGZvbnQsIHRleHQsIGZvbnRTaXplKTtcclxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IG5ldyBwYXBlci5Db21wb3VuZFBhdGgocGF0aERhdGEpO1xyXG5cclxuICAgICAgICAgICAgc3VwZXIocGF0aCwgYm91bmRzLCBzdHlsZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9mb250ID0gZm9udDtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dCA9IHRleHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgZm9udFNpemUoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGZvbnRTaXplKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGV4dFBhdGgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldCBmb250KHZhbHVlOiBvcGVudHlwZS5Gb250KSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fZm9udCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGRhdGVUZXh0UGF0aCgpIHtcclxuICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBUZXh0V2FycC5nZXRQYXRoRGF0YShcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnQsIHRoaXMuX3RleHQsIHRoaXMuX2ZvbnRTaXplKTtcclxuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGdldFBhdGhEYXRhKGZvbnQ6IG9wZW50eXBlLkZvbnQsXHJcbiAgICAgICAgICAgIHRleHQ6IHN0cmluZywgZm9udFNpemU/OiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgb3BlblR5cGVQYXRoID0gZm9udC5nZXRQYXRoKHRleHQsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICBOdW1iZXIoZm9udFNpemUpIHx8IFRleHRXYXJwLkRFRkFVTFRfRk9OVF9TSVpFKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9wZW5UeXBlUGF0aC50b1BhdGhEYXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2tldGNoSXRlbVN0eWxlIGV4dGVuZHMgcGFwZXIuSVN0eWxlIHtcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG59Il19