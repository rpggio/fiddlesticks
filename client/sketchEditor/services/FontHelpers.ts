    
namespace SketchEditor {
    
    export function getFontDescription(family: FontFamily, variant?: string): FontDescription {
        let url: string;
        url = family.files[variant || "regular"];
        if(!url){
            url = family.files[0];
        }
        return {
            family: family.family,
            category: family.category,
            variant: variant,
            url
        }
    }
    
}