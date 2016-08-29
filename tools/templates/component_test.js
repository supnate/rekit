import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ${COMPONENT_NAME} } from 'src/${FOLDER_PATH}';

describe('${FOLDER_PATH}/${COMPONENT_NAME}', () => {
  it('renders node with correct dom structure', () => {
    const renderedComponent = shallow(
      <${COMPONENT_NAME} />
    );

    expect(
      renderedComponent.find('.${CLASS_PREFIX}-${KEBAB_COMPONENT_NAME}').node
    ).to.exist;
  });
});
