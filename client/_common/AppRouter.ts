
class AppRouter extends Router5 {

    constructor() {
        super([
            new RouteNode("home", "/"),
            new RouteNode("sketch", "/sketch/:sketchId"), // <[a-fA-F0-9]{14}>
        ],
            {
                useHash: false
            });

        //this.usePlugin(loggerPlugin())
        this.usePlugin(listenersPlugin.default())
            .usePlugin(historyPlugin.default());

        this.start((err, state) => {
            if (err) {
                console.warn("router error", err);
                this.navigate("home");
            }
            if (state) {
                console.log("router state", state);
            }
        });
    }

}

interface SketchRouteState {
    sketchId?: string;
}