

function bootstrap() {
    
    const store = new Store();
    
    const sketchEditor = new SketchEditor(document.getElementById('designer'), store);
    const selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), store);
    
    const appController = new AppController(store, sketchEditor, selectedItemEditor);

}

bootstrap();
