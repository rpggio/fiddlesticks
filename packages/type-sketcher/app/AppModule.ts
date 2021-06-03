import {AppStore} from './AppStore'
import {SketchEditorModule} from '../SketchEditorModule'

export class AppModule {

    store: AppStore
    editorModule: SketchEditorModule

    constructor() {
        this.store = new AppStore()
        this.editorModule = new SketchEditorModule(this.store)
    }

    start() {
        this.editorModule.start()
    }

}

interface Window {
    app: AppModule
}
