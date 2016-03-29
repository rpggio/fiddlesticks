namespace SketchBuilder {
    
    export class Module {
        store: Store;
        builder: Builder;
        
        constructor(
            builderContainer: HTMLElement,
            previewCanvas: HTMLCanvasElement, 
            renderCanvas: HTMLCanvasElement){
            
            this.store = new Store();
            this.builder = new Builder(builderContainer, this.store);
         
            //new RenderCanvas(renderCanvas, this.store);
            new PreviewCanvas(previewCanvas, this.store);
                        
this.store.design$.subscribe(d => console.log("design", d));
this.store.template$.subscribe(t => console.log("template", t));
        }
        
        start() {
            this.store.setTemplate("Dickens");
            this.store.design = {
                text: "The rain in spain falls mainly in the drain",
                palette: ["green"]
            };
        }
        
    }
    
}
