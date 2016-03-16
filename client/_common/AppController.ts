
class AppController {

    store: Store;
    router: AppRouter;
    workspaceController: WorkspaceController;

    constructor(
        store: Store,
        router: AppRouter,
        sketchEditor: SketchEditor,
        selectedItemEditor: SelectedItemEditor) {

        this.store = store;
        this.router = router;

        const actions = store.actions, events = store.events;

        // events.subscribe(m => console.log("event", m.type, m.data));
        // actions.subscribe(m => console.log("action", m.type, m.data));

        events.app.fontLoaded.observe().first().subscribe(m => {
            
            this.workspaceController = new WorkspaceController(store, m.data);
            
            events.app.workspaceInitialized.subscribe(m => {
                if (store.state.sketch.textBlocks.length == 0) {
                    actions.textBlock.add.dispatch({ text: "PLAY WITH TYPE" });
                }
            });

            actions.app.initWorkspace.dispatch();
        });

        events.sketch.loaded.subscribe(ev =>
            $("#mainCanvas").css("background-color", ev.data.backgroundColor)
        );

        events.sketch.attrChanged.subscribe(ev =>
            $("#mainCanvas").css("background-color", ev.data.backgroundColor)
        );
    }

}