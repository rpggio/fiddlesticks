
require ('rx');

snabbdom = require('snabbdom');
window.patch = snabbdom.init([ // Init patch function with choosen modules
  require('snabbdom/modules/class'), // makes it easy to toggle classes
  require('snabbdom/modules/props'), // for setting properties on DOM elements
  require('snabbdom/modules/style'), // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners'), // attaches event listeners
]);
window.h = require('snabbdom/h'); // helper function for creating VNodes


require('lodash');
//console.log('lo deps', _);
//console.log('lo keys', _.keys({x:1}));

// import _ from 'lodash';
// window._ = _;
