import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col, Row } from 'antd';
import plugin from '../../common/plugin';
import { AllDepsDiagramView } from '../diagram';
import { getTypesCount } from './selectors/projectData';
import { SvgIcon } from '../common';
import colors from '../../common/colors';
import icons from '../../common/icons';

export class HomePage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
  };

  // state = {
  //   svgSize: 460,
  // };

  // componentWillMount() {
  //   this.handleWindowResize();
  //   window.addEventListener('resize', this.handleWindowResize);
  // }
  // componentWillUnmount() {
  //   // NOTE: with RHL, it may not be executed when hot replacement happens,
  //   // and then causes errors about setState on unmounted component.
  //   // Just ignore it for now.
  //   window.removeEventListener('resize', this.handleWindowResize, false);
  // }

  // handleWindowResize = () => {
  //   const width = window.innerWidth;
  //   const height = window.innerHeight;
  //   // TODO: fix magic numbers for the diagram.
  //   // 800: min-width of the antd Row
  //   // 320: side panel width
  //   // 80: page container paddings
  //   // 2/3: antd col/row
  //   // 30: diagram container Col right-padding
  //   // 60: diagram margins
  //   const minWidth = 800 * 2 / 3 - 30 - 20;
  //   let size = Math.min(height - 336, (width - this.props.home.sidePanelWidth - 60) * 2 / 3 - 30 - 20);
  //   if (size < minWidth) size = minWidth;
  //   this.setState({
  //     svgSize: size,
  //   });
  // }

  // renderOverviewDiagramHelp() {
  //   return (
  //     <div className="home-home-page-overview-diagram-help">
  //       <ul>
  //         <li>
  //           <span className="feature" /> Feature
  //         </li>
  //         <li>
  //           <span className="action" /> Action
  //         </li>
  //         <li>
  //           <span className="component" /> Component
  //         </li>
  //         <li>
  //           <span className="misc" /> Misc
  //         </li>
  //       </ul>
  //       <p>
  //         The gragh provides an interactive overview of the project architecture. You could also choose which features
  //         to show and choose whether to show internal deps.
  //       </p>
  //       <p>
  //         It helps to quickly understand the project by features rather than be lost in massive dependencies among es
  //         modules.
  //       </p>
  //     </div>
  //   );
  // }

  // renderTestCoverageHelp() {
  //   return (
  //     <div className="home-home-page-test-coverage-summary-help">
  //       <p>
  //         Rekit uses <a href="https://github.com/gotwarlost/istanbul">istanbul</a> to generate test coverage report.
  //         After running all tests against the project, the test coverage will be available. Running a single test or
  //         tests of a folder does not generate coverage report.
  //       </p>
  //       <p>Note that if some tests failed, the report data may be incomplete.</p>
  //     </div>
  //   );
  // }
  renderBadges() {
    const { typesCount } = this.props;
    const ps = plugin.getPlugins('dashboard.badges');
    const badges = ps.length ? _.last(ps).dashboard.badges : [];
    return (
      <div className="top-badges">
        {badges.map(b => (
          <div className="top-badge" key={b.type}>
            <SvgIcon size={28} type={icons(b.type)} fill={colors(b.type)} />
            <label className="count">{_.isFunction(b.count) ? b.count() : typesCount[b.type]}</label>
            <label className="type">{b.name}</label>
          </div>
        ))}
      </div>
    );
  }

  render() {
    // const { features, featureById } = this.props.home;
    const p = _.last(plugin.getPlugins('dashboard.OverviewDiagram'));

    const OverviewDiagram = p ? p.dashboard.OverviewDiagram : AllDepsDiagramView;
    return (
      <div className="home-home-page">
        {this.renderBadges()}
        <Row style={{ minWidth: 800 }} gutter={30}>
          <Col span="16">
            <h3>Overview Diagram</h3>
            <div className="diagram-container">
              <OverviewDiagram />
            </div>
          </Col>
          <Col span="8" className="test-coverage-container">
            <h3>Test Coverage</h3>
            <div className="test-coverage">No data.</div>
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
    typesCount: getTypesCount(state.home),
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
