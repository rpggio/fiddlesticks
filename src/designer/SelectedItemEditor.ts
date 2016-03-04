
class SelectedItemEditor {

    channels: Channels;

    constructor(container: HTMLElement, channels: Channels) {
        this.channels = channels;

        const dom$ = channels.events.mergeTyped<PositionedItem>( 
                channels.events.sketch.editingItemChanged,
                channels.events.sketch.loaded
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
                    new TextBlockEditor(channels.actions).render(block)
                ]);

        });

        ReactiveDom.renderStream(dom$, container);

    }
}
