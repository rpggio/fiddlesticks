// <reference path="typings/paper.d.ts" />

var sampleText = "Fiddlesticks";
const AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
const Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
const Roboto500 = 'fonts/Roboto-500.ttf';

var createSVG = function(str, attrs?) {
    if (attrs) {
        // Similar to SVGExport's createElement / setAttributes.
        var node = document.createElementNS('http://www.w3.org/2000/svg', str);
        for (var key in attrs)
            node.setAttribute(key, attrs[key]);
        return node;
    } else {
        return new window.DOMParser().parseFromString(
            '<svg xmlns="http://www.w3.org/2000/svg">' + str + '</svg>',
            'text/xml');
    }
};

class TextWarpController {

    constructor() {
        var lineDraw = new LineDrawTool();
        let prevPath: paper.Path;
        lineDraw.onPathFinished = (path) => {
            path.flatten(40);
            
            //this.layoutTextBaseline(sampleText, path);
            
            if(prevPath){
                //this.layoutMatrixProjection(sampleText, path, prevPath);
                this.layoutPathProjection(sampleText, path, prevPath);
            }
            
            prevPath = path;
        };
    }

    marker(point: paper.Point, color: string){
        var shape = paper.Shape.Circle(point, 5);
        shape.strokeColor = color;         
    }

    layoutPathProjection(text: string, top: paper.Path, bottom: paper.Path){
        new FontLoader(Roboto500, font => {
            let letterGroup = new paper.Group();
            let letterPaths = font.getPaths(sampleText, 0, 100, 200)
                .map(p => { 
                    let path = this.importOpenTypePath(p);
                    letterGroup.addChild(path);
                    return path;
                    });
            let orthOrigin = letterGroup.bounds.topLeft; 
            let orthWidth = letterGroup.bounds.width;
            let orthHeight = letterGroup.bounds.height;
            console.log('orth size', [orthWidth, orthHeight]);
                
            let projection = PathHelper.pathProjection(top, bottom);
            let transform = new PathTransform(point => {
                let relative = point.subtract(orthOrigin);
                let unit = new paper.Point(
                    relative.x / orthWidth, 
                    relative.y / orthHeight);
                //console.log('unit', unit);
                let projected = projection(unit);
                //console.log('projected', projected);
                return projected;
            });  

            for(let letterPath of letterPaths){
                let letterOutline = PathHelper.tracePathItem(letterPath, 400);
                letterPath.remove();
                
                letterOutline.fillColor = "lightblue";
                transform.transformPathItem(letterOutline);
                PathHelper.simplify(letterOutline, 1);
            }
        });
    }
    
    layoutMatrixProjection(text: string, top: paper.Path, bottom: paper.Path){
        new FontLoader(Roboto500, font => {
            let letterPaths = font.getPaths(sampleText, 0, 100, 200)
                .map(p => this.importOpenTypePath(p));
            let linearTextOrigin = letterPaths[0].bounds.bottomLeft; 
            let linearLength = letterPaths[letterPaths.length - 1].bounds.right
                - linearTextOrigin.x;
                
            let bottomScaling = new PathOffsetScaling(linearLength, bottom); 
            let topScaling = new PathOffsetScaling(linearLength, top); 

            //'#07698A'
            for(let letterPath of letterPaths){
                let linearOffset = letterPath.bounds.left - linearTextOrigin.x;
                let letterOutline = PathHelper.tracePathItem(letterPath, 400);

                letterPath.remove();
                //letterOutline.strokeColor = '#07698A';
                //letterOutline.position.y += 100;
                
                // line up letter on lower left point
                letterOutline.position = bottomScaling.getToPointAt(linearOffset)
                    .add(letterOutline.bounds.center
                        .subtract(letterOutline.bounds.bottomLeft));

                // get source and dest quads for mapping                                        
                let sourceQuad = Quad.fromRectangle(letterOutline.bounds);
                let destQuad = new Quad(
                    topScaling.getToPointAt(linearOffset),
                    topScaling.getToPointAt(linearOffset + letterOutline.bounds.width),
                    bottomScaling.getToPointAt(linearOffset),
                    bottomScaling.getToPointAt(linearOffset + letterOutline.bounds.width)
                );
                               
                // paper.Path.Line(sourceQuad.a, sourceQuad.d).strokeColor = "lightgray";
                // paper.Path.Line(sourceQuad.b, sourceQuad.c).strokeColor = "lightgray";

                // paper.Path.Line(destQuad.a, destQuad.d).strokeColor = "yellow";
                // paper.Path.Line(destQuad.b, destQuad.c).strokeColor = "yellow";
                
                let transform = new PerspectiveTransform(sourceQuad, destQuad);
                transform.transformPathItem(letterOutline);
            }
        });
    }
   
    importOpenTypePath(openPath: opentype.Path): paper.PathItem
    {
        return new paper.CompoundPath(openPath.toPathData());
        
        // let path = new paper.CompoundPath(openPath.toPathData());
        // if(path.children.length === 1){
        //     return <paper.Path>path.children[0];
        // }
        // return path;
        
        // let svg = openPath.toSVG(4);
        // return <paper.Path>paper.project.importSVG(svg);
    }
    
    layoutTextBaseline(text: string, layoutPath: paper.Path) {
        new FontLoader(AmaticUrl, font => {
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

class PathOffsetScaling {
    
    to: paper.Path;
    scale: number;
    
    constructor(fromLength: number, to: paper.Path){
        this.to = to;
        this.scale = to.length / fromLength;
    }
    
    getToPointAt(fromPathOffset: number): paper.Point {
        let toOffset = Math.min(this.to.length, fromPathOffset * this.scale);
        return this.to.getPointAt(toOffset);
    }
}