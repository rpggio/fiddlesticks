
class SketchEditor implements ReactiveDomComponent {

    dom$: Rx.Observable<VNode>;   

    constructor(channel: SketchChannel) {
            
        let blockEditorContainer = h['div'];
        let blockEditor = new TextBlockEditor(channel);
        
        let defaultAttr = {
                    backgroundColor: '#F2F1E1'
                };
        let attr$ = channel.attr.observe()
            .merge(Rx.Observable.just(defaultAttr));

        this.dom$ = Rx.Observable.combineLatest(attr$, blockEditor.dom$,
            (attr, dom) =>
                h('div', [
                h('input.background-color',
                    {
                        type: 'text',
                        hook: {
                            insert: (vnode) =>
                                ColorPicker.setup(
                                    vnode.elm,
                                    color => {
                                        let newAttr = _.clone(attr);
                                        newAttr.backgroundColor = color && color.toHexString();
                                        channel.attr.publish(newAttr);
                                    }
                                )
                        }
                    }),
                    dom
                ])
        );
    }

}