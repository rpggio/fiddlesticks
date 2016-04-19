// function runTest() {
//     const box = new paper.Path({
//         segments: [
//             new paper.Point(0, 0),
//             new paper.Point(10, 0),
//             new paper.Point(10, 10),
//             new paper.Point(0, 10)
//         ],
//         closed: true
//     });
//     const section = new FontShape.PathSection(box, 0.1, 0.1);
//     assertEqual(4, section.length);
//     assertPointEqual(new paper.Point(4, 0), section.getPointAt(0));
//     assertPointEqual(new paper.Point(8, 0), section.getPointAt(4));
//     const sectionOverStart = new FontShape.PathSection(box, 0.9, 0.2);
//     assertEqual(8, sectionOverStart.length);
//     assertPointEqual(new paper.Point(0, 4), sectionOverStart.getPointAt(0));
//     assertPointEqual(new paper.Point(4, 0), sectionOverStart.getPointAt(8));
// }
// function assertPointEqual(expected: paper.Point, actual: paper.Point){
//     if (expected.subtract(actual).length > 0.0001) {
//         console.error(`expected ${expected}, was ${actual}`);
//     }
// }
// function assertEqual(expected: number, actual: number){
//     if (Math.abs(expected - actual) > 0.0001) {
//         console.error(`expected ${expected}, was ${actual}`);
//     }
// }
// var paper = require("paper");
// var Canvas = require('canvas')
//   , Image = Canvas.Image; 
var startServer = function () {
    var express = require("express");
    var bodyParser = require("body-parser");
    var aws = require("aws-sdk");
    var http = require("http");
    var path = require("path");
    var app = express();
    var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
    var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
    var S3_BUCKET = process.env.S3_BUCKET;
    app.use(bodyParser.json());
    app.set("port", (process.env.PORT || 7702));
    var sitePath = path.join(__dirname, "../../site");
    app.use("/css", express.static(path.join(sitePath, "css")));
    app.use("/fonts", express.static(path.join(sitePath, "fonts")));
    app.use("/lib", express.static(path.join(sitePath, "lib")));
    app.use("/img", express.static(path.join(sitePath, "img")));
    app.use("/content", express.static(path.join(sitePath, "content")));
    app.get("/", function (req, res) {
        res.sendFile(path.join(sitePath, "index.html"));
    });
    app.get("/sketch", function (req, res) {
        res.sendFile(path.join(sitePath, "sketch.html"));
    });
    app.get("/sketch/*", function (req, res) {
        res.sendFile(path.join(sitePath, "sketch.html"));
    });
    app.get("/demo", function (req, res) {
        res.sendFile(path.join(sitePath, "demo.html"));
    });
    app.get("/build", function (req, res) {
        res.sendFile(path.join(sitePath, "builder.html"));
    });
    app.get("/api/storage/access", function (req, res) {
        aws.config.update({ accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY });
        var s3 = new aws.S3();
        var s3params = {
            Bucket: S3_BUCKET,
            Key: req.query.fileName,
            Expires: 4000,
            ContentType: req.query.fileType,
            ACL: "public-read"
        };
        s3.getSignedUrl("putObject", s3params, function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                var returnData = {
                    signedRequest: data,
                    url: "https://" + S3_BUCKET + ".s3.amazonaws.com/" + req.query.fileName
                };
                res.type("application/json");
                res.write(JSON.stringify(returnData));
                res.end();
            }
        });
    });
    app.get("/api/storage/url", function (req, res) {
        var returnData = {
            url: "https://" + S3_BUCKET + ".s3.amazonaws.com/" + req.query.fileName
        };
        res.type("application/json");
        res.write(JSON.stringify(returnData));
        res.end();
    });
    app.post('/api/client-errors', function (req, res) {
        console.error("[client]", req.body);
        res.end();
    });
    app.listen(app.get("port"), function () {
        console.log("Node app is running on port", app.get("port"));
    });
};
// var canvas = new Canvas(1000, 1000);
// paper.setup(canvas);
// var region = paper.Path.Ellipse(new paper.Rectangle(
//                     new paper.Point(0,0),
//                     new paper.Size(600, 300)
//                 ));
// console.log(region.bounds.size.width);
// region.rotate(30);
// console.log(region.bounds.size.width);
startServer();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZm9udFNoYXBlVGVzdC50cyIsIi4uL3NyYy9kZXBzLmpzIiwiLi4vc3JjL3NlcnZlci5qcyIsIi4uL3NyYy96X3N0YXJ0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLHVCQUF1QjtBQUV2QixtQ0FBbUM7QUFDbkMsc0JBQXNCO0FBQ3RCLHFDQUFxQztBQUNyQyxzQ0FBc0M7QUFDdEMsdUNBQXVDO0FBQ3ZDLHFDQUFxQztBQUNyQyxhQUFhO0FBQ2IsdUJBQXVCO0FBQ3ZCLFVBQVU7QUFFVixnRUFBZ0U7QUFDaEUsc0NBQXNDO0FBQ3RDLHNFQUFzRTtBQUN0RSxzRUFBc0U7QUFFdEUseUVBQXlFO0FBQ3pFLCtDQUErQztBQUMvQywrRUFBK0U7QUFDL0UsK0VBQStFO0FBRS9FLElBQUk7QUFFSix5RUFBeUU7QUFDekUsdURBQXVEO0FBQ3ZELGdFQUFnRTtBQUNoRSxRQUFRO0FBQ1IsSUFBSTtBQUVKLDBEQUEwRDtBQUMxRCxrREFBa0Q7QUFDbEQsZ0VBQWdFO0FBQ2hFLFFBQVE7QUFDUixJQUFJO0FDbkNKLGdDQUFnQztBQUVoQyxpQ0FBaUM7QUFDakMsNEJBQTRCO0FDRjVCLElBQUksV0FBVyxHQUFHO0lBRWQsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pDLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUN2QyxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUUzQixJQUFJLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztJQUVwQixJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQztJQUNoRCxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQztJQUNoRCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztJQUV0QyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRTNCLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztJQUU1QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUVsRCxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RCxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RCxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RCxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVwRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFB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QztRQUM3QixHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN0QyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDZCxDQUFDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsVUFBUyxHQUFHLEVBQUUsR0FBRztRQUM1QyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2QsQ0FBQyxDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDLENBQUE7QUN0RkQsdUNBQXVDO0FBQ3ZDLHVCQUF1QjtBQUN2Qix1REFBdUQ7QUFDdkQsNENBQTRDO0FBQzVDLCtDQUErQztBQUMvQyxzQkFBc0I7QUFDdEIseUNBQXlDO0FBQ3pDLHFCQUFxQjtBQUNyQix5Q0FBeUM7QUFFekMsV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLy8gZnVuY3Rpb24gcnVuVGVzdCgpIHtcclxuXHJcbi8vICAgICBjb25zdCBib3ggPSBuZXcgcGFwZXIuUGF0aCh7XHJcbi8vICAgICAgICAgc2VnbWVudHM6IFtcclxuLy8gICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsIDApLFxyXG4vLyAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMTAsIDApLFxyXG4vLyAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMTAsIDEwKSxcclxuLy8gICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsIDEwKVxyXG4vLyAgICAgICAgIF0sXHJcbi8vICAgICAgICAgY2xvc2VkOiB0cnVlXHJcbi8vICAgICB9KTtcclxuXHJcbi8vICAgICBjb25zdCBzZWN0aW9uID0gbmV3IEZvbnRTaGFwZS5QYXRoU2VjdGlvbihib3gsIDAuMSwgMC4xKTtcclxuLy8gICAgIGFzc2VydEVxdWFsKDQsIHNlY3Rpb24ubGVuZ3RoKTtcclxuLy8gICAgIGFzc2VydFBvaW50RXF1YWwobmV3IHBhcGVyLlBvaW50KDQsIDApLCBzZWN0aW9uLmdldFBvaW50QXQoMCkpO1xyXG4vLyAgICAgYXNzZXJ0UG9pbnRFcXVhbChuZXcgcGFwZXIuUG9pbnQoOCwgMCksIHNlY3Rpb24uZ2V0UG9pbnRBdCg0KSk7XHJcblxyXG4vLyAgICAgY29uc3Qgc2VjdGlvbk92ZXJTdGFydCA9IG5ldyBGb250U2hhcGUuUGF0aFNlY3Rpb24oYm94LCAwLjksIDAuMik7XHJcbi8vICAgICBhc3NlcnRFcXVhbCg4LCBzZWN0aW9uT3ZlclN0YXJ0Lmxlbmd0aCk7XHJcbi8vICAgICBhc3NlcnRQb2ludEVxdWFsKG5ldyBwYXBlci5Qb2ludCgwLCA0KSwgc2VjdGlvbk92ZXJTdGFydC5nZXRQb2ludEF0KDApKTtcclxuLy8gICAgIGFzc2VydFBvaW50RXF1YWwobmV3IHBhcGVyLlBvaW50KDQsIDApLCBzZWN0aW9uT3ZlclN0YXJ0LmdldFBvaW50QXQoOCkpO1xyXG5cclxuLy8gfVxyXG5cclxuLy8gZnVuY3Rpb24gYXNzZXJ0UG9pbnRFcXVhbChleHBlY3RlZDogcGFwZXIuUG9pbnQsIGFjdHVhbDogcGFwZXIuUG9pbnQpe1xyXG4vLyAgICAgaWYgKGV4cGVjdGVkLnN1YnRyYWN0KGFjdHVhbCkubGVuZ3RoID4gMC4wMDAxKSB7XHJcbi8vICAgICAgICAgY29uc29sZS5lcnJvcihgZXhwZWN0ZWQgJHtleHBlY3RlZH0sIHdhcyAke2FjdHVhbH1gKTtcclxuLy8gICAgIH1cclxuLy8gfVxyXG5cclxuLy8gZnVuY3Rpb24gYXNzZXJ0RXF1YWwoZXhwZWN0ZWQ6IG51bWJlciwgYWN0dWFsOiBudW1iZXIpe1xyXG4vLyAgICAgaWYgKE1hdGguYWJzKGV4cGVjdGVkIC0gYWN0dWFsKSA+IDAuMDAwMSkge1xyXG4vLyAgICAgICAgIGNvbnNvbGUuZXJyb3IoYGV4cGVjdGVkICR7ZXhwZWN0ZWR9LCB3YXMgJHthY3R1YWx9YCk7XHJcbi8vICAgICB9XHJcbi8vIH1cclxuIiwiLy8gdmFyIHBhcGVyID0gcmVxdWlyZShcInBhcGVyXCIpO1xyXG5cclxuLy8gdmFyIENhbnZhcyA9IHJlcXVpcmUoJ2NhbnZhcycpXHJcbi8vICAgLCBJbWFnZSA9IENhbnZhcy5JbWFnZTsiLCJcclxudmFyIHN0YXJ0U2VydmVyID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIGV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcclxuICAgIHZhciBib2R5UGFyc2VyID0gcmVxdWlyZShcImJvZHktcGFyc2VyXCIpXHJcbiAgICB2YXIgYXdzID0gcmVxdWlyZShcImF3cy1zZGtcIik7XHJcbiAgICB2YXIgaHR0cCA9IHJlcXVpcmUoXCJodHRwXCIpO1xyXG4gICAgdmFyIHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcclxuXHJcbiAgICB2YXIgYXBwID0gZXhwcmVzcygpO1xyXG5cclxuICAgIHZhciBBV1NfQUNDRVNTX0tFWSA9IHByb2Nlc3MuZW52LkFXU19BQ0NFU1NfS0VZO1xyXG4gICAgdmFyIEFXU19TRUNSRVRfS0VZID0gcHJvY2Vzcy5lbnYuQVdTX1NFQ1JFVF9LRVk7XHJcbiAgICB2YXIgUzNfQlVDS0VUID0gcHJvY2Vzcy5lbnYuUzNfQlVDS0VUO1xyXG5cclxuICAgIGFwcC51c2UoYm9keVBhcnNlci5qc29uKCkpO1xyXG5cclxuICAgIGFwcC5zZXQoXCJwb3J0XCIsIChwcm9jZXNzLmVudi5QT1JUIHx8IDc3MDIpKTtcclxuXHJcbiAgICB2YXIgc2l0ZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uLy4uL3NpdGVcIik7XHJcblxyXG4gICAgYXBwLnVzZShcIi9jc3NcIiwgZXhwcmVzcy5zdGF0aWMocGF0aC5qb2luKHNpdGVQYXRoLCBcImNzc1wiKSkpO1xyXG4gICAgYXBwLnVzZShcIi9mb250c1wiLCBleHByZXNzLnN0YXRpYyhwYXRoLmpvaW4oc2l0ZVBhdGgsIFwiZm9udHNcIikpKTtcclxuICAgIGFwcC51c2UoXCIvbGliXCIsIGV4cHJlc3Muc3RhdGljKHBhdGguam9pbihzaXRlUGF0aCwgXCJsaWJcIikpKTtcclxuICAgIGFwcC51c2UoXCIvaW1nXCIsIGV4cHJlc3Muc3RhdGljKHBhdGguam9pbihzaXRlUGF0aCwgXCJpbWdcIikpKTtcclxuICAgIGFwcC51c2UoXCIvY29udGVudFwiLCBleHByZXNzLnN0YXRpYyhwYXRoLmpvaW4oc2l0ZVBhdGgsIFwiY29udGVudFwiKSkpO1xyXG5cclxuICAgIGFwcC5nZXQoXCIvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgcmVzLnNlbmRGaWxlKHBhdGguam9pbihzaXRlUGF0aCwgXCJpbmRleC5odG1sXCIpKTtcclxuICAgIH0pO1xyXG4gICAgYXBwLmdldChcIi9za2V0Y2hcIiwgZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICAgICAgICByZXMuc2VuZEZpbGUocGF0aC5qb2luKHNpdGVQYXRoLCBcInNrZXRjaC5odG1sXCIpKTtcclxuICAgIH0pO1xyXG4gICAgYXBwLmdldChcIi9za2V0Y2gvKlwiLCBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gICAgICAgIHJlcy5zZW5kRmlsZShwYXRoLmpvaW4oc2l0ZVBhdGgsIFwic2tldGNoLmh0bWxcIikpO1xyXG4gICAgfSk7XHJcbiAgICBhcHAuZ2V0KFwiL2RlbW9cIiwgZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICAgICAgICByZXMuc2VuZEZpbGUocGF0aC5qb2luKHNpdGVQYXRoLCBcImRlbW8uaHRtbFwiKSk7XHJcbiAgICB9KTtcclxuICAgIGFwcC5nZXQoXCIvYnVpbGRcIiwgZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICAgICAgICByZXMuc2VuZEZpbGUocGF0aC5qb2luKHNpdGVQYXRoLCBcImJ1aWxkZXIuaHRtbFwiKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAuZ2V0KFwiL2FwaS9zdG9yYWdlL2FjY2Vzc1wiLCBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gICAgICAgIGF3cy5jb25maWcudXBkYXRlKHsgYWNjZXNzS2V5SWQ6IEFXU19BQ0NFU1NfS0VZLCBzZWNyZXRBY2Nlc3NLZXk6IEFXU19TRUNSRVRfS0VZIH0pO1xyXG4gICAgICAgIHZhciBzMyA9IG5ldyBhd3MuUzMoKTtcclxuICAgICAgICB2YXIgczNwYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIEJ1Y2tldDogUzNfQlVDS0VULFxyXG4gICAgICAgICAgICBLZXk6IHJlcS5xdWVyeS5maWxlTmFtZSxcclxuICAgICAgICAgICAgRXhwaXJlczogNDAwMCwgLy8gb3ZlciAxIGhvdXJcclxuICAgICAgICAgICAgQ29udGVudFR5cGU6IHJlcS5xdWVyeS5maWxlVHlwZSxcclxuICAgICAgICAgICAgQUNMOiBcInB1YmxpYy1yZWFkXCJcclxuICAgICAgICB9O1xyXG4gICAgICAgIHMzLmdldFNpZ25lZFVybChcInB1dE9iamVjdFwiLCBzM3BhcmFtcywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmV0dXJuRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBzaWduZWRSZXF1ZXN0OiBkYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogXCJodHRwczovL1wiICsgUzNfQlVDS0VUICsgXCIuczMuYW1hem9uYXdzLmNvbS9cIiArIHJlcS5xdWVyeS5maWxlTmFtZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlcy50eXBlKFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICAgICAgICAgIHJlcy53cml0ZShKU09OLnN0cmluZ2lmeShyZXR1cm5EYXRhKSk7XHJcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFwcC5nZXQoXCIvYXBpL3N0b3JhZ2UvdXJsXCIsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdmFyIHJldHVybkRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVybDogXCJodHRwczovL1wiICsgUzNfQlVDS0VUICsgXCIuczMuYW1hem9uYXdzLmNvbS9cIiArIHJlcS5xdWVyeS5maWxlTmFtZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVzLnR5cGUoXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIHJlcy53cml0ZShKU09OLnN0cmluZ2lmeShyZXR1cm5EYXRhKSk7XHJcbiAgICAgICAgcmVzLmVuZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYXBwLnBvc3QoJy9hcGkvY2xpZW50LWVycm9ycycsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIltjbGllbnRdXCIsIHJlcS5ib2R5KTtcclxuICAgICAgICByZXMuZW5kKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAubGlzdGVuKGFwcC5nZXQoXCJwb3J0XCIpLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIk5vZGUgYXBwIGlzIHJ1bm5pbmcgb24gcG9ydFwiLCBhcHAuZ2V0KFwicG9ydFwiKSk7XHJcbiAgICB9KTtcclxuXHJcbn1cclxuIiwiXHJcbi8vIHZhciBjYW52YXMgPSBuZXcgQ2FudmFzKDEwMDAsIDEwMDApO1xyXG4vLyBwYXBlci5zZXR1cChjYW52YXMpO1xyXG4vLyB2YXIgcmVnaW9uID0gcGFwZXIuUGF0aC5FbGxpcHNlKG5ldyBwYXBlci5SZWN0YW5nbGUoXHJcbi8vICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KDAsMCksXHJcbi8vICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNpemUoNjAwLCAzMDApXHJcbi8vICAgICAgICAgICAgICAgICApKTtcclxuLy8gY29uc29sZS5sb2cocmVnaW9uLmJvdW5kcy5zaXplLndpZHRoKTtcclxuLy8gcmVnaW9uLnJvdGF0ZSgzMCk7XHJcbi8vIGNvbnNvbGUubG9nKHJlZ2lvbi5ib3VuZHMuc2l6ZS53aWR0aCk7XHJcblxyXG5zdGFydFNlcnZlcigpO1xyXG4iXX0=