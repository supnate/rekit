import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DepsView } from 'src/features/editor/DepsView';

describe('editor/DepsView', () => {
  it('renders node with correct class name', () => {
    const props = {
      editor: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DepsView {...props} />
    );

    expect(
      renderedComponent.find('.editor-deps-view').getElement()
    ).to.exist;
  });
});
