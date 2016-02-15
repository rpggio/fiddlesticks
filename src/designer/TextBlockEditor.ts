
class TextBlockEditor {

    dom$: Rx.Observable<VNode>;

    constructor(channel: SketchChannel) {
            
        let textBlock$ = Rx.Observable.merge( 
            channel.textblock.add.observe(),
            channel.textblock.select.observe()
        );
            
        this.dom$ = textBlock$.map(textBlock => {
            let current = textBlock;
            let tbChange = (alter: (tb: TextBlock) => void) => {
                let updated = _.clone(current);
                alter(updated);
                channel.textblock.update.publish(updated);
                current = updated;
            }
            return h('div', { style: { color: '#000' } }, [
                h('textarea',
                    {
                        text: textBlock.text,
                        on: {
                            keyup: e => tbChange(tb => tb.text = e.target.value),
                            change: e => tbChange(tb => tb.text = e.target.value)
                        }
                    }),
                h('input.text-color',
                    {
                        type: 'text',
                        hook: {
                            insert: (vnode) =>
                                ColorPicker.setup(
                                    vnode.elm,
                                    color => tbChange(tb => tb.textColor = color && color.toHexString())
                                )
                        }
                    }),
                h('input.background-color',
                    {
                        type: 'text',
                        hook: {
                            insert: (vnode) =>
                                ColorPicker.setup(
                                    vnode.elm,
                                    color => tbChange(tb => tb.backgroundColor = color && color.toHexString())
                                )
                        }
                    }),
                // h('button',
                //     {
                //         on: {
                //             click: e => tbChange(tb => { })
                //         }
                //     },
                //     'OK'
                // ),
            ]);
        });
    }
}