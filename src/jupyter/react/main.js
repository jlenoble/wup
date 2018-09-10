'use strict';

requirejs.config({
  paths: {
    'react': 'https://unpkg.com/react@16/umd/react.development',
    'react-dom': 'https://unpkg.com/react-dom@16/umd/react-dom.development',
  }
});

define(function (require) {
  var exports = {};

  function load_ipython_extension() {
    requirejs(['react', 'react-dom'], function (React, ReactDom) {
      console.log(React, ReactDom);
    });
  }

  exports.load_ipython_extension = load_ipython_extension;
  return exports;
});
