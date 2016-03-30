import React, { Component, PropTypes } from 'react'
import d3 from 'd3'
import horizon from 'd3-plugins-dist/dist/mbostock/horizon/es6'
import { sortBy } from 'lodash'

import css from './horizon-chart.css'
import margin from './margin'

class HorizonChart extends Component {
  static propTypes = {
    counts: PropTypes.array,
    extents: PropTypes.array
  }

  render() {
    return <div {...css} ref="container"></div>
  }

  componentDidMount() {
    let { width, height } = this.refs.container.getBoundingClientRect()
    let svg = d3.select(this.refs.container).append('svg')
      .attr('width', width)
      .attr('height', height)

    this.width = width - margin.left - margin.right
    this.height = height - margin.top - margin.bottom

    this.chart = svg.append('g')
      .classed('chart', true)
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    this.draw()
  }

  componentDidUpdate() {
    this.draw()
  }

  draw() {
    if (!this.props.counts) return

    let x = d3.scale.linear()
      .domain(this.props.extents)
      .range([0, this.width])

    let y = d3.scale.linear()
      .domain([0, d3.max(this.props.counts, d => d.count)])
      .range([0, this.height])

    let genders = d3.nest()
      .key(d => d.gender)
      .entries(this.props.counts)

    let h = horizon()
      .defined(d => d.count)
      .x(d => x(d.year))
      .y(d => y(d.count))
      .width(this.width)
      .height(this.height)
      .bands(2)
      .colors(['hsla(0, 0%, 0%, .1)'])

    let genderGroups = this.chart.selectAll('g.gender').data(genders)
    genderGroups
      .enter().append('g')
        .attr('class', d => `gender ${d.key}`)

    genderGroups.data(genders.map(d => {
      // fill in gaps
      let counts = [], i = 0
      for (let y = this.props.extents[0]; y <= this.props.extents[1]; y++) {
        if (d.values[i] && d.values[i].year == y) {
          counts.push(d.values[i++])
        } else {
          counts.push({ year: y })
        }
      }
      return counts
    })).call(h)
  }
}

export default HorizonChart