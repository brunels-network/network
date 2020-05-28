import PropTypes from "prop-types";
import React from "react";
import Carousel from "@brainhubeu/react-carousel";

import Overlay from "./Overlay";

import styles from "./Popoverlay.module.css";
import "@brainhubeu/react-carousel/lib/style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleDoubleLeft, faAngleDoubleRight, faAngleRight } from "@fortawesome/free-solid-svg-icons";

import imageFilenames from "../data/imageFilenames.json";

class Popoverlay extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange(imageID) {
    this.setState({ currentImage: imageID });
  }

  render() {
    const sources = this.props.sources;
    const person = this.props.person;

    let showArrows = this.state.elemCodes.length > 1 ? true : false;

    const sourceID = this.state.elemCodes[this.state.currentImage];
    const source = sources.get(sourceID);

    return <Overlay toggleOverlay={this.props.toggleOverlay}>{this.props.children}</Overlay>;
  }
}

Popoverlay.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Popoverlay;
