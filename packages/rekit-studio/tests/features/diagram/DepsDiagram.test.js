import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DepsDiagram } from 'src/features/diagram';

describe('diagram/DepsDiagram', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <DepsDiagram />
    );

    expect(
      renderedComponent.find('.diagram-deps-diagram').getElement()
    ).to.exist;
  });
});
