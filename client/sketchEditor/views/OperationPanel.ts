namespace SketchEditor {
    
    export class OperationPanel {
        
        private store: Store;
        
        constructor(container: HTMLElement, store: Store){
 
            const dom$ = store.operation$.map(op => {
                if(!op){
                    return h("div.hidden");
                }
                return h("div.operation", [op.render()]);
            })           
            ReactiveDom.renderStream(dom$, container);

        }
        
    }
    
}