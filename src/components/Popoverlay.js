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

    this.state = { isVisible: false, value: 0 };
  }

  onChange(value) {
    this.setState({ value: value });
  }

  render() {
    const sources = this.props.social.getSources();
    const sourceIDs = this.props.sourceIDs;

    let images = [
      "../images/A_Specimen_by_William_Caslon.jpg",
      "../images/800px-Gutenberg_Bible.jpg",
      "../images/Brunel_letter_GWR.jpg",
    ];

    // Create a carousel of images, read back the image selected with callback
    // {sourceID: img} object

    let carousel = <ImageCarousel images={images} onChange={this.onChange} />;

    let sourceDesc = sourceIDs.map((id) => {
      // TODO - scans of documents - small database of these?
      const source = sources.get(id);
      return (
        <div key={id}>
          <div className={styles.imageSection}>
            <ImageCarousel images={images} />
          </div>
          <div className={styles.header}>{source.getName()}</div>
          <div className={styles.body}>{source.getDescription()}</div>
        </div>
      );
    });

    return (
      <Overlay toggleOverlay={this.props.toggleOverlay}>
        <div className={styles.container}>
          <div className={styles.body}>{carousel}</div>
        </div>
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
