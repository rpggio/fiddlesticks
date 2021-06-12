import { SketchStore } from './SketchStore'
import { AppStore } from './app'
import { WorkspaceController } from './WorkspaceController'
import { mountItemEditor, OperationPanel } from './views'
import { first } from 'rxjs/operators'
import { mountEditorBar } from './views/EditorBar'

export class SketchEditorModule {

  appStore: AppStore
  store: SketchStore
  workspaceController: WorkspaceController

  constructor(appStore: AppStore) {
    this.appStore = appStore

    this.store = new SketchStore(appStore)

    mountEditorBar(document.getElementById('editorBar'), this.store)
    mountItemEditor(document.getElementById('editorOverlay'), this.store)

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
