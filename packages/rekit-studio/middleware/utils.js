module.exports = {
  forceRequire(path) {
    // Avoid cache for require.
    delete require.cache[path];
    return require(path); // eslint-disable-line
  }
};
