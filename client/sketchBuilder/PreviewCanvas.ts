namespace SketchBuilder {

    export class PreviewCanvas {

        canvas: HTMLCanvasElement;
        store: Store;
        builtDesign: paper.Item;
        context: TemplateBuildContext;

        private lastReceived: Design;
        private rendering = false;
        private project: paper.Project;
        private workspace: paper.Group;
        private mark: Fstx.Framework.Watermark;

        constructor(canvas: HTMLCanvasElement, store: Store) {
            this.store = store;

            paper.setup(canvas);
            this.project = paper.project;
            this.workspace = new paper.Group();

            FontShape.VerticalBoundsStretchPath.pointsPerPath = 400;

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

            this.mark = new Fstx.Framework.Watermark(this.project, "img/spiral-logo.svg", 0.06);

            store.templateState$.subscribe((ts: TemplateState) => {
                // only process one request at a time
                if (this.rendering) {
                    // always process the last received
                    this.lastReceived = ts.design;
                    return;
                }

                this.render(ts.design);
            });

            store.events.downloadPNGRequested.sub(pixels => this.downloadPNG(pixels));
        }

        private downloadPNG(pixels: number) {
            if (!this.store.design.content 
                || !this.store.design.content.text 
                || !this.store.design.content.text.length) {
                return;
            }
            
            // very fragile way to get bg color
            const shape = this.workspace.getItem({class: paper.Shape });
            const bgColor = <paper.Color>shape.fillColor;
            this.mark.placeInto(this.workspace, bgColor);            
            
            // Half of max DPI produces approx 4200x4200.
            const dpi = 0.5 * PaperHelpers.getExportDpi(this.workspace.bounds.size, pixels);
            const raster = this.workspace.rasterize(dpi, false);
            const data = raster.toDataURL();
            const fileName = Fstx.Framework.createFileName(this.store.design.content.text, 40, "png");
            const blob = DomHelpers.dataURLToBlob(data);
            saveAs(blob, fileName);
            
            this.mark.remove();
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
            this.workspace = new paper.Group();
            return this.store.template.build(design, this.context).then(item => {
                try {
                    if (!item) {
                        console.log("no render result from", design);
                        return;
                    }

                    item.fitBounds(this.project.view.bounds);
                    item.bounds.point = this.project.view.bounds.topLeft;
                    this.workspace.addChild(item);
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