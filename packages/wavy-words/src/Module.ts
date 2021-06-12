import { WavyStore } from './WavyStore'
import { Builder } from './Builder'
import { PreviewCanvas } from './PreviewCanvas'
import { ShareOptionsUI } from './ShareOptionsUI'
import { Dickens } from './templates'

export class Module {
  store: WavyStore
  builder: Builder

  constructor(
    builderContainer: HTMLElement,
    previewCanvas: HTMLCanvasElement,
    renderCanvas: HTMLCanvasElement,
    belowCanvas: HTMLElement) {

    this.store = new WavyStore(new Dickens())
    this.builder = new Builder(builderContainer, this.store)

    new PreviewCanvas(previewCanvas, this.store)

    // this.store.templateState$.subscribe(ts => console.log('templateState', ts))
    // this.store.template$.subscribe(t => console.log('template', t))

    new ShareOptionsUI(belowCanvas, this.store)
  }

  start() {
    this.store.updateTemplateState(
      {
        design:
          {
            content: {
              text: 'Don\'t gobblefunk around with words.',
              source: '- Roald Dahl, The BFG',
            },
            seed: 0.9959176457803123,
            shape: 'narrow',
            font: {
              family: 'Amatic SC',
              variant: 'regular',
            },
            palette: {
              color: '#854442',
              invert: true,
            },
          },
        fontCategory: 'handwriting',
      })
  }
}
