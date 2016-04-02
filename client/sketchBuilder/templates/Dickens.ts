namespace SketchBuilder.Templates {

    export class Dickens implements SketchBuilder.Template {

        name = "Dickens";
        description: "Stack blocks of text in the form of a wavy ladder.";
        image: string;
        lineHeightVariation = 0.8;
        defaultFontSize = 128;

        createNew(context: TemplateUIContext): TemplateState {
            const defaultFontRecord = context.fontCatalog.getList(1)[0];
            return <TemplateState>{
                design: {
                    shape: "narrow",
                    font: {
                        family: defaultFontRecord.family
                    },
                    seed: Math.random()
                },
                fontCategory: defaultFontRecord.category
            }
        }

        createUI(context: TemplateUIContext): BuilderControl[] {
            return [
                this.createTextEntry(),
                this.createShapeChooser(context),
                this.createVariationControl(),
                context.createFontChooser(),
                this.createPaletteChooser()
            ];
        }

        build(design: Design, context: TemplateBuildContext): Promise<paper.Item> {
            if (!design.text) {
                return Promise.resolve(null);
            }

            return context.getFont(design.font).then(font => {
                const words = design.text.toLocaleUpperCase().split(/\s/);

                let lines: string[];
                switch (design.shape) {
                    case "narrow":
                        lines = this.splitWordsNarrow(words);
                        break;
                    case "balanced":
                        lines = this.splitWordsBalanced(words);
                        break;
                    case "wide":
                        lines = this.splitWordsWide(words);
                        break;
                    default:
                        lines = this.splitWordsNarrow(words);
                        break;
                }

                let textColor = design.palette && design.palette.color || "black";
                let backgroundColor = "white";
                if (design.palette && design.palette.invert) {
                    [textColor, backgroundColor] = [backgroundColor, textColor];
                }

                const box = new paper.Group();

                const blocks = lines.map(l => {
                    const pathData = font.getPath(l, 0, 0, this.defaultFontSize).toPathData();
                    return new paper.CompoundPath(pathData);
                });

                const maxWidth = _.max(blocks.map(b => b.bounds.width));
                const lineHeight = blocks[0].bounds.height;

                let upper = new paper.Path([
                    new paper.Point(0, 0),
                    new paper.Point(maxWidth, 0)
                ]);
                let lower: paper.Path;
                let remaining = blocks.length;

                const seedRandom = new Framework.SeedRandom(
                    design.seed == null ? Math.random() : design.seed);
                for (const block of blocks) {
                    if (--remaining <= 0) {
                        const mid = upper.bounds.center;
                        // last lower line is level
                        lower = new paper.Path([
                            new paper.Point(0, mid.y + lineHeight),
                            new paper.Point(maxWidth, mid.y + lineHeight)
                        ]);
                    } else {
                        lower = this.randomLowerPathFor(upper, lineHeight, seedRandom);
                    }
                    const stretch = new FontShape.VerticalBoundsStretchPath(
                        block, { upper, lower });
                    stretch.fillColor = textColor;
                    box.addChild(stretch);
                    upper = lower;
                    lower = null;
                }

                const bounds = box.bounds.clone();
                bounds.size = bounds.size.multiply(1.1);
                bounds.center = box.bounds.center;
                const background = paper.Shape.Rectangle(bounds);
                background.fillColor = backgroundColor;
                box.insertChild(0, background);

                return box;
            });
        }

        private randomLowerPathFor(upper: paper.Path, avgHeight: number, seedRandom: Framework.SeedRandom): paper.Path {
            const points: paper.Point[] = [];
            let upperCenter = upper.bounds.center;
            let x = 0;
            const numPoints = 4;
            for (let i = 0; i < numPoints; i++) {
                const y = upperCenter.y + (seedRandom.random() - 0.5) * this.lineHeightVariation * avgHeight;
                points.push(new paper.Point(x, y));
                x += upper.bounds.width / (numPoints - 1);
            }
            const path = new paper.Path(points);
            path.smooth();
            path.bounds.center = upper.bounds.center.add(new paper.Point(0, avgHeight));
            return path;
        }

        private splitWordsNarrow(words: string[]): string[] {
            const targetLength = _.max(words.map(w => w.length));
            return this.balanceLines(words, targetLength);
        }

        private splitWordsBalanced(words: string[]) {
            const targetLength = 2 * Math.sqrt(_.sum(words.map(w => w.length + 1)));
            return this.balanceLines(words, targetLength);
        }

        private splitWordsWide(words: string[]) {
            const numLines = 3;
            const targetLength = _.sum(words.map(w => w.length + 1)) / numLines;
            return this.balanceLines(words, targetLength);
        }

        private balanceLines(words: string[], targetLength: number) {
            const lines: string[] = [];
            const calcScore = (text: string) =>
                Math.pow(Math.abs(targetLength - text.length), 2);

            let currentLine = null;
            let currentScore = 10000;

            while (words.length) {
                const word = words.shift();
                const newLine = currentLine + " " + word;
                const newScore = calcScore(newLine);
                if (currentLine && newScore <= currentScore) {
                    // append
                    currentLine += " " + word;
                    currentScore = newScore;
                } else {
                    // new line
                    if (currentLine) {
                        lines.push(currentLine);
                    }
                    currentLine = word;
                    currentScore = calcScore(currentLine);
                }
            }
            lines.push(currentLine);
            return lines;
        }

        private createTextEntry(): BuilderControl {
            const textInput = new TextInput();
            return {
                createNode: (value: TemplateState) => {
                    return h("div",
                        [
                            h("h3", {}, ["Message"]),
                            textInput.createNode(
                                value && value.design.text,
                                "What do you want to say?",
                                true)
                        ]);
                },
                value$: textInput.value$.map(v => {
                    return <TemplateStateChange>{ design: { text: v } };
                })
            }
        }

        private createShapeChooser(context: TemplateUIContext): BuilderControl {
            const value$ = new Rx.Subject<TemplateStateChange>();
            return <BuilderControl>{
                createNode: (ts: TemplateState) => {
                    const shapes = ["narrow"];
                    // balanced only available for >= N words
                    if(ts.design.text.split(/\s/).length >= 7){
                        shapes.push("balanced");
                    }
                    shapes.push("wide");
                    const choices = shapes.map(shape => <ControlHelpers.Choice>{
                        node: h("span",
                            {},
                            [shape]),
                        chosen: ts.design.shape === shape,
                        callback: () => {
                            value$.onNext({ design: { shape } });
                        }
                    });

                    const node = h("div",
                        [
                            h("h3", {}, ["Shape"]),
                            ControlHelpers.chooser(choices)
                        ]);
                    return node;

                },
                value$: value$.asObservable()
            };
        }

        private createVariationControl(): BuilderControl {
            const value$ = new Rx.Subject<TemplateStateChange>();
            return <BuilderControl>{
                createNode: (ts: TemplateState) => {

                    const button = h("button.btn",
                        {
                            attrs: {
                                type: "button"
                            },
                            on: {
                                click: () => value$.onNext({ design: { seed: Math.random() } })
                            }
                        },
                        ["Next"]
                    );

                    const node = h("div",
                        [
                            h("h3", {}, ["Variation"]),
                            button
                        ]);
                    return node;

                },
                value$: value$.asObservable()
            };
        }

        private createPaletteChooser(): BuilderControl {
            const parsedColors = this.paletteColors.map(c => new paper.Color(c));
            const colors = _.sortBy(parsedColors, c => c.hue)
                .map(c => c.toCSS(true));

            const value$ = new Rx.Subject<TemplateStateChange>();
            return <BuilderControl>{
                createNode: (ts: TemplateState) => {
                    const palette = ts.design.palette;
                    const choices = colors.map(color =>
                        <ControlHelpers.Choice>{
                            node: h("div.paletteTile",
                                {
                                    style: {
                                        backgroundColor: color
                                    }
                                }),
                            chosen: palette && palette.color === color,
                            callback: () => {
                                value$.onNext({ design: { palette: { color } } });
                            }
                        });

                    const invertNode = h("div", [
                        h("label", [
                            h("input",
                                {
                                    attrs: {
                                        type: "checkbox",
                                        checked: palette && palette.invert
                                    },
                                    on: {
                                        change: ev => value$.onNext({ design: { palette: { invert: ev.target.checked } } })
                                    }
                                }
                            ),
                            "Invert color"
                        ])
                    ]);

                    const node = h("div.colorChooser",
                        [
                            h("h3", {}, ["Color"]),
                            ControlHelpers.chooser(choices),
                            invertNode
                        ]);
                    return node;

                },
                value$: value$.asObservable()
            };

        }

        paletteColors = [
            "#4b3832",
            "#854442",
            //"#fff4e6",
            "#3c2f2f",
            "#be9b7b",

            "#1b85b8",
            "#5a5255",
            "#559e83",
            "#ae5a41",
            "#c3cb71",

            "#0e1a40",
            "#222f5b",
            "#5d5d5d",
            "#946b2d",
            "#000000",

            "#edc951",
            "#eb6841",
            "#cc2a36",
            "#4f372d",
            "#00a0b0",
        ];

    }

}