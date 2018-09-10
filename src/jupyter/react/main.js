'use strict';

define(function (require) {
  var exports = {};

  function load_ipython_extension() {
    console.log('toto');
  }

  exports.load_ipython_extension = load_ipython_extension;
  return exports;
});
