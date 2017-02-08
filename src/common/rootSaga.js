// This file is auto maintained by rekit-plugin-redux-saga,
// you probally should not need to manually edit it.

import homeSagas from '../features/home/redux/sagas';

const sagas = [
  homeSagas,
];

function* rootSaga() {
  // flatten sagas first
  yield sagas.reduce((prev, curr) => [...prev, ...curr], []).map(saga => saga());
}

export default rootSaga;
