import React, { Component } from 'react';
import { Steps } from 'antd';

const Step = Steps.Step;

export default class RekitSteps extends Component {
  render() {
    return (
      <div className="home-rekit-steps">
        <h3>Create your own Rekit app with only 3 steps!</h3>
        <p>
          Though this demo is readonly, you can try a full-featured Rekit portal by creating your own Rekit app. It&apos;s super easy!
        </p>
        <br />
        <Steps>
          <Step status="process" title="Install rekit" description={<ul><li><span>&gt;</span> npm install -g rekit</li></ul>} />
          <Step status="process" title="Create an app" description={<ul><li><span>&gt;</span> rekit create app1</li><li><span>&gt;</span> cd app1</li><li><span>&gt;</span> npm install</li></ul>} />
          <Step status="process" title="Start the app" description={<ul><li><span>&gt;</span> npm start</li></ul>} />
        </Steps>
        <p>Then access <a href="http://localhost:6075" target="_blank">http://localhost:6075</a> for your app. <a href="http://localhost:6076" target="_blank">http://localhost:6076</a> for Rekit portal.</p>
        <p>* Alternatively you can use <a href="https://yarnpkg.com/" target="_blank">Yarn</a> as the package manager rather than npm.</p>
      </div>
    );
  }
}
