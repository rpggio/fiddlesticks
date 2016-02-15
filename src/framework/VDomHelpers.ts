
class VDomHelpers {

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
            current = patch(current, node);
            sink.onNext(<VNode>current);
        });
        return sink;
    }

}