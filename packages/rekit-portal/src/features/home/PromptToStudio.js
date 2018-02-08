import React, { Component } from 'react';
import { Icon, Modal } from 'antd';

export default class PromptToStudio extends Component {
  static propTypes = {};
  state = { visible: true };
  hideModal = () => this.setState({ visible: false });
  render() {
    return (
      <div className="home-prompt-to-studio">
        <Modal
          visible={this.state.visible}
          onOk={() =>
            (window.open(
              'https://medium.com/@nate_wang/introducing-rekit-studio-a-real-ide-for-react-and-redux-development-baf0c99cb542'
            ), this.hideModal())
          }
          onCancel={this.hideModal}
        >
          <h2>
            <Icon style={{ color: 'green', fontSize: '24px', marginRight: '10px' }} type="smile-o" />Migrate to Rekit
            Studio!
          </h2>
          <p>Rekit Protal has been renamed to Rekit Studio which is totally compatible with Rekit Portal!</p>
          <p>Please follow the article to upgrade:</p>
          <a
            href="https://medium.com/@nate_wang/introducing-rekit-studio-a-real-ide-for-react-and-redux-development-baf0c99cb542"
            target="_blank"
          >
            Introducing Rekit Studio
          </a>
        </Modal>
      </div>
    );
  }
}
