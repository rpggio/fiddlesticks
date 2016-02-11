

let TextBlockEdit = function({DOM, props$}) : 
    { DOM: Rx.Observable<any>, text$: Rx.Observable<string> } 
{

    let newValue$ = DOM.select('.text-block-edit')
        .events('input')
        .map(ev => ev.target.value);

    let vtree$ = Rx.Observable.combineLatest(props$, (props: any, value) =>
        CycleDOM.div('.text-block-edit', [
            CycleDOM.textarea('.text', ['foo'])
        ])
    );

    return {
        DOM: vtree$,
        text$: newValue$
    };
}