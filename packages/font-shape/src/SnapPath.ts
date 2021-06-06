import paper from 'paper'
import {dualBoundsPathProjection, pathOffsetLength, tracePathAsPoints} from './PaperHelpers'
import {PathSection} from './PathSection'
import {PathTransform} from './PathTransform'

export class SnapPath extends paper.Group {

  corners: CornerOffsets
  private readonly _region: paper.Path
  private readonly _content: paper.CompoundPath
  private readonly _warped: paper.CompoundPath

  constructor(region: paper.Path, content: paper.CompoundPath) {
    super()

    this._region = region
    this._content = content
    this._content.visible = false
    this._warped = new paper.CompoundPath(content.pathData)
    this._warped.fillColor = new paper.Color('gray')
    this.corners = [0, 0.25, 0.50, 0.75]

    this.addChild(this._content)
    this.addChild(this._warped)

    this.updatePath()
  }

  private static incrementOffset(offset: number, delta: number) {
    let result = offset + delta
    if (result < 0) {
      result = result + Math.round(result) + 1
    }
    result = result % 1
    //console.log(`${offset} + ${delta} => ${result}`);
    return result
  }

  updatePath() {
    const contentOrigin = this._content.bounds.topLeft
    const contentWidth = this._content.bounds.width
    const contentHeight = this._content.bounds.height
    const regionLength = this._region.length
    const top = new PathSection(
      this._region,
      this.corners[0],
      pathOffsetLength(this.corners[0], this.corners[1]))
    const bottom = new PathSection(
      this._region,
      this.corners[3],
      pathOffsetLength(this.corners[3], this.corners[2], false),
      false)

    let projection = dualBoundsPathProjection(top, bottom)
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
        const path = item as paper.Path
        const xPoints = tracePathAsPoints(path, 100)
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

  /**
   * Slide offset points by the given amount.
   * @param unitOffset: value 0 to 1
   */
  slide(unitOffset: number) {
    this.corners = <CornerOffsets>this.corners.map(
      c => SnapPath.incrementOffset(c, unitOffset))
  }

}

/**
 * Path offsets on region for corners of SnapPath content,
 *   starting with topLeft and proceeding clockwise
 *   to bottomLeft.
 */
export type CornerOffsets = [
  number, // topLeft
  number, // topRight
  number, // bottomRight
  number  // bottomLeft
]
