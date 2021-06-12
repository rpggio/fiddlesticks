import { VNode } from 'snabbdom'

export abstract class Component<T> {
  abstract render(data: T): VNode
}