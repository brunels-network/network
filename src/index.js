import React from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";

const people = ["John", "James", "Jane", "Janet", "Jason"];

const graphs = [
  {
    nodes: [
      { id: people[0], label: people[0], title: "{people[0]} tootip text" },
      { id: people[1], label: people[1], title: "node 2 tootip text" },
      { id: people[2], label: people[2], title: "node 3 tootip text" },
      { id: people[3], label: people[3], title: "node 4 tootip text" },
      { id: people[4], label: people[4], title: "node 5 tootip text" }
    ],
    edges: [
      { from: people[0], to: people[1] },
      { from: people[1], to: people[2] },
      { from: people[2], to: people[3] },
      { from: people[3], to: people[4] }
    ]
  },
  {
    nodes: [
      { id: people[0], label: people[0], title: "node 1 tootip text" },
      { id: people[1], label: people[1], title: "node 2 tootip text" },
      { id: people[2], label: people[2], title: "node 2 tootip text" },
      { id: people[3], label: people[3], title: "node 2 tootip text" },
      { id: people[4], label: people[4], title: "node 2 tootip text" },
    ],
    edges: [
      { from: people[0], to: people[3] },
      { from: people[2], to: people[4] },
      { from: people[1], to: people[2] }
    ]
  },
  {
    nodes: [
      { id: people[0], label: people[0], title: "node 1 tootip text" },
      { id: people[1], label: people[1], title: "node 1 tootip text" },
      { id: people[2], label: people[2], title: "node 1 tootip text" },
      { id: people[3], label: people[3], title: "node 1 tootip text" },
      { id: people[4], label: people[4], title: "node 1 tootip text" },
    ],
    edges: [
      { from: people[0], to: people[3], dashes: true, color: "red", smooth: {"type": "curvedCW"}},
      { from: people[3], to: people[0], width: 4.0, color: "blue", smooth: {"type": "curvedCW"}},
      { from: people[0], to: people[4], dashes: true, color: "red" },
      { from: people[1], to: people[2] }
    ]
  }
];

const fast_physics = {
  enabled: true,
  barnesHut: {
    gravitationalConstant: -50,
    centralGravity: 0.0,
    springLength: 50,
    springConstant: 0.02,
    damping: 0.2,
    avoidOverlap: 0.5
  },
  maxVelocity: 30,
  minVelocity: 0.2,
  solver: 'barnesHut',
  stabilization: {
    enabled: true,
    iterations: 100,
    updateInterval: 10,
    onlyDynamicEdges: false,
    fit: true
  },
  timestep: 0.5,
  adaptiveTimestep: true
};

const slow_physics = {...fast_physics};
slow_physics.timestep = 0.1;

const options = {
  height: "500px",
  width: "100%",
  layout:{
    randomSeed: 42,
  },
  manipulation:{
    enabled: true,
    initiallyActive: true,
  },
  interaction:{
    navigationButtons: true,
  },
  edges:{
    shadow: true,
    smooth: {
      enabled: true,
      type: "continuous",
      roundness: 0.3,
    },
    width: 0.5,
  },
  physics: fast_physics,
};

const events = {
  select: function(event) {
    var { nodes, edges } = event;
    console.log(nodes);
    console.log(edges);
  }
};

class MultiGraph extends Graph {
  constructor(props) {
    super(props);
    this.graphs = props.graphs;
    this.current_graph = 0;
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
                   this.Network.setOptions({physics: slow_physics})
               }.bind(this), 100 );

    setTimeout(function()
               {
                 this.Network.setOptions({physics: fast_physics})
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

function App() {

  return (
      <MultiGraph
        graph={graphs[0]}
        graphs={graphs}
        options={options}
        events={events}
        getNetwork={network => {
          //  if you want access to vis.js network api you
          //  can set the state in a parent component using
          //  this property
        }}
      />
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

