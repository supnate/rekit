import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'features/test-1/DefaultPage';

describe('test-1/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      test1: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...pageProps} />
    );

    expect(
      renderedComponent.find('.test-1-default-page').node
    ).to.exist;
  });
});
