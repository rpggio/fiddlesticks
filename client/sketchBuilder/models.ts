namespace SketchBuilder {
    
    export interface Template {
        name: string;
        description: string;
        image: string;
        createNew(context: TemplateUIContext): TemplateState;
        createUI(context: TemplateUIContext): BuilderControl[];
        build(design: Design, context: TemplateBuildContext): Promise<paper.Item>;
    }

    export interface TemplateUIContext {
        renderDesign(design: Design, callback: (imageDataUrl: string) => void);
        fontCatalog: FontShape.FontCatalog;
        createFontChooser(): BuilderControl;
    }
    
    export interface TemplateBuildContext {
        getFont(desc: FontShape.FontSpecifier): Promise<opentype.Font>;
    }
    
    export interface TemplateState {
        design: Design;
        fontCategory?: string;
    }

    export interface TemplateStateChange {
        design?: Design;
        fontCategory?: string;
    }
    
    export interface Design {
        text?: string;
        shape?: string;
        font?: FontShape.FontSpecifier;
        palette?: DesignPalette;
        seed?: number;
    }
    
    export interface DesignPalette {
        color?: string;
        invert?: boolean;
    }

    export interface DesignChange extends Design{
    }
    
    export interface RenderRequest {
        design: Design;
        area?: number;
        callback: (imageDataUrl: string) => void;
    }
    
    export interface BuilderControl {
        value$: Rx.Observable<TemplateStateChange>;
        createNode(value: TemplateState): VNode;
    }
    
    export interface ValueControl<T> {
        value$: Rx.Observable<T>;
        createNode(value?: T): VNode;
    }

    export interface OptionChooser<T> {
        value$: Rx.Observable<T>;
        createNode(choices: T[], value?: T): VNode;
    }
    
    // export interface VNodeChooser {
    //     createNode(choices: VNode[], chosenKey: string): VNode;
    //     chosen$: Rx.Observable<VNode>;
    // }
}