import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { SvgIcon } from '../common';
import { getDepsData } from '../home/selectors/projectData';

export class DepsView extends Component {
  static propTypes = {
    elementById: PropTypes.object.isRequired,
    elements: PropTypes.array.isRequired,
    file: PropTypes.string.isRequired,
  };

  renderLink = dep => {
    const byId = id => this.props.elementById[id];
    let ele = byId(dep);
    if (ele.owner) ele = byId(ele.owner);
    return (
      <dd key={ele.id}>
        <Link title={ele.id} to={`/element/${encodeURIComponent(ele.id)}`}>
          <SvgIcon type={ele.icon} style={{ fill: ele.iconColor }} />
          {ele.name}
        </Link>
      </dd>
    );
  };

  render() {
    const { elements, elementById, file } = this.props;
    const depsData = getDepsData({ elements, elementById });
    const byId = id => elementById[id];
    const ele = byId(file);
    const eid = ele.owner || ele.id;
    const dependencies = depsData.dependencies[eid] || [];
    const dependents = depsData.dependents[eid] || [];

    const sort = deps => {
      deps.sort((dep1, dep2) => {
        const ele1 = byId(dep1);
        const ele2 = byId(dep2);
        return ele1.type.localeCompare(ele2.type) || ele1.name.localeCompare(ele2.name);
      });
    };
    sort(dependencies);
    sort(dependents);

    return (
      <div className="editor-deps-view">
        {dependencies.length > 0 && (
          <dl className="dependencies">
            <dt>
              <SvgIcon type="arrow-right" /> Dependencies
            </dt>
            {dependencies.map(this.renderLink)}
          </dl>
        )}
        {dependents.length > 0 && (
          <dl className="dependents">
            <dt>
              <SvgIcon type="arrow-left" /> Dependents
            </dt>
            {dependents.map(this.renderLink)}
          </dl>
        )}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    editor: state.editor,
    elementById: state.home.elementById,
    elements: state.home.elements,
  };
}

export default connect(mapStateToProps)(DepsView);
