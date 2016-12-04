import * as homeSagas from '../features/home/redux/sagas';

const sagas = [
  homeSagas,
].reduce((prev, curr) => [...prev, ...Object.keys(curr).map(k => curr[k])], []);

function* rootSaga() {
  yield sagas.map(saga => saga());
}

export default rootSaga;
