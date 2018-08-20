import _ from 'lodash';
import { createSelector } from 'reselect';

const elementByIdSelector = elementById => elementById;
const elementIdSelector = (elementById, elementId) => elementId;

export const getDepsDiagramData = createSelector(
  elementByIdSelector,
  elementIdSelector,
  (elementById, elementId) => {
    const ele = elementById[elementId];

    let links = [];
    let nodes = [];

    // Put the element itself
    nodes.push({
      name: ele.name,
      id: ele.id,
      radius: 50,
    });

    _.values(elementById).forEach((item) => {
      if (!item.deps) return;

      item.deps.forEach((dep) => {
        if (dep.type !== 'file') return;
        if (item.id === ele.id) {
          // it's element itself
          const depEle = elementById[dep.id];

          nodes.push({
            name: depEle.name,
            id: depEle.id,
            radius: 14,
          });

          links.push({
            source: ele.id,
            target: dep.id,
            type: 'dep',
          });
        } else if (dep.id === ele.id) {
          // if other depends on the ele
          nodes.push({
            name: item.name,
            id: item.id,
            radius: 14,
          });
          links.push({
            source: item.id,
            target: ele.id,
            type: 'dep',
          });
        }
      });
    });

    // remove duplicated nodes
    nodes = _.uniqBy(nodes, 'id');
    links = _.uniqBy(links, l => `${l.source}->${l.target}`);

    return { nodes, links };
  },
);
