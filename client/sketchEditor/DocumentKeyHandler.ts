namespace SketchEditor {

    export class DocumentKeyHandler {

        constructor(store: Store) {

            // note: undisposed event subscription
            $(document).keyup(function(e) {
                if (e.keyCode == DomHelpers.KeyCodes.Esc) {
                    store.actions.sketch.setSelection.dispatch(null);
                }
            });

        }

    }

}