var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            // PaperHelpers.marker(top.getPointAt(0), "t-0");
            // PaperHelpers.marker(top.getPointAt(top.length / 2), "t-0.5");
            // PaperHelpers.marker(top.getPointAt(top.length), "t-1");
            // PaperHelpers.marker(bottom.getPointAt(0), "b-0");
            // PaperHelpers.marker(bottom.getPointAt(bottom.length / 2), "b-0.5");
            // PaperHelpers.marker(bottom.getPointAt(bottom.length), "b-1");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9wYXBlci1leHQudHMiLCIuLi9zcmMvUGFwZXJIZWxwZXJzLnRzIiwiLi4vc3JjL1BhdGhTZWN0aW9uLnRzIiwiLi4vc3JjL1BhdGhUcmFuc2Zvcm0udHMiLCIuLi9zcmMvU25hcFBhdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUNNQSxJQUFVLFlBQVksQ0EwTXJCO0FBMU1ELFdBQVUsWUFBWSxFQUFDLENBQUM7SUFFUCxtQ0FBc0IsR0FBRyxRQUFRLENBQUM7SUFJL0MsSUFBTSxHQUFHLEdBQUc7UUFBUyxnQkFBZ0I7YUFBaEIsV0FBZ0IsQ0FBaEIsc0JBQWdCLENBQWhCLElBQWdCO1lBQWhCLCtCQUFnQjs7UUFDakMsRUFBRSxDQUFDLENBQUMsMEJBQWEsQ0FBQyxDQUFDLENBQUM7WUFDaEIsT0FBTyxDQUFDLEdBQUcsT0FBWCxPQUFPLEVBQVEsTUFBTSxDQUFDLENBQUM7UUFDM0IsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVEOzs7T0FHRztJQUNILHlCQUFnQyxRQUFvQjtRQUNoRCxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDbEQsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLG1DQUFzQixDQUFDO2NBQ3RDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Y0FDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBTGUsNEJBQWUsa0JBSzlCLENBQUE7SUFFWSwrQkFBa0IsR0FBRyxVQUFTLFFBQXVCO1FBQzlELE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDckQsK0JBQStCO1FBQy9CLG1EQUFtRDtJQUN2RCxDQUFDLENBQUE7SUFFWSwwQkFBYSxHQUFHLFVBQVMsSUFBb0IsRUFBRSxhQUFxQjtRQUM3RSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBcUIsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzNFLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFhLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMzRCxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVksOEJBQWlCLEdBQUcsVUFBUyxJQUF3QixFQUFFLGFBQXFCO1FBQXhELGlCQVVoQztRQVRHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztZQUMzQixPQUFBLEtBQUksQ0FBQyxTQUFTLENBQWEsQ0FBQyxFQUFFLGFBQWEsQ0FBQztRQUE1QyxDQUE0QyxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQztZQUMxQixRQUFRLEVBQUUsS0FBSztZQUNmLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztTQUM1QixDQUFDLENBQUE7SUFDTixDQUFDLENBQUE7SUFFWSw4QkFBaUIsR0FBRyxVQUFTLElBQWdCLEVBQUUsU0FBaUI7UUFDekUsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM3QixJQUFJLFVBQVUsR0FBRyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQ3hDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFFZixPQUFPLENBQUMsRUFBRSxHQUFHLFNBQVMsRUFBRSxDQUFDO1lBQ3JCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLE1BQU0sSUFBSSxVQUFVLENBQUM7UUFDekIsQ0FBQztRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQyxDQUFBO0lBRVksc0JBQVMsR0FBRyxVQUFTLElBQWdCLEVBQUUsU0FBaUI7UUFDakUsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ2xCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLE1BQU0sRUFBRSxJQUFJO1lBQ1osU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1NBQzVCLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQTtJQUVZLHFDQUF3QixHQUFHLFVBQVMsT0FBd0IsRUFBRSxVQUEyQjtRQUVsRyxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ3JDLElBQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUMzQyxNQUFNLENBQUMsVUFBUyxTQUFzQjtZQUNsQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUM7WUFDL0QsSUFBSSxXQUFXLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLENBQUM7WUFDeEUsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksSUFBSSxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDMUMsT0FBTyxDQUFDLElBQUksQ0FBQywrQ0FBK0MsR0FBRyxTQUFTLENBQUMsQ0FBQztnQkFDMUUsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNwQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUUsQ0FBQztRQUNMLENBQUMsQ0FBQTtJQUNMLENBQUMsQ0FBQTtJQUlZLHlCQUFZLEdBQUc7UUFDeEIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDM0IsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN0QyxDQUFDO1FBQ0Qsd0JBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNoQyx3QkFBVyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFFOUIsQ0FBQyxDQUFBO0lBRVksdUJBQVUsR0FBRyxVQUFTLENBQWMsRUFBRSxDQUFjO1FBQzdELElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUMzQiwwQkFBMEI7UUFDMUIsWUFBWSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDLENBQUE7SUFFWSxtQkFBTSxHQUFHLFVBQVMsS0FBa0IsRUFBRSxLQUFhO1FBQzVELDZDQUE2QztRQUM3QyxJQUFJLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDckIsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDdkIsTUFBTSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDM0IsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLDRDQUE0QztRQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUMsQ0FBQTtJQUVZLHFCQUFRLEdBQUcsVUFBUyxJQUFvQixFQUFFLFNBQWtCO1FBQ3JFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNwQyxHQUFHLENBQUMsQ0FBVSxVQUFhLEVBQWIsS0FBQSxJQUFJLENBQUMsUUFBUSxFQUFiLGNBQWEsRUFBYixJQUFhLENBQUM7Z0JBQXZCLElBQUksQ0FBQyxTQUFBO2dCQUNOLFlBQVksQ0FBQyxRQUFRLENBQWlCLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUN2RDtRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNTLElBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0MsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVEOztPQUVHO0lBQ1UsK0JBQWtCLEdBQUcsVUFBUyxJQUFnQixFQUFFLFNBQXFDO1FBQzlGLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3RELENBQUMsQ0FBQTtJQUVEOztPQUVHO0lBQ1UseUJBQVksR0FBRyxVQUFTLElBQWdCLEVBQUUsU0FBcUM7UUFDeEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsSUFBSSxLQUFpQixDQUFDO1FBQ3RCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsT0FBTyxRQUFRLElBQUksUUFBUSxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDcEIsQ0FBQztZQUNELEtBQUssR0FBRyxRQUFRLENBQUM7WUFDakIsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDL0IsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFBO0lBRUQ7O09BRUc7SUFDVSxvQkFBTyxHQUFHLFVBQVMsSUFBcUI7UUFDakQsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzVFLENBQUMsQ0FBQTtJQUVEOztPQUVHO0lBQ1UscUJBQVEsR0FBRyxVQUFTLENBQWMsRUFBRSxDQUFjO1FBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFBO0lBRVkseUJBQVksR0FBRyxVQUFTLE9BQXNCO1FBQ3ZELE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRixDQUFDLENBQUE7SUFFRDs7T0FFRztJQUNILDBCQUFpQyxLQUFhLEVBQUUsR0FBVyxFQUFFLFNBQXlCO1FBQXpCLHlCQUF5QixHQUF6QixnQkFBeUI7UUFDbEYsS0FBSyxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixFQUFFLENBQUEsQ0FBQyxTQUFTLENBQUMsQ0FBQSxDQUFDO1lBQ1YsRUFBRSxDQUFBLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNiLENBQUM7WUFDRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFDRCxFQUFFLENBQUEsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUEsQ0FBQztZQUNaLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDZixDQUFDO1FBQ0QsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBYmUsNkJBQWdCLG1CQWEvQixDQUFBO0lBRUQsNkJBQW9DLE1BQWM7UUFDOUMsRUFBRSxDQUFBLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFBLENBQUM7WUFDWCxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFMZSxnQ0FBbUIsc0JBS2xDLENBQUE7QUFFTCxDQUFDLEVBMU1TLFlBQVksS0FBWixZQUFZLFFBME1yQjtBQ2hORCxJQUFVLFNBQVMsQ0EwQ2xCO0FBMUNELFdBQVUsU0FBUyxFQUFDLENBQUM7SUFFakI7UUFNSTs7V0FFRztRQUNILHFCQUFZLElBQWdCLEVBQ3hCLFNBQWlCLEVBQ2pCLFVBQWtCLEVBQ2xCLFNBQXlCO1lBQXpCLHlCQUF5QixHQUF6QixnQkFBeUI7WUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDL0IsQ0FBQztRQUVELHNCQUFJLCtCQUFNO2lCQUFWO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzlDLENBQUM7OztXQUFBO1FBRUQ7O1dBRUc7UUFDSCxnQ0FBVSxHQUFWLFVBQVcsTUFBYztZQUNyQixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNwQyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNqRSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRyxNQUFNLEdBQUcsU0FBUyxDQUFDO1lBQ2xFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQSxDQUFDO2dCQUN6QixVQUFVLElBQUksVUFBVSxDQUFDO1lBQzdCLENBQUM7WUFDRCxFQUFFLENBQUEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUEsQ0FBQztnQkFDZixVQUFVLElBQUksVUFBVSxDQUFDO1lBQzdCLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUNMLGtCQUFDO0lBQUQsQ0FBQyxBQXRDRCxJQXNDQztJQXRDWSxxQkFBVyxjQXNDdkIsQ0FBQTtBQUVMLENBQUMsRUExQ1MsU0FBUyxLQUFULFNBQVMsUUEwQ2xCO0FDMUNELElBQVUsU0FBUyxDQXFDbEI7QUFyQ0QsV0FBVSxTQUFTLEVBQUMsQ0FBQztJQUVqQjtRQUdJLHVCQUFZLGNBQW1EO1lBQzNELElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQ3pDLENBQUM7UUFFRCxzQ0FBYyxHQUFkLFVBQWUsS0FBa0I7WUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUVELHlDQUFpQixHQUFqQixVQUFrQixJQUFvQjtZQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxxQkFBcUIsQ0FBcUIsSUFBSSxDQUFDLENBQUM7WUFDekQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxhQUFhLENBQWEsSUFBSSxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUNMLENBQUM7UUFFRCw2Q0FBcUIsR0FBckIsVUFBc0IsSUFBd0I7WUFDMUMsR0FBRyxDQUFDLENBQVUsVUFBYSxFQUFiLEtBQUEsSUFBSSxDQUFDLFFBQVEsRUFBYixjQUFhLEVBQWIsSUFBYSxDQUFDO2dCQUF2QixJQUFJLENBQUMsU0FBQTtnQkFDTixJQUFJLENBQUMsYUFBYSxDQUFhLENBQUMsQ0FBQyxDQUFDO2FBQ3JDO1FBQ0wsQ0FBQztRQUVELHFDQUFhLEdBQWIsVUFBYyxJQUFnQjtZQUMxQixHQUFHLENBQUMsQ0FBZ0IsVUFBYSxFQUFiLEtBQUEsSUFBSSxDQUFDLFFBQVEsRUFBYixjQUFhLEVBQWIsSUFBYSxDQUFDO2dCQUE3QixJQUFJLE9BQU8sU0FBQTtnQkFDWixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUM5QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEQsU0FBUyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixTQUFTLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7YUFDNUI7UUFDTCxDQUFDO1FBQ0wsb0JBQUM7SUFBRCxDQUFDLEFBakNELElBaUNDO0lBakNZLHVCQUFhLGdCQWlDekIsQ0FBQTtBQUVMLENBQUMsRUFyQ1MsU0FBUyxLQUFULFNBQVMsUUFxQ2xCO0FDckNELElBQVUsU0FBUyxDQWdIbEI7QUFoSEQsV0FBVSxTQUFTLEVBQUMsQ0FBQztJQUVqQjtRQUE4Qiw0QkFBVztRQU9yQyxrQkFBWSxNQUFrQixFQUFFLE9BQTJCO1lBQ3ZELGlCQUFPLENBQUM7WUFFUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztZQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFNUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3RCLENBQUM7UUFFRCw2QkFBVSxHQUFWO1lBQ0ksSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ25ELElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNoRCxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDbEQsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDekMsSUFBTSxHQUFHLEdBQUcsSUFBSSxxQkFBVyxDQUN2QixJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQ2YsWUFBWSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckUsSUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBVyxDQUMxQixJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQ2YsWUFBWSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsRUFDdEUsS0FBSyxDQUFDLENBQUM7WUFFdkIsaURBQWlEO1lBQ2pELGdFQUFnRTtZQUNoRSwwREFBMEQ7WUFFMUQsb0RBQW9EO1lBQ3BELHNFQUFzRTtZQUN0RSxnRUFBZ0U7WUFFcEQsSUFBSSxVQUFVLEdBQUcsWUFBWSxDQUFDLHdCQUF3QixDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNwRSxJQUFJLFNBQVMsR0FBRyxJQUFJLHVCQUFhLENBQUMsVUFBQSxLQUFLO2dCQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDakIsQ0FBQztnQkFDRCxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQ3RCLFFBQVEsQ0FBQyxDQUFDLEdBQUcsWUFBWSxFQUN6QixRQUFRLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVE7aUJBQ2xDLEdBQUcsQ0FBQyxVQUFBLElBQUk7Z0JBQ0wsSUFBTSxJQUFJLEdBQWUsSUFBSSxDQUFDO2dCQUM5QixJQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQztxQkFDcEQsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO2dCQUMzQyxJQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUM7b0JBQ3pCLFFBQVEsRUFBRSxPQUFPO29CQUNqQixNQUFNLEVBQUUsSUFBSTtvQkFDWixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7aUJBQzVCLENBQUMsQ0FBQztnQkFDSCxpQkFBaUI7Z0JBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUE7WUFDTixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXhDLENBQUM7UUFFRDs7O1dBR0c7UUFDSCx3QkFBSyxHQUFMLFVBQU0sVUFBa0I7WUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBa0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQ3pDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLEVBQXZDLENBQXVDLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBRWMsd0JBQWUsR0FBOUIsVUFBK0IsTUFBYyxFQUFFLEtBQWE7WUFDeEQsSUFBSSxNQUFNLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUM1QixFQUFFLENBQUEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUEsQ0FBQztnQkFDWCxNQUFNLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdDLENBQUM7WUFDRCxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNwQixtREFBbUQ7WUFDbkQsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBRUosZUFBQztJQUFELENBQUMsQUFoR0QsQ0FBOEIsS0FBSyxDQUFDLEtBQUssR0FnR3hDO0lBaEdZLGtCQUFRLFdBZ0dwQixDQUFBO0FBY0wsQ0FBQyxFQWhIUyxTQUFTLEtBQVQsU0FBUyxRQWdIbEIiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIG1vZHVsZSBwYXBlciB7XHJcblxyXG4gICAgaW50ZXJmYWNlIEN1cnZlbGlrZSB7XHJcbiAgICAgICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICAgICAgZ2V0UG9pbnRBdChvZmZzZXQ6IG51bWJlcik6IHBhcGVyLlBvaW50O1xyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJcclxuaW50ZXJmYWNlIENvbnNvbGUge1xyXG4gICAgbG9nKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSk6IHZvaWQ7XHJcbiAgICBsb2coLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZDtcclxufVxyXG5cclxubmFtZXNwYWNlIFBhcGVySGVscGVycyB7XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IFNBRkFSSV9NQVhfQ0FOVkFTX0FSRUEgPSA2NzEwODg2NDtcclxuXHJcbiAgICBleHBvcnQgdmFyIHNob3VsZExvZ0luZm86IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3QgbG9nID0gZnVuY3Rpb24oLi4ucGFyYW1zOiBhbnlbXSkge1xyXG4gICAgICAgIGlmIChzaG91bGRMb2dJbmZvKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLnBhcmFtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lIHRoZSBtYXggZHBpIHRoYXQgY2FuIHN1cHBvcnRlZCBieSBDYW52YXMuXHJcbiAgICAgKiBVc2luZyBTYWZhcmkgYXMgdGhlIG1lYXN1cmUsIGJlY2F1c2UgaXQgc2VlbXMgdG8gaGF2ZSB0aGUgc21hbGxlc3QgbGltaXQuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNYXhFeHBvcnREcGkoaXRlbVNpemU6IHBhcGVyLlNpemUpe1xyXG4gICAgICAgIGNvbnN0IGl0ZW1BcmVhID0gaXRlbVNpemUud2lkdGggKiBpdGVtU2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgcmV0dXJuIDAuOTk5ICogTWF0aC5zcXJ0KFNBRkFSSV9NQVhfQ0FOVkFTX0FSRUEpIFxyXG4gICAgICAgICAgICAgICAgKiAocGFwZXIudmlldy5yZXNvbHV0aW9uKSBcclxuICAgICAgICAgICAgICAgIC8gIE1hdGguc3FydChpdGVtQXJlYSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IGltcG9ydE9wZW5UeXBlUGF0aCA9IGZ1bmN0aW9uKG9wZW5QYXRoOiBvcGVudHlwZS5QYXRoKTogcGFwZXIuQ29tcG91bmRQYXRoIHtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChvcGVuUGF0aC50b1BhdGhEYXRhKCkpO1xyXG4gICAgICAgIC8vIGxldCBzdmcgPSBvcGVuUGF0aC50b1NWRyg0KTtcclxuICAgICAgICAvLyByZXR1cm4gPHBhcGVyLlBhdGg+cGFwZXIucHJvamVjdC5pbXBvcnRTVkcoc3ZnKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgdHJhY2VQYXRoSXRlbSA9IGZ1bmN0aW9uKHBhdGg6IHBhcGVyLlBhdGhJdGVtLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5QYXRoSXRlbSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFjZUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgsIHBvaW50c1BlclBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNlUGF0aCg8cGFwZXIuUGF0aD5wYXRoLCBwb2ludHNQZXJQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHRyYWNlQ29tcG91bmRQYXRoID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoLCBwb2ludHNQZXJQYXRoOiBudW1iZXIpOiBwYXBlci5Db21wb3VuZFBhdGgge1xyXG4gICAgICAgIGlmICghcGF0aC5jaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwYXRocyA9IHBhdGguY2hpbGRyZW4ubWFwKHAgPT5cclxuICAgICAgICAgICAgdGhpcy50cmFjZVBhdGgoPHBhcGVyLlBhdGg+cCwgcG9pbnRzUGVyUGF0aCkpO1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHtcclxuICAgICAgICAgICAgY2hpbGRyZW46IHBhdGhzLFxyXG4gICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgdHJhY2VQYXRoQXNQb2ludHMgPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoLCBudW1Qb2ludHM6IG51bWJlcik6IHBhcGVyLlBvaW50W10ge1xyXG4gICAgICAgIGxldCBwYXRoTGVuZ3RoID0gcGF0aC5sZW5ndGg7XHJcbiAgICAgICAgbGV0IG9mZnNldEluY3IgPSBwYXRoTGVuZ3RoIC8gbnVtUG9pbnRzO1xyXG4gICAgICAgIGxldCBwb2ludHMgPSBbXTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDA7XHJcblxyXG4gICAgICAgIHdoaWxlIChpKysgPCBudW1Qb2ludHMpIHtcclxuICAgICAgICAgICAgbGV0IHBvaW50ID0gcGF0aC5nZXRQb2ludEF0KE1hdGgubWluKG9mZnNldCwgcGF0aExlbmd0aCkpO1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChwb2ludCk7XHJcbiAgICAgICAgICAgIG9mZnNldCArPSBvZmZzZXRJbmNyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBvaW50cztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgdHJhY2VQYXRoID0gZnVuY3Rpb24ocGF0aDogcGFwZXIuUGF0aCwgbnVtUG9pbnRzOiBudW1iZXIpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICBsZXQgcG9pbnRzID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEFzUG9pbnRzKHBhdGgsIG51bVBvaW50cyk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5QYXRoKHtcclxuICAgICAgICAgICAgc2VnbWVudHM6IHBvaW50cyxcclxuICAgICAgICAgICAgY2xvc2VkOiB0cnVlLFxyXG4gICAgICAgICAgICBjbG9ja3dpc2U6IHBhdGguY2xvY2t3aXNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IGR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbiA9IGZ1bmN0aW9uKHRvcFBhdGg6IHBhcGVyLkN1cnZlbGlrZSwgYm90dG9tUGF0aDogcGFwZXIuQ3VydmVsaWtlKVxyXG4gICAgICAgIDogKHVuaXRQb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50IHtcclxuICAgICAgICBjb25zdCB0b3BQYXRoTGVuZ3RoID0gdG9wUGF0aC5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgYm90dG9tUGF0aExlbmd0aCA9IGJvdHRvbVBhdGgubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbih1bml0UG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgICAgICBsZXQgdG9wUG9pbnQgPSB0b3BQYXRoLmdldFBvaW50QXQodW5pdFBvaW50LnggKiB0b3BQYXRoTGVuZ3RoKTtcclxuICAgICAgICAgICAgbGV0IGJvdHRvbVBvaW50ID0gYm90dG9tUGF0aC5nZXRQb2ludEF0KHVuaXRQb2ludC54ICogYm90dG9tUGF0aExlbmd0aCk7XHJcbiAgICAgICAgICAgIGlmICh0b3BQb2ludCA9PSBudWxsIHx8IGJvdHRvbVBvaW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImNvdWxkIG5vdCBnZXQgcHJvamVjdGVkIHBvaW50IGZvciB1bml0IHBvaW50IFwiICsgdW5pdFBvaW50KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0b3BQb2ludDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0b3BQb2ludC5hZGQoYm90dG9tUG9pbnQuc3VidHJhY3QodG9wUG9pbnQpLm11bHRpcGx5KHVuaXRQb2ludC55KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBtYXJrZXJHcm91cDogcGFwZXIuR3JvdXA7XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IHJlc2V0TWFya2VycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChQYXBlckhlbHBlcnMubWFya2VyR3JvdXApIHtcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXJrZXJHcm91cCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG4gICAgICAgIG1hcmtlckdyb3VwLm9wYWNpdHkgPSAwLjI7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBtYXJrZXJMaW5lID0gZnVuY3Rpb24oYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50KTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgbGV0IGxpbmUgPSBwYXBlci5QYXRoLkxpbmUoYSwgYik7XHJcbiAgICAgICAgbGluZS5zdHJva2VDb2xvciA9ICdncmVlbic7XHJcbiAgICAgICAgLy9saW5lLmRhc2hBcnJheSA9IFs1LCA1XTtcclxuICAgICAgICBQYXBlckhlbHBlcnMubWFya2VyR3JvdXAuYWRkQ2hpbGQobGluZSk7XHJcbiAgICAgICAgcmV0dXJuIGxpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IG1hcmtlciA9IGZ1bmN0aW9uKHBvaW50OiBwYXBlci5Qb2ludCwgbGFiZWw6IHN0cmluZyk6IHBhcGVyLkl0ZW0ge1xyXG4gICAgICAgIC8vbGV0IG1hcmtlciA9IHBhcGVyLlNoYXBlLkNpcmNsZShwb2ludCwgMTApO1xyXG4gICAgICAgIGxldCBtYXJrZXIgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KHBvaW50KTtcclxuICAgICAgICBtYXJrZXIuZm9udFNpemUgPSAzNjtcclxuICAgICAgICBtYXJrZXIuY29udGVudCA9IGxhYmVsO1xyXG4gICAgICAgIG1hcmtlci5zdHJva2VDb2xvciA9IFwicmVkXCI7XHJcbiAgICAgICAgbWFya2VyLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgIC8vUGFwZXJIZWxwZXJzLm1hcmtlckdyb3VwLmFkZENoaWxkKG1hcmtlcik7XHJcbiAgICAgICAgcmV0dXJuIG1hcmtlcjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3Qgc2ltcGxpZnkgPSBmdW5jdGlvbihwYXRoOiBwYXBlci5QYXRoSXRlbSwgdG9sZXJhbmNlPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHBhdGguY2xhc3NOYW1lID09PSAnQ29tcG91bmRQYXRoJykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwIG9mIHBhdGguY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIFBhcGVySGVscGVycy5zaW1wbGlmeSg8cGFwZXIuUGF0aEl0ZW0+cCwgdG9sZXJhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICg8cGFwZXIuUGF0aD5wYXRoKS5zaW1wbGlmeSh0b2xlcmFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgc2VsZiBvciBuZWFyZXN0IGFuY2VzdG9yIHNhdGlzZnlpbmcgdGhlIHByZWRpY2F0ZS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGZpbmRTZWxmT3JBbmNlc3RvciA9IGZ1bmN0aW9uKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUGFwZXJIZWxwZXJzLmZpbmRBbmNlc3RvcihpdGVtLCBwcmVkaWNhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluZCBuZWFyZXN0IGFuY2VzdG9yIHNhdGlzZnlpbmcgdGhlIHByZWRpY2F0ZS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGZpbmRBbmNlc3RvciA9IGZ1bmN0aW9uKGl0ZW06IHBhcGVyLkl0ZW0sIHByZWRpY2F0ZTogKGk6IHBhcGVyLkl0ZW0pID0+IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoIWl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwcmlvcjogcGFwZXIuSXRlbTtcclxuICAgICAgICBsZXQgY2hlY2tpbmcgPSBpdGVtLnBhcmVudDtcclxuICAgICAgICB3aGlsZSAoY2hlY2tpbmcgJiYgY2hlY2tpbmcgIT09IHByaW9yKSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUoY2hlY2tpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hlY2tpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJpb3IgPSBjaGVja2luZztcclxuICAgICAgICAgICAgY2hlY2tpbmcgPSBjaGVja2luZy5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGNvcm5lcnMgb2YgdGhlIHJlY3QsIGNsb2Nrd2lzZSBzdGFydGluZyBmcm9tIHRvcExlZnRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGNvcm5lcnMgPSBmdW5jdGlvbihyZWN0OiBwYXBlci5SZWN0YW5nbGUpOiBwYXBlci5Qb2ludFtdIHtcclxuICAgICAgICByZXR1cm4gW3JlY3QudG9wTGVmdCwgcmVjdC50b3BSaWdodCwgcmVjdC5ib3R0b21SaWdodCwgcmVjdC5ib3R0b21MZWZ0XTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRoZSBtaWRwb2ludCBiZXR3ZWVuIHR3byBwb2ludHNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IG1pZHBvaW50ID0gZnVuY3Rpb24oYTogcGFwZXIuUG9pbnQsIGI6IHBhcGVyLlBvaW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGIuc3VidHJhY3QoYSkuZGl2aWRlKDIpLmFkZChhKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgY2xvbmVTZWdtZW50ID0gZnVuY3Rpb24oc2VnbWVudDogcGFwZXIuU2VnbWVudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgcGFwZXIuU2VnbWVudChzZWdtZW50LnBvaW50LCBzZWdtZW50LmhhbmRsZUluLCBzZWdtZW50LmhhbmRsZU91dCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIC0gYiwgd2hlcmUgYSBhbmQgYiBhcmUgdW5pdCBvZmZzZXRzIGFsb25nIGEgY2xvc2VkIHBhdGguXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBwYXRoT2Zmc2V0TGVuZ3RoKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBjbG9ja3dpc2U6IGJvb2xlYW4gPSB0cnVlKXtcclxuICAgICAgICBzdGFydCA9IHBhdGhPZmZzZXROb3JtYWxpemUoc3RhcnQpO1xyXG4gICAgICAgIGVuZCA9IHBhdGhPZmZzZXROb3JtYWxpemUoZW5kKTtcclxuICAgICAgICBpZihjbG9ja3dpc2Upe1xyXG4gICAgICAgICAgICBpZihzdGFydCA+IGVuZCkge1xyXG4gICAgICAgICAgICAgICAgZW5kICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHBhdGhPZmZzZXROb3JtYWxpemUoZW5kIC0gc3RhcnQpOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZW5kID4gc3RhcnQpe1xyXG4gICAgICAgICAgICBzdGFydCArPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGF0aE9mZnNldE5vcm1hbGl6ZShzdGFydCAtIGVuZCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBwYXRoT2Zmc2V0Tm9ybWFsaXplKG9mZnNldDogbnVtYmVyKXtcclxuICAgICAgICBpZihvZmZzZXQgPCAwKXtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IE1hdGgucm91bmQob2Zmc2V0KSArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvZmZzZXQgJSAxO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuIiwibmFtZXNwYWNlIEZvbnRTaGFwZSB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFBhdGhTZWN0aW9uIGltcGxlbWVudHMgcGFwZXIuQ3VydmVsaWtlIHtcclxuICAgICAgICBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgICAgIHVuaXRTdGFydDogbnVtYmVyO1xyXG4gICAgICAgIHVuaXRMZW5ndGg6IG51bWJlcjtcclxuICAgICAgICBjbG9ja3dpc2U6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFN0YXJ0IGFuZCBlbmQgYXJlIHVuaXQgbGVuZ3RoczogMCB0byAxLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHBhdGg6IHBhcGVyLlBhdGgsIFxyXG4gICAgICAgICAgICB1bml0U3RhcnQ6IG51bWJlciwgXHJcbiAgICAgICAgICAgIHVuaXRMZW5ndGg6IG51bWJlciwgXHJcbiAgICAgICAgICAgIGNsb2Nrd2lzZTogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcclxuICAgICAgICAgICAgdGhpcy51bml0U3RhcnQgPSB1bml0U3RhcnQ7XHJcbiAgICAgICAgICAgIHRoaXMudW5pdExlbmd0aCA9IHVuaXRMZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvY2t3aXNlID0gY2xvY2t3aXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGxlbmd0aCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudW5pdExlbmd0aCAqIHRoaXMucGF0aC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcGFyYW0gb2Zmc2V0OiBsZW5ndGggb2Zmc2V0IHJlbGF0aXZlIHRvIHRoaXMgc2VjdGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRQb2ludEF0KG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGhMZW5ndGggPSB0aGlzLnBhdGgubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLnBhdGguY2xvY2t3aXNlID09IHRoaXMuY2xvY2t3aXNlID8gMSA6IC0xO1xyXG4gICAgICAgICAgICBsZXQgcGF0aE9mZnNldCA9IHRoaXMudW5pdFN0YXJ0ICogcGF0aExlbmd0aCArIG9mZnNldCAqIGRpcmVjdGlvbjtcclxuICAgICAgICAgICAgaWYgKHBhdGhPZmZzZXQgPiBwYXRoTGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgIHBhdGhPZmZzZXQgLT0gcGF0aExlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihwYXRoT2Zmc2V0IDwgMCl7XHJcbiAgICAgICAgICAgICAgICBwYXRoT2Zmc2V0ICs9IHBhdGhMZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGF0aC5nZXRQb2ludEF0KHBhdGhPZmZzZXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgRm9udFNoYXBlIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUGF0aFRyYW5zZm9ybSB7XHJcbiAgICAgICAgcG9pbnRUcmFuc2Zvcm06IChwb2ludDogcGFwZXIuUG9pbnQpID0+IHBhcGVyLlBvaW50O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwb2ludFRyYW5zZm9ybTogKHBvaW50OiBwYXBlci5Qb2ludCkgPT4gcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludFRyYW5zZm9ybSA9IHBvaW50VHJhbnNmb3JtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJhbnNmb3JtUG9pbnQocG9pbnQ6IHBhcGVyLlBvaW50KTogcGFwZXIuUG9pbnQge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb2ludFRyYW5zZm9ybShwb2ludCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cmFuc2Zvcm1QYXRoSXRlbShwYXRoOiBwYXBlci5QYXRoSXRlbSkge1xyXG4gICAgICAgICAgICBpZiAocGF0aC5jbGFzc05hbWUgPT09ICdDb21wb3VuZFBhdGgnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUNvbXBvdW5kUGF0aCg8cGFwZXIuQ29tcG91bmRQYXRoPnBhdGgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cmFuc2Zvcm1Db21wb3VuZFBhdGgocGF0aDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHAgb2YgcGF0aC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1QYXRoKDxwYXBlci5QYXRoPnApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cmFuc2Zvcm1QYXRoKHBhdGg6IHBhcGVyLlBhdGgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiBwYXRoLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgb3JpZ1BvaW50ID0gc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdQb2ludCA9IHRoaXMudHJhbnNmb3JtUG9pbnQoc2VnbWVudC5wb2ludCk7XHJcbiAgICAgICAgICAgICAgICBvcmlnUG9pbnQueCA9IG5ld1BvaW50Lng7XHJcbiAgICAgICAgICAgICAgICBvcmlnUG9pbnQueSA9IG5ld1BvaW50Lnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIEZvbnRTaGFwZSB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFNuYXBQYXRoIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9yZWdpb246IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgcHJpdmF0ZSBfY29udGVudDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX3dhcnBlZDogcGFwZXIuQ29tcG91bmRQYXRoO1xyXG4gICAgICAgIGNvcm5lcnM6IENvcm5lck9mZnNldHM7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHJlZ2lvbjogcGFwZXIuUGF0aCwgY29udGVudDogcGFwZXIuQ29tcG91bmRQYXRoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yZWdpb24gPSByZWdpb247XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQgPSBjb250ZW50O1xyXG4gICAgICAgICAgICB0aGlzLl9jb250ZW50LnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChjb250ZW50LnBhdGhEYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLmZpbGxDb2xvciA9IFwiZ3JheVwiO1xyXG4gICAgICAgICAgICB0aGlzLmNvcm5lcnMgPSBbMCwgMC4yNSwgMC41MCwgMC43NV07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2NvbnRlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3dhcnBlZCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhdGgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVwZGF0ZVBhdGgoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRPcmlnaW4gPSB0aGlzLl9jb250ZW50LmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50V2lkdGggPSB0aGlzLl9jb250ZW50LmJvdW5kcy53aWR0aDtcclxuICAgICAgICAgICAgY29uc3QgY29udGVudEhlaWdodCA9IHRoaXMuX2NvbnRlbnQuYm91bmRzLmhlaWdodDtcclxuICAgICAgICAgICAgY29uc3QgcmVnaW9uTGVuZ3RoID0gdGhpcy5fcmVnaW9uLmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgdG9wID0gbmV3IFBhdGhTZWN0aW9uKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaW9uLCBcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ybmVyc1swXSwgXHJcbiAgICAgICAgICAgICAgICBQYXBlckhlbHBlcnMucGF0aE9mZnNldExlbmd0aCh0aGlzLmNvcm5lcnNbMF0sIHRoaXMuY29ybmVyc1sxXSkpO1xyXG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSBuZXcgUGF0aFNlY3Rpb24oXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpb24sIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3JuZXJzWzNdLFxyXG4gICAgICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnBhdGhPZmZzZXRMZW5ndGgodGhpcy5jb3JuZXJzWzNdLCB0aGlzLmNvcm5lcnNbMl0sIGZhbHNlKSxcclxuICAgICAgICAgICAgICAgIGZhbHNlKTtcclxuXHJcbi8vIFBhcGVySGVscGVycy5tYXJrZXIodG9wLmdldFBvaW50QXQoMCksIFwidC0wXCIpO1xyXG4vLyBQYXBlckhlbHBlcnMubWFya2VyKHRvcC5nZXRQb2ludEF0KHRvcC5sZW5ndGggLyAyKSwgXCJ0LTAuNVwiKTtcclxuLy8gUGFwZXJIZWxwZXJzLm1hcmtlcih0b3AuZ2V0UG9pbnRBdCh0b3AubGVuZ3RoKSwgXCJ0LTFcIik7XHJcblxyXG4vLyBQYXBlckhlbHBlcnMubWFya2VyKGJvdHRvbS5nZXRQb2ludEF0KDApLCBcImItMFwiKTtcclxuLy8gUGFwZXJIZWxwZXJzLm1hcmtlcihib3R0b20uZ2V0UG9pbnRBdChib3R0b20ubGVuZ3RoIC8gMiksIFwiYi0wLjVcIik7XHJcbi8vIFBhcGVySGVscGVycy5tYXJrZXIoYm90dG9tLmdldFBvaW50QXQoYm90dG9tLmxlbmd0aCksIFwiYi0xXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHByb2plY3Rpb24gPSBQYXBlckhlbHBlcnMuZHVhbEJvdW5kc1BhdGhQcm9qZWN0aW9uKHRvcCwgYm90dG9tKTtcclxuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybSA9IG5ldyBQYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChjb250ZW50T3JpZ2luKTtcclxuICAgICAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBjb250ZW50V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIGNvbnRlbnRIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhzID0gdGhpcy5fY29udGVudC5jaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gPHBhcGVyLlBhdGg+aXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4UG9pbnRzID0gUGFwZXJIZWxwZXJzLnRyYWNlUGF0aEFzUG9pbnRzKHBhdGgsIDEwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChwID0+IHRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludChwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFBhdGggPSBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3hQYXRoLnJlZHVjZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4UGF0aDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLl93YXJwZWQuYWRkQ2hpbGRyZW4obmV3UGF0aHMpO1xyXG5cclxuICAgICAgIH1cclxuXHJcbiAgICAgICAvKipcclxuICAgICAgICAqIFNsaWRlIG9mZnNldCBwb2ludHMgYnkgdGhlIGdpdmVuIGFtb3VudC5cclxuICAgICAgICAqIEBwYXJhbSB1bml0T2Zmc2V0OiB2YWx1ZSAwIHRvIDFcclxuICAgICAgICAqL1xyXG4gICAgICAgc2xpZGUodW5pdE9mZnNldDogbnVtYmVyKXtcclxuICAgICAgICAgICB0aGlzLmNvcm5lcnMgPSA8Q29ybmVyT2Zmc2V0cz50aGlzLmNvcm5lcnMubWFwKFxyXG4gICAgICAgICAgICAgICAgYyA9PiBTbmFwUGF0aC5pbmNyZW1lbnRPZmZzZXQoYywgdW5pdE9mZnNldCkpOyBcclxuICAgICAgIH1cclxuXHJcbiAgICAgICBwcml2YXRlIHN0YXRpYyBpbmNyZW1lbnRPZmZzZXQob2Zmc2V0OiBudW1iZXIsIGRlbHRhOiBudW1iZXIpe1xyXG4gICAgICAgICAgIGxldCByZXN1bHQgPSBvZmZzZXQgKyBkZWx0YTtcclxuICAgICAgICAgICBpZihyZXN1bHQgPCAwKXtcclxuICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgTWF0aC5yb3VuZChyZXN1bHQpICsgMTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICUgMTtcclxuICAgICAgICAgICAvL2NvbnNvbGUubG9nKGAke29mZnNldH0gKyAke2RlbHRhfSA9PiAke3Jlc3VsdH1gKTtcclxuICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBhdGggb2Zmc2V0cyBvbiByZWdpb24gZm9yIGNvcm5lcnMgb2YgU25hcFBhdGggY29udGVudCwgXHJcbiAgICAgKiAgIHN0YXJ0aW5nIHdpdGggdG9wTGVmdCBhbmQgcHJvY2VlZGluZyBjbG9ja3dpc2VcclxuICAgICAqICAgdG8gYm90dG9tTGVmdC4gXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCB0eXBlIENvcm5lck9mZnNldHMgPSBbXHJcbiAgICAgICAgbnVtYmVyLCAvLyB0b3BMZWZ0XHJcbiAgICAgICAgbnVtYmVyLCAvLyB0b3BSaWdodFxyXG4gICAgICAgIG51bWJlciwgLy8gYm90dG9tUmlnaHRcclxuICAgICAgICBudW1iZXIgIC8vIGJvdHRvbUxlZnRcclxuICAgIF1cclxuXHJcbn0iXX0=