import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import * as actions from './redux/actions';
import { CmdForm, cmdSuccessNotification, LogViewerDialog } from './';

const displayName = _.flow(_.lowerCase, _.upperFirst);

export class DialogPlace extends Component {
  static propTypes = {
    rekitCmds: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  @autobind
  handleCmdDialogDone(dialogType) {
    this.props.actions.hideDialog(dialogType);
  }

  @autobind
  handleCmdSuccess(dialogType) {
    this.props.actions.hideCmdDialog(dialogType);
    const { args } = this.props.rekitCmds.execCmdResult;
    cmdSuccessNotification(args, this.props.actions.showCmdDialog);
  }

  render() {
    const { rekitCmds } = this.props;
    const { hideCmdDialog } = this.props.actions;
    return (
      <div className="rekit-cmds-dialog-place">
        {rekitCmds.cmdDialogVisible &&
          <Modal
            visible
            maskClosable={false}
            footer=""
            wrapClassName="rekit-cmds-cmd-dialog"
            title={displayName(rekitCmds.cmdArgs.type)}
            onCancel={() => hideCmdDialog('cmd')}
            {...this.props}
          >
            <CmdForm
              onCancel={() => hideCmdDialog('cmd')}
              onDone={() => this.handleCmdSuccess('cmd')}
            />
          </Modal>
        }
        {rekitCmds.logViewerDialogVisible &&
          <LogViewerDialog onClose={() => hideCmdDialog('logViewer')} />
        }
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    rekitCmds: state.rekitCmds,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogPlace);
