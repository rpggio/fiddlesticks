
interface Window {
    paper: paper.PaperScope;
    DOMParser: any;
    monitor: any;
}

declare const snabbdom: any;
declare const patch: (container: HTMLElement | VNode, dom: VNode) => VNode;
declare function h(...args): VNode;
