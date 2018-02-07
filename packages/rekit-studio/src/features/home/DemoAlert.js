import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Modal } from 'antd';
import { RekitSteps } from './';

export default class DemoAlert extends Component {
  static propTypes = {
    onClose: PropTypes.func,
  };

  static defaultProps = {
    onClose() {},
  };

  render() {
    return (
      <Modal
        visible
        maskClosable
        title=""
        footer=""
        width="700px"
        onCancel={this.props.onClose}
      >
        <div className="home-demo-alert">
          <Alert
            message="The demo is readonly!"
            description="This site is only for demo purpose. So Rekit Studio is running on readonly mode. You can't perform any action that alters the project data."
            type="warning"
            showIcon
          />
          <RekitSteps />
        </div>
      </Modal>
    );
  }
}
