import React from "react";
import MultiGraph from "./MultiGraph";
import {
  Container, Row, Col,
  Card, CardImg, CardText, CardHeader, CardBody, CardLink,
  CardTitle, CardSubtitle, CardFooter
} from 'reactstrap';

import graph_data from './data.json';

const fast_physics = {};
const slow_physics = {...fast_physics};

const options = {
  height: "450px",
  width: "100%",
};

const events = {
  select: function(event) {
    var { nodes, edges } = event;
    console.log(nodes);
    console.log(edges);
  }
};

function GraphLoader(props){
  let graph2 = {"nodes": graph_data.nodes, "edges": []};

  let graphs = [graph_data, graph2];

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
