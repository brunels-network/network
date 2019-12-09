import React, { Component } from 'react'
import Timeline from 'react-visjs-timeline'

const basicExample = {
  options: {
    start: '2014-04-10',
    end: '2014-04-30',
  },
  items: [
    { id: 1, content: 'item 1', start: '2014-04-20' },
    { id: 2, content: 'item 2', start: '2014-04-14' },
    { id: 3, content: 'item 3', start: '2014-04-18' },
    { id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19' },
    { id: 5, content: 'item 5', start: '2014-04-25' },
    { id: 6, content: 'item 6', start: '2014-04-27', type: 'point' },
  ],
}

class TimeLineBox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedIds: [],
    }
  }

  render() {
    return (
        <Timeline {...basicExample} />
    )
  }
}

export default TimeLineBox
