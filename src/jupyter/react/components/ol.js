define(function (require) {
  const React = require('react');

  return class Component extends React.Component {
    render () {
      const {models} = this.props;

      return <ol>
        {models.map(([key, obj]) => {
          return <li key={key}>{obj.title}</li>;
        })}
      </ol>;
    }
  };
});
