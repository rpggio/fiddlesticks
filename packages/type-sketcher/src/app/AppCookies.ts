import Cookies from 'js-cookie'

export class AppCookies {

  static YEAR = 365
  static BROWSER_ID_KEY = 'browserId'
  static LAST_SAVED_SKETCH_ID_KEY = 'lastSavedSketchId'

  get lastSavedSketchId() {
    return Cookies.get(AppCookies.LAST_SAVED_SKETCH_ID_KEY)
  }

  set lastSavedSketchId(value: string) {
    Cookies.set(AppCookies.LAST_SAVED_SKETCH_ID_KEY, value, { expires: AppCookies.YEAR })
  }

  get browserId() {
    return Cookies.get(AppCookies.BROWSER_ID_KEY)
  }

  set browserId(value: string) {
    Cookies.set(AppCookies.BROWSER_ID_KEY, value, { expires: AppCookies.YEAR })
  }

}
