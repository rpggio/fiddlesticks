import {Observable, Subject} from 'rxjs'
import {classModule, eventListenersModule, init, propsModule, styleModule, VNode} from 'snabbdom'

interface ReactiveDomComponent {
    dom$: Observable<VNode>;
}

const patch = init([
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
])

export function renderAsChild(container: HTMLElement, vnode: VNode) {
    const child = document.createElement('div')
    const patched = patch(child, vnode)
    container.appendChild(patched.elm)
}

export class ReactiveDom {

    /**
     * Render a reactive component within container.
     */
    static renderStream(
        dom$: Observable<VNode>,
        container: HTMLElement,
    ): Observable<VNode> {
        const id = container.id
        let current: HTMLElement | VNode = container
        const sink = new Subject<VNode>()
        dom$.subscribe(dom => {
            if (!dom) return

            this.removeEmptyNodes(dom)
            let patched: VNode
            try {
                patched = patch(current, dom)
            } catch (err) {
                console.error('error patching dom', {
                    current,
                    dom,
                    err,
                })
                return
            }
            const patchedElement = patched.elm as Element
            if (id && !patchedElement.id) {
                // retain ID
                patchedElement.id = id
            }

            current = patched
            sink.next(<VNode>current)
        })
        return sink
    }

    /**
     * Recursively remove empty children from tree.
     */
    static removeEmptyNodes(node: VNode) {
        if (!node.children || !node.children.length) {
            return
        }
        const notEmpty = node.children.filter(c => !!c)
        if (node.children.length != notEmpty.length) {
            console.warn('removed empty children from', node.children)
            node.children = notEmpty
        }
        for (const child of node.children) {
            if (typeof (child) !== 'string') {
                this.removeEmptyNodes(child)
            }
        }
    }

    /**
     * Render a reactive component within container.
     */
    static renderComponent(
        component: ReactiveDomComponent,
        container: HTMLElement | VNode,
    ): Observable<VNode> {
        let current = container
        let sink = new Subject<VNode>()
        component.dom$.subscribe(dom => {
            if (!dom) return
            current = patch(current, dom)
            sink.next(current)
        })
        return sink
    }

    /**
     * Render within container whenever source changes.
     */
    static liveRender<T>(
        container: HTMLElement | VNode,
        source: Observable<T>,
        render: (next: T) => VNode,
    ): Observable<VNode> {
        let current = container
        let sink = new Subject<VNode>()
        source.subscribe(data => {
            let node = render(data)
            if (!node) return
            current = patch(current, node)
            sink.next(current)
        })
        return sink
    }

}