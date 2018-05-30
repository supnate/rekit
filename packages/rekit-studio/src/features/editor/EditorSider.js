import React, { Component } from 'react';
import { OutlineView, DepsView } from './';

export default class EditorSider extends Component {
  static propTypes = {};

  render() {
    return (
      <div className="editor-editor-sider">
        <OutlineView />
        <DepsView />
      </div>
    );
  }
}
