
window.Rx = require ("rx");

window.snabbdom = require("snabbdom"); // virtual DOM implementation
window.patch = snabbdom.init([ // Init patch function with choosen modules
  require("snabbdom/modules/attributes"), // makes it easy to toggle classes
  require("snabbdom/modules/class"), // makes it easy to toggle classes
  require("snabbdom/modules/props"), // for setting properties on DOM elements
  require("snabbdom/modules/style"), // handles styling on elements with support for animations
  require("snabbdom/modules/eventlisteners"), // attaches event listeners
]);
window.h = require("snabbdom/h"); // helper function for creating VNodes

//window.hh = require("hyperscript-helpers")(window.h); // shortcut syntax for hypescript

window._ = require("lodash");

window.postal = require("postal"); // message bus

window.React = require("react");
window.ReactDOM = require("react-dom");

window.ReactSelect = require("react-select");

window.WebFont = require("webfontloader");

//window.inversify = require("inversify"); // IoC
