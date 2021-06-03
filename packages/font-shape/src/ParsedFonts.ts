export type ParsedFont = {
  url: string,
  font: opentypejs.Font
}

export class ParsedFonts {

  fonts: { [url: string]: opentypejs.Font; } = {}

  _fontLoaded: (parsed: ParsedFont) => void

  constructor(fontLoaded?: (parsed: ParsedFont) => void) {
    this._fontLoaded = fontLoaded || (() => {
    })
  }

  get(url: string) {
    return new Promise<ParsedFont>((resolve, reject) => {
      if (!url) {
        return
      }

      let font = this.fonts[url]

      if (font) {
        resolve({url, font})
        return
      }

      opentype.load(url, (err, font) => {
        if (err) {
          console.error(err, {url})
          reject(err)
        } else {
          this.fonts[url] = font
          resolve({url, font})
          this._fontLoaded({url, font})
        }
      })

    })
  }
}
