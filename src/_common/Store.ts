
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

    static AUTOSAVE_KEY = "Fiddlesticks.retainedState";
    static DEFAULT_FONT_NAME = "Open Sans";

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

        actions.app.loadRetainedState.subscribe(m => {
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
                    events.sketch.loaded.dispatch(
                        this.state.retained.sketch);
                    for (const tb of this.state.retained.sketch.textBlocks) {
                        events.textblock.loaded.dispatch(tb);
                    }
                    events.designer.zoomToFitRequested.dispatch();
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

        actions.designer.zoomToFit.subscribe(m => {
            events.designer.zoomToFitRequested.dispatch(null);
        })

        // ----- Sketch -----

        actions.sketch.create
            .subscribe((m) => {
                this.state.retained.sketch = this.createSketch();
                const patch = m.data || {};
                patch.backgroundColor = patch.backgroundColor || '#f6f3eb';
                this.assign(this.state.retained.sketch, patch);

                events.sketch.loaded.dispatch(this.state.retained.sketch);
                events.designer.zoomToFitRequested.dispatch();

                this.resources.parsedFonts.get(this.state.retained.sketch.fontUrl);

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
            if (m.data.itemType !== "TextBlock") {
                throw `Unhandled type ${m.type}`;
            }
            const item = this.getBlock(m.data.itemId);
            this.state.disposable.editingItem = {
                itemId: m.data.itemId,
                itemType: "TextBlock",
                item: item,
                clientX: m.data.clientX,
                clientY: m.data.clientY
            };
            events.sketch.editingItemChanged.dispatch(
                this.state.disposable.editingItem);
        });

        actions.sketch.setSelection.subscribe(m => {
            if (m.data.itemType && m.data.itemType !== "TextBlock") {
                throw `Unhandled type ${m.type}`;
            }

            if ((m.data && m.data.itemId)
                === (this.state.disposable.selection && this.state.disposable.selection.itemId)) {
                // nothing to do
                return;
            }

            this.state.disposable.selection = <ItemSelection>{
                itemId: m.data.itemId,
                itemType: m.data.itemType,
                priorSelectionItemId: this.state.disposable.selection
                && this.state.disposable.selection.itemId
            };
            events.sketch.selectionChanged.dispatch(
                this.state.disposable.selection);
        });


        // ----- TextBlock -----

        actions.textBlock.add
            .subscribe(ev => {
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
                        this.state.disposable.editingItem = {};
                        events.sketch.editingItemChanged.dispatch(this.state.disposable.editingItem);
                    }
                    this.changedRetainedState();
                }
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
            const dict = this.resources.fontFamilies;
            for (const familyGroup of families) {
                dict[familyGroup.family] = familyGroup;
            }
                
            // load fonts into browser for preview
            loader.loadForPreview(families.map(f => f.family));
        });
    }

    // loadFont(fontUrl: string) {
    //     this.resources.parsedFonts.get(fontUrl,
    //         font => this.events.app.fontLoaded.dispatch(font))
    // }

    changedRetainedState() {
        this.events.app.retainedStateChanged.dispatch(this.state.retained);
    }

    assign<T>(dest: T, source: T) {
        _.merge(dest, source);
    }

    createSketch(): Sketch {
        return {
            textBlocks: <TextBlock[]>[]
        };
    }

    private getBlock(id: string) {
        return _.find(this.state.retained.sketch.textBlocks, tb => tb._id === id);
    }
}
