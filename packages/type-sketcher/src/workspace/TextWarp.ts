import {DualBoundsPathWarp} from './DualBoundsPathWarp'
import {SketchItemStyle} from './interfaces'

export class TextWarp extends DualBoundsPathWarp {

  static DEFAULT_FONT_SIZE = 128

  constructor(
    font: opentypejs.Font,
    text: string,
    bounds?: { upper: paper.Segment[], lower: paper.Segment[] },
    fontSize?: number,
    style?: SketchItemStyle) {

    if (!fontSize) {
      fontSize = TextWarp.DEFAULT_FONT_SIZE
    }

    const pathData = TextWarp.getPathData(font, text, fontSize)
    const path = new paper.CompoundPath(pathData)

    super(path, bounds, style)

    this._font = font
    this._text = text
  }

  private _font: opentypejs.Font

  set font(value: opentypejs.Font) {
    if (value !== this._font) {
      this._font = value
      this.updateTextPath()
    }
  }

  private _text: string

  get text(): string {
    return this._text
  }

  set text(value: string) {
    this._text = value
    this.updateTextPath()
  }

  private _fontSize: number

  get fontSize(): number {
    return this._fontSize
  }

  set fontSize(value: number) {
    if (!value) {
      return
    }
    this._fontSize = value
    this.updateTextPath()
  }

  private static getPathData(font: opentypejs.Font,
                             text: string, fontSize?: string | number): string {
    let openTypePath = font.getPath(text, 0, 0,
      Number(fontSize) || TextWarp.DEFAULT_FONT_SIZE)
    return openTypePath.toPathData(5)
  }

  updateTextPath() {
    const pathData = TextWarp.getPathData(
      this._font, this._text, this._fontSize)
    this.source = new paper.CompoundPath(pathData)
  }
}
