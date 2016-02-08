
class AppController {

    designerController: DesignerController;

    constructor(){
        
        this.designerController = new DesignerController(this);
        
    }
}
