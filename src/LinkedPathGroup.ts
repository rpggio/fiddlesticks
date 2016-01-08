// <reference path="typings/paper.d.ts" />


class LinkedPathGroup extends paper.Group {
    
    addChild(path: paper.Path): paper.Item {
        return super.addChild(path);
    }
    
    getLength(): number {
        return this.children.reduce((a, b: paper.Path) => a + b.length, 0);
    }
    
}