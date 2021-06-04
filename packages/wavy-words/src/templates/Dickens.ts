import {
  BuilderControl,
  Design,
  Template,
  TemplateBuildContext,
  TemplateState,
  TemplateStateChange,
  TemplateUIContext,
} from '../models'
import {TextInput} from '../controls/TextInput'
import {VerticalBoundsStretchPath} from 'font-shape'
import {Choice, chooser} from '../controls/ControlHelpers'
import {SeedRandom} from 'fstx-common'
import {merge, Subject} from 'rxjs'
import _ from 'lodash'
import {h} from 'snabbdom'
import {map} from 'rxjs/operators'

export class Dickens implements Template {

  name = 'Dickens'
  description: 'Stack blocks of text in the form of a wavy ladder.'
  image: string
  lineHeightVariation = 0.8
  defaultFontSize = 128
  marginFactor = 0.14
  paletteColors = [
    '#4b3832',
    '#854442',
    //"#fff4e6",
    '#3c2f2f',
    '#be9b7b',

    '#1b85b8',
    '#5a5255',
    '#559e83',
    '#ae5a41',
    '#c3cb71',

    '#0e1a40',
    '#222f5b',
    '#5d5d5d',
    '#946b2d',
    '#000000',

    '#edc951',
    '#eb6841',
    '#cc2a36',
    '#4f372d',
    '#00a0b0',
  ]

  createNew(context: TemplateUIContext): TemplateState {
    const defaultFontRecord = context.fontCatalog.getList(1)[0]
    return <TemplateState>{
      design: {
        shape: 'narrow',
        font: {
          family: defaultFontRecord.family,
        },
        seed: Math.random(),
      },
      fontCategory: defaultFontRecord.category,
    }
  }

  createUI(context: TemplateUIContext): BuilderControl[] {
    return [
      this.createTextEntry(),
      this.createShapeChooser(context),
      this.createVariationControl(),
      context.createFontChooser(),
      this.createPaletteChooser(),
    ]
  }

  build(design: Design, context: TemplateBuildContext): Promise<paper.Item> {
    if (!design.content || !design.content.text) {
      return Promise.resolve(null)
    }

    return context.getFont(design.font).then(font => {
      const words = design.content.text.toLocaleUpperCase().split(/\s/)

      const seedRandom = new SeedRandom(
        design.seed == null ? Math.random() : design.seed)
      let targetLength: number
      switch (design.shape) {
        case 'balanced':
          targetLength = 2 * Math.sqrt(_.sum(words.map(w => w.length + 1)))
          break
        case 'wide':
          const numLines = 3
          targetLength = _.sum(words.map(w => w.length + 1)) / numLines
          break
        default:
          targetLength = <number>_.max(words.map(w => w.length))
          break
      }
      targetLength *= (0.8 + seedRandom.random() * 0.4)
      const lines = this.balanceLines(words, targetLength)

      let textColor = design.palette && design.palette.color || 'black'
      let backgroundColor = 'white'
      if (design.palette && design.palette.invert) {
        [textColor, backgroundColor] = [backgroundColor, textColor]
      }

      const box = new paper.Group()

      const createTextBlock = (s: string, size = this.defaultFontSize) => {
        const pathData = font.getPath(s, 0, 0, size).toPathData(5)
        return new paper.CompoundPath(pathData)
      }
      const layoutItems = lines.map(line => {
        return {
          block: createTextBlock(line),
          line,
        }
      })

      const maxWidth = _.max(layoutItems.map(b => b.block.bounds.width))
      const arrangePathPoints = Math.min(4, Math.round(maxWidth / 2))
      const lineHeight = layoutItems[0].block.bounds.height

      let upper = new paper.Path([
        new paper.Point(0, 0),
        new paper.Point(maxWidth, 0),
      ])
      let lower: paper.Path
      let remaining = layoutItems.length

      for (const layoutItem of layoutItems) {
        if (--remaining <= 0) {
          const mid = upper.bounds.center
          // last lower line is level
          lower = new paper.Path([
            new paper.Point(0, mid.y + lineHeight),
            new paper.Point(maxWidth, mid.y + lineHeight),
          ])
        } else {
          lower = this.randomLowerPathFor(upper, lineHeight,
            arrangePathPoints, seedRandom)
        }
        const stretch = new VerticalBoundsStretchPath(
          layoutItem.block,
          {upper, lower})
        stretch.fillColor = new paper.Color(textColor)
        box.addChild(stretch)
        upper = lower
        lower = null
      }

      if (design.content.source) {
        const sourceBlock = createTextBlock(design.content.source, this.defaultFontSize * 0.33)
        sourceBlock.fillColor = new paper.Color(textColor)
        sourceBlock.translate(
          upper.bounds.bottomLeft.add(
            new paper.Point(
              maxWidth - sourceBlock.bounds.width, // right-align
              sourceBlock.bounds.height * 1.1, // shift height plus top margin
            )))
        if (sourceBlock.bounds.left < 0) {
          // adjust for long source line
          sourceBlock.bounds.left = 0
        }
        box.addChild(sourceBlock)
      }

      const bounds = box.bounds.clone()
      bounds.size = bounds.size.multiply(1 + this.marginFactor)
      bounds.center = box.bounds.center
      const background = new paper.Shape.Rectangle(bounds)
      background.fillColor = new paper.Color(backgroundColor)
      box.insertChild(0, background)

      return box
    })
  }

