namespace SketchBuilder {
    
    export class PreviewCanvas {
        
        canvas: HTMLCanvasElement;
        store: Store;
        builtDesign: paper.Item;
        
        constructor(canvas: HTMLCanvasElement, store: Store){
            this.store = store;
           
            paper.setup(canvas);
            
            const dom$ = store.renderable$.subscribe(({template, design}) => {
                if(this.builtDesign){
                    this.builtDesign.remove();
                }
                this.builtDesign = template.build(design);
            });

        }
        
    }
}