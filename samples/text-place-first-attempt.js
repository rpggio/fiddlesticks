var createAlignedText = function(str, paths, style) {
    if (str && str.length > 0 && paths && paths.length && paths[0].segments.length > 1) {
        console.log(paths);
        
        var textGroup = new Group();
        // create PointText object for each glyph
        var glyphTexts = [];
        for (var i = 0; i < str.length; i++) {
            var pointText = createPointText(str.substring(i, i+1), style);
            //console.log(pointText);
            textGroup.addChild(pointText);
            glyphTexts[i] = pointText;
            glyphTexts[i].justification = "center";
        }
        // for each glyph find center xOffset
        var xOffsets = [0];
        for (var i = 1; i < str.length; i++) {
            var pairText = createPointText(str.substring(i - 1, i + 1), style);
            pairText.remove();
            xOffsets[i] = xOffsets[i - 1] + pairText.bounds.width - 
                glyphTexts[i - 1].bounds.width / 2 - glyphTexts[i].bounds.width / 2;
        }
        
        // set point for each glyph and rotate glyph aorund the point
        var pathsIdx = 0;
        var path = paths[pathsIdx];
        var coveredPathLength = 0;
        for (var i = 0; i < str.length; i++) {
            var centerOffs = xOffsets[i] - coveredPathLength;

            // move to next path
            if (centerOffs > path.length) {
                if(pathsIdx < paths.length - 1){
                    pathsIdx += 1;
                    coveredPathLength += path.length;
                    path = paths[pathsIdx];
                    centerOffs = centerOffs - coveredPathLength;
                } else {
                    // All done - remove remaining text.
                    for(var j = i; j < str.length ;j++)
                    {
                         glyphTexts[j].remove();
                    }
                    break;
                }
            }
            
            var glyphText = glyphTexts[i];
            var pathPoint = path.getPointAt(centerOffs);
            console.log('setting ', glyphText.content, ' to ', pathPoint);
            glyphText.point = pathPoint;
            var tan = path.getTangentAt(centerOffs); 
            if(tan) {
                glyphText.rotate(tan.angle, pathPoint);
            } else {
                console.warn('could not get tangent for ', centerOffs, pathPoint);
            }
           
        }
        return textGroup;
    }
}

var createPointText = function(str, style) {
    var text = new PointText();
    text.content = str;
    if (style) {
        if (style.font) text.font = style.font;
        if (style.fontFamily) text.fontFamily = style.fontFamily;
        if (style.fontSize) text.fontSize = style.fontSize;
        if (style.fontWieght) text.fontWeight = style.fontWeight;
        if (style.fillColor) text.fillColor = style.fillColor;
        
    }
    return text;
}

var startTime = new Date();
var textGroup;
var paths = [];
var currentPath;
var textStyle = {
    fontSize: 18, 
    fillColor: '#ff0000'
};
var sourceText = "01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60";

console.clear();

function log(message, arg){
    var elapsed = (new Date() - startTime)/1000.0;
    console.log('[' + elapsed + ']' + message, arg);
}

function onMouseDown(event) {
    currentPath = new Path({
    strokeColor: '#ff0000',
    strokeWidth: 3
});
    paths.push(currentPath);
}

function onMouseDrag(event) {
    currentPath.add(event.middlePoint);
}

function onMouseUp(event) {
    currentPath.simplify(40);

    if(textGroup){
        textGroup.remove();
    }
    textGroup = createAlignedText(sourceText, paths, textStyle);

    currentPath.remove();
    currentPath = null;
}

