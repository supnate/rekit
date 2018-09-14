import { createSelector } from 'reselect';
import _ from 'lodash';

const elementByIdSelector = state => state.elementById;

export const getDepsData = createSelector(elementByIdSelector, elementById => {
  const byId = id => elementById[id] || null;
  const ensuareArray = (obj, name) => (obj[name] ? obj[name] : (obj[name] = []));
  const dependencies = {};
  const dependents = {};
  // Object.values(elementById).forEach(ele => {
  //   if (ele.deps && ele.deps.length) {
  //     ele.deps.forEach(dep => {
  //       if (dep.type !== 'file') return;
  //       ensuareArray(dependencies, ele.id).push(dep.id);
  //       ensuareArray(dependents, dep.id).push(ele.id);
  //     });
  //   }
  // });

  Object.values(elementById).forEach(ele => {
    if (ele.target) ele = byId(ele.target);
    let eleDeps = ele.parts
      ? ele.parts.reduce((prev, part) => {
          if (byId(part) && byId(part).deps) {
            prev.push.apply(prev, byId(part).deps);
          }
          return prev;
        }, [])
      : ele.deps || [];

    // deps should not in parts and uniq
    eleDeps = eleDeps
      .filter(d => d.type === 'file' && (!ele.parts || !ele.parts.includes(d.id)))
      .map(d => d.id);
    eleDeps = _.uniq(eleDeps);
    eleDeps.forEach(dep => {
      dep = byId(dep);
      if (!dep) return;
      if (dep.owner) dep = byId(dep.owner);
      if (!dep || dep.id === ele.id) return;
      ensuareArray(dependencies, ele.id).push(dep.id);
      ensuareArray(dependents, dep.id).push(ele.id);
    });
  });

  return { dependencies, dependents };
});

// import _ from 'lodash';
// import { createSelector } from 'reselect';
// import { getDepsData }

// const featuresSelector = state => state.features;
// const featureByIdSelector = state => state.featureById;

// export const getOverviewDiagramData = createSelector(
//   featuresSelector,
//   featureByIdSelector,
//   (features, featureById) => {
//     const links = [];
//     const nodes = features.map((fid) => {
//       const f = featureById[fid];
//       const feature = { name: f.name, id: f.key, r: 30 };

//       [...f.components, ...f.actions, ...f.misc].forEach((item) => {
//         if (!item.deps) return;
//         [
//           ...item.deps.actions,
//           ...item.deps.components,
//           ...item.deps.constants,
//           ...item.deps.misc,
//         ].forEach((dep) => {
//           if (dep.feature === fid) return;

//           const data = {
//             source: fid,
//             target: dep.feature,
//             type: dep.type,
//           };
//           const found = _.find(links, data);
//           if (found) {
//             found.count += 1;
//           } else {
//             links.push({
//               ...data,
//               count: 1,
//             });
//           }
//         });
//       });
//       return feature;
//     });

//     // Relation types: component, action, store, constant, misc
//     for (let i = 0; i < nodes.length; i++) { // eslint-disable-line
//       for (let j = 0; j < nodes.length; j++) { // eslint-disable-line
//         if (i === j) continue; // eslint-disable-line
//         const f1 = nodes[i];
//         const f2 = nodes[j];

//         const arr = links
//           .filter(l => (l.source === f1.id && l.target === f2.id) || (l.source === f2.id && l.target === f1.id))
//           .sort((l1, l2) => (l1.source !== l2.source ? l1.source.localeCompare(l2.source) : l1.type.localeCompare(l2.type)))
//         ;

//         if (arr.length > 0) {
//           const firstSource = arr[0].source;
//           arr.forEach((link, k) => {
//             const m = Math.floor(arr.length / 2);
//             if (arr.length % 2 === 0) {
//               if (k < m) link.pos = k - m;
//               else link.pos = k - m + 1;
//             } else {
//               link.pos = k - m;
//             }
//             if (link.source !== firstSource) {
//               link.pos = -link.pos;
//             }
//           });
//         }
//       }
//     }

//     for (let i = 0; i < features.length; i++) {
//       for (let j = i + 1; j < features.length; j++) {
//         links.push({
//           source: features[i],
//           target: features[j],
//           type: 'f-f',
//         });
//       }
//     }
//     return { nodes, links };
//   },
// );
