import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const COLORS = {
  'create-dir': '#2196F3',
  'del-file': '#FF4081',
  'mv-file': '#4CAF50',
  'update-file': '#00BCD4',
  'create-file': '#2196F3',
  warning: '#FF9800',
  diff: '#999999',
};

export default class LogViewer extends PureComponent {
  static propTypes = {
    logs: PropTypes.array.isRequired,
  };

  static defaultProps = {
    logs: [],
  };

  renderDiffLine(line) {
    if (line.added) {
      return line.value.split('\n').filter(l => !!l).map(text => (
        <li>
          <span style={{ color: 'green' }}>+++</span>
          <span style={{ marginLeft: 5 }}>{text}</span>
        </li>
      ));
    } else if (line.removed) {
      return line.value.split('\n').filter(l => !!l).map(text => (
        <li>
          <span style={{ color: 'red' }}>---</span>
          <span style={{ marginLeft: 5 }}>{text}</span>
        </li>
      ));
    }
    return null;
  }

  renderDiff(diff) {
    return (
      <ul style={{ color: COLORS.diff, marginLeft: 15 }}>
        {
          diff.map(line => this.renderDiffLine(line))
        }
      </ul>
    );
  }

  renderDescription(log) {
    switch (log.type) {
      case 'create-dir':
      case 'create-file':
        return `Created: ${log.file}`;
      case 'update-file':
        return `Updated: ${log.file}`;
      case 'update-file-warning':
        return `Warning: nothing is changed for: ${log.file}`;
      case 'mv-file':
        return `Moved: ${log.file}`;
      case 'mv-file-warning':
        return `Warning: no file to move: ${log.file}`;
      case 'del-file':
        return `Deleted: ${log.file}`;
      default:
        return `Unknown log type: ${log.type}`;
    }
  }

  render() {
    const { logs } = this.props;

    return (
      <div className="rekit-cmds-log-viewer">
        <ul>
          {
            logs.map(log => (
              <li
                key={log.file}
                style={{ color: log.warning ? COLORS.warning : COLORS[log.type], whiteSpace: 'nowrap' }}
              >
                {this.renderDescription(log)}
                {log.diff && this.renderDiff(log.diff)}
              </li>
            ))
          }
          {!logs.length && <li>No logs.</li>}
        </ul>
      </div>
    );
  }
}
