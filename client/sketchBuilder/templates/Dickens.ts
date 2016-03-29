namespace SketchBuilder.Templates {

    export class Dickens implements SketchBuilder.Template {

        name = "Dickens";
        description: "Stack blocks of text in the form of a crazy ladder.";
        image: string;
        lineHeightVariation = 0.8;

        createUI(context: TemplateUIContext): DesignControl[] {
            return [
                this.createTextEntry(),
                this.createShapeChooser(context),
            ];
        }

        build(design: Design, context: TemplateBuildContext): Promise<paper.Item> {
            if (!design.text) {
                return null;
            }

            return context.getFont(design.font).then(font => {
                const words = design.text.toLocaleUpperCase().split(/\s/);

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

                const blocks = lines.map(l => {
                    const pathData = font.getPath(l, 0, 0, 24).toPathData();
                    return new paper.CompoundPath(pathData);
                });

                const fillColor = (design && design.palette[0]) || "red";
                const maxWidth = _.max(blocks.map(b => b.bounds.width));
                const lineHeight = blocks[0].bounds.height;

                let upper = new paper.Path([
                    new paper.Point(0, 0),
                    new paper.Point(maxWidth, 0)
                ]);
                let lower: paper.Path;
                let remaining = blocks.length;

                for (const block of blocks) {
                    if (--remaining <= 0) {
                        const mid = upper.bounds.center;
                        // last lower line is level
                        lower = new paper.Path([
                            new paper.Point(0, mid.y + lineHeight),
                            new paper.Point(maxWidth, mid.y + lineHeight)
                        ]);
                    } else {
                        lower = this.randomLowerPathFor(upper, lineHeight);
                    }
                    const stretch = new FontShape.VerticalBoundsStretchPath(
                        block, { upper, lower });
                    stretch.fillColor = fillColor;
                    box.addChild(stretch);
                    upper = lower;
                    lower = null;
                }

                return box;
            });
        }

        private randomLowerPathFor(upper: paper.Path, avgHeight: number): paper.Path {
            const points: paper.Point[] = [];
            let upperCenter = upper.bounds.center;
            let x = 0;
            const numPoints = 4;
            for(let i = 0; i < numPoints; i++){
                const y = upperCenter.y + (Math.random() - 0.5) * this.lineHeightVariation * avgHeight;
                points.push(new paper.Point(x, y));
                x += upper.bounds.width / (numPoints - 1);
            }
            const path = new paper.Path(points);
            path.smooth();
            path.bounds.center = upper.bounds.center.add(new paper.Point(0, avgHeight));
            return path;
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

        private createTextEntry() {
            const textInput = new TextInput();
            return {
                createNode: design => {
                    return textInput.createNode(design.text, "What do you want to say?");
                },
                output$: textInput.value$.map(v => {
                    return <Design>{ text: v };
                })
            }
        }

        private createShapeChooser(context: TemplateUIContext): DesignControl {
            const createChoice = (shape: string) =>
                h("div",
                    {
                        key: shape
                    },
                    [shape]);
            var chooser = new Chooser();
            return {
                createNode: design => {
                    const choices = ["narrow", "wide"].map(createChoice);
                    const chooserNode = chooser.createNode(choices, design.shape);
                    return chooserNode;
                },
                output$: chooser.chosen$.map(choice => {
                    return <Design>{ shape: choice.key };
                })
            }
        }
    }

}