import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CodeEditor } from '../editor';
import * as actions from './redux/actions';
import plugin from '../plugin/plugin';

const CodeView = ({ viewElement }) => <CodeEditor file={viewElement.target || viewElement.id} />;

export class ElementPage extends Component {
  static propTypes = {
    elementById: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  getElement() {
    const { elementId } = this.props.match.params;
    const eleId = decodeURIComponent(elementId);
    return this.byId(eleId);
  }
  getViewElement(ele) {
    const { view } = this.props.match.params;
    if (!ele.views || !ele.views.length) {
      return view ? null : ele;
    }
    if (!view) return _.find(ele.views, 'isDefault') || ele.views[0];
    else return _.find(ele.views, p => p.key === view);
  }
  // Get the view component to show the element
  getView(ele, viewEle) {
    if (!viewEle) return null;

    let View = null;

    // TODO: get view from plugins
    plugin
      .getPlugins('view.getView')
      .reverse()
      .some(p => {
        View = p.view.getView(ele, viewEle.key);
        if (View) return true;
        return false;
      });

    // By default use code editor for text files

    if (!View) {
      // Default view to show file
      let targetEle = ele;
      if (viewEle.target) {
        targetEle = this.byId(viewEle.target);
        if (!targetEle) return null;
      }
      if (targetEle.type === 'file' && targetEle.id) {
        View = CodeView;
      }
    }
    return View;
  }

  byId = id => this.props.elementById[id];

  renderNotFound() {
    return <div className="home-element-page error">Element not found, please check URL or if the element exists.</div>;
  }

  renderNotSupported() {
    return <div className="home-element-page error">The current view of the element is not supported to show.</div>;
  }

  render() {
    const ele = this.getElement();
    if (!ele) {
      return this.renderNotFound();
    }

    const viewEle = this.getViewElement(ele);

    if (viewEle && viewEle.target && !this.byId(viewEle.target)) {
      return this.renderNotFound();
    }

    const View = this.getView(ele, viewEle);
    if (!View) {
      return this.renderNotSupported();
    }
    return (
      <div className="home-element-page">
        <View element={ele} viewElement={viewEle} match={this.props.match} />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    ..._.pick(state.home, ['elementById']),
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ElementPage);
