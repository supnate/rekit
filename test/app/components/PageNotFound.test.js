import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { PageNotFound } from 'src/components';

describe('components/PageNotFound', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <PageNotFound />
    );

    expect(
      renderedComponent.find('.component-page-not-found').node
    ).to.exist;
  });
});
