import {AppCookies} from './AppCookies'
import {Channel, newid} from 'fstx-common'
import {AppRouter, AppRouteState} from './AppRouter'

export class AppStore {

  state: AppState
  actions: Actions
  events: Events

  private router: AppRouter
  private cookies: AppCookies

  constructor() {
    this.router = new AppRouter()
    this.actions = new Actions()
    this.events = new Events()
    this.cookies = new AppCookies()

    this.startRouter()
    this.initState()
    this.initActionHandlers()
  }

  initState() {
    this.state = new AppState(this.cookies, this.router)
  }

  initActionHandlers() {
    this.actions.editorLoadedSketch.sub(sketchId => {
      this.router.navigate('sketch', {sketchId})
    })

    this.actions.editorSavedSketch.sub(id => {
      this.cookies.lastSavedSketchId = id
    })
  }

  startRouter() {
    this.router.start((err, state) => {
      this.events.routeChanged.dispatch(state)
      if (err) {
        console.warn('router error', err)
        this.router.navigate('home')
      }
    })
  }

}

export class AppState {

  private cookies: AppCookies
  private router: AppRouter

  constructor(cookies: AppCookies, router: AppRouter) {
    this.cookies = cookies
    this.router = router

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

  get route() {
    return this.router.state
  }
}

export class Actions extends Channel {
  editorLoadedSketch = this.topic<string>('editorLoadedSketch')
  editorSavedSketch = this.topic<string>('editorSavedSketch')
}

export class Events extends Channel {
  routeChanged = this.topic<AppRouteState>('routeChanged')
}
