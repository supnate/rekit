'use strict';

const vio = require('../../core/vio');
const refactor = require('../../core/refactor');
const expect = require('chai').expect;

const V_FILE = '/vio-temp-file';

describe('refactor array tests', function() { // eslint-disable-line
  before(() => {
    vio.reset();
  });


  it(`addObjectProperty`, () => {
    const CODE1 = `\
const initialState = {
  apiSchema: []
};`;
    vio.put(V_FILE, CODE1);
    refactor.addObjectProperty(V_FILE, 'initialState', 'doFetchPending', false);
    expect(vio.getContent(V_FILE)).to.equal(`\
const initialState = {
  apiSchema: [],
  doFetchPending: false
};`);
    const CODE2 = `\
const initialState = {
};`;
    vio.put(V_FILE, CODE2);
    refactor.addObjectProperty(V_FILE, 'initialState', 'doFetchPending', false);
    expect(vio.getContent(V_FILE)).to.equal(`\
const initialState = {
  doFetchPending: false,
};`);

    const CODE3 = `const initialState = {};`;
    vio.put(V_FILE, CODE3);
    refactor.addObjectProperty(V_FILE, 'initialState', 'doFetchPending', false);
    expect(vio.getContent(V_FILE)).to.equal(`const initialState = { doFetchPending: false };`);

    const CODE4 = `const initialState = { a: 1 };`;
    vio.put(V_FILE, CODE4);
    refactor.addObjectProperty(V_FILE, 'initialState', 'doFetchPending', false);
    expect(vio.getContent(V_FILE)).to.equal(`const initialState = { a: 1, doFetchPending: false };`);

    const CODE5 = `const initialState = { a: 1, };`;
    vio.put(V_FILE, CODE5);
    refactor.addObjectProperty(V_FILE, 'initialState', 'doFetchPending', false);
    expect(vio.getContent(V_FILE)).to.equal(`const initialState = { a: 1, doFetchPending: false, };`);
  });
});

