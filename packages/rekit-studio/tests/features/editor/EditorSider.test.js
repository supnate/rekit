import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { EditorSider } from 'src/features/editor';

describe('editor/EditorSider', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <EditorSider />
    );

    expect(
      renderedComponent.find('.editor-editor-sider').getElement()
    ).to.exist;
  });
});
