import React from "react";

import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";

import { Accordion, AccordionItem, AccordionTitle, AccordionPanel } from "./Accordion";

import GroupsList from "./GroupsList";
import ConnectionList from "./ConnectionList";
import SourceList from "./SourceList";
import WeightsList from "./WeightsList";
import DateRangeButton from "./DateRangeButton";
import DefaultButton from "./DefaultButton";

import Social from "../model/Social";

import styles from "./InfoBox.module.css";

import default_image from "../images/RHowlett_IKB.jpg";
import person_image from "../images/IllustriteZeitung_SS_GreatBritain.png";
import business_image from "../images/320px-SS_Great_Britain_diagram.jpg";
import source_image from "../images/Sumerian_26th_c_Adab.jpg";
import analysis_image from "../images/320px-SS_Great_Britain_transverse_section.jpg";

let default_title = "Isambard's Social Network";

let default_text = (
  <div>
    This is an interactive viewer of Isambard Kingdom Brunel&apos;s social network. Please click in the nodes and have
    fun!
  </div>
);

function null_function() {}

function getBiography({ item, social, emitSelected = null_function, emitToggleFilter = null_function }) {
  let pages = [];
  let affiliations = {};
  let positions = {};
  let sources = {};
  let connections = [];

  try {
    connections = social.getConnectionsTo(item);
  } catch (error) {
    console.log(`CONNECTIONS ERROR ${error}`);
  }

  if (item.getAffiliations) {
    affiliations = item.getAffiliations();
  }

  if (item.getPositions) {
    positions = item.getPositions();
  }

  if (item.getSources) {
    sources = item.getSources();
  }

  let alive = null;

  if (item.getAlive) {
    let a = item.getAlive();
    if (a) {
      alive = (
        <p>
          They were alive from&nbsp;
          {a.getStartString()}&nbsp; until {a.getEndString()}.
        </p>
      );
    }
  }

  let bio = null;

  try {
    bio = social.getBiographies().get(item);
  } catch (error) {
    bio = null;
  }

  pages.push([
    "Biography",
    <div key="biography">
      <div>{bio}</div>
      <div>{alive}</div>
    </div>,
  ]);

  if (connections.length > 0) {
    pages.push([
      "Connections",
      <div key="connections">
        <ConnectionList
          connections={connections}
          emitSelected={emitSelected}
          emitToggleFilter={emitToggleFilter}
          social={social}
        />
      </div>,
    ]);
  } else {
    pages.push(["Connections", "None"]);
  }

  if (Object.keys(positions).length > 0) {
    pages.push([
      "Positions",
      <div key="positions">
        <GroupsList
          groups={positions}
          emitSelected={emitSelected}
          emitToggleFilter={emitToggleFilter}
          social={social}
        />
      </div>,
    ]);
  } else {
    pages.push(["Positions", "None"]);
  }

  if (Object.keys(affiliations).length > 0) {
    pages.push([
      "Affiliations",
      <div key="affiliations">
        <GroupsList
          groups={affiliations}
          emitSelected={emitSelected}
          emitToggleFilter={emitToggleFilter}
          social={social}
        />
      </div>,
    ]);
  } else {
    pages.push(["Affiliations", "None"]);
  }

  if (Object.keys(sources).length > 0) {
    pages.push([
      "Sources",
      <div key="sources">
        <GroupsList groups={sources} emitSelected={emitSelected} emitToggleFilter={emitToggleFilter} social={social} />
      </div>,
    ]);
  }

  pages.push(["Analysis", <div key="analysis">Here is space for graphs and analysis of {item.getName()}</div>]);

  return pages;
}

