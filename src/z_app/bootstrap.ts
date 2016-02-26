

function bootstrap() {
    const channels = new Channels();
    const actions = channels.actions, events = channels.events;

actions.subscribe(x => console.log(x));
events.subscribe(x => console.log(x));

    const rootStore = new Store(actions, events);

    const sketchEditor = new SketchEditor(actions); 
    const sketchDom$ = events.merge(
        events.sketch.loaded, events.sketch.attrChanged)
        .map(m => sketchEditor.render(m.rootData.sketch));
    ReactiveDom.renderStream(sketchDom$, document.getElementById('designer'));

    const selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), channels);

    const designerController = new DesignerController(channels, () => {
        actions.sketch.create.dispatch();
        actions.textBlock.add.dispatch({ text: "FIDDLESTICKS", textColor: "lightblue", fontSize: 128 });
    });
}

bootstrap();