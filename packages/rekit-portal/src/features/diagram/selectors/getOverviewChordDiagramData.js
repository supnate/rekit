import _ from 'lodash';
import { createSelector } from 'reselect';

const featuresSelector = state => state.features;
const featureByIdSelector = state => state.featureById;
const sizeSelector = (state, size) => size;
const selectedFeaturesSelector = (state, size, selectedFeatures) => selectedFeatures;

// constants
const outerStrokeWidth = 12;
const innerStrokeWidth = 12;
const outerGapAngle = Math.PI / 40;
const innerGapAngle = Math.PI / 360;
const fileAngle = Math.PI / 120;

const circleGap = 2;
const textSpace = 20;

function flattenMiscFiles(arr) {
  return _.flatten(arr.map(item => (item.children ? flattenMiscFiles(item.children) : item)));
}

function getMiscWeight(misc) {
  // misc files weight should exclude 4 entry files: actions.js, index.js, reducer.js, constants.js
  let weight = misc.filter(f => /\.js$/.test(f.file)).length - 6;
  if (weight <= 0) weight = 1;
  return weight;
}

function scaleAngleByWeight(groups, gapAngle, sumAngle) {
  if (!groups.length) return;
  let isCircle = false;
  if (!sumAngle) {
    // if no sumAngle provided, it's a circle
    isCircle = true;
    sumAngle = Math.PI * 2;
  }
  sumAngle -= groups.length * gapAngle;
  if (!isCircle) sumAngle += gapAngle;

  const sumWeight = _.sumBy(groups, 'weight');

  let nextStartAngle = groups[0].startAngle;
  groups.forEach((group) => {
    group.startAngle = nextStartAngle;
    group.endAngle = group.startAngle + sumAngle * group.weight / sumWeight;
    nextStartAngle = group.endAngle + gapAngle;
  });
}
export const getOverviewChordDiagramData = createSelector(
  featuresSelector,
  featureByIdSelector,
  sizeSelector,
  selectedFeaturesSelector,
  (features, featureById, size, selectedFeatures) => {
    const circleRadius = size / 2 - textSpace;
    const outerRadius = circleRadius - outerStrokeWidth / 2;
    const innerRadius = circleRadius - outerStrokeWidth - circleGap - innerStrokeWidth / 2;
    const outerCount = features.length;
    const outerGroupAngleValue = Math.PI * 2 / outerCount - outerGapAngle;
    const x = size / 2;
    const y = size / 2;

    const hash = _.keyBy(selectedFeatures);
    selectedFeatures = features.filter(fid => hash[fid]); // sort selected features using the original order

    // const t = selectedFeatures.shift();
    // selectedFeatures.push(t);

    const outerGroups = selectedFeatures.map((fid, i) => {
      const feature = featureById[fid];
      const miscFiles = flattenMiscFiles(feature.misc);
      const startAngle = i * Math.PI * 2 / outerCount;
      const endAngle = startAngle + outerGroupAngleValue;
      return {
        id: fid,
        name: feature.name,
        type: 'feature',
        x,
        y,
        startAngle,
        endAngle,
        strokeWidth: outerStrokeWidth,
        radius: outerRadius,
        weight: getMiscWeight(miscFiles) + feature.components.length + feature.actions.length,
      };
    });

    scaleAngleByWeight(outerGroups, outerGapAngle);

    let innerGroups = [];
    outerGroups.forEach((outerGroup) => {
      const feature = featureById[outerGroup.id];
      const types = [];
      const miscFiles = flattenMiscFiles(feature.misc);
      if (feature.actions.length > 0) types.push({ name: 'actions', weight: feature.actions.length });
      if (feature.components.length > 0) types.push({ name: 'components', weight: feature.components.length });
      const miscWeight = getMiscWeight(miscFiles);
      if (miscWeight > 0) types.push({ name: 'misc', weight: miscWeight });

      const featureInnerGroups = [];
      types.forEach((type, i) => {
        const angleValue = (outerGroup.endAngle - outerGroup.startAngle - (types.length - 1) * innerGapAngle) / types.length;
        const startAngle = outerGroup.startAngle + (angleValue + innerGapAngle) * i;
        const endAngle = startAngle + angleValue;
        featureInnerGroups.push({
          id: `${outerGroup.id}-${type.name}`,
          feature: outerGroup.id,
          type: type.name,
          x,
          y,
          startAngle,
          endAngle,
          strokeWidth: innerStrokeWidth,
          radius: innerRadius,
          weight: type.weight,
        });
      });

      scaleAngleByWeight(featureInnerGroups, innerGapAngle, outerGroup.endAngle - outerGroup.startAngle);
      innerGroups = [...innerGroups, ...featureInnerGroups];
    });

    let links = [];
    const connectedFiles = {}; // all files that need to be connected
    const filesPos = {};
    selectedFeatures.forEach((fid) => {
      const f = featureById[fid];
      const allElements = [...f.components, ...f.actions, ...flattenMiscFiles(f.misc).filter(ele => /\.js$/.test(ele.file))];

      allElements.forEach((ele) => {
        // if (!ele.deps) return;
        if (/^src\/features\/[^/]+\/(index|route)\.js$/.test(ele.file)) {
          return;
        }

        if (/^src\/features\/[^/]+\/redux\/(reducer|constants|initialState|actions)\.js$/.test(ele.file)) {
          return;
        }

        const allDeps = ele.deps ? [
          ...ele.deps.actions,
          ...ele.deps.components,
          ...ele.deps.misc,
        ].filter(e => selectedFeatures.includes(e.feature)) : []; // the dependencies should also in selected features

        // if (!allDeps.length) return;

        connectedFiles[ele.file] = ele;
        allDeps.forEach((dep) => {
          connectedFiles[dep.file] = dep;

          links.push({
            source: ele,
            target: dep,
          });
        });
      });
    });

    innerGroups.forEach((innerGroup) => {
      const f = featureById[innerGroup.feature];
      let allEles = f[innerGroup.type];
      if (innerGroup.type === 'misc') allEles = flattenMiscFiles(allEles);
      const eles = allEles.filter(e => !!connectedFiles[e.file]); // all connected elements of the group
      const stepAngle = (innerGroup.endAngle - innerGroup.startAngle) / (eles.length + 1);
      const radius = innerRadius - innerStrokeWidth / 2;
      eles.forEach((e, i) => {
        const a = stepAngle * i + stepAngle + innerGroup.startAngle;
        const fx = x + radius * Math.cos(a);
        const fy = y + radius * Math.sin(a);
        filesPos[e.file] = {
          x: fx,
          y: fy,
          file: e.file,
          angle: a,
          feature: f.key,
        };
      });
    });
    // links.forEach((link) => {
    //   if (!filesPos[link.source.file]) console.log('cant find pos for: ', `${link.source.feature}/${link.source.name}`);
    //   if (!filesPos[link.target.file]) console.log('cant find pos for: ', `${link.target.feature}/${link.target.name}`);
    // });

    // Convert links elements to coordinates
    links = links.filter(link => filesPos[link.source.file] && filesPos[link.target.file]).map((link) => {
      const source = filesPos[link.source.file];
      const target = filesPos[link.target.file];

      const x1 = source.x;
      const y1 = source.y;
      const x2 = target.x;
      const y2 = target.y;

      const jx = (x1 + x2) / 2;
      const jy = (y1 + y2) / 2;

      // We need a and b to find theta, and we need to know the sign of each to make sure that the orientation is correct.
      const a = x2 - x1;
      const asign = (a < 0 ? -1 : 1);
      const b = y2 - y1;

      const theta = Math.atan(b / a);

      // Find the point that's perpendicular to J on side
      const costheta = asign * Math.cos(theta);
      const sintheta = asign * Math.sin(theta);

      const radius = innerRadius - innerStrokeWidth / 2;
      let ang = Math.abs(source.angle - target.angle);
      if (ang > Math.PI) ang = 2 * Math.PI - ang;
      ang /= 2;
      const d1 = Math.abs(radius * Math.cos(ang));
      // const d2 = radius - d1;
      const d2 = radius * Math.sin(ang);

      let d = d1;
      if (d > d2 * 2) d = d2 * 2;
      let s = source.angle;
      let t = target.angle;
      if (Math.abs(s - t) > Math.PI) {
        if (s < t) s += 2 * Math.PI;
        else t += 2 * Math.PI;
      }
      const m = (s < t) ? d : -d;
      // if (source.angle - target.angle > Math.PI) d = -d;

      const m1 = m * sintheta;
      const m2 = m * costheta;

      // Use c and d to find cpx and cpy
      const cpx = jx - m1;
      const cpy = jy + m2;

      return { x1, y1, x2, y2, cpx, cpy, source: link.source, target: link.target };
    });

    // create fileNodes
    // each file has a link should display a node for user interaction
    const fileGroups = {};

    _.keys(connectedFiles).forEach((file) => {
      if (fileGroups[file]) return;
      const pos = filesPos[file];
      fileGroups[file] = {
        id: file,
        type: 'file',
        feature: pos.feature,
        x,
        y,
        radius: innerRadius,
        startAngle: pos.angle - fileAngle / 2,
        endAngle: pos.angle + fileAngle / 2,
        strokeWidth: innerStrokeWidth,
      };

      // featureInnerGroups.push({
      //     id: `${outerGroup.id}-${type.name}`,
      //     feature: outerGroup.id,
      //     type: type.name,
      //     x,
      //     y,
      //     startAngle,
      //     endAngle,
      //     strokeWidth: innerStrokeWidth,
      //     radius: innerRadius,
      //     weight: type.weight,
      //   });
    });

    // links.forEach((link) => {
    //   const sf = link.source.file;
    //   const tf = link.target.file;

    //   if (!fileGroups
    //   console.log(link.source.file);
    //   console.log(link.target.file);
    // });


    return {
      mainCircle: { x, y, radius: outerRadius + outerStrokeWidth / 2 },
      innerGroups,
      outerGroups,
      fileGroups: _.values(fileGroups),
      links,
      x,
      y,
      radius: outerRadius + outerStrokeWidth / 2,
    };
  }
);
