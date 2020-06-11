import PropTypes from "prop-types";
import React from "react";

import styles from "./AboutOverlay.module.css";

import aboutText from "../data/aboutText.json";

class AboutOverlay extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.header}>About</div>
          <div className={styles.intro}>{aboutText["intro"]}</div>
          <div className={styles.introBody}>
            <p>{aboutText["introParaOne"]}</p>
            <br></br>
            <p>{aboutText["introParaTwo"]}</p>
          </div>
          <div className={styles.sectionHeader}>{aboutText["methodHeader"]}</div>
          <div className={styles.body}>
            <p>{aboutText["methodParaOne"]}</p>
            <br></br>
            <p>{aboutText["methodParaTwo"]}</p>
          </div>
          <div className={styles.sectionHeader}>{aboutText["sourcesHeader"]}</div>
          <div className={styles.body}>
            <p>{aboutText["sourcesParaOne"]}</p>
            <br></br>
            <p>{aboutText["sourcesParaTwo"]}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default AboutOverlay;
