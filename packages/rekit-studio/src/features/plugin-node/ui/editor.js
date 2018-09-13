export default {
  config(editor, monaco) {
    editor.onDidChangeModel(args => {
      if (args.newModelUrl.path.endsWith('.marko') && editor.getModel().getModeId() !== 'html') {
        monaco.editor.setModelLanguage(editor.getModel(), 'html');
      }
    });
  },
  configMonaco(monaco) {
    // To support marko!
  },
};
