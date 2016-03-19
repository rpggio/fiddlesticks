namespace SketchEditor {

    export class SketchEditorModule {

        appStore: App.Store;
        store: Store;
        workspaceController: WorkspaceController;

        constructor(appStore: App.Store) {
            this.appStore = appStore;

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

            this.store = new Store(appStore);

            const bar = new EditorBar(document.getElementById('designer'), this.store);
            const selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), this.store);
            const helpDialog = new HelpDialog(document.getElementById("help-dialog"), this.store);

            //this.sketchId$ = this.store.events.sketch.loaded.observeData().map(s => s._id); 

            // events.subscribe(m => console.log("event", m.type, m.data));
            // actions.subscribe(m => console.log("action", m.type, m.data));
        }

        start() {

            this.store.events.app.fontLoaded.observe().first().subscribe(m => {

                this.workspaceController = new WorkspaceController(this.store, m.data);

                this.store.events.app.workspaceInitialized.subscribe(m => {
                    const sketchId = this.appStore.state.route.params.sketchId;
                    if (!sketchId && this.store.state.sketch.textBlocks.length === 0) {
                        this.store.actions.textBlock.add.dispatch({ text: "SKETCH WITH WORDS" });
                    }
                });

                this.store.actions.editor.initWorkspace.dispatch();
            });

        }

        openSketch(id: string){
            this.store.actions.sketch.open.dispatch(id);
        }

    }

}
