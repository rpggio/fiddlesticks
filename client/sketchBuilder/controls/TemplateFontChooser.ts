namespace SketchBuilder {

    export class TemplateFontChooser implements BuilderControl{
        
        private _fontChooser: FontChooser;
        
        constructor(store: Store) {
            this._fontChooser = new FontChooser(store.fontCatalog);
            
            this._fontChooser.maxFamilies = 15; 
        }
        
        createNode(value: TemplateState): VNode {
            const font = value.design && value.design.font;
            return this._fontChooser.createNode(<FontChooserState>{
                category: value.fontCategory,
                family: font && font.family,
                variant: font && font.variant
            })
        }
        
        get value$(): Rx.Observable<TemplateState> {
            return this._fontChooser.value$.map(choice => <TemplateState>{
                fontCategory: choice.category,
                design: {
                    font: {
                        family: choice.family,
                        variant: choice.variant
                    }
                }
            });
        }
        
    } 

}