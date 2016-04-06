namespace SketchEditor {

    export class UploadImage implements Operation {

        store: Store;
        onClose: () => void;

        constructor(store: Store) {
            this.store = store;
        }

        render(): VNode {
            return h("div",
                [
                    h("h3", ["Upload image"]),
                    h("input",
                        {
                            attrs: {
                                type: "file"
                            },
                            on: {
                                change: ev => {
                                    var file = (<HTMLInputElement>ev.target).files[0];
                                    this.upload(file);
                                }
                            }
                        }
                    )
                ]);
        }

        private upload(file) {
            var img = new Image();
            var url = window.URL || window.webkitURL;
            var src = url.createObjectURL(file);
            this.store.imageUploaded(src);
            this.onClose && this.onClose();
        }
    }

}