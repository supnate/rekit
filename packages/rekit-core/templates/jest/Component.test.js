import React from 'react';
import { shallow } from 'enzyme';
import { ${_.pascalCase(component)} } from '../../../src/features/${_.kebabCase(feature)}';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<${_.pascalCase(component)} />);
  expect(renderedComponent.find('.${_.kebabCase(feature)}-${_.kebabCase(component)}').length).toBe(1);
});
