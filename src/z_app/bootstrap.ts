

function bootstrap() {
    const channels = new Channels();
    const actions = channels.actions, events = channels.events;

actions.subscribe(x => console.log('action', x));
events.subscribe(x => console.log('event', x));

    const rootStore = new Store(actions, events);

    const sketchEditor = new SketchEditor(actions); 
    const sketchDom$ = events.merge(
        events.sketch.loaded, events.sketch.attrchanged)
        .map(m => sketchEditor.render(m.rootData.sketch));
    ReactiveDom.renderStream(sketchDom$, document.getElementById('designer'));

    // const blockEditor = new TextBlockEditor(actions);
    // const blockEditorDom$ = events.sketch.editingItemChanged
    //     .observe().map(tb => blockEditor.render(tb));
    // ReactiveDom.renderStream(blockEditorDom$, document.getElementById('textBlockEditor'));

    const selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), channels);

    const designerController = new DesignerController(channels, () => {
        actions.sketch.create.dispatch(null);
        actions.textBlock.add.dispatch({ text: "boogedy" });
    });
}

bootstrap();