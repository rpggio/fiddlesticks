
class AppController {

    constructor(
        channels: Channels,
        store: Store,
        sketchEditor: SketchEditor,
        selectedItemEditor: SelectedItemEditor,
        designerController: DesignerController) {

        const actions = channels.actions, events = channels.events;

        actions.subscribe(x => console.log(x));
        events.subscribe(x => console.log(x));

        events.app.fontsReadyChanged.subscribe(m => {
            if (m.data === true) {

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
            }
        });
        
        events.sketch.loaded.subscribe(ev =>
            $("#mainCanvas").css("background-color", ev.data.attr.backgroundColor)
        );
        
        events.sketch.attrChanged.subscribe(ev =>
            $("#mainCanvas").css("background-color", ev.data.backgroundColor)
        );

    }

}