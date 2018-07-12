// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  HOME_UPDATE_PROJECT_DATA,
} from './constants';

export function updateProjectData(data) {
  return {
    type: HOME_UPDATE_PROJECT_DATA,
    data,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_UPDATE_PROJECT_DATA:
      return {
        ...state,
        projectData: action.data,
      };

    default:
      return state;
  }
}
