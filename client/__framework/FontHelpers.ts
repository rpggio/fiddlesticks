
namespace FontHelpers {
    
    export interface VariantStyle {
        fontFamily?: string;
        fontWeight?: string;
        fontStyle?: string;  
    }
    
    export function getCssStyle(family: string, variant: string){
        let style = <VariantStyle>{ fontFamily: family };
        if(variant.indexOf("italic") >= 0){
            style.fontStyle = "italic";
        }
        let numeric = variant.replace(/[^\d]/g, "");
        if(numeric.length){
            style.fontWeight = numeric.toString();
        }
        return style;
    }
    
    export function getDescription(family: FontFamily, variant?: string): FontDescription {
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