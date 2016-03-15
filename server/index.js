
var express = require("express");
//var body_parser = require("body-parser")
var aws = require("aws-sdk");
var http = require("http");
var path = require("path");

var app = express();

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

app.set("port", (process.env.PORT || 7702));

var sitePath = path.join(__dirname, "/../site");

app.use("/css", express.static(path.join(sitePath, "css")));
app.use("/fonts", express.static(path.join(sitePath, "fonts")));
app.use("/lib", express.static(path.join(sitePath, "lib")));
app.use("/img", express.static(path.join(sitePath, "img")));

var indexPath = path.join(sitePath, "index.html");
app.get("/", function(req, res) {
    res.sendFile(indexPath);
});
app.get("/sketch/*", function(req, res) {
    res.sendFile(indexPath);
});

app.get("/api/storage/access", function(req, res) {
    aws.config.update({ accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY });
    var s3 = new aws.S3();
    var s3params = {
        Bucket: S3_BUCKET,
        Key: req.query.fileName,
        Expires: 60,
        ContentType: req.query.fileType,
        ACL: "public-read"
    };
    s3.getSignedUrl("putObject", s3params, function(err, data) {
        if (err) {
            console.log(err);
        }
        else {
            var returnData = {
                signedRequest: data,
                url: "https://" + S3_BUCKET + ".s3.amazonaws.com/" + req.query.fileName
            };
            res.write(JSON.stringify(returnData));
            res.end();
        }
    });
});

app.get("/api/storage/url", function(req, res) {
    var returnData = {
        url: "https://" + S3_BUCKET + ".s3.amazonaws.com/" + req.query.fileName
    };
    res.write(JSON.stringify(returnData));
    res.end();
});

app.listen(app.get("port"), function() {
    console.log("Node app is running on port", app.get("port"));
});
