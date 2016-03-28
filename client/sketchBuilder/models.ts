namespace SketchBuilder {
    
    export interface Template {
        name: string;
        description: string;
        image: string;
        createUI(context: TemplateUIContext): DesignControl[];
        build(design: Design, context: TemplateBuildContext): Promise<paper.Item>;
    }

    export interface TemplateUIContext {
        renderDesign(design: Design, callback: (imageDataUrl: string) => void);
    }
    
    export interface TemplateBuildContext {
        getFont(desc: FontShape.FontSpecifier): Promise<opentype.Font>;
    }
    
    export interface Design {
        text?: string;
        shape?: string;
        font?: FontShape.FontSpecifier;
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