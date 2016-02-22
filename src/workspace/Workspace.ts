
class Workspace extends paper.Group {
    
    defaultBackgroundColor = '#fdfdfd';
    
    sheet: paper.Shape;
    
    get backgroundColor(): string {
        return this.sheet.fillColor.toString();
    }
    
    set backgroundColor(value: string) {
        this.sheet.fillColor = value || this.defaultBackgroundColor;
    }
    
    constructor(size: paper.Size){
        super();
        
        let sheet = paper.Shape.Rectangle(
            new paper.Point(0,0), size);
        sheet.style.shadowColor = 'gray'; 
        sheet.style.shadowBlur = 6;
        sheet.style.shadowOffset = new paper.Point(5, 5)
        this.sheet = sheet;
        this.addChild(sheet);

        this.backgroundColor = this.defaultBackgroundColor;
        
        this.mouseBehavior = <MouseBehavior> {
            onClick: e => {
                paper.project.deselectAll();
            },
            onDragMove: e => this.position = this.position.add(e.delta)
        }
    }
}