import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { OverviewDiagram } from 'src/features/diagram';

describe('diagram/OverviewDiagram', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <OverviewDiagram homeStore={{}} />
    );

    expect(
      renderedComponent.find('.diagram-overview-diagram').getElement()
    ).to.exist;
  });
});
