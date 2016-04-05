declare module paper {
    interface View {
        /**
         * Internal method for initiating mouse events on view.
         */
        emitMouseEvents(view: paper.View, item: paper.Item, type: string,
            event: any, point: paper.Point, prevPoint: paper.Point);
    }
}

namespace paperExt {

    export class ViewZoom {

        project: paper.Project;
        factor = 1.25;

        private _minZoom: number;
        private _maxZoom: number;
        private _mouseNativeStart: paper.Point;
        private _viewCenterStart: paper.Point;
        private _viewChanged = new ObservableEvent<paper.Rectangle>();

        constructor(project: paper.Project) {
            this.project = project;

            (<any>$(this.project.view.element)).mousewheel((event) => {
                const mousePosition = new paper.Point(event.offsetX, event.offsetY);
                this.changeZoomCentered(event.deltaY, mousePosition);
            });

            let didDrag = false;

            this.project.view.on(paper.EventType.mouseDrag, ev => {
                const view = this.project.view;
                const hit = project.hitTest(ev.point);
                if (!this._viewCenterStart) {  // not already dragging
                    if (hit) {
                        // don't start dragging
                        return;
                    }
                    this._viewCenterStart = view.center;
                    // Have to use native mouse offset, because ev.delta 
                    //  changes as the view is scrolled.
                    this._mouseNativeStart = new paper.Point(ev.event.offsetX, ev.event.offsetY);
                    view.emit(paperExt.EventType.mouseDragStart, ev);
                } else {
                    const nativeDelta = new paper.Point(
                        ev.event.offsetX - this._mouseNativeStart.x,
                        ev.event.offsetY - this._mouseNativeStart.y
                    );
                    // Move into view coordinates to subract delta,
                    //  then back into project coords.
                    view.center = view.viewToProject(
                        view.projectToView(this._viewCenterStart)
                            .subtract(nativeDelta));
                    didDrag = true;
                }
            });

            this.project.view.on(paper.EventType.mouseUp, ev => {
                const view = this.project.view;
                if (this._mouseNativeStart) {
                    this._mouseNativeStart = null;
                    this._viewCenterStart = null;
                    view.emit(paperExt.EventType.mouseDragEnd, ev);
                    if (didDrag) {
                        this._viewChanged.notify(view.bounds);
                        didDrag = false;
                    }
                }
            });
        }

        get viewChanged(): ObservableEvent<paper.Rectangle> {
            return this._viewChanged;
        }

        get zoom(): number {
            return this.project.view.zoom;
        }

        get zoomRange(): number[] {
            return [this._minZoom, this._maxZoom];
        }

        setZoomRange(range: paper.Size[]): number[] {
            const view = this.project.view;
            const aSize = range.shift();
            const bSize = range.shift();
            const a = aSize && Math.min(
                view.bounds.height / aSize.height,
                view.bounds.width / aSize.width);
            const b = bSize && Math.min(
                view.bounds.height / bSize.height,
                view.bounds.width / bSize.width);
            const min = Math.min(a, b);
            if (min) {
                this._minZoom = min;
            }
            const max = Math.max(a, b);
            if (max) {
                this._maxZoom = max;
            }
            return [this._minZoom, this._maxZoom];
        }

        zoomTo(rect: paper.Rectangle) {
            if(rect.isEmpty() || rect.width === 0 || rect.height === 0){
                console.warn("skipping zoom to", rect);
                return;
            }
            const view = this.project.view;
            view.center = rect.center;
            const zoomLevel = Math.min(
                view.viewSize.height / rect.height,
                view.viewSize.width / rect.width);
            view.zoom = zoomLevel;
            this._viewChanged.notify(view.bounds);
        }

        changeZoomCentered(delta: number, mousePos: paper.Point) {
            if (!delta) {
                return;
            }
            const view = this.project.view;
            const oldZoom = view.zoom;
            const oldCenter = view.center;
            const viewPos = view.viewToProject(mousePos);

            let newZoom = delta > 0
                ? view.zoom * this.factor
                : view.zoom / this.factor;
            newZoom = this.setZoomConstrained(newZoom);

            if (!newZoom) {
                return;
            }

            const zoomScale = oldZoom / newZoom;
            const centerAdjust = viewPos.subtract(oldCenter);
            const offset = viewPos.subtract(centerAdjust.multiply(zoomScale))
                .subtract(oldCenter);

            view.center = view.center.add(offset);

            this._viewChanged.notify(view.bounds);
        };

        /**
         * Set zoom level.
         * @returns zoom level that was set, or null if it was not changed
         */
        private setZoomConstrained(zoom: number): number {
            if (this._minZoom) {
                zoom = Math.max(zoom, this._minZoom);
            }
            if (this._maxZoom) {
                zoom = Math.min(zoom, this._maxZoom);
            }
            const view = this.project.view;
            if (zoom != view.zoom) {
                view.zoom = zoom;
                return zoom;
            }
            return null;
        }
    }

}