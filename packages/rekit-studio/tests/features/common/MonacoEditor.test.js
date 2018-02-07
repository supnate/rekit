import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { MonacoEditor } from 'src/features/common';

describe('common/MonacoEditor', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <MonacoEditor />
    );

    expect(
      renderedComponent.find('.common-monaco-editor').getElement()
    ).to.exist;
  });
});
