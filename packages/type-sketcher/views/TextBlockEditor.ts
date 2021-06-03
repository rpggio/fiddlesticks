import {FontPicker} from './FontPicker'
import {ColorPicker} from './ColorPicker'
import {SketchStore} from '../SketchStore'
import {TextBlock} from '../models'
import {VNode} from 'snabbdom'
import {Component} from 'fstx-common/src/vdom/Component'
import {KeyCodes} from 'fstx-common'
import {SketchHelpers} from '../SketchHelpers'

export class TextBlockEditor extends Component<TextBlock> {
    store: SketchStore

    constructor(store: SketchStore) {
        super()
        this.store = store
    }

    render(textBlock: TextBlock): VNode {
        let update = tb => {
            tb._id = textBlock._id
            this.store.actions.textBlock.updateAttr.dispatch(tb)
        }

        return h('div.text-block-editor',
            {
                key: textBlock._id,
            },
            [
                h('textarea',
                    {
                        attrs: {},
                        props: {
                            value: textBlock.text,
                        },
                        on: {
                            keypress: (ev: KeyboardEvent) => {
                                if ((ev.which || ev.keyCode) === KeyCodes.Enter) {
                                    ev.preventDefault()
                                    update({text: (<HTMLTextAreaElement>ev.target).value})
                                }
                            },
                            change: ev => update({text: ev.target.value}),
                        },
                    }),

                h('div',
                    {},
                    [
                        h('div.font-color-icon.fore', {}, 'A'),
                        h('input.text-color',
                            {
                                attrs: {
                                    type: 'text',
                                },
                                props: {
                                    title: 'Text color',
                                    value: textBlock.textColor,
                                },
                                hook: {
                                    insert: (vnode) =>
                                        ColorPicker.setup(
                                            vnode.elm,
                                            SketchHelpers.colorsInUse(this.store.state.sketch),
                                            color => update({textColor: color && color.toHexString()}),
                                        ),
                                    destroy: (vnode) => ColorPicker.destroy(vnode.elm),
                                },
                            }),
                    ]),

                h('div',
                    {},
                    [
                        h('div.font-color-icon.back', {}, 'A'),
                        h('input.background-color',
                            {
                                attrs: {
                                    type: 'text',
                                },
                                props: {
                                    title: 'Background color',
                                    value: textBlock.backgroundColor,
                                },
                                hook: {
                                    insert: (vnode) =>
                                        ColorPicker.setup(
                                            vnode.elm,
                                            SketchHelpers.colorsInUse(this.store.state.sketch),
                                            color => update({backgroundColor: color && color.toHexString()}),
                                        ),
                                    destroy: (vnode) => ColorPicker.destroy(vnode.elm),
                                },
                            }),
                    ]),

                h('button.delete-textblock.btn.btn-danger',
                    {
                        type: 'button',
                        props: {
                            title: 'Delete',
                        },
                        on: {
                            click: e => this.store.actions.textBlock.remove.dispatch(textBlock),
                        },
                    },
                    [
                        h('span.glyphicon.glyphicon-trash'),
                    ],
                ),

                h('div.font-picker-container',
                    {
                        hook: {
                            insert: (vnode) =>
                                new FontPicker(vnode.elm, this.store, textBlock),
                        },
                    },
                    [],
                ),

            ])
    }

}
