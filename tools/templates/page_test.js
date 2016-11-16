import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ${PAGE_NAME} } from 'features/${KEBAB_FEATURE_NAME}/${PAGE_NAME}';

describe('${KEBAB_FEATURE_NAME}/${PAGE_NAME}', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      ${CAMEL_FEATURE_NAME}: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <${PAGE_NAME} {...pageProps} />
    );

    expect(
      renderedComponent.find('.${KEBAB_FEATURE_NAME}-${KEBAB_PAGE_NAME}').node
    ).to.exist;
  });
});
