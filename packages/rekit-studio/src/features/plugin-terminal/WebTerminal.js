import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';
import { Terminal } from 'xterm';

let term, protocol, socketURL, socket, pid;

const terminalOptions = {
  cols: 40,
  rows: 20,
  fontSize: 12,
  lineHeight: 1,
  cursorBlink: true,
  fontFamily: "'Andale Mono', 'Courier New', 'Courier', monospace",
  theme: {
    foreground: '#7af950',
    background: '#080808',
  },
  screenKeys: true,
  applicationCursor: true,
  mouseEvents: true,
};

function createTerminal(node) {
  Terminal.applyAddon(attach);
  Terminal.applyAddon(fit);
  Terminal.applyAddon(winptyCompat);
  term = new Terminal(terminalOptions);
  term.on('resize', function(size) {
    if (!pid) {
      return;
    }
    var cols = size.cols,
      rows = size.rows,
      url = '/terminals/' + pid + '/size?cols=' + cols + '&rows=' + rows;

    fetch(url, { method: 'POST' });
  });
  const location = document.location;
  protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
  socketURL =
    protocol + location.hostname + (location.port ? ':' + location.port : '') + '/terminals/';

  term.open(node);
  // term.winptyCompatInit();
  // term.webLinksInit();
  term.fit();
  term.focus();

  // fit is called within a setTimeout, cols and rows need this.
  setTimeout(function() {
    fetch('/terminals?cols=' + term.cols + '&rows=' + term.rows, { method: 'POST' }).then(function(
      res
    ) {
      res.text().then(function(processId) {
        pid = processId;
        socketURL += processId;
        socket = new WebSocket(socketURL);
        socket.onopen = runRealTerminal;
        // socket.onclose = runFakeTerminal;
        // socket.onerror = runFakeTerminal;
      });
    });
  }, 0);
}

function runRealTerminal() {
  term.attach(socket);
  term._initialized = true;
}

export default class WebTerminal extends Component {
  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
    if (!term) {
      const div = document.createElement('div');
      this.container.appendChild(div);
      createTerminal(div);
    } else {
      this.container.appendChild(term.element.parentNode);
    }
    term.fit();
    term.focus();
  }

  componentWillUnmount() {
    if (term) this.container.removeChild(term.element.parentNode);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = _.debounce(() => {
    term.fit();
  }, 300);

  render() {
    return <div className="plugin-terminal-web-terminal" ref={n => (this.container = n)} />;
  }
}
