import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Alert, Icon, Tabs } from 'antd';
import history from '../../common/history';
import { CodeView } from './';

const TabPane = Tabs.TabPane;
export class RoutesPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    home: PropTypes.object.isRequired,
  };

  @autobind
  handleTabChange(tabKey) {
    const fid = this.props.match.params.feature;
    switch (tabKey) {
      case 'rules':
        history.push(`/${fid}/routes`);
        break;
      case 'code':
        history.push(`/${fid}/routes/code`);
        break;
      default:
        break;
    }
  }

  renderNotFound(fid) {
    return (
      <div className="home-routes-page">
        <span style={{ color: 'red' }}>Feature not found: {fid}.</span>
      </div>
    );
  }

  render() {
    const params = this.props.match.params;
    const fid = params.feature;
    let tabKey = params.type;
    if (tabKey !== 'code') tabKey = 'rules';
    const feature = this.props.home.featureById[fid];
    if (!feature) {
      return this.renderNotFound(fid);
    }
    const routes = feature.routes;
    const devPort = this.props.home.rekit.devPort;

    const codeFile = `src/features/${fid}/route.js`;
    return (
      <div className="home-routes-page">
        <h2><Icon type="share-alt" /> &nbsp;{fid} / routes</h2>
        <Tabs activeKey={tabKey} animated={false} onChange={this.handleTabChange}>
          <TabPane tab="Rules" key="rules">
            <p>This is a rough overview of routing config defined in a feature. </p>
            <p>If a route rule isIndex === true and also has a path property then there will be two rules.</p>
            <p>For more detailed information, please look into the <Link to={`/${fid}/routes/code`}>code</Link>.</p>
            <p>NOTE: if route path has parameters, you need to alter the link address with correct values after click the route link. </p>
            {routes.length === 0
              ? <Alert type="info" message="No routing rules defined." showIcon />
              :
              <table>
                <thead>
                  <tr>
                    <th>Path</th>
                    <th>Component</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map(route => (
                    <tr key={route.path}>
                      <td><a href={`//localhost:${devPort}${route.path}`} target="_blank">{route.path}</a></td>
                      <td>{fid}/{route.component}</td>
                    </tr>
                  ))}
                </tbody>
              </table>}
          </TabPane>
          <TabPane tab="Code" key="code">
            <CodeView file={codeFile} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    rekitCmds: state.rekitCmds,
    home: state.home,
  };
}

export default connect(
  mapStateToProps,
)(RoutesPage);
