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
            return new paper.PointText({
                content: `Dickens ${design && design.shape}`,
                fillColor: "green",
                point: new paper.Point(50, 50)
            });
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