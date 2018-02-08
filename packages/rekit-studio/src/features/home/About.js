/* eslint react/jsx-no-target-blank: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RekitSteps } from './';

export class About extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
  };
  renderNormalAbout() {
    const rekit = this.props.home.rekit;
    return (
      <div className="home-about">
        <div className="header">
          <img className="logo" src={require('../../images/logo.png')} alt="logo" />
          <h3>Rekit Studio</h3>
          <span className="version">Version: v{rekit.studioVersion}</span>
        </div>

        <p>
          Rekit Studio is a web IDE for managing a Rekit project.
          It not only provides web UIs for creating/renaming/moving/deleting elements of a Rekit app,
          but also provides tools for analyzing/building/testing a Rekit application.
        </p>
        <div className="versions">
          <h5>Application Status</h5>
          <p><label>Created by <a href="https://github.com/supnate/rekit" target="_blank">Rekit:</a></label><span> v{rekit.version}</span></p>
          <p><label>Depends on <a href="https://github.com/supnate/rekit-core" target="_blank">Rekit Core:</a></label><span> v{rekit.coreVersion}</span></p>
          <p><label>Depends on <a href="https://github.com/supnate/rekit-studio" target="_blank">Rekit Studio:</a></label><span> v{rekit.studioVersion}</span></p>
        </div>

        <p className="feedback">
          Any questions or feedback? Please visit: <br />
          <a href="https://github.com/supnate/rekit" target="_blank">https://github.com/supnate/rekit</a>
        </p>
      </div>
    );
  }

  renderDemoAbout() {
    const rekit = this.props.home.rekit;
    return (
      <div className="home-about demo-version">
        <div className="header">
          <img className="logo" src={require('../../images/logo.png')} alt="logo" />
          <h1>Welcome to the Rekit Studio demo!</h1>
          <span className="version">Version: v{rekit.studioVersion}</span>
        </div>
        <p>
          This is a demo of Rekit and Rekit Studio for you to quickly learn how Rekit helps to creating a scalable web application. Here you are
          seeing a real Rekit project (Rekit Studio itself!) managed by Rekit Studio.
        </p>
        <p>
          Rekit Studio itself is also created by Rekit. It&apos;s a web application for managing a Rekit project.
          It not only provides web UIs for creating/renaming/moving/deleting elements of a Rekit app,
          but also provides tools for analyzing/building/testing a Rekit application.
        </p>
        <RekitSteps />
        <h3>Rekit Studio architecture</h3>
        <p>
          Rekit Studio is a web app built with Rekit, it uses Rekit&apos;s <a href="#">feature oriented architecture</a>. Actually Rekit Studio is built up with 5 well decoupled features:
        </p>
        <ol className="features-list">
          <li><b>Common</b>: provides common utilities, components for all features.</li>
          <li><b>Home</b>: the foundation feature of Rekit Studio, including managing the meta data of the project, main UI layout, project explorer etc.</li>
          <li><b>Diagram</b>: visualize the project architecture.</li>
          <li><b>Rekit cmds</b>: provides actions and components for communicating with backend server to create/rename/move/delete Rekit elements like components.</li>
          <li><b>Rekit tools</b>: provides pages to test or build the project.</li>
        </ol>
        <p>
          From the overview diagram in dashboard, you can have a intuitive view of how features work together.
        </p>
        <p>
          Besides the web UI, Rekit Studio also includes an express middleware to use APIs provided by Rekit core to manage the project.
        </p>
        <h3>Learn more</h3>
        <ul className="learn-more-list">
          <li><a href="https://medium.com/p/introducing-rekit-studio-a-real-ide-for-react-and-redux-development-baf0c99cb542" target="_blank">Introducing Rekit Studio: a real IDE for React and Redux development</a></li>
          <li><a href="https://medium.com/@nate_wang/rekit-2-0-next-generation-react-development-ce8bbba51e94" target="_blank">Rekit 2.0 is out with great new features!</a></li>
          <li><a href="http://rekit.js.org" target="_blank">Rekit docs: rekit.js.org</a></li>
          <li><a href="https://medium.com/@nate_wang/feature-oriented-architecture-for-web-applications-2b48e358afb0" target="_blank">Feature oriented web development with React, Redux and React-router</a></li>
          <li><a href="https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da" target="_blank">A new approach to managing Redux actions</a></li>
        </ul>
        <p>
          Any more questions or feedback? Please visit: <a href="https://github.com/supnate/rekit" target="_blank">https://github.com/supnate/rekit</a>.
        </p>
      </div>
    );
  }
  render() {
    if (process.env.REKIT_ENV === 'demo') {
      return this.renderDemoAbout();
    }
    return this.renderNormalAbout();
  }
}

export default connect(state => ({ home: state.home }))(About);
