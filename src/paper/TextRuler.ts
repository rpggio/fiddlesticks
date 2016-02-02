
class TextRuler {
    
    fontFamily: string;
    fontWeight: number;
    fontSize: number;
    
    private createPointText (text): paper.Item {
        var pointText = new paper.PointText();
        pointText.content = text;
        pointText.justification = "center";
        if(this.fontFamily){
            pointText.fontFamily = this.fontFamily;
        }
        if(this.fontWeight){
            pointText.fontWeight = this.fontWeight;
        }
        if(this.fontSize){
            pointText.fontSize = this.fontSize;
        }
        
        return pointText;
    }

    getTextOffsets(text){
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
        
        for(let glyphPair of glyphPairs){
            glyphPair.remove();
        }
        
        return xOffsets;
    }
}
