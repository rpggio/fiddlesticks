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
            
            // Measure glyphs in pairs to capture white space.
            // Pairs are characters i and i+1.
            var glyphPairs = [];
            for (var i = 0; i < text.length; i++) {
                glyphPairs[i] = this.createPointText(text.substring(i, i+1));
            }
            
            // For each character, find center offset.
            var xOffsets = [0];
            for (var i = 1; i < text.length; i++) {
                
                // Measure three characters at a time to get the appropriate 
                //   space before and after the glyph.
                var triadText = this.createPointText(text.substring(i - 1, i + 1));
                triadText.remove();
                
                // Subtract out half of prior glyph pair 
                //   and half of current glyph pair.
                // Must be right, because it works.
                let offsetWidth = triadText.bounds.width 
                    - glyphPairs[i - 1].bounds.width / 2 
                    - glyphPairs[i].bounds.width / 2;
                
                // Add offset width to prior offset. 
                xOffsets[i] = xOffsets[i - 1] + offsetWidth;
            }
            
            // Set point for each glyph and rotate glyph aorund the point
            let pathLength = path.length;
            for (var i = 0; i < text.length; i++) {
                var centerOffs = xOffsets[i];
                if (pathLength < centerOffs) {
                    centerOffs = undefined;
                }
                if (centerOffs === undefined) {
                    glyphPairs[i].remove();
                } else {
                    var pathPoint = path.getPointAt(centerOffs);
                    glyphPairs[i].position = pathPoint;
                    var tan = path.getTangentAt(centerOffs);
                    if(tan) {
                        glyphPairs[i].rotate(tan.angle, pathPoint);
                    } else {
                        console.warn("Could not get tangent at ", centerOffs);
                    } 
                }
            }
        }
    }
       
    // create a PointText object for a string and a style
    private createPointText (text): paper.Item {
        var pointText = new paper.PointText();
        pointText.content = text;
        pointText.justification = "center";
        let style = this.style;
        
        if (style) {
            if (style.fontFamily) pointText.fontFamily = style.fontFamily;
            if (style.fontSize) pointText.fontSize = style.fontSize;
            if (style.fontWieght) pointText.fontWeight = style.fontWeight;
        }
        
        var rect = paper.Path.Rectangle(pointText.bounds);
        rect.fillColor = 'lightgray';
        
        var group = new paper.Group();
        group.style = style;
        group.addChild(pointText);

        this.addChild(group);
        return group;
    }
    
}


