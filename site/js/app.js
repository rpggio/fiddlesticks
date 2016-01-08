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
    // paths: paper.Path[] = [];
    // constructor(paths?: paper.Path[]){
    //     super();
    //     this.paths.push(...paths);
    // }
    // add(path: paper.Path): void {
    //     this.paths.push(path);
    // }
    LinkedPathGroup.prototype.addChild = function (path) {
        return _super.prototype.addChild.call(this, path);
    };
    LinkedPathGroup.prototype.getLength = function () {
        return this.children.reduce(function (a, b) { return a + b.length; }, 0);
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
var paths = new LinkedPathGroup([path, path2]);
console.log(path.length);
console.log(path2.length);
console.log(paths.getLength());
//# sourceMappingURL=app.js.map