import PropTypes from "prop-types";
import React from "react";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import imageFilenames from "../data/entityImageFilenames.json";

import TextButton from "./TextButton";

//import HBox from "./HBox";
import VBox from "./VBox";
//import BigBox from "./BigBox";

import styles from "./ShipOverlay.module.css";

function ShipOverlay(props) {
  let social = props.social;

  const ship = social.get(props.ship);

  return (
    <div className={styles.container}>
      <div className={styles.closeButton}>
        <button onClick={props.close} style={{ background: "none", border: "none", fontSize: "2vh" }}>
          x
        </button>
      </div>
      <VBox>
        <div className={styles.name}>{ship.getName()}</div>
        <div>{ship.getDescription()}</div>
      </VBox>
    </div>
  );
}

ShipOverlay.propTypes = {
  social: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  ship: PropTypes.string.isRequired,
};

export default ShipOverlay;
