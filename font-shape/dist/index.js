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
var FontShape;
(function (FontShape) {
    var FontCatalog = /** @class */ (function () {
        function FontCatalog(records) {
            var _this = this;
            // Encountered issues with these families
            this.excludeFamilies = ["Anton", "Arimo", "Slabo 27px"];
            records = records.filter(function (r) { return _this.excludeFamilies.indexOf(r.family) < 0; });
            var _loop_1 = function (record) {
                _.forOwn(record.files, function (val, key) {
                    if (_.startsWith(val, "http:")) {
                        record.files[key] = val.replace("http:", "https:");
                    }
                });
            };
            // make files https
            for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
                var record = records_1[_i];
                _loop_1(record);
            }
            this.records = records;
        }
        FontCatalog.fromLocal = function (path) {
            return $.ajax({
                url: path,
                dataType: 'json',
                cache: true
            })
                .then(function (response) {
                return new FontCatalog(response.items);
            }, function (err) { return console.error(path, status, err.toString()); });
        };
        FontCatalog.fromRemote = function () {
            var url = 'https://www.googleapis.com/webfonts/v1/webfonts?';
            var key = 'key=GOOGLE-API-KEY';
            var sort = "popularity";
            var opt = 'sort=' + sort + '&';
            var req = url + opt + key;
            return $.ajax({
                url: req,
                dataType: 'json',
                cache: true
            })
                .then(function (response) {
                return new FontCatalog(response.items);
            }, function (err) { return console.error(req, status, err.toString()); });
        };
        FontCatalog.prototype.getList = function (limit) {
            return !!limit
                ? this.records.slice(0, limit)
                : this.records;
        };
        FontCatalog.prototype.getCategories = function () {
            return _.uniq(this.records.map(function (f) { return f.category; }));
        };
        FontCatalog.prototype.getFamilies = function (category) {
            if (!category) {
                return this.records.map(function (f) { return f.family; });
            }
            return this.records
                .filter(function (f) { return f.category === category; })
                .map(function (f) { return f.family; });
        };
        FontCatalog.prototype.getVariants = function (family) {
            var fam = this.getRecord(family);
            return fam && fam.variants || [];
        };
        FontCatalog.prototype.getRecord = function (family) {
            return _.find(this.records, function (ff) { return ff.family === family; });
        };
        FontCatalog.prototype.getUrl = function (family, variant) {
            var record = this.getRecord(family);
            if (!record) {
                console.warn("no definition available for family", family);
                return null;
            }
            if (!variant) {
                variant = FontCatalog.defaultVariant(record);
            }
            var file = record.files[variant];
            if (!file) {
                console.warn("no font file available for variant", family, variant);
                file = record.files[0];
            }
            return file;
        };
        FontCatalog.defaultVariant = function (record) {
            if (!record)
                return null;
            if (record.variants.indexOf("regular") >= 0) {
                return "regular";
            }
            return record.variants[0];
        };
        /**
         * For a list of families, load alphanumeric chars into browser
         *   to support previewing.
         */
        FontCatalog.loadPreviewSubsets = function (families) {
            for (var _i = 0, _a = _.chunk(families.filter(function (f) { return !!f; }), 10); _i < _a.length; _i++) {
                var chunk = _a[_i];
                try {
                    WebFont.load({
                        classes: false,
                        google: {
                            families: chunk,
                            text: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                        }
                    });
                }
                catch (err) {
                    console.error("error loading font subsets", err, chunk);
                }
            }
        };
        return FontCatalog;
    }());
    FontShape.FontCatalog = FontCatalog;
})(FontShape || (FontShape = {}));
var PaperHelpers;
(function (PaperHelpers) {
    PaperHelpers.SAFARI_MAX_CANVAS_AREA = 67108864;
    var log = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        if (PaperHelpers.shouldLogInfo) {
            console.log.apply(console, params);
        }
    };
    /**
     * Determine the max dpi that can supported by Canvas.
     * Using Safari as the measure, because it seems to have the smallest limit.
     * Max DPI in Chrome produces approx 8000x8000.
     */
    function getMaxExportDpi(itemSize) {
        return getExportDpi(itemSize, PaperHelpers.SAFARI_MAX_CANVAS_AREA);
    }
    PaperHelpers.getMaxExportDpi = getMaxExportDpi;
    function getExportDpi(itemSize, pixels) {
        var itemArea = itemSize.width * itemSize.height;
        return 0.999 * Math.sqrt(pixels)
            * (paper.view.resolution)
            / Math.sqrt(itemArea);
    }
    PaperHelpers.getExportDpi = getExportDpi;
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
                console.warn("could not get projected point for unit point " + unitPoint);
                return topPoint;
            }
            else {
                return topPoint.add(bottomPoint.subtract(topPoint).multiply(unitPoint.y));
            }
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
     * Returns a - b, where a and b are unit offsets along a closed path.
     */
    function pathOffsetLength(start, end, clockwise) {
        if (clockwise === void 0) { clockwise = true; }
        start = pathOffsetNormalize(start);
        end = pathOffsetNormalize(end);
        if (clockwise) {
            if (start > end) {
                end += 1;
            }
            return pathOffsetNormalize(end - start);
        }
        if (end > start) {
            start += 1;
        }
        return pathOffsetNormalize(start - end);
    }
    PaperHelpers.pathOffsetLength = pathOffsetLength;
    function pathOffsetNormalize(offset) {
        if (offset < 0) {
            offset += Math.round(offset) + 1;
        }
        return offset % 1;
    }
    PaperHelpers.pathOffsetNormalize = pathOffsetNormalize;
})(PaperHelpers || (PaperHelpers = {}));
var FontShape;
(function (FontShape) {
    var ParsedFonts = /** @class */ (function () {
        function ParsedFonts(fontLoaded) {
            this.fonts = {};
            this._fontLoaded = fontLoaded || (function () { });
        }
        ParsedFonts.prototype.get = function (url) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!url) {
                    return;
                }
                var font = _this.fonts[url];
                if (font) {
                    resolve({ url: url, font: font });
                    return;
                }
                opentype.load(url, function (err, font) {
                    if (err) {
                        console.error(err, { url: url });
                        reject(err);
                    }
                    else {
                        _this.fonts[url] = font;
                        resolve({ url: url, font: font });
                        _this._fontLoaded({ url: url, font: font });
                    }
                });
            });
        };
        return ParsedFonts;
    }());
    FontShape.ParsedFonts = ParsedFonts;
})(FontShape || (FontShape = {}));
var FontShape;
(function (FontShape) {
    var PathSection = /** @class */ (function () {
        /**
         * Start and end are unit lengths: 0 to 1.
         */
        function PathSection(path, unitStart, unitLength, clockwise) {
            if (clockwise === void 0) { clockwise = true; }
            this.path = path;
            this.unitStart = unitStart;
            this.unitLength = unitLength;
            this.clockwise = clockwise;
        }
        Object.defineProperty(PathSection.prototype, "length", {
            get: function () {
                return this.unitLength * this.path.length;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * @param offset: length offset relative to this section.
         */
        PathSection.prototype.getPointAt = function (offset) {
            var pathLength = this.path.length;
            var direction = this.path.clockwise == this.clockwise ? 1 : -1;
            var pathOffset = this.unitStart * pathLength + offset * direction;
            if (pathOffset > pathLength) {
                pathOffset -= pathLength;
            }
            if (pathOffset < 0) {
                pathOffset += pathLength;
            }
            return this.path.getPointAt(pathOffset);
        };
        return PathSection;
    }());
    FontShape.PathSection = PathSection;
})(FontShape || (FontShape = {}));
var FontShape;
(function (FontShape) {
    var PathTransform = /** @class */ (function () {
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
    FontShape.PathTransform = PathTransform;
})(FontShape || (FontShape = {}));
var FontShape;
(function (FontShape) {
    var SnapPath = /** @class */ (function (_super) {
        __extends(SnapPath, _super);
        function SnapPath(region, content) {
            var _this = _super.call(this) || this;
            _this._region = region;
            _this._content = content;
            _this._content.visible = false;
            _this._warped = new paper.CompoundPath(content.pathData);
            _this._warped.fillColor = "gray";
            _this.corners = [0, 0.25, 0.50, 0.75];
            _this.addChild(_this._content);
            _this.addChild(_this._warped);
            _this.updatePath();
            return _this;
        }
        SnapPath.prototype.updatePath = function () {
            var contentOrigin = this._content.bounds.topLeft;
            var contentWidth = this._content.bounds.width;
            var contentHeight = this._content.bounds.height;
            var regionLength = this._region.length;
            var top = new FontShape.PathSection(this._region, this.corners[0], PaperHelpers.pathOffsetLength(this.corners[0], this.corners[1]));
            var bottom = new FontShape.PathSection(this._region, this.corners[3], PaperHelpers.pathOffsetLength(this.corners[3], this.corners[2], false), false);
            var projection = PaperHelpers.dualBoundsPathProjection(top, bottom);
            var transform = new FontShape.PathTransform(function (point) {
                if (!point) {
                    return point;
                }
                var relative = point.subtract(contentOrigin);
                var unit = new paper.Point(relative.x / contentWidth, relative.y / contentHeight);
                var projected = projection(unit);
                return projected;
            });
            var newPaths = this._content.children
                .map(function (item) {
                var path = item;
                var xPoints = PaperHelpers.tracePathAsPoints(path, 100)
                    .map(function (p) { return transform.transformPoint(p); });
                var xPath = new paper.Path({
                    segments: xPoints,
                    closed: true,
                    clockwise: path.clockwise
                });
                //xPath.reduce();
                return xPath;
            });
            this._warped.removeChildren();
            this._warped.addChildren(newPaths);
        };
        /**
         * Slide offset points by the given amount.
         * @param unitOffset: value 0 to 1
         */
        SnapPath.prototype.slide = function (unitOffset) {
            this.corners = this.corners.map(function (c) { return SnapPath.incrementOffset(c, unitOffset); });
        };
        SnapPath.incrementOffset = function (offset, delta) {
            var result = offset + delta;
            if (result < 0) {
                result = result + Math.round(result) + 1;
            }
            result = result % 1;
            //console.log(`${offset} + ${delta} => ${result}`);
            return result;
        };
        return SnapPath;
    }(paper.Group));
    FontShape.SnapPath = SnapPath;
})(FontShape || (FontShape = {}));
var FontShape;
(function (FontShape) {
    var VerticalBoundsStretchPath = /** @class */ (function (_super) {
        __extends(VerticalBoundsStretchPath, _super);
        function VerticalBoundsStretchPath(content, boundaries) {
            var _this = _super.call(this) || this;
            _this._content = content;
            _this._content.visible = false;
            _this._boundaries = boundaries ||
                {
                    upper: new paper.Path([content.bounds.topLeft, content.bounds.topRight]),
                    lower: new paper.Path([content.bounds.bottomLeft, content.bounds.bottomRight]),
                };
            _this._warped = new paper.CompoundPath(content.pathData);
            _this._warped.fillColor = "lightgray";
            _this.addChild(_this._content);
            _this.addChild(_this._warped);
            _this.updatePath();
            return _this;
        }
        VerticalBoundsStretchPath.prototype.updatePath = function () {
            var contentOrigin = this._content.bounds.topLeft;
            var contentWidth = this._content.bounds.width;
            var contentHeight = this._content.bounds.height;
            var projection = PaperHelpers.dualBoundsPathProjection(this._boundaries.upper, this._boundaries.lower);
            var transform = new FontShape.PathTransform(function (point) {
                if (!point) {
                    return point;
                }
                var relative = point.subtract(contentOrigin);
                var unit = new paper.Point(relative.x / contentWidth, relative.y / contentHeight);
                var projected = projection(unit);
                return projected;
            });
            var newPaths = this._content.children
                .map(function (item) {
                var path = item;
                var xPoints = PaperHelpers.tracePathAsPoints(path, VerticalBoundsStretchPath.pointsPerPath)
                    .map(function (p) { return transform.transformPoint(p); });
                var xPath = new paper.Path({
                    segments: xPoints,
                    closed: true,
                    clockwise: path.clockwise
                });
                //xPath.reduce();
                return xPath;
            });
            this._warped.removeChildren();
            this._warped.addChildren(newPaths);
        };
        VerticalBoundsStretchPath.pointsPerPath = 200;
        return VerticalBoundsStretchPath;
    }(paper.Group));
    FontShape.VerticalBoundsStretchPath = VerticalBoundsStretchPath;
})(FontShape || (FontShape = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9wYXBlci1leHQudHMiLCIuLi9zcmMvRm9udENhdGFsb2cudHMiLCIuLi9zcmMvUGFwZXJIZWxwZXJzLnRzIiwiLi4vc3JjL1BhcnNlZEZvbnRzLnRzIiwiLi4vc3JjL1BhdGhTZWN0aW9uLnRzIiwiLi4vc3JjL1BhdGhUcmFuc2Zvcm0udHMiLCIuLi9zcmMvU25hcFBhdGgudHMiLCIuLi9zcmMvVmVydGljYWxCb3VuZHNTdHJldGNoUGF0aC50cyIsIi4uL3NyYy9tb2RlbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsSUFBVSxTQUFTLENBb0lsQjtBQXBJRCxXQUFVLFNBQVM7SUFFZjtRQXVDSSxxQkFBWSxPQUF1QjtZQUFuQyxpQkFjQztZQW5ERCx5Q0FBeUM7WUFDekMsb0JBQWUsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFzQy9DLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBMUMsQ0FBMEMsQ0FBQyxDQUFDO29DQUcvRCxNQUFNO2dCQUNiLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFDLEdBQVcsRUFBRSxHQUFXO29CQUM1QyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxFQUFFO3dCQUM1QixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUN0RDtnQkFDTCxDQUFDLENBQUMsQ0FBQzs7WUFOUCxtQkFBbUI7WUFDbkIsS0FBcUIsVUFBTyxFQUFQLG1CQUFPLEVBQVAscUJBQU8s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QyxjQUFjLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBOURNLHVDQUFhLEdBQUcsR0FBRyxDQUFDO1FBK0QvQixnQ0FBQztLQUFBLEFBaEVELENBQStDLEtBQUssQ0FBQyxLQUFLLEdBZ0V6RDtJQWhFWSxtQ0FBeUIsNEJBZ0VyQyxDQUFBO0FBRUwsQ0FBQyxFQXBFUyxTQUFTLEtBQVQsU0FBUyxRQW9FbEIiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIG1vZHVsZSBwYXBlciB7XG5cbiAgICBpbnRlcmZhY2UgQ3VydmVsaWtlIHtcbiAgICAgICAgbGVuZ3RoOiBudW1iZXI7XG4gICAgICAgIGdldFBvaW50QXQob2Zmc2V0OiBudW1iZXIpOiBwYXBlci5Qb2ludDtcbiAgICB9XG4gICAgXG59IiwibmFtZXNwYWNlIEZvbnRTaGFwZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgRm9udENhdGFsb2cge1xuXG4gICAgICAgIC8vIEVuY291bnRlcmVkIGlzc3VlcyB3aXRoIHRoZXNlIGZhbWlsaWVzXG4gICAgICAgIGV4Y2x1ZGVGYW1pbGllcyA9IFtcIkFudG9uXCIsIFwiQXJpbW9cIiwgXCJTbGFibyAyN3B4XCJdO1xuXG4gICAgICAgIHN0YXRpYyBmcm9tTG9jYWwocGF0aDogc3RyaW5nKTogSlF1ZXJ5UHJvbWlzZTxGb250Q2F0YWxvZz4ge1xuICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBwYXRoLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlOiB7IGtpbmQ6IHN0cmluZywgaXRlbXM6IEZhbWlseVJlY29yZFtdIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGb250Q2F0YWxvZyhyZXNwb25zZS5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5lcnJvcihwYXRoLCBzdGF0dXMsIGVyci50b1N0cmluZygpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZnJvbVJlbW90ZSgpOiBKUXVlcnlQcm9taXNlPEZvbnRDYXRhbG9nPiB7XG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3dlYmZvbnRzL3YxL3dlYmZvbnRzPyc7XG4gICAgICAgICAgICB2YXIga2V5ID0gJ2tleT1HT09HTEUtQVBJLUtFWSc7XG4gICAgICAgICAgICB2YXIgc29ydCA9IFwicG9wdWxhcml0eVwiO1xuICAgICAgICAgICAgdmFyIG9wdCA9ICdzb3J0PScgKyBzb3J0ICsgJyYnO1xuICAgICAgICAgICAgdmFyIHJlcSA9IHVybCArIG9wdCArIGtleTtcblxuICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiByZXEsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2U6IHsga2luZDogc3RyaW5nLCBpdGVtczogRmFtaWx5UmVjb3JkW10gfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZvbnRDYXRhbG9nKHJlc3BvbnNlLml0ZW1zKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmVycm9yKHJlcSwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSByZWNvcmRzOiBGYW1pbHlSZWNvcmRbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihyZWNvcmRzOiBGYW1pbHlSZWNvcmRbXSkge1xuXG4gICAgICAgICAgICByZWNvcmRzID0gcmVjb3Jkcy5maWx0ZXIociA9PiB0aGlzLmV4Y2x1ZGVGYW1pbGllcy5pbmRleE9mKHIuZmFtaWx5KSA8IDApO1xuXG4gICAgICAgICAgICAvLyBtYWtlIGZpbGVzIGh0dHBzXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJlY29yZCBvZiByZWNvcmRzKSB7XG4gICAgICAgICAgICAgICAgXy5mb3JPd24ocmVjb3JkLmZpbGVzLCAodmFsOiBzdHJpbmcsIGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfLnN0YXJ0c1dpdGgodmFsLCBcImh0dHA6XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmQuZmlsZXNba2V5XSA9IHZhbC5yZXBsYWNlKFwiaHR0cDpcIiwgXCJodHRwczpcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZWNvcmRzID0gcmVjb3JkcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldExpc3QobGltaXQ/OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAhIWxpbWl0XG4gICAgICAgICAgICAgICAgPyB0aGlzLnJlY29yZHMuc2xpY2UoMCwgbGltaXQpXG4gICAgICAgICAgICAgICAgOiB0aGlzLnJlY29yZHM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRDYXRlZ29yaWVzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgICAgIHJldHVybiBfLnVuaXEodGhpcy5yZWNvcmRzLm1hcChmID0+IGYuY2F0ZWdvcnkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldEZhbWlsaWVzKGNhdGVnb3J5Pzogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgICAgICAgICAgaWYgKCFjYXRlZ29yeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlY29yZHMubWFwKGYgPT4gZi5mYW1pbHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVjb3Jkc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoZiA9PiBmLmNhdGVnb3J5ID09PSBjYXRlZ29yeSlcbiAgICAgICAgICAgICAgICAubWFwKGYgPT4gZi5mYW1pbHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0VmFyaWFudHMoZmFtaWx5OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgICAgICAgICBjb25zdCBmYW0gPSB0aGlzLmdldFJlY29yZChmYW1pbHkpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbSAmJiBmYW0udmFyaWFudHMgfHwgW107XG4gICAgICAgIH1cblxuICAgICAgICBnZXRSZWNvcmQoZmFtaWx5OiBzdHJpbmcpOiBGYW1pbHlSZWNvcmQge1xuICAgICAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnJlY29yZHMsIGZmID0+IGZmLmZhbWlseSA9PT0gZmFtaWx5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFVybChmYW1pbHk6IHN0cmluZywgdmFyaWFudD86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldFJlY29yZChmYW1pbHkpO1xuICAgICAgICAgICAgaWYgKCFyZWNvcmQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJubyBkZWZpbml0aW9uIGF2YWlsYWJsZSBmb3IgZmFtaWx5XCIsIGZhbWlseSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXZhcmlhbnQpIHtcbiAgICAgICAgICAgICAgICB2YXJpYW50ID0gRm9udENhdGFsb2cuZGVmYXVsdFZhcmlhbnQocmVjb3JkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBmaWxlID0gcmVjb3JkLmZpbGVzW3ZhcmlhbnRdO1xuICAgICAgICAgICAgaWYgKCFmaWxlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwibm8gZm9udCBmaWxlIGF2YWlsYWJsZSBmb3IgdmFyaWFudFwiLCBmYW1pbHksIHZhcmlhbnQpO1xuICAgICAgICAgICAgICAgIGZpbGUgPSByZWNvcmQuZmlsZXNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBkZWZhdWx0VmFyaWFudChyZWNvcmQ6IEZhbWlseVJlY29yZCk6IHN0cmluZyB7XG4gICAgICAgICAgICBpZiAoIXJlY29yZCkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBpZiAocmVjb3JkLnZhcmlhbnRzLmluZGV4T2YoXCJyZWd1bGFyXCIpID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJyZWd1bGFyXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVjb3JkLnZhcmlhbnRzWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZvciBhIGxpc3Qgb2YgZmFtaWxpZXMsIGxvYWQgYWxwaGFudW1lcmljIGNoYXJzIGludG8gYnJvd3NlclxuICAgICAgICAgKiAgIHRvIHN1cHBvcnQgcHJldmlld2luZy5cbiAgICAgICAgICovXG4gICAgICAgIHN0YXRpYyBsb2FkUHJldmlld1N1YnNldHMoZmFtaWxpZXM6IHN0cmluZ1tdKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNodW5rIG9mIF8uY2h1bmsoZmFtaWxpZXMuZmlsdGVyKGYgPT4gISFmKSwgMTApKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgV2ViRm9udC5sb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZ2xlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFtaWxpZXM6IDxzdHJpbmdbXT5jaHVuayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIGxvYWRpbmcgZm9udCBzdWJzZXRzXCIsIGVyciwgY2h1bmspO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufSIsIlxuaW50ZXJmYWNlIENvbnNvbGUge1xuICAgIGxvZyhtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkO1xuICAgIGxvZyguLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkO1xufVxuXG5uYW1lc3BhY2UgUGFwZXJIZWxwZXJzIHtcblxuICAgIGV4cG9ydCBjb25zdCBTQUZBUklfTUFYX0NBTlZBU19BUkVBID0gNjcxMDg4NjQ7XG5cbiAgICBleHBvcnQgdmFyIHNob3VsZExvZ0luZm86IGJvb2xlYW47XG5cbiAgICBjb25zdCBsb2cgPSBmdW5jdGlvbiguLi5wYXJhbXM6IGFueVtdKSB7XG4gICAgICAgIGlmIChzaG91bGRMb2dJbmZvKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyguLi5wYXJhbXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lIHRoZSBtYXggZHBpIHRoYXQgY2FuIHN1cHBvcnRlZCBieSBDYW52YXMuXG4gICAgICogVXNpbmcgU2FmYXJpIGFzIHRoZSBtZWFzdXJlLCBiZWNhdXNlIGl0IHNlZW1zIHRvIGhhdmUgdGhlIHNtYWxsZXN0IGxpbWl0LlxuICAgICAqIE1heCBEUEkgaW4gQ2hyb21lIHByb2R1Y2VzIGFwcHJveCA4MDAweDgwMDAuXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1heEV4cG9ydERwaShpdGVtU2l6ZTogcGFwZXIuU2l6ZSl7XG4gICAgICAgIHJldHVybiBnZXRFeHBvcnREcGkoaXRlbVNpemUsIFNBRkFSSV9NQVhfQ0FOVkFTX0FSRUEpO1xuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRFeHBvcnREcGkoaXRlbVNpemU6IHBhcGVyLlNpemUsIHBpeGVsczogbnVtYmVyKXtcbiAgICAgICAgY29uc3QgaXRlbUFyZWEgPSBpdGVtU2l6ZS53aWR0aCAqIGl0ZW1TaXplLmhlaWdodDtcbiAgICAgICAgcmV0dXJuIDAuOTk5ICogTWF0aC5zcXJ0KHBpeGVscylcbiAgICAgICAgICAgICAgICAqIChwYXBlci52aWV3LnJlc29sdXRpb24pIFxuICAgICAgICAgICAgICAgIC8gIE1hdGguc3FydChpdGVtQXJlYSk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNvbnN0IGltcG9ydE9wZW5UeXBlUGF0aCA9IGZ1bmN0aW9uKG9wZW5QYXRoOiBvcGVudHlwZS5QYXRoKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgob3BlblBhdGgudG9QYXRoRGF0YSgpKTtcbiAgICAgICAgLy8gbGV0IHN2ZyA9IG9wZW5QYXRoLnRvU1ZHKDQpO1xuICAgICAgICAvLyByZXR1cm4gPHBhcGVyLlBhdGg+cGFwZXIucHJvamVjdC5pbXBvcnRTVkcoc3ZnKTtcbiAgICB9XG5cbiAgICBleHBvcnQgY29uc3QgdHJhY2VQYXRoSXRlbSA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGhJdGVtLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5QYXRoSXRlbSB7XG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNlQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY29uc3QgdHJhY2VDb21wb3VuZFBhdGggPSBmdW5jdGlvbihwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgsIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XG4gICAgICAgIGlmICghcGF0aC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwYXRocyA9IHBhdGguY2hpbGRyZW4ubWFwKHAgPT5cbiAgICAgICAgICAgIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnAsIHBvaW50c1BlclBhdGgpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgoe1xuICAgICAgICAgICAgY2hpbGRyZW46IHBhdGhzLFxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGV4cG9ydCBjb25zdCB0cmFjZVBhdGhBc1BvaW50cyA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGgsIG51bVBvaW50czogbnVtYmVyKTogcGFwZXIuUG9pbnRbXSB7XG4gICAgICAgIGxldCBwYXRoTGVuZ3RoID0gcGF0aC5sZW5ndGg7XG4gICAgICAgIGxldCBvZmZzZXRJbmNyID0gcGF0aExlbmd0aCAvIG51bVBvaW50cztcbiAgICAgICAgbGV0IHBvaW50cyA9IFtdO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xuXG4gICAgICAgIHdoaWxlIChpKysgPCBudW1Qb2ludHMpIHtcbiAgICAgICAgICAgIGxldCBwb2ludCA9IHBhdGguZ2V0UG9pbnRBdChNYXRoLm1pbihvZmZzZXQsIHBhdGhMZW5ndGgpKTtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50KTtcbiAgICAgICAgICAgIG9mZnNldCArPSBvZmZzZXRJbmNyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG5cbiAgICBleHBvcnQgY29uc3QgdHJhY2VQYXRoID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5QYXRoIHtcbiAgICAgICAgbGV0IHBvaW50cyA9IFBhcGVySGVscGVycy50cmFjZVBhdGhBc1BvaW50cyhwYXRoLCBudW1Qb2ludHMpO1xuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlBhdGgoe1xuICAgICAgICAgICAgc2VnbWVudHM6IHBvaW50cyxcbiAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNvbnN0IGR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbiA9IGZ1bmN0aW9uKHRvcFBhdGg6IHBhcGVyLkN1cnZlbGlrZSwgYm90dG9tUGF0aDogcGFwZXIuQ3VydmVsaWtlKVxuICAgICAgICA6ICh1bml0UG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCB7XG4gICAgICAgIGNvbnN0IHRvcFBhdGhMZW5ndGggPSB0b3BQYXRoLmxlbmd0aDtcbiAgICAgICAgY29uc3QgYm90dG9tUGF0aExlbmd0aCA9IGJvdHRvbVBhdGgubGVuZ3RoO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24odW5pdFBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcbiAgICAgICAgICAgIGxldCB0b3BQb2ludCA9IHRvcFBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIHRvcFBhdGhMZW5ndGgpO1xuICAgICAgICAgICAgbGV0IGJvdHRvbVBvaW50ID0gYm90dG9tUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogYm90dG9tUGF0aExlbmd0aCk7XG4gICAgICAgICAgICBpZiAodG9wUG9pbnQgPT0gbnVsbCB8fCBib3R0b21Qb2ludCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiY291bGQgbm90IGdldCBwcm9qZWN0ZWQgcG9pbnQgZm9yIHVuaXQgcG9pbnQgXCIgKyB1bml0UG9pbnQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0b3BQb2ludDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvcFBvaW50LmFkZChib3R0b21Qb2ludC5zdWJ0cmFjdCh0b3BQb2ludCkubXVsdGlwbHkodW5pdFBvaW50LnkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgbWFya2VyR3JvdXA6IHBhcGVyLkdyb3VwO1xuXG4gICAgZXhwb3J0IGNvbnN0IHJlc2V0TWFya2VycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwKSB7XG4gICAgICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgbWFya2VyR3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcbiAgICAgICAgbWFya2VyR3JvdXAub3BhY2l0eSA9IDAuMjtcblxuICAgIH1cblxuICAgIGV4cG9ydCBjb25zdCBtYXJrZXJMaW5lID0gZnVuY3Rpb24oYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50KTogcGFwZXIuSXRlbSB7XG4gICAgICAgIGxldCBsaW5lID0gcGFwZXIuUGF0aC5MaW5lKGEsIGIpO1xuICAgICAgICBsaW5lLnN0cm9rZUNvbG9yID0gJ2dyZWVuJztcbiAgICAgICAgLy9saW5lLmRhc2hBcnJheSA9IFs1LCA1XTtcbiAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLmFkZENoaWxkKGxpbmUpO1xuICAgICAgICByZXR1cm4gbGluZTtcbiAgICB9XG5cbiAgICBleHBvcnQgY29uc3QgbWFya2VyID0gZnVuY3Rpb24ocG9pbnQ6IHBhcGVyLlBvaW50LCBsYWJlbDogc3RyaW5nKTogcGFwZXIuSXRlbSB7XG4gICAgICAgIC8vbGV0IG1hcmtlciA9IHBhcGVyLlNoYXBlLkNpcmNsZShwb2ludCwgMTApO1xuICAgICAgICBsZXQgbWFya2VyID0gbmV3IHBhcGVyLlBvaW50VGV4dChwb2ludCk7XG4gICAgICAgIG1hcmtlci5mb250U2l6ZSA9IDM2O1xuICAgICAgICBtYXJrZXIuY29udGVudCA9IGxhYmVsO1xuICAgICAgICBtYXJrZXIuc3Ryb2tlQ29sb3IgPSBcInJlZFwiO1xuICAgICAgICBtYXJrZXIuYnJpbmdUb0Zyb250KCk7XG4gICAgICAgIC8vUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLmFkZENoaWxkKG1hcmtlcik7XG4gICAgICAgIHJldHVybiBtYXJrZXI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNvbnN0IHNpbXBsaWZ5ID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aEl0ZW0sIHRvbGVyYW5jZT86IG51bWJlcikge1xuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBQYXBlckhlbHBlcnMuc2ltcGxpZnkoPHBhcGVyLlBhdGhJdGVtPnAsIHRvbGVyYW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAoPHBhcGVyLlBhdGg+cGF0aCkuc2ltcGxpZnkodG9sZXJhbmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgc2VsZiBvciBuZWFyZXN0IGFuY2VzdG9yIHNhdGlzZnlpbmcgdGhlIHByZWRpY2F0ZS5cbiAgICAgKi9cbiAgICBleHBvcnQgY29uc3QgZmluZFNlbGZPckFuY2VzdG9yID0gZnVuY3Rpb24oaXRlbTogcGFwZXIuSXRlbSwgcHJlZGljYXRlOiAoaTogcGFwZXIuSXRlbSkgPT4gYm9vbGVhbikge1xuICAgICAgICBpZiAocHJlZGljYXRlKGl0ZW0pKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRBbmNlc3RvcihpdGVtLCBwcmVkaWNhdGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXG4gICAgICovXG4gICAgZXhwb3J0IGNvbnN0IGZpbmRBbmNlc3RvciA9IGZ1bmN0aW9uKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcHJpb3I6IHBhcGVyLkl0ZW07XG4gICAgICAgIGxldCBjaGVja2luZyA9IGl0ZW0ucGFyZW50O1xuICAgICAgICB3aGlsZSAoY2hlY2tpbmcgJiYgY2hlY2tpbmcgIT09IHByaW9yKSB7XG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKGNoZWNraW5nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGVja2luZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByaW9yID0gY2hlY2tpbmc7XG4gICAgICAgICAgICBjaGVja2luZyA9IGNoZWNraW5nLnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29ybmVycyBvZiB0aGUgcmVjdCwgY2xvY2t3aXNlIHN0YXJ0aW5nIGZyb20gdG9wTGVmdFxuICAgICAqL1xuICAgIGV4cG9ydCBjb25zdCBjb3JuZXJzID0gZnVuY3Rpb24ocmVjdDogcGFwZXIuUmVjdGFuZ2xlKTogcGFwZXIuUG9pbnRbXSB7XG4gICAgICAgIHJldHVybiBbcmVjdC50b3BMZWZ0LCByZWN0LnRvcFJpZ2h0LCByZWN0LmJvdHRvbVJpZ2h0LCByZWN0LmJvdHRvbUxlZnRdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRoZSBtaWRwb2ludCBiZXR3ZWVuIHR3byBwb2ludHNcbiAgICAgKi9cbiAgICBleHBvcnQgY29uc3QgbWlkcG9pbnQgPSBmdW5jdGlvbihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIGIuc3VidHJhY3QoYSkuZGl2aWRlKDIpLmFkZChhKTtcbiAgICB9XG5cbiAgICBleHBvcnQgY29uc3QgY2xvbmVTZWdtZW50ID0gZnVuY3Rpb24oc2VnbWVudDogcGFwZXIuU2VnbWVudCkge1xuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlNlZ21lbnQoc2VnbWVudC5wb2ludCwgc2VnbWVudC5oYW5kbGVJbiwgc2VnbWVudC5oYW5kbGVPdXQpO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgLSBiLCB3aGVyZSBhIGFuZCBiIGFyZSB1bml0IG9mZnNldHMgYWxvbmcgYSBjbG9zZWQgcGF0aC5cbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gcGF0aE9mZnNldExlbmd0aChzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgY2xvY2t3aXNlOiBib29sZWFuID0gdHJ1ZSl7XG4gICAgICAgIHN0YXJ0ID0gcGF0aE9mZnNldE5vcm1hbGl6ZShzdGFydCk7XG4gICAgICAgIGVuZCA9IHBhdGhPZmZzZXROb3JtYWxpemUoZW5kKTtcbiAgICAgICAgaWYoY2xvY2t3aXNlKXtcbiAgICAgICAgICAgIGlmKHN0YXJ0ID4gZW5kKSB7XG4gICAgICAgICAgICAgICAgZW5kICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGF0aE9mZnNldE5vcm1hbGl6ZShlbmQgLSBzdGFydCk7IFxuICAgICAgICB9XG4gICAgICAgIGlmKGVuZCA+IHN0YXJ0KXtcbiAgICAgICAgICAgIHN0YXJ0ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGhPZmZzZXROb3JtYWxpemUoc3RhcnQgLSBlbmQpO1xuICAgIH1cbiAgICBcbiAgICBleHBvcnQgZnVuY3Rpb24gcGF0aE9mZnNldE5vcm1hbGl6ZShvZmZzZXQ6IG51bWJlcil7XG4gICAgICAgIGlmKG9mZnNldCA8IDApe1xuICAgICAgICAgICAgb2Zmc2V0ICs9IE1hdGgucm91bmQob2Zmc2V0KSArIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9mZnNldCAlIDE7XG4gICAgfVxuICAgIFxufVxuIiwibmFtZXNwYWNlIEZvbnRTaGFwZSB7XG5cbiAgICBleHBvcnQgdHlwZSBQYXJzZWRGb250ID0ge1xuICAgICAgICB1cmw6IHN0cmluZyxcbiAgICAgICAgZm9udDogb3BlbnR5cGUuRm9udFxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQYXJzZWRGb250cyB7XG5cbiAgICAgICAgZm9udHM6IHsgW3VybDogc3RyaW5nXTogb3BlbnR5cGUuRm9udDsgfSA9IHt9O1xuXG4gICAgICAgIF9mb250TG9hZGVkOiAocGFyc2VkOiBQYXJzZWRGb250KSA9PiB2b2lkO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGZvbnRMb2FkZWQ/OiAocGFyc2VkOiBQYXJzZWRGb250KSA9PiB2b2lkKSB7XG4gICAgICAgICAgICB0aGlzLl9mb250TG9hZGVkID0gZm9udExvYWRlZCB8fCAoKCkgPT4geyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCh1cmw6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPFBhcnNlZEZvbnQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXVybCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGZvbnQgPSB0aGlzLmZvbnRzW3VybF07XG5cbiAgICAgICAgICAgICAgICBpZiAoZm9udCkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgdXJsLCBmb250IH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb3BlbnR5cGUubG9hZCh1cmwsIChlcnIsIGZvbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIsIHsgdXJsIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZvbnRzW3VybF0gPSBmb250O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7dXJsLCBmb250fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb250TG9hZGVkKHt1cmwsIGZvbnR9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBGb250U2hhcGUge1xuXG4gICAgZXhwb3J0IGNsYXNzIFBhdGhTZWN0aW9uIGltcGxlbWVudHMgcGFwZXIuQ3VydmVsaWtlIHtcbiAgICAgICAgcGF0aDogcGFwZXIuUGF0aDtcbiAgICAgICAgdW5pdFN0YXJ0OiBudW1iZXI7XG4gICAgICAgIHVuaXRMZW5ndGg6IG51bWJlcjtcbiAgICAgICAgY2xvY2t3aXNlOiBib29sZWFuO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTdGFydCBhbmQgZW5kIGFyZSB1bml0IGxlbmd0aHM6IDAgdG8gMS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKHBhdGg6IHBhcGVyLlBhdGgsIFxuICAgICAgICAgICAgdW5pdFN0YXJ0OiBudW1iZXIsIFxuICAgICAgICAgICAgdW5pdExlbmd0aDogbnVtYmVyLCBcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgICAgICAgICB0aGlzLnVuaXRTdGFydCA9IHVuaXRTdGFydDtcbiAgICAgICAgICAgIHRoaXMudW5pdExlbmd0aCA9IHVuaXRMZW5ndGg7XG4gICAgICAgICAgICB0aGlzLmNsb2Nrd2lzZSA9IGNsb2Nrd2lzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBsZW5ndGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51bml0TGVuZ3RoICogdGhpcy5wYXRoLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0gb2Zmc2V0OiBsZW5ndGggb2Zmc2V0IHJlbGF0aXZlIHRvIHRoaXMgc2VjdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGdldFBvaW50QXQob2Zmc2V0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGhMZW5ndGggPSB0aGlzLnBhdGgubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5wYXRoLmNsb2Nrd2lzZSA9PSB0aGlzLmNsb2Nrd2lzZSA/IDEgOiAtMTtcbiAgICAgICAgICAgIGxldCBwYXRoT2Zmc2V0ID0gdGhpcy51bml0U3RhcnQgKiBwYXRoTGVuZ3RoICsgb2Zmc2V0ICogZGlyZWN0aW9uO1xuICAgICAgICAgICAgaWYgKHBhdGhPZmZzZXQgPiBwYXRoTGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBwYXRoT2Zmc2V0IC09IHBhdGhMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihwYXRoT2Zmc2V0IDwgMCl7XG4gICAgICAgICAgICAgICAgcGF0aE9mZnNldCArPSBwYXRoTGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGF0aC5nZXRQb2ludEF0KHBhdGhPZmZzZXQpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIEZvbnRTaGFwZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgUGF0aFRyYW5zZm9ybSB7XG4gICAgICAgIHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludDtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQpIHtcbiAgICAgICAgICAgIHRoaXMucG9pbnRUcmFuc2Zvcm0gPSBwb2ludFRyYW5zZm9ybTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvaW50VHJhbnNmb3JtKHBvaW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyYW5zZm9ybVBhdGhJdGVtKHBhdGg6IHBhcGVyLlBhdGhJdGVtKSB7XG4gICAgICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1Db21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdHJhbnNmb3JtQ29tcG91bmRQYXRoKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCkge1xuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdHJhbnNmb3JtUGF0aChwYXRoOiBwYXBlci5QYXRoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBzZWdtZW50IG9mIHBhdGguc2VnbWVudHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgb3JpZ1BvaW50ID0gc2VnbWVudC5wb2ludDtcbiAgICAgICAgICAgICAgICBsZXQgbmV3UG9pbnQgPSB0aGlzLnRyYW5zZm9ybVBvaW50KHNlZ21lbnQucG9pbnQpO1xuICAgICAgICAgICAgICAgIG9yaWdQb2ludC54ID0gbmV3UG9pbnQueDtcbiAgICAgICAgICAgICAgICBvcmlnUG9pbnQueSA9IG5ld1BvaW50Lnk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgRm9udFNoYXBlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBTbmFwUGF0aCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcblxuICAgICAgICBwcml2YXRlIF9yZWdpb246IHBhcGVyLlBhdGg7XG4gICAgICAgIHByaXZhdGUgX2NvbnRlbnQ6IHBhcGVyLkNvbXBvdW5kUGF0aDtcbiAgICAgICAgcHJpdmF0ZSBfd2FycGVkOiBwYXBlci5Db21wb3VuZFBhdGg7XG4gICAgICAgIGNvcm5lcnM6IENvcm5lck9mZnNldHM7XG5cbiAgICAgICAgY29uc3RydWN0b3IocmVnaW9uOiBwYXBlci5QYXRoLCBjb250ZW50OiBwYXBlci5Db21wb3VuZFBhdGgpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3JlZ2lvbiA9IHJlZ2lvbjtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQgPSBjb250ZW50O1xuICAgICAgICAgICAgdGhpcy5fY29udGVudC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl93YXJwZWQgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKGNvbnRlbnQucGF0aERhdGEpO1xuICAgICAgICAgICAgdGhpcy5fd2FycGVkLmZpbGxDb2xvciA9IFwiZ3JheVwiO1xuICAgICAgICAgICAgdGhpcy5jb3JuZXJzID0gWzAsIDAuMjUsIDAuNTAsIDAuNzVdO1xuXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2NvbnRlbnQpO1xuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl93YXJwZWQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhdGgoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZVBhdGgoKSB7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50T3JpZ2luID0gdGhpcy5fY29udGVudC5ib3VuZHMudG9wTGVmdDtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRXaWR0aCA9IHRoaXMuX2NvbnRlbnQuYm91bmRzLndpZHRoO1xuICAgICAgICAgICAgY29uc3QgY29udGVudEhlaWdodCA9IHRoaXMuX2NvbnRlbnQuYm91bmRzLmhlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lvbkxlbmd0aCA9IHRoaXMuX3JlZ2lvbi5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCB0b3AgPSBuZXcgUGF0aFNlY3Rpb24oXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaW9uLCBcbiAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcnNbMF0sIFxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5wYXRoT2Zmc2V0TGVuZ3RoKHRoaXMuY29ybmVyc1swXSwgdGhpcy5jb3JuZXJzWzFdKSk7XG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSBuZXcgUGF0aFNlY3Rpb24oXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaW9uLCBcbiAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcnNbM10sXG4gICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnBhdGhPZmZzZXRMZW5ndGgodGhpcy5jb3JuZXJzWzNdLCB0aGlzLmNvcm5lcnNbMl0sIGZhbHNlKSxcbiAgICAgICAgICAgICAgICBmYWxzZSk7XG5cbiAgICAgICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLmR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbih0b3AsIGJvdHRvbSk7XG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtID0gbmV3IFBhdGhUcmFuc2Zvcm0ocG9pbnQgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghcG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChjb250ZW50T3JpZ2luKTtcbiAgICAgICAgICAgICAgICBsZXQgdW5pdCA9IG5ldyBwYXBlci5Qb2ludChcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUueCAvIGNvbnRlbnRXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIGNvbnRlbnRIZWlnaHQpO1xuICAgICAgICAgICAgICAgIGxldCBwcm9qZWN0ZWQgPSBwcm9qZWN0aW9uKHVuaXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qZWN0ZWQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgbmV3UGF0aHMgPSB0aGlzLl9jb250ZW50LmNoaWxkcmVuXG4gICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IDxwYXBlci5QYXRoPml0ZW07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhQb2ludHMgPSBQYXBlckhlbHBlcnMudHJhY2VQYXRoQXNQb2ludHMocGF0aCwgMTAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChwID0+IHRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludChwKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhQYXRoID0gbmV3IHBhcGVyLlBhdGgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IHhQb2ludHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvL3hQYXRoLnJlZHVjZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geFBhdGg7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5yZW1vdmVDaGlsZHJlbigpO1xuICAgICAgICAgICAgdGhpcy5fd2FycGVkLmFkZENoaWxkcmVuKG5ld1BhdGhzKTtcblxuICAgICAgIH1cblxuICAgICAgIC8qKlxuICAgICAgICAqIFNsaWRlIG9mZnNldCBwb2ludHMgYnkgdGhlIGdpdmVuIGFtb3VudC5cbiAgICAgICAgKiBAcGFyYW0gdW5pdE9mZnNldDogdmFsdWUgMCB0byAxXG4gICAgICAgICovXG4gICAgICAgc2xpZGUodW5pdE9mZnNldDogbnVtYmVyKXtcbiAgICAgICAgICAgdGhpcy5jb3JuZXJzID0gPENvcm5lck9mZnNldHM+dGhpcy5jb3JuZXJzLm1hcChcbiAgICAgICAgICAgICAgICBjID0+IFNuYXBQYXRoLmluY3JlbWVudE9mZnNldChjLCB1bml0T2Zmc2V0KSk7IFxuICAgICAgIH1cblxuICAgICAgIHByaXZhdGUgc3RhdGljIGluY3JlbWVudE9mZnNldChvZmZzZXQ6IG51bWJlciwgZGVsdGE6IG51bWJlcil7XG4gICAgICAgICAgIGxldCByZXN1bHQgPSBvZmZzZXQgKyBkZWx0YTtcbiAgICAgICAgICAgaWYocmVzdWx0IDwgMCl7XG4gICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyBNYXRoLnJvdW5kKHJlc3VsdCkgKyAxO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCAlIDE7XG4gICAgICAgICAgIC8vY29uc29sZS5sb2coYCR7b2Zmc2V0fSArICR7ZGVsdGF9ID0+ICR7cmVzdWx0fWApO1xuICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhdGggb2Zmc2V0cyBvbiByZWdpb24gZm9yIGNvcm5lcnMgb2YgU25hcFBhdGggY29udGVudCwgXG4gICAgICogICBzdGFydGluZyB3aXRoIHRvcExlZnQgYW5kIHByb2NlZWRpbmcgY2xvY2t3aXNlXG4gICAgICogICB0byBib3R0b21MZWZ0LiBcbiAgICAgKi9cbiAgICBleHBvcnQgdHlwZSBDb3JuZXJPZmZzZXRzID0gW1xuICAgICAgICBudW1iZXIsIC8vIHRvcExlZnRcbiAgICAgICAgbnVtYmVyLCAvLyB0b3BSaWdodFxuICAgICAgICBudW1iZXIsIC8vIGJvdHRvbVJpZ2h0XG4gICAgICAgIG51bWJlciAgLy8gYm90dG9tTGVmdFxuICAgIF1cblxufSIsIm5hbWVzcGFjZSBGb250U2hhcGUge1xuXG4gICAgZXhwb3J0IGNsYXNzIFZlcnRpY2FsQm91bmRzU3RyZXRjaFBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XG4gICAgICAgIHN0YXRpYyBwb2ludHNQZXJQYXRoID0gMjAwO1xuXG4gICAgICAgIHByaXZhdGUgX2JvdW5kYXJpZXM6IFZlcnRpY2FsQm91bmRzO1xuICAgICAgICBwcml2YXRlIF9jb250ZW50OiBwYXBlci5Db21wb3VuZFBhdGg7XG4gICAgICAgIHByaXZhdGUgX3dhcnBlZDogcGFwZXIuQ29tcG91bmRQYXRoO1xuICAgICAgICBjb3JuZXJzOiBDb3JuZXJPZmZzZXRzO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgY29udGVudDogcGFwZXIuQ29tcG91bmRQYXRoLFxuICAgICAgICAgICAgYm91bmRhcmllcz86IFZlcnRpY2FsQm91bmRzXG4gICAgICAgICkge1xuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5fY29udGVudCA9IGNvbnRlbnQ7XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50LnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX2JvdW5kYXJpZXMgPSBib3VuZGFyaWVzIHx8XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB1cHBlcjogbmV3IHBhcGVyLlBhdGgoW2NvbnRlbnQuYm91bmRzLnRvcExlZnQsIGNvbnRlbnQuYm91bmRzLnRvcFJpZ2h0XSksXG4gICAgICAgICAgICAgICAgICAgIGxvd2VyOiBuZXcgcGFwZXIuUGF0aChbY29udGVudC5ib3VuZHMuYm90dG9tTGVmdCwgY29udGVudC5ib3VuZHMuYm90dG9tUmlnaHRdKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl93YXJwZWQgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKGNvbnRlbnQucGF0aERhdGEpO1xuICAgICAgICAgICAgdGhpcy5fd2FycGVkLmZpbGxDb2xvciA9IFwibGlnaHRncmF5XCI7XG5cbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fY29udGVudCk7XG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3dhcnBlZCk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGF0aCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlUGF0aCgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRPcmlnaW4gPSB0aGlzLl9jb250ZW50LmJvdW5kcy50b3BMZWZ0O1xuICAgICAgICAgICAgY29uc3QgY29udGVudFdpZHRoID0gdGhpcy5fY29udGVudC5ib3VuZHMud2lkdGg7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50SGVpZ2h0ID0gdGhpcy5fY29udGVudC5ib3VuZHMuaGVpZ2h0O1xuICAgICAgICAgICAgbGV0IHByb2plY3Rpb24gPSBQYXBlckhlbHBlcnMuZHVhbEJvdW5kc1BhdGhQcm9qZWN0aW9uKFxuICAgICAgICAgICAgICAgIHRoaXMuX2JvdW5kYXJpZXMudXBwZXIsIHRoaXMuX2JvdW5kYXJpZXMubG93ZXIpO1xuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXBvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwb2ludDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHJlbGF0aXZlID0gcG9pbnQuc3VidHJhY3QoY29udGVudE9yaWdpbik7XG4gICAgICAgICAgICAgICAgbGV0IHVuaXQgPSBuZXcgcGFwZXIuUG9pbnQoXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBjb250ZW50V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnkgLyBjb250ZW50SGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBsZXQgcHJvamVjdGVkID0gcHJvamVjdGlvbih1bml0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhzID0gdGhpcy5fY29udGVudC5jaGlsZHJlblxuICAgICAgICAgICAgICAgIC5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSA8cGFwZXIuUGF0aD5pdGVtO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4UG9pbnRzID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEFzUG9pbnRzKHBhdGgsIFZlcnRpY2FsQm91bmRzU3RyZXRjaFBhdGgucG9pbnRzUGVyUGF0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAocCA9PiB0cmFuc2Zvcm0udHJhbnNmb3JtUG9pbnQocCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4UGF0aCA9IG5ldyBwYXBlci5QYXRoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy94UGF0aC5yZWR1Y2UoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHhQYXRoO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5hZGRDaGlsZHJlbihuZXdQYXRocyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJcbm5hbWVzcGFjZSBGb250U2hhcGUge1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBWZXJ0aWNhbEJvdW5kcyB7XG4gICAgICAgIHVwcGVyOiBwYXBlci5QYXRoO1xuICAgICAgICBsb3dlcjogcGFwZXIuUGF0aDtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEZvbnRTcGVjaWZpZXIge1xuICAgICAgICBmYW1pbHk6IHN0cmluZztcbiAgICAgICAgdmFyaWFudD86IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEZhbWlseVJlY29yZCB7XG4gICAgICAgIGtpbmQ/OiBzdHJpbmc7XG4gICAgICAgIGZhbWlseT86IHN0cmluZztcbiAgICAgICAgY2F0ZWdvcnk/OiBzdHJpbmc7XG4gICAgICAgIHZhcmlhbnRzPzogc3RyaW5nW107XG4gICAgICAgIHN1YnNldHM/OiBzdHJpbmdbXTtcbiAgICAgICAgdmVyc2lvbj86IHN0cmluZztcbiAgICAgICAgbGFzdE1vZGlmaWVkPzogc3RyaW5nO1xuICAgICAgICBmaWxlcz86IHsgW3ZhcmlhbnQ6IHN0cmluZ106IHN0cmluZzsgfTtcbiAgICB9XG5cbn0iXX0=