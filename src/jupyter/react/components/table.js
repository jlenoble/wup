define(function (require) {
  const React = require('react');

  return class Component extends React.Component {
    render () {
      const {models, keys} = this.props;

      return <table>
        <thead>
          <tr>
            {keys.map(key => {
              return <th key={key}>{key}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {models.map(([key, obj]) => {
            return <tr key={key}>
              {keys.map(k => {
                return <td key={k}>{obj[k]}</td>;
              })}
            </tr>;
          })}
        </tbody>
      </table>;
    }
  };
});
