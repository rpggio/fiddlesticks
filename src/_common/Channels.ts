
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
        zoomToFit: this.topic<void>("designer.zoomToFit"),
        exportingImage: this.topic<void>("designer.exportImage"),
        exportPNG: this.topic<void>("designer.exportPNG"),
        exportSVG: this.topic<void>("designer.exportSVG"),
        viewChanged: this.topic<paper.Rectangle>("designer.viewChanged")
    }
    
    sketch = {
        create: this.topic<Sketch>("sketch.create"),
        attrUpdate: this.topic<Sketch>("sketch.attrUpdate"),
        setEditingItem: this.topic<PositionedItem>("sketch.setEditingItem"),
        setSelection: this.topic<ItemSelection>("sketch.setSelection"),
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
        zoomToFitRequested: this.topic<void>("designer.zoomToFitRequested"),
        exportPNGRequested: this.topic<void>("designer.exportPNGRequested"),
        exportSVGRequested: this.topic<void>("designer.exportSVGRequested"),
        viewChanged: this.topic<paper.Rectangle>("designer.viewChanged")
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
        attrChanged: this.topic<TextBlock>("textblock.attrChanged"),
        arrangeChanged: this.topic<TextBlock>("textblock.arrangeChanged"),
        removed: this.topic<TextBlock>("textblock.removed"),
        loaded: this.topic<TextBlock>("textblock.loaded"),
        editorClosed: this.topic<TextBlock>("textblock.editorClosed"),
    };
    
}

class Channels {
    actions: Actions = new Actions();
    events: Events = new Events();
}
