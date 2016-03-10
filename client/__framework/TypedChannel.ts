
namespace TypedChannel {

    // --- Core types ---

    type Serializable = Object | Array<any> | number | string | boolean | Date | void;

    type Value = number | string | boolean | Date;

    export interface Message<TData extends Serializable> {
        type: string;
        data?: TData;
    }

    type ISubject<T> = Rx.Observer<T> & Rx.Observable<T>;

    export class ChannelTopic<TData extends Serializable> {
        type: string;
        channel: ISubject<Message<TData>>;

        constructor(channel: ISubject<Message<TData>>, type: string) {
            this.channel = channel;
            this.type = type;
        }

        subscribe(observer: (message: Message<TData>) => void) {
            this.observe().subscribe(observer);
        }

        dispatch(data?: TData) {
            this.channel.onNext({
                type: this.type,
                data: _.clone(data)
            });
        }

        observe(): Rx.Observable<Message<TData>> {
            return this.channel.filter(m => m.type === this.type);
        }
        
        forward(channel: ChannelTopic<TData>) {
            this.subscribe(m => channel.dispatch(m.data));
        }
    }

    export class Channel {
        type: string;
        private subject: ISubject<Message<Serializable>>;

        constructor(subject?: ISubject<Message<Serializable>>, type?: string) {
            this.subject = subject || new Rx.Subject<Message<Serializable>>();
            this.type = type;
        }

        subscribe(onNext?: (value: Message<Serializable>) => void): Rx.IDisposable {
            return this.subject.subscribe(onNext);
        }

        topic<TData extends Serializable>(type: string) : ChannelTopic<TData> {
            return new ChannelTopic<TData>(this.subject as ISubject<Message<TData>>,
                this.type ? this.type + '.' + type : type);
        }
        
        mergeTyped<TData extends Serializable>(...topics: ChannelTopic<TData>[]) 
            : Rx.Observable<Message<TData>> {
            const types = topics.map(t => t.type);
            return this.subject.filter(m => types.indexOf(m.type) >= 0 ) as Rx.Observable<Message<TData>>;
        }
        
        merge(...topics: ChannelTopic<Serializable>[]) 
            : Rx.Observable<Message<Serializable>> {
            const types = topics.map(t => t.type);
            return this.subject.filter(m => types.indexOf(m.type) >= 0 );
        }
    }

}
