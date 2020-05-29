import PropTypes from "prop-types";
import React from "react";
import Carousel from "@brainhubeu/react-carousel";

import styles from "./SourceOverlay.module.css";
import "@brainhubeu/react-carousel/lib/style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleDoubleLeft, faAngleDoubleRight, faAngleRight } from "@fortawesome/free-solid-svg-icons";

import imageFilenames from "../data/sourceImageFilenames.json";

class SourceOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = { isVisible: false, currentImage: 0, elemCodes: [], imageElements: [] };

    this.state.imageElements = this.props.sourceIDs.map((id) => {
      const filename = imageFilenames[id]["filename"];

      this.state.elemCodes.push(id);

      return <img key={id} src={require(`../images/${filename}`)} alt="Manuscript" />;
    });
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

    return (
      <div className={styles.container}>
        <div className={styles.textSection}>
          <div className={styles.dynamicHeader}>
            {person.getName()}
            <br />
            Source : {source.getName()}
          </div>
          <div className={styles.body}>{source.getDescription()}</div>
        </div>
        <div className={styles.imageSection}>
          <Carousel
            value={this.state.currentImage}
            onChange={this.onChange}
            slidesPerPage={1}
            arrows={showArrows}
            arrowLeft={<FontAwesomeIcon icon={faAngleDoubleLeft} />}
            arrowLeftDisabled={<FontAwesomeIcon icon={faAngleLeft} />}
            arrowRight={<FontAwesomeIcon icon={faAngleDoubleRight} />}
            arrowRightDisabled={<FontAwesomeIcon icon={faAngleRight} />}
            addArrowClickHandler
          >
            {this.state.imageElements}
          </Carousel>
        </div>
      </div>
    );
  }
}

SourceOverlay.propTypes = {
  sources: PropTypes.object.isRequired,
  sourceIDs: PropTypes.array.isRequired,
  toggleOverlay: PropTypes.func.isRequired,
  person: PropTypes.object.isRequired,
};

export default SourceOverlay;
