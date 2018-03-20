import React from 'react';
import { shallow } from 'enzyme';
import { ${_.pascalCase(component)} } from '../../../src/features/${_.kebabCase(feature)}/${_.pascalCase(component)}';

describe('${_.kebabCase(feature)}/${_.pascalCase(component)}', () => {
  it('renders node with correct class name', () => {
    const props = {
      ${_.camelCase(feature)}: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <${_.pascalCase(component)} {...props} />
    );

    expect(
      renderedComponent.find('.${_.kebabCase(feature)}-${_.kebabCase(component)}')
    ).toHaveLength(1);
  });
});
