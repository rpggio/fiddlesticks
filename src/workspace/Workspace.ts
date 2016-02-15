
class Workspace extends paper.Group {
    
    sheet: paper.Shape;
    
    constructor(size: paper.Size){
        super();
        
        let sheet = paper.Shape.Rectangle(
            new paper.Point(0,0), size);
        sheet.fillColor = '#F2F1E1';
        sheet.style.shadowColor = 'gray'; 
        sheet.style.shadowBlur = 6;
        sheet.style.shadowOffset = new paper.Point(5, 5)
        this.sheet = sheet;
        this.addChild(sheet);
        
        this.mouseBehavior = <MouseBehavior> {
            onClick: e => {
                paper.project.deselectAll();
            },
            onDragMove: e => this.position = this.position.add(e.delta)
        }
    }
}