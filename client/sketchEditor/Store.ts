
namespace SketchEditor {

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
    export class Store {

        static BROWSER_ID_KEY = "browserId";
        static FALLBACK_FONT_URL = "/fonts/Roboto-500.ttf";
        static DEFAULT_FONT_NAME = "Roboto";
        static SKETCH_LOCAL_CACHE_KEY = "fiddlesticks.io.lastSketch";
        static LOCAL_CACHE_DELAY_MS = 1000;
        static SERVER_SAVE_DELAY_MS = 10000;
        static GREETING_SKETCH_ID = "im2ba92i1714i";

        fontListLimit = 250;

        state: EditorState = {};
        resources: StoreResources = {};
        actions = new Actions();
        events = new Events();

        private appStore: App.Store;
        private _operation$ = new Rx.Subject<Operation>();
        private _transparency$ = new Rx.Subject<boolean>();

        constructor(appStore: App.Store) {
            this.appStore = appStore;

            this.setupState();

            this.setupSubscriptions();

            this.loadResources();
        }

        setupState() {
            this.state.browserId = Cookies.get(Store.BROWSER_ID_KEY);
            if (!this.state.browserId) {
                this.state.browserId = Framework.newid();
                Cookies.set(Store.BROWSER_ID_KEY, this.state.browserId, { expires: 2 * 365 });
            }
        }

