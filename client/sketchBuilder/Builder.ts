namespace SketchBuilder {
    
    export class Builder{
        
        constructor(container: HTMLElement, store: Store){
            
            const dom$ = store.renderable$.map(({template, design}) => {
                const controls = template.createControls(design);
                const vnode = h("div", {}, controls);
                return vnode;
            });
            
            ReactiveDom.renderStream(dom$, container);
            
//             .subscribe(({template, design}) => {
// console.warn("render", {template, design});
//                 const controls = template.createControls(design);
//                 const vnode = h("div", {}, controls);
//                 VDomHelpers.renderAsChild(container, vnode);
//             });

        }
        
        
    }
    
}