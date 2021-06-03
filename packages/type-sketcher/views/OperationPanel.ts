import {SketchStore} from '../SketchStore'
import {ReactiveDom} from 'fstx-common/src/vdom'
import {map} from 'rxjs/operators'

export class OperationPanel {
  private store: SketchStore

  constructor(container: HTMLElement, store: SketchStore) {

    const dom$ = store.operation$.pipe(map(op => {
      if (!op) {
        return h('div.hidden')
      }
      return h('div.operation', [op.render()])
    }))
    ReactiveDom.renderStream(dom$, container)

  }
}