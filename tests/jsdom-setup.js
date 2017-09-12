// NOTE: you should imort this jsdom setup for any component which uses React-router
// of which Link component is often used.

const JSDOM = require('jsdom').JSDOM;

global.window = new JSDOM('<!DOCTYPE html><div id="react-root"></div>').window;
global.document = window.document;
global.navigator = window.navigator;
global.HTMLElement = window.HTMLElement;
