

function bootstrap() {
    
    const router = new AppRouter();
    const store = new Store(router);
    const sketchEditor = new SketchEditor(document.getElementById('designer'), store);
    const selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), store);
    
    return new AppController(store, router, sketchEditor, selectedItemEditor);
}

const app = bootstrap();
