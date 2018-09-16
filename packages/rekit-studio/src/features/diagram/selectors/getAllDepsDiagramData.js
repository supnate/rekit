import _ from 'lodash';
import { createSelector } from 'reselect';
import { getGroupedDepsData } from '../../home/selectors/projectData';
import colors from '../../../common/colors';

const elementByIdSelector = state => state.elementById;

export const getAllDepsDiagramData = createSelector(
  elementByIdSelector,
  getGroupedDepsData,
  (elementById, deps) => {
    const byId = id => elementById[id];

    let nodes = Object.values(elementById).filter(n => !n.owner && n.type !== 'folder');

    const avgAngle = Math.PI * 2 / nodes.length;
    nodes = nodes.map((ele, index) => {
      return {
        id: ele.id,
        name: ele.name,
        type: ele.type,
        color: colors(ele.type),
        x: 250,
        y: 250,
        startAngle: avgAngle * index,
        endAngle: avgAngle * index + avgAngle * 0.8,
        radius: 200,
      };
    });

    return { nodes, links: [] };
  }
);
