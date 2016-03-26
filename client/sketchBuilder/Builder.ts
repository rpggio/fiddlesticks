namespace SketchBuilder {

    export class Builder {

        constructor(container: HTMLElement, store: Store) {

            const templateContext = <TemplateContext>{
                renderDesign: (design, callback) => {
                    store.render({
                        designOptions: {},
                        callback
                    });
                }
            }

            const dom$ = Rx.Observable.combineLatest(
                store.template$,
                store.design$,
                (template, design) => {
                    return { template, design };
                })
                .map(({template, design}) => {
                    const controls = template.createControls(design, templateContext);
                    const vnode = h("div", {}, controls);
                    return vnode;
                });

            ReactiveDom.renderStream(dom$, container);
        }

    }

}