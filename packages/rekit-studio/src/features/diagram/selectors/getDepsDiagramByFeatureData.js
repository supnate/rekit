import _ from 'lodash';
import { createSelector } from 'reselect';
import { getGroupedDepsData } from '../../home/selectors/projectData';

// const nodeWidth(size) = 10;
// const padding(size) = 20;

const elementByIdSelector = state => state.elementById;
const sizeSelector = state => state.size;
const typesSelector = state => state.types;
const padding = size => Math.max(size / 15, 20);

const nodeWidth = size => Math.max(size / 50, 6);

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

// const toShow = ele =>
//   !ele.owner &&
//   ele.type !== 'folder' &&
//   ele.type !== 'folder-alias' &&
//   (ele.type === 'file' || ele.parts || ele.target);

const toShow = ele => /^file|component|action$/.test(ele.type);

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
    // .filter(ele => /home|diagram|editor/.test(ele.name))
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

// const getFeatureAngles = (features, featureGap) => {
//   const totalAngle = 2 * Math.PI - features.length * featureGap;
//   const angles = {};
//   let count = 0;
//   features.forEach(f => {
//     Object.keys(f.elements).forEach(type => {
//       angles[type] = f.elements[type].length;
//       count += f.elements[type].length;
//     });
//   });
//   let start = 0;
//   Object.keys(angles).forEach((type, index) => {
//     const angle = (angles[type] / count) * totalAngle;
//     start = start + featureGap + angle;
//     angles[type] = {
//       angle,
//       start,
//     };
//   });
//   return angles;
// };

// const getFeatureElementAngles = (feature, start, angle) => {
//   const angles = {};
//   const count = getFeatureEleCount(feature);
//   const typesCount = Object.keys(feature.elements).length;
//   // eleAngle + (typesCount - 1) * gap = angle
//   // gap = eleAngle * 0.2
//   // => eleAngle + (typesCount - 1) * eleAngle * 0.2 = angle
//   // => eleAngle = angle / (0.8 + 0.2 * typesCount)
//   const eleAngle = angle / (0.8 + 0.2 * typesCount);
//   const gap = eleAngle * 0.2;

//   return {
//     angle: eleAngle,
//     gap,
//   };
// };

const getNode = (ele, index, angles, x, y, radius, width) => {
  const angle = angles[index];
  return {
    id: ele.id,
    name: ele.name,
    type: ele.type,
    radius,
    width,
    startAngle: angle.start,
    endAngle: angle.start + angle.angle,
    x,
    y,
  };
};

