import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { MonacoEditor } from 'src/features/editor';

describe('editor/MonacoEditor', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <MonacoEditor />
    );

    expect(
      renderedComponent.find('.editor-monaco-editor').getElement()
    ).to.exist;
  });
});
