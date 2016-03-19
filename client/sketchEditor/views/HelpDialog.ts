namespace SketchEditor {

    export class HelpDialog {

        private store: Store;

        constructor(container: HTMLElement, store: Store) {
            this.store = store;
            const outer = $(container);
            outer.append("<h3>Getting started</h3>");
            store.state.showHelp ? outer.show() : outer.hide();
            $.get("content/help.html", d => {
                const close = $("<button class='btn btn-default'> Close </button>");
                close.on("click", ev => {
                    this.store.actions.editor.toggleHelp.dispatch();
                });
                outer.append($(d))
                     .append(close)
                     .append("<a class='right' href='mailto:fiddlesticks@codeflight.io'>Email us</a>");
            });
            store.events.designer.showHelpChanged.sub(show => {
                show ? outer.show() : outer.hide()
            });
        }

    }

}