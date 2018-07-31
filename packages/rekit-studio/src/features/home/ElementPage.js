import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CodeEditor } from '../editor';
import * as actions from './redux/actions';

export class ElementPage extends Component {
  static propTypes = {
    elementById: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  getElement() {
    const { elementId } = this.props.match.params;
    let { view } = this.props.match.params;
    const eleId = decodeURIComponent(elementId);
    const ele = this.byId(eleId);
    if (!view && ele.views && ele.views.length > 0) {
      view = (_.find(ele.views, 'isDefault') || ele.views[0]).name;
    }
    if (view) return this.byId(_.find(ele.views, { name: view }).target);
    return ele;
  }

  getFileElement() {
    const { elementId, view } = this.props.match.params;
    const eleId = decodeURIComponent(elementId);
    const ele = this.byId(eleId);

    if (ele.views && ele.views.length) {
      let viewEle;

      if (!view) viewEle = _.find(ele.views, 'isDefault') || ele.views[0];
      else viewEle = _.find(ele.views, p => p.name === view);

      if (viewEle) viewEle = this.byId(viewEle.target);
      if (viewEle) return viewEle.type === 'file' ? viewEle : null;
    } else if (ele.type === 'file') {
      return ele;
    }
    return null;
  }
  // Get component to show the element
  getComponent() {}
  byId = id => this.props.elementById[id];

  render() {
    const fileEle = this.getFileElement();
    if (!fileEle)
      return (
        <div className="home-element-page" style={{ color: 'red' }}>
          No component to show the element.
        </div>
      );
    return <div className="home-element-page">{fileEle && <CodeEditor file={fileEle.id} />}</div>;
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
