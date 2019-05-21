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
            enumerable: true,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9wYXBlci1leHQudHMiLCIuLi9zcmMvRm9udENhdGFsb2cudHMiLCIuLi9zcmMvUGFwZXJIZWxwZXJzLnRzIiwiLi4vc3JjL1BhcnNlZEZvbnRzLnRzIiwiLi4vc3JjL1BhdGhTZWN0aW9uLnRzIiwiLi4vc3JjL1BhdGhUcmFuc2Zvcm0udHMiLCIuLi9zcmMvU25hcFBhdGgudHMiLCIuLi9zcmMvVmVydGljYWxCb3VuZHNTdHJldGNoUGF0aC50cyIsIi4uL3NyYy9tb2RlbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQ0FBLElBQVUsU0FBUyxDQW9JbEI7QUFwSUQsV0FBVSxTQUFTO0lBRWY7UUF1Q0kscUJBQVksT0FBdUI7WUFBbkMsaUJBY0M7WUFuREQseUNBQXlDO1lBQ3pDLG9CQUFlLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBc0MvQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQTFDLENBQTBDLENBQUMsQ0FBQztvQ0FHL0QsTUFBTTtnQkFDYixDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBQyxHQUFXLEVBQUUsR0FBVztvQkFDNUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBRTt3QkFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztxQkFDdEQ7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBUEQsbUJBQW1CO1lBQ25CLEtBQXFCLFVBQU8sRUFBUCxtQkFBTyxFQUFQ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QUFPLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQTlETSx1Q0FBYSxHQUFHLEdBQUcsQ0FBQztRQStEL0IsZ0NBQUM7S0FBQSxBQWhFRCxDQUErQyxLQUFLLENBQUMsS0FBSyxHQWdFekQ7SUFoRVksbUNBQXlCLDRCQWdFckMsQ0FBQTtBQUVMLENBQUMsRUFwRVMsU0FBUyxLQUFULFNBQVMsUUFvRWxCIiwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xuXG4gICAgaW50ZXJmYWNlIEN1cnZlbGlrZSB7XG4gICAgICAgIGxlbmd0aDogbnVtYmVyO1xuICAgICAgICBnZXRQb2ludEF0KG9mZnNldDogbnVtYmVyKTogcGFwZXIuUG9pbnQ7XG4gICAgfVxuICAgIFxufSIsIm5hbWVzcGFjZSBGb250U2hhcGUge1xuXG4gICAgZXhwb3J0IGNsYXNzIEZvbnRDYXRhbG9nIHtcblxuICAgICAgICAvLyBFbmNvdW50ZXJlZCBpc3N1ZXMgd2l0aCB0aGVzZSBmYW1pbGllc1xuICAgICAgICBleGNsdWRlRmFtaWxpZXMgPSBbXCJBbnRvblwiLCBcIkFyaW1vXCIsIFwiU2xhYm8gMjdweFwiXTtcblxuICAgICAgICBzdGF0aWMgZnJvbUxvY2FsKHBhdGg6IHN0cmluZyk6IEpRdWVyeVByb21pc2U8Rm9udENhdGFsb2c+IHtcbiAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogcGF0aCxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZTogeyBraW5kOiBzdHJpbmcsIGl0ZW1zOiBGYW1pbHlSZWNvcmRbXSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRm9udENhdGFsb2cocmVzcG9uc2UuaXRlbXMpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUuZXJyb3IocGF0aCwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGZyb21SZW1vdGUoKTogSlF1ZXJ5UHJvbWlzZTxGb250Q2F0YWxvZz4ge1xuICAgICAgICAgICAgdmFyIHVybCA9ICdodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS93ZWJmb250cy92MS93ZWJmb250cz8nO1xuICAgICAgICAgICAgdmFyIGtleSA9ICdrZXk9R09PR0xFLUFQSS1LRVknO1xuICAgICAgICAgICAgdmFyIHNvcnQgPSBcInBvcHVsYXJpdHlcIjtcbiAgICAgICAgICAgIHZhciBvcHQgPSAnc29ydD0nICsgc29ydCArICcmJztcbiAgICAgICAgICAgIHZhciByZXEgPSB1cmwgKyBvcHQgKyBrZXk7XG5cbiAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogcmVxLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlOiB7IGtpbmQ6IHN0cmluZywgaXRlbXM6IEZhbWlseVJlY29yZFtdIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGb250Q2F0YWxvZyhyZXNwb25zZS5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5lcnJvcihyZXEsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgcmVjb3JkczogRmFtaWx5UmVjb3JkW107XG5cbiAgICAgICAgY29uc3RydWN0b3IocmVjb3JkczogRmFtaWx5UmVjb3JkW10pIHtcblxuICAgICAgICAgICAgcmVjb3JkcyA9IHJlY29yZHMuZmlsdGVyKHIgPT4gdGhpcy5leGNsdWRlRmFtaWxpZXMuaW5kZXhPZihyLmZhbWlseSkgPCAwKTtcblxuICAgICAgICAgICAgLy8gbWFrZSBmaWxlcyBodHRwc1xuICAgICAgICAgICAgZm9yIChjb25zdCByZWNvcmQgb2YgcmVjb3Jkcykge1xuICAgICAgICAgICAgICAgIF8uZm9yT3duKHJlY29yZC5maWxlcywgKHZhbDogc3RyaW5nLCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXy5zdGFydHNXaXRoKHZhbCwgXCJodHRwOlwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkLmZpbGVzW2tleV0gPSB2YWwucmVwbGFjZShcImh0dHA6XCIsIFwiaHR0cHM6XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVjb3JkcyA9IHJlY29yZHM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRMaXN0KGxpbWl0PzogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gISFsaW1pdFxuICAgICAgICAgICAgICAgID8gdGhpcy5yZWNvcmRzLnNsaWNlKDAsIGxpbWl0KVxuICAgICAgICAgICAgICAgIDogdGhpcy5yZWNvcmRzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0Q2F0ZWdvcmllcygpOiBzdHJpbmdbXSB7XG4gICAgICAgICAgICByZXR1cm4gXy51bmlxKHRoaXMucmVjb3Jkcy5tYXAoZiA9PiBmLmNhdGVnb3J5KSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRGYW1pbGllcyhjYXRlZ29yeT86IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICAgICAgICAgIGlmICghY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZWNvcmRzLm1hcChmID0+IGYuZmFtaWx5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlY29yZHNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGYgPT4gZi5jYXRlZ29yeSA9PT0gY2F0ZWdvcnkpXG4gICAgICAgICAgICAgICAgLm1hcChmID0+IGYuZmFtaWx5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFZhcmlhbnRzKGZhbWlseTogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgICAgICAgICAgY29uc3QgZmFtID0gdGhpcy5nZXRSZWNvcmQoZmFtaWx5KTtcbiAgICAgICAgICAgIHJldHVybiBmYW0gJiYgZmFtLnZhcmlhbnRzIHx8IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0UmVjb3JkKGZhbWlseTogc3RyaW5nKTogRmFtaWx5UmVjb3JkIHtcbiAgICAgICAgICAgIHJldHVybiBfLmZpbmQodGhpcy5yZWNvcmRzLCBmZiA9PiBmZi5mYW1pbHkgPT09IGZhbWlseSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRVcmwoZmFtaWx5OiBzdHJpbmcsIHZhcmlhbnQ/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXRSZWNvcmQoZmFtaWx5KTtcbiAgICAgICAgICAgIGlmICghcmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwibm8gZGVmaW5pdGlvbiBhdmFpbGFibGUgZm9yIGZhbWlseVwiLCBmYW1pbHkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF2YXJpYW50KSB7XG4gICAgICAgICAgICAgICAgdmFyaWFudCA9IEZvbnRDYXRhbG9nLmRlZmF1bHRWYXJpYW50KHJlY29yZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZmlsZSA9IHJlY29yZC5maWxlc1t2YXJpYW50XTtcbiAgICAgICAgICAgIGlmICghZmlsZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIm5vIGZvbnQgZmlsZSBhdmFpbGFibGUgZm9yIHZhcmlhbnRcIiwgZmFtaWx5LCB2YXJpYW50KTtcbiAgICAgICAgICAgICAgICBmaWxlID0gcmVjb3JkLmZpbGVzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZGVmYXVsdFZhcmlhbnQocmVjb3JkOiBGYW1pbHlSZWNvcmQpOiBzdHJpbmcge1xuICAgICAgICAgICAgaWYgKCFyZWNvcmQpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgaWYgKHJlY29yZC52YXJpYW50cy5pbmRleE9mKFwicmVndWxhclwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwicmVndWxhclwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlY29yZC52YXJpYW50c1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGb3IgYSBsaXN0IG9mIGZhbWlsaWVzLCBsb2FkIGFscGhhbnVtZXJpYyBjaGFycyBpbnRvIGJyb3dzZXJcbiAgICAgICAgICogICB0byBzdXBwb3J0IHByZXZpZXdpbmcuXG4gICAgICAgICAqL1xuICAgICAgICBzdGF0aWMgbG9hZFByZXZpZXdTdWJzZXRzKGZhbWlsaWVzOiBzdHJpbmdbXSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaHVuayBvZiBfLmNodW5rKGZhbWlsaWVzLmZpbHRlcihmID0+ICEhZiksIDEwKSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIFdlYkZvbnQubG9hZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2dsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbWlsaWVzOiA8c3RyaW5nW10+Y2h1bmssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciBsb2FkaW5nIGZvbnQgc3Vic2V0c1wiLCBlcnIsIGNodW5rKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJcbmludGVyZmFjZSBDb25zb2xlIHtcbiAgICBsb2cobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZDtcbiAgICBsb2coLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZDtcbn1cblxubmFtZXNwYWNlIFBhcGVySGVscGVycyB7XG5cbiAgICBleHBvcnQgY29uc3QgU0FGQVJJX01BWF9DQU5WQVNfQVJFQSA9IDY3MTA4ODY0O1xuXG4gICAgZXhwb3J0IHZhciBzaG91bGRMb2dJbmZvOiBib29sZWFuO1xuXG4gICAgY29uc3QgbG9nID0gZnVuY3Rpb24oLi4ucGFyYW1zOiBhbnlbXSkge1xuICAgICAgICBpZiAoc2hvdWxkTG9nSW5mbykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coLi4ucGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERldGVybWluZSB0aGUgbWF4IGRwaSB0aGF0IGNhbiBzdXBwb3J0ZWQgYnkgQ2FudmFzLlxuICAgICAqIFVzaW5nIFNhZmFyaSBhcyB0aGUgbWVhc3VyZSwgYmVjYXVzZSBpdCBzZWVtcyB0byBoYXZlIHRoZSBzbWFsbGVzdCBsaW1pdC5cbiAgICAgKiBNYXggRFBJIGluIENocm9tZSBwcm9kdWNlcyBhcHByb3ggODAwMHg4MDAwLlxuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNYXhFeHBvcnREcGkoaXRlbVNpemU6IHBhcGVyLlNpemUpe1xuICAgICAgICByZXR1cm4gZ2V0RXhwb3J0RHBpKGl0ZW1TaXplLCBTQUZBUklfTUFYX0NBTlZBU19BUkVBKTtcbiAgICB9XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0RXhwb3J0RHBpKGl0ZW1TaXplOiBwYXBlci5TaXplLCBwaXhlbHM6IG51bWJlcil7XG4gICAgICAgIGNvbnN0IGl0ZW1BcmVhID0gaXRlbVNpemUud2lkdGggKiBpdGVtU2l6ZS5oZWlnaHQ7XG4gICAgICAgIHJldHVybiAwLjk5OSAqIE1hdGguc3FydChwaXhlbHMpXG4gICAgICAgICAgICAgICAgKiAocGFwZXIudmlldy5yZXNvbHV0aW9uKSBcbiAgICAgICAgICAgICAgICAvICBNYXRoLnNxcnQoaXRlbUFyZWEpO1xuICAgIH1cblxuICAgIGV4cG9ydCBjb25zdCBpbXBvcnRPcGVuVHlwZVBhdGggPSBmdW5jdGlvbihvcGVuUGF0aDogb3BlbnR5cGUuUGF0aCk6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKG9wZW5QYXRoLnRvUGF0aERhdGEoKSk7XG4gICAgICAgIC8vIGxldCBzdmcgPSBvcGVuUGF0aC50b1NWRyg0KTtcbiAgICAgICAgLy8gcmV0dXJuIDxwYXBlci5QYXRoPnBhcGVyLnByb2plY3QuaW1wb3J0U1ZHKHN2Zyk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlUGF0aEl0ZW0gPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoSXRlbSwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuUGF0aEl0ZW0ge1xuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlQ29tcG91bmRQYXRoID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5Db21wb3VuZFBhdGgge1xuICAgICAgICBpZiAoIXBhdGguY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcGF0aHMgPSBwYXRoLmNoaWxkcmVuLm1hcChwID0+XG4gICAgICAgICAgICB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wLCBwb2ludHNQZXJQYXRoKSk7XG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHtcbiAgICAgICAgICAgIGNoaWxkcmVuOiBwYXRocyxcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBleHBvcnQgY29uc3QgdHJhY2VQYXRoQXNQb2ludHMgPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoLCBudW1Qb2ludHM6IG51bWJlcik6IHBhcGVyLlBvaW50W10ge1xuICAgICAgICBsZXQgcGF0aExlbmd0aCA9IHBhdGgubGVuZ3RoO1xuICAgICAgICBsZXQgb2Zmc2V0SW5jciA9IHBhdGhMZW5ndGggLyBudW1Qb2ludHM7XG4gICAgICAgIGxldCBwb2ludHMgPSBbXTtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgICAgICB3aGlsZSAoaSsrIDwgbnVtUG9pbnRzKSB7XG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBwYXRoLmdldFBvaW50QXQoTWF0aC5taW4ob2Zmc2V0LCBwYXRoTGVuZ3RoKSk7XG4gICAgICAgICAgICBwb2ludHMucHVzaChwb2ludCk7XG4gICAgICAgICAgICBvZmZzZXQgKz0gb2Zmc2V0SW5jcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlUGF0aCA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGgsIG51bVBvaW50czogbnVtYmVyKTogcGFwZXIuUGF0aCB7XG4gICAgICAgIGxldCBwb2ludHMgPSBQYXBlckhlbHBlcnMudHJhY2VQYXRoQXNQb2ludHMocGF0aCwgbnVtUG9pbnRzKTtcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5QYXRoKHtcbiAgICAgICAgICAgIHNlZ21lbnRzOiBwb2ludHMsXG4gICAgICAgICAgICBjbG9zZWQ6IHRydWUsXG4gICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGV4cG9ydCBjb25zdCBkdWFsQm91bmRzUGF0aFByb2plY3Rpb24gPSBmdW5jdGlvbih0b3BQYXRoOiBwYXBlci5DdXJ2ZWxpa2UsIGJvdHRvbVBhdGg6IHBhcGVyLkN1cnZlbGlrZSlcbiAgICAgICAgOiAodW5pdFBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQge1xuICAgICAgICBjb25zdCB0b3BQYXRoTGVuZ3RoID0gdG9wUGF0aC5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGJvdHRvbVBhdGhMZW5ndGggPSBib3R0b21QYXRoLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XG4gICAgICAgICAgICBsZXQgdG9wUG9pbnQgPSB0b3BQYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiB0b3BQYXRoTGVuZ3RoKTtcbiAgICAgICAgICAgIGxldCBib3R0b21Qb2ludCA9IGJvdHRvbVBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIGJvdHRvbVBhdGhMZW5ndGgpO1xuICAgICAgICAgICAgaWYgKHRvcFBvaW50ID09IG51bGwgfHwgYm90dG9tUG9pbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImNvdWxkIG5vdCBnZXQgcHJvamVjdGVkIHBvaW50IGZvciB1bml0IHBvaW50IFwiICsgdW5pdFBvaW50KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9wUG9pbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0b3BQb2ludC5hZGQoYm90dG9tUG9pbnQuc3VidHJhY3QodG9wUG9pbnQpLm11bHRpcGx5KHVuaXRQb2ludC55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IG1hcmtlckdyb3VwOiBwYXBlci5Hcm91cDtcblxuICAgIGV4cG9ydCBjb25zdCByZXNldE1hcmtlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKFBhcGVySGVscGVycy5tYXJrZXJHcm91cCkge1xuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIG1hcmtlckdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XG4gICAgICAgIG1hcmtlckdyb3VwLm9wYWNpdHkgPSAwLjI7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY29uc3QgbWFya2VyTGluZSA9IGZ1bmN0aW9uKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCk6IHBhcGVyLkl0ZW0ge1xuICAgICAgICBsZXQgbGluZSA9IHBhcGVyLlBhdGguTGluZShhLCBiKTtcbiAgICAgICAgbGluZS5zdHJva2VDb2xvciA9ICdncmVlbic7XG4gICAgICAgIC8vbGluZS5kYXNoQXJyYXkgPSBbNSwgNV07XG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChsaW5lKTtcbiAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNvbnN0IG1hcmtlciA9IGZ1bmN0aW9uKHBvaW50OiBwYXBlci5Qb2ludCwgbGFiZWw6IHN0cmluZyk6IHBhcGVyLkl0ZW0ge1xuICAgICAgICAvL2xldCBtYXJrZXIgPSBwYXBlci5TaGFwZS5DaXJjbGUocG9pbnQsIDEwKTtcbiAgICAgICAgbGV0IG1hcmtlciA9IG5ldyBwYXBlci5Qb2ludFRleHQocG9pbnQpO1xuICAgICAgICBtYXJrZXIuZm9udFNpemUgPSAzNjtcbiAgICAgICAgbWFya2VyLmNvbnRlbnQgPSBsYWJlbDtcbiAgICAgICAgbWFya2VyLnN0cm9rZUNvbG9yID0gXCJyZWRcIjtcbiAgICAgICAgbWFya2VyLmJyaW5nVG9Gcm9udCgpO1xuICAgICAgICAvL1BhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChtYXJrZXIpO1xuICAgICAgICByZXR1cm4gbWFya2VyO1xuICAgIH1cblxuICAgIGV4cG9ydCBjb25zdCBzaW1wbGlmeSA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGhJdGVtLCB0b2xlcmFuY2U/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNpbXBsaWZ5KDxwYXBlci5QYXRoSXRlbT5wLCB0b2xlcmFuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgKDxwYXBlci5QYXRoPnBhdGgpLnNpbXBsaWZ5KHRvbGVyYW5jZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIHNlbGYgb3IgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXG4gICAgICovXG4gICAgZXhwb3J0IGNvbnN0IGZpbmRTZWxmT3JBbmNlc3RvciA9IGZ1bmN0aW9uKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZShpdGVtKSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kQW5jZXN0b3IoaXRlbSwgcHJlZGljYXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxuICAgICAqL1xuICAgIGV4cG9ydCBjb25zdCBmaW5kQW5jZXN0b3IgPSBmdW5jdGlvbihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKSB7XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHByaW9yOiBwYXBlci5JdGVtO1xuICAgICAgICBsZXQgY2hlY2tpbmcgPSBpdGVtLnBhcmVudDtcbiAgICAgICAgd2hpbGUgKGNoZWNraW5nICYmIGNoZWNraW5nICE9PSBwcmlvcikge1xuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShjaGVja2luZykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hlY2tpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmlvciA9IGNoZWNraW5nO1xuICAgICAgICAgICAgY2hlY2tpbmcgPSBjaGVja2luZy5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGNvcm5lcnMgb2YgdGhlIHJlY3QsIGNsb2Nrd2lzZSBzdGFydGluZyBmcm9tIHRvcExlZnRcbiAgICAgKi9cbiAgICBleHBvcnQgY29uc3QgY29ybmVycyA9IGZ1bmN0aW9uKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSk6IHBhcGVyLlBvaW50W10ge1xuICAgICAgICByZXR1cm4gW3JlY3QudG9wTGVmdCwgcmVjdC50b3BSaWdodCwgcmVjdC5ib3R0b21SaWdodCwgcmVjdC5ib3R0b21MZWZ0XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGUgbWlkcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzXG4gICAgICovXG4gICAgZXhwb3J0IGNvbnN0IG1pZHBvaW50ID0gZnVuY3Rpb24oYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50KSB7XG4gICAgICAgIHJldHVybiBiLnN1YnRyYWN0KGEpLmRpdmlkZSgyKS5hZGQoYSk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNvbnN0IGNsb25lU2VnbWVudCA9IGZ1bmN0aW9uKHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KHNlZ21lbnQucG9pbnQsIHNlZ21lbnQuaGFuZGxlSW4sIHNlZ21lbnQuaGFuZGxlT3V0KTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIC0gYiwgd2hlcmUgYSBhbmQgYiBhcmUgdW5pdCBvZmZzZXRzIGFsb25nIGEgY2xvc2VkIHBhdGguXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHBhdGhPZmZzZXRMZW5ndGgoc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGNsb2Nrd2lzZTogYm9vbGVhbiA9IHRydWUpe1xuICAgICAgICBzdGFydCA9IHBhdGhPZmZzZXROb3JtYWxpemUoc3RhcnQpO1xuICAgICAgICBlbmQgPSBwYXRoT2Zmc2V0Tm9ybWFsaXplKGVuZCk7XG4gICAgICAgIGlmKGNsb2Nrd2lzZSl7XG4gICAgICAgICAgICBpZihzdGFydCA+IGVuZCkge1xuICAgICAgICAgICAgICAgIGVuZCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHBhdGhPZmZzZXROb3JtYWxpemUoZW5kIC0gc3RhcnQpOyBcbiAgICAgICAgfVxuICAgICAgICBpZihlbmQgPiBzdGFydCl7XG4gICAgICAgICAgICBzdGFydCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXRoT2Zmc2V0Tm9ybWFsaXplKHN0YXJ0IC0gZW5kKTtcbiAgICB9XG4gICAgXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHBhdGhPZmZzZXROb3JtYWxpemUob2Zmc2V0OiBudW1iZXIpe1xuICAgICAgICBpZihvZmZzZXQgPCAwKXtcbiAgICAgICAgICAgIG9mZnNldCArPSBNYXRoLnJvdW5kKG9mZnNldCkgKyAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvZmZzZXQgJSAxO1xuICAgIH1cbiAgICBcbn1cbiIsIm5hbWVzcGFjZSBGb250U2hhcGUge1xuXG4gICAgZXhwb3J0IHR5cGUgUGFyc2VkRm9udCA9IHtcbiAgICAgICAgdXJsOiBzdHJpbmcsXG4gICAgICAgIGZvbnQ6IG9wZW50eXBlLkZvbnRcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUGFyc2VkRm9udHMge1xuXG4gICAgICAgIGZvbnRzOiB7IFt1cmw6IHN0cmluZ106IG9wZW50eXBlLkZvbnQ7IH0gPSB7fTtcblxuICAgICAgICBfZm9udExvYWRlZDogKHBhcnNlZDogUGFyc2VkRm9udCkgPT4gdm9pZDtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihmb250TG9hZGVkPzogKHBhcnNlZDogUGFyc2VkRm9udCkgPT4gdm9pZCkge1xuICAgICAgICAgICAgdGhpcy5fZm9udExvYWRlZCA9IGZvbnRMb2FkZWQgfHwgKCgpID0+IHsgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxQYXJzZWRGb250PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBmb250ID0gdGhpcy5mb250c1t1cmxdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHVybCwgZm9udCB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9wZW50eXBlLmxvYWQodXJsLCAoZXJyLCBmb250KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLCB7IHVybCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mb250c1t1cmxdID0gZm9udDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe3VybCwgZm9udH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9udExvYWRlZCh7dXJsLCBmb250fSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJuYW1lc3BhY2UgRm9udFNoYXBlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBQYXRoU2VjdGlvbiBpbXBsZW1lbnRzIHBhcGVyLkN1cnZlbGlrZSB7XG4gICAgICAgIHBhdGg6IHBhcGVyLlBhdGg7XG4gICAgICAgIHVuaXRTdGFydDogbnVtYmVyO1xuICAgICAgICB1bml0TGVuZ3RoOiBudW1iZXI7XG4gICAgICAgIGNsb2Nrd2lzZTogYm9vbGVhbjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU3RhcnQgYW5kIGVuZCBhcmUgdW5pdCBsZW5ndGhzOiAwIHRvIDEuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcihwYXRoOiBwYXBlci5QYXRoLCBcbiAgICAgICAgICAgIHVuaXRTdGFydDogbnVtYmVyLCBcbiAgICAgICAgICAgIHVuaXRMZW5ndGg6IG51bWJlciwgXG4gICAgICAgICAgICBjbG9ja3dpc2U6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgICAgICAgICAgdGhpcy51bml0U3RhcnQgPSB1bml0U3RhcnQ7XG4gICAgICAgICAgICB0aGlzLnVuaXRMZW5ndGggPSB1bml0TGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5jbG9ja3dpc2UgPSBjbG9ja3dpc2U7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgbGVuZ3RoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudW5pdExlbmd0aCAqIHRoaXMucGF0aC5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIG9mZnNldDogbGVuZ3RoIG9mZnNldCByZWxhdGl2ZSB0byB0aGlzIHNlY3Rpb24uXG4gICAgICAgICAqL1xuICAgICAgICBnZXRQb2ludEF0KG9mZnNldDogbnVtYmVyKSB7XG4gICAgICAgICAgICBjb25zdCBwYXRoTGVuZ3RoID0gdGhpcy5wYXRoLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMucGF0aC5jbG9ja3dpc2UgPT0gdGhpcy5jbG9ja3dpc2UgPyAxIDogLTE7XG4gICAgICAgICAgICBsZXQgcGF0aE9mZnNldCA9IHRoaXMudW5pdFN0YXJ0ICogcGF0aExlbmd0aCArIG9mZnNldCAqIGRpcmVjdGlvbjtcbiAgICAgICAgICAgIGlmIChwYXRoT2Zmc2V0ID4gcGF0aExlbmd0aCl7XG4gICAgICAgICAgICAgICAgcGF0aE9mZnNldCAtPSBwYXRoTGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYocGF0aE9mZnNldCA8IDApe1xuICAgICAgICAgICAgICAgIHBhdGhPZmZzZXQgKz0gcGF0aExlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhdGguZ2V0UG9pbnRBdChwYXRoT2Zmc2V0KTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsIm5hbWVzcGFjZSBGb250U2hhcGUge1xuXG4gICAgZXhwb3J0IGNsYXNzIFBhdGhUcmFuc2Zvcm0ge1xuICAgICAgICBwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQ7XG5cbiAgICAgICAgY29uc3RydWN0b3IocG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50KSB7XG4gICAgICAgICAgICB0aGlzLnBvaW50VHJhbnNmb3JtID0gcG9pbnRUcmFuc2Zvcm07XG4gICAgICAgIH1cblxuICAgICAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb2ludFRyYW5zZm9ybShwb2ludCk7XG4gICAgICAgIH1cblxuICAgICAgICB0cmFuc2Zvcm1QYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSkge1xuICAgICAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRyYW5zZm9ybUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUGF0aCg8cGFwZXIuUGF0aD5wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRyYW5zZm9ybVBhdGgocGF0aDogcGFwZXIuUGF0aCkge1xuICAgICAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiBwYXRoLnNlZ21lbnRzKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9yaWdQb2ludCA9IHNlZ21lbnQucG9pbnQ7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1BvaW50ID0gdGhpcy50cmFuc2Zvcm1Qb2ludChzZWdtZW50LnBvaW50KTtcbiAgICAgICAgICAgICAgICBvcmlnUG9pbnQueCA9IG5ld1BvaW50Lng7XG4gICAgICAgICAgICAgICAgb3JpZ1BvaW50LnkgPSBuZXdQb2ludC55O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59IiwibmFtZXNwYWNlIEZvbnRTaGFwZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgU25hcFBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVnaW9uOiBwYXBlci5QYXRoO1xuICAgICAgICBwcml2YXRlIF9jb250ZW50OiBwYXBlci5Db21wb3VuZFBhdGg7XG4gICAgICAgIHByaXZhdGUgX3dhcnBlZDogcGFwZXIuQ29tcG91bmRQYXRoO1xuICAgICAgICBjb3JuZXJzOiBDb3JuZXJPZmZzZXRzO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHJlZ2lvbjogcGFwZXIuUGF0aCwgY29udGVudDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLl9yZWdpb24gPSByZWdpb247XG4gICAgICAgICAgICB0aGlzLl9jb250ZW50ID0gY29udGVudDtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fd2FycGVkID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChjb250ZW50LnBhdGhEYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5maWxsQ29sb3IgPSBcImdyYXlcIjtcbiAgICAgICAgICAgIHRoaXMuY29ybmVycyA9IFswLCAwLjI1LCAwLjUwLCAwLjc1XTtcblxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9jb250ZW50KTtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fd2FycGVkKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXRoKCk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVQYXRoKCkge1xuICAgICAgICAgICAgY29uc3QgY29udGVudE9yaWdpbiA9IHRoaXMuX2NvbnRlbnQuYm91bmRzLnRvcExlZnQ7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50V2lkdGggPSB0aGlzLl9jb250ZW50LmJvdW5kcy53aWR0aDtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRIZWlnaHQgPSB0aGlzLl9jb250ZW50LmJvdW5kcy5oZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCByZWdpb25MZW5ndGggPSB0aGlzLl9yZWdpb24ubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgdG9wID0gbmV3IFBhdGhTZWN0aW9uKFxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lvbiwgXG4gICAgICAgICAgICAgICAgdGhpcy5jb3JuZXJzWzBdLCBcbiAgICAgICAgICAgICAgICBQYXBlckhlbHBlcnMucGF0aE9mZnNldExlbmd0aCh0aGlzLmNvcm5lcnNbMF0sIHRoaXMuY29ybmVyc1sxXSkpO1xuICAgICAgICAgICAgY29uc3QgYm90dG9tID0gbmV3IFBhdGhTZWN0aW9uKFxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lvbiwgXG4gICAgICAgICAgICAgICAgdGhpcy5jb3JuZXJzWzNdLFxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5wYXRoT2Zmc2V0TGVuZ3RoKHRoaXMuY29ybmVyc1szXSwgdGhpcy5jb3JuZXJzWzJdLCBmYWxzZSksXG4gICAgICAgICAgICAgICAgZmFsc2UpO1xuXG4gICAgICAgICAgICBsZXQgcHJvamVjdGlvbiA9IFBhcGVySGVscGVycy5kdWFsQm91bmRzUGF0aFByb2plY3Rpb24odG9wLCBib3R0b20pO1xuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXBvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwb2ludDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHJlbGF0aXZlID0gcG9pbnQuc3VidHJhY3QoY29udGVudE9yaWdpbik7XG4gICAgICAgICAgICAgICAgbGV0IHVuaXQgPSBuZXcgcGFwZXIuUG9pbnQoXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBjb250ZW50V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnkgLyBjb250ZW50SGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBsZXQgcHJvamVjdGVkID0gcHJvamVjdGlvbih1bml0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhzID0gdGhpcy5fY29udGVudC5jaGlsZHJlblxuICAgICAgICAgICAgICAgIC5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSA8cGFwZXIuUGF0aD5pdGVtO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4UG9pbnRzID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEFzUG9pbnRzKHBhdGgsIDEwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAocCA9PiB0cmFuc2Zvcm0udHJhbnNmb3JtUG9pbnQocCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4UGF0aCA9IG5ldyBwYXBlci5QYXRoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy94UGF0aC5yZWR1Y2UoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHhQYXRoO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5hZGRDaGlsZHJlbihuZXdQYXRocyk7XG5cbiAgICAgICB9XG5cbiAgICAgICAvKipcbiAgICAgICAgKiBTbGlkZSBvZmZzZXQgcG9pbnRzIGJ5IHRoZSBnaXZlbiBhbW91bnQuXG4gICAgICAgICogQHBhcmFtIHVuaXRPZmZzZXQ6IHZhbHVlIDAgdG8gMVxuICAgICAgICAqL1xuICAgICAgIHNsaWRlKHVuaXRPZmZzZXQ6IG51bWJlcil7XG4gICAgICAgICAgIHRoaXMuY29ybmVycyA9IDxDb3JuZXJPZmZzZXRzPnRoaXMuY29ybmVycy5tYXAoXG4gICAgICAgICAgICAgICAgYyA9PiBTbmFwUGF0aC5pbmNyZW1lbnRPZmZzZXQoYywgdW5pdE9mZnNldCkpOyBcbiAgICAgICB9XG5cbiAgICAgICBwcml2YXRlIHN0YXRpYyBpbmNyZW1lbnRPZmZzZXQob2Zmc2V0OiBudW1iZXIsIGRlbHRhOiBudW1iZXIpe1xuICAgICAgICAgICBsZXQgcmVzdWx0ID0gb2Zmc2V0ICsgZGVsdGE7XG4gICAgICAgICAgIGlmKHJlc3VsdCA8IDApe1xuICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgTWF0aC5yb3VuZChyZXN1bHQpICsgMTtcbiAgICAgICAgICAgfVxuICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgJSAxO1xuICAgICAgICAgICAvL2NvbnNvbGUubG9nKGAke29mZnNldH0gKyAke2RlbHRhfSA9PiAke3Jlc3VsdH1gKTtcbiAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXRoIG9mZnNldHMgb24gcmVnaW9uIGZvciBjb3JuZXJzIG9mIFNuYXBQYXRoIGNvbnRlbnQsIFxuICAgICAqICAgc3RhcnRpbmcgd2l0aCB0b3BMZWZ0IGFuZCBwcm9jZWVkaW5nIGNsb2Nrd2lzZVxuICAgICAqICAgdG8gYm90dG9tTGVmdC4gXG4gICAgICovXG4gICAgZXhwb3J0IHR5cGUgQ29ybmVyT2Zmc2V0cyA9IFtcbiAgICAgICAgbnVtYmVyLCAvLyB0b3BMZWZ0XG4gICAgICAgIG51bWJlciwgLy8gdG9wUmlnaHRcbiAgICAgICAgbnVtYmVyLCAvLyBib3R0b21SaWdodFxuICAgICAgICBudW1iZXIgIC8vIGJvdHRvbUxlZnRcbiAgICBdXG5cbn0iLCJuYW1lc3BhY2UgRm9udFNoYXBlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBWZXJ0aWNhbEJvdW5kc1N0cmV0Y2hQYXRoIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xuICAgICAgICBzdGF0aWMgcG9pbnRzUGVyUGF0aCA9IDIwMDtcblxuICAgICAgICBwcml2YXRlIF9ib3VuZGFyaWVzOiBWZXJ0aWNhbEJvdW5kcztcbiAgICAgICAgcHJpdmF0ZSBfY29udGVudDogcGFwZXIuQ29tcG91bmRQYXRoO1xuICAgICAgICBwcml2YXRlIF93YXJwZWQ6IHBhcGVyLkNvbXBvdW5kUGF0aDtcbiAgICAgICAgY29ybmVyczogQ29ybmVyT2Zmc2V0cztcblxuICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIGNvbnRlbnQ6IHBhcGVyLkNvbXBvdW5kUGF0aCxcbiAgICAgICAgICAgIGJvdW5kYXJpZXM/OiBWZXJ0aWNhbEJvdW5kc1xuICAgICAgICApIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQgPSBjb250ZW50O1xuICAgICAgICAgICAgdGhpcy5fY29udGVudC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9ib3VuZGFyaWVzID0gYm91bmRhcmllcyB8fFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdXBwZXI6IG5ldyBwYXBlci5QYXRoKFtjb250ZW50LmJvdW5kcy50b3BMZWZ0LCBjb250ZW50LmJvdW5kcy50b3BSaWdodF0pLFxuICAgICAgICAgICAgICAgICAgICBsb3dlcjogbmV3IHBhcGVyLlBhdGgoW2NvbnRlbnQuYm91bmRzLmJvdHRvbUxlZnQsIGNvbnRlbnQuYm91bmRzLmJvdHRvbVJpZ2h0XSksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fd2FycGVkID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChjb250ZW50LnBhdGhEYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5maWxsQ29sb3IgPSBcImxpZ2h0Z3JheVwiO1xuXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2NvbnRlbnQpO1xuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl93YXJwZWQpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhdGgoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZVBhdGgoKSB7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50T3JpZ2luID0gdGhpcy5fY29udGVudC5ib3VuZHMudG9wTGVmdDtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRXaWR0aCA9IHRoaXMuX2NvbnRlbnQuYm91bmRzLndpZHRoO1xuICAgICAgICAgICAgY29uc3QgY29udGVudEhlaWdodCA9IHRoaXMuX2NvbnRlbnQuYm91bmRzLmhlaWdodDtcbiAgICAgICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLmR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbihcbiAgICAgICAgICAgICAgICB0aGlzLl9ib3VuZGFyaWVzLnVwcGVyLCB0aGlzLl9ib3VuZGFyaWVzLmxvd2VyKTtcbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm0gPSBuZXcgUGF0aFRyYW5zZm9ybShwb2ludCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFwb2ludCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KGNvbnRlbnRPcmlnaW4pO1xuICAgICAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxuICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZS54IC8gY29udGVudFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gY29udGVudEhlaWdodCk7XG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3RlZDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBuZXdQYXRocyA9IHRoaXMuX2NvbnRlbnQuY2hpbGRyZW5cbiAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gPHBhcGVyLlBhdGg+aXRlbTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFBvaW50cyA9IFBhcGVySGVscGVycy50cmFjZVBhdGhBc1BvaW50cyhwYXRoLCBWZXJ0aWNhbEJvdW5kc1N0cmV0Y2hQYXRoLnBvaW50c1BlclBhdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKHAgPT4gdHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50KHApKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFBhdGggPSBuZXcgcGFwZXIuUGF0aCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogeFBvaW50cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8veFBhdGgucmVkdWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4UGF0aDtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLnJlbW92ZUNoaWxkcmVuKCk7XG4gICAgICAgICAgICB0aGlzLl93YXJwZWQuYWRkQ2hpbGRyZW4obmV3UGF0aHMpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiXG5uYW1lc3BhY2UgRm9udFNoYXBlIHtcblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVmVydGljYWxCb3VuZHMge1xuICAgICAgICB1cHBlcjogcGFwZXIuUGF0aDtcbiAgICAgICAgbG93ZXI6IHBhcGVyLlBhdGg7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBGb250U3BlY2lmaWVyIHtcbiAgICAgICAgZmFtaWx5OiBzdHJpbmc7XG4gICAgICAgIHZhcmlhbnQ/OiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBGYW1pbHlSZWNvcmQge1xuICAgICAgICBraW5kPzogc3RyaW5nO1xuICAgICAgICBmYW1pbHk/OiBzdHJpbmc7XG4gICAgICAgIGNhdGVnb3J5Pzogc3RyaW5nO1xuICAgICAgICB2YXJpYW50cz86IHN0cmluZ1tdO1xuICAgICAgICBzdWJzZXRzPzogc3RyaW5nW107XG4gICAgICAgIHZlcnNpb24/OiBzdHJpbmc7XG4gICAgICAgIGxhc3RNb2RpZmllZD86IHN0cmluZztcbiAgICAgICAgZmlsZXM/OiB7IFt2YXJpYW50OiBzdHJpbmddOiBzdHJpbmc7IH07XG4gICAgfVxuXG59Il19