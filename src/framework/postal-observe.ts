
interface IPostal {
    observe: (options: PostalObserveOptions) => Rx.Observable<any>;
}

interface PostalObserveOptions {
    channel: string;
    topic: string;
}

interface IChannelDefinition<T> {
    observe(topic: string): Rx.Observable<T>;
}

postal.observe = function(options: PostalObserveOptions) {
    var self = this;
    var channel = options.channel;
    var topic = options.topic;

    return Rx.Observable.fromEventPattern(
        function addHandler(h) {
            return self.subscribe({
                channel: channel,
                topic: topic,
                callback: h,
            });
        },
        function delHandler(_, sub) {
            sub.unsubscribe();
        }
    );
};

// add observe to ChannelDefinition
(<any>postal).ChannelDefinition.prototype.observe = function(topic: string) {
    var self = this;

    return Rx.Observable.fromEventPattern(
        function addHandler(h) {
            return self.bus.subscribe({
                channel: self.channel,
                topic: topic,
                callback: h,
            });
        },
        function delHandler(_, sub) {
            sub.unsubscribe();
        }
    );
};
