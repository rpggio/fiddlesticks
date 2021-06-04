# Fiddlesticks

Web based typography for word art, logos, and fun.

[comment]: <> (<img src="/fstx sketch - obstacles.png?raw=true" height="400">)

[comment]: <> (## Drawing app)

[comment]: <> (<img src="/fstx-demo.gif?raw=true" height="400">)

[comment]: <> (The drawing app provides a number of features to allow drawing with text.)

[comment]: <> (* Warp text region to match any shape)

[comment]: <> (* Change text font and foreground/background color)

[comment]: <> (* Intuitive drag and zoom movement)

[comment]: <> (* Auto-save to Amazon S3)

[comment]: <> (* Upload tracing image to draw text upon)

[comment]: <> (* Export to SVG or PNG &#40;multiple resolutions&#41;)

[comment]: <> (Both apps are built using Snabbdom &#40;alternative to React DOM&#41; and RxJS state channels inspired by Flux and Redux. The [Store object]&#40;./client/sketchEditor/Store.ts&#41; coordinates state transitions and actions.)

[comment]: <> (## Wavy Words)

<img src="/fstx-builder-demo.gif?raw=true" height="400">

The builder app generates a pre-formatted drawing based on parameters the user provides. The app is designed to support  templates for formatting and user interaction, essentially self-contained tools. 
There is currently just one template implemented, [source here](./packages/wavy-words/src/templates/Dickens.ts).

## Setup

```
cd packages
yarn
cd ../app
yarn
```

## Usage

```
# ./app
yarn start
```
