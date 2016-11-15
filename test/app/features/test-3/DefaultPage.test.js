import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'features/test-3/DefaultPage';

describe('test-3/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      test3: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...pageProps} />
    );

    expect(
      renderedComponent.find('.test-3-default-page').node
    ).to.exist;
  });
});
