
class SelectedItemEditor {

    constructor(container: HTMLElement, store: Store) {

        const dom$ = store.events.mergeTyped<PositionedItem>( 
                store.events.sketch.editingItemChanged,
                store.events.sketch.loaded
            ).map(i => {

            if (!i.data || !i.data.itemId) {
                return h('div#editorOverlay',
                    {
                        style: {
                            display: "none"
                        }
                    });
            }

            if (i.data.itemType !== 'TextBlock') {
                return;
            }

            let block = i.data.item as TextBlock;

            return h('div#editorOverlay',
                {
                    style: {
                        left: i.data.clientX + "px",
                        top: i.data.clientY + "px",
                        "z-index": 1
                    }
                },
                [
                    new TextBlockEditor(store).render(block)
                ]);

        });

        ReactiveDom.renderStream(dom$, container);

    }
}
