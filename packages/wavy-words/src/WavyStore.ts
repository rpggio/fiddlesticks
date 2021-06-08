import {Observable, Subject} from 'rxjs'
import {Design, RenderRequest, Template, TemplateState, TemplateStateChange} from './models'
import {FontCatalog, ParsedFonts} from 'font-shape'
import {Channel} from 'fstx-common'
import {Dickens} from './templates'
import _ from 'lodash'

export class WavyStore {
  private _eventsChannel = new Channel()
  events = {
    downloadPNGRequested: this._eventsChannel.topic<number>('downloadPNGRequested'),
  }

  constructor(template: Template) {
    this._state = {
      template,
      templateState: {
        design: {},
      },
    }

    this._parsedFonts = new ParsedFonts(() => {
    })
  }

  private _template$ = new Subject<Template>()

  get template$(): Observable<Template> {
    return this._template$
  }

  private _templateState$ = new Subject<TemplateState>()

  get templateState$(): Observable<TemplateState> {
    return this._templateState$
  }

  private _render$ = new Subject<RenderRequest>()

  get render$() {
    return this._render$
  }

  private _state: {
    template?: Template
    templateState: TemplateState
  }

  get state() {
    return this._state
  }

  private _parsedFonts: ParsedFonts

  get parsedFonts() {
    return this._parsedFonts
  }

  private _fontCatalog = FontCatalog.fromLocal()

  get fontCatalog() {
    return this._fontCatalog
  }

  get template() {
    return this.state.template
  }

  get design() {
    return this.state.templateState && this.state.templateState.design
  }

  downloadPNG() {
    this.events.downloadPNGRequested.dispatch()
  }

  setTemplate(name: string) {
    let template: Template
    if (/Dickens/i.test(name)) {
      template = new Dickens()
    }
    if (!template) {
      throw new Error(`Invalid template ${name}`)
    }
    this.state.template = template
    this._template$.next(template)
  }

  setDesign(value: Design) {
    this.setTemplateState({design: value})
  }

  updateTemplateState(change: TemplateStateChange) {
    _.merge(this.state.templateState, change)

    const design = this.state.templateState.design
    if (design && design.font && design.font.family && !design.font.variant) {
      // set default variant
      design.font.variant = FontCatalog.defaultVariant(
        this._fontCatalog.getRecord(design.font.family))
    }

    this._templateState$.next(this.state.templateState)
  }

  setTemplateState(state: TemplateState) {
    this._state.templateState = state
    this._templateState$.next(state)
  }

  render(request: RenderRequest) {
    this._render$.next(request)
  }
}
