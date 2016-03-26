namespace SketchBuilder.Templates {

    export class Dickens implements SketchBuilder.Template {

        name = "Dickens";
        description: "Stack blocks of text in the form of a crazy ladder.";
        image: string;

        createControls(design: Design, context: TemplateContext): SketchBuilder.VControl[] {
            const choices: SketchBuilder.Controls.ImageChoice[] = [
                {
                    value: "narrow",
                    label: "narrow",
                    loadImage: el => {
                        // allow choice image to be rendered
                        context.renderDesign(design, dataUrl => el.src = dataUrl)
                    }
                }
            ]
            return [
                h("div", {}, ["Dickens template!"]),
                SketchBuilder.Controls.imageChooser({
                    choices,
                    on: {
                        choice: o => console.warn("chose", o)
                    }
                })
            ];
        }

        build(design: Design): paper.Item {
            return new paper.PointText({
                content: "Dickens!",
                fillColor: "green",
                point: new paper.Point(50, 50)
            });
        }
    }

}