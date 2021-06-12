import { Button, Popover, PopoverCloseButton, PopoverContent, PopoverTrigger, VStack } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { SwatchesPicker } from 'react-color'
import _ from 'lodash'
import paper from 'paper'
import { CloseIcon } from '@chakra-ui/icons'

type Props = {
  featuredColors: string[]
  color: string
  onColorSelect: (color: string | null) => void
}

export function ColorSelect({ featuredColors, color, onColorSelect }: Props) {
  const [localColor, setLocalColor] = useState(color)
  const [isOpen, setIsOpen] = useState(false)

  // Only rebuild on featuredColors init,
  //  and when re-opened.
  const palette = useMemo(
    () => buildPalette(featuredColors),
    [featuredColors == null, isOpen],
  )

  useEffect(() => {
    setLocalColor(color)
  }, [color])

  return (
    <Popover
      closeOnBlur={true}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      placement="bottom"
    >
      <PopoverTrigger>
        <Button border="solid 1px gray" width={30} padding={0}>
          {localColor
            ? <div
              style={{
                background: localColor,
                height: 24,
                width: 24,
                border: '2px solid white',
                borderRadius: '50%',
              }}
            >
            </div>
            : <CloseIcon color="#aaa"/>
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <VStack>
          <div style={{ width: '100%' }}>
            <Button
              height={25}
              margin={1}
              onClick={() => {
                setLocalColor(null)
                onColorSelect(null)
              }}
            >Clear</Button>
            <PopoverCloseButton/>
          </div>
          <SwatchesPicker
            width={270}
            colors={palette ?? []}
            color={localColor ?? '#ffffff'}
            onChangeComplete={c => {
              setLocalColor(c.hex)
              onColorSelect(c.hex)
            }}
          />
        </VStack>
      </PopoverContent>
    </Popover>
  )
}

const DEFAULT_PALETTE_GROUPS = [
  [
    // http://www.color-hex.com/color-palette/807
    '#ee4035',
    '#f37736',
    '#fdf498',
    '#7bc043',
    '#0392cf',
  ],
  [
    // http://www.color-hex.com/color-palette/894
    '#edc951',
    '#eb6841',
    '#cc2a36',
    '#4f372d',
    '#00a0b0',
  ],
  [
    // http://www.color-hex.com/color-palette/164
    '#1b85b8',
    '#5a5255',
    '#559e83',
    '#ae5a41',
    '#c3cb71',
  ],
  [
    // http://www.color-hex.com/color-palette/389
    '#4b3832',
    '#854442',
    '#fff4e6',
    '#3c2f2f',
    '#be9b7b',
  ],
  [
    // http://www.color-hex.com/color-palette/455
    '#ff4e50',
    '#fc913a',
    '#f9d62e',
    '#eae374',
    '#e2f4c7',
  ],
  [
    // http://www.color-hex.com/color-palette/700
    '#d11141',
    '#00b159',
    '#00aedb',
    '#f37735',
    '#ffc425',
  ],
  [
    // http://www.color-hex.com/color-palette/826
    '#e8d174',
    '#e39e54',
    '#d64d4d',
    '#4d7358',
    '#9ed670',
  ],
]

const MONO_PALETTE = ['#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff']

const defaultColors = DEFAULT_PALETTE_GROUPS.map(group => {
  let parsedGroup = group.map(c => new paper.Color(c))
  // create light variants of darkest three
  const addColors = _.sortBy(parsedGroup, c => c.lightness)
    .slice(0, 3)
    .map(c => {
      const c2 = c.clone()
      c2.lightness = 0.85
      return c2
    })
  parsedGroup = parsedGroup.concat(addColors)
  parsedGroup = _.sortBy(parsedGroup, c => c.lightness)
  return parsedGroup.map(c => c.toCSS(true))
})

function buildPalette(featured: string[]) {
  const featuredSet = new Set(featured)
  return [
    featured ?? [],
    ...defaultColors.map(group => group.filter(it => !featuredSet.has(it))),
    MONO_PALETTE,
  ]
}
