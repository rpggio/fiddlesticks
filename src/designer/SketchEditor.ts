
class SketchEditor extends Component<Sketch> {
    actions: Actions;

    constructor(actions: Actions) {
        super();
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
                                    this.actions.sketch.attrUpdate.dispatch(
                                        { backgroundColor: color && color.toHexString() });
                                }
                            ),
                        destroy: (vnode) => ColorPicker.destroy(vnode.elm)
                    }
                }),
            ]
        );
    }
}
