namespace SketchEditor {

    export class EditorBar extends Component<EditorState> {

        store: Store;

        constructor(container: HTMLElement, store: Store) {
            super();

            this.store = store;

            const sketchDom$ = store.events.merge(
                store.events.sketch.loaded,
                store.events.sketch.attrChanged,
                store.events.editor.userMessageChanged)
                .map(m => this.render(store.state));
            ReactiveDom.renderStream(sketchDom$, container);

        }

        render(state: EditorState) {
            const sketch = state.sketch;
            const self = this;

            return h("div", [
                h("label", "Add text: "),
                h("input.add-text", {
                    on: {
                        keypress: (ev) => {
                            if ((ev.which || ev.keyCode) === DomHelpers.KeyCodes.Enter) {
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
                                    SketchHelpers.colorsInUse(this.store.state.sketch),
                                    color => {
                                        this.store.actions.sketch.attrUpdate.dispatch(
                                            { backgroundColor: color && color.toHexString() || "" });
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
                            content: "Clear all",
                            options: {
                                attrs: {
                                    title: "Clear sketch contents"
                                },
                                on: {
                                    click: () => this.store.actions.sketch.clear.dispatch()
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
                                    click: () => this.store.actions.editor.zoomToFit.dispatch()
                                }
                            }
                        },
                        
                        {
                            content: "Export small image",
                            options: {
                                attrs: {
                                    title: "Export sketch as PNG",
                                },
                                on: {
                                    click: () => this.store.actions.editor.exportPNG.dispatch({
                                        pixels: 100 * 1000
                                    })
                                }
                            }
                        },
                        
                        {
                            content: "Export medium image",
                            options: {
                                attrs: {
                                    title: "Export sketch as PNG",
                                },
                                on: {
                                    click: () => this.store.actions.editor.exportPNG.dispatch({
                                        pixels: 500 * 1000
                                    })
                                }
                            }
                        },

                        {
                            content: "Export SVG",
                            options: {
                                attrs: {
                                    title: "Export sketch as vector graphics"
                                },
                                on: {
                                    click: () => this.store.actions.editor.exportSVG.dispatch()
                                }
                            }
                        },
                        {
                            content: "Duplicate sketch (new URL)",
                            options: {
                                attrs: {
                                    title: "Copy contents into a sketch with a new address"
                                },
                                on: {
                                    click: () => this.store.actions.sketch.clone.dispatch()
                                }
                            }
                        },
                        {
                            content: "Load sample sketch",
                            options: {
                                attrs: {
                                    title: "Open a sample sketch to play with"
                                },
                                on: {
                                    click: () => this.store.actions.editor.openSample.dispatch()
                                }
                            }
                        },
                    ]
                }),

                {
                    content: "Upload tracing image",
                    options: {
                        attrs: {
                            title: "Upload image into workspace for tracing"
                        },
                        on: {
                            click: () => this.store.showOperation(new UploadImage(this.store))
                        }
                    }
                },
                {
                    content: "Remove tracing image",
                    options: {
                        attrs: {
                            title: "Remove background tracing image"
                        },
                        on: {
                            click: () => this.store.removeUploadedImage()
                        }
                    }
                },
                {
                    content: "Toggle transparency",
                    options: {
                        attrs: {
                            title: "See through text to elements behind"
                        },
                        on: {
                            click: () => this.store.setTransparency(!this.store.state.transparency)
                        }
                    }
                },



                h("div#rightSide",
                    {},
                    [
                        h("div#user-message", {}, [state.userMessage || ""]),

                        h("div#show-help.glyphicon.glyphicon-question-sign",
                            {
                                on: {
                                    click: () => {
                                        this.store.actions.editor.toggleHelp.dispatch();
                                    }
                                }
                            }),
                    ])

            ]
            );
        }
    }

}