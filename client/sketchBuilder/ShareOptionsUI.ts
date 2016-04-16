module SketchBuilder {
    
    export class ShareOptionsUI {
        
        private store: Store;
        
        constructor(container: HTMLElement, store: Store){
            this.store = store;
            
            const state = Rx.Observable.just(null);
            ReactiveDom.renderStream(state.map(() => this.createDom()), container);
        }
        
        createDom(): VNode {
            return h("div.controls", [ 
                h("button.btn.btn-primary", {
                    attrs: {
                        type: "button"
                    },
                    on: {
                        click: () => this.store.downloadPNG(100 * 1000)
                    }
                },
                ["Download small"]),
                
                h("button.btn.btn-primary", {
                    attrs: {
                        type: "button"
                    },
                    on: {
                        click: () => this.store.downloadPNG(500 * 1000)
                    }
                },
                ["Download medium"]),
            ]);
        }
        
    }
    
}