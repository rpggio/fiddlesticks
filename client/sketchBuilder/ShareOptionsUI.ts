module SketchBuilder {
    
    export class ShareOptionsUI {
        
        private store: Store;
        
        constructor(container: HTMLElement, store: Store){
            this.store = store;
            
            const state = Rx.Observable.just(null);
            ReactiveDom.renderStream(state.map(() => this.createDom()), container);
        }
        
        createDom(): VNode {
            return h("button.btn.btn-primary", {
                attrs: {
                    type: "button"
                },
                on: {
                    click: () => this.store.downloadPNG()
                }
            },
            ["Download"]);
        }
        
    }
    
}