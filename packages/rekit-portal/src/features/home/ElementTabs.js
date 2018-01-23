import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import * as actions from './redux/actions';

export class ElementTabs extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="home-element-tabs">
        <span className="tab"><Icon type="appstore-o" />ElementTabs<Icon type="close" /></span>
        <span className="tab"><Icon type="appstore-o" />ElementPage<Icon type="close" /></span>
        <span className="tab tab-active"><Icon type="appstore-o" />About<Icon type="close" /></span>
        <span className="tab">saveFile<Icon type="close" /></span>
        <span className="tab">showDemoAlert<Icon type="close" /></span>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
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
)(ElementTabs);
