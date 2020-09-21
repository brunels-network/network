import PropTypes from "prop-types";
import React from "react";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import imageFilenames from "../data/entityImageFilenames.json";

import TextButton from "./TextButton";

//import HBox from "./HBox";
import VBox from "./VBox";
//import BigBox from "./BigBox";

import styles from "./BioOverlay.module.css";

function BioOverlay(props) {
  let social = props.social;

  const person = social.get(props.person);
  const id = person.getID();
  const name = person.getName();
  const biographies = props.social.getBiographies();

  // Get biography and strip name
  let bio = biographies.getByID(id);

  if (!bio) {
    bio = "No biography found.";
  }

  bio = bio.replace(name + ". ", "");

  let sources = [];

  Object.keys(person.getSources()).forEach((key) => {
    person.getSources()[key].forEach((item) => {
      let source = social.get(item);

      if (source) {
        sources.push(source);
      }
    });
  });

  let source_tab = null;

  if (sources.length > 0) {
    let tab_titles = [];
    let tab_panels = [];

    sources.forEach((source) => {
      tab_titles.push(<Tab>{source.getName()}</Tab>);
      tab_panels.push(
        <TabPanel>
          <div>{source.getDescription()}</div>
        </TabPanel>
      );
    });

    source_tab = (
      <Tabs>
        <TabList>{tab_titles}</TabList>
        {tab_panels}
      </Tabs>
    );
  } else {
    source_tab = <div>No sources</div>;
  }

  //console.log(person.getPositions());
  //console.log(person.getAffiliations());

  const filename = imageFilenames[id]["filename"];
  let image = (
    <VBox>
      <img data-testid="bioImage" key={id} src={require(`../images/${filename}`)} alt="A ship" />
      <div>Image description</div>
    </VBox>
  );

  return (
    <div className={styles.container}>
      <div className={styles.closeButton}>
        <button onClick={props.close} style={{ background: "none", border: "none", fontSize: "2vh" }}>
          x
        </button>
      </div>
      <VBox>
        <div class={styles.name}>{person.getName()}</div>

        <Tabs>
          <TabList>
            <Tab>Biography</Tab>
            <Tab>Image</Tab>
            <Tab>Sources</Tab>
          </TabList>

          <TabPanel>
            <div class={styles.bio}>{bio}</div>
          </TabPanel>

          <TabPanel>{image}</TabPanel>

          <TabPanel>{source_tab}</TabPanel>
        </Tabs>
      </VBox>
    </div>
  );
}

BioOverlay.propTypes = {
  social: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  person: PropTypes.string.isRequired,
  emitShowSource: PropTypes.func.isRequired,
};

export default BioOverlay;
