import '../jsdom-setup';
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { SimpleNav } from 'src/components';

describe('components/SimpleNav', () => {
  it('renders node with correct class name', () => {
    const routes = [{
      childRoutes: [
        { path: 'abc', name: 'ABC' },
      ],
    }];
    const renderedComponent = shallow(
      <SimpleNav routes={routes} />
    );

    expect(
      renderedComponent.find('.component-simple-nav').node
    ).to.exist;
  });
});
