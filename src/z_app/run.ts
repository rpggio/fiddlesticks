
type IActionStream = TRux.IActionObservable<ActionTypes>;
type IEventStream = TRux.IEventObservable<EventTypes>;

const action$ = TRux.newActionSubject<ActionTypes>();
            action$.subscribe(a => console.log('action$', a));
const dispatch = action$.onNext;

const event$ = TRux.newEventSubject<EventTypes>();
            event$.subscribe(a => console.log('event$', a));

const rootStore = new RootStore(action$, event$);

const sketchState$ = event$.ofType("sketch.loaded", "sketch.changed", "textblock.added", "textblock.changed");
const dom$ = sketchState$.map(ev => RenderSketchEditor(ev.rootData as Sketch));
            dom$.subscribe(a => console.log('dom$', a));

ReactiveDom.renderStream(dom$, document.getElementById('designer'));
const designerController = new DesignerController(event$, () => {
    action$.onNext({
        type: "sketch.create"
    });

    action$.onNext({
        type: "textblock.add",
        payload: {
            text: "blaargh"
        }
    });
});



 
