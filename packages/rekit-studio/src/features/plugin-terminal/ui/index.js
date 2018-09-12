import WebTerminal from '../WebTerminal';

export const bottomDrawer = {
  getPanes() {
    return [
      {
        tab: 'Terminal',
        key: 'terminal',
        order: 20,
        component: WebTerminal,
      },
    ];
  },
};
