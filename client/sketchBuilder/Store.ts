namespace SketchBuilder {

    export class Store {

        private _template$ = new Rx.Subject<Template>();
        private _design$ = new Rx.Subject<Design>();
        private _render$ = new Rx.Subject<RenderRequest>();
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

        get render$(){
            return this._render$.observeOn(Rx.Scheduler.async);
        }

        get template() {
            return this.state.template;
        }

        setTemplate(name: string) {
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
        
        render(request: RenderRequest){
            this._render$.onNext(request);
        }
        
    }

}