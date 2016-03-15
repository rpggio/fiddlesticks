class TextBlockEditor extends Component<TextBlock> {
    store: Store;

    constructor(store: Store) {
        super();
        this.store = store;
    }

    render(textBlock: TextBlock): VNode {
        let update = tb => {
            tb._id = textBlock._id;
            this.store.actions.textBlock.updateAttr.dispatch(tb);
        };

        return h("div.text-block-editor",
            {},
            [
                h("textarea",
                    {
                        attrs: {
                        },
                        props: {
                            value: textBlock.text
                        },
                        on: {
                            keypress: (ev: KeyboardEvent) => {
                                if ((ev.which || ev.keyCode) === DomHelpers.KeyCodes.Enter) {
                                    ev.preventDefault();
                                    update({ text: (<HTMLTextAreaElement>ev.target).value });
                                    this.store.actions.sketch.setEditingItem.dispatch(null);
                                }
                            },
                            change: ev => update({ text: ev.target.value })
                        }
                    }),

                h("div",
                    {},
                    [
                        h("div.font-color-icon.fore", {}, "A"),
                        h("input.text-color",
                            {
                                attrs: {
                                    type: "text"
                                },
                                props: {
                                    title: "Text color",
                                    value: textBlock.textColor
                                },
                                hook: {
                                    insert: (vnode) =>
                                        ColorPicker.setup(
                                            vnode.elm,
                                            SketchHelpers.colorsInUse(this.store.state.sketch),
                                            color => update({ textColor: color && color.toHexString() })
                                        ),
                                    destroy: (vnode) => ColorPicker.destroy(vnode.elm)
                                }
                            })
                    ]),

                h("div",
                    {},
                    [
                        h("div.font-color-icon.back", {}, "A"),
                        h("input.background-color",
                            {
                                attrs: {
                                    type: "text"
                                },
                                props: {
                                    title: "Background color",
                                    value: textBlock.backgroundColor
                                },
                                hook: {
                                    insert: (vnode) =>
                                        ColorPicker.setup(
                                            vnode.elm,
                                            SketchHelpers.colorsInUse(this.store.state.sketch),
                                            color => update({ backgroundColor: color && color.toHexString() })
                                        ),
                                    destroy: (vnode) => ColorPicker.destroy(vnode.elm)
                                }
                            })
                    ]),

                h("button.delete-textblock.btn.btn-danger",
                    {
                        type: "button",
                        props: {
                            title: "Delete"
                        },
                        on: {
                            click: e => this.store.actions.textBlock.remove.dispatch(textBlock)
                        }
                    },
                    [
                        h("span.glyphicon.glyphicon-trash")
                    ]
                ),

                h("div.font-picker-container",
                    {
                        hook: {
                            insert: (vnode) =>
                                new FontPicker(vnode.elm, this.store, textBlock)
                        }

                        // hook: {
                        //     insert: (vnode) => {
                        //         const props: FontPickerProps = {
                        //             store: this.store,
                        //             selection: textBlock.fontDesc,
                        //             selectionChanged: (fontDesc) => {
                        //                 update({ fontDesc });
                        //             }
                        //         };
                        //         ReactDOM.render(rh(FontPicker, props), vnode.elm);
                        //     },
                        // }
                    },
                    [
                    ]
                ),

            ]);
    }

}