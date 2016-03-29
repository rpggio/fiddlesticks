namespace SketchBuilder {

    export class PreviewCanvas {

        canvas: HTMLCanvasElement;
        store: Store;
        builtDesign: paper.Item;
        context: TemplateBuildContext;
        
        private lastReceived: Design;
        private rendering = false;

        constructor(canvas: HTMLCanvasElement, store: Store) {
            this.store = store;

            paper.setup(canvas);

            const parsedFonts = new FontShape.ParsedFonts(() => { });
            const fontFamilies = new FontShape.FontFamilies("fonts/google-fonts.json");

            this.context = {
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

            store.design$.subscribe(received => {
                // only process one request at a time
                if (this.rendering) {
                    // always process the last received
                    this.lastReceived = received;
                    return;
                }

                this.render(received);
            });
        }

        private renderLastReceived() {
            if(this.lastReceived){
                const rendering = this.lastReceived;
                this.lastReceived = null;
                this.render(rendering);
            }
        }

        private render(design: Design): Promise<void> {
            if(this.rendering){
                throw new Error("render is in progress");
            }
            this.rendering = true;
            paper.project.activeLayer.removeChildren();
            return this.store.template.build(design, this.context).then(item => {
                paper.view.viewSize = item.bounds.size.multiply(1.1);
                paper.view.center = item.bounds.center;
                this.rendering = false;
                // handle any received while rendering 
                this.renderLastReceived();
            },
            err => {
                this.rendering = false;
            });
        }

    }
}