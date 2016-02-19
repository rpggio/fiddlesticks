interface Window {
    paper: paper.PaperScope;
    DOMParser: any;
}

declare var snabbdom: any;
declare var patch: any;
declare var h: any;

declare type LiveNode = VNode | Rx.Observable<VNode>;
