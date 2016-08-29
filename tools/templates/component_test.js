import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ${COMPONENT_NAME} } from 'src/components';

describe('components/${COMPONENT_NAME}', () => {
  it('renders node with correct dom structure', () => {
    const renderedComponent = shallow(
      <${COMPONENT_NAME} />
    );

    expect(
      renderedComponent.find('.component-${KEBAB_COMPONENT_NAME}').node
    ).to.exist;
  });
});
