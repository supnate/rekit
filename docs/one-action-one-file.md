## One Action One File
This may be the most opinionate part of the Rekit approach. That is: one action one file, and put the corresponding reducer into the same file.

Also you can read the introduction at: https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da .

This idea comes from the pain of regular Redux development: it almost always needs to write the reducer just after creating a new action.

Take a counter component for example, after creating a new action COUNTER_PLUS_ONE, we immediately need to handle it in the reducer, the official way is to write code in actions.js and reducers.js separately. By the new approach, we create a new file named `counterPlusOne.js` and put below code in it:
```javascript
import {
  COUNTER_PLUS_ONE,
} from './constants';

export function counterPlusOne() {
  return {
    type: COUNTER_PLUS_ONE,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COUNTER_PLUS_ONE:
      return {
        ...state,
        count: state.count + 1,
      };

    default:
      return state;
  }
}
```

In my experience, most reducers are bound to corresponding actions. The are rarely used globally. So putting them into one file is reasonable and it makes the development easier.

The reducer here is not a standard Redux reducer because it doesn't have an initial state. It's only used by the root reducer of the feature. And it is always named `reducer` so that the root reducer could auto load it from the action module.

For async actions, the action file may contain multiple actions because it needs to handle errors. For a Rekit application, each feature contains a folder named `redux` where we put actions, constants and reducers.

#### How about cross-topic actions?
Although not many, there are scenarios needing cross-topic actions. For example, when receving a new message:
  * If chatting box is open, display it.
  * If not, show a notification icon/message.
The `NEW_MESSAGE` action needs to be processed by different UI components. So there is a root reducer for each feature: `<feature-name>/redux/reducer.js` in which you write cross-topic reducers.

#### How root reducer of a feature works?
Although reducers for different actions are separated into different files, they operate the same state, that is the same branch of the Redux store. So a feature reducer has the below code pattern:
```javascript
import initialState from './initialState';
import { reducer as counterPlusOne } from './counterPlusOne';
import { reducer as counterMinusOne } from './counterMinusOne';
import { reducer as resetCounter } from './resetCounter';

const reducers = [
  counterPlusOne,
  counterMinusOne,
  resetCounter,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Put global reducers here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}

```
By using Rekit to create actions, you don't need to manually maintain this file because the Rekit will auto update it to add or remove the reducer import.

#### Benefits
This approach has multiple advantages:

1. Easy to develop: no need to jump between files when creating actions.
2. Easy to maintain: action files are now small and easy to be found by file name.
3. Easy to test: one test file corresponds to one action which also includes both action and reducer test.
4. Easy to write tools: no need to parse code when creating a tool to generate Redux boilerplate code. A file template is enough.
5. Easy to analyse: cross-topic actions could be easily found by static analysis
  
