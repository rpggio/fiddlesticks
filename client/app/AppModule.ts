namespace App {

    export class AppModule {

        router: AppRouter;
        editorModule: SketchEditor.SketchEditorModule;
        
        constructor(){
            
            this.router = new AppRouter();
            
            this.editorModule = new SketchEditor.SketchEditorModule();
            this.editorModule.sketchId$.subscribe(id => this.router.toSketchEditor(id));
             
        }
        
        start() {        
            const routeState = this.router.getState();
            this.editorModule.start(<string>routeState.params.sketchId);
        }

    }

}