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
        return h('div.text-block-editor',
            {},
            [
                h('textarea',
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
                h('input.text-color',
                    {
                        attrs: {
                            type: "text"
                        },
                        props: {
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
                    }),
                h('input.background-color',
                    {
                        attrs: {
                            type: "text"
                        },
                        props: {
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
                    }),
            ]);
    }

}