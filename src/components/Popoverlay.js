import PropTypes from "prop-types";
import React from "react";

import Overlay from "./Overlay.js";
import ImageCarousel from "./ImageCarousel";

import styles from "./Popoverlay.module.css";
import tempImage from "../images/A_Specimen_by_William_Caslon.jpg";

class Popoverlay extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.getElemCodes = this.getElemCodes.bind(this);

    this.state = { isVisible: false, currentImage: 0, elemCodes: null };
  }

  onChange(imageID) {
    this.setState({ currentImage: imageID });
  }

  getElemCodes(codes) {
    this.setState({ elemCodes: codes });
  }

  render() {
    const sources = this.props.social.getSources();
    const sourceIDs = this.props.sourceIDs;

    let imgs = [
      "../images/A_Specimen_by_William_Caslon.jpg",
      "../images/800px-Gutenberg_Bible.jpg",
      "../images/Brunel_letter_GWR.jpg",
    ];

    let i = 0;
    let firstCode;
    let images = {};

    for (const id of sourceIDs) {
      images[id] = imgs[i];

      if (i === 0) firstCode = id;

      i++;
    }

    console.log("In popoverlay... ", images);

    // Update the description and header shown
    // const currentCode = this.state.elemCodes[this.state.currentImage];
    let source = sources.get(firstCode);

    return (
      <Overlay toggleOverlay={this.props.toggleOverlay}>
        <div className={styles.container}>
          <div className={styles.header}>{source.getName()}</div>
          <div className={styles.imageSection}>
            <ImageCarousel images={images} onChange={this.onChange} getElemCodes={this.getElemCodes} />
          </div>
          <div className={styles.body}>{source.getDescription()}</div>
        </div>
      </Overlay>
    );
  }
}

Popoverlay.propTypes = {
  social: PropTypes.object.isRequired,
  sourceIDs: PropTypes.array.isRequired,
  toggleOverlay: PropTypes.func.isRequired,
  //   images: PropTypes.object.isRequired,
};

export default Popoverlay;
