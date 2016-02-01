
declare module paper {
    
    interface PathLike {
        length: number;
        getPointAt(offset: number): paper.Point;
    }
    
}