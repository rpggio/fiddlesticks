
class Actions extends TypedChannel.Channel<void> {
    
    sketch = {
        create: this.topic<any>("sketch.create"),
        attrupdate: this.topic<SketchAttr>("sketch.attrupdate"),
    }
    
    textBlock = {
        add: this.topic<TextBlock>("textblock.add"),
        update: this.topic<TextBlock>("textblock.update"),
    }
    
}

class Events extends TypedChannel.Channel<AppState> {
    
    sketch = {
        loaded: this.topic<Sketch>("sketch.loaded"),
        attrchanged: this.topic<SketchAttr>("sketch.attrchanged"),
    }
    
    textblock = {
        added: this.topic<TextBlock>("textblock.added"),
        changed: this.topic<TextBlock>("textblock.changed"),
    }
    
}

class Channels {
    actions: Actions = new Actions();
    events: Events = new Events();
}
