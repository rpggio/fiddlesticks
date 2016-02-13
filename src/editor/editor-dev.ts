
// let tBEditorTest = function() {

//     let tbSource = new Rx.Subject<TextBlockAttr>();

//     let i = 1;
//     window.setInterval(() => {
//         tbSource.onNext({ text: (i++).toString() });
//     }, 1000);

//     let editor = new TextBlockAttributeEditor(
//         document.getElementById('textblock-editor'),
//         tbSource);
//     editor.change$.subscribe(tb => console.log(JSON.stringify(tb)));

// }

// tBEditorTest();