        setupSubscriptions() {
            const actions = this.actions, events = this.events;

            // ----- App -----

            this.appStore.events.routeChanged.sub(route => {
                const routeSketchId = route.params.sketchId;
                if (route.name === "sketch" && routeSketchId !== this.state.sketch._id) {
                    this.openSketch(routeSketchId);
                }
            });

            // ----- Editor -----

            actions.editor.initWorkspace.observe()
                .pausableBuffered(events.editor.resourcesReady.observe().map(m => m.data))
                .subscribe(m => {
                    this.setSelection(null, true);
                    this.setEditingItem(null, true);

                    const sketchId = this.appStore.state.route.params.sketchId
                        || this.appStore.state.lastSavedSketchId;
                    let promise: JQueryPromise<any>;
                    if (sketchId) {
                        promise = this.openSketch(sketchId);
                    } else {
                        promise = this.loadGreetingSketch();
                    }
                    promise.then(() => events.editor.workspaceInitialized.dispatch());

                    // on any action, update save delay timer
                    this.actions.observe().debounce(Store.SERVER_SAVE_DELAY_MS)
                        .subscribe(() => {
                            const sketch = this.state.sketch;
                            if (!this.state.loadingSketch
                                && this.state.sketchIsDirty
                                && sketch._id
                                && sketch.textBlocks.length) {
                                this.saveSketch(sketch);
                            }
                        });
                });

            actions.editor.loadFont.subscribe(m =>
                this.resources.parsedFonts.get(m.data));

            actions.editor.zoomToFit.forward(
                events.editor.zoomToFitRequested);

            actions.editor.exportPNG.subscribe(m => {
                this.setSelection(null);
                this.setEditingItem(null);
                events.editor.exportPNGRequested.dispatch(m.data);
                this.sendGAExport(m.data.pixels);
            });

            actions.editor.exportSVG.subscribe(m => {
                this.setSelection(null);
                this.setEditingItem(null);
                events.editor.exportSVGRequested.dispatch(m.data);
            });

            actions.editor.viewChanged.subscribe(m => {
                events.editor.viewChanged.dispatch(m.data);
            });

            actions.editor.updateSnapshot.sub(({sketchId, pngDataUrl}) => {
                if (sketchId === this.state.sketch._id) {
                    const fileName = sketchId + ".png";
                    const blob = DomHelpers.dataURLToBlob(pngDataUrl);
                    S3Access.putFile(fileName, "image/png", blob);
                }
            });

            actions.editor.toggleHelp.subscribe(() => {
                this.state.showHelp = !this.state.showHelp;
                events.editor.showHelpChanged.dispatch(this.state.showHelp);
            });

            actions.editor.openSample.sub(() => this.loadGreetingSketch());

            // ----- Sketch -----

            actions.sketch.open.sub(id => {
                this.openSketch(id);
            });

            actions.sketch.create.sub((attr) => {
                this.newSketch(attr);
            });

            actions.sketch.clear.sub(() => {
                this.clearSketch();
            })

            actions.sketch.clone.subscribe(() => {
                const clone = _.clone(this.state.sketch);
                clone._id = Framework.newid();
                clone.browserId = this.state.browserId;
                clone.savedAt = null;
                this.loadSketch(clone);
                this.state.sketchIsDirty = false;
                this.events.sketch.cloned.dispatch(clone);
                this.pulseUserMessage("Duplicated sketch. Address of this page has been updated.");
            });

            actions.sketch.attrUpdate.subscribe(ev => {
                this.merge(this.state.sketch, ev.data);
                this.state.sketch.backgroundColor = ev.data.backgroundColor;
                events.sketch.attrChanged.dispatch(
                    this.state.sketch);
                this.changedSketchContent();
            });

            actions.sketch.setSelection.subscribe(m => {
                this.setSelection(m.data);
                this.setEditingItem(m.data);
            });


            // ----- TextBlock -----

            actions.textBlock.add
                .subscribe(ev => {
                    this.setEditingItem(null);

                    let patch = ev.data;
                    if (!patch.text || !patch.text.length) {
                        return;
                    }
                    let block = { _id: Framework.newid() } as TextBlock;
                    this.merge(block, patch);

                    block.textColor = this.state.sketch.defaultTextBlockAttr.textColor;
                    block.backgroundColor = this.state.sketch.defaultTextBlockAttr.backgroundColor;
                    if (!block.fontFamily) {
                        block.fontFamily = this.state.sketch.defaultTextBlockAttr.fontFamily;
                        block.fontVariant = this.state.sketch.defaultTextBlockAttr.fontVariant;
                    }

                    this.state.sketch.textBlocks.push(block);
                    events.textblock.added.dispatch(block);
                    this.changedSketchContent();

                    this.loadTextBlockFont(block);
                });

            actions.textBlock.updateAttr
                .subscribe(ev => {
                    let block = this.getBlock(ev.data._id);
                    if (block) {
                        let patch = <TextBlock>{
                            text: ev.data.text,
                            backgroundColor: ev.data.backgroundColor,
                            textColor: ev.data.textColor,
                            fontFamily: ev.data.fontFamily,
                            fontVariant: ev.data.fontVariant
                        };
                        const fontChanged = patch.fontFamily !== block.fontFamily
                            || patch.fontVariant !== block.fontVariant;
                        this.merge(block, patch);

                        if (block.fontFamily && !block.fontVariant) {
                            const record = this.resources.fontCatalog.getRecord(block.fontFamily);
                            if (record) {
                                // regular or else first variant
                                block.fontVariant = FontShape.FontCatalog.defaultVariant(record);
                            }
                        }

                        this.state.sketch.defaultTextBlockAttr = {
                            textColor: block.textColor,
                            backgroundColor: block.backgroundColor,
                            fontFamily: block.fontFamily,
                            fontVariant: block.fontVariant
                        };

                        events.textblock.attrChanged.dispatch(block);
                        this.changedSketchContent();

                        if (fontChanged) {
                            this.loadTextBlockFont(block);
                        }
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
                        events.textblock.removed.dispatch({ _id: ev.data._id });
                        this.changedSketchContent();
                        this.setEditingItem(null);
                    }
                });

            actions.textBlock.updateArrange
                .subscribe(ev => {
                    let block = this.getBlock(ev.data._id);
                    if (block) {
                        block.position = ev.data.position;
                        block.outline = ev.data.outline;
                        events.textblock.arrangeChanged.dispatch(block);
                        this.changedSketchContent();
                    }
                });
        }

