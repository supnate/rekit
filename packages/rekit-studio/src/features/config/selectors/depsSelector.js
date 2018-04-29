import { createSelector } from 'reselect';
import semverDiff from 'semver-diff';

const rawDepsSelector = state => state.deps;
const rawDevDepsSelector = state => state.devDeps;
const allDepsSelector = state => state.allDeps;

function compute(deps, allDeps) {
  return deps
    .map(name => {
      const dep = allDeps[name];
      return {
        name,
        requiredVersion: dep.requiredVersion,
        installedVersion: dep.installedVersion,
        latestVersion: dep.latestVersion,
        status: (dep.latestVersion && dep.installedVersion !== '--')
          ? semverDiff(dep.installedVersion, dep.latestVersion) + '' // eslint-disable-line
          : '',
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const depsSelector = createSelector(rawDepsSelector, allDepsSelector, compute);
export const devDepsSelector = createSelector(rawDevDepsSelector, allDepsSelector, compute);
