import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { OutlineView } from 'src/features/editor';

describe('editor/OutlineView', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <OutlineView />
    );

    expect(
      renderedComponent.find('.editor-outline-view').getElement()
    ).to.exist;
  });
});
