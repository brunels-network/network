import React from "react";
import Graph from "react-graph-vis";

const fast_physics = {
  enabled: true,
  timestep: 0.5,
};

const slow_physics = {...fast_physics};
slow_physics.timestep = 0.1;

const options = {
  height: "200px",
  width: "200px",
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
      width: 0,
      height: 0,
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
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

  handleResize(params){
    // need to do this or else the network is rendered off-screen!
    let network = this.state.network;
    network.fit();
  }

  render(){
    let graph = this.props.graph;
    let my_options = {...options};

    // seem to need to do this so that the network will auto-scale
    // as the screen is redrawn
    my_options["height"] = `${0.9*this.state.height}px`;
    my_options["width"] = `${0.95*this.state.width}px`;

    if (graph){
      let events = {click: (params) => {this.handleClick(params)},
                    resize: (params) => {this.handleResize(params)}};

      return (<div>
              <Graph graph={{nodes:graph.nodes.get(),
                             edges:graph.edges.get()}}
                     options={my_options}
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
