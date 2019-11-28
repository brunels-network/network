import React from "react";
import Graph from "react-graph-vis";

const fast_physics = {
  enabled: true,
  timestep: 0.5,
};

const slow_physics = {...fast_physics};
slow_physics.timestep = 0.1;

const options = {
  height: "600px",
  width: "100%",
  layout:{
    randomSeed: 42,
  },
  manipulation:{
    enabled: false,
    initiallyActive: false,
  },
  interaction:{
    navigationButtons: true,
  },
  edges:{
    shadow: false,
    smooth: {
      enabled: true,
      type: "continuous",
      roundness: 0.3,
    },
    width: 0.5,
  },
  physics: fast_physics,
};

class MultiGraph extends React.Component {
  constructor(props) {
    super(props);

    let events = {click: (params) => {this.handleClick(params)},
                 };

    this.state = {
      graphs: props.graphs,
      current_graph: 0,
      slow_physics: slow_physics,
      fast_physics: fast_physics,
      options: options,
      events: events,
      getClickedData: props.getClickedData,
      network: {},
    };
  }

  handleClick(params) {
    let getClickedData = this.state.getClickedData;

    if (getClickedData)
    {
      let graph = this.state.graphs[0];

      let data = {};

      if (params.nodes.length > 0)
      {
        let node = graph.nodes.get(params.nodes[0]);
        data["title"] = node.title;
        data["text"] = JSON.stringify(node);
      }
      else if (params.edges.length > 0)
      {
        let edge = graph.edges.get(params.edges[0]);
        data["title"] = "EDGE";
        data["text"] = JSON.stringify(edge);
      }

      getClickedData(data);
    }
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
    let events = this.state.events;
    let options = this.state.options;

    return (<div>
              <Graph graph={{nodes:graph.nodes.get(),
                             edges:graph.edges.get()}}
                     options={options}
                     events={events}
                     getNetwork={network =>
                                  this.setState({network:network})} />
              <button className='graph-buttton'
                      onClick={() => {this.onClick()}}>
                Click Me!
              </button>
            </div>);
  }
};

export default MultiGraph;
