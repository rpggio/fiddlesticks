// const AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
// const Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
// const Roboto500 = 'fonts/Roboto-500.ttf';
// const Roboto900 = "http://fonts.gstatic.com/s/roboto/v15/H1vB34nOKWXqzKotq25pcg.ttf";
// const OpenSansRegular = "fonts/OpenSans/OpenSans-Regular.ttf";
// const OpenSansExtraBold = "fonts/OpenSans/OpenSans-ExtraBold.ttf";
// const AquafinaScript = 'fonts/AguafinaScript-Regular/AguafinaScript-Regular.ttf'
// const Norican = "http://fonts.gstatic.com/s/norican/v4/SHnSqhYAWG5sZTWcPzEHig.ttf";

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

        events.subscribe(m => console.log("event", m.type, m.data));
        actions.subscribe(m => console.log("action", m.type, m.data));

        events.app.fontLoaded.observe().first().subscribe(m => {
            
            this.workspaceController = new WorkspaceController(store, m.data);
            
            events.app.workspaceInitialized.subscribe(m => {
                if (store.state.sketch.textBlocks.length == 0) {
                    actions.textBlock.add.dispatch(
                        { text: "FIDDLESTICKS", textColor: "#ae5a41", fontSize: 128 });
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