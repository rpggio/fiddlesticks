
window.Rx = require ("rx");

window.snabbdom = require("snabbdom"); // virtual DOM implementation
window.patch = snabbdom.init([
  require("snabbdom/modules/attributes"),
  require("snabbdom/modules/class"),
  require("snabbdom/modules/props"), 
  require("snabbdom/modules/style"),
  require("snabbdom/modules/eventlisteners"),
]);
window.h = require("snabbdom/h"); // helper function for creating VNodes

window._ = require("lodash");

window.WebFont = require("webfontloader");

var router5 = require("router5");
window.Router5 = router5.Router5;
window.RouteNode = router5.RouteNode;
window.loggerPlugin = router5.loggerPlugin;
window.listenersPlugin = require('router5-listeners');
window.historyPlugin = require('router5-history');

window.Cookies = require("js-cookie");

window.StackTrace = require("stacktrace-js");

if (!window.paper.Item.prototype.setRampPoint) {
    window.paper.Item.prototype.setRampPoint = function () {};
}

