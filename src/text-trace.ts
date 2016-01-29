// <reference path="typings/paper.d.ts" />
// <reference path="LinkedPaths.ts" />

interface Window {
    textTrace: any;
    paper: paper.PaperScope;
}

window.textTrace = function () {

    console.log(paper);

    console.log('textTrace started');

    const ps23 = "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He leads me in paths of righteousness for his name's sake. Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me. You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows. Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the Lord forever.";
    let drawPaths = new LinkedPathGroup();
    let textSize = 64;
    let textPath = new PathText(drawPaths, ps23, {fontSize: textSize});
    let startTime = new Date();
    let currentPath: paper.Path;


    //---------------------------------------------

    function startPath(point) {
        if(currentPath){
            finishPath();
        }
        currentPath = new paper.Path({strokeColor: 'lightgray', strokeWidth: textSize});
        drawPaths.addChild(currentPath);
        currentPath.add(point);
    }

    function appendPath(point) {
        if(currentPath){
            currentPath.add(point);
        }
    }

    function finishPath(){
        currentPath.simplify(textSize / 2);
        textPath.update();
        currentPath.visible = false;
        currentPath = null;
    }

    var tool = new paper.Tool();

    tool.onMouseDrag = function(event) {
        let point = event.middlePoint;
        
        if(!currentPath){
            startPath(point);
            return;
        }
        
        // No: need to check if same segment!
        // let nearest = drawPaths.getNearestPoint(point);
        // if(nearest) {
        //     let nearestDist = nearest.getDistance(point);
        //     if(nearest && nearestDist <= textSize){
        //         finishPath();
        //         return;        
        //     }
        // }
        
        appendPath(point);
    }

    tool.onMouseUp = function(event) {
        finishPath();
    }
}