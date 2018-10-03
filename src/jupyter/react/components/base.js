define(function (require) {
  const React = require('react');

  return class Component extends React.Component {
    render () {
      const {models} = this.props;
      const model = (models[0] && models[0][1]) || {};

      return <table>
        <thead>
          <tr>
            {Object.keys(model).map(key => {
              return <th key={key}>{key}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {models.map(([key, obj]) => {
            return <tr key={key}>
              {Object.keys(obj).map(k => {
                return <td key={k}>{obj[k]}</td>;
              })}
            </tr>;
          })}
        </tbody>
      </table>;
    }
  };
});
