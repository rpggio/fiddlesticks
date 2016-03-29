namespace SketchBuilder {

    export class RenderCanvas {

        canvas: HTMLCanvasElement;
        store: Store;
        builtDesign: paper.Item;

        constructor(canvas: HTMLCanvasElement, store: Store) {
            this.store = store;

            paper.setup(canvas);

            const parsedFonts = new FontShape.ParsedFonts(() => { });
            const fontFamilies = new FontShape.FontFamilies("fonts/google-fonts.json");

            const context = {
                getFont: specifier => {
                    let url: string;
                    if (!specifier || !specifier.family) {
                        url = Builder.defaultFontUrl;
                    } else {
                        url = fontFamilies.getUrl(specifier.family, specifier.variant)
                            || Builder.defaultFontUrl;
                    }
                    return parsedFonts.get(url)
                        .then(result => result.font);
                }
            };

            const controlled = store.render$.controlled();
            controlled.subscribe(request => {
                let design = <Design>_.clone(this.store.design);
                design = _.merge(design, request.design);
                paper.project.activeLayer.removeChildren();
                this.store.template.build(design, context).then(item => {
                    const raster = paper.project.activeLayer.rasterize(72, false);
                    item.remove();
                    request.callback(raster.toDataURL());
                    controlled.request(1);
                },
                (err) => {
                    console.warn("error on template.build", err);
                    controlled.request(1);
                });
            });
            controlled.request(1);

        }

    }
}