  private randomLowerPathFor(
    upper: paper.Path,
    avgHeight: number,
    numPoints,
    seedRandom: SeedRandom,
  ): paper.Path {
    const points: paper.Point[] = []
    let upperCenter = upper.bounds.center
    let x = 0
    for (let i = 0; i < numPoints; i++) {
      const y = upperCenter.y + (seedRandom.random() - 0.5) * this.lineHeightVariation * avgHeight
      points.push(new paper.Point(x, y))
      x += upper.bounds.width / (numPoints - 1)
    }
    const path = new paper.Path(points)
    path.smooth()
    path.bounds.center = upper.bounds.center.add(new paper.Point(0, avgHeight))
    return path
  }

  private balanceLines(words: string[], targetLength: number) {
    const lines: string[] = []
    const calcScore = (text: string) =>
      Math.pow(Math.abs(targetLength - text.length), 2)

    let currentLine = null
    let currentScore = 10000

    while (words.length) {
      const word = words.shift()
      const newLine = currentLine + ' ' + word
      const newScore = calcScore(newLine)
      if (currentLine && newScore <= currentScore) {
        // append
        currentLine += ' ' + word
        currentScore = newScore
      } else {
        // new line
        if (currentLine) {
          lines.push(currentLine)
        }
        currentLine = word
        currentScore = calcScore(currentLine)
      }
    }
    lines.push(currentLine)
    return lines
  }

  private createTextEntry(): BuilderControl {
    const mainTextInput = new TextInput()
    const sourceTextInput = new TextInput()
    return {
      createNode: (value: TemplateState) => {
        return h('div',
          [
            h('h3', {}, ['Message']),
            mainTextInput.createNode(
              value && value.design.content && value.design.content.text,
              'What do you want to say?',
              true),
            sourceTextInput.createNode(
              value && value.design.content && value.design.content.source,
              'Source (author, passage, etc)',
              true),
          ])
      },
      value$: merge(
        mainTextInput.value$.pipe(map(t =>
          ({design: {content: {text: t}}}) as TemplateStateChange))
        , sourceTextInput.value$.pipe(map(t =>
          ({design: {content: {source: t}}}) as TemplateStateChange)),
      ),
    }
  }

  private createShapeChooser(context: TemplateUIContext): BuilderControl {
    const value$ = new Subject<TemplateStateChange>()
    return <BuilderControl>{
      createNode: (ts: TemplateState) => {
        const shapes = ['narrow']
        // balanced only available for >= N words
        if (ts.design.content && ts.design.content.text && ts.design.content.text.split(/\s/).length >= 7) {
          shapes.push('balanced')
        }
        shapes.push('wide')
        const choices = shapes.map(shape => <Choice>{
          node: h('span',
            {},
            [shape]),
          chosen: ts.design.shape === shape,
          callback: () => {
            value$.next({design: {shape}})
          },
        })

        const node = h('div',
          [
            h('h3', {}, ['Shape']),
            chooser(choices),
          ])
        return node

      },
      value$: value$.asObservable(),
    }
  }

  private createVariationControl(): BuilderControl {
    const value$ = new Subject<TemplateStateChange>()
    return <BuilderControl>{
      createNode: (ts: TemplateState) => {

        const button = h('button.btn',
          {
            attrs: {
              type: 'button',
            },
            on: {
              click: () => value$.next({design: {seed: Math.random()}}),
            },
          },
          ['Try another variation'],
        )

        const node = h('div',
          [
            h('h3', {}, ['Variation']),
            button,
          ])
        return node

      },
      value$: value$.asObservable(),
    }
  }

  private createPaletteChooser(): BuilderControl {
    const parsedColors = this.paletteColors.map(c => new paper.Color(<any>c))
    const colors = _.sortBy(parsedColors, c => c.hue)
      .map(c => c.toCSS(true))

    const value$ = new Subject<TemplateStateChange>()
    return ({
      createNode: (ts: TemplateState) => {
        const palette = ts.design.palette
        const choices = colors.map(color =>
          <Choice>{
            node: h('div.paletteTile',
              {
                style: {
                  backgroundColor: color,
                },
              }),
            chosen: palette && palette.color === color,
            callback: () => {
              value$.next({design: {palette: {color}}})
            },
          })

        const invertNode = h('div', [
          h('label', [
            h('input',
              {
                props: {
                  type: 'checkbox',
                  checked: palette && palette.invert,
                },
                on: {
                  change: ev => value$.next(
                    {design: {palette: {invert: (ev.target as HTMLInputElement).checked}}},
                  ),
                },
              },
            ),
            'Invert color',
          ]),
        ])

        const node = h('div.colorChooser',
          [
            h('h3', {}, ['Color']),
            chooser(choices),
            invertNode,
          ])
        return node
      },
      value$: value$.asObservable(),
    })
  }
}
