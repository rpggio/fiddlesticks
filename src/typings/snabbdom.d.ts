declare type VNodeProps = {
  id?: String,
  className?: String,
}

declare type VNodeData = {
  props?: VNodeProps|any,
  attrs?: any,
  class?: any,
  style?: any,
  hero?: any,
  on?: any,
  fn?: Function,
  args?: Array<any>,
  // specific to this driver
  static?: VNode
}

declare interface VNode {
  sel: string;
  data: VNodeData;
  children: Array<VNode>;
  text: string;
  key: any;
  elm: Element;
}

declare interface SnabbdomModule {
  create: Function;
  update: Function;
}

declare type patchFn = (oldVNode: VNode|Element, VNode: VNode) => VNode

declare module 'snabbdom' {
  export function init(modules: Array<Object>): patchFn
}

declare module 'snabbdom/h' {
  export function h(selector: String, data?: Object|Array<VNode>|String, children?: Array<VNode>|String): VNode;
}

declare module 'snabbdom/thunk' {
  export function thunk(name: String, renderFn: Function, ...args: any[]): VNode;
}

declare module 'snabbdom/vnode' {
  export default function vnode(): VNode
}

declare module 'snabbdom/modules/attributes' {
  export default SnabbdomModule
}

declare module 'snabbdom/modules/class' {
  export default SnabbdomModule
}

declare module 'snabbdom/modules/eventlisteners' {
  export default SnabbdomModule
}

declare module 'snabbdom/modules/hero' {
  export default SnabbdomModule
}

declare module 'snabbdom/modules/props' {
  export default SnabbdomModule
}

declare module 'snabbdom/modules/style' {
  export default SnabbdomModule
}
