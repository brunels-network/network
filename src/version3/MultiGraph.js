import React from "react";
import Graph from "react-graph-vis";

class MultiGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphs: props.graphs,
      current_graph: 0,
      slow_physics: props.slow_physics,
      fast_physics: props.fast_physics,
      options: props.options,
      network: {},
    };
  }

  onClick(){
    let current_graph = this.state.current_graph;
    let graphs = this.state.graphs;
    let network = this.state.network;
    let fast_physics = this.state.fast_physics;
    let slow_physics = this.state.slow_physics;

    current_graph += 1;

    if (current_graph > graphs.length-1)
    {
      current_graph = 0;
    }

    const view_position = network.getViewPosition();
    const view_scale = network.getScale();

    network.setOptions( { physics: false } );

    let positions = network.getPositions();

    network.setData(graphs[current_graph]);

    for (const [key, value] of Object.entries(positions))
    {
      network.moveNode(key, value.x, value.y);
    }

    network.moveTo({position:view_position, scale:view_scale});

    setTimeout(function()
               {network.setOptions({physics: slow_physics})}, 100 );

    setTimeout(function()
               {network.setOptions({physics: fast_physics})}, 350 );

    this.setState({current_graph: current_graph});
  }

  render(){
    let graph = this.state.graphs[0];
    let events = {};

    return (<div>
              <button className='graph-buttton'
                      onClick={() => {this.onClick()}}>
                Click Me!
              </button>
              <Graph graph={graph}
                     options={this.state.options}
                     events={events}
                     getNetwork={network =>
                                  this.setState({network:network})} />
            </div>);
  }
};

export default MultiGraph;
