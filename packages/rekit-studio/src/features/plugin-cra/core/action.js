
function add(type, name, args) {
  console.log('adding action: ', type, name, args);
}
function move(source, target, args) {
  console.log('moving action: ', source, target, args);
}
function remove(type, name, args) {
  console.log('removeing action: ', type, name, args);
}

module.exports = {
  add,
};
