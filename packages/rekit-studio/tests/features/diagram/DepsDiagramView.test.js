import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DepsDiagramView } from 'src/features/diagram';

describe('diagram/DepsDiagramView', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <DepsDiagramView />
    );

    expect(
      renderedComponent.find('.diagram-deps-diagram-view').getElement()
    ).to.exist;
  });
});
