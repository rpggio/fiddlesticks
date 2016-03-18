namespace SketchEditor {

    export class SketchEditorModule {

        store: Store;
        router: AppRouter;
        workspaceController: WorkspaceController;

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

            this.router = new AppRouter();
            this.store = new Store(this.router);

            const bar = new EditorBar(document.getElementById('designer'), this.store);
            const selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), this.store);
            const helpDialog = new HelpDialog(document.getElementById("help-dialog"), this.store);

            // events.subscribe(m => console.log("event", m.type, m.data));
            // actions.subscribe(m => console.log("action", m.type, m.data));
        }

        start() {

            this.store.events.app.fontLoaded.observe().first().subscribe(m => {

                this.workspaceController = new WorkspaceController(this.store, m.data);

                this.store.events.app.workspaceInitialized.subscribe(m => {
                    if (this.store.state.sketch.textBlocks.length == 0) {
                        this.store.actions.textBlock.add.dispatch({ text: "SKETCH WITH WORDS" });
                    }
                });

                this.store.actions.app.initWorkspace.dispatch();
            });

        }

    }

}
