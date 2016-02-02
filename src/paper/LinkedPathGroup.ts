// <reference path="typings/paper.d.ts" />

interface PathLike {
    length: number;
    getLocationAt(offset: number, isParameter?: boolean): paper.CurveLocation;
    getPointAt(offset: number, isPatameter?: boolean): paper.Point;
    getTangentAt(offset: number, isPatameter?: boolean): paper.Point;
    getNearestPoint(point: paper.Point): paper.Point;
}

class LinkedPathGroup extends paper.Group
    implements PathLike 
{
    
    addChild(path: paper.Path): paper.Item {
        return super.addChild(path);
    }
    
    public get length(): number {
        return this.children.reduce((a, b: paper.Path) => a + b.length, 0);
    }
    
    public get paths(): paper.Path[] {
        return <paper.Path[]>this.children;
    }
    
    getLocationAt(offset: number, isParameter?: boolean): paper.CurveLocation{
        let path: paper.Path = null;
        for(path of this.paths){
            let len = path.length;
            if(len >= offset){
                break;
            }
            offset -= len;
        }
        return path.getLocationAt(offset, isParameter);
    }
    
    getPointAt(offset: number, isParameter?: boolean): paper.Point{
        let path: paper.Path = null;
        for(path of this.paths){
            let len = path.length;
            if(len >= offset){
                break;
            }
            offset -= len;
        }
        return path.getPointAt(offset, isParameter);    
    }
    
    getTangentAt(offset: number, isPatameter?: boolean): paper.Point{
        let path: paper.Path = null;
        for(path of this.paths){
            let len = path.length;
            if(len >= offset){
                break;
            }
            offset -= len;
        }
        return path.getTangentAt(offset, isPatameter);    
    }
    
    getNearestPoint(point: paper.Point): paper.Point {
        let nearestAgg: paper.Point;
        let distAgg: number;
        for(let path of this.paths){
            if(path.segments.length < 2){
                continue;
            }
            let nearest = path.getNearestPoint(point);
            let dist = nearest.getDistance(point);
            if(!nearestAgg || dist < distAgg){
                nearestAgg = nearest;
                distAgg = dist;   
            }
        }
        return nearestAgg;
    }
}