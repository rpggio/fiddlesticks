namespace SketchBuilder {

    export class Builder {

        static defaultFontUrl = "fonts/Roboto-500.ttf";

        constructor(container: HTMLElement, store: Store) {

            const context = <TemplateUIContext>{
                renderDesign: (design, callback) => {
                    store.render({
                        design: design,
                        callback
                    });
                },
                createFontChooser: () => {
                    return new DesignFontChooser(store);
                }
            }

            const controls$ = store.template$.map(t => {
                const controls = t.createUI(context);
                for (const c of controls) {
                    c.value$.subscribe(d => store.updateTemplateState(d));
                }
                return controls;
            });

            const dom$ = Rx.Observable.combineLatest(
                controls$,
                store.templateState$,
                (controls, templateState) => {
                    return { controls, templateState };
                })
                .map(({controls, templateState}) => {
                    const nodes = controls.map(c => c.createNode(templateState));
                    const vnode = h("div#templateControls", {}, nodes);
                    return vnode;
                });

            ReactiveDom.renderStream(dom$, container);
        }

    }

}