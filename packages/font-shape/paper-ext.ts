declare module paper {

  interface Curvelike {
    length: number;

    getPointAt(offset: number): paper.Point;
  }

}
