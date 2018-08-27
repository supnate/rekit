import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { Button, Icon } from 'antd';
import history from '../../common/history';
import { storage } from '../common/utils';
import { OutlineView, DepsView } from './';

export default class EditorSider extends Component {
  static propTypes = {
    file: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    onSelectNode: PropTypes.func,
    width: PropTypes.number,
    showDepsView: PropTypes.bool.isRequired,
  };

  handleResizeEnd = (sizes) => {
    storage.local.setItem('editorSiderSizes', sizes);
  }

  render() {
    const { width, code, onSelectNode } = this.props;
    const sizes = storage.local.getItem('editorSiderSizes') || [];
    const panes = [
      <Pane key="outlineview" className="pane" minSize="100px" size={sizes[0] || 1} >
        <div className="pane-header">Outline</div>
        <OutlineView code={code} onSelectNode={onSelectNode} />
      </Pane>,
    ];
    if (this.props.showDepsView) {
      panes.push(
        <Pane key="depsview" className="pane" minSize="100px" size={sizes[1] || 1}>
          <div className="pane-header">
            Relations
            <Button icon="right" size="small" onClick={() => history.go(1)} title="Go forward" />
            <Button icon="left" size="small" onClick={() => history.go(-1)} title="Go back" />
          </div>
          <DepsView file={this.props.file} />
        </Pane>
      );
    }
    const splitPaneProps = {};
    if (panes.length > 1) {
      splitPaneProps.onResizeEnd = this.handleResizeEnd;
      // splitPaneProps.default
    }
    return (
      <div className="editor-editor-sider" style={{ width: `${width}px` }}>aaa
      </div>
    );
  }
}
        // <SplitPane split="horizontal" {...splitPaneProps}>{panes}</SplitPane>
