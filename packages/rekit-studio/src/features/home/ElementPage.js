import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CodeEditor } from '../editor';
import * as actions from './redux/actions';
import plugin from '../plugin/plugin';
import { ImageView } from './';

const CodeView = ({ element, viewElement }) => <CodeEditor file={viewElement && viewElement.target || element.id} />;
const DepsDiagramView = () => 'abc';

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
    if (!ele.views || !ele.views.length) {
      return null;
    }
    const { view } = this.props.match.params;
    if (!view) return _.find(ele.views, 'isDefault') || ele.views[0];
    else return _.find(ele.views, p => p.key === view);
  }
  // Get the view component to show the element
  getView(ele, viewEle) {
    let View = null;
    // Get view from plugins
    plugin
      .getPlugins('view.getView')
      .reverse()
      .some(p => {
        View = p.view.getView(ele, viewEle ? viewEle.key : null);
        if (View) return true;
        return false;
      });
    if (View) return View;

    if (!viewEle) {
      if (ele.type === 'file') {
        if (/^png|jpg|jpeg|gif|bmp|webp$/i.test(ele.ext)) return ImageView;
        if (ele.size < 100000) return CodeView;
      }
      return null;
    } else if (viewEle.key === 'diagram') {
      return DepsDiagramView;
    } else {
      return CodeView;
    }
  }

  byId = id => this.props.elementById[id];

  renderNotFound() {
    return <div className="home-element-page error">Element not found, please check URL or if the element exists.</div>;
  }

  renderNotSupported() {
    return <div className="home-element-page error">The element is not supported or size is too large.</div>;
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
