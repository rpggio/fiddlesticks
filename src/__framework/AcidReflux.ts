
namespace AcidReflux {

    export type Render<TState, TActions> = (state: TState, actions: TActions) => VNode
    export type Action<TState> = (state: TState) => void;
    export type Dispatch<TState> = (action: Action<TState>) => void;

    export function run<TState>(
        container: HTMLElement | VNode,
        render: (state: TState, dispatch: Dispatch<TState>) => VNode,
        initialState: TState)
        : Rx.Observable<VNode> {

        let currentContainer: VNode;
        let state: TState;
        let dom: VNode;
        let output = new Rx.Subject<VNode>();

        let rendering: boolean;
        let dispatch = (action: Action<TState>) => {
            if(rendering){
                console.error('dispatch call is not allowed within render function');
                return;
            }
            state = _.clone(state);
            action(state);
            
            rendering = true;
            dom = render(state, dispatch);
            rendering = false;
            
            currentContainer = patch(currentContainer, dom);
            output.onNext(currentContainer);
        };

        state = _.clone(initialState);
        dom = render(state, dispatch);
        currentContainer = patch(container, dom);
        output.onNext(currentContainer);
        return output;
    }
    
}

