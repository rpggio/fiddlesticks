namespace SketchBuilder {

    export class Builder {

        static defaultFontUrl = "fonts/Roboto-500.ttf";

        constructor(container: HTMLElement, store: Store) {

            const context = <TemplateUIContext>{
                get fontCatalog() { return store.fontCatalog },
                renderDesign: (design, callback) => {
                    store.render({
                        design: design,
                        callback
                    });
                },
                createFontChooser: () => {
                    return new TemplateFontChooser(store);
                }
            }

            // async observe
            store.template$.observeOn(Rx.Scheduler.default).subscribe(t => {
                const currentContent = store.design.content;
                const newTemplateState = t.createNew(context);
                if (currentContent && currentContent.text && currentContent.text.length) {
                    newTemplateState.design.content = currentContent;
                }
                store.setTemplateState(newTemplateState);
            });

            const dom$ = store.templateState$
                .map(ts => {
                    let controls;
                    try {
                        controls = store.template.createUI(context);
                    }
                    catch (err) {
                        console.error(`Error calling ${store.template.name}.createUI`, err);
                    }

                    for (const c of controls) {
                        c.value$.subscribe(d => store.updateTemplateState(d));
                    }
                    const nodes = controls.map(c => c.createNode(ts));
                    const vnode = h("div#templateControls", {}, nodes);
                    return vnode;
                });

            ReactiveDom.renderStream(dom$, container);
        }

    }

}