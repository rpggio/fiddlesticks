export class PathTransform {
  pointTransform: (point: paper.Point) => paper.Point

  constructor(pointTransform: (point: paper.Point) => paper.Point) {
    this.pointTransform = pointTransform
  }

  transformPoint(point: paper.Point): paper.Point {
    return this.pointTransform(point)
  }

  transformPathItem(path: paper.PathItem) {
    if (path.className === 'CompoundPath') {
      this.transformCompoundPath(path as paper.CompoundPath)
    } else {
      this.transformPath(path as paper.Path)
    }
  }

  transformCompoundPath(path: paper.CompoundPath) {
    for (let p of path.children) {
      this.transformPath(p as paper.Path)
    }
  }

  transformPath(path: paper.Path) {
    for (let segment of path.segments) {
      let origPoint = segment.point
      let newPoint = this.transformPoint(segment.point)
      origPoint.x = newPoint.x
      origPoint.y = newPoint.y
    }
  }
}
