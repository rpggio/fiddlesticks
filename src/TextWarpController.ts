// <reference path="typings/paper.d.ts" />

var sampleText = "Yellow world";
const AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
const Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';

class TextWarpController {

    constructor() {

        var lineDraw = new LineDrawTool();
        lineDraw.onPathFinished = (path) => {
            path.flatten(20);
            this.layoutTextBaseline(sampleText, path);
        };
    }

    marker(point: paper.Point, color: string){
        var shape = paper.Shape.Circle(point, 5);
        shape.strokeColor = color;         
    }
    
    layoutTextBaseline(text: string, layoutPath: paper.Path) {
        new FontLoader(Roboto100, font => {
            let letterPaths = font.getPaths(sampleText, 0, 100, 200)
                .map(p => new paper.CompoundPath(p.toPathData()));
            let textOrigin = letterPaths[0].bounds.bottomLeft; 
            let linearLength = letterPaths[letterPaths.length - 1].bounds.right
                - textOrigin.x;
            let layoutPathLength = layoutPath.length;
            let offsetScaling = layoutPathLength / linearLength;
            
            let idx = 0;
            for(let letterPath of letterPaths){
                letterPath.strokeColor = '#07698A';    
                let letterOffset = (letterPath.bounds.left - textOrigin.x) * offsetScaling;
                let bottomLeftPrime = layoutPath.getPointAt(letterOffset);
                let bottomRightPrime = layoutPath.getPointAt(
                    Math.min(layoutPathLength,
                        letterOffset + letterPath.bounds.width * offsetScaling));
                let bottomVectorPrime = bottomRightPrime.subtract(bottomLeftPrime);
                
                // this.marker(bottomLeftPrime, "green");
                // this.marker(bottomRightPrime, "blue");
                    
                let rotateAngle = 
                    new paper.Point(1, 0).getDirectedAngle(bottomRightPrime.subtract(bottomLeftPrime))
                // reposition using bottomLeft
                letterPath.position = bottomLeftPrime
                    .add(letterPath.bounds.center
                        .subtract(letterPath.bounds.bottomLeft));
                letterPath.rotate(rotateAngle, bottomLeftPrime);
                letterPath.scale(offsetScaling, bottomLeftPrime);
                idx++;
            }
        });
    }

    drawPathsDemo() {
        new FontLoader(Roboto100, font => {
            
            for(let openPath of font.getPaths("Fatty Two by Four", 0, 100, 200)){
                var paperPath = new paper.CompoundPath(openPath.toPathData());
                paperPath.strokeColor = '#07698A';    
                paperPath.position.y += 50 + Math.random() * 30;                      
            }
            
            // var offset = new paper.Point(0, 150);
            // for (let letter of "Yellow World".split('')) {
                
            //     var openTextPath = font.getPath(letter, 0, 100, 200);
            //     var paperPath = new paper.CompoundPath(openTextPath.toPathData());
            //     paperPath.strokeColor = '#07698A';
            //     paperPath.bounds.bottomLeft = offset;
                
            //     offset = offset.add(
            //         new paper.Point(
            //             paperPath.bounds.width,
            //             0))
            // }

            paper.project.activeLayer.scale(.5, new paper.Point(0.5, 0.5));
        });
    }

    drawDemo() {
        new FontLoader(AmaticUrl, font => {
            
            console.log('drawing in', font);
            var offset = new paper.Point(0, 100);
            var letters = "PoughKepsie".split('');
            var prevPath;
            var intersectionGroup = new paper.Group();
            for (let letter of letters) {
                var path = this.demoTextPath(font, letter, offset);

                if (prevPath) {
                    var intersections = path.getIntersections(prevPath);

                    for (var i = 0; i < intersections.length; i++) {
                        var intersectionPath = paper.Path.Circle({
                            center: intersections[i].point,
                            radius: 4,
                            fillColor: 'red',
                            parent: intersectionGroup
                        });
                    }
                    var intersect = path.intersect(prevPath);
                    intersect.fillColor = 'green';
                }

                offset = offset.add(new paper.Point(path.bounds.width * 0.9,
                    (-0.5 + Math.random()) * path.bounds.height * 0.3));
                prevPath = path;
            }

            paper.project.activeLayer.scale(2, new paper.Point(0.5, 0.5));
        });
    }
    
    demoTextPath(openTextFont, text, position) {
        if (!position) position = new paper.Point(0, 0);
        var openTextPath = openTextFont.getPath(text, 0, 100, 200);
        var paperPath = new paper.CompoundPath(openTextPath.toPathData());
        paperPath.strokeColor = '#07698A';
        paperPath.position = position.add(
            new paper.Point(
                paperPath.bounds.width / 2,
                paperPath.bounds.height / 2));
        return paperPath;
    };
}
