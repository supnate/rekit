import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import * as actions from './redux/actions';
import { EnvVarsList } from './';
import { envVarsSelector } from './selectors/envVarsSelector';

export class EnvVarsManager extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (!this.props.config.envVars && !this.props.config.fetchEnvVarsPending) {
      this.props.actions.fetchEnvVars();
    }
  }

  getData(envVars) {
    return envVarsSelector(envVars);
  }

  renderLoading() {
    return (
      <div className="config-env-vars-manager page-loading">
        <Spin /> Loading...
      </div>
    );
  }

  renderEnvVarsLists() {
    const { envVars } = this.props.config;

    return Object.keys(envVars).map(key => {
      const generalEnvVars = this.getData(envVars[key].general);
      const localEnvVars = this.getData(envVars[key].local);

      return <EnvVarsList key={key} env={key} generalEnvVars={generalEnvVars} localEnvVars={localEnvVars} />;
    });
  }

  render() {
    if (!this.props.config.envVars) return this.renderLoading();

    return (
      <div className="config-env-vars-manager">
        <div className="env-vars-container">
          <h3>Environment Variables</h3>

          {this.renderEnvVarsLists()}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(EnvVarsManager);
