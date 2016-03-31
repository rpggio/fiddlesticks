namespace SketchBuilder {

    export class FontChooser implements ValueControl<FontChooserState> {

        private fontCatalog: FontShape.FontCatalog;
        private _value$ = new Rx.Subject<FontChooserState>();

        maxFamilies = Number.MAX_VALUE;

        constructor(fontCatalog: FontShape.FontCatalog) {
            this.fontCatalog = fontCatalog;
            
            const preloadFamilies = this.fontCatalog.getCategories()
                .map(c => fontCatalog.getFamilies(c)[0]);
            FontShape.FontCatalog.loadPreviewSubsets(preloadFamilies);
        }

        get value$(): Rx.Observable<FontChooserState> {
            return this._value$;
        }

        createNode(value?: FontChooserState): VNode {
            const children: VNode[] = [];

            children.push(h("h3", ["Categories"]));
            const categories = this.fontCatalog.getCategories();
            const categoryChoices = categories.map(category => {
                let categoryFamilies = this.fontCatalog.getFamilies(category);
                if (this.maxFamilies) {
                    categoryFamilies = categoryFamilies.slice(0, this.maxFamilies);
                }
                const firstFamily = categoryFamilies[0];
                return <ControlHelpers.Choice>{
                    node: h("span",
                        {
                            style: FontHelpers.getCssStyle(firstFamily)
                        },
                        [category]),
                    chosen: value.category === category,
                    callback: () => {
                        FontShape.FontCatalog.loadPreviewSubsets(categoryFamilies); 
                        this._value$.onNext({ category, family: firstFamily });
                    }
                }
            });
            children.push(ControlHelpers.chooser(categoryChoices));

            if (value.category) {
                children.push(h("h3", {}, ["Families"]));
                let families = this.fontCatalog.getFamilies(value.category);
                if (this.maxFamilies) {
                    families = families.slice(0, this.maxFamilies);
                }
                const familyOptions = families.map(family => {
                    return <ControlHelpers.Choice>{
                        node: h("span",
                            {
                                style: FontHelpers.getCssStyle(family)
                            },
                            [family]),
                        chosen: value.family === family,
                        callback: () => this._value$.onNext({ family, variant: "" })
                    }
                });
                children.push(ControlHelpers.chooser(familyOptions));
            }
            
            if (value.family) {
                const variants = this.fontCatalog.getVariants(value.family);
                if (variants.length > 1) {
                    children.push(h("h3", {}, ["Variants"]));

                    const variantOptions = variants.map(variant => {
                        return <ControlHelpers.Choice>{
                            node: h("span",
                                {
                                    style: FontHelpers.getCssStyle(value.family, variant)
                                },
                                [variant]),
                            chosen: value.variant === variant,
                            callback: () => this._value$.onNext({ variant })
                        }
                    });
                    children.push(ControlHelpers.chooser(variantOptions));
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