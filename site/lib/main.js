var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    var SeedRandom = /** @class */ (function () {
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
    // --- Core types ---
    var ChannelTopic = /** @class */ (function () {
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
    var Channel = /** @class */ (function () {
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
                topics[_i] = arguments[_i];
            }
            var types = topics.map(function (t) { return t.type; });
            return this.subject.filter(function (m) { return types.indexOf(m.type) >= 0; });
        };
        Channel.prototype.merge = function () {
            var topics = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                topics[_i] = arguments[_i];
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
        var Watermark = /** @class */ (function () {
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
                enumerable: false,
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
var ObservableEvent = /** @class */ (function () {
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
    var ChangeFlag;
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
    })(ChangeFlag = PaperNotify.ChangeFlag || (PaperNotify.ChangeFlag = {}));
    // Shortcuts to often used ChangeFlag values including APPEARANCE
    var Changes;
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
    })(Changes = PaperNotify.Changes || (PaperNotify.Changes = {}));
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
    var ViewZoom = /** @class */ (function () {
        function ViewZoom(project, getBackgroundItems) {
            var _this = this;
            this.factor = 1.1;
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
                if (!_this._viewCenterStart) { // not already dragging
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ViewZoom.prototype, "zoom", {
            get: function () {
                return this.project.view.zoom;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ViewZoom.prototype, "zoomRange", {
            get: function () {
                return [this._minZoom, this._maxZoom];
            },
            enumerable: false,
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
var Component = /** @class */ (function () {
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
var ReactiveDom = /** @class */ (function () {
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
    var AppCookies = /** @class */ (function () {
        function AppCookies() {
        }
        Object.defineProperty(AppCookies.prototype, "lastSavedSketchId", {
            get: function () {
                return Cookies.get(AppCookies.LAST_SAVED_SKETCH_ID_KEY);
            },
            set: function (value) {
                Cookies.set(AppCookies.LAST_SAVED_SKETCH_ID_KEY, value, { expires: AppCookies.YEAR });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppCookies.prototype, "browserId", {
            get: function () {
                return Cookies.get(AppCookies.BROWSER_ID_KEY);
            },
            set: function (value) {
                Cookies.set(AppCookies.BROWSER_ID_KEY, value, { expires: AppCookies.YEAR });
            },
            enumerable: false,
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
    var AppModule = /** @class */ (function () {
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
    var AppRouter = /** @class */ (function (_super) {
        __extends(AppRouter, _super);
        function AppRouter() {
            var _this = _super.call(this, [
                new RouteNode("home", "/"),
                new RouteNode("sketch", "/sketch/:sketchId"), // <[a-fA-F0-9]{14}>
            ], {
                useHash: false,
                defaultRoute: "home"
            }) || this;
            //this.usePlugin(loggerPlugin())
            _this.usePlugin(listenersPlugin.default())
                .usePlugin(historyPlugin.default());
            return _this;
        }
        AppRouter.prototype.toSketchEditor = function (sketchId) {
            this.navigate("sketch", { sketchId: sketchId });
        };
        Object.defineProperty(AppRouter.prototype, "state", {
            get: function () {
                // could do route validation somewhere
                return this.getState();
            },
            enumerable: false,
            configurable: true
        });
        return AppRouter;
    }(Router5));
    App.AppRouter = AppRouter;
})(App || (App = {}));
var App;
(function (App) {
    var Store = /** @class */ (function () {
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
    var AppState = /** @class */ (function () {
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppState.prototype, "browserId", {
            get: function () {
                return this.cookies.browserId;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AppState.prototype, "route", {
            get: function () {
                return this.router.state;
            },
            enumerable: false,
            configurable: true
        });
        return AppState;
    }());
    App.AppState = AppState;
    var Actions = /** @class */ (function (_super) {
        __extends(Actions, _super);
        function Actions() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.editorLoadedSketch = _this.topic("editorLoadedSketch");
            _this.editorSavedSketch = _this.topic("editorSavedSketch");
            return _this;
        }
        return Actions;
    }(TypedChannel.Channel));
    App.Actions = Actions;
    var Events = /** @class */ (function (_super) {
        __extends(Events, _super);
        function Events() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.routeChanged = _this.topic("routeChanged");
            return _this;
        }
        return Events;
    }(TypedChannel.Channel));
    App.Events = Events;
})(App || (App = {}));
var Demo;
(function (Demo) {
    var DemoModule = /** @class */ (function () {
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
    var Builder = /** @class */ (function () {
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
    var Module = /** @class */ (function () {
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
    var PreviewCanvas = /** @class */ (function () {
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
var SketchBuilder;
(function (SketchBuilder) {
    var ShareOptionsUI = /** @class */ (function () {
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
    var Store = /** @class */ (function () {
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "parsedFonts", {
            get: function () {
                return this._parsedFonts;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "fontCatalog", {
            get: function () {
                return this._fontCatalog;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "templateState$", {
            get: function () {
                return this._templateState$;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "template$", {
            get: function () {
                return this._template$;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "render$", {
            get: function () {
                return this._render$; //.observeOn(Rx.Scheduler.default);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "template", {
            get: function () {
                return this.state.template;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "design", {
            get: function () {
                return this.state.templateState && this.state.templateState.design;
            },
            enumerable: false,
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
    var FontChooser = /** @class */ (function () {
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
            enumerable: false,
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
    var ImageChooser = /** @class */ (function () {
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
            enumerable: false,
            configurable: true
        });
        return ImageChooser;
    }());
    SketchBuilder.ImageChooser = ImageChooser;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var TemplateFontChooser = /** @class */ (function () {
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
                return this._fontChooser.value$.map(function (choice) { return ({
                    fontCategory: choice.category,
                    design: {
                        font: {
                            family: choice.family,
                            variant: choice.variant
                        }
                    }
                }); });
            },
            enumerable: false,
            configurable: true
        });
        return TemplateFontChooser;
    }());
    SketchBuilder.TemplateFontChooser = TemplateFontChooser;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var TextInput = /** @class */ (function () {
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
            enumerable: false,
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
        var Dickens = /** @class */ (function () {
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
                    var _a;
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
                        return ({ design: { content: { text: t } } });
                    }), sourceTextInput.value$.map(function (t) {
                        return ({ design: { content: { source: t } } });
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
                        var choices = shapes.map(function (shape) { return ({
                            node: h("span", {}, [shape]),
                            chosen: ts.design.shape === shape,
                            callback: function () {
                                value$.onNext({ design: { shape: shape } });
                            }
                        }); });
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
                            return ({
                                node: h("div.paletteTile", {
                                    style: {
                                        backgroundColor: color
                                    }
                                }),
                                chosen: palette && palette.color === color,
                                callback: function () {
                                    value$.onNext({ design: { palette: { color: color } } });
                                }
                            });
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
    var DocumentKeyHandler = /** @class */ (function () {
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
    var SketchEditorModule = /** @class */ (function () {
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
    var SketchHelpers = /** @class */ (function () {
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
    var Store = /** @class */ (function () {
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
                _this.state.sketch.backgroundColor = ev.data.backgroundColor;
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "transparency$", {
            get: function () {
                return this._transparency$.asObservable();
            },
            enumerable: false,
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
            this.loadSketch(SketchEditor.getDefaultDrawing());
            return Promise.resolve('greeting');
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
    var WorkspaceController = /** @class */ (function () {
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
                canvasSel.css("background-color", ev.data.backgroundColor || "");
            });
            this.viewZoom = new paperExt.ViewZoom(this.project, function () { return [_this._backgroundImage]; });
            this.viewZoom.setZoomRange([
                this.defaultSize.multiply(this.defaultScale * 0.1),
                this.defaultSize.multiply(0.5)
            ]);
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
                var complete = function () {
                    var raster = _this.project.activeLayer.rasterize(dpi, false);
                    var data = raster.toDataURL();
                    callback(data);
                };
                if (_this.store.state.sketch.backgroundColor) {
                    var background = _this.insertBackground(true);
                    complete();
                    background.remove();
                }
                else {
                    complete();
                }
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
                var dataUrl = "data:image/svg+xml;utf8," + encodeURIComponent(_this.project.exportSVG({ asString: true }));
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
    var Actions = /** @class */ (function (_super) {
        __extends(Actions, _super);
        function Actions() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.editor = {
                initWorkspace: _this.topic("designer.initWorkspace"),
                loadFont: _this.topic("designer.loadFont"),
                zoomToFit: _this.topic("designer.zoomToFit"),
                exportingImage: _this.topic("designer.exportImage"),
                exportPNG: _this.topic("designer.exportPNG"),
                exportSVG: _this.topic("designer.exportSVG"),
                viewChanged: _this.topic("designer.viewChanged"),
                updateSnapshot: _this.topic("designer.updateSnapshot"),
                toggleHelp: _this.topic("designer.toggleHelp"),
                openSample: _this.topic("designer.openSample"),
            };
            _this.sketch = {
                create: _this.topic("sketch.create"),
                clear: _this.topic("sketch.clear"),
                clone: _this.topic("sketch.clone"),
                open: _this.topic("sketch.open"),
                attrUpdate: _this.topic("sketch.attrUpdate"),
                setSelection: _this.topic("sketch.setSelection"),
            };
            _this.textBlock = {
                add: _this.topic("textBlock.add"),
                updateAttr: _this.topic("textBlock.updateAttr"),
                updateArrange: _this.topic("textBlock.updateArrange"),
                remove: _this.topic("textBlock.remove")
            };
            return _this;
        }
        return Actions;
    }(TypedChannel.Channel));
    SketchEditor.Actions = Actions;
    var Events = /** @class */ (function (_super) {
        __extends(Events, _super);
        function Events() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.editor = {
                resourcesReady: _this.topic("app.resourcesReady"),
                workspaceInitialized: _this.topic("app.workspaceInitialized"),
                fontLoaded: _this.topic("app.fontLoaded"),
                zoomToFitRequested: _this.topic("designer.zoomToFitRequested"),
                exportPNGRequested: _this.topic("designer.exportPNGRequested"),
                exportSVGRequested: _this.topic("designer.exportSVGRequested"),
                viewChanged: _this.topic("designer.viewChanged"),
                snapshotExpired: _this.topic("designer.snapshotExpired"),
                userMessageChanged: _this.topic("designer.userMessageChanged"),
                showHelpChanged: _this.topic("designer.showHelpChanged")
            };
            _this.sketch = {
                loaded: _this.topic("sketch.loaded"),
                attrChanged: _this.topic("sketch.attrChanged"),
                contentChanged: _this.topic("sketch.contentChanged"),
                editingItemChanged: _this.topic("sketch.editingItemChanged"),
                selectionChanged: _this.topic("sketch.selectionChanged"),
                saveLocalRequested: _this.topic("sketch.savelocal.saveLocalRequested"),
                cloned: _this.topic("sketch.cloned"),
                imageUploaded: _this.topic("sketch.imageUploaded"),
            };
            _this.textblock = {
                added: _this.topic("textblock.added"),
                attrChanged: _this.topic("textblock.attrChanged"),
                fontReady: _this.topic("textblock.fontReady"),
                arrangeChanged: _this.topic("textblock.arrangeChanged"),
                removed: _this.topic("textblock.removed"),
                loaded: _this.topic("textblock.loaded"),
                editorClosed: _this.topic("textblock.editorClosed"),
            };
            return _this;
        }
        return Events;
    }(TypedChannel.Channel));
    SketchEditor.Events = Events;
    var Channels = /** @class */ (function () {
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
    SketchEditor.getDefaultDrawing = function () { return ({
        "browserId": "ilul8y6ybf0f6r",
        "defaultTextBlockAttr": {
            "textColor": "#fff4e6",
            "backgroundColor": "#7bc043",
            "fontFamily": "Rokkitt",
            "fontVariant": "regular"
        },
        "backgroundColor": "",
        "textBlocks": [
            {
                "_id": "ilz7swqec4bo6r",
                "text": "FIDDLESTICKS.IO",
                "textColor": "#fff4e6",
                "fontFamily": "Shadows Into Light Two",
                "fontVariant": "regular",
                "position": [
                    -1003.7307552963839,
                    -170.521635
                ],
                "outline": {
                    "top": {
                        "applyMatrix": true,
                        "selected": true,
                        "segments": [
                            [
                                -2095.87163,
                                -456.62303
                            ],
                            [
                                [
                                    -1148.83438,
                                    -271.44759
                                ],
                                [
                                    -286.63044,
                                    25.37433
                                ],
                                [
                                    285.62683,
                                    -25.28549
                                ]
                            ],
                            [
                                [
                                    -475.34278,
                                    -445.6346
                                ],
                                [
                                    -230.51968,
                                    32.23645
                                ],
                                [
                                    239.36942,
                                    -33.47402
                                ]
                            ],
                            [
                                89.4584,
                                -388.81268
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    },
                    "bottom": {
                        "applyMatrix": true,
                        "selected": true,
                        "segments": [
                            [
                                -1995.46648,
                                -90.96613
                            ],
                            [
                                [
                                    -1539.22445,
                                    55.19938
                                ],
                                [
                                    -91.88278,
                                    -12.17844
                                ],
                                [
                                    121.68323,
                                    16.12829
                                ]
                            ],
                            [
                                [
                                    -1218.44722,
                                    37.29089
                                ],
                                [
                                    -112.16966,
                                    -7.77909
                                ],
                                [
                                    126.02928,
                                    8.74027
                                ]
                            ],
                            [
                                [
                                    -820.49984,
                                    115.57976
                                ],
                                [
                                    -173.48301,
                                    5.47776
                                ],
                                [
                                    230.82293,
                                    -7.28828
                                ]
                            ],
                            [
                                -70.56745,
                                93.06599
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    }
                },
                "backgroundColor": "#ae5a41"
            },
            {
                "_id": "ilz81ipmjxajor",
                "text": "YOU CAN",
                "textColor": "#92a8b3",
                "fontFamily": "Open Sans",
                "fontVariant": "700",
                "position": [
                    -1422.6595677776381,
                    139.0122993069002
                ],
                "outline": {
                    "top": {
                        "applyMatrix": true,
                        "selected": true,
                        "segments": [
                            [
                                -2000.31359,
                                -66.84198
                            ],
                            [
                                [
                                    -1792.51032,
                                    -5.64768
                                ],
                                [
                                    -75.80181,
                                    -20.93247
                                ],
                                [
                                    90.65041,
                                    25.03288
                                ]
                            ],
                            [
                                [
                                    -1506.05593,
                                    70.08989
                                ],
                                [
                                    -103.78814,
                                    -13.87471
                                ],
                                [
                                    119.08014,
                                    15.91898
                                ]
                            ],
                            [
                                [
                                    -1153.96217,
                                    64.48364
                                ],
                                [
                                    -153.65112,
                                    -41.11302
                                ],
                                [
                                    124.11159,
                                    33.20902
                                ]
                            ],
                            [
                                [
                                    -996.49346,
                                    110.44365
                                ],
                                [
                                    -41.33621,
                                    -9.5484
                                ],
                                [
                                    42.93468,
                                    9.91763
                                ]
                            ],
                            [
                                -845.94518,
                                135.33833
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    },
                    "bottom": {
                        "applyMatrix": true,
                        "selected": true,
                        "segments": [
                            [
                                -1992.9104,
                                85.98123
                            ],
                            [
                                [
                                    -1879.12251,
                                    61.29821
                                ],
                                [
                                    -94.46159,
                                    -69.87982
                                ],
                                [
                                    120.09763,
                                    88.84458
                                ]
                            ],
                            [
                                [
                                    -1464.29472,
                                    203.83927
                                ],
                                [
                                    -129.75106,
                                    -22.71579
                                ],
                                [
                                    108.81278,
                                    19.05008
                                ]
                            ],
                            [
                                [
                                    -1155.8429,
                                    208.66876
                                ],
                                [
                                    -55.84467,
                                    -103.77685
                                ],
                                [
                                    32.28063,
                                    59.98752
                                ]
                            ],
                            [
                                -1070.72138,
                                343.51218
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    }
                }
            },
            {
                "_id": "ilz8f5wvd4pldi",
                "text": "with",
                "textColor": "#e39e54",
                "fontFamily": "Sacramento",
                "fontVariant": "regular",
                "position": [
                    -1020.1649023070063,
                    334.30439422177653
                ],
                "outline": {
                    "top": {
                        "applyMatrix": true,
                        "selected": true,
                        "segments": [
                            [
                                -1332.19864,
                                377.38437
                            ],
                            [
                                [
                                    -964.01736,
                                    306.93706
                                ],
                                [
                                    -72.69314,
                                    43.60143
                                ],
                                [
                                    41.11135,
                                    -24.65864
                                ]
                            ],
                            [
                                -888.69231,
                                213.65639
                            ],
                            [
                                -840.04855,
                                134.68851
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    },
                    "bottom": {
                        "applyMatrix": true,
                        "selected": true,
                        "segments": [
                            [
                                -954.33051,
                                541.66968
                            ],
                            [
                                -705.98879,
                                126.93911
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    }
                }
            },
            {
                "_id": "ilz8gyg102uik9",
                "text": "t",
                "textColor": "#fff4e6",
                "fontFamily": "Rokkitt",
                "fontVariant": "regular",
                "position": [
                    -567.1475046062878,
                    240.4194411431144
                ],
                "outline": {
                    "top": {
                        "applyMatrix": true,
                        "selected": true,
                        "segments": [
                            [
                                -657.41226,
                                131.15807
                            ],
                            [
                                -354.81243,
                                129.07178
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    },
                    "bottom": {
                        "applyMatrix": true,
                        "selected": true,
                        "segments": [
                            [
                                -779.48257,
                                351.76711
                            ],
                            [
                                -432.92449,
                                342.26603
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    }
                },
                "backgroundColor": "#1b85b8"
            },
            {
                "_id": "ilzbkfccpnl8fr",
                "text": "e",
                "textColor": "#fff4e6",
                "fontFamily": "Rokkitt",
                "fontVariant": "regular",
                "position": [
                    -254.48532165920588,
                    231.01988999999998
                ],
                "outline": {
                    "top": {
                        "applyMatrix": true,
                        "selected": true,
                        "segments": [
                            [
                                -355.90166,
                                128.25435
                            ],
                            [
                                -75.58933,
                                120.57989
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    },
                    "bottom": {
                        "applyMatrix": true,
                        "selected": true,
                        "segments": [
                            [
                                -433.38131,
                                342.13079
                            ],
                            [
                                -144.34143,
                                331.95182
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    }
                },
                "backgroundColor": "#7bc043"
            },
            {
                "_id": "ilzbkmpal40a4i",
                "text": "t",
                "textColor": "#fff4e6",
                "fontFamily": "Rokkitt",
                "fontVariant": "regular",
                "position": [
                    -327.235125,
                    440.56611999999996
                ],
                "outline": {
                    "top": {
                        "applyMatrix": true,
                        "selected": true,
                        "segments": [
                            [
                                -431.79099,
                                340.41309
                            ],
                            [
                                -142.79003,
                                329.03173
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    },
                    "bottom": {
                        "applyMatrix": true,
                        "selected": true,
                        "segments": [
                            [
                                -511.68022,
                                552.10051
                            ],
                            [
                                -209.99521,
                                545.48625
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    }
                },
                "backgroundColor": "#1b85b8"
            },
            {
                "_id": "im1wk2fylo9a4i",
                "text": "x",
                "textColor": "#fff4e6",
                "fontFamily": "Rokkitt",
                "fontVariant": "regular",
                "position": [
                    -659.1007126473504,
                    449.3097719033801
                ],
                "outline": {
                    "top": {
                        "applyMatrix": true,
                        "segments": [
                            [
                                -779.55927,
                                351.43761
                            ],
                            [
                                -431.08349,
                                342.9695
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    },
                    "bottom": {
                        "applyMatrix": true,
                        "segments": [
                            [
                                -887.11794,
                                555.65005
                            ],
                            [
                                -510.71106,
                                552.23549
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    }
                },
                "backgroundColor": "#cc2a36"
            },
            {
                "_id": "im1wlykcdt2o6r",
                "text": "Sketch",
                "textColor": "#e39e54",
                "fontFamily": "Sacramento",
                "fontVariant": "regular",
                "position": [
                    -1530.0335481453876,
                    255.76123234391142
                ],
                "outline": {
                    "top": {
                        "applyMatrix": true,
                        "segments": [
                            [
                                -2006.42189,
                                -28.55027
                            ],
                            [
                                [
                                    -1831.49119,
                                    111.71838
                                ],
                                [
                                    -62.44195,
                                    -32.73557
                                ],
                                [
                                    60.22505,
                                    31.57335
                                ]
                            ],
                            [
                                [
                                    -1590.50695,
                                    132.49171
                                ],
                                [
                                    -73.25353,
                                    -6.63899
                                ],
                                [
                                    78.06868,
                                    7.07539
                                ]
                            ],
                            [
                                [
                                    -1279.04002,
                                    140.22397
                                ],
                                [
                                    -84.13437,
                                    -12.66516
                                ],
                                [
                                    79.46575,
                                    11.96237
                                ]
                            ],
                            [
                                -1090.24079,
                                274.80483
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    },
                    "bottom": {
                        "applyMatrix": true,
                        "segments": [
                            [
                                -1923.37865,
                                540.07273
                            ],
                            [
                                -1053.64521,
                                537.40264
                            ]
                        ],
                        "strokeColor": [
                            0.82745,
                            0.82745,
                            0.82745
                        ],
                        "strokeWidth": 6
                    }
                }
            }
        ],
        "_id": "greeting-sketch"
    }); };
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var UploadImage = /** @class */ (function () {
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
    var S3Access = /** @class */ (function () {
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
    var ColorPicker = /** @class */ (function () {
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
    var EditorBar = /** @class */ (function (_super) {
        __extends(EditorBar, _super);
        function EditorBar(container, store) {
            var _this = _super.call(this) || this;
            _this.store = store;
            var sketchDom$ = store.events.merge(store.events.sketch.loaded, store.events.sketch.attrChanged, store.events.editor.userMessageChanged)
                .map(function (m) { return _this.render(store.state); });
            ReactiveDom.renderStream(sketchDom$, container);
            return _this;
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
                                _this.store.actions.sketch.attrUpdate.dispatch({ backgroundColor: color ? color.toHexString() : null });
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
                        }
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
    var FontPicker = /** @class */ (function () {
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
    var HelpDialog = /** @class */ (function () {
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
    var OperationPanel = /** @class */ (function () {
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
    var SelectedItemEditor = /** @class */ (function () {
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
    var TextBlockEditor = /** @class */ (function (_super) {
        __extends(TextBlockEditor, _super);
        function TextBlockEditor(store) {
            var _this = _super.call(this) || this;
            _this.store = store;
            return _this;
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
                    // hook: {
                    //     insert: (vnode) => {
                    //         const props: FontPickerProps = {
                    //             store: this.store,
                    //             selection: textBlock.fontDesc,
                    //             selectionChanged: (fontDesc) => {
                    //                 update({ fontDesc });
                    //             }
                    //         };
                    //         ReactDOM.render(rh(FontPicker, props), vnode.elm);
                    //     },
                    // }
                }, []),
            ]);
        };
        return TextBlockEditor;
    }(Component));
    SketchEditor.TextBlockEditor = TextBlockEditor;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var DualBoundsPathWarp = /** @class */ (function (_super) {
        __extends(DualBoundsPathWarp, _super);
        function DualBoundsPathWarp(source, bounds, customStyle) {
            var _this = _super.call(this) || this;
            // -- build children --
            _this._source = source;
            _this._source.remove();
            if (bounds) {
                _this._upper = new SketchEditor.StretchPath(bounds.upper);
                _this._lower = new SketchEditor.StretchPath(bounds.lower);
            }
            else {
                _this._upper = new SketchEditor.StretchPath([
                    new paper.Segment(source.bounds.topLeft),
                    new paper.Segment(source.bounds.topRight)
                ]);
                _this._lower = new SketchEditor.StretchPath([
                    new paper.Segment(source.bounds.bottomLeft),
                    new paper.Segment(source.bounds.bottomRight)
                ]);
            }
            _this.controlBoundsOpacity = 0.75;
            _this._upper.visible = _this.selected;
            _this._lower.visible = _this.selected;
            _this._outline = new paper.Path({ closed: true });
            _this.updateOutlineShape();
            _this._warped = new paper.CompoundPath(source.pathData);
            _this.updateWarped();
            // -- add children --
            _this.addChildren([_this._outline, _this._warped, _this._upper, _this._lower]);
            // -- assign style --
            _this.customStyle = customStyle || {
                strokeColor: "gray"
            };
            // -- set up observers --
            Rx.Observable.merge(_this._upper.pathChanged.observe(), _this._lower.pathChanged.observe())
                .debounce(DualBoundsPathWarp.UPDATE_DEBOUNCE)
                .subscribe(function (path) {
                _this.updateOutlineShape();
                _this.updateWarped();
                _this._changed(PaperNotify.ChangeFlag.GEOMETRY);
            });
            _this.subscribe(function (flags) {
                if (flags & PaperNotify.ChangeFlag.ATTRIBUTE) {
                    if (_this._upper.visible !== _this.selected) {
                        _this._upper.visible = _this.selected;
                        _this._lower.visible = _this.selected;
                    }
                }
            });
            return _this;
        }
        Object.defineProperty(DualBoundsPathWarp.prototype, "upper", {
            get: function () {
                return this._upper.path;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DualBoundsPathWarp.prototype, "lower", {
            get: function () {
                return this._lower.path;
            },
            enumerable: false,
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
            enumerable: false,
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DualBoundsPathWarp.prototype, "controlBoundsOpacity", {
            set: function (value) {
                this._upper.opacity = this._lower.opacity = value;
            },
            enumerable: false,
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
    var PathHandle = /** @class */ (function (_super) {
        __extends(PathHandle, _super);
        function PathHandle(attach) {
            var _this = _super.call(this) || this;
            _this._curveSplit = new ObservableEvent();
            var position;
            var path;
            if (attach instanceof paper.Segment) {
                _this._segment = attach;
                position = _this._segment.point;
                path = _this._segment.path;
            }
            else if (attach instanceof paper.Curve) {
                _this._curve = attach;
                position = _this._curve.getPointAt(_this._curve.length * 0.5);
                path = _this._curve.path;
            }
            else {
                throw "attach must be Segment or Curve";
            }
            _this._marker = paper.Shape.Circle(position, PathHandle.SEGMENT_MARKER_RADIUS);
            _this._marker.strokeColor = "blue";
            _this._marker.fillColor = "white";
            _this._marker.selectedColor = new paper.Color(0, 0);
            _this.addChild(_this._marker);
            if (_this._segment) {
                _this.styleAsSegment();
            }
            else {
                _this.styleAsCurve();
            }
            paperExt.extendMouseEvents(_this);
            _this.on(paperExt.EventType.mouseDragStart, function (ev) {
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
            _this.on(paper.EventType.mouseDrag, function (ev) {
                if (_this._segment) {
                    _this._segment.point = _this.center;
                    if (_this._smoothed) {
                        _this._segment.smooth();
                    }
                }
                _this.translate(ev.delta);
                ev.stop();
            });
            _this.on(paper.EventType.click, function (ev) {
                if (_this._segment) {
                    _this.smoothed = !_this.smoothed;
                }
                ev.stop();
            });
            _this._curveChangeUnsub = path.subscribe(function (flags) {
                if (_this._curve && !_this._segment
                    && (flags & PaperNotify.ChangeFlag.SEGMENTS)) {
                    _this.center = _this._curve.getPointAt(_this._curve.length * 0.5);
                }
            });
            return _this;
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PathHandle.prototype, "curveSplit", {
            get: function () {
                return this._curveSplit;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PathHandle.prototype, "center", {
            get: function () {
                return this.position;
            },
            set: function (point) {
                this.position = point;
            },
            enumerable: false,
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
    var StretchPath = /** @class */ (function (_super) {
        __extends(StretchPath, _super);
        function StretchPath(segments, style) {
            var _this = _super.call(this) || this;
            _this._pathChanged = new ObservableEvent();
            _this._path = new paper.Path(segments);
            _this.addChild(_this._path);
            if (style) {
                _this._path.style = style;
            }
            else {
                _this._path.strokeColor = "lightgray";
                _this._path.strokeWidth = 6;
            }
            for (var _i = 0, _a = _this._path.segments; _i < _a.length; _i++) {
                var s = _a[_i];
                _this.addSegmentHandle(s);
            }
            for (var _b = 0, _c = _this._path.curves; _b < _c.length; _b++) {
                var c = _c[_b];
                _this.addCurveHandle(c);
            }
            return _this;
        }
        Object.defineProperty(StretchPath.prototype, "path", {
            get: function () {
                return this._path;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(StretchPath.prototype, "pathChanged", {
            get: function () {
                return this._pathChanged;
            },
            enumerable: false,
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
    var TextRuler = /** @class */ (function () {
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
    var TextWarp = /** @class */ (function (_super) {
        __extends(TextWarp, _super);
        function TextWarp(font, text, bounds, fontSize, style) {
            var _this = this;
            if (!fontSize) {
                fontSize = TextWarp.DEFAULT_FONT_SIZE;
            }
            var pathData = TextWarp.getPathData(font, text, fontSize);
            var path = new paper.CompoundPath(pathData);
            _this = _super.call(this, path, bounds, style) || this;
            _this._font = font;
            _this._text = text;
            return _this;
        }
        Object.defineProperty(TextWarp.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                this._text = value;
                this.updateTextPath();
            },
            enumerable: false,
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TextWarp.prototype, "font", {
            set: function (value) {
                if (value !== this._font) {
                    this._font = value;
                    this.updateTextPath();
                }
            },
            enumerable: false,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Eb21IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0Rvd25sb2FkSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL1NlZWRSYW5kb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL1dhdGVybWFyay50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9jb2xsZWN0aW9ucy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ldmVudHMudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvZ29vZ2xlLWFuYWx5dGljcy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJOb3RpZnkudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvVmlld1pvb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvbW91c2VFdmVudEV4dC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9wYXBlci9wYXBlci1leHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9Db21wb25lbnQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9WRG9tSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwQ29va2llcy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L2FwcC9BcHBSb3V0ZXIudHMiLCIuLi8uLi9jbGllbnQvYXBwL1N0b3JlLnRzIiwiLi4vLi4vY2xpZW50L2RlbW8vRGVtb01vZHVsZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL0J1aWxkZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9Nb2R1bGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9QcmV2aWV3Q2FudmFzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvU2hhcmVPcHRpb25zVUkudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL21vZGVscy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL2NvbnRyb2xzL0NvbnRyb2xIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvRm9udENob29zZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9JbWFnZUNob29zZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9UZW1wbGF0ZUZvbnRDaG9vc2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvVGV4dElucHV0LnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvdGVtcGxhdGVzL0RpY2tlbnMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL0RvY3VtZW50S2V5SGFuZGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvU2tldGNoRWRpdG9yTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9Ta2V0Y2hIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvV29ya3NwYWNlQ29udHJvbGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvY2hhbm5lbHMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL2NvbnN0YW50cy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvbW9kZWxzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9kYXRhL2RlZmF1bHREcmF3aW5nLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9vcGVyYXRpb25zL1VwbG9hZEltYWdlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9zZXJ2aWNlcy9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivc2VydmljZXMvUzNBY2Nlc3MudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0NvbG9yUGlja2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9FZGl0b3JCYXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0ZvbnRQaWNrZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0hlbHBEaWFsb2cudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL09wZXJhdGlvblBhbmVsLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9TZWxlY3RlZEl0ZW1FZGl0b3IudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL1RleHRCbG9ja0VkaXRvci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL0R1YWxCb3VuZHNQYXRoV2FycC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1BhdGhIYW5kbGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9TdHJldGNoUGF0aC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1RleHRSdWxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1RleHRXYXJwLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFVLFVBQVUsQ0F3TG5CO0FBeExELFdBQVUsVUFBVTtJQUVoQjs7Ozs7O09BTUc7SUFDSCxTQUFnQixhQUFhLENBQUMsT0FBTztRQUNqQyxJQUFJLGFBQWEsR0FBRyxVQUFVLENBQUM7UUFDL0IsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQ3RDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0IsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxJQUFJLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2QyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUNqRDtRQUVELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekMsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFFM0IsSUFBSSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFM0MsS0FBSyxJQUFJLENBQUMsR0FB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QUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDcEQsT0FBTyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDckMsQ0FBQztRQWpFTSwwQkFBaUIsR0FBRyxHQUFHLENBQUM7UUFrRW5DLGVBQUM7S0FBQSxBQXBFRCxDQUE4QixhQUFBLGtCQUFrQixHQW9FL0M7SUFwRVkscUJBQVEsV0FvRXBCLENBQUE7QUFFTCxDQUFDLEVBeEVTLFlBQVksS0FBWixZQUFZLFFBd0VyQiIsInNvdXJjZXNDb250ZW50IjpbIlxubmFtZXNwYWNlIERvbUhlbHBlcnMge1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIGJsb2IgZnJvbSBhIGRhdGEgVVJMIChlaXRoZXIgYmFzZTY0IGVuY29kZWQgb3Igbm90KS5cbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vZWJpZGVsL2ZpbGVyLmpzL2Jsb2IvbWFzdGVyL3NyYy9maWxlci5qcyNMMTM3XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YVVSTCBUaGUgZGF0YSBVUkwgdG8gY29udmVydC5cbiAgICAgKiBAcmV0dXJuIHtCbG9ifSBBIGJsb2IgcmVwcmVzZW50aW5nIHRoZSBhcnJheSBidWZmZXIgZGF0YS5cbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gZGF0YVVSTFRvQmxvYihkYXRhVVJMKTogQmxvYiB7XG4gICAgICAgIHZhciBCQVNFNjRfTUFSS0VSID0gJztiYXNlNjQsJztcbiAgICAgICAgaWYgKGRhdGFVUkwuaW5kZXhPZihCQVNFNjRfTUFSS0VSKSA9PSAtMSkge1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gZGF0YVVSTC5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgdmFyIGNvbnRlbnRUeXBlID0gcGFydHNbMF0uc3BsaXQoJzonKVsxXTtcbiAgICAgICAgICAgIHZhciByYXcgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IEJsb2IoW3Jhd10sIHsgdHlwZTogY29udGVudFR5cGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcGFydHMgPSBkYXRhVVJMLnNwbGl0KEJBU0U2NF9NQVJLRVIpO1xuICAgICAgICB2YXIgY29udGVudFR5cGUgPSBwYXJ0c1swXS5zcGxpdCgnOicpWzFdO1xuICAgICAgICB2YXIgcmF3ID0gd2luZG93LmF0b2IocGFydHNbMV0pO1xuICAgICAgICB2YXIgcmF3TGVuZ3RoID0gcmF3Lmxlbmd0aDtcblxuICAgICAgICB2YXIgdUludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KHJhd0xlbmd0aCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdMZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdUludDhBcnJheVtpXSA9IHJhdy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBCbG9iKFt1SW50OEFycmF5XSwgeyB0eXBlOiBjb250ZW50VHlwZSB9KTtcbiAgICB9XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gaW5pdEVycm9ySGFuZGxlcihsb2dnZXI6IChlcnJvckRhdGE6IE9iamVjdCkgPT4gdm9pZCkge1xuXG4gICAgICAgIHdpbmRvdy5vbmVycm9yID0gZnVuY3Rpb24obXNnLCBmaWxlLCBsaW5lLCBjb2wsIGVycm9yOiBFcnJvciB8IHN0cmluZykge1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHN0YWNrZnJhbWVzID0+IHtcblxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1zZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6IGxpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sOiBjb2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6IHN0YWNrZnJhbWVzXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGxvZyBlcnJvclwiLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBlcnJiYWNrID0gZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBsb2cgZXJyb3JcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcig8c3RyaW5nPmVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhc0Vycm9yID0gdHlwZW9mIGVycm9yID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgID8gbmV3IEVycm9yKGVycm9yKVxuICAgICAgICAgICAgICAgICAgICA6IGVycm9yO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhY2sgPSBTdGFja1RyYWNlLmZyb21FcnJvcihhc0Vycm9yKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihjYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycmJhY2spO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZmFpbGVkIHRvIGxvZyBlcnJvclwiLCBleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cblxuICAgIH1cblxuICAgIGV4cG9ydCBjb25zdCBLZXlDb2RlcyA9IHtcbiAgICAgICAgQmFja1NwYWNlOiA4LFxuICAgICAgICBUYWI6IDksXG4gICAgICAgIEVudGVyOiAxMyxcbiAgICAgICAgU2hpZnQ6IDE2LFxuICAgICAgICBDdHJsOiAxNyxcbiAgICAgICAgQWx0OiAxOCxcbiAgICAgICAgUGF1c2VCcmVhazogMTksXG4gICAgICAgIENhcHNMb2NrOiAyMCxcbiAgICAgICAgRXNjOiAyNyxcbiAgICAgICAgUGFnZVVwOiAzMyxcbiAgICAgICAgUGFnZURvd246IDM0LFxuICAgICAgICBFbmQ6IDM1LFxuICAgICAgICBIb21lOiAzNixcbiAgICAgICAgQXJyb3dMZWZ0OiAzNyxcbiAgICAgICAgQXJyb3dVcDogMzgsXG4gICAgICAgIEFycm93UmlnaHQ6IDM5LFxuICAgICAgICBBcnJvd0Rvd246IDQwLFxuICAgICAgICBJbnNlcnQ6IDQ1LFxuICAgICAgICBEZWxldGU6IDQ2LFxuICAgICAgICBEaWdpdDA6IDQ4LFxuICAgICAgICBEaWdpdDE6IDQ5LFxuICAgICAgICBEaWdpdDI6IDUwLFxuICAgICAgICBEaWdpdDM6IDUxLFxuICAgICAgICBEaWdpdDQ6IDUyLFxuICAgICAgICBEaWdpdDU6IDUzLFxuICAgICAgICBEaWdpdDY6IDU0LFxuICAgICAgICBEaWdpdDc6IDU1LFxuICAgICAgICBEaWdpdDg6IDU2LFxuICAgICAgICBEaWdpdDk6IDU3LFxuICAgICAgICBBOiA2NSxcbiAgICAgICAgQjogNjYsXG4gICAgICAgIEM6IDY3LFxuICAgICAgICBEOiA2OCxcbiAgICAgICAgRTogNjksXG4gICAgICAgIEY6IDcwLFxuICAgICAgICBHOiA3MSxcbiAgICAgICAgSDogNzIsXG4gICAgICAgIEk6IDczLFxuICAgICAgICBKOiA3NCxcbiAgICAgICAgSzogNzUsXG4gICAgICAgIEw6IDc2LFxuICAgICAgICBNOiA3NyxcbiAgICAgICAgTjogNzgsXG4gICAgICAgIE86IDc5LFxuICAgICAgICBQOiA4MCxcbiAgICAgICAgUTogODEsXG4gICAgICAgIFI6IDgyLFxuICAgICAgICBTOiA4MyxcbiAgICAgICAgVDogODQsXG4gICAgICAgIFU6IDg1LFxuICAgICAgICBWOiA4NixcbiAgICAgICAgVzogODcsXG4gICAgICAgIFg6IDg4LFxuICAgICAgICBZOiA4OSxcbiAgICAgICAgWjogOTAsXG4gICAgICAgIFdpbmRvd0xlZnQ6IDkxLFxuICAgICAgICBXaW5kb3dSaWdodDogOTIsXG4gICAgICAgIFNlbGVjdEtleTogOTMsXG4gICAgICAgIE51bXBhZDA6IDk2LFxuICAgICAgICBOdW1wYWQxOiA5NyxcbiAgICAgICAgTnVtcGFkMjogOTgsXG4gICAgICAgIE51bXBhZDM6IDk5LFxuICAgICAgICBOdW1wYWQ0OiAxMDAsXG4gICAgICAgIE51bXBhZDU6IDEwMSxcbiAgICAgICAgTnVtcGFkNjogMTAyLFxuICAgICAgICBOdW1wYWQ3OiAxMDMsXG4gICAgICAgIE51bXBhZDg6IDEwNCxcbiAgICAgICAgTnVtcGFkOTogMTA1LFxuICAgICAgICBNdWx0aXBseTogMTA2LFxuICAgICAgICBBZGQ6IDEwNyxcbiAgICAgICAgU3VidHJhY3Q6IDEwOSxcbiAgICAgICAgRGVjaW1hbFBvaW50OiAxMTAsXG4gICAgICAgIERpdmlkZTogMTExLFxuICAgICAgICBGMTogMTEyLFxuICAgICAgICBGMjogMTEzLFxuICAgICAgICBGMzogMTE0LFxuICAgICAgICBGNDogMTE1LFxuICAgICAgICBGNTogMTE2LFxuICAgICAgICBGNjogMTE3LFxuICAgICAgICBGNzogMTE4LFxuICAgICAgICBGODogMTE5LFxuICAgICAgICBGOTogMTIwLFxuICAgICAgICBGMTA6IDEyMSxcbiAgICAgICAgRjExOiAxMjIsXG4gICAgICAgIEYxMjogMTIzLFxuICAgICAgICBOdW1Mb2NrOiAxNDQsXG4gICAgICAgIFNjcm9sbExvY2s6IDE0NSxcbiAgICAgICAgU2VtaUNvbG9uOiAxODYsXG4gICAgICAgIEVxdWFsOiAxODcsXG4gICAgICAgIENvbW1hOiAxODgsXG4gICAgICAgIERhc2g6IDE4OSxcbiAgICAgICAgUGVyaW9kOiAxOTAsXG4gICAgICAgIEZvcndhcmRTbGFzaDogMTkxLFxuICAgICAgICBHcmF2ZUFjY2VudDogMTkyLFxuICAgICAgICBCcmFja2V0T3BlbjogMjE5LFxuICAgICAgICBCYWNrU2xhc2g6IDIyMCxcbiAgICAgICAgQnJhY2tldENsb3NlOiAyMjEsXG4gICAgICAgIFNpbmdsZVF1b3RlOiAyMjJcbiAgICB9O1xuXG59IiwibmFtZXNwYWNlIEZzdHguRnJhbWV3b3JrIHtcblxuICAgIGV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGaWxlTmFtZSh0ZXh0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBleHRlbnNpb246IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCBuYW1lID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCB3b3JkIG9mIHRleHQuc3BsaXQoL1xccy8pKSB7XG4gICAgICAgICAgICBjb25zdCB0cmltID0gd29yZC5yZXBsYWNlKC9cXFcvZywgJycpLnRyaW0oKTtcbiAgICAgICAgICAgIGlmICh0cmltLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmKG5hbWUubGVuZ3RoICYmIG5hbWUubGVuZ3RoICsgdHJpbS5sZW5ndGggKyAxID4gbWF4TGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuYW1lLmxlbmd0aCkgbmFtZSArPSBcIiBcIjtcbiAgICAgICAgICAgICAgICBuYW1lICs9IHRyaW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWUgKyBcIi5cIiArIGV4dGVuc2lvbjtcbiAgICB9XG5cbn0iLCJcbm5hbWVzcGFjZSBGb250SGVscGVycyB7XG4gICAgXG4gICAgZXhwb3J0IGludGVyZmFjZSBFbGVtZW50Rm9udFN0eWxlIHtcbiAgICAgICAgZm9udEZhbWlseT86IHN0cmluZztcbiAgICAgICAgZm9udFdlaWdodD86IHN0cmluZztcbiAgICAgICAgZm9udFN0eWxlPzogc3RyaW5nOyBcbiAgICAgICAgZm9udFNpemU/OiBzdHJpbmc7IFxuICAgIH1cbiAgICBcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q3NzU3R5bGUoZmFtaWx5OiBzdHJpbmcsIHZhcmlhbnQ/OiBzdHJpbmcsIHNpemU/OiBzdHJpbmcpe1xuICAgICAgICBsZXQgc3R5bGUgPSA8RWxlbWVudEZvbnRTdHlsZT57IGZvbnRGYW1pbHk6IGZhbWlseSB9O1xuICAgICAgICBpZih2YXJpYW50ICYmIHZhcmlhbnQuaW5kZXhPZihcIml0YWxpY1wiKSA+PSAwKXtcbiAgICAgICAgICAgIHN0eWxlLmZvbnRTdHlsZSA9IFwiaXRhbGljXCI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG51bWVyaWMgPSB2YXJpYW50ICYmIHZhcmlhbnQucmVwbGFjZSgvW15cXGRdL2csIFwiXCIpO1xuICAgICAgICBpZihudW1lcmljICYmIG51bWVyaWMubGVuZ3RoKXtcbiAgICAgICAgICAgIHN0eWxlLmZvbnRXZWlnaHQgPSBudW1lcmljLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoc2l6ZSl7XG4gICAgICAgICAgICBzdHlsZS5mb250U2l6ZSA9IHNpemU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0U3R5bGVTdHJpbmcoZmFtaWx5OiBzdHJpbmcsIHZhcmlhbnQ6IHN0cmluZywgc2l6ZT86IHN0cmluZykge1xuICAgICAgICBsZXQgc3R5bGVPYmogPSBnZXRDc3NTdHlsZShmYW1pbHksIHZhcmlhbnQsIHNpemUpO1xuICAgICAgICBsZXQgcGFydHMgPSBbXTtcbiAgICAgICAgaWYoc3R5bGVPYmouZm9udEZhbWlseSl7XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LWZhbWlseTonJHtzdHlsZU9iai5mb250RmFtaWx5fSdgKTtcbiAgICAgICAgfVxuICAgICAgICBpZihzdHlsZU9iai5mb250V2VpZ2h0KXtcbiAgICAgICAgICAgIHBhcnRzLnB1c2goYGZvbnQtd2VpZ2h0OiR7c3R5bGVPYmouZm9udFdlaWdodH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZihzdHlsZU9iai5mb250U3R5bGUpe1xuICAgICAgICAgICAgcGFydHMucHVzaChgZm9udC1zdHlsZToke3N0eWxlT2JqLmZvbnRTdHlsZX1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZihzdHlsZU9iai5mb250U2l6ZSl7XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LXNpemU6JHtzdHlsZU9iai5mb250U2l6ZX1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFydHMuam9pbihcIjsgXCIpO1xuICAgIH1cbiAgICBcbn0iLCJuYW1lc3BhY2UgRnJhbWV3b3JrIHtcblxuICAgIGV4cG9ydCBmdW5jdGlvbiBsb2d0YXA8VD4obWVzc2FnZTogc3RyaW5nLCBzdHJlYW06IFJ4Lk9ic2VydmFibGU8VD4pOiBSeC5PYnNlcnZhYmxlPFQ+IHtcbiAgICAgICAgcmV0dXJuIHN0cmVhbS50YXAodCA9PiBjb25zb2xlLmxvZyhtZXNzYWdlLCB0KSk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG5ld2lkKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAobmV3IERhdGUoKS5nZXRUaW1lKCkgKyBNYXRoLnJhbmRvbSgpKVxuICAgICAgICAgICAgLnRvU3RyaW5nKDM2KS5yZXBsYWNlKCcuJywgJycpO1xuICAgIH1cbiAgIFxufVxuIiwibmFtZXNwYWNlIEZyYW1ld29yayB7XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIFNlZWRSYW5kb20ge1xuICAgICAgICBcbiAgICAgICAgc2VlZDogbnVtYmVyO1xuICAgICAgICBuZXh0U2VlZDogbnVtYmVyO1xuICAgICAgICBcbiAgICAgICAgY29uc3RydWN0b3Ioc2VlZDogbnVtYmVyID0gTWF0aC5yYW5kb20oKSl7XG4gICAgICAgICAgICB0aGlzLnNlZWQgPSB0aGlzLm5leHRTZWVkID0gc2VlZDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmFuZG9tKCk6IG51bWJlciB7XG4gICAgICAgICAgICBjb25zdCB4ID0gTWF0aC5zaW4odGhpcy5uZXh0U2VlZCAqIDIgKiBNYXRoLlBJKSAqIDEwMDAwO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geCAtIE1hdGguZmxvb3IoeCk7XG4gICAgICAgICAgICB0aGlzLm5leHRTZWVkID0gcmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn0iLCJcbm5hbWVzcGFjZSBUeXBlZENoYW5uZWwge1xuXG4gICAgLy8gLS0tIENvcmUgdHlwZXMgLS0tXG5cbiAgICB0eXBlIFNlcmlhbGl6YWJsZSA9IE9iamVjdCB8IEFycmF5PGFueT4gfCBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuIHwgRGF0ZSB8IHZvaWQ7XG5cbiAgICB0eXBlIFZhbHVlID0gbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiB8IERhdGU7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2U8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcbiAgICAgICAgdHlwZTogc3RyaW5nO1xuICAgICAgICBkYXRhPzogVERhdGE7XG4gICAgfVxuXG4gICAgdHlwZSBJU3ViamVjdDxUPiA9IFJ4Lk9ic2VydmVyPFQ+ICYgUnguT2JzZXJ2YWJsZTxUPjtcblxuICAgIGV4cG9ydCBjbGFzcyBDaGFubmVsVG9waWM8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcbiAgICAgICAgdHlwZTogc3RyaW5nO1xuICAgICAgICBjaGFubmVsOiBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj47XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hhbm5lbDogSVN1YmplY3Q8TWVzc2FnZTxURGF0YT4+LCB0eXBlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3Vic2NyaWJlKG9ic2VydmVyOiAobWVzc2FnZTogTWVzc2FnZTxURGF0YT4pID0+IHZvaWQpIHtcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgpLnN1YnNjcmliZShvYnNlcnZlcik7XG4gICAgICAgIH1cblxuICAgICAgICBzdWIob2JzZXJ2ZXI6IChkYXRhOiBURGF0YSkgPT4gdm9pZCkge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCkuc3Vic2NyaWJlKG0gPT4gb2JzZXJ2ZXIobS5kYXRhKSk7XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGF0Y2goZGF0YT86IFREYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwub25OZXh0KHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuZmlsdGVyKG0gPT4gbS50eXBlID09PSB0aGlzLnR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBvYnNlcnZlRGF0YSgpOiBSeC5PYnNlcnZhYmxlPFREYXRhPiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vYnNlcnZlKCkubWFwKG0gPT4gbS5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZm9yd2FyZChjaGFubmVsOiBDaGFubmVsVG9waWM8VERhdGE+KSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZShtID0+IGNoYW5uZWwuZGlzcGF0Y2gobS5kYXRhKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbCB7XG4gICAgICAgIHR5cGU6IHN0cmluZztcbiAgICAgICAgcHJpdmF0ZSBzdWJqZWN0OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHN1YmplY3Q/OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+LCB0eXBlPzogc3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnN1YmplY3QgPSBzdWJqZWN0IHx8IG5ldyBSeC5TdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4oKTtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIH1cblxuICAgICAgICBzdWJzY3JpYmUob25OZXh0PzogKHZhbHVlOiBNZXNzYWdlPFNlcmlhbGl6YWJsZT4pID0+IHZvaWQpOiBSeC5JRGlzcG9zYWJsZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LnN1YnNjcmliZShvbk5leHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgb2JzZXJ2ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b3BpYzxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4odHlwZTogc3RyaW5nKSA6IENoYW5uZWxUb3BpYzxURGF0YT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VERhdGE+KHRoaXMuc3ViamVjdCBhcyBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj4sXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID8gdGhpcy50eXBlICsgJy4nICsgdHlwZSA6IHR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBtZXJnZVR5cGVkPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiguLi50b3BpY3M6IENoYW5uZWxUb3BpYzxURGF0YT5bXSkgXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+IHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdG9waWNzLm1hcCh0ID0+IHQudHlwZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmZpbHRlcihtID0+IHR5cGVzLmluZGV4T2YobS50eXBlKSA+PSAwICkgYXMgUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhPj47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIG1lcmdlKC4uLnRvcGljczogQ2hhbm5lbFRvcGljPFNlcmlhbGl6YWJsZT5bXSkgXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxTZXJpYWxpemFibGU+PiB7XG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRvcGljcy5tYXAodCA9PiB0LnR5cGUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5maWx0ZXIobSA9PiB0eXBlcy5pbmRleE9mKG0udHlwZSkgPj0gMCApO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJuYW1lc3BhY2UgRnN0eC5GcmFtZXdvcmsge1xuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBXYXRlcm1hcmsge1xuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSBfcHJvamVjdDogcGFwZXIuUHJvamVjdDtcbiAgICAgICAgcHJpdmF0ZSBfbWFyazogcGFwZXIuQ29tcG91bmRQYXRoO1xuICAgICAgICBwcml2YXRlIF9zY2FsZUZhY3RvcjogbnVtYmVyO1xuICAgICAgICBcbiAgICAgICAgZ2V0IGl0ZW0oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFyaztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29uc3RydWN0b3IocHJvamVjdDogcGFwZXIuUHJvamVjdCwgcGF0aDogc3RyaW5nLCBzY2FsZUZhY3RvciA9IDAuMSl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3QgPSBwcm9qZWN0O1xuICAgICAgICAgICAgdGhpcy5fcHJvamVjdC5pbXBvcnRTVkcocGF0aCwgKGltcG9ydGVkOiBwYXBlci5JdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyayA9IDxwYXBlci5Db21wb3VuZFBhdGg+aW1wb3J0ZWQuZ2V0SXRlbSh7Y2xhc3M6IHBhcGVyLkNvbXBvdW5kUGF0aH0pO1xuICAgICAgICAgICAgICAgIGlmKCF0aGlzLl9tYXJrKXtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgbG9hZCBDb21wb3VuZFBhdGggZnJvbSAke3BhdGh9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX21hcmsucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlRmFjdG9yID0gc2NhbGVGYWN0b3I7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHBsYWNlSW50byhjb250YWluZXI6IHBhcGVyLkl0ZW0sIGJhY2tncm91bmRDb2xvcjogcGFwZXIuQ29sb3Ipe1xuICAgICAgICAgICAgY29uc3Qgd2F0ZXJtYXJrRGltID0gTWF0aC5zcXJ0KGNvbnRhaW5lci5ib3VuZHMuc2l6ZS53aWR0aCAqIGNvbnRhaW5lci5ib3VuZHMuc2l6ZS5oZWlnaHQpICogdGhpcy5fc2NhbGVGYWN0b3I7XG4gICAgICAgICAgICB0aGlzLl9tYXJrLmJvdW5kcy5zaXplID0gbmV3IHBhcGVyLlNpemUod2F0ZXJtYXJrRGltLCB3YXRlcm1hcmtEaW0pO1xuICAgICAgICAgICAgLy8ganVzdCBpbnNpZGUgbG93ZXIgcmlnaHRcbiAgICAgICAgICAgIHRoaXMuX21hcmsucG9zaXRpb24gPSBjb250YWluZXIuYm91bmRzLmJvdHRvbVJpZ2h0LnN1YnRyYWN0KHdhdGVybWFya0RpbSAvIDIgKyAxKTtcblxuICAgICAgICAgICAgaWYoYmFja2dyb3VuZENvbG9yLmxpZ2h0bmVzcyA+IDAuNCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5maWxsQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5vcGFjaXR5ID0gMC4wNTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5maWxsQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5vcGFjaXR5ID0gMC4yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGFpbmVyLmFkZENoaWxkKHRoaXMuX21hcmspO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZW1vdmUoKXtcbiAgICAgICAgICAgIHRoaXMuX21hcmsucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG59IiwiXG50eXBlIERpY3Rpb25hcnk8VD4gPSBfLkRpY3Rpb25hcnk8VD47XG4iLCJcbmNsYXNzIE9ic2VydmFibGVFdmVudDxUPiB7XG4gICAgXG4gICAgcHJpdmF0ZSBfc3Vic2NyaWJlcnM6ICgoZXZlbnRBcmc6IFQpID0+IHZvaWQpW10gPSBbXTtcblxuICAgIC8qKlxuICAgICAqIFN1YnNjcmliZSBmb3Igbm90aWZpY2F0aW9uLiBSZXR1cm5zIHVuc3Vic2NyaWJlIGZ1bmN0aW9uLlxuICAgICAqLyAgICBcbiAgICBzdWJzY3JpYmUoaGFuZGxlcjogKGV2ZW50QXJnOiBUKSA9PiB2b2lkKTogKCgpID0+IHZvaWQpIHtcbiAgICAgICAgaWYodGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyKSA8IDApe1xuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMucHVzaChoYW5kbGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCkgPT4gdGhpcy51bnN1YnNjcmliZShoYW5kbGVyKTtcbiAgICB9XG4gICAgXG4gICAgdW5zdWJzY3JpYmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCkge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGNhbGxiYWNrLCAwKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8VD4ge1xuICAgICAgICBsZXQgdW5zdWI6IGFueTtcbiAgICAgICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybjxUPihcbiAgICAgICAgICAgIChoYW5kbGVyVG9BZGQpID0+IHRoaXMuc3Vic2NyaWJlKDwoZXZlbnRBcmc6IFQpID0+IHZvaWQ+aGFuZGxlclRvQWRkKSxcbiAgICAgICAgICAgIChoYW5kbGVyVG9SZW1vdmUpID0+IHRoaXMudW5zdWJzY3JpYmUoPChldmVudEFyZzogVCkgPT4gdm9pZD5oYW5kbGVyVG9SZW1vdmUpXG4gICAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIFN1YnNjcmliZSBmb3Igb25lIG5vdGlmaWNhdGlvbi5cbiAgICAgKi9cbiAgICBzdWJzY3JpYmVPbmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCl7XG4gICAgICAgIGxldCB1bnN1YiA9IHRoaXMuc3Vic2NyaWJlKHQgPT4ge1xuICAgICAgICAgICAgdW5zdWIoKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKHQpOyAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgbm90aWZ5KGV2ZW50QXJnOiBUKXtcbiAgICAgICAgZm9yKGxldCBzdWJzY3JpYmVyIG9mIHRoaXMuX3N1YnNjcmliZXJzKXtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY2FsbCh0aGlzLCBldmVudEFyZyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgc3Vic2NyaWJlcnMuXG4gICAgICovXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XG4gICAgfVxufSIsIlxuZGVjbGFyZSB0eXBlIEdBRXZlbnQgPSB7XG4gIGV2ZW50Q2F0ZWdvcnk/OiBzdHJpbmcsXG4gIGV2ZW50QWN0aW9uPzogc3RyaW5nLFxuICBldmVudExhYmVsPzogc3RyaW5nXG4gIGV2ZW50VmFsdWU/OiBudW1iZXJcbn1cblxuZGVjbGFyZSBmdW5jdGlvbiBnYShjb21tYW5kOiBzdHJpbmcsIGhpdFR5cGU6IHN0cmluZywgZXZlbnQ6IEdBRXZlbnQpXG5cbmZ1bmN0aW9uIGdhRXZlbnQoZXZlbnQ6IEdBRXZlbnQpe1xuICAgIGdhKFwic2VuZFwiLCBcImV2ZW50XCIsIGV2ZW50KTtcbn1cbiIsIlxubmFtZXNwYWNlIEJvb3RTY3JpcHQge1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBNZW51SXRlbSB7XG4gICAgICAgIGNvbnRlbnQ6IGFueSxcbiAgICAgICAgb3B0aW9ucz86IE9iamVjdFxuICAgICAgICAvL29uQ2xpY2s/OiAoKSA9PiB2b2lkXG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRyb3Bkb3duKFxuICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICAgICAgY29udGVudDogYW55LFxuICAgICAgICAgICAgaXRlbXM6IE1lbnVJdGVtW11cbiAgICAgICAgfSk6IFZOb2RlIHtcblxuICAgICAgICByZXR1cm4gaChcImRpdi5kcm9wZG93blwiLCBbXG4gICAgICAgICAgICBoKFwiYnV0dG9uLmJ0bi5idG4tZGVmYXVsdC5kcm9wZG93bi10b2dnbGVcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiYXR0cnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFyZ3MuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLXRvZ2dsZVwiOiBcImRyb3Bkb3duXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MuY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgaChcInNwYW4uY2FyZXRcIilcbiAgICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIGgoXCJ1bC5kcm9wZG93bi1tZW51XCIsXG4gICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgYXJncy5pdGVtcy5tYXAoaXRlbSA9PlxuICAgICAgICAgICAgICAgICAgICBoKFwibGlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaCgnYScsIGl0ZW0ub3B0aW9ucyB8fCB7fSwgW2l0ZW0uY29udGVudF0pXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIF0pO1xuXG4gICAgfVxufVxuIiwiXG50eXBlIEl0ZW1DaGFuZ2VIYW5kbGVyID0gKGZsYWdzOiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnKSA9PiB2b2lkXG50eXBlIENhbGxiYWNrID0gKCkgPT4gdm9pZFxuXG5kZWNsYXJlIG1vZHVsZSBwYXBlciB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBJdGVtIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN1YnNjcmliZSB0byBhbGwgY2hhbmdlcyBpbiBpdGVtLiBSZXR1cm5zIHVuLXN1YnNjcmliZSBmdW5jdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHN1YnNjcmliZShoYW5kbGVyOiBJdGVtQ2hhbmdlSGFuZGxlcik6IENhbGxiYWNrXG5cbiAgICAgICAgX2NoYW5nZWQoZmxhZ3M6IFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcpOiB2b2lkXG4gICAgfVxufVxuXG5uYW1lc3BhY2UgUGFwZXJOb3RpZnkge1xuXG4gICAgZXhwb3J0IGVudW0gQ2hhbmdlRmxhZyB7XG4gICAgICAgIC8vIEFueXRoaW5nIGFmZmVjdGluZyB0aGUgYXBwZWFyYW5jZSBvZiBhbiBpdGVtLCBpbmNsdWRpbmcgR0VPTUVUUlksXG4gICAgICAgIC8vIFNUUk9LRSwgU1RZTEUgYW5kIEFUVFJJQlVURSAoZXhjZXB0IGZvciB0aGUgaW52aXNpYmxlIG9uZXM6IGxvY2tlZCwgbmFtZSlcbiAgICAgICAgQVBQRUFSQU5DRSA9IDB4MSxcbiAgICAgICAgLy8gQSBjaGFuZ2UgaW4gdGhlIGl0ZW0ncyBjaGlsZHJlblxuICAgICAgICBDSElMRFJFTiA9IDB4MixcbiAgICAgICAgLy8gQSBjaGFuZ2Ugb2YgdGhlIGl0ZW0ncyBwbGFjZSBpbiB0aGUgc2NlbmUgZ3JhcGggKHJlbW92ZWQsIGluc2VydGVkLFxuICAgICAgICAvLyBtb3ZlZCkuXG4gICAgICAgIElOU0VSVElPTiA9IDB4NCxcbiAgICAgICAgLy8gSXRlbSBnZW9tZXRyeSAocGF0aCwgYm91bmRzKVxuICAgICAgICBHRU9NRVRSWSA9IDB4OCxcbiAgICAgICAgLy8gT25seSBzZWdtZW50KHMpIGhhdmUgY2hhbmdlZCwgYW5kIGFmZmVjdGVkIGN1cnZlcyBoYXZlIGFscmVhZHkgYmVlblxuICAgICAgICAvLyBub3RpZmllZC4gVGhpcyBpcyB0byBpbXBsZW1lbnQgYW4gb3B0aW1pemF0aW9uIGluIF9jaGFuZ2VkKCkgY2FsbHMuXG4gICAgICAgIFNFR01FTlRTID0gMHgxMCxcbiAgICAgICAgLy8gU3Ryb2tlIGdlb21ldHJ5IChleGNsdWRpbmcgY29sb3IpXG4gICAgICAgIFNUUk9LRSA9IDB4MjAsXG4gICAgICAgIC8vIEZpbGwgc3R5bGUgb3Igc3Ryb2tlIGNvbG9yIC8gZGFzaFxuICAgICAgICBTVFlMRSA9IDB4NDAsXG4gICAgICAgIC8vIEl0ZW0gYXR0cmlidXRlczogdmlzaWJsZSwgYmxlbmRNb2RlLCBsb2NrZWQsIG5hbWUsIG9wYWNpdHksIGNsaXBNYXNrIC4uLlxuICAgICAgICBBVFRSSUJVVEUgPSAweDgwLFxuICAgICAgICAvLyBUZXh0IGNvbnRlbnRcbiAgICAgICAgQ09OVEVOVCA9IDB4MTAwLFxuICAgICAgICAvLyBSYXN0ZXIgcGl4ZWxzXG4gICAgICAgIFBJWEVMUyA9IDB4MjAwLFxuICAgICAgICAvLyBDbGlwcGluZyBpbiBvbmUgb2YgdGhlIGNoaWxkIGl0ZW1zXG4gICAgICAgIENMSVBQSU5HID0gMHg0MDAsXG4gICAgICAgIC8vIFRoZSB2aWV3IGhhcyBiZWVuIHRyYW5zZm9ybWVkXG4gICAgICAgIFZJRVcgPSAweDgwMFxuICAgIH1cblxuICAgIC8vIFNob3J0Y3V0cyB0byBvZnRlbiB1c2VkIENoYW5nZUZsYWcgdmFsdWVzIGluY2x1ZGluZyBBUFBFQVJBTkNFXG4gICAgZXhwb3J0IGVudW0gQ2hhbmdlcyB7XG4gICAgICAgIC8vIENISUxEUkVOIGFsc28gY2hhbmdlcyBHRU9NRVRSWSwgc2luY2UgcmVtb3ZpbmcgY2hpbGRyZW4gZnJvbSBncm91cHNcbiAgICAgICAgLy8gY2hhbmdlcyBib3VuZHMuXG4gICAgICAgIENISUxEUkVOID0gQ2hhbmdlRmxhZy5DSElMRFJFTiB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXG4gICAgICAgIC8vIENoYW5naW5nIHRoZSBpbnNlcnRpb24gY2FuIGNoYW5nZSB0aGUgYXBwZWFyYW5jZSB0aHJvdWdoIHBhcmVudCdzIG1hdHJpeC5cbiAgICAgICAgSU5TRVJUSU9OID0gQ2hhbmdlRmxhZy5JTlNFUlRJT04gfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXG4gICAgICAgIEdFT01FVFJZID0gQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcbiAgICAgICAgU0VHTUVOVFMgPSBDaGFuZ2VGbGFnLlNFR01FTlRTIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcbiAgICAgICAgU1RST0tFID0gQ2hhbmdlRmxhZy5TVFJPS0UgfCBDaGFuZ2VGbGFnLlNUWUxFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxuICAgICAgICBTVFlMRSA9IENoYW5nZUZsYWcuU1RZTEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXG4gICAgICAgIEFUVFJJQlVURSA9IENoYW5nZUZsYWcuQVRUUklCVVRFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxuICAgICAgICBDT05URU5UID0gQ2hhbmdlRmxhZy5DT05URU5UIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcbiAgICAgICAgUElYRUxTID0gQ2hhbmdlRmxhZy5QSVhFTFMgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXG4gICAgICAgIFZJRVcgPSBDaGFuZ2VGbGFnLlZJRVcgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0VcbiAgICB9O1xuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG5cbiAgICAgICAgLy8gSW5qZWN0IEl0ZW0uc3Vic2NyaWJlXG4gICAgICAgIGNvbnN0IGl0ZW1Qcm90byA9ICg8YW55PnBhcGVyKS5JdGVtLnByb3RvdHlwZVxuICAgICAgICBpdGVtUHJvdG8uc3Vic2NyaWJlID0gZnVuY3Rpb24gKGhhbmRsZXI6IEl0ZW1DaGFuZ2VIYW5kbGVyKTogQ2FsbGJhY2sge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9zdWJzY3JpYmVycykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzID0gW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGhhbmRsZXIpIDwgMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnB1c2goaGFuZGxlcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyLCAwKVxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXcmFwIEl0ZW0ucmVtb3ZlXG4gICAgICAgIGNvbnN0IGl0ZW1SZW1vdmUgPSBpdGVtUHJvdG8ucmVtb3ZlXG4gICAgICAgIGl0ZW1Qcm90by5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpdGVtUmVtb3ZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzID0gbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gV3JhcCBQcm9qZWN0Ll9jaGFuZ2VkXG4gICAgICAgIGNvbnN0IHByb2plY3RQcm90byA9IDxhbnk+cGFwZXIuUHJvamVjdC5wcm90b3R5cGVcbiAgICAgICAgY29uc3QgcHJvamVjdENoYW5nZWQgPSBwcm9qZWN0UHJvdG8uX2NoYW5nZWRcbiAgICAgICAgcHJvamVjdFByb3RvLl9jaGFuZ2VkID0gZnVuY3Rpb24gKGZsYWdzOiBDaGFuZ2VGbGFnLCBpdGVtOiBwYXBlci5JdGVtKSB7XG4gICAgICAgICAgICBwcm9qZWN0Q2hhbmdlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1YnMgPSAoPGFueT5pdGVtKS5fc3Vic2NyaWJlcnNcbiAgICAgICAgICAgICAgICBpZiAoc3Vicykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBzIG9mIHN1YnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMuY2FsbChpdGVtLCBmbGFncylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZShmbGFnczogQ2hhbmdlRmxhZykge1xuICAgICAgICBsZXQgZmxhZ0xpc3Q6IHN0cmluZ1tdID0gW11cbiAgICAgICAgXy5mb3JPd24oQ2hhbmdlRmxhZywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIGlmICgodHlwZW9mIHZhbHVlKSA9PT0gXCJudW1iZXJcIiAmJiAoKHZhbHVlIGFzIG51bWJlcikgJiBmbGFncykpIHtcbiAgICAgICAgICAgICAgICBmbGFnTGlzdC5wdXNoKGtleSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGZsYWdMaXN0LmpvaW4oJyB8ICcpXG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmUoaXRlbTogcGFwZXIuSXRlbSwgZmxhZ3M6IENoYW5nZUZsYWcpOlxuICAgICAgICBSeC5PYnNlcnZhYmxlPENoYW5nZUZsYWc+IHtcbiAgICAgICAgbGV0IHVuc3ViOiAoKSA9PiB2b2lkXG4gICAgICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm48Q2hhbmdlRmxhZz4oXG4gICAgICAgICAgICBhZGRIYW5kbGVyID0+IHtcbiAgICAgICAgICAgICAgICB1bnN1YiA9IGl0ZW0uc3Vic2NyaWJlKGYgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZiAmIGZsYWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRIYW5kbGVyKGYpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW92ZUhhbmRsZXIgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh1bnN1Yikge1xuICAgICAgICAgICAgICAgICAgICB1bnN1YigpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICB9XG5cbn1cblxuUGFwZXJOb3RpZnkuaW5pdGlhbGl6ZSgpXG4iLCJkZWNsYXJlIG1vZHVsZSBwYXBlciB7XG4gICAgaW50ZXJmYWNlIFZpZXcge1xuICAgICAgICAvKipcbiAgICAgICAgICogSW50ZXJuYWwgbWV0aG9kIGZvciBpbml0aWF0aW5nIG1vdXNlIGV2ZW50cyBvbiB2aWV3LlxuICAgICAgICAgKi9cbiAgICAgICAgZW1pdE1vdXNlRXZlbnRzKHZpZXc6IHBhcGVyLlZpZXcsIGl0ZW06IHBhcGVyLkl0ZW0sIHR5cGU6IHN0cmluZyxcbiAgICAgICAgICAgIGV2ZW50OiBhbnksIHBvaW50OiBwYXBlci5Qb2ludCwgcHJldlBvaW50OiBwYXBlci5Qb2ludCk7XG4gICAgfVxufVxuXG5uYW1lc3BhY2UgcGFwZXJFeHQge1xuXG4gICAgZXhwb3J0IGNsYXNzIFZpZXdab29tIHtcblxuICAgICAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xuICAgICAgICBmYWN0b3IgPSAxLjE7XG5cbiAgICAgICAgcHJpdmF0ZSBfbWluWm9vbTogbnVtYmVyO1xuICAgICAgICBwcml2YXRlIF9tYXhab29tOiBudW1iZXI7XG4gICAgICAgIHByaXZhdGUgX21vdXNlTmF0aXZlU3RhcnQ6IHBhcGVyLlBvaW50O1xuICAgICAgICBwcml2YXRlIF92aWV3Q2VudGVyU3RhcnQ6IHBhcGVyLlBvaW50O1xuICAgICAgICBwcml2YXRlIF92aWV3Q2hhbmdlZCA9IG5ldyBPYnNlcnZhYmxlRXZlbnQ8cGFwZXIuUmVjdGFuZ2xlPigpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByb2plY3Q6IHBhcGVyLlByb2plY3QsXG4gICAgICAgICAgICBnZXRCYWNrZ3JvdW5kSXRlbXM/OiAoKSA9PiBwYXBlci5JdGVtW10pIHtcbiAgICAgICAgICAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XG5cbiAgICAgICAgICAgICg8YW55PiQodGhpcy5wcm9qZWN0LnZpZXcuZWxlbWVudCkpLm1vdXNld2hlZWwoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludChldmVudC5vZmZzZXRYLCBldmVudC5vZmZzZXRZKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVpvb21DZW50ZXJlZChldmVudC5kZWx0YVksIG1vdXNlUG9zaXRpb24pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBkaWREcmFnID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMucHJvamVjdC52aWV3Lm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XG4gICAgICAgICAgICAgICAgY29uc3QgaGl0ID0gcHJvamVjdC5oaXRUZXN0KGV2LnBvaW50KTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX3ZpZXdDZW50ZXJTdGFydCkgeyAgLy8gbm90IGFscmVhZHkgZHJhZ2dpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhpdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFja2dyb3VuZEl0ZW1zID0gKGdldEJhY2tncm91bmRJdGVtcyAmJiBnZXRCYWNrZ3JvdW5kSXRlbXMoKSkgfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBoaXQgaXMgb24gbm90aGluZyBvciBvbiBhIG5vbi1iYWNrZ3JvdW5kIGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFoaXQuaXRlbSB8fCAhYmFja2dyb3VuZEl0ZW1zLnNvbWUoYmkgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmkgJiYgKGJpID09PSBoaXQuaXRlbSB8fCBiaS5pc0FuY2VzdG9yKGhpdC5pdGVtKSkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBkb24ndCB1c2UgZHJhZ2dpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2VudGVyU3RhcnQgPSB2aWV3LmNlbnRlcjtcbiAgICAgICAgICAgICAgICAgICAgLy8gSGF2ZSB0byB1c2UgbmF0aXZlIG1vdXNlIG9mZnNldCwgYmVjYXVzZSBldi5kZWx0YSBcbiAgICAgICAgICAgICAgICAgICAgLy8gIGNoYW5nZXMgYXMgdGhlIHZpZXcgaXMgc2Nyb2xsZWQuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQgPSBuZXcgcGFwZXIuUG9pbnQoZXYuZXZlbnQub2Zmc2V0WCwgZXYuZXZlbnQub2Zmc2V0WSk7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYXRpdmVEZWx0YSA9IG5ldyBwYXBlci5Qb2ludChcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2LmV2ZW50Lm9mZnNldFggLSB0aGlzLl9tb3VzZU5hdGl2ZVN0YXJ0LngsXG4gICAgICAgICAgICAgICAgICAgICAgICBldi5ldmVudC5vZmZzZXRZIC0gdGhpcy5fbW91c2VOYXRpdmVTdGFydC55XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1vdmUgaW50byB2aWV3IGNvb3JkaW5hdGVzIHRvIHN1YnJhY3QgZGVsdGEsXG4gICAgICAgICAgICAgICAgICAgIC8vICB0aGVuIGJhY2sgaW50byBwcm9qZWN0IGNvb3Jkcy5cbiAgICAgICAgICAgICAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LnZpZXdUb1Byb2plY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnByb2plY3RUb1ZpZXcodGhpcy5fdmlld0NlbnRlclN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChuYXRpdmVEZWx0YSkpO1xuICAgICAgICAgICAgICAgICAgICBkaWREcmFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0LnZpZXcub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlVXAsIGV2ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21vdXNlTmF0aXZlU3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDZW50ZXJTdGFydCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnRW5kLCBldik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaWREcmFnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlkRHJhZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdmlld0NoYW5nZWQoKTogT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlJlY3RhbmdsZT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdDaGFuZ2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHpvb20oKTogbnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2plY3Qudmlldy56b29tO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHpvb21SYW5nZSgpOiBudW1iZXJbXSB7XG4gICAgICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0Wm9vbVJhbmdlKHJhbmdlOiBwYXBlci5TaXplW10pOiBudW1iZXJbXSB7XG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XG4gICAgICAgICAgICBjb25zdCBhU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XG4gICAgICAgICAgICBjb25zdCBiU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XG4gICAgICAgICAgICBjb25zdCBhID0gYVNpemUgJiYgTWF0aC5taW4oXG4gICAgICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYVNpemUuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYVNpemUud2lkdGgpO1xuICAgICAgICAgICAgY29uc3QgYiA9IGJTaXplICYmIE1hdGgubWluKFxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIGJTaXplLmhlaWdodCxcbiAgICAgICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGJTaXplLndpZHRoKTtcbiAgICAgICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKGEsIGIpO1xuICAgICAgICAgICAgaWYgKG1pbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX21pblpvb20gPSBtaW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heChhLCBiKTtcbiAgICAgICAgICAgIGlmIChtYXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXhab29tID0gbWF4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFt0aGlzLl9taW5ab29tLCB0aGlzLl9tYXhab29tXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHpvb21UbyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpIHtcbiAgICAgICAgICAgIGlmKHJlY3QuaXNFbXB0eSgpIHx8IHJlY3Qud2lkdGggPT09IDAgfHwgcmVjdC5oZWlnaHQgPT09IDApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInNraXBwaW5nIHpvb20gdG9cIiwgcmVjdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xuICAgICAgICAgICAgdmlldy5jZW50ZXIgPSByZWN0LmNlbnRlcjtcbiAgICAgICAgICAgIGNvbnN0IHpvb21MZXZlbCA9IE1hdGgubWluKFxuICAgICAgICAgICAgICAgIHZpZXcudmlld1NpemUuaGVpZ2h0IC8gcmVjdC5oZWlnaHQsXG4gICAgICAgICAgICAgICAgdmlldy52aWV3U2l6ZS53aWR0aCAvIHJlY3Qud2lkdGgpO1xuICAgICAgICAgICAgdmlldy56b29tID0gem9vbUxldmVsO1xuICAgICAgICAgICAgdGhpcy5fdmlld0NoYW5nZWQubm90aWZ5KHZpZXcuYm91bmRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoYW5nZVpvb21DZW50ZXJlZChkZWx0YTogbnVtYmVyLCBtb3VzZVBvczogcGFwZXIuUG9pbnQpIHtcbiAgICAgICAgICAgIGlmICghZGVsdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XG4gICAgICAgICAgICBjb25zdCBvbGRab29tID0gdmlldy56b29tO1xuICAgICAgICAgICAgY29uc3Qgb2xkQ2VudGVyID0gdmlldy5jZW50ZXI7XG4gICAgICAgICAgICBjb25zdCB2aWV3UG9zID0gdmlldy52aWV3VG9Qcm9qZWN0KG1vdXNlUG9zKTtcblxuICAgICAgICAgICAgbGV0IG5ld1pvb20gPSBkZWx0YSA+IDBcbiAgICAgICAgICAgICAgICA/IHZpZXcuem9vbSAqIHRoaXMuZmFjdG9yXG4gICAgICAgICAgICAgICAgOiB2aWV3Lnpvb20gLyB0aGlzLmZhY3RvcjtcbiAgICAgICAgICAgIG5ld1pvb20gPSB0aGlzLnNldFpvb21Db25zdHJhaW5lZChuZXdab29tKTtcblxuICAgICAgICAgICAgaWYgKCFuZXdab29tKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB6b29tU2NhbGUgPSBvbGRab29tIC8gbmV3Wm9vbTtcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlckFkanVzdCA9IHZpZXdQb3Muc3VidHJhY3Qob2xkQ2VudGVyKTtcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHZpZXdQb3Muc3VidHJhY3QoY2VudGVyQWRqdXN0Lm11bHRpcGx5KHpvb21TY2FsZSkpXG4gICAgICAgICAgICAgICAgLnN1YnRyYWN0KG9sZENlbnRlcik7XG5cbiAgICAgICAgICAgIHZpZXcuY2VudGVyID0gdmlldy5jZW50ZXIuYWRkKG9mZnNldCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3ZpZXdDaGFuZ2VkLm5vdGlmeSh2aWV3LmJvdW5kcyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB6b29tIGxldmVsLlxuICAgICAgICAgKiBAcmV0dXJucyB6b29tIGxldmVsIHRoYXQgd2FzIHNldCwgb3IgbnVsbCBpZiBpdCB3YXMgbm90IGNoYW5nZWRcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgc2V0Wm9vbUNvbnN0cmFpbmVkKHpvb206IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbWluWm9vbSkge1xuICAgICAgICAgICAgICAgIHpvb20gPSBNYXRoLm1heCh6b29tLCB0aGlzLl9taW5ab29tKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXhab29tKSB7XG4gICAgICAgICAgICAgICAgem9vbSA9IE1hdGgubWluKHpvb20sIHRoaXMuX21heFpvb20pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xuICAgICAgICAgICAgaWYgKHpvb20gIT0gdmlldy56b29tKSB7XG4gICAgICAgICAgICAgICAgdmlldy56b29tID0gem9vbTtcbiAgICAgICAgICAgICAgICByZXR1cm4gem9vbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIHBhcGVyRXh0IHtcbiAgICBcbiAgICAvKipcbiAgICAgKiBVc2Ugb2YgdGhlc2UgZXZlbnRzIHJlcXVpcmVzIGZpcnN0IGNhbGxpbmcgZXh0ZW5kTW91c2VFdmVudHNcbiAgICAgKiAgIG9uIHRoZSBpdGVtLiBcbiAgICAgKi9cbiAgICBleHBvcnQgdmFyIEV2ZW50VHlwZSA9IHtcbiAgICAgICAgbW91c2VEcmFnU3RhcnQ6IFwibW91c2VEcmFnU3RhcnRcIixcbiAgICAgICAgbW91c2VEcmFnRW5kOiBcIm1vdXNlRHJhZ0VuZFwiXG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZE1vdXNlRXZlbnRzKGl0ZW06IHBhcGVyLkl0ZW0pe1xuICAgICAgICBcbiAgICAgICAgbGV0IGRyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcbiAgICAgICAgICAgIGlmKCFkcmFnZ2luZyl7XG4gICAgICAgICAgICAgICAgZHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGl0ZW0uZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZVVwLCBldiA9PiB7XG4gICAgICAgICAgICBpZihkcmFnZ2luZyl7XG4gICAgICAgICAgICAgICAgZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ0VuZCwgZXYpO1xuICAgICAgICAgICAgICAgIC8vIHByZXZlbnQgY2xpY2tcbiAgICAgICAgICAgICAgICBldi5zdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9XG59IiwiXG5tb2R1bGUgcGFwZXIge1xuXG4gICAgZXhwb3J0IHZhciBFdmVudFR5cGUgPSB7XG4gICAgICAgIGZyYW1lOiBcImZyYW1lXCIsXG4gICAgICAgIG1vdXNlRG93bjogXCJtb3VzZWRvd25cIixcbiAgICAgICAgbW91c2VVcDogXCJtb3VzZXVwXCIsXG4gICAgICAgIG1vdXNlRHJhZzogXCJtb3VzZWRyYWdcIixcbiAgICAgICAgY2xpY2s6IFwiY2xpY2tcIixcbiAgICAgICAgZG91YmxlQ2xpY2s6IFwiZG91YmxlY2xpY2tcIixcbiAgICAgICAgbW91c2VNb3ZlOiBcIm1vdXNlbW92ZVwiLFxuICAgICAgICBtb3VzZUVudGVyOiBcIm1vdXNlZW50ZXJcIixcbiAgICAgICAgbW91c2VMZWF2ZTogXCJtb3VzZWxlYXZlXCIsXG4gICAgICAgIGtleXVwOiBcImtleXVwXCIsXG4gICAgICAgIGtleWRvd246IFwia2V5ZG93blwiXG4gICAgfVxuXG59IiwiXG5hYnN0cmFjdCBjbGFzcyBDb21wb25lbnQ8VD4ge1xuICAgIGFic3RyYWN0IHJlbmRlcihkYXRhOiBUKTogVk5vZGU7XG59IiwiXG5pbnRlcmZhY2UgUmVhY3RpdmVEb21Db21wb25lbnQge1xuICAgIGRvbSQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+O1xufVxuXG5uYW1lc3BhY2UgVkRvbUhlbHBlcnMge1xuICAgIGV4cG9ydCBmdW5jdGlvbiByZW5kZXJBc0NoaWxkKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHZub2RlOiBWTm9kZSkge1xuICAgICAgICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnN0IHBhdGNoZWQgPSBwYXRjaChjaGlsZCwgdm5vZGUpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGF0Y2hlZC5lbG0pO1xuICAgIH1cbn1cblxuY2xhc3MgUmVhY3RpdmVEb20ge1xuXG4gICAgLyoqXG4gICAgICogUmVuZGVyIGEgcmVhY3RpdmUgY29tcG9uZW50IHdpdGhpbiBjb250YWluZXIuXG4gICAgICovXG4gICAgc3RhdGljIHJlbmRlclN0cmVhbShcbiAgICAgICAgZG9tJDogUnguT2JzZXJ2YWJsZTxWTm9kZT4sXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnRcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XG4gICAgICAgIGNvbnN0IGlkID0gY29udGFpbmVyLmlkO1xuICAgICAgICBsZXQgY3VycmVudDogSFRNTEVsZW1lbnQgfCBWTm9kZSA9IGNvbnRhaW5lcjtcbiAgICAgICAgY29uc3Qgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xuICAgICAgICBkb20kLnN1YnNjcmliZShkb20gPT4ge1xuICAgICAgICAgICAgaWYgKCFkb20pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5yZW1vdmVFbXB0eU5vZGVzKGRvbSk7XG4gICAgICAgICAgICBsZXQgcGF0Y2hlZDogVk5vZGU7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHBhdGNoZWQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciBwYXRjaGluZyBkb21cIiwge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50LFxuICAgICAgICAgICAgICAgICAgICBkb20sXG4gICAgICAgICAgICAgICAgICAgIGVyclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZCAmJiAhcGF0Y2hlZC5lbG0uaWQpIHtcbiAgICAgICAgICAgICAgICAvLyByZXRhaW4gSURcbiAgICAgICAgICAgICAgICBwYXRjaGVkLmVsbS5pZCA9IGlkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2hlZDtcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzaW5rO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlY3Vyc2l2ZWx5IHJlbW92ZSBlbXB0eSBjaGlsZHJlbiBmcm9tIHRyZWUuXG4gICAgICovXG4gICAgc3RhdGljIHJlbW92ZUVtcHR5Tm9kZXMobm9kZTogVk5vZGUpIHtcbiAgICAgICAgaWYoIW5vZGUuY2hpbGRyZW4gfHwgIW5vZGUuY2hpbGRyZW4ubGVuZ3RoKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub3RFbXB0eSA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKGMgPT4gISFjKTtcbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoICE9IG5vdEVtcHR5Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwicmVtb3ZlZCBlbXB0eSBjaGlsZHJlbiBmcm9tXCIsIG5vZGUuY2hpbGRyZW4pO1xuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG5vdEVtcHR5O1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVFbXB0eU5vZGVzKGNoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbmRlciBhIHJlYWN0aXZlIGNvbXBvbmVudCB3aXRoaW4gY29udGFpbmVyLlxuICAgICAqL1xuICAgIHN0YXRpYyByZW5kZXJDb21wb25lbnQoXG4gICAgICAgIGNvbXBvbmVudDogUmVhY3RpdmVEb21Db21wb25lbnQsXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZVxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjb250YWluZXI7XG4gICAgICAgIGxldCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XG4gICAgICAgIGNvbXBvbmVudC5kb20kLnN1YnNjcmliZShkb20gPT4ge1xuICAgICAgICAgICAgaWYgKCFkb20pIHJldHVybjtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHNpbms7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVuZGVyIHdpdGhpbiBjb250YWluZXIgd2hlbmV2ZXIgc291cmNlIGNoYW5nZXMuXG4gICAgICovXG4gICAgc3RhdGljIGxpdmVSZW5kZXI8VD4oXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZSxcbiAgICAgICAgc291cmNlOiBSeC5PYnNlcnZhYmxlPFQ+LFxuICAgICAgICByZW5kZXI6IChuZXh0OiBUKSA9PiBWTm9kZVxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjb250YWluZXI7XG4gICAgICAgIGxldCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IHJlbmRlcihkYXRhKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkgcmV0dXJuO1xuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoKGN1cnJlbnQsIG5vZGUpO1xuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHNpbms7XG4gICAgfVxuXG59IiwiXG5uYW1lc3BhY2UgQXBwIHtcblxuICAgIGV4cG9ydCBjbGFzcyBBcHBDb29raWVzIHtcblxuICAgICAgICBzdGF0aWMgWUVBUiA9IDM2NTtcbiAgICAgICAgc3RhdGljIEJST1dTRVJfSURfS0VZID0gXCJicm93c2VySWRcIjtcbiAgICAgICAgc3RhdGljIExBU1RfU0FWRURfU0tFVENIX0lEX0tFWSA9IFwibGFzdFNhdmVkU2tldGNoSWRcIjtcblxuICAgICAgICBnZXQgbGFzdFNhdmVkU2tldGNoSWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29va2llcy5nZXQoQXBwQ29va2llcy5MQVNUX1NBVkVEX1NLRVRDSF9JRF9LRVkpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGxhc3RTYXZlZFNrZXRjaElkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIENvb2tpZXMuc2V0KEFwcENvb2tpZXMuTEFTVF9TQVZFRF9TS0VUQ0hfSURfS0VZLCB2YWx1ZSwgeyBleHBpcmVzOiBBcHBDb29raWVzLllFQVIgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgYnJvd3NlcklkKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXMuZ2V0KEFwcENvb2tpZXMuQlJPV1NFUl9JRF9LRVkpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGJyb3dzZXJJZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgICAgICBDb29raWVzLnNldChBcHBDb29raWVzLkJST1dTRVJfSURfS0VZLCB2YWx1ZSwgeyBleHBpcmVzOiBBcHBDb29raWVzLllFQVIgfSk7XG4gICAgICAgIH1cblxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBBcHAge1xuXG4gICAgZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7XG5cbiAgICAgICAgc3RvcmU6IFN0b3JlO1xuICAgICAgICBlZGl0b3JNb2R1bGU6IFNrZXRjaEVkaXRvci5Ta2V0Y2hFZGl0b3JNb2R1bGU7XG4gICAgICAgIFxuICAgICAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNob3VsZExvZ0luZm8gPSBmYWxzZTsgICAgICAgXG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yTW9kdWxlID0gbmV3IFNrZXRjaEVkaXRvci5Ta2V0Y2hFZGl0b3JNb2R1bGUodGhpcy5zdG9yZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHN0YXJ0KCkgeyAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmVkaXRvck1vZHVsZS5zdGFydCgpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgYXBwOiBBcHAuQXBwTW9kdWxlO1xufSIsIlxubmFtZXNwYWNlIEFwcCB7XG5cbiAgICBleHBvcnQgY2xhc3MgQXBwUm91dGVyIGV4dGVuZHMgUm91dGVyNSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihbXG4gICAgICAgICAgICAgICAgbmV3IFJvdXRlTm9kZShcImhvbWVcIiwgXCIvXCIpLFxuICAgICAgICAgICAgICAgIG5ldyBSb3V0ZU5vZGUoXCJza2V0Y2hcIiwgXCIvc2tldGNoLzpza2V0Y2hJZFwiKSwgLy8gPFthLWZBLUYwLTldezE0fT5cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB1c2VIYXNoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFJvdXRlOiBcImhvbWVcIlxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvL3RoaXMudXNlUGx1Z2luKGxvZ2dlclBsdWdpbigpKVxuICAgICAgICAgICAgdGhpcy51c2VQbHVnaW4obGlzdGVuZXJzUGx1Z2luLmRlZmF1bHQoKSlcbiAgICAgICAgICAgICAgICAudXNlUGx1Z2luKGhpc3RvcnlQbHVnaW4uZGVmYXVsdCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvU2tldGNoRWRpdG9yKHNrZXRjaElkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGUoXCJza2V0Y2hcIiwgeyBza2V0Y2hJZDogc2tldGNoSWQgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgc3RhdGUoKSB7XG4gICAgICAgICAgICAvLyBjb3VsZCBkbyByb3V0ZSB2YWxpZGF0aW9uIHNvbWV3aGVyZVxuICAgICAgICAgICAgcmV0dXJuIDxBcHBSb3V0ZVN0YXRlPjxhbnk+dGhpcy5nZXRTdGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBBcHBSb3V0ZVN0YXRlIHtcbiAgICAgICAgbmFtZTogXCJob21lXCJ8XCJza2V0Y2hcIixcbiAgICAgICAgcGFyYW1zPzoge1xuICAgICAgICAgICAgc2tldGNoSWQ/OiBzdHJpbmdcbiAgICAgICAgfSxcbiAgICAgICAgcGF0aD86IHN0cmluZ1xuICAgIH1cblxufSIsIlxubmFtZXNwYWNlIEFwcCB7XG5cbiAgICBleHBvcnQgY2xhc3MgU3RvcmUge1xuXG4gICAgICAgIHN0YXRlOiBBcHBTdGF0ZTtcbiAgICAgICAgYWN0aW9uczogQWN0aW9ucztcbiAgICAgICAgZXZlbnRzOiBFdmVudHM7XG5cbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IEFwcFJvdXRlcjtcbiAgICAgICAgcHJpdmF0ZSBjb29raWVzOiBBcHBDb29raWVzO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXIgPSBuZXcgQXBwUm91dGVyKCk7XG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMgPSBuZXcgQWN0aW9ucygpO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMgPSBuZXcgQXBwQ29va2llcygpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Um91dGVyKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRTdGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5pbml0QWN0aW9uSGFuZGxlcnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRTdGF0ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBuZXcgQXBwU3RhdGUodGhpcy5jb29raWVzLCB0aGlzLnJvdXRlcik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGluaXRBY3Rpb25IYW5kbGVycygpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5lZGl0b3JMb2FkZWRTa2V0Y2guc3ViKHNrZXRjaElkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcInNrZXRjaFwiLCB7IHNrZXRjaElkIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5lZGl0b3JTYXZlZFNrZXRjaC5zdWIoaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29va2llcy5sYXN0U2F2ZWRTa2V0Y2hJZCA9IGlkO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc3RhcnRSb3V0ZXIoKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlci5zdGFydCgoZXJyLCBzdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnJvdXRlQ2hhbmdlZC5kaXNwYXRjaChzdGF0ZSk7IFxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwicm91dGVyIGVycm9yXCIsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwiaG9tZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEFwcFN0YXRlIHtcbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgY29va2llczogQXBwQ29va2llcztcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IEFwcFJvdXRlcjsgXG4gICAgICAgIFxuICAgICAgICBjb25zdHJ1Y3Rvcihjb29raWVzOiBBcHBDb29raWVzLCByb3V0ZXI6IEFwcFJvdXRlcil7XG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMgPSBjb29raWVzO1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXIgPSByb3V0ZXI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGJyb3dzZXJJZCA9IHRoaXMuY29va2llcy5icm93c2VySWQgfHwgRnJhbWV3b3JrLm5ld2lkKCk7XG4gICAgICAgICAgICAvLyBpbml0IG9yIHJlZnJlc2ggY29va2llXG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMuYnJvd3NlcklkID0gYnJvd3NlcklkO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgbGFzdFNhdmVkU2tldGNoSWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb29raWVzLmxhc3RTYXZlZFNrZXRjaElkOyBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZ2V0IGJyb3dzZXJJZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvb2tpZXMuYnJvd3NlcklkO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgcm91dGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZXIuc3RhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQWN0aW9ucyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcbiAgICAgICAgZWRpdG9yTG9hZGVkU2tldGNoID0gdGhpcy50b3BpYzxzdHJpbmc+KFwiZWRpdG9yTG9hZGVkU2tldGNoXCIpO1xuICAgICAgICBlZGl0b3JTYXZlZFNrZXRjaCA9IHRoaXMudG9waWM8c3RyaW5nPihcImVkaXRvclNhdmVkU2tldGNoXCIpO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFdmVudHMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XG4gICAgICAgIHJvdXRlQ2hhbmdlZCA9IHRoaXMudG9waWM8QXBwUm91dGVTdGF0ZT4oXCJyb3V0ZUNoYW5nZWRcIik7XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIERlbW8ge1xuXG4gICAgZXhwb3J0IGNsYXNzIERlbW9Nb2R1bGUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcblxuICAgICAgICAgICAgcGFwZXIuc2V0dXAoY2FudmFzKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gcGFwZXIudmlldztcblxuICAgICAgICAgICAgY29uc3QgcGFyc2VkRm9udHMgPSBuZXcgRm9udFNoYXBlLlBhcnNlZEZvbnRzKCgpID0+IHsgfSk7XG4gICAgICAgICAgICBwYXJzZWRGb250cy5nZXQoXCJmb250cy9Sb2JvdG8tNTAwLnR0ZlwiKS50aGVuKCBwYXJzZWQgPT4ge1xuXG4gICAgICAgICAgICAgICAgIGNvbnN0IHBhdGhEYXRhID0gcGFyc2VkLmZvbnQuZ2V0UGF0aChcIlNOQVBcIiwgMCwgMCwgMTI4KS50b1BhdGhEYXRhKCk7XG4gICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcbiAgICAgICAgICAgICAgICAgY29udGVudC5wb3NpdGlvbiA9IGNvbnRlbnQucG9zaXRpb24uYWRkKDUwKTtcbiAgICAgICAgICAgICAgICAgY29udGVudC5maWxsQ29sb3IgPSBcImxpZ2h0Z3JheVwiO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gcGFwZXIuUGF0aC5FbGxpcHNlKG5ldyBwYXBlci5SZWN0YW5nbGUoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2l6ZSg2MDAsIDMwMClcbiAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICByZWdpb24ucm90YXRlKDMwKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZWdpb24uYm91bmRzLmNlbnRlciA9IHZpZXcuY2VudGVyO1xuICAgICAgICAgICAgICAgIHJlZ2lvbi5zdHJva2VDb2xvciA9IFwibGlnaHRncmF5XCI7XG4gICAgICAgICAgICAgICAgcmVnaW9uLnN0cm9rZVdpZHRoID0gMztcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNuYXBQYXRoID0gbmV3IEZvbnRTaGFwZS5TbmFwUGF0aChyZWdpb24sIGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIHNuYXBQYXRoLmNvcm5lcnMgPSBbMCwgMC40LCAwLjQ1LCAwLjk1XTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2aWV3Lm9uRnJhbWUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNuYXBQYXRoLnNsaWRlKDAuMDAxKTtcbiAgICAgICAgICAgICAgICAgICAgc25hcFBhdGgudXBkYXRlUGF0aCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2aWV3LmRyYXcoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgICBcbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XG5cbiAgICBleHBvcnQgY2xhc3MgQnVpbGRlciB7XG5cbiAgICAgICAgc3RhdGljIGRlZmF1bHRGb250VXJsID0gXCJmb250cy9Sb2JvdG8tNTAwLnR0ZlwiO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xuXG4gICAgICAgICAgICBjb25zdCBjb250ZXh0ID0gPFRlbXBsYXRlVUlDb250ZXh0PntcbiAgICAgICAgICAgICAgICBnZXQgZm9udENhdGFsb2coKSB7IHJldHVybiBzdG9yZS5mb250Q2F0YWxvZyB9LFxuICAgICAgICAgICAgICAgIHJlbmRlckRlc2lnbjogKGRlc2lnbiwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUucmVuZGVyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2lnbjogZGVzaWduLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjcmVhdGVGb250Q2hvb3NlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFRlbXBsYXRlRm9udENob29zZXIoc3RvcmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYXN5bmMgb2JzZXJ2ZVxuICAgICAgICAgICAgc3RvcmUudGVtcGxhdGUkLm9ic2VydmVPbihSeC5TY2hlZHVsZXIuZGVmYXVsdCkuc3Vic2NyaWJlKHQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RlbXBsYXRlU3RhdGUgPSB0LmNyZWF0ZU5ldyhjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBfLm1lcmdlKG5ld1RlbXBsYXRlU3RhdGUsIHN0b3JlLnN0YXRlLnRlbXBsYXRlU3RhdGUpO1xuICAgICAgICAgICAgICAgIHN0b3JlLnNldFRlbXBsYXRlU3RhdGUobmV3VGVtcGxhdGVTdGF0ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgZG9tJCA9IHN0b3JlLnRlbXBsYXRlU3RhdGUkXG4gICAgICAgICAgICAgICAgLm1hcCh0cyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250cm9scztcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xzID0gc3RvcmUudGVtcGxhdGUuY3JlYXRlVUkoY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgY2FsbGluZyAke3N0b3JlLnRlbXBsYXRlLm5hbWV9LmNyZWF0ZVVJYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBjb250cm9scykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYy52YWx1ZSQuc3Vic2NyaWJlKGQgPT4gc3RvcmUudXBkYXRlVGVtcGxhdGVTdGF0ZShkKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBjb250cm9scy5tYXAoYyA9PiBjLmNyZWF0ZU5vZGUodHMpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdm5vZGUgPSBoKFwiZGl2I3RlbXBsYXRlQ29udHJvbHNcIiwge30sIG5vZGVzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZub2RlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oZG9tJCwgY29udGFpbmVyKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xuXG4gICAgZXhwb3J0IGNsYXNzIE1vZHVsZSB7XG4gICAgICAgIHN0b3JlOiBTdG9yZTtcbiAgICAgICAgYnVpbGRlcjogQnVpbGRlcjtcblxuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIGJ1aWxkZXJDb250YWluZXI6IEhUTUxFbGVtZW50LFxuICAgICAgICAgICAgcHJldmlld0NhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsXG4gICAgICAgICAgICByZW5kZXJDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxuICAgICAgICAgICAgYmVsb3dDYW52YXM6IEhUTUxFbGVtZW50KSB7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoKTtcbiAgICAgICAgICAgIHRoaXMuYnVpbGRlciA9IG5ldyBCdWlsZGVyKGJ1aWxkZXJDb250YWluZXIsIHRoaXMuc3RvcmUpO1xuXG4gICAgICAgICAgICBuZXcgUHJldmlld0NhbnZhcyhwcmV2aWV3Q2FudmFzLCB0aGlzLnN0b3JlKTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS50ZW1wbGF0ZVN0YXRlJC5zdWJzY3JpYmUodHMgPT4gY29uc29sZS5sb2coXCJ0ZW1wbGF0ZVN0YXRlXCIsIHRzKSk7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnRlbXBsYXRlJC5zdWJzY3JpYmUodCA9PiBjb25zb2xlLmxvZyhcInRlbXBsYXRlXCIsIHQpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbmV3IFNoYXJlT3B0aW9uc1VJKGJlbG93Q2FudmFzLCB0aGlzLnN0b3JlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5pbml0KCkudGhlbihzID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnNldFRlbXBsYXRlKFwiRGlja2Vuc1wiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZVRlbXBsYXRlU3RhdGUoXG4gICAgICAgICAgICAgICAgICAgIHsgZGVzaWduOlxuICAgICAgICAgICAgICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkRvbid0IGdvYmJsZWZ1bmsgYXJvdW5kIHdpdGggd29yZHMuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogXCItIFJvYWxkIERhaGwsIFRoZSBCRkdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZWQ6IDAuOTk1OTE3NjQ1NzgwMzEyMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFwZTogXCJuYXJyb3dcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbWlseTogXCJBbWF0aWMgU0NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudDogXCJyZWd1bGFyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhbGV0dGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzg1NDQ0MlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnQ6IHRydWUgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRDYXRlZ29yeTogXCJoYW5kd3JpdGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG4iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XG5cbiAgICBleHBvcnQgY2xhc3MgUHJldmlld0NhbnZhcyB7XG5cbiAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xuICAgICAgICBidWlsdERlc2lnbjogcGFwZXIuSXRlbTtcbiAgICAgICAgY29udGV4dDogVGVtcGxhdGVCdWlsZENvbnRleHQ7XG5cbiAgICAgICAgcHJpdmF0ZSBsYXN0UmVjZWl2ZWQ6IERlc2lnbjtcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJpbmcgPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xuICAgICAgICBwcml2YXRlIHdvcmtzcGFjZTogcGFwZXIuR3JvdXA7XG4gICAgICAgIHByaXZhdGUgbWFyazogRnN0eC5GcmFtZXdvcmsuV2F0ZXJtYXJrO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuXG4gICAgICAgICAgICBwYXBlci5zZXR1cChjYW52YXMpO1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0ID0gcGFwZXIucHJvamVjdDtcbiAgICAgICAgICAgIHRoaXMud29ya3NwYWNlID0gbmV3IHBhcGVyLkdyb3VwKCk7XG5cbiAgICAgICAgICAgIEZvbnRTaGFwZS5WZXJ0aWNhbEJvdW5kc1N0cmV0Y2hQYXRoLnBvaW50c1BlclBhdGggPSA0MDA7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IHtcbiAgICAgICAgICAgICAgICBnZXRGb250OiBzcGVjaWZpZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc3BlY2lmaWVyIHx8ICFzcGVjaWZpZXIuZmFtaWx5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBCdWlsZGVyLmRlZmF1bHRGb250VXJsO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gc3RvcmUuZm9udENhdGFsb2cuZ2V0VXJsKHNwZWNpZmllci5mYW1pbHksIHNwZWNpZmllci52YXJpYW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IEJ1aWxkZXIuZGVmYXVsdEZvbnRVcmw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLnBhcnNlZEZvbnRzLmdldCh1cmwpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0LmZvbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMubWFyayA9IG5ldyBGc3R4LkZyYW1ld29yay5XYXRlcm1hcmsodGhpcy5wcm9qZWN0LCBcImltZy9zcGlyYWwtbG9nby5zdmdcIiwgMC4wNik7XG5cbiAgICAgICAgICAgIHN0b3JlLnRlbXBsYXRlU3RhdGUkLnN1YnNjcmliZSgodHM6IFRlbXBsYXRlU3RhdGUpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBvbmx5IHByb2Nlc3Mgb25lIHJlcXVlc3QgYXQgYSB0aW1lXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFsd2F5cyBwcm9jZXNzIHRoZSBsYXN0IHJlY2VpdmVkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFJlY2VpdmVkID0gdHMuZGVzaWduO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIodHMuZGVzaWduKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZG93bmxvYWRQTkdSZXF1ZXN0ZWQuc3ViKHBpeGVscyA9PiB0aGlzLmRvd25sb2FkUE5HKHBpeGVscykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBkb3dubG9hZFBORyhwaXhlbHM6IG51bWJlcikge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnN0b3JlLmRlc2lnbi5jb250ZW50IFxuICAgICAgICAgICAgICAgIHx8ICF0aGlzLnN0b3JlLmRlc2lnbi5jb250ZW50LnRleHQgXG4gICAgICAgICAgICAgICAgfHwgIXRoaXMuc3RvcmUuZGVzaWduLmNvbnRlbnQudGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIHZlcnkgZnJhZ2lsZSB3YXkgdG8gZ2V0IGJnIGNvbG9yXG4gICAgICAgICAgICBjb25zdCBzaGFwZSA9IHRoaXMud29ya3NwYWNlLmdldEl0ZW0oe2NsYXNzOiBwYXBlci5TaGFwZSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGJnQ29sb3IgPSA8cGFwZXIuQ29sb3I+c2hhcGUuZmlsbENvbG9yO1xuICAgICAgICAgICAgdGhpcy5tYXJrLnBsYWNlSW50byh0aGlzLndvcmtzcGFjZSwgYmdDb2xvcik7ICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEhhbGYgb2YgbWF4IERQSSBwcm9kdWNlcyBhcHByb3ggNDIwMHg0MjAwLlxuICAgICAgICAgICAgY29uc3QgZHBpID0gMC41ICogUGFwZXJIZWxwZXJzLmdldEV4cG9ydERwaSh0aGlzLndvcmtzcGFjZS5ib3VuZHMuc2l6ZSwgcGl4ZWxzKTtcbiAgICAgICAgICAgIGNvbnN0IHJhc3RlciA9IHRoaXMud29ya3NwYWNlLnJhc3Rlcml6ZShkcGksIGZhbHNlKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByYXN0ZXIudG9EYXRhVVJMKCk7XG4gICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IEZzdHguRnJhbWV3b3JrLmNyZWF0ZUZpbGVOYW1lKHRoaXMuc3RvcmUuZGVzaWduLmNvbnRlbnQudGV4dCwgNDAsIFwicG5nXCIpO1xuICAgICAgICAgICAgY29uc3QgYmxvYiA9IERvbUhlbHBlcnMuZGF0YVVSTFRvQmxvYihkYXRhKTtcbiAgICAgICAgICAgIHNhdmVBcyhibG9iLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMubWFyay5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgcmVuZGVyTGFzdFJlY2VpdmVkKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMubGFzdFJlY2VpdmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVuZGVyaW5nID0gdGhpcy5sYXN0UmVjZWl2ZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0UmVjZWl2ZWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHJlbmRlcmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHJlbmRlcihkZXNpZ246IERlc2lnbik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVuZGVyIGlzIGluIHByb2dyZXNzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJpbmcgPSB0cnVlO1xuICAgICAgICAgICAgcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5yZW1vdmVDaGlsZHJlbigpO1xuICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSBuZXcgcGFwZXIuR3JvdXAoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlLnRlbXBsYXRlLmJ1aWxkKGRlc2lnbiwgdGhpcy5jb250ZXh0KS50aGVuKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyByZW5kZXIgcmVzdWx0IGZyb21cIiwgZGVzaWduKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZml0Qm91bmRzKHRoaXMucHJvamVjdC52aWV3LmJvdW5kcyk7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYm91bmRzLnBvaW50ID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLnRvcExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ya3NwYWNlLmFkZENoaWxkKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgYW55IHJlY2VpdmVkIHdoaWxlIHJlbmRlcmluZyBcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckxhc3RSZWNlaXZlZCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcmVuZGVyaW5nIGRlc2lnblwiLCBlcnIsIGRlc2lnbik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJtb2R1bGUgU2tldGNoQnVpbGRlciB7XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIFNoYXJlT3B0aW9uc1VJIHtcbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xuICAgICAgICBcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKXtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBSeC5PYnNlcnZhYmxlLmp1c3QobnVsbCk7XG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oc3RhdGUubWFwKCgpID0+IHRoaXMuY3JlYXRlRG9tKCkpLCBjb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjcmVhdGVEb20oKTogVk5vZGUge1xuICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXYuY29udHJvbHNcIiwgWyBcbiAgICAgICAgICAgICAgICBoKFwiYnV0dG9uLmJ0bi5idG4tcHJpbWFyeVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5kb3dubG9hZFBORygxMDAgKiAxMDAwKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbXCJEb3dubG9hZCBzbWFsbFwiXSksXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaChcImJ1dHRvbi5idG4uYnRuLXByaW1hcnlcIiwge1xuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuZG93bmxvYWRQTkcoNTAwICogMTAwMClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW1wiRG93bmxvYWQgbWVkaXVtXCJdKSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XG5cbiAgICBleHBvcnQgY2xhc3MgU3RvcmUge1xuXG4gICAgICAgIHByaXZhdGUgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG4gICAgICAgIHByaXZhdGUgX3RlbXBsYXRlJCA9IG5ldyBSeC5TdWJqZWN0PFRlbXBsYXRlPigpO1xuICAgICAgICBwcml2YXRlIF90ZW1wbGF0ZVN0YXRlJCA9IG5ldyBSeC5TdWJqZWN0PFRlbXBsYXRlU3RhdGU+KCk7XG4gICAgICAgIHByaXZhdGUgX3JlbmRlciQgPSBuZXcgUnguU3ViamVjdDxSZW5kZXJSZXF1ZXN0PigpO1xuICAgICAgICBwcml2YXRlIF9zdGF0ZToge1xuICAgICAgICAgICAgdGVtcGxhdGU/OiBUZW1wbGF0ZTtcbiAgICAgICAgICAgIHRlbXBsYXRlU3RhdGU6IFRlbXBsYXRlU3RhdGU7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBfZXZlbnRzQ2hhbm5lbCA9IG5ldyBUeXBlZENoYW5uZWwuQ2hhbm5lbCgpO1xuXG4gICAgICAgIHByaXZhdGUgX3BhcnNlZEZvbnRzOiBGb250U2hhcGUuUGFyc2VkRm9udHM7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRDYXRhbG9nOiBGb250U2hhcGUuRm9udENhdGFsb2c7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVN0YXRlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbjoge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLl9wYXJzZWRGb250cyA9IG5ldyBGb250U2hhcGUuUGFyc2VkRm9udHMoKCkgPT4geyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50cyA9IHtcbiAgICAgICAgICAgIGRvd25sb2FkUE5HUmVxdWVzdGVkOiB0aGlzLl9ldmVudHNDaGFubmVsLnRvcGljPG51bWJlcj4oXCJkb3dubG9hZFBOR1JlcXVlc3RlZFwiKVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHN0YXRlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHBhcnNlZEZvbnRzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlZEZvbnRzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGZvbnRDYXRhbG9nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRDYXRhbG9nO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRlbXBsYXRlU3RhdGUkKCk6IFJ4Lk9ic2VydmFibGU8VGVtcGxhdGVTdGF0ZT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlU3RhdGUkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRlbXBsYXRlJCgpOiBSeC5PYnNlcnZhYmxlPFRlbXBsYXRlPiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGUkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHJlbmRlciQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyJDsvLy5vYnNlcnZlT24oUnguU2NoZWR1bGVyLmRlZmF1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUudGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZGVzaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZSAmJiB0aGlzLnN0YXRlLnRlbXBsYXRlU3RhdGUuZGVzaWduO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpOiBQcm9taXNlPFN0b3JlPiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlN0b3JlIGlzIGFscmVhZHkgaW5pdGFsaXplZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxTdG9yZT4oY2FsbGJhY2sgPT4ge1xuICAgICAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5mcm9tTG9jYWwoXCJmb250cy9nb29nbGUtZm9udHMuanNvblwiKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRDYXRhbG9nID0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGRvd25sb2FkUE5HKHBpeGVsczogbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5kb3dubG9hZFBOR1JlcXVlc3RlZC5kaXNwYXRjaCgpO1xuICAgICAgICAgICAgdGhpcy5zZW5kRGVzaWduR0FFdmVudChcImV4cG9ydFwiLCBwaXhlbHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VuZERlc2lnbkdBRXZlbnQoYWN0aW9uOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGxldCBsYWJlbCA9IHRoaXMuX3N0YXRlLnRlbXBsYXRlLm5hbWU7XG4gICAgICAgICAgICBjb25zdCBmb250ID0gdGhpcy5fc3RhdGUudGVtcGxhdGVTdGF0ZS5kZXNpZ24uZm9udDtcbiAgICAgICAgICAgIGlmIChmb250KSB7XG4gICAgICAgICAgICAgICAgbGFiZWwgKz0gXCI7XCIgKyBmb250LmZhbWlseSArIFwiIFwiICsgZm9udC52YXJpYW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2FFdmVudCh7XG4gICAgICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogXCJEZXNpZ25cIixcbiAgICAgICAgICAgICAgICBldmVudEFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgICAgICAgIGV2ZW50TGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgICAgIGV2ZW50VmFsdWU6IHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRlbXBsYXRlKG5hbWU6IHN0cmluZykge1xuICAgICAgICAgICAgbGV0IHRlbXBsYXRlOiBUZW1wbGF0ZTtcbiAgICAgICAgICAgIGlmICgvRGlja2Vucy9pLnRlc3QobmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IG5ldyBTa2V0Y2hCdWlsZGVyLlRlbXBsYXRlcy5EaWNrZW5zKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHRlbXBsYXRlICR7bmFtZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RhdGUudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlJC5vbk5leHQodGVtcGxhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0RGVzaWduKHZhbHVlOiBEZXNpZ24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGVtcGxhdGVTdGF0ZSh7IGRlc2lnbjogdmFsdWUgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZVRlbXBsYXRlU3RhdGUoY2hhbmdlOiBUZW1wbGF0ZVN0YXRlQ2hhbmdlKSB7XG4gICAgICAgICAgICBfLm1lcmdlKHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZSwgY2hhbmdlKTtcblxuICAgICAgICAgICAgY29uc3QgZGVzaWduID0gdGhpcy5zdGF0ZS50ZW1wbGF0ZVN0YXRlLmRlc2lnbjtcbiAgICAgICAgICAgIGlmIChkZXNpZ24gJiYgZGVzaWduLmZvbnQgJiYgZGVzaWduLmZvbnQuZmFtaWx5ICYmICFkZXNpZ24uZm9udC52YXJpYW50KSB7XG4gICAgICAgICAgICAgICAgLy8gc2V0IGRlZmF1bHQgdmFyaWFudFxuICAgICAgICAgICAgICAgIGRlc2lnbi5mb250LnZhcmlhbnQgPSBGb250U2hhcGUuRm9udENhdGFsb2cuZGVmYXVsdFZhcmlhbnQoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRDYXRhbG9nLmdldFJlY29yZChkZXNpZ24uZm9udC5mYW1pbHkpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVTdGF0ZSQub25OZXh0KHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUZW1wbGF0ZVN0YXRlKHN0YXRlOiBUZW1wbGF0ZVN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZS50ZW1wbGF0ZVN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVN0YXRlJC5vbk5leHQoc3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyKHJlcXVlc3Q6IFJlbmRlclJlcXVlc3QpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlciQub25OZXh0KHJlcXVlc3QpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XG4gICAgXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZSB7XG4gICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgICAgICAgaW1hZ2U6IHN0cmluZztcbiAgICAgICAgY3JlYXRlTmV3KGNvbnRleHQ6IFRlbXBsYXRlVUlDb250ZXh0KTogVGVtcGxhdGVTdGF0ZTtcbiAgICAgICAgY3JlYXRlVUkoY29udGV4dDogVGVtcGxhdGVVSUNvbnRleHQpOiBCdWlsZGVyQ29udHJvbFtdO1xuICAgICAgICBidWlsZChkZXNpZ246IERlc2lnbiwgY29udGV4dDogVGVtcGxhdGVCdWlsZENvbnRleHQpOiBQcm9taXNlPHBhcGVyLkl0ZW0+O1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGVVSUNvbnRleHQge1xuICAgICAgICByZW5kZXJEZXNpZ24oZGVzaWduOiBEZXNpZ24sIGNhbGxiYWNrOiAoaW1hZ2VEYXRhVXJsOiBzdHJpbmcpID0+IHZvaWQpO1xuICAgICAgICBmb250Q2F0YWxvZzogRm9udFNoYXBlLkZvbnRDYXRhbG9nO1xuICAgICAgICBjcmVhdGVGb250Q2hvb3NlcigpOiBCdWlsZGVyQ29udHJvbDtcbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZUJ1aWxkQ29udGV4dCB7XG4gICAgICAgIGdldEZvbnQoZGVzYzogRm9udFNoYXBlLkZvbnRTcGVjaWZpZXIpOiBQcm9taXNlPG9wZW50eXBlLkZvbnQ+O1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlU3RhdGUge1xuICAgICAgICBkZXNpZ246IERlc2lnbjtcbiAgICAgICAgZm9udENhdGVnb3J5Pzogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGVTdGF0ZUNoYW5nZSB7XG4gICAgICAgIGRlc2lnbj86IERlc2lnbjtcbiAgICAgICAgZm9udENhdGVnb3J5Pzogc3RyaW5nO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIERlc2lnbiB7XG4gICAgICAgIGNvbnRlbnQ/OiBhbnk7XG4gICAgICAgIHNoYXBlPzogc3RyaW5nO1xuICAgICAgICBmb250PzogRm9udFNoYXBlLkZvbnRTcGVjaWZpZXI7XG4gICAgICAgIHBhbGV0dGU/OiBEZXNpZ25QYWxldHRlO1xuICAgICAgICBzZWVkPzogbnVtYmVyO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIERlc2lnblBhbGV0dGUge1xuICAgICAgICBjb2xvcj86IHN0cmluZztcbiAgICAgICAgaW52ZXJ0PzogYm9vbGVhbjtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIERlc2lnbkNoYW5nZSBleHRlbmRzIERlc2lnbntcbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGludGVyZmFjZSBSZW5kZXJSZXF1ZXN0IHtcbiAgICAgICAgZGVzaWduOiBEZXNpZ247XG4gICAgICAgIGFyZWE/OiBudW1iZXI7XG4gICAgICAgIGNhbGxiYWNrOiAoaW1hZ2VEYXRhVXJsOiBzdHJpbmcpID0+IHZvaWQ7XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQnVpbGRlckNvbnRyb2wge1xuICAgICAgICB2YWx1ZSQ6IFJ4Lk9ic2VydmFibGU8VGVtcGxhdGVTdGF0ZUNoYW5nZT47XG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU6IFRlbXBsYXRlU3RhdGUpOiBWTm9kZTtcbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGludGVyZmFjZSBWYWx1ZUNvbnRyb2w8VD4ge1xuICAgICAgICB2YWx1ZSQ6IFJ4Lk9ic2VydmFibGU8VD47XG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU/OiBUKTogVk5vZGU7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBPcHRpb25DaG9vc2VyPFQ+IHtcbiAgICAgICAgdmFsdWUkOiBSeC5PYnNlcnZhYmxlPFQ+O1xuICAgICAgICBjcmVhdGVOb2RlKGNob2ljZXM6IFRbXSwgdmFsdWU/OiBUKTogVk5vZGU7XG4gICAgfVxuICAgIFxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcbiAgICBcbiAgICBleHBvcnQgbmFtZXNwYWNlIENvbnRyb2xIZWxwZXJzIHtcbiAgICAgICAgXG4gICAgICAgICBleHBvcnQgZnVuY3Rpb24gY2hvb3NlcjxUPihcbiAgICAgICAgICAgICBjaG9pY2VzOiBDaG9pY2VbXSlcbiAgICAgICAgICAgICA6IFZOb2Rle1xuICAgICAgICAgICAgcmV0dXJuIGgoXCJ1bC5jaG9vc2VyXCIsXG4gICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgY2hvaWNlcy5tYXAoY2hvaWNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJsaS5jaG9pY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9zZW46IGNob2ljZS5jaG9zZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBldiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9pY2UuY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2hvaWNlLm5vZGVdKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApOyBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDaG9pY2Uge1xuICAgICAgICAgICAgIG5vZGU6IFZOb2RlLCBcbiAgICAgICAgICAgICBjaG9zZW4/OiBib29sZWFuLCBcbiAgICAgICAgICAgICBjYWxsYmFjaz86ICgpID0+IHZvaWRcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG4gICAgXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xuXG4gICAgZXhwb3J0IGNsYXNzIEZvbnRDaG9vc2VyIGltcGxlbWVudHMgVmFsdWVDb250cm9sPEZvbnRDaG9vc2VyU3RhdGU+IHtcblxuICAgICAgICBwcml2YXRlIGZvbnRDYXRhbG9nOiBGb250U2hhcGUuRm9udENhdGFsb2c7XG4gICAgICAgIHByaXZhdGUgX3ZhbHVlJCA9IG5ldyBSeC5TdWJqZWN0PEZvbnRDaG9vc2VyU3RhdGU+KCk7XG5cbiAgICAgICAgbWF4RmFtaWxpZXMgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGZvbnRDYXRhbG9nOiBGb250U2hhcGUuRm9udENhdGFsb2cpIHtcbiAgICAgICAgICAgIHRoaXMuZm9udENhdGFsb2cgPSBmb250Q2F0YWxvZztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgcHJlbG9hZEZhbWlsaWVzID0gdGhpcy5mb250Q2F0YWxvZy5nZXRDYXRlZ29yaWVzKClcbiAgICAgICAgICAgICAgICAubWFwKGMgPT4gZm9udENhdGFsb2cuZ2V0RmFtaWxpZXMoYylbMF0pO1xuICAgICAgICAgICAgRm9udFNoYXBlLkZvbnRDYXRhbG9nLmxvYWRQcmV2aWV3U3Vic2V0cyhwcmVsb2FkRmFtaWxpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZhbHVlJCgpOiBSeC5PYnNlcnZhYmxlPEZvbnRDaG9vc2VyU3RhdGU+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZSQ7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVOb2RlKHZhbHVlPzogRm9udENob29zZXJTdGF0ZSk6IFZOb2RlIHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuOiBWTm9kZVtdID0gW107XG5cbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goaChcImgzXCIsIFtcIkZvbnQgQ2F0ZWdvcmllc1wiXSkpO1xuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcmllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0Q2F0ZWdvcmllcygpO1xuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlDaG9pY2VzID0gY2F0ZWdvcmllcy5tYXAoY2F0ZWdvcnkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yeUZhbWlsaWVzID0gdGhpcy5mb250Q2F0YWxvZy5nZXRGYW1pbGllcyhjYXRlZ29yeSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4RmFtaWxpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlGYW1pbGllcyA9IGNhdGVnb3J5RmFtaWxpZXMuc2xpY2UoMCwgdGhpcy5tYXhGYW1pbGllcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0RmFtaWx5ID0gY2F0ZWdvcnlGYW1pbGllc1swXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gPENvbnRyb2xIZWxwZXJzLkNob2ljZT57XG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IGgoXCJzcGFuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IEZvbnRIZWxwZXJzLmdldENzc1N0eWxlKGZpcnN0RmFtaWx5KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjYXRlZ29yeV0pLFxuICAgICAgICAgICAgICAgICAgICBjaG9zZW46IHZhbHVlLmNhdGVnb3J5ID09PSBjYXRlZ29yeSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5sb2FkUHJldmlld1N1YnNldHMoY2F0ZWdvcnlGYW1pbGllcyk7IFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUkLm9uTmV4dCh7IGNhdGVnb3J5LCBmYW1pbHk6IGZpcnN0RmFtaWx5IH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKENvbnRyb2xIZWxwZXJzLmNob29zZXIoY2F0ZWdvcnlDaG9pY2VzKSk7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZS5jYXRlZ29yeSkge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goaChcImgzXCIsIHt9LCBbXCJGb250c1wiXSkpO1xuICAgICAgICAgICAgICAgIGxldCBmYW1pbGllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0RmFtaWxpZXModmFsdWUuY2F0ZWdvcnkpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1heEZhbWlsaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZhbWlsaWVzID0gZmFtaWxpZXMuc2xpY2UoMCwgdGhpcy5tYXhGYW1pbGllcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGZhbWlseU9wdGlvbnMgPSBmYW1pbGllcy5tYXAoZmFtaWx5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxDb250cm9sSGVscGVycy5DaG9pY2U+e1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogaChcInNwYW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiBGb250SGVscGVycy5nZXRDc3NTdHlsZShmYW1pbHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZmFtaWx5XSksXG4gICAgICAgICAgICAgICAgICAgICAgICBjaG9zZW46IHZhbHVlLmZhbWlseSA9PT0gZmFtaWx5LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuX3ZhbHVlJC5vbk5leHQoeyBmYW1pbHksIHZhcmlhbnQ6IFwiXCIgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goQ29udHJvbEhlbHBlcnMuY2hvb3NlcihmYW1pbHlPcHRpb25zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh2YWx1ZS5mYW1pbHkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YXJpYW50cyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0VmFyaWFudHModmFsdWUuZmFtaWx5KTtcbiAgICAgICAgICAgICAgICBpZiAodmFyaWFudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGgoXCJoM1wiLCB7fSwgW1wiRm9udCBTdHlsZXNcIl0pKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YXJpYW50T3B0aW9ucyA9IHZhcmlhbnRzLm1hcCh2YXJpYW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwic3BhblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogRm9udEhlbHBlcnMuZ2V0Q3NzU3R5bGUodmFsdWUuZmFtaWx5LCB2YXJpYW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdmFyaWFudF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3NlbjogdmFsdWUudmFyaWFudCA9PT0gdmFyaWFudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5fdmFsdWUkLm9uTmV4dCh7IHZhcmlhbnQgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goQ29udHJvbEhlbHBlcnMuY2hvb3Nlcih2YXJpYW50T3B0aW9ucykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXYuZm9udENob29zZXJcIiwge30sIGNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRm9udENob29zZXJTdGF0ZSB7XG4gICAgICAgIGNhdGVnb3J5Pzogc3RyaW5nO1xuICAgICAgICBmYW1pbHk/OiBzdHJpbmc7XG4gICAgICAgIHZhcmlhbnQ/OiBzdHJpbmc7XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xuXG4gICAgZXhwb3J0IGNsYXNzIEltYWdlQ2hvb3NlciB7XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hvc2VuJCA9IG5ldyBSeC5TdWJqZWN0PEltYWdlQ2hvaWNlPigpO1xuXG4gICAgICAgIGNyZWF0ZU5vZGUob3B0aW9uczogSW1hZ2VDaG9vc2VyT3B0aW9ucyk6IFZOb2RlIHtcbiAgICAgICAgICAgIGNvbnN0IGNob2ljZU5vZGVzID0gb3B0aW9ucy5jaG9pY2VzLm1hcChjID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaW1nOiBWTm9kZTtcbiAgICAgICAgICAgICAgICBjb25zdCBvbkNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaG9zZW4kLm9uTmV4dChjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBvcHRpb25zLmNob3NlbiA9PT0gYy52YWx1ZSBcbiAgICAgICAgICAgICAgICAgICAgPyBcImltZy5jaG9zZW5cIiBcbiAgICAgICAgICAgICAgICAgICAgOiBcImltZ1wiO1xuICAgICAgICAgICAgICAgIGlmIChjLmxvYWRJbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW1nRWxtO1xuICAgICAgICAgICAgICAgICAgICBpbWcgPSBoKHNlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBvbkNsaWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGtpY2sgb2ZmIGltYWdlIGxvYWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiB2bm9kZSA9PiBjLmxvYWRJbWFnZSh2bm9kZS5lbG0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW1nID0gaChzZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmOiBjLmltYWdlVXJsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogb25DbGlja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJsaVwiLCB7fSwgW1xuICAgICAgICAgICAgICAgICAgICBpbWdcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gaChcInVsLmNob29zZXJcIiwge30sIGNob2ljZU5vZGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBjaG9zZW4kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Nob3NlbiQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1hZ2VDaG9vc2VyT3B0aW9ucyB7XG4gICAgICAgIGNob2ljZXM6IEltYWdlQ2hvaWNlW10sXG4gICAgICAgIGNob3Nlbj86IHN0cmluZ1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1hZ2VDaG9pY2Uge1xuICAgICAgICB2YWx1ZTogc3RyaW5nO1xuICAgICAgICBsYWJlbDogc3RyaW5nO1xuICAgICAgICBpbWFnZVVybD86IHN0cmluZztcbiAgICAgICAgbG9hZEltYWdlPzogKGVsZW1lbnQ6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHZvaWQ7XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xuXG4gICAgZXhwb3J0IGNsYXNzIFRlbXBsYXRlRm9udENob29zZXIgaW1wbGVtZW50cyBCdWlsZGVyQ29udHJvbHtcbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgX2ZvbnRDaG9vc2VyOiBGb250Q2hvb3NlcjtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5fZm9udENob29zZXIgPSBuZXcgRm9udENob29zZXIoc3RvcmUuZm9udENhdGFsb2cpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9mb250Q2hvb3Nlci5tYXhGYW1pbGllcyA9IDE1OyBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY3JlYXRlTm9kZSh2YWx1ZTogVGVtcGxhdGVTdGF0ZSk6IFZOb2RlIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnQgPSB2YWx1ZS5kZXNpZ24gJiYgdmFsdWUuZGVzaWduLmZvbnQ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udENob29zZXIuY3JlYXRlTm9kZSg8Rm9udENob29zZXJTdGF0ZT57XG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IHZhbHVlLmZvbnRDYXRlZ29yeSxcbiAgICAgICAgICAgICAgICBmYW1pbHk6IGZvbnQgJiYgZm9udC5mYW1pbHksXG4gICAgICAgICAgICAgICAgdmFyaWFudDogZm9udCAmJiBmb250LnZhcmlhbnRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdldCB2YWx1ZSQoKTogUnguT2JzZXJ2YWJsZTxUZW1wbGF0ZVN0YXRlPiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udENob29zZXIudmFsdWUkLm1hcChjaG9pY2UgPT4gPFRlbXBsYXRlU3RhdGU+e1xuICAgICAgICAgICAgICAgIGZvbnRDYXRlZ29yeTogY2hvaWNlLmNhdGVnb3J5LFxuICAgICAgICAgICAgICAgIGRlc2lnbjoge1xuICAgICAgICAgICAgICAgICAgICBmb250OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmYW1pbHk6IGNob2ljZS5mYW1pbHksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50OiBjaG9pY2UudmFyaWFudFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSBcblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcblxuICAgIGV4cG9ydCBjbGFzcyBUZXh0SW5wdXQgaW1wbGVtZW50cyBWYWx1ZUNvbnRyb2w8c3RyaW5nPiB7XG5cbiAgICAgICAgcHJpdmF0ZSBfdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8c3RyaW5nPigpO1xuXG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU/OiBzdHJpbmcsIHBsYWNlaG9sZGVyPzogc3RyaW5nLCB0ZXh0YXJlYT86IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHJldHVybiBoKFwidGV4dGFyZWFcIiA/IFwidGV4dGFyZWFcIiA6IFwiaW5wdXRcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0ZXh0YXJlYSA/IHVuZGVmaW5lZCA6IFwidGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXByZXNzOiAoZXY6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGV2LndoaWNoIHx8IGV2LmtleUNvZGUpID09PSBEb21IZWxwZXJzLktleUNvZGVzLkVudGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZXYudGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5ibHVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUkLm9uTmV4dChldi50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB2YWx1ZSQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWUkO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIuVGVtcGxhdGVzIHtcblxuICAgIGV4cG9ydCBjbGFzcyBEaWNrZW5zIGltcGxlbWVudHMgU2tldGNoQnVpbGRlci5UZW1wbGF0ZSB7XG5cbiAgICAgICAgbmFtZSA9IFwiRGlja2Vuc1wiO1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJTdGFjayBibG9ja3Mgb2YgdGV4dCBpbiB0aGUgZm9ybSBvZiBhIHdhdnkgbGFkZGVyLlwiO1xuICAgICAgICBpbWFnZTogc3RyaW5nO1xuICAgICAgICBsaW5lSGVpZ2h0VmFyaWF0aW9uID0gMC44O1xuICAgICAgICBkZWZhdWx0Rm9udFNpemUgPSAxMjg7XG4gICAgICAgIG1hcmdpbkZhY3RvciA9IDAuMTQ7XG5cbiAgICAgICAgY3JlYXRlTmV3KGNvbnRleHQ6IFRlbXBsYXRlVUlDb250ZXh0KTogVGVtcGxhdGVTdGF0ZSB7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0Rm9udFJlY29yZCA9IGNvbnRleHQuZm9udENhdGFsb2cuZ2V0TGlzdCgxKVswXTtcbiAgICAgICAgICAgIHJldHVybiA8VGVtcGxhdGVTdGF0ZT57XG4gICAgICAgICAgICAgICAgZGVzaWduOiB7XG4gICAgICAgICAgICAgICAgICAgIHNoYXBlOiBcIm5hcnJvd1wiLFxuICAgICAgICAgICAgICAgICAgICBmb250OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmYW1pbHk6IGRlZmF1bHRGb250UmVjb3JkLmZhbWlseVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzZWVkOiBNYXRoLnJhbmRvbSgpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmb250Q2F0ZWdvcnk6IGRlZmF1bHRGb250UmVjb3JkLmNhdGVnb3J5XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVVSShjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IEJ1aWxkZXJDb250cm9sW10ge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRleHRFbnRyeSgpLFxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhcGVDaG9vc2VyKGNvbnRleHQpLFxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVmFyaWF0aW9uQ29udHJvbCgpLFxuICAgICAgICAgICAgICAgIGNvbnRleHQuY3JlYXRlRm9udENob29zZXIoKSxcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVBhbGV0dGVDaG9vc2VyKClcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cblxuICAgICAgICBidWlsZChkZXNpZ246IERlc2lnbiwgY29udGV4dDogVGVtcGxhdGVCdWlsZENvbnRleHQpOiBQcm9taXNlPHBhcGVyLkl0ZW0+IHtcbiAgICAgICAgICAgIGlmICghZGVzaWduLmNvbnRlbnQgfHwgIWRlc2lnbi5jb250ZW50LnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5nZXRGb250KGRlc2lnbi5mb250KS50aGVuKGZvbnQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmRzID0gZGVzaWduLmNvbnRlbnQudGV4dC50b0xvY2FsZVVwcGVyQ2FzZSgpLnNwbGl0KC9cXHMvKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZWRSYW5kb20gPSBuZXcgRnJhbWV3b3JrLlNlZWRSYW5kb20oXG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbi5zZWVkID09IG51bGwgPyBNYXRoLnJhbmRvbSgpIDogZGVzaWduLnNlZWQpO1xuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRMZW5ndGg6IG51bWJlcjtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGRlc2lnbi5zaGFwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmFsYW5jZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlbmd0aCA9IDIgKiBNYXRoLnNxcnQoXy5zdW0od29yZHMubWFwKHcgPT4gdy5sZW5ndGggKyAxKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ3aWRlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBudW1MaW5lcyA9IDNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlbmd0aCA9IF8uc3VtKHdvcmRzLm1hcCh3ID0+IHcubGVuZ3RoICsgMSkpIC8gbnVtTGluZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlbmd0aCA9IDxudW1iZXI+Xy5tYXgod29yZHMubWFwKHcgPT4gdy5sZW5ndGgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXJnZXRMZW5ndGggKj0gKDAuOCArIHNlZWRSYW5kb20ucmFuZG9tKCkgKiAwLjQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gdGhpcy5iYWxhbmNlTGluZXMod29yZHMsIHRhcmdldExlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgdGV4dENvbG9yID0gZGVzaWduLnBhbGV0dGUgJiYgZGVzaWduLnBhbGV0dGUuY29sb3IgfHwgXCJibGFja1wiO1xuICAgICAgICAgICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgaWYgKGRlc2lnbi5wYWxldHRlICYmIGRlc2lnbi5wYWxldHRlLmludmVydCkge1xuICAgICAgICAgICAgICAgICAgICBbdGV4dENvbG9yLCBiYWNrZ3JvdW5kQ29sb3JdID0gW2JhY2tncm91bmRDb2xvciwgdGV4dENvbG9yXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBib3ggPSBuZXcgcGFwZXIuR3JvdXAoKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZVRleHRCbG9jayA9IChzOiBzdHJpbmcsIHNpemUgPSB0aGlzLmRlZmF1bHRGb250U2l6ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IGZvbnQuZ2V0UGF0aChzLCAwLCAwLCBzaXplKS50b1BhdGhEYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IGxheW91dEl0ZW1zID0gbGluZXMubWFwKGxpbmUgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2s6IGNyZWF0ZVRleHRCbG9jayhsaW5lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbWF4V2lkdGggPSBfLm1heChsYXlvdXRJdGVtcy5tYXAoYiA9PiBiLmJsb2NrLmJvdW5kcy53aWR0aCkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFycmFuZ2VQYXRoUG9pbnRzID0gTWF0aC5taW4oNCwgTWF0aC5yb3VuZChtYXhXaWR0aCAvIDIpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lSGVpZ2h0ID0gbGF5b3V0SXRlbXNbMF0uYmxvY2suYm91bmRzLmhlaWdodDtcblxuICAgICAgICAgICAgICAgIGxldCB1cHBlciA9IG5ldyBwYXBlci5QYXRoKFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQobWF4V2lkdGgsIDApXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgbGV0IGxvd2VyOiBwYXBlci5QYXRoO1xuICAgICAgICAgICAgICAgIGxldCByZW1haW5pbmcgPSBsYXlvdXRJdGVtcy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGxheW91dEl0ZW0gb2YgbGF5b3V0SXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKC0tcmVtYWluaW5nIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1pZCA9IHVwcGVyLmJvdW5kcy5jZW50ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsYXN0IGxvd2VyIGxpbmUgaXMgbGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VyID0gbmV3IHBhcGVyLlBhdGgoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLCBtaWQueSArIGxpbmVIZWlnaHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChtYXhXaWR0aCwgbWlkLnkgKyBsaW5lSGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dlciA9IHRoaXMucmFuZG9tTG93ZXJQYXRoRm9yKHVwcGVyLCBsaW5lSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmFuZ2VQYXRoUG9pbnRzLCBzZWVkUmFuZG9tKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHJldGNoID0gbmV3IEZvbnRTaGFwZS5WZXJ0aWNhbEJvdW5kc1N0cmV0Y2hQYXRoKFxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0SXRlbS5ibG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdXBwZXIsIGxvd2VyIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdHJldGNoLmZpbGxDb2xvciA9IHRleHRDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgYm94LmFkZENoaWxkKHN0cmV0Y2gpO1xuICAgICAgICAgICAgICAgICAgICB1cHBlciA9IGxvd2VyO1xuICAgICAgICAgICAgICAgICAgICBsb3dlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGRlc2lnbi5jb250ZW50LnNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2VCbG9jayA9IGNyZWF0ZVRleHRCbG9jayhkZXNpZ24uY29udGVudC5zb3VyY2UsIHRoaXMuZGVmYXVsdEZvbnRTaXplICogMC4zMyk7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2NrLmZpbGxDb2xvciA9IHRleHRDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlQmxvY2sudHJhbnNsYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXIuYm91bmRzLmJvdHRvbUxlZnQuYWRkKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGggLSBzb3VyY2VCbG9jay5ib3VuZHMud2lkdGgsIC8vIHJpZ2h0LWFsaWduXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2NrLmJvdW5kcy5oZWlnaHQgKiAxLjEgLy8gc2hpZnQgaGVpZ2h0IHBsdXMgdG9wIG1hcmdpblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHNvdXJjZUJsb2NrLmJvdW5kcy5sZWZ0IDwgMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGp1c3QgZm9yIGxvbmcgc291cmNlIGxpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2NrLmJvdW5kcy5sZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBib3guYWRkQ2hpbGQoc291cmNlQmxvY2spO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IGJveC5ib3VuZHMuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICBib3VuZHMuc2l6ZSA9IGJvdW5kcy5zaXplLm11bHRpcGx5KDEgKyB0aGlzLm1hcmdpbkZhY3Rvcik7XG4gICAgICAgICAgICAgICAgYm91bmRzLmNlbnRlciA9IGJveC5ib3VuZHMuY2VudGVyO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSBwYXBlci5TaGFwZS5SZWN0YW5nbGUoYm91bmRzKTtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLmZpbGxDb2xvciA9IGJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgICAgICAgICBib3guaW5zZXJ0Q2hpbGQoMCwgYmFja2dyb3VuZCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYm94O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHJhbmRvbUxvd2VyUGF0aEZvcihcbiAgICAgICAgICAgIHVwcGVyOiBwYXBlci5QYXRoLFxuICAgICAgICAgICAgYXZnSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgICAgICBudW1Qb2ludHMsXG4gICAgICAgICAgICBzZWVkUmFuZG9tOiBGcmFtZXdvcmsuU2VlZFJhbmRvbVxuICAgICAgICApOiBwYXBlci5QYXRoIHtcbiAgICAgICAgICAgIGNvbnN0IHBvaW50czogcGFwZXIuUG9pbnRbXSA9IFtdO1xuICAgICAgICAgICAgbGV0IHVwcGVyQ2VudGVyID0gdXBwZXIuYm91bmRzLmNlbnRlcjtcbiAgICAgICAgICAgIGxldCB4ID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUG9pbnRzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gdXBwZXJDZW50ZXIueSArIChzZWVkUmFuZG9tLnJhbmRvbSgpIC0gMC41KSAqIHRoaXMubGluZUhlaWdodFZhcmlhdGlvbiAqIGF2Z0hlaWdodDtcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChuZXcgcGFwZXIuUG9pbnQoeCwgeSkpO1xuICAgICAgICAgICAgICAgIHggKz0gdXBwZXIuYm91bmRzLndpZHRoIC8gKG51bVBvaW50cyAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IG5ldyBwYXBlci5QYXRoKHBvaW50cyk7XG4gICAgICAgICAgICBwYXRoLnNtb290aCgpO1xuICAgICAgICAgICAgcGF0aC5ib3VuZHMuY2VudGVyID0gdXBwZXIuYm91bmRzLmNlbnRlci5hZGQobmV3IHBhcGVyLlBvaW50KDAsIGF2Z0hlaWdodCkpO1xuICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGJhbGFuY2VMaW5lcyh3b3Jkczogc3RyaW5nW10sIHRhcmdldExlbmd0aDogbnVtYmVyKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGNhbGNTY29yZSA9ICh0ZXh0OiBzdHJpbmcpID0+XG4gICAgICAgICAgICAgICAgTWF0aC5wb3coTWF0aC5hYnModGFyZ2V0TGVuZ3RoIC0gdGV4dC5sZW5ndGgpLCAyKTtcblxuICAgICAgICAgICAgbGV0IGN1cnJlbnRMaW5lID0gbnVsbDtcbiAgICAgICAgICAgIGxldCBjdXJyZW50U2NvcmUgPSAxMDAwMDtcblxuICAgICAgICAgICAgd2hpbGUgKHdvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmQgPSB3b3Jkcy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xpbmUgPSBjdXJyZW50TGluZSArIFwiIFwiICsgd29yZDtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdTY29yZSA9IGNhbGNTY29yZShuZXdMaW5lKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudExpbmUgJiYgbmV3U2NvcmUgPD0gY3VycmVudFNjb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFwcGVuZFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TGluZSArPSBcIiBcIiArIHdvcmQ7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTY29yZSA9IG5ld1Njb3JlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5ldyBsaW5lXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaChjdXJyZW50TGluZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSB3b3JkO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NvcmUgPSBjYWxjU2NvcmUoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpbmVzLnB1c2goY3VycmVudExpbmUpO1xuICAgICAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVUZXh0RW50cnkoKTogQnVpbGRlckNvbnRyb2wge1xuICAgICAgICAgICAgY29uc3QgbWFpblRleHRJbnB1dCA9IG5ldyBUZXh0SW5wdXQoKTtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVRleHRJbnB1dCA9IG5ldyBUZXh0SW5wdXQoKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY3JlYXRlTm9kZTogKHZhbHVlOiBUZW1wbGF0ZVN0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImgzXCIsIHt9LCBbXCJNZXNzYWdlXCJdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluVGV4dElucHV0LmNyZWF0ZU5vZGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICYmIHZhbHVlLmRlc2lnbi5jb250ZW50ICYmIHZhbHVlLmRlc2lnbi5jb250ZW50LnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiV2hhdCBkbyB5b3Ugd2FudCB0byBzYXk/XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVRleHRJbnB1dC5jcmVhdGVOb2RlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSAmJiB2YWx1ZS5kZXNpZ24uY29udGVudCAmJiB2YWx1ZS5kZXNpZ24uY29udGVudC5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiU291cmNlIChhdXRob3IsIHBhc3NhZ2UsIGV0YylcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdmFsdWUkOiBSeC5PYnNlcnZhYmxlLm1lcmdlKFxuICAgICAgICAgICAgICAgICAgICBtYWluVGV4dElucHV0LnZhbHVlJC5tYXAodCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPFRlbXBsYXRlU3RhdGVDaGFuZ2U+eyBkZXNpZ246IHsgY29udGVudDogeyB0ZXh0OiB0IH0gfSB9KVxuICAgICAgICAgICAgICAgICAgICAsIHNvdXJjZVRleHRJbnB1dC52YWx1ZSQubWFwKHQgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPnsgZGVzaWduOiB7IGNvbnRlbnQ6IHsgc291cmNlOiB0IH0gfSB9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgY3JlYXRlU2hhcGVDaG9vc2VyKGNvbnRleHQ6IFRlbXBsYXRlVUlDb250ZXh0KTogQnVpbGRlckNvbnRyb2wge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8VGVtcGxhdGVTdGF0ZUNoYW5nZT4oKTtcbiAgICAgICAgICAgIHJldHVybiA8QnVpbGRlckNvbnRyb2w+e1xuICAgICAgICAgICAgICAgIGNyZWF0ZU5vZGU6ICh0czogVGVtcGxhdGVTdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGFwZXMgPSBbXCJuYXJyb3dcIl07XG4gICAgICAgICAgICAgICAgICAgIC8vIGJhbGFuY2VkIG9ubHkgYXZhaWxhYmxlIGZvciA+PSBOIHdvcmRzXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cy5kZXNpZ24uY29udGVudCAmJiB0cy5kZXNpZ24uY29udGVudC50ZXh0ICYmIHRzLmRlc2lnbi5jb250ZW50LnRleHQuc3BsaXQoL1xccy8pLmxlbmd0aCA+PSA3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFwZXMucHVzaChcImJhbGFuY2VkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNoYXBlcy5wdXNoKFwid2lkZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hvaWNlcyA9IHNoYXBlcy5tYXAoc2hhcGUgPT4gPENvbnRyb2xIZWxwZXJzLkNob2ljZT57XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwic3BhblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzaGFwZV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hvc2VuOiB0cy5kZXNpZ24uc2hhcGUgPT09IHNoYXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSQub25OZXh0KHsgZGVzaWduOiB7IHNoYXBlIH0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBoKFwiZGl2XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImgzXCIsIHt9LCBbXCJTaGFwZVwiXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29udHJvbEhlbHBlcnMuY2hvb3NlcihjaG9pY2VzKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2YWx1ZSQ6IHZhbHVlJC5hc09ic2VydmFibGUoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgY3JlYXRlVmFyaWF0aW9uQ29udHJvbCgpOiBCdWlsZGVyQ29udHJvbCB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSQgPSBuZXcgUnguU3ViamVjdDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPigpO1xuICAgICAgICAgICAgcmV0dXJuIDxCdWlsZGVyQ29udHJvbD57XG4gICAgICAgICAgICAgICAgY3JlYXRlTm9kZTogKHRzOiBUZW1wbGF0ZVN0YXRlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gaChcImJ1dHRvbi5idG5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdmFsdWUkLm9uTmV4dCh7IGRlc2lnbjogeyBzZWVkOiBNYXRoLnJhbmRvbSgpIH0gfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiVHJ5IGFub3RoZXIgdmFyaWF0aW9uXCJdXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGgoXCJkaXZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaDNcIiwge30sIFtcIlZhcmlhdGlvblwiXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHZhbHVlJDogdmFsdWUkLmFzT2JzZXJ2YWJsZSgpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVQYWxldHRlQ2hvb3NlcigpOiBCdWlsZGVyQ29udHJvbCB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWRDb2xvcnMgPSB0aGlzLnBhbGV0dGVDb2xvcnMubWFwKGMgPT4gbmV3IHBhcGVyLkNvbG9yKDxhbnk+YykpO1xuICAgICAgICAgICAgY29uc3QgY29sb3JzID0gXy5zb3J0QnkocGFyc2VkQ29sb3JzLCBjID0+IGMuaHVlKVxuICAgICAgICAgICAgICAgIC5tYXAoYyA9PiBjLnRvQ1NTKHRydWUpKTtcblxuICAgICAgICAgICAgY29uc3QgdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8VGVtcGxhdGVTdGF0ZUNoYW5nZT4oKTtcbiAgICAgICAgICAgIHJldHVybiA8QnVpbGRlckNvbnRyb2w+e1xuICAgICAgICAgICAgICAgIGNyZWF0ZU5vZGU6ICh0czogVGVtcGxhdGVTdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWxldHRlID0gdHMuZGVzaWduLnBhbGV0dGU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNob2ljZXMgPSBjb2xvcnMubWFwKGNvbG9yID0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwiZGl2LnBhbGV0dGVUaWxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9zZW46IHBhbGV0dGUgJiYgcGFsZXR0ZS5jb2xvciA9PT0gY29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUkLm9uTmV4dCh7IGRlc2lnbjogeyBwYWxldHRlOiB7IGNvbG9yIH0gfSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnZlcnROb2RlID0gaChcImRpdlwiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwibGFiZWxcIiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiBwYWxldHRlICYmIHBhbGV0dGUuaW52ZXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHZhbHVlJC5vbk5leHQoeyBkZXNpZ246IHsgcGFsZXR0ZTogeyBpbnZlcnQ6IGV2LnRhcmdldC5jaGVja2VkIH0gfSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkludmVydCBjb2xvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gaChcImRpdi5jb2xvckNob29zZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaDNcIiwge30sIFtcIkNvbG9yXCJdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb250cm9sSGVscGVycy5jaG9vc2VyKGNob2ljZXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmVydE5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdmFsdWUkOiB2YWx1ZSQuYXNPYnNlcnZhYmxlKClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHBhbGV0dGVDb2xvcnMgPSBbXG4gICAgICAgICAgICBcIiM0YjM4MzJcIixcbiAgICAgICAgICAgIFwiIzg1NDQ0MlwiLFxuICAgICAgICAgICAgLy9cIiNmZmY0ZTZcIixcbiAgICAgICAgICAgIFwiIzNjMmYyZlwiLFxuICAgICAgICAgICAgXCIjYmU5YjdiXCIsXG5cbiAgICAgICAgICAgIFwiIzFiODViOFwiLFxuICAgICAgICAgICAgXCIjNWE1MjU1XCIsXG4gICAgICAgICAgICBcIiM1NTllODNcIixcbiAgICAgICAgICAgIFwiI2FlNWE0MVwiLFxuICAgICAgICAgICAgXCIjYzNjYjcxXCIsXG5cbiAgICAgICAgICAgIFwiIzBlMWE0MFwiLFxuICAgICAgICAgICAgXCIjMjIyZjViXCIsXG4gICAgICAgICAgICBcIiM1ZDVkNWRcIixcbiAgICAgICAgICAgIFwiIzk0NmIyZFwiLFxuICAgICAgICAgICAgXCIjMDAwMDAwXCIsXG5cbiAgICAgICAgICAgIFwiI2VkYzk1MVwiLFxuICAgICAgICAgICAgXCIjZWI2ODQxXCIsXG4gICAgICAgICAgICBcIiNjYzJhMzZcIixcbiAgICAgICAgICAgIFwiIzRmMzcyZFwiLFxuICAgICAgICAgICAgXCIjMDBhMGIwXCIsXG4gICAgICAgIF07XG5cbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcblxuICAgIGV4cG9ydCBjbGFzcyBEb2N1bWVudEtleUhhbmRsZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xuXG4gICAgICAgICAgICAvLyBub3RlOiB1bmRpc3Bvc2VkIGV2ZW50IHN1YnNjcmlwdGlvblxuICAgICAgICAgICAgJChkb2N1bWVudCkua2V5dXAoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gRG9tSGVscGVycy5LZXlDb2Rlcy5Fc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGNsYXNzIFNrZXRjaEVkaXRvck1vZHVsZSB7XG5cbiAgICAgICAgYXBwU3RvcmU6IEFwcC5TdG9yZTtcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xuICAgICAgICB3b3Jrc3BhY2VDb250cm9sbGVyOiBXb3Jrc3BhY2VDb250cm9sbGVyO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGFwcFN0b3JlOiBBcHAuU3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUgPSBhcHBTdG9yZTtcblxuICAgICAgICAgICAgRG9tSGVscGVycy5pbml0RXJyb3JIYW5kbGVyKGVycm9yRGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IEpTT04uc3RyaW5naWZ5KGVycm9yRGF0YSk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvY2xpZW50LWVycm9yc1wiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGNvbnRlbnRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoYXBwU3RvcmUpO1xuXG4gICAgICAgICAgICBjb25zdCBiYXIgPSBuZXcgRWRpdG9yQmFyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNpZ25lcicpLCB0aGlzLnN0b3JlKTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbUVkaXRvciA9IG5ldyBTZWxlY3RlZEl0ZW1FZGl0b3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0b3JPdmVybGF5XCIpLCB0aGlzLnN0b3JlKTtcbiAgICAgICAgICAgIGNvbnN0IGhlbHBEaWFsb2cgPSBuZXcgSGVscERpYWxvZyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlbHAtZGlhbG9nXCIpLCB0aGlzLnN0b3JlKTtcbiAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvblBhbmVsID0gbmV3IE9wZXJhdGlvblBhbmVsKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3BlcmF0aW9uUGFuZWxcIiksIHRoaXMuc3RvcmUpO1xuXG4gICAgICAgICAgICAvLyB0aGlzLnN0b3JlLmV2ZW50cy5zdWJzY3JpYmUobSA9PiBjb25zb2xlLmxvZyhcImV2ZW50XCIsIG0udHlwZSwgbS5kYXRhKSk7XG4gICAgICAgICAgICAvLyB0aGlzLnN0b3JlLmFjdGlvbnMuc3Vic2NyaWJlKG0gPT4gY29uc29sZS5sb2coXCJhY3Rpb25cIiwgbS50eXBlLCBtLmRhdGEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmV2ZW50cy5lZGl0b3IuZm9udExvYWRlZC5vYnNlcnZlKCkuZmlyc3QoKS5zdWJzY3JpYmUobSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLndvcmtzcGFjZUNvbnRyb2xsZXIgPSBuZXcgV29ya3NwYWNlQ29udHJvbGxlcih0aGlzLnN0b3JlLCBtLmRhdGEpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci5pbml0V29ya3NwYWNlLmRpc3BhdGNoKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmV2ZW50cy5lZGl0b3Iud29ya3NwYWNlSW5pdGlhbGl6ZWQuc3ViKCgpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oXCJiZWZvcmV1bmxvYWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoSXNEaXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIllvdXIgbGF0ZXN0IGNoYW5nZXMgYXJlIG5vdCBzYXZlZCB5ZXQuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgb3BlblNrZXRjaChpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLm9wZW4uZGlzcGF0Y2goaWQpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cbiIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGNsYXNzIFNrZXRjaEhlbHBlcnMge1xuXG4gICAgICAgIHN0YXRpYyBjb2xvcnNJblVzZShza2V0Y2g6IFNrZXRjaCk6IHN0cmluZ1tdIHtcbiAgICAgICAgICAgIGxldCBjb2xvcnMgPSBbc2tldGNoLmJhY2tncm91bmRDb2xvcl07XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIHNrZXRjaC50ZXh0QmxvY2tzKSB7XG4gICAgICAgICAgICAgICAgY29sb3JzLnB1c2goYmxvY2suYmFja2dyb3VuZENvbG9yKTtcbiAgICAgICAgICAgICAgICBjb2xvcnMucHVzaChibG9jay50ZXh0Q29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sb3JzID0gXy51bmlxKGNvbG9ycy5maWx0ZXIoYyA9PiBjICE9IG51bGwpKTtcbiAgICAgICAgICAgIGNvbG9ycy5zb3J0KCk7XG4gICAgICAgICAgICByZXR1cm4gY29sb3JzO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzdGF0aWMgZ2V0U2tldGNoRmlsZU5hbWUoc2tldGNoOiBTa2V0Y2gsIGxlbmd0aDogbnVtYmVyLCBleHRlbnNpb24/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBcIlwiO1xuICAgICAgICAgICAgb3V0ZXI6XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIHNrZXRjaC50ZXh0QmxvY2tzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB3b3JkIG9mIGJsb2NrLnRleHQuc3BsaXQoL1xccy8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyaW0gPSB3b3JkLnJlcGxhY2UoL1xcVy9nLCAnJykudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHJpbS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lLmxlbmd0aCkgbmFtZSArPSBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgKz0gdHJpbTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGggPj0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhayBvdXRlcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbmFtZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gXCJmaWRkbGVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBleHRlbnNpb24gPyBuYW1lICsgXCIuXCIgKyBleHRlbnNpb24gOiBuYW1lO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJcbm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgLyoqXG4gICAgICogVGhlIHNpbmdsZXRvbiBTdG9yZSBjb250cm9scyBhbGwgYXBwbGljYXRpb24gc3RhdGUuXG4gICAgICogTm8gcGFydHMgb3V0c2lkZSBvZiB0aGUgU3RvcmUgbW9kaWZ5IGFwcGxpY2F0aW9uIHN0YXRlLlxuICAgICAqIENvbW11bmljYXRpb24gd2l0aCB0aGUgU3RvcmUgaXMgZG9uZSB0aHJvdWdoIG1lc3NhZ2UgQ2hhbm5lbHM6IFxuICAgICAqICAgLSBBY3Rpb25zIGNoYW5uZWwgdG8gc2VuZCBpbnRvIHRoZSBTdG9yZSxcbiAgICAgKiAgIC0gRXZlbnRzIGNoYW5uZWwgdG8gcmVjZWl2ZSBub3RpZmljYXRpb24gZnJvbSB0aGUgU3RvcmUuXG4gICAgICogT25seSB0aGUgU3RvcmUgY2FuIHJlY2VpdmUgYWN0aW9uIG1lc3NhZ2VzLlxuICAgICAqIE9ubHkgdGhlIFN0b3JlIGNhbiBzZW5kIGV2ZW50IG1lc3NhZ2VzLlxuICAgICAqIFRoZSBTdG9yZSBjYW5ub3Qgc2VuZCBhY3Rpb25zIG9yIGxpc3RlbiB0byBldmVudHMgKHRvIGF2b2lkIGxvb3BzKS5cbiAgICAgKiBNZXNzYWdlcyBhcmUgdG8gYmUgdHJlYXRlZCBhcyBpbW11dGFibGUuXG4gICAgICogQWxsIG1lbnRpb25zIG9mIHRoZSBTdG9yZSBjYW4gYmUgYXNzdW1lZCB0byBtZWFuLCBvZiBjb3Vyc2UsXG4gICAgICogICBcIlRoZSBTdG9yZSBhbmQgaXRzIHN1Yi1jb21wb25lbnRzLlwiXG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIFN0b3JlIHtcblxuICAgICAgICBzdGF0aWMgQlJPV1NFUl9JRF9LRVkgPSBcImJyb3dzZXJJZFwiO1xuICAgICAgICBzdGF0aWMgRkFMTEJBQ0tfRk9OVF9VUkwgPSBcIi9mb250cy9Sb2JvdG8tNTAwLnR0ZlwiO1xuICAgICAgICBzdGF0aWMgREVGQVVMVF9GT05UX05BTUUgPSBcIlJvYm90b1wiO1xuICAgICAgICBzdGF0aWMgU0tFVENIX0xPQ0FMX0NBQ0hFX0tFWSA9IFwiZmlkZGxlc3RpY2tzLmlvLmxhc3RTa2V0Y2hcIjtcbiAgICAgICAgc3RhdGljIExPQ0FMX0NBQ0hFX0RFTEFZX01TID0gMTAwMDtcbiAgICAgICAgc3RhdGljIFNFUlZFUl9TQVZFX0RFTEFZX01TID0gMTAwMDA7XG4gICAgICAgIHN0YXRpYyBHUkVFVElOR19TS0VUQ0hfSUQgPSBcImltMmJhOTJpMTcxNGlcIjtcblxuICAgICAgICBmb250TGlzdExpbWl0ID0gMjUwO1xuXG4gICAgICAgIHN0YXRlOiBFZGl0b3JTdGF0ZSA9IHt9O1xuICAgICAgICByZXNvdXJjZXM6IFN0b3JlUmVzb3VyY2VzID0ge307XG4gICAgICAgIGFjdGlvbnMgPSBuZXcgQWN0aW9ucygpO1xuICAgICAgICBldmVudHMgPSBuZXcgRXZlbnRzKCk7XG5cbiAgICAgICAgcHJpdmF0ZSBhcHBTdG9yZTogQXBwLlN0b3JlXG4gICAgICAgIHByaXZhdGUgX29wZXJhdGlvbiQgPSBuZXcgUnguU3ViamVjdDxPcGVyYXRpb24+KCk7XG4gICAgICAgIHByaXZhdGUgX3RyYW5zcGFyZW5jeSQgPSBuZXcgUnguU3ViamVjdDxib29sZWFuPigpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGFwcFN0b3JlOiBBcHAuU3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUgPSBhcHBTdG9yZVxuXG4gICAgICAgICAgICB0aGlzLnNldHVwU3RhdGUoKVxuXG4gICAgICAgICAgICB0aGlzLnNldHVwU3Vic2NyaXB0aW9ucygpXG5cbiAgICAgICAgICAgIHRoaXMubG9hZFJlc291cmNlcygpXG4gICAgICAgIH1cblxuICAgICAgICBzZXR1cFN0YXRlKCkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5icm93c2VySWQgPSBDb29raWVzLmdldChTdG9yZS5CUk9XU0VSX0lEX0tFWSlcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5icm93c2VySWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmJyb3dzZXJJZCA9IEZyYW1ld29yay5uZXdpZCgpXG4gICAgICAgICAgICAgICAgQ29va2llcy5zZXQoU3RvcmUuQlJPV1NFUl9JRF9LRVksIHRoaXMuc3RhdGUuYnJvd3NlcklkLCB7IGV4cGlyZXM6IDIgKiAzNjUgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNldHVwU3Vic2NyaXB0aW9ucygpIHtcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLmFjdGlvbnMsIGV2ZW50cyA9IHRoaXMuZXZlbnRzXG5cbiAgICAgICAgICAgIC8vIC0tLS0tIEFwcCAtLS0tLVxuXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlLmV2ZW50cy5yb3V0ZUNoYW5nZWQuc3ViKHJvdXRlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByb3V0ZVNrZXRjaElkID0gcm91dGUucGFyYW1zLnNrZXRjaElkXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlLm5hbWUgPT09IFwic2tldGNoXCIgJiYgcm91dGVTa2V0Y2hJZCAhPT0gdGhpcy5zdGF0ZS5za2V0Y2guX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlblNrZXRjaChyb3V0ZVNrZXRjaElkKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vIC0tLS0tIEVkaXRvciAtLS0tLVxuXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci5pbml0V29ya3NwYWNlLm9ic2VydmUoKVxuICAgICAgICAgICAgICAgIC5wYXVzYWJsZUJ1ZmZlcmVkKGV2ZW50cy5lZGl0b3IucmVzb3VyY2VzUmVhZHkub2JzZXJ2ZSgpLm1hcChtID0+IG0uZGF0YSkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsLCB0cnVlKVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNrZXRjaElkID0gdGhpcy5hcHBTdG9yZS5zdGF0ZS5yb3V0ZS5wYXJhbXMuc2tldGNoSWRcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IHRoaXMuYXBwU3RvcmUuc3RhdGUubGFzdFNhdmVkU2tldGNoSWRcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb21pc2U6IFByb21pc2U8YW55PlxuICAgICAgICAgICAgICAgICAgICBpZiAoc2tldGNoSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSB0aGlzLm9wZW5Ta2V0Y2goc2tldGNoSWQpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlID0gdGhpcy5sb2FkR3JlZXRpbmdTa2V0Y2goKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbigoKSA9PiBldmVudHMuZWRpdG9yLndvcmtzcGFjZUluaXRpYWxpemVkLmRpc3BhdGNoKCkpXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gb24gYW55IGFjdGlvbiwgdXBkYXRlIHNhdmUgZGVsYXkgdGltZXJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25zLm9ic2VydmUoKS5kZWJvdW5jZShTdG9yZS5TRVJWRVJfU0FWRV9ERUxBWV9NUylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNrZXRjaCA9IHRoaXMuc3RhdGUuc2tldGNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmxvYWRpbmdTa2V0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHNrZXRjaC5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgc2tldGNoLnRleHRCbG9ja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVNrZXRjaChza2V0Y2gpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci5sb2FkRm9udC5zdWJzY3JpYmUobSA9PlxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChtLmRhdGEpKVxuXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci56b29tVG9GaXQuZm9yd2FyZChcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLnpvb21Ub0ZpdFJlcXVlc3RlZClcblxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3IuZXhwb3J0UE5HLnN1YnNjcmliZShtID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihudWxsKVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbClcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLmV4cG9ydFBOR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kR0FFeHBvcnQobS5kYXRhLnBpeGVscylcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmV4cG9ydFNWRy5zdWJzY3JpYmUobSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbClcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwpXG4gICAgICAgICAgICAgICAgZXZlbnRzLmVkaXRvci5leHBvcnRTVkdSZXF1ZXN0ZWQuZGlzcGF0Y2gobS5kYXRhKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3Iudmlld0NoYW5nZWQuc3Vic2NyaWJlKG0gPT4ge1xuICAgICAgICAgICAgICAgIGV2ZW50cy5lZGl0b3Iudmlld0NoYW5nZWQuZGlzcGF0Y2gobS5kYXRhKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3IudXBkYXRlU25hcHNob3Quc3ViKCh7IHNrZXRjaElkLCBwbmdEYXRhVXJsIH0pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2tldGNoSWQgPT09IHRoaXMuc3RhdGUuc2tldGNoLl9pZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IHNrZXRjaElkICsgXCIucG5nXCJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxvYiA9IERvbUhlbHBlcnMuZGF0YVVSTFRvQmxvYihwbmdEYXRhVXJsKVxuICAgICAgICAgICAgICAgICAgICBTM0FjY2Vzcy5wdXRGaWxlKGZpbGVOYW1lLCBcImltYWdlL3BuZ1wiLCBibG9iKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNob3dIZWxwID0gIXRoaXMuc3RhdGUuc2hvd0hlbHBcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLnNob3dIZWxwQ2hhbmdlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnNob3dIZWxwKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3Iub3BlblNhbXBsZS5zdWIoKCkgPT4gdGhpcy5sb2FkR3JlZXRpbmdTa2V0Y2goKSlcblxuICAgICAgICAgICAgLy8gLS0tLS0gU2tldGNoIC0tLS0tXG5cbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLm9wZW4uc3ViKGlkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5Ta2V0Y2goaWQpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5jcmVhdGUuc3ViKChhdHRyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdTa2V0Y2goYXR0cilcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLmNsZWFyLnN1YigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclNrZXRjaCgpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5jbG9uZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsb25lID0gXy5jbG9uZSh0aGlzLnN0YXRlLnNrZXRjaClcbiAgICAgICAgICAgICAgICBjbG9uZS5faWQgPSBGcmFtZXdvcmsubmV3aWQoKVxuICAgICAgICAgICAgICAgIGNsb25lLmJyb3dzZXJJZCA9IHRoaXMuc3RhdGUuYnJvd3NlcklkXG4gICAgICAgICAgICAgICAgY2xvbmUuc2F2ZWRBdCA9IG51bGxcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goY2xvbmUpXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5ID0gZmFsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guY2xvbmVkLmRpc3BhdGNoKGNsb25lKVxuICAgICAgICAgICAgICAgIHRoaXMucHVsc2VVc2VyTWVzc2FnZShcIkR1cGxpY2F0ZWQgc2tldGNoLiBBZGRyZXNzIG9mIHRoaXMgcGFnZSBoYXMgYmVlbiB1cGRhdGVkLlwiKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZS5zdWJzY3JpYmUoZXYgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubWVyZ2UodGhpcy5zdGF0ZS5za2V0Y2gsIGV2LmRhdGEpXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guYmFja2dyb3VuZENvbG9yID0gZXYuZGF0YS5iYWNrZ3JvdW5kQ29sb3JcbiAgICAgICAgICAgICAgICBldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkLmRpc3BhdGNoKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaClcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5zdWJzY3JpYmUobSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obS5kYXRhKVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obS5kYXRhKVxuICAgICAgICAgICAgfSlcblxuXG4gICAgICAgICAgICAvLyAtLS0tLSBUZXh0QmxvY2sgLS0tLS1cblxuICAgICAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2suYWRkXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbClcblxuICAgICAgICAgICAgICAgICAgICBsZXQgcGF0Y2ggPSBldi5kYXRhXG4gICAgICAgICAgICAgICAgICAgIGlmICghcGF0Y2gudGV4dCB8fCAhcGF0Y2gudGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHsgX2lkOiBGcmFtZXdvcmsubmV3aWQoKSB9IGFzIFRleHRCbG9ja1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lcmdlKGJsb2NrLCBwYXRjaClcblxuICAgICAgICAgICAgICAgICAgICBibG9jay50ZXh0Q29sb3IgPSB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ci50ZXh0Q29sb3JcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suYmFja2dyb3VuZENvbG9yID0gdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIuYmFja2dyb3VuZENvbG9yXG4gICAgICAgICAgICAgICAgICAgIGlmICghYmxvY2suZm9udEZhbWlseSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2suZm9udEZhbWlseSA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLmZvbnRGYW1pbHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLmZvbnRWYXJpYW50ID0gdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIuZm9udFZhcmlhbnRcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MucHVzaChibG9jaylcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnRleHRibG9jay5hZGRlZC5kaXNwYXRjaChibG9jaylcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkU2tldGNoQ29udGVudCgpXG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkVGV4dEJsb2NrRm9udChibG9jaylcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuZ2V0QmxvY2soZXYuZGF0YS5faWQpXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGNoID0gPFRleHRCbG9jaz57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZXYuZGF0YS50ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogZXYuZGF0YS5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBldi5kYXRhLnRleHRDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBldi5kYXRhLmZvbnRGYW1pbHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFZhcmlhbnQ6IGV2LmRhdGEuZm9udFZhcmlhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvbnRDaGFuZ2VkID0gcGF0Y2guZm9udEZhbWlseSAhPT0gYmxvY2suZm9udEZhbWlseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHBhdGNoLmZvbnRWYXJpYW50ICE9PSBibG9jay5mb250VmFyaWFudFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXJnZShibG9jaywgcGF0Y2gpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibG9jay5mb250RmFtaWx5ICYmICFibG9jay5mb250VmFyaWFudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMucmVzb3VyY2VzLmZvbnRDYXRhbG9nLmdldFJlY29yZChibG9jay5mb250RmFtaWx5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVndWxhciBvciBlbHNlIGZpcnN0IHZhcmlhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2suZm9udFZhcmlhbnQgPSBGb250U2hhcGUuRm9udENhdGFsb2cuZGVmYXVsdFZhcmlhbnQocmVjb3JkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBibG9jay50ZXh0Q29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBibG9jay5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogYmxvY2suZm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogYmxvY2suZm9udFZhcmlhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnRleHRibG9jay5hdHRyQ2hhbmdlZC5kaXNwYXRjaChibG9jaylcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm9udENoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRUZXh0QmxvY2tGb250KGJsb2NrKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgYWN0aW9ucy50ZXh0QmxvY2sucmVtb3ZlXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkaWREZWxldGUgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICBfLnJlbW92ZSh0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLCB0YiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGIuX2lkID09PSBldi5kYXRhLl9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZERlbGV0ZSA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlkRGVsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLnJlbW92ZWQuZGlzcGF0Y2goeyBfaWQ6IGV2LmRhdGEuX2lkIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2VcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5nZXRCbG9jayhldi5kYXRhLl9pZClcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5wb3NpdGlvbiA9IGV2LmRhdGEucG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLm91dGxpbmUgPSBldi5kYXRhLm91dGxpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXJyYW5nZUNoYW5nZWQuZGlzcGF0Y2goYmxvY2spXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBnZXQgb3BlcmF0aW9uJCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vcGVyYXRpb24kLmFzT2JzZXJ2YWJsZSgpXG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdHJhbnNwYXJlbmN5JCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90cmFuc3BhcmVuY3kkLmFzT2JzZXJ2YWJsZSgpXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2hvd09wZXJhdGlvbihvcGVyYXRpb246IE9wZXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5vcGVyYXRpb24gPSBvcGVyYXRpb25cbiAgICAgICAgICAgIG9wZXJhdGlvbi5vbkNsb3NlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLm9wZXJhdGlvbiA9PT0gb3BlcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZU9wZXJhdGlvbigpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fb3BlcmF0aW9uJC5vbk5leHQob3BlcmF0aW9uKVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhpZGVPcGVyYXRpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLm9wZXJhdGlvbiA9IG51bGxcbiAgICAgICAgICAgIHRoaXMuX29wZXJhdGlvbiQub25OZXh0KG51bGwpXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaW1hZ2VVcGxvYWRlZChzcmM6IHN0cmluZykge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS51cGxvYWRlZEltYWdlID0gc3JjXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guaW1hZ2VVcGxvYWRlZC5kaXNwYXRjaChzcmMpXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUudHJhbnNwYXJlbmN5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUcmFuc3BhcmVuY3kodHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZW1vdmVVcGxvYWRlZEltYWdlKCkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS51cGxvYWRlZEltYWdlID0gbnVsbFxuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmltYWdlVXBsb2FkZWQuZGlzcGF0Y2gobnVsbClcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnRyYW5zcGFyZW5jeSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VHJhbnNwYXJlbmN5KGZhbHNlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldFRyYW5zcGFyZW5jeSh2YWx1ZT86IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudHJhbnNwYXJlbmN5ID0gdmFsdWVcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zcGFyZW5jeSQub25OZXh0KHRoaXMuc3RhdGUudHJhbnNwYXJlbmN5KVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBvcGVuU2tldGNoKGlkOiBzdHJpbmcpOiBQcm9taXNlPFNrZXRjaD4ge1xuICAgICAgICAgICAgaWYgKCFpZCB8fCAhaWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gUzNBY2Nlc3MuZ2V0SnNvbihpZCArIFwiLmpzb25cIilcbiAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgKHNrZXRjaDogU2tldGNoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goc2tldGNoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJldHJpZXZlZCBza2V0Y2hcIiwgc2tldGNoLl9pZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChza2V0Y2guYnJvd3NlcklkID09PSB0aGlzLnN0YXRlLmJyb3dzZXJJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTa2V0Y2ggd2FzIGNyZWF0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTa2V0Y2ggd2FzIGNyZWF0ZWQgaW4gYSBkaWZmZXJlbnQgYnJvd3NlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBza2V0Y2hcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImVycm9yIGdldHRpbmcgcmVtb3RlIHNrZXRjaFwiLCBlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRHcmVldGluZ1NrZXRjaCgpXG4gICAgICAgICAgICAgICAgICAgIH0pIGFzIHVua25vd24gYXMgUHJvbWlzZTxTa2V0Y2g+XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgbG9hZFNrZXRjaChza2V0Y2g6IFNrZXRjaCkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5sb2FkaW5nU2tldGNoID0gdHJ1ZVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2ggPSBza2V0Y2hcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eSA9IGZhbHNlXG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpXG5cbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5sb2FkZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlLmFjdGlvbnMuZWRpdG9yTG9hZGVkU2tldGNoLmRpc3BhdGNoKHNrZXRjaC5faWQpXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRiIG9mIHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy50ZXh0YmxvY2subG9hZGVkLmRpc3BhdGNoKHRiKVxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFRleHRCbG9ja0ZvbnQodGIpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVkaXRvci56b29tVG9GaXRSZXF1ZXN0ZWQuZGlzcGF0Y2goKVxuXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmxvYWRpbmdTa2V0Y2ggPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBsb2FkR3JlZXRpbmdTa2V0Y2goKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChnZXREZWZhdWx0RHJhd2luZygpKVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgnZ3JlZXRpbmcnKVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBjbGVhclNrZXRjaCgpIHtcbiAgICAgICAgICAgIGNvbnN0IHNrZXRjaCA9IDxTa2V0Y2g+dGhpcy5kZWZhdWx0U2tldGNoQXR0cigpXG4gICAgICAgICAgICBza2V0Y2guX2lkID0gdGhpcy5zdGF0ZS5za2V0Y2guX2lkXG4gICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goc2tldGNoKVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBsb2FkUmVzb3VyY2VzKCkge1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMgPSBuZXcgRm9udFNoYXBlLlBhcnNlZEZvbnRzKHBhcnNlZCA9PlxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVkaXRvci5mb250TG9hZGVkLmRpc3BhdGNoKHBhcnNlZC5mb250KSlcblxuICAgICAgICAgICAgRm9udFNoYXBlLkZvbnRDYXRhbG9nLmZyb21Mb2NhbChcImZvbnRzL2dvb2dsZS1mb250cy5qc29uXCIpXG4gICAgICAgICAgICAgICAgLnRoZW4oY2F0YWxvZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZvbnRDYXRhbG9nID0gY2F0YWxvZ1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvYWQgZm9udHMgaW50byBicm93c2VyIGZvciBwcmV2aWV3XG4gICAgICAgICAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5sb2FkUHJldmlld1N1YnNldHMoXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRhbG9nLmdldExpc3QodGhpcy5mb250TGlzdExpbWl0KS5tYXAoZiA9PiBmLmZhbWlseSkpXG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KFN0b3JlLkZBTExCQUNLX0ZPTlRfVVJMKS50aGVuKCh7IGZvbnQgfSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZhbGxiYWNrRm9udCA9IGZvbnQpXG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnJlc291cmNlc1JlYWR5LmRpc3BhdGNoKHRydWUpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc2V0VXNlck1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS51c2VyTWVzc2FnZSAhPT0gbWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUudXNlck1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnVzZXJNZXNzYWdlQ2hhbmdlZC5kaXNwYXRjaChtZXNzYWdlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBwdWxzZVVzZXJNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICAgICAgdGhpcy5zZXRVc2VyTWVzc2FnZShtZXNzYWdlKVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpLCA0MDAwKVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzZXREZWZhdWx0VXNlck1lc3NhZ2UoKSB7XG4gICAgICAgICAgICAvLyBpZiBub3QgdGhlIGxhc3Qgc2F2ZWQgc2tldGNoLCBvciBza2V0Y2ggaXMgZGlydHksIHNob3cgXCJVbnNhdmVkXCJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAodGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5XG4gICAgICAgICAgICAgICAgfHwgIXRoaXMuc3RhdGUuc2tldGNoLnNhdmVkQXQpXG4gICAgICAgICAgICAgICAgPyBcIlVuc2F2ZWRcIlxuICAgICAgICAgICAgICAgIDogXCJTYXZlZFwiXG4gICAgICAgICAgICB0aGlzLnNldFVzZXJNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGxvYWRUZXh0QmxvY2tGb250KGJsb2NrOiBUZXh0QmxvY2spIHtcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcy5mb250Q2F0YWxvZy5nZXRVcmwoYmxvY2suZm9udEZhbWlseSwgYmxvY2suZm9udFZhcmlhbnQpKVxuICAgICAgICAgICAgICAgIC50aGVuKCh7IGZvbnQgfSkgPT5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmZvbnRSZWFkeS5kaXNwYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dEJsb2NrSWQ6IGJsb2NrLl9pZCwgZm9udCB9KSlcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgY2hhbmdlZFNrZXRjaENvbnRlbnQoKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHkgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guY29udGVudENoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpXG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpXG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIG1lcmdlPFQ+KGRlc3Q6IFQsIHNvdXJjZTogVCkge1xuICAgICAgICAgICAgXy5tZXJnZShkZXN0LCBzb3VyY2UpXG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIG5ld1NrZXRjaChhdHRyPzogU2tldGNoQXR0cik6IFNrZXRjaCB7XG4gICAgICAgICAgICBjb25zdCBza2V0Y2ggPSA8U2tldGNoPnRoaXMuZGVmYXVsdFNrZXRjaEF0dHIoKVxuICAgICAgICAgICAgc2tldGNoLl9pZCA9IEZyYW1ld29yay5uZXdpZCgpXG4gICAgICAgICAgICBpZiAoYXR0cikge1xuICAgICAgICAgICAgICAgIHRoaXMubWVyZ2Uoc2tldGNoLCBhdHRyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKHNrZXRjaClcbiAgICAgICAgICAgIHJldHVybiBza2V0Y2hcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZGVmYXVsdFNrZXRjaEF0dHIoKSB7XG4gICAgICAgICAgICByZXR1cm4gPFNrZXRjaEF0dHI+e1xuICAgICAgICAgICAgICAgIGJyb3dzZXJJZDogdGhpcy5zdGF0ZS5icm93c2VySWQsXG4gICAgICAgICAgICAgICAgZGVmYXVsdFRleHRCbG9ja0F0dHI6IHtcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJSb2JvdG9cIixcbiAgICAgICAgICAgICAgICAgICAgZm9udFZhcmlhbnQ6IFwicmVndWxhclwiLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0Q29sb3I6IFwiZ3JheVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgICB0ZXh0QmxvY2tzOiA8VGV4dEJsb2NrW10+W11cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc2F2ZVNrZXRjaChza2V0Y2g6IFNrZXRjaCkge1xuICAgICAgICAgICAgY29uc3Qgc2F2aW5nID0gXy5jbG9uZShza2V0Y2gpXG4gICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXG4gICAgICAgICAgICBzYXZpbmcuc2F2ZWRBdCA9IG5vd1xuICAgICAgICAgICAgdGhpcy5zZXRVc2VyTWVzc2FnZShcIlNhdmluZ1wiKVxuICAgICAgICAgICAgUzNBY2Nlc3MucHV0RmlsZShza2V0Y2guX2lkICsgXCIuanNvblwiLFxuICAgICAgICAgICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiLCBKU09OLnN0cmluZ2lmeShzYXZpbmcpKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5ID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guc2F2ZWRBdCA9IG5vd1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUuYWN0aW9ucy5lZGl0b3JTYXZlZFNrZXRjaC5kaXNwYXRjaChza2V0Y2guX2lkKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lZGl0b3Iuc25hcHNob3RFeHBpcmVkLmRpc3BhdGNoKHNrZXRjaClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFVzZXJNZXNzYWdlKFwiVW5hYmxlIHRvIHNhdmVcIilcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc2V0U2VsZWN0aW9uKGl0ZW06IFdvcmtzcGFjZU9iamVjdFJlZiwgZm9yY2U6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgICAgICAgLy8gZWFybHkgZXhpdCBvbiBubyBjaGFuZ2VcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuc2VsZWN0aW9uLml0ZW1JZCA9PT0gaXRlbS5pdGVtSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNlbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0aW9uID0gaXRlbVxuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLnNlbGVjdGlvbkNoYW5nZWQuZGlzcGF0Y2goaXRlbSlcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc2V0RWRpdGluZ0l0ZW0oaXRlbTogUG9zaXRpb25lZE9iamVjdFJlZiwgZm9yY2U/OiBib29sZWFuKSB7XG4gICAgICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgICAgICAgLy8gZWFybHkgZXhpdCBvbiBubyBjaGFuZ2VcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nSXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbS5pdGVtSWQgPT09IGl0ZW0uaXRlbUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtKSB7XG4gICAgICAgICAgICAgICAgLy8gc2lnbmFsIGNsb3NpbmcgZWRpdG9yIGZvciBpdGVtXG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nSXRlbS5pdGVtVHlwZSA9PT0gXCJUZXh0QmxvY2tcIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RWRpdGluZ0Jsb2NrID0gdGhpcy5nZXRCbG9jayh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtLml0ZW1JZClcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRFZGl0aW5nQmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5lZGl0b3JDbG9zZWQuZGlzcGF0Y2goY3VycmVudEVkaXRpbmdCbG9jaylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAvLyBlZGl0aW5nIGl0ZW0gc2hvdWxkIGJlIHNlbGVjdGVkIGl0ZW1cbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihpdGVtKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmVkaXRpbmdJdGVtID0gaXRlbVxuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5kaXNwYXRjaChpdGVtKVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBnZXRCbG9jayhpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsIHRiID0+IHRiLl9pZCA9PT0gaWQpXG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHNlbmRHQUV4cG9ydCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBsZXQgbGFiZWwgPSBTa2V0Y2hIZWxwZXJzLmdldFNrZXRjaEZpbGVOYW1lKHRoaXMuc3RhdGUuc2tldGNoLCAzMClcbiAgICAgICAgICAgIGdhRXZlbnQoe1xuICAgICAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6IFwiRGVzaWduXCIsXG4gICAgICAgICAgICAgICAgZXZlbnRBY3Rpb246IFwiZXhwb3J0LWltYWdlXCIsXG4gICAgICAgICAgICAgICAgZXZlbnRMYWJlbDogbGFiZWwsXG4gICAgICAgICAgICAgICAgZXZlbnRWYWx1ZTogdmFsdWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbnRlcmZhY2UgV2luZG93IHtcbiAgICB3ZWJraXRVUkw6IFVSTDtcbn1cblxubmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgICBleHBvcnQgY2xhc3MgV29ya3NwYWNlQ29udHJvbGxlciB7XG5cbiAgICAgICAgc3RhdGljIFRFWFRfQ0hBTkdFX1JFTkRFUl9USFJPVFRMRV9NUyA9IDUwMDtcbiAgICAgICAgc3RhdGljIEJMT0NLX0JPVU5EU19DSEFOR0VfVEhST1RUTEVfTVMgPSA1MDA7XG5cbiAgICAgICAgZGVmYXVsdFNpemUgPSBuZXcgcGFwZXIuU2l6ZSg1MDAwMCwgNDAwMDApO1xuICAgICAgICBkZWZhdWx0U2NhbGUgPSAwLjAyO1xuXG4gICAgICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgICAgIHByb2plY3Q6IHBhcGVyLlByb2plY3Q7XG4gICAgICAgIGZhbGxiYWNrRm9udDogb3BlbnR5cGUuRm9udDtcbiAgICAgICAgdmlld1pvb206IHBhcGVyRXh0LlZpZXdab29tO1xuXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xuICAgICAgICBwcml2YXRlIF9za2V0Y2g6IFNrZXRjaDtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dEJsb2NrSXRlbXM6IHsgW3RleHRCbG9ja0lkOiBzdHJpbmddOiBUZXh0V2FycCB9ID0ge307XG4gICAgICAgIHByaXZhdGUgX3dvcmtzcGFjZTogcGFwZXIuSXRlbTtcbiAgICAgICAgcHJpdmF0ZSBfYmFja2dyb3VuZEltYWdlOiBwYXBlci5SYXN0ZXI7XG4gICAgICAgIHByaXZhdGUgX21hcms6IEZzdHguRnJhbWV3b3JrLldhdGVybWFyaztcblxuICAgICAgICBjb25zdHJ1Y3RvcihzdG9yZTogU3RvcmUsIGZhbGxiYWNrRm9udDogb3BlbnR5cGUuRm9udCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgICAgICAgICAgdGhpcy5mYWxsYmFja0ZvbnQgPSBmYWxsYmFja0ZvbnQ7XG4gICAgICAgICAgICBwYXBlci5zZXR0aW5ncy5oYW5kbGVTaXplID0gMTtcblxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5DYW52YXMnKTtcbiAgICAgICAgICAgIHBhcGVyLnNldHVwKHRoaXMuY2FudmFzKTtcbiAgICAgICAgICAgIHRoaXMucHJvamVjdCA9IHBhcGVyLnByb2plY3Q7XG4gICAgICAgICAgICB3aW5kb3cub25yZXNpemUgPSAoKSA9PiB0aGlzLnByb2plY3Qudmlldy5kcmF3KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNhbnZhc1NlbCA9ICQodGhpcy5jYW52YXMpO1xuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLm1lcmdlVHlwZWQoXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5sb2FkZWQsXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5hdHRyQ2hhbmdlZFxuICAgICAgICAgICAgKS5zdWJzY3JpYmUoZXYgPT4ge1xuICAgICAgICAgICAgICAgIGNhbnZhc1NlbC5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGV2LmRhdGEuYmFja2dyb3VuZENvbG9yIHx8IFwiXCIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMudmlld1pvb20gPSBuZXcgcGFwZXJFeHQuVmlld1pvb20odGhpcy5wcm9qZWN0LCAoKSA9PiBbdGhpcy5fYmFja2dyb3VuZEltYWdlXSk7XG4gICAgICAgICAgICB0aGlzLnZpZXdab29tLnNldFpvb21SYW5nZShbXG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2l6ZS5tdWx0aXBseSh0aGlzLmRlZmF1bHRTY2FsZSAqIDAuMSksXG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2l6ZS5tdWx0aXBseSgwLjUpXSk7XG4gICAgICAgICAgICB0aGlzLnZpZXdab29tLnZpZXdDaGFuZ2VkLnN1YnNjcmliZShib3VuZHMgPT4ge1xuICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuZWRpdG9yLnZpZXdDaGFuZ2VkLmRpc3BhdGNoKGJvdW5kcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgY2xlYXJTZWxlY3Rpb24gPSAoZXY6IHBhcGVyLlBhcGVyTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdG9yZS5zdGF0ZS5zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcGVyLnZpZXcub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBldiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByb2plY3QuaGl0VGVzdChldi5wb2ludCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb24oZXYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcGFwZXIudmlldy5vbihwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGNsZWFyU2VsZWN0aW9uKTtcblxuICAgICAgICAgICAgY29uc3Qga2V5SGFuZGxlciA9IG5ldyBEb2N1bWVudEtleUhhbmRsZXIoc3RvcmUpO1xuXG4gICAgICAgICAgICB0aGlzLl9tYXJrID0gbmV3IEZzdHguRnJhbWV3b3JrLldhdGVybWFyayh0aGlzLnByb2plY3QsIFwiaW1nL3NwaXJhbC1sb2dvLnN2Z1wiKTtcblxuICAgICAgICAgICAgLy8gLS0tLS0gRGVzaWduZXIgLS0tLS1cblxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci53b3Jrc3BhY2VJbml0aWFsaXplZC5zdWIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC52aWV3LmRyYXcoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLnpvb21Ub0ZpdFJlcXVlc3RlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuem9vbVRvRml0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5leHBvcnRTVkdSZXF1ZXN0ZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvd25sb2FkU1ZHKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5leHBvcnRQTkdSZXF1ZXN0ZWQuc3ViKG9wdGlvbnMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZG93bmxvYWRQTkcob3B0aW9ucyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5zbmFwc2hvdEV4cGlyZWQuc3ViKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldFNuYXBzaG90UE5HKDcyKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLmVkaXRvci51cGRhdGVTbmFwc2hvdC5kaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBza2V0Y2hJZDogdGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2guX2lkLCBwbmdEYXRhVXJsOiBkYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIC0tLS0tIFNrZXRjaCAtLS0tLVxuXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZC5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgZXYgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9za2V0Y2ggPSBldi5kYXRhO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5jbGVhcigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuZGVzZWxlY3RBbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd29ya3NwYWNlID0gbmV3IHBhcGVyLkdyb3VwKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RleHRCbG9ja0l0ZW1zID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuZGVzZWxlY3RBbGwoKTtcbiAgICAgICAgICAgICAgICBpZiAobS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IG0uZGF0YS5pdGVtSWQgJiYgdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLml0ZW1JZF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jayAmJiAhYmxvY2suc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyAtLS0tLSBUZXh0QmxvY2sgLS0tLS1cblxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLm1lcmdlVHlwZWQoXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5hZGRlZCxcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmxvYWRlZFxuICAgICAgICAgICAgKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgZXYgPT4gdGhpcy5hZGRCbG9jayhldi5kYXRhKSk7XG5cbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWRcbiAgICAgICAgICAgICAgICAub2JzZXJ2ZSgpXG4gICAgICAgICAgICAgICAgLnRocm90dGxlKFdvcmtzcGFjZUNvbnRyb2xsZXIuVEVYVF9DSEFOR0VfUkVOREVSX1RIUk9UVExFX01TKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUobSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0QmxvY2sgPSBtLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnRleHQgPSB0ZXh0QmxvY2sudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY3VzdG9tU3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suZm9udFJlYWR5LnN1YihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbZGF0YS50ZXh0QmxvY2tJZF07XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5mb250ID0gZGF0YS5mb250O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLnJlbW92ZWQuc3Vic2NyaWJlKG0gPT4ge1xuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmVkaXRvckNsb3NlZC5zdWJzY3JpYmUobSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnVwZGF0ZVRleHRQYXRoKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guaW1hZ2VVcGxvYWRlZC5zdWIodXJsID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEJhY2tncm91bmRJbWFnZSh1cmwpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHN0b3JlLnRyYW5zcGFyZW5jeSQuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl93b3Jrc3BhY2Uub3BhY2l0eSA9IHZhbHVlID8gMC43NSA6IDE7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH1cblxuICAgICAgICB6b29tVG9GaXQoKSB7XG4gICAgICAgICAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFZpZXdhYmxlQm91bmRzKCk7XG4gICAgICAgICAgICBpZiAoYm91bmRzLndpZHRoID4gMCAmJiBib3VuZHMuaGVpZ2h0ID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMudmlld1pvb20uem9vbVRvKGJvdW5kcy5zY2FsZSgxLjIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZ2V0Vmlld2FibGVCb3VuZHMoKTogcGFwZXIuUmVjdGFuZ2xlIHtcbiAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuX3dvcmtzcGFjZS5ib3VuZHM7XG4gICAgICAgICAgICBpZiAoIWJvdW5kcyB8fCBib3VuZHMud2lkdGggPT09IDAgfHwgYm91bmRzLmhlaWdodCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuUmVjdGFuZ2xlKFxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFNpemUubXVsdGlwbHkoMC4wNSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJucyBkYXRhIFVSTFxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSBnZXRTbmFwc2hvdFBORyhkcGk6IG51bWJlcik6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPihjYWxsYmFjayA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcGxldGUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhc3RlciA9IHRoaXMucHJvamVjdC5hY3RpdmVMYXllci5yYXN0ZXJpemUoZHBpLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByYXN0ZXIudG9EYXRhVVJMKCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLmJhY2tncm91bmRDb2xvcil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSB0aGlzLmluc2VydEJhY2tncm91bmQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZG93bmxvYWRQTkcob3B0aW9uczogSW1hZ2VFeHBvcnRPcHRpb25zKSB7XG4gICAgICAgICAgICBjb25zdCBkcGkgPSBQYXBlckhlbHBlcnMuZ2V0RXhwb3J0RHBpKHRoaXMuX3dvcmtzcGFjZS5ib3VuZHMuc2l6ZSwgXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5waXhlbHMgfHwgNjAwICogNjAwKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0U25hcHNob3RQTkcoZHBpKS50aGVuKGRhdGEgPT4geztcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IFNrZXRjaEhlbHBlcnMuZ2V0U2tldGNoRmlsZU5hbWUoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLCA0MCwgXCJwbmdcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgYmxvYiA9IERvbUhlbHBlcnMuZGF0YVVSTFRvQmxvYihkYXRhKTtcbiAgICAgICAgICAgICAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGRvd25sb2FkU1ZHKCkge1xuICAgICAgICAgICAgY29uc3QgY29tcGxldGVEb3dubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuZGVzZWxlY3RBbGwoKTtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YVVybCA9IFwiZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsXCIgKyBlbmNvZGVVUklDb21wb25lbnQoXG4gICAgICAgICAgICAgICAgICAgIDxzdHJpbmc+dGhpcy5wcm9qZWN0LmV4cG9ydFNWRyh7IGFzU3RyaW5nOiB0cnVlIH0pKTtcbiAgICAgICAgICAgICAgICBjb25zdCBibG9iID0gRG9tSGVscGVycy5kYXRhVVJMVG9CbG9iKGRhdGFVcmwpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gU2tldGNoSGVscGVycy5nZXRTa2V0Y2hGaWxlTmFtZShcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gsIDQwLCBcInN2Z1wiKTtcbiAgICAgICAgICAgICAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSB0aGlzLmluc2VydEJhY2tncm91bmQoZmFsc2UpO1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlRG93bmxvYWQoKTtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZURvd25sb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zZXJ0IHNrZXRjaCBiYWNrZ3JvdW5kIHRvIHByb3ZpZGUgYmFja2dyb3VuZCBmaWxsIChpZiBuZWNlc3NhcnkpXG4gICAgICAgICAqICAgYW5kIGFkZCBtYXJnaW4gYXJvdW5kIGVkZ2VzLlxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSBpbnNlcnRCYWNrZ3JvdW5kKHdhdGVybWFyazogYm9vbGVhbik6IHBhcGVyLkl0ZW0ge1xuICAgICAgICAgICAgY29uc3Qgc2tldGNoQm91bmRzID0gdGhpcy5nZXRWaWV3YWJsZUJvdW5kcygpO1xuICAgICAgICAgICAgY29uc3QgbWFyZ2luID0gTWF0aC5tYXgoc2tldGNoQm91bmRzLndpZHRoLCBza2V0Y2hCb3VuZHMuaGVpZ2h0KSAqIDAuMDI7XG4gICAgICAgICAgICBjb25zdCBpbWFnZUJvdW5kcyA9IG5ldyBwYXBlci5SZWN0YW5nbGUoXG4gICAgICAgICAgICAgICAgc2tldGNoQm91bmRzLnRvcExlZnQuc3VidHJhY3QobWFyZ2luKSxcbiAgICAgICAgICAgICAgICBza2V0Y2hCb3VuZHMuYm90dG9tUmlnaHQuYWRkKG1hcmdpbikpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBmaWxsID0gcGFwZXIuU2hhcGUuUmVjdGFuZ2xlKGltYWdlQm91bmRzKTtcbiAgICAgICAgICAgIGZpbGwuZmlsbENvbG9yID0gdGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2guYmFja2dyb3VuZENvbG9yO1xuXG4gICAgICAgICAgICBjb25zdCBiYWNrZ3JvdW5kID0gbmV3IHBhcGVyLkdyb3VwKFtmaWxsXSk7XG5cbiAgICAgICAgICAgIGlmKHdhdGVybWFyaykge1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcmsucGxhY2VJbnRvKGJhY2tncm91bmQsIDxwYXBlci5Db2xvcj48YW55PmZpbGwuZmlsbENvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl93b3Jrc3BhY2UuaW5zZXJ0Q2hpbGQoMCwgYmFja2dyb3VuZCk7XG4gICAgICAgICAgICByZXR1cm4gYmFja2dyb3VuZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgYWRkQmxvY2sodGV4dEJsb2NrOiBUZXh0QmxvY2spIHtcbiAgICAgICAgICAgIGlmICghdGV4dEJsb2NrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRleHRCbG9jay5faWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdyZWNlaXZlZCBibG9jayB3aXRob3V0IGlkJywgdGV4dEJsb2NrKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1t0ZXh0QmxvY2suX2lkXTtcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlJlY2VpdmVkIGFkZEJsb2NrIGZvciBibG9jayB0aGF0IGlzIGFscmVhZHkgbG9hZGVkXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGJvdW5kczogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH07XG5cbiAgICAgICAgICAgIGlmICh0ZXh0QmxvY2sub3V0bGluZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRTZWdtZW50ID0gKHJlY29yZDogU2VnbWVudFJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludCA9IHJlY29yZFswXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvaW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuU2VnbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRbMV0gJiYgbmV3IHBhcGVyLlBvaW50KHJlY29yZFsxXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkWzJdICYmIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMl0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW5nbGUtcG9pbnQgc2VnbWVudHMgYXJlIHN0b3JlZCBhcyBudW1iZXJbMl1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KG5ldyBwYXBlci5Qb2ludChyZWNvcmQpKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGJvdW5kcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdXBwZXI6IHRleHRCbG9jay5vdXRsaW5lLnRvcC5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpLFxuICAgICAgICAgICAgICAgICAgICBsb3dlcjogdGV4dEJsb2NrLm91dGxpbmUuYm90dG9tLnNlZ21lbnRzLm1hcChsb2FkU2VnbWVudClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpdGVtID0gbmV3IFRleHRXYXJwKFxuICAgICAgICAgICAgICAgIHRoaXMuZmFsbGJhY2tGb250LFxuICAgICAgICAgICAgICAgIHRleHRCbG9jay50ZXh0LFxuICAgICAgICAgICAgICAgIGJvdW5kcyxcbiAgICAgICAgICAgICAgICBudWxsLCB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogdGV4dEJsb2NrLnRleHRDb2xvciB8fCBcInJlZFwiLCAgICAvLyB0ZXh0Q29sb3Igc2hvdWxkIGhhdmUgYmVlbiBzZXQgZWxzZXdoZXJlIFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5fd29ya3NwYWNlLmFkZENoaWxkKGl0ZW0pO1xuXG4gICAgICAgICAgICBwYXBlckV4dC5leHRlbmRNb3VzZUV2ZW50cyhpdGVtKTtcblxuICAgICAgICAgICAgaWYgKCF0ZXh0QmxvY2sub3V0bGluZSAmJiB0ZXh0QmxvY2sucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gbmV3IHBhcGVyLlBvaW50KHRleHRCbG9jay5wb3NpdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGl0ZW0ub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBldiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VsZWN0IG5leHQgaXRlbSBiZWhpbmRcbiAgICAgICAgICAgICAgICAgICAgbGV0IG90aGVySGl0cyA9ICg8VGV4dFdhcnBbXT5fLnZhbHVlcyh0aGlzLl90ZXh0QmxvY2tJdGVtcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGkgPT4gaS5pZCAhPT0gaXRlbS5pZCAmJiAhIWkuaGl0VGVzdChldi5wb2ludCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvdGhlckl0ZW0gPSBfLnNvcnRCeShvdGhlckhpdHMsIGkgPT4gaS5pbmRleClbMF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdGhlckl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVySXRlbS5icmluZ1RvRnJvbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG90aGVySWQgPSBfLmZpbmRLZXkodGhpcy5fdGV4dEJsb2NrSXRlbXMsIGkgPT4gaSA9PT0gb3RoZXJJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdGhlcklkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaXRlbUlkOiBvdGhlcklkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIiB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYnJpbmdUb0Zyb250KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXRlbS5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IHRleHRCbG9jay5faWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0ZW0ub24ocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ1N0YXJ0LCBldiA9PiB7XG4gICAgICAgICAgICAgICAgaXRlbS5icmluZ1RvRnJvbnQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcbiAgICAgICAgICAgICAgICBpdGVtLnRyYW5zbGF0ZShldi5kZWx0YSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXRlbS5vbihwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnRW5kLCBldiA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gPFRleHRCbG9jaz50aGlzLmdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbSk7XG4gICAgICAgICAgICAgICAgYmxvY2suX2lkID0gdGV4dEJsb2NrLl9pZDtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2UuZGlzcGF0Y2goYmxvY2spO1xuICAgICAgICAgICAgICAgIGlmICghaXRlbS5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgaXRlbUlkOiB0ZXh0QmxvY2suX2lkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgaXRlbUNoYW5nZSQgPSBQYXBlck5vdGlmeS5vYnNlcnZlKGl0ZW0sIFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpO1xuICAgICAgICAgICAgaXRlbUNoYW5nZSRcbiAgICAgICAgICAgICAgICAuZGVib3VuY2UoV29ya3NwYWNlQ29udHJvbGxlci5CTE9DS19CT1VORFNfQ0hBTkdFX1RIUk9UVExFX01TKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSA8VGV4dEJsb2NrPnRoaXMuZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suX2lkID0gdGV4dEJsb2NrLl9pZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBcnJhbmdlLmRpc3BhdGNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXRlbS5kYXRhID0gdGV4dEJsb2NrLl9pZDtcbiAgICAgICAgICAgIGlmICghdGV4dEJsb2NrLnBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5wb3NpdGlvbiA9IHRoaXMucHJvamVjdC52aWV3LmJvdW5kcy5wb2ludC5hZGQoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChpdGVtLmJvdW5kcy53aWR0aCAvIDIsIGl0ZW0uYm91bmRzLmhlaWdodCAvIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKDUwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtc1t0ZXh0QmxvY2suX2lkXSA9IGl0ZW07XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbTogVGV4dFdhcnApOiBCbG9ja0FycmFuZ2VtZW50IHtcbiAgICAgICAgICAgIC8vIGV4cG9ydCByZXR1cm5zIGFuIGFycmF5IHdpdGggaXRlbSB0eXBlIGFuZCBzZXJpYWxpemVkIG9iamVjdDpcbiAgICAgICAgICAgIC8vICAgW1wiUGF0aFwiLCBQYXRoUmVjb3JkXVxuICAgICAgICAgICAgY29uc3QgdG9wID0gPFBhdGhSZWNvcmQ+aXRlbS51cHBlci5leHBvcnRKU09OKHsgYXNTdHJpbmc6IGZhbHNlIH0pWzFdO1xuICAgICAgICAgICAgY29uc3QgYm90dG9tID0gPFBhdGhSZWNvcmQ+aXRlbS5sb3dlci5leHBvcnRKU09OKHsgYXNTdHJpbmc6IGZhbHNlIH0pWzFdO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBbaXRlbS5wb3NpdGlvbi54LCBpdGVtLnBvc2l0aW9uLnldLFxuICAgICAgICAgICAgICAgIG91dGxpbmU6IHsgdG9wLCBib3R0b20gfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzZXRCYWNrZ3JvdW5kSW1hZ2UodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICghdXJsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2JhY2tncm91bmRJbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2UucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmRJbWFnZSA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJhc3RlciA9IG5ldyBwYXBlci5SYXN0ZXIodXJsKTtcbiAgICAgICAgICAgICg8YW55PnJhc3Rlcikub25Mb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJhc3Rlci5zZW5kVG9CYWNrKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2JhY2tncm91bmRJbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2UucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmRJbWFnZSA9IHJhc3RlcjtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcblxuICAgIGV4cG9ydCBjbGFzcyBBY3Rpb25zIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWwge1xuXG4gICAgICAgIGVkaXRvciA9IHtcbiAgICAgICAgICAgIGluaXRXb3Jrc3BhY2U6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5pbml0V29ya3NwYWNlXCIpLFxuICAgICAgICAgICAgbG9hZEZvbnQ6IHRoaXMudG9waWM8c3RyaW5nPihcImRlc2lnbmVyLmxvYWRGb250XCIpLFxuICAgICAgICAgICAgem9vbVRvRml0OiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuem9vbVRvRml0XCIpLFxuICAgICAgICAgICAgZXhwb3J0aW5nSW1hZ2U6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRJbWFnZVwiKSxcbiAgICAgICAgICAgIGV4cG9ydFBORzogdGhpcy50b3BpYzxJbWFnZUV4cG9ydE9wdGlvbnM+KFwiZGVzaWduZXIuZXhwb3J0UE5HXCIpLFxuICAgICAgICAgICAgZXhwb3J0U1ZHOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0U1ZHXCIpLFxuICAgICAgICAgICAgdmlld0NoYW5nZWQ6IHRoaXMudG9waWM8cGFwZXIuUmVjdGFuZ2xlPihcImRlc2lnbmVyLnZpZXdDaGFuZ2VkXCIpLFxuICAgICAgICAgICAgdXBkYXRlU25hcHNob3Q6IHRoaXMudG9waWM8eyBza2V0Y2hJZDogc3RyaW5nLCBwbmdEYXRhVXJsOiBzdHJpbmcgfT4oXCJkZXNpZ25lci51cGRhdGVTbmFwc2hvdFwiKSxcbiAgICAgICAgICAgIHRvZ2dsZUhlbHA6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci50b2dnbGVIZWxwXCIpLFxuICAgICAgICAgICAgb3BlblNhbXBsZTogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLm9wZW5TYW1wbGVcIiksXG4gICAgICAgIH1cblxuICAgICAgICBza2V0Y2ggPSB7XG4gICAgICAgICAgICBjcmVhdGU6IHRoaXMudG9waWM8U2tldGNoQXR0cj4oXCJza2V0Y2guY3JlYXRlXCIpLFxuICAgICAgICAgICAgY2xlYXI6IHRoaXMudG9waWM8dm9pZD4oXCJza2V0Y2guY2xlYXJcIiksXG4gICAgICAgICAgICBjbG9uZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5jbG9uZVwiKSxcbiAgICAgICAgICAgIG9wZW46IHRoaXMudG9waWM8c3RyaW5nPihcInNrZXRjaC5vcGVuXCIpLFxuICAgICAgICAgICAgYXR0clVwZGF0ZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5hdHRyVXBkYXRlXCIpLFxuICAgICAgICAgICAgc2V0U2VsZWN0aW9uOiB0aGlzLnRvcGljPFdvcmtzcGFjZU9iamVjdFJlZj4oXCJza2V0Y2guc2V0U2VsZWN0aW9uXCIpLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRleHRCbG9jayA9IHtcbiAgICAgICAgICAgIGFkZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dEJsb2NrLmFkZFwiKSxcbiAgICAgICAgICAgIHVwZGF0ZUF0dHI6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRCbG9jay51cGRhdGVBdHRyXCIpLFxuICAgICAgICAgICAgdXBkYXRlQXJyYW5nZTogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2VcIiksXG4gICAgICAgICAgICByZW1vdmU6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRCbG9jay5yZW1vdmVcIilcbiAgICAgICAgfTtcblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFdmVudHMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XG5cbiAgICAgICAgZWRpdG9yID0ge1xuICAgICAgICAgICAgcmVzb3VyY2VzUmVhZHk6IHRoaXMudG9waWM8Ym9vbGVhbj4oXCJhcHAucmVzb3VyY2VzUmVhZHlcIiksXG4gICAgICAgICAgICB3b3Jrc3BhY2VJbml0aWFsaXplZDogdGhpcy50b3BpYzx2b2lkPihcImFwcC53b3Jrc3BhY2VJbml0aWFsaXplZFwiKSxcbiAgICAgICAgICAgIGZvbnRMb2FkZWQ6IHRoaXMudG9waWM8b3BlbnR5cGUuRm9udD4oXCJhcHAuZm9udExvYWRlZFwiKSxcbiAgICAgICAgICAgIHpvb21Ub0ZpdFJlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLnpvb21Ub0ZpdFJlcXVlc3RlZFwiKSxcbiAgICAgICAgICAgIGV4cG9ydFBOR1JlcXVlc3RlZDogdGhpcy50b3BpYzxJbWFnZUV4cG9ydE9wdGlvbnM+KFwiZGVzaWduZXIuZXhwb3J0UE5HUmVxdWVzdGVkXCIpLFxuICAgICAgICAgICAgZXhwb3J0U1ZHUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0U1ZHUmVxdWVzdGVkXCIpLFxuICAgICAgICAgICAgdmlld0NoYW5nZWQ6IHRoaXMudG9waWM8cGFwZXIuUmVjdGFuZ2xlPihcImRlc2lnbmVyLnZpZXdDaGFuZ2VkXCIpLFxuICAgICAgICAgICAgc25hcHNob3RFeHBpcmVkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJkZXNpZ25lci5zbmFwc2hvdEV4cGlyZWRcIiksXG4gICAgICAgICAgICB1c2VyTWVzc2FnZUNoYW5nZWQ6IHRoaXMudG9waWM8c3RyaW5nPihcImRlc2lnbmVyLnVzZXJNZXNzYWdlQ2hhbmdlZFwiKSxcbiAgICAgICAgICAgIHNob3dIZWxwQ2hhbmdlZDogdGhpcy50b3BpYzxib29sZWFuPihcImRlc2lnbmVyLnNob3dIZWxwQ2hhbmdlZFwiKVxuICAgICAgICB9O1xuXG4gICAgICAgIHNrZXRjaCA9IHtcbiAgICAgICAgICAgIGxvYWRlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmxvYWRlZFwiKSxcbiAgICAgICAgICAgIGF0dHJDaGFuZ2VkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2guYXR0ckNoYW5nZWRcIiksXG4gICAgICAgICAgICBjb250ZW50Q2hhbmdlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmNvbnRlbnRDaGFuZ2VkXCIpLFxuICAgICAgICAgICAgZWRpdGluZ0l0ZW1DaGFuZ2VkOiB0aGlzLnRvcGljPFBvc2l0aW9uZWRPYmplY3RSZWY+KFwic2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZFwiKSxcbiAgICAgICAgICAgIHNlbGVjdGlvbkNoYW5nZWQ6IHRoaXMudG9waWM8V29ya3NwYWNlT2JqZWN0UmVmPihcInNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkXCIpLFxuICAgICAgICAgICAgc2F2ZUxvY2FsUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwic2tldGNoLnNhdmVsb2NhbC5zYXZlTG9jYWxSZXF1ZXN0ZWRcIiksXG4gICAgICAgICAgICBjbG9uZWQ6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5jbG9uZWRcIiksXG4gICAgICAgICAgICBpbWFnZVVwbG9hZGVkOiB0aGlzLnRvcGljPHN0cmluZz4oXCJza2V0Y2guaW1hZ2VVcGxvYWRlZFwiKSxcbiAgICAgICAgfTtcblxuICAgICAgICB0ZXh0YmxvY2sgPSB7XG4gICAgICAgICAgICBhZGRlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFkZGVkXCIpLFxuICAgICAgICAgICAgYXR0ckNoYW5nZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hdHRyQ2hhbmdlZFwiKSxcbiAgICAgICAgICAgIGZvbnRSZWFkeTogdGhpcy50b3BpYzx7IHRleHRCbG9ja0lkOiBzdHJpbmcsIGZvbnQ6IG9wZW50eXBlLkZvbnQgfT4oXCJ0ZXh0YmxvY2suZm9udFJlYWR5XCIpLFxuICAgICAgICAgICAgYXJyYW5nZUNoYW5nZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hcnJhbmdlQ2hhbmdlZFwiKSxcbiAgICAgICAgICAgIHJlbW92ZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5yZW1vdmVkXCIpLFxuICAgICAgICAgICAgbG9hZGVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2subG9hZGVkXCIpLFxuICAgICAgICAgICAgZWRpdG9yQ2xvc2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suZWRpdG9yQ2xvc2VkXCIpLFxuICAgICAgICB9O1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIENoYW5uZWxzIHtcbiAgICAgICAgYWN0aW9uczogQWN0aW9ucyA9IG5ldyBBY3Rpb25zKCk7XG4gICAgICAgIGV2ZW50czogRXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIH1cblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgdHlwZSBBY3Rpb25UeXBlcyA9XG4gICAgICAgIFwic2tldGNoLmNyZWF0ZVwiXG4gICAgICAgIHwgXCJza2V0Y2gudXBkYXRlXCJcbiAgICAgICAgfCBcInRleHRibG9jay5hZGRcIlxuICAgICAgICB8IFwidGV4dGJsb2NrLnVwZGF0ZVwiO1xuXG4gICAgdHlwZSBFdmVudFR5cGVzID1cbiAgICAgICAgXCJza2V0Y2gubG9hZGVkXCJcbiAgICAgICAgfCBcInNrZXRjaC5jaGFuZ2VkXCJcbiAgICAgICAgfCBcInRleHRibG9jay5hZGRlZFwiXG4gICAgICAgIHwgXCJ0ZXh0YmxvY2suY2hhbmdlZFwiO1xuXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFZDb250cm9sIHtcbiAgICAgICAgcmVuZGVyKCk6IFZOb2RlO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIE9wZXJhdGlvbiBleHRlbmRzIFZDb250cm9sIHtcbiAgICAgICAgb25DbG9zZTogKCkgPT4gdm9pZDsgXG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBFZGl0b3JTdGF0ZSB7XG4gICAgICAgIGJyb3dzZXJJZD86IHN0cmluZztcbiAgICAgICAgZWRpdGluZ0l0ZW0/OiBQb3NpdGlvbmVkT2JqZWN0UmVmO1xuICAgICAgICBzZWxlY3Rpb24/OiBXb3Jrc3BhY2VPYmplY3RSZWY7XG4gICAgICAgIGxvYWRpbmdTa2V0Y2g/OiBib29sZWFuO1xuICAgICAgICB1c2VyTWVzc2FnZT86IHN0cmluZztcbiAgICAgICAgc2tldGNoPzogU2tldGNoO1xuICAgICAgICBzaG93SGVscD86IGJvb2xlYW47XG4gICAgICAgIHNrZXRjaElzRGlydHk/OiBib29sZWFuO1xuICAgICAgICBvcGVyYXRpb24/OiBPcGVyYXRpb247XG4gICAgICAgIHRyYW5zcGFyZW5jeT86IGJvb2xlYW47XG4gICAgICAgIHVwbG9hZGVkSW1hZ2U/OiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBTdG9yZVJlc291cmNlcyB7XG4gICAgICAgIGZhbGxiYWNrRm9udD86IG9wZW50eXBlLkZvbnRcbiAgICAgICAgZm9udENhdGFsb2c/OiBGb250U2hhcGUuRm9udENhdGFsb2dcbiAgICAgICAgcGFyc2VkRm9udHM/OiBGb250U2hhcGUuUGFyc2VkRm9udHNcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFNrZXRjaCBleHRlbmRzIFNrZXRjaEF0dHIge1xuICAgICAgICBfaWQ6IHN0cmluZztcbiAgICAgICAgYnJvd3NlcklkPzogc3RyaW5nO1xuICAgICAgICBzYXZlZEF0PzogRGF0ZTtcbiAgICAgICAgdGV4dEJsb2Nrcz86IFRleHRCbG9ja1tdO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2tldGNoQXR0ciB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgICAgICAgZGVmYXVsdFRleHRCbG9ja0F0dHI/OiBUZXh0QmxvY2s7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBGb250RGVzY3JpcHRpb24ge1xuICAgICAgICBmYW1pbHk6IHN0cmluZztcbiAgICAgICAgY2F0ZWdvcnk6IHN0cmluZztcbiAgICAgICAgdmFyaWFudDogc3RyaW5nO1xuICAgICAgICB1cmw6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFdvcmtzcGFjZU9iamVjdFJlZiB7XG4gICAgICAgIGl0ZW1JZDogc3RyaW5nO1xuICAgICAgICBpdGVtVHlwZT86IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uZWRPYmplY3RSZWYgZXh0ZW5kcyBXb3Jrc3BhY2VPYmplY3RSZWYge1xuICAgICAgICBjbGllbnRYPzogbnVtYmVyO1xuICAgICAgICBjbGllbnRZPzogbnVtYmVyO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGV4dEJsb2NrIGV4dGVuZHMgQmxvY2tBcnJhbmdlbWVudCB7XG4gICAgICAgIF9pZD86IHN0cmluZztcbiAgICAgICAgdGV4dD86IHN0cmluZztcbiAgICAgICAgdGV4dENvbG9yPzogc3RyaW5nO1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XG4gICAgICAgIGZvbnRGYW1pbHk/OiBzdHJpbmc7XG4gICAgICAgIGZvbnRWYXJpYW50Pzogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmxvY2tBcnJhbmdlbWVudCB7XG4gICAgICAgIHBvc2l0aW9uPzogbnVtYmVyW10sXG4gICAgICAgIG91dGxpbmU/OiB7XG4gICAgICAgICAgICB0b3A6IFBhdGhSZWNvcmQsXG4gICAgICAgICAgICBib3R0b206IFBhdGhSZWNvcmRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFja2dyb3VuZEFjdGlvblN0YXR1cyB7XG4gICAgICAgIGFjdGlvbj86IE9iamVjdDtcbiAgICAgICAgcmVqZWN0ZWQ/OiBib29sZWFuO1xuICAgICAgICBlcnJvcj86IGJvb2xlYW5cbiAgICAgICAgbWVzc2FnZT86IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFBhdGhSZWNvcmQge1xuICAgICAgICBzZWdtZW50czogU2VnbWVudFJlY29yZFtdO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1hZ2VFeHBvcnRPcHRpb25zIHtcbiAgICAgICAgcGl4ZWxzPzogbnVtYmVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxuICAgICAqL1xuICAgIGV4cG9ydCB0eXBlIFNlZ21lbnRSZWNvcmQgPSBBcnJheTxQb2ludFJlY29yZD4gfCBBcnJheTxudW1iZXI+O1xuXG4gICAgZXhwb3J0IHR5cGUgUG9pbnRSZWNvcmQgPSBBcnJheTxudW1iZXI+O1xuXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgIGV4cG9ydCBjb25zdCBnZXREZWZhdWx0RHJhd2luZyA9ICgpID0+ICh7XG4gICAgICBcImJyb3dzZXJJZFwiOiBcImlsdWw4eTZ5YmYwZjZyXCIsXG4gICAgICBcImRlZmF1bHRUZXh0QmxvY2tBdHRyXCI6IHtcbiAgICAgICAgIFwidGV4dENvbG9yXCI6IFwiI2ZmZjRlNlwiLFxuICAgICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjN2JjMDQzXCIsXG4gICAgICAgICBcImZvbnRGYW1pbHlcIjogXCJSb2traXR0XCIsXG4gICAgICAgICBcImZvbnRWYXJpYW50XCI6IFwicmVndWxhclwiXG4gICAgICB9LFxuICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCJcIixcbiAgICAgIFwidGV4dEJsb2Nrc1wiOiBbXG4gICAgICAgICB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcImlsejdzd3FlYzRibzZyXCIsXG4gICAgICAgICAgICBcInRleHRcIjogXCJGSURETEVTVElDS1MuSU9cIixcbiAgICAgICAgICAgIFwidGV4dENvbG9yXCI6IFwiI2ZmZjRlNlwiLFxuICAgICAgICAgICAgXCJmb250RmFtaWx5XCI6IFwiU2hhZG93cyBJbnRvIExpZ2h0IFR3b1wiLFxuICAgICAgICAgICAgXCJmb250VmFyaWFudFwiOiBcInJlZ3VsYXJcIixcbiAgICAgICAgICAgIFwicG9zaXRpb25cIjogW1xuICAgICAgICAgICAgICAgLTEwMDMuNzMwNzU1Mjk2MzgzOSxcbiAgICAgICAgICAgICAgIC0xNzAuNTIxNjM1XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJvdXRsaW5lXCI6IHtcbiAgICAgICAgICAgICAgIFwidG9wXCI6IHtcbiAgICAgICAgICAgICAgICAgIFwiYXBwbHlNYXRyaXhcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIFwic2VsZWN0ZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIFwic2VnbWVudHNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLTIwOTUuODcxNjMsXG4gICAgICAgICAgICAgICAgICAgICAgICAtNDU2LjYyMzAzXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTExNDguODM0MzgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtMjcxLjQ0NzU5XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTI4Ni42MzA0NCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDI1LjM3NDMzXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgMjg1LjYyNjgzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTI1LjI4NTQ5XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTQ3NS4zNDI3OCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC00NDUuNjM0NlxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC0yMzAuNTE5NjgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAzMi4yMzY0NVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDIzOS4zNjk0MixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC0zMy40NzQwMlxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIDg5LjQ1ODQsXG4gICAgICAgICAgICAgICAgICAgICAgICAtMzg4LjgxMjY4XG4gICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXCJzdHJva2VDb2xvclwiOiBbXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1LFxuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NSxcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDVcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBcInN0cm9rZVdpZHRoXCI6IDZcbiAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICBcImJvdHRvbVwiOiB7XG4gICAgICAgICAgICAgICAgICBcImFwcGx5TWF0cml4XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICBcInNlbGVjdGVkXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICBcInNlZ21lbnRzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC0xOTk1LjQ2NjQ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgLTkwLjk2NjEzXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTE1MzkuMjI0NDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA1NS4xOTkzOFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC05MS44ODI3OCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC0xMi4xNzg0NFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDEyMS42ODMyMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDE2LjEyODI5XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTEyMTguNDQ3MjIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAzNy4yOTA4OVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC0xMTIuMTY5NjYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtNy43NzkwOVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDEyNi4wMjkyOCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDguNzQwMjdcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtODIwLjQ5OTg0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMTE1LjU3OTc2XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTE3My40ODMwMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDUuNDc3NzZcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyMzAuODIyOTMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtNy4yODgyOFxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC03MC41Njc0NSxcbiAgICAgICAgICAgICAgICAgICAgICAgIDkzLjA2NTk5XG4gICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXCJzdHJva2VDb2xvclwiOiBbXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1LFxuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NSxcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDVcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBcInN0cm9rZVdpZHRoXCI6IDZcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImJhY2tncm91bmRDb2xvclwiOiBcIiNhZTVhNDFcIlxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiaWx6ODFpcG1qeGFqb3JcIixcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIllPVSBDQU5cIixcbiAgICAgICAgICAgIFwidGV4dENvbG9yXCI6IFwiIzkyYThiM1wiLFxuICAgICAgICAgICAgXCJmb250RmFtaWx5XCI6IFwiT3BlbiBTYW5zXCIsXG4gICAgICAgICAgICBcImZvbnRWYXJpYW50XCI6IFwiNzAwXCIsXG4gICAgICAgICAgICBcInBvc2l0aW9uXCI6IFtcbiAgICAgICAgICAgICAgIC0xNDIyLjY1OTU2Nzc3NzYzODEsXG4gICAgICAgICAgICAgICAxMzkuMDEyMjk5MzA2OTAwMlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwib3V0bGluZVwiOiB7XG4gICAgICAgICAgICAgICBcInRvcFwiOiB7XG4gICAgICAgICAgICAgICAgICBcImFwcGx5TWF0cml4XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICBcInNlbGVjdGVkXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICBcInNlZ21lbnRzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC0yMDAwLjMxMzU5LFxuICAgICAgICAgICAgICAgICAgICAgICAgLTY2Ljg0MTk4XG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTE3OTIuNTEwMzIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtNS42NDc2OFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC03NS44MDE4MSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC0yMC45MzI0N1xuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDkwLjY1MDQxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMjUuMDMyODhcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtMTUwNi4wNTU5MyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDcwLjA4OTg5XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTEwMy43ODgxNCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC0xMy44NzQ3MVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDExOS4wODAxNCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDE1LjkxODk4XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTExNTMuOTYyMTcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2NC40ODM2NFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC0xNTMuNjUxMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtNDEuMTEzMDJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxMjQuMTExNTksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAzMy4yMDkwMlxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC05OTYuNDkzNDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxMTAuNDQzNjVcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtNDEuMzM2MjEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtOS41NDg0XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgNDIuOTM0NjgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA5LjkxNzYzXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLTg0NS45NDUxOCxcbiAgICAgICAgICAgICAgICAgICAgICAgIDEzNS4zMzgzM1xuICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFwic3Ryb2tlQ29sb3JcIjogW1xuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NSxcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDUsXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1XG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXCJzdHJva2VXaWR0aFwiOiA2XG4gICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgXCJib3R0b21cIjoge1xuICAgICAgICAgICAgICAgICAgXCJhcHBseU1hdHJpeFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWxlY3RlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWdtZW50c1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAtMTk5Mi45MTA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgODUuOTgxMjNcbiAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtMTg3OS4xMjI1MSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYxLjI5ODIxXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTk0LjQ2MTU5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTY5Ljg3OTgyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgMTIwLjA5NzYzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgODguODQ0NThcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtMTQ2NC4yOTQ3MixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDIwMy44MzkyN1xuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC0xMjkuNzUxMDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtMjIuNzE1NzlcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxMDguODEyNzgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxOS4wNTAwOFxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC0xMTU1Ljg0MjksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyMDguNjY4NzZcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtNTUuODQ0NjcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtMTAzLjc3Njg1XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgMzIuMjgwNjMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA1OS45ODc1MlxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC0xMDcwLjcyMTM4LFxuICAgICAgICAgICAgICAgICAgICAgICAgMzQzLjUxMjE4XG4gICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXCJzdHJva2VDb2xvclwiOiBbXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1LFxuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NSxcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDVcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBcInN0cm9rZVdpZHRoXCI6IDZcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcImlsejhmNXd2ZDRwbGRpXCIsXG4gICAgICAgICAgICBcInRleHRcIjogXCJ3aXRoXCIsXG4gICAgICAgICAgICBcInRleHRDb2xvclwiOiBcIiNlMzllNTRcIixcbiAgICAgICAgICAgIFwiZm9udEZhbWlseVwiOiBcIlNhY3JhbWVudG9cIixcbiAgICAgICAgICAgIFwiZm9udFZhcmlhbnRcIjogXCJyZWd1bGFyXCIsXG4gICAgICAgICAgICBcInBvc2l0aW9uXCI6IFtcbiAgICAgICAgICAgICAgIC0xMDIwLjE2NDkwMjMwNzAwNjMsXG4gICAgICAgICAgICAgICAzMzQuMzA0Mzk0MjIxNzc2NTNcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIm91dGxpbmVcIjoge1xuICAgICAgICAgICAgICAgXCJ0b3BcIjoge1xuICAgICAgICAgICAgICAgICAgXCJhcHBseU1hdHJpeFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWxlY3RlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWdtZW50c1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAtMTMzMi4xOTg2NCxcbiAgICAgICAgICAgICAgICAgICAgICAgIDM3Ny4zODQzN1xuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC05NjQuMDE3MzYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAzMDYuOTM3MDZcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtNzIuNjkzMTQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA0My42MDE0M1xuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDQxLjExMTM1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTI0LjY1ODY0XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLTg4OC42OTIzMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIDIxMy42NTYzOVxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC04NDAuMDQ4NTUsXG4gICAgICAgICAgICAgICAgICAgICAgICAxMzQuNjg4NTFcbiAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBcInN0cm9rZUNvbG9yXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDUsXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1LFxuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NVxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFwic3Ryb2tlV2lkdGhcIjogNlxuICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgIFwiYm90dG9tXCI6IHtcbiAgICAgICAgICAgICAgICAgIFwiYXBwbHlNYXRyaXhcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIFwic2VsZWN0ZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIFwic2VnbWVudHNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLTk1NC4zMzA1MSxcbiAgICAgICAgICAgICAgICAgICAgICAgIDU0MS42Njk2OFxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC03MDUuOTg4NzksXG4gICAgICAgICAgICAgICAgICAgICAgICAxMjYuOTM5MTFcbiAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBcInN0cm9rZUNvbG9yXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDUsXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1LFxuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NVxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFwic3Ryb2tlV2lkdGhcIjogNlxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiaWx6OGd5ZzEwMnVpazlcIixcbiAgICAgICAgICAgIFwidGV4dFwiOiBcInRcIixcbiAgICAgICAgICAgIFwidGV4dENvbG9yXCI6IFwiI2ZmZjRlNlwiLFxuICAgICAgICAgICAgXCJmb250RmFtaWx5XCI6IFwiUm9ra2l0dFwiLFxuICAgICAgICAgICAgXCJmb250VmFyaWFudFwiOiBcInJlZ3VsYXJcIixcbiAgICAgICAgICAgIFwicG9zaXRpb25cIjogW1xuICAgICAgICAgICAgICAgLTU2Ny4xNDc1MDQ2MDYyODc4LFxuICAgICAgICAgICAgICAgMjQwLjQxOTQ0MTE0MzExNDRcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIm91dGxpbmVcIjoge1xuICAgICAgICAgICAgICAgXCJ0b3BcIjoge1xuICAgICAgICAgICAgICAgICAgXCJhcHBseU1hdHJpeFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWxlY3RlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWdtZW50c1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAtNjU3LjQxMjI2LFxuICAgICAgICAgICAgICAgICAgICAgICAgMTMxLjE1ODA3XG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLTM1NC44MTI0MyxcbiAgICAgICAgICAgICAgICAgICAgICAgIDEyOS4wNzE3OFxuICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFwic3Ryb2tlQ29sb3JcIjogW1xuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NSxcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDUsXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1XG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXCJzdHJva2VXaWR0aFwiOiA2XG4gICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgXCJib3R0b21cIjoge1xuICAgICAgICAgICAgICAgICAgXCJhcHBseU1hdHJpeFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWxlY3RlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWdtZW50c1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAtNzc5LjQ4MjU3LFxuICAgICAgICAgICAgICAgICAgICAgICAgMzUxLjc2NzExXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLTQzMi45MjQ0OSxcbiAgICAgICAgICAgICAgICAgICAgICAgIDM0Mi4yNjYwM1xuICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFwic3Ryb2tlQ29sb3JcIjogW1xuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NSxcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDUsXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1XG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXCJzdHJva2VXaWR0aFwiOiA2XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjMWI4NWI4XCJcbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcImlsemJrZmNjcG5sOGZyXCIsXG4gICAgICAgICAgICBcInRleHRcIjogXCJlXCIsXG4gICAgICAgICAgICBcInRleHRDb2xvclwiOiBcIiNmZmY0ZTZcIixcbiAgICAgICAgICAgIFwiZm9udEZhbWlseVwiOiBcIlJva2tpdHRcIixcbiAgICAgICAgICAgIFwiZm9udFZhcmlhbnRcIjogXCJyZWd1bGFyXCIsXG4gICAgICAgICAgICBcInBvc2l0aW9uXCI6IFtcbiAgICAgICAgICAgICAgIC0yNTQuNDg1MzIxNjU5MjA1ODgsXG4gICAgICAgICAgICAgICAyMzEuMDE5ODg5OTk5OTk5OThcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIm91dGxpbmVcIjoge1xuICAgICAgICAgICAgICAgXCJ0b3BcIjoge1xuICAgICAgICAgICAgICAgICAgXCJhcHBseU1hdHJpeFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWxlY3RlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWdtZW50c1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAtMzU1LjkwMTY2LFxuICAgICAgICAgICAgICAgICAgICAgICAgMTI4LjI1NDM1XG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLTc1LjU4OTMzLFxuICAgICAgICAgICAgICAgICAgICAgICAgMTIwLjU3OTg5XG4gICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXCJzdHJva2VDb2xvclwiOiBbXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1LFxuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NSxcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDVcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBcInN0cm9rZVdpZHRoXCI6IDZcbiAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICBcImJvdHRvbVwiOiB7XG4gICAgICAgICAgICAgICAgICBcImFwcGx5TWF0cml4XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICBcInNlbGVjdGVkXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICBcInNlZ21lbnRzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC00MzMuMzgxMzEsXG4gICAgICAgICAgICAgICAgICAgICAgICAzNDIuMTMwNzlcbiAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAtMTQ0LjM0MTQzLFxuICAgICAgICAgICAgICAgICAgICAgICAgMzMxLjk1MTgyXG4gICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXCJzdHJva2VDb2xvclwiOiBbXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1LFxuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NSxcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDVcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBcInN0cm9rZVdpZHRoXCI6IDZcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImJhY2tncm91bmRDb2xvclwiOiBcIiM3YmMwNDNcIlxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiaWx6YmttcGFsNDBhNGlcIixcbiAgICAgICAgICAgIFwidGV4dFwiOiBcInRcIixcbiAgICAgICAgICAgIFwidGV4dENvbG9yXCI6IFwiI2ZmZjRlNlwiLFxuICAgICAgICAgICAgXCJmb250RmFtaWx5XCI6IFwiUm9ra2l0dFwiLFxuICAgICAgICAgICAgXCJmb250VmFyaWFudFwiOiBcInJlZ3VsYXJcIixcbiAgICAgICAgICAgIFwicG9zaXRpb25cIjogW1xuICAgICAgICAgICAgICAgLTMyNy4yMzUxMjUsXG4gICAgICAgICAgICAgICA0NDAuNTY2MTE5OTk5OTk5OTZcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIm91dGxpbmVcIjoge1xuICAgICAgICAgICAgICAgXCJ0b3BcIjoge1xuICAgICAgICAgICAgICAgICAgXCJhcHBseU1hdHJpeFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWxlY3RlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWdtZW50c1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAtNDMxLjc5MDk5LFxuICAgICAgICAgICAgICAgICAgICAgICAgMzQwLjQxMzA5XG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLTE0Mi43OTAwMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIDMyOS4wMzE3M1xuICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFwic3Ryb2tlQ29sb3JcIjogW1xuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NSxcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDUsXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1XG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXCJzdHJva2VXaWR0aFwiOiA2XG4gICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgXCJib3R0b21cIjoge1xuICAgICAgICAgICAgICAgICAgXCJhcHBseU1hdHJpeFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWxlY3RlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWdtZW50c1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAtNTExLjY4MDIyLFxuICAgICAgICAgICAgICAgICAgICAgICAgNTUyLjEwMDUxXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLTIwOS45OTUyMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIDU0NS40ODYyNVxuICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFwic3Ryb2tlQ29sb3JcIjogW1xuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NSxcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDUsXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1XG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXCJzdHJva2VXaWR0aFwiOiA2XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjMWI4NWI4XCJcbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcImltMXdrMmZ5bG85YTRpXCIsXG4gICAgICAgICAgICBcInRleHRcIjogXCJ4XCIsXG4gICAgICAgICAgICBcInRleHRDb2xvclwiOiBcIiNmZmY0ZTZcIixcbiAgICAgICAgICAgIFwiZm9udEZhbWlseVwiOiBcIlJva2tpdHRcIixcbiAgICAgICAgICAgIFwiZm9udFZhcmlhbnRcIjogXCJyZWd1bGFyXCIsXG4gICAgICAgICAgICBcInBvc2l0aW9uXCI6IFtcbiAgICAgICAgICAgICAgIC02NTkuMTAwNzEyNjQ3MzUwNCxcbiAgICAgICAgICAgICAgIDQ0OS4zMDk3NzE5MDMzODAxXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJvdXRsaW5lXCI6IHtcbiAgICAgICAgICAgICAgIFwidG9wXCI6IHtcbiAgICAgICAgICAgICAgICAgIFwiYXBwbHlNYXRyaXhcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIFwic2VnbWVudHNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLTc3OS41NTkyNyxcbiAgICAgICAgICAgICAgICAgICAgICAgIDM1MS40Mzc2MVxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC00MzEuMDgzNDksXG4gICAgICAgICAgICAgICAgICAgICAgICAzNDIuOTY5NVxuICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFwic3Ryb2tlQ29sb3JcIjogW1xuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NSxcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDUsXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1XG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXCJzdHJva2VXaWR0aFwiOiA2XG4gICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgXCJib3R0b21cIjoge1xuICAgICAgICAgICAgICAgICAgXCJhcHBseU1hdHJpeFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJzZWdtZW50c1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAtODg3LjExNzk0LFxuICAgICAgICAgICAgICAgICAgICAgICAgNTU1LjY1MDA1XG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLTUxMC43MTEwNixcbiAgICAgICAgICAgICAgICAgICAgICAgIDU1Mi4yMzU0OVxuICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFwic3Ryb2tlQ29sb3JcIjogW1xuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NSxcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDUsXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1XG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXCJzdHJva2VXaWR0aFwiOiA2XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCIjY2MyYTM2XCJcbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcImltMXdseWtjZHQybzZyXCIsXG4gICAgICAgICAgICBcInRleHRcIjogXCJTa2V0Y2hcIixcbiAgICAgICAgICAgIFwidGV4dENvbG9yXCI6IFwiI2UzOWU1NFwiLFxuICAgICAgICAgICAgXCJmb250RmFtaWx5XCI6IFwiU2FjcmFtZW50b1wiLFxuICAgICAgICAgICAgXCJmb250VmFyaWFudFwiOiBcInJlZ3VsYXJcIixcbiAgICAgICAgICAgIFwicG9zaXRpb25cIjogW1xuICAgICAgICAgICAgICAgLTE1MzAuMDMzNTQ4MTQ1Mzg3NixcbiAgICAgICAgICAgICAgIDI1NS43NjEyMzIzNDM5MTE0MlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwib3V0bGluZVwiOiB7XG4gICAgICAgICAgICAgICBcInRvcFwiOiB7XG4gICAgICAgICAgICAgICAgICBcImFwcGx5TWF0cml4XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICBcInNlZ21lbnRzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC0yMDA2LjQyMTg5LFxuICAgICAgICAgICAgICAgICAgICAgICAgLTI4LjU1MDI3XG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTE4MzEuNDkxMTksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxMTEuNzE4MzhcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtNjIuNDQxOTUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtMzIuNzM1NTdcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2MC4yMjUwNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDMxLjU3MzM1XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTE1OTAuNTA2OTUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxMzIuNDkxNzFcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtNzMuMjUzNTMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtNi42Mzg5OVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDc4LjA2ODY4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNy4wNzUzOVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC0xMjc5LjA0MDAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMTQwLjIyMzk3XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTg0LjEzNDM3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLTEyLjY2NTE2XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgNzkuNDY1NzUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxMS45NjIzN1xuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC0xMDkwLjI0MDc5LFxuICAgICAgICAgICAgICAgICAgICAgICAgMjc0LjgwNDgzXG4gICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXCJzdHJva2VDb2xvclwiOiBbXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1LFxuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NSxcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDVcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBcInN0cm9rZVdpZHRoXCI6IDZcbiAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICBcImJvdHRvbVwiOiB7XG4gICAgICAgICAgICAgICAgICBcImFwcGx5TWF0cml4XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICBcInNlZ21lbnRzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIC0xOTIzLjM3ODY1LFxuICAgICAgICAgICAgICAgICAgICAgICAgNTQwLjA3MjczXG4gICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLTEwNTMuNjQ1MjEsXG4gICAgICAgICAgICAgICAgICAgICAgICA1MzcuNDAyNjRcbiAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBcInN0cm9rZUNvbG9yXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgIDAuODI3NDUsXG4gICAgICAgICAgICAgICAgICAgICAwLjgyNzQ1LFxuICAgICAgICAgICAgICAgICAgICAgMC44Mjc0NVxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFwic3Ryb2tlV2lkdGhcIjogNlxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFwiX2lkXCI6IFwiZ3JlZXRpbmctc2tldGNoXCJcbiAgIH0pIGFzIHVua25vd24gYXMgU2tldGNoXG5cbn1cbiIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEltYWdlIGltcGxlbWVudHMgT3BlcmF0aW9uIHtcblxuICAgICAgICBzdG9yZTogU3RvcmU7XG4gICAgICAgIG9uQ2xvc2U6ICgpID0+IHZvaWQ7XG5cbiAgICAgICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIoKTogVk5vZGUge1xuICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXZcIixcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIGgoXCJoM1wiLCBbXCJVcGxvYWQgaW1hZ2VcIl0pLFxuICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImZpbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZSA9ICg8SFRNTElucHV0RWxlbWVudD5ldi50YXJnZXQpLmZpbGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWQoZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdXBsb2FkKGZpbGUpIHtcbiAgICAgICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIHZhciB1cmwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkw7XG4gICAgICAgICAgICB2YXIgc3JjID0gKDxhbnk+dXJsKS5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmltYWdlVXBsb2FkZWQoc3JjKTtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZSAmJiB0aGlzLm9uQ2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsIiAgICBcbm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuICAgIFxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRGb250RGVzY3JpcHRpb24oZmFtaWx5OiBGb250U2hhcGUuRmFtaWx5UmVjb3JkLCB2YXJpYW50Pzogc3RyaW5nKVxuICAgICAgICA6IEZvbnREZXNjcmlwdGlvbiB7XG4gICAgICAgIGxldCB1cmw6IHN0cmluZztcbiAgICAgICAgdXJsID0gZmFtaWx5LmZpbGVzW3ZhcmlhbnQgfHwgXCJyZWd1bGFyXCJdO1xuICAgICAgICBpZighdXJsKXtcbiAgICAgICAgICAgIHVybCA9IGZhbWlseS5maWxlc1swXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZmFtaWx5OiBmYW1pbHkuZmFtaWx5LFxuICAgICAgICAgICAgY2F0ZWdvcnk6IGZhbWlseS5jYXRlZ29yeSxcbiAgICAgICAgICAgIHZhcmlhbnQ6IHZhcmlhbnQsXG4gICAgICAgICAgICB1cmxcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcblxuICAgIGV4cG9ydCBjbGFzcyBTM0FjY2VzcyB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwbG9hZCBmaWxlIHRvIGFwcGxpY2F0aW9uIFMzIGJ1Y2tldC5cbiAgICAgICAgICogUmV0dXJucyB1cGxvYWQgVVJMIGFzIGEgcHJvbWlzZS5cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyBwdXRGaWxlKGZpbGVOYW1lOiBzdHJpbmcsIGZpbGVUeXBlOiBzdHJpbmcsIGRhdGE6IEJsb2IgfCBzdHJpbmcpXG4gICAgICAgICAgICA6IEpRdWVyeVByb21pc2U8c3RyaW5nPiB7XG5cbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLXNkay1qcy9pc3N1ZXMvMTkwICAgXG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvRmlyZWZveC8pICYmICFmaWxlVHlwZS5tYXRjaCgvOy8pKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoYXJzZXQgPSAnOyBjaGFyc2V0PVVURi04JztcbiAgICAgICAgICAgICAgICBmaWxlVHlwZSArPSBjaGFyc2V0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBzaWduVXJsID0gYC9hcGkvc3RvcmFnZS9hY2Nlc3M/ZmlsZU5hbWU9JHtmaWxlTmFtZX0mZmlsZVR5cGU9JHtmaWxlVHlwZX1gO1xuICAgICAgICAgICAgLy8gZ2V0IHNpZ25lZCBVUkxcbiAgICAgICAgICAgIHJldHVybiAkLmdldEpTT04oc2lnblVybClcbiAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICBzaWduUmVzcG9uc2UgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFBVVCBmaWxlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1dFJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHNpZ25SZXNwb25zZS5zaWduZWRSZXF1ZXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwieC1hbXotYWNsXCI6IFwicHVibGljLXJlYWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmlsZVR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuYWpheChwdXRSZXF1ZXN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXRSZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cGxvYWRlZCBmaWxlXCIsIHNpZ25SZXNwb25zZS51cmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzaWduUmVzcG9uc2UudXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIHVwbG9hZGluZyB0byBTM1wiLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3Igb24gL2FwaS9zdG9yYWdlL2FjY2Vzc1wiLCBlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERvd25sb2FkIGZpbGUgZnJvbSBidWNrZXRcbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyBnZXRKc29uKGZpbGVOYW1lOiBzdHJpbmcpOiBKUXVlcnlQcm9taXNlPE9iamVjdD4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RmlsZVVybChmaWxlTmFtZSlcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG93bmxvYWRpbmdcIiwgcmVzcG9uc2UudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHJlc3BvbnNlLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBnZXRGaWxlVXJsKGZpbGVOYW1lOiBzdHJpbmcpOiBKUXVlcnlQcm9taXNlPHsgdXJsOiBzdHJpbmcgfT4ge1xuICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBgL2FwaS9zdG9yYWdlL3VybD9maWxlTmFtZT0ke2ZpbGVOYW1lfWAsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGNsYXNzIENvbG9yUGlja2VyIHtcblxuICAgICAgICBzdGF0aWMgREVGQVVMVF9QQUxFVFRFX0dST1VQUyA9IFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS84MDdcbiAgICAgICAgICAgICAgICBcIiNlZTQwMzVcIixcbiAgICAgICAgICAgICAgICBcIiNmMzc3MzZcIixcbiAgICAgICAgICAgICAgICBcIiNmZGY0OThcIixcbiAgICAgICAgICAgICAgICBcIiM3YmMwNDNcIixcbiAgICAgICAgICAgICAgICBcIiMwMzkyY2ZcIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvODk0XG4gICAgICAgICAgICAgICAgXCIjZWRjOTUxXCIsXG4gICAgICAgICAgICAgICAgXCIjZWI2ODQxXCIsXG4gICAgICAgICAgICAgICAgXCIjY2MyYTM2XCIsXG4gICAgICAgICAgICAgICAgXCIjNGYzNzJkXCIsXG4gICAgICAgICAgICAgICAgXCIjMDBhMGIwXCIsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzE2NFxuICAgICAgICAgICAgICAgIFwiIzFiODViOFwiLFxuICAgICAgICAgICAgICAgIFwiIzVhNTI1NVwiLFxuICAgICAgICAgICAgICAgIFwiIzU1OWU4M1wiLFxuICAgICAgICAgICAgICAgIFwiI2FlNWE0MVwiLFxuICAgICAgICAgICAgICAgIFwiI2MzY2I3MVwiLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS8zODlcbiAgICAgICAgICAgICAgICBcIiM0YjM4MzJcIixcbiAgICAgICAgICAgICAgICBcIiM4NTQ0NDJcIixcbiAgICAgICAgICAgICAgICBcIiNmZmY0ZTZcIixcbiAgICAgICAgICAgICAgICBcIiMzYzJmMmZcIixcbiAgICAgICAgICAgICAgICBcIiNiZTliN2JcIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvNDU1XG4gICAgICAgICAgICAgICAgXCIjZmY0ZTUwXCIsXG4gICAgICAgICAgICAgICAgXCIjZmM5MTNhXCIsXG4gICAgICAgICAgICAgICAgXCIjZjlkNjJlXCIsXG4gICAgICAgICAgICAgICAgXCIjZWFlMzc0XCIsXG4gICAgICAgICAgICAgICAgXCIjZTJmNGM3XCIsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzcwMFxuICAgICAgICAgICAgICAgIFwiI2QxMTE0MVwiLFxuICAgICAgICAgICAgICAgIFwiIzAwYjE1OVwiLFxuICAgICAgICAgICAgICAgIFwiIzAwYWVkYlwiLFxuICAgICAgICAgICAgICAgIFwiI2YzNzczNVwiLFxuICAgICAgICAgICAgICAgIFwiI2ZmYzQyNVwiLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS84MjZcbiAgICAgICAgICAgICAgICBcIiNlOGQxNzRcIixcbiAgICAgICAgICAgICAgICBcIiNlMzllNTRcIixcbiAgICAgICAgICAgICAgICBcIiNkNjRkNGRcIixcbiAgICAgICAgICAgICAgICBcIiM0ZDczNThcIixcbiAgICAgICAgICAgICAgICBcIiM5ZWQ2NzBcIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgIF07XG5cbiAgICAgICAgc3RhdGljIE1PTk9fUEFMRVRURSA9IFtcIiMwMDBcIiwgXCIjNDQ0XCIsIFwiIzY2NlwiLCBcIiM5OTlcIiwgXCIjY2NjXCIsIFwiI2VlZVwiLCBcIiNmM2YzZjNcIiwgXCIjZmZmXCJdO1xuXG4gICAgICAgIHN0YXRpYyBzZXR1cChlbGVtLCBmZWF0dXJlZENvbG9yczogc3RyaW5nW10sIG9uQ2hhbmdlKSB7XG4gICAgICAgICAgICBjb25zdCBmZWF0dXJlZEdyb3VwcyA9IF8uY2h1bmsoZmVhdHVyZWRDb2xvcnMsIDUpO1xuXG4gICAgICAgICAgICAvLyBmb3IgZWFjaCBwYWxldHRlIGdyb3VwXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0UGFsZXR0ZUdyb3VwcyA9IENvbG9yUGlja2VyLkRFRkFVTFRfUEFMRVRURV9HUk9VUFMubWFwKGdyb3VwID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGFyc2VkR3JvdXAgPSBncm91cC5tYXAoYyA9PiBuZXcgcGFwZXIuQ29sb3IoPGFueT5jKSk7XG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGxpZ2h0IHZhcmlhbnRzIG9mIGRhcmtlc3QgdGhyZWVcbiAgICAgICAgICAgICAgICBjb25zdCBhZGRDb2xvcnMgPSBfLnNvcnRCeShwYXJzZWRHcm91cCwgYyA9PiBjLmxpZ2h0bmVzcylcbiAgICAgICAgICAgICAgICAgICAgLnNsaWNlKDAsIDMpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjMiA9IGMuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMyLmxpZ2h0bmVzcyA9IDAuODU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYzI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHBhcnNlZEdyb3VwID0gcGFyc2VkR3JvdXAuY29uY2F0KGFkZENvbG9ycyk7XG4gICAgICAgICAgICAgICAgcGFyc2VkR3JvdXAgPSBfLnNvcnRCeShwYXJzZWRHcm91cCwgYyA9PiBjLmxpZ2h0bmVzcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZEdyb3VwLm1hcChjID0+IGMudG9DU1ModHJ1ZSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBhbGV0dGUgPSBmZWF0dXJlZEdyb3Vwcy5jb25jYXQoZGVmYXVsdFBhbGV0dGVHcm91cHMpO1xuICAgICAgICAgICAgcGFsZXR0ZS5wdXNoKENvbG9yUGlja2VyLk1PTk9fUEFMRVRURSk7XG5cbiAgICAgICAgICAgIGxldCBzZWwgPSA8YW55PiQoZWxlbSk7XG4gICAgICAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bSh7XG4gICAgICAgICAgICAgICAgc2hvd0lucHV0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGFsbG93RW1wdHk6IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlZmVycmVkRm9ybWF0OiBcImhleFwiLFxuICAgICAgICAgICAgICAgIHNob3dCdXR0b25zOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzaG93QWxwaGE6IHRydWUsXG4gICAgICAgICAgICAgICAgc2hvd1BhbGV0dGU6IHRydWUsXG4gICAgICAgICAgICAgICAgc2hvd1NlbGVjdGlvblBhbGV0dGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHBhbGV0dGU6IHBhbGV0dGUsXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlS2V5OiBcInNrZXRjaHRleHRcIixcbiAgICAgICAgICAgICAgICBjaGFuZ2U6IG9uQ2hhbmdlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBzdGF0aWMgc2V0KGVsZW06IEhUTUxFbGVtZW50LCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bShcInNldFwiLCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZGVzdHJveShlbGVtKSB7XG4gICAgICAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bShcImRlc3Ryb3lcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcblxuICAgIGV4cG9ydCBjbGFzcyBFZGl0b3JCYXIgZXh0ZW5kcyBDb21wb25lbnQ8RWRpdG9yU3RhdGU+IHtcblxuICAgICAgICBzdG9yZTogU3RvcmU7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG5cbiAgICAgICAgICAgIGNvbnN0IHNrZXRjaERvbSQgPSBzdG9yZS5ldmVudHMubWVyZ2UoXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5sb2FkZWQsXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5hdHRyQ2hhbmdlZCxcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLnVzZXJNZXNzYWdlQ2hhbmdlZClcbiAgICAgICAgICAgICAgICAubWFwKG0gPT4gdGhpcy5yZW5kZXIoc3RvcmUuc3RhdGUpKTtcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShza2V0Y2hEb20kLCBjb250YWluZXIpO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIoc3RhdGU6IEVkaXRvclN0YXRlKSB7XG4gICAgICAgICAgICBjb25zdCBza2V0Y2ggPSBzdGF0ZS5za2V0Y2g7XG4gICAgICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXZcIiwgW1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGgoXCJhXCIsIFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgaHJlZjogXCIvXCJcbiAgICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBoKFwiaW1nLmxvZ29cIixcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM6IFwiaW1nL3NwaXJhbC1sb2dvLndoaXRlLjUwLnBuZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaChcImxhYmVsXCIsIFwiQWRkIHRleHQ6IFwiKSxcbiAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYWRkLXRleHRcIiwge1xuICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5cHJlc3M6IChldikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGV2LnRhcmdldCAmJiBldi50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay5hZGQuZGlzcGF0Y2goeyB0ZXh0OiB0ZXh0IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYudGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIlByZXNzIFtFbnRlcl0gdG8gYWRkXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICAgICAgaChcImxhYmVsXCIsIFwiQmFja2dyb3VuZDogXCIpLFxuICAgICAgICAgICAgICAgIGgoXCJpbnB1dC5iYWNrZ3JvdW5kLWNvbG9yXCIsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHNrZXRjaC5iYWNrZ3JvdW5kQ29sb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2tldGNoSGVscGVycy5jb2xvcnNJblVzZSh0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5hdHRyVXBkYXRlLmRpc3BhdGNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGJhY2tncm91bmRDb2xvcjogY29sb3IgPyBjb2xvci50b0hleFN0cmluZygpIDogbnVsbCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU6IChvbGRWbm9kZSwgdm5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0KHZub2RlLmVsbSwgc2tldGNoLmJhY2tncm91bmRDb2xvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgICAgIEJvb3RTY3JpcHQuZHJvcGRvd24oe1xuICAgICAgICAgICAgICAgICAgICBpZDogXCJza2V0Y2hNZW51XCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiQWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiTmV3XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiQ3JlYXRlIG5ldyBza2V0Y2hcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guY3JlYXRlLmRpc3BhdGNoKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJDbGVhciBhbGxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDbGVhciBza2V0Y2ggY29udGVudHNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guY2xlYXIuZGlzcGF0Y2goKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlpvb20gdG8gZml0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRml0IGNvbnRlbnRzIGluIHZpZXdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3Iuem9vbVRvRml0LmRpc3BhdGNoKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkV4cG9ydCBzbWFsbCBpbWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkV4cG9ydCBza2V0Y2ggYXMgUE5HXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci5leHBvcnRQTkcuZGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpeGVsczogMTAwICogMTAwMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkV4cG9ydCBtZWRpdW0gaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFeHBvcnQgc2tldGNoIGFzIFBOR1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3IuZXhwb3J0UE5HLmRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXhlbHM6IDUwMCAqIDEwMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJFeHBvcnQgU1ZHXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRXhwb3J0IHNrZXRjaCBhcyB2ZWN0b3IgZ3JhcGhpY3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3IuZXhwb3J0U1ZHLmRpc3BhdGNoKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkR1cGxpY2F0ZSBza2V0Y2ggKG5ldyBVUkwpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiQ29weSBjb250ZW50cyBpbnRvIGEgc2tldGNoIHdpdGggYSBuZXcgYWRkcmVzc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5jbG9uZS5kaXNwYXRjaCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJMb2FkIHNhbXBsZSBza2V0Y2hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJPcGVuIGEgc2FtcGxlIHNrZXRjaCB0byBwbGF5IHdpdGhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3Iub3BlblNhbXBsZS5kaXNwYXRjaCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJVcGxvYWQgdGVtcG9yYXJ5IHRyYWNpbmcgaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJVcGxvYWQgaW1hZ2UgaW50byB3b3Jrc3BhY2UgZm9yIHRyYWNpbmcuIFRoZSBpbWFnZSB3aWxsIG5vdCBzaG93IGluIGZpbmFsIG91dHB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5zaG93T3BlcmF0aW9uKG5ldyBVcGxvYWRJbWFnZSh0aGlzLnN0b3JlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJSZW1vdmUgdHJhY2luZyBpbWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlJlbW92ZSBiYWNrZ3JvdW5kIHRyYWNpbmcgaW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUucmVtb3ZlVXBsb2FkZWRJbWFnZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiVG9nZ2xlIHRyYW5zcGFyZW5jeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlNlZSB0aHJvdWdoIHRleHQgdG8gZWxlbWVudHMgYmVoaW5kXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLnNldFRyYW5zcGFyZW5jeSghdGhpcy5zdG9yZS5zdGF0ZS50cmFuc3BhcmVuY3kpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgICAgIGgoXCJkaXYjcmlnaHRTaWRlXCIsXG4gICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2I3VzZXItbWVzc2FnZVwiLCB7fSwgW3N0YXRlLnVzZXJNZXNzYWdlIHx8IFwiXCJdKSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgaChcImRpdiNzaG93LWhlbHAuZ2x5cGhpY29uLmdseXBoaWNvbi1xdWVzdGlvbi1zaWduXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuZGlzcGF0Y2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBdKVxuXG4gICAgICAgICAgICBdXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW50ZXJmYWNlIEpRdWVyeSB7XG4gICAgc2VsZWN0cGlja2VyKC4uLmFyZ3M6IGFueVtdKTtcbiAgICAvL3JlcGxhY2VPcHRpb25zKG9wdGlvbnM6IEFycmF5PHt2YWx1ZTogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nfT4pO1xufVxuXG5uYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcblxuICAgIGV4cG9ydCBjbGFzcyBGb250UGlja2VyIHtcblxuICAgICAgICBkZWZhdWx0Rm9udEZhbWlseSA9IFwiUm9ib3RvXCI7XG4gICAgICAgIHByZXZpZXdGb250U2l6ZSA9IFwiMjhweFwiO1xuXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSwgYmxvY2s6IFRleHRCbG9jaykge1xuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgICAgICAgICAgY29uc3QgZG9tJCA9IFJ4Lk9ic2VydmFibGUuanVzdChibG9jaylcbiAgICAgICAgICAgICAgICAubWVyZ2UoXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5hdHRyQ2hhbmdlZC5vYnNlcnZlKClcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihtID0+IG0uZGF0YS5faWQgPT09IGJsb2NrLl9pZClcbiAgICAgICAgICAgICAgICAgICAgLm1hcChtID0+IG0uZGF0YSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLm1hcCh0YiA9PiB0aGlzLnJlbmRlcih0YikpO1xuICAgICAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKGRvbSQsIGNvbnRhaW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIoYmxvY2s6IFRleHRCbG9jayk6IFZOb2RlIHtcbiAgICAgICAgICAgIGxldCB1cGRhdGUgPSBwYXRjaCA9PiB7XG4gICAgICAgICAgICAgICAgcGF0Y2guX2lkID0gYmxvY2suX2lkO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXR0ci5kaXNwYXRjaChwYXRjaCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudHM6IFZOb2RlW10gPSBbXTtcbiAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goXG4gICAgICAgICAgICAgICAgaChcInNlbGVjdFwiLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwic2VsZWN0UGlja2VyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZmFtaWx5LXBpY2tlclwiOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiB2bm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6IHZub2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBldi50YXJnZXQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRWYXJpYW50OiBGb250U2hhcGUuRm9udENhdGFsb2cuZGVmYXVsdFZhcmlhbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnJlc291cmNlcy5mb250Q2F0YWxvZy5nZXRSZWNvcmQoZXYudGFyZ2V0LnZhbHVlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnJlc291cmNlcy5mb250Q2F0YWxvZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLmdldExpc3QodGhpcy5zdG9yZS5mb250TGlzdExpbWl0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgocmVjb3JkOiBGb250U2hhcGUuRmFtaWx5UmVjb3JkKSA9PiBoKFwib3B0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHJlY29yZC5mYW1pbHkgPT09IGJsb2NrLmZvbnRGYW1pbHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGVudFwiOiBgPHNwYW4gc3R5bGU9XCIke0ZvbnRIZWxwZXJzLmdldFN0eWxlU3RyaW5nKHJlY29yZC5mYW1pbHksIG51bGwsIHRoaXMucHJldmlld0ZvbnRTaXplKX1cIj4ke3JlY29yZC5mYW1pbHl9PC9zcGFuPmBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtyZWNvcmQuZmFtaWx5XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRGYW1pbHkgPSB0aGlzLnN0b3JlLnJlc291cmNlcy5mb250Q2F0YWxvZy5nZXRSZWNvcmQoYmxvY2suZm9udEZhbWlseSk7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRGYW1pbHkgJiYgc2VsZWN0ZWRGYW1pbHkudmFyaWFudHNcbiAgICAgICAgICAgICAgICAmJiBzZWxlY3RlZEZhbWlseS52YXJpYW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChoKFwic2VsZWN0XCIsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJ2YXJpYW50UGlja2VyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidmFyaWFudC1waWNrZXJcIjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogdm5vZGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB2bm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoXCJkZXN0cm95XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0cGF0Y2g6IChvbGRWbm9kZSwgdm5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBROiB3aHkgY2FuJ3Qgd2UganVzdCBkbyBzZWxlY3RwaWNrZXIocmVmcmVzaCkgaGVyZT9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEE6IHNlbGVjdHBpY2tlciBoYXMgbWVudGFsIHByb2JsZW1zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKFwiZGVzdHJveVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHVwZGF0ZSh7IGZvbnRWYXJpYW50OiBldi50YXJnZXQudmFsdWUgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRGYW1pbHkudmFyaWFudHMubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJvcHRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogdiA9PT0gYmxvY2suZm9udFZhcmlhbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YS1jb250YWluZXJcIjogXCJib2R5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGVudFwiOiBgPHNwYW4gc3R5bGU9XCIke0ZvbnRIZWxwZXJzLmdldFN0eWxlU3RyaW5nKHNlbGVjdGVkRmFtaWx5LmZhbWlseSwgdiwgdGhpcy5wcmV2aWV3Rm9udFNpemUpfVwiPiR7dn08L3NwYW4+YFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdl0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXZcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiB7IFwiZm9udC1waWNrZXJcIjogdHJ1ZSB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlbGVtZW50c1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgICBleHBvcnQgY2xhc3MgSGVscERpYWxvZyB7XG5cbiAgICAgICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgICAgICAgICBjb25zdCBvdXRlciA9ICQoY29udGFpbmVyKTtcbiAgICAgICAgICAgIG91dGVyLmFwcGVuZChcIjxoMz5HZXR0aW5nIHN0YXJ0ZWQ8L2gzPlwiKTtcbiAgICAgICAgICAgIHN0b3JlLnN0YXRlLnNob3dIZWxwID8gb3V0ZXIuc2hvdygpIDogb3V0ZXIuaGlkZSgpO1xuICAgICAgICAgICAgJC5nZXQoXCJjb250ZW50L2hlbHAuaHRtbFwiLCBkID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9zZSA9ICQoXCI8YnV0dG9uIGNsYXNzPSdidG4gYnRuLWRlZmF1bHQnPiBDbG9zZSA8L2J1dHRvbj5cIik7XG4gICAgICAgICAgICAgICAgY2xvc2Uub24oXCJjbGlja1wiLCBldiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3IudG9nZ2xlSGVscC5kaXNwYXRjaCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG91dGVyLmFwcGVuZCgkKGQpKVxuICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChjbG9zZSlcbiAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXCI8YSBjbGFzcz0ncmlnaHQnIGhyZWY9J21haWx0bzpmaWRkbGVzdGlja3NAY29kZWZsaWdodC5pbyc+RW1haWwgdXM8L2E+XCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLnNob3dIZWxwQ2hhbmdlZC5zdWIoc2hvdyA9PiB7XG4gICAgICAgICAgICAgICAgc2hvdyA/IG91dGVyLnNob3coKSA6IG91dGVyLmhpZGUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBPcGVyYXRpb25QYW5lbCB7XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSl7XG4gXG4gICAgICAgICAgICBjb25zdCBkb20kID0gc3RvcmUub3BlcmF0aW9uJC5tYXAob3AgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCFvcCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoKFwiZGl2LmhpZGRlblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXYub3BlcmF0aW9uXCIsIFtvcC5yZW5kZXIoKV0pO1xuICAgICAgICAgICAgfSkgICAgICAgICAgIFxuICAgICAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKGRvbSQsIGNvbnRhaW5lcik7XG5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG4gICAgXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgICBleHBvcnQgY2xhc3MgU2VsZWN0ZWRJdGVtRWRpdG9yIHtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcblxuICAgICAgICAgICAgY29uc3QgZG9tJCA9IHN0b3JlLmV2ZW50cy5za2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkLm9ic2VydmUoKVxuICAgICAgICAgICAgICAgIC5tYXAoaSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zSXRlbSA9IDxQb3NpdGlvbmVkT2JqZWN0UmVmPmkuZGF0YTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBibG9jayA9IHBvc0l0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHBvc0l0ZW0uaXRlbVR5cGUgPT09ICdUZXh0QmxvY2snXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBfLmZpbmQoc3RvcmUuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYiA9PiBiLl9pZCA9PT0gcG9zSXRlbS5pdGVtSWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoKCdkaXYjZWRpdG9yT3ZlcmxheScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0OiBwb3NJdGVtLmNsaWVudFggKyBcInB4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvcDogcG9zSXRlbS5jbGllbnRZICsgXCJweFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFRleHRCbG9ja0VkaXRvcihzdG9yZSkucmVuZGVyKGJsb2NrKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKGRvbSQsIGNvbnRhaW5lcik7XG5cbiAgICAgICAgfVxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGNsYXNzIFRleHRCbG9ja0VkaXRvciBleHRlbmRzIENvbXBvbmVudDxUZXh0QmxvY2s+IHtcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlcih0ZXh0QmxvY2s6IFRleHRCbG9jayk6IFZOb2RlIHtcbiAgICAgICAgICAgIGxldCB1cGRhdGUgPSB0YiA9PiB7XG4gICAgICAgICAgICAgICAgdGIuX2lkID0gdGV4dEJsb2NrLl9pZDtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUF0dHIuZGlzcGF0Y2godGIpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXYudGV4dC1ibG9jay1lZGl0b3JcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogdGV4dEJsb2NrLl9pZFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBoKFwidGV4dGFyZWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGV2LndoaWNoIHx8IGV2LmtleUNvZGUpID09PSBEb21IZWxwZXJzLktleUNvZGVzLkVudGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoeyB0ZXh0OiAoPEhUTUxUZXh0QXJlYUVsZW1lbnQ+ZXYudGFyZ2V0KS52YWx1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoeyB0ZXh0OiBldi50YXJnZXQudmFsdWUgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5mb3JlXCIsIHt9LCBcIkFcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImlucHV0LnRleHQtY29sb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiVGV4dCBjb2xvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2sudGV4dENvbG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZub2RlLmVsbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgdGV4dENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pLFxuXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1jb2xvci1pY29uLmJhY2tcIiwge30sIFwiQVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCYWNrZ3JvdW5kIGNvbG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2tldGNoSGVscGVycy5jb2xvcnNJblVzZSh0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB1cGRhdGUoeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiAodm5vZGUpID0+IENvbG9yUGlja2VyLmRlc3Ryb3kodm5vZGUuZWxtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgXSksXG5cbiAgICAgICAgICAgICAgICAgICAgaChcImJ1dHRvbi5kZWxldGUtdGV4dGJsb2NrLmJ0bi5idG4tZGFuZ2VyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJEZWxldGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGUgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay5yZW1vdmUuZGlzcGF0Y2godGV4dEJsb2NrKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcInNwYW4uZ2x5cGhpY29uLmdseXBoaWNvbi10cmFzaFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICApLFxuXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1waWNrZXItY29udGFpbmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBGb250UGlja2VyKHZub2RlLmVsbSwgdGhpcy5zdG9yZSwgdGV4dEJsb2NrKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhvb2s6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaW5zZXJ0OiAodm5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IHByb3BzOiBGb250UGlja2VyUHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgc3RvcmU6IHRoaXMuc3RvcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgc2VsZWN0aW9uOiB0ZXh0QmxvY2suZm9udERlc2MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogKGZvbnREZXNjKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHVwZGF0ZSh7IGZvbnREZXNjIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBSZWFjdERPTS5yZW5kZXIocmgoRm9udFBpY2tlciwgcHJvcHMpLCB2bm9kZS5lbG0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICksXG5cbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgICBleHBvcnQgY2xhc3MgRHVhbEJvdW5kc1BhdGhXYXJwIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xuXG4gICAgICAgIHN0YXRpYyBQT0lOVFNfUEVSX1BBVEggPSAyMDA7XG4gICAgICAgIHN0YXRpYyBVUERBVEVfREVCT1VOQ0UgPSAxNTA7XG5cbiAgICAgICAgcHJpdmF0ZSBfc291cmNlOiBwYXBlci5Db21wb3VuZFBhdGg7XG4gICAgICAgIHByaXZhdGUgX3VwcGVyOiBTdHJldGNoUGF0aDtcbiAgICAgICAgcHJpdmF0ZSBfbG93ZXI6IFN0cmV0Y2hQYXRoO1xuICAgICAgICBwcml2YXRlIF93YXJwZWQ6IHBhcGVyLkNvbXBvdW5kUGF0aDtcbiAgICAgICAgcHJpdmF0ZSBfb3V0bGluZTogcGFwZXIuUGF0aDtcbiAgICAgICAgcHJpdmF0ZSBfY3VzdG9tU3R5bGU6IFNrZXRjaEl0ZW1TdHlsZTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHNvdXJjZTogcGFwZXIuQ29tcG91bmRQYXRoLFxuICAgICAgICAgICAgYm91bmRzPzogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH0sXG4gICAgICAgICAgICBjdXN0b21TdHlsZT86IFNrZXRjaEl0ZW1TdHlsZSkge1xuXG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICAvLyAtLSBidWlsZCBjaGlsZHJlbiAtLVxuXG4gICAgICAgICAgICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgICAgICB0aGlzLl9zb3VyY2UucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIGlmIChib3VuZHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cHBlciA9IG5ldyBTdHJldGNoUGF0aChib3VuZHMudXBwZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvd2VyID0gbmV3IFN0cmV0Y2hQYXRoKGJvdW5kcy5sb3dlcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyID0gbmV3IFN0cmV0Y2hQYXRoKFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy50b3BMZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy50b3BSaWdodClcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb3dlciA9IG5ldyBTdHJldGNoUGF0aChbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMuYm90dG9tTGVmdCksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMuYm90dG9tUmlnaHQpXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29udHJvbEJvdW5kc09wYWNpdHkgPSAwLjc1O1xuXG4gICAgICAgICAgICB0aGlzLl91cHBlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcbiAgICAgICAgICAgIHRoaXMuX2xvd2VyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xuXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lID0gbmV3IHBhcGVyLlBhdGgoeyBjbG9zZWQ6IHRydWUgfSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVTaGFwZSgpO1xuXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHNvdXJjZS5wYXRoRGF0YSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xuXG4gICAgICAgICAgICAvLyAtLSBhZGQgY2hpbGRyZW4gLS1cblxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZHJlbihbdGhpcy5fb3V0bGluZSwgdGhpcy5fd2FycGVkLCB0aGlzLl91cHBlciwgdGhpcy5fbG93ZXJdKTtcblxuICAgICAgICAgICAgLy8gLS0gYXNzaWduIHN0eWxlIC0tXG5cbiAgICAgICAgICAgIHRoaXMuY3VzdG9tU3R5bGUgPSBjdXN0b21TdHlsZSB8fCB7XG4gICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwiZ3JheVwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyAtLSBzZXQgdXAgb2JzZXJ2ZXJzIC0tXG5cbiAgICAgICAgICAgIFJ4Lk9ic2VydmFibGUubWVyZ2UoXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpLFxuICAgICAgICAgICAgICAgIHRoaXMuX2xvd2VyLnBhdGhDaGFuZ2VkLm9ic2VydmUoKSlcbiAgICAgICAgICAgICAgICAuZGVib3VuY2UoRHVhbEJvdW5kc1BhdGhXYXJwLlVQREFURV9ERUJPVU5DRSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHBhdGggPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVTaGFwZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VkKFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZShmbGFncyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGZsYWdzICYgUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5BVFRSSUJVVEUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3VwcGVyLnZpc2libGUgIT09IHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG93ZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB1cHBlcigpOiBwYXBlci5QYXRoIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91cHBlci5wYXRoO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGxvd2VyKCk6IHBhcGVyLlBhdGgge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvd2VyLnBhdGg7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgc291cmNlKHZhbHVlOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NvdXJjZSAmJiB0aGlzLl9zb3VyY2UucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc291cmNlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVXYXJwZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBjdXN0b21TdHlsZSgpOiBTa2V0Y2hJdGVtU3R5bGUge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1c3RvbVN0eWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGN1c3RvbVN0eWxlKHZhbHVlOiBTa2V0Y2hJdGVtU3R5bGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1c3RvbVN0eWxlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl93YXJwZWQuc3R5bGUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5iYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IHZhbHVlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRsaW5lLm9wYWNpdHkgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRsaW5lLmZpbGxDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRsaW5lLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGNvbnRyb2xCb3VuZHNPcGFjaXR5KHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwcGVyLm9wYWNpdHkgPSB0aGlzLl9sb3dlci5vcGFjaXR5ID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBvdXRsaW5lQ29udGFpbnMocG9pbnQ6IHBhcGVyLlBvaW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3V0bGluZS5jb250YWlucyhwb2ludCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHVwZGF0ZVdhcnBlZCgpIHtcbiAgICAgICAgICAgIGxldCBvcnRoT3JpZ2luID0gdGhpcy5fc291cmNlLmJvdW5kcy50b3BMZWZ0O1xuICAgICAgICAgICAgbGV0IG9ydGhXaWR0aCA9IHRoaXMuX3NvdXJjZS5ib3VuZHMud2lkdGg7XG4gICAgICAgICAgICBsZXQgb3J0aEhlaWdodCA9IHRoaXMuX3NvdXJjZS5ib3VuZHMuaGVpZ2h0O1xuXG4gICAgICAgICAgICBsZXQgcHJvamVjdGlvbiA9IFBhcGVySGVscGVycy5kdWFsQm91bmRzUGF0aFByb2plY3Rpb24oXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aCwgdGhpcy5fbG93ZXIucGF0aCk7XG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtID0gbmV3IEZvbnRTaGFwZS5QYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXBvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwb2ludDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHJlbGF0aXZlID0gcG9pbnQuc3VidHJhY3Qob3J0aE9yaWdpbik7XG4gICAgICAgICAgICAgICAgbGV0IHVuaXQgPSBuZXcgcGFwZXIuUG9pbnQoXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnkgLyBvcnRoSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBsZXQgcHJvamVjdGVkID0gcHJvamVjdGlvbih1bml0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhzID0gdGhpcy5fc291cmNlLmNoaWxkcmVuXG4gICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IDxwYXBlci5QYXRoPml0ZW07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhQb2ludHMgPSBQYXBlckhlbHBlcnMudHJhY2VQYXRoQXNQb2ludHMocGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIER1YWxCb3VuZHNQYXRoV2FycC5QT0lOVFNfUEVSX1BBVEgpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKHAgPT4gdHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50KHApKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFBhdGggPSBuZXcgcGFwZXIuUGF0aCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogeFBvaW50cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4UGF0aDtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLnJlbW92ZUNoaWxkcmVuKCk7XG4gICAgICAgICAgICB0aGlzLl93YXJwZWQuYWRkQ2hpbGRyZW4obmV3UGF0aHMpO1xuICAgICAgICAgICAgZm9yKGNvbnN0IGMgb2YgdGhpcy5fd2FycGVkLmNoaWxkcmVuKXtcbiAgICAgICAgICAgICAgICAoPHBhcGVyLlBhdGg+Yykuc2ltcGxpZnkoMC4wMDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVPdXRsaW5lU2hhcGUoKSB7XG4gICAgICAgICAgICBjb25zdCBsb3dlciA9IG5ldyBwYXBlci5QYXRoKHRoaXMuX2xvd2VyLnBhdGguc2VnbWVudHMpO1xuICAgICAgICAgICAgbG93ZXIucmV2ZXJzZSgpO1xuICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5zZWdtZW50cyA9IHRoaXMuX3VwcGVyLnBhdGguc2VnbWVudHMuY29uY2F0KGxvd2VyLnNlZ21lbnRzKTtcbiAgICAgICAgICAgIGxvd2VyLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcblxuICAgIGV4cG9ydCBjbGFzcyBQYXRoSGFuZGxlIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xuXG4gICAgICAgIHN0YXRpYyBTRUdNRU5UX01BUktFUl9SQURJVVMgPSAxMDtcbiAgICAgICAgc3RhdGljIENVUlZFX01BUktFUl9SQURJVVMgPSA2O1xuICAgICAgICBzdGF0aWMgRFJBR19USFJFU0hPTEQgPSAzO1xuXG4gICAgICAgIHByaXZhdGUgX21hcmtlcjogcGFwZXIuU2hhcGU7XG4gICAgICAgIHByaXZhdGUgX3NlZ21lbnQ6IHBhcGVyLlNlZ21lbnQ7XG4gICAgICAgIHByaXZhdGUgX2N1cnZlOiBwYXBlci5DdXJ2ZTtcbiAgICAgICAgcHJpdmF0ZSBfc21vb3RoZWQ6IGJvb2xlYW47XG4gICAgICAgIHByaXZhdGUgX2N1cnZlU3BsaXQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PG51bWJlcj4oKTtcbiAgICAgICAgcHJpdmF0ZSBfY3VydmVDaGFuZ2VVbnN1YjogKCkgPT4gdm9pZDtcbiAgICAgICAgcHJpdmF0ZSBkcmFnZ2luZztcblxuICAgICAgICBjb25zdHJ1Y3RvcihhdHRhY2g6IHBhcGVyLlNlZ21lbnQgfCBwYXBlci5DdXJ2ZSkge1xuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uOiBwYXBlci5Qb2ludDtcbiAgICAgICAgICAgIGxldCBwYXRoOiBwYXBlci5QYXRoO1xuICAgICAgICAgICAgaWYgKGF0dGFjaCBpbnN0YW5jZW9mIHBhcGVyLlNlZ21lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gPHBhcGVyLlNlZ21lbnQ+YXR0YWNoO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fc2VnbWVudC5wb2ludDtcbiAgICAgICAgICAgICAgICBwYXRoID0gdGhpcy5fc2VnbWVudC5wYXRoO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhdHRhY2ggaW5zdGFuY2VvZiBwYXBlci5DdXJ2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlID0gPHBhcGVyLkN1cnZlPmF0dGFjaDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuX2N1cnZlLmdldFBvaW50QXQodGhpcy5fY3VydmUubGVuZ3RoICogMC41KTtcbiAgICAgICAgICAgICAgICBwYXRoID0gdGhpcy5fY3VydmUucGF0aDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJhdHRhY2ggbXVzdCBiZSBTZWdtZW50IG9yIEN1cnZlXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtlciA9IHBhcGVyLlNoYXBlLkNpcmNsZShwb3NpdGlvbiwgUGF0aEhhbmRsZS5TRUdNRU5UX01BUktFUl9SQURJVVMpO1xuICAgICAgICAgICAgdGhpcy5fbWFya2VyLnN0cm9rZUNvbG9yID0gXCJibHVlXCI7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIuZmlsbENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgdGhpcy5fbWFya2VyLnNlbGVjdGVkQ29sb3IgPSBuZXcgcGFwZXIuQ29sb3IoMCwgMCk7XG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX21hcmtlcik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9zZWdtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZUFzU2VnbWVudCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlQXNDdXJ2ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXBlckV4dC5leHRlbmRNb3VzZUV2ZW50cyh0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5vbihwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VydmUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc3BsaXQgdGhlIGN1cnZlLCBwdXBhdGUgdG8gc2VnbWVudCBoYW5kbGVcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZUNoYW5nZVVuc3ViKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQgPSBuZXcgcGFwZXIuU2VnbWVudCh0aGlzLmNlbnRlcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnZlSWR4ID0gdGhpcy5fY3VydmUuaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlLnBhdGguaW5zZXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VydmVJZHggKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBc1NlZ21lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJ2ZVNwbGl0Lm5vdGlmeShjdXJ2ZUlkeCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlRHJhZywgZXYgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZWdtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQucG9pbnQgPSB0aGlzLmNlbnRlcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3Ntb290aGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LnNtb290aCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNsYXRlKGV2LmRlbHRhKTtcbiAgICAgICAgICAgICAgICBldi5zdG9wKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGV2ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNtb290aGVkID0gIXRoaXMuc21vb3RoZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV2LnN0b3AoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl9jdXJ2ZUNoYW5nZVVuc3ViID0gcGF0aC5zdWJzY3JpYmUoZmxhZ3MgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJ2ZSAmJiAhdGhpcy5fc2VnbWVudFxuICAgICAgICAgICAgICAgICAgICAmJiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLlNFR01FTlRTKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuX2N1cnZlLmdldFBvaW50QXQodGhpcy5fY3VydmUubGVuZ3RoICogMC41KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHNtb290aGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Ntb290aGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IHNtb290aGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgICAgICB0aGlzLl9zbW9vdGhlZCA9IHZhbHVlO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LnNtb290aCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LmhhbmRsZU91dCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgY3VydmVTcGxpdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jdXJ2ZVNwbGl0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGNlbnRlcigpOiBwYXBlci5Qb2ludCB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBjZW50ZXIocG9pbnQ6IHBhcGVyLlBvaW50KSB7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9pbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0eWxlQXNTZWdtZW50KCkge1xuICAgICAgICAgICAgdGhpcy5fbWFya2VyLm9wYWNpdHkgPSAwLjg7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIuZGFzaEFycmF5ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5yYWRpdXMgPSBQYXRoSGFuZGxlLlNFR01FTlRfTUFSS0VSX1JBRElVUztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3R5bGVBc0N1cnZlKCkge1xuICAgICAgICAgICAgdGhpcy5fbWFya2VyLm9wYWNpdHkgPSAwLjg7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIuZGFzaEFycmF5ID0gWzIsIDJdO1xuICAgICAgICAgICAgdGhpcy5fbWFya2VyLnJhZGl1cyA9IFBhdGhIYW5kbGUuQ1VSVkVfTUFSS0VSX1JBRElVUztcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgICBleHBvcnQgY2xhc3MgU3RyZXRjaFBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfcGF0aDogcGFwZXIuUGF0aDtcbiAgICAgICAgcHJpdmF0ZSBfcGF0aENoYW5nZWQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlBhdGg+KCk7XG5cbiAgICAgICAgY29uc3RydWN0b3Ioc2VnbWVudHM6IHBhcGVyLlNlZ21lbnRbXSwgc3R5bGU/OiBwYXBlci5TdHlsZSkge1xuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5fcGF0aCA9IG5ldyBwYXBlci5QYXRoKHNlZ21lbnRzKTtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fcGF0aCk7XG5cbiAgICAgICAgICAgIGlmIChzdHlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGguc3R5bGUgPSBzdHlsZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHJva2VDb2xvciA9IFwibGlnaHRncmF5XCI7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHJva2VXaWR0aCA9IDY7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgcyBvZiB0aGlzLl9wYXRoLnNlZ21lbnRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRTZWdtZW50SGFuZGxlKHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgdGhpcy5fcGF0aC5jdXJ2ZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHBhdGgoKTogcGFwZXIuUGF0aCB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGF0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBwYXRoQ2hhbmdlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXRoQ2hhbmdlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgYWRkU2VnbWVudEhhbmRsZShzZWdtZW50OiBwYXBlci5TZWdtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmFkZEhhbmRsZShuZXcgUGF0aEhhbmRsZShzZWdtZW50KSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGFkZEN1cnZlSGFuZGxlKGN1cnZlOiBwYXBlci5DdXJ2ZSkge1xuICAgICAgICAgICAgbGV0IGhhbmRsZSA9IG5ldyBQYXRoSGFuZGxlKGN1cnZlKTtcbiAgICAgICAgICAgIGhhbmRsZS5jdXJ2ZVNwbGl0LnN1YnNjcmliZU9uZShjdXJ2ZUlkeCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZSh0aGlzLl9wYXRoLmN1cnZlc1tjdXJ2ZUlkeF0pO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ3VydmVIYW5kbGUodGhpcy5fcGF0aC5jdXJ2ZXNbY3VydmVJZHggKyAxXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYWRkSGFuZGxlKGhhbmRsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGFkZEhhbmRsZShoYW5kbGU6IFBhdGhIYW5kbGUpIHtcbiAgICAgICAgICAgIGhhbmRsZS52aXNpYmxlID0gdGhpcy52aXNpYmxlO1xuICAgICAgICAgICAgaGFuZGxlLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXRoQ2hhbmdlZC5ub3RpZnkodGhpcy5fcGF0aCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGhhbmRsZS5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGV2ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXRoQ2hhbmdlZC5ub3RpZnkodGhpcy5fcGF0aCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChoYW5kbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgICAvKipcbiAgICAgKiBNZWFzdXJlcyBvZmZzZXRzIG9mIHRleHQgZ2x5cGhzLlxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBUZXh0UnVsZXIge1xuXG4gICAgICAgIGZvbnRGYW1pbHk6IHN0cmluZztcbiAgICAgICAgZm9udFdlaWdodDogbnVtYmVyO1xuICAgICAgICBmb250U2l6ZTogbnVtYmVyO1xuXG4gICAgICAgIHByaXZhdGUgY3JlYXRlUG9pbnRUZXh0KHRleHQpOiBwYXBlci5JdGVtIHtcbiAgICAgICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XG4gICAgICAgICAgICBwb2ludFRleHQuY29udGVudCA9IHRleHQ7XG4gICAgICAgICAgICBwb2ludFRleHQuanVzdGlmaWNhdGlvbiA9IFwiY2VudGVyXCI7XG4gICAgICAgICAgICBpZiAodGhpcy5mb250RmFtaWx5KSB7XG4gICAgICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRGYW1pbHkgPSB0aGlzLmZvbnRGYW1pbHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5mb250V2VpZ2h0KSB7XG4gICAgICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRXZWlnaHQgPSB0aGlzLmZvbnRXZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5mb250U2l6ZSkge1xuICAgICAgICAgICAgICAgIHBvaW50VGV4dC5mb250U2l6ZSA9IHRoaXMuZm9udFNpemU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwb2ludFRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRUZXh0T2Zmc2V0cyh0ZXh0KSB7XG4gICAgICAgICAgICAvLyBNZWFzdXJlIGdseXBocyBpbiBwYWlycyB0byBjYXB0dXJlIHdoaXRlIHNwYWNlLlxuICAgICAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxuICAgICAgICAgICAgdmFyIGdseXBoUGFpcnMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpICsgMSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGb3IgZWFjaCBjaGFyYWN0ZXIsIGZpbmQgY2VudGVyIG9mZnNldC5cbiAgICAgICAgICAgIHZhciB4T2Zmc2V0cyA9IFswXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgLy8gTWVhc3VyZSB0aHJlZSBjaGFyYWN0ZXJzIGF0IGEgdGltZSB0byBnZXQgdGhlIGFwcHJvcHJpYXRlIFxuICAgICAgICAgICAgICAgIC8vICAgc3BhY2UgYmVmb3JlIGFuZCBhZnRlciB0aGUgZ2x5cGguXG4gICAgICAgICAgICAgICAgdmFyIHRyaWFkVGV4dCA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGkgLSAxLCBpICsgMSkpO1xuICAgICAgICAgICAgICAgIHRyaWFkVGV4dC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXG4gICAgICAgICAgICAgICAgLy8gICBhbmQgaGFsZiBvZiBjdXJyZW50IGdseXBoIHBhaXIuXG4gICAgICAgICAgICAgICAgLy8gTXVzdCBiZSByaWdodCwgYmVjYXVzZSBpdCB3b3Jrcy5cbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoXG4gICAgICAgICAgICAgICAgICAgIC0gZ2x5cGhQYWlyc1tpIC0gMV0uYm91bmRzLndpZHRoIC8gMlxuICAgICAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaV0uYm91bmRzLndpZHRoIC8gMjtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBvZmZzZXQgd2lkdGggdG8gcHJpb3Igb2Zmc2V0LiBcbiAgICAgICAgICAgICAgICB4T2Zmc2V0c1tpXSA9IHhPZmZzZXRzW2kgLSAxXSArIG9mZnNldFdpZHRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBnbHlwaFBhaXIgb2YgZ2x5cGhQYWlycykge1xuICAgICAgICAgICAgICAgIGdseXBoUGFpci5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHhPZmZzZXRzO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgICBleHBvcnQgY2xhc3MgVGV4dFdhcnAgZXh0ZW5kcyBEdWFsQm91bmRzUGF0aFdhcnAge1xuXG4gICAgICAgIHN0YXRpYyBERUZBVUxUX0ZPTlRfU0laRSA9IDEyODtcblxuICAgICAgICBwcml2YXRlIF9mb250OiBvcGVudHlwZS5Gb250O1xuICAgICAgICBwcml2YXRlIF90ZXh0OiBzdHJpbmc7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRTaXplOiBudW1iZXI7XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBmb250OiBvcGVudHlwZS5Gb250LFxuICAgICAgICAgICAgdGV4dDogc3RyaW5nLFxuICAgICAgICAgICAgYm91bmRzPzogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH0sXG4gICAgICAgICAgICBmb250U2l6ZT86IG51bWJlcixcbiAgICAgICAgICAgIHN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XG5cbiAgICAgICAgICAgIGlmICghZm9udFNpemUpIHtcbiAgICAgICAgICAgICAgICBmb250U2l6ZSA9IFRleHRXYXJwLkRFRkFVTFRfRk9OVF9TSVpFO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IFRleHRXYXJwLmdldFBhdGhEYXRhKGZvbnQsIHRleHQsIGZvbnRTaXplKTtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcblxuICAgICAgICAgICAgc3VwZXIocGF0aCwgYm91bmRzLCBzdHlsZSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSBmb250O1xuICAgICAgICAgICAgdGhpcy5fdGV4dCA9IHRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdGV4dCgpOiBzdHJpbmcge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgdGV4dCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl90ZXh0ID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHRQYXRoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZm9udFNpemUoKTogbnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb250U2l6ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBmb250U2l6ZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGV4dFBhdGgoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBmb250KHZhbHVlOiBvcGVudHlwZS5Gb250KSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IHRoaXMuX2ZvbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlVGV4dFBhdGgoKSB7XG4gICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IFRleHRXYXJwLmdldFBhdGhEYXRhKFxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnQsIHRoaXMuX3RleHQsIHRoaXMuX2ZvbnRTaXplKTtcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBnZXRQYXRoRGF0YShmb250OiBvcGVudHlwZS5Gb250LFxuICAgICAgICAgICAgdGV4dDogc3RyaW5nLCBmb250U2l6ZT86IHN0cmluZyB8IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgICAgICBsZXQgb3BlblR5cGVQYXRoID0gZm9udC5nZXRQYXRoKHRleHQsIDAsIDAsXG4gICAgICAgICAgICAgICAgTnVtYmVyKGZvbnRTaXplKSB8fCBUZXh0V2FycC5ERUZBVUxUX0ZPTlRfU0laRSk7XG4gICAgICAgICAgICByZXR1cm4gb3BlblR5cGVQYXRoLnRvUGF0aERhdGEoKTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBTa2V0Y2hJdGVtU3R5bGUgZXh0ZW5kcyBwYXBlci5JU3R5bGUge1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XG4gICAgfVxuXG59Il19