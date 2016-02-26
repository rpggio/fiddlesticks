
class SketchEditor extends Component<Sketch> {
    actions: Actions;

    constructor(actions: Actions) {
        super();
        this.actions = actions;
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
                                this.actions.textBlock.add.dispatch({ text: text });
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

            BootScript.dropdown({ 
                id: "sketchMenu",
                content: "Fiddle",
                items: [
                    { 
                        content: "New",
                        attrs: {
                            title: "Create new sketch"
                        },
                        onClick: () => this.actions.sketch.create.dispatch()
                    },
                    { 
                        content: "Save Local",
                        attrs: {
                            title: "Save to local browser storage"
                        },
                        onClick: () => this.actions.designer.saveLocal.dispatch()
                    }
                ]
            })

        ]
        );
    }
}
