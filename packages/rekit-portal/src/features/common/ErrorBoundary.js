import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  static propTypes = {

  };

  render() {
    return (
      <div className="common-error-boundary">
        Component content: common/ErrorBoundary
      </div>
    );
  }
}
