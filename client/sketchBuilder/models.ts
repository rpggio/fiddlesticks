namespace SketchBuilder {
    
    export interface Template {
        name: string;
        description: string;
        image: string;
        createControls(context: TemplateContext): DesignControl[];
        build(design: Design): paper.Item;
    }

    export interface TemplateContext {
        renderDesign(design: Design, callback: (imageDataUrl: string) => void);
    }
    
    export interface Design {
        text?: string;
        shape?: string;
        font?: [string, string];
        palette?: Object;
        seed?: number;
    }
    
    export interface RenderRequest {
        design: Design;
        area?: number;
        callback: (imageDataUrl: string) => void;
    }
    
    export interface DesignControl {
        output$: Rx.Observable<Design>;
        createNode(design: Design): VNode; 
    }
}