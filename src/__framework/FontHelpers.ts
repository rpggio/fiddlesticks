
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
    
}