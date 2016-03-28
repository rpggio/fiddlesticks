namespace Demo {

    export class DemoModule {

        constructor(canvas: HTMLCanvasElement) {

            paper.setup(canvas);

        }

        start() {
            const view = paper.view;

            const parsedFonts = new FontShape.ParsedFonts(() => { });
            parsedFonts.get("fonts/Roboto-500.ttf").then( parsed => {

                 const pathData = parsed.font.getPath("SNAP", 0, 0, 128).toPathData();
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
                
            });

        }
       
    }

}