import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin, message } from 'antd';
import * as actions from './redux/actions';
import { OutputPanel, Resizer } from '../common';
import { DepsList } from './';
import { depsSelector, devDepsSelector } from './selectors/depsSelector';

export class DepsManager extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    outputVisible: false,
  };

  componentDidMount() {
    if (
      (!this.props.config.deps || this.props.config.depsNeedReload) &&
      !this.props.config.fetchDepsPending
    ) {
      this.refresh();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.config.fetchDepsPending) return;
    const depStatus = this.props.config.depStatus;
    const prevDepStatus = prevProps.config.depStatus;
    if (_.values(depStatus).filter(d => d).length < _.values(prevDepStatus).filter(d => d).length) {
      this.refresh();
    }
  }
  getData(depsType) {
    const deps = this.props.config.deps;
    return depsType === 'dev' ? devDepsSelector(deps) : depsSelector(deps);
  }
  refresh() {
    this.props.actions.fetchDepsRemote();
    // let hideMessage;
    // this.props.actions
    //   .fetchDeps()
    //   .then(() => {
    //     hideMessage = message.loading('Fetching latest versions...', 0);
    //     return this.props.actions.fetchDepsRemote();
    //   })
    //   .then(() => {
    //     if (hideMessage) hideMessage();
    //   });
  }

  showOutput = () => this.setState({ outputVisible: true });
  hideOutput = () => this.setState({ outputVisible: false });

  handleResize = pos => {
    this.props.actions.setDepsOutputHeight(pos.bottom);
  };

  handleOutputClose = () => {
    this.setState({ outputVisible: false });
  };

  renderLoading() {
    return (
      <div className="config-deps-manager page-loading">
        <Spin /> Loading...
      </div>
    );
  }

  render() {
    if (!this.props.config.deps) return this.renderLoading();
    const outputVisible = this.state.outputVisible;
    return (
      <div className="config-deps-manager">
        <div
          className="deps-container"
          style={{ bottom: `${outputVisible ? this.props.config.depsOutputHeight : 0}px` }}
        >
          <DepsList deps={this.getData()} depsType="deps" onShowOutput={this.showOutput} />
          <br />
          <DepsList deps={this.getData('dev')} depsType="devDeps" onShowOutput={this.showOutput} />
          <br />
          <p className="note">
            NOTE 1: The latest version of npm package is cached for two hours. If you want to force
            refresh the latest version, please restart Rekit Studio.
          </p>
          <p className="note">
            NOTE 2: Rekit uses yarn if yarn.lock exists otherwise uses npm to install/update/remove
            packages. If you use neither npm nor yarn to manage packages you can't
            install/update/remove packages from this page.
          </p>
        </div>
        {outputVisible && (
          <Resizer
            direction="horizontal"
            position={{ bottom: `${this.props.config.depsOutputHeight - 2}px` }}
            onResize={this.handleResize}
          />
        )}
        {outputVisible && (
          <OutputPanel
            onClose={this.hideOutput}
            filter={['install-package', 'update-package', 'remove-package']}
            style={{ height: `${this.props.config.depsOutputHeight}px` }}
          />
        )}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  // return _.pick(state.config, [
  //   'depStatus',

  // ]);
  return {
    config: state.config,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepsManager);
