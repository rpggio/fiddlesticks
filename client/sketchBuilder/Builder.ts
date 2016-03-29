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
                }
            }

            const controls$ = store.template$.map(t => {
                const controls = t.createUI(context);
                for (const c of controls) {
                    c.output$.subscribe(d => store.updateDesign(d));
                }
                return controls;
            });

            const dom$ = Rx.Observable.combineLatest(
                controls$,
                store.design$,
                (controls, design) => {
                    return { controls, design };
                })
                .map(({controls, design}) => {
                    const nodes = controls.map(c => c.createNode(design));
                    const vnode = h("div#templateControls", {}, nodes);
                    return vnode;
                });

            ReactiveDom.renderStream(dom$, container);
        }

    }

}