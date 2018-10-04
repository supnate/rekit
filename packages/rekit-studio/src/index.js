import 'babel-polyfill';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
// import io from 'socket.io-client';
// import { browserHistory } from 'react-router';
// import { syncHistoryWithStore } from 'react-router-redux';
import Root from './Root';
import routeConfig from './common/routeConfig';
// import configStore from './common/configStore';
import store from './common/store';
// const store = configStore();
// const history = syncHistoryWithStore(browserHistory, store);

if (process.env.NODE_ENV !== 'test') {
  const location = document.location;
  let protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
  const portStr = location.port ? ':' + location.port : '';
  const socketURL = `${protocol}${location.hostname}${portStr}/rekit-studio-socket`;
  const ws = new WebSocket(socketURL);
  ws.onopen = () => {
    console.log('[Rekit Studio] socket connected.');
  };

  ws.onmessage = msg => {
    const data = JSON.parse(msg.data);
    switch (data.type) {
      case 'output':
        store.dispatch({
          type: 'REKIT_STUDIO_OUTPUT',
          data: data.payload,
        });
        break;
      case 'fileChanged':
        console.log('file changed');
        store.dispatch({
          type: 'PROJECT_DATA_CHANGED',
          data: data.payload,
        });
        break;
      default:
        console.warn('unknown socket data type: ', data.type);
        break;
    }
  };

  ws.onclose = () => {
    console.log('[Rekit Studio] socket closed.');
  };
  ws.onerror = () => {
    console.error('[Rekit Studio] socket failed.');
  };
}

// if (process.env.NODE_ENV !== 'test') {
//   const socket = io();
//   socket.on('connect', () => {
//     console.log('[STUDIO] connected.');
//   });

//   socket.on('fileChanged', data => {
//     store.dispatch({
//       type: 'PROJECT_DATA_CHANGED',
//       data,
//     });
//   });

//   socket.on('output', data => {
//     store.dispatch({
//       type: 'REKIT_STUDIO_OUTPUT',
//       data,
//     });
//   });

//   socket.on('task-finished', data => {
//     store.dispatch({
//       type: 'REKIT_TASK_FINISHED',
//       data,
//     });
//   });

//   socket.on('build-finished', data => {
//     store.dispatch({
//       type: 'REKIT_TOOLS_BUILD_FINISHED',
//       data,
//     });
//   });

//   socket.on('test-finished', data => {
//     store.dispatch({
//       type: 'REKIT_TOOLS_TEST_FINISHED',
//       data,
//     });
//   });

//   socket.on('disconnect', () => {
//     console.log('[STUDIO] disconnected.');
//   });
// }

let root = document.getElementById('react-root');
if (!root) {
  root = document.createElement('div');
  root.id = 'react-root';
  document.body.appendChild(root);
}

function renderApp(app) {
  render(<AppContainer>{app}</AppContainer>, root);
}

// Force js execution after style loaded
window.onload = () => renderApp(<Root store={store} routeConfig={routeConfig} />);

if (module.hot) {
  module.hot.accept('./common/routeConfig', () => {
    const nextRouteConfig = require('./common/routeConfig').default; // eslint-disable-line
    renderApp(<Root store={store} routeConfig={nextRouteConfig} />);
  });
}
