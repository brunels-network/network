import React from "react";
import { Card, CardHeader, CardBody, CardImg } from 'reactstrap';

import GroupsList from './GroupsList';
import ConnectionList from './ConnectionList';

import Social from '../model/Social';
import Person from '../model/Person';
import Business from '../model/Business';
import Message from '../model/Message';

import styles from './InfoBox.module.css';

let default_title = "Isambard's Social Network";
let default_image = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Robert_Howlett_-_Isambard_Kingdom_Brunel_and_the_launching_chains_of_the_Great_Eastern_-_Google_Art_Project.jpg/256px-Robert_Howlett_-_Isambard_Kingdom_Brunel_and_the_launching_chains_of_the_Great_Eastern_-_Google_Art_Project.jpg";
let default_text = <div>
                      This is an interactive viewer of Isambard Kingdom Brunel's
                      social network. Please click in the nodes and have fun!
                    </div>;

function null_function(item){}

function getBiography({item, social, emitClicked=null_function,
                       emitSelected=null_function}){
  let name = "unknown";
  let affiliations = [];
  let positions = [];
  let connections = social.getConnectionsTo(item);

  if (item.getAffiliations){
    let a = item.getAffiliations();
    for (let val in a){
      affiliations.push(a[val][0]);
    }
  }

  if (item.getPositions){
    let p = item.getPositions();
    for (let val in p){
      positions.push(p[val][0]);
    }
  }

  if (item.getName){
    name = item.getName();
  }

  return (
    <div>
      <button href="#" className={styles.button}
              onClick={()=>{emitSelected(item);}}>
        {name}
      </button>
      <GroupsList title="Affiliations"
                  groups={affiliations}
                  emitClicked={emitSelected}/>
      <GroupsList title="Positions"
                  groups={positions}
                  emitClicked={emitSelected}/>
      <ConnectionList title="Connections"
                connections={connections}
                emitClicked={emitClicked}/>
    </div>
  );
}

function extractData({item, social, emitClicked=null_function,
                      emitSelected=null_function}){
  let data = {title:default_title, text:default_text, image:default_image};

  if (!(social instanceof Social)){
    return data;
  }

  if (item instanceof Person){
    data.title = "Person";
    data.text = getBiography({item:item, social:social,
                              emitClicked:emitClicked,
                              emitSelected:emitSelected});
    data.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Illustrirte_Zeitung_%281843%29_21_332_1_Das_vom_Stapellaufen_des_Great-Britain.PNG/640px-Illustrirte_Zeitung_%281843%29_21_332_1_Das_vom_Stapellaufen_des_Great-Britain.PNG";
  }
  else if (item instanceof Business){
    data.title = "Business";
    data.text = getBiography({item:item, social:social,
                              emitClicked:emitClicked,
                              emitSelected:emitSelected});
    data.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/SS_Great_Britain_diagram.jpg/320px-SS_Great_Britain_diagram.jpg";
  }
  else if (item instanceof Message){
    data.title = "Message";

    let sender = item.getSender();
    if (sender.getName){
      let node = sender;
      sender = <button href="#" onClick={emitClicked(node)}
                  className={styles.controlButton}>
                  {sender.getName()}
               </button>;
    }

    let receiver = item.getReceiver();
    if (receiver.getName){
      let node = receiver;
      receiver = <button href="#" onClick={emitClicked(node)}
                   className={styles.controlButton}>
                   {receiver.getName()}
                 </button>;
    }

    data.text = <span>Message from {sender} to {receiver}</span>;
    data.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/SS_Great_Britain_transverse_section.jpg/320px-SS_Great_Britain_transverse_section.jpg";
  }

  return data;
}

function InfoBox(props) {
  let data = extractData(props);

  return (
    <Card body outline color="secondary" style={{height:"100%", overflowY:"scroll"}}>
        <CardHeader align="center">{data.title}</CardHeader>
        <CardImg top width="100%" src={data.image} />
        <CardBody>
        {data.text}
        </CardBody>
    </Card>
  );
};

export default InfoBox;
