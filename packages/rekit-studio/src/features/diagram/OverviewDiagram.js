import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { getDepsDiagramByFeatureData } from './selectors/getDepsDiagramByFeatureData';
import colors from '../../common/colors';

export default class OverviewDiagram extends Component {
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

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (prevProps.elementById !== props.elementById) {
      this.updateDiagram();
    }
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
      .attr('fill', '#ccc')
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    // this.groupsGroup = this.svg.append('svg:g');
    this.pieBgGroup = this.svg.append('svg:g');
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
    this.diagramData = getDepsDiagramByFeatureData({
      elementById,
      size,
    });

    const { nodes, links } = this.diagramData;

    this.drawPies(nodes);
    this.drawNodes(nodes);
    this.drawLinks(links);
  };

  drawNodes = nodes => {
    const drawNode = d3Selection => {
      d3Selection
        .attr('id', d => d.id)
        .attr('stroke-width', d => d.width)
        .attr('stroke', d => {
          if (/v:container-/.test(d.type)) {
            return d3
              .color(colors(d.type.replace('v:container-', '')))
              .brighter(0.75)
              .hex();
          }
          return colors(d.type);
        })
        .attr('fill', 'transparent')
        .attr('class', 'path-element-node od-path')
        .attr('d', d => {
          const d3Path = d3.path();
          d3Path.arc(d.x, d.y, d.radius, d.startAngle, d.endAngle);
          return d3Path;
        })
        .on('mouseover', this.hanldeNodeMouseover)
        .on('mouseout', this.handleNodeMouseout);
      // .on('click', this.props.onNodeClick);
    };

    const allNodes = this.nodesGroup.selectAll('path').data(nodes);
    allNodes.exit().remove();
    drawNode(allNodes.enter().append('svg:path'));
    drawNode(allNodes);
  };

  drawLinks = links => {
    const drawLink = d3Selection => {
      d3Selection
        .attr('id', d => `${d.source.id}-${d.target.id}`)
        .attr('marker-end', 'url(#marker)') // eslint-disable-line
        .attr('fill', 'transparent')
        .attr('stroke', '#ccc')
        .attr('stroke-width', '1px')
        .attr(
          'class',
          d => `path-link od-path ${d.source.feature === d.target.feature ? 'same-feature-dep' : ''}`
        )
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

  drawPies = nodes => {
    const pies = nodes.filter(n => n.type === 'feature').map(f => ({
      id: `${f.id}:pie`,
      width: f.radius - f.width / 2,
      x: f.x,
      y: f.y,
      startAngle: f.startAngle,
      endAngle: f.endAngle,
    }));

    const drawPie = d3Selection => {
      d3Selection
        .attr('id', d => d.id)
        .attr('stroke-width', d => d.width)
        .attr('stroke', 'rgba(255, 255, 255, 0.1)')
        .attr('fill', 'transparent')
        .attr('class', 'feature-pie-node')
        .attr('d', d => {
          const d3Path = d3.path();
          d3Path.arc(d.x, d.y, d.width / 2, d.startAngle, d.endAngle);
          return d3Path;
        });
    };

    const pieNodes = this.pieBgGroup.selectAll('path').data(pies);
    pieNodes.exit().remove();
    drawPie(pieNodes.enter().append('svg:path'));
    drawPie(pieNodes);
  };

  hanldeNodeMouseover = (d, index, nodes) => {
    this.tooltip.show(d, nodes[index]);
    this.highlightNode(d, nodes[index]);
  };

  handleNodeMouseout = (d, index, nodes) => {
    this.tooltip.hide(d);
    this.delightNode(d, nodes[index]);
  };

  highlightNode = (d, target) => {
    if (d.type.startsWith('v:container-')) return;

    this.nodesGroup.selectAll('path').attr('opacity', 0.1);
    this.linksGroup.selectAll('path').attr('opacity', 0.1);
    const paths = this.svg.selectAll('path.od-path');
    const { depsData } = this.diagramData;

    const toHighlight = data => {
      const { nodeById } = this.diagramData;
      const relEles = [
        ...(depsData.dependencies[data.id] || []),
        ...(depsData.dependents[data.id] || []),
      ];

      if (d.type === 'feature') {
        return (
          data.feature === d.name ||
          _.get(data, 'source.feature') === d.name || // link out
          _.get(data, 'target.feature') === d.name || // link in
          relEles.some(id => nodeById[id] && nodeById[id].feature === d.name)
        );
      } else {
        return (
          data.id === d.id || // itself
          _.get(data, 'source.id') === d.id || // link out
          _.get(data, 'target.id') === d.id || // link in
          relEles.includes(d.id)
        );
      }
    };

    paths
      .filter(data => {
        if (!data) return false;
        return toHighlight(data);
      })
      .attr('opacity', 1);

    if (d.type === 'feature') {
      paths
        .filter(data => _.get(data, 'target.feature') === d.name)
        .style('stroke-dasharray', '3, 3');
    } else {
      paths.filter(data => _.get(data, 'target.id') === d.id).style('stroke-dasharray', '3, 3');
    }
  };

  delightNode = (d, target) => {
    d3.select(target).attr('opacity', 1);
    d3.selectAll('path.od-path').attr('opacity', 1);
    this.linksGroup.selectAll('path').style('stroke-dasharray', '');
  };

  render() {
    return (
      <div
        className="diagram-overview-diagram"
        ref={node => {
          this.d3Node = node;
        }}
      />
    );
  }
}
