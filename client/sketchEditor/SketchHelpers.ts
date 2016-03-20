namespace SketchEditor {

    export class SketchHelpers {

        static colorsInUse(sketch: Sketch): string[] {
            let colors = [sketch.backgroundColor];
            for (const block of sketch.textBlocks) {
                colors.push(block.backgroundColor);
                colors.push(block.textColor);
            }
            colors = _.uniq(colors.filter(c => c != null));
            colors.sort();
            return colors;
        }
        
        static getSketchFileName(sketch: Sketch, length: number, extension: string): string {
            let name = "";
            outer:
            for (const block of sketch.textBlocks) {
                for (const word of block.text.split(/\s/)) {
                    const trim = word.replace(/\W/g, '').trim();
                    if (trim.length) {
                        if (name.length) name += " ";
                        name += trim;
                    }
                    if (name.length >= length) {
                        break outer;
                    }
                }
            }
            if (!name.length) {
                name = "fiddle";
            }
            return name + "." + extension;
        }

    }

}