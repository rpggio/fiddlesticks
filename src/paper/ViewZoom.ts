
class ViewZoom {

    paperScope: paper.PaperScope;
    factor = 1.25;

    constructor(paperScope: paper.PaperScope) {
        this.paperScope = paperScope;
        
        let view = this.paperScope.view;

        (<any>$(view.element)).mousewheel((event) => {
            let mousePosition = new paper.Point(event.offsetX, event.offsetY);
            this.changeZoomCentered(event.deltaY, mousePosition);
        });
    }

    changeZoomCentered(deltaY: number, mousePos: paper.Point) {
        if (!deltaY) {
            return;
        }
        let view = this.paperScope.view;
        let newZoom = deltaY > 0
            ? view.zoom * this.factor
            : view.zoom / this.factor;
        let zoomScale = view.zoom / newZoom;
        let viewPos = view.viewToProject(mousePos);
        let oldCenter = view.center;
        let centerAdjust = viewPos.subtract(oldCenter);
        let offset = viewPos.subtract(centerAdjust.multiply(zoomScale))
            .subtract(oldCenter);

        view.zoom = newZoom;
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
