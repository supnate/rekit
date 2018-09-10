import _ from 'lodash';

// This is temporialy used for Rekit Studio development.
// In future plugins are dynamically loaded.

import * as defaultPlugin from '../features/plugin-default/ui';
import * as cra from '../features/plugin-cra/ui';
import * as terminal from '../features/plugin-terminal/ui';
import * as node from '../features/plugin-node/ui';

const pluginMap = {
  default: defaultPlugin,
  cra,
  terminal,
  node,
};

export default {
  pluginNames: [],
  setPluginNames(names) {
    this.pluginNames = names;
  },
  getPlugins(prop) {
    const plugins = this.pluginNames.map(name => pluginMap[name]);
    if (!prop) return plugins;
    return plugins.filter(_.property(prop));
  },
};