export const getDepsDiagramByFeatureData = createSelector(
  elementByIdSelector,
  getGroupedDepsData,
  sizeSelector,
  (elementById, deps, size) => {
    // All nodes should be in the deps diagram.
    // const eles = Object.values(elementById).filter(toShow);
    const byId = id => elementById[id];
    const x = size / 2;
    const y = size / 2;
    const nodes = [];
    const features = getFeatures(elementById);
    const angles = calcAngles(features, 0, Math.PI * 2, -3, true);
    // nodes.push.apply(nodes, getNodes(features, angles));

    const radius = size / 2 - padding(size);
    const innerRadius = radius -nodeWidth(size) - 2;

    features.forEach((f, index) => {
      const n = getNode(f, index, angles, x, y, radius, nodeWidth(size));
      nodes.push(n);
      const types = Object.keys(f.elements).map(k => ({
        id: `${f.id}-${k}-container`,
        type: `v:container-${k}`,
        name: k,
        weight: f.elements[k].length,
      }));
      const angles2 = calcAngles(types, n.startAngle, n.endAngle - n.startAngle, -0.2, false);
      types.forEach((type, index2) => {
        const n2 = getNode(type, index2, angles2, x, y, innerRadius, nodeWidth(size));
        nodes.push(n2);
        const eles = f.elements[type.name].map(ele => ({
          id: ele.id,
          type: ele.type,
          name: ele.name,
          weight: 1,
        }));
        const angles3 = calcAngles(eles, n2.startAngle, n2.endAngle - n2.startAngle, 0.3, false);
        eles.forEach((ele, index3) => {
          const n3 = getNode(ele, index3, angles3, x, y, innerRadius, nodeWidth(size));
          nodes.push(n3);
        });
      });
    });

    return { nodes };

    // console.log('features');
    // return features;

    // const eleCount = features.reduce(
    //   (count, f) => count + Object.values(f.elements).reduce((c, arr) => c + arr.length, 0),
    //   0
    // );

    // console.log(eleCount);
    // const featureGap = ((Math.PI * 2) / eleCount) * 0.4;
    // const featureAngles = getFeatureAngles(features, featureGap);
    // const avgAngle = (Math.PI * 2 - features.length * groupGap) / eleCount;

    // const groups = _.groupBy(eles, 'type');
    // Object.values(groups).forEach(arr => arr.sort((a, b) => a.name.localeCompare(b.name)));
    // const groupTypes = Object.keys(groups);

    // const groupGap = (Math.PI * 2 * 0.4) / eles.length;
    // const avgAngle = (Math.PI * 2 - groupTypes.length * groupGap) / eles.length;
    // const startAngleByType = {};
    // let typeStartAngle = 0;
    // let nodes = [];
    // let groupNodes = [];
    // const nodeById = {};
    // groupTypes.forEach(type => {
    //   groupNodes.push({
    //     id: type,
    //     x: size / 2,
    //     y: size / 2,
    //     width: nodeWidth(size),
    //     startAngle: typeStartAngle,
    //     endAngle: typeStartAngle + groups[type].length * avgAngle,
    //     type,
    //     radius: size / 2 - padding(size),
    //     pieRadius: size / 2 - nodeWidth(size) / 2 - padding(size),
    //   });
    //   startAngleByType[type] = typeStartAngle;

    //   groups[type].forEach((ele, index) => {
    //     const len = groups[type].length;
    //     const groupAngle = avgAngle * len;
    //     // How eleAngle calculated? See below formula
    //     // len * eleAngle + (len + 1) * eleGap = groupAngle
    //     // eleGap = eleAngle * 20%
    //     // paddingAngle = eleAngle * 20%
    //     const eleAngle = groupAngle / (1.2 * len + 0.2);
    //     const eleGap = eleAngle * 0.2;
    //     const startAngle = typeStartAngle + eleGap + index * (eleGap + eleAngle);
    //     const n = {
    //       id: ele.id,
    //       name: ele.name,
    //       type: ele.type,
    //       x: size / 2,
    //       y: size / 2,
    //       width: nodeWidth(size),
    //       startAngle,
    //       endAngle: startAngle + eleAngle,
    //       radius: size / 2 - padding(size),
    //     };
    //     nodeById[n.id] = n;
    //     nodes.push(n);
    //   });
    //   typeStartAngle += groups[type].length * avgAngle + groupGap;
    // });

    // let links = [];
    // eles.forEach(ele => {
    //   const eleDeps = deps.dependencies[ele.id] || [];
    //   eleDeps.forEach(dep => {
    //     const source = nodeById[ele.id];
    //     const target = nodeById[dep];
    //     links.push(getLink(source, target, size));
    //   });
    // });

    // nodes = _.uniqBy(nodes, 'id');
    // links = _.uniqWith(links, _.isEqual);

    // const nodeIdHash = nodes.reduce((h, n) => {
    //   h[n.id] = true;
    //   return h;
    // }, {});
    // links = links.filter(l => {
    //   if (!nodeIdHash[l.source.id])
    //     console.error(`getAllDepsDiagramData: Link source ${l.source} doesn't exist.`);
    //   else if (!nodeIdHash[l.target.id])
    //     console.error(`getAllDepsDiagramData: Link target ${l.target} doesn't exist.`);
    //   else return true;
    //   return false;
    // });

    // return { nodes, links, groups: groupNodes, depsData: deps };
  }
);
