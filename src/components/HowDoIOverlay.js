import PropTypes from "prop-types";
import React from "react";

import ReactMarkdown from 'react-markdown'

import styles from "./HowDoIOverlay.module.css";

function HowDoIOverlay(props) {
  let social = props.social;

  let markdown = social.getHelpText();

  if (!markdown) {
    markdown = "Not available";
  }

  let filename = "images/ships/Great_Britain.jpg";

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
        <div className={styles.markdown}><ReactMarkdown>{markdown}</ReactMarkdown></div>
      </div>
    </div>
  );
}

HowDoIOverlay.propTypes = {
  social: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
};

export default HowDoIOverlay;
