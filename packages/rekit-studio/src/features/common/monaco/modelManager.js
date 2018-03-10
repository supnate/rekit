import _ from 'lodash';

const initialContent = {};

const getUri = _.memoize(file => new monaco.Uri().with({ path: file, scheme: 'file' }));
const modelManager = {
  getModel(filePath, content, noCreate) {
    if (!window.monaco) return null;
    const uri = getUri(filePath);
    let model = monaco.editor.getModel(uri);
    if (!model && !noCreate) {
      model = monaco.editor.createModel(content || initialContent[filePath] || '', null, uri);
    }
    return model;
  },
  reset(filePath) {
    // Set the model content to initial values
    if (!filePath) return;
    // delete initialContent[filePath];
    const model = this.getModel(filePath, null, true);
    if (model && model.getValue() !== this.getInitialValue(filePath)) model.setValue(this.getInitialValue(filePath) || '');
  },
  setValue(filePath, content) {
    const model = this.getModel(filePath);
    if (model && model.getValue() !== content) model.setValue(content);
  },
  setInitialValue(filePath, content) {
    if (initialContent[filePath] === content) return;
    const model = this.getModel(filePath, content, true);
    if (model && (!_.has(initialContent, filePath) || model.getValue() === initialContent[filePath])) {
      model.setValue(content);
    }
    initialContent[filePath] = content;
  },
  getValue(filePath) {
    const model = this.getModel(filePath);
    if (model) return model.getValue();
    return null;
  },
  hasModel(filePath) {
    return !!this.getModel(filePath, null, true);
  },
  isChanged(filePath) {
    return (
      filePath &&
      _.has(initialContent, filePath) &&
      this.hasModel(filePath) &&
      initialContent[filePath] !== this.getValue(filePath)
    );
  },
  getInitialValue(filePath) {
    return initialContent[filePath] || null;
  },
  save(filePath) {
    initialContent[filePath] = this.getValue(filePath);
  },
};

export default modelManager;
