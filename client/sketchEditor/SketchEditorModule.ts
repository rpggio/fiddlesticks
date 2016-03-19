namespace SketchEditor {

    export class SketchEditorModule {

        store: Store;
        workspaceController: WorkspaceController;
        sketchId$: Rx.Observable<string>;

        constructor() {

            DomHelpers.initErrorHandler(errorData => {
                const content = JSON.stringify(errorData);
                $.ajax({
                    url: "/api/client-errors",
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    data: content
                });
            })

            this.store = new Store();

            const bar = new EditorBar(document.getElementById('designer'), this.store);
            const selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), this.store);
            const helpDialog = new HelpDialog(document.getElementById("help-dialog"), this.store);

            this.sketchId$ = this.store.events.sketch.loaded.observeData().map(s => s._id); 

            // events.subscribe(m => console.log("event", m.type, m.data));
            // actions.subscribe(m => console.log("action", m.type, m.data));
        }

        start(sketchId?: string) {

            this.store.events.app.fontLoaded.observe().first().subscribe(m => {

                this.workspaceController = new WorkspaceController(this.store, m.data);

                this.store.events.app.workspaceInitialized.subscribe(m => {
                    if (!sketchId && this.store.state.sketch.textBlocks.length === 0) {
                        this.store.actions.textBlock.add.dispatch({ text: "SKETCH WITH WORDS" });
                    }
                });

                this.store.actions.app.initWorkspace.dispatch({sketchId});
            });

        }

        openSketch(id: string){
            this.store.actions.sketch.open.dispatch(id);
        }

    }

}
