var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FontShape;
(function (FontShape) {
    var FontCatalog = (function () {
        function FontCatalog(records) {
            var _this = this;
            // Encountered issues with these families
            this.excludeFamilies = ["Anton", "Arimo", "Slabo 27px"];
            records = records.filter(function (r) { return _this.excludeFamilies.indexOf(r.family) < 0; });
            // make files https
            var _loop_1 = function(record) {
                _.forOwn(record.files, function (val, key) {
                    if (_.startsWith(val, "http:")) {
                        record.files[key] = val.replace("http:", "https:");
                    }
                });
            };
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
            params[_i - 0] = arguments[_i];
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
    var ParsedFonts = (function () {
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
    var PathSection = (function () {
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
    FontShape.PathTransform = PathTransform;
})(FontShape || (FontShape = {}));
var FontShape;
(function (FontShape) {
    var SnapPath = (function (_super) {
        __extends(SnapPath, _super);
        function SnapPath(region, content) {
            _super.call(this);
            this._region = region;
            this._content = content;
            this._content.visible = false;
            this._warped = new paper.CompoundPath(content.pathData);
            this._warped.fillColor = "gray";
            this.corners = [0, 0.25, 0.50, 0.75];
            this.addChild(this._content);
            this.addChild(this._warped);
            this.updatePath();
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
    var VerticalBoundsStretchPath = (function (_super) {
        __extends(VerticalBoundsStretchPath, _super);
        function VerticalBoundsStretchPath(content, boundaries) {
            _super.call(this);
            this._content = content;
            this._content.visible = false;
            this._boundaries = boundaries ||
                {
                    upper: new paper.Path([content.bounds.topLeft, content.bounds.topRight]),
                    lower: new paper.Path([content.bounds.bottomLeft, content.bounds.bottomRight]),
                };
            this._warped = new paper.CompoundPath(content.pathData);
            this._warped.fillColor = "lightgray";
            this.addChild(this._content);
            this.addChild(this._warped);
            this.updatePath();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9wYXBlci1leHQudHMiLCIuLi9zcmMvRm9udENhdGFsb2cudHMiLCIuLi9zcmMvUGFwZXJIZWxwZXJzLnRzIiwiLi4vc3JjL1BhcnNlZEZvbnRzLnRzIiwiLi4vc3JjL1BhdGhTZWN0aW9uLnRzIiwiLi4vc3JjL1BhdGhUcmFuc2Zvcm0udHMiLCIuLi9zcmMvU25hcFBhdGgudHMiLCIuLi9zcmMvVmVydGljYWxCb3VuZHNTdHJldGNoUGF0aC50cyIsIi4uL3NyYy9tb2RlbHMudHMiLCIuLi9zcmMvc2V0dXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUNBQSxJQUFVLFNBQVMsQ0FvSWxCO0FBcElELFdBQVUsU0FBUyxFQUFDLENBQUM7SUFFakI7UUF1Q0kscUJBQVksT0FBdUI7WUF2Q3ZDLGlCQWdJQztZQTlIRyx5Q0FBeUM7WUFDekMsb0JBQWUsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFzQy9DLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBMUMsQ0FBMEMsQ0FBQyxDQUFDO1lBRTFFLG1CQUFtQjtZQUNuQjtnQkFDSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBQyxHQUFXLEVBQUUsR0FBVztvQkFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM3QixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUN2RCxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFD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QyxFQUEzQixDQUEyQixDQUFDLENBQUM7Z0JBQzNDLElBQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQztvQkFDekIsUUFBUSxFQUFFLE9BQU87b0JBQ2pCLE1BQU0sRUFBRSxJQUFJO29CQUNaLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztpQkFDNUIsQ0FBQyxDQUFDO2dCQUNILGlCQUFpQjtnQkFDakIsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQTtZQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQTlETSx1Q0FBYSxHQUFHLEdBQUcsQ0FBQztRQStEL0IsZ0NBQUM7SUFBRCxDQUFDLEFBaEVELENBQStDLEtBQUssQ0FBQyxLQUFLLEdBZ0V6RDtJQWhFWSxtQ0FBeUIsNEJBZ0VyQyxDQUFBO0FBRUwsQ0FBQyxFQXBFUyxTQUFTLEtBQVQsU0FBUyxRQW9FbEI7QUM1Q0EiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIG1vZHVsZSBwYXBlciB7XHJcblxyXG4gICAgaW50ZXJmYWNlIEN1cnZlbGlrZSB7XHJcbiAgICAgICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICAgICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlcik6IHBhcGVyLlBvaW50O1xyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJuYW1lc3BhY2UgRm9udFNoYXBlIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRm9udENhdGFsb2cge1xyXG5cclxuICAgICAgICAvLyBFbmNvdW50ZXJlZCBpc3N1ZXMgd2l0aCB0aGVzZSBmYW1pbGllc1xyXG4gICAgICAgIGV4Y2x1ZGVGYW1pbGllcyA9IFtcIkFudG9uXCIsIFwiQXJpbW9cIiwgXCJTbGFibyAyN3B4XCJdO1xyXG5cclxuICAgICAgICBzdGF0aWMgZnJvbUxvY2FsKHBhdGg6IHN0cmluZyk6IEpRdWVyeVByb21pc2U8Rm9udENhdGFsb2c+IHtcclxuICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHBhdGgsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWVcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZTogeyBraW5kOiBzdHJpbmcsIGl0ZW1zOiBGYW1pbHlSZWNvcmRbXSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGb250Q2F0YWxvZyhyZXNwb25zZS5pdGVtcyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUuZXJyb3IocGF0aCwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgZnJvbVJlbW90ZSgpOiBKUXVlcnlQcm9taXNlPEZvbnRDYXRhbG9nPiB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vd2ViZm9udHMvdjEvd2ViZm9udHM/JztcclxuICAgICAgICAgICAgdmFyIGtleSA9ICdrZXk9R09PR0xFLUFQSS1LRVknO1xyXG4gICAgICAgICAgICB2YXIgc29ydCA9IFwicG9wdWxhcml0eVwiO1xyXG4gICAgICAgICAgICB2YXIgb3B0ID0gJ3NvcnQ9JyArIHNvcnQgKyAnJic7XHJcbiAgICAgICAgICAgIHZhciByZXEgPSB1cmwgKyBvcHQgKyBrZXk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogcmVxLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2U6IHsga2luZDogc3RyaW5nLCBpdGVtczogRmFtaWx5UmVjb3JkW10gfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRm9udENhdGFsb2cocmVzcG9uc2UuaXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmVycm9yKHJlcSwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHJlY29yZHM6IEZhbWlseVJlY29yZFtdO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihyZWNvcmRzOiBGYW1pbHlSZWNvcmRbXSkge1xyXG5cclxuICAgICAgICAgICAgcmVjb3JkcyA9IHJlY29yZHMuZmlsdGVyKHIgPT4gdGhpcy5leGNsdWRlRmFtaWxpZXMuaW5kZXhPZihyLmZhbWlseSkgPCAwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIG1ha2UgZmlsZXMgaHR0cHNcclxuICAgICAgICAgICAgZm9yIChjb25zdCByZWNvcmQgb2YgcmVjb3Jkcykge1xyXG4gICAgICAgICAgICAgICAgXy5mb3JPd24ocmVjb3JkLmZpbGVzLCAodmFsOiBzdHJpbmcsIGtleTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF8uc3RhcnRzV2l0aCh2YWwsIFwiaHR0cDpcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkLmZpbGVzW2tleV0gPSB2YWwucmVwbGFjZShcImh0dHA6XCIsIFwiaHR0cHM6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlY29yZHMgPSByZWNvcmRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0TGlzdChsaW1pdD86IG51bWJlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gISFsaW1pdFxyXG4gICAgICAgICAgICAgICAgPyB0aGlzLnJlY29yZHMuc2xpY2UoMCwgbGltaXQpXHJcbiAgICAgICAgICAgICAgICA6IHRoaXMucmVjb3JkcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldENhdGVnb3JpZXMoKTogc3RyaW5nW10ge1xyXG4gICAgICAgICAgICByZXR1cm4gXy51bmlxKHRoaXMucmVjb3Jkcy5tYXAoZiA9PiBmLmNhdGVnb3J5KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRGYW1pbGllcyhjYXRlZ29yeT86IHN0cmluZyk6IHN0cmluZ1tdIHtcclxuICAgICAgICAgICAgaWYgKCFjYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVjb3Jkcy5tYXAoZiA9PiBmLmZhbWlseSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVjb3Jkc1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihmID0+IGYuY2F0ZWdvcnkgPT09IGNhdGVnb3J5KVxyXG4gICAgICAgICAgICAgICAgLm1hcChmID0+IGYuZmFtaWx5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldFZhcmlhbnRzKGZhbWlseTogc3RyaW5nKTogc3RyaW5nW10ge1xyXG4gICAgICAgICAgICBjb25zdCBmYW0gPSB0aGlzLmdldFJlY29yZChmYW1pbHkpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFtICYmIGZhbS52YXJpYW50cyB8fCBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldFJlY29yZChmYW1pbHk6IHN0cmluZyk6IEZhbWlseVJlY29yZCB7XHJcbiAgICAgICAgICAgIHJldHVybiBfLmZpbmQodGhpcy5yZWNvcmRzLCBmZiA9PiBmZi5mYW1pbHkgPT09IGZhbWlseSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRVcmwoZmFtaWx5OiBzdHJpbmcsIHZhcmlhbnQ/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldFJlY29yZChmYW1pbHkpO1xyXG4gICAgICAgICAgICBpZiAoIXJlY29yZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwibm8gZGVmaW5pdGlvbiBhdmFpbGFibGUgZm9yIGZhbWlseVwiLCBmYW1pbHkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF2YXJpYW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXJpYW50ID0gRm9udENhdGFsb2cuZGVmYXVsdFZhcmlhbnQocmVjb3JkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZmlsZSA9IHJlY29yZC5maWxlc1t2YXJpYW50XTtcclxuICAgICAgICAgICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJubyBmb250IGZpbGUgYXZhaWxhYmxlIGZvciB2YXJpYW50XCIsIGZhbWlseSwgdmFyaWFudCk7XHJcbiAgICAgICAgICAgICAgICBmaWxlID0gcmVjb3JkLmZpbGVzWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGRlZmF1bHRWYXJpYW50KHJlY29yZDogRmFtaWx5UmVjb3JkKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCFyZWNvcmQpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAocmVjb3JkLnZhcmlhbnRzLmluZGV4T2YoXCJyZWd1bGFyXCIpID49IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcInJlZ3VsYXJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVjb3JkLnZhcmlhbnRzWzBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRm9yIGEgbGlzdCBvZiBmYW1pbGllcywgbG9hZCBhbHBoYW51bWVyaWMgY2hhcnMgaW50byBicm93c2VyXHJcbiAgICAgICAgICogICB0byBzdXBwb3J0IHByZXZpZXdpbmcuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGxvYWRQcmV2aWV3U3Vic2V0cyhmYW1pbGllczogc3RyaW5nW10pIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBjaHVuayBvZiBfLmNodW5rKGZhbWlsaWVzLmZpbHRlcihmID0+ICEhZiksIDEwKSkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBXZWJGb250LmxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ29vZ2xlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYW1pbGllczogPHN0cmluZ1tdPmNodW5rLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3IgbG9hZGluZyBmb250IHN1YnNldHNcIiwgZXJyLCBjaHVuayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmludGVyZmFjZSBDb25zb2xlIHtcclxuICAgIGxvZyhtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkO1xyXG4gICAgbG9nKC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSk6IHZvaWQ7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBQYXBlckhlbHBlcnMge1xyXG5cclxuICAgIGV4cG9ydCBjb25zdCBTQUZBUklfTUFYX0NBTlZBU19BUkVBID0gNjcxMDg4NjQ7XHJcblxyXG4gICAgZXhwb3J0IHZhciBzaG91bGRMb2dJbmZvOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0IGxvZyA9IGZ1bmN0aW9uKC4uLnBhcmFtczogYW55W10pIHtcclxuICAgICAgICBpZiAoc2hvdWxkTG9nSW5mbykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyguLi5wYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZSB0aGUgbWF4IGRwaSB0aGF0IGNhbiBzdXBwb3J0ZWQgYnkgQ2FudmFzLlxyXG4gICAgICogVXNpbmcgU2FmYXJpIGFzIHRoZSBtZWFzdXJlLCBiZWNhdXNlIGl0IHNlZW1zIHRvIGhhdmUgdGhlIHNtYWxsZXN0IGxpbWl0LlxyXG4gICAgICogTWF4IERQSSBpbiBDaHJvbWUgcHJvZHVjZXMgYXBwcm94IDgwMDB4ODAwMC5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1heEV4cG9ydERwaShpdGVtU2l6ZTogcGFwZXIuU2l6ZSl7XHJcbiAgICAgICAgcmV0dXJuIGdldEV4cG9ydERwaShpdGVtU2l6ZSwgU0FGQVJJX01BWF9DQU5WQVNfQVJFQSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldEV4cG9ydERwaShpdGVtU2l6ZTogcGFwZXIuU2l6ZSwgcGl4ZWxzOiBudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IGl0ZW1BcmVhID0gaXRlbVNpemUud2lkdGggKiBpdGVtU2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgcmV0dXJuIDAuOTk5ICogTWF0aC5zcXJ0KHBpeGVscylcclxuICAgICAgICAgICAgICAgICogKHBhcGVyLnZpZXcucmVzb2x1dGlvbikgXHJcbiAgICAgICAgICAgICAgICAvICBNYXRoLnNxcnQoaXRlbUFyZWEpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBpbXBvcnRPcGVuVHlwZVBhdGggPSBmdW5jdGlvbihvcGVuUGF0aDogb3BlbnR5cGUuUGF0aCk6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgob3BlblBhdGgudG9QYXRoRGF0YSgpKTtcclxuICAgICAgICAvLyBsZXQgc3ZnID0gb3BlblBhdGgudG9TVkcoNCk7XHJcbiAgICAgICAgLy8gcmV0dXJuIDxwYXBlci5QYXRoPnBhcGVyLnByb2plY3QuaW1wb3J0U1ZHKHN2Zyk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlUGF0aEl0ZW0gPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoSXRlbSwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuUGF0aEl0ZW0ge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VDb21wb3VuZFBhdGgoPHBhcGVyLkNvbXBvdW5kUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCB0cmFjZUNvbXBvdW5kUGF0aCA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLkNvbXBvdW5kUGF0aCwgcG9pbnRzUGVyUGF0aDogbnVtYmVyKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICBpZiAoIXBhdGguY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcGF0aHMgPSBwYXRoLmNoaWxkcmVuLm1hcChwID0+XHJcbiAgICAgICAgICAgIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnAsIHBvaW50c1BlclBhdGgpKTtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aCh7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBwYXRocyxcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlUGF0aEFzUG9pbnRzID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5Qb2ludFtdIHtcclxuICAgICAgICBsZXQgcGF0aExlbmd0aCA9IHBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGxldCBvZmZzZXRJbmNyID0gcGF0aExlbmd0aCAvIG51bVBvaW50cztcclxuICAgICAgICBsZXQgcG9pbnRzID0gW107XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAoaSsrIDwgbnVtUG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IHBhdGguZ2V0UG9pbnRBdChNYXRoLm1pbihvZmZzZXQsIHBhdGhMZW5ndGgpKTtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gb2Zmc2V0SW5jcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwb2ludHM7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlUGF0aCA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGgsIG51bVBvaW50czogbnVtYmVyKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgbGV0IHBvaW50cyA9IFBhcGVySGVscGVycy50cmFjZVBhdGhBc1BvaW50cyhwYXRoLCBudW1Qb2ludHMpO1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgIHNlZ21lbnRzOiBwb2ludHMsXHJcbiAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBkdWFsQm91bmRzUGF0aFByb2plY3Rpb24gPSBmdW5jdGlvbih0b3BQYXRoOiBwYXBlci5DdXJ2ZWxpa2UsIGJvdHRvbVBhdGg6IHBhcGVyLkN1cnZlbGlrZSlcclxuICAgICAgICA6ICh1bml0UG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgY29uc3QgdG9wUGF0aExlbmd0aCA9IHRvcFBhdGgubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGJvdHRvbVBhdGhMZW5ndGggPSBib3R0b21QYXRoLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24odW5pdFBvaW50OiBwYXBlci5Qb2ludCk6IHBhcGVyLlBvaW50IHtcclxuICAgICAgICAgICAgbGV0IHRvcFBvaW50ID0gdG9wUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogdG9wUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGxldCBib3R0b21Qb2ludCA9IGJvdHRvbVBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIGJvdHRvbVBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgICBpZiAodG9wUG9pbnQgPT0gbnVsbCB8fCBib3R0b21Qb2ludCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJjb3VsZCBub3QgZ2V0IHByb2plY3RlZCBwb2ludCBmb3IgdW5pdCBwb2ludCBcIiArIHVuaXRQb2ludCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9wUG9pbnQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9wUG9pbnQuYWRkKGJvdHRvbVBvaW50LnN1YnRyYWN0KHRvcFBvaW50KS5tdWx0aXBseSh1bml0UG9pbnQueSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFya2VyR3JvdXA6IHBhcGVyLkdyb3VwO1xyXG5cclxuICAgIGV4cG9ydCBjb25zdCByZXNldE1hcmtlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwKSB7XHJcbiAgICAgICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya2VyR3JvdXAgPSBuZXcgcGFwZXIuR3JvdXAoKTtcclxuICAgICAgICBtYXJrZXJHcm91cC5vcGFjaXR5ID0gMC4yO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgbWFya2VyTGluZSA9IGZ1bmN0aW9uKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIGxldCBsaW5lID0gcGFwZXIuUGF0aC5MaW5lKGEsIGIpO1xyXG4gICAgICAgIGxpbmUuc3Ryb2tlQ29sb3IgPSAnZ3JlZW4nO1xyXG4gICAgICAgIC8vbGluZS5kYXNoQXJyYXkgPSBbNSwgNV07XHJcbiAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLmFkZENoaWxkKGxpbmUpO1xyXG4gICAgICAgIHJldHVybiBsaW5lO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBtYXJrZXIgPSBmdW5jdGlvbihwb2ludDogcGFwZXIuUG9pbnQsIGxhYmVsOiBzdHJpbmcpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICAvL2xldCBtYXJrZXIgPSBwYXBlci5TaGFwZS5DaXJjbGUocG9pbnQsIDEwKTtcclxuICAgICAgICBsZXQgbWFya2VyID0gbmV3IHBhcGVyLlBvaW50VGV4dChwb2ludCk7XHJcbiAgICAgICAgbWFya2VyLmZvbnRTaXplID0gMzY7XHJcbiAgICAgICAgbWFya2VyLmNvbnRlbnQgPSBsYWJlbDtcclxuICAgICAgICBtYXJrZXIuc3Ryb2tlQ29sb3IgPSBcInJlZFwiO1xyXG4gICAgICAgIG1hcmtlci5icmluZ1RvRnJvbnQoKTtcclxuICAgICAgICAvL1BhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChtYXJrZXIpO1xyXG4gICAgICAgIHJldHVybiBtYXJrZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHNpbXBsaWZ5ID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aEl0ZW0sIHRvbGVyYW5jZT86IG51bWJlcikge1xyXG4gICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBQYXBlckhlbHBlcnMuc2ltcGxpZnkoPHBhcGVyLlBhdGhJdGVtPnAsIHRvbGVyYW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAoPHBhcGVyLlBhdGg+cGF0aCkuc2ltcGxpZnkodG9sZXJhbmNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIHNlbGYgb3IgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBmaW5kU2VsZk9yQW5jZXN0b3IgPSBmdW5jdGlvbihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZShpdGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFBhcGVySGVscGVycy5maW5kQW5jZXN0b3IoaXRlbSwgcHJlZGljYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgbmVhcmVzdCBhbmNlc3RvciBzYXRpc2Z5aW5nIHRoZSBwcmVkaWNhdGUuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBmaW5kQW5jZXN0b3IgPSBmdW5jdGlvbihpdGVtOiBwYXBlci5JdGVtLCBwcmVkaWNhdGU6IChpOiBwYXBlci5JdGVtKSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCFpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJpb3I6IHBhcGVyLkl0ZW07XHJcbiAgICAgICAgbGV0IGNoZWNraW5nID0gaXRlbS5wYXJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKGNoZWNraW5nICYmIGNoZWNraW5nICE9PSBwcmlvcikge1xyXG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKGNoZWNraW5nKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNraW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByaW9yID0gY2hlY2tpbmc7XHJcbiAgICAgICAgICAgIGNoZWNraW5nID0gY2hlY2tpbmcucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBjb3JuZXJzIG9mIHRoZSByZWN0LCBjbG9ja3dpc2Ugc3RhcnRpbmcgZnJvbSB0b3BMZWZ0XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBjb3JuZXJzID0gZnVuY3Rpb24ocmVjdDogcGFwZXIuUmVjdGFuZ2xlKTogcGFwZXIuUG9pbnRbXSB7XHJcbiAgICAgICAgcmV0dXJuIFtyZWN0LnRvcExlZnQsIHJlY3QudG9wUmlnaHQsIHJlY3QuYm90dG9tUmlnaHQsIHJlY3QuYm90dG9tTGVmdF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0aGUgbWlkcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBtaWRwb2ludCA9IGZ1bmN0aW9uKGE6IHBhcGVyLlBvaW50LCBiOiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgIHJldHVybiBiLnN1YnRyYWN0KGEpLmRpdmlkZSgyKS5hZGQoYSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IGNsb25lU2VnbWVudCA9IGZ1bmN0aW9uKHNlZ21lbnQ6IHBhcGVyLlNlZ21lbnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlNlZ21lbnQoc2VnbWVudC5wb2ludCwgc2VnbWVudC5oYW5kbGVJbiwgc2VnbWVudC5oYW5kbGVPdXQpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSAtIGIsIHdoZXJlIGEgYW5kIGIgYXJlIHVuaXQgb2Zmc2V0cyBhbG9uZyBhIGNsb3NlZCBwYXRoLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcGF0aE9mZnNldExlbmd0aChzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgY2xvY2t3aXNlOiBib29sZWFuID0gdHJ1ZSl7XHJcbiAgICAgICAgc3RhcnQgPSBwYXRoT2Zmc2V0Tm9ybWFsaXplKHN0YXJ0KTtcclxuICAgICAgICBlbmQgPSBwYXRoT2Zmc2V0Tm9ybWFsaXplKGVuZCk7XHJcbiAgICAgICAgaWYoY2xvY2t3aXNlKXtcclxuICAgICAgICAgICAgaWYoc3RhcnQgPiBlbmQpIHtcclxuICAgICAgICAgICAgICAgIGVuZCArPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwYXRoT2Zmc2V0Tm9ybWFsaXplKGVuZCAtIHN0YXJ0KTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGVuZCA+IHN0YXJ0KXtcclxuICAgICAgICAgICAgc3RhcnQgKz0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGhPZmZzZXROb3JtYWxpemUoc3RhcnQgLSBlbmQpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcGF0aE9mZnNldE5vcm1hbGl6ZShvZmZzZXQ6IG51bWJlcil7XHJcbiAgICAgICAgaWYob2Zmc2V0IDwgMCl7XHJcbiAgICAgICAgICAgIG9mZnNldCArPSBNYXRoLnJvdW5kKG9mZnNldCkgKyAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2Zmc2V0ICUgMTtcclxuICAgIH1cclxuICAgIFxyXG59XHJcbiIsIm5hbWVzcGFjZSBGb250U2hhcGUge1xyXG5cclxuICAgIGV4cG9ydCB0eXBlIFBhcnNlZEZvbnQgPSB7XHJcbiAgICAgICAgdXJsOiBzdHJpbmcsXHJcbiAgICAgICAgZm9udDogb3BlbnR5cGUuRm9udFxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBQYXJzZWRGb250cyB7XHJcblxyXG4gICAgICAgIGZvbnRzOiB7IFt1cmw6IHN0cmluZ106IG9wZW50eXBlLkZvbnQ7IH0gPSB7fTtcclxuXHJcbiAgICAgICAgX2ZvbnRMb2FkZWQ6IChwYXJzZWQ6IFBhcnNlZEZvbnQpID0+IHZvaWQ7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGZvbnRMb2FkZWQ/OiAocGFyc2VkOiBQYXJzZWRGb250KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRMb2FkZWQgPSBmb250TG9hZGVkIHx8ICgoKSA9PiB7IH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0KHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxQYXJzZWRGb250PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXVybCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZm9udCA9IHRoaXMuZm9udHNbdXJsXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZm9udCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyB1cmwsIGZvbnQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG9wZW50eXBlLmxvYWQodXJsLCAoZXJyLCBmb250KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVyciwgeyB1cmwgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9udHNbdXJsXSA9IGZvbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe3VybCwgZm9udH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb250TG9hZGVkKHt1cmwsIGZvbnR9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgRm9udFNoYXBlIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUGF0aFNlY3Rpb24gaW1wbGVtZW50cyBwYXBlci5DdXJ2ZWxpa2Uge1xyXG4gICAgICAgIHBhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgdW5pdFN0YXJ0OiBudW1iZXI7XHJcbiAgICAgICAgdW5pdExlbmd0aDogbnVtYmVyO1xyXG4gICAgICAgIGNsb2Nrd2lzZTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU3RhcnQgYW5kIGVuZCBhcmUgdW5pdCBsZW5ndGhzOiAwIHRvIDEuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IocGF0aDogcGFwZXIuUGF0aCwgXHJcbiAgICAgICAgICAgIHVuaXRTdGFydDogbnVtYmVyLCBcclxuICAgICAgICAgICAgdW5pdExlbmd0aDogbnVtYmVyLCBcclxuICAgICAgICAgICAgY2xvY2t3aXNlOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhdGggPSBwYXRoO1xyXG4gICAgICAgICAgICB0aGlzLnVuaXRTdGFydCA9IHVuaXRTdGFydDtcclxuICAgICAgICAgICAgdGhpcy51bml0TGVuZ3RoID0gdW5pdExlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5jbG9ja3dpc2UgPSBjbG9ja3dpc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgbGVuZ3RoKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy51bml0TGVuZ3RoICogdGhpcy5wYXRoLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBwYXJhbSBvZmZzZXQ6IGxlbmd0aCBvZmZzZXQgcmVsYXRpdmUgdG8gdGhpcyBzZWN0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldFBvaW50QXQob2Zmc2V0OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgcGF0aExlbmd0aCA9IHRoaXMucGF0aC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMucGF0aC5jbG9ja3dpc2UgPT0gdGhpcy5jbG9ja3dpc2UgPyAxIDogLTE7XHJcbiAgICAgICAgICAgIGxldCBwYXRoT2Zmc2V0ID0gdGhpcy51bml0U3RhcnQgKiBwYXRoTGVuZ3RoICsgb2Zmc2V0ICogZGlyZWN0aW9uO1xyXG4gICAgICAgICAgICBpZiAocGF0aE9mZnNldCA+IHBhdGhMZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgcGF0aE9mZnNldCAtPSBwYXRoTGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHBhdGhPZmZzZXQgPCAwKXtcclxuICAgICAgICAgICAgICAgIHBhdGhPZmZzZXQgKz0gcGF0aExlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXRoLmdldFBvaW50QXQocGF0aE9mZnNldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBGb250U2hhcGUge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBQYXRoVHJhbnNmb3JtIHtcclxuICAgICAgICBwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQ7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHBvaW50VHJhbnNmb3JtOiAocG9pbnQ6IHBhcGVyLlBvaW50KSA9PiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50VHJhbnNmb3JtID0gcG9pbnRUcmFuc2Zvcm07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cmFuc2Zvcm1Qb2ludChwb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvaW50VHJhbnNmb3JtKHBvaW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyYW5zZm9ybVBhdGhJdGVtKHBhdGg6IHBhcGVyLlBhdGhJdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXRoLmNsYXNzTmFtZSA9PT0gJ0NvbXBvdW5kUGF0aCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyYW5zZm9ybUNvbXBvdW5kUGF0aChwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcCBvZiBwYXRoLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zZm9ybVBhdGgoPHBhcGVyLlBhdGg+cCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyYW5zZm9ybVBhdGgocGF0aDogcGFwZXIuUGF0aCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBzZWdtZW50IG9mIHBhdGguc2VnbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIGxldCBvcmlnUG9pbnQgPSBzZWdtZW50LnBvaW50O1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1BvaW50ID0gdGhpcy50cmFuc2Zvcm1Qb2ludChzZWdtZW50LnBvaW50KTtcclxuICAgICAgICAgICAgICAgIG9yaWdQb2ludC54ID0gbmV3UG9pbnQueDtcclxuICAgICAgICAgICAgICAgIG9yaWdQb2ludC55ID0gbmV3UG9pbnQueTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgRm9udFNoYXBlIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU25hcFBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3JlZ2lvbjogcGFwZXIuUGF0aDtcclxuICAgICAgICBwcml2YXRlIF9jb250ZW50OiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICAgICAgcHJpdmF0ZSBfd2FycGVkOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICAgICAgY29ybmVyczogQ29ybmVyT2Zmc2V0cztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocmVnaW9uOiBwYXBlci5QYXRoLCBjb250ZW50OiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lvbiA9IHJlZ2lvbjtcclxuICAgICAgICAgICAgdGhpcy5fY29udGVudCA9IGNvbnRlbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKGNvbnRlbnQucGF0aERhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQuZmlsbENvbG9yID0gXCJncmF5XCI7XHJcbiAgICAgICAgICAgIHRoaXMuY29ybmVycyA9IFswLCAwLjI1LCAwLjUwLCAwLjc1XTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fY29udGVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fd2FycGVkKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGF0aCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXBkYXRlUGF0aCgpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udGVudE9yaWdpbiA9IHRoaXMuX2NvbnRlbnQuYm91bmRzLnRvcExlZnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRXaWR0aCA9IHRoaXMuX2NvbnRlbnQuYm91bmRzLndpZHRoO1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50SGVpZ2h0ID0gdGhpcy5fY29udGVudC5ib3VuZHMuaGVpZ2h0O1xyXG4gICAgICAgICAgICBjb25zdCByZWdpb25MZW5ndGggPSB0aGlzLl9yZWdpb24ubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCB0b3AgPSBuZXcgUGF0aFNlY3Rpb24oXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpb24sIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3JuZXJzWzBdLCBcclxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5wYXRoT2Zmc2V0TGVuZ3RoKHRoaXMuY29ybmVyc1swXSwgdGhpcy5jb3JuZXJzWzFdKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvdHRvbSA9IG5ldyBQYXRoU2VjdGlvbihcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lvbiwgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcnNbM10sXHJcbiAgICAgICAgICAgICAgICBQYXBlckhlbHBlcnMucGF0aE9mZnNldExlbmd0aCh0aGlzLmNvcm5lcnNbM10sIHRoaXMuY29ybmVyc1syXSwgZmFsc2UpLFxyXG4gICAgICAgICAgICAgICAgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHByb2plY3Rpb24gPSBQYXBlckhlbHBlcnMuZHVhbEJvdW5kc1BhdGhQcm9qZWN0aW9uKHRvcCwgYm90dG9tKTtcclxuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChjb250ZW50T3JpZ2luKTtcclxuICAgICAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBjb250ZW50V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIGNvbnRlbnRIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhzID0gdGhpcy5fY29udGVudC5jaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gPHBhcGVyLlBhdGg+aXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4UG9pbnRzID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEFzUG9pbnRzKHBhdGgsIDEwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChwID0+IHRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludChwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFBhdGggPSBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3hQYXRoLnJlZHVjZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4UGF0aDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQuYWRkQ2hpbGRyZW4obmV3UGF0aHMpO1xyXG5cclxuICAgICAgIH1cclxuXHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNsaWRlIG9mZnNldCBwb2ludHMgYnkgdGhlIGdpdmVuIGFtb3VudC5cclxuICAgICAgICAqIEBwYXJhbSB1bml0T2Zmc2V0OiB2YWx1ZSAwIHRvIDFcclxuICAgICAgICAqL1xyXG4gICAgICAgc2xpZGUodW5pdE9mZnNldDogbnVtYmVyKXtcclxuICAgICAgICAgICB0aGlzLmNvcm5lcnMgPSA8Q29ybmVyT2Zmc2V0cz50aGlzLmNvcm5lcnMubWFwKFxyXG4gICAgICAgICAgICAgICAgYyA9PiBTbmFwUGF0aC5pbmNyZW1lbnRPZmZzZXQoYywgdW5pdE9mZnNldCkpOyBcclxuICAgICAgIH1cclxuXHJcbiAgICAgICBwcml2YXRlIHN0YXRpYyBpbmNyZW1lbnRPZmZzZXQob2Zmc2V0OiBudW1iZXIsIGRlbHRhOiBudW1iZXIpe1xyXG4gICAgICAgICAgIGxldCByZXN1bHQgPSBvZmZzZXQgKyBkZWx0YTtcclxuICAgICAgICAgICBpZihyZXN1bHQgPCAwKXtcclxuICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgTWF0aC5yb3VuZChyZXN1bHQpICsgMTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICUgMTtcclxuICAgICAgICAgICAvL2NvbnNvbGUubG9nKGAke29mZnNldH0gKyAke2RlbHRhfSA9PiAke3Jlc3VsdH1gKTtcclxuICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBhdGggb2Zmc2V0cyBvbiByZWdpb24gZm9yIGNvcm5lcnMgb2YgU25hcFBhdGggY29udGVudCwgXHJcbiAgICAgKiAgIHN0YXJ0aW5nIHdpdGggdG9wTGVmdCBhbmQgcHJvY2VlZGluZyBjbG9ja3dpc2VcclxuICAgICAqICAgdG8gYm90dG9tTGVmdC4gXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCB0eXBlIENvcm5lck9mZnNldHMgPSBbXHJcbiAgICAgICAgbnVtYmVyLCAvLyB0b3BMZWZ0XHJcbiAgICAgICAgbnVtYmVyLCAvLyB0b3BSaWdodFxyXG4gICAgICAgIG51bWJlciwgLy8gYm90dG9tUmlnaHRcclxuICAgICAgICBudW1iZXIgIC8vIGJvdHRvbUxlZnRcclxuICAgIF1cclxuXHJcbn0iLCJuYW1lc3BhY2UgRm9udFNoYXBlIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVmVydGljYWxCb3VuZHNTdHJldGNoUGF0aCBleHRlbmRzIHBhcGVyLkdyb3VwIHtcclxuICAgICAgICBzdGF0aWMgcG9pbnRzUGVyUGF0aCA9IDIwMDtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfYm91bmRhcmllczogVmVydGljYWxCb3VuZHM7XHJcbiAgICAgICAgcHJpdmF0ZSBfY29udGVudDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX3dhcnBlZDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgICAgIGNvcm5lcnM6IENvcm5lck9mZnNldHM7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBjb250ZW50OiBwYXBlci5Db21wb3VuZFBhdGgsXHJcbiAgICAgICAgICAgIGJvdW5kYXJpZXM/OiBWZXJ0aWNhbEJvdW5kc1xyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY29udGVudCA9IGNvbnRlbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9ib3VuZGFyaWVzID0gYm91bmRhcmllcyB8fFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwcGVyOiBuZXcgcGFwZXIuUGF0aChbY29udGVudC5ib3VuZHMudG9wTGVmdCwgY29udGVudC5ib3VuZHMudG9wUmlnaHRdKSxcclxuICAgICAgICAgICAgICAgICAgICBsb3dlcjogbmV3IHBhcGVyLlBhdGgoW2NvbnRlbnQuYm91bmRzLmJvdHRvbUxlZnQsIGNvbnRlbnQuYm91bmRzLmJvdHRvbVJpZ2h0XSksXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZCA9IG5ldyBwYXBlci5Db21wb3VuZFBhdGgoY29udGVudC5wYXRoRGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5maWxsQ29sb3IgPSBcImxpZ2h0Z3JheVwiO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9jb250ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl93YXJwZWQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXRoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGRhdGVQYXRoKCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50T3JpZ2luID0gdGhpcy5fY29udGVudC5ib3VuZHMudG9wTGVmdDtcclxuICAgICAgICAgICAgY29uc3QgY29udGVudFdpZHRoID0gdGhpcy5fY29udGVudC5ib3VuZHMud2lkdGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRIZWlnaHQgPSB0aGlzLl9jb250ZW50LmJvdW5kcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLmR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbihcclxuICAgICAgICAgICAgICAgIHRoaXMuX2JvdW5kYXJpZXMudXBwZXIsIHRoaXMuX2JvdW5kYXJpZXMubG93ZXIpO1xyXG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtID0gbmV3IFBhdGhUcmFuc2Zvcm0ocG9pbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwb2ludCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwb2ludDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCByZWxhdGl2ZSA9IHBvaW50LnN1YnRyYWN0KGNvbnRlbnRPcmlnaW4pO1xyXG4gICAgICAgICAgICAgICAgbGV0IHVuaXQgPSBuZXcgcGFwZXIuUG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUueCAvIGNvbnRlbnRXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZS55IC8gY29udGVudEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvamVjdGVkID0gcHJvamVjdGlvbih1bml0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qZWN0ZWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV3UGF0aHMgPSB0aGlzLl9jb250ZW50LmNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSA8cGFwZXIuUGF0aD5pdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhQb2ludHMgPSBQYXBlckhlbHBlcnMudHJhY2VQYXRoQXNQb2ludHMocGF0aCwgVmVydGljYWxCb3VuZHNTdHJldGNoUGF0aC5wb2ludHNQZXJQYXRoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKHAgPT4gdHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50KHApKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4UGF0aCA9IG5ldyBwYXBlci5QYXRoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IHhQb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvY2t3aXNlOiBwYXRoLmNsb2Nrd2lzZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8veFBhdGgucmVkdWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHhQYXRoO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLnJlbW92ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5hZGRDaGlsZHJlbihuZXdQYXRocyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIlxyXG5uYW1lc3BhY2UgRm9udFNoYXBlIHtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFZlcnRpY2FsQm91bmRzIHtcclxuICAgICAgICB1cHBlcjogcGFwZXIuUGF0aDtcclxuICAgICAgICBsb3dlcjogcGFwZXIuUGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEZvbnRTcGVjaWZpZXIge1xyXG4gICAgICAgIGZhbWlseTogc3RyaW5nO1xyXG4gICAgICAgIHZhcmlhbnQ/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBGYW1pbHlSZWNvcmQge1xyXG4gICAgICAgIGtpbmQ/OiBzdHJpbmc7XHJcbiAgICAgICAgZmFtaWx5Pzogc3RyaW5nO1xyXG4gICAgICAgIGNhdGVnb3J5Pzogc3RyaW5nO1xyXG4gICAgICAgIHZhcmlhbnRzPzogc3RyaW5nW107XHJcbiAgICAgICAgc3Vic2V0cz86IHN0cmluZ1tdO1xyXG4gICAgICAgIHZlcnNpb24/OiBzdHJpbmc7XHJcbiAgICAgICAgbGFzdE1vZGlmaWVkPzogc3RyaW5nO1xyXG4gICAgICAgIGZpbGVzPzogeyBbdmFyaWFudDogc3RyaW5nXTogc3RyaW5nOyB9O1xyXG4gICAgfVxyXG5cclxufSIsIiJdfQ==