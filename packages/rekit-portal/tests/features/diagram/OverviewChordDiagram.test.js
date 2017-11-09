import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { OverviewChordDiagram } from 'src/features/diagram/OverviewChordDiagram';

describe('diagram/OverviewChordDiagram', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {
        features: ['f1'],
        featureById: {
          f1: {
            name: 'F1',
            deps: [],
          }
        },
      },
    };

    const renderedComponent = shallow(
      <OverviewChordDiagram {...props} />
    );

    expect(
      renderedComponent.find('.diagram-overview-chord-diagram').node
    ).to.exist;
  });
});
