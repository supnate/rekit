import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { CodeEditor } from 'src/features/home/CodeEditor';

describe('home/CodeEditor', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <CodeEditor {...props} />
    );

    expect(
      renderedComponent.find('.home-code-editor').getElement()
    ).to.exist;
  });
});
