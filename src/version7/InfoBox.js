import React from "react";
import { Card, CardText, CardHeader, CardBody, CardImg } from 'reactstrap';

function InfoBox(props) {
  return (
    <Card body outline color="secondary" style={{height:"600px"}}>
        <CardHeader align="center">{props.title}</CardHeader>
        <CardImg top width="100%" src={props.image} />
        <CardBody>
        {props.text}
        </CardBody>
    </Card>
  );
};

export default InfoBox;
