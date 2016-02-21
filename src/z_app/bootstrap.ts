

function bootstrap() {
    const actions = new Actions();
    const events = new Events();

actions.subscribe(x => console.log('action', x));
events.subscribe(x => console.log('event', x));

    const rootStore = new Store(actions, events);

    const sketchState$ = events.merge(
        events.sketch.loaded, events.sketch.attrchanged,
        events.textblock.added, events.textblock.changed);
    let component = new SketchEditor(actions); 
    const dom$ = sketchState$.map(m => component.render(m.rootData.sketch));

dom$.subscribe(a => console.log('dom', a));

    ReactiveDom.renderStream(dom$, document.getElementById('designer'));

    const designerController = new DesignerController(events, () => {
        actions.sketch.create.dispatch(null);
        actions.textBlock.add.dispatch({ text: "boogedy" });
    });
}

bootstrap();