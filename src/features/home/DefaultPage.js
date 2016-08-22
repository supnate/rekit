import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Hello } from './';
import * as actions from './actions';

class DefaultPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handlePlusOne = ::this.handlePlusOne;
    this.handleMinusOne = ::this.handleMinusOne;
    this.handleReset = ::this.handleReset;
  }

  handlePlusOne() {
    this.props.actions.counterPlusOne();
  }

  handleMinusOne() {
    this.props.actions.counterMinusOne();
  }

  handleReset() {
    this.props.actions.resetCount();
  }

  render() {
    return (
      <div className="home-default-page">
        <Hello />
        <p>
          This is the sample page of the project. Seeing this page means everything works well now!<br />
          This project is initialized with one feature named "home" and two test pages. To remove the test pages, run below commands:
        </p>
        <ul>
          <li>npm run rm:page home/test-page-1</li>
          <li>npm run rm:page home/test-page-2</li>
        </ul>
        <p>
          For more command line tools usage, please visit: <a href="http://github.com/supnate/rekit">http://github.com/supnate/rekit</a>.
        </p>
        <p>To quickly see how Redux works in the project, here is the demo of a simple counter:</p>
        <div className="demo-count">
          <label>{this.props.home.count}</label>
          <button onClick={this.handlePlusOne}>+</button>
          <button onClick={this.handleMinusOne} disabled={this.props.home.count === 0}>-</button>
          <button onClick={this.handleReset}>Reset</button>
        </div>
        <p>Enjoy!</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultPage);
