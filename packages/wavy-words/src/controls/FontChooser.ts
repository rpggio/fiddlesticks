import { FontCatalog } from 'font-shape'
import { Observable, Subject } from 'rxjs'
import { ValueControl } from '../models'
import { getCssStyle } from 'fstx-common'
import { h, VNode } from 'snabbdom'
import { Choice, chooser } from './ControlHelpers'

export class FontChooser implements ValueControl<FontChooserState> {

  maxFamilies = Number.MAX_VALUE
  private fontCatalog: FontCatalog

  constructor(fontCatalog: FontCatalog) {
    this.fontCatalog = fontCatalog

    const preloadFamilies = this.fontCatalog.getCategories()
      .map(c => fontCatalog.getFamilies(c)[0])
    FontCatalog.loadPreviewSubsets(preloadFamilies)
  }

  private _value$ = new Subject<FontChooserState>()

  get value$(): Observable<FontChooserState> {
    return this._value$
  }

  createNode(value?: FontChooserState): VNode {
    const children: VNode[] = []

    children.push(h('h3', ['Font Categories']))
    const categories = this.fontCatalog.getCategories()
    const categoryChoices = categories.map(category => {
      let categoryFamilies = this.fontCatalog.getFamilies(category)
      if (this.maxFamilies) {
        categoryFamilies = categoryFamilies.slice(0, this.maxFamilies)
      }
      const firstFamily = categoryFamilies[0]
      return <Choice>{
        node: h('span',
          {
            style: getCssStyle(firstFamily),
          },
          [category]),
        chosen: value.category === category,
        callback: () => {
          FontCatalog.loadPreviewSubsets(categoryFamilies)
          this._value$.next({ category, family: firstFamily })
        },
      }
    })
    children.push(chooser(categoryChoices))

    if (value.category) {
      children.push(h('h3', {}, ['Fonts']))
      let families = this.fontCatalog.getFamilies(value.category)
      if (this.maxFamilies) {
        families = families.slice(0, this.maxFamilies)
      }
      const familyOptions = families.map(family => {
        return <Choice>{
          node: h('span',
            {
              style: getCssStyle(family),
            },
            [family]),
          chosen: value.family === family,
          callback: () => this._value$.next({ family, variant: '' }),
        }
      })
      children.push(chooser(familyOptions))
    }

    if (value.family) {
      const variants = this.fontCatalog.getVariants(value.family)
      if (variants.length > 1) {
        children.push(h('h3', {}, ['Font Styles']))

        const variantOptions = variants.map(variant => {
          return <Choice>{
            node: h('span',
              {
                style: getCssStyle(value.family, variant),
              },
              [variant]),
            chosen: value.variant === variant,
            callback: () => this._value$.next({ variant }),
          }
        })
        children.push(chooser(variantOptions))
      }
    }

    return h('div.fontChooser', {}, children)
  }
}

export interface FontChooserState {
  category?: string;
  family?: string;
  variant?: string;
}
