
let DesignerHtmlApp = function({DOM}) {

    let editProps$ = Rx.Observable.just({
        text: 'WHIFFLES'
    });

    let blockEdit = TextBlockEdit({ DOM, props$: editProps$ });

    blockEdit.text$.subscribe(t => console.log(t));

    return {
        DOM: blockEdit.DOM
    }
}

Cycle.run(DesignerHtmlApp, {
    DOM: CycleDOM.makeDOMDriver('#cycle-app'),
    props$: () => Rx.Observable.from([{}])
});

    
    