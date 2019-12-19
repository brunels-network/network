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
      dimensions: {height:300, width:600},
    };
  }

  componentDidMount() {
    if (!this.container){
      console.log("resize without container?");
    }

    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight,
      },
    });
    window.addEventListener('resize', ()=>{this.updateSize()});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', ()=>{this.updateSize()});
  }

  updateSize() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight,
      }
    });
  }

  getGraph(){
    const social = this.props.social;

    if (social){
      return social.getGraph();
    }
    else{
      return null;
    }
  }

  getNetwork(){
    const social = this.props.social;

    if (social){
      return social.getNetwork();
    }
    else{
      return null;
    }
  }

  setNetwork(network){
    let social = this.props.social;

    if (social){
      social.setNetwork(network);
    }
  }

  handleClick(params) {
    let emitClicked = this.props.emitClicked;

    if (emitClicked)
    {
      let graph = this.props.social.getGraph();

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
    let network = this.getNetwork();
    if (network){
      network.fit();
    }
  }

  render(){
    let graph = this.getGraph();
    let my_options = {...options};

    // seem to need to do this so that the network will auto-scale
    // as the screen is redrawn
    my_options["height"] = `${this.state.dimensions.height}px`;
    my_options["width"] = `${this.state.dimensions.width}px`;

    if (graph){
      let events = {click: (params) => {this.handleClick(params)},
                    resize: (params) => {this.handleResize(params)}};

      // need to enclose in a div that is set to take up 100% of the parent
      // space and that holds a reference so that we can resize the
      // graph as the parent resizes
      return (<div ref={el => (this.container = el)}
                   style={{width:"100%", height:"100%"}}>
                <Graph
                     graph={{nodes:graph.nodes.get(),
                             edges:graph.edges.get()}}
                     options={my_options}
                     events={events}
                     getNetwork={(network)=>{
                                  this.setNetwork(network)}}/>
              </div>
             );
    }
    else{
      return (<div ref={el => (this.container = el)}>
                No data to display!!!
              </div>);
    }
  }
};

export default SocialGraph;
