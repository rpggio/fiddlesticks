
namespace TypedChannel {

    // --- Core types ---

    type Serializable = Object | Array<any> | number | string | boolean | Date | void;

    type Value = number | string | boolean | Date;

    export interface Message<TData extends Serializable, TContextData extends Serializable> {
        type: string;
        data?: TData;
        rootData?: TContextData;
        meta?: Object;
    }

    type ISubject<T> = Rx.Observer<T> & Rx.Observable<T>;

    export class ChannelTopic<TData extends Serializable, TContextData extends Serializable> {
        type: string;
        channel: ISubject<Message<TData, TContextData>>;

        constructor(channel: ISubject<Message<TData, TContextData>>, type: string) {
            this.channel = channel;
            this.type = type;
        }

        subscribe(observer: (message: Message<TData, TContextData>) => void) {
            this.observe().subscribe(observer);
        }

        dispatch(data?: TData) {
            this.channel.onNext({
                type: this.type,
                data: _.clone(data)
            });
        }

        dispatchContext(context: TContextData, data: TData) {
            this.channel.onNext({
                type: this.type,
                rootData: context,
                data: _.clone(data)
            });
        }

        observe(): Rx.Observable<Message<TData, TContextData>> {
            return this.channel.filter(m => m.type === this.type);
        }
    }

    export class Channel<TContextData extends Serializable> {
        type: string;
        private subject: ISubject<Message<Serializable, TContextData>>;

        constructor(subject?: ISubject<Message<Serializable, TContextData>>, type?: string) {
            this.subject = subject || new Rx.Subject<Message<Serializable, TContextData>>();
            this.type = type;
        }

        subscribe(onNext?: (value: Message<Serializable, TContextData>) => void): Rx.IDisposable {
            return this.subject.subscribe(onNext);
        }

        topic<TData extends Serializable>(type: string) : ChannelTopic<TData, TContextData> {
            return new ChannelTopic<TData, TContextData>(this.subject as ISubject<Message<TData, TContextData>>,
                this.type ? this.type + '.' + type : type);
        }
        
        mergeTyped<TData extends Serializable>(...topics: ChannelTopic<TData, TContextData>[]) 
            : Rx.Observable<Message<TData, TContextData>> {
            const types = topics.map(t => t.type);
            return this.subject.filter(m => types.indexOf(m.type) >= 0 ) as Rx.Observable<Message<TData, TContextData>>;
        }
        
        merge(...topics: ChannelTopic<Serializable, TContextData>[]) 
            : Rx.Observable<Message<Serializable, TContextData>> {
            const types = topics.map(t => t.type);
            return this.subject.filter(m => types.indexOf(m.type) >= 0 );
        }
    }

}
