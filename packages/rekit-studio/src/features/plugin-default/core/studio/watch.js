const { vio, files } = rekit.core;

function watchFileChange(io) {
  files.on('change', changes => {
    vio.reset();
    if (io) io.emit('fileChanged', { timestamp: files.lastChangeTime });
  });
}

module.exports = watchFileChange;
