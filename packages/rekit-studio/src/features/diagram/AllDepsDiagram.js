import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { getAllDepsDiagramData } from './selectors/getAllDepsDiagramData';
import colors from '../../common/colors';

export default class AllDepsDiagram extends Component {
  static propTypes = {
    onNodeClick: PropTypes.func,
    elementById: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onNodeClick() {},
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDiagram);
    requestAnimationFrame(this.initDiagram);
  }

  componentWillUnmount() {
    this.tooltip.hide();
    window.removeEventListener('resize', this.updateDiagram);

  }

  getSize() {
    const containerNode = this.d3Node;
    return Math.max(Math.min(containerNode.offsetWidth, containerNode.offsetHeight), 100);
  }

  initDiagram = () => {
    this.svg = d3
      .select(this.d3Node)
      .append('svg')
      .on('mousemove', this.handleSvgMousemove);

    this.svg
      .append('svg:defs')
      .selectAll('marker')
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
      .attr('fill', '#ddd')
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');
    this.linksGroup = this.svg.append('svg:g');
    this.nodesGroup = this.svg.append('svg:g');

    this.tooltip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(d => d.name);
    this.svg.call(this.tooltip);

    this.updateDiagram();
  };

  updateDiagram = () => {
    const size = this.getSize();
    this.svg.attr('width', size).attr('height', size);
    const { elementById } = this.props;
    const { nodes, links } = getAllDepsDiagramData({ elementById, size });

    this.drawNodes(nodes);
    this.drawLinks(links);
  };

  drawNodes = nodes => {
    const drawNode = d3Selection => {
      d3Selection
        .attr('id', d => d.id)
        .attr('stroke-width', d => 10)
        .attr('stroke', d => colors(d.type))
        .attr('class', 'element-node')
        .attr('d', d => {
          const d3Path = d3.path();
          d3Path.arc(d.x, d.y, d.radius, d.startAngle, d.endAngle);
          return d3Path;
        })
        .on('mouseover', this.hanldeNodeMouseover)
        .on('mouseout', this.handleNodeMouseout)
        .on('click', this.props.onNodeClick);
    };

    const allNodes = this.nodesGroup.selectAll('path').data(nodes);
    allNodes.exit().remove();
    drawNode(allNodes.enter().append('svg:path'));
    drawNode(allNodes);
  };

  drawLinks = links => {
    const drawLink = d3Selection => {
      d3Selection
        .attr('marker-end', 'url(#marker)') // eslint-disable-line
        // .attr('class', getLinkCssClass)
        .attr('fill', 'transparent')
        .attr('stroke', '#ddd')
        .attr('stroke-width', '1px')
        .attr('d', d => {
          const d3Path = d3.path();
          d3Path.moveTo(d.x1, d.y1);
          d3Path.quadraticCurveTo(d.cpx, d.cpy, d.x2, d.y2);
          return d3Path;
        });
    };

    const linksNodes = this.linksGroup.selectAll('path').data(links);
    linksNodes.exit().remove();
    drawLink(linksNodes.enter().append('svg:path'));
    drawLink(linksNodes);
  };

  hanldeNodeMouseover = (d, index, nodes) => {
    this.tooltip.show(d, nodes[index]);
  };

  handleNodeMouseout = d => {
    this.tooltip.hide(d);
  };

  render() {
    return (
      <div
        className="diagram-all-deps-diagram"
        ref={node => {
          this.d3Node = node;
        }}
      />
    );
  }
}
