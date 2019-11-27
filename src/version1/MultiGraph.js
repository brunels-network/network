import React from "react";
import Graph from "react-graph-vis";

class MultiGraph extends Graph {
  constructor(props) {
    super(props);
    this.graphs = props.graphs;
    this.current_graph = 0;
    this.slow_physics = props.slow_physics;
    this.fast_physics = props.fast_physics;
  }

  onClick(){
    let current_graph = this.current_graph;
    let graphs = this.graphs;

    current_graph += 1;

    if (current_graph > graphs.length-1)
    {
      current_graph = 0;
    }

    const view_position = this.Network.getViewPosition();
    const view_scale = this.Network.getScale();

    this.Network.setOptions( { physics: false } );

    let positions = this.Network.getPositions();

    this.Network.setData(graphs[current_graph]);

    for (const [key, value] of Object.entries(positions))
    {
      this.Network.moveNode(key, value.x, value.y);
    }

    this.Network.moveTo({position:view_position, scale:view_scale});

    setTimeout(function()
               {
                   this.Network.setOptions({physics: this.slow_physics})
               }.bind(this), 100 );

    setTimeout(function()
               {
                 this.Network.setOptions({physics: this.fast_physics})
               }.bind(this), 350 );

    this.current_graph = current_graph;
 }

  render(){
    return (<div>
              <button className='graph-buttton'
                      onClick={() => {this.onClick()}}>
                Click Me!
              </button>
              {super.render()}
            </div>);
  }
};

export default MultiGraph;
