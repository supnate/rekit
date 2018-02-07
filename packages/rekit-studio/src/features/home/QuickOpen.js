import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class QuickOpen extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentWillMount() {
    document.body.addEventListener('keypress', this.handleKeypress);
  }
  componentWillUnmount() {
    document.body.removeEventListener('keypress', this.handleKeypress);    
  }

  handleKeypress = (evt) => {
    console.log('keypress', evt);
  }

  render() {
    return (
      <div className="home-quick-open">
        Page Content: home/QuickOpen
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
)(QuickOpen);
