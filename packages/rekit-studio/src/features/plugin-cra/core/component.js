
function add(type, name, args) {
  console.log('adding component: ', type, name, args);
}
function move(source, target, args) {
  console.log('moving component: ', source, target, args);
}
function remove(type, name, args) {
  console.log('removeing component: ', type, name, args);
}

module.exports = {
  add,
};
