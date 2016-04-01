namespace SketchBuilder {

    export class PreviewCanvas {

        canvas: HTMLCanvasElement;
        store: Store;
        builtDesign: paper.Item;
        context: TemplateBuildContext;

        private lastReceived: Design;
        private rendering = false;
        private project: paper.Project;

        constructor(canvas: HTMLCanvasElement, store: Store) {
            this.store = store;

            paper.setup(canvas);
            this.project = paper.project;

            FontShape.VerticalBoundsStretchPath.pointsPerPath = 300;

            this.context = {
                getFont: specifier => {
                    let url: string;
                    if (!specifier || !specifier.family) {
                        url = Builder.defaultFontUrl;
                    } else {
                        url = store.fontCatalog.getUrl(specifier.family, specifier.variant)
                            || Builder.defaultFontUrl;
                    }
                    return store.parsedFonts.get(url)
                        .then(result => result.font);
                }
            };

            store.templateState$.subscribe((ts: TemplateState) => {
                // only process one request at a time
                if (this.rendering) {
                    // always process the last received
                    this.lastReceived = ts.design;
                    return;
                }

                this.render(ts.design);
            });

            store.events.downloadPNGRequested.sub(() => this.downloadPNG());
        }

        private downloadPNG() {
            if (!this.store.design.text || !this.store.design.text.length) {
                return;
            }
            // Half of max DPI produces approx 4200x4200.
            const dpi = 0.5 * PaperHelpers.getMaxExportDpi(this.project.activeLayer.bounds.size);
            const raster = this.project.activeLayer.rasterize(dpi, false);
            const data = raster.toDataURL();
            const fileName = Fstx.Framework.createFileName(this.store.design.text, 40, "png");
            const blob = DomHelpers.dataURLToBlob(data);
            saveAs(blob, fileName);
        }

        private renderLastReceived() {
            if (this.lastReceived) {
                const rendering = this.lastReceived;
                this.lastReceived = null;
                this.render(rendering);
            }
        }

        private render(design: Design): Promise<void> {
            if (this.rendering) {
                throw new Error("render is in progress");
            }
            this.rendering = true;
            paper.project.activeLayer.removeChildren();
            return this.store.template.build(design, this.context).then(item => {
                try {
                    if (!item) {
                        console.log("no render result from", design);
                        return;
                    }

                    item.fitBounds(this.project.view.bounds);
                    item.bounds.point = this.project.view.bounds.topLeft;
                }
                finally {
                    this.rendering = false;
                }

                // handle any received while rendering 
                this.renderLastReceived();
            },
                err => {
                    console.error("Error rendering design", err, design);
                    this.rendering = false;
                });
        }

    }
}