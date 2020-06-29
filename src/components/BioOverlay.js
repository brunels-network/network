import PropTypes from "prop-types";
import React from "react";

import imageFilenames from "../data/entityImageFilenames.json";

import TextButton from "./TextButton";
import Linkify from "react-linkify";

import styles from "./BioOverlay.module.css";

class BioOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isVisible: false };
  }

  render() {
    const person = this.props.person;
    const id = person.getID();
    const name = person.getName();
    const biographies = this.props.social.getBiographies();

    // Get biography and strip name
    let bio = biographies.getByID(id);

    if (!bio) {
      bio = "No biography found.";
    }

    bio = bio.replace(name + ". ", "");

    const filename = imageFilenames[id]["filename"];

    let sourceButton = (
      <TextButton
        textColor="black"
        hoverColor="#808080"
        fontSize="1.8vh"
        padding="0px 4px 4px 4px"
        onClick={this.props.toggleSourceOverlay}
      >
        {this.props.sourceButtonText}
      </TextButton>
    );

    return (
      <div data-testid="bioOverlay" className={styles.container}>
        <div className={styles.closeButton}>
          <button onClick={this.props.toggleOverlay} style={{ background: "none", border: "none", fontSize: "2vh" }}>
            x
          </button>
        </div>
        <div className={styles.nameHeader}>{person.getName()}</div>
        <div className={styles.positions}>{}</div>
        <div className={styles.bio}>
          <Linkify>{bio}</Linkify>
        </div>
        <div className={styles.sources}>
          <div className={styles.sourcesHeader}>
            Sources
            <br />
            <br />
            <br />
          </div>
          <div>{sourceButton}</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.imageSection}>
          <div>
            <img data-testid="bioImage" key={id} src={require(`../images/${filename}`)} alt="A ship" />
          </div>
          <div className={styles.imageDescription}>Image description</div>
        </div>
      </div>
    );
  }
}

BioOverlay.propTypes = {
  social: PropTypes.object.isRequired,
  toggleOverlay: PropTypes.func.isRequired,
  person: PropTypes.object.isRequired,
  toggleSourceOverlay: PropTypes.func.isRequired,
  sourceButtonText: PropTypes.string.isRequired,
};

export default BioOverlay;
