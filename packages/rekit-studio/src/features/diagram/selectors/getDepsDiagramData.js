import _ from 'lodash';
import { createSelector } from 'reselect';
import plugin from '../../../common/plugin';

const elementByIdSelector = state => state.elementById;
const elementIdSelector = state => state.elementId;

export const getDepsDiagramData = createSelector(
  elementByIdSelector,
  elementIdSelector,
  (elementById, elementId) => {
    const colors = plugin.getPlugins('colors').reduce((prev, curr) => {
      Object.assign(prev, curr.colors);
      return prev;
    }, {});
    colors.type = type => colors[type] || '#78909C';

    const byId = id => elementById[id];
    const ele = byId(elementId);
    if (!ele) throw new Error(`Can't find element: ${elementId}`);
    let links = [];
    let nodes = [];

    // Put the element itself
    nodes.push({
      name: ele.name,
      id: ele.id,
      radius: 50,
      bgColor: colors.type(ele.type),
    });

    _.values(elementById).forEach(item => {
      if (!item.deps) return;

      item.deps.forEach(dep => {
        if (dep.type !== 'file') return;
        if (item.id === ele.id || (ele.parts && ele.parts.includes(item.id))) {
          // it's element itself, push its dependencies
          const depEle = byId(dep.id);

          nodes.push({
            name: depEle.name,
            id: depEle.id,
            radius: 14,
            bgColor: colors.type(depEle.type),
          });

          links.push({
            source: ele.id,
            target: dep.id,
            type: 'dep',
          });
        } else if (dep.id === ele.id || (ele.parts && ele.parts.includes(dep.id))) {
          // if other depends on the ele, or its parts
          nodes.push({
            name: item.name,
            id: item.id,
            radius: 14,
            bgColor: colors.type(item.type),
          });
          links.push({
            source: item.id,
            target: ele.id,
            type: 'dep',
          });
        }
      });
    });

    nodes.forEach(n => {
      if (n.id === ele.id) return;
      const nodeEle = byId(n.id);
      if (nodeEle && nodeEle.owner && byId(nodeEle.owner)) {
        const owner = byId(nodeEle.owner);
        Object.assign(n, {
          id: owner.id,
          name: owner.name,
          bgColor: colors.type(owner.type),
        });

        links.forEach(l => {
          if (l.source === nodeEle.id) l.source = owner.id;
          if (l.target === nodeEle.id) l.target = owner.id;
        });
      }
    });

    // remove duplicated nodes
    nodes = _.uniqBy(nodes, 'id');
    links = _.uniqWith(links, _.isEqual);

    const nodeIdHash = nodes.reduce((h, n) => {
      h[n.id] = true;
      return h;
    }, {});
    links = links.filter(l => {
      if (!nodeIdHash[l.source])
        console.error(`getDepsDiagramData: Link source ${l.source} doesn't exist.`);
      else if (!nodeIdHash[l.target])
        console.error(`getDepsDiagramData: Link target ${l.target} doesn't exist.`);
      else return true;
      return false;
    });

    return { nodes, links };
  }
);
