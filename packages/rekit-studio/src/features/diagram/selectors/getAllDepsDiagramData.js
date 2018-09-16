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

    // All nodes should be in the deps diagram.
    const eles = Object.values(elementById).filter(
      n => !n.owner && n.type !== 'folder' && (n.type === 'file' || n.parts || n.target)
    );

    const avgAngle = (Math.PI * 2) / eles.length;
    let nodes = eles.map((ele, index) => {
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

    let links = [];
    eles.forEach(ele => {
      const eleDeps = deps.dependencies[ele.id] || [];
      eleDeps.forEach(dep => {
        links.push({
          source: ele.id,
          target: dep,
        });
      });
    });

    console.log(deps, links);

    nodes = _.uniqBy(nodes, 'id');
    links = _.uniqWith(links, _.isEqual);

    const nodeIdHash = nodes.reduce((h, n) => {
      h[n.id] = true;
      return h;
    }, {});
    links = links.filter(l => {
      if (!nodeIdHash[l.source])
        console.error(`getAllDepsDiagramData: Link source ${l.source} doesn't exist.`);
      else if (!nodeIdHash[l.target])
        console.error(`getAllDepsDiagramData: Link target ${l.target} doesn't exist.`);
      else return true;
      return false;
    });

    return { nodes, links };
  }
);
