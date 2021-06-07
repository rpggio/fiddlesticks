import paper from 'paper'
import saveAs from 'file-saver'
import {ChangeFlag, ExtendedEventType, extendMouseEvents, observe, ViewZoom} from 'fstx-common/src/paper'
import {PaperEventType} from 'fstx-common/src/paper/PaperEventType'
import {SketchStore} from './SketchStore'
import {getExportDpi} from 'font-shape'
import {BlockArrangement, ImageExportOptions, PathRecord, PointRecord, Sketch, TextBlock} from './models'
import {dataURLToBlob} from 'fstx-common'
import {TextWarp} from './workspace'
import {DocumentKeyHandler} from './DocumentKeyHandler'
import {debounce, throttle} from 'rxjs/operators'
import {interval} from 'rxjs'
import {SketchHelpers} from './SketchHelpers'
import _ from 'lodash'

interface Window {
  webkitURL: URL;
}

export class WorkspaceController {

  static TEXT_CHANGE_RENDER_THROTTLE_MS = 500
  static BLOCK_BOUNDS_CHANGE_THROTTLE_MS = 500

  defaultSize = new paper.Size(50000, 40000)
  defaultScale = 0.02

  canvas: HTMLCanvasElement
  project: paper.Project
  fallbackFont: opentypejs.Font
  viewZoom: ViewZoom

  private store: SketchStore
  private _sketch: Sketch
  private _textBlockItems: { [textBlockId: string]: TextWarp } = {}
  private _workspace: paper.Item
  private _backgroundImage: paper.Raster

  constructor(store: SketchStore, fallbackFont: opentypejs.Font) {
    this.store = store
    this.fallbackFont = fallbackFont
    paper.settings.handleSize = 1

    this.canvas = document.getElementById('mainCanvas') as HTMLCanvasElement
    paper.setup(this.canvas)
    this.project = paper.project
    window.onresize = () => this.project.view.update()

    store.events.mergeTyped(
      store.events.sketch.loaded,
      store.events.sketch.attrChanged,
    ).subscribe(ev => {
      this.canvas.style.backgroundColor = ev.data.backgroundColor || ''
    })

    this.viewZoom = new ViewZoom(this.project, () => [this._backgroundImage])
    this.viewZoom.setZoomRange([
      this.defaultSize.multiply(this.defaultScale * 0.1),
      this.defaultSize.multiply(0.5)])
    this.viewZoom.viewChanged.subscribe(bounds => {
      store.actions.editor.viewChanged.dispatch(bounds)
    })

    const clearSelection = () => {
      if (store.state.selection) {
        store.actions.sketch.setSelection.dispatch(null)
      }
    }
    paper.view.on(PaperEventType.click, ev => {
      if (!this.project.hitTest(ev.point)) {
        clearSelection()
      }
    })
    paper.view.on(ExtendedEventType.mouseDragStart, clearSelection)

    const keyHandler = new DocumentKeyHandler(store)

    // ----- Designer -----

    store.events.editor.workspaceInitialized.sub(() => {
      this.project.view.update()
    })

    store.events.editor.zoomToFitRequested.subscribe(() => {
      this.zoomToFit()
    })

    store.events.editor.exportSVGRequested.subscribe(() => {
      this.downloadSVG()
    })

    store.events.editor.exportPNGRequested.sub(options => {
      this.downloadPNG(options)
    })

    store.events.editor.snapshotExpired.sub(() => {
      this.getSnapshotPNG(72).then(data => {
        store.actions.editor.updateSnapshot.dispatch({
          sketchId: this.store.state.sketch._id, pngDataUrl: data,
        })
      })
    })

    // ----- Sketch -----

    store.events.sketch.loaded.subscribe(
      ev => {
        this._sketch = ev.data

        this.project.clear()
        this.project.deselectAll()
        this._workspace = new paper.Group()
        this._textBlockItems = {}
      },
    )

    store.events.sketch.selectionChanged.subscribe(m => {
      this.project.deselectAll()
      if (m.data) {
        let block = m.data.itemId && this._textBlockItems[m.data.itemId]
        if (block && !block.selected) {
          block.selected = true
        }
      }
    })

    // ----- TextBlock -----

    store.events.mergeTyped(
      store.events.textblock.added,
      store.events.textblock.loaded,
    ).subscribe(
      ev => this.addBlock(ev.data))

    store.events.textblock.attrChanged
      .observe()
      .pipe(
        throttle(() => interval(WorkspaceController.TEXT_CHANGE_RENDER_THROTTLE_MS)),
      )
      .subscribe(m => {
        let item = this._textBlockItems[m.data._id]
        if (item) {
          const textBlock = m.data
          item.text = textBlock.text
          // @ts-ignore
          item.customStyle = {
            fillColor: new paper.Color(textBlock.textColor),
            backgroundColor: textBlock.backgroundColor,
          }
        }
      })

    store.events.textblock.fontReady.sub(data => {
      const item = this._textBlockItems[data.textBlockId]
      if (item) {
        item.font = data.font
      }
    })

    store.events.textblock.removed.subscribe(m => {
      let item = this._textBlockItems[m.data._id]
      if (item) {
        item.remove()
        delete this._textBlockItems[m.data._id]
      }
    })

    store.events.textblock.editorClosed.subscribe(m => {
      let item = this._textBlockItems[m.data._id]
      if (item) {
        item.updateTextPath()
      }
    })

    store.events.sketch.imageUploaded.sub(url => {
      this.setBackgroundImage(url)
    })

    store.transparency$.subscribe(value => {
      this._workspace.opacity = value ? 0.75 : 1
    })

  }

