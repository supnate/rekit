import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { getElementDiagramData } from '../diagram/selectors/getElementDiagramData';
import { getElementUrl } from '../home/helpers';

const iconMap = {
  misc: 'file',
  component: 'appstore-o',
  action: 'notification'
};

export class DepsView extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    file: PropTypes.string.isRequired,
  };

  renderLink = dep => {
    const ele = this.props.home.elementById[dep];
    return (
      <dd key={ele.file}>
        <Link title={ele.file} to={getElementUrl(ele)}><Icon type={iconMap[ele.type] || 'file'} /> {ele.name}</Link>
      </dd>
    );
  };

  render() {
    const { home, file } = this.props;
    const diagramData = getElementDiagramData(home, file);
    const links = diagramData.links;
    const dependencies = [];
    const dependents = [];
    links.filter(link => link.type === 'dep').forEach(link => {
      if (link.source === file) dependencies.push(link.target);
      else if (link.target === file) dependents.push(link.source);
    });

    return (
      <div className="editor-deps-view">
        {dependencies.length > 0 && (
          <dl className="dependencies">
            <dt><Icon type="arrow-right" /> Dependencies</dt>
            {dependencies.map(this.renderLink)}
          </dl>
        )}
        {dependents.length > 0 && (
          <dl className="dependents">
            <dt><Icon type="arrow-left" /> Dependents</dt>
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
    home: state.home,
  };
}

export default connect(mapStateToProps)(DepsView);
