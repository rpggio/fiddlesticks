namespace SketchBuilder {

    export class RenderCanvas {

        canvas: HTMLCanvasElement;
        store: Store;
        builtDesign: paper.Item;

        constructor(canvas: HTMLCanvasElement, store: Store) {
            this.store = store;

            paper.setup(canvas);

            // const dom$ = store.renderable$.subscribe(({template, design}) => {
            //     if(this.builtDesign){
            //         this.builtDesign.remove();
            //     }
            //     this.builtDesign = template.build(design);
            // });

            store.render$.subscribe(request => {
                const design = <Design>_.clone(this.store.design);
                if (request.designOptions) {
                    _.merge(design, request.designOptions);
                }
                const item = this.store.template.build(design);
                const raster = paper.project.activeLayer.rasterize(72, false);
                request.callback(raster.toDataURL());
            });

        }

    }
}