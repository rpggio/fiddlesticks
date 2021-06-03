export class Watermark {

    private _project: paper.Project
    private _mark: paper.CompoundPath
    private _scaleFactor: number

    get item() {
        return this._mark
    }

    constructor(project: paper.Project, path: string, scaleFactor = 0.1) {

        this._project = project
        this._project.importSVG(path, (imported: paper.Item) => {
            this._mark = <paper.CompoundPath>imported.getItem({class: paper.CompoundPath})
            if (!this._mark) {
                throw new Error(`Could not load CompoundPath from ${path}`)
            }
            this._mark.remove()
        })
        this._scaleFactor = scaleFactor
    }

    placeInto(container: paper.Item, backgroundColor: paper.Color) {
        const watermarkDim = Math.sqrt(container.bounds.size.width * container.bounds.size.height) * this._scaleFactor
        this._mark.bounds.size = new paper.Size(watermarkDim, watermarkDim)
        // just inside lower right
        this._mark.position = container.bounds.bottomRight.subtract(watermarkDim / 2 + 1)

        if (backgroundColor.lightness > 0.4) {
            this._mark.fillColor = new paper.Color('black')
            this._mark.opacity = 0.05
        } else {
            this._mark.fillColor = new paper.Color('white')
            this._mark.opacity = 0.2
        }
        container.addChild(this._mark)
    }

    remove() {
        this._mark.remove()
    }
}
