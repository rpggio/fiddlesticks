import paper from 'paper'
import {PaperEventType} from './PaperEventType'

/**
 * Use of these events requires first calling extendMouseEvents
 *   on the item.
 */
export const ExtendedEventType = {
  mouseDragStart: 'mouseDragStart',
  mouseDragEnd: 'mouseDragEnd',
}

export function extendMouseEvents(item: paper.Item) {

  let dragging = false

  item.on(PaperEventType.mouseDrag, ev => {
    if (!dragging) {
      dragging = true
      item.emit(ExtendedEventType.mouseDragStart, ev)
    }
  })

  item.on(PaperEventType.mouseUp, ev => {
    if (dragging) {
      dragging = false
      item.emit(ExtendedEventType.mouseDragEnd, ev)
      // prevent click
      ev.stop()
    }
  })

}
