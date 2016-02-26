
class ObservableEvent<T> {
    
    private _subscribers: ((eventArg: T) => void)[] = [];

    /**
     * Subscribe for notification. Returns unsubscribe function.
     */    
    subscribe(callback: (eventArg: T) => void): (() => void) {
        if(this._subscribers.indexOf(callback) < 0){
            this._subscribers.push(callback);
        }
        return () => {
            let index = this._subscribers.indexOf(callback, 0);
            if (index > -1) {
                this._subscribers.splice(index, 1);
            }
        }
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