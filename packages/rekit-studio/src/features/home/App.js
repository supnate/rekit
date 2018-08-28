import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import enUS from 'antd/lib/locale-provider/en_US';
import { LocaleProvider, message, Modal, Spin } from 'antd';
import SplitPane from 'react-split-pane/lib/SplitPane';
import Pane from 'react-split-pane/lib/Pane';
import { ErrorBoundary } from '../common';
import { storage } from '../common/utils';
import { TabsBar, SidePanel, SidePanelResizer, QuickOpen } from './';
import DialogPlace from '../rekit-cmds/DialogPlace';
import { DialogContainer } from '../core';
import { fetchProjectData, resizePane } from './redux/actions';

/*
  This is the root component of your app. Here you define the overall layout
  and the container of the react router. The default one is a two columns layout.
  You should adjust it acording to the type of your app.
*/

export class App extends Component {
  static propTypes = {
    // home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    elementById: PropTypes.object,
    openTabs: PropTypes.array,
    sidePanelWidth: PropTypes.number.isRequired,
    projectDataNeedReload: PropTypes.bool.isRequired,
    fetchProjectDataError: PropTypes.any,
    fetchProjectDataPending: PropTypes.bool.isRequired,
    // dispatch: PropTypes.func.isRequired,
    // location: PropTypes.object.isRequired,
  };

  static defaultProps = {
    elementById: null,
    fetchProjectDataError: null,
    openTabs: [],
  };

  componentDidMount() {
    this.props.actions
      .fetchProjectData()
      .then(() => {
        document.title = this.props.projectName;
        // For rendering tabs bar
        // this.props.dispatch({
        //   type: '@@router/LOCATION_CHANGE',
        //   payload: this.props.location,
        // });
      })
      .catch(err => {
        Modal.error({
          title: 'Failed to load project data',
          content: err && (err.message || err.toString()),
        });
      });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.projectDataNeedReload &&
      !prevProps.projectDataNeedReload &&
      !this.props.fetchProjectDataError &&
      !this.props.fetchProjectDataPending
    ) {
      this.props.actions.fetchProjectData().catch(e => {
        console.log('failed to fetch project data: ', e);
        message.error('Failed to refresh project data');
      });
    }
  }
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.projectDataNeedReload && !nextProps.fetchProjectDataError && !nextProps.fetchProjectDataPending) {
  //     this.props.actions.fetchProjectData().catch(e => {
  //       console.log('failed to fetch project data: ', e);
  //       message.error('Failed to refresh project data');
  //     });
  //   }
  // }

  handleResizeEnd(paneId, size) {}

  renderLoading() {
    return (
      <div className="home-app loading">
        <Spin />
        <span style={{ marginLeft: 20 }}>Loading...</span>
      </div>
    );
  }

  render() {
    if (!this.props.elementById) {
      return this.renderLoading();
    }

    // const currentTab = _.find(this.props.openTabs, t => t.isActive);
    // const hasSubTabs = currentTab && currentTab.subTabs && currentTab.subTabs.length > 0;

    // const pageContainerStyle = {
    //   left: `${this.props.sidePanelWidth}px`,
    //   top: hasSubTabs ? '80px' : '44px',
    // };

    return (
      <LocaleProvider locale={enUS}>
        <div className="home-app">
          <SplitPane split="vertical" onResizeEnd={args => this.handleResizeEnd('main-vertical', args)}>
            <Pane>
              <SidePanel />
            </Pane>
            <Pane>
              <div className="header">
                <TabsBar />
              </div>
              <SplitPane split="horizontal">
                <Pane>{this.props.children}</Pane>
                <Pane>ccc</Pane>
              </SplitPane>
            </Pane>
          </SplitPane>
          <DialogContainer />
          <QuickOpen />
        </div>
      </LocaleProvider>
    );
  }
}
// <SplitPane className="home-app">

//           <SidePanel />
//           <Pane className="header">
//           <TabsBar />
//           </Pane>
//           <SidePanelResizer />
//           <div id="page-container" className="page-container" style={pageContainerStyle}>
//             {this.props.children}
//           </div>
//           <DialogPlace />
//           <DialogContainer />
//           <QuickOpen />
//         </SplitPane>
function mapStateToProps(state) {
  return {
    ..._.pick(state.home, [
      'sidePanelWidth',
      'projectName',
      'elementById',
      'features',
      'openTabs',
      'projectDataNeedReload',
      'fetchProjectDataError',
      'fetchProjectDataPending',
    ]),
    // location: state.router.location,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ fetchProjectData, resizePane }, dispatch),
    // dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
