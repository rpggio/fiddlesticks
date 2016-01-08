// <reference path="typings/paper.d.ts" />
// <reference path="LinkedPaths.ts" />

console.clear();

const ps23 = "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He leads me in paths of righteousness for his name's sake. Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me. You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows. Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the Lord forever.";
let drawPaths = new LinkedPathGroup();
let textPath = new PathText(drawPaths, ps23, {fontSize: 18});
let startTime = new Date();
let currentPath: paper.Path;

//---------------------------------------------

function drawStuff(): void
{
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

    var textPath = new PathText(paths, ps23, {});
};
drawStuff();

//---------------------------------------------

function onMouseDown(event) {
    currentPath = new paper.Path({strokeColor: 'lightgray', strokeWidth: 3});
    drawPaths.addChild(currentPath);
}

function onMouseDrag(event) {
    currentPath.add(event.middlePoint);
}

function onMouseUp(event) {
    currentPath.simplify(40);
    textPath.update();
    currentPath.visible = false;
}


