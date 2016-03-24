namespace FontShape {

    export class PathSection implements paper.Curvelike {
        path: paper.Path;
        unitStart: number;
        unitLength: number;
        clockwise: boolean;

        /**
         * Start and end are unit lengths: 0 to 1.
         */
        constructor(path: paper.Path, 
            unitStart: number, 
            unitLength: number, 
            clockwise: boolean = true) {
            this.path = path;
            this.unitStart = unitStart;
            this.unitLength = unitLength;
            this.clockwise = clockwise;
        }

        get length() {
            return this.unitLength * this.path.length;
        }

        /**
         * @param offset: length offset relative to this section.
         */
        getPointAt(offset: number) {
            const pathLength = this.path.length;
            const direction = this.path.clockwise == this.clockwise ? 1 : -1;
            let pathOffset = this.unitStart * pathLength + offset * direction;
            if (pathOffset > pathLength){
                pathOffset -= pathLength;
            }
            if(pathOffset < 0){
                pathOffset += pathLength;
            }
            return this.path.getPointAt(pathOffset);
        }
    }

}