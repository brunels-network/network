import React from "react";
import MultiGraph from "./MultiGraph";
import {
  Container, Row, Col,
  Card, CardImg, CardText, CardHeader, CardBody, CardLink,
  CardTitle, CardSubtitle, CardFooter
} from 'reactstrap';

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
  height: "450px",
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

function GraphLoader(props){
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Card><CardHeader align="center">A Great Britain's Social Network</CardHeader></Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card body outline color="secondary" style={{height:"550px"}}>
              <CardBody>
                <MultiGraph
                  graph={graphs[0]}
                  graphs={graphs}
                  options={options}
                  events={events}
                  slow_physics={slow_physics}
                  fast_physics={fast_physics}
                  getNetwork={network => {
                    //  if you want access to vis.js network api you
                    //  can set the state in a parent component using
                    //  this property
                  }}
                />
              </CardBody>
            </Card>
          </Col>
          <Col xs="4">
            <Card body outline color="secondary" style={{height:"550px"}}>
              <CardHeader align="center">Isambard Kingdom Brunel</CardHeader>
              <p>Imagine this is a picture!</p>
              <CardBody>
                <CardText>
                  Information about Brunel. This could be a long description
                  giving some background and information. Maybe also show
                  the dates and times of change etc...
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardTitle align="center">See the source <a href="https://github.com/chryswoods/brunel">on GitHub</a></CardTitle>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default GraphLoader;
