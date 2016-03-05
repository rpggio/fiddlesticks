
type ItemChangeHandler = (flags: PaperNotify.ChangeFlag) => void;
type Callback = () => void;

declare module paper {
    interface Item {
        
        /**
         * Observe all changes in item. Returns un-observe function.
         */
        observe(handler: ItemChangeHandler): Callback;
        
        _changed(flags: PaperNotify.ChangeFlag): void;
    }
}

namespace PaperNotify {

    export enum ChangeFlag {
        // Anything affecting the appearance of an item, including GEOMETRY,
        // STROKE, STYLE and ATTRIBUTE (except for the invisible ones: locked, name)
        APPEARANCE = 0x1,
        // A change in the item's children
        CHILDREN = 0x2,
        // A change of the item's place in the scene graph (removed, inserted,
        // moved).
        INSERTION = 0x4,
        // Item geometry (path, bounds)
        GEOMETRY = 0x8,
        // Only segment(s) have changed, and affected curves have already been
        // notified. This is to implement an optimization in _changed() calls.
        SEGMENTS = 0x10,
        // Stroke geometry (excluding color)
        STROKE = 0x20,
        // Fill style or stroke color / dash
        STYLE = 0x40,
        // Item attributes: visible, blendMode, locked, name, opacity, clipMask ...
        ATTRIBUTE = 0x80,
        // Text content
        CONTENT = 0x100,
        // Raster pixels
        PIXELS = 0x200,
        // Clipping in one of the child items
        CLIPPING = 0x400,
        // The view has been transformed
        VIEW = 0x800
    }

    // Shortcuts to often used ChangeFlag values including APPEARANCE
    export enum Changes {
        // CHILDREN also changes GEOMETRY, since removing children from groups
        // changes bounds.
        CHILDREN = ChangeFlag.CHILDREN | ChangeFlag.GEOMETRY | ChangeFlag.APPEARANCE,
        // Changing the insertion can change the appearance through parent's matrix.
        INSERTION = ChangeFlag.INSERTION | ChangeFlag.APPEARANCE,
        GEOMETRY = ChangeFlag.GEOMETRY | ChangeFlag.APPEARANCE,
        SEGMENTS = ChangeFlag.SEGMENTS | ChangeFlag.GEOMETRY | ChangeFlag.APPEARANCE,
        STROKE = ChangeFlag.STROKE | ChangeFlag.STYLE | ChangeFlag.APPEARANCE,
        STYLE = ChangeFlag.STYLE | ChangeFlag.APPEARANCE,
        ATTRIBUTE = ChangeFlag.ATTRIBUTE | ChangeFlag.APPEARANCE,
        CONTENT = ChangeFlag.CONTENT | ChangeFlag.GEOMETRY | ChangeFlag.APPEARANCE,
        PIXELS = ChangeFlag.PIXELS | ChangeFlag.APPEARANCE,
        VIEW = ChangeFlag.VIEW | ChangeFlag.APPEARANCE
    };

    export function initialize() {
        
        // Inject Item.observe
        const itemProto = (<any>paper).Item.prototype;
        itemProto.observe = function(handler: ItemChangeHandler): Callback {
            if (!this._observers) {
                this._observers = [];
            }
            if (this._observers.indexOf(handler) < 0) {
                this._observers.push(handler);
            }
            return () => {
                let index = this._observers.indexOf(handler, 0);
                if (index > -1) {
                    this._observers.splice(index, 1);
                }
            }
        }

        // Wrap Item.remove
        const itemRemove = itemProto.remove;
        itemProto.remove = function() {
            itemRemove.apply(this, arguments);
            this._observers = null;
        }

        // Wrap Project._changed
        const projectProto = <any>paper.Project.prototype;
        const projectChanged = projectProto._changed;
        projectProto._changed = function(flags: ChangeFlag, item: paper.Item) {
            projectChanged.apply(this, arguments);
            if (item) {
                const subs = (<any>item)._observers;
                if (subs) {
                    for (let s of subs) {
                        s.call(item, flags);
                    }
                }
            }
        }
    }

    export function describe(flags: ChangeFlag) {
        let flagList: string[] = [];
        _.forOwn(ChangeFlag, (value, key) => {
            if ((typeof value) === "number" && (value & flags)) {
                flagList.push(key);
            }
        });
        return flagList.join(' | ');
    }

}

PaperNotify.initialize();
