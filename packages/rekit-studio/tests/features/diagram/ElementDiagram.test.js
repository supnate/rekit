import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ElementDiagram } from 'src/features/diagram';

describe('diagram/ElementDiagram', () => {
  it('renders node with correct class name', () => {
    const props = {
      homeStore: {},
      elementId: 'id',
    };
    const renderedComponent = shallow(
      <ElementDiagram {...props} />
    );

    expect(
      renderedComponent.find('.diagram-element-diagram').getElement()
    ).to.exist;
  });
});
