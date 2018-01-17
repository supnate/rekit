import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ElementPage } from 'src/features/home/ElementPage';

describe('home/ElementPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {
        projectRoot: '/app1',
        featureById: {
          f1: { name: 'F1' }
        },
        elementById: {
          '/app1/src/features/f1/Comp1.js': {
            name: 'Comp1',
            type: 'component',
            feature: 'f1',
            file: 'Comp1.js',
          },
        },
      },
      actions: {},
      match: {
        params: {
          type: 'code',
          feature: 'f1',
          file: 'Comp1.js',
        },
      }
    };
    const renderedComponent = shallow(
      <ElementPage {...props} />
    );

    expect(
      renderedComponent.find('.home-element-page').getElement()
    ).to.exist;
  });
});
