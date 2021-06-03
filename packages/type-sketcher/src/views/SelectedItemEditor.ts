import {ReactiveDom} from 'fstx-common/src/vdom'
import {SketchStore} from '../SketchStore'
import {PositionedObjectRef} from '../models'
import {map} from 'rxjs/operators'
import {TextBlockEditor} from './TextBlockEditor'
import _ from 'lodash'
import {h} from 'snabbdom'

export class SelectedItemEditor {

  constructor(container: HTMLElement, store: SketchStore) {

    const dom$ = store.events.sketch.editingItemChanged.observe()
      .pipe(map(i => {

        const posItem = <PositionedObjectRef>i.data

        const block = posItem
          && posItem.itemType === 'TextBlock'
          && _.find(store.state.sketch.textBlocks,
            b => b._id === posItem.itemId)

        if (!block) {
          return h('div#editorOverlay',
            {
              style: {
                display: 'none',
              },
            })
        }

        return h('div#editorOverlay',
          {
            style: {
              // left: posItem.clientX + "px",
              // top: posItem.clientY + "px",
              'z-index': '1',
            },
          },
          [
            new TextBlockEditor(store).render(block),
          ])

      }))

    ReactiveDom.renderStream(dom$, container)
  }
}