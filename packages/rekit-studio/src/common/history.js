import createHistory from 'history/createBrowserHistory';

// a singleton history object
const history = createHistory();
// const push = history.push;
// history.push = function() {
//   console.log('pushpush');
//   push.apply(history, arguments);
// }
export default history;
