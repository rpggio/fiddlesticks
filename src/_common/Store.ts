
class Store {

    state = new AppState();
    actions: Actions;
    events: Events;

    constructor(
        actions: Actions,
        events: Events) {

        this.actions = actions;
        this.events = events;

        // ----- Sketch -----

        actions.sketch.create
            .subscribe((m) => {
                this.state.sketch = new Sketch();
                const attr = m.data || {};
                attr.backgroundColor = attr.backgroundColor || '#f6f3eb';
                this.state.sketch.attr = attr;
                this.events.sketch.loaded.dispatchContext(this.state, this.state.sketch);
            });

        actions.sketch.attrUpdate
            .subscribe(ev => {
                this.assign(this.state.sketch.attr, ev.data);
                this.events.sketch.attrchanged.dispatchContext(this.state, this.state.sketch.attr);
            });

        actions.sketch.setEditingItem.subscribe(m => {
            if (m.data.itemType !== "TextBlock") {
                throw `Unhandled type ${m.type}`;
            }
            const item = this.state.sketch.getBlock(m.data.itemId);
            this.state.sketch.editingItem = {
                itemId: m.data.itemId,
                itemType: "TextBlock",
                item: item,
                clientX: m.data.clientX,
                clientY: m.data.clientY
            };
            events.sketch.editingItemChanged.dispatch(this.state.sketch.editingItem);
        });

        actions.sketch.setSelection.subscribe(m => {
            if (m.data.itemType && m.data.itemType !== "TextBlock") {
                throw `Unhandled type ${m.type}`;
            }
            this.state.sketch.selection = <ItemSelection>{
                itemId: m.data.itemId,
                itemType: m.data.itemType,
                priorSelectionItemId: this.state.sketch.selection 
                    && this.state.sketch.selection.itemId
            };
            events.sketch.selectionChanged.dispatch(this.state.sketch.selection);
        });


        // ----- TextBlock -----

        actions.textBlock.add
            .subscribe(ev => {
                let patch = ev.data;
                let block = { _id: newid() } as TextBlock;
                this.assign(block, patch);
                this.state.sketch.textBlocks.push(block);
                this.events.textblock.added.dispatchContext(this.state, block);
            });

        actions.textBlock.update
            .subscribe(ev => {
                let patch = ev.data;
                let block = this.state.sketch.getBlock(ev.data._id);
                if (block) {
                    this.assign(block, patch);
                    this.events.textblock.changed.dispatchContext(this.state, block);
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
                    this.events.textblock.removed.dispatchContext(this.state, {_id: ev.data._id});
                    if(this.state.sketch.editingItem.itemId == ev.data._id){
                        this.state.sketch.editingItem = {};
                        events.sketch.editingItemChanged.dispatch(this.state.sketch.editingItem);
                    }
                }
            });

        // actions.textBlock.setSelected
        //     .subscribe(ev => {
        //         let block = this.state.sketch.getBlock(ev.data._id);
        //         if (block) {
        //             block.selected = ev.data.selected;
        //             this.events.textblock.selectedChanged.dispatchContext(this.state, block);
        //         }
        //     });

    }

    assign<T>(dest: T, source: T) {
        _.assign(dest, source);
    }

}