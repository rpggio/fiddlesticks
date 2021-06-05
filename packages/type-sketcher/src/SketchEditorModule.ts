import {SketchStore} from './SketchStore'
import {AppStore} from './app'
import {initErrorHandler} from 'fstx-common'
import {WorkspaceController} from './WorkspaceController'
import {EditorBar, HelpDialog, OperationPanel, SelectedItemEditor} from './views'
import {first} from 'rxjs/operators'

export class SketchEditorModule {

  appStore: AppStore
  store: SketchStore
  workspaceController: WorkspaceController

  constructor(appStore: AppStore) {
    this.appStore = appStore

    this.store = new SketchStore(appStore)

    new EditorBar(document.getElementById('designer'), this.store)
    new SelectedItemEditor(document.getElementById('editorOverlay'), this.store)
    new HelpDialog(document.getElementById('help-dialog'), this.store)
    new OperationPanel(document.getElementById('operationPanel'), this.store)

    // this.store.events.subscribe(m => console.log("event", m.type, m.data));
    // this.store.actions.subscribe(m => console.log("action", m.type, m.data));
  }

  start() {

    this.store.events.editor.fontLoaded.observe().pipe(first()).subscribe(m => {

      this.workspaceController = new WorkspaceController(this.store, m.data)

      this.store.actions.editor.initWorkspace.dispatch()

      this.store.events.editor.workspaceInitialized.sub(() => {

        window.addEventListener('beforeunload',
          () => {
            if (this.store.state.sketchIsDirty) {
              return 'Your latest changes are not saved yet.'
            }
          })
      })
    })
  }
}
