namespace SketchBuilder {

    export class ImageChooser {

        private _chosen$ = new Rx.Subject<ImageChoice>();

        createNode(options: ImageChooserOptions): VNode {
            const choiceNodes = options.choices.map(c => {
                let img: VNode;
                const onClick = () => {
                    this._chosen$.onNext(c);
                }
                const selector = options.chosen === c.value 
                    ? "img.chosen" 
                    : "img";
                if (c.loadImage) {
                    let imgElm;
                    img = h(selector,
                        {
                            on: {
                                click: onClick
                            },
                            hook: {
                                // kick off image load
                                insert: vnode => c.loadImage(vnode.elm)
                            },
                        },
                        []
                    );

                } else {
                    img = h(selector,
                        {
                            attrs: {
                                href: c.imageUrl
                            },
                            on: {
                                click: onClick
                            },
                        }
                    )
                }
                return h("li", {}, [
                    img
                ]);
            })
            return h("ul.chooser", {}, choiceNodes);
        }

        get chosen$() {
            return this._chosen$;
        }

    }

    export interface ImageChooserOptions {
        choices: ImageChoice[],
        chosen?: string
    }

    export interface ImageChoice {
        value: string;
        label: string;
        imageUrl?: string;
        loadImage?: (element: HTMLImageElement) => void;
    }

}