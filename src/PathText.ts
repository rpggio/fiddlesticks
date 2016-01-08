// <reference path="typings/paper.d.ts" />

class PathText extends paper.Group {
    
    private path: PathLike;
    private _text: string;
    
    public style;
    
    constructor(path: PathLike, text?: string, style?: any){
        super();
        
        this.path = path;
        this._text = text;
        this.style = style;
        this.update();
    }
 
    get text(): string {
        return this._text;
    }
    
    set text(value: string) {
        this._text = value;
        this.update();
    }
    
    update(): void {
        this.removeChildren();
        
        let text = this.text;
        let path = this.path;
        if (text && text.length && path && path.length) {
            // create PointText object for each glyph
            var glyphTexts = [];
            for (var i = 0; i < text.length; i++) {
                glyphTexts[i] = this.createPointText(text.substring(i, i+1));
                glyphTexts[i].justification = "center";
            }
            // for each glyph find center xOffset
            var xOffsets = [0];
            for (var i = 1; i < text.length; i++) {
                var pairText = this.createPointText(text.substring(i - 1, i + 1));
                pairText.remove();
                xOffsets[i] = xOffsets[i - 1] + pairText.bounds.width - 
                    glyphTexts[i - 1].bounds.width / 2 - glyphTexts[i].bounds.width / 2;
            }
            // set point for each glyph and rotate glyph aorund the point
            let pathLength = path.length;
            for (var i = 0; i < text.length; i++) {
                var centerOffs = xOffsets[i];
                if (pathLength < centerOffs) {
                    centerOffs = undefined;
                }
                if (centerOffs === undefined) {
                    glyphTexts[i].remove();
                } else {
                    var pathPoint = path.getPointAt(centerOffs);
                    glyphTexts[i].point = pathPoint;
                    var tan = path.getTangentAt(centerOffs);
                    if(tan) {
                        glyphTexts[i].rotate(tan.angle, pathPoint);
                    } else {
                        console.warn("Could not get tangent at ", centerOffs);
                    } 
                }
            }
        }
    }
    
    // create a PointText object for a string and a style
    private createPointText (text) {
        var pointText = new paper.PointText();
        pointText.content = text;
        let style = this.style;
        if (style) {
            if (style.fontFamily) pointText.fontFamily = style.fontFamily;
            if (style.fontSize) pointText.fontSize = style.fontSize;
            if (style.fontWieght) pointText.fontWeight = style.fontWeight;
        }
        this.addChild(pointText);
        return pointText;
    }

}