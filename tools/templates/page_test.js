import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, shallow } from 'enzyme';
import { expect } from 'chai';
import Connected${PAGE_NAME}, { ${PAGE_NAME} } from 'features/${KEBAB_FEATURE_NAME}/${PAGE_NAME}';

const pageProps = {
  ${CAMEL_FEATURE_NAME}: {},
  actions: {},
};

const store = createStore(state => state, pageProps);

describe('features/${KEBAB_FEATURE_NAME}/${PAGE_NAME}', () => {
  it('redux connect works', () => {
    const wrapper = render(
      <Provider store={store}>
        <Connected${PAGE_NAME} />
      </Provider>
    );

    expect(
      wrapper.find('.${KEBAB_FEATURE_NAME}-${KEBAB_PAGE_NAME}').length
    ).to.equal(1);
  });

  it('renders node with correct dom structure', () => {
    const renderedComponent = shallow(
      <${PAGE_NAME} {...pageProps} />
    );

    expect(
      renderedComponent.find('.${KEBAB_FEATURE_NAME}-${KEBAB_PAGE_NAME}').node
    ).to.exist;
  });
});
