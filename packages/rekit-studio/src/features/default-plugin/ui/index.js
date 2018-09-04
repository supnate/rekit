import React from 'react';
import { OutputView } from '../../home';

export const bottomDrawer = {
  getPanes() {
    return [
      {
        tab: 'Output',
        key: 'output',
        order: 10,
        component: OutputView,
      },
      {
        tab: 'Problems',
        key: 'problems',
        order: 1,
        component: () => <div>problems2</div>,
      },
    ];
  },
};
