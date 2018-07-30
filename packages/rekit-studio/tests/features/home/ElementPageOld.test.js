import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ElementPageOld } from 'src/features/home/ElementPageOld';

describe('home/ElementPageOld', () => {
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
      router: { location: {} },
      actions: {},
      dispatch() {},
      match: {
        params: {
          type: 'code',
          feature: 'f1',
          file: 'Comp1.js',
        },
      }
    };
    const renderedComponent = shallow(
      <ElementPageOld {...props} />
    );

    expect(
      renderedComponent.find('.home-element-page-old').getElement()
    ).to.exist;
  });
});
