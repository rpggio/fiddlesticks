namespace FontShape {

    export class FontCatalog {

        static fromLocal(path: string): JQueryPromise<FontCatalog> {
            return $.ajax({
                url: path,
                dataType: 'json',
                cache: true
            })
                .then((response: { kind: string, items: FamilyRecord[] }) => {
                    return new FontCatalog(response.items);
                },
                err => console.error(path, status, err.toString())
                );
        }

        static fromRemote(): JQueryPromise<FontCatalog> {
            var url = 'https://www.googleapis.com/webfonts/v1/webfonts?';
            var key = 'key=GOOGLE-API-KEY';
            var sort = "popularity";
            var opt = 'sort=' + sort + '&';
            var req = url + opt + key;

            return $.ajax({
                url: req,
                dataType: 'json',
                cache: true
            })
                .then((response: { kind: string, items: FamilyRecord[] }) => {
                    return new FontCatalog(response.items);
                },
                err => console.error(req, status, err.toString())
                );
        }

        private records: FamilyRecord[];

        constructor(data: FamilyRecord[]) {
            // make files https
            for (const record of data) {
                _.forOwn(record.files, (val: string, key: string) => {
                    if (_.startsWith(val, "http:")) {
                        record.files[key] = val.replace("http:", "https:");
                    }
                });
            }

            this.records = data;
        }

        getList(limit?: number) {
            return !!limit
                ? this.records.slice(0, limit)
                : this.records;
        }

        getCategories(): string[] {
            return _.uniq(this.records.map(f => f.category));
        }

        getFamilies(category?: string): string[] {
            if (!category) {
                return this.records.map(f => f.family);
            }
            return this.records
                .filter(f => f.category === category)
                .map(f => f.family);
        }

        getVariants(family: string): string[] {
            const fam = this.getRecord(family);
            return fam && fam.variants || [];
        }

        getRecord(family: string): FamilyRecord {
            return _.find(this.records, ff => ff.family === family);
        }

        getUrl(family: string, variant?: string): string {
            const record = this.getRecord(family);
            if (!record) {
                console.warn("no definition available for family", family);
                return null;
            }
            if(!variant){
                variant = FontCatalog.defaultVariant(record);
            }
            let file = record.files[variant];
            if (!file) {
                console.warn("no font file available for variant", family, variant);
                file = record.files[0];
            }
            return file;
        }

        static defaultVariant(record: FamilyRecord): string {
            if (!record) return null;
            if (record.variants.indexOf("regular") >= 0) {
                return "regular";
            }
            return record.variants[0];
        }

        /**
         * For a list of families, load alphanumeric chars into browser
         *   to support previewing.
         */
        static loadPreviewSubsets(families: string[]) {
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