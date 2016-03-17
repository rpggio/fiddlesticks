

function bootstrap() {

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

    const router = new AppRouter();
    const store = new Store(router);
    const sketchEditor = new SketchEditor(document.getElementById('designer'), store);
    const selectedItemEditor = new SelectedItemEditor(document.getElementById("editorOverlay"), store);
    const helpDialog = new HelpDialog(document.getElementById("help-dialog"), store);

    return new AppController(store, router, sketchEditor, selectedItemEditor);
}

PaperHelpers.shouldLogInfo = false;

const app = bootstrap();
