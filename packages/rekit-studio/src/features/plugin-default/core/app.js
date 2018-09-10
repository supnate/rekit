module.exports = {
  getProjectData() {
    return {
      plugins: rekit.core.plugin.getPlugins().map(p => p.name),
      projectName: rekit.core.config.getPkgJson().name,
    };
  },
};
