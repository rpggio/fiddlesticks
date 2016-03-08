
const SketchHelpers = {
    
    colorsInUse(sketch: Sketch): string[] {
        let colors = [ sketch.backgroundColor ];
        for(const block of sketch.textBlocks){
            colors.push(block.backgroundColor);
            colors.push(block.textColor);
        }
        colors = _.uniq(colors.filter(c => c != null));
        colors.sort();
        return colors;
    }
    
}