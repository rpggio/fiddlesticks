namespace SketchBuilder {

    export class TextInput implements ValueControl<string> {

        private _value$ = new Rx.Subject<string>();

        createNode(value?: string, placeholder?: string, textarea?: boolean) {
            return h("textarea" ? "textarea" : "input",
                {
                    attrs: {
                        type: textarea ? undefined : "text",
                        placeholder: placeholder
                    },
                    props: {
                        value: value
                    },
                    on: {
                        keypress: (ev: KeyboardEvent) => {
                            if ((ev.which || ev.keyCode) === DomHelpers.KeyCodes.Enter) {
                                ev.preventDefault();
                                const input = <HTMLInputElement>ev.target;
                                input.blur();
                            }
                        },
                        change: (ev) => {
                            this._value$.onNext(ev.target.value);
                        }
                    }
                },
                []
            );
        }

        get value$() {
            return this._value$;
        }
    }

}