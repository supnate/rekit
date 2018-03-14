import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, Icon, Tabs } from 'antd';
import history from '../../common/history';
import { ElementDiagram } from '../diagram';
import { colors } from '../common';
import modelManager from '../common/monaco/modelManager';
import { CodeEditor } from './';

const TabPane = Tabs.TabPane;

export class ElementPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state.editAreaSize = this.getEditAreaSize();
  }

  state = {
    codeChanged: false,
    editAreaSize: null,
  };

  componentWillMount() {
    // Ensure the tab is opened.
    window.addEventListener('resize', this.handleWindowResize);

    // This is used to show tab when refresh the element page.
    this.props.dispatch({
      type: '@@router/LOCATION_CHANGE',
      payload: this.props.router.location,
    });
  }

  componentDidMount() {
    document.getElementById('page-container').className = 'page-container full-screen';
  }

  componentWillUnmount() {
    document.getElementById('page-container').className = 'page-container';
    window.removeEventListener('resize', this.handleWindowResize);
  }

  getPageContainer() {
    return document.getElementById('page-container');
  }

  getElementData() {
    const { elementById, projectRoot } = this.props.home;
    let { file } = this.props.match.params;
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
      hasTest: ele.hasTest,
      isRoute: ele.feature && ele.name === 'route.js',
      hasCode: /^(js|jsx|html|css|less|scss|txt|json|sass|md|log|pl|py|sh|cmd)$/.test(ext),
      isPic: /^(jpe?g|png|gif|bmp)$/.test(ext),
    };
    // return _.find(featureById[feature].components, { name: ele.name });
  }

  getEditAreaSize() {
    return {
      width: document.body.offsetWidth - this.props.home.sidePanelWidth,
      height: document.body.offsetHeight - 80,
    };
  }

  handleWindowResize = () => {
    this.setState({
      editAreaSize: this.getEditAreaSize(),
    });
  };

  handleTabChange = tabKey => {
    const file = decodeURIComponent(this.props.match.params.file);
    history.push(`/element/${encodeURIComponent(file)}/${tabKey}`);
  };

  handleRunTest = () => {
    const { file } = this.props.match.params;
    history.push(`/tools/tests/${encodeURIComponent(file)}`);
  };

  getCodeFile(tabKey) {
    const data = this.getElementData();

    const { home } = this.props;
    // const onlyCode = data.hasCode && !data.hasDiagram && !data.hasTest;

    let codeFile;

    // if (!data.hasCode) tabKey = 'diagram';
    // if (onlyCode) tabKey = 'code';
    // if (tabKey === 'style' && (data.type !== 'component' || !data.feature)) tabKey = 'diagram';
    switch (tabKey) {
      case 'code':
        codeFile = data.file;
        break;
      case 'style':
        codeFile = `src/features/${data.feature}/${data.name}.${home.cssExt}`;
        break;
      case 'test':
        codeFile = `tests/${decodeURIComponent(this.props.match.params.file)
          .replace(/^src\//, '')
          .replace('.js', '')}.test.js`;
        break;
      default:
        return null;
    }
    return codeFile;
  }

  renderNotFound() {
    return (
      <div className="home-element-page">
        <div style={{ color: 'red', padding: '30px' }}>
          Element not found, please check the URL or if element exists.
        </div>
      </div>
    );
  }

  renderMarks() {
    const data = this.getElementData();
    if (!data.feature) return null;
    const { featureById } = this.props.home;
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
      <span key={mark} title={markDescription[mark.toLowerCase()]} className={`mark mark-${mark.toLowerCase()}`}>
        {mark}
      </span>
    ));
  }

  renderTabTitle(key) {
    const file = this.getCodeFile(key);
    return (
      <span>
        {_.capitalize(key)}
        {file && modelManager.isChanged(file) ? <span style={{ color: '#108ee9' }}> *</span> : null}
      </span>
    );
  }

  render() {
    const data = this.getElementData();console.log(data);
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
        codeFile = `tests/${decodeURIComponent(this.props.match.params.file)
          .replace(/^src\//, '')
          .replace('.js', '')}.test.js`;
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
        {data.isPic && (
          <div className="pic-wrapper">
            <img src={`/${codeFile}`} alt={codeFile} />
          </div>
        )}
        {!onlyCode &&
          data.hasCode &&
          !data.isPic && (
            <Tabs activeKey={tabKey} animated={false} onChange={this.handleTabChange}>
              {data.hasDiagram && (
                <TabPane tab="Diagram" key="diagram">
                  <ElementDiagram homeStore={this.props.home} elementId={data.file} size={this.state.editAreaSize} />
                </TabPane>
              )}
              {data.hasCode && <TabPane tab={this.renderTabTitle('code')} key="code" />}
              {data.type === 'component' && data.feature && <TabPane tab={this.renderTabTitle('style')} key="style" />}
              {data.hasTest && <TabPane tab={this.renderTabTitle('test')} key="test" />}
            </Tabs>
          )}
        {tabKey !== 'diagram' &&
          data.hasCode && (
            <CodeEditor file={codeFile} onRunTest={data.hasTest && tabKey === 'test' ? this.handleRunTest : null} />
          )}
        {!data.hasCode &&
          !data.isPic && (
            <Alert
              type="error"
              showIcon
              message={`The file with extension ".${ext}" will not be displayed because it is either binary, very large or uses an unsupported text encoding.`}
            />
          )}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
    router: state.router,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    actions: bindActionCreators({}, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ElementPage);
