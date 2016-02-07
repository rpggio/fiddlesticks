
class ViewZoom {

    paperScope: paper.PaperScope;
    factor = 1.25;
    
    private _minZoom: number;
    private _maxZoom: number;

    constructor(paperScope: paper.PaperScope) {
        this.paperScope = paperScope;
        
        let view = this.paperScope.view;

        (<any>$(view.element)).mousewheel((event) => {
            let mousePosition = new paper.Point(event.offsetX, event.offsetY);
            this.changeZoomCentered(event.deltaY, mousePosition);
        });
    }

    get zoom(): number{
        return this.paperScope.view.zoom;
    }

    get zoomRange(): number[] {
        return [this._minZoom, this._maxZoom];
    }

    /**
     * Set zoom level.
     * @returns zoom level that was set, or null if it was not changed
     */
    setZoomConstrained(zoom: number): number {
        if(this._minZoom) {
            zoom = Math.max(zoom, this._minZoom);
        }
        if(this._maxZoom){
            zoom = Math.min(zoom, this._maxZoom);
        }
        let view = this.paperScope.view;
        if(zoom != view.zoom){
            view.zoom = zoom;
            return zoom;
        }
        return null;
    }

    setZoomRange(range: paper.Size[]): number[] {
        let view = this.paperScope.view;
        let aSize = range.shift();
        let bSize = range.shift();
        let a = aSize && Math.min( 
            view.bounds.height / aSize.height,         
            view.bounds.width / aSize.width);
        let b = bSize && Math.min( 
            view.bounds.height / bSize.height,         
            view.bounds.width / bSize.width);
        let min = Math.min(a,b);
        if(min){
            this._minZoom = min;
        }
        let max = Math.max(a,b);
        if(max){
            this._maxZoom = max;
        }
        return [this._minZoom, this._maxZoom];
    }

    changeZoomCentered(deltaY: number, mousePos: paper.Point) {
        if (!deltaY) {
            return;
        }
        let view = this.paperScope.view;
        let oldZoom = view.zoom;
        let oldCenter = view.center;
        let viewPos = view.viewToProject(mousePos);
        
        let newZoom = deltaY > 0
            ? view.zoom * this.factor
            : view.zoom / this.factor;
        newZoom = this.setZoomConstrained(newZoom);
        
        if(!newZoom){
            return;
        }

        let zoomScale = oldZoom / newZoom;
        let centerAdjust = viewPos.subtract(oldCenter);
        let offset = viewPos.subtract(centerAdjust.multiply(zoomScale))
            .subtract(oldCenter);

        view.center = view.center.add(offset);
    };
    
    zoomTo(rect: paper.Rectangle){
        let view = this.paperScope.view;
        view.center = rect.center;
        view.zoom = Math.min( 
            view.bounds.height / rect.height,         
            view.bounds.width / rect.width) * 0.95;
    }
}
