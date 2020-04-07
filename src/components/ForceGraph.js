
import React from 'react';

import ForceGraphD3 from './d3/ForceGraph.d3.js';

import styles from './ForceGraph.module.css';

class ForceGraph extends React.Component {
  constructor(props){
    super(props);

    this._graph = new ForceGraphD3(props);
    this._updateSize = this._updateSize.bind(this);
  }

  componentDidMount(){
    window.addEventListener('resize', this._updateSize);
    this._updateSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  componentDidUpdate(){
    this._graph.update(this.props);
    this._graph.draw();
  }

  _updateSize(){
    if (this.container && this._graph){
      this._graph.update({width: this.container.offsetWidth,
                          height: this.container.offsetHeight});
      this._graph.draw();
    }
  }

  render(){
    let s = `${styles.graph} ${this._graph.className()}`;

    return (
    //   <div className={styles.testgraph}>
        <div
          ref={(el) => (this.container = el)}
          style={{ width: "100%", height: "100%" }}
        >
          <div className={s} />
        </div>
    //   </div>
    );
  }
}

export default ForceGraph;
