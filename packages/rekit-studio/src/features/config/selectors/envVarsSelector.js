import { createSelector } from 'reselect';

const rawEnvVarsSelector = state => state;

function compute(envVars) {
  return Object.keys(envVars).map(envVar => ({ name: envVar, value: envVars[envVar] }));
}

export const envVarsSelector = createSelector(rawEnvVarsSelector, compute);
