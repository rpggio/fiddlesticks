namespace SketchBuilder {

    export class Store {

        private initialized: boolean;
        private _template$ = new Rx.Subject<Template>();
        private _templateState$ = new Rx.Subject<TemplateState>();
        private _render$ = new Rx.Subject<RenderRequest>();
        private _state: {
            template?: Template;
            templateState: TemplateState;
        }

        private _parsedFonts: FontShape.ParsedFonts;
        private _fontCatalog: FontShape.FontCatalog;

        constructor() {
            this._state = {
                templateState: {
                    design: {}
                }
            };

            this._parsedFonts = new FontShape.ParsedFonts(() => { });
        }

        get state() {
            return this._state;
        }

        get parsedFonts() {
            return this._parsedFonts;
        }

        get fontCatalog() {
            return this._fontCatalog;
        }

        get templateState$(): Rx.Observable<TemplateState> {
            return this._templateState$;
        }

        get template$(): Rx.Observable<Template> {
            return this._template$;
        }

        get render$() {
            return this._render$;//.observeOn(Rx.Scheduler.default);
        }

        get template() {
            return this.state.template;
        }

        get design() {
            return this.state.templateState && this.state.templateState.design;
        }

        init(): Promise<Store> {
            if(this.initialized){
                throw new Error("Store is already initalized");
            }
            return new Promise<Store>(callback => {
                FontShape.FontCatalog.fromLocal("fonts/google-fonts.json")
                    .then(c => {
                        this._fontCatalog = c;
                        this.initialized = true;
                        callback(this);
                    });
            })
        }

        setTemplate(name: string) {
            let template;
            if (/Dickens/i.test(name)) {
                template = new SketchBuilder.Templates.Dickens();
            }
            if (!template) {
                throw new Error(`Invalid template ${name}`);
            }
            this.state.template = template;
            this._template$.onNext(template);
        }

        setDesign(value: Design) {
            this.state.templateState = { design: value };
            this._templateState$.onNext(this.state.templateState);
        }

        updateTemplateState(change: TemplateStateChange) {
            const merged = _.merge(this.state.templateState, change);
            this._templateState$.onNext(this.state.templateState);
        }

        render(request: RenderRequest) {
            this._render$.onNext(request);
        }

    }

}