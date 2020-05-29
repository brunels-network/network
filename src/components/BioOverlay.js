import PropTypes from "prop-types";
import React from "react";

import imageFilenames from "../data/peopleImageFilenames.json";

import styles from "./BioOverlay.module.css";

class BioOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isVisible: false };
  }

  render() {
    // const sources = this.props.sources;
    const person = this.props.person;
    const id = person.getID();
    const name = person.getName();
    const biographies = this.props.social.getBiographies();

    // Get biography and strip name
    let bio = biographies.getByID(id);
    bio = bio.replace(name + ". ", "");

    console.log(imageFilenames);

    const filename = imageFilenames[id]["filename"];

    // const filename = "The_Steamer_Great_Western_of_Bristol_RMG_A7626.jpg";

    return (
      <div className={styles.container}>
        <div className={styles.nameHeader}>{person.getName()}</div>
        <div className={styles.positions}>{}</div>
        <div className={styles.bio}>{bio}</div>
        <div className={styles.sources}>
          <div className={styles.dynamicHeader}>
            Sources
            <br />
            <br />
            <br />
          </div>
          <div>{this.props.sourceButton}</div>
        </div>
        <div className={styles.imageSection}>
          <div>
            <img key={id} src={require(`../images/${filename}`)} alt="Manuscript" />
          </div>
          <div className={styles.imageDescription}>Image description</div>
        </div>
      </div>
    );
  }
}

BioOverlay.propTypes = {
  social: PropTypes.object.isRequired,
  sourceButton: PropTypes.element.isRequired,
  toggleOverlay: PropTypes.func.isRequired,
  person: PropTypes.object.isRequired,
};

export default BioOverlay;
