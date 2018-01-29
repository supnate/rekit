import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Icon, Modal, Row } from 'antd';
import Convert from 'ansi-to-html';
import history from '../../common/history';
import { showDemoAlert } from '../home/redux/actions';
import * as actions from './redux/actions';
import { getTestFilePattern } from './utils';

const convert = new Convert();

export class RunTestPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    rekitTools: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  componentDidMount() {
    // this.checkAndRunTests(this.props);
  }

//   componentWillReceiveProps(nextProps) {
//     if (nextProps.match.params.testFile !== this.props.match.params.testFile) {
//       this.checkAndRunTests(nextProps);
//     }
//   }

  // checkAndRunTests(props) {
  //   const rekitTools = this.props.rekitTools;
  //   if (rekitTools.currentTestFile !== props.match.params.testFile && !rekitTools.runTestRunning) {
  //     this.props.actions.runTest(props.match.params.testFile).catch(this.handleRunTestError);
  //   }
  // }

  handleRunTestError = (e) => {
    if (process.env.REKIT_ENV === 'demo' && _.get(e, 'response.status') === 403) {
      this.props.actions.showDemoAlert();
    } else {
      Modal.error({
        title: 'Failed to run tests',
        content: <span style={{ color: 'red' }}>{this.props.rekitTools.runTestError}</span>,
      });
    }
  }


  handleTestButtonClick = () => {
    const testFile = this.props.match.params.testFile;
    this.props.actions.runTest(testFile ? decodeURIComponent(testFile) : '').catch(this.handleRunTestError);
  }

  handleTestCoverageClick = () => {
    history.push('/tools/coverage');
  }

  render() {
    const output = this.props.rekitTools.runTestOutput || [];
    const { runTestPending, runTestRunning } = this.props.rekitTools;
    const testFile = this.props.match.params.testFile;
    return (
      <div className="rekit-tools-run-test-page">
        <h2>
          <Button type="primary" size="small" disabled={runTestRunning} onClick={this.handleTestButtonClick}>
            {runTestRunning ? 'Running tests...' : 'Run tests'}
          </Button>
          &nbsp; &nbsp; tests/{getTestFilePattern(testFile ? decodeURIComponent(testFile) : '')}
        </h2>

        {!runTestRunning && !output.length && <div style={{ marginTop: 20, color: '#ccc', marginLeft: 20 }}>Click run tests button to start the tests.</div>}
        {output.length > 0 &&
          <div className="output-container">
            <ul>
              {output.map((text, i) =>
                text && <li key={i} dangerouslySetInnerHTML={{ __html: convert.toHtml(text).replace(/color:#A00/g, 'color:#F00').replace(/color:#555/g, 'color:#777') }} />
              )}
            </ul>
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
    rekitTools: state.rekitTools,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ showDemoAlert, ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RunTestPage);
