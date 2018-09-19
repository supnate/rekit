import setupLinter from './setupLinter';

export default {
  config(editor, monaco) {
    setupLinter(editor, monaco);
  },
};
