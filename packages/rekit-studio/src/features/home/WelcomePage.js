import React, { Component } from 'react';

// This is the page used to show when all tabs closed.
export default class WelcomePage extends Component {
  static propTypes = {

  };

  render() {
    return (
      <div className="home-welcome-page">
        <div className="content-container">
          <img src={require('../../images/logo.png')} alt="logo" />
          <h2>Welcome to Rekit!</h2>
          <a href="http://rekit.js.org" target="_blank">http://rekit.js.org</a>
        </div>
      </div>
    );
  }
}
