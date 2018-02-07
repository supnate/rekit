import React, { Component } from 'react';

export default class UnloadComponent extends Component {
  componentWillMount() {
    window.addEventListener('beforeunload', this.onbeforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onbeforeunload);
  }

  onbeforeunload(e) {
    const dialogText = 'Changes you made may not be saved.';
    e.returnValue = dialogText;
    return dialogText;
  }

  render() {
    return '';
  }
}
