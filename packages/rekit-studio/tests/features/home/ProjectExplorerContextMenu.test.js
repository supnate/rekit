import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ProjectExplorerContextMenu } from 'src/features/home/ProjectExplorerContextMenu';

describe('home/ProjectExplorerContextMenu', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ProjectExplorerContextMenu {...props} />
    );

    expect(
      renderedComponent.find('.home-project-explorer-context-menu').getElement()
    ).to.exist;
  });
});
