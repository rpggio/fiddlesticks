namespace SketchBuilder {

    export class FontChooser implements ValueControl<FontChooserState> {

        private store: Store;
        private categoryChooser: Chooser<string>;
        private familyChooser: Chooser<string>;
        private variantChooser: Chooser<string>;

        maxChoices = Number.MAX_VALUE;

        constructor(store: Store) {
            this.store = store;
            const stringAsDiv = (s: string) => h("div", {}, [s]);
            this.categoryChooser = new Chooser<string>(stringAsDiv);
            this.familyChooser = new Chooser<string>(stringAsDiv);
            this.variantChooser = new Chooser<string>(stringAsDiv);
        }

        get value$(): Rx.Observable<FontChooserState> {
            return Rx.Observable.combineLatest(
                this.categoryChooser.value$.startWith(null),
                this.familyChooser.value$.startWith(null),
                this.variantChooser.value$.startWith(null),
                (category, family, variant) => {
                    return { category, family, variant };
                }).skip(1);
        }

        createNode(value?: FontChooserState): VNode {
            const children: VNode[] = [];
            children.push(h("h3", {}, ["Categories"]));
            children.push(
                this.categoryChooser.createNode(
                    this.store.fontCatalog.getCategories(),
                    value.category
                )
            );
            if (value.category) {
                const families = this.store.fontCatalog.getFamilies(value.category);
                if (this.maxChoices) {
                    families.length = this.maxChoices;
                }
                children.push(h("h3", {}, ["Families"]));
                children.push(
                    this.familyChooser.createNode(
                        families,
                        value.family
                    )
                );
            }
            if (value.family) {
                const variants = this.store.fontCatalog.getVariants(value.family);
                if (variants.length > 1) {
                    children.push(h("h3", {}, ["Variants"]));
                    children.push(
                        this.variantChooser.createNode(
                            variants,
                            value.variant
                        )
                    );
                }
            }
            return h("div.fontChooser", {}, children);
        }
    }

    export interface FontChooserState {
        category?: string;
        family?: string;
        variant?: string;
    }

}