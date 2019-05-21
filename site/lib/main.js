var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
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
                if (scaleFactor === void 0) { scaleFactor = 0.1; }
                var _this = this;
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
                new RouteNode("sketch", "/sketch/:sketchId"),
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
            enumerable: true,
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
            enumerable: true,
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
            enumerable: true,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Eb21IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0Rvd25sb2FkSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL1NlZWRSYW5kb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL1dhdGVybWFyay50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9jb2xsZWN0aW9ucy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ldmVudHMudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvZ29vZ2xlLWFuYWx5dGljcy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJOb3RpZnkudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvVmlld1pvb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvbW91c2VFdmVudEV4dC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9wYXBlci9wYXBlci1leHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9Db21wb25lbnQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9WRG9tSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwQ29va2llcy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L2FwcC9BcHBSb3V0ZXIudHMiLCIuLi8uLi9jbGllbnQvYXBwL1N0b3JlLnRzIiwiLi4vLi4vY2xpZW50L2RlbW8vRGVtb01vZHVsZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL0J1aWxkZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9Nb2R1bGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9QcmV2aWV3Q2FudmFzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvU2hhcmVPcHRpb25zVUkudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL21vZGVscy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL2NvbnRyb2xzL0NvbnRyb2xIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvRm9udENob29zZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9JbWFnZUNob29zZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9UZW1wbGF0ZUZvbnRDaG9vc2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvVGV4dElucHV0LnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvdGVtcGxhdGVzL0RpY2tlbnMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL0RvY3VtZW50S2V5SGFuZGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvU2tldGNoRWRpdG9yTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9Ta2V0Y2hIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvV29ya3NwYWNlQ29udHJvbGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvY2hhbm5lbHMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL2NvbnN0YW50cy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvbW9kZWxzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9vcGVyYXRpb25zL1VwbG9hZEltYWdlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9zZXJ2aWNlcy9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivc2VydmljZXMvUzNBY2Nlc3MudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0NvbG9yUGlja2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9FZGl0b3JCYXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0ZvbnRQaWNrZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0hlbHBEaWFsb2cudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL09wZXJhdGlvblBhbmVsLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9TZWxlY3RlZEl0ZW1FZGl0b3IudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL1RleHRCbG9ja0VkaXRvci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL0R1YWxCb3VuZHNQYXRoV2FycC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1BhdGhIYW5kbGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9TdHJldGNoUGF0aC50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1RleHRSdWxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1RleHRXYXJwLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3Bh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SUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVjLG9CQUFXLEdBQTFCLFVBQTJCLElBQW1CLEVBQzFDLElBQVksRUFBRSxRQUEwQjtZQUN4QyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDcEQsT0FBTyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDckMsQ0FBQztRQWpFTSwwQkFBaUIsR0FBRyxHQUFHLENBQUM7UUFrRW5DLGVBQUM7S0FBQSxBQXBFRCxDQUE4QixhQUFBLGtCQUFrQixHQW9FL0M7SUFwRVkscUJBQVEsV0FvRXBCLENBQUE7QUFFTCxDQUFDLEVBeEVTLFlBQVksS0FBWixZQUFZLFFBd0VyQiIsInNvdXJjZXNDb250ZW50IjpbIlxubmFtZXNwYWNlIERvbUhlbHBlcnMge1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIGJsb2IgZnJvbSBhIGRhdGEgVVJMIChlaXRoZXIgYmFzZTY0IGVuY29kZWQgb3Igbm90KS5cbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vZWJpZGVsL2ZpbGVyLmpzL2Jsb2IvbWFzdGVyL3NyYy9maWxlci5qcyNMMTM3XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YVVSTCBUaGUgZGF0YSBVUkwgdG8gY29udmVydC5cbiAgICAgKiBAcmV0dXJuIHtCbG9ifSBBIGJsb2IgcmVwcmVzZW50aW5nIHRoZSBhcnJheSBidWZmZXIgZGF0YS5cbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gZGF0YVVSTFRvQmxvYihkYXRhVVJMKTogQmxvYiB7XG4gICAgICAgIHZhciBCQVNFNjRfTUFSS0VSID0gJztiYXNlNjQsJztcbiAgICAgICAgaWYgKGRhdGFVUkwuaW5kZXhPZihCQVNFNjRfTUFSS0VSKSA9PSAtMSkge1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gZGF0YVVSTC5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgdmFyIGNvbnRlbnRUeXBlID0gcGFydHNbMF0uc3BsaXQoJzonKVsxXTtcbiAgICAgICAgICAgIHZhciByYXcgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IEJsb2IoW3Jhd10sIHsgdHlwZTogY29udGVudFR5cGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcGFydHMgPSBkYXRhVVJMLnNwbGl0KEJBU0U2NF9NQVJLRVIpO1xuICAgICAgICB2YXIgY29udGVudFR5cGUgPSBwYXJ0c1swXS5zcGxpdCgnOicpWzFdO1xuICAgICAgICB2YXIgcmF3ID0gd2luZG93LmF0b2IocGFydHNbMV0pO1xuICAgICAgICB2YXIgcmF3TGVuZ3RoID0gcmF3Lmxlbmd0aDtcblxuICAgICAgICB2YXIgdUludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KHJhd0xlbmd0aCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdMZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdUludDhBcnJheVtpXSA9IHJhdy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBCbG9iKFt1SW50OEFycmF5XSwgeyB0eXBlOiBjb250ZW50VHlwZSB9KTtcbiAgICB9XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gaW5pdEVycm9ySGFuZGxlcihsb2dnZXI6IChlcnJvckRhdGE6IE9iamVjdCkgPT4gdm9pZCkge1xuXG4gICAgICAgIHdpbmRvdy5vbmVycm9yID0gZnVuY3Rpb24obXNnLCBmaWxlLCBsaW5lLCBjb2wsIGVycm9yOiBFcnJvciB8IHN0cmluZykge1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHN0YWNrZnJhbWVzID0+IHtcblxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1zZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6IGxpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sOiBjb2wsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6IHN0YWNrZnJhbWVzXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGxvZyBlcnJvclwiLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBlcnJiYWNrID0gZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBsb2cgZXJyb3JcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcig8c3RyaW5nPmVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhc0Vycm9yID0gdHlwZW9mIGVycm9yID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgID8gbmV3IEVycm9yKGVycm9yKVxuICAgICAgICAgICAgICAgICAgICA6IGVycm9yO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhY2sgPSBTdGFja1RyYWNlLmZyb21FcnJvcihhc0Vycm9yKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihjYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycmJhY2spO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZmFpbGVkIHRvIGxvZyBlcnJvclwiLCBleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cblxuICAgIH1cblxuICAgIGV4cG9ydCBjb25zdCBLZXlDb2RlcyA9IHtcbiAgICAgICAgQmFja1NwYWNlOiA4LFxuICAgICAgICBUYWI6IDksXG4gICAgICAgIEVudGVyOiAxMyxcbiAgICAgICAgU2hpZnQ6IDE2LFxuICAgICAgICBDdHJsOiAxNyxcbiAgICAgICAgQWx0OiAxOCxcbiAgICAgICAgUGF1c2VCcmVhazogMTksXG4gICAgICAgIENhcHNMb2NrOiAyMCxcbiAgICAgICAgRXNjOiAyNyxcbiAgICAgICAgUGFnZVVwOiAzMyxcbiAgICAgICAgUGFnZURvd246IDM0LFxuICAgICAgICBFbmQ6IDM1LFxuICAgICAgICBIb21lOiAzNixcbiAgICAgICAgQXJyb3dMZWZ0OiAzNyxcbiAgICAgICAgQXJyb3dVcDogMzgsXG4gICAgICAgIEFycm93UmlnaHQ6IDM5LFxuICAgICAgICBBcnJvd0Rvd246IDQwLFxuICAgICAgICBJbnNlcnQ6IDQ1LFxuICAgICAgICBEZWxldGU6IDQ2LFxuICAgICAgICBEaWdpdDA6IDQ4LFxuICAgICAgICBEaWdpdDE6IDQ5LFxuICAgICAgICBEaWdpdDI6IDUwLFxuICAgICAgICBEaWdpdDM6IDUxLFxuICAgICAgICBEaWdpdDQ6IDUyLFxuICAgICAgICBEaWdpdDU6IDUzLFxuICAgICAgICBEaWdpdDY6IDU0LFxuICAgICAgICBEaWdpdDc6IDU1LFxuICAgICAgICBEaWdpdDg6IDU2LFxuICAgICAgICBEaWdpdDk6IDU3LFxuICAgICAgICBBOiA2NSxcbiAgICAgICAgQjogNjYsXG4gICAgICAgIEM6IDY3LFxuICAgICAgICBEOiA2OCxcbiAgICAgICAgRTogNjksXG4gICAgICAgIEY6IDcwLFxuICAgICAgICBHOiA3MSxcbiAgICAgICAgSDogNzIsXG4gICAgICAgIEk6IDczLFxuICAgICAgICBKOiA3NCxcbiAgICAgICAgSzogNzUsXG4gICAgICAgIEw6IDc2LFxuICAgICAgICBNOiA3NyxcbiAgICAgICAgTjogNzgsXG4gICAgICAgIE86IDc5LFxuICAgICAgICBQOiA4MCxcbiAgICAgICAgUTogODEsXG4gICAgICAgIFI6IDgyLFxuICAgICAgICBTOiA4MyxcbiAgICAgICAgVDogODQsXG4gICAgICAgIFU6IDg1LFxuICAgICAgICBWOiA4NixcbiAgICAgICAgVzogODcsXG4gICAgICAgIFg6IDg4LFxuICAgICAgICBZOiA4OSxcbiAgICAgICAgWjogOTAsXG4gICAgICAgIFdpbmRvd0xlZnQ6IDkxLFxuICAgICAgICBXaW5kb3dSaWdodDogOTIsXG4gICAgICAgIFNlbGVjdEtleTogOTMsXG4gICAgICAgIE51bXBhZDA6IDk2LFxuICAgICAgICBOdW1wYWQxOiA5NyxcbiAgICAgICAgTnVtcGFkMjogOTgsXG4gICAgICAgIE51bXBhZDM6IDk5LFxuICAgICAgICBOdW1wYWQ0OiAxMDAsXG4gICAgICAgIE51bXBhZDU6IDEwMSxcbiAgICAgICAgTnVtcGFkNjogMTAyLFxuICAgICAgICBOdW1wYWQ3OiAxMDMsXG4gICAgICAgIE51bXBhZDg6IDEwNCxcbiAgICAgICAgTnVtcGFkOTogMTA1LFxuICAgICAgICBNdWx0aXBseTogMTA2LFxuICAgICAgICBBZGQ6IDEwNyxcbiAgICAgICAgU3VidHJhY3Q6IDEwOSxcbiAgICAgICAgRGVjaW1hbFBvaW50OiAxMTAsXG4gICAgICAgIERpdmlkZTogMTExLFxuICAgICAgICBGMTogMTEyLFxuICAgICAgICBGMjogMTEzLFxuICAgICAgICBGMzogMTE0LFxuICAgICAgICBGNDogMTE1LFxuICAgICAgICBGNTogMTE2LFxuICAgICAgICBGNjogMTE3LFxuICAgICAgICBGNzogMTE4LFxuICAgICAgICBGODogMTE5LFxuICAgICAgICBGOTogMTIwLFxuICAgICAgICBGMTA6IDEyMSxcbiAgICAgICAgRjExOiAxMjIsXG4gICAgICAgIEYxMjogMTIzLFxuICAgICAgICBOdW1Mb2NrOiAxNDQsXG4gICAgICAgIFNjcm9sbExvY2s6IDE0NSxcbiAgICAgICAgU2VtaUNvbG9uOiAxODYsXG4gICAgICAgIEVxdWFsOiAxODcsXG4gICAgICAgIENvbW1hOiAxODgsXG4gICAgICAgIERhc2g6IDE4OSxcbiAgICAgICAgUGVyaW9kOiAxOTAsXG4gICAgICAgIEZvcndhcmRTbGFzaDogMTkxLFxuICAgICAgICBHcmF2ZUFjY2VudDogMTkyLFxuICAgICAgICBCcmFja2V0T3BlbjogMjE5LFxuICAgICAgICBCYWNrU2xhc2g6IDIyMCxcbiAgICAgICAgQnJhY2tldENsb3NlOiAyMjEsXG4gICAgICAgIFNpbmdsZVF1b3RlOiAyMjJcbiAgICB9O1xuXG59IiwibmFtZXNwYWNlIEZzdHguRnJhbWV3b3JrIHtcblxuICAgIGV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGaWxlTmFtZSh0ZXh0OiBzdHJpbmcsIG1heExlbmd0aDogbnVtYmVyLCBleHRlbnNpb246IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCBuYW1lID0gXCJcIjtcbiAgICAgICAgZm9yIChjb25zdCB3b3JkIG9mIHRleHQuc3BsaXQoL1xccy8pKSB7XG4gICAgICAgICAgICBjb25zdCB0cmltID0gd29yZC5yZXBsYWNlKC9cXFcvZywgJycpLnRyaW0oKTtcbiAgICAgICAgICAgIGlmICh0cmltLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmKG5hbWUubGVuZ3RoICYmIG5hbWUubGVuZ3RoICsgdHJpbS5sZW5ndGggKyAxID4gbWF4TGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuYW1lLmxlbmd0aCkgbmFtZSArPSBcIiBcIjtcbiAgICAgICAgICAgICAgICBuYW1lICs9IHRyaW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWUgKyBcIi5cIiArIGV4dGVuc2lvbjtcbiAgICB9XG5cbn0iLCJcbm5hbWVzcGFjZSBGb250SGVscGVycyB7XG4gICAgXG4gICAgZXhwb3J0IGludGVyZmFjZSBFbGVtZW50Rm9udFN0eWxlIHtcbiAgICAgICAgZm9udEZhbWlseT86IHN0cmluZztcbiAgICAgICAgZm9udFdlaWdodD86IHN0cmluZztcbiAgICAgICAgZm9udFN0eWxlPzogc3RyaW5nOyBcbiAgICAgICAgZm9udFNpemU/OiBzdHJpbmc7IFxuICAgIH1cbiAgICBcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q3NzU3R5bGUoZmFtaWx5OiBzdHJpbmcsIHZhcmlhbnQ/OiBzdHJpbmcsIHNpemU/OiBzdHJpbmcpe1xuICAgICAgICBsZXQgc3R5bGUgPSA8RWxlbWVudEZvbnRTdHlsZT57IGZvbnRGYW1pbHk6IGZhbWlseSB9O1xuICAgICAgICBpZih2YXJpYW50ICYmIHZhcmlhbnQuaW5kZXhPZihcIml0YWxpY1wiKSA+PSAwKXtcbiAgICAgICAgICAgIHN0eWxlLmZvbnRTdHlsZSA9IFwiaXRhbGljXCI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG51bWVyaWMgPSB2YXJpYW50ICYmIHZhcmlhbnQucmVwbGFjZSgvW15cXGRdL2csIFwiXCIpO1xuICAgICAgICBpZihudW1lcmljICYmIG51bWVyaWMubGVuZ3RoKXtcbiAgICAgICAgICAgIHN0eWxlLmZvbnRXZWlnaHQgPSBudW1lcmljLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoc2l6ZSl7XG4gICAgICAgICAgICBzdHlsZS5mb250U2l6ZSA9IHNpemU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0U3R5bGVTdHJpbmcoZmFtaWx5OiBzdHJpbmcsIHZhcmlhbnQ6IHN0cmluZywgc2l6ZT86IHN0cmluZykge1xuICAgICAgICBsZXQgc3R5bGVPYmogPSBnZXRDc3NTdHlsZShmYW1pbHksIHZhcmlhbnQsIHNpemUpO1xuICAgICAgICBsZXQgcGFydHMgPSBbXTtcbiAgICAgICAgaWYoc3R5bGVPYmouZm9udEZhbWlseSl7XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LWZhbWlseTonJHtzdHlsZU9iai5mb250RmFtaWx5fSdgKTtcbiAgICAgICAgfVxuICAgICAgICBpZihzdHlsZU9iai5mb250V2VpZ2h0KXtcbiAgICAgICAgICAgIHBhcnRzLnB1c2goYGZvbnQtd2VpZ2h0OiR7c3R5bGVPYmouZm9udFdlaWdodH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZihzdHlsZU9iai5mb250U3R5bGUpe1xuICAgICAgICAgICAgcGFydHMucHVzaChgZm9udC1zdHlsZToke3N0eWxlT2JqLmZvbnRTdHlsZX1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZihzdHlsZU9iai5mb250U2l6ZSl7XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LXNpemU6JHtzdHlsZU9iai5mb250U2l6ZX1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFydHMuam9pbihcIjsgXCIpO1xuICAgIH1cbiAgICBcbn0iLCJuYW1lc3BhY2UgRnJhbWV3b3JrIHtcblxuICAgIGV4cG9ydCBmdW5jdGlvbiBsb2d0YXA8VD4obWVzc2FnZTogc3RyaW5nLCBzdHJlYW06IFJ4Lk9ic2VydmFibGU8VD4pOiBSeC5PYnNlcnZhYmxlPFQ+IHtcbiAgICAgICAgcmV0dXJuIHN0cmVhbS50YXAodCA9PiBjb25zb2xlLmxvZyhtZXNzYWdlLCB0KSk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG5ld2lkKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAobmV3IERhdGUoKS5nZXRUaW1lKCkgKyBNYXRoLnJhbmRvbSgpKVxuICAgICAgICAgICAgLnRvU3RyaW5nKDM2KS5yZXBsYWNlKCcuJywgJycpO1xuICAgIH1cbiAgIFxufVxuIiwibmFtZXNwYWNlIEZyYW1ld29yayB7XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIFNlZWRSYW5kb20ge1xuICAgICAgICBcbiAgICAgICAgc2VlZDogbnVtYmVyO1xuICAgICAgICBuZXh0U2VlZDogbnVtYmVyO1xuICAgICAgICBcbiAgICAgICAgY29uc3RydWN0b3Ioc2VlZDogbnVtYmVyID0gTWF0aC5yYW5kb20oKSl7XG4gICAgICAgICAgICB0aGlzLnNlZWQgPSB0aGlzLm5leHRTZWVkID0gc2VlZDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmFuZG9tKCk6IG51bWJlciB7XG4gICAgICAgICAgICBjb25zdCB4ID0gTWF0aC5zaW4odGhpcy5uZXh0U2VlZCAqIDIgKiBNYXRoLlBJKSAqIDEwMDAwO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geCAtIE1hdGguZmxvb3IoeCk7XG4gICAgICAgICAgICB0aGlzLm5leHRTZWVkID0gcmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn0iLCJcbm5hbWVzcGFjZSBUeXBlZENoYW5uZWwge1xuXG4gICAgLy8gLS0tIENvcmUgdHlwZXMgLS0tXG5cbiAgICB0eXBlIFNlcmlhbGl6YWJsZSA9IE9iamVjdCB8IEFycmF5PGFueT4gfCBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuIHwgRGF0ZSB8IHZvaWQ7XG5cbiAgICB0eXBlIFZhbHVlID0gbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiB8IERhdGU7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2U8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcbiAgICAgICAgdHlwZTogc3RyaW5nO1xuICAgICAgICBkYXRhPzogVERhdGE7XG4gICAgfVxuXG4gICAgdHlwZSBJU3ViamVjdDxUPiA9IFJ4Lk9ic2VydmVyPFQ+ICYgUnguT2JzZXJ2YWJsZTxUPjtcblxuICAgIGV4cG9ydCBjbGFzcyBDaGFubmVsVG9waWM8VERhdGEgZXh0ZW5kcyBTZXJpYWxpemFibGU+IHtcbiAgICAgICAgdHlwZTogc3RyaW5nO1xuICAgICAgICBjaGFubmVsOiBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj47XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hhbm5lbDogSVN1YmplY3Q8TWVzc2FnZTxURGF0YT4+LCB0eXBlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3Vic2NyaWJlKG9ic2VydmVyOiAobWVzc2FnZTogTWVzc2FnZTxURGF0YT4pID0+IHZvaWQpIHtcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgpLnN1YnNjcmliZShvYnNlcnZlcik7XG4gICAgICAgIH1cblxuICAgICAgICBzdWIob2JzZXJ2ZXI6IChkYXRhOiBURGF0YSkgPT4gdm9pZCkge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKCkuc3Vic2NyaWJlKG0gPT4gb2JzZXJ2ZXIobS5kYXRhKSk7XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGF0Y2goZGF0YT86IFREYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwub25OZXh0KHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuZmlsdGVyKG0gPT4gbS50eXBlID09PSB0aGlzLnR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBvYnNlcnZlRGF0YSgpOiBSeC5PYnNlcnZhYmxlPFREYXRhPiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vYnNlcnZlKCkubWFwKG0gPT4gbS5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZm9yd2FyZChjaGFubmVsOiBDaGFubmVsVG9waWM8VERhdGE+KSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZShtID0+IGNoYW5uZWwuZGlzcGF0Y2gobS5kYXRhKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbCB7XG4gICAgICAgIHR5cGU6IHN0cmluZztcbiAgICAgICAgcHJpdmF0ZSBzdWJqZWN0OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHN1YmplY3Q/OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+LCB0eXBlPzogc3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnN1YmplY3QgPSBzdWJqZWN0IHx8IG5ldyBSeC5TdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlPj4oKTtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIH1cblxuICAgICAgICBzdWJzY3JpYmUob25OZXh0PzogKHZhbHVlOiBNZXNzYWdlPFNlcmlhbGl6YWJsZT4pID0+IHZvaWQpOiBSeC5JRGlzcG9zYWJsZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LnN1YnNjcmliZShvbk5leHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgb2JzZXJ2ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b3BpYzxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4odHlwZTogc3RyaW5nKSA6IENoYW5uZWxUb3BpYzxURGF0YT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDaGFubmVsVG9waWM8VERhdGE+KHRoaXMuc3ViamVjdCBhcyBJU3ViamVjdDxNZXNzYWdlPFREYXRhPj4sXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID8gdGhpcy50eXBlICsgJy4nICsgdHlwZSA6IHR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBtZXJnZVR5cGVkPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiguLi50b3BpY3M6IENoYW5uZWxUb3BpYzxURGF0YT5bXSkgXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxURGF0YT4+IHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdG9waWNzLm1hcCh0ID0+IHQudHlwZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmZpbHRlcihtID0+IHR5cGVzLmluZGV4T2YobS50eXBlKSA+PSAwICkgYXMgUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhPj47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIG1lcmdlKC4uLnRvcGljczogQ2hhbm5lbFRvcGljPFNlcmlhbGl6YWJsZT5bXSkgXG4gICAgICAgICAgICA6IFJ4Lk9ic2VydmFibGU8TWVzc2FnZTxTZXJpYWxpemFibGU+PiB7XG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRvcGljcy5tYXAodCA9PiB0LnR5cGUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5maWx0ZXIobSA9PiB0eXBlcy5pbmRleE9mKG0udHlwZSkgPj0gMCApO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJuYW1lc3BhY2UgRnN0eC5GcmFtZXdvcmsge1xuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBXYXRlcm1hcmsge1xuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSBfcHJvamVjdDogcGFwZXIuUHJvamVjdDtcbiAgICAgICAgcHJpdmF0ZSBfbWFyazogcGFwZXIuQ29tcG91bmRQYXRoO1xuICAgICAgICBwcml2YXRlIF9zY2FsZUZhY3RvcjogbnVtYmVyO1xuICAgICAgICBcbiAgICAgICAgZ2V0IGl0ZW0oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFyaztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29uc3RydWN0b3IocHJvamVjdDogcGFwZXIuUHJvamVjdCwgcGF0aDogc3RyaW5nLCBzY2FsZUZhY3RvciA9IDAuMSl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3QgPSBwcm9qZWN0O1xuICAgICAgICAgICAgdGhpcy5fcHJvamVjdC5pbXBvcnRTVkcocGF0aCwgKGltcG9ydGVkOiBwYXBlci5JdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyayA9IDxwYXBlci5Db21wb3VuZFBhdGg+aW1wb3J0ZWQuZ2V0SXRlbSh7Y2xhc3M6IHBhcGVyLkNvbXBvdW5kUGF0aH0pO1xuICAgICAgICAgICAgICAgIGlmKCF0aGlzLl9tYXJrKXtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgbG9hZCBDb21wb3VuZFBhdGggZnJvbSAke3BhdGh9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX21hcmsucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlRmFjdG9yID0gc2NhbGVGYWN0b3I7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHBsYWNlSW50byhjb250YWluZXI6IHBhcGVyLkl0ZW0sIGJhY2tncm91bmRDb2xvcjogcGFwZXIuQ29sb3Ipe1xuICAgICAgICAgICAgY29uc3Qgd2F0ZXJtYXJrRGltID0gTWF0aC5zcXJ0KGNvbnRhaW5lci5ib3VuZHMuc2l6ZS53aWR0aCAqIGNvbnRhaW5lci5ib3VuZHMuc2l6ZS5oZWlnaHQpICogdGhpcy5fc2NhbGVGYWN0b3I7XG4gICAgICAgICAgICB0aGlzLl9tYXJrLmJvdW5kcy5zaXplID0gbmV3IHBhcGVyLlNpemUod2F0ZXJtYXJrRGltLCB3YXRlcm1hcmtEaW0pO1xuICAgICAgICAgICAgLy8ganVzdCBpbnNpZGUgbG93ZXIgcmlnaHRcbiAgICAgICAgICAgIHRoaXMuX21hcmsucG9zaXRpb24gPSBjb250YWluZXIuYm91bmRzLmJvdHRvbVJpZ2h0LnN1YnRyYWN0KHdhdGVybWFya0RpbSAvIDIgKyAxKTtcblxuICAgICAgICAgICAgaWYoYmFja2dyb3VuZENvbG9yLmxpZ2h0bmVzcyA+IDAuNCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5maWxsQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5vcGFjaXR5ID0gMC4wNTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5maWxsQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5vcGFjaXR5ID0gMC4yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGFpbmVyLmFkZENoaWxkKHRoaXMuX21hcmspO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZW1vdmUoKXtcbiAgICAgICAgICAgIHRoaXMuX21hcmsucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG59IiwiXG50eXBlIERpY3Rpb25hcnk8VD4gPSBfLkRpY3Rpb25hcnk8VD47XG4iLCJcbmNsYXNzIE9ic2VydmFibGVFdmVudDxUPiB7XG4gICAgXG4gICAgcHJpdmF0ZSBfc3Vic2NyaWJlcnM6ICgoZXZlbnRBcmc6IFQpID0+IHZvaWQpW10gPSBbXTtcblxuICAgIC8qKlxuICAgICAqIFN1YnNjcmliZSBmb3Igbm90aWZpY2F0aW9uLiBSZXR1cm5zIHVuc3Vic2NyaWJlIGZ1bmN0aW9uLlxuICAgICAqLyAgICBcbiAgICBzdWJzY3JpYmUoaGFuZGxlcjogKGV2ZW50QXJnOiBUKSA9PiB2b2lkKTogKCgpID0+IHZvaWQpIHtcbiAgICAgICAgaWYodGhpcy5fc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyKSA8IDApe1xuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMucHVzaChoYW5kbGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCkgPT4gdGhpcy51bnN1YnNjcmliZShoYW5kbGVyKTtcbiAgICB9XG4gICAgXG4gICAgdW5zdWJzY3JpYmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCkge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGNhbGxiYWNrLCAwKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8VD4ge1xuICAgICAgICBsZXQgdW5zdWI6IGFueTtcbiAgICAgICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50UGF0dGVybjxUPihcbiAgICAgICAgICAgIChoYW5kbGVyVG9BZGQpID0+IHRoaXMuc3Vic2NyaWJlKDwoZXZlbnRBcmc6IFQpID0+IHZvaWQ+aGFuZGxlclRvQWRkKSxcbiAgICAgICAgICAgIChoYW5kbGVyVG9SZW1vdmUpID0+IHRoaXMudW5zdWJzY3JpYmUoPChldmVudEFyZzogVCkgPT4gdm9pZD5oYW5kbGVyVG9SZW1vdmUpXG4gICAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIFN1YnNjcmliZSBmb3Igb25lIG5vdGlmaWNhdGlvbi5cbiAgICAgKi9cbiAgICBzdWJzY3JpYmVPbmUoY2FsbGJhY2s6IChldmVudEFyZzogVCkgPT4gdm9pZCl7XG4gICAgICAgIGxldCB1bnN1YiA9IHRoaXMuc3Vic2NyaWJlKHQgPT4ge1xuICAgICAgICAgICAgdW5zdWIoKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKHQpOyAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgbm90aWZ5KGV2ZW50QXJnOiBUKXtcbiAgICAgICAgZm9yKGxldCBzdWJzY3JpYmVyIG9mIHRoaXMuX3N1YnNjcmliZXJzKXtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY2FsbCh0aGlzLCBldmVudEFyZyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgc3Vic2NyaWJlcnMuXG4gICAgICovXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XG4gICAgfVxufSIsIlxuZGVjbGFyZSB0eXBlIEdBRXZlbnQgPSB7XG4gIGV2ZW50Q2F0ZWdvcnk/OiBzdHJpbmcsXG4gIGV2ZW50QWN0aW9uPzogc3RyaW5nLFxuICBldmVudExhYmVsPzogc3RyaW5nXG4gIGV2ZW50VmFsdWU/OiBudW1iZXJcbn1cblxuZGVjbGFyZSBmdW5jdGlvbiBnYShjb21tYW5kOiBzdHJpbmcsIGhpdFR5cGU6IHN0cmluZywgZXZlbnQ6IEdBRXZlbnQpXG5cbmZ1bmN0aW9uIGdhRXZlbnQoZXZlbnQ6IEdBRXZlbnQpe1xuICAgIGdhKFwic2VuZFwiLCBcImV2ZW50XCIsIGV2ZW50KTtcbn1cbiIsIlxubmFtZXNwYWNlIEJvb3RTY3JpcHQge1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBNZW51SXRlbSB7XG4gICAgICAgIGNvbnRlbnQ6IGFueSxcbiAgICAgICAgb3B0aW9ucz86IE9iamVjdFxuICAgICAgICAvL29uQ2xpY2s/OiAoKSA9PiB2b2lkXG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRyb3Bkb3duKFxuICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICAgICAgY29udGVudDogYW55LFxuICAgICAgICAgICAgaXRlbXM6IE1lbnVJdGVtW11cbiAgICAgICAgfSk6IFZOb2RlIHtcblxuICAgICAgICByZXR1cm4gaChcImRpdi5kcm9wZG93blwiLCBbXG4gICAgICAgICAgICBoKFwiYnV0dG9uLmJ0bi5idG4tZGVmYXVsdC5kcm9wZG93bi10b2dnbGVcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiYXR0cnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFyZ3MuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLXRvZ2dsZVwiOiBcImRyb3Bkb3duXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MuY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgaChcInNwYW4uY2FyZXRcIilcbiAgICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIGgoXCJ1bC5kcm9wZG93bi1tZW51XCIsXG4gICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgYXJncy5pdGVtcy5tYXAoaXRlbSA9PlxuICAgICAgICAgICAgICAgICAgICBoKFwibGlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaCgnYScsIGl0ZW0ub3B0aW9ucyB8fCB7fSwgW2l0ZW0uY29udGVudF0pXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIF0pO1xuXG4gICAgfVxufVxuIiwiXG50eXBlIEl0ZW1DaGFuZ2VIYW5kbGVyID0gKGZsYWdzOiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnKSA9PiB2b2lkO1xudHlwZSBDYWxsYmFjayA9ICgpID0+IHZvaWQ7XG5cbmRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIEl0ZW0ge1xuICAgICAgICAvKipcbiAgICAgICAgICogU3Vic2NyaWJlIHRvIGFsbCBjaGFuZ2VzIGluIGl0ZW0uIFJldHVybnMgdW4tc3Vic2NyaWJlIGZ1bmN0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgc3Vic2NyaWJlKGhhbmRsZXI6IEl0ZW1DaGFuZ2VIYW5kbGVyKTogQ2FsbGJhY2s7XG4gICAgICAgIFxuICAgICAgICBfY2hhbmdlZChmbGFnczogUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZyk6IHZvaWQ7XG4gICAgfVxufVxuXG5uYW1lc3BhY2UgUGFwZXJOb3RpZnkge1xuXG4gICAgZXhwb3J0IGVudW0gQ2hhbmdlRmxhZyB7XG4gICAgICAgIC8vIEFueXRoaW5nIGFmZmVjdGluZyB0aGUgYXBwZWFyYW5jZSBvZiBhbiBpdGVtLCBpbmNsdWRpbmcgR0VPTUVUUlksXG4gICAgICAgIC8vIFNUUk9LRSwgU1RZTEUgYW5kIEFUVFJJQlVURSAoZXhjZXB0IGZvciB0aGUgaW52aXNpYmxlIG9uZXM6IGxvY2tlZCwgbmFtZSlcbiAgICAgICAgQVBQRUFSQU5DRSA9IDB4MSxcbiAgICAgICAgLy8gQSBjaGFuZ2UgaW4gdGhlIGl0ZW0ncyBjaGlsZHJlblxuICAgICAgICBDSElMRFJFTiA9IDB4MixcbiAgICAgICAgLy8gQSBjaGFuZ2Ugb2YgdGhlIGl0ZW0ncyBwbGFjZSBpbiB0aGUgc2NlbmUgZ3JhcGggKHJlbW92ZWQsIGluc2VydGVkLFxuICAgICAgICAvLyBtb3ZlZCkuXG4gICAgICAgIElOU0VSVElPTiA9IDB4NCxcbiAgICAgICAgLy8gSXRlbSBnZW9tZXRyeSAocGF0aCwgYm91bmRzKVxuICAgICAgICBHRU9NRVRSWSA9IDB4OCxcbiAgICAgICAgLy8gT25seSBzZWdtZW50KHMpIGhhdmUgY2hhbmdlZCwgYW5kIGFmZmVjdGVkIGN1cnZlcyBoYXZlIGFscmVhZHkgYmVlblxuICAgICAgICAvLyBub3RpZmllZC4gVGhpcyBpcyB0byBpbXBsZW1lbnQgYW4gb3B0aW1pemF0aW9uIGluIF9jaGFuZ2VkKCkgY2FsbHMuXG4gICAgICAgIFNFR01FTlRTID0gMHgxMCxcbiAgICAgICAgLy8gU3Ryb2tlIGdlb21ldHJ5IChleGNsdWRpbmcgY29sb3IpXG4gICAgICAgIFNUUk9LRSA9IDB4MjAsXG4gICAgICAgIC8vIEZpbGwgc3R5bGUgb3Igc3Ryb2tlIGNvbG9yIC8gZGFzaFxuICAgICAgICBTVFlMRSA9IDB4NDAsXG4gICAgICAgIC8vIEl0ZW0gYXR0cmlidXRlczogdmlzaWJsZSwgYmxlbmRNb2RlLCBsb2NrZWQsIG5hbWUsIG9wYWNpdHksIGNsaXBNYXNrIC4uLlxuICAgICAgICBBVFRSSUJVVEUgPSAweDgwLFxuICAgICAgICAvLyBUZXh0IGNvbnRlbnRcbiAgICAgICAgQ09OVEVOVCA9IDB4MTAwLFxuICAgICAgICAvLyBSYXN0ZXIgcGl4ZWxzXG4gICAgICAgIFBJWEVMUyA9IDB4MjAwLFxuICAgICAgICAvLyBDbGlwcGluZyBpbiBvbmUgb2YgdGhlIGNoaWxkIGl0ZW1zXG4gICAgICAgIENMSVBQSU5HID0gMHg0MDAsXG4gICAgICAgIC8vIFRoZSB2aWV3IGhhcyBiZWVuIHRyYW5zZm9ybWVkXG4gICAgICAgIFZJRVcgPSAweDgwMFxuICAgIH1cblxuICAgIC8vIFNob3J0Y3V0cyB0byBvZnRlbiB1c2VkIENoYW5nZUZsYWcgdmFsdWVzIGluY2x1ZGluZyBBUFBFQVJBTkNFXG4gICAgZXhwb3J0IGVudW0gQ2hhbmdlcyB7XG4gICAgICAgIC8vIENISUxEUkVOIGFsc28gY2hhbmdlcyBHRU9NRVRSWSwgc2luY2UgcmVtb3ZpbmcgY2hpbGRyZW4gZnJvbSBncm91cHNcbiAgICAgICAgLy8gY2hhbmdlcyBib3VuZHMuXG4gICAgICAgIENISUxEUkVOID0gQ2hhbmdlRmxhZy5DSElMRFJFTiB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXG4gICAgICAgIC8vIENoYW5naW5nIHRoZSBpbnNlcnRpb24gY2FuIGNoYW5nZSB0aGUgYXBwZWFyYW5jZSB0aHJvdWdoIHBhcmVudCdzIG1hdHJpeC5cbiAgICAgICAgSU5TRVJUSU9OID0gQ2hhbmdlRmxhZy5JTlNFUlRJT04gfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXG4gICAgICAgIEdFT01FVFJZID0gQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcbiAgICAgICAgU0VHTUVOVFMgPSBDaGFuZ2VGbGFnLlNFR01FTlRTIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcbiAgICAgICAgU1RST0tFID0gQ2hhbmdlRmxhZy5TVFJPS0UgfCBDaGFuZ2VGbGFnLlNUWUxFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxuICAgICAgICBTVFlMRSA9IENoYW5nZUZsYWcuU1RZTEUgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXG4gICAgICAgIEFUVFJJQlVURSA9IENoYW5nZUZsYWcuQVRUUklCVVRFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxuICAgICAgICBDT05URU5UID0gQ2hhbmdlRmxhZy5DT05URU5UIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcbiAgICAgICAgUElYRUxTID0gQ2hhbmdlRmxhZy5QSVhFTFMgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXG4gICAgICAgIFZJRVcgPSBDaGFuZ2VGbGFnLlZJRVcgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0VcbiAgICB9O1xuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgICAgIFxuICAgICAgICAvLyBJbmplY3QgSXRlbS5zdWJzY3JpYmVcbiAgICAgICAgY29uc3QgaXRlbVByb3RvID0gKDxhbnk+cGFwZXIpLkl0ZW0ucHJvdG90eXBlO1xuICAgICAgICBpdGVtUHJvdG8uc3Vic2NyaWJlID0gZnVuY3Rpb24oaGFuZGxlcjogSXRlbUNoYW5nZUhhbmRsZXIpOiBDYWxsYmFjayB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3N1YnNjcmliZXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGhhbmRsZXIpIDwgMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzLnB1c2goaGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoaGFuZGxlciwgMCk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXcmFwIEl0ZW0ucmVtb3ZlXG4gICAgICAgIGNvbnN0IGl0ZW1SZW1vdmUgPSBpdGVtUHJvdG8ucmVtb3ZlO1xuICAgICAgICBpdGVtUHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpdGVtUmVtb3ZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycyA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXcmFwIFByb2plY3QuX2NoYW5nZWRcbiAgICAgICAgY29uc3QgcHJvamVjdFByb3RvID0gPGFueT5wYXBlci5Qcm9qZWN0LnByb3RvdHlwZTtcbiAgICAgICAgY29uc3QgcHJvamVjdENoYW5nZWQgPSBwcm9qZWN0UHJvdG8uX2NoYW5nZWQ7XG4gICAgICAgIHByb2plY3RQcm90by5fY2hhbmdlZCA9IGZ1bmN0aW9uKGZsYWdzOiBDaGFuZ2VGbGFnLCBpdGVtOiBwYXBlci5JdGVtKSB7XG4gICAgICAgICAgICBwcm9qZWN0Q2hhbmdlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJzID0gKDxhbnk+aXRlbSkuX3N1YnNjcmliZXJzO1xuICAgICAgICAgICAgICAgIGlmIChzdWJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHMgb2Ygc3Vicykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5jYWxsKGl0ZW0sIGZsYWdzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZShmbGFnczogQ2hhbmdlRmxhZykge1xuICAgICAgICBsZXQgZmxhZ0xpc3Q6IHN0cmluZ1tdID0gW107XG4gICAgICAgIF8uZm9yT3duKENoYW5nZUZsYWcsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB2YWx1ZSkgPT09IFwibnVtYmVyXCIgJiYgKHZhbHVlICYgZmxhZ3MpKSB7XG4gICAgICAgICAgICAgICAgZmxhZ0xpc3QucHVzaChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZsYWdMaXN0LmpvaW4oJyB8ICcpO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZShpdGVtOiBwYXBlci5JdGVtLCBmbGFnczogQ2hhbmdlRmxhZyk6IFxuICAgICAgICBSeC5PYnNlcnZhYmxlPENoYW5nZUZsYWc+IFxuICAgIHtcbiAgICAgICAgbGV0IHVuc3ViOiAoKSA9PiB2b2lkO1xuICAgICAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnRQYXR0ZXJuPENoYW5nZUZsYWc+KFxuICAgICAgICAgICAgYWRkSGFuZGxlciA9PiB7XG4gICAgICAgICAgICAgICAgdW5zdWIgPSBpdGVtLnN1YnNjcmliZShmID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZiAmIGZsYWdzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEhhbmRsZXIoZik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgcmVtb3ZlSGFuZGxlciA9PiB7XG4gICAgICAgICAgICAgICAgaWYodW5zdWIpe1xuICAgICAgICAgICAgICAgICAgICB1bnN1YigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5QYXBlck5vdGlmeS5pbml0aWFsaXplKCk7XG4iLCJkZWNsYXJlIG1vZHVsZSBwYXBlciB7XG4gICAgaW50ZXJmYWNlIFZpZXcge1xuICAgICAgICAvKipcbiAgICAgICAgICogSW50ZXJuYWwgbWV0aG9kIGZvciBpbml0aWF0aW5nIG1vdXNlIGV2ZW50cyBvbiB2aWV3LlxuICAgICAgICAgKi9cbiAgICAgICAgZW1pdE1vdXNlRXZlbnRzKHZpZXc6IHBhcGVyLlZpZXcsIGl0ZW06IHBhcGVyLkl0ZW0sIHR5cGU6IHN0cmluZyxcbiAgICAgICAgICAgIGV2ZW50OiBhbnksIHBvaW50OiBwYXBlci5Qb2ludCwgcHJldlBvaW50OiBwYXBlci5Qb2ludCk7XG4gICAgfVxufVxuXG5uYW1lc3BhY2UgcGFwZXJFeHQge1xuXG4gICAgZXhwb3J0IGNsYXNzIFZpZXdab29tIHtcblxuICAgICAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xuICAgICAgICBmYWN0b3IgPSAxLjE7XG5cbiAgICAgICAgcHJpdmF0ZSBfbWluWm9vbTogbnVtYmVyO1xuICAgICAgICBwcml2YXRlIF9tYXhab29tOiBudW1iZXI7XG4gICAgICAgIHByaXZhdGUgX21vdXNlTmF0aXZlU3RhcnQ6IHBhcGVyLlBvaW50O1xuICAgICAgICBwcml2YXRlIF92aWV3Q2VudGVyU3RhcnQ6IHBhcGVyLlBvaW50O1xuICAgICAgICBwcml2YXRlIF92aWV3Q2hhbmdlZCA9IG5ldyBPYnNlcnZhYmxlRXZlbnQ8cGFwZXIuUmVjdGFuZ2xlPigpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByb2plY3Q6IHBhcGVyLlByb2plY3QsXG4gICAgICAgICAgICBnZXRCYWNrZ3JvdW5kSXRlbXM/OiAoKSA9PiBwYXBlci5JdGVtW10pIHtcbiAgICAgICAgICAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XG5cbiAgICAgICAgICAgICg8YW55PiQodGhpcy5wcm9qZWN0LnZpZXcuZWxlbWVudCkpLm1vdXNld2hlZWwoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludChldmVudC5vZmZzZXRYLCBldmVudC5vZmZzZXRZKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVpvb21DZW50ZXJlZChldmVudC5kZWx0YVksIG1vdXNlUG9zaXRpb24pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBkaWREcmFnID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMucHJvamVjdC52aWV3Lm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XG4gICAgICAgICAgICAgICAgY29uc3QgaGl0ID0gcHJvamVjdC5oaXRUZXN0KGV2LnBvaW50KTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX3ZpZXdDZW50ZXJTdGFydCkgeyAgLy8gbm90IGFscmVhZHkgZHJhZ2dpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhpdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFja2dyb3VuZEl0ZW1zID0gKGdldEJhY2tncm91bmRJdGVtcyAmJiBnZXRCYWNrZ3JvdW5kSXRlbXMoKSkgfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBoaXQgaXMgb24gbm90aGluZyBvciBvbiBhIG5vbi1iYWNrZ3JvdW5kIGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFoaXQuaXRlbSB8fCAhYmFja2dyb3VuZEl0ZW1zLnNvbWUoYmkgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmkgJiYgKGJpID09PSBoaXQuaXRlbSB8fCBiaS5pc0FuY2VzdG9yKGhpdC5pdGVtKSkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBkb24ndCB1c2UgZHJhZ2dpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2VudGVyU3RhcnQgPSB2aWV3LmNlbnRlcjtcbiAgICAgICAgICAgICAgICAgICAgLy8gSGF2ZSB0byB1c2UgbmF0aXZlIG1vdXNlIG9mZnNldCwgYmVjYXVzZSBldi5kZWx0YSBcbiAgICAgICAgICAgICAgICAgICAgLy8gIGNoYW5nZXMgYXMgdGhlIHZpZXcgaXMgc2Nyb2xsZWQuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vdXNlTmF0aXZlU3RhcnQgPSBuZXcgcGFwZXIuUG9pbnQoZXYuZXZlbnQub2Zmc2V0WCwgZXYuZXZlbnQub2Zmc2V0WSk7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYXRpdmVEZWx0YSA9IG5ldyBwYXBlci5Qb2ludChcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2LmV2ZW50Lm9mZnNldFggLSB0aGlzLl9tb3VzZU5hdGl2ZVN0YXJ0LngsXG4gICAgICAgICAgICAgICAgICAgICAgICBldi5ldmVudC5vZmZzZXRZIC0gdGhpcy5fbW91c2VOYXRpdmVTdGFydC55XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1vdmUgaW50byB2aWV3IGNvb3JkaW5hdGVzIHRvIHN1YnJhY3QgZGVsdGEsXG4gICAgICAgICAgICAgICAgICAgIC8vICB0aGVuIGJhY2sgaW50byBwcm9qZWN0IGNvb3Jkcy5cbiAgICAgICAgICAgICAgICAgICAgdmlldy5jZW50ZXIgPSB2aWV3LnZpZXdUb1Byb2plY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LnByb2plY3RUb1ZpZXcodGhpcy5fdmlld0NlbnRlclN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChuYXRpdmVEZWx0YSkpO1xuICAgICAgICAgICAgICAgICAgICBkaWREcmFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0LnZpZXcub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlVXAsIGV2ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21vdXNlTmF0aXZlU3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDZW50ZXJTdGFydCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnRW5kLCBldik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaWREcmFnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlkRHJhZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdmlld0NoYW5nZWQoKTogT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlJlY3RhbmdsZT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdDaGFuZ2VkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHpvb20oKTogbnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2plY3Qudmlldy56b29tO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHpvb21SYW5nZSgpOiBudW1iZXJbXSB7XG4gICAgICAgICAgICByZXR1cm4gW3RoaXMuX21pblpvb20sIHRoaXMuX21heFpvb21dO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0Wm9vbVJhbmdlKHJhbmdlOiBwYXBlci5TaXplW10pOiBudW1iZXJbXSB7XG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XG4gICAgICAgICAgICBjb25zdCBhU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XG4gICAgICAgICAgICBjb25zdCBiU2l6ZSA9IHJhbmdlLnNoaWZ0KCk7XG4gICAgICAgICAgICBjb25zdCBhID0gYVNpemUgJiYgTWF0aC5taW4oXG4gICAgICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYVNpemUuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLndpZHRoIC8gYVNpemUud2lkdGgpO1xuICAgICAgICAgICAgY29uc3QgYiA9IGJTaXplICYmIE1hdGgubWluKFxuICAgICAgICAgICAgICAgIHZpZXcuYm91bmRzLmhlaWdodCAvIGJTaXplLmhlaWdodCxcbiAgICAgICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGJTaXplLndpZHRoKTtcbiAgICAgICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKGEsIGIpO1xuICAgICAgICAgICAgaWYgKG1pbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX21pblpvb20gPSBtaW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heChhLCBiKTtcbiAgICAgICAgICAgIGlmIChtYXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXhab29tID0gbWF4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFt0aGlzLl9taW5ab29tLCB0aGlzLl9tYXhab29tXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHpvb21UbyhyZWN0OiBwYXBlci5SZWN0YW5nbGUpIHtcbiAgICAgICAgICAgIGlmKHJlY3QuaXNFbXB0eSgpIHx8IHJlY3Qud2lkdGggPT09IDAgfHwgcmVjdC5oZWlnaHQgPT09IDApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInNraXBwaW5nIHpvb20gdG9cIiwgcmVjdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xuICAgICAgICAgICAgdmlldy5jZW50ZXIgPSByZWN0LmNlbnRlcjtcbiAgICAgICAgICAgIGNvbnN0IHpvb21MZXZlbCA9IE1hdGgubWluKFxuICAgICAgICAgICAgICAgIHZpZXcudmlld1NpemUuaGVpZ2h0IC8gcmVjdC5oZWlnaHQsXG4gICAgICAgICAgICAgICAgdmlldy52aWV3U2l6ZS53aWR0aCAvIHJlY3Qud2lkdGgpO1xuICAgICAgICAgICAgdmlldy56b29tID0gem9vbUxldmVsO1xuICAgICAgICAgICAgdGhpcy5fdmlld0NoYW5nZWQubm90aWZ5KHZpZXcuYm91bmRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoYW5nZVpvb21DZW50ZXJlZChkZWx0YTogbnVtYmVyLCBtb3VzZVBvczogcGFwZXIuUG9pbnQpIHtcbiAgICAgICAgICAgIGlmICghZGVsdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XG4gICAgICAgICAgICBjb25zdCBvbGRab29tID0gdmlldy56b29tO1xuICAgICAgICAgICAgY29uc3Qgb2xkQ2VudGVyID0gdmlldy5jZW50ZXI7XG4gICAgICAgICAgICBjb25zdCB2aWV3UG9zID0gdmlldy52aWV3VG9Qcm9qZWN0KG1vdXNlUG9zKTtcblxuICAgICAgICAgICAgbGV0IG5ld1pvb20gPSBkZWx0YSA+IDBcbiAgICAgICAgICAgICAgICA/IHZpZXcuem9vbSAqIHRoaXMuZmFjdG9yXG4gICAgICAgICAgICAgICAgOiB2aWV3Lnpvb20gLyB0aGlzLmZhY3RvcjtcbiAgICAgICAgICAgIG5ld1pvb20gPSB0aGlzLnNldFpvb21Db25zdHJhaW5lZChuZXdab29tKTtcblxuICAgICAgICAgICAgaWYgKCFuZXdab29tKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB6b29tU2NhbGUgPSBvbGRab29tIC8gbmV3Wm9vbTtcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlckFkanVzdCA9IHZpZXdQb3Muc3VidHJhY3Qob2xkQ2VudGVyKTtcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHZpZXdQb3Muc3VidHJhY3QoY2VudGVyQWRqdXN0Lm11bHRpcGx5KHpvb21TY2FsZSkpXG4gICAgICAgICAgICAgICAgLnN1YnRyYWN0KG9sZENlbnRlcik7XG5cbiAgICAgICAgICAgIHZpZXcuY2VudGVyID0gdmlldy5jZW50ZXIuYWRkKG9mZnNldCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3ZpZXdDaGFuZ2VkLm5vdGlmeSh2aWV3LmJvdW5kcyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB6b29tIGxldmVsLlxuICAgICAgICAgKiBAcmV0dXJucyB6b29tIGxldmVsIHRoYXQgd2FzIHNldCwgb3IgbnVsbCBpZiBpdCB3YXMgbm90IGNoYW5nZWRcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgc2V0Wm9vbUNvbnN0cmFpbmVkKHpvb206IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbWluWm9vbSkge1xuICAgICAgICAgICAgICAgIHpvb20gPSBNYXRoLm1heCh6b29tLCB0aGlzLl9taW5ab29tKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXhab29tKSB7XG4gICAgICAgICAgICAgICAgem9vbSA9IE1hdGgubWluKHpvb20sIHRoaXMuX21heFpvb20pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xuICAgICAgICAgICAgaWYgKHpvb20gIT0gdmlldy56b29tKSB7XG4gICAgICAgICAgICAgICAgdmlldy56b29tID0gem9vbTtcbiAgICAgICAgICAgICAgICByZXR1cm4gem9vbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIHBhcGVyRXh0IHtcbiAgICBcbiAgICAvKipcbiAgICAgKiBVc2Ugb2YgdGhlc2UgZXZlbnRzIHJlcXVpcmVzIGZpcnN0IGNhbGxpbmcgZXh0ZW5kTW91c2VFdmVudHNcbiAgICAgKiAgIG9uIHRoZSBpdGVtLiBcbiAgICAgKi9cbiAgICBleHBvcnQgdmFyIEV2ZW50VHlwZSA9IHtcbiAgICAgICAgbW91c2VEcmFnU3RhcnQ6IFwibW91c2VEcmFnU3RhcnRcIixcbiAgICAgICAgbW91c2VEcmFnRW5kOiBcIm1vdXNlRHJhZ0VuZFwiXG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZE1vdXNlRXZlbnRzKGl0ZW06IHBhcGVyLkl0ZW0pe1xuICAgICAgICBcbiAgICAgICAgbGV0IGRyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcbiAgICAgICAgICAgIGlmKCFkcmFnZ2luZyl7XG4gICAgICAgICAgICAgICAgZHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGl0ZW0uZW1pdChwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZVVwLCBldiA9PiB7XG4gICAgICAgICAgICBpZihkcmFnZ2luZyl7XG4gICAgICAgICAgICAgICAgZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpdGVtLmVtaXQocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ0VuZCwgZXYpO1xuICAgICAgICAgICAgICAgIC8vIHByZXZlbnQgY2xpY2tcbiAgICAgICAgICAgICAgICBldi5zdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9XG59IiwiXG5tb2R1bGUgcGFwZXIge1xuXG4gICAgZXhwb3J0IHZhciBFdmVudFR5cGUgPSB7XG4gICAgICAgIGZyYW1lOiBcImZyYW1lXCIsXG4gICAgICAgIG1vdXNlRG93bjogXCJtb3VzZWRvd25cIixcbiAgICAgICAgbW91c2VVcDogXCJtb3VzZXVwXCIsXG4gICAgICAgIG1vdXNlRHJhZzogXCJtb3VzZWRyYWdcIixcbiAgICAgICAgY2xpY2s6IFwiY2xpY2tcIixcbiAgICAgICAgZG91YmxlQ2xpY2s6IFwiZG91YmxlY2xpY2tcIixcbiAgICAgICAgbW91c2VNb3ZlOiBcIm1vdXNlbW92ZVwiLFxuICAgICAgICBtb3VzZUVudGVyOiBcIm1vdXNlZW50ZXJcIixcbiAgICAgICAgbW91c2VMZWF2ZTogXCJtb3VzZWxlYXZlXCIsXG4gICAgICAgIGtleXVwOiBcImtleXVwXCIsXG4gICAgICAgIGtleWRvd246IFwia2V5ZG93blwiXG4gICAgfVxuXG59IiwiXG5hYnN0cmFjdCBjbGFzcyBDb21wb25lbnQ8VD4ge1xuICAgIGFic3RyYWN0IHJlbmRlcihkYXRhOiBUKTogVk5vZGU7XG59IiwiXG5pbnRlcmZhY2UgUmVhY3RpdmVEb21Db21wb25lbnQge1xuICAgIGRvbSQ6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+O1xufVxuXG5uYW1lc3BhY2UgVkRvbUhlbHBlcnMge1xuICAgIGV4cG9ydCBmdW5jdGlvbiByZW5kZXJBc0NoaWxkKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHZub2RlOiBWTm9kZSkge1xuICAgICAgICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnN0IHBhdGNoZWQgPSBwYXRjaChjaGlsZCwgdm5vZGUpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGF0Y2hlZC5lbG0pO1xuICAgIH1cbn1cblxuY2xhc3MgUmVhY3RpdmVEb20ge1xuXG4gICAgLyoqXG4gICAgICogUmVuZGVyIGEgcmVhY3RpdmUgY29tcG9uZW50IHdpdGhpbiBjb250YWluZXIuXG4gICAgICovXG4gICAgc3RhdGljIHJlbmRlclN0cmVhbShcbiAgICAgICAgZG9tJDogUnguT2JzZXJ2YWJsZTxWTm9kZT4sXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnRcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XG4gICAgICAgIGNvbnN0IGlkID0gY29udGFpbmVyLmlkO1xuICAgICAgICBsZXQgY3VycmVudDogSFRNTEVsZW1lbnQgfCBWTm9kZSA9IGNvbnRhaW5lcjtcbiAgICAgICAgY29uc3Qgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xuICAgICAgICBkb20kLnN1YnNjcmliZShkb20gPT4ge1xuICAgICAgICAgICAgaWYgKCFkb20pIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5yZW1vdmVFbXB0eU5vZGVzKGRvbSk7XG4gICAgICAgICAgICBsZXQgcGF0Y2hlZDogVk5vZGU7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHBhdGNoZWQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciBwYXRjaGluZyBkb21cIiwge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50LFxuICAgICAgICAgICAgICAgICAgICBkb20sXG4gICAgICAgICAgICAgICAgICAgIGVyclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZCAmJiAhcGF0Y2hlZC5lbG0uaWQpIHtcbiAgICAgICAgICAgICAgICAvLyByZXRhaW4gSURcbiAgICAgICAgICAgICAgICBwYXRjaGVkLmVsbS5pZCA9IGlkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2hlZDtcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzaW5rO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlY3Vyc2l2ZWx5IHJlbW92ZSBlbXB0eSBjaGlsZHJlbiBmcm9tIHRyZWUuXG4gICAgICovXG4gICAgc3RhdGljIHJlbW92ZUVtcHR5Tm9kZXMobm9kZTogVk5vZGUpIHtcbiAgICAgICAgaWYoIW5vZGUuY2hpbGRyZW4gfHwgIW5vZGUuY2hpbGRyZW4ubGVuZ3RoKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub3RFbXB0eSA9IG5vZGUuY2hpbGRyZW4uZmlsdGVyKGMgPT4gISFjKTtcbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoICE9IG5vdEVtcHR5Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwicmVtb3ZlZCBlbXB0eSBjaGlsZHJlbiBmcm9tXCIsIG5vZGUuY2hpbGRyZW4pO1xuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG5vdEVtcHR5O1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVFbXB0eU5vZGVzKGNoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbmRlciBhIHJlYWN0aXZlIGNvbXBvbmVudCB3aXRoaW4gY29udGFpbmVyLlxuICAgICAqL1xuICAgIHN0YXRpYyByZW5kZXJDb21wb25lbnQoXG4gICAgICAgIGNvbXBvbmVudDogUmVhY3RpdmVEb21Db21wb25lbnQsXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZVxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjb250YWluZXI7XG4gICAgICAgIGxldCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XG4gICAgICAgIGNvbXBvbmVudC5kb20kLnN1YnNjcmliZShkb20gPT4ge1xuICAgICAgICAgICAgaWYgKCFkb20pIHJldHVybjtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHNpbms7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVuZGVyIHdpdGhpbiBjb250YWluZXIgd2hlbmV2ZXIgc291cmNlIGNoYW5nZXMuXG4gICAgICovXG4gICAgc3RhdGljIGxpdmVSZW5kZXI8VD4oXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZSxcbiAgICAgICAgc291cmNlOiBSeC5PYnNlcnZhYmxlPFQ+LFxuICAgICAgICByZW5kZXI6IChuZXh0OiBUKSA9PiBWTm9kZVxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjb250YWluZXI7XG4gICAgICAgIGxldCBzaW5rID0gbmV3IFJ4LlN1YmplY3Q8Vk5vZGU+KCk7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IHJlbmRlcihkYXRhKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkgcmV0dXJuO1xuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoKGN1cnJlbnQsIG5vZGUpO1xuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHNpbms7XG4gICAgfVxuXG59IiwiXG5uYW1lc3BhY2UgQXBwIHtcblxuICAgIGV4cG9ydCBjbGFzcyBBcHBDb29raWVzIHtcblxuICAgICAgICBzdGF0aWMgWUVBUiA9IDM2NTtcbiAgICAgICAgc3RhdGljIEJST1dTRVJfSURfS0VZID0gXCJicm93c2VySWRcIjtcbiAgICAgICAgc3RhdGljIExBU1RfU0FWRURfU0tFVENIX0lEX0tFWSA9IFwibGFzdFNhdmVkU2tldGNoSWRcIjtcblxuICAgICAgICBnZXQgbGFzdFNhdmVkU2tldGNoSWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29va2llcy5nZXQoQXBwQ29va2llcy5MQVNUX1NBVkVEX1NLRVRDSF9JRF9LRVkpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGxhc3RTYXZlZFNrZXRjaElkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIENvb2tpZXMuc2V0KEFwcENvb2tpZXMuTEFTVF9TQVZFRF9TS0VUQ0hfSURfS0VZLCB2YWx1ZSwgeyBleHBpcmVzOiBBcHBDb29raWVzLllFQVIgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgYnJvd3NlcklkKCkge1xuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXMuZ2V0KEFwcENvb2tpZXMuQlJPV1NFUl9JRF9LRVkpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGJyb3dzZXJJZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgICAgICBDb29raWVzLnNldChBcHBDb29raWVzLkJST1dTRVJfSURfS0VZLCB2YWx1ZSwgeyBleHBpcmVzOiBBcHBDb29raWVzLllFQVIgfSk7XG4gICAgICAgIH1cblxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBBcHAge1xuXG4gICAgZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7XG5cbiAgICAgICAgc3RvcmU6IFN0b3JlO1xuICAgICAgICBlZGl0b3JNb2R1bGU6IFNrZXRjaEVkaXRvci5Ta2V0Y2hFZGl0b3JNb2R1bGU7XG4gICAgICAgIFxuICAgICAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNob3VsZExvZ0luZm8gPSBmYWxzZTsgICAgICAgXG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yTW9kdWxlID0gbmV3IFNrZXRjaEVkaXRvci5Ta2V0Y2hFZGl0b3JNb2R1bGUodGhpcy5zdG9yZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHN0YXJ0KCkgeyAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmVkaXRvck1vZHVsZS5zdGFydCgpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgYXBwOiBBcHAuQXBwTW9kdWxlO1xufSIsIlxubmFtZXNwYWNlIEFwcCB7XG5cbiAgICBleHBvcnQgY2xhc3MgQXBwUm91dGVyIGV4dGVuZHMgUm91dGVyNSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihbXG4gICAgICAgICAgICAgICAgbmV3IFJvdXRlTm9kZShcImhvbWVcIiwgXCIvXCIpLFxuICAgICAgICAgICAgICAgIG5ldyBSb3V0ZU5vZGUoXCJza2V0Y2hcIiwgXCIvc2tldGNoLzpza2V0Y2hJZFwiKSwgLy8gPFthLWZBLUYwLTldezE0fT5cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB1c2VIYXNoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFJvdXRlOiBcImhvbWVcIlxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvL3RoaXMudXNlUGx1Z2luKGxvZ2dlclBsdWdpbigpKVxuICAgICAgICAgICAgdGhpcy51c2VQbHVnaW4obGlzdGVuZXJzUGx1Z2luLmRlZmF1bHQoKSlcbiAgICAgICAgICAgICAgICAudXNlUGx1Z2luKGhpc3RvcnlQbHVnaW4uZGVmYXVsdCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvU2tldGNoRWRpdG9yKHNrZXRjaElkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGUoXCJza2V0Y2hcIiwgeyBza2V0Y2hJZDogc2tldGNoSWQgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgc3RhdGUoKSB7XG4gICAgICAgICAgICAvLyBjb3VsZCBkbyByb3V0ZSB2YWxpZGF0aW9uIHNvbWV3aGVyZVxuICAgICAgICAgICAgcmV0dXJuIDxBcHBSb3V0ZVN0YXRlPjxhbnk+dGhpcy5nZXRTdGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBBcHBSb3V0ZVN0YXRlIHtcbiAgICAgICAgbmFtZTogXCJob21lXCJ8XCJza2V0Y2hcIixcbiAgICAgICAgcGFyYW1zPzoge1xuICAgICAgICAgICAgc2tldGNoSWQ/OiBzdHJpbmdcbiAgICAgICAgfSxcbiAgICAgICAgcGF0aD86IHN0cmluZ1xuICAgIH1cblxufSIsIlxubmFtZXNwYWNlIEFwcCB7XG5cbiAgICBleHBvcnQgY2xhc3MgU3RvcmUge1xuXG4gICAgICAgIHN0YXRlOiBBcHBTdGF0ZTtcbiAgICAgICAgYWN0aW9uczogQWN0aW9ucztcbiAgICAgICAgZXZlbnRzOiBFdmVudHM7XG5cbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IEFwcFJvdXRlcjtcbiAgICAgICAgcHJpdmF0ZSBjb29raWVzOiBBcHBDb29raWVzO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXIgPSBuZXcgQXBwUm91dGVyKCk7XG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMgPSBuZXcgQWN0aW9ucygpO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMgPSBuZXcgQXBwQ29va2llcygpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Um91dGVyKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRTdGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5pbml0QWN0aW9uSGFuZGxlcnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRTdGF0ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBuZXcgQXBwU3RhdGUodGhpcy5jb29raWVzLCB0aGlzLnJvdXRlcik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGluaXRBY3Rpb25IYW5kbGVycygpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5lZGl0b3JMb2FkZWRTa2V0Y2guc3ViKHNrZXRjaElkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcInNrZXRjaFwiLCB7IHNrZXRjaElkIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5lZGl0b3JTYXZlZFNrZXRjaC5zdWIoaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29va2llcy5sYXN0U2F2ZWRTa2V0Y2hJZCA9IGlkO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc3RhcnRSb3V0ZXIoKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlci5zdGFydCgoZXJyLCBzdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnJvdXRlQ2hhbmdlZC5kaXNwYXRjaChzdGF0ZSk7IFxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwicm91dGVyIGVycm9yXCIsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwiaG9tZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEFwcFN0YXRlIHtcbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgY29va2llczogQXBwQ29va2llcztcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IEFwcFJvdXRlcjsgXG4gICAgICAgIFxuICAgICAgICBjb25zdHJ1Y3Rvcihjb29raWVzOiBBcHBDb29raWVzLCByb3V0ZXI6IEFwcFJvdXRlcil7XG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMgPSBjb29raWVzO1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXIgPSByb3V0ZXI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGJyb3dzZXJJZCA9IHRoaXMuY29va2llcy5icm93c2VySWQgfHwgRnJhbWV3b3JrLm5ld2lkKCk7XG4gICAgICAgICAgICAvLyBpbml0IG9yIHJlZnJlc2ggY29va2llXG4gICAgICAgICAgICB0aGlzLmNvb2tpZXMuYnJvd3NlcklkID0gYnJvd3NlcklkO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgbGFzdFNhdmVkU2tldGNoSWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb29raWVzLmxhc3RTYXZlZFNrZXRjaElkOyBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZ2V0IGJyb3dzZXJJZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvb2tpZXMuYnJvd3NlcklkO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBnZXQgcm91dGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZXIuc3RhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQWN0aW9ucyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcbiAgICAgICAgZWRpdG9yTG9hZGVkU2tldGNoID0gdGhpcy50b3BpYzxzdHJpbmc+KFwiZWRpdG9yTG9hZGVkU2tldGNoXCIpO1xuICAgICAgICBlZGl0b3JTYXZlZFNrZXRjaCA9IHRoaXMudG9waWM8c3RyaW5nPihcImVkaXRvclNhdmVkU2tldGNoXCIpO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFdmVudHMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XG4gICAgICAgIHJvdXRlQ2hhbmdlZCA9IHRoaXMudG9waWM8QXBwUm91dGVTdGF0ZT4oXCJyb3V0ZUNoYW5nZWRcIik7XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIERlbW8ge1xuXG4gICAgZXhwb3J0IGNsYXNzIERlbW9Nb2R1bGUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcblxuICAgICAgICAgICAgcGFwZXIuc2V0dXAoY2FudmFzKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gcGFwZXIudmlldztcblxuICAgICAgICAgICAgY29uc3QgcGFyc2VkRm9udHMgPSBuZXcgRm9udFNoYXBlLlBhcnNlZEZvbnRzKCgpID0+IHsgfSk7XG4gICAgICAgICAgICBwYXJzZWRGb250cy5nZXQoXCJmb250cy9Sb2JvdG8tNTAwLnR0ZlwiKS50aGVuKCBwYXJzZWQgPT4ge1xuXG4gICAgICAgICAgICAgICAgIGNvbnN0IHBhdGhEYXRhID0gcGFyc2VkLmZvbnQuZ2V0UGF0aChcIlNOQVBcIiwgMCwgMCwgMTI4KS50b1BhdGhEYXRhKCk7XG4gICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcbiAgICAgICAgICAgICAgICAgY29udGVudC5wb3NpdGlvbiA9IGNvbnRlbnQucG9zaXRpb24uYWRkKDUwKTtcbiAgICAgICAgICAgICAgICAgY29udGVudC5maWxsQ29sb3IgPSBcImxpZ2h0Z3JheVwiO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gcGFwZXIuUGF0aC5FbGxpcHNlKG5ldyBwYXBlci5SZWN0YW5nbGUoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2l6ZSg2MDAsIDMwMClcbiAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICByZWdpb24ucm90YXRlKDMwKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZWdpb24uYm91bmRzLmNlbnRlciA9IHZpZXcuY2VudGVyO1xuICAgICAgICAgICAgICAgIHJlZ2lvbi5zdHJva2VDb2xvciA9IFwibGlnaHRncmF5XCI7XG4gICAgICAgICAgICAgICAgcmVnaW9uLnN0cm9rZVdpZHRoID0gMztcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNuYXBQYXRoID0gbmV3IEZvbnRTaGFwZS5TbmFwUGF0aChyZWdpb24sIGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIHNuYXBQYXRoLmNvcm5lcnMgPSBbMCwgMC40LCAwLjQ1LCAwLjk1XTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2aWV3Lm9uRnJhbWUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNuYXBQYXRoLnNsaWRlKDAuMDAxKTtcbiAgICAgICAgICAgICAgICAgICAgc25hcFBhdGgudXBkYXRlUGF0aCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2aWV3LmRyYXcoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgICBcbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XG5cbiAgICBleHBvcnQgY2xhc3MgQnVpbGRlciB7XG5cbiAgICAgICAgc3RhdGljIGRlZmF1bHRGb250VXJsID0gXCJmb250cy9Sb2JvdG8tNTAwLnR0ZlwiO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xuXG4gICAgICAgICAgICBjb25zdCBjb250ZXh0ID0gPFRlbXBsYXRlVUlDb250ZXh0PntcbiAgICAgICAgICAgICAgICBnZXQgZm9udENhdGFsb2coKSB7IHJldHVybiBzdG9yZS5mb250Q2F0YWxvZyB9LFxuICAgICAgICAgICAgICAgIHJlbmRlckRlc2lnbjogKGRlc2lnbiwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUucmVuZGVyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2lnbjogZGVzaWduLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjcmVhdGVGb250Q2hvb3NlcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFRlbXBsYXRlRm9udENob29zZXIoc3RvcmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYXN5bmMgb2JzZXJ2ZVxuICAgICAgICAgICAgc3RvcmUudGVtcGxhdGUkLm9ic2VydmVPbihSeC5TY2hlZHVsZXIuZGVmYXVsdCkuc3Vic2NyaWJlKHQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RlbXBsYXRlU3RhdGUgPSB0LmNyZWF0ZU5ldyhjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBfLm1lcmdlKG5ld1RlbXBsYXRlU3RhdGUsIHN0b3JlLnN0YXRlLnRlbXBsYXRlU3RhdGUpO1xuICAgICAgICAgICAgICAgIHN0b3JlLnNldFRlbXBsYXRlU3RhdGUobmV3VGVtcGxhdGVTdGF0ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgZG9tJCA9IHN0b3JlLnRlbXBsYXRlU3RhdGUkXG4gICAgICAgICAgICAgICAgLm1hcCh0cyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250cm9scztcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xzID0gc3RvcmUudGVtcGxhdGUuY3JlYXRlVUkoY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgY2FsbGluZyAke3N0b3JlLnRlbXBsYXRlLm5hbWV9LmNyZWF0ZVVJYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBjb250cm9scykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYy52YWx1ZSQuc3Vic2NyaWJlKGQgPT4gc3RvcmUudXBkYXRlVGVtcGxhdGVTdGF0ZShkKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBjb250cm9scy5tYXAoYyA9PiBjLmNyZWF0ZU5vZGUodHMpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdm5vZGUgPSBoKFwiZGl2I3RlbXBsYXRlQ29udHJvbHNcIiwge30sIG5vZGVzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZub2RlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oZG9tJCwgY29udGFpbmVyKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xuXG4gICAgZXhwb3J0IGNsYXNzIE1vZHVsZSB7XG4gICAgICAgIHN0b3JlOiBTdG9yZTtcbiAgICAgICAgYnVpbGRlcjogQnVpbGRlcjtcblxuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIGJ1aWxkZXJDb250YWluZXI6IEhUTUxFbGVtZW50LFxuICAgICAgICAgICAgcHJldmlld0NhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsXG4gICAgICAgICAgICByZW5kZXJDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxuICAgICAgICAgICAgYmVsb3dDYW52YXM6IEhUTUxFbGVtZW50KSB7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoKTtcbiAgICAgICAgICAgIHRoaXMuYnVpbGRlciA9IG5ldyBCdWlsZGVyKGJ1aWxkZXJDb250YWluZXIsIHRoaXMuc3RvcmUpO1xuXG4gICAgICAgICAgICBuZXcgUHJldmlld0NhbnZhcyhwcmV2aWV3Q2FudmFzLCB0aGlzLnN0b3JlKTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS50ZW1wbGF0ZVN0YXRlJC5zdWJzY3JpYmUodHMgPT4gY29uc29sZS5sb2coXCJ0ZW1wbGF0ZVN0YXRlXCIsIHRzKSk7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnRlbXBsYXRlJC5zdWJzY3JpYmUodCA9PiBjb25zb2xlLmxvZyhcInRlbXBsYXRlXCIsIHQpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbmV3IFNoYXJlT3B0aW9uc1VJKGJlbG93Q2FudmFzLCB0aGlzLnN0b3JlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5pbml0KCkudGhlbihzID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnNldFRlbXBsYXRlKFwiRGlja2Vuc1wiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZVRlbXBsYXRlU3RhdGUoXG4gICAgICAgICAgICAgICAgICAgIHsgZGVzaWduOlxuICAgICAgICAgICAgICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkRvbid0IGdvYmJsZWZ1bmsgYXJvdW5kIHdpdGggd29yZHMuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogXCItIFJvYWxkIERhaGwsIFRoZSBCRkdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZWQ6IDAuOTk1OTE3NjQ1NzgwMzEyMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFwZTogXCJuYXJyb3dcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbWlseTogXCJBbWF0aWMgU0NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudDogXCJyZWd1bGFyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhbGV0dGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzg1NDQ0MlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZlcnQ6IHRydWUgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRDYXRlZ29yeTogXCJoYW5kd3JpdGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG4iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XG5cbiAgICBleHBvcnQgY2xhc3MgUHJldmlld0NhbnZhcyB7XG5cbiAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xuICAgICAgICBidWlsdERlc2lnbjogcGFwZXIuSXRlbTtcbiAgICAgICAgY29udGV4dDogVGVtcGxhdGVCdWlsZENvbnRleHQ7XG5cbiAgICAgICAgcHJpdmF0ZSBsYXN0UmVjZWl2ZWQ6IERlc2lnbjtcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJpbmcgPSBmYWxzZTtcbiAgICAgICAgcHJpdmF0ZSBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xuICAgICAgICBwcml2YXRlIHdvcmtzcGFjZTogcGFwZXIuR3JvdXA7XG4gICAgICAgIHByaXZhdGUgbWFyazogRnN0eC5GcmFtZXdvcmsuV2F0ZXJtYXJrO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuXG4gICAgICAgICAgICBwYXBlci5zZXR1cChjYW52YXMpO1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0ID0gcGFwZXIucHJvamVjdDtcbiAgICAgICAgICAgIHRoaXMud29ya3NwYWNlID0gbmV3IHBhcGVyLkdyb3VwKCk7XG5cbiAgICAgICAgICAgIEZvbnRTaGFwZS5WZXJ0aWNhbEJvdW5kc1N0cmV0Y2hQYXRoLnBvaW50c1BlclBhdGggPSA0MDA7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IHtcbiAgICAgICAgICAgICAgICBnZXRGb250OiBzcGVjaWZpZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc3BlY2lmaWVyIHx8ICFzcGVjaWZpZXIuZmFtaWx5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBCdWlsZGVyLmRlZmF1bHRGb250VXJsO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gc3RvcmUuZm9udENhdGFsb2cuZ2V0VXJsKHNwZWNpZmllci5mYW1pbHksIHNwZWNpZmllci52YXJpYW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IEJ1aWxkZXIuZGVmYXVsdEZvbnRVcmw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLnBhcnNlZEZvbnRzLmdldCh1cmwpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0LmZvbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMubWFyayA9IG5ldyBGc3R4LkZyYW1ld29yay5XYXRlcm1hcmsodGhpcy5wcm9qZWN0LCBcImltZy9zcGlyYWwtbG9nby5zdmdcIiwgMC4wNik7XG5cbiAgICAgICAgICAgIHN0b3JlLnRlbXBsYXRlU3RhdGUkLnN1YnNjcmliZSgodHM6IFRlbXBsYXRlU3RhdGUpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBvbmx5IHByb2Nlc3Mgb25lIHJlcXVlc3QgYXQgYSB0aW1lXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFsd2F5cyBwcm9jZXNzIHRoZSBsYXN0IHJlY2VpdmVkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFJlY2VpdmVkID0gdHMuZGVzaWduO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIodHMuZGVzaWduKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZG93bmxvYWRQTkdSZXF1ZXN0ZWQuc3ViKHBpeGVscyA9PiB0aGlzLmRvd25sb2FkUE5HKHBpeGVscykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBkb3dubG9hZFBORyhwaXhlbHM6IG51bWJlcikge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnN0b3JlLmRlc2lnbi5jb250ZW50IFxuICAgICAgICAgICAgICAgIHx8ICF0aGlzLnN0b3JlLmRlc2lnbi5jb250ZW50LnRleHQgXG4gICAgICAgICAgICAgICAgfHwgIXRoaXMuc3RvcmUuZGVzaWduLmNvbnRlbnQudGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIHZlcnkgZnJhZ2lsZSB3YXkgdG8gZ2V0IGJnIGNvbG9yXG4gICAgICAgICAgICBjb25zdCBzaGFwZSA9IHRoaXMud29ya3NwYWNlLmdldEl0ZW0oe2NsYXNzOiBwYXBlci5TaGFwZSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGJnQ29sb3IgPSA8cGFwZXIuQ29sb3I+c2hhcGUuZmlsbENvbG9yO1xuICAgICAgICAgICAgdGhpcy5tYXJrLnBsYWNlSW50byh0aGlzLndvcmtzcGFjZSwgYmdDb2xvcik7ICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEhhbGYgb2YgbWF4IERQSSBwcm9kdWNlcyBhcHByb3ggNDIwMHg0MjAwLlxuICAgICAgICAgICAgY29uc3QgZHBpID0gMC41ICogUGFwZXJIZWxwZXJzLmdldEV4cG9ydERwaSh0aGlzLndvcmtzcGFjZS5ib3VuZHMuc2l6ZSwgcGl4ZWxzKTtcbiAgICAgICAgICAgIGNvbnN0IHJhc3RlciA9IHRoaXMud29ya3NwYWNlLnJhc3Rlcml6ZShkcGksIGZhbHNlKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByYXN0ZXIudG9EYXRhVVJMKCk7XG4gICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IEZzdHguRnJhbWV3b3JrLmNyZWF0ZUZpbGVOYW1lKHRoaXMuc3RvcmUuZGVzaWduLmNvbnRlbnQudGV4dCwgNDAsIFwicG5nXCIpO1xuICAgICAgICAgICAgY29uc3QgYmxvYiA9IERvbUhlbHBlcnMuZGF0YVVSTFRvQmxvYihkYXRhKTtcbiAgICAgICAgICAgIHNhdmVBcyhibG9iLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMubWFyay5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgcmVuZGVyTGFzdFJlY2VpdmVkKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMubGFzdFJlY2VpdmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVuZGVyaW5nID0gdGhpcy5sYXN0UmVjZWl2ZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0UmVjZWl2ZWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHJlbmRlcmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHJlbmRlcihkZXNpZ246IERlc2lnbik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVuZGVyIGlzIGluIHByb2dyZXNzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJpbmcgPSB0cnVlO1xuICAgICAgICAgICAgcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5yZW1vdmVDaGlsZHJlbigpO1xuICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSBuZXcgcGFwZXIuR3JvdXAoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlLnRlbXBsYXRlLmJ1aWxkKGRlc2lnbiwgdGhpcy5jb250ZXh0KS50aGVuKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyByZW5kZXIgcmVzdWx0IGZyb21cIiwgZGVzaWduKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZml0Qm91bmRzKHRoaXMucHJvamVjdC52aWV3LmJvdW5kcyk7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYm91bmRzLnBvaW50ID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLnRvcExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud29ya3NwYWNlLmFkZENoaWxkKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgYW55IHJlY2VpdmVkIHdoaWxlIHJlbmRlcmluZyBcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckxhc3RSZWNlaXZlZCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcmVuZGVyaW5nIGRlc2lnblwiLCBlcnIsIGRlc2lnbik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJtb2R1bGUgU2tldGNoQnVpbGRlciB7XG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIFNoYXJlT3B0aW9uc1VJIHtcbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xuICAgICAgICBcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKXtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBSeC5PYnNlcnZhYmxlLmp1c3QobnVsbCk7XG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oc3RhdGUubWFwKCgpID0+IHRoaXMuY3JlYXRlRG9tKCkpLCBjb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjcmVhdGVEb20oKTogVk5vZGUge1xuICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXYuY29udHJvbHNcIiwgWyBcbiAgICAgICAgICAgICAgICBoKFwiYnV0dG9uLmJ0bi5idG4tcHJpbWFyeVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5kb3dubG9hZFBORygxMDAgKiAxMDAwKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbXCJEb3dubG9hZCBzbWFsbFwiXSksXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaChcImJ1dHRvbi5idG4uYnRuLXByaW1hcnlcIiwge1xuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuZG93bmxvYWRQTkcoNTAwICogMTAwMClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW1wiRG93bmxvYWQgbWVkaXVtXCJdKSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XG5cbiAgICBleHBvcnQgY2xhc3MgU3RvcmUge1xuXG4gICAgICAgIHByaXZhdGUgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG4gICAgICAgIHByaXZhdGUgX3RlbXBsYXRlJCA9IG5ldyBSeC5TdWJqZWN0PFRlbXBsYXRlPigpO1xuICAgICAgICBwcml2YXRlIF90ZW1wbGF0ZVN0YXRlJCA9IG5ldyBSeC5TdWJqZWN0PFRlbXBsYXRlU3RhdGU+KCk7XG4gICAgICAgIHByaXZhdGUgX3JlbmRlciQgPSBuZXcgUnguU3ViamVjdDxSZW5kZXJSZXF1ZXN0PigpO1xuICAgICAgICBwcml2YXRlIF9zdGF0ZToge1xuICAgICAgICAgICAgdGVtcGxhdGU/OiBUZW1wbGF0ZTtcbiAgICAgICAgICAgIHRlbXBsYXRlU3RhdGU6IFRlbXBsYXRlU3RhdGU7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBfZXZlbnRzQ2hhbm5lbCA9IG5ldyBUeXBlZENoYW5uZWwuQ2hhbm5lbCgpO1xuXG4gICAgICAgIHByaXZhdGUgX3BhcnNlZEZvbnRzOiBGb250U2hhcGUuUGFyc2VkRm9udHM7XG4gICAgICAgIHByaXZhdGUgX2ZvbnRDYXRhbG9nOiBGb250U2hhcGUuRm9udENhdGFsb2c7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVN0YXRlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbjoge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLl9wYXJzZWRGb250cyA9IG5ldyBGb250U2hhcGUuUGFyc2VkRm9udHMoKCkgPT4geyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50cyA9IHtcbiAgICAgICAgICAgIGRvd25sb2FkUE5HUmVxdWVzdGVkOiB0aGlzLl9ldmVudHNDaGFubmVsLnRvcGljPG51bWJlcj4oXCJkb3dubG9hZFBOR1JlcXVlc3RlZFwiKVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHN0YXRlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHBhcnNlZEZvbnRzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlZEZvbnRzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGZvbnRDYXRhbG9nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRDYXRhbG9nO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRlbXBsYXRlU3RhdGUkKCk6IFJ4Lk9ic2VydmFibGU8VGVtcGxhdGVTdGF0ZT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlU3RhdGUkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRlbXBsYXRlJCgpOiBSeC5PYnNlcnZhYmxlPFRlbXBsYXRlPiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGUkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHJlbmRlciQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyJDsvLy5vYnNlcnZlT24oUnguU2NoZWR1bGVyLmRlZmF1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRlbXBsYXRlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUudGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZGVzaWduKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZSAmJiB0aGlzLnN0YXRlLnRlbXBsYXRlU3RhdGUuZGVzaWduO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCgpOiBQcm9taXNlPFN0b3JlPiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlN0b3JlIGlzIGFscmVhZHkgaW5pdGFsaXplZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxTdG9yZT4oY2FsbGJhY2sgPT4ge1xuICAgICAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5mcm9tTG9jYWwoXCJmb250cy9nb29nbGUtZm9udHMuanNvblwiKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRDYXRhbG9nID0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGRvd25sb2FkUE5HKHBpeGVsczogbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5kb3dubG9hZFBOR1JlcXVlc3RlZC5kaXNwYXRjaCgpO1xuICAgICAgICAgICAgdGhpcy5zZW5kRGVzaWduR0FFdmVudChcImV4cG9ydFwiLCBwaXhlbHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VuZERlc2lnbkdBRXZlbnQoYWN0aW9uOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGxldCBsYWJlbCA9IHRoaXMuX3N0YXRlLnRlbXBsYXRlLm5hbWU7XG4gICAgICAgICAgICBjb25zdCBmb250ID0gdGhpcy5fc3RhdGUudGVtcGxhdGVTdGF0ZS5kZXNpZ24uZm9udDtcbiAgICAgICAgICAgIGlmIChmb250KSB7XG4gICAgICAgICAgICAgICAgbGFiZWwgKz0gXCI7XCIgKyBmb250LmZhbWlseSArIFwiIFwiICsgZm9udC52YXJpYW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2FFdmVudCh7XG4gICAgICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogXCJEZXNpZ25cIixcbiAgICAgICAgICAgICAgICBldmVudEFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgICAgICAgIGV2ZW50TGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgICAgIGV2ZW50VmFsdWU6IHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRlbXBsYXRlKG5hbWU6IHN0cmluZykge1xuICAgICAgICAgICAgbGV0IHRlbXBsYXRlOiBUZW1wbGF0ZTtcbiAgICAgICAgICAgIGlmICgvRGlja2Vucy9pLnRlc3QobmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IG5ldyBTa2V0Y2hCdWlsZGVyLlRlbXBsYXRlcy5EaWNrZW5zKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHRlbXBsYXRlICR7bmFtZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RhdGUudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlJC5vbk5leHQodGVtcGxhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0RGVzaWduKHZhbHVlOiBEZXNpZ24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGVtcGxhdGVTdGF0ZSh7IGRlc2lnbjogdmFsdWUgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZVRlbXBsYXRlU3RhdGUoY2hhbmdlOiBUZW1wbGF0ZVN0YXRlQ2hhbmdlKSB7XG4gICAgICAgICAgICBfLm1lcmdlKHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZSwgY2hhbmdlKTtcblxuICAgICAgICAgICAgY29uc3QgZGVzaWduID0gdGhpcy5zdGF0ZS50ZW1wbGF0ZVN0YXRlLmRlc2lnbjtcbiAgICAgICAgICAgIGlmIChkZXNpZ24gJiYgZGVzaWduLmZvbnQgJiYgZGVzaWduLmZvbnQuZmFtaWx5ICYmICFkZXNpZ24uZm9udC52YXJpYW50KSB7XG4gICAgICAgICAgICAgICAgLy8gc2V0IGRlZmF1bHQgdmFyaWFudFxuICAgICAgICAgICAgICAgIGRlc2lnbi5mb250LnZhcmlhbnQgPSBGb250U2hhcGUuRm9udENhdGFsb2cuZGVmYXVsdFZhcmlhbnQoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRDYXRhbG9nLmdldFJlY29yZChkZXNpZ24uZm9udC5mYW1pbHkpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGVTdGF0ZSQub25OZXh0KHRoaXMuc3RhdGUudGVtcGxhdGVTdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUZW1wbGF0ZVN0YXRlKHN0YXRlOiBUZW1wbGF0ZVN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZS50ZW1wbGF0ZVN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZVN0YXRlJC5vbk5leHQoc3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyKHJlcXVlc3Q6IFJlbmRlclJlcXVlc3QpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlciQub25OZXh0KHJlcXVlc3QpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XG4gICAgXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZSB7XG4gICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgICAgICAgaW1hZ2U6IHN0cmluZztcbiAgICAgICAgY3JlYXRlTmV3KGNvbnRleHQ6IFRlbXBsYXRlVUlDb250ZXh0KTogVGVtcGxhdGVTdGF0ZTtcbiAgICAgICAgY3JlYXRlVUkoY29udGV4dDogVGVtcGxhdGVVSUNvbnRleHQpOiBCdWlsZGVyQ29udHJvbFtdO1xuICAgICAgICBidWlsZChkZXNpZ246IERlc2lnbiwgY29udGV4dDogVGVtcGxhdGVCdWlsZENvbnRleHQpOiBQcm9taXNlPHBhcGVyLkl0ZW0+O1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGVVSUNvbnRleHQge1xuICAgICAgICByZW5kZXJEZXNpZ24oZGVzaWduOiBEZXNpZ24sIGNhbGxiYWNrOiAoaW1hZ2VEYXRhVXJsOiBzdHJpbmcpID0+IHZvaWQpO1xuICAgICAgICBmb250Q2F0YWxvZzogRm9udFNoYXBlLkZvbnRDYXRhbG9nO1xuICAgICAgICBjcmVhdGVGb250Q2hvb3NlcigpOiBCdWlsZGVyQ29udHJvbDtcbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZUJ1aWxkQ29udGV4dCB7XG4gICAgICAgIGdldEZvbnQoZGVzYzogRm9udFNoYXBlLkZvbnRTcGVjaWZpZXIpOiBQcm9taXNlPG9wZW50eXBlLkZvbnQ+O1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlU3RhdGUge1xuICAgICAgICBkZXNpZ246IERlc2lnbjtcbiAgICAgICAgZm9udENhdGVnb3J5Pzogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGVTdGF0ZUNoYW5nZSB7XG4gICAgICAgIGRlc2lnbj86IERlc2lnbjtcbiAgICAgICAgZm9udENhdGVnb3J5Pzogc3RyaW5nO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIERlc2lnbiB7XG4gICAgICAgIGNvbnRlbnQ/OiBhbnk7XG4gICAgICAgIHNoYXBlPzogc3RyaW5nO1xuICAgICAgICBmb250PzogRm9udFNoYXBlLkZvbnRTcGVjaWZpZXI7XG4gICAgICAgIHBhbGV0dGU/OiBEZXNpZ25QYWxldHRlO1xuICAgICAgICBzZWVkPzogbnVtYmVyO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgaW50ZXJmYWNlIERlc2lnblBhbGV0dGUge1xuICAgICAgICBjb2xvcj86IHN0cmluZztcbiAgICAgICAgaW52ZXJ0PzogYm9vbGVhbjtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIERlc2lnbkNoYW5nZSBleHRlbmRzIERlc2lnbntcbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGludGVyZmFjZSBSZW5kZXJSZXF1ZXN0IHtcbiAgICAgICAgZGVzaWduOiBEZXNpZ247XG4gICAgICAgIGFyZWE/OiBudW1iZXI7XG4gICAgICAgIGNhbGxiYWNrOiAoaW1hZ2VEYXRhVXJsOiBzdHJpbmcpID0+IHZvaWQ7XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQnVpbGRlckNvbnRyb2wge1xuICAgICAgICB2YWx1ZSQ6IFJ4Lk9ic2VydmFibGU8VGVtcGxhdGVTdGF0ZUNoYW5nZT47XG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU6IFRlbXBsYXRlU3RhdGUpOiBWTm9kZTtcbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGludGVyZmFjZSBWYWx1ZUNvbnRyb2w8VD4ge1xuICAgICAgICB2YWx1ZSQ6IFJ4Lk9ic2VydmFibGU8VD47XG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU/OiBUKTogVk5vZGU7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBPcHRpb25DaG9vc2VyPFQ+IHtcbiAgICAgICAgdmFsdWUkOiBSeC5PYnNlcnZhYmxlPFQ+O1xuICAgICAgICBjcmVhdGVOb2RlKGNob2ljZXM6IFRbXSwgdmFsdWU/OiBUKTogVk5vZGU7XG4gICAgfVxuICAgIFxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcbiAgICBcbiAgICBleHBvcnQgbmFtZXNwYWNlIENvbnRyb2xIZWxwZXJzIHtcbiAgICAgICAgXG4gICAgICAgICBleHBvcnQgZnVuY3Rpb24gY2hvb3NlcjxUPihcbiAgICAgICAgICAgICBjaG9pY2VzOiBDaG9pY2VbXSlcbiAgICAgICAgICAgICA6IFZOb2Rle1xuICAgICAgICAgICAgcmV0dXJuIGgoXCJ1bC5jaG9vc2VyXCIsXG4gICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgY2hvaWNlcy5tYXAoY2hvaWNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJsaS5jaG9pY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9zZW46IGNob2ljZS5jaG9zZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBldiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9pY2UuY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbY2hvaWNlLm5vZGVdKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApOyBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDaG9pY2Uge1xuICAgICAgICAgICAgIG5vZGU6IFZOb2RlLCBcbiAgICAgICAgICAgICBjaG9zZW4/OiBib29sZWFuLCBcbiAgICAgICAgICAgICBjYWxsYmFjaz86ICgpID0+IHZvaWRcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG4gICAgXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xuXG4gICAgZXhwb3J0IGNsYXNzIEZvbnRDaG9vc2VyIGltcGxlbWVudHMgVmFsdWVDb250cm9sPEZvbnRDaG9vc2VyU3RhdGU+IHtcblxuICAgICAgICBwcml2YXRlIGZvbnRDYXRhbG9nOiBGb250U2hhcGUuRm9udENhdGFsb2c7XG4gICAgICAgIHByaXZhdGUgX3ZhbHVlJCA9IG5ldyBSeC5TdWJqZWN0PEZvbnRDaG9vc2VyU3RhdGU+KCk7XG5cbiAgICAgICAgbWF4RmFtaWxpZXMgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGZvbnRDYXRhbG9nOiBGb250U2hhcGUuRm9udENhdGFsb2cpIHtcbiAgICAgICAgICAgIHRoaXMuZm9udENhdGFsb2cgPSBmb250Q2F0YWxvZztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgcHJlbG9hZEZhbWlsaWVzID0gdGhpcy5mb250Q2F0YWxvZy5nZXRDYXRlZ29yaWVzKClcbiAgICAgICAgICAgICAgICAubWFwKGMgPT4gZm9udENhdGFsb2cuZ2V0RmFtaWxpZXMoYylbMF0pO1xuICAgICAgICAgICAgRm9udFNoYXBlLkZvbnRDYXRhbG9nLmxvYWRQcmV2aWV3U3Vic2V0cyhwcmVsb2FkRmFtaWxpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHZhbHVlJCgpOiBSeC5PYnNlcnZhYmxlPEZvbnRDaG9vc2VyU3RhdGU+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZSQ7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVOb2RlKHZhbHVlPzogRm9udENob29zZXJTdGF0ZSk6IFZOb2RlIHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuOiBWTm9kZVtdID0gW107XG5cbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goaChcImgzXCIsIFtcIkZvbnQgQ2F0ZWdvcmllc1wiXSkpO1xuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcmllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0Q2F0ZWdvcmllcygpO1xuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlDaG9pY2VzID0gY2F0ZWdvcmllcy5tYXAoY2F0ZWdvcnkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yeUZhbWlsaWVzID0gdGhpcy5mb250Q2F0YWxvZy5nZXRGYW1pbGllcyhjYXRlZ29yeSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4RmFtaWxpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlGYW1pbGllcyA9IGNhdGVnb3J5RmFtaWxpZXMuc2xpY2UoMCwgdGhpcy5tYXhGYW1pbGllcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0RmFtaWx5ID0gY2F0ZWdvcnlGYW1pbGllc1swXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gPENvbnRyb2xIZWxwZXJzLkNob2ljZT57XG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IGgoXCJzcGFuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IEZvbnRIZWxwZXJzLmdldENzc1N0eWxlKGZpcnN0RmFtaWx5KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjYXRlZ29yeV0pLFxuICAgICAgICAgICAgICAgICAgICBjaG9zZW46IHZhbHVlLmNhdGVnb3J5ID09PSBjYXRlZ29yeSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5sb2FkUHJldmlld1N1YnNldHMoY2F0ZWdvcnlGYW1pbGllcyk7IFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUkLm9uTmV4dCh7IGNhdGVnb3J5LCBmYW1pbHk6IGZpcnN0RmFtaWx5IH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKENvbnRyb2xIZWxwZXJzLmNob29zZXIoY2F0ZWdvcnlDaG9pY2VzKSk7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZS5jYXRlZ29yeSkge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goaChcImgzXCIsIHt9LCBbXCJGb250c1wiXSkpO1xuICAgICAgICAgICAgICAgIGxldCBmYW1pbGllcyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0RmFtaWxpZXModmFsdWUuY2F0ZWdvcnkpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1heEZhbWlsaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZhbWlsaWVzID0gZmFtaWxpZXMuc2xpY2UoMCwgdGhpcy5tYXhGYW1pbGllcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGZhbWlseU9wdGlvbnMgPSBmYW1pbGllcy5tYXAoZmFtaWx5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxDb250cm9sSGVscGVycy5DaG9pY2U+e1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogaChcInNwYW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiBGb250SGVscGVycy5nZXRDc3NTdHlsZShmYW1pbHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZmFtaWx5XSksXG4gICAgICAgICAgICAgICAgICAgICAgICBjaG9zZW46IHZhbHVlLmZhbWlseSA9PT0gZmFtaWx5LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuX3ZhbHVlJC5vbk5leHQoeyBmYW1pbHksIHZhcmlhbnQ6IFwiXCIgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goQ29udHJvbEhlbHBlcnMuY2hvb3NlcihmYW1pbHlPcHRpb25zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh2YWx1ZS5mYW1pbHkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YXJpYW50cyA9IHRoaXMuZm9udENhdGFsb2cuZ2V0VmFyaWFudHModmFsdWUuZmFtaWx5KTtcbiAgICAgICAgICAgICAgICBpZiAodmFyaWFudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGgoXCJoM1wiLCB7fSwgW1wiRm9udCBTdHlsZXNcIl0pKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YXJpYW50T3B0aW9ucyA9IHZhcmlhbnRzLm1hcCh2YXJpYW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwic3BhblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogRm9udEhlbHBlcnMuZ2V0Q3NzU3R5bGUodmFsdWUuZmFtaWx5LCB2YXJpYW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdmFyaWFudF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob3NlbjogdmFsdWUudmFyaWFudCA9PT0gdmFyaWFudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5fdmFsdWUkLm9uTmV4dCh7IHZhcmlhbnQgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goQ29udHJvbEhlbHBlcnMuY2hvb3Nlcih2YXJpYW50T3B0aW9ucykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGgoXCJkaXYuZm9udENob29zZXJcIiwge30sIGNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRm9udENob29zZXJTdGF0ZSB7XG4gICAgICAgIGNhdGVnb3J5Pzogc3RyaW5nO1xuICAgICAgICBmYW1pbHk/OiBzdHJpbmc7XG4gICAgICAgIHZhcmlhbnQ/OiBzdHJpbmc7XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xuXG4gICAgZXhwb3J0IGNsYXNzIEltYWdlQ2hvb3NlciB7XG5cbiAgICAgICAgcHJpdmF0ZSBfY2hvc2VuJCA9IG5ldyBSeC5TdWJqZWN0PEltYWdlQ2hvaWNlPigpO1xuXG4gICAgICAgIGNyZWF0ZU5vZGUob3B0aW9uczogSW1hZ2VDaG9vc2VyT3B0aW9ucyk6IFZOb2RlIHtcbiAgICAgICAgICAgIGNvbnN0IGNob2ljZU5vZGVzID0gb3B0aW9ucy5jaG9pY2VzLm1hcChjID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaW1nOiBWTm9kZTtcbiAgICAgICAgICAgICAgICBjb25zdCBvbkNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaG9zZW4kLm9uTmV4dChjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBvcHRpb25zLmNob3NlbiA9PT0gYy52YWx1ZSBcbiAgICAgICAgICAgICAgICAgICAgPyBcImltZy5jaG9zZW5cIiBcbiAgICAgICAgICAgICAgICAgICAgOiBcImltZ1wiO1xuICAgICAgICAgICAgICAgIGlmIChjLmxvYWRJbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW1nRWxtO1xuICAgICAgICAgICAgICAgICAgICBpbWcgPSBoKHNlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBvbkNsaWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGtpY2sgb2ZmIGltYWdlIGxvYWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiB2bm9kZSA9PiBjLmxvYWRJbWFnZSh2bm9kZS5lbG0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW1nID0gaChzZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmOiBjLmltYWdlVXJsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogb25DbGlja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJsaVwiLCB7fSwgW1xuICAgICAgICAgICAgICAgICAgICBpbWdcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gaChcInVsLmNob29zZXJcIiwge30sIGNob2ljZU5vZGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBjaG9zZW4kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Nob3NlbiQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1hZ2VDaG9vc2VyT3B0aW9ucyB7XG4gICAgICAgIGNob2ljZXM6IEltYWdlQ2hvaWNlW10sXG4gICAgICAgIGNob3Nlbj86IHN0cmluZ1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1hZ2VDaG9pY2Uge1xuICAgICAgICB2YWx1ZTogc3RyaW5nO1xuICAgICAgICBsYWJlbDogc3RyaW5nO1xuICAgICAgICBpbWFnZVVybD86IHN0cmluZztcbiAgICAgICAgbG9hZEltYWdlPzogKGVsZW1lbnQ6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHZvaWQ7XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xuXG4gICAgZXhwb3J0IGNsYXNzIFRlbXBsYXRlRm9udENob29zZXIgaW1wbGVtZW50cyBCdWlsZGVyQ29udHJvbHtcbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgX2ZvbnRDaG9vc2VyOiBGb250Q2hvb3NlcjtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5fZm9udENob29zZXIgPSBuZXcgRm9udENob29zZXIoc3RvcmUuZm9udENhdGFsb2cpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9mb250Q2hvb3Nlci5tYXhGYW1pbGllcyA9IDE1OyBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY3JlYXRlTm9kZSh2YWx1ZTogVGVtcGxhdGVTdGF0ZSk6IFZOb2RlIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnQgPSB2YWx1ZS5kZXNpZ24gJiYgdmFsdWUuZGVzaWduLmZvbnQ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udENob29zZXIuY3JlYXRlTm9kZSg8Rm9udENob29zZXJTdGF0ZT57XG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IHZhbHVlLmZvbnRDYXRlZ29yeSxcbiAgICAgICAgICAgICAgICBmYW1pbHk6IGZvbnQgJiYgZm9udC5mYW1pbHksXG4gICAgICAgICAgICAgICAgdmFyaWFudDogZm9udCAmJiBmb250LnZhcmlhbnRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGdldCB2YWx1ZSQoKTogUnguT2JzZXJ2YWJsZTxUZW1wbGF0ZVN0YXRlPiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udENob29zZXIudmFsdWUkLm1hcChjaG9pY2UgPT4gPFRlbXBsYXRlU3RhdGU+e1xuICAgICAgICAgICAgICAgIGZvbnRDYXRlZ29yeTogY2hvaWNlLmNhdGVnb3J5LFxuICAgICAgICAgICAgICAgIGRlc2lnbjoge1xuICAgICAgICAgICAgICAgICAgICBmb250OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmYW1pbHk6IGNob2ljZS5mYW1pbHksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50OiBjaG9pY2UudmFyaWFudFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSBcblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcblxuICAgIGV4cG9ydCBjbGFzcyBUZXh0SW5wdXQgaW1wbGVtZW50cyBWYWx1ZUNvbnRyb2w8c3RyaW5nPiB7XG5cbiAgICAgICAgcHJpdmF0ZSBfdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8c3RyaW5nPigpO1xuXG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU/OiBzdHJpbmcsIHBsYWNlaG9sZGVyPzogc3RyaW5nLCB0ZXh0YXJlYT86IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHJldHVybiBoKFwidGV4dGFyZWFcIiA/IFwidGV4dGFyZWFcIiA6IFwiaW5wdXRcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0ZXh0YXJlYSA/IHVuZGVmaW5lZCA6IFwidGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXByZXNzOiAoZXY6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGV2LndoaWNoIHx8IGV2LmtleUNvZGUpID09PSBEb21IZWxwZXJzLktleUNvZGVzLkVudGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZXYudGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5ibHVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUkLm9uTmV4dChldi50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB2YWx1ZSQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWUkO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIuVGVtcGxhdGVzIHtcblxuICAgIGV4cG9ydCBjbGFzcyBEaWNrZW5zIGltcGxlbWVudHMgU2tldGNoQnVpbGRlci5UZW1wbGF0ZSB7XG5cbiAgICAgICAgbmFtZSA9IFwiRGlja2Vuc1wiO1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJTdGFjayBibG9ja3Mgb2YgdGV4dCBpbiB0aGUgZm9ybSBvZiBhIHdhdnkgbGFkZGVyLlwiO1xuICAgICAgICBpbWFnZTogc3RyaW5nO1xuICAgICAgICBsaW5lSGVpZ2h0VmFyaWF0aW9uID0gMC44O1xuICAgICAgICBkZWZhdWx0Rm9udFNpemUgPSAxMjg7XG4gICAgICAgIG1hcmdpbkZhY3RvciA9IDAuMTQ7XG5cbiAgICAgICAgY3JlYXRlTmV3KGNvbnRleHQ6IFRlbXBsYXRlVUlDb250ZXh0KTogVGVtcGxhdGVTdGF0ZSB7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0Rm9udFJlY29yZCA9IGNvbnRleHQuZm9udENhdGFsb2cuZ2V0TGlzdCgxKVswXTtcbiAgICAgICAgICAgIHJldHVybiA8VGVtcGxhdGVTdGF0ZT57XG4gICAgICAgICAgICAgICAgZGVzaWduOiB7XG4gICAgICAgICAgICAgICAgICAgIHNoYXBlOiBcIm5hcnJvd1wiLFxuICAgICAgICAgICAgICAgICAgICBmb250OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmYW1pbHk6IGRlZmF1bHRGb250UmVjb3JkLmZhbWlseVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzZWVkOiBNYXRoLnJhbmRvbSgpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmb250Q2F0ZWdvcnk6IGRlZmF1bHRGb250UmVjb3JkLmNhdGVnb3J5XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVVSShjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IEJ1aWxkZXJDb250cm9sW10ge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRleHRFbnRyeSgpLFxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhcGVDaG9vc2VyKGNvbnRleHQpLFxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVmFyaWF0aW9uQ29udHJvbCgpLFxuICAgICAgICAgICAgICAgIGNvbnRleHQuY3JlYXRlRm9udENob29zZXIoKSxcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVBhbGV0dGVDaG9vc2VyKClcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cblxuICAgICAgICBidWlsZChkZXNpZ246IERlc2lnbiwgY29udGV4dDogVGVtcGxhdGVCdWlsZENvbnRleHQpOiBQcm9taXNlPHBhcGVyLkl0ZW0+IHtcbiAgICAgICAgICAgIGlmICghZGVzaWduLmNvbnRlbnQgfHwgIWRlc2lnbi5jb250ZW50LnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5nZXRGb250KGRlc2lnbi5mb250KS50aGVuKGZvbnQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmRzID0gZGVzaWduLmNvbnRlbnQudGV4dC50b0xvY2FsZVVwcGVyQ2FzZSgpLnNwbGl0KC9cXHMvKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlZWRSYW5kb20gPSBuZXcgRnJhbWV3b3JrLlNlZWRSYW5kb20oXG4gICAgICAgICAgICAgICAgICAgIGRlc2lnbi5zZWVkID09IG51bGwgPyBNYXRoLnJhbmRvbSgpIDogZGVzaWduLnNlZWQpO1xuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRMZW5ndGg6IG51bWJlcjtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGRlc2lnbi5zaGFwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmFsYW5jZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlbmd0aCA9IDIgKiBNYXRoLnNxcnQoXy5zdW0od29yZHMubWFwKHcgPT4gdy5sZW5ndGggKyAxKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ3aWRlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBudW1MaW5lcyA9IDNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlbmd0aCA9IF8uc3VtKHdvcmRzLm1hcCh3ID0+IHcubGVuZ3RoICsgMSkpIC8gbnVtTGluZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlbmd0aCA9IDxudW1iZXI+Xy5tYXgod29yZHMubWFwKHcgPT4gdy5sZW5ndGgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXJnZXRMZW5ndGggKj0gKDAuOCArIHNlZWRSYW5kb20ucmFuZG9tKCkgKiAwLjQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gdGhpcy5iYWxhbmNlTGluZXMod29yZHMsIHRhcmdldExlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgdGV4dENvbG9yID0gZGVzaWduLnBhbGV0dGUgJiYgZGVzaWduLnBhbGV0dGUuY29sb3IgfHwgXCJibGFja1wiO1xuICAgICAgICAgICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgaWYgKGRlc2lnbi5wYWxldHRlICYmIGRlc2lnbi5wYWxldHRlLmludmVydCkge1xuICAgICAgICAgICAgICAgICAgICBbdGV4dENvbG9yLCBiYWNrZ3JvdW5kQ29sb3JdID0gW2JhY2tncm91bmRDb2xvciwgdGV4dENvbG9yXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBib3ggPSBuZXcgcGFwZXIuR3JvdXAoKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZVRleHRCbG9jayA9IChzOiBzdHJpbmcsIHNpemUgPSB0aGlzLmRlZmF1bHRGb250U2l6ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IGZvbnQuZ2V0UGF0aChzLCAwLCAwLCBzaXplKS50b1BhdGhEYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IGxheW91dEl0ZW1zID0gbGluZXMubWFwKGxpbmUgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2s6IGNyZWF0ZVRleHRCbG9jayhsaW5lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbWF4V2lkdGggPSBfLm1heChsYXlvdXRJdGVtcy5tYXAoYiA9PiBiLmJsb2NrLmJvdW5kcy53aWR0aCkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFycmFuZ2VQYXRoUG9pbnRzID0gTWF0aC5taW4oNCwgTWF0aC5yb3VuZChtYXhXaWR0aCAvIDIpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lSGVpZ2h0ID0gbGF5b3V0SXRlbXNbMF0uYmxvY2suYm91bmRzLmhlaWdodDtcblxuICAgICAgICAgICAgICAgIGxldCB1cHBlciA9IG5ldyBwYXBlci5QYXRoKFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQobWF4V2lkdGgsIDApXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgbGV0IGxvd2VyOiBwYXBlci5QYXRoO1xuICAgICAgICAgICAgICAgIGxldCByZW1haW5pbmcgPSBsYXlvdXRJdGVtcy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGxheW91dEl0ZW0gb2YgbGF5b3V0SXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKC0tcmVtYWluaW5nIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1pZCA9IHVwcGVyLmJvdW5kcy5jZW50ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsYXN0IGxvd2VyIGxpbmUgaXMgbGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VyID0gbmV3IHBhcGVyLlBhdGgoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLCBtaWQueSArIGxpbmVIZWlnaHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChtYXhXaWR0aCwgbWlkLnkgKyBsaW5lSGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dlciA9IHRoaXMucmFuZG9tTG93ZXJQYXRoRm9yKHVwcGVyLCBsaW5lSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmFuZ2VQYXRoUG9pbnRzLCBzZWVkUmFuZG9tKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHJldGNoID0gbmV3IEZvbnRTaGFwZS5WZXJ0aWNhbEJvdW5kc1N0cmV0Y2hQYXRoKFxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0SXRlbS5ibG9jayxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdXBwZXIsIGxvd2VyIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdHJldGNoLmZpbGxDb2xvciA9IHRleHRDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgYm94LmFkZENoaWxkKHN0cmV0Y2gpO1xuICAgICAgICAgICAgICAgICAgICB1cHBlciA9IGxvd2VyO1xuICAgICAgICAgICAgICAgICAgICBsb3dlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGRlc2lnbi5jb250ZW50LnNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2VCbG9jayA9IGNyZWF0ZVRleHRCbG9jayhkZXNpZ24uY29udGVudC5zb3VyY2UsIHRoaXMuZGVmYXVsdEZvbnRTaXplICogMC4zMyk7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2NrLmZpbGxDb2xvciA9IHRleHRDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlQmxvY2sudHJhbnNsYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXIuYm91bmRzLmJvdHRvbUxlZnQuYWRkKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGggLSBzb3VyY2VCbG9jay5ib3VuZHMud2lkdGgsIC8vIHJpZ2h0LWFsaWduXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2NrLmJvdW5kcy5oZWlnaHQgKiAxLjEgLy8gc2hpZnQgaGVpZ2h0IHBsdXMgdG9wIG1hcmdpblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHNvdXJjZUJsb2NrLmJvdW5kcy5sZWZ0IDwgMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGp1c3QgZm9yIGxvbmcgc291cmNlIGxpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2NrLmJvdW5kcy5sZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBib3guYWRkQ2hpbGQoc291cmNlQmxvY2spO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IGJveC5ib3VuZHMuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICBib3VuZHMuc2l6ZSA9IGJvdW5kcy5zaXplLm11bHRpcGx5KDEgKyB0aGlzLm1hcmdpbkZhY3Rvcik7XG4gICAgICAgICAgICAgICAgYm91bmRzLmNlbnRlciA9IGJveC5ib3VuZHMuY2VudGVyO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSBwYXBlci5TaGFwZS5SZWN0YW5nbGUoYm91bmRzKTtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLmZpbGxDb2xvciA9IGJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgICAgICAgICBib3guaW5zZXJ0Q2hpbGQoMCwgYmFja2dyb3VuZCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYm94O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHJhbmRvbUxvd2VyUGF0aEZvcihcbiAgICAgICAgICAgIHVwcGVyOiBwYXBlci5QYXRoLFxuICAgICAgICAgICAgYXZnSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgICAgICBudW1Qb2ludHMsXG4gICAgICAgICAgICBzZWVkUmFuZG9tOiBGcmFtZXdvcmsuU2VlZFJhbmRvbVxuICAgICAgICApOiBwYXBlci5QYXRoIHtcbiAgICAgICAgICAgIGNvbnN0IHBvaW50czogcGFwZXIuUG9pbnRbXSA9IFtdO1xuICAgICAgICAgICAgbGV0IHVwcGVyQ2VudGVyID0gdXBwZXIuYm91bmRzLmNlbnRlcjtcbiAgICAgICAgICAgIGxldCB4ID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUG9pbnRzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gdXBwZXJDZW50ZXIueSArIChzZWVkUmFuZG9tLnJhbmRvbSgpIC0gMC41KSAqIHRoaXMubGluZUhlaWdodFZhcmlhdGlvbiAqIGF2Z0hlaWdodDtcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChuZXcgcGFwZXIuUG9pbnQoeCwgeSkpO1xuICAgICAgICAgICAgICAgIHggKz0gdXBwZXIuYm91bmRzLndpZHRoIC8gKG51bVBvaW50cyAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IG5ldyBwYXBlci5QYXRoKHBvaW50cyk7XG4gICAgICAgICAgICBwYXRoLnNtb290aCgpO1xuICAgICAgICAgICAgcGF0aC5ib3VuZHMuY2VudGVyID0gdXBwZXIuYm91bmRzLmNlbnRlci5hZGQobmV3IHBhcGVyLlBvaW50KDAsIGF2Z0hlaWdodCkpO1xuICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGJhbGFuY2VMaW5lcyh3b3Jkczogc3RyaW5nW10sIHRhcmdldExlbmd0aDogbnVtYmVyKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGNhbGNTY29yZSA9ICh0ZXh0OiBzdHJpbmcpID0+XG4gICAgICAgICAgICAgICAgTWF0aC5wb3coTWF0aC5hYnModGFyZ2V0TGVuZ3RoIC0gdGV4dC5sZW5ndGgpLCAyKTtcblxuICAgICAgICAgICAgbGV0IGN1cnJlbnRMaW5lID0gbnVsbDtcbiAgICAgICAgICAgIGxldCBjdXJyZW50U2NvcmUgPSAxMDAwMDtcblxuICAgICAgICAgICAgd2hpbGUgKHdvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmQgPSB3b3Jkcy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xpbmUgPSBjdXJyZW50TGluZSArIFwiIFwiICsgd29yZDtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdTY29yZSA9IGNhbGNTY29yZShuZXdMaW5lKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudExpbmUgJiYgbmV3U2NvcmUgPD0gY3VycmVudFNjb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFwcGVuZFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TGluZSArPSBcIiBcIiArIHdvcmQ7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTY29yZSA9IG5ld1Njb3JlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5ldyBsaW5lXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaChjdXJyZW50TGluZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudExpbmUgPSB3b3JkO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NvcmUgPSBjYWxjU2NvcmUoY3VycmVudExpbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpbmVzLnB1c2goY3VycmVudExpbmUpO1xuICAgICAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVUZXh0RW50cnkoKTogQnVpbGRlckNvbnRyb2wge1xuICAgICAgICAgICAgY29uc3QgbWFpblRleHRJbnB1dCA9IG5ldyBUZXh0SW5wdXQoKTtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVRleHRJbnB1dCA9IG5ldyBUZXh0SW5wdXQoKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY3JlYXRlTm9kZTogKHZhbHVlOiBUZW1wbGF0ZVN0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImgzXCIsIHt9LCBbXCJNZXNzYWdlXCJdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluVGV4dElucHV0LmNyZWF0ZU5vZGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICYmIHZhbHVlLmRlc2lnbi5jb250ZW50ICYmIHZhbHVlLmRlc2lnbi5jb250ZW50LnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiV2hhdCBkbyB5b3Ugd2FudCB0byBzYXk/XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVRleHRJbnB1dC5jcmVhdGVOb2RlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSAmJiB2YWx1ZS5kZXNpZ24uY29udGVudCAmJiB2YWx1ZS5kZXNpZ24uY29udGVudC5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiU291cmNlIChhdXRob3IsIHBhc3NhZ2UsIGV0YylcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdmFsdWUkOiBSeC5PYnNlcnZhYmxlLm1lcmdlKFxuICAgICAgICAgICAgICAgICAgICBtYWluVGV4dElucHV0LnZhbHVlJC5tYXAodCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPFRlbXBsYXRlU3RhdGVDaGFuZ2U+eyBkZXNpZ246IHsgY29udGVudDogeyB0ZXh0OiB0IH0gfSB9KVxuICAgICAgICAgICAgICAgICAgICAsIHNvdXJjZVRleHRJbnB1dC52YWx1ZSQubWFwKHQgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPnsgZGVzaWduOiB7IGNvbnRlbnQ6IHsgc291cmNlOiB0IH0gfSB9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgY3JlYXRlU2hhcGVDaG9vc2VyKGNvbnRleHQ6IFRlbXBsYXRlVUlDb250ZXh0KTogQnVpbGRlckNvbnRyb2wge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8VGVtcGxhdGVTdGF0ZUNoYW5nZT4oKTtcbiAgICAgICAgICAgIHJldHVybiA8QnVpbGRlckNvbnRyb2w+e1xuICAgICAgICAgICAgICAgIGNyZWF0ZU5vZGU6ICh0czogVGVtcGxhdGVTdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGFwZXMgPSBbXCJuYXJyb3dcIl07XG4gICAgICAgICAgICAgICAgICAgIC8vIGJhbGFuY2VkIG9ubHkgYXZhaWxhYmxlIGZvciA+PSBOIHdvcmRzXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cy5kZXNpZ24uY29udGVudCAmJiB0cy5kZXNpZ24uY29udGVudC50ZXh0ICYmIHRzLmRlc2lnbi5jb250ZW50LnRleHQuc3BsaXQoL1xccy8pLmxlbmd0aCA+PSA3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFwZXMucHVzaChcImJhbGFuY2VkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNoYXBlcy5wdXNoKFwid2lkZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hvaWNlcyA9IHNoYXBlcy5tYXAoc2hhcGUgPT4gPENvbnRyb2xIZWxwZXJzLkNob2ljZT57XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwic3BhblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzaGFwZV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hvc2VuOiB0cy5kZXNpZ24uc2hhcGUgPT09IHNoYXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSQub25OZXh0KHsgZGVzaWduOiB7IHNoYXBlIH0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBoKFwiZGl2XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImgzXCIsIHt9LCBbXCJTaGFwZVwiXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29udHJvbEhlbHBlcnMuY2hvb3NlcihjaG9pY2VzKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2YWx1ZSQ6IHZhbHVlJC5hc09ic2VydmFibGUoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgY3JlYXRlVmFyaWF0aW9uQ29udHJvbCgpOiBCdWlsZGVyQ29udHJvbCB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSQgPSBuZXcgUnguU3ViamVjdDxUZW1wbGF0ZVN0YXRlQ2hhbmdlPigpO1xuICAgICAgICAgICAgcmV0dXJuIDxCdWlsZGVyQ29udHJvbD57XG4gICAgICAgICAgICAgICAgY3JlYXRlTm9kZTogKHRzOiBUZW1wbGF0ZVN0YXRlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gaChcImJ1dHRvbi5idG5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdmFsdWUkLm9uTmV4dCh7IGRlc2lnbjogeyBzZWVkOiBNYXRoLnJhbmRvbSgpIH0gfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiVHJ5IGFub3RoZXIgdmFyaWF0aW9uXCJdXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGgoXCJkaXZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaDNcIiwge30sIFtcIlZhcmlhdGlvblwiXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHZhbHVlJDogdmFsdWUkLmFzT2JzZXJ2YWJsZSgpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVQYWxldHRlQ2hvb3NlcigpOiBCdWlsZGVyQ29udHJvbCB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWRDb2xvcnMgPSB0aGlzLnBhbGV0dGVDb2xvcnMubWFwKGMgPT4gbmV3IHBhcGVyLkNvbG9yKDxhbnk+YykpO1xuICAgICAgICAgICAgY29uc3QgY29sb3JzID0gXy5zb3J0QnkocGFyc2VkQ29sb3JzLCBjID0+IGMuaHVlKVxuICAgICAgICAgICAgICAgIC5tYXAoYyA9PiBjLnRvQ1NTKHRydWUpKTtcblxuICAgICAgICAgICAgY29uc3QgdmFsdWUkID0gbmV3IFJ4LlN1YmplY3Q8VGVtcGxhdGVTdGF0ZUNoYW5nZT4oKTtcbiAgICAgICAgICAgIHJldHVybiA8QnVpbGRlckNvbnRyb2w+e1xuICAgICAgICAgICAgICAgIGNyZWF0ZU5vZGU6ICh0czogVGVtcGxhdGVTdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWxldHRlID0gdHMuZGVzaWduLnBhbGV0dGU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNob2ljZXMgPSBjb2xvcnMubWFwKGNvbG9yID0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29udHJvbEhlbHBlcnMuQ2hvaWNlPntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBoKFwiZGl2LnBhbGV0dGVUaWxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9zZW46IHBhbGV0dGUgJiYgcGFsZXR0ZS5jb2xvciA9PT0gY29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUkLm9uTmV4dCh7IGRlc2lnbjogeyBwYWxldHRlOiB7IGNvbG9yIH0gfSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnZlcnROb2RlID0gaChcImRpdlwiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwibGFiZWxcIiwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiBwYWxldHRlICYmIHBhbGV0dGUuaW52ZXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IGV2ID0+IHZhbHVlJC5vbk5leHQoeyBkZXNpZ246IHsgcGFsZXR0ZTogeyBpbnZlcnQ6IGV2LnRhcmdldC5jaGVja2VkIH0gfSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkludmVydCBjb2xvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gaChcImRpdi5jb2xvckNob29zZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaDNcIiwge30sIFtcIkNvbG9yXCJdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb250cm9sSGVscGVycy5jaG9vc2VyKGNob2ljZXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmVydE5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdmFsdWUkOiB2YWx1ZSQuYXNPYnNlcnZhYmxlKClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHBhbGV0dGVDb2xvcnMgPSBbXG4gICAgICAgICAgICBcIiM0YjM4MzJcIixcbiAgICAgICAgICAgIFwiIzg1NDQ0MlwiLFxuICAgICAgICAgICAgLy9cIiNmZmY0ZTZcIixcbiAgICAgICAgICAgIFwiIzNjMmYyZlwiLFxuICAgICAgICAgICAgXCIjYmU5YjdiXCIsXG5cbiAgICAgICAgICAgIFwiIzFiODViOFwiLFxuICAgICAgICAgICAgXCIjNWE1MjU1XCIsXG4gICAgICAgICAgICBcIiM1NTllODNcIixcbiAgICAgICAgICAgIFwiI2FlNWE0MVwiLFxuICAgICAgICAgICAgXCIjYzNjYjcxXCIsXG5cbiAgICAgICAgICAgIFwiIzBlMWE0MFwiLFxuICAgICAgICAgICAgXCIjMjIyZjViXCIsXG4gICAgICAgICAgICBcIiM1ZDVkNWRcIixcbiAgICAgICAgICAgIFwiIzk0NmIyZFwiLFxuICAgICAgICAgICAgXCIjMDAwMDAwXCIsXG5cbiAgICAgICAgICAgIFwiI2VkYzk1MVwiLFxuICAgICAgICAgICAgXCIjZWI2ODQxXCIsXG4gICAgICAgICAgICBcIiNjYzJhMzZcIixcbiAgICAgICAgICAgIFwiIzRmMzcyZFwiLFxuICAgICAgICAgICAgXCIjMDBhMGIwXCIsXG4gICAgICAgIF07XG5cbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcblxuICAgIGV4cG9ydCBjbGFzcyBEb2N1bWVudEtleUhhbmRsZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xuXG4gICAgICAgICAgICAvLyBub3RlOiB1bmRpc3Bvc2VkIGV2ZW50IHN1YnNjcmlwdGlvblxuICAgICAgICAgICAgJChkb2N1bWVudCkua2V5dXAoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gRG9tSGVscGVycy5LZXlDb2Rlcy5Fc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGNsYXNzIFNrZXRjaEVkaXRvck1vZHVsZSB7XG5cbiAgICAgICAgYXBwU3RvcmU6IEFwcC5TdG9yZTtcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xuICAgICAgICB3b3Jrc3BhY2VDb250cm9sbGVyOiBXb3Jrc3BhY2VDb250cm9sbGVyO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGFwcFN0b3JlOiBBcHAuU3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUgPSBhcHBTdG9yZTtcblxuICAgICAgICAgICAgRG9tSGVscGVycy5pbml0RXJyb3JIYW5kbGVyKGVycm9yRGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IEpTT04uc3RyaW5naWZ5KGVycm9yRGF0YSk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvY2xpZW50LWVycm9yc1wiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGNvbnRlbnRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoYXBwU3RvcmUpO1xuXG4gICAgICAgICAgICBjb25zdCBiYXIgPSBuZXcgRWRpdG9yQmFyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNpZ25lcicpLCB0aGlzLnN0b3JlKTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbUVkaXRvciA9IG5ldyBTZWxlY3RlZEl0ZW1FZGl0b3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0b3JPdmVybGF5XCIpLCB0aGlzLnN0b3JlKTtcbiAgICAgICAgICAgIGNvbnN0IGhlbHBEaWFsb2cgPSBuZXcgSGVscERpYWxvZyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlbHAtZGlhbG9nXCIpLCB0aGlzLnN0b3JlKTtcbiAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvblBhbmVsID0gbmV3IE9wZXJhdGlvblBhbmVsKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3BlcmF0aW9uUGFuZWxcIiksIHRoaXMuc3RvcmUpO1xuXG4gICAgICAgICAgICAvLyB0aGlzLnN0b3JlLmV2ZW50cy5zdWJzY3JpYmUobSA9PiBjb25zb2xlLmxvZyhcImV2ZW50XCIsIG0udHlwZSwgbS5kYXRhKSk7XG4gICAgICAgICAgICAvLyB0aGlzLnN0b3JlLmFjdGlvbnMuc3Vic2NyaWJlKG0gPT4gY29uc29sZS5sb2coXCJhY3Rpb25cIiwgbS50eXBlLCBtLmRhdGEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0KCkge1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmV2ZW50cy5lZGl0b3IuZm9udExvYWRlZC5vYnNlcnZlKCkuZmlyc3QoKS5zdWJzY3JpYmUobSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLndvcmtzcGFjZUNvbnRyb2xsZXIgPSBuZXcgV29ya3NwYWNlQ29udHJvbGxlcih0aGlzLnN0b3JlLCBtLmRhdGEpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci5pbml0V29ya3NwYWNlLmRpc3BhdGNoKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmV2ZW50cy5lZGl0b3Iud29ya3NwYWNlSW5pdGlhbGl6ZWQuc3ViKCgpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oXCJiZWZvcmV1bmxvYWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoSXNEaXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIllvdXIgbGF0ZXN0IGNoYW5nZXMgYXJlIG5vdCBzYXZlZCB5ZXQuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgb3BlblNrZXRjaChpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLm9wZW4uZGlzcGF0Y2goaWQpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cbiIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGNsYXNzIFNrZXRjaEhlbHBlcnMge1xuXG4gICAgICAgIHN0YXRpYyBjb2xvcnNJblVzZShza2V0Y2g6IFNrZXRjaCk6IHN0cmluZ1tdIHtcbiAgICAgICAgICAgIGxldCBjb2xvcnMgPSBbc2tldGNoLmJhY2tncm91bmRDb2xvcl07XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIHNrZXRjaC50ZXh0QmxvY2tzKSB7XG4gICAgICAgICAgICAgICAgY29sb3JzLnB1c2goYmxvY2suYmFja2dyb3VuZENvbG9yKTtcbiAgICAgICAgICAgICAgICBjb2xvcnMucHVzaChibG9jay50ZXh0Q29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sb3JzID0gXy51bmlxKGNvbG9ycy5maWx0ZXIoYyA9PiBjICE9IG51bGwpKTtcbiAgICAgICAgICAgIGNvbG9ycy5zb3J0KCk7XG4gICAgICAgICAgICByZXR1cm4gY29sb3JzO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzdGF0aWMgZ2V0U2tldGNoRmlsZU5hbWUoc2tldGNoOiBTa2V0Y2gsIGxlbmd0aDogbnVtYmVyLCBleHRlbnNpb24/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBcIlwiO1xuICAgICAgICAgICAgb3V0ZXI6XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIHNrZXRjaC50ZXh0QmxvY2tzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB3b3JkIG9mIGJsb2NrLnRleHQuc3BsaXQoL1xccy8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyaW0gPSB3b3JkLnJlcGxhY2UoL1xcVy9nLCAnJykudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHJpbS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lLmxlbmd0aCkgbmFtZSArPSBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgKz0gdHJpbTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGggPj0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhayBvdXRlcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbmFtZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gXCJmaWRkbGVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBleHRlbnNpb24gPyBuYW1lICsgXCIuXCIgKyBleHRlbnNpb24gOiBuYW1lO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJcbm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgLyoqXG4gICAgICogVGhlIHNpbmdsZXRvbiBTdG9yZSBjb250cm9scyBhbGwgYXBwbGljYXRpb24gc3RhdGUuXG4gICAgICogTm8gcGFydHMgb3V0c2lkZSBvZiB0aGUgU3RvcmUgbW9kaWZ5IGFwcGxpY2F0aW9uIHN0YXRlLlxuICAgICAqIENvbW11bmljYXRpb24gd2l0aCB0aGUgU3RvcmUgaXMgZG9uZSB0aHJvdWdoIG1lc3NhZ2UgQ2hhbm5lbHM6IFxuICAgICAqICAgLSBBY3Rpb25zIGNoYW5uZWwgdG8gc2VuZCBpbnRvIHRoZSBTdG9yZSxcbiAgICAgKiAgIC0gRXZlbnRzIGNoYW5uZWwgdG8gcmVjZWl2ZSBub3RpZmljYXRpb24gZnJvbSB0aGUgU3RvcmUuXG4gICAgICogT25seSB0aGUgU3RvcmUgY2FuIHJlY2VpdmUgYWN0aW9uIG1lc3NhZ2VzLlxuICAgICAqIE9ubHkgdGhlIFN0b3JlIGNhbiBzZW5kIGV2ZW50IG1lc3NhZ2VzLlxuICAgICAqIFRoZSBTdG9yZSBjYW5ub3Qgc2VuZCBhY3Rpb25zIG9yIGxpc3RlbiB0byBldmVudHMgKHRvIGF2b2lkIGxvb3BzKS5cbiAgICAgKiBNZXNzYWdlcyBhcmUgdG8gYmUgdHJlYXRlZCBhcyBpbW11dGFibGUuXG4gICAgICogQWxsIG1lbnRpb25zIG9mIHRoZSBTdG9yZSBjYW4gYmUgYXNzdW1lZCB0byBtZWFuLCBvZiBjb3Vyc2UsXG4gICAgICogICBcIlRoZSBTdG9yZSBhbmQgaXRzIHN1Yi1jb21wb25lbnRzLlwiXG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIFN0b3JlIHtcblxuICAgICAgICBzdGF0aWMgQlJPV1NFUl9JRF9LRVkgPSBcImJyb3dzZXJJZFwiO1xuICAgICAgICBzdGF0aWMgRkFMTEJBQ0tfRk9OVF9VUkwgPSBcIi9mb250cy9Sb2JvdG8tNTAwLnR0ZlwiO1xuICAgICAgICBzdGF0aWMgREVGQVVMVF9GT05UX05BTUUgPSBcIlJvYm90b1wiO1xuICAgICAgICBzdGF0aWMgU0tFVENIX0xPQ0FMX0NBQ0hFX0tFWSA9IFwiZmlkZGxlc3RpY2tzLmlvLmxhc3RTa2V0Y2hcIjtcbiAgICAgICAgc3RhdGljIExPQ0FMX0NBQ0hFX0RFTEFZX01TID0gMTAwMDtcbiAgICAgICAgc3RhdGljIFNFUlZFUl9TQVZFX0RFTEFZX01TID0gMTAwMDA7XG4gICAgICAgIHN0YXRpYyBHUkVFVElOR19TS0VUQ0hfSUQgPSBcImltMmJhOTJpMTcxNGlcIjtcblxuICAgICAgICBmb250TGlzdExpbWl0ID0gMjUwO1xuXG4gICAgICAgIHN0YXRlOiBFZGl0b3JTdGF0ZSA9IHt9O1xuICAgICAgICByZXNvdXJjZXM6IFN0b3JlUmVzb3VyY2VzID0ge307XG4gICAgICAgIGFjdGlvbnMgPSBuZXcgQWN0aW9ucygpO1xuICAgICAgICBldmVudHMgPSBuZXcgRXZlbnRzKCk7XG5cbiAgICAgICAgcHJpdmF0ZSBhcHBTdG9yZTogQXBwLlN0b3JlO1xuICAgICAgICBwcml2YXRlIF9vcGVyYXRpb24kID0gbmV3IFJ4LlN1YmplY3Q8T3BlcmF0aW9uPigpO1xuICAgICAgICBwcml2YXRlIF90cmFuc3BhcmVuY3kkID0gbmV3IFJ4LlN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihhcHBTdG9yZTogQXBwLlN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlID0gYXBwU3RvcmU7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0dXBTdGF0ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLnNldHVwU3Vic2NyaXB0aW9ucygpO1xuXG4gICAgICAgICAgICB0aGlzLmxvYWRSZXNvdXJjZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldHVwU3RhdGUoKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLmJyb3dzZXJJZCA9IENvb2tpZXMuZ2V0KFN0b3JlLkJST1dTRVJfSURfS0VZKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5icm93c2VySWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmJyb3dzZXJJZCA9IEZyYW1ld29yay5uZXdpZCgpO1xuICAgICAgICAgICAgICAgIENvb2tpZXMuc2V0KFN0b3JlLkJST1dTRVJfSURfS0VZLCB0aGlzLnN0YXRlLmJyb3dzZXJJZCwgeyBleHBpcmVzOiAyICogMzY1IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2V0dXBTdWJzY3JpcHRpb25zKCkge1xuICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuYWN0aW9ucywgZXZlbnRzID0gdGhpcy5ldmVudHM7XG5cbiAgICAgICAgICAgIC8vIC0tLS0tIEFwcCAtLS0tLVxuXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlLmV2ZW50cy5yb3V0ZUNoYW5nZWQuc3ViKHJvdXRlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByb3V0ZVNrZXRjaElkID0gcm91dGUucGFyYW1zLnNrZXRjaElkO1xuICAgICAgICAgICAgICAgIGlmIChyb3V0ZS5uYW1lID09PSBcInNrZXRjaFwiICYmIHJvdXRlU2tldGNoSWQgIT09IHRoaXMuc3RhdGUuc2tldGNoLl9pZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5Ta2V0Y2gocm91dGVTa2V0Y2hJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIC0tLS0tIEVkaXRvciAtLS0tLVxuXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci5pbml0V29ya3NwYWNlLm9ic2VydmUoKVxuICAgICAgICAgICAgICAgIC5wYXVzYWJsZUJ1ZmZlcmVkKGV2ZW50cy5lZGl0b3IucmVzb3VyY2VzUmVhZHkub2JzZXJ2ZSgpLm1hcChtID0+IG0uZGF0YSkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2tldGNoSWQgPSB0aGlzLmFwcFN0b3JlLnN0YXRlLnJvdXRlLnBhcmFtcy5za2V0Y2hJZFxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgdGhpcy5hcHBTdG9yZS5zdGF0ZS5sYXN0U2F2ZWRTa2V0Y2hJZDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb21pc2U6IEpRdWVyeVByb21pc2U8YW55PjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNrZXRjaElkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlID0gdGhpcy5vcGVuU2tldGNoKHNrZXRjaElkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSB0aGlzLmxvYWRHcmVldGluZ1NrZXRjaCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbigoKSA9PiBldmVudHMuZWRpdG9yLndvcmtzcGFjZUluaXRpYWxpemVkLmRpc3BhdGNoKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIG9uIGFueSBhY3Rpb24sIHVwZGF0ZSBzYXZlIGRlbGF5IHRpbWVyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5vYnNlcnZlKCkuZGVib3VuY2UoU3RvcmUuU0VSVkVSX1NBVkVfREVMQVlfTVMpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBza2V0Y2ggPSB0aGlzLnN0YXRlLnNrZXRjaDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgc2tldGNoLl9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBza2V0Y2gudGV4dEJsb2Nrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlU2tldGNoKHNrZXRjaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmxvYWRGb250LnN1YnNjcmliZShtID0+XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KG0uZGF0YSkpO1xuXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci56b29tVG9GaXQuZm9yd2FyZChcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLnpvb21Ub0ZpdFJlcXVlc3RlZCk7XG5cbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmV4cG9ydFBORy5zdWJzY3JpYmUobSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLmV4cG9ydFBOR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZEdBRXhwb3J0KG0uZGF0YS5waXhlbHMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLmV4cG9ydFNWRy5zdWJzY3JpYmUobSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLmV4cG9ydFNWR1JlcXVlc3RlZC5kaXNwYXRjaChtLmRhdGEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLnZpZXdDaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLnZpZXdDaGFuZ2VkLmRpc3BhdGNoKG0uZGF0YSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3IudXBkYXRlU25hcHNob3Quc3ViKCh7c2tldGNoSWQsIHBuZ0RhdGFVcmx9KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNrZXRjaElkID09PSB0aGlzLnN0YXRlLnNrZXRjaC5faWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBza2V0Y2hJZCArIFwiLnBuZ1wiO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBibG9iID0gRG9tSGVscGVycy5kYXRhVVJMVG9CbG9iKHBuZ0RhdGFVcmwpO1xuICAgICAgICAgICAgICAgICAgICBTM0FjY2Vzcy5wdXRGaWxlKGZpbGVOYW1lLCBcImltYWdlL3BuZ1wiLCBibG9iKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3IudG9nZ2xlSGVscC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2hvd0hlbHAgPSAhdGhpcy5zdGF0ZS5zaG93SGVscDtcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLnNob3dIZWxwQ2hhbmdlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnNob3dIZWxwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci5vcGVuU2FtcGxlLnN1YigoKSA9PiB0aGlzLmxvYWRHcmVldGluZ1NrZXRjaCgpKTtcblxuICAgICAgICAgICAgLy8gLS0tLS0gU2tldGNoIC0tLS0tXG5cbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLm9wZW4uc3ViKGlkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5Ta2V0Y2goaWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLmNyZWF0ZS5zdWIoKGF0dHIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm5ld1NrZXRjaChhdHRyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5jbGVhci5zdWIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJTa2V0Y2goKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLmNsb25lLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xvbmUgPSBfLmNsb25lKHRoaXMuc3RhdGUuc2tldGNoKTtcbiAgICAgICAgICAgICAgICBjbG9uZS5faWQgPSBGcmFtZXdvcmsubmV3aWQoKTtcbiAgICAgICAgICAgICAgICBjbG9uZS5icm93c2VySWQgPSB0aGlzLnN0YXRlLmJyb3dzZXJJZDtcbiAgICAgICAgICAgICAgICBjbG9uZS5zYXZlZEF0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goY2xvbmUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5jbG9uZWQuZGlzcGF0Y2goY2xvbmUpO1xuICAgICAgICAgICAgICAgIHRoaXMucHVsc2VVc2VyTWVzc2FnZShcIkR1cGxpY2F0ZWQgc2tldGNoLiBBZGRyZXNzIG9mIHRoaXMgcGFnZSBoYXMgYmVlbiB1cGRhdGVkLlwiKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5hdHRyVXBkYXRlLnN1YnNjcmliZShldiA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXJnZSh0aGlzLnN0YXRlLnNrZXRjaCwgZXYuZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guYmFja2dyb3VuZENvbG9yID0gZXYuZGF0YS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICAgICAgICAgICAgZXZlbnRzLnNrZXRjaC5hdHRyQ2hhbmdlZC5kaXNwYXRjaChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2gpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uc3Vic2NyaWJlKG0gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKG0uZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShtLmRhdGEpO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgLy8gLS0tLS0gVGV4dEJsb2NrIC0tLS0tXG5cbiAgICAgICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLmFkZFxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRjaCA9IGV2LmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGF0Y2gudGV4dCB8fCAhcGF0Y2gudGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSB7IF9pZDogRnJhbWV3b3JrLm5ld2lkKCkgfSBhcyBUZXh0QmxvY2s7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVyZ2UoYmxvY2ssIHBhdGNoKTtcblxuICAgICAgICAgICAgICAgICAgICBibG9jay50ZXh0Q29sb3IgPSB0aGlzLnN0YXRlLnNrZXRjaC5kZWZhdWx0VGV4dEJsb2NrQXR0ci50ZXh0Q29sb3I7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmJhY2tncm91bmRDb2xvciA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLmJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFibG9jay5mb250RmFtaWx5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5mb250RmFtaWx5ID0gdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIuZm9udEZhbWlseTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLmZvbnRWYXJpYW50ID0gdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIuZm9udFZhcmlhbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmFkZGVkLmRpc3BhdGNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkU2tldGNoQ29udGVudCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRleHRCbG9ja0ZvbnQoYmxvY2spO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuZ2V0QmxvY2soZXYuZGF0YS5faWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXRjaCA9IDxUZXh0QmxvY2s+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGV2LmRhdGEudGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGV2LmRhdGEuYmFja2dyb3VuZENvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRDb2xvcjogZXYuZGF0YS50ZXh0Q29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogZXYuZGF0YS5mb250RmFtaWx5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRWYXJpYW50OiBldi5kYXRhLmZvbnRWYXJpYW50XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9udENoYW5nZWQgPSBwYXRjaC5mb250RmFtaWx5ICE9PSBibG9jay5mb250RmFtaWx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgcGF0Y2guZm9udFZhcmlhbnQgIT09IGJsb2NrLmZvbnRWYXJpYW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXJnZShibG9jaywgcGF0Y2gpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2suZm9udEZhbWlseSAmJiAhYmxvY2suZm9udFZhcmlhbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLnJlc291cmNlcy5mb250Q2F0YWxvZy5nZXRSZWNvcmQoYmxvY2suZm9udEZhbWlseSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWd1bGFyIG9yIGVsc2UgZmlyc3QgdmFyaWFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jay5mb250VmFyaWFudCA9IEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5kZWZhdWx0VmFyaWFudChyZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBibG9jay50ZXh0Q29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBibG9jay5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogYmxvY2suZm9udEZhbWlseSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogYmxvY2suZm9udFZhcmlhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQuZGlzcGF0Y2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkU2tldGNoQ29udGVudCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm9udENoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRUZXh0QmxvY2tGb250KGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5yZW1vdmVcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGV2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpZERlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBfLnJlbW92ZSh0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLCB0YiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGIuX2lkID09PSBldi5kYXRhLl9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZERlbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlkRGVsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLnJlbW92ZWQuZGlzcGF0Y2goeyBfaWQ6IGV2LmRhdGEuX2lkIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VkU2tldGNoQ29udGVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay51cGRhdGVBcnJhbmdlXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShldiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuZ2V0QmxvY2soZXYuZGF0YS5faWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLnBvc2l0aW9uID0gZXYuZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLm91dGxpbmUgPSBldi5kYXRhLm91dGxpbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMudGV4dGJsb2NrLmFycmFuZ2VDaGFuZ2VkLmRpc3BhdGNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IG9wZXJhdGlvbiQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3BlcmF0aW9uJC5hc09ic2VydmFibGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB0cmFuc3BhcmVuY3kkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zcGFyZW5jeSQuYXNPYnNlcnZhYmxlKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBzaG93T3BlcmF0aW9uKG9wZXJhdGlvbjogT3BlcmF0aW9uKXtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUub3BlcmF0aW9uID0gb3BlcmF0aW9uO1xuICAgICAgICAgICAgb3BlcmF0aW9uLm9uQ2xvc2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5zdGF0ZS5vcGVyYXRpb24gPT09IG9wZXJhdGlvbil7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZU9wZXJhdGlvbigpOyBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9vcGVyYXRpb24kLm9uTmV4dChvcGVyYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBwdWJsaWMgaGlkZU9wZXJhdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUub3BlcmF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX29wZXJhdGlvbiQub25OZXh0KG51bGwpOyAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaW1hZ2VVcGxvYWRlZChzcmM6IHN0cmluZyl7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnVwbG9hZGVkSW1hZ2UgPSBzcmM7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guaW1hZ2VVcGxvYWRlZC5kaXNwYXRjaChzcmMpO1xuICAgICAgICAgICAgaWYoIXRoaXMuc3RhdGUudHJhbnNwYXJlbmN5KXtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRyYW5zcGFyZW5jeSh0cnVlKTtcbiAgICAgICAgICAgIH0gIFxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlbW92ZVVwbG9hZGVkSW1hZ2UoKXtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudXBsb2FkZWRJbWFnZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guaW1hZ2VVcGxvYWRlZC5kaXNwYXRjaChudWxsKTtcbiAgICAgICAgICAgIGlmKHRoaXMuc3RhdGUudHJhbnNwYXJlbmN5KXtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRyYW5zcGFyZW5jeShmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0VHJhbnNwYXJlbmN5KHZhbHVlPzogYm9vbGVhbikge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS50cmFuc3BhcmVuY3kgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zcGFyZW5jeSQub25OZXh0KHRoaXMuc3RhdGUudHJhbnNwYXJlbmN5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgb3BlblNrZXRjaChpZDogc3RyaW5nKTogSlF1ZXJ5UHJvbWlzZTxTa2V0Y2g+IHtcbiAgICAgICAgICAgIGlmICghaWQgfHwgIWlkLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTM0FjY2Vzcy5nZXRKc29uKGlkICsgXCIuanNvblwiKVxuICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgIChza2V0Y2g6IFNrZXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goc2tldGNoKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJldHJpZXZlZCBza2V0Y2hcIiwgc2tldGNoLl9pZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChza2V0Y2guYnJvd3NlcklkID09PSB0aGlzLnN0YXRlLmJyb3dzZXJJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NrZXRjaCB3YXMgY3JlYXRlZCBpbiB0aGlzIGJyb3dzZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTa2V0Y2ggd2FzIGNyZWF0ZWQgaW4gYSBkaWZmZXJlbnQgYnJvd3NlcicpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNrZXRjaDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImVycm9yIGdldHRpbmcgcmVtb3RlIHNrZXRjaFwiLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRHcmVldGluZ1NrZXRjaCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBsb2FkU2tldGNoKHNrZXRjaDogU2tldGNoKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLmxvYWRpbmdTa2V0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2ggPSBza2V0Y2g7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc2V0RGVmYXVsdFVzZXJNZXNzYWdlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5sb2FkZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpO1xuICAgICAgICAgICAgdGhpcy5hcHBTdG9yZS5hY3Rpb25zLmVkaXRvckxvYWRlZFNrZXRjaC5kaXNwYXRjaChza2V0Y2guX2lkKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdGIgb2YgdGhpcy5zdGF0ZS5za2V0Y2gudGV4dEJsb2Nrcykge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5sb2FkZWQuZGlzcGF0Y2godGIpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZFRleHRCbG9ja0ZvbnQodGIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5lZGl0b3Iuem9vbVRvRml0UmVxdWVzdGVkLmRpc3BhdGNoKCk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBsb2FkR3JlZXRpbmdTa2V0Y2goKTogSlF1ZXJ5UHJvbWlzZTxhbnk+IHtcbiAgICAgICAgICAgIHJldHVybiBTM0FjY2Vzcy5nZXRKc29uKFN0b3JlLkdSRUVUSU5HX1NLRVRDSF9JRCArIFwiLmpzb25cIilcbiAgICAgICAgICAgICAgICAuZG9uZSgoc2tldGNoOiBTa2V0Y2gpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2tldGNoLl9pZCA9IEZyYW1ld29yay5uZXdpZCgpO1xuICAgICAgICAgICAgICAgICAgICBza2V0Y2guYnJvd3NlcklkID0gdGhpcy5zdGF0ZS5icm93c2VySWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBjbGVhclNrZXRjaCgpIHtcbiAgICAgICAgICAgIGNvbnN0IHNrZXRjaCA9IDxTa2V0Y2g+dGhpcy5kZWZhdWx0U2tldGNoQXR0cigpO1xuICAgICAgICAgICAgc2tldGNoLl9pZCA9IHRoaXMuc3RhdGUuc2tldGNoLl9pZDtcbiAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBsb2FkUmVzb3VyY2VzKCkge1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMgPSBuZXcgRm9udFNoYXBlLlBhcnNlZEZvbnRzKHBhcnNlZCA9PlxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVkaXRvci5mb250TG9hZGVkLmRpc3BhdGNoKHBhcnNlZC5mb250KSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgRm9udFNoYXBlLkZvbnRDYXRhbG9nLmZyb21Mb2NhbChcImZvbnRzL2dvb2dsZS1mb250cy5qc29uXCIpXG4gICAgICAgICAgICAgICAgLnRoZW4oY2F0YWxvZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZvbnRDYXRhbG9nID0gY2F0YWxvZztcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvYWQgZm9udHMgaW50byBicm93c2VyIGZvciBwcmV2aWV3XG4gICAgICAgICAgICAgICAgICAgIEZvbnRTaGFwZS5Gb250Q2F0YWxvZy5sb2FkUHJldmlld1N1YnNldHMoXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRhbG9nLmdldExpc3QodGhpcy5mb250TGlzdExpbWl0KS5tYXAoZiA9PiBmLmZhbWlseSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLnBhcnNlZEZvbnRzLmdldChTdG9yZS5GQUxMQkFDS19GT05UX1VSTCkudGhlbigoe2ZvbnR9KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMuZmFsbGJhY2tGb250ID0gZm9udCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnJlc291cmNlc1JlYWR5LmRpc3BhdGNoKHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzZXRVc2VyTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnVzZXJNZXNzYWdlICE9PSBtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS51c2VyTWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnVzZXJNZXNzYWdlQ2hhbmdlZC5kaXNwYXRjaChtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgcHVsc2VVc2VyTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlck1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0RGVmYXVsdFVzZXJNZXNzYWdlKCksIDQwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzZXREZWZhdWx0VXNlck1lc3NhZ2UoKSB7XG4gICAgICAgICAgICAvLyBpZiBub3QgdGhlIGxhc3Qgc2F2ZWQgc2tldGNoLCBvciBza2V0Y2ggaXMgZGlydHksIHNob3cgXCJVbnNhdmVkXCJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAodGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5XG4gICAgICAgICAgICAgICAgfHwgIXRoaXMuc3RhdGUuc2tldGNoLnNhdmVkQXQpXG4gICAgICAgICAgICAgICAgPyBcIlVuc2F2ZWRcIlxuICAgICAgICAgICAgICAgIDogXCJTYXZlZFwiO1xuICAgICAgICAgICAgdGhpcy5zZXRVc2VyTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgbG9hZFRleHRCbG9ja0ZvbnQoYmxvY2s6IFRleHRCbG9jaykge1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KFxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZvbnRDYXRhbG9nLmdldFVybChibG9jay5mb250RmFtaWx5LCBibG9jay5mb250VmFyaWFudCkpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHtmb250fSkgPT5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmZvbnRSZWFkeS5kaXNwYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dEJsb2NrSWQ6IGJsb2NrLl9pZCwgZm9udCB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGNoYW5nZWRTa2V0Y2hDb250ZW50KCkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5jb250ZW50Q2hhbmdlZC5kaXNwYXRjaCh0aGlzLnN0YXRlLnNrZXRjaCk7XG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBtZXJnZTxUPihkZXN0OiBULCBzb3VyY2U6IFQpIHtcbiAgICAgICAgICAgIF8ubWVyZ2UoZGVzdCwgc291cmNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgbmV3U2tldGNoKGF0dHI/OiBTa2V0Y2hBdHRyKTogU2tldGNoIHtcbiAgICAgICAgICAgIGNvbnN0IHNrZXRjaCA9IDxTa2V0Y2g+dGhpcy5kZWZhdWx0U2tldGNoQXR0cigpO1xuICAgICAgICAgICAgc2tldGNoLl9pZCA9IEZyYW1ld29yay5uZXdpZCgpO1xuICAgICAgICAgICAgaWYgKGF0dHIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1lcmdlKHNrZXRjaCwgYXR0cik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goc2tldGNoKTtcbiAgICAgICAgICAgIHJldHVybiBza2V0Y2g7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGRlZmF1bHRTa2V0Y2hBdHRyKCkge1xuICAgICAgICAgICAgcmV0dXJuIDxTa2V0Y2hBdHRyPntcbiAgICAgICAgICAgICAgICBicm93c2VySWQ6IHRoaXMuc3RhdGUuYnJvd3NlcklkLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRUZXh0QmxvY2tBdHRyOiB7XG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwiUm9ib3RvXCIsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRWYXJpYW50OiBcInJlZ3VsYXJcIixcbiAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBcImdyYXlcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIndoaXRlXCIsXG4gICAgICAgICAgICAgICAgdGV4dEJsb2NrczogPFRleHRCbG9ja1tdPltdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzYXZlU2tldGNoKHNrZXRjaDogU2tldGNoKSB7XG4gICAgICAgICAgICBjb25zdCBzYXZpbmcgPSBfLmNsb25lKHNrZXRjaCk7XG4gICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgc2F2aW5nLnNhdmVkQXQgPSBub3c7XG4gICAgICAgICAgICB0aGlzLnNldFVzZXJNZXNzYWdlKFwiU2F2aW5nXCIpO1xuICAgICAgICAgICAgUzNBY2Nlc3MucHV0RmlsZShza2V0Y2guX2lkICsgXCIuanNvblwiLFxuICAgICAgICAgICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiLCBKU09OLnN0cmluZ2lmeShzYXZpbmcpKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoLnNhdmVkQXQgPSBub3c7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGVmYXVsdFVzZXJNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUuYWN0aW9ucy5lZGl0b3JTYXZlZFNrZXRjaC5kaXNwYXRjaChza2V0Y2guX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnNuYXBzaG90RXhwaXJlZC5kaXNwYXRjaChza2V0Y2gpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFVzZXJNZXNzYWdlKFwiVW5hYmxlIHRvIHNhdmVcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHNldFNlbGVjdGlvbihpdGVtOiBXb3Jrc3BhY2VPYmplY3RSZWYsIGZvcmNlOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKCFmb3JjZSkge1xuICAgICAgICAgICAgICAgIC8vIGVhcmx5IGV4aXQgb24gbm8gY2hhbmdlXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLnN0YXRlLnNlbGVjdGlvbi5pdGVtSWQgPT09IGl0ZW0uaXRlbUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0aW9uID0gaXRlbTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLmRpc3BhdGNoKGl0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzZXRFZGl0aW5nSXRlbShpdGVtOiBQb3NpdGlvbmVkT2JqZWN0UmVmLCBmb3JjZT86IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIGlmICghZm9yY2UpIHtcbiAgICAgICAgICAgICAgICAvLyBlYXJseSBleGl0IG9uIG5vIGNoYW5nZVxuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLnN0YXRlLmVkaXRpbmdJdGVtLml0ZW1JZCA9PT0gaXRlbS5pdGVtSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSkge1xuICAgICAgICAgICAgICAgIC8vIHNpZ25hbCBjbG9zaW5nIGVkaXRvciBmb3IgaXRlbVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0uaXRlbVR5cGUgPT09IFwiVGV4dEJsb2NrXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEVkaXRpbmdCbG9jayA9IHRoaXMuZ2V0QmxvY2sodGhpcy5zdGF0ZS5lZGl0aW5nSXRlbS5pdGVtSWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEVkaXRpbmdCbG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmVkaXRvckNsb3NlZC5kaXNwYXRjaChjdXJyZW50RWRpdGluZ0Jsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAvLyBlZGl0aW5nIGl0ZW0gc2hvdWxkIGJlIHNlbGVjdGVkIGl0ZW1cbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihpdGVtKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSA9IGl0ZW07XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkLmRpc3BhdGNoKGl0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBnZXRCbG9jayhpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsIHRiID0+IHRiLl9pZCA9PT0gaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzZW5kR0FFeHBvcnQodmFsdWU6IG51bWJlcil7XG4gICAgICAgICAgICBsZXQgbGFiZWwgPSBTa2V0Y2hIZWxwZXJzLmdldFNrZXRjaEZpbGVOYW1lKHRoaXMuc3RhdGUuc2tldGNoLCAzMCk7XG4gICAgICAgICAgICBnYUV2ZW50KHtcbiAgICAgICAgICAgICAgICBldmVudENhdGVnb3J5OiBcIkRlc2lnblwiLFxuICAgICAgICAgICAgICAgIGV2ZW50QWN0aW9uOiBcImV4cG9ydC1pbWFnZVwiLFxuICAgICAgICAgICAgICAgIGV2ZW50TGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgICAgIGV2ZW50VmFsdWU6IHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsImludGVyZmFjZSBXaW5kb3cge1xuICAgIHdlYmtpdFVSTDogVVJMO1xufVxuXG5uYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcblxuICAgIGV4cG9ydCBjbGFzcyBXb3Jrc3BhY2VDb250cm9sbGVyIHtcblxuICAgICAgICBzdGF0aWMgVEVYVF9DSEFOR0VfUkVOREVSX1RIUk9UVExFX01TID0gNTAwO1xuICAgICAgICBzdGF0aWMgQkxPQ0tfQk9VTkRTX0NIQU5HRV9USFJPVFRMRV9NUyA9IDUwMDtcblxuICAgICAgICBkZWZhdWx0U2l6ZSA9IG5ldyBwYXBlci5TaXplKDUwMDAwLCA0MDAwMCk7XG4gICAgICAgIGRlZmF1bHRTY2FsZSA9IDAuMDI7XG5cbiAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICAgICAgcHJvamVjdDogcGFwZXIuUHJvamVjdDtcbiAgICAgICAgZmFsbGJhY2tGb250OiBvcGVudHlwZS5Gb250O1xuICAgICAgICB2aWV3Wm9vbTogcGFwZXJFeHQuVmlld1pvb207XG5cbiAgICAgICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU7XG4gICAgICAgIHByaXZhdGUgX3NrZXRjaDogU2tldGNoO1xuICAgICAgICBwcml2YXRlIF90ZXh0QmxvY2tJdGVtczogeyBbdGV4dEJsb2NrSWQ6IHN0cmluZ106IFRleHRXYXJwIH0gPSB7fTtcbiAgICAgICAgcHJpdmF0ZSBfd29ya3NwYWNlOiBwYXBlci5JdGVtO1xuICAgICAgICBwcml2YXRlIF9iYWNrZ3JvdW5kSW1hZ2U6IHBhcGVyLlJhc3RlcjtcbiAgICAgICAgcHJpdmF0ZSBfbWFyazogRnN0eC5GcmFtZXdvcmsuV2F0ZXJtYXJrO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSwgZmFsbGJhY2tGb250OiBvcGVudHlwZS5Gb250KSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgICAgICAgICB0aGlzLmZhbGxiYWNrRm9udCA9IGZhbGxiYWNrRm9udDtcbiAgICAgICAgICAgIHBhcGVyLnNldHRpbmdzLmhhbmRsZVNpemUgPSAxO1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbkNhbnZhcycpO1xuICAgICAgICAgICAgcGFwZXIuc2V0dXAodGhpcy5jYW52YXMpO1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0ID0gcGFwZXIucHJvamVjdDtcbiAgICAgICAgICAgIHdpbmRvdy5vbnJlc2l6ZSA9ICgpID0+IHRoaXMucHJvamVjdC52aWV3LmRyYXcoKTtcblxuICAgICAgICAgICAgY29uc3QgY2FudmFzU2VsID0gJCh0aGlzLmNhbnZhcyk7XG4gICAgICAgICAgICBzdG9yZS5ldmVudHMubWVyZ2VUeXBlZChcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZCxcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkXG4gICAgICAgICAgICApLnN1YnNjcmliZShldiA9PiB7XG4gICAgICAgICAgICAgICAgY2FudmFzU2VsLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgZXYuZGF0YS5iYWNrZ3JvdW5kQ29sb3IgfHwgXCJcIik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy52aWV3Wm9vbSA9IG5ldyBwYXBlckV4dC5WaWV3Wm9vbSh0aGlzLnByb2plY3QsICgpID0+IFt0aGlzLl9iYWNrZ3JvdW5kSW1hZ2VdKTtcbiAgICAgICAgICAgIHRoaXMudmlld1pvb20uc2V0Wm9vbVJhbmdlKFtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTaXplLm11bHRpcGx5KHRoaXMuZGVmYXVsdFNjYWxlICogMC4xKSxcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTaXplLm11bHRpcGx5KDAuNSldKTtcbiAgICAgICAgICAgIHRoaXMudmlld1pvb20udmlld0NoYW5nZWQuc3Vic2NyaWJlKGJvdW5kcyA9PiB7XG4gICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5lZGl0b3Iudmlld0NoYW5nZWQuZGlzcGF0Y2goYm91bmRzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBjbGVhclNlbGVjdGlvbiA9IChldjogcGFwZXIuUGFwZXJNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN0b3JlLnN0YXRlLnNlbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2gobnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFwZXIudmlldy5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGV2ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvamVjdC5oaXRUZXN0KGV2LnBvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbihldik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwYXBlci52aWV3Lm9uKHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdTdGFydCwgY2xlYXJTZWxlY3Rpb24pO1xuXG4gICAgICAgICAgICBjb25zdCBrZXlIYW5kbGVyID0gbmV3IERvY3VtZW50S2V5SGFuZGxlcihzdG9yZSk7XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmsgPSBuZXcgRnN0eC5GcmFtZXdvcmsuV2F0ZXJtYXJrKHRoaXMucHJvamVjdCwgXCJpbWcvc3BpcmFsLWxvZ28uc3ZnXCIpO1xuXG4gICAgICAgICAgICAvLyAtLS0tLSBEZXNpZ25lciAtLS0tLVxuXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLndvcmtzcGFjZUluaXRpYWxpemVkLnN1YigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LnZpZXcuZHJhdygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5lZGl0b3Iuem9vbVRvRml0UmVxdWVzdGVkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy56b29tVG9GaXQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLmV4cG9ydFNWR1JlcXVlc3RlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZG93bmxvYWRTVkcoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLmV4cG9ydFBOR1JlcXVlc3RlZC5zdWIob3B0aW9ucyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kb3dubG9hZFBORyhvcHRpb25zKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLnNuYXBzaG90RXhwaXJlZC5zdWIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0U25hcHNob3RQTkcoNzIpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmFjdGlvbnMuZWRpdG9yLnVwZGF0ZVNuYXBzaG90LmRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNrZXRjaElkOiB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaC5faWQsIHBuZ0RhdGFVcmw6IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gLS0tLS0gU2tldGNoIC0tLS0tXG5cbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICBldiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NrZXRjaCA9IGV2LmRhdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0LmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl93b3Jrc3BhY2UgPSBuZXcgcGFwZXIuR3JvdXAoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGV4dEJsb2NrSXRlbXMgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLnNlbGVjdGlvbkNoYW5nZWQuc3Vic2NyaWJlKG0gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xuICAgICAgICAgICAgICAgIGlmIChtLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gbS5kYXRhLml0ZW1JZCAmJiB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuaXRlbUlkXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrICYmICFibG9jay5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2suc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIC0tLS0tIFRleHRCbG9jayAtLS0tLVxuXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMubWVyZ2VUeXBlZChcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmFkZGVkLFxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2subG9hZGVkXG4gICAgICAgICAgICApLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICBldiA9PiB0aGlzLmFkZEJsb2NrKGV2LmRhdGEpKTtcblxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5hdHRyQ2hhbmdlZFxuICAgICAgICAgICAgICAgIC5vYnNlcnZlKClcbiAgICAgICAgICAgICAgICAudGhyb3R0bGUoV29ya3NwYWNlQ29udHJvbGxlci5URVhUX0NIQU5HRV9SRU5ERVJfVEhST1RUTEVfTVMpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHRCbG9jayA9IG0uZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udGV4dCA9IHRleHRCbG9jay50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jdXN0b21TdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IHRleHRCbG9jay50ZXh0Q29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5mb250UmVhZHkuc3ViKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1tkYXRhLnRleHRCbG9ja0lkXTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmZvbnQgPSBkYXRhLmZvbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5zdWJzY3JpYmUobSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suZWRpdG9yQ2xvc2VkLnN1YnNjcmliZShtID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udXBkYXRlVGV4dFBhdGgoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5pbWFnZVVwbG9hZGVkLnN1Yih1cmwgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QmFja2dyb3VuZEltYWdlKHVybCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3RvcmUudHJhbnNwYXJlbmN5JC5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dvcmtzcGFjZS5vcGFjaXR5ID0gdmFsdWUgPyAwLjc1IDogMTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHpvb21Ub0ZpdCgpIHtcbiAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0Vmlld2FibGVCb3VuZHMoKTtcbiAgICAgICAgICAgIGlmIChib3VuZHMud2lkdGggPiAwICYmIGJvdW5kcy5oZWlnaHQgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Wm9vbS56b29tVG8oYm91bmRzLnNjYWxlKDEuMikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBnZXRWaWV3YWJsZUJvdW5kcygpOiBwYXBlci5SZWN0YW5nbGUge1xuICAgICAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5fd29ya3NwYWNlLmJvdW5kcztcbiAgICAgICAgICAgIGlmICghYm91bmRzIHx8IGJvdW5kcy53aWR0aCA9PT0gMCB8fCBib3VuZHMuaGVpZ2h0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5SZWN0YW5nbGUoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2l6ZS5tdWx0aXBseSgwLjA1KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYm91bmRzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm5zIGRhdGEgVVJMXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGdldFNuYXBzaG90UE5HKGRwaTogbnVtYmVyKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KGNhbGxiYWNrID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFzdGVyID0gdGhpcy5wcm9qZWN0LmFjdGl2ZUxheWVyLnJhc3Rlcml6ZShkcGksIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHJhc3Rlci50b0RhdGFVUkwoKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2guYmFja2dyb3VuZENvbG9yKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHRoaXMuaW5zZXJ0QmFja2dyb3VuZCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBkb3dubG9hZFBORyhvcHRpb25zOiBJbWFnZUV4cG9ydE9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGRwaSA9IFBhcGVySGVscGVycy5nZXRFeHBvcnREcGkodGhpcy5fd29ya3NwYWNlLmJvdW5kcy5zaXplLCBcbiAgICAgICAgICAgICAgICBvcHRpb25zLnBpeGVscyB8fCA2MDAgKiA2MDApO1xuICAgICAgICAgICAgdGhpcy5nZXRTbmFwc2hvdFBORyhkcGkpLnRoZW4oZGF0YSA9PiB7O1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gU2tldGNoSGVscGVycy5nZXRTa2V0Y2hGaWxlTmFtZShcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gsIDQwLCBcInBuZ1wiKTtcbiAgICAgICAgICAgICAgICBjb25zdCBibG9iID0gRG9tSGVscGVycy5kYXRhVVJMVG9CbG9iKGRhdGEpO1xuICAgICAgICAgICAgICAgIHNhdmVBcyhibG9iLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZG93bmxvYWRTVkcoKSB7XG4gICAgICAgICAgICBjb25zdCBjb21wbGV0ZURvd25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVXJsID0gXCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCxcIiArIGVuY29kZVVSSUNvbXBvbmVudChcbiAgICAgICAgICAgICAgICAgICAgPHN0cmluZz50aGlzLnByb2plY3QuZXhwb3J0U1ZHKHsgYXNTdHJpbmc6IHRydWUgfSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBEb21IZWxwZXJzLmRhdGFVUkxUb0Jsb2IoZGF0YVVybCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBTa2V0Y2hIZWxwZXJzLmdldFNrZXRjaEZpbGVOYW1lKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCwgNDAsIFwic3ZnXCIpO1xuICAgICAgICAgICAgICAgIHNhdmVBcyhibG9iLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2guYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHRoaXMuaW5zZXJ0QmFja2dyb3VuZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgY29tcGxldGVEb3dubG9hZCgpO1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlRG93bmxvYWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnNlcnQgc2tldGNoIGJhY2tncm91bmQgdG8gcHJvdmlkZSBiYWNrZ3JvdW5kIGZpbGwgKGlmIG5lY2Vzc2FyeSlcbiAgICAgICAgICogICBhbmQgYWRkIG1hcmdpbiBhcm91bmQgZWRnZXMuXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGluc2VydEJhY2tncm91bmQod2F0ZXJtYXJrOiBib29sZWFuKTogcGFwZXIuSXRlbSB7XG4gICAgICAgICAgICBjb25zdCBza2V0Y2hCb3VuZHMgPSB0aGlzLmdldFZpZXdhYmxlQm91bmRzKCk7XG4gICAgICAgICAgICBjb25zdCBtYXJnaW4gPSBNYXRoLm1heChza2V0Y2hCb3VuZHMud2lkdGgsIHNrZXRjaEJvdW5kcy5oZWlnaHQpICogMC4wMjtcbiAgICAgICAgICAgIGNvbnN0IGltYWdlQm91bmRzID0gbmV3IHBhcGVyLlJlY3RhbmdsZShcbiAgICAgICAgICAgICAgICBza2V0Y2hCb3VuZHMudG9wTGVmdC5zdWJ0cmFjdChtYXJnaW4pLFxuICAgICAgICAgICAgICAgIHNrZXRjaEJvdW5kcy5ib3R0b21SaWdodC5hZGQobWFyZ2luKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGZpbGwgPSBwYXBlci5TaGFwZS5SZWN0YW5nbGUoaW1hZ2VCb3VuZHMpO1xuICAgICAgICAgICAgZmlsbC5maWxsQ29sb3IgPSB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaC5iYWNrZ3JvdW5kQ29sb3I7XG5cbiAgICAgICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSBuZXcgcGFwZXIuR3JvdXAoW2ZpbGxdKTtcblxuICAgICAgICAgICAgaWYod2F0ZXJtYXJrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFyay5wbGFjZUludG8oYmFja2dyb3VuZCwgPHBhcGVyLkNvbG9yPjxhbnk+ZmlsbC5maWxsQ29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX3dvcmtzcGFjZS5pbnNlcnRDaGlsZCgwLCBiYWNrZ3JvdW5kKTtcbiAgICAgICAgICAgIHJldHVybiBiYWNrZ3JvdW5kO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBhZGRCbG9jayh0ZXh0QmxvY2s6IFRleHRCbG9jaykge1xuICAgICAgICAgICAgaWYgKCF0ZXh0QmxvY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGV4dEJsb2NrLl9pZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3JlY2VpdmVkIGJsb2NrIHdpdGhvdXQgaWQnLCB0ZXh0QmxvY2spO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW3RleHRCbG9jay5faWRdO1xuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUmVjZWl2ZWQgYWRkQmxvY2sgZm9yIGJsb2NrIHRoYXQgaXMgYWxyZWFkeSBsb2FkZWRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYm91bmRzOiB7IHVwcGVyOiBwYXBlci5TZWdtZW50W10sIGxvd2VyOiBwYXBlci5TZWdtZW50W10gfTtcblxuICAgICAgICAgICAgaWYgKHRleHRCbG9jay5vdXRsaW5lKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9hZFNlZ21lbnQgPSAocmVjb3JkOiBTZWdtZW50UmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gcmVjb3JkWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9pbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludChyZWNvcmRbMF0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZFsxXSAmJiBuZXcgcGFwZXIuUG9pbnQocmVjb3JkWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRbMl0gJiYgbmV3IHBhcGVyLlBvaW50KHJlY29yZFsyXSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlNlZ21lbnQobmV3IHBhcGVyLlBvaW50KHJlY29yZCkpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYm91bmRzID0ge1xuICAgICAgICAgICAgICAgICAgICB1cHBlcjogdGV4dEJsb2NrLm91dGxpbmUudG9wLnNlZ21lbnRzLm1hcChsb2FkU2VnbWVudCksXG4gICAgICAgICAgICAgICAgICAgIGxvd2VyOiB0ZXh0QmxvY2sub3V0bGluZS5ib3R0b20uc2VnbWVudHMubWFwKGxvYWRTZWdtZW50KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGl0ZW0gPSBuZXcgVGV4dFdhcnAoXG4gICAgICAgICAgICAgICAgdGhpcy5mYWxsYmFja0ZvbnQsXG4gICAgICAgICAgICAgICAgdGV4dEJsb2NrLnRleHQsXG4gICAgICAgICAgICAgICAgYm91bmRzLFxuICAgICAgICAgICAgICAgIG51bGwsIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yIHx8IFwicmVkXCIsICAgIC8vIHRleHRDb2xvciBzaG91bGQgaGF2ZSBiZWVuIHNldCBlbHNld2hlcmUgXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl93b3Jrc3BhY2UuYWRkQ2hpbGQoaXRlbSk7XG5cbiAgICAgICAgICAgIHBhcGVyRXh0LmV4dGVuZE1vdXNlRXZlbnRzKGl0ZW0pO1xuXG4gICAgICAgICAgICBpZiAoIXRleHRCbG9jay5vdXRsaW5lICYmIHRleHRCbG9jay5wb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIGl0ZW0ucG9zaXRpb24gPSBuZXcgcGFwZXIuUG9pbnQodGV4dEJsb2NrLnBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaXRlbS5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGV2ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBzZWxlY3QgbmV4dCBpdGVtIGJlaGluZFxuICAgICAgICAgICAgICAgICAgICBsZXQgb3RoZXJIaXRzID0gKDxUZXh0V2FycFtdPl8udmFsdWVzKHRoaXMuX3RleHRCbG9ja0l0ZW1zKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoaSA9PiBpLmlkICE9PSBpdGVtLmlkICYmICEhaS5oaXRUZXN0KGV2LnBvaW50KSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG90aGVySXRlbSA9IF8uc29ydEJ5KG90aGVySGl0cywgaSA9PiBpLmluZGV4KVswXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVySXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJJdGVtLmJyaW5nVG9Gcm9udCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJJZCA9IF8uZmluZEtleSh0aGlzLl90ZXh0QmxvY2tJdGVtcywgaSA9PiBpID09PSBvdGhlckl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVySWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IG90aGVySWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5icmluZ1RvRnJvbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGl0ZW1JZDogdGV4dEJsb2NrLl9pZCwgaXRlbVR5cGU6IFwiVGV4dEJsb2NrXCIgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaXRlbS5vbihwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2ID0+IHtcbiAgICAgICAgICAgICAgICBpdGVtLmJyaW5nVG9Gcm9udCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0ZW0ub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlRHJhZywgZXYgPT4ge1xuICAgICAgICAgICAgICAgIGl0ZW0udHJhbnNsYXRlKGV2LmRlbHRhKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdGVtLm9uKHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdFbmQsIGV2ID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSA8VGV4dEJsb2NrPnRoaXMuZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtKTtcbiAgICAgICAgICAgICAgICBibG9jay5faWQgPSB0ZXh0QmxvY2suX2lkO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXJyYW5nZS5kaXNwYXRjaChibG9jayk7XG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IHRleHRCbG9jay5faWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBpdGVtQ2hhbmdlJCA9IFBhcGVyTm90aWZ5Lm9ic2VydmUoaXRlbSwgUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5HRU9NRVRSWSk7XG4gICAgICAgICAgICBpdGVtQ2hhbmdlJFxuICAgICAgICAgICAgICAgIC5kZWJvdW5jZShXb3Jrc3BhY2VDb250cm9sbGVyLkJMT0NLX0JPVU5EU19DSEFOR0VfVEhST1RUTEVfTVMpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IDxUZXh0QmxvY2s+dGhpcy5nZXRCbG9ja0FycmFuZ2VtZW50KGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICBibG9jay5faWQgPSB0ZXh0QmxvY2suX2lkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2UuZGlzcGF0Y2goYmxvY2spO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpdGVtLmRhdGEgPSB0ZXh0QmxvY2suX2lkO1xuICAgICAgICAgICAgaWYgKCF0ZXh0QmxvY2sucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICBpdGVtLnBvc2l0aW9uID0gdGhpcy5wcm9qZWN0LnZpZXcuYm91bmRzLnBvaW50LmFkZChcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGl0ZW0uYm91bmRzLndpZHRoIC8gMiwgaXRlbS5ib3VuZHMuaGVpZ2h0IC8gMilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoNTApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3RleHRCbG9ja0l0ZW1zW3RleHRCbG9jay5faWRdID0gaXRlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtOiBUZXh0V2FycCk6IEJsb2NrQXJyYW5nZW1lbnQge1xuICAgICAgICAgICAgLy8gZXhwb3J0IHJldHVybnMgYW4gYXJyYXkgd2l0aCBpdGVtIHR5cGUgYW5kIHNlcmlhbGl6ZWQgb2JqZWN0OlxuICAgICAgICAgICAgLy8gICBbXCJQYXRoXCIsIFBhdGhSZWNvcmRdXG4gICAgICAgICAgICBjb25zdCB0b3AgPSA8UGF0aFJlY29yZD5pdGVtLnVwcGVyLmV4cG9ydEpTT04oeyBhc1N0cmluZzogZmFsc2UgfSlbMV07XG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSA8UGF0aFJlY29yZD5pdGVtLmxvd2VyLmV4cG9ydEpTT04oeyBhc1N0cmluZzogZmFsc2UgfSlbMV07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IFtpdGVtLnBvc2l0aW9uLngsIGl0ZW0ucG9zaXRpb24ueV0sXG4gICAgICAgICAgICAgICAgb3V0bGluZTogeyB0b3AsIGJvdHRvbSB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHNldEJhY2tncm91bmRJbWFnZSh1cmw6IHN0cmluZykge1xuICAgICAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmRJbWFnZS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZEltYWdlID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmFzdGVyID0gbmV3IHBhcGVyLlJhc3Rlcih1cmwpO1xuICAgICAgICAgICAgKDxhbnk+cmFzdGVyKS5vbkxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmFzdGVyLnNlbmRUb0JhY2soKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmRJbWFnZS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZEltYWdlID0gcmFzdGVyO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGNsYXNzIEFjdGlvbnMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XG5cbiAgICAgICAgZWRpdG9yID0ge1xuICAgICAgICAgICAgaW5pdFdvcmtzcGFjZTogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmluaXRXb3Jrc3BhY2VcIiksXG4gICAgICAgICAgICBsb2FkRm9udDogdGhpcy50b3BpYzxzdHJpbmc+KFwiZGVzaWduZXIubG9hZEZvbnRcIiksXG4gICAgICAgICAgICB6b29tVG9GaXQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci56b29tVG9GaXRcIiksXG4gICAgICAgICAgICBleHBvcnRpbmdJbWFnZTogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydEltYWdlXCIpLFxuICAgICAgICAgICAgZXhwb3J0UE5HOiB0aGlzLnRvcGljPEltYWdlRXhwb3J0T3B0aW9ucz4oXCJkZXNpZ25lci5leHBvcnRQTkdcIiksXG4gICAgICAgICAgICBleHBvcnRTVkc6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRTVkdcIiksXG4gICAgICAgICAgICB2aWV3Q2hhbmdlZDogdGhpcy50b3BpYzxwYXBlci5SZWN0YW5nbGU+KFwiZGVzaWduZXIudmlld0NoYW5nZWRcIiksXG4gICAgICAgICAgICB1cGRhdGVTbmFwc2hvdDogdGhpcy50b3BpYzx7IHNrZXRjaElkOiBzdHJpbmcsIHBuZ0RhdGFVcmw6IHN0cmluZyB9PihcImRlc2lnbmVyLnVwZGF0ZVNuYXBzaG90XCIpLFxuICAgICAgICAgICAgdG9nZ2xlSGVscDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLnRvZ2dsZUhlbHBcIiksXG4gICAgICAgICAgICBvcGVuU2FtcGxlOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIub3BlblNhbXBsZVwiKSxcbiAgICAgICAgfVxuXG4gICAgICAgIHNrZXRjaCA9IHtcbiAgICAgICAgICAgIGNyZWF0ZTogdGhpcy50b3BpYzxTa2V0Y2hBdHRyPihcInNrZXRjaC5jcmVhdGVcIiksXG4gICAgICAgICAgICBjbGVhcjogdGhpcy50b3BpYzx2b2lkPihcInNrZXRjaC5jbGVhclwiKSxcbiAgICAgICAgICAgIGNsb25lOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmNsb25lXCIpLFxuICAgICAgICAgICAgb3BlbjogdGhpcy50b3BpYzxzdHJpbmc+KFwic2tldGNoLm9wZW5cIiksXG4gICAgICAgICAgICBhdHRyVXBkYXRlOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmF0dHJVcGRhdGVcIiksXG4gICAgICAgICAgICBzZXRTZWxlY3Rpb246IHRoaXMudG9waWM8V29ya3NwYWNlT2JqZWN0UmVmPihcInNrZXRjaC5zZXRTZWxlY3Rpb25cIiksXG4gICAgICAgIH07XG5cbiAgICAgICAgdGV4dEJsb2NrID0ge1xuICAgICAgICAgICAgYWRkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0QmxvY2suYWRkXCIpLFxuICAgICAgICAgICAgdXBkYXRlQXR0cjogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dEJsb2NrLnVwZGF0ZUF0dHJcIiksXG4gICAgICAgICAgICB1cGRhdGVBcnJhbmdlOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0QmxvY2sudXBkYXRlQXJyYW5nZVwiKSxcbiAgICAgICAgICAgIHJlbW92ZTogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dEJsb2NrLnJlbW92ZVwiKVxuICAgICAgICB9O1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50cyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcblxuICAgICAgICBlZGl0b3IgPSB7XG4gICAgICAgICAgICByZXNvdXJjZXNSZWFkeTogdGhpcy50b3BpYzxib29sZWFuPihcImFwcC5yZXNvdXJjZXNSZWFkeVwiKSxcbiAgICAgICAgICAgIHdvcmtzcGFjZUluaXRpYWxpemVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiYXBwLndvcmtzcGFjZUluaXRpYWxpemVkXCIpLFxuICAgICAgICAgICAgZm9udExvYWRlZDogdGhpcy50b3BpYzxvcGVudHlwZS5Gb250PihcImFwcC5mb250TG9hZGVkXCIpLFxuICAgICAgICAgICAgem9vbVRvRml0UmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuem9vbVRvRml0UmVxdWVzdGVkXCIpLFxuICAgICAgICAgICAgZXhwb3J0UE5HUmVxdWVzdGVkOiB0aGlzLnRvcGljPEltYWdlRXhwb3J0T3B0aW9ucz4oXCJkZXNpZ25lci5leHBvcnRQTkdSZXF1ZXN0ZWRcIiksXG4gICAgICAgICAgICBleHBvcnRTVkdSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRTVkdSZXF1ZXN0ZWRcIiksXG4gICAgICAgICAgICB2aWV3Q2hhbmdlZDogdGhpcy50b3BpYzxwYXBlci5SZWN0YW5nbGU+KFwiZGVzaWduZXIudmlld0NoYW5nZWRcIiksXG4gICAgICAgICAgICBzbmFwc2hvdEV4cGlyZWQ6IHRoaXMudG9waWM8U2tldGNoPihcImRlc2lnbmVyLnNuYXBzaG90RXhwaXJlZFwiKSxcbiAgICAgICAgICAgIHVzZXJNZXNzYWdlQ2hhbmdlZDogdGhpcy50b3BpYzxzdHJpbmc+KFwiZGVzaWduZXIudXNlck1lc3NhZ2VDaGFuZ2VkXCIpLFxuICAgICAgICAgICAgc2hvd0hlbHBDaGFuZ2VkOiB0aGlzLnRvcGljPGJvb2xlYW4+KFwiZGVzaWduZXIuc2hvd0hlbHBDaGFuZ2VkXCIpXG4gICAgICAgIH07XG5cbiAgICAgICAgc2tldGNoID0ge1xuICAgICAgICAgICAgbG9hZGVkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2gubG9hZGVkXCIpLFxuICAgICAgICAgICAgYXR0ckNoYW5nZWQ6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5hdHRyQ2hhbmdlZFwiKSxcbiAgICAgICAgICAgIGNvbnRlbnRDaGFuZ2VkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2guY29udGVudENoYW5nZWRcIiksXG4gICAgICAgICAgICBlZGl0aW5nSXRlbUNoYW5nZWQ6IHRoaXMudG9waWM8UG9zaXRpb25lZE9iamVjdFJlZj4oXCJza2V0Y2guZWRpdGluZ0l0ZW1DaGFuZ2VkXCIpLFxuICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogdGhpcy50b3BpYzxXb3Jrc3BhY2VPYmplY3RSZWY+KFwic2tldGNoLnNlbGVjdGlvbkNoYW5nZWRcIiksXG4gICAgICAgICAgICBzYXZlTG9jYWxSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJza2V0Y2guc2F2ZWxvY2FsLnNhdmVMb2NhbFJlcXVlc3RlZFwiKSxcbiAgICAgICAgICAgIGNsb25lZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwic2tldGNoLmNsb25lZFwiKSxcbiAgICAgICAgICAgIGltYWdlVXBsb2FkZWQ6IHRoaXMudG9waWM8c3RyaW5nPihcInNrZXRjaC5pbWFnZVVwbG9hZGVkXCIpLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRleHRibG9jayA9IHtcbiAgICAgICAgICAgIGFkZGVkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYWRkZWRcIiksXG4gICAgICAgICAgICBhdHRyQ2hhbmdlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmF0dHJDaGFuZ2VkXCIpLFxuICAgICAgICAgICAgZm9udFJlYWR5OiB0aGlzLnRvcGljPHsgdGV4dEJsb2NrSWQ6IHN0cmluZywgZm9udDogb3BlbnR5cGUuRm9udCB9PihcInRleHRibG9jay5mb250UmVhZHlcIiksXG4gICAgICAgICAgICBhcnJhbmdlQ2hhbmdlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmFycmFuZ2VDaGFuZ2VkXCIpLFxuICAgICAgICAgICAgcmVtb3ZlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLnJlbW92ZWRcIiksXG4gICAgICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5sb2FkZWRcIiksXG4gICAgICAgICAgICBlZGl0b3JDbG9zZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5lZGl0b3JDbG9zZWRcIiksXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbHMge1xuICAgICAgICBhY3Rpb25zOiBBY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcbiAgICAgICAgZXZlbnRzOiBFdmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgICB0eXBlIEFjdGlvblR5cGVzID1cbiAgICAgICAgXCJza2V0Y2guY3JlYXRlXCJcbiAgICAgICAgfCBcInNrZXRjaC51cGRhdGVcIlxuICAgICAgICB8IFwidGV4dGJsb2NrLmFkZFwiXG4gICAgICAgIHwgXCJ0ZXh0YmxvY2sudXBkYXRlXCI7XG5cbiAgICB0eXBlIEV2ZW50VHlwZXMgPVxuICAgICAgICBcInNrZXRjaC5sb2FkZWRcIlxuICAgICAgICB8IFwic2tldGNoLmNoYW5nZWRcIlxuICAgICAgICB8IFwidGV4dGJsb2NrLmFkZGVkXCJcbiAgICAgICAgfCBcInRleHRibG9jay5jaGFuZ2VkXCI7XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVkNvbnRyb2wge1xuICAgICAgICByZW5kZXIoKTogVk5vZGU7XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBpbnRlcmZhY2UgT3BlcmF0aW9uIGV4dGVuZHMgVkNvbnRyb2wge1xuICAgICAgICBvbkNsb3NlOiAoKSA9PiB2b2lkOyBcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEVkaXRvclN0YXRlIHtcbiAgICAgICAgYnJvd3NlcklkPzogc3RyaW5nO1xuICAgICAgICBlZGl0aW5nSXRlbT86IFBvc2l0aW9uZWRPYmplY3RSZWY7XG4gICAgICAgIHNlbGVjdGlvbj86IFdvcmtzcGFjZU9iamVjdFJlZjtcbiAgICAgICAgbG9hZGluZ1NrZXRjaD86IGJvb2xlYW47XG4gICAgICAgIHVzZXJNZXNzYWdlPzogc3RyaW5nO1xuICAgICAgICBza2V0Y2g/OiBTa2V0Y2g7XG4gICAgICAgIHNob3dIZWxwPzogYm9vbGVhbjtcbiAgICAgICAgc2tldGNoSXNEaXJ0eT86IGJvb2xlYW47XG4gICAgICAgIG9wZXJhdGlvbj86IE9wZXJhdGlvbjtcbiAgICAgICAgdHJhbnNwYXJlbmN5PzogYm9vbGVhbjtcbiAgICAgICAgdXBsb2FkZWRJbWFnZT86IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFN0b3JlUmVzb3VyY2VzIHtcbiAgICAgICAgZmFsbGJhY2tGb250Pzogb3BlbnR5cGUuRm9udFxuICAgICAgICBmb250Q2F0YWxvZz86IEZvbnRTaGFwZS5Gb250Q2F0YWxvZ1xuICAgICAgICBwYXJzZWRGb250cz86IEZvbnRTaGFwZS5QYXJzZWRGb250c1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2tldGNoIGV4dGVuZHMgU2tldGNoQXR0ciB7XG4gICAgICAgIF9pZDogc3RyaW5nO1xuICAgICAgICBicm93c2VySWQ/OiBzdHJpbmc7XG4gICAgICAgIHNhdmVkQXQ/OiBEYXRlO1xuICAgICAgICB0ZXh0QmxvY2tzPzogVGV4dEJsb2NrW107XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBTa2V0Y2hBdHRyIHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xuICAgICAgICBkZWZhdWx0VGV4dEJsb2NrQXR0cj86IFRleHRCbG9jaztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEZvbnREZXNjcmlwdGlvbiB7XG4gICAgICAgIGZhbWlseTogc3RyaW5nO1xuICAgICAgICBjYXRlZ29yeTogc3RyaW5nO1xuICAgICAgICB2YXJpYW50OiBzdHJpbmc7XG4gICAgICAgIHVybDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgV29ya3NwYWNlT2JqZWN0UmVmIHtcbiAgICAgICAgaXRlbUlkOiBzdHJpbmc7XG4gICAgICAgIGl0ZW1UeXBlPzogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUG9zaXRpb25lZE9iamVjdFJlZiBleHRlbmRzIFdvcmtzcGFjZU9iamVjdFJlZiB7XG4gICAgICAgIGNsaWVudFg/OiBudW1iZXI7XG4gICAgICAgIGNsaWVudFk/OiBudW1iZXI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZXh0QmxvY2sgZXh0ZW5kcyBCbG9ja0FycmFuZ2VtZW50IHtcbiAgICAgICAgX2lkPzogc3RyaW5nO1xuICAgICAgICB0ZXh0Pzogc3RyaW5nO1xuICAgICAgICB0ZXh0Q29sb3I/OiBzdHJpbmc7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgICAgICAgZm9udEZhbWlseT86IHN0cmluZztcbiAgICAgICAgZm9udFZhcmlhbnQ/OiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBCbG9ja0FycmFuZ2VtZW50IHtcbiAgICAgICAgcG9zaXRpb24/OiBudW1iZXJbXSxcbiAgICAgICAgb3V0bGluZT86IHtcbiAgICAgICAgICAgIHRvcDogUGF0aFJlY29yZCxcbiAgICAgICAgICAgIGJvdHRvbTogUGF0aFJlY29yZFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBCYWNrZ3JvdW5kQWN0aW9uU3RhdHVzIHtcbiAgICAgICAgYWN0aW9uPzogT2JqZWN0O1xuICAgICAgICByZWplY3RlZD86IGJvb2xlYW47XG4gICAgICAgIGVycm9yPzogYm9vbGVhblxuICAgICAgICBtZXNzYWdlPzogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUGF0aFJlY29yZCB7XG4gICAgICAgIHNlZ21lbnRzOiBTZWdtZW50UmVjb3JkW107XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbWFnZUV4cG9ydE9wdGlvbnMge1xuICAgICAgICBwaXhlbHM/OiBudW1iZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2luZ2xlLXBvaW50IHNlZ21lbnRzIGFyZSBzdG9yZWQgYXMgbnVtYmVyWzJdXG4gICAgICovXG4gICAgZXhwb3J0IHR5cGUgU2VnbWVudFJlY29yZCA9IEFycmF5PFBvaW50UmVjb3JkPiB8IEFycmF5PG51bWJlcj47XG5cbiAgICBleHBvcnQgdHlwZSBQb2ludFJlY29yZCA9IEFycmF5PG51bWJlcj47XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcblxuICAgIGV4cG9ydCBjbGFzcyBVcGxvYWRJbWFnZSBpbXBsZW1lbnRzIE9wZXJhdGlvbiB7XG5cbiAgICAgICAgc3RvcmU6IFN0b3JlO1xuICAgICAgICBvbkNsb3NlOiAoKSA9PiB2b2lkO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyKCk6IFZOb2RlIHtcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBoKFwiaDNcIiwgW1wiVXBsb2FkIGltYWdlXCJdKSxcbiAgICAgICAgICAgICAgICAgICAgaChcImlucHV0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJmaWxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZXYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZXYudGFyZ2V0KS5maWxlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkKGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHVwbG9hZChmaWxlKSB7XG4gICAgICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICB2YXIgdXJsID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMO1xuICAgICAgICAgICAgdmFyIHNyYyA9ICg8YW55PnVybCkuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5pbWFnZVVwbG9hZGVkKHNyYyk7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2UgJiYgdGhpcy5vbkNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCIgICAgXG5uYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcbiAgICBcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Rm9udERlc2NyaXB0aW9uKGZhbWlseTogRm9udFNoYXBlLkZhbWlseVJlY29yZCwgdmFyaWFudD86IHN0cmluZylcbiAgICAgICAgOiBGb250RGVzY3JpcHRpb24ge1xuICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XG4gICAgICAgIHVybCA9IGZhbWlseS5maWxlc1t2YXJpYW50IHx8IFwicmVndWxhclwiXTtcbiAgICAgICAgaWYoIXVybCl7XG4gICAgICAgICAgICB1cmwgPSBmYW1pbHkuZmlsZXNbMF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZhbWlseTogZmFtaWx5LmZhbWlseSxcbiAgICAgICAgICAgIGNhdGVnb3J5OiBmYW1pbHkuY2F0ZWdvcnksXG4gICAgICAgICAgICB2YXJpYW50OiB2YXJpYW50LFxuICAgICAgICAgICAgdXJsXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgICBleHBvcnQgY2xhc3MgUzNBY2Nlc3Mge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGxvYWQgZmlsZSB0byBhcHBsaWNhdGlvbiBTMyBidWNrZXQuXG4gICAgICAgICAqIFJldHVybnMgdXBsb2FkIFVSTCBhcyBhIHByb21pc2UuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgcHV0RmlsZShmaWxlTmFtZTogc3RyaW5nLCBmaWxlVHlwZTogc3RyaW5nLCBkYXRhOiBCbG9iIHwgc3RyaW5nKVxuICAgICAgICAgICAgOiBKUXVlcnlQcm9taXNlPHN0cmluZz4ge1xuXG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMvaXNzdWVzLzE5MCAgIFxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0ZpcmVmb3gvKSAmJiAhZmlsZVR5cGUubWF0Y2goLzsvKSkge1xuICAgICAgICAgICAgICAgIHZhciBjaGFyc2V0ID0gJzsgY2hhcnNldD1VVEYtOCc7XG4gICAgICAgICAgICAgICAgZmlsZVR5cGUgKz0gY2hhcnNldDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc2lnblVybCA9IGAvYXBpL3N0b3JhZ2UvYWNjZXNzP2ZpbGVOYW1lPSR7ZmlsZU5hbWV9JmZpbGVUeXBlPSR7ZmlsZVR5cGV9YDtcbiAgICAgICAgICAgIC8vIGdldCBzaWduZWQgVVJMXG4gICAgICAgICAgICByZXR1cm4gJC5nZXRKU09OKHNpZ25VcmwpXG4gICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgc2lnblJlc3BvbnNlID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBQVVQgZmlsZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdXRSZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBzaWduUmVzcG9uc2Uuc2lnbmVkUmVxdWVzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIngtYW16LWFjbFwiOiBcInB1YmxpYy1yZWFkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZpbGVUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmFqYXgocHV0UmVxdWVzdClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgcHV0UmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBsb2FkZWQgZmlsZVwiLCBzaWduUmVzcG9uc2UudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2lnblJlc3BvbnNlLnVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciB1cGxvYWRpbmcgdG8gUzNcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIG9uIC9hcGkvc3RvcmFnZS9hY2Nlc3NcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEb3dubG9hZCBmaWxlIGZyb20gYnVja2V0XG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgZ2V0SnNvbihmaWxlTmFtZTogc3RyaW5nKTogSlF1ZXJ5UHJvbWlzZTxPYmplY3Q+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZpbGVVcmwoZmlsZU5hbWUpXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvd25sb2FkaW5nXCIsIHJlc3BvbnNlLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiByZXNwb25zZS51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0RmlsZVVybChmaWxlTmFtZTogc3RyaW5nKTogSlF1ZXJ5UHJvbWlzZTx7IHVybDogc3RyaW5nIH0+IHtcbiAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogYC9hcGkvc3RvcmFnZS91cmw/ZmlsZU5hbWU9JHtmaWxlTmFtZX1gLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcblxuICAgIGV4cG9ydCBjbGFzcyBDb2xvclBpY2tlciB7XG5cbiAgICAgICAgc3RhdGljIERFRkFVTFRfUEFMRVRURV9HUk9VUFMgPSBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvODA3XG4gICAgICAgICAgICAgICAgXCIjZWU0MDM1XCIsXG4gICAgICAgICAgICAgICAgXCIjZjM3NzM2XCIsXG4gICAgICAgICAgICAgICAgXCIjZmRmNDk4XCIsXG4gICAgICAgICAgICAgICAgXCIjN2JjMDQzXCIsXG4gICAgICAgICAgICAgICAgXCIjMDM5MmNmXCIsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzg5NFxuICAgICAgICAgICAgICAgIFwiI2VkYzk1MVwiLFxuICAgICAgICAgICAgICAgIFwiI2ViNjg0MVwiLFxuICAgICAgICAgICAgICAgIFwiI2NjMmEzNlwiLFxuICAgICAgICAgICAgICAgIFwiIzRmMzcyZFwiLFxuICAgICAgICAgICAgICAgIFwiIzAwYTBiMFwiLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS8xNjRcbiAgICAgICAgICAgICAgICBcIiMxYjg1YjhcIixcbiAgICAgICAgICAgICAgICBcIiM1YTUyNTVcIixcbiAgICAgICAgICAgICAgICBcIiM1NTllODNcIixcbiAgICAgICAgICAgICAgICBcIiNhZTVhNDFcIixcbiAgICAgICAgICAgICAgICBcIiNjM2NiNzFcIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvMzg5XG4gICAgICAgICAgICAgICAgXCIjNGIzODMyXCIsXG4gICAgICAgICAgICAgICAgXCIjODU0NDQyXCIsXG4gICAgICAgICAgICAgICAgXCIjZmZmNGU2XCIsXG4gICAgICAgICAgICAgICAgXCIjM2MyZjJmXCIsXG4gICAgICAgICAgICAgICAgXCIjYmU5YjdiXCIsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzQ1NVxuICAgICAgICAgICAgICAgIFwiI2ZmNGU1MFwiLFxuICAgICAgICAgICAgICAgIFwiI2ZjOTEzYVwiLFxuICAgICAgICAgICAgICAgIFwiI2Y5ZDYyZVwiLFxuICAgICAgICAgICAgICAgIFwiI2VhZTM3NFwiLFxuICAgICAgICAgICAgICAgIFwiI2UyZjRjN1wiLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS83MDBcbiAgICAgICAgICAgICAgICBcIiNkMTExNDFcIixcbiAgICAgICAgICAgICAgICBcIiMwMGIxNTlcIixcbiAgICAgICAgICAgICAgICBcIiMwMGFlZGJcIixcbiAgICAgICAgICAgICAgICBcIiNmMzc3MzVcIixcbiAgICAgICAgICAgICAgICBcIiNmZmM0MjVcIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvODI2XG4gICAgICAgICAgICAgICAgXCIjZThkMTc0XCIsXG4gICAgICAgICAgICAgICAgXCIjZTM5ZTU0XCIsXG4gICAgICAgICAgICAgICAgXCIjZDY0ZDRkXCIsXG4gICAgICAgICAgICAgICAgXCIjNGQ3MzU4XCIsXG4gICAgICAgICAgICAgICAgXCIjOWVkNjcwXCIsXG4gICAgICAgICAgICBdLFxuICAgICAgICBdO1xuXG4gICAgICAgIHN0YXRpYyBNT05PX1BBTEVUVEUgPSBbXCIjMDAwXCIsIFwiIzQ0NFwiLCBcIiM2NjZcIiwgXCIjOTk5XCIsIFwiI2NjY1wiLCBcIiNlZWVcIiwgXCIjZjNmM2YzXCIsIFwiI2ZmZlwiXTtcblxuICAgICAgICBzdGF0aWMgc2V0dXAoZWxlbSwgZmVhdHVyZWRDb2xvcnM6IHN0cmluZ1tdLCBvbkNoYW5nZSkge1xuICAgICAgICAgICAgY29uc3QgZmVhdHVyZWRHcm91cHMgPSBfLmNodW5rKGZlYXR1cmVkQ29sb3JzLCA1KTtcblxuICAgICAgICAgICAgLy8gZm9yIGVhY2ggcGFsZXR0ZSBncm91cFxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFBhbGV0dGVHcm91cHMgPSBDb2xvclBpY2tlci5ERUZBVUxUX1BBTEVUVEVfR1JPVVBTLm1hcChncm91cCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBhcnNlZEdyb3VwID0gZ3JvdXAubWFwKGMgPT4gbmV3IHBhcGVyLkNvbG9yKDxhbnk+YykpO1xuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBsaWdodCB2YXJpYW50cyBvZiBkYXJrZXN0IHRocmVlXG4gICAgICAgICAgICAgICAgY29uc3QgYWRkQ29sb3JzID0gXy5zb3J0QnkocGFyc2VkR3JvdXAsIGMgPT4gYy5saWdodG5lc3MpXG4gICAgICAgICAgICAgICAgICAgIC5zbGljZSgwLCAzKVxuICAgICAgICAgICAgICAgICAgICAubWFwKGMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYzIgPSBjLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjMi5saWdodG5lc3MgPSAwLjg1O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBwYXJzZWRHcm91cCA9IHBhcnNlZEdyb3VwLmNvbmNhdChhZGRDb2xvcnMpO1xuICAgICAgICAgICAgICAgIHBhcnNlZEdyb3VwID0gXy5zb3J0QnkocGFyc2VkR3JvdXAsIGMgPT4gYy5saWdodG5lc3MpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWRHcm91cC5tYXAoYyA9PiBjLnRvQ1NTKHRydWUpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBwYWxldHRlID0gZmVhdHVyZWRHcm91cHMuY29uY2F0KGRlZmF1bHRQYWxldHRlR3JvdXBzKTtcbiAgICAgICAgICAgIHBhbGV0dGUucHVzaChDb2xvclBpY2tlci5NT05PX1BBTEVUVEUpO1xuXG4gICAgICAgICAgICBsZXQgc2VsID0gPGFueT4kKGVsZW0pO1xuICAgICAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oe1xuICAgICAgICAgICAgICAgIHNob3dJbnB1dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhbGxvd0VtcHR5OiB0cnVlLFxuICAgICAgICAgICAgICAgIHByZWZlcnJlZEZvcm1hdDogXCJoZXhcIixcbiAgICAgICAgICAgICAgICBzaG93QnV0dG9uczogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2hvd0FscGhhOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNob3dQYWxldHRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNob3dTZWxlY3Rpb25QYWxldHRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwYWxldHRlOiBwYWxldHRlLFxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZUtleTogXCJza2V0Y2h0ZXh0XCIsXG4gICAgICAgICAgICAgICAgY2hhbmdlOiBvbkNoYW5nZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgc3RhdGljIHNldChlbGVtOiBIVE1MRWxlbWVudCwgdmFsdWU6IHN0cmluZykge1xuICAgICAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oXCJzZXRcIiwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGRlc3Ryb3koZWxlbSkge1xuICAgICAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oXCJkZXN0cm95XCIpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgICBleHBvcnQgY2xhc3MgRWRpdG9yQmFyIGV4dGVuZHMgQ29tcG9uZW50PEVkaXRvclN0YXRlPiB7XG5cbiAgICAgICAgc3RvcmU6IFN0b3JlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuXG4gICAgICAgICAgICBjb25zdCBza2V0Y2hEb20kID0gc3RvcmUuZXZlbnRzLm1lcmdlKFxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2gubG9hZGVkLFxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQsXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci51c2VyTWVzc2FnZUNoYW5nZWQpXG4gICAgICAgICAgICAgICAgLm1hcChtID0+IHRoaXMucmVuZGVyKHN0b3JlLnN0YXRlKSk7XG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oc2tldGNoRG9tJCwgY29udGFpbmVyKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyKHN0YXRlOiBFZGl0b3JTdGF0ZSkge1xuICAgICAgICAgICAgY29uc3Qgc2tldGNoID0gc3RhdGUuc2tldGNoO1xuICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsIFtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBoKFwiYVwiLCBcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgIGhyZWY6IFwiL1wiXG4gICAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgaChcImltZy5sb2dvXCIsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjOiBcImltZy9zcGlyYWwtbG9nby53aGl0ZS41MC5wbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGgoXCJsYWJlbFwiLCBcIkFkZCB0ZXh0OiBcIiksXG4gICAgICAgICAgICAgICAgaChcImlucHV0LmFkZC10ZXh0XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXByZXNzOiAoZXYpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGV2LndoaWNoIHx8IGV2LmtleUNvZGUpID09PSBEb21IZWxwZXJzLktleUNvZGVzLkVudGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBldi50YXJnZXQgJiYgZXYudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2suYWRkLmRpc3BhdGNoKHsgdGV4dDogdGV4dCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnRhcmdldC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJQcmVzcyBbRW50ZXJdIHRvIGFkZFwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgICAgIGgoXCJsYWJlbFwiLCBcIkJhY2tncm91bmQ6IFwiKSxcbiAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBza2V0Y2guYmFja2dyb3VuZENvbG9yXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZub2RlLmVsbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZS5kaXNwYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yID8gY29sb3IudG9IZXhTdHJpbmcoKSA6IG51bGwgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlOiAob2xkVm5vZGUsIHZub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldCh2bm9kZS5lbG0sIHNrZXRjaC5iYWNrZ3JvdW5kQ29sb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSksXG5cbiAgICAgICAgICAgICAgICBCb290U2NyaXB0LmRyb3Bkb3duKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IFwic2tldGNoTWVudVwiLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkFjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIk5ld1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkNyZWF0ZSBuZXcgc2tldGNoXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmNyZWF0ZS5kaXNwYXRjaCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiQ2xlYXIgYWxsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiQ2xlYXIgc2tldGNoIGNvbnRlbnRzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmNsZWFyLmRpc3BhdGNoKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJab29tIHRvIGZpdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkZpdCBjb250ZW50cyBpbiB2aWV3XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnpvb21Ub0ZpdC5kaXNwYXRjaCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJFeHBvcnQgc21hbGwgaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFeHBvcnQgc2tldGNoIGFzIFBOR1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3IuZXhwb3J0UE5HLmRpc3BhdGNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXhlbHM6IDEwMCAqIDEwMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJFeHBvcnQgbWVkaXVtIGltYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRXhwb3J0IHNrZXRjaCBhcyBQTkdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLmV4cG9ydFBORy5kaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGl4ZWxzOiA1MDAgKiAxMDAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRXhwb3J0IFNWR1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkV4cG9ydCBza2V0Y2ggYXMgdmVjdG9yIGdyYXBoaWNzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLmV4cG9ydFNWRy5kaXNwYXRjaCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJEdXBsaWNhdGUgc2tldGNoIChuZXcgVVJMKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkNvcHkgY29udGVudHMgaW50byBhIHNrZXRjaCB3aXRoIGEgbmV3IGFkZHJlc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5za2V0Y2guY2xvbmUuZGlzcGF0Y2goKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiTG9hZCBzYW1wbGUgc2tldGNoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiT3BlbiBhIHNhbXBsZSBza2V0Y2ggdG8gcGxheSB3aXRoXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLm9wZW5TYW1wbGUuZGlzcGF0Y2goKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiVXBsb2FkIHRlbXBvcmFyeSB0cmFjaW5nIGltYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiVXBsb2FkIGltYWdlIGludG8gd29ya3NwYWNlIGZvciB0cmFjaW5nLiBUaGUgaW1hZ2Ugd2lsbCBub3Qgc2hvdyBpbiBmaW5hbCBvdXRwdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuc2hvd09wZXJhdGlvbihuZXcgVXBsb2FkSW1hZ2UodGhpcy5zdG9yZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiUmVtb3ZlIHRyYWNpbmcgaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJSZW1vdmUgYmFja2dyb3VuZCB0cmFjaW5nIGltYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLnJlbW92ZVVwbG9hZGVkSW1hZ2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlRvZ2dsZSB0cmFuc3BhcmVuY3lcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJTZWUgdGhyb3VnaCB0ZXh0IHRvIGVsZW1lbnRzIGJlaGluZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5zZXRUcmFuc3BhcmVuY3koIXRoaXMuc3RvcmUuc3RhdGUudHJhbnNwYXJlbmN5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSksXG5cbiAgICAgICAgICAgICAgICBoKFwiZGl2I3JpZ2h0U2lkZVwiLFxuICAgICAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgaChcImRpdiN1c2VyLW1lc3NhZ2VcIiwge30sIFtzdGF0ZS51c2VyTWVzc2FnZSB8fCBcIlwiXSksXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYjc2hvdy1oZWxwLmdseXBoaWNvbi5nbHlwaGljb24tcXVlc3Rpb24tc2lnblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci50b2dnbGVIZWxwLmRpc3BhdGNoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgXSlcblxuICAgICAgICAgICAgXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsImludGVyZmFjZSBKUXVlcnkge1xuICAgIHNlbGVjdHBpY2tlciguLi5hcmdzOiBhbnlbXSk7XG4gICAgLy9yZXBsYWNlT3B0aW9ucyhvcHRpb25zOiBBcnJheTx7dmFsdWU6IHN0cmluZywgdGV4dD86IHN0cmluZ30+KTtcbn1cblxubmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgICBleHBvcnQgY2xhc3MgRm9udFBpY2tlciB7XG5cbiAgICAgICAgZGVmYXVsdEZvbnRGYW1pbHkgPSBcIlJvYm90b1wiO1xuICAgICAgICBwcmV2aWV3Rm9udFNpemUgPSBcIjI4cHhcIjtcblxuICAgICAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUsIGJsb2NrOiBUZXh0QmxvY2spIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICAgICAgICAgIGNvbnN0IGRvbSQgPSBSeC5PYnNlcnZhYmxlLmp1c3QoYmxvY2spXG4gICAgICAgICAgICAgICAgLm1lcmdlKFxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQub2JzZXJ2ZSgpXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobSA9PiBtLmRhdGEuX2lkID09PSBibG9jay5faWQpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAobSA9PiBtLmRhdGEpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5tYXAodGIgPT4gdGhpcy5yZW5kZXIodGIpKTtcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyKGJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XG4gICAgICAgICAgICBsZXQgdXBkYXRlID0gcGF0Y2ggPT4ge1xuICAgICAgICAgICAgICAgIHBhdGNoLl9pZCA9IGJsb2NrLl9pZDtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUF0dHIuZGlzcGF0Y2gocGF0Y2gpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzOiBWTm9kZVtdID0gW107XG4gICAgICAgICAgICBlbGVtZW50cy5wdXNoKFxuICAgICAgICAgICAgICAgIGgoXCJzZWxlY3RcIixcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcInNlbGVjdFBpY2tlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImZhbWlseS1waWNrZXJcIjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogdm5vZGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB2bm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoXCJkZXN0cm95XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZXYgPT4gdXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogZXYudGFyZ2V0LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogRm9udFNoYXBlLkZvbnRDYXRhbG9nLmRlZmF1bHRWYXJpYW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5yZXNvdXJjZXMuZm9udENhdGFsb2cuZ2V0UmVjb3JkKGV2LnRhcmdldC52YWx1ZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5yZXNvdXJjZXMuZm9udENhdGFsb2dcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZXRMaXN0KHRoaXMuc3RvcmUuZm9udExpc3RMaW1pdClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKHJlY29yZDogRm9udFNoYXBlLkZhbWlseVJlY29yZCkgPT4gaChcIm9wdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkOiByZWNvcmQuZmFtaWx5ID09PSBibG9jay5mb250RmFtaWx5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWNvbnRlbnRcIjogYDxzcGFuIHN0eWxlPVwiJHtGb250SGVscGVycy5nZXRTdHlsZVN0cmluZyhyZWNvcmQuZmFtaWx5LCBudWxsLCB0aGlzLnByZXZpZXdGb250U2l6ZSl9XCI+JHtyZWNvcmQuZmFtaWx5fTwvc3Bhbj5gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcmVjb3JkLmZhbWlseV0pXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkRmFtaWx5ID0gdGhpcy5zdG9yZS5yZXNvdXJjZXMuZm9udENhdGFsb2cuZ2V0UmVjb3JkKGJsb2NrLmZvbnRGYW1pbHkpO1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRmFtaWx5ICYmIHNlbGVjdGVkRmFtaWx5LnZhcmlhbnRzXG4gICAgICAgICAgICAgICAgJiYgc2VsZWN0ZWRGYW1pbHkudmFyaWFudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goaChcInNlbGVjdFwiLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwidmFyaWFudFBpY2tlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZhcmlhbnQtcGlja2VyXCI6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IHZub2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogdm5vZGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKFwiZGVzdHJveVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zdHBhdGNoOiAob2xkVm5vZGUsIHZub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUTogd2h5IGNhbid0IHdlIGp1c3QgZG8gc2VsZWN0cGlja2VyKHJlZnJlc2gpIGhlcmU/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBOiBzZWxlY3RwaWNrZXIgaGFzIG1lbnRhbCBwcm9ibGVtc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoeyBmb250VmFyaWFudDogZXYudGFyZ2V0LnZhbHVlIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmFtaWx5LnZhcmlhbnRzLm1hcCh2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoKFwib3B0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHYgPT09IGJsb2NrLmZvbnRWYXJpYW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGFpbmVyXCI6IFwiYm9keVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWNvbnRlbnRcIjogYDxzcGFuIHN0eWxlPVwiJHtGb250SGVscGVycy5nZXRTdHlsZVN0cmluZyhzZWxlY3RlZEZhbWlseS5mYW1pbHksIHYsIHRoaXMucHJldmlld0ZvbnRTaXplKX1cIj4ke3Z9PC9zcGFuPmBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3ZdKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjbGFzczogeyBcImZvbnQtcGlja2VyXCI6IHRydWUgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZWxlbWVudHNcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGNsYXNzIEhlbHBEaWFsb2cge1xuXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgICAgICAgICAgY29uc3Qgb3V0ZXIgPSAkKGNvbnRhaW5lcik7XG4gICAgICAgICAgICBvdXRlci5hcHBlbmQoXCI8aDM+R2V0dGluZyBzdGFydGVkPC9oMz5cIik7XG4gICAgICAgICAgICBzdG9yZS5zdGF0ZS5zaG93SGVscCA/IG91dGVyLnNob3coKSA6IG91dGVyLmhpZGUoKTtcbiAgICAgICAgICAgICQuZ2V0KFwiY29udGVudC9oZWxwLmh0bWxcIiwgZCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xvc2UgPSAkKFwiPGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1kZWZhdWx0Jz4gQ2xvc2UgPC9idXR0b24+XCIpO1xuICAgICAgICAgICAgICAgIGNsb3NlLm9uKFwiY2xpY2tcIiwgZXYgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuZGlzcGF0Y2goKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBvdXRlci5hcHBlbmQoJChkKSlcbiAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoY2xvc2UpXG4gICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwiPGEgY2xhc3M9J3JpZ2h0JyBocmVmPSdtYWlsdG86ZmlkZGxlc3RpY2tzQGNvZGVmbGlnaHQuaW8nPkVtYWlsIHVzPC9hPlwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5zaG93SGVscENoYW5nZWQuc3ViKHNob3cgPT4ge1xuICAgICAgICAgICAgICAgIHNob3cgPyBvdXRlci5zaG93KCkgOiBvdXRlci5oaWRlKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcbiAgICBcbiAgICBleHBvcnQgY2xhc3MgT3BlcmF0aW9uUGFuZWwge1xuICAgICAgICBcbiAgICAgICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU7XG4gICAgICAgIFxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpe1xuIFxuICAgICAgICAgICAgY29uc3QgZG9tJCA9IHN0b3JlLm9wZXJhdGlvbiQubWFwKG9wID0+IHtcbiAgICAgICAgICAgICAgICBpZighb3Ape1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaChcImRpdi5oaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBoKFwiZGl2Lm9wZXJhdGlvblwiLCBbb3AucmVuZGVyKCldKTtcbiAgICAgICAgICAgIH0pICAgICAgICAgICBcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuICAgIFxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGNsYXNzIFNlbGVjdGVkSXRlbUVkaXRvciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGRvbSQgPSBzdG9yZS5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5vYnNlcnZlKClcbiAgICAgICAgICAgICAgICAubWFwKGkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc0l0ZW0gPSA8UG9zaXRpb25lZE9iamVjdFJlZj5pLmRhdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBwb3NJdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBwb3NJdGVtLml0ZW1UeXBlID09PSAnVGV4dEJsb2NrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgXy5maW5kKHN0b3JlLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgPT4gYi5faWQgPT09IHBvc0l0ZW0uaXRlbUlkKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaCgnZGl2I2VkaXRvck92ZXJsYXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoKCdkaXYjZWRpdG9yT3ZlcmxheScsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGVmdDogcG9zSXRlbS5jbGllbnRYICsgXCJweFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0b3A6IHBvc0l0ZW0uY2xpZW50WSArIFwicHhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBUZXh0QmxvY2tFZGl0b3Ioc3RvcmUpLnJlbmRlcihibG9jaylcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcblxuICAgIGV4cG9ydCBjbGFzcyBUZXh0QmxvY2tFZGl0b3IgZXh0ZW5kcyBDb21wb25lbnQ8VGV4dEJsb2NrPiB7XG4gICAgICAgIHN0b3JlOiBTdG9yZTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihzdG9yZTogU3RvcmUpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIodGV4dEJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XG4gICAgICAgICAgICBsZXQgdXBkYXRlID0gdGIgPT4ge1xuICAgICAgICAgICAgICAgIHRiLl9pZCA9IHRleHRCbG9jay5faWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyLmRpc3BhdGNoKHRiKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2LnRleHQtYmxvY2stZWRpdG9yXCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IHRleHRCbG9jay5faWRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgaChcInRleHRhcmVhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2sudGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5cHJlc3M6IChldjogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChldi53aGljaCB8fCBldi5rZXlDb2RlKSA9PT0gRG9tSGVscGVycy5LZXlDb2Rlcy5FbnRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKHsgdGV4dDogKDxIVE1MVGV4dEFyZWFFbGVtZW50PmV2LnRhcmdldCkudmFsdWUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogZXYgPT4gdXBkYXRlKHsgdGV4dDogZXYudGFyZ2V0LnZhbHVlIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG5cbiAgICAgICAgICAgICAgICAgICAgaChcImRpdlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImRpdi5mb250LWNvbG9yLWljb24uZm9yZVwiLCB7fSwgXCJBXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC50ZXh0LWNvbG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlRleHQgY29sb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLnRleHRDb2xvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0dXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTa2V0Y2hIZWxwZXJzLmNvbG9yc0luVXNlKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yID0+IHVwZGF0ZSh7IHRleHRDb2xvcjogY29sb3IgJiYgY29sb3IudG9IZXhTdHJpbmcoKSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICh2bm9kZSkgPT4gQ29sb3JQaWNrZXIuZGVzdHJveSh2bm9kZS5lbG0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSxcblxuICAgICAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5iYWNrXCIsIHt9LCBcIkFcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaChcImlucHV0LmJhY2tncm91bmQtY29sb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiQmFja2dyb3VuZCBjb2xvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZub2RlLmVsbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgYmFja2dyb3VuZENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pLFxuXG4gICAgICAgICAgICAgICAgICAgIGgoXCJidXR0b24uZGVsZXRlLXRleHRibG9jay5idG4uYnRuLWRhbmdlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRGVsZXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBlID0+IHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sucmVtb3ZlLmRpc3BhdGNoKHRleHRCbG9jaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuLmdseXBoaWNvbi5nbHlwaGljb24tdHJhc2hcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgKSxcblxuICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtcGlja2VyLWNvbnRhaW5lclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAodm5vZGUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgRm9udFBpY2tlcih2bm9kZS5lbG0sIHRoaXMuc3RvcmUsIHRleHRCbG9jaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBob29rOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGluc2VydDogKHZub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zdCBwcm9wczogRm9udFBpY2tlclByb3BzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHN0b3JlOiB0aGlzLnN0b3JlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHNlbGVjdGlvbjogdGV4dEJsb2NrLmZvbnREZXNjLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHNlbGVjdGlvbkNoYW5nZWQ6IChmb250RGVzYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB1cGRhdGUoeyBmb250RGVzYyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgUmVhY3RET00ucmVuZGVyKHJoKEZvbnRQaWNrZXIsIHByb3BzKSwgdm5vZGUuZWxtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICApLFxuXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cblxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGNsYXNzIER1YWxCb3VuZHNQYXRoV2FycCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcblxuICAgICAgICBzdGF0aWMgUE9JTlRTX1BFUl9QQVRIID0gMjAwO1xuICAgICAgICBzdGF0aWMgVVBEQVRFX0RFQk9VTkNFID0gMTUwO1xuXG4gICAgICAgIHByaXZhdGUgX3NvdXJjZTogcGFwZXIuQ29tcG91bmRQYXRoO1xuICAgICAgICBwcml2YXRlIF91cHBlcjogU3RyZXRjaFBhdGg7XG4gICAgICAgIHByaXZhdGUgX2xvd2VyOiBTdHJldGNoUGF0aDtcbiAgICAgICAgcHJpdmF0ZSBfd2FycGVkOiBwYXBlci5Db21wb3VuZFBhdGg7XG4gICAgICAgIHByaXZhdGUgX291dGxpbmU6IHBhcGVyLlBhdGg7XG4gICAgICAgIHByaXZhdGUgX2N1c3RvbVN0eWxlOiBTa2V0Y2hJdGVtU3R5bGU7XG5cbiAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBzb3VyY2U6IHBhcGVyLkNvbXBvdW5kUGF0aCxcbiAgICAgICAgICAgIGJvdW5kcz86IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9LFxuICAgICAgICAgICAgY3VzdG9tU3R5bGU/OiBTa2V0Y2hJdGVtU3R5bGUpIHtcblxuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgLy8gLS0gYnVpbGQgY2hpbGRyZW4gLS1cblxuICAgICAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xuICAgICAgICAgICAgdGhpcy5fc291cmNlLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBpZiAoYm91bmRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIgPSBuZXcgU3RyZXRjaFBhdGgoYm91bmRzLnVwcGVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb3dlciA9IG5ldyBTdHJldGNoUGF0aChib3VuZHMubG93ZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cHBlciA9IG5ldyBTdHJldGNoUGF0aChbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMudG9wTGVmdCksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TZWdtZW50KHNvdXJjZS5ib3VuZHMudG9wUmlnaHQpXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG93ZXIgPSBuZXcgU3RyZXRjaFBhdGgoW1xuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLmJvdHRvbUxlZnQpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLmJvdHRvbVJpZ2h0KVxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xCb3VuZHNPcGFjaXR5ID0gMC43NTtcblxuICAgICAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgICAgICAgICB0aGlzLl9sb3dlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcblxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZSA9IG5ldyBwYXBlci5QYXRoKHsgY2xvc2VkOiB0cnVlIH0pO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lU2hhcGUoKTtcblxuICAgICAgICAgICAgdGhpcy5fd2FycGVkID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChzb3VyY2UucGF0aERhdGEpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVXYXJwZWQoKTtcblxuICAgICAgICAgICAgLy8gLS0gYWRkIGNoaWxkcmVuIC0tXG5cbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGRyZW4oW3RoaXMuX291dGxpbmUsIHRoaXMuX3dhcnBlZCwgdGhpcy5fdXBwZXIsIHRoaXMuX2xvd2VyXSk7XG5cbiAgICAgICAgICAgIC8vIC0tIGFzc2lnbiBzdHlsZSAtLVxuXG4gICAgICAgICAgICB0aGlzLmN1c3RvbVN0eWxlID0gY3VzdG9tU3R5bGUgfHwge1xuICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBcImdyYXlcIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gLS0gc2V0IHVwIG9ic2VydmVycyAtLVxuXG4gICAgICAgICAgICBSeC5PYnNlcnZhYmxlLm1lcmdlKFxuICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyLnBhdGhDaGFuZ2VkLm9ic2VydmUoKSxcbiAgICAgICAgICAgICAgICB0aGlzLl9sb3dlci5wYXRoQ2hhbmdlZC5vYnNlcnZlKCkpXG4gICAgICAgICAgICAgICAgLmRlYm91bmNlKER1YWxCb3VuZHNQYXRoV2FycC5VUERBVEVfREVCT1VOQ0UpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShwYXRoID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lU2hhcGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVXYXJwZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlZChQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkdFT01FVFJZKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmUoZmxhZ3MgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmbGFncyAmIFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuQVRUUklCVVRFKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl91cHBlci52aXNpYmxlICE9PSB0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91cHBlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvd2VyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdXBwZXIoKTogcGFwZXIuUGF0aCB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdXBwZXIucGF0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBsb3dlcigpOiBwYXBlci5QYXRoIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb3dlci5wYXRoO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IHNvdXJjZSh2YWx1ZTogcGFwZXIuQ29tcG91bmRQYXRoKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2UgJiYgdGhpcy5fc291cmNlLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NvdXJjZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlV2FycGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgY3VzdG9tU3R5bGUoKTogU2tldGNoSXRlbVN0eWxlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jdXN0b21TdHlsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBjdXN0b21TdHlsZSh2YWx1ZTogU2tldGNoSXRlbVN0eWxlKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXN0b21TdHlsZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fd2FycGVkLnN0eWxlID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAodmFsdWUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5maWxsQ29sb3IgPSB2YWx1ZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5maWxsQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBjb250cm9sQm91bmRzT3BhY2l0eSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLl91cHBlci5vcGFjaXR5ID0gdGhpcy5fbG93ZXIub3BhY2l0eSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgb3V0bGluZUNvbnRhaW5zKHBvaW50OiBwYXBlci5Qb2ludCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX291dGxpbmUuY29udGFpbnMocG9pbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVXYXJwZWQoKSB7XG4gICAgICAgICAgICBsZXQgb3J0aE9yaWdpbiA9IHRoaXMuX3NvdXJjZS5ib3VuZHMudG9wTGVmdDtcbiAgICAgICAgICAgIGxldCBvcnRoV2lkdGggPSB0aGlzLl9zb3VyY2UuYm91bmRzLndpZHRoO1xuICAgICAgICAgICAgbGV0IG9ydGhIZWlnaHQgPSB0aGlzLl9zb3VyY2UuYm91bmRzLmhlaWdodDtcblxuICAgICAgICAgICAgbGV0IHByb2plY3Rpb24gPSBQYXBlckhlbHBlcnMuZHVhbEJvdW5kc1BhdGhQcm9qZWN0aW9uKFxuICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyLnBhdGgsIHRoaXMuX2xvd2VyLnBhdGgpO1xuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBGb250U2hhcGUuUGF0aFRyYW5zZm9ybShwb2ludCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFwb2ludCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KG9ydGhPcmlnaW4pO1xuICAgICAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxuICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZS54IC8gb3J0aFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gb3J0aEhlaWdodCk7XG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3RlZDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBuZXdQYXRocyA9IHRoaXMuX3NvdXJjZS5jaGlsZHJlblxuICAgICAgICAgICAgICAgIC5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSA8cGFwZXIuUGF0aD5pdGVtO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4UG9pbnRzID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEFzUG9pbnRzKHBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBEdWFsQm91bmRzUGF0aFdhcnAuUE9JTlRTX1BFUl9QQVRIKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChwID0+IHRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludChwKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhQYXRoID0gbmV3IHBhcGVyLlBhdGgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IHhQb2ludHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geFBhdGg7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5yZW1vdmVDaGlsZHJlbigpO1xuICAgICAgICAgICAgdGhpcy5fd2FycGVkLmFkZENoaWxkcmVuKG5ld1BhdGhzKTtcbiAgICAgICAgICAgIGZvcihjb25zdCBjIG9mIHRoaXMuX3dhcnBlZC5jaGlsZHJlbil7XG4gICAgICAgICAgICAgICAgKDxwYXBlci5QYXRoPmMpLnNpbXBsaWZ5KDAuMDAyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdXBkYXRlT3V0bGluZVNoYXBlKCkge1xuICAgICAgICAgICAgY29uc3QgbG93ZXIgPSBuZXcgcGFwZXIuUGF0aCh0aGlzLl9sb3dlci5wYXRoLnNlZ21lbnRzKTtcbiAgICAgICAgICAgIGxvd2VyLnJldmVyc2UoKTtcbiAgICAgICAgICAgIHRoaXMuX291dGxpbmUuc2VnbWVudHMgPSB0aGlzLl91cHBlci5wYXRoLnNlZ21lbnRzLmNvbmNhdChsb3dlci5zZWdtZW50cyk7XG4gICAgICAgICAgICBsb3dlci5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XG5cbiAgICBleHBvcnQgY2xhc3MgUGF0aEhhbmRsZSBleHRlbmRzIHBhcGVyLkdyb3VwIHtcblxuICAgICAgICBzdGF0aWMgU0VHTUVOVF9NQVJLRVJfUkFESVVTID0gMTA7XG4gICAgICAgIHN0YXRpYyBDVVJWRV9NQVJLRVJfUkFESVVTID0gNjtcbiAgICAgICAgc3RhdGljIERSQUdfVEhSRVNIT0xEID0gMztcblxuICAgICAgICBwcml2YXRlIF9tYXJrZXI6IHBhcGVyLlNoYXBlO1xuICAgICAgICBwcml2YXRlIF9zZWdtZW50OiBwYXBlci5TZWdtZW50O1xuICAgICAgICBwcml2YXRlIF9jdXJ2ZTogcGFwZXIuQ3VydmU7XG4gICAgICAgIHByaXZhdGUgX3Ntb290aGVkOiBib29sZWFuO1xuICAgICAgICBwcml2YXRlIF9jdXJ2ZVNwbGl0ID0gbmV3IE9ic2VydmFibGVFdmVudDxudW1iZXI+KCk7XG4gICAgICAgIHByaXZhdGUgX2N1cnZlQ2hhbmdlVW5zdWI6ICgpID0+IHZvaWQ7XG4gICAgICAgIHByaXZhdGUgZHJhZ2dpbmc7XG5cbiAgICAgICAgY29uc3RydWN0b3IoYXR0YWNoOiBwYXBlci5TZWdtZW50IHwgcGFwZXIuQ3VydmUpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIGxldCBwb3NpdGlvbjogcGFwZXIuUG9pbnQ7XG4gICAgICAgICAgICBsZXQgcGF0aDogcGFwZXIuUGF0aDtcbiAgICAgICAgICAgIGlmIChhdHRhY2ggaW5zdGFuY2VvZiBwYXBlci5TZWdtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudCA9IDxwYXBlci5TZWdtZW50PmF0dGFjaDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuX3NlZ21lbnQucG9pbnQ7XG4gICAgICAgICAgICAgICAgcGF0aCA9IHRoaXMuX3NlZ21lbnQucGF0aDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXR0YWNoIGluc3RhbmNlb2YgcGFwZXIuQ3VydmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZSA9IDxwYXBlci5DdXJ2ZT5hdHRhY2g7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XG4gICAgICAgICAgICAgICAgcGF0aCA9IHRoaXMuX2N1cnZlLnBhdGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IFwiYXR0YWNoIG11c3QgYmUgU2VnbWVudCBvciBDdXJ2ZVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIgPSBwYXBlci5TaGFwZS5DaXJjbGUocG9zaXRpb24sIFBhdGhIYW5kbGUuU0VHTUVOVF9NQVJLRVJfUkFESVVTKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5zdHJva2VDb2xvciA9IFwiYmx1ZVwiO1xuICAgICAgICAgICAgdGhpcy5fbWFya2VyLmZpbGxDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5zZWxlY3RlZENvbG9yID0gbmV3IHBhcGVyLkNvbG9yKDAsIDApO1xuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9tYXJrZXIpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBc1NlZ21lbnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZUFzQ3VydmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFwZXJFeHQuZXh0ZW5kTW91c2VFdmVudHModGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMub24ocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ1N0YXJ0LCBldiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnZlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBjdXJ2ZSwgcHVwYXRlIHRvIHNlZ21lbnQgaGFuZGxlXG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VydmVDaGFuZ2VVbnN1YigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gbmV3IHBhcGVyLlNlZ21lbnQodGhpcy5jZW50ZXIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJ2ZUlkeCA9IHRoaXMuX2N1cnZlLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJ2ZS5wYXRoLmluc2VydChcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlSWR4ICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnRcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VydmUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlQXNTZWdtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VydmVTcGxpdC5ub3RpZnkoY3VydmVJZHgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2VnbWVudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LnBvaW50ID0gdGhpcy5jZW50ZXI7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zbW9vdGhlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5zbW9vdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zbGF0ZShldi5kZWx0YSk7XG4gICAgICAgICAgICAgICAgZXYuc3RvcCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBldiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zbW9vdGhlZCA9ICF0aGlzLnNtb290aGVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBldi5zdG9wKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5fY3VydmVDaGFuZ2VVbnN1YiA9IHBhdGguc3Vic2NyaWJlKGZsYWdzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VydmUgJiYgIXRoaXMuX3NlZ21lbnRcbiAgICAgICAgICAgICAgICAgICAgJiYgKGZsYWdzICYgUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5TRUdNRU5UUykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBzbW9vdGhlZCgpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zbW9vdGhlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBzbW9vdGhlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICAgICAgdGhpcy5fc21vb3RoZWQgPSB2YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5zbW9vdGgoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5oYW5kbGVJbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5oYW5kbGVPdXQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGN1cnZlU3BsaXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3VydmVTcGxpdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBjZW50ZXIoKTogcGFwZXIuUG9pbnQge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb247XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgY2VudGVyKHBvaW50OiBwYXBlci5Qb2ludCkge1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvaW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdHlsZUFzU2VnbWVudCgpIHtcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5vcGFjaXR5ID0gMC44O1xuICAgICAgICAgICAgdGhpcy5fbWFya2VyLmRhc2hBcnJheSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIucmFkaXVzID0gUGF0aEhhbmRsZS5TRUdNRU5UX01BUktFUl9SQURJVVM7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHN0eWxlQXNDdXJ2ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5vcGFjaXR5ID0gMC44O1xuICAgICAgICAgICAgdGhpcy5fbWFya2VyLmRhc2hBcnJheSA9IFsyLCAyXTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5yYWRpdXMgPSBQYXRoSGFuZGxlLkNVUlZFX01BUktFUl9SQURJVVM7XG4gICAgICAgIH1cblxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGNsYXNzIFN0cmV0Y2hQYXRoIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xuXG4gICAgICAgIHByaXZhdGUgX3BhdGg6IHBhcGVyLlBhdGg7XG4gICAgICAgIHByaXZhdGUgX3BhdGhDaGFuZ2VkID0gbmV3IE9ic2VydmFibGVFdmVudDxwYXBlci5QYXRoPigpO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHNlZ21lbnRzOiBwYXBlci5TZWdtZW50W10sIHN0eWxlPzogcGFwZXIuU3R5bGUpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3BhdGggPSBuZXcgcGFwZXIuUGF0aChzZWdtZW50cyk7XG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3BhdGgpO1xuXG4gICAgICAgICAgICBpZiAoc3R5bGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXRoLnN0eWxlID0gc3R5bGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGguc3Ryb2tlQ29sb3IgPSBcImxpZ2h0Z3JheVwiO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGguc3Ryb2tlV2lkdGggPSA2O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHMgb2YgdGhpcy5fcGF0aC5zZWdtZW50cykge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkU2VnbWVudEhhbmRsZShzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChjb25zdCBjIG9mIHRoaXMuX3BhdGguY3VydmVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZShjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBwYXRoKCk6IHBhcGVyLlBhdGgge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhdGg7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgcGF0aENoYW5nZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGF0aENoYW5nZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGFkZFNlZ21lbnRIYW5kbGUoc2VnbWVudDogcGFwZXIuU2VnbWVudCkge1xuICAgICAgICAgICAgdGhpcy5hZGRIYW5kbGUobmV3IFBhdGhIYW5kbGUoc2VnbWVudCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBhZGRDdXJ2ZUhhbmRsZShjdXJ2ZTogcGFwZXIuQ3VydmUpIHtcbiAgICAgICAgICAgIGxldCBoYW5kbGUgPSBuZXcgUGF0aEhhbmRsZShjdXJ2ZSk7XG4gICAgICAgICAgICBoYW5kbGUuY3VydmVTcGxpdC5zdWJzY3JpYmVPbmUoY3VydmVJZHggPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ3VydmVIYW5kbGUodGhpcy5fcGF0aC5jdXJ2ZXNbY3VydmVJZHhdKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEN1cnZlSGFuZGxlKHRoaXMuX3BhdGguY3VydmVzW2N1cnZlSWR4ICsgMV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmFkZEhhbmRsZShoYW5kbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBhZGRIYW5kbGUoaGFuZGxlOiBQYXRoSGFuZGxlKSB7XG4gICAgICAgICAgICBoYW5kbGUudmlzaWJsZSA9IHRoaXMudmlzaWJsZTtcbiAgICAgICAgICAgIGhhbmRsZS5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aENoYW5nZWQubm90aWZ5KHRoaXMuX3BhdGgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBoYW5kbGUub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBldiA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aENoYW5nZWQubm90aWZ5KHRoaXMuX3BhdGgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoaGFuZGxlKTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgLyoqXG4gICAgICogTWVhc3VyZXMgb2Zmc2V0cyBvZiB0ZXh0IGdseXBocy5cbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgVGV4dFJ1bGVyIHtcblxuICAgICAgICBmb250RmFtaWx5OiBzdHJpbmc7XG4gICAgICAgIGZvbnRXZWlnaHQ6IG51bWJlcjtcbiAgICAgICAgZm9udFNpemU6IG51bWJlcjtcblxuICAgICAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCh0ZXh0KTogcGFwZXIuSXRlbSB7XG4gICAgICAgICAgICB2YXIgcG9pbnRUZXh0ID0gbmV3IHBhcGVyLlBvaW50VGV4dCgpO1xuICAgICAgICAgICAgcG9pbnRUZXh0LmNvbnRlbnQgPSB0ZXh0O1xuICAgICAgICAgICAgcG9pbnRUZXh0Lmp1c3RpZmljYXRpb24gPSBcImNlbnRlclwiO1xuICAgICAgICAgICAgaWYgKHRoaXMuZm9udEZhbWlseSkge1xuICAgICAgICAgICAgICAgIHBvaW50VGV4dC5mb250RmFtaWx5ID0gdGhpcy5mb250RmFtaWx5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZm9udFdlaWdodCkge1xuICAgICAgICAgICAgICAgIHBvaW50VGV4dC5mb250V2VpZ2h0ID0gdGhpcy5mb250V2VpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZm9udFNpemUpIHtcbiAgICAgICAgICAgICAgICBwb2ludFRleHQuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcG9pbnRUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0VGV4dE9mZnNldHModGV4dCkge1xuICAgICAgICAgICAgLy8gTWVhc3VyZSBnbHlwaHMgaW4gcGFpcnMgdG8gY2FwdHVyZSB3aGl0ZSBzcGFjZS5cbiAgICAgICAgICAgIC8vIFBhaXJzIGFyZSBjaGFyYWN0ZXJzIGkgYW5kIGkrMS5cbiAgICAgICAgICAgIHZhciBnbHlwaFBhaXJzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBnbHlwaFBhaXJzW2ldID0gdGhpcy5jcmVhdGVQb2ludFRleHQodGV4dC5zdWJzdHJpbmcoaSwgaSArIDEpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRm9yIGVhY2ggY2hhcmFjdGVyLCBmaW5kIGNlbnRlciBvZmZzZXQuXG4gICAgICAgICAgICB2YXIgeE9mZnNldHMgPSBbMF07XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIC8vIE1lYXN1cmUgdGhyZWUgY2hhcmFjdGVycyBhdCBhIHRpbWUgdG8gZ2V0IHRoZSBhcHByb3ByaWF0ZSBcbiAgICAgICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxuICAgICAgICAgICAgICAgIHZhciB0cmlhZFRleHQgPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpIC0gMSwgaSArIDEpKTtcbiAgICAgICAgICAgICAgICB0cmlhZFRleHQucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBvdXQgaGFsZiBvZiBwcmlvciBnbHlwaCBwYWlyIFxuICAgICAgICAgICAgICAgIC8vICAgYW5kIGhhbGYgb2YgY3VycmVudCBnbHlwaCBwYWlyLlxuICAgICAgICAgICAgICAgIC8vIE11c3QgYmUgcmlnaHQsIGJlY2F1c2UgaXQgd29ya3MuXG4gICAgICAgICAgICAgICAgbGV0IG9mZnNldFdpZHRoID0gdHJpYWRUZXh0LmJvdW5kcy53aWR0aFxuICAgICAgICAgICAgICAgICAgICAtIGdseXBoUGFpcnNbaSAtIDFdLmJvdW5kcy53aWR0aCAvIDJcbiAgICAgICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHdpZHRoIHRvIHByaW9yIG9mZnNldC4gXG4gICAgICAgICAgICAgICAgeE9mZnNldHNbaV0gPSB4T2Zmc2V0c1tpIC0gMV0gKyBvZmZzZXRXaWR0aDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgZ2x5cGhQYWlyIG9mIGdseXBoUGFpcnMpIHtcbiAgICAgICAgICAgICAgICBnbHlwaFBhaXIucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB4T2Zmc2V0cztcbiAgICAgICAgfVxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xuXG4gICAgZXhwb3J0IGNsYXNzIFRleHRXYXJwIGV4dGVuZHMgRHVhbEJvdW5kc1BhdGhXYXJwIHtcblxuICAgICAgICBzdGF0aWMgREVGQVVMVF9GT05UX1NJWkUgPSAxMjg7XG5cbiAgICAgICAgcHJpdmF0ZSBfZm9udDogb3BlbnR5cGUuRm9udDtcbiAgICAgICAgcHJpdmF0ZSBfdGV4dDogc3RyaW5nO1xuICAgICAgICBwcml2YXRlIF9mb250U2l6ZTogbnVtYmVyO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgZm9udDogb3BlbnR5cGUuRm9udCxcbiAgICAgICAgICAgIHRleHQ6IHN0cmluZyxcbiAgICAgICAgICAgIGJvdW5kcz86IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9LFxuICAgICAgICAgICAgZm9udFNpemU/OiBudW1iZXIsXG4gICAgICAgICAgICBzdHlsZT86IFNrZXRjaEl0ZW1TdHlsZSkge1xuXG4gICAgICAgICAgICBpZiAoIWZvbnRTaXplKSB7XG4gICAgICAgICAgICAgICAgZm9udFNpemUgPSBUZXh0V2FycC5ERUZBVUxUX0ZPTlRfU0laRTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBUZXh0V2FycC5nZXRQYXRoRGF0YShmb250LCB0ZXh0LCBmb250U2l6ZSk7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XG5cbiAgICAgICAgICAgIHN1cGVyKHBhdGgsIGJvdW5kcywgc3R5bGUpO1xuXG4gICAgICAgICAgICB0aGlzLl9mb250ID0gZm9udDtcbiAgICAgICAgICAgIHRoaXMuX3RleHQgPSB0ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IHRleHQodmFsdWU6IHN0cmluZykge1xuICAgICAgICAgICAgdGhpcy5fdGV4dCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGZvbnRTaXplKCk6IG51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgZm9udFNpemUodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2ZvbnRTaXplID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHRQYXRoKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgZm9udCh2YWx1ZTogb3BlbnR5cGUuRm9udCkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl9mb250KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGV4dFBhdGgoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZVRleHRQYXRoKCkge1xuICAgICAgICAgICAgY29uc3QgcGF0aERhdGEgPSBUZXh0V2FycC5nZXRQYXRoRGF0YShcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250LCB0aGlzLl90ZXh0LCB0aGlzLl9mb250U2l6ZSk7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IG5ldyBwYXBlci5Db21wb3VuZFBhdGgocGF0aERhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UGF0aERhdGEoZm9udDogb3BlbnR5cGUuRm9udCxcbiAgICAgICAgICAgIHRleHQ6IHN0cmluZywgZm9udFNpemU/OiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcge1xuICAgICAgICAgICAgbGV0IG9wZW5UeXBlUGF0aCA9IGZvbnQuZ2V0UGF0aCh0ZXh0LCAwLCAwLFxuICAgICAgICAgICAgICAgIE51bWJlcihmb250U2l6ZSkgfHwgVGV4dFdhcnAuREVGQVVMVF9GT05UX1NJWkUpO1xuICAgICAgICAgICAgcmV0dXJuIG9wZW5UeXBlUGF0aC50b1BhdGhEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2tldGNoSXRlbVN0eWxlIGV4dGVuZHMgcGFwZXIuSVN0eWxlIHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xuICAgIH1cblxufSJdfQ==