import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'features/test-2/DefaultPage';

describe('test-2/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      test2: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...pageProps} />
    );

    expect(
      renderedComponent.find('.test-2-default-page').node
    ).to.exist;
  });
});
