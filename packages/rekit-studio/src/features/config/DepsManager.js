import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Spin } from 'antd';
import semverDiff from 'semver-diff';
import * as actions from './redux/actions';
import { DepsList } from './';

export class DepsManager extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {};

  componentDidMount() {
    if ((!this.props.config.deps || this.props.config.depsNeedReload) && !this.props.config.fetchDepsPending) {
      this.props.actions.fetchDeps();
    }
  }

  getData(depsType) {
    const { devDeps, allDeps, deps } = this.props.config.deps;
    return (depsType === 'dev' ? devDeps : deps)
      .map(name => ({
        name,
        requiredVersion: allDeps[name].requiredVersion,
        installedVersion: allDeps[name].installedVersion,
        latestVersion: allDeps[name].latestVersion,
        status: semverDiff(allDeps[name].installedVersion, allDeps[name].latestVersion) + '', // eslint-disable-line
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  renderLoading() {
    return (
      <div className="config-deps-manager page-loading">
        <Spin /> Loading...
      </div>
    );
  }

  render() {
    if (this.props.config.fetchDepsPending || !this.props.config.deps) return this.renderLoading();
    return (
      <div className="config-deps-manager">
        <div className="toolbar no-top-margin">
          <h3>Dependencies</h3>
          <Button type="primary" icon="plus" size="small" />
        </div>
        <DepsList deps={this.getData()} />
        <div className="toolbar">
          <h3>Dev Dependencies</h3>
          <Button type="primary" icon="plus" size="small" />
        </div>
        <DepsList deps={this.getData('dev')} />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
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

export default connect(mapStateToProps, mapDispatchToProps)(DepsManager);
