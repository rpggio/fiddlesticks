
namespace App {

    export class AppRouter extends Router5 {

        constructor() {
            super([
                new RouteNode("home", "/"),
                new RouteNode("sketch", "/sketch/:sketchId"), // <[a-fA-F0-9]{14}>
            ],
                {
                    useHash: false,
                    defaultRoute: "home"
                });

            //this.usePlugin(loggerPlugin())
            this.usePlugin(listenersPlugin.default())
                .usePlugin(historyPlugin.default());
        }

        toSketchEditor(sketchId: string) {
            this.navigate("sketch", { sketchId: sketchId });
        }

        get state() {
            // could do route validation somewhere
            return <AppRouteState><any>this.getState();
        }
    }

    export interface AppRouteState {
        name: "home"|"sketch",
        params?: {
            sketchId?: string
        },
        path?: string
    }

}