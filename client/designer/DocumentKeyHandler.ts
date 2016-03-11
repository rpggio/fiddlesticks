
class DocumentKeyHandler {

    constructor(store: Store) {

        // note: undisposed event subscription
        $(document).keyup(function(e) {
            if (e.keyCode == DomHelpers.KeyCodes.Esc) {
                if(store.state.editingItem){
                    store.actions.sketch.setEditingItem.dispatch(null);
                } else {
                    store.actions.sketch.setSelection.dispatch(null);
                }
            }
        });

    }

}