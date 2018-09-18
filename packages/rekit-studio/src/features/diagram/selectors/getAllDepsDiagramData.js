import _ from 'lodash';
import { createSelector } from 'reselect';
import { getGroupedDepsData } from '../../home/selectors/projectData';

// const nodeWidth(size) = 10;
// const padding(size) = 20;

const elementByIdSelector = state => state.elementById;
const sizeSelector = state => state.size;
const padding = size => Math.max(size / 15, 20);

const nodeWidth = size => Math.max(size / 40, 6);

const getPos = (node, size) => {
  const radius = size / 2 - padding(size) - nodeWidth(size) / 2;
  const angle = (node.startAngle + node.endAngle) / 2;
  const x = size / 2 + radius * Math.cos(angle);
  const y = size / 2 + radius * Math.sin(angle);
  return { x, y, angle };
};

const getLink = (source, target, size) => {
  const pos1 = getPos(source, size);
  const pos2 = getPos(target, size);
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

  const radius = size / 2 - padding(size) - nodeWidth(size) / 2;
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
  sizeSelector,
  (elementById, deps, size) => {
    // All nodes should be in the deps diagram.
    const eles = Object.values(elementById).filter(
      n => !n.owner && n.type !== 'folder' && n.type !== 'folder-alias' && (n.type === 'file' || n.parts || n.target)
    );

    const groups = _.groupBy(eles, 'type');
    Object.values(groups).forEach(arr => arr.sort((a,b) => a.name.localeCompare(b.name)));
    const groupTypes = Object.keys(groups);

    const groupGap = (Math.PI * 2 * 0.4) / eles.length;
    const avgAngle = (Math.PI * 2 - groupTypes.length * groupGap) / eles.length;
    const startAngleByType = {};
    let typeStartAngle = 0;
    let nodes = [];
    let groupNodes = [];
    const nodeById = {};
    groupTypes.forEach(type => {
      groupNodes.push({
        id: type,
        x: size / 2,
        y: size / 2,
        width: nodeWidth(size),
        startAngle: typeStartAngle,
        endAngle: typeStartAngle + groups[type].length * avgAngle,
        type,
        radius: size / 2 - padding(size),
        pieRadius: size / 2 - nodeWidth(size) / 2 - padding(size),
      });
      startAngleByType[type] = typeStartAngle;

      groups[type].forEach((ele, index) => {
        const len = groups[type].length;
        const groupAngle = avgAngle * len;
        // How eleAngle calculated? See below formula
        // len * eleAngle + (len + 1) * eleGap = groupAngle
        // eleGap = eleAngle * 20%
        // paddingAngle = eleAngle * 20%
        const eleAngle = groupAngle / (1.2 * len + 0.2);
        const eleGap = eleAngle * 0.2;
        const startAngle = typeStartAngle + eleGap + index * (eleGap + eleAngle);
        const n = {
          id: ele.id,
          name: ele.name,
          type: ele.type,
          x: size / 2,
          y: size / 2,
          width: nodeWidth(size),
          startAngle,
          endAngle: startAngle + eleAngle,
          radius: size / 2 - padding(size),
        };
        nodeById[n.id] = n;
        nodes.push(n);
      });
      typeStartAngle += groups[type].length * avgAngle + groupGap;
    });

    let links = [];
    eles.forEach(ele => {
      const eleDeps = deps.dependencies[ele.id] || [];
      eleDeps.forEach(dep => {
        const source = nodeById[ele.id];
        const target = nodeById[dep];
        links.push(getLink(source, target, size));
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

    return { nodes, links, groups: groupNodes, depsData: deps };
  }
);
