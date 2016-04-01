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
     */
    function getMaxExportDpi(itemSize) {
        var itemArea = itemSize.width * itemSize.height;
        return 0.999 * Math.sqrt(PaperHelpers.SAFARI_MAX_CANVAS_AREA)
            * (paper.view.resolution)
            / Math.sqrt(itemArea);
    }
    PaperHelpers.getMaxExportDpi = getMaxExportDpi;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9wYXBlci1leHQudHMiLCIuLi9zcmMvRm9udENhdGFsb2cudHMiLCIuLi9zcmMvUGFwZXJIZWxwZXJzLnRzIiwiLi4vc3JjL1BhcnNlZEZvbnRzLnRzIiwiLi4vc3JjL1BhdGhTZWN0aW9uLnRzIiwiLi4vc3JjL1BhdGhUcmFuc2Zvcm0udHMiLCIuLi9zcmMvU25hcFBhdGgudHMiLCIuLi9zcmMvVmVydGljYWxCb3VuZHNTdHJldGNoUGF0aC50cyIsIi4uL3NyYy9tb2RlbHMudHMiLCIuLi9zcmMvc2V0dXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUNBQSxJQUFVLFNBQVMsQ0FvSWxCO0FBcElELFdBQVUsU0FBUyxFQUFDLENBQUM7SUFFakI7UUF1Q0kscUJBQVksT0FBdUI7WUF2Q3ZDLGlCQWdJQztZQTlIRyx5Q0FBeUM7WUFDekMsb0JBQWUsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFzQy9DLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBMUMsQ0FBMEMsQ0FBQyxDQUFDO1lBRTFFLG1CQUFtQjtZQUNuQjtnQkFDSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBQyxHQUFXLEVBQUUsR0FBVztvQkFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM3QixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUN2RCxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFD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STtvQkFDWixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7aUJBQzVCLENBQUMsQ0FBQztnQkFDSCxpQkFBaUI7Z0JBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUE7WUFDTixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUE5RE0sdUNBQWEsR0FBRyxHQUFHLENBQUM7UUErRC9CLGdDQUFDO0lBQUQsQ0FBQyxBQWhFRCxDQUErQyxLQUFLLENBQUMsS0FBSyxHQWdFekQ7SUFoRVksbUNBQXlCLDRCQWdFckMsQ0FBQTtBQUVMLENBQUMsRUFwRVMsU0FBUyxLQUFULFNBQVMsUUFvRWxCO0FDNUNBIiwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSBtb2R1bGUgcGFwZXIge1xyXG5cclxuICAgIGludGVyZmFjZSBDdXJ2ZWxpa2Uge1xyXG4gICAgICAgIGxlbmd0aDogbnVtYmVyO1xyXG4gICAgICAgIGdldFBvaW50QXQob2Zmc2V0OiBudW1iZXIpOiBwYXBlci5Qb2ludDtcclxuICAgIH1cclxuICAgIFxyXG59IiwibmFtZXNwYWNlIEZvbnRTaGFwZSB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEZvbnRDYXRhbG9nIHtcclxuXHJcbiAgICAgICAgLy8gRW5jb3VudGVyZWQgaXNzdWVzIHdpdGggdGhlc2UgZmFtaWxpZXNcclxuICAgICAgICBleGNsdWRlRmFtaWxpZXMgPSBbXCJBbnRvblwiLCBcIkFyaW1vXCIsIFwiU2xhYm8gMjdweFwiXTtcclxuXHJcbiAgICAgICAgc3RhdGljIGZyb21Mb2NhbChwYXRoOiBzdHJpbmcpOiBKUXVlcnlQcm9taXNlPEZvbnRDYXRhbG9nPiB7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBwYXRoLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2U6IHsga2luZDogc3RyaW5nLCBpdGVtczogRmFtaWx5UmVjb3JkW10gfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRm9udENhdGFsb2cocmVzcG9uc2UuaXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmVycm9yKHBhdGgsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGZyb21SZW1vdGUoKTogSlF1ZXJ5UHJvbWlzZTxGb250Q2F0YWxvZz4ge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3dlYmZvbnRzL3YxL3dlYmZvbnRzPyc7XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSAna2V5PUdPT0dMRS1BUEktS0VZJztcclxuICAgICAgICAgICAgdmFyIHNvcnQgPSBcInBvcHVsYXJpdHlcIjtcclxuICAgICAgICAgICAgdmFyIG9wdCA9ICdzb3J0PScgKyBzb3J0ICsgJyYnO1xyXG4gICAgICAgICAgICB2YXIgcmVxID0gdXJsICsgb3B0ICsga2V5O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHJlcSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlOiB7IGtpbmQ6IHN0cmluZywgaXRlbXM6IEZhbWlseVJlY29yZFtdIH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZvbnRDYXRhbG9nKHJlc3BvbnNlLml0ZW1zKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5lcnJvcihyZXEsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSByZWNvcmRzOiBGYW1pbHlSZWNvcmRbXTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocmVjb3JkczogRmFtaWx5UmVjb3JkW10pIHtcclxuXHJcbiAgICAgICAgICAgIHJlY29yZHMgPSByZWNvcmRzLmZpbHRlcihyID0+IHRoaXMuZXhjbHVkZUZhbWlsaWVzLmluZGV4T2Yoci5mYW1pbHkpIDwgMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBtYWtlIGZpbGVzIGh0dHBzXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVjb3JkIG9mIHJlY29yZHMpIHtcclxuICAgICAgICAgICAgICAgIF8uZm9yT3duKHJlY29yZC5maWxlcywgKHZhbDogc3RyaW5nLCBrZXk6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfLnN0YXJ0c1dpdGgodmFsLCBcImh0dHA6XCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZC5maWxlc1trZXldID0gdmFsLnJlcGxhY2UoXCJodHRwOlwiLCBcImh0dHBzOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRzID0gcmVjb3JkcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldExpc3QobGltaXQ/OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICEhbGltaXRcclxuICAgICAgICAgICAgICAgID8gdGhpcy5yZWNvcmRzLnNsaWNlKDAsIGxpbWl0KVxyXG4gICAgICAgICAgICAgICAgOiB0aGlzLnJlY29yZHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRDYXRlZ29yaWVzKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8udW5pcSh0aGlzLnJlY29yZHMubWFwKGYgPT4gZi5jYXRlZ29yeSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0RmFtaWxpZXMoY2F0ZWdvcnk/OiBzdHJpbmcpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgICAgIGlmICghY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlY29yZHMubWFwKGYgPT4gZi5mYW1pbHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlY29yZHNcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZiA9PiBmLmNhdGVnb3J5ID09PSBjYXRlZ29yeSlcclxuICAgICAgICAgICAgICAgIC5tYXAoZiA9PiBmLmZhbWlseSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRWYXJpYW50cyhmYW1pbHk6IHN0cmluZyk6IHN0cmluZ1tdIHtcclxuICAgICAgICAgICAgY29uc3QgZmFtID0gdGhpcy5nZXRSZWNvcmQoZmFtaWx5KTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbSAmJiBmYW0udmFyaWFudHMgfHwgW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRSZWNvcmQoZmFtaWx5OiBzdHJpbmcpOiBGYW1pbHlSZWNvcmQge1xyXG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMucmVjb3JkcywgZmYgPT4gZmYuZmFtaWx5ID09PSBmYW1pbHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0VXJsKGZhbWlseTogc3RyaW5nLCB2YXJpYW50Pzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXRSZWNvcmQoZmFtaWx5KTtcclxuICAgICAgICAgICAgaWYgKCFyZWNvcmQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIm5vIGRlZmluaXRpb24gYXZhaWxhYmxlIGZvciBmYW1pbHlcIiwgZmFtaWx5KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdmFyaWFudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyaWFudCA9IEZvbnRDYXRhbG9nLmRlZmF1bHRWYXJpYW50KHJlY29yZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGZpbGUgPSByZWNvcmQuZmlsZXNbdmFyaWFudF07XHJcbiAgICAgICAgICAgIGlmICghZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwibm8gZm9udCBmaWxlIGF2YWlsYWJsZSBmb3IgdmFyaWFudFwiLCBmYW1pbHksIHZhcmlhbnQpO1xyXG4gICAgICAgICAgICAgICAgZmlsZSA9IHJlY29yZC5maWxlc1swXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmlsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBkZWZhdWx0VmFyaWFudChyZWNvcmQ6IEZhbWlseVJlY29yZCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghcmVjb3JkKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHJlY29yZC52YXJpYW50cy5pbmRleE9mKFwicmVndWxhclwiKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJyZWd1bGFyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlY29yZC52YXJpYW50c1swXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZvciBhIGxpc3Qgb2YgZmFtaWxpZXMsIGxvYWQgYWxwaGFudW1lcmljIGNoYXJzIGludG8gYnJvd3NlclxyXG4gICAgICAgICAqICAgdG8gc3VwcG9ydCBwcmV2aWV3aW5nLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBsb2FkUHJldmlld1N1YnNldHMoZmFtaWxpZXM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2h1bmsgb2YgXy5jaHVuayhmYW1pbGllcy5maWx0ZXIoZiA9PiAhIWYpLCAxMCkpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgV2ViRm9udC5sb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NlczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvb2dsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFtaWxpZXM6IDxzdHJpbmdbXT5jaHVuayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIGxvYWRpbmcgZm9udCBzdWJzZXRzXCIsIGVyciwgY2h1bmspO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIlxyXG5pbnRlcmZhY2UgQ29uc29sZSB7XHJcbiAgICBsb2cobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZDtcclxuICAgIGxvZyguLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkO1xyXG59XHJcblxyXG5uYW1lc3BhY2UgUGFwZXJIZWxwZXJzIHtcclxuXHJcbiAgICBleHBvcnQgY29uc3QgU0FGQVJJX01BWF9DQU5WQVNfQVJFQSA9IDY3MTA4ODY0O1xyXG5cclxuICAgIGV4cG9ydCB2YXIgc2hvdWxkTG9nSW5mbzogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdCBsb2cgPSBmdW5jdGlvbiguLi5wYXJhbXM6IGFueVtdKSB7XHJcbiAgICAgICAgaWYgKHNob3VsZExvZ0luZm8pIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coLi4ucGFyYW1zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXRlcm1pbmUgdGhlIG1heCBkcGkgdGhhdCBjYW4gc3VwcG9ydGVkIGJ5IENhbnZhcy5cclxuICAgICAqIFVzaW5nIFNhZmFyaSBhcyB0aGUgbWVhc3VyZSwgYmVjYXVzZSBpdCBzZWVtcyB0byBoYXZlIHRoZSBzbWFsbGVzdCBsaW1pdC5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1heEV4cG9ydERwaShpdGVtU2l6ZTogcGFwZXIuU2l6ZSl7XHJcbiAgICAgICAgY29uc3QgaXRlbUFyZWEgPSBpdGVtU2l6ZS53aWR0aCAqIGl0ZW1TaXplLmhlaWdodDtcclxuICAgICAgICByZXR1cm4gMC45OTkgKiBNYXRoLnNxcnQoU0FGQVJJX01BWF9DQU5WQVNfQVJFQSkgXHJcbiAgICAgICAgICAgICAgICAqIChwYXBlci52aWV3LnJlc29sdXRpb24pIFxyXG4gICAgICAgICAgICAgICAgLyAgTWF0aC5zcXJ0KGl0ZW1BcmVhKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgaW1wb3J0T3BlblR5cGVQYXRoID0gZnVuY3Rpb24ob3BlblBhdGg6IG9wZW50eXBlLlBhdGgpOiBwYXBlci5Db21wb3VuZFBhdGgge1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKG9wZW5QYXRoLnRvUGF0aERhdGEoKSk7XHJcbiAgICAgICAgLy8gbGV0IHN2ZyA9IG9wZW5QYXRoLnRvU1ZHKDQpO1xyXG4gICAgICAgIC8vIHJldHVybiA8cGFwZXIuUGF0aD5wYXBlci5wcm9qZWN0LmltcG9ydFNWRyhzdmcpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCB0cmFjZVBhdGhJdGVtID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aEl0ZW0sIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLlBhdGhJdGVtIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNlQ29tcG91bmRQYXRoKDxwYXBlci5Db21wb3VuZFBhdGg+cGF0aCwgcG9pbnRzUGVyUGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhY2VQYXRoKDxwYXBlci5QYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgdHJhY2VDb21wb3VuZFBhdGggPSBmdW5jdGlvbihwYXRoOiBwYXBlci5Db21wb3VuZFBhdGgsIHBvaW50c1BlclBhdGg6IG51bWJlcik6IHBhcGVyLkNvbXBvdW5kUGF0aCB7XHJcbiAgICAgICAgaWYgKCFwYXRoLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBhdGhzID0gcGF0aC5jaGlsZHJlbi5tYXAocCA9PlxyXG4gICAgICAgICAgICB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wLCBwb2ludHNQZXJQYXRoKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5Db21wb3VuZFBhdGgoe1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogcGF0aHMsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCB0cmFjZVBhdGhBc1BvaW50cyA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGgsIG51bVBvaW50czogbnVtYmVyKTogcGFwZXIuUG9pbnRbXSB7XHJcbiAgICAgICAgbGV0IHBhdGhMZW5ndGggPSBwYXRoLmxlbmd0aDtcclxuICAgICAgICBsZXQgb2Zmc2V0SW5jciA9IHBhdGhMZW5ndGggLyBudW1Qb2ludHM7XHJcbiAgICAgICAgbGV0IHBvaW50cyA9IFtdO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGkrKyA8IG51bVBvaW50cykge1xyXG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBwYXRoLmdldFBvaW50QXQoTWF0aC5taW4ob2Zmc2V0LCBwYXRoTGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IG9mZnNldEluY3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcG9pbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCB0cmFjZVBhdGggPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoLCBudW1Qb2ludHM6IG51bWJlcik6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgIGxldCBwb2ludHMgPSBQYXBlckhlbHBlcnMudHJhY2VQYXRoQXNQb2ludHMocGF0aCwgbnVtUG9pbnRzKTtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlBhdGgoe1xyXG4gICAgICAgICAgICBzZWdtZW50czogcG9pbnRzLFxyXG4gICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgZHVhbEJvdW5kc1BhdGhQcm9qZWN0aW9uID0gZnVuY3Rpb24odG9wUGF0aDogcGFwZXIuQ3VydmVsaWtlLCBib3R0b21QYXRoOiBwYXBlci5DdXJ2ZWxpa2UpXHJcbiAgICAgICAgOiAodW5pdFBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQge1xyXG4gICAgICAgIGNvbnN0IHRvcFBhdGhMZW5ndGggPSB0b3BQYXRoLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBib3R0b21QYXRoTGVuZ3RoID0gYm90dG9tUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgICAgIGxldCB0b3BQb2ludCA9IHRvcFBhdGguZ2V0UG9pbnRBdCh1bml0UG9pbnQueCAqIHRvcFBhdGhMZW5ndGgpO1xyXG4gICAgICAgICAgICBsZXQgYm90dG9tUG9pbnQgPSBib3R0b21QYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiBib3R0b21QYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICAgaWYgKHRvcFBvaW50ID09IG51bGwgfHwgYm90dG9tUG9pbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiY291bGQgbm90IGdldCBwcm9qZWN0ZWQgcG9pbnQgZm9yIHVuaXQgcG9pbnQgXCIgKyB1bml0UG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvcFBvaW50O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvcFBvaW50LmFkZChib3R0b21Qb2ludC5zdWJ0cmFjdCh0b3BQb2ludCkubXVsdGlwbHkodW5pdFBvaW50LnkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG1hcmtlckdyb3VwOiBwYXBlci5Hcm91cDtcclxuXHJcbiAgICBleHBvcnQgY29uc3QgcmVzZXRNYXJrZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKFBhcGVySGVscGVycy5tYXJrZXJHcm91cCkge1xyXG4gICAgICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcmtlckdyb3VwID0gbmV3IHBhcGVyLkdyb3VwKCk7XHJcbiAgICAgICAgbWFya2VyR3JvdXAub3BhY2l0eSA9IDAuMjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IG1hcmtlckxpbmUgPSBmdW5jdGlvbihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICBsZXQgbGluZSA9IHBhcGVyLlBhdGguTGluZShhLCBiKTtcclxuICAgICAgICBsaW5lLnN0cm9rZUNvbG9yID0gJ2dyZWVuJztcclxuICAgICAgICAvL2xpbmUuZGFzaEFycmF5ID0gWzUsIDVdO1xyXG4gICAgICAgIFBhcGVySGVscGVycy5tYXJrZXJHcm91cC5hZGRDaGlsZChsaW5lKTtcclxuICAgICAgICByZXR1cm4gbGluZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgbWFya2VyID0gZnVuY3Rpb24ocG9pbnQ6IHBhcGVyLlBvaW50LCBsYWJlbDogc3RyaW5nKTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgLy9sZXQgbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvaW50LCAxMCk7XHJcbiAgICAgICAgbGV0IG1hcmtlciA9IG5ldyBwYXBlci5Qb2ludFRleHQocG9pbnQpO1xyXG4gICAgICAgIG1hcmtlci5mb250U2l6ZSA9IDM2O1xyXG4gICAgICAgIG1hcmtlci5jb250ZW50ID0gbGFiZWw7XHJcbiAgICAgICAgbWFya2VyLnN0cm9rZUNvbG9yID0gXCJyZWRcIjtcclxuICAgICAgICBtYXJrZXIuYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgLy9QYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobWFya2VyKTtcclxuICAgICAgICByZXR1cm4gbWFya2VyO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBzaW1wbGlmeSA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGhJdGVtLCB0b2xlcmFuY2U/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNpbXBsaWZ5KDxwYXBlci5QYXRoSXRlbT5wLCB0b2xlcmFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKDxwYXBlci5QYXRoPnBhdGgpLnNpbXBsaWZ5KHRvbGVyYW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluZCBzZWxmIG9yIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgZmluZFNlbGZPckFuY2VzdG9yID0gZnVuY3Rpb24oaXRlbTogcGFwZXIuSXRlbSwgcHJlZGljYXRlOiAoaTogcGFwZXIuSXRlbSkgPT4gYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUoaXRlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQYXBlckhlbHBlcnMuZmluZEFuY2VzdG9yKGl0ZW0sIHByZWRpY2F0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIG5lYXJlc3QgYW5jZXN0b3Igc2F0aXNmeWluZyB0aGUgcHJlZGljYXRlLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgZmluZEFuY2VzdG9yID0gZnVuY3Rpb24oaXRlbTogcGFwZXIuSXRlbSwgcHJlZGljYXRlOiAoaTogcGFwZXIuSXRlbSkgPT4gYm9vbGVhbikge1xyXG4gICAgICAgIGlmICghaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHByaW9yOiBwYXBlci5JdGVtO1xyXG4gICAgICAgIGxldCBjaGVja2luZyA9IGl0ZW0ucGFyZW50O1xyXG4gICAgICAgIHdoaWxlIChjaGVja2luZyAmJiBjaGVja2luZyAhPT0gcHJpb3IpIHtcclxuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShjaGVja2luZykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjaGVja2luZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmlvciA9IGNoZWNraW5nO1xyXG4gICAgICAgICAgICBjaGVja2luZyA9IGNoZWNraW5nLnBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgY29ybmVycyBvZiB0aGUgcmVjdCwgY2xvY2t3aXNlIHN0YXJ0aW5nIGZyb20gdG9wTGVmdFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgY29ybmVycyA9IGZ1bmN0aW9uKHJlY3Q6IHBhcGVyLlJlY3RhbmdsZSk6IHBhcGVyLlBvaW50W10ge1xyXG4gICAgICAgIHJldHVybiBbcmVjdC50b3BMZWZ0LCByZWN0LnRvcFJpZ2h0LCByZWN0LmJvdHRvbVJpZ2h0LCByZWN0LmJvdHRvbUxlZnRdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdGhlIG1pZHBvaW50IGJldHdlZW4gdHdvIHBvaW50c1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgbWlkcG9pbnQgPSBmdW5jdGlvbihhOiBwYXBlci5Qb2ludCwgYjogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICByZXR1cm4gYi5zdWJ0cmFjdChhKS5kaXZpZGUoMikuYWRkKGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBjbG9uZVNlZ21lbnQgPSBmdW5jdGlvbihzZWdtZW50OiBwYXBlci5TZWdtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KHNlZ21lbnQucG9pbnQsIHNlZ21lbnQuaGFuZGxlSW4sIHNlZ21lbnQuaGFuZGxlT3V0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgLSBiLCB3aGVyZSBhIGFuZCBiIGFyZSB1bml0IG9mZnNldHMgYWxvbmcgYSBjbG9zZWQgcGF0aC5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHBhdGhPZmZzZXRMZW5ndGgoc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGNsb2Nrd2lzZTogYm9vbGVhbiA9IHRydWUpe1xyXG4gICAgICAgIHN0YXJ0ID0gcGF0aE9mZnNldE5vcm1hbGl6ZShzdGFydCk7XHJcbiAgICAgICAgZW5kID0gcGF0aE9mZnNldE5vcm1hbGl6ZShlbmQpO1xyXG4gICAgICAgIGlmKGNsb2Nrd2lzZSl7XHJcbiAgICAgICAgICAgIGlmKHN0YXJ0ID4gZW5kKSB7XHJcbiAgICAgICAgICAgICAgICBlbmQgKz0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcGF0aE9mZnNldE5vcm1hbGl6ZShlbmQgLSBzdGFydCk7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihlbmQgPiBzdGFydCl7XHJcbiAgICAgICAgICAgIHN0YXJ0ICs9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXRoT2Zmc2V0Tm9ybWFsaXplKHN0YXJ0IC0gZW5kKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHBhdGhPZmZzZXROb3JtYWxpemUob2Zmc2V0OiBudW1iZXIpe1xyXG4gICAgICAgIGlmKG9mZnNldCA8IDApe1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gTWF0aC5yb3VuZChvZmZzZXQpICsgMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9mZnNldCAlIDE7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG4iLCJuYW1lc3BhY2UgRm9udFNoYXBlIHtcclxuXHJcbiAgICBleHBvcnQgdHlwZSBQYXJzZWRGb250ID0ge1xyXG4gICAgICAgIHVybDogc3RyaW5nLFxyXG4gICAgICAgIGZvbnQ6IG9wZW50eXBlLkZvbnRcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUGFyc2VkRm9udHMge1xyXG5cclxuICAgICAgICBmb250czogeyBbdXJsOiBzdHJpbmddOiBvcGVudHlwZS5Gb250OyB9ID0ge307XHJcblxyXG4gICAgICAgIF9mb250TG9hZGVkOiAocGFyc2VkOiBQYXJzZWRGb250KSA9PiB2b2lkO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihmb250TG9hZGVkPzogKHBhcnNlZDogUGFyc2VkRm9udCkgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9mb250TG9hZGVkID0gZm9udExvYWRlZCB8fCAoKCkgPT4geyB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCh1cmw6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8UGFyc2VkRm9udD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF1cmwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGZvbnQgPSB0aGlzLmZvbnRzW3VybF07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZvbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgdXJsLCBmb250IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBvcGVudHlwZS5sb2FkKHVybCwgKGVyciwgZm9udCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIsIHsgdXJsIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZvbnRzW3VybF0gPSBmb250O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHt1cmwsIGZvbnR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9udExvYWRlZCh7dXJsLCBmb250fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIEZvbnRTaGFwZSB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFBhdGhTZWN0aW9uIGltcGxlbWVudHMgcGFwZXIuQ3VydmVsaWtlIHtcclxuICAgICAgICBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgICAgIHVuaXRTdGFydDogbnVtYmVyO1xyXG4gICAgICAgIHVuaXRMZW5ndGg6IG51bWJlcjtcclxuICAgICAgICBjbG9ja3dpc2U6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFN0YXJ0IGFuZCBlbmQgYXJlIHVuaXQgbGVuZ3RoczogMCB0byAxLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHBhdGg6IHBhcGVyLlBhdGgsIFxyXG4gICAgICAgICAgICB1bml0U3RhcnQ6IG51bWJlciwgXHJcbiAgICAgICAgICAgIHVuaXRMZW5ndGg6IG51bWJlciwgXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICAgICAgdGhpcy51bml0U3RhcnQgPSB1bml0U3RhcnQ7XHJcbiAgICAgICAgICAgIHRoaXMudW5pdExlbmd0aCA9IHVuaXRMZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvY2t3aXNlID0gY2xvY2t3aXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudW5pdExlbmd0aCAqIHRoaXMucGF0aC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcGFyYW0gb2Zmc2V0OiBsZW5ndGggb2Zmc2V0IHJlbGF0aXZlIHRvIHRoaXMgc2VjdGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRQb2ludEF0KG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGhMZW5ndGggPSB0aGlzLnBhdGgubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLnBhdGguY2xvY2t3aXNlID09IHRoaXMuY2xvY2t3aXNlID8gMSA6IC0xO1xyXG4gICAgICAgICAgICBsZXQgcGF0aE9mZnNldCA9IHRoaXMudW5pdFN0YXJ0ICogcGF0aExlbmd0aCArIG9mZnNldCAqIGRpcmVjdGlvbjtcclxuICAgICAgICAgICAgaWYgKHBhdGhPZmZzZXQgPiBwYXRoTGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgIHBhdGhPZmZzZXQgLT0gcGF0aExlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihwYXRoT2Zmc2V0IDwgMCl7XHJcbiAgICAgICAgICAgICAgICBwYXRoT2Zmc2V0ICs9IHBhdGhMZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGF0aC5nZXRQb2ludEF0KHBhdGhPZmZzZXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgRm9udFNoYXBlIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUGF0aFRyYW5zZm9ybSB7XHJcbiAgICAgICAgcG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludFRyYW5zZm9ybSA9IHBvaW50VHJhbnNmb3JtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJhbnNmb3JtUG9pbnQocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb2ludFRyYW5zZm9ybShwb2ludCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cmFuc2Zvcm1QYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSkge1xyXG4gICAgICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cmFuc2Zvcm1Db21wb3VuZFBhdGgocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cmFuc2Zvcm1QYXRoKHBhdGg6IHBhcGVyLlBhdGgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiBwYXRoLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgb3JpZ1BvaW50ID0gc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdQb2ludCA9IHRoaXMudHJhbnNmb3JtUG9pbnQoc2VnbWVudC5wb2ludCk7XHJcbiAgICAgICAgICAgICAgICBvcmlnUG9pbnQueCA9IG5ld1BvaW50Lng7XHJcbiAgICAgICAgICAgICAgICBvcmlnUG9pbnQueSA9IG5ld1BvaW50Lnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIEZvbnRTaGFwZSB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFNuYXBQYXRoIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9yZWdpb246IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgcHJpdmF0ZSBfY29udGVudDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX3dhcnBlZDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgICAgIGNvcm5lcnM6IENvcm5lck9mZnNldHM7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHJlZ2lvbjogcGFwZXIuUGF0aCwgY29udGVudDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yZWdpb24gPSByZWdpb247XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQgPSBjb250ZW50O1xyXG4gICAgICAgICAgICB0aGlzLl9jb250ZW50LnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChjb250ZW50LnBhdGhEYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLmZpbGxDb2xvciA9IFwiZ3JheVwiO1xyXG4gICAgICAgICAgICB0aGlzLmNvcm5lcnMgPSBbMCwgMC4yNSwgMC41MCwgMC43NV07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2NvbnRlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3dhcnBlZCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhdGgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVwZGF0ZVBhdGgoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRPcmlnaW4gPSB0aGlzLl9jb250ZW50LmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50V2lkdGggPSB0aGlzLl9jb250ZW50LmJvdW5kcy53aWR0aDtcclxuICAgICAgICAgICAgY29uc3QgY29udGVudEhlaWdodCA9IHRoaXMuX2NvbnRlbnQuYm91bmRzLmhlaWdodDtcclxuICAgICAgICAgICAgY29uc3QgcmVnaW9uTGVuZ3RoID0gdGhpcy5fcmVnaW9uLmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgdG9wID0gbmV3IFBhdGhTZWN0aW9uKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaW9uLCBcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ybmVyc1swXSwgXHJcbiAgICAgICAgICAgICAgICBQYXBlckhlbHBlcnMucGF0aE9mZnNldExlbmd0aCh0aGlzLmNvcm5lcnNbMF0sIHRoaXMuY29ybmVyc1sxXSkpO1xyXG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSBuZXcgUGF0aFNlY3Rpb24oXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpb24sIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3JuZXJzWzNdLFxyXG4gICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnBhdGhPZmZzZXRMZW5ndGgodGhpcy5jb3JuZXJzWzNdLCB0aGlzLmNvcm5lcnNbMl0sIGZhbHNlKSxcclxuICAgICAgICAgICAgICAgIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLmR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbih0b3AsIGJvdHRvbSk7XHJcbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm0gPSBuZXcgUGF0aFRyYW5zZm9ybShwb2ludCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHJlbGF0aXZlID0gcG9pbnQuc3VidHJhY3QoY29udGVudE9yaWdpbik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdW5pdCA9IG5ldyBwYXBlci5Qb2ludChcclxuICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZS54IC8gY29udGVudFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnkgLyBjb250ZW50SGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGxldCBwcm9qZWN0ZWQgPSBwcm9qZWN0aW9uKHVuaXQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3RlZDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXdQYXRocyA9IHRoaXMuX2NvbnRlbnQuY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgIC5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IDxwYXBlci5QYXRoPml0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFBvaW50cyA9IFBhcGVySGVscGVycy50cmFjZVBhdGhBc1BvaW50cyhwYXRoLCAxMDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAocCA9PiB0cmFuc2Zvcm0udHJhbnNmb3JtUG9pbnQocCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhQYXRoID0gbmV3IHBhcGVyLlBhdGgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogeFBvaW50cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy94UGF0aC5yZWR1Y2UoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geFBhdGg7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLmFkZENoaWxkcmVuKG5ld1BhdGhzKTtcclxuXHJcbiAgICAgICB9XHJcblxyXG4gICAgICAgLyoqXHJcbiAgICAgICAgKiBTbGlkZSBvZmZzZXQgcG9pbnRzIGJ5IHRoZSBnaXZlbiBhbW91bnQuXHJcbiAgICAgICAgKiBAcGFyYW0gdW5pdE9mZnNldDogdmFsdWUgMCB0byAxXHJcbiAgICAgICAgKi9cclxuICAgICAgIHNsaWRlKHVuaXRPZmZzZXQ6IG51bWJlcil7XHJcbiAgICAgICAgICAgdGhpcy5jb3JuZXJzID0gPENvcm5lck9mZnNldHM+dGhpcy5jb3JuZXJzLm1hcChcclxuICAgICAgICAgICAgICAgIGMgPT4gU25hcFBhdGguaW5jcmVtZW50T2Zmc2V0KGMsIHVuaXRPZmZzZXQpKTsgXHJcbiAgICAgICB9XHJcblxyXG4gICAgICAgcHJpdmF0ZSBzdGF0aWMgaW5jcmVtZW50T2Zmc2V0KG9mZnNldDogbnVtYmVyLCBkZWx0YTogbnVtYmVyKXtcclxuICAgICAgICAgICBsZXQgcmVzdWx0ID0gb2Zmc2V0ICsgZGVsdGE7XHJcbiAgICAgICAgICAgaWYocmVzdWx0IDwgMCl7XHJcbiAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIE1hdGgucm91bmQocmVzdWx0KSArIDE7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCAlIDE7XHJcbiAgICAgICAgICAgLy9jb25zb2xlLmxvZyhgJHtvZmZzZXR9ICsgJHtkZWx0YX0gPT4gJHtyZXN1bHR9YCk7XHJcbiAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQYXRoIG9mZnNldHMgb24gcmVnaW9uIGZvciBjb3JuZXJzIG9mIFNuYXBQYXRoIGNvbnRlbnQsIFxyXG4gICAgICogICBzdGFydGluZyB3aXRoIHRvcExlZnQgYW5kIHByb2NlZWRpbmcgY2xvY2t3aXNlXHJcbiAgICAgKiAgIHRvIGJvdHRvbUxlZnQuIFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgdHlwZSBDb3JuZXJPZmZzZXRzID0gW1xyXG4gICAgICAgIG51bWJlciwgLy8gdG9wTGVmdFxyXG4gICAgICAgIG51bWJlciwgLy8gdG9wUmlnaHRcclxuICAgICAgICBudW1iZXIsIC8vIGJvdHRvbVJpZ2h0XHJcbiAgICAgICAgbnVtYmVyICAvLyBib3R0b21MZWZ0XHJcbiAgICBdXHJcblxyXG59IiwibmFtZXNwYWNlIEZvbnRTaGFwZSB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFZlcnRpY2FsQm91bmRzU3RyZXRjaFBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcbiAgICAgICAgc3RhdGljIHBvaW50c1BlclBhdGggPSAyMDA7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2JvdW5kYXJpZXM6IFZlcnRpY2FsQm91bmRzO1xyXG4gICAgICAgIHByaXZhdGUgX2NvbnRlbnQ6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgICAgICBwcml2YXRlIF93YXJwZWQ6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgICAgICBjb3JuZXJzOiBDb3JuZXJPZmZzZXRzO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgY29udGVudDogcGFwZXIuQ29tcG91bmRQYXRoLFxyXG4gICAgICAgICAgICBib3VuZGFyaWVzPzogVmVydGljYWxCb3VuZHNcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQgPSBjb250ZW50O1xyXG4gICAgICAgICAgICB0aGlzLl9jb250ZW50LnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fYm91bmRhcmllcyA9IGJvdW5kYXJpZXMgfHxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB1cHBlcjogbmV3IHBhcGVyLlBhdGgoW2NvbnRlbnQuYm91bmRzLnRvcExlZnQsIGNvbnRlbnQuYm91bmRzLnRvcFJpZ2h0XSksXHJcbiAgICAgICAgICAgICAgICAgICAgbG93ZXI6IG5ldyBwYXBlci5QYXRoKFtjb250ZW50LmJvdW5kcy5ib3R0b21MZWZ0LCBjb250ZW50LmJvdW5kcy5ib3R0b21SaWdodF0pLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQgPSBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKGNvbnRlbnQucGF0aERhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQuZmlsbENvbG9yID0gXCJsaWdodGdyYXlcIjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fY29udGVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fd2FycGVkKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGF0aCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXBkYXRlUGF0aCgpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udGVudE9yaWdpbiA9IHRoaXMuX2NvbnRlbnQuYm91bmRzLnRvcExlZnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRXaWR0aCA9IHRoaXMuX2NvbnRlbnQuYm91bmRzLndpZHRoO1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50SGVpZ2h0ID0gdGhpcy5fY29udGVudC5ib3VuZHMuaGVpZ2h0O1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdGlvbiA9IFBhcGVySGVscGVycy5kdWFsQm91bmRzUGF0aFByb2plY3Rpb24oXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ib3VuZGFyaWVzLnVwcGVyLCB0aGlzLl9ib3VuZGFyaWVzLmxvd2VyKTtcclxuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChjb250ZW50T3JpZ2luKTtcclxuICAgICAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBjb250ZW50V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIGNvbnRlbnRIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhzID0gdGhpcy5fY29udGVudC5jaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gPHBhcGVyLlBhdGg+aXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4UG9pbnRzID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEFzUG9pbnRzKHBhdGgsIFZlcnRpY2FsQm91bmRzU3RyZXRjaFBhdGgucG9pbnRzUGVyUGF0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChwID0+IHRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludChwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFBhdGggPSBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3hQYXRoLnJlZHVjZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4UGF0aDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQuYWRkQ2hpbGRyZW4obmV3UGF0aHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJcclxubmFtZXNwYWNlIEZvbnRTaGFwZSB7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBWZXJ0aWNhbEJvdW5kcyB7XHJcbiAgICAgICAgdXBwZXI6IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgbG93ZXI6IHBhcGVyLlBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBGb250U3BlY2lmaWVyIHtcclxuICAgICAgICBmYW1pbHk6IHN0cmluZztcclxuICAgICAgICB2YXJpYW50Pzogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRmFtaWx5UmVjb3JkIHtcclxuICAgICAgICBraW5kPzogc3RyaW5nO1xyXG4gICAgICAgIGZhbWlseT86IHN0cmluZztcclxuICAgICAgICBjYXRlZ29yeT86IHN0cmluZztcclxuICAgICAgICB2YXJpYW50cz86IHN0cmluZ1tdO1xyXG4gICAgICAgIHN1YnNldHM/OiBzdHJpbmdbXTtcclxuICAgICAgICB2ZXJzaW9uPzogc3RyaW5nO1xyXG4gICAgICAgIGxhc3RNb2RpZmllZD86IHN0cmluZztcclxuICAgICAgICBmaWxlcz86IHsgW3ZhcmlhbnQ6IHN0cmluZ106IHN0cmluZzsgfTtcclxuICAgIH1cclxuXHJcbn0iLCIiXX0=