import PropTypes from "prop-types";
import React, { Component } from "react";
import Carousel from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";

import imagePaths from "../data/correspondence.json";

class ImageCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.currentImage,
      elemCodes: null,
    };
  }

  onChange(value) {
    this.props.onChange(value);
    this.props.getElemCodes(this.state.elemCodes);
  }

  render() {
    const images = this.props.images;

    let imageElements = [];

    let elemCodes = {};
    let i = 0;

    for (const [id, path] of Object.entries(images)) {
      const imagePath = imagePaths[id];
      imageElements.push(<img key={i} src={imagePath} alt="Manuscript" />);
      elemCodes[i] = id;
      i++;
    }

    if (!this.state.elemCodes) {
      this.setState({ elemCodes: elemCodes });
    }

    return (
      <Carousel value={this.state.value} onChange={this.onChange} slidesPerPage={1} arrows>
        {imageElements}
      </Carousel>
    );
  }
}

export default ImageCarousel;

ImageCarousel.propTypes = {
  getElemCodes: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  images: PropTypes.object.isRequired,
  currentImage: PropTypes.number.isRequired,
};
