import React, { PureComponent, PropTypes } from 'react';

export default class ${_.pascalCase(component)} extends PureComponent {
  static propTypes = {

  };

  render() {
    return (
      <div className="${_.kebabCase(feature || 'component') + '-' + _.kebabCase(component)}">
        Component content: ${_.kebabCase(feature)}/${_.pascalCase(component)}
      </div>
    );
  }
}