  zoomToFit() {
    const bounds = this.getViewableBounds()
    if (bounds.width > 0 && bounds.height > 0) {
      this.viewZoom.zoomTo(bounds.scale(1.2))
    }
  }

  private getViewableBounds(): paper.Rectangle {
    const bounds = this._workspace.bounds
    if (!bounds || bounds.width === 0 || bounds.height === 0) {
      return new paper.Rectangle(
        new paper.Point(0, 0),
        this.defaultSize.multiply(0.05))
    }
    return bounds
  }

  /**
   * @returns data URL
   */
  private getSnapshotPNG(dpi: number): Promise<string> {
    return new Promise<string>(callback => {
      const complete = () => {
        const raster = this.project.activeLayer.rasterize({resolution: dpi, insert: false})
        const data = raster.toDataURL()
        callback(data)
      }

      if (this.store.state.sketch.backgroundColor) {
        const background = this.insertBackground(false)
        complete()
        background.remove()
      } else {
        complete()
      }
    })
  }

  private downloadPNG(options: ImageExportOptions) {
    const dpi = getExportDpi(this._workspace.bounds.size,
      options.pixels || 600 * 600)
    this.getSnapshotPNG(dpi).then(data => {

      const fileName = SketchHelpers.getSketchFileName(
        this.store.state.sketch, 40, 'png')
      const blob = dataURLToBlob(data)
      saveAs(blob, fileName)
    })
  }

  private downloadSVG() {
    const completeDownload = () => {
      this.project.deselectAll()
      const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(
        this.project.exportSVG({asString: true}) as string)
      const blob = dataURLToBlob(dataUrl)
      const fileName = SketchHelpers.getSketchFileName(
        this.store.state.sketch, 40, 'svg')
      saveAs(blob, fileName)
    }

    if (this.store.state.sketch.backgroundColor) {
      const background = this.insertBackground(false)
      completeDownload()
      background.remove()
    } else {
      completeDownload()
    }
  }

  /**
   * Insert sketch background to provide background fill (if necessary)
   *   and add margin around edges.
   */
  private insertBackground(watermark: boolean): paper.Item {
    const sketchBounds = this.getViewableBounds()
    const margin = Math.max(sketchBounds.width, sketchBounds.height) * 0.02
    const imageBounds = new paper.Rectangle(
      sketchBounds.topLeft.subtract(margin),
      sketchBounds.bottomRight.add(margin))

    const fill = new paper.Shape.Rectangle(imageBounds)
    fill.fillColor = new paper.Color(this.store.state.sketch.backgroundColor)

    const background = new paper.Group([fill])

    this._workspace.insertChild(0, background)
    return background
  }

