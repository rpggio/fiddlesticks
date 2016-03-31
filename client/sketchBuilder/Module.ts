namespace SketchBuilder {

    export class Module {
        store: Store;
        builder: Builder;

        constructor(
            builderContainer: HTMLElement,
            previewCanvas: HTMLCanvasElement,
            renderCanvas: HTMLCanvasElement) {

            this.store = new Store();
            this.builder = new Builder(builderContainer, this.store);

            new PreviewCanvas(previewCanvas, this.store);

            this.store.templateState$.subscribe(ts => console.log("templateState", ts));
            this.store.template$.subscribe(t => console.log("template", t));
        }

        start() {
            this.store.init().then(s => {
                this.store.setTemplate("Dickens");
                this.store.updateTemplateState(
                    { design:
                        { text: "The rain in Spain falls mainly in the plain"}
                    });
            })

        }

    }

}
