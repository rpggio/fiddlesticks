import {FontCatalog, FontSpecifier} from 'font-shape'
import {Observable} from 'rxjs'
import {VNode} from 'snabbdom'

export interface Template {
    name: string
    description: string
    image: string

    createNew(context: TemplateUIContext): TemplateState

    createUI(context: TemplateUIContext): BuilderControl[]

    build(design: Design, context: TemplateBuildContext): Promise<paper.Item>
}

export interface TemplateUIContext {
    fontCatalog: FontCatalog

    renderDesign(design: Design, callback: (imageDataUrl: string) => void)

    createFontChooser(): BuilderControl
}

export interface TemplateBuildContext {
    getFont(desc: FontSpecifier): Promise<opentypejs.Font>
}

export interface TemplateState {
    design: Design
    fontCategory?: string
}

export interface TemplateStateChange {
    design?: Design
    fontCategory?: string
}

export interface Design {
    content?: any
    shape?: string
    font?: FontSpecifier
    palette?: DesignPalette
    seed?: number
}

export interface DesignPalette {
    color?: string
    invert?: boolean
}

export interface DesignChange extends Design {
}

export interface RenderRequest {
    design: Design
    area?: number
    callback: (imageDataUrl: string) => void
}

export interface BuilderControl {
    value$: Observable<TemplateStateChange>

    createNode(value: TemplateState): VNode
}

export interface ValueControl<T> {
    value$: Observable<T>

    createNode(value?: T): VNode
}

export interface OptionChooser<T> {
    value$: Observable<T>

    createNode(choices: T[], value?: T): VNode
}
