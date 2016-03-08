// const AmaticUrl = 'http://fonts.gstatic.com/s/amaticsc/v8/IDnkRTPGcrSVo50UyYNK7y3USBnSvpkopQaUR-2r7iU.ttf';
// const Roboto100 = 'http://fonts.gstatic.com/s/roboto/v15/7MygqTe2zs9YkP0adA9QQQ.ttf';
// const Roboto500 = 'fonts/Roboto-500.ttf';
// const Roboto900 = "http://fonts.gstatic.com/s/roboto/v15/H1vB34nOKWXqzKotq25pcg.ttf";
// const OpenSansRegular = "fonts/OpenSans/OpenSans-Regular.ttf";
// const OpenSansExtraBold = "fonts/OpenSans/OpenSans-ExtraBold.ttf";
// const AquafinaScript = 'fonts/AguafinaScript-Regular/AguafinaScript-Regular.ttf'
// const Norican = "http://fonts.gstatic.com/s/norican/v4/SHnSqhYAWG5sZTWcPzEHig.ttf";

class AppController {

    constructor(
        store: Store,
        sketchEditor: SketchEditor,
        selectedItemEditor: SelectedItemEditor) {

        const actions = store.actions, events = store.events;

        actions.subscribe(x => console.log(x));
        events.subscribe(x => console.log(x));

        let workspaceController: WorkspaceController;
        events.app.fontLoaded.observe().first().subscribe(m => {
            
            workspaceController = new WorkspaceController(store, m.data);
            
            events.app.retainedStateLoadAttemptComplete.subscribe(m => {
                if (!m.data) {
                    // no autosave data loaded
                    actions.sketch.create.dispatch();
                    actions.textBlock.add.dispatch(
                        { text: "FIDDLESTICKS", textColor: "lightblue", fontSize: 128 });
                }
                    
                // Auto-save in one line: gotta love it.
                events.app.retainedStateChanged.observe().debounce(800).subscribe(state => {
                    actions.app.saveRetainedState.dispatch();
                });
            });

            actions.app.loadRetainedState.dispatch();
        });

        events.sketch.loaded.subscribe(ev =>
            $("#mainCanvas").css("background-color", ev.data.backgroundColor)
        );

        events.sketch.attrChanged.subscribe(ev =>
            $("#mainCanvas").css("background-color", ev.data.backgroundColor)
        );
    }

}