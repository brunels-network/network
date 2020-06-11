import PropTypes from "prop-types";
import React from "react";
import { CSSTransition } from "react-transition-group";

import TextButton from "./TextButton";
import ImageCarousel from "./ImageCarousel";
import styles from "./AboutOverlay.module.css";

import aboutText from "../data/aboutText.json";
import aboutImages from "../data/aboutImages.json";

class AboutOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };

    let imageElements = [];
    for (const [key, filename] of Object.entries(aboutImages)) {
      imageElements.push(<img key={key} src={require(`../images/${filename}`)}></img>);
    }

    this.state.imageElements = imageElements;
  }

  render() {
    let carousel = <ImageCarousel>{this.state.imageElements}</ImageCarousel>;

    return (
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.header}>About</div>
          <div className={styles.intro}>{aboutText["intro"]}</div>
          <div className={styles.introBody}>{aboutText["introBody"]}</div>
          <div className={styles.methodHeader}>{aboutText["methodHeader"]}</div>
          <div className={styles.body}>{aboutText["body"]}</div>
        </div>
      </div>
    );
  }
}

export default AboutOverlay;
