import React, { Component } from 'react';
import { Panel, Resizer } from './';

export default class PanelSample extends Component {
  static propTypes = {};

  render() {
    return (
      <div className="layout-panel-sample">
        <Panel>
          <Panel width={100}>abc</Panel>
          <Resizer />
          <Panel>def</Panel>
        </Panel>
      </div>
    );
  }
}
