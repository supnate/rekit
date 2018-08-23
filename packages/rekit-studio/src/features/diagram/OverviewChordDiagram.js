import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import d3Tip from 'd3-tip';
import { Checkbox, Col, Icon, Popover, Row, Tooltip } from 'antd';
import history from '../../common/history';
import { getOverviewChordDiagramData } from './selectors/getOverviewChordDiagramData';

d3.tip = d3Tip;

let uidSeed = 0;
const uidHash = {};
function uid(key) {
  // map node key (usually file path) to a short uniq id
  if (!uidHash[key]) {
    uidHash[key] = `id${uidSeed}`;
    uidSeed += 1;
  }
  return uidHash[key];
}

function drawPieBg(d3Selection) {
  d3Selection
    .attr('class', 'pie-bg')
    .style('stroke-width', d => d.radius)
    // .transition() // start a transition to bring the new value into view
    // .duration(300)
    // .ease(d3.easeLinear)
    .attr('d', (d) => {
      const d3Path = d3.path();
      d3Path.arc(d.x, d.y, d.radius / 2, d.startAngle, d.endAngle);
      return d3Path;
    })
  ;
}

function getLinkCssClass(d) {
  // here source or target is the rekit element, type property doesn't have 's'.
  const source = d.source;
  const target = d.target;
  const sf = source.feature;
  const tf = target.feature;
  let st = source.type;
  let tt = target.type;
  const sid = uid(source.file);
  const tid = uid(target.file);
  if (st === 'component' || st === 'action') st += 's';
  if (tt === 'component' || tt === 'action') tt += 's';
  const cssClass = [
    `from-feature-${sf}`,
    `from-feature-type-${st}`,
    `to-feature-${tf}`,
    `to-feature-type-${tt}`,
    `from-file-${sid}`,
    `to-file-${tid}`,
  ];

  if (source.feature === target.feature) {
    cssClass.push('same-feature-dep');
  }

  cssClass.push('link-line');
  return cssClass.join(' ');
}

