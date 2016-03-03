
/**
 * The singleton Store controls all application state.
 * No parts outside of the Store modify application state.
 * Communication with the Store is done through message Channels: 
 *   - Actions channel to send into the Store,
 *   - Events channel to receive notification from the Store.
 * Only the Store can receive action messages.
 * Only the Store can send event messages.
 * Messages are to be considered immutable.
 * All mentions of the Store can be assumed to mean, of course,
 *   "The Store and its sub-components."
 */
class Store {

    retainedState = this.createRetainedState();
    channels: Channels;

    constructor(
        channels: Channels) {

        this.channels = channels;
        const actions = channels.actions, events = channels.events;

        // ----- Designer -----

        actions.designer.saveLocal.subscribe(m => {
            const json = JSON.stringify(this.retainedState);

            this.retainedState = JSON.parse(json);
            
            events.sketch.loaded.dispatchContext(
                this.retainedState, this.retainedState.sketch);
            for(const tb of this.retainedState.sketch.textBlocks){
                events.textblock.loaded.dispatchContext(
                this.retainedState, tb);
            }
        });


        // ----- Sketch -----

        actions.sketch.create
            .subscribe((m) => {
                this.retainedState.sketch = this.createSketch();
                const attr = m.data || {};
                attr.backgroundColor = attr.backgroundColor || '#f6f3eb';
                this.retainedState.sketch.attr = attr;
                events.sketch.loaded.dispatchContext(this.retainedState, this.retainedState.sketch);
            });

        actions.sketch.attrUpdate
            .subscribe(ev => {
                this.assign(this.retainedState.sketch.attr, ev.data);
                events.sketch.attrChanged.dispatchContext(this.retainedState, this.retainedState.sketch.attr);
            });

        actions.sketch.setEditingItem.subscribe(m => {
            if (m.data.itemType !== "TextBlock") {
                throw `Unhandled type ${m.type}`;
            }
            const item = this.getBlock(m.data.itemId);
            this.retainedState.sketch.editingItem = {
                itemId: m.data.itemId,
                itemType: "TextBlock",
                item: item,
                clientX: m.data.clientX,
                clientY: m.data.clientY
            };
            events.sketch.editingItemChanged.dispatchContext(
                this.retainedState, this.retainedState.sketch.editingItem);
        });

        actions.sketch.setSelection.subscribe(m => {
            if (m.data.itemType && m.data.itemType !== "TextBlock") {
                throw `Unhandled type ${m.type}`;
            }
            
            if((m.data && m.data.itemId) 
                === (this.retainedState.sketch.selection && this.retainedState.sketch.selection.itemId)){
                // nothing to do
                return;
            }
            
            this.retainedState.sketch.selection = <ItemSelection>{
                itemId: m.data.itemId,
                itemType: m.data.itemType,
                priorSelectionItemId: this.retainedState.sketch.selection
                && this.retainedState.sketch.selection.itemId
            };
            events.sketch.selectionChanged.dispatchContext(
                this.retainedState, this.retainedState.sketch.selection);
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
                this.retainedState.sketch.textBlocks.push(block);
                events.textblock.added.dispatchContext(this.retainedState, block);
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
                    events.textblock.attrChanged.dispatchContext(this.retainedState, block);
                }
            });

        actions.textBlock.remove
            .subscribe(ev => {
                let didDelete = false;
                _.remove(this.retainedState.sketch.textBlocks, tb => {
                    if (tb._id === ev.data._id) {
                        didDelete = true;
                        return true;
                    }
                });
                if (didDelete) {
                    events.textblock.removed.dispatchContext(this.retainedState, { _id: ev.data._id });
                    if (this.retainedState.sketch.editingItem.itemId == ev.data._id) {
                        this.retainedState.sketch.editingItem = {};
                        events.sketch.editingItemChanged.dispatch(this.retainedState.sketch.editingItem);
                    }
                }
            });
            
        actions.textBlock.updateArrange
            .subscribe(ev => {
                let block = this.getBlock(ev.data._id);
                if (block) {
                    block.position = ev.data.position;
                    block.outline = ev.data.outline;
                    events.textblock.arrangeChanged.dispatchContext(this.retainedState, block);
                }
            });
    }

    assign<T>(dest: T, source: T) {
        _.merge(dest, source);
    }

    createRetainedState() : AppState {
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
        return _.find(this.retainedState.sketch.textBlocks, tb => tb._id === id);
    }
}