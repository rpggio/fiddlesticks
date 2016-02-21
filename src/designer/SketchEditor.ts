
class SketchEditor implements Component<Sketch> {
    actions: Actions;

    constructor(actions: Actions) {
        this.actions = actions;
    }

    render(sketch: Sketch) {
        return h('div', [
            'Background color:',
            h('input.background-color',
                {
                    props: {
                        type: 'text',
                        value: sketch.attr.backgroundColor                        
                    },
                    hook: {
                        insert: (vnode) =>
                            ColorPicker.setup(
                                vnode.elm,
                                color => {
                                    this.actions.sketch.attrupdate.dispatch(
                                        { backgroundColor: color && color.toHexString() });
                                }
                            )
                    }
                }),
            ]
            .concat(sketch.textBlocks.map(tb => this.renderTextBlockEditor(tb)))
        );
    }

    renderTextBlockEditor(textBlock: TextBlock): VNode {       
        let update = tb => {
            tb._id = textBlock._id;
            this.actions.textBlock.update.dispatch(tb);
        };
        return h('div', { style: { color: '#000' } }, [
            h('input',
                {
                    props: {
                        type: "text",
                        value: textBlock.text
                    },
                    on: {
                        keyup: e => update({ text: e.target.value }),
                        change: e => update({ text: e.target.value })
                    }
                }),
            h('input.text-color',
                {
                    type: 'text',
                    hook: {
                        insert: (vnode) =>
                            ColorPicker.setup(
                                vnode.elm,
                                color => update({ textColor: color && color.toHexString() })
                            )
                    }
                }),
            h('input.background-color',
                {
                    type: 'text',
                    hook: {
                        insert: (vnode) =>
                            ColorPicker.setup(
                                vnode.elm,
                                color => update({ backgroundColor: color && color.toHexString() })
                            )
                    }
                }),
        ]);
    }

}
