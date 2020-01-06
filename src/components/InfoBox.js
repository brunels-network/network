import React from "react";

import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';

import GroupsList from './GroupsList';
import ConnectionList from './ConnectionList';

import Social from '../model/Social';
import Person from '../model/Person';
import Business from '../model/Business';
import Connection from '../model/Connection';

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
  let pages = [];
  let affiliations = [];
  let positions = [];
  let connections = [];

  try{
    connections = social.getConnectionsTo(item);
  }
  catch(error){
    connections = null;
  }

  if (item.getAffiliations){
    affiliations = item.getAffiliations();
  }

  if (item.getPositions){
    positions = item.getPositions();
  }

  let alive = null;

  if (item.getAlive){
    let a = item.getAlive();
    if (a){
      alive = <p>
                They were alive from&nbsp;
                {a.getStartString()}&nbsp;
                until {a.getEndString()}.
              </p>;
    }
  }

  let bio = null;

  try{
    bio = social.getBiographies().get(item);
  }
  catch(error){
    bio = null;
  }

  pages.push(["Biography",
              (<div>
                 {bio}
                 {alive}
               </div>)]);

  if (connections.length > 0){
    pages.push(["Connections", <ConnectionList connections={connections}
                                               emitClicked={emitClicked}/>]);
  }
  else{
    pages.push(["Connections", "None"]);
  }

  if (positions.length > 0){
    pages.push(["Positions",
                <div>
                  <GroupsList groups={positions}
                                      emitClicked={emitSelected}/>
                  <p>
                    Note that all times are made up for testing
                    purposes!
                  </p>
                </div>]);
  }
  else{
    pages.push(["Positions", "None"]);
  }

  if (affiliations.length > 0){
    pages.push(["Affiliations",
                <div>
                  <GroupsList groups={affiliations}
                                      emitClicked={emitSelected}/>
                </div>]);
}
  else{
    pages.push(["Affiliations", "None"]);
  }

  pages.push(["Analysis",
              <div>Here is space for graphs and analysis of {item.getName()}</div>]);

  return pages;
}

function extractData({item, social, emitClicked=null_function,
                      emitSelected=null_function}){
  let data = {title:default_title, image:default_image,
              pages:[["Title", default_text]]};

  if (!(social instanceof Social)){
    return data;
  }

  //refresh the item in case of updates...
  if (item.getID){
    item = item.getID();
  }

  try{
    item = social.get(item);
  }
  catch(error){
    item = null;
  }

  if (!item){
    return data;
  }

  if (item instanceof Person){
    data.title = <button href="#" className={styles.button}
                         onClick={()=>{emitSelected(item);}}>
                  {item.getName()}
                 </button>
    data.pages = getBiography({item:item, social:social,
                               emitClicked:emitClicked,
                               emitSelected:emitSelected});
    data.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Illustrirte_Zeitung_%281843%29_21_332_1_Das_vom_Stapellaufen_des_Great-Britain.PNG/640px-Illustrirte_Zeitung_%281843%29_21_332_1_Das_vom_Stapellaufen_des_Great-Britain.PNG";
  }
  else if (item instanceof Business){
    data.title = <button href="#" className={styles.button}
                         onClick={()=>{emitSelected(item);}}>
                  {item.getName()}
                 </button>
    data.pages = getBiography({item:item, social:social,
                               emitClicked:emitClicked,
                               emitSelected:emitSelected});
    data.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/SS_Great_Britain_diagram.jpg/320px-SS_Great_Britain_diagram.jpg";
  }
  else if (item instanceof Connection){
    data.title = null;

    let n0 = item.getNode0();
    if (n0.getName){
      let node = n0;
      n0 = <button href="#" onClick={()=>{emitClicked(node)}}
                  className={styles.button}>
                  {n0.getName()}
               </button>;
    }

    let n1 = item.getNode1();
    if (n1.getName){
      let node = n1;
      n1 = <button href="#" onClick={()=>{emitClicked(node)}}
                   className={styles.button}>
                   {n1.getName()}
                 </button>;
    }

    let pages = [];
    pages.push(["Connection",
               <div style={{textAlign:"center"}}>
                 <div>From</div>
                 {n0}
                 <div>to</div>
                 {n1}
               </div>]);

    pages.push(["Source", "Space to see the original source for this Connection"]);
    pages.push(["Analysis", "Space for analysis of this Connection"]);

    data.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/SS_Great_Britain_transverse_section.jpg/320px-SS_Great_Britain_transverse_section.jpg";

    data.pages = pages;
  }

  return data;
}

function InfoBox(props) {
  let data = {};

  try{
    data = extractData(props);
  }
  catch(error){
    data = {title:default_title, image:default_image,
            pages:[["Title", default_text]]};
  }

  const pages = data.pages;

  if (pages.length > 1){
    let tabs = [];
    let panes = [];

    for (let i=0; i<pages.length; ++i){
      panes.push(<TabPanel key={pages[i][0]} tabId={pages[i][0]} className={styles.tabPanel}>
                   {pages[i][1]}
                 </TabPanel>);
      tabs.push(<Tab key={pages[i][0]} className={styles.tab} tabFor={pages[i][0]}>{pages[i][0]}</Tab>);
    }

    return (
      <div className={styles.container}>
        <img className={styles.heroImage} alt="" src={data.image}/>
        <div className={styles.title}>{data.title}</div>
        <Tabs
          key={panes.length}
          vertical
          onChange={(tabId) => { console.log(tabId) }}
          className={styles.tabs}
        >
          <TabList className={styles.tablist}>
            {tabs}
          </TabList>
          {panes}
        </Tabs>
      </div>
    );
  }
  else{
    return (
      <div className={styles.container}>
        <img className={styles.heroImage} alt="" src={data.image}/>
        <div className={styles.title}>{data.title}</div>
        {pages[0][1]}
      </div>
    );
  }
};

export default InfoBox;
