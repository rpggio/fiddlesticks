namespace SketchBuilder {

    export class Module {
        store: Store;
        builder: Builder;

        constructor(
            builderContainer: HTMLElement,
            previewCanvas: HTMLCanvasElement,
            renderCanvas: HTMLCanvasElement,
            belowCanvas: HTMLElement) {

            this.store = new Store();
            this.builder = new Builder(builderContainer, this.store);

            new PreviewCanvas(previewCanvas, this.store);

            this.store.templateState$.subscribe(ts => console.log("templateState", ts));
            this.store.template$.subscribe(t => console.log("template", t));
            
            new ShareOptionsUI(belowCanvas, this.store);
        }

        start() {
            this.store.init().then(s => {
                this.store.setTemplate("Dickens");
                this.store.updateTemplateState(
                    { design:
                        { 
                            content: { 
                                text: "Don't gobblefunk around with words.",
                                source: "- Roald Dahl, The BFG",
                            },
                            seed: 0.9959176457803123,
                            shape: "narrow",
                            font: {
                                family: "Amatic SC",
                                variant: "regular"
                            },
                            palette: {
                                color: "#854442",
                                invert: true 
                            }
                        },
                        fontCategory: "handwriting",
                    });
            })

        }

    }

}
