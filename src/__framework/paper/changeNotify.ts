
// declare module paper {

//     interface Item {

//         subscribe(handler: ItemChangeHandler): Callback;
        
//         //_changed: (flags: IChangeFlag) => void;
//         //_subscribers: ItemChangeHandler[];
//         //changeEvent: PropertyEvent<IChangeFlag>;
//     }
    
//     interface Project {
//         subscribe(handler: ItemChangeHandler): Callback;
//     }

// }

// type ItemChangeHandler = (flags: paper.IChangeFlag) => void;
// type Callback = () => void;



// let itemProto = <any>paper.Item.prototype;
// //itemProto._subscribers = [];
// itemProto.subscribe = function(handler: ItemChangeHandler): Callback {
//     if (!this._subscribers) {
//         this._subscribers = [];
//     }
//     if (this._subscribers.indexOf(handler) < 0) {
//         this._subscribers.push(handler);
//     }
//     return () => {
//         let index = this._subscribers.indexOf(handler, 0);
//         if (index > -1) {
//             this._subscribers.splice(index, 1);
//         }
//     }
// }
// let itemChanged = itemProto._changed;
// console.warn('itemProto._changed', (<any>paper.Item.prototype)._changed);
// itemProto._changed = function(flags: paper.IChangeFlag) {
//     itemChanged.apply(this, arguments); 
//     console.log('subs', this._subscribers, this);
//     if (this._subscribers) {
//         for (let sub of this._subscribers) {
//             sub.apply(this, arguments);
//         }
//     }
// }
// console.warn('itemProto._changed', (<any>paper.Item.prototype)._changed);


