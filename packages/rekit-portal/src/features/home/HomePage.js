import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Col, Icon, Popover, Row } from 'antd';
import { OverviewChordDiagram } from '../diagram';
import { TestCoverageSummary } from '../rekit-tools';
import { getOverviewStat } from './selectors/getOverviewStat';

export class HomePage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
  };

  state = {
    svgSize: 460,
  };

  componentWillMount() {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
  }
  componentWillUnmount() {
    // NOTE: with RHL, it may not be executed when hot replacement happens,
    // and then causes errors about setState on unmounted component.
    // Just ignore it for now.
    window.removeEventListener('resize', this.handleWindowResize, false);
  }

  @autobind
  handleWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // TODO: fix magic numbers for the diagram.
    // 800: min-width of the antd Row
    // 320: side panel width
    // 80: page container paddings
    // 2/3: antd col/row
    // 40: diagram container Col right-padding
    // 60: diagram margins
    const minWidth = 800 * 2 / 3 - 40 - 60;
    let size = Math.min(height - 310, (width - 300 - 80) * 2 / 3 - 40 - 60);
    if (size < minWidth) size = minWidth;
    this.setState({
      svgSize: size,
    });
  }

  renderOverviewDiagramHelp() {
    return (
      <div className="home-home-page-overview-diagram-help">
        <ul>
          <li><span className="feature" /> Feature</li>
          <li><span className="action" /> Action</li>
          <li><span className="component" /> Component</li>
          <li><span className="misc" /> Misc</li>
        </ul>
        <p>
          The gragh provides an interactive overview of the project architecture.
          You could also choose which features to show and choose whether to show internal deps.
        </p>
        <p>
          It helps to quickly understand the project by features rather than be lost in massive dependencies among es modules.
        </p>
      </div>
    );
  }

  renderTestCoverageHelp() {
    return (
      <div className="home-home-page-test-coverage-summary-help">
        <p>
          Rekit uses <a href="https://github.com/gotwarlost/istanbul">istanbul</a> to generate test coverage report.
          After running all tests against the project, the test coverage will be available.
          Running a single test or tests of a folder does not generate coverage report.
        </p>
        <p>
          Note that if some tests failed, the report data may be incomplete.
        </p>
      </div>
    );
  }

  render() {
    const { features, featureById } = this.props.home;
    const overviewStat = getOverviewStat({ features, featureById });
    return (
      <div className="home-home-page">
        <Row className="top-badges">
          <Col span="6">
            <div className="top-badge feature">
              <Icon type="book" />
              <label className="count">{overviewStat.features}</label>
              <label className="type">features</label>
            </div>
          </Col>
          <Col span="6">
            <div className="top-badge route">
              <Icon type="share-alt" />
              <label className="count">{overviewStat.routes}</label>
              <label className="type">routes</label>
            </div>
          </Col>
          <Col span="6">
            <div className="top-badge action">
              <Icon type="notification" />
              <label className="count">{overviewStat.actions}</label>
              <label className="type">actions</label>
            </div>
          </Col>
          <Col span="6">
            <div className="top-badge component">
              <Icon type="appstore-o" />
              <label className="count">{overviewStat.components}</label>
              <label className="type">components</label>
            </div>
          </Col>
        </Row>
        <Row style={{ minWidth: 800 }}>
          <Col span="16" className="diagram-container">
            <Popover placement="leftTop" title={<p style={{ fontSize: 18 }}>Overview diagram</p>} content={this.renderOverviewDiagramHelp()}>
              <Icon style={{ color: '#108ee9', fontSize: 16, float: 'right', marginTop: 38 }} type="question-circle-o" />
            </Popover>
            <h3>Overview diagram</h3>
            <OverviewChordDiagram size={this.state.svgSize} />
          </Col>
          <Col span="8" className="test-coverage-container">
            <Popover placement="leftTop" title={<p style={{ fontSize: 18 }}>Test coverage</p>} content={this.renderTestCoverageHelp()}>
              <Icon style={{ color: '#108ee9', fontSize: 16, float: 'right', marginTop: 38 }} type="question-circle-o" />
            </Popover>
            <h3>Test coverage</h3>
            <TestCoverageSummary />
          </Col>
        </Row>
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
)(HomePage);
