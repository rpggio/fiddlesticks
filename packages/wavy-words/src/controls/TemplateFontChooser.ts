import {FontChooser, FontChooserState} from './FontChooser'
import {VNode} from 'snabbdom'
import {BuilderControl, TemplateState} from '../models'
import {Observable} from 'rxjs'
import {WavyStore} from '../WavyStore'
import {map} from 'rxjs/operators'

export class TemplateFontChooser implements BuilderControl {

    private _fontChooser: FontChooser

    constructor(store: WavyStore) {
        this._fontChooser = new FontChooser(store.fontCatalog)

        this._fontChooser.maxFamilies = 15
    }

    get value$(): Observable<TemplateState> {
        return this._fontChooser.value$.pipe(map(choice => <TemplateState>{
            fontCategory: choice.category,
            design: {
                font: {
                    family: choice.family,
                    variant: choice.variant,
                },
            },
        }))
    }

    createNode(value: TemplateState): VNode {
        const font = value.design && value.design.font
        return this._fontChooser.createNode(<FontChooserState>{
            category: value.fontCategory,
            family: font && font.family,
            variant: font && font.variant,
        })
    }

}
