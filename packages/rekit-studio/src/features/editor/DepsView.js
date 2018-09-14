import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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

    const ele = byId(dep);
    if (!ele) return '';
    let url = `/element/${encodeURIComponent(ele.id)}`;
    let name = ele.name;
    let icon = ele.icon;
    let iconColor = ele.iconColor;
    if (ele.owner) {
      const owner = byId(ele.owner);
      const view = owner.views ? _.find(owner.views, { target: ele.id }) : null;
      if (view) url = `/element/${encodeURIComponent(owner.id)}/${view.key}`;
      else url = `/element/${encodeURIComponent(owner.id)}/${ele.name}`;

      icon = owner.icon;
      iconColor = owner.iconColor;
      name = (
        <span>
          {owner.name}
          <span style={{ opacity: 0.3 }}>/{ele.name}</span>
        </span>
      );
    }

    return (
      <dd key={url}>
        <Link title={ele.id} to={url}>
          <SvgIcon type={icon} style={{ fill: iconColor }} />
          {name}
        </Link>
      </dd>
    );
  };

  render() {
    const { elements, elementById, file } = this.props;
    const depsData = getDepsData({ elements, elementById });
    const byId = id => elementById[id];
    const ele = byId(file);
    // const eid = ele.owner || ele.id;
    let dependencies = [...(depsData.dependencies[ele.id] || [])];
    let dependents = [...(depsData.dependents[ele.id] || [])];

    dependencies = dependencies.filter(
      d => !(byId(d) && byId(d).owner && byId(d).owner === ele.owner)
    );
    dependents = dependents.filter(d => !(byId(d) && byId(d).owner && byId(d).owner === ele.owner));

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
        <dl className="dependencies">
          <dt>
            <SvgIcon type="arrow-right" />
            Dependencies ({dependencies.length})
          </dt>
          {dependencies.map(this.renderLink)}
        </dl>

        <dl className="dependents">
          <dt>
            <SvgIcon type="arrow-left" />
            Dependents ({dependents.length})
          </dt>
          {dependents.map(this.renderLink)}
        </dl>
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
