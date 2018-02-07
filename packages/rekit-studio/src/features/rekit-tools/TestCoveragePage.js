import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Button } from 'antd';
import history from '../../common/history';

export class TestCoveragePage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
  };

  handleRunTestsClick() {
    history.push('/tools/tests');
  }

  render() {
    return (
      <div className="rekit-tools-test-coverage-page">
        <h2>Test coverage report
          {this.props.home.testCoverage && <Button type="ghost" onClick={this.handleRunTestsClick}>Re-run tests</Button>}
        </h2>
        {this.props.home.testCoverage
          ? <iframe src="/coverage/lcov-report/index.html" />
          :
          <div className="no-coverage">
            <Alert message="No test coverage report found." showIcon type="info" />
            <p>You need to run all tests for the project to generate test coverage reoport.</p>
            <p><Button type="primary" onClick={this.handleRunTestsClick}>Run tests</Button></p>
          </div>
        }
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

export default connect(
  mapStateToProps,
)(TestCoveragePage);
