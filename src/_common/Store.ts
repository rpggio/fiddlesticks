
/**
 * The singleton Store controls all application state.
 * No parts outside of the Store modify application state.
 * Communication with the Store is done through message Channels: 
 *   - Actions channel to send into the Store,
 *   - Events channel to receive notification from the Store.
 * Only the Store can receive action messages.
 * Only the Store can send event messages.
 * The Store cannot send actions or listen to events (to avoid loops).
 * Messages are to be treated as immutable.
 * All mentions of the Store can be assumed to mean, of course,
 *   "The Store and its sub-components."
 */
class Store {

    static ROBOTO_500_LOCAL = 'fonts/Roboto-500.ttf';
    static AUTOSAVE_KEY = "Fiddlesticks.retainedState";
    static DEFAULT_FONT_NAME = "Roboto";
    static FONT_LIST_LIMIT = 100;

    state = {
        retained: <RetainedState>{
            sketch: this.createSketch()
        },
        disposable: <DisposableState>{}
    }
    resources = {
        fontFamilies: <Dictionary<FontFamily>>{},
        parsedFonts: new ParsedFonts((url, font) =>
            this.events.app.fontLoaded.dispatch(font))
    }
    actions = new Actions();
    events = new Events();

    constructor() {
        this.setupSubscriptions();

        this.loadResources();
    }

    setupSubscriptions() {
        const actions = this.actions, events = this.events;

        // ----- App -----

        actions.app.loadRetainedState.observe()
            // Warning: subscribing to event within Store - crazy or not??
            // wait to load until resources are ready
            .pausableBuffered(events.app.resourcesReady.observe().map(m => m.data))
            .subscribe(m => {
                let success = false;

                if (!localStorage || !localStorage.getItem) {
                    // not supported
                    return;
                }

                const saved = localStorage.getItem(Store.AUTOSAVE_KEY);
                if (saved) {
                    const loaded = <RetainedState>JSON.parse(saved);
                    if (loaded && loaded.sketch && loaded.sketch.textBlocks) {
                        // data seems legit
                        this.state.retained = loaded;
                        this.state.retained.sketch.loading = true;
                        events.sketch.loaded.dispatch(this.state.retained.sketch);
                        for (const tb of this.state.retained.sketch.textBlocks) {
                            events.textblock.loaded.dispatch(tb);
                        }
                        events.designer.zoomToFitRequested.dispatch();
                        this.state.retained.sketch.loading = false;
                        success = true;
                    }
                }

                events.app.retainedStateLoadAttemptComplete.dispatch(success);
            });

        actions.app.saveRetainedState.subscribe(m => {
            if (!localStorage || !localStorage.getItem) {
                // not supported
                return;
            }

            localStorage.setItem(Store.AUTOSAVE_KEY, JSON.stringify(this.state.retained));
        });

        actions.app.loadFont.subscribe(m =>
            this.resources.parsedFonts.get(m.data));

        // ----- Designer -----

        actions.designer.zoomToFit.forward(
            events.designer.zoomToFitRequested);

        actions.designer.exportPNG.forward(
            events.designer.exportPNGRequested);

        actions.designer.exportSVG.forward(
            events.designer.exportSVGRequested);

        actions.designer.viewChanged.subscribe(m => {
            // Can't do this, due to chance of accidental closing   
            // this.setEditingItem(null);
            events.designer.viewChanged.dispatch(m.data);
        });

        // ----- Sketch -----

        actions.sketch.create
            .subscribe((m) => {
                this.state.retained.sketch = this.createSketch();
                const patch = m.data || {};
                patch.backgroundColor = patch.backgroundColor || '#f6f3eb';
                this.assign(this.state.retained.sketch, patch);

                events.sketch.loaded.dispatch(this.state.retained.sketch);
                events.designer.zoomToFitRequested.dispatch();

                this.resources.parsedFonts.get(this.state.retained.sketch.defaultFontDesc.url);

                this.state.disposable.editingItem = null;
                this.state.disposable.selection = null;

                this.changedRetainedState();
            });

        actions.sketch.attrUpdate
            .subscribe(ev => {
                this.assign(this.state.retained.sketch, ev.data);
                events.sketch.attrChanged.dispatch(
                    this.state.retained.sketch);
                this.changedRetainedState();
            });

        actions.sketch.setEditingItem.subscribe(m => {
            this.setEditingItem(m.data);
        });

        actions.sketch.setSelection.subscribe(m => {
            if(m.data){
                if (m.data.itemType && m.data.itemType !== "TextBlock") {
                    throw `Unhandled type ${m.type}`;
                }

                if (this.state.disposable.selection 
                    && this.state.disposable.selection.itemId === m.data.itemId) {
                    return;
                }

                this.state.disposable.selection = <ItemSelection>{
                    itemId: m.data.itemId,
                    itemType: m.data.itemType,
                    priorSelectionItemId: this.state.disposable.selection
                        && this.state.disposable.selection.itemId
                };
            }
            else {
                if(!this.state.disposable.selection){
                    return;
                }
                this.state.disposable.selection = m.data;
            }
            events.sketch.selectionChanged.dispatch(
                this.state.disposable.selection);
        });


        // ----- TextBlock -----

        actions.textBlock.add
            .subscribe(ev => {
                this.setEditingItem(null);

                let patch = ev.data;
                if (!patch.text || !patch.text.length) {
                    return;
                }
                let block = { _id: newid() } as TextBlock;
                this.assign(block, patch);
                if (!block.fontSize) {
                    block.fontSize = 128;
                }
                if (!block.textColor) {
                    block.textColor = "gray"
                }
                if (block.fontDesc) {
                    this.state.retained.sketch.defaultFontDesc = block.fontDesc;
                } else {
                    block.fontDesc = this.state.retained.sketch.defaultFontDesc;
                }

                this.state.retained.sketch.textBlocks.push(block);
                events.textblock.added.dispatch(block);
                this.changedRetainedState();
            });

        actions.textBlock.updateAttr
            .subscribe(ev => {
                let block = this.getBlock(ev.data._id);
                if (block) {
                    let patch = <TextBlock>{
                        text: ev.data.text,
                        backgroundColor: ev.data.backgroundColor,
                        textColor: ev.data.textColor,
                        fontDesc: ev.data.fontDesc,
                        fontSize: ev.data.fontSize
                    };
                    this.assign(block, patch);
                    if (block.fontDesc) {
                        this.state.retained.sketch.defaultFontDesc = block.fontDesc;
                    }
                    events.textblock.attrChanged.dispatch(block);
                    this.changedRetainedState();
                }
            });

        actions.textBlock.remove
            .subscribe(ev => {
                let didDelete = false;
                _.remove(this.state.retained.sketch.textBlocks, tb => {
                    if (tb._id === ev.data._id) {
                        didDelete = true;
                        return true;
                    }
                });
                if (didDelete) {
                    events.textblock.removed.dispatch({ _id: ev.data._id });
                    if (this.state.disposable.editingItem.itemId == ev.data._id) {
                        this.state.disposable.editingItem = null;
                        events.sketch.editingItemChanged.dispatch(this.state.disposable.editingItem);
                    }
                    this.changedRetainedState();
                }
                this.setEditingItem(null);
            });

        actions.textBlock.updateArrange
            .subscribe(ev => {
                let block = this.getBlock(ev.data._id);
                if (block) {
                    block.position = ev.data.position;
                    block.outline = ev.data.outline;
                    events.textblock.arrangeChanged.dispatch(block);
                    this.changedRetainedState();
                }
            });
    }

