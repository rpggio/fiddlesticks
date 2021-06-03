import {of} from 'rxjs'
import {h, VNode} from 'snabbdom'
import {ReactiveDom} from 'fstx-common/src/vdom'
import {map} from 'rxjs/operators'
import {WavyStore} from './WavyStore'

export class ShareOptionsUI {

    private store: WavyStore

    constructor(container: HTMLElement, store: WavyStore) {
        this.store = store

        const state = of(null)
        ReactiveDom.renderStream(
            state.pipe(map(() => this.createDom())),
            container,
        )
    }

    createDom(): VNode {
        return h('div.controls', [
            h('button.btn.btn-primary', {
                    attrs: {
                        type: 'button',
                    },
                    on: {
                        click: () => this.store.downloadPNG(100 * 1000),
                    },
                },
                ['Download small']),

            h('button.btn.btn-primary', {
                    attrs: {
                        type: 'button',
                    },
                    on: {
                        click: () => this.store.downloadPNG(500 * 1000),
                    },
                },
                ['Download medium']),
        ])
    }
}
