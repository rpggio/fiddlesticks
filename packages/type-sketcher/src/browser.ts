import {AppModule} from './app'

export * from './models'
export * from './channels'
export * from './SketchStore'
export * from './SketchHelpers'
export * from './DocumentKeyHandler'
export * from './SketchEditorModule'
export * from './WorkspaceController'

const win = window as any

const app = new AppModule()
win.app = app
app.start()
