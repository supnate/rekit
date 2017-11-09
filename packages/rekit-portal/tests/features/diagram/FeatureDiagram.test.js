import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FeatureDiagram } from 'src/features/diagram';

describe('diagram/FeatureDiagram', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <FeatureDiagram />
    );

    expect(
      renderedComponent.find('.diagram-feature-diagram').node
    ).to.exist;
  });
});
