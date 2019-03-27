module.exports = {
  fatal(code, msg) {
    console.log('Fatal error: ', code, msg);
    const err = new Error(msg);
    err.code = code;
    throw err;
  }
};
