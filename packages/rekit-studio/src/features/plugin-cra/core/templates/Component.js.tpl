import React, { Component } from 'react';

export default class ${name} extends Component {
  static propTypes = {

  };

  render() {
    return (
      <div className="${prefix + '-' + name}">
        Component content: ${prefix}/${name}
      </div>
    );
  }
}
