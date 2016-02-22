
class Store {

    state = new AppState();
    actions: Actions;
    events: Events;

    constructor(
        actions: Actions,
        events: Events) {

        this.actions = actions;
        this.events = events;

        actions.sketch.create
            .subscribe(() => {
                this.state.sketch = new Sketch();
                this.events.sketch.loaded.dispatchContext(this.state, this.state.sketch);
            });

        actions.sketch.attrUpdate
            .subscribe(ev => {
                this.assign(this.state.sketch.attr, ev.data);
                this.events.sketch.attrchanged.dispatchContext(this.state, this.state.sketch.attr);
            });

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

        actions.sketch.setEditingItem.subscribe(m => {
            if(m.data.itemType !== "TextBlock"){
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
        })
    }

    assign<T>(dest: T, source: T) {
        _.assign(dest, source);
    }

}