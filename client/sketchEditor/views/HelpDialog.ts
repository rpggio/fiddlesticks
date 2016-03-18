namespace SketchEditor {

    export class HelpDialog {

        private store: Store;

        constructor(container: HTMLElement, store: Store) {
            this.store = store;
            const outer = $(container);
            outer.append("<h3>Getting started</h3>");
            store.state.showHelp ? outer.show() : outer.hide();
            $.get("content/help.html", d => {
                $(d).appendTo(outer);
                outer.append("<i>click to close</i>");
            });
            outer.on("click", ev => {
                this.store.actions.designer.toggleHelp.dispatch();
            });
            store.events.designer.showHelpChanged.subscribeData(show => {
                show ? outer.show() : outer.hide()
            });
        }

    }

}