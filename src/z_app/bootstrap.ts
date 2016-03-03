

function bootstrap() {
    
    const channels = new Channels();
    const actions = channels.actions, events = channels.events;
    const store = new Store(channels);
    
    const sketchEditor = new SketchEditor(document.getElementById('designer'), channels);
    const selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), channels);
    const designerController = new DesignerController(channels);
    
    const appController = new AppController(channels, store, 
        sketchEditor, selectedItemEditor, designerController);

}

bootstrap();