        get operation$() {
            return this._operation$.asObservable();
        }

        get transparency$() {
            return this._transparency$.asObservable();
        }
        
        public showOperation(operation: Operation){
            this.state.operation = operation;
            operation.onClose = () => {
                if(this.state.operation === operation){
                    this.hideOperation(); 
                }
            }
            this._operation$.onNext(operation);
        }
        
        public hideOperation() {
            this.state.operation = null;
            this._operation$.onNext(null);                    
        }

        public imageUploaded(src: string){
            this.state.uploadedImage = src;
            this.events.sketch.imageUploaded.dispatch(src);
            if(!this.state.transparency){
                this.setTransparency(true);
            }  
        }

        public removeUploadedImage(){
            this.state.uploadedImage = null;
            this.events.sketch.imageUploaded.dispatch(null);
            if(this.state.transparency){
                this.setTransparency(false);
            }
        }

        public setTransparency(value?: boolean) {
            this.state.transparency = value;
            this._transparency$.onNext(this.state.transparency);
        }

        private openSketch(id: string): JQueryPromise<Sketch> {
            if (!id || !id.length) {
                return;
            }
            return S3Access.getJson(id + ".json")
                .then(
                (sketch: Sketch) => {
                    this.loadSketch(sketch);

                    console.log("Retrieved sketch", sketch._id);
                    if (sketch.browserId === this.state.browserId) {
                        console.log('Sketch was created in this browser');
                    }
                    else {
                        console.log('Sketch was created in a different browser');
                    }

                    return sketch;
                },
                err => {
                    console.warn("error getting remote sketch", err);
                    this.loadGreetingSketch();
                });
        }

        private loadSketch(sketch: Sketch) {
            this.state.loadingSketch = true;
            this.state.sketch = sketch;
            this.state.sketchIsDirty = false;
            this.setDefaultUserMessage();

            this.events.sketch.loaded.dispatch(this.state.sketch);
            this.appStore.actions.editorLoadedSketch.dispatch(sketch._id);
            for (const tb of this.state.sketch.textBlocks) {
                this.events.textblock.loaded.dispatch(tb);
                this.loadTextBlockFont(tb);
            }

            this.events.editor.zoomToFitRequested.dispatch();

            this.state.loadingSketch = false;
        }

        private loadGreetingSketch(): JQueryPromise<any> {
            return S3Access.getJson(Store.GREETING_SKETCH_ID + ".json")
                .done((sketch: Sketch) => {
                    sketch._id = Framework.newid();
                    sketch.browserId = this.state.browserId;
                    this.loadSketch(sketch);
                });
        }

        private clearSketch() {
            const sketch = <Sketch>this.defaultSketchAttr();
            sketch._id = this.state.sketch._id;
            this.loadSketch(sketch);
        }

        private loadResources() {
            this.resources.parsedFonts = new FontShape.ParsedFonts(parsed =>
                this.events.editor.fontLoaded.dispatch(parsed.font))
            
            FontShape.FontCatalog.fromLocal("fonts/google-fonts.json")
                .then(catalog => {
                    this.resources.fontCatalog = catalog;
                    
                    // load fonts into browser for preview
                    FontShape.FontCatalog.loadPreviewSubsets(
                        catalog.getList(this.fontListLimit).map(f => f.family));

                    this.resources.parsedFonts.get(Store.FALLBACK_FONT_URL).then(({font}) =>
                        this.resources.fallbackFont = font);

                    this.events.editor.resourcesReady.dispatch(true);
                });
        }

        private setUserMessage(message: string) {
            if (this.state.userMessage !== message) {
                this.state.userMessage = message;
                this.events.editor.userMessageChanged.dispatch(message);
            }
        }

        private pulseUserMessage(message: string) {
            this.setUserMessage(message);
            setTimeout(() => this.setDefaultUserMessage(), 4000);
        }

