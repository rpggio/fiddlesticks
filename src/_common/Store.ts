
class Store {

    state = this.createAppState();
    actions: Actions;
    events: Events;

    constructor(
        actions: Actions,
        events: Events) {

        this.actions = actions;
        this.events = events;

        // ----- Designer -----

        actions.designer.saveLocal.subscribe(m => {
            const json = JSON.stringify(this.state);

            this.state = JSON.parse(json);
            
            this.events.sketch.loaded.dispatchContext(
                this.state, this.state.sketch);
            for(const tb of this.state.sketch.textBlocks){
                this.events.textblock.loaded.dispatchContext(
                this.state, tb);
            }
        });


        // ----- Sketch -----

        actions.sketch.create
            .subscribe((m) => {
                this.state.sketch = this.createSketch();
                const attr = m.data || {};
                attr.backgroundColor = attr.backgroundColor || '#f6f3eb';
                this.state.sketch.attr = attr;
                this.events.sketch.loaded.dispatchContext(this.state, this.state.sketch);
            });

        actions.sketch.attrUpdate
            .subscribe(ev => {
                this.assign(this.state.sketch.attr, ev.data);
                this.events.sketch.attrChanged.dispatchContext(this.state, this.state.sketch.attr);
            });

        actions.sketch.setEditingItem.subscribe(m => {
            if (m.data.itemType !== "TextBlock") {
                throw `Unhandled type ${m.type}`;
            }
            const item = this.getBlock(m.data.itemId);
            this.state.sketch.editingItem = {
                itemId: m.data.itemId,
                itemType: "TextBlock",
                item: item,
                clientX: m.data.clientX,
                clientY: m.data.clientY
            };
            events.sketch.editingItemChanged.dispatchContext(
                this.state, this.state.sketch.editingItem);
        });

        actions.sketch.setSelection.subscribe(m => {
            if (m.data.itemType && m.data.itemType !== "TextBlock") {
                throw `Unhandled type ${m.type}`;
            }
            
            if((m.data && m.data.itemId) 
                === (this.state.sketch.selection && this.state.sketch.selection.itemId)){
                // nothing to do
                return;
            }
            
            this.state.sketch.selection = <ItemSelection>{
                itemId: m.data.itemId,
                itemType: m.data.itemType,
                priorSelectionItemId: this.state.sketch.selection
                && this.state.sketch.selection.itemId
            };
            events.sketch.selectionChanged.dispatchContext(
                this.state, this.state.sketch.selection);
        });
        

        // ----- TextBlock -----

        actions.textBlock.add
            .subscribe(ev => {
                let patch = ev.data;
                if(!patch.text || !patch.text.length){
                    return;
                }
                let block = { _id: newid() } as TextBlock;
                this.assign(block, patch);
                if(!block.fontSize){
                    block.fontSize = 64;
                }
                if(!block.textColor){
                    block.textColor = "gray"
                }
                this.state.sketch.textBlocks.push(block);
                this.events.textblock.added.dispatchContext(this.state, block);
            });

        actions.textBlock.updateAttr
            .subscribe(ev => {
                let block = this.getBlock(ev.data._id);
                if (block) {
                    let patch = <TextBlock>{
                        text: ev.data.text,
                        backgroundColor: ev.data.backgroundColor,
                        textColor: ev.data.textColor,
                        font: ev.data.font,
                        fontSize: ev.data.fontSize    
                    };
                    this.assign(block, patch);
                    this.events.textblock.attrChanged.dispatchContext(this.state, block);
                }
            });

        actions.textBlock.remove
            .subscribe(ev => {
                let didDelete = false;
                _.remove(this.state.sketch.textBlocks, tb => {
                    if (tb._id === ev.data._id) {
                        didDelete = true;
                        return true;
                    }
                });
                if (didDelete) {
                    this.events.textblock.removed.dispatchContext(this.state, { _id: ev.data._id });
                    if (this.state.sketch.editingItem.itemId == ev.data._id) {
                        this.state.sketch.editingItem = {};
                        events.sketch.editingItemChanged.dispatch(this.state.sketch.editingItem);
                    }
                }
            });
            
        actions.textBlock.updateArrange
            .subscribe(ev => {
                let block = this.getBlock(ev.data._id);
                if (block) {
                    block.position = ev.data.position;
                    block.outline = ev.data.outline;
                    events.textblock.arrangeChanged.dispatchContext(this.state, block);
                }
            });
    }

    assign<T>(dest: T, source: T) {
        _.merge(dest, source);
    }

    createAppState() : AppState {
        return {
            sketch: this.createSketch()
        }
    }

    createSketch() : Sketch {
        return {
            attr: {}, 
            textBlocks: <TextBlock[]>[] 
        };
    }
    
    private getBlock(id: string){
        return _.find(this.state.sketch.textBlocks, tb => tb._id === id);
    }
}