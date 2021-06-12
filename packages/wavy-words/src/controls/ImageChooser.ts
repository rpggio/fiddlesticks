import { h, VNode } from 'snabbdom'
import { Subject } from 'rxjs'

export class ImageChooser {

  private _chosen$ = new Subject<ImageChoice>()

  get chosen$() {
    return this._chosen$
  }

  createNode(options: ImageChooserOptions): VNode {
    const choiceNodes = options.choices.map(c => {
      let img: VNode
      const onClick = () => {
        this._chosen$.next(c)
      }
      const selector = options.chosen === c.value
        ? 'img.chosen'
        : 'img'
      if (c.loadImage) {
        let imgElm
        img = h(selector,
          {
            on: {
              click: onClick,
            },
            hook: {
              // kick off image load
              insert: vnode => c.loadImage(vnode.elm as HTMLImageElement),
            },
          },
          [],
        )

      } else {
        img = h(selector,
          {
            attrs: {
              href: c.imageUrl,
            },
            on: {
              click: onClick,
            },
          },
        )
      }
      return h('li', {}, [
        img,
      ])
    })
    return h('ul.chooser', {}, choiceNodes)
  }

}

export interface ImageChooserOptions {
  choices: ImageChoice[],
  chosen?: string
}

export interface ImageChoice {
  value: string;
  label: string;
  imageUrl?: string;
  loadImage?: (element: HTMLImageElement) => void;
}
