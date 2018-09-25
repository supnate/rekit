import _ from 'lodash';
import { createSelector } from 'reselect';
import { getGroupedDepsData } from '../../home/selectors/projectData';

const elementByIdSelector = state => state.elementById;
const sizeSelector = state => state.size;
const toShowSelector = state => state.toShow;

const padding = size => Math.max(size / 15, 20);
const nodeWidth = size => Math.max(size / 50, 6);

const getPos = node => {
  const radius = node.radius - node.width / 2;
  const angle = (node.startAngle + node.endAngle) / 2;
  const x = node.x + radius * Math.cos(angle);
  const y = node.y + radius * Math.sin(angle);
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

  const radius = source.radius - source.width / 2;
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

  const m1 = m * sintheta;
  const m2 = m * costheta;

  // Use c and d to find cpx and cpy
  const cpx = jx - m1;
  const cpy = jy + m2;

  return { x1, y1, x2, y2, cpx, cpy, source, target };
};

let toShow;
const ensureArray = (obj, name) => (obj[name] ? obj[name] : (obj[name] = []));

const calcAngles = (eles, containerStart, containerAngle, gapRate, isCircle) => {
  // eleAngle * count + gap * gapCount = containerAngle
  // gap = eleAngle * gapRate
  // gapCount = isCircle ? count + 1 : count;
  const count = eles.length;
  const gapCount = isCircle ? count : count - 1;
  let gap;
  if (gapRate === 0) gap = 0;
  else if (gapRate < 0) gap = (Math.PI * 2 * Math.abs(gapRate)) / 360;
  else gap = containerAngle / (count / gapRate + gapCount);

  const leftAngle = containerAngle - gap * gapCount;
  let start = containerStart;
  const total = eles.reduce((p, c) => p + c.weight, 0);
  return eles.map((ele, index) => {
    const angle = (ele.weight / total) * leftAngle;
    const res = {
      start,
      angle,
    };
    start = start + angle + gap;
    return res;
  });
};

const getFeatures = eleById => {
  const byId = id => eleById[id];
  return Object.values(eleById)
    .filter(ele => ele.type === 'feature')
    .filter(ele => /home|editor|common|core|layout/.test(ele.name))

    .map(f => {
      const elements = {};
      const feature = {
        id: f.id,
        name: f.name,
        dir: f.target,
        type: 'feature',
        elements,
      };
      const children = [...f.children];
      while (children.length) {
        const child = byId(children.pop());
        if (child.children) {
          children.push.apply(children, child.children);
        }
        if (toShow(child)) {
          ensureArray(elements, child.type).push(child);
        }
      }
      feature.weight = getFeatureEleCount({ elements });

      return feature;
    });
};

const getFeatureEleCount = f => {
  return Object.values(f.elements).reduce((c, arr) => c + arr.length, 0);
};

const nodeById = {};
const getNode = (ele, index, angles, x, y, radius, width, feature) => {
  const angle = angles[index];
  return (nodeById[ele.id] = {
    id: ele.id,
    name: ele.name,
    type: ele.type,
    radius,
    width,
    startAngle: angle.start,
    endAngle: angle.start + angle.angle,
    x,
    y,
    feature,
  });
};

export const getDepsDiagramByFeatureData = createSelector(
  elementByIdSelector,
  getGroupedDepsData,
  sizeSelector,
  toShowSelector,
  (elementById, deps, size, _toShow) => {
    // All nodes should be in the deps diagram.
    // const eles = Object.values(elementById).filter(toShow);
    toShow = _toShow;

    const x = size / 2;
    const y = size / 2;
    const nodes = [];
    const features = getFeatures(elementById);
    const angles = calcAngles(features, 0, Math.PI * 2, -3, true);

    const radius = size / 2 - padding(size);
    const innerRadius = radius - nodeWidth(size) - 2;

    features.forEach((f, index) => {
      const n = getNode(f, index, angles, x, y, radius, nodeWidth(size), f.name);
      nodes.push(n);
      const types = Object.keys(f.elements).map(k => ({
        id: `${f.id}-${k}-container`,
        type: `v:container-${k}`,
        name: k,
        weight: f.elements[k].length,
      }));
      const angles2 = calcAngles(types, n.startAngle, n.endAngle - n.startAngle, -0.2, false);
      types.forEach((type, index2) => {
        const n2 = getNode(type, index2, angles2, x, y, innerRadius, nodeWidth(size), f.name);
        nodes.push(n2);
        const eles = f.elements[type.name].map(ele => ({
          id: ele.id,
          type: ele.type,
          name: ele.name,
          weight: 1,
        }));
        const angles3 = calcAngles(eles, n2.startAngle, n2.endAngle - n2.startAngle, 0.3, false);
        eles.forEach((ele, index3) => {
          const n3 = getNode(ele, index3, angles3, x, y, innerRadius, nodeWidth(size), f.name);
          nodes.push(n3);
        });
      });
    });

    let links = [];
    Object.values(elementById).forEach(ele => {
      const eleDeps = deps.dependencies[ele.id] || [];
      eleDeps.forEach(dep => {
        const source = nodeById[ele.id];
        const target = nodeById[dep];
        if (source && target) links.push(getLink(source, target));
      });
    });

    links = _.uniqWith(links, _.isEqual);
    return { nodes, links, depsData: deps, nodeById };
  }
);
