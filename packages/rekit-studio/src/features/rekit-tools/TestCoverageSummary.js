import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';
import { connect } from 'react-redux';
import { Alert, Button, Icon, Tooltip } from 'antd';
import tinygradient from 'tinygradient';
import history from '../../common/history';

export class TestCoverageSummary extends PureComponent {
  static propTypes = {
    home: PropTypes.object.isRequired,
  };

  state = {
    reportData: null,
    loading: false,
    noData: false,
    error: null,
  };

  async componentWillMount() {
    try {
      const res = await axios.get('/coverage/lcov-report/index.html');
      this.setState({
        noData: false,
        reportData: res.data,
      });
    } catch (e) {
      const status = _.get(e, 'response.status');
      if (status === 404) {
        this.setState({ noData: true });
      } else {
        this.setState({ error: e });
      }
    }
    this.setState({ loading: false });
  }

  handleRunTests() {
    history.push('/tools/tests');
  }

  renderLoading() {
    return (
      <div className="rekit-tools-test-coverage-summary" style={{ color: '#aaa' }}>
        <Icon type="loading-3-quarters" spin /> Loading...
      </div>
    );
  }

  renderReport() {
    // const color = d3
    //   .scaleLinear()
    //   .domain([0, 90])
    //   .range(['#ef5350', '#81C784']);
    // let arr = [];
    // for (let i = 5; i < 100; i += 20)arr.push(i);
    // arr = _.shuffle(arr);
    const gradient = tinygradient(['#ef5350', '#81C784']);
    const { features, featureById } = this.props.home;

    // const trs = /<tr>.+<\/tr>/mig.exec(this.state.reportData.replace(/\r|\n/g, ''));

    // statements coverage
    const coverage = features.reduce((c, fid) => {
      c[fid] = { tested: 0, total: 0 };
      return c;
    }, {});
    const html = this.state.reportData.replace(/[\r\n]/g, '');
    /<span class="strong">([\d.]+)% <\/span>/.test(html);
    const overallCoverage = parseFloat(RegExp.$1);
    const res = /<table class="coverage-summary">.+<\/table>/gi.exec(html);
    const node = document.createElement('div');
    node.innerHTML = res[0];
    const table = node.firstChild;
    _.toArray(table.rows)
      .slice(1)
      .forEach(row => {
        const file = row.cells[0].firstChild.innerHTML;
        if (/src\/features\/([^/]+)/i.test(file)) {
          const fid = RegExp.$1;
          if (fid && coverage[fid]) {
            const ss = row.cells[3].innerHTML;
            const arr = ss.split('/').map(n => parseInt(n, 10));
            coverage[fid].tested += arr[0];
            coverage[fid].total += arr[1];
          }
        }
      });
    _.keys(coverage).forEach(k => {
      coverage[k].percentage = Math.round(coverage[k].tested / (coverage[k].total || 1) * 10000) / 100;
    });

    return (
      <ul>
        <li>
          <h4>Overall coverage: {overallCoverage}%</h4>
          <div className="coverage-percent">
            <div
              className="percent-inner"
              style={{ width: `${overallCoverage}%`, backgroundColor: gradient.rgbAt(overallCoverage / 100) }}
            />
          </div>
        </li>

        <li>
          <h4>Coverage by feature:</h4>
        </li>
        {features.map(fid => {
          const p = coverage[fid].percentage;
          const name = featureById[fid].name;
          if (p === 0) {
            return (
              <li key={fid} className="feature-coverage">
                <label>
                  {name}:
                  <Tooltip title="If tests failed, the report will not have full data.">
                    <span style={{ color: 'red' }}> No data.</span>
                  </Tooltip>
                </label>
                <div className="coverage-percent">
                  <div className="percent-inner" style={{ width: `${0}%`, backgroundColor: gradient.rgbAt(0) }} />
                </div>
              </li>
            );
          }
          return (
            <li key={fid} className="feature-coverage">
              <label>
                {name}: {p}%
              </label>
              <div className="coverage-percent">
                <div className="percent-inner" style={{ width: `${p}%`, backgroundColor: gradient.rgbAt(p / 100) }} />
              </div>
            </li>
          );
        })}
        <li>
          <Link to="/tools/coverage">See more...</Link>
        </li>
      </ul>
    );
  }

  render() {
    if (this.state.loading) return this.renderLoading();
    return (
      <div className="rekit-tools-test-coverage-summary">
        {this.state.error && (
          <Alert message={`Failed to request test coverage data: ${this.state.error}`} type="error" showIcon />
        )}
        {this.state.noData && (
          <div>
            <Alert message="No coverage data found. Need to run tests first." type="info" showIcon />
            <Button type="primary" onClick={this.handleRunTests}>
              Run tests now
            </Button>
          </div>
        )}
        {this.state.reportData && this.renderReport()}
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

export default connect(mapStateToProps)(TestCoverageSummary);
