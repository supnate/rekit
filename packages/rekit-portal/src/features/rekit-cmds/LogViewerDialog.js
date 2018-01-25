import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Alert, Button, Modal } from 'antd';
import { LogViewer } from './';

export class LogViewerDialog extends Component {
  static propTypes = {
    rekitCmds: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onClose() {},
  };

  render() {
    const { args, logs } = this.props.rekitCmds.execCmdResult;
    return (
      <Modal
        visible
        maskClosable={false}
        footer=""
        closable={false}
        onCancel={this.props.onClose}
        wrapClassName="rekit-cmds-log-viewer-dialog"
        {...this.props}
      >
        <Alert
          type="success"
          showIcon
          message={`${_.upperFirst(args.commandName === 'remove' ? 'delete' : args.commandName)} ${args.type} success.`}
          description="See below logs for what has been done:"
        />
        <LogViewer logs={logs} />
        <div className="dialog-footer">
          <Button type="primary" onClick={this.props.onClose}>Close</Button>
        </div>
      </Modal>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    rekitCmds: state.rekitCmds,
  };
}

export default connect(
  mapStateToProps,
)(LogViewerDialog);
