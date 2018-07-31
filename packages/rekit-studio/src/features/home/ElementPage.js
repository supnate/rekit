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
    let { part } = this.props.match.params;
    const eleId = decodeURIComponent(elementId);
    const ele = this.byId(eleId);
    if (!part && ele.parts && ele.parts.length > 0) {
      part = (_.find(ele.parts, 'isDefault') || ele.parts[0]).name;
    }
    if (part) return this.byId(_.find(ele.parts, { name: part }).target);
    return ele;
  }

  getFileElement() {
    const { elementId, part } = this.props.match.params;
    const eleId = decodeURIComponent(elementId);
    const ele = this.byId(eleId);

    if (ele.parts && ele.parts.length) {
      let partEle;

      if (!part) partEle = _.find(ele.parts, 'isDefault') || ele.parts[0];
      else partEle = _.find(ele.parts, p => p.name === part);

      if (partEle) partEle = this.byId(partEle.target);
      if (partEle) return partEle.type === 'file' ? partEle : null;
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
