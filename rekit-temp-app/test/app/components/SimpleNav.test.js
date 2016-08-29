import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { SimpleNav } from 'src/components';

describe('components/SimpleNav', () => {
  it('renders node with correct dom structure', () => {
    const routes = [{
      childRoutes: [
        { path: '/root' },
        { path: 'relative-path', name: 'Link Name' },
        {
          path: 'sub-links',
          childRoutes: [
            { path: 'sub-link' },
          ],
        },
        { path: '*' },
      ],
    }];
    const comp = shallow(
      <SimpleNav routes={routes} />
    );

    expect(
      comp.find('.component-simple-nav').node
    ).to.exist;
    expect(
      comp.find('li').length
    ).to.equal(6);
  });
});
