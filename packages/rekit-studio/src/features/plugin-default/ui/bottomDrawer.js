import React from 'react';
import OutputView from '../../home/OutputView';

export default {
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
        component: () => (
          <div style={{ padding: '10px', fontSize: '12px', color: '#aaa' }}>No problems!</div>
        ),
      },
    ];
  },
};
