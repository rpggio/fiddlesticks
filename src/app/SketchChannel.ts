
class SketchChannel {
    
    private _channel: IChannelDefinition<Object>;
    
    constructor() {
        this._channel = postal.channel('sketch');
    }
    
    textBlockAdd(block: TextBlock) {
        this._channel.publish("textblock.add", block);
    }
    
    onTextBlockAdd() : Rx.Observable<TextBlock> {
        return <Rx.Observable<TextBlock>>this._channel.observe("textblock.add");
    }
}
