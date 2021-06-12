import { SketchStore } from '../SketchStore'
import { Operation } from '../models'
import { h } from 'snabbdom'

export class UploadImage implements Operation {

  store: SketchStore
  onClose: () => void

  constructor(store: SketchStore) {
    this.store = store
  }

  render() {
    return h('div',
      [
        h('h3', ['Upload image']),
        h('input',
          {
            attrs: {
              type: 'file',
            },
            on: {
              change: ev => {
                const file = (ev.target as HTMLInputElement).files[0]
                this.upload(file)
              },
            },
          },
        ),
      ])
  }

  private upload(file) {
    const url = window.URL || window.webkitURL
    const src = url.createObjectURL(file)
    this.store.imageUploaded(src)
    this.onClose && this.onClose()
  }
}
