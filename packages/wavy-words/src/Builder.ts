import { ReactiveDom } from 'fstx-common/src/vdom'
import { TemplateUIContext } from './models'
import { WavyStore } from './WavyStore'
import { TemplateFontChooser } from './controls'
import _ from 'lodash'
import { h } from 'snabbdom'
import { map } from 'rxjs/operators'

export class Builder {

  static defaultFontUrl = '../fonts/Roboto-500.ttf'

  constructor(container: HTMLElement, store: WavyStore) {

    const context = <TemplateUIContext>{
      get fontCatalog() {
        return store.fontCatalog
      },
      renderDesign: (design, callback) => {
        store.render({
          design: design,
          callback,
        })
      },
      createFontChooser: () => {
        return new TemplateFontChooser(store)
      },
    }

    // async observe
    store.template$.subscribe(t => {
      const newTemplateState = t.createNew(context)
      _.merge(newTemplateState, store.state.templateState)
      store.setTemplateState(newTemplateState)
    })

    const dom$ = store.templateState$.pipe(
      map(ts => {
        let controls
        try {
          controls = store.template.createUI(context)
        } catch (err) {
          console.error(`Error calling ${store.template.name}.createUI`, err)
        }

        for (const c of controls) {
          c.value$.subscribe(d => store.updateTemplateState(d))
        }
        const nodes = controls.map(c => c.createNode(ts))
        return h('div#templateControls', {}, nodes)
      }))

    ReactiveDom.renderStream(dom$, container)
  }

}
