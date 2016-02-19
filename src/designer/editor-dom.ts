
function RenderSketchEditor(sketch: Sketch): VNode {
    return  h('div', [
            h('input.background-color',
                {
                    type: 'text',
                    hook: {
                        insert: (vnode) =>
                            ColorPicker.setup(
                                vnode.elm,
                                color => {
                                    dispatch({
                                        type: "sketch.update", 
                                        payload: {backgroundColor: color && color.toHexString()}
                                    })
                                }
                            )
                    }
                }),
                sketch.textBlocks.map(tb => RenderTextBlockEditor(tb))
            ]);
};

function RenderTextBlockEditor(textBlock: TextBlock) : VNode {
    let tbUpdate = (partial: TextBlock) => {
        dispatch({
            type: "textblock.update",
            payload: partial
        });        
    }
    return h('div', { style: { color: '#000' } }, [
        h('textarea',
            {
                text: textBlock.text,
                on: {
                    keyup: e => tbUpdate(tb => tb.text = e.target.value),
                    change: e => tbUpdate(tb => tb.text = e.target.value)
                }
            }),
        h('input.text-color',
            {
                type: 'text',
                hook: {
                    insert: (vnode) =>
                        ColorPicker.setup(
                            vnode.elm,
                            color => tbUpdate({ textColor: color && color.toHexString()})
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
                            color => tbUpdate({ backgroundColor: color && color.toHexString()})
                        )
                }
            }),
    ]);
}
