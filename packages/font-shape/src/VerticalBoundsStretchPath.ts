import {VerticalBounds} from './models'
import {CornerOffsets} from './SnapPath'
import * as paper from 'paper'
import {dualBoundsPathProjection, tracePathAsPoints} from './PaperHelpers'
import {PathTransform} from './PathTransform'

export class VerticalBoundsStretchPath extends paper.Group {
  static pointsPerPath = 200
  corners: CornerOffsets
  private _boundaries: VerticalBounds
  private _content: paper.CompoundPath
  private _warped: paper.CompoundPath

  constructor(
    content: paper.CompoundPath,
    boundaries?: VerticalBounds,
  ) {
    super()

    this._content = content
    this._content.visible = false
    this._boundaries = boundaries ||
      {
        upper: new paper.Path([content.bounds.topLeft, content.bounds.topRight]),
        lower: new paper.Path([content.bounds.bottomLeft, content.bounds.bottomRight]),
      }
    this._warped = new paper.CompoundPath(content.pathData)
    this._warped.fillColor = new paper.Color('lightgray')

    this.addChild(this._content)
    this.addChild(this._warped)

    this.updatePath()
  }

  updatePath() {
    const contentOrigin = this._content.bounds.topLeft
    const contentWidth = this._content.bounds.width
    const contentHeight = this._content.bounds.height
    let projection = dualBoundsPathProjection(
      this._boundaries.upper, this._boundaries.lower)
    let transform = new PathTransform(point => {
      if (!point) {
        return point
      }
      let relative = point.subtract(contentOrigin)
      let unit = new paper.Point(
        relative.x / contentWidth,
        relative.y / contentHeight)
      let projected = projection(unit)
      return projected
    })

    const newPaths = this._content.children
      .map(item => {
        const path = <paper.Path>item
        const xPoints = tracePathAsPoints(path, VerticalBoundsStretchPath.pointsPerPath)
          .map(p => transform.transformPoint(p))
        const xPath = new paper.Path({
          segments: xPoints,
          closed: true,
          clockwise: path.clockwise,
        })
        //xPath.reduce();
        return xPath
      })
    this._warped.removeChildren()
    this._warped.addChildren(newPaths)
  }
}
