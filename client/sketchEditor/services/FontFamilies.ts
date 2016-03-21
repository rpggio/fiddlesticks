namespace SketchEditor {

    export class FontFamilies {

        static CATALOG_LIMIT = 250;

        public catalog: FontFamily[] = [];

        get(family: string) {
            return _.find(this.catalog, ff => ff.family === family);
        }

        getUrl(family: string, variant: string) {
            const famDef = this.get(family);
            if (!famDef) {
                console.warn("no definition available for family", family);
                return null;
            }
            let file = famDef.files[variant];
            if (!file) {
                console.warn("no font file available for variant", family, variant);
                file = famDef.files[0];
            }
            return file;
        }

        defaultVariant(famDef: FontFamily): string {
            if (!famDef) return null;
            if (famDef.variants.indexOf("regular") >= 0) {
                return "regular";
            }
            return famDef.variants[0];
        }

        loadCatalogLocal(callback: (families: FontFamily[]) => void) {
            $.ajax({
                url: "fonts/google-fonts.json",
                dataType: 'json',
                cache: true,
                success: (response: { kind: string, items: FontFamily[] }) => {

                    const filteredItems = response.items.slice(0, FontFamilies.CATALOG_LIMIT);

                    // make files htts
                    for (const fam of filteredItems) {
                        _.forOwn(fam.files, (val: string, key: string) => {
                            if (_.startsWith(val, "http:")) {
                                fam.files[key] = val.replace("http:", "https:");
                            }
                        });
                    }

                    this.catalog = filteredItems;
                    callback(this.catalog);
                },
                error: (xhr, status, err) => {
                    console.error("google-fonts.json", status, err.toString());
                }
            });
        }

        // loadCatalogRemote(callback: (families: FontFamily[]) => void) {
        //     var url = 'https://www.googleapis.com/webfonts/v1/webfonts?';
        //     var key = 'key=GOOGLE-API-KEY';
        //     var sort = "popularity";
        //     var opt = 'sort=' + sort + '&';
        //     var req = url + opt + key;

        //     $.ajax({
        //         url: req,
        //         dataType: 'json',
        //         cache: true,
        //         success: (response: { kind: string, items: FontFamily[] }) => {
        //             callback(response.items);
        //         },
        //         error: (xhr, status, err) => {
        //             console.error(url, status, err.toString());
        //         }
        //     });
        // }

        /**
         * For a list of families, load alphanumeric chars into browser
         *   to support previewing.
         */
        loadPreviewSubsets(families: string[]) {
            for (const chunk of _.chunk(families, 10)) {
                WebFont.load({
                    classes: false,
                    google: {
                        families: <string[]>chunk,
                        text: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                    }
                });
            }
        }
    }

}