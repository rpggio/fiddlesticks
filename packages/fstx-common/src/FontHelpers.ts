export interface ElementFontStyle {
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  fontSize?: string;
}

export function getCssStyle(family: string, variant?: string, size?: string) {
  let style = { fontFamily: family } as ElementFontStyle
  if (variant && variant.indexOf('italic') >= 0) {
    style.fontStyle = 'italic'
  }
  let numeric = variant && variant.replace(/[^\d]/g, '')
  if (numeric && numeric.length) {
    style.fontWeight = numeric.toString()
  }
  if (size) {
    style.fontSize = size
  }
  return style as Record<string, string>
}

export function getStyleString(family: string, variant: string, size?: string) {
  let styleObj = getCssStyle(family, variant, size)
  let parts = []
  if (styleObj.fontFamily) {
    parts.push(`font-family:'${styleObj.fontFamily}'`)
  }
  if (styleObj.fontWeight) {
    parts.push(`font-weight:${styleObj.fontWeight}`)
  }
  if (styleObj.fontStyle) {
    parts.push(`font-style:${styleObj.fontStyle}`)
  }
  if (styleObj.fontSize) {
    parts.push(`font-size:${styleObj.fontSize}`)
  }
  return parts.join('; ')
}
