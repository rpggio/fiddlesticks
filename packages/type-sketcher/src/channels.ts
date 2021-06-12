import paper from 'paper'
import { ImageExportOptions, PositionedObjectRef, Sketch, SketchAttr, TextBlock, WorkspaceObjectRef } from './models'
import { Channel } from 'fstx-common'

export class SketchActions extends Channel {

  editor = {
    initWorkspace: this.topic<void>('designer.initWorkspace'),
    loadFont: this.topic<string>('designer.loadFont'),
    zoomToFit: this.topic<void>('designer.zoomToFit'),
    exportingImage: this.topic<void>('designer.exportImage'),
    exportPNG: this.topic<ImageExportOptions>('designer.exportPNG'),
    exportSVG: this.topic<void>('designer.exportSVG'),
    viewChanged: this.topic<paper.Rectangle>('designer.viewChanged'),
    updateSnapshot: this.topic<{ sketchId: string, pngDataUrl: string }>('designer.updateSnapshot'),
    toggleHelp: this.topic<void>('designer.toggleHelp'),
    openSample: this.topic<void>('designer.openSample'),
  }

  sketch = {
    create: this.topic<SketchAttr>('sketch.create'),
    clear: this.topic<void>('sketch.clear'),
    clone: this.topic<SketchAttr>('sketch.clone'),
    attrUpdate: this.topic<SketchAttr>('sketch.attrUpdate'),
    setSelection: this.topic<WorkspaceObjectRef>('sketch.setSelection'),
  }

  textBlock = {
    add: this.topic<TextBlock>('textBlock.add'),
    updateAttr: this.topic<TextBlock>('textBlock.updateAttr'),
    updateArrange: this.topic<TextBlock>('textBlock.updateArrange'),
    remove: this.topic<TextBlock>('textBlock.remove'),
  }

}

export class SketchEvents extends Channel {

  editor = {
    resourcesReady: this.topic<boolean>('app.resourcesReady'),
    workspaceInitialized: this.topic<void>('app.workspaceInitialized'),
    fontLoaded: this.topic<opentypejs.Font>('app.fontLoaded'),
    zoomToFitRequested: this.topic<void>('designer.zoomToFitRequested'),
    exportPNGRequested: this.topic<ImageExportOptions>('designer.exportPNGRequested'),
    exportSVGRequested: this.topic<void>('designer.exportSVGRequested'),
    viewChanged: this.topic<paper.Rectangle>('designer.viewChanged'),
    snapshotExpired: this.topic<Sketch>('designer.snapshotExpired'),
    userMessageChanged: this.topic<string>('designer.userMessageChanged'),
    showHelpChanged: this.topic<boolean>('designer.showHelpChanged'),
  }

  sketch = {
    loaded: this.topic<Sketch>('sketch.loaded'),
    attrChanged: this.topic<Sketch>('sketch.attrChanged'),
    contentChanged: this.topic<Sketch>('sketch.contentChanged'),
    editingItemChanged: this.topic<PositionedObjectRef>('sketch.editingItemChanged'),
    selectionChanged: this.topic<WorkspaceObjectRef>('sketch.selectionChanged'),
    saveLocalRequested: this.topic<void>('sketch.savelocal.saveLocalRequested'),
    cloned: this.topic<Sketch>('sketch.cloned'),
    imageUploaded: this.topic<string>('sketch.imageUploaded'),
  }

  textblock = {
    added: this.topic<TextBlock>('textblock.added'),
    attrChanged: this.topic<TextBlock>('textblock.attrChanged'),
    fontReady: this.topic<{ textBlockId: string, font: opentypejs.Font }>('textblock.fontReady'),
    arrangeChanged: this.topic<TextBlock>('textblock.arrangeChanged'),
    removed: this.topic<TextBlock>('textblock.removed'),
    loaded: this.topic<TextBlock>('textblock.loaded'),
    editorClosed: this.topic<TextBlock>('textblock.editorClosed'),
  }

}

export class Channels {
  actions: SketchActions = new SketchActions()
  events: SketchEvents = new SketchEvents()
}
