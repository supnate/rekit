import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { RoutesPage } from 'src/features/home/RoutesPage';

describe('home/RoutesPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {
        features: ['f1'],
        featureById: {
          f1: { name: 'F1', routes: [] },
        },
        rekit: {},
      },
      match: {
        params: {
          feature: 'f1',
          type: 'code',
        },
      }
    };
    const renderedComponent = shallow(
      <RoutesPage {...props} />
    );

    expect(
      renderedComponent.find('.home-routes-page').node
    ).to.exist;
  });
});
