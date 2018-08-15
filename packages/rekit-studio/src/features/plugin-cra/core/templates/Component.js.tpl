import React, { Component } from 'react';

export default class ${ele.name} extends Component {
  static propTypes = {

  };

  render() {
    return (
      <div className="${_.kebabCase(ele.path)}">
        Component content: ${ele.path}
      </div>
    );
  }
}
