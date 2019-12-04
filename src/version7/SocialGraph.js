import React from "react";
import Graph from "react-graph-vis";
import vis from "vis-network";

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

class SocialGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      network: {},
    };
  }

  handleClick(params) {
    let emitClicked = this.props.emitClicked;

    if (emitClicked)
    {
      let graph = this.props.graph;

      let id = null;

      if (params.nodes.length > 0)
      {
        let node = graph.nodes.get(params.nodes[0]);
        id = node.id;
      }
      else if (params.edges.length > 0)
      {
        let edge = graph.edges.get(params.edges[0]);
        id = edge.id;
      }

      emitClicked(id);
    }
  }

  onClick(){
    let network = this.state.network;
    let graph = this.props.graph;

    const view_position = network.getViewPosition();
    const view_scale = network.getScale();

    network.setOptions( { physics: false } );

    let positions = network.getPositions();

    let data = {};

    let filters = ["director", "investor", "unknown", null];

    var filter = filters[Math.floor(Math.random() * filters.length)];

    const nodesFilter = node => {
      if (node.group === "brunel"){ return true;}
      if (filter){
        return node.group === filter;
      }
      else{
        return true;
      }
    };

    const edgesFilter = edge => {
      return true;
    };

    const nodesView = new vis.DataView(graph.nodes, { filter:nodesFilter} );
    const edgesView = new vis.DataView(graph.edges, { filter:edgesFilter} );

    if (nodesView.length > 0){
      data["nodes"] = nodesView.get();
    }
    else{
      data["nodes"] = [];
    }

    if (edgesView.length > 0){
      data["edges"] = edgesView.get();
    }
    else {
      data["edges"] = [];
    }

    network.setData(data);

    for (const [key, value] of Object.entries(positions))
    {
      network.moveNode(key, value.x, value.y);
    }

    network.moveTo({position:view_position, scale:view_scale});

    setTimeout(function()
               {network.setOptions({physics: slow_physics})}, 100 );

    setTimeout(function()
               {network.setOptions({physics: fast_physics})}, 350 );
  }

  render(){
    let graph = this.props.graph;

    if (graph){
      let events = {click: (params) => {this.handleClick(params)}};

      return (<div>
              <Graph graph={{nodes:graph.nodes.get(),
                             edges:graph.edges.get()}}
                     options={options}
                     events={events}
                     getNetwork={network =>
                                  this.setState({network:network})} />
            </div>);
    }
    else{
      return (<div>No data to display!!!</div>);
    }
  }
};

export default SocialGraph;
