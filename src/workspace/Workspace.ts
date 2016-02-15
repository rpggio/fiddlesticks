
class Workspace extends paper.Group {
    
    sheet: paper.Shape;
    
    get backgroundColor(): string {
        return this.sheet.opacity == 0
            ? null
            : this.sheet.fillColor.toString();
    }
    
    set backgroundColor(value: string) {
        if(value){
            this.sheet.fillColor = value;
            this.sheet.opacity = 1;
        }
        else {
            // preserve hit testing
            this.sheet.fillColor = 'white';
            this.sheet.opacity = 0;
        }
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

        this.backgroundColor = null;
        
        this.mouseBehavior = <MouseBehavior> {
            onClick: e => {
                paper.project.deselectAll();
            },
            onDragMove: e => this.position = this.position.add(e.delta)
        }
    }
}