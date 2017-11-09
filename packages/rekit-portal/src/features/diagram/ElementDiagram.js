import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import * as d3 from 'd3';
import { Checkbox, Col, Icon, Popover, Row } from 'antd';
import history from '../../common/history';
import { getElementDiagramData } from './selectors/getElementDiagramData';
import { colors } from '../common';

let chartWidth = 600;
let chartHeight = 500;

export default class ElementDiagram extends PureComponent {
  static propTypes = {
    homeStore: PropTypes.object.isRequired,
    elementId: PropTypes.string.isRequired, // eslint-disable-line
  };

  state = {
    showText: true,
  };

  componentDidMount() {
    const pageContainer = document.querySelector('.page-container');
    chartHeight = pageContainer.offsetHeight - 250; // 250 is header height and paddings
    chartWidth = pageContainer.offsetWidth - 80; // 80 is paddings
    if (chartHeight < 400) chartHeight = 400;
    if (chartWidth < 400) chartWidth = 400;

    this.svg = d3
      .select(this.d3Node)
      .append('svg')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
    ;

    // TODO: Why not equal to r?
    const refXMap = {
      'dep-on': 32,
      'dep-by': 92,
    };
    this.svg.append('svg:defs').selectAll('marker')
      .data(['dep-on', 'dep-by'])
      .enter()
      .append('svg:marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', d => refXMap[d])
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('class', d => `triangle-marker ${d}`)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
    ;

    this.sim = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('collide', d3.forceCollide(d => d.r + 15).strength(1).iterations(16))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(300, 250))
      // .alphaTarget(1)
      .on('tick', this.handleOnTick)
    ;

    this.linksGroup = this.svg.append('g');
    this.bgNodesGroup = this.svg.append('g');
    this.nodesGroup = this.svg.append('g');
    this.nodeLabelsGroup = this.svg.append('g');

    this.updateDiagram();
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (prevProps.homeStore !== props.homeStore || prevProps.elementId !== props.elementId) {
      this.updateDiagram();
    }
  }

  @autobind
  dragstarted(d) {
    if (!d3.event.active) this.sim.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  @autobind
  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  @autobind
  dragended(d) {
    if (!d3.event.active) this.sim.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  updateDiagram() {
    const { homeStore, elementId } = this.props;
    const diagramData = getElementDiagramData(homeStore, elementId);
    const dataNodes = diagramData.nodes;
    // d3.forceLayout will alter links data, so clone it so that the data could be re-used.
    const dataLinks = _.cloneDeep(diagramData.links);

    const drawBgNode = d3Selection => d3Selection
      .attr('r', d => d.r + 3)
      .attr('stroke-width', 1)
      .attr('stroke', '#555')
      .attr('cursor', 'pointer')
      .attr('fill', '#fff')
      .on('click', this.handleNodeClick)
      .call(d3.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended)
      )
    ;
    const bgNodes = this.bgNodesGroup.selectAll('circle').data(dataNodes.filter(n => n.type === 'feature'));
    bgNodes.exit().remove();
    this.bgNodes = drawBgNode(bgNodes);
    this.bgNodes = drawBgNode(bgNodes.enter().append('circle')).merge(this.bgNodes);

    const drawNode = d3Selection => d3Selection
      .attr('r', d => d.r)
      .attr('stroke-width', d => (d.type === 'feature' ? 1 : 0))
      .attr('stroke', '#555')
      .attr('cursor', 'pointer')
      .attr('fill', d => colors[d.type])
      .on('click', this.handleNodeClick)
      .call(d3.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended)
      )
    ;
    const nodes = this.nodesGroup.selectAll('circle').data(dataNodes);
    nodes.exit().remove();
    this.nodes = drawNode(nodes);
    this.nodes = drawNode(nodes.enter().append('circle')).merge(this.nodes);

    const drawLink = d3Selection => d3Selection
      .attr('class', 'line')
      .attr('stroke', '#555')
      .attr('stroke-dasharray', d => (d.target === elementId ? '3, 3' : ''))
      .attr('marker-end', l => (l.type === 'dep' ? `url(#${l.source === elementId ? 'dep-on' : 'dep-by'})` : ''))
    ;
    const links = this.linksGroup.selectAll('line').data(dataLinks.filter(l => l.type !== 'no-line'));
    links.exit().remove();
    this.links = drawLink(links);
    this.links = drawLink(links.enter().append('line')).merge(this.links);

    const drawNodeLabel = d3Selection => d3Selection
      .attr('class', d => `element-node-text ${d.id !== elementId && d.type !== 'feature' ? 'dep-node' : ''}`)
      .attr('transform', 'translate(0, 2)')
      .attr('text-anchor', 'middle')
      .attr('cursor', 'pointer')
      .on('click', this.handleNodeClick)
      .text(d => d.name)
      .call(d3.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended)
      )
    ;

    const nodeLabels = this.nodeLabelsGroup.selectAll('text').data(dataNodes);
    nodeLabels.exit().remove();
    this.nodeLabels = drawNodeLabel(nodeLabels);
    this.nodeLabels = drawNodeLabel(nodeLabels.enter().append('text')).merge(this.nodeLabels);

    const distanceMap = {
      child: 100,
      dep: 100,
      'no-line': 280,
    };

    this.sim.nodes(dataNodes);
    this.sim
      .force('link')
      .links(dataLinks)
      .distance(d => distanceMap[d.type] || 50)
    ;
    this.sim.alpha(1).restart();
  }

  @autobind
  handleOnTick() {
    this.nodes
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
    ;

    this.bgNodes
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
    ;

    this.links
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
    ;

    this.nodeLabels
      .attr('x', d => d.x)
      .attr('y', d => d.y)
    ;
  }

  @autobind
  handleNodeClick(node) {
    const home = this.props.homeStore;
    const ele = home.elementById[node.id];
    if (ele.type !== 'feature') {
      history.push(`/element/${encodeURIComponent(ele.file)}/diagram`);
    }
  }

  @autobind
  handleToggleText(evt) {
    this.setState({
      showText: evt.target.checked,
    });
  }

  renderContextHelp() {
    return (
      <div className="diagram-element-diagram-help">
        <ul>
          <li><span className="feature" /> Feature</li>
          <li><span className="action" /> Action</li>
          <li><span className="component" /> Component</li>
          <li><span className="misc" /> Misc</li>
        </ul>
        <p>
          This diagram provides a focused view of the relationship between the selected element and others.
        </p>
        <p>
          It helps to understand a module quickly, and helps to find out over-complicated modules.
        </p>
      </div>
    );
  }

  render() {
    return (
      <div className="diagram-element-diagram">
        <div className="diagram-header">
          <Row>
            <Col span="18">
              <Checkbox checked={this.state.showText} onChange={this.handleToggleText}>Show labels</Checkbox>
            </Col>
            <Col span="6" style={{ textAlign: 'right' }}>
              <Popover placement="leftTop" title={<p style={{ fontSize: 18 }}>Element diagram</p>} content={this.renderContextHelp()}> &nbsp;<Icon style={{ color: '#108ee9', fontSize: 16 }} type="question-circle-o" /></Popover>
            </Col>
          </Row>
        </div>
        <div className={`d3-node ${!this.state.showText ? 'no-text' : ''}`} ref={(node) => { this.d3Node = node; }} />
      </div>
    );
  }
}
