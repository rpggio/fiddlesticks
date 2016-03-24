namespace App {

    export class AppModule {

        store: Store;
        editorModule: SketchEditor.SketchEditorModule;
        
        constructor(){
            PaperHelpers.shouldLogInfo = false;       

            this.store = new Store();
            this.editorModule = new SketchEditor.SketchEditorModule(this.store);
        }
        
        start() {        
            this.editorModule.start();
        }

    }

}

interface Window {
    app: App.AppModule;
}