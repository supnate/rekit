import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import history from '../../common/history';
import colors from '../../common/colors';


export default class OverviewDiagram extends PureComponent {
  static propTypes = {
    size: PropTypes.object,
    showLabels: PropTypes.bool,
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
    targetId: PropTypes.string.isRequired,
    handleNodeClick: PropTypes.func,
  };

  static defaultProps = {
    showLabels: true,
    size: null,
    handleNodeClick: null,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
    // requestAnimationFrame(this.initDiagram);
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (
      prevProps.nodes !== props.nodes ||
      prevProps.links !== props.links ||
      prevProps.targetId !== props.targetId ||
      prevProps.size !== props.size
    ) {
      // this.updateDiagram();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  initDiagram = () => {
    this.svg = d3
      .select(this.d3Node)
      .append('svg')
      .on('mousemove', this.handleSvgMousemove)
    ;

    this.svg.append('svg:defs').selectAll('marker')
      .data(['marker'])
      .enter()
      .append('svg:marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('class', d => `triangle-marker ${d}`)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
    ;
    this.linksGroup = this.svg.append('svg:g');
    this.elementNodesGroup = this.svg.append('svg:g');
    this.updateDiagram();
  };

  getChartSize() {
    const containerNode = this.d3Node.parentNode;
    return (
      this.props.size || {
        width: Math.max(containerNode.offsetWidth, 400),
        height: Math.max(containerNode.offsetHeight, 400),
      }
    );
  }


  updateDiagram() {
    const { targetId } = this.props;

    const dataNodes = this.props.nodes;
    const dataLinks = _.cloneDeep(this.props.links);
    const size = this.getChartSize();
    this.svg.attr('width', size.width).attr('height', size.height);
    this.sim.force('center', d3.forceCenter(size.width / 2, size.height / 2));

    const drawBgNode = d3Selection =>
      d3Selection
        .attr('r', d => d.outerRadius || d.radius + 3)
        .attr('stroke-width', d => d.outerBorderWidth || 1)
        .attr('stroke', d => d.outerBorderColor || '#ccc')
        .attr('cursor', d => d.cursor || 'pointer')
        .attr('fill', d => d.outerBgColor || '#222')
        .on('click', this.handleNodeClick)
        .call(
          d3
            .drag()
            .on('start', this.dragstarted)
            .on('drag', this.dragged)
            .on('end', this.dragended)
        );
    const bgNodes = this.bgNodesGroup
      .selectAll('circle')
      .data(dataNodes.filter(n => n.doubleCircle));
    bgNodes.exit().remove();
    this.bgNodes = drawBgNode(bgNodes);
    this.bgNodes = drawBgNode(bgNodes.enter().append('circle')).merge(this.bgNodes);

    const drawNode = d3Selection =>
      d3Selection
        .attr('r', d => d.radius)
        .attr('stroke-width', d => d.borderWidth || 0)
        .attr('stroke', d => d.borderColor || '#eee')
        .attr('cursor', d => d.cursor || 'pointer')
        .attr('fill', d => d.bgColor)
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
        .attr('stroke', d => d.color || '#ddd')
        .attr('stroke-dasharray', d => d.dashed || (d.target === targetId ? '3, 3' : ''))
        .attr(
          'marker-end',
          l => (l.type === 'dep' ? `url(#${l.source === targetId ? 'dep-on' : 'dep-by'})` : '')
        );
    const links = this.linksGroup
      .selectAll('line')
      .data(dataLinks.filter(l => l.type !== 'no-line'));
    links.exit().remove();
    this.links = drawLink(links);
    this.links = drawLink(links.enter().append('line')).merge(this.links);

    const drawNodeLabel = d3Selection =>
      d3Selection
        .attr(
          'class',
          d => `element-node-text ${d.id !== targetId && d.type !== 'feature' ? 'dep-node' : ''}`
        )
        .attr('transform', 'translate(0, 2)')
        .attr('text-anchor', 'middle')
        .attr('cursor', d => d.cursor || 'pointer')
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
      child: 120,
      dep: 120,
      'no-line': 320,
    };

    this.sim.nodes(dataNodes);
    this.sim
      .force('link')
      .links(dataLinks)
      .distance(d => d.length || distanceMap[d.type] || 50);
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
    if (node.noClick) return;
    if (this.props.handleNodeClick) this.props.handleNodeClick(node);
    else if (node.id) {
      history.push(`/element/${encodeURIComponent(node.id)}/diagram`);
    }
  };

  handleWindowResize = () => {
    this.updateDiagram();
  };

  render() {
    return (
      <div className="diagram-overview-diagram">abc
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
