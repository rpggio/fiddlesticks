

function bootstrap() {
    
    const store = new Store();
    
    const sketchEditor = new SketchEditor(document.getElementById('designer'), store);
    const selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), store);
    
    return new AppController(store, sketchEditor, selectedItemEditor);

}

const app = bootstrap();
