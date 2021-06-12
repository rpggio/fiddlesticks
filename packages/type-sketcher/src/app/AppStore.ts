import { AppCookies } from './AppCookies'
import { Channel, newid } from 'fstx-common'

export class AppStore {

  state: AppState
  actions: Actions
  events: Events

  private cookies: AppCookies

  constructor() {
    this.actions = new Actions()
    this.events = new Events()
    this.cookies = new AppCookies()

    this.initState()
    this.initActionHandlers()
  }

  initState() {
    this.state = new AppState(this.cookies)
  }

  initActionHandlers() {
    this.actions.editorLoadedSketch.sub(sketchId => {
      // this.router.navigate('sketch', {sketchId})
    })

    this.actions.editorSavedSketch.sub(id => {
      this.cookies.lastSavedSketchId = id
    })
  }

}

export class AppState {

  private cookies: AppCookies

  constructor(cookies: AppCookies) {
    this.cookies = cookies

    const browserId = this.cookies.browserId || newid()
    // init or refresh cookie
    this.cookies.browserId = browserId
  }

  get lastSavedSketchId() {
    return this.cookies.lastSavedSketchId
  }

  get browserId() {
    return this.cookies.browserId
  }
}

export class Actions extends Channel {
  editorLoadedSketch = this.topic<string>('editorLoadedSketch')
  editorSavedSketch = this.topic<string>('editorSavedSketch')
}

export class Events extends Channel {
  routeChanged = this.topic<string>('routeChanged')
}
