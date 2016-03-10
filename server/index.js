
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 7702));

var sitePath = __dirname + "/../site";
app.use("/", express.static(sitePath));
console.log(`serve / from ${sitePath}`);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
