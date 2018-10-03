'use strict';

requirejs.config({
  paths: {
    'react': '//unpkg.com/react@16/umd/react.development',
    'react-dom': '//unpkg.com/react-dom@16/umd/react-dom.development',
  }
});

define(function (require) {
  function load_ipython_extension () {
    const React = require('react');
    const ReactDOM = require('react-dom');
    const Jupyter = require('base/js/namespace');
    const events = require('base/js/events');
    const {OutputArea} = require('notebook/js/outputarea');
    require('./components/index'); // Preload all components

    const proto = OutputArea.prototype;
    const {register_mime_type} = proto;

    function getElement ({name, display, props}) {
      const Component = require(`./components/${display}`);
      const {models} = props;
      return <Component models={models}/>;
    }

    function append_react_component (data, md, element) {
      const type = 'text/html';
      const toinsert = this.create_output_subarea(md, "output_html rendered_html", type);

      this.keyboard_manager.register_events(toinsert);
      element.append(toinsert);
      ReactDOM.render(getElement(JSON.parse(data)), toinsert[0]);

      return toinsert;
    }

    register_mime_type('react/component', append_react_component, {safe: true});
  }

  return {load_ipython_extension};
});
