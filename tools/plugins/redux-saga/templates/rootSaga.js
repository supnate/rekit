
const sagas = [
].reduce((prev, curr) => [...prev, ...Object.keys(curr)
  .map(k => curr[k])], [])
  // a saga should be function, below filter avoids error if sagas/index.js is empty;
  .filter(s => typeof s === 'function');

function* rootSaga() {
  yield sagas.map(saga => saga());
}

export default rootSaga;
