
declare var solve: (a: any, b: any, fast: boolean) => void;

class PerspectiveTransform {
    
    source: Quad;
    dest: Quad;
    persp: any;
    matrix: number[];
    
    constructor(source: Quad, dest: Quad){
        this.source = source;
        this.dest = dest;
        
        this.matrix = PerspectiveTransform.createMatrix(source, dest);
    }
    
    // Given a 4x4 perspective transformation matrix, and a 2D point (a 2x1 vector),
    // applies the transformation matrix by converting the point to homogeneous
    // coordinates at z=0, post-multiplying, and then applying a perspective divide.
    transformPoint(point: paper.Point): paper.Point {
        let p3 = PerspectiveTransform.multiply(this.matrix, [point.x, point.y, 0, 1]);
        let result = new paper.Point(p3[0] / p3[3], p3[1] / p3[3]);
        //console.log('xform', point.toString(), result.toString());
        return result;
    }
    
    static createMatrix(source: Quad, target: Quad): number[] {
        
        let sourcePoints = [
            [source.a.x, source.a.y], 
            [source.b.x, source.b.y], 
            [source.c.x, source.c.y], 
            [source.d.x, source.d.y]];
        let targetPoints = [
            [target.a.x, target.a.y], 
            [target.b.x, target.b.y], 
            [target.c.x, target.c.y], 
            [target.d.x, target.d.y]];
        
        for (var a = [], b = [], i = 0, n = sourcePoints.length; i < n; ++i) {
            var s = sourcePoints[i], t = targetPoints[i];
            a.push([s[0], s[1], 1, 0, 0, 0, -s[0] * t[0], -s[1] * t[0]]), b.push(t[0]);
            a.push([0, 0, 0, s[0], s[1], 1, -s[0] * t[1], -s[1] * t[1]]), b.push(t[1]);
        }

        let X = solve(a, b, true); 
        return [
            X[0], X[3], 0, X[6],
            X[1], X[4], 0, X[7],
               0,    0, 1,    0,
            X[2], X[5], 0,    1
        ].map(function(x) {
            return Math.round(x * 100000) / 100000;
        });
    }

    // Post-multiply a 4x4 matrix in column-major order by a 4x1 column vector:
    // [ m0 m4 m8  m12 ]   [ v0 ]   [ x ]
    // [ m1 m5 m9  m13 ] * [ v1 ] = [ y ]
    // [ m2 m6 m10 m14 ]   [ v2 ]   [ z ]
    // [ m3 m7 m11 m15 ]   [ v3 ]   [ w ]
    static multiply(matrix, vector) {
        return [
            matrix[0] * vector[0] + matrix[4] * vector[1] + matrix[8 ] * vector[2] + matrix[12] * vector[3],
            matrix[1] * vector[0] + matrix[5] * vector[1] + matrix[9 ] * vector[2] + matrix[13] * vector[3],
            matrix[2] * vector[0] + matrix[6] * vector[1] + matrix[10] * vector[2] + matrix[14] * vector[3],
            matrix[3] * vector[0] + matrix[7] * vector[1] + matrix[11] * vector[2] + matrix[15] * vector[3]
        ];
    }
    
    transformPathItem(path: paper.PathItem){
        if(path.className === 'CompoundPath'){
            this.transformCompoundPath(<paper.CompoundPath>path);
        } else {
            this.transformPath(<paper.Path>path);
        }
    }
    
    transformCompoundPath(path: paper.CompoundPath){
        for(let p of path.children){
            this.transformPath(<paper.Path>p);
        }
    }
    
    transformPath(path: paper.Path){
        for(let segment of path.segments){
            let origPoint = segment.point;
            let newPoint = this.transformPoint(segment.point);
            origPoint.x = newPoint.x;
            origPoint.y = newPoint.y;
        }
    }
}

class Quad {
    a: paper.Point;
    b: paper.Point;
    c: paper.Point;
    d: paper.Point;
    
    constructor(a: paper.Point, b: paper.Point, c: paper.Point, d: paper.Point){
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
    
    static fromRectangle(rect: paper.Rectangle){
        return new Quad(
            rect.topLeft,
            rect.topRight,
            rect.bottomLeft,
            rect.bottomRight
        );
    }
    
    static fromCoords(coords: number[]) : Quad {
        return new Quad(
            new paper.Point(coords[0], coords[1]),
            new paper.Point(coords[2], coords[3]),
            new paper.Point(coords[4], coords[5]),
            new paper.Point(coords[6], coords[7])
        )
    }
    
    asCoords(): number[] {
        return [
            this.a.x, this.a.y,
            this.b.x, this.b.y,
            this.c.x, this.c.y,
            this.d.x, this.d.y
        ];
    }
}