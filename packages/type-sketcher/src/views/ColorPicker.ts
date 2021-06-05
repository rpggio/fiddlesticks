import _ from 'lodash'
import $ from 'jquery'
import paper from 'paper'
import 'spectrum-colorpicker'

export class ColorPicker {

  static DEFAULT_PALETTE_GROUPS = [
    [
      // http://www.color-hex.com/color-palette/807
      '#ee4035',
      '#f37736',
      '#fdf498',
      '#7bc043',
      '#0392cf',
    ],
    [
      // http://www.color-hex.com/color-palette/894
      '#edc951',
      '#eb6841',
      '#cc2a36',
      '#4f372d',
      '#00a0b0',
    ],
    [
      // http://www.color-hex.com/color-palette/164
      '#1b85b8',
      '#5a5255',
      '#559e83',
      '#ae5a41',
      '#c3cb71',
    ],
    [
      // http://www.color-hex.com/color-palette/389
      '#4b3832',
      '#854442',
      '#fff4e6',
      '#3c2f2f',
      '#be9b7b',
    ],
    [
      // http://www.color-hex.com/color-palette/455
      '#ff4e50',
      '#fc913a',
      '#f9d62e',
      '#eae374',
      '#e2f4c7',
    ],
    [
      // http://www.color-hex.com/color-palette/700
      '#d11141',
      '#00b159',
      '#00aedb',
      '#f37735',
      '#ffc425',
    ],
    [
      // http://www.color-hex.com/color-palette/826
      '#e8d174',
      '#e39e54',
      '#d64d4d',
      '#4d7358',
      '#9ed670',
    ],
  ]

  static MONO_PALETTE = ['#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff']

  static setup(elem, featuredColors: string[], onChange) {
    const featuredGroups = _.chunk(featuredColors, 5)

    // for each palette group
    const defaultPaletteGroups = ColorPicker.DEFAULT_PALETTE_GROUPS.map(group => {
      let parsedGroup = group.map(c => new paper.Color(<any>c))
      // create light variants of darkest three
      const addColors = _.sortBy(parsedGroup, c => c.lightness)
        .slice(0, 3)
        .map(c => {
          const c2 = c.clone()
          c2.lightness = 0.85
          return c2
        })
      parsedGroup = parsedGroup.concat(addColors)
      parsedGroup = _.sortBy(parsedGroup, c => c.lightness)
      return parsedGroup.map(c => c.toCSS(true))
    })

    const palette = featuredGroups.concat(defaultPaletteGroups)
    palette.push(ColorPicker.MONO_PALETTE)

    let sel = <any>$(elem);
    (<any>$(elem)).spectrum({
      showInput: true,
      allowEmpty: true,
      preferredFormat: 'hex',
      showButtons: false,
      showAlpha: true,
      showPalette: true,
      showSelectionPalette: false,
      palette: palette,
      localStorageKey: 'sketchtext',
      change: onChange,
    })
  };

  static set(elem: HTMLElement, value: string) {
    (<any>$(elem)).spectrum('set', value)
  }

  static destroy(elem) {
    (<any>$(elem)).spectrum('destroy')
  }
}
