import React from "react";
import PropTypes from "prop-types";

import TextButton from "./TextButton";
import Popoverlay from "./Popoverlay";

import styles from "./Popover.module.css";

import tempImage from "../images/Great_Western_maiden_voyage.jpg";

// The detection of outside clicks in this class taken from
// https://stackoverflow.com/a/42234988

class Popover extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.toggleOverlay = this.toggleOverlay.bind(this);

    this.state = { isOverlayOpen: false };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      console.log("Click outside");
      this.props.clearPopups();
    }
  }

  toggleOverlay() {
    console.log("Toggling isOverlayOpen");
    this.setState({ isOverlayOpen: !this.state.isOverlayOpen });
  }

  createOverlay(sourceIDs) {
    let overlay = null;

    if (this.state.isOverlayOpen) {
      overlay = <Popoverlay social={this.props.social} sourceIDs={sourceIDs} toggleOverlay={this.toggleOverlay} />;
    }

    return overlay;
  }

  render() {
    const node = this.props.node;
    const selectedShipID = this.props.selectedShipID;
    // The position of the popup
    const left = node.x + 10 + "px";
    const top = node.y - 10 + "px";

    const name = node.label;

    const social = this.props.social;
    const socialSources = social.getSources();

    // Sources this person was found in
    const personalSources = this.props.social.getPeople().get(node.id).getSources();
    const sourceIDs = personalSources[selectedShipID];

    let sources = [];
    if (!sourceIDs) {
      console.error("Cannot find sources for this project : ", selectedShipID, "\n Sources : ", sources);
      sources.push("");
    } else {
      for (const id of sourceIDs) {
        const source = socialSources.get(id);

        let button = (
          <TextButton key={id} textColor="black" hoverColor="#808080" fontSize="1vh" onClick={this.toggleOverlay}>
            {source.getName()}
          </TextButton>
        );

        sources.push(button);
      }
    }

    // Get biography for node
    let bio = social.getBiographies().getByID(node.id);
    bio = bio.replace(name + ".  ", "");

    return (
      <div ref={this.setWrapperRef}>
        <div className={styles.popOver} style={{ top: top, left: left }}>
          <div className={styles.imageSection}>
            <img src={tempImage} alt="SS Great Western's maiden voyage" />
          </div>
          <div className={styles.header}>{name}</div>
          <div className={styles.bioSection}>{bio}</div>
          <div className={styles.header}>Sources</div>
          <div className={styles.sourceSection}>{sources}</div>
        </div>
        {this.createOverlay(sourceIDs)}
      </div>
    );
  }
}

Popover.propTypes = {
  social: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
  selectedShipID: PropTypes.string,
  clearPopups: PropTypes.func.isRequired,
};

export default Popover;
