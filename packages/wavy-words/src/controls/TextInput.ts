import {KeyCodes} from 'fstx-common'
import {ValueControl} from '../models'
import {Subject} from 'rxjs'
import {h} from 'snabbdom'

export class TextInput implements ValueControl<string> {

  private _value$ = new Subject<string>()

  get value$() {
    return this._value$
  }

  createNode(value?: string, placeholder?: string, textarea?: boolean) {
    return h('textarea' ? 'textarea' : 'input',
      {
        attrs: {
          type: textarea ? undefined : 'text',
          placeholder: placeholder,
        },
        props: {
          value: value,
        },
        on: {
          keypress: (ev: KeyboardEvent) => {
            if ((ev.which || ev.keyCode) === KeyCodes.Enter) {
              ev.preventDefault()
              const input = ev.target as HTMLInputElement
              input.blur()
            }
          },
          change: (ev) => {
            this._value$.next((ev.target as HTMLInputElement).value)
          },
        },
      },
      [],
    )
  }
}
