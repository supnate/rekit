import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import * as d3 from 'd3';
import { colors } from '../common';
import { getOverviewDiagramData } from './selectors/getOverviewDiagramData';

export default class OverviewDiagram extends PureComponent {
  static propTypes = {
    homeStore: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.refresh(this.props);
  }

  getCurveData(d) {
    const ax = d.source.x;
    const ay = d.source.y;
    const bx = d.target.x;
    const by = d.target.y;

    const jx = (ax + bx) / 2;
    const jy = (ay + by) / 2;
    // console.log(mx, my);
    // We need a and b to find theta, and we need to know the sign of each to make sure that the orientation is correct.
    const a = bx - ax;
    const asign = (a < 0 ? -1 : 1);
    const b = by - ay;
    // const bsign = (b < 0 ? -1 : 1);
    const theta = Math.atan(b / a);

    // Find the point that's perpendicular to J on side
    const costheta = asign * Math.cos(theta);
    const sintheta = asign * Math.sin(theta);

    const m = 30 * d.pos;
    // Find c and d
    const c1 = m * sintheta;
    const d1 = m * costheta;

    // Use c and d to find Kx and Ky
    const mx = jx - c1;
    const my = jy + d1;

    return { ax, bx, ay, by, mx, my };
  }

  refresh(props) {
    const data = getOverviewDiagramData(props.homeStore);
    console.log('overview diagram: ', data);
    const chartWidth = 600;
    const chartHeight = 600;

    const svg = d3
      .select(this.d3Node)
      .append('svg')
      .attr('width', '100%')
      .attr('height', chartHeight)
    ;

    svg.append('svg:defs').selectAll('marker')
      .data(['action', 'component', 'misc'])
      .enter()
      .append('svg:marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 62)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('class', d => `triangle-marker ${d}`)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    // const data = this.props.diagramData;


    const sim = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('collide', d3.forceCollide(d => d.r + 8).strength(1).iterations(16))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
      ;

    function dragstarted(d) {
      if (!d3.event.active) sim.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) sim.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    const path = svg.append('svg:g').selectAll('path')
      .data(data.links.filter(d => d.type !== 'f-f'))
      .enter()
      .append('svg:path')
      .attr('class', d => `link ${d.type}`)
      .attr('marker-end', function(d) { return 'url(#' + d.type + ')'; }) // eslint-disable-line
      .attr('stroke-width', 1)
      .attr('stroke', '#aaa')
      .attr('fill', 'transparent')
    ;

    const edgeLabelBg = svg.selectAll('.edge-label-bg')
      .data(data.links.filter(d => d.type !== 'f-f'))
      .enter()
      .append('g')
      .append('circle')
      .attr('class', d => `edge-label-bg ${d.type}`)
      .attr('fill', d => colors[d.type])
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1)
      .attr('r', 6)
      // .attr('height', 12)
      // .attr('transform', 'translate(-6, -10)')
    ;

    const edgeLabel = svg.selectAll('.edge-label')
      .data(data.links.filter(d => d.type !== 'f-f'))
      .enter()
      .append('g')
      .append('svg:text')
      .attr('class', 'edge-label')
      .attr('fill', '#ffffff')
      .attr('transform', 'translate(0, 2)')
      .attr('text-anchor', 'middle')
      .attr('font-size', 7)
      .text(d => d.count);

    const node = svg.append('g')
      .attr('class', 'feature-node')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.r)
      .attr('cursor', 'pointer')
      .attr('stroke-width', 1)
      .attr('stroke', '#555')
    ;
      // .call(d3.drag()
      // .on('start', dragstarted)
      // .on('drag', dragged)
      // .on('end', dragended));

    const nodeInner = svg.append('g')
      .attr('class', 'feature-node-inner')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.r - 3)
      .attr('stroke-width', 1)
      .attr('cursor', 'pointer')
      .attr('stroke', '#555')
      .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))
    ;

    const nodeText = svg.selectAll('.node-text')
      .data(data.nodes)
      .enter()
      .append('g')
      .append('svg:text')
      .attr('class', 'node-text')
      .attr('cursor', 'pointer')
      .attr('fill', '#333')
      .attr('transform', 'translate(0, 2)')
      .attr('text-anchor', 'middle')
      .attr('font-size', 8)
      .text(d => d.name)
    ;

    const _this = this; // eslint-disable-line
    function ticked() {
      path
        .attr('d', (d) => {
          const d3Path = d3.path();
          const curve = _this.getCurveData(d);
          d3Path.moveTo(curve.ax, curve.ay);
          d3Path.quadraticCurveTo(curve.mx, curve.my, curve.bx, curve.by);
          return d3Path.toString();
        })
        
      ;

      const getEdgeLabelPos = (d) => {
        const curve = _this.getCurveData(d);
        const jx = (curve.ax + curve.bx) / 2;
        const jy = (curve.ay + curve.by) / 2;
        const x = (curve.mx + jx) / 2;
        const y = (curve.my + jy) / 2;
        return { x, y };
      };

      edgeLabelBg
        .attr('cx', d => getEdgeLabelPos(d).x)
        .attr('cy', d => getEdgeLabelPos(d).y)
      ;

      edgeLabel
        .attr('x', d => getEdgeLabelPos(d).x)
        .attr('y', d => getEdgeLabelPos(d).y)
      ;

      node
        .attr('fill', '#ffffff')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
      ;

      nodeInner
        .attr('fill', colors.featureInner)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
      ;

      nodeText
        .attr('x', d => d.x)
        .attr('y', d => d.y)
      ;
    }

    sim
      .nodes(data.nodes)
      .on('tick', ticked);

    sim
      .force('link')
      .links(data.links)
      .distance(d => (d.type === 'f-f' ? 300 : 200))
      .iterations(16)
    ;
  }

  render() {
    return (
      <div className="diagram-overview-diagram">
        <div ref={(node) => { this.d3Node = node; }} />

      </div>
    );
  }
}
