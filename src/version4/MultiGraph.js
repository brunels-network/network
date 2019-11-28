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

    this.state = {
      current_graph: 0,
      network: {},
    };
  }

  handleClick(params) {
    let getClickedData = this.props.getClickedData;

    if (getClickedData)
    {
      let graph = this.props.graphs[0];

      let data = {};

      if (params.nodes.length > 0)
      {
        let node = graph.nodes.get(params.nodes[0]);
        data["title"] = node.title;
        data["text"] = JSON.stringify(node);
        data["image"] = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Illustrirte_Zeitung_%281843%29_21_332_1_Das_vom_Stapellaufen_des_Great-Britain.PNG/640px-Illustrirte_Zeitung_%281843%29_21_332_1_Das_vom_Stapellaufen_des_Great-Britain.PNG";
      }
      else if (params.edges.length > 0)
      {
        let edge = graph.edges.get(params.edges[0]);
        data["title"] = "EDGE";
        data["text"] = JSON.stringify(edge);
        data["image"] = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/SS_Great_Britain_transverse_section.jpg/320px-SS_Great_Britain_transverse_section.jpg";
      }

      getClickedData(data);
    }
  }

  onClick(){
    let current_graph = this.state.current_graph;
    let network = this.state.network;

    let graphs = this.props.graphs;

    current_graph += 1;

    if (current_graph > graphs.length-1)
    {
      current_graph = 0;
    }

    const view_position = network.getViewPosition();
    const view_scale = network.getScale();

    network.setOptions( { physics: false } );

    let positions = network.getPositions();

    let new_graph = graphs[current_graph];

    let data = {};

    if (new_graph.nodes.length > 0){
      data["nodes"] = new_graph.nodes.get();
    }
    else{
      data["nodes"] = [];
    }

    if (new_graph.edges.length > 0){
      data["edges"] = new_graph.edges.get();
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

    this.setState({current_graph: current_graph});
  }

  render(){
    let graph = this.props.graphs[0];

    if (graph){
      let events = {click: (params) => {this.handleClick(params)}};

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
    else{
      return (<div>No data to display!!!</div>);
    }
  }
};

export default MultiGraph;
