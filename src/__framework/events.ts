
class ObservableEvent<T> {
    
    private _subscribers: ((eventArg: T) => void)[] = [];

    /**
     * Subscribe for notification. Returns unsubscribe function.
     */    
    subscribe(handler: (eventArg: T) => void): (() => void) {
        if(this._subscribers.indexOf(handler) < 0){
            this._subscribers.push(handler);
        }
        return () => this.unsubscribe(handler);
    }
    
    unsubscribe(callback: (eventArg: T) => void) {
        let index = this._subscribers.indexOf(callback, 0);
        if (index > -1) {
            this._subscribers.splice(index, 1);
        }        
    }
    
    observe(): Rx.Observable<T> {
        let unsub: any;
        return Rx.Observable.fromEventPattern<T>(
            (handlerToAdd) => this.subscribe(<(eventArg: T) => void>handlerToAdd),
            (handlerToRemove) => this.unsubscribe(<(eventArg: T) => void>handlerToRemove)
        );
    }
    
    /**
     * Subscribe for one notification.
     */
    subscribeOne(callback: (eventArg: T) => void){
        let unsub = this.subscribe(t => {
            unsub();
            callback(t);            
        });
    }
    
    notify(eventArg: T){
        for(let subscriber of this._subscribers){
            subscriber.call(this, eventArg);
        }
    }
    
    /**
     * Removes all subscribers.
     */
    clear() {
        this._subscribers.length = 0;
    }
}