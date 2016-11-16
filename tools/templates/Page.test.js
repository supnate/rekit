import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ${_.pascalCase(component)} } from 'features/${_.kebabCase(feature)}/${_.pascalCase(component)}';

describe('${_.kebabCase(feature)}/${_.pascalCase(component)}', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      ${_.camelCase(feature)}: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <${_.pascalCase(component)} {...pageProps} />
    );

    expect(
      renderedComponent.find('.${_.kebabCase(feature)}-${_.kebabCase(component)}').node
    ).to.exist;
  });
});
