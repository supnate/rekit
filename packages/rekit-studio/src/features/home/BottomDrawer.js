import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button } from 'antd';
import classnames from 'classnames';
import plugin from '../../common/plugin';
import { setBottomDrawerVisible, setBottomDrawerTab } from './redux/actions';

export class BottomDrawer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    bottomDrawerVisible: PropTypes.bool.isRequired,
    bottomDrawerTab: PropTypes.string.isRequired,
  };

  getPanes = _.memoize(() => {
    const panes = plugin.getPlugins('bottomDrawer.getPanes').reduce((arr, p) => {
      let ps = p.bottomDrawer.getPanes();
      if (!Array.isArray(ps)) ps = [ps];
      arr.push.apply(arr, ps);
      return arr;
    }, []);
    panes.sort((p1, p2) => p1.order - p2.order);
    return panes;
  });

  showDrawer = () => {
    this.props.actions.setBottomDrawerVisible(true);
    requestAnimationFrame(() => window.dispatchEvent(new window.Event('resize')));
  };

  hideDrawer = () => {
    this.props.actions.setBottomDrawerVisible(false);    
    requestAnimationFrame(() => window.dispatchEvent(new window.Event('resize')));
  };

  handleTabClick = (evt, key) => {
    this.props.actions.setBottomDrawerTab(key);
    this.props.actions.setBottomDrawerVisible(true);
    evt.stopPropagation();
  };

  handleToolbarClick = () => {
    this.props.actions.setBottomDrawerVisible(!this.props.bottomDrawerVisible);
  }

  render() {
    const panes = this.getPanes();
    const { bottomDrawerVisible, bottomDrawerTab } = this.props;
    const currentPane = _.find(panes, { key: bottomDrawerTab });
    return (
      <div className="home-bottom-drawer">
        <div className="toolbar" onClick={this.handleToolbarClick}>
          <div className="toolbar-tabs">
            {panes.map(pane => (
              <span
                key={pane.key}
                className={classnames('toolbar-tab', {
                  'is-active': bottomDrawerVisible && pane.key === bottomDrawerTab,
                })}
                onClick={(evt) => this.handleTabClick(evt, pane.key)}
              >
                {pane.tab}
              </span>
            ))}
          </div>
          <div className="toolbar-buttons">
            <Button
              icon={bottomDrawerVisible ? 'down-square' : 'up-square'}
              size="small"
              className="toggle-btn"
              shape="circle"
              onClick={bottomDrawerVisible ? this.hideDrawer : this.showDrawer}
            />
          </div>
        </div>
        {bottomDrawerVisible && (
          <div className="content-container">
            {(currentPane && <currentPane.component />) || 'No view for the tab.'}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    bottomDrawerVisible: state.home.bottomDrawerVisible,
    bottomDrawerTab: state.home.bottomDrawerTab,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ setBottomDrawerVisible, setBottomDrawerTab }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomDrawer);
