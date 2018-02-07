import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class AllRoutesPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { features, featureById } = this.props.home;
    const pr = _.partialRight;
    const routes = _.flow(_.values, pr(_.map, 'routes'), _.flatten)(featureById);
    console.log('all routes', routes);
    return (
      <div className="home-all-routes-page">
        <dl>
          {
            features.filter(fid => featureById[fid].routes.length > 0).map(fid => [
              <dt key={`#${fid}`}>{featureById[fid].name}</dt>,
              featureById[fid].routes.map(r => (
                <dd key={r.path}>
                  <a href={r.path} target="_blank">{r.path}</a>
                  <span>{` => ${r.component}`}</span>
                </dd>)
              )
            ])
          }
        </dl>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
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
)(AllRoutesPage);
