import { FamilyRecord } from './models'
import _ from 'lodash'
import WebFont from 'webfontloader'
import fontList from '../static/google-fonts.json'

interface WebFontList {
  kind: string
  items: FamilyRecord[]
}

export class FontCatalog {

  // Encountered issues with these families
  excludeFamilies = ['Anton', 'Arimo', 'Slabo 27px']
  private records: FamilyRecord[]

  constructor(records: FamilyRecord[]) {

    records = records.filter(r => this.excludeFamilies.indexOf(r.family) < 0)

    // make files https
    for (const record of records) {
      _.forOwn(record.files, (val: string, key: string) => {
        if (_.startsWith(val, 'http:')) {
          record.files[key] = val.replace('http:', 'https:')
        }
      })
    }

    this.records = records
  }

  static fromLocal() {
    return new FontCatalog((fontList as WebFontList).items)
  }

  static async fromRemote() {
    const url = 'https://www.googleapis.com/webfonts/v1/webfonts?'
    const key = 'key=GOOGLE-API-KEY'
    const sort = 'popularity'
    const opt = 'sort=' + sort + '&'
    const req = url + opt + key

    const response = await fetch(req)
    const list = await response.json() as WebFontList
    return new FontCatalog(list.items)
  }

  static defaultVariant(record: FamilyRecord): string {
    if (!record) return null
    if (record.variants.indexOf('regular') >= 0) {
      return 'regular'
    }
    return record.variants[0]
  }

  /**
   * For a list of families, load alphanumeric chars into browser
   *   to support previewing.
   */
  static loadPreviewSubsets(families: string[]) {
    for (const chunk of _.chunk(families.filter(f => !!f), 10)) {
      try {
        WebFont.load({
          classes: false,
          google: {
            families: <string[]>chunk,
            text: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
          },
        })
      } catch (err) {
        console.error('error loading font subsets', err, chunk)
      }
    }
  }

  getList(limit?: number) {
    return !!limit
      ? this.records.slice(0, limit)
      : this.records
  }

  getCategories(): string[] {
    return _.uniq(this.records.map(f => f.category))
  }

  getFamilies(category?: string): string[] {
    if (!category) {
      return this.records.map(f => f.family)
    }
    return this.records
      .filter(f => f.category === category)
      .map(f => f.family)
  }

  getVariants(family: string): string[] {
    const fam = this.getRecord(family)
    return fam && fam.variants || []
  }

  getRecord(family: string): FamilyRecord {
    return _.find(this.records, ff => ff.family === family)
  }

  getUrl(family: string, variant?: string): string {
    const record = this.getRecord(family)
    if (!record) {
      console.warn('no definition available for family', family)
      return null
    }
    if (!variant) {
      variant = FontCatalog.defaultVariant(record)
    }
    let file = record.files[variant]
    if (!file) {
      console.warn('no font file available for variant', family, variant)
      file = record.files[0]
    }
    return file
  }
}
