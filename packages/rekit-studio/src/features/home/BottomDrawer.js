import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { SvgIcon } from '../common';

export default class BottomDrawer extends Component {
  static propTypes = {
    hideDrawer: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="home-bottom-drawer">
        <div className="toolbar">
          <div className="toolbar-tabs">
            <span className="toolbar-tab">Problems</span>
            <span className="toolbar-tab is-active">Output</span>
            <span className="toolbar-tab">Terminal</span>
          </div>
          <div className="toolbar-buttons">
            <Button
              icon="close"
              size="small"
              className="close-btn"
              shape="circle"
              onClick={this.props.hideDrawer}
            />
          </div>
        </div>
        <div className="content-container">def</div>
      </div>
    );
  }
}
