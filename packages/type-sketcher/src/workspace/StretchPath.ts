import paper from 'paper'
import {PaperEventType} from 'fstx-common/src/paper/PaperEventType'
import {PathHandle} from './PathHandle'
import {ObservableEvent} from 'fstx-common/src/events'

export class StretchPath extends paper.Group {

  constructor(segments: paper.Segment[], style?: paper.Style) {
    super()

    this._path = new paper.Path(segments)
    this.addChild(this._path)

    if (style) {
      this._path.style = style
    } else {
      this._path.strokeColor = new paper.Color('lightgray')
      this._path.strokeWidth = 6
    }

    for (const s of this._path.segments) {
      this.addSegmentHandle(s)
    }

    for (const c of this._path.curves) {
      this.addCurveHandle(c)
    }
  }

  private _path: paper.Path

  get path(): paper.Path {
    return this._path
  }

  private _pathChanged = new ObservableEvent<paper.Path>()

  get pathChanged() {
    return this._pathChanged
  }

  private addSegmentHandle(segment: paper.Segment) {
    this.addHandle(new PathHandle(segment))
  }

  private addCurveHandle(curve: paper.Curve) {
    let handle = new PathHandle(curve)
    handle.curveSplit.subscribeOne(curveIdx => {
      this.addCurveHandle(this._path.curves[curveIdx])
      this.addCurveHandle(this._path.curves[curveIdx + 1])
    })
    this.addHandle(handle)
  }

  private addHandle(handle: PathHandle) {
    handle.visible = this.visible
    handle.on(PaperEventType.mouseDrag, ev => {
      this._pathChanged.notify(this._path)
    })
    handle.on(PaperEventType.click, ev => {
      this._pathChanged.notify(this._path)
    })
    this.addChild(handle)
  }
}
