
class Actions extends TypedChannel.Channel {
    
    app = {       
        /**
         * Instructs Store to load retained state from local storage, if it exists.
         */
        loadRetainedState: this.topic<void>("app.loadRetainedState"),
        
        /**
         * Instructs Store to save retained state to local storage.
         */
        saveRetainedState: this.topic<void>("app.saveRetainedState"),
        
        loadFont: this.topic<string>("app.loadFont")
    };
    
    designer = {
        zoomToFit: this.topic<ItemSelection>("designer.zoomToFit")
    }
    
    sketch = {
        create: this.topic<Sketch>("sketch.create"),
        attrUpdate: this.topic<Sketch>("sketch.attrupdate"),
        setEditingItem: this.topic<PositionedItem>("sketch.setEditingItem"),
        setSelection: this.topic<ItemSelection>("sketch.setselection"),
    };
    
    textBlock = {
        add: this.topic<TextBlock>("textblock.add"),
        updateAttr: this.topic<TextBlock>("textblock.updateAttr"),
        updateArrange: this.topic<TextBlock>("textblock.updateArrange"),
        remove: this.topic<TextBlock>("textblock.remove")
    };
    
}

class Events extends TypedChannel.Channel {
    
    app = {
        resourcesReady: this.topic<boolean>("app.resourcesReady"),
        retainedStateLoadAttemptComplete: this.topic<boolean>("app.retainedStateLoadAttemptComplete"),
        retainedStateChanged: this.topic<RetainedState>("app.retainedStateChanged"),
        fontLoaded: this.topic<opentype.Font>("app.fontLoaded")
    }
    
    designer = {
        zoomToFitRequested: this.topic<void>("designer.zoomToFitRequested")
    };
    
    sketch = {
        loaded: this.topic<Sketch>("sketch.loaded"),
        attrChanged: this.topic<Sketch>("sketch.attrChanged"),
        editingItemChanged: this.topic<PositionedItem>("sketch.editingItemChanged"),
        selectionChanged: this.topic<ItemSelection>("sketch.selectionChanged"),
        saveLocalRequested: this.topic<ItemSelection>("sketch.savelocal.saveLocalRequested")
    };
    
    textblock = {
        added: this.topic<TextBlock>("textblock.added"),
        attrChanged: this.topic<TextBlock>("textblock.attrchanged"),
        arrangeChanged: this.topic<TextBlock>("textblock.arrangechanged"),
        removed: this.topic<TextBlock>("textblock.removed"),
        loaded: this.topic<TextBlock>("textblock.loaded"),
        editorClosed: this.topic<TextBlock>("textblock.editorClosed"),
    };
    
}

class Channels {
    actions: Actions = new Actions();
    events: Events = new Events();
}