function extractData({ item, social, emitSelected = null_function, emitToggleFilter = null_function }) {
  let data = {
    title: default_title,
    image: default_image,
    pages: [["Title", default_text]],
  };

  if (!(social instanceof Social)) {
    return data;
  }

  if (!item) {
    return data;
  }

  //refresh the item in case of updates...
  if (item.getID) {
    item = item.getID();
  }

  try {
    item = social.get(item);
  } catch (error) {
    item = null;
  }

  if (!item) {
    return data;
  }

  if (item._isAPersonObject) {
    data.title = (
      <DefaultButton
        onClick={() => {
          emitToggleFilter(item);
        }}
      >
        {item.getName()}
      </DefaultButton>
    );
    data.pages = getBiography({
      item: item,
      social: social,
      emitSelected: emitSelected,
      emitToggleFilter: emitToggleFilter,
    });

    data.image = person_image;
  } else if (item._isABusinessObject) {
    data.title = (
      <DefaultButton
        onClick={() => {
          emitToggleFilter(item);
        }}
      >
        {item.getName()}
      </DefaultButton>
    );
    data.pages = getBiography({
      item: item,
      social: social,
      emitSelected: emitSelected,
      emitToggleFilter: emitToggleFilter,
    });

    data.image = business_image;
  } else if (item._isASourceObject) {
    data.title = item.getName();
    let description = item.getDescription();
    if (!description) {
      description = "No description";
    }
    data.pages = [
      ["Description", description],
      ["Analysis", "Analysis for this source - where else has it been cited?"],
    ];
    data.image = source_image;
  } else if (item._isAConnectionObject) {
    data.title = null;

    let n0 = item.getNode0();
    if (n0.getName) {
      let node = n0;
      n0 = (
        <DefaultButton
          onClick={() => {
            emitSelected(node);
          }}
        >
          {n0.getName()}
        </DefaultButton>
      );
    }

    let n1 = item.getNode1();
    if (n1.getName) {
      let node = n1;
      n1 = (
        <DefaultButton
          onClick={() => {
            emitSelected(node);
          }}
        >
          {n1.getName()}
        </DefaultButton>
      );
    }

    let asources = item.getAffiliationSources();
    let csources = item.getCorrespondanceSources();
    let duration = item.getDuration();

    if (duration) {
      duration = (
        <div>
          <div>during</div>
          <DateRangeButton value={duration} emitSelected={emitSelected} />
        </div>
      );
    }

    if (asources) {
      asources = (
        <AccordionItem uuid="asources">
          <AccordionTitle>Affiliation</AccordionTitle>
          <AccordionPanel>
            <SourceList social={social} sources={asources} emitSelected={emitSelected} />
          </AccordionPanel>
        </AccordionItem>
      );
    }

    if (csources) {
      csources = (
        <AccordionItem uuid="csources">
          <AccordionTitle>Correspondance</AccordionTitle>
          <AccordionPanel>
            <SourceList social={social} sources={csources} emitSelected={emitSelected} />
          </AccordionPanel>
        </AccordionItem>
      );
    }

    let accordion = null;

    if (asources || csources) {
      accordion = (
        <Accordion allowMultipleExpanded={true} allowZeroExpanded={true} preExpanded={["asources", "csources"]}>
          {asources}
          {csources}
        </Accordion>
      );
    }

    let pages = [];
    pages.push([
      "Connection",
      <div key="connection" style={{ textAlign: "center" }}>
        {n0}
        <div>||</div>
        {n1}
        <div>&nbsp;</div>
        <div>{duration}</div>
      </div>,
    ]);

    pages.push(["Sources", <div key="sources">{accordion}</div>]);

    pages.push([
      "Projects",
      <WeightsList
        key="projects"
        weights={item.getWeights()}
        type={item.getType()}
        social={social}
        emitSelected={emitSelected}
        emitToggleFilter={emitToggleFilter}
      />,
    ]);

    pages.push(["Analysis", "Space for analysis of this Connection"]);

    data.image = analysis_image;

    data.pages = pages;
  }

  return data;
}

function InfoBox(props) {
  let data = {};

  try {
    data = extractData(props);
  } catch (error) {
    data = {
      title: default_title,
      image: default_image,
      pages: [["Title", default_text]],
    };
    console.log(`ERROR ${error}`);
  }

  const pages = data.pages;

  if (pages.length > 1) {
    let tabs = [];
    let panes = [];

    for (let i = 0; i < pages.length; ++i) {
      panes.push(
        <TabPanel key={pages[i][0]} tabId={pages[i][0]} className={styles.tabPanel}>
          {pages[i][1]}
        </TabPanel>
      );
      tabs.push(
        <Tab key={pages[i][0]} className={styles.tab} tabFor={pages[i][0]}>
          {pages[i][0]}
        </Tab>
      );
    }

    return (
      <div className={styles.container}>
        <img className={styles.heroImage} alt="" src={data.image} />
        <div className={styles.title}>{data.title}</div>
        <Tabs
          key={panes.length}
          vertical
          onChange={(tabId) => {
            console.log(tabId);
          }}
          defaultTab={pages[0][0]}
          className={styles.tabs}
        >
          <TabList className={styles.tablist}>{tabs}</TabList>
          {panes}
        </Tabs>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <img className={styles.heroImage} alt="" src={data.image} />
        <div className={styles.title}>{data.title}</div>
        {pages[0][1]}
      </div>
    );
  }
}

export default InfoBox;
