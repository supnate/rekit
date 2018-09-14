import _ from 'lodash';
import { createSelector } from 'reselect';
import { getDepsDiagramData } from '../../diagram/selectors/getDepsDiagramData';
import colors from '../colors';

const elementByIdSelector = state => state.elementById;
const elementIdSelector = state => state.elementId;

export const getElementDiagramData = createSelector(
  getDepsDiagramData,
  elementByIdSelector,
  elementIdSelector,
  (depsData, elementById, elementId) => {
    const byId = id => elementById[id];
    const { nodes, links } = depsData;
console.log(nodes, 'links:', links);
    const realNodes = [];

    nodes.forEach(node => {
      let ele = byId(node.id);
      if (ele.owner) ele = byId(ele.owner);
      if (ele && !_.find(realNodes, { id: ele.id })) {
        realNodes.push({
          ...node,
          name: ele.name,
          id: ele.id,
          bgColor: colors[ele.type] || colors.diagram,
        });
      }

      links.forEach(l => {
        if (l.source === node.id) l.source = ele.id;
        if (l.target === node.id) l.target = ele.id;
      });

    });
    console.log(realNodes, links);
    return { nodes: realNodes, links: _.uniqWith(links, _.isEqual) };
  },
);
