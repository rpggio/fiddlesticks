namespace SketchBuilder {
    
    export interface Template {
        name: string;
        description: string;
        image: string;
        createControls(design: Design, context: TemplateContext): VControl[];
        build(design: Design): paper.Item;
    }

    export interface TemplateContext {
        renderDesign(design: Design, callback: (imageDataUrl: string) => void);
    }
    
    export interface Design {
        
    }
    
    export interface RenderRequest {
        designOptions?: Design,
        area?: number,
        callback: (imageDataUrl: string) => void
    }
    
    export type VControl = VNode;
    
}