import { Module } from './Module'
import paper from 'paper'

window.paper = paper

const wavyModule = new Module(
  document.getElementById('builderContainer'),
  document.getElementById('previewCanvas') as HTMLCanvasElement,
  document.getElementById('renderCanvas') as HTMLCanvasElement,
  document.getElementById('belowCanvas'))
wavyModule.start()
