
const sagas = [
].reduce((prev, curr) => [...prev, ...Object.keys(curr).map(k => curr[k])], []).filter(s => typeof s === 'function');

function* rootSaga() {
  yield sagas.map(saga => saga());
}

export default rootSaga;
