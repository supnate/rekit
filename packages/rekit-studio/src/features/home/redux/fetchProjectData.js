import _ from 'lodash';
import axios from 'axios';
import {
  HOME_FETCH_PROJECT_DATA_BEGIN,
  HOME_FETCH_PROJECT_DATA_SUCCESS,
  HOME_FETCH_PROJECT_DATA_FAILURE,
  HOME_FETCH_PROJECT_DATA_DISMISS_ERROR,
} from './constants';
import plugin from '../../../common/plugin';

export function fetchProjectData() {
  return (dispatch) => {
    dispatch({
      type: HOME_FETCH_PROJECT_DATA_BEGIN,
    });

    return new Promise((resolve, reject) => {
      axios.get('/api/project-data').then(
        (res) => {
          // if (window.ON_REKIT_STUDIO_LOAD) window.ON_REKIT_STUDIO_LOAD();
          const prjData = res.data;
          plugin.setPluginNames(prjData.plugins); // development time to load plugins
          plugin.getPlugins('app.processProjectData').forEach(p => {
            p.app.processProjectData(prjData);
          });

          dispatch({
            type: HOME_FETCH_PROJECT_DATA_SUCCESS,
            data: prjData,
          });
          resolve(prjData);
        },
        (err) => {
          if (window.ON_REKIT_STUDIO_LOAD) window.ON_REKIT_STUDIO_LOAD();
          dispatch({
            type: HOME_FETCH_PROJECT_DATA_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });
  };
}

export function dismissFetchProjectDataError() {
  return {
    type: HOME_FETCH_PROJECT_DATA_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_PROJECT_DATA_BEGIN:
      return {
        ...state,
        fetchProjectDataPending: true,
        fetchProjectDataError: null,
      };

    case HOME_FETCH_PROJECT_DATA_SUCCESS: {
      // const featureById = {};
      // const elementById = {};

      // const setElementById = (ele) => {
      //   if (ele.children) {
      //     // Only applies to misc
      //     ele.children.forEach(setElementById);
      //   } else {
      //     elementById[ele.file] = ele;
      //   }
      // };
      // action.data.features.forEach((f) => {
      //   f.feature = f.key;
      //   featureById[f.key] = f;
      //   elementById[f.key] = f;
      //   [...f.components, ...f.actions, ...f.misc].forEach(setElementById);
      // });

      // action.data.srcFiles.forEach(setElementById);
      const fileContentNeedReload = _.mapValues(state.fileContentById, () => true);
      return {
        ...state,
        projectData: action.data,
        ...action.data,
        // projectData: action.data,
        // ...action.data,
        // filesHasSyntaxError: action.data.filesHasSyntaxError,
        // elementById,
        // featureById,
        // projectName: action.data.projectName,
        // srcFiles: action.data.srcFiles,
        // testCoverage: action.data.testCoverage,
        // projectRoot: action.data.projectRoot,
        // cssExt: action.data.cssExt,
        // rekit: action.data.rekit,
        // // fileContentById: {},
        fileContentNeedReload,
        // oldFileContentById: state.fileContentById,
        // features: action.data.features.map(f => f.key),
        projectDataNeedReload: false,
        fetchProjectDataPending: false,
        fetchProjectDataError: null,
      };
    }
    case HOME_FETCH_PROJECT_DATA_FAILURE:
      return {
        ...state,
        fetchProjectDataPending: false,
        fetchProjectDataError: action.data.error,
      };

    case HOME_FETCH_PROJECT_DATA_DISMISS_ERROR:
      return {
        ...state,
        fetchProjectDataError: null,
      };

    default:
      return state;
  }
}
