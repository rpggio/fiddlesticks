
interface ReactiveDomComponent {
    dom$: Rx.Observable<VNode>;
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
            if(!dom) return;
console.log('rendering dom', dom); /////////////////////
            
            // retain ID
            const patched = patch(current, dom);
            if(id && !patched.elm.id){
                patched.elm.id = id;
            }
            
            current = patched;
            sink.onNext(<VNode>current);
        });
        return sink;
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
            if(!dom) return;
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
            if(!node) return;
            current = patch(current, node);
            sink.onNext(<VNode>current);
        });
        return sink;
    }

}