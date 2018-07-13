function getProjectData() {
  return rekit.common.projectFiles.readDir();
}

module.exports = {
  getProjectData,
};
