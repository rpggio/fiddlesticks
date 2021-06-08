import {WavyStore} from './WavyStore'
import {Design, TemplateBuildContext, TemplateState} from './models'
import {createFileName, dataURLToBlob} from 'fstx-common'
import paper from 'paper'
import {getExportDpi, VerticalBoundsStretchPath} from 'font-shape'
import {Builder} from './Builder'
import {saveAs} from 'file-saver'

export class PreviewCanvas {
  canvas: HTMLCanvasElement
  store: WavyStore
  builtDesign: paper.Item
  context: TemplateBuildContext

  private lastReceived: Design
  private rendering = false
  private project: paper.Project
  private workspace: paper.Group

  constructor(canvas: HTMLCanvasElement, store: WavyStore) {
    this.store = store

    paper.setup(canvas)
    this.project = paper.project
    this.workspace = new paper.Group()

    VerticalBoundsStretchPath.pointsPerPath = 400

    this.context = {
      getFont: specifier => {
        let url: string
        if (!specifier || !specifier.family) {
          url = Builder.defaultFontUrl
        } else {
          url = store.fontCatalog.getUrl(specifier.family, specifier.variant)
            || Builder.defaultFontUrl
        }
        return store.parsedFonts.get(url)
          .then(result => result.font)
      },
    }

    store.templateState$.subscribe((ts: TemplateState) => {

      // only process one request at a time
      if (this.rendering) {
        // always process the last received
        this.lastReceived = ts.design
        return
      }

      this.render(ts.design).then(() => undefined)
    })

    store.events.downloadPNGRequested.sub(pixels => this.downloadPNG(pixels))
  }

  private downloadPNG(pixels: number) {
    if (!this.store.design.content
      || !this.store.design.content.text
      || !this.store.design.content.text.length) {
      return
    }

    // Half of max DPI produces approx 4200x4200.
    const dpi = 0.5 * getExportDpi(this.workspace.bounds.size, pixels)
    const raster = this.workspace.rasterize({resolution: dpi, insert: false})
    const data = raster.toDataURL()
    const fileName = createFileName(this.store.design.content.text, 40, 'png')
    const blob = dataURLToBlob(data)
    saveAs(blob, fileName)
  }

  private renderLastReceived() {
    if (this.lastReceived) {
      const rendering = this.lastReceived
      this.lastReceived = null
      this.render(rendering).then(() => undefined)
    }
  }

  private render(design: Design): Promise<void> {
    if (this.rendering) {
      throw new Error('render is in progress')
    }
    this.rendering = true
    paper.project.activeLayer.removeChildren()
    this.workspace = new paper.Group()
    return this.store.template.build(design, this.context).then(item => {
        try {
          if (!item) {
            console.log('no render result from', design)
            return
          }

          item.fitBounds(this.project.view.bounds)
          item.bounds.point = this.project.view.bounds.topLeft
          this.workspace.addChild(item)
        } finally {
          this.rendering = false
        }

        // handle any received while rendering
        this.renderLastReceived()
      },
      err => {
        console.error('Error rendering design', err, design)
        this.rendering = false
      })
  }

}
