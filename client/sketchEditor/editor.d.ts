
interface Window {
    paper: paper.PaperScope;
    DOMParser: any;
    monitor: any;
}

declare var snabbdom: any;
declare var patch: (container: HTMLElement | VNode, dom: VNode) => VNode;
declare function h(...args): VNode;

//declare var hh: HyperScriptHelpers; 
