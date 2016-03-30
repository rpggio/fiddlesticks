namespace SketchBuilder {

    export class ChooserWrapper {

        private _chosen$ = new Rx.Subject<VNode>();

        createNode(choices: VNode[], chosenKey: string) {
            return h("ul.chooser",
                {},
                choices.map(c =>
                    h("li.choice",
                        {
                            class: {
                                chosen: chosenKey && c.key === chosenKey
                            },
                            on: {
                                click: ev => this._chosen$.onNext(c)
                            }
                        },
                        [c])
                )
            );
        }

        get chosen$() {
            return this._chosen$;
        }
    }

}