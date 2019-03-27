/* eslint quotes: 0 */
'use strict';

const vio = require('../../core/vio');
const refactor = require('../../core/refactor/cls');
const helpers = require('../helpers');

const expectLines = helpers.expectLines;
const V_FILE = '/vio-temp-file';

describe('renameClassName', function() {
  before(() => {
    vio.reset();
  });
  const CODE = `\
import React, { PureComponent } from 'react';

export class Hello extends PureComponent {
  render() {
    return (
      <h1 className="home-hello">
       Welcome to your Rekit project!
      </h1>
    );
  }
}

export default Hello;
`;
  it('rename es6 class name', () => {
    vio.put(V_FILE, CODE);
    refactor.renameClassName(V_FILE, 'Hello', 'NewHello');
    expectLines(V_FILE, ['export class NewHello extends PureComponent {', 'export default NewHello;']);
  });
});
