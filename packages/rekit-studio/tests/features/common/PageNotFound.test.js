import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { PageNotFound } from 'src/features/common';

describe('components/PageNotFound', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <PageNotFound />
    );

    expect(
      renderedComponent.find('.common-page-not-found').getElement()
    ).to.exist;
  });
});
