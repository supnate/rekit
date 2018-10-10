import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SvgIcon } from '../common';
import { Button } from 'antd';
import { clearOutput } from './redux/actions';

const scrollTop = {};
export class OutputView extends Component {
  static propTypes = {
    type: PropTypes.string,
    output: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static defaultProps = {
    type: 'default',
  };
  // getSnapshotBeforeUpdate() {
  //   // why not called?
  //   const n = this.scrollNode;
  //   console.log('snapshot: ', n.scrollHeight, n.scrollTop, n.offsetHeight);
  //   return n.scrollHeight - n.scrollTop < n.offsetHeight * 1.8;
  // }

  componentDidMount() {
    if (scrollTop[this.props.type]) this.scrollNode.scrollTop = scrollTop[this.props.type];
  }
  componentDidUpdate(prevProps, prevState, needScrollBottom) {
    const n = this.scrollNode;
    n.scrollTop = n.scrollHeight - n.offsetHeight;
    scrollTop[this.props.type] = this.scrollNode.scrollTop;
  }

  componentWillUnmount() {
    scrollTop[this.props.type] = this.scrollNode.scrollTop;
  }

  assignRef = node => (this.scrollNode = node);

  render() {
    const { output } = this.props;
    return (
      <div className="home-output-view" ref={this.assignRef}>
        <Button
              icon="close-circle"
              size="small"
              className="clear-btn"
              shape="circle"
              onClick={this.props.actions.clearOutput}
            />
        <ul>
          {output.length === 0 && <li key="empty">No output.</li>}
          {output.map(item => (
            <li key={item.key} dangerouslySetInnerHTML={{ __html: item.text }} />
          ))}
        </ul>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    output: state.home.output,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ clearOutput }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OutputView);
