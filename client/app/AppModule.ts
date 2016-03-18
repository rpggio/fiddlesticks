namespace App {

    export class AppModule {

        editorModule: SketchEditor.SketchEditorModule;

        constructor(){
            
            this.editorModule = new SketchEditor.SketchEditorModule();
             
        }
        
        start() {
            this.editorModule.start();
        }

    }

}