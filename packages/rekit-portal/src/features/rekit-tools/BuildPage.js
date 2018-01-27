import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Modal, Progress, Row } from 'antd';
import Convert from 'ansi-to-html';
import { showDemoAlert } from '../home/redux/actions';
import * as actions from './redux/actions';

const convert = new Convert();

export class BuildPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    rekitTools: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  handleBuildButtonClick = () => {
    this.props.actions.runBuild().catch((e) => {
      console.error('Failed to run build: ', e);
      if (process.env.REKIT_ENV === 'demo') {
        this.props.actions.showDemoAlert();
      } else {
        Modal.error({
          title: 'Failed to run build',
          content: <span style={{ color: 'red' }}>{this.props.rekitTools.runBuildError}</span>,
        });
      }
    });
  }

  render() {
    let output = this.props.rekitTools.runBuildOutput || [];
    const { runBuildRunning, runBuildPending } = this.props.rekitTools;
    let percent = 0;
    output = _.uniq(output.map((t) => {
      const p = parseFloat(t.split('%'));
      if (p) percent = p;
      return t.replace(/.+%/, '>');
    }));

    return (
      <div className="rekit-tools-build-page">
        <div className="toolbar">
          <Button type="primary" size="small" disabled={runBuildRunning || runBuildPending} onClick={this.handleBuildButtonClick}>
            {runBuildRunning ? 'Building...' : 'Run build'}
          </Button>
          <div className="build-result-link">
            The build result is running at:&nbsp;
            <a href={`http://localhost:${this.props.home.rekit.buildPort}`} target="_blank">
              http://localhost:{this.props.home.rekit.buildPort}
            </a>
          </div>
        </div>

        { (runBuildRunning || percent === 100) && <Progress percent={percent} />}
        {!runBuildRunning && !output.length && <div style={{ marginTop: 20, color: '#ccc', marginLeft: 20 }}>Click run build button to start the build.</div>}
        {output.length > 0 &&
          <div className="output-container">
            <ul>
              {output.map((text, i) =>
                text && <li key={i} dangerouslySetInnerHTML={{ __html: convert.toHtml(text).replace(/color:#555/g, 'color:#777') }} />
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
)(BuildPage);
