import PropTypes from "prop-types";
import React from "react";
import Carousel from "@brainhubeu/react-carousel";

import Overlay from "./Overlay.js";

import styles from "./Popoverlay.module.css";
import "@brainhubeu/react-carousel/lib/style.css";

import imageFilenames from "../data/imageFilenames.json";

class Popoverlay extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = { isVisible: false, currentImage: 0, elemCodes: null, imageElements: null };

    const sources = this.props.sources;

    let i = 0;
    this.state.elemCodes = [];
    this.state.imageElements = [];
    // Create the elements from the IDs
    for (const id of this.props.sourceIDs) {
      const sourceName = sources.get(id).getName();
      const filename = imageFilenames[sourceName];

      this.state.imageElements.push(<img key={id} src={require(`../images/${filename}`)} alt="Manuscript" />);
      this.state.elemCodes[i] = id;
    }
  }

  onChange(imageID) {
    this.setState({ currentImage: imageID });
  }

  render() {
    const sources = this.props.sources;
    const person = this.props.person;

    const sourceID = this.state.elemCodes[this.state.currentImage];

    let showArrors = this.state.elemCodes > 1 ? true : false;

    const source = sources.get(sourceID);

    return (
      <Overlay toggleOverlay={this.props.toggleOverlay}>
        <div className={styles.container}>
          <div className={styles.header}>
            {person.getName()}
            <br />
            Source ID: {source.getName()}
          </div>
          <div className={styles.imageSection}>
            <Carousel value={this.state.currentImage} onChange={this.onChange} slidesPerPage={1} arrows={showArrors}>
              {this.state.imageElements}
            </Carousel>
          </div>
          <div className={styles.body}>{source.getDescription()}</div>
        </div>
      </Overlay>
    );
  }
}

Popoverlay.propTypes = {
  sources: PropTypes.object.isRequired,
  sourceIDs: PropTypes.array.isRequired,
  toggleOverlay: PropTypes.func.isRequired,
  person: PropTypes.object.isRequired,
};

export default Popoverlay;
