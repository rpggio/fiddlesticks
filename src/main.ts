// <reference path="typings/paper.d.ts" />
// <reference path="LinkedPaths.ts" />



var path = new paper.Path();
path.strokeColor = 'black';
var start = new paper.Point(100, 100);
path.moveTo(start);
path.lineTo(<any>start + [ 100, -50 ]);

var path2 = new paper.Path([new paper.Point(20,20), new paper.Point(220, 20)]);
path2.strokeColor = 'red';

let paths = new LinkedPathGroup([path, path2]);
 
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