function drawLink(d3Selection) {
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

function drawFeatureNameText(d3Selection) {
  d3Selection
    .style('font-size', 12)
    .style('fill', '#999')
    .style('overflow', 'hidden')
    .style('text-overflow', 'ellipsis')
    .style('cursor', 'default')
    .attr('dy', -12)
    .attr('class', d => `text-node feature-${d.id}`)
    .append('textPath')
    .attr('xlink:href', d => `#group-${d.type}-${uid(d.id)}`)
    .style('text-anchor', 'start')
    .attr('startOffset', '0%')
    .text(d => d.name)
  ;
}

export class OverviewChordDiagram extends PureComponent {
  static propTypes = {
    home: PropTypes.object.isRequired,
    size: PropTypes.number.isRequired, // eslint-disable-line
  };

  static defaultProps = {
    size: 500,
  };

  constructor(props) {
    super(props);
    this.state.selectedFeatures = props.home.features;
  }

  state = {
    sameFeatureDepsVisible: true,
    selectedFeatures: [],
    highlightedGroup: null,
  };

  componentDidMount() {
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
    this.pieBgGroup = this.svg.append('svg:g');
    this.linksGroup = this.svg.append('svg:g');
    this.featureNamesTextGroup = this.svg.append('svg:g');
    this.featureNodesGroup = this.svg.append('svg:g');
    this.elementNodesGroup = this.svg.append('svg:g');
    this.fileNodesGroup = this.svg.append('svg:g');

    this.tooltip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(d => this.props.home.elementById[d.id].name)
    ;
    this.svg.call(this.tooltip);
    this.updateDiagram();
  }

  componentDidUpdate(prevProps, prevState) {
    const props = this.props;
    const state = this.state;
    if (prevProps.home !== props.home || prevProps.size !== props.size || prevState.selectedFeatures !== state.selectedFeatures) {
      this.updateDiagram();
    }

    if (prevState.highlightedGroup !== state.highlightedGroup) {
      this.highlightGroup();
    }
  }

  updateDiagram() {
    const { home, size } = this.props;
    const diagramData = getOverviewChordDiagramData(home, size, this.state.selectedFeatures);
    this.svg
      // .transition() // start a transition to bring the new value into view
      // .duration(300)
      // .ease(d3.easeLinear)
      .attr('width', this.props.size)
      .attr('height', this.props.size)
    ;

    const pieBg = this.pieBgGroup.selectAll('path').data(diagramData.outerGroups);
    pieBg.exit().remove();
    drawPieBg(pieBg.enter().append('svg:path'));
    drawPieBg(pieBg);

    const links = this.linksGroup.selectAll('path').data(diagramData.links);
    links.exit().remove();
    drawLink(links.enter().append('svg:path'));
    drawLink(links);

    this.drawGroups(diagramData.outerGroups, this.featureNodesGroup);
    this.drawGroups(diagramData.innerGroups, this.elementNodesGroup);
    this.drawGroups(diagramData.fileGroups, this.fileNodesGroup);

    const featureNamesText = this.featureNamesTextGroup.selectAll('text').data(diagramData.outerGroups);
    featureNamesText.exit().remove();
    drawFeatureNameText(featureNamesText.enter().append('svg:text'));
    drawFeatureNameText(featureNamesText);
  }

  drawGroups(groups, container) {
    const getCssClass = (d) => {
      let cssClass = `group-${d.type}`;
      if (d.type === 'feature') cssClass += ` feature-${d.id}`;
      else cssClass += ` ${d.type}-of-${d.feature}`;

      if (d.type === 'file') {
        const ele = this.props.home.elementById[d.id];
        const types = (ele.type === 'component' || ele.type === 'action') ? `${ele.type}s` : ele.type;
        cssClass += ` file-of-type-${types}`;
      }
      cssClass += ' group-node';
      return cssClass;
    };

    const self = this;
    const drawNode = (d3Selection) => {
      d3Selection
        .attr('id', d => `group-${d.type}-${uid(d.id)}`)
        .attr('stroke-width', d => d.strokeWidth)
        .attr('class', getCssClass)
        .attr('fill', 'transparent')
        // .transition() // start a transition to bring the new value into view
        // .duration(300)
        // .ease(d3.easeLinear)
        .attr('d', (d) => {
          const d3Path = d3.path();
          d3Path.arc(d.x, d.y, d.radius, d.startAngle, d.endAngle);
          return d3Path;
        })
        .on('mouseover', function(d){ self.handleGroupMouseover(d, this); })
        .on('mouseout', this.handleGroupMouseout)
        .on('click', this.handleGroupClick)
      ;
      // update tooltip
      // nodes.selectAll('title').remove();
      // nodes.append('svg:title')
      //   .text((d) => {
      //     if (d.type === 'file') {
      //       const ele = this.props.home.elementById[d.id];
      //       return ele.name;
      //     }
      //     return '';
      //   })
      // ;
    };

    const nodes = container.selectAll('path').data(groups);
    nodes.exit().remove();
    drawNode(nodes.enter().append('svg:path'));
    drawNode(nodes);
  }

  highlightGroup() {
    const { elementById } = this.props.home;
    if (this.state.highlightedGroup) {
      const d = this.state.highlightedGroup;
      this.svg.selectAll('.group-node, .link-line, .text-node').style('opacity', 0.1);
      this.svg.selectAll('.link-line').style('stroke-dasharray', '').style('stroke', '#ccc');
      const highlighted = [];
      const lighlightedLines = [];
      const dashed = [];
      if (d.type === 'feature') {
        highlighted.push(`.group-node.feature-${d.id}`);
        highlighted.push(`.group-node.actions-of-${d.id}`);
        highlighted.push(`.group-node.components-of-${d.id}`);
        highlighted.push(`.group-node.misc-of-${d.id}`);
        highlighted.push(`.group-node.file-of-${d.id}`);

        highlighted.push(`.link-line.from-feature-${d.id}`);
        highlighted.push(`.link-line.to-feature-${d.id}`);
        lighlightedLines.push(`.link-line.from-feature-${d.id}`);
        lighlightedLines.push(`.link-line.to-feature-${d.id}`);

        highlighted.push(`.text-node.feature-${d.id}`);

        dashed.push(`.link-line.to-feature-${d.id}`);
      } else if (d.type !== 'file') {
        highlighted.push(`.group-node.feature-${d.feature}`);
        highlighted.push(`.group-node.${d.type}-of-${d.feature}`);
        highlighted.push(`.group-node.file-of-${d.feature}.file-of-type-${d.type}`);

        highlighted.push(`.link-line.from-feature-${d.feature}.from-feature-type-${d.type}`);
        highlighted.push(`.link-line.to-feature-${d.feature}.to-feature-type-${d.type}`);
        lighlightedLines.push(`.link-line.from-feature-${d.feature}.from-feature-type-${d.type}`);
        lighlightedLines.push(`.link-line.to-feature-${d.feature}.to-feature-type-${d.type}`);

        highlighted.push(`.text-node.feature-${d.feature}`);

        dashed.push(`.link-line.to-feature-${d.feature}.to-feature-type-${d.type}`);
      } else {
        const ele = elementById[d.id];
        highlighted.push(`.group-node.feature-${ele.feature}`);
        highlighted.push(`.link-line.to-file-${uid(ele.file)}`);
        highlighted.push(`.link-line.from-file-${uid(ele.file)}`);
        lighlightedLines.push(`.link-line.to-file-${uid(ele.file)}`);
        lighlightedLines.push(`.link-line.from-file-${uid(ele.file)}`);
        highlighted.push(`.text-node.feature-${ele.feature}`);
        highlighted.push(`#group-file-${uid(d.id)}`);

        dashed.push(`.link-line.to-file-${uid(d.id)}`);
      }

      if (highlighted.length) this.svg.selectAll(highlighted.join(',')).style('opacity', 1);
      if (lighlightedLines.length) this.svg.selectAll(lighlightedLines.join(',')).style('stroke', '#aaa');
      if (dashed.length) this.svg.selectAll(dashed.join(',')).style('stroke-dasharray', '3, 3');
    } else {
      this.svg.selectAll('.group-node, .link-line, .text-node').style('opacity', 1);
      this.svg.selectAll('.link-line').style('stroke-dasharray', '').style('stroke', '#888');
    }
  }

  handleSvgMousemove = (_1, _2, targets) => {
    const { home, size } = this.props;
    const diagramData = getOverviewChordDiagramData(home, size, this.state.selectedFeatures);
    const [x, y] = d3.mouse(targets[0]);
    const d = Math.sqrt((x - diagramData.x) ** 2 + (y - diagramData.y) ** 2);

    if (d >= diagramData.radius + 5) {
      this.setState({
        highlightedGroup: null,
      });
    }
  }

  handleGroupMouseover = (d, target) => {
    if (d.type === 'file') this.tooltip.show(d, target);
    this.setState({
      highlightedGroup: d,
    });
  }

  handleGroupMouseout = (d) => {
    this.tooltip.hide(d);
  }

  handleGroupClick = (d) => {
    this.tooltip.hide();
    if (d.type === 'file') {
      const { elementById, projectRoot } = this.props.home;
      const ele = elementById[d.id];
      const file = ele.file.replace(`${projectRoot}/src/features/${ele.feature}/`, '');
      history.push(`/element/${encodeURIComponent(file)}/diagram`);
    }
  }

  handleToggleSameFeatureDepsVisible = (evt) => {
    this.setState({
      sameFeatureDepsVisible: evt.target.checked,
    });
  };

  handleSelectFeature = (fid, selected) => {
    const newSelected = [...this.state.selectedFeatures];
    if (!selected) _.pull(newSelected, fid);
    else newSelected.push(fid);
    this.setState({
      selectedFeatures: newSelected,
    });
  };

  renderFeaturesSelect() {
    const { features, featureById } = this.props.home;
    return (
      <ul className="diagram-overview-chord-diagram-feature-select">
        {features.map((fid) => {
          const selected = this.state.selectedFeatures;
          const checked = !selected.length || selected.includes(fid);
          const disabled = checked && selected.length === 1;
          return (
            <li key={fid}>
              <Checkbox
                checked={checked}
                disabled={disabled}
                onChange={evt => this.handleSelectFeature(fid, evt.target.checked)}
              >{featureById[fid].name}</Checkbox>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    let featureSelectLabel = 'All features';
    if (this.state.selectedFeatures.length === 1) {
      featureSelectLabel = this.props.home.featureById[this.state.selectedFeatures[0]].name;
    } else if (this.state.selectedFeatures.length < this.props.home.features.length) {
      featureSelectLabel = `${this.state.selectedFeatures.length}/${this.props.home.features.length} features`;
    }
    return (
      <div className="diagram-overview-chord-diagram">
        <Row>
          <Col span="12">
            <Checkbox checked={this.state.sameFeatureDepsVisible} onChange={this.handleToggleSameFeatureDepsVisible}>
              <span>
                Show internal deps
                <Tooltip title="Whether to show internal dependencies inside a feature.">
                  &nbsp; <Icon style={{ color: '#108ee9', fontSize: 12 }} type="question-circle-o" />
                </Tooltip>
              </span>
            </Checkbox>
          </Col>
          <Col span="12" style={{ textAlign: 'right' }}>
            <Popover placement="bottomRight" content={this.renderFeaturesSelect()}>
              <span style={{ cursor: 'default' }} className="feature-filter">{featureSelectLabel} </span><Icon type="caret-down" style={{ fontSize: 10 }} />
            </Popover>
          </Col>
        </Row>
        <div
          className={`svg-container ${this.state.sameFeatureDepsVisible ? 'same-feature-deps-visible' : ''}`}
          ref={(node) => { this.d3Node = node; }}
        />
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

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OverviewChordDiagram);
