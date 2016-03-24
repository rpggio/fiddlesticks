namespace Demo {

    export class DemoModule {

        constructor(canvas: HTMLCanvasElement) {

            paper.setup(canvas);

        }

        start() {
            const view = paper.view;

            const parsedFonts = new SketchEditor.ParsedFonts(() => { });
            parsedFonts.get("fonts/Roboto-500.ttf", (url, font) => {

                 const pathData = font.getPath("SNAP", 0, 0, 128).toPathData();
                 const content = new paper.CompoundPath(pathData);
                 content.position = content.position.add(50);
                 content.fillColor = "lightgray";

                const region = paper.Path.Ellipse(new paper.Rectangle(
                    new paper.Point(0,0),
                    new paper.Size(600, 300)
                ));
                region.rotate(30);
                
                region.bounds.center = view.center;
                region.strokeColor = "lightgray";
                region.strokeWidth = 3;

                const snapPath = new FontShape.SnapPath(region, content);
                snapPath.corners = [0, 0.4, 0.45, 0.95];
                
                view.onFrame = () => {
                    snapPath.slide(0.001);
                    snapPath.updatePath();
                }
                
                view.draw();
                
                this.runTest();
            });

        }
        
        runTest() {
                       
            const box = new paper.Path({
                segments: [
                    new paper.Point(0,0),
                    new paper.Point(10,0),
                    new paper.Point(10,10),
                    new paper.Point(0,10)
                ],
                closed: true
            });
            
            const section = new FontShape.PathSection(box, 0.1, 0.1);
            this.assertEqual(4, section.length);
            this.assertPointEqual(new paper.Point(4, 0), section.getPointAt(0));
            this.assertPointEqual(new paper.Point(8, 0), section.getPointAt(4));
                
            const sectionOverStart = new FontShape.PathSection(box, 0.9, 0.2);
            this.assertEqual(8, sectionOverStart.length);
            this.assertPointEqual(new paper.Point(0, 4), sectionOverStart.getPointAt(0));
            this.assertPointEqual(new paper.Point(4, 0), sectionOverStart.getPointAt(8));
            
        }
        
        assertPointEqual(expected: paper.Point, actual: paper.Point){
            if (expected.subtract(actual).length > 0.0001){
                console.error(`expected ${expected}, was ${actual}`);
            }
        }

        assertEqual(expected: number, actual: number){
            if (Math.abs(expected - actual) > 0.0001){
                console.error(`expected ${expected}, was ${actual}`);
            }
        }

    }

}