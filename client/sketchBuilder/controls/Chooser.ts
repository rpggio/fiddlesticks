namespace SketchBuilder {

    export class Chooser<T> implements OptionChooser<T> {
        private factory: (value: T) => VNode;
        private _value$ = new Rx.Subject<T>();
        
        constructor(factory: (value: T) => VNode) {
            this.factory = factory;
        }

        get value$() {
            return this._value$;
        }        

        createNode(choices: T[], value?: T): VNode{
            return h("ul.chooser",
                {},
                choices.map(choice => {
                    const choiceNode = this.factory(choice);
                    return h("li.choice",
                        {
                            class: {
                                chosen: _.isEqual(value, choice)
                            },
                            on: {
                                click: ev => {
                                    this._value$.onNext(choice);
                                }
                            }
                        },
                        [choiceNode])
                })
            ); 
        }
    }
    
}
