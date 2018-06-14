import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { Button, Icon } from 'antd';
import history from '../../common/history';
import { OutlineView, DepsView } from './';

export default class EditorSider extends Component {
  static propTypes = {
    file: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    onSelectNode: PropTypes.func,
    width: PropTypes.number,
    showDepsView: PropTypes.bool.isRequired,
  };

  render() {
    const { width, code, onSelectNode } = this.props;
    const panes = [
      <Pane className="pane" minSize="100px">
        <div className="pane-header">Outline</div>
        <OutlineView code={code} onSelectNode={onSelectNode} />
      </Pane>,
    ];
    if (this.props.showDepsView) {
      panes.push(
        <Pane className="pane" minSize="100px">
          <div className="pane-header">
            Relations
            <Button icon="right" size="small" onClick={() => history.go(1)} title="Go forward" />
            <Button icon="left" size="small" onClick={() => history.go(-1)} title="Go back" />
          </div>
          <DepsView file={this.props.file} />
        </Pane>
      );
    }
    return (
      <div className="editor-editor-sider" style={{ width: `${width}px` }}>
        <SplitPane split="horizontal">{panes}</SplitPane>
      </div>
    );
  }
}
