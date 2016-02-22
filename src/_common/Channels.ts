
class Actions extends TypedChannel.Channel<void> {
    
    sketch = {
        create: this.topic<any>("sketch.create"),
        attrUpdate: this.topic<SketchAttr>("sketch.attrupdate"),
        setEditingItem: this.topic<PositionedItem>("sketch.seteditingitem")
    }
    
    textBlock = {
        add: this.topic<TextBlock>("textblock.add"),
        update: this.topic<TextBlock>("textblock.update")
    }
    
}

class Events extends TypedChannel.Channel<AppState> {
    
    sketch = {
        loaded: this.topic<Sketch>("sketch.loaded"),
        attrchanged: this.topic<SketchAttr>("sketch.attrchanged"),
        editingItemChanged: this.topic<PositionedItem>("sketch.editingitemchanged")
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
