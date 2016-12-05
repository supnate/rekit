import * as homeSagas from '../features/home/redux/sagas';

const sagas = [ // REKIT_ARCHOR_LINE: DO_NOT_CHANGE
  homeSagas,
].reduce( // REKIT_ARCHOR_LINE: DO_NOT_CHANGE
  (prev, curr) => [...prev, ...Object.keys(curr).map(k => curr[k])], []
);

function* rootSaga() {
  yield sagas.map(saga => saga());
}

export default rootSaga;
