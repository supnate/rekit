import { createSelector } from 'reselect';
import semverDiff from 'semver-diff';

const rawDepsSelector = state => state.deps;
const rawDevDepsSelector = state => state.devDeps;
const allDepsSelector = state => state.allDeps;

function compute(deps, allDeps) {
  return deps
    .map(name => ({
      name,
      requiredVersion: allDeps[name].requiredVersion,
      installedVersion: allDeps[name].installedVersion,
      latestVersion: allDeps[name].latestVersion,
      status: allDeps[name].latestVersion
        ? semverDiff(allDeps[name].installedVersion, allDeps[name].latestVersion) + '' // eslint-disable-line
        : '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const depsSelector = createSelector(rawDepsSelector, allDepsSelector, compute);
export const devDepsSelector = createSelector(rawDevDepsSelector, allDepsSelector, compute);
