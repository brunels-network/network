import PropTypes from "prop-types";
import React, { Component } from "react";
import Carousel from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleDoubleLeft, faAngleDoubleRight, faAngleRight } from "@fortawesome/free-solid-svg-icons";

class ImageCarousel extends Component {
  render() {
    return (
      <Carousel
        slidesPerPage={1}
        arrowLeft={<FontAwesomeIcon icon={faAngleDoubleLeft} />}
        arrowLeftDisabled={<FontAwesomeIcon icon={faAngleLeft} />}
        arrowRight={<FontAwesomeIcon icon={faAngleDoubleRight} />}
        arrowRightDisabled={<FontAwesomeIcon icon={faAngleRight} />}
        addArrowClickHandler
      >
        {this.props.children}
      </Carousel>
    );
  }
}

export default ImageCarousel;

ImageCarousel.propTypes = {
  children: PropTypes.array.isRequired,
};
