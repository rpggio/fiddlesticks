import * as _ from 'lodash'
import {fromEventPattern, Observable} from 'rxjs'
import paper from 'paper'

type ItemChangeHandler = (flags: ChangeFlag) => void
type Callback = () => void

export interface NotifyItem {
  /**
   * Subscribe to all changes in item. Returns un-subscribe function.
   */
  subscribe(handler: ItemChangeHandler): Callback

  remove()

  _changed(flags: ChangeFlag): void
}

export enum ChangeFlag {
  // Anything affecting the appearance of an item, including GEOMETRY,
  // STROKE, STYLE and ATTRIBUTE (except for the invisible ones = locked, name)
  APPEARANCE = 0x1,
  // A change in the item's children
  CHILDREN = 0x2,
  // A change of the item's place in the scene graph (removed, inserted,
  // moved)
  INSERTION = 0x4,
  // Item geometry (path, bounds)
  GEOMETRY = 0x8,
  // The item's matrix has changed
  MATRIX = 0x10,
  // Only segment(s) have changed, and affected curves have already been
  // notified. This is to implement an optimization in _changed() calls
  SEGMENTS = 0x20,
  // Stroke geometry (excluding color)
  STROKE = 0x40,
  // Fill style or stroke color / dash
  STYLE = 0x80,
  // Item attributes = visible, blendMode, locked, name, opacity, clipMask ...
  ATTRIBUTE = 0x100,
  // Text content
  CONTENT = 0x200,
  // Raster pixels
  PIXELS = 0x400,
  // Clipping in one of the child items
  CLIPPING = 0x800,
  // The view has been transformed
  VIEW = 0x1000
}

// Shortcuts to often used ChangeFlag values including APPEARANCE
export enum Changes {
  // CHILDREN also changes GEOMETRY, since removing children from groups
  // changes bounds.
  CHILDREN = ChangeFlag.CHILDREN | ChangeFlag.GEOMETRY | ChangeFlag.APPEARANCE,
  // Changing the insertion can change the appearance through parent's matrix.
  INSERTION = ChangeFlag.INSERTION | ChangeFlag.APPEARANCE,
  GEOMETRY = ChangeFlag.GEOMETRY | ChangeFlag.APPEARANCE,
  MATRIX = ChangeFlag.MATRIX | ChangeFlag.GEOMETRY | ChangeFlag.APPEARANCE,
  SEGMENTS = ChangeFlag.SEGMENTS | ChangeFlag.GEOMETRY | ChangeFlag.APPEARANCE,
  STROKE = ChangeFlag.STROKE | ChangeFlag.STYLE | ChangeFlag.APPEARANCE,
  STYLE = ChangeFlag.STYLE | ChangeFlag.APPEARANCE,
  ATTRIBUTE = ChangeFlag.ATTRIBUTE | ChangeFlag.APPEARANCE,
  CONTENT = ChangeFlag.CONTENT | ChangeFlag.GEOMETRY | ChangeFlag.APPEARANCE,
  PIXELS = ChangeFlag.PIXELS | ChangeFlag.APPEARANCE,
  VIEW = ChangeFlag.VIEW | ChangeFlag.APPEARANCE
}

export function initialize() {
  // Inject Item.subscribe
  const itemProto = paper.Item.prototype as unknown as NotifyItem
  itemProto.subscribe = function (handler: ItemChangeHandler): Callback {
    if (!this._subscribers) {
      this._subscribers = []
    }
    if (this._subscribers.indexOf(handler) < 0) {
      this._subscribers.push(handler)
    }
    return () => {
      let index = this._subscribers.indexOf(handler, 0)
      if (index > -1) {
        this._subscribers.splice(index, 1)
      }
    }
  }

  // Wrap Item.remove
  const itemRemove = itemProto.remove
  itemProto.remove = function () {
    itemRemove.apply(this, arguments)
    this._subscribers = null
  }

  // Wrap Project._changed
  const projectProto = paper.Project.prototype as any
  const projectChanged = projectProto._changed
  projectProto._changed = function (flags: ChangeFlag, item: paper.Item) {
    projectChanged.apply(this, arguments)

    if (item) {
      const subs = (item as any)._subscribers
      if (subs) {
        for (let s of subs) {
          s.call(item, flags)
        }
      }
    }
  }
}

export function describe(flags: ChangeFlag) {
  let flagList: string[] = []
  _.forOwn(ChangeFlag, (value, key) => {
    if ((typeof value) === 'number' && ((value as number) & flags)) {
      flagList.push(key)
    }
  })
  return flagList.join(' | ')
}

export function observe(item: paper.Item, flags: ChangeFlag):
  Observable<ChangeFlag> {
  let unsub: () => void
  return fromEventPattern<ChangeFlag>(
    addHandler => {
      unsub = (item as unknown as NotifyItem).subscribe(f => {
        if (f & flags) {
          addHandler(f)
        }
      })
    },
    removeHandler => {
      if (unsub) {
        unsub()
      }
    })
}

initialize()
