
import React from 'react';

import ForceGraphD3 from './d3/ForceGraph.d3.js';

import styles from './ForceGraph.module.css';

class ForceGraph extends React.Component {
  constructor(props){
    super(props);
    this.graph = new ForceGraphD3();

    this.state = {"width": 600,
                  "height": 400};

    this.updateSize = this.updateSize.bind(this);
  }

  componentDidMount(){
    window.addEventListener('resize', this.updateSize);
    this.setState({"width": this.container.offsetWidth,
                   "height": this.container.offsetHeight});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  componentDidUpdate(){
    this.graph.setState(this.state);
    this.graph.update(this.props);
    this.graph.draw();
  }

  updateSize(){
    if (this.container){
      this.setState({
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      });
    }
  }

  render(){
    let s = `${styles.graph} ${this.graph.className()}`;

    return <div ref={el => (this.container = el)}
                style={{width:"100%", height:"100%"}}>
             <div className={s} />
           </div>;
  }
}

export default ForceGraph;
