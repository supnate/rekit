import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { CodeEditor } from 'src/features/editor/CodeEditor';

describe('editor/CodeEditor', () => {
  it('renders node with correct class name', () => {
    const props = {
      editor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <CodeEditor {...props} />
    );

    expect(
      renderedComponent.find('.editor-code-editor').getElement()
    ).to.exist;
  });
});
