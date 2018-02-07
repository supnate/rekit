import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { MonacoEditorTest } from 'src/features/common';

describe('common/MonacoEditorTest', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <MonacoEditorTest />
    );

    expect(
      renderedComponent.find('.common-monaco-editor-test').getElement()
    ).to.exist;
  });
});
