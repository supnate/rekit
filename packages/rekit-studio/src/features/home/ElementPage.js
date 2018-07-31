import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class ElementPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
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

  byId = id => this.props.elementById[id];

  render() {
    console.log('match:', this.props.match);
    return (
      <div className="home-element-page">
        {this.getElement().id}
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
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ElementPage);
