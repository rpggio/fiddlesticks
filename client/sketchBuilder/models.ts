namespace SketchBuilder {
    
    export interface Template {
        name: string;
        description: string;
        image: string;
        createControls(design: Design): VControl[];
        build(design: Design): paper.Item;
    }
    
    export interface Design {
        
    }
    
    export type VControl = VNode;
    
}