  private addBlock(textBlock: TextBlock) {
    if (!textBlock) {
      return
    }

    if (!textBlock._id) {
      console.error('received block without id', textBlock)
    }

    let item = this._textBlockItems[textBlock._id]
    if (item) {
      console.error('Received addBlock for block that is already loaded')
      return
    }

    let bounds: { upper: paper.Segment[], lower: paper.Segment[] }

    if (textBlock.outline) {
      const loadSegment = (record: Array<PointRecord>) => {
        const point = record[0]
        if (point instanceof Array) {
          return new paper.Segment(
            new paper.Point(record[0]),
            record[1] && new paper.Point(record[1]),
            record[2] && new paper.Point(record[2]))
        }
        // Single-point segments are stored as number[2]
        return new paper.Segment(new paper.Point(record))
      }
      bounds = {
        upper: textBlock.outline.top.segments.map(loadSegment),
        lower: textBlock.outline.bottom.segments.map(loadSegment),
      }
    }

    item = new TextWarp(
      this.fallbackFont,
      textBlock.text,
      bounds,
      null, {
        fillColor: new paper.Color(textBlock.textColor || 'red'),    // textColor should have been set elsewhere
        backgroundColor: textBlock.backgroundColor,
      } as any)

    this._workspace.addChild(item)

    extendMouseEvents(item)

    if (!textBlock.outline && textBlock.position) {
      item.position = new paper.Point(textBlock.position)
    }

    item.on(PaperEventType.click, ev => {
      if (item.selected) {
        // select next item behind
        let otherHits = _.values(this._textBlockItems)
          .filter(i => i.id !== item.id && !!i.hitTest(ev.point))
        const otherItem = _.sortBy(otherHits, i => i.index)[0]
        if (otherItem) {
          otherItem.bringToFront()
          const otherId = _.findKey(this._textBlockItems, i => i === otherItem)
          if (otherId) {
            this.store.actions.sketch.setSelection.dispatch(
              {itemId: otherId, itemType: 'TextBlock'})
          }
        }
      } else {
        item.bringToFront()
        if (!item.selected) {
          this.store.actions.sketch.setSelection.dispatch(
            {itemId: textBlock._id, itemType: 'TextBlock'})
        }
      }
    })

    item.on(ExtendedEventType.mouseDragStart, ev => {
      item.bringToFront()
    })

    item.on(PaperEventType.mouseDrag, ev => {
      item.translate(ev.delta)
    })

    item.on(ExtendedEventType.mouseDragEnd, ev => {
      let block = this.getBlockArrangement(item) as TextBlock
      block._id = textBlock._id
      this.store.actions.textBlock.updateArrange.dispatch(block)
      if (!item.selected) {
        this.store.actions.sketch.setSelection.dispatch(
          {itemId: textBlock._id, itemType: 'TextBlock'})
      }
    })

    // @ts-ignore
    const itemChange$ = observe(item, ChangeFlag.GEOMETRY)
    itemChange$
      .pipe(debounce(() => interval(WorkspaceController.BLOCK_BOUNDS_CHANGE_THROTTLE_MS)))
      .subscribe(() => {
        let block = this.getBlockArrangement(item) as TextBlock
        block._id = textBlock._id
        this.store.actions.textBlock.updateArrange.dispatch(block)
      })

    item.data = textBlock._id
    if (!textBlock.position) {
      item.position = this.project.view.bounds.point.add(
        new paper.Point(item.bounds.width / 2, item.bounds.height / 2)
          .add(50))
    }
    this._textBlockItems[textBlock._id] = item
  }

  private getBlockArrangement(item: TextWarp): BlockArrangement {
    // export returns an array with item type and serialized object:
    //   ["Path", PathRecord]
    const top = item.upper.exportJSON({asString: false})[1] as unknown as PathRecord
    const bottom = item.lower.exportJSON({asString: false})[1] as unknown as PathRecord

    return {
      position: [item.position.x, item.position.y],
      outline: {top, bottom},
    }
  }

  private setBackgroundImage(url: string) {
    if (!url) {
      if (this._backgroundImage) {
        this._backgroundImage.remove()
      }
      this._backgroundImage = null
    }

    const raster = new paper.Raster(url);
    raster.onLoad = () => {
      raster.sendToBack()
      if (this._backgroundImage) {
        this._backgroundImage.remove()
      }
      this._backgroundImage = raster
    }
  }
}
