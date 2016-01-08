// <reference path="typings/paper.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkedPathGroup = (function (_super) {
    __extends(LinkedPathGroup, _super);
    function LinkedPathGroup() {
        _super.apply(this, arguments);
    }
    LinkedPathGroup.prototype.addChild = function (path) {
        return _super.prototype.addChild.call(this, path);
    };
    Object.defineProperty(LinkedPathGroup.prototype, "length", {
        get: function () {
            return this.children.reduce(function (a, b) { return a + b.length; }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkedPathGroup.prototype, "paths", {
        get: function () {
            return this.children;
        },
        enumerable: true,
        configurable: true
    });
    LinkedPathGroup.prototype.getLocationAt = function (offset, isParameter) {
        var path = null;
        for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
            path = _a[_i];
            var len = path.length;
            if (len >= offset) {
                break;
            }
            offset -= len;
        }
        return path.getLocationAt(offset, isParameter);
    };
    LinkedPathGroup.prototype.getPointAt = function (offset, isParameter) {
        var path = null;
        for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
            path = _a[_i];
            var len = path.length;
            if (len >= offset) {
                break;
            }
            offset -= len;
        }
        return path.getPointAt(offset, isParameter);
    };
    LinkedPathGroup.prototype.getTangentAt = function (offset, isPatameter) {
        var path = null;
        for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
            path = _a[_i];
            var len = path.length;
            if (len >= offset) {
                break;
            }
            offset -= len;
        }
        return path.getTangentAt(offset, isPatameter);
    };
    return LinkedPathGroup;
})(paper.Group);
// <reference path="typings/paper.d.ts" />
// <reference path="LinkedPaths.ts" />
var path = new paper.Path();
path.strokeColor = 'black';
var start = new paper.Point(100, 100);
path.moveTo(start);
path.lineTo(start + [100, -50]);
var path2 = new paper.Path([new paper.Point(20, 20), new paper.Point(220, 20)]);
path2.strokeColor = 'red';
var paths = new LinkedPathGroup([path, path2]);
console.log(path.length);
console.log(path2.length);
console.log(paths.length);
paper.Path.Circle({
    center: paths.getLocationAt(10).point,
    radius: 10,
    strokeColor: 'green'
});
paper.Path.Circle({
    center: paths.getLocationAt(150).point,
    radius: 20,
    strokeColor: 'blue'
});
// console.log(paths.getLocationAt(10).point);
// console.log(paths.getLocationAt(150).point);
//# sourceMappingURL=app.js.map