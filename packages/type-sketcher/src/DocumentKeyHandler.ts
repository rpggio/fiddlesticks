import { SketchStore } from './SketchStore'
import { KeyCodes } from 'fstx-common'

export class DocumentKeyHandler {
  constructor(store: SketchStore) {
    // note: undisposed event subscription
    document.addEventListener('keyup', e => {
      if (e.keyCode == KeyCodes.Esc) {
        store.actions.sketch.setSelection.dispatch(null)
      }
    })
  }
}
