import PropTypes from "prop-types";
import React from "react";

import Overlay from "./Overlay.js";

import styles from "./Popoverlay.module.css";
import tempImage from "../images/A_Specimen_by_William_Caslon.jpg";

class Popoverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isVisible: false };
  }

  render() {
    const sources = this.props.social.getSources();
    const sourceIDs = this.props.sourceIDs;

    let sourceDesc = sourceIDs.map((id) => {
      // TODO - scans of documents - small database of these?
      const source = sources.get(id);
      return (
        <div key={id}>
          <div className={styles.imageSection}>
            <img src={tempImage} alt="Scan of A Specimen by William Caslon, 1728"></img>
          </div>
          <div className={styles.header}>{source.getName()}</div>
          <div className={styles.body}>{source.getDescription()}</div>
        </div>
      );
    });

    return (
      <Overlay toggleOverlay={this.props.toggleOverlay}>
        <div className={styles.container}>{sourceDesc}</div>
      </Overlay>
    );
  }
}

Popoverlay.propTypes = {
  social: PropTypes.object.isRequired,
  sourceIDs: PropTypes.array.isRequired,
  toggleOverlay: PropTypes.func.isRequired,
};

export default Popoverlay;
