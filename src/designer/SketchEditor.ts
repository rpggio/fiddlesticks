
class SketchEditor extends Component<Sketch> {

    store: Store;

    constructor(container: HTMLElement, store: Store) {
        super();

        this.store = store;

        const sketchDom$ = store.events.merge(
            store.events.sketch.loaded,
            store.events.sketch.attrChanged)
            .map(m => this.render(store.state.retained.sketch));
        ReactiveDom.renderStream(sketchDom$, container);

    }

    render(sketch: Sketch) {

        const self = this;

        return h("div", [
            h("label", "Add text: "),
            h("input.add-text", {
                on: {
                    keypress: (ev) => {
                        if (ev.which === 13 || ev.keyCode === 13) {
                            const text = ev.target && ev.target.value;
                            if (text.length) {
                                this.store.actions.textBlock.add.dispatch({ text: text });
                                ev.target.value = '';
                            }
                        }
                    }
                },
                attrs: {
                    type: "text",
                },
                props: {
                    placeholder: "Press [Enter] to add"
                },
                style: {
                }
            }),

            h("label", "Background: "),
            h("input.background-color",
                {
                    props: {
                        type: "text",
                        value: sketch.backgroundColor
                    },
                    hook: {
                        insert: (vnode) =>
                            ColorPicker.setup(
                                vnode.elm,
                                SketchHelpers.colorsInUse(this.store.state.retained.sketch),
                                color => {
                                    this.store.actions.sketch.attrUpdate.dispatch(
                                        { backgroundColor: color && color.toHexString() });
                                }
                            ),
                        update: (oldVnode, vnode) => {
                            ColorPicker.set(vnode.elm, sketch.backgroundColor);
                        },
                        destroy: (vnode) => ColorPicker.destroy(vnode.elm)
                    }
                }),

            BootScript.dropdown({
                id: "sketchMenu",
                content: "Actions",
                items: [
                    {
                        content: "New",
                        options: {
                            attrs: {
                                title: "Create new sketch"
                            },
                            on: {
                                click: () => this.store.actions.sketch.create.dispatch()
                            }
                        }
                    },
                    {
                        content: "Zoom to fit",
                        options: {
                            attrs: {
                                title: "Fit contents in view"
                            },
                            on: {
                                click: () => this.store.actions.designer.zoomToFit.dispatch()
                            }
                        }
                    },
                    {
                        content: "Export image",
                        options: {
                            attrs: {
                                title: "Export Fiddle as PNG",
                                href: "#",
                                download: "fiddle.png"
                            },
                            hook: {
                                insert: (vnode) => {
                                    vnode.elm.onclick = () => {
                                        app.workspaceController.handleImageDownloadClick(vnode.elm);
                                        self.store.actions.designer.exportingImage.dispatch(null);
                                    }
                                }
                            }
                        }
                    },
                ]
            })

        ]
        );
    }
}
