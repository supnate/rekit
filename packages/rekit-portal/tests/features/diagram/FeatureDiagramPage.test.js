import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FeatureDiagramPage } from 'src/features/diagram/FeatureDiagramPage';

describe('diagram/FeatureDiagramPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      diagram: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <FeatureDiagramPage {...props} />
    );

    expect(
      renderedComponent.find('.diagram-feature-diagram-page').getElement()
    ).to.exist;
  });
});
