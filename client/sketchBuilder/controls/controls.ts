namespace SketchBuilder {

    export namespace Controls {

        export function imageChooser(options: ImageChooserOptions) {
            const choiceNodes = options.choices.map(c => {
                let img: VNode;
                const onClick = () => {
                    options.on && options.on.choice && options.on.choice(c);
                }
                if (c.loadImage) {
                    let imgElm;
                    img = h("img",
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
                    img = h("img",
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

        export interface ImageChooserOptions {
            choices: ImageChoice[],
            chosen?: ImageChoice | string,
            on?: {
                choice?: (choice: ImageChoice) => void
            }
        }

        export interface ImageChoice {
            value: string;
            label: string;
            imageUrl?: string;
            loadImage?: (element: HTMLImageElement) => void;
        }
    }
}