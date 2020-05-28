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

    this.onChange = this.onChange.bind(this);

    this.state = { isVisible: false, currentImage: 0, elemCodes: [], imageElements: [] };

    const sources = this.props.sources;

    this.state.imageElements = this.props.sourceIDs.map((id) => {
      const sourceName = sources.get(id).getName();
      const filename = imageFilenames[sourceName];

      this.state.elemCodes.push(id);

      return <img key={id} src={require(`../images/${filename}`)} alt="Manuscript" />;
    });

    console.log(this.state.imageElements);
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
      <Overlay toggleOverlay={this.props.toggleOverlay}>
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
