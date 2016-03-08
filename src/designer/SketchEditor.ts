
class SketchEditor extends Component<Sketch> {

    _store: Store;

    constructor(container: HTMLElement, store: Store) {
        super();

        this._store = store;

        const sketchDom$ = store.events.merge(
            store.events.sketch.loaded,
            store.events.sketch.attrChanged)
            .map(m => this.render(store.state.retained.sketch));
        ReactiveDom.renderStream(sketchDom$, container);

    }

    render(sketch: Sketch) {
        return h("div", [
            h("label", "Add text: "),
            h("input.add-text", {
                on: {
                    keypress: (ev) => {
                        if (ev.which === 13 || ev.keyCode === 13) {
                            const text = ev.target && ev.target.value;
                            if (text.length) {
                                this._store.actions.textBlock.add.dispatch({ text: text });
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
            
            // h("div.font-picker-container",
            //     {
            //         hook: {
            //             insert: (vnode) => {
            //                 const props: FontPickerProps = {
            //                     store: this._store,
            //                     selection: sketch.defaultFontDesc,
            //                     selectionChanged: (defaultFontDesc) => {
            //                         this._store.actions.sketch.attrUpdate.dispatch({ defaultFontDesc });
            //                     }
            //                 };
            //                 ReactDOM.render(rh(FontPicker, props), vnode.elm);
            //             },
            //         }
            //     }
            // ),            
            
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
                                color => {
                                    this._store.actions.sketch.attrUpdate.dispatch(
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
                content: "Fiddle",
                items: [
                    {
                        content: "New",
                        attrs: {
                            title: "Create new sketch"
                        },
                        onClick: () => this._store.actions.sketch.create.dispatch()
                    },
                    {
                        content: "Zoom to fit",
                        attrs: {
                            title: "Fit sketch contents in view"
                        },
                        onClick: () => this._store.actions.designer.zoomToFit.dispatch()
                    }
                ]
            })

        ]
        );
    }
}
