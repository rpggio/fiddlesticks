
interface ReactiveDomComponent {
    dom$: Rx.Observable<VNode>;
}

namespace VDomHelpers {
    export function renderAsChild(container: HTMLElement, vnode: VNode) {
        const child = document.createElement("div");
        const patched = patch(child, vnode);
        container.appendChild(patched.elm);
    }
}

class ReactiveDom {

    /**
     * Render a reactive component within container.
     */
    static renderStream(
        dom$: Rx.Observable<VNode>,
        container: HTMLElement
    ): Rx.Observable<VNode> {
        const id = container.id;
        let current: HTMLElement | VNode = container;
        const sink = new Rx.Subject<VNode>();
        dom$.subscribe(dom => {
            if (!dom) return;

            this.removeEmptyNodes(dom);
            let patched: VNode;
            try {
                patched = patch(current, dom);
            }
            catch (err) {
                console.error("error patching dom", {
                    current,
                    dom,
                    err
                });
                return;
            }
            if (id && !patched.elm.id) {
                // retain ID
                patched.elm.id = id;
            }

            current = patched;
            sink.onNext(<VNode>current);
        });
        return sink;
    }

    /**
     * Recursively remove empty children from tree.
     */
    static removeEmptyNodes(node: VNode) {
        if(!node.children || !node.children.length){
            return;
        }
        const notEmpty = node.children.filter(c => !!c);
        if (node.children.length != notEmpty.length) {
            console.warn("removed empty children from", node.children);
            node.children = notEmpty;
        }
        for (const child of node.children) {
            this.removeEmptyNodes(child);
        }
    }

    /**
     * Render a reactive component within container.
     */
    static renderComponent(
        component: ReactiveDomComponent,
        container: HTMLElement | VNode
    ): Rx.Observable<VNode> {
        let current = container;
        let sink = new Rx.Subject<VNode>();
        component.dom$.subscribe(dom => {
            if (!dom) return;
            current = patch(current, dom);
            sink.onNext(<VNode>current);
        });
        return sink;
    }

    /**
     * Render within container whenever source changes.
     */
    static liveRender<T>(
        container: HTMLElement | VNode,
        source: Rx.Observable<T>,
        render: (next: T) => VNode
    ): Rx.Observable<VNode> {
        let current = container;
        let sink = new Rx.Subject<VNode>();
        source.subscribe(data => {
            let node = render(data);
            if (!node) return;
            current = patch(current, node);
            sink.onNext(<VNode>current);
        });
        return sink;
    }

}