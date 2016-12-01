import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/common/DefaultPage';

describe('common/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      common: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...pageProps} />
    );

    expect(
      renderedComponent.find('.common-default-page').node
    ).to.exist;
  });
});
