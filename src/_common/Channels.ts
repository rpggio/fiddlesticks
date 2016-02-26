
class Actions extends TypedChannel.Channel<void> {
    
    designer = {
        saveLocal: this.topic<void>("designer.savelocal"),
    };
    
    sketch = {
        create: this.topic<SketchAttr>("sketch.create"),
        attrUpdate: this.topic<SketchAttr>("sketch.attrupdate"),
        setEditingItem: this.topic<PositionedItem>("sketch.seteditingitem"),
        setSelection: this.topic<ItemSelection>("sketch.setselection"),
    };
    
    textBlock = {
        add: this.topic<TextBlock>("textblock.add"),
        updateAttr: this.topic<TextBlock>("textblock.updateattr"),
        updateArrange: this.topic<TextBlock>("textblock.updatearrange"),
        remove: this.topic<TextBlock>("textblock.remove")
    };
    
}

class Events extends TypedChannel.Channel<AppState> {
    
    designer = {
        saveLocalRequested: this.topic<void>("savelocalRequested"),
        backgroundActionCompleted: this.topic<BackgroundActionStatus>("backgroundActionCompleted"),
    };
    
    sketch = {
        loaded: this.topic<Sketch>("sketch.loaded"),
        attrChanged: this.topic<SketchAttr>("sketch.attrchanged"),
        editingItemChanged: this.topic<PositionedItem>("sketch.editingitemchanged"),
        selectionChanged: this.topic<ItemSelection>("sketch.selectionchanged"),
        saveLocalRequested: this.topic<ItemSelection>("sketch.savelocal.requested")
    };
    
    textblock = {
        added: this.topic<TextBlock>("textblock.added"),
        attrChanged: this.topic<TextBlock>("textblock.attrchanged"),
        arrangeChanged: this.topic<TextBlock>("textblock.arrangechanged"),
        removed: this.topic<TextBlock>("textblock.removed"),
        loaded: this.topic<TextBlock>("textblock.loaded"),
    };
    
}

class Channels {
    actions: Actions = new Actions();
    events: Events = new Events();
}
