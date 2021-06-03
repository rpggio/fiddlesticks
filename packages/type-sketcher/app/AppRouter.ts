import Router5, { RouteNode } from 'router5'

export class AppRouter extends Router5 {

    constructor() {
        super([
                new RouteNode('home', '/'),
                new RouteNode('sketch', '/sketch/:sketchId'), // <[a-fA-F0-9]{14}>
            ],
            {
                useHash: false,
                defaultRoute: 'home',
            })

        //this.usePlugin(loggerPlugin())
        this.usePlugin(listenersPlugin.default())
            .usePlugin(historyPlugin.default())
    }

    get state() {
        // could do route validation somewhere
        return <AppRouteState><any>this.getState()
    }

    toSketchEditor(sketchId: string) {
        this.navigate('sketch', {sketchId: sketchId})
    }
}

export interface AppRouteState {
    name: 'home' | 'sketch',
    params?: {
        sketchId?: string
    },
    path?: string
}
