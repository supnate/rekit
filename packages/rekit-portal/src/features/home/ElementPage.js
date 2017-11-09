import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Alert, Button, Icon, Tabs } from 'antd';
import history from '../../common/history';
import { ElementDiagram } from '../diagram';
import { colors } from '../common';
import { CodeView } from './';

const TabPane = Tabs.TabPane;

export class ElementPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  static defaultProps = {
    match: {},
  };

  getElementData() {
    const { elementById, projectRoot } = this.props.home;
    let file = this.props.match.params.file;
    if (!file) return null;
    file = decodeURIComponent(file);
    const fullPath = projectRoot + file;
    const arr = fullPath.split('.');
    const ext = arr.length > 1 ? arr.pop() : null;
    const ele = elementById[file];

    if (!ele) return null;

    return {
      ...ele,
      hasDiagram: /^(js|jsx)$/.test(ext),
      hasTest: ele.feature && /^(js|jsx)$/.test(ext),
      hasCode: /^(js|jsx|html|css|less|scss|txt|json|sass|md|log|pl|py|sh|cmd)$/.test(ext),
      isPic: /^(jpe?g|png|gif|bmp)$/.test(ext),
    };
    // return _.find(featureById[feature].components, { name: ele.name });
  }

  getPageContainer() {
    return document.getElementById('page-container');
  }

  @autobind
  handleTabChange(tabKey) {
    // const data = this.getElementData();
    history.push(`/element/${encodeURIComponent(this.props.match.params.file)}/${tabKey}`);
    // history.push(`/element/${data.feature}/${encodeURIComponent(this.props.match.params.file)}/${tabKey}`);
  }

  @autobind
  handleRunTest() {
    const { file } = this.props.match.params;
    history.push(`/tools/tests/${encodeURIComponent(file)}`);
    // history.push(`/tools/tests/src%2Ffeatures%2F${feature}%2F${encodeURIComponent(file)}`);
  }

  renderNotFound() {
    return (
      <div className="home-element-page">
        <span style={{ color: 'red' }}>Element not found, please check the URL or if element exists.</span>
      </div>
    );
  }

  renderMarks() {
    const data = this.getElementData();
    if (!data.feature) return null;
    const featureById = this.props.home.featureById;
    const markDescription = {
      a: 'Async action',
      c: 'Connected to Redux store',
      r: 'Mapped to an URL path',
    };
    const marks = [];
    switch (data.type) {
      case 'component':
        if (data.connectToStore) marks.push('C');
        if (_.find(featureById[data.feature].routes, { component: data.name })) marks.push('R');
        break;
      case 'action':
        if (data.isAsync) marks.push('A');
        break;
      default:
        break;
    }
    return marks.map(mark => (
      <span
        key={mark}
        title={markDescription[mark.toLowerCase()]}
        className={`mark mark-${mark.toLowerCase()}`}
      >{mark}</span>
    ));
  }

  render() {
    // throw new Error('test');
    const data = this.getElementData();
    if (!data) {
      return this.renderNotFound();
    }

    const { home } = this.props;
    const onlyCode = data.hasCode && !data.hasDiagram && !data.hasTest;

    let codeFile;
    let tabKey = this.props.match.params.type || (onlyCode ? 'code' : 'diagram');

    if (!data.hasCode) tabKey = 'diagram';
    if (onlyCode) tabKey = 'code';
    if (tabKey === 'style' && (data.type !== 'component' || !data.feature)) tabKey = 'diagram';
    switch (tabKey) {
      case 'code':
        codeFile = data.file;
        break;
      case 'style':
        codeFile = `src/features/${data.feature}/${data.name}.${home.cssExt}`;
        break;
      case 'test':
        codeFile = `tests/${decodeURIComponent(this.props.match.params.file).replace(/^src\//, '').replace('.js', '')}.test.js`;
        break;
      default:
        codeFile = data.file;
        break;
    }

    const iconTypes = {
      component: 'appstore-o',
      action: 'notification',
      misc: 'file',
    };

    const arr = data.file.split('.');
    const ext = arr.length > 1 ? arr.pop() : null;

    // const title = data.feature ? `${data.feature} / ${data.name}` : data.file;
    return (
      <div className="home-element-page">
        <div className="page-title">
          <h2>
            <Icon type={iconTypes[data.type] || 'file'} style={{ color: colors[data.type] }} />&nbsp;
            {data.feature ? `${data.feature} / ${data.name}` : data.file}
            {this.renderMarks()}
          </h2>
        </div>
        {data.isPic &&
          <div className="pic-wrapper">
            <img src={`/${codeFile}`} alt={codeFile} />
          </div>
        }
        {!onlyCode && data.hasCode && !data.isPic && <Tabs activeKey={tabKey} animated={false} onChange={this.handleTabChange}>
          {data.hasDiagram && <TabPane tab="Diagram" key="diagram">
            <ElementDiagram homeStore={this.props.home} elementId={data.file} />
          </TabPane>}
          {data.hasCode && <TabPane tab="Code" key="code" />}
          {(data.type === 'component' && data.feature) && <TabPane tab="Style" key="style" />}
          {data.hasTest && <TabPane tab="Test" key="test" />}
        </Tabs>}
        {data.hasTest && tabKey === 'test' && <Button type="primary" style={{ marginBottom: 10 }} onClick={this.handleRunTest}>
          <Icon type="play-circle-o" /> Run test
        </Button>}
        {tabKey !== 'diagram' && data.hasCode && <CodeView file={codeFile} />}
        {!data.hasCode && !data.isPic && <Alert type="info" showIcon message={`".${ext}" is not supported to be displayed.`} />}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

export default connect(
  mapStateToProps,
)(ElementPage);
