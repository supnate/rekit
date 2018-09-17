import _ from 'lodash';
import { createSelector } from 'reselect';
import { getGroupedDepsData } from '../../home/selectors/projectData';

const elementByIdSelector = state => state.elementById;

const getPos = (node) => {
  const angle = (node.startAngle + node.endAngle) /2 ;
  const x = 250 + 195 * Math.cos(angle);
  const y = 250 + 195 * Math.sin(angle);
  return { x, y, angle };
};

const getLink = (source, target) => {
  const pos1 = getPos(source);
  const pos2 = getPos(target);
  const x1 = pos1.x;
  const y1 = pos1.y;
  const x2 = pos2.x;
  const y2 = pos2.y;

  const jx = (x1 + x2) / 2;
  const jy = (y1 + y2) / 2;

  // We need a and b to find theta, and we need to know the sign of each to make sure that the orientation is correct.
  const a = x2 - x1;
  const asign = a < 0 ? -1 : 1;
  const b = y2 - y1;

  const theta = Math.atan(b / a);

  // Find the point that's perpendicular to J on side
  const costheta = asign * Math.cos(theta);
  const sintheta = asign * Math.sin(theta);

  const radius = 195;
  let ang = Math.abs(pos1.angle - pos2.angle);
  if (ang > Math.PI) ang = 2 * Math.PI - ang;
  ang /= 2;
  const d1 = Math.abs(radius * Math.cos(ang));
  // const d2 = radius - d1;
  const d2 = radius * Math.sin(ang);

  let d = d1;
  if (d > d2 * 2) d = d2 * 2;
  let s = pos1.angle;
  let t = pos2.angle;
  if (Math.abs(s - t) > Math.PI) {
    if (s < t) s += 2 * Math.PI;
    else t += 2 * Math.PI;
  }
  const m = s < t ? d : -d;
  // if (source.angle - target.angle > Math.PI) d = -d;

  const m1 = m * sintheta;
  const m2 = m * costheta;

  // Use c and d to find cpx and cpy
  const cpx = jx - m1;
  const cpy = jy + m2;

  return { x1, y1, x2, y2, cpx, cpy, source, target };
};

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
    const nodeById = {};
    let nodes = eles.map((ele, index) => {
      const n = {
        id: ele.id,
        name: ele.name,
        type: ele.type,
        // color: colors(ele.type),
        x: 250,
        y: 250,
        startAngle: avgAngle * index,
        endAngle: avgAngle * index + avgAngle * 0.8,
        radius: 200,
      };
      nodeById[n.id] = n;
      return n;
    });

    let links = [];
    eles.forEach(ele => {
      const eleDeps = deps.dependencies[ele.id] || [];
      eleDeps.forEach(dep => {
        const source = nodeById[ele.id];
        const target = nodeById[dep];
        links.push(getLink(source, target));
      });
    });

    nodes = _.uniqBy(nodes, 'id');
    links = _.uniqWith(links, _.isEqual);

    const nodeIdHash = nodes.reduce((h, n) => {
      h[n.id] = true;
      return h;
    }, {});
    links = links.filter(l => {
      if (!nodeIdHash[l.source.id])
        console.error(`getAllDepsDiagramData: Link source ${l.source} doesn't exist.`);
      else if (!nodeIdHash[l.target.id])
        console.error(`getAllDepsDiagramData: Link target ${l.target} doesn't exist.`);
      else return true;
      return false;
    });

    return { nodes, links };
  }
);
