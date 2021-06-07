import {SketchStore} from '../SketchStore'
import {PositionedObjectRef, TextBlock} from '../models'
import {map} from 'rxjs/operators'
import _ from 'lodash'
import React, {createElement} from 'react'
import {ReactModuleRoot} from '../lib/ReactModuleRoot'
import {render} from 'react-dom'
import {Observable} from 'rxjs'
import {useObservableState} from '../lib/useObservable'
import {HStack, VStack} from '@chakra-ui/react'
import {ColorSelect} from './ColorSelect'
import {SketchHelpers} from '../SketchHelpers'
import {DeleteIcon} from '@chakra-ui/icons'

export function ItemEditor({state$, store}: {
  state$: Observable<PositionedObjectRef>,
  store: SketchStore
}) {
  const {actions} = store
  const posItem = useObservableState(state$)

  const block = posItem
    && posItem.itemType === 'TextBlock'
    && _.find(store.state.sketch.textBlocks,
      b => b._id === posItem.itemId)

  if (!block) {
    return null
  }

  const featured = store.state.sketch && SketchHelpers.colorsInUse(store.state.sketch)

  const updateBlock = (message: Partial<TextBlock>) => {
    message._id = block._id
    actions.textBlock.updateAttr.dispatch(message)
  }

  return <VStack
    key={block._id}
    padding={2}
    alignItems="flex-end"
    border="1px solid gray"
  >
    <HStack>
      <textarea
        defaultValue={block.text}
        onChange={ev => {
          // setText(ev.currentTarget.value)
          updateBlock({text: ev.currentTarget.value})
        }}
      />
      <DeleteIcon
        onClick={() => actions.textBlock.remove.dispatch(block)}
      />
    </HStack>

    <HStack align="right">
      <span>Text color:</span>
      <ColorSelect
        featuredColors={featured}
        color={block.textColor}
        onColorSelect={color => updateBlock({textColor: color})}
      />
    </HStack>

    <HStack>
      <span>Background color:</span>
      <ColorSelect
        featuredColors={featured}
        color={block.backgroundColor}
        onColorSelect={color => updateBlock({backgroundColor: color})}
      />
    </HStack>

  </VStack>
}

export function mountItemEditor(container: HTMLElement, store: SketchStore) {
  const state$ = store.events.sketch.editingItemChanged.observe()
    .pipe(map(it => it.data))

  const itemEditor = createElement(ItemEditor, {state$, store})
  const root = createElement(ReactModuleRoot, null, itemEditor)

  render(root, container)
}
