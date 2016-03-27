namespace SketchBuilder {

    export class RenderCanvas {

        canvas: HTMLCanvasElement;
        store: Store;
        builtDesign: paper.Item;

        constructor(canvas: HTMLCanvasElement, store: Store) {
            this.store = store;

            paper.setup(canvas);

            store.render$.subscribe(request => {
                let design = <Design>_.clone(this.store.design);
                design = _.merge(design, request.design);
                const item = this.store.template.build(design);
                const raster = paper.project.activeLayer.rasterize(72, false);
                item.remove();
                request.callback(raster.toDataURL());
            });

        }

    }
}