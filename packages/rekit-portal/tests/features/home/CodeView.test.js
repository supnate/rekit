import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { CodeView } from 'src/features/home/CodeView';

describe('home/CodeView', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {
        fileContentById: {},
      },
      actions: {
        fetchFileContent() {},
      },
      file: 'abc',
    };
    const renderedComponent = shallow(
      <CodeView {...props} />
    );

    expect(
      renderedComponent.find('.home-code-view').node
    ).to.exist;
  });
});
