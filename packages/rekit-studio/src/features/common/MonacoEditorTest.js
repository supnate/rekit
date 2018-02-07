import React, { Component } from 'react';
import { MonacoEditor } from './';

export default class MonacoEditorTest extends Component {
  static propTypes = {

  };

  getEditorOptions() {
    return {
      language: 'javascript',
      jsx: true,
      value: 'const a = 1;\nfunction myFunc() {}\nconst Comp = () => <div>abc</div>;',
    };
  }

  render() {
    return (
      <div className="common-monaco-editor-test">
        <MonacoEditor options={this.getEditorOptions()} />
      </div>
    );
  }
}
