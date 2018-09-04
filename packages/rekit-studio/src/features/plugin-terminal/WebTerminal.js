import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';
import { Terminal } from 'xterm';

export default class WebTerminal extends Component {
  static propTypes = {
    command: PropTypes.string,
  };

  constructor() {
    super();
    this.defaultCols = 80;
    this.defaultRows = 19;
    this.alive = null;
    this.first = true;
    Terminal.applyAddon(attach);
    Terminal.applyAddon(fit);
    Terminal.applyAddon(winptyCompat);

    this.fatal = this.fatal.bind(this);
  }

  fatal(message) {
    if (!message && this.first)
      message = 'Could not connect to the container. Do you have sufficient privileges?';
    if (!message) message = 'disconnected';
    if (!this.first) message = '\r\n' + message;
    this.term.write('\x1b[31m' + message + '\x1b[m\r\n');
    window.clearInterval(this.alive);
  }

  async componentDidMount() {
    let term = (this.term = new Terminal({
      cols: this.defaultCols,
      rows: this.defaultRows,
      cursorBlink: true,
      fontFamily: "'Andale Mono', 'Courier New', 'Courier', monospace",
      fontSize: 12,
      lineHeight: 1,
      theme: {
        foreground: '#cccccc',
        background: '#080808',
      },
      screenKeys: true,
      applicationCursor: true, // Needed for proper scrollback behavior in applications like vi
      mouseEvents: true, // Needed for proper scrollback behavior in applications like vi
    }));
    term.open(this.container);
    window.term = term;
    setTimeout( () => term.fit(), 1000);
    term.cursorHidden = true;

    let pid;
    const location = window.location;
    const protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
    let socketURL =
      protocol + location.hostname + (location.port ? ':' + location.port : '') + '/terminals/';
    term.on('resize', function(size) {
      if (!pid) {
        return;
      }
      var cols = size.cols,
        rows = size.rows,
        url = '/terminals/' + pid + '/size?cols=' + cols + '&rows=' + rows;

      fetch(url, { method: 'POST' });
    });

    let socket;
    setTimeout(function() {
      // initOptions(term);
      // document.getElementById(`opt-cols`).value = term.cols;
      // document.getElementById(`opt-rows`).value = term.rows;
      // paddingElement.value = 0;

      // // Set terminal size again to set the specific dimensions on the demo
      // updateTerminalSize();

      fetch('/terminals?cols=' + term.cols + '&rows=' + term.rows, { method: 'POST' }).then(
        function(res) {
          res.text().then(function(processId) {
            pid = processId;
            socketURL += processId;
            socket = new WebSocket(socketURL);
            socket.onopen = runRealTerminal;
            // socket.onclose = runFakeTerminal;
            // socket.onerror = runFakeTerminal;
          });
        }
      );
    }, 0);

    function runRealTerminal() {
      term.attach(socket);
      term._initialized = true;
    }
    // term.refresh(term.buffer.y, term.buffer.y);

    // let command = encodeURIComponent('/bin/bash');
    // let pod = 'intentterminal';
    // let podLink = `/api/v1/namespaces/default/pods/${pod}/exec`;
    // let socket = (this.socket = new WebSocket(
    //   `wss://10.149.250.177:6443${podLink}?stdout=1&stdin=1&stderr=1&tty=1&command=${command}&command=-i`,
    //   'base64.channel.k8s.io'
    // ));
    // // let alive = this.alive;
    // socket.onopen = e => {
    //   this.alive = window.setInterval(function() {
    //     socket.send('0');
    //   }, 30 * 1000);
    //   let cols = term.cols;
    //   let rows = term.rows;
    //   if (socket.readyState === 1) {
    //     socket.send('4' + window.btoa('{"Width":' + cols + ',"Height":' + rows + '}'));
    //   }
    // };

    // socket.onmessage = ev => {
    //   var data = ev.data.slice(1);
    //   switch (ev.data[0]) {
    //     case '1':
    //     case '2':
    //     case '3':
    //       term.write(b64_to_utf8(data));
    //       break;
    //   }
    //   if (this.first) {
    //     this.first = false;
    //     term.cursorHidden = false;
    //     term.showCursor();
    //     if (this.term.element) {
    //       this.term.focus();
    //       if (this.props.command) {
    //         // send init command like git clone;
    //         socket.send('0' + utf8_to_b64(this.props.command + '\n'));
    //       }
    //     }
    //   }
    // };

    // socket.onclose = ev => {
    //   this.fatal(ev.reason);
    // };

    // term.on('data', data => {
    //   if (socket && socket.readyState === 1) {
    //     socket.send('0' + utf8_to_b64(data));
    //   }
    // });
  }

  componentWillUnmount() {
    if (this.alive) {
      window.clearInterval(this.alive);
    }
    if (this.socket) {
      this.socket.close();
      this.term.destroy();
    }
  }

  render() {
    return <div className="plugin-terminal-web-terminal" ref={n => (this.container = n)} />;
  }
}