        private setDefaultUserMessage() {
            // if not the last saved sketch, or sketch is dirty, show "Unsaved"
            const message = (this.state.sketchIsDirty
                || !this.state.sketch.savedAt)
                ? "Unsaved"
                : "Saved";
            this.setUserMessage(message);
        }

        private loadTextBlockFont(block: TextBlock) {
            this.resources.parsedFonts.get(
                this.resources.fontCatalog.getUrl(block.fontFamily, block.fontVariant))
                .then(({font}) =>
                    this.events.textblock.fontReady.dispatch(
                        { textBlockId: block._id, font }));
        }

        private changedSketchContent() {
            this.state.sketchIsDirty = true;
            this.events.sketch.contentChanged.dispatch(this.state.sketch);
            this.setDefaultUserMessage();
        }

        private merge<T>(dest: T, source: T) {
            _.merge(dest, source);
        }

        private newSketch(attr?: SketchAttr): Sketch {
            const sketch = <Sketch>this.defaultSketchAttr();
            sketch._id = Framework.newid();
            if (attr) {
                this.merge(sketch, attr);
            }
            this.loadSketch(sketch);
            return sketch;
        }

        private defaultSketchAttr() {
            return <SketchAttr>{
                browserId: this.state.browserId,
                defaultTextBlockAttr: {
                    fontFamily: "Roboto",
                    fontVariant: "regular",
                    textColor: "gray"
                },
                backgroundColor: "white",
                textBlocks: <TextBlock[]>[]
            };
        }

        private saveSketch(sketch: Sketch) {
            const saving = _.clone(sketch);
            const now = new Date();
            saving.savedAt = now;
            this.setUserMessage("Saving");
            S3Access.putFile(sketch._id + ".json",
                "application/json", JSON.stringify(saving))
                .then(() => {
                    this.state.sketchIsDirty = false;
                    this.state.sketch.savedAt = now;
                    this.setDefaultUserMessage();
                    this.appStore.actions.editorSavedSketch.dispatch(sketch._id);
                    this.events.editor.snapshotExpired.dispatch(sketch);
                },
                () => {
                    this.setUserMessage("Unable to save");
                });
        }

        private setSelection(item: WorkspaceObjectRef, force: boolean = true) {
            if (!force) {
                // early exit on no change
                if (item) {
                    if (this.state.selection
                        && this.state.selection.itemId === item.itemId) {
                        return;
                    }
                } else {
                    if (!this.state.selection) {
                        return;
                    }
                }
            }

            this.state.selection = item;
            this.events.sketch.selectionChanged.dispatch(item);
        }

        private setEditingItem(item: PositionedObjectRef, force?: boolean) {
            if (!force) {
                // early exit on no change
                if (item) {
                    if (this.state.editingItem
                        && this.state.editingItem.itemId === item.itemId) {
                        return;
                    }
                } else {
                    if (!this.state.editingItem) {
                        return;
                    }
                }
            }

            if (this.state.editingItem) {
                // signal closing editor for item

                if (this.state.editingItem.itemType === "TextBlock") {
                    const currentEditingBlock = this.getBlock(this.state.editingItem.itemId);
                    if (currentEditingBlock) {
                        this.events.textblock.editorClosed.dispatch(currentEditingBlock);
                    }
                }
            }

            if (item) {
                // editing item should be selected item
                this.setSelection(item);
            }

            this.state.editingItem = item;
            this.events.sketch.editingItemChanged.dispatch(item);
        }

        private getBlock(id: string) {
            return _.find(this.state.sketch.textBlocks, tb => tb._id === id);
        }

        private sendGAExport(value: number){
            let label = SketchHelpers.getSketchFileName(this.state.sketch, 30);
            gaEvent({
                eventCategory: "Design",
                eventAction: "export-image",
                eventLabel: label,
                eventValue: value
            });
        }
    }

}