import { createSelector } from 'reselect';
import semverDiff from 'semver-diff';

const rawDepsSelector = state => state.deps;
export const depsSelector = createSelector(rawDepsSelector, depsProp => {
  const { allDeps, deps } = depsProp;

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
});
// const taxPercentSelector = state => state.shop.taxPercent

// const subtotalSelector = createSelector(
//   shopItemsSelector,
//   items => items.reduce((acc, item) => acc + item.value, 0)
// )

// const taxSelector = createSelector(
//   subtotalSelector,
//   taxPercentSelector,
//   (subtotal, taxPercent) => subtotal * (taxPercent / 100)
// )

// export const totalSelector = createSelector(
//   subtotalSelector,
//   taxSelector,
//   (subtotal, tax) => ({ total: subtotal + tax })
// )
