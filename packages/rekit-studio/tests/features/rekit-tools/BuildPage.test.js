import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { BuildPage } from 'src/features/rekit-tools/BuildPage';

describe('rekit-tools/BuildPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {
        rekit: { buildPort: 8888 },
      },
      rekitTools: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <BuildPage {...props} />
    );

    expect(
      renderedComponent.find('.rekit-tools-build-page').getElement()
    ).to.exist;
  });
});
