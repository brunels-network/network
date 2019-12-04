import React from "react";
import { Container, Row, Col } from 'reactstrap';

import Dry from 'json-dry';
import SocialGraph from "./SocialGraph";
import InfoBox from "./InfoBox";

import graph_data from './data.json';
import Social from './Social';
import Person from './Person';
import Business from './Business';
import Message from './Message';

class SocialApp extends React.Component {
  constructor(props){
    super(props);

    let title = "Isambard's Social Network";
    let image = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Robert_Howlett_-_Isambard_Kingdom_Brunel_and_the_launching_chains_of_the_Great_Eastern_-_Google_Art_Project.jpg/256px-Robert_Howlett_-_Isambard_Kingdom_Brunel_and_the_launching_chains_of_the_Great_Eastern_-_Google_Art_Project.jpg";
    let text = "This is an interactive viewer of Isambard Kingdom Brunel's social network. Please click on the nodes and have fun!";

    let social = Dry.parse(graph_data);
    if (!(social instanceof Social )){
      console.log("Could not parse!");
      console.log(social);
      social = new Social();
    }

    this.state = {
      default_data: {"title": title, "image": image, "text": text},
      infobox_data: {"title": title, "image": image, "text": text},
      social: social,
      graph: social.getGraph(),
    };

    this.slotClicked = this.slotClicked.bind(this);
  }

  showInfo(item){
    let newdata = {...this.state.infobox_data};

    if (item instanceof Person){
      newdata.title = "Person";
      newdata.text = item.getName();
      newdata.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Illustrirte_Zeitung_%281843%29_21_332_1_Das_vom_Stapellaufen_des_Great-Britain.PNG/640px-Illustrirte_Zeitung_%281843%29_21_332_1_Das_vom_Stapellaufen_des_Great-Britain.PNG";
    }
    else if (item instanceof Business){
      newdata.title = "Business";
      newdata.text = item.getName();
      newdata.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/SS_Great_Britain_diagram.jpg/320px-SS_Great_Britain_diagram.jpg";
    }
    else if (item instanceof Message){
      newdata.title = "Message";

      let sender = item.getSender();
      if (sender.getName){
        let node = sender;
        sender = <button href="#" onClick={()=>this.showInfo(node)}>
                    {sender.getName()}
                 </button>;
      }

      let receiver = item.getReceiver();
      if (receiver.getName){
        let node = receiver;
        receiver = <button href="#" onClick={()=>this.showInfo(node)}>
                     {receiver.getName()}
                   </button>;
      }

      newdata.text = <span>Message from {sender} to {receiver}</span>;
      newdata.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/SS_Great_Britain_transverse_section.jpg/320px-SS_Great_Britain_transverse_section.jpg";
    }

    this.setState({infobox_data:newdata});
  }

  slotClicked(id){
    if (!id){
      return;
    }

    const social = this.state.social;

    const item = social.get(id);

    this.showInfo(item);
  }

  render(){
    let data = this.state.infobox_data;

    return (
      <div>
        <Container>
          <Row>
            <Col>
              <SocialGraph graph={this.state.graph}
                           emitClicked={(id)=>this.slotClicked(id)} />
            </Col>
            <Col xs="4">
              <InfoBox title={data.title}
                       image={data.image}
                       text={data.text} />
            </Col>
          </Row>
          <Row>
            <Col>
              <p align="center">
                See the source <a href="https://github.com/chryswoods/brunel">on GitHub</a>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
};

export default SocialApp;
