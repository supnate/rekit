import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ElementDiagram } from 'src/features/plugin-cra/ElementDiagram';

describe('plugin-cra/ElementDiagram', () => {
  it('renders node with correct class name', () => {
    const props = {
      pluginCra: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ElementDiagram {...props} />
    );

    expect(
      renderedComponent.find('.plugin-cra-element-diagram').getElement()
    ).to.exist;
  });
});