    loadResources() {
        const loader = new FontFamiliesLoader();
        loader.loadListLocal(families => {
            families.length = Store.FONT_LIST_LIMIT;
            const dict = this.resources.fontFamilies;
            for (const familyGroup of families) {
                dict[familyGroup.family] = familyGroup;
            }

            // load fonts into browser for preview
            loader.loadForPreview(families.map(f => f.family));

            this.resources.parsedFonts.get(Store.ROBOTO_500_LOCAL);

            this.events.app.resourcesReady.dispatch(true);
        });
    }

    changedRetainedState() {
        this.events.app.retainedStateChanged.dispatch(this.state.retained);
    }

    assign<T>(dest: T, source: T) {
        _.merge(dest, source);
    }

    createSketch(): Sketch {
        return {
            defaultFontDesc: {
                family: "Roboto",
                variant: null,
                category: null,
                url: Store.ROBOTO_500_LOCAL
            },
            textBlocks: <TextBlock[]>[]
        };
    }

    private setEditingItem(item: PositionedItem) {
        if(this.state.disposable.editingItem === item){
            return;
        }
        
        if (this.state.disposable.editingItem) {
            // signal closing editor for item
            
            if(this.state.disposable.editingItem.itemType === "TextBlock"){
                const currentEditingBlock = this.getBlock(this.state.disposable.editingItem.itemId);
                if(currentEditingBlock){
                    this.events.textblock.editorClosed.dispatch(currentEditingBlock);
                }
            }
        }
        
        this.state.disposable.editingItem = item;
        this.events.sketch.editingItemChanged.dispatch(item);
    }

    private getBlock(id: string) {
        return _.find(this.state.retained.sketch.textBlocks, tb => tb._id === id);
    }
}
