
class Actions extends TypedChannel.Channel<void> {
    
    sketch = {
        create: this.topic<SketchAttr>("sketch.create"),
        attrUpdate: this.topic<SketchAttr>("sketch.attrupdate"),
        setEditingItem: this.topic<PositionedItem>("sketch.seteditingitem")
    }
    
    textBlock = {
        add: this.topic<TextBlock>("textblock.add"),
        update: this.topic<TextBlock>("textblock.update"),
        remove: this.topic<TextBlock>("textblock.remove")
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
        removed: this.topic<TextBlock>("textblock.removed"),
    }
    
}

class Channels {
    actions: Actions = new Actions();
    events: Events = new Events();
}
