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
            const operationPanel = new OperationPanel(document.getElementById("operationPanel"), this.store); 

            // this.store.events.subscribe(m => console.log("event", m.type, m.data));
            // this.store.actions.subscribe(m => console.log("action", m.type, m.data));
        }

        start() {

            this.store.events.editor.fontLoaded.observe().first().subscribe(m => {

                this.workspaceController = new WorkspaceController(this.store, m.data);

                this.store.actions.editor.initWorkspace.dispatch();

                this.store.events.editor.workspaceInitialized.sub(() => {

                    $(window).on("beforeunload", () => {
                        if (this.store.state.sketchIsDirty) {
                            return "Your latest changes are not saved yet.";
                        }
                    });
                    
                });
            });

        }

        openSketch(id: string) {
            this.store.actions.sketch.open.dispatch(id);
        }

    }

}
