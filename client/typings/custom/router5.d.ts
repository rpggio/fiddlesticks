
declare interface RouteNode {
}

declare var RouteNode: {
    new (name?: string, path?: string): RouteNode;
}

declare interface RouteNavigateOptions {
    replace?: boolean;
    reload?: boolean;
}

declare interface RouterOptions {
    useHash?: boolean,
    hashPrefix?: string,
    defaultRoute?: string,
    defaultParams?: Object,
    base?: string,
    trailingSlash?: boolean,
    autoCleanUp?: boolean,
    strictQueryParams?: boolean
}

declare interface Router {
    start(callback?: (err: any, state: any) => void): Router;
    usePlugin(plugin: any): Router;
    navigate(routeName: string, 
        routeParams?: Object, 
        options?: RouteNavigateOptions,
        callback?: (err: any, state: any) => void);
        
    setOption(opt: string, val: any): Router;
    setAdditionalArgs(args: string[]);
    getAdditionalArgs(): string[];
    add(routes: RouteNode[]|Object[]|RouteNode|Object);
    addNode(name:string ,path: string, canActivate?: boolean);
    useMiddleware(fn);
    start(startPathOrState?:string|Object, done?:()=>void): Router;
    stop(): void;
    getState(): RouteState;
    isActive(name: string, params?: Object, strictEquality?: boolean, ignoreQueryParams?: boolean): boolean;
    areStatesDescendants(parentState, childState):boolean;
    canDeactivate(name, canDeactivate):void;
    canActivate(name, canActivate):void;
    buildUrl(route, params):string;
    buildPath(route, params):string;
    buildState(route, params):string;
    matchPath(path):Object;
    urlToPath(url):string;
    matchUrl(url): Object;
    navigate(name: string, params: Object, opts: Object, done: () => void): () => {};
}

interface RouteState {
    name: string;
    params: any;
    path: string;
}

declare type RouterCallback = (toState: RouteState, fromState: RouteState) => void; 

// router5-listeners
declare interface Router{
    addListener(fn: RouterCallback);
    addNodeListener(name: string, RouterCallback);
    addRouteListener(name: string, RouterCallback);
}

declare const Router5: {
    new (
        nodes?: RouteNode[],
        options?: RouterOptions
    ): Router;
}

declare var loggerPlugin: any;

declare var listenersPlugin: any;

declare var historyPlugin: any;
