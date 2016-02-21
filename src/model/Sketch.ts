
class Sketch {

    attr: SketchAttr = { 
        backgroundColor: '#f6f1e3'
    };

    textBlocks: TextBlock[] = [];

    constructor() {
    }

}

interface SketchAttr {

    backgroundColor?: string;

}