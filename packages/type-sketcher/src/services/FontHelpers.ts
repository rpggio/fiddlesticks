import {FamilyRecord} from 'font-shape'
import {FontDescription} from '../models'

export function getFontDescription(family: FamilyRecord, variant?: string)
  : FontDescription {
  let url: string
  url = family.files[variant || 'regular']
  if (!url) {
    url = family.files[0]
  }
  return {
    family: family.family,
    category: family.category,
    variant: variant,
    url,
  }
}
