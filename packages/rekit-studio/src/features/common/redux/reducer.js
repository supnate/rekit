import initialState from './initialState';

const reducers = [];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    case 'REKIT_STUDIO_OUTPUT': {
      const data = action.data;
      let output = state.cmdOutput[data.id || 'general'] || [];
      output = output.concat(action.data.output).slice(-200); // only keeps latest 200 output lines
      newState = {
        ...state,
        cmdOutput: {
          ...state.cmdOutput,
          [data.id || 'general']: output
        },
      };
      break;
    }
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
