
class AppController {

    constructor(
        channels: Channels, 
        store: Store, 
        sketchEditor: SketchEditor,
        selectedItemEditor: SelectedItemEditor,
        designerController: DesignerController) {

        const actions = channels.actions, events = channels.events;

actions.subscribe(x => console.log(x));
events.subscribe(x => console.log(x));

    }

}