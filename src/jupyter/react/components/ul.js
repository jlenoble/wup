define(function (require) {
  const React = require('react');

  return class Component extends React.Component {
    render () {
      const {models, keys} = this.props;
      const [prop] = keys;

      return <ul>
        {models.map(([key, obj]) => {
          return <li key={key}>{obj[prop]}</li>;
        })}
      </ul>;
    }
  };
});
