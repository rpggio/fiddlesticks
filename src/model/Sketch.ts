
class Sketch {

    attr: SketchAttr = { 
    };

    textBlocks: TextBlock[] = [];

    editingItem: PositionedItem;

    constructor() {
    }

    getBlock(id){
        return _.find(this.textBlocks, t => t._id === id);
    }

}

interface SketchAttr {

    backgroundColor?: string;

}