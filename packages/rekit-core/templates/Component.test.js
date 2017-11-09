import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ${_.pascalCase(component)} } from 'src/${feature ? ('features/' + _.kebabCase(feature)) : 'components'}';

describe('${_.kebabCase(feature)}/${_.pascalCase(component)}', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <${_.pascalCase(component)} />
    );

    expect(
      renderedComponent.find('.${_.kebabCase(feature || 'component')}-${_.kebabCase(component)}').getElement()
    ).to.exist;
  });
});
