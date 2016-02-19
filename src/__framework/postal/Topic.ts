
class Topic<T> {

    private _channel: IChannelDefinition<Object>;
    private _name: string;

    constructor(channel: IChannelDefinition<Object>, topic: string) {
        this._channel = channel;
        this._name = topic;
    }

    observe(): Rx.Observable<T> {
        return <Rx.Observable<T>>this._channel.observe(this._name);
    }

    publish(data: T) {
        this._channel.publish(this._name, data);
    }

    subscribe(callback: ICallback<T>): ISubscriptionDefinition<T> {
        return this._channel.subscribe(this._name, callback);
    }

    protected subtopic(name): Topic<T> {
        return new Topic<T>(this._channel, this._name + '.' + name);
    }

    protected subtopicOf<U extends T>(name): Topic<U> {
        return new Topic<U>(this._channel, this._name + '.' + name);
    }
}
