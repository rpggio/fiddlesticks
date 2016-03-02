
interface Window {
    paper: paper.PaperScope;
    DOMParser: any;
    monitor: any;
}

declare var snabbdom: any;
declare var patch: (container: HTMLElement | VNode, dom: VNode) => VNode;
declare var h: any;

//declare var hh: HyperScriptHelpers; 
