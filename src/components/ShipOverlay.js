import PropTypes from "prop-types";
import React from "react";

import ReactMarkdown from 'react-markdown'

import VBox from "./VBox";

import styles from "./ShipOverlay.module.css";

function ShipOverlay(props) {
  let social = props.social;

  const ship = social.get(props.ship);

  let markdown = social.getProjectText(ship);

  if (!markdown) {
    markdown = "Not available";
  }

  let filename = social.getImage(ship);

  if (!filename) {
    filename = "images/Great_Western_maiden_voyage.jpg";
  }

  return (
    <div className={styles.container} onClick={props.close}>
      <div className={styles.closeButton}>
        <button onClick={props.close} style={{ background: "none", border: "none", fontSize: "2vh" }}>
          x
        </button>
      </div>
      <div className={styles.content}>
        <img className={styles.image} data-testid="bioImage"
               src={require(`../${filename}`)} alt="A ship" />
        <div className={styles.markdown}><ReactMarkdown source={markdown} /></div>
      </div>
    </div>
  );
}

ShipOverlay.propTypes = {
  social: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  ship: PropTypes.string.isRequired,
};

export default ShipOverlay;
