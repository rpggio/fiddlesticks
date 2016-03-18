
interface Window {
    app: App.AppModule;
}

PaperHelpers.shouldLogInfo = false;       

const app = new App.AppModule();
window.app = app; 

app.start();
