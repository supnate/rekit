import _ from 'lodash';
import { createSelector } from 'reselect';

const featuresSelector = state => state.features;
const featureByIdSelector = state => state.featureById;

function flattenMiscFiles(arr) {
  return _.flatten(arr.map(item => (item.children ? flattenMiscFiles(item.children) : item)));
}

export const getOverviewStat = createSelector(
  featuresSelector,
  featureByIdSelector,
  (features, featureById) => {
    const stat = {
      features: features.length,
      components: 0,
      actions: 0,
      misc: 0,
      routes: 0,
    };

    features.forEach((fid) => {
      const f = featureById[fid];
      stat.components += f.components.length;
      stat.actions += f.actions.length;
      stat.routes += f.routes.length;
      stat.misc += flattenMiscFiles(f.misc).length;
    });

    // some misc files like index.js, actions.js, constants.js, style.less should be excluded for statics
    stat.misc -= stat.features * 6;

    return stat;
  }
);

