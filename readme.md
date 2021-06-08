# Fiddlesticks

Web based typography for word art, logos, and fun.

<img src="/fstx sketch - obstacles.png?raw=true" height="400">

There are two separate apps which each use the same path-warping capability on font outlines:

## Type Sketcher

<img src="/fstx-demo.gif?raw=true" height="400">

[Type Sketcher](https://rpisryan.github.io/fiddlesticks/type-sketcher/) provides a number of features to allow drawing with text.
* Warp text region to match any shape
* Change text font and foreground/background color
* Intuitive drag and zoom movement
* Upload tracing image to draw text upon
* Export to SVG or PNG

State transitions are done with typed RxJS state channels. The [Store object](./packages/type-sketcher/src/SketchStore.ts) coordinates state transitions and actions.

## Wavy Words

<img src="/fstx-builder-demo.gif?raw=true" height="400">

[Wavy Words](https://rpisryan.github.io/fiddlesticks/wavy-words/) generates a pre-formatted drawing based on parameters the user provides. 

## Usage

To run either of the apps, from the app directory in `packages`:

```
yarn install
yarn start
```
