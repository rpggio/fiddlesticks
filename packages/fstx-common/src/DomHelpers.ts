import StackTrace from 'stacktrace-js'

/**
 * Creates and returns a blob from a data URL (either base64 encoded or not).
 * https://github.com/ebidel/filer.js/blob/master/src/filer.js#L137
 *
 * @param {string} dataURL The data URL to convert.
 * @return {Blob} A blob representing the array buffer data.
 */
export function dataURLToBlob(dataURL): Blob {
    const BASE64_MARKER = ';base64,'
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        const parts = dataURL.split(',')
        const contentType = parts[0].split(':')[1]
        const raw = decodeURIComponent(parts[1])

        return new Blob([raw], {type: contentType})
    }

    const parts = dataURL.split(BASE64_MARKER)
    const contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length

    const uInt8Array = new Uint8Array(rawLength)

    for (const i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
    }

    return new Blob([uInt8Array], {type: contentType})
}

export function initErrorHandler(logger: (errorData: Object) => void) {

    window.onerror = function (msg, file, line, col, error: Error | string) {

        try {
            const callback = stackframes => {

                try {

                    const data = {
                        message: msg,
                        file: file,
                        line: line,
                        col: col,
                        stack: stackframes,
                    }

                    logger(data)

                } catch (err) {
                    console.error('Failed to log error', err)
                }
            }

            const errback = err => {
                console.error('Failed to log error', err)
            }

            if (typeof error === 'string') {
                error = new Error(<string>error)
            }

            const asError = typeof error === 'string'
                ? new Error(error)
                : error

            StackTrace.fromError(asError)
                .then(callback)
                .catch(errback)

        } catch (ex) {
            console.error('failed to log error', ex)
        }
    }


}

export const KeyCodes = {
    BackSpace: 8,
    Tab: 9,
    Enter: 13,
    Shift: 16,
    Ctrl: 17,
    Alt: 18,
    PauseBreak: 19,
    CapsLock: 20,
    Esc: 27,
    PageUp: 33,
    PageDown: 34,
    End: 35,
    Home: 36,
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    Insert: 45,
    Delete: 46,
    Digit0: 48,
    Digit1: 49,
    Digit2: 50,
    Digit3: 51,
    Digit4: 52,
    Digit5: 53,
    Digit6: 54,
    Digit7: 55,
    Digit8: 56,
    Digit9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    WindowLeft: 91,
    WindowRight: 92,
    SelectKey: 93,
    Numpad0: 96,
    Numpad1: 97,
    Numpad2: 98,
    Numpad3: 99,
    Numpad4: 100,
    Numpad5: 101,
    Numpad6: 102,
    Numpad7: 103,
    Numpad8: 104,
    Numpad9: 105,
    Multiply: 106,
    Add: 107,
    Subtract: 109,
    DecimalPoint: 110,
    Divide: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NumLock: 144,
    ScrollLock: 145,
    SemiColon: 186,
    Equal: 187,
    Comma: 188,
    Dash: 189,
    Period: 190,
    ForwardSlash: 191,
    GraveAccent: 192,
    BracketOpen: 219,
    BackSlash: 220,
    BracketClose: 221,
    SingleQuote: 222,
}
