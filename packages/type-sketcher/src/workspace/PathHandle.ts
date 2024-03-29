import paper from 'paper'
import { ChangeFlag, ExtendedEventType, extendMouseEvents } from 'fstx-common/src/paper'
import { PaperEventType } from 'fstx-common/src/paper/PaperEventType'
import { ObservableEvent } from 'fstx-common/src/events'

export class PathHandle extends paper.Group {

  static SEGMENT_MARKER_RADIUS = 10
  static CURVE_MARKER_RADIUS = 6
  private readonly _marker: paper.Shape
  private _segment: paper.Segment
  private _curve: paper.Curve
  private readonly _curveChangeUnsub: () => void

  constructor(attach: paper.Segment | paper.Curve) {
    super()

    let position: paper.Point
    let path: paper.Path
    if (attach instanceof paper.Segment) {
      this._segment = attach as paper.Segment
      position = this._segment.point
      path = this._segment.path
    } else if (attach instanceof paper.Curve) {
      this._curve = attach as paper.Curve
      position = this._curve.getPointAt(this._curve.length * 0.5)
      path = this._curve.path
    } else {
      throw 'attach must be Segment or Curve'
    }

    this._marker = new paper.Shape.Circle(position, PathHandle.SEGMENT_MARKER_RADIUS)
    this._marker.strokeColor = new paper.Color('blue')
    this._marker.fillColor = new paper.Color('white')
    this._marker.selectedColor = new paper.Color(0, 0)
    this.addChild(this._marker)

    if (this._segment) {
      this.styleAsSegment()
    } else {
      this.styleAsCurve()
    }

    extendMouseEvents(this)

    this.on(ExtendedEventType.mouseDragStart, () => {
      if (this._curve) {
        // split the curve, pupate to segment handle

        this._curveChangeUnsub()
        this._segment = new paper.Segment(this.center)
        const curveIdx = this._curve.index
        this._curve.path.insert(
          curveIdx + 1,
          this._segment,
        )
        this._curve = null
        this.styleAsSegment()
        this.curveSplit.notify(curveIdx)
      }
    })

    this.on(PaperEventType.mouseDrag, ev => {
      if (this._segment) {
        this._segment.point = this.center
        if (this._smoothed) {
          this._segment.smooth()
        }
      }
      this.translate(ev.delta)
      ev.stop()
    })

    this.on(PaperEventType.click, ev => {
      if (this._segment) {
        this.smoothed = !this.smoothed
      }
      ev.stop()
    })

    // @ts-ignore
    this._curveChangeUnsub = path.subscribe(flags => {
      if (this._curve && !this._segment
        && (flags & ChangeFlag.SEGMENTS)) {
        this.center = this._curve.getPointAt(this._curve.length * 0.5)
      }
    })

  }

  private _smoothed: boolean

  get smoothed(): boolean {
    return this._smoothed
  }

  set smoothed(value: boolean) {
    this._smoothed = value

    if (value) {
      this._segment.smooth()
    } else {
      this._segment.handleIn = null
      this._segment.handleOut = null
    }
  }

  private _curveSplit = new ObservableEvent<number>()

  get curveSplit() {
    return this._curveSplit
  }

  get center(): paper.Point {
    return this.position
  }

  set center(point: paper.Point) {
    this.position = point
  }

  private styleAsSegment() {
    this._marker.opacity = 0.8
    this._marker.dashArray = null
    this._marker.radius = PathHandle.SEGMENT_MARKER_RADIUS
  }

  private styleAsCurve() {
    this._marker.opacity = 0.8
    this._marker.dashArray = [2, 2]
    this._marker.radius = PathHandle.CURVE_MARKER_RADIUS
  }

}
