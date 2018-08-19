import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import history from '../../common/history';
import { getDepsDiagramData } from './selectors/getDepsDiagramData';
import { colors } from '../common';

export default class DepsDiagram extends PureComponent {
  static propTypes = {
    elementById: PropTypes.object.isRequired,
    elementId: PropTypes.string.isRequired, // eslint-disable-line
    size: PropTypes.object,
    showLabels: PropTypes.bool,
  };

  static defaultProps = {
    showLabels: true,
    size: null,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);

    const size = this.getChartSize();
    this.svg = d3
      .select(this.d3Node)
      .append('svg')
      .attr('width', size.width)
      .attr('height', size.height);

    // TODO: Why not equal to r?
    const refXMap = {
      'dep-on': 32,
      'dep-by': 92,
    };
    this.svg
      .append('svg:defs')
      .selectAll('marker')
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
      .attr('fill', '#ddd')
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    this.sim = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force(
        'collide',
        d3
          .forceCollide(d => d.r + 15)
          .strength(1)
          .iterations(16)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(size.width / 2, size.height / 2))
      .on('tick', this.handleOnTick);

    this.linksGroup = this.svg.append('g');
    this.bgNodesGroup = this.svg.append('g');
    this.nodesGroup = this.svg.append('g');
    this.nodeLabelsGroup = this.svg.append('g');

    this.updateDiagram();
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (
      prevProps.homeStore !== props.homeStore ||
      prevProps.elementId !== props.elementId ||
      prevProps.size !== props.size
    ) {
      this.updateDiagram();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  getDiagramData() {
    const { elementById, elementId } = this.props;
    return getDepsDiagramData(elementById, elementId);
  }

  getChartSize() {
    const containerNode = this.d3Node.parentNode.parentNode;

    return (
      this.props.size || {
        width: Math.max(containerNode.offsetWidth, 400),
        height: Math.max(containerNode.offsetHeight, 400),
      }
    );
  }

  dragstarted = d => {
    if (!d3.event.active) this.sim.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  dragged = d => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  };

  dragended = d => {
    if (!d3.event.active) this.sim.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };

  updateDiagram() {
    const { elementId } = this.props;
    const diagramData = this.getDiagramData();
    const dataNodes = diagramData.nodes;
    const dataLinks = _.cloneDeep(diagramData.links);

    const size = this.getChartSize();
    this.svg.attr('width', size.width).attr('height', size.height);
    this.sim.force('center', d3.forceCenter(size.width / 2, size.height / 2));

    const drawBgNode = d3Selection =>
      d3Selection
        .attr('r', d => d.r + 3)
        .attr('stroke-width', 1)
        .attr('stroke', '#ccc')
        .attr('cursor', 'pointer')
        .attr('fill', '#222')
        .on('click', this.handleNodeClick)
        .call(
          d3
            .drag()
            .on('start', this.dragstarted)
            .on('drag', this.dragged)
            .on('end', this.dragended)
        );
    const bgNodes = this.bgNodesGroup.selectAll('circle').data(dataNodes.filter(n => n.type === 'feature'));
    bgNodes.exit().remove();
    this.bgNodes = drawBgNode(bgNodes);
    this.bgNodes = drawBgNode(bgNodes.enter().append('circle')).merge(this.bgNodes);

    const drawNode = d3Selection =>
      d3Selection
        .attr('r', d => d.r)
        .attr('stroke-width', d => (d.type === 'feature' ? 1 : 0))
        .attr('stroke', '#eee')
        .attr('cursor', 'pointer')
        .attr('fill', d => colors[d.type] || '#FFB14A')
        .on('click', this.handleNodeClick)
        .call(
          d3
            .drag()
            .on('start', this.dragstarted)
            .on('drag', this.dragged)
            .on('end', this.dragended)
        );
    const nodes = this.nodesGroup.selectAll('circle').data(dataNodes);
    nodes.exit().remove();
    this.nodes = drawNode(nodes);
    this.nodes = drawNode(nodes.enter().append('circle')).merge(this.nodes);

    const drawLink = d3Selection =>
      d3Selection
        .attr('class', 'line')
        .attr('stroke', '#ddd')
        .attr('stroke-dasharray', d => (d.target === elementId ? '3, 3' : ''))
        .attr('marker-end', l => (l.type === 'dep' ? `url(#${l.source === elementId ? 'dep-on' : 'dep-by'})` : ''));
    const links = this.linksGroup.selectAll('line').data(dataLinks.filter(l => l.type !== 'no-line'));
    links.exit().remove();
    this.links = drawLink(links);
    this.links = drawLink(links.enter().append('line')).merge(this.links);

    const drawNodeLabel = d3Selection =>
      d3Selection
        .attr('class', d => `element-node-text ${d.id !== elementId && d.type !== 'feature' ? 'dep-node' : ''}`)
        .attr('transform', 'translate(0, 2)')
        .attr('text-anchor', 'middle')
        .attr('cursor', 'pointer')
        .on('click', this.handleNodeClick)
        .text(d => d.name)
        .call(
          d3
            .drag()
            .on('start', this.dragstarted)
            .on('drag', this.dragged)
            .on('end', this.dragended)
        );

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
      .distance(d => distanceMap[d.type] || 50);
    this.sim.alpha(1).restart();
  }

  handleOnTick = () => {
    this.nodes.attr('cx', d => d.x).attr('cy', d => d.y);
    this.bgNodes.attr('cx', d => d.x).attr('cy', d => d.y);

    this.links
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    this.nodeLabels.attr('x', d => d.x).attr('y', d => d.y);
  };

  handleNodeClick = node => {
    const { elementById } = this.props;
    const ele = elementById[node.id];
    if (ele.type !== 'feature') {
      history.push(`/element/${encodeURIComponent(ele.file)}/diagram`);
    }
  };

  handleWindowResize = () => {
    this.updateDiagram();
  };

  render() {
    return (
      <div className="diagram-deps-diagram">
        <div
          className={`d3-node ${!this.props.showLabels ? 'no-text' : ''}`}
          ref={node => {
            this.d3Node = node;
          }}
        />
      </div>
    );
  }
}
