import React from "react";
import PropTypes from "prop-types";

import styles from "./Popover.module.css";

import tempImage from "../images/Great_Western_maiden_voyage.jpg";

// The detection of outside clicks in this class taken from
// https://stackoverflow.com/a/42234988

class Popover extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.state = { isPopoverOpen: false, lastID: null };
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
      this.props.togglePopover(this.props.node);
    }
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
    const projectSources = personalSources[selectedShipID];

    // console.log("Project sources : ", projectSources);
    let sources = [];
    if (!projectSources) {
      console.error("Cannot find sources for this project : ", selectedShipID, "\n Sources : ", sources);
      sources = null;
    } else {
      for (const id of projectSources) {
        const source = socialSources.get(id);
        sources.push(source.getName());
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
          <div className={styles.sourceSection}>{sources.join(", ")}</div>
        </div>
      </div>
    );
  }
}

Popover.propTypes = {
  social: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

export default Popover;
