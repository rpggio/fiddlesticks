namespace SketchBuilder {

    export class Store {

        private _template$ = new Rx.Subject<Template>();
        private _design$ = new Rx.Subject<Design>();
        private _state: {
            template?: Template;
            design?: Design;
        }

        constructor() {
            this._state = {}
        }

        get state() {
            return this._state;
        }

        get design$(): Rx.Observable<Design> {
            return this._design$;
        }

        get template$() : Rx.Observable<Template> {
            return this._template$;
        }

        get renderable$() {
            return Rx.Observable.combineLatest(
                            this.template$,
                            this.design$,
                            (template, design) => {
                                return {template, design};
                            });
        }

        set template(name: string) {
            let template;
            if(/Dickens/i.test(name)){
                template = new SketchBuilder.Templates.Dickens();
            }
            if(!template){
                throw new Error(`Invalid template ${name}`);
            }
            this.state.template = template;
            this._template$.onNext(template); 
        }
        
        set design(value: Design){
            this.state.design = value;
            this._design$.onNext(value);
        }
    }

}