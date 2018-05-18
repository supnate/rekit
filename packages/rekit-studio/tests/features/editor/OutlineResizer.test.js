import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { OutlineResizer } from 'src/features/editor/OutlineResizer';

describe('editor/OutlineResizer', () => {
  it('renders node with correct class name', () => {
    const props = {
      editor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <OutlineResizer {...props} />
    );

    expect(
      renderedComponent.find('.editor-outline-resizer').getElement()
    ).to.exist;
  });
});
