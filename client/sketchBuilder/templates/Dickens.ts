namespace SketchBuilder.Templates {

    export class Dickens implements SketchBuilder.Template {

        name = "Dickens";
        description: "Stack blocks of text in the form of a crazy ladder.";
        image: string;

        createControls(context: TemplateContext): DesignControl[] {
            return [
                this.createShapeChooser(context)
            ];
        }

        build(design: Design): paper.Item {
            const words = "The rain in Spain falls mainly in the drain".split(/\s/);
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

            const box = new paper.Group();

            let position = new paper.Point(0, 0);
            for (const line of lines) {
                const text = new paper.PointText({
                        content: line,
                        fillColor: "green",
                        position: position 
                    });
                box.addChild(text);
                position = position.add(new paper.Point(0, text.bounds.height + 3));
            }

            return box;
        }

        private createShapeChooser(context: TemplateContext): DesignControl {
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