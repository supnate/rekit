import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'antd';
import classnames from 'classnames';
import { SvgIcon } from '../common';
import { OutputView } from './';
import plugin from '../../common/plugin';

export default class BottomDrawer extends Component {
  static propTypes = {
    hideDrawer: PropTypes.func.isRequired,
  };

  state = { currentTab: 'output' };

  getPanes = _.memoize(() => {
    const panes = plugin.getPlugins('bottomDrawer.getPanes').reduce((arr, p) => {
      arr.push.apply(arr, p.bottomDrawer.getPanes());
      return arr;
    }, []);
    panes.sort((p1, p2) => p1.order - p2.order);
    panes.push({
      tab: 'Output',
      key: 'output',
      order: 10,
      component: OutputView,
    },{
      tab: 'Problems',
      key: 'problems',
      order: 1,
      component:  () => <div>problems</div>,
    },{
      tab: 'Terminal',
      key: 'teminal',
      order: 20,
      component: () => <div>terminal</div>,
    });
    return panes;
  });

  handleTabClick = key => {
    this.setState({ currentTab: key });
  };

  render() {
    const panes = this.getPanes();
    const { currentTab } = this.state;
    const currentPane = _.find(panes, { key: currentTab });
    return (
      <div className="home-bottom-drawer">
        <div className="toolbar">
          <div className="toolbar-tabs">
            {panes.map(pane => (
              <span
                key={pane.key}
                className={classnames('toolbar-tab', {
                  'is-active': pane.key === currentTab,
                })}
                onClick={() => this.handleTabClick(pane.key)}
              >
                {pane.tab}
              </span>
            ))}
          </div>
          <div className="toolbar-buttons">
            <Button
              icon="close"
              size="small"
              className="close-btn"
              shape="circle"
              onClick={this.props.hideDrawer}
            />
          </div>
        </div>
        <div className="content-container">
          {currentPane && <currentPane.component /> || 'No view'}
        </div>
      </div>
    );
  }
}
