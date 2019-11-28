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

class MultiGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      network: {},
    };
  }

  handleClick(params) {
    let getClickedData = this.props.getClickedData;

    if (getClickedData)
    {
      let graph = this.props.graph;

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
    let network = this.state.network;
    let graph = this.props.graph;

    const view_position = network.getViewPosition();
    const view_scale = network.getScale();

    network.setOptions( { physics: false } );

    let positions = network.getPositions();

    let new_graph = graph;

    let data = {};

    let filters = ["director", "investor", "unknown", null];

    var filter = filters[Math.floor(Math.random() * filters.length)];

    const nodesFilter = node => {
      if (node.group == "brunel"){ return true;}
      if (filter){
        return node.group == filter;
      }
      else{
        return true;
      }
    };

    const nodesView = new vis.DataView(graph.nodes, { filter:nodesFilter} );
    const edgesView = new vis.DataView(graph.edges);

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
