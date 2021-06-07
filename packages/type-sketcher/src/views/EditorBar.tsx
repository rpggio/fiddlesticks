import React, {createElement} from 'react'
import {Button, Flex, Heading, HStack, Menu, MenuButton, MenuItem, MenuList, Spacer, Text} from '@chakra-ui/react'
import {map} from 'rxjs/operators'
import {SketchStore} from '../SketchStore'
import {EditorState} from '../models'
import {Observable} from 'rxjs'
import {ReactModuleRoot} from '../lib/ReactModuleRoot'
import {render} from 'react-dom'
import {UploadImage} from '../operations'
import {KeyCodes} from 'fstx-common'
import {ColorSelect} from './ColorSelect'
import {SketchHelpers} from '../SketchHelpers'
import {useObservableState} from '../lib/useObservable'
import {ChevronDownIcon} from '@chakra-ui/icons'

function EditorBar({editorState$, store}: {
  editorState$: Observable<EditorState>
  store: SketchStore
}) {
  const editorState = useObservableState(editorState$)
  const actions = store.actions

  return <Flex
    background="#333"
    alignItems="center"
    padding="0.5em"
  >
    <Heading as="h1" size="md" textTransform="uppercase" margin={0}
             fontFamily="Arial Black" fontWeight={400} color="#d3d3d3"
             marginLeft="0.5em"
    >
      Type Sketcher
    </Heading>

    <Spacer/>

    <HStack>

      <Text color="white">Background:</Text>
      <Spacer/>
      <ColorSelect
        featuredColors={store.state.sketch && SketchHelpers.colorsInUse(store.state.sketch)}
        color={editorState?.sketch.backgroundColor ?? '#ffffff'}
        onColorSelect={color => actions.sketch.attrUpdate.dispatch({backgroundColor: color})}
      />

      <Spacer/>

      <Text color="white" lineHeight="2em" margin={0}>Add text:</Text>
      <Spacer/>
      <input
        placeholder="Press [Enter] to add"
        style={{height: '2em', width: '25ch'}}
        onKeyPress={ev => {
          if ((ev.which || ev.keyCode) === KeyCodes.Enter) {
            const target = ev.target as HTMLInputElement
            const text = target.value
            if (text.length) {
              actions.textBlock.add.dispatch({text: text})
              target.value = ''
            }
          }
        }}
      />

      <Spacer/>

      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
          Actions
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => actions.sketch.clear.dispatch()}>Clear all</MenuItem>
          <MenuItem onClick={() => actions.editor.zoomToFit.dispatch()}>Zoom to fit</MenuItem>
          <MenuItem onClick={() => actions.editor.exportPNG.dispatch({pixels: 400 * 1e3})}>Export medium
            image</MenuItem>
          <MenuItem onClick={() => actions.editor.exportPNG.dispatch({pixels: 4e6})}>Export large image</MenuItem>
          <MenuItem onClick={() => actions.editor.exportSVG.dispatch()}>Export SVG</MenuItem>
          <MenuItem onClick={() => actions.editor.openSample.dispatch()}>Load sample sketch</MenuItem>
          <MenuItem onClick={() => store.showOperation(new UploadImage(this.store))}
                    title="Upload image into workspace for tracing. The image will not show in final output">
            Upload temporary tracing image</MenuItem>
          <MenuItem onClick={() => store.removeUploadedImage()} title="Remove background tracing image">Remove tracing
            image</MenuItem>
          <MenuItem onClick={() => store.setTransparency(!store.state.transparency)}
                    title="See through text to elements behind">Toggle transparency</MenuItem>
        </MenuList>
      </Menu>

    </HStack>

  </Flex>
}

export function mountEditorBar(container: HTMLElement, store: SketchStore) {
  const editorState$ = store.events.merge(
    store.events.sketch.loaded,
    store.events.sketch.attrChanged,
    store.events.editor.userMessageChanged,
  ).pipe(map(m => store.state))

  const editorBar = createElement(EditorBar, {editorState$, store})
  const root = createElement(ReactModuleRoot, null, editorBar)

  render(root, container)
}