import PropTypes from "prop-types";
import React, { Component } from "react";
import Carousel from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";

class ImageCarousel extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      value: 0,
    };
  }

  getImages() {
    const imageList = this.props.images;

    let imageElements = imageList.map((i, index) => {
      const desc = "some description";
      const key = index + "_" + i.replace(/^.*[\\/]/, "");

      return <img key={key} src={i} alt={desc} />;
    });

    return imageElements;
  }

  onChange(value) {
    this.setState({ value: value });
  }

  render() {
    return (
      <Carousel value={this.state.value} onChange={this.onChange} slidesPerPage={1} arrows>
        <img src={require("../images/A_Specimen_by_William_Caslon.jpg")} alt="1tow" />
        <img src={require("../images/800px-Gutenberg_Bible.jpg")} alt="1tow" />
        <img src={require("../images/Brunel_letter_GWR.jpg")} alt="1tow" />
      </Carousel>
    );
  }
}

export default ImageCarousel;

ImageCarousel.propTypes = {
  images: PropTypes.any,
};
