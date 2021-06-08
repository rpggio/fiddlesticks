export interface Curvelike {
  length: number

  getPointAt(offset: number): paper.Point
}

