namespace SketchBuilder {
    
    export namespace ControlHelpers {
        
         export function chooser<T>(
             choices: Choice[])
             : VNode{
            return h("ul.chooser",
                {},
                choices.map(choice => {
                    return h("li.choice",
                        {
                            class: {
                                chosen: choice.chosen
                            },
                            on: {
                                click: ev => {
                                    choice.callback();
                                }
                            }
                        },
                        [choice.node])
                })
            ); 
        }
        
        export interface Choice {
             node: VNode, 
             chosen?: boolean, 
             callback?: () => void
        }
        
    }
    
}