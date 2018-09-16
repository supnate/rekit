import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

export default class AllDepsDiagram extends Component {
  static propTypes = {
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
  };

  componentDidMount() {
    this.initDiagram();
  }

  initDiagram = () => {
    this.svg = d3
      .select(this.d3Node)
      .append('svg')
      .on('mousemove', this.handleSvgMousemove)
    ;

    // this.svg.append('svg:defs').selectAll('marker')
    //   .data(['marker'])
    //   .enter()
    //   .append('svg:marker')
    //   .attr('id', String)
    //   .attr('viewBox', '0 -5 10 10')
    //   .attr('refX', 10)
    //   .attr('refY', 0)
    //   .attr('markerWidth', 6)
    //   .attr('markerHeight', 6)
    //   .attr('class', d => `triangle-marker ${d}`)
    //   .attr('orient', 'auto')
    //   .append('svg:path')
    //   .attr('d', 'M0,-5L10,0L0,5')
    ;
    this.linksGroup = this.svg.append('svg:g');
    this.nodesGroup = this.svg.append('svg:g');
    this.updateDiagram();
  }

  updateDiagram = () => {
    this.svg
      .attr('width', 500)
      .attr('height', 500)
    ;

    this.drawNodes();
    // this.drawLinks();
  }

  drawNodes = () => {
    const { nodes } = this.props;
    const drawNode = (d3Selection) => {
      d3Selection
        .attr('id', d => d.id)
        .attr('stroke-width', d => 10)
        .attr('stroke', d => d.color)
        .attr('d', (d) => {
          const d3Path = d3.path();
          d3Path.arc(d.x, d.y, d.radius, d.startAngle, d.endAngle);
          return d3Path;
        })
      ;
    };

    const allNodes = this.nodesGroup.selectAll('path').data(nodes);
    allNodes.exit().remove();
    drawNode(allNodes.enter().append('svg:path'));
    // drawNode(allNodes);
  }

  drawLinks = () => {
    const { nodes } = this.props;
    const drawLink = (d3Selection) => {
  d3Selection
    .attr('marker-end', 'url(#marker)') // eslint-disable-line
    .attr('class', getLinkCssClass)
    .attr('d', (d) => {
      const d3Path = d3.path();
      d3Path.moveTo(d.x1, d.y1);
      d3Path.quadraticCurveTo(d.cpx, d.cpy, d.x2, d.y2);
      return d3Path;
    })
  ;
}

    const allNodes = this.nodesGroup.selectAll('path').data(nodes);
    allNodes.exit().remove();
    drawNode(allNodes.enter().append('svg:path'));
    drawNode(allNodes);
  }

  render() {
    const { nodes, links } = this.props;
    return (
      <div className="diagram-all-deps-diagram">
        <div
          ref={(node) => { this.d3Node = node; }}
        />
      </div>
    );
  }
}
