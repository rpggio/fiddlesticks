class TextBlockEditor extends Component<TextBlock> {
    actions: Actions;

    constructor(actions: Actions) {
        super();
        this.actions = actions;
    }

    render(textBlock: TextBlock): VNode {
        let update = tb => {
            tb._id = textBlock._id;
            this.actions.textBlock.update.dispatch(tb);
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
                            keyup: e => update({ text: e.target.value }),
                            change: e => update({ text: e.target.value })
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
                            click: e => this.actions.textBlock.remove.dispatch(textBlock)
                        }
                    },
                    [
                        h("span.glyphicon.glyphicon-trash")
                    ]
                )
            ]);
    }

}