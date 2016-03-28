namespace SketchBuilder.Templates {

    export class Dickens implements SketchBuilder.Template {

        name = "Dickens";
        description: "Stack blocks of text in the form of a crazy ladder.";
        image: string;

        createUI(context: TemplateUIContext): DesignControl[] {
            return [
                this.createShapeChooser(context)
            ];
        }

        build(design: Design, context: TemplateBuildContext): Promise<paper.Item> {
            return context.getFont(design.font).then(font => {
                const words = "The rain in Spain falls mainly in the drain".split(/\s/);

                let lines: string[];
                switch (design.shape) {
                    case "narrow":
                        lines = this.splitWordsNarrow(words);
                        break;
                    case "wide":
                        lines = this.splitWordsWide(words);
                        break;
                    default:
                        lines = this.splitWordsNarrow(words);
                        break;
                }

                const box = new paper.Group();

                const fontStyle = { fillColor: "green" };

                const blocks = lines.map(l => {
                    const pathData = font.getPath(l, 0, 0, 24).toPathData();
                    return new paper.CompoundPath(pathData);
                });

                const maxWidth = _.max(blocks.map(b => b.bounds.width));

                let position = new paper.Point(0, 0);
                for (const block of blocks) {
                    const stretch = new FontShape.VerticalBoundsStretchPath(block);
                    stretch.position = position;
                    box.addChild(stretch);
                    position = position.add(new paper.Point(0, block.bounds.height + 3));
                }

                return box;
            });
        }

        private splitWordsNarrow(words: string[]): string[] {
            const lines: string[] = [];
            const ideal = _.max(words.map(w => w.length));
            const calcScore = (text: string) =>
                Math.pow(Math.abs(ideal - text.length), 2);

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

        private splitWordsWide(words: string[]) {
            const targetLength = _.sum(words.map(w => w.length + 1)) / 2;
            const firstLine = words;
            const secondLine = [];
            let secondLineLength = 0;
            while (secondLineLength < targetLength) {
                const word = words.pop();
                secondLine.unshift(word);
                secondLineLength += word.length + 1;
            }
            return [
                firstLine.join(" "),
                secondLine.join(" ")
            ];
        }

        private createShapeChooser(context: TemplateUIContext): DesignControl {
            var imageChooser = new ImageChooser();
            const createChoices = (design: Design) => {
                return [
                    {
                        value: "narrow",
                        label: "narrow",
                        loadImage: el => {
                            context.renderDesign(
                                { shape: "narow" },
                                dataUrl => el.src = dataUrl)
                        }
                    },
                    {
                        value: "wide",
                        label: "wide",
                        loadImage: el => {
                            context.renderDesign(
                                { shape: "wide" },
                                dataUrl => el.src = dataUrl)
                        }
                    }
                ]
            };

            return {
                createNode: design => {
                    const choices = createChoices(design);
                    // const chosen = _.find(choices, c => design.shape === c.value);
                    return imageChooser.createNode(
                        { choices, chosen: design.shape }
                    );
                },
                output$: imageChooser.chosen$.map(choice => {
                    return <Design>{ shape: choice.value };
                })
            }
        }
    }

}