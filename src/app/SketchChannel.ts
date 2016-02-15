
class SketchChannel {

    private _channel: IChannelDefinition<Object>;

    attr: Topic<SketchAttr>;
    textblock: TextBlockTopic;

    constructor() {
        this._channel = postal.channel('sketch');
        this.attr = new Topic<SketchAttr>(this._channel, 'attr');
        this.textblock = new TextBlockTopic(this._channel, "textblock");
    }
}

class TextBlockTopic extends Topic<TextBlock> {

    add: Topic<TextBlock>;
    update: Topic<TextBlock>;
    remove: Topic<TextBlock>;
    select: Topic<TextBlock>;

    constructor(channel: IChannelDefinition<Object>, topic: string) {
        super(channel, topic);
        
        this.add = this.subtopic("add");
        this.update = this.subtopic("update");
        this.remove = this.subtopic("remove");
        this.select = this.subtopic("select");
    }
}
