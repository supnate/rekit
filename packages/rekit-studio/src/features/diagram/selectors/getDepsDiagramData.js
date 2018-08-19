import _ from 'lodash';
import { createSelector } from 'reselect';

const elementByIdSelector = elementById => elementById;
const elementIdSelector = (elementById, elementId) => elementId;

export const getDepsDiagramData = createSelector(
  elementByIdSelector,
  elementIdSelector,
  (elementById, elementId) => {console.log('get deps diagram data')
    const ele = elementById[elementId];

    let links = [];
    let nodes = [];

    // Put the element itself
    nodes.push({
      name: ele.name,
      id: ele.id,
      type: ele.type,
      r: 50,
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
            type: depEle.type,
            r: 14,
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
            type: item.type,
            r: 14,
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

    // add features node
    // nodes.forEach((n) => {
    //   const ele = elementById[n.id];
    //   if (n.type === 'constant') {
    //     n.name = 'constants';
    //     n.type = 'misc';
    //   }
    //   if (ele && ele.feature && ele.feature !== element.feature) {
    //     if (!_.find(nodes, { id: ele.feature })) {
    //       nodes.push({
    //         name: featureById[ele.feature].name,
    //         id: ele.feature,
    //         type: 'feature',
    //         r: 22,
    //       });

    //       links.push({
    //         source: element.file,
    //         target: ele.feature,
    //         type: 'no-line',
    //       });
    //     }
    //     links.push({
    //       source: ele.feature,
    //       target: n.id,
    //       type: 'child',
    //     });
    //   }
    // });

    // const featureNodes = nodes.filter(n => n.type === 'feature');

    // // Third, add links of features
    // for (let i = 0; i < featureNodes.length; i++) {
    //   for (let j = i + 1; j < featureNodes.length; j++) {
    //     links.push({
    //       source: featureNodes[i],
    //       target: featureNodes[j],
    //       type: 'no-line',
    //     });
    //   }
    // }

    return { nodes, links };
  },
);
