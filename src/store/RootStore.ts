
class RootStore {

    state: Sketch;
    action$: TRux.IActionSubject<ActionTypes>;
    event$: TRux.IEventSubject<EventTypes>;

    constructor(
        action$: TRux.IActionSubject<ActionTypes>,
        event$: TRux.IEventSubject<EventTypes>) {

        this.action$ = action$;
        this.event$ = event$;

        action$.ofType("sketch.create")
            .subscribe(() => {
                this.state = new Sketch();
                this.sendEvent("sketch.loaded", this.state);
            });

        action$.ofType("sketch.update")
            .subscribe(ev => {
                _.assign(this.state, ev.payload);
                this.sendEvent("sketch.changed", this.state);
            });

        action$.ofType("textblock.add")
            .subscribe(ev => {
                let patch = ev.payload as TextBlock;
                let block = { _id: newid() } as TextBlock;
                _.assign(block, patch);
                this.state.textBlocks.push(block);
                this.sendEvent("textblock.added", block);
            });

        action$.ofType("textblock.update")
            .subscribe(ev => {
                let patch = ev.payload as TextBlock;
                let block = _.find(this.state.textBlocks, tb => tb._id === patch._id);
                if(block){
                    _.assign(block, patch);
                }
                this.sendEvent("textblock.changed", block);
            });

    }

    sendEvent(type: EventTypes, eventData: any) {
        this.event$.onNext({
            type: type,
            eventData: eventData,
            rootData: this.state
        })
    }

}