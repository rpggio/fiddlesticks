import {getStyleString} from 'fstx-common'
import {h, VNode} from 'snabbdom'
import {FamilyRecord, FontCatalog} from 'font-shape'
import {merge, Observable, of} from 'rxjs'
import 'rxjs/add/operator/merge'
import {filter, map} from 'rxjs/operators'
import {TextBlock} from '../models'
import {ReactiveDom} from 'fstx-common/src/vdom'
import {SketchStore} from '../SketchStore'
import $ from 'jquery'

interface JQuery {
    selectpicker(...args: any[]);
}

export class FontPicker {

    defaultFontFamily = 'Roboto'
    previewFontSize = '28px'

    private store: SketchStore

    constructor(container: HTMLElement, store: SketchStore, block: TextBlock) {
        this.store = store
        const dom$ = merge(of(block), store.events.textblock.attrChanged.observe()
            .pipe(
                filter(m => m.data._id === block._id),
                map(m => m.data),
            ),
        )
            .pipe(map(tb => this.render(tb)))
        ReactiveDom.renderStream(dom$, container)
    }

    render(block: TextBlock): VNode {
        let update = patch => {
            patch._id = block._id
            this.store.actions.textBlock.updateAttr.dispatch(patch)
        }
        const elements: VNode[] = []
        elements.push(
            h('select',
                {
                    key: 'selectPicker',
                    class: {
                        'family-picker': true,
                    },
                    attrs: {},
                    hook: {
                        insert: vnode => {
                            $(vnode.elm).selectpicker()
                        },
                        destroy: vnode => {
                            $(vnode.elm).selectpicker('destroy')
                        },
                    },
                    on: {
                        change: ev => update({
                            fontFamily: (ev.target as HTMLInputElement).value,
                            fontVariant: FontCatalog.defaultVariant(
                                this.store.resources.fontCatalog.getRecord((ev.target as HTMLInputElement).value)),
                        }),
                    },
                },
                this.store.resources.fontCatalog
                    .getList(this.store.fontListLimit)
                    .map((record: FamilyRecord) => h('option',
                        {
                            attrs: {
                                selected: record.family === block.fontFamily,
                                'data-content': `<span style="${getStyleString(record.family, null, this.previewFontSize)}">${record.family}</span>`,
                            },
                        },
                        [record.family]),
                    ),
            ),
        )
        const selectedFamily = this.store.resources.fontCatalog.getRecord(block.fontFamily)
        if (selectedFamily && selectedFamily.variants
            && selectedFamily.variants.length > 1) {
            elements.push(h('select',
                {
                    key: 'variantPicker',
                    class: {
                        'variant-picker': true,
                    },
                    attrs: {},
                    hook: {
                        insert: vnode => {
                            $(vnode.elm).selectpicker()
                        },
                        destroy: vnode => {
                            $(vnode.elm).selectpicker('destroy')
                        },
                        postpatch: (oldVnode, vnode) => {
                            setTimeout(() => {
                                // Q: why can't we just do selectpicker(refresh) here?
                                // A: selectpicker has mental problems
                                $(vnode.elm).selectpicker('destroy')
                                $(vnode.elm).selectpicker()
                            })

                        },
                    },
                    on: {
                        change: ev => update({fontVariant: (ev.target as HTMLInputElement).value}),
                    },
                },
                selectedFamily.variants.map(v => {
                        return h('option',
                            {
                                attrs: {
                                    selected: v === block.fontVariant,
                                    value: v,
                                    'data-container': 'body',
                                    'data-content': `<span style="${getStyleString(selectedFamily.family, v, this.previewFontSize)}">${v}</span>`,
                                },
                            },
                            [v])
                    },
                ),
            ))
        }
        return h('div',
            {
                class: {'font-picker': true},
            },
            elements,
        )
    }

}

function renderStream(dom$: Observable<VNode>, container: HTMLElement) {
    throw new Error('Function not implemented.')
}

