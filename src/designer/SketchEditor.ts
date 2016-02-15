
// interface SketchEditorControlOptions{
//     workspaceColor: string;
// }


interface SketchAttr {
    backgroundColor: string;
}

class SketchEditor {

    sketchAttr$: Rx.Observable<SketchAttr>;
    dom$: Rx.Observable<VNode>;   

    constructor(
        container: HTMLElement,
        options: {
            backgroundColor: string,
        }) {
            
        let attr$ = new Rx.Subject<SketchAttr>();
        this.sketchAttr$ = attr$;
        
        attr$.onNext({
            backgroundColor: options.backgroundColor || '#F2F1E1'
        })
        
        let blockEditorContainer = h['div'];
        let blockEditor = new TextBlockAttributeEditor(blockEditorContainer, null);
        
        let dom = h('div', [
            
        ]);
            
        // this.vdom$ = VDomHelpers.liveRender(container, source, textBlock => {
        //     let attr = <TextBlockAttr>{
        //         textBlockId: textBlock.textBlockId,
        //         text: textBlock.text,
        //         textColor: textBlock.textColor,
        //         backgroundColor: textBlock.backgroundColor,
        //     };
        //     let tbChange = (alter: (tb: TextBlockAttr) => void) => {
        //         alter(attr);
        //         sink.onNext(attr);
        //     }
        //     return h('div', { style: { color: '#000' } }, [
        //         h('textarea',
        //             {
        //                 text: textBlock.text,
        //                 on: {
        //                     keyup: e => tbChange(tb => tb.text = e.target.value),
        //                     change: e => tbChange(tb => tb.text = e.target.value)
        //                 }
        //             }),        
    }

}